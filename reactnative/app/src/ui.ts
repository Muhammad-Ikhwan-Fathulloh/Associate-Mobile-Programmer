import { StyleSheet } from 'react-native';

export const warna = { utama: '#1565c0', latar: '#f5f7fb', teks: '#1b1f27', abu: '#5f6b7a', bahaya: '#c62828', ok: '#2e7d32' };

export const gaya = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar, padding: 16 },
  kartu: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, elevation: 1 },
  judul: { fontSize: 18, fontWeight: '700', color: warna.teks },
  teks: { fontSize: 15, color: warna.teks, marginTop: 4 },
  abu: { fontSize: 13, color: warna.abu, marginTop: 4 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cfd6e0', borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 15 },
  tombol: { backgroundColor: warna.utama, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 10 },
  tombolTeks: { color: '#fff', fontWeight: '700', fontSize: 15 },
  error: { color: warna.bahaya, marginBottom: 8 },
});
