// Repository: satu-satunya tempat yang menulis SQL untuk tabel entri.
import { Entri } from '../models/entri';
import { getDb } from './database';

type Baris = {
  id: number;
  judul: string;
  catatan: string;
  kategori: string;
  latitude: number | null;
  longitude: number | null;
  updated_at: number;
  sync_status: 'PENDING' | 'SYNCED';
  server_id: number | null;
};

const dariBaris = (b: Baris): Entri => ({
  id: b.id,
  serverId: b.server_id,
  judul: b.judul,
  catatan: b.catatan,
  kategori: b.kategori,
  latitude: b.latitude,
  longitude: b.longitude,
  updatedAt: b.updated_at,
  status: b.sync_status,
});

export async function ambilSemua(kategori?: string): Promise<Entri[]> {
  const db = await getDb();
  const baris = kategori
    ? await db.getAllAsync<Baris>('SELECT * FROM entri WHERE kategori = ? ORDER BY updated_at DESC', [kategori])
    : await db.getAllAsync<Baris>('SELECT * FROM entri ORDER BY updated_at DESC');
  return baris.map(dariBaris);
}

export async function ambilSatu(id: number): Promise<Entri | null> {
  const db = await getDb();
  const b = await db.getFirstAsync<Baris>('SELECT * FROM entri WHERE id = ?', [id]);
  return b ? dariBaris(b) : null;
}

/** Entri baru atau hasil ubah lokal selalu berstatus PENDING. */
export async function simpanEntri(e: Omit<Entri, 'serverId' | 'status' | 'updatedAt'> & { id?: number }): Promise<void> {
  const db = await getDb();
  if (e.id == null) {
    await db.runAsync(
      "INSERT INTO entri (judul, catatan, kategori, latitude, longitude, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, 'PENDING')",
      [e.judul.trim(), e.catatan, e.kategori, e.latitude, e.longitude, Date.now()],
    );
  } else {
    await db.runAsync(
      "UPDATE entri SET judul = ?, catatan = ?, kategori = ?, latitude = ?, longitude = ?, updated_at = ?, sync_status = 'PENDING' WHERE id = ?",
      [e.judul.trim(), e.catatan, e.kategori, e.latitude, e.longitude, Date.now(), e.id],
    );
  }
}

export async function hapusEntri(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM entri WHERE id = ?', [id]);
}

export async function entriPending(): Promise<Entri[]> {
  const db = await getDb();
  const baris = await db.getAllAsync<Baris>("SELECT * FROM entri WHERE sync_status = 'PENDING' ORDER BY updated_at ASC");
  return baris.map(dariBaris);
}

export async function tandaiSynced(id: number, serverId: number): Promise<void> {
  const db = await getDb();
  await db.runAsync("UPDATE entri SET sync_status = 'SYNCED', server_id = ? WHERE id = ?", [serverId, id]);
}

/** Memperbarui entri yang sudah dikenal (berdasarkan server_id), atau menyimpan yang baru. */
export async function simpanDariServer(e: Entri, serverId: number): Promise<boolean> {
  const db = await getDb();
  const ada = await db.getFirstAsync<{ id: number }>('SELECT id FROM entri WHERE server_id = ?', [serverId]);
  if (ada) {
    await db.runAsync(
      "UPDATE entri SET judul = ?, catatan = ?, latitude = ?, longitude = ?, updated_at = ?, sync_status = 'SYNCED' WHERE id = ?",
      [e.judul, e.catatan, e.latitude, e.longitude, e.updatedAt, ada.id],
    );
    return false;
  }
  await db.runAsync(
    "INSERT INTO entri (judul, catatan, kategori, latitude, longitude, updated_at, sync_status, server_id) VALUES (?, ?, 'Kota', ?, ?, ?, 'SYNCED', ?)",
    [e.judul, e.catatan, e.latitude, e.longitude, e.updatedAt, serverId],
  );
  return true;
}
