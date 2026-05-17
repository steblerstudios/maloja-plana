# Projekt-Übergabe: Maloja Plana / Ordnung-Ruhe

> **Für den nächsten Claude-Chat — sofort produktiv, ohne Rückfragen.**  
> **Stand:** 2026-05-17 | **Branch:** `dev`

---

## 1. Ziel des Projekts

### Was gebaut wird
**Maloja Plana** (ehemals "Ordnung & Ruhe") ist eine **Swiss-first, offline-first, privacy-first Life-Management App** für vulnerable Nutzer:innen (Verschuldete, Alleinerziehende, Migrant:innen, Ältere, Analphabeten).

Kernfunktionen:
- Lebensordner (Dokumente, Budget, Versicherungen, Steuern, Notfall)
- Dokumenten-Tresor mit OCR / Krankenkassen-Scanner
- Budget & Schulden-Management mit realistischen Vorschlägen
- Sichere Behördenkommunikation & Export
- Familien-Accounts mit Rollen (Kind, Eltern, Med-Personal)
- Governance-nativer Runtime mit Audit-Trail

### Aktueller Status
- **Phase:** Planung abgeschlossen, Implementation steht bevor
- **Code:** Bestehende React-App (Alpha-Stand) + neue Runtime-Layer (TypeScript, getestet)
- **Dokumentation:** Vollständig — 7 Roadmap-Docs, 11 ADRs, Agent-Architecture, Audit-Report
- **Nächster Meilenstein:** Iteration 0 (ADRs finalisieren, CI/CD aufsetzen)

### Wichtigste Entscheidungen (getroffen)
1. **Offline-First** — kein Server-Zwang, alle Daten lokal (ADR-001)
2. **Zero Runtime Dependencies** — nur React + React-DOM (ADR implicit)
3. **Calm UX** — keine Gamification, kein Engagement-Manipulation (ADR-003)
4. **Progressive Auth** — Level 0 (kein Login), Level 1 (lokal), Level 2 (Server) (ADR-011)
5. **Tesseract.js lazy-loaded** — für OCR, nicht im Core Bundle (ADR-010)
6. **Hybrid Storage** — IndexedDB + Web Crypto API, kein externer Provider (ADR-009)
7. **Build Budget** — Phase 1 < 200KB gzip, Phase 2 < 250KB gzip

---

## 2. Technischer Kontext

### Architektur

```
┌─────────────────────────────────────────────────────┐
│                    UI Layer (React 18)                │
│  Dashboard │ ChapterView │ ImportPreview │ Tresor    │
├─────────────────────────────────────────────────────┤
│                  Runtime Layer (TypeScript)           │
│  Event Bus │ State Machine │ Workflow Engine          │
│  Validation │ Ingestion │ Approval Gates │ Audit     │
├─────────────────────────────────────────────────────┤
│                 Persistence Layer                     │
│  localStorage (or5_*) │ IndexedDB (audit, docs, wf) │
└─────────────────────────────────────────────────────┘
```

### Tech Stack
- **Frontend:** React 18.2, JSX (kein TypeScript im UI-Layer)
- **Runtime:** TypeScript (src/runtime/)
- **Build:** Vite 4.4
- **Tests:** Vitest
- **Lint:** ESLint
- **Styling:** CSS Tokens (tokens.css), Inline-Styles
- **State:** localStorage (`or5_<chapter>`, `or5_settings`)
- **Persistence:** IndexedDB (4 Stores: audit, workflows, documents, backups)
- **License:** AGPL-3.0

### Kein Backend (MVP)
- Kein Server, keine API, keine Cloud
- Alles läuft im Browser
- Optional: Server-Sync in Phase 3+ (Tier 2 aus ADR-009)

### Relevante Dateien und Zweck

