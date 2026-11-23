import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../proyek_config.dart';
import '../theme/tema.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  static List<_MenuItem> get _menu {
    const e = ProyekConfig.namaEntri;
    return [
      const _MenuItem(
        judul: e,
        deskripsi: 'Daftar di SQLite: tambah, ubah, hapus',
        ikon: Icons.note_alt_outlined,
        rute: '/catatan',
      ),
      if (ProyekConfig.fiturLokasi)
        const _MenuItem(
          judul: 'Lokasi dan Peta',
          deskripsi: 'GPS, jarak, dan peta OpenStreetMap',
          ikon: Icons.map_outlined,
          rute: '/lokasi',
        ),
      if (ProyekConfig.fiturSinkron)
        const _MenuItem(
          judul: 'API dan Sinkronisasi',
          deskripsi: 'Kirim dan ambil data dari server latihan',
          ikon: Icons.sync,
          rute: '/sinkron',
        ),
      if (ProyekConfig.fiturSensor)
        const _MenuItem(
          judul: 'Sensor',
          deskripsi: 'Akselerometer dan sensor lain',
          ikon: Icons.sensors,
          rute: '/sensor',
        ),
      if (ProyekConfig.fiturJaringan)
        const _MenuItem(
          judul: 'Jaringan',
          deskripsi: 'Jenis koneksi perangkat',
          ikon: Icons.signal_cellular_alt,
          rute: '/jaringan',
        ),
      if (ProyekConfig.fiturPerangkat)
        const _MenuItem(
          judul: 'Informasi Perangkat',
          deskripsi: 'Model dan versi sistem operasi',
          ikon: Icons.phone_android,
          rute: '/perangkat',
        ),
      if (ProyekConfig.fiturKeamanan)
        const _MenuItem(
          judul: 'Keamanan dan HTTPS',
          deskripsi: 'Penyimpanan token aman dan HTTPS',
          ikon: Icons.lock_outline,
          rute: '/keamanan',
        ),
      if (ProyekConfig.fiturKreatif)
        const _MenuItem(
          judul: 'Fitur Kreatif',
          deskripsi: 'Tempat fitur buatan Anda',
          ikon: Icons.auto_awesome,
          rute: '/kreatif',
        ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final menu = _menu;
    return Scaffold(
      appBar: AppBar(title: const Text(ProyekConfig.namaAplikasi)),
      body: ListView.separated(
        padding: const EdgeInsets.all(Tema.spasiLg),
        itemCount: menu.length,
        separatorBuilder: (_, __) => const SizedBox(height: Tema.spasiMd),
        itemBuilder: (context, index) {
          final item = menu[index];
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
