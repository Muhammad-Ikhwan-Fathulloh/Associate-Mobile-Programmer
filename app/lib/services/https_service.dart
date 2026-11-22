import 'dart:convert';

import 'package:http/http.dart' as http;

/// Mengembalikan pesan error jika URL tidak aman, atau null jika URL aman.
String? periksaUrlAman(String url) {
  final uri = Uri.tryParse(url.trim());
  if (uri == null || !uri.hasAuthority) {
    return 'URL tidak valid.';
  }
  if (uri.scheme != 'https') {
    return 'Gunakan HTTPS (https://).';
  }
  return null;
}

class HttpsService {
  HttpsService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  Future<dynamic> ambilJson(String url) async {
    final pesan = periksaUrlAman(url);
    if (pesan != null) {
      throw ArgumentError(pesan);
    }

    final response = await _client
        .get(Uri.parse(url.trim()), headers: {'Accept': 'application/json'})
        .timeout(const Duration(seconds: 10));

    if (response.statusCode != 200) {
      throw Exception('Server merespons status ${response.statusCode}');
    }
    return jsonDecode(response.body);
  }
}
