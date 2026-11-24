// Data profil disimpan dalam satu objek bertipe, terpisah dari tampilan.
export type Profil = { nama: string; peran: string; keahlian: string[] };

export const profilSaya: Profil = {
  nama: 'Ani Lestari',
  peran: 'Peserta Associate Mobile Programmer',
  keahlian: ['React Native', 'Expo Router', 'TypeScript'],
};

/** Mengubah "Ani Lestari" menjadi "AL". Nama kosong menghasilkan teks kosong. */
export function inisial(nama: string): string {
  return nama
    .trim()
    .split(/\s+/)
    .filter((kata) => kata.length > 0)
    .slice(0, 2)
    .map((kata) => kata[0].toUpperCase())
    .join('');
}
