# Modul 5: API dan Menghubungkan Aplikasi Mobile

**Durasi:** 09.00 to 10.00

**Unit kompetensi BNSP:** J.612000.025.01

## Pengantar

Hari kedua dimulai dengan satu jam untuk memahami API. Aplikasi kita berbicara dengan server memakai permintaan dan jawaban. Peserta menjalankan server latihan di komputer, mencoba rute-rutenya, lalu memanggilnya dari aplikasi dengan fetch. Pertanyaan kuncinya: apa yang dilakukan aplikasi bila server mati atau menjawab error?

## Tujuan Pembelajaran

1. Menjelaskan REST, metode HTTP, kode status, dan JSON.
2. Menjalankan server latihan.
3. Memanggil API dari aplikasi dengan `fetch`.
4. Menangani gagal: status error, timeout, dan jaringan mati.

## 1. Apa itu API

- **API** adalah pintu bagi program lain untuk meminta atau mengubah data.
- **REST** memakai alamat (URL) untuk sumber daya dan **metode HTTP** untuk aksinya, data umumnya **JSON**.
- Aplikasi adalah **klien**, server menjawab. Satu permintaan, satu jawaban.

> **Narasi pengajar:** Pakai analogi pelayan restoran: aplikasi adalah tamu, API adalah pelayan, dapur adalah server dan basis data. Tamu tidak masuk ke dapur. Dari sini mudah menjelaskan mengapa ponsel tidak langsung ke basis data.

## 2. Metode dan kode status

| Metode | Aksi | Status berhasil |
|---|---|---|
| GET /notes | Baca daftar | 200 |
| POST /notes | Buat baru | 201 |
| PUT /notes/:id | Ubah | 200 |
| DELETE /notes/:id | Hapus | 204 (tanpa isi) |
| Kesalahan klien | Data salah, belum login, tidak ada | 400, 401, 404 |

> **Narasi pengajar:** Buka simulasi pembuat permintaan REST. Pilih tiap permintaan, lalu ubah kondisi menjadi tanpa token, judul kosong, tidak ada, dan server mati. Minta peserta menebak kode status dan tindakan aplikasi sebelum Anda menekan tombol.

## 3. Server latihan

- Ada di `shared/server`: Express, penyimpanan di memori, `npm start` pada port 3000.
- Login contoh: `peserta@contoh.id` dengan kata sandi `rahasia123`. Server mengembalikan **token**.
- Emulator Android mengakses komputer lewat `10.0.2.2`. Ponsel fisik memakai alamat IP komputer di Wi-Fi yang sama.
- Tersedia 4 pengujian otomatis: `npm test`.

> **Narasi pengajar:** Pandu peserta menjalankan server dan membuka alamat health di peramban. Bila ada yang gagal, periksa dulu apakah port 3000 dipakai dan apakah emulator memakai 10.0.2.2. Ponsel fisik wajib satu Wi-Fi dengan komputer.

## 4. Memanggil API dengan fetch

`requestJson` membatasi waktu, memeriksa status, dan melempar `ApiError` bermuatan pesan server. Berkas `src/services/httpsService.ts`:

```ts
const HOST_LOKAL = /^(localhost|127\.0\.0\.1|10\.0\.2\.2|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/;

/**
 * Mengembalikan pesan error jika URL tidak aman, atau null jika URL aman.
 * `izinkanLokal` membolehkan http hanya ke alamat jaringan lokal, untuk server uji saat pengembangan.
 */
export function periksaUrlAman(url: string, izinkanLokal = false): string | null {
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return 'URL tidak valid.';
  }
  if (u.protocol === 'https:') return null;
  if (u.protocol === 'http:' && izinkanLokal && HOST_LOKAL.test(u.hostname)) return null;
  return 'Gunakan HTTPS (https://).';
}

type FetchFn = typeof fetch;

export type OpsiRequest = {
  body?: unknown;
  token?: string | null;
  fetchFn?: FetchFn;
  batasMs?: number;
  izinkanLokal?: boolean;
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Permintaan JSON dengan pemeriksaan URL, timeout, token, dan penanganan status. */
export async function requestJson(metode: string, url: string, opsi: OpsiRequest = {}): Promise<unknown> {
  const { body, token, fetchFn = fetch, batasMs = 10000, izinkanLokal = false } = opsi;
  const pesan = periksaUrlAman(url, izinkanLokal);
  if (pesan) throw new Error(pesan);

  const kontrol = new AbortController();
  const timer = setTimeout(() => kontrol.abort(), batasMs);
  try {
    const res = await fetchFn(url.trim(), {
      method: metode,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: kontrol.signal,
    });
    if (res.status === 204) return null;
    if (res.status < 200 || res.status > 299) {
      let detail = '';
      try {
        detail = ((await res.json()) as { error?: string }).error ?? '';
      } catch {
        /* badan respons bukan JSON */
      }
      throw new ApiError(res.status, detail || `Server merespons status ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export function ambilJson(url: string, fetchFn: FetchFn = fetch, batasMs = 10000): Promise<unknown> {
  return requestJson('GET', url, { fetchFn, batasMs });
}
```

> **Narasi pengajar:** Tunjukkan tiga lapisan perlindungan di requestJson: batas waktu, pemeriksaan status, dan pesan error dari server. Tanyakan apa yang terjadi bila status 204 dibaca sebagai JSON, lalu tunjukkan penanganannya.

## 5. Klien API

Satu fungsi per endpoint. Halaman tidak perlu tahu detail URL. Berkas `src/services/apiClient.ts`:

```ts
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
```

> **Narasi pengajar:** Satu fungsi per endpoint membuat halaman bersih dan mudah diuji. Bandingkan dengan menaruh fetch langsung di setiap halaman, lalu minta peserta menyebut kerugiannya.

## 6. Menangani kegagalan

- Status 4xx: tampilkan pesan dari server (`error`).
- Timeout atau jaringan mati: simpan sebagai PENDING, coba lagi nanti.
- Jangan membaca body kosong (204) sebagai JSON.
- Aplikasi tidak boleh macet: selalu ada batas waktu.

> **Narasi pengajar:** Buka simulasi jaringan atau ubah kondisi pada simulasi REST. Buat peserta menyebut tindakan untuk tiap kegagalan: tampilkan pesan, biarkan PENDING, atau arahkan login. Aplikasi yang baik tidak pernah macet menunggu.

## Latihan

1. Jalankan server: `cd shared/server`, `npm install`, `npm start`, buka `http://localhost:3000/health`.
2. Login lewat halaman Sinkronisasi dan baca log hasilnya.
3. Matikan server lalu coba lagi. Apa pesan error yang tampil?

## Peta Kompetensi BNSP

Unit **J.612000.025.01**. Elemen yang dinilai:

- Memahami protokol dan komunikasi data
- Mengakses jaringan dari aplikasi

Bukti pada pelatihan ini: `shared/server/app.js`, `src/services/httpsService.ts`, `src/services/apiClient.ts`, halaman Sinkronisasi.

Praktik langkah demi langkah: [hands-on Hari 2, Step 0 sampai 2](../hands-on/hari-2.md).
