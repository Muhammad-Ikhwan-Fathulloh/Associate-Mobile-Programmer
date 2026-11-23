import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LeafletMap } from '../src/components/LeafletMap';
import { Tombol } from '../src/components/Tombol';
import { jarakMeter } from '../src/services/distance';
import { alamatDari, Posisi, posisiSekarang } from '../src/services/locationService';
import { gaya } from '../src/ui';

// Titik acuan: Graha Pos Bandung (perkiraan)
const ACUAN = { latitude: -6.9175, longitude: 107.6107 };

export default function Lokasi() {
  const [pos, setPos] = useState<Posisi | null>(null);
  const [alamat, setAlamat] = useState('');
  const [error, setError] = useState<string | null>(null);

  const ambil = async () => {
    try {
      setError(null);
      const p = await posisiSekarang();
      setPos(p);
      setAlamat(await alamatDari(p.latitude, p.longitude).catch(() => 'Alamat tidak tersedia'));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <ScrollView style={gaya.layar}>
      <Tombol label="Ambil Posisi Saya" onPress={ambil} />
      {error && <Text style={gaya.error}>{error}</Text>}
      {pos && (
        <View>
          <View style={gaya.kartu}>
            <Text style={gaya.teks}>Lat: {pos.latitude.toFixed(5)}, Lon: {pos.longitude.toFixed(5)}</Text>
            <Text style={gaya.abu}>Akurasi: {pos.akurasi?.toFixed(0) ?? '-'} m</Text>
            <Text style={gaya.teks}>Alamat: {alamat}</Text>
            <Text style={gaya.teks}>
              Jarak ke titik acuan: {(jarakMeter(pos.latitude, pos.longitude, ACUAN.latitude, ACUAN.longitude) / 1000).toFixed(2)} km
            </Text>
          </View>
          <View style={{ height: 320 }}>
            <LeafletMap latitude={pos.latitude} longitude={pos.longitude} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}
