# Maloja Plana — Release Notes

**Version**: 0.5.0-alpha (Phase 5 complete)  
**Date**: 2026-05-15  
**License**: AGPL-3.0  
**Live alpha**: https://steblerstudios.github.io/maloja-plana  
**Repository**: https://github.com/steblerstudios/maloja-plana (private)

## Completed Phases

- **Phase 0 — Internationalization**: Custom i18n system with 4 languages (EN, DE, FR, IT), ~600 keys per language, fallback chain (selected > EN > key)
- **Phase 1 — Foundation**: Data versioning and migration system, auto-backup to IndexedDB, hash-based routing
- **Phase 2 — Visual Rebrand**: Renamed from "Ordnung & Ruhe v5" to "Maloja Plana", new color palette and identity
- **Phase 2.5 — Pictogram System**: 40 SVG icons via IconSystem.jsx, consistent viewBox and stroke styling
- **Phase 3 — Accessibility**: Focus-visible outlines, skip-to-content link, ARIA labels on icon-only buttons, navigation landmark, aria-live status region, prefers-reduced-motion support
- **Phase 4 — Responsive Polish**: All 17 views verified at 375px mobile width, auto-fit/minmax grids, flex-wrap tab bars, no horizontal scroll on mobile
- **Phase 5 — Data Integrity & Export Hardening**: Optional AES-256-GCM encrypted backup via Web Crypto API, plaintext JSON export, restore with pre-restore snapshot safety, data validation on load, print-friendly CSS stylesheet. +1 SVG icon (lock), +26 i18n keys per language.

## Build

| Metric | Value |
|--------|-------|
| Source files | 56 |
| Source lines | ~17,800 |
| Gzipped bundle | 120 KB |
| Runtime dependencies | React 18, React DOM (no others) |
| Build tool | Vite 4 |

## Architecture

- **Rendering**: `React.createElement()` throughout (no JSX transpilation despite .jsx extensions)
- **Styling**: 100% inline styles via palette prop objects + CSS custom properties in `tokens.css`
- **Routing**: Hash-based (`#/view` or `#/chapter/N`)
- **Data**: localStorage (`or5_` prefix) + IndexedDB (`ordnung-ruhe-documents`, `ordnung-ruhe-backups`)
- **i18n**: Custom context provider (`I18nProvider` > `useT()` > `t(key, params)`)
- **Offline**: Fully functional without network. No backend, no accounts, no cloud.

## Accessibility

- Keyboard navigation: all interactive elements reachable via Tab
- Focus-visible: 2px solid outline on all focusable elements
- Skip-to-content link: visible on focus, bypasses navigation
- ARIA labels: all icon-only buttons labeled for screen readers
- Navigation landmark: mobile drawer uses `<nav>` with `role="navigation"`
- Live region: auto-save status announced via `aria-live="polite"`
- Reduced motion: animations and transitions disabled when `prefers-reduced-motion` is active

## Responsive Support

- All 17 views tested at 375px (mobile), 768px (tablet), 1280px (desktop)
- Two-panel layouts stack to single column below ~580px via `repeat(auto-fit, minmax(280px, 1fr))`
- Tab bars wrap via `flex-wrap` on narrow screens
- No horizontal overflow at any tested width

## Known Limitations

- QR code generation (OrganDonation, KKScanner) depends on cdnjs.cloudflare.com CDN — fails offline
- ~80 button labels use Unicode prefixes (checkmarks, circles) inconsistent with SVG icon system — functional but cosmetically inconsistent
- SchuldenManager and BudgetImport are scaffolded but do not persist data between sessions
- Single-user only — no multi-person or household profile support
- No PWA manifest or service worker caching
- SKOS household calculation treats children as additional adults (incorrect)
- AHV number can be entered in both Basis chapter and KK Scanner (duplication risk)
- Some Sozialhilfe result strings bypass i18n (hardcoded German)

## Next Phase

**Phase 6 — Universal Design Foundation**  
Pictogram-first interaction patterns, simple-language audit, gender-neutral language review, calm progress visualization, visual guidance layer, discrimination-free UX. No data model changes, no migration required. Medium risk.
