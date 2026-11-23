#!/usr/bin/env python3
"""Membuat bank soal (markdown), deck latihan soal interaktif, dan deck panduan sertifikasi BNSP.

Pemakaian: python3 scripts/build_bnsp.py
"""
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from bank_soal_data import UNITS  # noqa: E402

L = "ABCD"


def esc(s):
    return html.escape(s, quote=False)


def inline(s):
    s = esc(s)
    return re.sub(r"`([^`]+)`", r"<code>\1</code>", s)


# ------------------------------------------------------------ markdown
def build_md():
    out = [
        "# Bank Soal Latihan Uji Kompetensi",
        "",
        "Soal latihan untuk tujuh unit kompetensi skema Associate Mobile Programmer. Setiap unit memuat 6 soal pilihan ganda, 2 soal uraian atau wawancara, dan 1 tugas praktik dengan kriteria penilaian.",
        "",
        "Soal ini dibuat untuk latihan, bukan soal resmi LSP. Bentuk dan bobot uji sebenarnya ditetapkan oleh LSP pelaksana.",
        "",
        "Cara memakai: kerjakan soal tanpa melihat kunci. Hitung benar per unit. Targetnya minimal 5 dari 6 benar. Unit di bawah target dibaca ulang pada modul terkait. Versi interaktif tersedia di `slides/latihan-soal-bnsp.html`.",
        "",
    ]
    for u in UNITS:
        out += [f"## Unit {u['no']}. {u['judul']}", "", f"Kode: {u['kode']}. Modul: {u['modul']}.", "", "### Pilihan Ganda", ""]
        for i, (q, opts, a, w) in enumerate(u["pg"], 1):
            out.append(f"{i}. {q}")
            for k, o in enumerate(opts):
                out.append(f"   {L[k]}. {o}")
            out.append("")
        out += ["### Uraian atau Wawancara", ""]
        for i, (q, a) in enumerate(u["esai"], 1):
            out.append(f"{i}. {q}")
        out += ["", "### Tugas Praktik", "", u["praktik"][0], "", "Kriteria penilaian:", ""]
        for c in u["praktik"][1]:
            out.append(f"- [ ] {c}")
        out.append("")
    out += ["---", "", "# Kunci dan Pembahasan", ""]
    for u in UNITS:
        out += [f"## Unit {u['no']}. {u['judul']}", "", "### Pilihan Ganda", "", "| No | Jawaban | Pembahasan |", "|---|---|---|"]
        for i, (q, opts, a, w) in enumerate(u["pg"], 1):
            out.append(f"| {i} | {L[a]} | {w} |")
        out += ["", "### Poin Jawaban Uraian", ""]
        for i, (q, a) in enumerate(u["esai"], 1):
            out.append(f"{i}. {a}")
        out.append("")
    (ROOT / "docs/sertifikasi-bnsp/03-bank-soal.md").write_text("\n".join(out), encoding="utf-8")


# ------------------------------------------------------------ slides
def sec(kicker, title, body, cls=""):
    c = f"slide {cls}".strip()
    return (
        f'  <section class="{c}">\n    <!--split--><div class="split"><div class="main">\n'
        f'    <p class="kicker">{esc(kicker)}</p>\n    <h2>{esc(title)}</h2>\n{body}\n'
        f"    </div></div><!--/split-->\n  </section>\n"
    )


def hero(kicker, title, body):
    return (
        '  <section class="slide">\n    <!--split--><div class="split"><div class="main">\n'
        f'    <p class="kicker">{esc(kicker)}</p>\n    <h1>{esc(title)}</h1>\n{body}\n'
        "    </div></div><!--/split-->\n  </section>\n"
    )


def table(head, rows):
    h = "".join(f"<th>{esc(x)}</th>" for x in head)
    r = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in row) + "</tr>" for row in rows)
    return f"<table><tr>{h}</tr>{r}</table>"


def page(title, slides, home="index.html"):
    return f"""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(title)}</title>
  <link rel="stylesheet" href="../../shared/assets/slides.css">
</head>
<body class="praktik">
<div class="deck">

{chr(10).join(slides)}
</div>

<div class="progress" id="progress"></div>
<div class="nav">
  <a class="home" href="{home}">Indeks</a>
  <button id="prev" type="button">Sebelumnya</button>
  <span class="counter" id="counter"></span>
  <button id="next" type="button">Berikutnya</button>
</div>

<script src="../../shared/assets/highlight.js"></script>
<script src="../../shared/assets/slides.js"></script>
<script src="../../shared/assets/quiz.js"></script>
</body>
</html>
"""


