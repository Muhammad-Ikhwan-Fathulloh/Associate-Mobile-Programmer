import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'config.dart';
import 'data/catatan_repository.dart';
import 'data/connector.dart';
import 'data/database.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AplikasiNotes());
}

class AplikasiNotes extends StatelessWidget {
  const AplikasiNotes({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Notes PowerSync',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF1565C0)),
      home: const HalamanUtama(),
    );
  }
}

/// Menyiapkan Supabase, sesi anonim, dan PowerSync sebelum daftar ditampilkan.
Future<CatatanRepository> siapkan() async {
  await Supabase.initialize(url: supabaseUrl, publishableKey: supabaseAnonKey);
  if (Supabase.instance.client.auth.currentSession == null) {
    await Supabase.instance.client.auth.signInAnonymously();
  }
  final db = await bukaDatabase();
  await db.connect(connector: SupabaseConnector());
  return CatatanRepository(db);
}

class HalamanUtama extends StatefulWidget {
  const HalamanUtama({super.key});

  @override
  State<HalamanUtama> createState() => _HalamanUtamaState();
}

class _HalamanUtamaState extends State<HalamanUtama> {
  late final Future<CatatanRepository> _siap =
      konfigurasiSudahDiisi() ? siapkan() : Future.error('konfigurasi');

  Future<void> _tambah(CatatanRepository repo) async {
    final judul = TextEditingController();
    final isi = TextEditingController();
    final simpan = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Catatan baru'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: judul, decoration: const InputDecoration(labelText: 'Judul')),
            TextField(controller: isi, decoration: const InputDecoration(labelText: 'Isi')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Simpan')),
        ],
      ),
    );
    if (simpan == true && judul.text.trim().isNotEmpty) {
      await repo.tambah(judul.text.trim(), isi.text.trim());
    }
    judul.dispose();
    isi.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notes PowerSync')),
      body: FutureBuilder<CatatanRepository>(
        future: _siap,
        builder: (context, snap) {
          if (snap.hasError) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text(
                  'Konfigurasi belum diisi. Ganti nilai GANTI di lib/config.dart, lalu jalankan ulang aplikasi.',
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }
          if (!snap.hasData) {
            return const Center(child: CircularProgressIndicator());
          }
          final repo = snap.data!;
          return StreamBuilder<List<Catatan>>(
            stream: repo.pantau(),
            builder: (context, daftar) {
              final isi = daftar.data ?? const <Catatan>[];
              if (isi.isEmpty) {
                return const Center(child: Text('Belum ada catatan.'));
              }
              return ListView(
                children: [
                  for (final c in isi)
                    Card(
                      child: ListTile(
                        title: Text(c.title),
                        subtitle: Text(c.content),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete_outline),
                          onPressed: () => repo.hapus(c.id),
                        ),
                      ),
                    ),
                ],
              );
            },
          );
        },
      ),
      floatingActionButton: FutureBuilder<CatatanRepository>(
        future: _siap,
        builder: (context, snap) => FloatingActionButton(
          onPressed: snap.hasData ? () => _tambah(snap.data!) : null,
          child: const Icon(Icons.add),
        ),
      ),
    );
  }
}
