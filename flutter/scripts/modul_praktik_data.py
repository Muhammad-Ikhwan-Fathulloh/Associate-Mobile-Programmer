"""Data praktik step by step untuk slide per modul.

Setiap modul: intro, langkah (judul, instruksi, file, kode, hasil), coba, kriteria, galat.
"""

M = {}

# ------------------------------------------------------------------ MODUL 1
M[1] = dict(
    file="hari-1-modul-1-platform-dan-bahasa.html",
    waktu="30 menit",
    tujuan=["Membuat dan menjalankan proyek Flutter", "Menulis dan menjalankan program Dart dasar", "Membuat counter dan memakai hot reload"],
    hasil_akhir="Aplikasi counter dengan tema sendiri, berjalan di emulator atau ponsel.",
    persiapan="flutter create latihan\ncd latihan\nflutter devices",
    langkah=[
        dict(
            judul="Jalankan Proyek Bawaan",
            file="Terminal",
            instr=["Buat proyek dengan `flutter create latihan`.", "Masuk ke folder: `cd latihan`.", "Jalankan `flutter run`, lalu pilih perangkat bila diminta."],
            kode="flutter create latihan\ncd latihan\nflutter run",
            hasil="Aplikasi counter bawaan tampil. Tombol + menaikkan angka.",
        ),
        dict(
            judul="Dart Dasar",
            file="dasar.dart (di folder latihan)",
            instr=["Buat file `dasar.dart` di folder `latihan`.", "Salin kode, simpan.", "Jalankan `dart run dasar.dart`."],
            kode="""class Mahasiswa {
  Mahasiswa(this.nama, this.nilai);
  final String nama;
  final int nilai;

  String get predikat => nilai >= 80 ? 'A' : nilai >= 70 ? 'B' : 'C';
}

int jumlah(List<int> data) {
  var total = 0;
  for (final x in data) {
    total += x;
  }
  return total;
}

void main() {
  const sapaan = 'Halo';
  String? panggilan; // boleh bernilai null
  print('$sapaan ${panggilan ?? 'Peserta'}');

  print('Total: ${jumlah([90, 75, 60])}');

  final data = {'Ani': 90, 'Budi': 75};
  data.forEach((nama, n) => print('$nama: ${Mahasiswa(nama, n).predikat}'));
}""",
            hasil="Keluaran: Halo Peserta, Total: 225, Ani: A, Budi: B.",
        ),
        dict(
            judul="Counter Sendiri",
            file="lib/main.dart",
            instr=["Buka `lib/main.dart`, hapus seluruh isinya.", "Tempel kode di bawah, simpan.", "Jalankan `flutter run` atau tekan `r` bila sudah berjalan."],
            kode="""import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      home: const HalamanCounter(),
    );
  }
}

class HalamanCounter extends StatefulWidget {
  const HalamanCounter({super.key});

  @override
  State<HalamanCounter> createState() => _HalamanCounterState();
}

class _HalamanCounterState extends State<HalamanCounter> {
  int _nilai = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Counter Latihan')),
      body: Center(
        child: Text('$_nilai', style: Theme.of(context).textTheme.displayLarge),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => setState(() => _nilai++),
        child: const Icon(Icons.add),
      ),
    );
  }
}""",
            hasil="Angka bertambah setiap tombol + ditekan. `setState` membangun ulang tampilan.",
        ),
        dict(
            judul="Hot Reload dan Hot Restart",
            file="lib/main.dart",
            instr=["Ubah `Colors.indigo` menjadi `Colors.teal` dan simpan.", "Tekan `r` di terminal: warna berubah, angka tetap.", "Tekan `R` (hot restart): angka kembali ke 0."],
            kode="theme: ThemeData(colorSchemeSeed: Colors.teal, useMaterial3: true),",
            hasil="Hot reload mempertahankan state. Hot restart mengulang dari awal.",
        ),
    ],
    coba=[
        "Tambahkan tombol reset (`Icons.refresh`) yang mengembalikan angka ke 0.",
        "Tampilkan teks Genap atau Ganjil di bawah angka (petunjuk: `_nilai.isEven`).",
        "Ubah penambahan menjadi kelipatan 5.",
    ],
    kriteria=["Proyek berjalan tanpa error", "`dart run dasar.dart` menampilkan 4 baris keluaran", "Counter bertambah saat tombol ditekan", "Peserta dapat menjelaskan beda hot reload dan hot restart"],
    galat=[
        ("`No devices found`", "Nyalakan emulator atau sambungkan ponsel, lalu cek `flutter devices`."),
        ("`flutter` tidak dikenali", "PATH belum diatur. Lihat panduan instalasi."),
        ("`pub get failed`", "Periksa koneksi internet lalu ulangi `flutter pub get`."),
    ],
)

