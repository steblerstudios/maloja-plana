# ADR-011 — Authentication Strategy: WebAuthn + Progressive Enhancement

| Meta | Value |
|------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-17 |
| **Deciders** | Stebler Studios |
| **Relates to** | ADR-001 (Offline-First), ADR-002 (No Accounts), GAP-04, GAP-05, SEC-001–SEC-010 |

---

## Context

ADR-002 states "no accounts required." However, future features (family accounts, multi-device sync, document vault sharing, medical staff access) require authentication. The challenge: how to add auth without violating offline-first principles or forcing accounts on single-device users.

Key requirements:
- Single-device users: no account needed (ADR-002 preserved)
- Multi-device/sharing: auth required, but progressive
- Biometric support for accessibility (GAP-07)
- Swiss privacy compliance (no data to auth providers)
- PIN above keyboard (user feedback: 2FA convenience)
- Offline authentication must work

---

## Decision

**Progressive Authentication** — three levels, user chooses:

### Level 0: No Auth (Default, Single Device)
- App opens directly, no login
- Data protected by device security (OS-level)
- Encryption at rest (ADR-009) provides data protection
- Suitable for: single-user, single-device

### Level 1: Local Auth (Device Lock)
- User sets a passphrase or PIN
- Passphrase used as PBKDF2 input for encryption key (ADR-009)
- WebAuthn (biometric) as convenience unlock
- Works fully offline — no server needed
- Suitable for: shared devices, sensitive data

### Level 2: Remote Auth (Multi-Device / Sharing)
- Email + passphrase registration (self-hosted or provider)
- WebAuthn as primary (passwordless where supported)
- TOTP 2FA optional
- PIN-above-keyboard for quick re-auth
- JWT tokens with short expiry + refresh
- Suitable for: family accounts, multi-device, sync

---

## Technical Architecture

### Level 1: Local Auth Flow

```
App Start
  → Check: local auth enabled? (or5_settings.authLevel)
    → No: open directly (Level 0)
    → Yes: show unlock screen
      → Option A: Enter PIN/Passphrase
        → PBKDF2 → derive key → attempt decrypt test blob
          → Success: unlock app
          → Failure: "Incorrect" + progressive delay
      → Option B: WebAuthn (biometric)
        → navigator.credentials.get()
          → Success: retrieve stored key from credential
          → Failure: fall back to PIN/Passphrase
```

### Level 2: Remote Auth Flow

```
Login Screen
  → Email + Passphrase
    → Server verifies (bcrypt/argon2)
      → Returns: JWT access (15min) + refresh (7d)
        → Stored in httpOnly cookie (if server) or memory
  → Optional 2FA:
    → TOTP (app-based, offline-capable)
    → PIN above keyboard (4-6 digits, shown over soft keyboard)
  → WebAuthn (passwordless):
    → navigator.credentials.get()
    → Server validates assertion
    → Returns tokens
```

### Offline Auth (Critical)

```
When offline + Level 2:
  → JWT expired? Check refresh token
    → Refresh token valid? Derive local session
    → Refresh token expired?
      → Fall back to Level 1 (local passphrase/biometric)
      → Read-only mode for synced data
      → Full access to local-only data
      → Queue writes for sync on reconnect
```

### PIN Above Keyboard (2FA UX)

```
┌─────────────────────────────────┐
│                                 │
│     Enter your PIN              │
│     ● ● ● ○ ○ ○                │
│                                 │
│  ┌─────────────────────────┐    │
│  │  [1] [2] [3] [4] [5]   │    │  ← PIN input row
│  │  [6] [7] [8] [9] [0]   │    │    (above keyboard)
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │     Device Keyboard     │    │  ← Standard keyboard
│  │     (if needed)         │    │    (for passphrase)
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

- PIN row rendered as custom component (not native input)
- Randomizable digit order (optional, for shoulder-surfing protection)
- Haptic feedback on each digit (mobile)
- Auto-submit on last digit

---

## WebAuthn Implementation

```javascript
// Registration (one-time setup)
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    rp: { name: 'Maloja Plana', id: location.hostname },
    user: {
      id: userIdBuffer,
      name: userEmail,
      displayName: userName
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' },   // ES256
      { alg: -257, type: 'public-key' }  // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform', // device biometric
      userVerification: 'required'
    }
  }
});

