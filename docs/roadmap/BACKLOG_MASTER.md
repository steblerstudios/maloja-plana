# Maloja Plana — Master Backlog

> **Vollständige, priorisierte Backlog-Liste — MVP + geplante Features — Audit-Ready**

| Meta | Value |
|------|-------|
| **Version** | 2.0.0 |
| **Date** | 2026-05-17 |
| **Author** | Stebler Studios |
| **Source** | Executive Dashboard, Phase 1 Master, Phase 2 Blueprint, Stakeholder Feedback, PRD, Chat-Inputs |
| **Categories** | Core / Enhancement / Compliance / Security / UX / Feedback |

---

## Inhaltsverzeichnis

1. [Phase 1 — Governance Runtime (Core)](#phase-1--governance-runtime-core)
2. [Phase 2 — Workflow Engine & Agents (Core)](#phase-2--workflow-engine--agents-core)
3. [Daten & Budget](#daten--budget)
4. [Dokumentenmanagement & Scanner](#dokumentenmanagement--scanner)
5. [UX, Accessibility & Sprache](#ux-accessibility--sprache)
6. [Authentication & Security](#authentication--security)
7. [Legal & Compliance](#legal--compliance)
8. [Rollen & Multi-Account](#rollen--multi-account)
9. [Kommunikation & Export](#kommunikation--export)
10. [Community & Feedback](#community--feedback)
11. [Nachhaltigkeit & Visualisierung](#nachhaltigkeit--visualisierung)
12. [Infrastruktur & Backend](#infrastruktur--backend)
13. [Gamification & Motivation (Deferred)](#gamification--motivation-deferred)
14. [Offene Lücken & ToDos](#offene-lücken--todos)

---

## Phase 1 — Governance Runtime (Core)

> **Status**: Implementierungsbereit | **Dauer**: 6-8 Wochen | **Baseline**: `89d9f32`

| ID | Titel | Typ | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-----|--------------|--------------|-----------|--------|----------|
| P1-001 | Event Bus | Core | Runtime Governance | None (root) | Hoch | ✅ Done | A-004a: RuntimeEventBus mit publish/subscribe/unsubscribe/getEvents |
| P1-002 | State Machine | Core | Runtime Governance | P1-001 | Hoch | ✅ Done | A-002: Unified State Machine, A-003: typed WorkflowState |
| P1-003 | Audit Logger (IndexedDB) | Core | Runtime Governance | P1-001 | Hoch | Offen | Append-only, maloja-plana-audit v1 |
| P1-004 | Module Registry | Core | Runtime Governance | P1-001 | Hoch | Offen | 4 built-in module IDs, idempotent |
| P1-005 | Dashboard Health Indicator | UX | UX Calmness | P1-004 | Mittel | Offen | 8px dot, 3 colors, aria-label |
| P1-006 | Rule Schema (Validation) | Core | Runtime Governance | P1-001, P1-004 | Hoch | Offen | 9 rule types, 7 chapter sets |
| P1-007 | Rule Evaluator | Core | Runtime Governance | P1-006 | Hoch | Offen | Pure, deterministic, Swiss formats |
| P1-008 | Evidence Register | Core | Runtime Governance | P1-007, P1-003 | Hoch | Offen | Writes to shared audit store |
| P1-009 | Migrate Existing Validation | Core | Runtime Gov. + UX | P1-006, P1-007, P1-008 | Hoch | Offen | ZERO UX Regression, character-by-character |
| P1-010 | File Parser | Core | Source Governance | P1-001 | Hoch | Offen | JSON + CSV, Swiss semicolons, BOM |
| P1-011 | Schema Mapper | Core | Source Governance | P1-010 | Mittel | Offen | Auto-match, preview, type coercion |
| P1-012 | Ingestion Pipeline | Core | Source + Runtime Gov. | P1-010, P1-011, P1-007, P1-003 | Hoch | Offen | SHA-256, backup-before-write, 8 stages |
| P1-013 | Import UI (ImportPreview) | UX | UX Calmness | P1-012, P1-014 | Hoch | Offen | Diff preview, calm error, mobile-ready |
| P1-014 | Approval Gate Component | UX | UX Calmness | P1-001 | Hoch | Offen | No timeout, no auto-dismiss, WAI-ARIA |
| P1-015 | Gate Registry | Core | Runtime Governance | P1-004 | Hoch | Offen | Fail-safe: unknown ops = require approval |
| P1-016 | Approval Wiring + Evidence | Core | Runtime Governance | P1-014, P1-015, P1-003 | Hoch | Offen | useApprovalGate() hook, 3+ components |
| P1-017 | Audit Viewer | UX | UX Calmness | P1-003 | Hoch | Offen | Timeline, filter, pagination, role="log" |
| P1-018 | System Status Panel | UX | UX Calmness | P1-004, P1-003 | Mittel | Offen | Module health at a glance |
| P1-019 | Audit Export | Enhancement | Runtime Governance | P1-017, P1-015 | Mittel | Offen | Gated, JSON, meta-audit logged |
| P1-020 | Retention Policy | Enhancement | Runtime Governance | P1-003 | Mittel | Offen | 30/60/90/180/365 days, configurable |
| P1-021 | System Navigation Tab | UX | UX Calmness | P1-017, P1-018 | Mittel | Offen | Route #/system |
| P1-022 | E2E Integration Tests | Core | Release Safety | All P1 | Hoch | Offen | 4 critical paths, offline, <5s |
| P1-023 | Mobile QA (375px) | UX | Accessibility | All UI | Hoch | Offen | Zero horizontal overflow, 44px targets |
| P1-024 | Dark Mode QA | UX | UX Calmness | All UI | Hoch | Offen | Zero hardcoded hex, WCAG AA |
| P1-025 | ADRs 001-005 | Compliance | Runtime Gov. + Release Safety | All | Mittel | Offen | 5 decisions documented |
| P1-026 | Performance Gate | Core | Release Safety | All | Hoch | Offen | <200KB gzip, Lighthouse >=90, 0 deps |

---

## Phase 2 — Workflow Engine & Agents (Core)

> **Status**: Planung abgeschlossen | **Dauer**: 8-12 Wochen | **Baseline**: `81b1d93` | **Prerequisite**: Phase 1 complete

| ID | Titel | Typ | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-----|--------------|--------------|-----------|--------|----------|
| P2-001 | Workflow Definition Schema | Core | Runtime Governance | P1-002 | Hoch | Offen | DAG, Kahn's algorithm, 5 step types |
| P2-002 | Workflow Executor | Core | Runtime Governance | P2-001, P1-001, P1-002 | Hoch | Offen | Deterministic replay, resumable, Promise.all |
| P2-003 | Event Middleware | Core | Runtime Governance | P1-001 | Hoch | Offen | Chain pattern, enrichment, throttle, metrics ring buffer |
| P2-004 | Workflow Progress UI | UX | UX Calmness | P2-002 | Mittel | Offen | Horizontal dots, compact mobile mode |
| P2-005 | Workflow Templates & Registry | Core | Runtime Governance | P2-001, P2-002 | Mittel | Offen | 3 templates: import, bulk-update, compliance-check |
| P2-006 | Role Definition Schema | Core | Runtime Governance | P1-004 | Hoch | Offen | 4 roles, 9 capabilities, inheritance, fail-safe deny |
| P2-007 | Policy Engine | Core | Runtime Governance | P2-006, P1-015 | Hoch | Offen | Deny early, escalation (never auto-approve) |
| P2-008 | Role Manager UI | UX | UX Calmness | P2-006 | Mittel | Offen | Capability matrix, active role selector |
| P2-009 | Policy Audit Integration | Compliance | Runtime Governance | P2-007, P1-003 | Mittel | Offen | POLICY_EVALUATED, CAPABILITY_DENIED, ESCALATION |
| P2-010 | Agent Runtime (Sandbox) | Core | Runtime Governance | P1-001, P2-007 | Hoch | Offen | Zero-trust, proxy-based, BLOCKED APIs enforced |
| P2-011 | Suggestion API | Core | Runtime Governance | P2-010 | Hoch | Offen | Lifecycle: proposed→reviewing→approved/rejected/expired |
| P2-012 | Built-in Agents (4) | Enhancement | Runtime + Source Gov. | P2-010, P2-011 | Mittel | Offen | ValidationAdvisor, ImportMapper, AnomalyDetector, ComplianceChecker |
| P2-013 | Agent Sidebar UI | UX | UX Calmness | P2-011 | Mittel | Offen | Collapsible, confidence colors, bottom sheet mobile |
| P2-014 | Agent Audit Evidence | Compliance | Runtime Governance | P2-010, P2-011, P1-003 | Mittel | Offen | AI Act Art. 13+14, violation log |
| P2-015 | State Snapshot Engine | Core | Runtime Governance | P1-003, P1-012 | Hoch | Offen | Delta-based, <1KB typical, auto on APPROVAL_GRANTED |
| P2-016 | Rollback Executor | Core | Runtime Governance | P2-015, P1-014 | Hoch | Offen | Gated, verified post-restore, hash-chained |
| P2-017 | Rollback Wizard UI | UX | UX Calmness | P2-015, P2-016 | Mittel | Offen | Timeline selection, diff preview |
| P2-018 | Rollback Evidence Chain | Compliance | Runtime Governance | P2-016, P1-003 | Hoch | Offen | SHA-256 hash chain, tamper detection, exportable |
| P2-019 | Metrics Aggregator | Enhancement | Runtime Governance | P2-003 | Mittel | Offen | 60-slot ring buffer, cold-start reconstruction |
| P2-020 | Dashboard 2.0 | UX | UX Calmness | P2-019, P2-004 | Mittel | Offen | SVG sparklines (no lib), calm metrics cards |
| P2-021 | Live Status Stream | Enhancement | Runtime Governance | P2-019, P1-001 | Niedrig | Offen | useMetrics() hook, debounced 1/sec |
| P2-022 | Workflow History View | UX | UX Calmness | P2-002 | Niedrig | Offen | List + expandable detail, audit links |
| P2-023 | Report Template Engine | Compliance | Runtime Governance | P1-003, P2-018 | Hoch | Offen | 4 templates: Audit, Approval, Validation, Rollback |
| P2-024 | PDF/JSON Export | Compliance | Runtime Governance | P2-023, P1-015 | Hoch | Offen | Browser print API, zero deps, gated+logged |
| P2-025 | Compliance Viewer UI | UX | UX Calmness | P2-023, P2-024 | Mittel | Offen | Route #/compliance, preview=WYSIWYG |
| P2-026 | E2E Workflow Tests | Core | Release Safety | All P2.M1-M6 | Hoch | Offen | 5 critical flows, offline, <10s |
| P2-027 | Mobile QA Phase 2 (375px) | UX | Accessibility | All P2 UI | Hoch | Offen | All new components responsive |
| P2-028 | Dark Mode QA Phase 2 | UX | UX Calmness | All P2 UI | Hoch | Offen | Zero hardcoded hex, WCAG AA |
| P2-029 | ADRs 006-010 | Compliance | Runtime Governance | All P2 | Mittel | Offen | 5 decisions (workflow, agent, roles, rollback, compliance) |
| P2-030 | IndexedDB Migration v1→v2 | Core | Runtime Governance | P1-003 | Hoch | Offen | Backward-compatible, zero data loss |
| P2-031 | Performance Gate Phase 2 | Core | Release Safety | All P2 | Hoch | Offen | <250KB gzip, Lighthouse >=85, 0 deps |

---

## Daten & Budget

> **Phase**: MVP (nach Phase 2) | **Typ**: Enhancement + Core

| ID | Titel | Beschreibung | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-------------|--------------|--------------|-----------|--------|----------|
| BUD-001 | Budget Tracking Modul | Einnahmen/Ausgaben-Übersicht, Tages-/Monatsbudget | Finance / Data Governance | P1-012 (Ingestion) | Hoch | Offen | Realistisch, keine Fantasie-Werte |
| BUD-002 | Schulden-Integration | Verknüpfung Kredite, Rückzahlungen mit Budget | Finance | BUD-001 | Hoch | Offen | Automatische Gegenüberstellung |
| BUD-003 | Einnahmen/Ausgaben Vergleich | Visualisierung über/unter Budget, Alerts | Finance / UX | BUD-001 | Hoch | Offen | Realistische Empfehlungen, Benchmarks |
| BUD-004 | Budget Alerts & Benachrichtigungen | Push bei Überschreitung, Deadline-Erinnerung | Finance / UX | BUD-001 | Mittel | Offen | User-defined Thresholds |
| BUD-005 | Subscription Management | Tracking aller Abos, Renewal-Erinnerungen | Finance | BUD-001 | Mittel | Offen | Automatische Erkennung aus Dokumenten |
| BUD-006 | ÖV / Auto Kostentracking | Fahrzeiten, Kosten, Limits pro Strecke | Finance / Sources | BUD-001 | Mittel | Offen | Integration mit Budget |
| BUD-007 | Realistische Budgetvorschläge | Vergleich mit Durchschnitt, Hinweise | Finance / Agents | BUD-001, BUD-003 | Mittel | Offen | Keine AI-generierten Fantasie-Zahlen |

---

## Dokumentenmanagement & Scanner

> **Phase**: MVP (parallel zu Phase 2) | **Typ**: Core + Enhancement

| ID | Titel | Beschreibung | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-------------|--------------|--------------|-----------|--------|----------|
| DOC-001 | Dokumententresor (Secure Vault) | Verschlüsselte Ablage, Zugriffskontrolle, Versionierung | Security / Data Governance | P1-012 | Hoch | Offen | AES/TLS, offline-first, local storage |
| DOC-002 | OCR / Dokumenten-Scanner | Scan von Dokumenten via Kamera/Upload, Texterkennung | Source Ingestion | DOC-001 | Hoch | Offen | Krankenkassen, Rechnungen, Verträge |
| DOC-003 | Krankenkassen-Scanner | Spezifische Erkennung von KK-Abrechnungen | Source Ingestion | DOC-002 | Hoch | Offen | Automatische Zuordnung zu Budget |
| DOC-004 | Multi-File Upload | Drag & Drop, Batch-Import von Dokumenten | UX / Source Ingestion | DOC-001 | Mittel | Offen | Progress-Anzeige, Fehlerbehandlung |
| DOC-005 | Dokumenten-Versionierung | Historie aller Änderungen an Dokumenten | Data Governance | DOC-001 | Mittel | Offen | Audit-Trail pro Dokument |
| DOC-006 | Dokumenten-Suche & Filter | Volltextsuche in gescannten Dokumenten | UX / Source Ingestion | DOC-002 | Mittel | Offen | Nach Typ, Datum, Betrag filtern |
| DOC-007 | PDF-Vorschau | In-App Ansicht von gespeicherten PDFs | UX | DOC-001 | Niedrig | Offen | Ohne externe Libraries |

---

## UX, Accessibility & Sprache

> **Phase**: Durchgängig (ab Phase 1) | **Typ**: UX + Enhancement

| ID | Titel | Beschreibung | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-------------|--------------|--------------|-----------|--------|----------|
| UX-001 | Multi-Language Support (Framework) | i18n-Framework für einfache Hinzufügung weiterer Sprachen | UX / Runtime | — | Hoch | Offen | Dynamisch, key-basiert |
| UX-002 | Deutsch (Standardversion) | Alle UI-Texte, Fehlermeldungen, Tooltips | UX | UX-001 | Hoch | Offen | Basis für alle Übersetzungen |
| UX-003 | Englisch | Internationale Version | UX | UX-001 | Hoch | Offen | — |
| UX-004 | Rätoromanisch | Vollständige Übersetzung inkl. kultureller Nuancen | UX | UX-001 | Hoch | Offen | Wichtig für Projektidentität |
| UX-005 | Französisch | Optionale Sprache | UX | UX-001 | Mittel | Offen | Schweiz-relevant |
| UX-006 | Italienisch | Optionale Sprache | UX | UX-001 | Mittel | Offen | Schweiz-relevant |
| UX-007 | Fallback Language Handling | Automatischer Fallback wenn Sprache nicht verfügbar | UX | UX-001 | Hoch | Offen | Kein leerer Screen |
| UX-008 | Gender-neutrale & inklusive Sprache | Alle Texte neutral, inklusiv, politisch korrekt | UX | UX-001 | Hoch | Offen | In allen Sprachen konsequent |
| UX-009 | Niedrigschwelligkeit / Low Barrier | Einfaches Onboarding, klare Navigation, grosse Buttons | UX | — | Hoch | Offen | Für ältere/unerfahrene Nutzer |
| UX-010 | Accessibility (Screenreader) | Vollständige Screenreader-Unterstützung | Accessibility | UX-001 | Hoch | Offen | ARIA-Labels, Fokus-Management |
| UX-011 | Schriftgrössen & Kontrast | Anpassbar, Low Vision Support | Accessibility | — | Hoch | Offen | WCAG AAA angestrebt |
| UX-012 | Literacy Fallbacks (Icons/Audio) | Visuelle Hilfen, Piktogramme, Vorlesefunktion | Accessibility | UX-001 | Hoch | Offen | Für Analphabeten / Sehbehinderte |
| UX-013 | Audio / Vorlesefunktion | Text-to-Speech für wichtige Inhalte | Accessibility | UX-012 | Mittel | Offen | Browser TTS API (zero deps) |
| UX-014 | Drag & Drop Tasks | Intuitive Aufgaben- und Dokumentenverwaltung | UX / Runtime | P1-012 | Mittel | Offen | Touch-friendly, 44px targets |
| UX-015 | User Customization Options | Themes, Layout, Farben anpassbar | UX | — | Niedrig | Offen | Keine AI-Features in MVP |
| UX-016 | Tutorial / Onboarding Flow | Schritt-für-Schritt Einführung für neue Nutzer | UX | UX-009 | Hoch | Offen | Überspringbar, jederzeit aufrufbar |
| UX-017 | Tastatur-Navigation | Vollständig ohne Maus bedienbar | Accessibility | — | Hoch | Offen | Tab-Reihenfolge, Fokus-Indikatoren |
| UX-018 | Responsive Design (375px-1440px) | Alle Screens auf allen Grössen | UX | — | Hoch | Offen | Mobile-first Design |
| UX-019 | Dark Mode (System-Aware) | Automatisch + manuell schaltbar | UX | — | Hoch | Offen | Palette-only, zero hardcoded colors |
| UX-020 | Calm UX Principles | Keine urgente Sprache, keine Gamification-Trigger | UX | — | Hoch | Offen | Projektphilosophie: kein Spiel |
| UX-021 | Dyslexie-freundliche Schrift | Optional OpenDyslexic oder ähnlich, erhöhter Zeilenabstand | Accessibility | UX-011 | Mittel | Offen | Settings-Option |
| UX-022 | Cognitive Load Reduktion | Max 3 primäre Actions pro Screen, Progressive Disclosure | UX / Accessibility | UX-009 | Hoch | Offen | Design-Prinzip für alle Screens |
| UX-023 | Offline-Status Indikator | Non-intrusive Anzeige des Sync-/Offline-Status | UX | INF-008 | Hoch | Offen | Toast oder Status-Bar, nicht modal |
| UX-024 | Error Recovery Flow | Graceful Degradation, klare Fehlermeldungen, Recovery-Optionen | UX | — | Hoch | Offen | Keine technischen Details an User |

---

## Authentication & Security

> **Phase**: MVP | **Typ**: Security + Core

| ID | Titel | Beschreibung | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-------------|--------------|--------------|-----------|--------|----------|
| SEC-001 | Login (E-Mail + Passwort) | Standard-Authentifizierung | Security / Backend | — | Hoch | Offen | Passwort-Hashing (bcrypt/argon2) |
| SEC-002 | Social Login (Google, Apple) | OAuth-basierte Anmeldung | Security / Backend | SEC-001 | Mittel | Offen | Optional, User-Wahl |
| SEC-003 | Zwei-Faktor-Authentifizierung | TOTP oder SMS als zweiter Faktor | Security | SEC-001 | Mittel | Offen | Optional aktivierbar |
| SEC-004 | Biometrische Authentifizierung | Fingerprint / FaceID auf Geräten | Security / Frontend | SEC-001 | Niedrig | Offen | WebAuthn API |
| SEC-005 | Session Management | Sichere Sessions, Auto-Logout, Token-Refresh | Security / Backend | SEC-001 | Hoch | Offen | httpOnly Cookies |
| SEC-006 | Verschlüsselung (at rest) | Alle sensiblen Daten verschlüsselt gespeichert | Security | DOC-001 | Hoch | Offen | AES-256, local-first |
| SEC-007 | Verschlüsselung (in transit) | TLS für alle Kommunikation | Security / Backend | — | Hoch | Offen | TLS 1.3 minimum |
| SEC-008 | Password Reset Flow | Sicherer Passwort-Reset via E-Mail | Security | SEC-001 | Hoch | Offen | Time-limited tokens |
| SEC-009 | Rate Limiting | Schutz vor Brute-Force | Security / Backend | SEC-001 | Hoch | Offen | Progressive delays |
| SEC-010 | Audit Logging (Security Events) | Login-Versuche, Passwort-Änderungen, Sessions | Security / Compliance | SEC-001, P1-003 | Hoch | Offen | ISO 27001 A.9 |
| SEC-011 | Content Security Policy (CSP) | XSS-Schutz via strikte CSP-Header | Security / DevOps | — | Hoch | ✅ Done | `a99d33f` — CSP aktiv |
| SEC-012 | Subresource Integrity (SRI) | Integrity-Checks für externe Ressourcen | Security / DevOps | — | Mittel | ✅ Done | `c89d97d` — SRI für alle CDN Scripts |
| SEC-013 | Penetration Test | Professioneller Pen-Test vor Go-Live | Security | All SEC | Hoch | Offen | Externer Anbieter, Budget einplanen |

---

## Legal & Compliance

> **Phase**: MVP (vor Go-Live) | **Typ**: Compliance

| ID | Titel | Beschreibung | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-------------|--------------|--------------|-----------|--------|----------|
| LEG-001 | Impressum | Vollständig gemäss Schweizer Recht | Legal / UX | �� | Hoch | Offen | Pflichtangaben CH |
| LEG-002 | Datenschutzerklärung (Privacy Policy) | Transparent, DSGVO/DSG-konform | Legal / UX | — | Hoch | Offen | Inkl. Datenzugriff, Speicherung, Löschung |
| LEG-003 | Nutzungsbedingungen (AGB / ToS) | Rechte, Pflichten, Haftungsausschluss | Legal / UX | — | Hoch | Offen | CH-Recht |
| LEG-004 | Cookie & Tracking Hinweis | Falls Analytics eingesetzt wird | Legal / UX | — | Mittel | Offen | Nur relevant bei Server-Analytics |
| LEG-005 | Opt-in / Consent Management | Zustimmung für Datenverarbeitung, widerrufbar | Legal / UX | LEG-002 | Hoch | Offen | Granular, jederzeit änderbar |
| LEG-006 | Datenschutzrechte Interface | Nutzer: Daten exportieren, löschen, einsehen | UX / Legal | LEG-005 | Hoch | Offen | DSGVO Art. 15-20 |
| LEG-007 | DSGVO/DSG Compliance Checks | Automatische Prüfungen bei Exports & Datenzugriff | Compliance / Runtime | LEG-002 | Mittel | Offen | Integration mit Audit-System |
| LEG-008 | Datenlöschung (Right to Erasure) | Vollständige Löschung aller Nutzerdaten | Backend / Security | LEG-006 | Hoch | Offen | Inkl. Backups, Audit-Einträge |
| LEG-009 | CH Jugendschutz-Konformität | Unter-16 Account-Regeln, Einwilligung Erziehungsberechtigte | Legal / Security | ROL-001 | Hoch | Offen | DSG + DSGVO Art. 8 |

---

## Rollen & Multi-Account

> **Phase**: Phase 2+ | **Typ**: Enhancement

| ID | Titel | Beschreibung | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-------------|--------------|--------------|-----------|--------|----------|
| ROL-001 | Familien-/Account-Übergabe | Konto für Kinder/Abhängige übertragbar bei Volljährigkeit | Security / UX | P2-006, SEC-001, DOC-001 | Hoch | Offen | DSGVO-konform, Audit-Log erhalten |
| ROL-002 | Eltern-Kind Verknüpfung | Eltern verwalten Kinderkonten, Sichtbarkeit steuerbar | Security / UX | ROL-001, P2-006 | Mittel | Offen | Benachrichtigung bei Übergabe |
| ROL-003 | Medizinisches Personal (View-Only) | Ärzte/Betreuer können relevante Daten einsehen | Security / UX | P2-006 | Niedrig | Offen | Nur mit expliziter Freigabe |
| ROL-004 | Multi-Device Sync | Daten zwischen Geräten synchronisieren | Runtime / Backend | SEC-007 | Mittel | Offen | Conflict resolution, offline-first |
| ROL-005 | Delegierte Aufgaben | Aufgaben an andere Familienmitglieder delegierbar | UX / Runtime | P2-006, ROL-002 | Niedrig | Offen | Benachrichtigung + Tracking |
| ROL-006 | Notfall-Zugriff (Emergency Access) | Medizinischer Notfall: Zugriff auf kritische Daten ohne Login | Security / Roles | ROL-003, SEC-006 | Hoch | Offen | Separater Emergency Key, sofort-Audit, zeitlich limitiert |

---

## Kommunikation & Export

> **Phase**: MVP+ | **Typ**: Enhancement

| ID | Titel | Beschreibung | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-------------|--------------|--------------|-----------|--------|----------|
| COM-001 | Export Dokumente an Behörden | Fertige Dokumente per E-Mail an Ämter senden | Runtime / UX | DOC-001, LEG-002 | Hoch | Offen | PDF-Generation, Vorlagen pro Amt |
| COM-002 | E-Mail-Vorlagen pro Behörde | Vorgefertigte Templates für häufige Anliegen | UX / Sources | COM-001 | Mittel | Offen | Mehrsprachig, anpassbar |
| COM-003 | PDF-Export (allgemein) | Beliebige Daten/Berichte als PDF exportieren | Runtime / UX | — | Mittel | Offen | Browser print API (zero deps) |
| COM-004 | Benachrichtigungen (In-App) | Hinweise zu Fristen, Budget, Aufgaben | UX / Runtime | BUD-004 | Mittel | Offen | Nicht aufdringlich, calm UX |
| COM-005 | Push Notifications (optional) | Opt-in Push für wichtige Deadlines | UX / Backend | COM-004 | Niedrig | Offen | Nur mit expliziter Zustimmung |

---

## Community & Feedback

> **Phase**: Post-MVP | **Typ**: Enhancement + Feedback

| ID | Titel | Beschreibung | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-------------|--------------|--------------|-----------|--------|----------|
| COM-F01 | Nachbarschafts-Chat / Community | Opt-in Austausch, Peer Support, Task Sharing | UX / Social | SEC-001 | Mittel | Offen | Moderation erforderlich |
| COM-F02 | User Feedback Interface | Feedback sammeln, priorisieren, sichtbar machen | UX / QA | — | Hoch | Offen | In-App Feedback-Button |
| COM-F03 | Feedback-Loops zur Sprachqualität | Nutzerfeedback zu Übersetzungen | UX / QA | UX-001 | Mittel | Offen | Idiomatik, Verständlichkeit |
| COM-F04 | Feature Request Tracking | Nutzer können Features vorschlagen | UX / PM | COM-F02 | Niedrig | Offen | Voting-Mechanik optional |

---

## Nachhaltigkeit & Visualisierung

> **Phase**: Post-MVP | **Typ**: Enhancement + Marketing

| ID | Titel | Beschreibung | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-------------|--------------|--------------|-----------|--------|----------|
| VIS-001 | Fortschritts-Visualisierung ("Matterhorn") | Dynamisches visuelles Element für erledigte Aufgaben | UX / Frontend | P2-019 | Mittel | Offen | Kein Gamification-Trigger, rein visuell |
| VIS-002 | Nachhaltigkeits-Badge / Pflänzchen | CSR-Label, Umweltbewusstsein sichtbar machen | Marketing / UX | — | Niedrig | Offen | B Corp / Google Knowledge Panel |
| VIS-003 | Energieverbrauch-Tracking (App) | Transparenter Energieverbrauch der App | Backend / Marketing | — | Niedrig | Offen | Differenzierungsmerkmal |
| VIS-004 | Dashboard Übersicht (KPIs) | Zusammenfassung: Tasks, Budget, Dokumente | UX | P2-020, BUD-001 | Mittel | Offen | Calm design, keine Überforderung |

---

## Infrastruktur & Backend

> **Phase**: MVP (parallel) | **Typ**: Core + Security

| ID | Titel | Beschreibung | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-------------|--------------|--------------|-----------|--------|----------|
| INF-001 | Datenbank-Architektur | Normalisierung, Indices, Migrations | Backend / DB | — | Hoch | Offen | PostgreSQL oder SQLite (lokal) |
| INF-002 | API-Schnittstellen (REST/GraphQL) | Backend → Frontend Kommunikation | Backend | INF-001 | Hoch | Offen | Versioniert, dokumentiert |
| INF-003 | Server Hosting & Skalierung | Lastmanagement, Speicher, Nachhaltigkeit | DevOps | INF-001 | Hoch | Offen | Green hosting bevorzugt |
| INF-004 | Logging / Monitoring / Alerts | Performance und Fehler überwachen | DevOps | INF-003 | Hoch | Offen | CPU, RAM, Storage, Errors |
| INF-005 | CI/CD Pipeline | Automatisierte Tests, Builds, Deployments | DevOps | INF-002 | Mittel | ✅ Done | `08f8814` — GitHub Actions aktiv |
| INF-006 | Backup-Strategie (Server) | Regelmässige Backups, Recovery-Tests | DevOps / Security | INF-001 | Hoch | Offen | Verschlüsselt, offsite |
| INF-007 | API Rate Limiting & Throttling | Schutz vor Überlastung | Backend / Security | INF-002 | Mittel | Offen | Per-User Limits |
| INF-008 | Local-First Sync Engine | Offline-Daten mit Server synchronisieren | Runtime / Backend | INF-002, P2-002 | Mittel | Offen | Conflict resolution, CRDTs evaluieren |
| INF-009 | Service Worker (Offline Shell) | PWA-Grundlage: App Shell Caching, Offline-Fallback | DevOps / Runtime | — | Hoch | Offen | Installierbarkeit, Offline-Zuverlässigkeit |
| INF-010 | Web App Manifest | PWA-Manifest für Add-to-Homescreen | DevOps / UX | INF-009 | Mittel | Offen | Icons, Theme-Color, Display-Mode |

### API Endpoints (geplant)

| Endpoint | Method | Beschreibung | Auth | Status |
|----------|--------|-------------|------|--------|
| `/tasks` | POST | Neue Aufgabe hinzufügen | JWT | Offen |
| `/tasks` | GET | Alle Aufgaben abrufen | JWT | Offen |
| `/tasks/{id}` | PUT | Aufgabenstatus aktualisieren | JWT | Offen |
| `/budget` | GET | Budget-Status inkl. Schulden | JWT | Offen |
| `/documents/upload` | POST | Dokumente hochladen (OCR) | JWT | Offen |
| `/documents/{id}` | GET | Dokumentenansicht / Download | JWT | Offen |
| `/export/mail` | POST | Dokumente an Behörde senden | JWT + Gate | Offen |
| `/users` | GET | Nutzerprofil & Berechtigungen | JWT | Offen |
| `/languages` | GET | Verfügbare Sprachen | Public | Offen |
| `/auth/login` | POST | Anmeldung | — | Offen |
| `/auth/register` | POST | Registrierung | — | Offen |
| `/auth/refresh` | POST | Token-Refresh | Refresh Token | Offen |

---

## Convenience & Integrations

> **Phase**: Features II + Integration | **Typ**: Enhancement

| ID | Titel | Beschreibung | Module/Agent | Dependencies | Priorität | Status | Hinweise |
|----|-------|-------------|--------------|--------------|-----------|--------|----------|
| CONV-001 | iOS Calendar Sync | Termine mit Apple Calendar synchronisieren | Sync-Agent | INF-008, SEC-007 | Mittel | Offen | CalDAV oder native API |
| CONV-002 | Android Calendar Sync | Termine mit Google Calendar synchronisieren | Sync-Agent | INF-008, SEC-007 | Mittel | Offen | Google Calendar API |
| CONV-003 | Kontaktverknüpfung (Ärzte/Betreuer) | Ärzte, Betreuer aus Kontakten verknüpfen | Contact-Agent | ROL-003, SEC-006 | Mittel | Offen | Nur mit expliziter Freigabe |
| CONV-004 | Auto-Save | Automatisches Speichern aller Änderungen | Runtime-Agent | P1-001 | Hoch | Offen | Debounced, IndexedDB |
| CONV-005 | Drag & Drop (Dokumente) | Dokumente per Drag & Drop in Tresor | UX-Agent / Document-Agent | DOC-001 | Mittel | Offen | HTML5 DnD API |
| CONV-006 | Swiss CSV Export | Semikolon-separiert, CH-Format | Source-Agent | BUD-001 | Mittel | Offen | Excel-kompatibel |
| CONV-007 | Excel-kompatible Budget-Exports | .xlsx Export für Budget-Daten | Budget-Agent | BUD-001 | Niedrig | Offen | Zero-dep: CSV statt xlsx im MVP |
| CONV-008 | Smooth Workflow Transitions | Animierte Übergänge zwischen Workflow-Steps | UX-Agent | P2-004 | Niedrig | Offen | CSS-only, kein JS-Animation-Lib |
| CONV-009 | Keyboard Shortcuts | Schnellzugriff für häufige Aktionen | UX-Agent | UX-017 | Mittel | Offen | Dokumentiert in Help-Seite |

### Ref: [OPEN_GAPS_USER_STORIES.md](./OPEN_GAPS_USER_STORIES.md) → GAP-14 (Drag & Drop)

---

## Agent-Zuweisungsmatrix

> Mapping aller Backlog-Items zu verantwortlichen Agenten  
> **Ref:** [AGENT_ARCHITECTURE.md](../agents/AGENT_ARCHITECTURE.md)

| Agent | Backlog Items | Sub-Agenten |
|-------|--------------|-------------|
| **Runtime-Agent** | P1-001 bis P1-004, P2-001 bis P2-005, CONV-004 | Event-Dispatcher, State-Controller, Registry-Manager, Workflow-Executor, Middleware-Chain |
| **Source-Agent** | P1-010 bis P1-012, CONV-006 | File-Parser, Schema-Mapper, Ingestion-Controller, Import-Validator |
| **Audit-Agent** | P1-003, P1-008, P1-017, P2-009, P2-014, P2-018, P2-023, SEC-010 | Event-Logger, Evidence-Writer, Retention-Manager, Compliance-Reporter |
| **Security-Agent** | SEC-001 bis SEC-010, LEG-008 | Crypto-Service, Key-Manager, Rate-Limiter, Session-Manager |
| **Auth-Agent** | SEC-001 bis SEC-004, SEC-008 | Password-Handler, WebAuthn-Handler, TOTP-Handler, OAuth-Handler, Level-Controller |
| **UX-Agent** | P1-005, P1-013, P1-014, P2-004, P2-008, P2-013, P2-017, P2-020, P2-025, UX-009, UX-014 bis UX-020, CONV-005, CONV-008, CONV-009 | Approval-Gate-UI, Import-Preview-UI, Dashboard-Controller, Calm-UX-Enforcer |
| **Localization-Agent** | UX-001 bis UX-008 | Language-Loader, Fallback-Resolver, Gender-Checker, TTS-Bridge |
| **Accessibility-Agent** | UX-009 bis UX-013, UX-017 | ARIA-Manager, Focus-Controller, Contrast-Manager, Icon-Navigation |
| **Budget-Agent** | BUD-001 bis BUD-007, CONV-007 | Income-Tracker, Expense-Tracker, Debt-Linker, Alert-Engine, Benchmark-Calculator |
| **Document-Agent** | DOC-001 bis DOC-007, COM-003 | Vault-Manager, Version-Tracker, Search-Engine, PDF-Renderer, Upload-Controller |
| **OCR-Agent** | DOC-002, DOC-003 | Scanner-Controller, Preprocessor, Tesseract-Bridge, Field-Extractor, Confidence-Scorer |
| **Roles-Agent** | P2-006, P2-007, ROL-001 bis ROL-005 | Role-Manager, Policy-Engine, Gate-Checker, Transfer-Controller, Medical-Access |
| **Sync-Agent** | ROL-004, INF-008, CONV-001, CONV-002 | Online-Detector, Push-Queue, Pull-Sync, Conflict-Resolver |
| **Communication-Agent** | COM-001 bis COM-005 | Email-Sender, Template-Manager, Notification-Controller |
| **Legal-Agent** | LEG-001 bis LEG-007 | Document-Generator, Consent-Manager, Compliance-Checker |
| **DevOps-Agent** | INF-003 bis INF-007, VIS-003 | CI-Pipeline, Monitoring-Controller, Backup-Manager |

---

## Gamification & Motivation (Deferred)

> **Status**: Bewusst zurückgestellt | **Philosophie**: "Kein Spiel" — erst nach umfassender Evaluation

| ID | Titel | Beschreibung | Priorität | Status | Hinweise |
|----|-------|-------------|-----------|--------|----------|
| GAM-001 | XP / Task-Erledigung Mechanik | XP für erledigte Aufgaben | Niedrig | Deferred | Erst evaluieren, ob es zur Philosophie passt |
| GAM-002 | AI-Rival System | Virtueller Gegenspieler | Niedrig | Deferred | **Nicht empfohlen** für MVP — widerspricht Calm UX |
| GAM-003 | Badges / Achievements | Belohnungen für Meilensteine | Niedrig | Deferred | Nur wenn nicht als Druck empfunden |
| GAM-004 | Levels / Fortschrittssystem | Aufstiegssystem basierend auf Aktivität | Niedrig | Deferred | **Nicht empfohlen** — kann Anxiety erzeugen |

> **Empfehlung**: Gamification-Mechaniken frühestens in Phase 4+ evaluieren. Sie widersprechen potenziell der Kernphilosophie "Ordnung & Ruhe". Stattdessen: sanfte visuelle Fortschrittsanzeige (VIS-001) ohne kompetitive Elemente.

---

## Offene Lücken & ToDos

### Kritische Lücken (vor MVP zu klären)

| # | Bereich | Lücke | Empfohlene Aktion |
|---|---------|-------|-------------------|
| 1 | **Schnittstellen** | API-Design noch nicht finalisiert (REST vs. GraphQL, Auth-Schema) | Architektur-Workshop, ADR schreiben |
| 2 | **Local vs. Server** | Entscheidung: rein lokal (Phase 1-2 Ansatz) vs. Server für Sync/Multi-Device | ADR-011 erstellen, Trade-offs dokumentieren |
| 3 | **OCR-Engine** | Welche OCR-Technologie? (Tesseract.js lokal vs. Cloud API) | Spike: Performance + Accuracy + Offline evaluieren |
| 4 | **Schulden-Datenquellen** | Woher kommen Schulden-Daten? (manuell, Import, API?) | User Research, Stakeholder Interview |
| 5 | **Behörden-Integration** | Welche Ämter, welche Formate, welche E-Mail-Adressen? | Recherche CH-Behörden, Kontaktaufnahme |
| 6 | **Datenschutz CH** | DSG (Schweiz) vs. DSGVO (EU) — welches gilt primär? | Rechtsberatung einholen |

### Wichtige Lücken (Phase 2+)

| # | Bereich | Lücke | Empfohlene Aktion |
|---|---------|-------|-------------------|
| 7 | **Rätoromanisch** | Keine professionelle Übersetzung vorhanden | Übersetzer:in engagieren, Glossar erstellen |
| 8 | **Accessibility-Testing** | Keine Tests mit echten Nutzer:innen (Sehbehinderte, Analphabeten) | Usability-Tests planen, Zielgruppe rekrutieren |
| 9 | **Familien-Übergabe** | Rechtliche Fragen bei Konto-Übergabe Minderjährige→Volljährige | Rechtsberatung CH Jugendschutz |
| 10 | **Community-Moderation** | Wer moderiert Nachbarschafts-Chat? Regeln? | Community Guidelines erstellen |
| 11 | **Budget-Benchmarks** | Woher kommen Vergleichswerte? (BFS, Comparis, eigene Erhebung?) | Datenquellen evaluieren |
| 12 | **Energiebilanz** | Wie wird Nachhaltigkeit der App gemessen? | Green Software Foundation Guidelines prüfen |

### Konzeptuelle Lücken (langfristig)

| # | Bereich | Lücke | Empfohlene Aktion |
|---|---------|-------|-------------------|
| 13 | **Gamification** | Philosophie "kein Spiel" vs. Motivationstools — wo ist die Grenze? | Design-Workshop, User Research |
| 14 | **AI-Integration** | Langfristig: welche AI-Features sind gewollt/erlaubt? | Ethik-Framework definieren |
| 15 | **Skalierung** | Single-User (Phase 1-2) → Multi-User → Team → Organisation | Architektur-Roadmap Phase 3+ |
| 16 | **Monetarisierung** | Free/Pro/Premium — welche Features hinter Paywall? | Business Model Canvas |
| 17 | **Offline-Konfliktlösung** | Wie werden Konflikte bei Multi-Device Sync gelöst? | CRDTs vs. Last-Write-Wins evaluieren |

---

## Zusammenfassung

### Statistik

| Kategorie | Anzahl Items | Hoch | Mittel | Niedrig | Deferred |
|-----------|-------------|------|--------|---------|----------|
| Phase 1 (Core) | 26 | 18 | 8 | 0 | 0 |
| Phase 2 (Core) | 31 | 16 | 13 | 2 | 0 |
| Daten & Budget | 7 | 3 | 4 | 0 | 0 |
| Dokumentenmanagement | 7 | 3 | 3 | 1 | 0 |
| UX & Accessibility | 24 | 16 | 6 | 2 | 0 |
| Security | 13 | 9 | 3 | 1 | 0 |
| Legal & Compliance | 9 | 7 | 2 | 0 | 0 |
| Rollen & Multi-Account | 6 | 2 | 2 | 2 | 0 |
| Kommunikation & Export | 5 | 1 | 3 | 1 | 0 |
| Community & Feedback | 4 | 1 | 2 | 1 | 0 |
| Nachhaltigkeit & Visualisierung | 4 | 0 | 2 | 2 | 0 |
| Infrastruktur & Backend | 10 | 6 | 4 | 0 | 0 |
| Convenience & Integrations | 9 | 1 | 5 | 3 | 0 |
| Gamification (Deferred) | 4 | 0 | 0 | 4 | 4 |
| **Total** | **160** | **83** | **57** | **19** | **4** |

### Priorisierungs-Reihenfolge (Empfehlung)

```
Iteration 0: ADRs 009-011 finalisieren     → Entscheidungen (1 Woche)
Iteration 1: Phase 1 (P1-001 bis P1-026)   → Governance Runtime (6-8 Wochen)
Iteration 2: Phase 2 (P2-001 bis P2-031)   → Workflow Engine + Agents (8-12 Wochen)
Iteration 3: Security + i18n + Legal       → SEC + UX-001-012 + LEG (4-6 Wochen)
Iteration 4: Budget + Docs + OCR + Roles   → BUD + DOC + ROL (4-6 Wochen)
Iteration 5: API + Sync + Export + Calendar → INF + COM + CONV (3-4 Wochen)
Iteration 6: Polish + Onboarding + CSR     → VIS + UX-remaining + QA (2-3 Wochen)
Deferred:    Gamification + Community       → Phase 4+ (evaluieren)
```

---

## Cross-References

| Dokument | Inhalt | Pfad |
|----------|--------|------|
| Executive Dashboard | Stakeholder-Übersicht, Mermaid-Diagramme, Release Gates | [EXECUTIVE_DASHBOARD.md](./EXECUTIVE_DASHBOARD.md) |
| Open Gaps User Stories | 20 offene Entscheidungspunkte mit User Stories | [OPEN_GAPS_USER_STORIES.md](./OPEN_GAPS_USER_STORIES.md) |
| Sprint Plan | Iterationsbasierter Plan, Gantt, Agent-Zuweisungen | [SPRINT_PLAN.md](./SPRINT_PLAN.md) |
| Agent Architecture | 12 Core-Agenten, 38 Sub-Agenten, Automatisierung | [AGENT_ARCHITECTURE.md](../agents/AGENT_ARCHITECTURE.md) |
| Phase 1 Master | Detailspezifikation Governance Runtime | [PHASE_1_MASTER.md](./PHASE_1_MASTER.md) |
| Phase 2 Blueprint | Detailspezifikation Workflow + Agents | [PHASE_2_BLUEPRINT.md](./PHASE_2_BLUEPRINT.md) |
| ADR-009 Storage | Hybrid Local-First, IndexedDB + Web Crypto | [ADR-009](../architecture/ADR-009-storage-strategy.md) |
| ADR-010 OCR | Tesseract.js, Offline-First, Swiss Templates | [ADR-010](../architecture/ADR-010-ocr-engine.md) |
| ADR-011 Auth | WebAuthn + Progressive Enhancement, 3 Levels | [ADR-011](../architecture/ADR-011-auth-strategy.md) |
| Decision Records | Philosophische ADRs 001-008 | [decision-records.md](../architecture/decision-records.md) |

---

## Offene Entscheidungen (Quick Reference)

> Vollständige Details: [OPEN_GAPS_USER_STORIES.md](./OPEN_GAPS_USER_STORIES.md)

| # | Entscheidung | ADR | Status |
|---|-------------|-----|--------|
| 1 | Lokaler vs. Server-Speicher | ADR-009 | ✅ Accepted |
| 2 | OCR Engine (Tesseract.js vs. Cloud) | ADR-010 | ✅ Accepted |
| 3 | Auth-Strategie (Progressive Levels) | ADR-011 | ✅ Accepted |
| 4 | REST vs. GraphQL | Offen | Empfehlung: REST für MVP |
| 5 | Conflict Resolution (CRDTs vs. LWW) | Offen | Empfehlung: LWW + Manual Merge |
| 6 | Rätoromanisch-Übersetzung (Crowdsourced vs. Professionell) | Offen | Noch zu klären |
| 7 | Mail-Export (mailto: vs. API) | Offen | Empfehlung: mailto: für MVP |
| 8 | CH-Referenzdaten (BFS-Daten als JSON) | Offen | Noch zu klären |
| 9 | Chart-Rendering (SVG vs. Canvas) | Offen | Empfehlung: SVG (A11y) |
| 10 | B Corp Zertifizierung (Timeline) | Offen | Langfristig |

---

*Document: BACKLOG_MASTER.md v2.2.0*  
*Updated: 2026-05-17*  
*Source: Executive Dashboard, Phase 1 Master, Phase 2 Blueprint, Stakeholder Feedback, Open Gaps, Agent Architecture*  
*Next Review: Nach Iteration 0 (ADRs finalisiert)*