# ------------------------------------------------------------------ MODUL 2
M[2] = dict(
    file="hari-1-modul-2-mobile-interface.html",
    waktu="45 menit",
    tujuan=["Menerapkan tema Material 3", "Membuat daftar dan berpindah halaman", "Membuat form dengan validasi", "Membuat tata letak responsif"],
    hasil_akhir="Tiga halaman latihan: daftar menu, form validasi, dan grid responsif.",
    persiapan="Pakai proyek `latihan` dari Modul 1.\nSetiap langkah mengganti isi lib/main.dart.",
    langkah=[
        dict(
            judul="Tema, Daftar, dan Navigasi",
            file="lib/main.dart",
            instr=["Ganti seluruh isi `lib/main.dart`.", "Jalankan aplikasi.", "Ketuk salah satu menu untuk membuka halaman detail."],
            kode="""import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Latihan UI',
      theme: ThemeData(colorSchemeSeed: Colors.teal, useMaterial3: true),
      home: const DaftarPage(),
    );
  }
}

class DaftarPage extends StatelessWidget {
  const DaftarPage({super.key});

  static const _menu = ['Catatan', 'Lokasi', 'Jaringan', 'Sensor'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Beranda')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _menu.length,
        itemBuilder: (context, i) => Card(
          child: ListTile(
            leading: const Icon(Icons.apps),
            title: Text(_menu[i]),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => DetailPage(judul: _menu[i])),
            ),
          ),
        ),
      ),
    );
  }
}

class DetailPage extends StatelessWidget {
  const DetailPage({super.key, required this.judul});
  final String judul;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(judul)),
      body: Center(child: Text('Halaman $judul')),
    );
  }
}""",
            hasil="Daftar empat menu. Mengetuk menu membuka halaman, tombol kembali berfungsi.",
        ),
        dict(
            judul="Form dengan Validasi",
            file="lib/main.dart (tambahkan kelas di bagian bawah)",
            instr=["Tempel kelas `FormPage` di akhir file.", "Ubah `home: const DaftarPage()` menjadi `home: const FormPage()`.", "Coba simpan dengan judul kosong, lalu dengan judul valid."],
            kode="""class FormPage extends StatefulWidget {
  const FormPage({super.key});

  @override
  State<FormPage> createState() => _FormPageState();
}

class _FormPageState extends State<FormPage> {
  final _kunci = GlobalKey<FormState>();
  final _judul = TextEditingController();

  @override
  void dispose() {
    _judul.dispose();
    super.dispose();
  }

  void _simpan() {
    if (!_kunci.currentState!.validate()) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Tersimpan: ${_judul.text.trim()}')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Form Catatan')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _kunci,
          child: Column(
            children: [
              TextFormField(
                controller: _judul,
                decoration: const InputDecoration(
                  labelText: 'Judul',
                  border: OutlineInputBorder(),
                ),
                validator: (v) => (v == null || v.trim().length < 3)
                    ? 'Judul minimal 3 karakter'
                    : null,
              ),
              const SizedBox(height: 16),
              FilledButton(onPressed: _simpan, child: const Text('Simpan')),
            ],
          ),
        ),
      ),
    );
  }
}""",
            hasil="Judul kurang dari 3 karakter menampilkan pesan merah. Judul valid menampilkan SnackBar.",
        ),
        dict(
            judul="Tata Letak Responsif",
            file="lib/main.dart (tambahkan kelas di bagian bawah)",
            instr=["Tempel kelas `ResponsivePage` di akhir file.", "Ubah `home` menjadi `const ResponsivePage()`.", "Putar emulator ke landscape atau ubah ukuran jendela."],
            kode="""class ResponsivePage extends StatelessWidget {
  const ResponsivePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Responsif')),
      body: LayoutBuilder(
        builder: (context, box) {
          final kolom = box.maxWidth >= 600 ? 3 : 1;
          return GridView.count(
            crossAxisCount: kolom,
            childAspectRatio: 3,
            padding: const EdgeInsets.all(16),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            children: List.generate(
              6,
              (i) => Card(child: Center(child: Text('Item ${i + 1}'))),
            ),
          );
        },
      ),
    );
  }
}""",
            hasil="Layar sempit menampilkan 1 kolom. Layar lebar dari 600 dp menampilkan 3 kolom.",
        ),
    ],
    coba=[
        "Tambahkan validasi kolom isi catatan (tidak boleh kosong) pada form.",
        "Ubah ambang responsif menjadi 480 dan amati perbedaannya.",
        "Ganti `Colors.teal` dengan warna lain dan lihat seluruh palet berubah.",
    ],
    kriteria=["Navigasi maju dan kembali berfungsi", "Form menolak masukan kurang dari 3 karakter", "Grid berubah jumlah kolom saat layar diputar", "Controller dilepas di `dispose`"],
    galat=[
        ("Teks meluber (garis kuning hitam)", "Bungkus widget dengan `Expanded` atau `SingleChildScrollView`."),
        ("`Navigator operation requested with a context that does not include a Navigator`", "Pastikan `MaterialApp` berada di atas widget yang memanggil `Navigator`."),
        ("`setState() called after dispose()`", "Periksa `mounted` sebelum `setState` setelah proses asynchronous."),
    ],
)

