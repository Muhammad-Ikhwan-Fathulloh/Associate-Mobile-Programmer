# Modul 4: Peta Tempat Favorit (Flutter)

Proyek kecil untuk Modul 4 (GPS, lokasi, dan navigasi). Brief: [shared/docs/proyek/modul-4-peta-tempat-favorit.md](../../../shared/docs/proyek/modul-4-peta-tempat-favorit.md).

```bash
flutter create . --project-name modul_4_peta_tempat_favorit --platforms android,ios
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
