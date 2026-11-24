import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import 'data/tempat_repository.dart';
import 'models/tempat.dart';
import 'services/distance.dart';
import 'services/lokasi.dart';
import 'services/tempat.dart';

void main() => runApp(const AplikasiTempat());

class AplikasiTempat extends StatelessWidget {
  const AplikasiTempat({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Tempat Favorit',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF1565C0)),
      home: const HalamanTempat(),
    );
  }
}

// Pusat peta bila belum ada posisi: Bandung.
const _pusatAwal = LatLng(-6.9175, 107.6191);

class HalamanTempat extends StatefulWidget {
  const HalamanTempat({super.key});

  @override
  State<HalamanTempat> createState() => _HalamanTempatState();
}

class _HalamanTempatState extends State<HalamanTempat> {
  final _repo = TempatRepository();
  List<Tempat> _daftar = [];
  HasilLokasi? _posisi;
  String? _pesan;
  bool _mencari = false;

  @override
  void initState() {
    super.initState();
    _muat();
  }

  Future<void> _muat() async {
    final daftar = await _repo.ambilTempat();
    if (mounted) setState(() => _daftar = daftar);
  }

  Future<void> _jarakDariSaya() async {
    if (_mencari) return; // tahan tekanan ganda selama posisi dicari
    setState(() {
      _mencari = true;
      _pesan = null;
    });
    final hasil = await ambilLokasi();
    if (!mounted) return;
    setState(() {
      _mencari = false;
      _posisi = hasil.ok ? hasil : null;
      _pesan = hasil.ok ? null : hasil.pesan;
    });
  }

  Future<void> _tambah() async {
    await Navigator.of(context).push(MaterialPageRoute(builder: (_) => const HalamanTambah()));
    await _muat();
  }

  @override
  Widget build(BuildContext context) {
    final posisi = _posisi;
    final urutan = posisi != null
        ? urutkanJarak(_daftar, latitude: posisi.latitude!, longitude: posisi.longitude!)
        : [for (final t in _daftar) TempatBerjarak(t, null)];
    final titikPeta = tempatUntukPeta(_daftar);
    final pusat = posisi != null
        ? LatLng(posisi.latitude!, posisi.longitude!)
        : (titikPeta.isNotEmpty ? LatLng(titikPeta.first.latitude!, titikPeta.first.longitude!) : _pusatAwal);

    return Scaffold(
      appBar: AppBar(title: const Text('Tempat Favorit')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            children: [
              Expanded(child: FilledButton(onPressed: _tambah, child: const Text('Tambah tempat'))),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton(
                  onPressed: _mencari ? null : _jarakDariSaya,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (_mencari) ...[
                        const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)),
                        const SizedBox(width: 8),
                      ],
                      Text(_mencari ? 'Mencari posisi...' : 'Jarak dari saya'),
                    ],
                  ),
                ),
              ),
            ],
          ),
          if (_pesan != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(_pesan!, style: const TextStyle(color: Colors.red))),
          for (final b in urutan)
            Card(
              child: ListTile(
                title: Text(b.tempat.nama),
                subtitle: Text(b.jarakM != null ? formatJarak(b.jarakM!) : 'Tanpa koordinat'),
                trailing: TextButton(
                  onPressed: () async {
                    await _repo.hapus(b.tempat.id!);
                    await _muat();
                  },
                  child: const Text('Hapus'),
                ),
              ),
            ),
          const SizedBox(height: 12),
          SizedBox(
            height: 320,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: FlutterMap(
                options: MapOptions(initialCenter: pusat, initialZoom: 14),
                children: [
                  TileLayer(
                    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'id.contoh.tempatfavorit',
                  ),
                  MarkerLayer(
                    markers: [
                      for (final t in titikPeta)
                        Marker(
                          point: LatLng(t.latitude!, t.longitude!),
                          width: 40,
                          height: 40,
                          child: const Icon(Icons.place, color: Colors.red, size: 36),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class HalamanTambah extends StatefulWidget {
  const HalamanTambah({super.key});

  @override
  State<HalamanTambah> createState() => _HalamanTambahState();
}

class _HalamanTambahState extends State<HalamanTambah> {
  final _repo = TempatRepository();
  final _nama = TextEditingController();
  HasilLokasi? _lokasi;
  String? _pesan;
  bool _sibuk = false;

  @override
  void dispose() {
    _nama.dispose();
    super.dispose();
  }

  Future<void> _sertakanLokasi() async {
    setState(() => _sibuk = true);
    final hasil = await ambilLokasi();
    setState(() {
      _sibuk = false;
      _lokasi = hasil.ok ? hasil : null;
      _pesan = hasil.ok ? 'Lokasi didapat.' : hasil.pesan;
    });
  }

  Future<void> _simpan() async {
    final galat = validasiNama(_nama.text);
    if (galat != null) return setState(() => _pesan = galat);
    // Tempat tetap bisa disimpan tanpa koordinat bila lokasi gagal.
    await _repo.simpan(Tempat(
      nama: _nama.text,
      latitude: _lokasi?.latitude,
      longitude: _lokasi?.longitude,
    ));
    if (mounted) Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final l = _lokasi;
    return Scaffold(
      appBar: AppBar(title: const Text('Tambah Tempat')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _nama,
              maxLength: 60,
              decoration: const InputDecoration(labelText: 'Nama tempat'),
            ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: _sibuk ? null : _sertakanLokasi,
              child: Text(_sibuk ? 'Mencari lokasi...' : 'Sertakan lokasi saya'),
            ),
            const SizedBox(height: 8),
            Text(
              l != null
                  ? 'Koordinat: ${l.latitude!.toStringAsFixed(5)}, ${l.longitude!.toStringAsFixed(5)}'
                  : 'Belum ada koordinat. Tempat akan disimpan tanpa lokasi.',
            ),
            if (_pesan != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(_pesan!)),
            const Spacer(),
            FilledButton(onPressed: _simpan, child: const Text('Simpan')),
          ],
        ),
      ),
    );
  }
}
