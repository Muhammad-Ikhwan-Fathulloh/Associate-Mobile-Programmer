# Modul 7: API Lanjutan: CRUD, Token, Sinkronisasi, dan Keamanan Jaringan

**Durasi:** 13.00 to 15.00

**Unit kompetensi BNSP:** J.612000.008.01

## Pengantar

Sesi ini menyelesaikan jalur data: dari SQLite ke server dan kembali. Kita melengkapi API dengan login dan token, menyimpan token dengan aman, lalu membangun sinkronisasi offline-first. Sepanjang jalan kita membahas jaringan seluler dan ancaman komunikasi nirkabel, karena sinkronisasi berjalan di atas jaringan yang tidak selalu aman. Pesannya: data lokal dulu, kirim saat bisa, dan amankan jalurnya.

## Tujuan Pembelajaran

1. Menyelesaikan CRUD lewat API dengan token.
2. Menyimpan token dengan aman.
3. Menyinkronkan data lokal dengan server (offline-first).
4. Menjelaskan jaringan seluler dan ancaman komunikasi nirkabel.

## 1. Alur sinkronisasi

- Simpan ke SQLite dulu (**offline-first**) dengan status `PENDING`.
- Saat online: kirim semua `PENDING` (POST bila baru, PUT bila sudah punya `serverId`).
- Tandai `SYNCED` dan simpan `serverId` dari server, lalu ambil data baru dari server.
- Satu kegagalan tidak boleh menghentikan yang lain. Hasil dilaporkan: terkirim, diterima, gagal.

> **Narasi pengajar:** Buka simulasi offline-first. Buat beberapa catatan saat offline, lalu sambungkan jaringan. Minta peserta menjelaskan apa yang berubah pada status tiap catatan. Tekankan bahwa kegagalan satu catatan tidak boleh menghentikan yang lain.

## 2. Kode sinkronisasi

Dua tahap: kirim yang tertunda, lalu ambil dari server. Pengujiannya memakai API palsu tanpa jaringan. Berkas `src/services/sync.ts`:

```ts
import { Note } from '../models/note';
import { ApiClient, NoteServer } from './apiClient';

/** Bagian repository yang dibutuhkan sinkronisasi. Dipisah agar mudah diuji. */
export type Penyimpanan = {
  catatanPending: () => Promise<Note[]>;
  tandaiSynced: (id: number, serverId: number) => Promise<void>;
  simpanDariServer: (n: Note & { serverId: number }) => Promise<void>;
};

export type HasilSinkron = { terkirim: number; diterima: number; gagal: number };

/**
 * Offline-first: kirim catatan PENDING ke server, lalu ambil catatan baru dari server.
 * Kegagalan satu catatan tidak menghentikan yang lain.
 */
export async function sinkronkan(db: Penyimpanan, api: ApiClient, token: string): Promise<HasilSinkron> {
  const hasil: HasilSinkron = { terkirim: 0, diterima: 0, gagal: 0 };

  for (const n of await db.catatanPending()) {
    try {
      const di = n.serverId != null ? await api.ubahCatatan(token, n.serverId, n) : await api.buatCatatan(token, n);
      await db.tandaiSynced(n.id!, di.id);
      hasil.terkirim++;
    } catch {
      hasil.gagal++;
    }
  }

  const dariServer: NoteServer[] = await api.daftarCatatan(token);
  for (const s of dariServer) {
    await db.simpanDariServer({
      title: s.title,
      content: s.content,
      latitude: s.latitude,
      longitude: s.longitude,
      updatedAt: s.updatedAt,
      syncStatus: 'SYNCED',
      serverId: s.id,
    });
    hasil.diterima++;
  }
  return hasil;
}
```

> **Narasi pengajar:** Telusuri dua tahap di sync.ts: kirim yang PENDING, lalu ambil dari server. Tunjukkan percabangan POST untuk catatan baru dan PUT untuk catatan yang sudah punya serverId. Sebut bahwa pengujiannya memakai API palsu sehingga tidak butuh jaringan.

## 3. Token dan penyimpanan aman

Token disimpan di Keystore Android atau Keychain iOS, bukan di SQLite. Berkas `src/services/secureStorage.ts`:

```ts
import * as SecureStore from 'expo-secure-store';

const KUNCI = 'token_demo';

export const simpanToken = (nilai: string) => SecureStore.setItemAsync(KUNCI, nilai);
export const bacaToken = () => SecureStore.getItemAsync(KUNCI);
export const hapusToken = () => SecureStore.deleteItemAsync(KUNCI);
```

> **Narasi pengajar:** Token adalah kunci akses. Simpan di secure store, bukan di SQLite atau teks biasa. Buka simulasi penyimpanan aman untuk membandingkan tempat penyimpanan dan risikonya.

## 4. Jaringan seluler secara ringkas

| Generasi | Ciri utama |
|---|---|
| 2G (GSM) | Suara digital dan SMS, data terbatas |
| 3G | Data seluler dan internet bergerak |
| 4G (LTE) | Data cepat, berbasis IP penuh |
| 5G | Kecepatan tinggi dan latensi rendah |

> **Narasi pengajar:** Bagian ini ringkas karena fokusnya keputusan di aplikasi. Cukup kenali generasi jaringan dan ciri utamanya, lalu hubungkan: data seluler berbayar, jadi sinkronisasi besar sebaiknya menunggu Wi-Fi.

