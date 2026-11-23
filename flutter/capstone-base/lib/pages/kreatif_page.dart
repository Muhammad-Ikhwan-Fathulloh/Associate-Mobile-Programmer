import 'package:flutter/material.dart';

import '../proyek_config.dart';
import '../theme/tema.dart';

// TODO(peserta): ganti halaman ini dengan fitur kreatif Anda.
// Syarat: bukan sekadar menampilkan angka. Fitur harus memakai minimal dua materi
// (misalnya sensor + SQLite, atau GPS + API), punya penanganan kasus gagal, dan satu tes.
class KreatifPage extends StatelessWidget {
  const KreatifPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fitur Kreatif')),
      body: ListView(
        padding: const EdgeInsets.all(Tema.spasiLg),
        children: [
          Text('Fitur kreatif ${ProyekConfig.namaAplikasi}', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: Tema.spasiSm),
          Text('Ganti isi halaman ini. Beberapa ide:', style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(height: Tema.spasiSm),
          for (final ide in ProyekConfig.ideKreatif)
            Padding(
              padding: const EdgeInsets.only(bottom: Tema.spasiXs),
              child: Text('• $ide'),
            ),
        ],
      ),
    );
  }
}
