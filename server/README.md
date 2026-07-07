# Maloja Plana — Server (Phase 1)

Zero-Knowledge-Backend: optionales Konto (Passkeys) + **Ende-zu-Ende verschlüsseltes
Backup**. Der Server sieht ausschliesslich Chiffrat. Getrennt vom Frontend, eigener
Deploy (Jelastic Cloud).

> **Nicht live.** Dieses Verzeichnis ist Code + lokale Tests. Live geht erst, wenn die
> Jelastic-Umgebung provisioniert ist (siehe `docs/context/SECURITY_PHASE_1_PLAN.md`) und
> deployt wird. Deploy macht Sophie selbst.

## Architektur-Kurzform

- **Auth:** Passkeys/WebAuthn, `userVerification: required`, **PRF-Pflicht** (Schlüsselquelle).
- **Krypto:** client-seitig (`src/crypto/vault.js` im Frontend). Server speichert nur den
  `sealBackup`-Blob.
- **Sessions:** opake Token, signiertes httpOnly/Secure/SameSite=Strict-Cookie,
  serverseitig widerrufbar.
- **Zugriff:** Deny-by-default; jede Ressourcen-Route prüft Eigentum (`assertOwner`).

## Lokal starten

```bash
cd server
npm install
cp .env.example .env      # Werte eintragen (SESSION_SECRET generieren!)
npm run prisma:generate
npm start
```

## Stand (Increment 2 — Gerüst)

Fertig: Security-Fundament (Header/CORS/Rate-Limit/Cookies), Deny-by-default-Auth,
Eigentümer-Helfer, Config-Fail-fast, Prisma-Schema, WebAuthn-Registrierung Schritt 1.

Offen (Increment 3): WebAuthn finish + Login, Backup GET/POST + `DELETE /account` mit
DB-Logik, per-Route-Rate-Limits, Audit-Logging. Danach: Security-Review-Gate.
