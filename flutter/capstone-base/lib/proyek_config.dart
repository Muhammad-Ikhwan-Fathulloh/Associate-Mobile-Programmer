import 'package:flutter/material.dart';

/// Ubah berkas ini lebih dulu: identitas aplikasi Anda ada di sini.
/// Warna harus sama dengan variable di Figma Anda.
class ProyekConfig {
  ProyekConfig._();

  /// Nama aplikasi (bilah atas beranda).
  static const namaAplikasi = 'Aplikasi Saya';

  /// Kalimat pembuka beranda.
  static const tagline = 'Pilih fitur';

  /// Nama satu entri data. Contoh: 'Catatan', 'Laporan', 'Tempat', 'Perjalanan'.
  static const namaEntri = 'Catatan';

  /// Warna utama.
  static const warnaUtama = Color(0xFF1565C0);

  /// Alamat server. Emulator Android: 10.0.2.2. Ponsel fisik: IP komputer.
  static const urlServer = 'http://10.0.2.2:3000';

  /// Isi contoh catatan saat basis data masih kosong, agar aplikasi langsung terlihat hidup.
  /// Ubah ke false setelah Anda siap.
  static const contohAwal = true;

  /// Matikan fitur yang tidak dipakai agar menu bersih.
  static const fiturLokasi = true;
  static const fiturSinkron = true;
  static const fiturSensor = true;
  static const fiturJaringan = true;
  static const fiturPerangkat = true;
  static const fiturKeamanan = true;
  static const fiturKreatif = true;

  /// Ide fitur kreatif. Pilih satu atau buat sendiri.
  static const ideKreatif = [
    'Guncang ponsel untuk membuat entri cepat (sensor + SQLite).',
    'Pengingat saat dekat lokasi tersimpan (GPS + jarak Haversine).',
    'Kategori dan filter (migrasi tabel + UI).',
    'Statistik: jumlah entri per hari atau per kategori.',
    'Mode gelap dengan token kedua.',
    'Ekspor entri menjadi teks atau CSV dan bagikan.',
  ];
}
