# Deployment Readiness Review

**Projekt:** Maloja Plana  
**Datum:** 2026-06-14  
**Grundlage:** Aktueller `main`-Branch, Build erfolgreich  
**Scope:** Kann Maloja in seiner aktuellen Form öffentlich erreichbar gemacht werden?

---

# Prüfungen

---

## Build

| Prüfpunkt | Status | Detail |
|---|---|---|
| `npm run build` | ✓ Erfolgreich | 940ms, keine Fehler |
| Output | ✓ `dist/` vorhanden | index.html, JS, CSS, Fonts, Icons, SW, Manifest |
| Bundle-Grösse | ⚠ 705 KB (197 KB gzip) | Vite warnt ab 500 KB. Funktional kein Problem, aber über dem size-limit von 200 KB gzip. Kein Blocker. |
| Sourcemaps | ✓ Deaktiviert | `sourcemap: false` in vite.config.js |
| SpeedInsights Import | ✓ Unbedenklich | Importiert in main.jsx, aber nie gerendert → tree-shaked, nicht im Build |

---

## Routing

| Prüfpunkt | Status | Detail |
|---|---|---|
| Hash-basiertes Routing | ✓ Funktioniert | `#/dashboard`, `#/chapter/0`, etc. Browser back/forward unterstützt |
| SPA-Fallback (Vercel) | ✓ Implizit | Vite-Framework-Preset auf Vercel leitet auf `index.html` |
| `legal`-View nicht in Router-Whitelist | ⚠ Lücke | `VALID_VIEWS` in `hashRouter.js` enthält `legal` nicht. Die View funktioniert trotzdem (Navigation via `setView`), aber ein Direktlink `#/legal` wird ignoriert und zeigt Dashboard |

---

## Assets

| Prüfpunkt | Status | Detail |
|---|---|---|
| Fonts (DM Sans) | ✓ Self-hosted | 6 WOFF2-Dateien in `public/fonts/`, keine externen Requests |
| Icons | ✓ 192px + 512px PNG | In `public/`, korrekt referenziert |
| Manifest (PWA) | ✓ Vorhanden | `manifest.json` mit korrekten Angaben |
| Service Worker | ✓ Vorhanden | `sw.js`, network-first mit Offline-Fallback |
| favicon | ⚠ Fehlt | Kein `favicon.ico` in `public/`. Browsers zeigen Default-Icon in Tabs. `icon-192.png` ist als `rel="icon"` gesetzt — funktioniert in modernen Browsern, aber Safari und ältere Browser suchen `favicon.ico` |
| robots.txt | ⚠ Fehlt | Kein `robots.txt`. Suchmaschinen indexieren alles. Für eine Beta hinter Gate möglicherweise gewollt, aber ein `Disallow: /` wäre sauberer |
| Open Graph / Social Meta | ⚠ Fehlt | Keine `og:title`, `og:description`, `og:image` Tags. Links in Chat/Social zeigen nur "Maloja Plana" ohne Vorschau |

---

## Lokale Speicherung

| Prüfpunkt | Status | Detail |
|---|---|---|
| localStorage (`or5_`-Prefix) | ✓ Konsistent | Alle Keys mit `or5_` präfixiert |
| Auto-Save | ✓ 5-Sekunden-Intervall | Nur bei Änderungen, referenzbasierter Vergleich |
| Auto-Backup (IndexedDB) | ✓ Alle 12h | Max 3 Snapshots, Pruning implementiert |
| Speicher-Warnung | ✓ Implementiert | `StorageWarning` zeigt Banner bei hoher Auslastung |
| Daten-Migration | ✓ Vorhanden | `migrateData()` beim Start, versioniert |
| Daten-Validierung | ✓ Vorhanden | `validateData()` + `validateDocs()` beim Start |

---

## Mehrsprachigkeit

| Prüfpunkt | Status | Detail |
|---|---|---|
| Sprachen | ✓ DE, EN, FR, IT | Alle 4 Dateien vorhanden |
| Sprachauswahl | ✓ Im Header + Onboarding | Persistiert in localStorage |
| Impressum-Platzhalter | ✓ In allen 4 Sprachen | Gleicher Platzhalter-Text (aber: siehe Blocker C.1) |

---

## Mobile

