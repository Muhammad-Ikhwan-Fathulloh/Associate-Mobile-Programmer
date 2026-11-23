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


# ======================================================================
# AGENDA BARU (25 s.d. 26 November 2026)
# Hari 1: instalasi, Figma + Stitch, SQLite (+MySQL), GPS ke SQLite
# Hari 2: API dasar, sensor, API lanjutan dan sinkronisasi, latihan
# Blok ini menyesuaikan modul 1 sampai 8 di atas dengan agenda baru.
# ======================================================================
FIGMA_URL = "https://www.figma.com/design/grYqOsULGfzYsDrtIjmjRL"
_M = {m["n"]: m for m in MODUL}

# --- Modul 1: ditambah instalasi lingkungan ---
_M[1].update(
    waktu="09.00 to 10.00",
    judul="Instalasi Platform, Emulator, dan Environment",
    pendek="Instalasi dan Platform",
    tujuan=["Memasang Node.js, editor, dan emulator atau Expo Go", "Menjelaskan perbedaan Android dan iOS serta pilihan native atau cross-platform", "Menulis TypeScript dasar", "Membuat dan menjalankan proyek React Native dengan Expo"],
    praktik="Hari 1, Step 0 sampai 2",
)
_M[1]["konsep"].insert(0, ("Menyiapkan environment", "table", (["Kebutuhan", "React Native (Expo)", "Flutter"], [
    ["Bahasa", "TypeScript (butuh Node.js LTS)", "Dart (ikut Flutter SDK)"],
    ["Editor", "VS Code", "VS Code atau Android Studio"],
    ["Menjalankan di ponsel", "Expo Go + kode QR", "Kabel USB atau emulator"],
    ["Emulator Android", "Android Studio, Device Manager", "Android Studio, Device Manager"],
    ["Perintah cek", "`node -v` dan `npx expo --version`", "`flutter doctor`"]])))
_M[1]["tugas"] = ["Pasang Node.js, Expo Go, dan jalankan `npx expo start`.", "Buat emulator di Android Studio atau siapkan ponsel dengan Expo Go.", "Ubah teks pada `app/index.tsx` dan lihat perubahan langsung (Fast Refresh)."]

