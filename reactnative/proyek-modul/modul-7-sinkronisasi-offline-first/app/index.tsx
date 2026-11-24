import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ambilSemua, tambahCatatan } from '../src/data/catatanRepository';
import { Catatan } from '../src/models/catatan';

export default function Beranda() {
  const router = useRouter();
  const [daftar, setDaftar] = useState<Catatan[]>([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [pesan, setPesan] = useState<string | null>(null);

  // Data dibaca dari SQLite setiap layar tampil. Internet tidak diperlukan di sini.
  useFocusEffect(
    useCallback(() => {
      ambilSemua().then(setDaftar).catch((e) => setPesan(`Gagal memuat: ${(e as Error).message}`));
    }, []),
  );

  const simpan = async () => {
    if (judul.trim() === '') return setPesan('Judul wajib diisi.');
    await tambahCatatan(judul, isi);
    setJudul('');
    setIsi('');
    setPesan(null);
    setDaftar(await ambilSemua());
  };

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <View style={styles.kartu}>
        <TextInput style={styles.input} value={judul} onChangeText={setJudul} placeholder="Judul" maxLength={100} />
        <TextInput style={[styles.input, { minHeight: 72 }]} value={isi} onChangeText={setIsi} placeholder="Isi" multiline />
        {pesan && <Text style={styles.galat}>{pesan}</Text>}
        <Pressable style={styles.tombol} onPress={simpan} accessibilityRole="button">
          <Text style={styles.tombolTeks}>Simpan offline</Text>
        </Pressable>
      </View>

      <Pressable style={styles.tombolSekunder} onPress={() => router.push('/sinkron')} accessibilityRole="button">
        <Text style={styles.tombolSekunderTeks}>Masuk dan sinkronkan</Text>
      </Pressable>

      {daftar.map((c) => (
        <View key={c.id} style={styles.kartu}>
          <View style={styles.barisJudul}>
            <Text style={styles.judul}>{c.title}</Text>
            <Text style={[styles.badge, c.syncStatus === 'SYNCED' ? styles.badgeOk : styles.badgeTunggu]}>
              {c.syncStatus}
            </Text>
          </View>
          <Text style={styles.abu}>{c.content || '(tanpa isi)'}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  isi: { padding: 16, gap: 12 },
  kartu: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 8, borderWidth: 1, borderColor: '#cfd6e0' },
  barisJudul: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  judul: { fontSize: 16, fontWeight: '700', color: '#1b1f27', flexShrink: 1 },
  abu: { color: '#5f6b7a' },
  galat: { color: '#c62828' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cfd6e0', borderRadius: 10, paddingHorizontal: 12, minHeight: 48 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', fontWeight: '700', fontSize: 12 },
  badgeOk: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
  badgeTunggu: { backgroundColor: '#fff8e1', color: '#8d6e00' },
  tombol: { backgroundColor: '#1565c0', borderRadius: 10, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  tombolTeks: { color: '#fff', fontWeight: '600' },
  tombolSekunder: { borderRadius: 10, minHeight: 48, borderWidth: 1, borderColor: '#1565c0', alignItems: 'center', justifyContent: 'center' },
  tombolSekunderTeks: { color: '#1565c0', fontWeight: '600' },
});
