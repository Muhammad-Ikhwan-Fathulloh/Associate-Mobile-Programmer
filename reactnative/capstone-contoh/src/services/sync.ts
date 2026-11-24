// Sinkronisasi offline-first. Bergantung pada antarmuka agar bisa diuji dengan tiruan.
import { BadanEntri, EntriServer } from './apiClient';
import { Entri } from '../models/entri';

export type PenyimpananEntri = {
  entriPending: () => Promise<Entri[]>;
  tandaiSynced: (id: number, serverId: number) => Promise<void>;
  simpanDariServer: (e: Entri, serverId: number) => Promise<boolean>;
};

export type ApiSinkron = {
  buatEntri: (token: string, badan: BadanEntri) => Promise<EntriServer>;
  ubahEntri: (token: string, id: number, badan: BadanEntri) => Promise<EntriServer>;
  daftarEntri: (token: string) => Promise<EntriServer[]>;
};

export type HasilSinkron = { terkirim: number; diterima: number; gagal: number };

/**
 * PENDING dikirim (POST bila baru, PUT bila punya serverId), lalu ditandai SYNCED,
 * lalu daftar dari server diambil. Satu kegagalan tidak menghentikan yang lain.
 */
export async function sinkronkan(db: PenyimpananEntri, api: ApiSinkron, token: string): Promise<HasilSinkron> {
  const hasil: HasilSinkron = { terkirim: 0, diterima: 0, gagal: 0 };

  for (const e of await db.entriPending()) {
    try {
      const badan: BadanEntri = { title: e.judul, content: e.catatan, latitude: e.latitude, longitude: e.longitude };
      const di = e.serverId !== null ? await api.ubahEntri(token, e.serverId, badan) : await api.buatEntri(token, badan);
      await db.tandaiSynced(e.id!, di.id);
      hasil.terkirim++;
    } catch {
      hasil.gagal++;
    }
  }

  for (const s of await api.daftarEntri(token)) {
    const baru = await db.simpanDariServer(
      {
        serverId: s.id,
        judul: s.title,
        catatan: s.content,
        kategori: 'Kota',
        latitude: s.latitude,
        longitude: s.longitude,
        updatedAt: s.updatedAt,
        status: 'SYNCED',
      },
      s.id,
    );
    if (baru) hasil.diterima++;
  }
  return hasil;
}
