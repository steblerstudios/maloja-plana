# Migration Policy

## Principle

User data is sacred. Every data format change must be migrated safely, automatically, and reversibly.

## Rules

### 1. Pre-migration snapshot is mandatory
Before any migration runs, the current `or5_data` is copied to `or5_data_premigration`. This happens before the first migration function executes.

### 2. Migrations are sequential
Each migration handles exactly one version step: `v1 → v2`, `v2 → v3`, etc. They run in order. Skipping versions is not allowed.

### 3. Migrations are pure functions
A migration takes data at version N and returns data at version N+1. No side effects, no localStorage reads/writes inside the migration, no network calls.

### 4. Failed migrations restore from snapshot
If any migration throws an exception, the original data is restored from `or5_data_premigration`. The app continues with pre-migration data. An error is logged to console.

### 5. Migrations never delete user data
A migration may reshape, rename, or restructure data. It must never remove data that existed in the previous version. Deprecated fields are moved to a `_legacy` namespace if they can't be mapped to new fields.

### 6. Each migration is tested with sample data
Before release, each migration is tested with:
- Minimal valid data at version N
- Maximal data (all fields populated)
- Edge cases (empty strings, zero values, null)

### 7. Version number only increments forward
`CURRENT_DATA_VERSION` is a monotonically increasing integer. It never decreases, and the same version number is never reused.

## Migration Format

```javascript
function migrateV1toV2(data) {
  // data is guaranteed to be at version 1
  const migrated = { ...data };
  // ... transform ...
  migrated.__version = 2;
  return migrated;
}
```

## Current State

*Nachgetragen 22.09.2026: diese Tabelle stand bei `1`, während der Code bereits bei `4` war —
die beiden Zeilen unter „Future Migrations" (v2, v3) waren längst gebaut. Gegen
`src/utils/dataMigration.js` gelegt und berichtigt.*

| Data Version | Changes |
|-------------|---------|
| 1 | Legacy-Daten mit `_version` + Metadaten umhüllt |
| 2 | `basis.fullName` → `firstName` + `lastName` |
| 3 | `basis.household` (adults, children, isRetired) aus `dependents` abgeleitet |
| 4 | `behoerden.taxFillingDeadline` → `taxFilingDeadline` (Tippfehler) |
| 5 | `vorgaenge: []` — leeres Feld für Vorgänge (O12). Deutet nichts aus Altdaten |

## Future Migrations (Planned)

*Keine geplanten. Eine neue Fassung entsteht, wenn ein echter Feldwechsel sie verlangt —
nicht auf Vorrat.*

## Recovery Procedures

### Automatic recovery
If migration fails, `or5_data_premigration` is automatically restored. User sees no data loss.

### Manual recovery
If automatic recovery fails (edge case):
1. Open browser console
2. Check `localStorage.getItem('or5_data_premigration')`
3. If valid: `localStorage.setItem('or5_data', localStorage.getItem('or5_data_premigration'))`
4. Reload page
