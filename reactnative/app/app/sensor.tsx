import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { arahKompas, besarVektor, mataAngin, terdeteksiGuncangan, Vektor } from '../src/services/sensorMath';
import { gaya } from '../src/ui';

const NOL: Vektor = { x: 0, y: 0, z: 0 };

type Sumber = {
  isAvailableAsync: () => Promise<boolean>;
  setUpdateInterval: (ms: number) => void;
  addListener: (fn: (v: Vektor) => void) => { remove: () => void };
};

/** Berlangganan satu sensor, dan berhenti saat halaman ditutup. */
function useSensor(sensor: Sumber, intervalMs = 300) {
  const [nilai, setNilai] = useState<Vektor>(NOL);
  const [tersedia, setTersedia] = useState<boolean | null>(null);

  useEffect(() => {
    let langganan: { remove: () => void } | undefined;
    sensor.isAvailableAsync().then((ok) => {
      setTersedia(ok);
      if (!ok) return;
      sensor.setUpdateInterval(intervalMs);
      langganan = sensor.addListener(setNilai);
    });
    return () => langganan?.remove();
  }, [sensor, intervalMs]);

  return { nilai, tersedia };
}

const f = (n: number) => n.toFixed(2);

export default function Sensor() {
  const akselerometer = useSensor(Accelerometer);
  const giroskop = useSensor(Gyroscope);
  const magnetometer = useSensor(Magnetometer);
  const derajat = arahKompas(magnetometer.nilai);

  return (
    <ScrollView style={gaya.layar}>
      <View style={gaya.kartu}>
        <Text style={gaya.judul}>Akselerometer</Text>
        {akselerometer.tersedia === false && <Text style={gaya.error}>Sensor tidak tersedia.</Text>}
        <Text style={gaya.teks}>X {f(akselerometer.nilai.x)}  Y {f(akselerometer.nilai.y)}  Z {f(akselerometer.nilai.z)} (g)</Text>
        <Text style={gaya.teks}>Besar total: {f(besarVektor(akselerometer.nilai))} g</Text>
        <Text style={gaya.teks}>{terdeteksiGuncangan(akselerometer.nilai) ? 'Guncangan terdeteksi!' : 'Tidak ada guncangan'}</Text>
        <Text style={gaya.abu}>Diam di meja: Z mendekati 1 g karena gravitasi.</Text>
      </View>

      <View style={gaya.kartu}>
        <Text style={gaya.judul}>Giroskop</Text>
        {giroskop.tersedia === false && <Text style={gaya.error}>Sensor tidak tersedia.</Text>}
        <Text style={gaya.teks}>X {f(giroskop.nilai.x)}  Y {f(giroskop.nilai.y)}  Z {f(giroskop.nilai.z)} (rad/s)</Text>
        <Text style={gaya.abu}>Mengukur laju putaran. Diam di meja: mendekati 0.</Text>
      </View>

      <View style={gaya.kartu}>
        <Text style={gaya.judul}>Magnetometer (kompas)</Text>
        {magnetometer.tersedia === false && <Text style={gaya.error}>Sensor tidak tersedia.</Text>}
        <Text style={gaya.teks}>Perkiraan arah: {Math.round(derajat)}° ({mataAngin(derajat)})</Text>
        <Text style={gaya.abu}>Letakkan ponsel datar. Hasil berupa perkiraan dan terganggu logam di sekitar.</Text>
      </View>
    </ScrollView>
  );
}
