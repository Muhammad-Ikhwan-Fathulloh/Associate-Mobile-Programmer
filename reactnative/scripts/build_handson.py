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


def bash(*baris):
    return "```bash\n" + "\n".join(baris) + "\n```\n"


def jalankan_tes(*berkas):
    return "Jalankan pengujian:\n\n" + bash("npm test", "npm run typecheck")


H1 = f"""# Hands-On Hari 1: Dasar React Native, Database Lokal, dan Lokasi

Panduan ini membangun aplikasi `associate-mobile-app` dari awal dengan **Expo dan TypeScript**. Setiap step menampilkan kode lengkap untuk file yang dibuat atau diubah, sehingga peserta dapat mengetik kode sendiri sambil mengikuti langkahnya.

**Waktu:** 09.00 to 17.00 (istirahat 12.00 to 13.00)

**Perangkat:** laptop dengan Node.js LTS, VS Code, dan ponsel Android dengan aplikasi Expo Go (atau emulator Android dari Android Studio).

---

## Step 0: Instalasi dan Cek Lingkungan (09.00)

Panduan lengkap per sistem operasi ada di [docs/instalasi-node-expo.md](../instalasi-node-expo.md). Ringkasannya:

1. Pasang Node.js versi LTS dari https://nodejs.org (npm ikut terpasang).
2. Pasang Git dan VS Code.
3. Pasang aplikasi **Expo Go** di ponsel Android, atau pasang Android Studio dan buat emulator di *Device Manager*.
4. Pastikan laptop dan ponsel berada pada jaringan Wi-Fi yang sama.

Verifikasi:

{bash("node --version", "npm --version", "git --version")}
Pastikan ketiganya menampilkan nomor versi tanpa pesan error.

---

## Step 1: Buat Proyek dan Konfigurasi Dependensi (09.15)

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

## Step 2: Konfigurasi Aplikasi dan TypeScript (09.35)

{kode("app.json", "Ganti isi")}
Plugin `expo-location` berisi teks izin yang dibaca pengguna. Daftar `permissions` Android menyatakan izin lokasi dan status jaringan.

{kode("tsconfig.json", "Ganti isi")}
Mode `strict` membuat TypeScript menandai nilai yang mungkin `null` atau `undefined` sebelum aplikasi dijalankan.

---

## Step 3: Tema, Menu, dan Layout Navigasi (09.50)

Buat folder `src/components` dan `app` bila belum ada.

{kode("src/ui.ts", "Buat file")}
{kode("src/menu.ts", "Buat file")}
{kode("src/components/Tombol.tsx", "Buat file")}
{kode("app/_layout.tsx", "Buat file")}
Di expo-router, setiap file di folder `app/` otomatis menjadi satu halaman, dan `_layout.tsx` mengatur bingkai navigasinya.

---

## Step 4: Halaman Beranda (10.05)

{kode("app/index.tsx", "Buat file")}
Jalankan aplikasi dan buka lewat Expo Go dengan memindai kode QR:

{bash("npx expo start")}
Menu tampil, tetapi ketukan belum membuka halaman karena halamannya belum dibuat. Itu normal, halaman dibuat pada step berikutnya.

---

## Step 5: Model Data Catatan (10.30)

{kode("src/models/note.ts", "Buat file")}
`validasiJudul` adalah fungsi murni sehingga mudah diuji tanpa perangkat.

---

## Step 6: Database SQLite (10.50)

{kode("src/data/database.ts", "Buat file")}
Tabel dibuat hanya jika belum ada (`IF NOT EXISTS`), dan kolom `sync_status` menyiapkan sinkronisasi ke server.

---

## Step 7: Repository (11.05)

{kode("src/data/noteRepository.ts", "Buat file")}
Halaman tidak menulis SQL sendiri. Semua akses data lewat tiga fungsi ini, dan parameter selalu memakai tanda tanya (`?`) agar aman dari SQL injection.

---

## Step 8: Halaman Catatan dan Form (11.30)

{kode("app/notes.tsx", "Buat file")}
{kode("app/note-form.tsx", "Buat file")}
Uji: tambah catatan, tutup aplikasi sepenuhnya, lalu buka lagi. Catatan harus tetap ada karena tersimpan di SQLite. Tahan lama sebuah catatan untuk menghapusnya.

---

## Step 9: Layanan Lokasi dan Jarak (13.00)

{kode("src/services/distance.ts", "Buat file")}
{kode("src/services/locationService.ts", "Buat file")}
Aplikasi meminta izin lokasi saat tombol ditekan, bukan saat aplikasi dibuka. Itu prinsip izin sesuai kebutuhan.

---

## Step 10: Peta dan Halaman Lokasi (14.00)

{kode("src/services/petaHtml.ts", "Buat file")}
{kode("src/components/LeafletMap.tsx", "Buat file")}
{kode("app/location.tsx", "Buat file")}
Peta memakai OpenStreetMap lewat Leaflet di dalam `WebView`, sehingga tidak perlu API key. Ubah `ACUAN` bila ingin jarak ke tempat lain.

---

## Step 11: Pengujian Hari 1 (14.30)

{kode("__tests__/distance.test.ts", "Buat file")}
{kode("__tests__/note.test.ts", "Buat file")}
{kode("__tests__/map.test.ts", "Buat file")}
{jalankan_tes()}
Semua pengujian harus lulus dan `tsc` tidak menampilkan error.

---

## Latihan Mandiri (15.00)

1. Tambahkan tombol **Simpan lokasi** pada form catatan, isi `latitude` dan `longitude` dari `posisiSekarang()`.
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

H2 = f"""# Hands-On Hari 2: Jaringan, Sensor, Perangkat, dan Keamanan

