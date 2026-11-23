import { buatApiClient } from '../src/services/apiClient';
import { ApiError, periksaUrlAman, requestJson } from '../src/services/httpsService';

const res = (status: number, body?: unknown) =>
  ({ status, json: async () => body }) as unknown as Response;

describe('periksaUrlAman dengan izinkanLokal', () => {
  it('http ke alamat publik tetap ditolak', () => {
    expect(periksaUrlAman('http://contoh.com', true)).toBe('Gunakan HTTPS (https://).');
  });
  it('http ke jaringan lokal diizinkan hanya bila diminta', () => {
    expect(periksaUrlAman('http://10.0.2.2:3000', false)).not.toBeNull();
    expect(periksaUrlAman('http://10.0.2.2:3000', true)).toBeNull();
    expect(periksaUrlAman('http://192.168.1.5:3000', true)).toBeNull();
    expect(periksaUrlAman('http://localhost:3000', true)).toBeNull();
  });
});

describe('requestJson', () => {
  it('mengirim metode, token, dan badan JSON', async () => {
    const fetchFn = jest.fn(async () => res(201, { id: 1 }));
    await requestJson('POST', 'https://a.com/notes', { fetchFn: fetchFn as unknown as typeof fetch, token: 'abc', body: { title: 'x' } });
    const [, opsi] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(opsi.method).toBe('POST');
    expect((opsi.headers as Record<string, string>).Authorization).toBe('Bearer abc');
    expect(opsi.body).toBe('{"title":"x"}');
  });
  it('status 204 menghasilkan null', async () => {
    const fetchFn = (async () => res(204)) as unknown as typeof fetch;
    await expect(requestJson('DELETE', 'https://a.com/notes/1', { fetchFn })).resolves.toBeNull();
  });
  it('status 401 melempar ApiError dengan pesan dari server', async () => {
    const fetchFn = (async () => res(401, { error: 'Token tidak valid' })) as unknown as typeof fetch;
    await expect(requestJson('GET', 'https://a.com/notes', { fetchFn })).rejects.toMatchObject({ status: 401, message: 'Token tidak valid' });
    await expect(requestJson('GET', 'https://a.com/notes', { fetchFn })).rejects.toBeInstanceOf(ApiError);
  });
});

describe('buatApiClient', () => {
  it('login mengembalikan token dan memakai alamat dasar tanpa garis miring ganda', async () => {
    const fetchFn = jest.fn(async () => res(200, { token: 'tok' }));
    const api = buatApiClient('http://10.0.2.2:3000/', { fetchFn: fetchFn as unknown as typeof fetch });
    await expect(api.login('a', 'b')).resolves.toBe('tok');
    expect((fetchFn.mock.calls[0] as unknown as [string])[0]).toBe('http://10.0.2.2:3000/login');
  });
});
