# Modul 8: Paket Bukti Kompetensi (Flutter)

Proyek kecil untuk Modul 8 (latihan dan persiapan uji kompetensi). Brief: [shared/docs/proyek/modul-8-paket-bukti-kompetensi.md](../../../shared/docs/proyek/modul-8-paket-bukti-kompetensi.md).

Proyek ini memakai hasil modul 1 sampai 7 yang ada di folder sebelahnya (`flutter/proyek-modul`). Jalankan tes setelah modul lain sudah ada.

## Sudah punya proyek? Pasang Flutter lalu jalankan

Pakai langkah ini bila folder proyek sudah ada (berisi `lib/`, `test/`, dan `pubspec.yaml`) dan Anda hanya perlu menyiapkan Flutter di komputer. Tidak perlu membuat proyek dari awal.

1. Pastikan Flutter terpasang: `flutter doctor`. Jika belum, ikuti [instalasi Dart dan Flutter](../../../flutter/docs/instalasi-dart-flutter.md).
2. Masuk ke folder proyek.
3. Tambahkan folder Android yang belum ada. Lewati langkah ini jika folder `android/` sudah ada, lalu lanjut ke langkah 4:

```bash
flutter create . --platforms android
```

File yang sudah ada (`lib/`, `test/`, `pubspec.yaml`) tidak ditimpa. Periksa dengan `git status` bila ragu.

4. Unduh paket: `flutter pub get`.
5. Cek perangkat: `flutter devices`. Pakai HP fisik dengan USB debugging, atau emulator yang sudah menyala.
6. Jalankan: `flutter run`. Bila ada lebih dari satu perangkat, pilih dengan `flutter run -d <id>`.

Jika muncul galat setelah mengubah dependensi, jalankan `flutter clean`, lalu ulangi `flutter pub get` dan `flutter run`.

Jalankan di web (Chrome):

```bash
flutter run -d chrome
```

Untuk membuat berkas web statis, jalankan `flutter build web`. Hasilnya ada di `build/web`. Perintah ini memerlukan folder `web/`, yang sudah ada di proyek ini.

Panduan HP dan emulator Android Studio: [menjalankan proyek](../../../shared/docs/menjalankan-proyek.md).

```bash
flutter pub get
flutter run
flutter test        # memastikan setiap baris bukti menunjuk berkas yang ada
flutter analyze
```

Peta lengkap ada di `lib/bukti.dart`. Tabel bukti:

| Unit | Bukti (folder/berkas) |
|---|---|
| J.612000.001.01 Platform OS dan bahasa | `modul-1-kartu-kenal-digital/lib/profil.dart` |
| J.612000.007.01 Mobile Interface | `modul-2-redesain-dua-layar-token/lib/theme/tema.dart` |
| J.612000.003.01 Database dan data persistence | `modul-3-pelacak-kebiasaan-sqlite/lib/data/database.dart` |
| J.612000.006.01 LBS, GPS, dan navigasi | `modul-4-peta-tempat-favorit/lib/services/lokasi.dart` |
| J.612000.025.01 Mobile cellular network | `modul-5-klien-api-catatan/lib/services/api_client.dart` |
| J.612000.022.01 Mobile sensor dan spesifikasi | `modul-6-penghitung-guncangan-kompas/lib/services/sensor_math.dart` |
| J.612000.008.01 Mobile communication security | `modul-7-sinkronisasi-offline-first/lib/services/secure_storage.dart` |

## Demo lima menit

1. Tunjukkan layar aplikasi dan jelaskan satu unit.
2. Tunjukkan satu kasus gagal yang ditangani.
3. Jalankan `flutter test` dan tunjukkan hasilnya.