# ------------------------------------------------------------------ MODUL 3
M[3] = dict(
    file="hari-1-modul-3-database-persistence.html",
    waktu="45 menit",
    tujuan=["Membuat database SQLite dengan sqflite", "Melakukan tambah, baca, dan hapus data", "Membuktikan data bertahan setelah aplikasi ditutup"],
    hasil_akhir="Aplikasi catatan sederhana yang menyimpan data di SQLite.",
    persiapan="flutter create latihan_db\ncd latihan_db\nflutter pub add sqflite path",
    langkah=[
        dict(
            judul="Lapisan Database",
            file="lib/db.dart",
            instr=["Buat file baru `lib/db.dart`.", "Tempel kode, simpan.", "Perhatikan `onCreate` hanya berjalan saat database pertama dibuat."],
            kode="""import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class Db {
  static Database? _db;

  static Future<Database> get instance async {
    if (_db != null) return _db!;
    final lokasi = join(await getDatabasesPath(), 'latihan.db');
    _db = await openDatabase(
      lokasi,
      version: 1,
      onCreate: (db, versi) => db.execute(
        'CREATE TABLE catatan ('
        'id INTEGER PRIMARY KEY AUTOINCREMENT, '
        'judul TEXT NOT NULL)',
      ),
    );
    return _db!;
  }

  static Future<List<Map<String, Object?>>> semua() async {
    final db = await instance;
    return db.query('catatan', orderBy: 'id DESC');
  }

  static Future<int> tambah(String judul) async {
    final db = await instance;
    return db.insert('catatan', {'judul': judul});
  }

  static Future<int> hapus(int id) async {
    final db = await instance;
    return db.delete('catatan', where: 'id = ?', whereArgs: [id]);
  }
}""",
            hasil="File tersimpan tanpa error merah. Belum ada tampilan, ini hanya lapisan data.",
        ),
        dict(
            judul="Tampilan Catatan",
            file="lib/main.dart",
            instr=["Ganti seluruh isi `lib/main.dart`.", "Jalankan di emulator atau ponsel (bukan web).", "Tambahkan beberapa catatan lewat kolom teks."],
            kode="""import 'package:flutter/material.dart';

import 'db.dart';

void main() => runApp(const MaterialApp(home: CatatanPage()));

class CatatanPage extends StatefulWidget {
  const CatatanPage({super.key});

  @override
  State<CatatanPage> createState() => _CatatanPageState();
}

class _CatatanPageState extends State<CatatanPage> {
  final _input = TextEditingController();
  List<Map<String, Object?>> _data = [];

  @override
  void initState() {
    super.initState();
    _muat();
  }

  @override
  void dispose() {
    _input.dispose();
    super.dispose();
  }

  Future<void> _muat() async {
    final hasil = await Db.semua();
    if (!mounted) return;
    setState(() => _data = hasil);
  }

  Future<void> _tambah() async {
    final teks = _input.text.trim();
    if (teks.isEmpty) return;
    await Db.tambah(teks);
    _input.clear();
    await _muat();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Catatan SQLite')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _input,
                    decoration: const InputDecoration(hintText: 'Tulis catatan'),
                  ),
                ),
                IconButton(onPressed: _tambah, icon: const Icon(Icons.add)),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _data.length,
              itemBuilder: (context, i) {
                final baris = _data[i];
                return ListTile(
                  title: Text('${baris['judul']}'),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete),
                    onPressed: () async {
                      await Db.hapus(baris['id'] as int);
                      await _muat();
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}""",
            hasil="Catatan baru muncul di daftar paling atas. Ikon sampah menghapus catatan.",
        ),
        dict(
            judul="Buktikan Data Tersimpan",
            file="Perangkat",
            instr=["Tambahkan tiga catatan.", "Tutup aplikasi sepenuhnya (geser dari daftar aplikasi terbaru).", "Buka lagi aplikasi atau jalankan `flutter run` ulang."],
            kode="flutter run",
            hasil="Tiga catatan masih ada. Itulah data persistence: data hidup di file database, bukan di memori.",
        ),
    ],
    coba=[
        "Tambahkan kolom `isi` (TEXT). Naikkan `version` menjadi 2 dan tulis `onUpgrade` dengan `ALTER TABLE`.",
        "Tambahkan pencarian dengan `where: 'judul LIKE ?'` dan `whereArgs: ['%kata%']`.",
        "Tambahkan fitur ubah catatan memakai `db.update`.",
    ],
    kriteria=["Tabel dibuat otomatis saat pertama dijalankan", "Tambah dan hapus berfungsi", "Data tetap ada setelah aplikasi ditutup", "Database dibuka lewat satu `instance` (singleton)"],
    galat=[
        ("`MissingPluginException`", "Hentikan aplikasi, jalankan `flutter clean`, lalu `flutter run` ulang (jangan hot reload setelah menambah plugin)."),
        ("Berjalan di web gagal", "sqflite tidak mendukung web. Jalankan di Android atau iOS."),
        ("Kolom baru tidak muncul", "Naikkan `version` dan tulis `onUpgrade`, atau hapus data aplikasi saat latihan."),
    ],
)

