// Sinkronisasi offline-first. Bergantung pada antarmuka agar bisa diuji dengan tiruan.
import '../models/entri.dart';

abstract class PenyimpananEntri {
  Future<List<Entri>> entriPending();
  Future<void> tandaiSynced(int id, int serverId);
  Future<bool> simpanDariServer(Entri e, int serverId);
}

abstract class ApiSinkron {
  Future<Map<String, dynamic>> buatEntri(String token, Map<String, Object?> badan);
  Future<Map<String, dynamic>> ubahEntri(String token, int id, Map<String, Object?> badan);
  Future<List<dynamic>> daftarEntri(String token);
}

class HasilSinkron {
  const HasilSinkron({required this.terkirim, required this.diterima, required this.gagal});

  final int terkirim;
  final int diterima;
  final int gagal;

  @override
  String toString() => 'terkirim $terkirim, diterima $diterima, gagal $gagal';
}

/// PENDING dikirim (POST bila baru, PUT bila punya serverId), lalu ditandai SYNCED,
/// lalu daftar dari server diambil. Satu kegagalan tidak menghentikan yang lain.
Future<HasilSinkron> sinkronkan(PenyimpananEntri repo, ApiSinkron api, String token) async {
  var terkirim = 0, gagal = 0, diterima = 0;

  for (final e in await repo.entriPending()) {
    try {
      final badan = <String, Object?>{
        'title': e.judul,
        'content': e.catatan,
        'latitude': e.latitude,
        'longitude': e.longitude,
      };
      final hasil = e.serverId == null
          ? await api.buatEntri(token, badan)
          : await api.ubahEntri(token, e.serverId!, badan);
      await repo.tandaiSynced(e.id!, hasil['id'] as int);
      terkirim++;
    } catch (_) {
      gagal++;
    }
  }

  for (final s in await api.daftarEntri(token)) {
    final m = s as Map<String, dynamic>;
    final e = Entri(
      judul: m['title'] as String,
      catatan: m['content'] as String,
      latitude: (m['latitude'] as num?)?.toDouble(),
      longitude: (m['longitude'] as num?)?.toDouble(),
      updatedAt: m['updatedAt'] as int,
      status: StatusSync.synced,
    );
    if (await repo.simpanDariServer(e, m['id'] as int)) diterima++;
  }
  return HasilSinkron(terkirim: terkirim, diterima: diterima, gagal: gagal);
}
