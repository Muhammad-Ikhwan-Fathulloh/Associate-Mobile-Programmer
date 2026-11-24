// Peta bukti: setiap unit kompetensi menunjuk berkas kode yang membuktikannya.
// Berkas dicari relatif terhadap folder `flutter/proyek-modul` (folder modul 1 sampai 7 di sebelah proyek ini).

class Bukti {
  const Bukti({required this.unit, required this.judul, required this.folder, required this.berkas});

  final String unit;
  final String judul;

  /// Folder modul yang membuktikan unit ini, relatif terhadap `flutter/proyek-modul`.
  final String folder;

  /// Berkas bukti di dalam folder modul.
  final String berkas;
}

const buktiKompetensi = [
  Bukti(unit: 'J.612000.001.01', judul: 'Platform OS dan bahasa pemrograman', folder: 'modul-1-kartu-kenal-digital', berkas: 'lib/profil.dart'),
  Bukti(unit: 'J.612000.007.01', judul: 'Mobile Interface', folder: 'modul-2-redesain-dua-layar-token', berkas: 'lib/theme/tema.dart'),
  Bukti(unit: 'J.612000.003.01', judul: 'Database dan data persistence', folder: 'modul-3-pelacak-kebiasaan-sqlite', berkas: 'lib/data/database.dart'),
  Bukti(unit: 'J.612000.006.01', judul: 'LBS, GPS, dan navigasi', folder: 'modul-4-peta-tempat-favorit', berkas: 'lib/services/lokasi.dart'),
  Bukti(unit: 'J.612000.025.01', judul: 'Mobile cellular network', folder: 'modul-5-klien-api-catatan', berkas: 'lib/services/api_client.dart'),
  Bukti(unit: 'J.612000.022.01', judul: 'Mobile sensor dan spesifikasi', folder: 'modul-6-penghitung-guncangan-kompas', berkas: 'lib/services/sensor_math.dart'),
  Bukti(unit: 'J.612000.008.01', judul: 'Mobile communication security', folder: 'modul-7-sinkronisasi-offline-first', berkas: 'lib/services/secure_storage.dart'),
];
