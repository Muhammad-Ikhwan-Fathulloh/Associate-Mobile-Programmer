import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../blocs/post_cubit.dart';
import '../models/post.dart';
import '../widgets/post_card.dart';

class PostsPage extends StatelessWidget {
  const PostsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Daftar Post (API Publik)')),
      body: BlocBuilder<PostCubit, PostState>(
        builder: (context, state) {
          final sedangMemuatAwal = state.status == PostStatus.awal ||
              (state.status == PostStatus.memuat && state.posts.isEmpty);
          if (sedangMemuatAwal) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state.status == PostStatus.gagal && state.posts.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(state.error ?? 'Terjadi kesalahan'),
                  const SizedBox(height: 12),
                  FilledButton(
                    onPressed: () => context.read<PostCubit>().load(),
                    child: const Text('Coba lagi'),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => context.read<PostCubit>().load(),
            child: state.posts.isEmpty
                ? ListView(
                    children: const [
                      SizedBox(height: 120),
                      Center(child: Text('Data kosong')),
                    ],
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: state.posts.length,
                    itemBuilder: (context, index) {
                      final post = state.posts[index];
                      return PostCard(
                        post: post,
                        onTap: () => context.push('/post/${post.id}'),
                      );
                    },
                  ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        icon: const Icon(Icons.add),
        label: const Text('Post baru'),
        onPressed: () async {
          final post = await context.push<Post>('/post/baru');
          if (post == null || !context.mounted) return;

          final ok = await context.read<PostCubit>().kirim(post);
          if (!context.mounted) return;

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(ok ? 'Post berhasil dikirim' : 'Gagal mengirim post'),
            ),
          );
        },
      ),
    );
  }
}
