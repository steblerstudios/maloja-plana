# Incident Response

## Scope

Since Maloja Plana is local-first with no backend, "incidents" are primarily data corruption, loss, or unintended exposure on the user's device. There is no server to breach and no database to compromise.

## Incident Types

### 1. Data corruption on load

**Detection**: `validateData()` and `validateDocs()` run on every app load. Validation warnings are logged to browser console.

**Response**: Sanitized data is used (malformed entries filtered). Original localStorage is NOT overwritten by validation — only the in-memory representation is cleaned. The next auto-save cycle writes the sanitized version.

**Recovery**: Pre-migration snapshot exists at `or5_data_premigration` if a migration was the cause. User can also restore from IndexedDB rolling backups (up to 3, created every 12 hours).

### 2. Data loss (browser data cleared)

**Detection**: App loads with empty `or5_data`.

**Response**: Onboarding flow is shown (fresh start). If the user has an exported backup file, they can restore via the import flow.

**Recovery**: Import `.json` or `.maloja` backup file. Pre-restore snapshot is created before overwriting (even on empty data).

### 3. Failed backup restore

**Detection**: `applyBackup()` returns `{ success: false }`.

**Response**: Error message shown in UI. Pre-restore snapshot remains intact at `*_prerestore` keys.

**Recovery**: User can manually restore from pre-restore snapshot by clearing `or5_data` and renaming `or5_data_prerestore` to `or5_data` in browser console. Future: add a "revert last restore" button.

### 4. Failed migration

**Detection**: `migrateData()` catches exception, returns `{ error: 'migration_failed' }`.

**Response**: Original data is restored from `or5_data_premigration` snapshot. Console error logged. App continues with pre-migration data.

**Recovery**: Pre-migration snapshot is always created before any migration runs.

### 5. Encrypted backup — forgotten passphrase

**Detection**: User cannot decrypt their `.maloja` file.

**Response**: Decryption error shown ("wrong passphrase or corrupted file"). No recovery is possible — AES-256-GCM with PBKDF2 is intentionally irreversible without the passphrase.

**Prevention**: UI clearly states "there is no recovery" before encryption. Plaintext export is always available as an alternative.

### 6. Unintended data exposure

**Scenario**: User exports unencrypted JSON and shares it accidentally.

**Response**: The exported file contains all personal data including AHV number. The app warns: "The exported file contains personal data. Store it safely."

**Prevention**: Encrypted export is offered prominently. Future: warn before exporting if AHV or other sensitive fields are populated.

## Incident Response Process

For the current alpha phase:
1. User reports issue via feedback channel
2. Developer inspects browser console logs (user can share screenshot)
3. Fix is implemented on `dev` branch
4. Build verified, pushed to Vercel
5. User refreshes to get update

For future production:
1. Document incident in `docs/governance/audit-log.md`
2. Assess severity (data loss, data exposure, corruption)
3. Implement fix with pre-migration safety
4. Release with clear changelog
5. Notify affected users if data exposure occurred
