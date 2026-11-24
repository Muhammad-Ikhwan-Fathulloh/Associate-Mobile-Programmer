import { Catatan } from '../src/models/catatan';
import { CatatanServer, buatApiClient } from '../src/services/apiClient';
import { ApiSinkron, PenyimpananCatatan, sinkronkan } from '../src/services/sync';
import { ApiError } from '../src/services/httpsService';

/** Penyimpanan tiruan berbasis array, meniru repository SQLite. */
function penyimpananPalsu(awal: Catatan[]) {
  const data = [...awal];
  const db: PenyimpananCatatan = {
    catatanPending: async () => data.filter((c) => c.syncStatus === 'PENDING'),
    tandaiSynced: async (id, serverId) => {
      const c = data.find((x) => x.id === id)!;
      c.syncStatus = 'SYNCED';
      c.serverId = serverId;
    },
    simpanDariServer: async (c, serverId) => {
      const ada = data.find((x) => x.serverId === serverId);
      if (ada) {
        Object.assign(ada, c);
        return false;
      }
      data.push({ ...c, id: data.length + 100, serverId });
      return true;
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

const server = (id: string): CatatanServer => ({ id, title: 'x', content: '', latitude: null, longitude: null });

function apiPalsu(): ApiSinkron & { buat: jest.Mock; ubah: jest.Mock; daftar: jest.Mock } {
  return {
    buat: jest.fn(async () => server('77')),
    ubah: jest.fn(async (id: string) => server(id)),
    daftar: jest.fn(async () => []),
  } as unknown as ApiSinkron & { buat: jest.Mock; ubah: jest.Mock; daftar: jest.Mock };
}

describe('sinkronkan (CRUD ke MockAPI)', () => {
  it('catatan baru dikirim dengan POST (buat) lalu berstatus SYNCED dengan id string', async () => {
    const { db, data } = penyimpananPalsu([catatan({ id: 1 })]);
    const api = apiPalsu();
    const hasil = await sinkronkan(db, api);
    expect(api.buat).toHaveBeenCalledTimes(1);
    expect(data[0]).toMatchObject({ syncStatus: 'SYNCED', serverId: '77' });
    expect(hasil.terkirim).toBe(1);
  });

  it('catatan yang sudah punya serverId dikirim dengan PUT (ubah), bukan POST kedua', async () => {
    const { db } = penyimpananPalsu([catatan({ id: 1, serverId: 'abc' })]);
    const api = apiPalsu();
    await sinkronkan(db, api);
    expect(api.ubah).toHaveBeenCalledWith('abc', expect.objectContaining({ title: 'Judul' }));
    expect(api.buat).not.toHaveBeenCalled();
  });

  it('kegagalan satu catatan tidak menghentikan yang lain', async () => {
    const { db } = penyimpananPalsu([catatan({ id: 1, title: 'A' }), catatan({ id: 2, title: 'B' })]);
    const api = apiPalsu();
    api.buat.mockRejectedValueOnce(new Error('jaringan putus'));
    const hasil = await sinkronkan(db, api);
    expect(hasil).toEqual({ terkirim: 1, diterima: 0, gagal: 1 });
  });

  it('catatan dari MockAPI masuk sebagai SYNCED', async () => {
    const { db, data } = penyimpananPalsu([]);
    const api = apiPalsu();
    api.daftar.mockResolvedValueOnce([{ id: '3', title: 'Dari server', content: '', latitude: null, longitude: null }]);
    const hasil = await sinkronkan(db, api);
    expect(hasil.diterima).toBe(1);
    expect(data[0]).toMatchObject({ serverId: '3', syncStatus: 'SYNCED' });
  });
});

describe('klien MockAPI', () => {
  it('menolak alamat HTTP publik sebelum permintaan dikirim', async () => {
    const fetchFn = jest.fn();
    const api = buatApiClient('http://contoh.com/notes', { fetchFn: fetchFn as unknown as typeof fetch });
    await expect(api.daftar()).rejects.toThrow('Gunakan HTTPS');
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('galat dari server berupa ApiError', async () => {
    const fetchFn = (async () => ({ status: 404, json: async () => ({ error: 'Tidak ditemukan' }) })) as unknown as typeof fetch;
    const api = buatApiClient('https://contoh.mockapi.io/api/v1/notes', { fetchFn });
    await expect(api.ubah('9', { title: 'x', content: '', latitude: null, longitude: null })).rejects.toBeInstanceOf(ApiError);
  });
});
