# Repository Cleanup & Typography Lift

> Stand: 2026-06-07
> Sprint 0 + Sprint 1 — zusammen ausgeführt

---

## Sprint 0 — Repository-Hygiene

### Archiviert
- `ordnung-ruhe/node_modules/` entfernt (~84 MB)
- `ordnung-ruhe/` Referenzdateien → `docs/archive/old-project/`
- `docs/agents/` → `docs/archive/concepts/agents/`
- `docs/runtime/` → `docs/archive/concepts/runtime/`
- `docs/spinnennetz/` → `docs/archive/concepts/spinnennetz/`
- `docs/alpha/`, `docs/alpha-feedback/` → `docs/archive/phases/`

### Assets konsolidiert
- `coin-obverse.svg` (Helvetia 400×400) → `src/assets/`
- `coin-reverse.svg` (Fünfliber 400×400) → `src/assets/`
- `coin-preview.html` → `src/assets/`
- 17 maloja-icons (256×256) → `src/assets/icons-full/`
- `preview.html` → `src/assets/icons-full/`

---

## Sprint 1 — "Luft und Licht"

### Typografie-Lift

| Vorher | Nachher | Wo |
|--------|---------|-----|
| `fontSize: '11px'` | `fontSize: '12px'` oder `text.sm` (13px) | Hints, Orientierung, Fussnoten, Meta-Info |
| `fontSize: '12px'` | `fontSize: '13px'` | Body-Text, Labels, Formularfelder, Buttons |
| Hardcoded `'11px'` in ChapterView | `text.sm` Token | Hints + Orientierungssätze nutzen jetzt Token |

### Schatten aktiviert

| Komponente | Schatten |
|-----------|---------|
| ChapterView Container | `shadow.sm` (war schon da, bestätigt) |
| BudgetSync Container | `shadow.sm` hinzugefügt |
| ChartsAdvanced Container | `shadow.sm` hinzugefügt |
| DocumentTresor Container | `shadow.sm` hinzugefügt |
| MirrorCards Lebenssatz | `shadow.md` hinzugefügt |

### Mehr Weissraum

| Stelle | Vorher | Nachher |
|--------|--------|---------|
| ChapterView baseStyle (Feldabstand) | `marginBottom: '20px'` | `marginBottom: space.lg` (24px) |
| ChapterView Header-Abstand | `marginBottom: '20px'` | `marginBottom: space.lg` (24px) |
| ChapterView Tab-Abstand | `marginBottom: '20px'` | `marginBottom: space.lg` (24px) |
| ChapterView Tab-Gap | `gap: '8px'` | `gap: space.sm` (8px) |
| ChapterView Tab-Padding | `paddingBottom: '12px'` | `paddingBottom: space.md` (16px) |

### Betroffene Dateien (20 Dateien)

- `src/ChapterView.jsx` — Hints, Orientierung, Spacing (Tokens)
- `src/MirrorCards.jsx` — Shadow.md auf Lebenssatz-Karte
- `src/BudgetSync.jsx` — 12→13px, shadow.sm
- `src/BudgetImport.jsx` — 11→12px, 12→13px
- `src/CalendarReminders.jsx` — 11→12px, 12→13px
- `src/ChartsAdvanced.jsx` — 12→13px, shadow.sm
- `src/CVGenerator.jsx` — 11→12px, 12→13px
- `src/DocumentTresor.jsx` — 11→12px, 12→13px, shadow.sm
- `src/AutoSaveStatus.jsx` — 11→12px
- `src/KKScanner.jsx` — 11→12px, 12→13px
- `src/BetaGate.jsx` — 12→13px
- `src/Lebensmappe.jsx` — 11→12px, 12→13px
- `src/NotfallDossier.jsx` — 11→12px, 12→13px
- `src/MeineUnterlagen.jsx` — 11→12px, 12→13px
- `src/SchuldenManager.jsx` — 11→12px, 12→13px
- `src/NotificationSettings.jsx` — 11→12px, 12→13px
- `src/OrganDonation.jsx` — 11→12px, 12→13px
- `src/PremiumSubsidy.jsx` — 11→12px, 12→13px
- `src/SozialhilfeView.jsx` — 11→12px, 12→13px
- `src/TaxCalculator.jsx` — 11→12px, 12→13px
- `src/ZipExport.jsx` — 11→12px, 12→13px

### Was NICHT verändert wurde
- Keine Logik, keine Datenstrukturen, keine API
- Keine localStorage-Keys (`or5_*`)
- Keine IndexedDB-Schemata
- Keine Button-Prefixes (Unicode)
- Keine i18n-Keys
- Keine neuen Abhängigkeiten
- `IconSystem.jsx` fontSize bewusst nicht angepasst (SVG-interne Werte)

---

## Build-Verifikation

| Metrik | Vorher | Nachher |
|--------|--------|---------|
| Build | Grün | Grün |
| Bundle (gzip) | 188.36 KB | 188.37 KB |
| Fehler in Console | 0 | 0 |
| Neue Dependencies | 0 | 0 |

---

## Was kommt als Nächstes (nicht in diesem Commit)

- Sprint 2: Kapitel-Header (48px Icon + Lebenssatz)
- Sprint 2: Trail-Icons grösser
- Sprint 3: Header Glassmorphism
- Sprint 3: Coin-SVGs als Wasserzeichen
