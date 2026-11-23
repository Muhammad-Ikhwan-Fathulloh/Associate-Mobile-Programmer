# Instalasi Node.js, Expo, dan Perangkat Uji

Panduan ini menyiapkan laptop untuk pelatihan React Native. Cukup salah satu cara menjalankan aplikasi: **Expo Go di ponsel** (paling mudah) atau **emulator Android**.

## 1. Node.js

1. Unduh versi **LTS** dari https://nodejs.org lalu pasang dengan pengaturan bawaan.
2. Buka terminal baru, lalu periksa:

```bash
node --version
npm --version
```

Keduanya harus menampilkan nomor versi. Bila perintah tidak dikenali, tutup lalu buka ulang terminal.

## 2. Git dan editor

1. Pasang Git dari https://git-scm.com.
2. Pasang VS Code dari https://code.visualstudio.com.
3. Ekstensi yang disarankan: **ES7+ React/Redux/React-Native snippets** dan **Expo Tools**.

## 3. Cara A: Expo Go di ponsel

1. Pasang aplikasi **Expo Go** dari Google Play Store (atau App Store).
2. Hubungkan ponsel dan laptop ke **Wi-Fi yang sama**.
3. Di folder proyek jalankan `npx expo start`, lalu pindai kode QR dengan Expo Go (Android) atau aplikasi Kamera (iOS).

Jika ponsel tidak menemukan laptop, jalankan `npx expo start --tunnel`. Mode ini lebih lambat dan memerlukan paket tambahan yang akan ditawarkan untuk dipasang.

## 4. Cara B: Emulator Android

1. Pasang Android Studio dari https://developer.android.com/studio dan buka sekali sampai komponen SDK terunduh.
2. Buka **Device Manager**, buat perangkat virtual, lalu jalankan.
3. Atur variabel lingkungan `ANDROID_HOME` ke folder Android SDK dan tambahkan `platform-tools` ke PATH.
4. Setelah emulator menyala, jalankan `npx expo start` lalu tekan huruf `a`.

## 5. Uji lingkungan

```bash
npx create-expo-app@latest uji-awal --template blank-typescript
cd uji-awal
npx expo start
```

Aplikasi templat tampil di Expo Go atau emulator. Hapus folder `uji-awal` setelah berhasil.

## Masalah umum

| Gejala | Penyebab dan solusi |
|---|---|
| QR dipindai tetapi tidak terhubung | Wi-Fi berbeda atau firewall. Samakan jaringan atau pakai `--tunnel` |
| `npx` sangat lambat | Koneksi internet. Unduhan pertama memang besar |
| Versi paket tidak cocok | Pasang dengan `npx expo install <paket>`, bukan `npm install` |
| Emulator tidak terdeteksi | Pastikan sudah menyala penuh, lalu `adb devices` |
| Peta kosong | Peta butuh internet untuk mengunduh ubin gambar |

Panduan resmi: https://docs.expo.dev/get-started/set-up-your-environment/
