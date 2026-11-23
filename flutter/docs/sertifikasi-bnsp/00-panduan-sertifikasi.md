# Panduan Sertifikasi BNSP: Associate Mobile Programmer

Dokumen ini menjelaskan skema sertifikasi, unit kompetensi yang diujikan, cara kerja asesmen kompetensi, dan strategi persiapan. Pelatihan dua hari ini disusun mengikuti tujuh unit kompetensi pada skema tersebut.

## 1. Tentang Skema

| Hal | Keterangan |
|---|---|
| Skema | Associate Mobile Programmer |
| Standar acuan | SKKNI Bidang Mobile Computing, Keputusan Menteri Ketenagakerjaan Nomor 458 Tahun 2015 |
| Jumlah unit | 7 unit kompetensi |
| Penyelenggara uji | Lembaga Sertifikasi Profesi (LSP) berlisensi BNSP |
| Hari uji | Hari 3 (tentatif), setelah pelatihan Hari 1 dan Hari 2 |

Catatan penting: bentuk uji (tulis, praktik, wawancara), durasi, dan jadwal ditetapkan oleh LSP pelaksana. Minta panduan resmi skema, formulir asesmen mandiri (APL-02), dan rincian uji dari panitia atau LSP sebelum Hari 3.

## 2. Tujuh Unit Kompetensi dan Pemetaan ke Modul

| No | Kode unit | Judul unit | Modul pelatihan |
|---|---|---|---|
| 1 | J.612000.001.01 | Menunjukkan Platform Operating System dan Bahasa Pemrograman di dalam Perangkat Lunak | Modul 1 (Hari 1) |
| 2 | J.612000.007.01 | Merancang Mobile Interface | Modul 2 (Hari 1) |
| 3 | J.612000.003.01 | Merancang Database dan Data Persistence pada Mobile Data | Modul 3 (Hari 1) |
| 4 | J.612000.006.01 | Menjelaskan Mobile Location Based Service, GPS dan Mobile Navigation | Modul 4 (Hari 1) |
| 5 | J.612000.025.01 | Menentukan Mobile Seluler Network | Modul 5 (Hari 2) |
| 6 | J.612000.022.01 | Menunjukkan Mobile Sensor dan Spesifikasi Teknis untuk Mobile Computing | Modul 6 (Hari 2) |
| 7 | J.612000.008.01 | Menjelaskan Dasar-Dasar Mobile Communication Security | Modul 7 (Hari 2) |

Modul 8 (Latihan Uji Kompetensi dan Pembahasan) meninjau ketujuh unit.

Rincian elemen kompetensi per unit ada di `01-pemetaan-unit-kompetensi.md`.

## 3. Cara Kerja Asesmen Kompetensi

Alur umum sertifikasi kompetensi BNSP. Urutan dan formulir dapat sedikit berbeda antar LSP.

1. **Pendaftaran dan persyaratan.** Melengkapi data diri dan dokumen yang diminta LSP (umumnya fotokopi KTP dan pas foto, serta bukti pelatihan atau pengalaman).
2. **Asesmen mandiri.** Peserta menilai diri sendiri terhadap setiap elemen dan melampirkan bukti.
3. **Uji kompetensi.** Asesor menilai bukti dari peserta melalui metode yang ditetapkan skema, misalnya tes tertulis, demonstrasi atau praktik, dan wawancara.
4. **Keputusan asesmen.** Hasilnya **Kompeten (K)** atau **Belum Kompeten (BK)** untuk skema. Penilaian bukan peringkat dan bukan nilai angka.
5. **Umpan balik dan banding.** Peserta berhak mendapat umpan balik dan mengajukan banding sesuai prosedur LSP.
6. **Sertifikat.** Peserta yang dinyatakan kompeten menerima sertifikat kompetensi dari LSP.

Prinsip penilaian yang perlu dipahami peserta:

| Prinsip | Arti bagi peserta |
|---|---|
| Valid | Bukti sesuai dengan unit kompetensi yang dinilai |
| Reliabel | Hasil konsisten bila dinilai ulang |
| Fleksibel | Metode dapat disesuaikan, tetapi standarnya tetap |
| Adil | Semua peserta dinilai dengan standar yang sama |
| Terkini, asli, cukup | Bukti baru, hasil karya sendiri, dan memadai |

