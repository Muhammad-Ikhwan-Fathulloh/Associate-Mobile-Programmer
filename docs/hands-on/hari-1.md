# Hands-On Hari 1: Dasar Flutter, Database Lokal, dan Lokasi

Panduan ini membangun aplikasi `associate_mobile_app` dari awal. Setiap step menampilkan kode lengkap untuk file yang dibuat atau diubah, sehingga peserta dapat mengetik kode sendiri sambil mengikuti langkahnya.

**Waktu:** 09.00 to 17.00 (istirahat 12.00 to 13.00)

**Perangkat:** laptop dengan Flutter SDK, Android Studio, dan emulator Android atau perangkat Android fisik.

---

## Step 0: Cek Lingkungan (09.00)

```bash
flutter doctor
flutter devices
```

Pastikan bagian *Flutter* dan *Android toolchain* tidak menampilkan tanda silang. Pastikan emulator atau perangkat Android muncul pada `flutter devices`.

---

## Step 1: Buat Proyek dan Konfigurasi Dependensi (09.15)

Buat proyek baru:

```bash
flutter create --org id.ac.associate associate_mobile_app
cd associate_mobile_app
rm test/widget_test.dart
```

Ganti isi `pubspec.yaml` dengan kode berikut. Dependensi Hari 2 juga dimasukkan sekarang agar tidak perlu mengubah file ini lagi.

```yaml
name: associate_mobile_app
description: Aplikasi contoh pelatihan Associate Mobile Programmer dengan Flutter.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: ^3.4.0

dependencies:
  flutter:
    sdk: flutter
  flutter_bloc: ^9.1.1      # Hari 2: state management Cubit
  equatable: ^2.0.5         # Hari 2: perbandingan state
  go_router: ^14.2.0        # Hari 1: navigasi
  sqflite: ^2.3.3           # Hari 1: database SQLite lokal
  path: ^1.9.0
  geolocator: ^13.0.1       # Hari 1: GPS dan izin lokasi
  flutter_map: ^7.0.2       # Hari 1: peta OpenStreetMap (tanpa API key)
  latlong2: ^0.9.1
  http: ^1.2.2              # Hari 1 dan 2: request ke API publik

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
  bloc_test: ^9.1.7

flutter:
  uses-material-design: true
```

Ganti isi `analysis_options.yaml` dengan kode berikut:

```yaml
include: package:flutter_lints/flutter_lints.yaml
```

Unduh dependensi:

```bash
flutter pub get
```

**Checkpoint:** `flutter pub get` selesai tanpa error.

---

## Step 2: Titik Masuk Aplikasi (09.35)

Buat file `lib/main.dart` (ganti isi yang sudah ada):

```dart
import 'package:flutter/material.dart';

import 'app.dart';

void main() {
  runApp(const AssociateMobileApp());
}
```

Buat file `lib/app.dart`:

```dart
import 'package:flutter/material.dart';

import 'router/app_router.dart';

class AssociateMobileApp extends StatelessWidget {
  const AssociateMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Associate Mobile Programmer',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      darkTheme: ThemeData(
        colorSchemeSeed: Colors.indigo,
        useMaterial3: true,
        brightness: Brightness.dark,
      ),
      routerConfig: appRouter,
    );
  }
}
```

Penjelasan: `MaterialApp.router` digunakan karena navigasi dikelola oleh `go_router`. `ThemeData` dengan `colorSchemeSeed` membuat seluruh palet warna Material 3 dari satu warna dasar.

---

## Step 3: Izin Lokasi (09.50)

### Android

Buka `android/app/src/main/AndroidManifest.xml`. Tambahkan tiga baris berikut di dalam tag `<manifest>`, tepat sebelum tag `<application>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### iOS (hanya pada Mac)

Buka `ios/Runner/Info.plist`. Tambahkan dua baris berikut di dalam tag `<dict>`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Lokasi digunakan untuk menampilkan posisi Anda pada peta dan catatan.</string>
```

**Checkpoint:** file XML tersimpan tanpa kesalahan format.

---

## Step 4: Router dan Halaman Beranda (10.05)

