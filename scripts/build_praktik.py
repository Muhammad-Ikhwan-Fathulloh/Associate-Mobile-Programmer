#!/usr/bin/env python3
"""Membuat slide praktik (kode siap salin) dari docs/hands-on/hari-N.md.

Pemakaian:  python3 scripts/build_praktik.py
Hasil:      slides/praktik-hari-1.html dan slides/praktik-hari-2.html
"""
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILE_RE = re.compile(r"`([\w./\-]+\.(?:dart|yaml|xml|plist|md|json|gradle|kts))`")

DECKS = [
    {
        "src": "docs/hands-on/hari-1.md",
        "out": "slides/praktik-hari-1.html",
        "title": "Praktik Hari 1",
        "sub": "Dasar Flutter, Database Lokal, dan Lokasi",
        "day": "Hari 1",
    },
    {
        "src": "docs/hands-on/hari-2.md",
        "out": "slides/praktik-hari-2.html",
        "title": "Praktik Hari 2",
        "sub": "Jaringan, Sensor, Perangkat, dan Keamanan",
        "day": "Hari 2",
    },
]


def esc(s):
    return html.escape(s, quote=False)


def inline(s):
    s = esc(s)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?![\w*])", r"<em>\1</em>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', s)
    return s


def parse_blocks(lines):
    """Ubah baris markdown menjadi daftar blok: (jenis, isi)."""
    blocks, i = [], 0
    while i < len(lines):
        ln = lines[i]
        if not ln.strip() or ln.strip() == "---":
            i += 1
        elif ln.startswith("```"):
            lang = ln[3:].strip()
            i += 1
            buf = []
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            blocks.append(("code", (lang, "\n".join(buf))))
        elif ln.startswith("### "):
            blocks.append(("h3", ln[4:].strip()))
            i += 1
        elif ln.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append(lines[i])
                i += 1
            blocks.append(("table", rows))
        elif re.match(r"^\s*([-*]|\d+\.)\s", ln):
            ordered = bool(re.match(r"^\s*\d+\.\s", ln))
            items = []
            while i < len(lines) and re.match(r"^\s*([-*]|\d+\.)\s", lines[i]):
                items.append(re.sub(r"^\s*([-*]|\d+\.)\s", "", lines[i]))
                i += 1
            blocks.append(("ol" if ordered else "ul", items))
        else:
            buf = [ln]
            i += 1
            while i < len(lines) and lines[i].strip() and not re.match(r"^(```|### |\||\s*([-*]|\d+\.)\s|---)", lines[i]):
                buf.append(lines[i])
                i += 1
            blocks.append(("p", " ".join(buf)))
    return blocks


def render_table(rows):
    cells = [[c.strip() for c in r.strip().strip("|").split("|")] for r in rows]
    cells = [r for r in cells if not all(re.fullmatch(r":?-{2,}:?", c) for c in r)]
    out = ["<table>"]
    for n, r in enumerate(cells):
        tag = "th" if n == 0 else "td"
        out.append("<tr>" + "".join(f"<{tag}>{inline(c)}</{tag}>" for c in r) + "</tr>")
    out.append("</table>")
    return "".join(out)


def render_text(blocks):
    out = []
    for kind, val in blocks:
        if kind == "p":
            out.append(f"<p>{inline(val)}</p>")
        elif kind == "h3":
            out.append(f"<h3>{inline(val)}</h3>")
        elif kind in ("ul", "ol"):
            out.append(f"<{kind}>" + "".join(f"<li>{inline(x)}</li>" for x in val) + f"</{kind}>")
        elif kind == "table":
            out.append(render_table(val))
    return "\n".join(out)


def split_sections(text):
    title = re.search(r"^# (.+)$", text, re.M).group(1)
    parts = re.split(r"^## ", text, flags=re.M)[1:]
    sections = []
    for p in parts:
        head, _, body = p.partition("\n")
        m = re.match(r"(.*?)\s*\(([^)]*)\)\s*$", head.strip())
        name, time = (m.group(1), m.group(2)) if m else (head.strip(), "")
        sections.append({"name": name, "time": time, "blocks": parse_blocks(body.split("\n"))})
    return title, sections


def file_label(text_blocks, lang):
    for kind, val in reversed(text_blocks):
        raw = " ".join(val) if isinstance(val, list) else (val if isinstance(val, str) else "")
        found = FILE_RE.findall(raw)
        if found:
            return found[-1]
    return {"bash": "Terminal", "yaml": "Kode YAML", "xml": "Kode XML"}.get(lang, "Kode Dart")


def slide(inner, kicker, title, extra_cls="", ref=""):
    ref_html = f'\n    <p class="ref">{ref}</p>' if ref else ""
    return (
        f'  <section class="slide{(" " + extra_cls) if extra_cls else ""}">\n'
        f'    <!--split--><div class="split"><div class="main">\n'
        f'    <p class="kicker">{esc(kicker)}</p>\n'
        f"    <h2>{title}</h2>\n"
        f"{inner}\n"
        f"    </div></div><!--/split-->{ref_html}\n"
        f"  </section>\n"
    )


