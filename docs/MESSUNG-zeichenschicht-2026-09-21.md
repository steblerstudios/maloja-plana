# Messung: die Zeichenschicht — 20./21.09.2026

**Auslöser:** «IPVⓘ wie es auf der ersten Seite gemacht ist, so dachte ich sind all
diese …» — Stebler Studios hatte zwei Zeichen für verschieden gehalten, die
gleich aussahen, und zwei für gleich, die es nicht waren.

**Ergebnis in einer Zeile:** **1'079 → 173.** Was bleibt, ist benannt und begründet.

| | Anfang | Ende |
|---|---:|---:|
| an Text geklebt (Code) | 289 | **2** |
| allein stehend (Code) | 97 | **4** |
| Sprachdateien | 592 | **167** |

Die 167 sind fast alle der Pfeil *mitten im Satz* («CHF 250/Mt. → ca. CHF 3'000/Jahr»,
«Werkzeuge → Export») — Typografie für «ergibt» und Pfadangaben, dazu `←` in «mit
←/→ ziehen», das eine Taste benennt.

---

## Was das Ganze im Kern war

> **Ein Zeichen für zwei Bedeutungen — und zwei Zeichen für eine Bedeutung.**

Das kam in jeder Schicht wieder:

| Fund | Ausprägung |
|---|---|
| `ⓘ` | Glossar-Marker (antippbar) **und** Verzierung vor Hinweissätzen |
| `↗` | «externer Link» **und** «hochladen» |
| `↙` / `↧` | beide «herunterladen» |
| `▾` / `▸` | zwei Dreiecke für einen Zustand (offen/zu) |
| `→` | Wegweiser **und** «dann» **und** «ergibt» |

Darum passte nie ein einzelner Ersatz. Jede Gruppe brauchte einen eigenen Entscheid.

## Die Regel, die daraus wurde

> **Ein Zeichen nur dort, wo etwas den Ort verlässt oder auf dem Gerät landet.**
> **Und es gehört der Komponente, nicht der Aufrufstelle.**

Siehe [`ICON_KONVENTION.md`](ICON_KONVENTION.md) für die ausgeführte Fassung.

---

## Die Sortierung, die den Plan gedreht hat

Vor dem Umbau wurden alle 113 `ⓘ`-Stellen sortiert
([`SORTIERUNG-hinweiszeichen-2026-09-20.md`](SORTIERUNG-hinweiszeichen-2026-09-20.md)).
Der Befund war nicht, was erwartet wurde:

| Gruppe | Anzahl |
|---|---:|
| Etikett / Status / Überschrift («Telefon», «Laden…») | 29 |
| Vertrauenszeile («Ihre Daten bleiben auf diesem Gerät») | 18 |
| Haftungshinweis | 10 |
| **echte Erklärung** | **24** |
| Führung | 6 |
| Text aus Daten | 26 |

**Das `ⓘ` war nie ein Erklär-Zeichen, sondern ein Aufzählungspunkt.** Nur 24 von 113
waren überhaupt Erklärungen. Ein `ⓘ` vor dem Wort «Telefon» verspricht etwas, das es
nie gab — und genau das hatte die Verwechslung ausgelöst.

Dazu die Zahl, die alles erklärte: **0 von 113** dieser Texte liefen durch
`GlossarText`. Glossar und Hinweise waren sich nie begegnet.

---

## Was gebaut wurde

**Bausteine** (`IconSystem.jsx`, `components/ExternerLink.jsx`):
`hinweisZeichen` · `erledigtZeichen` · `zurueckZeichen` · `aufklappZeichen` ·
`ZielHinweis` — und zwei neue Icons: `pfeil` (50 B) und `chevron` (40 B).

**Glossar:** 12 → 16 Begriffe (`Nettolohn` · `Taxpunktwert` · `Bundessteuer` ·
`Veranlagung`), in fünf Sprachen, mit Quelle wo die Aussage eine rechtliche ist
(KVG Art. 43 ff., DBG Art. 36). 40 Hinweis-Sätze laufen jetzt durch `GlossarText`.
Markierungen auf der Steuerseite: **1 → 8**.

