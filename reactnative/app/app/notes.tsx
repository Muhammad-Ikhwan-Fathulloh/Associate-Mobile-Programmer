import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { Tombol } from '../src/components/Tombol';
import { hapusCatatan, semuaCatatan } from '../src/data/noteRepository';
import { formatKoordinat, Note } from '../src/models/note';
import { gaya } from '../src/ui';

export default function Catatan() {
  const router = useRouter();
  const [data, setData] = useState<Note[]>([]);

  const muat = useCallback(async () => setData(await semuaCatatan()), []);
  useFocusEffect(useCallback(() => { muat(); }, [muat]));

  const hapus = (n: Note) =>
    Alert.alert('Hapus catatan?', n.title, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: async () => { await hapusCatatan(n.id!); muat(); } },
    ]);

  return (
    <View style={gaya.layar}>
      <Tombol label="Tambah Catatan" onPress={() => router.push('/note-form')} />
      <FlatList
        data={data}
        keyExtractor={(n) => String(n.id)}
        ListEmptyComponent={<Text style={gaya.abu}>Belum ada catatan.</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={gaya.kartu}
            onPress={() => router.push({ pathname: '/note-form', params: { id: String(item.id) } })}
            onLongPress={() => hapus(item)}
          >
            <Text style={gaya.judul}>{item.title}</Text>
            <Text style={gaya.teks} numberOfLines={2}>{item.content}</Text>
            {formatKoordinat(item) && <Text style={gaya.abu}>Lokasi: {formatKoordinat(item)}</Text>}
            <Text style={gaya.abu}>Status sinkron: {item.syncStatus} · tahan lama untuk menghapus</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
