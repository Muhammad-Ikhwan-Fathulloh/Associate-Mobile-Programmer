# SQLite, MySQL, dan API

Panduan ini berlaku untuk jalur Flutter dan React Native.

## SQLite atau MySQL

| Aspek | SQLite | MySQL |
|---|---|---|
| Lokasi | Berkas di ponsel, tertanam di aplikasi | Server terpisah |
| Pengguna | Satu aplikasi, satu pengguna | Banyak pengguna bersamaan |
| Instalasi | Tanpa instalasi | Perlu server dan akun basis data |
| Offline | Tetap jalan | Butuh jaringan |
| Peran | Penyimpanan lokal | Penyimpanan pusat di belakang API |

## Mengapa ponsel tidak langsung ke MySQL

MySQL dan PostgreSQL adalah program server yang menunggu koneksi di jaringan. Ponsel bukan tempat server semacam itu berjalan, dan aplikasi tidak boleh langsung menyambung ke sana. Alasannya:

1. **Server basis data tidak berjalan di ponsel.** Untuk tersambung, aplikasi harus tahu alamat, port, dan kredensial server. Ponsel hanya klien.
2. **Kredensial ikut terbawa ke aplikasi.** Berkas APK atau aplikasi iOS bisa dibongkar. Siapa pun yang memasangnya bisa membaca nama pengguna dan kata sandi database, lalu mengakses atau mengubah semua data.
3. **Aturan bisnis tidak punya tempat.** Pemeriksaan seperti judul kosong, hak mengubah catatan milik orang lain, dan batas permintaan hanya bisa dijalankan di server. Jika aplikasi menulis langsung ke database, aturan itu ada di kode klien yang bisa dimodifikasi.
4. **Jaringan seluler tidak stabil.** Koneksi basis data membutuhkan sesi yang panjang. Ponsel sering berpindah jaringan dan kehilangan sinyal. Permintaan HTTPS yang singkat dan bisa diulang lebih cocok.
5. **Banyak perangkat sekaligus.** Server basis data melayani koneksi dari server aplikasi lewat pool koneksi. Ratusan ribu ponsel yang membuka koneksi langsung akan membebani server dan menghabiskan batas koneksi.

**Mengapa SQLite boleh di ponsel.** SQLite bukan server. Ia pustaka yang menulis data ke satu berkas di dalam aplikasi. Tidak ada port, kredensial, atau jaringan. Hanya aplikasi itu yang bisa membaca berkasnya, dan data tetap ada saat offline.

**Pola yang benar** terdiri dari dua lapis:

- **Di ponsel:** SQLite untuk data lokal dan status `PENDING` atau `SYNCED`.
- **Di server:** API yang terhubung ke MySQL atau PostgreSQL, dan memeriksa setiap permintaan.

Jalur yang benar: **ponsel, lalu API (HTTPS dan token), lalu MySQL**.

Layanan seperti Firebase atau Supabase memungkinkan aplikasi membaca basis data secara langsung. Layanan itu tetap memakai kunci API dan aturan akses per pengguna di sisi server, jadi lapisan server tetap ada di baliknya.

## Server latihan

Folder `shared/server` berisi server Express untuk latihan. Penyimpanannya di memori agar mudah dijalankan. Skema MySQL pasangannya ada di `shared/server/schema.sql` untuk bahan diskusi.

```bash
cd shared/server
npm install
npm start       # http://localhost:3000
npm test        # 4 pengujian
```

Alamat dari aplikasi:

| Lingkungan | Alamat server |
|---|---|
| Emulator Android | `http://10.0.2.2:3000` |
| Ponsel fisik | `http://IP-KOMPUTER:3000` (satu Wi-Fi) |
| Peramban di komputer | `http://localhost:3000` |

Login contoh: `peserta@contoh.id` dengan kata sandi `rahasia123`. Ini hanya data latihan.

## Rute

| Rute | Aksi | Status berhasil |
|---|---|---|
| `GET /health` | Cek server | 200 |
| `POST /login` | Dapatkan token | 200 |
| `GET /notes` | Daftar catatan | 200 |
| `POST /notes` | Buat catatan | 201 |
| `PUT /notes/:id` | Ubah catatan | 200 |
| `DELETE /notes/:id` | Hapus catatan | 204 |

Kesalahan: 400 (data tidak valid), 401 (token tidak ada atau salah), 404 (tidak ditemukan). Semua rute catatan memerlukan header `Authorization: Bearer <token>`.

Contoh dengan curl:

```bash
TOKEN=$(curl -s -X POST localhost:3000/login -H 'Content-Type: application/json' \
  -d '{"email":"peserta@contoh.id","password":"rahasia123"}' | sed 's/.*"token":"\([^"]*\)".*/\1/')
curl -s localhost:3000/notes -H "Authorization: Bearer $TOKEN"
```

## Keamanan

Server latihan memakai HTTP dan data di memori, hanya untuk jaringan lokal. Di produksi: HTTPS, kata sandi di-hash, token berkedaluwarsa, validasi di server, dan basis data tidak dibuka ke internet.
