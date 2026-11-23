# Proyek Modul 7: Sinkronisasi Offline-First

Modul 7: API Lanjutan: CRUD, Token, Sinkronisasi, dan Keamanan Jaringan · Estimasi 90 menit · Unit BNSP J.612000.008.01

by [Muhammad Ikhwan Fathulloh](https://one.nocturnailed.com/)

## Skenario

Lengkapi aplikasi catatan agar bekerja tanpa internet. Catatan disimpan lokal dengan status PENDING, lalu dikirim ke server saat pengguna menekan Sinkronkan. Token disimpan dengan aman.

## Yang harus dibuat

- [ ] Kolom `sync_status` (PENDING atau SYNCED) dan `server_id` pada tabel lokal.
- [ ] Fungsi sinkronisasi: kirim PENDING (POST bila baru, PUT bila sudah punya `server_id`), tandai SYNCED, lalu ambil data baru dari server.
- [ ] Satu kegagalan tidak menghentikan catatan lain; hasil dilaporkan (terkirim, diterima, gagal).
- [ ] Token login disimpan di penyimpanan aman, bukan SQLite.
- [ ] Alamat HTTP publik ditolak. HTTP hanya diizinkan ke alamat lokal untuk pengembangan.
- [ ] Minimal 4 tes sinkronisasi dengan basis data tiruan dan API palsu.

## Kriteria penerimaan

Proyek dianggap selesai bila semua ini dapat didemonstrasikan:

- Matikan server, buat 2 catatan, nyalakan server, sinkronkan: keduanya berstatus SYNCED.
- Ubah catatan SYNCED lalu sinkronkan: server menerima PUT, bukan POST kedua.
- Jika catatan pertama gagal dan kedua berhasil, hasil melaporkan terkirim 1 dan gagal 1.
- `http://contoh.com` ditolak, `http://10.0.2.2:3000` diterima.

## Petunjuk React Native

- `src/services/sync.ts`, `secureStorage.ts`, `apiClient.ts`.
- Tes seperti `__tests__/sync.test.ts`.

## Petunjuk Flutter

- `lib/services/sync_service.dart`, `secure_storage_service.dart`, `api_client.dart`.

## Tantangan tambahan

- Sinkronisasi otomatis saat jaringan kembali.
- Selesaikan konflik dengan `updated_at` terbaru.

## Rubrik (100 poin)

| Aspek | Poin |
|---|---|
| Alur POST dan PUT benar | 25 |
| Kegagalan sebagian | 20 |
| Token aman | 15 |
| Penolakan HTTP publik | 10 |
| Tes sinkronisasi | 30 |
| **Total** | **100** |

## Hubungan dengan proyek akhir

Hasil proyek ini dapat dipakai sebagai bagian proyek akhir. Lihat [proyek akhir](capstone.md) dan matriks fitur di dalamnya.
