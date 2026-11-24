import 'package:flutter_test/flutter_test.dart';
import 'package:modul_1_kartu_kenal_digital/profil.dart';

void main() {
  group('inisial', () {
    test('mengambil huruf pertama dari dua kata pertama', () {
      expect(inisial('Ani Lestari'), 'AL');
    });
    test('nama satu kata menghasilkan satu huruf', () {
      expect(inisial('Budi'), 'B');
    });
    test('nama kosong menghasilkan teks kosong', () {
      expect(inisial(''), '');
      expect(inisial('   '), '');
    });
    test('spasi ganda dan huruf kecil tetap benar', () {
      expect(inisial('  ani   lestari  '), 'AL');
    });
  });
}