# ------------------------------------------------------------------ MODUL 4
M[4] = dict(
    file="hari-1-modul-4-lokasi-gps-navigasi.html",
    waktu="45 menit",
    tujuan=["Meminta izin lokasi dengan benar", "Mengambil posisi pengguna", "Menghitung jarak dengan Haversine"],
    hasil_akhir="Halaman yang menampilkan koordinat dan jarak ke titik acuan.",
    persiapan="flutter create latihan_lokasi\ncd latihan_lokasi\nflutter pub add geolocator",
    langkah=[
        dict(
            judul="Izin Android",
            file="android/app/src/main/AndroidManifest.xml",
            instr=["Buka `AndroidManifest.xml`.", "Tambahkan dua izin di dalam `<manifest>`, sebelum `<application>`.", "Simpan."],
            kode="""<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />""",
            hasil="File XML tersimpan tanpa kesalahan format. Tanpa izin ini aplikasi tidak dapat meminta lokasi.",
        ),
        dict(
            judul="Haversine Murni (Tanpa Perangkat)",
            file="haversine.dart (di folder latihan_lokasi)",
            instr=["Buat file `haversine.dart`.", "Salin kode, simpan.", "Jalankan `dart run haversine.dart`."],
            kode="""import 'dart:math';

double _rad(double d) => d * pi / 180;

double jarakMeter(double lat1, double lon1, double lat2, double lon2) {
  const r = 6371000.0;
  final dLat = _rad(lat2 - lat1);
  final dLon = _rad(lon2 - lon1);
  final a = pow(sin(dLat / 2), 2) +
      cos(_rad(lat1)) * cos(_rad(lat2)) * pow(sin(dLon / 2), 2);
  return 2 * r * asin(sqrt(a));
}

void main() {
  // Monas (Jakarta) ke Gedung Sate (Bandung), koordinat perkiraan
  final m = jarakMeter(-6.1754, 106.8272, -6.9025, 107.6186);
  print('${(m / 1000).toStringAsFixed(1)} km');
}""",
            hasil="Keluaran sekitar 119.1 km.",
        ),
        dict(
            judul="Ambil Posisi Pengguna",
            file="lib/main.dart",
            instr=["Ganti seluruh isi `lib/main.dart`.", "Jalankan di emulator atau ponsel.", "Tekan tombol dan setujui dialog izin."],
            kode="""import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

void main() => runApp(const MaterialApp(home: LokasiPage()));

class LokasiPage extends StatefulWidget {
  const LokasiPage({super.key});

  @override
  State<LokasiPage> createState() => _LokasiPageState();
}

class _LokasiPageState extends State<LokasiPage> {
  String _teks = 'Belum ada posisi';

  Future<void> _ambil() async {
    if (!await Geolocator.isLocationServiceEnabled()) {
      setState(() => _teks = 'GPS tidak aktif');
      return;
    }
    var izin = await Geolocator.checkPermission();
    if (izin == LocationPermission.denied) {
      izin = await Geolocator.requestPermission();
    }
    if (izin == LocationPermission.denied ||
        izin == LocationPermission.deniedForever) {
      setState(() => _teks = 'Izin lokasi ditolak');
      return;
    }
    final p = await Geolocator.getCurrentPosition();
    setState(() => _teks = '${p.latitude}, ${p.longitude}');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Lokasi')),
      body: Center(child: Text(_teks, textAlign: TextAlign.center)),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _ambil,
        icon: const Icon(Icons.my_location),
        label: const Text('Ambil lokasi'),
      ),
    );
  }
}""",
            hasil="Koordinat tampil. Di emulator, atur lokasi lewat Extended controls, menu Location.",
        ),
        dict(
            judul="Jarak ke Titik Acuan",
            file="lib/jarak.dart dan lib/main.dart",
            instr=["Salin fungsi `jarakMeter` (tanpa `main`) ke file baru `lib/jarak.dart`.", "Di `main.dart` tambahkan `import 'jarak.dart';`.", "Ganti dua baris terakhir `_ambil` dengan kode di bawah."],
            kode="""    final p = await Geolocator.getCurrentPosition();
    // Titik acuan: Gedung Sate, Bandung (perkiraan)
    final m = jarakMeter(p.latitude, p.longitude, -6.9025, 107.6186);
    setState(() => _teks = 'Jarak ke Gedung Sate: ${(m / 1000).toStringAsFixed(2)} km');""",
            hasil="Jarak tampil dalam km. Bandingkan dengan `Geolocator.distanceBetween(...)`, hasilnya hampir sama.",
        ),
    ],
    coba=[
        "Tampilkan jarak dalam meter bila kurang dari 1 km.",
        "Ganti titik acuan dengan lokasi Graha Pos Bandung.",
        "Gunakan `Geolocator.getPositionStream` untuk memperbarui jarak saat bergerak.",
    ],
    kriteria=["Dialog izin muncul saat pertama kali", "Penolakan izin ditangani dengan pesan jelas", "Jarak Haversine mendekati `distanceBetween`", "Fungsi jarak berada di file terpisah"],
    galat=[
        ("Izin tidak pernah muncul", "Periksa izin di `AndroidManifest.xml`, lalu pasang ulang aplikasi."),
        ("`getCurrentPosition` menggantung", "Aktifkan GPS dan atur lokasi emulator."),
        ("`deniedForever`", "Pengguna harus mengizinkan lewat Pengaturan aplikasi. Buka dengan `Geolocator.openAppSettings()`."),
    ],
)

