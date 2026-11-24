class Habit {
  const Habit({required this.id, required this.nama, required this.warna, required this.tanggal});

  final int id;
  final String nama;
  final String warna;

  /// Tanggal selesai dalam format YYYY-MM-DD, diurutkan dari terbaru.
  final List<String> tanggal;

  bool sudahHari(String hari) => tanggal.contains(hari);
}

/// Mengembalikan pesan error jika nama tidak valid, atau null bila valid.
String? validasiNama(String nama) {
  final bersih = nama.trim();
  if (bersih.isEmpty) return 'Nama kebiasaan wajib diisi.';
  if (bersih.length > 40) return 'Nama maksimal 40 karakter.';
  return null;
}
