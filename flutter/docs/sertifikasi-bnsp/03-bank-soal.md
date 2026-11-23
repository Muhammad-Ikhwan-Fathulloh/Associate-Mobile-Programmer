# Bank Soal Latihan Uji Kompetensi

Soal latihan untuk tujuh unit kompetensi skema Associate Mobile Programmer. Setiap unit memuat 6 soal pilihan ganda, 2 soal uraian atau wawancara, dan 1 tugas praktik dengan kriteria penilaian.

Soal ini dibuat untuk latihan, bukan soal resmi LSP. Bentuk dan bobot uji sebenarnya ditetapkan oleh LSP pelaksana.

Cara memakai: kerjakan soal tanpa melihat kunci. Hitung benar per unit. Targetnya minimal 5 dari 6 benar. Unit di bawah target dibaca ulang pada modul terkait. Versi interaktif tersedia di `slides/latihan-soal-bnsp.html`.

## Unit 1. Platform Operating System dan Bahasa Pemrograman

Kode: J.612000.001.01. Modul: 1.

### Pilihan Ganda

1. Bahasa pemrograman yang dipakai framework Flutter adalah
   A. Kotlin
   B. Swift
   C. Dart
   D. Java

2. IDE resmi untuk pengembangan aplikasi iOS native adalah
   A. Android Studio
   B. Xcode
   C. Visual Studio
   D. Eclipse

3. Perintah untuk memeriksa kesiapan lingkungan pengembangan Flutter adalah
   A. flutter doctor
   B. flutter create
   C. flutter build
   D. flutter clean

4. Pernyataan yang benar tentang hot reload adalah
   A. Mengulang aplikasi dari awal
   B. Menerapkan perubahan kode tanpa menghilangkan state
   C. Mengunduh ulang dependensi
   D. Membangun berkas rilis

5. Platform OS mobile sebaiknya dipilih berdasarkan
   A. Selera programmer saja
   B. Kebutuhan pengguna dan spesifikasi kebutuhan aplikasi
   C. Warna logo platform
   D. Jumlah baris kode

6. Keuntungan utama framework lintas platform adalah
   A. Selalu lebih cepat dari native
   B. Satu basis kode untuk beberapa platform
   C. Tidak memerlukan emulator
   D. Tidak perlu pengujian

### Uraian atau Wawancara

1. Jelaskan perbedaan pengembangan native dan lintas platform beserta kelebihan dan keterbatasannya.
2. Mengapa pedoman penulisan kode dan alat analisis seperti `flutter analyze` penting?

### Tugas Praktik

Membuat proyek Flutter baru, menjalankannya di perangkat, lalu mengubah counter sehingga menampilkan teks Genap atau Ganjil.

Kriteria penilaian:

- [ ] Proyek dibuat dan berjalan tanpa error
- [ ] Perubahan diterapkan memakai hot reload
- [ ] Kode lolos `flutter analyze` tanpa peringatan
- [ ] Peserta menjelaskan beda hot reload dan hot restart

## Unit 2. Merancang Mobile Interface

Kode: J.612000.007.01. Modul: 2.

### Pilihan Ganda

1. Widget yang efisien untuk menampilkan daftar yang panjang adalah
   A. Column berisi banyak widget
   B. ListView.builder
   C. Stack
   D. Row

2. Widget yang menyimpan state yang dapat berubah adalah
   A. StatelessWidget
   B. StatefulWidget
   C. Container
   D. Text

3. Fungsi validator pada TextFormField adalah
   A. Mengubah warna teks
   B. Memeriksa masukan sebelum disimpan
   C. Menyimpan data ke database
   D. Membuka halaman baru

4. LayoutBuilder dipakai untuk
   A. Mengunduh gambar
   B. Menyesuaikan tata letak dengan ruang yang tersedia
   C. Membuat animasi
   D. Menyimpan tema

