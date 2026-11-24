# Modul 7: Sinkronisasi Offline-First (React Native)

Proyek kecil untuk Modul 7 (API lanjutan dan sinkronisasi). Brief: [shared/docs/proyek/modul-7-sinkronisasi-offline-first.md](../../../shared/docs/proyek/modul-7-sinkronisasi-offline-first.md).

Latihan ini memakai [MockAPI](https://mockapi.io) sebagai server. Tidak ada login.

## Siapkan MockAPI (sekali)

1. Buat akun dan project di mockapi.io.
2. Buat resource bernama `notes` dengan field `title`, `content`, `latitude`, dan `longitude`.
3. Ganti `GANTI-ID` di `src/config.ts` dengan ID project Anda.

## Menjalankan

```bash
npm install
npx expo start      # pindai QR dengan Expo Go, atau tekan a untuk emulator
npm test
npm run typecheck
```

Panduan lengkap untuk HP fisik dan emulator Android Studio: [shared/docs/menjalankan-proyek.md](../../../shared/docs/menjalankan-proyek.md).

## Yang dilatih

- Catatan disimpan lokal di SQLite dengan status `PENDING`. Setelah sinkron, status menjadi `SYNCED`.
- Catatan baru dikirim dengan `POST`. Catatan yang sudah punya `server_id` dikirim dengan `PUT`.
- Catatan dari MockAPI diambil dengan `GET` dan disimpan sebagai `SYNCED`.
- Satu kegagalan tidak menghentikan catatan lain. Hasilnya dilaporkan: terkirim, diterima, dan gagal.

Logika sinkronisasi ada di `src/services/sync.ts`. Tes memakai penyimpanan dan API tiruan di `__tests__/sync.test.ts`.
