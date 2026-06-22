# Security Policy

## Sicherheitslücken melden

Wenn Du eine Sicherheitslücke in Maloja Plana findest, melde sie bitte **vertraulich** per E-Mail:

**sophie.stebler@gmail.com**

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

## Reaktionszeit

Wir bemühen uns, innerhalb von 7 Tagen zu antworten.