5. Tujuan `colorSchemeSeed` pada Material 3 adalah
   A. Membuat palet warna konsisten dari satu warna dasar
   B. Mengatur ukuran font
   C. Menentukan bahasa aplikasi
   D. Mengunci orientasi layar

6. Langkah yang pertama dilakukan dalam merancang antarmuka adalah
   A. Menulis kode widget
   B. Memahami kebutuhan pengguna dan menentukan isi tiap layar
   C. Memilih ikon
   D. Mengunggah ke toko aplikasi

### Uraian atau Wawancara

1. Jelaskan langkah merancang antarmuka mobile dari kebutuhan hingga implementasi.
2. Bagaimana menjaga konsistensi tampilan di seluruh aplikasi?

### Tugas Praktik

Membuat form catatan dengan validasi judul minimal 3 karakter, tombol simpan yang menampilkan SnackBar, dan tata letak yang berubah kolom pada layar lebar.

Kriteria penilaian:

- [ ] Validasi menolak masukan kosong atau kurang dari 3 karakter
- [ ] Tombol dan teks jelas dan konsisten dengan tema
- [ ] Tata letak responsif berfungsi saat layar diputar
- [ ] Controller dilepas di dispose

## Unit 3. Database dan Data Persistence pada Mobile Data

Kode: J.612000.003.01. Modul: 3.

### Pilihan Ganda

1. Penyimpanan yang tepat untuk token akses adalah
   A. shared_preferences
   B. flutter_secure_storage
   C. Berkas teks biasa
   D. Variabel global

2. Perintah SQL untuk menambah baris data adalah
   A. SELECT
   B. INSERT
   C. DELETE
   D. CREATE

3. Fungsi indeks pada kolom adalah
   A. Mempercepat pencarian dan pengurutan
   B. Memperbesar ukuran data
   C. Mengenkripsi kolom
   D. Menghapus duplikat

4. Database dibuka lewat singleton agar
   A. Ukuran aplikasi mengecil
   B. Hanya ada satu koneksi yang dipakai bersama
   C. Data otomatis terenkripsi
   D. Tabel tidak perlu dibuat

5. Konsep offline-first berarti
   A. Aplikasi hanya jalan saat online
   B. Aplikasi memakai data lokal dan menyinkronkan ke server saat online
   C. Data tidak pernah dikirim ke server
   D. Database lokal dihapus tiap hari

6. Data berupa gambar besar sebaiknya disimpan sebagai
   A. Teks di shared_preferences
   B. Berkas, dengan path-nya disimpan di database
   C. Kolom INTEGER
   D. Variabel di memori

### Uraian atau Wawancara

1. Jelaskan peran setiap lapisan pada model berlapis: tampilan, state, repository, sumber data.
2. Kapan memakai shared_preferences dan kapan memakai SQLite?

### Tugas Praktik

Membuat aplikasi catatan SQLite yang dapat menambah dan menghapus catatan dan membuktikan data tetap ada setelah aplikasi ditutup.

Kriteria penilaian:

- [ ] Tabel dibuat otomatis lewat onCreate
- [ ] Tambah dan hapus berfungsi
- [ ] Data tetap ada setelah aplikasi dibuka ulang
- [ ] Akses database lewat satu lapisan data terpisah

## Unit 4. Mobile Location Based Service, GPS dan Mobile Navigation

Kode: J.612000.006.01. Modul: 4.

### Pilihan Ganda

1. Izin Android untuk lokasi yang presisi adalah
   A. ACCESS_FINE_LOCATION
   B. INTERNET
   C. CAMERA
   D. READ_CONTACTS

2. Urutan yang benar sebelum mengambil posisi adalah
   A. Ambil posisi, lalu minta izin
   B. Periksa layanan lokasi, periksa atau minta izin, lalu ambil posisi
   C. Minta izin kamera, lalu ambil posisi
   D. Langsung tampilkan peta

3. Reverse geocoding adalah
   A. Mengubah alamat menjadi koordinat
   B. Mengubah koordinat menjadi alamat
   C. Menghitung jarak dua titik
   D. Mengunduh ubin peta

