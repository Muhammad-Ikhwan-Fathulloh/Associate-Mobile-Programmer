import 'package:flutter/material.dart';

import '../models/post.dart';

/// Kartu post dengan animasi warna saat ditekan dan Hero pada judul.
class PostCard extends StatefulWidget {
  const PostCard({
    super.key,
    required this.post,
    required this.onTap,
  });

  final Post post;
  final VoidCallback onTap;

  @override
  State<PostCard> createState() => _PostCardState();
}

class _PostCardState extends State<PostCard> {
  bool _ditekan = false;

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return GestureDetector(
      onTapDown: (_) => setState(() => _ditekan = true),
      onTapUp: (_) => setState(() => _ditekan = false),
      onTapCancel: () => setState(() => _ditekan = false),
      onTap: widget.onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: _ditekan
              ? tema.colorScheme.primaryContainer
              : tema.colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Hero(
              tag: 'post-${widget.post.id}',
              child: Material(
                color: Colors.transparent,
                child: Text(
                  widget.post.judul,
                  style: tema.textTheme.titleMedium,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              widget.post.isi,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
