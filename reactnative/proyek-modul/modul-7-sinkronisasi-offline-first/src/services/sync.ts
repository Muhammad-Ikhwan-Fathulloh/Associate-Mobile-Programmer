// Sinkronisasi offline-first. Bergantung pada antarmuka agar bisa diuji dengan tiruan.
import { BadanCatatan, CatatanServer } from './apiClient';
import { Catatan } from '../models/catatan';

export type PenyimpananCatatan = {
  catatanPending: () => Promise<Catatan[]>;
  tandaiSynced: (id: number, serverId: string) => Promise<void>;
  simpanDariServer: (c: Catatan, serverId: string) => Promise<boolean>;
};

export type ApiSinkron = {
  buat: (badan: BadanCatatan) => Promise<CatatanServer>;
  ubah: (id: string, badan: BadanCatatan) => Promise<CatatanServer>;
  daftar: () => Promise<CatatanServer[]>;
};

export type HasilSinkron = { terkirim: number; diterima: number; gagal: number };

/**
 * PENDING dikirim (POST bila baru, PUT bila punya serverId), lalu ditandai SYNCED,
 * lalu daftar dari MockAPI diambil. Satu kegagalan tidak menghentikan yang lain.
 */
export async function sinkronkan(db: PenyimpananCatatan, api: ApiSinkron): Promise<HasilSinkron> {
  const hasil: HasilSinkron = { terkirim: 0, diterima: 0, gagal: 0 };

  for (const c of await db.catatanPending()) {
    try {
      const badan: BadanCatatan = { title: c.title, content: c.content, latitude: c.latitude, longitude: c.longitude };
      const di = c.serverId !== null ? await api.ubah(c.serverId, badan) : await api.buat(badan);
      await db.tandaiSynced(c.id!, di.id);
      hasil.terkirim++;
    } catch {
      hasil.gagal++;
    }
  }

  for (const s of await api.daftar()) {
    const baru = await db.simpanDariServer(
      {
        serverId: s.id,
        title: s.title,
        content: s.content,
        latitude: s.latitude,
        longitude: s.longitude,
        updatedAt: Date.now(),
        syncStatus: 'SYNCED',
      },
      s.id,
    );
    if (baru) hasil.diterima++;
  }
  return hasil;
}
