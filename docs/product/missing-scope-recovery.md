# A-032 — Missing Product Scope Recovery

> Vollständige Bestandsaufnahme aller fehlenden Produktinhalte, Feedbacks, Lücken und nächsten Workpackages.
> Kein Code. Keine UI. Nur Recovery und Struktur.
>
> Stand: 2026-05-27

---

## Executive Summary

Maloja Plana hat eine solide technische Basis (17 Views, 53 Source-Dateien, 4 Registries, ~260 Backlog-Einträge). Die Design-Consolidation A-031A/B/C ist abgeschlossen. **Aber:** Zwischen der dokumentierten Produktvision und dem tatsächlichen Produktstand klafft eine erhebliche Lücke. Viele besprochene Ideen, Feedbacks und Kernfunktionen sind in Docs vorhanden, aber nicht priorisiert, nicht strukturiert eingearbeitet oder im Code noch nicht sichtbar.

### Zahlen auf einen Blick

| Kategorie | Anzahl |
|-----------|--------|
| Backlog-Einträge total (product-inventory.md) | 260 |
| Davon implementiert ("done") | 28 (10.8%) |
| Davon geplant ("planned") | 57 (21.9%) |
| Davon nur Idee ("idea") | 175 (67.3%) |
| Bekannte Bugs | 7 |
| Offene Entscheidungspunkte | 12 |
| Feedback-Einträge (feedback-log.md) | 15 |
| Davon behoben | 4 |
| Davon nur dokumentiert | 8 |
| Davon offen/geplant | 3 |

### Kritischste Lücken

1. **Budget/Finanzen** — Nur Basis-Sync implementiert (Income vs. 5 Ausgabeposten). Kein echtes Budget-Tracking, keine Fixkosten-Kategorien, keine Alimente, keine Stipendien, keine Sparziele, keine Notfallreserve.
2. **Feedback von Mutter** — Nur 1 vage Referenz ("mother feedback" zu Budget). Inhalte NICHT strukturiert erfasst.
3. **Export als Lebensbereich** — Nur ZIP-Export + PDF-Export implementiert. Keine "Lebensmappe", kein "Dossier", kein Behördenexport-Flow.
4. **Household Model** — Nicht implementiert. Blockiert SKOS-Korrektur, Alimente, Familienzulagen, korrekte Budget-Templates.
5. **Generatoren** — Nur CV-Generator implementiert. 17 weitere Generatoren sind nur Idee.
6. **Emotionale Temperatur** — Schwerste Lebenssituationen (Schulden, Sozialhilfe, Steuern) haben kälteste UI-Behandlung.

---

## 1. Feedback Recovery

### 1.1 Silvan (Alpha-Tester)

| # | Thema | Problem | Status | Produktbereich | Priorität | Beta-relevant |
|---|-------|---------|--------|----------------|-----------|---------------|
| S-1 | Datum-Reset visuell | Vorherige Auswahl bleibt nach Reset sichtbar | **Behoben** (A-024) | UX / Formulare | Hoch | Ja |
| S-2 | Flaggen-Inkonsistenz Onboarding | DE/FR/IT mit Schweizer Kreuz, EN mit UK-Flagge | **Behoben** (commit 1374af9) | UX / i18n | Niedrig | Ja |
| S-3 | Dashboard Attention Balance | Viele Elemente konkurrieren um gleiche Aufmerksamkeit | **Nur dokumentiert** (live-product-feedback.md) | UX / Dashboard | Mittel | Ja |

### 1.2 Jana (Alpha-Testerin)

| # | Thema | Problem | Status | Produktbereich | Priorität | Beta-relevant |
|---|-------|---------|--------|----------------|-----------|---------------|
| J-1 | Kantonsnamen ausschreiben | Dropdown zeigt "BS" statt "Basel-Stadt" | **Behoben** (commit 1374af9) | UX / Klarheit | Niedrig | Ja |

### 1.3 Mutter

