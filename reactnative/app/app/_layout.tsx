import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#1565c0' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="index" options={{ title: 'Associate Mobile App' }} />
      <Stack.Screen name="notes" options={{ title: 'Catatan' }} />
      <Stack.Screen name="note-form" options={{ title: 'Form Catatan' }} />
      <Stack.Screen name="location" options={{ title: 'Lokasi dan Peta' }} />
      <Stack.Screen name="network" options={{ title: 'Jaringan Seluler' }} />
      <Stack.Screen name="sensor" options={{ title: 'Sensor' }} />
      <Stack.Screen name="device" options={{ title: 'Info Perangkat' }} />
      <Stack.Screen name="keamanan" options={{ title: 'Keamanan' }} />
    </Stack>
  );
}
