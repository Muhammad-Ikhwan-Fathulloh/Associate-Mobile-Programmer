# Hands-On Hari 1: Dasar Flutter, Database Lokal, dan Lokasi

Panduan ini membangun aplikasi `associate_mobile_app` dari awal sampai bisa dijalankan. Kode lengkap sudah tersedia di folder `app/` sebagai referensi dan hasil akhir.

**Waktu:** 09.00 to 17.00 (istirahat 12.00 to 13.00)

**Perangkat:** laptop dengan Flutter SDK, Android Studio, dan emulator Android atau perangkat Android fisik.

---

## Step 0: Cek Lingkungan (09.00)

```bash
flutter doctor
```

Pastikan tidak ada tanda silang pada bagian *Flutter*, *Android toolchain*, dan *Connected device*. Tanda seru pada *Xcode* hanya relevan untuk iOS dan boleh diabaikan saat praktik Android.

Cek perangkat:

```bash
flutter devices
```

**Checkpoint:** emulator atau perangkat Android muncul pada daftar.

---

## Step 1: Buat Proyek Baru (09.15)

```bash
flutter create --org id.ac.associate associate_mobile_app
cd associate_mobile_app
```

Hapus file test bawaan Flutter yang tidak dipakai:

```bash
rm test/widget_test.dart
```

Salin kode dari repository ke proyek. Ganti `<REPO>` dengan lokasi folder repository di komputer Anda:

```bash
cp -r <REPO>/app/lib .
cp -r <REPO>/app/test .
cp <REPO>/app/pubspec.yaml .
cp <REPO>/app/analysis_options.yaml .
```

Pada Windows, salin keempat item tersebut menggunakan File Explorer, dan timpa file yang sudah ada.

Unduh dependensi:

```bash
flutter pub get
```

**Checkpoint:** `flutter analyze` selesai tanpa error. Peringatan kecil yang tersisa boleh diabaikan.

---

## Step 2: Konfigurasi Izin (10.00)

### Android

Buka `android/app/src/main/AndroidManifest.xml`, lalu tambahkan di dalam tag `<manifest>`, sebelum tag `<application>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### iOS (hanya jika menggunakan Mac)

Buka `ios/Runner/Info.plist`, lalu tambahkan di dalam `<dict>`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Lokasi digunakan untuk menampilkan posisi Anda pada peta dan catatan.</string>
```

**Checkpoint:** file tersimpan tanpa kesalahan format XML.

---

## Step 3: Jalankan Aplikasi Pertama (10.15)

```bash
flutter run
```

Jika aplikasi berjalan, layar beranda menampilkan tiga menu: Catatan Lokal, Lokasi dan Peta, dan Daftar Post API.

Eksperimen singkat:
1. Ubah warna `colorSchemeSeed` di `lib/app.dart` dari `Colors.indigo` menjadi `Colors.teal`.
2. Simpan file, lalu tekan `r` di terminal untuk hot reload.
3. Tekan `R` untuk hot restart, dan bandingkan hasilnya.

Kembalikan warna ke `Colors.indigo` sebelum melanjutkan.

**Checkpoint:** peserta dapat menjelaskan perbedaan hot reload dan hot restart.

---

## Step 4: Model Data (10.45)

Buka `lib/models/note.dart`. Bahas tiga bagian:
1. Konstruktor dan factory `Note.baru` yang mengisi waktu saat ini.
2. Method `toMap` untuk menulis ke database.
3. Factory `fromMap` untuk membaca dari database.

Latihan: tambahkan properti `kategori` bertipe `String?`, lalu sertakan di `toMap` dan `fromMap`. Hapus perubahan ini setelah latihan selesai.

**Checkpoint:** `flutter analyze` tetap tanpa error.

---

## Step 5: Database SQLite (11.00)

Buka `lib/data/app_database.dart`. Bahas:
1. Konsep singleton: database dibuka sekali dan disimpan di variabel statis.
2. `onCreate` untuk membuat tabel `notes` dan indeks.
3. `PRAGMA foreign_keys` untuk mengaktifkan relasi (dipakai pada latihan).

Diskusi: mengapa `updated_at` diberi indeks? (agar pengurutan daftar catatan lebih cepat).

**Checkpoint:** peserta dapat menyebutkan kolom-kolom di tabel `notes`.

---

## Step 6: Repository dan Controller (11.20)

