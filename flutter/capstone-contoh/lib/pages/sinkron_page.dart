import 'package:flutter/material.dart';

import '../config.dart';
import '../data/entri_repository.dart';
import '../services/api_client.dart';
import '../services/secure_storage.dart';
import '../services/sync_service.dart';

class SinkronPage extends StatefulWidget {
  const SinkronPage({super.key});

  @override
  State<SinkronPage> createState() => _SinkronPageState();
}

class _SinkronPageState extends State<SinkronPage> {
  final _repo = EntriRepository();
  final _api = ApiClient(apiUrl);
  String? _token;
  final _log = <String>[];

  @override
  void initState() {
    super.initState();
    bacaToken().then((t) {
      if (mounted) setState(() => _token = t);
    });
  }

  void _catat(String baris) => setState(() => _log.insert(0, baris));

  Future<void> _masuk() async {
    try {
      final t = await _api.login(akunEmail, akunPassword);
      await simpanToken(t); // disimpan di penyimpanan aman, bukan di SQLite
      setState(() => _token = t);
      _catat('Login berhasil. Token disimpan di penyimpanan aman.');
    } catch (e) {
      _catat('Login gagal: $e');
    }
  }

  Future<void> _keluar() async {
    await hapusToken();
    setState(() => _token = null);
    _catat('Token dihapus dari perangkat.');
  }

  Future<void> _sinkron() async {
    final t = _token;
    if (t == null) return _catat('Masuk dahulu.');
    try {
      final h = await sinkronkan(_repo, _api, t);
      _catat('Selesai: $h.');
    } catch (e) {
      _catat('Sinkron gagal: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final masuk = _token != null;
    return Scaffold(
      appBar: AppBar(title: const Text('Sinkronisasi')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(masuk ? 'Sudah masuk ke server latihan.' : 'Belum masuk.'),
          const SizedBox(height: 12),
          if (!masuk)
            FilledButton(onPressed: _masuk, child: const Text('Masuk ke server latihan'))
          else ...[
            FilledButton(onPressed: _sinkron, child: const Text('Sinkronkan sekarang')),
            const SizedBox(height: 8),
            OutlinedButton(onPressed: _keluar, child: const Text('Keluar')),
          ],
          const SizedBox(height: 16),
          for (final b in _log) Text('• $b'),
        ],
      ),
    );
  }
}
