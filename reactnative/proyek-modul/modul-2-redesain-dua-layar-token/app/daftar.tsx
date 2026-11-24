import { FlatList, StyleSheet, Text, View } from 'react-native';
import { tema as t } from '../src/theme';

const DATA = [
  { id: '1', judul: 'Minum air 2 liter', sub: 'Kebiasaan harian' },
  { id: '2', judul: 'Olahraga 20 menit', sub: 'Sore hari' },
  { id: '3', judul: 'Membaca 10 halaman', sub: 'Malam hari' },
  { id: '4', judul: 'Catat pengeluaran', sub: 'Setiap selesai belanja' },
  { id: '5', judul: 'Tidur sebelum 22.00', sub: 'Target malam' },
];

export default function Daftar() {
  return (
    <FlatList
      style={styles.layar}
      contentContainerStyle={styles.isi}
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.baris}>
          <View style={styles.titik} />
          <View style={styles.teksWadah}>
            <Text style={styles.judul}>{item.judul}</Text>
            <Text style={styles.sub}>{item.sub}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: t.warna.latar },
  isi: { padding: t.spasi.lg, gap: t.spasi.sm },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: t.tinggiTombol,
    gap: t.spasi.md,
    padding: t.spasi.md,
    borderRadius: t.radius.sm,
    backgroundColor: t.warna.kartu,
    borderWidth: 1,
    borderColor: t.warna.garis,
  },
  titik: { width: t.spasi.md, height: t.spasi.md, borderRadius: t.spasi.sm, backgroundColor: t.warna.utama },
  teksWadah: { flex: 1 },
  judul: { fontSize: t.font.isi, fontWeight: '600', color: t.warna.teks },
  sub: { fontSize: t.font.kecil, color: t.warna.abu },
});
