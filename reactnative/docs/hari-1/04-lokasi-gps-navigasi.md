# Modul 4: Location Based Service, GPS, dan Navigasi

**Durasi:** 15.00 to 17.00

**Unit kompetensi BNSP:** J.612000.006.01

## Pengantar

Peta dan lokasi adalah fitur yang paling mudah membuat peserta bersemangat, sekaligus yang paling banyak jebakannya: izin, GPS mati, dan akurasi yang berubah-ubah. Kita bahas dari mana lokasi berasal, bagaimana meminta izin dengan sopan, bagaimana menghitung jarak dua titik, dan bagaimana menampilkannya di peta. Tekankan bahwa kode yang baik selalu menangani kasus gagal.

## Tujuan Pembelajaran

1. Menjelaskan cara kerja GPS dan izin lokasi.
2. Mengambil posisi dengan expo-location.
3. Menghitung jarak dengan rumus Haversine.
4. Menampilkan posisi di peta OpenStreetMap.

## 1. Sumber lokasi

| Sumber | Akurasi | Baterai |
|---|---|---|
| GPS (satelit) | Tinggi, terbaik di luar ruangan | Boros |
| Wi-Fi | Sedang, di dalam ruangan | Hemat |
| Menara seluler | Rendah | Hemat |

> **Narasi pengajar:** Lokasi tidak selalu berasal dari satelit. GPS paling akurat di luar ruangan tetapi boros baterai. Di dalam gedung, Wi-Fi dan menara seluler memberi perkiraan kasar. Karena itu hasil lokasi selalu punya angka akurasi, dan aplikasi yang baik menampilkannya.

## 2. Izin lokasi

- Minta izin **saat dibutuhkan**, bukan saat aplikasi dibuka.
- Tangani tiga kasus: izin ditolak, GPS mati, dan berhasil.
- Jelaskan alasan izin dengan bahasa yang mudah dipahami.

> **Narasi pengajar:** Izin adalah percakapan dengan pengguna. Minta saat dibutuhkan, bukan saat aplikasi dibuka, dan jelaskan alasannya. Buka simulasi izin dan coba tiga skenario: diizinkan, ditolak, dan GPS mati. Pastikan peserta melihat bahwa aplikasi tetap menampilkan pesan yang jelas untuk setiap kasus.

## 3. Mengambil posisi

Meminta izin, memeriksa layanan lokasi, lalu membaca posisi. Berkas `src/services/locationService.ts`:

```ts
import * as Location from 'expo-location';

export type Posisi = { latitude: number; longitude: number; akurasi: number | null };

/** Meminta izin saat aplikasi dipakai, lalu membaca posisi sekarang. */
export async function posisiSekarang(): Promise<Posisi> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Izin lokasi ditolak.');
  if (!(await Location.hasServicesEnabledAsync())) throw new Error('Aktifkan GPS terlebih dahulu.');
  const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  return { latitude: p.coords.latitude, longitude: p.coords.longitude, akurasi: p.coords.accuracy };
}

export async function alamatDari(latitude: number, longitude: number): Promise<string> {
  const hasil = await Location.reverseGeocodeAsync({ latitude, longitude });
  const a = hasil[0];
  if (!a) return 'Alamat tidak ditemukan';
  return [a.street, a.district, a.city, a.region].filter(Boolean).join(', ');
}
```

> **Narasi pengajar:** Baca urutannya: minta izin, periksa apakah layanan lokasi menyala, baru ambil posisi. Setiap tahap bisa gagal, dan setiap kegagalan dilempar sebagai pesan yang bisa ditampilkan. Ini contoh bagus bagaimana kode menangani jalur gagal, bukan hanya jalur berhasil.

## 4. Jarak Haversine

Jarak lengkung bumi dalam meter. Fungsi murni, mudah diuji. Berkas `src/services/distance.ts`:

```ts
const JARI_JARI_BUMI_METER = 6371000;
const keRadian = (derajat: number) => (derajat * Math.PI) / 180;

/** Jarak lingkaran besar (Haversine) antara dua koordinat, dalam meter. */
export function jarakMeter(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = keRadian(lat2 - lat1);
  const dLon = keRadian(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(keRadian(lat1)) * Math.cos(keRadian(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * JARI_JARI_BUMI_METER * Math.asin(Math.sqrt(a));
}
```

> **Narasi pengajar:** Bumi bulat, sehingga jarak dua koordinat tidak bisa dihitung dengan garis lurus di peta datar. Rumus Haversine menghitung jarak sepanjang lengkung bumi. Jangan minta peserta menghafal rumusnya. Yang penting: fungsinya murni, mudah diuji, dan hasilnya masuk akal. Buka simulasi, pilih dua kota, dan bandingkan hasilnya dengan perkiraan Anda.

## 5. Peta OpenStreetMap

- **OpenStreetMap** adalah peta terbuka, **Leaflet** pustaka untuk menampilkannya.
- `WebView` memuat HTML peta di dalam aplikasi, sehingga tidak butuh API key.
- Alamat didapat dari **reverse geocoding**: koordinat menjadi nama jalan.
- Navigasi: tampilkan tujuan dan jarak, atau buka aplikasi peta lewat `Linking`.

> **Narasi pengajar:** Peta kita memakai OpenStreetMap dan Leaflet di dalam WebView, jadi tidak memerlukan kunci API berbayar. Peta butuh internet untuk mengunduh ubin gambar, sehingga di ruang tanpa sinyal peta bisa kosong. Sampaikan itu sejak awal agar peserta tidak mengira kodenya salah.

## Latihan

1. Ubah titik acuan pada `app/location.tsx` ke alamat Anda.
2. Tampilkan akurasi posisi dalam meter.
3. Tambahkan tombol yang membuka aplikasi peta dengan `Linking.openURL`.

## Peta Kompetensi BNSP

Unit **J.612000.006.01**. Elemen yang dinilai:

- Menentukan komponen LBS
- Mengimplementasikan GPS dan navigasi
- Menampilkan peta dan posisi pengguna

Bukti pada pelatihan ini: `src/services/locationService.ts`, `src/services/distance.ts`, `app/location.tsx`, peta tampil.

Praktik langkah demi langkah: [hands-on Hari 1, Step 9 dan 10](../hands-on/hari-1.md).
