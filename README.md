# Associate Mobile Programmer: Flutter

Materi pelatihan Associate Mobile Programmer berbasis Flutter.

## Tujuan Pelatihan

Setelah mengikuti pelatihan, peserta mampu:

1. Membangun aplikasi mobile menggunakan Dart dan Flutter.
2. Merancang antarmuka responsif dengan Material 3 dan navigasi antarlayar.
3. Menyimpan dan mengelola data lokal menggunakan SQLite.
4. Mengimplementasikan layanan lokasi, GPS, dan peta.
5. Memahami jaringan seluler, membaca sensor dan spesifikasi perangkat, serta menerapkan keamanan komunikasi mobile dasar.

## Prasyarat

- Dasar pemrograman (variabel, fungsi, class).
- Laptop dengan RAM minimal 8 GB.
- Flutter SDK dan Android Studio atau VS Code terpasang. Jalankan `flutter doctor` untuk memastikan konfigurasi siap.
- Emulator Android atau perangkat Android fisik dengan mode pengembang aktif. Perangkat fisik diperlukan untuk menguji sensor dan jaringan seluler.

## Jadwal

### Hari 1

| Waktu | Modul | Materi |
|---|---|---|
| 09.00 to 10.00 | 1 | [Platform OS dan Bahasa Pemrograman Mobile](docs/hari-1/01-platform-dan-bahasa.md) |
| 10.00 to 12.00 | 2 | [Perancangan Mobile Interface](docs/hari-1/02-mobile-interface.md) |
| 12.00 to 13.00 | | Istirahat |
| 13.00 to 15.00 | 3 | [Perancangan Database dan Data Persistence](docs/hari-1/03-database-persistence.md) |
| 15.00 to 17.00 | 4 | [Mobile Location Based Service, GPS, dan Navigasi](docs/hari-1/04-lokasi-gps-navigasi.md) |

### Hari 2

| Waktu | Modul | Materi |
|---|---|---|
| 09.00 to 10.00 | 5 | [Mobile Cellular Network](docs/hari-2/05-mobile-cellular-network.md) |
| 10.00 to 12.00 | 6 | [Mobile Sensor dan Spesifikasi Teknis Mobile Computing](docs/hari-2/06-mobile-sensor-spesifikasi.md) |
| 12.00 to 13.00 | | Istirahat |
| 13.00 to 15.00 | 7 | [Dasar-Dasar Mobile Communication Security](docs/hari-2/07-keamanan-komunikasi-mobile.md) |
| 15.00 to 17.00 | 8 | [Latihan Uji Kompetensi dan Pembahasan](docs/hari-2/08-latihan-uji-kompetensi.md) |

Jadwal mengikuti silabus resmi penyelenggara.

## Hands-On

Panduan langkah demi langkah dan kode aplikasi jadi:

| Hari | Panduan | Kode |
|---|---|---|
| 1 | [docs/hands-on/hari-1.md](docs/hands-on/hari-1.md) | `app/` (Catatan Lokal, Lokasi dan Peta) |
| 2 | [docs/hands-on/hari-2.md](docs/hands-on/hari-2.md) | `app/` (Jaringan, Sensor, Informasi Perangkat, Keamanan dan HTTPS) |

Daftar tautan yang perlu disiapkan: [docs/links.md](docs/links.md).

Aplikasi di `app/` menggunakan `flutter_map` dengan OpenStreetMap, sehingga tidak memerlukan API key. Contoh pada `docs/hari-1/04-lokasi-gps-navigasi.md` menggunakan `google_maps_flutter` dan memerlukan API key. Keduanya dapat dipakai, tetapi peserta sebaiknya mengikuti versi `app/` jika tidak memiliki API key.

Cara menjalankan aplikasi: lihat langkah 1 pada `docs/hands-on/hari-1.md`.

## Slide Interaktif

Buka `index.html` atau `slides/index.html` di peramban. Tidak perlu server atau internet.

- Panah kiri dan kanan atau spasi: pindah slide.
- Tombol **Simulasi** atau tombol `S`: membuka simulasi interaktif pada slide yang memilikinya (17 simulasi, misalnya Haversine, validasi URL, TLS, dan counter). `Esc` menutup panel.
- Setiap blok kode berwarna dan memiliki tombol **Salin**. Blok kode Flutter yang dapat berdiri sendiri memiliki tombol **DartPad** yang menyalin kode lalu membuka dartpad.dev. Kode yang memakai plugin (sqflite, geolocator, sensors_plus, dan sejenisnya) tidak dapat dijalankan di DartPad dan harus dijalankan di proyek `app/`.

## Struktur Repository

```
associate-mobile-programmer-flutter/
├── README.md
├── index.html                # Daftar materi (buka di browser)
├── app/                      # Proyek Flutter lengkap (kode jadi)
│   ├── pubspec.yaml
│   ├── lib/
│   └── test/
├── docs/
│   ├── links.md
│   ├── hands-on/
│   │   ├── hari-1.md
│   │   └── hari-2.md
│   ├── hari-1/
│   │   ├── 01-platform-dan-bahasa.md
│   │   ├── 02-mobile-interface.md
│   │   ├── 03-database-persistence.md
│   │   └── 04-lokasi-gps-navigasi.md
│   └── hari-2/
│       ├── 05-mobile-cellular-network.md
│       ├── 06-mobile-sensor-spesifikasi.md
│       ├── 07-keamanan-komunikasi-mobile.md
│       └── 08-latihan-uji-kompetensi.md
├── slides/                   # Slide HTML per modul
│   ├── index.html
│   └── assets/
└── .gitignore
```

Struktur folder proyek Flutter yang disarankan untuk peserta:

```
lib/
├── main.dart
├── blocs/        # Controller state (ChangeNotifier)
├── models/       # Model data
├── data/         # Database dan repository
├── services/     # Layanan lokasi, jaringan, sensor, dan HTTPS
├── pages/        # Layar aplikasi
└── router/       # Konfigurasi navigasi
```

## Referensi

- Dokumentasi resmi Flutter: https://docs.flutter.dev
- Dokumentasi Dart: https://dart.dev
- Dokumentasi package di https://pub.dev
- Repository materi perkuliahan: https://github.com/Muhammad-Ikhwan-Fathulloh/Mobile-Programming-2-Course-Bank
