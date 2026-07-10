# SESSION START — zuerst lesen

> Die **objektive, repo-interne Wahrheit** über den aktuellen Stand. Am Sitzungs-Ende
> aktualisieren (via `/session-close`). Bei Widerspruch zu anderen Docs gilt
> **diese** Datei. Persönliche Session-Historie/Ideen → Claude-Memory, nicht hierher.
>
> Boot: `npm run dev` (Port 5174, via `.claude/launch.json`). Deploy: `bash deploy.sh`
> von `main` (nur Sophie). Verifizieren live: Footer-Version + Bundle-Hash greppen.

**Stand:** 2026-07-10

## Wo stehen wir gerade

| | |
|---|---|
| Aktueller Branch | `main` (PR #21 gemergt) |
| `main` steht auf | `8e0d15e` — Merge PR #21 (GitHub-Flow-Feinschliff + Skill-Tracking) |
| Version (package.json) | `0.1.24-beta` |
| Letzter Tag | `v0.1.24-beta` |

## Verifikations-Status (das Wichtigste)

> Feature-für-Feature-Detail (built/deployed/verified-live): [`FEATURES.md`](FEATURES.md).


- **Live-verifiziert:** App-Bundle `index-1fb26e10.js` (a11y-Pass 3) ist byte-genau
  live — curl auf malojaplana.ch = frischer main-Build (geprüft 2026-07-10).
  `main` steht seither auf `8e0d15e`; die Commits nach `0ebb865` (PR #20 Stage-Umgebung
  = `deploy.sh`, Leitplanken = docs, PR #21 = ci/deploy/docs/vite + `.claude/skills`)
  ändern **keinen App-Code** → das live ausgelieferte Bundle ist unverändert. Der
  Bundle-Hash von `8e0d15e` selbst wurde noch nicht neu gegen live geprüft (kein
  App-Deploy nötig).
  - Falle dabei aufgedeckt: erster Deploy nach dem Merge war noch der alte Build
    (`index-8dc0e122.js`); Sophie musste neu bauen + `deploy.sh`. Nach jedem Merge
    prüfen, dass `deploy.sh` wirklich frisch baut.
- **GitHub Flow ist scharf:** `main` = einziger Stamm, kein `dev`, kein Sync-back.
  Ablauf `feat/…` → `deploy.sh --stage` → PR→main → `deploy.sh`; Qualitäts-Ring je
  Schicht (`DEV_WORKFLOW.md`). `/session-close` schliesst Sitzungen ab. Kapitalbezugs-
  steuer (`e4fe262`) ist in `main` und live.

## Nächste Schritte

1. **Stage steht ✅** — `stage.malojaplana.ch` liefert die App (HTTP 200, Sophie
   geprüft 2026-07-10); `STAGE_REMOTE_DIR` in `deploy.sh` bestätigt korrekt. Der
   GitHub-Flow-Ring (Werkbank → `deploy.sh --stage` → PR → Prod) ist damit voll
   einsatzbereit.
2. Offene a11y-Folge-Batches (rose-Text-Reste, soft-auf-Karten, Fokusfarbe,
   Label-Kopplung Haushalt+Upload).

## Nicht anfassen (Leitplanken)

> Gerettet aus dem archivierten `PROJECT_STATUS.md`/`PROJECT_HANDOFF.md`. Identität
> (Zero-Deps, Offline/Calm/Deterministic/Privacy) steht in `CLAUDE.md` — hier nur die
> konkreten Do-Not-Touch-Punkte.

- **localStorage-Keys `or5_*`** — keine Migrationen ohne ausdrückliche Freigabe (User-Daten).
- **Dependencies** — nur React + React-DOM als Runtime-Deps; kein Bloat.
- **Build-Budget** — Phase 1 < 200 KB gzip, Phase 2 < 250 KB gzip.
- **Build-Tool Vite** und **Inline-Styles/tokens.css** nicht wechseln (kein CSS-in-JS).
- **SKOS Grundbedarf** — pauschal nach Haushaltsgrösse ist *bewusste* Vereinfachung (KI-001), kein Refactoring.
- **PremiumSubsidy/IPV-Berechnung** — nicht anfassen.
- **Gross/Netto-Toggle** und **Multi-Person-Haushaltsmodell** — bewusst zurückgestellt.
- **KI-007:** kein Web-Crypto-Fallback — offen, niedrige Priorität.

## Merker (Fallen)

- Neue `<button>`/Titel IMMER `color` setzen (Dark-Mode-Falle).
- Bei i18n-Edits zügig committen.
- Parallel-Sitzung im selben Working Tree: eigenen Branch ab `main` nehmen (nicht nur
  eigene Dateien stagen — Datei-Isolation ≠ Branch-Isolation; teuer gelernt bei PR #19).
- Onboarding-Bypass zum Testen: `or5_onboarding_done` / `or5_lang` / `or5_tour_done` = true.
