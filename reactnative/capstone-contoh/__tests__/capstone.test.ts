import { Entri, validasiJudul } from '../src/models/entri';
import { arahKeTujuan, arahRelatif, formatJarak, jarakMeter, mataAngin } from '../src/services/geo';
import { PendeteksiGuncangan, arahHadap } from '../src/services/sensorMath';
import { ApiError, periksaUrlAman, requestJson } from '../src/services/httpsService';
import { buatApiClient, EntriServer } from '../src/services/apiClient';
import { ApiSinkron, PenyimpananEntri, sinkronkan } from '../src/services/sync';
import { pesanRamah } from '../src/services/pesanError';

const respons = (status: number, body?: unknown) => ({ status, json: async () => body }) as unknown as Response;

function penyimpananPalsu(awal: Entri[]) {
  const data = [...awal];
  const db: PenyimpananEntri = {
    entriPending: async () => data.filter((e) => e.status === 'PENDING'),
    tandaiSynced: async (id, serverId) => {
      const e = data.find((x) => x.id === id)!;
      e.status = 'SYNCED';
      e.serverId = serverId;
    },
    simpanDariServer: async (e, serverId) => {
      const ada = data.find((x) => x.serverId === serverId);
      if (ada) {
        Object.assign(ada, e);
        return false;
      }
      data.push({ ...e, id: data.length + 100 });
      return true;
    },
  };
  return { db, data };
}

const entri = (over: Partial<Entri>): Entri => ({
  serverId: null,
  judul: 'Perjalanan',
  catatan: 'Isi',
  kategori: 'Kota',
  latitude: null,
  longitude: null,
  updatedAt: 1,
  status: 'PENDING',
  ...over,
});

function apiPalsu() {
  const api = {
    dibuat: 0,
    diubah: [] as string[],
    dariServer: [] as EntriServer[],
    buat: async (): Promise<EntriServer> => {
      api.dibuat++;
      return { id: '77', title: '', content: '', latitude: null, longitude: null };
    },
    ubah: async (id: string): Promise<EntriServer> => {
      api.diubah.push(id);
      return { id, title: '', content: '', latitude: null, longitude: null };
    },
    daftar: async () => api.dariServer,
  };
  return api as typeof api & ApiSinkron;
}

describe('jarak dan arah (fungsi murni)', () => {
  it('Bandung ke Jakarta sekitar 120 km (toleransi 5 km)', () => {
    const m = jarakMeter(-6.9175, 107.6191, -6.2088, 106.8456);
    expect(m).toBeGreaterThan(115000);
    expect(m).toBeLessThan(125000);
  });
  it('arah ke utara dari khatulistiwa adalah 0 derajat', () => {
    expect(arahKeTujuan(0, 0, 1, 0)).toBeCloseTo(0, 6);
  });
  it('arah ke timur dari khatulistiwa adalah 90 derajat', () => {
    expect(arahKeTujuan(0, 0, 0, 1)).toBeCloseTo(90, 6);
  });
  it('arahRelatif: tujuan tepat di depan menghasilkan 0', () => {
    expect(arahRelatif(90, 90)).toBeCloseTo(0, 9);
  });
  it('arahRelatif: tujuan di kiri negatif, di kanan positif', () => {
    expect(arahRelatif(10, 0)).toBeGreaterThan(0);
    expect(arahRelatif(350, 0)).toBeLessThan(0);
  });
  it('formatJarak dan mataAngin', () => {
    expect(formatJarak(850)).toBe('850 m');
    expect(formatJarak(1500)).toBe('1.5 km');
    expect(mataAngin(0)).toBe('U');
    expect(mataAngin(90)).toBe('T');
  });
});

describe('validasi dan keamanan', () => {
  it('judul kosong ditolak, judul wajar diterima', () => {
    expect(validasiJudul('   ')).not.toBeNull();
    expect(validasiJudul('Ke Bromo')).toBeNull();
  });
  it('http publik ditolak, https diterima', () => {
    expect(periksaUrlAman('http://contoh.com', true)).not.toBeNull();
    expect(periksaUrlAman('https://contoh.mockapi.io/api/v1/notes')).toBeNull();
  });
  it('status 404 melempar ApiError dengan pesan dari server', async () => {
    const fetchFn = (async () => respons(404, { error: 'Catatan tidak ditemukan.' })) as unknown as typeof fetch;
    const galat = await requestJson('GET', 'https://contoh.mockapi.io/api/v1/notes/9', { fetchFn }).catch((e: unknown) => e);
    expect(galat).toBeInstanceOf(ApiError);
    expect(pesanRamah(galat)).toBe('Catatan tidak ditemukan.');
  });
  it('server tidak terjangkau menghasilkan pesan yang ramah', async () => {
    const fetchFn = (async () => {
      throw new TypeError('Network request failed');
    }) as unknown as typeof fetch;
    const api = buatApiClient('https://contoh.mockapi.io/api/v1/notes', { fetchFn });
    const galat = await api.daftar().catch((e: unknown) => e);
    expect(pesanRamah(galat)).toContain('tidak dapat dijangkau');
  });
});

describe('sinkronisasi ke MockAPI', () => {
  it('entri baru memakai POST (buat) lalu berstatus SYNCED dengan id string', async () => {
    const { db, data } = penyimpananPalsu([entri({ id: 1 })]);
    const api = apiPalsu();
    const hasil = await sinkronkan(db, api);
    expect(api.dibuat).toBe(1);
    expect(data[0].status).toBe('SYNCED');
    expect(data[0].serverId).toBe('77');
    expect(hasil.terkirim).toBe(1);
  });
  it('entri yang sudah punya serverId memakai PUT (ubah), bukan POST kedua', async () => {
    const { db } = penyimpananPalsu([entri({ id: 1, serverId: 'abc' })]);
    const api = apiPalsu();
    await sinkronkan(db, api);
    expect(api.diubah).toEqual(['abc']);
    expect(api.dibuat).toBe(0);
  });
  it('entri dari MockAPI masuk sebagai SYNCED', async () => {
    const { db, data } = penyimpananPalsu([]);
    const api = apiPalsu();
    api.dariServer = [{ id: '3', title: 'Dari server', content: '', latitude: null, longitude: null }];
    const hasil = await sinkronkan(db, api);
    expect(hasil.diterima).toBe(1);
    expect(data[0]).toMatchObject({ serverId: '3', status: 'SYNCED' });
  });
});

describe('sensor', () => {
  it('guncangan di atas ambang dihitung sekali dalam jeda', () => {
    const p = new PendeteksiGuncangan(2, 800);
    expect([0, 100, 200, 1000].filter((t) => p.masukkan(3, t))).toHaveLength(2);
  });
  it('pembacaan diam (sekitar 1 g) tidak terhitung', () => {
    expect(new PendeteksiGuncangan().masukkan(1, 0)).toBe(false);
  });
  it('arah hadap selalu di rentang 0 sampai 360', () => {
    const d = arahHadap(10, -3);
    expect(d).toBeGreaterThanOrEqual(0);
    expect(d).toBeLessThan(360);
  });
});
