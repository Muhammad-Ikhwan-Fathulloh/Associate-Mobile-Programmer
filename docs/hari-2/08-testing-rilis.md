# Modul 8: Testing dan Build Rilis

**Durasi:** 15.00 to 16.00

## Tujuan Pembelajaran

1. Menulis unit test untuk logika bisnis dan Cubit.
2. Menulis widget test untuk tampilan.
3. Membangun APK dan App Bundle untuk rilis.

## 1. Jenis Pengujian

| Jenis | Cakupan | Alat |
|---|---|---|
| Unit test | Fungsi, class, dan Cubit | `flutter_test`, `bloc_test` |
| Widget test | Satu atau beberapa widget | `flutter_test` |
| Integration test | Alur aplikasi lengkap pada perangkat | `integration_test` |

## 2. Unit Test

```dart
// test/distance_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:aplikasi/services/distance.dart';

void main() {
  test('jarak titik yang sama bernilai nol', () {
    expect(jarakMeter(-6.2, 106.8, -6.2, 106.8), closeTo(0, 0.001));
  });

  test('jarak Jakarta ke Bandung sekitar 120 kilometer', () {
    final jarak = jarakMeter(-6.2088, 106.8456, -6.9175, 107.6191);
    expect(jarak / 1000, closeTo(120, 10));
  });
}
```

Ganti `aplikasi` sesuai nama proyek di `pubspec.yaml`.

## 3. Unit Test Cubit

```dart
// test/todo_cubit_test.dart
import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:aplikasi/blocs/todo_cubit.dart';

void main() {
  group('TodoCubit', () {
    blocTest<TodoCubit, TodoState>(
      'menambah tugas baru',
      build: () => TodoCubit(),
      act: (cubit) => cubit.tambah('Belajar Flutter'),
      expect: () => [
        isA<TodoState>().having((s) => s.daftar.length, 'jumlah', 1),
      ],
    );

    blocTest<TodoCubit, TodoState>(
      'mengubah status tugas',
      build: () => TodoCubit()..tambah('Belajar Flutter'),
      act: (cubit) => cubit.ubahStatus(cubit.state.daftar.first.id),
      expect: () => [
        isA<TodoState>().having((s) => s.daftar.first.selesai, 'selesai', true),
      ],
    );
  });
}
```

Tambahkan dependensi development:

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  bloc_test: ^9.1.7 # sesuaikan dengan versi stabil terbaru
```

## 4. Widget Test

```dart
// test/todo_page_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:aplikasi/blocs/todo_cubit.dart';
import 'package:aplikasi/pages/todo_page.dart';

void main() {
  testWidgets('menampilkan pesan saat daftar kosong', (tester) async {
    await tester.pumpWidget(
      BlocProvider(
        create: (_) => TodoCubit(),
        child: const MaterialApp(home: TodoPage()),
      ),
    );

    expect(find.text('Belum ada tugas'), findsOneWidget);
  });

  testWidgets('menampilkan tugas setelah ditambahkan', (tester) async {
    final cubit = TodoCubit()..tambah('Tugas uji');

    await tester.pumpWidget(
      BlocProvider.value(
        value: cubit,
        child: const MaterialApp(home: TodoPage()),
      ),
    );

    expect(find.text('Tugas uji'), findsOneWidget);
  });
}
```

Jalankan seluruh test:

```bash
flutter test
```

## 5. Build Rilis Android

Buat keystore untuk menandatangani aplikasi:

```bash
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

Simpan kredensial di `android/key.properties` (file ini sudah masuk `.gitignore`):

```properties
storePassword=ISI_PASSWORD
keyPassword=ISI_PASSWORD
keyAlias=upload
storeFile=/home/pengguna/upload-keystore.jks
```

Konfigurasikan signing di `android/app/build.gradle` dan atur nama aplikasi serta versi di `pubspec.yaml`:

```yaml
version: 1.0.0+1   # format: versi-nama+build-number
```

Build:

```bash
flutter build apk --release        # untuk distribusi langsung
flutter build appbundle --release  # untuk Google Play Store
```

Hasil build berada di `build/app/outputs/`.

## 6. Mengubah Nama dan Ikon

- Nama aplikasi: `android/app/src/main/AndroidManifest.xml` (atribut `android:label`) dan `ios/Runner/Info.plist`.
- Ikon: gunakan package `flutter_launcher_icons` dengan file konfigurasi `flutter_launcher_icons.yaml`.

## 7. Publikasi ke Google Play Store

Ringkasan langkah:

1. Buat akun Google Play Console dan bayar biaya pendaftaran satu kali.
2. Buat aplikasi baru dan lengkapi data toko (deskripsi, ikon, tangkapan layar, kebijakan privasi).
3. Unggah file `.aab` ke jalur rilis internal testing.
4. Isi formulir konten, rating, dan keamanan data.
5. Kirim untuk ditinjau.

Kebijakan privasi wajib dicantumkan jika aplikasi mengakses lokasi atau data pengguna.

## Latihan

1. Tulis unit test untuk fungsi `jarakMeter` dengan minimal tiga kasus uji.
2. Tambahkan widget test untuk tombol tambah tugas.
3. Build APK release dan instal pada perangkat fisik.
