# MALOJA PLANA — VOLLSTÄNDIGER SYSTEM-AUDIT & BLUEPRINT

**Stand:** 2026-05-17 | **Branch:** `dev` | **Commit:** `81b1d93`
**Analysiert:** 34 JSX/JS-Quelldateien, 12 Runtime-TS-Module, 8 Tests, 54 geplante Agenten, 11 ADRs, 9.161 LoC

---

## 1. EXECUTIVE SUMMARY

### Ist-Zustand

| Dimension | Status | Bewertung |
|-----------|--------|-----------|
| **UI (Alpha)** | 17 Views, funktionsfähig, React.createElement | Solide, braucht Runtime-Bridge |
| **Runtime (TS)** | 6 Module, 8 Tests, alle grün | Skelett — 90% der Logik fehlt |
| **Build** | 126 KB gzip (Budget: 200KB) | 74KB Headroom — gut |
| **Tests** | 14/14 pass (327ms) | Nur Runtime getestet, 0 UI-Tests |
| **CI/CD** | Nicht vorhanden | **BLOCKER** |
| **Security** | Kein CSP, CDN-Scripts, kein Encryption | **KRITISCH** |
| **Offline** | Funktional via localStorage/IndexedDB | CDN-Dependencies brechen Offline |
| **Agent-System** | 54 Agenten dokumentiert, 0 implementiert | Nur Design, kein Code |
| **i18n** | 4 Sprachen implementiert (DE/EN/FR/IT) | RM fehlt noch |

### Kernbefunde

1. **Gravierendes Delta zwischen Dokumentation und Code.** 54 Agenten geplant, 0 implementiert. Der Runtime-Layer hat korrekte Typen und Struktur, aber minimale Logik (der Event Bus ist ein simples Array-Push ohne Pub/Sub, die State Machine hat inkonsistente States zwischen zwei Dateien, der Audit Log schreibt nur In-Memory, nicht IndexedDB).

2. **Security-Lücken im aktuellen Code.** CDN-Script-Loading in `kkScanner.js` (3 externe CDN-Scripts ohne SRI), kein CSP-Header, keine Verschlüsselung, `document.createElement('a')` für Downloads ohne Sanitization.

3. **Architektur-Inkonsistenzen.** Zwei separate Event-Bus-Implementierungen (`RuntimeEventBus` und importiertes `EventBus`), zwei unabhängige State-Transition-Tabellen mit unterschiedlichen States, `WorkflowController` referenziert Methoden die auf `InMemoryRuntimeStore` nicht existieren.

4. **Gamification existiert nicht.** Kein XP, keine Badges, keine Streaks — korrekt laut ADR-003 (Calm UX). Die Grep-Treffer sind false positives (Badge-Styling, Error-Badges etc.).

---

## 2. SYSTEM AUDIT — AGENTEN-ANALYSE

### 2.1 Runtime-Agent

**Zweck:** Event Bus, State Machine, Module Registry, Workflow Execution

**Implementierungsstand:**

| Komponente | Datei | Status | Befund |
|-----------|-------|--------|--------|
| Event Bus | `event-bus.ts` | Minimal | Nur `publish()` → Array-Push + `getEvents()`. Kein Subscribe, kein Wildcard, kein Namespace, kein Leak Detection. Widerspricht der AGENT_ARCHITECTURE.md-Spezifikation. |
| State Machine | `runtime-state-machine.ts` | Inkonsistent | States: `DRAFT→ACTIVE→PAUSED→COMPLETED→FAILED`. Aber `workflow-validator.ts` definiert: `DRAFT→PENDING_APPROVAL→APPROVED→RUNNING→PAUSED→FAILED→ROLLED_BACK→COMPLETED`. **Zwei inkompatible State-Graphen.** |
| Workflow Runtime | `workflow-runtime.ts` | Kompiliert nicht isoliert | Importiert `EventBus` aus `events/event-bus.ts`, aber die Klasse heisst dort `RuntimeEventBus`. **Import-Mismatch.** |
| Execution Engine | `runtime-execution-engine.ts` | Skelett | Nur `start()` und `completeStep()`. Kein DAG, kein Kahn's Algorithm, kein Resume, keine Guards. |
| Controller | `workflow-controller.ts` | Kompiliert nicht | Ruft `store.saveWorkflow()` und `store.getWorkflow()`, aber `InMemoryRuntimeStore` hat nur `save()` und `get()`. **API-Mismatch.** |
| Persistence | `in-memory-runtime-store.ts` | In-Memory only | Kein IndexedDB, kein localStorage. Daten gehen bei Page Refresh verloren. |

