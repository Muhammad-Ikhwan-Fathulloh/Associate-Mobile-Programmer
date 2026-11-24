// Ubah berkas ini lebih dulu: identitas aplikasi Anda ada di sini.
// Nilai warna harus sama dengan variable di Figma Anda.

export type Konfigurasi = {
  namaAplikasi: string;
  tagline: string;
  namaEntri: string;
  warnaUtama: string;
  urlServer: string;
  /** Isi contoh catatan saat basis data masih kosong, agar aplikasi langsung terlihat hidup. Ubah ke false setelah Anda siap. */
  contohAwal: boolean;
  fitur: Record<'lokasi' | 'sinkron' | 'sensor' | 'jaringan' | 'perangkat' | 'keamanan' | 'kreatif', boolean>;
};

export const proyek: Konfigurasi = {
  /** Nama aplikasi (judul beranda dan bilah atas). */
  namaAplikasi: 'Aplikasi Saya',
  /** Kalimat di beranda. */
  tagline: 'Pilih fitur',
  /** Nama satu entri data. Contoh: 'Catatan', 'Laporan', 'Tempat', 'Perjalanan'. */
  namaEntri: 'Catatan',
  /** Warna utama (heksadesimal). Ganti sesuai desain. */
  warnaUtama: '#1565c0',
  /** Alamat server. Emulator Android: 10.0.2.2. Ponsel fisik: IP komputer. */
  urlServer: 'http://10.0.2.2:3000',
  contohAwal: true,
  /** Matikan fitur yang tidak Anda pakai agar menu bersih. */
  fitur: {
    lokasi: true,
    sinkron: true,
    sensor: true,
    jaringan: true,
    perangkat: true,
    keamanan: true,
    kreatif: true,
  },
};

/** Ide fitur kreatif. Pilih satu atau buat sendiri. */
export const IDE_KREATIF = [
  'Guncang ponsel untuk membuat entri cepat (sensor + SQLite).',
  'Pengingat saat Anda berada dekat lokasi tersimpan (GPS + jarak Haversine).',
  'Kategori dan filter (migrasi tabel + UI).',
  'Statistik: jumlah entri per hari atau per kategori.',
  'Mode gelap dengan token kedua.',
  'Ekspor entri menjadi teks atau CSV dan bagikan.',
];
