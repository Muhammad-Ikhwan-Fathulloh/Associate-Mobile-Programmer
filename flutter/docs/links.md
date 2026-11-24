# Daftar Tautan yang Diperlukan

Semua tautan berikut gratis dan tidak memerlukan API key, kecuali yang ditandai.

## Instalasi dan Alat

| Keperluan | Tautan |
|---|---|
| Flutter SDK (panduan instalasi) | https://docs.flutter.dev/get-started/install |
| Android Studio | https://developer.android.com/studio |
| VS Code | https://code.visualstudio.com |
| Ekstensi Flutter untuk VS Code | https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter |
| Dokumentasi Dart | https://dart.dev |
| Flutter DevTools | https://docs.flutter.dev/tools/devtools |

## Package yang Digunakan

| Package | Fungsi | Tautan |
|---|---|---|
| go_router | Navigasi dan routing | https://pub.dev/packages/go_router |
| sqflite | Database SQLite | https://pub.dev/packages/sqflite |
| path | Manipulasi path berkas | https://pub.dev/packages/path |
| geolocator | GPS dan izin lokasi | https://pub.dev/packages/geolocator |
| flutter_map | Peta berbasis OpenStreetMap | https://pub.dev/packages/flutter_map |
| latlong2 | Tipe koordinat LatLng | https://pub.dev/packages/latlong2 |
| connectivity_plus | Jenis koneksi jaringan (Wi-Fi, seluler, dan lainnya) | https://pub.dev/packages/connectivity_plus |
| sensors_plus | Data accelerometer, gyroscope, dan sensor lain | https://pub.dev/packages/sensors_plus |
| device_info_plus | Informasi merek, model, dan sistem operasi perangkat | https://pub.dev/packages/device_info_plus |
| flutter_secure_storage | Penyimpanan token di Keystore dan Keychain | https://pub.dev/packages/flutter_secure_storage |
| http | Permintaan HTTP dan HTTPS ke API | https://pub.dev/packages/http |
| flutter_lints | Aturan analisis kode | https://pub.dev/packages/flutter_lints |

## API Publik

| API | Keperluan | Tautan | Catatan |
|---|---|---|---|
| JSONPlaceholder | Sumber data untuk latihan HTTPS (Hari 2 Modul 7) | https://jsonplaceholder.typicode.com | Data tiruan. Tidak memerlukan API key. |
| Nominatim (OpenStreetMap) | Mengubah koordinat menjadi alamat | https://nominatim.openstreetmap.org | Maksimal sekitar 1 permintaan per detik. Wajib mencantumkan User-Agent. Dokumentasi kebijakan: https://operations.osmfoundation.org/policies/nominatim/ |
| OpenStreetMap tiles | Gambar peta | https://tile.openstreetmap.org | Untuk pelatihan, penggunaan kecil diperbolehkan. Kebijakan penggunaan: https://operations.osmfoundation.org/policies/tiles/ |

## Rilis dan Publikasi (opsional, di luar jadwal Hari 2)

| Keperluan | Tautan |
|---|---|
| Panduan build dan signing Android | https://docs.flutter.dev/deployment/android |
| Google Play Console (membutuhkan akun dan biaya pendaftaran satu kali) | https://play.google.com/console |
| Kebijakan privasi (wajib jika aplikasi mengakses lokasi) | Dibuat sendiri, ditautkan pada halaman toko aplikasi |

## Materi dan Repository

| Keperluan | Tautan |
|---|---|
| Repository pelatihan ini | https://github.com/Muhammad-Ikhwan-Fathulloh/Associate-Mobile-Programmer-Flutter |
| Repository materi perkuliahan Pemrograman Mobile 2 | https://github.com/Muhammad-Ikhwan-Fathulloh/Mobile-Programming-2-Course-Bank |
| Dokumentasi resmi Flutter (widget, layout, state) | https://docs.flutter.dev |

## Tautan Opsional

| Keperluan | Tautan |
|---|---|
| Material 3 (pedoman desain) | https://m3.material.io |
| Dokumentasi izin lokasi Android | https://developer.android.com/training/location/permissions |
| Dokumentasi izin lokasi iOS (Core Location) | https://developer.apple.com/documentation/corelocation |

## Layanan Pendukung (Opsional, di Luar Jadwal)

| Keperluan | Paket Flutter | Tautan | Catatan |
|---|---|---|---|
| Sinkronisasi SQLite di perangkat dengan basis data server | `powersync` | https://powersync.com | Alternatif untuk sinkronisasi manual di Modul 7. Periksa paket dan harga di situs resmi. |
| Pelaporan crash | `firebase_crashlytics` | https://firebase.google.com/products/crashlytics | Memerlukan proyek Firebase. Wajib dicantumkan di kebijakan privasi. |
| Notifikasi push | `firebase_messaging` | https://firebase.google.com/products/cloud-messaging | Memerlukan proyek Firebase dan berkas konfigurasi. Jangan commit kunci rahasia. |
