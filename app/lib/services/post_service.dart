import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/post.dart';

/// Layanan REST API publik JSONPlaceholder (https://jsonplaceholder.typicode.com).
/// Data pada API ini bersifat tiruan: POST tidak benar-benar disimpan di server.
class PostService {
  PostService({
    http.Client? client,
    String baseUrl = 'https://jsonplaceholder.typicode.com',
  })  : _client = client ?? http.Client(),
        _baseUrl = baseUrl;

  final http.Client _client;
  final String _baseUrl;

  static const _batasWaktu = Duration(seconds: 10);

  /// GET /posts?_limit=...
  Future<List<Post>> ambilSemua({int limit = 20}) async {
    final uri = Uri.parse('$_baseUrl/posts?_limit=$limit');
    final response = await _client.get(uri).timeout(_batasWaktu);
    _periksaStatus(response, 200);

    final data = jsonDecode(response.body) as List<dynamic>;
    return data
        .map((item) => Post.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  /// GET /posts/{id}
  Future<Post> ambilById(int id) async {
    final uri = Uri.parse('$_baseUrl/posts/$id');
    final response = await _client.get(uri).timeout(_batasWaktu);
    _periksaStatus(response, 200);

    return Post.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  /// POST /posts
  Future<Post> tambah(Post post) async {
    final uri = Uri.parse('$_baseUrl/posts');
    final response = await _client
        .post(
          uri,
          headers: {'Content-Type': 'application/json; charset=UTF-8'},
          body: jsonEncode(post.toJson()),
        )
        .timeout(_batasWaktu);
    _periksaStatus(response, 201);

    return Post.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  void _periksaStatus(http.Response response, int diharapkan) {
    if (response.statusCode != diharapkan) {
      throw Exception('Permintaan gagal (status ${response.statusCode})');
    }
  }
}
