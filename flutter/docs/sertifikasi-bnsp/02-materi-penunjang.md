# Materi Penunjang Sesuai Elemen Kompetensi

Dokumen ini melengkapi modul Hari 1 dan Hari 2 pada bagian yang diminta elemen kompetensi tetapi belum dibahas rinci. Nomor bagian dirujuk dari `01-pemetaan-unit-kompetensi.md`.

## 1. Memilih Platform OS Sesuai Kebutuhan (Unit 1)

| Pilihan | Kelebihan | Keterbatasan |
|---|---|---|
| Native Android (Kotlin atau Java) | Akses penuh ke fitur Android, kinerja terbaik | Hanya satu platform |
| Native iOS (Swift) | Akses penuh ke fitur iOS | Perlu macOS dan Xcode, hanya satu platform |
| Lintas platform (Flutter, React Native) | Satu basis kode untuk Android dan iOS, pengembangan lebih cepat | Fitur platform tertentu butuh plugin atau kode native |
| Aplikasi web progresif (PWA) | Tanpa toko aplikasi, mudah diperbarui | Akses perangkat keras terbatas |

Kriteria memilih:

1. Siapa penggunanya dan perangkat apa yang mereka pakai.
2. Fitur perangkat yang dibutuhkan (kamera, sensor, GPS, notifikasi).
3. Anggaran, waktu, dan keahlian tim.
4. Kebutuhan kinerja dan pemeliharaan jangka panjang.

Contoh keputusan: aplikasi pencatat untuk pengguna Android dengan tenggat singkat dan tim kecil dipilih Flutter agar basis kode dapat dipakai ulang untuk iOS kelak.

## 2. Alat dan Prinsip Perancangan Antarmuka (Unit 2)

Urutan perancangan:

1. **Kebutuhan pengguna**: siapa pengguna, tugas apa yang ingin diselesaikan.
2. **Daftar layar dan isi per layar**: tulis informasi apa yang tampil pada setiap layar. Pilih seperlunya karena layar kecil.
3. **Wireframe**: sketsa kasar tata letak (kertas atau alat desain seperti Figma).
4. **Prototipe**: wireframe yang dapat diklik untuk diuji pengguna.
5. **Implementasi**: widget Flutter mengikuti prototipe.
6. **Uji kegunaan**: amati pengguna menyelesaikan tugas, perbaiki hambatan.

Prinsip desain mobile:

| Prinsip | Penerapan |
|---|---|
| Satu tujuan utama per layar | Satu aksi utama tampil menonjol |
| Target sentuh cukup besar | Tombol dan item daftar mudah diketuk jari |
| Konsistensi | Tema, ikon, dan istilah sama di semua layar |
| Umpan balik | Indikator memuat, SnackBar, dan pesan kesalahan jelas |
| Aksesibilitas | Kontras warna memadai, ukuran teks dapat membesar |

## 3. Penyimpanan Internal dan Eksternal (Unit 3)

| Jenis | Isi | Cara di Flutter | Catatan |
|---|---|---|---|
| Penyimpanan internal (private aplikasi) | Berkas dan pengaturan milik aplikasi | `path_provider` (folder dokumen aplikasi), `shared_preferences` | Hanya dapat diakses aplikasi, ikut terhapus saat aplikasi dihapus |
| Penyimpanan eksternal (shared storage) | Berkas yang dapat dibagikan, misalnya foto atau unduhan | `path_provider` (direktori eksternal), pemilih berkas | Dapat diakses aplikasi lain atau pengguna, perhatikan izin dan privasi |
| Database SQLite | Data terstruktur dan relasional | `sqflite` | Mendukung kueri, indeks, dan transaksi |
| Penyimpanan aman | Token dan rahasia | `flutter_secure_storage` | Terenkripsi memakai Keystore atau Keychain |

Cara memilih: data kecil dan sederhana ke `shared_preferences`, data terstruktur ke SQLite, berkas besar ke berkas, rahasia ke secure storage. Data gambar besar disimpan sebagai berkas, sedangkan path-nya disimpan di database.

Contoh menulis dan membaca berkas di penyimpanan internal:

```dart
import 'dart:io';
import 'package:path_provider/path_provider.dart';

Future<void> tulisCatatan(String isi) async {
  final dir = await getApplicationDocumentsDirectory();
  await File('${dir.path}/catatan.txt').writeAsString(isi);
}

Future<String> bacaCatatan() async {
  final dir = await getApplicationDocumentsDirectory();
  final file = File('${dir.path}/catatan.txt');
  return await file.exists() ? file.readAsString() : '';
}
```

Contoh `shared_preferences`:

```dart
import 'package:shared_preferences/shared_preferences.dart';

Future<void> simpanTema(bool gelap) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setBool('tema_gelap', gelap);
}

Future<bool> bacaTema() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getBool('tema_gelap') ?? false;
}
```

Paket `path_provider` dan `shared_preferences` perlu ditambahkan dengan `flutter pub add path_provider shared_preferences`.

## 4. Model Berlapis dan Integrasi Server (Unit 3)

