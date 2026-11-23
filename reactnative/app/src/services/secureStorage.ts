import * as SecureStore from 'expo-secure-store';

const KUNCI = 'token_demo';

export const simpanToken = (nilai: string) => SecureStore.setItemAsync(KUNCI, nilai);
export const bacaToken = () => SecureStore.getItemAsync(KUNCI);
export const hapusToken = () => SecureStore.deleteItemAsync(KUNCI);
