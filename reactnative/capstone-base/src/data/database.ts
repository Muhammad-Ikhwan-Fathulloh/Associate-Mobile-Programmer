import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Membuka database sekali, lalu memakai koneksi yang sama. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('proyek_saya.db');
      await db.execAsync(`
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          updated_at INTEGER NOT NULL,
          sync_status TEXT NOT NULL DEFAULT 'PENDING',
          server_id INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);
      `);
      // TODO(peserta): migrasi. Contoh kolom kategori:
      //   const v = (await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version'))!.user_version;
      //   if (v < 1) { await db.execAsync("ALTER TABLE notes ADD COLUMN kategori TEXT"); await db.execAsync('PRAGMA user_version = 1'); }
      //   Perbarui juga model (src/models/note.ts), repository, dan form.
      return db;
    })();
  }
  return dbPromise;
}
