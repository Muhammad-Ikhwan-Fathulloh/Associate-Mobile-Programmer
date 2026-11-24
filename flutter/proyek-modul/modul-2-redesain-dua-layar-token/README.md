# Modul 2: Redesain Dua Layar dengan Token (Flutter)

Proyek kecil untuk Modul 2 (desain). Brief: [shared/docs/proyek/modul-2-redesain-dua-layar-dengan-token.md](../../../shared/docs/proyek/modul-2-redesain-dua-layar-dengan-token.md).

```bash
flutter create . --project-name modul_2_redesain_dua_layar_token --platforms android,ios
flutter pub get
flutter run
flutter test
flutter analyze
```

- Semua warna dan jarak ada di `lib/theme/tema.dart`. Ubah satu nilai (misalnya `utama`), lalu lihat kedua layar berubah.
- Tes memastikan tidak ada kode warna mentah di luar berkas tema, dan kontras teks memenuhi 4,5.
