import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AKUN_LATIHAN, API_URL } from '../src/config';
import { entriPending, simpanDariServer, tandaiSynced } from '../src/data/entriRepository';
import { buatApiClient } from '../src/services/apiClient';
import { pesanRamah } from '../src/services/pesanError';
import { bacaToken, hapusToken, simpanToken } from '../src/services/secureStorage';
import { sinkronkan } from '../src/services/sync';

export default function Sinkron() {
  const api = useMemo(() => buatApiClient(API_URL), []);
  const [token, setToken] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  // Token dibaca dari penyimpanan aman, bukan dari SQLite.
  useEffect(() => {
    bacaToken().then(setToken).catch(() => setToken(null));
  }, []);

  const catat = (t: string) => setLog((l) => [t, ...l].slice(0, 8));

  const masuk = async () => {
    try {
      const t = await api.login(AKUN_LATIHAN.email, AKUN_LATIHAN.password);
      await simpanToken(t);
      setToken(t);
      catat('Login berhasil. Token disimpan di penyimpanan aman.');
    } catch (e) {
      catat(`Login gagal: ${pesanRamah(e)}`);
    }
  };

  const keluar = async () => {
    await hapusToken();
    setToken(null);
    catat('Token dihapus dari perangkat.');
  };

  const sinkron = async () => {
    if (!token) return catat('Masuk dahulu.');
    try {
      const h = await sinkronkan({ entriPending, tandaiSynced, simpanDariServer }, api, token);
      catat(`Selesai: terkirim ${h.terkirim}, diterima ${h.diterima}, gagal ${h.gagal}.`);
    } catch (e) {
      catat(`Sinkron gagal: ${pesanRamah(e)}`);
    }
  };

  return (
    <ScrollView style={styles.layar} contentContainerStyle={{ gap: 12 }}>
      <Text style={styles.teks}>{token ? 'Sudah masuk ke server latihan.' : 'Belum masuk.'}</Text>
      {token ? (
        <>
          <Pressable style={styles.tombol} onPress={sinkron}>
            <Text style={styles.tombolTeks}>Sinkronkan sekarang</Text>
          </Pressable>
          <Pressable style={styles.tombolSekunder} onPress={keluar}>
            <Text style={styles.tombolSekunderTeks}>Keluar</Text>
          </Pressable>
        </>
      ) : (
        <Pressable style={styles.tombol} onPress={masuk}>
          <Text style={styles.tombolTeks}>Masuk ke server latihan</Text>
        </Pressable>
      )}
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
  tombolSekunder: { borderRadius: 10, minHeight: 48, borderWidth: 1, borderColor: '#1565c0', alignItems: 'center', justifyContent: 'center' },
  tombolSekunderTeks: { color: '#1565c0', fontWeight: '600' },
});