| # | Thema | Problem | Status | Produktbereich | Priorität | Beta-relevant |
|---|-------|---------|--------|----------------|-----------|---------------|
| M-1 | Budget UX | Budget braucht mehr Geduld und Finesse, soll supportiv sein | **Nur vage referenziert** (pre-store-critical-issues.md:160) | Budget / Finanzen | Hoch | Ja |
| M-2 | Weiteres Feedback | **NICHT GEFUNDEN — muss manuell rekonstruiert werden** | Unbekannt | Unbekannt | Unbekannt | Unbekannt |

**ACHTUNG:** Die "Family feedback (domain expert)"-Einträge F-008 bis F-013 könnten von Mutter stammen (BVG-Kontinuität, UVG/KTG, Selbständigkeit, Retirement, AHV-Admin). Das ist aber nicht explizit zugeordnet. Stebler Studios muss klären, ob das Mutter-Feedback ist oder von einer anderen Person.

### 1.4 Family Feedback (Domain Expert) — nicht namentlich zugeordnet

| # | Thema | Problem | Status | Ref |
|---|-------|---------|--------|-----|
| FE-1 | BVG-Kontinuität | Freizügigkeitskonten gehen bei Jobwechsel verloren | Dokumentiert (social-protection-system.md) | F-008 |
| FE-2 | UVG/KTG Sichtbarkeit | AN sehen Abzüge, kennen aber Versicherer nicht | Dokumentiert (employment-and-insurance.md) | F-009 |
| FE-3 | Selbständige Versicherungslücken | Wissen nicht welche SV sie brauchen | Dokumentiert (employment-and-insurance.md) | F-010 |
| FE-4 | Retirement Timeline | Pensionierung als Life-Stage-Input fehlt | Dokumentiert (retirement-timeline.md) | F-011 |
| FE-5 | AHV-Administration | Klarheit über Ausgleichskasse, Registrierung | Dokumentiert (social-protection-system.md) | F-013 |

### 1.5 Basel-Stadt User (Sozialhilfe)

| # | Thema | Problem | Status | Ref |
|---|-------|---------|--------|-----|
| BS-1 | SKOS Haushalt falsch | Kinder werden als Erwachsene berechnet | Bug offen (blockiert von Household Model) | F-001 |
| BS-2 | BVG Doppelabzug | Nettolohn enthält bereits BVG | **Behoben** (commit 4cb226f) | F-002 |
| BS-3 | Vorsorge-Dokumente fehlen | PV, Vorsorgeauftrag, Bestattung | Teilweise implementiert (Checkliste im Notfall-Kapitel) | F-003 |
| BS-4 | Mietbeiträge fehlen | Jetzt auch 1-2 Personenhaushalte | Geplant (Phase 13) | F-004 |
| BS-5 | Versicherungs-Links fehlen | IPV + KVG Katalog Links | Geplant (Phase 13) | F-005 |
| BS-6 | Retirement Flow | Pensioniert ja/nein, EL, Auszahlungsart | Geplant (Phase 9+14) | F-006 |
| BS-7 | AHV-Duplikation | AHV in Basis und KK-Scanner separat | Teilweise behoben (Autofill done, Conflict pending) | F-007 |

### 1.6 Internes Review

| # | Thema | Problem | Status | Ref |
|---|-------|---------|--------|-----|
| IR-1 | Hardcoded German | cantonalData.js gibt deutsche Strings zurück | Bug offen | F-012 |

### 1.7 Zusammenfassung Feedback-Status

| Quelle | Einträge | Behoben | Dokumentiert | Offen/Unklar |
|--------|----------|---------|--------------|--------------|
| Silvan | 3 | 2 | 1 | 0 |
| Jana | 1 | 1 | 0 | 0 |
| Mutter | 1+ | 0 | 1 (vage) | **Unbekannt — Recovery nötig** |
| Family Expert | 5 | 0 | 5 | 0 |
| Basel-Stadt User | 7 | 2 | 0 | 5 |
| Internes Review | 1 | 0 | 0 | 1 |

---

## 2. Budget / Finanzen Gap

### 2.1 Was existiert im Code

