import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ambilSemua } from '../src/data/entriRepository';
import { Entri, KATEGORI } from '../src/models/entri';

export default function Beranda() {
  const router = useRouter();
  const [daftar, setDaftar] = useState<Entri[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  // Dibaca ulang setiap layar tampil, termasuk setelah entri disimpan.
  useFocusEffect(
    useCallback(() => {
      ambilSemua(filter ?? undefined).then(setDaftar);
    }, [filter]),
  );

  return (
    <View style={styles.layar}>
      <View style={styles.baris}>
        <Pressable style={styles.tombol} onPress={() => router.push('/form')} accessibilityRole="button">
          <Text style={styles.tombolTeks}>Entri baru</Text>
        </Pressable>
        <Pressable style={styles.tombolSekunder} onPress={() => router.push('/kompas')} accessibilityRole="button">
          <Text style={styles.tombolSekunderTeks}>Kompas</Text>
        </Pressable>
        <Pressable style={styles.tombolSekunder} onPress={() => router.push('/sinkron')} accessibilityRole="button">
          <Text style={styles.tombolSekunderTeks}>Sinkron</Text>
        </Pressable>
      </View>

      <View style={styles.baris}>
        {[null, ...KATEGORI].map((k) => (
          <Pressable
            key={k ?? 'semua'}
            onPress={() => setFilter(k)}
            style={[styles.chip, filter === k && styles.chipAktif]}
            accessibilityRole="button"
          >
            <Text style={filter === k ? styles.chipTeksAktif : styles.chipTeks}>{k ?? 'Semua'}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={daftar}
        keyExtractor={(e) => String(e.id)}
        ListEmptyComponent={<Text style={styles.abu}>Belum ada entri. Tambahkan perjalanan pertama.</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.kartu} onPress={() => router.push({ pathname: '/detail', params: { id: String(item.id) } })}>
            <Text style={styles.judul}>{item.judul}</Text>
            <Text style={styles.abu}>
              {item.kategori} · {item.latitude != null ? 'ada lokasi' : 'tanpa lokasi'} ·{' '}
              {item.status === 'SYNCED' ? 'SYNCED' : 'PENDING'}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb', padding: 12, gap: 8 },
  baris: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tombol: { backgroundColor: '#1565c0', borderRadius: 10, minHeight: 48, paddingHorizontal: 14, justifyContent: 'center' },
  tombolTeks: { color: '#fff', fontWeight: '600' },
  tombolSekunder: { borderColor: '#1565c0', borderWidth: 1, borderRadius: 10, minHeight: 48, paddingHorizontal: 14, justifyContent: 'center' },
  tombolSekunderTeks: { color: '#1565c0', fontWeight: '600' },
  chip: { borderWidth: 1, borderColor: '#cfd6e0', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff' },
  chipAktif: { backgroundColor: '#1565c0', borderColor: '#1565c0' },
  chipTeks: { color: '#1b1f27' },
  chipTeksAktif: { color: '#fff', fontWeight: '600' },
  kartu: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#cfd6e0', marginBottom: 8 },
  judul: { fontSize: 16, fontWeight: '700', color: '#1b1f27' },
  abu: { color: '#5f6b7a' },
});
