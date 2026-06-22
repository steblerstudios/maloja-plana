# LIFE SPACE COMPLETION — Maloja Plana

> Erstellt: 2026-06-02
> Keine Implementierung. Keine neuen Visionen.
> Nur die Frage: Wann ist die Lebensraum-Phase abgeschlossen?

---

## A. BEREITS ABGESCHLOSSEN

### Spiegelungen (3 von 7)

| Kapitel | Lebenssatz | Spiegelkarten | Cross-Chapter | Status |
|---------|-----------|---------------|---------------|--------|
| **Basis** | ✓ Name, Jahrgang, Kanton, Zivilstand, Haushalt | ✓ Person, Kontakt | — | **Fertig** |
| **Wohnen** | ✓ Adresse, Wohndauer, Kosten | ✓ Zuhause, Kosten | — | **Fertig** |
| **Finanzen** | ✓ Einkommen, Arbeitgeber, Ausgaben, Kredite | ✓ Einkommen, Ausgaben, Sparen, Verpflichtungen, Kredite | ✓ Miete aus Wohnen, KK-Prämie aus Versicherungen | **Fertig** |

### Orientierungssätze (Helvetia-Layer)

**17 Sätze auf Feldern aktiv:**

| Kapitel | Feld | Satz aktiv |
|---------|------|-----------|
| Basis | AHV | ✓ |
| Wohnen | Miete | ✓ |
| Wohnen | Wohnform | ✓ |
| Finanzen | Einkommen | ✓ |
| Finanzen | Steuern | ✓ |
| Finanzen | Schuldenraten | ✓ |
| Finanzen | Säule 3a | ✓ |
| Versicherungen | KVG | ✓ |
| Versicherungen | Franchise | ✓ |
| Versicherungen | BVG | ✓ |
| Versicherungen | UVG | ✓ |
| Versicherungen | AHV-Beitrag | ✓ |
| Ausbildung | Beruf | ✓ |
| Ausbildung | Bewilligung B | ✓ |
| Behörden | Steuerverwaltung | ✓ |
| Behörden | Sozialdienst | ✓ |
| Behörden | Betreibung | ✓ |

**2 kontextabhängige Hinweise aktiv:**
- IPV-Hinweis (Finanzen, wenn Einkommen + Kanton vorhanden)
- Familienzulagen-Hinweis (Basis, wenn Kinder vorhanden)

### Warme Empty States

Alle 7 Kapitel haben eigene Empty States mit:
- Einladender Haupttext (kapitelspezifisch)
- Einstiegs-Hint (kapitelspezifisch)
- Fallback-Text für generische Fälle

**Status: Fertig.**

### Intro-Texte

Alle 7 Kapitel haben Intro-Texte, die den Kontext erklären.

**Status: Fertig.**

---

## B. NOCH OFFEN

### B1. Spiegelungen (4 von 7 fehlen)

| Kapitel | Heutiger Score | Score mit Spiegelung | Status | Aufwand |
|---------|---------------|---------------------|--------|---------|
| **Behörden** | 1/5 | 3/5 | Konzept fertig (Woche 2) | Mittel |
| **Notfall** | 2/5 | 4/5 | Konzept fertig, korrigiert (Gesundheitskarte) | Mittel |
| **Versicherungen** | 1/5 | 3/5 | Noch kein Konzept | Mittel |
| **Ausbildung** | 1/5 | 2/5 | Noch kein Konzept | Klein |

**Detail pro Kapitel:**

#### Behörden-Spiegelung (konzipiert)
- Lebenssatz: Steuerkanton + Betreibungsstatus
- Karten: Steuersituation, Rechtliche Situation, Vertretung, Vorsorge
- Mindestdaten: `cantoneOfTaxation`
- i18n-Keys: Noch zu erstellen (4 Sprachen)

