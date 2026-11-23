import { Pressable, Text } from 'react-native';
import { gaya, warna } from '../ui';

type Props = { label: string; onPress: () => void; bahaya?: boolean; testID?: string };

export function Tombol({ label, onPress, bahaya, testID }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={[gaya.tombol, bahaya && { backgroundColor: warna.bahaya }]}
    >
      <Text style={gaya.tombolTeks}>{label}</Text>
    </Pressable>
  );
}
