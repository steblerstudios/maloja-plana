# Chat-Backlog — Konsolidierte Übersicht aller offenen Punkte

> **Quelle:** Vollständige Analyse aller 3 Chat-Transkripte (Sessions 191befd6, 45af6aac, 640c90f7),  
> abgeglichen gegen: Code-Stand (`e253117`), BACKLOG_MASTER.md, OPEN_GAPS_USER_STORIES.md,  
> known-issues.md, feedback-log.md, open-questions.md  
> **Stand:** 2026-05-17  
> **Autor:** Automatisch extrahiert + manuell verifiziert

---

## Legende

| Status | Bedeutung |
|--------|-----------|
| **Offen** | Besprochen, nicht begonnen |
| **Teilweise** | Begonnen, aber nicht vollständig |
| **Bug** | Bekannter Fehler, noch nicht behoben |
| **Entscheidung nötig** | Offene Architektur-/Strategiefrage |
| **Dokumentiert** | Nur in docs/ beschrieben, kein Code |

| Priorität | Kriterium |
|-----------|-----------|
| **Hoch** | Blockiert Alpha-Qualität oder nächste Phase |
| **Mittel** | Wichtig für Produktreife, nicht blockierend |
| **Niedrig** | Nice-to-have, kann warten |

---

## Inhaltsverzeichnis

