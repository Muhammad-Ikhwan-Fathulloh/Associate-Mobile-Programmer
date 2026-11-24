#!/usr/bin/env python3
"""Membuat brief proyek (shared/docs/proyek/*.md) dan deck proyek akhir (slides/proyek-akhir.html).

Pemakaian: python3 scripts/build_proyek.py
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_modul import PAGE, esc, html_table, inline, sec  # noqa: E402
from modul_data import MODUL  # noqa: E402
from proyek_data import CAPSTONE, PROYEK  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT.parent / "shared" / "docs" / "proyek"
BYLINE = "by [Muhammad Ikhwan Fathulloh](https://one.nocturnailed.com/)"


def slug(t):
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


def nama_berkas(n):
    return f"modul-{n}-{slug(PROYEK[n]['judul'])}.md"


def md_rubrik(r):
    return ["| Aspek | Poin |", "|---|---|"] + [f"| {a} | {p} |" for a, p in r] + [f"| **Total** | **{sum(p for _, p in r)}** |"]


# Gambar contoh hasil per modul (Flutter), sama dengan README dan slide modul Flutter.
DEMO_FLUTTER = {
    1: ["modul1_halaman1.png"],
    2: ["modul2_halaman1.png", "modul2_halaman2.png"],
    3: ["modul3_halaman1.png", "modul3_halaman2.png", "modul3_halaman3.png", "modul3_halaman4.png"],
    4: ["modul4_halaman1.png", "modul4_halaman2.png", "modul4_halaman3.png", "modul4_halaman4.png", "modul4_halaman5.png"],
    5: ["modul5_halaman1.png", "modul5_halaman2.png", "modul5_halaman3.png", "modul5_mockapi1.png", "modul5_mockapi2.png", "modul5_mockapi3.png", "modul5_mockapi4.png", "modul5_mockapi5.png", "modul5_mockapi6.png", "modul5_mockapi7.png"],
    6: ["modul6_halaman1.png"],
    7: ["modul7_halaman1.png"],
    8: ["modul8_halaman1.png"],
}


def bagian_demo(n):
    L = ["", "## Contoh hasil (Flutter)", "", f"Tangkapan layar hasil menjalankan proyek modul {n} (sama dengan README proyek dan slide).", ""]
    for i, g in enumerate(DEMO_FLUTTER[n], 1):
        L += [f"![Contoh hasil modul {n} {i}](../../../images/flutter/modul{n}/{g})", ""]
    return L


def md_proyek(n):
    p = PROYEK[n]
    m = next(x for x in MODUL if x["n"] == n)
    L = [f"# Proyek Modul {n}: {p['judul']}", "", f"Modul {n}: {m['judul']} · Estimasi {p['waktu']} · Unit BNSP {m['unit']}", "", BYLINE, "", "## Skenario", "", p["skenario"], "", "## Yang harus dibuat", ""]
    L += [f"- [ ] {x}" for x in p["wajib"]]
    L += ["", "## Kriteria penerimaan", "", "Proyek dianggap selesai bila semua ini dapat didemonstrasikan:", ""] + [f"- {x}" for x in p["kriteria"]]
    L += ["", "## Petunjuk React Native", ""] + [f"- {x}" for x in p["rn"]]
    L += ["", "## Petunjuk Flutter", ""] + [f"- {x}" for x in p["flutter"]]
    L += ["", "## Tantangan tambahan", ""] + [f"- {x}" for x in p["tantangan"]]
    L += ["", "## Rubrik (100 poin)", ""] + md_rubrik(p["rubrik"])
    L += ["", "## Hubungan dengan proyek akhir", "", f"Hasil proyek ini dapat dipakai sebagai bagian proyek akhir. Lihat [proyek akhir](capstone.md) dan matriks fitur di dalamnya.", ""]
    L += bagian_demo(n)
    return "\n".join(L)


def md_capstone():
    c = CAPSTONE
    L = [f"# {c['judul']}", "", BYLINE, "", "## Skenario", "", c["skenario"], "", "## Pilih satu tema", "", "| Tema | Gambaran |", "|---|---|"]
    L += [f"| {a} | {b} |" for a, b in c["tema"]]
    L += ["", "Anda boleh membuat tema sendiri selama memenuhi matriks fitur.", "", "## Proyek dasar (base)", "",
          "- React Native: `reactnative/capstone-base` (lihat `README.md` di dalamnya).",
          "- Flutter: `flutter/capstone-base` (sudah diuji: `flutter analyze` dan `flutter test` lulus).",
          "", "Proyek dasar sudah berisi struktur berlapis, tema, SQLite, GPS, klien API, sinkronisasi, dan sensor. Ubah `proyek.config` untuk identitas aplikasi Anda, lalu kerjakan slot bertanda `TODO(peserta)`.", "",
          "## Matriks fitur wajib", "", "| Modul | Topik | Yang harus ada |", "|---|---|---|"]
    L += [f"| {a} | {b} | {d} |" for a, b, d in c["matriks"]]
    L += ["", "## Syarat tambahan", ""] + [f"- [ ] {x}" for x in c["wajib"]]
    L += ["", "## Tahapan kerja", "", "| Tahap | Kegiatan |", "|---|---|"] + [f"| {a} | {b} |" for a, b in c["tahapan"]]
    L += ["", "## Rubrik (100 poin)", ""] + md_rubrik(c["rubrik"])
    L += ["", "## Yang dikumpulkan", "", "- Folder proyek (tanpa `node_modules`).", "- `README.md` berisi cara menjalankan, fitur, dan tangkapan layar.", "- Tabel bukti kompetensi (tujuh unit).", "- Demo lima menit.", "",
          "## Daftar proyek modul", ""] + [f"- Modul {n}: [{PROYEK[n]['judul']}]({nama_berkas(n)})" for n in sorted(PROYEK)] + [""]
    return "\n".join(L)


def md_indeks():
    L = ["# Proyek Pelatihan", "", BYLINE, "",
         "Setiap modul punya satu proyek kecil, dan semuanya bermuara pada satu proyek akhir. Proyek modul boleh dikerjakan di proyek terpisah atau langsung sebagai bagian proyek akhir.", "",
         "| Modul | Proyek | Estimasi |", "|---|---|---|"]
    L += [f"| {n} | [{PROYEK[n]['judul']}]({nama_berkas(n)}) | {PROYEK[n]['waktu']} |" for n in sorted(PROYEK)]
    L += ["", f"**Proyek akhir:** [{CAPSTONE['judul']}](capstone.md). Proyek dasar tersedia di `reactnative/capstone-base` dan `flutter/capstone-base`.", ""]
    return "\n".join(L)


def html_capstone():
    c = CAPSTONE
    ref = 'Dokumen: <a href="../../shared/docs/proyek/capstone.md">shared/docs/proyek/capstone.md</a>'
    s = []
    s.append(
        '  <section class="slide">\n    <!--split--><div class="split"><div class="main">\n'
        '    <p class="kicker">Proyek Akhir</p>\n'
        f'    <h1>{esc(c["judul"])}</h1><p style="margin:.2rem 0 1rem">by <a href="https://one.nocturnailed.com/" target="_blank" rel="noopener">Muhammad Ikhwan Fathulloh</a></p><p>{inline(c["skenario"])}</p>\n'
        f'    </div></div><!--/split-->\n    <p class="ref">{ref}</p>\n  </section>\n'
    )
    s.append(sec("Pilih tema", "Enam Ide Tema", html_table(["Tema", "Gambaran"], c["tema"]), ref=ref))
    s.append(sec("Proyek dasar", "Mulai dari Capstone Base", "<ul>" + "".join(f"<li>{inline(x)}</li>" for x in [
        "React Native: `reactnative/capstone-base`. Flutter: `flutter/capstone-base`.",
        "Sudah ada: struktur berlapis, tema, SQLite, GPS, klien API, sinkronisasi, sensor, dan tes.",
        "Ubah `proyek.config` untuk nama aplikasi, nama entri, dan warna.",
        "Kerjakan slot bertanda `TODO(peserta)` lalu tambahkan fitur kreatif.",
    ]) + "</ul>", ref=ref))
    s.append(sec("Syarat", "Matriks Fitur Wajib", html_table(["Modul", "Topik", "Yang harus ada"], c["matriks"]), ref=ref))
    s.append(sec("Tahapan", "Lima Tahap Kerja", html_table(["Tahap", "Kegiatan"], c["tahapan"]), ref=ref))
    s.append(sec("Penilaian", "Rubrik 100 Poin", html_table(["Aspek", "Poin"], [(a, str(p)) for a, p in c["rubrik"]]), ref=ref))
    s.append(sec("Proyek modul", "Delapan Proyek Kecil", html_table(["Modul", "Proyek", "Estimasi"], [(str(n), PROYEK[n]["judul"], PROYEK[n]["waktu"]) for n in sorted(PROYEK)]), ref=ref))
    return s


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for n in PROYEK:
        (OUT / nama_berkas(n)).write_text(md_proyek(n), encoding="utf-8")
    (OUT / "capstone.md").write_text(md_capstone(), encoding="utf-8")
    (OUT / "README.md").write_text(md_indeks(), encoding="utf-8")
    page = PAGE.format(n="Akhir", judul=esc(CAPSTONE["judul"]), slides="\n".join(html_capstone()))
    page = page.replace("Modul Akhir: ", "")
    (ROOT / "slides" / "proyek-akhir.html").write_text(page, encoding="utf-8")
    print("proyek:", len(PROYEK) + 3, "dokumen, 1 deck")
