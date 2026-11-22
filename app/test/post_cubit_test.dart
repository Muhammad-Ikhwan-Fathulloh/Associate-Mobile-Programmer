import 'dart:convert';

import 'package:associate_mobile_app/blocs/post_cubit.dart';
import 'package:associate_mobile_app/models/post.dart';
import 'package:associate_mobile_app/services/post_service.dart';
import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

final _dataContoh = [
  {'id': 1, 'title': 'Judul uji', 'body': 'Isi uji', 'userId': 1},
];

void main() {
  group('PostCubit.load', () {
    blocTest<PostCubit, PostState>(
      'memuat daftar post dari API',
      build: () {
        final client = MockClient((request) async {
          expect(request.url.path, '/posts');
          return http.Response(jsonEncode(_dataContoh), 200);
        });
        return PostCubit(PostService(client: client));
      },
      act: (cubit) => cubit.load(),
      expect: () => [
        const PostState(status: PostStatus.memuat),
        const PostState(
          status: PostStatus.berhasil,
          posts: [Post(id: 1, judul: 'Judul uji', isi: 'Isi uji')],
        ),
      ],
    );

    blocTest<PostCubit, PostState>(
      'menampilkan status gagal saat server mengembalikan error',
      build: () {
        final client = MockClient((_) async => http.Response('', 500));
        return PostCubit(PostService(client: client));
      },
      act: (cubit) => cubit.load(),
      expect: () => [
        const PostState(status: PostStatus.memuat),
        isA<PostState>().having((s) => s.status, 'status', PostStatus.gagal),
      ],
    );
  });
}
