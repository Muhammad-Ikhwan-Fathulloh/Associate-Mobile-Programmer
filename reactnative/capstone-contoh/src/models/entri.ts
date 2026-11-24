export type StatusSync = 'PENDING' | 'SYNCED';

export const KATEGORI = ['Kota', 'Alam', 'Kuliner', 'Budaya'] as const;

export type Entri = {
  id?: number;
  /** Id di MockAPI (string). Null bila belum pernah dikirim. */
  serverId: string | null;
  judul: string;
  catatan: string;
  kategori: string;
  /** Null bila entri disimpan tanpa koordinat GPS. */
  latitude: number | null;
  longitude: number | null;
  updatedAt: number;
  status: StatusSync;
};

/** Mengembalikan pesan error jika judul tidak valid, atau null bila valid. */
export function validasiJudul(judul: string): string | null {
  const bersih = judul.trim();
  if (bersih.length === 0) return 'Judul wajib diisi.';
  if (bersih.length > 100) return 'Judul maksimal 100 karakter.';
  return null;
}

export const punyaKoordinat = (e: Pick<Entri, 'latitude' | 'longitude'>) =>
  e.latitude != null && e.longitude != null;
