#!/usr/bin/env python3
"""Membuat docs/hari-N/*.md dan slides/hari-N-modul-*.html dari modul_data.py.

Kode diambil dari file asli di app/. Pemakaian: python3 scripts/build_modul.py
"""
import html
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from modul_data import MODUL  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "app"
MAKS_BARIS = 13  # slide hanya memuat cuplikan, kode lengkap ada di slide praktik


def esc(s):
    return html.escape(s, quote=False)


def inline(s):
    return re.sub(r"`([^`]+)`", r"<code>\1</code>", esc(s))


def baca(path):
    return (APP / path).read_text(encoding="utf-8").rstrip()


def lang_of(path):
    return {".ts": "ts", ".tsx": "tsx", ".json": "json"}.get(Path(path).suffix, "")


# ------------------------------------------------------------------ Markdown
def md_table(head, rows):
    out = ["| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    out += ["| " + " | ".join(r) + " |" for r in rows]
    return "\n".join(out)


def md_modul(m):
    L = [f"# Modul {m['n']}: {m['judul']}", "", f"**Durasi:** {m['waktu']}", "", f"**Unit kompetensi BNSP:** {m['unit']}", "", "## Tujuan Pembelajaran", ""]
    L += [f"{i}. {t}." for i, t in enumerate(m["tujuan"], 1)]
    for i, (judul, jenis, isi) in enumerate(m["konsep"], 1):
        L += ["", f"## {i}. {judul}", ""]
        if jenis == "bullets":
            L += [f"- {b}" for b in isi]
        elif jenis == "table":
            L.append(md_table(*isi))
        elif jenis == "snippet":
            L += [f"```{isi[0]}", isi[1], "```"]
        elif jenis == "code":
            L += [f"{isi[1]} Berkas `{isi[0]}`:", "", f"```{lang_of(isi[0])}", baca(isi[0]), "```"]
    L += ["", "## Latihan", ""] + [f"{i}. {t}" for i, t in enumerate(m["tugas"], 1)]
    L += ["", "## Peta Kompetensi BNSP", "", f"Unit **{m['unit']}**. Elemen yang dinilai:", ""] + [f"- {e}" for e in m["elemen"]]
    L += ["", f"Bukti pada pelatihan ini: {m['bukti']}.", "", f"Praktik langkah demi langkah: [hands-on {m['praktik']}](../hands-on/hari-{m['hari']}.md)."]
    return "\n".join(L) + "\n"


# ---------------------------------------------------------------------- HTML
def sec(kicker, title, body, cls="", ref=""):
    ref_html = f'\n    <p class="ref">{ref}</p>' if ref else ""
    c = f"slide {cls}".strip()
    return (
        f'  <section class="{c}">\n    <!--split--><div class="split"><div class="main">\n'
        f'    <p class="kicker">{esc(kicker)}</p>\n    <h2>{title}</h2>\n{body}\n'
        f"    </div></div><!--/split-->{ref_html}\n  </section>\n"
    )


def html_table(head, rows):
    h = "".join(f"<th>{inline(x)}</th>" for x in head)
    r = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in row) + "</tr>" for row in rows)
    return f"<table><tr>{h}</tr>{r}</table>"


def html_modul(m):
    kick = f"Hari {m['hari']} · {m['waktu']}"
    md_ref = f'Materi: <a href="../docs/hari-{m["hari"]}/{m["slug"]}.md">docs/hari-{m["hari"]}/{m["slug"]}.md</a>'
    s = []
    hero = (
        f"<h1>Modul {m['n']}: {esc(m['pendek'])}</h1><h2>Tujuan Pembelajaran</h2>"
        "<ol>" + "".join(f"<li>{inline(t)}</li>" for t in m["tujuan"]) + "</ol>"
    )
    s.append(
        '  <section class="slide">\n    <!--split--><div class="split"><div class="main">\n'
        f'    <p class="kicker">{esc(kick)} · React Native</p>\n    {hero}\n'
        f'    </div></div><!--/split-->\n    <p class="ref">{md_ref}</p>\n  </section>\n'
    )
    peta = (
        f"<h3>{esc(m['judul'])}</h3><p><strong>Elemen yang dinilai:</strong></p><ol>"
        + "".join(f"<li>{inline(e)}</li>" for e in m["elemen"])
        + f"</ol><p><strong>Bukti pada pelatihan ini:</strong> {inline(m['bukti'])}</p>"
    )
    s.append(sec("Sertifikasi BNSP", f"Peta Kompetensi: {esc(m['unit'])}", peta))
    for judul, jenis, isi in m["konsep"]:
        if jenis == "bullets":
            body = "<ul>" + "".join(f"<li>{inline(b)}</li>" for b in isi) + "</ul>"
            s.append(sec("Konsep", esc(judul), body))
        elif jenis == "table":
            s.append(sec("Konsep", esc(judul), html_table(*isi)))
        elif jenis == "snippet":
            s.append(sec("Contoh Kode", esc(judul), f"<pre><code>{esc(isi[1])}</code></pre>"))
        elif jenis == "code":
            baris = baca(isi[0]).split("\n")
            if len(isi) > 2:  # mulai dari baris yang memuat penanda
                baris = baris[next(i for i, b in enumerate(baris) if isi[2] in b):]
            if len(baris) > MAKS_BARIS:
                baris = baris[:MAKS_BARIS] + ["// ... selengkapnya di berkas ini"]
            body = f"<p>{inline(isi[1])}</p><p class=\"ref\"><code>{esc(isi[0])}</code></p><pre><code>{esc(chr(10).join(baris))}</code></pre>"
            s.append(sec("Kode di Aplikasi", esc(judul), body, "code"))
    tugas = "<ol>" + "".join(f"<li>{inline(t)}</li>" for t in m["tugas"]) + "</ol>"
    praktik_ref = f'Praktik: <a href="../docs/hands-on/hari-{m["hari"]}.md">hands-on {m["praktik"]}</a> · ' + md_ref
    s.append(sec("Latihan dan Coba", "Tugas Modul " + str(m["n"]), tugas, "", praktik_ref))
    return s


PAGE = """<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modul {n}: {judul}</title>
  <link rel="stylesheet" href="../../shared/assets/slides.css">
</head>
<body data-lang="tsx">
<div class="deck">

{slides}
</div>
<div class="progress" id="progress"></div>
<div class="nav">
  <a class="home" href="index.html">Indeks</a>
  <button id="prev">Sebelumnya</button>
  <span class="counter" id="counter"></span>
  <button id="next">Berikutnya</button>
</div>
<script src="../../shared/assets/highlight.js"></script>
<script src="../../shared/assets/sim.js"></script>
<script src="../../shared/assets/slides.js"></script>
</body>
</html>
"""

if __name__ == "__main__":
    for m in MODUL:
        d = ROOT / f"docs/hari-{m['hari']}"
        d.mkdir(parents=True, exist_ok=True)
        (d / f"{m['slug']}.md").write_text(md_modul(m), encoding="utf-8")
        name = f"hari-{m['hari']}-modul-{m['n']}-{m['slug'][3:]}.html"
        page = PAGE.format(n=m["n"], judul=esc(m["judul"]), slides="\n".join(html_modul(m)))
        (ROOT / "slides" / name).write_text(page, encoding="utf-8")
        print(name, len(html_modul(m)), "slide")
