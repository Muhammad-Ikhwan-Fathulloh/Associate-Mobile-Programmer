import { useState } from 'react';
import { ScrollView, Text, TextInput } from 'react-native';
import { Tombol } from '../src/components/Tombol';
import { ambilJson, periksaUrlAman } from '../src/services/httpsService';
import { bacaToken, hapusToken, simpanToken } from '../src/services/secureStorage';
import { gaya } from '../src/ui';

export default function Keamanan() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [hasil, setHasil] = useState('');
  const [token, setToken] = useState('');
  const [tersimpan, setTersimpan] = useState('');

  const panggil = async () => {
    const pesan = periksaUrlAman(url);
    if (pesan) return setHasil(`Ditolak: ${pesan}`);
    try {
      setHasil(JSON.stringify(await ambilJson(url), null, 2));
    } catch (e) {
      setHasil(`Gagal: ${(e as Error).message}`);
    }
  };

  return (
    <ScrollView style={gaya.layar}>
      <Text style={gaya.judul}>Cek HTTPS</Text>
      <TextInput style={gaya.input} value={url} onChangeText={setUrl} autoCapitalize="none" autoCorrect={false} />
      <Tombol label="Ambil Data" onPress={panggil} />
      {hasil !== '' && <Text style={gaya.teks}>{hasil}</Text>}

      <Text style={[gaya.judul, { marginTop: 16 }]}>Penyimpanan Aman</Text>
      <TextInput style={gaya.input} placeholder="Token rahasia" value={token} onChangeText={setToken} secureTextEntry />
      <Tombol label="Simpan Token" onPress={async () => { await simpanToken(token); setToken(''); }} />
      <Tombol label="Baca Token" onPress={async () => setTersimpan((await bacaToken()) ?? '(kosong)')} />
      <Tombol label="Hapus Token" bahaya onPress={async () => { await hapusToken(); setTersimpan('(dihapus)'); }} />
      {tersimpan !== '' && <Text style={gaya.teks}>Isi tersimpan: {tersimpan}</Text>}
    </ScrollView>
  );
}
