/** Mengembalikan pesan error jika judul tidak valid, atau null bila valid. */
export function validasiJudul(judul: string): string | null {
  const bersih = judul.trim();
  if (bersih.length === 0) return 'Judul wajib diisi.';
  if (bersih.length > 100) return 'Judul maksimal 100 karakter.';
  return null;
}
