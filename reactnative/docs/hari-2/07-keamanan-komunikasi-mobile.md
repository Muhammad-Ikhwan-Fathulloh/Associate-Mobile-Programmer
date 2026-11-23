# Modul 7: Keamanan Komunikasi Mobile

**Durasi:** 13.00 to 15.00

**Unit kompetensi BNSP:** J.612000.008.01

## Pengantar

Aplikasi menyimpan dan mengirim data yang berharga, dan jaringan nirkabel mudah disadap. Modul ini membahas ancaman yang paling umum, lalu pertahanan yang bisa kita tulis sendiri: HTTPS, batas waktu, penyimpanan rahasia yang aman, dan validasi masukan. Pesannya: keamanan bukan fitur tambahan di akhir, melainkan kebiasaan sejak baris kode pertama.

## Tujuan Pembelajaran

1. Menjelaskan ancaman pada komunikasi nirkabel.
2. Menerapkan HTTPS dan menolak HTTP.
3. Menyimpan token dengan aman.
4. Menerapkan validasi masukan dan timeout.

## 1. Ancaman komunikasi nirkabel

| Ancaman | Cara kerja | Pencegahan |
|---|---|---|
| Penyadapan (sniffing) | Membaca lalu lintas Wi-Fi terbuka | HTTPS, hindari Wi-Fi terbuka |
| Man-in-the-middle | Penyerang berada di tengah jalur | TLS dengan sertifikat valid |
| Access point palsu | Wi-Fi tiruan menjebak pengguna | Verifikasi jaringan, pakai VPN |
| Pencurian token | Rahasia dibaca dari penyimpanan biasa | Penyimpanan aman |

> **Narasi pengajar:** Mulai dengan skenario: Anda memakai Wi-Fi gratis di kafe. Apa yang bisa dilihat orang lain di jaringan yang sama? Dari situ kita bahas penyadapan, man-in-the-middle, dan access point palsu. Buka simulasi TLS untuk melihat bedanya data terbuka dan data terenkripsi.

## 2. HTTPS dan timeout

Tolak URL non-HTTPS, batasi waktu dengan `AbortController`, periksa status. Berkas `src/services/httpsService.ts`:

```ts
/** Mengembalikan pesan error jika URL tidak aman, atau null jika URL aman. */
export function periksaUrlAman(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return 'URL tidak valid.';
  }
  if (u.protocol !== 'https:') return 'Gunakan HTTPS (https://).';
  return null;
}

type FetchFn = typeof fetch;

export async function ambilJson(
  url: string,
  fetchFn: FetchFn = fetch,
  batasMs = 10000,
): Promise<unknown> {
  const pesan = periksaUrlAman(url);
  if (pesan) throw new Error(pesan);

  const kontrol = new AbortController();
  const timer = setTimeout(() => kontrol.abort(), batasMs);
  try {
    const res = await fetchFn(url.trim(), {
      headers: { Accept: 'application/json' },
      signal: kontrol.signal,
    });
    if (res.status !== 200) throw new Error(`Server merespons status ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}
```

> **Narasi pengajar:** Dua kebiasaan dalam satu fungsi. Pertama, tolak alamat selain HTTPS sebelum permintaan dikirim. Kedua, batasi waktu tunggu agar aplikasi tidak menggantung. Buka simulasi pemeriksa URL, ketik beberapa alamat, dan lihat mana yang ditolak.

## 3. Penyimpanan aman

Token disimpan di Keystore Android atau Keychain iOS. Berkas `src/services/secureStorage.ts`:

```ts
import * as SecureStore from 'expo-secure-store';

const KUNCI = 'token_demo';

export const simpanToken = (nilai: string) => SecureStore.setItemAsync(KUNCI, nilai);
export const bacaToken = () => SecureStore.getItemAsync(KUNCI);
export const hapusToken = () => SecureStore.deleteItemAsync(KUNCI);
```

> **Narasi pengajar:** Token dan kata sandi tidak boleh disimpan sebagai teks biasa. Secure store memakai Keystore di Android dan Keychain di iOS, yang dilindungi perangkat keras. Buka simulasinya: simpan, baca, hapus. Tekankan bahwa tempat ini untuk rahasia kecil, bukan untuk data besar.

## 4. Prinsip pengamanan aplikasi

- Selalu **HTTPS**. Jangan menonaktifkan pemeriksaan sertifikat.
- Rahasia di **secure store**, bukan di SQLite atau teks biasa.
- **Validasi masukan** di aplikasi dan di server.
- Jangan menaruh API key rahasia di dalam kode aplikasi.
- Minta **izin seperlunya** dan jelaskan alasannya.

> **Narasi pengajar:** Rangkum dengan lima prinsip yang bisa dicek di kode: selalu HTTPS, rahasia di secure store, validasi masukan, jangan taruh kunci rahasia di dalam aplikasi, dan minta izin seperlunya. Buka simulasi autentikasi: login untuk mendapat token, lalu coba endpoint dengan dan tanpa token. Diskusikan mengapa token itu harus disimpan di secure store.

## Latihan

1. Uji alamat `http://` dan pastikan ditolak.
2. Simpan, baca, dan hapus token lewat halaman keamanan.
3. Tambahkan validasi agar URL kosong menampilkan pesan khusus.

## Peta Kompetensi BNSP

Unit **J.612000.008.01**. Elemen yang dinilai:

- Mengenali kerentanan komunikasi nirkabel
- Menerapkan pengamanan komunikasi
- Menerapkan penyimpanan dan masukan yang aman

Bukti pada pelatihan ini: `src/services/httpsService.ts`, `src/services/secureStorage.ts`, `app/keamanan.tsx`.

Praktik langkah demi langkah: [hands-on Hari 2, Step 4 dan 5](../hands-on/hari-2.md).
