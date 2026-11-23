# Pemetaan Unit Kompetensi ke Materi dan Bukti

Setiap bagian memuat: kode dan judul unit, elemen kompetensi, ringkasan kriteria unjuk kerja, tempat materi dan bukti pada repositori ini, dan pertanyaan latihan wawancara.

Catatan sumber: elemen dan kriteria ditulis ulang secara ringkas dari program pelatihan berbasis kompetensi Kementerian Ketenagakerjaan yang merujuk SKKNI 458 Tahun 2015. Rumusan kata per kata ada di dokumen SKKNI dan skema LSP. Gunakan dokumen LSP sebagai acuan akhir.

---

## Unit 1. J.612000.001.01 Platform Operating System dan Bahasa Pemrograman

Modul: 1 (Hari 1)

| Elemen | Ringkasan kriteria | Materi | Bukti praktik |
|---|---|---|---|
| 1. Mengenali jenis platform OS mobile | Jenis platform dan karakteristiknya dapat disebutkan | `docs/hari-1/01`, Bagian 1 | Tabel perbandingan Android dan iOS |
| 2. Menentukan platform OS sesuai kebutuhan pengguna | Platform dipilih berdasarkan spesifikasi kebutuhan | `02-materi-penunjang.md`, Bagian 1 | Alasan memilih Flutter dan Android |
| 3. Menjelaskan bahasa pemrograman mobile | Bahasa dan framework sesuai platform, mengikuti pedoman kode | `docs/hari-1/01`, Bagian 2 dan 3 | `dasar.dart`, counter, `flutter analyze` bersih |

Latihan wawancara:
1. Sebutkan dua platform OS mobile dan satu perbedaan utamanya.
2. Mengapa tim memilih framework lintas platform untuk proyek tertentu?
3. Apa fungsi `flutter analyze` dan `flutter_lints`?

---

## Unit 2. J.612000.007.01 Merancang Mobile Interface

Modul: 2 (Hari 1)

| Elemen | Ringkasan kriteria | Materi | Bukti praktik |
|---|---|---|---|
| 1. Menentukan alat perancangan antarmuka | Alat dipilih sesuai kebutuhan perancangan | `02-materi-penunjang.md`, Bagian 2 | Sketsa layar sebelum kode |
| 2. Memilih informasi yang ditampilkan per layar | Jumlah layar dan isi tiap layar sesuai kebutuhan | `docs/hari-1/02` | Halaman beranda, daftar, form |
| 3. Membuat aksi dan desain yang estetis per layar | Gaya tampilan nyaman, tombol aksi sesuai kebutuhan | `docs/hari-1/02` | Tema Material 3, form validasi, grid responsif |

Latihan wawancara:
1. Bagaimana Anda menentukan isi setiap layar?
2. Apa fungsi `Form`, `validator`, dan `LayoutBuilder`?
3. Bagaimana menjaga konsistensi tampilan di seluruh aplikasi?

---

## Unit 3. J.612000.003.01 Database dan Data Persistence pada Mobile Data

Modul: 3 (Hari 1)

| Elemen | Ringkasan kriteria | Materi | Bukti praktik |
|---|---|---|---|
| 1. Mendesain internal storage | Aplikasi menyimpan dan membaca data di penyimpanan internal | `02-materi-penunjang.md`, Bagian 3 | `shared_preferences`, berkas lokal |
| 2. Mendesain external storage | Aplikasi memakai penyimpanan eksternal sesuai kasus | `02-materi-penunjang.md`, Bagian 3 | Penjelasan izin dan risiko |
| 3. Mendesain database SQLite | Database dan tabel dirancang sesuai kasus, operasi CRUD berjalan | `docs/hari-1/03` | `app_database.dart`, `note_repository.dart` |
| 4. Mendesain database mobile dengan model berlapis | Layer perantara dibangun, aplikasi terhubung ke database server | `02-materi-penunjang.md`, Bagian 4 | Repository, controller, API publik |

Latihan wawancara:
1. Kapan memakai `shared_preferences` dan kapan SQLite?
2. Mengapa memakai repository di antara halaman dan database?
3. Jelaskan alur offline-first dan sinkronisasi.

---

## Unit 4. J.612000.006.01 Mobile Location Based Service, GPS dan Mobile Navigation

Modul: 4 (Hari 1)

| Elemen | Ringkasan kriteria | Materi | Bukti praktik |
|---|---|---|---|
| 1. Menentukan lokasi dengan perangkat mobile | Lokasi ditentukan dengan benar | `docs/hari-1/04`, `02-materi-penunjang.md` Bagian 5 | Posisi lewat `geolocator` |
| 2. Menentukan lokasi pengguna dengan LBS | Layanan berbasis lokasi dipakai sesuai kebutuhan | `docs/hari-1/04` | Alamat dari reverse geocoding |
| 3. Menentukan lokasi pengguna dengan GPS | Izin, akurasi, dan kegagalan ditangani | `docs/hari-1/04` | Alur izin, `location_service.dart` |
| 4. Menerapkan mobile navigation | Fitur navigasi dibuat sesuai kebutuhan | `docs/hari-1/04` | Peta, marker, jarak Haversine |