# ------------------------------------------------------------------ MODUL 5
M[5] = dict(
    file="hari-2-modul-5-mobile-cellular-network.html",
    waktu="30 menit",
    tujuan=["Membaca jenis koneksi aktif", "Memantau perubahan koneksi secara langsung", "Menampilkan peringatan saat offline atau seluler"],
    hasil_akhir="Halaman yang berubah otomatis saat Wi-Fi atau data seluler dimatikan.",
    persiapan="flutter create latihan_jaringan\ncd latihan_jaringan\nflutter pub add connectivity_plus",
    langkah=[
        dict(
            judul="Izin Status Jaringan",
            file="android/app/src/main/AndroidManifest.xml",
            instr=["Buka `AndroidManifest.xml`.", "Tambahkan dua izin sebelum `<application>`.", "Simpan."],
            kode="""<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />""",
            hasil="Aplikasi diizinkan membaca status jaringan.",
        ),
        dict(
            judul="Cek Koneksi Sekali",
            file="lib/main.dart",
            instr=["Ganti seluruh isi `lib/main.dart`.", "Jalankan aplikasi.", "Tekan tombol Periksa."],
            kode="""import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';

String label(List<ConnectivityResult> hasil) {
  if (hasil.isEmpty || hasil.contains(ConnectivityResult.none)) {
    return 'Tidak ada koneksi';
  }
  if (hasil.contains(ConnectivityResult.wifi)) return 'Wi-Fi';
  if (hasil.contains(ConnectivityResult.mobile)) return 'Seluler';
  return 'Lainnya';
}

void main() => runApp(const MaterialApp(home: JaringanPage()));

class JaringanPage extends StatefulWidget {
  const JaringanPage({super.key});

  @override
  State<JaringanPage> createState() => _JaringanPageState();
}

class _JaringanPageState extends State<JaringanPage> {
  String _teks = 'Tekan Periksa';

  Future<void> _periksa() async {
    final hasil = await Connectivity().checkConnectivity();
    setState(() => _teks = label(hasil));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Jaringan')),
      body: Center(
        child: Text(_teks, style: Theme.of(context).textTheme.headlineMedium),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _periksa,
        label: const Text('Periksa'),
      ),
    );
  }
}""",
            hasil="Teks menampilkan Wi-Fi, Seluler, atau Tidak ada koneksi sesuai kondisi saat ditekan.",
        ),
        dict(
            judul="Pantau Perubahan (Stream)",
            file="lib/main.dart (ganti kelas _JaringanPageState)",
            instr=["Tambahkan `import 'dart:async';` di baris paling atas.", "Ganti `_JaringanPageState` dengan kode di bawah.", "Matikan lalu nyalakan Wi-Fi atau mode pesawat, amati teks."],
            kode="""class _JaringanPageState extends State<JaringanPage> {
  List<ConnectivityResult> _hasil = [];
  StreamSubscription<List<ConnectivityResult>>? _langganan;

  @override
  void initState() {
    super.initState();
    Connectivity().checkConnectivity().then((h) {
      if (mounted) setState(() => _hasil = h);
    });
    _langganan = Connectivity().onConnectivityChanged.listen((h) {
      setState(() => _hasil = h);
    });
  }

  @override
  void dispose() {
    _langganan?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Jaringan')),
      body: Center(
        child: Text(
          label(_hasil),
          style: Theme.of(context).textTheme.headlineMedium,
        ),
      ),
    );
  }
}""",
            hasil="Teks berubah sendiri tanpa tombol. `dispose` membatalkan langganan agar tidak bocor.",
        ),
    ],
    coba=[
        "Tampilkan kartu peringatan bila koneksi seluler: unduhan besar sebaiknya menunggu Wi-Fi.",
        "Tampilkan kartu informasi bila tidak ada koneksi: data tersimpan tetap dapat dibuka.",
        "Tambahkan label Ethernet dan VPN pada fungsi `label`.",
    ],
    kriteria=["Label berubah saat Wi-Fi dimatikan", "Langganan stream dibatalkan di `dispose`", "Kondisi offline ditangani dengan pesan ramah", "Peserta tahu bahwa 2G sampai 5G tidak dapat dibaca lewat paket ini"],
    galat=[
        ("Label tidak berubah di emulator", "Ubah koneksi lewat Quick Settings emulator, bukan lewat PC."),
        ("`setState() called after dispose()`", "Batalkan langganan di `dispose` dan periksa `mounted`."),
        ("Hasil berupa daftar, bukan satu nilai", "connectivity_plus versi 6 mengembalikan `List<ConnectivityResult>`."),
    ],
)

