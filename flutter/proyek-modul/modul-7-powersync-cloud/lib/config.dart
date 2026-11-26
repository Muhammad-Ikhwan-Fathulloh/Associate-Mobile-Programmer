// Isi dengan nilai milik Anda. Nilai ini boleh dibagikan di kelas, tetapi
// jangan memasukkan kunci rahasia (service_role) atau kata sandi ke sini.
const supabaseUrl = 'https://GANTI-ID.supabase.co';
const supabaseAnonKey = 'GANTI-ANON-KEY';
const powersyncUrl = 'https://6b0773d2d1877570e4e7eaef.powersync.journeyapps.com';

/// Mengembalikan true bila semua nilai sudah diganti dari placeholder.
bool konfigurasiSudahDiisi() =>
    !supabaseUrl.contains('GANTI') &&
    !supabaseAnonKey.contains('GANTI') &&
    !powersyncUrl.contains('GANTI');