**Risiken:**
- HOCH: State-Machine-Inkonsistenz führt zu Runtime-Errors bei Integration
- HOCH: Import-Mismatches → Build wird brechen sobald TS-Strict-Mode an
- MITTEL: In-Memory-Store macht Runtime-Persistence unmöglich

**Fehlende Komponenten:**
- Event Subscription (on/off/wildcard)
- Namespace-Routing
- Module Registry
- Leak Detection
- IndexedDB Persistence Adapter
- Retry/Recovery Logik

---

### 2.2 Audit-Agent

**Zweck:** Audit Logging, Evidence Chain, Compliance Reports

**Implementierungsstand:**

| Komponente | Datei | Status | Befund |
|-----------|-------|--------|--------|
| Audit Log | `audit-log.ts` | In-Memory | `RuntimeAuditLog` ist ein Array mit `record()`, `all()`, `byWorkflow()`. Kein IndexedDB. Kein Append-Only-Enforcement. Kein Tamper Detection. |
| Evidence Writer | — | Nicht vorhanden | Kein SHA-256 Hashing, keine Hash-Chain |
| Retention Manager | — | Nicht vorhanden | |
| Compliance Reporter | — | Nicht vorhanden | |

**Risiko:** KRITISCH — Audit-Daten gehen bei jedem Page Refresh verloren. Für eine Governance-Plattform ist das ein fundamentales Problem. Die IndexedDB-Stores (`maloja-plana-audit`) werden in keinem Code referenziert ausser in Dokumentation.

---

### 2.3 Source-Agent (Ingestion)

**Zweck:** File Parsing, Schema Mapping, Ingestion Pipeline

**Implementierungsstand:** Nicht als Agent implementiert. Fragmentierte Logik existiert in:
- `csvImport.js` — CSV-Parsing (Swiss Semicolons)
- `kkScanner.js` — OCR/Barcode-Scanning
- `BudgetImport.jsx` — Budget-Datenimport

**Befund:** Keine zentrale Ingestion Pipeline. Kein Pre-flight-Check, kein SHA-256 Provenance, kein Evidence-Writing. Jede Komponente parsed selbständig ohne gemeinsames Schema.

---

### 2.4 Security-Agent

**Zweck:** Encryption, Access Control, Vulnerability Monitoring

**Implementierungsstand:** Nicht implementiert.

**Aktuelle Sicherheitslage im Code:**

| Risiko | Datei | Problem |
|--------|-------|---------|
| **KRITISCH** | `kkScanner.js:1-25` | 3 CDN-Scripts ohne SRI (jsbarcode, jsQR, tesseract) → Supply-Chain-Attack-Vektor |
| **KRITISCH** | `index.html` | Kein CSP-Meta-Tag → XSS-Anfälligkeit |
| **HOCH** | `main.jsx:216-223` | `document.createElement('a')` + `a.href = doc.data` → potentieller data-URI Injection |
| **HOCH** | Alle Daten | localStorage unverschlüsselt → jeder Browser-Extension-Zugriff liest alle persönlichen Daten |
| **MITTEL** | `autoBackup.js` | IndexedDB-Backups unverschlüsselt |
| **MITTEL** | `premiumCalc.js` + `PremiumSubsidy.jsx` | `window.open(kvgLink)` — URL nicht validiert |

---

### 2.5 UX-Agent

**Zweck:** UI Components, Calm UX, Responsive Design

**Implementierungsstand:** De facto komplett im UI-Layer implementiert, aber nicht als Agent.