| Prüfpunkt | Status | Detail |
|---|---|---|
| Viewport Meta | ✓ Korrekt | `viewport-fit=cover`, `initial-scale=1.0` |
| PWA-Manifest | ✓ `portrait-primary` | Standalone-Mode definiert |
| Mobile Navigation | ✓ Hamburger-Menü | `MobileNav.jsx` mit Slide-In |
| Apple-spezifisch | ✓ `apple-mobile-web-app-capable` | Status-Bar-Style gesetzt |

---

## Fehlerszenarien

| Prüfpunkt | Status | Detail |
|---|---|---|
| ErrorBoundary | ✓ Vorhanden | Zeigt Recovery-UI statt White Screen. "Try again" + "Reload" Buttons |
| localStorage voll | ✓ Gehandelt | StorageWarning + try/catch bei allen setItem-Aufrufen |
| Leere Daten | ✓ Gehandelt | Graceful Defaults (`{}`, `[]`) überall |
| Ungültiger Hash | ✓ Gehandelt | Unbekannte Views → null → Dashboard-Fallback |
| Keine Internetverbindung | ✓ Service Worker | Offline-Fallback implementiert |

---

## Datenschutz-Hinweise

| Prüfpunkt | Status | Detail |
|---|---|---|
| Datenschutzerklärung | ✓ Vorhanden | LegalView → Tab "Datenschutz" mit 5 Sektionen |
| "Kein Server" Aussage | ✓ Korrekt | Keine Backend-Kommunikation |
| Analytics-Hinweis | ⚠ Widersprüchlich | Datenschutztext sagt "Vercel Speed Insights zur anonymen Performance-Messung." Tatsächlich: SpeedInsights wird importiert aber nie gerendert → ist NICHT aktiv im Build. Der Text ist falsch — er beschreibt etwas, das nicht stattfindet |
| CSP (Content Security Policy) | ✓ Restriktiv | `connect-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'` |
| Vercel Security Headers | ✓ Gesetzt | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` |
| Cookies | ✓ Keine | Keine Cookie-Nutzung im gesamten Projekt |

---

## Impressum

| Prüfpunkt | Status | Detail |
|---|---|---|
| Impressum-Seite | ✓ Vorhanden | LegalView → Tab "Impressum" |
| Betreiber-Angaben | ✗ Platzhalter | `[Name / Organisation — Platzhalter]`, `[Adresse — Platzhalter]`, `[E-Mail — Platzhalter]` in allen 4 Sprachen |
| Feedback-E-Mail | ✗ Platzhalter | `feedback@example.com` im Footer (main.jsx Zeile ~235) |

---

## Backup-Strategie

| Prüfpunkt | Status | Detail |
|---|---|---|
| Automatisches Backup | ✓ IndexedDB, 12h-Intervall, max 3 | Lokal, kein Netzwerk |
| Manueller Export | ✓ JSON + CSV + Manifest | ZipExport.jsx |
| Verschlüsselter Export | ✓ AES-256-GCM | Web Crypto API, kein externes Dependency |
| Plaintext Export | ✓ Verfügbar | Alternative zum verschlüsselten Backup |
| Import/Restore | ✓ Implementiert | Mit Validierung und Pre-Restore-Snapshot |

---

## Export-Funktionen

| Prüfpunkt | Status | Detail |
|---|---|---|
| JSON-Export | ✓ | Alle Daten + Dokumente |
| CSV-Export | ✓ | Tabellarisch |
| Manifest-Export | ✓ | Textbasierte Übersicht |
| Lebensmappe | ✓ | Druckbare Übersicht |
| Notfalldossier | ✓ | Separate Export-Funktion |

---

## Offensichtliche Release-Blocker

| Prüfpunkt | Status | Detail |
|---|---|---|
| Beta-Code im Source | ⚠ Sichtbar | `const BETA_CODE = 'maloja2026'` in BetaGate.jsx. Jeder kann den Code im Browser-DevTools lesen. Kein Sicherheits-Blocker (es sind keine sensitiven Daten dahinter), aber kein echtes Gate |
| LICENSE-Datei | ⚠ Fehlt | `package.json` deklariert AGPL-3.0, aber keine LICENSE-Datei im Repository |
| Nutzungsbedingungen | ✓ Vorhanden | LegalView → Tab "Nutzungsbedingungen" |

---

# Kategorisierung

---

## A. Sofort releasefähig

Diese Punkte funktionieren und brauchen keine Änderung:

1. **Build** — kompiliert fehlerfrei, Output korrekt
2. **Routing** — Hash-basiert, Back/Forward, Fallback
3. **Lokale Speicherung** — Auto-Save, Migration, Validierung, Warnung
4. **Mehrsprachigkeit** — DE/EN/FR/IT vollständig
5. **Mobile** — Viewport, PWA, Navigation
6. **Fehlerszenarien** — ErrorBoundary, Offline, leere Daten
7. **Security Headers** — CSP, X-Frame-Options, Referrer-Policy
8. **Backup & Export** — Automatisch + manuell, verschlüsselt + plain
9. **Service Worker** — Offline-fähig
10. **Onboarding** — Sprache, Name, Kanton
11. **Datenschutz** — Kein Server, keine Cookies, lokale Daten

---

## B. Vor Release empfehlenswert

Kein technischer Blocker, aber sauberer mit:

1. **`legal` in Router-Whitelist aufnehmen** — `hashRouter.js`, `VALID_VIEWS`. Damit funktionieren Direktlinks auf `#/legal`
2. **robots.txt** — `User-agent: * / Disallow: /` in `public/`. Beta sollte nicht indexiert werden
3. **favicon.ico** — Aus icon-192.png generieren, in `public/` legen. Safari und ältere Browser brauchen es
4. **Analytics-Text korrigieren** — Datenschutztext erwähnt Vercel Speed Insights, aber sie sind nicht aktiv. Entweder den Text entfernen oder SpeedInsights tatsächlich einbinden
5. **Open Graph Meta-Tags** — `og:title`, `og:description` in `index.html`. Für eine Beta nicht zwingend, aber Links in Social/Chat sehen sonst kahl aus
6. **LICENSE-Datei** — AGPL-3.0-Volltext ins Repository, da package.json die Lizenz deklariert

