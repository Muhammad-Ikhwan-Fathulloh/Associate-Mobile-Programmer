// Rasio kontras WCAG antara dua warna heksadesimal (#rrggbb). Minimal 4,5 untuk teks biasa.

function luminansi(hex: string): number {
  const kanal = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = kanal.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function rasioKontras(warnaA: string, warnaB: string): number {
  const [terang, gelap] = [luminansi(warnaA), luminansi(warnaB)].sort((x, y) => y - x);
  return (terang + 0.05) / (gelap + 0.05);
}
