import 'package:flutter_test/flutter_test.dart';
import 'package:powersync_cloud/config.dart';
import 'package:powersync_cloud/data/schema.dart';

void main() {
  test('konfigurasi awal belum boleh dianggap siap', () {
    expect(konfigurasiSudahDiisi(), isFalse);
  });

  test('skema punya tabel notes dengan kolom title dan content', () {
    final tabel = schema.tables.single;
    expect(tabel.name, 'notes');
    final kolom = tabel.columns.map((c) => c.name).toList();
    expect(kolom, containsAll(['title', 'content']));
    expect(kolom, isNot(contains('id')));
  });
}
