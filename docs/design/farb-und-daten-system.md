# Farb- und Daten-System — die Matrix

> Die Grammatik hinter jedem Instrument, das Zahlen zeigt (Barometer, Balken, Charts).
> Wer ein neues baut, liest zuerst hier. Wer eine Farbe wählen will, findet die Regel —
> nicht den Geschmack.
>
> Referenz-Umsetzungen: `components/LohnEinordnung.jsx` (Lohn) und `components/MietVergleich.jsx`
> + `components/RegionalBarometer.jsx` (Miete/Prämie). Die beiden sind bewusst **spiegelgleich**:
> gleiche Grammatik, andere Domäne.

## Drei Ebenen, drei Kanäle

| Ebene | Kanal | Bedeutung |
|---|---|---|
| **Identität** | Frucht-Farbe / Form | *Worum* geht es — welcher Lebensbereich |
| **Reife** | Füllung / Grösse | *Wie viel* — der Wert selbst |
| **Zustand** | kleiner Akzent | *Wie steht es* — nur bei echten Schwellen |

**Regel 1: Ebenen nie mischen.** Eine Farbe beantwortet genau eine der drei Fragen.

## Die vier Marken

| Marke | Bedeutung | Farbe |
|---|---|---|
| **Füllung** | „du" — dein Wert | **Frucht-Farbe des Bereichs** (`bereichFillColor(key, isDark)`) |
| **● Punkt** | Valenz-Referenz (Median, Regions-Schnitt) | nach **deiner Lage**: `sage` = entspannter · `gold` = enger · `mid` = neutral |
| **&#124; Strich** | der „Schnitt" (Durchschnitt, CH-Schnitt) | `mid` — neutral, nie wertend |
| **!** | harte Schwelle | `text` (Graphit) normal · **`roseDeep` nur auf der kritischen Seite** |

**Regel 2: Farbe folgt Valenz, nicht Richtung.** `gold` ist immer die *finanziell engere*
Seite — beim Lohn also *darunter*, bei der Miete *darüber*. Nicht „mehr = gold".

**Regel 3: „du" trägt die Frucht-Farbe.** Das löst die Blau-Überladung: Blau bedeutet „du"
nur im Versicherungs-Instrument, wo Blau (Heidelbeere) ohnehin die Bereichsfarbe ist.

**Regel 3a: Die Füllung nimmt den Füll-Ton, nicht den Identitätston** —
`bereichFillColor(key, isDark)`, nicht `bereichColor`. *(Predeploy-Runde 8, Entscheid
Stebler Studios.)*

Warum: Die Füllung **trägt die Aussage** des Instruments, ist also bedeutungstragende
Grafik und braucht **3:1** gegen ihre Nachbarn (WCAG 1.4.11). Gemessen war sie im
**Hellmodus** darunter — und zwar an *beiden* Kanten:

| | gegen Spur `#DCDAD6` | gegen Karte `#ECECEA` |
|---|---|---|
| Birne `#7E9A4E` | 2.27:1 ✗ | 2.68:1 ✗ |
| Haselnuss `#A8895E` | 2.35:1 ✗ | 2.77:1 ✗ |

**Die Falle: eine dunklere Spur behebt das nicht — sie verschlimmert es.** Im Hellmodus
ist die Frucht *dunkler* als die Spur; beide rücken zusammen (2.27 → **1.71** bei
`#C0BEB9`, Tiefpunkt ~1.05 bei mittlerem Grau). Erst eine fast schwarze Spur trüge
(4.78:1) — und wäre der lauteste Punkt einer ruhigen Seite.

**Im Dunkelmodus ist die Richtung umgekehrt** (Frucht *heller* als Spur) und alles hält
bereits: 4.83:1 / 4.33:1. Darum gibt es bewusst **kein `darkDeep`**.

Die Lösung heisst darum `lightDeep`: **gleicher Farbton, weniger Helligkeit**
(Birne `#6C8343` → 3.03/3.58 ✓ · Haselnuss `#947750` → 3.00/3.54 ✓; Farbton wandert um
0.5°). Die **Identitätsfarbe `light` bleibt unangetastet** — sie trägt den Lebensbaum, die
Kapitel-Karten, die Mappen-Reiter und den Arztkoffer, und zugleich den bewussten
Helligkeits-Kanal der Bereichs-Reihenfolge (hell → dunkel), der Farbenblinden dient.
Dasselbe Muster wie `sage`/`sageDeep` bei Text: **ein Ton je Zweck, nicht ein Ton für alles.**

