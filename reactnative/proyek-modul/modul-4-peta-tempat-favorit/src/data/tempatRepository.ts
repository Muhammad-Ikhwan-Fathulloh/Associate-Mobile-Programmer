// Repository: satu-satunya tempat yang menulis SQL untuk tabel places.
import { Tempat } from '../models/tempat';
import { getDb } from './database';

type Baris = { id: number; nama: string; latitude: number | null; longitude: number | null };

export async function ambilTempat(): Promise<Tempat[]> {
  const db = await getDb();
  const baris = await db.getAllAsync<Baris>('SELECT id, nama, latitude, longitude FROM places ORDER BY dibuat DESC');
  return baris.map((b) => ({ id: b.id, nama: b.nama, latitude: b.latitude, longitude: b.longitude }));
}

export async function simpanTempat(t: Tempat): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO places (nama, latitude, longitude, dibuat) VALUES (?, ?, ?, ?)',
    t.nama.trim(),
    t.latitude,
    t.longitude,
    Date.now(),
  );
}

export async function hapusTempat(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM places WHERE id = ?', id);
}
