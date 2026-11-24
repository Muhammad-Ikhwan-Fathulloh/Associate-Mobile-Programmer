import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Membuka basis data sekali. Koordinat disimpan sebagai REAL, bukan teks. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('tempat.db');
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS places (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nama TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          dibuat INTEGER NOT NULL
        );
      `);
      return db;
    })();
  }
  return dbPromise;
}