4. Rumus Haversine dipakai untuk
   A. Menghitung jarak dua koordinat pada permukaan bumi
   B. Mengenkripsi lokasi
   C. Menentukan zona waktu
   D. Menghitung kecepatan

5. Jika izin lokasi berstatus deniedForever, aplikasi sebaiknya
   A. Terus meminta izin berulang kali
   B. Mengarahkan pengguna ke pengaturan aplikasi
   C. Menutup aplikasi
   D. Mengabaikannya

6. Dibanding sumber lokasi lain, GPS umumnya
   A. Lebih akurat di luar ruangan tetapi lebih boros baterai
   B. Selalu lebih hemat baterai
   C. Hanya bekerja di dalam gedung
   D. Tidak membutuhkan izin

### Uraian atau Wawancara

1. Jelaskan perbedaan GPS, Wi-Fi, dan Cell-ID sebagai sumber lokasi.
2. Bagaimana menjaga privasi lokasi pengguna?

### Tugas Praktik

Membuat halaman yang meminta izin lokasi, menampilkan koordinat pengguna, dan menghitung jarak ke satu titik acuan dengan fungsi Haversine.

Kriteria penilaian:

- [ ] Alur izin lengkap dan penolakan ditangani pesan jelas
- [ ] Koordinat tampil benar
- [ ] Jarak dihitung dan hasilnya wajar
- [ ] Fungsi jarak berada di berkas terpisah dan dapat diuji

## Unit 5. Mobile Cellular Network

Kode: J.612000.025.01. Modul: 5.

### Pilihan Ganda

1. Dibanding 4G, jaringan 5G terutama menawarkan
   A. Latensi lebih rendah dan kapasitas lebih besar
   B. Hanya suara
   C. Kecepatan lebih lambat
   D. Tanpa menara

2. Handover adalah
   A. Pemindahan sesi dari satu menara ke menara lain tanpa memutus koneksi
   B. Penghapusan kartu SIM
   C. Pengisian ulang pulsa
   D. Pengunduhan aplikasi

3. Package Flutter untuk membaca jenis koneksi aktif adalah
   A. sqflite
   B. connectivity_plus
   C. geolocator
   D. http

4. Melalui package tersebut, aplikasi dapat mengetahui
   A. Jenis koneksi saja, bukan generasi 2G sampai 5G
   B. Generasi jaringan secara tepat
   C. Kekuatan sinyal dalam dBm
   D. Nama operator

5. Komponen GSM yang menyimpan data pelanggan tetap di jaringan asal adalah
   A. BTS
   B. HLR
   C. MS
   D. BSC

6. Pada Mobile IP, alamat sementara perangkat di jaringan tamu disebut
   A. Home address
   B. Care-of address
   C. MAC address
   D. Loopback

### Uraian atau Wawancara

1. Sebutkan komponen utama arsitektur GSM dan perannya.
2. Jelaskan proses Mobile IP saat perangkat berpindah ke jaringan lain.

### Tugas Praktik

Membuat halaman yang menampilkan jenis koneksi dan berubah otomatis saat Wi-Fi dimatikan, serta kartu peringatan saat koneksi seluler atau offline.

Kriteria penilaian:

- [ ] Label koneksi benar
- [ ] Perubahan koneksi terpantau lewat stream
- [ ] Langganan stream dibatalkan di dispose
- [ ] Pesan offline dan seluler ditampilkan

## Unit 6. Mobile Sensor dan Spesifikasi Teknis untuk Mobile Computing

Kode: J.612000.022.01. Modul: 6.

### Pilihan Ganda

1. Akselerometer mengukur
   A. Percepatan pada tiga sumbu
   B. Suhu udara
   C. Medan magnet
   D. Kekuatan sinyal

2. Saat ponsel diam di meja, nilai percepatan total mendekati
   A. 0 m/s²
   B. 9,8 m/s²
   C. 98 m/s²
   D. 1 m/s²

