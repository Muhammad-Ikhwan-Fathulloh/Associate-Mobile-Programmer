# Hands-On Hari 2: API, Sensor, Sinkronisasi, dan Keamanan

Hari 2 melanjutkan aplikasi `associate-mobile-app` dari Hari 1 dan menghubungkannya ke server latihan di folder `shared/server` pada repositori ini.

**Waktu:** 09.00 to 15.00 (istirahat 12.00 to 13.00). Sisa waktu untuk latihan dan persiapan uji kompetensi.

---

## Step 0: Persiapan dan Jalankan Server Latihan (09.00)

Pastikan proyek Hari 1 masih lulus pengujian:

```bash
npm test
npm run typecheck
```

Di terminal lain, jalankan server latihan dari folder repositori:

```bash
cd shared/server
npm install
npm start
```

Buka `http://localhost:3000/health` di peramban. Jawaban `{"ok":true}` berarti server hidup. Emulator Android mengakses komputer lewat `10.0.2.2`. Ponsel fisik memakai alamat IP komputer (misalnya `http://192.168.1.10:3000`) dan harus berada di Wi-Fi yang sama.

---

## Step 1: API Dasar: REST, Metode, dan Status (09.15)

Pelajari server latihan lebih dulu. Ini rute-rutenya:

Berkas server `shared/server/app.js`:

```js
// API catatan untuk pelatihan. Data disimpan di memori agar mudah dijalankan.
// Untuk MySQL, lihat schema.sql dan docs/mysql-dan-api.md.
const express = require('express');
const crypto = require('crypto');

const PENGGUNA = { email: 'peserta@contoh.id', password: 'rahasia123' };

function buatApp() {
  const app = express();
  app.use(express.json());

  const tokens = new Set();
  let catatan = [];
  let idBerikut = 1;

  // CORS longgar untuk uji lokal (peramban). Jangan dipakai apa adanya di produksi.
  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  const wajibLogin = (req, res, next) => {
    const h = req.get('Authorization') || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : '';
    if (!tokens.has(token)) return res.status(401).json({ error: 'Token tidak valid atau belum login.' });
    next();
  };

  const validasi = (b) => {
    if (!b || typeof b.title !== 'string' || b.title.trim() === '') return 'Judul wajib diisi.';
    if (b.title.trim().length > 100) return 'Judul maksimal 100 karakter.';
    if (typeof b.content !== 'string') return 'Isi wajib berupa teks.';
    return null;
  };

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.post('/login', (req, res) => {
    const { email, password } = req.body || {};
    if (email !== PENGGUNA.email || password !== PENGGUNA.password) {
      return res.status(401).json({ error: 'Email atau kata sandi salah.' });
    }
    const token = crypto.randomBytes(16).toString('hex');
    tokens.add(token);
    res.json({ token });
  });

  app.get('/notes', wajibLogin, (req, res) => res.json(catatan));

  app.post('/notes', wajibLogin, (req, res) => {
    const pesan = validasi(req.body);
    if (pesan) return res.status(400).json({ error: pesan });
    const { title, content, latitude = null, longitude = null } = req.body;
    const baru = { id: idBerikut++, title: title.trim(), content, latitude, longitude, updatedAt: Date.now() };
    catatan.push(baru);
    res.status(201).json(baru);
  });

  app.put('/notes/:id', wajibLogin, (req, res) => {
    const n = catatan.find((x) => x.id === Number(req.params.id));
    if (!n) return res.status(404).json({ error: 'Catatan tidak ditemukan.' });
    const pesan = validasi(req.body);
    if (pesan) return res.status(400).json({ error: pesan });
    Object.assign(n, {
      title: req.body.title.trim(),
      content: req.body.content,
      latitude: req.body.latitude ?? null,
      longitude: req.body.longitude ?? null,
      updatedAt: Date.now(),
    });
    res.json(n);
  });

  app.delete('/notes/:id', wajibLogin, (req, res) => {
    const sebelum = catatan.length;
    catatan = catatan.filter((x) => x.id !== Number(req.params.id));
    if (catatan.length === sebelum) return res.status(404).json({ error: 'Catatan tidak ditemukan.' });
    res.sendStatus(204);
  });

  return app;
}

module.exports = { buatApp, PENGGUNA };
```

