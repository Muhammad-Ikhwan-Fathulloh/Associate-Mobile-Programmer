import * as Network from 'expo-network';

export type JenisJaringan = 'Seluler' | 'Wi-Fi' | 'Tidak ada koneksi' | 'Lainnya';

/** Menerjemahkan hasil expo-network menjadi label bahasa Indonesia. */
export function labelJaringan(s: Network.NetworkState): JenisJaringan {
  if (!s.isConnected) return 'Tidak ada koneksi';
  if (s.type === Network.NetworkStateType.CELLULAR) return 'Seluler';
  if (s.type === Network.NetworkStateType.WIFI) return 'Wi-Fi';
  return 'Lainnya';
}

export async function cekJaringan() {
  const state = await Network.getNetworkStateAsync();
  return { label: labelJaringan(state), terhubung: !!state.isConnected };
}
