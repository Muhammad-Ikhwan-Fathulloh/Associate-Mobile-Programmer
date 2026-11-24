// Peta bukti: setiap unit kompetensi menunjuk berkas kode yang membuktikannya.
// Berkas dicari relatif terhadap folder proyek ini, di folder modul 1 sampai 7 (sibling).

export type Bukti = {
  unit: string;
  judul: string;
  /** Berkas bukti, relatif terhadap folder `reactnative/proyek-modul`. */
  berkas: string;
};

export const BUKTI: Bukti[] = [
  { unit: 'J.612000.001.01', judul: 'Platform OS dan bahasa pemrograman', berkas: 'modul-1-kartu-kenal-digital/src/profil.ts' },
  { unit: 'J.612000.007.01', judul: 'Mobile Interface', berkas: 'modul-2-redesain-dua-layar-token/app/index.tsx' },
  { unit: 'J.612000.003.01', judul: 'Database dan data persistence', berkas: 'modul-3-pelacak-kebiasaan-sqlite/src/data/database.ts' },
  { unit: 'J.612000.006.01', judul: 'LBS, GPS, dan navigasi', berkas: 'modul-4-peta-tempat-favorit/src/services/lokasi.ts' },
  { unit: 'J.612000.025.01', judul: 'Mobile cellular network', berkas: 'modul-5-klien-api-catatan/src/services/apiClient.ts' },
  { unit: 'J.612000.022.01', judul: 'Mobile sensor dan spesifikasi', berkas: 'modul-6-penghitung-guncangan-kompas/src/services/sensorMath.ts' },
  { unit: 'J.612000.008.01', judul: 'Mobile communication security', berkas: 'modul-7-sinkronisasi-offline-first/src/services/secureStorage.ts' },
];