Login contoh: `peserta@contoh.id` dengan kata sandi `rahasia123`. Skema MySQL pasangannya (untuk diskusi, server latihan memakai memori):

Skema `shared/server/schema.sql`:

```sql
-- Skema MySQL untuk tabel catatan (padanan tabel notes di SQLite pada aplikasi).
CREATE DATABASE IF NOT EXISTS pelatihan_mobile CHARACTER SET utf8mb4;
USE pelatihan_mobile;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,       -- simpan hash (bcrypt/argon2), bukan kata sandi asli
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  latitude DOUBLE NULL,
  longitude DOUBLE NULL,
  updated_at BIGINT NOT NULL,                 -- milidetik sejak epoch, sama dengan di aplikasi
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notes_user_updated (user_id, updated_at)
);
```

---

## Step 2: Memanggil API dari Aplikasi (09.40)

Buat file `src/config.ts`:

```ts
// Alamat server API. Ubah sesuai jaringan:
//  - Emulator Android: http://10.0.2.2:3000 (alamat komputer dari dalam emulator)
//  - Ponsel dengan Expo Go: http://<IP komputer>:3000 (komputer dan ponsel satu Wi-Fi)
//  - Produksi: wajib https://
export const API_URL_BAWAAN = 'http://10.0.2.2:3000';
```

Buat file `src/services/httpsService.ts`:

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

Buat file `src/services/apiClient.ts`:

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

`requestJson` membatasi waktu, memeriksa status, dan mengubah kesalahan server menjadi `ApiError`. `apiClient` membungkus satu fungsi per endpoint.

---

## Step 3: Sensor: Akselerometer, Giroskop, dan Kompas (10.00)

Buat file `src/services/sensorMath.ts`:

```ts
export type Vektor = { x: number; y: number; z: number };

/** Besar vektor tiga sumbu. Diam di meja, akselerometer (satuan g) bernilai sekitar 1. */
export function besarVektor(v: Vektor): number {
  return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

/** Guncangan terdeteksi bila besar percepatan melewati ambang (satuan g). */
export function terdeteksiGuncangan(v: Vektor, ambang = 2): boolean {
  return besarVektor(v) > ambang;
}

/**
 * Perkiraan arah kompas (derajat, 0 = utara, searah jarum jam) dari magnetometer
 * saat ponsel datar. Hasilnya perkiraan: sumbu sensor dapat berbeda antarperangkat.
 */
export function arahKompas(m: Pick<Vektor, 'x' | 'y'>): number {
  const derajat = (Math.atan2(-m.x, m.y) * 180) / Math.PI;
  return (derajat + 360) % 360;
}

export function mataAngin(derajat: number): string {
  const nama = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
  return nama[Math.round((((derajat % 360) + 360) % 360) / 45) % 8];
}
```

Buat file `app/sensor.tsx`:

```tsx
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { arahKompas, besarVektor, mataAngin, terdeteksiGuncangan, Vektor } from '../src/services/sensorMath';
import { gaya } from '../src/ui';

const NOL: Vektor = { x: 0, y: 0, z: 0 };

type Sumber = {
  isAvailableAsync: () => Promise<boolean>;
  setUpdateInterval: (ms: number) => void;
  addListener: (fn: (v: Vektor) => void) => { remove: () => void };
};

/** Berlangganan satu sensor, dan berhenti saat halaman ditutup. */
function useSensor(sensor: Sumber, intervalMs = 300) {
  const [nilai, setNilai] = useState<Vektor>(NOL);
  const [tersedia, setTersedia] = useState<boolean | null>(null);

  useEffect(() => {
    let langganan: { remove: () => void } | undefined;
    sensor.isAvailableAsync().then((ok) => {
      setTersedia(ok);
      if (!ok) return;
      sensor.setUpdateInterval(intervalMs);
      langganan = sensor.addListener(setNilai);
    });
    return () => langganan?.remove();
  }, [sensor, intervalMs]);

  return { nilai, tersedia };
}

const f = (n: number) => n.toFixed(2);

export default function Sensor() {
  const akselerometer = useSensor(Accelerometer);
  const giroskop = useSensor(Gyroscope);
  const magnetometer = useSensor(Magnetometer);
  const derajat = arahKompas(magnetometer.nilai);

  return (
    <ScrollView style={gaya.layar}>
      <View style={gaya.kartu}>
        <Text style={gaya.judul}>Akselerometer</Text>
        {akselerometer.tersedia === false && <Text style={gaya.error}>Sensor tidak tersedia.</Text>}
        <Text style={gaya.teks}>X {f(akselerometer.nilai.x)}  Y {f(akselerometer.nilai.y)}  Z {f(akselerometer.nilai.z)} (g)</Text>
        <Text style={gaya.teks}>Besar total: {f(besarVektor(akselerometer.nilai))} g</Text>
        <Text style={gaya.teks}>{terdeteksiGuncangan(akselerometer.nilai) ? 'Guncangan terdeteksi!' : 'Tidak ada guncangan'}</Text>
        <Text style={gaya.abu}>Diam di meja: Z mendekati 1 g karena gravitasi.</Text>
      </View>

      <View style={gaya.kartu}>
        <Text style={gaya.judul}>Giroskop</Text>
        {giroskop.tersedia === false && <Text style={gaya.error}>Sensor tidak tersedia.</Text>}
        <Text style={gaya.teks}>X {f(giroskop.nilai.x)}  Y {f(giroskop.nilai.y)}  Z {f(giroskop.nilai.z)} (rad/s)</Text>
        <Text style={gaya.abu}>Mengukur laju putaran. Diam di meja: mendekati 0.</Text>
      </View>

      <View style={gaya.kartu}>
        <Text style={gaya.judul}>Magnetometer (kompas)</Text>
        {magnetometer.tersedia === false && <Text style={gaya.error}>Sensor tidak tersedia.</Text>}
        <Text style={gaya.teks}>Perkiraan arah: {Math.round(derajat)}° ({mataAngin(derajat)})</Text>
        <Text style={gaya.abu}>Letakkan ponsel datar. Hasil berupa perkiraan dan terganggu logam di sekitar.</Text>
      </View>
    </ScrollView>
  );
}
```

Letakkan ponsel di meja: akselerometer Z mendekati 1 g. Guncang ponsel untuk memicu pesan guncangan. Putar ponsel untuk melihat giroskop. Arah kompas dari magnetometer adalah pendekatan sederhana, akurasinya dipengaruhi benda logam di sekitar.

---

## Step 4: Informasi Perangkat (10.50)

Buat file `app/device.tsx`:

```tsx
import * as Device from 'expo-device';
import { Text, View } from 'react-native';
import { gaya } from '../src/ui';

export default function Perangkat() {
  const baris: [string, string][] = [
    ['Produsen', Device.manufacturer ?? '-'],
    ['Model', Device.modelName ?? '-'],
    ['Sistem operasi', `${Device.osName ?? '-'} ${Device.osVersion ?? ''}`],
    ['Memori total', Device.totalMemory ? `${(Device.totalMemory / 1024 ** 3).toFixed(1)} GB` : '-'],
    ['Perangkat fisik', Device.isDevice ? 'Ya' : 'Emulator'],
  ];
  return (
    <View style={gaya.layar}>
      <View style={gaya.kartu}>
        {baris.map(([k, v]) => (
          <Text key={k} style={gaya.teks}>{k}: {v}</Text>
        ))}
      </View>
    </View>
  );
}
```

Nilai yang tidak tersedia ditampilkan sebagai tanda hubung. Di emulator, baris *Perangkat fisik* menampilkan Emulator.

---

## Step 5: Token, Penyimpanan Aman, dan Sinkronisasi (13.00)

Buat file `src/services/secureStorage.ts`:

```ts
import * as SecureStore from 'expo-secure-store';

const KUNCI = 'token_demo';

export const simpanToken = (nilai: string) => SecureStore.setItemAsync(KUNCI, nilai);
export const bacaToken = () => SecureStore.getItemAsync(KUNCI);
export const hapusToken = () => SecureStore.deleteItemAsync(KUNCI);
```

Buat file `src/services/sync.ts`:

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

