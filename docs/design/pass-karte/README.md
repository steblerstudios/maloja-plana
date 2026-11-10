# Pass von oben — Erzeuger für `public/vorstellung/pass-karte.svg`

Die Karte am Ende der Reise auf malojaplana.ch/ (Brand Book §7e, «Pass von oben», Probe A1 «Salbei»,
entschieden von Stebler Studios am 10.11.2026). Die SVG wird **einmal hier erzeugt** und fertig ausgeliefert;
im Browser wird nichts gerechnet. Die Rohdaten liegen nicht im Repo (75 MB), sie sind jederzeit neu holbar.

## Quellen

- **Höhen:** swisstopo swissALTI3D, Stand 2023, 2-m-Raster, offene Daten (Nennung «© swisstopo»).
  16 Kacheln LV95 E 2771–2774 / N 1139–1142:
  `https://data.geo.admin.ch/ch.swisstopo.swissalti3d/swissalti3d_2023_<E>-<N>/swissalti3d_2023_<E>-<N>_2_2056_5728.xyz.zip`
- **Strasse:** OpenStreetMap, Hauptstrasse 3 (`highway=primary`, `ref=3`), © OpenStreetMap-Mitwirkende, ODbL
  (Nennung «© OpenStreetMap» Pflicht). Overpass-Abfrage auf den Ausschnitt:
  `[out:json];way["highway"~"^(trunk|primary|secondary|tertiary)$"](46.36,9.64,46.43,9.74);out geom;`

## Ablauf

1. Kacheln laden und entpacken (ein Ordner, nur `*.xyz`).
2. `python3 -I raster.py <kachelordner> maloja-hoehen.json` — mittelt auf 10 m, 4 × 4 km ab LV95 2771000 / 1143000.
3. `python3 -I strasse.py strassen.json strasse.json` — WGS84 → LV95 (swisstopo-Näherungsformel, ±1 m) → Rasterzellen.
4. In einem Ordner mit `d3-contour@4.0.2 d3-geo@3.1.1 d3-shape@3.2.0 d3-array@3.2.4` (nicht im Repo, bewusst):
   `node karte.mjs maloja-hoehen.json strasse.json public/vorstellung/pass-karte.svg`

5. `node karte.mjs … public/vorstellung/pass-karte-papier.svg papier` — B, dieselbe Karte auf Papier.
6. Blick von der Seite (C, D): weiter Ausschnitt, 60 Kacheln LV95 E 2768–2777 / N 1138–1143 (75 MB),
   `python3 -I raster-weit.py <kachelordner> hoehen-weit.json` (20 m, höchster Punkt muss bei 2776240/1139320
   liegen = Piz da la Margna), dann
   `node schraeg.mjs hoehen-weit.json salbei public/vorstellung/pass-blick.svg 2770300 1143700 3500 2775800 1139300 2200 55`
   und dasselbe mit `papier` → `pass-blick-papier.svg`. Kamera ausserhalb des Datenblocks lässt vorne Gelände fehlen.

Gegenprobe beim Erzeugen: der höchste Strassenpunkt muss **1815 m** ergeben (amtliche Passhöhe). Weicht er ab,
stimmen Ausschnitt oder Umrechnung nicht — dann nicht ausliefern. Ändert sich der Punkt im Bild, das Etikett
«Passhöhe» in `scripts/seiten/vorstellung.mjs` nachziehen (`.pass-karte .hoehe`, 57,7 % / 27 %, Handy 62,5 %).

Verworfene Wege (Proben 10.11.2026): Linien aus der Bild-Helligkeit (Wetterkarte), Schrägsicht/Panorama aus den
echten Daten («schlechter»), Linien leise über dem Kopfbild (passen nicht deckungsgleich zum gemalten Bild).