Buat file `lib/router/app_router.dart`. Pada Hari 1, router hanya memuat route untuk catatan dan lokasi. Route post ditambahkan pada Hari 2 Step 4.

```dart
import 'package:go_router/go_router.dart';

import '../pages/home_page.dart';
import '../pages/location_page.dart';
import '../pages/note_form_page.dart';
import '../pages/notes_page.dart';

final GoRouter appRouter = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/catatan',
      builder: (context, state) => const NotesPage(),
    ),
    GoRoute(
      path: '/catatan/baru',
      builder: (context, state) => const NoteFormPage(),
    ),
    GoRoute(
      path: '/lokasi',
      builder: (context, state) => const LocationPage(),
    ),
  ],
);
```

Buat file `lib/pages/home_page.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  static const _menu = [
    _MenuItem(
      judul: 'Catatan Lokal',
      deskripsi: 'CRUD dengan SQLite (sqflite) dan jarak dari lokasi saya',
      ikon: Icons.note_alt_outlined,
      rute: '/catatan',
    ),
    _MenuItem(
      judul: 'Lokasi dan Peta',
      deskripsi: 'GPS, peta OpenStreetMap, dan alamat dari koordinat',
      ikon: Icons.map_outlined,
      rute: '/lokasi',
    ),
    _MenuItem(
      judul: 'Daftar Post API',
      deskripsi: 'REST API publik JSONPlaceholder dengan Cubit',
      ikon: Icons.cloud_outlined,
      rute: '/post',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Associate Mobile Programmer')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _menu.length,
        separatorBuilder: (_, __) => const SizedBox(height: 8),
        itemBuilder: (context, index) {
          final item = _menu[index];
          return Card(
            child: ListTile(
              leading: Icon(item.ikon),
              title: Text(item.judul),
              subtitle: Text(item.deskripsi),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.push(item.rute),
            ),
          );
        },
      ),
    );
  }
}

class _MenuItem {
  const _MenuItem({
    required this.judul,
    required this.deskripsi,
    required this.ikon,
    required this.rute,
  });

  final String judul;
  final String deskripsi;
  final IconData ikon;
  final String rute;
}
```

Menu *Daftar Post API* akan berfungsi setelah Hari 2 Step 4.

Jalankan aplikasi:

```bash
flutter run
```

**Checkpoint:** layar beranda tampil dengan tiga menu. Tekan menu *Catatan Lokal* dan pastikan halaman kosong dengan pesan "Belum ada catatan" muncul (halaman ini dibuat pada Step 7).

---

## Step 5: Model Data Catatan (10.30)

Buat file `lib/models/note.dart`:

```dart
class Note {
  const Note({
    this.id,
    required this.title,
    required this.content,
    this.latitude,
    this.longitude,
    required this.updatedAt,
    this.syncStatus = 'PENDING',
  });

  /// Membuat catatan baru dengan waktu saat ini.
  factory Note.baru({
    required String title,
    required String content,
    double? latitude,
    double? longitude,
  }) {
    return Note(
      title: title,
      content: content,
      latitude: latitude,
      longitude: longitude,
      updatedAt: DateTime.now().millisecondsSinceEpoch,
    );
  }

  final int? id;
  final String title;
  final String content;
  final double? latitude;
  final double? longitude;
  final int updatedAt;
  final String syncStatus;

  Map<String, Object?> toMap() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'latitude': latitude,
      'longitude': longitude,
      'updated_at': updatedAt,
      'sync_status': syncStatus,
    };
  }

  factory Note.fromMap(Map<String, Object?> map) {
    return Note(
      id: map['id'] as int?,
      title: map['title'] as String,
      content: map['content'] as String,
      latitude: (map['latitude'] as num?)?.toDouble(),
      longitude: (map['longitude'] as num?)?.toDouble(),
      updatedAt: map['updated_at'] as int,
      syncStatus: map['sync_status'] as String,
    );
  }
}
```

Penjelasan:
- `Note.baru` adalah factory yang mengisi `updatedAt` dengan waktu saat ini.
- `toMap` mengubah object menjadi `Map` untuk disimpan ke SQLite.
- `fromMap` melakukan kebalikannya. Nilai `REAL` dari SQLite dibaca sebagai `num` lalu diubah ke `double`.

