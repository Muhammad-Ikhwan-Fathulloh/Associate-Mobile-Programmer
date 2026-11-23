# Modul 6: Mobile Sensor dan Spesifikasi Perangkat

**Durasi:** 10.00 to 12.00

**Unit kompetensi BNSP:** J.612000.022.01

## Pengantar

Setelah API, kita beralih ke sensor. Ponsel merasakan percepatan, putaran, dan medan magnet. Peserta membaca akselerometer, giroskop, dan magnetometer, mendeteksi guncangan, lalu membuat kompas sederhana. Satu pelajaran penting: sensor menguras baterai, jadi berhenti membaca saat halaman ditutup. Sampaikan juga bahwa kompas sederhana punya batas akurasi.

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

## 3. Giroskop dan kompas

- **Giroskop** mengukur laju putar (rad/s). Sudut didapat dengan mengakumulasi laju terhadap waktu, hasilnya cenderung bergeser (drift).
- **Magnetometer** mengukur medan magnet bumi. Arah kompas dihitung dari komponen x dan y.
- Padukan sensor (sensor fusion) untuk arah yang stabil. Di pelatihan ini pendekatan sederhana dipakai dan diberi catatan akurasinya.

> **Narasi pengajar:** Buka simulasi giroskop dan geser sumbu z. Perhatikan bahwa giroskop memberi kecepatan putar, bukan sudut. Sudut didapat dengan menjumlahkan kecepatan terhadap waktu, dan hasilnya perlahan bergeser. Itu sebabnya kompas membutuhkan magnetometer.

## 4. Membaca akselerometer

Berlangganan dengan `addListener`, berhenti dengan `remove`. Berkas `app/sensor.tsx`:

```tsx
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { arahKompas, besarVektor, mataAngin, terdeteksiGuncangan, Vektor } from '../src/services/sensorMath';
import { gaya } from '../src/ui';

const NOL: Vektor = { x: 0, y: 0, z: 0 };

type Sumber = {
  isAvailableAsync: () => Promise<boolean>;
  setUpdateInterval: (ms: number) => void;
  addListener: (fn: (v: Vektor) => void) => { remove: () => void };
};

/** Berlangganan satu sensor, dan berhenti saat halaman ditutup. */
function useSensor(sensor: Sumber, intervalMs = 300) {
  const [nilai, setNilai] = useState<Vektor>(NOL);
  const [tersedia, setTersedia] = useState<boolean | null>(null);

  useEffect(() => {
    let langganan: { remove: () => void } | undefined;
    sensor.isAvailableAsync().then((ok) => {
      setTersedia(ok);
      if (!ok) return;
      sensor.setUpdateInterval(intervalMs);
      langganan = sensor.addListener(setNilai);
    });
    return () => langganan?.remove();
  }, [sensor, intervalMs]);

  return { nilai, tersedia };
}

const f = (n: number) => n.toFixed(2);

export default function Sensor() {
  const akselerometer = useSensor(Accelerometer);
  const giroskop = useSensor(Gyroscope);
  const magnetometer = useSensor(Magnetometer);
  const derajat = arahKompas(magnetometer.nilai);

  return (
    <ScrollView style={gaya.layar}>
      <View style={gaya.kartu}>
        <Text style={gaya.judul}>Akselerometer</Text>
        {akselerometer.tersedia === false && <Text style={gaya.error}>Sensor tidak tersedia.</Text>}
        <Text style={gaya.teks}>X {f(akselerometer.nilai.x)}  Y {f(akselerometer.nilai.y)}  Z {f(akselerometer.nilai.z)} (g)</Text>
        <Text style={gaya.teks}>Besar total: {f(besarVektor(akselerometer.nilai))} g</Text>
        <Text style={gaya.teks}>{terdeteksiGuncangan(akselerometer.nilai) ? 'Guncangan terdeteksi!' : 'Tidak ada guncangan'}</Text>
        <Text style={gaya.abu}>Diam di meja: Z mendekati 1 g karena gravitasi.</Text>
      </View>

      <View style={gaya.kartu}>
        <Text style={gaya.judul}>Giroskop</Text>
        {giroskop.tersedia === false && <Text style={gaya.error}>Sensor tidak tersedia.</Text>}
        <Text style={gaya.teks}>X {f(giroskop.nilai.x)}  Y {f(giroskop.nilai.y)}  Z {f(giroskop.nilai.z)} (rad/s)</Text>
        <Text style={gaya.abu}>Mengukur laju putaran. Diam di meja: mendekati 0.</Text>
      </View>

      <View style={gaya.kartu}>
        <Text style={gaya.judul}>Magnetometer (kompas)</Text>
        {magnetometer.tersedia === false && <Text style={gaya.error}>Sensor tidak tersedia.</Text>}
        <Text style={gaya.teks}>Perkiraan arah: {Math.round(derajat)}° ({mataAngin(derajat)})</Text>
        <Text style={gaya.abu}>Letakkan ponsel datar. Hasil berupa perkiraan dan terganggu logam di sekitar.</Text>
      </View>
    </ScrollView>
  );
}
```