| Feature | Status | Befund |
|---------|--------|--------|
| Dashboard | Implementiert | `Dashboard.jsx` — Chapter-Completion, Gentle Start |
| ChapterView | Implementiert | 7 Kapitel mit Feldern |
| Responsive | Implementiert | Mobile-safe 375px, MobileNav |
| Dark Mode | Implementiert | Theme Toggle, Palette-System |
| Accessibility | Teilweise | Skip-link, aria-labels vorhanden, Focus-Trapping fehlt |
| Calm UX | Eingehalten | Kein XP, keine Streaks, keine urgency language |

**Fehlende Komponenten:**
- Approval Gate UI (kein visuelles Confirmation-Pattern)
- Import Preview UI
- System Status Panel
- Keyboard Focus Trapping

---

### 2.6 Budget-Agent

**Zweck:** Einnahmen, Ausgaben, Schulden, Alerts, Vergleiche

**Implementierungsstand:** Teilweise als UI-Logik implementiert, nicht als Agent.

| Komponente | Datei | Status |
|-----------|-------|--------|
| Budget Sync | `budgetSync.js` | Funktioniert — synct Kapitel-Daten in Budget-Übersicht |
| Budget Import | `BudgetImport.jsx` | CSV-Import vorhanden |
| Schulden Manager | `SchuldenManager.jsx` + `schuldenCalc.js` | Schulden-Tracking, Betreibungsauszug, Verlustscheine |
| Prämienverbilligung | `PremiumSubsidy.jsx` + `premiumCalc.js` | Kantonale IPV-Berechnung |
| Alerts | — | Nicht vorhanden |
| Benchmark | — | Nicht vorhanden |

**Befund:** Solide Domänenlogik (CH-Steuern, KK-Prämien, kantonale IPV). Aber: kein Event-Bus-Anbindung, keine reaktive Benachrichtigung, keine Schwellwert-Alerts.

---

### 2.7 Document-Agent

**Zweck:** Dokumenten-Tresor, Versionierung, Suche

**Implementierungsstand:** Basis-UI vorhanden.

| Komponente | Status | Befund |
|-----------|--------|--------|
| Tresor UI | Implementiert | Filter, Suche, Sortierung, Expiry-Status |
| Upload | Implementiert | Einzeldatei per ChapterView |
| Versionierung | Nicht vorhanden | |
| Encryption | Nicht vorhanden | Dokumente im localStorage als Base64-Strings — unverschlüsselt |
| Multi-File Upload | Nicht vorhanden | |
| PDF Preview | Nicht vorhanden | |

**Risiko:** HOCH — Dokumente (Lohnzettel, Betreibungsauszüge, Gesundheitsdaten) liegen unverschlüsselt im localStorage. Bei >5MB localStorage-Limit-Überschreitung gehen Daten verloren.

---

### 2.8 Notification-Agent

**Zweck:** Erinnerungen, Fristen, Alerts

**Implementierungsstand:**

| Komponente | Status | Befund |
|-----------|--------|--------|
| Service Worker | Registrierung implementiert | SW-Datei existiert als Scaffold |
| Permission Management | Implementiert | Opt-in, Privacy-respecting |
| Overdue Reminders | Implementiert | `checkOverdueReminders()` auf App-Mount |
| Calendar Sync | Implementiert | `CalendarReminders.jsx`, `docReminders.js` |
| In-App Notifications | Teilweise | `OverdueBanner.jsx` zeigt überfällige Items |
| Push Notifications | Nicht vorhanden | |

**Befund:** Solide Grundlage, aber kein Event-Bus-Integration. Notifications werden imperativ aufgerufen, nicht reaktiv ausgelöst.

---

### 2.9 Settings-Agent / Approval-Roles-Agent

**Settings:** Minimale Implementierung via `or5_settings` localStorage + `ThemeToggle` + `NotificationSettings`.

**Approval Gate:** `ApprovalGate` Klasse existiert (`approval-gate.ts`), aber enthält nur eine `requiresApproval()` Boolean-Check. Kein UI, keine Promise-basierte Bestätigung, kein Timeout-Management.

