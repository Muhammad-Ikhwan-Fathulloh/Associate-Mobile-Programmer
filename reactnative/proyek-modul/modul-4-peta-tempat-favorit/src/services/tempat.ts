// Fungsi murni untuk daftar dan peta. Tidak menyentuh GPS atau basis data.
import { Koordinat, Tempat } from '../models/tempat';
import { jarakMeter } from './distance';

export type TempatBerjarak = Tempat & { jarakM: number | null };

const punyaKoordinat = (t: Tempat): t is Tempat & Koordinat =>
  typeof t.latitude === 'number' && typeof t.longitude === 'number';

/** Hanya tempat yang punya koordinat yang tampil di peta. */
export function tempatUntukPeta(daftar: Tempat[]): (Tempat & Koordinat)[] {
  return daftar.filter(punyaKoordinat);
}

/**
 * Menghitung jarak dari posisi sekarang lalu mengurutkan dari yang terdekat.
 * Tempat tanpa koordinat diletakkan di akhir dengan jarakM = null.
 */
export function urutkanJarak(daftar: Tempat[], dari: Koordinat): TempatBerjarak[] {
  return daftar
    .map((t): TempatBerjarak => ({
      ...t,
      jarakM: punyaKoordinat(t) ? jarakMeter(dari.latitude, dari.longitude, t.latitude, t.longitude) : null,
    }))
    .sort((a, b) => {
      if (a.jarakM === null) return b.jarakM === null ? 0 : 1;
      if (b.jarakM === null) return -1;
      return a.jarakM - b.jarakM;
    });
}
