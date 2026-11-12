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
6. Blick von der Seite (C, D) — **Perspektive des Kopfbilds**: von knapp über der Passhöhe über die Kehren ins
   Bergell. Weiter Ausschnitt LV95 E 2760–2777 / N 1131–1143 (231 Kacheln, ca. 300 MB; drei Kacheln in der
   Südostecke 2777/1131–1133 gibt es nicht, liegen ausserhalb des Blicks):
   `python3 -I raster-bergell.py hoehen-bergell.json <kachelordner…>` (25 m). Für die Nähe zusätzlich das
   10-m-Raster der Karte (`maloja-hoehen.json` aus Schritt 2) über die Umgebungsvariable `FEIN`:
   `FEIN=maloja-hoehen.json node schraeg.mjs hoehen-bergell.json salbei public/vorstellung/pass-blick.svg 2773650 1140950 1967 2769450 1138700 450 72 strasse.json`
   und dasselbe mit `papier` → `pass-blick-papier.svg`. `strasse.json` liegt hier (aus `strasse.py`).
   🛑 In zsh die Kamera-Zahlen ausschreiben, nicht über eine Variable geben — zsh zerlegt `$VAR` nicht, dann
   nimmt `schraeg.mjs` still die Standard-Kamera.
   **Standort:** am Foto gesucht, aus dem das Kopfbild entstand (`suche.mjs hoehen-bergell.json maloja-hoehen.json strasse.json`
   gibt die besten Kameras als Argumente aus), danach von Hand nachgestellt.
   Frühere Fassungen (ersetzt, weil sie nicht die Perspektive des Kopfbilds hatten): Blick vom Lunghin zur Margna
   (`raster-weit.py`), Blick das Bergell entlang von der Passhöhe.

Gegenprobe beim Erzeugen: der höchste Strassenpunkt muss **1815 m** ergeben (amtliche Passhöhe). Weicht er ab,
stimmen Ausschnitt oder Umrechnung nicht — dann nicht ausliefern. Ändert sich der Punkt im Bild, das Etikett
«Passhöhe» in `scripts/seiten/vorstellung.mjs` nachziehen (`.pass-karte .hoehe`, 57,7 % / 27 %, Handy 62,5 %).

Verworfene Wege (Proben 10.11.2026): Linien aus der Bild-Helligkeit (Wetterkarte), Schrägsicht/Panorama aus den
echten Daten («schlechter»), Linien leise über dem Kopfbild (passen nicht deckungsgleich zum gemalten Bild).
