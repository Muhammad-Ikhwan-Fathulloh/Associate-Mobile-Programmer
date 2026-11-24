# Modul 5: Klien API Catatan (React Native)

Proyek kecil untuk Modul 5 (API dan menghubungkan aplikasi mobile). Brief: [shared/docs/proyek/modul-5-klien-api-catatan.md](../../../shared/docs/proyek/modul-5-klien-api-catatan.md).

Latihan ini memakai [MockAPI](https://mockapi.io) untuk CRUD. Tidak perlu server lokal dan tidak ada login.

## Siapkan MockAPI (sekali)

1. Buat akun dan project di mockapi.io.
2. Buat resource bernama `notes`. Field yang dipakai: `title` (teks), `content` (teks), `latitude` (angka, boleh kosong), `longitude` (angka, boleh kosong).
3. Salin alamat resource, misalnya `https://64f0a1b2c3d4e5f6a7b8c9d0.mockapi.io/api/v1/notes`.
4. Ganti `GANTI-ID` di `src/config.ts` dengan ID project Anda. Tanpa langkah ini aplikasi tidak bisa mengambil data.

## Menjalankan

```bash
npm install
npx expo start      # pindai QR dengan Expo Go, atau tekan a untuk emulator
npm test
npm run typecheck
```

Panduan lengkap untuk HP fisik dan emulator Android Studio: [shared/docs/menjalankan-proyek.md](../../../shared/docs/menjalankan-proyek.md).

## Yang dilatih

- **Read:** tombol "Muat ulang" mengambil daftar dengan `GET`.
- **Create:** isi judul lalu tekan "Tambah" untuk `POST`.
- **Update:** tekan "Ubah" pada catatan, ubah isinya, lalu simpan untuk `PUT`.
- **Delete:** tekan "Hapus" untuk `DELETE`.
- Galat (id tidak ada, server tidak terjangkau, batas waktu) ditampilkan dengan pesan yang ramah lewat `src/services/pesanError.ts`.

Klien CRUD ada di `src/services/apiClient.ts`. Tes ada di `__tests__/api.test.ts`.
