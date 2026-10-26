# Gesamtbericht alle Seiten · 24.10.2026

Stand: `origin/main` `aa94f3d6` (Arbeitsbaum `_werkbank/gesamtbericht-2026-10`). Sechs read-only Prüfungen
über ~92 Seiten (`VALID_VIEWS`, `src/utils/hashRouter.js:20`). Nichts am Code geändert.
Einzelberichte im selben Ordner: `design.md`, `a11y.md`, `sprache.md`, `qualitaet.md`, `code.md`;
die Fachprüfung durfte nicht schreiben, ihr Bericht steht unten in Kurzform.

**Nicht gemacht:** die automatische Bildschirm-Messung im Browser (auf Wunsch weggelassen). Kein Webzugriff
für die Fachprüfung — Werte 2027 nachgerechnet, nicht an Fedlex/BSV bestätigt. Kontraste gerechnet, nicht gemessen.

## Auf einen Blick

| Linse | 🔴 | ⚠️ | Kern |
|---|---|---|---|
| Code | 4 | 12 | zwei Monatsrechnungen, Kinderalter bleibt 0, Budget-Import wirkungslos, Beispieldaten ins echte Profil |
| Fachlich | 3 | ~20 | AHV-Mindestbeitrag 870 kippt 1.1.2027, SKOS 1'061 ohne Jahressperre, Fortbildung 10'000 vs. 13'000 |
| Qualität | 0 | 4 | 6553/6555 grün (2 wackelig), Lint 0, Startdatei 64,89/65 kB, PII-Scan nicht gelaufen |
| Design | 0 | viele | nur Umzug ist F5-Ablauf; Kartenwand (11), Kopf in Karte (6), Versalien aus `Heading.jsx` |
| Barrierefreiheit | 0 | ~35 | Tab-Titel ohne Seitenname, Ergebnisse ohne Live-Region, Tabs ohne Pfeiltasten, «an» nur Tönung |
| Sprache | 0 | ~25 | Umbenennung nicht auf main, Währung 4 Schreibweisen, «sofort»/«Achtung», 3 Schlüssel fehlen |

## 🔴 Zuerst — falsch gerechnet oder bald falsch (7)

1. **Zwei Monatsrechnungen** — `utils/monatsrechnung.js:33-36` (`sumTotalIncome`) ohne Nebenerwerb/Partner;
   Budget/Finanz-Übersicht mit `haushaltsEinnahmen`. 3000 + 1500 Nebenerwerb, 3600 Ausgaben: Übersicht «+900»,
   Kapitel «Es fehlen CHF 600». Betrifft Kapitel Finanzen, Wohnen, `#/charts`.
2. **Kinderalter bleibt 0** — `ChapterView.jsx:421-456` zeigt Alter aus Geburtsdatum, speichert `age: 0`.
   Sozialhilfe (zwei Teile derselben Seite rechnen 18 bzw. 0), Mietzins, IPV junge Erwachsene, ALV.
3. **Budget-Import wirkt nicht** — `csvImport.js:125-164`: Miete/KK ins falsche Feld, 12 Lohnzeilen summiert,
   `1'850` → 1, xlsx als Text.
4. **Beispieldaten ins echte Profil** — `#/tax`, `#/vorsorge` ohne `key: datenModus` (`main.jsx:1633`);
   beim Schuldenmanager schon behoben (`main.jsx:626`).
