// Repository: satu-satunya tempat yang menulis SQL untuk tabel entri.
import '../models/entri.dart';
import '../services/sync_service.dart';
import 'database.dart';

class EntriRepository implements PenyimpananEntri {
  Entri _dariBaris(Map<String, Object?> b) => Entri(
        id: b['id'] as int,
        serverId: b['server_id'] as String?,
        judul: b['judul'] as String,
        catatan: b['catatan'] as String,
        kategori: (b['kategori'] as String?) ?? 'Kota',
        latitude: (b['latitude'] as num?)?.toDouble(),
        longitude: (b['longitude'] as num?)?.toDouble(),
        updatedAt: b['updated_at'] as int,
        status: b['sync_status'] == 'SYNCED' ? StatusSync.synced : StatusSync.pending,
      );

  Future<List<Entri>> ambilSemua({String? kategori}) async {
    final db = await AppDatabase.instance;
    final baris = await db.query(
      'entri',
      where: kategori == null ? null : 'kategori = ?',
      whereArgs: kategori == null ? null : [kategori],
      orderBy: 'updated_at DESC',
    );
    return [for (final b in baris) _dariBaris(b)];
  }

  Future<Entri?> ambilSatu(int id) async {
    final db = await AppDatabase.instance;
    final baris = await db.query('entri', where: 'id = ?', whereArgs: [id]);
    return baris.isEmpty ? null : _dariBaris(baris.first);
  }

  /// Entri baru atau hasil ubah lokal selalu berstatus PENDING.
  Future<void> simpan(Entri e, {int? id}) async {
    final db = await AppDatabase.instance;
    final nilai = {
      'judul': e.judul.trim(),
      'catatan': e.catatan,
      'kategori': e.kategori,
      'latitude': e.latitude,
      'longitude': e.longitude,
      'updated_at': DateTime.now().millisecondsSinceEpoch,
      'sync_status': 'PENDING',
    };
    if (id == null) {
      await db.insert('entri', nilai);
    } else {
      await db.update('entri', nilai, where: 'id = ?', whereArgs: [id]);
    }
  }

  Future<void> hapus(int id) async {
    final db = await AppDatabase.instance;
    await db.delete('entri', where: 'id = ?', whereArgs: [id]);
  }

  @override
  Future<List<Entri>> entriPending() async {
    final db = await AppDatabase.instance;
    final baris = await db.query('entri', where: "sync_status = 'PENDING'", orderBy: 'updated_at ASC');
    return [for (final b in baris) _dariBaris(b)];
  }

  @override
  Future<void> tandaiSynced(int id, String serverId) async {
    final db = await AppDatabase.instance;
    await db.update('entri', {'sync_status': 'SYNCED', 'server_id': serverId}, where: 'id = ?', whereArgs: [id]);
  }

  @override
  Future<bool> simpanDariServer(Entri e, String serverId) async {
    final db = await AppDatabase.instance;
    final ada = await db.query('entri', columns: ['id'], where: 'server_id = ?', whereArgs: [serverId]);
    final nilai = {
      'judul': e.judul,
      'catatan': e.catatan,
      'latitude': e.latitude,
      'longitude': e.longitude,
      'updated_at': e.updatedAt,
      'sync_status': 'SYNCED',
      'server_id': serverId,
    };
    if (ada.isNotEmpty) {
      await db.update('entri', nilai, where: 'id = ?', whereArgs: [ada.first['id']]);
      return false;
    }
    await db.insert('entri', {...nilai, 'kategori': 'Kota'});
    return true;
  }
}
