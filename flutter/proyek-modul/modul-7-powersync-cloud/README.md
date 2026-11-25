# Modul 7 Flutter (PowerSync Cloud): Catatan dengan Sinkronisasi Otomatis

Proyek ini adalah versi lain dari modul 7. Sinkronisasi tidak ditulis sendiri. Sebagai gantinya, [PowerSync](https://powersync.com) menyinkronkan SQLite di perangkat dengan basis data [Supabase](https://supabase.com) (PostgreSQL) yang berjalan di PowerSync Cloud.

Proyek modul 7 yang asli tetap ada di [../modul-7-sinkronisasi-offline-first](../modul-7-sinkronisasi-offline-first/README.md). Materi konsepnya ada di [PowerSync: sinkronisasi SQLite dengan basis data server](../../../shared/docs/powersync.md).

## Yang perlu Anda siapkan

Langkah ini dikerjakan sendiri, karena membutuhkan akun dan kunci milik Anda:

1. **Akun Supabase** (paket gratis, lihat batasan di dashboard). Buat project baru dan catat **Project URL** dan **publishable key** (atau anon key) dari **Project Settings > API**. Jangan pernah memakai service_role key di aplikasi.
2. **Anonymous sign-in**: di dashboard Supabase, aktifkan **Anonymous sign-ins** pada pengaturan autentikasi. Aplikasi masuk secara anonim, jadi tidak ada form login.
3. **Tabel dan aturan akses**: buka **SQL Editor** di Supabase, lalu jalankan:

```sql
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null default '',
  content text not null default ''
);

alter table public.notes enable row level security;

create policy "pemilik bisa baca" on public.notes for select using (auth.uid() = user_id);
create policy "pemilik bisa tambah" on public.notes for insert with check (auth.uid() = user_id);
create policy "pemilik bisa ubah" on public.notes for update using (auth.uid() = user_id);
create policy "pemilik bisa hapus" on public.notes for delete using (auth.uid() = user_id);

create publication powersync for all tables;
```

Jika publication `powersync` sudah ada, lewati baris terakhir. Aturan `auth.uid()` membuat setiap pengguna anonim hanya melihat catatannya sendiri.

4. **PowerSync Cloud**: daftar di [dashboard PowerSync](https://dashboard.powersync.com), buat instance, lalu di **Database Connection** masukkan detail basis data Supabase Anda. Ikuti panduan koneksi Supabase di dokumentasi PowerSync, karena host dan pengguna diambil dari halaman Connect di Supabase.
5. **Client Auth**: atur PowerSync agar memverifikasi token dari Supabase. Ikuti bagian Supabase di dokumentasi PowerSync, lalu periksa alamat JWKS dan audience yang disarankan di sana.
6. **Sync Streams**: deploy aturan berikut di Dashboard (**Sync Streams**). Periksa dulu sintaks fungsi `auth.user_id()` di dokumentasi terbaru, karena sintaks bisa berubah:

```yaml
config:
  edition: 3
streams:
  notes_saya:
    auto_subscribe: true
    query: SELECT * FROM notes WHERE user_id = auth.user_id()
```

7. **Isi konfigurasi aplikasi**: ganti tiga nilai di `lib/config.dart`:
   - `supabaseUrl`: Project URL Supabase.
   - `supabaseAnonKey`: publishable key atau anon key.
   - `powersyncUrl`: URL instance PowerSync Cloud.

## Menjalankan

Proyek ini hanya untuk Android. Penyimpanan lokal memakai SQLite native, jadi web tidak didukung.

Jika folder `android/` belum ada, jalankan `flutter create . --platforms android` sekali. Berkas di `lib/` dan `test/` tidak akan ditimpa.

```powershell
flutter pub get
flutter devices
flutter run
```

Pakai emulator atau HP fisik. Panduan lengkapnya ada di [menjalankan proyek](../../../shared/docs/menjalankan-proyek.md).

Uji:

```powershell
flutter test
flutter analyze
```

## Cara kerjanya

1. Aplikasi masuk secara anonim ke Supabase, lalu membuka SQLite lokal lewat PowerSync.
2. Catatan baru langsung masuk ke SQLite lokal, jadi tetap bisa dibuat tanpa internet.
3. PowerSync mengirim tulisan yang antre ke Supabase lewat `uploadData` di `lib/data/connector.dart`.
4. Perubahan dari perangkat lain yang cocok dengan Sync Streams diterima otomatis dan langsung tampil lewat `watch`.

Padanan dengan modul 7 yang asli:

| Modul 7 asli | Proyek ini |
|---|---|
| Status `PENDING` dan `SYNCED` | Antrean unggah dalam SDK |
| `sinkronkan()` memanggil POST dan PUT | `uploadData` memanggil `upsert` dan `update` Supabase |
| Ambil daftar dari server | Sync Streams mengirim data otomatis |

## Hal yang perlu diperhatikan

- **Kunci**: publishable key boleh ada di aplikasi, tetapi token dan kata sandi rahasia tidak boleh masuk repositori.
- **Aturan akses**: tanpa RLS di Supabase, data semua pengguna bisa terbaca. Jangan dimatikan.
- **Galat izin**: jika uploadData gagal terus, periksa aturan RLS dan kolom yang dikirim.
- **Batasan gratis**: kuota paket gratis Supabase dan PowerSync Cloud belum saya cek. Lihat halaman harga masing-masing.

## Status verifikasi

- `flutter analyze`: tanpa isu.
- `flutter test`: lulus.
- `flutter build apk --debug`: berhasil.
- Sinkronisasi ke Supabase dan PowerSync Cloud belum diuji, karena memerlukan akun dan konfigurasi Anda.
