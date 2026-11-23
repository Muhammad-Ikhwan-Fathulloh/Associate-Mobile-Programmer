# Modul 5: Mobile Cellular Network

Waktu: 09.00 to 10.00 (Hari 2)

## Tujuan Pembelajaran

Setelah modul ini, peserta mampu:

1. Menjelaskan perkembangan generasi jaringan seluler dari 2G sampai 5G.
2. Menjelaskan arsitektur dasar jaringan seluler.
3. Menjelaskan spektrum, handover, dan roaming.
4. Mendeteksi jenis jaringan yang sedang digunakan perangkat di dalam aplikasi Flutter.
5. Menilai pengaruh jenis jaringan terhadap kinerja aplikasi.

## 1. Perkembangan Generasi Seluler

| Generasi | Teknologi umum | Kemampuan utama | Dampak pada aplikasi |
|---|---|---|---|
| 2G | GSM, GPRS, EDGE | Suara dan pesan singkat, data sangat lambat | Pesan teks saja, gambar sulit dimuat |
| 3G | UMTS, HSPA | Data mobile dasar, video sederhana | Peramban dan email dapat digunakan |
| 4G | LTE | Data cepat, latensi rendah | Video, peta, dan streaming lancar |
| 5G | NR (New Radio) | Kecepatan tinggi, latensi sangat rendah, kapasitas besar | Aplikasi real time dan IoT skala besar |

Catatan: generasi tidak otomatis menjamin kecepatan. Kualitas sinyal, jumlah pengguna pada satu sel, dan kondisi bangunan sangat memengaruhi kinerja.

## 2. Arsitektur Dasar Jaringan Seluler

Jaringan seluler terdiri dari tiga bagian utama:

1. **User Equipment (UE)**: perangkat mobile dengan SIM atau eSIM.
2. **Radio Access Network (RAN)**: menara BTS (2G/3G) atau gNodeB dan eNodeB (4G/5G) yang melayani perangkat melalui gelombang radio.
3. **Core Network**: pusat kendali yang mengatur autentikasi, sesi data, dan tagihan. Pada 4G disebut EPC, pada 5G disebut 5GC.

Alur singkat saat aplikasi mengakses internet lewat seluler:

```
Aplikasi -> Sistem operasi -> Modem perangkat -> Menara (RAN) -> Core Network -> Internet
```

## 3. Spektrum, Handover, dan Roaming

**Spektrum** adalah rentang frekuensi radio yang dipakai operator. Frekuensi rendah menjangkau area luas tetapi kapasitasnya kecil. Frekuensi tinggi (mmWave) kapasitasnya besar tetapi jangkauannya pendek.

**Handover** adalah perpindahan koneksi perangkat dari satu menara ke menara lain tanpa memutus sesi. Saat handover gagal, aplikasi dapat mengalami jeda atau koneksi terputus sebentar.

**Roaming** adalah penggunaan jaringan operator lain saat perangkat berada di luar area layanan operator utama, misalnya di luar negeri. Roaming biasanya lebih mahal dan latensinya lebih besar.

## 4. Mendeteksi Jenis Jaringan di Flutter

Package `connectivity_plus` memberi tahu aplikasi apakah perangkat terhubung lewat Wi-Fi, seluler, Ethernet, VPN, atau tidak terhubung sama sekali.

```dart
import 'package:connectivity_plus/connectivity_plus.dart';

final hasil = await Connectivity().checkConnectivity();
// Hasil berupa List<ConnectivityResult>, contoh: [ConnectivityResult.mobile]

Connectivity().onConnectivityChanged.listen((hasil) {
  // Dipanggil setiap jenis koneksi berubah
});
```

Perhatikan bahwa `connectivity_plus` hanya mengetahui **jenis** koneksi, bukan generasi (2G, 3G, 4G, atau 5G) dan bukan kecepatan. Untuk mengukur kualitas koneksi, aplikasi perlu melakukan uji unduhan kecil atau mengukur waktu respons API.

## 5. Pengaruh Jenis Jaringan terhadap Aplikasi

Strategi yang umum dipakai pada aplikasi mobile:

- Tampilkan pesan jelas saat tidak ada koneksi, jangan biarkan layar kosong tanpa penjelasan.
- Simpan data penting di perangkat (lihat modul 3) sehingga aplikasi tetap dapat dipakai saat offline.
- Hindari mengunduh berkas besar otomatis saat jaringan seluler, dan tawarkan opsi unduh saat Wi-Fi.
- Atur batas waktu (timeout) untuk setiap request agar pengguna tidak menunggu tanpa batas.
- Saat koneksi kembali, sinkronkan data yang tertunda.

## Diskusi

1. Mengapa 5G tidak selalu terasa lebih cepat di setiap lokasi?
2. Apa yang terjadi pada video call saat handover terjadi?
3. Data apa di aplikasi Anda yang harus tetap bisa diakses saat offline?

## Referensi

- Panduan connectivity_plus: https://pub.dev/packages/connectivity_plus
- Panduan hands-on: [docs/hands-on/hari-2.md](../hands-on/hari-2.md), Step 1 dan Step 6
- Slide modul: [slides/hari-2-modul-5-mobile-cellular-network.html](../../slides/hari-2-modul-5-mobile-cellular-network.html)
