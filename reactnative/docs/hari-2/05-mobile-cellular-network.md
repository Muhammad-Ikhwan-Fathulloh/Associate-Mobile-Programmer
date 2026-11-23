# Modul 5: Mobile Cellular Network

**Durasi:** 09.00 to 10.00

**Unit kompetensi BNSP:** J.612000.025.01

## Pengantar

Ponsel adalah perangkat yang berpindah-pindah, dan jaringannya ikut berubah: Wi-Fi, seluler, bahkan tanpa sinyal. Modul ini memberi gambaran besar jaringan seluler, dari generasi 2G sampai 5G dan dari menara pemancar sampai pusat penyambungan, lalu menurunkannya menjadi keputusan di aplikasi. Pertanyaan kuncinya: apa yang dilakukan aplikasi kita saat koneksi buruk?

## Tujuan Pembelajaran

1. Menjelaskan generasi jaringan seluler.
2. Menjelaskan komponen jaringan GSM dan konsep Mobile IP.
3. Mendeteksi jenis koneksi di aplikasi.
4. Merancang aplikasi yang tetap berguna saat offline.

## 1. Generasi jaringan seluler

| Generasi | Ciri utama |
|---|---|
| 2G (GSM) | Suara digital dan SMS, data sangat terbatas |
| 3G (UMTS) | Data seluler dan internet bergerak |
| 4G (LTE) | Data cepat, berbasis IP penuh |
| 5G | Kecepatan lebih tinggi dan latensi rendah |

> **Narasi pengajar:** Ceritakan perjalanannya: 2G membawa suara digital dan SMS, 3G membuka internet bergerak, 4G membuat data cepat, dan 5G menambah kecepatan serta mengurangi jeda. Hubungkan dengan pengalaman peserta: kapan terakhir sinyal mereka turun ke 3G atau E, dan apa yang terjadi pada aplikasi mereka?

## 2. Komponen jaringan GSM

| Komponen | Peran |
|---|---|
| MS (Mobile Station) | Ponsel beserta kartu SIM |
| BTS (Base Transceiver Station) | Menara pemancar yang melayani satu sel |
| BSC (Base Station Controller) | Mengatur beberapa BTS |
| MSC (Mobile Switching Center) | Pusat penyambungan panggilan |
| HLR dan VLR | Basis data pelanggan tetap dan pelanggan yang sedang berkunjung |

> **Narasi pengajar:** Telusuri jalur sebuah panggilan: ponsel berbicara dengan BTS, BTS dikendalikan BSC, BSC tersambung ke MSC yang menyambungkan panggilan, dan HLR serta VLR menyimpan data pelanggan. Gambar rantainya di papan dan minta peserta menyebutkannya berurutan. Ini bahan yang sering muncul pada ujian.

## 3. Handover dan Mobile IP

- **Handover**: sambungan berpindah ke menara lain saat pengguna bergerak.
- **Mobile IP**: perangkat tetap dapat dijangkau dengan alamat yang sama saat berpindah jaringan.
- Peran utama: *home agent* di jaringan asal dan *foreign agent* di jaringan yang dikunjungi.

> **Narasi pengajar:** Saat Anda berjalan atau naik kendaraan, ponsel berpindah dari satu menara ke menara lain tanpa memutus panggilan. Itu handover. Mobile IP menjawab masalah lain: bagaimana perangkat tetap dapat dijangkau dengan alamat yang sama saat berpindah jaringan. Buka simulasi handover dan geser posisi ponsel.

## 4. Mendeteksi jenis koneksi

`labelJaringan` menerjemahkan status mentah menjadi label. Berkas `src/services/networkService.ts`:

```ts
import * as Network from 'expo-network';

export type JenisJaringan = 'Seluler' | 'Wi-Fi' | 'Tidak ada koneksi' | 'Lainnya';

/** Menerjemahkan hasil expo-network menjadi label bahasa Indonesia. */
export function labelJaringan(s: Network.NetworkState): JenisJaringan {
  if (!s.isConnected) return 'Tidak ada koneksi';
  if (s.type === Network.NetworkStateType.CELLULAR) return 'Seluler';
  if (s.type === Network.NetworkStateType.WIFI) return 'Wi-Fi';
  return 'Lainnya';
}

export async function cekJaringan() {
  const state = await Network.getNetworkStateAsync();
  return { label: labelJaringan(state), terhubung: !!state.isConnected };
}
```

> **Narasi pengajar:** Kodenya sederhana, tetapi gunanya besar. Dengan mengetahui jenis koneksi, aplikasi bisa memutuskan: unduh sekarang atau tunggu Wi-Fi. Buka simulasi jaringan dan ganti jenis koneksi untuk melihat label dan pesan berubah.

## 5. Merancang untuk jaringan buruk

- Tampilkan data tersimpan lebih dulu (**offline-first**).
- Pakai **timeout** dan pesan error yang jelas.
- Tunda unduhan besar sampai Wi-Fi bila pengguna memakai data seluler.
- Coba lagi secara bertahap, jangan terus-menerus.

> **Narasi pengajar:** Anggap jaringan buruk sebagai kondisi normal, bukan pengecualian. Tampilkan data tersimpan lebih dulu, beri batas waktu pada permintaan, jelaskan kegagalan dengan bahasa manusia, dan coba lagi secara bertahap. Minta peserta menyebut satu aplikasi yang menanganinya dengan baik dan satu yang buruk.

## Latihan

1. Tampilkan peringatan saat jenis jaringan seluler.
2. Matikan Wi-Fi dan data lalu amati halaman jaringan.
3. Jelaskan urutan komponen GSM dari ponsel sampai tujuan panggilan.

## Peta Kompetensi BNSP

Unit **J.612000.025.01**. Elemen yang dinilai:

- Memahami arsitektur jaringan seluler
- Memahami protokol dan Mobile IP
- Mengakses jaringan dari aplikasi

Bukti pada pelatihan ini: `src/services/networkService.ts`, `app/network.tsx`, perilaku saat offline.

Praktik langkah demi langkah: [hands-on Hari 2, Step 0 dan 1](../hands-on/hari-2.md).
