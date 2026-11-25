# PowerSync: Sinkronisasi SQLite dengan Basis Data Server

Materi ini melengkapi modul 7 (sinkronisasi offline-first). Di modul 7 Anda menulis sinkronisasi sendiri: antrean `PENDING`, POST dan PUT, serta penanganan kegagalan. PowerSync mengerjakan bagian itu untuk Anda. Memahami cara kerjanya tetap berguna, karena konsepnya sama.

Sumber resmi: [powersync.com](https://powersync.com), [dokumentasi](https://docs.powersync.com/), [SDK Flutter](https://docs.powersync.com/client-sdks/reference/flutter), dan [SDK React Native dan Expo](https://docs.powersync.com/client-sdks/reference/react-native-and-expo). Fitur dan status produk bisa berubah. Periksa dokumentasi resmi sebelum memakainya.

> Materi ini hanya untuk dipelajari. Pelatihan tidak mewajibkan PowerSync, dan proyek modul 7 tetap memakai sinkronisasi manual.

## 1. Apa itu PowerSync

PowerSync adalah mesin sinkronisasi. Ia menjaga agar SQLite lokal di setiap aplikasi sama dengan basis data server yang sudah Anda punya.

Alur besarnya:

```
Basis data server (PostgreSQL, MySQL, ...)
        │  replikasi perubahan
        ▼
PowerSync Service  ──── hanya mengirim data yang boleh dilihat pengguna ────▶  SQLite di perangkat
        ▲                                                                       │
        └──────────── tulisan dikirim lewat API backend Anda (uploadData) ◀─────┘
```

Aplikasi selalu membaca dan menulis ke SQLite lokal. Karena itu aplikasi tetap bekerja tanpa internet, dan perubahan dikirim saat koneksi kembali.

## 2. Basis data server yang didukung

Daftar di dokumentasi resmi (periksa status terbaru):

| Basis data | Status |
|---|---|
| PostgreSQL | Didukung |
| MongoDB | Didukung |
| MySQL | Beta |
| SQL Server | Beta |

Di pelatihan ini, basis data server yang diajarkan adalah MySQL (lihat [SQLite, MySQL, dan API](sqlite-mysql-api.md)). Karena MySQL masih beta, untuk produksi periksa dulu fiturnya di dokumentasi.

## 3. Konsep kunci

**Database lokal.** SDK menyimpan SQLite di perangkat. Pembacaan dan penulisan selalu menyentuh database ini dulu.

**Skema klien.** Anda mendefinisikan tabel dan kolom di aplikasi (tipe `text`, `integer`, dan `real`). SDK menambahkan kolom `id` secara otomatis.

**Antrean unggah.** Tulisan langsung diterapkan ke SQLite lokal, lalu masuk antrean. SDK memanggil `uploadData` dari konektor Anda untuk mengirimkannya ke API backend. Jika gagal, SDK mencoba lagi. Ini setara dengan status `PENDING` di modul 7.

**Konektor backend.** Kelas yang Anda tulis dengan dua metode:
- `fetchCredentials`: mengembalikan alamat layanan dan token JWT. Token disimpan sementara dan diperbarui saat perlu.
- `uploadData`: mengirim tulisan yang antre ke API backend Anda. Jika aplikasi hanya membaca, metode ini boleh dilewati.

**Sync Streams.** Aturan di sisi layanan yang menentukan data mana yang boleh diterima setiap pengguna. Klien berlangganan ke stream, dan stream dengan `auto_subscribe` langsung tersinkron saat terhubung. Data yang tidak lagi dilanggan tetap disimpan lokal selama masa berlaku default 24 jam.

## 4. Hubungan dengan modul 7

| Modul 7 (manual) | PowerSync |
|---|---|
| Status `PENDING` dan `SYNCED` di tabel lokal | Antrean unggah di dalam SDK |
| `sinkronkan()` memanggil POST dan PUT | `uploadData` di konektor Anda |
| `serverId` disimpan setelah berhasil | Diurus SDK |
| Ambil daftar dari server lalu simpan | Sync Streams mengirim perubahan otomatis |
| Aturan siapa boleh melihat data ada di API | Aturan ada di Sync Streams |

Keputusan tetap ada di tangan Anda: aturan akses data, validasi di backend, dan bentuk API tulis.

## 5. Garis besar pemasangan

Langkah-langkah ini sama untuk Flutter dan React Native:

1. Hubungkan basis data server ke PowerSync Service dan deploy Sync Streams (lihat panduan Setup di dokumentasi).
2. Definisikan skema klien di aplikasi.
3. Buat `PowerSyncDatabase` dengan skema dan nama berkas database. Satu berkas hanya boleh punya satu instance.
4. Tulis konektor backend dengan `fetchCredentials` dan `uploadData`.
5. Panggil `connect(connector)`. Baca data dengan `get`, `getAll`, atau `watch`, dan tulis dengan `execute`.

Paket yang dipakai:
- **Flutter**: paket `powersync` di pub.dev. Pasang dengan `dart pub add powersync`.
- **React Native dan Expo**: paket `@powersync/react-native` dengan driver SQLite `@op-engineering/op-sqlite`. Pasang dengan `npx expo install @powersync/react-native @op-engineering/op-sqlite`. Untuk Expo Go, dokumentasi menyarankan `@powersync/adapter-sql-js`.

Nama API dan langkah detail bisa berubah antarversi. Ikuti dokumentasi SDK yang sesuai versi yang Anda pasang.

## 6. Hal yang perlu diperhatikan

- **Kredensial**: token dan konfigurasi layanan adalah rahasia. Jangan memasukkannya ke repositori.
- **Keamanan**: aturan Sync Streams harus membatasi data per pengguna. Aturan yang longgar membocorkan data pengguna lain.
- **Validasi tulisan**: `uploadData` hanya meneruskan tulisan ke API Anda. API tetap harus memeriksa izin dan isi data.
- **Biaya**: layanan cloud punya paket gratis dan berbayar. Harga tidak dicantumkan di materi ini karena berubah. Lihat halaman harga resmi.
- **Ketergantungan**: menggunakan PowerSync berarti menambah layanan dan SDK pihak ketiga. Pertimbangkan dulu apakah sinkronisasi manual sudah cukup untuk kebutuhan aplikasi.

## 7. Latihan (tanpa menjalankan PowerSync)

1. Gambarkan alur satu catatan baru dari layar aplikasi sampai masuk ke basis data server, lalu tandai bagian mana yang ditangani SDK dan bagian mana yang Anda tulis.
2. Dari sinkronisasi manual di modul 7, sebutkan dua kasus yang paling sulit ditangani sendiri. Jelaskan bagaimana konsep antrean dan konektor PowerSync membantu keduanya.
3. Anda membuat aplikasi catatan pribadi. Tulis satu aturan Sync Stream yang membatasi setiap pengguna hanya melihat catatannya sendiri.

## Lihat juga

- [SQLite, MySQL, dan API](sqlite-mysql-api.md): gambaran umum dan layanan pendukung lain.
- [Menjalankan proyek](menjalankan-proyek.md): cara menjalankan proyek di HP dan emulator.
- Modul 7 Flutter: [API lanjutan dan sinkronisasi](../../flutter/docs/hari-2/07-api-lanjutan-sinkronisasi.md).
