# Proyek Akhir Contoh: Jurnal Perjalanan (React Native)

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
npm install
npx expo start      # pindai QR dengan Expo Go, atau tekan a untuk emulator Android
npm test
npm run typecheck
```

## Matriks fitur

| Modul | Yang harus ada | Di mana |
|---|---|---|
| 1 | Berjalan, kode bertipe, komponen dipakai ulang | `src/models/entri.ts` (tipe `Entri`), `app/index.tsx` |
| 2 | Tema dari token, tanpa angka mentah | `app/_layout.tsx`, `src/config.ts`; warna utama sama dengan jalur Flutter |
| 3 | SQLite CRUD, repository, migrasi | `src/data/database.ts` (versi 1 dan 2, kolom `kategori`), `src/data/entriRepository.ts` |
| 4 | GPS tersimpan, izin dan kegagalan ditangani, jarak dan peta | `src/services/lokasi.ts`, `src/services/geo.ts`, `app/detail.tsx` (WebView Leaflet) |
| 5 dan 7 | Login, kirim dan ambil, PENDING dan SYNCED, token aman, HTTP publik ditolak | `src/services/apiClient.ts`, `src/services/sync.ts`, `src/services/secureStorage.ts`, `app/sinkron.tsx` |
| 6 | Sensor dengan makna, langganan dihentikan | `app/kompas.tsx` (kompas menuju tujuan), `src/services/sensorMath.ts` |
| 8 | Minimal 8 tes lulus, analisis bersih, README | `__tests__/capstone.test.ts` |

Fitur kreatif: filter kategori di beranda (migrasi kolom `kategori` dan UI).

## Catatan

- Server latihan hanya menyimpan judul, isi, dan koordinat. Kategori hanya tersimpan di perangkat.
- Akun latihan: `peserta@contoh.id` / `rahasia123`. Alamat server ada di `src/config.ts`.
- Tujuan kompas di `app/kompas.tsx` masih satu titik tetap. Ganti dengan entri yang dipilih pengguna.
