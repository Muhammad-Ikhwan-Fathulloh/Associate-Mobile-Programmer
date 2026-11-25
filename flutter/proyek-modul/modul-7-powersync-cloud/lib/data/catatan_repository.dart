import 'package:powersync/powersync.dart';

class Catatan {
  const Catatan({required this.id, required this.title, required this.content});

  final String id;
  final String title;
  final String content;
}

/// Semua akses data lewat sini. Tulisan langsung masuk SQLite lokal,
/// lalu PowerSync mengirimnya ke Supabase di latar belakang.
class CatatanRepository {
  CatatanRepository(this.db);

  final PowerSyncDatabase db;

  Stream<List<Catatan>> pantau() {
    return db.watch('SELECT id, title, content FROM notes ORDER BY title').map(
          (hasil) => [
            for (final baris in hasil)
              Catatan(
                id: baris['id'] as String,
                title: baris['title'] as String? ?? '',
                content: baris['content'] as String? ?? '',
              ),
          ],
        );
  }

  Future<void> tambah(String judul, String isi) {
    return db.execute(
      'INSERT INTO notes(id, title, content) VALUES(uuid(), ?, ?)',
      [judul, isi],
    );
  }

  Future<void> hapus(String id) {
    return db.execute('DELETE FROM notes WHERE id = ?', [id]);
  }
}
