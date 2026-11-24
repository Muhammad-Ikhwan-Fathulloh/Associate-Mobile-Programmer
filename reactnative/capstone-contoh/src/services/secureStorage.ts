import * as SecureStore from 'expo-secure-store';

// Token disimpan di penyimpanan aman perangkat (Keystore atau Keychain), bukan di SQLite.
const KUNCI = 'token_jurnal';

export const simpanToken = (nilai: string) => SecureStore.setItemAsync(KUNCI, nilai);
export const bacaToken = () => SecureStore.getItemAsync(KUNCI);
export const hapusToken = () => SecureStore.deleteItemAsync(KUNCI);
