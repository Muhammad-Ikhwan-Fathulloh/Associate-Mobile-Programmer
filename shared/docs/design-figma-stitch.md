# Desain dengan Figma dan Google Stitch

Panduan ini berlaku untuk jalur Flutter dan React Native (Hari 1, 10.00 to 12.00).

## Berkas contoh

Berkas Figma pelatihan: https://www.figma.com/design/grYqOsULGfzYsDrtIjmjRL

Isinya 20 variable dalam empat koleksi (`Warna`, `Spasi`, `Radius`, `Font`) dan lima layar aplikasi Catatan Lokasi: Beranda, Catatan, Form Catatan, Lokasi, dan Sinkronisasi. Semua warna, jarak, dan radius pada layar terhubung ke variable. Duplikat berkas ke akun Anda sebelum mengubahnya.

| Variable | Nilai | Padanan React Native |
|---|---|---|
| `warna/utama` | #1565c0 | `tema.warna.utama` |
| `warna/latar` | #f5f7fb | `tema.warna.latar` |
| `warna/kartu` | #ffffff | `tema.warna.kartu` |
| `warna/teks` | #1b1f27 | `tema.warna.teks` |
| `warna/abu` | #5f6b7a | `tema.warna.abu` |
| `warna/garis` | #cfd6e0 | `tema.warna.garis` |
| `warna/bahaya` | #c62828 | `tema.warna.bahaya` |
| `warna/ok` | #2e7d32 | `tema.warna.ok` |
| `spasi/xs` sampai `spasi/xl` | 4, 8, 12, 16, 24 | `tema.spasi` |
| `radius/sm`, `md`, `lg` | 8, 12, 20 | `tema.radius` |
| `font/kecil`, `isi`, `judul`, `besar` | 13, 15, 18, 24 | `tema.font` |

## Alur kerja

1. **Tulis kebutuhan**: siapa penggunanya, layar apa saja, tugas utama tiap layar.
2. **Rancangan awal di Google Stitch** (`https://stitch.withgoogle.com`): tulis prompt yang menyebut layar, isi, dan gaya. Perbaiki lewat chat. Salin atau ekspor ke Figma sebagai layer yang bisa diedit. Fitur Stitch berubah cepat, ikuti tampilan terbaru.
3. **Rapikan di Figma**: Auto Layout untuk tata letak, komponen untuk elemen berulang (tombol, kartu, input), variable untuk warna, spasi, radius, dan font.
4. **Bandingkan gaya**: Material, iOS, minimal, dan gelap. Ubah variable dan lihat semua layar berubah.
5. **Pindahkan token ke kode**: React Native memakai `src/theme.ts`. Flutter memakai `ThemeData` atau kelas `Tema` (lihat [tambahan Flutter](../../flutter/docs/hands-on/tambahan-agenda-baru.md)).
6. **Minta AI menerapkan gaya**: sertakan konteks, tujuan, bukti desain, dan batasan. Tinjau diff, jalankan pemeriksaan tipe dan tes, lihat hasilnya di perangkat.

## Contoh prompt Stitch

```text
Aplikasi catatan dengan lokasi GPS untuk mahasiswa. Lima layar: Beranda berisi menu,
Catatan berisi daftar kartu dengan koordinat, Form Catatan dengan tombol "Sertakan lokasi
saya", Lokasi dengan peta, dan Sinkronisasi dengan kolom URL server. Gaya bersih dan
minimal, warna utama biru, tombol besar dan mudah diketuk, ukuran 360 x 720.
```

## Contoh prompt AI untuk kode

```text
Konteks: aplikasi Expo + TypeScript. Token ada di src/theme.ts, gaya komponen dari tema
di src/ui.ts. Saya lampirkan tangkapan layar Figma.
Tujuan: ubah gaya menjadi tema gelap. Ubah HANYA src/theme.ts dan src/ui.ts, jangan ubah
logika. Jaga kontras teks dan target sentuh tombol minimal 48.
Berikan perubahan sebagai diff dan jelaskan alasannya.
```

Jangan menempelkan token, kata sandi, atau kunci API ke alat AI.

## Catatan

- Target sentuh minimal sekitar 48 dp (Material) atau 44 pt (Apple HIG).
- Dev Mode dan Dev Mode MCP server di Figma membantu menyerahkan desain ke pengembang. Beberapa fitur memerlukan kursi berbayar, cek paket Anda.
