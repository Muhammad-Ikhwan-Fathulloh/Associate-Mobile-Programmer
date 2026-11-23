import { Note } from '../models/note';
import { ApiClient, NoteServer } from './apiClient';

/** Bagian repository yang dibutuhkan sinkronisasi. Dipisah agar mudah diuji. */
export type Penyimpanan = {
  catatanPending: () => Promise<Note[]>;
  tandaiSynced: (id: number, serverId: number) => Promise<void>;
  simpanDariServer: (n: Note & { serverId: number }) => Promise<void>;
};

export type HasilSinkron = { terkirim: number; diterima: number; gagal: number };

/**
 * Offline-first: kirim catatan PENDING ke server, lalu ambil catatan baru dari server.
 * Kegagalan satu catatan tidak menghentikan yang lain.
 */
export async function sinkronkan(db: Penyimpanan, api: ApiClient, token: string): Promise<HasilSinkron> {
  const hasil: HasilSinkron = { terkirim: 0, diterima: 0, gagal: 0 };

  for (const n of await db.catatanPending()) {
    try {
      const di = n.serverId != null ? await api.ubahCatatan(token, n.serverId, n) : await api.buatCatatan(token, n);
      await db.tandaiSynced(n.id!, di.id);
      hasil.terkirim++;
    } catch {
      hasil.gagal++;
    }
  }

  const dariServer: NoteServer[] = await api.daftarCatatan(token);
  for (const s of dariServer) {
    await db.simpanDariServer({
      title: s.title,
      content: s.content,
      latitude: s.latitude,
      longitude: s.longitude,
      updatedAt: s.updatedAt,
      syncStatus: 'SYNCED',
      serverId: s.id,
    });
    hasil.diterima++;
  }
  return hasil;
}