Model berlapis memisahkan tanggung jawab sehingga setiap bagian mudah diuji dan diganti.

| Lapisan | Tanggung jawab | Pada proyek `app/` |
|---|---|---|
| Presentasi | Menampilkan data dan menerima aksi pengguna | `lib/pages/` |
| State | Menyimpan data yang tampil dan memberi tahu perubahan | `lib/blocs/note_controller.dart` |
| Repository (perantara) | Menyembunyikan sumber data dari lapisan atas | `lib/data/note_repository.dart` |
| Sumber data | Database lokal dan API server | `lib/data/app_database.dart`, `lib/services/https_service.dart` |

Alur integrasi dengan database server (REST API):

```
Halaman -> Controller -> Repository -> SQLite (lokal)
                                  \-> API server (HTTPS)
```

1. Data selalu ditulis ke SQLite lebih dulu dengan status `PENDING`.
2. Saat ada koneksi, repository mengirim data berstatus `PENDING` ke server.
3. Bila server menerima, status berubah menjadi `SYNCED`.
4. Bila gagal, status tetap `PENDING` dan dicoba lagi nanti.

Kolom `sync_status` pada tabel `notes` dipakai untuk alur ini.

## 5. Sumber Lokasi dan Navigasi (Unit 4)

| Sumber lokasi | Cara kerja | Akurasi dan biaya |
|---|---|---|
| GPS | Menghitung posisi dari sinyal satelit | Akurat di luar ruangan, lebih boros baterai |
| Wi-Fi | Mencocokkan daftar jaringan Wi-Fi sekitar | Cukup baik di dalam ruangan |
| Cell-ID | Memakai posisi menara seluler terdekat | Kasar, hemat baterai |
| Gabungan (fused) | Sistem memilih sumber terbaik | Seimbang, dipakai penyedia lokasi modern |

Komponen aplikasi navigasi:

1. **Posisi pengguna**: dari GPS atau sumber lain.
2. **Tujuan**: koordinat atau alamat (geocoding).
3. **Rute**: jalur dari asal ke tujuan, biasanya dari layanan routing.
4. **Panduan**: petunjuk belok, jarak tersisa, dan pembaruan posisi berkala (`getPositionStream`).

Pertimbangan privasi: minta izin seperlunya, jelaskan tujuan penggunaan lokasi, dan jangan menyimpan atau mengirim lokasi tanpa persetujuan pengguna.

## 6. Jaringan Seluler: GSM dan Mobile IP (Unit 5)

### Arsitektur GSM

| Komponen | Singkatan | Peran |
|---|---|---|
| Mobile Station | MS | Perangkat pengguna beserta kartu SIM |
| Base Transceiver Station | BTS | Menara yang berkomunikasi radio dengan MS |
| Base Station Controller | BSC | Mengatur banyak BTS, termasuk alokasi kanal dan handover |
| Mobile Switching Center | MSC | Pusat penyambungan panggilan dan pesan |
| Home Location Register | HLR | Basis data pelanggan tetap di jaringan asal |
| Visitor Location Register | VLR | Basis data sementara pelanggan yang sedang berada di wilayah MSC tersebut |
| Authentication Center | AuC | Menyimpan kunci autentikasi pelanggan |
| Equipment Identity Register | EIR | Daftar identitas perangkat (IMEI) yang sah atau diblokir |

BTS dan BSC membentuk Base Station Subsystem (BSS). MSC, HLR, VLR, AuC, dan EIR membentuk Network Switching Subsystem (NSS). Layanan data paket pada GPRS menambahkan SGSN dan GGSN.

### Fitur per Generasi

| Generasi | Teknologi | Fitur utama |
|---|---|---|
| 2G | GSM, GPRS, EDGE | Suara digital, SMS, data paket lambat |
| 3G | UMTS, HSPA | Data mobile lebih cepat, video sederhana |
| 4G | LTE | Seluruh layanan berbasis IP, data cepat, latensi rendah |
| 5G | NR | Kecepatan sangat tinggi, latensi sangat rendah, kapasitas perangkat besar |

### Konsep Sel dan Handover

Wilayah layanan dibagi menjadi sel. Sel yang berjauhan dapat memakai frekuensi yang sama (frequency reuse). Saat pengguna berpindah sel, jaringan memindahkan sesi (handover). Saat pengguna berada di jaringan operator lain, terjadi roaming dan VLR di wilayah tamu mencatat pelanggan tersebut.

### Mobile IP

Mobile IP memungkinkan perangkat berpindah jaringan tanpa mengganti alamat IP utamanya, sehingga koneksi tetap tersambung.

| Istilah | Arti |
|---|---|
| Mobile Node | Perangkat yang berpindah jaringan |
| Home Address | Alamat IP tetap di jaringan asal |
| Home Agent | Router di jaringan asal yang menerima paket untuk Mobile Node |
| Foreign Agent | Router di jaringan tamu yang melayani Mobile Node |
| Care-of Address | Alamat sementara di jaringan tamu |

Prosesnya:

