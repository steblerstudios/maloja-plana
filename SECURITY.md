# Security Policy

## Sicherheitslücken melden

Wenn Du eine Sicherheitslücke in Maloja Plana findest, melde sie bitte **vertraulich** per E-Mail:

**info@malojaplana.ch**

Betreff: `[SECURITY] Maloja Plana — Kurzbeschreibung`

Bitte **kein** öffentliches Issue erstellen für Sicherheitsprobleme.

## Was wir als Sicherheitslücke betrachten

- XSS (Cross-Site Scripting)
- Datenverlust durch App-Fehler
- Umgehung der Content Security Policy
- Zugriff auf localStorage/IndexedDB durch Dritte
- Fehler in der Backup-Verschlüsselung (AES-256-GCM)

## Architektur

Maloja Plana ist eine **local-first** Anwendung:
- Keine Benutzerdaten auf Servern
- Kein Backend, keine API
- Kein Tracking, keine Cookies
- CSP: `script-src 'self'`, `connect-src 'self'`

Details: [docs/security/](docs/security/)

## Security-Header

Im Browser gesetzt (via `index.html`):
- **Content-Security-Policy** — `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'` (Clickjacking-Schutz), `base-uri 'self'`, `form-action 'self'`.
- **Referrer-Policy** — `strict-origin-when-cross-origin` (`<meta name="referrer">`).

Nur als **echte HTTP-Header** wirksam (Browser ignorieren sie als `<meta>`) — im Infomaniak-Hosting-Panel zu setzen, sobald möglich. Kein `.htaccess` (löst 503 aus):
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` — erzwingt HTTPS.
- `X-Content-Type-Options: nosniff` — verhindert MIME-Sniffing.
- `Permissions-Policy: camera=(), microphone=(), geolocation=(self)` — deaktiviert ungenutzte Browser-Funktionen (Geolocation nur self, für Notfallkarte).

## Referenz-Checkliste

Angewandte, an local-first angepasste Fassung des Security-Prompt-Packs:
[docs/security/CHECKLISTE.md](docs/security/CHECKLISTE.md).

## Reaktionszeit

Wir bemühen uns, innerhalb von 7 Tagen zu antworten.
