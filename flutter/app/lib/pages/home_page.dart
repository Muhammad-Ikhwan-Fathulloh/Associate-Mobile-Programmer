import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../theme/tema.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  static const _menu = [
    _MenuItem(
      judul: 'Catatan Lokal',
      deskripsi: 'CRUD dengan SQLite (sqflite) dan jarak dari lokasi saya',
      ikon: Icons.note_alt_outlined,
      rute: '/catatan',
    ),
    _MenuItem(
      judul: 'Lokasi dan Peta',
      deskripsi: 'GPS, peta OpenStreetMap, dan alamat dari koordinat',
      ikon: Icons.map_outlined,
      rute: '/lokasi',
    ),
    _MenuItem(
      judul: 'API dan Sinkronisasi',
      deskripsi: 'Login, kirim dan ambil catatan dari server latihan',
      ikon: Icons.sync,
      rute: '/sinkron',
    ),
    _MenuItem(
      judul: 'Jaringan Seluler',
      deskripsi: 'Jenis koneksi perangkat dan pemantauan perubahan jaringan',
      ikon: Icons.signal_cellular_alt,
      rute: '/jaringan',
    ),
    _MenuItem(
      judul: 'Sensor',
      deskripsi: 'Membaca data accelerometer secara langsung',
      ikon: Icons.sensors,
      rute: '/sensor',
    ),
    _MenuItem(
      judul: 'Informasi Perangkat',
      deskripsi: 'Merek, model, versi sistem operasi, dan arsitektur CPU',
      ikon: Icons.phone_android,
      rute: '/perangkat',
    ),
    _MenuItem(
      judul: 'Keamanan dan HTTPS',
      deskripsi: 'Penyimpanan token aman dan permintaan data melalui HTTPS',
      ikon: Icons.lock_outline,
      rute: '/keamanan',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Catatan Lokasi')),
      body: ListView.separated(
        padding: const EdgeInsets.all(Tema.spasiLg),
        itemCount: _menu.length,
        separatorBuilder: (_, __) => const SizedBox(height: Tema.spasiMd),
        itemBuilder: (context, index) {
          final item = _menu[index];
          return Card(
            clipBehavior: Clip.antiAlias,
            child: InkWell(
              onTap: () => context.push(item.rute),
              child: Padding(
                padding: const EdgeInsets.all(Tema.spasiLg),
                child: Row(
                  children: [
                    Icon(item.ikon, color: Tema.utama),
                    const SizedBox(width: Tema.spasiMd),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item.judul, style: Theme.of(context).textTheme.titleMedium),
                          const SizedBox(height: Tema.spasiXs),
                          Text(item.deskripsi, style: Theme.of(context).textTheme.bodySmall),
                        ],
                      ),
                    ),
                    const Icon(Icons.chevron_right, color: Tema.abu),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _MenuItem {
  const _MenuItem({
    required this.judul,
    required this.deskripsi,
    required this.ikon,
    required this.rute,
  });

  final String judul;
  final String deskripsi;
  final IconData ikon;
  final String rute;
}