# --- Modul 2: Figma, Stitch, gaya, AI ---
_M[2].update(
    waktu="10.00 to 12.00", slug="02-figma-stitch-dan-gaya",
    judul="Desain dengan Figma dan Stitch, Gaya, dan Implementasi dengan AI",
    pendek="Figma, Stitch, dan Gaya",
    tujuan=["Merancang layar di Figma dengan Auto Layout dan variable", "Memakai Google Stitch untuk membuat rancangan awal dari prompt", "Membandingkan beberapa gaya desain", "Mengubah token desain menjadi `src/theme.ts`", "Meminta AI menerapkan gaya ke aplikasi dan meninjau hasilnya"],
    elemen=["Menentukan alat perancangan antarmuka", "Memilih informasi yang ditampilkan per layar", "Membuat aksi dan desain estetis per layar"],
    bukti="berkas Figma (variable dan 5 layar), `src/theme.ts`, `src/ui.ts`, `app/_layout.tsx`, `app/note-form.tsx`",
)
_M[2]["konsep"] = [
    ("Alur dari ide ke aplikasi", "bullets", [
        "Mulai dari kebutuhan pengguna dan daftar layar, bukan dari warna.",
        "**Google Stitch** membuat rancangan awal dari prompt, lalu diperbaiki lewat chat.",
        f"**Figma** merapikan rancangan: Auto Layout, komponen, dan **variable**. Berkas contoh pelatihan: {FIGMA_URL}",
        "Variable menjadi **token** di `src/theme.ts`. Komponen kode memakai token, bukan angka langsung.",
        "AI membantu menerapkan gaya ke kode. Manusia meninjau hasilnya."]),
    ("Google Stitch", "bullets", [
        "Alat dari Google Labs di `stitch.withgoogle.com`: teks atau gambar menjadi rancangan antarmuka dan kode front-end.",
        "Perbaiki dengan chat, ubah tema, lalu salin atau ekspor ke Figma sebagai layer yang bisa diedit.",
        "Hasil Stitch adalah **titik awal**. Rapikan struktur dan token sebelum menjadi kode aplikasi.",
        "Fitur dan menu berubah cepat. Cek tampilan terbaru sebelum sesi dimulai."]),
    ("Figma untuk pengembang", "table", (["Fitur", "Fungsi", "Padanan di kode"], [
        ["Auto Layout", "Isi menyesuaikan ukuran dan jarak", "Flexbox, `flexDirection`, `gap`"],
        ["Component", "Elemen yang dipakai ulang", "Komponen React, mis. `Tombol`"],
        ["Variable", "Warna, spasi, radius, font", "`tema` di `src/theme.ts`"],
        ["Dev Mode", "Melihat ukuran dan nilai untuk pengembang", "Nilai di `StyleSheet`"],
        ["Prototype", "Mengklik antar layar", "Navigasi `expo-router`"]])),
    ("Beberapa gaya desain", "table", (["Gaya", "Ciri", "Cocok untuk"], [
        ["Material", "Bayangan lembut, tombol terisi, ikon jelas", "Aplikasi Android umum"],
        ["iOS (HIG)", "Sudut membulat, banyak ruang kosong, teks tebal tipis", "Aplikasi dengan nuansa iOS"],
        ["Minimal", "Sedikit warna, banyak spasi, tanpa dekorasi", "Alat kerja dan catatan"],
        ["Gelap", "Latar gelap, kontras dijaga", "Dipakai malam, hemat baterai layar OLED"]])),
    ("Token menjadi theme.ts", "code", ("src/theme.ts", "Setiap variable Figma punya padanan di sini. Mengubah satu nilai mengubah seluruh aplikasi.")),
    ("Token diterapkan di komponen", "code", ("src/ui.ts", "Gaya dibuat dari `tema`. Target sentuh tombol 48 dp.")),
    ("Prompt AI untuk menerapkan gaya", "bullets", [
        "Sertakan **konteks**: tumpukan teknologi (Expo, TypeScript), file `src/theme.ts` dan `src/ui.ts`.",
        "Sertakan **tujuan**: gaya apa, layar mana, dan batasannya (jangan ubah logika).",
        "Sertakan **bukti desain**: tangkapan layar Figma atau nilai variable.",
        "Setelah AI mengubah kode: jalankan `npm run typecheck` dan `npm test`, lalu lihat hasilnya di perangkat.",
        "Jangan menempelkan rahasia (token, kata sandi) ke alat AI."]),
    ("Navigasi expo-router", "code", ("app/_layout.tsx", "Nama file di `app/` menjadi alamat halaman. `Stack` menambahkan tombol kembali.")),
]
_M[2]["praktik"] = "Hari 1, Step 3 dan 4"
_M[2]["tugas"] = ["Buka berkas Figma contoh, ubah `warna/utama`, lalu samakan nilainya di `src/theme.ts`.", "Buat rancangan layar Catatan di Stitch, ekspor ke Figma, dan rapikan dengan Auto Layout.", "Minta AI mengubah gaya aplikasi menjadi gelap memakai prompt berkonteks, lalu tinjau perbedaannya."]

# --- Modul 3: SQLite dan MySQL ---
_M[3].update(judul="SQLite, MySQL, dan Data Persistence", pendek="SQLite dan MySQL")
_M[3]["konsep"].insert(2, ("SQLite dan MySQL", "table", (["Aspek", "SQLite", "MySQL"], [
    ["Lokasi", "Berkas di ponsel, tertanam di aplikasi", "Server terpisah"],
    ["Pengguna", "Satu aplikasi, satu pengguna", "Banyak pengguna bersamaan"],
    ["Instalasi", "Tanpa instalasi", "Perlu server dan akun basis data"],
    ["Offline", "Tetap jalan", "Butuh jaringan"],
    ["Peran di aplikasi mobile", "Penyimpanan lokal", "Penyimpanan pusat di belakang API"]])))
_M[3]["konsep"].insert(3, ("Mengapa ponsel tidak langsung ke MySQL", "bullets", [
    "Kata sandi basis data harus ada di aplikasi, dan aplikasi dapat dibongkar.",
    "Port MySQL terbuka ke internet, menambah risiko serangan.",
    "Tidak ada tempat memeriksa hak akses dan validasi per pengguna.",
    "Solusi: ponsel memanggil **API** (HTTPS + token), API yang berbicara ke MySQL. Skema contoh ada di `shared/server/schema.sql`."]))
