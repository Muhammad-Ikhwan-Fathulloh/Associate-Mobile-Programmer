#!/usr/bin/env python3
"""Menyisipkan slide Peta Kompetensi BNSP dan Materi Penunjang ke deck modul.

Pemakaian: python3 scripts/build_modul_bnsp.py   (aman dijalankan berulang)
"""
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def esc(s):
    return html.escape(s, quote=False)


def inline(s):
    return re.sub(r"`([^`]+)`", r"<code>\1</code>", esc(s))


def sec(kicker, title, body):
    return (
        f'  <section class="slide">\n    <!--split--><div class="split"><div class="main">\n'
        f'    <p class="kicker">{esc(kicker)}</p>\n    <h2>{esc(title)}</h2>\n{body}\n'
        f"    </div></div><!--/split-->\n  </section>\n"
    )


def table(head, rows):
    h = "".join(f"<th>{esc(x)}</th>" for x in head)
    r = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in row) + "</tr>" for row in rows)
    return f"<table><tr>{h}</tr>{r}</table>"


def ol(items):
    return "<ol>" + "".join(f"<li>{inline(i)}</li>" for i in items) + "</ol>"


MODUL = {
    "hari-1-modul-1-platform-dan-bahasa.html": dict(
        kode="J.612000.001.01", judul="Platform Operating System dan Bahasa Pemrograman",
        elemen=["Mengenali jenis platform OS mobile", "Menentukan platform OS sesuai kebutuhan pengguna", "Menjelaskan bahasa pemrograman mobile"],
        bukti="Tabel Android dan iOS, `dasar.dart`, counter, `flutter analyze` bersih",
        extra=[("Memilih Platform OS Sesuai Kebutuhan", table(["Pilihan", "Kelebihan", "Keterbatasan"], [
            ["Native Android", "Akses penuh, kinerja terbaik", "Satu platform"],
            ["Native iOS", "Akses penuh fitur iOS", "Perlu macOS dan Xcode"],
            ["Flutter atau React Native", "Satu basis kode, cepat dibuat", "Fitur khusus butuh plugin"],
            ["PWA", "Tanpa toko aplikasi", "Akses perangkat terbatas"]])),
            ("Kriteria Memilih Platform", ol(["Siapa pengguna dan perangkat apa yang dipakai", "Fitur perangkat yang dibutuhkan: kamera, sensor, GPS", "Anggaran, waktu, dan keahlian tim", "Kebutuhan kinerja dan pemeliharaan jangka panjang"]))],
    ),
    "hari-1-modul-2-mobile-interface.html": dict(
        kode="J.612000.007.01", judul="Merancang Mobile Interface",
        elemen=["Menentukan alat perancangan antarmuka", "Memilih informasi yang ditampilkan per layar", "Membuat aksi dan desain estetis per layar"],
        bukti="Halaman beranda, daftar, form validasi, tema Material 3, grid responsif",
        extra=[("Langkah Merancang Antarmuka", ol(["Kebutuhan pengguna dan tugas utama", "Daftar layar dan isi tiap layar", "Wireframe (kertas atau alat desain seperti Figma)", "Prototipe yang dapat diklik", "Implementasi widget Flutter", "Uji kegunaan dan perbaikan"])),
               ("Prinsip Desain Mobile", table(["Prinsip", "Penerapan"], [["Satu tujuan utama per layar", "Aksi utama tampil menonjol"], ["Target sentuh besar", "Tombol mudah diketuk"], ["Konsisten", "Tema, ikon, istilah sama"], ["Umpan balik", "Indikator memuat, SnackBar, pesan error"]]))],
    ),
    "hari-1-modul-3-database-persistence.html": dict(
        kode="J.612000.003.01", judul="Database dan Data Persistence pada Mobile Data",
        elemen=["Mendesain internal storage", "Mendesain external storage", "Mendesain database SQLite", "Mendesain database mobile dengan model berlapis"],
        bukti="`app_database.dart`, `note_repository.dart`, controller, bukti data persisten",
        extra=[("Penyimpanan Internal dan Eksternal", table(["Jenis", "Isi", "Cara di Flutter"], [
            ["Internal (private)", "Berkas dan pengaturan aplikasi", "`path_provider`, `shared_preferences`"],
            ["Eksternal (shared)", "Foto dan unduhan yang dibagikan", "`path_provider`, pemilih berkas, perhatikan izin"],
            ["SQLite", "Data terstruktur", "`sqflite`"],
            ["Secure storage", "Token dan rahasia", "`flutter_secure_storage`"]])),
            ("Model Berlapis dan Server", table(["Lapisan", "Tugas", "Pada proyek app/"], [
                ["Presentasi", "Tampilan dan aksi", "`lib/pages/`"], ["State", "Data yang tampil", "`note_controller.dart`"],
                ["Repository", "Perantara sumber data", "`note_repository.dart`"], ["Sumber data", "SQLite dan API", "`app_database.dart`, `https_service.dart`"]])),
            ("Alur Integrasi dengan Server", ol(["Data ditulis ke SQLite dengan status `PENDING`", "Saat online, repository mengirim data `PENDING` ke server lewat HTTPS", "Server menerima, status menjadi `SYNCED`", "Gagal, status tetap `PENDING` dan dicoba lagi"]))],
    ),
    "hari-1-modul-4-lokasi-gps-navigasi.html": dict(
        kode="J.612000.006.01", judul="Mobile Location Based Service, GPS dan Mobile Navigation",
        elemen=["Menentukan lokasi dengan perangkat mobile", "Menentukan lokasi pengguna dengan LBS", "Menentukan lokasi pengguna dengan GPS", "Menerapkan mobile navigation"],
        bukti="Alur izin, posisi `geolocator`, reverse geocoding, peta dan jarak Haversine",
        extra=[("Sumber Lokasi", table(["Sumber", "Cara kerja", "Akurasi dan daya"], [
            ["GPS", "Sinyal satelit", "Akurat di luar ruangan, boros baterai"], ["Wi-Fi", "Daftar jaringan sekitar", "Baik di dalam ruangan"],
            ["Cell-ID", "Menara terdekat", "Kasar, hemat baterai"], ["Gabungan", "Sistem memilih terbaik", "Seimbang"]])),
            ("Komponen Aplikasi Navigasi", ol(["Posisi pengguna (GPS atau sumber lain)", "Tujuan: koordinat atau alamat (geocoding)", "Rute dari layanan routing", "Panduan belok dan pembaruan posisi berkala (`getPositionStream`)", "Privasi: izin seperlunya dan persetujuan pengguna"]))],
    ),
    "hari-2-modul-5-mobile-cellular-network.html": dict(
        kode="J.612000.025.01", judul="Mobile Cellular Network",
        elemen=["Menjelaskan mobile cellular network", "Mengidentifikasi protokol dan fitur", "Menjelaskan arsitektur GSM", "Menjelaskan mobile phone network", "Menjelaskan proses pada konsep mobile IP"],
        bukti="Tabel generasi, diagram GSM, penjelasan handover dan mobile IP, `connectivity_plus`",
        extra=[("Arsitektur GSM", table(["Komponen", "Peran"], [
            ["MS", "Perangkat dan kartu SIM"], ["BTS", "Menara radio"], ["BSC", "Mengatur banyak BTS dan handover"], ["MSC", "Pusat penyambungan panggilan"],
            ["HLR", "Data pelanggan tetap"], ["VLR", "Data sementara pelanggan tamu"], ["AuC dan EIR", "Kunci autentikasi dan identitas perangkat"]])),
            ("Mobile IP: Istilah", table(["Istilah", "Arti"], [
                ["Mobile Node", "Perangkat yang berpindah jaringan"], ["Home Address", "Alamat IP tetap di jaringan asal"], ["Home Agent", "Router jaringan asal"],
                ["Foreign Agent", "Router jaringan tamu"], ["Care-of Address", "Alamat sementara di jaringan tamu"]])),
            ("Mobile IP: Proses", ol(["Penemuan agen: perangkat tahu sedang di jaringan tamu", "Registrasi care-of address ke Home Agent", "Tunneling: paket ke home address diteruskan ke care-of address", "Pengiriman: paket dibuka dan diterima perangkat"]))],
    ),
    "hari-2-modul-6-mobile-sensor-spesifikasi.html": dict(
        kode="J.612000.022.01", judul="Mobile Sensor dan Spesifikasi Teknis untuk Mobile Computing",
        elemen=["Menunjukkan node sensor pada mobile computing", "Menunjukkan desain hardware sensor", "Menunjukkan desain protokol", "Menunjukkan aspek keamanan pada mobile sensor"],
        bukti="Daftar sensor, diagram alur sensor ke aplikasi, `sensor_page.dart`, `device_page.dart`",
        extra=[("Alur Sensor ke Aplikasi", ol(["Transducer: besaran fisik menjadi sinyal listrik", "ADC: sinyal menjadi angka digital", "Prosesor atau sensor hub: menyaring dan menggabungkan data", "Driver dan API sistem operasi", "Aplikasi berlangganan stream dan memprosesnya"])),
               ("Protokol Sensor", table(["Lingkup", "Protokol"], [["Di dalam perangkat", "I2C, SPI"], ["Nirkabel jarak dekat", "Bluetooth Low Energy"], ["Jaringan sensor", "Zigbee"], ["Ke server", "HTTPS, MQTT"]])),
               ("Keamanan Sensor", table(["Risiko", "Perlindungan"], [["Privasi: mikrofon, kamera, lokasi", "Izin eksplisit dan tujuan jelas"], ["Data dikirim tanpa enkripsi", "HTTPS atau TLS"], ["Dibaca di latar belakang", "Pakai seperlunya, batalkan langganan"], ["Data palsu", "Validasi di server"]]))],
    ),
    "hari-2-modul-7-keamanan-komunikasi-mobile.html": dict(
        kode="J.612000.008.01", judul="Dasar-Dasar Mobile Communication Security",
        elemen=["Menjelaskan dasar keamanan komunikasi mobile", "Menjelaskan kerentanan wireless", "Menjelaskan tipe serangan pada lingkungan mobile", "Menjelaskan teknik perlindungan pada sistem mobile"],
        bukti="`https_service.dart`, `secure_storage_service.dart`, penjelasan serangan dan perlindungan",
        extra=[("Kerentanan Jaringan Nirkabel", table(["Kerentanan", "Penjelasan"], [["Wi-Fi terbuka", "Lalu lintas tidak terenkripsi"], ["Enkripsi lemah", "Standar usang seperti WEP mudah dibobol"], ["Rogue access point", "Titik akses palsu bernama mirip"], ["Bluetooth terbuka", "Perangkat mudah ditemukan"]])),
               ("Tipe Serangan Mobile", table(["Serangan", "Pencegahan"], [["Sniffing", "Enkripsi, hindari Wi-Fi tak terlindungi"], ["Man-in-the-middle", "HTTPS dengan verifikasi sertifikat"], ["Phishing", "Edukasi, unduh dari toko resmi"], ["Malware", "Izin minimal, pembaruan"], ["Injeksi data", "Validasi input"]])),
               ("Teknik Perlindungan", ol(["Enkripsi saat transit: HTTPS atau TLS", "Enkripsi saat disimpan: secure storage", "Autentikasi kuat dan otorisasi di server", "Validasi input dan izin minimal", "Perbarui dependensi dan sistem operasi", "Jangan mencatat rahasia di log"]))],
    ),
    "hari-2-modul-8-latihan-uji-kompetensi.html": dict(
        kode="Tujuh unit", judul="Latihan Uji Kompetensi dan Pembahasan",
        elemen=["Mengerjakan latihan soal tiap unit", "Membahas jawaban dan kesalahan umum", "Menyusun rencana belajar mandiri"],
        bukti="Skor latihan soal, tiga tugas praktik, rencana belajar mandiri",
        extra=[("Bahan Latihan Sertifikasi", table(["Bahan", "Lokasi"], [["Panduan sertifikasi", "`slides/sertifikasi-bnsp.html`"], ["Latihan soal interaktif (42 soal)", "`slides/latihan-soal-bnsp.html`"], ["Bank soal dan kunci", "`docs/sertifikasi-bnsp/03-bank-soal.md`"], ["Pemetaan unit dan elemen", "`docs/sertifikasi-bnsp/01-pemetaan-unit-kompetensi.md`"]])),
               ("Target Kesiapan", ol(["Benar minimal 5 dari 6 soal pada setiap unit", "Dapat menjelaskan tiap unit dua menit dengan kata sendiri", "Tiga tugas praktik Modul 8 selesai tanpa melihat jawaban", "`flutter test` pada `app/` lulus"]))],
    ),
}

