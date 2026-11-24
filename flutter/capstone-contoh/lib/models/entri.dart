enum StatusSync { pending, synced }

const kategoriEntri = ['Kota', 'Alam', 'Kuliner', 'Budaya'];

class Entri {
  const Entri({
    this.id,
    this.serverId,
    required this.judul,
    required this.catatan,
    this.kategori = 'Kota',
    this.latitude,
    this.longitude,
    required this.updatedAt,
    this.status = StatusSync.pending,
  });

  final int? id;

  /// Id di server latihan. Null bila belum pernah dikirim.
  final int? serverId;
  final String judul;
  final String catatan;
  final String kategori;

  /// Null bila entri disimpan tanpa koordinat GPS.
  final double? latitude;
  final double? longitude;
  final int updatedAt;
  final StatusSync status;

  bool get punyaKoordinat => latitude != null && longitude != null;

  Entri copyWith({int? id, int? serverId, StatusSync? status}) => Entri(
        id: id ?? this.id,
        serverId: serverId ?? this.serverId,
        judul: judul,
        catatan: catatan,
        kategori: kategori,
        latitude: latitude,
        longitude: longitude,
        updatedAt: updatedAt,
        status: status ?? this.status,
      );
}

/// Mengembalikan pesan error jika judul tidak valid, atau null bila valid.
String? validasiJudul(String judul) {
  final bersih = judul.trim();
  if (bersih.isEmpty) return 'Judul wajib diisi.';
  if (bersih.length > 100) return 'Judul maksimal 100 karakter.';
  return null;
}