Buat file `app/sinkron.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput } from 'react-native';
import { Tombol } from '../src/components/Tombol';
import { API_URL_BAWAAN } from '../src/config';
import { catatanPending, simpanDariServer, tandaiSynced } from '../src/data/noteRepository';
import { buatApiClient } from '../src/services/apiClient';
import { sinkronkan } from '../src/services/sync';
import { gaya } from '../src/ui';

export default function Sinkron() {
  const [url, setUrl] = useState(API_URL_BAWAAN);
  const [email, setEmail] = useState('peserta@contoh.id');
  const [password, setPassword] = useState('rahasia123');
  const [token, setToken] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const api = useMemo(() => buatApiClient(url), [url]);
  const catat = (t: string) => setLog((l) => [t, ...l].slice(0, 8));

  const masuk = async () => {
    try {
      setToken(await api.login(email, password));
      catat('Login berhasil, token diterima.');
    } catch (e) {
      catat(`Login gagal: ${(e as Error).message}`);
    }
  };

  const sinkron = async () => {
    if (!token) return catat('Login dahulu.');
    try {
      const h = await sinkronkan({ catatanPending, tandaiSynced, simpanDariServer }, api, token);
      catat(`Selesai: terkirim ${h.terkirim}, diterima ${h.diterima}, gagal ${h.gagal}.`);
    } catch (e) {
      catat(`Sinkron gagal: ${(e as Error).message}`);
    }
  };

  return (
    <ScrollView style={gaya.layar}>
      <Text style={gaya.judul}>Server API</Text>
      <TextInput style={gaya.input} value={url} onChangeText={setUrl} autoCapitalize="none" autoCorrect={false} />
      <TextInput style={gaya.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={gaya.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Tombol label="Login" onPress={masuk} />
      <Tombol label="Sinkronkan catatan" onPress={sinkron} />
      <Text style={gaya.abu}>Jalankan server dahulu: cd shared/server, npm install, npm start.</Text>
      {log.map((l, i) => (
        <Text key={i} style={gaya.teks}>{l}</Text>
      ))}
    </ScrollView>
  );
}
```

Alur: catatan disimpan ke SQLite dengan status `PENDING`. Tombol **Sinkronkan** mengirim yang tertunda (POST, atau PUT bila sudah punya `serverId`), menandai `SYNCED`, lalu mengambil data baru dari server. Uji: matikan server, buat catatan, nyalakan server, tekan Sinkronkan.

---

## Step 6: Jaringan Seluler dan Keamanan Komunikasi (14.00)

Buat file `src/services/networkService.ts`:

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

Buat file `app/network.tsx`:

```tsx
import * as Network from 'expo-network';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Tombol } from '../src/components/Tombol';
import { cekJaringan } from '../src/services/networkService';
import { gaya, warna } from '../src/ui';

export default function Jaringan() {
  const [info, setInfo] = useState<{ label: string; terhubung: boolean } | null>(null);
  const [ip, setIp] = useState('-');

  const muat = async () => {
    setInfo(await cekJaringan());
    setIp(await Network.getIpAddressAsync().catch(() => '-'));
  };
  useEffect(() => { muat(); }, []);

  return (
    <View style={gaya.layar}>
      <View style={gaya.kartu}>
        <Text style={gaya.judul}>{info?.label ?? 'Memeriksa...'}</Text>
        <Text style={[gaya.teks, { color: info?.terhubung ? warna.ok : warna.bahaya }]}>
          {info?.terhubung ? 'Terhubung ke internet' : 'Tidak terhubung'}
        </Text>
        <Text style={gaya.abu}>Alamat IP perangkat: {ip}</Text>
      </View>
      <Tombol label="Periksa Ulang" onPress={muat} />
    </View>
  );
}
```

Buat file `app/keamanan.tsx`:

```tsx
import { useState } from 'react';
import { ScrollView, Text, TextInput } from 'react-native';
import { Tombol } from '../src/components/Tombol';
import { ambilJson, periksaUrlAman } from '../src/services/httpsService';
import { bacaToken, hapusToken, simpanToken } from '../src/services/secureStorage';
import { gaya } from '../src/ui';

export default function Keamanan() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [hasil, setHasil] = useState('');
  const [token, setToken] = useState('');
  const [tersimpan, setTersimpan] = useState('');

  const panggil = async () => {
    const pesan = periksaUrlAman(url);
    if (pesan) return setHasil(`Ditolak: ${pesan}`);
    try {
      setHasil(JSON.stringify(await ambilJson(url), null, 2));
    } catch (e) {
      setHasil(`Gagal: ${(e as Error).message}`);
    }
  };

  return (
    <ScrollView style={gaya.layar}>
      <Text style={gaya.judul}>Cek HTTPS</Text>
      <TextInput style={gaya.input} value={url} onChangeText={setUrl} autoCapitalize="none" autoCorrect={false} />
      <Tombol label="Ambil Data" onPress={panggil} />
      {hasil !== '' && <Text style={gaya.teks}>{hasil}</Text>}

      <Text style={[gaya.judul, { marginTop: 16 }]}>Penyimpanan Aman</Text>
      <TextInput style={gaya.input} placeholder="Token rahasia" value={token} onChangeText={setToken} secureTextEntry />
      <Tombol label="Simpan Token" onPress={async () => { await simpanToken(token); setToken(''); }} />
      <Tombol label="Baca Token" onPress={async () => setTersimpan((await bacaToken()) ?? '(kosong)')} />
      <Tombol label="Hapus Token" bahaya onPress={async () => { await hapusToken(); setTersimpan('(dihapus)'); }} />
      {tersimpan !== '' && <Text style={gaya.teks}>Isi tersimpan: {tersimpan}</Text>}
    </ScrollView>
  );
}
```