⚠️ **Ein neues Instrument braucht für seinen Bereich ein `lightDeep`.** Ohne fällt
`bereichFillColor` auf `light` zurück und verfehlt 1.4.11 — still. Der Dev-Build warnt,
und `data/__tests__/lebensbereiche.contrast.test.js` rechnet die Kontraste nach, statt sie
zu behaupten.

## Die Frucht-Farben

Aus `data/lebensbereiche.js` — `bereichColor(key, isDark)` für Identität (Baum, Karten,
Reiter), `bereichFillColor(key, isDark)` für Balken-Füllungen (siehe Regel 3a):

| Bereich | Frucht | Instrument |
|---|---|---|
| `arbeit` | Haselnuss | Lohn-Einordnung |
| `wohnen` | Birne | Miet-Vergleich |
| `versicherungen` | Heidelbeere (≈ sky) | Prämien-Orientierung, KK-Last |
| `finanzen` | Aprikose (≈ gold) | Finanz-Übersicht gesamt |

## Das „!" — der einzige Ort für Rosé

Rosé ist in der ganzen App **für harte Schwellen reserviert**. Nur so bleibt es lesbar;
sonst tritt Alarm-Inflation ein und niemand schaut mehr hin.

| Instrument | Schwelle | rosé wenn |
|---|---|---|
| Lohn | kantonaler Mindestlohn-Boden (`mindestlohnBoden`) | Lohn (auf 100% hochgerechnet) darunter |
| Miete | ein Drittel des Einkommens | Miete darüber |

Das Mindestlohn-„!" ist zugleich der **Befund** für den Lohn-Nachfrage-Brief
(`briefGenerator`, `wageClaim`) — Anzeige und Brief teilen dieselbe Quelle.

**⚠️ Wahrheits-Disziplin — die wichtigste Regel am „!":**
Ein „!" behauptet eine Tatsache über das Leben einer Person und kann in einen Brief an
ihren Arbeitgeber münden. Es darf **nur rot werden, wenn die Datenlage die Aussage trägt**.

Konkret beim Lohn: Der Vergleich läuft immer auf Vollzeit-Äquivalent (der Median *ist* ein
Vollzeit-Median). Ohne erfasste Wochenstunden ist die Hochrechnung unmöglich — dann bleibt
das „!" graphit und `hoursUnknownNote` lädt ruhig zum Nachtragen ein. CHF 3000 einer
50%-Stelle sind CHF 6800 hochgerechnet, nicht CHF 3000; die Vollzeit-Annahme hätte eine
korrekt bezahlte Person für unterbezahlt erklärt. Siehe `data/lohnEinordnung.js`
(`hoursKnown`) und `data/lohnCheck.js` (`pruefeStundenlohn` → `'unvollstaendig'`).

## Handwerk

- **Halo dünn:** `1.5px solid palette.surface` um Punkte, kein hartes Weiss.
- **Text immer Deep-Variante** (`sageDeep`/`goldDeep`/`roseDeep`) — die tragen AA.
  Grafik und Punkte dürfen die kräftige Variante nehmen.
- **Keine positionierten Labels** auf dem Balken — die Werte stehen als Zeile darunter,
  sonst überlappen sie auf schmalen Geräten.
- **Marken-Kollision: abheben, nie verschieben.** Zwei Marken können auf demselben Punkt
  landen — bei der Miete fällt die Drittel-Schwelle auf den CH-Schnitt, sobald das Einkommen
  ≈ 3× CH-Schnitt ist (1'327 × 3 = 3'981, also mitten in unserer Zielgruppe). Die Position
  einer Marke ist ihre Aussage und wird **nie** zur Kosmetik verrückt. Stattdessen weicht
  eine Marke vertikal aus (`RegionalBarometer`: „!" von `top -15` auf `-30`, plus 18px Luft
  am Balken) — dieselbe Lösung, die der Strich schon gegen den Regions-Punkt anwendet.
- **Skala fest**, nicht datenabhängig (Lohn: 3000–13000). Ein Balken, der zwischen zwei
  Sitzungen springt, ist keine Orientierung.
- **Charts mit mehreren Serien:** Frucht-Palette kategorial. Zustandsfarben (sage/gold/rose)
  nur für echte Schwellen — nie als Serien-Farbe.

## Geparkt

- Punkt-Darstellung (gefüllt vs. Ring): „ein andermal nochmal ansehen".

---

*Wiederaufgebaut 2026-07-15 aus der Rebuild-Spec, nachdem die Erstfassung verloren ging
(nie gepusht). Die Lehre steht in `CLAUDE_WORKFLOW.md`: Feature-Branches sofort pushen.*
