# Systemblick — Zahlen zum System, ohne Zahlen über Menschen

> **Status:** Konzept, Entwurf 24.10.2026 · **nicht freigegeben** · Grundsatzentscheid durch Stebler Studios offen.
> Abgrenzung: [`STATISTIK.md`](STATISTIK.md) zählt *Besuche* (Server-Logs des Hosters). Dieses Dokument
> handelt von *sozioökonomischen* Zahlen: Wie behandelt das Schweizer System Haushalte, und wo fallen sie durch?

## Haltung

Maloja sammelt **keine Nutzerdaten** — auch nicht für eine gute Sache. Das Versprechen «die App sendet
nichts» (CSP self-only, kein Backend live, [`BACKEND_FUER_MICH.md`](../BACKEND_FUER_MICH.md)) bleibt.
Statistik entsteht darum zuerst **ohne eine einzige Person**:

1. aus **Musterhaushalten**, die durch die amtlich belegten Rechenmodelle laufen, die Maloja schon hat, und
2. aus **öffentlichen amtlichen Statistiken** (BFS, BAG, BSV, SECO, ESTV, Kantone).

Erst wenn eine Frage damit nachweislich nicht beantwortbar ist, kommt Stufe 3 (freiwillige Beiträge) als
eigener Grundsatzentscheid auf den Tisch.

## Wofür (Entscheid Stebler Studios, 24.10.2026: alle vier)

| Zweck | Beispiel-Frage | Stufe |
|---|---|---|
| **Politische Argumente** (Petitionen, Medien) | «Wie gross ist die Spanne bei der Prämienverbilligung für denselben Haushalt?» | 1 + 2 |
| **Orientierung für Nutzer** | «Wo stehe ich im Vergleich zu Haushalten wie meinem?» | 2 (lokal gerechnet) |
| **Systemlücken zeigen** | «Für wen kann niemand eine Zahl nennen, weil das System es nicht erlaubt?» | 1 |
| **Maloja verbessern** | «Für welche Haushalte zeigt Maloja selbst keine Zahl?» | 1 |

## Stufe 1 — Systemblick: Musterhaushalte durch die Kantonsmodelle (Prototyp gebaut)

- **Was:** Ein erfundener Haushalt (z. B. alleinerziehend, ein Kind, CHF 2'500 netto) wird durch alle 26
  IPV-Kantonsmodelle gerechnet — dieselben Module, die der Rechner nutzt (`config/cantonalData.js` →
  `IPV_MODULE`, Belege in `docs/sources/ipv-kantone-2026.md`).
- **Code:** `src/data/systemblick.js` · Tests `src/data/__tests__/systemblick.test.js` ·
  Messung `node scripts/systemblick-messen.mjs` → [`MESSUNG-systemblick-ipv-2026-10-24.md`](MESSUNG-systemblick-ipv-2026-10-24.md).
- **Daten:** keine neuen. Jede Zahl ist das, was der Maloja-Rechner einer Person mit genau diesem Profil zeigen würde.
- **Nicht in der App sichtbar.** Kein Route, kein Menü, keine Übersetzung. Ein sichtbarer «Systemblick»
  ist ein eigener Schritt nach Freigabe und Prüfung (siehe «Bevor etwas öffentlich wird»).

### Erste Befunde aus der Messung vom 24.10.2026 (Prototyp, ungeprüft)

- **Spanne:** Alleinerziehend, ein Kind (7), CHF 2'500 netto, Hauptort: Verbilligung von CHF 2'922 (UR) bis
  CHF 8'640 (NE) pro Jahr in den 16 Kantonen mit Betrag (Median 4'774).
- **Lücke in Maloja:** Für Haushalte mit **zwei Erwachsenen** zeigt Maloja heute in keinem Kanton einen
  Betrag (jedes Kantonsmodell bricht bei `mehrereErwachsene` mit «haushalt» ab). Das betrifft Paare und
  Familien — vermutlich ein grosser Teil der Menschen, die Verbilligung brauchen. → eigener Backlog-Punkt.
- **Lücke im System:** TG rechnet nach dem Steuerbetrag, JU nach dem steuerbaren Einkommen. Ohne
  Steuerveranlagung kann niemand vorab eine Zahl nennen — auch Maloja nicht. Das ist selbst ein Befund
  («Wer seine Verbilligung kennen will, braucht zuerst die Veranlagung»).
- **Kinder:** AG, GR und TI zeigen für das Profil mit Kind bewusst keine Zahl (`agKinder`, `grKinder`, `tiKinder`);
  NW, GL, BL bei tiefem Einkommen nicht (`mindestanspruch`). Gründe je Zelle stehen in der Messung.

### Grenzen, die jede Darstellung nennen muss