> **Narasi pengajar:** Inti slide ini ada di dua baris: addListener untuk mulai berlangganan dan remove untuk berhenti. Buka simulasi useEffect: matikan cleanup, buka halaman, lalu tekan render ulang beberapa kali. Perhatikan jumlah pendengar menumpuk. Itulah kebocoran yang menguras baterai, dan itu sebabnya cleanup wajib ditulis.

## 5. Menghitung guncangan dan arah

Fungsi murni, mudah diuji: besar vektor, deteksi guncangan, arah kompas, dan mata angin. Berkas `src/services/sensorMath.ts`:

```ts
export type Vektor = { x: number; y: number; z: number };

/** Besar vektor tiga sumbu. Diam di meja, akselerometer (satuan g) bernilai sekitar 1. */
export function besarVektor(v: Vektor): number {
  return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

/** Guncangan terdeteksi bila besar percepatan melewati ambang (satuan g). */
export function terdeteksiGuncangan(v: Vektor, ambang = 2): boolean {
  return besarVektor(v) > ambang;
}

/**
 * Perkiraan arah kompas (derajat, 0 = utara, searah jarum jam) dari magnetometer
 * saat ponsel datar. Hasilnya perkiraan: sumbu sensor dapat berbeda antarperangkat.
 */
export function arahKompas(m: Pick<Vektor, 'x' | 'y'>): number {
  const derajat = (Math.atan2(-m.x, m.y) * 180) / Math.PI;
  return (derajat + 360) % 360;
}

export function mataAngin(derajat: number): string {
  const nama = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
  return nama[Math.round((((derajat % 360) + 360) % 360) / 45) % 8];
}
```

> **Narasi pengajar:** Fungsi di berkas ini murni, jadi mudah diuji tanpa perangkat. Tunjukkan ambang 2 g untuk guncangan dan jelaskan bahwa arah kompas adalah pendekatan sederhana yang dipengaruhi benda logam di sekitar ponsel.

## 6. Informasi perangkat

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

## 7. Praktik baik penggunaan sensor

- Periksa ketersediaan sensor sebelum memakai.
- Pilih interval pembaruan secukupnya agar baterai hemat.
- Hentikan langganan saat halaman ditutup.
- Kumpulkan data perangkat seperlunya demi privasi.

> **Narasi pengajar:** Empat kebiasaan: periksa dulu apakah sensor ada, pilih interval secukupnya, hentikan langganan saat halaman ditutup, dan kumpulkan data seperlunya. Minta peserta memilih satu yang paling sering dilupakan, lalu jelaskan dampaknya pada baterai.

## Latihan

1. Ubah interval sensor dan amati perubahan angka.
2. Guncang ponsel dan pastikan pesan guncangan tampil (besar lebih dari 2 g).
3. Putar ponsel dan amati giroskop serta arah kompas.

## Peta Kompetensi BNSP

Unit **J.612000.022.01**. Elemen yang dinilai:

- Mengenali jenis sensor
- Menggunakan data sensor pada aplikasi
- Menentukan spesifikasi perangkat

Bukti pada pelatihan ini: `app/sensor.tsx`, `app/device.tsx`, langganan dihentikan saat halaman ditutup.

Praktik langkah demi langkah: [hands-on Hari 2, Step 3 dan 4](../hands-on/hari-2.md).
