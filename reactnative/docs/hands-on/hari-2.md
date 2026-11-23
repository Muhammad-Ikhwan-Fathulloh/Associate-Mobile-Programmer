# Hands-On Hari 2: Jaringan, Sensor, Perangkat, dan Keamanan

Hari 2 melanjutkan aplikasi `associate-mobile-app` dari Hari 1.

**Waktu:** 09.00 to 17.00 (istirahat 12.00 to 13.00)

---

## Step 0: Persiapan (09.00)

Semua paket Hari 2 sudah terpasang pada Step 1 Hari 1. Pastikan proyek Hari 1 masih lulus pengujian:

```bash
npm test
npm run typecheck
npx expo start
```

Jika ada error, selesaikan dahulu sebelum menambah fitur baru.

---

## Step 1: Jaringan Seluler (09.15)

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

`labelJaringan` menerjemahkan status mentah menjadi label. Uji: matikan Wi-Fi dan nyalakan data seluler, lalu tekan **Periksa Ulang**. Label harus berubah dari Wi-Fi ke Seluler. Nyalakan mode pesawat untuk melihat **Tidak ada koneksi**.

---

## Step 2: Sensor (10.00)

Buat file `app/sensor.tsx`:

```tsx
import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { gaya } from '../src/ui';

export default function Sensor() {
  const [a, setA] = useState({ x: 0, y: 0, z: 0 });
  const [tersedia, setTersedia] = useState<boolean | null>(null);

  useEffect(() => {
    let langganan: { remove: () => void } | undefined;
    Accelerometer.isAvailableAsync().then((ok) => {
      setTersedia(ok);
      if (!ok) return;
      Accelerometer.setUpdateInterval(300);
      langganan = Accelerometer.addListener(setA);
    });
    return () => langganan?.remove();
  }, []);

  const besar = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
  return (
    <View style={gaya.layar}>
      <View style={gaya.kartu}>
        <Text style={gaya.judul}>Akselerometer</Text>
        {tersedia === false && <Text style={gaya.error}>Sensor tidak tersedia di perangkat ini.</Text>}
        <Text style={gaya.teks}>X: {a.x.toFixed(2)}  Y: {a.y.toFixed(2)}  Z: {a.z.toFixed(2)} (satuan g)</Text>
        <Text style={gaya.teks}>Besar total: {besar.toFixed(2)} g</Text>
        <Text style={gaya.abu}>Diam di meja: Z mendekati 1 g karena gravitasi.</Text>
      </View>
    </View>
  );
}
```

Letakkan ponsel di meja, nilai Z mendekati 1 g karena gravitasi. Goyangkan ponsel untuk melihat besar total berubah. `return () => langganan?.remove()` berhenti membaca sensor saat halaman ditutup, supaya baterai hemat.

---

## Step 3: Informasi Perangkat (10.40)

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

## Step 4: Penyimpanan Aman (13.00)

Buat file `src/services/secureStorage.ts`:

```ts
import * as SecureStore from 'expo-secure-store';

const KUNCI = 'token_demo';

export const simpanToken = (nilai: string) => SecureStore.setItemAsync(KUNCI, nilai);
export const bacaToken = () => SecureStore.getItemAsync(KUNCI);
export const hapusToken = () => SecureStore.deleteItemAsync(KUNCI);
```

`expo-secure-store` menyimpan nilai di Keystore Android atau Keychain iOS. Pakai ini untuk token dan kata sandi, bukan untuk data biasa.

---

## Step 5: HTTPS dan Halaman Keamanan (13.10)

Buat file `src/services/httpsService.ts`:

```ts
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

Uji: ambil data dari alamat `https://`, lalu ganti menjadi `http://` dan pastikan ditolak. Simpan token, tutup aplikasi, buka lagi, lalu tekan **Baca Token**.

---

## Step 6: Menjalankan Seluruh Aplikasi (13.40)

Semua halaman sudah terdaftar di `app/_layout.tsx` dan `src/menu.ts`. Jalankan aplikasi dan telusuri setiap menu:

```bash
npx expo start
```

Periksa daftar berikut:

1. Catatan: tambah, ubah, hapus, lalu tutup dan buka aplikasi.
2. Lokasi: izin muncul saat tombol ditekan, peta tampil.
3. Jaringan: label sesuai kondisi koneksi.
4. Sensor: angka berubah saat ponsel digerakkan.
5. Keamanan: URL http ditolak, token tersimpan.

---

## Step 7: Pengujian (14.00)

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

Jalankan pengujian:

```bash
npm test
npm run typecheck
```

Pengujian jaringan memakai fungsi `fetch` palsu, sehingga berjalan cepat tanpa internet.

---

## Step 8: Latihan (15.00 to 17.00)

1. Tambahkan peringatan pada halaman jaringan bila jenisnya **Seluler**: "Anda memakai data seluler".
2. Tambahkan pengujian `ambilJson` untuk respons JSON yang tidak valid.
3. Tampilkan waktu terakhir pemeriksaan pada halaman jaringan.
4. Persiapan uji kompetensi: buka `docs/sertifikasi-bnsp/` dan kerjakan latihan soal.

---

## Ringkasan File Hari 2

| File | Fungsi |
|---|---|
| `src/services/networkService.ts`, `app/network.tsx` | Status dan jenis jaringan |
| `app/sensor.tsx` | Akselerometer |
| `app/device.tsx` | Informasi perangkat |
| `src/services/secureStorage.ts` | Penyimpanan aman |
| `src/services/httpsService.ts`, `app/keamanan.tsx` | Pemeriksaan HTTPS dan halaman keamanan |
| `__tests__/https.test.ts`, `__tests__/network.test.ts` | Pengujian Hari 2 |
