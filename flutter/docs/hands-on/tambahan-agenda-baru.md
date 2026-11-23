# Tambahan Agenda Baru untuk Jalur Flutter

> **Status verifikasi:** kode Dart pada dokumen ini **belum dikompilasi dan belum dijalankan** (belum ada Flutter SDK di lingkungan penyusun). Contoh disusun mengikuti struktur aplikasi `flutter/app`. Jalankan `flutter analyze` dan `flutter test` sebelum dipakai di kelas. Jalur React Native sudah diuji (tsc, jest, expo export, dan server).

Agenda baru menambah topik Figma dan Stitch, SQLite dan MySQL, API, dan giroskop. Dokumen ini melengkapi modul Flutter yang sudah ada.

| Sesi | Materi |
|---|---|
| Hari 1, 10.00 to 12.00 | [Desain dengan Figma dan Stitch](../../../shared/docs/design-figma-stitch.md), lalu bagian 1 di bawah |
| Hari 1, 13.00 to 15.00 | Modul 3 dan [SQLite, MySQL, dan API](../../../shared/docs/sqlite-mysql-api.md) |
| Hari 1, 15.00 to 17.00 | Modul 4. Aplikasi Flutter sudah menyimpan `latitude` dan `longitude` ke SQLite di `lib/pages/note_form_page.dart` |
| Hari 2, 09.00 to 10.00 | Bagian 2 di bawah, dengan server di `shared/server` |
| Hari 2, 10.00 to 12.00 | Modul 6 dan bagian 4 (giroskop) |
| Hari 2, 13.00 to 15.00 | Bagian 3 (sinkronisasi), Modul 5 (jaringan seluler), dan Modul 7 (keamanan) |

## 1. Token desain menjadi tema Flutter

Variable Figma (lihat tabel di panduan desain) dipetakan ke satu kelas konstanta, lalu dipakai oleh `ThemeData`.

```dart
// lib/theme/tema.dart
import 'package:flutter/material.dart';

class Tema {
  static const utama = Color(0xFF1565C0);
  static const latar = Color(0xFFF5F7FB);
  static const kartu = Color(0xFFFFFFFF);
  static const teks = Color(0xFF1B1F27);
  static const abu = Color(0xFF5F6B7A);
  static const garis = Color(0xFFCFD6E0);
  static const bahaya = Color(0xFFC62828);
  static const ok = Color(0xFF2E7D32);

  static const spasiSm = 8.0, spasiMd = 12.0, spasiLg = 16.0;
  static const radiusSm = 8.0, radiusMd = 12.0;
  static const tinggiTombol = 48.0;

  static ThemeData terang() => ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: utama),
        scaffoldBackgroundColor: latar,
        appBarTheme: const AppBarTheme(backgroundColor: utama, foregroundColor: Colors.white),
        cardTheme: CardTheme(
          color: kartu,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusMd),
            side: const BorderSide(color: garis),
          ),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            minimumSize: const Size.fromHeight(tinggiTombol),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(radiusSm)),
          ),
        ),
      );
}
```

Pasang pada `MaterialApp`: `theme: Tema.terang()`. Prompt AI untuk gaya gelap: sertakan `lib/theme/tema.dart`, tangkapan layar Figma, dan batasan "ubah hanya berkas tema".

## 2. Klien API dengan paket http

Paket `http` sudah ada di `pubspec.yaml`. Server latihan mengizinkan HTTP ke alamat lokal, sehingga klien ini memeriksa alamat lokal secara terpisah dari `periksaUrlAman` untuk URL publik. Emulator Android memakai `10.0.2.2`.

