import 'dart:async';

import 'package:http/http.dart' as http;

import 'api_client.dart';

/// Mengubah galat teknis menjadi pesan yang bisa dibaca pengguna.
String pesanRamah(Object e) {
  if (e is ApiException) return e.pesan;
  if (e is TimeoutException) return 'Server terlalu lama merespons. Coba lagi.';
  if (e is http.ClientException) return 'Server tidak dapat dijangkau. Pastikan server berjalan dan alamatnya benar.';
  if (e is ArgumentError) return e.message.toString();
  return 'Terjadi kesalahan yang tidak dikenal.';
}
