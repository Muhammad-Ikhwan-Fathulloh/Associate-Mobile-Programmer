// Fungsi murni untuk jarak dan arah. Tidak memakai GPS atau sensor, sehingga mudah diuji.

const JARI_JARI_BUMI_METER = 6371000;
const keRadian = (d: number) => (d * Math.PI) / 180;
const keDerajat = (r: number) => (r * 180) / Math.PI;

/** Jarak lingkaran besar (Haversine) dalam meter. */
export function jarakMeter(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = keRadian(lat2 - lat1);
  const dLon = keRadian(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(keRadian(lat1)) * Math.cos(keRadian(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * JARI_JARI_BUMI_METER * Math.asin(Math.sqrt(a));
}

/** Arah awal dari titik asal ke tujuan, dalam derajat (0 = utara, searah jarum jam). */
export function arahKeTujuan(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = keRadian(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(keRadian(lat2));
  const x =
    Math.cos(keRadian(lat1)) * Math.sin(keRadian(lat2)) -
    Math.sin(keRadian(lat1)) * Math.cos(keRadian(lat2)) * Math.cos(dLon);
  return (keDerajat(Math.atan2(y, x)) + 360) % 360;
}

/** Selisih arah tujuan terhadap arah hadap ponsel, dalam rentang -180 sampai 180. */
export function arahRelatif(arahTujuan: number, arahHadap: number): number {
  return ((((arahTujuan - arahHadap + 540) % 360) + 360) % 360) - 180;
}

const MATA_ANGIN = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];

/** Singkatan mata angin: U, TL, T, TG, S, BD, B, BL. */
export function mataAngin(derajat: number): string {
  const normal = ((derajat % 360) + 360) % 360;
  return MATA_ANGIN[Math.round(normal / 45) % 8];
}

/** Teks jarak untuk tampilan: meter di bawah 1 km, selain itu kilometer. */
export function formatJarak(meter: number): string {
  return meter < 1000 ? `${Math.round(meter)} m` : `${(meter / 1000).toFixed(1)} km`;
}
