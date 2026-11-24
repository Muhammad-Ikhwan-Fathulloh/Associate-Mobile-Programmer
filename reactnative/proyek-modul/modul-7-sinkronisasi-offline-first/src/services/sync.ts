// Logika sinkronisasi murni: bergantung pada antarmuka, bukan pada SQLite atau jaringan nyata.
import { Catatan } from '../models/catatan';
import { CatatanServer, CatatanBaru } from './apiClient';

/** Bagian penyimpanan lokal yang dibutuhkan sinkronisasi. */
export type Penyimpanan = {
  catatanPending: () => Promise<Catatan[]>;
  tandaiSynced: (id: number, serverId: number) => Promise<void>;
  simpanDariServer: (c: Catatan) => Promise<void>;
};

/** Bagian klien API yang dibutuhkan sinkronisasi. */
export type ApiSinkron = {
  buatCatatan: (token: string, c: CatatanBaru) => Promise<CatatanServer>;
  ubahCatatan: (token: string, serverId: number, c: CatatanBaru) => Promise<CatatanServer>;
  daftarCatatan: (token: string) => Promise<CatatanServer[]>;
};

export type HasilSinkron = { terkirim: number; diterima: number; gagal: number };

/**
 * Offline-first: kirim catatan PENDING (POST bila baru, PUT bila sudah punya serverId),
 * tandai SYNCED, lalu ambil catatan dari server. Kegagalan satu catatan tidak menghentikan yang lain.
 */
export async function sinkronkan(db: Penyimpanan, api: ApiSinkron, token: string): Promise<HasilSinkron> {
  const hasil: HasilSinkron = { terkirim: 0, diterima: 0, gagal: 0 };

  for (const c of await db.catatanPending()) {
    try {
      const kiriman = { title: c.title, content: c.content, latitude: c.latitude, longitude: c.longitude };
      const di =
        c.serverId !== null
          ? await api.ubahCatatan(token, c.serverId, kiriman)
          : await api.buatCatatan(token, kiriman);
      await db.tandaiSynced(c.id!, di.id);
      hasil.terkirim++;
    } catch {
      hasil.gagal++;
    }
  }

  for (const s of await api.daftarCatatan(token)) {
    await db.simpanDariServer({
      serverId: s.id,
      title: s.title,
      content: s.content,
      latitude: s.latitude,
      longitude: s.longitude,
      updatedAt: s.updatedAt,
      syncStatus: 'SYNCED',
    });
    hasil.diterima++;
  }
  return hasil;
}
