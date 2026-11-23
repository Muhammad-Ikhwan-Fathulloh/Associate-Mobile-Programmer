import { noteBaru, validasiJudul } from '../src/models/note';

describe('catatan', () => {
  it('judul kosong atau spasi ditolak', () => {
    expect(validasiJudul('')).toBe('Judul wajib diisi.');
    expect(validasiJudul('   ')).toBe('Judul wajib diisi.');
  });
  it('judul lebih dari 100 karakter ditolak', () => {
    expect(validasiJudul('a'.repeat(101))).toBe('Judul maksimal 100 karakter.');
  });
  it('judul normal diterima', () => expect(validasiJudul('Belanja')).toBeNull());
  it('catatan baru berstatus PENDING', () => {
    const n = noteBaru('a', 'b');
    expect(n.syncStatus).toBe('PENDING');
    expect(n.id).toBeUndefined();
  });
});
