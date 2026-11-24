import * as SQLite from 'expo-sqlite';
import { proyek } from '../proyek.config';

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
      await isiContohJikaKosong(db);
      return db;
    })();
  }
  return dbPromise;
}

/** Contoh catatan agar aplikasi langsung berisi data. Dimatikan dengan `contohAwal: false`. */
const CONTOH_CATATAN = [
  { title: 'Kopi Pagi', content: 'Kafe dekat stasiun. Contoh catatan dengan koordinat GPS.', latitude: -6.9147, longitude: 107.6098 },
  { title: 'Perpustakaan Kota', content: 'Contoh catatan kedua untuk mencoba pencarian dan jarak.', latitude: -6.9023, longitude: 107.6186 },
  { title: 'Ide Tanpa Lokasi', content: 'Contoh catatan tanpa GPS. Statusnya PENDING sampai Anda sinkronkan.', latitude: null, longitude: null },
];

async function isiContohJikaKosong(db: SQLite.SQLiteDatabase): Promise<void> {
  if (!proyek.contohAwal) return;
  const hitung = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM notes');
  if ((hitung?.n ?? 0) > 0) return;
  for (const c of CONTOH_CATATAN) {
    await db.runAsync(
      'INSERT INTO notes (title, content, latitude, longitude, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?)',
      [c.title, c.content, c.latitude, c.longitude, Date.now(), 'PENDING'],
    );
  }
}
