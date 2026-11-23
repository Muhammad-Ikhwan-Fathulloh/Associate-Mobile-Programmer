export type Note = {
  id?: number;
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  updatedAt: number;
  syncStatus: 'PENDING' | 'SYNCED';
};

export function noteBaru(
  title: string,
  content: string,
  latitude: number | null = null,
  longitude: number | null = null,
): Note {
  return { title, content, latitude, longitude, updatedAt: Date.now(), syncStatus: 'PENDING' };
}

/** Mengembalikan pesan error jika judul tidak valid, atau null jika valid. */
export function validasiJudul(judul: string): string | null {
  if (judul.trim().length === 0) return 'Judul wajib diisi.';
  if (judul.trim().length > 100) return 'Judul maksimal 100 karakter.';
  return null;
}
