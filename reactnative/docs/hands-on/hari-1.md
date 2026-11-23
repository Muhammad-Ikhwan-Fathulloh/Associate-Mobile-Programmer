# Hands-On Hari 1: Dasar React Native, Database Lokal, dan Lokasi

Panduan ini membangun aplikasi `associate-mobile-app` dari awal dengan **Expo dan TypeScript**. Setiap step menampilkan kode lengkap untuk file yang dibuat atau diubah, sehingga peserta dapat mengetik kode sendiri sambil mengikuti langkahnya.

**Waktu:** 09.00 to 17.00 (istirahat 12.00 to 13.00)

**Perangkat:** laptop dengan Node.js LTS, VS Code, dan ponsel Android dengan aplikasi Expo Go (atau emulator Android dari Android Studio).

---

## Step 0: Instalasi dan Cek Lingkungan (09.00)

Panduan lengkap per sistem operasi ada di [docs/instalasi-node-expo.md](../instalasi-node-expo.md). Ringkasannya:

1. Pasang Node.js versi LTS dari https://nodejs.org (npm ikut terpasang).
2. Pasang Git dan VS Code.
3. Pasang aplikasi **Expo Go** di ponsel Android, atau pasang Android Studio dan buat emulator di *Device Manager*.
4. Pastikan laptop dan ponsel berada pada jaringan Wi-Fi yang sama.

Verifikasi:

```bash
node --version
npm --version
git --version
```

Pastikan ketiganya menampilkan nomor versi tanpa pesan error.

---

## Step 1: Buat Proyek dan Konfigurasi Dependensi (09.15)

Buat proyek baru dari templat TypeScript kosong, lalu masuk ke foldernya:

```bash
npx create-expo-app@latest associate-mobile-app --template blank-typescript
cd associate-mobile-app
```

Pasang semua paket yang dipakai pada Hari 1 dan Hari 2 sekarang, agar tidak perlu memasang ulang. Perintah `npx expo install` memilih versi yang cocok dengan versi Expo di proyek:

```bash
npx expo install expo-router expo-sqlite expo-location expo-network expo-sensors expo-device expo-secure-store expo-status-bar react-native-webview react-native-safe-area-context react-native-screens
npx expo install --dev jest jest-expo @types/jest typescript
```

Hapus file templat yang tidak dipakai, karena navigasi akan memakai *expo-router*:

```bash
rm App.tsx index.ts
```

Buka `package.json`, ubah `main` dan tambahkan skrip serta pengaturan jest. Bagian lain biarkan seperti hasil perintah di atas:

```json
{
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "test": "jest",
    "typecheck": "tsc --noEmit"
  },
  "jest": {
    "preset": "jest-expo"
  }
}
```

---

## Step 2: Konfigurasi Aplikasi dan TypeScript (09.35)

Ganti isi `app.json`:

```json
{
  "expo": {
    "name": "Associate Mobile App",
    "slug": "associate-mobile-app",
    "version": "1.0.0",
    "scheme": "associatemobile",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "plugins": [
      "expo-router",
      "expo-sqlite",
      [
        "expo-location",
        { "locationWhenInUsePermission": "Aplikasi memakai lokasi untuk menandai catatan." }
      ],
      "expo-secure-store"
    ],
    "android": {
      "package": "id.ac.associate.mobileapp",
      "permissions": ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION", "ACCESS_NETWORK_STATE"]
    },
    "ios": { "bundleIdentifier": "id.ac.associate.mobileapp" }
  }
}
```

Plugin `expo-location` berisi teks izin yang dibaca pengguna. Daftar `permissions` Android menyatakan izin lokasi dan status jaringan.

Ganti isi `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": { "strict": true },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

Mode `strict` membuat TypeScript menandai nilai yang mungkin `null` atau `undefined` sebelum aplikasi dijalankan.

---

## Step 3: Tema, Menu, dan Layout Navigasi (09.50)

Buat folder `src/components` dan `app` bila belum ada.

Buat file `src/ui.ts`:

```ts
import { StyleSheet } from 'react-native';

export const warna = { utama: '#1565c0', latar: '#f5f7fb', teks: '#1b1f27', abu: '#5f6b7a', bahaya: '#c62828', ok: '#2e7d32' };