Buka `lib/data/note_repository.dart`. Setiap method menerima atau mengembalikan object `Note`, sehingga UI tidak perlu mengetahui detail SQL.

Buka `lib/blocs/note_controller.dart`. Bahas:
1. `ChangeNotifier` dan `notifyListeners()`.
2. Perbedaan `isLoading` dan `error`.
3. Mengapa `tambah` dan `hapus` memanggil `load()` kembali.

**Checkpoint:** peserta dapat menjelaskan alur data dari UI ke repository dan kembali.

---

## Step 7: Halaman Catatan dan CRUD (13.00)

Buka `lib/pages/notes_page.dart`, lalu `lib/pages/note_form_page.dart`.

Bahas alur:
1. Tombol + membuka form dengan `context.push<Note>('/catatan/baru')`.
2. Form mengembalikan object `Note` melalui `context.pop(...)`.
3. Daftar memanggil `_controller.tambah(catatan)` setelah menerima hasil.
4. Tombol hapus memanggil `_controller.hapus(id)`.

Jalankan aplikasi, buka menu **Catatan Lokal**, lalu:
1. Tambahkan dua catatan dengan judul minimal tiga karakter.
2. Hapus satu catatan.
3. Tutup aplikasi sepenuhnya, buka kembali, dan pastikan catatan masih ada.

**Checkpoint:** data bertahan setelah aplikasi ditutup dan dibuka kembali. Ini membuktikan persistensi SQLite berjalan.

---

## Step 8: Layanan Lokasi (14.00)

Buka `lib/services/location_service.dart`. Bahas:
1. Urutan pemeriksaan: layanan lokasi aktif, lalu izin.
2. `LocationException` sebagai pesan error yang dapat ditampilkan ke pengguna.
3. Perbedaan `ambilPosisi` (satu kali) dan `pantauPosisi` (stream).

Buka `lib/services/distance.dart`. Jelaskan rumus Haversine dan bandingkan dengan `Geolocator.distanceBetween`.

Kembali ke **Catatan Lokal**, tekan ikon lokasi di AppBar. Jika izin diberikan, setiap catatan yang memiliki koordinat menampilkan jarak.

**Checkpoint:** izin lokasi muncul saat pertama kali diminta, dan jarak tampil setelah posisi diperoleh.

---

## Step 9: Peta dan Alamat (14.45)

Buka `lib/pages/location_page.dart`. Bahas:
1. `FlutterMap` dengan `TileLayer` dari OpenStreetMap. Tidak memerlukan API key.
2. `MarkerLayer` untuk menandai posisi pengguna.
3. `RichAttributionWidget` wajib dicantumkan sesuai kebijakan OpenStreetMap.
4. Reverse geocoding melalui Nominatim di `alamatDari`.

Jalankan menu **Lokasi dan Peta**, lalu tekan **Perbarui posisi**. Peta bergerak ke posisi pengguna dan alamat tampil di bawah.

**Checkpoint:** marker dan alamat tampil. Jika alamat kosong, periksa koneksi internet.

---

## Step 10: Pengujian (15.30)

```bash
flutter test test/distance_test.dart
flutter test test/home_and_card_widget_test.dart
```

Jalankan keduanya. Jika `distance_test` gagal, periksa rumus di `distance.dart`.

**Checkpoint:** seluruh test Hari 1 lulus.

---

## Latihan Mandiri (16.00)

1. Tambahkan fitur edit catatan. Gunakan `NoteRepository.ubah` yang sudah tersedia.
2. Urutkan daftar catatan dari yang terdekat ke yang terjauh (gunakan `jarakMeter`).
3. Tambahkan `pantauPosisi` pada halaman lokasi agar marker bergerak mengikuti pengguna.

---

## Ringkasan

| Step | Berkas utama |
|---|---|
| 1 to 3 | `pubspec.yaml`, `lib/app.dart`, `lib/main.dart`, `AndroidManifest.xml` |
| 4 to 6 | `models/note.dart`, `data/app_database.dart`, `data/note_repository.dart`, `blocs/note_controller.dart` |
| 7 | `pages/notes_page.dart`, `pages/note_form_page.dart` |
| 8 | `services/location_service.dart`, `services/distance.dart` |
| 9 | `pages/location_page.dart` |
| 10 | `test/distance_test.dart`, `test/home_and_card_widget_test.dart` |
