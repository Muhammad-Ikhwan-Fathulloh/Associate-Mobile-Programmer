import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AKUN_LATIHAN, API_URL } from '../src/config';
import { buatApiClient, CatatanServer } from '../src/services/apiClient';
import { pesanRamah } from '../src/services/pesanError';

export default function KlienCatatan() {
  const api = useMemo(() => buatApiClient(API_URL), []);
  const [email, setEmail] = useState(AKUN_LATIHAN.email);
  const [password, setPassword] = useState(AKUN_LATIHAN.password);
  const [token, setToken] = useState<string | null>(null);
  const [catatan, setCatatan] = useState<CatatanServer[]>([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [memuat, setMemuat] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);

  // Menjalankan aksi jaringan dengan indikator memuat dan pesan galat yang ramah.
  const jalankan = async (aksi: () => Promise<void>) => {
    setMemuat(true);
    setPesan(null);
    try {
      await aksi();
    } catch (e) {
      setPesan(pesanRamah(e));
    } finally {
      setMemuat(false);
    }
  };

  const masuk = () =>
    jalankan(async () => {
      const t = await api.login(email, password);
      setToken(t);
      setCatatan(await api.daftarCatatan(t));
    });

  const muatUlang = () => jalankan(async () => setCatatan(await api.daftarCatatan(token!)));

  const kirim = () =>
    jalankan(async () => {
      const baru = await api.buatCatatan(token!, { title: judul, content: isi });
      setCatatan((c) => [baru, ...c]);
      setJudul('');
      setIsi('');
    });

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      {!token ? (
        <View style={styles.kartu}>
          <Text style={styles.judul}>Masuk ke server latihan</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="Email" />
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Kata sandi" />
          <Pressable style={styles.tombol} onPress={masuk} disabled={memuat} accessibilityRole="button">
            <Text style={styles.tombolTeks}>Masuk</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.kartu}>
            <Text style={styles.judul}>Catatan baru</Text>
            <TextInput style={styles.input} value={judul} onChangeText={setJudul} placeholder="Judul (wajib)" maxLength={100} />
            <TextInput style={[styles.input, { minHeight: 80 }]} value={isi} onChangeText={setIsi} placeholder="Isi" multiline />
            <Pressable style={styles.tombol} onPress={kirim} disabled={memuat} accessibilityRole="button">
              <Text style={styles.tombolTeks}>Kirim ke server</Text>
            </Pressable>
          </View>
          <Pressable style={styles.tombolSekunder} onPress={muatUlang} disabled={memuat} accessibilityRole="button">
            <Text style={styles.tombolSekunderTeks}>Muat ulang daftar</Text>
          </Pressable>
        </>
      )}

      {memuat && <ActivityIndicator color="#1565c0" />}
      {pesan && <Text style={styles.galat}>{pesan}</Text>}

      {catatan.map((c) => (
        <View key={c.id} style={styles.kartu}>
          <Text style={styles.judul}>{c.title}</Text>
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
  judul: { fontSize: 16, fontWeight: '700', color: '#1b1f27' },
  abu: { color: '#5f6b7a' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cfd6e0', borderRadius: 10, paddingHorizontal: 12, minHeight: 48 },
  tombol: { backgroundColor: '#1565c0', borderRadius: 10, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  tombolTeks: { color: '#fff', fontWeight: '600' },
  tombolSekunder: { borderRadius: 10, minHeight: 48, borderWidth: 1, borderColor: '#1565c0', alignItems: 'center', justifyContent: 'center' },
  tombolSekunderTeks: { color: '#1565c0', fontWeight: '600' },
  galat: { color: '#c62828', fontWeight: '600' },
});
