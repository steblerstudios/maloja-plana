#!/usr/bin/env python3
"""Liest «Prämien – Grundversicherung» (Standardmodell) aus dem BAG-Gesamtbericht als PDF.

Seit 2027 gibt priminfo den Gesamtbericht nur noch als PDF heraus (gesamtbericht_ch-JJJJ.pdf); die Excel-Fassung,
aus der extract-praemien-detail.py liest, fehlt. Gelesen wird über Wortkoordinaten (pdftotext -bbox), nicht über
die Textansicht: -layout staucht die Abstände, sobald in einer Zeile eine Franchise fehlt (gefunden bei Aquilana,
Kinder AG 2027). Jeder Wert gehört zur Franchise-Spalte, deren Überschrift (x-Mitte) am nächsten liegt; mehr als
6 pt daneben oder zwei Werte in einer Spalte → Abbruch. Leere Zelle = Franchise nicht angeboten (0).

Aufruf: python3 extract-praemien-detail-pdf.py <gesamtbericht_ch-JJJJ.pdf>  → JSON-Liste der Tabellenzeilen
"""
import re, sys, json, subprocess, html as H

WORT = re.compile(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>')
ZAHL = re.compile(r'^\d+\.\d$')

def zeilen_von(seite):
    w = [(float(a), float(b), float(c), H.unescape(t)) for a, b, c, d, t in WORT.findall(seite)]
    z = {}
    for x0, y0, x1, t in w:
        key = round(y0 * 2) / 2
        z.setdefault(key, []).append((x0, x1, t))
    return [(y, sorted(v)) for y, v in sorted(z.items())]

def text(zl):
    return ' '.join(t for _, _, t in zl)

def zuordnen(werte, koepfe, wo):
    out = [0.0] * len(koepfe)
    for wert, mitte in werte:
        i = min(range(len(koepfe)), key=lambda k: abs(koepfe[k] - mitte))
        if abs(koepfe[i] - mitte) > 6 or out[i]:
            raise ValueError('%s: Wert %s bei x=%.1f passt in keine freie Spalte %s' % (wo, wert, mitte, koepfe))
        out[i] = wert
    return out

def parse(roh):
    tabellen, typ = [], None
    for nr, seite in enumerate(roh.split('<page ')[1:], 1):
        zl = zeilen_von(seite)
        ganz = '\n'.join(text(v) for _, v in zl)
        m = re.search(r'Prämien – (\S+)', ganz)
        if m: typ = m.group(1)
        kopf_i = next((i for i, (_, v) in enumerate(zl) if any(t in ('Région', 'Regione') for _, _, t in v)), None)
        if kopf_i is None or typ != 'Grundversicherung':
            continue
        km = re.search(r'\b(20\d\d) ([A-Z]{2})\b', ganz)
        alter = 'kin' if 'Kinder /' in ganz else 'jug' if 'Junge Erwachsene /' in ganz else 'erw' if 'Erwachsene /' in ganz else None
        kopf = zl[kopf_i][1]
        ri = next(i for i, (_, _, t) in enumerate(kopf) if t in ('Région', 'Regione'))
        region = int(kopf[ri + 1][2])
        rx = kopf[ri][0]
        zahlkoepfe = [((x0 + x1) / 2) for j, (x0, x1, t) in enumerate(kopf) if t.isdigit() and j != ri + 1]
        links = [x for x in zahlkoepfe if x < rx]
        rechts = [x for x in zahlkoepfe if x > rx]
        soll = 7 if alter == 'kin' else 6
        if len(links) != soll or len(rechts) != soll:
            raise ValueError('Seite %d: Kopf hat %d/%d Spalten' % (nr, len(links), len(rechts)))
        mitte = (links[-1] + rechts[0]) / 2
        for y, v in zl[kopf_i + 1:]:
            t = text(v)
            if 'Bundesamt' in t or 'Office fédéral' in t: break
            werte = [(float(tt), (x0 + x1) / 2) for x0, x1, tt in v if ZAHL.match(tt)]
            if not werte: continue
            name = ' '.join(tt for _, _, tt in v if not ZAHL.match(tt))
            wo = 'Seite %d %s R%s %s «%s»' % (nr, km and km.group(2), region, alter, name)
            tabellen.append({'seite': nr, 'jahr': int(km.group(1)), 'kanton': km.group(2), 'region': region, 'alter': alter, 'name': name,
                             'mit': zuordnen([w for w in werte if w[1] < mitte], links, wo),
                             'ohne': zuordnen([w for w in werte if w[1] >= mitte], rechts, wo)})
    return tabellen

if __name__ == '__main__':
    roh = subprocess.run(['pdftotext', '-bbox', sys.argv[1], '-'], check=True, capture_output=True, text=True).stdout
    print(json.dumps(parse(roh), ensure_ascii=False))
