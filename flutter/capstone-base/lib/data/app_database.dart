import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

import '../proyek_config.dart';

/// Pengelola koneksi SQLite. Database dibuat sekali lalu digunakan ulang.
class AppDatabase {
  static const _namaDatabase = 'proyek_saya.db';
  static const _versi = 2;

  /// Contoh catatan (dua dengan koordinat GPS, satu tanpa lokasi).
  static const _contoh = [
    {'title': 'Kopi Pagi', 'content': 'Kafe dekat stasiun. Contoh catatan dengan koordinat GPS.', 'latitude': -6.9147, 'longitude': 107.6098},
    {'title': 'Perpustakaan Kota', 'content': 'Contoh catatan kedua untuk mencoba pencarian dan jarak.', 'latitude': -6.9023, 'longitude': 107.6186},
    {'title': 'Ide Tanpa Lokasi', 'content': 'Contoh catatan tanpa GPS. Statusnya PENDING sampai Anda sinkronkan.', 'latitude': null, 'longitude': null},
  ];

  static Database? _database;

  static Future<Database> get instance async {
    final existing = _database;
    if (existing != null) return existing;

    final path = join(await getDatabasesPath(), _namaDatabase);
    final db = await openDatabase(
      path,
      version: _versi,
      onConfigure: (db) async {
        await db.execute('PRAGMA foreign_keys = ON');
      },
      onCreate: _buatTabel,
      onUpgrade: _migrasi,
    );
    _database = db;
    await _isiContohJikaKosong(db);
    return db;
  }

  static Future<void> _isiContohJikaKosong(Database db) async {
    if (!ProyekConfig.contohAwal) return;
    final hitung = Sqflite.firstIntValue(await db.rawQuery('SELECT COUNT(*) FROM notes'));
    if ((hitung ?? 0) > 0) return;

    final sekarang = DateTime.now().millisecondsSinceEpoch;
    final batch = db.batch();
    for (final c in _contoh) {
      batch.insert('notes', {...c, 'updated_at': sekarang, 'sync_status': 'PENDING'});
    }
    await batch.commit(noResult: true);
  }

  static Future<void> _buatTabel(Database db, int version) async {
    await db.execute('''
      CREATE TABLE notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        updated_at INTEGER NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'PENDING',
        server_id INTEGER
      )
    ''');
    await db.execute('CREATE INDEX idx_notes_updated_at ON notes(updated_at)');
  }

  // TODO(peserta): migrasi. Naikkan _versi, lalu tambahkan blok seperti:
  //   if (lama < 3) { await db.execute('ALTER TABLE notes ADD COLUMN kategori TEXT'); }
  //   Perbarui juga model Note, repository, dan form.
  static Future<void> _migrasi(Database db, int lama, int baru) async {
    if (lama < 2) {
      await db.execute('ALTER TABLE notes ADD COLUMN server_id INTEGER');
    }
  }
}
