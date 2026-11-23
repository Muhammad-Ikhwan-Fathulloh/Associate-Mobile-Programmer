# Modul 6: Mobile Sensor dan Spesifikasi Perangkat

**Durasi:** 10.00 to 12.00

**Unit kompetensi BNSP:** J.612000.022.01

## Pengantar

Ponsel bukan hanya layar dan prosesor. Di dalamnya ada sensor yang merasakan gerakan, cahaya, arah, dan tekanan. Modul ini memperkenalkan jenis sensor dan cara aplikasi membacanya, lalu bagaimana membaca spesifikasi perangkat. Satu pelajaran penting: sensor menguras baterai bila tidak dihentikan, jadi berhenti membaca saat tidak diperlukan.

## Tujuan Pembelajaran

1. Menyebutkan jenis sensor ponsel dan fungsinya.
2. Membaca akselerometer dengan expo-sensors.
3. Membaca informasi perangkat.
4. Menghentikan langganan sensor dengan benar.

## 1. Jenis sensor

| Sensor | Mengukur | Contoh penggunaan |
|---|---|---|
| Akselerometer | Percepatan | Hitung langkah, deteksi guncangan |
| Giroskop | Laju putaran | Game, stabilisasi |
| Magnetometer | Medan magnet | Kompas |
| Sensor cahaya | Kecerahan | Kecerahan layar otomatis |
| Sensor jarak | Dekat atau jauh | Layar mati saat telepon ke telinga |
| Barometer | Tekanan udara | Perkiraan ketinggian |

> **Narasi pengajar:** Ajak peserta mengeluarkan ponsel dan menebak sensor mana yang aktif saat layar otomatis menjadi lebih terang, atau saat layar mati ketika ponsel ditempelkan ke telinga. Buka simulasi akselerometer, geser nilai sumbu X, Y, dan Z, dan lihat besar percepatan totalnya. Simulasi memakai satuan m/s², sedangkan expo-sensors melaporkan dalam g. Diam di meja, nilainya sekitar 9,8 m/s² atau 1 g.

## 2. Rantai sensor

- Sensor mengukur besaran fisik, lalu diubah menjadi sinyal listrik.
- Konverter analog ke digital (ADC) menghasilkan angka.
- Prosesor dan sistem operasi menyediakan angka itu bagi aplikasi.
- Protokol antarmuka umum ke chip sensor: **I2C** dan **SPI**.

> **Narasi pengajar:** Sensor mengukur besaran fisik, lalu diubah menjadi sinyal listrik, didigitalkan oleh ADC, diproses prosesor, dan akhirnya sampai ke aplikasi. Protokol I2C dan SPI adalah jalur chip sensor berbicara dengan prosesor. Cukup kenali namanya dan perannya.

## 3. Membaca akselerometer

Berlangganan dengan `addListener`, berhenti dengan `remove`. Berkas `app/sensor.tsx`:

```tsx
import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { gaya } from '../src/ui';

export default function Sensor() {
  const [a, setA] = useState({ x: 0, y: 0, z: 0 });
  const [tersedia, setTersedia] = useState<boolean | null>(null);

  useEffect(() => {
    let langganan: { remove: () => void } | undefined;
    Accelerometer.isAvailableAsync().then((ok) => {
      setTersedia(ok);
      if (!ok) return;
      Accelerometer.setUpdateInterval(300);
      langganan = Accelerometer.addListener(setA);
    });
    return () => langganan?.remove();
  }, []);

  const besar = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
  return (
    <View style={gaya.layar}>
      <View style={gaya.kartu}>
        <Text style={gaya.judul}>Akselerometer</Text>
        {tersedia === false && <Text style={gaya.error}>Sensor tidak tersedia di perangkat ini.</Text>}
        <Text style={gaya.teks}>X: {a.x.toFixed(2)}  Y: {a.y.toFixed(2)}  Z: {a.z.toFixed(2)} (satuan g)</Text>
        <Text style={gaya.teks}>Besar total: {besar.toFixed(2)} g</Text>
        <Text style={gaya.abu}>Diam di meja: Z mendekati 1 g karena gravitasi.</Text>
      </View>
    </View>
  );
}
```

> **Narasi pengajar:** Inti slide ini ada di dua baris: addListener untuk mulai berlangganan dan remove untuk berhenti. Buka simulasi useEffect: matikan cleanup, buka halaman, lalu tekan render ulang beberapa kali. Perhatikan jumlah pendengar menumpuk. Itulah kebocoran yang menguras baterai, dan itu sebabnya cleanup wajib ditulis.

## 4. Informasi perangkat

Model, OS, dan memori. Nilai kosong diganti tanda hubung. Berkas `app/device.tsx`:

```tsx
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
```

> **Narasi pengajar:** Informasi perangkat membantu kita menyesuaikan aplikasi dan membaca laporan bug. Perhatikan penanganan nilai kosong: di emulator beberapa nilai tidak tersedia, jadi kita beri tanda hubung. Sampaikan pula soal privasi: kumpulkan hanya yang benar-benar diperlukan.

## 5. Praktik baik penggunaan sensor

- Periksa ketersediaan sensor sebelum memakai.
- Pilih interval pembaruan secukupnya agar baterai hemat.
- Hentikan langganan saat halaman ditutup.
- Kumpulkan data perangkat seperlunya demi privasi.

> **Narasi pengajar:** Empat kebiasaan: periksa dulu apakah sensor ada, pilih interval secukupnya, hentikan langganan saat halaman ditutup, dan kumpulkan data seperlunya. Minta peserta memilih satu yang paling sering dilupakan, lalu jelaskan dampaknya pada baterai.

## Latihan

1. Ubah interval sensor dan amati perubahan angka.
2. Deteksi guncangan: tampilkan pesan saat besar total lebih dari 2 g.
3. Tampilkan resolusi layar dengan `Dimensions`.

## Peta Kompetensi BNSP

Unit **J.612000.022.01**. Elemen yang dinilai:

- Mengenali jenis sensor
- Menggunakan data sensor pada aplikasi
- Menentukan spesifikasi perangkat

Bukti pada pelatihan ini: `app/sensor.tsx`, `app/device.tsx`, langganan dihentikan saat halaman ditutup.

Praktik langkah demi langkah: [hands-on Hari 2, Step 2 dan 3](../hands-on/hari-2.md).
