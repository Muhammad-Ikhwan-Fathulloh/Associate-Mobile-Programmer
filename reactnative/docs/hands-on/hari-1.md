# Hands-On Hari 1: Environment, Desain Figma dan Stitch, SQLite, dan GPS

Panduan ini membangun aplikasi `associate-mobile-app` dari awal dengan **Expo dan TypeScript**. Setiap step menampilkan kode lengkap untuk file yang dibuat atau diubah, sehingga peserta dapat mengetik kode sendiri sambil mengikuti langkahnya.

**Waktu:** 09.00 to 17.00 (istirahat 12.00 to 13.00)

**Perangkat:** laptop dengan Node.js LTS, VS Code, dan ponsel Android dengan aplikasi Expo Go (atau emulator Android dari Android Studio).

---

## Step 0: Instalasi Platform, Emulator, dan Environment (09.00)

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

## Step 1: Buat Proyek dan Konfigurasi Dependensi (09.20)

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

## Step 2: Konfigurasi Aplikasi dan TypeScript (09.40)

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

## Step 3: Desain di Figma dan Stitch, Token, Tema, dan Navigasi (10.00)

### 3a. Rancang di Stitch (opsional) dan Figma

1. Buka https://stitch.withgoogle.com dan tulis prompt, misalnya: *"Aplikasi catatan dengan lokasi GPS. Lima layar: Beranda, Catatan, Form Catatan, Lokasi, Sinkronisasi. Gaya bersih, warna utama biru, tombol besar."* Perbaiki lewat chat sampai sesuai. Fitur Stitch berubah cepat, jadi ikuti tampilan terbaru.
2. Salin atau ekspor hasilnya ke Figma sebagai layer yang bisa diedit, lalu rapikan dengan **Auto Layout**.
3. Buka berkas contoh pelatihan: https://www.figma.com/design/grYqOsULGfzYsDrtIjmjRL (5 layar dan 20 variable). Duplikat berkas itu ke akun Anda dan jelajahi panel **Variables**: koleksi `Warna`, `Spasi`, `Radius`, dan `Font`.
4. Bandingkan beberapa gaya (Material, iOS, minimal, gelap) dengan mengubah `warna/utama`, `radius/sm`, dan `font/isi`. Lihat semua layar ikut berubah.

### 3b. Pindahkan token ke kode

Setiap variable Figma punya padanan di `src/theme.ts` (nama sama: `warna/utama` menjadi `tema.warna.utama`). Komponen memakai `tema`, bukan angka langsung.

Buat folder `src/components` dan `app` bila belum ada.

Buat file `src/theme.ts`:

```ts
// Design token: satu sumber nilai gaya. Nilainya berasal dari variables di Figma.
export const tema = {
  warna: {
    utama: '#1565c0',
    latar: '#f5f7fb',
    kartu: '#ffffff',
    teks: '#1b1f27',
    abu: '#5f6b7a',
    garis: '#cfd6e0',
    bahaya: '#c62828',
    ok: '#2e7d32',
  },
  spasi: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  radius: { sm: 8, md: 12, lg: 20 },
  font: { kecil: 13, isi: 15, judul: 18, besar: 24 },
  // Target sentuh minimal yang disarankan pedoman desain: sekitar 48 dp
  tinggiTombol: 48,
} as const;
```

Buat file `src/ui.ts`:

```ts
import { StyleSheet } from 'react-native';
import { tema } from './theme';

export const warna = tema.warna;

export const gaya = StyleSheet.create({
  layar: { flex: 1, backgroundColor: tema.warna.latar, padding: tema.spasi.lg },
  kartu: { backgroundColor: tema.warna.kartu, borderRadius: tema.radius.md, padding: 14, marginBottom: tema.spasi.md, elevation: 1 },
  judul: { fontSize: tema.font.judul, fontWeight: '700', color: tema.warna.teks },
  teks: { fontSize: tema.font.isi, color: tema.warna.teks, marginTop: tema.spasi.xs },
  abu: { fontSize: tema.font.kecil, color: tema.warna.abu, marginTop: tema.spasi.xs },
  input: { backgroundColor: tema.warna.kartu, borderWidth: 1, borderColor: tema.warna.garis, borderRadius: tema.radius.sm, padding: 10, marginBottom: 10, fontSize: tema.font.isi },
  tombol: { backgroundColor: tema.warna.utama, borderRadius: tema.radius.sm, minHeight: tema.tinggiTombol, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  tombolTeks: { color: '#fff', fontWeight: '700', fontSize: tema.font.isi },
  error: { color: tema.warna.bahaya, marginBottom: tema.spasi.sm },
});
```

Buat file `src/menu.ts`:

