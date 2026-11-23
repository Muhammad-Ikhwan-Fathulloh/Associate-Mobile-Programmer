import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

/// Pengelola koneksi SQLite. Database dibuat sekali lalu digunakan ulang.
class AppDatabase {
  static const _namaDatabase = 'associate_mobile.db';
  static const _versi = 2;

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
    return db;
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

  static Future<void> _migrasi(Database db, int lama, int baru) async {
    if (lama < 2) {
      await db.execute('ALTER TABLE notes ADD COLUMN server_id INTEGER');
    }
  }
}
