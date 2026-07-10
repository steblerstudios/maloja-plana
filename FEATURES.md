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

**Stand:** 2026-07-10 · **Live-verifiziert: App-Bundle `index-1fb26e10.js`** (curl auf malojaplana.ch == frischer main-Build; Vite-Content-Hash identisch = byte-genau). `main` steht auf `79f78d2`; die Commits nach `0ebb865` (Stage-Deploy-Skript, Leitplanken, PR #21-Config/Docs) ändern **keinen App-Code** → dasselbe Bundle bleibt live.

| Feature | Status | Tag/Commit | Belegt durch / offen |
|---|---|---|---|
| a11y-Pass 3 (PR #19): Tresor-Labels, goldDeep-Token, Onboarding Zurück/Skip/Fortschritt, Arztkoffer-Kontrast, Rechner-Reiter-Scroll, roseDeep-Fix, Torten-SVG aria-hidden | `verified-live` | `0ebb865` (Merge PR #19) | Live-Hash `index-1fb26e10.js` == main-Build (2026-07-10) |
| Release `0.1.24-beta` (Gepäck-Kür, a11y-Review, Linkshänder-Modus u.a.) | `verified-live` | `v0.1.24-beta` | in `main`/live enthalten, Hash bestätigt |
| Kapitalbezugssteuer (Bund Art.38 DBG ÷5 + Kanton) | `verified-live` | `e4fe262` | in `main` (Vorfahr von `0ebb865`) = Teil des Live-Builds `index-1fb26e10.js`; 535 Tests grün, browserverif |

## Wie pflegen

- Neues Feature gebaut → Zeile mit `built` anlegen.
- Nach `bash deploy.sh` → auf `deployed` heben.
- Nach Live-Gegenprüfung → `verified-live`, Beleg (Hash) in letzte Spalte.
- Lange stabil live → Zeile entfernen, Ledger schlank halten.
