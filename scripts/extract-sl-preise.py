#!/usr/bin/env python3
"""Liest den BAG-Datenstamm der Spezialitätenliste (Excel) und gibt die Packungen als JSON aus.

Aufruf: python3 scripts/extract-sl-preise.py <datei.xlsx>
Ausgabe: [[Handelsname, gal.Form/Dosierung, Packung, Publikumspreis inkl. MwSt, Selbstbehalt], ...]
Spalten werden über die Kopfzeile gesucht, nicht über die Position — das BAG hat das Format 2026 schon einmal gewechselt.
"""
import json
import sys

import openpyxl

SPALTEN = ['Handelsname', 'gal.Form/Dosierung', 'Packung', 'Publikumspreis inkl. MwSt', 'Selbstbehalt']

wb = openpyxl.load_workbook(sys.argv[1], read_only=True, data_only=True)
ws = wb['Datenstamm']
zeilen = ws.iter_rows(values_only=True)
kopf = list(next(zeilen))
fehlt = [s for s in SPALTEN if s not in kopf]
if fehlt:
    sys.exit('Spalten fehlen im Datenstamm: ' + ', '.join(fehlt))
idx = [kopf.index(s) for s in SPALTEN]

aus = []
for r in zeilen:
    name, form, packung, pp, sb = (r[i] for i in idx)
    if not name or not isinstance(pp, (int, float)):
        continue
    aus.append([str(name).strip(), str(form or '').strip(), str(packung or '').strip(), float(pp), float(sb or 0)])

json.dump(aus, sys.stdout, ensure_ascii=False)