---

### 2.10 Gamification-Agent

**Status:** Bewusst nicht implementiert (ADR-003: Calm UX). Korrekt. Die Grep-Treffer in 10 Dateien sind false positives: `badge` = CSS-Styling, `level` = Auth-Level, `points` = decimal points.

**Empfehlung:** Kein Gamification-Agent nötig. Stattdessen: **Completion-Indicator-System** (bereits als `calculateCompletion()` in `main.jsx` vorhanden) als nicht-manipulative Fortschrittsanzeige beibehalten.

---

## 3. FEHLENDE AGENTEN

### 3.1 Identifizierte Lücken

| Agent | Begründung | Priorität |
|-------|-----------|-----------|
| **Persistence-Agent** | Zentrale Schicht zwischen Runtime und Storage fehlt komplett. Jede Komponente schreibt direkt in localStorage. | P0 — KRITISCH |
| **Migration-Agent** | `dataMigration.js` existiert, aber ohne Versionierungsstrategie für Runtime/IndexedDB-Daten | P1 |
| **Error-Recovery-Agent** | Kein zentrales Error-Handling ausser `ErrorBoundary.jsx`. Kein Recovery-Workflow für korrupte Daten | P1 |
| **Storage-Monitor-Agent** | `storageMonitor.js` existiert als Utility, aber kein Agent mit Alerts bei Quota-Überschreitung | P2 |
| **Export-Agent** | `ZipExport.jsx` + `zipExport.js` existieren, aber kein strukturierter Agent mit Audit-Trail | P2 |

### 3.2 Persistence-Agent (DRINGEND)

**Problem:** Die App hat keine zentrale Datenschicht. `main.jsx` liest/schreibt direkt:
```
localStorage.getItem('or5_data')  → JSON.parse → state
state → JSON.stringify → localStorage.setItem('or5_data')
```
Jede 5 Sekunden ein `setInterval`-basierter Auto-Save (`main.jsx:170-178`). Kein Transaktionsschutz, kein Error-Handling bei `QuotaExceededError`, kein Batching.

**Spezifikation:**

| Eigenschaft | Wert |
|-------------|------|
| Zweck | Zentralisierte Read/Write-Schicht für alle Persistence-Operationen |
| Trigger | `data:write`, `data:read`, `data:delete`, `data:export` |
| State Flow | `IDLE → WRITING → COMMITTED` / `IDLE → WRITING → FAILED → RETRY` |
| Offline-Strategie | localStorage = Primary, IndexedDB = Overflow + Documents |
| Sub-Agenten | Write-Buffer (debounced writes), Quota-Monitor, Schema-Validator |
| Events | `persistence.write.success`, `persistence.write.failed`, `persistence.quota.warning` |

---

## 4. FACH-AGENTEN

### 4.1 Versicherungs-Experte

**Bestehender Code:** `cantonalData.js` (294 Zeilen) enthält kantonale KK-Prämien, IPV-Einkommensgrenzen, Steuer-Referenzdaten.

| Sub-Agent | Aufgaben | Datenquelle | Trigger | Offline | KPI |
|-----------|----------|-------------|---------|---------|-----|
| Policen-Validator | Prüft Vollständigkeit der Versicherungsfelder | `or5_versicherungen` | `insurance.field.changed` | Ja | % vollständige Policen |
| Versicherungs-Checker | Vergleicht KK-Prämie mit kantonalem Durchschnitt | `cantonalData.js` | `insurance.premium.entered` | Ja | Abweichung vom Median |
| Optimierungs-Assistent | Zeigt günstigere Franchise/Modell-Optionen | `cantonalData.js` | User-initiated | Ja | Sparpotential CHF/Jahr |
| Fristen-Monitor | Überwacht KK-Wechselfrist (30.11.) und Franchise-Frist (31.12.) | System-Clock | `calendar.daily.check` | Ja | Tage bis Frist |

