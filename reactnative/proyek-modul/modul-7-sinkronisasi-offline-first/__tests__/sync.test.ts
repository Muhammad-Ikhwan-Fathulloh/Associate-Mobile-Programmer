import { Catatan } from '../src/models/catatan';
import { ApiSinkron, Penyimpanan, sinkronkan } from '../src/services/sync';
import { periksaUrlAman } from '../src/services/httpsService';
import { buatApiClient } from '../src/services/apiClient';

// Penyimpanan tiruan berbasis array, meniru repository SQLite.
function penyimpananPalsu(awal: Catatan[]) {
  const data = [...awal];
  const db: Penyimpanan = {
    catatanPending: async () => data.filter((c) => c.syncStatus === 'PENDING'),
    tandaiSynced: async (id, serverId) => {
      const c = data.find((x) => x.id === id)!;
      c.syncStatus = 'SYNCED';
      c.serverId = serverId;
    },
    simpanDariServer: async (c) => {
      const ada = data.find((x) => x.serverId === c.serverId);
      if (ada) Object.assign(ada, c);
      else data.push({ ...c, id: data.length + 100 });
    },
  };
  return { db, data };
}

const catatan = (over: Partial<Catatan>): Catatan => ({
  serverId: null,
  title: 'Judul',
  content: 'Isi',
  latitude: null,
  longitude: null,
  updatedAt: 1,
  syncStatus: 'PENDING',
  ...over,
});

const apiPalsu = (over: Partial<ApiSinkron> = {}): ApiSinkron & { [k: string]: jest.Mock } => ({
  buatCatatan: jest.fn(async () => ({ id: 77, title: 'x', content: '', latitude: null, longitude: null, updatedAt: 1 })),
  ubahCatatan: jest.fn(async (_t, id) => ({ id, title: 'x', content: '', latitude: null, longitude: null, updatedAt: 2 })),
  daftarCatatan: jest.fn(async () => []),
  ...over,
}) as ApiSinkron & { [k: string]: jest.Mock };

describe('sinkronkan', () => {
  it('catatan baru tanpa serverId dikirim dengan POST lalu berstatus SYNCED', async () => {
    const { db, data } = penyimpananPalsu([catatan({ id: 1 })]);
    const api = apiPalsu();
    const hasil = await sinkronkan(db, api, 'tok');
    expect(api.buatCatatan).toHaveBeenCalledTimes(1);
    expect(data[0]).toMatchObject({ syncStatus: 'SYNCED', serverId: 77 });
    expect(hasil.terkirim).toBe(1);
  });

  it('catatan yang sudah punya serverId dikirim dengan PUT, bukan POST kedua', async () => {
    const { db } = penyimpananPalsu([catatan({ id: 1, serverId: 5 })]);
    const api = apiPalsu();
    await sinkronkan(db, api, 'tok');
    expect(api.ubahCatatan).toHaveBeenCalledWith('tok', 5, expect.objectContaining({ title: 'Judul' }));
    expect(api.buatCatatan).not.toHaveBeenCalled();
  });

  it('kegagalan satu catatan tidak menghentikan yang lain', async () => {
    const { db } = penyimpananPalsu([catatan({ id: 1, title: 'A' }), catatan({ id: 2, title: 'B' })]);
    const api = apiPalsu({
      buatCatatan: jest
        .fn()
        .mockRejectedValueOnce(new Error('jaringan putus'))
        .mockResolvedValueOnce({ id: 9, title: 'B', content: '', latitude: null, longitude: null, updatedAt: 1 }),
    }) as ApiSinkron & { [k: string]: jest.Mock };
    const hasil = await sinkronkan(db, api, 'tok');
    expect(hasil).toEqual({ terkirim: 1, diterima: 0, gagal: 1 });
  });

  it('catatan dari server disimpan sebagai SYNCED dan dihitung diterima', async () => {
    const { db, data } = penyimpananPalsu([]);
    const api = apiPalsu({
      daftarCatatan: jest.fn(async () => [{ id: 3, title: 'Dari server', content: '', latitude: null, longitude: null, updatedAt: 5 }]),
    });
    const hasil = await sinkronkan(db, api, 'tok');
    expect(hasil.diterima).toBe(1);
    expect(data[0]).toMatchObject({ serverId: 3, syncStatus: 'SYNCED' });
  });
});

describe('keamanan koneksi', () => {
  it('http ke alamat publik ditolak, http ke 10.0.2.2 diterima hanya untuk pengembangan', () => {
    expect(periksaUrlAman('http://contoh.com', false)).not.toBeNull();
    expect(periksaUrlAman('http://10.0.2.2:3000', true)).toBeNull();
    expect(periksaUrlAman('http://10.0.2.2:3000', false)).not.toBeNull();
  });
  it('klien tanpa izin lokal menolak http sebelum permintaan dikirim', async () => {
    const fetchFn = jest.fn();
    const api = buatApiClient('http://contoh.com', { fetchFn: fetchFn as unknown as typeof fetch, izinkanLokal: false });
    await expect(api.login('a', 'b')).rejects.toThrow('Gunakan HTTPS');
    expect(fetchFn).not.toHaveBeenCalled();
  });
});
