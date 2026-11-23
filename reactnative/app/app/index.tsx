import { Link } from 'expo-router';
import { ScrollView, Text, Pressable } from 'react-native';
import { MENU } from '../src/menu';
import { gaya } from '../src/ui';

export default function Beranda() {
  return (
    <ScrollView style={gaya.layar}>
      <Text style={[gaya.judul, { marginBottom: 12 }]}>Pilih materi praktik</Text>
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
