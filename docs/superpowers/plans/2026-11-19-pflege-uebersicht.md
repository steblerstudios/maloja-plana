# Plan · Angehörige pflegen: «Was zusammenkommt»

*Angelegt 19.11.2026 · Stand: Plan, nichts gebaut · Zweig noch keiner (aktuell `feat/wohnen-karten-zeigen`, HEAD `afc7c70d`)*

## Ausgangslage (gelesen, nicht angenommen)

- `src/PflegeAblauf.jsx` hat fünf Schritte. Gerechnet wird in zweien:
  `PflegeEntloehnung` (Stunden × 30–40 CHF/h, Orientierung) und `HilflosenRechner` (amtliche Beträge, Schätzung).
- Betreuungsgutschrift (Schritt 1) und EO-Betreuung (Schritt 3) sind nur Text + Link.
- Die Logik liegt schon da: `berechneHilflosenentschaedigung()` in `data/hilflosenentschaedigung.js`,
  `erziehungsgutschriftJahr` in `data/ahvRechner.js` (Betreuungsgutschrift gleich hoch, AHVG 29septies),
  `berechneBetreuung()` in `data/eoRechner.js`.
- `docs/IDEEN.md:314`: «Pflegeweiser / Entlöhnung berechnen … teils gebaut.»

**Entscheid aus dem Gespräch 18./19.11.:** kein neues Instrument. Eine Übersicht am Ende des bestehenden
Ablaufs. Grund: der Hilflosen-Rechner steht schon in IV und Pflege; ein drittes Mal wäre Doppelung.

## Die eine Designfrage, die alles bestimmt

**Die Beträge gehören verschiedenen Menschen und sind verschiedene Arten von Geld.** Eine einzige
Summe wäre falsch:

| Topf | Wem | Art | Quelle im Code |
|---|---|---|---|
| Entlöhnung | der pflegenden Person | Lohn (brutto/netto offen), Spanne | `PflegeEntloehnung.jsx` |
| Hilflosenentschädigung | der **gepflegten** Person | Monatsbetrag, amtlich | `hilflosenentschaedigung.js` |
| Betreuungsgutschrift | dem AHV-Konto der pflegenden Person | **kein Geld heute**, angerechnetes Einkommen für die spätere Rente | `ahvRechner.js` |
| EO-Betreuung | Eltern eines schwer kranken **minderjährigen Kindes** | Taggeld, einmalig bis 98 Tage | `eoRechner.js` |

→ **Vorschlag:** drei getrennte Zeilen («an dich», «an die gepflegte Person», «später in deiner Rente»),
**kein Gesamttotal über Personen hinweg**. Höchstens ein Haushaltstotal «Lohn + HE pro Monat», und nur,
wenn gepflegte und pflegende Person im selben Haushalt leben (Frage dazu im Rechner). EO nur als Hinweis,
wenn «Kind» gewählt ist.

## Bauschritte

1. **Reine Funktion** `src/data/pflegeUebersicht.js`
   - Eingabe: `{ lohnSpanne: {von, bis} | null, he: <Rückgabe von berechneHilflosenentschaedigung> | null,
     verheiratet, gemeinsamerHaushalt, erreichbar (≤30 km / 1 h), stichtag }`.
   - Ausgabe: `{ anDich, anGepflegte, rente: { gutschriftJahr, geteilt, voraussetzungErfuellt, grund }, haushaltMonat | null, eoHinweis }`.
   - Betreuungsgutschrift nur, wenn HE-Anspruch (jeder Grad) **und** erreichbar **und** nicht im Heim
     **und** mindestens 180 Tage überwiegend; ÷ Anzahl Betreuende; bei verheiratet halbiert (wie `gutschriftTeilen`).
     Eingabe dafür ergänzt um `anzahlBetreuende` (Standard 1) und `mind180Tage`.
   - Jahreswerte über `ahvWerte(stichtag)`, keine neue Zahl im Code.
   - Tests in `src/data/__tests__/pflegeUebersicht.test.js`: ohne HE → keine Gutschrift; zu weit weg → keine;
     verheiratet → halb; Grad offen → Spanne, kein Total; 2026 vs 2027.
2. **Ergebnis nach oben reichen.** `PflegeEntloehnung` und `HilflosenRechner` bekommen ein **optionales**
   `onErgebnis`-Prop. Ohne Prop verhalten sie sich wie heute (wichtig für `IvVerfahren.jsx:44`).
3. **Neuer Schritt** in `PflegeAblauf.jsx` nach der Hilflosenentschädigung, vor «Entlastung»:
   «Was zusammenkommt». Zwei Fragen (Erreichbarkeit, gemeinsamer Haushalt), dann die drei Zeilen.
   `ErgebnisArt`: SCHÄTZUNG (erbt das schwächste Glied). Link «Was die Gutschrift für die Rente heisst» → `vorsorge`.
   Leerzustand: solange nichts gewählt ist, ein ruhiger Satz statt Nullen.
