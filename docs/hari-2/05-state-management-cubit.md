# Modul 5: State Management dengan Cubit

**Durasi:** 09.00 to 10.00

## Tujuan Pembelajaran

1. Menjelaskan perbedaan `setState` dan state management terpusat.
2. Membuat Cubit dan state yang immutable.
3. Menghubungkan Cubit dengan UI menggunakan `BlocProvider`, `BlocBuilder`, dan `BlocListener`.

## 1. Mengapa State Management

`setState` cukup untuk state lokal di satu widget. Ketika state dibutuhkan oleh banyak layar, pemisahan logika bisnis dari UI menjadi penting. Cubit memisahkan logika (method di dalam Cubit) dari tampilan (widget).

## 2. Persiapan

```yaml
dependencies:
  flutter_bloc: ^9.1.1 # sesuaikan dengan versi stabil terbaru
  equatable: ^2.0.5
```

```bash
flutter pub get
```

Struktur folder:

```
lib/
├── blocs/
│   └── todo_cubit.dart
├── models/
│   └── todo_model.dart
├── pages/
│   └── todo_page.dart
└── main.dart
```

## 3. Model dengan Equatable

Equatable membuat dua object dengan nilai yang sama dianggap setara, sehingga Cubit tidak memicu pembaruan UI yang tidak perlu.

```dart
// lib/models/todo_model.dart
import 'package:equatable/equatable.dart';

class Todo extends Equatable {
  final String id;
  final String judul;
  final bool selesai;

  const Todo({
    required this.id,
    required this.judul,
    this.selesai = false,
  });

  Todo copyWith({String? judul, bool? selesai}) {
    return Todo(
      id: id,
      judul: judul ?? this.judul,
      selesai: selesai ?? this.selesai,
    );
  }

  @override
  List<Object?> get props => [id, judul, selesai];
}
```

## 4. Cubit

```dart
// lib/blocs/todo_cubit.dart
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/todo_model.dart';

class TodoState extends Equatable {
  final List<Todo> daftar;

  const TodoState({this.daftar = const []});

  @override
  List<Object?> get props => [daftar];
}

class TodoCubit extends Cubit<TodoState> {
  TodoCubit() : super(const TodoState());

  void tambah(String judul) {
    final todo = Todo(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      judul: judul,
    );
    emit(TodoState(daftar: [...state.daftar, todo]));
  }

  void hapus(String id) {
    emit(TodoState(
      daftar: state.daftar.where((t) => t.id != id).toList(),
    ));
  }

  void ubahStatus(String id) {
    emit(TodoState(
      daftar: state.daftar
          .map((t) => t.id == id ? t.copyWith(selesai: !t.selesai) : t)
          .toList(),
    ));
  }
}
```

Aturan penting: state tidak boleh diubah langsung. Setiap perubahan membuat list atau object baru, lalu dikirim melalui `emit`.

## 5. Menghubungkan Cubit ke UI

```dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'blocs/todo_cubit.dart';
import 'pages/todo_page.dart';

void main() {
  runApp(const AplikasiTodo());
}

class AplikasiTodo extends StatelessWidget {
  const AplikasiTodo({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => TodoCubit(),
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
        home: const TodoPage(),
      ),
    );
  }
}
```

```dart
// lib/pages/todo_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/todo_cubit.dart';

class TodoPage extends StatelessWidget {
  const TodoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Daftar Tugas')),
      body: BlocBuilder<TodoCubit, TodoState>(
        builder: (context, state) {
          if (state.daftar.isEmpty) {
            return const Center(child: Text('Belum ada tugas'));
          }
          return ListView.builder(
            itemCount: state.daftar.length,
            itemBuilder: (context, index) {
              final todo = state.daftar[index];
              return ListTile(
                leading: Checkbox(
                  value: todo.selesai,
                  onChanged: (_) => context.read<TodoCubit>().ubahStatus(todo.id),
                ),
                title: Text(
                  todo.judul,
                  style: TextStyle(
                    decoration: todo.selesai ? TextDecoration.lineThrough : null,
                  ),
                ),
                trailing: IconButton(
                  icon: const Icon(Icons.delete_outline),
                  onPressed: () => context.read<TodoCubit>().hapus(todo.id),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _tampilkanFormTambah(context),
        child: const Icon(Icons.add),
      ),
    );
  }

  Future<void> _tampilkanFormTambah(BuildContext context) async {
    final controller = TextEditingController();
    final judul = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Tugas baru'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(hintText: 'Tulis judul tugas'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Batal'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, controller.text.trim()),
            child: const Text('Simpan'),
          ),
        ],
      ),
    );
    controller.dispose();

    if (judul != null && judul.isNotEmpty && context.mounted) {
      context.read<TodoCubit>().tambah(judul);
    }
  }
}
```

## 6. Perbedaan Widget Bloc

| Widget | Fungsi |
|---|---|
| `BlocProvider` | Menyediakan Cubit untuk widget di bawahnya |
| `BlocBuilder` | Membangun ulang UI saat state berubah |
| `BlocListener` | Menjalankan efek samping, seperti navigasi atau snackbar |
| `BlocConsumer` | Kombinasi `BlocBuilder` dan `BlocListener`, digunakan saat UI perlu dibangun ulang sekaligus menjalankan efek samping |
| `context.read<T>()` | Mengambil Cubit untuk memanggil method, tanpa berlangganan perubahan |
| `context.watch<T>()` | Mengambil Cubit dan membangun ulang widget saat state berubah |

## Latihan

1. Tambahkan filter untuk menampilkan tugas yang belum selesai saja.
2. Tambahkan `BlocListener` yang menampilkan `SnackBar` setiap kali tugas dihapus.
3. Pindahkan logika validasi judul kosong ke dalam Cubit.
