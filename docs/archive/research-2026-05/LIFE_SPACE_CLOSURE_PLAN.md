# LIFE SPACE CLOSURE PLAN — Maloja Plana

> Erstellt: 2026-06-02
> Keine Implementierung. Keine neue Vision.
> Der Weg zum Abschluss der Lebensraum-Phase.

---

## ÜBERSICHT

8 Arbeitspakete. ~14–19 Stunden. 2–3 Arbeitstage.

| # | Paket | Aufwand | Nutzen |
|---|-------|---------|--------|
| 1 | Orientierungssätze verdrahten (Notfall) | 15 Min | Sofort spürbar |
| 2 | Behörden-Spiegelung | 2–3h | Höchster emotionaler Effekt |
| 3 | Notfall-Spiegelung V1 | 2–3h | "Du bist vorbereitet" |
| 4 | Versicherungen-Spiegelung | 4–5h | Grösster praktischer Effekt |
| 5 | Ausbildung-Spiegelung | 2–3h | Bewilligungs-Countdown |
| 6 | i18n DE für neue Spiegelungen | 1–2h | Neue Keys schreiben |
| 7 | i18n EN/FR/IT für neue Spiegelungen | 2–3h | 4-Sprachen-Parität |
| 8 | Verifikation & Abschluss | 1h | Definition of Done prüfen |

---

## DETAILANALYSE PRO PAKET

---

### PAKET 1 — Orientierungssätze verdrahten (Notfall)

**Was:** 2 bestehende Orientierungssätze (`patientenverfuegung`, `vorsorgeauftrag`) auf die Notfall-Felder verdrahten.

**Konkret:** In `constants.js` bei den Notfall-Feldern `patientenverfuegung` und `vorsorgeauftrag` je `orientation: or(t, 'patientenverfuegung')` bzw. `orientation: or(t, 'vorsorgeauftrag')` hinzufügen.

**Nutzen:**
- Notfall steigt von 0 auf 2 aktive Orientierungssätze
- Erfüllt die Schwelle "≥ 2 Sätze pro Kapitel" für Notfall
- Patientenverfügung und Vorsorgeauftrag sind die Felder, bei denen Orientierung am meisten hilft — die meisten Menschen wissen nicht genau, was das ist

**Aufwand:** 15 Minuten. 2 Zeilen in `constants.js`. Keine neuen i18n-Keys nötig — die Texte existieren bereits in allen 5 Sprachen.

**Risiko:** Keines.

**Abhängigkeiten:** Keine.

**Reihenfolge:** Zuerst. Der schnellste Gewinn.

---

### PAKET 2 — Behörden-Spiegelung

**Was:** Lebenssatz + 4 Spiegelkarten für Behörden nach dem Konzept aus Woche 2.

**Konkret:**
- `MirrorCards.jsx`: `hasMinData()` um `behoerden` erweitern, `buildBehoerdenSentence()` und `buildBehoerdenSections()` schreiben
- `i18n/de.js` (+ en/fr/it): `mirror.behoerden.*` Keys erstellen
- Keine Änderung an `constants.js` oder `ChapterView.jsx` — MirrorCards wird bereits für alle Kapitel gerendert, zeigt aber nur für Kapitel mit `hasMinData()` etwas an

**Lebenssatz:**
- Mindestdaten: `cantoneOfTaxation`
- Satz: "Deine Steuerangelegenheiten laufen über den Kanton {Kanton}." + optional Betreibungsstatus, Rechtsbeistand

**Spiegelkarten:**
1. Steuersituation (Kanton, Frist, offene Erklärungen)
2. Rechtliche Situation (Betreibung, Betreibungsamt, Gerichtsverfahren)
3. Vertretung (Rechtsbeistand + Telefon)
4. Vorsorge (Testament-Status)

Jede Karte nur wenn Daten vorhanden.

**Nutzen:**
- Behörden steigt von 1/5 auf 3/5
- Das emotional schwierigste Kapitel bekommt Normalität
- Grösster Einzeleffekt auf die Lebensraum-Skala

