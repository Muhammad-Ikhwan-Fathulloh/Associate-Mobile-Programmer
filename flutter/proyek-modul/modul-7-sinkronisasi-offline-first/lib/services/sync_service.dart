// Sinkronisasi offline-first. Bergantung pada antarmuka agar bisa diuji dengan tiruan.
import '../models/catatan.dart';

abstract class PenyimpananCatatan {
  Future<List<Catatan>> catatanPending();
  Future<void> tandaiSynced(int id, String serverId);
  Future<bool> simpanDariServer(Catatan c, String serverId);
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
Future<HasilSinkron> sinkronkan(PenyimpananCatatan repo, ApiSinkron api) async {
  var terkirim = 0, gagal = 0, diterima = 0;

  for (final c in await repo.catatanPending()) {
    try {
      final badan = <String, Object?>{
        'title': c.title,
        'content': c.content,
        'latitude': c.latitude,
        'longitude': c.longitude,
      };
      final hasil = c.serverId == null ? await api.buat(badan) : await api.ubah(c.serverId!, badan);
      await repo.tandaiSynced(c.id!, '${hasil['id']}');
      terkirim++;
    } catch (_) {
      gagal++;
    }
  }

  for (final s in await api.daftar()) {
    final id = '${s['id']}';
    final baru = await repo.simpanDariServer(
      Catatan(
        serverId: id,
        title: '${s['title'] ?? ''}',
        content: '${s['content'] ?? ''}',
        latitude: (s['latitude'] as num?)?.toDouble(),
        longitude: (s['longitude'] as num?)?.toDouble(),
        updatedAt: DateTime.now().millisecondsSinceEpoch,
        syncStatus: StatusSync.synced,
      ),
      id,
    );
    if (baru) diterima++;
  }
  return HasilSinkron(terkirim: terkirim, diterima: diterima, gagal: gagal);
}
