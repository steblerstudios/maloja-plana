# Repository Cleanup Plan

> Agent 1 — Repository Curator
> Stand: 2026-06-07

---

## Bestandsaufnahme

| Bereich | Dateien | Anmerkung |
|---------|---------|-----------|
| `src/` | 63 Dateien | Aktiver Code |
| `docs/` | 220 Dateien in 20+ Ordnern | Massiver Dokumentationsbestand |
| `ordnung-ruhe/` (Unterordner!) | ~85 MB (davon 84 MB node_modules) | Altes Projekt INNERHALB des neuen |
| `dist/` | Build-Output | Generiert |
| `/Projects/maloja-icons/` | 17 SVGs + preview.html | Externe Icon-Sammlung |

---

## KEEP — Unverändert lassen

| Pfad | Begründung |
|------|-----------|
| `src/` (komplett) | Aktiver Produktiv-Code |
| `docs/product/` | Zentrale Registries (Design, Swiss Knowledge, Product Memory, Architecture) |
| `docs/context/` | CLAUDE.md Arbeitskontext |
| `docs/governance/` | Produktverfassung |
| `docs/legal/` | Rechtlich relevant |
| `docs/prep/` | Aktuelle Analyse-Phase (Beta, Design Gap, Consolidation) |
| `docs/design/` | Design Reality Audit — aktuell und relevant |
| `docs/data-model/` | Datenstruktur-Dokumentation |
| `public/` | PWA-Icons |
| `CLAUDE.md` | Arbeitsanweisung |

---

## MERGE — In bestehende Strukturen integrieren

| Quelle | Ziel | Was |
|--------|------|-----|
| `ordnung-ruhe/public/coin-obverse.svg` | `src/assets/` oder `public/assets/` | Helvetia-Münze (Kunstwerk, brauchbar) |
| `ordnung-ruhe/public/coin-reverse.svg` | `src/assets/` oder `public/assets/` | Fünfliber-Münze (Kunstwerk, brauchbar) |
| `ordnung-ruhe/PDFS/` | `docs/archive/` | Produktkonzept-PDF (Referenz) |
| `/Projects/maloja-icons/*.svg` | `src/assets/icons-full/` | 17 Originale in voller Grösse |
| `docs/roadmap/` (Kernaussagen) | `docs/product/product-memory-registry.md` | Nur noch relevante Entscheidungen |

---

## ARCHIVE — In `docs/archive/` verschieben

| Pfad | Begründung |
|------|-----------|
| `docs/roadmap/PHASE_1_*.md` (7 Dateien) | Phase 1 ist abgeschlossen — historisch |
| `docs/roadmap/SPRINT_PLAN.md` | Veraltet |
| `docs/roadmap/BACKLOG_MASTER.md` | Überholt durch backlog-registry |
| `docs/roadmap/EXECUTIVE_DASHBOARD.md` | Nie aktualisiert |
| `docs/archive/claude-handoffs/` (26 Dateien) | Bereits archiviert — korrekt |
| `docs/agents/` (19 Dateien) | Theoretische Agent-Architektur — nie implementiert, nie referenziert |
| `docs/runtime/` (12 Dateien) | Runtime-Architektur — noch nicht gebaut, nur Planung |
| `docs/spinnennetz/` (4 Dateien) | Konzeptarbeit "Lebensnetz" — entschieden: NICHT bauen |
| `docs/alpha/` | Alpha-Phase beendet |
| `docs/alpha-feedback/` | Alpha-Phase beendet |
| `docs/cantons/canton-differences.md` | Referenz, nicht aktiv |
| `docs/translations/rm.md` | Rätoromanisch — Priorität 5 |

---

## DELETE — Nur mit expliziter Bestätigung

| Pfad | Begründung | Risiko |
|------|-----------|--------|
| `ordnung-ruhe/node_modules/` (84 MB) | Komplett generierbar via `npm install` | **Keins** — ist nur Cache |
| `ordnung-ruhe/public/favicon.svg` | Lila Blitz — gehört nicht zu Maloja | Keins |
| `ordnung-ruhe/public/icons.svg` | Social-Media-Icons (GitHub, Discord, X) — irrelevant | Keins |
| `ordnung-ruhe/src/assets/react.svg` | Vite-Boilerplate | Keins |
| `ordnung-ruhe/src/assets/vite.svg` | Vite-Boilerplate | Keins |
| `ordnung-ruhe/src/App.css` | Nicht verwendet | Keins |
| `ordnung-ruhe/src/App.jsx` | Nicht verwendet (alles in main.jsx) | Keins |
| `ordnung-ruhe/src/index.css` | Nicht verwendet | Keins |

**NICHT löschen ohne Bestätigung:**
- `ordnung-ruhe/src/main.jsx` — enthält SoftCard, Palette-Definition, Referenzcode
- `ordnung-ruhe/public/coin-*.svg` — Kunstwerke (erst nach MERGE löschen)
- `ordnung-ruhe/public/coins.html` — Preview-Seite (nützlich als Referenz)
- `ordnung-ruhe/PDFS/` — Produktkonzept
- `ordnung-ruhe/src/assets/hero.png` — müsste visuell geprüft werden

---

## Empfohlene Endstruktur

```
ordnung-ruhe-neu/
├── src/                          (aktiver Code)
│   ├── assets/                   
│   │   ├── icons-full/           (NEU — 17 maloja-icons Originale 256×256)
│   │   ├── coin-obverse.svg      (NEU — aus altem Projekt)
│   │   └── coin-reverse.svg      (NEU — aus altem Projekt)
│   ├── config/
│   ├── data/
│   ├── i18n/
│   ├── utils/
│   └── vendor/
├── public/
├── docs/
│   ├── product/                  (Registries — Quelle der Wahrheit)
│   ├── design/                   (Design Audits + Language)
│   ├── prep/                     (aktuelle Phase)
│   ├── context/                  (Arbeitskontext)
│   ├── governance/               (Produktverfassung)
│   ├── legal/                    (Rechtliches)
│   ├── research/                 (Recherche, wenn nötig)
│   └── archive/                  (alles Abgeschlossene)
│       ├── claude-handoffs/
│       ├── phases/               (Phase 1, 2, Sprints)
│       ├── concepts/             (Spinnennetz, Agents, Runtime)
│       └── old-project/          (ordnung-ruhe Referenzcode)
└── [config files]
```

---

## Grösster Handlungsbedarf

1. **`ordnung-ruhe/node_modules/` löschen** — 84 MB totes Gewicht im Repo
2. **Coin-SVGs extrahieren** — bevor `ordnung-ruhe/` archiviert wird
3. **maloja-icons/ ins Repo holen** — externe Abhängigkeit eliminieren
4. **docs/ ausdünnen** — 19 Agent-Dokumente + 12 Runtime-Dokumente archivieren (nie gebaut)