**Aufwand:** 2–3 Stunden.
- ~60 Min: `buildBehoerdenSentence()` + `buildBehoerdenSections()` in MirrorCards.jsx
- ~30 Min: `hasMinData('behoerden')` Logik
- ~60 Min: i18n-Keys (DE) — ca. 15–20 Keys (Kartentitel, Labels, Satzbausteine)

**Risiko:**
- Niedrig. Folgt exakt dem Pattern von Basis/Wohnen/Finanzen.
- Betreibungsstatus in Spiegelung zeigt sensible Information — aber der Mensch hat sie selbst eingetragen. Sachlicher Ton genügt.

**Abhängigkeiten:**
- i18n-Keys DE müssen vor dem Code existieren (oder gleichzeitig)
- Keine Abhängigkeit zu anderen Paketen

**Reihenfolge:** Zweites Paket. Konzept ist fertig, höchster Einzelnutzen.

---

### PAKET 3 — Notfall-Spiegelung V1

**Was:** Lebenssatz + 4 Spiegelkarten für Notfall nach dem korrigierten Konzept (Gesundheitskarte).

**Konkret:**
- `MirrorCards.jsx`: `hasMinData()` um `notfall` erweitern, `buildNotfallSentence()` und `buildNotfallSections()` schreiben
- `ChapterView.jsx`: Bestehende Emergency-Summary (`showSummary`-Block, Zeilen 476–537) durch MirrorCards ersetzen
- `i18n/de.js` (+ en/fr/it): `mirror.notfall.*` Keys erstellen

**Lebenssatz:**
- Mindestdaten: `emergencyContact`
- Satz: "Für den Notfall ist eine Kontaktperson hinterlegt." + optional Arzt, Vorsorgstatus

**Spiegelkarten:**
1. Notfallkontakt (Name, Telefon)
2. Ärztliche Betreuung (Hausarzt, Spital)
3. Vorsorge (Patientenverfügung ✓/○, Vorsorgeauftrag ✓/○, Organspende)
4. Gesundheitsdaten (nur Status: "Blutgruppe: A+", "Allergien erfasst", "Medikamente erfasst")

**Nutzen:**
- Notfall steigt von 2/5 auf 4/5
- Höchster Score aller Kapitel nach Spiegelung
- Ton wechselt von "Gefahr" zu "vorbereitet"

**Aufwand:** 2–3 Stunden.
- ~60 Min: Sentence + Sections in MirrorCards.jsx
- ~30 Min: Emergency-Summary in ChapterView.jsx ersetzen
- ~60 Min: i18n-Keys (DE) — ca. 20 Keys

**Risiko:**
- Mittel. Die bestehende Emergency-Summary wird entfernt. Der Notfallkarte-Export (`handleSaveCard`) muss erhalten bleiben.
- Die Vorsorge-Karte zeigt "✓ Vorhanden / ○ Noch offen" — das darf nicht als Aufforderung wirken. Nur anzeigen wenn der Mensch explizit "Nein/Noch nicht" gewählt hat.

**Abhängigkeiten:**
- Paket 1 (Orientierungssätze verdrahten) sollte vorher erledigt sein — dann hat Notfall sowohl Spiegelung als auch Orientierung
- i18n-Keys DE müssen vor dem Code existieren

**Reihenfolge:** Drittes Paket. Nach Behörden, weil Behörden konzeptionell einfacher ist (keine bestehende UI zu ersetzen).

---

### PAKET 4 — Versicherungen-Spiegelung

**Was:** Lebenssatz + 4 Spiegelkarten für Versicherungen. Noch nicht konzipiert — muss als erstes konzipiert werden.

**Konzept-Entwurf:**

**Lebenssatz:**
- Mindestdaten: `kkInsurer`
- Satz: "Du bist bei {Versicherer} grundversichert, Franchise CHF {Franchise}." + optional Prämie, BVG

**Spiegelkarten:**
1. Grundversicherung (KK-Versicherer, Modell, Franchise, Prämie, Kartennummer)
2. Vorsorge (BVG-Pensionskasse, BVG-Beitrag)
3. Zusatzversicherungen (Haftpflicht, Hausrat — nur wenn vorhanden)
4. Total Versicherungskosten (Summe: KK-Prämie + BVG + Haftpflicht + Hausrat + Auto)

