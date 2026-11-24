# Modul 7: Sinkronisasi Offline-First

Proyek kecil untuk Modul 7 (API lanjutan dan sinkronisasi). Brief: [shared/docs/proyek/modul-7-sinkronisasi-offline-first.md](../../../shared/docs/proyek/modul-7-sinkronisasi-offline-first.md).

Jalankan server latihan dulu (`cd ../../../shared/server && npm install && npm start`), lalu:

```bash
npm install
npx expo start
npm test
npm run typecheck
```

- Catatan disimpan lokal dengan status `PENDING`. Setelah sinkron, status menjadi `SYNCED`.
- Catatan baru dikirim dengan POST. Catatan yang sudah punya `server_id` dikirim dengan PUT.
- Token login disimpan di penyimpanan aman (`src/services/secureStorage.ts`), bukan di SQLite.
- Alamat HTTP publik ditolak oleh `periksaUrlAman`.
