# Dari Desain ke Kode dengan Google Antigravity

Panduan ini untuk sesi Hari 1 (10.00 to 12.00), terutama jalur Flutter. Antigravity adalah platform pengembangan agentik dari Google (IDE dengan panel Agent, plus versi CLI). Fitur, menu, dan nama berkas konfigurasinya cepat berubah, jadi cek dokumentasi terbaru sebelum sesi:

- Flutter dan Antigravity: https://docs.flutter.dev/ai/antigravity
- Server MCP Dart dan Flutter: https://docs.flutter.dev/ai/mcp-server
- Codelab Design-to-Code dengan Antigravity dan Stitch MCP: https://codelabs.developers.google.com/design-to-code-with-antigravity-stitch

## Alur

1. **Desain**: buat di Google Stitch lalu rapikan di Figma (lihat [design-figma-stitch.md](design-figma-stitch.md)), atau pakai berkas contoh pelatihan.
2. **Sambungkan sumber desain ke agen** lewat MCP, agar agen membaca desain langsung, bukan dari tangkapan layar:
   - Stitch punya server MCP. Buat kunci API di pengaturan Stitch, lalu tambahkan server pada **Agent panel, menu (...), MCP Servers** di Antigravity (ikuti codelab di atas).
   - Figma punya server MCP resmi untuk membaca desain (variable, struktur layar). Beberapa fitur butuh kursi berbayar.
3. **Sambungkan alat Flutter**: server MCP Dart dan Flutter membiarkan agen membaca analisis kode dan menjalankan perintah proyek. Contoh konfigurasi dari dokumentasi Flutter (letak berkas bisa berbeda per versi):

```json
{
  "mcpServers": {
    "dart": { "command": "dart", "args": ["mcp-server"] }
  }
}
```

4. **Beri prompt berkonteks** (contoh di bawah), tinjau rencana dan diff yang diusulkan agen, jangan terima begitu saja.
5. **Verifikasi sendiri**: `flutter analyze`, `flutter test`, jalankan di emulator, bandingkan dengan desain.

## Contoh prompt (Flutter)

```text
Konteks: proyek Flutter flutter/app (go_router, sqflite). Token desain ada di
lib/theme/tema.dart dan sama dengan variable Figma. Desain: berkas Figma / proyek Stitch
yang terhubung lewat MCP, layar "02 Catatan".
Tugas: implementasikan layar Catatan agar sesuai desain memakai kelas Tema, tanpa angka
warna atau jarak mentah. Jangan ubah logika data. Target sentuh tombol minimal 48 dp.
Setelah selesai jalankan flutter analyze dan flutter test, lalu laporkan hasilnya.
```

## Yang perlu diwaspadai

- Hasil agen adalah usulan. Periksa diff, terutama perubahan di luar berkas yang diminta.
- Jangan menaruh kunci API, token, atau kata sandi di prompt atau di repositori. Kunci Stitch disimpan di konfigurasi lokal, bukan di Git.
- Izinkan agen menjalankan perintah terminal hanya setelah membaca perintahnya.
- Desain contoh pelatihan: https://www.figma.com/design/grYqOsULGfzYsDrtIjmjRL
