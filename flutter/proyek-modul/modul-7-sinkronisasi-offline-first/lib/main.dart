import 'package:flutter/material.dart';

import 'config.dart';
import 'data/catatan_repository.dart';
import 'models/catatan.dart';
import 'services/api_client.dart';
import 'services/sync_service.dart';

void main() => runApp(const AplikasiSinkron());

class AplikasiSinkron extends StatelessWidget {
  const AplikasiSinkron({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sinkronisasi Offline-First',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF1565C0)),
      home: const HalamanCatatan(),
    );
  }
}

class HalamanCatatan extends StatefulWidget {
  const HalamanCatatan({super.key});

  @override
  State<HalamanCatatan> createState() => _HalamanCatatanState();
}

class _HalamanCatatanState extends State<HalamanCatatan> {
  final _repo = CatatanRepository();
  final _api = ApiClient(apiUrl);
  final _judul = TextEditingController();
  final _isi = TextEditingController();

  List<Catatan> _daftar = [];
  String? _pesan;
  bool _sibuk = false;

  @override
  void initState() {
    super.initState();
    _muat();
  }

  @override
  void dispose() {
    _judul.dispose();
    _isi.dispose();
    super.dispose();
  }

  Future<void> _muat() async {
    final daftar = await _repo.ambilSemua();
    if (mounted) setState(() => _daftar = daftar);
  }

  Future<void> _simpan() async {
    final galat = validasiJudul(_judul.text);
    if (galat != null) return setState(() => _pesan = galat);
    await _repo.tambah(_judul.text, _isi.text);
    _judul.clear();
    _isi.clear();
    setState(() => _pesan = null);
    await _muat();
  }

  Future<void> _sinkron() async {
    setState(() => _sibuk = true);
    try {
      final h = await sinkronkan(_repo, _api);
      setState(() => _pesan = 'Selesai: $h.');
      await _muat();
    } catch (e) {
      setState(() => _pesan = 'Sinkron gagal: $e');
    } finally {
      if (mounted) setState(() => _sibuk = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Catatan Offline')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(controller: _judul, maxLength: 100, decoration: const InputDecoration(labelText: 'Judul')),
          TextField(controller: _isi, maxLines: 2, decoration: const InputDecoration(labelText: 'Isi')),
          const SizedBox(height: 8),
          FilledButton(onPressed: _simpan, child: const Text('Simpan offline (Create)')),
          const SizedBox(height: 8),
          OutlinedButton(
            onPressed: _sibuk ? null : _sinkron,
            child: Text(_sibuk ? 'Menyinkronkan...' : 'Sinkronkan ke MockAPI'),
          ),
          if (_pesan != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(_pesan!)),
          for (final c in _daftar)
            Card(
              child: ListTile(
                title: Text(c.title),
                subtitle: Text(c.content.isEmpty ? '(tanpa isi)' : c.content),
                trailing: Chip(label: Text(c.syncStatus == StatusSync.synced ? 'SYNCED' : 'PENDING')),
              ),
            ),
        ],
      ),
    );
  }
}