**Nutzen:**
- Versicherungen steigt von 1/5 auf 3/5
- Totalsumme ist der grösste Aha-Moment: "Deine Versicherungen kosten CHF 520/Mt."
- Die meisten Menschen wissen nicht, was sie total für Versicherungen zahlen

**Aufwand:** 4–5 Stunden.
- ~30 Min: Konzept finalisieren
- ~90 Min: Sentence + Sections in MirrorCards.jsx (mehr Felder als Behörden, Summenberechnung)
- ~30 Min: `hasMinData('versicherungen')` Logik
- ~90 Min: i18n-Keys (DE) — ca. 25 Keys (mehr Karten, mehr Labels)

**Risiko:**
- Niedrig. Folgt dem Pattern. Summenberechnung ist einfach (Addition).
- KK-Kartennummer sollte NICHT in der Spiegelung stehen (Datensparsamkeit in der Übersicht).

**Abhängigkeiten:**
- Keine. Kann unabhängig von Behörden/Notfall gebaut werden.
- Aber: nach Behörden und Notfall sinnvoll, weil deren Konzepte bereits fertig sind.

**Reihenfolge:** Viertes Paket. Grösserer Aufwand, aber kein Konzept-Vorlauf nötig — der Entwurf oben reicht.

---

### PAKET 5 — Ausbildung-Spiegelung

**Was:** Lebenssatz + 3 Spiegelkarten für Ausbildung. Noch nicht konzipiert.

**Konzept-Entwurf:**

**Lebenssatz:**
- Mindestdaten: `jobTitle` oder `employer` (aus Ausbildung-Kapitel)
- Satz: "Du arbeitest als {Beruf} bei {Arbeitgeber}." + optional Bewilligung, Pensum

**Spiegelkarten:**
1. Berufliche Situation (Beruf, Arbeitgeber, Pensum, Stellenantritt)
2. Aufenthaltsstatus (Bewilligung, Typ) — nur bei Nicht-Schweizern
3. Bildung & Sprachen (Abschluss, Sprachen) — nur wenn erfasst

**Bewilligungs-Kontext:** Wenn `workPermit` = "b" und `employmentStart` vorhanden, kann die Spiegelung zeigen: "Aufenthaltsbewilligung B". Kein Countdown (Ablaufdatum ist nicht erfasst).

**Nutzen:**
- Ausbildung steigt von 1/5 auf 2/5
- Kleinster Sprung aller 4 Spiegelungen
- Aber: für Menschen mit Aufenthaltsbewilligung emotional relevant

**Aufwand:** 2–3 Stunden.
- ~30 Min: Konzept finalisieren
- ~60 Min: Sentence + Sections in MirrorCards.jsx (wenige Felder, keine Cross-Chapter)
- ~60 Min: i18n-Keys (DE) — ca. 12 Keys

**Risiko:**
- Niedrig. Einfachste aller 4 neuen Spiegelungen.
- Duplikat-Gefahr: `employer` existiert sowohl in Finanzen als auch in Ausbildung. Die Spiegelung sollte den Ausbildungs-`employer` verwenden (dort steht der aktuelle Arbeitgeber).

**Abhängigkeiten:**
- Keine. Kann unabhängig gebaut werden.

**Reihenfolge:** Fünftes Paket. Kleinstes Einzelergebnis, darum zuletzt.

---

### PAKET 6 — i18n DE für neue Spiegelungen

**Was:** Alle `mirror.behoerden.*`, `mirror.notfall.*`, `mirror.versicherungen.*`, `mirror.ausbildung.*` Keys in `de.js` erstellen.

**Konkret:** Ca. 70–75 neue Keys in `de.js`:
- `mirror.behoerden.*` — ~15 Keys
- `mirror.notfall.*` — ~20 Keys
- `mirror.versicherungen.*` — ~25 Keys
- `mirror.ausbildung.*` — ~12 Keys

**Nutzen:** Voraussetzung für die Spiegelungen.

**Aufwand:** 1–2 Stunden (kann parallel zu den Code-Paketen geschrieben werden).

**Risiko:** Keines. Reine Textarbeit.

**Abhängigkeiten:** Sollte vor oder gleichzeitig mit den Code-Paketen 2–5 erfolgen. In der Praxis: i18n-Keys pro Paket mitschreiben.

