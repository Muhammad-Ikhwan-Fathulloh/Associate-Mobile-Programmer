# Associate Mobile Programmer: Flutter

by [Muhammad Ikhwan Fathulloh](https://one.nocturnailed.com/)

Materi pelatihan Associate Mobile Programmer berbasis Flutter. Jalur lain dengan modul yang sama: [React Native](../reactnative/README.md). Aset slide bersama ada di `../shared/assets`, dan skrip pembuat slide memakainya otomatis.

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
- Flutter SDK dan Android Studio atau VS Code terpasang. Jalankan `flutter doctor` untuk memastikan konfigurasi siap. Panduan pemasangan Dart dan Flutter: [docs/instalasi-dart-flutter.md](docs/instalasi-dart-flutter.md). Setup emulator Android Studio dan editor (VS Code atau Antigravity): [docs/setup-android-studio-dan-editor.md](docs/setup-android-studio-dan-editor.md).
- Emulator Android atau perangkat Android fisik dengan mode pengembang aktif. Perangkat fisik diperlukan untuk menguji sensor dan jaringan seluler.

## Proyek per Modul

Setiap modul punya proyek Flutter kecil yang bisa dijalankan sendiri. Indeksnya ada di [proyek-modul](proyek-modul/README.md).

## Jadwal

Agenda terbaru ditambah topik Figma dan Stitch, SQLite dan MySQL, API, dan giroskop. Materi tambahannya ada di [docs/hands-on/tambahan-agenda-baru.md](docs/hands-on/tambahan-agenda-baru.md) (kode Dart belum dikompilasi) dan panduan bersama di [shared/docs](../shared/docs/design-figma-stitch.md).

### Hari 1

| Waktu | Sesi | Materi |
|---|---|---|
| 09.00 to 10.00 | Instalasi platform, emulator, environment | [Modul 1](docs/hari-1/01-platform-dan-bahasa.md), [instalasi Dart dan Flutter](docs/instalasi-dart-flutter.md) |
| 10.00 to 12.00 | Figma, Stitch, gaya, implementasi dengan AI | [Panduan desain](../shared/docs/design-figma-stitch.md), [Modul 2](docs/hari-1/02-figma-stitch-dan-gaya.md), [Mobile Interface](docs/hari-1/02-mobile-interface.md) |
| 12.00 to 13.00 | Istirahat | |
| 13.00 to 15.00 | SQLite dan MySQL | [Modul 3](docs/hari-1/03-database-persistence.md), [SQLite, MySQL, API](../shared/docs/sqlite-mysql-api.md) |
| 15.00 to 17.00 | GPS dan simpan ke SQLite | [Modul 4](docs/hari-1/04-lokasi-gps-navigasi.md) |

### Hari 2

| Waktu | Sesi | Materi |
|---|---|---|
| 09.00 to 10.00 | API dan konek ke aplikasi mobile | [Modul 5](docs/hari-2/05-api-dasar.md), [SQLite, MySQL, API](../shared/docs/sqlite-mysql-api.md), [tambahan](docs/hands-on/tambahan-agenda-baru.md) |
| 10.00 to 12.00 | Sensor akselerometer, giroskop, dan lainnya | [Modul 6](docs/hari-2/06-mobile-sensor-spesifikasi.md), [tambahan (giroskop)](docs/hands-on/tambahan-agenda-baru.md) |
| 12.00 to 13.00 | Istirahat | |
| 13.00 to 15.00 | Lanjutan API dan konek apps ke API | [Modul 7](docs/hari-2/07-api-lanjutan-sinkronisasi.md), [tambahan](docs/hands-on/tambahan-agenda-baru.md), [jaringan seluler](docs/hari-2/05-mobile-cellular-network.md), [keamanan](docs/hari-2/07-keamanan-komunikasi-mobile.md) |
| 15.00 to 17.00 | Latihan dan persiapan uji | [Modul 8](docs/hari-2/08-latihan-uji-kompetensi.md) |

Jadwal mengikuti silabus resmi penyelenggara.

## Proyek

Brief proyek tiap modul dan proyek akhir ada di [shared/docs/proyek](../shared/docs/proyek/README.md) (netral teknologi, dengan petunjuk Flutter). Proyek dasar proyek akhir: [capstone-base](capstone-base/README.md) (kode Dart belum dikompilasi).

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

- Catatan error umum dan cara mengatasinya: [docs/catatan-error-umum.md](docs/catatan-error-umum.md).
- Slide setup emulator Android Studio (6 langkah bergambar): [slides/setup-emulator.html](slides/setup-emulator.html).
- Panah kiri dan kanan atau spasi: pindah slide.
- Tombol **Simulasi** atau tombol `S`: membuka simulasi interaktif pada slide yang memilikinya (17 simulasi, misalnya Haversine, validasi URL, TLS, dan counter). `Esc` menutup panel.
- Tombol panah atas dan bawah mengganti tampilan slide (isi, gambar, tata cara). Tombol `F` membuka layar penuh. Ukuran huruf besar dan menyesuaikan layar proyektor.
- **Slide praktik** (`slides/praktik-hari-1.html` dan `slides/praktik-hari-2.html`): satu slide per file kode, lengkap dengan nama file dan tombol **Salin**. Peserta cukup menyalin kode berurutan sampai aplikasi jadi. Slide dibuat otomatis dari `docs/hands-on/` dengan `python3 scripts/build_praktik.py`.
- **Sertifikasi BNSP**: setiap deck modul memuat slide Peta Kompetensi (kode unit dan elemen) dan Materi Sesuai Elemen SKKNI. Tersedia juga `slides/sertifikasi-bnsp.html` (panduan) dan `slides/latihan-soal-bnsp.html` (42 soal interaktif). Dokumen lengkap ada di `docs/sertifikasi-bnsp/`. Dibuat dengan `python3 scripts/build_bnsp.py` dan `python3 scripts/build_modul_bnsp.py`.
- Setiap deck modul berakhir dengan bagian **Praktik Step by Step**: tujuan dan persiapan, langkah bernomor dengan kode siap salin dan hasil yang benar, Coba Sendiri, Kriteria Selesai, dan tabel Jika Terjadi Error. Bagian ini dibuat dengan `python3 scripts/build_modul_praktik.py` dari data di `scripts/modul_praktik_data.py`.
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
│   │   ├── 02-figma-stitch-dan-gaya.md
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
