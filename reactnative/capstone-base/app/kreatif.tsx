import { ScrollView, Text } from 'react-native';
import { IDE_KREATIF, proyek } from '../src/proyek.config';
import { gaya } from '../src/ui';

// TODO(peserta): ganti layar ini dengan fitur kreatif Anda.
// Syarat: bukan sekadar menampilkan angka. Fitur harus memakai minimal dua materi
// (misalnya sensor + SQLite, atau GPS + API), punya penanganan kasus gagal, dan satu tes.
export default function Kreatif() {
  return (
    <ScrollView style={gaya.layar}>
      <Text style={gaya.judul}>Fitur kreatif {proyek.namaAplikasi}</Text>
      <Text style={gaya.abu}>Ganti isi layar ini. Beberapa ide:</Text>
      {IDE_KREATIF.map((ide) => (
        <Text key={ide} style={gaya.teks}>• {ide}</Text>
      ))}
    </ScrollView>
  );
}
