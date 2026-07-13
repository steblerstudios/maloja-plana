# SESSION START — zuerst lesen

> Die **objektive, repo-interne Wahrheit** über den aktuellen Stand. Am Sitzungs-Ende
> aktualisieren (via `/session-close`). Bei Widerspruch zu anderen Docs gilt
> **diese** Datei. Persönliche Session-Historie/Ideen → Claude-Memory, nicht hierher.
>
> Boot: `npm run dev` (Port 5174, via `.claude/launch.json`). Deploy: `bash deploy.sh`
> von `main` (nur Stebler Studios). Verifizieren live: Footer-Version + Bundle-Hash greppen.

**Stand:** 2026-07-12

## Wo stehen wir gerade

| | |
|---|---|
| Aktueller Branch | `main` (Historie 2026-07-11 umgeschrieben) |
| `main` steht auf | `60ded4f` — Merge PR #56 (Stand-Sync); enthält Runde 2026-07-12 (PRs #47–#53) + Code-Review-Cleanups PR #57 (Kantonsnamen Mammo-Block + ScrollFade-Perf) |
| Version (package.json) | `0.1.24-beta` |
| Letzter Tag | `v0.1.24-beta` |
| Live (malojaplana.ch) | Bundle `index-d1dacdf3.js` (Stand VOR der Runde 2026-07-12) |
| **Runde 2026-07-12** | **✅ GEMERGT (PRs #47–#55): Mammografie-Geo, SEO-robots, a11y-Feld-Labels, Kalenderband-mobil, ScrollFade-Reiter, Banner-/44px-Tap-Targets, Mammografie-Fakten-Fix, PII-Scrub — alle in `main`** |
| **Deploy-Gate** | **✅ GRÜN für `60ded4f` (mechanisch re-verifiziert 2026-07-12: Tests 611, PII-Scan Exit 0, Build sauber, Size 64.29/65 kB, de-Chunk + i18n-Parität 5 Spr.) → Freigabe-Marke (`.maloja/predeploy-ok`) auf `60ded4f`, `bash deploy.sh` frei. NOCH NICHT deployt (neuer Build `index-269a5841.js`).** |

**⚠️ HISTORIE UMGESCHRIEBEN 2026-07-11:** Alle Commit-Hashes vor heute haben sich geändert (Privatsphäre-Purge: die zwei privaten Alt-Mail-Adressen raus, alle Autoren → „Stebler Studios"). `main` + alle 15 Tags force-gepusht, 22 Alt-Branches gelöscht. **Details/Residual (GitHub-Support-Ticket für PR-Refs offen)** in Claude-Memory `feedback_no_owner_name_in_git`. Backups: `~/Projects/_maloja-archiv/maloja-github-mirror-preHistoryPurge-*.git`.

## Verifikations-Status (das Wichtigste)

> Feature-für-Feature-Detail (built/deployed/verified-live): [`FEATURES.md`](FEATURES.md).


- **Live:** Bundle `index-d1dacdf3.js` läuft auf malojaplana.ch (Stand VOR der Runde
  2026-07-12). `main` = `60ded4f`; die Runde 2026-07-12 (+ Review-Cleanups #57) ändert
  App-Code (neuer Build `index-269a5841.js`) und ist **gebaut + in `main`, aber NOCH NICHT
  deployt**. Deploy-Gate grün (mechanisch re-verifiziert 2026-07-12: Tests 611, PII-Scan
  Exit 0, Build sauber, Size 64.29/65 kB, de-Chunk + i18n-Parität), Freigabe-Marke für
  `60ded4f` gesetzt → nächster Schritt `bash deploy.sh`, dann live gegen `index-269a5841.js`
  gegenprüfen.
  - Falle (weiter gültig): nach jedem Merge prüfen, dass `deploy.sh` wirklich frisch baut
    (schon mal alter Build ausgeliefert).
- **GitHub Flow ist scharf:** `main` = einziger Stamm, kein `dev`, kein Sync-back.
  Ablauf `feat/…` → `deploy.sh --stage` → PR→main → `deploy.sh`; Qualitäts-Ring je
  Schicht (`DEV_WORKFLOW.md`). `/session-close` schliesst Sitzungen ab. Kapitalbezugs-
  steuer (`e4fe262`) ist in `main` und live.

## Nächste Schritte

1. **Deployen** — Runde 2026-07-12 (+ Review-Cleanups #57) ist gemergt + Deploy-Gate grün
   (Freigabe-Marke für `60ded4f` gesetzt). `bash deploy.sh` von `main`; danach live gegen
   `index-269a5841.js` gegenprüfen → `FEATURES.md` auf `verified-live`, neuen LIVE-Commit
   hier + in Memory festhalten. (Deploy-Gate-Hook blockt ohne frische `.maloja/predeploy-ok` → bei weiteren
   Commits vorher `/maloja-predeploy`.)
2. **GitHub-Support-Ticket** (Stebler Studios, Account-Aktion): nach dem Historie-Purge die
   gecachten Commits + `refs/pull/*/head` entfernen lassen (Formular
   support.github.com/contact/private-information). Ein normaler `git clone` ist sauber;
   die PR-Refs tragen die Alt-Gmail noch. Force-push erreicht sie nicht. **Zusätzlich:** die
   zwei privaten Alt-Mails standen kurz in `SESSION_START.md` (Commit `14d4196`, per PR #54
   bereinigt) → im selben Ticket den Cache dafür mit entfernen lassen.
3. **Design-Vision (Diskussion, kein Build) — gewählte Reihenfolge: erst §3, dann §2:**
   §3 Schnellchecks als Instrumente (Prototyp mit *einem* Check), §2 Obstgarten vs. ein
   Baum (Lean: beim einen Baum bleiben). Siehe `docs/IDEEN.md` „Nächste Schritte".
4. **`docs/archive` Namen-PII** (offen): Persona-Beispiele mit echtem Namen/Geburtsjahr —
   der Purge ersetzte nur Mail-Strings, nicht Fliesstext. Separater Schritt auf ausdrückliche Freigabe.
5. Offen a11y (nicht-blockierend): #4 Fokusring-Farbe (Kür). rm-Gegenlese (Führerausweis
   + fr/it/rm generell).

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
