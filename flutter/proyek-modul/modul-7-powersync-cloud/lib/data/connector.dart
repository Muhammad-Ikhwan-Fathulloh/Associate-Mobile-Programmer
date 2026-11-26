import 'package:powersync/powersync.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../config.dart';

/// Menghubungkan PowerSync dengan Supabase.
/// - fetchCredentials: memberi PowerSync token dari sesi Supabase.
/// - uploadData: mengirim tulisan lokal yang antre ke tabel Supabase.
class SupabaseConnector extends PowerSyncBackendConnector {
  SupabaseClient get supabase => Supabase.instance.client;

  @override
  Future<PowerSyncCredentials?> fetchCredentials() async {
    final sesi = supabase.auth.currentSession;
    if (sesi == null) return null;
    return PowerSyncCredentials(
      endpoint: powersyncUrl,
      token: sesi.accessToken,
      userId: sesi.user.id,
    );
  }

  @override
  void invalidateCredentials() {
    // Minta sesi Supabase diperbarui bila PowerSync menolak token.
    // Galat dibiarkan; token yang kedaluwarsa akan terlihat di permintaan berikutnya.
    supabase.auth
        .refreshSession()
        .timeout(const Duration(seconds: 5))
        .then((_) => null, onError: (_) => null);
  }

  @override
  Future<void> uploadData(PowerSyncDatabase database) async {
    final transaksi = await database.getNextCrudTransaction();
    if (transaksi == null) return;

    try {
      for (final op in transaksi.crud) {
        final tabel = supabase.from(op.table);
        final data = Map<String, dynamic>.of(op.opData ?? {});
        if (op.op == UpdateType.put) {
          data['id'] = op.id;
          await tabel.upsert(data);
        } else if (op.op == UpdateType.patch) {
          await tabel.update(data).eq('id', op.id);
        } else if (op.op == UpdateType.delete) {
          await tabel.delete().eq('id', op.id);
        }
      }
      await transaksi.complete();
    } on PostgrestException catch (e) {
      // Galat permanen tidak akan berhasil bila dicoba ulang, jadi transaksinya dibuang.
      // Galat lain (jaringan, server sibuk) dicoba lagi.
      if (kodeFatal.any((pola) => pola.hasMatch(e.code ?? ''))) {
        await transaksi.complete();
      } else {
        rethrow;
      }
    }
  }
}

/// Kode galat Postgres yang tidak bisa pulih dengan mencoba ulang.
final List<RegExp> kodeFatal = [
  // Kelas 22: data tidak valid, misalnya tipe data salah.
  RegExp(r'^22...$'),
  // Kelas 23: pelanggaran integritas, misalnya NOT NULL atau UNIQUE.
  RegExp(r'^23...$'),
  // Tidak punya izin, biasanya pelanggaran RLS.
  RegExp(r'^42501$'),
];
