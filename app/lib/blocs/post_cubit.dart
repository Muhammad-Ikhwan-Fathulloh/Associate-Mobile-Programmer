import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../models/post.dart';
import '../services/post_service.dart';

enum PostStatus { awal, memuat, berhasil, gagal }

class PostState extends Equatable {
  const PostState({
    this.status = PostStatus.awal,
    this.posts = const [],
    this.error,
  });

  final PostStatus status;
  final List<Post> posts;
  final String? error;

  PostState copyWith({PostStatus? status, List<Post>? posts}) {
    return PostState(
      status: status ?? this.status,
      posts: posts ?? this.posts,
    );
  }

  @override
  List<Object?> get props => [status, posts, error];
}

class PostCubit extends Cubit<PostState> {
  PostCubit(this._service) : super(const PostState());

  final PostService _service;

  Future<void> load() async {
    emit(PostState(status: PostStatus.memuat, posts: state.posts));
    try {
      final posts = await _service.ambilSemua();
      emit(PostState(status: PostStatus.berhasil, posts: posts));
    } catch (e) {
      emit(PostState(
        status: PostStatus.gagal,
        posts: state.posts,
        error: 'Gagal memuat data: $e',
      ));
    }
  }

  /// Mengirim post baru. Mengembalikan true jika berhasil.
  Future<bool> kirim(Post post) async {
    try {
      final baru = await _service.tambah(post);
      emit(state.copyWith(posts: [baru, ...state.posts]));
      return true;
    } catch (_) {
      return false;
    }
  }
}
