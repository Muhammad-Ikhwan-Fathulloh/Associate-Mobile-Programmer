export type Note = {
  id?: number;
  serverId?: number | null;
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
  return { title, content, latitude, longitude, serverId: null, updatedAt: Date.now(), syncStatus: 'PENDING' };
}

/** Mengembalikan pesan error jika judul tidak valid, atau null jika valid. */
export function validasiJudul(judul: string): string | null {
  if (judul.trim().length === 0) return 'Judul wajib diisi.';
  if (judul.trim().length > 100) return 'Judul maksimal 100 karakter.';
  return null;
}

/** Teks koordinat untuk ditampilkan, atau null bila catatan tidak punya lokasi. */
export function formatKoordinat(n: Pick<Note, 'latitude' | 'longitude'>): string | null {
  if (n.latitude == null || n.longitude == null) return null;
  return `${n.latitude.toFixed(5)}, ${n.longitude.toFixed(5)}`;
}
