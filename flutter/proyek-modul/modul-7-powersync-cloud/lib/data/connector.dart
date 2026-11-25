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
      // Galat permanen (data tidak valid atau izin ditolak) tidak akan berhasil
      // bila dicoba ulang, jadi transaksinya dibuang. Galat lain dicoba lagi.
      final kodePermanen = (e.code ?? '').startsWith('22') ||
          (e.code ?? '').startsWith('23') ||
          e.code == '42501';
      if (kodePermanen) {
        await transaksi.complete();
      } else {
        rethrow;
      }
    }
  }
}
