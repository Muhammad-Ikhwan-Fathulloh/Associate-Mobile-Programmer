import { Entri, validasiJudul } from '../src/models/entri';
import { arahKeTujuan, arahRelatif, formatJarak, jarakMeter, mataAngin } from '../src/services/geo';
import { PendeteksiGuncangan, arahHadap } from '../src/services/sensorMath';
import { ApiError, periksaUrlAman, requestJson } from '../src/services/httpsService';
import { buatApiClient, EntriServer } from '../src/services/apiClient';
import { PenyimpananEntri, ApiSinkron, sinkronkan } from '../src/services/sync';
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

const apiPalsu = (): ApiSinkron & { posted: number; puts: number[]; dariServer: EntriServer[] } => {
  const api = {
    posted: 0,
    puts: [] as number[],
    dariServer: [] as EntriServer[],
    buatEntri: async () => {
      api.posted++;
      return { id: 77, title: '', content: '', latitude: null, longitude: null, updatedAt: 1 };
    },
    ubahEntri: async (_t: string, id: number) => {
      api.puts.push(id);
      return { id, title: '', content: '', latitude: null, longitude: null, updatedAt: 1 };
    },
    daftarEntri: async () => api.dariServer,
  };
  return api;
};

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
  it('http publik ditolak, http lokal dan https diterima', () => {
    expect(periksaUrlAman('http://contoh.com', true)).not.toBeNull();
    expect(periksaUrlAman('http://10.0.2.2:3000', true)).toBeNull();
    expect(periksaUrlAman('https://contoh.com')).toBeNull();
  });
  it('status 401 melempar ApiError dengan pesan dari server', async () => {
    const fetchFn = (async () => respons(401, { error: 'Email atau kata sandi salah.' })) as unknown as typeof fetch;
    await expect(requestJson('POST', 'http://10.0.2.2:3000/login', { fetchFn, izinkanLokal: true })).rejects.toBeInstanceOf(ApiError);
  });
  it('server mati menghasilkan pesan yang ramah', async () => {
    const fetchFn = (async () => {
      throw new TypeError('Network request failed');
    }) as unknown as typeof fetch;
    const api = buatApiClient('http://10.0.2.2:3000', { fetchFn });
    const galat = await api.daftarEntri('tok').catch((e: unknown) => e);
    expect(pesanRamah(galat)).toContain('tidak dapat dijangkau');
  });
});

describe('sinkronisasi', () => {
  it('entri baru memakai POST lalu berstatus SYNCED', async () => {
    const { db, data } = penyimpananPalsu([entri({ id: 1 })]);
    const api = apiPalsu();
    const hasil = await sinkronkan(db, api, 'tok');
    expect(api.posted).toBe(1);
    expect(data[0].status).toBe('SYNCED');
    expect(hasil.terkirim).toBe(1);
  });
  it('entri yang sudah punya serverId memakai PUT, bukan POST kedua', async () => {
    const { db } = penyimpananPalsu([entri({ id: 1, serverId: 5 })]);
    const api = apiPalsu();
    await sinkronkan(db, api, 'tok');
    expect(api.puts).toEqual([5]);
    expect(api.posted).toBe(0);
  });
  it('entri dari server masuk sebagai SYNCED dan dihitung diterima', async () => {
    const { db, data } = penyimpananPalsu([]);
    const api = apiPalsu();
    api.dariServer = [{ id: 3, title: 'Dari server', content: '', latitude: null, longitude: null, updatedAt: 5 }];
    const hasil = await sinkronkan(db, api, 'tok');
    expect(hasil.diterima).toBe(1);
    expect(data[0]).toMatchObject({ serverId: 3, status: 'SYNCED' });
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
