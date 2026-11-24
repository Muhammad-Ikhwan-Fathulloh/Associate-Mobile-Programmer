// Fungsi murni untuk sensor. Tidak memakai perangkat, sehingga bisa diuji di komputer.

export type Vektor = { x: number; y: number; z: number };

/** Gravitasi bumi dalam m/s², untuk mengubah akselerometer dari m/s² ke g. */
export const GRAVITASI = 9.80665;

/** Besar vektor tiga sumbu. */
export function besarVektor(v: Vektor): number {
  return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

/** Arah hadap dari magnetometer saat ponsel datar. Perkiraan saja. */
export function arahHadap(x: number, y: number): number {
  const derajat = (Math.atan2(-x, y) * 180) / Math.PI;
  return (derajat + 360) % 360;
}

/** Menghitung satu guncangan per kejadian. Pembacaan dalam jeda dianggap guncangan yang sama. */
export class PendeteksiGuncangan {
  private terakhirMs: number | null = null;

  constructor(
    private readonly ambang = 2,
    private readonly jedaMs = 800,
  ) {}

  /** `besarG` dalam satuan g. Mengembalikan true bila dihitung sebagai guncangan baru. */
  masukkan(besarG: number, waktuMs: number): boolean {
    if (besarG <= this.ambang) return false;
    if (this.terakhirMs !== null && waktuMs - this.terakhirMs < this.jedaMs) return false;
    this.terakhirMs = waktuMs;
    return true;
  }
}
