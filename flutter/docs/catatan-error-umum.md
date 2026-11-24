# Catatan Error Umum (Flutter)

Kumpulan error yang muncul saat pelatihan, beserta penyebab dan cara mengatasinya. Setiap error ditulis dengan pesan yang sama seperti di terminal atau konsol, supaya mudah dicari.

Tautan terkait: [instalasi Dart dan Flutter](instalasi-dart-flutter.md), [setup Android Studio dan editor](setup-android-studio-dan-editor.md), [menjalankan proyek](../../shared/docs/menjalankan-proyek.md).

## 1. Emulator Android

### `The Android emulator exited with code 1 during startup` (disertai `Address these issues and try again`)

Emulator gagal menyala. Jalankan emulator langsung dengan log lengkap untuk melihat penyebabnya:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd Pixel_7 -verbose
```

Ganti `Pixel_7` dengan nama AVD Anda. Cari baris yang diawali `FATAL` atau `ERROR`.

### `FATAL | Not enough space to create userdata partition`

Ruang kosong di drive tempat AVD disimpan kurang dari sekitar 12 GB. Pindahkan AVD ke drive lain, atau hapus AVD yang tidak dipakai lewat Device Manager. Langkah pemindahan ada di [setup Android Studio dan editor](setup-android-studio-dan-editor.md).

### `ERROR | Unknown AVD name [Pixel_7]` atau `there is no file Pixel_7.ini`

Emulator tidak menemukan AVD di lokasi yang diharapkan. Biasanya `ANDROID_AVD_HOME` sudah diubah, tetapi terminal masih memakai nilai lama. Cek nilainya:

```powershell
echo $env:ANDROID_AVD_HOME
```

Jika kosong atau salah, atur ulang, lalu buka terminal baru:

```powershell
[Environment]::SetEnvironmentVariable('ANDROID_AVD_HOME','D:\Android\avd','User')
```

### `flutter emulators` menampilkan `No emulators available`

Terminal yang dipakai belum membaca `ANDROID_AVD_HOME` yang baru. Tutup semua terminal, termasuk yang ada di VS Code atau Antigravity, lalu buka lagi. Di terminal yang sudah terlanjur terbuka, atur nilainya langsung:

```powershell
$env:ANDROID_AVD_HOME = 'D:\Android\avd'
flutter emulators
```

### Emulator tampil di Device Manager tetapi tidak muncul di `flutter emulators`

Penyebabnya sama dengan di atas: variabel lingkungan di terminal tidak sama dengan Android Studio. Pastikan kedua-duanya menunjuk ke folder AVD yang sama.

### `Warning: This version only understands SDK XML versions up to 3`

Command-line Tools yang terpasang lebih lama daripada SDK yang dipakai Android Studio. Ini hanya peringatan dan tidak menghentikan proses. Perbarui **Android SDK Command-line Tools (latest)** lewat SDK Manager.

### `1 of 8 SDK package license not accepted. Review license ... (y/N)?`

Lisensi komponen SDK belum disetujui. Ketik `y` dan Enter untuk setiap lisensi, lalu jalankan `flutter doctor`.

### Virtualisasi tidak aktif

Pada Windows, emulator butuh virtualisasi. Cek di Task Manager (tab Performance, CPU) bahwa **Virtualization** bernilai **Enabled**. Jika tidak, aktifkan Intel VT-x atau AMD-V di BIOS, dan aktifkan **Hypervisor Platform** di Windows Features.

## 2. SDK dan pemindahan folder

### `Access is denied` atau `ERROR 5` saat memindahkan folder SDK

Ada proses yang masih mengunci berkas, biasanya `adb.exe`. Hentikan server adb, lalu ulangi pemindahan:

```powershell
adb kill-server
```

### Android Studio membuat ulang folder SDK di drive C setelah SDK dipindahkan

Android Studio masih menunjuk ke lokasi lama. Buka **Settings > Languages & Frameworks > Android SDK**, lalu ubah **Android SDK Location** ke `D:\Android\Sdk`.

### `flutter doctor` tidak menemukan Android SDK

Atur lokasi SDK untuk Flutter:

```powershell
flutter config --android-sdk "D:\Android\Sdk"
```

## 3. Proyek Flutter

### `Error on line 2, column 29: Mapping values are not allowed here` saat `flutter pub get`

Nilai `description` di `pubspec.yaml` mengandung titik dua dan tidak diberi tanda kutip. Tulis nilainya di dalam kutip ganda, misalnya `description: "Modul 1 Flutter: Kartu Kenal Digital."`.

### `flutter test` gagal dengan `widget_test.dart`

`flutter create` membuat berkas tes contoh bernama `test/widget_test.dart`. Berkas itu tidak sesuai dengan aplikasi di proyek ini, jadi hapus berkas tersebut.

### `Unused import` atau `prefer_const_constructors` saat `flutter analyze`

Ini peringatan dari analisis kode. Hapus impor yang tidak dipakai, atau tambahkan `const` pada widget yang nilainya tetap.

### `The URI 'package:flutter_lints/flutter_lints.yaml' ... can't be found`

