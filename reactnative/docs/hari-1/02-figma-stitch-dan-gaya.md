# Modul 2: Desain dengan Figma dan Stitch, Gaya, dan Implementasi dengan AI

**Durasi:** 10.00 to 12.00

**Unit kompetensi BNSP:** J.612000.007.01

## Pengantar

Sebelum menulis banyak kode, kita memutuskan seperti apa aplikasinya. Dua jam ini memakai alat desain modern: Google Stitch untuk rancangan awal dari prompt, dan Figma untuk merapikannya dengan Auto Layout dan variable. Variable itu menjadi token yang kita pindahkan ke kode, lalu kita minta AI menerapkan gaya baru ke aplikasi. Tekankan dua hal: AI mempercepat, tetapi manusia yang meninjau hasilnya, dan token membuat perubahan gaya cukup di satu tempat.

## Tujuan Pembelajaran

1. Merancang layar di Figma dengan Auto Layout dan variable.
2. Memakai Google Stitch untuk membuat rancangan awal dari prompt.
3. Membandingkan beberapa gaya desain.
4. Mengubah token desain menjadi `src/theme.ts`.
5. Meminta AI menerapkan gaya ke aplikasi dan meninjau hasilnya.

## 1. Alur dari ide ke aplikasi

- Mulai dari kebutuhan pengguna dan daftar layar, bukan dari warna.
- **Google Stitch** membuat rancangan awal dari prompt, lalu diperbaiki lewat chat.
- **Figma** merapikan rancangan: Auto Layout, komponen, dan **variable**. Berkas contoh pelatihan: https://www.figma.com/design/grYqOsULGfzYsDrtIjmjRL
- Variable menjadi **token** di `src/theme.ts`. Komponen kode memakai token, bukan angka langsung.
- AI membantu menerapkan gaya ke kode. Manusia meninjau hasilnya.

> **Narasi pengajar:** Gambarkan jalurnya di papan tulis: kebutuhan, prompt di Stitch, rapikan di Figma, variable menjadi token, token menjadi theme.ts, AI menerapkan, manusia meninjau. Buka simulasi untuk menelusuri enam langkahnya. Tanyakan mana langkah yang paling berisiko jika dilompati, jawabannya hampir selalu peninjauan manusia.

## 2. Google Stitch

- Alat dari Google Labs di `stitch.withgoogle.com`: teks atau gambar menjadi rancangan antarmuka dan kode front-end.
- Perbaiki dengan chat, ubah tema, lalu salin atau ekspor ke Figma sebagai layer yang bisa diedit.
- Hasil Stitch adalah **titik awal**. Rapikan struktur dan token sebelum menjadi kode aplikasi.
- Fitur dan menu berubah cepat. Cek tampilan terbaru sebelum sesi dimulai.

> **Narasi pengajar:** Tunjukkan Stitch secara langsung bila ada akses. Tulis prompt yang menyebut layar, isi, dan gaya, lalu perbaiki lewat chat. Tekankan bahwa hasilnya titik awal. Fitur dan menu Stitch cepat berubah, jadi beri tahu peserta bahwa tampilan mereka mungkin sedikit berbeda.

## 3. Figma untuk pengembang

| Fitur | Fungsi | Padanan di kode |
|---|---|---|
| Auto Layout | Isi menyesuaikan ukuran dan jarak | Flexbox, `flexDirection`, `gap` |
| Component | Elemen yang dipakai ulang | Komponen React, mis. `Tombol` |
| Variable | Warna, spasi, radius, font | `tema` di `src/theme.ts` |
| Dev Mode | Melihat ukuran dan nilai untuk pengembang | Nilai di `StyleSheet` |
| Prototype | Mengklik antar layar | Navigasi `expo-router` |

> **Narasi pengajar:** Hubungkan setiap fitur Figma dengan padanannya di kode, seperti pada tabel. Auto Layout sama dengan flexbox, variable sama dengan token. Buka berkas contoh pelatihan dan tunjukkan panel Variables, lalu ubah satu warna agar peserta melihat semua layar ikut berubah.

## 4. Beberapa gaya desain

| Gaya | Ciri | Cocok untuk |
|---|---|---|
| Material | Bayangan lembut, tombol terisi, ikon jelas | Aplikasi Android umum |
| iOS (HIG) | Sudut membulat, banyak ruang kosong, teks tebal tipis | Aplikasi dengan nuansa iOS |
| Minimal | Sedikit warna, banyak spasi, tanpa dekorasi | Alat kerja dan catatan |
| Gelap | Latar gelap, kontras dijaga | Dipakai malam, hemat baterai layar OLED |

> **Narasi pengajar:** Bandingkan empat gaya lewat simulasi tema: ubah warna dasar dan mode gelap. Tanyakan gaya mana yang cocok untuk aplikasi catatan dan mengapa. Tidak ada jawaban tunggal, tujuannya melatih peserta menjelaskan pilihan desainnya.

## 5. Token menjadi theme.ts

Setiap variable Figma punya padanan di sini. Mengubah satu nilai mengubah seluruh aplikasi. Berkas `src/theme.ts`:

```ts
// Design token: satu sumber nilai gaya. Nilainya berasal dari variables di Figma.
export const tema = {
  warna: {
    utama: '#1565c0',
    latar: '#f5f7fb',
    kartu: '#ffffff',
    teks: '#1b1f27',
    abu: '#5f6b7a',
    garis: '#cfd6e0',
    bahaya: '#c62828',
    ok: '#2e7d32',
  },
  spasi: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  radius: { sm: 8, md: 12, lg: 20 },
  font: { kecil: 13, isi: 15, judul: 18, besar: 24 },
  // Target sentuh minimal yang disarankan pedoman desain: sekitar 48 dp
  tinggiTombol: 48,
} as const;
```

