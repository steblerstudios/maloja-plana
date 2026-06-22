# Maloja Plana — Master Roadmap

> Stand: 2026-06-22

---

## Abgeschlossene Phasen

### Foundation (Phase 0–4, bis Mai 2026)
- Phase 0: i18n (DE/EN/FR/IT)
- Phase 1: Foundation (Datenmigration v1→v2, Auto-Backup, Hash-Routing)
- Phase 2: Visual Rebrand → "Maloja Plana"
- Phase 2.5: SVG Pictogram System (IconSystem.jsx, ~40 Icons)
- Phase 3: Accessibility (focus-visible, skip-link, ARIA, reduced-motion)
- Phase 4: Responsive Polish (375px+, auto-fit grids)

### Iteration 0 — Governance Basics (Mai 2026)
- ADRs, CI/CD, Build Budget
- P1-001: Unified State Machine
- P1-002: Subscribable EventBus + Runtime Singleton

### A-024 — Input Trust + Versicherungen (Mai 2026)
- fullName → firstName + lastName (Migration v1→v2)
- Phone-Ländercode-Prefix, PLZ-Validierung, Date-Reset Fix
- Hausrat, Reise, Cyber, Auto-Versicherungsfelder

### Execution Phase (Mai–Juni 2026)
| Ticket | Feature | Commit |
|---|---|---|
| E-01 | MirrorCards — Zusammenfassungen pro Kapitel | ✅ |
| E-02 | MVO — Minimum Viable Order | ✅ |
| E-03 | Notfall-Einstieg | ✅ |
| E-04 | Ankunftsmomente — emotionale Einstiege | ✅ |
| E-05 | Kapitelabschlüsse | ✅ |
| E-06 | Synthesen — kapitelübergreifende Auswertungen | ✅ |
| — | Prämien-Orientierung (BAG-Referenzprämien) | ✅ |
| — | Vorsorge-Rechner (AHV/BVG) | ✅ |
| — | EO-Rechner (Mutterschaft/Vaterschaft) | ✅ |
| — | Sozialhilfe-Rechner (SKOS) | ✅ |
| — | Steuerrechner (DBG Art. 36) | ✅ |
| — | Direkt-Links (Behörden) | ✅ |
| — | Lohn-Check (kantonaler Mindestlohn) | ✅ |
| — | Dashboard-Werkzeuge (12 Tools) | ✅ |
| — | Cross-Links (Versicherungen→IPV, Finanzen→Steuer) | ✅ |
| E-07 | Schweizer Design-Layer (Typografie, Schatten, Farbdramaturgie) | ✅ |
| E-08 | Schweizer Ikonographie (Icon-Grössen, Integration) | ✅ |

### B-Kandidaten — Domänen-Erweiterung (Juni 2026)
| Ticket | Feature |
|---|---|
| B1 | BVG/Freizügigkeit — Freizügigkeits-Tab |
| B2 | UVG/KTG — Orientierungstexte |
| B3 | Vorsorge/Nachlass — Testament, Patientenverfügung, Vorsorgeauftrag |

### C-Kandidaten — UX-Verbesserungen (Juni 2026)
| Ticket | Feature |
|---|---|
| C7 | Mindestlohn-Cross-Link (Ausbildung→Finanzen) |
| C8 | Fortschrittskarte — offene Felder navigierbar |
| C9 | Kontextuelle Links — offizielle Quellen bei Feldern |

### A-Kandidaten — Feedback-Kernprobleme (Juni 2026)
| Ticket | Feature |
|---|---|
| A1/A3 | «Deine Daten fliessen in» — Benefits pro Kapitel |
| A1/A3 | Live-Verbindungen «Deine Daten wirken bereits» im Dashboard |
| A2 | Trust-Kommunikation an 3 Stellen (Dashboard, Kapitel, Onboarding) |
| — | Demo-Person prominent im Dashboard-Hero |

