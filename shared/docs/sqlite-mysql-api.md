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

- Kata sandi basis data harus ada di aplikasi, dan aplikasi dapat dibongkar.
- Port MySQL terbuka ke internet, menambah risiko serangan.
- Tidak ada tempat memeriksa hak akses dan validasi per pengguna.

Jalur yang benar: **ponsel, lalu API (HTTPS dan token), lalu MySQL**.

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
