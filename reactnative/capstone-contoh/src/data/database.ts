import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Membuka basis data sekali dan menjalankan migrasi berbasis PRAGMA user_version. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('jurnal.db');
      await migrasi(db);
      return db;
    })();
  }
  return dbPromise;
}

/**
 * Versi 1: tabel awal. Versi 2: menambah kolom kategori tanpa menghapus data lama.
 */
export async function migrasi(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON;');
  const baris = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const versi = baris?.user_version ?? 0;

  if (versi < 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS entri (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        judul TEXT NOT NULL,
        catatan TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        updated_at INTEGER NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'PENDING',
        server_id TEXT
      );
      PRAGMA user_version = 1;
    `);
  }
  if (versi < 2) {
    await db.execAsync(`
      ALTER TABLE entri ADD COLUMN kategori TEXT NOT NULL DEFAULT 'Kota';
      PRAGMA user_version = 2;
    `);
  }
}
