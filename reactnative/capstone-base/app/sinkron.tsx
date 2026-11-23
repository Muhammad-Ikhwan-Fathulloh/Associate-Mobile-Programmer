import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput } from 'react-native';
import { Tombol } from '../src/components/Tombol';
import { API_URL_BAWAAN } from '../src/config';
import { catatanPending, simpanDariServer, tandaiSynced } from '../src/data/noteRepository';
import { buatApiClient } from '../src/services/apiClient';
import { sinkronkan } from '../src/services/sync';
import { gaya } from '../src/ui';

export default function Sinkron() {
  const [url, setUrl] = useState(API_URL_BAWAAN);
  const [email, setEmail] = useState('peserta@contoh.id');
  const [password, setPassword] = useState('rahasia123');
  const [token, setToken] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const api = useMemo(() => buatApiClient(url), [url]);
  const catat = (t: string) => setLog((l) => [t, ...l].slice(0, 8));

  const masuk = async () => {
    try {
      setToken(await api.login(email, password));
      catat('Login berhasil, token diterima.');
    } catch (e) {
      catat(`Login gagal: ${(e as Error).message}`);
    }
  };

  const sinkron = async () => {
    if (!token) return catat('Login dahulu.');
    try {
      const h = await sinkronkan({ catatanPending, tandaiSynced, simpanDariServer }, api, token);
      catat(`Selesai: terkirim ${h.terkirim}, diterima ${h.diterima}, gagal ${h.gagal}.`);
    } catch (e) {
      catat(`Sinkron gagal: ${(e as Error).message}`);
    }
  };

  return (
    <ScrollView style={gaya.layar}>
      <Text style={gaya.judul}>Server API</Text>
      <TextInput style={gaya.input} value={url} onChangeText={setUrl} autoCapitalize="none" autoCorrect={false} />
      <TextInput style={gaya.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={gaya.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Tombol label="Login" onPress={masuk} />
      <Tombol label="Sinkronkan catatan" onPress={sinkron} />
      <Text style={gaya.abu}>Jalankan server dahulu: cd shared/server, npm install, npm start.</Text>
      {log.map((l, i) => (
        <Text key={i} style={gaya.teks}>{l}</Text>
      ))}
    </ScrollView>
  );
}
