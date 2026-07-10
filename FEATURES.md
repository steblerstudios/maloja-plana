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

**Stand:** 2026-07-10 · Basis-Live-Verifikation: `0.1.23-beta` = `e45ec3c`

| Feature | Status | Tag/Commit | Belegt durch / offen |
|---|---|---|---|
| Release `0.1.24-beta` (Gepäck-Kür, a11y-Review, Linkshänder-Modus u.a.) | `deployed` | `v0.1.24-beta` | **Live-Check offen** — Footer + Hash noch nicht gegengeprüft |
| a11y-Pass: Tresor-Labels, goldDeep-Token, Onboarding-Zurück | `built` | `fec8d34`/`711822c`/`465bf2c` (Branch `a11y/pass3-tresor-labels`) | 3 Commits noch nicht auf `main` |
| a11y: roseDeep-Importfix, Torten-SVG aria-hidden | `built` | `2e8f6b8` (`main`) | auf `main`, aber undeployt |
| Kapitalbezugssteuer (Bund Art.38 DBG ÷5 + Kanton) | `built` | `231c8a1` (dev) | 535 Tests grün, browserverif; noch nicht deployt |

## Wie pflegen

- Neues Feature gebaut → Zeile mit `built` anlegen.
- Nach `bash deploy.sh` → auf `deployed` heben.
- Nach Live-Gegenprüfung → `verified-live`, Beleg (Hash) in letzte Spalte.
- Lange stabil live → Zeile entfernen, Ledger schlank halten.
