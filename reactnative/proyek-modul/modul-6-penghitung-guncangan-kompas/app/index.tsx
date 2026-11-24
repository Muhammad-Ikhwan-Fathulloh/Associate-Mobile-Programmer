import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  arahKompas,
  besarVektor,
  mataAngin,
  PendeteksiGuncangan,
  Vektor,
} from '../src/services/sensorMath';

const NOL: Vektor = { x: 0, y: 0, z: 0 };

type Sumber = {
  isAvailableAsync: () => Promise<boolean>;
  setUpdateInterval: (ms: number) => void;
  addListener: (fn: (v: Vektor) => void) => { remove: () => void };
};

/** Berlangganan satu sensor. Langganan dihentikan saat layar ditutup (cleanup remove). */
function useSensor(sensor: Sumber, intervalMs: number) {
  const [nilai, setNilai] = useState<Vektor>(NOL);
  const [tersedia, setTersedia] = useState<boolean | null>(null);

  useEffect(() => {
    let langganan: { remove: () => void } | undefined;
    let batal = false;
    sensor.isAvailableAsync().then((ok) => {
      if (batal) return;
      setTersedia(ok);
      if (!ok) return;
      sensor.setUpdateInterval(intervalMs);
      langganan = sensor.addListener(setNilai);
    });
    return () => {
      batal = true;
      langganan?.remove();
    };
  }, [sensor, intervalMs]);

  return { nilai, tersedia };
}

const f = (n: number) => n.toFixed(2);

export default function SensorScreen() {
  const akselerometer = useSensor(Accelerometer, 100);
  const giroskop = useSensor(Gyroscope, 200);
  const magnetometer = useSensor(Magnetometer, 200);

  const [jumlah, setJumlah] = useState(0);
  const pendeteksi = useRef(new PendeteksiGuncangan(2, 800));

  // Setiap pembacaan akselerometer diperiksa; hanya guncangan baru yang dihitung.
  useEffect(() => {
    if (pendeteksi.current.masukkan(akselerometer.nilai, Date.now())) {
      setJumlah((j) => j + 1);
    }
  }, [akselerometer.nilai]);

  const derajat = arahKompas(magnetometer.nilai);

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <View style={styles.kartu}>
        <Text style={styles.judul}>Penghitung guncangan</Text>
        <Text style={styles.besar}>{jumlah}</Text>
        <Text style={styles.abu}>Guncang ponsel untuk menambah hitungan. Satu guncangan dihitung sekali.</Text>
        <Pressable style={styles.tombol} onPress={() => setJumlah(0)} accessibilityRole="button">
          <Text style={styles.tombolTeks}>Reset hitungan</Text>
        </Pressable>
        {akselerometer.tersedia === false && <Text style={styles.galat}>Akselerometer tidak tersedia.</Text>}
        <Text style={styles.abu}>Besar percepatan: {f(besarVektor(akselerometer.nilai))} g</Text>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judul}>Kompas</Text>
        {magnetometer.tersedia === false && <Text style={styles.galat}>Magnetometer tidak tersedia.</Text>}
        <Text style={styles.besar}>
          {Math.round(derajat)}° {mataAngin(derajat)}
        </Text>
        <Text style={styles.abu}>Letakkan ponsel datar agar arah akurat.</Text>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judul}>Giroskop (rad/s)</Text>
        {giroskop.tersedia === false && <Text style={styles.galat}>Giroskop tidak tersedia.</Text>}
        <Text style={styles.teks}>
          X {f(giroskop.nilai.x)}  Y {f(giroskop.nilai.y)}  Z {f(giroskop.nilai.z)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  isi: { padding: 16, gap: 12 },
  kartu: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 8, borderWidth: 1, borderColor: '#cfd6e0' },
  judul: { fontSize: 16, fontWeight: '700', color: '#1b1f27' },
  besar: { fontSize: 36, fontWeight: '700', color: '#1565c0' },
  teks: { fontSize: 15, color: '#1b1f27' },
  abu: { color: '#5f6b7a' },
  galat: { color: '#c62828' },
  tombol: { backgroundColor: '#1565c0', borderRadius: 10, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  tombolTeks: { color: '#fff', fontWeight: '600' },
});
