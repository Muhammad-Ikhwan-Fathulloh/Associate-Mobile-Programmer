import * as Network from 'expo-network';
import { labelJaringan } from '../src/services/networkService';

const s = (isConnected: boolean, type: Network.NetworkStateType) => ({ isConnected, type } as Network.NetworkState);

describe('labelJaringan', () => {
  it('seluler', () => expect(labelJaringan(s(true, Network.NetworkStateType.CELLULAR))).toBe('Seluler'));
  it('wifi', () => expect(labelJaringan(s(true, Network.NetworkStateType.WIFI))).toBe('Wi-Fi'));
  it('terputus', () => expect(labelJaringan(s(false, Network.NetworkStateType.NONE))).toBe('Tidak ada koneksi'));
});
