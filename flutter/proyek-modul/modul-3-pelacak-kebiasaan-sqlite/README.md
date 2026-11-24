# Modul 3: Pelacak Kebiasaan dengan SQLite (Flutter)

Proyek kecil untuk Modul 3 (database dan persistensi). Brief: [shared/docs/proyek/modul-3-pelacak-kebiasaan-dengan-sqlite.md](../../../shared/docs/proyek/modul-3-pelacak-kebiasaan-dengan-sqlite.md).

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
