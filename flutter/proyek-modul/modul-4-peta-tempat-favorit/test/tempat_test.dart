import 'package:flutter_test/flutter_test.dart';
import 'package:modul_4_peta_tempat_favorit/models/tempat.dart';
import 'package:modul_4_peta_tempat_favorit/services/distance.dart';
import 'package:modul_4_peta_tempat_favorit/services/tempat.dart';

void main() {
  group('jarakMeter (Haversine)', () {
    test('Bandung ke Jakarta sekitar 120 km (toleransi 5 km)', () {
      final meter = jarakMeter(-6.9175, 107.6191, -6.2088, 106.8456);
      expect(meter, greaterThan(115000));
      expect(meter, lessThan(125000));
    });
    test('titik yang sama berjarak 0', () {
      expect(jarakMeter(-6.9, 107.6, -6.9, 107.6), closeTo(0, 1e-6));
    });
  });

  test('formatJarak memakai meter di bawah 1 km dan kilometer selain itu', () {
    expect(formatJarak(850.4), '850 m');
    expect(formatJarak(1500), '1.5 km');
  });

  final daftar = [
    const Tempat(id: 1, nama: 'Jauh', latitude: -6.2088, longitude: 106.8456),
    const Tempat(id: 2, nama: 'Tanpa lokasi'),
    const Tempat(id: 3, nama: 'Dekat', latitude: -6.9176, longitude: 107.6192),
  ];

  test('tempatUntukPeta membuang tempat tanpa koordinat', () {
    expect(tempatUntukPeta(daftar).map((t) => t.nama), ['Jauh', 'Dekat']);
  });

  test('urutkanJarak mengurutkan dari yang terdekat dan menaruh tanpa koordinat di akhir', () {
    final hasil = urutkanJarak(daftar, latitude: -6.9175, longitude: 107.6191);
    expect(hasil.map((b) => b.tempat.nama), ['Dekat', 'Jauh', 'Tanpa lokasi']);
    expect(hasil.last.jarakM, isNull);
  });

  test('validasiNama menolak nama kosong', () {
    expect(validasiNama('  '), isNotNull);
    expect(validasiNama('Kafe'), isNull);
  });
}
