# A-033 — Backlog Canonicalization

> Analyse und Empfehlung: Welches Backlog-System ist kanonisch?
>
> Stand: 2026-05-27

---

## 1. Bestandsaufnahme: Drei Backlog-Systeme

### System A: `docs/product/product-inventory.md` + `backlog-registry.json` + `backlog-registry.yaml`
| Eigenschaft | Wert |
|-------------|------|
| **Erstellt:** | 2026-05-26 (A-029) |
| **ID-Schema:** | `MP-{DOMAIN}-{NNN}` (z.B. MP-GEN-001, MP-BUD-003) |
| **Einträge (Markdown):** | ~260 (inkl. Bugs, Risiken, Entscheidungen) |
| **Einträge (JSON):** | 48 (Teilmenge — nur wichtigste) |
| **Einträge (YAML):** | ~90 (Teilmenge) |
| **Formate:** | Markdown (lesbar) + JSON (maschinenlesbar) + YAML (kompakt) |
| **Abdeckung:** | 23 Domänen, vollständig |
| **Felder pro Eintrag (JSON):** | id, title, domain, type, status, priority, phase, description, user_value, complexity, risk, dependencies, related_chapters, data_sensitivity, swiss_specificity, requires_canton_logic, requires_external_interface, requires_ai, export_required, notes |
| **Stärken:** | Reichstes Schema, maschinenlesbar, domain-orientiert, Swiss-spezifische Felder |
| **Schwächen:** | JSON nur 48 von 260+ Einträgen, YAML nur 90 — inkonsistente Abdeckung |

### System B: `docs/roadmap/BACKLOG_MASTER.md`
| Eigenschaft | Wert |
|-------------|------|
| **Erstellt:** | 2026-05-17 |
| **ID-Schema:** | `{PREFIX}-{NNN}` (z.B. BUD-001, DOC-002, P1-003, SEC-007) |
| **Einträge:** | ~160 |
| **Formate:** | Nur Markdown |
| **Abdeckung:** | 14 Domänen + Agent-Zuweisungsmatrix + API-Endpoints |
| **Felder pro Eintrag:** | ID, Titel, Typ, Module/Agent, Dependencies, Priorität, Status, Hinweise |
| **Stärken:** | Agent-Zuweisungen, API-Endpoint-Planung, Phase 1/2 detailliert |
| **Schwächen:** | Kein maschinenlesbares Format, andere ID-Schema, enthält Backend-Planung die aktuell irrelevant ist |

### System C: `docs/roadmap/CHAT_BACKLOG_CONSOLIDATED.md`
| Eigenschaft | Wert |
|-------------|------|
| **Erstellt:** | 2026-05-17 |
| **ID-Schema:** | `T{NNN}` (z.B. T001, T005, T035) |
| **Einträge:** | ~80+ |
| **Formate:** | Nur Markdown |
| **Abdeckung:** | 18 Kategorien, aus Chat-Transkripten extrahiert |
| **Felder pro Eintrag:** | Kategorie, Dependencies, Priorität, Status, Quelle, Hinweis, Betroffene Datei |
| **Stärken:** | Source-Tracking (welcher Chat, welches Issue), Code-Referenzen |
| **Schwächen:** | Drittes ID-Schema, Snapshot von 2026-05-17, nicht aktualisiert |

---

## 2. ID-Konflikte

Die drei Systeme verwenden drei verschiedene ID-Schemata für dieselben Features:

| Feature | System A | System B | System C |
|---------|----------|----------|----------|
| Budget Tracking | MP-BUD-001 | BUD-001 | T029 |
| Schulden-Integration | MP-BUD-002 | BUD-002 | T030 |
| SKOS Household Bug | MP-BUG-001 | — | T001 |
| Hardcoded German | MP-BUG-002 | — | T002 |
| QR-Code CDN | MP-BUG-003 | — | T003 |
| Event Bus | MP-P1-001 | P1-001 | — |
| State Machine | MP-P1-002 | P1-002 | — |
| Household Model | MP-HH-001 | — | T035 |
| Template Engine | MP-GEN-016 | — | — |
| Impressum | MP-LEG-001 | LEG-001 | — |

**Ergebnis:** Kein System referenziert die IDs der anderen. Cross-Referenzen sind unmöglich.

---

## 3. Abdeckungsvergleich

