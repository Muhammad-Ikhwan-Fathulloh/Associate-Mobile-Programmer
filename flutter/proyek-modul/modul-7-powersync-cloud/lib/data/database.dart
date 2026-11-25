import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:powersync/powersync.dart';

import 'schema.dart';

/// Membuka database SQLite lokal PowerSync. Panggil sekali saat aplikasi mulai.
Future<PowerSyncDatabase> bukaDatabase() async {
  final dir = await getApplicationSupportDirectory();
  final db = PowerSyncDatabase(
    schema: schema,
    path: join(dir.path, 'notes_powersync.db'),
  );
  await db.initialize();
  return db;
}
