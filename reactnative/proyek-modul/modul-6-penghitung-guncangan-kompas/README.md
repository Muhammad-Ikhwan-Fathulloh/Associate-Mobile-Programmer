# Modul 6: Penghitung Guncangan dan Kompas

Proyek kecil untuk Modul 6 (mobile sensor dan spesifikasi perangkat). Brief: [shared/docs/proyek/modul-6-penghitung-guncangan-dan-kompas.md](../../../shared/docs/proyek/modul-6-penghitung-guncangan-dan-kompas.md).

```bash
npm install
npx expo start      # sensor berfungsi di perangkat fisik; emulator punya sensor terbatas
npm test
npm run typecheck
```

- Logika guncangan, kompas, dan mata angin ada di `src/services/sensorMath.ts` dan diuji tanpa perangkat.
- Langganan sensor dihentikan di fungsi cleanup `useEffect` (`useSensor` di `app/index.tsx`).
- Akselerometer dalam satuan g. Diam di meja menghasilkan sekitar 1 g karena gravitasi.