#### Notfall-Spiegelung V1 (konzipiert, korrigiert)
- Lebenssatz: Kontaktperson + optional Arzt/Vorsorge
- Karten: Notfallkontakt, Ärztliche Betreuung, Vorsorge, Gesundheitsdaten (nur Status)
- Ersetzt bestehende Emergency-Summary
- Mindestdaten: `emergencyContact`
- i18n-Keys: Noch zu erstellen (4 Sprachen)

#### Versicherungen-Spiegelung (noch nicht konzipiert)
- Aus PLACE_VS_ADMINISTRATION.md Idee:
  - Lebenssatz: KK-Versicherer, Modell, Franchise, Prämie
  - Karten: Grundversicherung, Vorsorge (BVG), Zusatzversicherungen, Total Versicherungskosten
  - Grösster Effekt: Totalsumme ("Deine Versicherungen kosten CHF 520/Mt.")
- Mindestdaten: `kkInsurer`
- Aufwand: Mittel (folgt bestehendem Pattern)

#### Ausbildung-Spiegelung (noch nicht konzipiert)
- Aus PLACE_VS_ADMINISTRATION.md Idee:
  - Lebenssatz: Beruf, Arbeitgeber, Bewilligung
  - Karten: Berufliche Situation, Aufenthaltsstatus, Sprachen
  - Grösster Effekt: Bewilligungs-Countdown ("Bewilligung B, noch 11 Monate gültig")
- Mindestdaten: `jobTitle` oder `employer`
- Aufwand: Klein (wenige Felder, keine Cross-Chapter-Daten)

---

### B2. Orientierungslücken

**Felder ohne Orientierungssatz, die einen bräuchten:**

| Kapitel | Feld | Warum ein Satz helfen würde |
|---------|------|----------------------------|
| Wohnen | `moveInDate` | Erklärt, warum Wohndauer relevant ist (Mieterschutz, Kündigungsfristen) |
| Finanzen | `familienzulagen` | Feld existiert, aber inline-Satz fehlt (nur kontextabhängiger Hint auf Basis) |
| Finanzen | `alimenteReceived` / `alimentePaid` | Sensibles Thema ohne Kontext. "Alimente sind gerichtlich festgelegt." |
| Versicherungen | `liabilityInsurance` | Haftpflicht ist quasi-obligatorisch, aber das steht nirgends |
| Ausbildung | `educationLevel` | Schweizer Bildungssystem ist für Ausländer schwer verständlich |
| Ausbildung | `languages` | Sprachkenntnisse sind in der Schweiz aufenthalts- und berufsrelevant |
| Behörden | `taxFillingDeadline` | Frist verpasst = Busse. Das sollte erklärt werden. |
| Behörden | `courtCases` | Gerichtsverfahren sind angstbesetzt. Ein ruhiger Satz würde helfen. |
| Notfall | `patientenverfuegung` | Satz existiert in P1 (`orientation.patientenverfuegung`), ist aber nicht auf dem Feld verdrahtet |
| Notfall | `vorsorgeauftrag` | Satz existiert in P1 (`orientation.vorsorgeauftrag`), ist aber nicht auf dem Feld verdrahtet |

**Bereits geschriebene, aber nicht verdrahtete Sätze:**

| Orientierungskey | Existiert in de.js | Auf Feld verdrahtet |
|-----------------|-------------------|-------------------|
| `patientenverfuegung` | ✓ | ✗ |
| `vorsorgeauftrag` | ✓ | ✗ |
| `bewilligung_c` | ✓ | ✗ (nur B ist verdrahtet) |
| `el` | ✓ | ✗ (kein Feld dafür) |
| `alv` | ✓ | ✗ (kein Feld dafür) |
| `rav` | ✓ | ✗ (kein Feld dafür) |
| `skos` | ✓ | ✗ (nur in SozialhilfeView) |
| `iv` | ✓ | ✗ (kein Feld dafür) |
| `ipv` | ✓ | ✗ (nur kontextabhängig) |
| `familienzulagen` | ✓ | ✗ (nur kontextabhängig auf Basis) |
| `selbstbehalt` | ✓ | ✗ |
| `verlustschein` | ✓ | ✗ |
| `eo` | ✓ | ✗ |