def build_quiz():
    s = [hero("Persiapan Sertifikasi BNSP", "Latihan Soal Uji Kompetensi", (
        "<h2>Associate Mobile Programmer</h2>"
        "<p>42 soal pilihan ganda, 14 soal uraian, dan 7 tugas praktik untuk tujuh unit kompetensi.</p>"
        "<ul><li>Klik pilihan jawaban atau tekan tombol A, B, C, D</li>"
        "<li>Pembahasan muncul setelah menjawab</li>"
        "<li>Slide terakhir menampilkan skor per unit. Target: 5 dari 6 benar</li></ul>"
    ))]
    for u in UNITS:
        s.append(sec(f"Unit {u['no']} · {u['kode']}", u["judul"], (
            f"<p>Materi: Modul {u['modul']}. Kerjakan 6 soal pilihan ganda, 2 soal uraian, dan 1 tugas praktik.</p>"
            f'<p class="note">Target unit ini: benar minimal 5 dari 6 soal pilihan ganda.</p>'
        )))
        for i, (q, opts, a, w) in enumerate(u["pg"], 1):
            btns = "".join(
                f'<button type="button" class="opt" data-i="{k}"><b>{L[k]}</b><span>{inline(o)}</span></button>' for k, o in enumerate(opts)
            )
            s.append(sec(f"Unit {u['no']} · Soal {i} dari 6", "Pilih Jawaban", (
                f'<div class="quizq" data-unit="{u["no"]}" data-ans="{a}">'
                f'<p class="qtext">{inline(q)}</p><div class="opts">{btns}</div>'
                f'<div class="why" hidden><b>Pembahasan</b> {inline(w)}</div></div>'
            ), "quiz"))
        qs = "".join(
            f'<div class="esai"><p><strong>{i}.</strong> {inline(q)}</p>'
            f'<button type="button" class="sbtn alt reveal">Tampilkan poin jawaban</button>'
            f'<div class="why" hidden><b>Poin jawaban</b> {inline(a)}</div></div>'
            for i, (q, a) in enumerate(u["esai"], 1)
        )
        s.append(sec(f"Unit {u['no']} · Uraian dan Wawancara", "Jawab dengan Kata Sendiri", qs, "quiz"))
        crit = "".join(f"<li>{inline(c)}</li>" for c in u["praktik"][1])
        s.append(sec(f"Unit {u['no']} · Tugas Praktik", "Kerjakan di Proyek Latihan", (
            f"<p>{inline(u['praktik'][0])}</p><h3>Kriteria penilaian</h3><ul class=\"check\">{crit}</ul>"
        ), "quiz"))
    rows = "".join(f'<tr><td>Unit {u["no"]}. {esc(u["judul"])}</td><td class="skor" data-unit="{u["no"]}">0 / 6</td><td class="stat" data-unit="{u["no"]}">belum dikerjakan</td></tr>' for u in UNITS)
    s.append(sec("Hasil", "Skor Latihan", (
        f'<table><tr><th>Unit</th><th>Skor</th><th>Status</th></tr>{rows}</table>'
        '<p class="note">Status Siap bila benar minimal 5 dari 6. Ulangi modul terkait untuk unit yang belum siap.</p>'
    ), "quiz"))
    (ROOT / "slides/latihan-soal-bnsp.html").write_text(page("Latihan Soal Uji Kompetensi BNSP", s), encoding="utf-8")


