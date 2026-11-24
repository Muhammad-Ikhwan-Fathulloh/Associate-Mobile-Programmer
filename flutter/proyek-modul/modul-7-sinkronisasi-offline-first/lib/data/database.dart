import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

/// Basis data catatan offline. Tabel notes menyimpan status sinkronisasi dan server_id.
class AppDatabase {
  AppDatabase._();

  static Database? _db;

  static Future<Database> get instance async {
    final ada = _db;
    if (ada != null) return ada;
    final path = join(await getDatabasesPath(), 'catatan_offline.db');
    final db = await openDatabase(
      path,
      version: 1,
      onCreate: (db, _) => db.execute('''
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
      '''),
    );
    _db = db;
    return db;
  }
}
