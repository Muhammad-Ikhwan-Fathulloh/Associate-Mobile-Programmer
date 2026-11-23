# Associate Mobile Programmer

by [Muhammad Ikhwan Fathulloh](https://one.nocturnailed.com/)

Materi pelatihan **Associate Mobile Programmer** (dua hari, persiapan sertifikasi BNSP) dalam dua teknologi dengan modul yang sama. Pilih satu jalur.

| Jalur | Teknologi | Mulai dari |
|---|---|---|
| [Flutter](flutter/README.md) | Dart, Material 3 | [flutter/slides/index.html](flutter/slides/index.html) |
| [React Native](reactnative/README.md) | Expo, TypeScript | [reactnative/slides/index.html](reactnative/slides/index.html) |

## Struktur repositori

```
flutter/        materi dan aplikasi contoh Flutter (app, docs, slides, scripts)
reactnative/    materi dan aplikasi contoh React Native (app, docs, slides, scripts)
shared/assets/  CSS dan JavaScript slide yang dipakai kedua jalur
index.html      halaman awal untuk memilih jalur
```

## Jadwal

| Hari | Modul |
|---|---|
| 1 | 1 Platform OS dan Bahasa, 2 Mobile Interface, 3 Database dan Data Persistence, 4 Lokasi, GPS, dan Navigasi |
| 2 | 5 Mobile Cellular Network, 6 Sensor dan Spesifikasi, 7 Keamanan Komunikasi Mobile, 8 Latihan Uji Kompetensi |

Hari 3 (tentatif): uji kompetensi BNSP. Skema dan tujuh unit kompetensinya sama untuk kedua jalur; panduan dan bank soal ada di [flutter/docs/sertifikasi-bnsp](flutter/docs/sertifikasi-bnsp/00-panduan-sertifikasi.md).

## Membuka slide

Slide berupa HTML statis tanpa proses build. Buka `index.html` di root lewat peramban, atau lewat GitHub Pages bila diaktifkan. Berkas `.nojekyll` membuat Pages menyajikan berkas apa adanya, sehingga dokumen `.md` ditampilkan sebagai teks mentah. Bacalah dokumen di GitHub.

## Menjalankan aplikasi contoh

- Flutter: `cd flutter/app`, lalu `flutter pub get` dan `flutter run`.
- React Native: `cd reactnative/app`, lalu `npm install` dan `npx expo start`.

Panduan instalasi: [Dart dan Flutter](flutter/docs/instalasi-dart-flutter.md), [Node.js dan Expo](reactnative/docs/instalasi-node-expo.md).
