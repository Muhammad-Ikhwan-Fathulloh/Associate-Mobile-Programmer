import fs from 'fs';
import path from 'path';
import { temaGelap, temaTerang } from '../src/theme';
import { rasioKontras } from '../src/kontras';

// Mengumpulkan berkas .ts dan .tsx di folder (rekursif).
function berkasKode(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return berkasKode(p);
    return /\.(ts|tsx)$/.test(e.name) ? [p] : [];
  });
}

describe('tema terang', () => {
  it('teks utama di atas kartu mudah dibaca (minimal 4,5)', () => {
    expect(rasioKontras(temaTerang.warna.teks, temaTerang.warna.kartu)).toBeGreaterThanOrEqual(4.5);
  });
  it('tombol berisi teks putih di atas warna utama (minimal 4,5)', () => {
    expect(rasioKontras(temaTerang.warna.tombolTeks, temaTerang.warna.utama)).toBeGreaterThanOrEqual(4.5);
  });
  it('tinggi tombol minimal 48 dp', () => {
    expect(temaTerang.tinggiTombol).toBeGreaterThanOrEqual(48);
  });
});

describe('tema gelap (token kedua)', () => {
  it('struktur token sama dengan tema terang', () => {
    expect(Object.keys(temaGelap.warna).sort()).toEqual(Object.keys(temaTerang.warna).sort());
  });
  it('teks utama di atas kartu mudah dibaca (minimal 4,5)', () => {
    expect(rasioKontras(temaGelap.warna.teks, temaGelap.warna.kartu)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('aturan token', () => {
  it('tidak ada kode warna heksadesimal di luar src/theme.ts', () => {
    const root = process.cwd();
    const bermasalah = [...berkasKode(path.join(root, 'app')), ...berkasKode(path.join(root, 'src'))]
      .filter((f) => !f.endsWith(path.join('src', 'theme.ts')))
      .filter((f) => /#[0-9a-fA-F]{6}\b/.test(fs.readFileSync(f, 'utf8')));
    expect(bermasalah).toEqual([]);
  });
});
