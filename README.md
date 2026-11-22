# Associate Mobile Programmer: Flutter

Materi pelatihan Associate Mobile Programmer berbasis Flutter. Pelatihan berlangsung selama 2 hari secara offline di Graha Pos Bandung pada 25 hingga 26 November 2026.

## Tujuan Pelatihan

Setelah mengikuti pelatihan, peserta mampu:

1. Membangun aplikasi mobile menggunakan Dart dan Flutter.
2. Merancang antarmuka responsif dengan Material 3 dan navigasi antarlayar.
3. Menyimpan dan mengelola data lokal menggunakan SQLite.
4. Mengimplementasikan layanan lokasi, GPS, dan peta.
5. Mengelola state dengan Cubit, mengambil data dari REST API, dan menyiapkan aplikasi untuk rilis.

## Prasyarat

- Dasar pemrograman (variabel, fungsi, class).
- Laptop dengan RAM minimal 8 GB.
- Flutter SDK dan Android Studio atau VS Code terpasang. Jalankan `flutter doctor` untuk memastikan konfigurasi siap.
- Emulator Android atau perangkat Android fisik dengan mode pengembang aktif.

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
| 09.00 to 10.00 | 5 | [State Management dengan Cubit](docs/hari-2/05-state-management-cubit.md) |
| 10.00 to 12.00 | 6 | [Advanced Widgets dan Animasi](docs/hari-2/06-advanced-widgets-animasi.md) |
| 12.00 to 13.00 | | Istirahat |
| 13.00 to 15.00 | 7 | [Networking: REST API dan JSON](docs/hari-2/07-networking-api.md) |
| 15.00 to 16.00 | 8 | [Testing dan Build Rilis](docs/hari-2/08-testing-rilis.md) |
| 16.00 to 17.00 | 9 | [Proyek Akhir](docs/hari-2/09-proyek-akhir.md) |

Jadwal Hari 2 bersifat usulan dan dapat disesuaikan dengan silabus resmi.

## Struktur Repository

```
associate-mobile-programmer-flutter/
├── README.md
├── docs/
│   ├── hari-1/
│   │   ├── 01-platform-dan-bahasa.md
│   │   ├── 02-mobile-interface.md
│   │   ├── 03-database-persistence.md
│   │   └── 04-lokasi-gps-navigasi.md
│   └── hari-2/
│       ├── 05-state-management-cubit.md
│       ├── 06-advanced-widgets-animasi.md
│       ├── 07-networking-api.md
│       ├── 08-testing-rilis.md
│       └── 09-proyek-akhir.md
└── .gitignore
```

Struktur folder proyek Flutter yang disarankan untuk peserta:

```
lib/
├── main.dart
├── blocs/        # Cubit dan state
├── models/       # Model data
├── data/         # Database, repository, dan layanan API
├── pages/        # Layar aplikasi
└── widgets/      # Widget yang dapat digunakan ulang
```

## Referensi

- Dokumentasi resmi Flutter: https://docs.flutter.dev
- Dokumentasi Dart: https://dart.dev
- Dokumentasi package di https://pub.dev
- Repository materi perkuliahan: https://github.com/Muhammad-Ikhwan-Fathulloh/Mobile-Programming-2-Course-Bank
