import 'package:capstone_base/services/distance.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('jarakMeter', () {
    test('titik yang sama menghasilkan nol', () {
      expect(jarakMeter(-6.9175, 107.6191, -6.9175, 107.6191), closeTo(0, 0.001));
    });

    test('jarak Jakarta ke Bandung sekitar 120 km', () {
      final km = jarakMeter(-6.2088, 106.8456, -6.9175, 107.6191) / 1000;
      expect(km, closeTo(120, 10));
    });

    test('jarak tidak bergantung pada urutan titik', () {
      final a = jarakMeter(-6.2, 106.8, -6.9, 107.6);
      final b = jarakMeter(-6.9, 107.6, -6.2, 106.8);
      expect(a, closeTo(b, 0.001));
    });
  });
}