Nama berkas yang di-include salah. Untuk paket `flutter_lints` versi 4, gunakan `include: package:flutter_lints/flutter.yaml` di `analysis_options.yaml`.

### Folder `android/` tidak ada saat menjalankan proyek di emulator

Proyek belum punya folder platform. Jalankan `flutter create . --platforms android`. File di `lib/` dan `test/` tidak ditimpa.

## 4. Web (`flutter run -d chrome`)

### `ncaught (in promise) DartError: Assertion failed ... ViewInsets cannot be negative`

Assertion dari engine Flutter web. Biasanya muncul saat kolom isian mendapat fokus dan ukuran jendela browser berubah, terutama ketika keyboard virtual ditutup. Saran:
- Jangan mengubah ukuran jendela Chrome saat kolom isian sedang aktif.
- Coba `flutter run -d chrome --release` untuk melihat apakah error hanya terjadi di mode debug.
- Jalankan `flutter upgrade`, lalu cek apakah error masih ada.

### Error SQLite saat dijalankan di web (modul 3, 4, 7, dan capstone-contoh)

Paket `sqflite` hanya berjalan di Android dan iOS. Di browser tidak ada implementasi SQLite. Jalankan proyek tersebut di emulator atau HP. Web hanya didukung untuk modul 1, 2, 5, dan 8.

### Modul 5 atau 8 di web tidak menampilkan data MockAPI

Pastikan alamat di `lib/config.dart` sudah diganti dari `GANTI-ID`. Jika alamat sudah benar, periksa konsol browser (F12) untuk galat CORS atau HTTP.

## 5. Lokasi dan GPS

### Pesan `Izin lokasi ditolak. Tempat tetap disimpan tanpa koordinat.`

Izin lokasi belum diberikan. Saat aplikasi meminta izin, pilih **While using the app** (atau **Allow**). Jika terlanjur menolak, buka pengaturan aplikasi di emulator atau HP dan berikan izin lokasi secara manual.

### Lokasi tidak terbaca di emulator, atau aplikasi menunggu lama

Dua penyebab umum:
- **Izin di `AndroidManifest.xml` belum ada.** Pastikan `ACCESS_FINE_LOCATION` dan `ACCESS_COARSE_LOCATION` ada di `android/app/src/main/AndroidManifest.xml` (proyek modul 4 dan capstone-contoh). Setelah mengubah manifest, jalankan ulang aplikasi dari awal, bukan dengan hot reload.
- **Emulator belum diberi lokasi.** Di emulator, buka **Extended controls > Location**, isi latitude dan longitude (misalnya `-6.1754` dan `106.8272`), lalu klik **Send**.

Di proyek modul 4, tombol "Jarak dari saya" sekarang memakai akurasi sedang, batas waktu 8 detik, dan lokasi terakhir sebagai cadangan. Tombol juga menampilkan "Mencari posisi..." selama proses berjalan, jadi tidak terkesan macet.

### Pesan `Pesan: Lokasi terlalu lama didapat. Coba lagi di tempat terbuka.`

GPS belum memberi posisi dalam batas waktu. Atur lokasi di emulator seperti di atas, atau coba lagi di tempat terbuka saat memakai HP.

## 6. Sensor dan perangkat

### Sensor tidak berfungsi di emulator

Emulator punya sensor yang terbatas. Akselerometer dan kompas sebaiknya diuji di HP fisik. Di emulator, nilai sensor mungkin tetap atau tidak berubah.

## 7. MockAPI dan jaringan

### `Server tidak dapat dijangkau` atau `Gunakan HTTPS`

- Alamat masih `GANTI-ID`. Ganti dengan ID project MockAPI Anda di `lib/config.dart` atau `src/config.ts`.
- Alamat memakai `http://`. MockAPI hanya memakai HTTPS, jadi gunakan `https://`.
- Koneksi internet di emulator atau HP tidak aktif.

### `Permintaan melewati batas waktu` atau `Server terlalu lama merespons`

Jaringan lambat atau server tidak merespons. Coba lagi. Jika sering terjadi, periksa koneksi internet dan alamat resource MockAPI.

## 8. Menjalankan dan menghentikan aplikasi

### Aplikasi tetap berjalan di emulator setelah `flutter run` dihentikan

Hentikan dengan **q** di terminal `flutter run`, atau tutup dari **Recent apps**. Untuk menghentikan paksa dari terminal:

```powershell
adb shell am force-stop <nama.paket>
```

Nama paket ada di `applicationId` dalam `android/app/build.gradle.kts`.

### `INSTALL_FAILED_USER_RESTRICTED` di HP fisik

Di HP, aktifkan **Install via USB** di Developer options.

### HP tidak muncul di `flutter devices`

Ganti kabel data, aktifkan USB debugging, setujui dialog di HP, lalu jalankan `adb devices`. Jika memakai Wi-Fi debugging, pastikan HP dan laptop memakai jaringan yang sama.
