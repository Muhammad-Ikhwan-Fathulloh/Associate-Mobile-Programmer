import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Tombol } from '../src/components/Tombol';
import { semuaCatatan, simpanCatatan } from '../src/data/noteRepository';
import { formatKoordinat, Note, noteBaru, validasiJudul } from '../src/models/note';
import { posisiSekarang } from '../src/services/locationService';
import { gaya } from '../src/ui';

export default function FormCatatan() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [lama, setLama] = useState<Note | null>(null);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [lokasi, setLokasi] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    semuaCatatan().then((semua) => {
      const n = semua.find((x) => String(x.id) === id);
      if (n) {
        setLama(n);
        setJudul(n.title);
        setIsi(n.content);
        if (n.latitude != null && n.longitude != null) setLokasi({ latitude: n.latitude, longitude: n.longitude });
      }
    });
  }, [id]);

  const ambilLokasi = async () => {
    try {
      setError(null);
      const p = await posisiSekarang();
      setLokasi({ latitude: p.latitude, longitude: p.longitude });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const simpan = async () => {
    const pesan = validasiJudul(judul);
    if (pesan) return setError(pesan);
    const lat = lokasi?.latitude ?? null;
    const lon = lokasi?.longitude ?? null;
    const n = lama
      ? { ...lama, title: judul.trim(), content: isi.trim(), latitude: lat, longitude: lon }
      : noteBaru(judul.trim(), isi.trim(), lat, lon);
    await simpanCatatan(n);
    router.back();
  };

  return (
    <View style={gaya.layar}>
      <TextInput testID="input-judul" style={gaya.input} placeholder="Judul" value={judul} onChangeText={(t) => { setJudul(t); setError(null); }} />
      <TextInput testID="input-isi" style={[gaya.input, { height: 140, textAlignVertical: 'top' }]} placeholder="Isi catatan" multiline value={isi} onChangeText={setIsi} />
      <Tombol label={lokasi ? 'Perbarui lokasi saya' : 'Sertakan lokasi saya (GPS)'} onPress={ambilLokasi} />
      {lokasi && <Text style={gaya.abu}>Lokasi tersimpan bersama catatan: {formatKoordinat(lokasi)}</Text>}
      {error && <Text style={gaya.error}>{error}</Text>}
      <Tombol label="Simpan" onPress={simpan} testID="tombol-simpan" />
    </View>
  );
}