3. Sensor yang dipakai untuk kompas adalah
   A. Magnetometer
   B. Barometer
   C. Proximity
   D. Sensor cahaya

4. Langganan sensor dibatalkan di dispose karena
   A. Menghemat baterai dan mencegah kebocoran memori
   B. Mengubah warna layar
   C. Menghapus database
   D. Mengaktifkan GPS

5. Package untuk membaca merek dan model perangkat adalah
   A. device_info_plus
   B. connectivity_plus
   C. path_provider
   D. go_router

6. Urutan alur data sensor yang benar adalah
   A. Aplikasi, driver, sensor
   B. Besaran fisik, sensor, ADC, prosesor, driver OS, aplikasi
   C. Sensor, aplikasi, ADC
   D. ADC, besaran fisik, aplikasi

### Uraian atau Wawancara

1. Sebutkan empat sensor pada ponsel dan contoh penggunaannya.
2. Data sensor apa yang sensitif dan bagaimana melindunginya?

### Tugas Praktik

Membuat halaman yang menampilkan nilai akselerometer secara langsung, menghitung guncangan, dan menampilkan merek, model, serta versi Android perangkat.

Kriteria penilaian:

- [ ] Nilai x, y, z berubah saat perangkat digerakkan
- [ ] Langganan sensor dibatalkan di dispose
- [ ] Penghitung guncangan berfungsi
- [ ] Informasi perangkat tampil benar

## Unit 7. Dasar-Dasar Mobile Communication Security

Kode: J.612000.008.01. Modul: 7.

### Pilihan Ganda

1. Protokol yang mengenkripsi komunikasi antara aplikasi dan server web adalah
   A. HTTP
   B. HTTPS dengan TLS
   C. FTP
   D. SMS

2. Perbedaan autentikasi dan otorisasi adalah
   A. Keduanya sama
   B. Autentikasi memastikan identitas, otorisasi menentukan hak akses
   C. Autentikasi menentukan hak akses, otorisasi memastikan identitas
   D. Autentikasi hanya untuk server

3. Serangan man-in-the-middle adalah
   A. Pihak ketiga menyisipkan diri untuk menyadap atau mengubah komunikasi
   B. Mengirim email massal
   C. Menghapus data lokal
   D. Mematikan server

4. Token login sebaiknya disimpan di
   A. shared_preferences
   B. Secure storage (Keystore atau Keychain)
   C. Berkas teks
   D. Log aplikasi

5. Risiko utama memakai Wi-Fi publik tanpa perlindungan adalah
   A. Sniffing lalu lintas data
   B. Baterai bertambah awet
   C. Layar lebih terang
   D. Penyimpanan penuh

6. Validasi input pada aplikasi membantu mencegah
   A. Injeksi data
   B. Baterai habis
   C. Layar retak
   D. Sinyal lemah

### Uraian atau Wawancara

1. Jelaskan serangan man-in-the-middle dan bagaimana HTTPS membantu mencegahnya.
2. Sebutkan tiga teknik perlindungan yang diterapkan pada aplikasi latihan.

### Tugas Praktik

Membuat layanan yang menolak URL non-HTTPS, menyimpan token di secure storage dengan tampilan tersamar, dan memanggil API publik lewat HTTPS dengan timeout.

Kriteria penilaian:

- [ ] URL http ditolak sebelum permintaan dikirim
- [ ] Token tersimpan di secure storage dan tampil tersamar
- [ ] Permintaan memakai timeout dan kegagalan ditangani
- [ ] Tidak ada rahasia tertulis di log atau kode

---

# Kunci dan Pembahasan

## Unit 1. Platform Operating System dan Bahasa Pemrograman

### Pilihan Ganda

