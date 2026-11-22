# Modul 6: Advanced Widgets dan Animasi

**Durasi:** 10.00 to 12.00

## Tujuan Pembelajaran

1. Menggunakan `ListView`, `GridView`, dan `Stack` untuk tata letak yang lebih kompleks.
2. Membuat custom widget yang dapat digunakan ulang.
3. Menerapkan implicit animation dan Hero animation.

## 1. ListView dan GridView

```dart
ListView.builder(
  itemCount: daftar.length,
  itemBuilder: (context, index) => ListTile(title: Text(daftar[index])),
);

GridView.builder(
  padding: const EdgeInsets.all(12),
  gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
    maxCrossAxisExtent: 180,
    mainAxisSpacing: 12,
    crossAxisSpacing: 12,
  ),
  itemCount: daftar.length,
  itemBuilder: (context, index) => Card(
    child: Center(child: Text(daftar[index])),
  ),
);
```

Gunakan `builder` (`ListView.builder`, `GridView.builder`) untuk daftar panjang. Widget hanya dibuat saat terlihat di layar.

## 2. Stack

`Stack` menumpuk widget di atas satu sama lain. Gunakan `Positioned` untuk mengatur posisi.

```dart
Stack(
  alignment: Alignment.center,
  children: [
    Container(width: 200, height: 200, color: Colors.indigo.shade100),
    const Positioned(
      top: 12,
      right: 12,
      child: Icon(Icons.star, color: Colors.amber),
    ),
    const Text('Kartu Bertumpuk'),
  ],
);
```

## 3. Custom Widget

Pisahkan bagian UI yang berulang menjadi widget tersendiri.

```dart
// lib/widgets/kartu_tugas.dart
import 'package:flutter/material.dart';

class KartuTugas extends StatelessWidget {
  final String judul;
  final bool selesai;
  final VoidCallback onTap;

  const KartuTugas({
    super.key,
    required this.judul,
    required this.selesai,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Icon(
                selesai ? Icons.check_circle : Icons.radio_button_unchecked,
                color: tema.colorScheme.primary,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  judul,
                  style: tema.textTheme.titleMedium?.copyWith(
                    decoration: selesai ? TextDecoration.lineThrough : null,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

## 4. Implicit Animation

Implicit animation berjalan otomatis ketika nilai properti berubah. Developer cukup mengubah nilai melalui `setState`.

| Widget | Animasi |
|---|---|
| `AnimatedContainer` | Ukuran, warna, padding, dan dekorasi |
| `AnimatedOpacity` | Transparansi |
| `AnimatedAlign` | Posisi |
| `AnimatedCrossFade` | Pergantian antara dua widget |

```dart
import 'package:flutter/material.dart';

class KotakAnimasi extends StatefulWidget {
  const KotakAnimasi({super.key});

  @override
  State<KotakAnimasi> createState() => _KotakAnimasiState();
}

class _KotakAnimasiState extends State<KotakAnimasi> {
  bool _besar = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => setState(() => _besar = !_besar),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
        width: _besar ? 220 : 120,
        height: _besar ? 220 : 120,
        decoration: BoxDecoration(
          color: _besar ? Colors.indigo : Colors.teal,
          borderRadius: BorderRadius.circular(_besar ? 32 : 8),
        ),
      ),
    );
  }
}
```

## 5. Hero Animation

Hero animation menganimasikan widget yang sama saat berpindah layar. Kedua layar harus menggunakan `tag` yang sama.

```dart
// Layar daftar
Hero(
  tag: 'gambar-${item.id}',
  child: Image.asset(item.gambar, width: 80),
);

// Layar detail
Hero(
  tag: 'gambar-${item.id}',
  child: Image.asset(item.gambar, width: 240),
);
```

Pindah layar dengan `Navigator.push` atau `context.push` seperti pada Modul 2.

## Latihan

1. Buat grid tugas dengan `GridView.builder` dan `KartuTugas`.
2. Tambahkan `AnimatedOpacity` pada tugas yang selesai.
3. Tambahkan Hero animation dari daftar tugas ke layar detail.
