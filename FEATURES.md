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

**Stand:** 2026-07-11 · **Live-verifiziert: App-Bundle `index-d1dacdf3.js`** (curl auf malojaplana.ch == frischer main-Build `717a389`; Vite-Content-Hash identisch = byte-genau; SW-Cache live `maloja-plana-d1dacdf3`, Manifest `short_name` „Maloja Plana"). `main` steht auf `717a389` (Merge PR #35).

| Feature | Status | Tag/Commit | Belegt durch / offen |
|---|---|---|---|
| Runde 2026-07-11 (PR #23–#35): PWA-Cache-Hash-SW + Home-Screen-Name/Icon, Beta-Code-SHA256, Wartungsseite, Führerausweis-Ablauf, blick-situationen (Speicher-Satz/44px/Panel-Scroll), Feedback-Mail vorbefüllt + Bugfix-Doku, a11y-Kontrast-Sweep (goldDeep/roseDeep/onSand/sageBtn/roseBtn/`--mp-focus`) | `verified-live` | `717a389` | Live-Hash `index-d1dacdf3.js` == main-Build; 611 Tests grün, Size 64.21/65 kB (2026-07-11) |
| Release `0.1.24-beta` (Gepäck-Kür, a11y-Review, Linkshänder-Modus u.a.) | `verified-live` | `v0.1.24-beta` | in `main`/live enthalten, Hash bestätigt |

> ⚠️ Runde 2026-07-11 ging **ohne Version-Bump** live (noch `0.1.24-beta`) → beim nächsten Release nachziehen. Offene ⚠️ (nicht-blockierend) siehe `SESSION_START.md` → Nächste Schritte.

## Wie pflegen

- Neues Feature gebaut → Zeile mit `built` anlegen.
- Nach `bash deploy.sh` → auf `deployed` heben.
- Nach Live-Gegenprüfung → `verified-live`, Beleg (Hash) in letzte Spalte.
- Lange stabil live → Zeile entfernen, Ledger schlank halten.
