# Post-Deployment Check

**URL:** https://malojaplana.ch  
**Datum:** 2026-06-14  
**Commit:** 9a3da9f  
**Hosting:** Infomaniak Web Hosting (Apache)  
**Methode:** Statischer Upload via Infomaniak File Manager

---

# 1. Live-Seite

| Prüfpunkt | Status | Detail |
|---|---|---|
| HTTPS | ✓ | HTTP/2 200, Let's Encrypt (gültig bis 2026-09-12) |
| HSTS | ✓ | `strict-transport-security: max-age=16000000` |
| index.html | ✓ | 1651 Bytes, identisch mit lokalem Build |
| JS-Bundle | ✓ | `index-354db82d.js`, 708'832 Bytes, identisch |
| CSS | ✓ | `index-a489bc55.css`, 5'124 Bytes, identisch |
| GZIP | ✓ | `content-encoding: gzip` aktiv |
| Server | — | Apache |

---

# 2. Assets

| Asset | Status | Detail |
|---|---|---|
| index.html | ✓ 200 | text/html |
| JS-Bundle | ✓ 200 | application/javascript |
| CSS | ✓ 200 | text/css |
| manifest.json | ✓ 200 | application/json, Inhalt korrekt |
| sw.js | ✓ 200 | application/javascript |
| icon-192.png | ✓ 200 | image/png, 6'798 Bytes |
| icon-512.png | ✓ 200 | image/png, 40'948 Bytes |
| icon-preview.html | ✓ 200 | — |
| DM Sans (6 WOFF2) | ✓ 200 | font/woff2, alle 6 Dateien |

Alle 14 Dateien aus `dist/` werden korrekt ausgeliefert. Dateigrössen stimmen mit dem lokalen Build überein.

---

# 3. Routing

| Prüfpunkt | Status | Detail |
|---|---|---|
| Hash-Routing | ✓ | App nutzt `#/`-basiertes Routing, kein serverseitiges Routing nötig |
| Reload auf `/` | ✓ | index.html wird ausgeliefert, App startet |
| 404 für unbekannte Pfade | ✓ | `/nonexistent-page` gibt HTTP 404 |
| SPA-Fallback | Nicht nötig | Hash-Routing braucht keinen Fallback — alle Routen laden `/` |

---

# 4. Impressum & Feedback

| Prüfpunkt | Status | Detail |
|---|---|---|
| Impressum DE | ✓ | "Maloja Plana — Projekt von Sophie Stebler", "Basel, Schweiz", "info@malojaplana.ch" |
| Impressum EN | ✓ | "A project by Sophie Stebler", "Basel, Switzerland" |
| Impressum FR | ✓ | "Un projet de Sophie Stebler", "Bâle, Suisse" |
| Impressum IT | ✓ | "Un progetto di Sophie Stebler", "Basilea, Svizzera" |
| Feedback-Link | ✓ | `mailto:info@malojaplana.ch?subject=Maloja%20Plana%20Beta%20Feedback` |
| Alte Platzhalter | ✓ Weg | Kein `[Platzhalter]`, kein `feedback@example.com` im Bundle |

Verifiziert durch Textsuche im gelieferten JS-Bundle. "Sophie Stebler" 4× (4 Sprachen), "info@malojaplana.ch" 5× (4 Sprachen + mailto), "feedback@example.com" 0×.

---

# 5. localStorage

| Prüfpunkt | Status | Detail |
|---|---|---|
| Funktionalität | ✓ | localStorage ist auf malojaplana.ch verfügbar (HTTPS, Same-Origin) |
| Prefix | ✓ | Alle Keys mit `or5_` präfixiert |
| Keine externe Datenübertragung | ✓ | CSP `connect-src 'self'` verhindert ausgehende Requests |
| Auto-Save | ✓ | 5-Sekunden-Intervall im Code |
| Auto-Backup | ✓ | IndexedDB, 12h-Intervall |

---

# 6. Mehrsprachigkeit

| Prüfpunkt | Status | Detail |
|---|---|---|
| DE/EN/FR/IT | ✓ | Alle 4 Sprachdateien im Bundle enthalten |
| Sprachauswahl | ✓ | Header-Buttons, persistiert in localStorage |
| Impressum alle Sprachen | ✓ | Korrekt lokalisiert (Basel/Bâle/Basilea) |

---

# 7. Mobile

| Prüfpunkt | Status | Detail |
|---|---|---|
| Viewport Meta | ✓ | `width=device-width, initial-scale=1.0, viewport-fit=cover` |
| PWA-Manifest | ✓ | `display: standalone`, `orientation: portrait-primary` |
| Apple-Tags | ✓ | `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style` |
| Touch-Icon | ✓ | `apple-touch-icon` → `/icon-192.png` |

Visueller Mobile-Test (375px) war nicht möglich, da Chrome-Extension und Computer-Use nicht verfügbar waren. Mobile-Kompatibilität wurde in früheren Reviews (E-16 Impact Review) auf localhost verifiziert. Code ist identisch.

---

# 8. Service Worker / PWA

