import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ambilKebiasaan, batalCatat, catatSelesai, hapusKebiasaan, tambahKebiasaan } from '../src/data/habitRepository';
import { hitungStreak, tanggalDari } from '../src/logic/streak';
import { Habit, validasiNama } from '../src/models/habit';

export default function Pelacak() {
  const [daftar, setDaftar] = useState<Habit[]>([]);
  const [nama, setNama] = useState('');
  const [pesan, setPesan] = useState<string | null>(null);
  const hariIni = tanggalDari(new Date());

  const muat = useCallback(async () => setDaftar(await ambilKebiasaan()), []);

  useEffect(() => {
    muat().catch((e) => setPesan(`Gagal memuat data: ${(e as Error).message}`));
  }, [muat]);

  const tambah = async () => {
    const galat = validasiNama(nama);
    if (galat) return setPesan(galat);
    await tambahKebiasaan(nama);
    setNama('');
    setPesan(null);
    await muat();
  };

  const centang = async (h: Habit) => {
    if (h.tanggal.includes(hariIni)) await batalCatat(h.id, hariIni);
    else await catatSelesai(h.id, hariIni);
    await muat();
  };

  const hapus = async (h: Habit) => {
    await hapusKebiasaan(h.id);
    await muat();
  };

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <View style={styles.formBaris}>
        <TextInput
          style={styles.input}
          placeholder="Nama kebiasaan"
          value={nama}
          onChangeText={setNama}
          maxLength={40}
        />
        <Pressable style={styles.tombol} onPress={tambah} accessibilityRole="button">
          <Text style={styles.tombolTeks}>Tambah</Text>
        </Pressable>
      </View>
      {pesan && <Text style={styles.galat}>{pesan}</Text>}

      {daftar.length === 0 && <Text style={styles.abu}>Belum ada kebiasaan. Tambahkan yang pertama.</Text>}

      {daftar.map((h) => {
        const sudah = h.tanggal.includes(hariIni);
        return (
          <View key={h.id} style={styles.kartu}>
            <View style={styles.teksWadah}>
              <Text style={styles.judul}>{h.nama}</Text>
              <Text style={styles.abu}>Streak: {hitungStreak(h.tanggal)} hari</Text>
            </View>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: sudah }}
              onPress={() => centang(h)}
              style={[styles.centang, sudah && styles.centangAktif]}
            >
              <Text style={styles.centangTeks}>{sudah ? '✓' : ' '}</Text>
            </Pressable>
            <Pressable onPress={() => hapus(h)} accessibilityRole="button">
              <Text style={styles.hapus}>Hapus</Text>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  isi: { padding: 16, gap: 12 },
  formBaris: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cfd6e0',
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  tombol: { backgroundColor: '#1565c0', borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center', minHeight: 48 },
  tombolTeks: { color: '#fff', fontWeight: '600' },
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
  teksWadah: { flex: 1 },
  judul: { fontSize: 16, fontWeight: '700', color: '#1b1f27' },
  centang: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2e7d32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centangAktif: { backgroundColor: '#2e7d32' },
  centangTeks: { color: '#fff', fontWeight: '700', fontSize: 18 },
  hapus: { color: '#c62828', fontWeight: '600' },
});
