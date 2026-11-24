# Modul 1: Kartu Kenal Digital (Flutter)

Proyek kecil untuk Modul 1 (platform dan bahasa). Brief: [shared/docs/proyek/modul-1-kartu-kenal-digital.md](../../../shared/docs/proyek/modul-1-kartu-kenal-digital.md).

```bash
flutter create . --project-name modul_1_kartu_kenal_digital --platforms android,ios
flutter pub get
flutter run
flutter test
flutter analyze
```

Perintah `flutter create .` hanya perlu dijalankan sekali agar folder platform (`android/`, `ios/`) dibuat. Kode di `lib/` dan `test/` tidak berubah.

- Data profil ada di `lib/profil.dart`.
- Komponen `Kartu` di `lib/widgets/kartu.dart` dipakai ulang.
- Fungsi `inisial` diuji di `test/inisial_test.dart`.
