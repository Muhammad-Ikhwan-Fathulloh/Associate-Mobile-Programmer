import 'dart:convert';

import 'package:http/http.dart' as http;

/// HTTP hanya diizinkan ke alamat lokal untuk pengembangan. Selain itu wajib HTTPS.
/// Mengembalikan pesan error, atau null bila URL aman.
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

/// Bentuk data dari resource "notes" di MockAPI. `id` berupa string.
class Catatan {
  const Catatan({required this.id, required this.title, required this.content, this.latitude, this.longitude});

  final String id;
  final String title;
  final String content;
  final double? latitude;
  final double? longitude;

  factory Catatan.dariJson(Map<String, dynamic> m) => Catatan(
        id: '${m['id']}',
        title: '${m['title'] ?? ''}',
        content: '${m['content'] ?? ''}',
        latitude: (m['latitude'] as num?)?.toDouble(),
        longitude: (m['longitude'] as num?)?.toDouble(),
      );

  Map<String, Object?> keBadan() => {'title': title, 'content': content, 'latitude': latitude, 'longitude': longitude};
}

/// Klien CRUD untuk satu resource MockAPI. Semua pemanggilan ada di sini, bukan di tampilan.
class ApiClient {
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
  Future<List<Catatan>> daftar() async {
    final data = await _kirim('GET', _alamat) as List<dynamic>;
    return [for (final m in data) Catatan.dariJson(m as Map<String, dynamic>)];
  }

  /// Create: buat catatan baru.
  Future<Catatan> buat(Catatan c) async =>
      Catatan.dariJson(await _kirim('POST', _alamat, body: c.keBadan()) as Map<String, dynamic>);

  /// Update: ubah catatan yang sudah ada.
  Future<Catatan> ubah(String id, Catatan c) async =>
      Catatan.dariJson(await _kirim('PUT', '$_alamat/${Uri.encodeComponent(id)}', body: c.keBadan()) as Map<String, dynamic>);

  /// Delete: hapus catatan.
  Future<void> hapus(String id) async {
    await _kirim('DELETE', '$_alamat/${Uri.encodeComponent(id)}');
  }
}
