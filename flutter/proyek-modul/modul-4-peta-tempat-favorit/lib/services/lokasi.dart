import 'dart:async';

import 'package:geolocator/geolocator.dart';

enum Alasan { izin, gps, waktu, lain }

/// Hasil membaca lokasi. Semua kegagalan dikembalikan sebagai nilai, tidak dilempar.
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

const pesanGagal = {
  Alasan.izin: 'Izin lokasi ditolak. Tempat tetap disimpan tanpa koordinat.',
  Alasan.gps: 'GPS mati. Aktifkan GPS lalu coba lagi.',
  Alasan.waktu: 'Lokasi terlalu lama didapat. Coba lagi di tempat terbuka.',
  Alasan.lain: 'Lokasi tidak dapat dibaca.',
};

/// Meminta izin saat tombol ditekan (bukan saat aplikasi dibuka), lalu membaca posisi.
Future<HasilLokasi> ambilLokasi({Duration batas = const Duration(seconds: 8)}) async {
  HasilLokasi gagal(Alasan a) => HasilLokasi.gagal(a, pesanGagal[a]);
  try {
    var izin = await Geolocator.checkPermission();
    if (izin == LocationPermission.denied) izin = await Geolocator.requestPermission();
    if (izin == LocationPermission.denied || izin == LocationPermission.deniedForever) {
      return gagal(Alasan.izin);
    }
    if (!await Geolocator.isLocationServiceEnabled()) return gagal(Alasan.gps);

    // Akurasi sedang lebih cepat didapat daripada akurasi tinggi, terutama di emulator.
    final posisi = await Geolocator.getCurrentPosition(
      locationSettings: LocationSettings(accuracy: LocationAccuracy.medium, timeLimit: batas),
    );
    return HasilLokasi.berhasil(posisi.latitude, posisi.longitude);
  } on TimeoutException {
    // Bila GPS belum memberi posisi baru, pakai posisi terakhir yang diketahui perangkat.
    try {
      final terakhir = await Geolocator.getLastKnownPosition();
      if (terakhir != null) return HasilLokasi.berhasil(terakhir.latitude, terakhir.longitude);
    } catch (_) {}
    return gagal(Alasan.waktu);
  } catch (_) {
    return gagal(Alasan.lain);
  }
}
