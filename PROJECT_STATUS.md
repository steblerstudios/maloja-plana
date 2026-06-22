# Maloja Plana — Project Status

**"Der Schweizer Lebensordner"**
A privacy-first Swiss life organizer for immigrants, refugees, and expats.

**Date**: 2026-05-16
**Branch**: `dev`
**Live alpha**: https://steblerstudios.github.io/maloja-plana
**Repository**: https://github.com/steblerstudios/maloja-plana (private)
**Build**: 447 KB (121 KB gzipped), 75 modules, zero runtime dependencies

## Latest Implemented Fixes

| Commit | Description |
|--------|-------------|
| `fdceb91` | Alpha known-issues banner (dismissable, 4-language, calm tone) |
| `4cb226f` | BVG double-counting fix — BVG/AHV moved to reference, not subtracted from net income |
| `cdc0e70` | Banner and docs updated to reflect BVG fix |
| `ae1184f` | KK Scanner autofill + persist — all fields now saved, not just insurer |
| `3a811d0` | Docs updated to reflect KK Scanner fix |
| `013ce85` | Vorsorge document checklist — Patientenverfügung, Vorsorgeauftrag, Bestattungswünsche yes/not-yet fields + EmergencyHub summary |
| `1374af9` | UX fix — canton dropdowns show full names (value stays abbreviation), onboarding language buttons text-only (no flag emojis) |

## Latest Documentation Additions

| File | Content |
|------|---------|
| `docs/product/social-protection-system.md` | AHV, BVG, UVG, KTG structural overview |
| `docs/product/employment-and-insurance.md` | Employed vs. self-employed insurance landscape |
| `docs/product/retirement-timeline.md` | Pre/at/post-retirement planning orientation |
| `docs/alpha/feedback-log.md` | F-008 to F-013: domain feedback on pensions, UVG/KTG, self-employment |

## Build Status

Passes cleanly: `npm run build` produces 75 modules, zero warnings, zero errors.

## Known Open Issues

| ID | Issue | Severity | Status |
|----|-------|----------|--------|
| KI-001 | SKOS Grundbedarf: pauschal nach Haushaltsgrösse, keine Kinder-Differenzierung | Minor | Bewusste Vereinfachung — SKOS-Tabelle korrekt, Kinder-Zuschläge kantonal verschieden |
| KI-002 | BVG double deduction | Critical | **Fixed** (2026-05-16) |
| KI-003 | KK/AHV duplicate entry | Important | **Fixed** (2026-06-22) — autofill + persist + Slice C conflict warnings |
| KI-004 | Hardcoded German in schuldenCalc.js | Important | **Fixed** (2026-06-22) — Severity-Keys + Recommendations als i18n-Keys |
| KI-005 | QR code external CDN dependency | Important | **Fixed** — vendor/qrcodejs.js lokal eingebunden |
| KI-006 | Single SKOS table (national only) | Important | **Fixed** (2026-06-22) — Mietlimiten für alle 26 Kantone |
| KI-007 | No Web Crypto fallback | Minor | Open — low priority |
| KI-008 | Auto-save 5-second interval | Minor | **OK** — Dirty-Check via Ref-Vergleich bereits implementiert |

## Next Recommended Implementation Candidates

1. **Vorsorge Slice B** — document uploads to Dokument-Tresor, municipality registration reminders, canton-specific form links
2. **KI-006 Kantonale SKOS** — kantonsspezifische Mietlimiten und Zuschläge (Phase 13)
3. **Verbindungen vertiefen** — mehr Crosslinks zwischen Kapiteln, Daten-Wiederverwendung sichtbar machen

## Do Not Touch Yet

- SKOS/Sozialhilfe: bewusste Vereinfachung, kein Refactoring nötig
- PremiumSubsidy/IPV calculation
- Data schema or localStorage keys (no migrations without explicit approval)
- Cloud sync, accounts, or server-side components
- Gross/net income toggle (deferred to Phase 14)
- Multi-person household model

## Architecture Reminders

- React 18 + Vite 4, `React.createElement()` throughout (not JSX despite .jsx extensions)
- 100% inline styles via `palette` prop + CSS custom properties
- Custom i18n: `I18nProvider` -> `useT()` -> `t(key)`, fallback: selected -> EN -> key
- localStorage with `or5_` prefix, IndexedDB for documents
- Data version 1, sequential migration system
- 100% offline, zero accounts, zero cloud
