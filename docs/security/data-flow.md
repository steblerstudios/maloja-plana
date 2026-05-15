# Data Flow

How data moves through Maloja Plana. All flows are local — no data leaves the device.

## Storage Locations

| Store | Type | Key/Name | Content |
|-------|------|----------|---------|
| localStorage | JSON | `or5_data` | All chapter data (basis, wohnen, finanzen, etc.) |
| localStorage | JSON | `or5_docs` | Document metadata array |
| localStorage | JSON | `or5_reminders` | Calendar reminders array |
| localStorage | JSON | `or5_contacts` | Contacts array (future, Phase 7) |
| localStorage | string | `or5_theme` | Dark/light mode preference |
| localStorage | string | `or5_lang` | Selected language code |
| localStorage | string | `or5_onboarding_done` | Onboarding completion flag |
| localStorage | string | `or5_last_backup` | Last auto-backup timestamp |
| localStorage | JSON | `or5_data_premigration` | Safety snapshot before data migration |
| localStorage | JSON | `or5_data_prerestore` | Safety snapshot before backup restore |
| IndexedDB | binary/JSON | `ordnung-ruhe-documents` | Uploaded document files |
| IndexedDB | JSON | `ordnung-ruhe-backups` | Rolling auto-backup snapshots (max 3) |

## Data Lifecycle

### Write path
1. User edits a field in any chapter view
2. `updateData()` in main.jsx updates React state
3. Every 5 seconds, auto-save interval writes `or5_data` and `or5_docs` to localStorage
4. `AutoSaveStatus` component shows save confirmation via aria-live region

### Read path
1. On app load, `or5_data` is read from localStorage
2. `migrateData()` runs sequential version migrations if needed
3. `validateData()` checks shape integrity, logs warnings, returns sanitized data
4. React state is initialized with the validated data
5. Components receive data via props

### Backup path
1. On app mount, `createBackup()` runs if 12+ hours since last backup
2. Current `or5_data`, `or5_docs`, `or5_reminders` are snapshot to IndexedDB
3. Old backups beyond 3 are pruned
4. Timestamp stored in `or5_last_backup`

### Export path (plaintext)
1. User clicks export in ZipExport view
2. `collectBackupData()` reads all `or5_*` localStorage keys
3. JSON string is generated client-side
4. Browser download dialog is triggered via Blob URL
5. No network calls

### Export path (encrypted)
1. User enters passphrase (min 4 characters, confirmed twice)
2. `exportEncrypted()` collects data, serializes to JSON
3. PBKDF2 derives key from passphrase + random salt (100k iterations)
4. AES-256-GCM encrypts the JSON with random IV
5. Packed binary: magic header + salt + IV + ciphertext
6. Browser download as `.maloja` file
7. Passphrase exists only in memory during encryption — never stored

### Import/restore path
1. User selects `.json` or `.maloja` file
2. File type auto-detected (magic header check)
3. If encrypted: user enters passphrase, PBKDF2 + AES-GCM decryption
4. `validateBackupPayload()` checks structure, reports warnings
5. `window.confirm()` gate before any data is written
6. `createPreRestoreSnapshot()` saves current data to `*_prerestore` keys
7. `applyBackup()` writes restored data to localStorage
8. Page reloads to clean state

## Network Calls

The app makes ZERO network calls during normal operation.

Exceptions:
- Initial page load (Vercel serves static files)
- QR code generation loads `qrcodejs` from cdnjs.cloudflare.com (known risk, to be vendored in Phase 15)

No data is ever transmitted to any server. No analytics. No telemetry.
