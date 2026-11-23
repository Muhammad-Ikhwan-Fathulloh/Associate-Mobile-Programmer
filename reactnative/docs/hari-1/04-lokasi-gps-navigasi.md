# Modul 4: GPS, Peta, dan Menyimpan Lokasi ke SQLite

**Durasi:** 15.00 to 17.00

**Unit kompetensi BNSP:** J.612000.006.01

## Pengantar

Sesi terakhir hari pertama menggabungkan dua hal yang sudah dipelajari: lokasi dan basis data. Peserta mengambil posisi GPS dengan izin yang sopan, menyimpannya sebagai latitude dan longitude di SQLite, lalu menampilkannya lagi dan menghitung jarak. Tekankan kasus gagal: izin ditolak dan GPS mati tidak boleh membuat catatan gagal disimpan.

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

## 4. Menyimpan GPS ke SQLite

Tombol mengisi `lokasi`. Saat disimpan, `latitude` dan `longitude` masuk ke dua kolom tabel `notes`. Tanpa izin, kolom bernilai NULL. Berkas `app/note-form.tsx`:

```tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Tombol } from '../src/components/Tombol';
import { semuaCatatan, simpanCatatan } from '../src/data/noteRepository';
import { formatKoordinat, Note, noteBaru, validasiJudul } from '../src/models/note';
import { posisiSekarang } from '../src/services/locationService';
import { gaya } from '../src/ui';

export default function FormCatatan() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [lama, setLama] = useState<Note | null>(null);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [lokasi, setLokasi] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    semuaCatatan().then((semua) => {
      const n = semua.find((x) => String(x.id) === id);
      if (n) {
        setLama(n);
        setJudul(n.title);
        setIsi(n.content);
        if (n.latitude != null && n.longitude != null) setLokasi({ latitude: n.latitude, longitude: n.longitude });
      }
    });
  }, [id]);

  const ambilLokasi = async () => {
    try {
      setError(null);
      const p = await posisiSekarang();
      setLokasi({ latitude: p.latitude, longitude: p.longitude });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const simpan = async () => {
    const pesan = validasiJudul(judul);
    if (pesan) return setError(pesan);
    const lat = lokasi?.latitude ?? null;
    const lon = lokasi?.longitude ?? null;
    const n = lama
      ? { ...lama, title: judul.trim(), content: isi.trim(), latitude: lat, longitude: lon }
      : noteBaru(judul.trim(), isi.trim(), lat, lon);
    await simpanCatatan(n);
    router.back();
  };

  return (
    <View style={gaya.layar}>
      <TextInput testID="input-judul" style={gaya.input} placeholder="Judul" value={judul} onChangeText={(t) => { setJudul(t); setError(null); }} />
      <TextInput testID="input-isi" style={[gaya.input, { height: 140, textAlignVertical: 'top' }]} placeholder="Isi catatan" multiline value={isi} onChangeText={setIsi} />
      <Tombol label={lokasi ? 'Perbarui lokasi saya' : 'Sertakan lokasi saya (GPS)'} onPress={ambilLokasi} />
      {lokasi && <Text style={gaya.abu}>Lokasi tersimpan bersama catatan: {formatKoordinat(lokasi)}</Text>}
      {error && <Text style={gaya.error}>{error}</Text>}
      <Tombol label="Simpan" onPress={simpan} testID="tombol-simpan" />
    </View>
  );
}
```

> **Narasi pengajar:** Telusuri alurnya di kode: tombol mengisi state lokasi, saat disimpan dua angka masuk ke kolom tabel. Buka simulasi, simpan dengan lokasi, lalu tolak izin dan simpan lagi untuk melihat nilai NULL. Tekankan bahwa kegagalan lokasi tidak boleh menggagalkan penyimpanan catatan.

## 5. Menampilkan koordinat tersimpan

- Koordinat disimpan sebagai angka desimal (`REAL`), bukan teks.
- Fungsi `formatKoordinat` menampilkan `-6.91750, 107.61910` atau teks pengganti bila kosong.
- Jarak antara dua catatan dihitung dengan Haversine dari dua pasang koordinat tersimpan.
- Lokasi adalah **data pribadi**: simpan seperlunya dan jelaskan alasannya.

> **Narasi pengajar:** Koordinat disimpan sebagai angka desimal supaya bisa dihitung, misalnya untuk jarak. Sebut juga sisi privasi: lokasi adalah data pribadi, jadi simpan seperlunya dan jelaskan alasannya kepada pengguna.

## 6. Jarak Haversine

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

## 7. Peta OpenStreetMap

- **OpenStreetMap** adalah peta terbuka, **Leaflet** pustaka untuk menampilkannya.
- `WebView` memuat HTML peta di dalam aplikasi, sehingga tidak butuh API key.
- Alamat didapat dari **reverse geocoding**: koordinat menjadi nama jalan.
- Navigasi: tampilkan tujuan dan jarak, atau buka aplikasi peta lewat `Linking`.

> **Narasi pengajar:** Peta kita memakai OpenStreetMap dan Leaflet di dalam WebView, jadi tidak memerlukan kunci API berbayar. Peta butuh internet untuk mengunduh ubin gambar, sehingga di ruang tanpa sinyal peta bisa kosong. Sampaikan itu sejak awal agar peserta tidak mengira kodenya salah.

## Latihan

1. Buat catatan dengan lokasi, tutup aplikasi, buka lagi, dan pastikan koordinat tetap ada.
2. Tolak izin lokasi dan pastikan catatan tetap tersimpan.
3. Tampilkan jarak catatan ke posisi Anda sekarang.

## Proyek Modul: Peta Tempat Favorit

Aplikasi untuk menyimpan tempat favorit (kafe, masjid, taman). Saat menambah tempat, pengguna dapat menyertakan lokasi GPS. Daftar menampilkan jarak dari posisi sekarang, dan peta menampilkan semua tempat.

Syarat utama:

- Tombol "Sertakan lokasi saya" mengisi `latitude` dan `longitude`, tersimpan di SQLite.
- Izin lokasi diminta saat tombol ditekan, bukan saat aplikasi dibuka.
- Kasus gagal ditangani: izin ditolak, GPS mati, dan waktu habis. Tempat tetap bisa disimpan tanpa koordinat.
- Daftar menampilkan jarak (m atau km) memakai Haversine bagi tempat yang punya koordinat.
- Peta OpenStreetMap menampilkan penanda untuk setiap tempat.

Brief lengkap, kriteria penerimaan, dan rubrik: [shared/docs/proyek](../../../shared/docs/proyek/modul-4-peta-tempat-favorit.md).

## Peta Kompetensi BNSP

Unit **J.612000.006.01**. Elemen yang dinilai:

- Menentukan komponen LBS
- Mengimplementasikan GPS dan navigasi
- Menampilkan peta dan posisi pengguna

Bukti pada pelatihan ini: `src/services/locationService.ts`, `src/services/distance.ts`, `app/location.tsx`, peta tampil.

Praktik langkah demi langkah: [hands-on Hari 1, Step 8 sampai 10](../hands-on/hari-1.md).
