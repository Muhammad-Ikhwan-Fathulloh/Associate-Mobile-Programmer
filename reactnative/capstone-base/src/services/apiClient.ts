import { Note } from '../models/note';
import { requestJson, OpsiRequest } from './httpsService';

export type NoteServer = {
  id: number;
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  updatedAt: number;
};

/** Klien API catatan. `opsi` dipakai pengujian untuk fetch palsu. */
export function buatApiClient(baseUrl: string, opsi: Pick<OpsiRequest, 'fetchFn' | 'izinkanLokal' | 'batasMs'> = {}) {
  const url = (path: string) => baseUrl.replace(/\/+$/, '') + path;
  const dasar = { izinkanLokal: true, ...opsi };

  return {
    async login(email: string, password: string): Promise<string> {
      const r = (await requestJson('POST', url('/login'), { ...dasar, body: { email, password } })) as { token: string };
      return r.token;
    },
    async daftarCatatan(token: string): Promise<NoteServer[]> {
      return (await requestJson('GET', url('/notes'), { ...dasar, token })) as NoteServer[];
    },
    async buatCatatan(token: string, n: Note): Promise<NoteServer> {
      const body = { title: n.title, content: n.content, latitude: n.latitude, longitude: n.longitude };
      return (await requestJson('POST', url('/notes'), { ...dasar, token, body })) as NoteServer;
    },
    async ubahCatatan(token: string, serverId: number, n: Note): Promise<NoteServer> {
      const body = { title: n.title, content: n.content, latitude: n.latitude, longitude: n.longitude };
      return (await requestJson('PUT', url(`/notes/${serverId}`), { ...dasar, token, body })) as NoteServer;
    },
  };
}

export type ApiClient = ReturnType<typeof buatApiClient>;
