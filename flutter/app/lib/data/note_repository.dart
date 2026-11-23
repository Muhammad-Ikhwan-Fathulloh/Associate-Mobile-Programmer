import 'package:sqflite/sqflite.dart';

import '../models/note.dart';
import 'app_database.dart';

/// Operasi CRUD untuk tabel notes.
class NoteRepository {
  Future<List<Note>> ambilSemua() async {
    final db = await AppDatabase.instance;
    final rows = await db.query('notes', orderBy: 'updated_at DESC');
    return rows.map(Note.fromMap).toList();
  }

  Future<int> simpan(Note note) async {
    final db = await AppDatabase.instance;
    final values = note.toMap()..remove('id');
    return db.insert('notes', values);
  }

  Future<int> ubah(Note note) async {
    final db = await AppDatabase.instance;
    return db.update(
      'notes',
      note.toMap(),
      where: 'id = ?',
      whereArgs: [note.id],
    );
  }

  Future<int> hapus(int id) async {
    final db = await AppDatabase.instance;
    return db.delete('notes', where: 'id = ?', whereArgs: [id]);
  }
}