# ------------------------------------------------------------------ MODUL 6
M[6] = dict(
    file="hari-2-modul-6-mobile-sensor-spesifikasi.html",
    waktu="45 menit",
    tujuan=["Membaca akselerometer secara langsung", "Mendeteksi guncangan", "Menampilkan spesifikasi perangkat"],
    hasil_akhir="Halaman sensor dengan penghitung guncangan dan halaman info perangkat.",
    persiapan="flutter create latihan_sensor\ncd latihan_sensor\nflutter pub add sensors_plus device_info_plus",
    langkah=[
        dict(
            judul="Baca Akselerometer",
            file="lib/main.dart",
            instr=["Ganti seluruh isi `lib/main.dart`.", "Jalankan di ponsel, atau emulator (Extended controls, Virtual sensors).", "Gerakkan perangkat dan amati x, y, z."],
            kode="""import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';

void main() => runApp(const MaterialApp(home: SensorPage()));

class SensorPage extends StatefulWidget {
  const SensorPage({super.key});

  @override
  State<SensorPage> createState() => _SensorPageState();
}

class _SensorPageState extends State<SensorPage> {
  AccelerometerEvent? _e;
  StreamSubscription<AccelerometerEvent>? _sub;

  @override
  void initState() {
    super.initState();
    _sub = accelerometerEventStream().listen((e) {
      setState(() => _e = e);
    });
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final e = _e;
    return Scaffold(
      appBar: AppBar(title: const Text('Akselerometer')),
      body: Center(
        child: Text(
          e == null
              ? 'Menunggu data'
              : 'x: ${e.x.toStringAsFixed(2)}\\n'
                  'y: ${e.y.toStringAsFixed(2)}\\n'
                  'z: ${e.z.toStringAsFixed(2)}',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
      ),
    );
  }
}""",
            hasil="Saat diam di meja, z mendekati 9,8 (gravitasi). Nilai berubah saat digerakkan.",
        ),
        dict(
            judul="Deteksi Guncangan",
            file="lib/main.dart (ubah listener dan tampilan)",
            instr=["Tambahkan `import 'dart:math';` dan variabel `int _goyang = 0;`.", "Ganti isi `listen` dengan kode di bawah.", "Tampilkan `$_goyang` pada `Text`."],
            kode="""    _sub = accelerometerEventStream().listen((e) {
      final total = sqrt(e.x * e.x + e.y * e.y + e.z * e.z);
      setState(() {
        _e = e;
        if (total > 15) _goyang++;
      });
    });""",
            hasil="Guncangan keras menaikkan penghitung. Ambang 15 m/s² di atas gravitasi (9,8).",
        ),
        dict(
            judul="Info Perangkat",
            file="lib/info.dart (halaman baru)",
            instr=["Buat `lib/info.dart`, tempel kode.", "Di `main.dart` ubah `home` menjadi `const InfoPage()` dan tambahkan `import 'info.dart';`.", "Jalankan di perangkat Android."],
            kode="""import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/material.dart';

class InfoPage extends StatelessWidget {
  const InfoPage({super.key});

  Future<String> _ambil() async {
    final info = await DeviceInfoPlugin().androidInfo;
    return '${info.brand} ${info.model}\\n'
        'Android ${info.version.release} (API ${info.version.sdkInt})';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Info Perangkat')),
      body: Center(
        child: FutureBuilder<String>(
          future: _ambil(),
          builder: (context, snap) {
            if (!snap.hasData) return const CircularProgressIndicator();
            return Text(snap.data!, textAlign: TextAlign.center);
          },
        ),
      ),
    );
  }
}""",
            hasil="Merek, model, dan versi Android perangkat tampil. Kode ini khusus Android.",
        ),
    ],
    coba=[
        "Tambahkan debounce agar satu guncangan hanya dihitung sekali (simpan waktu terakhir dan beri jeda 500 ms).",
        "Tampilkan bar indikator `LinearProgressIndicator` sesuai besar percepatan.",
        "Tambahkan `Platform.isIOS` agar halaman info tidak gagal di iOS.",
    ],
    kriteria=["Nilai x, y, z berubah saat digerakkan", "Langganan sensor dibatalkan di `dispose`", "Penghitung guncangan bekerja", "Info perangkat tampil di Android"],
    galat=[
        ("Nilai tidak berubah di emulator", "Gunakan Extended controls, Virtual sensors, lalu gerakkan perangkat virtual."),
        ("Baterai cepat habis", "Pastikan `cancel()` dipanggil di `dispose`."),
        ("`androidInfo` gagal di iOS", "Gunakan `iosInfo` pada iOS atau periksa `Platform.isAndroid`."),
    ],
)

