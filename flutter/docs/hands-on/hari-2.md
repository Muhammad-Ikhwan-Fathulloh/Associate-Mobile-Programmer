# Hands-On Hari 2: Jaringan, Sensor, Perangkat, dan Keamanan

Hari 2 melanjutkan proyek `associate_mobile_app` dari Hari 1. Setiap step menampilkan kode lengkap untuk file yang dibuat atau diubah, sehingga peserta dapat mengikuti langkah demi langkah tanpa membuka file lain.

Hasil akhir Hari 2 sama dengan kode di folder `app/` pada repositori ini.

## Jadwal Hari 2

| Waktu | Step | Modul |
|---|---|---|
| 09.00 to 09.15 | Step 0: Persiapan | Persiapan |
| 09.15 to 10.00 | Step 1: Jaringan seluler | Modul 5 |
| 10.00 to 10.40 | Step 2: Sensor | Modul 6 |
| 10.40 to 12.00 | Step 3: Informasi perangkat | Modul 6 |
| 13.00 to 13.40 | Step 4 dan Step 5: Keamanan | Modul 7 |
| 13.40 to 14.30 | Step 6 dan Step 7: Beranda dan pengujian | Modul 7 |
| 15.00 to 17.00 | Step 8: Latihan | Modul 8 |

---

## Step 0: Persiapan (09.00)

### Tujuan

Menyiapkan dependensi dan izin Android yang dibutuhkan untuk Hari 2.

### Langkah

1. Buka proyek `associate_mobile_app` dari Hari 1.
2. Ganti isi `pubspec.yaml` dengan kode berikut. Dependensi `flutter_bloc`, `equatable`, dan `bloc_test` dari versi sebelumnya dihapus karena Hari 2 tidak lagi memakai Cubit.

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
  go_router: ^14.2.0          # Hari 1: navigasi
  sqflite: ^2.3.3             # Hari 1: database SQLite lokal
  path: ^1.9.0
  geolocator: ^13.0.1         # Hari 1: GPS dan izin lokasi
  flutter_map: ^7.0.2         # Hari 1: peta OpenStreetMap (tanpa API key)
  latlong2: ^0.9.1
  connectivity_plus: ^6.0.5   # Hari 2 Modul 5: jenis jaringan
  sensors_plus: ^6.0.0        # Hari 2 Modul 6: accelerometer
  device_info_plus: ^11.0.0   # Hari 2 Modul 6: informasi perangkat
  flutter_secure_storage: ^9.2.2  # Hari 2 Modul 7: penyimpanan aman
  http: ^1.2.2                # Hari 2 Modul 7: request HTTPS

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true
```

3. Tambahkan izin jaringan pada `android/app/src/main/AndroidManifest.xml`, di dalam tag `<manifest>` sebelum tag `<application>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

4. Jalankan perintah berikut di terminal dalam folder proyek:

```bash
flutter pub get
```

### Catatan

- Package `sensors_plus` dan `device_info_plus` tidak memerlukan izin tambahan untuk fitur di panduan ini.
- Package `flutter_secure_storage` memerlukan Android minSdk 18 atau lebih tinggi. Konfigurasi default Flutter sudah memenuhi syarat ini.

---

## Step 1: Jaringan Seluler (09.15)

### Tujuan

Mendeteksi jenis koneksi perangkat dan memperbarui tampilan saat koneksi berubah. Materi: [Modul 5](../hari-2/05-mobile-cellular-network.md).

### Langkah

1. Buat file `lib/services/network_service.dart`.

```dart
import 'package:connectivity_plus/connectivity_plus.dart';

/// Mengubah hasil connectivity_plus menjadi label yang mudah dibaca.
String labelJaringan(List<ConnectivityResult> hasil) {
  if (hasil.isEmpty || hasil.contains(ConnectivityResult.none)) {
    return 'Tidak ada koneksi';
  }
  if (hasil.contains(ConnectivityResult.wifi)) return 'Wi-Fi';
  if (hasil.contains(ConnectivityResult.mobile)) return 'Seluler';
  if (hasil.contains(ConnectivityResult.ethernet)) return 'Ethernet';
  if (hasil.contains(ConnectivityResult.vpn)) return 'VPN';
  return 'Lainnya';
}

class NetworkService {
  NetworkService({Connectivity? connectivity})
      : _connectivity = connectivity ?? Connectivity();

  final Connectivity _connectivity;

  Future<List<ConnectivityResult>> periksa() {
    return _connectivity.checkConnectivity();
  }

  Stream<List<ConnectivityResult>> get perubahan {
    return _connectivity.onConnectivityChanged;
  }
}
```

