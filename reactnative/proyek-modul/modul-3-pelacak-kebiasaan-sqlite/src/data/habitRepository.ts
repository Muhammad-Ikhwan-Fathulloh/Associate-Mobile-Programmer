// Repository: satu-satunya tempat yang menulis SQL. Tampilan memanggil fungsi ini.
import { Habit } from '../models/habit';
import { getDb } from './database';

type BarisHabit = { id: number; nama: string; warna: string };
type BarisLog = { habit_id: number; tanggal: string };

export async function ambilKebiasaan(): Promise<Habit[]> {
  const db = await getDb();
  const habits = await db.getAllAsync<BarisHabit>('SELECT id, nama, warna FROM habits ORDER BY dibuat ASC');
  const logs = await db.getAllAsync<BarisLog>('SELECT habit_id, tanggal FROM logs ORDER BY tanggal DESC');
  return habits.map((h) => ({
    id: h.id,
    nama: h.nama,
    warna: h.warna,
    tanggal: logs.filter((l) => l.habit_id === h.id).map((l) => l.tanggal),
  }));
}

export async function tambahKebiasaan(nama: string, warna = '#1565c0'): Promise<void> {
  const db = await getDb();
  await db.runAsync('INSERT INTO habits (nama, dibuat, warna) VALUES (?, ?, ?)', nama.trim(), Date.now(), warna);
}

export async function ubahNama(id: number, nama: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE habits SET nama = ? WHERE id = ?', nama.trim(), id);
}

/** Menghapus kebiasaan sekaligus lognya (kunci asing ON DELETE CASCADE). */
export async function hapusKebiasaan(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM habits WHERE id = ?', id);
}

export async function catatSelesai(habitId: number, tanggal: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('INSERT OR IGNORE INTO logs (habit_id, tanggal) VALUES (?, ?)', habitId, tanggal);
}

export async function batalCatat(habitId: number, tanggal: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM logs WHERE habit_id = ? AND tanggal = ?', habitId, tanggal);
}
