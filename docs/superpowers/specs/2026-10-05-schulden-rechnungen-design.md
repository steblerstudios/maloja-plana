# Schulden & Rechnungen — die zweite Runde (Design)

*Stand 05.10.2026 · Entwurf · Freigaben: Teil 1 und Teil 2 im Gespräch von Stebler Studios mit «ja bitte»
bestätigt. Gebaut wird erst nach dem Lesen dieses Entwurfs und einem Bauplan.*

## Ausgangslage

Der Wunsch vom 27.09.2026 (*«schulden und rechnungen gerne komplett anschauen und auch ein wenig mit dataviz
dinge sauberer und visueller darstellen»*) ist **zur Hälfte gebaut**: #420 (vier Fehler) und #422 (Dataviz A
Übersichtsbalken · B Abbau-Zeitachse · C Mahnstufen-Leiste), beide gemergt am 27.09., nicht live.
`docs/IDEEN.md` führte den Punkt danach weiter als offen — das wird mit diesem Zweig berichtigt.

**Offen geblieben, Gegenstand dieses Entwurfs:**

1. **Rechnungen.** Offene Arztrechnungen liegen in `versicherungen.kkBelege` (KVG-Tracker, `KVGLeistungen.jsx`),
   Schulden in `schulden[]` (`SchuldenManager.jsx`). Zwei Ablagen ohne Verbindung — eine gemahnte
   Arztrechnung taucht im Schuldenmanager nie auf.
2. **Betreibung und Verlustscheine.** Beide Tabs sind reine, immer offene Eingabekarten — keine Zusammenfassung,
   keine Zeit, obwohl hier gerade die Zeit zählt.

## Ziel und Haltung

- Wer offene Beträge hat, sieht **alle an einem Ort**, ruhig und ohne Wertung, und weiss, wo jeder bearbeitet wird.
- **Eine Quelle je Wahrheit:** kein Betrag wird kopiert, keiner doppelt gezählt.
- **Nichts geschieht automatisch.** Verbindungen entstehen durch einen bewussten Klick.
- Bildsprache von #422: eine Farbe (`palette.text`) in Deckkraftstufen, jede Fläche zusätzlich als Text, kein Rot
  auf Beträgen.
- Jede neue Fachaussage mit Wortlaut-Beleg (siehe «Fachfragen»).

## Teil 1 · Rechnungen und Schulden

### ① «Ausserdem offen» in der Übersicht

Unter dem bestehenden `OffenBalken` eine Zeile, nur wenn es offene, **nicht übernommene** Arztbelege gibt:

> Ausserdem offen: 3 Arztrechnungen · CHF 640.00 · nächste Frist 20.10.2026 → zum KVG-Tracker

- Der Balken bleibt bei den Schulden: seine Stufen sind aus der Schuldenberatung belegt, für Arztrechnungen
  gibt es (noch) keine belegte Einordnung.
- «nächste Frist» nur, wenn mindestens ein Beleg eine Frist trägt; sonst entfällt der Teil.
- Ohne Arztbelege: keine Zeile (kein «0 Rechnungen»).

### ② Abschnitt «Offene Posten»

Ein Abschnitt in der Übersicht (unter ①, über «Wo jede Forderung steht»), nach Herkunft gruppiert:

```
Offene Posten                                   CHF 10'860.00
Arztrechnungen · im KVG-Tracker
  Rechnung vom 12.09.2026          240.00   Frist 20.10.2026
  Rechnung vom 03.09.2026          400.00   Frist abgelaufen (02.10.2026)
Forderungen · im Schuldenmanager
  Krankenkasse Beispiel          1'840.00   Mahnung erhalten
  Steueramt Beispiel             3'200.00   Stand nicht erfasst
  Labor (aus Arztrechnung)         400.00   Rechnung offen     ← nach ③
```

- **Nur lesen.** Jede Gruppe führt an ihren Ort; bearbeitet wird nur dort.
- Arztbelege haben **kein Namensfeld** (`{ id, datum, betrag, status, frist, nichtGedeckt, eingereicht }`) —
  die Zeile heisst darum «Rechnung vom <Datum>», ohne Datum «Rechnung ohne Datum». Ein Namensfeld im Tracker
  ist **nicht** Teil dieser Runde.