| Prüfpunkt | Status | Detail |
|---|---|---|
| sw.js | ✓ | Wird korrekt ausgeliefert |
| Cache-Strategie | ✓ | Network-first mit Offline-Fallback |
| manifest.json | ✓ | Korrekt, alle Felder ausgefüllt |
| Icons im Manifest | ✓ | 192px + 512px, beide erreichbar |
| Installierbar | Wahrscheinlich | Manifest + SW + HTTPS = Installationskriterien erfüllt |

---

# 9. Security Headers

| Header | Erwartet (vercel.json) | Live (Infomaniak) |
|---|---|---|
| `strict-transport-security` | — | ✓ `max-age=16000000` (Infomaniak-Standard) |
| CSP | ✓ (HTML meta) | ✓ Im HTML, nicht als HTTP-Header |
| `X-Content-Type-Options: nosniff` | ✓ | ✗ Fehlt |
| `X-Frame-Options: DENY` | ✓ | ✗ Fehlt |
| `Referrer-Policy: no-referrer` | ✓ | ✗ Fehlt |
| `Permissions-Policy` | ✓ | ✗ Fehlt |

Die 4 fehlenden Headers waren in `vercel.json` konfiguriert. Infomaniak nutzt Apache — die Headers können per `.htaccess` nachgerüstet werden.

**Risiko:** Gering. CSP ist als Meta-Tag im HTML vorhanden und schützt gegen XSS/Injection. `X-Frame-Options` ist durch CSP `frame-ancestors 'none'` abgedeckt. Die fehlenden Headers sind Defense-in-Depth, nicht kritisch.

---

# 10. SSL-Zertifikat

| Prüfpunkt | Status | Detail |
|---|---|---|
| Aussteller | ✓ | Let's Encrypt (YR2) |
| Gültig ab | ✓ | 2026-06-14 |
| Gültig bis | ✓ | 2026-09-12 (90 Tage) |
| Auto-Renewal | Wahrscheinlich | Infomaniak erneuert Let's Encrypt automatisch |
| Domain | ✓ | CN=malojaplana.ch |

---

# 11. Domain-Konfiguration

| Prüfpunkt | Status | Detail |
|---|---|---|
| https://malojaplana.ch | ✓ 200 | Seite lädt |
| https://www.malojaplana.ch | ✓ 200 | Seite lädt (gleicher Inhalt) |
| http://malojaplana.ch | ⚠ 200 | Kein Redirect auf HTTPS — Seite wird unverschlüsselt ausgeliefert |

---

# Offene Punkte

---

## Empfohlen (vor breiter Kommunikation)

### P.1 — HTTP→HTTPS Redirect

**Was:** `http://malojaplana.ch` liefert die Seite unverschlüsselt aus, statt auf `https://` umzuleiten.

**Warum wichtig:** Benutzer, die `malojaplana.ch` ohne `https://` eintippen, erhalten eine unverschlüsselte Verbindung. HSTS greift erst nach dem ersten HTTPS-Besuch.

**Lösung:** `.htaccess` im Webroot:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
```

Oder: Im Infomaniak-Panel unter "Weiterleitung" → "HTTP auf HTTPS erzwingen" aktivieren.

### P.2 — Security Headers via .htaccess

**Was:** 4 Security-Headers aus `vercel.json` fehlen auf Infomaniak.

**Lösung:** `.htaccess` im Webroot:
```apache
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set Referrer-Policy "no-referrer"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
```

**Risiko ohne:** Gering. CSP im HTML deckt das Wesentliche ab.

---

## Kann warten

### P.3 — robots.txt

Kein `robots.txt` vorhanden. Suchmaschinen indexieren alles. Für eine geschlossene Beta:
```
User-agent: *
Disallow: /
```

### P.4 — favicon.ico

Kein `favicon.ico`. Moderne Browser nutzen das `<link rel="icon">` Tag (icon-192.png), aber Safari und ältere Browser suchen `favicon.ico` und erzeugen 404-Einträge im Server-Log.

### P.5 — Open Graph Meta-Tags

Keine `og:title`/`og:description`/`og:image`. Links in Chat/Social zeigen keine Vorschau.

---

# Zusammenfassung

| Bereich | Status |
|---|---|
| Seite erreichbar | ✓ |
| Alle Assets geladen | ✓ (14/14 Dateien, 200, Grössen identisch) |
| SSL | ✓ (Let's Encrypt, gültig 90 Tage) |
| HSTS | ✓ |
| GZIP | ✓ |
| CSP | ✓ (HTML meta) |
| Routing | ✓ (Hash-basiert, kein Fallback nötig) |
| Impressum | ✓ (alle 4 Sprachen, echte Daten) |
| Feedback-Link | ✓ (info@malojaplana.ch) |
| localStorage | ✓ |
| PWA/SW | ✓ |
| Mehrsprachigkeit | ✓ |
| Mobile-Meta | ✓ |
| HTTP→HTTPS Redirect | ⚠ Fehlt |
| Security Headers (4) | ⚠ Fehlen |

**Maloja Plana ist live und funktionsfähig.** Die zwei empfohlenen Punkte (P.1 HTTPS-Redirect, P.2 Security Headers) sind über das Infomaniak-Panel oder eine `.htaccess`-Datei lösbar.
