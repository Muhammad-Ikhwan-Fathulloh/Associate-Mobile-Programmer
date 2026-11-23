"""Bank soal latihan uji kompetensi per unit. Format PG: (soal, [4 opsi], indeks_jawaban, pembahasan)."""

UNITS = [
    dict(
        no=1, kode="J.612000.001.01", judul="Platform Operating System dan Bahasa Pemrograman", modul=1,
        pg=[
            ("Bahasa pemrograman yang dipakai framework Flutter adalah", ["Kotlin", "Swift", "Dart", "Java"], 2, "Flutter memakai Dart. Kotlin dan Java dipakai pada Android native, Swift pada iOS native."),
            ("IDE resmi untuk pengembangan aplikasi iOS native adalah", ["Android Studio", "Xcode", "Visual Studio", "Eclipse"], 1, "Xcode adalah IDE resmi iOS dan hanya berjalan di macOS."),
            ("Perintah untuk memeriksa kesiapan lingkungan pengembangan Flutter adalah", ["flutter doctor", "flutter create", "flutter build", "flutter clean"], 0, "flutter doctor memeriksa SDK, toolchain Android, dan perangkat."),
            ("Pernyataan yang benar tentang hot reload adalah", ["Mengulang aplikasi dari awal", "Menerapkan perubahan kode tanpa menghilangkan state", "Mengunduh ulang dependensi", "Membangun berkas rilis"], 1, "Hot reload mempertahankan state. Hot restart yang mengulang dari awal."),
            ("Platform OS mobile sebaiknya dipilih berdasarkan", ["Selera programmer saja", "Kebutuhan pengguna dan spesifikasi kebutuhan aplikasi", "Warna logo platform", "Jumlah baris kode"], 1, "Elemen kompetensi menuntut pemilihan platform sesuai kebutuhan pengguna."),
            ("Keuntungan utama framework lintas platform adalah", ["Selalu lebih cepat dari native", "Satu basis kode untuk beberapa platform", "Tidak memerlukan emulator", "Tidak perlu pengujian"], 1, "Satu basis kode untuk Android dan iOS mempercepat pengembangan, walau fitur khusus dapat butuh plugin."),
        ],
        esai=[
            ("Jelaskan perbedaan pengembangan native dan lintas platform beserta kelebihan dan keterbatasannya.", "Native: akses penuh ke fitur platform, kinerja optimal, tetapi satu basis kode per platform. Lintas platform: satu basis kode, pengembangan cepat, tetapi fitur khusus perlu plugin atau kode native."),
            ("Mengapa pedoman penulisan kode dan alat analisis seperti `flutter analyze` penting?", "Menjaga konsistensi dan kualitas kode, menangkap kesalahan lebih awal, memudahkan pemeliharaan oleh tim."),
        ],
        praktik=("Membuat proyek Flutter baru, menjalankannya di perangkat, lalu mengubah counter sehingga menampilkan teks Genap atau Ganjil.",
                 ["Proyek dibuat dan berjalan tanpa error", "Perubahan diterapkan memakai hot reload", "Kode lolos `flutter analyze` tanpa peringatan", "Peserta menjelaskan beda hot reload dan hot restart"]),
    ),
    dict(
        no=2, kode="J.612000.007.01", judul="Merancang Mobile Interface", modul=2,
        pg=[
            ("Widget yang efisien untuk menampilkan daftar yang panjang adalah", ["Column berisi banyak widget", "ListView.builder", "Stack", "Row"], 1, "ListView.builder hanya membangun item yang terlihat sehingga hemat memori."),
            ("Widget yang menyimpan state yang dapat berubah adalah", ["StatelessWidget", "StatefulWidget", "Container", "Text"], 1, "StatefulWidget memiliki State dan dapat dibangun ulang dengan setState."),
            ("Fungsi validator pada TextFormField adalah", ["Mengubah warna teks", "Memeriksa masukan sebelum disimpan", "Menyimpan data ke database", "Membuka halaman baru"], 1, "Validator mengembalikan pesan kesalahan bila masukan tidak valid."),
            ("LayoutBuilder dipakai untuk", ["Mengunduh gambar", "Menyesuaikan tata letak dengan ruang yang tersedia", "Membuat animasi", "Menyimpan tema"], 1, "LayoutBuilder memberi batas ukuran sehingga tata letak dapat responsif."),
            ("Tujuan `colorSchemeSeed` pada Material 3 adalah", ["Membuat palet warna konsisten dari satu warna dasar", "Mengatur ukuran font", "Menentukan bahasa aplikasi", "Mengunci orientasi layar"], 0, "Seluruh skema warna diturunkan dari satu warna dasar."),
            ("Langkah yang pertama dilakukan dalam merancang antarmuka adalah", ["Menulis kode widget", "Memahami kebutuhan pengguna dan menentukan isi tiap layar", "Memilih ikon", "Mengunggah ke toko aplikasi"], 1, "Perancangan dimulai dari kebutuhan pengguna, lalu wireframe, prototipe, dan implementasi."),
        ],
        esai=[
            ("Jelaskan langkah merancang antarmuka mobile dari kebutuhan hingga implementasi.", "Kebutuhan pengguna, daftar layar dan isi per layar, wireframe, prototipe, implementasi widget, uji kegunaan dan perbaikan."),
            ("Bagaimana menjaga konsistensi tampilan di seluruh aplikasi?", "Memakai satu tema (ThemeData), komponen yang dipakai ulang, istilah dan ikon yang sama, serta aturan jarak dan warna."),
        ],
        praktik=("Membuat form catatan dengan validasi judul minimal 3 karakter, tombol simpan yang menampilkan SnackBar, dan tata letak yang berubah kolom pada layar lebar.",
                 ["Validasi menolak masukan kosong atau kurang dari 3 karakter", "Tombol dan teks jelas dan konsisten dengan tema", "Tata letak responsif berfungsi saat layar diputar", "Controller dilepas di dispose"]),
    ),
    dict(
        no=3, kode="J.612000.003.01", judul="Database dan Data Persistence pada Mobile Data", modul=3,
        pg=[
            ("Penyimpanan yang tepat untuk token akses adalah", ["shared_preferences", "flutter_secure_storage", "Berkas teks biasa", "Variabel global"], 1, "Token disimpan terenkripsi lewat Keystore atau Keychain."),
            ("Perintah SQL untuk menambah baris data adalah", ["SELECT", "INSERT", "DELETE", "CREATE"], 1, "INSERT menambah baris. SELECT membaca, DELETE menghapus, CREATE membuat tabel."),
            ("Fungsi indeks pada kolom adalah", ["Mempercepat pencarian dan pengurutan", "Memperbesar ukuran data", "Mengenkripsi kolom", "Menghapus duplikat"], 0, "Indeks mempercepat kueri pada kolom yang sering dicari atau diurutkan."),
            ("Database dibuka lewat singleton agar", ["Ukuran aplikasi mengecil", "Hanya ada satu koneksi yang dipakai bersama", "Data otomatis terenkripsi", "Tabel tidak perlu dibuat"], 1, "Satu koneksi mencegah konflik akses ke berkas database yang sama."),
            ("Konsep offline-first berarti", ["Aplikasi hanya jalan saat online", "Aplikasi memakai data lokal dan menyinkronkan ke server saat online", "Data tidak pernah dikirim ke server", "Database lokal dihapus tiap hari"], 1, "Data ditulis ke penyimpanan lokal lebih dulu, lalu disinkronkan."),
            ("Data berupa gambar besar sebaiknya disimpan sebagai", ["Teks di shared_preferences", "Berkas, dengan path-nya disimpan di database", "Kolom INTEGER", "Variabel di memori"], 1, "Berkas besar disimpan sebagai berkas. Database cukup menyimpan lokasinya."),
        ],
        esai=[
            ("Jelaskan peran setiap lapisan pada model berlapis: tampilan, state, repository, sumber data.", "Tampilan menampilkan data dan menerima aksi. State menyimpan data yang tampil dan memberi tahu perubahan. Repository menyembunyikan sumber data. Sumber data berupa SQLite atau API."),
            ("Kapan memakai shared_preferences dan kapan memakai SQLite?", "shared_preferences untuk pengaturan kecil berbentuk key-value, misalnya tema. SQLite untuk data terstruktur yang perlu kueri, indeks, dan relasi."),
        ],
        praktik=("Membuat aplikasi catatan SQLite yang dapat menambah dan menghapus catatan dan membuktikan data tetap ada setelah aplikasi ditutup.",
                 ["Tabel dibuat otomatis lewat onCreate", "Tambah dan hapus berfungsi", "Data tetap ada setelah aplikasi dibuka ulang", "Akses database lewat satu lapisan data terpisah"]),
    ),
    dict(
        no=4, kode="J.612000.006.01", judul="Mobile Location Based Service, GPS dan Mobile Navigation", modul=4,
        pg=[
            ("Izin Android untuk lokasi yang presisi adalah", ["ACCESS_FINE_LOCATION", "INTERNET", "CAMERA", "READ_CONTACTS"], 0, "ACCESS_FINE_LOCATION memberi lokasi presisi. COARSE untuk perkiraan kasar."),
            ("Urutan yang benar sebelum mengambil posisi adalah", ["Ambil posisi, lalu minta izin", "Periksa layanan lokasi, periksa atau minta izin, lalu ambil posisi", "Minta izin kamera, lalu ambil posisi", "Langsung tampilkan peta"], 1, "Layanan lokasi harus aktif dan izin diberikan sebelum posisi diambil."),
            ("Reverse geocoding adalah", ["Mengubah alamat menjadi koordinat", "Mengubah koordinat menjadi alamat", "Menghitung jarak dua titik", "Mengunduh ubin peta"], 1, "Reverse geocoding: koordinat menjadi alamat. Geocoding: alamat menjadi koordinat."),
            ("Rumus Haversine dipakai untuk", ["Menghitung jarak dua koordinat pada permukaan bumi", "Mengenkripsi lokasi", "Menentukan zona waktu", "Menghitung kecepatan"], 0, "Haversine menghitung jarak busur antara dua titik pada bola."),
            ("Jika izin lokasi berstatus deniedForever, aplikasi sebaiknya", ["Terus meminta izin berulang kali", "Mengarahkan pengguna ke pengaturan aplikasi", "Menutup aplikasi", "Mengabaikannya"], 1, "Pengguna harus mengubah izin lewat pengaturan sistem."),
            ("Dibanding sumber lokasi lain, GPS umumnya", ["Lebih akurat di luar ruangan tetapi lebih boros baterai", "Selalu lebih hemat baterai", "Hanya bekerja di dalam gedung", "Tidak membutuhkan izin"], 0, "GPS akurat di ruang terbuka dan lebih boros daya dibanding Cell-ID atau Wi-Fi."),
        ],
        esai=[
            ("Jelaskan perbedaan GPS, Wi-Fi, dan Cell-ID sebagai sumber lokasi.", "GPS memakai sinyal satelit, akurat di luar ruangan, boros baterai. Wi-Fi memakai daftar jaringan sekitar, baik di dalam ruangan. Cell-ID memakai menara terdekat, kasar tetapi hemat baterai."),
            ("Bagaimana menjaga privasi lokasi pengguna?", "Minta izin seperlunya, jelaskan tujuan, minta saat dibutuhkan, jangan menyimpan atau mengirim lokasi tanpa persetujuan, dan gunakan HTTPS saat mengirim."),
        ],
        praktik=("Membuat halaman yang meminta izin lokasi, menampilkan koordinat pengguna, dan menghitung jarak ke satu titik acuan dengan fungsi Haversine.",
                 ["Alur izin lengkap dan penolakan ditangani pesan jelas", "Koordinat tampil benar", "Jarak dihitung dan hasilnya wajar", "Fungsi jarak berada di berkas terpisah dan dapat diuji"]),
    ),
    dict(
        no=5, kode="J.612000.025.01", judul="Mobile Cellular Network", modul=5,
        pg=[
            ("Dibanding 4G, jaringan 5G terutama menawarkan", ["Latensi lebih rendah dan kapasitas lebih besar", "Hanya suara", "Kecepatan lebih lambat", "Tanpa menara"], 0, "5G: kecepatan tinggi, latensi sangat rendah, kapasitas perangkat besar."),
            ("Handover adalah", ["Pemindahan sesi dari satu menara ke menara lain tanpa memutus koneksi", "Penghapusan kartu SIM", "Pengisian ulang pulsa", "Pengunduhan aplikasi"], 0, "Handover menjaga sesi saat pengguna berpindah sel."),
            ("Package Flutter untuk membaca jenis koneksi aktif adalah", ["sqflite", "connectivity_plus", "geolocator", "http"], 1, "connectivity_plus memberi jenis koneksi: Wi-Fi, seluler, atau tidak ada."),
            ("Melalui package tersebut, aplikasi dapat mengetahui", ["Jenis koneksi saja, bukan generasi 2G sampai 5G", "Generasi jaringan secara tepat", "Kekuatan sinyal dalam dBm", "Nama operator"], 0, "Paket ini hanya melaporkan jenis koneksi."),
            ("Komponen GSM yang menyimpan data pelanggan tetap di jaringan asal adalah", ["BTS", "HLR", "MS", "BSC"], 1, "HLR menyimpan data pelanggan tetap. VLR menyimpan data sementara pelanggan tamu."),
            ("Pada Mobile IP, alamat sementara perangkat di jaringan tamu disebut", ["Home address", "Care-of address", "MAC address", "Loopback"], 1, "Care-of address adalah alamat sementara. Home address adalah alamat tetap."),
        ],
        esai=[
            ("Sebutkan komponen utama arsitektur GSM dan perannya.", "MS (perangkat dan SIM), BTS (menara radio), BSC (mengatur banyak BTS), MSC (penyambungan panggilan), HLR (data pelanggan tetap), VLR (data pelanggan tamu), AuC (kunci autentikasi), EIR (identitas perangkat)."),
            ("Jelaskan proses Mobile IP saat perangkat berpindah ke jaringan lain.", "Penemuan agen, registrasi care-of address ke Home Agent, tunneling paket dari Home Agent ke care-of address, lalu penerimaan oleh perangkat atau Foreign Agent."),
        ],
        praktik=("Membuat halaman yang menampilkan jenis koneksi dan berubah otomatis saat Wi-Fi dimatikan, serta kartu peringatan saat koneksi seluler atau offline.",
                 ["Label koneksi benar", "Perubahan koneksi terpantau lewat stream", "Langganan stream dibatalkan di dispose", "Pesan offline dan seluler ditampilkan"]),
    ),
    dict(
        no=6, kode="J.612000.022.01", judul="Mobile Sensor dan Spesifikasi Teknis untuk Mobile Computing", modul=6,
        pg=[
            ("Akselerometer mengukur", ["Percepatan pada tiga sumbu", "Suhu udara", "Medan magnet", "Kekuatan sinyal"], 0, "Akselerometer mengukur percepatan pada sumbu x, y, z."),
            ("Saat ponsel diam di meja, nilai percepatan total mendekati", ["0 m/s²", "9,8 m/s²", "98 m/s²", "1 m/s²"], 1, "Gravitasi bumi sekitar 9,8 m/s²."),
            ("Sensor yang dipakai untuk kompas adalah", ["Magnetometer", "Barometer", "Proximity", "Sensor cahaya"], 0, "Magnetometer mengukur medan magnet bumi."),
            ("Langganan sensor dibatalkan di dispose karena", ["Menghemat baterai dan mencegah kebocoran memori", "Mengubah warna layar", "Menghapus database", "Mengaktifkan GPS"], 0, "Stream yang tidak dibatalkan terus bekerja dan memboroskan sumber daya."),
            ("Package untuk membaca merek dan model perangkat adalah", ["device_info_plus", "connectivity_plus", "path_provider", "go_router"], 0, "device_info_plus menyediakan informasi perangkat."),
            ("Urutan alur data sensor yang benar adalah", ["Aplikasi, driver, sensor", "Besaran fisik, sensor, ADC, prosesor, driver OS, aplikasi", "Sensor, aplikasi, ADC", "ADC, besaran fisik, aplikasi"], 1, "Besaran fisik diubah sensor, didigitalkan ADC, diproses, lalu diteruskan lewat driver ke aplikasi."),
        ],
        esai=[
            ("Sebutkan empat sensor pada ponsel dan contoh penggunaannya.", "Akselerometer (deteksi goyangan), giroskop (rotasi permainan), magnetometer (kompas), proximity (layar mati saat menelepon), sensor cahaya (kecerahan otomatis)."),
            ("Data sensor apa yang sensitif dan bagaimana melindunginya?", "Mikrofon, kamera, dan lokasi sensitif bagi privasi. Lindungi dengan izin eksplisit, tujuan jelas, pemakaian seperlunya, dan enkripsi saat dikirim."),
        ],
        praktik=("Membuat halaman yang menampilkan nilai akselerometer secara langsung, menghitung guncangan, dan menampilkan merek, model, serta versi Android perangkat.",
                 ["Nilai x, y, z berubah saat perangkat digerakkan", "Langganan sensor dibatalkan di dispose", "Penghitung guncangan berfungsi", "Informasi perangkat tampil benar"]),
    ),
    dict(
        no=7, kode="J.612000.008.01", judul="Dasar-Dasar Mobile Communication Security", modul=7,
        pg=[
            ("Protokol yang mengenkripsi komunikasi antara aplikasi dan server web adalah", ["HTTP", "HTTPS dengan TLS", "FTP", "SMS"], 1, "HTTPS memakai TLS untuk enkripsi, keaslian server, dan keutuhan data."),
            ("Perbedaan autentikasi dan otorisasi adalah", ["Keduanya sama", "Autentikasi memastikan identitas, otorisasi menentukan hak akses", "Autentikasi menentukan hak akses, otorisasi memastikan identitas", "Autentikasi hanya untuk server"], 1, "Autentikasi: siapa Anda. Otorisasi: apa yang boleh Anda lakukan."),
            ("Serangan man-in-the-middle adalah", ["Pihak ketiga menyisipkan diri untuk menyadap atau mengubah komunikasi", "Mengirim email massal", "Menghapus data lokal", "Mematikan server"], 0, "Penyerang berada di tengah jalur komunikasi dua pihak."),
            ("Token login sebaiknya disimpan di", ["shared_preferences", "Secure storage (Keystore atau Keychain)", "Berkas teks", "Log aplikasi"], 1, "Secure storage terenkripsi. shared_preferences menyimpan teks biasa."),
            ("Risiko utama memakai Wi-Fi publik tanpa perlindungan adalah", ["Sniffing lalu lintas data", "Baterai bertambah awet", "Layar lebih terang", "Penyimpanan penuh"], 0, "Lalu lintas tak terenkripsi mudah disadap."),
            ("Validasi input pada aplikasi membantu mencegah", ["Injeksi data", "Baterai habis", "Layar retak", "Sinyal lemah"], 0, "Masukan yang tidak divalidasi dapat berisi perintah atau data berbahaya."),
        ],
        esai=[
            ("Jelaskan serangan man-in-the-middle dan bagaimana HTTPS membantu mencegahnya.", "Penyerang berada di antara klien dan server untuk menyadap atau mengubah data. TLS mengenkripsi data dan memverifikasi identitas server lewat sertifikat sehingga penyerang sulit membaca atau memalsukan."),
            ("Sebutkan tiga teknik perlindungan yang diterapkan pada aplikasi latihan.", "Validasi URL agar hanya HTTPS, penyimpanan token di secure storage, timeout pada permintaan, tidak menampilkan token utuh, dan izin minimal."),
        ],
        praktik=("Membuat layanan yang menolak URL non-HTTPS, menyimpan token di secure storage dengan tampilan tersamar, dan memanggil API publik lewat HTTPS dengan timeout.",
                 ["URL http ditolak sebelum permintaan dikirim", "Token tersimpan di secure storage dan tampil tersamar", "Permintaan memakai timeout dan kegagalan ditangani", "Tidak ada rahasia tertulis di log atau kode"]),
    ),
]
