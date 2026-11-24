import 'package:flutter_test/flutter_test.dart';
import 'package:modul_3_pelacak_kebiasaan_sqlite/logic/streak.dart';
import 'package:modul_3_pelacak_kebiasaan_sqlite/models/habit.dart';

void main() {
  group('hitungStreak', () {
    test('kosong menghasilkan 0', () {
      expect(hitungStreak([]), 0);
    });
    test('tanggal berurutan dihitung penuh', () {
      expect(hitungStreak(['2026-03-03', '2026-03-02', '2026-03-01']), 3);
    });
    test('jeda satu hari memutus streak', () {
      expect(hitungStreak(['2026-03-05', '2026-03-04', '2026-03-02']), 2);
    });
    test('tanggal ganda hanya dihitung sekali', () {
      expect(hitungStreak(['2026-03-02', '2026-03-02', '2026-03-01']), 2);
    });
    test('urutan masukan tidak memengaruhi hasil', () {
      expect(hitungStreak(['2026-01-01', '2026-01-03', '2026-01-02']), 3);
    });
    test('melewati pergantian bulan dan tahun', () {
      expect(hitungStreak(['2027-01-01', '2026-12-31', '2026-12-30']), 3);
    });
  });

  test('tanggalDari memakai format YYYY-MM-DD dengan nol di depan', () {
    expect(tanggalDari(DateTime(2026, 1, 5, 12)), '2026-01-05');
  });

  group('validasiNama', () {
    test('menolak nama kosong dan terlalu panjang', () {
      expect(validasiNama('   '), isNotNull);
      expect(validasiNama('a' * 41), isNotNull);
    });
    test('menerima nama wajar', () {
      expect(validasiNama('Minum air'), isNull);
    });
  });
}
