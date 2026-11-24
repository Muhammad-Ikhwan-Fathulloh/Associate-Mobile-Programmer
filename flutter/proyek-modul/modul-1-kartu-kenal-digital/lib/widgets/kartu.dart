import 'package:flutter/material.dart';

/// Kotak pembungkus yang dipakai ulang untuk profil dan daftar keahlian.
class Kartu extends StatelessWidget {
  const Kartu({super.key, required this.judul, required this.child});

  final String judul;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(judul, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            child,
          ],
        ),
      ),
    );
  }
}
