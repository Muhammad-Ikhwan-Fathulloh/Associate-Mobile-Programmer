import 'package:flutter/material.dart';

import '../proyek_config.dart';

/// Token desain. Nama dan nilainya sama dengan variable di berkas Figma pelatihan
/// (koleksi Warna, Spasi, Radius, Font) dan dengan `src/theme.ts` pada jalur React Native.
class Tema {
  Tema._();

  // Warna
  static const utama = ProyekConfig.warnaUtama;
  static const latar = Color(0xFFF5F7FB);
  static const kartu = Color(0xFFFFFFFF);
  static const teks = Color(0xFF1B1F27);
  static const abu = Color(0xFF5F6B7A);
  static const garis = Color(0xFFCFD6E0);
  static const bahaya = Color(0xFFC62828);
  static const ok = Color(0xFF2E7D32);

  // Spasi
  static const spasiXs = 4.0;
  static const spasiSm = 8.0;
  static const spasiMd = 12.0;
  static const spasiLg = 16.0;
  static const spasiXl = 24.0;

  // Radius
  static const radiusSm = 8.0;
  static const radiusMd = 12.0;
  static const radiusLg = 20.0;

  // Font
  static const fontKecil = 13.0;
  static const fontIsi = 15.0;
  static const fontJudul = 18.0;
  static const fontBesar = 24.0;

  /// Target sentuh minimal sekitar 48 dp.
  static const tinggiTombol = 48.0;

  static ThemeData terang() {
    final bentukTombol = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(radiusSm),
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(seedColor: utama).copyWith(primary: utama),
      scaffoldBackgroundColor: latar,
      textTheme: const TextTheme(
        bodyMedium: TextStyle(fontSize: fontIsi, color: teks),
        bodySmall: TextStyle(fontSize: fontKecil, color: abu),
        titleMedium: TextStyle(fontSize: fontJudul, fontWeight: FontWeight.w600, color: teks),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: utama,
        foregroundColor: Colors.white,
        titleTextStyle: TextStyle(fontSize: fontJudul, fontWeight: FontWeight.w600, color: Colors.white),
      ),
      cardTheme: CardThemeData(
        color: kartu,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          side: const BorderSide(color: garis),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: kartu,
        contentPadding: const EdgeInsets.symmetric(horizontal: spasiMd, vertical: spasiMd),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusSm),
          borderSide: const BorderSide(color: garis),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusSm),
          borderSide: const BorderSide(color: garis),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size.fromHeight(tinggiTombol),
          shape: bentukTombol,
          textStyle: const TextStyle(fontSize: fontIsi, fontWeight: FontWeight.w600),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size.fromHeight(tinggiTombol),
          foregroundColor: utama,
          side: const BorderSide(color: utama),
          shape: bentukTombol,
          textStyle: const TextStyle(fontSize: fontIsi, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
