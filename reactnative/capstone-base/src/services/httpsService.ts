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