| No | Jawaban | Pembahasan |
|---|---|---|
| 1 | C | Flutter memakai Dart. Kotlin dan Java dipakai pada Android native, Swift pada iOS native. |
| 2 | B | Xcode adalah IDE resmi iOS dan hanya berjalan di macOS. |
| 3 | A | flutter doctor memeriksa SDK, toolchain Android, dan perangkat. |
| 4 | B | Hot reload mempertahankan state. Hot restart yang mengulang dari awal. |
| 5 | B | Elemen kompetensi menuntut pemilihan platform sesuai kebutuhan pengguna. |
| 6 | B | Satu basis kode untuk Android dan iOS mempercepat pengembangan, walau fitur khusus dapat butuh plugin. |

### Poin Jawaban Uraian

1. Native: akses penuh ke fitur platform, kinerja optimal, tetapi satu basis kode per platform. Lintas platform: satu basis kode, pengembangan cepat, tetapi fitur khusus perlu plugin atau kode native.
2. Menjaga konsistensi dan kualitas kode, menangkap kesalahan lebih awal, memudahkan pemeliharaan oleh tim.

## Unit 2. Merancang Mobile Interface

### Pilihan Ganda

| No | Jawaban | Pembahasan |
|---|---|---|
| 1 | B | ListView.builder hanya membangun item yang terlihat sehingga hemat memori. |
| 2 | B | StatefulWidget memiliki State dan dapat dibangun ulang dengan setState. |
| 3 | B | Validator mengembalikan pesan kesalahan bila masukan tidak valid. |
| 4 | B | LayoutBuilder memberi batas ukuran sehingga tata letak dapat responsif. |
| 5 | A | Seluruh skema warna diturunkan dari satu warna dasar. |
| 6 | B | Perancangan dimulai dari kebutuhan pengguna, lalu wireframe, prototipe, dan implementasi. |

### Poin Jawaban Uraian

1. Kebutuhan pengguna, daftar layar dan isi per layar, wireframe, prototipe, implementasi widget, uji kegunaan dan perbaikan.
2. Memakai satu tema (ThemeData), komponen yang dipakai ulang, istilah dan ikon yang sama, serta aturan jarak dan warna.

## Unit 3. Database dan Data Persistence pada Mobile Data

### Pilihan Ganda

| No | Jawaban | Pembahasan |
|---|---|---|
| 1 | B | Token disimpan terenkripsi lewat Keystore atau Keychain. |
| 2 | B | INSERT menambah baris. SELECT membaca, DELETE menghapus, CREATE membuat tabel. |
| 3 | A | Indeks mempercepat kueri pada kolom yang sering dicari atau diurutkan. |
| 4 | B | Satu koneksi mencegah konflik akses ke berkas database yang sama. |
| 5 | B | Data ditulis ke penyimpanan lokal lebih dulu, lalu disinkronkan. |
| 6 | B | Berkas besar disimpan sebagai berkas. Database cukup menyimpan lokasinya. |

### Poin Jawaban Uraian

1. Tampilan menampilkan data dan menerima aksi. State menyimpan data yang tampil dan memberi tahu perubahan. Repository menyembunyikan sumber data. Sumber data berupa SQLite atau API.
2. shared_preferences untuk pengaturan kecil berbentuk key-value, misalnya tema. SQLite untuk data terstruktur yang perlu kueri, indeks, dan relasi.

## Unit 4. Mobile Location Based Service, GPS dan Mobile Navigation

### Pilihan Ganda

| No | Jawaban | Pembahasan |
|---|---|---|
| 1 | A | ACCESS_FINE_LOCATION memberi lokasi presisi. COARSE untuk perkiraan kasar. |
| 2 | B | Layanan lokasi harus aktif dan izin diberikan sebelum posisi diambil. |
| 3 | B | Reverse geocoding: koordinat menjadi alamat. Geocoding: alamat menjadi koordinat. |
| 4 | A | Haversine menghitung jarak busur antara dua titik pada bola. |
| 5 | B | Pengguna harus mengubah izin lewat pengaturan sistem. |
| 6 | A | GPS akurat di ruang terbuka dan lebih boros daya dibanding Cell-ID atau Wi-Fi. |

### Poin Jawaban Uraian