`labelJaringan` menerjemahkan status mentah menjadi label. Uji: alamat `http://` publik ditolak, alamat lokal (`10.0.2.2`) diizinkan untuk pengembangan. Matikan Wi-Fi dan lihat label berubah.

---

## Step 7: Pengujian Hari 2 (14.30)

Buat file `__tests__/https.test.ts`:

```ts
import { ambilJson, periksaUrlAman } from '../src/services/httpsService';

const fakeFetch = (status: number, body: unknown) =>
  (async () => ({ status, json: async () => body })) as unknown as typeof fetch;

describe('periksaUrlAman', () => {
  it('menolak http', () => expect(periksaUrlAman('http://a.com')).toBe('Gunakan HTTPS (https://).'));
  it('menolak teks bukan URL', () => expect(periksaUrlAman('bukan url')).toBe('URL tidak valid.'));
  it('menerima https', () => expect(periksaUrlAman('https://a.com/x')).toBeNull());
});

describe('ambilJson', () => {
  it('mengembalikan JSON saat status 200', async () => {
    await expect(ambilJson('https://a.com', fakeFetch(200, { ok: 1 }))).resolves.toEqual({ ok: 1 });
  });
  it('melempar error saat status bukan 200', async () => {
    await expect(ambilJson('https://a.com', fakeFetch(500, {}))).rejects.toThrow('status 500');
  });
  it('menolak URL http tanpa memanggil jaringan', async () => {
    const spy = jest.fn();
    await expect(ambilJson('http://a.com', spy as unknown as typeof fetch)).rejects.toThrow('HTTPS');
    expect(spy).not.toHaveBeenCalled();
  });
  it('membatalkan permintaan saat timeout', async () => {
    const lambat = ((_: string, opt: RequestInit) =>
      new Promise((_res, rej) => opt.signal!.addEventListener('abort', () => rej(new Error('aborted'))))) as unknown as typeof fetch;
    await expect(ambilJson('https://a.com', lambat, 20)).rejects.toThrow('aborted');
  });
});
```

Buat file `__tests__/network.test.ts`:

```ts
import * as Network from 'expo-network';
import { labelJaringan } from '../src/services/networkService';

const s = (isConnected: boolean, type: Network.NetworkStateType) => ({ isConnected, type } as Network.NetworkState);

describe('labelJaringan', () => {
  it('seluler', () => expect(labelJaringan(s(true, Network.NetworkStateType.CELLULAR))).toBe('Seluler'));
  it('wifi', () => expect(labelJaringan(s(true, Network.NetworkStateType.WIFI))).toBe('Wi-Fi'));
  it('terputus', () => expect(labelJaringan(s(false, Network.NetworkStateType.NONE))).toBe('Tidak ada koneksi'));
});
```

Buat file `__tests__/api.test.ts`:

```ts
import { buatApiClient } from '../src/services/apiClient';
import { ApiError, periksaUrlAman, requestJson } from '../src/services/httpsService';

const res = (status: number, body?: unknown) =>
  ({ status, json: async () => body }) as unknown as Response;

describe('periksaUrlAman dengan izinkanLokal', () => {
  it('http ke alamat publik tetap ditolak', () => {
    expect(periksaUrlAman('http://contoh.com', true)).toBe('Gunakan HTTPS (https://).');
  });
  it('http ke jaringan lokal diizinkan hanya bila diminta', () => {
    expect(periksaUrlAman('http://10.0.2.2:3000', false)).not.toBeNull();
    expect(periksaUrlAman('http://10.0.2.2:3000', true)).toBeNull();
    expect(periksaUrlAman('http://192.168.1.5:3000', true)).toBeNull();
    expect(periksaUrlAman('http://localhost:3000', true)).toBeNull();
  });
});

describe('requestJson', () => {
  it('mengirim metode, token, dan badan JSON', async () => {
    const fetchFn = jest.fn(async () => res(201, { id: 1 }));
    await requestJson('POST', 'https://a.com/notes', { fetchFn: fetchFn as unknown as typeof fetch, token: 'abc', body: { title: 'x' } });
    const [, opsi] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(opsi.method).toBe('POST');
    expect((opsi.headers as Record<string, string>).Authorization).toBe('Bearer abc');
    expect(opsi.body).toBe('{"title":"x"}');
  });
  it('status 204 menghasilkan null', async () => {
    const fetchFn = (async () => res(204)) as unknown as typeof fetch;
    await expect(requestJson('DELETE', 'https://a.com/notes/1', { fetchFn })).resolves.toBeNull();
  });
  it('status 401 melempar ApiError dengan pesan dari server', async () => {
    const fetchFn = (async () => res(401, { error: 'Token tidak valid' })) as unknown as typeof fetch;
    await expect(requestJson('GET', 'https://a.com/notes', { fetchFn })).rejects.toMatchObject({ status: 401, message: 'Token tidak valid' });
    await expect(requestJson('GET', 'https://a.com/notes', { fetchFn })).rejects.toBeInstanceOf(ApiError);
  });
});

describe('buatApiClient', () => {
  it('login mengembalikan token dan memakai alamat dasar tanpa garis miring ganda', async () => {
    const fetchFn = jest.fn(async () => res(200, { token: 'tok' }));
    const api = buatApiClient('http://10.0.2.2:3000/', { fetchFn: fetchFn as unknown as typeof fetch });
    await expect(api.login('a', 'b')).resolves.toBe('tok');
    expect((fetchFn.mock.calls[0] as unknown as [string])[0]).toBe('http://10.0.2.2:3000/login');
  });
});
```

Buat file `__tests__/sync.test.ts`:

```ts
import { Note, noteBaru } from '../src/models/note';
import { ApiClient } from '../src/services/apiClient';
import { Penyimpanan, sinkronkan } from '../src/services/sync';

const catatan = (id: number, serverId: number | null = null): Note => ({ ...noteBaru('judul ' + id, 'isi'), id, serverId });

function buatDb(pending: Note[]) {
  const synced: [number, number][] = [];
  const dariServer: number[] = [];
  const db: Penyimpanan = {
    catatanPending: async () => pending,
    tandaiSynced: async (id, sid) => { synced.push([id, sid]); },
    simpanDariServer: async (n) => { dariServer.push(n.serverId); },
  };
  return { db, synced, dariServer };
}

const apiPalsu = (o: Partial<ApiClient>): ApiClient => ({
  login: async () => 't',
  daftarCatatan: async () => [],
  buatCatatan: async () => ({ id: 100, title: '', content: '', latitude: null, longitude: null, updatedAt: 0 }),
  ubahCatatan: async () => ({ id: 7, title: '', content: '', latitude: null, longitude: null, updatedAt: 0 }),
  ...o,
});

describe('sinkronkan (offline-first)', () => {
  it('mengirim catatan baru lewat POST dan menandainya SYNCED', async () => {
    const { db, synced } = buatDb([catatan(1)]);
    const h = await sinkronkan(db, apiPalsu({}), 't');
    expect(synced).toEqual([[1, 100]]);
    expect(h).toEqual({ terkirim: 1, diterima: 0, gagal: 0 });
  });

  it('catatan yang sudah punya serverId dikirim lewat PUT', async () => {
    const ubah = jest.fn(apiPalsu({}).ubahCatatan);
    const buat = jest.fn(apiPalsu({}).buatCatatan);
    const { db, synced } = buatDb([catatan(2, 7)]);
    await sinkronkan(db, apiPalsu({ ubahCatatan: ubah, buatCatatan: buat }), 't');
    expect(ubah).toHaveBeenCalledTimes(1);
    expect(buat).not.toHaveBeenCalled();
    expect(synced).toEqual([[2, 7]]);
  });

  it('kegagalan satu catatan tidak menghentikan yang lain', async () => {
    let n = 0;
    const buat = async () => {
      if (n++ === 0) throw new Error('jaringan putus');
      return { id: 50, title: '', content: '', latitude: null, longitude: null, updatedAt: 0 };
    };
    const { db, synced } = buatDb([catatan(1), catatan(2)]);
    const h = await sinkronkan(db, apiPalsu({ buatCatatan: buat }), 't');
    expect(h.gagal).toBe(1);
    expect(h.terkirim).toBe(1);
    expect(synced).toEqual([[2, 50]]);
  });

  it('menyimpan catatan dari server', async () => {
    const dariServer = [{ id: 9, title: 'dari server', content: 'x', latitude: null, longitude: null, updatedAt: 1 }];
    const { db, dariServer: tersimpan } = buatDb([]);
    const h = await sinkronkan(db, apiPalsu({ daftarCatatan: async () => dariServer }), 't');
    expect(tersimpan).toEqual([9]);
    expect(h.diterima).toBe(1);
  });
});
```