| Feature | Datei | Was es tut |
|---------|-------|------------|
| BudgetSync | budgetSync.js | Zieht Income + 5 Ausgaben aus Kapitel-Daten |
| BudgetSync UI | BudgetSync.jsx | Zeigt Income, Expenses, Remaining, Savings Rate |
| SchuldenManager | SchuldenManager.jsx + schuldenCalc.js | Schulden-Tracking mit Tilgungslogik |
| BudgetImport | BudgetImport.jsx + csvImport.js | CSV-Import für Budget-Daten |
| ChartsAdvanced | ChartsAdvanced.jsx | Visualisierung Finanzdaten |

### 2.2 Was der Code tatsächlich trackt

| Einnahmeseite | Ausgabeseite |
|---------------|--------------|
| monthlyIncome (1 Feld) | rent |
| — | utilities |
| — | mortgage |
| — | buildingsInsurance (jährlich /12) |
| — | healthInsurance (KK-Prämie) |
| — | (BVG/AHV als Referenz, nicht als Kosten) |

**Das ist es. 1 Einnahme, 5 Ausgaben.**

### 2.3 Was fehlt (Vergleich mit Produktvision & Schweizer Realität)

#### Einnahmeseite — fehlt komplett
| Bereich | Status | Priorität | Phase |
|---------|--------|-----------|-------|
| Brutto/Netto-Unterscheidung | Backlog (MP-DAT-006) | **Core** | Beta |
| Zweites Einkommen (Partner) | Fehlt, braucht Household Model | Important | Beta+ |
| Kinderzulagen | Backlog (MP-HH-005) | Important | Beta |
| Alimente (empfangen) | Backlog (MP-SOZ-013) | Important | Beta |
| Stipendien / Ausbildungsbeiträge | Backlog (MP-SOZ-012) | Important | Beta |
| Sozialhilfe-Leistungen | Nur als Rechner, nicht als Einnahme | Important | Beta |
| EL (Ergänzungsleistungen) | Nur Eligibility-Check, nicht als Einnahme | Important | Post-Beta |
| IPV (als Einnahme/Entlastung) | Nur als Rechner, nicht als Budget-Posten | Important | Beta |
| Rente (AHV/BVG/3a) | Felder existieren, nicht im Budget | Important | Post-Beta |
| Nebenerwerb | Nicht vorhanden | Experimental | Post-Beta |

#### Ausgabeseite — massiv unterentwickelt
| Bereich | Status | Priorität | Phase |
|---------|--------|-----------|-------|
| Steuern (monatlich umgelegt) | Nicht im Budget | **Core** | Beta |
| Alimente (zahlen) | Backlog (MP-HH-004) | Important | Beta |
| Schulden/Raten | SchuldenManager existiert, aber nicht im Budget verknüpft | Important | Beta |
| Abos / Subscriptions | Backlog (MP-BUD-005) | Experimental | Post-Beta |
| Mobilität (ÖV/Auto) | Backlog (MP-BUD-006) | Experimental | Future |
| Lebensmittel / Haushalt | Nicht vorhanden | Important | Beta |
| Kleidung | Nicht vorhanden | Experimental | Post-Beta |
| Kommunikation (Telefon, Internet) | Nicht vorhanden | Important | Beta |
| Freizeit / Kultur | Nicht vorhanden | Experimental | Post-Beta |
| Kinderbetreuung | Nicht vorhanden, braucht Household | Important | Beta+ |
| Bildung / Weiterbildung | Nicht vorhanden | Experimental | Post-Beta |
| Notfallreserve / Rückstellungen | Nicht vorhanden | Important | Beta |
| 3a-Beiträge | Felder existieren, nicht im Budget | Experimental | Post-Beta |

#### Orientierung/Guidance — fehlt
| Bereich | Status | Priorität |
|---------|--------|-----------|
| SKOS-basierte Budget-Templates | Nur in budget-guidance.md dokumentiert, nicht implementiert | Core |
| Lebenssituation-basierte Templates | Nur in budget-guidance.md dokumentiert, nicht implementiert | Important |
| Kantonale Benchmarks | Nicht vorhanden | Important |
| Jahresübersicht | Annualforecast existiert (x12), aber keine echte Jahresübersicht | Important |
| Schulden-Budget-Integration | SchuldenManager isoliert vom Budget | Important |
| "Calm Budget" Philosophie | budget-guidance.md definiert es, Code zeigt noch Judgment ("expensesCritical") | Important |