export const gaya = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar, padding: 16 },
  kartu: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, elevation: 1 },
  judul: { fontSize: 18, fontWeight: '700', color: warna.teks },
  teks: { fontSize: 15, color: warna.teks, marginTop: 4 },
  abu: { fontSize: 13, color: warna.abu, marginTop: 4 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cfd6e0', borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 15 },
  tombol: { backgroundColor: warna.utama, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 10 },
  tombolTeks: { color: '#fff', fontWeight: '700', fontSize: 15 },
  error: { color: warna.bahaya, marginBottom: 8 },
});
```

Buat file `src/menu.ts`:

```ts
export const MENU = [
  { href: '/notes', judul: 'Catatan', ket: 'SQLite: tambah, ubah, hapus (Modul 2 dan 3)' },
  { href: '/location', judul: 'Lokasi dan Peta', ket: 'GPS, jarak, peta OpenStreetMap (Modul 4)' },
  { href: '/network', judul: 'Jaringan Seluler', ket: 'Status koneksi dan jenis jaringan (Modul 5)' },
  { href: '/sensor', judul: 'Sensor', ket: 'Akselerometer dan protokol sensor (Modul 6)' },
  { href: '/device', judul: 'Info Perangkat', ket: 'Model, OS, memori (Modul 6)' },
  { href: '/keamanan', judul: 'Keamanan', ket: 'HTTPS dan penyimpanan aman (Modul 7)' },
] as const;
```

Buat file `src/components/Tombol.tsx`:

```tsx
import { Pressable, Text } from 'react-native';
import { gaya, warna } from '../ui';

type Props = { label: string; onPress: () => void; bahaya?: boolean; testID?: string };

export function Tombol({ label, onPress, bahaya, testID }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={[gaya.tombol, bahaya && { backgroundColor: warna.bahaya }]}
    >
      <Text style={gaya.tombolTeks}>{label}</Text>
    </Pressable>
  );
}
```

Buat file `app/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#1565c0' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="index" options={{ title: 'Associate Mobile App' }} />
      <Stack.Screen name="notes" options={{ title: 'Catatan' }} />
      <Stack.Screen name="note-form" options={{ title: 'Form Catatan' }} />
      <Stack.Screen name="location" options={{ title: 'Lokasi dan Peta' }} />
      <Stack.Screen name="network" options={{ title: 'Jaringan Seluler' }} />
      <Stack.Screen name="sensor" options={{ title: 'Sensor' }} />
      <Stack.Screen name="device" options={{ title: 'Info Perangkat' }} />
      <Stack.Screen name="keamanan" options={{ title: 'Keamanan' }} />
    </Stack>
  );
}
```

Di expo-router, setiap file di folder `app/` otomatis menjadi satu halaman, dan `_layout.tsx` mengatur bingkai navigasinya.

---

## Step 4: Halaman Beranda (10.05)

Buat file `app/index.tsx`:

```tsx
import { Link } from 'expo-router';
import { ScrollView, Text, Pressable } from 'react-native';
import { MENU } from '../src/menu';
import { gaya } from '../src/ui';

export default function Beranda() {
  return (
    <ScrollView style={gaya.layar}>
      <Text style={[gaya.judul, { marginBottom: 12 }]}>Pilih materi praktik</Text>
      {MENU.map((m) => (
        <Link key={m.href} href={m.href} asChild>
          <Pressable style={gaya.kartu} accessibilityRole="button">
            <Text style={gaya.judul}>{m.judul}</Text>
            <Text style={gaya.abu}>{m.ket}</Text>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}
```

Jalankan aplikasi dan buka lewat Expo Go dengan memindai kode QR:

```bash
npx expo start
```

Menu tampil, tetapi ketukan belum membuka halaman karena halamannya belum dibuat. Itu normal, halaman dibuat pada step berikutnya.

---

## Step 5: Model Data Catatan (10.30)

Buat file `src/models/note.ts`:

```ts
export type Note = {
  id?: number;
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  updatedAt: number;
  syncStatus: 'PENDING' | 'SYNCED';
};

export function noteBaru(
  title: string,
  content: string,
  latitude: number | null = null,
  longitude: number | null = null,
): Note {
  return { title, content, latitude, longitude, updatedAt: Date.now(), syncStatus: 'PENDING' };
}

/** Mengembalikan pesan error jika judul tidak valid, atau null jika valid. */
export function validasiJudul(judul: string): string | null {
  if (judul.trim().length === 0) return 'Judul wajib diisi.';
  if (judul.trim().length > 100) return 'Judul maksimal 100 karakter.';
  return null;
}
```

`validasiJudul` adalah fungsi murni sehingga mudah diuji tanpa perangkat.

---

## Step 6: Database SQLite (10.50)

Buat file `src/data/database.ts`:

```ts
import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Membuka database sekali, lalu memakai koneksi yang sama. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('associate_mobile.db');
      await db.execAsync(`
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          updated_at INTEGER NOT NULL,
          sync_status TEXT NOT NULL DEFAULT 'PENDING'
        );
        CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);
      `);
      return db;
    })();
  }
  return dbPromise;
}
```

Tabel dibuat hanya jika belum ada (`IF NOT EXISTS`), dan kolom `sync_status` menyiapkan sinkronisasi ke server.

---

## Step 7: Repository (11.05)

Buat file `src/data/noteRepository.ts`:

```ts
import { getDb } from './database';
import { Note } from '../models/note';

