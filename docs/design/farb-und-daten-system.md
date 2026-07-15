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
| **Füllung** | „du" — dein Wert | **Frucht-Farbe des Bereichs** (`bereichColor(key, isDark)`) |
| **● Punkt** | Valenz-Referenz (Median, Regions-Schnitt) | nach **deiner Lage**: `sage` = entspannter · `gold` = enger · `mid` = neutral |
| **&#124; Strich** | der „Schnitt" (Durchschnitt, CH-Schnitt) | `mid` — neutral, nie wertend |
| **!** | harte Schwelle | `text` (Graphit) normal · **`roseDeep` nur auf der kritischen Seite** |

**Regel 2: Farbe folgt Valenz, nicht Richtung.** `gold` ist immer die *finanziell engere*
Seite — beim Lohn also *darunter*, bei der Miete *darüber*. Nicht „mehr = gold".

**Regel 3: „du" trägt die Frucht-Farbe.** Das löst die Blau-Überladung: Blau bedeutet „du"
nur im Versicherungs-Instrument, wo Blau (Heidelbeere) ohnehin die Bereichsfarbe ist.

## Die Frucht-Farben

Aus `data/lebensbereiche.js`, via `bereichColor(key, isDark)`:

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
