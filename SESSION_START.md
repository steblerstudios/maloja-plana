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
| Aktueller Branch | `main` (Historie 2026-07-11 umgeschrieben) |
| `main` steht auf | `548530a` — chore(privacy): dekorativer Name raus / Rechts-Anker behalten |
| Version (package.json) | `0.1.24-beta` |
| Letzter Tag | `v0.1.24-beta` |
| Live (malojaplana.ch) | Bundle `index-d1dacdf3.js` |
| **Runde 2026-07-11** | **✅ GEMERGT (PRs #37–#44): Führerausweis, Wartungsseite, BetaGate-Hash, Linkshänder, a11y-Sweep, PWA-Cache — alle in `main`** |

**⚠️ HISTORIE UMGESCHRIEBEN 2026-07-11:** Alle Commit-Hashes vor heute haben sich geändert (Privatsphäre-Purge: `sophie.stebler@gmail.com` + `sophie@stebler.ch` raus, alle Autoren → „Stebler Studios"). `main` + alle 15 Tags force-gepusht, 22 Alt-Branches gelöscht. **Details/Residual (GitHub-Support-Ticket für PR-Refs offen)** in Claude-Memory `feedback_no_owner_name_in_git`. Backups: `~/Projects/_maloja-archiv/maloja-github-mirror-preHistoryPurge-*.git`.

## Verifikations-Status (das Wichtigste)

> Feature-für-Feature-Detail (built/deployed/verified-live): [`FEATURES.md`](FEATURES.md).


- **Live:** Bundle `index-d1dacdf3.js` läuft auf malojaplana.ch (Runde 2026-07-11 ist
  deployt). `main` = `548530a`; der letzte Commit ändert nur Docs + Meta-Tag, kein Bundle
  → live-Bundle unverändert, Deploy nicht dringend.
  - Falle (weiter gültig): nach jedem Merge prüfen, dass `deploy.sh` wirklich frisch baut
    (schon mal alter Build ausgeliefert).
- **GitHub Flow ist scharf:** `main` = einziger Stamm, kein `dev`, kein Sync-back.
  Ablauf `feat/…` → `deploy.sh --stage` → PR→main → `deploy.sh`; Qualitäts-Ring je
  Schicht (`DEV_WORKFLOW.md`). `/session-close` schliesst Sitzungen ab. Kapitalbezugs-
  steuer (`e4fe262`) ist in `main` und live.

## Nächste Schritte

1. **GitHub-Support-Ticket** (Sophie, Account-Aktion): nach dem Historie-Purge die
   gecachten Commits + `refs/pull/*/head` entfernen lassen (Formular
   support.github.com/contact/private-information). Ein normaler `git clone` ist sauber;
   die PR-Refs tragen die Alt-Gmail noch. Force-push erreicht sie nicht.
2. **Deploy `548530a`** (optional, nicht dringend): ändert nur `<meta author>` + Docs,
   kein Bundle → beim nächsten echten Feature-Deploy mitnehmen. Deploy-Gate-Hook blockt
   `bash deploy.sh` ohne frische `.maloja/predeploy-ok` → vorher `/maloja-predeploy`.
3. **`docs/archive` Namen-PII** (offen): Persona-Beispiele mit echtem Namen/Geburtsjahr —
   der Purge ersetzte nur Mail-Strings, nicht Fliesstext. Separater Schritt auf Sophies Wort.
4. Offen a11y (nicht-blockierend): #4 Fokusring-Farbe (Kür). rm-Gegenlese (Führerausweis
   + fr/it/rm generell).
5. **Nächstes Feature:** frei aus `docs/IDEEN.md` + `docs/TODO.md`.

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
- **Historie-Purge IMMER auf frischem `git clone --mirror` von GitHub**, nie dem lokalen
  Repo — dem können Refs fehlen (Alt-Tags/PR-Branches), die sonst die Alt-Historie am
  Leben halten. Lokales `git config user.name` muss „Stebler Studios" sein (nie Vorname).
