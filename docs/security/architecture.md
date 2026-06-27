# Security Architecture

## Design Philosophy

Maloja Plana follows a **local-first, zero-backend** architecture. There are no servers to breach, no databases to compromise, no APIs to attack. The threat model is centered on the user's device and browser.

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Browser (User's Device)                        │
│                                                 │
│  ┌───────────────┐    ┌──────────────────────┐  │
│  │  React App    │    │  localStorage         │  │
│  │  (Vite SPA)   │───▶│  or5_data             │  │
│  │               │    │  or5_docs             │  │
│  │  In-memory    │    │  or5_reminders        │  │
│  │  state only   │    │  or5_theme / or5_lang │  │
│  └───────┬───────┘    └──────────────────────┘  │
│          │                                      │
│          │            ┌──────────────────────┐  │
│          └───────────▶│  IndexedDB            │  │
│                       │  ordnung-ruhe-docs    │  │
│                       │  ordnung-ruhe-backups │  │
│                       └──────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │  Web Crypto API (browser-native)         │   │
│  │  AES-256-GCM + PBKDF2 (100k iterations) │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
         │
         │  Static files only (initial load)
         ▼
┌─────────────────────┐
│  Infomaniak (CH)    │
│  (static hosting)   │
│  No server logic    │
│  No analytics       │
│  No telemetry       │
└─────────────────────┘
```

## Technology Stack

| Layer | Technology | Security Rationale |
|-------|-----------|-------------------|
| Framework | React 18 + Vite 4 | No SSR, no server components — pure client-side |
| Styling | Inline styles + CSS custom properties | No external CSS frameworks, no CDN dependencies |
| State | React useState + prop drilling | No state management library, no middleware |
| Persistence | localStorage + IndexedDB | Browser-native, same-origin protected |
| Encryption | Web Crypto API | Browser-native, no JS crypto libraries |
| Deployment | Infomaniak (static hosting, CH) | No server-side code, no environment variables |
| Dependencies | React + ReactDOM only | Minimal attack surface |

## Data Boundaries

### What stays on the device
- All user data (personal info, finances, documents, contacts)
- Encryption keys (derived in memory, never stored)
- User preferences (theme, language)
- Backup snapshots

### What leaves the device
- Nothing during normal operation
- Exported backup files (user-initiated, explicit action)
- Initial page load (Vercel serves static assets)

### Known external call
- QR code generation loads `qrcodejs` from cdnjs.cloudflare.com (to be vendored in Phase 15)

## Security Headers

Configured via hosting platform:
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `X-Frame-Options: DENY` — prevents clickjacking
- `Referrer-Policy: no-referrer` — no referrer leakage
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` — no device access

## Threat Model

| Threat | Mitigation | Residual Risk |
|--------|-----------|---------------|
| Device theft | OS screen lock (user responsibility) | Data readable if device unlocked |
| Browser data cleared | IndexedDB rolling backups, export reminders | User must have exported backup |
| Corrupted data | Validation on every load, pre-migration snapshots | Edge cases in validator |
| Malicious restore file | `validateBackupPayload()` checks structure | Validator may not catch all malformed data |
| Forgotten passphrase | Clear UI warning, plaintext alternative available | No recovery by design (AES-256-GCM) |
| XSS | No `dangerouslySetInnerHTML`, no eval, CSP planned | CDN dependency for QR |
| Supply chain | 2 runtime dependencies (React, ReactDOM) | npm ecosystem risk |

## Authentication Roadmap

| Phase | Mechanism | Purpose |
|-------|----------|---------|
| Current (5) | None | Single-user, single-device |
| Phase 9 | Optional per-profile PIN | Casual access protection on shared devices |
| Future | OS/browser biometrics | Deferred to platform capabilities |

## Source Control & Deployment

- **Repository**: GitHub private (steblerstudios only)
- **Branch strategy**: main (stable, tagged) → dev (active) → feature branches
- **Deployment**: Infomaniak (Geneva, CH), static hosting at malojaplana.ch
- **Alpha access**: Public URL, no authentication (acceptable for alpha)
