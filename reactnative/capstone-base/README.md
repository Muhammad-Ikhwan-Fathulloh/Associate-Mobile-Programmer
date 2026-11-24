# Capstone Base (React Native)

Proyek dasar untuk **Proyek Akhir** pelatihan Associate Mobile Programmer, by [Muhammad Ikhwan Fathulloh](https://one.nocturnailed.com/). Sudah berjalan, sudah punya tes, dan tinggal Anda ubah menjadi aplikasi milik sendiri.

Brief lengkap, matriks fitur, dan rubrik: [shared/docs/proyek/capstone.md](../../shared/docs/proyek/capstone.md).

## Langsung jalan (contoh siap pakai)

Proyek ini sudah berisi contoh yang bisa langsung dijalankan: tiga catatan contoh (dua dengan koordinat GPS, satu tanpa lokasi) dimuat otomatis saat pertama kali dibuka. Matikan dengan `contohAwal: false` di `src/proyek.config.ts`.

```bash
npm install
npx expo start      # pindai kode QR dengan Expo Go, atau tekan a untuk emulator Android
npm test            # tes
npm run typecheck   # pemeriksaan tipe
```

Untuk fitur API, jalankan server latihan di terminal lain: `cd ../../shared/server && npm install && npm start`, lalu buka menu "API dan Sinkronisasi" dengan akun `peserta@contoh.id` / `rahasia123`.

Contoh per modul (lebih kecil, satu topik per proyek) ada di [../proyek-modul](../proyek-modul/README.md).

## Yang sudah ada

| Materi | Lokasi |
|---|---|
| Tema (token desain) | `src/theme.ts`, `src/ui.ts`, warna utama dari `src/proyek.config.ts` |
| Identitas dan fitur aplikasi | `src/proyek.config.ts` |
| SQLite dan repository | `src/data/database.ts`, `src/data/noteRepository.ts` |
| GPS, jarak, peta | `src/services/locationService.ts`, `distance.ts`, `app/location.tsx` |
| API dan sinkronisasi | `src/services/httpsService.ts`, `apiClient.ts`, `sync.ts`, `app/sinkron.tsx` |
| Sensor | `src/services/sensorMath.ts`, `app/sensor.tsx` |
| Keamanan | `src/services/secureStorage.ts`, `app/keamanan.tsx` |
| Tes | `__tests__/` |

## Mulai dari sini

1. **Ubah `src/proyek.config.ts`**: nama aplikasi, nama entri (Catatan, Laporan, Tempat, ...), warna utama, fitur yang dipakai.
2. **Samakan warna dan jarak dengan desain Figma Anda** di `src/theme.ts`.
3. **Cari semua `TODO(peserta)`**: `grep -rn "TODO(peserta)" app src __tests__`.

## Daftar kerja (centang saat selesai)

Wajib, mengikuti matriks fitur proyek akhir:

- [ ] Identitas: nama, tagline, warna, dan nama entri milik Anda.
- [ ] Desain: minimal 3 layar di Figma atau Stitch, token sama dengan `theme.ts`.
- [ ] SQLite: ubah model `Note` sesuai tema Anda (tambah minimal satu kolom lewat migrasi, lihat slot di `database.ts`).
- [ ] GPS: koordinat tersimpan, kegagalan izin ditangani.
- [ ] API dan sinkronisasi: login, PENDING dan SYNCED, token di penyimpanan aman.
- [ ] Sensor: dipakai bermakna pada fitur Anda.
- [ ] Tes: minimal 8 tes lulus (sudah ada lebih dari 30, tambahkan milik Anda), `npm run typecheck` bersih.
- [ ] README milik Anda: ganti isi berkas ini dengan cara menjalankan, fitur, dan tangkapan layar.

Slot yang sudah disiapkan untuk Anda:

| Slot | Lokasi |
|---|---|
| Pencarian | `app/notes.tsx` |
| Migrasi tabel | `src/data/database.ts` |
| Fitur kreatif | `app/kreatif.tsx` |
| Tes milik Anda | `__tests__/proyek.test.ts` (`it.todo`) |

## Ide kreatif

Lihat daftar `IDE_KREATIF` di `src/proyek.config.ts`. Aturan: fitur harus memakai minimal dua materi, punya penanganan kasus gagal, dan satu tes.

## Catatan

- Emulator Android menjangkau komputer lewat `10.0.2.2`. Ponsel fisik memakai IP komputer di Wi-Fi yang sama.
- HTTP publik ditolak oleh `periksaUrlAman`. HTTP hanya diizinkan ke alamat lokal untuk pengembangan.
- Jangan menaruh kunci rahasia di kode atau repositori.
