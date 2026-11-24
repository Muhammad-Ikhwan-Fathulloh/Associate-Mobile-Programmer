import 'package:flutter/material.dart';

import '../data/entri_repository.dart';
import '../services/api_client.dart';
import '../services/sync_service.dart';
import '../config.dart';

/// Sinkronisasi dengan MockAPI: kirim PENDING (POST atau PUT), lalu ambil daftar dari server.
class SinkronPage extends StatefulWidget {
  const SinkronPage({super.key});

  @override
  State<SinkronPage> createState() => _SinkronPageState();
}

class _SinkronPageState extends State<SinkronPage> {
  final _repo = EntriRepository();
  final _api = ApiClient(apiUrl);
  final _log = <String>[];
  bool _sibuk = false;

  void _catat(String baris) => setState(() => _log.insert(0, baris));

  Future<void> _sinkron() async {
    setState(() => _sibuk = true);
    try {
      final h = await sinkronkan(_repo, _api);
      _catat('Selesai: $h.');
    } catch (e) {
      _catat('Sinkron gagal: $e');
    } finally {
      if (mounted) setState(() => _sibuk = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sinkronisasi')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Server: MockAPI (resource notes)'),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: _sibuk ? null : _sinkron,
            child: Text(_sibuk ? 'Menyinkronkan...' : 'Sinkronkan sekarang'),
          ),
          const SizedBox(height: 16),
          for (final b in _log) Text('• $b'),
        ],
      ),
    );
  }
}