**Risiken:**
- Kantonale Daten müssen jährlich aktualisiert werden (statische JSON, kein Auto-Update)
- Prämienvergleich nur mit eigenen Daten, kein API-Zugriff auf priminfo.admin.ch (Offline-Constraint)

---

### 4.2 Prämienverbilligungs-Experte

**Bestehender Code:** `PremiumSubsidy.jsx` + `premiumCalc.js`

| Sub-Agent | Aufgaben | Datenquelle | Trigger | Offline |
|-----------|----------|-------------|---------|---------|
| Anspruchsrechner | Berechnet IPV-Anspruch basierend auf Einkommen + Kanton | `cantonalData.CANTONAL_IPV` | `income.changed` / `canton.changed` | Ja |
| Einkommens-Validator | Prüft ob Einkommen in plausiblem Bereich | `or5_finanzen` | `budget.income.changed` | Ja |
| Formular-Helfer | Zeigt kantonsspezifischen Antrag-Link | `getKVGApplicationLink()` | User-initiated | Nur Link |
| Fristen-Reminder | Kantonal unterschiedliche Antragsfristen | System-Clock | `calendar.monthly.check` | Ja |

---

### 4.3 Budget-/Finanz-Experte

**Bestehender Code:** `budgetSync.js`, `schuldenCalc.js`, `BudgetSync.jsx`, `SchuldenManager.jsx`

| Sub-Agent | Aufgaben | Datenquelle | Trigger | Offline |
|-----------|----------|-------------|---------|---------|
| Budget-Analyst | Einnahmen/Ausgaben-Analyse, Kategorie-Aufteilung | `syncBudgetFromChapters()` | `chapter.data.changed` | Ja |
| Sparpotenzial-Scanner | Vergleich mit SKOS-Richtlinien und BFS-Referenzwerten | Statische JSON | `budget.calculated` | Ja |
| Alert-System | Threshold-basierte Warnungen (Miete >33%, Savings <10%) | Budget-Daten | `budget.threshold.crossed` | Ja |
| Forecast-System | 3/6/12-Monats-Prognose basierend auf Trend | Budget-Historie | `budget.month.closed` | Ja |

---

### 4.4 Dokumenten-Experte

**Bestehender Code:** `DocumentTresor.jsx`, `kkScanner.js`

| Sub-Agent | Aufgaben | Trigger | Offline |
|-----------|----------|---------|---------|
| OCR-Validator | Post-OCR-Validierung: Confidence-Check, Swiss-Pattern-Match | `ocr.scan.completed` | Ja (nach initialem Tesseract-Download) |
| Kategorie-Zuweiser | Auto-Kategorisierung nach Dokumenttyp (Lohn, KK, Miete) | `document.uploaded` | Ja |
| Fortschritts-Indikator | Zeigt welche Dokumente noch fehlen pro Kapitel | `document.list.changed` | Ja |
| Vollständigkeits-Prüfer | Prüft ob alle Pflichtdokumente vorhanden | `chapter.review.triggered` | Ja |

**Kritisches Risiko:** Dokumente werden aktuell als Base64-Strings in localStorage gespeichert (`or5_docs`). Bei einem 2MB-Foto sind das ca. 2.7MB Base64 — localStorage ist auf 5-10MB limitiert. Nach 2-3 Dokumenten ist das Limit erreicht.

---

## 5. AUTOMATISIERUNGS-SYSTEM

### 5.1 Versioning-Agent

| Prozess | Trigger | Workflow | Fehlerfälle | Recovery |
|---------|---------|----------|-------------|----------|
| Version Tag | Merge zu `main` | 1. Lese `package.json` version 2. Prüfe ob Tag existiert 3. Erstelle Git Tag 4. Push Tag | Tag existiert bereits | Bump Patch, retry |
| Changelog | Tag erstellt | Parse Conventional Commits seit letztem Tag | Keine konventionellen Commits | Warnung, Manual Entry |
| Build Verification | Pre-Tag (CI Gate) | `npm test && npm run build && size-limit` | Test/Build/Size fails | Block Tag, notify |
| Release Notes | Tag gepusht | GitHub Release Draft erstellen | GH API unreachable | Retry mit Backoff |

