#!/usr/bin/env python3
"""Menyusun docs/hands-on/hari-1.md dan hari-2.md dari file asli di app/.

Kode pada panduan selalu diambil langsung dari proyek `app/`, sehingga
sama persis dengan kode yang sudah diuji (tsc, jest, expo export).

Pemakaian: python3 scripts/build_handson.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "app"

LANG = {".ts": "ts", ".tsx": "tsx", ".json": "json"}


def kode(path, keterangan):
    p = APP / path
    lang = LANG.get(p.suffix, "")
    return f"{keterangan} `{path}`:\n\n```{lang}\n{p.read_text(encoding='utf-8').rstrip()}\n```\n"


def kode_server(path, keterangan):
    p = ROOT.parent / "shared" / "server" / path
    lang = {".js": "js", ".json": "json", ".sql": "sql"}.get(p.suffix, "")
    return f"{keterangan} `shared/server/{path}`:\n\n```{lang}\n{p.read_text(encoding='utf-8').rstrip()}\n```\n"


def bash(*baris):
    return "```bash\n" + "\n".join(baris) + "\n```\n"


def jalankan_tes(*berkas):
    return "Jalankan pengujian:\n\n" + bash("npm test", "npm run typecheck")


H1 = f"""# Hands-On Hari 1: Environment, Desain Figma dan Stitch, SQLite, dan GPS

Panduan ini membangun aplikasi `associate-mobile-app` dari awal dengan **Expo dan TypeScript**. Setiap step menampilkan kode lengkap untuk file yang dibuat atau diubah, sehingga peserta dapat mengetik kode sendiri sambil mengikuti langkahnya.

**Waktu:** 09.00 to 17.00 (istirahat 12.00 to 13.00)

**Perangkat:** laptop dengan Node.js LTS, VS Code, dan ponsel Android dengan aplikasi Expo Go (atau emulator Android dari Android Studio).

---

## Step 0: Instalasi Platform, Emulator, dan Environment (09.00)

Panduan lengkap per sistem operasi ada di [docs/instalasi-node-expo.md](../instalasi-node-expo.md). Ringkasannya:

1. Pasang Node.js versi LTS dari https://nodejs.org (npm ikut terpasang).
2. Pasang Git dan VS Code.
3. Pasang aplikasi **Expo Go** di ponsel Android, atau pasang Android Studio dan buat emulator di *Device Manager*.
4. Pastikan laptop dan ponsel berada pada jaringan Wi-Fi yang sama.

Verifikasi:

{bash("node --version", "npm --version", "git --version")}
Pastikan ketiganya menampilkan nomor versi tanpa pesan error.

---

## Step 1: Buat Proyek dan Konfigurasi Dependensi (09.20)

Buat proyek baru dari templat TypeScript kosong, lalu masuk ke foldernya:

{bash("npx create-expo-app@latest associate-mobile-app --template blank-typescript", "cd associate-mobile-app")}
Pasang semua paket yang dipakai pada Hari 1 dan Hari 2 sekarang, agar tidak perlu memasang ulang. Perintah `npx expo install` memilih versi yang cocok dengan versi Expo di proyek:

{bash("npx expo install expo-router expo-sqlite expo-location expo-network expo-sensors expo-device expo-secure-store expo-status-bar react-native-webview react-native-safe-area-context react-native-screens", "npx expo install --dev jest jest-expo @types/jest typescript")}
Hapus file templat yang tidak dipakai, karena navigasi akan memakai *expo-router*:

{bash("rm App.tsx index.ts")}
Buka `package.json`, ubah `main` dan tambahkan skrip serta pengaturan jest. Bagian lain biarkan seperti hasil perintah di atas:

```json
{{
  "main": "expo-router/entry",
  "scripts": {{
    "start": "expo start",
    "android": "expo start --android",
    "test": "jest",
    "typecheck": "tsc --noEmit"
  }},
  "jest": {{
    "preset": "jest-expo"
  }}
}}
```

---

## Step 2: Konfigurasi Aplikasi dan TypeScript (09.40)

{kode("app.json", "Ganti isi")}
Plugin `expo-location` berisi teks izin yang dibaca pengguna. Daftar `permissions` Android menyatakan izin lokasi dan status jaringan.

{kode("tsconfig.json", "Ganti isi")}
Mode `strict` membuat TypeScript menandai nilai yang mungkin `null` atau `undefined` sebelum aplikasi dijalankan.

---

## Step 3: Desain di Figma dan Stitch, Token, Tema, dan Navigasi (10.00)

### 3a. Rancang di Stitch (opsional) dan Figma

