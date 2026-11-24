// Repository: satu-satunya tempat yang menulis SQL untuk tabel notes.
import { Catatan } from '../models/catatan';
import { getDb } from './database';

type Baris = {
  id: number;
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  updated_at: number;
  sync_status: 'PENDING' | 'SYNCED';
  server_id: string | null;
};

const dariBaris = (b: Baris): Catatan => ({
  id: b.id,
  serverId: b.server_id,
  title: b.title,
  content: b.content,
  latitude: b.latitude,
  longitude: b.longitude,
  updatedAt: b.updated_at,
  syncStatus: b.sync_status,
});

export async function ambilSemua(): Promise<Catatan[]> {
  const db = await getDb();
  const baris = await db.getAllAsync<Baris>('SELECT * FROM notes ORDER BY updated_at DESC');
  return baris.map(dariBaris);
}

/** Catatan baru atau hasil ubah lokal selalu berstatus PENDING. */
export async function tambahCatatan(title: string, content: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    "INSERT INTO notes (title, content, updated_at, sync_status) VALUES (?, ?, ?, 'PENDING')",
    [title.trim(), content, Date.now()],
  );
}

export async function catatanPending(): Promise<Catatan[]> {
  const db = await getDb();
  const baris = await db.getAllAsync<Baris>("SELECT * FROM notes WHERE sync_status = 'PENDING' ORDER BY updated_at ASC");
  return baris.map(dariBaris);
}

export async function tandaiSynced(id: number, serverId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("UPDATE notes SET sync_status = 'SYNCED', server_id = ? WHERE id = ?", [serverId, id]);
}

/** Memperbarui catatan yang sudah dikenal (berdasarkan server_id), atau menyimpan yang baru. */
export async function simpanDariServer(c: Catatan, serverId: string): Promise<boolean> {
  const db = await getDb();
  const ada = await db.getFirstAsync<{ id: number }>('SELECT id FROM notes WHERE server_id = ?', [serverId]);
  if (ada) {
    await db.runAsync(
      "UPDATE notes SET title = ?, content = ?, latitude = ?, longitude = ?, updated_at = ?, sync_status = 'SYNCED' WHERE id = ?",
      [c.title, c.content, c.latitude, c.longitude, c.updatedAt, ada.id],
    );
    return false;
  }
  await db.runAsync(
    "INSERT INTO notes (title, content, latitude, longitude, updated_at, sync_status, server_id) VALUES (?, ?, ?, ?, ?, 'SYNCED', ?)",
    [c.title, c.content, c.latitude, c.longitude, c.updatedAt, serverId],
  );
  return true;
}