def build(deck):
    text = (ROOT / deck["src"]).read_text(encoding="utf-8")
    md_title, sections = split_sections(text)
    md_link = "../" + deck["src"]
    slides = []  # daftar (html, anchor_step)
    step_anchor = []  # (label, indeks slide)

    def add(h, anchor=None):
        slides.append(h)
        if anchor:
            step_anchor.append((anchor, len(slides)))

    # Pembuka dan daftar langkah diisi belakangan
    add("HERO")
    add("INDEX")

    for sec in sections:
        name, time, blocks = sec["name"], sec["time"], sec["blocks"]
        has_code = any(k == "code" for k, _ in blocks)
        kick = f"{deck['day']} · {time}" if time else deck["day"]
        m = re.match(r"(Step \d+)\s*:\s*(.*)", name)
        short = m.group(1) if m else name

        if not has_code:
            add(slide(render_text(blocks), kick, esc(name), "", f'Sumber: <a href="{md_link}">{deck["src"]}</a>'), (short, name))
            continue

        files = []
        pending = []
        first = True
        # kumpulkan slide kode
        code_slides = []
        for kind, val in blocks:
            if kind == "code":
                lang, src = val
                label = file_label(pending, lang)
                files.append(label)
                code_slides.append((label, lang, src, list(pending)))
                pending = []
            else:
                pending.append((kind, val))
        tail = pending

        # slide pembuka step: teks pengantar yang tidak ikut ke slide kode pertama
        intro = code_slides[0][3][:-1] if len(code_slides[0][3]) > 1 else []
        listing = "<h3>File pada step ini</h3><ol>" + "".join(f"<li><code>{esc(f)}</code></li>" for f in dict.fromkeys(files)) + "</ol>"
        opener = render_text(intro) + "\n" + listing if intro else listing
        add(slide(opener, kick, esc(name), "", f'Sumber: <a href="{md_link}">{deck["src"]}</a>'), (short, name))
        if intro:
            code_slides[0] = (code_slides[0][0], code_slides[0][1], code_slides[0][2], code_slides[0][3][-1:])

        for n, (label, lang, src, pre_text) in enumerate(code_slides, 1):
            part = f'<span class="part">{n} dari {len(code_slides)}</span>' if len(code_slides) > 1 else ""
            instr = f'<div class="instr">{render_text(pre_text)}</div>' if pre_text else ""
            kind = "Jalankan di terminal" if lang == "bash" else "Salin ke file"
            filebar = f'<div class="filebar"><b>{kind.upper()}</b><span>{esc(label)}</span></div>'
            code_html = f'<pre><code>{esc(src)}</code></pre>'
            add(slide(f"{filebar}\n{instr}\n{code_html}", f"{short} · {name.split(':', 1)[-1].strip()}", f"{esc(label)}{part}", "code"))

        if tail:
            add(slide(render_text(tail), f"{short} · cek hasil", "Uji dan Periksa", "", f'Sumber: <a href="{md_link}">{deck["src"]}</a>'))

    # Isi HERO dan INDEX
    hero_inner = (
        f"<h2>{esc(deck['sub'])}</h2>"
        "<p>Ikuti langkah demi langkah. Pada setiap slide kode, tekan <strong>Salin</strong>, tempel ke file yang disebutkan, simpan, lalu lanjut ke slide berikutnya.</p>"
        "<ul><li>Panah kiri dan kanan: pindah slide</li><li>Tombol F: layar penuh</li><li>Daftar langkah ada di slide 2</li></ul>"
    )
    slides[0] = (
        '  <section class="slide">\n    <!--split--><div class="split"><div class="main">\n'
        f'    <p class="kicker">Associate Mobile Programmer · Flutter</p>\n    <h1>{esc(deck["title"])}</h1>\n{hero_inner}\n'
        "    </div></div><!--/split-->\n  </section>\n"
    )
    items = "".join(
        f'<li><a href="#{n}"><b>{esc(s)}</b>{esc(full.split(":", 1)[-1].strip() if ":" in full else full)}</a></li>'
        for s, full in [(a[0], a[1]) for a, n in step_anchor] if False
    )
    items = "".join(
        f'<li><a href="#{n}"><b>{esc(a[0].replace("Step ", "S"))}</b>{esc(a[1].split(":", 1)[-1].strip() if a[1].startswith("Step") else a[1])}</a></li>'
        for a, n in step_anchor
    )
    slides[1] = slide(f'<ul class="stepgrid">{items}</ul>', deck["day"], "Daftar Langkah")

    page = f"""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(deck['title'])}: {esc(deck['sub'])}</title>
  <link rel="stylesheet" href="assets/slides.css">
</head>
<body class="praktik">
<div class="deck">

{chr(10).join(slides)}
</div>

<div class="progress" id="progress"></div>
<div class="nav">
  <a class="home" href="index.html">Daftar</a>
  <button id="prev" type="button">Sebelumnya</button>
  <span class="counter" id="counter"></span>
  <button id="next" type="button">Berikutnya</button>
</div>

<script src="assets/highlight.js"></script>
<script src="assets/sim.js"></script>
<script src="assets/slides.js"></script>
</body>
</html>
"""
    (ROOT / deck["out"]).write_text(page, encoding="utf-8")
    print(deck["out"], len(slides), "slide")


if __name__ == "__main__":
    for d in DECKS:
        build(d)
