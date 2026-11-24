import 'package:flutter_test/flutter_test.dart';
import 'package:capstone_contoh/models/entri.dart';
import 'package:capstone_contoh/services/api_client.dart';
import 'package:capstone_contoh/services/geo.dart';
import 'package:capstone_contoh/services/kompas_sensor.dart';
import 'package:capstone_contoh/services/sync_service.dart';

class PenyimpananPalsu implements PenyimpananEntri {
  PenyimpananPalsu(this.data);

  final List<Entri> data;

  @override
  Future<List<Entri>> entriPending() async => data.where((e) => e.status == StatusSync.pending).toList();

  @override
  Future<void> tandaiSynced(int id, int serverId) async {
    final i = data.indexWhere((e) => e.id == id);
    data[i] = data[i].copyWith(status: StatusSync.synced, serverId: serverId);
  }

  @override
  Future<bool> simpanDariServer(Entri e, int serverId) async {
    final i = data.indexWhere((x) => x.serverId == serverId);
    if (i >= 0) {
      data[i] = e.copyWith(serverId: serverId);
      return false;
    }
    data.add(e.copyWith(serverId: serverId));
    return true;
  }
}

class ApiPalsu implements ApiSinkron {
  final dibuat = <Map<String, Object?>>[];
  final diubah = <int>[];
  List<dynamic> dariServer = [];

  @override
  Future<Map<String, dynamic>> buatEntri(String token, Map<String, Object?> badan) async {
    dibuat.add(badan);
    return {'id': 77};
  }

  @override
  Future<Map<String, dynamic>> ubahEntri(String token, int id, Map<String, Object?> badan) async {
    diubah.add(id);
    return {'id': id};
  }

  @override
  Future<List<dynamic>> daftarEntri(String token) async => dariServer;
}

Entri _entri({int? id, int? serverId}) => Entri(
      id: id,
      serverId: serverId,
      judul: 'Perjalanan',
      catatan: 'Isi',
      updatedAt: 1,
    );

void main() {
  group('jarak dan arah (fungsi murni)', () {
    test('Bandung ke Jakarta sekitar 120 km (toleransi 5 km)', () {
      final m = jarakMeter(-6.9175, 107.6191, -6.2088, 106.8456);
      expect(m, greaterThan(115000));
      expect(m, lessThan(125000));
    });
    test('arah ke utara dari khatulistiwa adalah 0 derajat', () {
      expect(arahKeTujuan(0, 0, 1, 0), closeTo(0, 1e-6));
    });
    test('arah ke timur dari khatulistiwa adalah 90 derajat', () {
      expect(arahKeTujuan(0, 0, 0, 1), closeTo(90, 1e-6));
    });
    test('arahRelatif: tujuan tepat di depan menghasilkan 0', () {
      expect(arahRelatif(90, 90), closeTo(0, 1e-9));
    });
    test('arahRelatif: tujuan di kiri negatif, di kanan positif', () {
      expect(arahRelatif(10, 0), greaterThan(0));
      expect(arahRelatif(350, 0), lessThan(0));
    });
    test('formatJarak memakai meter di bawah 1 km', () {
      expect(formatJarak(850), '850 m');
      expect(formatJarak(1500), '1.5 km');
    });
  });

  group('validasi entri', () {
    test('judul kosong ditolak, judul wajar diterima', () {
      expect(validasiJudul('   '), isNotNull);
      expect(validasiJudul('Ke Bromo'), isNull);
    });
  });

  group('sinkronisasi', () {
    test('entri baru memakai POST lalu berstatus SYNCED', () async {
      final data = [_entri(id: 1)];
      final api = ApiPalsu();
      final h = await sinkronkan(PenyimpananPalsu(data), api, 'tok');
      expect(api.dibuat, hasLength(1));
      expect(data.first.status, StatusSync.synced);
      expect(h.terkirim, 1);
    });
    test('entri yang sudah punya serverId memakai PUT', () async {
      final data = [_entri(id: 1, serverId: 5)];
      final api = ApiPalsu();
      await sinkronkan(PenyimpananPalsu(data), api, 'tok');
      expect(api.diubah, [5]);
      expect(api.dibuat, isEmpty);
    });
    test('entri dari server masuk sebagai SYNCED', () async {
      final data = <Entri>[];
      final api = ApiPalsu()
        ..dariServer = [
          {'id': 3, 'title': 'Dari server', 'content': '', 'latitude': null, 'longitude': null, 'updatedAt': 5},
        ];
      final h = await sinkronkan(PenyimpananPalsu(data), api, 'tok');
      expect(h.diterima, 1);
      expect(data.single.serverId, 3);
    });
    test('alamat HTTP publik ditolak, alamat lokal dan HTTPS diterima', () {
      expect(periksaUrlApi('http://contoh.com'), isNotNull);
      expect(periksaUrlApi('http://10.0.2.2:3000'), isNull);
      expect(periksaUrlApi('https://contoh.com'), isNull);
    });
  });

  group('sensor', () {
    test('guncangan di atas ambang dihitung sekali dalam jeda', () {
      final p = PendeteksiGuncangan(ambang: 2, jedaMs: 800);
      final hitung = [0, 100, 200, 1000].where((t) => p.masukkan(3, t)).length;
      expect(hitung, 2);
    });
    test('pembacaan diam (sekitar 1 g) tidak terhitung', () {
      expect(PendeteksiGuncangan().masukkan(1, 0), isFalse);
    });
  });
}
