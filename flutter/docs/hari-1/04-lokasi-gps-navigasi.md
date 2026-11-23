# Modul 4: Mobile Location Based Service, GPS, dan Navigasi

**Durasi:** 15.00 to 17.00

## Tujuan Pembelajaran

1. Menjelaskan sumber data lokasi pada perangkat mobile.
2. Meminta izin lokasi dengan benar di Android dan iOS.
3. Membaca posisi pengguna secara berkelanjutan.
4. Menampilkan posisi pada peta dan menghitung jarak.

## 1. Sumber Data Lokasi

| Sumber | Akurasi tipikal | Keterangan |
|---|---|---|
| GPS | 3 hingga 10 meter (area terbuka) | Sinyal satelit. Membutuhkan waktu untuk *fix* pertama. |
| Wi-Fi | 20 hingga 50 meter | Berdasarkan database titik akses. |
| Jaringan seluler | 100 meter hingga beberapa kilometer | Berdasarkan menara seluler. |
| Sensor inersia | Relatif | Estimasi pergerakan jangka pendek. |

Android menggabungkan sumber-sumber tersebut melalui Fused Location Provider. Package `geolocator` menyediakan API yang sama untuk Android dan iOS.

## 2. Izin dan Privasi

| Platform | Konfigurasi | Keterangan |
|---|---|---|
| Android | `ACCESS_COARSE_LOCATION` | Lokasi perkiraan |
| Android | `ACCESS_FINE_LOCATION` | Lokasi presisi |
| Android | `ACCESS_BACKGROUND_LOCATION` | Lokasi di latar belakang. Memerlukan justifikasi di Google Play. |
| iOS | `NSLocationWhenInUseUsageDescription` | Teks penjelasan saat izin diminta |

Prinsip privasi: minta izin sesuai kebutuhan, jelaskan alasannya sebelum meminta izin, dan kumpulkan lokasi seminimal mungkin.

## 3. Konfigurasi

```yaml
# pubspec.yaml
dependencies:
  geolocator: ^13.0.1           # sesuaikan dengan versi stabil terbaru
  google_maps_flutter: ^2.9.0   # sesuaikan dengan versi stabil terbaru
```

Android, `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.INTERNET" />

    <application ...>
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="ISI_API_KEY_ANDA" />
    </application>
</manifest>
```

iOS, `ios/Runner/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Lokasi digunakan untuk menampilkan posisi Anda pada peta.</string>
```

Pada iOS, API key Google Maps didaftarkan di `AppDelegate` melalui `GMSServices.provideAPIKey`. Jangan menyimpan API key di repositori publik. Gunakan file yang sudah masuk `.gitignore`, atau batasi penggunaan key di Google Cloud Console.

## 4. Layanan Lokasi

```dart
// lib/services/location_service.dart
import 'package:geolocator/geolocator.dart';

class LocationService {
  /// Memastikan layanan lokasi aktif dan izin telah diberikan.
  Future<bool> ensurePermission() async {
    if (!await Geolocator.isLocationServiceEnabled()) return false;

    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }

    return permission == LocationPermission.whileInUse ||
        permission == LocationPermission.always;
  }

  /// Stream posisi. Data dikirim saat perangkat berpindah sejauh [distanceFilterMeters].
  Stream<Position> positionStream({int distanceFilterMeters = 5}) {
    final settings = LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: distanceFilterMeters,
    );
    return Geolocator.getPositionStream(locationSettings: settings);
  }
}
```

## 5. Menampilkan Posisi di Layar