_M[3]["praktik"] = "Hari 1, Step 5 sampai 7"

# --- Modul 4: simpan GPS ke SQLite ---
_M[4].update(judul="GPS, Peta, dan Menyimpan Lokasi ke SQLite", pendek="GPS dan SQLite")
_M[4]["konsep"].insert(3, ("Menyimpan GPS ke SQLite", "code", ("app/note-form.tsx", "Tombol mengisi `lokasi`. Saat disimpan, `latitude` dan `longitude` masuk ke dua kolom tabel `notes`. Tanpa izin, kolom bernilai NULL.", "const ambilLokasi")))
_M[4]["konsep"].insert(4, ("Menampilkan koordinat tersimpan", "bullets", [
    "Koordinat disimpan sebagai angka desimal (`REAL`), bukan teks.",
    "Fungsi `formatKoordinat` menampilkan `-6.91750, 107.61910` atau teks pengganti bila kosong.",
    "Jarak antara dua catatan dihitung dengan Haversine dari dua pasang koordinat tersimpan.",
    "Lokasi adalah **data pribadi**: simpan seperlunya dan jelaskan alasannya."]))
_M[4]["praktik"] = "Hari 1, Step 8 sampai 10"
_M[4]["tugas"] = ["Buat catatan dengan lokasi, tutup aplikasi, buka lagi, dan pastikan koordinat tetap ada.", "Tolak izin lokasi dan pastikan catatan tetap tersimpan.", "Tampilkan jarak catatan ke posisi Anda sekarang."]

# --- Modul 5: API dasar ---
_M[5].update(
    waktu="09.00 to 10.00", slug="05-api-dasar",
    judul="API dan Menghubungkan Aplikasi Mobile", pendek="API Dasar", unit="J.612000.025.01",
    tujuan=["Menjelaskan REST, metode HTTP, kode status, dan JSON", "Menjalankan server latihan", "Memanggil API dari aplikasi dengan `fetch`", "Menangani gagal: status error, timeout, dan jaringan mati"],
    elemen=["Memahami protokol dan komunikasi data", "Mengakses jaringan dari aplikasi"],
    bukti="`shared/server/app.js`, `src/services/httpsService.ts`, `src/services/apiClient.ts`, halaman Sinkronisasi",
    praktik="Hari 2, Step 0 sampai 2",
    tugas=["Jalankan server: `cd shared/server`, `npm install`, `npm start`, buka `http://localhost:3000/health`.", "Login lewat halaman Sinkronisasi dan baca log hasilnya.", "Matikan server lalu coba lagi. Apa pesan error yang tampil?"],
)
_M[5]["konsep"] = [
    ("Apa itu API", "bullets", [
        "**API** adalah pintu bagi program lain untuk meminta atau mengubah data.",
        "**REST** memakai alamat (URL) untuk sumber daya dan **metode HTTP** untuk aksinya, data umumnya **JSON**.",
        "Aplikasi adalah **klien**, server menjawab. Satu permintaan, satu jawaban."]),
    ("Metode dan kode status", "table", (["Metode", "Aksi", "Status berhasil"], [
        ["GET /notes", "Baca daftar", "200"],
        ["POST /notes", "Buat baru", "201"],
        ["PUT /notes/:id", "Ubah", "200"],
        ["DELETE /notes/:id", "Hapus", "204 (tanpa isi)"],
        ["Kesalahan klien", "Data salah, belum login, tidak ada", "400, 401, 404"]])),
    ("Server latihan", "bullets", [
        "Ada di `shared/server`: Express, penyimpanan di memori, `npm start` pada port 3000.",
        "Login contoh: `peserta@contoh.id` dengan kata sandi `rahasia123`. Server mengembalikan **token**.",
        "Emulator Android mengakses komputer lewat `10.0.2.2`. Ponsel fisik memakai alamat IP komputer di Wi-Fi yang sama.",
        "Tersedia 4 pengujian otomatis: `npm test`."]),
    ("Memanggil API dengan fetch", "code", ("src/services/httpsService.ts", "`requestJson` membatasi waktu, memeriksa status, dan melempar `ApiError` bermuatan pesan server.", "export async function requestJson")),
    ("Klien API", "code", ("src/services/apiClient.ts", "Satu fungsi per endpoint. Halaman tidak perlu tahu detail URL.", "export function buatApiClient")),
    ("Menangani kegagalan", "bullets", [
        "Status 4xx: tampilkan pesan dari server (`error`).",
        "Timeout atau jaringan mati: simpan sebagai PENDING, coba lagi nanti.",
        "Jangan membaca body kosong (204) sebagai JSON.",
        "Aplikasi tidak boleh macet: selalu ada batas waktu."]),
]

