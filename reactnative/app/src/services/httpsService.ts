/** Mengembalikan pesan error jika URL tidak aman, atau null jika URL aman. */
export function periksaUrlAman(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return 'URL tidak valid.';
  }
  if (u.protocol !== 'https:') return 'Gunakan HTTPS (https://).';
  return null;
}

type FetchFn = typeof fetch;

export async function ambilJson(
  url: string,
  fetchFn: FetchFn = fetch,
  batasMs = 10000,
): Promise<unknown> {
  const pesan = periksaUrlAman(url);
  if (pesan) throw new Error(pesan);

  const kontrol = new AbortController();
  const timer = setTimeout(() => kontrol.abort(), batasMs);
  try {
    const res = await fetchFn(url.trim(), {
      headers: { Accept: 'application/json' },
      signal: kontrol.signal,
    });
    if (res.status !== 200) throw new Error(`Server merespons status ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}
