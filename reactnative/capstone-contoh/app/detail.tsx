import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ambilSatu, hapusEntri } from '../src/data/entriRepository';
import { Entri, punyaKoordinat } from '../src/models/entri';
import { buatHtmlPeta } from '../src/services/petaHtml';
import { formatJarak, jarakMeter } from '../src/services/geo';
import { ambilLokasi } from '../src/services/lokasi';

export default function Detail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entri, setEntri] = useState<Entri | null>(null);
  const [jarak, setJarak] = useState<number | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      ambilSatu(Number(id)).then(setEntri);
    }, [id]),
  );

  const jarakDariSaya = async () => {
    if (!entri || !punyaKoordinat(entri)) return setPesan('Entri ini tidak punya koordinat.');
    const hasil = await ambilLokasi();
    if (!hasil.ok) return setPesan(hasil.pesan);
    setJarak(jarakMeter(hasil.latitude, hasil.longitude, entri.latitude!, entri.longitude!));
    setPesan(null);
  };

  if (!entri) return <Text style={{ padding: 16 }}>Memuat...</Text>;

  return (
    <ScrollView style={styles.layar} contentContainerStyle={{ gap: 12 }}>
      <Text style={styles.judul}>{entri.judul}</Text>
      <Text style={styles.abu}>
        {entri.kategori} · {entri.status}
      </Text>
      <Text style={styles.teks}>{entri.catatan}</Text>

      {punyaKoordinat(entri) ? (
        <>
          <Pressable style={styles.tombolSekunder} onPress={jarakDariSaya}>
            <Text style={styles.tombolSekunderTeks}>Jarak dari saya</Text>
          </Pressable>
          {jarak != null && <Text style={styles.teks}>Jarak: {formatJarak(jarak)}</Text>}
          <View style={styles.peta}>
            <WebView
              originWhitelist={['*']}
              source={{
                html: buatHtmlPeta(
                  { latitude: entri.latitude!, longitude: entri.longitude! },
                  [{ latitude: entri.latitude!, longitude: entri.longitude!, judul: entri.judul }],
                ),
              }}
              style={{ flex: 1 }}
            />
          </View>
        </>
      ) : (
        <Text style={styles.abu}>Entri ini disimpan tanpa lokasi.</Text>
      )}

      {pesan && <Text style={styles.teks}>{pesan}</Text>}

      <Pressable style={styles.tombolSekunder} onPress={() => router.push({ pathname: '/form', params: { id: String(entri.id) } })}>
        <Text style={styles.tombolSekunderTeks}>Ubah</Text>
      </Pressable>
      <Pressable
        style={styles.hapus}
        onPress={async () => {
          await hapusEntri(entri.id!);
          router.back();
        }}
      >
        <Text style={styles.hapusTeks}>Hapus</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb', padding: 16 },
  judul: { fontSize: 22, fontWeight: '700', color: '#1b1f27' },
  teks: { color: '#1b1f27', fontSize: 15 },
  abu: { color: '#5f6b7a' },
  peta: { height: 260, borderRadius: 12, overflow: 'hidden' },
  tombolSekunder: { borderRadius: 10, minHeight: 48, borderWidth: 1, borderColor: '#1565c0', alignItems: 'center', justifyContent: 'center' },
  tombolSekunderTeks: { color: '#1565c0', fontWeight: '600' },
  hapus: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  hapusTeks: { color: '#c62828', fontWeight: '600' },
});