### 2.4 Budget Beta-Empfehlung

**Minimum für Beta:**
1. Brutto/Netto-Unterscheidung (MP-DAT-006)
2. Fixkosten-Kategorien: Steuern, Kommunikation, Lebensmittel, Transport
3. Schulden-Integration im Budget (MP-BUD-002)
4. Alimente (zahlen/empfangen) — braucht Household
5. SKOS-Templates für Lebenssituationen
6. "Calm Budget" umsetzen — keine Judgment-Sprache

**Nicht Beta:** Abo-Management, Nebenerwerb, ÖV-Tracking, Benchmarks

---

## 3. Export Gap — "Kein Sackmesser"

### 3.1 Was existiert im Code

| Feature | Datei | Format | UX-Gefühl |
|---------|-------|--------|------------|
| ZIP-Export | ZipExport.jsx | ZIP (JSON + CSV + Manifest) | Technisch, Daten-Export |
| PDF-Export | (über Browser-Print) | PDF | Funktional |
| CV-Generator | CVGenerator.jsx | HTML/PDF | Nützlich, zukunftsorientiert |
| Budget-Report | BudgetSync.jsx (JSON download) | JSON | Rein technisch |
| KK-Scanner QR | KKScanner.jsx | QR-Code | Scanner-Tool |

### 3.2 Was fehlt — Export als Lebensbereich

Die Produktvision sagt: "Export soll nicht wie ein Sackmesser wirken, sondern als ruhiger Dashboard-/Lebensbereich." Aktuell sind Exports verstreut über verschiedene Views ohne einheitliches Konzept.

#### Vorgeschlagene Neudenke: "Meine Unterlagen"

Statt einer Formatliste (PDF, JSON, YAML, CSV, DOCX) sollte Export als **Lebensbereich** gedacht werden:

| Dossier-Typ | Zweck | Enthält | Priorität |
|-------------|-------|---------|-----------|
| **Für mich selbst** | Persönliche Übersicht | Alle Kapitel-Zusammenfassungen, Budget, Dokumente | Core |
| **Für Behörde** | Amt, Gemeinde, Kanton | Relevante Daten pro Amt vorbereitet, mit Checkliste | Important |
| **Für Versicherung** | KK, Haftpflicht, etc. | Versicherungsdaten, Leistungsnachweise | Important |
| **Für Arbeitgeber** | Bewerbung, Anstellung | CV, Zeugnisse, Bewilligungstyp | Important |
| **Für Familie / Notfall** | Vorsorge-Dossier | Notfallkontakte, Vorsorgeauftrag, PV, Bestattungswünsche | Important |
| **Für Sozialarbeiter** | Betreuungssituation | Budget, Schulden, Sozialhilfe-Daten, Wohnsituation | Important |
| **Für Steuererklärung** | Jahresabschluss | Einkommen, Abzüge, Versicherungen, Vorsorge | Experimental |

#### Produktflow statt Formatliste

```
Meine Unterlagen
├── Dossier erstellen
│   ├── Was soll enthalten sein? (Kapitel-Auswahl)
│   ├── Für wen? (Ich / Behörde / Versicherung / Familie / ...)
│   ├── Welches Format? (PDF / verschlüsselt / druckfertig)
│   └── Vorschau → Export
├── Vorbereitete Dossiers
│   ├── Behördendossier (vorbefüllt basierend auf Kanton)
│   ├── Notfalldossier (verschlüsselt, für Angehörige)
│   └── Steuerdossier (Jahresübersicht)
└── Letzte Exports (History)
```

### 3.3 Export Beta-Empfehlung

1. "Meine Unterlagen" als eigener Bereich (nicht verstreute Export-Buttons)
2. Mindestens 2 Dossier-Typen: "Für mich" + "Für Notfall/Familie"
3. PDF als Hauptformat
4. Kein YAML, kein LaTeX, kein DOCX in Beta

---

## 4. Design / Brand Gap