```dart
// lib/pages/location_page.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../services/location_service.dart';

class LocationPage extends StatefulWidget {
  const LocationPage({super.key});

  @override
  State<LocationPage> createState() => _LocationPageState();
}

class _LocationPageState extends State<LocationPage> {
  final _service = LocationService();
  StreamSubscription<Position>? _subscription;
  Position? _posisi;
  String _status = 'Belum memeriksa izin';

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }

  Future<void> _mulaiPelacakan() async {
    final diizinkan = await _service.ensurePermission();
    if (!diizinkan) {
      setState(() => _status = 'Izin lokasi ditolak atau layanan lokasi nonaktif');
      return;
    }

    await _subscription?.cancel();
    _subscription = _service.positionStream().listen(
      (posisi) => setState(() {
        _posisi = posisi;
        _status = 'Posisi diperbarui';
      }),
      onError: (error) => setState(() => _status = 'Gagal membaca lokasi: $error'),
    );
  }

  @override
  Widget build(BuildContext context) {
    final posisi = _posisi;

    return Scaffold(
      appBar: AppBar(title: const Text('Lokasi Saya')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FilledButton(
              onPressed: _mulaiPelacakan,
              child: const Text('Mulai Pelacakan'),
            ),
            const SizedBox(height: 16),
            Text(_status, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            if (posisi != null)
              Text(
                'Lat: ${posisi.latitude.toStringAsFixed(6)}\n'
                'Lon: ${posisi.longitude.toStringAsFixed(6)}\n'
                'Akurasi: ${posisi.accuracy.toStringAsFixed(1)} meter',
                textAlign: TextAlign.center,
              ),
          ],
        ),
      ),
    );
  }
}
```

Jika izin ditolak permanen (`LocationPermission.deniedForever`), arahkan pengguna ke pengaturan aplikasi dengan `Geolocator.openAppSettings()`.

## 6. Peta dan Penanda

```dart
// lib/pages/peta_page.dart
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class PetaPage extends StatelessWidget {
  final double latitude;
  final double longitude;

  const PetaPage({super.key, required this.latitude, required this.longitude});

  @override
  Widget build(BuildContext context) {
    final posisi = LatLng(latitude, longitude);

    return Scaffold(
      appBar: AppBar(title: const Text('Peta')),
      body: GoogleMap(
        initialCameraPosition: CameraPosition(target: posisi, zoom: 15),
        markers: {
          Marker(
            markerId: const MarkerId('lokasi_pengguna'),
            position: posisi,
            infoWindow: const InfoWindow(title: 'Lokasi Anda'),
          ),
        },
        myLocationEnabled: true,
        myLocationButtonEnabled: true,
      ),
    );
  }
}
```

## 7. Menghitung Jarak

`Geolocator.distanceBetween` menghitung jarak dalam meter. Berikut implementasi rumus Haversine untuk memahami konsepnya:

```dart
// lib/services/distance.dart
import 'dart:math';

const double _jariJariBumiMeter = 6371000;

double _keRadian(double derajat) => derajat * pi / 180;

/// Jarak lingkaran besar (Haversine) dalam meter.
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

## 8. Akurasi dan Konsumsi Baterai

| `LocationAccuracy` | Keterangan | Penggunaan |
|---|---|---|
| `bestForNavigation` | Presisi tertinggi, konsumsi tertinggi | Navigasi belokan demi belokan |
| `high` | Akurasi tinggi | Pelacakan perjalanan |
| `medium` | Akurasi sedang | Absensi lokasi |
| `low` | Akurasi rendah | Konten berbasis wilayah |

Praktik terbaik:

- Batalkan stream dengan `cancel()` di `dispose`.
- Gunakan `distanceFilter` agar pembaruan tidak terlalu sering.
- Uji akurasi di lapangan, karena gedung tinggi dan ruangan tertutup memengaruhi sinyal GPS.

## Latihan

1. Buat aplikasi catatan yang menyimpan koordinat lokasi saat catatan dibuat (menggabungkan Modul 3 dan Modul 4).
2. Tampilkan jarak setiap catatan dari posisi pengguna saat ini.
3. Tampilkan peta dengan penanda pada koordinat catatan yang dipilih.
4. Pastikan izin lokasi diminta sebelum fitur lokasi digunakan, dengan penanganan jika izin ditolak.