2. Buat file `lib/pages/network_page.dart`.

```dart
import 'dart:async';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';

import '../services/network_service.dart';

class NetworkPage extends StatefulWidget {
  const NetworkPage({super.key});

  @override
  State<NetworkPage> createState() => _NetworkPageState();
}

class _NetworkPageState extends State<NetworkPage> {
  final _service = NetworkService();
  StreamSubscription<List<ConnectivityResult>>? _langganan;
  List<ConnectivityResult> _hasil = const [];

  @override
  void initState() {
    super.initState();
    _service.periksa().then((hasil) {
      if (mounted) setState(() => _hasil = hasil);
    });
    _langganan = _service.perubahan.listen((hasil) {
      if (mounted) setState(() => _hasil = hasil);
    });
  }

  @override
  void dispose() {
    _langganan?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final label = labelJaringan(_hasil);
    final tanpaKoneksi = label == 'Tidak ada koneksi';
    final seluler = label == 'Seluler';

    return Scaffold(
      appBar: AppBar(title: const Text('Jaringan Seluler')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: ListTile(
              leading: const Icon(Icons.signal_cellular_alt),
              title: const Text('Jenis koneksi'),
              subtitle: Text(label),
            ),
          ),
          const SizedBox(height: 8),
          if (tanpaKoneksi)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text(
                  'Tidak ada koneksi. Periksa Wi-Fi atau data seluler Anda. '
                  'Aplikasi tetap dapat menampilkan data yang tersimpan di perangkat.',
                ),
              ),
            ),
          if (seluler)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text(
                  'Anda sedang memakai jaringan seluler. Unduhan besar sebaiknya '
                  'ditunda sampai Wi-Fi tersedia.',
                ),
              ),
            ),
          const SizedBox(height: 16),
          const Text(
            'Package connectivity_plus hanya mengetahui jenis koneksi. '
            'Generasi (2G, 3G, 4G, atau 5G) dan kecepatan tidak terdeteksi '
            'oleh package ini.',
          ),
        ],
      ),
    );
  }
}
```

### Cara Menguji

Jalankan aplikasi, lalu matikan Wi-Fi dan aktifkan data seluler. Label pada halaman akan berubah tanpa perlu memuat ulang layar.

---

## Step 2: Sensor (10.00)

### Tujuan

Membaca data accelerometer dan membatalkan langganan saat layar ditutup. Materi: [Modul 6](../hari-2/06-mobile-sensor-spesifikasi.md).

### Langkah

Buat file `lib/pages/sensor_page.dart`.

```dart
import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';

class SensorPage extends StatefulWidget {
  const SensorPage({super.key});

  @override
  State<SensorPage> createState() => _SensorPageState();
}

class _SensorPageState extends State<SensorPage> {
  StreamSubscription<AccelerometerEvent>? _langganan;
  AccelerometerEvent? _data;
  bool _tidakTersedia = false;

  @override
  void initState() {
    super.initState();
    _langganan = accelerometerEventStream().listen(
      (event) {
        if (mounted) setState(() => _data = event);
      },
      onError: (_) {
        if (mounted) setState(() => _tidakTersedia = true);
      },
    );
  }

  @override
  void dispose() {
    // Wajib dibatalkan agar sensor berhenti saat layar ditutup
    _langganan?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final data = _data;

    return Scaffold(
      appBar: AppBar(title: const Text('Sensor Accelerometer')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: _tidakTersedia
            ? const Center(
                child: Text('Sensor accelerometer tidak tersedia di perangkat ini.'),
              )
            : data == null
                ? const Center(child: CircularProgressIndicator())
                : _buatTampilan(data),
      ),
    );
  }

  Widget _buatTampilan(AccelerometerEvent data) {
    final besar = math.sqrt(
      data.x * data.x + data.y * data.y + data.z * data.z,
    );
    // Gravitasi bumi sekitar 9.8 m/s2, dibatasi agar bar tetap dalam rentang 0 sampai 1
    final nilaiBar = (besar / 20).clamp(0.0, 1.0).toDouble();

    return ListView(
      children: [
        Card(
          child: ListTile(
            title: const Text('Sumbu X'),
            trailing: Text(data.x.toStringAsFixed(2)),
          ),
        ),
        Card(
          child: ListTile(
            title: const Text('Sumbu Y'),
            trailing: Text(data.y.toStringAsFixed(2)),
          ),
        ),
        Card(
          child: ListTile(
            title: const Text('Sumbu Z'),
            trailing: Text(data.z.toStringAsFixed(2)),
          ),
        ),
        const SizedBox(height: 16),
        Text('Besar percepatan: ${besar.toStringAsFixed(2)} m/s2'),
        const SizedBox(height: 8),
        LinearProgressIndicator(value: nilaiBar),
        const SizedBox(height: 16),
        const Text(
          'Gerakkan perangkat untuk melihat perubahan nilai. '
          'Saat diam, nilai besar percepatan mendekati 9.8 m/s2 karena gravitasi.',
        ),
      ],
    );
  }
}
```