type Row = {
  id: number;
  title: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  updated_at: number;
  sync_status: 'PENDING' | 'SYNCED';
};

const dariRow = (r: Row): Note => ({
  id: r.id,
  title: r.title,
  content: r.content,
  latitude: r.latitude,
  longitude: r.longitude,
  updatedAt: r.updated_at,
  syncStatus: r.sync_status,
});

export async function semuaCatatan(): Promise<Note[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>('SELECT * FROM notes ORDER BY updated_at DESC');
  return rows.map(dariRow);
}

export async function simpanCatatan(n: Note): Promise<void> {
  const db = await getDb();
  if (n.id == null) {
    await db.runAsync(
      'INSERT INTO notes (title, content, latitude, longitude, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?)',
      [n.title, n.content, n.latitude, n.longitude, n.updatedAt, n.syncStatus],
    );
  } else {
    await db.runAsync(
      "UPDATE notes SET title = ?, content = ?, latitude = ?, longitude = ?, updated_at = ?, sync_status = 'PENDING' WHERE id = ?",
      [n.title, n.content, n.latitude, n.longitude, Date.now(), n.id],
    );
  }
}

export async function hapusCatatan(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
}
```

Halaman tidak menulis SQL sendiri. Semua akses data lewat tiga fungsi ini, dan parameter selalu memakai tanda tanya (`?`) agar aman dari SQL injection.

---

## Step 8: Halaman Catatan dan Form (11.30)

Buat file `app/notes.tsx`:

```tsx
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { Tombol } from '../src/components/Tombol';
import { hapusCatatan, semuaCatatan } from '../src/data/noteRepository';
import { Note } from '../src/models/note';
import { gaya } from '../src/ui';

export default function Catatan() {
  const router = useRouter();
  const [data, setData] = useState<Note[]>([]);

  const muat = useCallback(async () => setData(await semuaCatatan()), []);
  useFocusEffect(useCallback(() => { muat(); }, [muat]));

  const hapus = (n: Note) =>
    Alert.alert('Hapus catatan?', n.title, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: async () => { await hapusCatatan(n.id!); muat(); } },
    ]);

  return (
    <View style={gaya.layar}>
      <Tombol label="Tambah Catatan" onPress={() => router.push('/note-form')} />
      <FlatList
        data={data}
        keyExtractor={(n) => String(n.id)}
        ListEmptyComponent={<Text style={gaya.abu}>Belum ada catatan.</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={gaya.kartu}
            onPress={() => router.push({ pathname: '/note-form', params: { id: String(item.id) } })}
            onLongPress={() => hapus(item)}
          >
            <Text style={gaya.judul}>{item.title}</Text>
            <Text style={gaya.teks} numberOfLines={2}>{item.content}</Text>
            <Text style={gaya.abu}>Status sinkron: {item.syncStatus} · tahan lama untuk menghapus</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
```

Buat file `app/note-form.tsx`:

```tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Tombol } from '../src/components/Tombol';
import { semuaCatatan, simpanCatatan } from '../src/data/noteRepository';
import { Note, noteBaru, validasiJudul } from '../src/models/note';
import { gaya } from '../src/ui';

export default function FormCatatan() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [lama, setLama] = useState<Note | null>(null);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    semuaCatatan().then((semua) => {
      const n = semua.find((x) => String(x.id) === id);
      if (n) { setLama(n); setJudul(n.title); setIsi(n.content); }
    });
  }, [id]);

  const simpan = async () => {
    const pesan = validasiJudul(judul);
    if (pesan) return setError(pesan);
    const n = lama
      ? { ...lama, title: judul.trim(), content: isi.trim() }
      : noteBaru(judul.trim(), isi.trim());
    await simpanCatatan(n);
    router.back();
  };

  return (
    <View style={gaya.layar}>
      <TextInput testID="input-judul" style={gaya.input} placeholder="Judul" value={judul} onChangeText={(t) => { setJudul(t); setError(null); }} />
      <TextInput testID="input-isi" style={[gaya.input, { height: 140, textAlignVertical: 'top' }]} placeholder="Isi catatan" multiline value={isi} onChangeText={setIsi} />
      {error && <Text style={gaya.error}>{error}</Text>}
      <Tombol label="Simpan" onPress={simpan} testID="tombol-simpan" />
    </View>
  );
}
```

Uji: tambah catatan, tutup aplikasi sepenuhnya, lalu buka lagi. Catatan harus tetap ada karena tersimpan di SQLite. Tahan lama sebuah catatan untuk menghapusnya.

---

## Step 9: Layanan Lokasi dan Jarak (13.00)

Buat file `src/services/distance.ts`:

```ts
const JARI_JARI_BUMI_METER = 6371000;
const keRadian = (derajat: number) => (derajat * Math.PI) / 180;