# --- Modul 6: sensor, tambah giroskop dan guncangan ---
_M[6].update(praktik="Hari 2, Step 3 dan 4")
_M[6]["konsep"].insert(2, ("Giroskop dan kompas", "bullets", [
    "**Giroskop** mengukur laju putar (rad/s). Sudut didapat dengan mengakumulasi laju terhadap waktu, hasilnya cenderung bergeser (drift).",
    "**Magnetometer** mengukur medan magnet bumi. Arah kompas dihitung dari komponen x dan y.",
    "Padukan sensor (sensor fusion) untuk arah yang stabil. Di pelatihan ini pendekatan sederhana dipakai dan diberi catatan akurasinya."]))
_M[6]["konsep"].insert(4, ("Menghitung guncangan dan arah", "code", ("src/services/sensorMath.ts", "Fungsi murni, mudah diuji: besar vektor, deteksi guncangan, arah kompas, dan mata angin.", "export function terdeteksiGuncangan")))
_M[6]["tugas"] = ["Ubah interval sensor dan amati perubahan angka.", "Guncang ponsel dan pastikan pesan guncangan tampil (besar lebih dari 2 g).", "Putar ponsel dan amati giroskop serta arah kompas."]

# --- Modul 7: API lanjutan, sinkronisasi, keamanan, jaringan seluler ---
_M[7].update(
    slug="07-api-lanjutan-sinkronisasi",
    judul="API Lanjutan: CRUD, Token, Sinkronisasi, dan Keamanan Jaringan",
    pendek="API Lanjutan", unit="J.612000.008.01",
    tujuan=["Menyelesaikan CRUD lewat API dengan token", "Menyimpan token dengan aman", "Menyinkronkan data lokal dengan server (offline-first)", "Menjelaskan jaringan seluler dan ancaman komunikasi nirkabel"],
    elemen=["Mengenali kerentanan komunikasi nirkabel", "Menerapkan pengamanan komunikasi", "Memahami arsitektur jaringan seluler"],
    bukti="`src/services/sync.ts`, `src/services/secureStorage.ts`, `app/sinkron.tsx`, `src/services/networkService.ts`",
    praktik="Hari 2, Step 5 sampai 7",
    tugas=["Buat catatan saat server mati, nyalakan server, lalu tekan Sinkronkan. Pastikan status berubah menjadi SYNCED.", "Ubah catatan yang sudah SYNCED dan sinkronkan lagi. Server menerima PUT atau POST?", "Uji alamat `http://` publik dan pastikan ditolak."],
)
_M[7]["konsep"] = [
    ("Alur sinkronisasi", "bullets", [
        "Simpan ke SQLite dulu (**offline-first**) dengan status `PENDING`.",
        "Saat online: kirim semua `PENDING` (POST bila baru, PUT bila sudah punya `serverId`).",
        "Tandai `SYNCED` dan simpan `serverId` dari server, lalu ambil data baru dari server.",
        "Satu kegagalan tidak boleh menghentikan yang lain. Hasil dilaporkan: terkirim, diterima, gagal."]),
    ("Kode sinkronisasi", "code", ("src/services/sync.ts", "Dua tahap: kirim yang tertunda, lalu ambil dari server. Pengujiannya memakai API palsu tanpa jaringan.", "export async function sinkronkan")),
    ("Token dan penyimpanan aman", "code", ("src/services/secureStorage.ts", "Token disimpan di Keystore Android atau Keychain iOS, bukan di SQLite.")),
    ("Jaringan seluler secara ringkas", "table", (["Generasi", "Ciri utama"], [
        ["2G (GSM)", "Suara digital dan SMS, data terbatas"],
        ["3G", "Data seluler dan internet bergerak"],
        ["4G (LTE)", "Data cepat, berbasis IP penuh"],
        ["5G", "Kecepatan tinggi dan latensi rendah"]])),
    ("Handover dan Mobile IP", "bullets", [
        "**Handover**: sambungan berpindah ke menara lain saat pengguna bergerak.",
        "**Mobile IP**: perangkat tetap dapat dijangkau dengan alamat yang sama saat berpindah jaringan.",
        "Komponen GSM: MS (ponsel dan SIM), BTS (menara), BSC, MSC, serta HLR dan VLR (basis data pelanggan)."]),
    ("Mendeteksi jenis koneksi", "code", ("src/services/networkService.ts", "`labelJaringan` menerjemahkan status mentah menjadi label. Dipakai agar sinkronisasi menunggu jaringan yang sesuai.")),
    ("Ancaman komunikasi nirkabel", "table", (["Ancaman", "Cara kerja", "Pencegahan"], [
        ["Penyadapan (sniffing)", "Membaca lalu lintas Wi-Fi terbuka", "HTTPS, hindari Wi-Fi terbuka"],
        ["Man-in-the-middle", "Penyerang berada di tengah jalur", "TLS dengan sertifikat valid"],
        ["Access point palsu", "Wi-Fi tiruan menjebak pengguna", "Verifikasi jaringan, pakai VPN"],
        ["Pencurian token", "Rahasia dibaca dari penyimpanan biasa", "Penyimpanan aman"]])),
    ("HTTPS dan timeout", "code", ("src/services/httpsService.ts", "Tolak URL non-HTTPS (kecuali alamat lokal untuk pengembangan), batasi waktu dengan `AbortController`.", "export function periksaUrlAman")),
    ("Prinsip pengamanan aplikasi", "bullets", [
        "Selalu **HTTPS** di produksi. HTTP hanya untuk server lokal saat pengembangan.",
        "Rahasia di **secure store**, bukan di SQLite atau teks biasa.",
        "**Validasi masukan** di aplikasi dan di server.",
        "Jangan menaruh kunci rahasia di dalam kode aplikasi.",
        "Minta **izin seperlunya** dan jelaskan alasannya."]),
]