**13 Orientierungssätze sind geschrieben, aber nicht verdrahtet.**

---

### B3. Werkzeug-Integration

**8 Werkzeuge, die zu Lebensräumen gehören** (aus LIFE_MAP_COMPLETENESS_REVIEW.md):

| Werkzeug | Gehört zu | Integrations-Aufwand | Nutzen |
|----------|-----------|---------------------|--------|
| **KK-Scanner** | Versicherungen | Mittel (UI in ChapterView integrieren) | Hoch — Scanner direkt beim KK-Feld |
| **IPV** | Versicherungen | Klein (Link/Sektion hinzufügen) | Hoch — direkt nach Franchise/Prämie |
| **SchuldenManager** | Finanzen | Mittel (als Tab oder Sektion) | Hoch — Schulden im Kontext des Budgets |
| **Steuerrechner** | Behörden | Klein (Link/Sektion) | Mittel — Steuerrechner beim Steuerkanton |
| **Sozialhilfe** | Behörden | Klein (Link/Sektion) | Mittel — bei Sozialdienst-Feld |
| **Organspende** | Notfall | Klein (bereits als Feld vorhanden) | Niedrig — Organspende-Tool ist redundant zum Feld |
| **CV-Generator** | Ausbildung | Klein (als Aktion/Button) | Mittel — CV aus Ausbildungsdaten |
| **Kalender** | Meta-Ebene | — bleibt eigenständig | — |

---

### B4. Kapitel, die noch deutlich "Verwaltung" wirken

| Kapitel | Score | Hauptproblem | Was es zum Lebensraum machen würde |
|---------|-------|-------------|-----------------------------------|
| **Versicherungen** (1/5) | Tiefstes Score | 17 Felder, keine Spiegelung. Fühlt sich an wie ein Versicherungsordner. | Spiegelung + Totalsumme + KK-Scanner inline |
| **Ausbildung** (1/5) | Tiefstes Score | 10 Felder ohne Kontext. CV-Formular statt Berufsbild. | Spiegelung + Bewilligungs-Countdown + CV-Generator inline |
| **Behörden** (1/5) | Tiefstes Score | Emotional schwerstes Kapitel, kälteste Behandlung. | Spiegelung (konzipiert) + Steuerrechner inline + Sozialhilfe inline |

---

## C. HÖCHSTER NUTZEN

Geordnet nach dem Effekt auf die Lebensraum-Skala (PLACE_VS_ADMINISTRATION.md):

| Rang | Arbeit | Effekt auf Skala | Emotionaler Effekt |
|------|--------|-----------------|-------------------|
| 1 | **Behörden-Spiegelung** | 1/5 → 3/5 | Normalisierung des Angstbesetztesten |
| 2 | **Versicherungen-Spiegelung** | 1/5 → 3/5 | Totalsumme als Aha-Moment |
| 3 | **Notfall-Spiegelung V1** | 2/5 → 4/5 | "Du bist vorbereitet" |
| 4 | **Ausbildung-Spiegelung** | 1/5 → 2/5 | Bewilligungs-Countdown |
| 5 | **13 Orientierungssätze verdrahten** | Alle Kapitel +0.2 | Mehr Kontext, weniger Kälte |
| 6 | **SchuldenManager → Finanzen** | Finanzen bleibt 2/5, aber kohärenter | Schulden im Lebenskontext, nicht als Tool |
| 7 | **KK-Scanner + IPV → Versicherungen** | Versicherungen +0.5 | Alles an einem Ort |
| 8 | **Steuerrechner + Sozialhilfe → Behörden** | Behörden +0.5 | Hilfe direkt beim Thema |

---

