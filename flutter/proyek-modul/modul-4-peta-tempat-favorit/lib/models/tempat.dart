class Tempat {
  const Tempat({this.id, required this.nama, this.latitude, this.longitude});

  final int? id;
  final String nama;

  /// Null bila tempat disimpan tanpa koordinat GPS.
  final double? latitude;
  final double? longitude;

  bool get punyaKoordinat => latitude != null && longitude != null;
}

/// Mengembalikan pesan error jika nama tidak valid, atau null bila valid.
String? validasiNama(String nama) {
  final bersih = nama.trim();
  if (bersih.isEmpty) return 'Nama tempat wajib diisi.';
  if (bersih.length > 60) return 'Nama maksimal 60 karakter.';
  return null;
}
