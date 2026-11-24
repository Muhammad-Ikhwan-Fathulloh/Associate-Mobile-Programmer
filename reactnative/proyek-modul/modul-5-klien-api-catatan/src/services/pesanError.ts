import { ApiError } from './httpsService';

/** Mengubah galat teknis menjadi pesan yang bisa dibaca pengguna. */
export function pesanRamah(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  if (e instanceof Error && e.name === 'AbortError') return 'Server terlalu lama merespons. Coba lagi.';
  if (e instanceof TypeError) return 'Server tidak dapat dijangkau. Pastikan server berjalan dan alamatnya benar.';
  if (e instanceof Error) return e.message;
  return 'Terjadi kesalahan yang tidak dikenal.';
}
