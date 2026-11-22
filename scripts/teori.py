"""Materi teori dan penjelasan kode untuk slide praktik.

TEORI[(hari, nomor_step)]  -> daftar slide teori: (judul, [butir], potongan_kode atau None)
PENJELASAN[(hari, label)]  -> daftar butir penjelasan untuk satu file kode
"""

TEORI = {
    # ------------------------------------------------------------ HARI 1
    (1, 0): [
        ("Apa yang dipasang dan mengapa", [
            "**Flutter SDK**: kerangka kerja UI, sudah menyertakan bahasa **Dart**.",
            "**Android SDK**: alat resmi untuk membangun dan menjalankan aplikasi Android.",
            "**Emulator atau ponsel**: tempat aplikasi dijalankan saat praktik.",
            "**flutter doctor**: pemeriksa otomatis. Semua centang berarti siap.",
        ], None),
    ],
    (1, 1): [
        ("Struktur proyek Flutter", [
            "`lib/` berisi kode Dart milik kita. Titik masuk ada di `lib/main.dart`.",
            "`pubspec.yaml` mendaftar **dependensi** (paket) dan pengaturan aset.",
            "`android/` dan `ios/` berisi proyek platform native yang dibungkus Flutter.",
            "`test/` berisi pengujian otomatis.",
        ], None),
        ("Paket yang dipakai pada pelatihan", [
            "`go_router`: navigasi antarhalaman berbasis alamat (route).",
            "`sqflite` dan `path`: database SQLite lokal.",
            "`geolocator` dan `flutter_map`: GPS dan peta OpenStreetMap tanpa API key.",
            "`flutter pub get` mengunduh semua paket yang tertulis di `pubspec.yaml`.",
        ], None),
    ],
    (1, 2): [
        ("Titik masuk dan widget", [
            "Semua aplikasi Flutter dimulai dari fungsi `main()` yang memanggil `runApp`.",
            "Tampilan disusun dari **widget**: tombol, teks, tata letak, bahkan aplikasi itu sendiri.",
            "`MaterialApp.router` menjadi akar aplikasi dan menyerahkan navigasi ke `go_router`.",
            "`colorSchemeSeed` membuat seluruh palet warna Material 3 dari satu warna dasar.",
        ], "void main() {\n  runApp(const AssociateMobileApp());\n}"),
    ],
    (1, 3): [
        ("Izin (permission) aplikasi", [
            "Akses sensitif seperti lokasi harus dideklarasikan di platform dan disetujui pengguna.",
            "Android: izin ditulis di `AndroidManifest.xml`. `INTERNET` dipakai untuk peta dan API.",
            "iOS: alasan penggunaan ditulis di `Info.plist` dan ditampilkan pada dialog izin.",
            "Tanpa deklarasi ini, aplikasi akan ditolak sistem saat meminta lokasi.",
        ], None),
    ],
    (1, 4): [
        ("Navigasi dengan go_router", [
            "Setiap halaman punya **path**, misalnya `/catatan` dan `/lokasi`.",
            "`context.go('/catatan')` berpindah halaman, dan tombol kembali tetap berfungsi.",
            "Daftar route dikumpulkan di satu tempat sehingga mudah dipelihara.",
        ], None),
        ("Halaman beranda", [
            "Beranda berisi daftar menu yang mengarah ke fitur lain.",
            "Satu data menu (judul, ikon, path) dipakai berulang oleh `ListView` dan `Card`.",
            "Pola ini menghindari penulisan kode yang sama berkali-kali.",
        ], None),
    ],
    (1, 5): [
        ("Model data", [
            "Model adalah kelas Dart yang mewakili satu baris data, di sini satu **Catatan**.",
            "Properti: id, judul, isi, latitude, longitude, waktu ubah, status sinkron.",
            "`toMap` mengubah objek menjadi pasangan kolom dan nilai untuk SQLite.",
            "`fromMap` membaca satu baris SQLite kembali menjadi objek.",
        ], None),
    ],
    (1, 6): [
        ("SQLite dan data persistence", [
            "**Persistence** berarti data tetap ada setelah aplikasi ditutup.",
            "SQLite adalah database relasional kecil yang tertanam di perangkat.",
            "Tabel `notes` dibuat sekali saat database pertama kali dibuka (`onCreate`).",
            "**Indeks** pada `updated_at` mempercepat pengurutan catatan terbaru.",
        ], "CREATE TABLE notes (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  title TEXT NOT NULL\n);"),
        ("Pola singleton", [
            "Database dibuka satu kali lalu dipakai bersama oleh seluruh aplikasi.",
            "Pola ini mencegah banyak koneksi terbuka sekaligus ke file yang sama.",
            "Semua operasi database bersifat **asynchronous** (`Future`, `await`).",
        ], None),
    ],
    (1, 7): [
        ("Repository dan state", [
            "**Repository** menyembunyikan detail SQL. Halaman cukup memanggil `ambilSemua`, `simpan`, `ubah`, `hapus`.",
            "**Controller** menyimpan daftar catatan dan memberi tahu tampilan saat data berubah.",
            "`ChangeNotifier` memanggil `notifyListeners` sehingga widget yang mendengarkan ikut dibangun ulang.",
            "Pemisahan lapisan: tampilan, state, dan data bisa diuji serta diubah sendiri-sendiri.",
        ], None),
    ],
    (1, 8): [
        ("Daftar, form, dan state", [
            "`ListenableBuilder` membangun ulang daftar setiap kali controller berubah.",
            "`Form` dan `TextFormField` menyediakan validasi input sebelum data disimpan.",
            "`StatefulWidget` dipakai bila halaman punya state sendiri, misalnya teks yang sedang diketik.",
            "Controller teks harus dilepas di `dispose` agar tidak terjadi kebocoran memori.",
        ], None),
    ],
    (1, 9): [
        ("Location based service", [
            "Alurnya: cek layanan lokasi aktif, minta izin, lalu ambil posisi.",
            "`getCurrentPosition` mengambil satu posisi. Stream posisi mengirim pembaruan terus-menerus.",
            "Semua kemungkinan gagal (izin ditolak, GPS mati) dibungkus pesan kesalahan yang jelas.",
        ], None),
        ("Jarak dengan rumus Haversine", [
            "Bumi berbentuk bola, jadi jarak tidak bisa dihitung dengan rumus garis lurus biasa.",
            "Haversine menghitung jarak busur antara dua koordinat dengan jari-jari bumi 6.371.000 m.",
            "Rumus ini murni matematika, sehingga mudah diuji tanpa perangkat.",
        ], "jarakMeter(lat1, lon1, lat2, lon2) // hasil dalam meter"),
    ],
    (1, 10): [
        ("Peta dan geocoding", [
            "`flutter_map` menampilkan ubin peta OpenStreetMap, tanpa API key.",
            "**Marker** menandai koordinat pengguna pada peta.",
            "**Reverse geocoding** mengubah koordinat menjadi alamat, di sini lewat layanan Nominatim.",
            "Atribusi OpenStreetMap wajib ditampilkan sesuai ketentuan penggunaannya.",
        ], None),
    ],
    (1, 11): [
        ("Pengujian otomatis", [
            "Pengujian memastikan fungsi tetap benar setelah kode diubah.",
            "Struktur sebuah tes: siapkan data, jalankan fungsi, bandingkan hasil dengan `expect`.",
            "Tes jarak memakai kasus yang hasilnya dapat diperkirakan: titik yang sama bernilai 0, dan Jakarta ke Bandung sekitar 120 km.",
            "`flutter test` menjalankan semua berkas di folder `test/`.",
        ], None),
    ],
    # ------------------------------------------------------------ HARI 2
    (2, 0): [
        ("Paket tambahan Hari 2", [
            "`connectivity_plus`: jenis koneksi yang sedang aktif.",
            "`sensors_plus`: akselerometer dan sensor gerak.",
            "`device_info_plus`: model dan versi perangkat.",
            "`flutter_secure_storage` dan `http`: penyimpanan aman dan permintaan jaringan.",
        ], None),
    ],
    (2, 1): [
        ("Jaringan seluler", [
            "Ponsel berpindah antarmenara (**handover**) saat bergerak, tanpa memutus sesi.",
            "Generasi jaringan: 2G untuk suara dan SMS, 3G dan 4G untuk data, 5G untuk latensi rendah.",
            "Aplikasi hanya dapat mengetahui **jenis koneksi** (Wi-Fi, seluler, tidak ada), bukan 2G sampai 5G.",
            "Aplikasi harus siap bekerja saat koneksi hilang (offline).",
        ], None),
        ("Memantau koneksi di Flutter", [
            "`checkConnectivity` memeriksa kondisi saat ini sekali.",
            "`onConnectivityChanged` adalah **stream** yang mengirim perubahan koneksi.",
            "Langganan stream harus dibatalkan di `dispose`.",
        ], None),
    ],
    (2, 2): [
        ("Sensor perangkat", [
            "Akselerometer mengukur percepatan pada tiga sumbu: x, y, z, dalam m/s².",
            "Saat diam, total percepatan mendekati gravitasi, sekitar 9,8 m/s².",
            "Data sensor datang sebagai **stream** dengan frekuensi tinggi.",
            "Langganan sensor wajib dihentikan saat halaman ditutup agar baterai tidak terkuras.",
        ], None),
    ],
    (2, 3): [
        ("Spesifikasi teknis perangkat", [
            "Informasi perangkat: merek, model, versi OS, dan arsitektur.",
            "Berguna untuk diagnosis masalah dan penyesuaian fitur per perangkat.",
            "Data ini bersifat sensitif karena dapat dipakai untuk melacak. Kumpulkan seperlunya.",
        ], None),
    ],
    (2, 4): [
        ("Penyimpanan aman", [
            "Data rahasia seperti token tidak boleh disimpan sebagai teks biasa.",
            "`flutter_secure_storage` memakai Keystore di Android dan Keychain di iOS.",
            "Token hanya disimpan, dibaca, dan dihapus lewat satu kelas layanan.",
            "Jangan menulis token ke log atau menampilkannya utuh di layar.",
        ], None),
    ],
    (2, 5): [
        ("Keamanan komunikasi", [
            "**HTTPS** memakai TLS: enkripsi, keaslian server, dan keutuhan data.",
            "Alamat `http://` biasa dapat disadap atau diubah di tengah jalan.",
            "Aplikasi menolak URL non-HTTPS sebelum permintaan dikirim.",
            "Setiap permintaan diberi batas waktu (timeout) agar aplikasi tidak menggantung.",
        ], None),
    ],
    (2, 6): [
        ("Menggabungkan semua fitur", [
            "Route Hari 2 ditambahkan ke router yang sama dengan Hari 1.",
            "Beranda kini memuat semua menu: catatan, lokasi, jaringan, sensor, perangkat, keamanan.",
            "Satu aplikasi utuh dari dua hari pelatihan.",
        ], None),
    ],
    (2, 7): [
        ("Pengujian layanan dan UI", [
            "Layanan jaringan diuji dengan **klien tiruan** (`MockClient`), tanpa internet sungguhan.",
            "Validasi URL diuji dengan masukan benar dan salah.",
            "Tes widget memastikan halaman beranda menampilkan semua menu.",
            "Kunci pengujian yang baik: cepat, mandiri, dan hasilnya dapat diulang.",
        ], None),
    ],
}

