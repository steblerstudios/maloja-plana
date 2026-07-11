# SESSION START — zuerst lesen

> Die **objektive, repo-interne Wahrheit** über den aktuellen Stand. Am Sitzungs-Ende
> aktualisieren (via `/session-close`). Bei Widerspruch zu anderen Docs gilt
> **diese** Datei. Persönliche Session-Historie/Ideen → Claude-Memory, nicht hierher.
>
> Boot: `npm run dev` (Port 5174, via `.claude/launch.json`). Deploy: `bash deploy.sh`
> von `main` (nur Stebler Studios). Verifizieren live: Footer-Version + Bundle-Hash greppen.

**Stand:** 2026-07-11

## Wo stehen wir gerade

| | |
|---|---|
| Aktueller Branch | `main` (PR #22 gemergt) |
| `main` steht auf | `8b6727b` — Merge PR #22 (session-start-sync); **App-Code seit `0ebb865` unverändert** |
| Version (package.json) | `0.1.24-beta` |
| Letzter Tag | `v0.1.24-beta` |
| **Runde 2026-07-11** | **10 Commits auf 8 Feature-Branches, reviewed (inkl. `ultrareview`), NICHT gemergt/deployt** |

**Offene Runde (Branches über `main`, alle gepusht):** `feat/pwa-cache-hash` (2 — PWA-Cache an Bundle-Hash + Home-Screen-Name/Icon), `feat/betacode-hash` (Beta-Code als SHA-256, raus aus Public-Repo), `feat/wartungsseite` (2 — ruhige Wartungsseite statt Apache-404), `feat/a11y-rose-text` (rose→roseDeep AA), `feat/a11y-labels` (Haushalt role=group), `feat/fuehrerausweis` (Führerschein-Ablauf, ch.ch/ASTRA, 5 Spr.), `feat/a11y-soft-contrast` (soft→#64676E AA auf Karten), `chore/deploy-gate` (Doku Prod-Review-Ring + gitignore). **Reviews grün** (code/security/a11y/design + ultra). ⚠️ `feat/fuehrerausweis` rm = Best-Effort → Gegenlese. Wegwerf-Branch `integration/round-2026-07-11` (Parallel-Session-Testmerge, `b7b1daa`) nach den echten PRs löschen.

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
    (`index-8dc0e122.js`); Stebler Studios musste neu bauen + `deploy.sh`. Nach jedem Merge
    prüfen, dass `deploy.sh` wirklich frisch baut.
- **GitHub Flow ist scharf:** `main` = einziger Stamm, kein `dev`, kein Sync-back.
  Ablauf `feat/…` → `deploy.sh --stage` → PR→main → `deploy.sh`; Qualitäts-Ring je
  Schicht (`DEV_WORKFLOW.md`). `/session-close` schliesst Sitzungen ab. Kapitalbezugs-
  steuer (`e4fe262`) ist in `main` und live.

## Nächste Schritte

1. **Runde 2026-07-11 mergen + deployen** — die 8 Feature-Branches (10 Commits) sind
   reviewed + ready. Weg: PR je Branch → `main`, dann `bash deploy.sh` (Prod). ⚠️ Neu:
   der **Deploy-Gate-Hook** blockt `bash deploy.sh` ohne frische `.maloja/predeploy-ok`-
   Marke → vorher `/maloja-predeploy` in der interaktiven CLI (schreibt die Marke). Der
   Hook wird erst nach `/hooks`-Reload/Neustart aktiv. `feat/pwa-cache-hash` liegt schon
   auf Stage (Handy-Test „Zum Startbildschirm hinzufügen" offen).
2. **Nach Prod-Deploy:** live gegen die neuen Bundle-Hashes verifizieren (die Runde ändert
   App-Code: Führerausweis-Chunk, BetaGate, a11y-Tokens) → `FEATURES.md` = verified-live.
3. Offen a11y (nicht-blockierend): #4 Fokusring-Farbe (Kür). #3 soft-auf-Karten ✅ gelöst
   (`feat/a11y-soft-contrast`). rm-Gegenlese (Führerausweis + fr/it/rm generell).

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
