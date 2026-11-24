import { buatApiClient } from '../src/services/apiClient';
import { ApiError, periksaUrlAman, requestJson } from '../src/services/httpsService';
import { pesanRamah } from '../src/services/pesanError';

// Respons palsu minimal untuk menggantikan fetch.
const respons = (status: number, body?: unknown) =>
  ({ status, json: async () => body }) as unknown as Response;
const fetchPalsu = (fn: (url: string, init: RequestInit) => Promise<Response>) =>
  fn as unknown as typeof fetch;

describe('periksaUrlAman', () => {
  it('http ke alamat publik ditolak', () => {
    expect(periksaUrlAman('http://contoh.com', true)).toBe('Gunakan HTTPS (https://).');
  });
  it('http ke alamat lokal diterima hanya bila diizinkan', () => {
    expect(periksaUrlAman('http://10.0.2.2:3000', false)).not.toBeNull();
    expect(periksaUrlAman('http://10.0.2.2:3000', true)).toBeNull();
  });
});

describe('klien API catatan', () => {
  it('login mengirim email dan kata sandi lalu mengembalikan token', async () => {
    const fetchFn = jest.fn(async () => respons(200, { token: 'tok' }));
    const api = buatApiClient('http://10.0.2.2:3000/', { fetchFn: fetchPalsu(fetchFn) });
    await expect(api.login('a@b.id', 'rahasia')).resolves.toBe('tok');
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('http://10.0.2.2:3000/login');
    expect(init.body).toBe('{"email":"a@b.id","password":"rahasia"}');
  });

  it('login salah (401) menampilkan pesan dari server', async () => {
    const fetchFn = fetchPalsu(async () => respons(401, { error: 'Email atau kata sandi salah.' }));
    const api = buatApiClient('http://10.0.2.2:3000', { fetchFn });
    await expect(api.login('a', 'salah')).rejects.toMatchObject({ status: 401 });
    try {
      await api.login('a', 'salah');
    } catch (e) {
      expect(pesanRamah(e)).toBe('Email atau kata sandi salah.');
    }
  });

  it('judul kosong ditolak server (400) dan pesannya tampil', async () => {
    const fetchFn = fetchPalsu(async () => respons(400, { error: 'Judul wajib diisi.' }));
    const api = buatApiClient('http://10.0.2.2:3000', { fetchFn });
    await expect(api.buatCatatan('tok', { title: '', content: '' })).rejects.toBeInstanceOf(ApiError);
    await api.buatCatatan('tok', { title: '', content: '' }).catch((e) => expect(pesanRamah(e)).toBe('Judul wajib diisi.'));
  });

  it('status 204 tidak menyebabkan error pembacaan JSON', async () => {
    const fetchFn = fetchPalsu(async () => respons(204));
    await expect(requestJson('DELETE', 'http://10.0.2.2:3000/notes/1', { fetchFn, izinkanLokal: true })).resolves.toBeNull();
  });

  it('server mati menghasilkan pesan yang ramah, bukan galat teknis', async () => {
    const fetchFn = fetchPalsu(async () => {
      throw new TypeError('Network request failed');
    });
    const api = buatApiClient('http://10.0.2.2:3000', { fetchFn });
    await expect(api.daftarCatatan('tok')).rejects.toThrow(TypeError);
    await api.daftarCatatan('tok').catch((e) => expect(pesanRamah(e)).toContain('tidak dapat dijangkau'));
  });

  it('permintaan yang melewati batas waktu dibatalkan dan diberi pesan', async () => {
    const fetchFn = fetchPalsu(
      (_url, init) =>
        new Promise<Response>((_, tolak) => {
          init.signal?.addEventListener('abort', () => {
            tolak(Object.assign(new Error('aborted'), { name: 'AbortError' }));
          });
        }),
    );
    const api = buatApiClient('http://10.0.2.2:3000', { fetchFn, batasMs: 20 });
    await api.daftarCatatan('tok').catch((e) => expect(pesanRamah(e)).toContain('terlalu lama'));
  });

  it('alamat publik http ditolak sebelum permintaan dikirim', async () => {
    const fetchFn = jest.fn(async () => respons(200, {}));
    const api = buatApiClient('http://contoh.com', { fetchFn: fetchPalsu(fetchFn), izinkanLokal: false });
    await expect(api.login('a', 'b')).rejects.toThrow('Gunakan HTTPS');
    expect(fetchFn).not.toHaveBeenCalled();
  });
});