PENJELASAN = {
    (1, "pubspec.yaml"): ["Daftar dependensi dan versinya. Dependensi Hari 2 sudah dimasukkan.", "Jalankan `flutter pub get` setiap kali file ini diubah."],
    (1, "analysis_options.yaml"): ["Mengaktifkan aturan lint dari `flutter_lints`.", "`flutter analyze` memakai aturan ini untuk menandai kode yang kurang baik."],
    (1, "lib/main.dart"): ["`main()` adalah titik awal aplikasi.", "`runApp` menaruh widget akar ke layar."],
    (1, "lib/app.dart"): ["`MaterialApp.router` menghubungkan tema dan router.", "`colorSchemeSeed` menghasilkan palet Material 3."],
    (1, "android/app/src/main/AndroidManifest.xml"): ["Tiga izin: internet, lokasi kasar, lokasi akurat.", "Letaknya di dalam `<manifest>`, sebelum `<application>`."],
    (1, "ios/Runner/Info.plist"): ["Kunci `NSLocationWhenInUseUsageDescription` berisi alasan yang dibaca pengguna.", "Hanya perlu bila membangun untuk iOS di Mac."],
    (1, "lib/router/app_router.dart"): ["Satu objek `GoRouter` berisi semua route.", "Tiap `GoRoute` memetakan path ke halaman."],
    (1, "lib/pages/home_page.dart"): ["Daftar menu ditampilkan dengan `ListView` dan `Card`.", "Ketukan pada menu memanggil `context.go(path)`."],
    (1, "lib/models/note.dart"): ["`Note.baru` membuat catatan baru dengan waktu sekarang.", "`toMap` dan `fromMap` menjadi jembatan ke SQLite."],
    (1, "lib/data/app_database.dart"): ["`instance` membuka database sekali dan menggunakannya ulang.", "`_buatTabel` membuat tabel dan indeks saat pertama kali."],
    (1, "lib/data/note_repository.dart"): ["Empat operasi: `ambilSemua`, `simpan`, `ubah`, `hapus`.", "Halaman tidak perlu mengetahui SQL."],
    (1, "lib/blocs/note_controller.dart"): ["`load`, `tambah`, dan `hapus` mengubah daftar lalu memberi tahu tampilan.", "Berbasis `ChangeNotifier` sehingga ringan dan mudah dipahami."],
    (1, "lib/pages/notes_page.dart"): ["Menampilkan daftar catatan beserta jarak dari posisi pengguna.", "Tombol tambah membuka form dan memuat ulang daftar."],
    (1, "lib/pages/note_form_page.dart"): ["Form dengan validasi judul dan isi.", "Tombol lokasi mengisi latitude dan longitude dari GPS."],
    (1, "lib/services/location_service.dart"): ["`pastikanIzin` memeriksa layanan dan izin.", "`ambilPosisi`, `pantauPosisi`, dan `alamatDari` menjadi pintu masuk fitur lokasi."],
    (1, "lib/services/distance.dart"): ["`jarakMeter` menghitung jarak Haversine dalam meter.", "Fungsi murni tanpa ketergantungan perangkat, sehingga mudah diuji."],
    (1, "lib/pages/location_page.dart"): ["Peta OpenStreetMap dengan marker posisi pengguna.", "Alamat didapat dari reverse geocoding lalu ditampilkan di kartu."],
    (1, "test/distance_test.dart"): ["Menguji titik yang sama (nol), Jakarta ke Bandung (sekitar 120 km), dan jarak yang tidak bergantung urutan titik.", "Dijalankan dengan `flutter test`."],
    (2, "pubspec.yaml"): ["Memastikan paket Hari 2 sudah terdaftar.", "Jalankan `flutter pub get` setelah mengubahnya."],
    (2, "android/app/src/main/AndroidManifest.xml"): ["Izin tambahan untuk memeriksa status jaringan.", "Letaknya sejajar dengan izin lokasi dari Hari 1."],
    (2, "lib/services/network_service.dart"): ["`periksa` memeriksa koneksi saat ini.", "`perubahan` adalah stream yang mengabarkan pergantian koneksi.", "`labelJaringan` mengubah hasil menjadi teks yang mudah dibaca."],
    (2, "lib/pages/network_page.dart"): ["Berlangganan stream koneksi di `initState`.", "Langganan dibatalkan di `dispose`."],
    (2, "lib/pages/sensor_page.dart"): ["Membaca akselerometer lewat stream.", "Nilai x, y, z dan total percepatan ditampilkan bersama indikator."],
    (2, "lib/pages/device_page.dart"): ["Mengambil info perangkat Android lewat `device_info_plus`.", "Hasil ditampilkan dalam daftar kunci dan nilai."],
    (2, "lib/services/secure_storage_service.dart"): ["Tiga operasi: `simpanToken`, `ambilToken`, `hapusToken`.", "Data dienkripsi oleh Keystore atau Keychain."],
    (2, "lib/services/https_service.dart"): ["`periksaUrlAman` menolak URL selain HTTPS.", "`ambilJson` memakai timeout dan klien yang dapat diganti saat pengujian."],
    (2, "lib/pages/keamanan_page.dart"): ["Menyimpan, menampilkan samar, dan menghapus token.", "Mengambil data publik lewat HTTPS dan menampilkan hasilnya."],
    (2, "lib/router/app_router.dart"): ["Menambahkan route jaringan, sensor, perangkat, dan keamanan.", "Semua route berada di satu daftar."],
    (2, "lib/pages/home_page.dart"): ["Menu beranda kini memuat semua fitur dua hari.", "Struktur data menu tetap sama dengan Hari 1."],
    (2, "test/network_service_test.dart"): ["Menguji label untuk daftar kosong, tanpa koneksi, Wi-Fi, seluler, dan prioritas Wi-Fi.", "Tidak memerlukan jaringan sungguhan."],
    (2, "test/https_service_test.dart"): ["Menguji validasi URL dan pengambilan data dengan `MockClient`.", "Kasus gagal dan berhasil sama-sama diuji."],
    (2, "test/home_page_test.dart"): ["Tes widget: halaman beranda harus menampilkan semua menu.", "Memakai `pumpWidget` dan `find.text`."],
}