**Reihenfolge:** Parallel zu Paketen 2–5. Am effizientesten: Keys schreiben als Teil jedes Code-Pakets.

---

### PAKET 7 — i18n EN/FR/IT für neue Spiegelungen

**Was:** Alle neuen `mirror.*` Keys in `en.js`, `fr.js`, `it.js` übersetzen.

**Konkret:** 70–75 Keys × 3 Sprachen = ~210–225 Übersetzungen.

**Nutzen:** 4-Sprachen-Parität. Ohne dieses Paket funktionieren die Spiegelungen nur auf Deutsch.

**Aufwand:** 2–3 Stunden.
- EN: ~45 Min (einfachste Übersetzung)
- FR: ~60 Min
- IT: ~60 Min

**Risiko:**
- Niedrig. Die bestehenden Mirror-Keys (Basis, Wohnen, Finanzen) existieren bereits in allen 4 Sprachen — das Pattern ist klar.
- Qualitätsrisiko: maschinelle Übersetzung ohne Muttersprachler-Review. Aber: die bestehenden Übersetzungen sind bereits so entstanden.

**Abhängigkeiten:** Nach Paket 6 (DE-Keys müssen existieren).

**Reihenfolge:** Letztes inhaltliches Paket. Kann auch nach dem Code kommen — die App fällt auf DE zurück wenn Keys fehlen.

---

### PAKET 8 — Verifikation & Abschluss

**Was:** Prüfen, ob die Definition of Done erfüllt ist.

**Checkliste:**
- [ ] 7/7 Spiegelungen implementiert und sichtbar
- [ ] Jede Spiegelung zeigt korrekt an wenn Mindestdaten vorhanden
- [ ] Jede Spiegelung zeigt nichts wenn keine Mindestdaten vorhanden
- [ ] 6/7 Kapitel haben ≥ 2 Orientierungssätze auf Feldern
- [ ] Notfall-Emergency-Summary ist durch MirrorCards ersetzt
- [ ] Notfallkarte-Export (`handleSaveCard`) funktioniert weiterhin
- [ ] Durchschnitt auf Lebensraum-Skala ≥ 2.5
- [ ] Keine Regressions in bestehenden Spiegelungen (Basis, Wohnen, Finanzen)
- [ ] Build erfolgreich
- [ ] 4 Sprachen: Spiegelungen zeigen in DE, EN, FR, IT korrekte Texte

**Aufwand:** 1 Stunde.

**Abhängigkeiten:** Alle Pakete 1–7 abgeschlossen.

---

## A. REIHENFOLGE

```
Tag 1 (6–8h)
├── Paket 1: Orientierungssätze verdrahten           15 Min
├── Paket 2: Behörden-Spiegelung + i18n DE          2–3h
├── Paket 3: Notfall-Spiegelung V1 + i18n DE        2–3h
└── (Optional Start Paket 4)

Tag 2 (5–7h)
├── Paket 4: Versicherungen-Spiegelung + i18n DE    4–5h
├── Paket 5: Ausbildung-Spiegelung + i18n DE        2–3h
└── (Beginn Paket 7)

Tag 3 (3–4h)
├── Paket 7: i18n EN/FR/IT                          2–3h
└── Paket 8: Verifikation & Abschluss               1h
```

---

## B. SCHNELLSTE ERFOLGE

| Rang | Paket | Aufwand | Sofort spürbar |
|------|-------|---------|---------------|
| 1 | **Orientierungssätze verdrahten** | 15 Min | Ja — Notfall hat sofort 2 Helvetia-Sätze |
| 2 | **Behörden-Spiegelung** | 2–3h | Ja — kältestes Kapitel wird warm |
| 3 | **Ausbildung-Spiegelung** | 2–3h | Ja — einfachste Spiegelung, schnell fertig |

---

## C. HÖCHSTER NUTZEN

