# Modul 1: Kartu Kenal Digital (Flutter)

Proyek kecil untuk Modul 1 (platform dan bahasa). Brief: [shared/docs/proyek/modul-1-kartu-kenal-digital.md](../../../shared/docs/proyek/modul-1-kartu-kenal-digital.md).

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
flutter create . --project-name modul_1_kartu_kenal_digital --platforms android,ios
flutter pub get
flutter run
flutter test
flutter analyze
```

Perintah `flutter create .` hanya perlu dijalankan sekali agar folder platform (`android/`, `ios/`) dibuat. Kode di `lib/` dan `test/` tidak berubah.

- Data profil ada di `lib/profil.dart`.
- Komponen `Kartu` di `lib/widgets/kartu.dart` dipakai ulang.
- Fungsi `inisial` diuji di `test/inisial_test.dart`.
