import { Link } from 'expo-router';
import { ScrollView, Text, Pressable } from 'react-native';
import { MENU } from '../src/menu';
import { proyek } from '../src/proyek.config';
import { gaya } from '../src/ui';

export default function Beranda() {
  return (
    <ScrollView style={gaya.layar}>
      <Text style={[gaya.judul, { fontSize: 24 }]}>{proyek.namaAplikasi}</Text>
      <Text style={[gaya.abu, { marginBottom: 12 }]}>{proyek.tagline}</Text>
      {MENU.map((m) => (
        <Link key={m.href} href={m.href} asChild>
          <Pressable style={gaya.kartu} accessibilityRole="button">
            <Text style={gaya.judul}>{m.judul}</Text>
            <Text style={gaya.abu}>{m.ket}</Text>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}
