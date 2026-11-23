# Modul 3: Database dan Data Persistence

**Durasi:** 13.00 to 15.00

**Unit kompetensi BNSP:** J.612000.003.01

## Tujuan Pembelajaran

1. Memilih metode penyimpanan lokal yang sesuai.
2. Merancang tabel untuk aplikasi mobile.
3. Mengimplementasikan CRUD dengan expo-sqlite.
4. Memahami offline-first dan sinkronisasi.

## 1. Pilihan penyimpanan lokal

| Metode | Modul | Contoh penggunaan |
|---|---|---|
| Key-value | `@react-native-async-storage/async-storage` | Tema, status onboarding |
| Penyimpanan aman | `expo-secure-store` | Token akses |
| SQLite | `expo-sqlite` | Data terstruktur dengan relasi dan kueri |
| Berkas | `expo-file-system` | Gambar, cache, dokumen |

## 2. Rancangan tabel notes

```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  updated_at INTEGER NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'PENDING'
);
```

## 3. Membuka database

Koneksi dibuka sekali. Tabel dibuat bila belum ada. Berkas `src/data/database.ts`:

```ts
import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Membuka database sekali, lalu memakai koneksi yang sama. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('associate_mobile.db');
      await db.execAsync(`
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          updated_at INTEGER NOT NULL,
          sync_status TEXT NOT NULL DEFAULT 'PENDING'
        );
        CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);
      `);
      return db;
    })();
  }
  return dbPromise;
}
```

## 4. Repository dan CRUD

Tiga fungsi: baca semua, simpan (tambah atau ubah), hapus. Parameter memakai tanda tanya. Berkas `src/data/noteRepository.ts`:

```ts
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
```

## 5. Model berlapis dan sinkronisasi

- **Lapisan**: tampilan (halaman) memanggil repository, repository memanggil SQLite.
- **Offline-first**: simpan ke SQLite dahulu, kirim ke server saat ada koneksi.
- Kolom `sync_status` menandai data **PENDING** (belum dikirim) atau **SYNCED**.
- Konflik sinkronisasi biasanya diselesaikan dengan `updated_at` terbaru.

## Latihan

1. Tambahkan kolom `kategori` dan pikirkan cara memigrasikan data lama.
2. Tambahkan pencarian judul dengan `LIKE`.
3. Uji: tambah catatan, tutup aplikasi, buka kembali.

## Peta Kompetensi BNSP

Unit **J.612000.003.01**. Elemen yang dinilai:

- Mendesain internal storage
- Mendesain external storage
- Mendesain database SQLite
- Mendesain database mobile dengan model berlapis

Bukti pada pelatihan ini: `src/data/database.ts`, `src/data/noteRepository.ts`, data bertahan setelah aplikasi ditutup.

Praktik langkah demi langkah: [hands-on Hari 1, Step 5 sampai 8](../hands-on/hari-1.md).