---

### 5.2 Bugfix-Agent

| Prozess | Trigger | Workflow | Recovery | Audit |
|---------|---------|----------|----------|-------|
| Bug Detection | Issue mit Label `bug` | Branch `bugfix/<id>` erstellen | Manual | Issue-Link |
| Regression Test | Bugfix PR | Test-Template erstellen der Bug reproduziert | Manual | PR-Link |
| Patch Release | Bugfix merged | Version Patch bump, Tag, Release | Revert-Commit | Changelog Entry |

---

### 5.3 Update-Agent

| Prozess | Trigger | Workflow | Constraint |
|---------|---------|----------|-----------|
| Security Scan | Weekly Cron (Mo 08:00) | `npm audit --json` → Parse → Issue wenn Critical | Zero runtime deps |
| Dependency Check | Weekly Cron (Mo 08:00) | `npm outdated --json` → PR wenn minor updates | Niemals neue Runtime-Deps |
| Breaking Change Check | Update-PR erstellt | Full Test Suite + Build + Size Check | Budget < 200KB |

---

### 5.4 Sync-Agent

| Prozess | Trigger | Aktion | Conflict Resolution |
|---------|---------|--------|--------------------|
| Online Detection | `navigator.onLine` + Events | Toggle Sync-Status-Indikator | — |
| Queue Write | Daten-Änderung + offline | Append zu IndexedDB Sync-Queue | — |
| Push Sync | Online + Queue nicht leer | FIFO-Queue abarbeiten | LWW (Timestamp) |
| Pull Sync | Online + Push done | Server-Diff holen, Local mergen | Simple: LWW. Docs: Manual Merge |
| Evidence | Sync done | Audit-Event schreiben | — |

---

## 6. TECHNISCHE ARCHITEKTUR

### 6.1 Aktuelles Systemdiagramm (IST)

```
Browser (Single Tab)
├── React UI Layer (JSX)
│   ├── main.jsx ← AppInner (God Component, 380 LoC)
│   ├── Dashboard, ChapterView (x7), DocumentTresor
│   ├── BudgetSync, SchuldenManager, KKScanner
│   ├── PremiumSubsidy, TaxCalculator, EmergencyHub
│   └── 10 weitere Views + MobileNav + ErrorBoundary
│
├── localStorage (synchron, direct access)
│   ├── or5_data, or5_docs, or5_settings
│   └── or5_theme, or5_reminders, or5_last_backup
│
├── IndexedDB (async)
│   └── ordnung-ruhe-backups (Snapshots only)
│
├── Runtime Layer (TypeScript) — ISOLIERT, nicht mit UI verbunden
│   ├── event-bus.ts, state-machine.ts, audit-log.ts
│   ├── approval-gate.ts, workflow-runtime.ts
│   └── execution-engine.ts (alles In-Memory)
│
└── Utilities (plain JS)
    ├── validationUtils.js, budgetSync.js, schuldenCalc.js
    ├── dataMigration.js, dataValidation.js, autoBackup.js
    └── hashRouter.js, notifications.js, storageMonitor.js
```

### 6.2 SOLL-Architektur (nach Phase 3)

```
Browser (Single Tab)
├── React UI Layer (JSX) — bestehend, unverändert
│   ├── Views (wie oben)
│   ├── ApprovalGateUI (NEU)
│   ├── ImportPreviewUI (NEU)
│   └── SystemStatusPanel (NEU)
│
├── Runtime-UI Bridge (NEU)
│   └── useRuntime() Hook ↔ Event Bus ↔ State
│
├── Governance Runtime (TypeScript)
│   ├── EventBus (pub/sub, wildcard, namespace)
│   ├── StateMachine (unified states)
│   ├── AuditLog (IndexedDB, append-only)
│   ├── ValidationEngine (rules + evaluator)
│   └── ApprovalGate (promise-based + UI)
│
├── Persistence Layer (NEU)
│   ├── localStorage (hot data, <100KB)
│   ├── IndexedDB (documents, audit, workflows)
│   └── Write-Buffer + Quota-Monitor
│
└── Utilities (bestehend)
```

