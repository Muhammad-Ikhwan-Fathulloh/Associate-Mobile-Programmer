import 'dart:convert';

import 'package:http/http.dart' as http;

import 'sync_service.dart';

/// HTTP hanya diizinkan ke alamat lokal untuk pengembangan. Selain itu wajib HTTPS.
String? periksaUrlApi(String url) {
  final uri = Uri.tryParse(url.trim());
  if (uri == null || !uri.hasAuthority) return 'URL tidak valid.';
  if (uri.scheme == 'https') return null;
  if (uri.scheme == 'http' && _alamatLokal(uri.host)) return null;
  return 'Gunakan HTTPS. HTTP hanya untuk alamat lokal.';
}

bool _alamatLokal(String host) {
  if (host == 'localhost' || host == '127.0.0.1' || host == '10.0.2.2') return true;
  if (host.startsWith('10.') || host.startsWith('192.168.')) return true;
  final m = RegExp(r'^172\.(\d+)\.').firstMatch(host);
  if (m != null) {
    final n = int.parse(m.group(1)!);
    return n >= 16 && n <= 31;
  }
  return false;
}

class ApiException implements Exception {
  ApiException(this.status, this.pesan);

  final int status;
  final String pesan;

  @override
  String toString() => pesan;
}

/// Klien API. Token dikirim sebagai argumen, tidak disimpan di sini.
class ApiClient implements ApiSinkron {
  ApiClient(this.baseUrl, {http.Client? client, this.batas = const Duration(seconds: 10)})
      : _client = client ?? http.Client();

  final String baseUrl;
  final Duration batas;
  final http.Client _client;

  Future<dynamic> _kirim(String metode, String path, {String? token, Object? body}) async {
    final pesan = periksaUrlApi(baseUrl);
    if (pesan != null) throw ArgumentError(pesan);

    final base = baseUrl.trim().replaceAll(RegExp(r'/+$'), '');
    final req = http.Request(metode, Uri.parse('$base$path'));
    req.headers['Accept'] = 'application/json';
    if (token != null) req.headers['Authorization'] = 'Bearer $token';
    if (body != null) {
      req.headers['Content-Type'] = 'application/json';
      req.body = jsonEncode(body);
    }
    final res = await http.Response.fromStream(await _client.send(req).timeout(batas));
    if (res.statusCode == 204 || res.body.isEmpty) return null;
    final data = jsonDecode(res.body);
    if (res.statusCode >= 400) {
      final err = data is Map && data['error'] is String ? data['error'] as String : 'Error ${res.statusCode}';
      throw ApiException(res.statusCode, err);
    }
    return data;
  }

  Future<String> login(String email, String password) async {
    final r = await _kirim('POST', '/login', body: {'email': email, 'password': password});
    return (r as Map)['token'] as String;
  }

  @override
  Future<List<dynamic>> daftarEntri(String token) async =>
      (await _kirim('GET', '/notes', token: token)) as List<dynamic>;

  @override
  Future<Map<String, dynamic>> buatEntri(String token, Map<String, Object?> badan) async =>
      (await _kirim('POST', '/notes', token: token, body: badan)) as Map<String, dynamic>;

  @override
  Future<Map<String, dynamic>> ubahEntri(String token, int id, Map<String, Object?> badan) async =>
      (await _kirim('PUT', '/notes/$id', token: token, body: badan)) as Map<String, dynamic>;
}
