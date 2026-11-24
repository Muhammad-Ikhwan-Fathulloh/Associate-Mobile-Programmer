import 'package:flutter/material.dart';

import 'theme/tema.dart';

void main() => runApp(const AplikasiTema());

class AplikasiTema extends StatelessWidget {
  const AplikasiTema({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Redesain Dua Layar',
      debugShowCheckedModeBanner: false,
      theme: Tema.terang(),
      home: const Beranda(),
    );
  }
}

class Beranda extends StatelessWidget {
  const Beranda({super.key});

  static const _ringkasan = [
    ('Tugas', '5'),
    ('Selesai', '3'),
    ('Sisa', '2'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Beranda')),
      body: ListView(
        padding: const EdgeInsets.all(Tema.spasiLg),
        children: [
          _Kotak(
            child: Text(
              'Semua warna dan jarak pada layar ini berasal dari berkas tema.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
          const SizedBox(height: Tema.spasiMd),
          Row(
            children: [
              for (final (label, nilai) in _ringkasan)
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: Tema.spasiXs),
                    child: _Kotak(
                      child: Column(
                        children: [
                          Text(nilai, style: const TextStyle(fontSize: Tema.fontBesar, fontWeight: FontWeight.w700, color: Tema.utama)),
                          Text(label, style: Theme.of(context).textTheme.bodySmall),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: Tema.spasiMd),
          SizedBox(
            height: Tema.tinggiTombol,
            child: FilledButton(
              onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const Daftar())),
              child: const Text('Lihat daftar'),
            ),
          ),
        ],
      ),
    );
  }
}

class Daftar extends StatelessWidget {
  const Daftar({super.key});

  static const _data = [
    ('Minum air 2 liter', 'Kebiasaan harian'),
    ('Olahraga 20 menit', 'Sore hari'),
    ('Membaca 10 halaman', 'Malam hari'),
    ('Catat pengeluaran', 'Setiap selesai belanja'),
    ('Tidur sebelum 22.00', 'Target malam'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Daftar')),
      body: ListView.separated(
        padding: const EdgeInsets.all(Tema.spasiLg),
        itemCount: _data.length,
        separatorBuilder: (_, __) => const SizedBox(height: Tema.spasiSm),
        itemBuilder: (context, i) {
          final (judul, sub) = _data[i];
          return _Kotak(
            child: Row(
              children: [
                const CircleAvatar(radius: Tema.spasiSm / 2 + 2, backgroundColor: Tema.utama),
                const SizedBox(width: Tema.spasiMd),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(judul, style: const TextStyle(fontSize: Tema.fontIsi, fontWeight: FontWeight.w600, color: Tema.teks)),
                      Text(sub, style: Theme.of(context).textTheme.bodySmall),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _Kotak extends StatelessWidget {
  const _Kotak({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(Tema.spasiLg),
      decoration: BoxDecoration(
        color: Tema.kartu,
        borderRadius: BorderRadius.circular(Tema.radiusMd),
        border: Border.all(color: Tema.garis),
      ),
      child: child,
    );
  }
}