---

## C. Echte Blocker

Diese Punkte müssen vor einem öffentlichen Release behoben werden:

### C.1 — Impressum-Platzhalter

**Was:** Impressum zeigt `[Name / Organisation — Platzhalter]`, `[Adresse — Platzhalter]`, `[E-Mail — Platzhalter]` in allen 4 Sprachen.

**Warum Blocker:** In der Schweiz ist ein Impressum mit identifizierbarem Betreiber für gewerbliche Websites erforderlich (Art. 3 UWG). Auch wenn Maloja ein Privatprojekt ist — sobald es öffentlich erreichbar ist und sich an ein Publikum richtet, gilt die Pflicht. Platzhalter-Texte in eckigen Klammern wirken unprofessionell und signalisieren "nicht fertig."

**Aufwand:** 5 Minuten. Echte Daten in `de.js`, `en.js`, `fr.js`, `it.js` eintragen.

### C.2 — Feedback-E-Mail-Platzhalter

**Was:** Footer in `main.jsx` (Zeile ~235) verlinkt auf `feedback@example.com`.

**Warum Blocker:** Ein Mailto-Link auf `example.com` funktioniert nicht. Benutzer, die Feedback geben wollen, landen im Nichts.

**Aufwand:** 1 Minute. Echte E-Mail-Adresse eintragen.

---

## D. Kann nach dem Release warten

1. **Bundle-Splitting** — 705 KB in einem Chunk. Code-Splitting mit `React.lazy()` würde die initiale Ladezeit verbessern, ist aber bei einer Beta mit wenigen Nutzern kein Problem
2. **Beta-Code Hardcoded** — `maloja2026` im Source sichtbar. Für eine echte Zugangskontrolle bräuchte es Server-seitige Validierung. Für eine Beta-Phase reicht das aktuelle Gate als Signal ("Du brauchst einen Code")
3. **SW Cache-Version** — `ordnung-ruhe-v1` sollte bei grossen Updates hochgezählt werden. Aktuell kein Problem, da die SW-Strategie network-first ist
4. **Console-Logs** — 29 `console.*`-Aufrufe im Source. Kein Nutzer-Problem (nur in DevTools sichtbar), aber für einen Production-Release ungewöhnlich

---

# Zusammenfassung

---

| Kategorie | Anzahl |
|---|---|
| A — Sofort releasefähig | 11 Punkte |
| B — Vor Release empfehlenswert | 6 Punkte |
| C — Echte Blocker | 2 Punkte |
| D — Kann nach Release warten | 4 Punkte |

**Antwort auf die Frage:** Maloja kann öffentlich erreichbar gemacht werden, sobald die 2 Blocker behoben sind. Beide sind Textänderungen — zusammen unter 10 Minuten Aufwand.

Alles andere funktioniert.
