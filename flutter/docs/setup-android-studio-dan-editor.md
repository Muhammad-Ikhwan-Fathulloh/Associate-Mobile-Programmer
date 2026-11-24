# Setup Android Studio (Emulator) dan Editor untuk Flutter

Panduan ini menyiapkan emulator Android dari Android Studio, lalu menghubungkannya ke VS Code atau Antigravity. Pemasangan Flutter SDK ada di [instalasi Dart dan Flutter](instalasi-dart-flutter.md). Cara menjalankan di HP fisik dan emulator ada di [menjalankan proyek](../../shared/docs/menjalankan-proyek.md).

## 1. Pasang Android Studio dan Android SDK

1. Pasang [Android Studio](https://developer.android.com/studio). Saat pertama dibuka, pilih **Standard** di wizard agar Android SDK ikut terpasang.
2. Buka **More Actions > SDK Manager**.
3. Di tab **SDK Platforms**, centang **Android 15 (API 35)** atau **Android 14 (API 34)**.
4. Di tab **SDK Tools**, pastikan terpasang:
   - Android SDK Build-Tools
   - Android SDK Command-line Tools (latest)
   - Android Emulator
   - Android SDK Platform-Tools
5. Klik **Apply**, setujui lisensi, lalu tunggu unduhan selesai.

Setelah itu, di terminal jalankan:

```powershell
flutter doctor --android-licenses
flutter doctor
```

Setujui semua lisensi dengan `y`. Pada hasil `flutter doctor`, baris **Android toolchain** harus bertanda centang. Jika Flutter tidak menemukan SDK, jalankan `flutter config --android-sdk "C:\Users\<nama>\AppData\Local\Android\Sdk"` sesuai lokasi di SDK Manager.

## 2. Buat emulator (AVD)

1. Buka **More Actions > Virtual Device Manager**.
2. Klik **Create Virtual Device**, pilih ponsel (misalnya Pixel 7), lalu **Next**.
3. Pilih image sistem **API 34 atau 35** dengan ABI **x86_64**. Klik **Download** bila belum ada, lalu **Next** dan **Finish**.
4. Klik ikon **Play** di baris perangkat, dan tunggu layar beranda Android tampil.

Emulator bisa dinyalakan dari Android Studio atau dari terminal:

```powershell
flutter emulators
flutter emulators --launch <id-emulator>
```

Pada Windows, virtualisasi harus aktif di BIOS (Intel VT-x atau AMD-V) dan fitur Hypervisor Platform di Windows Features.

## 3. Pakai VS Code

1. Pasang [VS Code](https://code.visualstudio.com).
2. Buka panel **Extensions** (Ctrl+Shift+X), lalu pasang **Flutter**. Ekstensi **Dart** ikut terpasang otomatis.
3. Buka folder proyek, misalnya `flutter/proyek-modul/modul-1-kartu-kenal-digital`.
4. Pilih perangkat: tekan **Ctrl+Shift+P**, ketik `Flutter: Select Device`, lalu pilih emulator yang sudah menyala atau HP fisik.
5. Jalankan dengan **F5** (Run > Start Debugging) atau **Ctrl+F5** tanpa debugger. Aplikasi akan tampil di emulator.
6. Lihat galat di panel **Problems**. Untuk tes, buka terminal terintegrasi (Ctrl+`) lalu jalankan `flutter test`.

Hot reload dilakukan dengan menekan **r** di terminal debug, atau tombol **Hot Reload** di toolbar Debug.

## 4. Pakai Antigravity

Antigravity dibangun di atas VS Code, jadi alur kerjanya mirip. Cara pastinya bisa berbeda tiap versi, jadi periksa dokumentasi Antigravity bila ada langkah yang tidak cocok.

1. Pasang Antigravity, lalu buka folder proyek.
2. Pasang ekstensi **Flutter** dari panel Extensions. Bila tidak ditemukan di pasar ekstensi Antigravity, lanjutkan dengan langkah terminal di bawah. Perintah Flutter berfungsi di terminal mana pun.
3. Di terminal Antigravity, jalankan:

```powershell
flutter devices
flutter run
```

Bila `flutter devices` belum menampilkan emulator, nyalakan emulator dari Android Studio lebih dulu, lalu ulangi perintah itu.

## 5. Periksa semuanya

Jalankan perintah berikut di folder proyek. Semuanya harus berhasil:

```powershell
flutter doctor
flutter devices
flutter pub get
flutter analyze
flutter test
flutter run
```

## Masalah umum

| Gejala | Yang perlu dicek |
|---|---|
| `flutter doctor` menandai Android toolchain | Jalankan `flutter doctor --android-licenses`, lalu periksa path SDK dengan `flutter config` |
| Emulator tidak muncul di `flutter devices` | Nyalakan emulator dulu, lalu ulangi `flutter devices` |
| Emulator gagal menyala atau sangat lambat | Aktifkan virtualisasi di BIOS dan Hypervisor Platform, pakai image x86_64 |
| Ekstensi Flutter tidak bisa dipasang di Antigravity | Pakai terminal untuk `flutter run` dan `flutter test` |
| Hot reload tidak berjalan | Hentikan dan jalankan ulang dengan `flutter run` |
