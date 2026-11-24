import { hitungStreak, tanggalDari } from '../src/logic/streak';
import { validasiNama } from '../src/models/habit';

describe('hitungStreak', () => {
  it('kosong menghasilkan 0', () => {
    expect(hitungStreak([])).toBe(0);
  });
  it('tanggal berurutan dihitung penuh', () => {
    expect(hitungStreak(['2026-03-03', '2026-03-02', '2026-03-01'])).toBe(3);
  });
  it('jeda satu hari memutus streak', () => {
    expect(hitungStreak(['2026-03-05', '2026-03-04', '2026-03-02'])).toBe(2);
  });
  it('tanggal ganda hanya dihitung sekali', () => {
    expect(hitungStreak(['2026-03-02', '2026-03-02', '2026-03-01'])).toBe(2);
  });
  it('urutan masukan tidak memengaruhi hasil', () => {
    expect(hitungStreak(['2026-01-01', '2026-01-03', '2026-01-02'])).toBe(3);
  });
});

describe('tanggalDari', () => {
  it('memakai format YYYY-MM-DD dengan nol di depan', () => {
    expect(tanggalDari(new Date(2026, 0, 5, 12))).toBe('2026-01-05');
  });
});

describe('validasiNama', () => {
  it('menolak nama kosong dan terlalu panjang', () => {
    expect(validasiNama('   ')).not.toBeNull();
    expect(validasiNama('a'.repeat(41))).not.toBeNull();
  });
  it('menerima nama wajar', () => {
    expect(validasiNama('Minum air')).toBeNull();
  });
});
