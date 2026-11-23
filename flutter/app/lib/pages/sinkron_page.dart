import 'package:flutter/material.dart';

import '../data/note_repository.dart';
import '../services/api_client.dart';
import '../services/secure_storage_service.dart';
import '../services/sync_service.dart';
import '../theme/tema.dart';

/// Layar "API dan Sinkronisasi" sesuai desain Figma (layar 05).
class SinkronPage extends StatefulWidget {
  const SinkronPage({super.key});

  @override
  State<SinkronPage> createState() => _SinkronPageState();
}

class _SinkronPageState extends State<SinkronPage> {
  final _url = TextEditingController(text: apiUrlBawaan);
  final _storage = SecureStorageService();
  final _repo = NoteRepository();
  final List<_Baris> _log = [];

  String? _token;
  bool _sibuk = false;

  @override
  void dispose() {
    _url.dispose();
    super.dispose();
  }

  void _catat(String teks, {bool ok = true}) {
    if (!mounted) return;
    setState(() => _log.insert(0, _Baris(teks, ok)));
  }

  Future<void> _jalankan(Future<void> Function() kerja) async {
    setState(() => _sibuk = true);
    try {
      await kerja();
    } on ApiException catch (e) {
      _catat('Server menolak: ${e.pesan}', ok: false);
    } on ArgumentError catch (e) {
      _catat('${e.message}', ok: false);
    } catch (e) {
      _catat('Gagal: $e', ok: false);
    } finally {
      if (mounted) setState(() => _sibuk = false);
    }
  }

  Future<void> _login() => _jalankan(() async {
        final api = ApiClient(_url.text);
        final token = await api.login('peserta@contoh.id', 'rahasia123');
        await _storage.simpanToken(token);
        _token = token;
        _catat('Login berhasil, token disimpan di penyimpanan aman.');
      });

  Future<void> _sinkron() => _jalankan(() async {
        final token = _token ?? await _storage.ambilToken();
        if (token == null) {
          _catat('Belum login. Tekan Login dahulu.', ok: false);
          return;
        }
        final hasil = await sinkronkan(_repo, ApiClient(_url.text), token);
        _catat(hasil.toString(), ok: hasil.gagal == 0);
      });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('API dan Sinkronisasi')),
      body: ListView(
        padding: const EdgeInsets.all(Tema.spasiLg),
        children: [
          Text('URL server', style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(height: Tema.spasiXs),
          TextField(
            controller: _url,
            keyboardType: TextInputType.url,
            autocorrect: false,
          ),
          const SizedBox(height: Tema.spasiMd),
          OutlinedButton(onPressed: _sibuk ? null : _login, child: const Text('Login')),
          const SizedBox(height: Tema.spasiMd),
          FilledButton(onPressed: _sibuk ? null : _sinkron, child: const Text('Sinkronkan')),
          const SizedBox(height: Tema.spasiMd),
          if (_log.isNotEmpty)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(Tema.spasiLg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (final b in _log)
                      Padding(
                        padding: const EdgeInsets.only(bottom: Tema.spasiXs),
                        child: Text(
                          b.teks,
                          style: TextStyle(
                            fontSize: Tema.fontKecil,
                            color: b.ok ? Tema.ok : Tema.bahaya,
                          ),
                        ),
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

class _Baris {
  const _Baris(this.teks, this.ok);

  final String teks;
  final bool ok;
}
