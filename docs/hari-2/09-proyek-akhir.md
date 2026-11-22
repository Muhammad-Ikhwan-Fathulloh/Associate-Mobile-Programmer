# Modul 9: Proyek Akhir

**Durasi:** 16.00 to 17.00

## Tujuan

Peserta membangun satu aplikasi utuh yang mengintegrasikan materi Hari 1 dan Hari 2, lalu mempresentasikannya.

## Ketentuan Umum

- Dikerjakan secara individu atau berpasangan.
- Menggunakan Flutter dan Dart.
- Kode dikelola dengan Git dan diunggah ke repositori GitHub masing-masing peserta.
- Wajib memiliki minimal satu unit test dan satu widget test.

## Pilihan Tema

| Tema | Contoh fitur |
|---|---|
| Catatan lokasi | CRUD catatan, koordinat, peta, jarak dari posisi pengguna |
| Daftar tugas harian | Cubit, filter status, animasi, penyimpanan lokal |
| Pencari berita atau produk | Pengambilan data API, daftar, detail, dan pencarian |
| Pelacak kunjungan | Lokasi, riwayat di SQLite, sinkronisasi ke API |

## Kriteria Penilaian

| Aspek | Bobot | Indikator |
|---|---|---|
| Fungsionalitas | 30% | Fitur utama berjalan sesuai ketentuan |
| Arsitektur | 20% | Pemisahan `data`, `blocs`, `pages`, dan `widgets` |
| Antarmuka | 15% | Konsistensi Material 3, responsif, dan mudah digunakan |
| Penanganan error | 15% | Izin, koneksi, data kosong, dan validasi input |
| Pengujian | 10% | Unit test dan widget test berjalan lulus |
| Presentasi | 10% | Penjelasan alur aplikasi dan keputusan teknis |

## Tahapan

1. Rancang fitur dan gambarkan alur layar (sketsa atau daftar layar).
2. Buat struktur proyek dan konfigurasi dependensi.
3. Implementasikan data lokal atau API.
4. Implementasikan state dengan Cubit dan UI.
5. Tambahkan izin, penanganan error, dan validasi.
6. Tulis pengujian.
7. Siapkan presentasi selama 5 menit dengan demo langsung.

## Format Presentasi

- Demo aplikasi pada perangkat atau emulator (2 menit).
- Penjelasan arsitektur dan keputusan teknis (2 menit).
- Tanya jawab (1 menit).

## Checklist Pengumpulan

- [ ] Aplikasi berjalan tanpa error pada `flutter run`.
- [ ] `flutter analyze` tidak menampilkan error.
- [ ] `flutter test` lulus.
- [ ] README proyek berisi nama, cara menjalankan, dan daftar fitur.
- [ ] Kode diunggah ke repositori GitHub.