5. **Freiwillige AHV 870 Fr. «Stand 2026»** — `de.js:865` (`wegzug`), fester Satz, kippt 1.1.2027; vermutlich
   nur AHV-Anteil (mit IV 1'010) — an Merkblatt 10.02 prüfen.
6. **SKOS-Grundbedarf 1'061 ohne Jahressperre** — `sozialhilfeRechner.js:21`, `cantonalData.js:272`, `de.js:1865`.
7. **Fortbildungsabzug** — Feld «Max 10'000» (`TaxCalculator.jsx:88`) gegen Hinweis «bis 13'000» (`de.js:1543`).

## ⚠️ Danach — nach Hebel geordnet (einmal reparieren, viele Seiten)

**Design / Fassung 5**
- **Ablauf-Schale auf das Umzug-Muster** (ein Schritt nach dem anderen, Frist als Karte, Stand gespeichert):
  trifft ~33 Abläufe auf einmal (`AblaufSchale.jsx`; heute nur `UmzugAblauf.jsx`). Dabei a11y mitlösen:
  Fokus nach «In den Kalender» (`AblaufSchale.jsx:110-116`), doppelte Ansage (`UmzugAblauf.jsx:217`).
- **Versalien-Zwischentitel** an der Quelle `Heading.jsx:47` (Eyebrow) abschaffen; dort auch `as`-Überschrift.
- **Kartenwand** um ganze Seite (11 Dateien: ALV, EO, Vorsorge, Sozialhilfe, Prämien, Schnellcheck, Suche …)
  und **Kopf in Karte** (Finanz-Übersicht, KVG, beide Dossiers, Lebensmappe, Unterlagen).
- **Grösster Abstand zu F5:** Übersicht (Prozent-Kreise, Stempel), Finanz-Übersicht, KVG-Leistungen
  (Pillen-Tabs), Asyl (eigene Kartenwand, nicht auf der Schale), Diagramme (feste Hex-Farben).

**Barrierefreiheit (WCAG 2.2)**
- Tab-Titel nach Seite setzen + `PageTitle` als h1 (`main.jsx:819`, `Heading.jsx:20`) — alle Seiten.
- `role="status"` für Rechenergebnisse (ALV, Prämien, Mietzins, Pflege, KVG, Schnellcheck, Sync).
- Eine `Tabs`-Komponente mit Pfeiltasten (Schulden, Ablage, Was ansteht) nach `VorsorgeRechner.jsx:501`.
- Eine `Einzelwahl` (radiogroup) statt `aria-pressed` ohne Gruppe (ALV, Stipendien, Schulden, KVG …).
- Schalter «an» nur durch Tönung, `sand` ~2,0:1 → `sandDeep` (`main.jsx:250, 1026, 1067`).
- In-App «Bewegung reduzieren» auch in JS (Baum3D, Berglandschaft, Rucksack).
- Druck-HTML mit festem/fehlendem `lang` (7 Routen); 10-px-Schrift in der Bodennavigation (`main.jsx:359, 386`).

**Code — Randfälle**
- Absturz beim Start nach Import mit `"31.12.2027"` oder Zahl-`id` (`docReminders.js:43, 61`).
- Wiederherstellen kann vom Auto-Save überschrieben werden (`ZipExport.jsx:195-221`).
- Übersicht und Kapitel ausserhalb des `ViewErrorBoundary` (`main.jsx:1533, 1565`).
- Wiederholungen «monatlich» = +30 Tage, «jährlich» = +365; .ics ohne RRULE (`CalendarReminders.jsx:29-37`).
- ALV «Kinder: ja» auch für Kinder über 25 (`AlvRechner.jsx:22,30`); Referenzalter ohne Geschlecht (`Pensionierung.jsx:18`).
- Stilles Neuladen nach Deploy verliert ungespeicherte Eingaben (`notifications.js:40-58`, `sw.js`).

**Fachlich**
- Steuerrechner: «Max»-Grenzen ohne Gesetz (Schuldzinsen, Unterhalt, übrige), 3a ohne Obergrenze, Selbständige 3a.
- Mutterschaft: «erwerbstätig bei der Geburt» fehlt (`eo`, `kind`); Pflege ordnet OR 329h-Urlaub der EO zu (`de.js:401`).
- Prämien-Vergleich in der Wechselsaison mit Werten 2026 (`praemienRegionen.js`).
- Führerausweis «seit 1. November 2024» ohne Quelle (`de.js:467`) — vermutlich 1.2.2024.
- BVG-Mindestzins 2027, ALV-Schwelle 3'797 2027, Mindestlöhne 2027, TPW 8 Kantone «Stand 2025» — offen.

**Sprache**
- `fix/ein-name-pro-seite` mergen löst den Grossteil der Namensfunde; «Zurück zu …» braucht dann
  Anführungszeichen («Zurück zu «Was ansteht»»).
- Währung eine Schreibweise («CHF 100», im Fliesstext «100 Franken»); «sofort»/«Achtung:» in Fristtexten ruhiger.
- Fehlende Schlüssel `budgetImport.importFailed`, `calendar.nicelyDone`, `common.clear` (englisch «Clear»).
- du-Varianten: 182× grosses «Du» mitten im Satz; Ablage hat drei Namen (Dokumentenablage/-Tresor/Tresor).

**Qualität**
- Startdatei 0,11 kB Reserve — vor dem nächsten Bau Platz schaffen oder Deckel entscheiden.
- PII-Scan nachholen (`.pii-deny.txt` im Arbeitsbaum fehlt).
- Tests für Fachseiten ohne jeden Test: `bestattung`, `betreibungsauszug`, `kkerst`, `unfallkrankheit`,
  `wohnunggekuendigt`, `lebensmappe`.

## Was gut ist
CSP self-only, keine Netz-APIs, Lint 0, Fristen-Rechner `utils/fristen.js` sauber («nie später als das Gesetz»),
AHV-Skala/BVG/3a 2027 innerlich stimmig, Escaping im Brief-HTML, globaler Fokusring, Fokusfallen, Kapitel-Formulare
mit Labels/aria, keine Emoji, ss statt ß überall, Schlüssel-Parität en/it/rm vollständig.

## Bezug zum Seiten-Durchgang (Fassung 5)
Entschieden 24.10.: **L Rucksack**, **M Was steht mir zu?** (VERGLEICH.md, Zweig `docs/mockups-stardust`).
Offen: N Suche, J Steuern, K Finanz-Übersicht, Übersicht; danach Abläufe (Schale), Notfall-Seiten, Datenseiten.
Beim Bau von J mitnehmen: 🔴 7 Fortbildung, Steuer-«Max»-Grenzen, `nav.sub.taxes`. Bei K: 🔴 1 Monatsrechnung,
Kopf in Karte, 10-px-Chips. Bei der Übersicht: Prozent-Kreise/Stempel, opacity-Kontrast.