1. Buka https://stitch.withgoogle.com dan tulis prompt, misalnya: *"Aplikasi catatan dengan lokasi GPS. Lima layar: Beranda, Catatan, Form Catatan, Lokasi, Sinkronisasi. Gaya bersih, warna utama biru, tombol besar."* Perbaiki lewat chat sampai sesuai. Fitur Stitch berubah cepat, jadi ikuti tampilan terbaru.
2. Salin atau ekspor hasilnya ke Figma sebagai layer yang bisa diedit, lalu rapikan dengan **Auto Layout**.
3. Buka berkas contoh pelatihan: https://www.figma.com/design/grYqOsULGfzYsDrtIjmjRL (5 layar dan 20 variable). Duplikat berkas itu ke akun Anda dan jelajahi panel **Variables**: koleksi `Warna`, `Spasi`, `Radius`, dan `Font`.
4. Bandingkan beberapa gaya (Material, iOS, minimal, gelap) dengan mengubah `warna/utama`, `radius/sm`, dan `font/isi`. Lihat semua layar ikut berubah.

### 3b. Pindahkan token ke kode

Setiap variable Figma punya padanan di `src/theme.ts` (nama sama: `warna/utama` menjadi `tema.warna.utama`). Komponen memakai `tema`, bukan angka langsung.

Buat folder `src/components` dan `app` bila belum ada.

{kode("src/theme.ts", "Buat file")}
{kode("src/ui.ts", "Buat file")}
{kode("src/menu.ts", "Buat file")}
{kode("src/components/Tombol.tsx", "Buat file")}
{kode("app/_layout.tsx", "Buat file")}
Di expo-router, setiap file di folder `app/` otomatis menjadi satu halaman, dan `_layout.tsx` mengatur bingkai navigasinya.

---

## Step 4: Halaman Beranda dan Menerapkan Gaya dengan AI (11.00)

{kode("app/index.tsx", "Buat file")}
Jalankan aplikasi dan buka lewat Expo Go dengan memindai kode QR:

{bash("npx expo start")}
Menu tampil, tetapi ketukan belum membuka halaman karena halamannya belum dibuat. Itu normal, halaman dibuat pada step berikutnya.

### Menerapkan gaya baru dengan AI

Gunakan asisten AI (misalnya Claude atau Gemini) untuk menerapkan gaya dari Figma. Contoh prompt berkonteks:

```text
Konteks: aplikasi Expo + TypeScript. Warna, spasi, radius, dan font ada di src/theme.ts,
gaya komponen dibuat dari tema di src/ui.ts. Saya lampirkan tangkapan layar Figma.
Tujuan: ubah gaya menjadi tema gelap. Ubah HANYA src/theme.ts dan src/ui.ts,
jangan ubah logika. Jaga kontras teks dan target sentuh tombol minimal 48.
Berikan perubahan sebagai diff dan jelaskan alasannya.
```

Setelah AI mengubah kode: jalankan `npm run typecheck`, lihat hasilnya di ponsel, dan **tinjau diff** sebelum menerima. Jangan menempelkan token atau kata sandi ke alat AI.

---

## Step 5: Model Data Catatan (13.00)

{kode("src/models/note.ts", "Buat file")}
`validasiJudul` adalah fungsi murni sehingga mudah diuji tanpa perangkat.

---

## Step 6: Database SQLite (13.20)

**SQLite atau MySQL?** SQLite adalah berkas di ponsel tanpa server, cocok untuk penyimpanan lokal dan tetap jalan offline. MySQL adalah basis data server untuk banyak pengguna. Aplikasi mobile **tidak boleh terhubung langsung ke MySQL** (kata sandi basis data ikut di aplikasi dan port basis data terbuka ke internet). Jalurnya: ponsel, lalu API, lalu MySQL. Hari 2 membahas API-nya; skema MySQL contoh ada di `shared/server/schema.sql`.

{kode("src/data/database.ts", "Buat file")}
Tabel dibuat hanya jika belum ada (`IF NOT EXISTS`), dan kolom `sync_status` menyiapkan sinkronisasi ke server.

---

## Step 7: Repository (13.50)

{kode("src/data/noteRepository.ts", "Buat file")}
Halaman tidak menulis SQL sendiri. Semua akses data lewat tiga fungsi ini, dan parameter selalu memakai tanda tanya (`?`) agar aman dari SQL injection.

---

## Step 8: Halaman Catatan dan Form (14.20)

{kode("app/notes.tsx", "Buat file")}
{kode("app/note-form.tsx", "Buat file")}
Uji: tambah catatan, tutup aplikasi sepenuhnya, lalu buka lagi. Catatan harus tetap ada karena tersimpan di SQLite. Tahan lama sebuah catatan untuk menghapusnya.

