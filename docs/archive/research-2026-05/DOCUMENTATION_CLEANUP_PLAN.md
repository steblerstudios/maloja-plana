# DOCUMENTATION CLEANUP PLAN — Maloja Plana

> Erstellt: 2026-06-08
> Inventar aller Projektdokumente mit Empfehlung: KEEP / MERGE / ARCHIVE / DELETE CANDIDATE
> Noch nichts löschen. Erst prüfen, dann entscheiden.

---

## A. Wurzelverzeichnis (31 .md-Dateien)

### KEEP — Aktuelle Master-Dokumente

| Datei | Zeilen | Zweck | Status |
|-------|--------|-------|--------|
| `CLAUDE.md` | 16 | Arbeitsanweisungen für Claude | Aktiv, kurz |
| `README.md` | 215 | Projekt-README | Aktiv |
| `DEV_WORKFLOW.md` | 32 | Entwicklungs-Workflow | Aktiv |
| `SECTION_VOICE_LIBRARY.md` | 141 | Voice/Tone für Sektionen | Aktuell (Jun 08) |
| `I18N_FINAL_CHECK.md` | 62 | i18n-Status | Aktuell (Jun 08) |
| `LEGAL_COMPLETION.md` | 49 | Rechtliche Aspekte | Aktuell (Jun 08) |

### KEEP — Aktuelle Reviews & Analysen

| Datei | Zeilen | Zweck | Status |
|-------|--------|-------|--------|
| `BETA_READINESS_REVIEW_V2.md` | 332 | Beta-Status aktuell | Aktuell (Jun 08) |
| `MALOJA_REVIEW_V2.md` | 167 | Gesamtreview V2 | Aktuell (Jun 08) |
| `MALOJA_REVIEW_AFTER_CONSOLIDATION.md` | 174 | Review nach Konsolidierung | Aktuell (Jun 08) |
| `FORM_EXPERIENCE_REVIEW.md` | 195 | Formular-UX-Analyse | Aktuell (Jun 08) |
| `LIFE_SPACE_PHASE_RETROSPECTIVE.md` | 250 | Retrospektive Lebensraum-Phase | Aktuell (Jun 07) |
| `DESIGN_SELF_REFLECTION.md` | 177 | Neue Designreflexion | Aktuell (Jun 08) |

### MERGE — Überlappende Dokumente zusammenführen

| Gruppe | Dateien | Empfehlung |
|--------|---------|------------|
| **Beta-Reviews** | `BETA_READINESS_REVIEW_V2.md` + `BETA_REALITY_CHECK.md` + `PRE_FLIGHT_CHECK.md` | V2 behalten, andere beiden archivieren — V2 ist die aktuellste Fassung |
| **Maloja-Reviews** | `MALOJA_REVIEW_V2.md` + `MALOJA_REVIEW_AFTER_CONSOLIDATION.md` | Beide behalten (verschiedene Perspektiven), aber klar benennen |
| **Lebensraum** | `LIFE_SPACE_COMPLETION.md` + `LIFE_SPACE_CLOSURE_PLAN.md` + `LIFE_MAP_COMPLETENESS_REVIEW.md` | Phase ist abgeschlossen — Retrospektive behalten, Rest archivieren |

### ARCHIVE — Erledigte / überholte Dokumente

| Datei | Zeilen | Grund |
|-------|--------|-------|
| `MASTER_CONTEXT_V1.md` | 527 | Überholt — mehrere neuere Reviews existieren |
| `HUMAN_FEEDBACK_RECOVERY.md` | 347 | Erledigt — Feedback wurde eingearbeitet |
| `PLACE_VS_ADMINISTRATION.md` | 386 | Konzeptionell wertvoll, aber Phase ist durch |
| `TRANSITIONS_ARCHITECTURE.md` | 483 | Zukunftsplanung, nicht aktuell relevant |
| `SWISS_LIFE_ARCHITECTURE.md` | 482 | Zukunftsplanung, nicht aktuell relevant |
| `LIFE_SPACE_COMPLETION.md` | 335 | Erledigt — Retrospektive deckt das ab |
| `LIFE_SPACE_CLOSURE_PLAN.md` | 397 | Erledigt — Phase abgeschlossen |
| `LIFE_MAP_COMPLETENESS_REVIEW.md` | 347 | Erledigt — in Retrospektive zusammengefasst |
| `BETA_REALITY_CHECK.md` | 291 | Überholt durch V2 |
| `PRE_FLIGHT_CHECK.md` | 287 | Überholt durch V2 |
| `NEXT_CLAUDE_HANDOFF.md` | 139 | Alt (Mai 16) — überholt |
| `PROJECT_STATUS.md` | 73 | Alt (Mai 16) — überholt |
| `ROADMAP_CHECKPOINT.md` | 91 | Alt — überholt |
| `ROADMAP_NEXT.md` | 46 | Alt — überholt |
| `RELEASE_NOTES.md` | 69 | Alt — gehört ins Archiv |
| `RELEASE_CRITERIA.md` | 22 | Dürftig, überholt |
| `RECOVERY.md` | 19 | Minimal, überholt |

