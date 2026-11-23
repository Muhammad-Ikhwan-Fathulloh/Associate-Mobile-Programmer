import { Note, noteBaru } from '../src/models/note';
import { ApiClient } from '../src/services/apiClient';
import { Penyimpanan, sinkronkan } from '../src/services/sync';

const catatan = (id: number, serverId: number | null = null): Note => ({ ...noteBaru('judul ' + id, 'isi'), id, serverId });

function buatDb(pending: Note[]) {
  const synced: [number, number][] = [];
  const dariServer: number[] = [];
  const db: Penyimpanan = {
    catatanPending: async () => pending,
    tandaiSynced: async (id, sid) => { synced.push([id, sid]); },
    simpanDariServer: async (n) => { dariServer.push(n.serverId); },
  };
  return { db, synced, dariServer };
}

const apiPalsu = (o: Partial<ApiClient>): ApiClient => ({
  login: async () => 't',
  daftarCatatan: async () => [],
  buatCatatan: async () => ({ id: 100, title: '', content: '', latitude: null, longitude: null, updatedAt: 0 }),
  ubahCatatan: async () => ({ id: 7, title: '', content: '', latitude: null, longitude: null, updatedAt: 0 }),
  ...o,
});

describe('sinkronkan (offline-first)', () => {
  it('mengirim catatan baru lewat POST dan menandainya SYNCED', async () => {
    const { db, synced } = buatDb([catatan(1)]);
    const h = await sinkronkan(db, apiPalsu({}), 't');
    expect(synced).toEqual([[1, 100]]);
    expect(h).toEqual({ terkirim: 1, diterima: 0, gagal: 0 });
  });

  it('catatan yang sudah punya serverId dikirim lewat PUT', async () => {
    const ubah = jest.fn(apiPalsu({}).ubahCatatan);
    const buat = jest.fn(apiPalsu({}).buatCatatan);
    const { db, synced } = buatDb([catatan(2, 7)]);
    await sinkronkan(db, apiPalsu({ ubahCatatan: ubah, buatCatatan: buat }), 't');
    expect(ubah).toHaveBeenCalledTimes(1);
    expect(buat).not.toHaveBeenCalled();
    expect(synced).toEqual([[2, 7]]);
  });

  it('kegagalan satu catatan tidak menghentikan yang lain', async () => {
    let n = 0;
    const buat = async () => {
      if (n++ === 0) throw new Error('jaringan putus');
      return { id: 50, title: '', content: '', latitude: null, longitude: null, updatedAt: 0 };
    };
    const { db, synced } = buatDb([catatan(1), catatan(2)]);
    const h = await sinkronkan(db, apiPalsu({ buatCatatan: buat }), 't');
    expect(h.gagal).toBe(1);
    expect(h.terkirim).toBe(1);
    expect(synced).toEqual([[2, 50]]);
  });

  it('menyimpan catatan dari server', async () => {
    const dariServer = [{ id: 9, title: 'dari server', content: 'x', latitude: null, longitude: null, updatedAt: 1 }];
    const { db, dariServer: tersimpan } = buatDb([]);
    const h = await sinkronkan(db, apiPalsu({ daftarCatatan: async () => dariServer }), 't');
    expect(tersimpan).toEqual([9]);
    expect(h.diterima).toBe(1);
  });
});
