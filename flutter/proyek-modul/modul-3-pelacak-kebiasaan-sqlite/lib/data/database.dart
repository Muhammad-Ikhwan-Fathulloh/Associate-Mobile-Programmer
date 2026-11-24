import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

/// Pengelola koneksi SQLite. Dibuka sekali lalu dipakai ulang.
/// Versi 1: tabel awal. Versi 2: menambah kolom warna tanpa menghapus data lama.
class AppDatabase {
  AppDatabase._();

  static const _namaDatabase = 'kebiasaan.db';
  static const _versi = 2;
  static Database? _db;

  static Future<Database> get instance async {
    final ada = _db;
    if (ada != null) return ada;

    final path = join(await getDatabasesPath(), _namaDatabase);
    final db = await openDatabase(
      path,
      version: _versi,
      onConfigure: (db) => db.execute('PRAGMA foreign_keys = ON'),
      onCreate: (db, versi) async {
        await _versi1(db);
        await _versi2(db);
      },
      onUpgrade: (db, lama, baru) async {
        if (lama < 1) await _versi1(db);
        if (lama < 2) await _versi2(db);
      },
    );
    _db = db;
    return db;
  }

  static Future<void> _versi1(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        dibuat INTEGER NOT NULL
      )
    ''');
    await db.execute('''
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
        tanggal TEXT NOT NULL,
        UNIQUE (habit_id, tanggal)
      )
    ''');
  }

  static Future<void> _versi2(Database db) async {
    final kolom = await db.rawQuery('PRAGMA table_info(habits)');
    if (kolom.any((k) => k['name'] == 'warna')) return;
    await db.execute("ALTER TABLE habits ADD COLUMN warna TEXT NOT NULL DEFAULT '#1565c0'");
  }
}