## D. NIEDRIGSTER AUFWAND

Geordnet nach Implementierungsaufwand:

| Rang | Arbeit | Aufwand | Typ |
|------|--------|---------|-----|
| 1 | **2 Orientierungssätze verdrahten** (Patientenverfügung, Vorsorgeauftrag auf Notfall-Felder) | 15 Minuten | 2 Zeilen in constants.js |
| 2 | **Ausbildung-Spiegelung** | 1–2 Stunden | Wenige Felder, kein Cross-Chapter |
| 3 | **Behörden-Spiegelung** | 2–3 Stunden | Konzept fertig, folgt Pattern |
| 4 | **Notfall-Spiegelung V1** | 2–3 Stunden | Konzept fertig, ersetzt Emergency-Summary |
| 5 | **Versicherungen-Spiegelung** | 3–4 Stunden | Mehr Felder, Totalsummen-Berechnung |
| 6 | **5–8 weitere Orientierungssätze verdrahten** | 1–2 Stunden | constants.js + evtl. neue i18n-Keys |
| 7 | **Organspende-Tool entfernen** (redundant zum Feld) | 30 Minuten | Cleanup |
| 8 | **CV-Generator als Button in Ausbildung** | 1–2 Stunden | UI-Integration |
| 9 | **IPV als Sektion in Versicherungen** | 2–3 Stunden | UI-Integration |
| 10 | **KK-Scanner inline in Versicherungen** | 3–4 Stunden | UI-Integration |
| 11 | **SchuldenManager als Tab in Finanzen** | 4–6 Stunden | Grössere UI-Umstrukturierung |
| 12 | **Steuerrechner + Sozialhilfe in Behörden** | 4–6 Stunden | Grössere UI-Umstrukturierung |

---

## E. DEFINITION OF DONE

### Wann ist die Lebensraum-Phase abgeschlossen?

Die Lebensraum-Phase ist abgeschlossen, wenn:

**1. Jedes Kapitel hat eine Spiegelung.**

| Kapitel | Spiegelung | Status |
|---------|-----------|--------|
| Basis | ✓ | Fertig |
| Wohnen | ✓ | Fertig |
| Finanzen | ✓ | Fertig |
| Versicherungen | ○ | **Offen** |
| Ausbildung | ○ | **Offen** |
| Behörden | ○ | **Offen** (Konzept fertig) |
| Notfall | ○ | **Offen** (Konzept fertig) |

**2. Jedes Kapitel hat mindestens 2 Orientierungssätze auf Feldern.**

| Kapitel | Aktive Sätze | Minimum erreicht |
|---------|-------------|-----------------|
| Basis | 1 (AHV) | ✗ — braucht 1 mehr |
| Wohnen | 2 (Miete, Wohnform) | ✓ |
| Finanzen | 4 (Einkommen, Steuern, Schulden, 3a) | ✓ |
| Versicherungen | 5 (KVG, Franchise, BVG, UVG, AHV) | ✓ |
| Ausbildung | 2 (Beruf, Bewilligung) | ✓ |
| Behörden | 3 (Steuerverwaltung, Sozialdienst, Betreibung) | ✓ |
| Notfall | 0 | ✗ — braucht 2 (Patientenverfügung + Vorsorgeauftrag existieren, nur nicht verdrahtet) |

**3. Jedes Kapitel hat einen warmen Empty State.**

| Kapitel | Eigener Empty State | Status |
|---------|-------------------|--------|
| Alle 7 | ✓ | **Fertig** |

**4. Der Durchschnitt auf der Lebensraum-Skala liegt bei ≥ 2.5/5.**

| Kapitel | Aktuell | Nach Spiegelungen |
|---------|---------|------------------|
| Basis | 3 | 3 |
| Wohnen | 3 | 3 |
| Finanzen | 2 | 2 |
| Versicherungen | 1 | **3** |
| Ausbildung | 1 | **2** |
| Behörden | 1 | **3** |
| Notfall | 2 | **4** |
| **Durchschnitt** | **1.9** | **2.9** |

