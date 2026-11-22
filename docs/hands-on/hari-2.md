# Hands-On Hari 2: State Management, REST API Publik, dan Rilis

Hari 2 melanjutkan proyek `associate_mobile_app` dari Hari 1. Semua kode sudah tersedia di `app/`.

**API publik yang digunakan:** [JSONPlaceholder](https://jsonplaceholder.typicode.com), REST API tiruan tanpa API key.

**Waktu:** 09.00 to 17.00 (istirahat 12.00 to 13.00)

---

## Step 0: Persiapan (09.00)

Pastikan proyek Hari 1 masih berjalan:

```bash
flutter pub get
flutter analyze
```

Uji API publik langsung di browser. Buka tautan berikut dan pastikan muncul data JSON:

- https://jsonplaceholder.typicode.com/posts?_limit=3
- https://jsonplaceholder.typicode.com/posts/1

**Checkpoint:** peserta melihat data JSON di browser. Jika tidak muncul, periksa koneksi internet.

---

## Step 1: Model Post (09.15)

Buka `lib/models/post.dart`. Bahas:
1. Pemetaan key JSON (`title`, `body`) ke properti Dart (`judul`, `isi`).
2. `factory fromJson` untuk membaca respons dari API.
3. `toJson` untuk mengirim data ke API.
4. `Equatable` agar dua object dengan nilai sama dianggap setara. Ini penting untuk test Cubit.

**Checkpoint:** peserta dapat menulis ulang `fromJson` untuk key `id` dari JSON contoh di browser.

---

## Step 2: Layanan API (09.45)

Buka `lib/services/post_service.dart`. Bahas:
1. `http.Client` diinjeksi lewat konstruktor. Ini memudahkan pengujian tanpa internet.
2. Setiap method memeriksa status code: `GET` menerima 200, `POST` menerima 201.
3. `timeout` mencegah aplikasi menunggu tanpa batas.

Diskusi: bagaimana jika koneksi terputus? (Pengecualian akan dilempar dan ditangkap oleh Cubit.)

**Checkpoint:** peserta dapat menyebutkan dua method yang dipakai (`ambilSemua`, `ambilById`) dan satu method untuk mengirim data (`tambah`).

---

## Step 3: State dengan Cubit (10.15)

Buka `lib/blocs/post_cubit.dart`. Bahas:
1. `PostStatus` sebagai daftar kemungkinan kondisi: awal, memuat, berhasil, dan gagal.
2. `PostState` yang immutable dan menggunakan `Equatable`.
3. Method `load()` yang memancarkan `memuat`, lalu `berhasil` atau `gagal`.
4. Method `kirim()` yang menambahkan post baru di awal daftar.

Perbedaan dengan Hari 1: Hari 1 menggunakan `ChangeNotifier`, sedangkan Cubit memisahkan state menjadi object tersendiri dan aliran perubahan dapat diuji.

**Checkpoint:** jalankan test Cubit sekarang:

```bash
flutter test test/post_cubit_test.dart
```

Kedua test harus lulus.

---

## Step 4: Routing dan Penyediaan Cubit (10.45)

Buka `lib/router/app_router.dart`. Perhatikan:
1. Cubit dibuat di dalam route `/post` menggunakan `BlocProvider`. Cubit hanya hidup selama layar tersebut ada.
2. Urutan route: `/post/baru` harus didaftarkan sebelum `/post/:id`. Jika terbalik, kata `baru` dianggap sebagai ID.

Latihan: pindahkan `/post/baru` ke bawah `/post/:id`, lalu jalankan aplikasi dan tekan **Post baru**. Jelaskan apa yang terjadi, lalu kembalikan urutannya.

---

## Step 5: Daftar Post dengan BlocBuilder (11.00)

Buka `lib/pages/posts_page.dart`. Bahas:
1. `BlocBuilder` membangun ulang UI setiap kali state berubah.
2. Penanganan lima kondisi: loading awal, gagal tanpa data, data kosong, berhasil, dan pull to refresh.
3. `RefreshIndicator` memanggil `load()` kembali.

Jalankan aplikasi, buka **Daftar Post API**. Matikan internet sebentar, lalu tarik ke bawah untuk memuat ulang. Pesan kesalahan muncul dengan tombol **Coba lagi**.

**Checkpoint:** peserta dapat menjelaskan perbedaan `PostStatus.memuat` dan `PostStatus.gagal`.

---

## Step 6: Kartu Post dan Animasi (11.30)

Buka `lib/widgets/post_card.dart`. Bahas:
1. `StatefulWidget` digunakan karena kartu perlu menyimpan status ditekan.
2. `AnimatedContainer` mengubah warna latar secara halus.
3. `Hero` dengan `tag` unik `post-{id}` untuk animasi antarlayar.

Tekan dan tahan sebuah kartu. Warna latar berubah dengan animasi singkat.

**Checkpoint:** jalankan test widget:

```bash
flutter test test/home_and_card_widget_test.dart
```

---

## Step 7: Detail Post dan Hero (13.00)

Setelah makan siang, buka `lib/pages/post_detail_page.dart`. Bahas:
1. `late final Future<Post>` diinisialisasi di `initState` agar tidak dipanggil ulang saat widget dibangun ulang.
2. `FutureBuilder` menangani tiga kondisi: menunggu, error, dan data.
3. `Hero` dengan tag yang sama dengan kartu di daftar.

Tekan salah satu kartu. Perhatikan judul yang terbang dari daftar ke layar detail.

**Checkpoint:** animasi Hero berjalan saat berpindah layar.

---

## Step 8: Kirim Post Baru (13.30)

Buka `lib/pages/post_form_page.dart`, lalu kembali ke `lib/pages/posts_page.dart` pada bagian `floatingActionButton`. Alur:
1. Form mengembalikan object `Post` dengan `id: 0` melalui `context.pop`.
2. Halaman daftar memanggil `kirim(post)` pada Cubit.
3. Cubit mengirim `POST /posts`, lalu menambahkan hasilnya di awal daftar.
4. SnackBar menampilkan hasil.

Catatan penting: JSONPlaceholder tidak menyimpan data. Post baru selalu mendapat `id` 101, dan post berikutnya juga 101. Ini wajar untuk API tiruan. Jelaskan perbedaan ini kepada peserta.

**Checkpoint:** post baru muncul di bagian atas daftar setelah dikirim.

---

## Step 9: Pengujian (14.00)

Jalankan seluruh test:

```bash
flutter test
```

Bahas tiga jenis test yang ada:
1. Unit test untuk fungsi murni (`distance_test.dart`).
2. Unit test untuk Cubit dengan `bloc_test` dan `MockClient` (`post_cubit_test.dart`).
3. Widget test untuk tampilan (`home_and_card_widget_test.dart`).

Latihan: tambahkan test untuk kondisi `kirim` yang gagal, dengan `MockClient` yang mengembalikan status 500.

**Checkpoint:** seluruh test lulus.

---

## Step 10: Animasi Implicit Tambahan (14.30)

Sebagai latihan, tambahkan `AnimatedOpacity` pada daftar.

Contoh pada `posts_page.dart`, bungkus `RefreshIndicator` dengan:

```dart
AnimatedOpacity(
  duration: const Duration(milliseconds: 300),
  opacity: state.status == PostStatus.memuat ? 0.5 : 1,
  child: /* RefreshIndicator yang sudah ada */,
)
```

Jalankan aplikasi, lalu tarik ke bawah untuk memuat ulang dan amati perubahan opasitas.

---

## Step 11: Build Rilis Android (15.00)

Build APK untuk pengujian internal:

```bash
flutter build apk --release
```

File hasil berada di `build/app/outputs/flutter-apk/app-release.apk`. Instal pada perangkat dengan:

```bash
flutter install --release
```

Untuk publikasi ke Google Play, gunakan App Bundle dan keystore khusus. Panduan resminya tersedia di https://docs.flutter.dev/deployment/android.

```bash
flutter build appbundle --release
```

Catatan: build release memakai signing debug secara default. Ini cukup untuk pelatihan, tetapi tidak boleh dipakai untuk publikasi.

**Checkpoint:** APK berhasil dibuat dan dapat dipasang di perangkat.

---

## Step 12: Proyek Akhir (15.30 to 17.00)

Peserta mengembangkan fitur tambahan pada `associate_mobile_app`. Pilihan:

| Pilihan | Gabungan materi |
|---|---|
| Catatan dengan kategori dan pencarian | SQLite + Cubit |
| Post favorit yang tersimpan di SQLite | API + database lokal |
| Catatan dengan lokasi yang diurutkan dari terdekat | Lokasi + database + Cubit |
| Halaman profil dengan penyimpanan token | API + penyimpanan aman |

Syarat pengumpulan:
1. `flutter analyze` tanpa error.
2. `flutter test` lulus.
3. Demo berjalan pada perangkat atau emulator.
4. Kode diunggah ke repositori masing-masing peserta.

---

## Ringkasan

| Step | Berkas utama |
|---|---|
| 1 | `models/post.dart` |
| 2 | `services/post_service.dart` |
| 3 | `blocs/post_cubit.dart` |
| 4 | `router/app_router.dart` |
| 5 | `pages/posts_page.dart` |
| 6 | `widgets/post_card.dart` |
| 7 | `pages/post_detail_page.dart` |
| 8 | `pages/post_form_page.dart` |
| 9 | `test/post_cubit_test.dart`, `test/home_and_card_widget_test.dart` |
| 10 | Latihan `AnimatedOpacity` |
| 11 | Build APK dan App Bundle |
