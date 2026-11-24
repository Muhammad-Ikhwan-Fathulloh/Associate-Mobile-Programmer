import 'package:flutter/material.dart';

import '../data/entri_repository.dart';
import '../models/entri.dart';
import '../services/lokasi.dart';

class FormEntri extends StatefulWidget {
  const FormEntri({super.key, this.id});

  /// Null untuk entri baru. Berisi id untuk mengubah entri yang ada.
  final int? id;

  @override
  State<FormEntri> createState() => _FormEntriState();
}

class _FormEntriState extends State<FormEntri> {
  final _repo = EntriRepository();
  final _judul = TextEditingController();
  final _catatan = TextEditingController();
  String _kategori = kategoriEntri.first;
  double? _lat;
  double? _lon;
  String? _pesan;
  bool _sibuk = false;

  @override
  void initState() {
    super.initState();
    final id = widget.id;
    if (id != null) {
      _repo.ambilSatu(id).then((e) {
        if (e == null || !mounted) return;
        setState(() {
          _judul.text = e.judul;
          _catatan.text = e.catatan;
          _kategori = e.kategori;
          _lat = e.latitude;
          _lon = e.longitude;
        });
      });
    }
  }

  @override
  void dispose() {
    _judul.dispose();
    _catatan.dispose();
    super.dispose();
  }

  Future<void> _sertakanLokasi() async {
    setState(() => _sibuk = true);
    final hasil = await ambilLokasi();
    setState(() {
      _sibuk = false;
      _lat = hasil.latitude;
      _lon = hasil.longitude;
      _pesan = hasil.ok ? 'Lokasi didapat.' : hasil.pesan;
    });
  }

  Future<void> _simpan() async {
    final galat = validasiJudul(_judul.text);
    if (galat != null) return setState(() => _pesan = galat);
    // Entri tetap bisa disimpan tanpa koordinat bila lokasi gagal.
    await _repo.simpan(
      Entri(judul: _judul.text, catatan: _catatan.text, kategori: _kategori, latitude: _lat, longitude: _lon, updatedAt: 0),
      id: widget.id,
    );
    if (mounted) Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.id == null ? 'Entri Baru' : 'Ubah Entri')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(controller: _judul, maxLength: 100, decoration: const InputDecoration(labelText: 'Judul')),
          TextField(controller: _catatan, maxLines: 4, decoration: const InputDecoration(labelText: 'Catatan perjalanan')),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            initialValue: _kategori,
            decoration: const InputDecoration(labelText: 'Kategori'),
            items: [for (final k in kategoriEntri) DropdownMenuItem(value: k, child: Text(k))],
            onChanged: (v) => setState(() => _kategori = v ?? _kategori),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: _sibuk ? null : _sertakanLokasi,
            icon: const Icon(Icons.my_location),
            label: Text(_sibuk ? 'Mencari lokasi...' : 'Sertakan lokasi saya'),
          ),
          const SizedBox(height: 8),
          Text(_lat != null && _lon != null
              ? 'Koordinat: ${_lat!.toStringAsFixed(5)}, ${_lon!.toStringAsFixed(5)}'
              : 'Belum ada koordinat.'),
          if (_pesan != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(_pesan!)),
          const SizedBox(height: 16),
          FilledButton(onPressed: _simpan, child: const Text('Simpan')),
        ],
      ),
    );
  }
}
