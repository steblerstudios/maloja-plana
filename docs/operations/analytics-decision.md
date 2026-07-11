# Analytics — Entscheidung & Weg (Decision Record)

**Datum:** 2026-07-05 · **Entscheid die Inhaberin:** „Weg 1 jetzt, Weg 2 später."

## Ausgangslage / Spannung

Maloja verspricht an mehreren gut sichtbaren Stellen ausdrücklich **kein Tracking,
keine Analytics**:

- Header-Badge (immer sichtbar): „100% lokal — Deine Daten bleiben auf diesem Gerät"
- `trust.hosting2`: „Es gibt keine Analyse-Cookies, kein Tracking, keine Social-Media-Plugins und keine Werbung."
- `trust.principles1`: „… Kein Konto, kein Tracking, kein Profiling."
- `Onboarding.jsx`, `NotificationSettings.jsx`, `public/sw.js` (Code-Kommentare): „zero tracking, zero analytics"

Dazu Architektur-Sperren:
- **CSP `script-src 'self'`** → externe Analytics-Skripte (Plausible/Matomo-Cloud) sind unmöglich.
- **Kein Backend** (Kern-Constraint) → self-hosted Matomo scheidet aus.

→ Jede *In-App*-Analytics — auch „cookieless" — würde ein Kernversprechen brechen.

## Weg 1 — Server-Log-Statistik (JETZT, kein Code)

> 📋 Schritt-für-Schritt-Runbook zum Abarbeiten: [`analytics-weg1-anleitung.md`](analytics-weg1-anleitung.md)
> (Infomaniak-Klicks, Datenschutz-Check nach revDSG, Pitch-Zahlen-Vorlage, Quartals-Rhythmus).

**Wichtig:** `trust.hosting1` deklariert die Server-Logs bereits („technische Daten
— IP-Adresse, Browsertyp — in Server-Logs verarbeitet und automatisch gelöscht").
Deren **aggregierte** Auswertung bricht daher **kein** Versprechen: keine Cookies,
kein Skript, kein Client-Code, „kein Tracking" bleibt wörtlich wahr.

**So an die Zahlen kommen (Infomaniak, nichts zu bauen):**
1. Infomaniak Manager → *Hosting / Hébergement Web* → Website `malojaplana.ch`.
2. Bereich **Statistiken / Statistiques** (AWStats bzw. Webalizer, aus den Server-Logs generiert):
   Besuche, eindeutige Besucher (IP-aggregiert), Seitenaufrufe, Referrer, Länder,
   Browser, meistbesuchte Pfade.
3. Optional: **Roh-Logs** via Manager/FTP (Logs-Verzeichnis) herunterladen für eigene
   Aggregation.

Reicht für Pitch/PoC: „X Besuche/Monat, grobe Herkunft, welche Bereiche werden geöffnet".
Grenze: Hash-Routing (`#/…`) erscheint NICHT im Server-Log (der Fragment-Teil wird nie
gesendet) — Server-Logs zeigen also Seitenaufrufe/Besuche, aber **nicht**, welche
In-App-Views (Dashboard/Situationen/PDF-Export) genutzt werden. Genau diese
Nutzungstiefe ist der Grund für Weg 2.

## Weg 2 — First-party Privacy-Analytics (SPÄTER, braucht Grundsatz-Ja)

Ziel: anonyme, aggregierte **In-App-Ereignisse** (z. B. „Dashboard geöffnet",
„Situation gewählt", „PDF exportiert", „Kanton-Gruppe") — ohne Cookie, ohne Personendaten.

**Blocker, die zuerst zu klären sind:**
- Braucht einen **eigenen Mini-Endpoint** (first-party, `connect-src 'self'`-konform) →
  berührt den „kein Backend"-Constraint → an die Backend-Grundsatzfrage gekoppelt
  (siehe Memory `project_backend_accounts_direction`, E2E-Opt-in-Idee).
- **Copy ehrlich machen** (sonst falsches Versprechen). Genaue Stellen:
  - `trust.hosting2` (i18n, alle 5 Sprachen)
  - `trust.principles1` (i18n)
  - Kommentare in `Onboarding.jsx`, `NotificationSettings.jsx`, `public/sw.js`
  - **Bleibt wahr und muss NICHT geändert werden:** Badge/`trust.localOnly`
    („Daten bleiben auf diesem Gerät") — solange keine Personendaten gesendet werden;
    Claim „finanziert sich nicht mit deinen Lebensdaten".
- Neue Formulierung z. B.: „datenschutzfreundliche, anonyme Nutzungsstatistik —
  keine Personendaten, keine Cookies, keine Weitergabe."

**Nicht ohne Gespräch bauen.** Erst wenn die Backend-/Endpoint-Richtung entschieden ist.