## 5. Handover dan Mobile IP

- **Handover**: sambungan berpindah ke menara lain saat pengguna bergerak.
- **Mobile IP**: perangkat tetap dapat dijangkau dengan alamat yang sama saat berpindah jaringan.
- Komponen GSM: MS (ponsel dan SIM), BTS (menara), BSC, MSC, serta HLR dan VLR (basis data pelanggan).

> **Narasi pengajar:** Buka simulasi handover dan lihat sambungan berpindah antar menara. Jelaskan Mobile IP sebagai cara perangkat tetap dapat dijangkau dengan alamat yang sama saat berpindah jaringan, dengan peran home agent dan foreign agent.

## 6. Mendeteksi jenis koneksi

`labelJaringan` menerjemahkan status mentah menjadi label. Dipakai agar sinkronisasi menunggu jaringan yang sesuai. Berkas `src/services/networkService.ts`:

```ts
import * as Network from 'expo-network';

export type JenisJaringan = 'Seluler' | 'Wi-Fi' | 'Tidak ada koneksi' | 'Lainnya';

/** Menerjemahkan hasil expo-network menjadi label bahasa Indonesia. */
export function labelJaringan(s: Network.NetworkState): JenisJaringan {
  if (!s.isConnected) return 'Tidak ada koneksi';
  if (s.type === Network.NetworkStateType.CELLULAR) return 'Seluler';
  if (s.type === Network.NetworkStateType.WIFI) return 'Wi-Fi';
  return 'Lainnya';
}

export async function cekJaringan() {
  const state = await Network.getNetworkStateAsync();
  return { label: labelJaringan(state), terhubung: !!state.isConnected };
}
```

> **Narasi pengajar:** Fungsi labelJaringan menerjemahkan status mentah menjadi label yang dimengerti pengguna. Hubungkan dengan sinkronisasi: aplikasi bisa menunda pengiriman besar sampai jaringan yang sesuai.

## 7. Ancaman komunikasi nirkabel

| Ancaman | Cara kerja | Pencegahan |
|---|---|---|
| Penyadapan (sniffing) | Membaca lalu lintas Wi-Fi terbuka | HTTPS, hindari Wi-Fi terbuka |
| Man-in-the-middle | Penyerang berada di tengah jalur | TLS dengan sertifikat valid |
| Access point palsu | Wi-Fi tiruan menjebak pengguna | Verifikasi jaringan, pakai VPN |
| Pencurian token | Rahasia dibaca dari penyimpanan biasa | Penyimpanan aman |

> **Narasi pengajar:** Mulai dengan skenario: Anda memakai Wi-Fi gratis di kafe. Apa yang bisa dilihat orang lain di jaringan yang sama? Dari situ kita bahas penyadapan, man-in-the-middle, dan access point palsu. Buka simulasi TLS untuk melihat bedanya data terbuka dan data terenkripsi.

## 8. HTTPS dan timeout

Tolak URL non-HTTPS (kecuali alamat lokal untuk pengembangan), batasi waktu dengan `AbortController`. Berkas `src/services/httpsService.ts`:

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

> **Narasi pengajar:** Dua kebiasaan dalam satu fungsi. Pertama, tolak alamat selain HTTPS sebelum permintaan dikirim. Kedua, batasi waktu tunggu agar aplikasi tidak menggantung. Buka simulasi pemeriksa URL, ketik beberapa alamat, dan lihat mana yang ditolak.

## 9. Prinsip pengamanan aplikasi

- Selalu **HTTPS** di produksi. HTTP hanya untuk server lokal saat pengembangan.
- Rahasia di **secure store**, bukan di SQLite atau teks biasa.
- **Validasi masukan** di aplikasi dan di server.
- Jangan menaruh kunci rahasia di dalam kode aplikasi.
- Minta **izin seperlunya** dan jelaskan alasannya.

> **Narasi pengajar:** Rangkum dengan lima prinsip yang bisa dicek di kode: selalu HTTPS, rahasia di secure store, validasi masukan, jangan taruh kunci rahasia di dalam aplikasi, dan minta izin seperlunya. Buka simulasi autentikasi: login untuk mendapat token, lalu coba endpoint dengan dan tanpa token. Diskusikan mengapa token itu harus disimpan di secure store.

## Latihan

1. Buat catatan saat server mati, nyalakan server, lalu tekan Sinkronkan. Pastikan status berubah menjadi SYNCED.
2. Ubah catatan yang sudah SYNCED dan sinkronkan lagi. Server menerima PUT atau POST?
3. Uji alamat `http://` publik dan pastikan ditolak.

## Peta Kompetensi BNSP

Unit **J.612000.008.01**. Elemen yang dinilai:

- Mengenali kerentanan komunikasi nirkabel
- Menerapkan pengamanan komunikasi
- Memahami arsitektur jaringan seluler

Bukti pada pelatihan ini: `src/services/sync.ts`, `src/services/secureStorage.ts`, `app/sinkron.tsx`, `src/services/networkService.ts`.

Praktik langkah demi langkah: [hands-on Hari 2, Step 5 sampai 7](../hands-on/hari-2.md).
