# Instalasi Dart dan Flutter

Dart sudah termasuk di dalam Flutter SDK, jadi tidak perlu memasang Dart secara terpisah. Perintah `dart` tersedia setelah Flutter SDK dipasang dan folder `bin` masuk ke PATH.

Karena pelatihan berlangsung offline, pasang semua perangkat di bawah ini sebelum hari pelatihan dan jalankan `flutter doctor` sampai bersih. Panduan resmi (selalu mutakhir): https://docs.flutter.dev/get-started/install

## Kebutuhan Perangkat

| Kebutuhan | Keterangan |
|---|---|
| Sistem operasi | Windows 10 atau lebih baru (64-bit), macOS, atau Linux 64-bit |
| Ruang disk | Sediakan sekitar 10 GB atau lebih (SDK, Android SDK, emulator) |
| Git | Wajib. Unduh di https://git-scm.com |
| Editor | Android Studio atau VS Code dengan ekstensi Flutter dan Dart |
| Perangkat uji | Emulator Android atau ponsel Android dengan USB debugging aktif |

## 1. Pasang Flutter SDK

### Windows

1. Unduh Flutter SDK (zip) dari halaman instalasi resmi.
2. Ekstrak ke folder tanpa spasi dan tanpa izin khusus, misalnya `C:\src\flutter`. Jangan ke `C:\Program Files`.
3. Tambahkan `C:\src\flutter\bin` ke PATH: buka *Edit the system environment variables*, pilih *Environment Variables*, edit `Path` milik pengguna, tambahkan baris baru berisi `C:\src\flutter\bin`.
4. Tutup lalu buka ulang terminal (PowerShell).

### macOS

```bash
mkdir -p ~/development
cd ~/development
unzip ~/Downloads/flutter_macos_*.zip
echo 'export PATH="$HOME/development/flutter/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Untuk membuat aplikasi iOS, pasang juga Xcode dari App Store lalu jalankan `sudo xcodebuild -license accept`. Pelatihan ini berfokus pada Android sehingga iOS bersifat opsional.

### Linux

```bash
sudo apt-get update
sudo apt-get install -y curl git unzip xz-utils zip libglu1-mesa
mkdir -p ~/development
tar -xf ~/Downloads/flutter_linux_*.tar.xz -C ~/development
echo 'export PATH="$HOME/development/flutter/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Nama paket di atas untuk Ubuntu atau Debian. Distribusi lain memakai nama paket yang berbeda.

## 2. Pasang Android Studio dan Android SDK

1. Unduh Android Studio dari https://developer.android.com/studio lalu pasang.
2. Jalankan sekali dan ikuti *Setup Wizard* sampai Android SDK terunduh.
3. Buka *Settings > Languages & Frameworks > Android SDK > SDK Tools*, centang **Android SDK Command-line Tools (latest)**, lalu *Apply*.
4. Terima lisensi Android:

```bash
flutter doctor --android-licenses
```

Jawab `y` untuk setiap pertanyaan.

## 3. Pasang Editor

### Android Studio

Buka *Settings > Plugins*, cari **Flutter**, lalu pasang. Plugin Dart ikut terpasang otomatis.

### VS Code (alternatif)

Pasang VS Code, buka panel *Extensions*, cari **Flutter**, lalu pasang (ekstensi Dart ikut terpasang).

## 4. Siapkan Perangkat Uji

### Emulator

Di Android Studio buka *Device Manager*, pilih *Create Device*, pilih perangkat (misalnya Pixel), pilih image sistem, lalu *Finish* dan jalankan.

### Ponsel Android

1. Buka *Settings > About phone*, ketuk *Build number* tujuh kali untuk mengaktifkan *Developer options*.
2. Aktifkan *USB debugging* di *Developer options*.
3. Sambungkan lewat kabel USB dan setujui dialog izin debugging pada ponsel.

## 5. Verifikasi

```bash
flutter --version
dart --version
flutter doctor -v
flutter devices
```

Hasil yang diharapkan:

- `flutter --version` dan `dart --version` menampilkan versi tanpa kesalahan.
- `flutter doctor -v` menampilkan tanda centang pada *Flutter* dan *Android toolchain*. Bagian Xcode (hanya macOS) dan Visual Studio (hanya aplikasi desktop Windows) boleh diabaikan untuk pelatihan ini.
- `flutter devices` menampilkan minimal satu emulator atau ponsel.

## 6. Uji Proyek Pertama

```bash
flutter create uji_instalasi
cd uji_instalasi
flutter run
```

Aplikasi counter bawaan harus tampil di emulator atau ponsel. Setelah berhasil, folder `uji_instalasi` boleh dihapus.

## Masalah Umum

| Gejala | Penyebab dan solusi |
|---|---|
| `flutter` tidak dikenali | PATH belum benar atau terminal belum dibuka ulang. Periksa jalur `flutter/bin`. |
| `cmdline-tools component is missing` | Pasang *Android SDK Command-line Tools* di SDK Manager, lalu ulangi `flutter doctor --android-licenses`. |
| `Unable to locate Android SDK` | Jalankan `flutter config --android-sdk <jalur SDK>` atau buka Android Studio sekali agar SDK terdeteksi. |
| Ponsel tidak muncul di `flutter devices` | Ganti kabel data, aktifkan USB debugging, setujui dialog di ponsel, lalu jalankan `adb devices`. |
| Unduhan dependensi sangat lambat | Jalankan `flutter pub get` di jaringan yang stabil sebelum pelatihan agar cache `pub` terisi. |
| Flutter dipasang di `C:\Program Files` | Pindahkan ke folder tanpa spasi dan tanpa izin khusus, misalnya `C:\src\flutter`. |
