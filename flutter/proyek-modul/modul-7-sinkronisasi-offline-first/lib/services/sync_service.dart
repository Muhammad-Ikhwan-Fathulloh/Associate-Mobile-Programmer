// Sinkronisasi offline-first. Bergantung pada antarmuka, bukan pada SQLite atau jaringan nyata,
// sehingga bisa diuji dengan penyimpanan dan API tiruan.
import '../models/catatan.dart';

/// Bagian penyimpanan lokal yang dibutuhkan sinkronisasi.
abstract class PenyimpananCatatan {
  Future<List<Catatan>> catatanPending();
  Future<void> tandaiSynced(int id, int serverId);
  Future<bool> simpanDariServer(Catatan c, int serverId);
}

/// Bagian klien API yang dibutuhkan sinkronisasi.
abstract class ApiSinkron {
  Future<Map<String, dynamic>> buatCatatan(String token, Map<String, Object?> badan);
  Future<Map<String, dynamic>> ubahCatatan(String token, int id, Map<String, Object?> badan);
  Future<List<dynamic>> daftarCatatan(String token);
}

class HasilSinkron {
  const HasilSinkron({required this.terkirim, required this.diterima, required this.gagal});

  final int terkirim;
  final int diterima;
  final int gagal;

  @override
  String toString() => 'terkirim: $terkirim  diterima: $diterima  gagal: $gagal';
}

/// Kirim catatan PENDING (POST bila baru, PUT bila punya serverId), tandai SYNCED,
/// lalu ambil catatan dari server. Kegagalan satu catatan tidak menghentikan yang lain.
Future<HasilSinkron> sinkronkan(PenyimpananCatatan repo, ApiSinkron api, String token) async {
  var terkirim = 0, gagal = 0, diterima = 0;

  for (final n in await repo.catatanPending()) {
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
      gagal++;
    }
  }

  for (final s in await api.daftarCatatan(token)) {
    final m = s as Map<String, dynamic>;
    final c = Catatan(
      title: m['title'] as String,
      content: m['content'] as String,
      latitude: (m['latitude'] as num?)?.toDouble(),
      longitude: (m['longitude'] as num?)?.toDouble(),
      updatedAt: m['updatedAt'] as int,
      syncStatus: StatusSync.synced,
    );
    if (await repo.simpanDariServer(c, m['id'] as int)) diterima++;
  }
  return HasilSinkron(terkirim: terkirim, diterima: diterima, gagal: gagal);
}
