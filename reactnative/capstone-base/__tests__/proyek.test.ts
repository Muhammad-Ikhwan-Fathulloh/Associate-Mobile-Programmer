import { buatMenu } from '../src/menu';
import { proyek } from '../src/proyek.config';

describe('konfigurasi proyek', () => {
  it('menu memakai nama entri', () => {
    expect(buatMenu()[0].judul).toBe(proyek.namaEntri);
  });
  it('fitur yang dimatikan tidak muncul di menu', () => {
    const m = buatMenu({ ...proyek, fitur: { ...proyek.fitur, sensor: false } });
    expect(m.find((x) => x.href === '/sensor')).toBeUndefined();
  });
  it('contoh awal diaktifkan agar aplikasi langsung berisi data', () => {
    expect(proyek.contohAwal).toBe(true);
  });
  it('warna utama berupa heksadesimal', () => {
    expect(proyek.warnaUtama).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});

// TODO(peserta): ganti it.todo dengan tes sungguhan untuk fitur Anda.
describe('tes milik peserta', () => {
  it.todo('fungsi pencarian judul');
  it.todo('migrasi kolom kategori mempertahankan data lama');
  it.todo('fitur kreatif: kasus normal dan kasus gagal');
});