START, END = "<!--bnsp-start-->", "<!--bnsp-end-->"
PSTART, PEND = "<!--bnsp-peta-start-->", "<!--bnsp-peta-end-->"


def main():
    for fn, d in MODUL.items():
        p = ROOT / "slides" / fn
        t = p.read_text(encoding="utf-8")
        t = re.sub(re.escape(START) + r".*?" + re.escape(END) + r"\n\n", "", t, flags=re.S)
        t = re.sub(re.escape(PSTART) + r".*?" + re.escape(PEND) + r"\n\n", "", t, flags=re.S)
        peta = sec("Sertifikasi BNSP", "Peta Kompetensi: " + d["kode"], (
            f"<h3>{esc(d['judul'])}</h3><p><strong>Elemen yang dinilai:</strong></p>{ol(d['elemen'])}"
            f"<p><strong>Bukti pada pelatihan ini:</strong> {inline(d['bukti'])}</p>"
        ))
        block1 = PSTART + "\n" + peta + PEND + "\n\n"
        i = t.index("</section>") + len("</section>\n\n")
        t = t[:i] + block1 + t[i:]
        slides = [sec("Materi Sesuai Elemen SKKNI", title, body) for title, body in d["extra"]]
        block2 = START + "\n" + "\n".join(slides) + END + "\n\n"
        j = t.index("<!--praktik-start-->")
        t = t[:j] + block2 + t[j:]
        p.write_text(t, encoding="utf-8")
        print(fn, len(re.findall(r'<section class="slide', t)))


if __name__ == "__main__":
    main()
