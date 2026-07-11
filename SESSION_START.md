# SESSION START — zuerst lesen

> Die **objektive, repo-interne Wahrheit** über den aktuellen Stand. Am Sitzungs-Ende
> aktualisieren (via `/session-close`). Bei Widerspruch zu anderen Docs gilt
> **diese** Datei. Persönliche Session-Historie/Ideen → Claude-Memory, nicht hierher.
>
> Boot: `npm run dev` (Port 5174, via `.claude/launch.json`). Deploy: `bash deploy.sh`
> von `main` (nur Stebler Studios). Verifizieren live: Footer-Version + Bundle-Hash greppen.

**Stand:** 2026-07-11 (Governance + PII-Session)

## Wo stehen wir gerade

| | |
|---|---|
| Aktueller Branch | `main` |
| `main` steht auf | `b3c940e` — Squash-Merge PR #44 (PII-Bereinigung + PII-Scan-Gate) |
| Version (package.json) | `0.1.24-beta` |
| Letzter Tag | `v0.1.24-beta` |
| **Runde 2026-07-11** | **Alles gemergt (PRs #37–#44).** Offen nur PR #45 (CI-PII-Scan). |

**Sitzung 2026-07-11 (Governance + Datenschutz):** Grosse Session nach der Feature-Runde. Gebaut/gemergt:
- **Entscheidungsmatrix + C-Suite-Firmenmodell** (`docs/context/ENTSCHEIDUNGSMATRIX.md`, PR #41): Ampel 🟢/🟡/🔴 für Claude-Autonomie; Berater→Inhaberin→Ausführung. Merge=Doku-selbst/App-Code wartet; Push-Zweig frei.
- **`/maloja-blick`** (Sicht-Review des Gerenderten, WCAG 2.2), **Statistik-Ritual** (`docs/STATISTIK.md`, PR #38), **CFO-Gerüst** „Wie trägt sich Maloja?" (`docs/operations/tragfaehigkeit-cfo.md`, PR #43), Doku-Drift dev→GitHub-Flow (PR #40), Chip-Fix (PR #37), LOOPS+blick (PR #39).
- **PII-BEREINIGUNG** (PR #44, squash): Vorname→„Stebler Studios", private Gmail+tote steblerstudios.ch→`info@malojaplana.ch`, Mac-User-Pfad gescrubbt, 7 Tester-Vornamen (inkl. Mutter)→„Testperson A–G", SFTP-Host/User/Pfad→gitignoriertes `.deploy.local`. **PII-Scan** `scripts/pii-scan.sh` als 🔴-Gate in `/maloja-predeploy`; CI-Variante = PR #45.
- ⚠️ **Merge-Falle gelernt:** PR #42 nahm nur 1 von 4 Commits (PII blieb kurz live) → PR #44 nachgeholt. Regel: **„Squash and merge"** bei mehreren Commits.

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

1. **⭐ ERSTER PUNKT NÄCHSTE SESSION (Sophie-Entscheid „unbedingt"): Git-Historie-Purge.**
   Der Working Tree ist PII-sauber, aber die **Git-Historie** und **`docs/archive`**
   enthalten weiter Alt-PII: Vorname, private Gmail, Tester-Namen — und heikle Persona-
   Beispiele mit echtem Namen+Geburtsjahr+Kanton+Zivilstand („… geboren 1989, wohnhaft
   Basel-Stadt, ledig, lebt alleine"). Wird zwar nie deployt (nur `dist/`), steht aber
   öffentlich auf GitHub. **Fokussiert planen** (wie PII-Purge 2026-07-09): erst Working-
   Tree-Archiv bereinigen, dann Historie umschreiben (`git filter-repo`), Force-Push,
   alle Klone/offenen PRs beachten. Details: Memory [[feedback_no_owner_name_in_git]].
2. **PR #45 (CI-PII-Scan) mergen** — dann fängt die CI private Daten bei jedem Push ab.
   Optional Repo-Secret `PII_DENY` setzen (Namen etc.) für volle Abdeckung.
3. **Offen bei Sophie:** `settings.json` `allow`-Zeile für Push-Freigabe
   (`open -e .claude/settings.json`), und ggf. Prod-Deploy von `b3c940e` + live gegen
   Bundle-Hash verifizieren (die meisten Änderungen sind Doku/Kommentare; App-relevant
   nur Chip-Fix #37 + Führerausweis aus der Vorrunde).
4. Offen a11y (nicht-blockierend): #4 Fokusring-Farbe (Kür). rm-Gegenlese
   (Führerausweis + fr/it/rm generell). Nächste Ressort-Lücke: CFO-Kostenseite befüllen.

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
