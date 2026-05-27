# Maloja Plana — Product Inventory (A-029)

> Vollständige Inventur aller bekannten Produktideen, Features, Generatoren, Schnittstellen, Schweizer Spezialfälle und Erweiterungen.
> Maschinenlesbares Pendant: `backlog-registry.json`

| Meta | Wert |
|------|------|
| **Version** | 1.0.0 |
| **Datum** | 2026-05-26 |
| **Quellen** | BACKLOG_MASTER.md, CHAT_BACKLOG_CONSOLIDATED.md, PRD.md, 18 Product-Docs, 4 Spinnennetz-Docs, Chat-Transkripte |
| **Einträge** | 142 |

---

## Inhaltsverzeichnis

1. [Generatoren & Template-Engine](#1-generatoren--template-engine)
2. [Schweizer Sozialversicherungen (AHV/IV/EO/ALV/UVG/KTG/BVG)](#2-schweizer-sozialversicherungen)
3. [Vorsorge & Notfall](#3-vorsorge--notfall)
4. [Versicherungen & Scanner](#4-versicherungen--scanner)
5. [Steuerlogik](#5-steuerlogik)
6. [Behördenlogik & Kantonsspezifik](#6-behördenlogik--kantonsspezifik)
7. [Familien-/Haushaltslogik](#7-familien--haushaltslogik)
8. [Budget & Finanzen](#8-budget--finanzen)
9. [Dokumente & Tresor](#9-dokumente--tresor)
10. [Export & Import](#10-export--import)
11. [Schnittstellen & APIs](#11-schnittstellen--apis)
12. [Erinnerungen, Fristen & Checklisten](#12-erinnerungen-fristen--checklisten)
13. [UX, Accessibility & Sprache](#13-ux-accessibility--sprache)
14. [Sicherheit & Datenschutz](#14-sicherheit--datenschutz)
15. [AI-Assistenten & Agents](#15-ai-assistenten--agents)
16. [Governance Runtime (Phase 1)](#16-governance-runtime-phase-1)
17. [Workflow Engine (Phase 2)](#17-workflow-engine-phase-2)
18. [Rollen & Multi-Account](#18-rollen--multi-account)
19. [Infrastruktur & Deployment](#19-infrastruktur--deployment)
20. [Datenmodell & Architektur](#20-datenmodell--architektur)
21. [Langfristige Vision & Erweiterungen](#21-langfristige-vision--erweiterungen)
22. [Bekannte Bugs & Risiken](#22-bekannte-bugs--risiken)
23. [Offene Entscheidungspunkte](#23-offene-entscheidungspunkte)

---

## 1. Generatoren & Template-Engine

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-GEN-001 | Bestattungsgenerator (Bestattungsverordnung) | important | beta | idea |
| MP-GEN-002 | Patientenverfügung Generator | important | beta | idea |
| MP-GEN-003 | Vorsorgeauftrag Generator | important | beta | idea |
| MP-GEN-004 | Kündigungsschreiben (Mietvertrag) | important | beta | idea |
| MP-GEN-005 | Mietreduktionsbegehren | experimental | post-beta | idea |
| MP-GEN-006 | Steuer-Fristverlängerung Generator | experimental | post-beta | idea |
| MP-GEN-007 | RAV-Anmeldeformular Vorbereitung | experimental | post-beta | idea |
| MP-GEN-008 | Kinderzulagen-Antrag Generator | experimental | post-beta | idea |
| MP-GEN-009 | IPV-Antrag Vorbereitung | important | beta | idea |
| MP-GEN-010 | CV Generator | core | alpha | done |
| MP-GEN-011 | Begleitbrief / Cover Letter Templates | experimental | post-beta | idea |
| MP-GEN-012 | Einsprache (Steuerveranlagung) | experimental | future | idea |
| MP-GEN-013 | Ratenzahlung-Antrag (Steuern/Schulden) | experimental | future | idea |
| MP-GEN-014 | EL-Antrag Vorbereitung (Ergänzungsleistungen) | important | post-beta | idea |
| MP-GEN-015 | Mietbeiträge-Antrag Vorbereitung | experimental | post-beta | idea |
| MP-GEN-016 | Template Engine Core (PDF/DOCX/HTML) | core | beta | planned |
| MP-GEN-017 | Kantonsspezifische Template-Varianten | important | post-beta | idea |
| MP-GEN-018 | Briefgenerator (allgemein, an Behörden) | important | beta | idea |

---

## 2. Schweizer Sozialversicherungen

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-SOZ-001 | AHV-Verwaltung & Ausgleichskasse-Orientierung | important | beta | idea |
| MP-SOZ-002 | AHV-Beitragslücken-Erkennung | important | post-beta | idea |
| MP-SOZ-003 | IV-Orientierung (Invalidenversicherung) | experimental | post-beta | idea |
| MP-SOZ-004 | EO (Erwerbsersatzordnung) Orientierung | experimental | future | idea |
| MP-SOZ-005 | ALV (Arbeitslosenversicherung) Orientierung | important | beta | idea |
| MP-SOZ-006 | UVG-Transparenz (Unfallversicherung Arbeitnehmer) | important | beta | idea |
| MP-SOZ-007 | KTG-Transparenz (Krankentaggeld) | important | beta | idea |
| MP-SOZ-008 | BVG-Kontinuität & Freizügigkeitskonten | important | beta | idea |
| MP-SOZ-009 | BVG Pensionskasse-Tracker | experimental | post-beta | idea |
| MP-SOZ-010 | EL (Ergänzungsleistungen) Eligibility-Hinweis | important | post-beta | idea |
| MP-SOZ-011 | SKOS Sozialhilfe-Orientierung (korrigiert) | core | beta | idea |
| MP-SOZ-012 | Stipendien / Ausbildungsbeiträge Orientierung | important | beta | idea |
| MP-SOZ-013 | Alimente / Unterhaltszahlungen Tracking | important | beta | idea |
| MP-SOZ-014 | Selbstständigkeit-Modul (AHV, UVG, KTG, BVG opt.) | important | post-beta | idea |
| MP-SOZ-015 | Retirement Timeline & Pensionsplanung | important | post-beta | idea |
| MP-SOZ-016 | 3a/3b Vorsorge Orientierung | experimental | post-beta | idea |

---

## 3. Vorsorge & Notfall

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-VOR-001 | Patientenverfügung (Existenz-Check + Upload) | important | beta | idea |
| MP-VOR-002 | Vorsorgeauftrag (Existenz-Check + Upload + Gemeinde-Erinnerung) | important | beta | idea |
| MP-VOR-003 | Bestattungswünsche (Existenz-Check + Upload) | important | beta | idea |
| MP-VOR-004 | Organspende-Karte / QR-Export | core | alpha | done |
| MP-VOR-005 | Emergency Hub (Notfallkontakte + QR-Code) | core | alpha | done |
| MP-VOR-006 | Vorsorge-Dokument Tresor-Verknüpfung | important | beta | idea |
| MP-VOR-007 | Gemeinde-Registrierungs-Erinnerung (Vorsorgeauftrag) | experimental | post-beta | idea |
| MP-VOR-008 | Testament-Hinweis | experimental | future | idea |
| MP-VOR-009 | Ehevertrag-Hinweis | experimental | future | idea |
| MP-VOR-010 | Erbvertrag-Hinweis | experimental | future | idea |
| MP-VOR-011 | Death & Legacy Mode (Notfall-Dokumenten-Freigabe) | experimental | future | idea |
| MP-VOR-012 | Jährlicher Review-Reminder (Vorsorge-Dokumente) | experimental | post-beta | idea |
| MP-VOR-013 | Vorsorge-Export für Familienangehörige (verschlüsselt) | experimental | future | idea |

---

## 4. Versicherungen & Scanner

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-VER-001 | Versicherungs-Scanner (allgemein) | important | beta | idea |
| MP-VER-002 | Krankenkassen-Scanner (KVG-Abrechnung OCR) | important | beta | idea |
| MP-VER-003 | Versicherungslücken-Erkennung | important | beta | idea |
| MP-VER-004 | IPV Link-System & Eligibility-Detection | important | beta | idea |
| MP-VER-005 | BAG Krankenkassen-Daten Integration | experimental | future | idea |
| MP-VER-006 | Franchise-Optimierung Orientierung | experimental | post-beta | idea |
| MP-VER-007 | Hausratversicherung Feld | core | alpha | done |
| MP-VER-008 | Reiseversicherung Feld | core | alpha | done |
| MP-VER-009 | Cyber-Versicherung Feld | core | alpha | done |
| MP-VER-010 | Auto-Versicherung Feld | core | alpha | done |
| MP-VER-011 | Rega-Mitgliedschaft Hinweis | experimental | post-beta | idea |
| MP-VER-012 | Haftpflicht-Abdeckungs-Check | important | beta | idea |
| MP-VER-013 | Konfliktwarnungen (Versicherungsdaten) | important | beta | idea |
| MP-VER-014 | KK-Scanner Daten-Konsistenz / Conflict Warnings | important | beta | idea |
| MP-VER-015 | AHV-Nummer visuelles Masking | important | beta | idea |

---

## 5. Steuerlogik

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-TAX-001 | Basis-Steuerberechnung (TaxCalculator) | core | alpha | done |
| MP-TAX-002 | Kantonale Steuersatz-Varianten | important | beta | idea |
| MP-TAX-003 | Quellensteuer vs. ordentliche Veranlagung | important | beta | idea |
| MP-TAX-004 | Sozialhilfe-Steuer-Guidance (kantonsabhängig) | experimental | post-beta | idea |
| MP-TAX-005 | Steuer-Fristverlängerung Hinweis | experimental | post-beta | idea |
| MP-TAX-006 | Steuer-Raten-Zahlungs-Orientierung | experimental | future | idea |
| MP-TAX-007 | Pensionierung Steuer-Implikationen Hinweis | experimental | future | idea |

---

## 6. Behördenlogik & Kantonsspezifik

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-BEH-001 | Kantonsspezifische Logik Engine (Canton Rule Engine) | important | beta | idea |
| MP-BEH-002 | Gemeindeabhängige Informationen | important | post-beta | idea |
| MP-BEH-003 | E-Mail-Vorlagen pro Behörde | experimental | post-beta | idea |
| MP-BEH-004 | Behörden-Kontaktdatenbank | experimental | post-beta | idea |
| MP-BEH-005 | LGAV / Mindestlohn-Checks (branchenspezifisch) | experimental | future | idea |
| MP-BEH-006 | CH Link-Validierung (Support-Links prüfen) | important | alpha | idea |
| MP-BEH-007 | Kantonale Formular-Links (pro Vorsorge-Dokument) | experimental | post-beta | idea |
| MP-BEH-008 | Mietbeiträge / Housing Benefits (kantonal) | important | beta | idea |

---

## 7. Familien-/Haushaltslogik

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-HH-001 | Household Model (Multi-Personen-Haushalt) | core | beta | idea |
| MP-HH-002 | Partner/Ehepartner Verknüpfung | important | post-beta | idea |
| MP-HH-003 | Kinder-Modell (Alter, Einkommen, Versicherung) | important | post-beta | idea |
| MP-HH-004 | Alimente / Unterhalt Tracking & Berechnung | important | beta | idea |
| MP-HH-005 | Familienzulagen / Kinderzulage Orientierung | important | beta | idea |
| MP-HH-006 | Familien-/Account-Übergabe (Volljährigkeit) | important | post-beta | idea |
| MP-HH-007 | Eltern-Kind Verknüpfung & Sichtbarkeitssteuerung | experimental | post-beta | idea |
| MP-HH-008 | Getrennte Eltern / Mehrere Wohnsitze | experimental | future | idea |
| MP-HH-009 | WG / Mehrgenerationen-Haushalt | experimental | future | idea |

---

## 8. Budget & Finanzen

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-BUD-001 | Budget Tracking Modul (Einnahmen/Ausgaben) | core | beta | idea |
| MP-BUD-002 | Schulden-Integration im Budget | important | beta | idea |
| MP-BUD-003 | Calm Budget-Orientierung (Lebenssituation-basiert) | important | beta | idea |
| MP-BUD-004 | Budget Alerts & Benachrichtigungen | experimental | post-beta | idea |
| MP-BUD-005 | Abo-Management / Subscription Tracking | experimental | post-beta | idea |
| MP-BUD-006 | ÖV / Auto Kostentracking | experimental | future | idea |
| MP-BUD-007 | Realistische Budget-Vorschläge (CH-Benchmarks) | experimental | post-beta | idea |
| MP-BUD-008 | Selbstständigen-Buchhaltung (Belege, OCR, MWST) | experimental | future | idea |
| MP-BUD-009 | SchuldenManager (bestehend) | core | alpha | done |
| MP-BUD-010 | BudgetSync / BudgetImport (bestehend, teilweise) | core | alpha | done |

---

## 9. Dokumente & Tresor

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-DOC-001 | Dokumenten-Tresor (IndexedDB, bestehend) | core | alpha | done |
| MP-DOC-002 | Tresor Hardening (E2E Verschlüsselung AES-256-GCM) | core | beta | idea |
| MP-DOC-003 | OCR / Dokumenten-Scanner (Tesseract.js, offline) | important | beta | idea |
| MP-DOC-004 | Multi-File Upload / Drag & Drop | experimental | post-beta | idea |
| MP-DOC-005 | Dokumenten-Versionierung | experimental | post-beta | idea |
| MP-DOC-006 | Dokumenten-Suche & Filter (Volltext) | experimental | post-beta | idea |
| MP-DOC-007 | PDF-Vorschau in-App | experimental | post-beta | idea |
| MP-DOC-008 | Dokument-Beziehungen (relational) | important | post-beta | idea |
| MP-DOC-009 | Kategorisierung & Auto-Tagging (nach OCR) | experimental | post-beta | idea |

---

## 10. Export & Import

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-EXP-001 | PDF-Export (Kapitel & Gesamtdokument) | core | alpha | done |
| MP-EXP-002 | JSON Export (maschinenlesbar) | important | beta | idea |
| MP-EXP-003 | YAML Export | experimental | post-beta | idea |
| MP-EXP-004 | Swiss CSV Export (Semikolon-separiert, CH-Format) | important | beta | idea |
| MP-EXP-005 | Excel-kompatibler Budget-Export (.xlsx oder CSV) | experimental | post-beta | idea |
| MP-EXP-006 | ZIP Export (verschlüsselt, bestehend) | core | alpha | done |
| MP-EXP-007 | DOCX Export (für editierbare Dokumente) | experimental | post-beta | idea |
| MP-EXP-008 | LaTeX/Overleaf Export | maybe | future | idea |
| MP-EXP-009 | CSV/PDF Import (BudgetImport, bestehend, teilweise) | core | alpha | done |
| MP-EXP-010 | Audit-Export (JSON, gated) | important | beta | planned |
| MP-EXP-011 | Compliance Report Export (PDF/JSON) | important | beta | planned |
| MP-EXP-012 | Behörden-Dokument Export (fertige PDFs an Ämter) | important | post-beta | idea |

---

## 11. Schnittstellen & APIs

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-API-001 | REST API Design (geplant) | important | post-beta | idea |
| MP-API-002 | OpenAPI / Swagger Dokumentation | experimental | post-beta | idea |
| MP-API-003 | iOS Calendar Sync (CalDAV) | experimental | future | idea |
| MP-API-004 | Android Calendar Sync (Google Calendar) | experimental | future | idea |
| MP-API-005 | mailto: Export (Dokumente an Behörden) | important | beta | idea |
| MP-API-006 | QR-Bill Scanning | experimental | future | idea |
| MP-API-007 | BAG Krankenkassen-Daten API | experimental | future | idea |
| MP-API-008 | BFS Referenzdaten (JSON) | experimental | future | idea |
| MP-API-009 | Local-First Sync Engine (CRDTs/LWW) | experimental | future | idea |

---

## 12. Erinnerungen, Fristen & Checklisten

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-REM-001 | CalendarReminders (bestehend, teilweise) | core | alpha | done |
| MP-REM-002 | Wiederkehrende Erinnerungen | important | beta | idea |
| MP-REM-003 | Smarte Intervalle (kontextabhängig) | experimental | post-beta | idea |
| MP-REM-004 | Erinnerungs-Kategorien | experimental | post-beta | idea |
| MP-REM-005 | In-App Benachrichtigungen (non-intrusive) | important | beta | idea |
| MP-REM-006 | Push Notifications (opt-in) | experimental | future | idea |
| MP-REM-007 | Life-Event-Checklisten (Umzug, Heirat, Geburt, Tod, Pensionierung) | important | post-beta | idea |
| MP-REM-008 | Dokumenten-Ablauf-Erinnerungen (Permit, Versicherungen) | important | beta | idea |
| MP-REM-009 | Completion-Tracking (Fristen erledigt) | experimental | post-beta | idea |

---

## 13. UX, Accessibility & Sprache

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-UX-001 | i18n Framework (4 Sprachen: EN/DE/FR/IT) | core | alpha | done |
| MP-UX-002 | Rätoromanisch (5. Sprache) | important | beta | idea |
| MP-UX-003 | Migrations-Sprachen (Albanisch, Ukrainisch, Arabisch etc.) | experimental | future | idea |
| MP-UX-004 | RTL-Support (Arabisch) | experimental | future | idea |
| MP-UX-005 | Genderneutrale & inklusive Sprache (Styleguide) | important | beta | idea |
| MP-UX-006 | Text-to-Speech / Vorlesefunktion | experimental | post-beta | idea |
| MP-UX-007 | Low-Literacy / Universal Design (Piktogramm-Flows) | important | beta | idea |
| MP-UX-008 | Schriftgrössen & Kontrast anpassbar (WCAG AAA) | important | beta | idea |
| MP-UX-009 | Dyslexie-freundliche Schrift-Option | experimental | post-beta | idea |
| MP-UX-010 | Tastatur-Navigation vollständig | important | beta | idea |
| MP-UX-011 | Screenreader-Unterstützung (ARIA) | core | alpha | done |
| MP-UX-012 | Interaktives Tutorial / Onboarding Flow | important | beta | idea |
| MP-UX-013 | Calm Dashboard Evolution | important | beta | idea |
| MP-UX-014 | Cognitive Load Reduktion (max 3 Actions/Screen) | important | beta | idea |
| MP-UX-015 | Offline-Status Indikator | important | beta | idea |
| MP-UX-016 | Error Recovery Flow | important | beta | idea |
| MP-UX-017 | Dark Mode (bestehend) | core | alpha | done |
| MP-UX-018 | Responsive Design 375px (bestehend) | core | alpha | done |
| MP-UX-019 | IconSystem SVG Pictogramme (bestehend) | core | alpha | done |
| MP-UX-020 | Calm Fortschritts-Visualisierung (kein Gamification) | experimental | post-beta | idea |
| MP-UX-021 | Life-Timeline-System | experimental | post-beta | idea |
| MP-UX-022 | Spinnennetz (Life-Web) Visualisierung | experimental | future | idea |
| MP-UX-023 | User Feedback Interface (In-App) | important | beta | idea |
| MP-UX-024 | Keyboard Shortcuts | experimental | post-beta | idea |
| MP-UX-025 | Globale Suche | experimental | post-beta | idea |

---

## 14. Sicherheit & Datenschutz

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-SEC-001 | Verschlüsselung at-rest (Web Crypto API, PBKDF2) | core | beta | idea |
| MP-SEC-002 | Content Security Policy (CSP) | core | alpha | done |
| MP-SEC-003 | Subresource Integrity (SRI) | core | alpha | done |
| MP-SEC-004 | WebAuthn / Biometrische Auth | experimental | future | idea |
| MP-SEC-005 | Passwort-basierte Auth (bcrypt/argon2) | important | post-beta | idea |
| MP-SEC-006 | Zwei-Faktor-Authentifizierung (TOTP) | experimental | future | idea |
| MP-SEC-007 | Session Management (httpOnly, Token-Refresh) | important | post-beta | idea |
| MP-SEC-008 | Rate Limiting (Brute-Force Schutz) | important | post-beta | idea |
| MP-SEC-009 | Penetration Test (extern) | important | post-beta | idea |
| MP-SEC-010 | Delegation & Trusted Access | experimental | future | idea |
| MP-SEC-011 | AHV-Nummer Masking (UI) | important | beta | idea |
| MP-SEC-012 | Encrypted Backup (bestehend) | core | alpha | done |

---

## 15. AI-Assistenten & Agents

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-AI-001 | ValidationAdvisor Agent | experimental | post-beta | idea |
| MP-AI-002 | ImportMapper Agent | experimental | post-beta | idea |
| MP-AI-003 | AnomalyDetector Agent | experimental | future | idea |
| MP-AI-004 | ComplianceChecker Agent | experimental | post-beta | idea |
| MP-AI-005 | Agent Sandbox (Zero-Trust Runtime) | important | post-beta | planned |
| MP-AI-006 | Suggestion API (proposed→approved/rejected) | important | post-beta | planned |
| MP-AI-007 | Agent Sidebar UI | experimental | post-beta | idea |
| MP-AI-008 | AI Act Art. 13+14 Compliance | important | post-beta | planned |
| MP-AI-009 | Ethik-Framework für AI-Features | experimental | future | idea |

---

## 16. Governance Runtime (Phase 1)

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-P1-001 | Event Bus (RuntimeEventBus) | core | beta | done |
| MP-P1-002 | State Machine (Unified) | core | beta | done |
| MP-P1-003 | Audit Logger (IndexedDB, append-only) | core | beta | planned |
| MP-P1-004 | Module Registry | core | beta | planned |
| MP-P1-005 | Dashboard Health Indicator | important | beta | planned |
| MP-P1-006 | Rule Schema (Validation, 9 Typen) | core | beta | planned |
| MP-P1-007 | Rule Evaluator (deterministic, Swiss) | core | beta | planned |
| MP-P1-008 | Evidence Register | core | beta | planned |
| MP-P1-009 | Migration bestehender Validation | core | beta | planned |
| MP-P1-010 | File Parser (JSON/CSV, Swiss) | core | beta | planned |
| MP-P1-011 | Schema Mapper (Auto-Match, Preview) | important | beta | planned |
| MP-P1-012 | Ingestion Pipeline (SHA-256, 8 Stages) | core | beta | planned |
| MP-P1-013 | Import UI (ImportPreview) | core | beta | planned |
| MP-P1-014 | Approval Gate Component (WAI-ARIA) | core | beta | planned |
| MP-P1-015 | Gate Registry (fail-safe) | core | beta | planned |
| MP-P1-016 | Approval Wiring + Evidence | core | beta | planned |
| MP-P1-017 | Audit Viewer (Timeline, Filter) | core | beta | planned |
| MP-P1-018 | System Status Panel | important | beta | planned |
| MP-P1-019 | Audit Export (gated, JSON) | important | beta | planned |
| MP-P1-020 | Retention Policy (30-365 Tage) | important | beta | planned |
| MP-P1-021 | System Navigation Tab (#/system) | important | beta | planned |
| MP-P1-022 | E2E Integration Tests | core | beta | planned |
| MP-P1-023 | Mobile QA (375px) | core | beta | planned |
| MP-P1-024 | Dark Mode QA | core | beta | planned |
| MP-P1-025 | ADRs 001-005 | important | beta | planned |
| MP-P1-026 | Performance Gate (<200KB gzip) | core | beta | planned |

---

## 17. Workflow Engine (Phase 2)

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-P2-001 | Workflow Definition Schema (DAG) | core | post-beta | planned |
| MP-P2-002 | Workflow Executor (deterministic, resumable) | core | post-beta | planned |
| MP-P2-003 | Event Middleware (chain, throttle) | core | post-beta | planned |
| MP-P2-004 | Workflow Progress UI | important | post-beta | planned |
| MP-P2-005 | Workflow Templates (3 built-in) | important | post-beta | planned |
| MP-P2-006 | Role Definition Schema (4 Rollen, 9 Capabilities) | core | post-beta | planned |
| MP-P2-007 | Policy Engine (deny early, escalation) | core | post-beta | planned |
| MP-P2-008 | Role Manager UI | important | post-beta | planned |
| MP-P2-009 | Policy Audit Integration | important | post-beta | planned |
| MP-P2-010 | Agent Runtime Sandbox (zero-trust) | core | post-beta | planned |
| MP-P2-011 | Suggestion API (lifecycle) | core | post-beta | planned |
| MP-P2-012 | Built-in Agents (4) | important | post-beta | planned |
| MP-P2-013 | Agent Sidebar UI | important | post-beta | planned |
| MP-P2-014 | Agent Audit Evidence (AI Act) | important | post-beta | planned |
| MP-P2-015 | State Snapshot Engine (delta-based) | core | post-beta | planned |
| MP-P2-016 | Rollback Executor (gated, hash-chained) | core | post-beta | planned |
| MP-P2-017 | Rollback Wizard UI | important | post-beta | planned |
| MP-P2-018 | Rollback Evidence Chain (SHA-256) | core | post-beta | planned |
| MP-P2-019 | Metrics Aggregator (60-slot ring buffer) | important | post-beta | planned |
| MP-P2-020 | Dashboard 2.0 (SVG sparklines) | important | post-beta | planned |
| MP-P2-021 | Live Status Stream (useMetrics) | experimental | post-beta | planned |
| MP-P2-022 | Workflow History View | experimental | post-beta | planned |
| MP-P2-023 | Report Template Engine (4 Templates) | core | post-beta | planned |
| MP-P2-024 | PDF/JSON Compliance Export | core | post-beta | planned |
| MP-P2-025 | Compliance Viewer UI | important | post-beta | planned |

---

## 18. Rollen & Multi-Account

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-ROL-001 | Familien-/Account-Übergabe (Volljährigkeit) | important | post-beta | idea |
| MP-ROL-002 | Eltern-Kind Verknüpfung | experimental | post-beta | idea |
| MP-ROL-003 | Medizinisches Personal (View-Only) | experimental | future | idea |
| MP-ROL-004 | Multi-Device Sync | experimental | future | idea |
| MP-ROL-005 | Delegierte Aufgaben | experimental | future | idea |
| MP-ROL-006 | Notfall-Zugriff (Emergency Access) | important | post-beta | idea |

---

## 19. Infrastruktur & Deployment

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-INF-001 | PWA Hardening / Service Worker | important | beta | idea |
| MP-INF-002 | CI/CD Pipeline (GitHub Actions) | important | alpha | done |
| MP-INF-003 | Web App Manifest (Add-to-Homescreen) | important | beta | idea |
| MP-INF-004 | Performance Gate (Lighthouse ≥90) | core | beta | planned |
| MP-INF-005 | Build Budget (<200KB gzip) | core | alpha | done |
| MP-INF-006 | White-Label / Organisation-Readiness | experimental | future | idea |
| MP-INF-007 | Server Hosting (Green Hosting) | experimental | future | idea |
| MP-INF-008 | Logging / Monitoring | experimental | post-beta | idea |

---

## 20. Datenmodell & Architektur

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-DAT-001 | Kontakt- & Beziehungs-Layer | core | beta | idea |
| MP-DAT-002 | Life-Event-Workflows (Umzug, Heirat etc.) | important | post-beta | idea |
| MP-DAT-003 | Derived-State Engine (kantonale Werte) | experimental | post-beta | idea |
| MP-DAT-004 | Canton Rule Engine (self-updating) | important | post-beta | idea |
| MP-DAT-005 | Data Version Migration (v1→v2 done, v2→v3 geplant) | core | beta | planned |
| MP-DAT-006 | Gross/Net Salary Distinction | important | beta | idea |

---

## 21. Langfristige Vision & Erweiterungen

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-VIS-001 | Mobilitäts-Modul (Auto, ÖV, GA/Halbtax) | experimental | future | idea |
| MP-VIS-002 | Inventar / Hausrats-Management | experimental | future | idea |
| MP-VIS-003 | Nachbarschafts-/Community-Layer | maybe | future | idea |
| MP-VIS-004 | Mini-Job Legal-Infrastruktur | experimental | future | idea |
| MP-VIS-005 | Monetarisierung / Business Model (Freemium) | important | future | idea |
| MP-VIS-006 | Nachhaltigkeit / CSR Badge (B Corp) | maybe | future | idea |
| MP-VIS-007 | Energieverbrauch-Tracking (App) | maybe | future | idea |
| MP-VIS-008 | Matterhorn Fortschritts-Visualisierung | experimental | future | idea |

---

## 22. Bekannte Bugs & Risiken

| ID | Titel | Schwere | Status |
|----|-------|---------|--------|
| MP-BUG-001 | SKOS Haushalt falsch berechnet (Kinder = Erwachsene) | hoch | offen |
| MP-BUG-002 | Hardcoded German in cantonalData.js | hoch | offen |
| MP-BUG-003 | QR-Code CDN-Abhängigkeit (offline fail) | mittel | offen |
| MP-BUG-004 | Auto-Save ohne Dirty-Flag (5s Interval) | niedrig | offen |
| MP-BUG-005 | BVG Doppelabzug (Brutto/Netto unklar) | mittel | offen |
| MP-RISK-001 | ~80 Button Unicode-Prefixes inkonsistent mit SVG | niedrig | deferred |
| MP-RISK-002 | current-state.md veraltet | niedrig | offen |

---

## 23. Offene Entscheidungspunkte

| ID | Thema | Empfehlung | Status |
|----|-------|------------|--------|
| MP-DEC-001 | Lokaler vs. Server-Speicher | Lokal für MVP, Sync Phase 3+ | offen |
| MP-DEC-002 | OCR Engine (Tesseract.js vs. Cloud) | Tesseract.js (Spike nötig) | offen |
| MP-DEC-003 | Auth-Strategie | WebAuthn + Passphrase-Fallback | entschieden (ADR-011) |
| MP-DEC-004 | Rätoromanisch (Crowdsourced vs. Professionell) | Professionell + teilweise | offen |
| MP-DEC-005 | REST vs. GraphQL | REST für MVP | offen |
| MP-DEC-006 | Charts (SVG vs. Canvas) | SVG (Accessibility) | offen |
| MP-DEC-007 | Mail-Export (mailto: vs. API) | mailto: für MVP | offen |
| MP-DEC-008 | Sync-Konflikte (CRDTs vs. LWW) | CRDTs evaluieren | offen |
| MP-DEC-009 | Monetarisierung (Free/Pro/Premium) | Business Model Canvas | offen |
| MP-DEC-010 | DSG vs. DSGVO (primär) | Rechtsberatung nötig | offen |
| MP-DEC-011 | Gamification-Grenze | Kein Spiel, nur sanfte Visualisierung | entschieden |
| MP-DEC-012 | Household-Einführung (wann/wie) | Nach Phase 1, iterativ | offen |

---

## Statistik

| Kategorie | Anzahl | Done | Planned | Idea | Deferred |
|-----------|--------|------|---------|------|----------|
| Generatoren | 18 | 1 | 1 | 16 | 0 |
| Sozialversicherungen | 16 | 0 | 0 | 16 | 0 |
| Vorsorge & Notfall | 13 | 2 | 0 | 11 | 0 |
| Versicherungen & Scanner | 15 | 4 | 0 | 11 | 0 |
| Steuerlogik | 7 | 1 | 0 | 6 | 0 |
| Behördenlogik | 8 | 0 | 0 | 8 | 0 |
| Haushaltslogik | 9 | 0 | 0 | 9 | 0 |
| Budget & Finanzen | 10 | 2 | 0 | 8 | 0 |
| Dokumente & Tresor | 9 | 1 | 0 | 8 | 0 |
| Export & Import | 12 | 3 | 2 | 7 | 0 |
| Schnittstellen & APIs | 9 | 0 | 0 | 9 | 0 |
| Erinnerungen & Fristen | 9 | 1 | 0 | 8 | 0 |
| UX & Accessibility | 25 | 6 | 0 | 19 | 0 |
| Sicherheit | 12 | 3 | 0 | 9 | 0 |
| AI & Agents | 9 | 0 | 3 | 6 | 0 |
| Phase 1 (Governance) | 26 | 2 | 24 | 0 | 0 |
| Phase 2 (Workflow) | 25 | 0 | 25 | 0 | 0 |
| Rollen & Multi-Account | 6 | 0 | 0 | 6 | 0 |
| Infrastruktur | 8 | 2 | 1 | 5 | 0 |
| Datenmodell | 6 | 0 | 1 | 5 | 0 |
| Langfristige Vision | 8 | 0 | 0 | 8 | 0 |
| **Total** | **260** | **28** | **57** | **175** | **0** |

Plus 7 Bugs, 2 Risiken, 12 offene Entscheidungspunkte.

---

## Legal & Compliance

| ID | Titel | Priorität | Phase | Status |
|----|-------|-----------|-------|--------|
| MP-LEG-001 | Impressum (Schweizer Recht) | core | beta | idea |
| MP-LEG-002 | Datenschutzerklärung (DSG/DSGVO) | core | beta | idea |
| MP-LEG-003 | Nutzungsbedingungen (AGB/ToS) | core | beta | idea |
| MP-LEG-004 | Cookie & Tracking Hinweis | experimental | post-beta | idea |
| MP-LEG-005 | Opt-in / Consent Management | important | beta | idea |
| MP-LEG-006 | Datenschutzrechte Interface (DSGVO Art. 15-20) | core | beta | idea |
| MP-LEG-007 | Datenlöschung (Right to Erasure) | core | beta | idea |
| MP-LEG-008 | CH Jugendschutz-Konformität | important | post-beta | idea |

---

*Dokument: product-inventory.md v1.0.0*
*Erstellt: 2026-05-26*
*Maschinenlesbares Pendant: backlog-registry.json*
