import { proyek } from './proyek.config';

// Alamat server API. Ubah di src/proyek.config.ts.
//  - Emulator Android: http://10.0.2.2:3000 (alamat komputer dari dalam emulator)
//  - Ponsel dengan Expo Go: http://<IP komputer>:3000 (komputer dan ponsel satu Wi-Fi)
//  - Produksi: wajib https://
export const API_URL_BAWAAN: string = proyek.urlServer;
