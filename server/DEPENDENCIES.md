# Backend-Abhängigkeiten (gepinnt)

Getrennt vom Frontend (das bleibt dep-frei). Alle Versionen **exakt gepinnt** (kein `^`),
damit ein Update eine bewusste Entscheidung ist. Vor jedem Release gegen die
[GitHub Advisory Database](https://github.com/advisories) prüfen (`npm audit`).

| Paket | Version | Zweck | Warum diese Wahl |
|---|---|---|---|
| `fastify` | 5.10.0 | HTTP-Framework | schlank, schnell, aktiv gepflegt |
| `@fastify/helmet` | 13.0.2 | Sicherheits-Header (HSTS, CSP, nosniff, …) | offizielles, auditiertes Plugin statt selbstgebaut |
| `@fastify/cors` | 11.2.0 | CORS strikt auf die Domain | offiziell |
| `@fastify/rate-limit` | 11.1.0 | Rate-Limiting | offiziell |
| `@fastify/cookie` | 11.0.2 | signierte Session-Cookies | offiziell |
| `@simplewebauthn/server` | 13.3.2 | WebAuthn/Passkeys-Verifikation | De-facto-Standard, aktiv gepflegt |
| `@prisma/client` | 6.19.3 | DB-Zugriff (MariaDB) | stabile Major; Prisma 7 verlangt driver-adapters + prisma.config.ts (neuer/komplexer) — bewusst die reife Linie für Phase 1 |
| `prisma` (dev) | 6.19.3 | Migrationen/Client-Gen | — |

**`npm audit`: 0 Schwachstellen** (Stand 2026-07-07). Prisma 7 zog transitiv ein
verwundbares `@hono/node-server` (dev-only) nach — Prisma 6 nicht, daher kein Override
nötig. Vor jedem Release erneut `npm audit`.

**Bewusst NICHT dabei:** eigene Krypto-Bibliothek (Envelope läuft client-seitig über die
eingebaute WebCrypto-API), Passwort-Hashing (`argon2`) — erst nötig, falls je ein
Passwort-Fallback dazukommt (Phase 1 ist Passkey-only).