> **Narasi pengajar:** Buka simulasi token: geser warna, radius, spasi, dan font, lalu lihat kode dan tampilan berubah bersamaan. Itulah inti token. Tunjukkan bahwa nama di Figma dan di kode sengaja disamakan agar mudah dilacak.

## 6. Token diterapkan di komponen

Gaya dibuat dari `tema`. Target sentuh tombol 48 dp. Berkas `src/ui.ts`:

```ts
import { StyleSheet } from 'react-native';
import { tema } from './theme';

export const warna = tema.warna;

export const gaya = StyleSheet.create({
  layar: { flex: 1, backgroundColor: tema.warna.latar, padding: tema.spasi.lg },
  kartu: { backgroundColor: tema.warna.kartu, borderRadius: tema.radius.md, padding: 14, marginBottom: tema.spasi.md, elevation: 1 },
  judul: { fontSize: tema.font.judul, fontWeight: '700', color: tema.warna.teks },
  teks: { fontSize: tema.font.isi, color: tema.warna.teks, marginTop: tema.spasi.xs },
  abu: { fontSize: tema.font.kecil, color: tema.warna.abu, marginTop: tema.spasi.xs },
  input: { backgroundColor: tema.warna.kartu, borderWidth: 1, borderColor: tema.warna.garis, borderRadius: tema.radius.sm, padding: 10, marginBottom: 10, fontSize: tema.font.isi },
  tombol: { backgroundColor: tema.warna.utama, borderRadius: tema.radius.sm, minHeight: tema.tinggiTombol, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  tombolTeks: { color: '#fff', fontWeight: '700', fontSize: tema.font.isi },
  error: { color: tema.warna.bahaya, marginBottom: tema.spasi.sm },
});
```

> **Narasi pengajar:** Perhatikan bahwa ui.ts tidak punya angka mentah, semuanya membaca dari tema. Sebut juga tinggi tombol 48 dp sebagai target sentuh yang nyaman. Minta peserta mencari satu angka mentah yang masih tersisa di proyek mereka.

## 7. Prompt AI untuk menerapkan gaya

- Sertakan **konteks**: tumpukan teknologi (Expo, TypeScript), file `src/theme.ts` dan `src/ui.ts`.
- Sertakan **tujuan**: gaya apa, layar mana, dan batasannya (jangan ubah logika).
- Sertakan **bukti desain**: tangkapan layar Figma atau nilai variable.
- Setelah AI mengubah kode: jalankan `npm run typecheck` dan `npm test`, lalu lihat hasilnya di perangkat.
- Jangan menempelkan rahasia (token, kata sandi) ke alat AI.

> **Narasi pengajar:** Bahas empat bahan prompt yang baik: konteks, tujuan, bukti desain, dan batasan. Peringatkan agar tidak menempelkan rahasia ke alat AI. Tekankan bahwa hasil AI harus ditinjau sebagai diff, dijalankan typecheck dan tes, lalu dilihat di perangkat sebelum diterima.

## 8. Navigasi expo-router

Nama file di `app/` menjadi alamat halaman. `Stack` menambahkan tombol kembali. Berkas `app/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#1565c0' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="index" options={{ title: 'Associate Mobile App' }} />
      <Stack.Screen name="notes" options={{ title: 'Catatan' }} />
      <Stack.Screen name="note-form" options={{ title: 'Form Catatan' }} />
      <Stack.Screen name="location" options={{ title: 'Lokasi dan Peta' }} />
      <Stack.Screen name="network" options={{ title: 'Jaringan Seluler' }} />
      <Stack.Screen name="sinkron" options={{ title: 'API dan Sinkronisasi' }} />
      <Stack.Screen name="sensor" options={{ title: 'Sensor' }} />
      <Stack.Screen name="device" options={{ title: 'Info Perangkat' }} />
      <Stack.Screen name="keamanan" options={{ title: 'Keamanan' }} />
    </Stack>
  );
}
```

> **Narasi pengajar:** Aturannya mudah diingat: nama file adalah alamat halaman. Buka simulasi navigasi, ketuk berkas, dan perhatikan tumpukan layar bertambah lalu berkurang saat kembali. Berkas _layout menjadi bingkai yang memberi judul dan tombol kembali pada semua halaman.

## Latihan

1. Buka berkas Figma contoh, ubah `warna/utama`, lalu samakan nilainya di `src/theme.ts`.
2. Buat rancangan layar Catatan di Stitch, ekspor ke Figma, dan rapikan dengan Auto Layout.
3. Minta AI mengubah gaya aplikasi menjadi gelap memakai prompt berkonteks, lalu tinjau perbedaannya.

## Peta Kompetensi BNSP

Unit **J.612000.007.01**. Elemen yang dinilai:

- Menentukan alat perancangan antarmuka
- Memilih informasi yang ditampilkan per layar
- Membuat aksi dan desain estetis per layar

Bukti pada pelatihan ini: berkas Figma (variable dan 5 layar), `src/theme.ts`, `src/ui.ts`, `app/_layout.tsx`, `app/note-form.tsx`.

Praktik langkah demi langkah: [hands-on Hari 1, Step 3 dan 4](../hands-on/hari-1.md).