| Pfad | Zweck |
|------|-------|
| `src/main.jsx` | App Entry Point |
| `src/Dashboard.jsx` | Hauptübersicht |
| `src/ChapterView.jsx` | Kapitel-Ansicht (7 Lebenskapitel) |
| `src/DocumentTresor.jsx` | Dokumenten-Tresor |
| `src/KKScanner.jsx` | Krankenkassen-Scanner (UI) |
| `src/kkScanner.js` | OCR-Logik |
| `src/BudgetSync.jsx` | Budget-Modul |
| `src/SchuldenManager.jsx` | Schulden-Verwaltung |
| `src/runtime/` | Neuer Governance Runtime (TypeScript) |
| `src/runtime/events/event-bus.ts` | Event Bus (synchron, wildcard) |
| `src/runtime/state/runtime-state-machine.ts` | State Machine (Guards, Transitions) |
| `src/runtime/audit/audit-log.ts` | Audit Logger (IndexedDB) |
| `src/runtime/approvals/approval-gate.ts` | Approval Gate |
| `src/runtime/execution/runtime-execution-engine.ts` | Workflow Execution Engine |
| `src/runtime/core/workflow-runtime.ts` | Workflow Runtime |
| `src/runtime/__tests__/` | 8 Test-Dateien (Vitest) |
| `src/config/cantonalData.js` | Kantonale Daten (Steuern, KK) |
| `src/tokens.css` | Design Tokens (Colors, Spacing) |
| `CLAUDE.md` | Instruktionen für Claude |
| `docs/context/PLATFORM_CONTEXT.md` | Projekt-Identität & Constraints |
| `docs/roadmap/BACKLOG_MASTER.md` | **160 Tasks**, vollständiger Backlog |
| `docs/roadmap/SPRINT_PLAN.md` | 7 Iterationen, Gantt, Zuweisungen |
| `docs/roadmap/OPEN_GAPS_USER_STORIES.md` | 20 offene Gaps mit User Stories |
| `docs/roadmap/EXECUTIVE_DASHBOARD.md` | Stakeholder-Übersicht |
| `docs/roadmap/PHASE_1_MASTER.md` | Phase 1 Spec (26 Tasks, 6 Milestones) |
| `docs/roadmap/PHASE_2_BLUEPRINT.md` | Phase 2 Spec (31 Tasks, 7 Milestones) |
| `docs/agents/AGENT_ARCHITECTURE.md` | 12 Core-Agenten, 38 Sub-Agenten |
| `docs/architecture/decision-records.md` | ADRs 001-008 (philosophisch) |
| `docs/architecture/ADR-009-storage-strategy.md` | Storage-Entscheidung |
| `docs/architecture/ADR-010-ocr-engine.md` | OCR-Entscheidung |
| `docs/architecture/ADR-011-auth-strategy.md` | Auth-Entscheidung |
| `docs/governance/FULL_PROJECT_AUDIT.md` | Security, IP, Compliance Audit |

### Commands

```bash
cd /Users/sophiestebler/Projects/ordnung-ruhe-neu
npm run dev      # Vite dev server
npm run build    # Production build
npm run test     # Vitest
npm run lint     # ESLint
```

---

## 3. Bereits erledigte Arbeit

### Implementiert & funktionierend
- **React UI (Alpha):** Dashboard, 7 Kapitel-Views, Budget-Sync, Schulden-Manager, KK-Scanner, Document-Tresor, Onboarding, Calendar, Emergency Hub, Dark Mode, Mobile Nav
- **Runtime Layer (TypeScript):** Event Bus, State Machine, Audit Log, Approval Gate, Workflow Runtime, Execution Engine — alle mit Tests
- **Accessibility Basics:** Icon-System, Tastatur-Navigation (teilweise), ARIA-Labels (teilweise)
- **Swiss Domain Logic:** Kantonale Steuer/KK-Daten, AHV-Formate, CH-Telefon, Semikolon-CSV

### Dokumentation (diese Session erstellt)
- BACKLOG_MASTER.md v2.1 (160 Tasks, dedupliziert, agent-zugewiesen)
- OPEN_GAPS_USER_STORIES.md (20 Gaps, Sprint-zugewiesen, mit Mermaid)
- SPRINT_PLAN.md (7 Iterationen, Gantt, Dependencies)
- AGENT_ARCHITECTURE.md (54 Agenten mit Sub-Agenten)
- ADR-009 Storage (3-Tier Hybrid, Web Crypto)
- ADR-010 OCR (Tesseract.js lazy-loaded)
- ADR-011 Auth (Progressive 3-Level, WebAuthn)
- FULL_PROJECT_AUDIT.md (IP, Security, Compliance, Risk Matrix)
- EXECUTIVE_DASHBOARD.md (Stakeholder Overview)

### Verworfene Ansätze
- **SQLite via WASM** → zu gross (500KB+), Build Budget gesprengt
- **PouchDB/CouchDB** → Dependency, widerspricht Zero-Dep
- **Cloud OCR** → Privacy-Verletzung, Offline unmöglich
- **OAuth-only Auth** → Offline unmöglich
- **Gamification (XP, Streaks)** → widerspricht Calm UX Philosophie (ADR-003)

---

## 4. Offene Aufgaben

### Priorität 1 — Sofort (Iteration 0)
1. ADRs 009-011 reviewen → Status "Accepted"
2. CI/CD Pipeline aufsetzen (GitHub Actions: lint, test, size-limit)
3. CSP Meta-Tag in `index.html` hinzufügen
4. Domains sichern (malojaplana.ch, ordnung-ruhe.ch)
5. `size-limit` konfigurieren (200KB Enforcement)

### Priorität 2 — Phase 1 Start (Iteration 1)
- P1-001: Event Bus in bestehende App integrieren (Runtime → UI Bridge)
- P1-002: State Machine für Chapter-Lifecycle
- P1-003: Audit Logger mit IndexedDB v1
- P1-009: Bestehende Validation migrieren (ZERO Regression!)

