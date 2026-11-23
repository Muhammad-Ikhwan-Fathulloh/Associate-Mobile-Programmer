# Modul 3: SQLite, MySQL, dan Data Persistence

**Durasi:** 13.00 to 15.00

**Unit kompetensi BNSP:** J.612000.003.01

## Pengantar

Kini aplikasi perlu mengingat data. Kita bahas SQLite sebagai penyimpanan lokal, merancang tabel, dan membuat operasi tambah, baca, ubah, hapus. Kita juga membahas MySQL dan menjawab pertanyaan yang selalu muncul: mengapa ponsel tidak langsung terhubung ke MySQL? Jawabannya mengantar kita ke API di hari kedua. Di akhir, peserta menutup aplikasi, membukanya lagi, dan melihat data masih ada.

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

> **Narasi pengajar:** Pilih alat sesuai bentuk data. Pengaturan kecil cukup key-value. Rahasia masuk penyimpanan aman. Data terstruktur yang perlu dicari dan diurutkan cocok untuk SQLite. Berkas besar seperti gambar disimpan sebagai berkas. Tanyakan: di mana Anda menyimpan token login, dan mengapa bukan di SQLite?

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

> **Narasi pengajar:** Baca tabel ini seperti membaca formulir. Id adalah nomor unik, title dan content wajib terisi, latitude dan longitude boleh kosong karena tidak semua catatan punya lokasi. Kolom sync_status adalah siasat untuk nanti: ia menandai catatan yang belum dikirim ke server.

## 3. SQLite dan MySQL

| Aspek | SQLite | MySQL |
|---|---|---|
| Lokasi | Berkas di ponsel, tertanam di aplikasi | Server terpisah |
| Pengguna | Satu aplikasi, satu pengguna | Banyak pengguna bersamaan |
| Instalasi | Tanpa instalasi | Perlu server dan akun basis data |
| Offline | Tetap jalan | Butuh jaringan |
| Peran di aplikasi mobile | Penyimpanan lokal | Penyimpanan pusat di belakang API |

> **Narasi pengajar:** Buka simulasi SQLite atau MySQL dan pilih tiap kebutuhan. Minta peserta menebak jawabannya dulu. Intinya: SQLite untuk penyimpanan lokal di ponsel, MySQL untuk data bersama di server, dan keduanya dihubungkan lewat API.

## 4. Mengapa ponsel tidak langsung ke MySQL

- Kata sandi basis data harus ada di aplikasi, dan aplikasi dapat dibongkar.
- Port MySQL terbuka ke internet, menambah risiko serangan.
- Tidak ada tempat memeriksa hak akses dan validasi per pengguna.
- Solusi: ponsel memanggil **API** (HTTPS + token), API yang berbicara ke MySQL. Skema contoh ada di `shared/server/schema.sql`.

> **Narasi pengajar:** Ini pertanyaan yang hampir pasti muncul. Jelaskan tiga alasan: kata sandi basis data ikut di aplikasi dan aplikasi bisa dibongkar, port basis data terbuka ke internet, dan tidak ada tempat memeriksa hak akses. Jembatannya adalah API, yang kita bangun di hari kedua.

## 5. Membuka database

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
          sync_status TEXT NOT NULL DEFAULT 'PENDING',
          server_id INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);
      `);
      return db;
    })();
  }
  return dbPromise;
}
```

> **Narasi pengajar:** Dua hal yang perlu dipahami. Pertama, koneksi dibuka sekali lalu dipakai ulang agar tidak boros. Kedua, perintah CREATE TABLE IF NOT EXISTS aman dijalankan berkali-kali karena hanya membuat tabel bila belum ada. Itu yang membuat aplikasi aman dibuka berulang.

## 6. Repository dan CRUD

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
  server_id: number | null;
};

