# Modul 5: Klien API Catatan

Proyek kecil untuk Modul 5 (API dan menghubungkan aplikasi mobile). Brief: [shared/docs/proyek/modul-5-klien-api-catatan.md](../../../shared/docs/proyek/modul-5-klien-api-catatan.md).

Jalankan server latihan dulu di terminal lain:

```bash
cd ../../../shared/server
npm install
npm start           # http://localhost:3000
```

Lalu di folder ini:

```bash
npm install
npx expo start
npm test
npm run typecheck
```

- Akun latihan: `peserta@contoh.id` / `rahasia123`.
- Alamat server ada di `src/config.ts`. Emulator Android memakai `10.0.2.2`. Ponsel fisik memakai IP komputer.
- Klien API terpisah dari tampilan di `src/services/apiClient.ts`. Galat ditampilkan lewat `pesanRamah`.