---

## Step 6: Database SQLite (10.50)

Buat file `lib/data/app_database.dart`:

```dart
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

/// Pengelola koneksi SQLite. Database dibuat sekali lalu digunakan ulang.
class AppDatabase {
  static const _namaDatabase = 'associate_mobile.db';
  static const _versi = 1;

  static Database? _database;

  static Future<Database> get instance async {
    final existing = _database;
    if (existing != null) return existing;

    final path = join(await getDatabasesPath(), _namaDatabase);
    final db = await openDatabase(
      path,
      version: _versi,
      onConfigure: (db) async {
        await db.execute('PRAGMA foreign_keys = ON');
      },
      onCreate: _buatTabel,
    );
    _database = db;
    return db;
  }

  static Future<void> _buatTabel(Database db, int version) async {
    await db.execute('''
      CREATE TABLE notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        updated_at INTEGER NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'PENDING'
      )
    ''');
    await db.execute('CREATE INDEX idx_notes_updated_at ON notes(updated_at)');
  }
}
```

Penjelasan:
- `_database` menyimpan koneksi agar database tidak dibuka berulang kali.
- `onCreate` hanya dipanggil saat database pertama kali dibuat. Jika skema berubah di masa depan, nomor `_versi` dinaikkan dan `onUpgrade` ditambahkan.
- Indeks pada `updated_at` mempercepat pengurutan daftar catatan.

---

## Step 7: Repository dan Controller (11.05)

Buat file `lib/data/note_repository.dart`:

```dart
import 'package:sqflite/sqflite.dart';

import '../models/note.dart';
import 'app_database.dart';

/// Operasi CRUD untuk tabel notes.
class NoteRepository {
  Future<List<Note>> ambilSemua() async {
    final db = await AppDatabase.instance;
    final rows = await db.query('notes', orderBy: 'updated_at DESC');
    return rows.map(Note.fromMap).toList();
  }

  Future<int> simpan(Note note) async {
    final db = await AppDatabase.instance;
    final values = note.toMap()..remove('id');
    return db.insert('notes', values);
  }

  Future<int> ubah(Note note) async {
    final db = await AppDatabase.instance;
    return db.update(
      'notes',
      note.toMap(),
      where: 'id = ?',
      whereArgs: [note.id],
    );
  }

  Future<int> hapus(int id) async {
    final db = await AppDatabase.instance;
    return db.delete('notes', where: 'id = ?', whereArgs: [id]);
  }
}
```

Buat file `lib/blocs/note_controller.dart`:

```dart
import 'package:flutter/foundation.dart';

import '../data/note_repository.dart';
import '../models/note.dart';

/// State catatan untuk Hari 1 menggunakan ChangeNotifier.
class NoteController extends ChangeNotifier {
  NoteController({NoteRepository? repository})
      : _repository = repository ?? NoteRepository();

  final NoteRepository _repository;
  List<Note> _notes = const [];
  bool _isLoading = false;
  String? _error;

  List<Note> get notes => _notes;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> load() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _notes = await _repository.ambilSemua();
    } catch (e) {
      _error = 'Gagal memuat catatan: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> tambah(Note note) async {
    await _repository.simpan(note);
    await load();
  }

  Future<void> hapus(int id) async {
    await _repository.hapus(id);
    await load();
  }
}
```

Penjelasan alur data: UI memanggil `NoteController`, controller memanggil `NoteRepository`, dan repository menjalankan SQL melalui `AppDatabase`. Setiap perubahan data diikuti `load()` agar daftar selalu sesuai database. `notifyListeners()` memberi tahu UI untuk membangun ulang tampilan.

---

## Step 8: Halaman Catatan dan Form (11.30)

