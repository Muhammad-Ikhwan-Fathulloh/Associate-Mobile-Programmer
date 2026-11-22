# Modul 7: Networking: REST API dan JSON

**Durasi:** 13.00 to 15.00

## Tujuan Pembelajaran

1. Memahami alur request dan response HTTP.
2. Mengambil data dari REST API dengan package `http`.
3. Mengubah JSON menjadi model Dart.
4. Menangani loading, error, dan data kosong pada UI.

## 1. Konsep Dasar

| Istilah | Keterangan |
|---|---|
| Endpoint | Alamat URL tempat resource tersedia |
| Method | `GET` (ambil), `POST` (kirim), `PUT` (ubah), `DELETE` (hapus) |
| Status code | `200` berhasil, `404` tidak ditemukan, `500` error server |
| JSON | Format pertukaran data berbasis teks |

## 2. Persiapan

```yaml
dependencies:
  http: ^1.2.2 # sesuaikan dengan versi stabil terbaru
```

Izin internet di Android sudah ditambahkan pada Modul 4. Pada iOS, koneksi HTTPS tidak memerlukan konfigurasi tambahan.

## 3. Model dengan fromJson

```dart
// lib/models/post.dart
class Post {
  final int id;
  final String judul;
  final String isi;

  const Post({required this.id, required this.judul, required this.isi});

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as int,
      judul: json['title'] as String,
      isi: json['body'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': judul,
        'body': isi,
      };
}
```

## 4. Service API

Contoh di atas memakai API publik JSONPlaceholder (https://jsonplaceholder.typicode.com).

```dart
// lib/data/post_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/post.dart';

class PostService {
  static const _baseUrl = 'https://jsonplaceholder.typicode.com';

  Future<List<Post>> ambilSemuaPost() async {
    final response = await http
        .get(Uri.parse('$_baseUrl/posts'))
        .timeout(const Duration(seconds: 10));

    if (response.statusCode != 200) {
      throw Exception('Gagal memuat data (status ${response.statusCode})');
    }

    final List<dynamic> data = jsonDecode(response.body) as List<dynamic>;
    return data
        .map((item) => Post.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<Post> tambahPost(Post post) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/posts'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(post.toJson()),
    );

    if (response.statusCode != 201) {
      throw Exception('Gagal mengirim data (status ${response.statusCode})');
    }

    return Post.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }
}
```

## 5. Menampilkan Data dengan FutureBuilder

```dart
// lib/pages/post_page.dart
import 'package:flutter/material.dart';
import '../data/post_service.dart';
import '../models/post.dart';

class PostPage extends StatefulWidget {
  const PostPage({super.key});

  @override
  State<PostPage> createState() => _PostPageState();
}

class _PostPageState extends State<PostPage> {
  final _service = PostService();
  late Future<List<Post>> _futurePosts;

  @override
  void initState() {
    super.initState();
    _futurePosts = _service.ambilSemuaPost();
  }

  Future<void> _muatUlang() async {
    setState(() {
      _futurePosts = _service.ambilSemuaPost();
    });
    await _futurePosts;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Daftar Post')),
      body: RefreshIndicator(
        onRefresh: _muatUlang,
        child: FutureBuilder<List<Post>>(
          future: _futurePosts,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError) {
              return ListView(
                children: [
                  const SizedBox(height: 80),
                  Center(child: Text('Terjadi kesalahan: ${snapshot.error}')),
                ],
              );
            }
            final daftar = snapshot.data ?? [];
            if (daftar.isEmpty) {
              return const Center(child: Text('Data kosong'));
            }
            return ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: daftar.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final post = daftar[index];
                return Card(
                  child: ListTile(
                    title: Text(post.judul),
                    subtitle: Text(
                      post.isi,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
```

`RefreshIndicator` memerlukan child yang dapat di-scroll, sehingga pesan error dibungkus dengan `ListView`.

## 6. Integrasi dengan Cubit (opsional)

Untuk aplikasi yang lebih besar, panggilan API sebaiknya dipindahkan ke Cubit (Modul 5) sehingga UI hanya menampilkan state:

```dart
sealed class PostState {}
class PostLoading extends PostState {}
class PostLoaded extends PostState {
  final List<Post> daftar;
  PostLoaded(this.daftar);
}
class PostError extends PostState {
  final String pesan;
  PostError(this.pesan);
}
```

## Latihan

1. Tampilkan detail post saat item diklik, dengan mengambil data `GET /posts/{id}`.
2. Tambahkan form untuk mengirim post baru dengan `POST /posts`, lalu tampilkan status pengiriman.
3. Tangani kondisi tidak ada koneksi internet dengan pesan yang jelas.
