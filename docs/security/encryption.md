# Encryption

## Overview

Maloja Plana uses browser-native encryption (Web Crypto API) to protect exported backups. No external cryptographic libraries are used.

## Algorithm

| Parameter | Value |
|-----------|-------|
| Cipher | AES-256-GCM |
| Key derivation | PBKDF2 |
| Hash function | SHA-256 |
| Iterations | 100,000 |
| Salt | 16 bytes, random per export |
| IV | 12 bytes, random per export |
| Authentication | GCM provides authenticated encryption |

## Encrypted Backup Format

```
┌──────────────────────────────────────────────┐
│ Magic header: "MALOJA_PLANA_BACKUP_V1" (22B) │
│ Salt (16 bytes)                              │
│ IV (12 bytes)                                │
│ Ciphertext (AES-256-GCM encrypted JSON)      │
│   └─ includes GCM authentication tag         │
└──────────────────────────────────────────────┘
```

File extension: `.maloja`

## Key Derivation

1. User enters passphrase (minimum 4 characters, confirmed twice)
2. PBKDF2 derives a 256-bit key from passphrase + random salt
3. Key exists only in memory during encryption/decryption
4. Key is never stored, logged, or transmitted

## Encryption Flow

1. `collectBackupData()` reads all `or5_*` localStorage keys
2. Data serialized to JSON string
3. Random salt (16 bytes) generated via `crypto.getRandomValues()`
4. Random IV (12 bytes) generated via `crypto.getRandomValues()`
5. PBKDF2 derives encryption key from passphrase + salt
6. AES-256-GCM encrypts JSON with key + IV
7. Binary packed: magic header + salt + IV + ciphertext
8. Browser download triggered via Blob URL

## Decryption Flow

1. File loaded as ArrayBuffer
2. Magic header verified (auto-detects encrypted vs plaintext)
3. Salt and IV extracted from fixed offsets
4. User enters passphrase
5. PBKDF2 derives key from passphrase + salt
6. AES-256-GCM decrypts ciphertext
7. GCM authentication tag verified (tamper detection)
8. JSON parsed and validated via `validateBackupPayload()`
9. If valid: pre-restore snapshot created, data applied

## Security Properties

| Property | Guarantee |
|----------|-----------|
| Confidentiality | AES-256 — computationally infeasible to break |
| Integrity | GCM authentication tag detects tampering |
| Key strength | PBKDF2 with 100k iterations slows brute-force |
| Forward secrecy | Each export uses fresh salt + IV |
| No key storage | Passphrase never persisted — forgotten = unrecoverable |

## Limitations

- Passphrase strength depends entirely on the user
- Minimum 4 characters is low — UI encourages longer passphrases
- No key escrow, no recovery mechanism (by design)
- Web Crypto API requires HTTPS or localhost
- Older browsers may not support Web Crypto (graceful fallback: encrypted export disabled, plaintext still available)

## Implementation

- Source: `src/utils/backupCrypto.js`
- UI: `src/ZipExport.jsx` (backup/restore section)
- Feature detection: `window.crypto?.subtle` check before enabling encrypted export

## Future Considerations

- Increase PBKDF2 iterations as hardware improves
- Consider Argon2 when Web Crypto adds support
- Encrypted IndexedDB at rest (Phase 15+)
- Password strength meter in UI