Buat file `lib/pages/notes_page.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';

import '../blocs/note_controller.dart';
import '../models/note.dart';
import '../services/distance.dart';
import '../services/location_service.dart';

class NotesPage extends StatefulWidget {
  const NotesPage({super.key});

  @override
  State<NotesPage> createState() => _NotesPageState();
}

class _NotesPageState extends State<NotesPage> {
  final _controller = NoteController();
  final _location = LocationService();
  Position? _posisi;

  @override
  void initState() {
    super.initState();
    _controller.load();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _perbaruiPosisi() async {
    try {
      final posisi = await _location.ambilPosisi();
      if (!mounted) return;
      setState(() => _posisi = posisi);
    } on LocationException catch (e) {
      _tampilkanPesan(e.pesan);
    } catch (e) {
      _tampilkanPesan('Gagal mengambil posisi: $e');
    }
  }

  void _tampilkanPesan(String pesan) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(pesan)));
  }

  Future<void> _tambahCatatan() async {
    final catatan = await context.push<Note>('/catatan/baru');
    if (catatan == null || !mounted) return;
    await _controller.tambah(catatan);
  }

  String _keterangan(Note note) {
    final baris = <String>[note.content];
    final lat = note.latitude;
    final lon = note.longitude;

    if (lat != null && lon != null) {
      baris.add('Koordinat: ${lat.toStringAsFixed(5)}, ${lon.toStringAsFixed(5)}');
      final posisi = _posisi;
      if (posisi != null) {
        final meter = jarakMeter(posisi.latitude, posisi.longitude, lat, lon);
        baris.add('Jarak: ${_formatJarak(meter)}');
      }
    }
    return baris.join('\n');
  }

  String _formatJarak(double meter) {
    return meter < 1000
        ? '${meter.round()} m'
        : '${(meter / 1000).toStringAsFixed(2)} km';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Catatan Lokal'),
        actions: [
          IconButton(
            tooltip: 'Perbarui posisi saya',
            icon: const Icon(Icons.my_location),
            onPressed: _perbaruiPosisi,
          ),
        ],
      ),
      body: ListenableBuilder(
        listenable: _controller,
        builder: (context, _) {
          if (_controller.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (_controller.error != null) {
            return Center(child: Text(_controller.error!));
          }
          if (_controller.notes.isEmpty) {
            return const Center(
              child: Text('Belum ada catatan. Tekan tombol + untuk menambah.'),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: _controller.notes.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final note = _controller.notes[index];
              return Card(
                child: ListTile(
                  title: Text(note.title),
                  subtitle: Text(_keterangan(note)),
                  trailing: IconButton(
                    tooltip: 'Hapus',
                    icon: const Icon(Icons.delete_outline),
                    onPressed: () => _controller.hapus(note.id!),
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Tambah catatan',
        onPressed: _tambahCatatan,
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

Buat file `lib/pages/note_form_page.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../models/note.dart';
import '../services/location_service.dart';

class NoteFormPage extends StatefulWidget {
  const NoteFormPage({super.key});

  @override
  State<NoteFormPage> createState() => _NoteFormPageState();
}

