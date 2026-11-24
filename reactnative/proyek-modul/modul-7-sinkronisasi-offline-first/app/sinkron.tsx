import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { catatanPending, simpanDariServer, tandaiSynced } from '../src/data/catatanRepository';
import { AKUN_LATIHAN, API_URL } from '../src/config';
import { buatApiClient } from '../src/services/apiClient';
import { pesanRamah } from '../src/services/pesanError';
import { sinkronkan } from '../src/services/sync';
import { bacaToken, hapusToken, simpanToken } from '../src/services/secureStorage';

export default function Sinkron() {
  const api = useMemo(() => buatApiClient(API_URL), []);
  const [email, setEmail] = useState(AKUN_LATIHAN.email);
  const [password, setPassword] = useState(AKUN_LATIHAN.password);
  const [token, setToken] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const catat = (t: string) => setLog((l) => [t, ...l].slice(0, 6));

  // Token dibaca dari penyimpanan aman saat layar dibuka.
  useEffect(() => {
    bacaToken().then(setToken).catch(() => setToken(null));
  }, []);

  const masuk = async () => {
    try {
      const t = await api.login(email, password);
      await simpanToken(t); // disimpan di penyimpanan aman, bukan di SQLite
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
      const h = await sinkronkan({ catatanPending, tandaiSynced, simpanDariServer }, api, token);
      catat(`Selesai: terkirim ${h.terkirim}, diterima ${h.diterima}, gagal ${h.gagal}.`);
    } catch (e) {
      catat(`Sinkron gagal: ${pesanRamah(e)}`);
    }
  };

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <View style={styles.kartu}>
        <Text style={styles.judul}>Server latihan</Text>
        <Text style={styles.abu}>{token ? 'Sudah masuk.' : 'Belum masuk.'}</Text>
        {!token && (
          <>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="Email" />
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Kata sandi" />
            <Pressable style={styles.tombol} onPress={masuk} accessibilityRole="button">
              <Text style={styles.tombolTeks}>Masuk</Text>
            </Pressable>
          </>
        )}
        {token && (
          <>
            <Pressable style={styles.tombol} onPress={sinkron} accessibilityRole="button">
              <Text style={styles.tombolTeks}>Sinkronkan sekarang</Text>
            </Pressable>
            <Pressable style={styles.tombolSekunder} onPress={keluar} accessibilityRole="button">
              <Text style={styles.tombolSekunderTeks}>Keluar</Text>
            </Pressable>
          </>
        )}
      </View>
      <View style={styles.kartu}>
        <Text style={styles.judul}>Log</Text>
        {log.length === 0 && <Text style={styles.abu}>Belum ada aktivitas.</Text>}
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
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  isi: { padding: 16, gap: 12 },
  kartu: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 8, borderWidth: 1, borderColor: '#cfd6e0' },
  judul: { fontSize: 16, fontWeight: '700', color: '#1b1f27' },
  abu: { color: '#5f6b7a' },
  teks: { color: '#1b1f27' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cfd6e0', borderRadius: 10, paddingHorizontal: 12, minHeight: 48 },
  tombol: { backgroundColor: '#1565c0', borderRadius: 10, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  tombolTeks: { color: '#fff', fontWeight: '600' },
  tombolSekunder: { borderRadius: 10, minHeight: 48, borderWidth: 1, borderColor: '#1565c0', alignItems: 'center', justifyContent: 'center' },
  tombolSekunderTeks: { color: '#1565c0', fontWeight: '600' },
});
