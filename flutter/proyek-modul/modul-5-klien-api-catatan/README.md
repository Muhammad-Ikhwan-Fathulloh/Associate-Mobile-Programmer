# Modul 5: Klien API Catatan (Flutter)

Proyek kecil untuk Modul 5 (API dan menghubungkan aplikasi mobile). Brief: [shared/docs/proyek/modul-5-klien-api-catatan.md](../../../shared/docs/proyek/modul-5-klien-api-catatan.md).

Latihan ini memakai [MockAPI](https://mockapi.io) untuk CRUD. Tidak perlu server lokal dan tidak ada login.

## Siapkan MockAPI (sekali)

1. Buat akun dan project di mockapi.io.
2. Buat resource bernama `notes`. Field yang dipakai: `title` (teks), `content` (teks), `latitude` (angka, boleh kosong), `longitude` (angka, boleh kosong).
3. Salin alamat resource, misalnya `https://64f0a1b2c3d4e5f6a7b8c9d0.mockapi.io/api/v1/notes`.
4. Ganti `GANTI-ID` di `lib/config.dart` dengan ID project Anda. Tanpa langkah ini aplikasi tidak bisa mengambil data.

## Menjalankan

```bash
flutter create . --project-name modul_5_klien_api_catatan --platforms android,ios
flutter pub get
flutter run
flutter test
flutter analyze
```

Panduan lengkap untuk HP fisik dan emulator Android Studio: [shared/docs/menjalankan-proyek.md](../../../shared/docs/menjalankan-proyek.md).

## Yang dilatih

- **Read:** tombol "Muat ulang" mengambil daftar dengan `GET`.
- **Create:** isi judul lalu tekan "Tambah" untuk `POST`.
- **Update:** tekan ikon ubah pada catatan, ubah isinya, lalu simpan untuk `PUT`.
- **Delete:** tekan ikon hapus untuk `DELETE`.
- Galat ditampilkan dengan pesan yang ramah lewat `lib/services/pesan_error.dart`.

Klien CRUD ada di `lib/services/api_client.dart`. Tes ada di `test/api_client_test.dart`.
