// Fungsi murni untuk jarak dan arah. Tidak memakai GPS atau sensor, sehingga mudah diuji.
import 'dart:math' as math;

const _jariJariBumiMeter = 6371000.0;

double _keRadian(double d) => d * math.pi / 180;
double _keDerajat(double r) => r * 180 / math.pi;

/// Jarak lingkaran besar (Haversine) dalam meter.
double jarakMeter(double lat1, double lon1, double lat2, double lon2) {
  final dLat = _keRadian(lat2 - lat1);
  final dLon = _keRadian(lon2 - lon1);
  final a = math.pow(math.sin(dLat / 2), 2) +
      math.cos(_keRadian(lat1)) * math.cos(_keRadian(lat2)) * math.pow(math.sin(dLon / 2), 2);
  return 2 * _jariJariBumiMeter * math.asin(math.sqrt(a));
}

/// Arah awal dari titik asal ke tujuan, dalam derajat (0 = utara, searah jarum jam).
double arahKeTujuan(double lat1, double lon1, double lat2, double lon2) {
  final dLon = _keRadian(lon2 - lon1);
  final y = math.sin(dLon) * math.cos(_keRadian(lat2));
  final x = math.cos(_keRadian(lat1)) * math.sin(_keRadian(lat2)) -
      math.sin(_keRadian(lat1)) * math.cos(_keRadian(lat2)) * math.cos(dLon);
  return (_keDerajat(math.atan2(y, x)) + 360) % 360;
}

/// Selisih arah tujuan terhadap arah hadap ponsel, dalam rentang -180 sampai 180.
/// Nilai 0 berarti tujuan tepat di depan. Nilai negatif berarti tujuan di kiri.
double arahRelatif(double arahTujuan, double arahHadap) {
  return ((arahTujuan - arahHadap + 540) % 360) - 180;
}

const _mataAngin = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];

/// Singkatan mata angin untuk derajat: U, TL, T, TG, S, BD, B, BL.
String mataAngin(double derajat) {
  final normal = ((derajat % 360) + 360) % 360;
  return _mataAngin[(normal / 45).round() % 8];
}

/// Teks jarak untuk tampilan: meter di bawah 1 km, selain itu kilometer.
String formatJarak(double meter) {
  return meter < 1000 ? '${meter.round()} m' : '${(meter / 1000).toStringAsFixed(1)} km';
}
