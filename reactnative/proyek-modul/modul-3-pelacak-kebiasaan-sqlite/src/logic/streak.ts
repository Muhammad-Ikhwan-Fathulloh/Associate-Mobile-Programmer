// Fungsi murni: tidak menyentuh basis data, sehingga mudah diuji.
const HARI_MS = 86_400_000;

const keMilidetik = (tanggal: string) => Date.parse(`${tanggal}T00:00:00Z`);

/**
 * Jumlah hari berturut-turut yang berakhir pada tanggal terbaru.
 * Tanggal ganda dihitung sekali. Jeda satu hari memutus streak.
 */
export function hitungStreak(tanggal: string[]): number {
  const unik = [...new Set(tanggal)]
    .map(keMilidetik)
    .filter((ms) => !Number.isNaN(ms))
    .sort((a, b) => b - a);
  if (unik.length === 0) return 0;

  let streak = 1;
  for (let i = 1; i < unik.length && unik[i - 1] - unik[i] === HARI_MS; i++) streak++;
  return streak;
}

/** Tanggal lokal dalam format YYYY-MM-DD. */
export function tanggalDari(waktu: Date): string {
  const y = waktu.getFullYear();
  const m = String(waktu.getMonth() + 1).padStart(2, '0');
  const d = String(waktu.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
