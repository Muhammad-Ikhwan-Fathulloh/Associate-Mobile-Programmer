import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

/// Basis data tempat favorit. Koordinat disimpan sebagai REAL, bukan teks.
class AppDatabase {
  AppDatabase._();

  static Database? _db;

  static Future<Database> get instance async {
    final ada = _db;
    if (ada != null) return ada;
    final path = join(await getDatabasesPath(), 'tempat.db');
    final db = await openDatabase(
      path,
      version: 1,
      onCreate: (db, _) => db.execute('''
        CREATE TABLE places (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nama TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          dibuat INTEGER NOT NULL
        )
      '''),
    );
    _db = db;
    return db;
  }
}
