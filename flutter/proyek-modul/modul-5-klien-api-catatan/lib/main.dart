import 'package:flutter/material.dart';

import 'config.dart';
import 'services/api_client.dart';
import 'services/pesan_error.dart';

void main() => runApp(const AplikasiApi());

class AplikasiApi extends StatelessWidget {
  const AplikasiApi({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Klien API Catatan',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF1565C0)),
      home: const HalamanApi(),
    );
  }
}

class HalamanApi extends StatefulWidget {
  const HalamanApi({super.key});

  @override
  State<HalamanApi> createState() => _HalamanApiState();
}

class _HalamanApiState extends State<HalamanApi> {
  final _api = ApiClient(apiUrl);
  final _email = TextEditingController(text: akunEmail);
  final _password = TextEditingController(text: akunPassword);
  final _judul = TextEditingController();
  final _isi = TextEditingController();

  String? _token;
  List<dynamic> _catatan = [];
  bool _memuat = false;
  String? _pesan;

  @override
  void dispose() {
    for (final c in [_email, _password, _judul, _isi]) {
      c.dispose();
    }
    super.dispose();
  }

  /// Menjalankan aksi jaringan dengan indikator memuat dan pesan galat yang ramah.
  Future<void> _jalankan(Future<void> Function() aksi) async {
    setState(() {
      _memuat = true;
      _pesan = null;
    });
    try {
      await aksi();
    } catch (e) {
      if (mounted) setState(() => _pesan = pesanRamah(e));
    } finally {
      if (mounted) setState(() => _memuat = false);
    }
  }

  Future<void> _masuk() => _jalankan(() async {
        final t = await _api.login(_email.text, _password.text);
        final daftar = await _api.daftarCatatan(t);
        setState(() {
          _token = t;
          _catatan = daftar;
        });
      });

  Future<void> _muatUlang() => _jalankan(() async {
        final daftar = await _api.daftarCatatan(_token!);
        setState(() => _catatan = daftar);
      });

  Future<void> _kirim() => _jalankan(() async {
        final baru = await _api.buatCatatan(_token!, {'title': _judul.text, 'content': _isi.text});
        setState(() {
          _catatan = [baru, ..._catatan];
          _judul.clear();
          _isi.clear();
        });
      });

  @override
  Widget build(BuildContext context) {
    final token = _token;
    return Scaffold(
      appBar: AppBar(title: const Text('Klien API Catatan')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (token == null) ...[
            TextField(controller: _email, decoration: const InputDecoration(labelText: 'Email')),
            TextField(controller: _password, obscureText: true, decoration: const InputDecoration(labelText: 'Kata sandi')),
            const SizedBox(height: 12),
            FilledButton(onPressed: _memuat ? null : _masuk, child: const Text('Masuk')),
          ] else ...[
            TextField(controller: _judul, maxLength: 100, decoration: const InputDecoration(labelText: 'Judul (wajib)')),
            TextField(controller: _isi, maxLines: 3, decoration: const InputDecoration(labelText: 'Isi')),
            const SizedBox(height: 12),
            FilledButton(onPressed: _memuat ? null : _kirim, child: const Text('Kirim ke server')),
            const SizedBox(height: 8),
            OutlinedButton(onPressed: _memuat ? null : _muatUlang, child: const Text('Muat ulang daftar')),
          ],
          if (_memuat) const Padding(padding: EdgeInsets.all(12), child: Center(child: CircularProgressIndicator())),
          if (_pesan != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(_pesan!, style: const TextStyle(color: Colors.red))),
          for (final c in _catatan)
            Card(
              child: ListTile(
                title: Text('${c['title']}'),
                subtitle: Text('${c['content']}'.isEmpty ? '(tanpa isi)' : '${c['content']}'),
              ),
            ),
        ],
      ),
    );
  }
}