Buat file `__tests__/sensor.test.ts`:

```ts
import { arahKompas, besarVektor, mataAngin, terdeteksiGuncangan } from '../src/services/sensorMath';

describe('sensorMath', () => {
  it('besar vektor diam di meja sekitar 1 g', () => {
    expect(besarVektor({ x: 0, y: 0, z: 1 })).toBeCloseTo(1, 5);
  });
  it('guncangan terdeteksi di atas ambang', () => {
    expect(terdeteksiGuncangan({ x: 0, y: 0, z: 1 })).toBe(false);
    expect(terdeteksiGuncangan({ x: 2, y: 1.5, z: 1 })).toBe(true);
    expect(terdeteksiGuncangan({ x: 0, y: 0, z: 1.5 }, 1.2)).toBe(true);
  });
  it('arah kompas: medan di sumbu +y berarti utara', () => {
    expect(arahKompas({ x: 0, y: 1 })).toBeCloseTo(0, 5);
    expect(arahKompas({ x: -1, y: 0 })).toBeCloseTo(90, 5);
    expect(arahKompas({ x: 0, y: -1 })).toBeCloseTo(180, 5);
    expect(arahKompas({ x: 1, y: 0 })).toBeCloseTo(270, 5);
  });
  it('nama mata angin', () => {
    expect(mataAngin(0)).toBe('Utara');
    expect(mataAngin(90)).toBe('Timur');
    expect(mataAngin(359)).toBe('Utara');
    expect(mataAngin(225)).toBe('Barat Daya');
  });
});
```

Jalankan pengujian:

```bash
npm test
npm run typecheck
```

Pengujian API dan sinkronisasi memakai `fetch` palsu dan basis data tiruan, sehingga berjalan cepat tanpa jaringan. Pengujian server: `cd shared/server` lalu `npm test`.

---

## Step 8: Latihan (15.00)

1. Buat catatan saat server mati, nyalakan server, lalu sinkronkan. Pastikan status berubah menjadi SYNCED.
2. Ubah catatan yang sudah SYNCED lalu sinkronkan lagi. Pastikan server menerima PUT.
3. Tambahkan tampilan jumlah catatan PENDING pada halaman Sinkronisasi.
4. Tambahkan pengujian `sinkronkan` untuk kasus satu catatan gagal dan yang lain berhasil.
5. Persiapan uji kompetensi: buka `docs/sertifikasi-bnsp.md` dan kerjakan latihan soal.

---

## Ringkasan File Hari 2

| File | Fungsi |
|---|---|
| `shared/server/app.js`, `schema.sql` | Server latihan dan skema MySQL |
| `src/config.ts`, `src/services/httpsService.ts`, `src/services/apiClient.ts` | Memanggil API |
| `src/services/sensorMath.ts`, `app/sensor.tsx` | Sensor dan perhitungannya |
| `app/device.tsx` | Informasi perangkat |
| `src/services/secureStorage.ts`, `src/services/sync.ts`, `app/sinkron.tsx` | Token dan sinkronisasi |
| `src/services/networkService.ts`, `app/network.tsx`, `app/keamanan.tsx` | Jaringan dan keamanan |
| `__tests__/*.test.ts` | Pengujian |