class _NoteFormPageState extends State<NoteFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _judul = TextEditingController();
  final _isi = TextEditingController();
  final _location = LocationService();

  double? _latitude;
  double? _longitude;
  bool _mengambilLokasi = false;

  @override
  void dispose() {
    _judul.dispose();
    _isi.dispose();
    super.dispose();
  }

  Future<void> _ambilLokasi() async {
    setState(() => _mengambilLokasi = true);
    try {
      final posisi = await _location.ambilPosisi();
      if (!mounted) return;
      setState(() {
        _latitude = posisi.latitude;
        _longitude = posisi.longitude;
      });
    } on LocationException catch (e) {
      _tampilkanPesan(e.pesan);
    } catch (e) {
      _tampilkanPesan('Gagal mengambil lokasi: $e');
    } finally {
      if (mounted) setState(() => _mengambilLokasi = false);
    }
  }

  void _tampilkanPesan(String pesan) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(pesan)));
  }

  void _simpan() {
    if (!_formKey.currentState!.validate()) return;

    context.pop(
      Note.baru(
        title: _judul.text.trim(),
        content: _isi.text.trim(),
        latitude: _latitude,
        longitude: _longitude,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final lat = _latitude;
    final lon = _longitude;

    return Scaffold(
      appBar: AppBar(title: const Text('Catatan Baru')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _judul,
              decoration: const InputDecoration(
                labelText: 'Judul',
                border: OutlineInputBorder(),
              ),
              validator: (value) => (value == null || value.trim().length < 3)
                  ? 'Judul minimal 3 karakter'
                  : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _isi,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: 'Isi catatan',
                border: OutlineInputBorder(),
              ),
              validator: (value) => (value == null || value.trim().isEmpty)
                  ? 'Isi catatan tidak boleh kosong'
                  : null,
            ),
            const SizedBox(height: 12),
            Card(
              child: ListTile(
                leading: const Icon(Icons.place_outlined),
                title: Text(
                  lat == null || lon == null
                      ? 'Lokasi belum diambil (opsional)'
                      : 'Lokasi: ${lat.toStringAsFixed(5)}, ${lon.toStringAsFixed(5)}',
                ),
              ),
            ),
            const SizedBox(height: 8),
            OutlinedButton.icon(
              onPressed: _mengambilLokasi ? null : _ambilLokasi,
              icon: const Icon(Icons.my_location),
              label: Text(
                _mengambilLokasi ? 'Mengambil lokasi...' : 'Ambil lokasi saat ini',
              ),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _simpan,
              child: const Text('Simpan'),
            ),
          ],
        ),
      ),
    );
  }
}
```

Penjelasan alur simpan: form mengembalikan object `Note` melalui `context.pop`. Halaman daftar menerima hasilnya di `context.push<Note>` lalu memanggil `tambah`. Dengan cara ini, form tidak perlu mengetahui database.

Jalankan aplikasi, lalu uji:
1. Tambahkan dua catatan dengan judul minimal tiga karakter.
2. Hapus satu catatan.
3. Tutup aplikasi sepenuhnya, buka kembali, dan pastikan catatan masih ada.

**Checkpoint:** catatan tetap ada setelah aplikasi ditutup dan dibuka kembali.

---

## Step 9: Layanan Lokasi dan Jarak (13.00)

Buat file `lib/services/location_service.dart`:

```dart
import 'dart:convert';

import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;

class LocationException implements Exception {
  const LocationException(this.pesan);

  final String pesan;

  @override
  String toString() => pesan;
}

class LocationService {
  /// Nominatim mewajibkan User-Agent yang mengidentifikasi aplikasi.
  /// Ganti dengan nama aplikasi dan kontak Anda.
  static const _userAgent = 'AssociateMobileApp/1.0 (pelatihan; ganti dengan kontak Anda)';

  /// Memeriksa layanan lokasi dan meminta izin jika belum diberikan.
  Future<bool> pastikanIzin() async {
    if (!await Geolocator.isLocationServiceEnabled()) return false;

    var izin = await Geolocator.checkPermission();
    if (izin == LocationPermission.denied) {
      izin = await Geolocator.requestPermission();
    }
    return izin == LocationPermission.whileInUse ||
        izin == LocationPermission.always;
  }

  /// Mengambil posisi satu kali dengan akurasi tinggi.
  Future<Position> ambilPosisi() async {
    final diizinkan = await pastikanIzin();
    if (!diizinkan) {
      throw const LocationException(
        'Izin lokasi belum diberikan atau layanan lokasi nonaktif.',
      );
    }
    return Geolocator.getCurrentPosition(
      locationSettings: LocationSettings(accuracy: LocationAccuracy.high),
    );
  }

  /// Stream posisi. Data dikirim setiap perangkat berpindah sejauh [jarakMinimalMeter].
  Stream<Position> pantauPosisi({int jarakMinimalMeter = 5}) {
    return Geolocator.getPositionStream(
      locationSettings: LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: jarakMinimalMeter,
      ),
    );
  }

  /// Mengubah koordinat menjadi alamat (reverse geocoding) memakai Nominatim.
  /// Batas penggunaan: maksimal sekitar 1 permintaan per detik.
  Future<String?> alamatDari(double latitude, double longitude) async {
    final uri = Uri.https(
      'nominatim.openstreetmap.org',
      '/reverse',
      {
        'format': 'jsonv2',
        'lat': latitude.toString(),
        'lon': longitude.toString(),
      },
    );
    final response = await http
        .get(uri, headers: {'User-Agent': _userAgent, 'Accept-Language': 'id'})
        .timeout(const Duration(seconds: 10));

    if (response.statusCode != 200) return null;

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    return data['display_name'] as String?;
  }
}
```

Buat file `lib/services/distance.dart`:

```dart
import 'dart:math';

