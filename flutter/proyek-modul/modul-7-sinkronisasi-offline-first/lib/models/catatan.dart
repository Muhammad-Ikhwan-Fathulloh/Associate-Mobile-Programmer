enum StatusSync { pending, synced }

class Catatan {
  const Catatan({
    this.id,
    this.serverId,
    required this.title,
    required this.content,
    this.latitude,
    this.longitude,
    required this.updatedAt,
    this.syncStatus = StatusSync.pending,
  });

  final int? id;

  /// Id di MockAPI (string). Null bila catatan belum pernah dikirim.
  final String? serverId;
  final String title;
  final String content;
  final double? latitude;
  final double? longitude;
  final int updatedAt;
  final StatusSync syncStatus;

  Catatan copyWith({int? id, String? serverId, StatusSync? syncStatus}) => Catatan(
        id: id ?? this.id,
        serverId: serverId ?? this.serverId,
        title: title,
        content: content,
        latitude: latitude,
        longitude: longitude,
        updatedAt: updatedAt,
        syncStatus: syncStatus ?? this.syncStatus,
      );
}

/// Mengembalikan pesan error jika judul tidak valid, atau null bila valid.
String? validasiJudul(String judul) {
  final bersih = judul.trim();
  if (bersih.isEmpty) return 'Judul wajib diisi.';
  if (bersih.length > 100) return 'Judul maksimal 100 karakter.';
  return null;
}