| Rang | Paket | Effekt auf Skala | Emotionaler Effekt |
|------|-------|-----------------|-------------------|
| 1 | **Behörden-Spiegelung** | 1/5 → 3/5 (+2) | Normalisierung des Schweren |
| 2 | **Notfall-Spiegelung V1** | 2/5 → 4/5 (+2) | "Du bist vorbereitet" |
| 3 | **Versicherungen-Spiegelung** | 1/5 → 3/5 (+2) | Totalsumme als Aha-Moment |
| 4 | **Ausbildung-Spiegelung** | 1/5 → 2/5 (+1) | Berufsbild statt CV-Formular |

---

## D. KRITISCHER PFAD

```
Paket 1 (keine Abhängigkeiten)
    │
    ▼
Paket 2 (braucht: i18n DE behoerden — inline schreiben)
    │
    ▼
Paket 3 (braucht: Paket 1 erledigt, i18n DE notfall — inline schreiben)
    │    (ersetzt Emergency-Summary — braucht Sorgfalt)
    │
    ▼
Paket 4 (braucht: i18n DE versicherungen — inline schreiben)
    │    (unabhängig von 2 + 3, aber danach sinnvoll wegen Lerneffekt)
    │
    ▼
Paket 5 (braucht: i18n DE ausbildung — inline schreiben)
    │    (unabhängig, kleinstes Paket)
    │
    ▼
Paket 7 (braucht: alle DE-Keys fertig)
    │
    ▼
Paket 8 (braucht: alles fertig)
```

**Einzige echte Abhängigkeit:** Paket 3 hängt von Paket 1 ab (Orientierungssätze sollten verdrahtet sein, bevor die Spiegelung gebaut wird — damit Notfall sowohl Spiegelung als auch Orientierung hat).

**Parallelisierbar:** Pakete 2, 4, 5 sind unabhängig voneinander. Theoretisch parallel baubar. Aber: in der Praxis seriell sinnvoller, weil jede Spiegelung aus der vorherigen lernt.

**Risikostelle:** Paket 3 (Notfall) — einziges Paket, das bestehende UI ersetzt (Emergency-Summary). Braucht sorgfältiges Testing.

---

## E. DEFINITION OF DONE

### Primäre Kriterien (alle müssen erfüllt sein)

| # | Kriterium | Messung |
|---|-----------|---------|
| 1 | **7/7 Spiegelungen** | Jedes Kapitel zeigt Lebenssatz + Karten wenn Mindestdaten vorhanden |
| 2 | **6/7 Orientierung** | 6 von 7 Kapiteln haben ≥ 2 aktive Orientierungssätze auf Feldern |
| 3 | **Skala ≥ 2.5** | Durchschnitt auf der Lebensraum-Skala (PLACE_VS_ADMINISTRATION.md) |
| 4 | **Empty States** | Keine Spiegelung bei leeren Daten. Empty States greifen wie bisher. |
| 5 | **Kein Regression** | Bestehende Spiegelungen (Basis, Wohnen, Finanzen) unverändert |

### Sekundäre Kriterien (wünschenswert, nicht blockierend)

| # | Kriterium | Status |
|---|-----------|--------|
| 6 | 4-Sprachen-Parität für alle Mirror-Keys | Kann nachgeliefert werden |
| 7 | Notfallkarte-Export funktioniert nach Spiegelungs-Umbau | Sollte, ist aber testbar |
| 8 | rm.js (Rätoromanisch) hat Mirror-Keys | Niedrige Priorität |

### Erwartetes Ergebnis

| Kapitel | Vorher | Nachher |
|---------|--------|---------|
| Basis | 3/5 | 3/5 |
| Wohnen | 3/5 | 3/5 |
| Finanzen | 2/5 | 2/5 |
| Versicherungen | 1/5 | **3/5** |
| Ausbildung | 1/5 | **2/5** |
| Behörden | 1/5 | **3/5** |
| Notfall | 2/5 | **4/5** |
| **Durchschnitt** | **1.9** | **2.9** |

**2.9/5 — deutlich über der Schwelle von 2.5.**

Maloja wäre dann nicht mehr "überwiegend Verwaltung", sondern "überwiegend Ort".

---

*LIFE_SPACE_CLOSURE_PLAN.md — Der Weg zum Abschluss.*
*8 Pakete. 14–19 Stunden. 2–3 Tage.*
*Danach ist die Lebensraum-Phase abgeschlossen.*
