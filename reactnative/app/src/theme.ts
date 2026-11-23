// Design token: satu sumber nilai gaya. Nilainya berasal dari variables di Figma.
export const tema = {
  warna: {
    utama: '#1565c0',
    latar: '#f5f7fb',
    kartu: '#ffffff',
    teks: '#1b1f27',
    abu: '#5f6b7a',
    garis: '#cfd6e0',
    bahaya: '#c62828',
    ok: '#2e7d32',
  },
  spasi: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  radius: { sm: 8, md: 12, lg: 20 },
  font: { kecil: 13, isi: 15, judul: 18, besar: 24 },
  // Target sentuh minimal yang disarankan pedoman desain: sekitar 48 dp
  tinggiTombol: 48,
} as const;
