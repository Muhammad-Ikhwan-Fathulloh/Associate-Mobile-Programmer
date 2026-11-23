# Modul 8: Latihan dan Persiapan Uji Kompetensi

**Durasi:** 15.00 to 17.00

**Unit kompetensi BNSP:** Semua unit

## Pengantar

Ini sesi penutup dan persiapan uji kompetensi. Kita menjalankan seluruh aplikasi seperti pengguna baru, menjalankan pengujian otomatis, dan menyiapkan bukti untuk tiap unit kompetensi. Beri waktu peserta berlatih menjelaskan hasil kerjanya dengan kata-kata sendiri, karena asesor biasanya meminta peserta menjelaskan, bukan hanya menunjukkan.

## Tujuan Pembelajaran

1. Menjalankan seluruh fitur aplikasi.
2. Menjalankan pengujian otomatis.
3. Menyiapkan bukti kompetensi untuk BNSP.
4. Mengerjakan latihan soal.

## 1. Daftar periksa aplikasi

- Catatan: tambah, ubah, hapus, data tetap ada setelah aplikasi ditutup.
- Lokasi: izin diminta saat tombol ditekan, peta dan jarak tampil.
- Jaringan: label sesuai kondisi, aplikasi tetap berfungsi offline.
- Sensor dan perangkat: angka tampil, langganan dihentikan.
- Keamanan: HTTP ditolak, token tersimpan aman.

> **Narasi pengajar:** Gunakan daftar ini seperti pengguna baru: buka setiap menu, coba jalur normal, lalu coba jalur gagal seperti menolak izin dan mematikan internet. Peserta mencentang satu per satu. Yang gagal dicatat dan diperbaiki sebelum lanjut.

## 2. Pengujian otomatis

Menguji jalur berhasil dan gagal tanpa internet memakai `fetch` palsu. Berkas `__tests__/https.test.ts`:

```ts
import { ambilJson, periksaUrlAman } from '../src/services/httpsService';

const fakeFetch = (status: number, body: unknown) =>
  (async () => ({ status, json: async () => body })) as unknown as typeof fetch;

describe('periksaUrlAman', () => {
  it('menolak http', () => expect(periksaUrlAman('http://a.com')).toBe('Gunakan HTTPS (https://).'));
  it('menolak teks bukan URL', () => expect(periksaUrlAman('bukan url')).toBe('URL tidak valid.'));
  it('menerima https', () => expect(periksaUrlAman('https://a.com/x')).toBeNull());
});

describe('ambilJson', () => {
  it('mengembalikan JSON saat status 200', async () => {
    await expect(ambilJson('https://a.com', fakeFetch(200, { ok: 1 }))).resolves.toEqual({ ok: 1 });
  });
  it('melempar error saat status bukan 200', async () => {
    await expect(ambilJson('https://a.com', fakeFetch(500, {}))).rejects.toThrow('status 500');
  });
  it('menolak URL http tanpa memanggil jaringan', async () => {
    const spy = jest.fn();
    await expect(ambilJson('http://a.com', spy as unknown as typeof fetch)).rejects.toThrow('HTTPS');
    expect(spy).not.toHaveBeenCalled();
  });
  it('membatalkan permintaan saat timeout', async () => {
    const lambat = ((_: string, opt: RequestInit) =>
      new Promise((_res, rej) => opt.signal!.addEventListener('abort', () => rej(new Error('aborted'))))) as unknown as typeof fetch;
    await expect(ambilJson('https://a.com', lambat, 20)).rejects.toThrow('aborted');
  });
});
```

> **Narasi pengajar:** Pengujian otomatis adalah jaring pengaman. Buka simulasi: sisipkan bug lupa memangkas spasi, jalankan npm test, dan lihat tes menjadi merah dengan pesan yang menunjuk tepat ke kegagalan. Pesan ini menghemat jam-jam mencari kesalahan. Ingatkan juga bahwa uji yang baik mencakup jalur berhasil dan jalur gagal.

## 3. Menyiapkan bukti BNSP

- Siapkan aplikasi yang berjalan di perangkat atau emulator.
- Tunjukkan file kode yang menjadi bukti tiap unit (lihat peta kompetensi).
- Jalankan `npm test` dan `npm run typecheck` sebagai bukti kualitas.
- Latih penjelasan lisan: apa yang dibuat, mengapa, dan bagaimana mengujinya.

> **Narasi pengajar:** Asesor ingin melihat dua hal: aplikasi berjalan, dan peserta paham yang dibuatnya. Siapkan satu file bukti untuk setiap unit dan latih penjelasan dua menit: apa yang dibuat, mengapa dipilih, dan bagaimana mengujinya. Jalankan npm test sebagai bukti kualitas.

## Latihan

1. Kerjakan latihan soal BNSP di `flutter/slides/latihan-soal-bnsp.html` (soal konseptual berlaku untuk kedua teknologi).
2. Jalankan seluruh aplikasi dari awal tanpa melihat catatan.
3. Jelaskan satu fitur kepada teman dalam dua menit.

## Peta Kompetensi BNSP

Unit **Semua unit**. Elemen yang dinilai:

- Seluruh elemen tujuh unit kompetensi

Bukti pada pelatihan ini: aplikasi berjalan, `npm test` lulus, `npm run typecheck` bersih, hasil latihan soal.

Praktik langkah demi langkah: [hands-on Hari 2, Step 6 sampai 8](../hands-on/hari-2.md).
