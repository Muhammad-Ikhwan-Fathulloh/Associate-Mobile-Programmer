import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#1565c0' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="index" options={{ title: 'Tempat Favorit' }} />
      <Stack.Screen name="tambah" options={{ title: 'Tambah Tempat' }} />
    </Stack>
  );
}
