import 'dart:math' as math;
import 'dart:ui' show Color;

/// Rasio kontras WCAG antara dua warna. Minimal 4,5 untuk teks biasa.
double rasioKontras(Color a, Color b) {
  final la = _luminansi(a);
  final lb = _luminansi(b);
  final hi = math.max(la, lb);
  final lo = math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

double _luminansi(Color warna) {
  double kanal(double c) => c <= 0.03928 ? c / 12.92 : math.pow((c + 0.055) / 1.055, 2.4).toDouble();
  return 0.2126 * kanal(warna.r) + 0.7152 * kanal(warna.g) + 0.0722 * kanal(warna.b);
}
