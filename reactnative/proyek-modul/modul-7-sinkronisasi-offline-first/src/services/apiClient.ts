import { OpsiRequest, requestJson } from './httpsService';

export type CatatanServer = {
  id: number;
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  updatedAt: number;
};

export type CatatanBaru = {
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
};

type OpsiKlien = Pick<OpsiRequest, 'fetchFn' | 'izinkanLokal' | 'batasMs'>;

/** Klien API catatan. Token dikirim sebagai argumen, tidak disimpan di sini. */
export function buatApiClient(baseUrl: string, opsi: OpsiKlien = {}) {
  const alamat = (path: string) => baseUrl.replace(/\/+$/, '') + path;
  const dasar = { izinkanLokal: true, ...opsi };

  return {
    async login(email: string, password: string): Promise<string> {
      const r = (await requestJson('POST', alamat('/login'), { ...dasar, body: { email, password } })) as {
        token: string;
      };
      return r.token;
    },
    async daftarCatatan(token: string): Promise<CatatanServer[]> {
      return (await requestJson('GET', alamat('/notes'), { ...dasar, token })) as CatatanServer[];
    },
    async buatCatatan(token: string, c: CatatanBaru): Promise<CatatanServer> {
      return (await requestJson('POST', alamat('/notes'), { ...dasar, token, body: c })) as CatatanServer;
    },
    async ubahCatatan(token: string, serverId: number, c: CatatanBaru): Promise<CatatanServer> {
      return (await requestJson('PUT', alamat(`/notes/${serverId}`), { ...dasar, token, body: c })) as CatatanServer;
    },
  };
}

export type ApiClient = ReturnType<typeof buatApiClient>;