def build_panduan():
    s = [hero("Persiapan Sertifikasi BNSP", "Panduan Sertifikasi", (
        "<h2>Associate Mobile Programmer</h2>"
        "<p>Standar acuan: SKKNI Mobile Computing, Kepmenaker Nomor 458 Tahun 2015. Tujuh unit kompetensi, dinilai oleh LSP berlisensi BNSP.</p>"
    ))]
    s.append(sec("Skema", "Tujuh Unit Kompetensi", table(
        ["Kode", "Judul unit", "Modul"],
        [[u["kode"], u["judul"], f"Modul {u['modul']}"] for u in sorted(UNITS, key=lambda x: x["kode"])],
    )))
    s.append(sec("Alur", "Alur Asesmen Kompetensi", (
        "<ol><li><strong>Pendaftaran</strong> dan kelengkapan dokumen</li>"
        "<li><strong>Asesmen mandiri</strong> dengan bukti pendukung</li>"
        "<li><strong>Uji kompetensi</strong>: tulis, praktik, atau wawancara sesuai skema</li>"
        "<li><strong>Keputusan</strong>: Kompeten (K) atau Belum Kompeten (BK)</li>"
        "<li><strong>Umpan balik</strong> dan hak banding</li>"
        "<li><strong>Sertifikat</strong> kompetensi dari LSP</li></ol>"
    )))
    s.append(sec("Penilaian", "Yang Dinilai Asesor", table(
        ["Jenis bukti", "Contoh pada pelatihan ini"],
        [["Pengetahuan", "Menjelaskan 4G dan 5G, fungsi TLS, autentikasi dan otorisasi"],
         ["Keterampilan", "Form validasi, CRUD SQLite, membaca sensor, memanggil API HTTPS"],
         ["Hasil kerja", "Proyek `app/` berjalan dan tes lulus"],
         ["Sikap kerja", "Mengikuti pedoman kode, menangani error, menjaga keamanan data"]],
    )))
    s.append(sec("Prinsip", "Prinsip Penilaian", table(
        ["Prinsip", "Arti bagi peserta"],
        [["Valid", "Bukti sesuai unit yang dinilai"], ["Reliabel", "Hasil konsisten bila dinilai ulang"],
         ["Fleksibel", "Metode dapat disesuaikan, standar tetap"], ["Adil", "Semua peserta dinilai dengan standar sama"],
         ["Terkini, asli, cukup", "Bukti baru, karya sendiri, memadai"]],
    )))
    s.append(sec("Strategi", "Persiapan Sebelum Uji", (
        "<ol><li>Selesaikan praktik Hari 1 dan Hari 2 sampai aplikasi berjalan</li>"
        "<li>Kerjakan latihan soal. Target benar minimal 5 dari 6 per unit</li>"
        "<li>Latih menjelaskan tiap unit dua menit dengan kata sendiri</li>"
        "<li>Ulang unit yang paling lemah</li>"
        "<li>Siapkan dokumen dan perangkat uji</li></ol>"
    )))
    s.append(sec("Strategi", "Saat Uji Berlangsung", (
        "<ol><li>Baca soal sampai selesai, kerjakan yang paling dikuasai dahulu</li>"
        "<li>Pada soal praktik, kerjakan apa yang diminta kriteria lebih dulu</li>"
        "<li>Jelaskan alasan tiap keputusan kepada asesor</li>"
        "<li>Tanyakan kebijakan pengulangan unit kepada LSP</li></ol>"
    )))
    s.append(sec("Daftar Periksa", "Kesiapan Administrasi dan Teknis", (
        '<ul class="check"><li>Fotokopi KTP dan pas foto sesuai ketentuan LSP</li>'
        "<li>Bukti pelatihan dan formulir asesmen mandiri</li>"
        "<li>Flutter SDK dan Android Studio siap, <code>flutter doctor</code> bersih</li>"
        "<li><code>flutter test</code> pada proyek <code>app/</code> lulus</li>"
        "<li>Emulator atau ponsel Android siap</li>"
        "<li>Mengetahui jadwal, lokasi, dan bentuk uji</li></ul>"
    )))
    for u in UNITS:
        pass
    s.append(sec("Catatan", "Konfirmasi dengan LSP", (
        "<p>Bentuk uji, durasi, dan rincian elemen mengikuti skema LSP pelaksana. Minta dokumen skema dan formulir asesmen mandiri dari panitia sebelum Hari 3.</p>"
        "<p>Materi lengkap: <code>docs/sertifikasi-bnsp/</code> di repositori ini.</p>"
    )))
    (ROOT / "slides/sertifikasi-bnsp.html").write_text(page("Panduan Sertifikasi BNSP", s), encoding="utf-8")


if __name__ == "__main__":
    build_md()
    build_quiz()
    build_panduan()
    print("selesai")
