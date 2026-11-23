import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

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
      appBar: AppBar(title: const Text('Associate Mobile Programmer')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _menu.length,
        separatorBuilder: (_, __) => const SizedBox(height: 8),
        itemBuilder: (context, index) {
          final item = _menu[index];
          return Card(
            child: ListTile(
              leading: Icon(item.ikon),
              title: Text(item.judul),
              subtitle: Text(item.deskripsi),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.push(item.rute),
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