// Authentication (each login)
const assertion = await navigator.credentials.get({
  publicKey: {
    challenge: serverChallenge,
    allowCredentials: [{ id: credentialId, type: 'public-key' }],
    userVerification: 'required'
  }
});
```

### Fallback Chain

```
WebAuthn (biometric)
  → fails? PIN above keyboard
    → fails? Passphrase
      → fails? Email recovery (Level 2 only)
        → fails? Account locked (progressive delay)
```

---

## Role-Based Access Control (RBAC)

| Role | Level Required | Capabilities |
|------|---------------|--------------|
| Owner | Level 1+ | Full access, manage roles, delete data |
| Parent | Level 2 | Manage child accounts, view shared docs |
| Child | Level 1 | Own data, limited settings, no role mgmt |
| Medical | Level 2 + explicit grant | Read-only specific documents, time-limited |
| Auditor | Level 2 + explicit grant | Read audit logs, compliance exports |

### Permission Model

```javascript
const CAPABILITIES = {
  'data:read':      ['owner', 'parent', 'child', 'medical', 'auditor'],
  'data:write':     ['owner', 'parent', 'child'],
  'data:delete':    ['owner'],
  'roles:manage':   ['owner'],
  'audit:read':     ['owner', 'auditor'],
  'audit:export':   ['owner', 'auditor'],
  'docs:share':     ['owner', 'parent'],
  'settings:write': ['owner', 'parent'],
  'child:transfer': ['owner', 'parent']  // Account transfer on adulthood
};
```

---

## Alternatives Considered

| Option | Offline | Privacy | UX | Verdict |
|--------|---------|---------|-----|---------|
| **WebAuthn + Progressive** | Yes (Level 0-1) | Full | Good | **Selected** |
| **OAuth only (Google/Apple)** | No | Depends on provider | Easy | Rejected (offline requirement) |
| **Password-only** | Partial | Good | Poor (forgotten pw) | Rejected (accessibility) |
| **Magic Link only** | No | Good | Easy | Rejected (offline) |
| **No auth ever** | Yes | Full | Easy | Rejected (no sharing/sync possible) |

---

## Consequences

### Positive
- ADR-002 preserved: single-device users never need an account
- Biometric auth improves accessibility (no password typing)
- Progressive model: complexity only added when needed
- Offline-first preserved at all levels
- PIN above keyboard addresses user feedback

### Negative
- Three auth levels = more code paths to test
- WebAuthn browser support varies (fallback needed)
- Key management for Level 1 is on the user (passphrase loss = data loss)
- Server infrastructure needed for Level 2

### Risks
- Passphrase loss in Level 1 = permanent data loss (mitigated: clear warning + optional recovery key)
- WebAuthn not available in older browsers (mitigated: PIN/passphrase fallback)
- Session hijacking in Level 2 (mitigated: short JWT expiry, refresh rotation)

---

## Security Measures

| Attack | Mitigation |
|--------|-----------|
| Brute force | Progressive delay: 1s, 2s, 4s, 8s... + max 10 attempts then lockout |
| Shoulder surfing | Optional randomized PIN layout |
| Token theft | httpOnly cookies, short expiry (15min), refresh rotation |
| Replay attack | WebAuthn challenge-response, TOTP time-window |
| Device theft | Encryption at rest (ADR-009), biometric required |
| MITM | TLS 1.3 required for Level 2 operations |

---

## Compliance

| Standard | Requirement | How Met |
|----------|------------|---------|
| ISO 27001 A.9.1 | Access control policy | Three-level progressive model |
| ISO 27001 A.9.4 | System access control | WebAuthn + 2FA + progressive delay |
| DSGVO Art. 32 | Appropriate security | Encryption, biometric, audit logging |
| DSG (Schweiz) | Proportionality | Auth level matches data sensitivity |
| EU AI Act Art. 14 | Human oversight | All auth transitions require user action |

---

## Action Items

1. Implement `AuthService` with three-level detection
2. Build PIN-above-keyboard component (custom, accessible)
3. Integrate WebAuthn API with feature detection + fallback
4. Design "upgrade auth level" flow (Level 0 → 1 → 2)
5. Implement progressive delay for failed attempts
6. Create recovery key generation for Level 1 users
7. Document key loss implications in user-facing help
8. Build RBAC engine with capability inheritance
