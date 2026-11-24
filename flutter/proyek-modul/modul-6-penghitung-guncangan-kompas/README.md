# Modul 6: Penghitung Guncangan dan Kompas (Flutter)

Proyek kecil untuk Modul 6 (mobile sensor dan spesifikasi perangkat). Brief: [shared/docs/proyek/modul-6-penghitung-guncangan-dan-kompas.md](../../../shared/docs/proyek/modul-6-penghitung-guncangan-dan-kompas.md).

```bash
flutter create . --project-name modul_6_penghitung_guncangan_kompas --platforms android,ios
flutter pub get
flutter run        # sensor berfungsi di perangkat fisik
flutter test
flutter analyze
```

- Logika guncangan, kompas, dan mata angin ada di `lib/services/sensor_math.dart` dan diuji tanpa perangkat.
- Akselerometer memberi m/s². Dibagi `gravitasi` agar nilainya dalam g.
- Langganan sensor dihentikan di `dispose()`.
