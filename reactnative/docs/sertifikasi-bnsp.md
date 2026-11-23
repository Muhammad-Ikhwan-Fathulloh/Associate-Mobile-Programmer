# Sertifikasi BNSP untuk Jalur React Native

Skema, tujuh unit kompetensi, dan alur asesmen **sama** untuk Flutter dan React Native, karena unit kompetensi tidak menyebut teknologi tertentu. Materi lengkap ada di [flutter/docs/sertifikasi-bnsp/](../../flutter/docs/sertifikasi-bnsp/00-panduan-sertifikasi.md), dan latihan soal interaktif di [flutter/slides/latihan-soal-bnsp.html](../../flutter/slides/latihan-soal-bnsp.html). Soal konseptualnya berlaku untuk keduanya. Soal yang menyebut kode Dart atau paket Flutter dapat dibaca sebagai konsep, lalu dicari padanannya di tabel berikut.

Skema dan bentuk asesmen (tertulis, praktik, wawancara) ditentukan oleh LSP penyelenggara. Pastikan ke panitia sebelum ujian.

## Bukti per unit pada proyek React Native

| Unit | Judul | Bukti pada `app/` |
|---|---|---|
| J.612000.001.01 | Platform OS dan bahasa pemrograman | Aplikasi berjalan di Expo Go atau emulator, `src/models/note.ts` (TypeScript) |
| J.612000.007.01 | Mobile Interface | `app/index.tsx`, `app/note-form.tsx`, `app/_layout.tsx`, `src/ui.ts` |
| J.612000.003.01 | Database dan Data Persistence | `src/data/database.ts`, `src/data/noteRepository.ts`, data tetap ada setelah aplikasi ditutup |
| J.612000.006.01 | LBS, GPS, Navigasi | `src/services/locationService.ts`, `src/services/distance.ts`, `app/location.tsx` |
| J.612000.025.01 | Mobile Cellular Network | `src/services/networkService.ts`, `app/network.tsx`, `src/services/apiClient.ts`, `src/services/sync.ts` (Modul 5 dan 7) |
| J.612000.022.01 | Mobile Sensor dan Spesifikasi | `app/sensor.tsx`, `app/device.tsx` |
| J.612000.008.01 | Mobile Communication Security | `src/services/httpsService.ts`, `src/services/secureStorage.ts`, `app/keamanan.tsx` (Modul 7) |

## Padanan istilah Flutter ke React Native

| Konsep | Flutter | React Native (Expo) |
|---|---|---|
| Bahasa | Dart | TypeScript |
| Navigasi | `go_router` | `expo-router` |
| SQLite | `sqflite` | `expo-sqlite` |
| GPS | `geolocator` | `expo-location` |
| Peta | `flutter_map` | Leaflet di `react-native-webview` |
| Jaringan | `connectivity_plus` | `expo-network` |
| Sensor | `sensors_plus` | `expo-sensors` |
| Info perangkat | `device_info_plus` | `expo-device` |
| Penyimpanan aman | `flutter_secure_storage` | `expo-secure-store` |
| HTTP | `http` | `fetch` dengan `AbortController` |
| Pengujian | `flutter test` | `jest` (`npm test`) |

## Daftar periksa sebelum ujian

1. `npm test` lulus dan `npm run typecheck` bersih.
2. Aplikasi berjalan dari awal di perangkat atau emulator.
3. Setiap unit punya satu file bukti yang dapat dijelaskan secara lisan.
4. Latihan soal dikerjakan, unit dengan skor rendah diulang.
