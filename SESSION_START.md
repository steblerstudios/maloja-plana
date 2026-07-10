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
| Aktueller Branch | `main` (PR #19 gemergt) |
| `main` steht auf | `0ebb865` — Merge PR #19 (a11y-Pass 3) |
| Version (package.json) | `0.1.24-beta` |
| Letzter Tag | `v0.1.24-beta` |

## Verifikations-Status (das Wichtigste)

> Feature-für-Feature-Detail (built/deployed/verified-live): [`FEATURES.md`](FEATURES.md).


- **Live-verifiziert (aktuell):** `main` = `0ebb865` → Bundle `index-1fb26e10.js`.
  curl auf malojaplana.ch zeigt denselben Content-Hash wie der frische main-Build =
  byte-genau live. a11y-Pass 3 ist live. (Geprüft 2026-07-10.)
  - Falle dabei aufgedeckt: erster Deploy nach dem Merge war noch der alte Build
    (`index-8dc0e122.js`); Sophie musste neu bauen + `deploy.sh`. Nach jedem Merge
    prüfen, dass `deploy.sh` wirklich frisch baut.
- **Gebaut, aber NICHT in `main`/live:** Kapitalbezugssteuer `231c8a1` (auf dev, 535 Tests
  grün) — separater Deploy nötig.

## Nächste Schritte

1. Harness-Plan (`docs/context/HARNESS_PLAN.md`) ist umgesetzt — Schritte 1–3 fertig,
   erster Verifikations-Kreis 2026-07-10 geschlossen.
2. Offene a11y-Folge-Batches (rose-Text-Reste, soft-auf-Karten, Fokusfarbe,
   Label-Kopplung Haushalt+Upload).
3. Kapitalbezugssteuer `231c8a1` von dev nach `main` bringen + deployen.

## Merker (Fallen)

- Neue `<button>`/Titel IMMER `color` setzen (Dark-Mode-Falle).
- Bei i18n-Edits zügig committen.
- Parallel-Sitzung im selben Working Tree: nur eigene Dateien stagen.
- Onboarding-Bypass zum Testen: `or5_onboarding_done` / `or5_lang` / `or5_tour_done` = true.
