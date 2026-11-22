# Modul 2: Perancangan Mobile Interface

**Durasi:** 10.00 to 12.00

## Tujuan Pembelajaran

1. Menerapkan prinsip UI dan UX pada aplikasi mobile.
2. Menggunakan widget dasar dan layout Flutter.
3. Membuat tema konsisten dengan Material 3.
4. Membuat layout responsif dan navigasi antarlayar.

## 1. Prinsip UI dan UX Mobile

- **Keterbacaan:** ukuran teks isi minimal 14, kontras warna minimal 4.5:1 untuk teks normal.
- **Area sentuh:** target sentuh minimal 48 x 48 logical pixel.
- **Thumb zone:** aksi utama diletakkan di area yang mudah dijangkau ibu jari.
- **Hierarki visual:** ukuran, warna, dan spasi menunjukkan prioritas informasi.
- **Konsistensi:** pola navigasi dan komponen seragam di seluruh aplikasi.
- **Umpan balik:** setiap aksi memberikan respons visual yang jelas.

## 2. Tema dengan Material 3

```dart
MaterialApp(
  theme: ThemeData(
    useMaterial3: true,
    colorSchemeSeed: Colors.teal,
    textTheme: const TextTheme(
      headlineMedium: TextStyle(fontWeight: FontWeight.bold),
    ),
  ),
  darkTheme: ThemeData(
    useMaterial3: true,
    colorSchemeSeed: Colors.teal,
    brightness: Brightness.dark,
  ),
  themeMode: ThemeMode.system,
  home: const BerandaPage(),
);
```

Akses tema di dalam widget:

```dart
final tema = Theme.of(context);
final warnaUtama = tema.colorScheme.primary;
final gayaJudul = tema.textTheme.headlineMedium;
```

## 3. Widget Dasar

| Widget | Fungsi |
|---|---|
| `Text` | Menampilkan teks |
| `Image.network` | Gambar dari URL |
| `Image.asset` | Gambar dari folder assets |
| `Column` | Menyusun widget secara vertikal |
| `Row` | Menyusun widget secara horizontal |
| `Container` | Membungkus widget dengan padding, margin, warna, dan ukuran |
| `ListTile` | Baris daftar dengan judul, subjudul, dan ikon |
| `Card` | Kartu dengan elevasi |

### Gambar dari assets

Simpan gambar di `assets/images/logo.png`, lalu daftarkan di `pubspec.yaml`:

```yaml
flutter:
  uses-material-design: true
  assets:
    - assets/images/logo.png
```

```dart
Image.asset('assets/images/logo.png', width: 120);
```

## 4. Form Input

```dart
import 'package:flutter/material.dart';

class FormSapaan extends StatefulWidget {
  const FormSapaan({super.key});

  @override
  State<FormSapaan> createState() => _FormSapaanState();
}

class _FormSapaanState extends State<FormSapaan> {
  final _namaController = TextEditingController();
  String _pesan = '';

  @override
  void dispose() {
    _namaController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Selamat Datang', style: textTheme.headlineMedium, textAlign: TextAlign.center),
          const SizedBox(height: 16),
          TextField(
            controller: _namaController,
            decoration: const InputDecoration(
              labelText: 'Nama lengkap',
              border: OutlineInputBorder(),
            ),
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: _namaController.text.trim().isEmpty
                ? null
                : () => setState(() => _pesan = 'Halo, ${_namaController.text.trim()}'),
            child: const Text('Tampilkan Pesan'),
          ),
          const SizedBox(height: 12),
          if (_pesan.isNotEmpty)
            Text(_pesan, style: textTheme.titleMedium, textAlign: TextAlign.center),
        ],
      ),
    );
  }
}
```

## 5. Layout Responsif

`LayoutBuilder` memberikan batas lebar yang tersedia untuk widget. Pendekatan umum:

| Lebar area | Tata letak |
|---|---|
| Di bawah 600 | Satu atau dua kolom, navigasi bawah (`NavigationBar`) |
| 600 hingga 840 | Grid dua hingga tiga kolom |
| Di atas 840 | Navigasi samping (`NavigationRail`) dan panel detail |

```dart
import 'package:flutter/material.dart';

class GridProduk extends StatelessWidget {
  final List<String> produk;

  const GridProduk({super.key, required this.produk});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final kolom = constraints.maxWidth < 600 ? 2 : 4;

        return GridView.builder(
          padding: const EdgeInsets.all(16),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: kolom,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemCount: produk.length,
          itemBuilder: (context, index) => Card(
            child: Center(child: Text(produk[index])),
          ),
        );
      },
    );
  }
}
```

## 6. Navigasi

### Navigator (anonymous route)

```dart
// Membuka layar baru
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => const HalamanDetail()),
);

// Kembali ke layar sebelumnya
Navigator.pop(context);
```

### go_router

Tambahkan dependensi:

```yaml
dependencies:
  go_router: ^14.2.0 # sesuaikan dengan versi stabil terbaru
```

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final appRouter = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => Scaffold(
        appBar: AppBar(title: const Text('Beranda')),
        body: Center(
          child: FilledButton(
            onPressed: () => context.push('/detail/42'),
            child: const Text('Buka Detail'),
          ),
        ),
      ),
    ),
    GoRoute(
      path: '/detail/:id',
      builder: (context, state) => Scaffold(
        appBar: AppBar(title: const Text('Detail')),
        body: Center(
          child: Text('Detail item: ${state.pathParameters['id']}'),
        ),
      ),
    ),
  ],
);
```

Pada `main.dart`:

```dart
MaterialApp.router(
  theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
  routerConfig: appRouter,
);
```

`context.push` menambahkan layar ke tumpukan navigasi, sedangkan `context.go` mengganti lokasi saat ini.

## Latihan

1. Buat form login sederhana dengan dua `TextField` (email dan kata sandi) dan satu `FilledButton`.
2. Tambahkan layar ketiga dan navigasi dari layar kedua dengan `context.push`.
3. Buat grid produk responsif yang menampilkan dua kolom pada layar kecil dan empat kolom pada layar besar.
