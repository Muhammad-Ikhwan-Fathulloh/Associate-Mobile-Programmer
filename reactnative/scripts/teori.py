"""Materi teori dan penjelasan kode untuk slide praktik React Native.

TEORI[(hari, nomor_step)]  -> daftar slide teori: (judul, [butir], potongan_kode atau None)
PENJELASAN[(hari, label)]  -> daftar butir penjelasan untuk satu file kode
"""

TEORI = {
    # ------------------------------------------------------------ HARI 1
    (1, 0): [
        ("Apa yang dipasang dan mengapa", [
            "**Node.js**: mesin JavaScript untuk menjalankan alat pengembangan. **npm** ikut terpasang.",
            "**Expo**: kerangka kerja di atas React Native yang menyederhanakan build dan uji di ponsel.",
            "**Expo Go**: aplikasi di ponsel untuk membuka proyek lewat kode QR tanpa memasang Android Studio.",
            "**Emulator Android** (opsional): ponsel virtual dari Android Studio.",
        ], None),
    ],
    (1, 1): [
        ("React Native dan Expo", [
            "**React Native** menulis antarmuka dengan komponen React, lalu menampilkannya sebagai widget native.",
            "Bahasanya **TypeScript**: JavaScript dengan tipe data, sehingga banyak kesalahan terlihat sebelum aplikasi jalan.",
            "**Expo** menyediakan modul siap pakai: SQLite, lokasi, sensor, penyimpanan aman.",
            "`npx expo install` memilih versi paket yang cocok dengan versi Expo.",
        ], None),
        ("Struktur proyek", [
            "`app/` berisi halaman. Satu file menjadi satu route (expo-router).",
            "`src/` berisi kode kita: model, data, layanan, komponen.",
            "`package.json` mendaftar dependensi dan skrip. `app.json` mengatur nama, izin, dan plugin.",
            "`__tests__/` berisi pengujian otomatis dengan jest.",
        ], None),
    ],
    (1, 2): [
        ("Konfigurasi aplikasi", [
            "`app.json` memuat nama, ID paket, ikon, dan **izin** yang diminta aplikasi.",
            "Izin Android dideklarasikan sebelum aplikasi dibangun. Pengguna tetap diminta menyetujui saat runtime.",
            "`tsconfig.json` dengan `strict: true` membuat TypeScript memeriksa `null` dan `undefined`.",
        ], None),
    ],
    (1, 3): [
        ("Komponen dan gaya", [
            "**Komponen** adalah fungsi yang mengembalikan tampilan (JSX). Contoh: `Text`, `View`, `Pressable`.",
            "**Props** adalah parameter komponen, misalnya `label` dan `onPress` pada `Tombol`.",
            "`StyleSheet.create` mengumpulkan gaya. Tata letak memakai **flexbox**.",
        ], None),
        ("Navigasi dengan expo-router", [
            "Nama file menentukan alamat: `app/notes.tsx` menjadi `/notes`.",
            "`_layout.tsx` membungkus semua halaman dengan `Stack`, yaitu tumpukan layar dengan tombol kembali.",
            "`router.push('/notes')` berpindah halaman.",
        ], "router.push('/notes');"),
    ],
    (1, 4): [
        ("Daftar menu dengan map", [
            "`MENU.map(...)` mengubah array data menjadi daftar komponen.",
            "Atribut `key` wajib agar React dapat melacak tiap item.",
            "Memisahkan data menu dari tampilan memudahkan penambahan halaman baru.",
        ], None),
    ],
    (1, 5): [
        ("Model dan tipe data", [
            "`type Note` menggambarkan bentuk data. Kompiler menolak kode yang salah bentuk.",
            "`number | null` berarti nilainya angka atau kosong. Lokasi bersifat opsional.",
            "Validasi ditulis sebagai **fungsi murni** (masukan sama, hasil sama) sehingga mudah diuji.",
        ], None),
    ],
    (1, 6): [
        ("SQLite di perangkat", [
            "**SQLite** adalah database relasional kecil yang tersimpan sebagai satu file di ponsel.",
            "Data tetap ada setelah aplikasi ditutup (**persisten**) dan bisa dipakai tanpa internet (**offline-first**).",
            "Skema: `id` kunci utama, `title` dan `content` wajib (`NOT NULL`), `sync_status` menandai data yang belum dikirim ke server.",
            "Indeks pada `updated_at` mempercepat pengurutan.",
        ], "CREATE TABLE notes (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  title TEXT NOT NULL\n);"),
    ],
    (1, 7): [
        ("Pola repository", [
            "**Repository** adalah satu-satunya tempat yang tahu SQL. Halaman hanya memanggil fungsi.",
            "Model berlapis: tampilan, akses data, penyimpanan. Satu lapisan diganti tanpa merusak yang lain.",
            "Tanda tanya `?` adalah **parameter**. Nilai dikirim terpisah dari SQL sehingga aman dari SQL injection.",
        ], "db.runAsync('DELETE FROM notes WHERE id = ?', [id]);"),
    ],
    (1, 8): [
        ("State dan efek", [
            "`useState` menyimpan data yang jika berubah menggambar ulang tampilan.",
            "`useEffect` menjalankan kode saat halaman muncul, misalnya memuat data.",
            "`useFocusEffect` memuat ulang data setiap halaman kembali tampil, sehingga daftar selalu segar.",
            "`FlatList` menampilkan daftar panjang secara efisien.",
        ], "const [judul, setJudul] = useState('');"),
    ],
    (1, 9): [
        ("GPS dan izin lokasi", [
            "Lokasi diambil dari GPS, jaringan seluler, dan Wi-Fi. Akurasi tinggi memakai lebih banyak baterai.",
            "Izin diminta **saat dibutuhkan** (`requestForegroundPermissionsAsync`), bukan saat aplikasi dibuka.",
            "Selalu tangani penolakan izin dan GPS yang mati dengan pesan yang jelas.",
        ], None),
        ("Jarak Haversine", [
            "Bumi bulat, jadi jarak dua koordinat dihitung sepanjang lengkung (lingkaran besar).",
            "Rumus Haversine memakai sinus setengah selisih lintang dan bujur, dengan jari-jari bumi 6.371 km.",
            "Fungsi ini murni, jadi diuji dengan Bandung ke Jakarta (sekitar 116 km).",
        ], None),
    ],
    (1, 10): [
        ("Peta tanpa API key", [
            "**OpenStreetMap** adalah peta terbuka. **Leaflet** adalah pustaka JavaScript untuk menampilkannya.",
            "`WebView` menampilkan halaman web di dalam aplikasi, jadi peta cukup berupa HTML.",
            "HTML dibuat oleh fungsi biasa (`buatHtmlPeta`) sehingga bisa diuji tanpa perangkat.",
            "Peta butuh internet untuk mengunduh ubin gambar.",
        ], None),
    ],
    (1, 11): [
        ("Pengujian otomatis", [
            "**jest** menjalankan pengujian. `describe` mengelompokkan, `it` satu kasus, `expect` memeriksa hasil.",
            "`tsc --noEmit` memeriksa tipe tanpa membuat file.",
            "Uji fungsi murni lebih dulu: jarak, validasi, pembuat HTML.",
        ], "expect(validasiJudul('')).toBe('Judul wajib diisi.');"),
    ],
    # ------------------------------------------------------------ HARI 2
    (2, 0): [
        ("Titik awal Hari 2", [
            "Hari 2 menambah fitur ke aplikasi yang sama. Pastikan pengujian Hari 1 lulus dahulu.",
            "Perubahan kecil dan sering diuji lebih mudah diperbaiki daripada satu perubahan besar.",
        ], None),
    ],
    (2, 1): [
        ("Jaringan seluler", [
            "Ponsel terhubung lewat **seluler** (2G sampai 5G) atau **Wi-Fi**. Aplikasi perlu tahu mana yang aktif.",
            "Data seluler berbayar dan lebih lambat. Unduhan besar sebaiknya menunggu Wi-Fi.",
            "`getNetworkStateAsync` mengembalikan status terhubung dan jenisnya. `labelJaringan` menerjemahkannya.",
            "Aplikasi yang baik tetap berfungsi **offline** dan menyinkronkan saat koneksi kembali.",
        ], None),
    ],
    (2, 2): [
        ("Sensor ponsel", [
            "**Akselerometer** mengukur percepatan pada sumbu X, Y, Z dalam satuan g. Diam di meja: Z sekitar 1 g.",
            "Aplikasi **berlangganan** pembaruan (`addListener`) dengan interval tertentu.",
            "Langganan harus dihentikan (`remove`) saat halaman ditutup agar baterai tidak boros.",
            "Tidak semua perangkat memiliki semua sensor, jadi periksa `isAvailableAsync`.",
        ], None),
    ],
    (2, 3): [
        ("Informasi perangkat", [
            "Model, versi OS, dan memori membantu menyesuaikan aplikasi dan membaca laporan bug.",
            "Nilai bisa `null` pada emulator, jadi beri nilai cadangan seperti `-`.",
            "Jangan mengumpulkan data perangkat yang tidak diperlukan. Itu soal privasi.",
        ], None),
    ],
    (2, 4): [
        ("Penyimpanan aman", [
            "Data biasa di SQLite atau berkas bisa dibaca bila ponsel di-root. Token dan kata sandi butuh perlindungan lebih.",
            "`expo-secure-store` memakai **Keystore** Android dan **Keychain** iOS yang terenkripsi perangkat keras.",
            "Hanya simpan rahasia kecil (token). Jangan simpan data besar di sini.",
        ], None),
    ],
    (2, 5): [
        ("Keamanan komunikasi", [
            "**HTTPS** mengenkripsi data antara aplikasi dan server. Tanpa itu, data bisa disadap di Wi-Fi umum.",
            "Aplikasi menolak alamat `http://` sebelum mengirim permintaan apa pun.",
            "**Timeout** (`AbortController`) mencegah aplikasi menunggu tanpa batas.",
            "Serangan umum: penyadapan (sniffing), man-in-the-middle, dan Wi-Fi palsu.",
        ], None),
    ],
    (2, 6): [
        ("Uji keseluruhan", [
            "Telusuri setiap menu seperti pengguna baru, termasuk saat izin ditolak dan saat offline.",
            "Catat bug dengan langkah, hasil yang diharapkan, dan hasil sebenarnya.",
        ], None),
    ],
    (2, 7): [
        ("Menguji tanpa jaringan", [
            "`fetch` palsu mengembalikan respons buatan sehingga uji cepat dan stabil.",
            "Uji jalur gagal juga: status 500, URL http, dan timeout.",
            "`jest.fn()` mencatat apakah sebuah fungsi dipanggil.",
        ], None),
    ],
}

