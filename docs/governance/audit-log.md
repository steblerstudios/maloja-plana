# Audit Log

## Purpose

Track significant changes to the application that affect data handling, security, or user trust. This log supports future ISO/compliance readiness.

## Format

Each entry records: date, category, description, and reference (commit or PR).

## Log

### 2026-06 — Beta Hardening & Operations

| Date | Category | Description | Reference |
|------|----------|-------------|-----------|
| 2026-06-23 | Operations | Wartungskalender, automatische Quartals-Erinnerungen (GitHub Actions cron), Claude-Wartungs-Prompts | maintenance-reminder.yml |
| 2026-06-23 | Operations | GitHub Issue Templates (Bug, Feature, Wartung) für Ticketing | .github/ISSUE_TEMPLATE/ |
| 2026-06-23 | Documentation | CHANGELOG.md erstellt, Versionshistorie dokumentiert | CHANGELOG.md |
| 2026-06-23 | UX | Print-Stylesheet verbessert, Unicode-Emoji-Fix, CTA-Duplikat entfernt | 94fafe6 |
| 2026-06-23 | Security | ViewErrorBoundary: Per-View Crash-Isolation, App crasht nicht komplett | 776dcfb |
| 2026-06-23 | UX | A11y: Skip-Link, focus-visible, ARIA-Labels, autoComplete auf Formulare | eb52bd4 |
| 2026-06-23 | Feature | Rätoromanisch 100% Parität (2000+ Keys, alle Namespaces) | 776dcfb |
| 2026-06-23 | Feature | KVG-Leistungen: Franchise-Tracker + Rechnungserklärung | 776dcfb |
| 2026-06-22 | Performance | Bundle-Splitting: PLZ/Prämien-Daten als separate Chunks (247→124KB) | ae7b59b |
| 2026-06-22 | Feature | Trust-Panel: Aufklappbare Datenschutz-Erklärung (5 Sprachen) | d343e89 |
| 2026-06-22 | UX | SEO: canonical, Schema.org, OG/Twitter, SafeSearch-Rating | 589f4da, 0793c58 |
| 2026-06-22 | Feature | Ressourcen-Tab: Threema, SecureSafe, Beratungsstellen, Petitionen | 04bb45f |
| 2026-06-21 | Feature | Finanz-Übersicht: Kompaktansicht + BFS-Branchenvergleich | f18f5ff, bbcfcce |
| 2026-06-21 | Feature | Behörden-Checkliste (localStorage-persistent, 5 Sprachen) | 24d9e01 |
| 2026-06-21 | Feature | Dashboard-Snippets: Versicherungen, Behörden, Notfall, Finanzen | b5f327a |
| 2026-06-21 | UX | Dropdown-UX: Custom Chevron + appearance:none | dd965c6 |
| 2026-06-21 | Feature | Demo-Einstieg als Quick-Action Card | 944f0b5 |
| 2026-06-20 | Feature | Fortschrittskarte: Berglandschaft + Kapitel-Labels | 122964f |
| 2026-06-20 | Feature | Rätoromanisch als 5. Sprache (Grundausstattung) | 6e704e5 |
| 2026-06-20 | Feature | Kantonale Links, Behörden-Dossier JSON-Export | df26adc |
| 2026-06-19 | UX | Design-Asymmetrie (A-030 Audit), 17 kaputte Links gefixt | 0f1e349 |
| 2026-06-19 | UX | Accessibility: Footer-Landmark, aria-live für Suchresultate | 9ef369d |

### 2026-05 — Phase 5: Data Integrity & Export Hardening

| Date | Category | Description | Reference |
|------|----------|-------------|-----------|
| 2026-05 | Security | Added AES-256-GCM encrypted backup export via Web Crypto API | Phase 5 commit |
| 2026-05 | Data Integrity | Added `validateData()`, `validateDocs()` on every app load | Phase 5 commit |
| 2026-05 | Data Safety | Added pre-restore snapshot (`*_prerestore` keys) before backup restore | Phase 5 commit |
| 2026-05 | Data Safety | Added `validateBackupPayload()` for imported backup files | Phase 5 commit |
| 2026-05 | UX | Added print-friendly CSS (`print.css`) for offline documentation | Phase 5 commit |
| 2026-05 | Deployment | Initial Vercel deployment with security headers | Manual |
| 2026-05 | Deployment | GitHub private repository created (steblerstudios/maloja-plana) | Manual |
| 2026-05 | Documentation | Comprehensive security and product documentation sprint | docs commit |

### Pre-Phase 5

| Date | Category | Description | Reference |
|------|----------|-------------|-----------|
| 2026-04 | Feature | Phase 4: Charts, theme toggle, dark mode palette | v0.4.0 tag |
| 2026-04 | Feature | Phase 3: Document Tresor (IndexedDB), KK Scanner | v0.3.0 |
| 2026-04 | Feature | Phase 2: Budget tools, tax calculator, CV generator, emergency hub | v0.2.0 |
| 2026-04 | Feature | Phase 1: Core app, chapters, dashboard, auto-save | v0.1.0 |

## Categories

| Category | Scope |
|----------|-------|
| Security | Encryption, authentication, access control changes |
| Data Integrity | Validation, migration, corruption prevention |
| Data Safety | Snapshots, backups, recovery mechanisms |
| Feature | New user-facing functionality |
| Deployment | Hosting, infrastructure, CI/CD changes |
| UX | Accessibility, print, responsive design |
| Documentation | Significant documentation changes |
| Incident | Data loss, corruption, or exposure events |
