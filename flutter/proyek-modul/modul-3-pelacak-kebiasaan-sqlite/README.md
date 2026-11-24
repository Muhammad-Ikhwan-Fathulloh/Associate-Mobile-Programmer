# Modul 3: Pelacak Kebiasaan dengan SQLite (Flutter)

Proyek kecil untuk Modul 3 (database dan persistensi). Brief: [shared/docs/proyek/modul-3-pelacak-kebiasaan-dengan-sqlite.md](../../../shared/docs/proyek/modul-3-pelacak-kebiasaan-dengan-sqlite.md).

## Sudah punya proyek? Pasang Flutter lalu jalankan

Pakai langkah ini bila folder proyek sudah ada (berisi `lib/`, `test/`, dan `pubspec.yaml`) dan Anda hanya perlu menyiapkan Flutter di komputer. Tidak perlu membuat proyek dari awal.

1. Pastikan Flutter terpasang: `flutter doctor`. Jika belum, ikuti [instalasi Dart dan Flutter](../../../flutter/docs/instalasi-dart-flutter.md).
2. Masuk ke folder proyek.
3. Tambahkan folder Android yang belum ada:

```bash
flutter create . --platforms android
```

File yang sudah ada (`lib/`, `test/`, `pubspec.yaml`) tidak ditimpa. Periksa dengan `git status` bila ragu.

4. Unduh paket: `flutter pub get`.
5. Cek perangkat: `flutter devices`. Pakai HP fisik dengan USB debugging, atau emulator yang sudah menyala.
6. Jalankan: `flutter run`. Bila ada lebih dari satu perangkat, pilih dengan `flutter run -d <id>`.

Jika muncul galat setelah mengubah dependensi, jalankan `flutter clean`, lalu ulangi `flutter pub get` dan `flutter run`.

Panduan HP dan emulator Android Studio: [menjalankan proyek](../../../shared/docs/menjalankan-proyek.md).

```bash
flutter create . --project-name modul_3_pelacak_kebiasaan_sqlite --platforms android,ios
flutter pub get
flutter run
flutter test
flutter analyze
```

- Data disimpan di SQLite (`kebiasaan.db`). Tutup aplikasi lalu buka lagi: data tetap ada.
- Migrasi ada di `lib/data/database.dart` (versi 1 dan 2). Kolom `warna` ditambahkan tanpa menghapus data lama.
- Logika streak murni di `lib/logic/streak.dart` dan diuji di `test/streak_test.dart`.
