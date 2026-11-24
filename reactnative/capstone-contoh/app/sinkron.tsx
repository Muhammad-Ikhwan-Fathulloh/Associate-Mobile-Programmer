import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { API_URL } from '../src/config';
import { entriPending, simpanDariServer, tandaiSynced } from '../src/data/entriRepository';
import { buatApiClient } from '../src/services/apiClient';
import { pesanRamah } from '../src/services/pesanError';
import { sinkronkan } from '../src/services/sync';

/** Sinkronisasi dengan MockAPI: kirim PENDING (POST atau PUT), lalu ambil daftar dari server. */
export default function Sinkron() {
  const api = useMemo(() => buatApiClient(API_URL), []);
  const [log, setLog] = useState<string[]>([]);
  const [sibuk, setSibuk] = useState(false);

  const catat = (t: string) => setLog((l) => [t, ...l].slice(0, 8));

  const sinkron = async () => {
    setSibuk(true);
    try {
      const h = await sinkronkan({ entriPending, tandaiSynced, simpanDariServer }, api);
      catat(`Selesai: terkirim ${h.terkirim}, diterima ${h.diterima}, gagal ${h.gagal}.`);
    } catch (e) {
      catat(`Sinkron gagal: ${pesanRamah(e)}`);
    } finally {
      setSibuk(false);
    }
  };

  return (
    <ScrollView style={styles.layar} contentContainerStyle={{ gap: 12 }}>
      <Text style={styles.teks}>Server: MockAPI (resource notes)</Text>
      <Pressable style={[styles.tombol, sibuk && { opacity: 0.6 }]} onPress={sinkron} disabled={sibuk}>
        <Text style={styles.tombolTeks}>{sibuk ? 'Menyinkronkan...' : 'Sinkronkan sekarang'}</Text>
      </Pressable>
      <View>
        {log.map((baris, i) => (
          <Text key={i} style={styles.teks}>
            • {baris}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb', padding: 16 },
  teks: { color: '#1b1f27', fontSize: 15 },
  tombol: { backgroundColor: '#1565c0', borderRadius: 10, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  tombolTeks: { color: '#fff', fontWeight: '600' },
});
