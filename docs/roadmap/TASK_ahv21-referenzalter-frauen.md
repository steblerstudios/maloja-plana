# Scoped Task — AHV-21-Referenzalter der Frauen (Übergangsgeneration)

> **Status:** Phase A **umgesetzt & verifiziert** (2026-07-13, Branch `chore/backlog-cleanup`).
> Referenzalter-Staffel an der amtlichen Quelle belegt (BSV FAQ), 638 Tests grün, Browser-
> verifiziert. **Phase B (Ausgleichsmassnahmen) weiterhin offen** — braucht Kreisschreiben-
> Tabellen + Fach-Gegenlesen (`swiss-precision-pruefer`).
> **Betrifft:** `src/data/ahvRechner.js` → `berechneAltersrente()`
> **Aufgeworfen durch:** Lint-Cleanup 2026-07 (ungenutzter Parameter `geburtsjahr`)
> **Wahrheits-Disziplin:** rechts-/finanzrelevant — vor Umsetzung Zahlen an der Quelle belegen.

## Problem / Lücke

`berechneAltersrente()` berechnet die AHV-Altersrente aktuell mit einem **pauschalen
Referenzalter von 65** (`const REFERENZALTER = 65`). Vorbezug/Aufschub werden relativ zu
diesem festen 65 gerechnet (`differenzMonate = (alter - REFERENZALTER) * 12`).

Für **Frauen der Übergangsgeneration** ist das Referenzalter nach AHV 21 aber **tiefer als
65** und steigt jahrgangsabhängig. Dadurch:

- wird der Vorbezugs-Abschlag für diese Frauen leicht **überschätzt** (Referenzpunkt zu hoch),
- fehlt die Grundlage für die **Ausgleichsmassnahmen** (Rentenzuschlag, reduzierte
  Kürzungssätze), die genau diese Jahrgänge betreffen.

Zusätzlich: **`geschlecht` ist gar kein Input** von `berechneAltersrente()` — der Aufrufer
(`VorsorgeRechner.jsx`) übergibt nur `geburtsjahr`. Ohne Geschlecht lässt sich das
Frauen-Referenzalter nicht anwenden.

> Einordnung: Es handelt sich um eine bewusste **Orientierungs-Vereinfachung**, kein Crash.
> Die App ist explizit „Orientierung, keine verbindliche Berechnung". Trotzdem lohnt die
> Präzisierung, weil sie genau die vulnerable Gruppe (Frauen kurz vor Pensionierung) betrifft.

## Fakten-Basis (belegt)

### 1. Referenzalter Frauen — gestaffelte Erhöhung (AHV 21)

Betrifft **Jahrgänge 1961–1964**:

| Jahrgang | Referenzalter | wirksam ab |
|---|---|---|
| 1960 und älter | 64 Jahre | (alt) |
| **1961** | 64 Jahre + 3 Monate | 2025 |
| **1962** | 64 Jahre + 6 Monate | 2026 |
| **1963** | 64 Jahre + 9 Monate | 2027 |
| **1964 und jünger** | 65 Jahre | ab 2028 |

Männer: unverändert **65** (alle Jahrgänge).

### 2. Ausgleichsmassnahmen — betrifft Jahrgänge 1961–1969 (breiter!)

> ⚠️ **Nicht mit der Referenzalter-Staffel (1961–1964) verwechseln.** Die Ausgleichs­
> massnahmen gelten für die **Übergangsgeneration = Jahrgänge 1961–1969**.

1. **Rentenzuschlag** — lebenslanger monatlicher Zuschlag für Frauen 1961–1969, die die
   Rente **nicht** vorbeziehen. Abgestuft nach durchschnittlichem Jahreseinkommen,
   Beitragsdauer **und** Jahrgang. → Exakte Beträge im Kreisschreiben (KS-R AHV 21).
2. **Reduzierte Kürzungssätze bei Vorbezug** — tiefere Abschläge als der reguläre Satz.
3. **Flexibler Vorbezug ab 62** — für die Übergangsgeneration weiterhin möglich.

## Umfang (Scope)

### Phase A — Referenzalter korrekt (klar umsetzbar) ✅ ERLEDIGT 2026-07-13

1. ✅ `geschlecht` (`'female' | 'male' | 'diverse'`) als Parameter in `berechneAltersrente()`;
   im Aufrufer aus `data.basis.gender` durchgereicht (`VorsorgeRechner.jsx`, 2 Call-Sites + Deps).