PENJELASAN = {
    (1, "app.json"): ["Nama, ID paket, dan daftar izin Android.", "Plugin `expo-location` memuat teks izin untuk pengguna."],
    (1, "tsconfig.json"): ["Mewarisi pengaturan dasar Expo.", "`strict: true` mengaktifkan pemeriksaan tipe ketat."],
    (1, "src/ui.ts"): ["`warna` dan `gaya` dipakai ulang oleh semua halaman.", "Satu tempat untuk mengubah tampilan."],
    (1, "src/menu.ts"): ["Data menu: alamat, judul, keterangan.", "`as const` membuat alamat dikenali tipe route."],
    (1, "src/components/Tombol.tsx"): ["Komponen tombol yang dapat dipakai ulang.", "Prop `bahaya` mengubah warna menjadi merah."],
    (1, "app/_layout.tsx"): ["`Stack` membungkus semua halaman.", "`Stack.Screen` mengatur judul tiap halaman."],
    (1, "app/index.tsx"): ["`MENU.map` membuat satu kartu per menu.", "`Link` dengan `asChild` membuat kartu bisa diketuk."],
    (1, "src/models/note.ts"): ["`noteBaru` membuat catatan dengan waktu sekarang dan status PENDING.", "`validasiJudul` mengembalikan pesan error atau `null`."],
    (1, "src/data/database.ts"): ["Koneksi dibuka sekali lalu dipakai ulang.", "`execAsync` membuat tabel dan indeks bila belum ada."],
    (1, "src/data/noteRepository.ts"): ["`semuaCatatan`, `simpanCatatan`, `hapusCatatan`.", "`dariRow` mengubah baris SQL menjadi objek `Note`."],
    (1, "app/notes.tsx"): ["`useFocusEffect` memuat ulang saat halaman tampil.", "Tekan lama memunculkan konfirmasi hapus."],
    (1, "app/note-form.tsx"): ["Mode tambah bila tanpa `id`, mode ubah bila ada `id`.", "Judul divalidasi sebelum disimpan."],
    (1, "src/services/distance.ts"): ["`jarakMeter` menghitung jarak Haversine dalam meter.", "Fungsi murni tanpa ketergantungan perangkat."],
    (1, "src/services/locationService.ts"): ["`posisiSekarang` meminta izin, memeriksa GPS, lalu membaca posisi.", "`alamatDari` mengubah koordinat menjadi alamat."],
    (1, "src/services/petaHtml.ts"): ["Membuat HTML Leaflet dengan koordinat yang diberikan.", "`JSON.stringify` mengamankan teks judul di dalam skrip."],
    (1, "src/components/LeafletMap.tsx"): ["`WebView` menampilkan HTML peta.", "Dipisah dari pembuat HTML agar HTML dapat diuji."],
    (1, "app/location.tsx"): ["Tombol mengambil posisi, alamat, dan jarak ke titik acuan.", "Kesalahan izin ditampilkan sebagai pesan."],
    (1, "__tests__/distance.test.ts"): ["Titik sama, Bandung ke Jakarta, dan simetri.", "`toBeCloseTo` untuk angka desimal."],
    (1, "__tests__/note.test.ts"): ["Judul kosong, terlalu panjang, dan normal.", "Catatan baru berstatus PENDING."],
    (1, "__tests__/map.test.ts"): ["Memeriksa HTML memuat koordinat dan sumber ubin OpenStreetMap."],
    (2, "src/services/networkService.ts"): ["`labelJaringan` menerjemahkan status menjadi label.", "`cekJaringan` mengambil status dari perangkat."],
    (2, "app/network.tsx"): ["Menampilkan jenis jaringan, status, dan alamat IP.", "Tombol memeriksa ulang."],
    (2, "app/sensor.tsx"): ["Berlangganan akselerometer dengan interval 300 ms.", "`remove` pada cleanup menghentikan sensor."],
    (2, "app/device.tsx"): ["Daftar pasangan label dan nilai.", "Nilai kosong diganti tanda hubung."],
    (2, "src/services/secureStorage.ts"): ["Tiga fungsi: simpan, baca, hapus token.", "Kunci disimpan di satu konstanta."],
    (2, "src/services/httpsService.ts"): ["`periksaUrlAman` menolak URL tidak valid dan non-HTTPS.", "`ambilJson` memakai timeout dan memeriksa status 200."],
    (2, "app/keamanan.tsx"): ["Bagian atas: uji HTTPS. Bagian bawah: penyimpanan aman.", "Kolom token memakai `secureTextEntry`."],
    (2, "__tests__/https.test.ts"): ["`fetch` palsu untuk status 200 dan 500.", "Uji tolak http dan uji timeout."],
    (2, "__tests__/network.test.ts"): ["Tiga kasus: seluler, Wi-Fi, terputus."],
}
