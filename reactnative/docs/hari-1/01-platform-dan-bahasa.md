# Modul 1: Platform Operating System dan Bahasa Pemrograman

**Durasi:** 09.00 to 10.00

**Unit kompetensi BNSP:** J.612000.001.01

## Pengantar

Kita mulai dari pertanyaan paling dasar: aplikasi di ponsel itu sebenarnya berjalan di atas apa? Dua sistem operasi menguasai pasar, Android dan iOS, dan keduanya punya bahasa, alat, dan aturan sendiri. Di modul ini peserta mengenal perbedaannya, memahami mengapa ada kerangka kerja lintas platform, lalu menjalankan aplikasi pertama di perangkat sendiri. Targetnya sederhana: di akhir modul, semua peserta punya aplikasi yang berjalan dan bisa menjelaskan mengapa teknologi ini dipilih.

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

> **Narasi pengajar:** Mulai dengan bertanya: siapa yang pakai Android, siapa iOS? Jawaban peserta membuka diskusi. Tunjukkan bahwa perbedaan terpenting bagi pengembang ada di tiga hal: bahasa, alat, dan cara distribusi. Satu catatan praktis: Xcode hanya ada di macOS, sehingga membangun aplikasi iOS membutuhkan Mac. Itu salah satu alasan banyak tim memilih kerangka kerja lintas platform.

## 2. Native atau cross-platform

| Pilihan | Kelebihan | Keterbatasan |
|---|---|---|
| Native | Akses penuh, kinerja terbaik | Basis kode terpisah per platform |
| React Native | Satu basis kode JavaScript/TypeScript, komponen tampil native | Fitur khusus butuh modul native |
| Flutter | Satu basis kode Dart, UI digambar sendiri | Bahasa Dart perlu dipelajari |
| PWA | Tanpa toko aplikasi | Akses perangkat terbatas |

> **Narasi pengajar:** Tidak ada pilihan yang selalu benar. Native memberi kendali penuh tetapi berarti menulis dua aplikasi. Lintas platform menghemat waktu dengan satu basis kode. Tanyakan kepada peserta: bila Anda tim kecil dengan tenggat dua bulan, mana yang Anda pilih dan mengapa? Biarkan mereka berargumen sebelum Anda menjelaskan trade-off pada tabel.

## 3. Cara kerja React Native

- Kode ditulis dengan **komponen React** dan bahasa **TypeScript**.
- JavaScript berjalan di mesin JS dalam aplikasi, lalu memerintahkan pembuatan **view native** (Text menjadi teks Android/iOS asli).
- **Expo** menyediakan alat build dan modul siap pakai (SQLite, lokasi, sensor).
- **Expo Go** memungkinkan menjalankan proyek di ponsel dengan memindai kode QR.

> **Narasi pengajar:** Poin utama: React Native tidak menampilkan halaman web. Kode JavaScript berjalan di dalam aplikasi dan memerintahkan pembuatan tampilan asli. Itu sebabnya hasilnya terasa seperti aplikasi biasa. Buka simulasi di slide ini, pilih komponen, lalu ganti platform untuk melihat padanannya di Android dan iOS. Expo adalah lapisan yang membuat proses build dan uji jauh lebih mudah.

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

> **Narasi pengajar:** TypeScript adalah JavaScript dengan tipe. Tunjukkan bahwa menulis tipe Mahasiswa membuat editor langsung memberi tahu bila kita salah mengetik nama properti. Jelaskan tiga hal yang akan sering muncul: type, filter dan map pada array, serta async await untuk pekerjaan yang butuh waktu seperti memanggil server. Peserta tidak perlu hafal, cukup mengenali bentuknya.

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

> **Narasi pengajar:** Komponen adalah fungsi yang mengembalikan tampilan. Props adalah parameternya. Tombol di slide ini menerima label, onPress, dan bahaya, jadi satu komponen dipakai di banyak tempat dengan tampilan berbeda. Buka simulasi useState: tekan setCount lalu tekan plain++ dan perhatikan hanya state yang membuat tampilan berubah. Itulah alasan kita memakai state, bukan variabel biasa.

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
