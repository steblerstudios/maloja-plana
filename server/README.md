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

## Stand

**Backend von Phase 1 funktional komplett (Increment 2 + 3a + 3b):**
- Security-Fundament (Header/CORS/Rate-Limit/Cookies), Deny-by-default-Auth, Config-Fail-fast.
- Prisma-Schema (nur Chiffrat), keine Recovery/Klartext-Key-Tabelle.
- **WebAuthn-Zeremonien:** Registrierung (begin/finish) + Login (begin/finish) mit
  `requireUserVerification: true`, PRF aktiviert, strikter RP-ID/Origin-Prüfung,
  Signatur-Zähler-Abgleich; Session wird bei Erfolg ausgestellt.
- **Daten-Endpoints:** Backup `GET/POST` + `DELETE /account`, feste Eigentums-Bindung
  (Query immer auf die Session-userId — keine vom Client steuerbare ID), per-Route-
  Rate-Limit, Input-Validierung, Audit-Log.
- **20 Tests** (`src/__tests__/`): Zeremonie-Verdrahtung (UV-Pflicht/RP-ID/Origin/Challenge
  geprüft, DB-Effekte, Session), Deny-by-default, Session-Lebenszyklus, Eigentums-Scoping.

**Offen:** Frontend-Anbindung (WebAuthn-Client `navigator.credentials` + PRF-Eval + Vault
+ Backup/Restore-UI + Recovery-Code-Anzeige) und danach das **Security-Review-Gate** mit
echter End-to-End-Prüfung: MariaDB + echter Passkey im Browser. Erst dann live.