- «Frist abgelaufen» ist eine Tatsache, kein Alarm: gleiche Farbe wie der übrige Text.
- Summe als Text. Übernommene Belege (③) zählen nur einmal — als Forderung.

### ③ Bewusst übernehmen

Im KVG-Tracker, bei einem Beleg mit `status === 'offen'` und abgelaufener Frist (oder ohne Frist), ein
Zweitknopf:

> Als Forderung im Schuldenmanager führen

Ein Klick legt in `schulden[]` an:

```js
{ id, creditor: 'Arztrechnung vom <Datum>', amount: beleg.betrag, dueDate: beleg.frist,
  category: 'gesundheit', status: 'open', stufe: 'rechnung', ausBeleg: beleg.id, createdAt }
```

und setzt am Beleg `forderungId: <neue id>`. Danach:

- Der Beleg zeigt «wird im Schuldenmanager geführt» mit Weg dorthin, der Knopf verschwindet.
- ① und ② zählen ihn nicht mehr als Arztrechnung.
- **Bezahlt-Abgleich in eine Richtung, ausgelöst durch eine Handlung:** wird die Forderung im Schuldenmanager
  auf «bezahlt» gesetzt, setzt derselbe Klick den Beleg auf `status: 'bezahlt'`. Wird die Forderung
  gelöscht, verliert der Beleg nur `forderungId` (er bleibt offen, nichts verschwindet still).
- Den Beleg im Tracker zu löschen, während er verbunden ist: Hinweis «wird im Schuldenmanager geführt —
  dort zuerst entfernen», kein stilles Mitlöschen.

**Neue Kategorie `gesundheit`** («Arzt, Labor, Spital»): die bestehende `krankenkasse` zählt als Stufe 1
(KVG 64a, Prämien). Eine Arzt-/Laborrechnung ist bis zum Beleg (Fachfrage 4) **Stufe 3** — `CATEGORY_TIER`
bekommt `gesundheit: 3`, die Kategorie-Auswahl im Tab «Schulden» die neue Option (5 Sprachen).

### Datenmodell und Bausteine (Teil 1)

| Ort | Neu | Fehlt das Feld (alte Daten) |
|---|---|---|
| `versicherungen.kkBelege[]` | `forderungId?: string` | nicht übernommen |
| `schulden[]` | `ausBeleg?: string`, Kategorie `gesundheit` | normale Forderung |

- `src/utils/offenePosten.js` — **reine Funktion** `offenePosten(data) → { arzt: [...], forderungen: [...],
  summe, naechsteFrist }`. Liest beide Ablagen, schliesst übernommene Belege aus, zählt bezahlte nicht.
  Hier hängen die Doppelzähl-Tests.
- `OffenePosten` (Abschnitt ②) und die Zeile ① als Bausteine in `components/SchuldenBilder.jsx`.
- Übernehmen (③): eine Funktion `belegAlsForderung(data, belegId) → { schulden, kkBelege }` in
  `utils/offenePosten.js`, damit KVG-Tracker und Tests dieselbe Regel nutzen.
- **Speicherpfad prüfen vor dem Bau:** Der Schuldenmanager speichert über `onSave({ schulden, betreibung,
  verlustscheine })`, der Tracker über `onUpdateData('versicherungen', 'kkBelege', …)`. ③ schreibt in beide —
  der Bauplan muss klären, welcher Weg aus dem Tracker heraus `schulden` schreiben darf (Beispielmodus/Sandbox
  eingeschlossen).

## Teil 2 · Betreibung und Verlustscheine

### ④ Betreibung als ruhige Zeitleiste

- Jede Betreibung wird eine **Lesezeile** (Gläubiger:in · Betrag · Datum · offen/bezahlt) mit «Bearbeiten»;
  die Felder erscheinen erst dann — wie im Tab «Schulden».