### Cara Menguji

Buka halaman sensor, lalu putar perangkat. Nilai sumbu X, Y, dan Z berubah. Saat perangkat diletakkan diam di atas meja, besar percepatan mendekati 9.8.

### Latihan Mandiri

Tambahkan teks "Perangkat bergerak" jika besar percepatan lebih dari 12 m/s2.

---

## Step 3: Informasi Perangkat (10.40)

### Tujuan

Menampilkan informasi perangkat dari sistem operasi. Materi: [Modul 6](../hari-2/06-mobile-sensor-spesifikasi.md).

### Langkah

Buat file `lib/pages/device_page.dart`.

```dart
import 'dart:io';

import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/material.dart';

class DevicePage extends StatelessWidget {
  const DevicePage({super.key});

  Future<Map<String, String>> _ambilInfo() async {
    final plugin = DeviceInfoPlugin();

    if (Platform.isAndroid) {
      final info = await plugin.androidInfo;
      return {
        'Merek': info.brand,
        'Model': info.model,
        'Versi Android': '${info.version.release} (API ${info.version.sdkInt})',
        'Arsitektur CPU': info.supportedAbis.join(', '),
        'Perangkat keras': info.hardware,
      };
    }

    if (Platform.isIOS) {
      final info = await plugin.iosInfo;
      return {
        'Nama': info.name,
        'Model': info.utsname.machine,
        'Versi iOS': info.systemVersion,
      };
    }

    return {'Platform': Platform.operatingSystem};
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Informasi Perangkat')),
      body: FutureBuilder<Map<String, String>>(
        future: _ambilInfo(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Text('Gagal membaca informasi perangkat: ${snapshot.error}'),
            );
          }
          final entries = snapshot.data!.entries.toList();
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: entries.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final item = entries[index];
              return Card(
                child: ListTile(
                  title: Text(item.key),
                  subtitle: Text(item.value),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
```

### Cara Menguji

Buka halaman informasi perangkat. Bandingkan nilainya dengan menu "Tentang ponsel" di pengaturan perangkat.

---

## Step 4: Penyimpanan Aman (13.00)

### Tujuan

Menyimpan token di tempat penyimpanan aman milik sistem operasi. Materi: [Modul 7](../hari-2/07-keamanan-komunikasi-mobile.md).

### Langkah

