# A-005a — Runtime Context Readiness Audit

**Date:** 2026-05-17
**Type:** Architecture audit — no code changes
**Decision:** RuntimeContext jetzt NICHT bauen

---

## Ist-Zustand

- 18 UI-Komponenten (.jsx)
- 1 davon nutzt Runtime: `ZipExport.jsx` (publish + subscribe + read via Singleton-Import)
- 17 Komponenten arbeiten rein über Props aus `main.jsx`
- Datenhaltung: `main.jsx` useState + localStorage (or5_* keys)

## Aktueller Runtime-Zugriff (akzeptierter Ansatz)

Direkter Singleton-Import pro Komponente:

```js
import { runtimeEventBus } from './runtime/singleton.ts';
```

- publish: `runtimeEventBus.publish({ ... })`
- read: `runtimeEventBus.getEvents()`
- subscribe: `runtimeEventBus.subscribe(listener)` + Cleanup in useEffect

Validiert in `ZipExport.jsx` — funktioniert, ist testbar, isoliert, revertierbar.

## Analyse: Runtime-Bedarf pro Komponente

| Komponente | publish | read | subscribe | Priorität |
|---|---|---|---|---|
| ZipExport | ✅ | ✅ | ✅ | Done |
| DocumentTresor | Kandidat | — | — | Nächstes |
| main.jsx (Auto-Save) | Kandidat | — | — | Niedrig |
| SchuldenManager | Kandidat | — | — | Niedrig |
| Alle anderen (14) | — | — | — | Kein Bedarf |

## Risiken eines globalen RuntimeContext jetzt

- **Overengineering:** Context für 1 Consumer
- **Re-Render-Kaskaden:** Jeder Event triggert alle Context-Consumer
- **Architektur-Lock-in:** Bevor klar ist, was Komponenten wirklich brauchen
- **Zwei State-Systeme:** main.jsx useState vs. RuntimeContext — Verwirrung
- **Migrations-Druck:** Bestehende Props-Architektur vorzeitig aufbrechen

## Entscheidung

**Singleton-Import bleibt der akzeptierte Minimalansatz.**

Weitere Komponenten können denselben direkten Import nutzen. Kein globaler Context, kein Provider, kein useRuntime Hook.

## Kriterien für späteren RuntimeContext

Context wird sinnvoll wenn:

1. **5+ Komponenten** subscribe auf Runtime-Events brauchen
2. **Runtime-State UI-Rendering treibt** (nicht nur Events loggt)
3. **Mehrere Komponenten** auf denselben Runtime-State reagieren müssen
4. **Prop-Drilling** für Runtime-Daten entsteht

Bis dahin: Singleton-Import pro Komponente, wie in ZipExport validiert.

## Nächste Tickets (Vorschläge)

- **A-005b:** DocumentTresor publish bei Dokument-Upload (DOCUMENT_UPLOADED)
- **A-005c:** main.jsx publish bei Auto-Save (DATA_PERSISTED)
- **A-005d:** Dashboard sessionBackupCount aus EventBus (read)

Jeweils: 1 Datei, 1 Import, ~5 Zeilen, direkt revertierbar.
