import { ApiError, periksaUrlAman } from '../src/services/httpsService';
import { buatApiClient } from '../src/services/apiClient';
import { pesanRamah } from '../src/services/pesanError';
import { validasiJudul } from '../src/models/catatan';

const BASE = 'https://contoh.mockapi.io/api/v1/notes';

// Respons palsu minimal untuk menggantikan fetch.
const respons = (status: number, body?: unknown) => ({ status, json: async () => body }) as unknown as Response;
const fetchPalsu = (fn: (url: string, init: RequestInit) => Promise<Response>) => fn as unknown as typeof fetch;

describe('CRUD ke resource MockAPI', () => {
  it('Read: GET ke alamat resource dan menerima daftar', async () => {
    const fetchFn = jest.fn(async () => respons(200, [{ id: '1', title: 'A', content: '', latitude: null, longitude: null }]));
    const api = buatApiClient(BASE, { fetchFn: fetchPalsu(fetchFn) });
    const daftar = await api.daftar();
    expect(daftar[0].id).toBe('1');
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(BASE);
    expect(init.method).toBe('GET');
  });

  it('Create: POST dengan badan JSON dan mengembalikan id berupa string', async () => {
    const fetchFn = jest.fn(async () => respons(201, { id: '42', title: 'Baru', content: 'x', latitude: null, longitude: null }));
    const api = buatApiClient(BASE, { fetchFn: fetchPalsu(fetchFn) });
    const dibuat = await api.buat({ title: 'Baru', content: 'x', latitude: null, longitude: null });
    expect(dibuat.id).toBe('42');
    const [, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.method).toBe('POST');
    expect(init.body).toBe('{"title":"Baru","content":"x","latitude":null,"longitude":null}');
  });

  it('Update: PUT ke alamat dengan id', async () => {
    const fetchFn = jest.fn(async () => respons(200, { id: '7', title: 'Ubah', content: '', latitude: null, longitude: null }));
    const api = buatApiClient(BASE, { fetchFn: fetchPalsu(fetchFn) });
    await api.ubah('7', { title: 'Ubah', content: '', latitude: null, longitude: null });
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${BASE}/7`);
    expect(init.method).toBe('PUT');
  });

  it('Delete: DELETE ke alamat dengan id', async () => {
    const fetchFn = jest.fn(async () => respons(200, { id: '7' }));
    const api = buatApiClient(BASE, { fetchFn: fetchPalsu(fetchFn) });
    await api.hapus('7');
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${BASE}/7`);
    expect(init.method).toBe('DELETE');
  });

  it('status 204 tidak menyebabkan error pembacaan JSON', async () => {
    const api = buatApiClient(BASE, { fetchFn: fetchPalsu(async () => respons(204)) });
    await expect(api.hapus('7')).resolves.toBeNull();
  });

  it('id yang tidak ada (404) melempar ApiError dan pesannya bisa ditampilkan', async () => {
    const fetchFn = fetchPalsu(async () => respons(404, { error: 'Catatan tidak ditemukan.' }));
    const api = buatApiClient(BASE, { fetchFn });
    const galat = await api.ubah('999', { title: 'x', content: '', latitude: null, longitude: null }).catch((e: unknown) => e);
    expect(galat).toBeInstanceOf(ApiError);
    expect(pesanRamah(galat)).toBe('Catatan tidak ditemukan.');
  });

  it('server tidak terjangkau menghasilkan pesan yang ramah', async () => {
    const fetchFn = fetchPalsu(async () => {
      throw new TypeError('Network request failed');
    });
    const api = buatApiClient(BASE, { fetchFn });
    const galat = await api.daftar().catch((e: unknown) => e);
    expect(pesanRamah(galat)).toContain('tidak dapat dijangkau');
  });

  it('permintaan yang melewati batas waktu diberi pesan', async () => {
    const fetchFn = fetchPalsu(
      (_url, init) =>
        new Promise<Response>((_, tolak) => {
          init.signal?.addEventListener('abort', () => tolak(Object.assign(new Error('aborted'), { name: 'AbortError' })));
        }),
    );
    const api = buatApiClient(BASE, { fetchFn, batasMs: 20 });
    const galat = await api.daftar().catch((e: unknown) => e);
    expect(pesanRamah(galat)).toContain('terlalu lama');
  });

  it('alamat http publik ditolak sebelum permintaan dikirim', async () => {
    const fetchFn = jest.fn(async () => respons(200, []));
    const api = buatApiClient('http://contoh.com/notes', { fetchFn: fetchPalsu(fetchFn) });
    await expect(api.daftar()).rejects.toThrow('Gunakan HTTPS');
    expect(fetchFn).not.toHaveBeenCalled();
    expect(periksaUrlAman(BASE)).toBeNull();
  });

  it('validasi judul menolak judul kosong', () => {
    expect(validasiJudul('  ')).toBe('Judul wajib diisi.');
    expect(validasiJudul('Ke Bromo')).toBeNull();
  });
});