### Bekannte Bugs / Technische Schulden
- `PHASE_2_BLUEPRINT.md` hat unstaged Änderungen (Modified)
- Kein CI/CD → keine automatischen Tests bei Push
- Kein Build-Budget-Enforcement
- Einige UI-Komponenten nutzen `innerHTML` (Security-Risiko, CSP-inkompatibel)
- i18n nicht implementiert (alle Texte hardcoded Deutsch)

### Offene Entscheidungen (10)
1. REST vs. GraphQL → **Empfehlung: REST**
2. Conflict Resolution → **Empfehlung: LWW + Manual Merge**
3. Rätoromanisch → **Empfehlung: Professionelle Übersetzung**
4. Mail-Export → **Empfehlung: mailto: für MVP**
5. CH-Referenzdaten → **Empfehlung: Statische JSON (BFS)**
6. Chart-Rendering → **Empfehlung: SVG (A11y)**
7. B Corp → **Langfristig (1-2 Jahre)**
8. Community → **Phase 4+**
9. Monetarisierung → **Freemium**
10. Open Source → **Partial (Runtime open, Features proprietär)**

---

## 5. Kritische Kontextinformationen

### Hard Constraints (NIEMALS verletzen)
- **Zero new runtime dependencies** — nur React + React-DOM
- **Offline-First** — ALLES muss ohne Internet funktionieren
- **Build Budget** — Phase 1: < 200KB gzip, Phase 2: < 250KB gzip
- **Calm UX** — keine Urgency-Sprache, keine Gamification, keine Push-Manipulation
- **No hidden automation** — User muss jede Aktion bestätigen (Approval Gates)
- **Deterministic** — gleicher Input → gleicher Output, immer
- **Privacy-by-Default** — Daten verlassen nie das Gerät ohne explizite Zustimmung

### Wichtige Annahmen
- Nutzer:innen sind teilweise Analphabeten → Icon-First-Design
- App wird auf billigen Android-Geräten genutzt → Performance kritisch
- Schweizer Rechtslage (DSG) hat Vorrang vor EU-DSGVO
- Rätoromanisch ist Pflicht (kulturelle Identität des Projekts)
- Kinder-Accounts benötigen CH-Jugendschutz (unter 16)

### Stilregeln & Konventionen
- **UI-Code:** JSX, Inline-Styles (kein CSS-in-JS Library)
- **Runtime-Code:** TypeScript, pure functions, no side effects
- **Naming:** `src/runtime/` = TypeScript, `src/*.jsx` = React Components
- **State:** localStorage für schnelle Reads (`or5_*`), IndexedDB für grosse Daten
- **Events:** Namespace-Convention: `runtime.*`, `source.*`, `audit.*`, etc.
- **Tests:** Vitest, Tests neben Code in `__tests__/`
- **Git:** Feature-Branches → `dev` → `main`, Conventional Commits
- **ADRs:** Format: Context → Decision → Consequences (in `docs/architecture/`)

---

## 6. Aktueller Arbeitsstand

### Zuletzt erledigt (diese Session)
1. ADRs 009 (Storage), 010 (OCR), 011 (Auth) erstellt
2. SPRINT_PLAN.md erstellt (7 Iterationen, Gantt)
3. AGENT_ARCHITECTURE.md erstellt (54 Agenten)
4. BACKLOG_MASTER.md auf v2.1 aktualisiert (+12 Tasks, Agent-Matrix, Cross-Refs)
5. FULL_PROJECT_AUDIT.md erstellt (IP, Security, Compliance, Risk Matrix)
6. OPEN_GAPS_USER_STORIES.md erstellt (20 Gaps dedupliziert)

### Was als Nächstes getan werden soll
1. **Iteration 0 starten:** ADRs finalisieren + CI/CD
2. **Phase 1 Implementation beginnen:** Event Bus → State Machine → Audit Logger
3. **Security Quick-Wins:** CSP Header, innerHTML entfernen

### Exakte nächste Schritte
```bash
# 1. Build Budget Enforcement
npm install --save-dev size-limit @size-limit/preset-app
# In package.json: "size-limit": [{"path": "dist/**/*.js", "limit": "200 KB"}]

# 2. CI/CD (erstelle .github/workflows/ci.yml)
# Steps: checkout → install → lint → test → build → size-limit

# 3. CSP Header (in index.html)
# <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">

# 4. Phase 1 beginnen: Event Bus in src/runtime/ ist bereits implementiert
# Nächster Schritt: Bridge zwischen runtime/ (TS) und UI (JSX) erstellen
```

---

## 7. Code-Kontext

### Runtime Layer (TypeScript) — bereits implementiert

