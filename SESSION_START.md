# SESSION START — zuerst lesen

> Die **objektive, repo-interne Wahrheit** über den aktuellen Stand. Am Sitzungs-Ende
> aktualisieren (Schritt 3 des Harness-Plans). Bei Widerspruch zu anderen Docs gilt
> **diese** Datei. Persönliche Session-Historie/Ideen → Claude-Memory, nicht hierher.
>
> Boot: `npm run dev` (Port 5174, via `.claude/launch.json`). Deploy: `bash deploy.sh`
> von `main` (nur Sophie). Verifizieren live: Footer-Version + Bundle-Hash greppen.

**Stand:** 2026-07-10

## Wo stehen wir gerade

| | |
|---|---|
| Aktueller Branch | `a11y/pass3-tresor-labels` (Feature-Branch, WIP) |
| `main` steht auf | `2e8f6b8` — a11y: roseDeep-Importfehler + Torten-SVG aria-hidden |
| Version (package.json) | `0.1.24-beta` |
| Letzter Tag | `v0.1.24-beta` |

## Verifikations-Status (das Wichtigste)

- **Live-verifiziert zuletzt:** `0.1.23-beta` = `e45ec3c` (Footer + Hash bestätigt).
- **Deployt, aber NICHT live-verifiziert:** `v0.1.24-beta`. Sophie hat deployt, aber
  Footer-Version/Bundle-Hash wurden nie live gegengeprüft. → **Nächste Sitzung zuerst
  live prüfen** (Footer soll `v0.1.24-beta` zeigen).
- **Gebaut, aber undeployt:** `main` ist seit dem Tag um a11y-Commits weitergewandert;
  Feature-Branch `a11y/pass3-tresor-labels` hat 3 weitere Commits (`fec8d34`, `711822c`,
  `465bf2c`) noch nicht auf `main`.
- **Uncommittet im Working Tree:** `src/VorsorgeRechner.jsx` (M) — vermutlich
  Parallel-Sitzung; NICHT anfassen, nur eigene Dateien stagen (kein `git add -A`).

## Nächste Schritte

1. `v0.1.24-beta` live gegenprüfen (Footer + Bundle-Hash), Ergebnis hier eintragen.
2. Harness-Plan weiter: Schritt 2 `FEATURES.md`-Ledger, Schritt 3 Session-Ende-Ritual
   (siehe `docs/context/HARNESS_PLAN.md`).
3. Offene a11y-Folge-Batches (rose-Text-Reste, soft-auf-Karten, Fokusfarbe,
   Label-Kopplung Haushalt+Upload).

## Merker (Fallen)

- Neue `<button>`/Titel IMMER `color` setzen (Dark-Mode-Falle).
- Bei i18n-Edits zügig committen.
- Parallel-Sitzung im selben Working Tree: nur eigene Dateien stagen.
- Onboarding-Bypass zum Testen: `or5_onboarding_done` / `or5_lang` / `or5_tour_done` = true.