Hari 2 melanjutkan aplikasi `associate-mobile-app` dari Hari 1.

**Waktu:** 09.00 to 17.00 (istirahat 12.00 to 13.00)

---

## Step 0: Persiapan (09.00)

Semua paket Hari 2 sudah terpasang pada Step 1 Hari 1. Pastikan proyek Hari 1 masih lulus pengujian:

{bash("npm test", "npm run typecheck", "npx expo start")}
Jika ada error, selesaikan dahulu sebelum menambah fitur baru.

---

## Step 1: Jaringan Seluler (09.15)

{kode("src/services/networkService.ts", "Buat file")}
{kode("app/network.tsx", "Buat file")}
`labelJaringan` menerjemahkan status mentah menjadi label. Uji: matikan Wi-Fi dan nyalakan data seluler, lalu tekan **Periksa Ulang**. Label harus berubah dari Wi-Fi ke Seluler. Nyalakan mode pesawat untuk melihat **Tidak ada koneksi**.

---

## Step 2: Sensor (10.00)

{kode("app/sensor.tsx", "Buat file")}
Letakkan ponsel di meja, nilai Z mendekati 1 g karena gravitasi. Goyangkan ponsel untuk melihat besar total berubah. `return () => langganan?.remove()` berhenti membaca sensor saat halaman ditutup, supaya baterai hemat.

---

## Step 3: Informasi Perangkat (10.40)

{kode("app/device.tsx", "Buat file")}
Nilai yang tidak tersedia ditampilkan sebagai tanda hubung. Di emulator, baris *Perangkat fisik* menampilkan Emulator.

---

## Step 4: Penyimpanan Aman (13.00)

{kode("src/services/secureStorage.ts", "Buat file")}
`expo-secure-store` menyimpan nilai di Keystore Android atau Keychain iOS. Pakai ini untuk token dan kata sandi, bukan untuk data biasa.

---

## Step 5: HTTPS dan Halaman Keamanan (13.10)

{kode("src/services/httpsService.ts", "Buat file")}
{kode("app/keamanan.tsx", "Buat file")}
Uji: ambil data dari alamat `https://`, lalu ganti menjadi `http://` dan pastikan ditolak. Simpan token, tutup aplikasi, buka lagi, lalu tekan **Baca Token**.

---

## Step 6: Menjalankan Seluruh Aplikasi (13.40)

Semua halaman sudah terdaftar di `app/_layout.tsx` dan `src/menu.ts`. Jalankan aplikasi dan telusuri setiap menu:

{bash("npx expo start")}
Periksa daftar berikut:

1. Catatan: tambah, ubah, hapus, lalu tutup dan buka aplikasi.
2. Lokasi: izin muncul saat tombol ditekan, peta tampil.
3. Jaringan: label sesuai kondisi koneksi.
4. Sensor: angka berubah saat ponsel digerakkan.
5. Keamanan: URL http ditolak, token tersimpan.

---

## Step 7: Pengujian (14.00)

{kode("__tests__/https.test.ts", "Buat file")}
{kode("__tests__/network.test.ts", "Buat file")}
{jalankan_tes()}
Pengujian jaringan memakai fungsi `fetch` palsu, sehingga berjalan cepat tanpa internet.

---

## Step 8: Latihan (15.00 to 17.00)

1. Tambahkan peringatan pada halaman jaringan bila jenisnya **Seluler**: "Anda memakai data seluler".
2. Tambahkan pengujian `ambilJson` untuk respons JSON yang tidak valid.
3. Tampilkan waktu terakhir pemeriksaan pada halaman jaringan.
4. Persiapan uji kompetensi: buka `docs/sertifikasi-bnsp/` dan kerjakan latihan soal.

---

## Ringkasan File Hari 2

| File | Fungsi |
|---|---|
| `src/services/networkService.ts`, `app/network.tsx` | Status dan jenis jaringan |
| `app/sensor.tsx` | Akselerometer |
| `app/device.tsx` | Informasi perangkat |
| `src/services/secureStorage.ts` | Penyimpanan aman |
| `src/services/httpsService.ts`, `app/keamanan.tsx` | Pemeriksaan HTTPS dan halaman keamanan |
| `__tests__/https.test.ts`, `__tests__/network.test.ts` | Pengujian Hari 2 |
"""

if __name__ == "__main__":
    (ROOT / "docs/hands-on/hari-1.md").write_text(H1, encoding="utf-8")
    (ROOT / "docs/hands-on/hari-2.md").write_text(H2, encoding="utf-8")
    print("hands-on hari-1.md dan hari-2.md ditulis")
