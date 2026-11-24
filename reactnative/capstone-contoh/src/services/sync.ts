// Sinkronisasi offline-first. Bergantung pada antarmuka agar bisa diuji dengan tiruan.
import { BadanEntri, EntriServer } from './apiClient';
import { Entri } from '../models/entri';

export type PenyimpananEntri = {
  entriPending: () => Promise<Entri[]>;
  tandaiSynced: (id: number, serverId: string) => Promise<void>;
  simpanDariServer: (e: Entri, serverId: string) => Promise<boolean>;
};

export type ApiSinkron = {
  buat: (badan: BadanEntri) => Promise<EntriServer>;
  ubah: (id: string, badan: BadanEntri) => Promise<EntriServer>;
  daftar: () => Promise<EntriServer[]>;
};

export type HasilSinkron = { terkirim: number; diterima: number; gagal: number };

/**
 * PENDING dikirim (POST bila baru, PUT bila punya serverId), lalu ditandai SYNCED,
 * lalu daftar dari MockAPI diambil. Satu kegagalan tidak menghentikan yang lain.
 */
export async function sinkronkan(db: PenyimpananEntri, api: ApiSinkron): Promise<HasilSinkron> {
  const hasil: HasilSinkron = { terkirim: 0, diterima: 0, gagal: 0 };

  for (const e of await db.entriPending()) {
    try {
      const badan: BadanEntri = { title: e.judul, content: e.catatan, latitude: e.latitude, longitude: e.longitude };
      const di = e.serverId !== null ? await api.ubah(e.serverId, badan) : await api.buat(badan);
      await db.tandaiSynced(e.id!, di.id);
      hasil.terkirim++;
    } catch {
      hasil.gagal++;
    }
  }

  for (const s of await api.daftar()) {
    const baru = await db.simpanDariServer(
      {
        serverId: s.id,
        judul: s.title,
        catatan: s.content,
        kategori: 'Kota',
        latitude: s.latitude,
        longitude: s.longitude,
        updatedAt: Date.now(),
        status: 'SYNCED',
      },
      s.id,
    );
    if (baru) hasil.diterima++;
  }
  return hasil;
}
