import { getDb } from './database';
import { Note } from '../models/note';

type Row = {
  id: number;
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  updated_at: number;
  sync_status: 'PENDING' | 'SYNCED';
};

const dariRow = (r: Row): Note => ({
  id: r.id,
  title: r.title,
  content: r.content,
  latitude: r.latitude,
  longitude: r.longitude,
  updatedAt: r.updated_at,
  syncStatus: r.sync_status,
});

export async function semuaCatatan(): Promise<Note[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>('SELECT * FROM notes ORDER BY updated_at DESC');
  return rows.map(dariRow);
}

export async function simpanCatatan(n: Note): Promise<void> {
  const db = await getDb();
  if (n.id == null) {
    await db.runAsync(
      'INSERT INTO notes (title, content, latitude, longitude, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?)',
      [n.title, n.content, n.latitude, n.longitude, n.updatedAt, n.syncStatus],
    );
  } else {
    await db.runAsync(
      "UPDATE notes SET title = ?, content = ?, latitude = ?, longitude = ?, updated_at = ?, sync_status = 'PENDING' WHERE id = ?",
      [n.title, n.content, n.latitude, n.longitude, Date.now(), n.id],
    );
  }
}

export async function hapusCatatan(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
}
