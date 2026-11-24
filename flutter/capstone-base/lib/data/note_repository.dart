
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

  /// Catatan yang belum dikirim ke server.
  Future<List<Note>> catatanPending() async {
    final db = await AppDatabase.instance;
    final rows = await db.query(
      'notes',
      where: "sync_status = 'PENDING'",
      orderBy: 'updated_at ASC',
    );
    return rows.map(Note.fromMap).toList();
  }

  Future<void> tandaiSynced(int id, int serverId) async {
    final db = await AppDatabase.instance;
    await db.update(
      'notes',
      {'sync_status': 'SYNCED', 'server_id': serverId},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  /// Menyimpan catatan dari server. Mengembalikan true bila ada data baru.
  Future<bool> simpanDariServer(Map<String, dynamic> data) async {
    final db = await AppDatabase.instance;
    final serverId = data['id'] as int;
    final ada = await db.query('notes', where: 'server_id = ?', whereArgs: [serverId], limit: 1);
    if (ada.isNotEmpty) return false;
    await db.insert('notes', {
      'title': data['title'] as String,
      'content': (data['content'] as String?) ?? '',
      'latitude': (data['latitude'] as num?)?.toDouble(),
      'longitude': (data['longitude'] as num?)?.toDouble(),
      'updated_at': (data['updatedAt'] as num?)?.toInt() ?? DateTime.now().millisecondsSinceEpoch,
      'sync_status': 'SYNCED',
      'server_id': serverId,
    });
    return true;
  }
}
