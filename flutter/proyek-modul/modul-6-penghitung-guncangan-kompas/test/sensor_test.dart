import 'package:flutter_test/flutter_test.dart';
import 'package:modul_6_penghitung_guncangan_kompas/services/sensor_math.dart';

void main() {
  group('terdeteksiGuncangan', () {
    test('diam di meja (sekitar 1 g) tidak terhitung', () {
      expect(terdeteksiGuncangan(const Vektor(0, 0, 1)), isFalse);
    });
    test('di bawah ambang tidak terhitung', () {
      expect(terdeteksiGuncangan(const Vektor(1.9, 0, 0), ambang: 2), isFalse);
    });
    test('tepat di ambang belum terhitung', () {
      expect(terdeteksiGuncangan(const Vektor(2, 0, 0), ambang: 2), isFalse);
    });
    test('di atas ambang terhitung', () {
      expect(terdeteksiGuncangan(const Vektor(2.1, 0, 0), ambang: 2), isTrue);
    });
    test('besar vektor memakai Pythagoras tiga sumbu', () {
      expect(besarVektor(const Vektor(3, 4, 0)), closeTo(5, 1e-9));
    });
  });

  group('PendeteksiGuncangan', () {
    const kuat = Vektor(3, 0, 0);
    const diam = Vektor(0, 0, 1);

    test('satu guncangan yang berlangsung beberapa pembacaan hanya dihitung sekali', () {
      final p = PendeteksiGuncangan(ambang: 2, jedaMs: 800);
      final hitung = [0, 100, 200, 300].where((t) => p.masukkan(kuat, t)).length;
      expect(hitung, 1);
    });
    test('guncangan setelah jeda dihitung lagi', () {
      final p = PendeteksiGuncangan(ambang: 2, jedaMs: 800);
      expect(p.masukkan(kuat, 0), isTrue);
      expect(p.masukkan(diam, 900), isFalse);
      expect(p.masukkan(kuat, 1000), isTrue);
    });
  });

  group('arahKompas dan mataAngin', () {
    test('mataAngin(0) bernilai U dan mataAngin(90) bernilai T', () {
      expect(mataAngin(0), 'U');
      expect(mataAngin(90), 'T');
    });
    test('sudut negatif dan lebih dari 360 tetap valid', () {
      expect(mataAngin(-90), 'B');
      expect(mataAngin(450), 'T');
    });
    test('arahKompas selalu di rentang 0 sampai 360', () {
      final d = arahKompas(10, -3);
      expect(d, greaterThanOrEqualTo(0));
      expect(d, lessThan(360));
    });
  });
}
