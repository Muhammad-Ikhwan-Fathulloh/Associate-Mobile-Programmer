# Modul 7: Sinkronisasi Offline-First (Flutter)

Proyek kecil untuk Modul 7 (API lanjutan dan sinkronisasi). Brief: [shared/docs/proyek/modul-7-sinkronisasi-offline-first.md](../../../shared/docs/proyek/modul-7-sinkronisasi-offline-first.md).

Jalankan server latihan dulu (`cd ../../../shared/server && npm install && npm start`), lalu:

```bash
flutter create . --project-name modul_7_sinkronisasi_offline_first --platforms android,ios
flutter pub get
flutter run
flutter test
flutter analyze
```

- Catatan disimpan lokal dengan status `PENDING`. Setelah sinkron, status menjadi `SYNCED`.
- Catatan baru dikirim dengan POST. Catatan yang sudah punya `server_id` dikirim dengan PUT.
- Token login disimpan di penyimpanan aman (`lib/services/secure_storage.dart`), bukan di SQLite.
- Logika sinkronisasi di `lib/services/sync_service.dart` memakai antarmuka, sehingga diuji dengan penyimpanan dan API tiruan di `test/sync_test.dart`.