1. **Kein amtlicher Kantonsvergleich.** Maloja rechnet mit Nettolohn ×12; jeder Kanton mit seinem eigenen
   massgebenden Einkommen (oft aus der Steuerveranlagung, mit Abzügen). Die Spanne zeigt, wie
   verschieden die *Regeln* wirken — nicht, was eine konkrete Person bekommt.
2. **Ein Ort je Kanton** (Hauptort). In Kantonen mit Prämienregionen gilt der Betrag nur dort.
3. **«Keine Zahl» ist nie 0** und zählt nicht in Median, Minimum, Maximum (Test erzwingt das).
4. **Stand** = Stand der Kantonsmodelle (2026). Ab 2027 neu messen, mit Datum im Dateinamen.
5. **Musterwerte** (Prämie CHF 450 / 560 / 1'120, Franchise 300, kein 13.) sind gesetzt, nicht erhoben.

### Ausbau Stufe 1 (Ideen, nicht beschlossen)

- Dieselbe Mechanik für **Sozialhilfe** (SKOS-Kern, `data/sozialhilfeKern.js`), **Steuern**
  (`kantonaleSteuerdaten.js`, ESTV-Stichprobe), **Mietzinsbeiträge** — wo belegt.
- **Schwelleneffekte:** Bei welchem Lohn kippt ein Haushalt aus der Verbilligung, und was bleibt netto übrig
  («Lohnerhöhung, die nichts bringt»)? Braucht Steuer + IPV + Sozialhilfe zusammen — erst nach swiss-precision-Prüfung.
- **Paare** erst, wenn die Kantonsmodelle zwei Erwachsene können.

## Stufe 2 — Öffentliche amtliche Statistik

Kontext zu den Musterzahlen: Wie viele Menschen sind arm, beziehen Sozialhilfe, EL, Verbilligung — und wie
viele beziehen nicht, obwohl sie Anspruch hätten (Nichtbezug)?

- **Quellen:** siehe Abschnitt «Datenquellen» unten (Recherche 24.10.2026, vor Nutzung je Zahl an der
  Quelle gegenprüfen — Wahrheits-Disziplin, `CLAUDE.md`).
- **Technik:** Zahlen werden **zur Bauzeit** als kleine, datierte Tabelle mit Quelle ins Repo übernommen
  (wie `scripts/build-praemien-data.mjs`), nie zur Laufzeit von einer fremden Seite geladen. So bleibt
  CSP self-only und die App offline-fähig.
- **Orientierung für Nutzer** («Haushalte wie deiner») wird **lokal** gerechnet: die öffentliche Tabelle liegt
  im Bundle, das eigene Profil verlässt das Gerät nicht.

## Stufe 3 — Freiwillige, grobe Beiträge (nur bei echtem Bedarf, eigener Grundsatzentscheid)

Nur falls eine Frage weder Stufe 1 noch 2 beantworten kann (z. B. «Wie viele Maloja-Nutzende haben einen
Anspruch, den sie nicht geltend machen?»). Mindestregeln, falls es je so weit kommt:

- **Ausdrückliches Ja pro Beitrag**, Vorschau des exakten Inhalts vor dem Senden. Standard: aus.
- **Grobe Klassen**, auf dem Gerät gebildet (Kanton, Haushaltstyp, Einkommensband, «Anspruch ja/nein/offen»),
  nie Rohwerte, kein Geburtsdatum, keine PLZ.
- **Keine Kennung, keine IP-Speicherung, kein Zeitstempel genauer als der Monat.**
- **Veröffentlichung erst ab Mindestgrösse** je Gruppe (z. B. 20), sonst «zu wenige Angaben».
- Optional **lokales Verrauschen** (Randomized Response), damit eine einzelne Antwort nichts beweist.
- Braucht ein Backend (`maloja-server`, heute nicht live) → Sicherheits-Review, rechts-pruefer (nDSG: echte
  Anonymisierung vs. Pseudonymisierung), Anpassung Datenschutzerklärung. **Nicht vor 2027.**

## Bevor etwas öffentlich wird

- [ ] Grundsatzentscheid Stebler Studios zu diesem Konzept
- [ ] `swiss-precision-pruefer` über `systemblick.js` und die Messung (Musterwerte, Lesart der Grenzen)
- [ ] `rechts-pruefer`: Disclaimer-Text für eine öffentliche Spanne («kein Anspruch, keine Zusage»)
- [ ] `copy-pruefer`: ruhiger, nicht anklagender Ton — Systemblick zeigt Regeln, keine Schuldigen
- [ ] Sichtbare Seite: 5 Sprachen, a11y, Tabelle mit Textalternative, Quelle und Stand an jeder Zahl
- [ ] Für Petitionen: Zahlen nur mit Stand, Methode und Link auf dieses Dokument verwenden

## Datenquellen (Stufe 2)

*Wird mit der Recherche vom 24.10.2026 ergänzt.*