**Querverweise:** 12 Beschriftungen in fünf Sprachen von
`Bedingung → Angebot` auf die reine Handlung gekürzt, jede mit dem Piktogramm
ihres Ziels; die Übersicht abgesetzt als «Dach» statt als vierter Geschwister-Eintrag.

**Wächter:** `src/__tests__/glyphenImText.test.js` zählt nach **Unicode-Kategorie**,
nicht nach einer Liste, trennt Piktogramme von Typografie und hält für beide einen
Höchststand, der nur sinken darf.

---

## 🛑 Drei Fehler, die dabei ans Licht kamen

1. **`GlossarText` warf ohne Sprach-Kontext** — auch wenn `t` als Eigenschaft mitkam.
   Lag seit jeher drin, fiel bei sechs Aufrufstellen nie auf, riss beim Anschluss
   **41 Tests auf einmal**.
2. **`SearchView` reichte eine Glyphe als Icon-Namen weiter.** `Icons['◎']` ist
   `undefined` — in der Suche fehlten die Kapitel-Icons vollständig, stillschweigend.
3. **Zwei Knöpfe im Tresor sagten etwas anderes, als sie taten:** `↙` für
   Herunterladen und **`○` für Bearbeiten**.

## 🛑 Zweimal hat ein Test eine Verbesserung verboten

`k64Ansagen` verlangte wörtlich `<span aria-hidden="true">↗ </span>`, `ipvOhneBeleg`
prüfte `toContain('✓ ')` als Stellvertreter für «berechtigt». Beide wurden rot,
obwohl die Zusage unverändert galt — sie pinnten die **Bauweise** statt der
**Eigenschaft**. Beide prüfen jetzt die Sache und verbieten zusätzlich rohe Glyphen.

## 🛑 Und dreimal: zwei Quellen für eine Wahrheit

| Doppelung | Preis |
|---|---|
| Kapitel-«Icons» als Glyphen in den Sprachdateien **neben** dem echten Icon-Register | in `rm` sogar andere Zeichen; Suche zeigte gar keine |
| `SEARCH_VIEWS` **neben** `allTools` in `MobileNav` | **5 von 16** Werkzeugen mit verschiedenem Piktogramm |
| Ziel-Zeichen an sechs Aufrufstellen **neben** `ExternerLink` | doppelt gesetzt, an der siebten vergessen |

Alle drei sind zusammengelegt: das neue [`config/ansichtenRegister.js`](../src/config/ansichtenRegister.js)
ist die eine Zuordnung Ansicht → Beschriftung → Piktogramm für Suche, Menü und
Querverweise.

**Das Muster lohnt eine eigene Suche** — dreimal an einem Abend gestolpert ist kein
Zufall.

---

## Offen, mit Grund

- **`stipResultMarker`** (`✓ / ○ / ⓘ`): für `○` («kein Anspruch») gibt es kein
  Piktogramm ohne Bedeutungswechsel — `✕` liest sich härter. **Ton-Entscheid.**
- **Zwei Stellen im HTML-Export** (`FinanzUebersicht`): dort gibt es keinen
  React-Knoten.
- **Das Glossar-`ⓘ`** in `GlossarBegriff.jsx`: macht es richtig (eigener `<sup>`
  mit `aria-hidden`, skaliert über `0.7em` mit).
- **Das Glossar ist faktisch deutschsprachig** — `GLOSSAR` führt deutsche Wortformen
  als Schlüssel, `GlossarText` sucht sie im übersetzten Text. Gemessen über 40 Sätze:
  **de 19 · en 6 · rm 2 · fr 0 · it 0**. Eine Lösung bräuchte Wortformen je Sprache.
- **Toter Übersetzungs-Bestand:** `premiumCalc.check1..6` (6 × 5 Sprachen) und
  `firstChapterDone`/`firstFieldDone` (nur `rm`) werden nirgends benutzt. Nur die
  Glyphen entfernt, der Inhalt steht — ob Übersetzungen weg dürfen, ist ein
  Inhaltsentscheid.
- **Rätoromanisch** ist durchweg meine Übersetzung und ungeprüft (wie der Bestand,
  `TODO(rm)`).
