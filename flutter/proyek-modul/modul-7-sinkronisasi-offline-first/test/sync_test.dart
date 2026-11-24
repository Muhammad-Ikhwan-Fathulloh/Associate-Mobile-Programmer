import 'package:flutter_test/flutter_test.dart';
import 'package:modul_7_sinkronisasi_offline_first/models/catatan.dart';
import 'package:modul_7_sinkronisasi_offline_first/services/api_client.dart';
import 'package:modul_7_sinkronisasi_offline_first/services/sync_service.dart';

class PenyimpananPalsu implements PenyimpananCatatan {
  PenyimpananPalsu(this.data);

  final List<Catatan> data;

  @override
  Future<List<Catatan>> catatanPending() async => data.where((c) => c.syncStatus == StatusSync.pending).toList();

  @override
  Future<void> tandaiSynced(int id, String serverId) async {
    final i = data.indexWhere((c) => c.id == id);
    data[i] = data[i].copyWith(syncStatus: StatusSync.synced, serverId: serverId);
  }

  @override
  Future<bool> simpanDariServer(Catatan c, String serverId) async {
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
  final dibuat = <Map<String, Object?>>[];
  final diubah = <String>[];
  int gagalSekali = 0;
  List<Map<String, dynamic>> dariServer = [];

  @override
  Future<Map<String, dynamic>> buat(Map<String, Object?> badan) async {
    if (gagalSekali > 0) {
      gagalSekali--;
      throw Exception('jaringan putus');
    }
    dibuat.add(badan);
    return {'id': '77', 'title': badan['title']};
  }

  @override
  Future<Map<String, dynamic>> ubah(String id, Map<String, Object?> badan) async {
    diubah.add(id);
    return {'id': id, 'title': badan['title']};
  }

  @override
  Future<List<Map<String, dynamic>>> daftar() async => dariServer;
}

Catatan _catatan({int? id, String? serverId, String title = 'Judul'}) =>
    Catatan(id: id, serverId: serverId, title: title, content: 'Isi', updatedAt: 1);

void main() {
  test('catatan baru memakai POST lalu berstatus SYNCED dengan id string', () async {
    final data = [_catatan(id: 1)];
    final api = ApiPalsu();
    final hasil = await sinkronkan(PenyimpananPalsu(data), api);
    expect(api.dibuat, hasLength(1));
    expect(data.first.syncStatus, StatusSync.synced);
    expect(data.first.serverId, '77');
    expect(hasil.terkirim, 1);
  });

  test('catatan yang sudah punya serverId memakai PUT', () async {
    final data = [_catatan(id: 1, serverId: 'abc')];
    final api = ApiPalsu();
    await sinkronkan(PenyimpananPalsu(data), api);
    expect(api.diubah, ['abc']);
    expect(api.dibuat, isEmpty);
  });

  test('kegagalan satu catatan tidak menghentikan yang lain', () async {
    final data = [_catatan(id: 1, title: 'A'), _catatan(id: 2, title: 'B')];
    final api = ApiPalsu()..gagalSekali = 1;
    final hasil = await sinkronkan(PenyimpananPalsu(data), api);
    expect(hasil.terkirim, 1);
    expect(hasil.gagal, 1);
  });

  test('catatan dari MockAPI masuk sebagai SYNCED', () async {
    final data = <Catatan>[];
    final api = ApiPalsu()
      ..dariServer = [
        {'id': '3', 'title': 'Dari server', 'content': '', 'latitude': null, 'longitude': null},
      ];
    final hasil = await sinkronkan(PenyimpananPalsu(data), api);
    expect(hasil.diterima, 1);
    expect(data.single.serverId, '3');
    expect(data.single.syncStatus, StatusSync.synced);
  });

  test('alamat HTTP publik ditolak, HTTPS diterima', () {
    expect(periksaUrlApi('http://contoh.com'), isNotNull);
    expect(periksaUrlApi('https://contoh.mockapi.io/api/v1/notes'), isNull);
  });
}