/** Jarak lingkaran besar (Haversine) antara dua koordinat, dalam meter. */
export function jarakMeter(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = keRadian(lat2 - lat1);
  const dLon = keRadian(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(keRadian(lat1)) * Math.cos(keRadian(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * JARI_JARI_BUMI_METER * Math.asin(Math.sqrt(a));
}
```

Buat file `src/services/locationService.ts`:

```ts
import * as Location from 'expo-location';

export type Posisi = { latitude: number; longitude: number; akurasi: number | null };

/** Meminta izin saat aplikasi dipakai, lalu membaca posisi sekarang. */
export async function posisiSekarang(): Promise<Posisi> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Izin lokasi ditolak.');
  if (!(await Location.hasServicesEnabledAsync())) throw new Error('Aktifkan GPS terlebih dahulu.');
  const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  return { latitude: p.coords.latitude, longitude: p.coords.longitude, akurasi: p.coords.accuracy };
}

export async function alamatDari(latitude: number, longitude: number): Promise<string> {
  const hasil = await Location.reverseGeocodeAsync({ latitude, longitude });
  const a = hasil[0];
  if (!a) return 'Alamat tidak ditemukan';
  return [a.street, a.district, a.city, a.region].filter(Boolean).join(', ');
}
```

Aplikasi meminta izin lokasi saat tombol ditekan, bukan saat aplikasi dibuka. Itu prinsip izin sesuai kebutuhan.

---

## Step 10: Peta dan Halaman Lokasi (14.00)

Buat file `src/services/petaHtml.ts`:

```ts
export type TitikPeta = { latitude: number; longitude: number; judul?: string };

/** HTML peta OpenStreetMap (Leaflet) yang dimuat di WebView, tanpa API key. */
export function buatHtmlPeta({ latitude, longitude, judul }: TitikPeta): string {
  const teks = JSON.stringify(judul ?? 'Posisi Anda');
  return `<!doctype html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>html,body,#m{height:100%;margin:0}</style></head><body><div id="m"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
var map = L.map('m').setView([${latitude}, ${longitude}], 16);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
L.marker([${latitude}, ${longitude}]).addTo(map).bindPopup(${teks}).openPopup();
</script></body></html>`;
}
```

Buat file `src/components/LeafletMap.tsx`:

```tsx
import { WebView } from 'react-native-webview';
import { buatHtmlPeta, TitikPeta } from '../services/petaHtml';

export function LeafletMap(props: TitikPeta) {
  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: buatHtmlPeta(props) }}
      style={{ flex: 1, minHeight: 280 }}
    />
  );
}
```

Buat file `app/location.tsx`:

```tsx
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LeafletMap } from '../src/components/LeafletMap';
import { Tombol } from '../src/components/Tombol';
import { jarakMeter } from '../src/services/distance';
import { alamatDari, Posisi, posisiSekarang } from '../src/services/locationService';
import { gaya } from '../src/ui';

// Titik acuan: Graha Pos Bandung (perkiraan)
const ACUAN = { latitude: -6.9175, longitude: 107.6107 };