4. **Texte** `pflege.uebersicht.*` in `de, fr, it, en, rm`, Sie/Du-Parität, gender-neutral.
   Bei der Gelegenheit den offenen Punkt aus `GRAUZONEN.md:355` mitnehmen: `de.js:88–89`
   (Kurzurlaub «über die EO» nicht belegt; Voraussetzung HE fehlt im Satz).
5. **Prüfen:** `npm test -- --run`, `npm run build`, dann `swiss-precision-pruefer`, `rechts-pruefer`,
   `copy-pruefer`, `a11y-pruefer`. Freigabe-Register Nr. 23/25 um die Übersicht ergänzen.

Umfang grob: 1 neue Datendatei + Test, 3 Komponenten angepasst, 5 Sprachdateien. Keine neue Abhängigkeit,
nichts gespeichert, keine neue Ansicht und kein Eintrag in `werkzeugRegister.js`.

## Offen, vor dem Bauen zu klären (nicht raten)

> **Geprüft 19.11.2026** (`swiss-precision-pruefer`, Primärquellen online gelesen). Die zwei ersten Punkte
> sind unten erledigt bzw. präzisiert; die alte Fragestellung bleibt als Beleg stehen.

- ~~**Grad der HE für die Gutschrift:** genügt jeder Grad, auch «leicht»?~~ → **belegt: jeder Grad, auch
  leicht; HE von AHV, IV, UV und MV gleich.** AHVG Art. 29septies Abs. 1 (Fassung 1.1.2026, gleich 1.1.2027)
  nennt keinen Grad. Bis 31.12.2020 stand dort «für mindestens mittlere Hilflosigkeit»; gestrichen mit dem
  BG vom 20.12.2019 (AS 2020 4525), in Kraft 1.1.2021. Nach KSBGS Rz 1001.1 (318.104.01, Stand 1.1.2026) und
  RWL Rz 5265 genügt der **Anspruch**, ein tatsächlicher Bezug ist nicht nötig (BGer 9C_264/2015).
  → Im Text «Anspruch auf eine Hilflosenentschädigung (jeder Grad)», nicht «bezieht».
- **Lohn und Gutschrift zugleich:** → **keine geschriebene Regel gefunden** in AHVG 29septies, AHVV 52g–52l,
  KSBGS, RWL 5.11 und Merkblatt 1.03. Das heisst **nicht**, dass beides sicher zusammen geht (Rechtsprechung
  nicht gesucht). Text bleibt «bei der Ausgleichskasse klären», ohne Zusage.

**Neu belegte Bedingungen, die in die Funktion und den Text gehören (aus derselben Prüfung):**

- **Heim schliesst aus:** «Lebt die pflegebedürftige Person in einem Heim, besteht kein Anspruch auf
  Betreuungsgutschriften (BGE 144 V 159).» (KSBGS Rz 3010.2) → bei `he.wohnen === 'heim'` keine Gutschrift.
- **Mindestumfang:** Betreuung «in einem zeitlich überwiegenden Umfang während mindestens 180 Tagen im
  Kalenderjahr» (KSBGS Rz 3015) → als dritte Frage oder als Bedingung im Text.
- **Mehrere Betreuende** teilen die Gutschrift zu gleichen Teilen (AHVV Art. 52i; RWL Rz 5262) → Frage
  «Betreut ihr zu mehreren?» mit Anzahl, Gutschrift ÷ Anzahl.
- **Höhe und Teilung im Code stimmen:** dreifache minimale jährliche Altersrente (AHVG 29septies Abs. 4),
  hälftig bei Verheirateten (Abs. 6). Ausnahmen von der Teilung (KSBGS Rz 6003–6005: anderer Ehegatte nicht
  versichert, Referenzalter erreicht, Jahr der Heirat/Auflösung/Tod) nur im Hinweistext.
- **Nebenbefund für später, nicht dieser Schritt:** der Vorsorge-Rechner (`ahvRechner.js:290`) kennt nur
  ganze Betreuungsjahre und überschätzt bei geteilter Betreuung.
- **Brutto/netto** der Lohnspanne ist in der Quelle offen (siehe Kommentar `PflegeEntloehnung.jsx:16`) — so anzeigen.
- **Kantonale Pflegebeiträge / Betreuungszulagen** (BE, BS, GR in `konkurrenzanalyse.md:78`): **nicht** Teil
  dieses Schritts. Eigene Recherche, erst mit belegten Quellen je Kanton.

## Nicht im Umfang

- Renteneffekt der Gutschrift in Franken (braucht das ganze Einkommensprofil → bleibt im Vorsorge-Rechner).
- EO-Betrag (braucht das Einkommen → bleibt im EO-Rechner; hier nur der Hinweis).
