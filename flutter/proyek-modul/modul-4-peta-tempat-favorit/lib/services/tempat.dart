// Fungsi murni untuk daftar dan peta. Tidak menyentuh GPS atau basis data.
import '../models/tempat.dart';
import 'distance.dart';

class TempatBerjarak {
  const TempatBerjarak(this.tempat, this.jarakM);

  final Tempat tempat;

  /// Null bila tempat tidak punya koordinat.
  final double? jarakM;
}

/// Hanya tempat yang punya koordinat yang tampil di peta.
List<Tempat> tempatUntukPeta(List<Tempat> daftar) => daftar.where((t) => t.punyaKoordinat).toList();

/// Menghitung jarak dari posisi sekarang lalu mengurutkan dari yang terdekat.
/// Tempat tanpa koordinat diletakkan di akhir dengan jarak null.
List<TempatBerjarak> urutkanJarak(List<Tempat> daftar, {required double latitude, required double longitude}) {
  final hasil = [
    for (final t in daftar)
      TempatBerjarak(
        t,
        t.punyaKoordinat ? jarakMeter(latitude, longitude, t.latitude!, t.longitude!) : null,
      ),
  ];
  hasil.sort((a, b) {
    if (a.jarakM == null) return b.jarakM == null ? 0 : 1;
    if (b.jarakM == null) return -1;
    return a.jarakM!.compareTo(b.jarakM!);
  });
  return hasil;
}
