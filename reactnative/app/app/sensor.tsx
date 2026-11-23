import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { gaya } from '../src/ui';

export default function Sensor() {
  const [a, setA] = useState({ x: 0, y: 0, z: 0 });
  const [tersedia, setTersedia] = useState<boolean | null>(null);

  useEffect(() => {
    let langganan: { remove: () => void } | undefined;
    Accelerometer.isAvailableAsync().then((ok) => {
      setTersedia(ok);
      if (!ok) return;
      Accelerometer.setUpdateInterval(300);
      langganan = Accelerometer.addListener(setA);
    });
    return () => langganan?.remove();
  }, []);

  const besar = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
  return (
    <View style={gaya.layar}>
      <View style={gaya.kartu}>
        <Text style={gaya.judul}>Akselerometer</Text>
        {tersedia === false && <Text style={gaya.error}>Sensor tidak tersedia di perangkat ini.</Text>}
        <Text style={gaya.teks}>X: {a.x.toFixed(2)}  Y: {a.y.toFixed(2)}  Z: {a.z.toFixed(2)} (satuan g)</Text>
        <Text style={gaya.teks}>Besar total: {besar.toFixed(2)} g</Text>
        <Text style={gaya.abu}>Diam di meja: Z mendekati 1 g karena gravitasi.</Text>
      </View>
    </View>
  );
}
