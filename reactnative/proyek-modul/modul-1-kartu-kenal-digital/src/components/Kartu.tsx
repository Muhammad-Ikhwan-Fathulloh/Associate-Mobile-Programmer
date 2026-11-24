import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

/** Kotak pembungkus yang dipakai ulang untuk profil dan daftar keahlian. */
export function Kartu({ judul, children }: { judul: string; children: ReactNode }) {
  return (
    <View style={styles.kartu}>
      <Text style={styles.judul}>{judul}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cfd6e0',
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  judul: { fontSize: 16, fontWeight: '700', color: '#1b1f27' },
});
