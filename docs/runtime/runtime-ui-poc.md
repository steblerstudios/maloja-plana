# Runtime ↔ UI Proof of Concept

> Stand: 2026-05-17 | Tickets: A-004a bis A-004e

## Status

Die Runtime ↔ UI Verbindung existiert als lokales Experiment in einer einzigen Komponente (`ZipExport`). Es gibt keine globale Runtime-Integration.

## Aktuelle Verbindungen

### UI → Runtime (A-004c)

`ZipExport` publisht ein `BACKUP_EXPORTED` Event an den `runtimeEventBus` Singleton nach einem erfolgreichen Plaintext-Backup-Export.

```
runtimeEventBus.publish({ eventType: 'BACKUP_EXPORTED', ... })
```

### Runtime → UI Read (A-004d)

`ZipExport` liest synchron alle bisherigen Events via `runtimeEventBus.getEvents()` und zählt `BACKUP_EXPORTED` Events. Der Initialwert wird als `useState`-Initializer berechnet.

### Runtime → UI Subscription (A-004e)

`ZipExport` subscribt sich lokal per `useEffect` auf neue `BACKUP_EXPORTED` Events. Der Session-Backup-Zähler aktualisiert sich live. Cleanup via `unsubscribe` im Effect-Return.

## Architektur-Entscheidungen

### Validiert

- `RuntimeEventBus` Singleton funktioniert als zentraler Event-Kanal
- `publish` / `subscribe` / `unsubscribe` / `getEvents` API ist ausreichend
- Lokale Subscriptions in einzelnen Komponenten sind machbar ohne globalen State
- `useEffect` + `unsubscribe` Cleanup funktioniert korrekt

### Bewusst NICHT implementiert

| Thema | Grund |
|-------|-------|
| React Context | Noch kein Bedarf — nur eine Komponente nutzt Runtime |
| `useRuntime` Hook | Zu früh — Pattern noch nicht validiert über mehrere Komponenten |
| Globale RuntimeBridge | Architekturentscheidung vertagt bis mehr Komponenten Runtime nutzen |
| State-Management-Library | Nicht nötig für lokale Subscriptions |
| Bidirektionale Synchronisation | Aktuell nur unidirektionale Flows (UI→Runtime publish, Runtime→UI subscribe) |
| Runtime-driven UI | UI bleibt eigenständig, Runtime ist optional |
| Persistence | EventBus hält Events nur im Memory (Session-Scope) |

### Bewusst vertagt

- Ob React Context oder ein anderer Mechanismus für mehrere Komponenten nötig wird
- Ob Events persistiert werden sollen (IndexedDB)
- Ob Runtime-State die UI steuern soll (Runtime-driven) oder nur informiert (Runtime-aware)
- Wie weitere Komponenten angebunden werden

## Grenzen

- Events leben nur in der aktuellen Browser-Session (kein Persist)
- Kein Replay bei Page Reload
- Nur `ZipExport` ist angebunden — kein Beweis dass das Pattern skaliert
- Kein Error-Handling bei fehlgeschlagenen Subscriptions
- Kein Debouncing oder Batching bei vielen Events

## Betroffene Dateien

| Datei | Rolle |
|-------|-------|
| `src/runtime/events/event-bus.ts` | EventBus Implementation |
| `src/runtime/singleton.ts` | Singleton-Export |
| `src/runtime/types.ts` | `AuditEvent` Type |
| `src/ZipExport.jsx` | Einzige UI-Komponente mit Runtime-Verbindung |

## Nächste mögliche kleine Schritte

1. Zweite Komponente anbinden (z.B. Dashboard zeigt letzten Backup-Zeitpunkt)
2. Weiteres Event publishen (z.B. `BACKUP_IMPORTED`)
3. Erst wenn mehrere Komponenten angebunden sind: Pattern für geteilten Zugriff evaluieren
