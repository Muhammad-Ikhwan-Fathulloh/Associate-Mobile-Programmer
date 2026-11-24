# Modul 4: Peta Tempat Favorit (Flutter)

Proyek kecil untuk Modul 4 (GPS, lokasi, dan navigasi). Brief: [shared/docs/proyek/modul-4-peta-tempat-favorit.md](../../../shared/docs/proyek/modul-4-peta-tempat-favorit.md).

## Sudah punya proyek? Pasang Flutter lalu jalankan

Pakai langkah ini bila folder proyek sudah ada (berisi `lib/`, `test/`, dan `pubspec.yaml`) dan Anda hanya perlu menyiapkan Flutter di komputer. Tidak perlu membuat proyek dari awal.

1. Pastikan Flutter terpasang: `flutter doctor`. Jika belum, ikuti [instalasi Dart dan Flutter](../../../flutter/docs/instalasi-dart-flutter.md).
2. Masuk ke folder proyek.
3. Tambahkan folder Android yang belum ada. Lewati langkah ini jika folder `android/` sudah ada, lalu lanjut ke langkah 4:

```bash
flutter create . --platforms android
```

File yang sudah ada (`lib/`, `test/`, `pubspec.yaml`) tidak ditimpa. Periksa dengan `git status` bila ragu.

Proyek ini memakai jaringan dan/atau lokasi. Tambahkan izin di `android/app/src/main/AndroidManifest.xml` di dalam `<manifest>`, sebelum `<application>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

4. Unduh paket: `flutter pub get`.
5. Cek perangkat: `flutter devices`. Pakai HP fisik dengan USB debugging, atau emulator yang sudah menyala.
6. Jalankan: `flutter run`. Bila ada lebih dari satu perangkat, pilih dengan `flutter run -d <id>`.

Jika muncul galat setelah mengubah dependensi, jalankan `flutter clean`, lalu ulangi `flutter pub get` dan `flutter run`.

Panduan HP dan emulator Android Studio: [menjalankan proyek](../../../shared/docs/menjalankan-proyek.md).

```bash
```

Tambahkan izin lokasi di `android/app/src/main/AndroidManifest.xml` (`ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`) dan izin internet (`INTERNET`) sebelum menjalankan aplikasi di Android.

```bash
flutter pub get
flutter run
flutter test
flutter analyze
```

- Koordinat disimpan di SQLite (`tempat.db`, kolom `REAL`).
- Izin lokasi diminta saat tombol "Sertakan lokasi saya" atau "Jarak dari saya" ditekan. Izin ditolak, GPS mati, atau waktu habis ditangani: tempat tetap bisa disimpan tanpa koordinat.
- Jarak memakai Haversine di `lib/services/distance.dart`. Peta memakai OpenStreetMap lewat `flutter_map`, tanpa API key.
