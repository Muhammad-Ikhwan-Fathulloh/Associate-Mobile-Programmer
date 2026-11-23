# Associate Mobile Programmer dengan React Native

by [Muhammad Ikhwan Fathulloh](https://one.nocturnailed.com/)

Materi pelatihan **Associate Mobile Programmer** (dua hari, persiapan sertifikasi BNSP) menggunakan **React Native dengan Expo dan TypeScript**. Struktur modul dan unit kompetensinya sama dengan [jalur Flutter](../flutter/README.md).

## Isi

| Folder | Isi |
|---|---|
| `app/` | Proyek Expo yang sudah jadi: catatan SQLite, lokasi dan peta, jaringan, sensor, perangkat, keamanan, beserta pengujian |
| `docs/hari-1/`, `docs/hari-2/` | Materi delapan modul |
| `docs/hands-on/` | Panduan praktik langkah demi langkah dengan kode lengkap |
| `docs/instalasi-node-expo.md` | Instalasi Node.js, Expo Go, dan emulator |
| `docs/sertifikasi-bnsp.md` | Bukti per unit kompetensi dan padanan Flutter ke React Native |
| `slides/` | Slide per modul dan slide praktik (buka `slides/index.html`) |
| `scripts/` | Pembuat panduan dan slide dari kode proyek |

## Simulasi interaktif

Setiap deck modul punya simulasi yang dibuka dengan tombol **Simulasi** atau tombol **S**:

| Modul | Simulasi |
|---|---|
| 1 | Dari JSX ke tampilan native, `useState` dan render ulang |
| 2 | Flexbox dengan `StyleSheet` langsung terlihat, navigasi expo-router, form dan validasi |
| 3 | CRUD SQLite, offline-first dan sinkronisasi |
| 4 | Izin lokasi, jarak Haversine |
| 5 | Handover antar menara, deteksi jenis jaringan |
| 6 | Akselerometer, `useEffect` dan cleanup langganan sensor |
| 7 | TLS, pemeriksaan URL HTTPS, penyimpanan aman, autentikasi |
| 8 | `npm test`: sisipkan bug, lihat tes menjadi merah |

## Narasi pengajar

Setiap slide modul punya narasi pengajar. Tekan **N** (atau tombol Narasi) untuk menampilkannya di bawah slide. Teks yang sama ada di dokumen modul sebagai bagian Pengantar dan kutipan "Narasi pengajar". Untuk jalur Flutter, narasi pembuka modul tersedia pada slide pertama setiap deck.

## Jadwal

| Hari | Waktu | Sesi |
|---|---|---|
| 1 | 09.00 to 10.00 | Instalasi platform, emulator, dan environment (Flutter atau React Native) |
| 1 | 10.00 to 12.00 | Figma dan Google Stitch, beberapa gaya desain, menerapkan gaya ke aplikasi dengan AI |
| 1 | 13.00 to 15.00 | SQLite (dan tools sejenis), pembahasan MySQL |
| 1 | 15.00 to 17.00 | GPS dan menyimpan lokasi ke SQLite |
| 2 | 09.00 to 10.00 | API dan menghubungkan aplikasi mobile |
| 2 | 10.00 to 12.00 | Sensor: akselerometer, giroskop, dan lainnya |
| 2 | 13.00 to 15.00 | Lanjutan API: menghubungkan aplikasi ke API, token, sinkronisasi |
| 2 | 15.00 to 17.00 | Latihan dan persiapan uji kompetensi |

## Menjalankan aplikasi contoh

```bash
cd reactnative/app
npm install
npx expo start
```

Pindai kode QR dengan Expo Go. Pengujian dan pemeriksaan tipe:

```bash
npm test
npm run typecheck
```

## Membuat ulang panduan dan slide

Panduan hands-on dan modul disusun dari kode di `app/`, sehingga selalu sama dengan kode yang diuji. Setelah mengubah `app/`:

```bash
python3 scripts/build_handson.py
python3 scripts/build_modul.py
python3 scripts/build_praktik.py
```

## Status verifikasi

Proyek `app/` telah diperiksa dengan `tsc --noEmit`, `jest` (18 pengujian), dan `expo export` untuk Android. Belum dijalankan di perangkat atau emulator, sehingga izin lokasi, sensor, dan tampilan peta perlu dicoba langsung. Perintah `create-expo-app` pada panduan mengikuti dokumentasi resmi dan belum diuji di lingkungan penyusunan.
