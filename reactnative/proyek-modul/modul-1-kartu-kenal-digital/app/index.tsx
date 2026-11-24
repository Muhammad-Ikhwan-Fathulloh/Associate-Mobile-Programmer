import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Kartu } from '../src/components/Kartu';
import { inisial, profilSaya } from '../src/profil';

export default function KartuKenal() {
  const [tampilkanKeahlian, setTampilkanKeahlian] = useState(true);
  const profil = profilSaya;

  return (
    <ScrollView style={styles.layar} contentContainerStyle={{ padding: 16 }}>
      <Kartu judul="Profil">
        <View style={styles.avatar}>
          <Text style={styles.avatarTeks}>{inisial(profil.nama)}</Text>
        </View>
        <Text style={styles.nama}>{profil.nama}</Text>
        <Text style={styles.peran}>{profil.peran}</Text>
      </Kartu>

      <Pressable
        accessibilityRole="button"
        onPress={() => setTampilkanKeahlian((v) => !v)}
        style={({ pressed }) => [styles.tombol, pressed && { opacity: 0.8 }]}
      >
        <Text style={styles.tombolTeks}>{tampilkanKeahlian ? 'Sembunyikan keahlian' : 'Tampilkan keahlian'}</Text>
      </Pressable>

      {tampilkanKeahlian && (
        <Kartu judul="Keahlian">
          {profil.keahlian.map((k) => (
            <Text key={k} style={styles.peran}>
              • {k}
            </Text>
          ))}
        </Kartu>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1565c0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTeks: { color: '#fff', fontSize: 24, fontWeight: '700' },
  nama: { fontSize: 20, fontWeight: '700', color: '#1b1f27' },
  peran: { fontSize: 15, color: '#5f6b7a' },
  tombol: { backgroundColor: '#1565c0', borderRadius: 12, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  tombolTeks: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
