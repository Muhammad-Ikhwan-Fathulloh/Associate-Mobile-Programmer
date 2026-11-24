import 'dart:convert';

import 'package:http/http.dart' as http;

import 'sync_service.dart';

/// HTTP hanya diizinkan ke alamat lokal untuk pengembangan. Selain itu wajib HTTPS.
String? periksaUrlApi(String url) {
  final uri = Uri.tryParse(url.trim());
  if (uri == null || !uri.hasAuthority) return 'URL tidak valid.';
  if (uri.scheme == 'https') return null;
  if (uri.scheme == 'http' && (uri.host == 'localhost' || uri.host == '127.0.0.1' || uri.host == '10.0.2.2')) {
    return null;
  }
  return 'Gunakan HTTPS. HTTP hanya untuk alamat lokal.';
}

class ApiException implements Exception {
  ApiException(this.status, this.pesan);

  final int status;
  final String pesan;

  @override
  String toString() => pesan;
}

/// Klien CRUD untuk resource MockAPI. Data dikirim dan diterima sebagai Map JSON.
/// Id dari MockAPI berupa string.
class ApiClient implements ApiSinkron {
  ApiClient(this.baseUrl, {http.Client? client, this.batas = const Duration(seconds: 10)})
      : _client = client ?? http.Client();

  final String baseUrl;
  final Duration batas;
  final http.Client _client;

  String get _alamat => baseUrl.trim().replaceAll(RegExp(r'/+$'), '');

  Future<dynamic> _kirim(String metode, String url, {Object? body}) async {
    final pesan = periksaUrlApi(url);
    if (pesan != null) throw ArgumentError(pesan);

    final req = http.Request(metode, Uri.parse(url));
    req.headers['Accept'] = 'application/json';
    if (body != null) {
      req.headers['Content-Type'] = 'application/json';
      req.body = jsonEncode(body);
    }
    final res = await http.Response.fromStream(await _client.send(req).timeout(batas));
    if (res.statusCode == 204 || res.body.isEmpty) {
      if (res.statusCode >= 400) throw ApiException(res.statusCode, 'Error ${res.statusCode}');
      return null;
    }
    final data = jsonDecode(res.body);
    if (res.statusCode >= 400) {
      final err = data is Map && data['error'] is String ? data['error'] as String : 'Error ${res.statusCode}';
      throw ApiException(res.statusCode, err);
    }
    return data;
  }

  /// Read: daftar semua catatan.
  @override
  Future<List<Map<String, dynamic>>> daftar() async {
    final data = await _kirim('GET', _alamat) as List<dynamic>;
    return [for (final m in data) m as Map<String, dynamic>];
  }

  /// Create: buat catatan baru.
  @override
  Future<Map<String, dynamic>> buat(Map<String, Object?> badan) async =>
      await _kirim('POST', _alamat, body: badan) as Map<String, dynamic>;

  /// Update: ubah catatan yang sudah ada.
  @override
  Future<Map<String, dynamic>> ubah(String id, Map<String, Object?> badan) async =>
      await _kirim('PUT', '$_alamat/${Uri.encodeComponent(id)}', body: badan) as Map<String, dynamic>;

  /// Delete: hapus catatan.
  Future<void> hapus(String id) async {
    await _kirim('DELETE', '$_alamat/${Uri.encodeComponent(id)}');
  }
}