```ts
export const MENU = [
  { href: '/notes', judul: 'Catatan', ket: 'SQLite: tambah, ubah, hapus, simpan lokasi GPS (Modul 3 dan 4)' },
  { href: '/location', judul: 'Lokasi dan Peta', ket: 'GPS, jarak, peta OpenStreetMap (Modul 4)' },
  { href: '/network', judul: 'Jaringan Seluler', ket: 'Status koneksi dan jenis jaringan (Modul 7)' },
  { href: '/sinkron', judul: 'API dan Sinkronisasi', ket: 'Login, kirim dan ambil catatan dari server (Modul 5 dan 7)' },
  { href: '/sensor', judul: 'Sensor', ket: 'Akselerometer, giroskop, kompas, deteksi guncangan (Modul 6)' },
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
      <Stack.Screen name="sinkron" options={{ title: 'API dan Sinkronisasi' }} />
      <Stack.Screen name="sensor" options={{ title: 'Sensor' }} />
      <Stack.Screen name="device" options={{ title: 'Info Perangkat' }} />
      <Stack.Screen name="keamanan" options={{ title: 'Keamanan' }} />
    </Stack>
  );
}
```

Di expo-router, setiap file di folder `app/` otomatis menjadi satu halaman, dan `_layout.tsx` mengatur bingkai navigasinya.

---

## Step 4: Halaman Beranda dan Menerapkan Gaya dengan AI (11.00)

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

### Menerapkan gaya baru dengan AI

Gunakan asisten AI (misalnya Claude atau Gemini) untuk menerapkan gaya dari Figma. Contoh prompt berkonteks:

```text
Konteks: aplikasi Expo + TypeScript. Warna, spasi, radius, dan font ada di src/theme.ts,
gaya komponen dibuat dari tema di src/ui.ts. Saya lampirkan tangkapan layar Figma.
Tujuan: ubah gaya menjadi tema gelap. Ubah HANYA src/theme.ts dan src/ui.ts,
jangan ubah logika. Jaga kontras teks dan target sentuh tombol minimal 48.
Berikan perubahan sebagai diff dan jelaskan alasannya.
```

Setelah AI mengubah kode: jalankan `npm run typecheck`, lihat hasilnya di ponsel, dan **tinjau diff** sebelum menerima. Jangan menempelkan token atau kata sandi ke alat AI.

---

## Step 5: Model Data Catatan (13.00)

Buat file `src/models/note.ts`:

```ts
export type Note = {
  id?: number;
  serverId?: number | null;
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
  return { title, content, latitude, longitude, serverId: null, updatedAt: Date.now(), syncStatus: 'PENDING' };
}

/** Mengembalikan pesan error jika judul tidak valid, atau null jika valid. */
export function validasiJudul(judul: string): string | null {
  if (judul.trim().length === 0) return 'Judul wajib diisi.';
  if (judul.trim().length > 100) return 'Judul maksimal 100 karakter.';
  return null;
}

/** Teks koordinat untuk ditampilkan, atau null bila catatan tidak punya lokasi. */
export function formatKoordinat(n: Pick<Note, 'latitude' | 'longitude'>): string | null {
  if (n.latitude == null || n.longitude == null) return null;
  return `${n.latitude.toFixed(5)}, ${n.longitude.toFixed(5)}`;
}
```

`validasiJudul` adalah fungsi murni sehingga mudah diuji tanpa perangkat.

---

## Step 6: Database SQLite (13.20)

**SQLite atau MySQL?** SQLite adalah berkas di ponsel tanpa server, cocok untuk penyimpanan lokal dan tetap jalan offline. MySQL adalah basis data server untuk banyak pengguna. Aplikasi mobile **tidak boleh terhubung langsung ke MySQL** (kata sandi basis data ikut di aplikasi dan port basis data terbuka ke internet). Jalurnya: ponsel, lalu API, lalu MySQL. Hari 2 membahas API-nya; skema MySQL contoh ada di `shared/server/schema.sql`.

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
          sync_status TEXT NOT NULL DEFAULT 'PENDING',
          server_id INTEGER
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

## Step 7: Repository (13.50)

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
  server_id: number | null;
};

