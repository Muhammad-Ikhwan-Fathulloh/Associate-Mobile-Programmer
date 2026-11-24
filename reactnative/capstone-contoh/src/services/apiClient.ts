import { OpsiRequest, requestJson } from './httpsService';

/** Bentuk data dari resource "notes" di MockAPI. `id` berupa string. */
export type EntriServer = {
  id: string;
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  createdAt?: string;
};

export type BadanEntri = Pick<EntriServer, 'title' | 'content' | 'latitude' | 'longitude'>;

type OpsiKlien = Pick<OpsiRequest, 'fetchFn' | 'batasMs'>;

/** Klien CRUD untuk resource MockAPI. Hanya HTTPS yang diterima. */
export function buatApiClient(baseUrl: string, opsi: OpsiKlien = {}) {
  const alamat = baseUrl.trim().replace(/\/+$/, '');

  return {
    daftar(): Promise<EntriServer[]> {
      return requestJson('GET', alamat, opsi) as Promise<EntriServer[]>;
    },
    buat(badan: BadanEntri): Promise<EntriServer> {
      return requestJson('POST', alamat, { ...opsi, body: badan }) as Promise<EntriServer>;
    },
    ubah(id: string, badan: BadanEntri): Promise<EntriServer> {
      return requestJson('PUT', `${alamat}/${encodeURIComponent(id)}`, { ...opsi, body: badan }) as Promise<EntriServer>;
    },
    hapus(id: string): Promise<EntriServer | null> {
      return requestJson('DELETE', `${alamat}/${encodeURIComponent(id)}`, opsi) as Promise<EntriServer | null>;
    },
  };
}

export type ApiClient = ReturnType<typeof buatApiClient>;
