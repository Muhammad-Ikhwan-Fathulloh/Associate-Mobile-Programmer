import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:modul_8_paket_bukti_kompetensi/bukti.dart';

void main() {
  // flutter test dijalankan dari folder proyek. Folder modul lain berada satu tingkat di atasnya.
  final akar = Directory.current.parent.path;

  test('memuat tujuh unit kompetensi', () {
    expect(buktiKompetensi, hasLength(7));
  });

  test('kode unit tidak ada yang ganda', () {
    final kode = buktiKompetensi.map((b) => b.unit).toList();
    expect(kode.toSet(), hasLength(kode.length));
  });

  test('setiap baris menunjuk berkas yang benar-benar ada', () {
    final hilang = [
      for (final b in buktiKompetensi)
        if (!File('$akar/${b.folder}/${b.berkas}').existsSync()) '${b.folder}/${b.berkas}',
    ];
    expect(hilang, isEmpty);
  });
}
