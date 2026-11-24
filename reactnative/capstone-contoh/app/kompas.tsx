import { Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { arahKeTujuan, arahRelatif, mataAngin } from '../src/services/geo';
import { arahHadap } from '../src/services/sensorMath';
import { ambilLokasi } from '../src/services/lokasi';

// Tujuan contoh: Monumen Nasional, Jakarta. Ganti dengan entri yang dipilih pengguna.
const TUJUAN = { latitude: -6.1754, longitude: 106.8272 };

/** Kompas yang menunjuk ke tujuan. Langganan magnetometer dihentikan saat layar ditutup. */
export default function Kompas() {
  const [hadap, setHadap] = useState(0);
  const [posisi, setPosisi] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);

  useEffect(() => {
    let langganan: { remove: () => void } | undefined;
    Magnetometer.isAvailableAsync().then((ok) => {
      if (!ok) return setPesan('Magnetometer tidak tersedia di perangkat ini.');
      Magnetometer.setUpdateInterval(200);
      langganan = Magnetometer.addListener((m) => setHadap(arahHadap(m.x, m.y)));
    });
    ambilLokasi().then((hasil) => {
      if (hasil.ok) setPosisi({ latitude: hasil.latitude, longitude: hasil.longitude });
      else setPesan(hasil.pesan);
    });
    return () => langganan?.remove();
  }, []);

  const arahTujuan = posisi ? arahKeTujuan(posisi.latitude, posisi.longitude, TUJUAN.latitude, TUJUAN.longitude) : null;
  const relatif = arahTujuan != null ? arahRelatif(arahTujuan, hadap) : null;

  return (
    <View style={styles.layar}>
      <Text style={styles.teks}>Tujuan: Monumen Nasional, Jakarta</Text>
      <Text style={[styles.panah, { transform: [{ rotate: `${relatif ?? 0}deg` }] }]}>↑</Text>
      <Text style={styles.teks}>
        {relatif == null
          ? 'Menunggu lokasi...'
          : `${Math.abs(relatif) < 10 ? 'Tepat di depan' : relatif < 0 ? 'Di kiri' : 'Di kanan'} (${Math.round(arahTujuan!)}° ${mataAngin(arahTujuan!)})`}
      </Text>
      <Text style={styles.abu}>Arah hadap ponsel: {Math.round(hadap)}° {mataAngin(hadap)}</Text>
      {pesan && <Text style={styles.abu}>{pesan}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  panah: { fontSize: 160, color: '#1565c0' },
  teks: { fontSize: 16, color: '#1b1f27', textAlign: 'center' },
  abu: { color: '#5f6b7a', textAlign: 'center' },
});
