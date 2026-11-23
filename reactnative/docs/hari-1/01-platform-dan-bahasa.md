# Modul 1: Platform Operating System dan Bahasa Pemrograman

**Durasi:** 09.00 to 10.00

**Unit kompetensi BNSP:** J.612000.001.01

## Tujuan Pembelajaran

1. Menjelaskan perbedaan platform Android dan iOS.
2. Memilih pendekatan native atau cross-platform sesuai kebutuhan.
3. Menulis TypeScript dasar.
4. Membuat dan menjalankan proyek React Native dengan Expo.

## 1. Android dan iOS

| Aspek | Android | iOS |
|---|---|---|
| Pengembang | Google (open source: AOSP) | Apple (tertutup) |
| Bahasa native | Kotlin, Java | Swift, Objective-C |
| Alat resmi | Android Studio | Xcode (hanya di macOS) |
| Distribusi | Google Play, APK | App Store |
| Variasi perangkat | Sangat banyak | Terbatas |

## 2. Native atau cross-platform

| Pilihan | Kelebihan | Keterbatasan |
|---|---|---|
| Native | Akses penuh, kinerja terbaik | Basis kode terpisah per platform |
| React Native | Satu basis kode JavaScript/TypeScript, komponen tampil native | Fitur khusus butuh modul native |
| Flutter | Satu basis kode Dart, UI digambar sendiri | Bahasa Dart perlu dipelajari |
| PWA | Tanpa toko aplikasi | Akses perangkat terbatas |

## 3. Cara kerja React Native

- Kode ditulis dengan **komponen React** dan bahasa **TypeScript**.
- JavaScript berjalan di mesin JS dalam aplikasi, lalu memerintahkan pembuatan **view native** (Text menjadi teks Android/iOS asli).
- **Expo** menyediakan alat build dan modul siap pakai (SQLite, lokasi, sensor).
- **Expo Go** memungkinkan menjalankan proyek di ponsel dengan memindai kode QR.

## 4. TypeScript dasar

```ts
type Mahasiswa = { nama: string; nilai: number };

const daftar: Mahasiswa[] = [
  { nama: 'Ani', nilai: 90 },
  { nama: 'Budi', nilai: 72 },
];

const lulus = daftar.filter((m) => m.nilai >= 75);
console.log(lulus.map((m) => m.nama)); // ['Ani']

async function ambil(url: string): Promise<unknown> {
  const res = await fetch(url);
  return res.json();
}
```

## 5. Komponen pertama

Komponen dengan props `label`, `onPress`, dan `bahaya`. Berkas `src/components/Tombol.tsx`:

```tsx
import { Pressable, Text } from 'react-native';
import { gaya, warna } from '../ui';

type Props = { label: string; onPress: () => void; bahaya?: boolean; testID?: string };

export function Tombol({ label, onPress, bahaya, testID }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={[gaya.tombol, bahaya && { backgroundColor: warna.bahaya }]}
    >
      <Text style={gaya.tombolTeks}>{label}</Text>
    </Pressable>
  );
}
```

## Latihan

1. Pasang Node.js, Expo Go, dan jalankan `npx expo start`.
2. Ubah teks pada `app/index.tsx` dan lihat perubahan langsung (Fast Refresh).
3. Tulis fungsi TypeScript yang menghitung rata-rata nilai dari array.

## Peta Kompetensi BNSP

Unit **J.612000.001.01**. Elemen yang dinilai:

- Mengenali jenis platform OS mobile
- Menentukan platform OS sesuai kebutuhan pengguna
- Menjelaskan bahasa pemrograman mobile

Bukti pada pelatihan ini: tabel platform, `src/models/note.ts`, aplikasi berjalan di Expo Go.

Praktik langkah demi langkah: [hands-on Hari 1, Step 0 sampai 4](../hands-on/hari-1.md).
