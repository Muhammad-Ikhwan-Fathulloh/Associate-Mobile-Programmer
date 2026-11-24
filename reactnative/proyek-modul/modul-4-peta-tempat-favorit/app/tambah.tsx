import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { simpanTempat } from '../src/data/tempatRepository';
import { Koordinat, validasiNama } from '../src/models/tempat';
import { ambilLokasi } from '../src/services/lokasi';

export default function Tambah() {
  const router = useRouter();
  const [nama, setNama] = useState('');
  const [koordinat, setKoordinat] = useState<Koordinat | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  const sertakanLokasi = async () => {
    setSibuk(true);
    const hasil = await ambilLokasi();
    setSibuk(false);
    if (hasil.ok) {
      setKoordinat({ latitude: hasil.latitude, longitude: hasil.longitude });
      setPesan('Lokasi didapat.');
    } else {
      setKoordinat(null);
      setPesan(hasil.pesan);
    }
  };

  const simpan = async () => {
    const galat = validasiNama(nama);
    if (galat) return setPesan(galat);
    // Tempat tetap bisa disimpan tanpa koordinat bila lokasi gagal.
    await simpanTempat({ nama, latitude: koordinat?.latitude ?? null, longitude: koordinat?.longitude ?? null });
    router.back();
  };

  return (
    <View style={styles.layar}>
      <Text style={styles.label}>Nama tempat</Text>
      <TextInput style={styles.input} value={nama} onChangeText={setNama} placeholder="Contoh: Kafe Dekat Kantor" maxLength={60} />

      <Pressable style={[styles.tombolSekunder, sibuk && { opacity: 0.6 }]} onPress={sertakanLokasi} disabled={sibuk} accessibilityRole="button">
        <Text style={styles.tombolSekunderTeks}>{sibuk ? 'Mencari lokasi...' : 'Sertakan lokasi saya'}</Text>
      </Pressable>

      <Text style={styles.abu}>
        {koordinat
          ? `Koordinat: ${koordinat.latitude.toFixed(5)}, ${koordinat.longitude.toFixed(5)}`
          : 'Belum ada koordinat. Tempat akan disimpan tanpa lokasi.'}
      </Text>
      {pesan && <Text style={styles.info}>{pesan}</Text>}

      <Pressable style={styles.tombol} onPress={simpan} accessibilityRole="button">
        <Text style={styles.tombolTeks}>Simpan</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, padding: 16, gap: 12, backgroundColor: '#f5f7fb' },
  label: { fontWeight: '600', color: '#1b1f27' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cfd6e0', borderRadius: 10, paddingHorizontal: 12, minHeight: 48 },
  tombol: { backgroundColor: '#1565c0', borderRadius: 10, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  tombolTeks: { color: '#fff', fontWeight: '600' },
  tombolSekunder: { borderRadius: 10, minHeight: 48, borderWidth: 1, borderColor: '#1565c0', alignItems: 'center', justifyContent: 'center' },
  tombolSekunderTeks: { color: '#1565c0', fontWeight: '600' },
  abu: { color: '#5f6b7a' },
  info: { color: '#1b1f27' },
});
