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

export const CURRENT_DATA_VERSION = 4;

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

  // v1 → v2: Split fullName into firstName + lastName
  1: (data) => {
    const basis = data.basis || {};
    if (basis.fullName && !basis.firstName && !basis.lastName) {
      const parts = basis.fullName.trim().split(/\s+/);
      basis.firstName = parts[0] || '';
      basis.lastName = parts.slice(1).join(' ') || '';
    }
    return { ...data, basis, _version: 2, _migratedAt: new Date().toISOString() };
  },

  // v2 → v3: Add minimal household model (adults, children with age, isRetired)
  // Derives from existing dependents field. dependents is kept for backward compat.
  2: (data) => {
    const basis = { ...(data.basis || {}) };
    const finanzen = data.finanzen || {};
    const dependents = Math.min(Number(basis.dependents || 0), 10);

    // Build children array from dependents count (age unknown = 0)
    const children = [];
    for (let i = 0; i < dependents; i++) {
      children.push({ age: 0 });
    }

    // Derive isRetired from employmentType if available
    const isRetired = finanzen.employmentType === 'retired';

    basis.household = {
      adults: 1,
      children,
      isRetired,
    };

    return { ...data, basis, _version: 3, _migratedAt: new Date().toISOString() };
  },

  // v3 → v4: Rename taxFillingDeadline → taxFilingDeadline (typo fix)
  3: (data) => {
    const behoerden = { ...(data.behoerden || {}) };
    if (behoerden.taxFillingDeadline !== undefined) {
      behoerden.taxFilingDeadline = behoerden.taxFillingDeadline;
      delete behoerden.taxFillingDeadline;
    }
    return { ...data, behoerden, _version: 4, _migratedAt: new Date().toISOString() };
  },
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
