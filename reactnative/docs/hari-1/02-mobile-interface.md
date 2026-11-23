# Modul 2: Merancang Mobile Interface

**Durasi:** 10.00 to 12.00

**Unit kompetensi BNSP:** J.612000.007.01

## Tujuan Pembelajaran

1. Menyusun layar dari komponen dasar.
2. Menata tampilan dengan flexbox dan StyleSheet.
3. Membuat navigasi antarhalaman dengan expo-router.
4. Membuat form dengan validasi.

## 1. Langkah merancang antarmuka

- Kenali kebutuhan pengguna dan tugas utamanya.
- Daftar layar dan isi tiap layar, lalu buat **wireframe** (kertas atau Figma).
- Buat prototipe yang dapat diklik, uji ke pengguna, lalu implementasikan.
- Satu layar, satu tujuan utama. Aksi utama harus paling menonjol.

## 2. Komponen dasar

| Komponen | Fungsi |
|---|---|
| `View` | Wadah tata letak (seperti div) |
| `Text` | Menampilkan teks |
| `Pressable` | Area yang dapat diketuk |
| `TextInput` | Kolom isian |
| `FlatList` | Daftar panjang yang efisien |
| `ScrollView` | Konten yang bisa digulir |

## 3. Flexbox dan gaya

- `flex: 1` membuat elemen mengisi ruang yang tersedia.
- `flexDirection` (default `column`) mengatur arah susunan anak.
- `padding` di dalam, `margin` di luar. Satuan dalam dp (tanpa tulisan px).
- `StyleSheet.create` mengumpulkan gaya di satu tempat.

## 4. Navigasi expo-router

Nama file di `app/` menjadi alamat halaman. `Stack` menambahkan tombol kembali. Berkas `app/_layout.tsx`:

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

## 5. Form dan validasi

State `judul`, `isi`, `error`. Validasi dilakukan sebelum menyimpan. Berkas `app/note-form.tsx`:

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

## Latihan

1. Tambahkan menu baru pada `src/menu.ts` yang menuju halaman kosong.
2. Ubah warna utama pada `src/ui.ts` dan amati semua halaman.
3. Tambahkan batas 500 karakter pada isi catatan beserta pesan error.

## Peta Kompetensi BNSP

Unit **J.612000.007.01**. Elemen yang dinilai:

- Menentukan alat perancangan antarmuka
- Memilih informasi yang ditampilkan per layar
- Membuat aksi dan desain estetis per layar

Bukti pada pelatihan ini: `app/index.tsx`, `app/note-form.tsx`, `src/ui.ts`, navigasi `app/_layout.tsx`.

Praktik langkah demi langkah: [hands-on Hari 1, Step 3, 4, dan 8](../hands-on/hari-1.md).
