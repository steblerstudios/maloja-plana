# Maloja Plana — Roadmap Checkpoint

**Date**: 2026-05-15 (updated after Phase 5)  
**Build**: ~120 KB gzipped, 56 files, ~17,800 lines  
**Dependencies**: React 18 + Vite 4 (zero external runtime deps)  
**Live alpha**: https://ordnung-ruhe-neu.vercel.app  
**Repository**: https://github.com/steblerstudios/maloja-plana (private)

## Current Stable State

- 17 views, 7 chapters, 4 languages (EN/DE/FR/IT)
- localStorage (`or5_` prefix) + IndexedDB persistence
- 100% offline, no accounts, no cloud
- Data version 1, sequential migration system with pre-migration snapshots

## Completed Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 0 | i18n system (4 languages) | Done |
| 1 | Foundation (data migration, auto-backup, hash routing) | Done |
| 2 | Visual rebrand to "Maloja Plana" | Done |
| 2.5 | SVG pictogram system (40 icons) | Done |
| 3 | Accessibility (focus-visible, skip-link, aria-labels, reduced-motion) | Done |
| 4 | Responsive polish (all 17 views mobile-safe at 375px) | Done |
| 5 | Data integrity, encrypted backup, validation, print CSS | Done |

## Frozen Roadmap: Phases 6-19

| Phase | Scope | Data Ver. | Risk |
|-------|-------|:---------:|:----:|
| 6 | Universal design, pictograms, simple language | 1 | Med |
| 7 | Contact & relationship layer | 2 | Med-High |
| 8 | Closed alpha (20 testers) | 2 | Low |
| 9 | Multi-person household | 3 | High |
| 10 | Romansh language | 3 | Low-Med |
| 11 | Mobility module | 3 | Med |
| 12 | Inventory & household | 3 | Med |
| 13 | Swiss protection logic | 3 | Med-High |
| 14 | Financial tools hardening | 3 | Med |
| 15 | PWA, notifications, offline | 3 | Med |
| 16 | Document intelligence | 3 | Med |
| 17 | Visualization & analytics | 3 | Low |
| 18 | Additional languages & RTL | 3 | Med |
| 19 | QR sharing between devices | 3 | High |

## Critical Rules

1. No runtime dependencies unless lazy-loaded and justified (Tesseract.js only exception)
2. Every schema change requires a migration function with pre-migration snapshot
3. Never delete localStorage keys or IndexedDB databases
4. Every new view: responsive at 375px, keyboard-navigable
5. Every user-facing string through `t()` — no hardcoded text
6. Calm over clever: no gamification, urgency manipulation, or streak counters
7. Pictogram-first: every action/status gets an SVG icon
8. Discrimination-free: no assumptions about family, gender, origin, or legal status
9. Alpha before risk: no high-risk migration ships without real-user validation
10. Bundle budget: stay under 200 KB gzipped core

## Do NOT Implement Yet

- Cloud sync, accounts, or any server-side component
- Bank API / PSD2 integration
- Phone contact book import
- Biometric authentication
- Automated insurance comparison
- Barcode product lookup
- Network-based telemetry
- Open-source publication (needs security audit)

## Next Phase: 6 — Universal Design Foundation

**Scope**: Pictogram-first flows, simple-language audit, gender-neutral language, calm progress visualization, visual guidance, discrimination-free UX  
**Risk**: Medium  
**Migration**: None (data version stays at 1)  
**Why next**: Design vocabulary must be established before building new modules (Contacts, Mobility, Inventory). Retrofitting later costs 3-5x more.
