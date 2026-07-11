# Security Phase 1 — Bauplan: Konto + verschlüsseltes Backup (1 Gerät)

> **Status: PLAN/ENTWURF.** Baut auf [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md).
> Gate 0 erledigt (Zero-Knowledge + Recovery-Codes). Hier steht der *Bauplan* — noch
> kein Code. Gebaut wird in eigener Session, mit Security-Review-Gate am Ende. Bis dahin
> bleibt Maloja unverändert local-first.

## Ziel (bewusst klein)

Opt-in-Konto. Login via **Passkey** (primär) / **SwissID** (optional). Ein **Ende-zu-Ende
verschlüsseltes Backup** der lokalen Daten hochladen und wiederherstellen — auf **einem**
Gerät. Sonst nichts.

## Nicht-Ziele in Phase 1

- Kein Mehrgeräte-Sync (→ Phase 2)
- Keine Freigabe / Vertrauensperson / digitaler Nachlass (→ Phase 3)
- Keine server-gestützte Recovery (vertagt)
- Local-first bleibt: **ohne Konto läuft alles wie heute**

## Krypto-Design (Envelope, Zero-Knowledge)

Der Server sieht **nur Chiffrat**. Alles Ver-/Entschlüsseln passiert im Browser mit der
eingebauten **WebCrypto-API** (AES-256-GCM) — dafür braucht es *keine* Krypto-Bibliothek.

1. **DEK** (Data Encryption Key): zufälliger 256-bit-Schlüssel, verschlüsselt die
   Backup-Daten.
2. **KEK** (Key Encryption Key): leitet sich aus dem Nutzer-Geheimnis ab und „wrappt"
   (verschlüsselt) den DEK. Nur der *gewrappte* DEK geht zum Server, nie der DEK selbst.
3. **Recovery**: der DEK wird **zusätzlich** mit einem aus den Recovery-Codes
   abgeleiteten Schlüssel gewrappt. So gibt es zwei Wege, den DEK zu entsperren:
   normales Login-Geheimnis **oder** Recovery-Codes. Verliert die Nutzerin beide, ist das
   Backup unwiederbringlich — aber die lokalen Originaldaten leben weiter (Phase 1 ist nur
   ein Backup).

### DIE offene Weiche: Woher kommt das Nutzer-Geheimnis (KEK-Quelle) beim Passkey-Login?

Passkeys authentifizieren, liefern aber nicht automatisch einen stabilen Schlüssel. Zwei
Wege (Entscheidung von der Inhaberin, siehe unten):

- **A — WebAuthn-PRF-Extension (hmac-secret):** der Passkey leitet deterministisch ein
  Geheimnis ab, daraus entsteht der KEK. **Kein zusätzliches Passwort.** Ruhigste UX.
  Braucht moderne Authenticators/Browser (heute breit unterstützt, aber nicht 100 %).
