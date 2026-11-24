# Modul 5: API dan Menghubungkan Aplikasi Mobile

**Durasi:** 09.00 to 10.00 (Hari 2, sesi API)

**Unit kompetensi BNSP:** J.612000.025.01

by [Muhammad Ikhwan Fathulloh](https://one.nocturnailed.com/)

Modul ini sejajar dengan jalur React Native (`reactnative/docs/hari-2/05-api-dasar.md`). Bacaan tentang jaringan seluler ada di [Mobile Cellular Network](05-mobile-cellular-network.md) dan dipakai sebagai latar belakang.

## Pengantar

Aplikasi yang hanya menyimpan data di ponsel cepat terbatas. Pengguna ingin data yang sama di beberapa perangkat, dan tim ingin melayani banyak aplikasi dari satu tempat. Itu pekerjaan API: aplikasi meminta data lewat internet, server menjawab dengan format yang bisa dibaca mesin. Modul ini membangun klien API pertama kita dengan paket `http`.

## Tujuan Pembelajaran

1. Menjelaskan apa itu API dan cara kerja permintaan dan jawaban.
2. Memakai metode HTTP dan membaca kode status.
3. Menjalankan server latihan dan memanggilnya dari Flutter.
4. Memisahkan klien API dari tampilan.
5. Menangani kegagalan dengan pesan yang ramah.

## 1. Apa itu API

- API adalah kontrak: alamat (`/notes`), metode (`GET`, `POST`), dan format data (JSON).
- Aplikasi mengirim **permintaan**, server mengirim **jawaban** dengan kode status.
- Tampilan tidak boleh tahu detail jaringan. Tugas itu ada di lapisan klien API.

## 2. Metode dan kode status

| Metode | Arti | Contoh |
|---|---|---|
| `GET` | Ambil data | `GET /notes` |
| `POST` | Buat data | `POST /notes` |
| `PUT` | Ubah data yang ada | `PUT /notes/3` |
| `DELETE` | Hapus data | `DELETE /notes/3` |

| Kode | Arti | Yang ditampilkan ke pengguna |
|---|---|---|
| 200 / 201 | Berhasil | Data baru tampil |
| 204 | Berhasil tanpa isi | Tidak ada JSON yang dibaca |
| 400 | Data tidak valid | Pesan dari server, mis. "Judul wajib diisi." |
| 401 | Belum login atau token salah | Pesan dari server |
| 500 | Server bermasalah | Pesan umum, coba lagi nanti |

## 3. Server latihan

Server latihan ada di `shared/server`. Jalankan dulu di terminal lain:

```bash
cd shared/server
npm install
npm start           # http://localhost:3000
```

Akun latihan: `peserta@contoh.id` dengan kata sandi `rahasia123`. Emulator Android memanggil komputer lewat `10.0.2.2`. Ponsel fisik memakai IP komputer di Wi-Fi yang sama.

## 4. Memanggil API dengan `http`

Tambahkan paket dengan `flutter pub add http`. Permintaan dibuat dengan `http.Request`, lalu dikirim dengan batas waktu:

```dart
final req = http.Request('GET', Uri.parse('$base/notes'));
req.headers['Authorization'] = 'Bearer $token';
final res = await http.Response.fromStream(await client.send(req).timeout(const Duration(seconds: 10)));
final data = jsonDecode(res.body);
```

Batas waktu penting. Tanpa `timeout`, aplikasi bisa menunggu tanpa akhir saat jaringan buruk.

## 5. Klien API

Semua pemanggilan ada di satu kelas, `ApiClient`, di `lib/services/api_client.dart`. Tampilan hanya memanggil metode seperti `login` atau `daftarCatatan`:

```dart
class ApiClient {
  ApiClient(this.baseUrl, {http.Client? client}) : _client = client ?? http.Client();

  final String baseUrl;
  final http.Client _client;
  static const _batas = Duration(seconds: 10);

  Future<String> login(String email, String password) async {
    final r = await _kirim('POST', '/login', body: {'email': email, 'password': password});
    return (r as Map)['token'] as String;
  }

  Future<List<dynamic>> daftarCatatan(String token) async =>
      (await _kirim('GET', '/notes', token: token)) as List<dynamic>;
}
```

Kelas ini menerima `http.Client` dari luar. Itu memungkinkan pengujian dengan `MockClient` tanpa server.

## 6. Menangani kegagalan

- `ApiException` membawa kode status dan pesan dari server. Tampilkan pesannya, bukan teks teknis.
- Status 204 tidak punya isi. Jangan memanggil `jsonDecode` pada badan kosong.
- Alamat HTTP publik ditolak. `periksaUrlApi` hanya mengizinkan HTTP ke alamat lokal untuk pengembangan.

## Latihan

1. Jalankan server, lalu login dengan kata sandi yang salah. Pastikan pesan 401 tampil di aplikasi.
2. Buat catatan dengan judul kosong. Pastikan pesan 400 tampil.
3. Matikan server, lalu tekan tombol. Pastikan aplikasi menampilkan pesan dan tidak macet.

## Proyek Modul: Klien API Catatan

Hubungkan aplikasi ke server latihan. Pengguna login, melihat daftar catatan, dan membuat catatan baru. Kesalahan server ditampilkan dengan pesan yang ramah.

Brief lengkap, kriteria penerimaan, dan rubrik: [shared/docs/proyek](../../../shared/docs/proyek/modul-5-klien-api-catatan.md).

## Peta Kompetensi BNSP

Unit **J.612000.025.01**. Elemen yang dinilai:

- Memahami arsitektur jaringan seluler
- Memahami protokol dan Mobile IP
- Mengakses jaringan dari aplikasi

Bukti pada pelatihan ini: `lib/services/api_client.dart`, `lib/pages/sinkron_page.dart`, dan `test/api_client_test.dart`.

Praktik langkah demi langkah: [hands-on Hari 2](../hands-on/hari-2.md).
