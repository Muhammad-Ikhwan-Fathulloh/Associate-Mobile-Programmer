import 'package:powersync/powersync.dart';

/// Skema di perangkat. Kolom `id` dibuat otomatis oleh PowerSync.
/// Tabel ini juga harus ada di Supabase dengan nama dan kolom yang sama.
const schema = Schema([
  Table('notes', [
    Column.text('title'),
    Column.text('content'),
  ]),
]);
