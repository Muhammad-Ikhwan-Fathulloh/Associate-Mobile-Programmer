import { OpsiRequest, requestJson } from './httpsService';

/** Bentuk data dari resource "notes" di MockAPI. `id` berupa string. */
export type CatatanServer = {
  id: string;
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  createdAt?: string;
};

export type BadanCatatan = Pick<CatatanServer, 'title' | 'content' | 'latitude' | 'longitude'>;

type OpsiKlien = Pick<OpsiRequest, 'fetchFn' | 'batasMs'>;

/** Klien CRUD untuk resource MockAPI. Hanya HTTPS yang diterima. */
export function buatApiClient(baseUrl: string, opsi: OpsiKlien = {}) {
  const alamat = baseUrl.trim().replace(/\/+$/, '');

  return {
    daftar(): Promise<CatatanServer[]> {
      return requestJson('GET', alamat, opsi) as Promise<CatatanServer[]>;
    },
    buat(badan: BadanCatatan): Promise<CatatanServer> {
      return requestJson('POST', alamat, { ...opsi, body: badan }) as Promise<CatatanServer>;
    },
    ubah(id: string, badan: BadanCatatan): Promise<CatatanServer> {
      return requestJson('PUT', `${alamat}/${encodeURIComponent(id)}`, { ...opsi, body: badan }) as Promise<CatatanServer>;
    },
    hapus(id: string): Promise<CatatanServer | null> {
      return requestJson('DELETE', `${alamat}/${encodeURIComponent(id)}`, opsi) as Promise<CatatanServer | null>;
    },
  };
}

export type ApiClient = ReturnType<typeof buatApiClient>;
