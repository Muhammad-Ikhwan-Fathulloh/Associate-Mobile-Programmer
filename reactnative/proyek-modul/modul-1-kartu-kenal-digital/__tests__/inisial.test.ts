import { inisial } from '../src/profil';

describe('inisial', () => {
  it('mengambil huruf pertama dari dua kata pertama', () => {
    expect(inisial('Ani Lestari')).toBe('AL');
  });
  it('nama satu kata menghasilkan satu huruf', () => {
    expect(inisial('Budi')).toBe('B');
  });
  it('nama kosong menghasilkan teks kosong', () => {
    expect(inisial('')).toBe('');
    expect(inisial('   ')).toBe('');
  });
  it('spasi ganda dan huruf kecil tetap benar', () => {
    expect(inisial('  ani   lestari  ')).toBe('AL');
  });
});
