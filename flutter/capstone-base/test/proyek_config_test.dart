import 'package:capstone_base/proyek_config.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('konfigurasi proyek terisi', () {
    expect(ProyekConfig.namaAplikasi, isNotEmpty);
    expect(ProyekConfig.namaEntri, isNotEmpty);
    expect(ProyekConfig.urlServer, startsWith('http'));
  });

  // TODO(peserta): ganti dengan tes sungguhan untuk fitur Anda.
  test('tes milik peserta: fungsi pencarian judul', () {}, skip: 'TODO(peserta)');
  test('tes milik peserta: migrasi mempertahankan data lama', () {}, skip: 'TODO(peserta)');
  test('tes milik peserta: fitur kreatif kasus normal dan gagal', () {}, skip: 'TODO(peserta)');
}
