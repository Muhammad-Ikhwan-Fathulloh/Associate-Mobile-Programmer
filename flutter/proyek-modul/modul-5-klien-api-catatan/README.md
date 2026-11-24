# Modul 5: Klien API Catatan (Flutter)

Proyek kecil untuk Modul 5 (API dan menghubungkan aplikasi mobile). Brief: [shared/docs/proyek/modul-5-klien-api-catatan.md](../../../shared/docs/proyek/modul-5-klien-api-catatan.md).

Jalankan server latihan dulu di terminal lain:

```bash
cd ../../../shared/server
npm install
npm start           # http://localhost:3000
```

Lalu di folder ini:

```bash
flutter create . --project-name modul_5_klien_api_catatan --platforms android,ios
flutter pub get
flutter run
flutter test
flutter analyze
```

- Akun latihan: `peserta@contoh.id` / `rahasia123`.
- Alamat server ada di `lib/config.dart`. Emulator Android memakai `10.0.2.2`. Ponsel fisik memakai IP komputer.
- Klien API ada di `lib/services/api_client.dart`. Galat ditampilkan lewat `pesanRamah` di `lib/services/pesan_error.dart`.