### 4.1 Was existiert und funktioniert
- Malojapass-SVG mit Easter Eggs (Edelweiss, Gipfelkreuz, Matterhorn, Kuh, Schokolade, Sonne, Fahne)
- Tier-System (Core/Supporting/Protective)
- IconSystem mit ~40 SVG-Piktogrammen (Schweizer Charakter)
- Palette definiert und implementiert (Creme/Salbei/Anthrazit/Sand)
- DM Sans lokal gehostet
- Dark Mode
- A-031A: JS-Tokens implementiert
- A-031B: Typography Lift implementiert (12→15px Body)
- A-031C: Subtle Materiality implementiert

### 4.2 Was fehlt (nach A-031)
| Lücke | Status | Ref |
|-------|--------|-----|
| CSS-Tokens werden in 0 JSX-Dateien referenziert | A-031A adressiert via JS-Tokens | Audit B10 |
| Semantische Farbverwendung inkonsistent | Teilweise verbessert durch A-031C | Audit B5 |
| `palette.top` nicht verwendet | Unverändert | Audit B3 |
| Unicode-Prefixe (~80 Buttons) neben SVG-System | Bewusst deferred | Audit B20 |
| Icons oft zu klein dargestellt | Unklar ob A-031 dies adressiert hat | Audit B19 |
| Emotionale Temperatur der "schweren" Screens | Dokumentiert, nicht adressiert | Audit B28-B31 |
| Kapitelzeilen zu kompakt | Dokumentiert, teilweise durch A-031B verbessert | Audit B24 |

### 4.3 Schweizer Symbolik
- Malojapass: **Im Code** (Dashboard SVG)
- Edelweiss: **Im Code** (Dashboard Easter Egg + IconSystem)
- Gipfelkreuz: **Im Code** (Dashboard Easter Egg)
- Matterhorn: **Im Code** (Dashboard Easter Egg)
- Kuhglocke: **Im Code** (Dashboard Easter Egg Sound-Referenz)
- Rösti: **Nicht im Code** — nur konzeptionell besprochen
- Weitere Alpen-Symbole (Tannen, Schokolade, Sonne, Fahne): **Im Code** (Dashboard Easter Eggs)

---

## 5. Swiss Knowledge Gap

### 5.1 Implementiert mit voller Tiefe
| Bereich | Kantone | Tiefe |
|---------|---------|-------|
| IPV-Berechnung | Alle 26 | Hoch |
| PLZ→Kanton | Alle | Hoch |
| SKOS-Grundbedarf | National + 11 Kantone Mietlimiten | Mittel (Household-Bug) |
| EL-Eligibility | Basis | Mittel |
| Steuer-Basis | Grundstruktur | Niedrig |
| Schulden/SchKG | Tracking + Berechnung | Mittel |
| Wochenaufenthalt | Info-System | Mittel |

### 5.2 Nur dokumentiert, nicht implementiert
| Bereich | Doc-Referenz | Priorität |
|---------|-------------|-----------|
| AHV-Rentenberechnung | swiss-knowledge-registry.md 1.1 | Important |
| AHV-Beitragslücken | swiss-knowledge-registry.md 1.1 | Important |
| BVG-Freizügigkeit | social-protection-system.md | Important |
| BVG-Koordinationsabzug | swiss-knowledge-registry.md 1.5 | Experimental |
| ALV-Taggeldberechtigung | swiss-knowledge-registry.md 1.4 | Important |
| IV-Orientierung | swiss-knowledge-registry.md 1.2 | Experimental |
| EO-Rechner | swiss-knowledge-registry.md 1.3 | Experimental |
| 3a-Maximalbeitrag | swiss-knowledge-registry.md 1.6 | Experimental |
| Franchise-Optimierung | swiss-knowledge-registry.md 2.3 | Experimental |
| TARMED/TARDOC-Leistungsprüfung | swiss-knowledge-registry.md 2.1 | Future |
| Kantonale Steuerfüsse | swiss-knowledge-registry.md 4.2 | Important |
| Kantonale Prämienregionen | swiss-knowledge-registry.md 9.3 | Experimental |
| Kantonale Stipendien-Logik | swiss-knowledge-registry.md 9.3 | Important |
| Mietbeiträge (kantonal) | housing-and-benefits.md | Important |
| Quellensteuer vs. ordentliche Veranlagung | product-inventory.md MP-TAX-003 | Important |