**2.9/5 erfüllt die Schwelle von 2.5.**

### Die Schwelle

Die Lebensraum-Phase ist abgeschlossen wenn:

- [  ] 7/7 Spiegelungen implementiert
- [  ] 6/7 Kapitel haben ≥ 2 Orientierungssätze auf Feldern
- [  ] 7/7 warme Empty States ✓ (bereits erfüllt)
- [  ] Durchschnitt ≥ 2.5 auf der Lebensraum-Skala
- [  ] Notfall-Orientierungssätze (Patientenverfügung, Vorsorgeauftrag) verdrahtet

### Was NICHT zur Schwelle gehört

- ✗ Werkzeug-Integration (ist nächste Phase, nicht Lebensraum-Voraussetzung)
- ✗ Neue Lebensräume (Gesundheit, Familie — kommt danach)
- ✗ Übergänge (brauchen fertige Lebensräume als Grundlage)
- ✗ Neue Orientierungssätze schreiben (13 existieren bereits ungenutzt)
- ✗ 4-Sprachen-Vollständigkeit für neue Mirror-Keys (DE reicht für Schwelle, andere Sprachen folgen)

### Der Arbeitsumfang bis "Done"

| Arbeit | Aufwand |
|--------|---------|
| Behörden-Spiegelung (Konzept fertig) | 2–3 Stunden |
| Notfall-Spiegelung V1 (Konzept fertig) | 2–3 Stunden |
| Versicherungen-Spiegelung (konzipieren + bauen) | 4–5 Stunden |
| Ausbildung-Spiegelung (konzipieren + bauen) | 2–3 Stunden |
| 2 Orientierungssätze verdrahten (Notfall) | 15 Minuten |
| i18n-Keys für 4 neue Spiegelungen (DE) | 1–2 Stunden |
| i18n-Keys für 4 neue Spiegelungen (EN, FR, IT) | 2–3 Stunden |
| **Total** | **~14–19 Stunden** |

Das sind 2–3 konzentrierte Arbeitstage.

---

## ZUSAMMENFASSUNG

### Was fertig ist
- 3 Spiegelungen (Basis, Wohnen, Finanzen)
- 17 Orientierungssätze auf Feldern + 2 kontextabhängige
- 7 warme Empty States
- 7 Intro-Texte

### Was fehlt
- 4 Spiegelungen (Behörden, Notfall, Versicherungen, Ausbildung)
- 2 Orientierungssätze verdrahten (Notfall)
- ~14–19 Stunden Arbeit

### Wann ist es fertig
Wenn alle 7 Kapitel eine Spiegelung haben und der Durchschnitt auf der Lebensraum-Skala ≥ 2.5 liegt.

**Das ist nicht viel. Es ist eine überschaubare, klar definierte Arbeit.**

Die Lebensraum-Phase hat kein Architektur-Problem und kein Visions-Problem. Sie hat eine Fertigstellungslücke. 4 Spiegelungen und 2 verdrahtete Sätze — das ist der Abstand zwischen "teilweise Ort" und "überwiegend Ort".

---

### Danach

Wenn die Schwelle erreicht ist:

| Phase | Was | Warum |
|-------|-----|-------|
| **Werkzeug-Integration** | 8 Tools in Lebensräume verschieben | Sackmesser → integrierte Orte |
| **Neue Lebensräume** | Gesundheit, Familie | Grösste inhaltliche Lücken |
| **Übergänge** | Umzug als erster Pfad | Beweis des Konzepts |

Aber das ist die nächste Frage. Nicht diese.

---

*LIFE_SPACE_COMPLETION.md — Bestandsaufnahme der Lebensraum-Phase.*
*14–19 Stunden. 4 Spiegelungen. 2 Sätze. Dann ist die Phase abgeschlossen.*
