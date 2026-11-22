#!/usr/bin/env python3
"""Menyisipkan bagian Praktik Step by Step ke setiap deck modul di slides/.

Pemakaian: python3 scripts/build_modul_praktik.py
Aman dijalankan berulang: bagian lama diganti (penanda praktik-start dan praktik-end).
"""
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from modul_praktik_data import M  # noqa: E402

START, END = "<!--praktik-start-->", "<!--praktik-end-->"


def esc(s):
    return html.escape(s, quote=False)


def inline(s):
    s = esc(s)
    return re.sub(r"`([^`]+)`", r"<code>\1</code>", s)


def slide(kicker, title, body, cls="prak"):
    return (
        f'  <section class="slide {cls}">\n'
        f'    <!--split--><div class="split"><div class="main">\n'
        f'    <p class="kicker">{esc(kicker)}</p>\n    <h2>{esc(title)}</h2>\n{body}\n'
        f"    </div></div><!--/split-->\n  </section>\n"
    )


def build_block(n, d):
    k = f"Praktik Modul {n}"
    out = []
    tujuan = "".join(f"<li>{inline(t)}</li>" for t in d["tujuan"])
    out.append(slide(k, "Praktik Step by Step: Tujuan dan Persiapan", (
        f"<ul>{tujuan}</ul>"
        f'<p><strong>Hasil akhir:</strong> {inline(d["hasil_akhir"])} <strong>Waktu:</strong> {esc(d["waktu"])}.</p>'
        f'<div class="filebar"><b>PERSIAPAN</b><span>Terminal</span></div>'
        f'<pre><code>{esc(d["persiapan"])}</code></pre>'
    )))
    total = len(d["langkah"])
    for i, s in enumerate(d["langkah"], 1):
        instr = "".join(f"<li>{inline(x)}</li>" for x in s["instr"])
        out.append(slide(f"{k} · Langkah {i} dari {total}", s["judul"], (
            f'<div class="filebar"><b>LANGKAH {i}</b><span>{esc(s["file"])}</span></div>'
            f'<ol class="mini">{instr}</ol>'
            f'<pre><code>{esc(s["kode"])}</code></pre>'
            f'<div class="hasil"><b>Hasil yang benar</b> {inline(s["hasil"])}</div>'
        )))
    coba = "".join(f"<li>{inline(x)}</li>" for x in d["coba"])
    out.append(slide(f"{k} · Coba Sendiri", "Coba Sendiri", (
        "<p>Kerjakan tanpa melihat jawaban. Tanyakan bila macet lebih dari 5 menit.</p>"
        f"<ol>{coba}</ol>"
    ), "prak try"))
    krit = "".join(f"<li>{inline(x)}</li>" for x in d["kriteria"])
    out.append(slide(f"{k} · Cek Hasil", "Kriteria Selesai", f'<ul class="check">{krit}</ul>', "prak"))
    rows = "".join(f"<tr><td>{inline(a)}</td><td>{inline(b)}</td></tr>" for a, b in d["galat"])
    out.append(slide(f"{k} · Bantuan", "Jika Terjadi Error", f"<table><tr><th>Gejala</th><th>Solusi</th></tr>{rows}</table>", "prak"))
    if d.get("teori"):
        rows = "".join(f"<tr><td>{inline(a)}</td><td>{inline(b)}</td></tr>" for a, b in d["teori"])
        out.append(slide(f"{k} · Teori", "Contoh Jawaban Soal Teori", f"<table><tr><th>Soal</th><th>Jawaban singkat</th></tr>{rows}</table>", "prak"))
    return START + "\n" + "\n".join(out) + END + "\n\n"


def main():
    for n, d in M.items():
        p = ROOT / "slides" / d["file"]
        text = p.read_text(encoding="utf-8")
        text = re.sub(re.escape(START) + r".*?" + re.escape(END) + r"\n\n", "", text, flags=re.S)
        idx = text.rindex('  <section class="slide')
        text = text[:idx] + build_block(n, d) + text[idx:]
        p.write_text(text, encoding="utf-8")
        print(d["file"], len(re.findall(r"<section class=\"slide", text)), "slide")


if __name__ == "__main__":
    main()
