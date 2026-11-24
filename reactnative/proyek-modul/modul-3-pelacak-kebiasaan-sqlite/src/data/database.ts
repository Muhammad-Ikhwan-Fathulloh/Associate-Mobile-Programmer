import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Membuka basis data sekali dan menjalankan migrasi. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('kebiasaan.db');
      await migrasi(db);
      return db;
    })();
  }
  return dbPromise;
}

/**
 * Migrasi berbasis PRAGMA user_version.
 * v1: tabel awal. v2: menambah kolom warna tanpa menghapus data lama.
 */
export async function migrasi(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON;');
  const baris = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const versi = baris?.user_version ?? 0;

  if (versi < 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        dibuat INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
        tanggal TEXT NOT NULL,
        UNIQUE (habit_id, tanggal)
      );
      PRAGMA user_version = 1;
    `);
  }
  if (versi < 2) {
    await db.execAsync(`
      ALTER TABLE habits ADD COLUMN warna TEXT NOT NULL DEFAULT '#1565c0';
      PRAGMA user_version = 2;
    `);
  }
}
