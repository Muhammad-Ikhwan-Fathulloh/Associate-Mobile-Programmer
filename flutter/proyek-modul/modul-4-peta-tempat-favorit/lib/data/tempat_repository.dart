// Repository: satu-satunya tempat yang menulis SQL untuk tabel places.
import '../models/tempat.dart';
import 'database.dart';

class TempatRepository {
  Future<List<Tempat>> ambilTempat() async {
    final db = await AppDatabase.instance;
    final baris = await db.query('places', orderBy: 'dibuat DESC');
    return [
      for (final b in baris)
        Tempat(
          id: b['id'] as int,
          nama: b['nama'] as String,
          latitude: (b['latitude'] as num?)?.toDouble(),
          longitude: (b['longitude'] as num?)?.toDouble(),
        ),
    ];
  }

  Future<void> simpan(Tempat t) async {
    final db = await AppDatabase.instance;
    await db.insert('places', {
      'nama': t.nama.trim(),
      'latitude': t.latitude,
      'longitude': t.longitude,
      'dibuat': DateTime.now().millisecondsSinceEpoch,
    });
  }

  Future<void> hapus(int id) async {
    final db = await AppDatabase.instance;
    await db.delete('places', where: 'id = ?', whereArgs: [id]);
  }
}
