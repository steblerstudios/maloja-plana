// ─── Data Versioning & Migration ────────────────────────────
// Safe, incremental schema migrations for or5_data.
// Each migration function transforms version N → N+1.
// Existing user data is never deleted — only wrapped or enriched.
//
// Migration safety:
//   1. Raw data is snapshot before migration (or5_data_premigration)
//   2. Migrations run sequentially: v0→v1→v2→...
//   3. Unknown versions are left untouched (no silent corruption)
//   4. Failures leave original data intact

export const CURRENT_DATA_VERSION = 1;

// ─── Migration functions ────────────────────────────────────
// Each takes a data object at version N and returns version N+1.
// NEVER delete fields — only add or restructure.

const migrations = {
  // v0 → v1: Wrap legacy flat data with version marker + metadata
  // Legacy format: { basis: {}, wohnen: {}, ... }
  // New format:    { _version: 1, _migratedAt: ISO, basis: {}, wohnen: {}, ... }
  0: (data) => {
    return {
      ...data,
      _version: 1,
      _migratedAt: new Date().toISOString(),
    };
  },

  // Future: v1 → v2 would go here
  // 1: (data) => { ... return { ...data, _version: 2 }; }
};

/**
 * Detect the version of a data object.
 * - Has _version field → use it
 * - Has chapter keys but no _version → version 0 (legacy)
 * - Empty object → version 0 (fresh install)
 */
export function detectVersion(data) {
  if (data && typeof data._version === 'number') {
    return data._version;
  }
  return 0; // legacy or empty
}

/**
 * Run all necessary migrations to bring data to CURRENT_DATA_VERSION.
 * Returns { data, migrated, fromVersion, toVersion, error }.
 *
 * Safety: if anything fails, returns original data + error message.
 */
export function migrateData(rawData) {
  const input = rawData || {};
  const fromVersion = detectVersion(input);
  let current = input;
  let version = fromVersion;

  // Already current — no migration needed
  if (version >= CURRENT_DATA_VERSION) {
    return { data: current, migrated: false, fromVersion, toVersion: version, error: null };
  }

  // Snapshot pre-migration data for safety
  try {
    const snapshot = JSON.stringify(input);
    localStorage.setItem('or5_data_premigration', snapshot);
  } catch (e) {
    // If we can't even snapshot, don't risk migration
    console.error('[migration] Cannot create safety snapshot:', e.message);
    return { data: input, migrated: false, fromVersion, toVersion: version, error: 'snapshot_failed' };
  }

  // Run migrations sequentially
  try {
    while (version < CURRENT_DATA_VERSION) {
      const migrationFn = migrations[version];
      if (!migrationFn) {
        console.error('[migration] No migration found for version', version);
        return { data: input, migrated: false, fromVersion, toVersion: version, error: 'missing_migration_v' + version };
      }

      current = migrationFn(current);
      version = current._version;

      console.info('[migration] Migrated v' + (version - 1) + ' → v' + version);
    }
  } catch (e) {
    console.error('[migration] Migration failed:', e.message);
    // Restore from snapshot
    try {
      const restored = JSON.parse(localStorage.getItem('or5_data_premigration'));
      return { data: restored, migrated: false, fromVersion, toVersion: fromVersion, error: 'migration_failed' };
    } catch {
      return { data: input, migrated: false, fromVersion, toVersion: fromVersion, error: 'migration_failed' };
    }
  }

  return { data: current, migrated: true, fromVersion, toVersion: version, error: null };
}

/**
 * Strip internal metadata from data before passing to components.
 * Components should never see _version, _migratedAt, etc.
 * Returns the chapter data without metadata keys.
 */
export function getChapterData(data, chapterKey) {
  return (data && data[chapterKey]) || {};
}

/**
 * Check if a pre-migration backup exists.
 * Useful for a future "restore previous version" feature.
 */
export function hasPreMigrationBackup() {
  return localStorage.getItem('or5_data_premigration') !== null;
}
