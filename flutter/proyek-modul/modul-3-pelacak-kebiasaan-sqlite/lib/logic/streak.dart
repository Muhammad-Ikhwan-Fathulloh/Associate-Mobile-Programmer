// Fungsi murni: tidak menyentuh basis data, sehingga mudah diuji.

/// Jumlah hari berturut-turut yang berakhir pada tanggal terbaru.
/// Tanggal dalam format YYYY-MM-DD. Tanggal ganda dihitung sekali.
/// Jeda satu hari memutus streak.
int hitungStreak(List<String> tanggal) {
  final unik = tanggal.toSet().map(_keHari).whereType<int>().toList()
    ..sort((a, b) => b.compareTo(a));
  if (unik.isEmpty) return 0;

  var streak = 1;
  for (var i = 1; i < unik.length && unik[i - 1] - unik[i] == 1; i++) {
    streak++;
  }
  return streak;
}

/// Tanggal lokal dalam format YYYY-MM-DD.
String tanggalDari(DateTime waktu) {
  final m = waktu.month.toString().padLeft(2, '0');
  final d = waktu.day.toString().padLeft(2, '0');
  return '${waktu.year}-$m-$d';
}

/// Hari sejak epoch, atau null bila format tanggal tidak valid.
int? _keHari(String tanggal) {
  final waktu = DateTime.tryParse(tanggal);
  if (waktu == null) return null;
  return DateTime.utc(waktu.year, waktu.month, waktu.day).millisecondsSinceEpoch ~/ Duration.millisecondsPerDay;
}
