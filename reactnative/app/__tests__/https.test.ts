import { ambilJson, periksaUrlAman } from '../src/services/httpsService';

const fakeFetch = (status: number, body: unknown) =>
  (async () => ({ status, json: async () => body })) as unknown as typeof fetch;

describe('periksaUrlAman', () => {
  it('menolak http', () => expect(periksaUrlAman('http://a.com')).toBe('Gunakan HTTPS (https://).'));
  it('menolak teks bukan URL', () => expect(periksaUrlAman('bukan url')).toBe('URL tidak valid.'));
  it('menerima https', () => expect(periksaUrlAman('https://a.com/x')).toBeNull());
});

describe('ambilJson', () => {
  it('mengembalikan JSON saat status 200', async () => {
    await expect(ambilJson('https://a.com', fakeFetch(200, { ok: 1 }))).resolves.toEqual({ ok: 1 });
  });
  it('melempar error saat status bukan 200', async () => {
    await expect(ambilJson('https://a.com', fakeFetch(500, {}))).rejects.toThrow('status 500');
  });
  it('menolak URL http tanpa memanggil jaringan', async () => {
    const spy = jest.fn();
    await expect(ambilJson('http://a.com', spy as unknown as typeof fetch)).rejects.toThrow('HTTPS');
    expect(spy).not.toHaveBeenCalled();
  });
  it('membatalkan permintaan saat timeout', async () => {
    const lambat = ((_: string, opt: RequestInit) =>
      new Promise((_res, rej) => opt.signal!.addEventListener('abort', () => rej(new Error('aborted'))))) as unknown as typeof fetch;
    await expect(ambilJson('https://a.com', lambat, 20)).rejects.toThrow('aborted');
  });
});
