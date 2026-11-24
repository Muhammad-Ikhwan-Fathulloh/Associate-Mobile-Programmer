export type Tempat = {
  id?: number;
  nama: string;
  /** Null bila tempat disimpan tanpa koordinat GPS. */
  latitude: number | null;
  longitude: number | null;
};

export type Koordinat = { latitude: number; longitude: number };

/** Mengembalikan pesan error jika nama tidak valid, atau null bila valid. */
export function validasiNama(nama: string): string | null {
  const bersih = nama.trim();
  if (bersih.length === 0) return 'Nama tempat wajib diisi.';
  if (bersih.length > 60) return 'Nama maksimal 60 karakter.';
  return null;
}