2. ✅ Helper `referenzalterMonate({ geschlecht, geburtsjahr })` → Referenzalter **in Monaten**
   (JG 1962 = 774 M = 64 J 6 M); exportiert + getestet.
3. ✅ `differenzMonate = alter*12 − refMonate`; Default-Alter = Referenzalter statt konstant 65.
4. ✅ Fallback 780 M (65 J) für Männer, `diverse`, unbekanntes Geschlecht, JG ≥ 1964 →
   Nicht-Frauen-Pfad **byte-identisch** zu vorher (per Test abgesichert).
5. ⏳ **Rest-Politur offen:** Rückgabe enthält `referenzalterMonate`, aber die UI zeigt an den
   „65"-Stellen noch nicht das echte Referenzalter an. Klein, keine Rechen-Relevanz.

### Phase B — Ausgleichsmassnahmen (grösser, braucht Kreisschreiben-Tabellen)

6. Rentenzuschlag (JG 1961–1969, ohne Vorbezug) — **exakte Staffelung aus KS-R AHV 21 nötig**.
7. Reduzierte Vorbezugs-Kürzungssätze für die Übergangsgeneration.
8. Vorbezug ab 62 für diese Gruppe abbilden.

> Empfehlung: Phase A separat liefern (klein, testbar, sofort korrekter). Phase B erst nach
> Extraktion der amtlichen Zahlen und Fach-Gegenlesen.

## Betroffener Code

- `src/data/ahvRechner.js`: `REFERENZALTER`, `berechneAltersrente()` (Default-Alter Z. ~74,
  `differenzMonate` Z. ~95), Export `AHV_PARAMS.referenzalter`.
- `src/VorsorgeRechner.jsx`: Aufrufe von `berechneAltersrente({ geburtsjahr … })` (≥ 2 Stellen)
  → `geschlecht` mitgeben; UI-Stellen mit fixem „65".
- Ggf. `src/Pensionierung.jsx`.
- Tests: `src/data/__tests__/ahvRechner.test.js`.

## Test-Fälle (Phase A)

| Input | Erwartetes Referenzalter |
|---|---|
| Mann, JG 1960 | 65 J (780 M) |
| Frau, JG 1960 | 64 J (768 M) |
| Frau, JG 1961 | 64 J 3 M (771 M) |
| Frau, JG 1962 | 64 J 6 M (774 M) |
| Frau, JG 1963 | 64 J 9 M (777 M) |
| Frau, JG 1964 | 65 J (780 M) |
| Frau, JG 1975 | 65 J (780 M) |
| Geschlecht unbekannt | 65 J (Fallback) |

Zusätzlich: Vorbezugs-Abschlag einer Frau JG 1962 mit Bezug 62 → relativ zu 64 J 6 M
(30 Monate Vorbezug), nicht relativ zu 65.

## Offene Fragen (für Review)

- Woher kommt das Geschlecht robust? `basis.gender`-Werte prüfen (Mapping `divers`/leer → Fallback 65?).
- Soll der Rentenzuschlag (Phase B) überhaupt in die Orientierung, oder als Hinweistext
  („zusätzlich möglicher Zuschlag — bei der Ausgleichskasse prüfen")?
- Stichtag/Version: Zahlen „Stand 2026" halten (wie `EO_DATA_VERSION`)?

## Quellen

- [AHV/IV-Merkblatt 31 – „Stabilisierung der AHV (AHV 21)"](https://www.ahv-iv.ch/p/31.d) — Referenzalter-Tabelle
- [BSV – AHV 21 (Übersicht)](https://www.bsv.admin.ch/de/ahv-21)
- [BSV FAQ – „Wie wird das Frauenrentenalter erhöht?"](https://faq.bsv.admin.ch/de/reform-ahv-21/wie-wird-das-frauenrentenalter-erhoeht)
- [AHV/IV-Merkblatt 3.04 – „Flexibler Rentenbezug"](https://www.ahv-iv.ch/p/3.04.d) — Vorbezug/Aufschub
- [EAK – „Rentenzuschlag für Frauen der Übergangsgeneration"](https://www.eak.admin.ch/de/rentenzuschlag-fuer-frauen-der-ubergangsgeneration)
- [Kreisschreiben KS-R AHV 21 (Übergangsrecht)](https://sozialversicherungen.admin.ch/de/d/20135/download) — verbindliche Detail-Tabellen (Phase B)