### Technische Verbesserungen (Juni 2026)
- Token-Cleanup (fontWeight, fontSize, borderRadius, lineHeight, space, fontFamily, transitions)
- Offline-First: jsQR + jsPDF lokal vendored (CDN entfernt)
- nDSG-Compliance: Datenschutzerklärung, Speed Insights entfernt
- Farbdramaturgie: kapitelspezifische Accent-Farben

---

## Aktuell: E-09 — Beta mit echten Menschen

**Status:** Bereit für Tester-Einladung

**Was vorhanden ist:**
- Alle 12 Werkzeuge funktional
- Demo-Person (Maria Muster) prominent zugänglich
- Trust-Kommunikation an allen Berührungspunkten
- Feedback-Formular integriert
- BetaGate (Code: maloja2026)
- 4 Sprachen vollständig
- Mobile-safe (375px+)
- Offline-fähig

**Was für E-09 noch fehlt:**
- Deployment auf aktuellem Stand (Vercel)
- Tester-Einladungen versenden
- Known-Issues-Liste für Tester pflegen
- Feedback nach 1–2 Wochen auswerten

---

## Nächste Schritte (nach E-09)

### Kurzfristig — nach Beta-Feedback
| Thema | Beschreibung | Priorität |
|---|---|---|
| Beta-Feedback-Auswertung | Echte Nutzungsdaten sammeln und priorisieren | Hoch |
| Demo-Person erweitern | Ansatz 3: fiktive Person mit vollem Profil, klickbare Kapitel | Mittel |
| Integrationssprachen (RM) | Romanisch als 5. Sprache (Basis vorhanden) | Niedrig |

### Mittelfristig — Generatoren
| Generator | Output | Swiss-Specificity |
|---|---|---|
| Briefgeneratoren | PDF/DOCX | Behördenanschreiben, Formular-Format |
| Einsprachegeneratoren | PDF | Sozialhilfe, KK, Steuern |
| IPV-Anträge | PDF | Kantonal verschieden |
| Kündigungsschreiben | PDF | OR-konforme Fristen |
| Vorsorgeschreiben | PDF | ZGB-Referenzen |

### Mittelfristig — Export-Architektur
| Format | Zweck |
|---|---|
| PDF | Behördengänge, Archivierung |
| JSON | Maschinen-Austausch, Backup |
| CSV | Steuerberater, Budgetplanung |
| DOCX | Bearbeitbare Vorlagen |
| ZIP | Gesamtexport mit Manifest |

### Langfristig — Architektur
| Thema | Beschreibung |
|---|---|
| Household Model | SKOS-konforme Haushaltszusammensetzung (Erwachsene/Kinder getrennt) |
| Canton Rule Engine | Kantonale Regeln als deklaratives Schema |
| Derived State | Automatische Feldverknüpfung (AHV, KK-Franchise einmalig erfasst) |
| Template Engine | Deterministische Dokumentgenerierung |

---

## Bewusst zurückgestellt

| Thema | Grund |
|---|---|
| P1-003 bis P1-026 (Runtime Governance) | Produktrichtung geändert: Features-first, Governance später |
| P2 Workflow Engine | Abhängig von P1-Completion |
| Rollen & Multi-Account | Kein Backend — erst bei Bedarf |
| PWA / App Store | Erst nach stabiler Beta |
| AI-Assistenz | Deterministische Logik first, AI assists later |

---

## Bekannte Risiken

| Risiko | Schwere | Workaround |
|---|---|---|
| QR-CDN in OrganDonation | Mittel | jsQR lokal, aber CDN-QR-Generator noch vorhanden |
| ~80 Button-Unicode-Präfixe | Niedrig | Inkonsistent mit SVG-Icons, aber funktional |
| SKOS Household Bug | Mittel | `1 + dependents` statt differenzierte Zusammensetzung |
| BVG Double Deduction | Niedrig | Netto enthält BVG, App subtrahiert nochmals |
| Daten-Duplikation | Niedrig | Gleiche Felder in mehreren Kapiteln |
