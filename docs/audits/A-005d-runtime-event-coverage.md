# A-005d — Runtime Event Coverage

**Date:** 2026-05-17
**Type:** Documentation / Governance — no code changes

---

## 1. Aktueller Runtime Event Status

### UI-Layer Events (via `runtimeEventBus` Singleton)

| Event | Publisher | Actor | WorkflowId | Trigger |
|---|---|---|---|---|
| `BACKUP_EXPORTED` | ZipExport.jsx:55 | user | backup | Nach erfolgreichem Plaintext-/Encrypted-Export |
| `DOCUMENT_UPLOADED` | ChapterView.jsx:329 | user | document-tresor | Nach erfolgreichem FileReader + onAddDocument |
| `DATA_PERSISTED` | main.jsx:182 | system | auto-save | Auto-Save Interval, nur bei tatsächlicher Datenänderung |

### Runtime-Core Events (via WorkflowRuntime / ExecutionEngine)

| Event | Publisher | Actor | Trigger |
|---|---|---|---|
| `WORKFLOW_REGISTERED` | workflow-runtime.ts:17 | system | registerWorkflow() |
| `WORKFLOW_STATE_CHANGED` | workflow-runtime.ts:34 | system | updateState() |
| `WORKFLOW_STARTED` | runtime-execution-engine.ts:14 | system | start() |
| `STEP_COMPLETED` | runtime-execution-engine.ts:28 | system/param | completeStep() |

### Consumers

| Consumer | Datei | Liest | Subscribes |
|---|---|---|---|
| sessionBackupCount | ZipExport.jsx:172 | getEvents() filter | subscribe() auf BACKUP_EXPORTED |

**1 Consumer für 6 Event-Typen.** Alle anderen Events werden aktuell nur in den AuditLog geschrieben (fire-and-forget).

---

## 2. Positive Erkenntnisse

- **Konsistentes Publish-Pattern:** UI-Events folgen dem gleichen Shape (id, eventType, timestamp, actor, workflowId)
- **Fire-and-forget:** Publish blockiert keine Business-Logik
- **Change-Detection:** DATA_PERSISTED vermeidet Event-Spam via useRef-Vergleich
- **Klare Actor-Trennung:** user vs. system
- **Additive Integration:** Bestehender Code funktioniert unverändert ohne Runtime

---

## 3. Risiken / Technische Schulden

### Zwei Event-Interfaces (bekannt, akzeptiert)

- `RuntimeEvent` (types.ts:28): Feld `type`, alle Felder required
- `AuditEvent` (types.ts:38): Feld `eventType`, evidence/metadata optional
- UI-Layer publisht `AuditEvent`-Shape, Runtime-Core publisht `RuntimeEvent`-Shape
- EventBus akzeptiert beides (kein Typcheck zur Laufzeit)
- **Risiko:** Semantic drift zwischen den beiden Shapes
- **Akzeptiert:** Zusammenführung erst wenn globale Runtime-Architektur entsteht

### Event-Sprawl (Potentiell)

- 6 Event-Typen bei 3 Publishern — aktuell gesund
- Risiko steigt wenn jede Komponente eigene Events definiert
- **Grenze:** Nicht mehr als ~12 UI-Events ohne Event-Katalog

### Fehlende Validierung

- Kein Schema-Check bei publish() — Events können beliebige Shape haben
- Akzeptabel im Singleton-Ansatz, wird Risiko bei globaler Architektur

---

## 4. Dinge die bewusst noch fehlen

- Event Registry / Katalog (enum oder const map)
- Event-Schema-Validierung
- Unified Event Interface (RuntimeEvent + AuditEvent zusammenführen)
- Event Replay / Persistence
- Event-basierte UI-Reaktivität (ausser ZipExport)
- Cross-Component Event Subscriptions
- Agent-Integration als Event-Consumer
- Error Events (kein BACKUP_FAILED, UPLOAD_FAILED etc.)

---

## 5. Kleine sichere nächste Schritte

1. **Event-Typen als Konstanten** — `RUNTIME_EVENTS.BACKUP_EXPORTED` statt String-Literals (verhindert Typos)
2. **Weitere Business-Events** — z.B. DOCUMENT_DELETED, REMINDER_CREATED (gleiches Pattern)
3. **Dashboard Event-Counter** — sessionBackupCount-Pattern auf weitere Events erweitern
4. **Event Interface Audit** — RuntimeEvent vs. AuditEvent Shape-Diskrepanz klären (ADR)

---

## 6. Was aktuell NICHT getan werden sollte

- Event Registry / Enum-System bauen
- RuntimeEvent + AuditEvent zusammenführen
- Event-Schema-Validierung einführen
- Event Persistence / Replay bauen
- Agenten als Event-Consumer implementieren
- Globale Event-Subscriptions einführen
- Error-Events systematisch hinzufügen