const dariRow = (r: Row): Note => ({
  id: r.id,
  serverId: r.server_id,
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

/** Catatan yang belum dikirim ke server. */
export async function catatanPending(): Promise<Note[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>("SELECT * FROM notes WHERE sync_status = 'PENDING'");
  return rows.map(dariRow);
}

export async function tandaiSynced(id: number, serverId: number): Promise<void> {
  const db = await getDb();
  await db.runAsync("UPDATE notes SET sync_status = 'SYNCED', server_id = ? WHERE id = ?", [serverId, id]);
}

/** Menyimpan catatan yang berasal dari server sebagai SYNCED, bila belum ada di lokal. */
export async function simpanDariServer(n: Note & { serverId: number }): Promise<void> {
  const db = await getDb();
  const ada = await db.getFirstAsync<{ id: number }>('SELECT id FROM notes WHERE server_id = ?', [n.serverId]);
  if (ada) return;
  await db.runAsync(
    "INSERT INTO notes (title, content, latitude, longitude, updated_at, sync_status, server_id) VALUES (?, ?, ?, ?, ?, 'SYNCED', ?)",
    [n.title, n.content, n.latitude, n.longitude, n.updatedAt, n.serverId],
  );
}
```

> **Narasi pengajar:** Repository adalah satu-satunya tempat yang boleh menulis SQL. Halaman hanya memanggil fungsi seperti simpanCatatan. Perhatikan tanda tanya pada perintah SQL: nilai dikirim terpisah dari perintah, sehingga pengguna tidak bisa menyisipkan SQL berbahaya lewat isian. Buka simulasi CRUD dan lakukan tambah, ubah, hapus.

## 7. Model berlapis dan sinkronisasi

- **Lapisan**: tampilan (halaman) memanggil repository, repository memanggil SQLite.
- **Offline-first**: simpan ke SQLite dahulu, kirim ke server saat ada koneksi.
- Kolom `sync_status` menandai data **PENDING** (belum dikirim) atau **SYNCED**.
- Konflik sinkronisasi biasanya diselesaikan dengan `updated_at` terbaru.

> **Narasi pengajar:** Gambarkan tiga lapis di papan: tampilan, repository, penyimpanan. Tiap lapis hanya berbicara dengan lapis di bawahnya. Lalu jelaskan offline-first: simpan lokal dulu agar aplikasi cepat dan tetap jalan tanpa sinyal, kirim ke server saat ada koneksi. Buka simulasi offline untuk melihat status PENDING berubah menjadi SYNCED.

## Latihan

1. Tambahkan kolom `kategori` dan pikirkan cara memigrasikan data lama.
2. Tambahkan pencarian judul dengan `LIKE`.
3. Uji: tambah catatan, tutup aplikasi, buka kembali.

## Proyek Modul: Pelacak Kebiasaan dengan SQLite

Buat pelacak kebiasaan harian (minum air, olahraga, membaca). Pengguna menambah kebiasaan dan mencentang kebiasaan yang selesai hari ini. Data harus tetap ada setelah aplikasi ditutup.

Syarat utama:

- Dua tabel: `habits` (id, nama, dibuat) dan `logs` (id, habit_id, tanggal) dengan kunci asing.
- Lapisan repository terpisah dari tampilan: tambah, baca, ubah, hapus kebiasaan, serta catat dan batalkan centang.
- Satu migrasi: tambahkan kolom `warna` pada `habits` tanpa menghapus data lama.
- Layar daftar dengan jumlah hari berturut-turut (streak) per kebiasaan.
- Jawaban tertulis tiga kalimat: mengapa aplikasi ini memakai SQLite dan bukan MySQL langsung?

Brief lengkap, kriteria penerimaan, dan rubrik: [shared/docs/proyek](../../../shared/docs/proyek/modul-3-pelacak-kebiasaan-dengan-sqlite.md).

## Peta Kompetensi BNSP

Unit **J.612000.003.01**. Elemen yang dinilai:

- Mendesain internal storage
- Mendesain external storage
- Mendesain database SQLite
- Mendesain database mobile dengan model berlapis

Bukti pada pelatihan ini: `src/data/database.ts`, `src/data/noteRepository.ts`, data bertahan setelah aplikasi ditutup.

Praktik langkah demi langkah: [hands-on Hari 1, Step 5 sampai 7](../hands-on/hari-1.md).
