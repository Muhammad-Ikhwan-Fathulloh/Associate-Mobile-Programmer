# Proyek per Modul (Flutter)

by [Muhammad Ikhwan Fathulloh](https://one.nocturnailed.com/)

Setiap modul punya satu proyek Flutter kecil yang berdiri sendiri. Sejajar dengan [proyek per modul React Native](../../reactnative/proyek-modul/README.md). Brief dan rubrik tiap proyek ada di [shared/docs/proyek](../../shared/docs/proyek/README.md).

| Modul | Proyek | Folder | Yang dibuktikan |
|---|---|---|---|
| 1 | Kartu Kenal Digital | [modul-1-kartu-kenal-digital](modul-1-kartu-kenal-digital/README.md) | Widget dipakai ulang, fungsi `inisial` teruji |
| 2 | Redesain Dua Layar dengan Token | [modul-2-redesain-dua-layar-token](modul-2-redesain-dua-layar-token/README.md) | Semua warna dari satu berkas tema, kontras teks teruji |
| 3 | Pelacak Kebiasaan dengan SQLite | [modul-3-pelacak-kebiasaan-sqlite](modul-3-pelacak-kebiasaan-sqlite/README.md) | Tabel, repository, migrasi, streak murni |
| 4 | Peta Tempat Favorit | [modul-4-peta-tempat-favorit](modul-4-peta-tempat-favorit/README.md) | GPS dengan penanganan izin dan gagal, Haversine, peta |
| 5 | Klien API Catatan | [modul-5-klien-api-catatan](modul-5-klien-api-catatan/README.md) | Klien API terpisah, pesan galat ramah, batas waktu |
| 6 | Penghitung Guncangan dan Kompas | [modul-6-penghitung-guncangan-kompas](modul-6-penghitung-guncangan-kompas/README.md) | Sensor dengan makna, langganan dihentikan |
| 7 | Sinkronisasi Offline-First | [modul-7-sinkronisasi-offline-first](modul-7-sinkronisasi-offline-first/README.md) | PENDING dan SYNCED, POST atau PUT, token aman |
| 8 | Paket Bukti Kompetensi | [modul-8-paket-bukti-kompetensi](modul-8-paket-bukti-kompetensi/README.md) | Peta bukti unit yang berkas-berkasnya diperiksa tes |

Modul 5 dan 7 memakai MockAPI sebagai server CRUD. Ganti `GANTI-ID` di `src/config.ts` (React Native) atau `lib/config.dart` (Flutter) dengan ID project Anda. Panduan MockAPI ada di README tiap modul.

## Menjalankan satu modul

```bash
cd modul-1-kartu-kenal-digital
flutter create . --project-name modul_1_kartu_kenal_digital --platforms android,ios
flutter pub get
flutter run
flutter test
flutter analyze
```

`flutter create .` hanya sekali agar folder platform dibuat. Kode di `lib/` dan `test/` tidak berubah. Ganti nama proyek sesuai README masing-masing folder.

Untuk proyek akhir, mulai dari [capstone-base](../capstone-base/README.md).


Panduan menjalankan di HP dan emulator Android Studio: [shared/docs/menjalankan-proyek.md](../../shared/docs/menjalankan-proyek.md).