### DELETE CANDIDATE — Leere oder wertlose Dateien

| Datei | Grund |
|-------|-------|
| `Inhalt` | Leere Datei (0 Bytes) |
| `ARCHITECTURE_NOTES.md` | 9 Zeilen — Platzhalter ohne Inhalt |
| `ACCESSIBILITY_NOTES.md` | 30 Zeilen — oberflächlich, Design Registry hat alles |
| `BUTTONS_AUDIT.txt` | Erledigt — Unicode-Button-Problem dokumentiert, als "low priority" eingestuft |
| `TESTING_GUIDE.md` | 87 Zeilen — veraltet, bezieht sich auf alten Stand |

---

## B. docs/ Verzeichnis

### KEEP — Aktive Registries & Kernreferenzen

| Pfad | Zweck |
|------|-------|
| `docs/product/design-language-registry.md` | **Zentral — Designsprache** |
| `docs/product/product-memory-registry.md` | **Zentral — Produktgedächtnis** |
| `docs/product/swiss-knowledge-registry.md` | **Zentral — Schweizer Wissen** |
| `docs/product/system-architecture-registry.json` | **Zentral — Systemarchitektur** |
| `docs/product/PRD.md` | Produktanforderungen |
| `docs/product/principles.md` | Produktprinzipien |
| `docs/product/mission.md` | Mission |
| `docs/product/emotional-goals.md` | Emotionale Ziele |
| `docs/product/anti-patterns.md` | Anti-Patterns |
| `docs/design/design-reality-audit.md` | A-030 Audit — immer noch relevant |
| `docs/design/emotional-temperature-map.md` | Emotionale Analyse — relevant |
| `docs/design/ui-registry-drift.md` | Design-Drift-Analyse |
| `docs/legal/*` | Alles behalten — rechtlich relevant |
| `docs/cantons/*` | Behalten — Schweizer Daten |
| `docs/data-model/*` | Behalten — Datenmodell-Referenz |
| `docs/security/*` | Alles behalten — Sicherheitsentscheidungen |

### KEEP — Architektur-Entscheidungen

| Pfad | Zweck |
|------|-------|
| `docs/architecture/ADR-009-storage-strategy.md` | ADR — dauerhaft |
| `docs/architecture/ADR-010-ocr-engine.md` | ADR — dauerhaft |
| `docs/architecture/ADR-011-auth-strategy.md` | ADR — dauerhaft |
| `docs/architecture/decision-records.md` | Entscheidungs-Index |
| `docs/architecture/definition-of-done.md` | Definition of Done |
| `docs/architecture/domain-mapping.md` | Domain-Mapping |

### ARCHIVE — Erledigte Vorbereitungen

| Pfad | Grund |
|------|-------|
| `docs/prep/DESIGN_CONSOLIDATION_MASTERPLAN.md` | Erledigt — Konsolidierung durchgeführt |
| `docs/prep/DESIGN_ASSET_CONSOLIDATION.md` | Erledigt |
| `docs/prep/DESIGN_LIFT_PLAN.md` | Erledigt / überholt |
| `docs/prep/DESIGN_MIGRATION_REPORT.md` | Erledigt |
| `docs/prep/DESIGN_VISION_GAP.md` | Wertvoll! Aber jetzt durch DESIGN_SELF_REFLECTION ersetzt — in Archiv mit Verweis |
| `docs/prep/CONSOLIDATION_MASTER_REPORT.md` | Erledigt |
| `docs/prep/IMPLEMENTATION_ORDER.md` | Überholt |
| `docs/prep/REPOSITORY_CLEANUP_PLAN.md` | Meta — selbstreferenziell |
| `docs/prep/REPOSITORY_REORGANIZATION.md` | Meta |
| `docs/prep/ICON_REVIEW.md` | Erledigt — Icons überarbeitet |
| `docs/prep/CLOSED_BETA_PREPARATION.md` | Überholt durch Beta-Reviews |
| `docs/prep/branding/*` | Erledigt — Branding entschieden |
| `docs/prep/accessibility-scan.txt` | Erledigt |
| `docs/prep/branding-legacy-audit.txt` | Erledigt |
| `docs/prep/docs-index.txt` | Meta |
| `docs/prep/persistence-risk-map.txt` | Veraltet |
| `docs/prep/src-index.txt` | Veraltet — Code hat sich geändert |

### ARCHIVE — Alte Roadmap-Dokumente

