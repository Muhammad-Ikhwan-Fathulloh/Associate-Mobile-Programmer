// Fungsi murni untuk sensor. Tidak memakai perangkat, sehingga bisa diuji di komputer.

export type Vektor = { x: number; y: number; z: number };

/** Besar vektor tiga sumbu. Akselerometer diam di meja bernilai sekitar 1 g (gravitasi). */
export function besarVektor(v: Vektor): number {
  return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

/** Guncangan bila besar percepatan (satuan g) lebih besar dari ambang. Tepat di ambang belum dihitung. */
export function terdeteksiGuncangan(v: Vektor, ambang = 2): boolean {
  return besarVektor(v) > ambang;
}

/**
 * Menghitung satu guncangan per kejadian. Pembacaan berikutnya dalam `jedaMs`
 * setelah guncangan dianggap bagian dari guncangan yang sama.
 */
export class PendeteksiGuncangan {
  private terakhirMs = Number.NEGATIVE_INFINITY;

  constructor(
    private readonly ambang = 2,
    private readonly jedaMs = 800,
  ) {}

  /** Mengembalikan true bila pembacaan ini dihitung sebagai satu guncangan baru. */
  masukkan(v: Vektor, waktuMs: number): boolean {
    if (!terdeteksiGuncangan(v, this.ambang)) return false;
    if (waktuMs - this.terakhirMs < this.jedaMs) return false;
    this.terakhirMs = waktuMs;
    return true;
  }
}

/**
 * Derajat kompas (0 = utara, searah jarum jam) dari magnetometer saat ponsel datar.
 * Perkiraan saja: sumbu tiap perangkat dapat berbeda.
 */
export function arahKompas(m: Pick<Vektor, 'x' | 'y'>): number {
  const derajat = (Math.atan2(-m.x, m.y) * 180) / Math.PI;
  return (derajat + 360) % 360;
}

const MATA_ANGIN = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];

/** Singkatan mata angin untuk derajat: U, TL, T, TG, S, BD, B, BL. */
export function mataAngin(derajat: number): string {
  const normal = ((derajat % 360) + 360) % 360;
  return MATA_ANGIN[Math.round(normal / 45) % 8];
}