- **B — separate Verschlüsselungs-Passphrase:** zusätzlich zum Passkey merkt sich die
  Nutzerin *ein* Geheimnis (getrennt vom Login → passt zu „Login-Reset ≠ Daten-Reset").
  Universell, aber ein Ding mehr zum Merken.
- **Kompromiss:** A wo verfügbar, sonst automatisch B.

**ENTSCHIEDEN 2026-07-07 — A (WebAuthn-PRF), kein Fallback in Phase 1.** Sicherste
Variante: der Schlüssel entsteht im Hardware-Sicherheitschip, ist nicht phishbar/tippbar/
erratbar. B (Menschen-Passphrase) ist die schwächste Option; der Kompromiss C ist nur so
stark wie sein schwächster Pfad und verdoppelt die Angriffsfläche — bewusst *nicht*
gewählt. Ehrlicher Preis: Geräte ohne PRF können das Backup vorerst nicht nutzen und
bleiben local-first (okay, weil opt-in). Reichweite ggf. später bewusst nachholen.

## Datenmodell (Prisma — Server hält nur Chiffrat + Referenzen)

- `User(id uuid, createdAt)`
- `WebAuthnCredential(id, userId→User, credentialId, publicKey, counter)`
- `EncryptedBackup(id, userId→User, ciphertext, wrappedDek, nonce, version, updatedAt)`
- `RecoveryWrappedDek(userId, wrappedDek)` — DEK gewrappt mit Recovery-Schlüssel
- `RecoveryCode(userId, codeHash)` — nur **Hash** der Codes, nie die Codes selbst
- `AuditLog(userId, event, ts, ip)` — **ohne** PII/Klartext/Token

## API-Endpoints (Eigentümer-Prüfung ab der ersten Zeile)

Alle hinter Auth-Middleware; jeder ressourcenbezogene Endpoint prüft
`resource.userId === session.userId`, sonst `403`:

- `POST /auth/register-passkey/{begin,finish}` (WebAuthn Attestation)
- `POST /auth/login-passkey/{begin,finish}` (WebAuthn Assertion)
- `GET/POST /auth/swissid/*` (OIDC — optional, kann nach v1)
- `POST /backup` — lädt eigenes Chiffrat hoch
- `GET /backup` — lädt eigenes Chiffrat
- `DELETE /account` — löscht Konto + alle Blobs (revDSG-Löschrecht)

UUID-IDs (kein Durchzählen), deny-by-default, `429` bei Rate-Limit.

## Sicherheits-Kontrollen (aus Architektur Abschnitt 6)

- Sessions in `httpOnly; Secure; SameSite`-Cookies; kurzlebig + Refresh; Logout
  serverseitig invalidieren; neue Session-ID nach Login.
- Rate-Limiting auf Auth + Backup + Recovery.
- CORS strikt auf `malojaplana.ch`; CSP `connect-src` gezielt um die API-Domain erweitern.
- Security-Header: HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy.
- Serverseitige Validierung aller Inputs; generische Fehlermeldungen (keine internen Details).
- Secrets nur als Server-Env-Vars (Infomaniak); **nie** im Client.
- Audit-Log redacted; Alerts auf Fehl-Login-Spitzen / Massenzugriffe.

## Abhängigkeiten (ehrlich, minimal, geprüft)

Backend ist separat — die „no-deps"-Regel gilt fürs Frontend. Serverseitig minimal nötig:

| Zweck | Wahl | Warum |
|---|---|---|
| Web-Framework | Fastify | schlank, schnell, gut gewartet |
| ORM | Prisma | bestehende Richtung, typsicher |
| WebAuthn | `@simplewebauthn/server` | De-facto-Standard, aktiv gepflegt |
| Passwort-Hash (Fallback) | `argon2` | Stand der Technik |
| Krypto | WebCrypto (Browser) + Node `crypto` | eingebaut, keine Extra-Lib |

Jede Dep vor Aufnahme geprüft und in einer Backend-Deps-Liste per Version gepinnt (analog
[VENDOR.md](../../VENDOR.md)).

## Deployment

- Node-API bei Infomaniak (welche Umgebung — Node-Hosting-Produkt vs. VPS — zu klären),
  MariaDB ist schon angelegt.
- HTTPS/HSTS erzwungen; Secrets als Env-Vars in der Hosting-Konfiguration.
- Frontend spricht ausschliesslich die eigene API an.

## Review-Gate am Ende von Phase 1

Security-Review prüft mindestens: Auth-Flows; Eigentümer-Prüfung auf *jedem* Endpoint;
Krypto-Envelope (nie ein Klartext-Schlüssel serverseitig); Session-/Cookie-Flags;
Rate-Limits; Secrets-Handling; Fehler-Leaks; vollständige Löschung. Erst bei „clean" → live.

## Mikro-Entscheidungen für Phase 1 (die Inhaberin)

1. **KEK-Quelle — ENTSCHIEDEN:** A (WebAuthn-PRF), kein Fallback in Phase 1. Sicherste
   Variante; Geräte ohne PRF bleiben vorerst local-first.
2. **Infomaniak-Node-Umgebung (recherchiert 2026-07-07):** euer heutiges Hosting ist
   statisches FTP → ein Node-Backend braucht ein anderes Produkt. Optionen bei Infomaniak
   (alle Schweiz/nDSG/DSGVO):
   - **VPS Lite / VPS Cloud** — volle Kontrolle über Header/Rate-Limits/TLS/Secrets/
     Prozess. Ideal für „0% hackability", aber *wir* tragen Patching/Firewall/Härtung.
   - **Jelastic Cloud (PaaS)** — managed, pay-per-use, Node.js nativ; weniger Ops, aber
     eine Community-Quelle berichtet von „Jelastic pitfalls" → vor Wahl kurz gegenprüfen.
   - **Managed Node.js-Hosting** — am einfachsten, aber am wenigsten Kontrolle über die
     Sicherheits-Feinheiten.
   - **Sicherheits-Analyse (recherchiert):** Infomaniak ist **ISO 27001** (seit 2018),
     Swiss Sovereign Cloud, nDSG/DSGVO — diese Basis gilt für *alle* Produkte. Der
     Unterschied ist die *geteilte Verantwortung*: beim **VPS** trägst du OS-Patching/
     Firewall/Härtung selbst (grösste selbst-zu-sichernde Fläche → in der Praxis für eine
     Einzelperson die riskanteste Variante). Zusätzlich nimmt **Zero-Knowledge** dem
     Hosting die Vertraulichkeit ab (Server-Übernahme = nur Chiffrat).
   - **Empfehlung (korrigiert 2026-07-07): gemanagte Umgebung, NICHT roher VPS.**
     „Am sichersten" = kleinste Fläche, die die Inhaberin selbst absichern muss → OS-Patching an
     Infomaniak abgeben. **Jelastic Cloud** (isolierte Node-Umgebung, Unterbau von
     Infomaniak gepflegt) als primäre Wahl; managed Node.js-Hosting als einfachere
     Alternative *falls* es persistente API + Env-Secrets + MariaDB-Zugriff kann.
   - **Noch zu verifizieren:** exakte Fähigkeiten des managed Node.js-Produkts
     (persistenter Prozess? Env-Secrets? MariaDB?) — via Infomaniak-Docs/Support.
3. **Framework:** Fastify (empfohlen) — offen zur Bestätigung.

## Provisioning-Checkliste (die Inhaberin, im Infomaniak-Account)

> Verifiziert 2026-07-07: Jelastic Cloud unterstützt Node.js (Version wählbar), MariaDB
> nativ, Deploy per Git/Docker, Env-Variablen (PORT wird injiziert), isolierte Container.
> Claude hat **keinen** Account-Zugriff — diese Schritte macht die Inhaberin selbst; die genauen
> Secret-*Werte* entstehen erst in der Bau-Session.

1. **Jelastic-Environment anlegen** (Jelastic Cloud abonnieren → neues Environment).
2. **Node.js-Node wählen**, stabile LTS-Version (Sicherheit + Support).
3. **Datenbank:** die schon angelegte MariaDB (`[entfernt]…`) von der App aus verbinden —
   *oder* im Environment einen MariaDB-Node ergänzen (privates Netz, sauberer). Wahl in
   der Bau-Session; beides von Jelastic unterstützt.
4. **Env-Secrets setzen** (nie im Code): DB-Zugang, Session-Secret, WebAuthn-RP-ID/Origin.
   Werte kommen aus der Bau-Session.
5. **Deploy-Weg:** Git-Repo anbinden (empfohlen, auto-deploy) — App liest `process.env.PORT`.
6. **Subdomain + TLS:** z. B. `api.malojaplana.ch` auf das Environment; HTTPS/HSTS erzwingen.
7. **Zugriff härten:** nur HTTPS, CORS strikt auf `malojaplana.ch`, Rate-Limits aktiv.

Deploy bleibt (wie beim Frontend) Aktion der Inhaberin — Claude schreibt/prüft Code lokal,
die Inhaberin deployt.
