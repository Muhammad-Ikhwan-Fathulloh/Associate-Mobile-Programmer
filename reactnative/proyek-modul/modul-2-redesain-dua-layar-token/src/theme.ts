// Satu-satunya berkas yang boleh berisi kode warna heksadesimal.
// Nama token sama dengan variable di Figma. Komponen hanya memakai `tema.*`.

export type Tema = {
  warna: {
    utama: string;
    latar: string;
    kartu: string;
    teks: string;
    abu: string;
    garis: string;
    tombolTeks: string;
  };
  spasi: { xs: number; sm: number; md: number; lg: number; xl: number };
  radius: { sm: number; md: number; lg: number };
  font: { kecil: number; isi: number; judul: number; besar: number };
  tinggiTombol: number;
};

const dasar = {
  spasi: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  radius: { sm: 8, md: 12, lg: 20 },
  font: { kecil: 13, isi: 15, judul: 18, besar: 24 },
  // Target sentuh minimal 48 dp
  tinggiTombol: 48,
};

export const temaTerang: Tema = {
  ...dasar,
  warna: {
    utama: '#1565c0',
    latar: '#f5f7fb',
    kartu: '#ffffff',
    teks: '#1b1f27',
    abu: '#5f6b7a',
    garis: '#cfd6e0',
    tombolTeks: '#ffffff',
  },
};

// Token kedua untuk tantangan tema gelap. Strukturnya sama dengan tema terang.
export const temaGelap: Tema = {
  ...dasar,
  warna: {
    utama: '#90caf9',
    latar: '#121417',
    kartu: '#1d2127',
    teks: '#f1f3f6',
    abu: '#a9b2bf',
    garis: '#2e3742',
    tombolTeks: '#0b1220',
  },
};

export const tema = temaTerang;