| Pfad | Grund |
|------|-------|
| `docs/roadmap/PHASE_1_MASTER.md` (1402 Z.) | Phase 1 erledigt |
| `docs/roadmap/PHASE_1_IMPLEMENTATION_SPEC.md` (1327 Z.) | Phase 1 erledigt |
| `docs/roadmap/PHASE_1_TASKS.md` (620 Z.) | Phase 1 erledigt |
| `docs/roadmap/PHASE_1_ROADMAP.md` (287 Z.) | Phase 1 erledigt |
| `docs/roadmap/PHASE_1_FULL_TICKETS.md` | Phase 1 erledigt |
| `docs/roadmap/PHASE_1_TICKET_TABLE.md` | Phase 1 erledigt |
| `docs/roadmap/PHASE_2_BLUEPRINT.md` (1728 Z.) | Zukunftsplanung, nicht aktuell |
| `docs/roadmap/SPRINT_PLAN.md` (423 Z.) | Veraltet |
| `docs/roadmap/CHAT_BACKLOG_CONSOLIDATED.md` (835 Z.) | Erledigt |
| `docs/roadmap/EXECUTIVE_DASHBOARD.md` (542 Z.) | Momentaufnahme, veraltet |
| `docs/roadmap/BACKLOG_MASTER.md` (478 Z.) | Überholt |

### ARCHIVE — Bereits im Archiv, aber überprüfen

| Pfad | Status |
|------|--------|
| `docs/archive/concepts/agents/*` (~20 Dateien) | Agent-Governance-Konzepte — theoretisch, nie implementiert. Archiv korrekt. |
| `docs/archive/concepts/runtime/*` (~12 Dateien) | Runtime-Konzepte — teilweise implementiert (EventBus, StateMachine). Archiv korrekt. |
| `docs/archive/concepts/spinnennetz/*` (4 Dateien) | Lebensnetze-Konzept — nie umgesetzt. Archiv korrekt. |
| `docs/archive/claude-handoffs/*` (~25 Dateien) | Alte Claude-Handoffs — historisch. Archiv korrekt. |
| `docs/archive/old-project/*` | Ur-Referenz. Behalten. |
| `docs/archive/phases/alpha/*` | Alpha-Phase. Archiv korrekt. |

### MERGE — Überlappende Produktdokumente

| Gruppe | Dateien | Empfehlung |
|--------|---------|------------|
| **Budget** | `budget-guidance.md` + `budget-light-v1.md` + `budget-recovery-scope.md` | Konsolidieren zu einem Budget-Dokument |
| **Household** | `household-model.md` + `household-model-minimal.md` + `household-dependencies.md` | Konsolidieren |
| **Backlog** | `backlog-registry.json` + `backlog-registry.yaml` + `backlog-canonicalization.md` | Eines behalten |
| **Missing scope** | `missing-scope-recovery.md` + `missing-scope-recovery.json` + `gap-priorities.md` + `foundation-blockers.md` | Konsolidieren |
| **Swiss social** | `swiss-social-support.md` + `social-protection-system.md` + `housing-and-benefits.md` + `employment-and-insurance.md` + `pension-and-retirement.md` | In Swiss Knowledge Registry integrieren |

---

## C. Empfohlene Ordnung nach Cleanup

```
/                          (Wurzel — max 10-12 .md-Dateien)
├── CLAUDE.md              (Arbeitsanweisungen)
├── README.md              (Projekt-Intro)
├── DEV_WORKFLOW.md        (Entwicklung)
├── DESIGN_SELF_REFLECTION.md  (NEU — aktuelle Reflexion)
├── DESIGN_RECOVERY_MASTERPLAN.md (NEU — Designrichtung)
│
├── docs/
│   ├── product/           (Registries + Produkt-Kern)
│   ├── design/            (Design-Audits + Analysen)
│   ├── architecture/      (ADRs + Entscheidungen)
│   ├── data-model/        (Datenstruktur)
│   ├── legal/             (Recht + Disclaimers)
│   ├── cantons/           (Kantondaten)
│   ├── security/          (Sicherheit)
│   ├── research/          (Nutzerforschung)
│   ├── sources/           (Datenquellen)
│   └── archive/           (Alles Erledigte)
│       ├── reviews/       (Alte Beta/Maloja/Life-Reviews)
│       ├── roadmap/       (Phase 1, Sprint-Pläne, Backlogs)
│       ├── prep/          (Vorbereitungsdokumente)
│       ├── concepts/      (Agent, Runtime, Spinnennetz)
│       ├── claude-handoffs/ (Alte Handoff-Dateien)
│       └── phases/        (Alpha-Feedback)
```

---

## D. Zusammenfassung

| Kategorie | Anzahl Dateien | Aktion |
|-----------|---------------|--------|
| KEEP (aktiv) | ~30 | Behalten, ggf. aktualisieren |
| MERGE | ~15 Gruppen | Zusammenführen in weniger Dateien |
| ARCHIVE | ~45 | In `docs/archive/` verschieben |
| DELETE CANDIDATE | 5 | Prüfen und entfernen |
| Bereits im Archiv | ~60 | Korrekt platziert |

**Gesamtvolumen aktuell:** ~160 Dokumente
**Gesamtvolumen nach Cleanup:** ~50 aktive Dokumente + Archiv

**Nächster Schritt:** Entscheidung, welche MERGE-Gruppen zuerst konsolidiert werden sollen.
