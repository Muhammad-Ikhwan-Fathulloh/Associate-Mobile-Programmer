# Associate Mobile Programmer dengan React Native

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

## Jadwal

| Hari | Modul |
|---|---|
| 1 | 1 Platform dan Bahasa, 2 Mobile Interface, 3 Database, 4 Lokasi dan GPS |
| 2 | 5 Jaringan Seluler, 6 Sensor dan Perangkat, 7 Keamanan, 8 Latihan dan Uji Kompetensi |

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
