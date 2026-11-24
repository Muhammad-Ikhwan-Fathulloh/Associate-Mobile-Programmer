// Sinkronisasi offline-first. Bergantung pada antarmuka agar bisa diuji dengan tiruan.
import '../models/entri.dart';

abstract class PenyimpananEntri {
  Future<List<Entri>> entriPending();
  Future<void> tandaiSynced(int id, String serverId);
  Future<bool> simpanDariServer(Entri e, String serverId);
}

abstract class ApiSinkron {
  Future<Map<String, dynamic>> buat(Map<String, Object?> badan);
  Future<Map<String, dynamic>> ubah(String id, Map<String, Object?> badan);
  Future<List<Map<String, dynamic>>> daftar();
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
/// lalu daftar dari MockAPI diambil. Satu kegagalan tidak menghentikan yang lain.
Future<HasilSinkron> sinkronkan(PenyimpananEntri repo, ApiSinkron api) async {
  var terkirim = 0, gagal = 0, diterima = 0;

  for (final e in await repo.entriPending()) {
    try {
      final badan = <String, Object?>{
        'title': e.judul,
        'content': e.catatan,
        'latitude': e.latitude,
        'longitude': e.longitude,
      };
      final hasil = e.serverId == null ? await api.buat(badan) : await api.ubah(e.serverId!, badan);
      await repo.tandaiSynced(e.id!, '${hasil['id']}');
      terkirim++;
    } catch (_) {
      gagal++;
    }
  }

  for (final s in await api.daftar()) {
    final id = '${s['id']}';
    final baru = await repo.simpanDariServer(
      Entri(
        serverId: id,
        judul: '${s['title'] ?? ''}',
        catatan: '${s['content'] ?? ''}',
        latitude: (s['latitude'] as num?)?.toDouble(),
        longitude: (s['longitude'] as num?)?.toDouble(),
        updatedAt: DateTime.now().millisecondsSinceEpoch,
        status: StatusSync.synced,
      ),
      id,
    );
    if (baru) diterima++;
  }
  return HasilSinkron(terkirim: terkirim, diterima: diterima, gagal: gagal);
}
