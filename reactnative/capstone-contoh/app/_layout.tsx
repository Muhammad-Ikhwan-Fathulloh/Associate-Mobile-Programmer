import { Stack } from 'expo-router';
import { NAMA_APLIKASI } from '../src/config';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#1565c0' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="index" options={{ title: NAMA_APLIKASI }} />
      <Stack.Screen name="form" options={{ title: 'Entri' }} />
      <Stack.Screen name="detail" options={{ title: 'Detail Entri' }} />
      <Stack.Screen name="kompas" options={{ title: 'Kompas Tujuan' }} />
      <Stack.Screen name="sinkron" options={{ title: 'Sinkronisasi' }} />
    </Stack>
  );
}
