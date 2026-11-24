export type Habit = {
  id: number;
  nama: string;
  warna: string;
  /** Tanggal selesai dalam format YYYY-MM-DD, diurutkan dari terbaru. */
  tanggal: string[];
};

/** Mengembalikan pesan error jika nama tidak valid, atau null bila valid. */
export function validasiNama(nama: string): string | null {
  const bersih = nama.trim();
  if (bersih.length === 0) return 'Nama kebiasaan wajib diisi.';
  if (bersih.length > 40) return 'Nama maksimal 40 karakter.';
  return null;
}
