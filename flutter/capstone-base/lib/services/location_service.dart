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