1. [Bekannte Bugs & Regressions](#1-bekannte-bugs--regressions)
2. [Teilweise umgesetzte Features](#2-teilweise-umgesetzte-features)
3. [Alpha-Polish & Quick Wins](#3-alpha-polish--quick-wins)
4. [i18n & Sprache](#4-i18n--sprache)
5. [Swiss Domain Logic](#5-swiss-domain-logic)
6. [Datenmodell & Architektur](#6-datenmodell--architektur)
7. [Dokumente & Scanner](#7-dokumente--scanner)
8. [Budget & Finanzen](#8-budget--finanzen)
9. [UX, Accessibility & Design](#9-ux-accessibility--design)
10. [Sicherheit & Datenschutz](#10-sicherheit--datenschutz)
11. [Kalender & Erinnerungen](#11-kalender--erinnerungen)
12. [Phase 1 — Governance Runtime](#12-phase-1--governance-runtime)
13. [Phase 2 — Workflow Engine & Agents](#13-phase-2--workflow-engine--agents)
14. [Infrastruktur & Deployment](#14-infrastruktur--deployment)
15. [Legal & Compliance](#15-legal--compliance)
16. [Rollen & Multi-Account](#16-rollen--multi-account)
17. [Langfristige Vision](#17-langfristige-vision)
18. [Offene Entscheidungspunkte](#18-offene-entscheidungspunkte)

---

## 1. Bekannte Bugs & Regressions

### T001: SKOS Haushalts-Zusammensetzung falsch berechnet
- **Kategorie:** Sozialhilfe / Berechnungen
- **Dependencies:** Household Model (T035)
- **Priorität:** Hoch
- **Status:** Bug
- **Quelle:** KI-001, F-001, Chat Session 1+2
- **Hinweis:** `householdSize = 1 + Number(dependents)` behandelt alle Abhängigen als Erwachsene. SKOS hat unterschiedliche Sätze für Kinder vs. Erwachsene. Basel-Stadt Grundbedarf CHF 1061 vs. national CHF 1031 ebenfalls nicht abgebildet.
- **Betroffene Datei:** `src/config/cantonalData.js:192`
- **Fix benötigt:** Korrekte SKOS-Tabellen mit Personenkategorien (Erwachsene/Kinder/Alter)

### T002: Hardcoded German in cantonalData.js
- **Kategorie:** i18n
- **Dependencies:** —
- **Priorität:** Hoch
- **Status:** Bug
- **Quelle:** KI-004, F-012, Chat Session 1
- **Hinweis:** Return-Werte enthalten deutsche Strings, die das i18n-System umgehen. Nicht-deutschsprachige Nutzer sehen Deutsch in Berechnungsergebnissen.
- **Betroffene Datei:** `src/config/cantonalData.js`, `src/premiumCalc.js`

### T003: QR-Code CDN-Abhängigkeit (Offline-Fail)
- **Kategorie:** Offline-First / Dependencies
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Bug
- **Quelle:** KI-005, Chat Session 1+2+3
- **Hinweis:** `qrcodejs` wird von cdnjs.cloudflare.com geladen. Auch `jsQR`, `tesseract.js`, `JsBarcode`, `jspdf` kommen von CDN. QR-Generation und OCR scheitern offline.
- **Betroffene Dateien:** `src/KKScanner.jsx`, `src/kkScanner.js`, `src/OrganDonation.jsx`, `src/utils/helpers.js`
- **Fix:** Libraries bundlen oder als lokale Kopie einfügen

### T004: Auto-Save schreibt alle 5s ohne Dirty-Flag
- **Kategorie:** Performance
- **Dependencies:** —
- **Priorität:** Niedrig
- **Status:** Bug
- **Quelle:** KI-008
- **Hinweis:** `src/main.jsx` schreibt localStorage alle 5 Sekunden, auch wenn sich nichts geändert hat. Auf Low-End-Geräten potenzielles Performance-Problem.

---

## 2. Teilweise umgesetzte Features

### T005: KK-Scanner Daten-Konsistenz
- **Kategorie:** Datenarchitektur
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Teilweise
- **Quelle:** KI-003, F-007, Chat Session 2
- **Hinweis:** Autofill + Persist implementiert (Commit `ae1184f`). **Noch offen:** Conflict-Warnings wenn gescannte Werte von gespeicherten Daten abweichen, AHV-Display-Masking (visuelles Verbergen der AHV-Nummer).

### T006: Vorsorge-Dokument-Checkliste
- **Kategorie:** Notfall / Vorsorge
- **Dependencies:** Dokumenten-Tresor (T042)
- **Priorität:** Mittel
- **Status:** Teilweise
- **Quelle:** F-003, Chat Session 2
- **Hinweis:** Ja/Nein-Checkliste in EmergencyHub implementiert (Commit `013ce85`). **Noch offen:** Dokument-Uploads zum Tresor verlinken, Gemeinde-Registrierungs-Erinnerungen, kantonsspezifische Formular-Links.

### T007: Calm Dashboard Evolution
- **Kategorie:** UX / Dashboard
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Teilweise
- **Quelle:** Chat Session 2+3
- **Hinweis:** Chapter-Completion-Cards, Guided-Start-Card, Welcome-Area implementiert. **Noch offen:** Progressive Disclosure, Feldgruppierung, reduzierte kognitive Last, Calm Life Orientation statt Admin-Tool-Gefühl.

### T008: Reminder-System
- **Kategorie:** Kalender / Erinnerungen
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Teilweise
- **Quelle:** Chat Session 2
- **Hinweis:** CalendarReminders-View existiert mit OverdueBanner. **Noch offen:** Wiederkehrende Erinnerungen, smarte Intervalle, Kategorien, Benachrichtigungen, Completion-Tracking, vollständige Kalenderansicht.

### T009: Budget CSV/PDF Import
- **Kategorie:** Budget / Import
- **Dependencies:** —
- **Priorität:** Niedrig
- **Status:** Teilweise
- **Quelle:** Chat Session 2
- **Hinweis:** BudgetImport.jsx existiert für CSV. **Noch offen:** PDF-Import, erweiterte Spalten-Erkennung, Schweizer Semikolon-Format vollständig, Validierung.

---

## 3. Alpha-Polish & Quick Wins

### T010: Link-Validierung (CH_SUPPORT_LINKS)
- **Kategorie:** UX / Vertrauen
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 1 (explizit angefragt)
- **Hinweis:** User hat explizit gesagt: "schau auf jeden fall bitte dass alle links die du gibts auch wirklich sinn machen". Links in cantonalData.js (ahv-iv.ch, monokk.ch, betreibungsamt.ch, estv.admin.ch etc.) wurden nie validiert.

### T011: Button Unicode-Prefixes vs. SVG Icons
- **Kategorie:** UX / Konsistenz
- **Dependencies:** IconSystem.jsx
- **Priorität:** Niedrig
- **Status:** Offen (bewusst deferred)
- **Quelle:** Chat Session 2+3, Memory
- **Hinweis:** ~80 Buttons verwenden Unicode-Symbole (✓ ✕ □ ↗), die nicht mit dem SVG-Icon-System übereinstimmen. Explizit als "zu viel Churn" markiert, aber langfristig inkonsistent.

### T012: SKOS nur nationale Werte
- **Kategorie:** Berechnungen
- **Dependencies:** T001
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** KI-006
- **Hinweis:** Nur nationale SKOS-Werte modelliert. Kantonsabweichungen (z.B. Basel-Stadt CHF 1061 vs. national CHF 1031) nicht unterstützt.

### T013: current-state.md veraltet
- **Kategorie:** Dokumentation
- **Dependencies:** —
- **Priorität:** Niedrig
- **Status:** Offen
- **Hinweis:** `docs/status/current-state.md` beschreibt noch "Prepare the next product slice: calm onboarding / guided start" — das ist bereits implementiert. Sollte aktualisiert werden.

---

## 4. i18n & Sprache

### T014: Rätoromanisch (RM) — leere Übersetzungsdatei
- **Kategorie:** i18n / Kulturelle Identität
- **Dependencies:** —
- **Priorität:** Hoch
- **Status:** Offen
- **Quelle:** Chat Session 1+2+3, OPEN_GAPS GAP-06
- **Hinweis:** `src/i18n/rm.js` existiert (0 Zeilen), ist aber weder in `SUPPORTED` Array noch in `translations` Object in `src/i18n/index.js` eingebunden. Wurde als Schweizer Identitäts-Feature betont, nicht nur Übersetzung. Professionelle Übersetzung nötig.
- **Entscheidung nötig:** Crowdsourced vs. professionelle Übersetzung. Vollständig vs. teilweise/glossar-basiert.

### T015: Zusätzliche Sprachen (Migrations-Sprachen)
- **Kategorie:** i18n
- **Dependencies:** T014
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 1
- **Hinweis:** Vorbereitung für: Albanisch, Ukrainisch, Arabisch, Türkisch, Portugiesisch, Spanisch, Serbisch/Kroatisch/Bosnisch, Tigrinya. i18n-Architektur ist bereit, aber keine Dateien erstellt.

### T016: RTL-Support (Arabisch)
- **Kategorie:** i18n / Layout
- **Dependencies:** T015
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Arabisch benötigt Right-to-Left Layout. Architekturentscheidung noch nicht getroffen.

### T017: Genderneutrale & inklusive Sprache
- **Kategorie:** i18n / UX
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 2+3, GAP-15
- **Hinweis:** Styleguide für genderneutrale Sprache in allen 4 Sprachen. Einfache Formulierungen (B1-Niveau). Konsistente Terminologie.

### T018: Text-to-Speech (Vorlesefunktion)
- **Kategorie:** Accessibility / i18n
- **Dependencies:** UX-013
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 2, BACKLOG UX-013
- **Hinweis:** Web Speech API (zero-dependency). Für Analphabeten, Sehbehinderte, ältere Nutzer. In mehreren Gaps referenziert.

---

## 5. Swiss Domain Logic

### T019: Mietbeiträge / Housing Benefits
- **Kategorie:** Wohnen / Sozialleistungen
- **Dependencies:** Cantonal Data
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** F-004
- **Hinweis:** Gilt jetzt auch für 1-2 Personen-Haushalte. Nicht implementiert.

### T020: Retirement Timeline & Pensionsplanung
- **Kategorie:** Vorsorge / Finanzen
- **Dependencies:** Household Model (T035)
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** F-006, F-011, Chat Session 2
- **Hinweis:** Pensionierungsjahr als Life-Stage-Input, AHV/BVG-Verknüpfung (monatlich vs. Kapital), EL-Berechtigung, Steuerimplikationen, Dokumenten-Erinnerungen.

### T021: UVG/KTG Transparenz
- **Kategorie:** Versicherungen / Arbeit
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** F-009, Chat Session 2
- **Hinweis:** Arbeitnehmer sehen UVG/KTG-Abzüge auf Lohnabrechnung, kennen aber Versicherer und Deckung nicht. App soll helfen: Versicherer, Police, Deckungslücken erfassen.

### T022: Selbstständigkeit-Modul
- **Kategorie:** Arbeit / Versicherungen
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** F-010, Chat Session 2
- **Hinweis:** AHV-Selbstanmeldung, Unfallversicherung, KTG, optionale BVG, Haftpflicht. Kernfrage: "Was wenn ich einen Unfall habe?"

### T023: BVG-Kontinuität & Freizügigkeitskonten
- **Kategorie:** Vorsorge
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** F-008, Chat Session 2
- **Hinweis:** Vergessene Freizügigkeitskonten bei Stellenwechsel sind häufig. Nutzer brauchen Orientierung wo Vorsorgegelder liegen.

### T024: AHV-Verwaltungs-Klarheit
- **Kategorie:** Sozialversicherungen
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** F-013, Chat Session 2
- **Hinweis:** Kantonale Ausgleichskasse, Arbeitgeber vs. Selbstanmeldung, Beitragslücken. Besonders wichtig für Stellenwechsler und neu Selbstständige.

### T025: IPV-Link-System & Eligibility-Detection
- **Kategorie:** Versicherungen
- **Dependencies:** Canton Data
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** F-005, Chat Session 2
- **Hinweis:** Links für Prämienverbilligung und KVG-Katalog pro Kanton. Automatische Hinweise bei möglicher Berechtigung.

### T026: LGAV / Mindestlohn-Checks
- **Kategorie:** Arbeit / Recht
- **Dependencies:** —
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Branchenspezifische Gehaltscompliance (z.B. Koch → Gastro-LGAV). Informationell, nicht rechtsverbindlich.

### T027: Versicherungslücken-Erkennung
- **Kategorie:** Versicherungen
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Fehlende Rega, Haftpflicht, Hausrat, Pensionslücken, Invalidität. Calm guidance only.

### T028: BAG Krankenkassen-Integration
- **Kategorie:** Versicherungen
- **Dependencies:** OCR (T042)
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Vergleich mit offiziellen BAG-Daten, Franchise-Modelle, Anbieter, Formulare prefill.

### T029: Sozialhilfe Steuer-Guidance
- **Kategorie:** Steuern / Sozialleistungen
- **Dependencies:** Canton Data
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Kontextuelle Steuer-Guidance je nach Kanton und Unterstützungsart. Decision-Tree-Ansatz.

---

## 6. Datenmodell & Architektur

### T030: Kontakt- & Beziehungs-Layer
- **Kategorie:** Datenmodell / Core
- **Dependencies:** —
- **Priorität:** Hoch
- **Status:** Offen
- **Quelle:** Chat Session 2 (ausführlich besprochen)
- **Hinweis:** Kontakte (Arzt, Zahnarzt, Arbeitgeber, Vermieter, Versicherung, Beistand, Sozialarbeiter, Familie, Behörden) verknüpfbar mit Dokumenten, Erinnerungen, Timeline, Rechnungen, Kapiteln. Kernbaustein für viele weitere Features.

### T031: Life-Timeline-System
- **Kategorie:** UX / Datenmodell
- **Dependencies:** T030
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Ruhige Lebens-Timeline, verbindet Vergangenheit/Gegenwart/Zukunft. Basis für Life-Event-Workflows.

### T032: Spinnennetz (Life-Web) Visualisierung
- **Kategorie:** UX / Datenmodell
- **Dependencies:** T030, T031
- **Priorität:** Mittel
- **Status:** Dokumentiert
- **Quelle:** Chat Session 2, docs/spinnennetz/
- **Hinweis:** Verknüpfte Lebensbereiche mit Abhängigkeiten. Ruhige Visualisierung ohne kognitive Überlastung. Dokumentation existiert unter `docs/spinnennetz/`.

### T033: Derived-State Engine
- **Kategorie:** Architektur / Core
- **Dependencies:** Canton Data, T030
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Automatische Berechnung kantonsabhängiger Werte, Versicherungslücken, Eligibility-Hints. Zukunftsarchitektur.

### T034: Canton Rule Engine
- **Kategorie:** Architektur / Swiss Logic
- **Dependencies:** Canton Data
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Self-updating Swiss Rules Engine: kantonale Gesetze, BAG-Änderungen, Steueränderungen, IPV, LGAV, AHV/IV/EO-Werte. Versioniert und historisch.

### T035: Household Model
- **Kategorie:** Datenmodell / Core
- **Dependencies:** T030
- **Priorität:** Hoch
- **Status:** Offen
- **Quelle:** Chat Session 2, open-questions.md
- **Hinweis:** Multi-Personen-Haushalt (Partner, Kinder, gemischte Einkommen, Renten, Sozialhilfe, Alimente). Architektur-Shift von Einzelperson zu Haushalt. Blockiert korrekte SKOS-Berechnung (T001).
- **Offene Fragen:** Singles, Paare, Verheiratete, getrennte Eltern, WGs, Mehrgenerationen, Wochenaufenthalter, Kinder mit mehreren Wohnsitzen.

### T036: Globale Suche
- **Kategorie:** UX / Core
- **Dependencies:** T030
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Einheitliche Suche über Dokumente, Kontakte, Verträge, Erinnerungen, Rechnungen.

---

## 7. Dokumente & Scanner

### T037: OCR / Dokumenten-Scanner
- **Kategorie:** Source Ingestion
- **Dependencies:** T042 (Tresor)
- **Priorität:** Hoch
- **Status:** Offen
- **Quelle:** GAP-09, DOC-002, Chat Session 2+3
- **Hinweis:** Offline-OCR für Rechnungen, KVG-Formulare, Bescheinigungen. Automatisches Tagging und Zuordnung zu Budget/Versicherungen.
- **Entscheidung nötig:** Tesseract.js (offline, zero-server) vs. Cloud OCR. Empfehlung: Tesseract.js, aber Spike für Performance/Accuracy nötig.
- **Hinweis:** `tesseract.js` wird bereits als CDN-Script in `src/kkScanner.js` geladen — aber als externes CDN, nicht gebundelt.

### T038: Template & Dokumenten-Generation
- **Kategorie:** Dokumente / Export
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 2, docs/product/template-engine.md
- **Hinweis:** PDF/DOCX-Export, offizielle Briefe, Formular-Vorbereitung, automatische Placeholder-Befüllung aus Nutzerdaten, mehrsprachige Vorlagen, kantonsspezifische Varianten.

### T039: Dokument-Beziehungen (relational)
- **Kategorie:** Datenmodell / Dokumente
- **Dependencies:** T030, T042
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Relationale Dokumentarchitektur (Mietvertrag verknüpft mit Wohnung, Vermieter, Versicherung, Kaution etc.)

### T040: Multi-File Upload / Drag & Drop
- **Kategorie:** UX / Dokumente
- **Dependencies:** T042
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** DOC-004, GAP-14
- **Hinweis:** Drag & Drop, Batch-Import, Progress-Anzeige. Touch-freundlich (44px targets).

### T041: PDF-Vorschau in-App
- **Kategorie:** UX / Dokumente
- **Dependencies:** T042
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** DOC-007
- **Hinweis:** Ohne externe Libraries. Browser-native PDF-Rendering.

### T042: Dokumenten-Tresor Hardening
- **Kategorie:** Security / Dokumente
- **Dependencies:** —
- **Priorität:** Hoch
- **Status:** Teilweise
- **Quelle:** GAP-10, DOC-001, Chat Session 2+3
- **Hinweis:** DocumentTresor.jsx existiert mit Basic-Upload und IndexedDB-Speicher. **Noch offen:** E2E-Verschlüsselung (AES-256-GCM), rollenbasierter Zugriff, Versionierung, Web Crypto API Key-Management (PBKDF2 aus User-Passphrase).

---

## 8. Budget & Finanzen

### T043: Calm Budget-Orientierung
- **Kategorie:** Budget / UX
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 2, docs/product/budget-guidance.md
- **Hinweis:** Realistische monatliche Budget-Orientierung (kein striktes Budgetieren). Lebenssituation-basierte Templates, fehlende-Kosten-Erkennung. Psychologisch sicher, schamfrei. BudgetSync existiert als View, aber nicht als vollständiges Orientierungssystem.

### T044: Schulden-Integration im Budget
- **Kategorie:** Budget / Finanzen
- **Dependencies:** BUD-001
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** GAP-12, BUD-002, Chat Session 2+3
- **Hinweis:** Dashboard mit Schulden, Ausgaben, Einnahmen. Automatische Gegenüberstellung. Alerts bei Überschreitung.
- **Offene Frage:** Woher kommen Schulden-Daten? (manuell, Import, API?)

### T045: Realistische Budget-Vorschläge (CH-Benchmarks)
- **Kategorie:** Budget / Finanzen
- **Dependencies:** BUD-001, BUD-003
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** BUD-007, Chat Session 2
- **Hinweis:** Vergleich mit Durchschnittswerten. Keine AI-generierten Fantasie-Zahlen.
- **Offene Frage:** Datenquellen? BFS, Comparis, eigene Erhebung?

### T046: Abo-Management / Subscription Tracking
- **Kategorie:** Budget
- **Dependencies:** BUD-001
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** BUD-005
- **Hinweis:** Tracking aller Abos, Renewal-Erinnerungen, automatische Erkennung aus Dokumenten.

### T047: Selbstständigen-Buchhaltung
- **Kategorie:** Budget / Selbstständigkeit
- **Dependencies:** T022, OCR (T037)
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Belege, OCR, Rechnungen, QR-Bill-Scanning, MWST, Privat/Geschäft-Trennung.

---

## 9. UX, Accessibility & Design

### T048: Low-Literacy / Universal Design
- **Kategorie:** Accessibility / UX
- **Dependencies:** IconSystem
- **Priorität:** Hoch
- **Status:** Offen
- **Quelle:** UX-012, GAP-07, Chat Session 2
- **Hinweis:** Piktogramm-basierte Flows, visuelle Hilfen, vereinfachte Sprache für Analphabeten, Sehbehinderte, ältere Nutzer. Icon-basierte Navigation als Alternative zu Text.

### T049: Schriftgrössen & Kontrast anpassbar
- **Kategorie:** Accessibility
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** UX-011
- **Hinweis:** Anpassbar, Low Vision Support. WCAG AAA angestrebt. Senior-Friendly Mode mit grosser Typographie.

### T050: Tastatur-Navigation vollständig
- **Kategorie:** Accessibility
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Teilweise
- **Quelle:** UX-017, Chat Session 2
- **Hinweis:** Phase 3 hat focus-visible und skip-link implementiert. **Noch offen:** Vollständige Tab-Reihenfolge in allen 17 Views, Custom-Widgets (Selects, Modals).

### T051: Interaktives Tutorial / Onboarding Flow
- **Kategorie:** UX / Onboarding
- **Dependencies:** i18n
- **Priorität:** Mittel
- **Status:** Teilweise
- **Quelle:** GAP-16, UX-016, Chat Session 2+3
- **Hinweis:** Onboarding.jsx existiert mit Sprach-/Kanton-Auswahl. Guided Start Card implementiert. **Noch offen:** Schritt-für-Schritt Tutorial, erneut abrufbar, TTS-Support, Inline-Tooltips.

### T052: Calm Gamification / Fortschritts-Visualisierung
- **Kategorie:** UX / Motivation
- **Dependencies:** —
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** VIS-001, Chat Session 2
- **Hinweis:** Wachsendes Life-Network, Completeness-Indikatoren, strukturierter Fortschritt. KEIN Spiel — rein visuell. Gamification-Mechaniken (XP, Badges, Levels) explizit abgelehnt.

### T053: Life-Event-Workflows
- **Kategorie:** UX / Workflows
- **Dependencies:** T030, T031
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Umzug, Heirat, Scheidung, Geburt, Tod, Pensionierung lösen Checklisten, Dokumenten-Vorbereitung, Erinnerungen, rechtliche Workflows aus.

### T054: User Feedback Interface (In-App)
- **Kategorie:** UX / QA
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** COM-F02
- **Hinweis:** In-App Feedback-Button für Alpha-Tester. Feedback sammeln, priorisieren, sichtbar machen.

---

## 10. Sicherheit & Datenschutz

### T055: AHV-Nummer visuelles Masking
- **Kategorie:** Privacy / UX
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 2 (als "Slice C" identifiziert)
- **Hinweis:** AHV-Nummer im KKScanner und überall mit `***.****.****.**` maskieren, nur bei expliziter Aktion anzeigen.

### T056: Verschlüsselung at-rest (Web Crypto API)
- **Kategorie:** Security / Core
- **Dependencies:** —
- **Priorität:** Hoch
- **Status:** Teilweise
- **Quelle:** SEC-006, Chat Session 2
- **Hinweis:** Backup-Export nutzt bereits Web Crypto API (`src/utils/backupCrypto.js`). **Noch offen:** Verschlüsselung aller sensiblen Daten im localStorage/IndexedDB at-rest. Key-Management (PBKDF2 aus User-Passphrase).

### T057: Death & Legacy Mode
- **Kategorie:** Security / Notfall
- **Dependencies:** Rollen (T065)
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Notfall-Dokumenten-Freigabe, Vertrauensperson-Aktivierung, Erbschafts-Bundles, Vertragskündigungs-Checklisten.

### T058: Delegation & Trusted Access
- **Kategorie:** Security / Rollen
- **Dependencies:** T065
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Eltern helfen Kindern, Betreuer, Beistände, Sozialarbeiter. Granulare, widerrufbare, auditierbare Berechtigungen.

---

## 11. Kalender & Erinnerungen

### T059: Benachrichtigungen (In-App, Push)
- **Kategorie:** UX / Kalender
- **Dependencies:** T008
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** COM-004, COM-005
- **Hinweis:** In-App-Hinweise zu Fristen, Budget, Aufgaben. Optional Push für wichtige Deadlines (nur mit expliziter Zustimmung). Calm UX — nicht aufdringlich.

---

## 12. Phase 1 — Governance Runtime

> **Status:** Vollständig geplant (26 Tasks), ZERO Code geschrieben  
> **Ref:** BACKLOG_MASTER.md P1-001 bis P1-026, PHASE_1_MASTER.md  
> **Dauer:** 6-8 Wochen  
> **Priorität:** Hoch (nächste Implementierungsphase)

### Zusammenfassung der 26 Tasks:

| Milestone | Tasks | Inhalt |
|-----------|-------|--------|
| M1: Runtime Foundation | P1-001 bis P1-005 | Event Bus, State Machine, Audit Logger (IndexedDB), Module Registry, Health Indicator |
| M2: Validation Engine | P1-006 bis P1-009 | Rule Schema, Rule Evaluator, Evidence Register, Migration bestehender Validation |
| M3: Source Ingestion | P1-010 bis P1-013 | File Parser (JSON/CSV), Schema Mapper, Ingestion Pipeline, Import UI |
| M4: Human Approval Gates | P1-014 bis P1-016 | Approval Gate Component, Gate Registry, Approval Wiring + Evidence |
| M5: Audit & Observability | P1-017 bis P1-021 | Audit Viewer, System Status, Export, Retention Policy, System Navigation |
| M6: Integration & Polish | P1-022 bis P1-026 | E2E Tests, Mobile QA, Dark Mode QA, ADRs, Performance Gate |

**Alle 26 Tasks sind offen. Detaillierte Specs existieren in `docs/roadmap/PHASE_1_MASTER.md`.**

---

## 13. Phase 2 — Workflow Engine & Agents

> **Status:** Vollständig geplant (31 Tasks), ZERO Code geschrieben  
> **Ref:** BACKLOG_MASTER.md P2-001 bis P2-031, PHASE_2_BLUEPRINT.md  
> **Dauer:** 8-12 Wochen  
> **Prerequisite:** Phase 1 complete  
> **Priorität:** Hoch (nach Phase 1)

### Zusammenfassung der 31 Tasks:

| Milestone | Tasks | Inhalt |
|-----------|-------|--------|
| P2.M1: Workflow Engine | P2-001 bis P2-005 | DAG Schema, Executor, Event Middleware, Progress UI, Templates |
| P2.M2: Policy & Roles | P2-006 bis P2-009 | Role Schema, Policy Engine, Role Manager UI, Policy Audit |
| P2.M3: Agent Sandbox | P2-010 bis P2-014 | Agent Runtime, Suggestion API, 4 Built-in Agents, Sidebar UI, Agent Audit |
| P2.M4: Rollback System | P2-015 bis P2-018 | Snapshot Engine, Rollback Executor, Wizard UI, Evidence Chain |
| P2.M5: Real-Time Dashboard | P2-019 bis P2-022 | Metrics Aggregator, Dashboard 2.0, Live Stream, Workflow History |
| P2.M6: Compliance Export | P2-023 bis P2-025 | Report Templates, PDF/JSON Export, Compliance Viewer |
| P2.M7: Integration | P2-026 bis P2-031 | E2E Tests, Mobile QA, Dark Mode, ADRs, IndexedDB Migration, Performance |

**Alle 31 Tasks sind offen. Detaillierte Specs existieren in `docs/roadmap/PHASE_2_BLUEPRINT.md`.**

---

## 14. Infrastruktur & Deployment

### T060: PWA-Hardening / Service Worker
- **Kategorie:** Infrastruktur / Offline
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Offline-PWA mit Service Worker, Installierbarkeit. `sw.js` existiert als Stub, aber kein vollständiges PWA-Setup.

### T061: CI/CD Pipeline
- **Kategorie:** Infrastruktur / DevOps
- **Dependencies:** —
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** INF-005
- **Hinweis:** GitHub Actions: automatisierte Tests, Builds, Lighthouse-Checks. Aktuell nur manuelles Deployment via Vercel.

### T062: White-Label / Organisation-Readiness
- **Kategorie:** Infrastruktur / Business
- **Dependencies:** Phase 2
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Konfigurierbare Branding, kantonsspezifische Versionen, Organisations-Dashboards. `src/config/whitelabel.js` existiert als Stub.

---

## 15. Legal & Compliance

### T063: Impressum, AGB, Datenschutzerklärung
- **Kategorie:** Legal / Pflicht
- **Dependencies:** —
- **Priorität:** Hoch (vor Go-Live)
- **Status:** Offen
- **Quelle:** LEG-001 bis LEG-003, Chat Session 2+3
- **Hinweis:** Pflichtangaben gemäss Schweizer Recht. DSGVO/DSG-konform. Nutzungsbedingungen. Haftungsausschluss. **Muss vor öffentlicher Beta existieren.**

### T064: Datenschutzrechte Interface (DSGVO Art. 15-20)
- **Kategorie:** Legal / UX
- **Dependencies:** T063
- **Priorität:** Hoch (vor Go-Live)
- **Status:** Offen
- **Quelle:** LEG-006
- **Hinweis:** Nutzer: Daten exportieren, löschen, einsehen. Da App offline-first: Export = ZipExport, Löschen = localStorage.clear() + IndexedDB-Reset.

---

## 16. Rollen & Multi-Account

### T065: Familien-/Account-Übergabe
- **Kategorie:** Account / Security
- **Dependencies:** Phase 2 RBAC
- **Priorität:** Hoch (Post-Phase 2)
- **Status:** Offen
- **Quelle:** GAP-11, ROL-001, Chat Session 2+3
- **Hinweis:** Kinder-Account bei Volljährigkeit/Auszug übertragen. Re-Keying, Audit-Trail, Benachrichtigung. Rechtliche Fragen CH Jugendschutz klären.

### T066: Multi-Device Sync
- **Kategorie:** Runtime / Infrastructure
- **Dependencies:** Phase 2, Backend-Entscheidung
- **Priorität:** Mittel
- **Status:** Offen
- **Quelle:** ROL-004
- **Hinweis:** Daten zwischen Geräten synchronisieren. Conflict Resolution, Offline-First. CRDTs evaluieren.
- **Entscheidung nötig:** Rein lokal (current) vs. optionale Server-Sync-Schicht.

---

## 17. Langfristige Vision

### T067: Mobilitäts-Modul
- **Kategorie:** Neue View
- **Dependencies:** —
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Auto, ÖV, GA/Halbtax, Fahrausweis, MFK-Erinnerungen, Fahrzeugversicherung, Reifenwechsel.

### T068: Inventar / Hausrats-Management
- **Kategorie:** Neue View
- **Dependencies:** Dokumenten-Tresor
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** Objekt-Fotos, Belege, Garantie, Versicherungswert, Schadendokumentation, exportierbares Inventar.

### T069: Nachbarschafts-/Community-Layer
- **Kategorie:** Social / Community
- **Dependencies:** Rollen
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** COM-F01, Chat Session 2
- **Hinweis:** Lokale Vertrauensnetzwerke, Mini-Jobs, Nachbarschaftshilfe. Kein Social-Media-Feed. Moderation nötig.

### T070: Mini-Job Legal-Infrastruktur
- **Kategorie:** Arbeit / Recht
- **Dependencies:** T069
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** Chat Session 2
- **Hinweis:** AHV bei Mini-Jobs, legale Entlohnung, Lohndokumentation.

### T071: Monetarisierung / Business Model
- **Kategorie:** Business
- **Dependencies:** —
- **Priorität:** Niedrig
- **Status:** Entscheidung nötig
- **Quelle:** Chat Session 2
- **Hinweis:** Freemium-Modell dokumentiert. Premium: Family Mode, Cloud Backup, erweiterte Sync, Export, Scanner, PDF Tools. B2B-Partnerschaften. White-Label-Lizenzierung.

### T072: Nachhaltigkeit / CSR Badge
- **Kategorie:** Marketing / Werte
- **Dependencies:** —
- **Priorität:** Niedrig
- **Status:** Offen
- **Quelle:** VIS-002, GAP-18
- **Hinweis:** B Corp Zertifizierung langfristig. MVP: Self-declared Sustainability Statement + Schema.org Markup.

---

## 18. Offene Entscheidungspunkte

> Architektur- und Strategiefragen die noch nicht entschieden sind.

| # | Thema | Frage | Empfehlung | Ref |
|---|-------|-------|------------|-----|
| E1 | **Storage** | Rein lokal vs. optionale Server-Sync? | Lokal bleiben für MVP, Sync als Phase 3+ | GAP-01 |
| E2 | **OCR Engine** | Tesseract.js (offline) vs. Cloud OCR? | Tesseract.js — Spike für Performance nötig | GAP-09 |
| E3 | **Auth** | Passwort vs. WebAuthn vs. Magic Link? | WebAuthn + Passphrase-Fallback, kein Backend | GAP-04 |
| E4 | **Romansh** | Vollständig vs. teilweise vs. Glossar? | Teilweise + professionelle Übersetzung | GAP-06 |
| E5 | **API** | REST vs. GraphQL? | REST für MVP (weniger Overhead) | GAP-03 |
| E6 | **Charts** | SVG vs. Canvas? | SVG (Accessibility, Screen Reader) | GAP-17 |
| E7 | **Mail-Export** | mailto: vs. API? | mailto: für MVP, API Phase 3+ | GAP-13 |
| E8 | **Household** | Wann einführen? Wie komplex? | Nach Phase 1, iterativ | open-questions.md |
| E9 | **Sync-Konflikte** | CRDTs vs. Last-Write-Wins? | CRDTs evaluieren wenn Sync kommt | open-questions.md |
| E10 | **Monetarisierung** | Free/Pro/Premium — was hinter Paywall? | Business Model Canvas erstellen | BACKLOG |
| E11 | **DSG vs. DSGVO** | Welches Datenschutzrecht primär? | Rechtsberatung einholen | BACKLOG |
| E12 | **Gamification** | Wie weit darf Motivation gehen? | Kein Spiel — nur sanfte visuelle Fortschrittsanzeige | BACKLOG |

---

## Statistik

| Kategorie | Offen | Teilweise | Bug | Entscheidung | Total |
|-----------|-------|-----------|-----|--------------|-------|
| Bugs & Regressions | — | — | 4 | — | 4 |
| Teilweise Features | — | 5 | — | — | 5 |
| Alpha-Polish | 4 | — | — | — | 4 |
| i18n & Sprache | 4 | — | — | 1 | 5 |
| Swiss Domain Logic | 11 | — | — | — | 11 |
| Datenmodell & Architektur | 6 | — | — | 1 | 7 |
| Dokumente & Scanner | 4 | 1 | — | 1 | 6 |
| Budget & Finanzen | 4 | 1 | — | — | 5 |
| UX & Accessibility | 5 | 2 | — | — | 7 |
| Sicherheit & Datenschutz | 2 | 1 | — | — | 3+1 |
| Kalender | 1 | — | — | — | 1 |
| Phase 1 (Governance) | 26 | — | — | — | 26 |
| Phase 2 (Workflow) | 31 | — | — | — | 31 |
| Infrastruktur | 3 | — | — | — | 3 |
| Legal & Compliance | 2 | — | — | — | 2 |
| Rollen & Multi-Account | 1 | — | — | 1 | 2 |
| Langfristige Vision | 5 | — | — | 1 | 6 |
| **Total** | **~109** | **~10** | **4** | **~5** | **~128** |

Plus 12 offene Entscheidungspunkte.

---

## Empfohlene Reihenfolge (Kritischer Pfad)

```
Sofort (Alpha-Qualität):
  T001 → SKOS Household Bug (blockiert korrekte Berechnungen)
  T002 → Hardcoded German in cantonalData
  T003 → CDN-Dependencies bundlen (Offline-First Verletzung)
  T010 → Link-Validierung
  T063 → Impressum/AGB/Datenschutz (vor öffentlicher Beta)

Nächste Phase (Produktreife):
  T014 → Rätoromanisch (Identitäts-Feature)
  T030 → Kontakt-Layer (Enabler für viele Features)
  T037 → OCR Spike (Tesseract.js evaluieren)
  T042 → Dokumenten-Tresor Hardening
  T056 → Verschlüsselung at-rest

Phase 1 (Governance Runtime):
  P1-001 bis P1-026 → Vollständiger Runtime-Umbau

Phase 2+ (nach Governance):
  P2-001 bis P2-031 → Workflow Engine
  T035 → Household Model
  T065 → Account-Übergabe
```

---

## Verhältnis zu existierenden Docs

| Dokument | Überschneidung | Neue Items aus Chat |
|----------|---------------|---------------------|
| BACKLOG_MASTER.md | ~60% | T010, T013, T030-T036, T047, T053, T055, T057-T058, T067-T072 |
| OPEN_GAPS_USER_STORIES.md | ~40% | Swiss Domain Logic T019-T029, UX Items T048-T054 |
| known-issues.md | 100% | — (alle KI-Items abgedeckt) |
| feedback-log.md | 100% | — (alle F-Items abgedeckt) |
| open-questions.md | ~30% | Viele Fragen werden durch Tasks hier operationalisiert |

---

*Dokument generiert: 2026-05-17*  
*Quellen: 3 Chat-Transkripte, 8 Roadmap-Docs, Git History (173 Commits), Code-Audit (42 Source Files)*  
*Nächster Schritt: Priorisierung im Team, ADR-Entscheidungen für E1-E12*
