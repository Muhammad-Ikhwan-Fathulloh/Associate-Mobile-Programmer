# Modul 7: Sinkronisasi Offline-First (Flutter)

Proyek kecil untuk Modul 7 (API lanjutan dan sinkronisasi). Brief: [shared/docs/proyek/modul-7-sinkronisasi-offline-first.md](../../../shared/docs/proyek/modul-7-sinkronisasi-offline-first.md).

Latihan ini memakai [MockAPI](https://mockapi.io) sebagai server. Tidak ada login.

## Siapkan MockAPI (sekali)

1. Buat akun dan project di mockapi.io.
2. Buat resource bernama `notes` dengan field `title`, `content`, `latitude`, dan `longitude`.
3. Ganti `GANTI-ID` di `lib/config.dart` dengan ID project Anda.

## Menjalankan

```bash
flutter create . --project-name modul_7_sinkronisasi_offline_first --platforms android,ios
flutter pub get
flutter run
flutter test
flutter analyze
```

Panduan lengkap untuk HP fisik dan emulator Android Studio: [shared/docs/menjalankan-proyek.md](../../../shared/docs/menjalankan-proyek.md).

## Yang dilatih

- Catatan disimpan lokal di SQLite dengan status `PENDING`. Setelah sinkron, status menjadi `SYNCED`.
- Catatan baru dikirim dengan `POST`. Catatan yang sudah punya `server_id` dikirim dengan `PUT`.
- Catatan dari MockAPI diambil dengan `GET` dan disimpan sebagai `SYNCED`.
- Satu kegagalan tidak menghentikan catatan lain. Hasilnya dilaporkan: terkirim, diterima, dan gagal.

Logika sinkronisasi ada di `lib/services/sync_service.dart`. Tes memakai penyimpanan dan API tiruan di `test/sync_test.dart`.
