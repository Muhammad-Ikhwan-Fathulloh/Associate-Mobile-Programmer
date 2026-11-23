export type Vektor = { x: number; y: number; z: number };

/** Besar vektor tiga sumbu. Diam di meja, akselerometer (satuan g) bernilai sekitar 1. */
export function besarVektor(v: Vektor): number {
  return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

/** Guncangan terdeteksi bila besar percepatan melewati ambang (satuan g). */
export function terdeteksiGuncangan(v: Vektor, ambang = 2): boolean {
  return besarVektor(v) > ambang;
}

/**
 * Perkiraan arah kompas (derajat, 0 = utara, searah jarum jam) dari magnetometer
 * saat ponsel datar. Hasilnya perkiraan: sumbu sensor dapat berbeda antarperangkat.
 */
export function arahKompas(m: Pick<Vektor, 'x' | 'y'>): number {
  const derajat = (Math.atan2(-m.x, m.y) * 180) / Math.PI;
  return (derajat + 360) % 360;
}

export function mataAngin(derajat: number): string {
  const nama = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
  return nama[Math.round((((derajat % 360) + 360) % 360) / 45) % 8];
}
