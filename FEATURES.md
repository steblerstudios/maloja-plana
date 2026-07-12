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

**Stand:** 2026-07-12 · **Live:** App-Bundle `index-d1dacdf3.js` auf malojaplana.ch (Stand VOR der Runde 2026-07-12). `main` = `18df05b`; die Runde 2026-07-12 (PRs #47–#55) ist **gebaut + in `main`, Deploy-Gate grün (Marke gesetzt), aber NOCH NICHT deployt** → neuer Build `index-ed070bd9.js` wird beim nächsten `bash deploy.sh` live.

| Feature | Status | Tag/Commit | Belegt durch / offen |
|---|---|---|---|
| a11y-Pass 3 (PR #19): Tresor-Labels, goldDeep-Token, Onboarding Zurück/Skip/Fortschritt, Arztkoffer-Kontrast, Rechner-Reiter-Scroll, roseDeep-Fix, Torten-SVG aria-hidden | `verified-live` | `0ebb865` (Merge PR #19) | Live-Hash `index-1fb26e10.js` == main-Build (2026-07-10) |
| Release `0.1.24-beta` (Gepäck-Kür, a11y-Review, Linkshänder-Modus u.a.) | `verified-live` | `v0.1.24-beta` | in `main`/live enthalten, Hash bestätigt |
| Kapitalbezugssteuer (Bund Art.38 DBG ÷5 + Kanton) | `verified-live` | `e4fe262` | in `main` (Vorfahr von `0ebb865`) = Teil des Live-Builds `index-1fb26e10.js`; 535 Tests grün, browserverif |
| Runde 2026-07-12 UI/a11y (Mammografie-Geo, SEO-robots, Feld-Labels, Kalenderband-mobil, ScrollFade-Reiter, 44px-Tap-Targets) | `built` | `18df05b` (PRs #47–#53) | Tests 611 grün, Build sauber, Deploy-Gate grün; pending `deploy.sh` |
| Mammografie-Fakten-Fix (Franchise entfällt, nur 10% Selbstbehalt + Kantonsliste +GL/SH) | `built` | PR #55 (`f202b13`) | swiss-precision + swisscancerscreening.ch/KVG Art.64 belegt |
| PII-Scan-Gate + Scrub (Alt-Mails/Vorname aus getrackten Dateien) | `built` | PR #54 (`c4c2a91`) | `scripts/pii-scan.sh` Exit 0 |

## Wie pflegen

- Neues Feature gebaut → Zeile mit `built` anlegen.
- Nach `bash deploy.sh` → auf `deployed` heben.
- Nach Live-Gegenprüfung → `verified-live`, Beleg (Hash) in letzte Spalte.
- Lange stabil live → Zeile entfernen, Ledger schlank halten.
