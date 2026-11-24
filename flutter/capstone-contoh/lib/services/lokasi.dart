import 'dart:async';

import 'package:geolocator/geolocator.dart';

enum Alasan { izin, gps, waktu, lain }

/// Hasil membaca lokasi. Kegagalan dikembalikan sebagai nilai, tidak dilempar.
class HasilLokasi {
  const HasilLokasi.berhasil(this.latitude, this.longitude)
      : alasan = null,
        pesan = null;

  const HasilLokasi.gagal(this.alasan, this.pesan)
      : latitude = null,
        longitude = null;

  final double? latitude;
  final double? longitude;
  final Alasan? alasan;
  final String? pesan;

  bool get ok => alasan == null;
}

const pesanLokasi = {
  Alasan.izin: 'Izin lokasi ditolak. Entri tetap disimpan tanpa koordinat.',
  Alasan.gps: 'GPS mati. Aktifkan GPS lalu coba lagi.',
  Alasan.waktu: 'Lokasi terlalu lama didapat. Coba lagi di tempat terbuka.',
  Alasan.lain: 'Lokasi tidak dapat dibaca.',
};

/// Meminta izin saat tombol ditekan, bukan saat aplikasi dibuka.
Future<HasilLokasi> ambilLokasi({Duration batas = const Duration(seconds: 10)}) async {
  HasilLokasi gagal(Alasan a) => HasilLokasi.gagal(a, pesanLokasi[a]);
  try {
    var izin = await Geolocator.checkPermission();
    if (izin == LocationPermission.denied) izin = await Geolocator.requestPermission();
    if (izin == LocationPermission.denied || izin == LocationPermission.deniedForever) {
      return gagal(Alasan.izin);
    }
    if (!await Geolocator.isLocationServiceEnabled()) return gagal(Alasan.gps);
    final p = await Geolocator.getCurrentPosition(
      locationSettings: LocationSettings(accuracy: LocationAccuracy.high, timeLimit: batas),
    );
    return HasilLokasi.berhasil(p.latitude, p.longitude);
  } on TimeoutException {
    return gagal(Alasan.waktu);
  } catch (_) {
    return gagal(Alasan.lain);
  }
}
