#!/usr/bin/env python3
"""Berge fürs Dashboard: aus der nachgezogenen Codex-Landschaft zwei leichte SVGs machen.

Quelle: `maloja-landschaft.svg` (Stebler Studios, 25.09.2026) — eigene Fotos vom Malojapass,
von Codex gezeichnet und in 17 Farbflächen vektorisiert. Roh 1,25 MB / gzip 353 KB, weil
jede Kante pixelgenau in Treppenstufen verläuft.

Was dieses Skript tut, damit es sich jederzeit nachbauen lässt:
  1. Jede Teilfläche mit Ramer-Douglas-Peucker vereinfachen (Toleranz 2,5 px),
     Krümel unter 36 px² Hüllfläche weglassen, auf ganze Pixel runden.
  2. Jede Fläche bekommt einen Rand in der eigenen Farbe (3 px) — sonst blitzen
     zwischen den unabhängig vereinfachten Flächen helle Fugen durch.
  3. Eine dunkle Fassung: dieselben 17 Töne, Reihenfolge der Helligkeit bleibt,
     zusammengelegt auf 15–42 % Helligkeit; die fast weissen Himmelstöne verlieren
     fast alle Sättigung, sonst kippen sie ins Senfgelb.

Aufruf:  python3 scripts/berge-vereinfachen.py <quelle.svg>
Schreibt src/assets/berge/landschaft-hell.svg und landschaft-dunkel.svg.
"""
import colorsys
import gzip
import pathlib
import re
import sys

TOLERANZ = 2.5
MIN_FLAECHE = 36
ZIEL = pathlib.Path(__file__).resolve().parent.parent / 'src' / 'assets' / 'berge'


def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    n = (dx * dx + dy * dy) ** 0.5
    dmax, idx = 0.0, 0
    for i in range(1, len(pts) - 1):
        x, y = pts[i]
        d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / n if n else ((x - x1) ** 2 + (y - y1) ** 2) ** 0.5
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        return rdp(pts[:idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [pts[0], pts[-1]]


def vereinfache(d):
    teile = []
    for sub in re.findall(r'M[^M]*', d):
        pts = [tuple(map(float, p)) for p in re.findall(r'(-?[\d.]+)[ ,](-?[\d.]+)', sub)]
        if len(pts) < 3:
            continue
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        if (max(xs) - min(xs)) * (max(ys) - min(ys)) < MIN_FLAECHE:
            continue
        p = rdp(pts + [pts[0]], TOLERANZ)[:-1]
        if len(p) < 3:
            continue
        teile.append('M' + ' '.join(f'{round(x)} {round(y)}' for x, y in p) + 'Z')
    return ''.join(teile)


def dunkel(hexfarbe):
    r, g, b = (int(hexfarbe[i:i + 2], 16) / 255 for i in (1, 3, 5))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    l2 = 0.15 + (l - 0.28) / (0.97 - 0.28) * 0.27
    r, g, b = colorsys.hls_to_rgb(h, max(0.1, l2), s * (0.7 if l < 0.8 else 0.12))
    return '#%02x%02x%02x' % tuple(round(c * 255) for c in (r, g, b))


def main(quelle):
    src = pathlib.Path(quelle).read_text()
    viewbox = re.search(r'viewBox="([^"]+)"', src).group(1)
    pfade = re.findall(r'<path fill="(#[0-9a-fA-F]{6})"[^>]*\sd="([^"]*)"', src)
    grund = re.search(r'<rect[^>]*fill="(#[0-9a-fA-F]{6})"', src).group(1)
    koerper = ''.join(f'<path fill="{f}" stroke="{f}" d="{vereinfache(d)}"/>' for f, d in pfade)
    # Dekoratives Bild: kein title/role — die Bedeutung trägt die Komponente (aria-hidden).
    hell = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" stroke-width="3" '
            f'stroke-linejoin="round"><rect width="100%" height="100%" fill="{grund}"/>{koerper}</svg>\n')
    dunkel_svg = re.sub(r'#[0-9a-fA-F]{6}', lambda m: dunkel(m.group(0)), hell)
    ZIEL.mkdir(parents=True, exist_ok=True)
    for name, inhalt in (('landschaft-hell.svg', hell), ('landschaft-dunkel.svg', dunkel_svg)):
        (ZIEL / name).write_text(inhalt)
        print(f'{name}: {len(inhalt) / 1024:.0f} KB roh · {len(gzip.compress(inhalt.encode(), 9)) / 1024:.0f} KB gzip')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