Buat file `lib/services/secure_storage_service.dart`.

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  SecureStorageService({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  static const _kunciToken = 'token';

  Future<void> simpanToken(String token) {
    return _storage.write(key: _kunciToken, value: token);
  }

  Future<String?> ambilToken() {
    return _storage.read(key: _kunciToken);
  }

  Future<void> hapusToken() {
    return _storage.delete(key: _kunciToken);
  }
}
```

### Catatan

Layanan ini belum memiliki layar sendiri. Layar yang memakainya dibuat pada Step 5.

---

## Step 5: HTTPS dan Halaman Keamanan (13.10)

### Tujuan

Menolak URL yang tidak memakai HTTPS, mengambil data dari API publik melalui HTTPS, dan menampilkan token yang disamarkan. Materi: [Modul 7](../hari-2/07-keamanan-komunikasi-mobile.md).

### Langkah

1. Buat file `lib/services/https_service.dart`.

```dart
import 'dart:convert';

import 'package:http/http.dart' as http;

/// Mengembalikan pesan error jika URL tidak aman, atau null jika URL aman.
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

class HttpsService {
  HttpsService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  Future<dynamic> ambilJson(String url) async {
    final pesan = periksaUrlAman(url);
    if (pesan != null) {
      throw ArgumentError(pesan);
    }

    final response = await _client
        .get(Uri.parse(url.trim()), headers: {'Accept': 'application/json'})
        .timeout(const Duration(seconds: 10));

    if (response.statusCode != 200) {
      throw Exception('Server merespons status ${response.statusCode}');
    }
    return jsonDecode(response.body);
  }
}
```

2. Buat file `lib/pages/keamanan_page.dart`.

```dart
import 'package:flutter/material.dart';

import '../services/https_service.dart';
import '../services/secure_storage_service.dart';

class KeamananPage extends StatefulWidget {
  const KeamananPage({super.key});

  @override
  State<KeamananPage> createState() => _KeamananPageState();
}

class _KeamananPageState extends State<KeamananPage> {
  final _storage = SecureStorageService();
  final _https = HttpsService();

  final _tokenController = TextEditingController();
  final _urlController = TextEditingController(
    text: 'https://jsonplaceholder.typicode.com/posts/1',
  );

  String _tokenTersimpan = '(belum ada)';
  String _hasilAmbil = '';
  bool _memuat = false;

  @override
  void initState() {
    super.initState();
    _muatToken();
  }

  @override
  void dispose() {
    _tokenController.dispose();
    _urlController.dispose();
    super.dispose();
  }

  /// Hanya empat karakter terakhir yang ditampilkan agar token tidak terlihat utuh.
  String _samarkan(String nilai) {
    if (nilai.length <= 4) return '****';
    return '${'*' * (nilai.length - 4)}${nilai.substring(nilai.length - 4)}';
  }

  Future<void> _muatToken() async {
    final token = await _storage.ambilToken();
    if (!mounted) return;
    setState(() {
      _tokenTersimpan = token == null ? '(belum ada)' : _samarkan(token);
    });
  }

  Future<void> _simpan() async {
    final teks = _tokenController.text.trim();
    if (teks.isEmpty) {
      _pesan('Token tidak boleh kosong.');
      return;
    }
    await _storage.simpanToken(teks);
    _tokenController.clear();
    await _muatToken();
    _pesan('Token disimpan di secure storage.');
  }

  Future<void> _hapus() async {
    await _storage.hapusToken();
    await _muatToken();
    _pesan('Token dihapus.');
  }

  Future<void> _ambilData() async {
    setState(() {
      _memuat = true;
      _hasilAmbil = '';
    });
    try {
      final data = await _https.ambilJson(_urlController.text);
      final judul = data is Map ? data['title'] : null;
      if (mounted) {
        setState(() => _hasilAmbil = 'Judul: ${judul ?? '-'}');
      }
    } catch (e) {
      if (mounted) {
        setState(() => _hasilAmbil = 'Gagal: $e');
      }
    } finally {
      if (mounted) {
        setState(() => _memuat = false);
      }
    }
  }

  void _pesan(String teks) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(teks)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Keamanan dan HTTPS')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Penyimpanan Token', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          Text('Token tersimpan: $_tokenTersimpan'),
          const SizedBox(height: 12),
          TextField(
            controller: _tokenController,
            obscureText: true,
            decoration: const InputDecoration(
              labelText: 'Token (contoh: abc123xyz)',
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
          const Divider(height: 40),
          Text('Permintaan HTTPS', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          TextField(
            controller: _urlController,
            keyboardType: TextInputType.url,
            decoration: const InputDecoration(
              labelText: 'URL (harus https://)',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: _memuat ? null : _ambilData,
            child: const Text('Ambil data'),
          ),
          const SizedBox(height: 12),
          if (_memuat) const LinearProgressIndicator(),
          if (_hasilAmbil.isNotEmpty) Text(_hasilAmbil),
        ],
      ),
    );
  }
}
```

### Cara Menguji

1. Masukkan token, tekan Simpan, lalu lihat bahwa hanya empat karakter terakhir yang tampil.
2. Tutup aplikasi dan buka kembali. Token tetap tersimpan.
3. Ubah URL menjadi `http://jsonplaceholder.typicode.com/posts/1`, lalu tekan Ambil data. Aplikasi menampilkan pesan "Gunakan HTTPS".

---

## Step 6: Router dan Beranda (13.40)

### Tujuan

Mendaftarkan empat layar Hari 2 ke router dan menambahkannya ke menu beranda. Materi: [Modul 5](../hari-2/05-mobile-cellular-network.md) sampai [Modul 7](../hari-2/07-keamanan-komunikasi-mobile.md).

### Langkah

1. Ganti isi `lib/router/app_router.dart`. Rute Hari 1 tetap dipertahankan.

```dart
import 'package:go_router/go_router.dart';

import '../pages/device_page.dart';
import '../pages/home_page.dart';
import '../pages/keamanan_page.dart';
import '../pages/location_page.dart';
import '../pages/network_page.dart';
import '../pages/note_form_page.dart';
import '../pages/notes_page.dart';
import '../pages/sensor_page.dart';

final GoRouter appRouter = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    // Hari 1
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
    // Hari 2
    GoRoute(
      path: '/jaringan',
      builder: (context, state) => const NetworkPage(),
    ),
    GoRoute(
      path: '/sensor',
      builder: (context, state) => const SensorPage(),
    ),
    GoRoute(
      path: '/perangkat',
      builder: (context, state) => const DevicePage(),
    ),
    GoRoute(
      path: '/keamanan',
      builder: (context, state) => const KeamananPage(),
    ),
  ],
);
```

2. Ganti isi `lib/pages/home_page.dart`.

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
      judul: 'Jaringan Seluler',
      deskripsi: 'Jenis koneksi perangkat dan pemantauan perubahan jaringan',
      ikon: Icons.signal_cellular_alt,
      rute: '/jaringan',
    ),
    _MenuItem(
      judul: 'Sensor',
      deskripsi: 'Membaca data accelerometer secara langsung',
      ikon: Icons.sensors,
      rute: '/sensor',
    ),
    _MenuItem(
      judul: 'Informasi Perangkat',
      deskripsi: 'Merek, model, versi sistem operasi, dan arsitektur CPU',
      ikon: Icons.phone_android,
      rute: '/perangkat',
    ),
    _MenuItem(
      judul: 'Keamanan dan HTTPS',
      deskripsi: 'Penyimpanan token aman dan permintaan data melalui HTTPS',
      ikon: Icons.lock_outline,
      rute: '/keamanan',
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

### Catatan

Berkas `lib/services/post_service.dart`, `lib/blocs/post_cubit.dart`, dan berkas post lainnya dari versi Hari 2 sebelumnya tidak lagi dipakai. Hapus berkas tersebut jika masih ada di proyek.

---

## Step 7: Pengujian (14.00)

### Tujuan

Menulis unit test untuk fungsi murni dan widget test untuk beranda. Materi: [Modul 8](../hari-2/08-latihan-uji-kompetensi.md), Bagian B.

### Langkah

1. Buat file `test/network_service_test.dart`.

```dart
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:associate_mobile_app/services/network_service.dart';

void main() {
  test('daftar kosong dianggap tidak ada koneksi', () {
    expect(labelJaringan([]), 'Tidak ada koneksi');
  });

  test('ConnectivityResult.none menghasilkan tidak ada koneksi', () {
    expect(labelJaringan([ConnectivityResult.none]), 'Tidak ada koneksi');
  });

  test('Wi-Fi terdeteksi dengan benar', () {
    expect(labelJaringan([ConnectivityResult.wifi]), 'Wi-Fi');
  });

  test('seluler terdeteksi dengan benar', () {
    expect(labelJaringan([ConnectivityResult.mobile]), 'Seluler');
  });

  test('Wi-Fi lebih diutamakan jika kedua jenis koneksi aktif', () {
    expect(
      labelJaringan([ConnectivityResult.mobile, ConnectivityResult.wifi]),
      'Wi-Fi',
    );
  });
}
```

2. Buat file `test/https_service_test.dart`.

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:associate_mobile_app/services/https_service.dart';

void main() {
  test('URL tanpa skema tidak valid', () {
    expect(periksaUrlAman('bukan url'), 'URL tidak valid.');
  });

  test('URL http ditolak', () {
    expect(periksaUrlAman('http://contoh.test/data'), 'Gunakan HTTPS (https://).');
  });

  test('URL https diterima', () {
    expect(periksaUrlAman('https://contoh.test/data'), isNull);
  });

  test('ambilJson mengembalikan data saat status 200', () async {
    final service = HttpsService(
      client: MockClient(
        (request) async => http.Response('{"title": "Contoh"}', 200),
      ),
    );

    final data = await service.ambilJson('https://contoh.test/post');

    expect((data as Map)['title'], 'Contoh');
  });

  test('ambilJson melempar error saat status bukan 200', () async {
    final service = HttpsService(
      client: MockClient((request) async => http.Response('gagal', 500)),
    );

    await expectLater(
      service.ambilJson('https://contoh.test/post'),
      throwsException,
    );
  });

  test('ambilJson menolak URL http tanpa mengirim request', () async {
    final service = HttpsService(
      client: MockClient((request) async {
        fail('Request tidak boleh dikirim untuk URL http');
      }),
    );

    await expectLater(
      service.ambilJson('http://contoh.test/post'),
      throwsArgumentError,
    );
  });
}
```

3. Buat file `test/home_page_test.dart`.

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:associate_mobile_app/pages/home_page.dart';

void main() {
  testWidgets('HomePage menampilkan menu utama', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: HomePage()));

    expect(find.text('Catatan Lokal'), findsOneWidget);
    expect(find.text('Lokasi dan Peta'), findsOneWidget);
    expect(find.text('Jaringan Seluler'), findsOneWidget);
    expect(find.text('Sensor'), findsOneWidget);
    expect(find.text('Informasi Perangkat'), findsOneWidget);
    expect(find.text('Keamanan dan HTTPS'), findsOneWidget);
  });
}
```

4. Jalankan seluruh pengujian:

```bash
flutter analyze
flutter test
```

### Catatan

Pengujian `distance_test.dart` dari Hari 1 tetap dijalankan bersama pengujian di atas.

---

## Step 8: Latihan (15.00 to 17.00)

### Tujuan

Mengerjakan soal teori dan latihan praktik dari seluruh modul Hari 2, lalu menyusun rencana belajar mandiri. Materi: [Modul 8](../hari-2/08-latihan-uji-kompetensi.md).

### Langkah

1. Buka [docs/hari-2/08-latihan-uji-kompetensi.md](../hari-2/08-latihan-uji-kompetensi.md).
2. Kerjakan Bagian A (soal teori) tanpa membuka materi.
3. Kerjakan Bagian B (latihan praktik) di proyek `app/`.
4. Ikuti pembahasan pada Bagian C dan isi rencana belajar mandiri pada Bagian D.

---

## Ringkasan File Hari 2

| Berkas | Step | Fungsi |
|---|---|---|
| `pubspec.yaml` | 0 | Dependensi Hari 2 |
| `AndroidManifest.xml` | 0 | Izin jaringan |
| `lib/services/network_service.dart` | 1 | Jenis koneksi dan label |
| `lib/pages/network_page.dart` | 1 | Layar jaringan seluler |
| `lib/pages/sensor_page.dart` | 2 | Layar accelerometer |
| `lib/pages/device_page.dart` | 3 | Layar informasi perangkat |
| `lib/services/secure_storage_service.dart` | 4 | Penyimpanan token aman |
| `lib/services/https_service.dart` | 5 | Validasi URL dan request HTTPS |
| `lib/pages/keamanan_page.dart` | 5 | Layar keamanan dan HTTPS |
| `lib/router/app_router.dart` | 6 | Rute Hari 1 dan Hari 2 |
| `lib/pages/home_page.dart` | 6 | Menu beranda |
| `test/network_service_test.dart` | 7 | Unit test jaringan |
| `test/https_service_test.dart` | 7 | Unit test HTTPS |
| `test/home_page_test.dart` | 7 | Widget test beranda |
