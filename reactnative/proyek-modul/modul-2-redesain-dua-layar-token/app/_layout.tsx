import { Stack } from 'expo-router';
import { tema } from '../src/theme';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tema.warna.utama },
        headerTintColor: tema.warna.tombolTeks,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Beranda' }} />
      <Stack.Screen name="daftar" options={{ title: 'Daftar' }} />
    </Stack>
  );
}
