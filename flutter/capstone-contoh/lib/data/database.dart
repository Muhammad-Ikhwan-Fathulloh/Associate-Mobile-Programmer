import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

/// Basis data jurnal. Versi 1: tabel awal. Versi 2: menambah kolom kategori (migrasi).
class AppDatabase {
  AppDatabase._();

  static const _versi = 2;
  static Database? _db;

  static Future<Database> get instance async {
    final ada = _db;
    if (ada != null) return ada;
    final path = join(await getDatabasesPath(), 'jurnal.db');
    final db = await openDatabase(
      path,
      version: _versi,
      onCreate: (db, _) async {
        await _buatVersi1(db);
        await _tambahKategori(db);
      },
      onUpgrade: (db, lama, _) async {
        if (lama < 1) await _buatVersi1(db);
        if (lama < 2) await _tambahKategori(db);
      },
    );
    _db = db;
    return db;
  }

  static Future<void> _buatVersi1(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS entri (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        judul TEXT NOT NULL,
        catatan TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        updated_at INTEGER NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'PENDING',
        server_id TEXT
      )
    ''');
  }

  /// Migrasi versi 2: menambah kolom kategori tanpa menghapus data lama.
  static Future<void> _tambahKategori(Database db) async {
    final kolom = await db.rawQuery('PRAGMA table_info(entri)');
    if (kolom.any((k) => k['name'] == 'kategori')) return;
    await db.execute("ALTER TABLE entri ADD COLUMN kategori TEXT NOT NULL DEFAULT 'Kota'");
  }
}
