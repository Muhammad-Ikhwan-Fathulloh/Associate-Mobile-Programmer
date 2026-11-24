import 'package:flutter/material.dart';

import 'config.dart';
import 'services/api_client.dart';
import 'services/pesan_error.dart';

void main() => runApp(const AplikasiApi());

class AplikasiApi extends StatelessWidget {
  const AplikasiApi({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Klien API Catatan',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF1565C0)),
      home: const HalamanCrud(),
    );
  }
}

class HalamanCrud extends StatefulWidget {
  const HalamanCrud({super.key});

  @override
  State<HalamanCrud> createState() => _HalamanCrudState();
}

class _HalamanCrudState extends State<HalamanCrud> {
  final _api = ApiClient(apiUrl);
  final _judul = TextEditingController();
  final _isi = TextEditingController();

  List<Catatan> _daftar = [];
  String? _editId;
  bool _memuat = false;
  String? _pesan;

  @override
  void initState() {
    super.initState();
    _muatUlang();
  }

  @override
  void dispose() {
    _judul.dispose();
    _isi.dispose();
    super.dispose();
  }

  /// Menjalankan aksi jaringan dengan indikator memuat dan pesan galat yang ramah.
  Future<void> _jalankan(Future<void> Function() aksi) async {
    setState(() {
      _memuat = true;
      _pesan = null;
    });
    try {
      await aksi();
    } catch (e) {
      if (mounted) setState(() => _pesan = pesanRamah(e));
    } finally {
      if (mounted) setState(() => _memuat = false);
    }
  }

  Future<void> _muatUlang() => _jalankan(() async {
        final daftar = await _api.daftar();
        setState(() => _daftar = daftar);
      });

  Future<void> _simpan() async {
    final judul = _judul.text.trim();
    if (judul.isEmpty) return setState(() => _pesan = 'Judul wajib diisi.');
    await _jalankan(() async {
      final c = Catatan(id: _editId ?? '', title: judul, content: _isi.text);
      if (_editId == null) {
        await _api.buat(c);
      } else {
        await _api.ubah(_editId!, c);
      }
      _batalUbah();
      setState(() => _daftar = [] );
      await _muatUlang();
    });
  }

  Future<void> _hapus(String id) => _jalankan(() async {
        await _api.hapus(id);
        await _muatUlang();
      });

  void _pilihUntukUbah(Catatan c) {
    setState(() {
      _editId = c.id;
      _judul.text = c.title;
      _isi.text = c.content;
    });
  }

  void _batalUbah() {
    setState(() {
      _editId = null;
      _judul.clear();
      _isi.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Klien API Catatan')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                children: [
                  TextField(controller: _judul, maxLength: 100, decoration: const InputDecoration(labelText: 'Judul (wajib)')),
                  TextField(controller: _isi, maxLines: 2, decoration: const InputDecoration(labelText: 'Isi')),
                  const SizedBox(height: 8),
                  FilledButton(
                    onPressed: _memuat ? null : _simpan,
                    child: Text(_editId == null ? 'Tambah (Create)' : 'Simpan perubahan (Update)'),
                  ),
                  if (_editId != null) TextButton(onPressed: _batalUbah, child: const Text('Batal ubah')),
                ],
              ),
            ),
          ),
          OutlinedButton(onPressed: _memuat ? null : _muatUlang, child: const Text('Muat ulang (Read)')),
          if (_memuat) const Padding(padding: EdgeInsets.all(12), child: Center(child: CircularProgressIndicator())),
          if (_pesan != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(_pesan!, style: const TextStyle(color: Colors.red))),
          for (final c in _daftar)
            Card(
              child: ListTile(
                title: Text(c.title),
                subtitle: Text(c.content.isEmpty ? '(tanpa isi)' : c.content),
                trailing: Wrap(
                  spacing: 4,
                  children: [
                    IconButton(tooltip: 'Ubah', icon: const Icon(Icons.edit), onPressed: () => _pilihUntukUbah(c)),
                    IconButton(tooltip: 'Hapus', icon: const Icon(Icons.delete_outline), onPressed: () => _hapus(c.id)),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
