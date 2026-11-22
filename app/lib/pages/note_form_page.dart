import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../models/note.dart';
import '../services/location_service.dart';

class NoteFormPage extends StatefulWidget {
  const NoteFormPage({super.key});

  @override
  State<NoteFormPage> createState() => _NoteFormPageState();
}

class _NoteFormPageState extends State<NoteFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _judul = TextEditingController();
  final _isi = TextEditingController();
  final _location = LocationService();

  double? _latitude;
  double? _longitude;
  bool _mengambilLokasi = false;

  @override
  void dispose() {
    _judul.dispose();
    _isi.dispose();
    super.dispose();
  }

  Future<void> _ambilLokasi() async {
    setState(() => _mengambilLokasi = true);
    try {
      final posisi = await _location.ambilPosisi();
      if (!mounted) return;
      setState(() {
        _latitude = posisi.latitude;
        _longitude = posisi.longitude;
      });
    } on LocationException catch (e) {
      _tampilkanPesan(e.pesan);
    } catch (e) {
      _tampilkanPesan('Gagal mengambil lokasi: $e');
    } finally {
      if (mounted) setState(() => _mengambilLokasi = false);
    }
  }

  void _tampilkanPesan(String pesan) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(pesan)));
  }

  void _simpan() {
    if (!_formKey.currentState!.validate()) return;

    context.pop(
      Note.baru(
        title: _judul.text.trim(),
        content: _isi.text.trim(),
        latitude: _latitude,
        longitude: _longitude,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final lat = _latitude;
    final lon = _longitude;

    return Scaffold(
      appBar: AppBar(title: const Text('Catatan Baru')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _judul,
              decoration: const InputDecoration(
                labelText: 'Judul',
                border: OutlineInputBorder(),
              ),
              validator: (value) => (value == null || value.trim().length < 3)
                  ? 'Judul minimal 3 karakter'
                  : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _isi,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: 'Isi catatan',
                border: OutlineInputBorder(),
              ),
              validator: (value) => (value == null || value.trim().isEmpty)
                  ? 'Isi catatan tidak boleh kosong'
                  : null,
            ),
            const SizedBox(height: 12),
            Card(
              child: ListTile(
                leading: const Icon(Icons.place_outlined),
                title: Text(
                  lat == null || lon == null
                      ? 'Lokasi belum diambil (opsional)'
                      : 'Lokasi: ${lat.toStringAsFixed(5)}, ${lon.toStringAsFixed(5)}',
                ),
              ),
            ),
            const SizedBox(height: 8),
            OutlinedButton.icon(
              onPressed: _mengambilLokasi ? null : _ambilLokasi,
              icon: const Icon(Icons.my_location),
              label: Text(
                _mengambilLokasi ? 'Mengambil lokasi...' : 'Ambil lokasi saat ini',
              ),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _simpan,
              child: const Text('Simpan'),
            ),
          ],
        ),
      ),
    );
  }
}
