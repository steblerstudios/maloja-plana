# Icon Review — Schweizer Symbole

> Agent 4 — Icon Reviewer
> Stand: 2026-06-07

---

## Bewertungskriterien

- **Handwerk** — SVG-Qualität, Detailgrad, Proportionen
- **Schweizer Charakter** — erkennbar schweizerisch, nicht generisch
- **Funktionalität** — erkennbar bei 16–48px Darstellungsgrösse
- **Emotion** — trägt zur Produktidentität bei

---

## EXCELLENT — Meisterhaft, nicht verändern

### Helvetia (`_behoerden`, 48×48)

**104 Zeilen SVG-Code.** Anatomisch korrekte weibliche Profilfigur im Stil der Schweizer Bundesprägung.

Details:
- Strahlenkrone mit 7 Strahlen + Diadem-Band
- Mandelförmiges Auge, Nasenandeutung, Lippenkontur
- Chignon (Haarknoten) — korrekte Bundesdesign-Referenz
- Schlanker Profilhals mit S-Kurve (SNB-Noten-Qualität)
- Halskette (Briefmarken-Detail)
- Toga-Drapierung: Einschulter-Stil, Brustkontur, Taillengürtel mit Schnalle
- Speer mit Blattspitze
- Heraldischer Wappenschild mit Schweizer Kreuz
- Rockfalten (7 vertikale Folds)
- Saumkontur

**Bewertung:** Dieses Icon ist ein Kunstwerk. Es referenziert korrekt die offizielle Helvetia (SNB-Banknoten, Briefmarken, Münzprägung). Bei 48px sind alle Details sichtbar. Bei 14px ist es ein grauer Fleck.

**Problem:** Wird nur bei 14–20px gerendert. → **Muss grösser gezeigt werden.**

---

### Fünfliber (`_finanzen`, 48×48)

**124 Zeilen SVG-Code.** Numismatisch akkurate Darstellung der 5-Franken-Münze (Rückseite).

Details:
- Münzkörper mit Rand
- Erhöhter Stufenrand (2 konzentrische Ringe)
- Perlrand (dashed circle, 0.15px Punkte)
- "5 FR." in Georgia Serif, Versalien, letter-spacing
- Heraldischer Wappenschild mit Schweizer Kreuz (Proportionen korrekt)
- Linker Lorbeerzweig: Stamm (Bezier-Kurve), 8 Blattpaare (einzeln modelliert), Beeren (Tripel-Cluster)
- Rechter Lorbeerzweig: gespiegelt, 8 Blattpaare + Beeren
- Jedes Blatt ist ein individueller Path mit eigener Opazität

**Bewertung:** Numismatische Genauigkeit. Die Lorbeerzweige haben mehr Detail als nötig — sie sind Kunst, nicht Funktionalität. Bei 48px eine erkennbare Münze. Bei 14px ein Kreis.

**Problem:** Identisch zu Helvetia. → **Muss grösser gezeigt werden.**

---

### Chalet (`_wohnen`, 24×24)

Details:
- Giebeldach mit Dachüberstand
- Schornstein mit Rauchfaden
- Balkon mit Geländerstreben
- Blumenkästen (Geranien)
- Tür mit Griff
- Fenster mit Rahmen
- Lüftlmalerei-Andeutung (dekorativer Bogen)

**Bewertung:** Erkennbar schweizerisch trotz 24×24. Die Geranien am Balkon sind das entscheidende Detail, das es vom generischen "Haus"-Icon unterscheidet.

---

### Coin-SVGs 400×400 (alt)

Beide Münz-Illustrationen sind exzellent:
- Radial-Gradient simuliert Metall-Oberfläche
- 48 Perlrand-Punkte individuell platziert
- 16 Sternenkranz-Sterne (5-Punkt-Sterne)
- Lorbeerkranz mit 20 individuellen Blattpaaren + Beeren
- Helvetia-Obverse: Vollkörper mit Toga, Speer, Schild, Krone, Haaren

**Status:** NICHT im Produkt verwendet. Nur als Datei im alten Projekt.

---

## GOOD — Professionell, schweizerisch erkennbar

### Bahnhofsuhr (`_kalenderUhr`, 24×24)

- Äusserer Ring + innerer Ring (doppelt)
- 12 Minutenstriche (0.7px)
- 4 Stundenstriche (prominenter)
- Stundenzeiger + Minutenzeiger (unterschiedliche Länge)
- Sekundenziger mit Knopf (SBB-Referenz: roter Punkt → hier in currentColor)

**Bewertung:** Erkennbar als Bahnhofsuhr bei 24px. Das Doppelring-Detail (äusserer + innerer Kreis) ist das schweizerische Unterscheidungsmerkmal. Bei 16px geht der Sekundenzeiger-Knopf verloren.

---

### Toblerone-Chart (`_chartsSchoko`, 24×24)

- Dreieckige Säulen (Toblerone-Zacken) als Balkendiagramm
- 3 Balken + "Verpackung" (Linie unten)
- Aufsteigende Höhen

**Bewertung:** Kreativ und einzigartig — kein anderer Lebensordner hat Schokolade als Chart-Metapher. Bei 24px erkennbar. Der Humor ist produktidentitäts-stärkend.

---

### Sackmesser (`_exportTool`, 24×24)

- Messer-Hauptkörper (abgerundetes Rechteck)
- Ausgeklappte Klinge
- Ausgeklappter Schraubenzieher
- Kreuzschraube (Victorinox-Referenz)

**Bewertung:** Erkennbare Schweizer-Armee-Referenz. Die Kreuzschraube ist das Schlüsseldetail. Passt perfekt zu "Export = Multifunktionswerkzeug".

---

