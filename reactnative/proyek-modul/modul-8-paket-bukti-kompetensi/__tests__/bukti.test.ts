import fs from 'fs';
import path from 'path';
import { BUKTI } from '../src/bukti';

// Jest dijalankan dari folder proyek. Folder modul lain berada satu tingkat di atasnya.
const AKAR = path.resolve(process.cwd(), '..');

describe('peta bukti kompetensi', () => {
  it('memuat tujuh unit kompetensi (satu baris per unit)', () => {
    expect(BUKTI).toHaveLength(7);
  });
  it('kode unit tidak ada yang ganda', () => {
    const kode = BUKTI.map((b) => b.unit);
    expect(new Set(kode).size).toBe(kode.length);
  });
  it('setiap baris menunjuk berkas yang benar-benar ada', () => {
    const hilang = BUKTI.filter((b) => !fs.existsSync(path.join(AKAR, b.berkas))).map((b) => b.berkas);
    expect(hilang).toEqual([]);
  });
});