**Event Bus** (`src/runtime/events/event-bus.ts`):
- Synchroner Dispatch, Wildcard-Subscriptions, Leak Detection
- API: `emit(event, payload)`, `on(pattern, handler)`, `off(id)`

**State Machine** (`src/runtime/state/runtime-state-machine.ts`):
- Guard Predicates, Transition Tables
- 2 Lifecycle-Configs: Field + Document

**Audit Log** (`src/runtime/audit/audit-log.ts`):
- Append-only, IndexedDB Store `maloja-plana-audit`
- API: `log(event)`, `query(filters)`, `export()`

**Approval Gate** (`src/runtime/approvals/approval-gate.ts`):
- Promise-basiert, no-timeout, no-auto-dismiss
- API: `requestApproval(operation)` → Promise<approved|rejected>

**Workflow Runtime** (`src/runtime/core/workflow-runtime.ts`):
- DAG-basiert, Kahn's Algorithm für Cycle Detection
- Deterministic Replay, Resumable

### Persistence Map

```javascript
// localStorage Keys
'or5_basis'         // Kapitel: Grunddaten
'or5_wohnen'        // Kapitel: Wohnen
'or5_finanzen'      // Kapitel: Finanzen
'or5_versicherungen'// Kapitel: Versicherungen
'or5_ausbildung'    // Kapitel: Ausbildung/Arbeit
'or5_behoerden'     // Kapitel: Behörden
'or5_notfall'       // Kapitel: Notfall
'or5_settings'      // App-Einstellungen

// IndexedDB Stores
'maloja-plana-audit'     // Audit events (v1→v2)
'maloja-plana-workflows' // Workflow instances
'ordnung-ruhe-documents' // Encrypted documents
'ordnung-ruhe-backups'   // Automatic backups
```

### Git State
- **Branch:** `dev`
- **Letzter Commit:** `81b1d93` (Phase 2 Blueprint)
- **Unstaged neue Dateien:** 10+ Docs (ADRs, Sprint-Plan, Agent-Arch, etc.)
- **Modified:** `docs/roadmap/PHASE_2_BLUEPRINT.md`

---

## 8. Kommunikation & Regeln

### Getroffene Entscheidungen (NICHT ändern)
- Offline-First Architektur (ADR-001)
- Keine Accounts für Single-Device (ADR-002)
- Calm UX, kein Gamification (ADR-003)
- Explainability (ADR-004)
- Migration-First Data (ADR-005)
- No Telemetry (ADR-006)
- Pictogram-First (ADR-007)
- Human Life before Bureaucracy (ADR-008)
- Hybrid Local Storage + Web Crypto (ADR-009)
- Tesseract.js für OCR (ADR-010)
- Progressive Auth 3 Levels (ADR-011)

### NICHT ändern (Do-Not-Touch)
- Bestehende UI-Komponenten (`src/*.jsx`) → ZERO Regression bei Runtime-Integration
- localStorage-Keys (`or5_*`) → Bestehende User-Daten nicht verlieren
- `package.json` Dependencies → nur React + React-DOM als Runtime-Deps
- Bestehende Tests in `src/runtime/__tests__/` → müssen weiter grün sein
- Build-Tool (Vite) → nicht wechseln
- CSS-Approach (tokens.css + Inline) → nicht auf CSS-in-JS wechseln

### Sophie's Arbeitsstil
- Erwartet **Build-Verification** (vorher/nachher)
- Erwartet **strukturierte Zusammenfassungen**
- Erwartet **keine Auto-Weiterarbeit** — immer fragen vor nächstem Schritt
- Cautious, incremental, prefers small verified steps
- Kommunikation: Deutsch bevorzugt, technische Docs auf Englisch OK

---

## TL;DR für den nächsten Chat

**Maloja Plana** = Swiss offline-first life organizer mit Governance-Runtime. 160 Tasks geplant, 7 Iterationen, 28-41 Wochen. Runtime-Layer (TS) existiert mit Tests. UI (React/JSX) existiert als Alpha. Alles dokumentiert in `docs/`. Zero-Dep, < 200KB, Calm UX, Privacy-First. Nächster Schritt: Iteration 0 (CI/CD + ADRs finalisieren), dann Phase 1 Implementation (Event Bus → State Machine → Audit → Validation → Ingestion → Approval Gates).

**Lies zuerst:**
1. `CLAUDE.md`
2. `docs/context/PLATFORM_CONTEXT.md`
3. `docs/roadmap/SPRINT_PLAN.md`

---

## Top 3 nächste Aufgaben

1. **CI/CD aufsetzen** — GitHub Actions mit lint, test, build, size-limit (< 200KB)
2. **Runtime-UI-Bridge** — Event Bus aus `src/runtime/` mit React-Komponenten verbinden (P1-001 Integration)
3. **CSP + Security Hardening** — Content-Security-Policy in index.html, innerHTML-Verwendungen entfernen