## 4. Apa yang Dinilai

Asesor mencari bukti bahwa peserta **mampu melakukan** pekerjaan sesuai kriteria unjuk kerja, bukan sekadar menghafal. Pada skema ini, bukti dapat berupa:

| Jenis bukti | Contoh pada pelatihan ini |
|---|---|
| Pengetahuan (tulis atau lisan) | Menjelaskan perbedaan 4G dan 5G, fungsi TLS, perbedaan autentikasi dan otorisasi |
| Keterampilan (praktik) | Menjalankan aplikasi, membuat form validasi, CRUD SQLite, membaca sensor, memanggil API lewat HTTPS |
| Hasil kerja | Proyek `app/` yang berjalan, tes yang lulus |
| Sikap kerja | Mengikuti pedoman kode, menangani error dengan pesan jelas, menjaga keamanan data |

## 5. Strategi Persiapan

### Sebelum Hari 3

1. Selesaikan seluruh praktik Hari 1 dan Hari 2 sampai aplikasi `app/` berjalan di perangkat.
2. Kerjakan bank soal di `03-bank-soal.md` atau deck `slides/latihan-soal-bnsp.html`. Targetnya benar minimal 80 persen pada setiap unit.
3. Untuk setiap unit, latih menjelaskan elemen dengan kata sendiri selama dua menit (simulasi wawancara).
4. Isi tabel rencana belajar mandiri pada Modul 8. Ulang unit yang paling lemah.
5. Siapkan dokumen administrasi dan perangkat uji (lihat daftar periksa).

### Saat Uji

1. Baca soal sampai selesai. Jawab yang paling dikuasai terlebih dahulu.
2. Untuk soal praktik, ikuti kriteria unjuk kerja: apa yang diminta, itu yang dikerjakan lebih dulu.
3. Jelaskan alasan setiap keputusan. Asesor menilai pemahaman, bukan hanya hasil akhir.
4. Bila gagal pada satu unit, peserta umumnya dapat mengulang unit tersebut sesuai ketentuan LSP. Konfirmasikan kebijakan ini kepada LSP.

## 6. Daftar Periksa Kesiapan

### Administrasi

- [ ] Fotokopi KTP dan pas foto sesuai ketentuan LSP
- [ ] Bukti pelatihan (sertifikat atau daftar hadir pelatihan ini)
- [ ] Formulir asesmen mandiri sudah diisi
- [ ] Mengetahui jadwal, lokasi, dan bentuk uji dari panitia

### Teknis

- [ ] Flutter SDK dan Android Studio berfungsi (`flutter doctor` bersih)
- [ ] Proyek `app/` dapat dijalankan dan seluruh tes lulus (`flutter test`)
- [ ] Emulator atau ponsel Android siap
- [ ] Dokumentasi resmi (docs.flutter.dev, dart.dev) dapat dibuka bila diizinkan

### Kompetensi

- [ ] Dapat menjelaskan ketujuh unit dengan kata sendiri
- [ ] Dapat menyebut elemen dan memberi contoh kode untuk setiap unit
- [ ] Skor bank soal minimal 80 persen pada setiap unit
- [ ] Dapat menjalankan tiga tugas praktik Modul 8 tanpa melihat jawaban

## 7. Sumber Resmi

- SKKNI Mobile Computing (Kepmenaker 458 Tahun 2015): https://jdih.kemnaker.go.id/peraturan/detail/1265/keputusan-menteri-ketenagakerjaan-nomor-458-tahun-2015
- Skema Associate Mobile Programmer (contoh LSP): https://lsp-data.com/skema-sertifikasi/associate-mobile-programmer/
- BNSP: https://bnsp.go.id

Daftar unit pada dokumen ini mengikuti skema yang dipublikasikan LSP di atas. Skema LSP pelaksana Anda dapat memiliki rincian berbeda, jadi pastikan dengan dokumen skema dari LSP yang melaksanakan uji.