### 5.3 Swiss Knowledge Beta-Minimum
1. AHV-Orientierung (nicht Berechnung, nur Info + Links)
2. BVG-Freizügigkeit-Awareness (Wo sind meine Gelder?)
3. ALV-Orientierung (Was tun bei Jobverlust?)
4. Mietbeiträge-Hinweis (kantonal)
5. Kantonale Steuerfuss-Referenz

---

## 6. Generator Gap

### 6.1 Implementiert
| Generator | Status |
|-----------|--------|
| CV-Generator | Done |

### 6.2 Geplant für Beta (nur Idee)
| Generator | Ref | Komplexität | Braucht |
|-----------|-----|-------------|---------|
| Template Engine Core | MP-GEN-016 | Hoch | Kerninfrastruktur |
| Briefgenerator (allgemein) | MP-GEN-018 | Mittel | Template Engine |
| Patientenverfügung | MP-GEN-002 | Hoch | Kantonale Varianten |
| Vorsorgeauftrag | MP-GEN-003 | Hoch | Kantonale Varianten |
| Kündigungsschreiben | MP-GEN-004 | Mittel | Mietrecht-Logik |
| Bestattungsgenerator | MP-GEN-001 | Mittel | — |
| IPV-Antrag Vorbereitung | MP-GEN-009 | Mittel | Kantonale Formulare |

### 6.3 Generator Beta-Empfehlung
1. Template Engine Core (MP-GEN-016) — ohne das geht kein Generator
2. Briefgenerator (allgemein) — niedrigste Komplexität, höchster Nutzen
3. Kündigungsschreiben — konkreter, alltagsnaher Nutzen
4. Rest nach Beta

---

## 7. Interface / API Gap

Aktuell: **Kein Backend, keine APIs, 100% lokal.** Das ist gewollt.

Geplante Schnittstellen (alle nur Idee):
- REST API (MP-API-001) — Post-Beta
- CalDAV/Google Calendar (MP-API-003/004) — Future
- BAG Krankenkassen-API (MP-API-007) — Future
- BFS Referenzdaten (MP-API-008) — Future
- QR-Bill Scanning (MP-API-006) — Future
- mailto: Export (MP-API-005) — Beta

**Beta-relevant:** Nur mailto: für Behördenkontakt. Alles andere ist Post-Beta oder Future.

---

## 8. Vollständige Gap-Übersicht (A–F Status)

### Legende
- **A** = Im Code vorhanden
- **B** = Nur in Docs vorhanden
- **C** = Im Backlog vorhanden (product-inventory / backlog-registry)
- **D** = Nirgends sauber erfasst
- **E** = Unklar / widersprüchlich
- **F** = Wichtig, aber noch nicht priorisiert

