# Modul 5: Mobile Cellular Network

**Durasi:** 09.00 to 10.00

**Unit kompetensi BNSP:** J.612000.025.01

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

## 2. Komponen jaringan GSM

| Komponen | Peran |
|---|---|
| MS (Mobile Station) | Ponsel beserta kartu SIM |
| BTS (Base Transceiver Station) | Menara pemancar yang melayani satu sel |
| BSC (Base Station Controller) | Mengatur beberapa BTS |
| MSC (Mobile Switching Center) | Pusat penyambungan panggilan |
| HLR dan VLR | Basis data pelanggan tetap dan pelanggan yang sedang berkunjung |

## 3. Handover dan Mobile IP

- **Handover**: sambungan berpindah ke menara lain saat pengguna bergerak.
- **Mobile IP**: perangkat tetap dapat dijangkau dengan alamat yang sama saat berpindah jaringan.
- Peran utama: *home agent* di jaringan asal dan *foreign agent* di jaringan yang dikunjungi.

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

## 5. Merancang untuk jaringan buruk

- Tampilkan data tersimpan lebih dulu (**offline-first**).
- Pakai **timeout** dan pesan error yang jelas.
- Tunda unduhan besar sampai Wi-Fi bila pengguna memakai data seluler.
- Coba lagi secara bertahap, jangan terus-menerus.

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
