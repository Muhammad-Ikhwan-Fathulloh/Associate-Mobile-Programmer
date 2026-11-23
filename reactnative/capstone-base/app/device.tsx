import * as Device from 'expo-device';
import { Text, View } from 'react-native';
import { gaya } from '../src/ui';

export default function Perangkat() {
  const baris: [string, string][] = [
    ['Produsen', Device.manufacturer ?? '-'],
    ['Model', Device.modelName ?? '-'],
    ['Sistem operasi', `${Device.osName ?? '-'} ${Device.osVersion ?? ''}`],
    ['Memori total', Device.totalMemory ? `${(Device.totalMemory / 1024 ** 3).toFixed(1)} GB` : '-'],
    ['Perangkat fisik', Device.isDevice ? 'Ya' : 'Emulator'],
  ];
  return (
    <View style={gaya.layar}>
      <View style={gaya.kartu}>
        {baris.map(([k, v]) => (
          <Text key={k} style={gaya.teks}>{k}: {v}</Text>
        ))}
      </View>
    </View>
  );
}
