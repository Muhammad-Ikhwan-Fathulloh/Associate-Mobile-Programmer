# Proyek Akhir: Aplikasi Buatan Anda

by [Muhammad Ikhwan Fathulloh](https://one.nocturnailed.com/)

## Skenario

Bangun satu aplikasi utuh yang menggabungkan seluruh materi: desain, SQLite, GPS, API, sensor, dan keamanan. Mulailah dari proyek dasar (`capstone-base`) lalu ubah menjadi aplikasi dengan tema pilihan Anda.

## Pilih satu tema

| Tema | Gambaran |
|---|---|
| Jurnal Perjalanan | Catatan perjalanan dengan foto lokasi, peta jejak, dan kategori. Sensor: kompas arah tujuan. |
| Pelacak Kebiasaan Berlokasi | Kebiasaan yang dicatat di tempat tertentu (gym, perpustakaan). Sensor: guncang untuk catat cepat. |
| Laporan Warga | Laporan masalah (jalan rusak, lampu mati) dengan lokasi dan kategori, dikirim ke server. Sensor: guncang untuk laporan darurat. |
| Daftar Belanja Dekat Toko | Daftar belanja yang mengingatkan saat dekat toko favorit. Sensor: kompas menuju toko. |
| Pelacak Olahraga | Catat sesi lari atau jalan, jarak dari titik GPS, dan hitung langkah kasar dari akselerometer. |
| Katalog UMKM Sekitar | Daftar usaha kecil di sekitar dengan jarak dan peta. Data dari server latihan. |

Anda boleh membuat tema sendiri selama memenuhi matriks fitur.

## Proyek dasar (base)

- React Native: `reactnative/capstone-base` (lihat `README.md` di dalamnya).
- Flutter: `flutter/capstone-base` (kode Dart belum dikompilasi, jalankan `flutter analyze` lebih dulu).

Proyek dasar sudah berisi struktur berlapis, tema, SQLite, GPS, klien API, sinkronisasi, dan sensor. Ubah `proyek.config` untuk identitas aplikasi Anda, lalu kerjakan slot bertanda `TODO(peserta)`.

## Matriks fitur wajib

| Modul | Topik | Yang harus ada |
|---|---|---|
| 1 | Platform dan bahasa | Aplikasi berjalan di emulator atau perangkat, kode bertipe, komponen dipakai ulang. |
| 2 | Desain | Rancangan di Figma atau Stitch (minimal 3 layar), variable menjadi token di berkas tema, tanpa angka mentah. |
| 3 | SQLite | Minimal satu tabel dengan CRUD lengkap, repository terpisah, data bertahan, satu migrasi. |
| 4 | GPS | Koordinat tersimpan di SQLite, izin dan kegagalan ditangani, jarak atau peta ditampilkan. |
| 5 dan 7 | API dan sinkronisasi | Login, kirim dan ambil data, status PENDING dan SYNCED, token di penyimpanan aman, HTTP publik ditolak. |
| 6 | Sensor | Minimal satu sensor dipakai dengan makna (bukan sekadar menampilkan angka), langganan dihentikan. |
| 8 | Kualitas | Minimal 8 tes lulus, analisis bersih, README, dan demo lima menit. |

## Syarat tambahan

- [ ] Nama aplikasi dan identitas visual (token) milik Anda, bukan bawaan.
- [ ] Minimal tiga layar yang dirancang di Figma atau Stitch.
- [ ] Satu fitur kreatif yang tidak ada di materi (lihat tantangan di `capstone-base/README.md`).
- [ ] Jalankan seluruh matriks fitur di atas.

## Tahapan kerja

| Tahap | Kegiatan |
|---|---|
| Tahap 1 | Pilih tema, gambar rancangan 3 layar, ubah `proyek.config` dan token. |
| Tahap 2 | Sesuaikan model dan tabel, buat layar utama dan form dengan GPS. |
| Tahap 3 | Hubungkan ke server latihan dan lengkapi sinkronisasi. |
| Tahap 4 | Tambahkan sensor dan fitur kreatif. |
| Tahap 5 | Tes, README, tangkapan layar, dan latihan demo. |

## Rubrik (100 poin)

| Aspek | Poin |
|---|---|
| Matriks fitur terpenuhi (7 baris) | 35 |
| Desain dan konsistensi token | 15 |
| Kualitas kode dan struktur berlapis | 15 |
| Tes, analisis, dan README | 15 |
| Fitur kreatif | 10 |
| Demo lima menit | 10 |
| **Total** | **100** |

## Yang dikumpulkan

- Folder proyek (tanpa `node_modules`).
- `README.md` berisi cara menjalankan, fitur, dan tangkapan layar.
- Tabel bukti kompetensi (tujuh unit).
- Demo lima menit.

## Daftar proyek modul

- Modul 1: [Kartu Kenal Digital](modul-1-kartu-kenal-digital.md)
- Modul 2: [Redesain Dua Layar dengan Token](modul-2-redesain-dua-layar-dengan-token.md)
- Modul 3: [Pelacak Kebiasaan dengan SQLite](modul-3-pelacak-kebiasaan-dengan-sqlite.md)
- Modul 4: [Peta Tempat Favorit](modul-4-peta-tempat-favorit.md)
- Modul 5: [Klien API Catatan](modul-5-klien-api-catatan.md)
- Modul 6: [Penghitung Guncangan dan Kompas](modul-6-penghitung-guncangan-dan-kompas.md)
- Modul 7: [Sinkronisasi Offline-First](modul-7-sinkronisasi-offline-first.md)
- Modul 8: [Paket Bukti Kompetensi](modul-8-paket-bukti-kompetensi.md)
