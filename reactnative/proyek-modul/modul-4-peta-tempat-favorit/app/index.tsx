import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PetaTempat } from '../src/components/PetaTempat';
import { ambilTempat, hapusTempat } from '../src/data/tempatRepository';
import { Koordinat, Tempat } from '../src/models/tempat';
import { ambilLokasi } from '../src/services/lokasi';
import { formatJarak } from '../src/services/distance';
import { tempatUntukPeta, urutkanJarak } from '../src/services/tempat';

// Pusat peta bila belum ada posisi: Bandung.
const PUSAT_AWAL: Koordinat = { latitude: -6.9175, longitude: 107.6191 };

export default function Daftar() {
  const [daftar, setDaftar] = useState<Tempat[]>([]);
  const [posisi, setPosisi] = useState<Koordinat | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);

  // Memuat ulang setiap kali layar kembali tampil (setelah menambah tempat).
  useFocusEffect(
    useCallback(() => {
      ambilTempat().then(setDaftar).catch((e) => setPesan(`Gagal memuat: ${(e as Error).message}`));
    }, []),
  );

  const hitungJarak = async () => {
    const hasil = await ambilLokasi();
    if (hasil.ok) {
      setPosisi({ latitude: hasil.latitude, longitude: hasil.longitude });
      setPesan(null);
    } else {
      setPesan(hasil.pesan);
    }
  };

  const hapus = async (id: number) => {
    await hapusTempat(id);
    setDaftar(await ambilTempat());
  };

  const urutan = posisi ? urutkanJarak(daftar, posisi) : daftar.map((t) => ({ ...t, jarakM: null }));
  const titikPeta = tempatUntukPeta(daftar).map((t) => ({ latitude: t.latitude, longitude: t.longitude, judul: t.nama }));
  const pusat = posisi ?? titikPeta[0] ?? PUSAT_AWAL;

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <View style={styles.baris}>
        <Link href="/tambah" asChild>
          <Pressable style={[styles.tombol, { flex: 1 }]} accessibilityRole="button">
            <Text style={styles.tombolTeks}>Tambah tempat</Text>
          </Pressable>
        </Link>
        <Pressable style={[styles.tombolSekunder, { flex: 1 }]} onPress={hitungJarak} accessibilityRole="button">
          <Text style={styles.tombolSekunderTeks}>Jarak dari saya</Text>
        </Pressable>
      </View>

      {pesan && <Text style={styles.galat}>{pesan}</Text>}
      {!posisi && <Text style={styles.abu}>Tekan "Jarak dari saya" untuk mengurutkan dari yang terdekat.</Text>}

      {urutan.map((t) => (
        <View key={t.id} style={styles.kartu}>
          <View style={{ flex: 1 }}>
            <Text style={styles.judul}>{t.nama}</Text>
            <Text style={styles.abu}>
              {t.jarakM !== null ? formatJarak(t.jarakM) : 'Tanpa koordinat'}
            </Text>
          </View>
          <Pressable onPress={() => hapus(t.id!)} accessibilityRole="button">
            <Text style={styles.hapus}>Hapus</Text>
          </Pressable>
        </View>
      ))}

      <View style={styles.peta}>
        <PetaTempat pusat={pusat} titik={titikPeta} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  isi: { padding: 16, gap: 12 },
  baris: { flexDirection: 'row', gap: 8 },
  tombol: { backgroundColor: '#1565c0', borderRadius: 10, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  tombolTeks: { color: '#fff', fontWeight: '600' },
  tombolSekunder: {
    borderRadius: 10,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#1565c0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tombolSekunderTeks: { color: '#1565c0', fontWeight: '600' },
  galat: { color: '#c62828' },
  abu: { color: '#5f6b7a' },
  kartu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#cfd6e0',
  },
  judul: { fontSize: 16, fontWeight: '700', color: '#1b1f27' },
  hapus: { color: '#c62828', fontWeight: '600' },
  peta: { height: 320, borderRadius: 12, overflow: 'hidden' },
});
