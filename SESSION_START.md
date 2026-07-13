# SESSION START — zuerst lesen

> Die **objektive, repo-interne Wahrheit** über den aktuellen Stand. Am Sitzungs-Ende
> aktualisieren (via `/session-close`). Bei Widerspruch zu anderen Docs gilt
> **diese** Datei. Persönliche Session-Historie/Ideen → Claude-Memory, nicht hierher.
>
> Boot: `npm run dev` (Port 5174, via `.claude/launch.json`). Deploy: `bash deploy.sh`
> von `main` (nur Stebler Studios). Verifizieren live: Footer-Version + Bundle-Hash greppen.

**Stand:** 2026-07-13

## Wo stehen wir gerade

| | |
|---|---|
| Aktueller Branch | `main` (Historie 2026-07-11 umgeschrieben) |
| `main` steht auf | `5c64527` — Merge PR #58 (Anspruchs-Instrumente + Design-Docs ent-driftet + a11y-Kontrast/Tap-Targets + ESLint v9 Flat-Config); enthält die Runde 2026-07-12 (PRs #47–#57) |
| Version (package.json) | `0.1.24-beta` |
| Letzter Tag | `v0.1.24-beta` |
| Live (malojaplana.ch) | Bundle `index-59c9c3e4.js` = frischer `main`-Build → **DEPLOYT & verified-live** (Bundle-Hash gegengeprüft 2026-07-13) |
| **Runde 2026-07-12/13** | **✅ GEMERGT + LIVE (PRs #47–#58): Runde 2026-07-12 (Mammografie-Geo/-Fakten, SEO-robots, a11y-Feld-Labels, Kalenderband-mobil, ScrollFade, 44px-Tap-Targets, PII-Scrub) + Anspruchs-Instrumente (IPV-Prämien-Beleg + Sozialhilfe-Pegel im Schnellcheck) + Design-Docs-Ent-Drift** |
| **Deploy-Gate** | **✅ Runde deployt & live-verifiziert (2026-07-13): `main` `5c64527` baut zu `index-59c9c3e4.js`, identisch zum Live-Bundle. Tests grün, i18n-Parität 5 Spr., Build sauber.** |

**⚠️ HISTORIE UMGESCHRIEBEN 2026-07-11:** Alle Commit-Hashes vor heute haben sich geändert (Privatsphäre-Purge: die zwei privaten Alt-Mail-Adressen raus, alle Autoren → „Stebler Studios"). `main` + alle 15 Tags force-gepusht, 22 Alt-Branches gelöscht. **Details/Residual (GitHub-Support-Ticket für PR-Refs offen)** in Claude-Memory `feedback_no_owner_name_in_git`. Backups: `~/Projects/_maloja-archiv/maloja-github-mirror-preHistoryPurge-*.git`.

## Verifikations-Status (das Wichtigste)

> Feature-für-Feature-Detail (built/deployed/verified-live): [`FEATURES.md`](FEATURES.md).


- **Live:** Bundle `index-59c9c3e4.js` läuft auf malojaplana.ch und ist **identisch zum
  frischen `main`-Build** (`main` = `5c64527`) → die ganze Runde 2026-07-12/13 inkl. der
  neuen Anspruchs-Instrumente ist **deployt + verified-live** (Bundle-Hash gegengeprüft
  2026-07-13). Tests grün, i18n-Parität 5 Spr., Build sauber.
  - Falle (weiter gültig): nach jedem Merge prüfen, dass `deploy.sh` wirklich frisch baut
    (schon mal alter Build ausgeliefert).
- **GitHub Flow ist scharf:** `main` = einziger Stamm, kein `dev`, kein Sync-back.
  Ablauf `feat/…` → `deploy.sh --stage` → PR→main → `deploy.sh`; Qualitäts-Ring je
  Schicht (`DEV_WORKFLOW.md`). `/session-close` schliesst Sitzungen ab. Kapitalbezugs-
  steuer (`e4fe262`) ist in `main` und live.

## Nächste Schritte

1. **IPV-Lebenslinie (Phase 2)** — die Anspruchs-Instrumente (Phase 1) sind live; als
   Nächstes das IPV-Instrument statefull machen: geschätzt → beantragt → bestätigt (Stempel)
   → jährlich erneuern. Braucht ein kleines persistiertes Status-Feld (`or5_`, additiv, mit
   ausdrücklicher Freigabe) + kantonale Ehrlichkeit (IPV oft automatisch via Steuerdaten).
   **Davor:** `/maloja-ablauf "IPV beantragen"` + `swiss-precision`/`rechts`-Prüfer;
   rm-Gegenlese der neuen `pegel.*`/`beleg.*`-Keys. Design + Ablauf-Kontext (A2) im Memory
   `project_metaphor_matrix`. (Weitere Instrumente: EL qualitativ; Pegel-Reuse anderswo.)
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
