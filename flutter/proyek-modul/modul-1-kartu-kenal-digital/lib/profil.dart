// Data profil disimpan dalam satu kelas bertipe, terpisah dari tampilan.
class Profil {
  const Profil({required this.nama, required this.peran, required this.keahlian});

  final String nama;
  final String peran;
  final List<String> keahlian;
}

const profilSaya = Profil(
  nama: 'Ani Lestari',
  peran: 'Peserta Associate Mobile Programmer',
  keahlian: ['Flutter', 'Dart', 'Material 3'],
);

/// Mengubah "Ani Lestari" menjadi "AL". Nama kosong menghasilkan teks kosong.
String inisial(String nama) {
  final kata = nama.trim().split(RegExp(r'\s+')).where((k) => k.isNotEmpty).take(2);
  return kata.map((k) => k[0].toUpperCase()).join();
}
