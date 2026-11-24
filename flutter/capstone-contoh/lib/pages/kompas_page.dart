import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';

import '../services/geo.dart';
import '../services/kompas_sensor.dart';
import '../services/lokasi.dart';

/// Kompas yang menunjukkan arah ke tujuan. Langganan magnetometer dihentikan di dispose.
class KompasPage extends StatefulWidget {
  const KompasPage({super.key});

  @override
  State<KompasPage> createState() => _KompasPageState();
}

class _KompasPageState extends State<KompasPage> {
  // Tujuan contoh: Monumen Nasional, Jakarta. Ganti dengan entri yang dipilih pengguna.
  static const _tujuanLat = -6.1754;
  static const _tujuanLon = 106.8272;

  StreamSubscription<MagnetometerEvent>? _langganan;
  double _hadap = 0;
  double? _posisiLat;
  double? _posisiLon;
  String? _pesan;

  @override
  void initState() {
    super.initState();
    _langganan = magnetometerEventStream().listen((e) {
      if (mounted) setState(() => _hadap = arahHadapDariMagnetometer(e.x, e.y));
    });
    _perbaruiPosisi();
  }

  Future<void> _perbaruiPosisi() async {
    final hasil = await ambilLokasi();
    if (!mounted) return;
    setState(() {
      _posisiLat = hasil.latitude;
      _posisiLon = hasil.longitude;
      _pesan = hasil.ok ? null : hasil.pesan;
    });
  }

  @override
  void dispose() {
    _langganan?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final lat = _posisiLat;
    final lon = _posisiLon;
    final arahTujuan = lat != null && lon != null ? arahKeTujuan(lat, lon, _tujuanLat, _tujuanLon) : null;
    final relatif = arahTujuan != null ? arahRelatif(arahTujuan, _hadap) : null;

    return Scaffold(
      appBar: AppBar(title: const Text('Kompas Tujuan')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Text('Tujuan: Monumen Nasional, Jakarta'),
            const SizedBox(height: 24),
            Transform.rotate(
              angle: relatif == null ? 0 : relatif * 3.14159265 / 180,
              child: const Icon(Icons.navigation, size: 160, color: Color(0xFF1565C0)),
            ),
            const SizedBox(height: 16),
            Text(
              relatif == null
                  ? 'Menunggu lokasi...'
                  : 'Tujuan ${relatif.abs() < 10 ? 'tepat di depan' : (relatif < 0 ? 'di kiri' : 'di kanan')}'
                      ' (${arahTujuan!.round()}° ${mataAngin(arahTujuan)})',
            ),
            Text('Arah hadap ponsel: ${_hadap.round()}° ${mataAngin(_hadap)}'),
            if (_pesan != null) Padding(padding: const EdgeInsets.only(top: 12), child: Text(_pesan!)),
            const SizedBox(height: 16),
            OutlinedButton(onPressed: _perbaruiPosisi, child: const Text('Perbarui posisi')),
          ],
        ),
      ),
    );
  }
}