| Bereich | Status | Details |
|---------|--------|---------|
| Budget: 1 Einkommen, 5 Ausgaben | A | budgetSync.js — funktioniert, aber zu dünn |
| Budget: Fixkosten-Kategorien | D | Lebensmittel, Kommunikation, Transport nicht erfasst |
| Budget: Steuern als Ausgabe | D | Nicht im Budget, nicht im Backlog als Budget-Posten |
| Budget: Alimente | C | MP-SOZ-013, MP-HH-004 — nur Backlog |
| Budget: Stipendien | C | MP-SOZ-012 — nur Backlog |
| Budget: Calm-Budget-Philosophie | B | budget-guidance.md — nicht im Code |
| Budget: SKOS-Templates | B | budget-guidance.md — nicht im Code |
| Budget: Brutto/Netto | C | MP-DAT-006 — nur Backlog |
| Budget: Schulden-Integration | C | MP-BUD-002 — nur Backlog |
| Budget: Jahresübersicht | E | x12-Forecast existiert, echte Jahresübersicht fehlt |
| Household Model | C | MP-HH-001 — blockiert vieles |
| Export: "Meine Unterlagen" | D | Konzept besprochen ("kein Sackmesser"), nicht dokumentiert |
| Export: Behördendossier | C | MP-EXP-012 — nur Backlog |
| Export: Notfalldossier | D | Nicht sauber erfasst |
| Generatoren: Template Engine | C | MP-GEN-016 — geplant, nicht implementiert |
| Generatoren: 17 weitere | C | Alle nur Idee |
| Mutter-Feedback | D | **Nicht auffindbar — muss rekonstruiert werden** |
| Feedback: Empty States kalt | B | live-product-feedback.md — nicht adressiert |
| Feedback: Dashboard Attention | B | live-product-feedback.md — nicht adressiert |
| Emotionale Temperatur | B | emotional-temperature-map.md — nicht im Code |
| AHV-Orientierung | C | MP-SOZ-001 — nur Backlog |
| BVG-Freizügigkeit | B | social-protection-system.md |
| ALV-Orientierung | C | MP-SOZ-005 — nur Backlog |
| Mietbeiträge | C | MP-BEH-008 — nur Backlog |
| Kantonale Steuerfüsse | C | MP-TAX-002 — nur Backlog |
| Retirement Flow | B+C | retirement-timeline.md + MP-SOZ-015 |
| Selbständigkeit-Modul | C | MP-SOZ-014 — nur Backlog |
| Life-Event-Checklisten | C | MP-REM-007 — nur Backlog |
| Onboarding interaktiv | C | MP-UX-012 — nur Backlog |
| PWA / Service Worker | C | MP-INF-001 — nur Backlog |
| Impressum / AGB / Datenschutz | C | MP-LEG-001/002/003 — nur Backlog |
| Rätoromanisch | C | MP-UX-002 — nur Backlog |
| Genderneutrale Sprache | C | MP-UX-005 — nur Backlog |
| SKOS-Haushalt-Bug | A (Bug) | MP-BUG-001 — blockiert von Household |
| Hardcoded German | A (Bug) | MP-BUG-002 — offen |
| QR-Code CDN offline | A (Bug) | MP-BUG-003 — offen |
| BVG Doppelabzug | E | MP-BUG-005 — "behoben" in Feedback-Log, aber Backlog sagt noch offen |

---

## 9. Beta-Relevanz-Matrix

### MUSS für Beta (Core)
| # | Was | Warum | Blockiert von |
|---|-----|-------|---------------|
| 1 | Budget erweitern (Fixkosten, Steuern, Schulden-Integration) | Zu dünn für realen Nutzen | Brutto/Netto-Entscheidung |
| 2 | Household Model (Basis) | Blockiert SKOS, Alimente, Familienzulagen, Budget-Templates | — |
| 3 | SKOS-Bug fixen | Falsche Berechnungen = Vertrauensverlust | Household Model |
| 4 | Hardcoded German fixen | i18n-Bruch für 3/4 der Sprachen | — |
| 5 | Export als "Meine Unterlagen" | Kernproduktversprechen | — |
| 6 | Impressum + Datenschutz + AGB | Gesetzliche Pflicht | — |
| 7 | Template Engine Core | Ermöglicht alle Generatoren | — |

### SOLL für Beta (Important)
| # | Was | Warum |
|---|-----|-------|
| 8 | Emotionale Temperatur schwerer Screens | Produktversprechen "Ruhe + Vertrauen" |
| 9 | Briefgenerator + Kündigungsschreiben | Alltagsnutzen, beweist Generator-System |
| 10 | AHV/BVG/ALV Orientierung | Schweizer Kernwissen |
| 11 | Mietbeiträge-Hinweis | Häufiger Bedarf |
| 12 | Alimente im Budget | Reale Lebenssituation |
| 13 | "Calm Budget" umsetzen | Kein Judgment, keine Scham |
| 14 | Mutter-Feedback rekonstruieren | Wertvolles Nutzerfeedback geht verloren |
| 15 | PWA / Service Worker | Offline-Zuverlässigkeit |

### KANN warten (Post-Beta)
- Rätoromanisch, Abo-Management, Franchise-Optimierung, AI-Agents, REST API, Calendar Sync, Community, Gamification-Evaluation, Monetarisierung