### QR-Rechnung (`_steuern`, 24×24)

- Dokument-Outline
- QR-Code-Quadrat (abstrakt)
- Trennlinie (wie echte QR-Rechnung)
- Betragslinie

**Bewertung:** CH-spezifisch — QR-Rechnungen sind ein Schweizer Standard. Funktional erkennbar.

---

### Edelweiss im Schild (`maloja-icons/03`, 256×256)

- Goldener Schild (heraldische Form)
- 8 Edelweiss-Blütenblätter (Ellipsen, 45°-Rotation)
- Zentraler Kern
- Warmer Hintergrund

**Bewertung:** Besser als die aktuelle App-Version (Kreuz statt Edelweiss). Der Edelweiss gibt dem Versicherungs-Symbol schweizerischen Charakter.

---

## NEEDS REVISION — Funktional, aber ohne CH-Charakter

### Versicherungs-Schild (`_versicherungen`, 24×24)

- Einfacher Schild (Pfad)
- Kreuz im Schild

**Problem:** Generisch. Könnte für jedes Land sein. Kein erkennbar schweizerisches Element. Der maloja-icons-Entwurf (Schild + Edelweiss) ist besser.

**Empfehlung:** Kreuz → Edelweiss ersetzen (wie maloja-icons/03).

---

### Notfall (`_notfall`, 24×24)

- Herz-Form
- Kreuz im Herz

**Problem:** Generisch "medical" — könnte Red Cross, Erste Hilfe, oder Gesundheit bedeuten. Kein spezifisch schweizerischer Bezug. Das Schweizer Kreuz wäre stärker, wenn es im richtigen Proportionsverhältnis (6:7) stünde.

**Empfehlung:** Akzeptabel für jetzt. Langfristig: eigenständiger machen.

---

### Basis (`_basis`, 24×24)

- Kreis (Kopf)
- Schulter-Bogen

**Problem:** Komplett generisch "Person"-Icon. Kein Schweizer Bezug, keine Identität. Es ist das erste Icon, das Nutzer sehen (Kapitel 1) — und es sagt nichts.

**Empfehlung:** Langfristig ersetzen durch etwas mit mehr Charakter (z.B. stilisierter Pass-Stempel, oder Silhouette mit Alpen-Hintergrund). Für jetzt akzeptabel.

---

### Ausbildung (`_ausbildung`, 24×24)

- Offenes Buch
- Stift/Feder daneben
- Rednerpult-Andeutung

**Problem:** Generisch "Education". Kein Schweizer Bezug. Könnte ein Schweizer Detail haben (z.B. EFZ/EBA-Andeutung, Lehrvertrag, Berufslehre-Symbol).

**Empfehlung:** Akzeptabel für jetzt. Niedrige Priorität.

---

## REPLACE — Ersetzen empfohlen

### Favicon (aktuell: lila Blitz aus altem Projekt)

Das alte Projekt hatte einen lila Blitz als Favicon — das passt weder zur Maloja-Identität noch zur Schweizer Symbolik.

**Empfehlung:** Neues Favicon erstellen:
- Option A: Mini-Edelweiss (weiss auf Gold)
- Option B: Stilisierter Pass-Sattel (Malojapass-Silhouette)
- Option C: "M" in DM Sans 600 auf Crème-Hintergrund

---

## FEHLT — Muss neu gezeichnet werden

### Kuhglocke (Trychel)

**Warum nötig:** Schweizer Kern-Symbol für:
- Benachrichtigungen / Erinnerungen
- "Achtung, etwas steht an"
- Alp-Metapher (Rhythmus, Ordnung, Naturklang)

**Referenz:** Appenzeller Trychel — trapezförmig, breite Öffnung, Lederband mit Schnalle, Klöppel sichtbar.

**Stil:** 24×24, currentColor, konsistent mit System.

---

### Posthorn

**Warum nötig:** Schweizer Post-Identität für:
- Export / Versand
- Behördenkorrespondenz
- Brief-Generatoren
- "Etwas wird zugestellt"

**Referenz:** Klassisches Posthorn (2 Windungen), wie im Schweizer Post-Logo vereinfacht.

**Stil:** 24×24, currentColor.

---

### Wegweiser (Wanderwegschild)

**Warum nötig:** DAS Schweizer Orientierungssymbol für:
- Orientierungssätze (Helvetia Layer)
- Lebensraum-Eintritt
- "Du bist hier, dort geht es weiter"
- Navigation zwischen Kapiteln

**Referenz:** Gelbes rhombisches Pfeilschild auf Holzpfosten (wie Schweizer Wanderweg-Markierung). In monochrom: Pfeil-Silhouette auf Pfosten.

**Stil:** 24×24, currentColor.

---

## Zusammenfassung

| Kategorie | Icons |
|-----------|-------|
| **EXCELLENT** (5) | Helvetia, Fünfliber, Chalet, Coin-Obverse 400px, Coin-Reverse 400px |
| **GOOD** (5) | Bahnhofsuhr, Toblerone-Chart, Sackmesser, QR-Rechnung, Edelweiss-Schild (maloja-icons) |
| **NEEDS REVISION** (4) | Versicherungs-Schild, Notfall, Basis, Ausbildung |
| **REPLACE** (1) | Favicon |
| **NEU ZEICHNEN** (3) | Kuhglocke, Posthorn, Wegweiser |

**Priorität der Icon-Arbeit:**
1. Versicherungs-Schild → Edelweiss (kleiner Aufwand, grosser CH-Gewinn)
2. Wegweiser zeichnen (für Orientierungsschicht)
3. Kuhglocke zeichnen (für Erinnerungen)
4. Posthorn zeichnen (für Export/Briefe)
5. Favicon ersetzen