```dart
// lib/services/api_client.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiException implements Exception {
  ApiException(this.status, this.pesan);
  final int status;
  final String pesan;
  @override
  String toString() => pesan;
}

class ApiClient {
  ApiClient(this.baseUrl, {http.Client? client}) : _client = client ?? http.Client();

  final String baseUrl;
  final http.Client _client;
  static const _batas = Duration(seconds: 10);

  Future<dynamic> _kirim(String metode, String path, {String? token, Object? body}) async {
    final req = http.Request(metode, Uri.parse('$baseUrl$path'));
    req.headers['Accept'] = 'application/json';
    if (token != null) req.headers['Authorization'] = 'Bearer $token';
    if (body != null) {
      req.headers['Content-Type'] = 'application/json';
      req.body = jsonEncode(body);
    }
    final res = await http.Response.fromStream(await _client.send(req).timeout(_batas));
    if (res.statusCode == 204 || res.body.isEmpty) return null;
    final data = jsonDecode(res.body);
    if (res.statusCode >= 400) {
      final pesan = data is Map && data['error'] is String ? data['error'] as String : 'Error ${res.statusCode}';
      throw ApiException(res.statusCode, pesan);
    }
    return data;
  }

  Future<String> login(String email, String password) async {
    final r = await _kirim('POST', '/login', body: {'email': email, 'password': password});
    return (r as Map)['token'] as String;
  }

  Future<List<dynamic>> daftarCatatan(String token) async =>
      (await _kirim('GET', '/notes', token: token)) as List<dynamic>;

  Future<Map<String, dynamic>> buatCatatan(String token, Map<String, Object?> catatan) async =>
      (await _kirim('POST', '/notes', token: token, body: catatan)) as Map<String, dynamic>;

  Future<Map<String, dynamic>> ubahCatatan(String token, int id, Map<String, Object?> catatan) async =>
      (await _kirim('PUT', '/notes/$id', token: token, body: catatan)) as Map<String, dynamic>;
}
```

## 3. Sinkronisasi offline-first

Tabel `notes` perlu kolom `server_id INTEGER` (naikkan versi database dan tambahkan migrasi `ALTER TABLE notes ADD COLUMN server_id INTEGER`). Alurnya sama dengan `sync.ts` pada jalur React Native: kirim yang `PENDING`, tandai `SYNCED`, lalu ambil dari server.

```dart
// Kerangka. Sesuaikan nama repository dengan lib/data/note_repository.dart
Future<({int terkirim, int diterima, int gagal})> sinkronkan(
    NoteRepository repo, ApiClient api, String token) async {
  var terkirim = 0, gagal = 0, diterima = 0;
  for (final n in await repo.catatanPending()) {
    try {
      final badan = {
        'title': n.title, 'content': n.content,
        'latitude': n.latitude, 'longitude': n.longitude,
      };
      final hasil = n.serverId == null
          ? await api.buatCatatan(token, badan)
          : await api.ubahCatatan(token, n.serverId!, badan);
      await repo.tandaiSynced(n.id!, hasil['id'] as int);
      terkirim++;
    } catch (_) {
      gagal++; // satu kegagalan tidak menghentikan yang lain
    }
  }
  for (final s in await api.daftarCatatan(token)) {
    if (await repo.simpanDariServer(s as Map<String, dynamic>)) diterima++;
  }
  return (terkirim: terkirim, diterima: diterima, gagal: gagal);
}
```

`catatanPending`, `tandaiSynced`, dan `simpanDariServer` adalah metode yang perlu ditambahkan pada `NoteRepository`. Padanan versi TypeScript yang sudah diuji ada di `reactnative/app/src/data/noteRepository.ts`.

## 4. Giroskop dan deteksi guncangan

```dart
// lib/services/sensor_math.dart
import 'dart:math' as math;

double besarVektor(double x, double y, double z) => math.sqrt(x * x + y * y + z * z);

/// Akselerometer di sensors_plus dalam m/s^2. 1 g = 9.80665 m/s^2.
bool terdeteksiGuncangan(double x, double y, double z, {double ambangG = 2}) =>
    besarVektor(x, y, z) / 9.80665 > ambangG;
```

Giroskop: `gyroscopeEventStream().listen((e) { ... e.x, e.y, e.z ... })` dalam rad/s. Hentikan langganan di `dispose()`.

Catatan satuan: `sensors_plus` melaporkan akselerometer dalam m/s², sedangkan `expo-sensors` dalam g. Karena itu ambang pada kode Dart dikonversi.