const dariRow = (r: Row): Note => ({
  id: r.id,
  serverId: r.server_id,
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

/** Catatan yang belum dikirim ke server. */
export async function catatanPending(): Promise<Note[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>("SELECT * FROM notes WHERE sync_status = 'PENDING'");
  return rows.map(dariRow);
}

export async function tandaiSynced(id: number, serverId: number): Promise<void> {
  const db = await getDb();
  await db.runAsync("UPDATE notes SET sync_status = 'SYNCED', server_id = ? WHERE id = ?", [serverId, id]);
}

/** Menyimpan catatan yang berasal dari server sebagai SYNCED, bila belum ada di lokal. */
export async function simpanDariServer(n: Note & { serverId: number }): Promise<void> {
  const db = await getDb();
  const ada = await db.getFirstAsync<{ id: number }>('SELECT id FROM notes WHERE server_id = ?', [n.serverId]);
  if (ada) return;
  await db.runAsync(
    "INSERT INTO notes (title, content, latitude, longitude, updated_at, sync_status, server_id) VALUES (?, ?, ?, ?, ?, 'SYNCED', ?)",
    [n.title, n.content, n.latitude, n.longitude, n.updatedAt, n.serverId],
  );
}
```

Halaman tidak menulis SQL sendiri. Semua akses data lewat tiga fungsi ini, dan parameter selalu memakai tanda tanya (`?`) agar aman dari SQL injection.

---

## Step 8: Halaman Catatan dan Form (14.20)

Buat file `app/notes.tsx`:

```tsx
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { Tombol } from '../src/components/Tombol';
import { hapusCatatan, semuaCatatan } from '../src/data/noteRepository';
import { formatKoordinat, Note } from '../src/models/note';
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
            {formatKoordinat(item) && <Text style={gaya.abu}>Lokasi: {formatKoordinat(item)}</Text>}
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
import { formatKoordinat, Note, noteBaru, validasiJudul } from '../src/models/note';
import { posisiSekarang } from '../src/services/locationService';
import { gaya } from '../src/ui';

export default function FormCatatan() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [lama, setLama] = useState<Note | null>(null);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [lokasi, setLokasi] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    semuaCatatan().then((semua) => {
      const n = semua.find((x) => String(x.id) === id);
      if (n) {
        setLama(n);
        setJudul(n.title);
        setIsi(n.content);
        if (n.latitude != null && n.longitude != null) setLokasi({ latitude: n.latitude, longitude: n.longitude });
      }
    });
  }, [id]);

  const ambilLokasi = async () => {
    try {
      setError(null);
      const p = await posisiSekarang();
      setLokasi({ latitude: p.latitude, longitude: p.longitude });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const simpan = async () => {
    const pesan = validasiJudul(judul);
    if (pesan) return setError(pesan);
    const lat = lokasi?.latitude ?? null;
    const lon = lokasi?.longitude ?? null;
    const n = lama
      ? { ...lama, title: judul.trim(), content: isi.trim(), latitude: lat, longitude: lon }
      : noteBaru(judul.trim(), isi.trim(), lat, lon);
    await simpanCatatan(n);
    router.back();
  };

  return (
    <View style={gaya.layar}>
      <TextInput testID="input-judul" style={gaya.input} placeholder="Judul" value={judul} onChangeText={(t) => { setJudul(t); setError(null); }} />
      <TextInput testID="input-isi" style={[gaya.input, { height: 140, textAlignVertical: 'top' }]} placeholder="Isi catatan" multiline value={isi} onChangeText={setIsi} />
      <Tombol label={lokasi ? 'Perbarui lokasi saya' : 'Sertakan lokasi saya (GPS)'} onPress={ambilLokasi} />
      {lokasi && <Text style={gaya.abu}>Lokasi tersimpan bersama catatan: {formatKoordinat(lokasi)}</Text>}
      {error && <Text style={gaya.error}>{error}</Text>}
      <Tombol label="Simpan" onPress={simpan} testID="tombol-simpan" />
    </View>
  );
}
```

Uji: tambah catatan, tutup aplikasi sepenuhnya, lalu buka lagi. Catatan harus tetap ada karena tersimpan di SQLite. Tahan lama sebuah catatan untuk menghapusnya.

---

## Step 9: Layanan Lokasi dan Jarak (15.00)

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

## Step 10: Peta dan Simpan GPS ke SQLite (15.40)

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

### Simpan GPS ke SQLite

`app/note-form.tsx` (dibuat pada Step 8) sudah memiliki tombol **Sertakan lokasi saya (GPS)**. Tombol memanggil `posisiSekarang()`, hasilnya disimpan di state `lokasi`, lalu `latitude` dan `longitude` masuk ke dua kolom tabel `notes` saat catatan disimpan. `app/notes.tsx` menampilkan koordinat memakai `formatKoordinat`.

Uji: buat catatan dengan lokasi, tutup aplikasi sepenuhnya, buka lagi, dan pastikan koordinat tetap tampil. Lalu tolak izin lokasi dan pastikan catatan tetap bisa disimpan tanpa koordinat.

---

## Step 11: Pengujian Hari 1 (16.30)

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

import { formatKoordinat } from '../src/models/note';

describe('formatKoordinat', () => {
  it('tanpa lokasi menghasilkan null', () => expect(formatKoordinat({ latitude: null, longitude: null })).toBeNull());
  it('lima angka di belakang koma', () => expect(formatKoordinat({ latitude: -6.9175, longitude: 107.6191 })).toBe('-6.91750, 107.61910'));
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

## Latihan Mandiri (16.45)

1. Tambahkan pesan khusus saat izin lokasi ditolak pada form catatan.
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