---

## Step 9: Layanan Lokasi dan Jarak (15.00)

{kode("src/services/distance.ts", "Buat file")}
{kode("src/services/locationService.ts", "Buat file")}
Aplikasi meminta izin lokasi saat tombol ditekan, bukan saat aplikasi dibuka. Itu prinsip izin sesuai kebutuhan.

---

## Step 10: Peta dan Simpan GPS ke SQLite (15.40)

{kode("src/services/petaHtml.ts", "Buat file")}
{kode("src/components/LeafletMap.tsx", "Buat file")}
{kode("app/location.tsx", "Buat file")}
Peta memakai OpenStreetMap lewat Leaflet di dalam `WebView`, sehingga tidak perlu API key. Ubah `ACUAN` bila ingin jarak ke tempat lain.

### Simpan GPS ke SQLite

`app/note-form.tsx` (dibuat pada Step 8) sudah memiliki tombol **Sertakan lokasi saya (GPS)**. Tombol memanggil `posisiSekarang()`, hasilnya disimpan di state `lokasi`, lalu `latitude` dan `longitude` masuk ke dua kolom tabel `notes` saat catatan disimpan. `app/notes.tsx` menampilkan koordinat memakai `formatKoordinat`.

Uji: buat catatan dengan lokasi, tutup aplikasi sepenuhnya, buka lagi, dan pastikan koordinat tetap tampil. Lalu tolak izin lokasi dan pastikan catatan tetap bisa disimpan tanpa koordinat.

---

## Step 11: Pengujian Hari 1 (16.30)

{kode("__tests__/distance.test.ts", "Buat file")}
{kode("__tests__/note.test.ts", "Buat file")}
{kode("__tests__/map.test.ts", "Buat file")}
{jalankan_tes()}
Semua pengujian harus lulus dan `tsc` tidak menampilkan error.

---

## Latihan Mandiri (16.45)

1. Tambahkan pesan khusus saat izin lokasi ditolak pada form catatan.
2. Tampilkan jarak dari posisi pengguna pada setiap kartu catatan yang punya koordinat.
3. Tambahkan pencarian judul pada halaman catatan dengan `TextInput` dan `filter`.
4. Tulis satu pengujian tambahan untuk `validasiJudul` dengan judul tepat 100 karakter.

---

## Ringkasan File

| File | Fungsi |
|---|---|
| `app.json`, `tsconfig.json` | Konfigurasi aplikasi dan TypeScript |
| `app/_layout.tsx`, `app/index.tsx` | Navigasi dan beranda |
| `src/models/note.ts` | Tipe catatan dan validasi |
| `src/data/database.ts`, `src/data/noteRepository.ts` | SQLite dan akses data |
| `app/notes.tsx`, `app/note-form.tsx` | Daftar dan form catatan |
| `src/services/distance.ts`, `src/services/locationService.ts` | Jarak Haversine dan GPS |
| `src/services/petaHtml.ts`, `src/components/LeafletMap.tsx`, `app/location.tsx` | Peta dan halaman lokasi |
| `__tests__/*.test.ts` | Pengujian otomatis |
"""

H2 = f"""# Hands-On Hari 2: API, Sensor, Sinkronisasi, dan Keamanan

Hari 2 melanjutkan aplikasi `associate-mobile-app` dari Hari 1 dan menghubungkannya ke server latihan di folder `shared/server` pada repositori ini.

**Waktu:** 09.00 to 15.00 (istirahat 12.00 to 13.00). Sisa waktu untuk latihan dan persiapan uji kompetensi.

---

## Step 0: Persiapan dan Jalankan Server Latihan (09.00)

Pastikan proyek Hari 1 masih lulus pengujian:

{bash("npm test", "npm run typecheck")}
Di terminal lain, jalankan server latihan dari folder repositori:

{bash("cd shared/server", "npm install", "npm start")}
Buka `http://localhost:3000/health` di peramban. Jawaban `{{"ok":true}}` berarti server hidup. Emulator Android mengakses komputer lewat `10.0.2.2`. Ponsel fisik memakai alamat IP komputer (misalnya `http://192.168.1.10:3000`) dan harus berada di Wi-Fi yang sama.

---

## Step 1: API Dasar: REST, Metode, dan Status (09.15)

Pelajari server latihan lebih dulu. Ini rute-rutenya:

{kode_server("app.js", "Berkas server")}
Login contoh: `peserta@contoh.id` dengan kata sandi `rahasia123`. Skema MySQL pasangannya (untuk diskusi, server latihan memakai memori):

