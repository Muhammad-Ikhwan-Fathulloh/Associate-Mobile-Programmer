import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';

import '../services/location_service.dart';

class LocationPage extends StatefulWidget {
  const LocationPage({super.key});

  @override
  State<LocationPage> createState() => _LocationPageState();
}

class _LocationPageState extends State<LocationPage> {
  // Pusat awal peta: Bandung
  static const _pusatAwal = LatLng(-6.9175, 107.6191);

  final _service = LocationService();
  final _mapController = MapController();

  Position? _posisi;
  String? _alamat;
  String? _error;
  bool _memuat = false;

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }

  Future<void> _perbaruiPosisi() async {
    setState(() {
      _memuat = true;
      _error = null;
    });
    try {
      final posisi = await _service.ambilPosisi();
      final alamat = await _service.alamatDari(posisi.latitude, posisi.longitude);
      if (!mounted) return;

      setState(() {
        _posisi = posisi;
        _alamat = alamat;
      });
      _mapController.move(LatLng(posisi.latitude, posisi.longitude), 16);
    } on LocationException catch (e) {
      if (mounted) setState(() => _error = e.pesan);
    } catch (e) {
      if (mounted) setState(() => _error = 'Gagal memuat posisi: $e');
    } finally {
      if (mounted) setState(() => _memuat = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final posisi = _posisi;

    return Scaffold(
      appBar: AppBar(title: const Text('Lokasi dan Peta')),
      body: Column(
        children: [
          Expanded(
            child: FlutterMap(
              mapController: _mapController,
              options: const MapOptions(
                initialCenter: _pusatAwal,
                initialZoom: 13,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'id.ac.associate.mobile',
                ),
                if (posisi != null)
                  MarkerLayer(
                    markers: [
                      Marker(
                        point: LatLng(posisi.latitude, posisi.longitude),
                        width: 40,
                        height: 40,
                        child: const Icon(
                          Icons.location_on,
                          color: Colors.red,
                          size: 40,
                        ),
                      ),
                    ],
                  ),
                const RichAttributionWidget(
                  attributions: [
                    TextSourceAttribution('OpenStreetMap contributors'),
                  ],
                ),
              ],
            ),
          ),
          Material(
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (_error != null)
                    Text(
                      _error!,
                      style: TextStyle(color: Theme.of(context).colorScheme.error),
                    ),
                  if (posisi != null) ...[
                    Text(
                      'Lat: ${posisi.latitude.toStringAsFixed(6)}, '
                      'Lon: ${posisi.longitude.toStringAsFixed(6)}\n'
                      'Akurasi: ${posisi.accuracy.toStringAsFixed(1)} meter',
                      textAlign: TextAlign.center,
                    ),
                    if (_alamat != null) ...[
                      const SizedBox(height: 8),
                      Text(
                        _alamat!,
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                    const SizedBox(height: 12),
                  ],
                  FilledButton.icon(
                    onPressed: _memuat ? null : _perbaruiPosisi,
                    icon: const Icon(Icons.my_location),
                    label: Text(_memuat ? 'Memuat...' : 'Perbarui posisi'),
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
