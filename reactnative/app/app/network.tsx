import * as Network from 'expo-network';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Tombol } from '../src/components/Tombol';
import { cekJaringan } from '../src/services/networkService';
import { gaya, warna } from '../src/ui';

export default function Jaringan() {
  const [info, setInfo] = useState<{ label: string; terhubung: boolean } | null>(null);
  const [ip, setIp] = useState('-');

  const muat = async () => {
    setInfo(await cekJaringan());
    setIp(await Network.getIpAddressAsync().catch(() => '-'));
  };
  useEffect(() => { muat(); }, []);

  return (
    <View style={gaya.layar}>
      <View style={gaya.kartu}>
        <Text style={gaya.judul}>{info?.label ?? 'Memeriksa...'}</Text>
        <Text style={[gaya.teks, { color: info?.terhubung ? warna.ok : warna.bahaya }]}>
          {info?.terhubung ? 'Terhubung ke internet' : 'Tidak terhubung'}
        </Text>
        <Text style={gaya.abu}>Alamat IP perangkat: {ip}</Text>
      </View>
      <Tombol label="Periksa Ulang" onPress={muat} />
    </View>
  );
}