Latihan wawancara:
1. Urutan langkah sebelum mengambil posisi pengguna?
2. Apa beda GPS dan lokasi berbasis jaringan?
3. Bagaimana menjaga privasi lokasi pengguna?

---

## Unit 5. J.612000.025.01 Mobile Cellular Network

Modul: 5 (Hari 2)

| Elemen | Ringkasan kriteria | Materi | Bukti praktik |
|---|---|---|---|
| 1. Menjelaskan mobile cellular network | Konsep jaringan seluler dijelaskan lengkap | `docs/hari-2/05` | Penjelasan sel, menara, core |
| 2. Mengidentifikasi protokol dan fitur | Fitur dibedakan per generasi | `docs/hari-2/05`, `02-materi-penunjang.md` Bagian 6 | Tabel 2G sampai 5G |
| 3. Menjelaskan arsitektur GSM | Komponen GSM disebutkan dan dijelaskan | `02-materi-penunjang.md`, Bagian 6 | Diagram MS, BTS, BSC, MSC, HLR, VLR |
| 4. Menjelaskan mobile phone network | Sel, handover, roaming dijelaskan | `docs/hari-2/05` | Slide handover, simulasi |
| 5. Menjelaskan proses pada konsep mobile IP | Proses mobile IP diidentifikasi lengkap | `02-materi-penunjang.md`, Bagian 6 | Penjelasan home agent dan care-of address |

Latihan wawancara:
1. Sebutkan perbedaan fitur 2G, 3G, 4G, 5G.
2. Apa peran HLR dan VLR?
3. Bagaimana mobile IP menjaga koneksi saat perangkat berpindah jaringan?

---

## Unit 6. J.612000.022.01 Mobile Sensor dan Spesifikasi Teknis untuk Mobile Computing

Modul: 6 (Hari 2)

| Elemen | Ringkasan kriteria | Materi | Bukti praktik |
|---|---|---|---|
| 1. Menunjukkan node sensor pada mobile computing | Node sensor diidentifikasi sesuai spesifikasi | `docs/hari-2/06`, `02-materi-penunjang.md` Bagian 7 | Daftar sensor perangkat |
| 2. Menunjukkan desain hardware sensor | Komponen dan alur data sensor dijelaskan | `02-materi-penunjang.md`, Bagian 7 | Diagram alur sensor ke aplikasi |
| 3. Menunjukkan desain protokol | Protokol komunikasi sensor dijelaskan | `02-materi-penunjang.md`, Bagian 7 | Tabel protokol |
| 4. Menunjukkan aspek keamanan pada mobile sensor | Risiko dan izin sensor dijelaskan | `02-materi-penunjang.md`, Bagian 7 | Penjelasan izin dan privasi |

Aplikasi yang memanfaatkan sensor dibuat sesuai kebutuhan: `sensor_page.dart`, `device_page.dart`.

Latihan wawancara:
1. Sebutkan empat sensor ponsel dan fungsinya.
2. Mengapa langganan sensor harus dibatalkan saat halaman ditutup?
3. Data sensor apa yang sensitif bagi privasi?

---

## Unit 7. J.612000.008.01 Dasar-Dasar Mobile Communication Security

Modul: 7 (Hari 2)

| Elemen | Ringkasan kriteria | Materi | Bukti praktik |
|---|---|---|---|
| 1. Menjelaskan dasar keamanan komunikasi mobile | Aspek keamanan dijelaskan sesuai standar | `docs/hari-2/07` | Konsep kerahasiaan, keutuhan, ketersediaan |
| 2. Menjelaskan kerentanan wireless | Kerentanan jaringan nirkabel dijelaskan | `02-materi-penunjang.md`, Bagian 8 | Wi-Fi publik, rogue AP |
| 3. Menjelaskan tipe serangan pada lingkungan mobile | Jenis serangan dijelaskan | `docs/hari-2/07`, `02-materi-penunjang.md` Bagian 8 | Sniffing, MITM, phishing, malware |
| 4. Menjelaskan teknik perlindungan pada sistem mobile | Teknik perlindungan dijelaskan dan diterapkan | `docs/hari-2/07` | `https_service.dart`, `secure_storage_service.dart` |

Latihan wawancara:
1. Apa itu serangan man-in-the-middle dan bagaimana HTTPS mencegahnya?
2. Mengapa token tidak disimpan di `shared_preferences`?
3. Sebutkan tiga praktik keamanan yang Anda terapkan pada aplikasi latihan.
