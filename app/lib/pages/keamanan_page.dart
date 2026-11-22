import 'package:flutter/material.dart';

import '../services/https_service.dart';
import '../services/secure_storage_service.dart';

class KeamananPage extends StatefulWidget {
  const KeamananPage({super.key});

  @override
  State<KeamananPage> createState() => _KeamananPageState();
}

class _KeamananPageState extends State<KeamananPage> {
  final _storage = SecureStorageService();
  final _https = HttpsService();

  final _tokenController = TextEditingController();
  final _urlController = TextEditingController(
    text: 'https://jsonplaceholder.typicode.com/posts/1',
  );

  String _tokenTersimpan = '(belum ada)';
  String _hasilAmbil = '';
  bool _memuat = false;

  @override
  void initState() {
    super.initState();
    _muatToken();
  }

  @override
  void dispose() {
    _tokenController.dispose();
    _urlController.dispose();
    super.dispose();
  }

  /// Hanya empat karakter terakhir yang ditampilkan agar token tidak terlihat utuh.
  String _samarkan(String nilai) {
    if (nilai.length <= 4) return '****';
    return '${'*' * (nilai.length - 4)}${nilai.substring(nilai.length - 4)}';
  }

  Future<void> _muatToken() async {
    final token = await _storage.ambilToken();
    if (!mounted) return;
    setState(() {
      _tokenTersimpan = token == null ? '(belum ada)' : _samarkan(token);
    });
  }

  Future<void> _simpan() async {
    final teks = _tokenController.text.trim();
    if (teks.isEmpty) {
      _pesan('Token tidak boleh kosong.');
      return;
    }
    await _storage.simpanToken(teks);
    _tokenController.clear();
    await _muatToken();
    _pesan('Token disimpan di secure storage.');
  }

  Future<void> _hapus() async {
    await _storage.hapusToken();
    await _muatToken();
    _pesan('Token dihapus.');
  }

  Future<void> _ambilData() async {
    setState(() {
      _memuat = true;
      _hasilAmbil = '';
    });
    try {
      final data = await _https.ambilJson(_urlController.text);
      final judul = data is Map ? data['title'] : null;
      if (mounted) {
        setState(() => _hasilAmbil = 'Judul: ${judul ?? '-'}');
      }
    } catch (e) {
      if (mounted) {
        setState(() => _hasilAmbil = 'Gagal: $e');
      }
    } finally {
      if (mounted) {
        setState(() => _memuat = false);
      }
    }
  }

  void _pesan(String teks) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(teks)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Keamanan dan HTTPS')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Penyimpanan Token', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          Text('Token tersimpan: $_tokenTersimpan'),
          const SizedBox(height: 12),
          TextField(
            controller: _tokenController,
            obscureText: true,
            decoration: const InputDecoration(
              labelText: 'Token (contoh: abc123xyz)',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              FilledButton(onPressed: _simpan, child: const Text('Simpan')),
              const SizedBox(width: 12),
              OutlinedButton(onPressed: _hapus, child: const Text('Hapus')),
            ],
          ),
          const Divider(height: 40),
          Text('Permintaan HTTPS', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          TextField(
            controller: _urlController,
            keyboardType: TextInputType.url,
            decoration: const InputDecoration(
              labelText: 'URL (harus https://)',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: _memuat ? null : _ambilData,
            child: const Text('Ambil data'),
          ),
          const SizedBox(height: 12),
          if (_memuat) const LinearProgressIndicator(),
          if (_hasilAmbil.isNotEmpty) Text(_hasilAmbil),
        ],
      ),
    );
  }
}
