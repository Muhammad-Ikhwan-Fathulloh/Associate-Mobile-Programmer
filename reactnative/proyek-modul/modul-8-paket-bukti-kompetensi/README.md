# Modul 8: Paket Bukti Kompetensi

Proyek kecil untuk Modul 8 (latihan dan persiapan uji kompetensi). Brief: [shared/docs/proyek/modul-8-paket-bukti-kompetensi.md](../../../shared/docs/proyek/modul-8-paket-bukti-kompetensi.md).

Proyek ini memakai hasil modul 1 sampai 7 (folder sibling di `reactnative/proyek-modul`). Jalankan tes di sini setelah modul lain sudah ada:

```bash
npm install
npx expo start
npm test            # memastikan setiap baris bukti menunjuk berkas yang ada
npm run typecheck
```

## Tabel bukti

Peta lengkap ada di `src/bukti.ts`. Tabel di bawah ini sama dengan isi berkas tersebut.

| Unit | Bukti (berkas) |
|---|---|
| J.612000.001.01 Platform OS dan bahasa | `modul-1-kartu-kenal-digital/src/profil.ts` |
| J.612000.007.01 Mobile Interface | `modul-2-redesain-dua-layar-token/app/index.tsx` |
| J.612000.003.01 Database dan data persistence | `modul-3-pelacak-kebiasaan-sqlite/src/data/database.ts` |
| J.612000.006.01 LBS, GPS, dan navigasi | `modul-4-peta-tempat-favorit/src/services/lokasi.ts` |
| J.612000.025.01 Mobile cellular network | `modul-5-klien-api-catatan/src/services/apiClient.ts` |
| J.612000.022.01 Mobile sensor dan spesifikasi | `modul-6-penghitung-guncangan-kompas/src/services/sensorMath.ts` |
| J.612000.008.01 Mobile communication security | `modul-7-sinkronisasi-offline-first/src/services/secureStorage.ts` |

## Demo lima menit

1. Tunjukkan layar aplikasi dan jelaskan satu unit.
2. Tunjukkan satu kasus gagal yang ditangani.
3. Jalankan `npm test` dan tunjukkan hasilnya.
