# Capstone Base (Flutter)

Proyek dasar untuk **Proyek Akhir** pelatihan Associate Mobile Programmer, by [Muhammad Ikhwan Fathulloh](https://one.nocturnailed.com/).

> **Status verifikasi:** kode Dart di folder ini **belum dikompilasi dan belum dijalankan** (belum ada Flutter SDK di lingkungan penyusun). Jalankan `flutter analyze` dan `flutter test` lebih dulu dan laporkan masalah ke instruktur. Versi React Native di `reactnative/capstone-base` sudah diuji (tsc, jest, expo export).

Brief lengkap, matriks fitur, dan rubrik: [shared/docs/proyek/capstone.md](../../shared/docs/proyek/capstone.md).

## Menjalankan

Folder ini hanya berisi `lib`, `test`, dan `pubspec.yaml`. Buat folder platform sekali saja:

```bash
flutter create . --project-name capstone_base --platforms android
flutter pub get
flutter analyze
flutter test
flutter run
```

Setelah `flutter create`, tambahkan izin pada `android/app/src/main/AndroidManifest.xml` seperti pada `flutter/app` (lokasi dan jaringan), dan untuk HTTP ke server lokal tambahkan `android:usesCleartextTraffic="true"` pada tag `application` (hanya untuk pengembangan).

Untuk fitur API, jalankan server latihan: `cd ../../shared/server && npm install && npm start`. Flutter 3.27 atau lebih baru diperlukan (tema memakai `CardThemeData`).

## Yang sudah ada

| Materi | Lokasi |
|---|---|
| Identitas dan fitur aplikasi | `lib/proyek_config.dart` |
| Tema (token desain) | `lib/theme/tema.dart` |
| SQLite dan repository | `lib/data/app_database.dart`, `lib/data/note_repository.dart` |
| GPS, jarak, peta | `lib/services/location_service.dart`, `distance.dart`, `lib/pages/location_page.dart` |
| API dan sinkronisasi | `lib/services/api_client.dart`, `sync_service.dart`, `lib/pages/sinkron_page.dart` |
| Sensor | `lib/pages/sensor_page.dart` |
| Keamanan | `lib/services/https_service.dart`, `secure_storage_service.dart`, `lib/pages/keamanan_page.dart` |
| Tes | `test/` |

## Mulai dari sini

1. **Ubah `lib/proyek_config.dart`**: nama aplikasi, nama entri, warna utama, fitur yang dipakai.
2. **Samakan token dengan desain Figma Anda** di `lib/theme/tema.dart`.
3. **Cari semua `TODO(peserta)`**: `grep -rn "TODO(peserta)" lib test`.

## Daftar kerja

- [ ] Identitas: nama, tagline, warna, dan nama entri milik Anda.
- [ ] Desain: minimal 3 layar di Figma atau Stitch, token sama dengan `tema.dart`.
- [ ] SQLite: ubah model `Note` sesuai tema (tambah minimal satu kolom lewat migrasi, lihat slot di `app_database.dart`).
- [ ] GPS: koordinat tersimpan, kegagalan izin ditangani.
- [ ] API dan sinkronisasi: login, PENDING dan SYNCED, token di penyimpanan aman.
- [ ] Sensor: dipakai bermakna pada fitur Anda.
- [ ] Tes: minimal 8 tes lulus, `flutter analyze` bersih.
- [ ] README milik Anda: ganti isi berkas ini.

| Slot | Lokasi |
|---|---|
| Pencarian | `lib/pages/notes_page.dart` |
| Migrasi tabel | `lib/data/app_database.dart` |
| Fitur kreatif | `lib/pages/kreatif_page.dart` |
| Tes milik Anda | `test/proyek_config_test.dart` (tes `skip`) |

Aturan fitur kreatif: memakai minimal dua materi, punya penanganan kasus gagal, dan satu tes. Ide ada di `ProyekConfig.ideKreatif`.
