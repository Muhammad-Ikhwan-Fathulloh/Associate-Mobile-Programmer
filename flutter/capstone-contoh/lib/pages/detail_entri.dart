import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../data/entri_repository.dart';
import '../models/entri.dart';
import '../services/geo.dart';
import '../services/lokasi.dart';
import 'form_entri.dart';

class DetailEntri extends StatefulWidget {
  const DetailEntri({super.key, required this.id});

  final int id;

  @override
  State<DetailEntri> createState() => _DetailEntriState();
}

class _DetailEntriState extends State<DetailEntri> {
  final _repo = EntriRepository();
  Entri? _entri;
  double? _jarak;
  String? _pesan;

  @override
  void initState() {
    super.initState();
    _muat();
  }

  Future<void> _muat() async {
    final e = await _repo.ambilSatu(widget.id);
    if (mounted) setState(() => _entri = e);
  }

  Future<void> _jarakDariSaya() async {
    final e = _entri;
    if (e == null || !e.punyaKoordinat) return setState(() => _pesan = 'Entri ini tidak punya koordinat.');
    final hasil = await ambilLokasi();
    if (!hasil.ok) return setState(() => _pesan = hasil.pesan);
    setState(() {
      _jarak = jarakMeter(hasil.latitude!, hasil.longitude!, e.latitude!, e.longitude!);
      _pesan = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final e = _entri;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Detail Entri'),
        actions: [
          if (e != null)
            IconButton(
              tooltip: 'Hapus',
              icon: const Icon(Icons.delete_outline),
              onPressed: () async {
                await _repo.hapus(e.id!);
                if (context.mounted) Navigator.of(context).pop();
              },
            ),
        ],
      ),
      body: e == null
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text(e.judul, style: Theme.of(context).textTheme.headlineSmall),
                Text('${e.kategori} · ${e.status == StatusSync.synced ? 'SYNCED' : 'PENDING'}'),
                const SizedBox(height: 12),
                Text(e.catatan),
                const SizedBox(height: 16),
                if (e.punyaKoordinat) ...[
                  OutlinedButton(onPressed: _jarakDariSaya, child: const Text('Jarak dari saya')),
                  if (_jarak != null) Text('Jarak: ${formatJarak(_jarak!)}'),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 260,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: FlutterMap(
                        options: MapOptions(initialCenter: LatLng(e.latitude!, e.longitude!), initialZoom: 15),
                        children: [
                          TileLayer(
                            urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                            userAgentPackageName: 'id.contoh.jurnalperjalanan',
                          ),
                          MarkerLayer(markers: [
                            Marker(
                              point: LatLng(e.latitude!, e.longitude!),
                              width: 40,
                              height: 40,
                              child: const Icon(Icons.place, color: Colors.red, size: 36),
                            ),
                          ]),
                        ],
                      ),
                    ),
                  ),
                ] else
                  const Text('Entri ini disimpan tanpa lokasi.'),
                if (_pesan != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(_pesan!)),
                const SizedBox(height: 16),
                OutlinedButton(
                  onPressed: () async {
                    await Navigator.of(context).push(MaterialPageRoute(builder: (_) => FormEntri(id: e.id)));
                    await _muat();
                  },
                  child: const Text('Ubah'),
                ),
              ],
            ),
    );
  }
}
