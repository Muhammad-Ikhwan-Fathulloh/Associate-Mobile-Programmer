# Proyek Modul 4: Peta Tempat Favorit

Modul 4: GPS, Peta, dan Menyimpan Lokasi ke SQLite · Estimasi 75 menit · Unit BNSP J.612000.006.01

by [Muhammad Ikhwan Fathulloh](https://one.nocturnailed.com/)

## Skenario

Aplikasi untuk menyimpan tempat favorit (kafe, masjid, taman). Saat menambah tempat, pengguna dapat menyertakan lokasi GPS. Daftar menampilkan jarak dari posisi sekarang, dan peta menampilkan semua tempat.

## Yang harus dibuat

- [ ] Tombol "Sertakan lokasi saya" mengisi `latitude` dan `longitude`, tersimpan di SQLite.
- [ ] Izin lokasi diminta saat tombol ditekan, bukan saat aplikasi dibuka.
- [ ] Kasus gagal ditangani: izin ditolak, GPS mati, dan waktu habis. Tempat tetap bisa disimpan tanpa koordinat.
- [ ] Daftar menampilkan jarak (m atau km) memakai Haversine bagi tempat yang punya koordinat.
- [ ] Peta OpenStreetMap menampilkan penanda untuk setiap tempat.

## Kriteria penerimaan

Proyek dianggap selesai bila semua ini dapat didemonstrasikan:

- Tolak izin lokasi: aplikasi tidak macet dan pesan jelas tampil.
- Jarak Bandung ke Jakarta sekitar 120 km pada tes (toleransi 5 km).
- Tempat tanpa koordinat tidak muncul di peta dan tidak menampilkan jarak.
- Koordinat tersimpan sebagai angka (REAL), bukan teks.

## Petunjuk React Native

- `expo-location`, `src/services/distance.ts`, `LeafletMap` pada `WebView` (tanpa API key).
- Pakai ulang `locationService.ts` dari aplikasi contoh.

## Petunjuk Flutter

- `geolocator` dan `flutter_map`.
- `LocationService` pada `flutter/app/lib/services`.

## Tantangan tambahan

- Urutkan daftar dari yang terdekat.
- Peringatan saat Anda berada kurang dari 200 m dari tempat favorit.

## Rubrik (100 poin)

| Aspek | Poin |
|---|---|
| GPS tersimpan di SQLite | 25 |
| Penanganan izin dan kegagalan | 25 |
| Jarak dan tes | 20 |
| Peta dan penanda | 20 |
| Kerapian kode | 10 |
| **Total** | **100** |

## Hubungan dengan proyek akhir

Hasil proyek ini dapat dipakai sebagai bagian proyek akhir. Lihat [proyek akhir](capstone.md) dan matriks fitur di dalamnya.
