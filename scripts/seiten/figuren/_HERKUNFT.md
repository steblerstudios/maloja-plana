# Standbilder für die Hintergrundseite /krankenkasse/

Fünf isometrische Strichfiguren, als **ruhige Standbilder** in die Seite eingesetzt (kein Skript,
CSP `default-src 'none'` bleibt). `scripts/seiten-figuren.mjs` liest sie beim Bauen, setzt Titel und
Beschreibung für Vorlese-Programme ein und färbt sie über Klassen in Malojas Palette «Granit».

| Datei | Figur | Zustand | Zahlen darin |
|---|---|---|---|
| `krankenkasse-praemie.svg` | Prämien-Maschine (Anatomy-Stil): Stapel aus Kostenblöcken, Sockel = eigener Anteil, Taster liest die Prämie ab | Prämienjahr 2027 | BAG-Faktenblatt Leistungen 2025, mit dem Kostenwachstum auf 2027 hochgerechnet; oberster Block = Rest bis zur mittleren Prämie 412 Fr. |
| `krankenkasse-dorf.svg` | 100 Häuser, eines je Mensch, so hoch wie seine Kosten 2024 (Hairline-Stil) | Ruhe, höchstes Haus hervorgehoben | BAG EFIND 2024, Tabelle 1.1 — dieselben Stufen wie `DORF_STUFEN` |
| `krankenkasse-alter.svg` | eine Säule je Altersgruppe (Hairline) | Ruhe | BAG EFIND 2024, Tabelle 2.2 — dieselben Werte wie `ALTER_KOSTEN` |
| `krankenkasse-kostenteil.svg` | Treppe des eigenen Anteils bei Franchise 1'000 (Hairline) | Ruhe | Franchise, 10 % Selbstbehalt, Dach 700 Fr. — dieselbe Regel wie `berechneFranchise` |
| `krankenkasse-kantone.svg` | ein Pfosten je **Prämienregion**, nach Kanton gruppiert, aufsteigend (Hairline) | Ruhe, Genf hervorgehoben | `PRAEMIEN['2027']` aus `src/data/praemienRegionenDaten.js` (Stand 22.10.2026), 42 Regionen |

**Woher:** Die Figuren stammen aus der Erklärseite «Krankenkasse erklärt» von Stebler Studios
(Fassung 02.11.2026), gebaut mit den Werkzeugen *anatomy* (isometrische Erklärfiguren) und
*hairline* (Strichfiguren, Engine `@lucasmarkes/hairline`). Die bewegten Fassungen liegen dort.
Hier stehen nur die Standbilder: das SVG im Ruhezustand, im Browser abgegriffen
(`svg.outerHTML`), bzw. für die Prämien-Maschine direkt aus dem gebauten HTML geschnitten.
Die Kantonsfigur ist eine Abwandlung mit Malojas Prämiendaten statt der Handabschrift.

**Neu abgreifen**, wenn sich Zahlen ändern (spätestens zum Prämienjahr 2028): die Figur in der
Quelle neu bauen, Seite öffnen, nach dem Einschwingen `document.querySelector('svg').outerHTML`
in die Datei hier schreiben, dann `node scripts/build-seiten.mjs`. Die Zahlen, die Leserinnen und
Leser sehen, stehen ohnehin in den Tabellen und kommen aus `src/data` bzw. `seiten-figuren.mjs`;
die Bilder zeigen Grössenverhältnisse.

**Bewegte Fassungen** (seit 04.11.2026): `bewegt/` enthält die Figuren-Skripte mit der Marke DATEN
(die Zahlen setzt der Bau ein), die eigene Bühne `buehne.js` und unter `bewegt/fremd/` den
unveränderten Hairline-Kernel und das Anatomy-Skript der Prämien-Maschine. Daraus baut
`scripts/build-seiten.mjs` je Figur eine Seite unter `/krankenkasse/bewegt/<name>/`, deren CSP genau
diese Skripte per SHA-256 erlaubt.

**Lizenz:** Hairline (Lucas Marques) und das Anatomy-Kit sind MIT-lizenziert; die Texte liegen unter
`public/licenses/hairline-LICENSE.txt` und `anatomy-LICENSE.txt` und sind in
`docs/legal/third-party-licenses.md` eingetragen. Die CSS-Regeln für die Strichklassen in
`scripts/build-seiten.mjs` sind daran angelehnt.