1. **Penemuan agen**: Mobile Node mengetahui bahwa ia berada di jaringan tamu.
2. **Registrasi**: Mobile Node melapor ke Home Agent dan mengirim care-of address.
3. **Tunneling**: paket yang ditujukan ke home address dibungkus dan diteruskan Home Agent ke care-of address.
4. **Pengiriman**: Foreign Agent atau Mobile Node membuka bungkus paket dan menerimanya.

## 7. Sensor: Node, Hardware, Protokol, dan Keamanan (Unit 6)

### Node Sensor

Node sensor adalah satuan yang mengindera besaran fisik lalu menyerahkannya sebagai data. Ponsel memiliki banyak node sensor: akselerometer, giroskop, magnetometer, proximity, cahaya, barometer, GPS.

### Alur Hardware ke Aplikasi

```
Besaran fisik -> Sensor (transducer) -> ADC -> Prosesor/hub sensor -> Driver OS -> API Flutter (stream) -> Tampilan
```

1. **Transducer** mengubah besaran fisik menjadi sinyal listrik.
2. **ADC** (analog-to-digital converter) mengubah sinyal menjadi angka digital.
3. **Prosesor atau sensor hub** menyaring dan menggabungkan data.
4. **Driver dan API sistem operasi** menyediakan data bagi aplikasi.
5. **Aplikasi** berlangganan stream dan memprosesnya.

### Protokol

| Lingkup | Protokol | Keterangan |
|---|---|---|
| Di dalam perangkat | I2C, SPI | Jalur komunikasi sensor ke prosesor |
| Nirkabel jarak dekat | Bluetooth Low Energy (BLE) | Sensor eksternal, wearable, hemat daya |
| Nirkabel jaringan sensor | Zigbee | Jaringan sensor berdaya rendah |
| Ke server | HTTPS, MQTT | Pengiriman data sensor ke cloud |

### Aspek Keamanan Sensor

| Risiko | Contoh | Perlindungan |
|---|---|---|
| Privasi | Mikrofon, kamera, dan lokasi mengungkap aktivitas pengguna | Minta izin eksplisit dan jelaskan tujuan |
| Kebocoran data | Data sensor dikirim tanpa enkripsi | Gunakan HTTPS atau TLS |
| Penyalahgunaan | Aplikasi membaca sensor di latar belakang tanpa alasan | Gunakan sensor hanya saat diperlukan, batalkan langganan |
| Pemalsuan data | Data sensor palsu masuk ke sistem | Validasi dan autentikasi di server |

## 8. Kerentanan dan Serangan pada Lingkungan Mobile (Unit 7)

### Kerentanan Jaringan Nirkabel

| Kerentanan | Penjelasan |
|---|---|
| Wi-Fi terbuka | Lalu lintas tidak dienkripsi sehingga mudah disadap |
| Enkripsi lemah | Standar usang seperti WEP mudah dibobol |
| Rogue access point (evil twin) | Titik akses palsu bernama mirip jaringan sah |
| Bluetooth terbuka | Perangkat yang dapat ditemukan tanpa pembatasan menjadi sasaran |
| Sinyal siaran | Gelombang radio dapat diterima siapa pun dalam jangkauan |

### Tipe Serangan

| Serangan | Penjelasan | Pencegahan |
|---|---|---|
| Sniffing | Membaca lalu lintas jaringan | Enkripsi, hindari Wi-Fi tak terlindungi |
| Man-in-the-middle (MITM) | Menyisipkan diri di antara dua pihak untuk menyadap atau mengubah data | HTTPS dengan verifikasi sertifikat |
| Phishing | Menipu pengguna agar memberi data lewat tautan atau aplikasi palsu | Edukasi pengguna, unduh dari toko resmi |
| Malware | Aplikasi berbahaya mencuri data atau menyalahgunakan perangkat | Pemindaian toko aplikasi, izin minimal, pembaruan |
| Pencurian perangkat | Data diakses langsung dari perangkat | Kunci layar, enkripsi penyimpanan |
| Injeksi data | Masukan berbahaya merusak sistem | Validasi dan sanitasi input |
| Rekayasa balik (reverse engineering) | Aplikasi dibongkar untuk mencari rahasia | Jangan menanam rahasia di aplikasi, obfuscation |

### Teknik Perlindungan

1. **Enkripsi saat transit**: HTTPS atau TLS untuk semua permintaan jaringan.
2. **Enkripsi saat disimpan**: `flutter_secure_storage` untuk token dan rahasia.
3. **Autentikasi kuat**: kata sandi yang baik, verifikasi dua langkah, token berumur pendek.
4. **Otorisasi**: server memeriksa hak akses setiap permintaan.
5. **Validasi input**: tolak masukan yang tidak sesuai, termasuk URL non-HTTPS.
6. **Izin minimal**: minta hanya izin yang benar-benar dipakai.
7. **Pembaruan**: perbarui dependensi dan sistem operasi untuk menutup celah.
8. **Jangan mencatat rahasia**: token tidak ditulis ke log atau layar.
