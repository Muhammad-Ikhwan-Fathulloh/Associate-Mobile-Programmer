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

import { formatKoordinat } from '../src/models/note';

describe('formatKoordinat', () => {
  it('tanpa lokasi menghasilkan null', () => expect(formatKoordinat({ latitude: null, longitude: null })).toBeNull());
  it('lima angka di belakang koma', () => expect(formatKoordinat({ latitude: -6.9175, longitude: 107.6191 })).toBe('-6.91750, 107.61910'));
});