- Darüber eine kleine Zeitleiste der **erfassten Registerdaten** (`BetreibungZeitleiste`), Bildsprache der
  `AbbauZeitachse`: ein Ton, Text daneben. **Kein errechnetes Ende** — «Abschluss des Verfahrens» ist im Gesetz
  nicht definiert (Fachfrage 1); die Fünf-Jahres-Regel steht als Text darunter.
- Die heutige Hinweiszeile «Zahlungsbefehl bei Forderung X vermerkt» bekommt je Betreibung einen Knopf
  «mit Forderung verbinden» → `betreibung[i].forderungId`. Nichts wird angelegt, nur verwiesen; die Zeile
  nennt dann die Forderung.

### ⑤ Verlustscheine mit ihrer Frist

- Lesezeile + «Bearbeiten», Zeitachse `VerlustscheinZeitachse` mit dem Ablauf nach **Fachfrage 2**.
- **Rolle statt zweier Namensfelder:** heute fragt die Karte «Gläubiger» *und* «Schuldner», ohne zu sagen, wer
  man selbst ist. Neu eine Auswahl `rolle: 'schulde' | 'geschuldet'` («Ich schulde» / «Mir wird geschuldet»),
  danach ein Namensfeld mit passender Beschriftung. Erklärtext je Rolle.
- Alte Einträge ohne `rolle`: beide Felder wie bisher, plus die Auswahl — nichts geht verloren.

### Datenmodell (Teil 2)

| Ort | Neu | Fehlt das Feld |
|---|---|---|
| `betreibung[]` | `forderungId?: number` | ohne Verbindung |
| `verlustscheine[]` | `rolle?: 'schulde' \| 'geschuldet'` | beide Namensfelder sichtbar |

## Fachfragen (vor dem Bau am Wortlaut belegen)

1. **Betreibungsauszug:** bis wann gibt das Amt Dritten Kenntnis (vermutl. SchKG 8a Abs. 3/4, ab welchem Ereignis)?
2. **Verlustschein-Verjährung:** 20 Jahre (SchKG 149a Abs. 1) — Wortlaut, auch gegenüber Erben.
3. **Verlustschein zinslos:** SchKG 149 Abs. 4 — Wortlaut und Geltungsbereich.
4. **Stufe einer Arzt-/Laborrechnung** in der Abbau-Reihenfolge — gibt die zitierte Quelle etwas her?
   Bis dahin Stufe 3 mit Hinweis.

### Ergebnis `swiss-precision-pruefer`, 05.10.2026 — kein Blocker

Gelesen über Fedlex-SPARQL → Filestore-HTML: **SchKG SR 281.1 Stand 1.1.2026**, **KVG SR 832.10 Stand 1.7.2026**;
schuldeninfo.ch «Weiterleben mit Schulden» (PDF 05.04.2011); Caritas «Ratgeber Schuldensanierung» (undatiert, gelesen 05.10.2026).

1. **Belegt, mit Grenze.** SchKG 8a Abs. 4: «Das Einsichtsrecht Dritter erlischt fünf Jahre nach Abschluss des
   Verfahrens.» «Abschluss des Verfahrens» ist im Gesetz **nicht definiert**. ⇒ **Die App rechnet kein Enddatum**
   und zeichnet für Betreibungen **keine Zeitachse mit Ende**; sie nennt die Regel als Text:
   «Dritte sehen eine Betreibung im Auszug bis fünf Jahre nach Abschluss des Verfahrens (SchKG Art. 8a Abs. 4).
   Wann Ihr Verfahren als abgeschlossen gilt, kann Ihnen das Betreibungsamt sagen. Behörden mit einem hängigen
   Verfahren können auch danach noch Auszüge verlangen.» → **④ ändert sich:** statt `BetreibungZeitachse` mit
   Ende eine ruhige Zeitleiste der **erfassten Daten** (Registerdatum je Betreibung, kein errechnetes Ende) plus
   dieser Text. *Nebenbefund (sollte, ausserhalb dieser Runde):* `de.js:933` und `:1101` geben Abs. 3 lit. d
   (Fassung 1.1.2026, AS 2025 522) verkürzt wieder — «vor Erlöschen des Einsichtsrechts Dritter» und die
   Gegenausnahme «definitiv nicht gutgeheissen» fehlen.
