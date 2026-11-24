import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tema as t } from '../src/theme';

const RINGKASAN = [
  { label: 'Tugas', nilai: 5 },
  { label: 'Selesai', nilai: 3 },
  { label: 'Sisa', nilai: 2 },
];

export default function Beranda() {
  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <View style={styles.kartu}>
        <Text style={styles.judul}>Ringkasan hari ini</Text>
        <Text style={styles.teks}>Semua warna dan jarak pada layar ini berasal dari berkas tema.</Text>
      </View>

      <View style={styles.baris}>
        {RINGKASAN.map((r) => (
          <View key={r.label} style={[styles.kartu, styles.kotakAngka]}>
            <Text style={styles.besar}>{r.nilai}</Text>
            <Text style={styles.kecil}>{r.label}</Text>
          </View>
        ))}
      </View>

      <Link href="/daftar" asChild>
        <Pressable accessibilityRole="button" style={styles.tombol}>
          <Text style={styles.tombolTeks}>Lihat daftar</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: t.warna.latar },
  isi: { padding: t.spasi.lg, gap: t.spasi.md },
  kartu: {
    backgroundColor: t.warna.kartu,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.warna.garis,
    padding: t.spasi.lg,
    gap: t.spasi.sm,
  },
  baris: { flexDirection: 'row', gap: t.spasi.md },
  kotakAngka: { flex: 1, alignItems: 'center' },
  judul: { fontSize: t.font.judul, fontWeight: '700', color: t.warna.teks },
  teks: { fontSize: t.font.isi, color: t.warna.abu },
  besar: { fontSize: t.font.besar, fontWeight: '700', color: t.warna.utama },
  kecil: { fontSize: t.font.kecil, color: t.warna.abu },
  tombol: {
    minHeight: t.tinggiTombol,
    borderRadius: t.radius.md,
    backgroundColor: t.warna.utama,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tombolTeks: { color: t.warna.tombolTeks, fontSize: t.font.isi, fontWeight: '600' },
});
