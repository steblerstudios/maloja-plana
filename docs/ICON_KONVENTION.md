# Icon-Konvention (Maloja Plana)

Bestätigt im Icon-Audit 2026-07-07. Ziel: ruhige, konsistente Icons ohne
„AI-Slop", ohne die skeuomorphen Metaphern zu verwässern.

## Zwei Klassen — die Trennlinie

**1. Funktionale UI-Icons** → **ein Outline-Set.**
- `viewBox="0 0 24 24"`, `fill: none`, `stroke: currentColor` (oder Palette-Farbe).
- Runde Enden/Ecken: `strokeLinecap: round`, `strokeLinejoin: round`.
- **Massstab ist die optische Strichstärke am Renderpunkt, nicht dieselbe Zahl.**
  Ziel ~1,1–1,4 px optisch. Formel: `strokeWidth = zielOptisch × 24 / renderPx`.
  Beispiele: 14 px → ~2,0 · 16 px → ~1,8 · 24 px → ~1,4. Kleine Icons brauchen
  eine höhere `strokeWidth`, damit sie nicht wispy wirken.
- Nie gefüllte Flächen, wo Outline gemeint ist (der Fehler beim alten Zahnrad,
  Raster, Lautsprecher).
- Wiederverwenden statt duplizieren: geteilte Komponenten unter `src/components/`
  (`TrustLockIcon.jsx` = Vertrauens-Schloss, `TwoRingsIcon.jsx` = verheiratet).
- Referenz-Set: die Boden-Nav-Icons in `main.jsx` (`bottomIcon`, stroke 1.6, rund).

**2. Skeuomorphe Metaphern** → **detailliert, NICHT vereinheitlichen.**
- Die 11 Bereichs-Icons in `IconSystem.jsx` (Kompass, Säule, Chalet …),
  die Früchte (`FruchtStufe/Silhouette`), Arztkoffer, Bundesordner/Aktenmappen,
  der sich füllende Ordner (`DocumentTresor` `OrdnerIcon`).
- Dürfen feine Linien, Füllungen, mehrere Strichstärken und viewBox 48 nutzen —
  das ist die „Swiss Living Skeuomorphism"-Sprache, kein Audit-Ziel.

**3. Wortmarke** (Gipfel-M) → kein Icon, unangetastet lassen.

## Illustration / Daten-Viz
Baum, Landschaft, Charts, Loader sind Illustrationen bzw. Daten-Visualisierung,
kein funktionales Icon — eigene Regeln. Für Charts gilt: **Achsen immer
beschriften** (was + Einheit), Ticks zeigen (siehe Vorsorge-Zukunftsgraph).

## Beim Hinzufügen eines neuen Icons
1. Funktional oder Metapher? Im Zweifel funktional → Outline-Regel oben.
2. Gibt es das Icon schon als geteilte Komponente? Dann wiederverwenden.
3. Optische Strichstärke an die Rendergrösse anpassen, runde Enden, `fill: none`.