| Domäne | System A (MP-*) | System B (misc) | System C (T*) |
|--------|----------------|-----------------|---------------|
| Generatoren | 18 | 0 | 2 |
| Sozialversicherungen | 16 | 0 | 5 |
| Vorsorge & Notfall | 13 | 0 | 3 |
| Versicherungen | 15 | 0 | 4 |
| Steuerlogik | 7 | 0 | 2 |
| Behördenlogik | 8 | 0 | 1 |
| Haushaltslogik | 9 | 0 | 3 |
| Budget & Finanzen | 10 | 7 | 5 |
| Dokumente & Tresor | 9 | 7 | 3 |
| Export & Import | 12 | 5+ | 2 |
| Erinnerungen | 9 | 0 | 2 |
| UX & Accessibility | 25 | 24 | 8 |
| Sicherheit | 12 | 13 | 3 |
| Legal & Compliance | 8 | 9 | 2 |
| Phase 1 Governance | 26 | 26 | 0 |
| Phase 2 Workflow | 25 | 31 | 0 |
| Rollen | 6 | 6 | 2 |
| AI & Agents | 9 | 0+ | 0 |
| Infrastruktur | 8 | 10 | 3 |
| API Endpoints | 0 | 12 | 0 |
| Agent-Zuweisungen | 0 | 14 Agenten | 0 |

**System A** hat die breiteste Domänenabdeckung (besonders: Generatoren, Sozialversicherungen, Swiss Knowledge).
**System B** hat die tiefste Phase 1/2 Planung und Agent-Architektur.
**System C** hat die besten Source-Referenzen (welcher Chat, welcher Commit).

---

## 4. Aktualitätsvergleich

| System | Letztes Update | Aktualität |
|--------|---------------|------------|
| A (product-inventory) | 2026-05-26 | **Aktuell** |
| A (backlog-registry.json) | 2026-05-26 | **Aktuell** (aber nur 48 Einträge) |
| B (BACKLOG_MASTER) | 2026-05-17 | **9 Tage veraltet** |
| C (CHAT_BACKLOG) | 2026-05-17 | **10 Tage veraltet** |

---

## 5. Empfehlung

### Kanonische Quelle: System A — `product-inventory.md` + `backlog-registry.json`

**Begründung:**
1. **Aktuellste Quelle** (2026-05-26)
2. **Breiteste Abdeckung** (260+ Einträge, 23 Domänen)
3. **Maschinenlesbares Format** (JSON mit reichem Schema)
4. **Swiss-spezifische Felder** (requires_canton_logic, swiss_specificity)
5. **Einheitliches ID-Schema** (MP-{DOMAIN}-{NNN})
6. **Lesbare Markdown-Version** (product-inventory.md)

### Migration

| Aktion | Priorität | Aufwand |
|--------|-----------|---------|
| `product-inventory.md` als Referenz-Markdown definieren | Sofort | Keiner |
| `backlog-registry.json` auf alle 260+ Einträge erweitern | Hoch | 2-3h |
| `backlog-registry.yaml` synchronisieren oder entfernen | Mittel | 1h |
| `BACKLOG_MASTER.md` → Archiv verschieben | Mittel | Minimal |
| `CHAT_BACKLOG_CONSOLIDATED.md` → Archiv verschieben | Mittel | Minimal |
| Phase 1/2 Tickets aus System B in System A migrieren | Hoch | 1-2h |
| Agent-Zuweisungen separat dokumentieren (nicht im Backlog) | Niedrig | — |
| API Endpoints separat dokumentieren (nicht im Backlog) | Niedrig | — |

### Was aus System B übernommen werden muss

Bevor BACKLOG_MASTER.md archiviert wird, müssen folgende Inhalte in System A überführt werden:

1. **Phase 1 Tickets (P1-001 bis P1-026):** Bereits als MP-P1-001 bis MP-P1-026 in System A vorhanden.
2. **Phase 2 Tickets (P2-001 bis P2-031):** Noch nicht vollständig in backlog-registry.json.
3. **API Endpoints:** In eigenes Dokument auslagern (`docs/architecture/api-endpoints.md`).
4. **Agent-Zuweisungen:** Bleiben in `docs/agents/AGENT_ARCHITECTURE.md`.
5. **Convenience-Items (CONV-001 bis CONV-009):** In System A als MP-*-IDs aufnehmen.

### Was aus System C übernommen werden muss

Bevor CHAT_BACKLOG archiviert wird:

1. **Source-Referenzen:** Chat-Session-IDs und Commit-Referenzen in relevante System-A-Einträge übernehmen (als `evidence`-Feld im JSON).
2. **Code-Referenzen:** Betroffene Dateien in System-A-Einträge übernehmen.
3. **Rest:** Bereits durch System A abgedeckt.

---

## 6. Sofort-Regeln für neue Backlog-Einträge

Ab sofort gilt:

1. **Jeder neue Backlog-Eintrag** bekommt eine `MP-{DOMAIN}-{NNN}` ID
2. **Einzige Quelle:** `docs/product/product-inventory.md` (Markdown) + `backlog-registry.json` (JSON)
3. **backlog-registry.yaml** wird synchron gehalten oder entfernt
4. **Keine neuen Einträge** in BACKLOG_MASTER.md oder CHAT_BACKLOG
5. **Cross-Referenz-Tabelle** wird in diesem Dokument gepflegt (bei Bedarf)

---

*Dokument: backlog-canonicalization.md v1.0.0*
*Erstellt: 2026-05-27 (A-033)*
