import 'dart:math' as math;

const _jariJariBumiMeter = 6371000.0;

double _keRadian(double derajat) => derajat * math.pi / 180;

/// Jarak lingkaran besar (Haversine) antara dua koordinat, dalam meter.
double jarakMeter(double lat1, double lon1, double lat2, double lon2) {
  final dLat = _keRadian(lat2 - lat1);
  final dLon = _keRadian(lon2 - lon1);
  final a = math.pow(math.sin(dLat / 2), 2) +
      math.cos(_keRadian(lat1)) * math.cos(_keRadian(lat2)) * math.pow(math.sin(dLon / 2), 2);
  return 2 * _jariJariBumiMeter * math.asin(math.sqrt(a));
}

/// Teks jarak untuk tampilan: meter di bawah 1 km, selain itu kilometer.
String formatJarak(double meter) {
  return meter < 1000 ? '${meter.round()} m' : '${(meter / 1000).toStringAsFixed(1)} km';
}
