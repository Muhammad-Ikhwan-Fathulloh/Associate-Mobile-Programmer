// Repository: satu-satunya tempat yang menulis SQL untuk tabel notes.
import 'package:sqflite/sqflite.dart';

import '../models/catatan.dart';
import '../services/sync_service.dart';
import 'database.dart';

class CatatanRepository implements PenyimpananCatatan {
  Catatan _dariBaris(Map<String, Object?> b) => Catatan(
        id: b['id'] as int,
        serverId: b['server_id'] as int?,
        title: b['title'] as String,
        content: b['content'] as String,
        latitude: (b['latitude'] as num?)?.toDouble(),
        longitude: (b['longitude'] as num?)?.toDouble(),
        updatedAt: b['updated_at'] as int,
        syncStatus: b['sync_status'] == 'SYNCED' ? StatusSync.synced : StatusSync.pending,
      );

  Future<List<Catatan>> ambilSemua() async {
    final db = await AppDatabase.instance;
    final baris = await db.query('notes', orderBy: 'updated_at DESC');
    return [for (final b in baris) _dariBaris(b)];
  }

  /// Catatan baru atau hasil ubah lokal selalu berstatus PENDING.
  Future<void> tambah(String title, String content) async {
    final db = await AppDatabase.instance;
    await db.insert('notes', {
      'title': title.trim(),
      'content': content,
      'updated_at': DateTime.now().millisecondsSinceEpoch,
      'sync_status': 'PENDING',
    });
  }

  @override
  Future<List<Catatan>> catatanPending() async {
    final db = await AppDatabase.instance;
    final baris = await db.query('notes', where: "sync_status = 'PENDING'", orderBy: 'updated_at ASC');
    return [for (final b in baris) _dariBaris(b)];
  }

  @override
  Future<void> tandaiSynced(int id, int serverId) async {
    final db = await AppDatabase.instance;
    await db.update('notes', {'sync_status': 'SYNCED', 'server_id': serverId}, where: 'id = ?', whereArgs: [id]);
  }

  /// Memperbarui catatan yang sudah dikenal (berdasarkan server_id) atau menyimpan yang baru.
  @override
  Future<bool> simpanDariServer(Catatan c, int serverId) async {
    final db = await AppDatabase.instance;
    final ada = await db.query('notes', columns: ['id'], where: 'server_id = ?', whereArgs: [serverId]);
    final nilai = {
      'title': c.title,
      'content': c.content,
      'latitude': c.latitude,
      'longitude': c.longitude,
      'updated_at': c.updatedAt,
      'sync_status': 'SYNCED',
      'server_id': serverId,
    };
    if (ada.isNotEmpty) {
      await db.update('notes', nilai, where: 'id = ?', whereArgs: [ada.first['id']]);
      return false;
    }
    await db.insert('notes', nilai, conflictAlgorithm: ConflictAlgorithm.replace);
    return true;
  }
}
