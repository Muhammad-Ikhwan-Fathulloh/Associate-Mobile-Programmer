import { OpsiRequest, requestJson } from './httpsService';

/** Bentuk data dari resource "notes" di MockAPI. `id` berupa string. */
export type Catatan = {
  id: string;
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  createdAt?: string;
};

export type BadanCatatan = Pick<Catatan, 'title' | 'content' | 'latitude' | 'longitude'>;

type OpsiKlien = Pick<OpsiRequest, 'fetchFn' | 'batasMs'>;

/**
 * Klien CRUD untuk satu resource. `baseUrl` menunjuk ke resource, misalnya
 * https://xxxx.mockapi.io/api/v1/notes. Hanya HTTPS yang diterima.
 */
export function buatApiClient(baseUrl: string, opsi: OpsiKlien = {}) {
  const alamat = baseUrl.trim().replace(/\/+$/, '');

  return {
    /** Read: daftar semua catatan. */
    daftar(): Promise<Catatan[]> {
      return requestJson('GET', alamat, opsi) as Promise<Catatan[]>;
    },
    /** Create: buat catatan baru. */
    buat(badan: BadanCatatan): Promise<Catatan> {
      return requestJson('POST', alamat, { ...opsi, body: badan }) as Promise<Catatan>;
    },
    /** Update: ubah catatan yang sudah ada. */
    ubah(id: string, badan: BadanCatatan): Promise<Catatan> {
      return requestJson('PUT', `${alamat}/${encodeURIComponent(id)}`, { ...opsi, body: badan }) as Promise<Catatan>;
    },
    /** Delete: hapus catatan. */
    hapus(id: string): Promise<Catatan | null> {
      return requestJson('DELETE', `${alamat}/${encodeURIComponent(id)}`, opsi) as Promise<Catatan | null>;
    },
  };
}

export type ApiClient = ReturnType<typeof buatApiClient>;
