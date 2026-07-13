# FEATURES — Verifikations-Ledger

> Eine Zeile je End-to-End-Feature **in Bewegung**. Kein Voll-Inventar — nur was gerade
> gebaut/deployt/geprüft wird. Erledigt + lange live-stabil → darf raus (Historie steht in
> CHANGELOG/Git).
>
> **Statuswerte (der Reihe nach):**
> - `built` — im Code, lokal getestet, aber nicht deployt.
> - `deployed` — via `bash deploy.sh` auf malojaplana.ch geladen.
> - `verified-live` — **auf der Live-Seite gegengeprüft** (Footer-Version + Bundle-Hash,
>   Feature sichtbar/funktioniert). Erst dann gilt es als fertig.
>
> Regel: `verified-live` NIE setzen, ohne live geschaut zu haben. Genau dafür ist die
> Spalte da.

**Stand:** 2026-07-13 · **Live:** App-Bundle `index-8aeb4a84.js` auf malojaplana.ch = frischer `main`-Build (`main` = `69ea85e`, Merge PR #69). Die Runde 2026-07-12/13 (PRs #47–#58) **und die Runden 2 (IPV-Lebenslinie Ph2) + 3 (AHV-21-Referenzalter, Tresor-Fundament dormant)** sind **deployt + verified-live** (Live-Hash `index-8aeb4a84.js` frisch gegengeprüft 2026-07-13; `.maloja/predeploy-ok` = `69ea85e`).

| Feature | Status | Tag/Commit | Belegt durch / offen |
|---|---|---|---|
| a11y-Pass 3 (PR #19): Tresor-Labels, goldDeep-Token, Onboarding Zurück/Skip/Fortschritt, Arztkoffer-Kontrast, Rechner-Reiter-Scroll, roseDeep-Fix, Torten-SVG aria-hidden | `verified-live` | `0ebb865` (Merge PR #19) | Live-Hash `index-1fb26e10.js` == main-Build (2026-07-10) |
| Release `0.1.24-beta` (Gepäck-Kür, a11y-Review, Linkshänder-Modus u.a.) | `verified-live` | `v0.1.24-beta` | in `main`/live enthalten, Hash bestätigt |
| Kapitalbezugssteuer (Bund Art.38 DBG ÷5 + Kanton) | `verified-live` | `e4fe262` | in `main` (Vorfahr von `0ebb865`) = Teil des Live-Builds `index-1fb26e10.js`; 535 Tests grün, browserverif |
| Runde 2026-07-12 UI/a11y (Mammografie-Geo, SEO-robots, Feld-Labels, Kalenderband-mobil, ScrollFade-Reiter, 44px-Tap-Targets) | `verified-live` | `18df05b` (PRs #47–#53) | Teil von `main` `5c64527`, Live-Hash `index-59c9c3e4.js` == main-Build (2026-07-13) |
| Mammografie-Fakten-Fix (Franchise entfällt, nur 10% Selbstbehalt + Kantonsliste +GL/SH) | `verified-live` | PR #55 (`f202b13`) | swiss-precision + swisscancerscreening.ch/KVG Art.64 belegt; in Live-Bundle |
| PII-Scan-Gate + Scrub (Alt-Mails/Vorname aus getrackten Dateien) | `verified-live` | PR #54 (`c4c2a91`) | `scripts/pii-scan.sh` Exit 0; in Live-Bundle |
| Anspruchs-Instrumente: IPV-Prämien-Beleg (Papier) + Sozialhilfe-Pegel (Glas) im Leistungs-Schnellcheck — reine Anzeige über calculateIPV/-Sozialhilfe, Berechnung unberührt; Vermögens-Gate + AA-Kontrast | `verified-live` | PR #58 (`5c64527`) | Live-Hash `index-59c9c3e4.js` == main-Build; Tests grün, i18n 5 Spr. Phase 2 → nächste Zeile |
| **IPV-Lebenslinie Phase 2** (statefull Beleg: geschätzt→beantragt→bestätigt/Stempel→jährlich, additives `data.anspruch.ipv`) + a11y-Härtung (role='img' raus, Farbenblind-Balken) + Subsidiaritäts-Fix (IPV+Sozialhilfe nicht mehr doppelt) + Sozialhilfe-Rückerstattung (Copy belegt korrigiert + Rechner) | `verified-live` | `main` via PR #60 (`91405d8`·`671da78`·`f987d06` + Predeploy-Fixes `b090feb`·`382042e`) | **Live** (Live-Hash `index-8aeb4a84.js` == `main`-Build `69ea85e`, frisch gegengeprüft 2026-07-13). Predeploy-Runde 2 grün (5 branch-🔴 gefixt: Stempel/Kompass/Vanish/Total/Sie-Du), ZH-Rückerstattungsbeträge live gegen ZH-Handbuch 15.2.03 §27 SHG verifiziert. calculateIPV/-Sozialhilfe unberührt |
| **AHV-21-Referenzalter der Frauen** (JG 1961–63 gestaffelt, monatsgenau, konsistent in Hauptergebnis + Vergleichstabelle + Zukunftsbild) + **Tresor-Lock-Fundament** (cryptoCore/secureStore, AES-256-GCM/PBKDF2, **dormant/unverdrahtet**) | `verified-live` | `main` via PRs #62/#63 + Fixes #65/#66/#68 (`69ea85e`) | **Live** (Live-Hash `index-8aeb4a84.js` == `main`-Build `69ea85e`, frisch gegengeprüft 2026-07-13). Predeploy-Runde 3 (19 Agenten) grün: AHV-Referenzalter swiss-precision-verifiziert (JG1962→2'341.33/0 %), Crypto-Primitive solide. **Tresor bleibt dormant/unverdrahtet — Tresor-🔴 (Dokumente unverschlüsselt etc.) als Phase-2b-Blocker geparkt** (`docs/design/tresor-lock.md`). Offen: AHV Phase B (Kürzungssätze). |

## Wie pflegen

- Neues Feature gebaut → Zeile mit `built` anlegen.
- Nach `bash deploy.sh` → auf `deployed` heben.
- Nach Live-Gegenprüfung → `verified-live`, Beleg (Hash) in letzte Spalte.
- Lange stabil live → Zeile entfernen, Ledger schlank halten.
