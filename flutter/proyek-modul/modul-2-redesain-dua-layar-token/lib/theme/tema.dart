import 'package:flutter/material.dart';

/// Satu-satunya berkas yang boleh berisi kode warna heksadesimal.
/// Nama token sama dengan variable di Figma. Widget hanya memakai `Tema.*`.
class Tema {
  Tema._();

  // Warna
  static const utama = Color(0xFF1565C0);
  static const latar = Color(0xFFF5F7FB);
  static const kartu = Color(0xFFFFFFFF);
  static const teks = Color(0xFF1B1F27);
  static const abu = Color(0xFF5F6B7A);
  static const garis = Color(0xFFCFD6E0);
  static const tombolTeks = Color(0xFFFFFFFF);

  // Spasi
  static const spasiXs = 4.0;
  static const spasiSm = 8.0;
  static const spasiMd = 12.0;
  static const spasiLg = 16.0;
  static const spasiXl = 24.0;

  // Radius
  static const radiusSm = 8.0;
  static const radiusMd = 12.0;

  // Font
  static const fontKecil = 13.0;
  static const fontIsi = 15.0;
  static const fontJudul = 18.0;
  static const fontBesar = 24.0;

  /// Target sentuh minimal 48 dp.
  static const tinggiTombol = 48.0;

  static ThemeData terang() {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(seedColor: utama, primary: utama),
      scaffoldBackgroundColor: latar,
      appBarTheme: const AppBarTheme(backgroundColor: utama, foregroundColor: tombolTeks),
      textTheme: const TextTheme(
        bodyMedium: TextStyle(fontSize: fontIsi, color: teks),
        bodySmall: TextStyle(fontSize: fontKecil, color: abu),
        titleMedium: TextStyle(fontSize: fontJudul, fontWeight: FontWeight.w600, color: teks),
      ),
    );
  }
}