{kode_server("schema.sql", "Skema")}
---

## Step 2: Memanggil API dari Aplikasi (09.40)

{kode("src/config.ts", "Buat file")}
{kode("src/services/httpsService.ts", "Buat file")}
{kode("src/services/apiClient.ts", "Buat file")}
`requestJson` membatasi waktu, memeriksa status, dan mengubah kesalahan server menjadi `ApiError`. `apiClient` membungkus satu fungsi per endpoint.

---

## Step 3: Sensor: Akselerometer, Giroskop, dan Kompas (10.00)

{kode("src/services/sensorMath.ts", "Buat file")}
{kode("app/sensor.tsx", "Buat file")}
Letakkan ponsel di meja: akselerometer Z mendekati 1 g. Guncang ponsel untuk memicu pesan guncangan. Putar ponsel untuk melihat giroskop. Arah kompas dari magnetometer adalah pendekatan sederhana, akurasinya dipengaruhi benda logam di sekitar.

---

## Step 4: Informasi Perangkat (10.50)

{kode("app/device.tsx", "Buat file")}
Nilai yang tidak tersedia ditampilkan sebagai tanda hubung. Di emulator, baris *Perangkat fisik* menampilkan Emulator.

---

## Step 5: Token, Penyimpanan Aman, dan Sinkronisasi (13.00)

{kode("src/services/secureStorage.ts", "Buat file")}
{kode("src/services/sync.ts", "Buat file")}
{kode("app/sinkron.tsx", "Buat file")}
Alur: catatan disimpan ke SQLite dengan status `PENDING`. Tombol **Sinkronkan** mengirim yang tertunda (POST, atau PUT bila sudah punya `serverId`), menandai `SYNCED`, lalu mengambil data baru dari server. Uji: matikan server, buat catatan, nyalakan server, tekan Sinkronkan.

---

## Step 6: Jaringan Seluler dan Keamanan Komunikasi (14.00)

{kode("src/services/networkService.ts", "Buat file")}
{kode("app/network.tsx", "Buat file")}
{kode("app/keamanan.tsx", "Buat file")}
`labelJaringan` menerjemahkan status mentah menjadi label. Uji: alamat `http://` publik ditolak, alamat lokal (`10.0.2.2`) diizinkan untuk pengembangan. Matikan Wi-Fi dan lihat label berubah.

---

## Step 7: Pengujian Hari 2 (14.30)

{kode("__tests__/https.test.ts", "Buat file")}
{kode("__tests__/network.test.ts", "Buat file")}
{kode("__tests__/api.test.ts", "Buat file")}
{kode("__tests__/sync.test.ts", "Buat file")}
{kode("__tests__/sensor.test.ts", "Buat file")}
{jalankan_tes()}
Pengujian API dan sinkronisasi memakai `fetch` palsu dan basis data tiruan, sehingga berjalan cepat tanpa jaringan. Pengujian server: `cd shared/server` lalu `npm test`.

---

## Step 8: Latihan (15.00)

1. Buat catatan saat server mati, nyalakan server, lalu sinkronkan. Pastikan status berubah menjadi SYNCED.
2. Ubah catatan yang sudah SYNCED lalu sinkronkan lagi. Pastikan server menerima PUT.
3. Tambahkan tampilan jumlah catatan PENDING pada halaman Sinkronisasi.
4. Tambahkan pengujian `sinkronkan` untuk kasus satu catatan gagal dan yang lain berhasil.
5. Persiapan uji kompetensi: buka `docs/sertifikasi-bnsp.md` dan kerjakan latihan soal.

---

## Ringkasan File Hari 2

| File | Fungsi |
|---|---|
| `shared/server/app.js`, `schema.sql` | Server latihan dan skema MySQL |
| `src/config.ts`, `src/services/httpsService.ts`, `src/services/apiClient.ts` | Memanggil API |
| `src/services/sensorMath.ts`, `app/sensor.tsx` | Sensor dan perhitungannya |
| `app/device.tsx` | Informasi perangkat |
| `src/services/secureStorage.ts`, `src/services/sync.ts`, `app/sinkron.tsx` | Token dan sinkronisasi |
| `src/services/networkService.ts`, `app/network.tsx`, `app/keamanan.tsx` | Jaringan dan keamanan |
| `__tests__/*.test.ts` | Pengujian |
"""

if __name__ == "__main__":
    (ROOT / "docs/hands-on/hari-1.md").write_text(H1, encoding="utf-8")
    (ROOT / "docs/hands-on/hari-2.md").write_text(H2, encoding="utf-8")
    print("hands-on hari-1.md dan hari-2.md ditulis")