export default function Lokasi() {
  const [pos, setPos] = useState<Posisi | null>(null);
  const [alamat, setAlamat] = useState('');
  const [error, setError] = useState<string | null>(null);

  const ambil = async () => {
    try {
      setError(null);
      const p = await posisiSekarang();
      setPos(p);
      setAlamat(await alamatDari(p.latitude, p.longitude).catch(() => 'Alamat tidak tersedia'));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <ScrollView style={gaya.layar}>
      <Tombol label="Ambil Posisi Saya" onPress={ambil} />
      {error && <Text style={gaya.error}>{error}</Text>}
      {pos && (
        <View>
          <View style={gaya.kartu}>
            <Text style={gaya.teks}>Lat: {pos.latitude.toFixed(5)}, Lon: {pos.longitude.toFixed(5)}</Text>
            <Text style={gaya.abu}>Akurasi: {pos.akurasi?.toFixed(0) ?? '-'} m</Text>
            <Text style={gaya.teks}>Alamat: {alamat}</Text>
            <Text style={gaya.teks}>
              Jarak ke titik acuan: {(jarakMeter(pos.latitude, pos.longitude, ACUAN.latitude, ACUAN.longitude) / 1000).toFixed(2)} km
            </Text>
          </View>
          <View style={{ height: 320 }}>
            <LeafletMap latitude={pos.latitude} longitude={pos.longitude} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}
```

Peta memakai OpenStreetMap lewat Leaflet di dalam `WebView`, sehingga tidak perlu API key. Ubah `ACUAN` bila ingin jarak ke tempat lain.

---

## Step 11: Pengujian Hari 1 (14.30)

Buat file `__tests__/distance.test.ts`:

```ts
import { jarakMeter } from '../src/services/distance';

describe('jarakMeter (Haversine)', () => {
  it('bernilai 0 untuk titik yang sama', () => {
    expect(jarakMeter(-6.9, 107.6, -6.9, 107.6)).toBeCloseTo(0, 5);
  });
  it('Bandung ke Jakarta sekitar 116 km', () => {
    const km = jarakMeter(-6.9175, 107.6191, -6.2088, 106.8456) / 1000;
    expect(km).toBeGreaterThan(110);
    expect(km).toBeLessThan(125);
  });
  it('simetris', () => {
    expect(jarakMeter(0, 0, 1, 1)).toBeCloseTo(jarakMeter(1, 1, 0, 0), 6);
  });
});
```

Buat file `__tests__/note.test.ts`:

```ts
import { noteBaru, validasiJudul } from '../src/models/note';

describe('catatan', () => {
  it('judul kosong atau spasi ditolak', () => {
    expect(validasiJudul('')).toBe('Judul wajib diisi.');
    expect(validasiJudul('   ')).toBe('Judul wajib diisi.');
  });
  it('judul lebih dari 100 karakter ditolak', () => {
    expect(validasiJudul('a'.repeat(101))).toBe('Judul maksimal 100 karakter.');
  });
  it('judul normal diterima', () => expect(validasiJudul('Belanja')).toBeNull());
  it('catatan baru berstatus PENDING', () => {
    const n = noteBaru('a', 'b');
    expect(n.syncStatus).toBe('PENDING');
    expect(n.id).toBeUndefined();
  });
});
```

Buat file `__tests__/map.test.ts`:

```ts
import { buatHtmlPeta } from '../src/services/petaHtml';

it('HTML peta memuat koordinat dan tile OpenStreetMap', () => {
  const h = buatHtmlPeta({ latitude: -6.9, longitude: 107.6, judul: 'Tes' });
  expect(h).toContain('[-6.9, 107.6]');
  expect(h).toContain('tile.openstreetmap.org');
});
```

Jalankan pengujian:

```bash
npm test
npm run typecheck
```

Semua pengujian harus lulus dan `tsc` tidak menampilkan error.

---

## Latihan Mandiri (15.00)

1. Tambahkan tombol **Simpan lokasi** pada form catatan, isi `latitude` dan `longitude` dari `posisiSekarang()`.
2. Tampilkan jarak dari posisi pengguna pada setiap kartu catatan yang punya koordinat.
3. Tambahkan pencarian judul pada halaman catatan dengan `TextInput` dan `filter`.
4. Tulis satu pengujian tambahan untuk `validasiJudul` dengan judul tepat 100 karakter.

---

## Ringkasan File

| File | Fungsi |
|---|---|
| `app.json`, `tsconfig.json` | Konfigurasi aplikasi dan TypeScript |
| `app/_layout.tsx`, `app/index.tsx` | Navigasi dan beranda |
| `src/models/note.ts` | Tipe catatan dan validasi |
| `src/data/database.ts`, `src/data/noteRepository.ts` | SQLite dan akses data |
| `app/notes.tsx`, `app/note-form.tsx` | Daftar dan form catatan |
| `src/services/distance.ts`, `src/services/locationService.ts` | Jarak Haversine dan GPS |
| `src/services/petaHtml.ts`, `src/components/LeafletMap.tsx`, `app/location.tsx` | Peta dan halaman lokasi |
| `__tests__/*.test.ts` | Pengujian otomatis |
