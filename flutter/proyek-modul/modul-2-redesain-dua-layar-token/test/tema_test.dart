import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:modul_2_redesain_dua_layar_token/kontras.dart';
import 'package:modul_2_redesain_dua_layar_token/theme/tema.dart';

void main() {
  group('tema terang', () {
    test('teks utama di atas kartu mudah dibaca (minimal 4,5)', () {
      expect(rasioKontras(Tema.teks, Tema.kartu), greaterThanOrEqualTo(4.5));
    });
    test('teks tombol di atas warna utama (minimal 4,5)', () {
      expect(rasioKontras(Tema.tombolTeks, Tema.utama), greaterThanOrEqualTo(4.5));
    });
    test('tinggi tombol minimal 48 dp', () {
      expect(Tema.tinggiTombol, greaterThanOrEqualTo(48));
    });
    test('ThemeData memakai warna utama dan latar dari tema', () {
      final t = Tema.terang();
      expect(t.scaffoldBackgroundColor, Tema.latar);
      expect(t.colorScheme.primary, Tema.utama);
    });
  });

  test('tidak ada kode warna heksadesimal di luar lib/theme/tema.dart', () {
    final berkas = Directory('lib')
        .listSync(recursive: true)
        .whereType<File>()
        .where((f) => f.path.endsWith('.dart'))
        .where((f) => !f.path.replaceAll('\\', '/').endsWith('lib/theme/tema.dart'));
    final pola = RegExp(r'0x[fF]{2}[0-9a-fA-F]{6}|#[0-9a-fA-F]{6}\b');
    final bermasalah = [
      for (final f in berkas)
        if (pola.hasMatch(f.readAsStringSync())) f.path,
    ];
    expect(bermasalah, isEmpty);
  });
}
