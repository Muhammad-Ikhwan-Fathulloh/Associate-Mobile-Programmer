# Proyek Modul 1: Kartu Kenal Digital

Modul 1: Instalasi Platform, Emulator, dan Environment · Estimasi 30 menit · Unit BNSP J.612000.001.01

by [Muhammad Ikhwan Fathulloh](https://one.nocturnailed.com/)

## Skenario

Buat aplikasi satu layar yang menampilkan kartu kenal Anda: inisial, nama, peran, dan tiga keahlian. Proyek ini memastikan lingkungan kerja, bahasa, dan komponen dasar berjalan.

## Yang harus dibuat

- [ ] Aplikasi berjalan di emulator atau Expo Go (atau `flutter run`).
- [ ] Data profil disimpan dalam satu objek atau kelas bertipe, bukan teks yang tersebar di tampilan.
- [ ] Satu komponen `Kartu` dipakai ulang minimal dua kali (misalnya profil dan keahlian).
- [ ] Fungsi murni `inisial(nama)` yang mengubah "Ani Lestari" menjadi "AL".
- [ ] Tombol yang mengubah satu tampilan (misalnya menampilkan atau menyembunyikan keahlian).

## Kriteria penerimaan

Proyek dianggap selesai bila semua ini dapat didemonstrasikan:

- Aplikasi terbuka tanpa error merah.
- `inisial('Ani Lestari')` menghasilkan `AL`, `inisial('Budi')` menghasilkan `B`, `inisial('')` menghasilkan teks kosong.
- Mengubah nama pada objek profil mengubah tampilan tanpa menyentuh komponen.

## Petunjuk React Native

- Buat proyek dengan `npx create-expo-app@latest`, tulis `type Profil = { nama: string; peran: string; keahlian: string[] }`.
- Komponen di `src/components/Kartu.tsx` dengan props `judul` dan `children`.
- Tes `__tests__/inisial.test.ts` dengan jest.

## Petunjuk Flutter

- Buat kelas `Profil`, widget `Kartu` dengan parameter `judul` dan `child`.
- Fungsi `inisial` di berkas terpisah agar mudah diuji dengan `flutter test`.

## Tantangan tambahan

- Warna kartu berubah mengikuti huruf pertama nama.
- Tambah mode terang dan gelap sederhana.

## Rubrik (100 poin)

| Aspek | Poin |
|---|---|
| Aplikasi berjalan | 30 |
| Data bertipe dan terpisah dari tampilan | 25 |
| Komponen dipakai ulang | 20 |
| Fungsi dan tes `inisial` | 25 |
| **Total** | **100** |

## Hubungan dengan proyek akhir

Hasil proyek ini dapat dipakai sebagai bagian proyek akhir. Lihat [proyek akhir](capstone.md) dan matriks fitur di dalamnya.
