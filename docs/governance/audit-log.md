# Audit Log

## Purpose

Track significant changes to the application that affect data handling, security, or user trust. This log supports future ISO/compliance readiness.

## Format

Each entry records: date, category, description, and reference (commit or PR).

## Log

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
