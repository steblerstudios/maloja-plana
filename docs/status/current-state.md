# Current State — Maloja Plana

Last updated: 2026-06-20
Branch: dev

## Architecture

- Local-first, offline-first, account-free, browser storage only
- React.createElement (no JSX transpilation despite .jsx extensions)
- palette/tokens styling (no Tailwind, no CSS modules)
- Custom i18n with t() function: DE, EN, FR (+ IT/RM header only)
- Hash-based routing (src/utils/hashRouter.js)
- Components receive { palette, t, data } props
- Runtime layer: TypeScript (src/runtime/) for workflow/approval/audit
- Vitest for testing

## Build & Deploy

- Vite 4.5.14, production build passes
- GitHub: steblerstudios/maloja-plana, default branch dev
- Vercel deployment via git push origin dev:main
- 19 test files, 171 tests passing

## Features — Built

### Chapters (7 life chapters on mountain visualization)
- Persönliche Basis (person, contact, family)
- Wohnen & Leben (address, costs, landlord, property)
- Finanzen & Geld (income, expenses, obligations, savings, credit, provision)
- Versicherungen & Vorsorge (KK, BVG, UVG, liability, household, auto, AHV)
- Ausbildung & Arbeit (education, work, languages)
- Behörden & Rechtliches (taxes, legal, representation)
- Notfall (contact, medical, care, provision)

### Tools (12 in dashboard grid, all with subtitles)
- Kalender (CalendarReminders) — deadline/date tracking
- Budget-Sync (BudgetSync) — CSV import
- Prämienverbilligung IPV (PremiumSubsidy) — eligibility check with cantonal data
- Prämien-Orientierung (PraemienOrientierung) — model comparison with BAG reference data
- Vorsorge-Rechner (VorsorgeRechner) — AHV/BVG pension calculator
- Erwerbsersatz EO (EOrechner) — maternity, paternity, adoption, care leave
- Steuerrechner (TaxCalculator) — federal tax DBG Art. 36, Grund-/Verheiratetentarif
- Sozialhilfe (SozialhilfeView + SozialhilfeRechner) — SKOS orientation
- Offizielle Links (DirektLinks) — curated Swiss authority links
- Dokumentenablage (DocumentTresor) — secure local document storage
- Lebenslauf (CVGenerator) — CV builder
- Meine Unterlagen (MeineUnterlagen) — document management

### Additional views
- KK-Scanner — insurance card barcode scanner
- Budget (BudgetImport) — budget CSV import
- Schulden (SchuldenManager) — debt tracking
- Organspende (OrganDonation) — organ donation card
- Charts (ChartsAdvanced) — data visualization
- Export (ZipExport) — encrypted ZIP backup
- Notifications (NotificationSettings) — reminder settings
- Lebensmappe — life folder print view
- Notfalldossier — emergency dossier print view
- Notfalleinstieg — emergency onboarding flow
- Legal — privacy/legal information

### Data modules (src/data/)
- ahvRechner.js — AHV pension calculation
- eoRechner.js — EO/maternity/paternity calculation
- steuerRechner.js — federal tax brackets DBG Art. 36
- sozialhilfeRechner.js — SKOS social assistance calculation
- lohnCheck.js — cantonal minimum wage check (GE, NE, JU, BS, TI)
- direktLinks.js — curated official Swiss links
- plzGemeinde.js — PLZ/municipality mapping
- praemienRegionen.js — BAG premium regions
- praemienDetail.js — detailed insurer premiums
- versichererListe.js — insurer directory
- orientationRegistry.js — contextual orientation texts

### Cross-links (contextual navigation)
- Versicherungen chapter → IPV tool (after KK premium field)
- Finanzen chapter → Steuerrechner (after monthly income field)
- Finanzen chapter → Mindestlohn warning (if canton has minimum wage law)

### Infrastructure
- Dark mode (palette switching)
- Demo mode with sample data
- Beta gate (access code)
- Auto-save with status indicator
- Storage warning monitor
- Data migration system
- Data validation
- Auto backup
- Encrypted backup/restore
- Overdue document reminders
- Mirror cards (chapter data preview)
- Onboarding flow
- Error boundary
- Service worker for notifications
- QR code generation (vendor/qrcodejs.js)

## Features — Partially Built

- Italian (IT) and Romansch (RM): header language switcher exists, i18n files exist but not as complete as DE/EN/FR
- BFS Branchenvergleich: data module not built, only cantonal minimum wage check exists

## Features — Planned

- BFS median wage comparison per industry sector
- SECO Lohnrechner reference link integration

## Features — Explicitly Excluded

- No backend / cloud sync
- No AI/chatbot / hidden automation
- No Comparis integration
- No insurance advice / product recommendations
- No household model
- No Swiss rule engine
- No runtime API calls (fetch)
- No TypeScript in UI layer (only in src/runtime/)
- No Tailwind
- No dependency bloat

## Mobile

- MobileNav with primary tools (8) + collapsed "Weitere Werkzeuge" (7)
- Primary: Unterlagen, Tresor, KK-Scanner, Budget, Schulden, Steuern, Sozialhilfe, Organspende
- Weitere: Kalender, Budget-Sync, IPV, CV, Charts, Export, Benachrichtigungen
- 375px QA verified

## Code Quality

- No className usage (except 1 accessibility skip-link)
- No emoji icons in source
- No placeholder/example values
- No hardcoded colors (palette tokens throughout)
- No Tailwind classes
- All data modules have test coverage
