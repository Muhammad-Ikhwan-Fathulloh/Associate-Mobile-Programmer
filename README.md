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
shared/server/  server latihan (Express) dan skema MySQL untuk sesi API
shared/docs/    panduan Figma dan Stitch serta SQLite, MySQL, dan API (netral teknologi)
shared/assets/  CSS dan JavaScript slide yang dipakai kedua jalur
index.html      halaman awal untuk memilih jalur
```

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

Hari 3 (tentatif): uji kompetensi BNSP. Skema dan tujuh unit kompetensinya sama untuk kedua jalur; panduan dan bank soal ada di [flutter/docs/sertifikasi-bnsp](flutter/docs/sertifikasi-bnsp/00-panduan-sertifikasi.md).

## Proyek

Setiap modul punya satu proyek kecil, dan semuanya bermuara pada **proyek akhir** yang menggabungkan seluruh materi.

- [Daftar proyek modul dan proyek akhir](shared/docs/proyek/README.md)
- Proyek dasar (base) untuk proyek akhir: [React Native](reactnative/capstone-base/README.md) (sudah diuji) dan [Flutter](flutter/capstone-base/README.md) (kode Dart belum dikompilasi).
- Slide: [proyek akhir](reactnative/slides/proyek-akhir.html). Slide proyek modul ada di tiap deck modul React Native.

## Desain Figma

Berkas Figma contoh (20 variable token dan 5 layar aplikasi): https://www.figma.com/design/grYqOsULGfzYsDrtIjmjRL. Duplikat ke akun Anda untuk berlatih. Token-nya sama dengan `reactnative/app/src/theme.ts`. Panduan: [shared/docs/design-figma-stitch.md](shared/docs/design-figma-stitch.md).

## Server latihan API

```bash
cd shared/server
npm install
npm start      # http://localhost:3000, npm test untuk pengujian
```

Panduan: [shared/docs/sqlite-mysql-api.md](shared/docs/sqlite-mysql-api.md).

## Membuka slide

Slide berupa HTML statis tanpa proses build. Buka `index.html` di root lewat peramban, atau lewat GitHub Pages bila diaktifkan. Berkas `.nojekyll` membuat Pages menyajikan berkas apa adanya, sehingga dokumen `.md` ditampilkan sebagai teks mentah. Bacalah dokumen di GitHub.

## Menjalankan aplikasi contoh

- Flutter: `cd flutter/app`, lalu `flutter pub get` dan `flutter run`.
- React Native: `cd reactnative/app`, lalu `npm install` dan `npx expo start`.

Panduan instalasi: [Dart dan Flutter](flutter/docs/instalasi-dart-flutter.md), [Node.js dan Expo](reactnative/docs/instalasi-node-expo.md).
