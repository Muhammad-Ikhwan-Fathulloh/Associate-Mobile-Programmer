import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { API_URL } from '../src/config';
import { Catatan, buatApiClient } from '../src/services/apiClient';
import { validasiJudul } from '../src/models/catatan';
import { pesanRamah } from '../src/services/pesanError';

export default function KlienCatatan() {
  const api = useMemo(() => buatApiClient(API_URL), []);
  const [daftar, setDaftar] = useState<Catatan[]>([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);

  /** Menjalankan aksi jaringan dengan indikator memuat dan pesan galat yang ramah. */
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

  const muatUlang = () => jalankan(async () => setDaftar(await api.daftar()));

  useFocusEffect(
    useCallback(() => {
      muatUlang();
    }, []),
  );

  const simpan = () => {
    const galat = validasiJudul(judul);
    if (galat) return setPesan(galat);
    return jalankan(async () => {
      const badan = { title: judul.trim(), content: isi, latitude: null, longitude: null };
      if (editId) await api.ubah(editId, badan);
      else await api.buat(badan);
      setJudul('');
      setIsi('');
      setEditId(null);
      setDaftar(await api.daftar());
    });
  };

  const hapus = (id: string) =>
    jalankan(async () => {
      await api.hapus(id);
      setDaftar(await api.daftar());
    });

  const pilihUntukUbah = (c: Catatan) => {
    setEditId(c.id);
    setJudul(c.title);
    setIsi(c.content);
  };

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <View style={styles.kartu}>
        <Text style={styles.judul}>{editId ? 'Ubah catatan' : 'Catatan baru'}</Text>
        <TextInput style={styles.input} value={judul} onChangeText={setJudul} placeholder="Judul (wajib)" maxLength={100} />
        <TextInput style={[styles.input, { minHeight: 70 }]} value={isi} onChangeText={setIsi} placeholder="Isi" multiline />
        <Pressable style={styles.tombol} onPress={simpan} disabled={memuat} accessibilityRole="button">
          <Text style={styles.tombolTeks}>{editId ? 'Simpan perubahan' : 'Tambah (Create)'}</Text>
        </Pressable>
        {editId && (
          <Pressable style={styles.tombolSekunder} onPress={() => { setEditId(null); setJudul(''); setIsi(''); }}>
            <Text style={styles.tombolSekunderTeks}>Batal ubah</Text>
          </Pressable>
        )}
      </View>

      <Pressable style={styles.tombolSekunder} onPress={muatUlang} disabled={memuat} accessibilityRole="button">
        <Text style={styles.tombolSekunderTeks}>Muat ulang (Read)</Text>
      </Pressable>

      {memuat && <ActivityIndicator color="#1565c0" />}
      {pesan && <Text style={styles.galat}>{pesan}</Text>}

      {daftar.map((c) => (
        <View key={c.id} style={styles.kartu}>
          <Text style={styles.judul}>{c.title}</Text>
          <Text style={styles.abu}>{c.content || '(tanpa isi)'}</Text>
          <View style={styles.baris}>
            <Pressable onPress={() => pilihUntukUbah(c)} accessibilityRole="button">
              <Text style={styles.aksi}>Ubah (Update)</Text>
            </Pressable>
            <Pressable onPress={() => hapus(c.id)} accessibilityRole="button">
              <Text style={styles.hapus}>Hapus (Delete)</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  isi: { padding: 16, gap: 12 },
  kartu: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 8, borderWidth: 1, borderColor: '#cfd6e0' },
  baris: { flexDirection: 'row', gap: 16 },
  judul: { fontSize: 16, fontWeight: '700', color: '#1b1f27' },
  abu: { color: '#5f6b7a' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cfd6e0', borderRadius: 10, paddingHorizontal: 12, minHeight: 48 },
  tombol: { backgroundColor: '#1565c0', borderRadius: 10, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  tombolTeks: { color: '#fff', fontWeight: '600' },
  tombolSekunder: { borderRadius: 10, minHeight: 48, borderWidth: 1, borderColor: '#1565c0', alignItems: 'center', justifyContent: 'center' },
  tombolSekunderTeks: { color: '#1565c0', fontWeight: '600' },
  aksi: { color: '#1565c0', fontWeight: '600' },
  hapus: { color: '#c62828', fontWeight: '600' },
  galat: { color: '#c62828', fontWeight: '600' },
});