---

## 10. Empfohlene nächste Workpackages

### WP-1: Mutter-Feedback Recovery (Sofort, manuell)
Stebler Studios muss das Feedback von Mutter manuell rekonstruieren und in feedback-log.md eintragen. Ohne das fehlt eine der wichtigsten Feedback-Quellen.

### WP-2: Budget Hardening (A-033)
- Brutto/Netto-Unterscheidung
- Fixkosten-Kategorien (Steuern, Kommunikation, Lebensmittel, Transport)
- Schulden-Integration im Budget
- SKOS-basierte Budget-Templates
- "Calm Budget" Sprache
- Jahresübersicht

### WP-3: Household Model Basis (A-034)
- Erwachsene/Kinder unterscheiden
- SKOS-Bug fixen
- Alimente-Basis
- Familienzulagen-Basis
- Kein vollständiges Household — nur was SKOS + Budget brauchen

### WP-4: Export Redesign "Meine Unterlagen" (A-035)
- Konzept: Dossier-basiert statt Formatliste
- Mindestens "Für mich" + "Für Notfall/Familie"
- PDF als Hauptformat
- Eigener Bereich, nicht verstreute Buttons

### WP-5: Hardcoded German Fix (A-036)
- cantonalData.js i18n-Migration
- premiumCalc.js i18n-Migration
- Alle Berechnungsergebnisse durch t() leiten

### WP-6: Template Engine + Erste Generatoren (A-037)
- Template Engine Core
- Briefgenerator (allgemein)
- Kündigungsschreiben (Mietvertrag)

### WP-7: Legal Compliance (A-038)
- Impressum
- Datenschutzerklärung
- Nutzungsbedingungen

### WP-8: Swiss Orientation Layer (A-039)
- AHV-Orientierung (Info + Links)
- BVG-Freizügigkeit-Awareness
- ALV-Orientierung
- Mietbeiträge-Hinweis

### Empfohlene Reihenfolge
```
WP-1 (Mutter-Feedback)     → Sofort (Stebler Studios, manuell)
WP-5 (Hardcoded German)    → Klein, sicher, hoher Impact
WP-2 (Budget Hardening)    → Grösste Nutzerlücke
WP-3 (Household Basis)     → Entblockt SKOS + Budget
WP-4 (Export Redesign)     → Produktidentität
WP-7 (Legal)               → Pflicht für jede Veröffentlichung
WP-6 (Template Engine)     → Ermöglicht Generatoren
WP-8 (Swiss Orientation)   → Schweizer Mehrwert
```

---

## 11. Widersprüche & Unklarheiten

| # | Thema | Widerspruch |
|---|-------|-------------|
| 1 | BVG-Bug | feedback-log.md sagt "Fixed (commit 4cb226f)", backlog-registry.yaml zeigt MP-BUG-005 noch als "idea" mit dependency auf MP-DAT-006. Unklar ob der Fix vollständig ist. |
| 2 | Family Feedback Quelle | F-008 bis F-013 als "Family feedback (domain expert)" — ist das Mutter oder jemand anders? |
| 3 | Phase 1 Governance Runtime | BACKLOG_MASTER.md beschreibt Phase 1 als 6-8 Wochen mit 26 Tickets. product-memory-registry.md sagt "System Consolidation" ist aktuelle Phase. Stimmen die überein? |
| 4 | Backlog-Duplikate | BACKLOG_MASTER.md hat eigene IDs (BUD-001, DOC-001), product-inventory.md hat andere IDs (MP-BUD-001, MP-DOC-001). Zwei Systeme, nicht synchron. |
| 5 | Export-Richtung | product-memory-registry.md listet "PDF, JSON, YAML, CSV, DOCX, ZIP, LaTeX" als Formate. Stebler Studios sagt "kein Sackmesser". Widerspruch zwischen Format-Breite und Calm-Export. |

---

*Dokument: missing-scope-recovery.md v1.0.0*
*Erstellt: 2026-05-27*
*Maschinenlesbares Pendant: missing-scope-recovery.json*
