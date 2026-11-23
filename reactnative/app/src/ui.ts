import { StyleSheet } from 'react-native';
import { tema } from './theme';

export const warna = tema.warna;

export const gaya = StyleSheet.create({
  layar: { flex: 1, backgroundColor: tema.warna.latar, padding: tema.spasi.lg },
  kartu: { backgroundColor: tema.warna.kartu, borderRadius: tema.radius.md, padding: 14, marginBottom: tema.spasi.md, elevation: 1 },
  judul: { fontSize: tema.font.judul, fontWeight: '700', color: tema.warna.teks },
  teks: { fontSize: tema.font.isi, color: tema.warna.teks, marginTop: tema.spasi.xs },
  abu: { fontSize: tema.font.kecil, color: tema.warna.abu, marginTop: tema.spasi.xs },
  input: { backgroundColor: tema.warna.kartu, borderWidth: 1, borderColor: tema.warna.garis, borderRadius: tema.radius.sm, padding: 10, marginBottom: 10, fontSize: tema.font.isi },
  tombol: { backgroundColor: tema.warna.utama, borderRadius: tema.radius.sm, minHeight: tema.tinggiTombol, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  tombolTeks: { color: '#fff', fontWeight: '700', fontSize: tema.font.isi },
  error: { color: tema.warna.bahaya, marginBottom: tema.spasi.sm },
});