# --- Modul 8: latihan ---
_M[8]["konsep"][0] = ("Daftar periksa aplikasi", "bullets", [
    "Desain: token di `src/theme.ts` sama dengan variable Figma.",
    "Catatan: tambah, ubah, hapus, data tetap ada setelah aplikasi ditutup.",
    "Lokasi: izin diminta saat tombol ditekan, koordinat tersimpan di SQLite.",
    "API: login, sinkronisasi, dan penanganan server mati berjalan.",
    "Sensor: angka tampil, guncangan terdeteksi, langganan dihentikan.",
    "Keamanan: HTTP publik ditolak, token tersimpan aman."])
_M[8]["praktik"] = "Hari 2, Step 8"


# Simulasi interaktif per modul: {judul konsep: nama simulasi} (lihat shared/assets/sim.js dan sim-rn.js)
SIM = {
    1: {'Cara kerja React Native': 'rn_bridge', 'Komponen pertama': 'rn_state'},
    2: {'Alur dari ide ke aplikasi': 'stitch_flow', 'Token menjadi theme.ts': 'tokens', 'Beberapa gaya desain': 'theme', 'Navigasi expo-router': 'rn_nav'},
    3: {'SQLite dan MySQL': 'sqlmysql', 'Repository dan CRUD': 'crud', 'Model berlapis dan sinkronisasi': 'offline'},
    4: {'Izin lokasi': 'permission', 'Menyimpan GPS ke SQLite': 'gps_save', 'Jarak Haversine': 'haversine'},
    5: {'Metode dan kode status': 'rest', 'Menangani kegagalan': 'network'},
    6: {'Jenis sensor': 'accel', 'Giroskop dan kompas': 'gyro', 'Membaca akselerometer': 'rn_effect'},
    7: {'Alur sinkronisasi': 'offline', 'Handover dan Mobile IP': 'handover', 'Ancaman komunikasi nirkabel': 'tls', 'HTTPS dan timeout': 'urlcheck', 'Token dan penyimpanan aman': 'secure', 'Prinsip pengamanan aplikasi': 'auth'},
    8: {'Pengujian otomatis': 'rn_tests'},
}
for _m in MODUL:
    _m["sim"] = SIM[_m["n"]]
