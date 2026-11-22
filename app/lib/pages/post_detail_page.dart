import 'package:flutter/material.dart';

import '../models/post.dart';
import '../services/post_service.dart';

class PostDetailPage extends StatefulWidget {
  const PostDetailPage({super.key, required this.postId});

  final int postId;

  @override
  State<PostDetailPage> createState() => _PostDetailPageState();
}

class _PostDetailPageState extends State<PostDetailPage> {
  final _service = PostService();
  late final Future<Post> _future;

  @override
  void initState() {
    super.initState();
    _future = _service.ambilById(widget.postId);
  }

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Detail Post')),
      body: FutureBuilder<Post>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Text('Gagal memuat detail: ${snapshot.error}'),
            );
          }

          final post = snapshot.requireData;
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Hero(
                tag: 'post-${post.id}',
                child: Material(
                  color: Colors.transparent,
                  child: Text(post.judul, style: tema.textTheme.headlineSmall),
                ),
              ),
              const SizedBox(height: 16),
              Text(post.isi, style: tema.textTheme.bodyLarge),
              const SizedBox(height: 16),
              Text(
                'ID post: ${post.id}',
                style: tema.textTheme.bodySmall,
              ),
            ],
          );
        },
      ),
    );
  }
}
