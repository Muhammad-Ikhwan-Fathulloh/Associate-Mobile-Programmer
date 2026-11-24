import * as Location from 'expo-location';

export type Alasan = 'izin' | 'gps' | 'waktu' | 'lain';

export type HasilLokasi =
  | { ok: true; latitude: number; longitude: number }
  | { ok: false; alasan: Alasan; pesan: string };

export const PESAN_LOKASI: Record<Alasan, string> = {
  izin: 'Izin lokasi ditolak. Entri tetap disimpan tanpa koordinat.',
  gps: 'GPS mati. Aktifkan GPS lalu coba lagi.',
  waktu: 'Lokasi terlalu lama didapat. Coba lagi di tempat terbuka.',
  lain: 'Lokasi tidak dapat dibaca.',
};

/** Meminta izin saat tombol ditekan, bukan saat aplikasi dibuka. Kegagalan dikembalikan sebagai nilai. */
export async function ambilLokasi(batasMs = 10000): Promise<HasilLokasi> {
  const gagal = (alasan: Alasan): HasilLokasi => ({ ok: false, alasan, pesan: PESAN_LOKASI[alasan] });
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return gagal('izin');
    if (!(await Location.hasServicesEnabledAsync())) return gagal('gps');

    let timer: ReturnType<typeof setTimeout> | undefined;
    const batas = new Promise<never>((_, tolak) => {
      timer = setTimeout(() => tolak(new Error('waktu habis')), batasMs);
    });
    try {
      const p = await Promise.race([Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }), batas]);
      return { ok: true, latitude: p.coords.latitude, longitude: p.coords.longitude };
    } finally {
      clearTimeout(timer);
    }
  } catch (e) {
    return gagal((e as Error).message === 'waktu habis' ? 'waktu' : 'lain');
  }
}
