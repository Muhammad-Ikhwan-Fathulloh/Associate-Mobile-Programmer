import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';

import 'services/sensor_math.dart';

void main() => runApp(const AplikasiSensor());

class AplikasiSensor extends StatelessWidget {
  const AplikasiSensor({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Penghitung Guncangan dan Kompas',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF1565C0)),
      home: const HalamanSensor(),
    );
  }
}

class HalamanSensor extends StatefulWidget {
  const HalamanSensor({super.key});

  @override
  State<HalamanSensor> createState() => _HalamanSensorState();
}

class _HalamanSensorState extends State<HalamanSensor> {
  // Langganan dihentikan di dispose, saat layar ditutup.
  StreamSubscription<AccelerometerEvent>? _akselerometer;
  StreamSubscription<GyroscopeEvent>? _giroskop;
  StreamSubscription<MagnetometerEvent>? _magnetometer;

  final _pendeteksi = PendeteksiGuncangan(ambang: 2, jedaMs: 800);
  Vektor _gravitasiG = const Vektor(0, 0, 0);
  Vektor _rotasi = const Vektor(0, 0, 0);
  double _derajat = 0;
  int _jumlah = 0;

  @override
  void initState() {
    super.initState();
    _akselerometer = accelerometerEventStream().listen((e) {
      final v = Vektor(e.x / gravitasi, e.y / gravitasi, e.z / gravitasi);
      final guncang = _pendeteksi.masukkan(v, DateTime.now().millisecondsSinceEpoch);
      setState(() {
        _gravitasiG = v;
        if (guncang) _jumlah++;
      });
    });
    _giroskop = gyroscopeEventStream().listen((e) => setState(() => _rotasi = Vektor(e.x, e.y, e.z)));
    _magnetometer = magnetometerEventStream().listen((e) => setState(() => _derajat = arahKompas(e.x, e.y)));
  }

  @override
  void dispose() {
    _akselerometer?.cancel();
    _giroskop?.cancel();
    _magnetometer?.cancel();
    super.dispose();
  }

  String _f(double n) => n.toStringAsFixed(2);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sensor')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Penghitung guncangan', style: TextStyle(fontWeight: FontWeight.w600)),
                  Text('$_jumlah', style: Theme.of(context).textTheme.displaySmall),
                  Text('Guncang ponsel untuk menambah hitungan. Satu guncangan dihitung sekali.'),
                  Text('Besar percepatan: ${_f(besarVektor(_gravitasiG))} g'),
                  const SizedBox(height: 8),
                  OutlinedButton(onPressed: () => setState(() => _jumlah = 0), child: const Text('Reset hitungan')),
                ],
              ),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('Kompas'),
              subtitle: Text('${_derajat.round()}° ${mataAngin(_derajat)}. Letakkan ponsel datar agar arah akurat.'),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('Giroskop (rad/s)'),
              subtitle: Text('X ${_f(_rotasi.x)}  Y ${_f(_rotasi.y)}  Z ${_f(_rotasi.z)}'),
            ),
          ),
        ],
      ),
    );
  }
}
