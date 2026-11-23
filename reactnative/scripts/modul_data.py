"""Data 8 modul React Native. Dipakai untuk membuat docs/hari-N/*.md dan slides/hari-N-modul-*.html."""

# Item konsep: ("judul", "bullets", [butir]) | ("judul", "table", (header, baris)) | ("judul", "code", (berkas_app, keterangan))
# Item kode memakai file asli di app/ agar selalu sama dengan proyek yang diuji.

MODUL = [
    dict(
        n=1, hari=1, waktu="09.00 to 10.00", slug="01-platform-dan-bahasa",
        judul="Platform Operating System dan Bahasa Pemrograman", pendek="Platform dan Bahasa",
        unit="J.612000.001.01",
        tujuan=["Menjelaskan perbedaan platform Android dan iOS", "Memilih pendekatan native atau cross-platform sesuai kebutuhan", "Menulis TypeScript dasar", "Membuat dan menjalankan proyek React Native dengan Expo"],
        elemen=["Mengenali jenis platform OS mobile", "Menentukan platform OS sesuai kebutuhan pengguna", "Menjelaskan bahasa pemrograman mobile"],
        bukti="tabel platform, `src/models/note.ts`, aplikasi berjalan di Expo Go",
        konsep=[
            ("Android dan iOS", "table", (["Aspek", "Android", "iOS"], [
                ["Pengembang", "Google (open source: AOSP)", "Apple (tertutup)"],
                ["Bahasa native", "Kotlin, Java", "Swift, Objective-C"],
                ["Alat resmi", "Android Studio", "Xcode (hanya di macOS)"],
                ["Distribusi", "Google Play, APK", "App Store"],
                ["Variasi perangkat", "Sangat banyak", "Terbatas"]])),
            ("Native atau cross-platform", "table", (["Pilihan", "Kelebihan", "Keterbatasan"], [
                ["Native", "Akses penuh, kinerja terbaik", "Basis kode terpisah per platform"],
                ["React Native", "Satu basis kode JavaScript/TypeScript, komponen tampil native", "Fitur khusus butuh modul native"],
                ["Flutter", "Satu basis kode Dart, UI digambar sendiri", "Bahasa Dart perlu dipelajari"],
                ["PWA", "Tanpa toko aplikasi", "Akses perangkat terbatas"]])),
            ("Cara kerja React Native", "bullets", [
                "Kode ditulis dengan **komponen React** dan bahasa **TypeScript**.",
                "JavaScript berjalan di mesin JS dalam aplikasi, lalu memerintahkan pembuatan **view native** (Text menjadi teks Android/iOS asli).",
                "**Expo** menyediakan alat build dan modul siap pakai (SQLite, lokasi, sensor).",
                "**Expo Go** memungkinkan menjalankan proyek di ponsel dengan memindai kode QR."]),
            ("TypeScript dasar", "snippet", ("ts", """type Mahasiswa = { nama: string; nilai: number };

const daftar: Mahasiswa[] = [
  { nama: 'Ani', nilai: 90 },
  { nama: 'Budi', nilai: 72 },
];

const lulus = daftar.filter((m) => m.nilai >= 75);
console.log(lulus.map((m) => m.nama)); // ['Ani']

async function ambil(url: string): Promise<unknown> {
  const res = await fetch(url);
  return res.json();
}""")),
            ("Komponen pertama", "code", ("src/components/Tombol.tsx", "Komponen dengan props `label`, `onPress`, dan `bahaya`.")),
        ],
        praktik="Hari 1, Step 0 sampai 4",
        tugas=["Pasang Node.js, Expo Go, dan jalankan `npx expo start`.", "Ubah teks pada `app/index.tsx` dan lihat perubahan langsung (Fast Refresh).", "Tulis fungsi TypeScript yang menghitung rata-rata nilai dari array."],
    ),
    dict(
        n=2, hari=1, waktu="10.00 to 12.00", slug="02-mobile-interface",
        judul="Merancang Mobile Interface", pendek="Mobile Interface", unit="J.612000.007.01",
        tujuan=["Menyusun layar dari komponen dasar", "Menata tampilan dengan flexbox dan StyleSheet", "Membuat navigasi antarhalaman dengan expo-router", "Membuat form dengan validasi"],
        elemen=["Menentukan alat perancangan antarmuka", "Memilih informasi yang ditampilkan per layar", "Membuat aksi dan desain estetis per layar"],
        bukti="`app/index.tsx`, `app/note-form.tsx`, `src/ui.ts`, navigasi `app/_layout.tsx`",
        konsep=[
            ("Langkah merancang antarmuka", "bullets", [
                "Kenali kebutuhan pengguna dan tugas utamanya.",
                "Daftar layar dan isi tiap layar, lalu buat **wireframe** (kertas atau Figma).",
                "Buat prototipe yang dapat diklik, uji ke pengguna, lalu implementasikan.",
                "Satu layar, satu tujuan utama. Aksi utama harus paling menonjol."]),
            ("Komponen dasar", "table", (["Komponen", "Fungsi"], [
                ["`View`", "Wadah tata letak (seperti div)"], ["`Text`", "Menampilkan teks"], ["`Pressable`", "Area yang dapat diketuk"],
                ["`TextInput`", "Kolom isian"], ["`FlatList`", "Daftar panjang yang efisien"], ["`ScrollView`", "Konten yang bisa digulir"]])),
            ("Flexbox dan gaya", "bullets", [
                "`flex: 1` membuat elemen mengisi ruang yang tersedia.",
                "`flexDirection` (default `column`) mengatur arah susunan anak.",
                "`padding` di dalam, `margin` di luar. Satuan dalam dp (tanpa tulisan px).",
                "`StyleSheet.create` mengumpulkan gaya di satu tempat."]),
            ("Navigasi expo-router", "code", ("app/_layout.tsx", "Nama file di `app/` menjadi alamat halaman. `Stack` menambahkan tombol kembali.")),
            ("Form dan validasi", "code", ("app/note-form.tsx", "State `judul`, `isi`, `error`. Validasi dilakukan sebelum menyimpan.", "const simpan")),
        ],
        praktik="Hari 1, Step 3, 4, dan 8",
        tugas=["Tambahkan menu baru pada `src/menu.ts` yang menuju halaman kosong.", "Ubah warna utama pada `src/ui.ts` dan amati semua halaman.", "Tambahkan batas 500 karakter pada isi catatan beserta pesan error."],
    ),
    dict(
        n=3, hari=1, waktu="13.00 to 15.00", slug="03-database-persistence",
        judul="Database dan Data Persistence", pendek="Database", unit="J.612000.003.01",
        tujuan=["Memilih metode penyimpanan lokal yang sesuai", "Merancang tabel untuk aplikasi mobile", "Mengimplementasikan CRUD dengan expo-sqlite", "Memahami offline-first dan sinkronisasi"],
        elemen=["Mendesain internal storage", "Mendesain external storage", "Mendesain database SQLite", "Mendesain database mobile dengan model berlapis"],
        bukti="`src/data/database.ts`, `src/data/noteRepository.ts`, data bertahan setelah aplikasi ditutup",
        konsep=[
            ("Pilihan penyimpanan lokal", "table", (["Metode", "Modul", "Contoh penggunaan"], [
                ["Key-value", "`@react-native-async-storage/async-storage`", "Tema, status onboarding"],
                ["Penyimpanan aman", "`expo-secure-store`", "Token akses"],
                ["SQLite", "`expo-sqlite`", "Data terstruktur dengan relasi dan kueri"],
                ["Berkas", "`expo-file-system`", "Gambar, cache, dokumen"]])),
            ("Rancangan tabel notes", "snippet", ("sql", """CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  updated_at INTEGER NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'PENDING'
);""")),
            ("Membuka database", "code", ("src/data/database.ts", "Koneksi dibuka sekali. Tabel dibuat bila belum ada.")),
            ("Repository dan CRUD", "code", ("src/data/noteRepository.ts", "Tiga fungsi: baca semua, simpan (tambah atau ubah), hapus. Parameter memakai tanda tanya.", "export async function simpanCatatan")),
            ("Model berlapis dan sinkronisasi", "bullets", [
                "**Lapisan**: tampilan (halaman) memanggil repository, repository memanggil SQLite.",
                "**Offline-first**: simpan ke SQLite dahulu, kirim ke server saat ada koneksi.",
                "Kolom `sync_status` menandai data **PENDING** (belum dikirim) atau **SYNCED**.",
                "Konflik sinkronisasi biasanya diselesaikan dengan `updated_at` terbaru."]),
        ],
        praktik="Hari 1, Step 5 sampai 8",
        tugas=["Tambahkan kolom `kategori` dan pikirkan cara memigrasikan data lama.", "Tambahkan pencarian judul dengan `LIKE`.", "Uji: tambah catatan, tutup aplikasi, buka kembali."],
    ),
    dict(
        n=4, hari=1, waktu="15.00 to 17.00", slug="04-lokasi-gps-navigasi",
        judul="Location Based Service, GPS, dan Navigasi", pendek="Lokasi dan GPS", unit="J.612000.006.01",
        tujuan=["Menjelaskan cara kerja GPS dan izin lokasi", "Mengambil posisi dengan expo-location", "Menghitung jarak dengan rumus Haversine", "Menampilkan posisi di peta OpenStreetMap"],
        elemen=["Menentukan komponen LBS", "Mengimplementasikan GPS dan navigasi", "Menampilkan peta dan posisi pengguna"],
        bukti="`src/services/locationService.ts`, `src/services/distance.ts`, `app/location.tsx`, peta tampil",
        konsep=[
            ("Sumber lokasi", "table", (["Sumber", "Akurasi", "Baterai"], [
                ["GPS (satelit)", "Tinggi, terbaik di luar ruangan", "Boros"],
                ["Wi-Fi", "Sedang, di dalam ruangan", "Hemat"],
                ["Menara seluler", "Rendah", "Hemat"]])),
            ("Izin lokasi", "bullets", [
                "Minta izin **saat dibutuhkan**, bukan saat aplikasi dibuka.",
                "Tangani tiga kasus: izin ditolak, GPS mati, dan berhasil.",
                "Jelaskan alasan izin dengan bahasa yang mudah dipahami."]),
            ("Mengambil posisi", "code", ("src/services/locationService.ts", "Meminta izin, memeriksa layanan lokasi, lalu membaca posisi.")),
            ("Jarak Haversine", "code", ("src/services/distance.ts", "Jarak lengkung bumi dalam meter. Fungsi murni, mudah diuji.")),
            ("Peta OpenStreetMap", "bullets", [
                "**OpenStreetMap** adalah peta terbuka, **Leaflet** pustaka untuk menampilkannya.",
                "`WebView` memuat HTML peta di dalam aplikasi, sehingga tidak butuh API key.",
                "Alamat didapat dari **reverse geocoding**: koordinat menjadi nama jalan.",
                "Navigasi: tampilkan tujuan dan jarak, atau buka aplikasi peta lewat `Linking`."]),
        ],
        praktik="Hari 1, Step 9 dan 10",
        tugas=["Ubah titik acuan pada `app/location.tsx` ke alamat Anda.", "Tampilkan akurasi posisi dalam meter.", "Tambahkan tombol yang membuka aplikasi peta dengan `Linking.openURL`."],
    ),
    dict(
        n=5, hari=2, waktu="09.00 to 10.00", slug="05-mobile-cellular-network",
        judul="Mobile Cellular Network", pendek="Jaringan Seluler", unit="J.612000.025.01",
        tujuan=["Menjelaskan generasi jaringan seluler", "Menjelaskan komponen jaringan GSM dan konsep Mobile IP", "Mendeteksi jenis koneksi di aplikasi", "Merancang aplikasi yang tetap berguna saat offline"],
        elemen=["Memahami arsitektur jaringan seluler", "Memahami protokol dan Mobile IP", "Mengakses jaringan dari aplikasi"],
        bukti="`src/services/networkService.ts`, `app/network.tsx`, perilaku saat offline",
        konsep=[
            ("Generasi jaringan seluler", "table", (["Generasi", "Ciri utama"], [
                ["2G (GSM)", "Suara digital dan SMS, data sangat terbatas"],
                ["3G (UMTS)", "Data seluler dan internet bergerak"],
                ["4G (LTE)", "Data cepat, berbasis IP penuh"],
                ["5G", "Kecepatan lebih tinggi dan latensi rendah"]])),
            ("Komponen jaringan GSM", "table", (["Komponen", "Peran"], [
                ["MS (Mobile Station)", "Ponsel beserta kartu SIM"],
                ["BTS (Base Transceiver Station)", "Menara pemancar yang melayani satu sel"],
                ["BSC (Base Station Controller)", "Mengatur beberapa BTS"],
                ["MSC (Mobile Switching Center)", "Pusat penyambungan panggilan"],
                ["HLR dan VLR", "Basis data pelanggan tetap dan pelanggan yang sedang berkunjung"]])),
            ("Handover dan Mobile IP", "bullets", [
                "**Handover**: sambungan berpindah ke menara lain saat pengguna bergerak.",
                "**Mobile IP**: perangkat tetap dapat dijangkau dengan alamat yang sama saat berpindah jaringan.",
                "Peran utama: *home agent* di jaringan asal dan *foreign agent* di jaringan yang dikunjungi."]),
            ("Mendeteksi jenis koneksi", "code", ("src/services/networkService.ts", "`labelJaringan` menerjemahkan status mentah menjadi label.")),
            ("Merancang untuk jaringan buruk", "bullets", [
                "Tampilkan data tersimpan lebih dulu (**offline-first**).",
                "Pakai **timeout** dan pesan error yang jelas.",
                "Tunda unduhan besar sampai Wi-Fi bila pengguna memakai data seluler.",
                "Coba lagi secara bertahap, jangan terus-menerus."]),
        ],
        praktik="Hari 2, Step 0 dan 1",
        tugas=["Tampilkan peringatan saat jenis jaringan seluler.", "Matikan Wi-Fi dan data lalu amati halaman jaringan.", "Jelaskan urutan komponen GSM dari ponsel sampai tujuan panggilan."],
    ),
    dict(
        n=6, hari=2, waktu="10.00 to 12.00", slug="06-mobile-sensor-spesifikasi",
        judul="Mobile Sensor dan Spesifikasi Perangkat", pendek="Sensor dan Perangkat", unit="J.612000.022.01",
        tujuan=["Menyebutkan jenis sensor ponsel dan fungsinya", "Membaca akselerometer dengan expo-sensors", "Membaca informasi perangkat", "Menghentikan langganan sensor dengan benar"],
        elemen=["Mengenali jenis sensor", "Menggunakan data sensor pada aplikasi", "Menentukan spesifikasi perangkat"],
        bukti="`app/sensor.tsx`, `app/device.tsx`, langganan dihentikan saat halaman ditutup",
        konsep=[
            ("Jenis sensor", "table", (["Sensor", "Mengukur", "Contoh penggunaan"], [
                ["Akselerometer", "Percepatan", "Hitung langkah, deteksi guncangan"],
                ["Giroskop", "Laju putaran", "Game, stabilisasi"],
                ["Magnetometer", "Medan magnet", "Kompas"],
                ["Sensor cahaya", "Kecerahan", "Kecerahan layar otomatis"],
                ["Sensor jarak", "Dekat atau jauh", "Layar mati saat telepon ke telinga"],
                ["Barometer", "Tekanan udara", "Perkiraan ketinggian"]])),
            ("Rantai sensor", "bullets", [
                "Sensor mengukur besaran fisik, lalu diubah menjadi sinyal listrik.",
                "Konverter analog ke digital (ADC) menghasilkan angka.",
                "Prosesor dan sistem operasi menyediakan angka itu bagi aplikasi.",
                "Protokol antarmuka umum ke chip sensor: **I2C** dan **SPI**."]),
            ("Membaca akselerometer", "code", ("app/sensor.tsx", "Berlangganan dengan `addListener`, berhenti dengan `remove`.", "useEffect(() =>")),
            ("Informasi perangkat", "code", ("app/device.tsx", "Model, OS, dan memori. Nilai kosong diganti tanda hubung.")),
            ("Praktik baik penggunaan sensor", "bullets", [
                "Periksa ketersediaan sensor sebelum memakai.",
                "Pilih interval pembaruan secukupnya agar baterai hemat.",
                "Hentikan langganan saat halaman ditutup.",
                "Kumpulkan data perangkat seperlunya demi privasi."]),
        ],
        praktik="Hari 2, Step 2 dan 3",
        tugas=["Ubah interval sensor dan amati perubahan angka.", "Deteksi guncangan: tampilkan pesan saat besar total lebih dari 2 g.", "Tampilkan resolusi layar dengan `Dimensions`."],
    ),
    dict(
        n=7, hari=2, waktu="13.00 to 15.00", slug="07-keamanan-komunikasi-mobile",
        judul="Keamanan Komunikasi Mobile", pendek="Keamanan", unit="J.612000.008.01",
        tujuan=["Menjelaskan ancaman pada komunikasi nirkabel", "Menerapkan HTTPS dan menolak HTTP", "Menyimpan token dengan aman", "Menerapkan validasi masukan dan timeout"],
        elemen=["Mengenali kerentanan komunikasi nirkabel", "Menerapkan pengamanan komunikasi", "Menerapkan penyimpanan dan masukan yang aman"],
        bukti="`src/services/httpsService.ts`, `src/services/secureStorage.ts`, `app/keamanan.tsx`",
        konsep=[
            ("Ancaman komunikasi nirkabel", "table", (["Ancaman", "Cara kerja", "Pencegahan"], [
                ["Penyadapan (sniffing)", "Membaca lalu lintas Wi-Fi terbuka", "HTTPS, hindari Wi-Fi terbuka"],
                ["Man-in-the-middle", "Penyerang berada di tengah jalur", "TLS dengan sertifikat valid"],
                ["Access point palsu", "Wi-Fi tiruan menjebak pengguna", "Verifikasi jaringan, pakai VPN"],
                ["Pencurian token", "Rahasia dibaca dari penyimpanan biasa", "Penyimpanan aman"]])),
            ("HTTPS dan timeout", "code", ("src/services/httpsService.ts", "Tolak URL non-HTTPS, batasi waktu dengan `AbortController`, periksa status.", "export async function ambilJson")),
            ("Penyimpanan aman", "code", ("src/services/secureStorage.ts", "Token disimpan di Keystore Android atau Keychain iOS.")),
            ("Prinsip pengamanan aplikasi", "bullets", [
                "Selalu **HTTPS**. Jangan menonaktifkan pemeriksaan sertifikat.",
                "Rahasia di **secure store**, bukan di SQLite atau teks biasa.",
                "**Validasi masukan** di aplikasi dan di server.",
                "Jangan menaruh API key rahasia di dalam kode aplikasi.",
                "Minta **izin seperlunya** dan jelaskan alasannya."]),
        ],
        praktik="Hari 2, Step 4 dan 5",
        tugas=["Uji alamat `http://` dan pastikan ditolak.", "Simpan, baca, dan hapus token lewat halaman keamanan.", "Tambahkan validasi agar URL kosong menampilkan pesan khusus."],
    ),
    dict(
        n=8, hari=2, waktu="15.00 to 17.00", slug="08-latihan-uji-kompetensi",
        judul="Latihan dan Persiapan Uji Kompetensi", pendek="Latihan dan Uji", unit="Semua unit",
        tujuan=["Menjalankan seluruh fitur aplikasi", "Menjalankan pengujian otomatis", "Menyiapkan bukti kompetensi untuk BNSP", "Mengerjakan latihan soal"],
        elemen=["Seluruh elemen tujuh unit kompetensi"],
        bukti="aplikasi berjalan, `npm test` lulus, `npm run typecheck` bersih, hasil latihan soal",
        konsep=[
            ("Daftar periksa aplikasi", "bullets", [
                "Catatan: tambah, ubah, hapus, data tetap ada setelah aplikasi ditutup.",
                "Lokasi: izin diminta saat tombol ditekan, peta dan jarak tampil.",
                "Jaringan: label sesuai kondisi, aplikasi tetap berfungsi offline.",
                "Sensor dan perangkat: angka tampil, langganan dihentikan.",
                "Keamanan: HTTP ditolak, token tersimpan aman."]),
            ("Pengujian otomatis", "code", ("__tests__/https.test.ts", "Menguji jalur berhasil dan gagal tanpa internet memakai `fetch` palsu.")),
            ("Menyiapkan bukti BNSP", "bullets", [
                "Siapkan aplikasi yang berjalan di perangkat atau emulator.",
                "Tunjukkan file kode yang menjadi bukti tiap unit (lihat peta kompetensi).",
                "Jalankan `npm test` dan `npm run typecheck` sebagai bukti kualitas.",
                "Latih penjelasan lisan: apa yang dibuat, mengapa, dan bagaimana mengujinya."]),
        ],
        praktik="Hari 2, Step 6 sampai 8",
        tugas=["Kerjakan latihan soal BNSP di `flutter/slides/latihan-soal-bnsp.html` (soal konseptual berlaku untuk kedua teknologi).", "Jalankan seluruh aplikasi dari awal tanpa melihat catatan.", "Jelaskan satu fitur kepada teman dalam dua menit."],
    ),
]


# Simulasi interaktif per modul: {judul konsep: nama simulasi} (lihat shared/assets/sim.js dan sim-rn.js)
SIM = {1: {'Cara kerja React Native': 'rn_bridge', 'Komponen pertama': 'rn_state'}, 2: {'Flexbox dan gaya': 'rn_flex', 'Navigasi expo-router': 'rn_nav', 'Form dan validasi': 'form'}, 3: {'Repository dan CRUD': 'crud', 'Model berlapis dan sinkronisasi': 'offline'}, 4: {'Izin lokasi': 'permission', 'Jarak Haversine': 'haversine'}, 5: {'Handover dan Mobile IP': 'handover', 'Mendeteksi jenis koneksi': 'network'}, 6: {'Jenis sensor': 'accel', 'Membaca akselerometer': 'rn_effect'}, 7: {'Ancaman komunikasi nirkabel': 'tls', 'HTTPS dan timeout': 'urlcheck', 'Penyimpanan aman': 'secure', 'Prinsip pengamanan aplikasi': 'auth'}, 8: {'Pengujian otomatis': 'rn_tests'}}
for _m in MODUL:
    _m["sim"] = SIM[_m["n"]]
