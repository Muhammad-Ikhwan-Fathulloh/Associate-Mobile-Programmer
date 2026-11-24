// Sensor: pembacaan kompas dan akselerometer. Fungsi perhitungan ada di kelas murni di bawah.
import 'dart:math' as math;

const gravitasi = 9.80665;

/// Derajat kompas (0 = utara) dari magnetometer saat ponsel datar. Perkiraan saja.
double arahHadapDariMagnetometer(double x, double y) {
  final derajat = math.atan2(-x, y) * 180 / math.pi;
  return (derajat + 360) % 360;
}

/// Menghitung satu guncangan per kejadian (dipakai untuk catat cepat).
class PendeteksiGuncangan {
  PendeteksiGuncangan({this.ambang = 2, this.jedaMs = 800});

  final double ambang;
  final int jedaMs;
  int? _terakhirMs;

  bool masukkan(double besarG, int waktuMs) {
    if (besarG <= ambang) return false;
    final t = _terakhirMs;
    if (t != null && waktuMs - t < jedaMs) return false;
    _terakhirMs = waktuMs;
    return true;
  }
}
