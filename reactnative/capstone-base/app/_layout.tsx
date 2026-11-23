import { Stack } from 'expo-router';
import { proyek } from '../src/proyek.config';
import { warna } from '../src/ui';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: warna.utama }, headerTintColor: '#fff' }}>
      <Stack.Screen name="index" options={{ title: proyek.namaAplikasi }} />
      <Stack.Screen name="notes" options={{ title: proyek.namaEntri }} />
      <Stack.Screen name="note-form" options={{ title: `Form ${proyek.namaEntri}` }} />
      <Stack.Screen name="location" options={{ title: 'Lokasi dan Peta' }} />
      <Stack.Screen name="network" options={{ title: 'Jaringan Seluler' }} />
      <Stack.Screen name="sinkron" options={{ title: 'API dan Sinkronisasi' }} />
      <Stack.Screen name="sensor" options={{ title: 'Sensor' }} />
      <Stack.Screen name="device" options={{ title: 'Info Perangkat' }} />
      <Stack.Screen name="keamanan" options={{ title: 'Keamanan' }} />
      <Stack.Screen name="kreatif" options={{ title: 'Fitur Kreatif' }} />
    </Stack>
  );
}
