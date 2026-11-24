# Modul 4: Peta Tempat Favorit

Proyek kecil untuk Modul 4 (GPS, lokasi, dan navigasi). Brief: [shared/docs/proyek/modul-4-peta-tempat-favorit.md](../../../shared/docs/proyek/modul-4-peta-tempat-favorit.md).

```bash
npm install
npx expo start
npm test
npm run typecheck
```

- Koordinat disimpan di SQLite (`tempat.db`, kolom `REAL`).
- Izin lokasi diminta saat tombol "Sertakan lokasi saya" ditekan. Izin ditolak, GPS mati, atau waktu habis ditangani: tempat tetap bisa disimpan tanpa koordinat.
- Jarak memakai Haversine (`src/services/distance.ts`). Peta memakai OpenStreetMap lewat Leaflet, tanpa API key.