const double _jariJariBumiMeter = 6371000;

double _keRadian(double derajat) => derajat * pi / 180;

/// Jarak lingkaran besar (Haversine) antara dua koordinat, dalam meter.
double jarakMeter(double lat1, double lon1, double lat2, double lon2) {
  final dLat = _keRadian(lat2 - lat1);
  final dLon = _keRadian(lon2 - lon1);

  final sinLat = sin(dLat / 2);
  final sinLon = sin(dLon / 2);

  final a = sinLat * sinLat +
      cos(_keRadian(lat1)) * cos(_keRadian(lat2)) * sinLon * sinLon;

  return 2 * _jariJariBumiMeter * asin(sqrt(a));
}
```

Penjelasan:
- `pastikanIzin` memeriksa layanan lokasi lebih dulu, lalu izin. Izin yang ditolak tidak boleh diabaikan begitu saja.
- `LocationException` membawa pesan yang bisa langsung ditampilkan ke pengguna.
- `pantauPosisi` tidak dipakai di halaman Hari 1 dan disiapkan untuk latihan.
- Rumus Haversine menghitung jarak di permukaan bola. Untuk jarak dalam kota, hasilnya sangat dekat dengan jarak sebenarnya.

Di halaman *Catatan Lokal*, tekan ikon lokasi di AppBar. Jika izin diberikan, setiap catatan yang memiliki koordinat menampilkan jaraknya.

**Checkpoint:** izin lokasi diminta, dan jarak tampil setelah posisi diperoleh.

---

## Step 10: Peta dan Alamat (14.00)

Buat file `lib/pages/location_page.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';

import '../services/location_service.dart';

class LocationPage extends StatefulWidget {
  const LocationPage({super.key});

  @override
  State<LocationPage> createState() => _LocationPageState();
}

class _LocationPageState extends State<LocationPage> {
  // Pusat awal peta: Bandung
  static const _pusatAwal = LatLng(-6.9175, 107.6191);

  final _service = LocationService();
  final _mapController = MapController();

