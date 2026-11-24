import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ambilSatu, simpanEntri } from '../src/data/entriRepository';
import { KATEGORI, validasiJudul } from '../src/models/entri';
import { ambilLokasi } from '../src/services/lokasi';

export default function Form() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [judul, setJudul] = useState('');
  const [catatan, setCatatan] = useState('');
  const [kategori, setKategori] = useState<string>(KATEGORI[0]);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  useEffect(() => {
    if (!id) return;
    ambilSatu(Number(id)).then((e) => {
      if (!e) return;
      setJudul(e.judul);
      setCatatan(e.catatan);
      setKategori(e.kategori);
      setLat(e.latitude);
      setLon(e.longitude);
    });
  }, [id]);

  const sertakanLokasi = async () => {
    setSibuk(true);
    const hasil = await ambilLokasi();
    setSibuk(false);
    if (hasil.ok) {
      setLat(hasil.latitude);
      setLon(hasil.longitude);
      setPesan('Lokasi didapat.');
    } else {
      setPesan(hasil.pesan);
    }
  };

  const simpan = async () => {
    const galat = validasiJudul(judul);
    if (galat) return setPesan(galat);
    // Entri tetap bisa disimpan tanpa koordinat bila lokasi gagal.
    await simpanEntri({ id: id ? Number(id) : undefined, judul, catatan, kategori, latitude: lat, longitude: lon });
    router.back();
  };

  return (
    <ScrollView style={styles.layar} contentContainerStyle={{ gap: 12 }}>
      <Text style={styles.label}>Judul</Text>
      <TextInput style={styles.input} value={judul} onChangeText={setJudul} maxLength={100} />
      <Text style={styles.label}>Catatan perjalanan</Text>
      <TextInput style={[styles.input, { minHeight: 90 }]} value={catatan} onChangeText={setCatatan} multiline />
      <Text style={styles.label}>Kategori</Text>
      <View style={styles.baris}>
        {KATEGORI.map((k) => (
          <Pressable key={k} onPress={() => setKategori(k)} style={[styles.chip, kategori === k && styles.chipAktif]}>
            <Text style={kategori === k ? styles.chipTeksAktif : styles.chipTeks}>{k}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={[styles.tombolSekunder, sibuk && { opacity: 0.6 }]} onPress={sertakanLokasi} disabled={sibuk}>
        <Text style={styles.tombolSekunderTeks}>{sibuk ? 'Mencari lokasi...' : 'Sertakan lokasi saya'}</Text>
      </Pressable>
      <Text style={styles.abu}>
        {lat != null && lon != null ? `Koordinat: ${lat.toFixed(5)}, ${lon.toFixed(5)}` : 'Belum ada koordinat.'}
      </Text>
      {pesan && <Text style={styles.info}>{pesan}</Text>}
      <Pressable style={styles.tombol} onPress={simpan}>
        <Text style={styles.tombolTeks}>Simpan</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb', padding: 16 },
  label: { fontWeight: '600', color: '#1b1f27' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cfd6e0', borderRadius: 10, paddingHorizontal: 12, minHeight: 48 },
  baris: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: '#cfd6e0', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff' },
  chipAktif: { backgroundColor: '#1565c0', borderColor: '#1565c0' },
  chipTeks: { color: '#1b1f27' },
  chipTeksAktif: { color: '#fff', fontWeight: '600' },
  tombol: { backgroundColor: '#1565c0', borderRadius: 10, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  tombolTeks: { color: '#fff', fontWeight: '600' },
  tombolSekunder: { borderRadius: 10, minHeight: 48, borderWidth: 1, borderColor: '#1565c0', alignItems: 'center', justifyContent: 'center' },
  tombolSekunderTeks: { color: '#1565c0', fontWeight: '600' },
  abu: { color: '#5f6b7a' },
  info: { color: '#1b1f27' },
});
