import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';

class SensorPage extends StatefulWidget {
  const SensorPage({super.key});

  @override
  State<SensorPage> createState() => _SensorPageState();
}

class _SensorPageState extends State<SensorPage> {
  StreamSubscription<AccelerometerEvent>? _langganan;
  AccelerometerEvent? _data;
  bool _tidakTersedia = false;

  @override
  void initState() {
    super.initState();
    _langganan = accelerometerEventStream().listen(
      (event) {
        if (mounted) setState(() => _data = event);
      },
      onError: (_) {
        if (mounted) setState(() => _tidakTersedia = true);
      },
    );
  }

  @override
  void dispose() {
    // Wajib dibatalkan agar sensor berhenti saat layar ditutup
    _langganan?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final data = _data;

    return Scaffold(
      appBar: AppBar(title: const Text('Sensor Accelerometer')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: _tidakTersedia
            ? const Center(
                child: Text('Sensor accelerometer tidak tersedia di perangkat ini.'),
              )
            : data == null
                ? const Center(child: CircularProgressIndicator())
                : _buatTampilan(data),
      ),
    );
  }

  Widget _buatTampilan(AccelerometerEvent data) {
    final besar = math.sqrt(
      data.x * data.x + data.y * data.y + data.z * data.z,
    );
    // Gravitasi bumi sekitar 9.8 m/s2, dibatasi agar bar tetap dalam rentang 0 sampai 1
    final nilaiBar = (besar / 20).clamp(0.0, 1.0).toDouble();

    return ListView(
      children: [
        Card(
          child: ListTile(
            title: const Text('Sumbu X'),
            trailing: Text(data.x.toStringAsFixed(2)),
          ),
        ),
        Card(
          child: ListTile(
            title: const Text('Sumbu Y'),
            trailing: Text(data.y.toStringAsFixed(2)),
          ),
        ),
        Card(
          child: ListTile(
            title: const Text('Sumbu Z'),
            trailing: Text(data.z.toStringAsFixed(2)),
          ),
        ),
        const SizedBox(height: 16),
        Text('Besar percepatan: ${besar.toStringAsFixed(2)} m/s2'),
        const SizedBox(height: 8),
        LinearProgressIndicator(value: nilaiBar),
        const SizedBox(height: 16),
        const Text(
          'Gerakkan perangkat untuk melihat perubahan nilai. '
          'Saat diam, nilai besar percepatan mendekati 9.8 m/s2 karena gravitasi.',
        ),
      ],
    );
  }
}
