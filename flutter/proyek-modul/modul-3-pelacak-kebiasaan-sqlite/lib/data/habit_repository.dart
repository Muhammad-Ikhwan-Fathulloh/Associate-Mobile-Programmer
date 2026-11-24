// Repository: satu-satunya tempat yang menulis SQL. Tampilan memanggil kelas ini.
import 'package:sqflite/sqflite.dart';

import '../models/habit.dart';
import 'database.dart';

class HabitRepository {
  Future<List<Habit>> ambilKebiasaan() async {
    final db = await AppDatabase.instance;
    final habits = await db.query('habits', columns: ['id', 'nama', 'warna'], orderBy: 'dibuat ASC');
    final logs = await db.query('logs', columns: ['habit_id', 'tanggal'], orderBy: 'tanggal DESC');
    return [
      for (final h in habits)
        Habit(
          id: h['id'] as int,
          nama: h['nama'] as String,
          warna: h['warna'] as String,
          tanggal: [
            for (final l in logs)
              if (l['habit_id'] == h['id']) l['tanggal'] as String,
          ],
        ),
    ];
  }

  Future<void> tambah(String nama, {String warna = '#1565c0'}) async {
    final db = await AppDatabase.instance;
    await db.insert('habits', {'nama': nama.trim(), 'dibuat': DateTime.now().millisecondsSinceEpoch, 'warna': warna});
  }

  /// Menghapus kebiasaan sekaligus lognya (ON DELETE CASCADE).
  Future<void> hapus(int id) async {
    final db = await AppDatabase.instance;
    await db.delete('habits', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> catatSelesai(int habitId, String tanggal) async {
    final db = await AppDatabase.instance;
    await db.insert('logs', {'habit_id': habitId, 'tanggal': tanggal}, conflictAlgorithm: ConflictAlgorithm.ignore);
  }

  Future<void> batalCatat(int habitId, String tanggal) async {
    final db = await AppDatabase.instance;
    await db.delete('logs', where: 'habit_id = ? AND tanggal = ?', whereArgs: [habitId, tanggal]);
  }
}
