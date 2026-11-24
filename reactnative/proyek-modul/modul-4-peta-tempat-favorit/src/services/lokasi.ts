import * as Location from 'expo-location';
import { Koordinat } from '../models/tempat';

export type Alasan = 'izin' | 'gps' | 'waktu' | 'lain';

export type HasilLokasi = ({ ok: true } & Koordinat) | { ok: false; alasan: Alasan; pesan: string };

export const PESAN_GAGAL: Record<Alasan, string> = {
  izin: 'Izin lokasi ditolak. Tempat tetap disimpan tanpa koordinat.',
  gps: 'GPS mati. Aktifkan GPS lalu coba lagi.',
  waktu: 'Lokasi terlalu lama didapat. Coba lagi di tempat terbuka.',
  lain: 'Lokasi tidak dapat dibaca.',
};

const gagal = (alasan: Alasan): HasilLokasi => ({ ok: false, alasan, pesan: PESAN_GAGAL[alasan] });

/**
 * Meminta izin saat tombol ditekan (bukan saat aplikasi dibuka), lalu membaca posisi.
 * Semua kegagalan dikembalikan sebagai hasil, tidak sebagai pengecualian yang lolos.
 */
export async function ambilLokasi(batasMs = 10000): Promise<HasilLokasi> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return gagal('izin');
    if (!(await Location.hasServicesEnabledAsync())) return gagal('gps');

    let timer: ReturnType<typeof setTimeout> | undefined;
    const batas = new Promise<never>((_, tolak) => {
      timer = setTimeout(() => tolak(new Error('waktu habis')), batasMs);
    });
    try {
      const posisi = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
        batas,
      ]);
      return { ok: true, latitude: posisi.coords.latitude, longitude: posisi.coords.longitude };
    } finally {
      clearTimeout(timer);
    }
  } catch (e) {
    return gagal((e as Error).message === 'waktu habis' ? 'waktu' : 'lain');
  }
}