### 6.3 Event-Flow (SOLL)

```
User Action (z.B. Feld ausfüllen)
  → React onChange
    → updateData(chapter, field, value)
      → Persistence-Agent: data:write
        → Event Bus: emit('data.field.changed', { chapter, field, value })
          → Validation-Agent: subscribe('data.field.*') → validate → emit result
          → Budget-Agent: subscribe('data.finanzen.*') → recalculate
          → Audit-Agent: subscribe('*') → log to IndexedDB
          → Notification-Agent: subscribe('validation.failed') → show banner
```

### 6.4 Offline-First-Architektur

| Schicht | Offline-Verhalten | Fallback |
|---------|-------------------|----------|
| UI | Funktioniert komplett | — |
| Validation | Funktioniert komplett | — |
| Budget/Schulden | Funktioniert komplett | — |
| OCR | Funktioniert nach initialem Download | "Scanner nicht verfügbar" Banner |
| KK Scanner | **BRICHT** — CDN-Dependencies | Muss auf Lazy-Load umgestellt werden |
| Sync | Offline-Queue, sync bei Reconnect | Queue-Size-Warning |
| Auth (Level 0/1) | Funktioniert komplett | — |
| Auth (Level 2) | Token Refresh fails | Graceful degradation zu Level 1 |

### 6.5 Conflict Resolution

| Datentyp | Strategie |
|----------|-----------|
| Settings | LWW (Last Write Wins, Timestamp) |
| Chapter Data | LWW + Field-Level Merge |
| Documents | Manual Merge via Approval Gate |
| Budget Entries | Additive Merge (Union) |
| Audit Logs | Append-Only (kein Conflict) |
| Schulden | Manual Review |

---

## 7. MVP BACKLOG

### Architektur

| # | Titel | Agent | Prio | Kritikalität | Aufwand | Abhängigkeiten | Status |
|---|-------|-------|------|-------------|---------|----------------|--------|
| A-001 | Event Bus: Pub/Sub + Wildcard | Runtime | P0 | BLOCKER | 4h | — | Offen |
| A-002 | State Machine: Unified State Graph | Runtime | P0 | BLOCKER | 3h | — | Offen |
| A-003 | Import-Mismatches fixen | Runtime | P0 | BLOCKER | 2h | — | Offen |
| A-004 | Runtime-UI Bridge Hook | Runtime | P0 | BLOCKER | 6h | A-001 | Offen |
| A-005 | Persistence Layer | Persistence | P0 | BLOCKER | 8h | A-001 | Offen |

### Security

| # | Titel | Prio | Kritikalität | Aufwand | Status |
|---|-------|------|-------------|---------|--------|
| S-001 | CSP Meta-Tag in index.html | P0 | KRITISCH | 1h | Offen |
| S-002 | CDN-Scripts → Lazy-Load + Cache | P0 | KRITISCH | 4h | Offen |
| S-003 | SRI Hashes für CDN-Scripts (Interim) | P0 | KRITISCH | 1h | Offen |
| S-004 | Document Storage → IndexedDB | P1 | HOCH | 6h | Offen |
| S-005 | Download-Link Sanitization | P1 | HOCH | 2h | Offen |
| S-006 | Web Crypto API Encryption | P2 | MITTEL | 16h | Offen |

### Runtime

| # | Titel | Prio | Aufwand | Abhängigkeiten | Status |
|---|-------|------|---------|----------------|--------|
| R-001 | Audit Log: IndexedDB Persistence | P0 | 6h | A-005 | Offen |
| R-002 | Evidence Writer: SHA-256 Hash Chain | P1 | 4h | R-001 | Offen |
| R-003 | Validation Rule Engine | P1 | 8h | A-001 | Offen |
| R-004 | Approval Gate: Promise-based + UI | P1 | 6h | A-004 | Offen |
| R-005 | Module Registry | P2 | 4h | A-001 | Offen |
| R-006 | Workflow DAG Executor | P2 | 12h | R-003, R-004 | Offen |