1. GPS memakai sinyal satelit, akurat di luar ruangan, boros baterai. Wi-Fi memakai daftar jaringan sekitar, baik di dalam ruangan. Cell-ID memakai menara terdekat, kasar tetapi hemat baterai.
2. Minta izin seperlunya, jelaskan tujuan, minta saat dibutuhkan, jangan menyimpan atau mengirim lokasi tanpa persetujuan, dan gunakan HTTPS saat mengirim.

## Unit 5. Mobile Cellular Network

### Pilihan Ganda

| No | Jawaban | Pembahasan |
|---|---|---|
| 1 | A | 5G: kecepatan tinggi, latensi sangat rendah, kapasitas perangkat besar. |
| 2 | A | Handover menjaga sesi saat pengguna berpindah sel. |
| 3 | B | connectivity_plus memberi jenis koneksi: Wi-Fi, seluler, atau tidak ada. |
| 4 | A | Paket ini hanya melaporkan jenis koneksi. |
| 5 | B | HLR menyimpan data pelanggan tetap. VLR menyimpan data sementara pelanggan tamu. |
| 6 | B | Care-of address adalah alamat sementara. Home address adalah alamat tetap. |

### Poin Jawaban Uraian

1. MS (perangkat dan SIM), BTS (menara radio), BSC (mengatur banyak BTS), MSC (penyambungan panggilan), HLR (data pelanggan tetap), VLR (data pelanggan tamu), AuC (kunci autentikasi), EIR (identitas perangkat).
2. Penemuan agen, registrasi care-of address ke Home Agent, tunneling paket dari Home Agent ke care-of address, lalu penerimaan oleh perangkat atau Foreign Agent.

## Unit 6. Mobile Sensor dan Spesifikasi Teknis untuk Mobile Computing

### Pilihan Ganda

| No | Jawaban | Pembahasan |
|---|---|---|
| 1 | A | Akselerometer mengukur percepatan pada sumbu x, y, z. |
| 2 | B | Gravitasi bumi sekitar 9,8 m/s². |
| 3 | A | Magnetometer mengukur medan magnet bumi. |
| 4 | A | Stream yang tidak dibatalkan terus bekerja dan memboroskan sumber daya. |
| 5 | A | device_info_plus menyediakan informasi perangkat. |
| 6 | B | Besaran fisik diubah sensor, didigitalkan ADC, diproses, lalu diteruskan lewat driver ke aplikasi. |

### Poin Jawaban Uraian

1. Akselerometer (deteksi goyangan), giroskop (rotasi permainan), magnetometer (kompas), proximity (layar mati saat menelepon), sensor cahaya (kecerahan otomatis).
2. Mikrofon, kamera, dan lokasi sensitif bagi privasi. Lindungi dengan izin eksplisit, tujuan jelas, pemakaian seperlunya, dan enkripsi saat dikirim.

## Unit 7. Dasar-Dasar Mobile Communication Security

### Pilihan Ganda

| No | Jawaban | Pembahasan |
|---|---|---|
| 1 | B | HTTPS memakai TLS untuk enkripsi, keaslian server, dan keutuhan data. |
| 2 | B | Autentikasi: siapa Anda. Otorisasi: apa yang boleh Anda lakukan. |
| 3 | A | Penyerang berada di tengah jalur komunikasi dua pihak. |
| 4 | B | Secure storage terenkripsi. shared_preferences menyimpan teks biasa. |
| 5 | A | Lalu lintas tak terenkripsi mudah disadap. |
| 6 | A | Masukan yang tidak divalidasi dapat berisi perintah atau data berbahaya. |

### Poin Jawaban Uraian

1. Penyerang berada di antara klien dan server untuk menyadap atau mengubah data. TLS mengenkripsi data dan memverifikasi identitas server lewat sertifikat sehingga penyerang sulit membaca atau memalsukan.
2. Validasi URL agar hanya HTTPS, penyimpanan token di secure storage, timeout pada permintaan, tidak menampilkan token utuh, dan izin minimal.