  Position? _posisi;
  String? _alamat;
  String? _error;
  bool _memuat = false;

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }

  Future<void> _perbaruiPosisi() async {
    setState(() {
      _memuat = true;
      _error = null;
    });
    try {
      final posisi = await _service.ambilPosisi();
      final alamat = await _service.alamatDari(posisi.latitude, posisi.longitude);
      if (!mounted) return;

      setState(() {
        _posisi = posisi;
        _alamat = alamat;
      });
      _mapController.move(LatLng(posisi.latitude, posisi.longitude), 16);
    } on LocationException catch (e) {
      if (mounted) setState(() => _error = e.pesan);
    } catch (e) {
      if (mounted) setState(() => _error = 'Gagal memuat posisi: $e');
    } finally {
      if (mounted) setState(() => _memuat = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final posisi = _posisi;

    return Scaffold(
      appBar: AppBar(title: const Text('Lokasi dan Peta')),
      body: Column(
        children: [
          Expanded(
            child: FlutterMap(
              mapController: _mapController,
              options: const MapOptions(
                initialCenter: _pusatAwal,
                initialZoom: 13,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'id.ac.associate.mobile',
                ),
                if (posisi != null)
                  MarkerLayer(
                    markers: [
                      Marker(
                        point: LatLng(posisi.latitude, posisi.longitude),
                        width: 40,
                        height: 40,
                        child: const Icon(
                          Icons.location_on,
                          color: Colors.red,
                          size: 40,
                        ),
                      ),
                    ],
                  ),
                const RichAttributionWidget(
                  attributions: [
                    TextSourceAttribution('OpenStreetMap contributors'),
                  ],
                ),
              ],
            ),
          ),
          Material(
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (_error != null)
                    Text(
                      _error!,
                      style: TextStyle(color: Theme.of(context).colorScheme.error),
                    ),
                  if (posisi != null) ...[
                    Text(
                      'Lat: ${posisi.latitude.toStringAsFixed(6)}, '
                      'Lon: ${posisi.longitude.toStringAsFixed(6)}\n'
                      'Akurasi: ${posisi.accuracy.toStringAsFixed(1)} meter',
                      textAlign: TextAlign.center,
                    ),
                    if (_alamat != null) ...[
                      const SizedBox(height: 8),
                      Text(
                        _alamat!,
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                    const SizedBox(height: 12),
                  ],
                  FilledButton.icon(
                    onPressed: _memuat ? null : _perbaruiPosisi,
                    icon: const Icon(Icons.my_location),
                    label: Text(_memuat ? 'Memuat...' : 'Perbarui posisi'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
```

Penjelasan:
- `FlutterMap` dengan `TileLayer` mengambil gambar peta dari OpenStreetMap. Tidak diperlukan API key.
- `RichAttributionWidget` wajib dicantumkan sesuai kebijakan OpenStreetMap.
- `MapController.move` menggeser peta ke posisi pengguna setelah posisi diperoleh.
- `alamatDari` mengubah koordinat menjadi alamat dengan Nominatim.

Jalankan aplikasi, buka menu *Lokasi dan Peta*, lalu tekan **Perbarui posisi**. Peta berpindah ke posisi Anda dan alamat tampil di bawah.

**Checkpoint:** marker dan alamat tampil. Jika alamat tidak muncul, periksa koneksi internet.

---

## Step 11: Pengujian Hari 1 (14.30)

Buat file `test/distance_test.dart`:

```dart
import 'package:associate_mobile_app/services/distance.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('jarakMeter', () {
    test('titik yang sama menghasilkan nol', () {
      expect(jarakMeter(-6.9175, 107.6191, -6.9175, 107.6191), closeTo(0, 0.001));
    });

    test('jarak Jakarta ke Bandung sekitar 120 km', () {
      final km = jarakMeter(-6.2088, 106.8456, -6.9175, 107.6191) / 1000;
      expect(km, closeTo(120, 10));
    });

    test('jarak tidak bergantung pada urutan titik', () {
      final a = jarakMeter(-6.2, 106.8, -6.9, 107.6);
      final b = jarakMeter(-6.9, 107.6, -6.2, 106.8);
      expect(a, closeTo(b, 0.001));
    });
  });
}
```

Jalankan:

```bash
flutter test test/distance_test.dart
```

**Checkpoint:** ketiga test lulus.

---

## Latihan Mandiri (15.00)

1. Tambahkan properti `kategori` bertipe `String?` pada model `Note`, lalu sertakan di `toMap` dan `fromMap`. Ubah `CREATE TABLE` pada `AppDatabase` dengan menaikkan `_versi` dan menambahkan `onUpgrade`.
2. Urutkan daftar catatan dari yang terdekat ke yang terjauh berdasarkan jarak dari posisi pengguna.
3. Pada halaman *Lokasi dan Peta*, gunakan `LocationService.pantauPosisi` agar marker bergerak mengikuti pengguna.

---

## Ringkasan File

| Step | File |
|---|---|
| 1 | `pubspec.yaml`, `analysis_options.yaml` |
| 2 | `lib/main.dart`, `lib/app.dart` |
| 3 | `AndroidManifest.xml`, `Info.plist` |
| 4 | `lib/router/app_router.dart`, `lib/pages/home_page.dart` |
| 5 | `lib/models/note.dart` |
| 6 | `lib/data/app_database.dart` |
| 7 | `lib/data/note_repository.dart`, `lib/blocs/note_controller.dart` |
| 8 | `lib/pages/notes_page.dart`, `lib/pages/note_form_page.dart` |
| 9 | `lib/services/location_service.dart`, `lib/services/distance.dart` |
| 10 | `lib/pages/location_page.dart` |
| 11 | `test/distance_test.dart` |
