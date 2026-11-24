# Proyek Akhir Contoh: Jurnal Perjalanan (Flutter)

Contoh proyek akhir yang sudah jadi, mengikuti matriks fitur di [shared/docs/proyek/capstone.md](../../shared/docs/proyek/capstone.md). Gunakan sebagai acuan. Untuk mengerjakan sendiri, mulai dari [capstone-base](../capstone-base/README.md).

## Menjalankan

Server latihan dulu (untuk fitur sinkronisasi):

```bash
cd ../../shared/server
npm install
npm start
```

Lalu di folder ini:

```bash
flutter create . --project-name capstone_contoh --platforms android,ios
flutter pub get
flutter run
flutter test
flutter analyze
```

`flutter create .` hanya sekali agar folder platform dibuat. Tambahkan izin lokasi dan internet di `android/app/src/main/AndroidManifest.xml` sesuai modul 4 dan modul 5.

## Matriks fitur

| Modul | Yang harus ada | Di mana |
|---|---|---|
| 1 | Berjalan, kode bertipe, komponen dipakai ulang | `lib/models/entri.dart` (kelas bertipe), `lib/main.dart` (`Card` dipakai ulang di daftar) |
| 2 | Tema dari token, tanpa angka mentah | `lib/main.dart` memakai `ThemeData` dari `colorSchemeSeed` |
| 3 | SQLite CRUD, repository, migrasi | `lib/data/database.dart` (versi 1 dan 2, kolom `kategori`), `lib/data/entri_repository.dart` |
| 4 | GPS tersimpan, izin dan kegagalan ditangani, jarak dan peta | `lib/services/lokasi.dart`, `lib/services/geo.dart`, `lib/pages/detail_entri.dart` |
| 5 dan 7 | Login, kirim dan ambil, PENDING dan SYNCED, token aman, HTTP publik ditolak | `lib/services/api_client.dart`, `lib/services/sync_service.dart`, `lib/services/secure_storage.dart`, `lib/pages/sinkron_page.dart` |
| 6 | Sensor dengan makna, langganan dihentikan | `lib/pages/kompas_page.dart` (kompas menuju tujuan), `lib/services/kompas_sensor.dart` |
| 8 | Minimal 8 tes lulus, analisis bersih, README | `test/capstone_test.dart` (lebih dari 8 tes) |

Fitur kreatif: filter kategori di beranda (migrasi kolom `kategori` dan UI).

## Catatan

- Server latihan hanya menyimpan judul, isi, dan koordinat. Kategori hanya tersimpan di perangkat.
- Akun latihan: `peserta@contoh.id` / `rahasia123`. Alamat server ada di `lib/config.dart`.
- Tujuan kompas di `lib/pages/kompas_page.dart` masih satu titik tetap. Ganti dengan entri yang dipilih pengguna.
