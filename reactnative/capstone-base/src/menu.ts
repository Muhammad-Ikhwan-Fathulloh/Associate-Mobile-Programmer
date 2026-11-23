import { Konfigurasi, proyek } from './proyek.config';

type Item = { href: string; judul: string; ket: string };

/** Menu beranda. Mengikuti nama entri dan fitur yang diaktifkan di proyek.config.ts. */
export function buatMenu(p: Konfigurasi = proyek): Item[] {
  const e = p.namaEntri;
  const f = p.fitur;
  const semua: [boolean, Item][] = [
    [true, { href: '/notes', judul: e, ket: `Daftar ${e.toLowerCase()} di SQLite: tambah, ubah, hapus` }],
    [f.lokasi, { href: '/location', judul: 'Lokasi dan Peta', ket: 'GPS, jarak, dan peta OpenStreetMap' }],
    [f.sinkron, { href: '/sinkron', judul: 'API dan Sinkronisasi', ket: `Kirim dan ambil ${e.toLowerCase()} dari server` }],
    [f.sensor, { href: '/sensor', judul: 'Sensor', ket: 'Akselerometer, giroskop, kompas, guncangan' }],
    [f.jaringan, { href: '/network', judul: 'Jaringan', ket: 'Status koneksi dan jenis jaringan' }],
    [f.perangkat, { href: '/device', judul: 'Info Perangkat', ket: 'Model, OS, memori' }],
    [f.keamanan, { href: '/keamanan', judul: 'Keamanan', ket: 'HTTPS dan penyimpanan aman' }],
    [f.kreatif, { href: '/kreatif', judul: 'Fitur Kreatif', ket: 'Tempat fitur buatan Anda' }],
  ];
  return semua.filter(([aktif]) => aktif).map(([, item]) => item);
}

export const MENU = buatMenu();
