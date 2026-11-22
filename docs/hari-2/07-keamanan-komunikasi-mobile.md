# Modul 7: Dasar-Dasar Mobile Communication Security

Waktu: 13.00 to 15.00 (Hari 2)

## Tujuan Pembelajaran

Setelah modul ini, peserta mampu:

1. Menjelaskan ancaman umum pada komunikasi mobile.
2. Menjelaskan fungsi enkripsi, HTTPS, dan TLS.
3. Membedakan autentikasi dan otorisasi.
4. Menyimpan data sensitif dengan aman di perangkat.
5. Menerapkan praktik keamanan dasar pada aplikasi Flutter.

## 1. Ancaman pada Komunikasi Mobile

| Ancaman | Penjelasan | Contoh |
|---|---|---|
| Penyadapan (sniffing) | Data dibaca saat melewati jaringan | Pengguna memakai Wi-Fi publik tanpa perlindungan |
| Man-in-the-middle | Pihak ketiga menyisipkan diri di tengah komunikasi | Sertifikat palsu dipasang di perangkat |
| Pencurian perangkat | Data diakses langsung dari perangkat | Token login tersimpan dalam teks biasa |
| Aplikasi palsu | Aplikasi tiruan meminta data pengguna | Aplikasi di luar toko resmi |
| Injeksi data | Input yang tidak divalidasi merusak sistem | Kolom input berisi perintah tersembunyi |

## 2. Enkripsi, HTTPS, dan TLS

**Enkripsi** mengubah data menjadi bentuk yang tidak dapat dibaca tanpa kunci. Ada dua jenis utama: enkripsi simetris (kunci sama untuk mengenkripsi dan mendekripsi) dan asimetris (kunci publik dan kunci privat).

**TLS (Transport Layer Security)** adalah protokol yang membangun koneksi terenkripsi antara aplikasi dan server. Protokol ini memastikan:

- Kerahasiaan: data tidak dapat dibaca pihak ketiga.
- Integritas: data tidak berubah di tengah jalan.
- Autentikasi server: aplikasi memverifikasi bahwa server adalah pihak yang benar melalui sertifikat.

**HTTPS** adalah HTTP yang dilindungi TLS. Di Flutter, cukup pastikan semua URL memakai `https://`. Android modern memblokir lalu lintas HTTP biasa secara default.

## 3. Autentikasi dan Otorisasi

- **Autentikasi** menjawab pertanyaan "siapa Anda?", misalnya dengan email dan kata sandi.
- **Otorisasi** menjawab pertanyaan "apa yang boleh Anda lakukan?", misalnya hanya admin yang dapat menghapus data.

Setelah login, server biasanya mengirim **token**. Aplikasi menyertakan token pada setiap request. Token harus diperlakukan seperti kata sandi: jangan dicetak di log, jangan dikirim ke URL, dan simpan dengan aman.

## 4. Penyimpanan Data Sensitif

| Tempat penyimpanan | Cocok untuk | Catatan |
|---|---|---|
| Variabel di memori | Data sementara selama layar aktif | Hilang saat aplikasi ditutup |
| SharedPreferences | Pengaturan non-sensitif (tema, bahasa) | Tidak terenkripsi |
| Database SQLite | Data aplikasi dalam jumlah besar | Tidak terenkripsi secara default |
| Secure storage | Token, kunci, dan data sensitif kecil | Menggunakan Keystore (Android) dan Keychain (iOS) |

Package `flutter_secure_storage` menyimpan nilai di tempat penyimpanan aman milik sistem operasi.

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const penyimpanan = FlutterSecureStorage();

await penyimpanan.write(key: 'token', value: 'contoh-token');
final token = await penyimpanan.read(key: 'token');
await penyimpanan.delete(key: 'token');
```

## 5. Praktik Keamanan Dasar pada Aplikasi Flutter

1. Gunakan HTTPS untuk semua permintaan jaringan dan tolak URL `http://`.
2. Berikan batas waktu (timeout) pada setiap request.
3. Validasi semua input dari pengguna sebelum dikirim ke server.
4. Jangan menyimpan kata sandi atau kunci rahasia di dalam kode sumber atau repositori publik.
5. Tampilkan pesan error yang umum kepada pengguna, dan catat detail teknisnya hanya di sisi pengembang.
6. Gunakan `.gitignore` untuk mencegah kunci dan berkas keystore ikut terunggah.
7. Unduh aplikasi hanya dari sumber resmi dan perbarui dependensi secara berkala.

## Diskusi

1. Mengapa token login tidak boleh disimpan di SharedPreferences?
2. Apa risiko jika aplikasi menerima sertifikat TLS apa pun tanpa memeriksanya?
3. Data apa di aplikasi Anda yang termasuk data sensitif?

## Referensi

- Panduan flutter_secure_storage: https://pub.dev/packages/flutter_secure_storage
- Panduan keamanan jaringan Android: https://developer.android.com/privacy-and-security/security-config
- Panduan hands-on: [docs/hands-on/hari-2.md](../hands-on/hari-2.md), Step 4 dan Step 5
- Slide modul: [slides/hari-2-modul-7-keamanan-komunikasi.html](../../slides/hari-2-modul-7-keamanan-komunikasi.html)
