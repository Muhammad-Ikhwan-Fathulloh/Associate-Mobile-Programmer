#!/usr/bin/env python3
"""Menyisipkan narasi pembuka modul (catatan pengajar, tombol N) ke slide pertama deck modul Flutter.

Teks diambil dari reactnative/scripts/narasi_data.py (PEMBUKA bersifat netral teknologi).
Aman dijalankan berulang (penanda <!--narasi-start-->).
"""
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT.parent / "reactnative" / "scripts"))
from narasi_data import PEMBUKA  # noqa: E402

for f in sorted((ROOT / "slides").glob("hari-*-modul-*.html")):
    n = int(re.search(r"modul-(\d+)-", f.name).group(1))
    s = f.read_text(encoding="utf-8")
    s = re.sub(r"<!--narasi-start-->.*?<!--narasi-end-->", "", s, flags=re.S)
    blok = f'<!--narasi-start--><aside class="notes">{html.escape(PEMBUKA[n], quote=False)}</aside><!--narasi-end-->'
    i = s.index("</section>")
    s = s[:i] + "  " + blok + "\n  " + s[i:]
    f.write_text(s, encoding="utf-8")
    print(f.name, "narasi pembuka")
