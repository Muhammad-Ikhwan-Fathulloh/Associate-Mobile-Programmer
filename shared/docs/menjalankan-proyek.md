# Menjalankan Proyek di HP dan Emulator Android Studio

Panduan ini berlaku untuk semua proyek di `reactnative/` dan `flutter/`: proyek per modul (`proyek-modul`) dan proyek dasar atau contoh (`capstone-base`, `capstone-contoh`). Ada dua cara: **HP Android fisik** (paling cepat) dan **emulator Android Studio** (tanpa perangkat fisik).

## 1. Siapkan emulator Android Studio

1. Pasang [Android Studio](https://developer.android.com/studio). Saat pertama dibuka, biarkan wizard memasang Android SDK.
2. Buka **More Actions > Virtual Device Manager** (atau **Tools > Device Manager**).
3. Klik **Create Virtual Device**, pilih ponsel (misalnya Pixel 7), lalu **Next**.
4. Pilih image sistem **API 34 atau 35** dengan kolom ABI **x86_64**. Klik **Download** bila belum ada, lalu **Next** dan **Finish**.
5. Klik tombol **Play** di baris perangkat untuk menyalakannya. Tunggu sampai layar beranda Android tampil.

Pada Windows, virtualisasi harus aktif (Intel VT-x atau AMD-V di BIOS, dan Hypervisor Platform di Windows Features). Jika emulator gagal menyala, periksa pesan di tab **Logcat** atau **Event Log** Android Studio.

## 2. Siapkan HP Android fisik

1. Buka **Settings > About phone** lalu ketuk **Build number** tujuh kali sampai muncul pesan bahwa Anda sekarang pengembang.
2. Buka **Settings > Developer options** dan aktifkan **USB debugging**.
3. Sambungkan HP ke laptop dengan kabel data. Setujui dialog **Allow USB debugging** di HP.
4. Periksa koneksi di terminal:

```powershell
adb devices
```

HP atau emulator harus tampil dengan status `device`. Jika status `unauthorized`, cabut dan sambungkan ulang kabel, lalu setujui dialog di HP.

Pada proyek Flutter, cek juga dengan `flutter devices`. HP harus tampil dengan nama modelnya. Jika belum muncul, pasang USB driver dari merek HP (misalnya Samsung USB Driver), lalu cabut dan sambungkan ulang kabel.

### Lewat Wi-Fi (Android 11 ke atas)

Tanpa kabel, HP dan laptop harus memakai Wi-Fi yang sama.

1. Di HP, buka **Developer options > Wireless debugging**, lalu aktifkan.
2. Ketuk **Pair device with pairing code**. Catat alamat `IP:PORT` pairing dan kode enam digit yang tampil.
3. Di terminal, pasangkan HP. Ganti `IP:PORT` dan `KODE` sesuai layar HP:

```powershell
adb pair IP:PORT
```

Masukkan kode pairing saat diminta.

4. Sambungkan dengan alamat `IP:PORT` yang tertera di layar **Wireless debugging** utama. Port ini berbeda dengan port pairing:

```powershell
adb connect IP:PORT
```

5. Cek dengan `adb devices` atau `flutter devices`.

Panduan lengkap dengan gambar ada di [setup Android Studio dan editor](../../flutter/docs/setup-android-studio-dan-editor.md#6-hubungkan-hp-android-real-device).

## 3. Jalankan proyek React Native (Expo)

Di folder proyek, jalankan:

```powershell
npm install
npx expo start
```

Lalu pilih salah satu cara:

- **HP fisik:** install aplikasi **Expo Go** dari Play Store, lalu pindai kode QR di terminal dengan Expo Go. HP dan laptop harus memakai Wi-Fi yang sama. Bila tidak bisa tersambung, tekan `s` di terminal untuk mode tunnel.
- **Emulator:** pastikan emulator sudah menyala, lalu tekan `a` di terminal. Expo memasang Expo Go di emulator secara otomatis.

Setiap perubahan kode tersimpan langsung tampil di aplikasi (hot reload).

## 4. Jalankan proyek Flutter

Di folder proyek, jalankan:

```powershell
flutter pub get
flutter devices
flutter run
```

`flutter devices` harus menampilkan HP atau emulator. Jika ada lebih dari satu perangkat, pilih dengan `flutter run -d <id>`.

Proyek yang belum punya folder `android/` harus dibuat sekali dulu:

```powershell
flutter create . --platforms android
```

Perintah ini tidak mengubah berkas di `lib/` dan `test/`.

## 5. Akses internet dan server

- **MockAPI** (dipakai di latihan CRUD): alamatnya HTTPS, jadi emulator dan HP hanya perlu koneksi internet. Tidak perlu `10.0.2.2` atau IP komputer.
- **Server latihan lokal** (`shared/server`, bila masih dipakai): emulator Android memanggil komputer lewat `10.0.2.2`. HP fisik memakai IP komputer di Wi-Fi yang sama. Server harus berjalan dulu dengan `npm start`.
- Izin lokasi dan internet di Android: proyek yang memakai GPS membutuhkan izin lokasi. Aplikasi meminta izinnya saat tombol ditekan.

## 6. Masalah umum

| Gejala | Yang perlu dicek |
|---|---|
| HP tidak muncul di `adb devices` | Ganti kabel data, aktifkan USB debugging, setujui dialog di HP |
| Status `unauthorized` di `adb devices` | Cabut kabel, sambungkan lagi, lalu setujui **Allow USB debugging** di HP |
| HP tidak muncul di `flutter devices` padahal `adb devices` sudah menampilkannya | Jalankan `flutter doctor`, lalu tutup dan buka lagi terminal |
| `adb connect` gagal lewat Wi-Fi | HP dan laptop harus satu Wi-Fi, gunakan port dari layar **Wireless debugging** utama (bukan port pairing) |
| `INSTALL_FAILED_USER_RESTRICTED` | Aktifkan **Install via USB** di Developer options |
| Emulator lambat atau tidak menyala | Aktifkan virtualisasi di BIOS, pakai image x86_64, tutup aplikasi berat |
| QR Expo tidak bisa dipindai | HP dan laptop harus satu Wi-Fi, atau tekan `s` untuk mode tunnel |
| `flutter devices` kosong | Jalankan `flutter doctor`, lalu pastikan emulator sudah menyala |
| Permintaan ke MockAPI gagal | Periksa alamat di `src/config.ts` atau `lib/config.dart` (ganti `GANTI-ID`), dan koneksi internet |
| Aplikasi GPS tidak mendapat posisi | Aktifkan GPS di HP atau atur lokasi emulator lewat menu **Extended controls > Location** |

Untuk pemasangan awal (Node.js, Flutter SDK, Android Studio), lihat [instalasi Node dan Expo](../../reactnative/docs/instalasi-node-expo.md) dan [instalasi Dart dan Flutter](../../flutter/docs/instalasi-dart-flutter.md).