### DevOps

| # | Titel | Prio | Aufwand | Status |
|---|-------|------|---------|--------|
| D-001 | CI/CD Pipeline (GitHub Actions) | P0 | 3h | Offen |
| D-002 | Size-Limit Enforcement (200KB) | P0 | 1h | Offen |
| D-003 | ADRs 009-011 → Accepted | P0 | 30min | Offen |
| D-004 | Untracked Docs committen | P0 | 15min | Offen |
| D-005 | ESLint TS-strict für runtime/ | P1 | 2h | Offen |

### Offline / Sync

| # | Titel | Prio | Aufwand | Status |
|---|-------|------|---------|--------|
| O-001 | KK Scanner: CDN → Lazy-Load + Cache | P0 | 4h | Offen |
| O-002 | Service Worker: Offline-Cache | P1 | 4h | Offen |
| O-003 | Sync Queue: IndexedDB + FIFO | P3 | 8h | Offen |

### UI/UX

| # | Titel | Prio | Aufwand | Status |
|---|-------|------|---------|--------|
| U-001 | Approval Gate UI Component | P1 | 4h | Offen |
| U-002 | Import Preview UI | P1 | 6h | Offen |
| U-003 | System Status Panel | P2 | 4h | Offen |
| U-004 | Keyboard Focus Trapping | P2 | 3h | Offen |
| U-005 | Rätoromanisch vervollständigen | P2 | 8h | Offen |

### Testing

| # | Titel | Prio | Aufwand | Status |
|---|-------|------|---------|--------|
| T-001 | UI Component Tests | P1 | 12h | Offen |
| T-002 | Integration Tests: Runtime-UI Bridge | P1 | 8h | Offen |
| T-003 | E2E Tests: Critical User Flows | P2 | 12h | Offen |
| T-004 | Accessibility Audit (axe-core) | P2 | 4h | Offen |

---

## 8. RISIKOANALYSE

### Kritische Risiken

| # | Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|---|--------|-------------------|--------|-----------|
| R1 | CDN-Script-Injection via kkScanner | Mittel | Kritisch | S-002 + S-003 |
| R2 | localStorage Overflow (Dokumente) | Hoch | Kritisch | S-004 |
| R3 | Unverschlüsselte persönliche Daten | 100% | Kritisch | S-006 |
| R4 | Runtime-UI-Disconnect | 100% | Hoch | A-004 |
| R5 | State-Machine-Inkonsistenz | 100% | Hoch | A-002 |
| R6 | Kein CI/CD | 100% | Hoch | D-001 |

### Technische Schulden

| Schuld | Schwere | Kurzfrist-Fix | Langfrist-Lösung |
|--------|---------|---------------|------------------|
| `main.jsx` God Component (380 LoC) | Mittel | Akzeptabel | AppShell + Router + DataProvider |
| `setInterval(5000)` Auto-Save ohne Error-Handling | Hoch | Try-catch | Persistence-Agent |
| Duplizierte Expiry-Logik | Niedrig | — | Konsolidieren bei Tresor-Refactor |
| `WorkflowController` API-Mismatch | Hoch | A-003 | — |
| Keine UI-Tests | Hoch | T-001 | Continuous Testing |

---

## 9. EMPFEHLUNGEN

### Strategische Empfehlung

Die 54-Agenten-Architektur ist Over-Engineering für den aktuellen Stand. Fokus auf 5 Core-Agenten für den MVP:

1. **Runtime-Agent** (Event Bus + State Machine + Module Registry)
2. **Persistence-Agent** (Storage Abstraction + Write Buffer + Quota Monitor)
3. **Audit-Agent** (IndexedDB Log + Evidence Chain)
4. **Validation-Agent** (Rule Engine + Evidence Register)
5. **Approval-Agent** (Gate + UI + Promise-based Flow)

Alle weiteren Agenten erst implementieren wenn die 5 Core-Agenten stabil laufen.

### Geschätzter Aufwand bis lauffähiger MVP-Runtime

~45h reine Implementierung.
