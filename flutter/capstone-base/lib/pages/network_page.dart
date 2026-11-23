import 'dart:async';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';

import '../services/network_service.dart';

class NetworkPage extends StatefulWidget {
  const NetworkPage({super.key});

  @override
  State<NetworkPage> createState() => _NetworkPageState();
}

class _NetworkPageState extends State<NetworkPage> {
  final _service = NetworkService();
  StreamSubscription<List<ConnectivityResult>>? _langganan;
  List<ConnectivityResult> _hasil = const [];

  @override
  void initState() {
    super.initState();
    _service.periksa().then((hasil) {
      if (mounted) setState(() => _hasil = hasil);
    });
    _langganan = _service.perubahan.listen((hasil) {
      if (mounted) setState(() => _hasil = hasil);
    });
  }

  @override
  void dispose() {
    _langganan?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final label = labelJaringan(_hasil);
    final tanpaKoneksi = label == 'Tidak ada koneksi';
    final seluler = label == 'Seluler';

    return Scaffold(
      appBar: AppBar(title: const Text('Jaringan Seluler')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: ListTile(
              leading: const Icon(Icons.signal_cellular_alt),
              title: const Text('Jenis koneksi'),
              subtitle: Text(label),
            ),
          ),
          const SizedBox(height: 8),
          if (tanpaKoneksi)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text(
                  'Tidak ada koneksi. Periksa Wi-Fi atau data seluler Anda. '
                  'Aplikasi tetap dapat menampilkan data yang tersimpan di perangkat.',
                ),
              ),
            ),
          if (seluler)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text(
                  'Anda sedang memakai jaringan seluler. Unduhan besar sebaiknya '
                  'ditunda sampai Wi-Fi tersedia.',
                ),
              ),
            ),
          const SizedBox(height: 16),
          const Text(
            'Package connectivity_plus hanya mengetahui jenis koneksi. '
            'Generasi (2G, 3G, 4G, atau 5G) dan kecepatan tidak terdeteksi '
            'oleh package ini.',
          ),
        ],
      ),
    );
  }
}
