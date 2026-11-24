import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BUKTI } from '../src/bukti';

const LANGKAH_DEMO = [
  'Buka aplikasi dan tunjukkan layar tiap modul.',
  'Jelaskan satu unit: berkas mana yang membuktikannya.',
  'Tunjukkan satu kasus gagal yang ditangani (misalnya izin lokasi ditolak).',
  'Jalankan tes (npm test) dan tunjukkan hasilnya hijau.',
];

export default function PaketBukti() {
  const [siap, setSiap] = useState<Record<string, boolean>>({});
  const jumlahSiap = BUKTI.filter((b) => siap[b.unit]).length;

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <View style={styles.kartu}>
        <Text style={styles.judul}>Bukti kompetensi</Text>
        <Text style={styles.abu}>
          {jumlahSiap} dari {BUKTI.length} unit siap ditunjukkan.
        </Text>
      </View>

      {BUKTI.map((b) => {
        const sudah = !!siap[b.unit];
        return (
          <Pressable
            key={b.unit}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: sudah }}
            onPress={() => setSiap((s) => ({ ...s, [b.unit]: !sudah }))}
            style={styles.kartu}
          >
            <Text style={styles.kode}>{b.unit}</Text>
            <Text style={styles.judul}>{b.judul}</Text>
            <Text style={styles.abu}>{b.berkas}</Text>
            <Text style={sudah ? styles.ok : styles.abu}>{sudah ? 'Siap ditunjukkan' : 'Ketuk jika siap'}</Text>
          </Pressable>
        );
      })}

      <View style={styles.kartu}>
        <Text style={styles.judul}>Skrip demo lima menit</Text>
        {LANGKAH_DEMO.map((l, i) => (
          <Text key={i} style={styles.teks}>
            {i + 1}. {l}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  isi: { padding: 16, gap: 12 },
  kartu: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 6, borderWidth: 1, borderColor: '#cfd6e0' },
  kode: { fontSize: 12, color: '#1565c0', fontWeight: '700' },
  judul: { fontSize: 16, fontWeight: '700', color: '#1b1f27' },
  teks: { color: '#1b1f27' },
  abu: { color: '#5f6b7a' },
  ok: { color: '#2e7d32', fontWeight: '600' },
});
