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

Im Browser gesetzt (via `index.html`, Meta-Tags):
- **Content-Security-Policy** — `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`. **Ohne** `frame-ancestors`: die Direktive wirkt nur als HTTP-Header, im Meta-Tag ignoriert der Browser sie und meldet einen Konsolenfehler (Lighthouse «Best Practices», 16.09.2026). Sie stand bis 17.09.2026 wirkungslos im Meta-Tag und ist dort entfernt. Der Clickjacking-Schutz kommt aus dem HTTP-Header `X-Frame-Options: SAMEORIGIN` (unten). Wird die CSP später als Header gesetzt (Bau-Liste O8), gehört `frame-ancestors 'none'` dort hinein. Bis zum 15.09.2026 stand hier «`frame-ancestors 'none'` (Clickjacking-Schutz)» bei der Meta-CSP; das war nicht zutreffend.
- **Referrer-Policy** — `strict-origin-when-cross-origin` (`<meta name="referrer">`).

Als **echte HTTP-Header** live gemessen (`curl -sI https://malojaplana.ch`, 15.09.2026; gesetzt im Infomaniak-Hosting-Panel, kein `.htaccess` — löst 503 aus):
- `strict-transport-security: max-age=16000000` — erzwingt HTTPS. **Ohne** `includeSubDomains`. Bis zum 15.09.2026 stand hier `max-age=31536000; includeSubDomains` als Soll; der gemessene Stand ist ein anderer.
- `x-frame-options: SAMEORIGIN` — Clickjacking-Schutz (Einbettung nur von derselben Herkunft).
- `x-content-type-options: nosniff` — verhindert MIME-Sniffing.
- `referrer-policy: strict-origin-when-cross-origin` — zusätzlich zum Meta-Tag auch als Header.
- `permissions-policy: camera=(), microphone=(), geolocation=()` — Geolocation ist damit **vollständig** deaktiviert, nicht `(self)` wie hier bis zum 15.09.2026 stand. `src/NotfallVorlesekarte.jsx` Z. 47–49 ruft `navigator.geolocation.getCurrentPosition` auf; ob dieser Aufruf unter dem Live-Header noch funktioniert, ist nicht geprüft. Offen: entweder den Header auf `geolocation=(self)` setzen oder die Standort-Funktion der Notfallkarte als nicht verfügbar behandeln.
- Kein CSP-Header — die CSP wirkt nur als Meta-Tag (siehe oben).

## Referenz-Checkliste

Angewandte, an local-first angepasste Fassung des Security-Prompt-Packs:
[docs/security/CHECKLISTE.md](docs/security/CHECKLISTE.md).

## Reaktionszeit

Wir bemühen uns, innerhalb von 7 Tagen zu antworten.

---

Stand: 15.09.2026, auf Code-Stand `main` 9e6d9b1 gebracht, nicht juristisch geprüft.
