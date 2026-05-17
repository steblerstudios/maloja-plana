# A-005e — Runtime Event Shape Strategy

**Date:** 2026-05-17
**Type:** Architecture decision / Audit — no code changes
**Decision:** Getrennt lassen, später mit einem Unified Interface zusammenführen

---

## 1. Aktueller Event-Shape Status

### Interface A: `RuntimeEvent` (types.ts:28)

```ts
interface RuntimeEvent {
  id: string;           // required
  workflowId: string;   // required
  stepId: string;       // required
  type: string;         // ← Typ-Feld
  timestamp: string;    // required
  actor: string;        // required
  payload: Record<string, unknown>;  // required
}
```

**Genutzt von:** `RuntimeAuditLog` (audit-log.ts)
**Importiert in:** workflow-runtime.ts (Typ-Annotation)

### Interface B: `AuditEvent` (types.ts:38)

```ts
interface AuditEvent {
  id: string;           // required
  eventType: string;    // ← Typ-Feld (anderer Name!)
  timestamp: string;    // required
  actor: string;        // required
  workflowId: string;   // required
  evidence?: string[];  // optional
  metadata?: Record<string, unknown>;  // optional
}
```

**Genutzt von:** `RuntimeEventBus` (event-bus.ts), UI-Publisher (ZipExport, ChapterView, main.jsx)
**Extended by:** runtime-events.ts (WorkflowStartedEvent, StepCompletedEvent, etc.)

### Tatsächliche Nutzung — die Inkonsistenzen

| Publisher | Deklarierter Typ | Tatsächliches Feld | Passt zum Interface? |
|---|---|---|---|
| ZipExport.jsx | (untyped JS) | `eventType` | ✅ AuditEvent |
| ChapterView.jsx | (untyped JS) | `eventType` | ✅ AuditEvent |
| main.jsx | (untyped JS) | `eventType` | ✅ AuditEvent |
| workflow-runtime.ts | `RuntimeEvent` | `type` | ✅ RuntimeEvent, ❌ AuditEvent |
| execution-engine.ts | (untyped publish) | `type` | ❌ AuditEvent (EventBus erwartet AuditEvent) |
| runtime-events.ts | extends `AuditEvent` | `type` (!) | ⚠️ AuditEvent hat `eventType`, Extensions fügen `type` hinzu |

### Kernproblem

- **EventBus** ist auf `AuditEvent` typisiert (Feld `eventType`)
- **workflow-runtime.ts** publisht via privates `publish()` → EventBus mit Feld `type` statt `eventType`
- **runtime-events.ts** extended `AuditEvent` mit Feld `type` — das Basis-Interface hat aber `eventType`
- **RuntimeAuditLog** nutzt `RuntimeEvent` — komplett getrennt vom EventBus

Die Runtime-Core Events landen im EventBus mit `type` statt `eventType`. Das funktioniert zur Laufzeit (JS ignoriert das), aber `eventType` ist `undefined` auf diesen Events.

---

## 2. Positive Erkenntnisse

- **UI-Layer ist konsistent:** Alle 3 UI-Publisher nutzen `eventType` korrekt
- **Keine Crashes:** Weil JS loose-typed ist, bricht nichts
- **EventBus funktioniert:** Speichert und verteilt Events unabhängig vom Shape
- **Klare Trennung:** UI-Events und Runtime-Core-Events haben aktuell keine gemeinsamen Consumer
- **AuditEvent ist das bessere Interface:** Optionale Felder (evidence, metadata) statt required payload

---

## 3. Risiken

| Risiko | Schwere | Wann relevant |
|---|---|---|
| Consumer filtert auf `eventType` → Runtime-Core Events unsichtbar | Mittel | Sobald ein Consumer alle Events lesen will |
| runtime-events.ts extends AuditEvent + fügt `type` hinzu → zwei Typ-Felder | Niedrig | Bei TypeScript strict mode oder Schema-Validierung |
| RuntimeAuditLog und EventBus sind getrennte Stores | Niedrig | Aktuell kein Problem, wird es bei unified Audit |
| Neuer Entwickler nutzt falsches Feld | Niedrig | Bei Team-Wachstum |

---

## 4. Optionen

### Option A: Getrennt lassen (Status quo)

- **Pro:** Kein Aufwand, funktioniert aktuell
- **Con:** Risiko wächst mit jedem neuen Consumer
- **Wann sinnvoll:** Wenn Runtime-Core Events nie von UI konsumiert werden

### Option B: Später vereinheitlichen (1 Interface)

- **Pro:** Saubere Basis für spätere Architektur
- **Con:** Erfordert Entscheidung welches Interface gewinnt
- **Wann sinnvoll:** Vor dem ersten Cross-Layer Consumer

### Option C: Adapter an der Grenze

- **Pro:** Beide Interfaces bleiben, Mapping nur wo nötig
- **Con:** Komplexität, zusätzliche Abstraktionsschicht
- **Wann sinnvoll:** Wenn beide Interfaces aus guten Gründen verschieden bleiben müssen

---

## 5. Empfehlung

**Option B — Später vereinheitlichen, aber jetzt NICHT.**

Begründung:
- Aktuell gibt es keinen Cross-Layer Consumer
- UI-Publisher und Runtime-Core Publisher haben keine gemeinsamen Leser
- Ein Refactor jetzt wäre premature optimization

**Trigger für Vereinheitlichung:**
- Sobald ein Consumer Events aus beiden Layern lesen muss
- Sobald ein Dashboard/Audit-View alle Events anzeigen soll
- Sobald TypeScript strict mode aktiviert wird

**Wenn vereinheitlicht wird, dann:**
- `AuditEvent` als Basis (flexibler durch optionale Felder)
- Feld `eventType` gewinnt (beschreibender als `type`)
- `RuntimeEvent` wird deprecated oder zum Alias
- `runtime-events.ts` Extensions nutzen `eventType` statt `type`

---

## 6. Was aktuell NICHT getan werden sollte

- Interfaces zusammenführen
- Adapter bauen
- Runtime-Core Events umschreiben
- Event Registry einführen
- TypeScript strict mode erzwingen
- RuntimeAuditLog mit EventBus vereinen