# ------------------------------------------------------------------ MODUL 7
M[7] = dict(
    file="hari-2-modul-7-keamanan-komunikasi-mobile.html",
    waktu="45 menit",
    tujuan=["Memvalidasi URL agar hanya HTTPS", "Menyimpan token di secure storage", "Memanggil API publik dengan timeout"],
    hasil_akhir="Halaman keamanan: simpan token dan ambil data dari API lewat HTTPS.",
    persiapan="flutter create latihan_aman\ncd latihan_aman\nflutter pub add http flutter_secure_storage",
    langkah=[
        dict(
            judul="Validasi URL (Tanpa Perangkat)",
            file="url_check.dart (di folder latihan_aman)",
            instr=["Buat file `url_check.dart`.", "Salin kode, simpan.", "Jalankan `dart run url_check.dart`."],
            kode="""/// Mengembalikan pesan error jika URL tidak aman, atau null jika aman.
String? periksaUrlAman(String url) {
  final uri = Uri.tryParse(url.trim());
  if (uri == null || !uri.hasAuthority) {
    return 'URL tidak valid.';
  }
  if (uri.scheme != 'https') {
    return 'Gunakan HTTPS (https://).';
  }
  return null;
}

void main() {
  for (final u in ['https://contoh.test/a', 'http://contoh.test/a', 'bukan url']) {
    print('$u -> ${periksaUrlAman(u) ?? 'aman'}');
  }
}""",
            hasil="https diterima (aman), http ditolak dengan pesan HTTPS, teks bebas dianggap tidak valid.",
        ),
        dict(
            judul="Simpan Token di Secure Storage",
            file="lib/main.dart",
            instr=["Ganti seluruh isi `lib/main.dart`.", "Jalankan di emulator atau ponsel.", "Isi token, tekan Simpan, lalu tutup dan buka aplikasi."],
            kode="""import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

void main() => runApp(const MaterialApp(home: TokenPage()));

class TokenPage extends StatefulWidget {
  const TokenPage({super.key});

  @override
  State<TokenPage> createState() => _TokenPageState();
}

class _TokenPageState extends State<TokenPage> {
  static const _storage = FlutterSecureStorage();
  final _input = TextEditingController();
  String _tersimpan = '(belum ada)';

  @override
  void initState() {
    super.initState();
    _muat();
  }

  @override
  void dispose() {
    _input.dispose();
    super.dispose();
  }

  String _samarkan(String t) =>
      t.length <= 4 ? '****' : '${t.substring(0, 2)}****${t.substring(t.length - 2)}';

  Future<void> _muat() async {
    final t = await _storage.read(key: 'token');
    if (!mounted) return;
    setState(() => _tersimpan = t == null ? '(belum ada)' : _samarkan(t));
  }

  Future<void> _simpan() async {
    await _storage.write(key: 'token', value: _input.text.trim());
    _input.clear();
    await _muat();
  }

  Future<void> _hapus() async {
    await _storage.delete(key: 'token');
    await _muat();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Token Aman')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _input,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Token',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                FilledButton(onPressed: _simpan, child: const Text('Simpan')),
                const SizedBox(width: 12),
                OutlinedButton(onPressed: _hapus, child: const Text('Hapus')),
              ],
            ),
            const SizedBox(height: 24),
            Text('Tersimpan: $_tersimpan'),
          ],
        ),
      ),
    );
  }
}""",
            hasil="Token tampil tersamar (misalnya ab****yz) dan tetap ada setelah aplikasi dibuka ulang.",
        ),
        dict(
            judul="Panggil API Lewat HTTPS",
            file="lib/api.dart (halaman baru)",
            instr=["Buat `lib/api.dart`, tempel kode.", "Ubah `home` di `main.dart` menjadi `const ApiPage()` dan tambahkan `import 'api.dart';`.", "Jalankan, tekan Ambil data. Matikan internet untuk melihat pesan galat."],
            kode="""import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class ApiPage extends StatefulWidget {
  const ApiPage({super.key});

  @override
  State<ApiPage> createState() => _ApiPageState();
}

class _ApiPageState extends State<ApiPage> {
  String _hasil = 'Tekan Ambil data';

  Future<void> _ambil() async {
    setState(() => _hasil = 'Memuat...');
    try {
      final res = await http
          .get(Uri.parse('https://jsonplaceholder.typicode.com/posts/1'))
          .timeout(const Duration(seconds: 10));
      if (res.statusCode != 200) {
        throw Exception('Status ${res.statusCode}');
      }
      final data = jsonDecode(res.body) as Map<String, dynamic>;
      setState(() => _hasil = '${data['title']}');
    } catch (e) {
      setState(() => _hasil = 'Gagal: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('API HTTPS')),
      body: Center(child: Padding(padding: const EdgeInsets.all(16), child: Text(_hasil))),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _ambil,
        label: const Text('Ambil data'),
      ),
    );
  }
}""",
            hasil="Judul post dari JSONPlaceholder tampil. Tanpa internet muncul pesan Gagal, bukan aplikasi menggantung.",
        ),
    ],
    coba=[
        "Panggil `periksaUrlAman` sebelum `http.get` dan tolak URL non-HTTPS.",
        "Tambahkan tombol konfirmasi sebelum menghapus token.",
        "Tampilkan pesan khusus bila terjadi `TimeoutException`.",
    ],
    kriteria=["URL http ditolak sebelum dikirim", "Token tersimpan dan tersamar di layar", "Permintaan memakai timeout", "Kegagalan jaringan ditangani tanpa crash"],
    galat=[
        ("Gagal di rilis, normal di debug", "Pastikan izin `INTERNET` ada di `AndroidManifest.xml`."),
        ("`PlatformException` saat membaca storage", "Hapus data aplikasi lalu jalankan ulang, atau gunakan perangkat Android 6 ke atas."),
        ("Timeout terus-menerus", "Periksa koneksi dan pastikan alamat API benar."),
    ],
)

