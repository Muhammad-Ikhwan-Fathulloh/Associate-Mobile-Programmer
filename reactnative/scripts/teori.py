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
        ("Figma, Stitch, dan token desain", [
            "**Stitch** membuat rancangan awal dari prompt. **Figma** merapikannya dengan Auto Layout dan komponen.",
            "**Variable** Figma (warna, spasi, radius, font) adalah **token desain**.",
            "Token dipindah ke `src/theme.ts` dengan nama yang sama. Ubah satu nilai, seluruh aplikasi ikut berubah.",
            "Target sentuh tombol minimal sekitar 48 dp.",
        ], None),
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
            "Hari 2 menambah fitur ke aplikasi yang sama dan menghubungkannya ke server latihan.",
            "Server berjalan di komputer (`npm start`, port 3000). Emulator Android mengaksesnya lewat `10.0.2.2`.",
            "Ponsel fisik memakai IP komputer dan harus satu Wi-Fi dengan komputer.",
        ], None),
    ],
    (2, 1): [
        ("API dan REST", [
            "**API** adalah pintu bagi aplikasi untuk meminta atau mengubah data di server.",
            "**REST**: alamat untuk sumber daya, metode HTTP untuk aksi (GET baca, POST buat, PUT ubah, DELETE hapus), data berbentuk JSON.",
            "Kode status memberi tahu hasil: 200 dan 201 berhasil, 204 berhasil tanpa isi, 400 data salah, 401 belum login, 404 tidak ada.",
            "Ponsel tidak langsung ke MySQL. API yang menjaga akses dan validasi, lalu berbicara ke MySQL.",
        ], None),
    ],
    (2, 2): [
        ("Memanggil API dengan fetch", [
            "`fetch` mengirim permintaan dan mengembalikan respons. Periksa `res.ok` sebelum membaca isi.",
            "Pasang **timeout** dengan `AbortController` agar aplikasi tidak menunggu tanpa batas.",
            "Header `Authorization: Bearer <token>` membawa tanda pengenal setelah login.",
            "Status 204 tidak punya isi, jangan dibaca sebagai JSON.",
        ], None),
    ],
    (2, 3): [
        ("Sensor ponsel", [
            "**Akselerometer** mengukur percepatan sumbu X, Y, Z dalam g. Diam di meja: Z sekitar 1 g.",
            "**Giroskop** mengukur laju putar (rad/s). **Magnetometer** mengukur medan magnet untuk kompas.",
            "Guncangan: besar vektor akselerasi melewati ambang, misalnya 2 g.",
            "Berlangganan dengan `addListener`, hentikan dengan `remove` saat halaman ditutup agar baterai hemat.",
        ], None),
    ],
    (2, 4): [
        ("Informasi perangkat", [
            "Model, versi OS, dan memori membantu menyesuaikan aplikasi dan membaca laporan bug.",
            "Nilai bisa `null` pada emulator, jadi beri nilai cadangan seperti `-`.",
            "Jangan mengumpulkan data perangkat yang tidak diperlukan. Itu soal privasi.",
        ], None),
    ],
    (2, 5): [
        ("Token dan sinkronisasi", [
            "Token hasil login disimpan di **secure store** (Keystore Android, Keychain iOS), bukan di SQLite.",
            "**Offline-first**: simpan ke SQLite dengan status PENDING, kirim saat ada koneksi.",
            "Catatan baru dikirim dengan POST. Catatan yang sudah punya `serverId` dikirim dengan PUT.",
            "Satu kegagalan tidak menghentikan yang lain. Hasil dilaporkan: terkirim, diterima, gagal.",
        ], None),
    ],
    (2, 6): [
        ("Jaringan seluler dan keamanan komunikasi", [
            "Seluler (2G sampai 5G) berbayar dan bisa lambat. Aplikasi perlu tahu jenis koneksi yang aktif.",
            "**HTTPS** mengenkripsi data. HTTP publik ditolak. Alamat lokal hanya untuk pengembangan.",
            "Serangan umum: penyadapan, man-in-the-middle, dan Wi-Fi palsu. Pertahanan: HTTPS, validasi, secure store.",
        ], None),
    ],
    (2, 7): [
        ("Menguji tanpa jaringan", [
            "`fetch` palsu mengembalikan respons buatan sehingga uji cepat dan stabil.",
            "Uji jalur gagal juga: status 401, 400, URL http, dan timeout.",
            "Sinkronisasi diuji dengan basis data tiruan dan klien API palsu.",
        ], None),
    ],
}

PENJELASAN = {
    (1, "src/theme.ts"): ["Token desain: warna, spasi, radius, font, dan tinggi tombol.", "Nilainya berasal dari variable di Figma."],
    (2, "src/config.ts"): ["Alamat server bawaan untuk emulator Android (`10.0.2.2`).", "Ganti dengan IP komputer untuk ponsel fisik."],
    (2, "src/services/apiClient.ts"): ["Satu fungsi per endpoint: login, daftar, buat, ubah.", "Halaman tidak perlu tahu detail URL."],
    (2, "src/services/sensorMath.ts"): ["Fungsi murni: besar vektor, guncangan, arah kompas, mata angin.", "Mudah diuji tanpa perangkat."],
    (2, "src/services/sync.ts"): ["Dua tahap: kirim PENDING, lalu ambil dari server.", "Kegagalan satu catatan tidak menghentikan yang lain."],
    (2, "app/sinkron.tsx"): ["Isi URL server, login, lalu sinkronkan.", "Log menampilkan jumlah terkirim, diterima, dan gagal."],
    (2, "__tests__/api.test.ts"): ["Klien API diuji dengan `fetch` palsu.", "Termasuk header token dan penanganan status error."],
    (2, "__tests__/sync.test.ts"): ["Sinkronisasi diuji dengan basis data tiruan dan API palsu.", "Termasuk kasus sebagian gagal."],
    (2, "__tests__/sensor.test.ts"): ["Uji guncangan, arah kompas, dan mata angin."],
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
