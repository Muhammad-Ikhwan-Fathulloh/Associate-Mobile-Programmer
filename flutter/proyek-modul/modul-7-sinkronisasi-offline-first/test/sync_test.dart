import 'package:flutter_test/flutter_test.dart';
import 'package:modul_7_sinkronisasi_offline_first/models/catatan.dart';
import 'package:modul_7_sinkronisasi_offline_first/services/api_client.dart';
import 'package:modul_7_sinkronisasi_offline_first/services/sync_service.dart';

/// Penyimpanan tiruan berbasis daftar, meniru repository SQLite.
class PenyimpananPalsu implements PenyimpananCatatan {
  PenyimpananPalsu(this.data);

  final List<Catatan> data;

  @override
  Future<List<Catatan>> catatanPending() async =>
      data.where((c) => c.syncStatus == StatusSync.pending).toList();

  @override
  Future<void> tandaiSynced(int id, int serverId) async {
    final i = data.indexWhere((c) => c.id == id);
    data[i] = data[i].copyWith(syncStatus: StatusSync.synced, serverId: serverId);
  }

  @override
  Future<bool> simpanDariServer(Catatan c, int serverId) async {
    final i = data.indexWhere((x) => x.serverId == serverId);
    if (i >= 0) {
      data[i] = c.copyWith(id: data[i].id, serverId: serverId);
      return false;
    }
    data.add(c.copyWith(id: data.length + 100, serverId: serverId));
    return true;
  }
}

/// API tiruan: merekam pemanggilan agar bisa diperiksa.
class ApiPalsu implements ApiSinkron {
  final posted = <Map<String, Object?>>[];
  final puts = <int>[];
  int gagalSekali = 0;
  List<dynamic> dariServer = [];

  @override
  Future<Map<String, dynamic>> buatCatatan(String token, Map<String, Object?> badan) async {
    if (gagalSekali > 0) {
      gagalSekali--;
      throw Exception('jaringan putus');
    }
    posted.add(badan);
    return {'id': 77, 'title': badan['title']};
  }

  @override
  Future<Map<String, dynamic>> ubahCatatan(String token, int id, Map<String, Object?> badan) async {
    puts.add(id);
    return {'id': id, 'title': badan['title']};
  }

  @override
  Future<List<dynamic>> daftarCatatan(String token) async => dariServer;
}

Catatan _catatan({int? id, int? serverId, String title = 'Judul'}) => Catatan(
      id: id,
      serverId: serverId,
      title: title,
      content: 'Isi',
      updatedAt: 1,
    );

void main() {
  test('catatan baru tanpa serverId dikirim dengan POST lalu berstatus SYNCED', () async {
    final data = [_catatan(id: 1)];
    final api = ApiPalsu();
    final hasil = await sinkronkan(PenyimpananPalsu(data), api, 'tok');
    expect(api.posted, hasLength(1));
    expect(data.first.syncStatus, StatusSync.synced);
    expect(data.first.serverId, 77);
    expect(hasil.terkirim, 1);
  });

  test('catatan yang sudah punya serverId dikirim dengan PUT, bukan POST kedua', () async {
    final data = [_catatan(id: 1, serverId: 5)];
    final api = ApiPalsu();
    await sinkronkan(PenyimpananPalsu(data), api, 'tok');
    expect(api.puts, [5]);
    expect(api.posted, isEmpty);
  });

  test('kegagalan satu catatan tidak menghentikan yang lain', () async {
    final data = [_catatan(id: 1, title: 'A'), _catatan(id: 2, title: 'B')];
    final api = ApiPalsu()..gagalSekali = 1;
    final hasil = await sinkronkan(PenyimpananPalsu(data), api, 'tok');
    expect(hasil.terkirim, 1);
    expect(hasil.gagal, 1);
  });

  test('catatan dari server disimpan sebagai SYNCED dan dihitung diterima', () async {
    final data = <Catatan>[];
    final api = ApiPalsu()
      ..dariServer = [
        {'id': 3, 'title': 'Dari server', 'content': '', 'latitude': null, 'longitude': null, 'updatedAt': 5},
      ];
    final hasil = await sinkronkan(PenyimpananPalsu(data), api, 'tok');
    expect(hasil.diterima, 1);
    expect(data.single.serverId, 3);
    expect(data.single.syncStatus, StatusSync.synced);
  });

  test('periksaUrlApi menolak HTTP publik dan menerima HTTP ke 10.0.2.2', () {
    expect(periksaUrlApi('http://contoh.com'), isNotNull);
    expect(periksaUrlApi('http://10.0.2.2:3000'), isNull);
    expect(periksaUrlApi('https://contoh.com'), isNull);
  });
}
