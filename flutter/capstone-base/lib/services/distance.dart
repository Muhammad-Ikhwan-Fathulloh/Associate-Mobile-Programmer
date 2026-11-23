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