# ------------------------------------------------------------------ MODUL 8
M[8] = dict(
    file="hari-2-modul-8-latihan-uji-kompetensi.html",
    waktu="45 menit",
    tujuan=["Mengerjakan tugas praktik pada proyek `app/`", "Menulis unit test tambahan", "Menjawab soal teori dengan pola jawaban yang jelas"],
    hasil_akhir="Tiga tugas praktik selesai dan semua tes lulus.",
    persiapan="cd app\nflutter pub get\nflutter test",
    langkah=[
        dict(
            judul="Tugas 1: Format Versi Android",
            file="lib/pages/device_page.dart",
            instr=["Cari baris `'Versi Android'`.", "Ubah menjadi format `Android 14 (API 34)`.", "Jalankan halaman perangkat dan baca hasilnya."],
            kode="""        'Versi Android':
            'Android ${info.version.release} (API ${info.version.sdkInt})',""",
            hasil="Tampil misalnya Android 14 (API 34), sesuai versi perangkat.",
        ),
        dict(
            judul="Tugas 2: Unit Test Tambahan",
            file="test/https_service_test.dart",
            instr=["Buka berkas tes.", "Tambahkan dua tes di dalam `main()`.", "Jalankan `flutter test test/https_service_test.dart`."],
            kode="""  test('URL dengan skema ftp ditolak', () {
    expect(periksaUrlAman('ftp://contoh.test/data'), 'Gunakan HTTPS (https://).');
  });

  test('URL https dengan spasi di tepi tetap diterima', () {
    expect(periksaUrlAman('  https://contoh.test/data  '), isNull);
  });""",
            hasil="Semua tes lulus (All tests passed).",
        ),
        dict(
            judul="Tugas 3: Konfirmasi Hapus Token",
            file="lib/pages/keamanan_page.dart",
            instr=["Ganti method `_hapus` dengan kode di bawah.", "Jalankan halaman keamanan.", "Tekan Hapus: dialog konfirmasi harus muncul."],
            kode="""  Future<void> _hapus() async {
    final yakin = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Hapus token?'),
        content: const Text('Token akan dihapus dari secure storage.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Batal'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Hapus'),
          ),
        ],
      ),
    );
    if (yakin != true || !mounted) return;
    await _storage.hapusToken();
    await _muatToken();
    _pesan('Token dihapus.');
  }""",
            hasil="Dialog muncul. Batal tidak menghapus, Hapus menghapus token dan menampilkan pesan.",
        ),
    ],
    coba=[
        "Tampilkan peringatan di halaman jaringan bila koneksi seluler (periksa dulu, kodenya sudah ada di `network_page.dart`).",
        "Tambahkan tes untuk `labelJaringan` dengan `ConnectivityResult.ethernet`.",
        "Validasi judul catatan agar tidak boleh hanya spasi (periksa `trim()` pada `note_form_page.dart`).",
    ],
    kriteria=["Tiga tugas praktik berjalan", "`flutter test` lulus seluruhnya", "`flutter analyze` tanpa peringatan baru", "Rencana belajar mandiri terisi"],
    galat=[
        ("Tes gagal: `Expected ... Actual ...`", "Baca kedua nilai, samakan teks pesan persis, termasuk titik di akhir."),
        ("`use_build_context_synchronously`", "Periksa `mounted` sebelum memakai `context` setelah `await`."),
        ("Berkas tes tidak ditemukan", "Pastikan menjalankan perintah dari folder `app/`."),
    ],
    teori=[
        ("Perbedaan 4G dan 5G", "5G lebih cepat, latensinya jauh lebih rendah, dan kapasitas perangkat per area lebih besar."),
        ("Fungsi handover", "Memindahkan sesi pengguna ke menara lain saat bergerak, tanpa memutus koneksi."),
        ("Autentikasi vs otorisasi", "Autentikasi memastikan siapa pengguna. Otorisasi menentukan apa yang boleh ia lakukan."),
        ("Peran TLS", "Mengenkripsi data, memverifikasi identitas server, dan menjaga data tidak diubah di jalan."),
    ],
)
