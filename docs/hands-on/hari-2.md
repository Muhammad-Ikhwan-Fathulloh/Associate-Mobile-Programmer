# Hands-On Hari 2: State Management, REST API Publik, dan Rilis

Hari 2 melanjutkan proyek `associate_mobile_app` dari Hari 1. Setiap step menampilkan kode lengkap untuk file yang dibuat atau diubah.

**API publik yang digunakan:** [JSONPlaceholder](https://jsonplaceholder.typicode.com), REST API tiruan tanpa API key.

**Waktu:** 09.00 to 17.00 (istirahat 12.00 to 13.00)

---

## Step 0: Persiapan (09.00)

Pastikan proyek Hari 1 masih berjalan:

```bash
flutter pub get
flutter analyze
```

Uji API publik di browser. Buka kedua tautan berikut dan pastikan muncul data JSON:

- https://jsonplaceholder.typicode.com/posts?_limit=3
- https://jsonplaceholder.typicode.com/posts/1

**Checkpoint:** data JSON tampil di browser.

---

## Step 1: Model Post (09.15)

Buat file `lib/models/post.dart`:

```dart
import 'package:equatable/equatable.dart';

/// Model post dari API publik JSONPlaceholder.
class Post extends Equatable {
  const Post({
    required this.id,
    required this.judul,
    required this.isi,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as int,
      judul: json['title'] as String,
      isi: json['body'] as String,
    );
  }

  final int id;
  final String judul;
  final String isi;

  Map<String, dynamic> toJson() => {
        'title': judul,
        'body': isi,
        'userId': 1,
      };

  @override
  List<Object?> get props => [id, judul, isi];
}
```

Penjelasan:
- Key JSON `title` dan `body` dipetakan ke properti Dart `judul` dan `isi`.
- `fromJson` membaca respons dari API. `toJson` mengubah object menjadi data yang dikirim ke API.
- `Equatable` membuat dua object dengan nilai yang sama dianggap setara. Ini dibutuhkan oleh test Cubit.

---

## Step 2: Layanan API (09.40)

Buat file `lib/services/post_service.dart`:

```dart
import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/post.dart';

/// Layanan REST API publik JSONPlaceholder (https://jsonplaceholder.typicode.com).
/// Data pada API ini bersifat tiruan: POST tidak benar-benar disimpan di server.
class PostService {
  PostService({
    http.Client? client,
    String baseUrl = 'https://jsonplaceholder.typicode.com',
  })  : _client = client ?? http.Client(),
        _baseUrl = baseUrl;

  final http.Client _client;
  final String _baseUrl;

  static const _batasWaktu = Duration(seconds: 10);

  /// GET /posts?_limit=...
  Future<List<Post>> ambilSemua({int limit = 20}) async {
    final uri = Uri.parse('$_baseUrl/posts?_limit=$limit');
    final response = await _client.get(uri).timeout(_batasWaktu);
    _periksaStatus(response, 200);

    final data = jsonDecode(response.body) as List<dynamic>;
    return data
        .map((item) => Post.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  /// GET /posts/{id}
  Future<Post> ambilById(int id) async {
    final uri = Uri.parse('$_baseUrl/posts/$id');
    final response = await _client.get(uri).timeout(_batasWaktu);
    _periksaStatus(response, 200);

    return Post.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  /// POST /posts
  Future<Post> tambah(Post post) async {
    final uri = Uri.parse('$_baseUrl/posts');
    final response = await _client
        .post(
          uri,
          headers: {'Content-Type': 'application/json; charset=UTF-8'},
          body: jsonEncode(post.toJson()),
        )
        .timeout(_batasWaktu);
    _periksaStatus(response, 201);

    return Post.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  void _periksaStatus(http.Response response, int diharapkan) {
    if (response.statusCode != diharapkan) {
      throw Exception('Permintaan gagal (status ${response.statusCode})');
    }
  }
}
```

Penjelasan:
- `http.Client` diterima lewat konstruktor. Pada test, client ini diganti dengan `MockClient` agar test tidak membutuhkan internet.
- Setiap method memeriksa status code. `GET` mengharapkan 200, dan `POST` mengharapkan 201.
- `timeout` mencegah aplikasi menunggu tanpa batas.

---

## Step 3: State dengan Cubit (10.10)

Buat file `lib/blocs/post_cubit.dart`:

```dart
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../models/post.dart';
import '../services/post_service.dart';

enum PostStatus { awal, memuat, berhasil, gagal }

class PostState extends Equatable {
  const PostState({
    this.status = PostStatus.awal,
    this.posts = const [],
    this.error,
  });

  final PostStatus status;
  final List<Post> posts;
  final String? error;

  PostState copyWith({PostStatus? status, List<Post>? posts}) {
    return PostState(
      status: status ?? this.status,
      posts: posts ?? this.posts,
    );
  }

  @override
  List<Object?> get props => [status, posts, error];
}

class PostCubit extends Cubit<PostState> {
  PostCubit(this._service) : super(const PostState());

  final PostService _service;

  Future<void> load() async {
    emit(PostState(status: PostStatus.memuat, posts: state.posts));
    try {
      final posts = await _service.ambilSemua();
      emit(PostState(status: PostStatus.berhasil, posts: posts));
    } catch (e) {
      emit(PostState(
        status: PostStatus.gagal,
        posts: state.posts,
        error: 'Gagal memuat data: $e',
      ));
    }
  }

  /// Mengirim post baru. Mengembalikan true jika berhasil.
  Future<bool> kirim(Post post) async {
    try {
      final baru = await _service.tambah(post);
      emit(state.copyWith(posts: [baru, ...state.posts]));
      return true;
    } catch (_) {
      return false;
    }
  }
}
```

Buat file `test/post_cubit_test.dart`:

```dart
import 'dart:convert';

import 'package:associate_mobile_app/blocs/post_cubit.dart';
import 'package:associate_mobile_app/models/post.dart';
import 'package:associate_mobile_app/services/post_service.dart';
import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

final _dataContoh = [
  {'id': 1, 'title': 'Judul uji', 'body': 'Isi uji', 'userId': 1},
];

void main() {
  group('PostCubit.load', () {
    blocTest<PostCubit, PostState>(
      'memuat daftar post dari API',
      build: () {
        final client = MockClient((request) async {
          expect(request.url.path, '/posts');
          return http.Response(jsonEncode(_dataContoh), 200);
        });
        return PostCubit(PostService(client: client));
      },
      act: (cubit) => cubit.load(),
      expect: () => [
        const PostState(status: PostStatus.memuat),
        const PostState(
          status: PostStatus.berhasil,
          posts: [Post(id: 1, judul: 'Judul uji', isi: 'Isi uji')],
        ),
      ],
    );

    blocTest<PostCubit, PostState>(
      'menampilkan status gagal saat server mengembalikan error',
      build: () {
        final client = MockClient((_) async => http.Response('', 500));
        return PostCubit(PostService(client: client));
      },
      act: (cubit) => cubit.load(),
      expect: () => [
        const PostState(status: PostStatus.memuat),
        isA<PostState>().having((s) => s.status, 'status', PostStatus.gagal),
      ],
    );
  });
}
```

Penjelasan:
- `PostStatus` mendaftar kemungkinan kondisi data: awal, memuat, berhasil, dan gagal.
- `load` memancarkan `memuat` terlebih dahulu, lalu `berhasil` atau `gagal`. UI selalu tahu apa yang sedang terjadi.
- `kirim` menambahkan post baru di awal daftar yang sudah ada tanpa memuat ulang seluruh data.

Jalankan test Cubit:

```bash
flutter test test/post_cubit_test.dart
```

**Checkpoint:** kedua test lulus.

---

## Step 4: Router Lengkap dengan Route Post (10.40)

Ganti isi `lib/router/app_router.dart` dengan kode berikut. Route `/post` membuat Cubit dan memuat data saat layar dibuka. Route `/post/baru` harus didaftarkan sebelum `/post/:id`, karena jika tidak, kata `baru` akan dibaca sebagai ID.

```dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../blocs/post_cubit.dart';
import '../pages/home_page.dart';
import '../pages/location_page.dart';
import '../pages/note_form_page.dart';
import '../pages/notes_page.dart';
import '../pages/post_detail_page.dart';
import '../pages/post_form_page.dart';
import '../pages/posts_page.dart';
import '../services/post_service.dart';

final GoRouter appRouter = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    // Hari 1
    GoRoute(
      path: '/catatan',
      builder: (context, state) => const NotesPage(),
    ),
    GoRoute(
      path: '/catatan/baru',
      builder: (context, state) => const NoteFormPage(),
    ),
    GoRoute(
      path: '/lokasi',
      builder: (context, state) => const LocationPage(),
    ),
    // Hari 2
    GoRoute(
      path: '/post',
      builder: (context, state) => BlocProvider(
        create: (_) => PostCubit(PostService())..load(),
        child: const PostsPage(),
      ),
    ),
    // Harus sebelum '/post/:id'
    GoRoute(
      path: '/post/baru',
      builder: (context, state) => const PostFormPage(),
    ),
    GoRoute(
      path: '/post/:id',
      builder: (context, state) {
        final id = int.tryParse(state.pathParameters['id'] ?? '');
        if (id == null) {
          return const Scaffold(
            body: Center(child: Text('ID post tidak valid')),
          );
        }
        return PostDetailPage(postId: id);
      },
    ),
  ],
);
```

Penjelasan:
- `BlocProvider` berada di dalam route `/post`. Cubit hidup selama layar daftar post ada, dan dibuang saat layar ditutup.
- Latihan: pindahkan `/post/baru` ke bawah `/post/:id`, jalankan aplikasi, lalu tekan **Post baru**. Jelaskan apa yang terjadi, kemudian kembalikan urutannya.

---

## Step 5: Daftar Post dengan BlocBuilder (11.00)

Buat file `lib/pages/posts_page.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../blocs/post_cubit.dart';
import '../models/post.dart';
import '../widgets/post_card.dart';

class PostsPage extends StatelessWidget {
  const PostsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Daftar Post (API Publik)')),
      body: BlocBuilder<PostCubit, PostState>(
        builder: (context, state) {
          final sedangMemuatAwal = state.status == PostStatus.awal ||
              (state.status == PostStatus.memuat && state.posts.isEmpty);
          if (sedangMemuatAwal) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state.status == PostStatus.gagal && state.posts.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(state.error ?? 'Terjadi kesalahan'),
                  const SizedBox(height: 12),
                  FilledButton(
                    onPressed: () => context.read<PostCubit>().load(),
                    child: const Text('Coba lagi'),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => context.read<PostCubit>().load(),
            child: state.posts.isEmpty
                ? ListView(
                    children: const [
                      SizedBox(height: 120),
                      Center(child: Text('Data kosong')),
                    ],
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: state.posts.length,
                    itemBuilder: (context, index) {
                      final post = state.posts[index];
                      return PostCard(
                        post: post,
                        onTap: () => context.push('/post/${post.id}'),
                      );
                    },
                  ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        icon: const Icon(Icons.add),
        label: const Text('Post baru'),
        onPressed: () async {
          final post = await context.push<Post>('/post/baru');
          if (post == null || !context.mounted) return;

          final ok = await context.read<PostCubit>().kirim(post);
          if (!context.mounted) return;

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(ok ? 'Post berhasil dikirim' : 'Gagal mengirim post'),
            ),
          );
        },
      ),
    );
  }
}
```

Penjelasan:
- `BlocBuilder` membangun ulang tampilan setiap kali state berubah.
- Lima kondisi ditangani: loading awal, gagal tanpa data, data kosong, berhasil, dan pull to refresh.
- `RefreshIndicator` memanggil `load` kembali. Daftar harus berupa widget yang bisa di-scroll, sehingga pesan kosong dibungkus `ListView`.

Jalankan aplikasi, buka **Daftar Post API**, lalu matikan internet sebentar dan tarik ke bawah untuk memuat ulang. Pesan kesalahan dan tombol **Coba lagi** akan muncul.

**Checkpoint:** kondisi gagal dan berhasil dapat dibedakan di layar.

---

## Step 6: Kartu Post dengan Animasi dan Hero (11.30)

Buat file `lib/widgets/post_card.dart`:

```dart
import 'package:flutter/material.dart';

import '../models/post.dart';

/// Kartu post dengan animasi warna saat ditekan dan Hero pada judul.
class PostCard extends StatefulWidget {
  const PostCard({
    super.key,
    required this.post,
    required this.onTap,
  });

  final Post post;
  final VoidCallback onTap;

  @override
  State<PostCard> createState() => _PostCardState();
}

class _PostCardState extends State<PostCard> {
  bool _ditekan = false;

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return GestureDetector(
      onTapDown: (_) => setState(() => _ditekan = true),
      onTapUp: (_) => setState(() => _ditekan = false),
      onTapCancel: () => setState(() => _ditekan = false),
      onTap: widget.onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: _ditekan
              ? tema.colorScheme.primaryContainer
              : tema.colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Hero(
              tag: 'post-${widget.post.id}',
              child: Material(
                color: Colors.transparent,
                child: Text(
                  widget.post.judul,
                  style: tema.textTheme.titleMedium,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              widget.post.isi,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
```

Buat file `test/home_and_card_widget_test.dart`:

```dart
import 'package:associate_mobile_app/models/post.dart';
import 'package:associate_mobile_app/pages/home_page.dart';
import 'package:associate_mobile_app/widgets/post_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('HomePage menampilkan tiga menu utama', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: HomePage()));

    expect(find.text('Catatan Lokal'), findsOneWidget);
    expect(find.text('Lokasi dan Peta'), findsOneWidget);
    expect(find.text('Daftar Post API'), findsOneWidget);
  });

  testWidgets('PostCard menampilkan judul dan memanggil onTap', (tester) async {
    var ditekan = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: PostCard(
            post: const Post(id: 1, judul: 'Judul kartu', isi: 'Isi kartu'),
            onTap: () => ditekan = true,
          ),
        ),
      ),
    );

    expect(find.text('Judul kartu'), findsOneWidget);

    await tester.tap(find.text('Judul kartu'));
    await tester.pump();

    expect(ditekan, isTrue);
  });
}
```

Penjelasan:
- `StatefulWidget` digunakan karena kartu perlu mengingat apakah sedang ditekan.
- `AnimatedContainer` mengubah warna latar secara halus dalam 150 milidetik.
- `Hero` dengan tag `post-{id}` yang sama di daftar dan detail membuat judul terbang saat berpindah layar.

**Checkpoint:** tekan dan tahan sebuah kartu. Warna latar berubah dengan animasi singkat.

---

## Step 7: Halaman Detail dan Hero (13.00)

Buat file `lib/pages/post_detail_page.dart`:

```dart
import 'package:flutter/material.dart';

import '../models/post.dart';
import '../services/post_service.dart';

class PostDetailPage extends StatefulWidget {
  const PostDetailPage({super.key, required this.postId});

  final int postId;

  @override
  State<PostDetailPage> createState() => _PostDetailPageState();
}

class _PostDetailPageState extends State<PostDetailPage> {
  final _service = PostService();
  late final Future<Post> _future;

  @override
  void initState() {
    super.initState();
    _future = _service.ambilById(widget.postId);
  }

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Detail Post')),
      body: FutureBuilder<Post>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Text('Gagal memuat detail: ${snapshot.error}'),
            );
          }

          final post = snapshot.requireData;
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Hero(
                tag: 'post-${post.id}',
                child: Material(
                  color: Colors.transparent,
                  child: Text(post.judul, style: tema.textTheme.headlineSmall),
                ),
              ),
              const SizedBox(height: 16),
              Text(post.isi, style: tema.textTheme.bodyLarge),
              const SizedBox(height: 16),
              Text(
                'ID post: ${post.id}',
                style: tema.textTheme.bodySmall,
              ),
            ],
          );
        },
      ),
    );
  }
}
```

Penjelasan:
- `late final Future<Post>` dibuat di `initState`. Future tidak dibuat ulang saat `build` dipanggil kembali, sehingga request tidak terkirim berulang.
- `FutureBuilder` menangani tiga kondisi: menunggu, error, dan data.
- Tag Hero sama dengan kartu di daftar, sehingga animasi berjalan otomatis.

**Checkpoint:** tekan salah satu kartu. Judul terbang dari daftar ke halaman detail.

---

## Step 8: Kirim Post Baru (13.30)

Buat file `lib/pages/post_form_page.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../models/post.dart';

class PostFormPage extends StatefulWidget {
  const PostFormPage({super.key});

  @override
  State<PostFormPage> createState() => _PostFormPageState();
}

class _PostFormPageState extends State<PostFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _judul = TextEditingController();
  final _isi = TextEditingController();

  @override
  void dispose() {
    _judul.dispose();
    _isi.dispose();
    super.dispose();
  }

  void _simpan() {
    if (!_formKey.currentState!.validate()) return;

    // id 0 menandakan post belum tersimpan; ID final berasal dari server.
    context.pop(
      Post(id: 0, judul: _judul.text.trim(), isi: _isi.text.trim()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Post Baru')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _judul,
              decoration: const InputDecoration(
                labelText: 'Judul',
                border: OutlineInputBorder(),
              ),
              validator: (value) => (value == null || value.trim().length < 3)
                  ? 'Judul minimal 3 karakter'
                  : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _isi,
              maxLines: 5,
              decoration: const InputDecoration(
                labelText: 'Isi',
                border: OutlineInputBorder(),
              ),
              validator: (value) => (value == null || value.trim().isEmpty)
                  ? 'Isi tidak boleh kosong'
                  : null,
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _simpan,
              child: const Text('Kirim'),
            ),
          ],
        ),
      ),
    );
  }
}
```

Alur kirim post:
1. Form mengembalikan object `Post` dengan `id: 0` melalui `context.pop`.
2. Halaman daftar menerima hasilnya dan memanggil `kirim` pada Cubit.
3. Cubit mengirim `POST /posts`, lalu menambahkan hasilnya di awal daftar.
4. SnackBar menampilkan hasilnya.

Catatan: JSONPlaceholder tidak menyimpan data. Post baru selalu mendapat `id` 101, dan post berikutnya juga 101. Ini wajar untuk API tiruan. Jelaskan hal ini kepada peserta agar tidak dianggap sebagai bug.

**Checkpoint:** post baru muncul di bagian atas daftar setelah dikirim.

---

## Step 9: Pengujian Lengkap (14.00)

Jalankan seluruh test:

```bash
flutter test
```

Ada tiga jenis test di proyek ini:
1. Unit test untuk fungsi murni: `test/distance_test.dart`.
2. Unit test untuk Cubit dengan `bloc_test` dan `MockClient`: `test/post_cubit_test.dart`.
3. Widget test untuk tampilan: `test/home_and_card_widget_test.dart`.

Latihan: tambahkan test untuk `kirim` yang gagal. Gunakan `MockClient` yang mengembalikan status 500, lalu pastikan `kirim` mengembalikan `false`.

**Checkpoint:** seluruh test lulus.

---

## Step 10: Build Rilis Android (14.30)

Build APK untuk pengujian internal:

```bash
flutter build apk --release
```

File hasil berada di `build/app/outputs/flutter-apk/app-release.apk`. Instal pada perangkat yang terhubung:

```bash
flutter install --release
```

Untuk publikasi ke Google Play, gunakan App Bundle:

```bash
flutter build appbundle --release
```

Hasilnya berada di `build/app/outputs/bundle/release/app-release.aab`.

Catatan: build release memakai signing debug secara default. Ini cukup untuk pelatihan, tetapi tidak boleh dipakai untuk publikasi. Untuk publikasi, buat keystore dan atur signing mengikuti panduan resmi di https://docs.flutter.dev/deployment/android.

**Checkpoint:** APK berhasil dibuat dan dapat dipasang di perangkat.

---

## Step 11: Proyek Akhir (15.00 to 17.00)

Peserta mengembangkan fitur tambahan pada `associate_mobile_app`. Pilihan:

| Pilihan | Gabungan materi |
|---|---|
| Catatan dengan kategori dan pencarian | SQLite dan Cubit |
| Post favorit yang tersimpan di SQLite | API dan database lokal |
| Catatan yang diurutkan dari yang terdekat | Lokasi, database, dan Cubit |
| Halaman profil dengan penyimpanan token | API dan penyimpanan aman |

Syarat pengumpulan:
1. `flutter analyze` tanpa error.
2. `flutter test` lulus.
3. Demo berjalan pada perangkat atau emulator.
4. Kode diunggah ke repositori masing-masing peserta.

---

## Ringkasan File

| Step | File |
|---|---|
| 1 | `lib/models/post.dart` |
| 2 | `lib/services/post_service.dart` |
| 3 | `lib/blocs/post_cubit.dart`, `test/post_cubit_test.dart` |
| 4 | `lib/router/app_router.dart` (versi lengkap) |
| 5 | `lib/pages/posts_page.dart` |
| 6 | `lib/widgets/post_card.dart`, `test/home_and_card_widget_test.dart` |
| 7 | `lib/pages/post_detail_page.dart` |
| 8 | `lib/pages/post_form_page.dart` |
| 9 | Seluruh test |
| 10 | Build APK dan App Bundle |
| 11 | Proyek akhir |
