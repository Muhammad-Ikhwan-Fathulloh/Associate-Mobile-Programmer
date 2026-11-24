# Modul 3: Pelacak Kebiasaan dengan SQLite

Proyek kecil untuk Modul 3 (database dan persistensi). Brief: [shared/docs/proyek/modul-3-pelacak-kebiasaan-dengan-sqlite.md](../../../shared/docs/proyek/modul-3-pelacak-kebiasaan-dengan-sqlite.md).

```bash
npm install
npx expo start
npm test
npm run typecheck
```

- Data disimpan di SQLite (`kebiasaan.db`). Tutup aplikasi lalu buka lagi: data tetap ada.
- Migrasi ada di `src/data/database.ts` (`user_version` 1 dan 2).
- Logika streak murni di `src/logic/streak.ts` dan diuji di `__tests__/streak.test.ts`.
