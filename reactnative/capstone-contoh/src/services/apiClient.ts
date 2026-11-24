import { OpsiRequest, requestJson } from './httpsService';

export type EntriServer = {
  id: number;
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  updatedAt: number;
};

export type BadanEntri = { title: string; content: string; latitude: number | null; longitude: number | null };

type OpsiKlien = Pick<OpsiRequest, 'fetchFn' | 'izinkanLokal' | 'batasMs'>;

/** Klien API. Token dikirim sebagai argumen, tidak disimpan di sini. */
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
    async daftarEntri(token: string): Promise<EntriServer[]> {
      return (await requestJson('GET', alamat('/notes'), { ...dasar, token })) as EntriServer[];
    },
    async buatEntri(token: string, badan: BadanEntri): Promise<EntriServer> {
      return (await requestJson('POST', alamat('/notes'), { ...dasar, token, body: badan })) as EntriServer;
    },
    async ubahEntri(token: string, id: number, badan: BadanEntri): Promise<EntriServer> {
      return (await requestJson('PUT', alamat(`/notes/${id}`), { ...dasar, token, body: badan })) as EntriServer;
    },
  };
}

export type ApiClient = ReturnType<typeof buatApiClient>;