2. **Belegt.** SchKG 149a Abs. 1: «verjährt 20 Jahre nach der Ausstellung des Verlustscheines; gegenüber den
   Erben des Schuldners jedoch verjährt sie spätestens ein Jahr nach Eröffnung des Erbganges.» ⇒ Ende =
   Ausstellung + 20 Jahre, **nur wenn das Ausstellungsdatum erfasst ist**; die Erben-Regel steht im Text.
3. **Belegt, mit Einschränkung.** SchKG 149 Abs. 4: «Der Schuldner hat … keine Zinsen zu zahlen.» Gilt für die
   schuldende Person; Mitschuldner/Bürgen können Zinsen schulden, aber nicht auf sie abwälzen. ⇒ «zinslos» nur
   in der Rolle «Ich schulde», nie pauschal.
4. **Belegt: Stufe 3.** Im Tiers garant schulden Versicherte die Vergütung dem Leistungserbringer (KVG 42 Abs. 1);
   KVG 64a betrifft nur Prämien und Kostenbeteiligungen **gegenüber dem Versicherer**. Die Schuldenberatungs-
   Quellen ziehen nur laufende Prämien vor, keine Arzt-/Spitalrechnungen. ⇒ `gesundheit: 3` mit Hinweis:
   «Rechnungen von Arztpraxis, Labor oder Spital, die Sie direkt erhalten, schulden Sie dem Leistungserbringer;
   Ihre Krankenkasse erstattet Ihnen den versicherten Teil (KVG Art. 42 Abs. 1). Reichen Sie die Rechnung darum
   bei der Krankenkasse ein, falls noch nicht geschehen. Im Abbau-Plan steht sie bei den übrigen Schulden.»
   **Dazu:** Hilfe zur bestehenden Kategorie «Krankenkasse» präzisieren — «Prämien sowie Franchise und
   Selbstbehalt, die Ihnen die Krankenkasse in Rechnung stellt (KVG Art. 64a).» Heute rutscht eine Arztrechnung
   unter «Krankenkasse» in Stufe 1 mit einer KVG-64a-Begründung, die nicht passt.

## Prüfen und testen

- **Reine Funktionen zuerst, mit Tests:** `offenePosten` (Doppelzählung nach ③, bezahlt zählt nicht, ohne Frist,
  leere Ablagen), `belegAlsForderung` (beide Seiten gesetzt, idempotent bei zweitem Klick), Bezahlt-Abgleich,
  Löschen mit Verbindung, `gesundheit` → Stufe 3.
- Mutationsproben: Ausschluss übernommener Belege, Stufe von `gesundheit`, Rolle-Fallback.
- i18n: alle neuen Texte in de/en/fr/it, rm als Rückfall mit `TODO(rm)`; Parität per Import gemessen.
- Prüfer vor dem PR: `a11y-pruefer` (Zeitachsen, Lesezeilen/Bearbeiten-Fokus), `copy-pruefer`, `polygrafin`,
  `swiss-precision-pruefer` (Fachtexte ④/⑤), `qualitaets-pruefer` (Bundle: Schuldenmanager ist lazy).
- Beispielprofil: hat keine Schulden — für Vorschau/Screenshots von Hand erfassen; nichts wird gespeichert.

## Nicht Teil dieser Runde

Namensfeld für Arztbelege · Arztrechnungen im Balken · automatische Übernahme · Steuer-Regeln je Kanton ·
rm-Fassung der Mahnung · Mahngebühren/Verzugszins für Arztrechnungen.

## Reihenfolge beim Bau (Vorschlag für den Bauplan)

1. `offenePosten` + `belegAlsForderung` mit Tests (kein UI).
2. ① + ② in der Übersicht.
3. ③ im KVG-Tracker + Kategorie `gesundheit`.
4. ⑤ Verlustschein-Rolle + Lesezeilen (Fachfragen 2/3 belegt).
5. ④ Betreibung (Fachfrage 1 belegt).

Je Schritt ein Commit; ein Entwurfs-PR je Teil (Teil 1: Schritte 1–3, Teil 2: 4–5).
