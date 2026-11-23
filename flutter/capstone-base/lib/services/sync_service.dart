import '../data/note_repository.dart';
import '../models/note.dart';
import 'api_client.dart';

class HasilSinkron {
  const HasilSinkron({required this.terkirim, required this.diterima, required this.gagal});

  final int terkirim;
  final int diterima;
  final int gagal;

  @override
  String toString() => 'terkirim: $terkirim  diterima: $diterima  gagal: $gagal';
}

/// Offline-first: kirim catatan PENDING (POST bila baru, PUT bila punya serverId),
/// tandai SYNCED, lalu ambil catatan dari server.
Future<HasilSinkron> sinkronkan(NoteRepository repo, ApiClient api, String token) async {
  var terkirim = 0, gagal = 0, diterima = 0;

  for (final Note n in await repo.catatanPending()) {
    try {
      final badan = <String, Object?>{
        'title': n.title,
        'content': n.content,
        'latitude': n.latitude,
        'longitude': n.longitude,
      };
      final hasil = n.serverId == null
          ? await api.buatCatatan(token, badan)
          : await api.ubahCatatan(token, n.serverId!, badan);
      await repo.tandaiSynced(n.id!, hasil['id'] as int);
      terkirim++;
    } catch (_) {
      gagal++; // satu kegagalan tidak menghentikan yang lain
    }
  }

  for (final s in await api.daftarCatatan(token)) {
    if (await repo.simpanDariServer(s as Map<String, dynamic>)) diterima++;
  }
  return HasilSinkron(terkirim: terkirim, diterima: diterima, gagal: gagal);
}
