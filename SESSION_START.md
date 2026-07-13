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
| Aktueller Branch | `feat/ipv-lebenslinie` — 3 Commits über `main`, **unmerged + unpushed** (Sitzung 2026-07-13) |
| `main` steht auf | `263d027` — Merge PR #59 (Stand-Sync, nur Doku über `5c64527`); Code = `5c64527`, Live-Bundle unverändert |
| Version (package.json) | `0.1.24-beta` |
| Letzter Tag | `v0.1.24-beta` |
| Live (malojaplana.ch) | Bundle `index-59c9c3e4.js` = Build von `5c64527` → **DEPLOYT & verified-live** (Bundle-Hash gegengeprüft 2026-07-13). Die `feat`-Arbeit unten ist **NICHT** live. |
| **Runde 2026-07-12/13** | **✅ GEMERGT + LIVE (PRs #47–#59): Runde 2026-07-12 (Mammografie, SEO-robots, a11y, Kalenderband, ScrollFade, 44px, PII-Scrub) + Anspruchs-Instrumente Phase 1 (IPV-Beleg + Sozialhilfe-Pegel) + Design-Docs-Ent-Drift + Stand-Sync** |
| **Neu auf `feat/ipv-lebenslinie`** | **⏳ gebaut + verifiziert-LOKAL, nicht deployt (2026-07-13):** `91405d8` IPV-Lebenslinie Phase 2 + a11y-Härtung + Subsidiaritäts-Fix · `671da78` Sozialhilfe-Rückerstattung (Copy belegt korrigiert + Rechner) · `f987d06` Tresor-Lock-Konzept (Spec). Tests 632 grün, `eslint src` sauber, Build ok, Browser verifiziert. **Offen: Predeploy-Gate → PR → main → Deploy.** |
| **Deploy-Gate** | **⚠️ `.maloja/predeploy-ok` steht auf `b2d6fe6` (Pre-Merge PR #58). Vor dem NÄCHSTEN Deploy `bash deploy.sh`/`/maloja-predeploy` frisch laufen. Live (`5c64527`) ist ok.** |

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

1. **`feat/ipv-lebenslinie` nach `main` bringen** (die Sitzung 2026-07-13): pushen →
   `/maloja-predeploy` (Gate steht noch auf `b2d6fe6`) → PR → `main` → `deploy.sh` →
   live per Bundle-Hash verifizieren. Enthält: IPV-Lebenslinie Phase 2 (statefull Beleg,
   additives `data.anspruch.ipv`), a11y-Härtung der Instrumente, Subsidiaritäts-Fix
   (IPV+Sozialhilfe nicht mehr doppelt), Sozialhilfe-Rückerstattung (belegt korrigiert +
   Rechner), Tresor-Lock-Spec. Specs: `docs/design/ipv-lebenslinie.md`, `.../tresor-lock.md`.
2. **rm-Gegenlese** der neuen Keys (`TODO(rm)` gesetzt): `ipvStatus.*`, `barKurz.*`,
   `schnellcheck.ipvSubsumed/ipvEnthalten`, `sozialhilfe.repayment*` — Muttersprachler:in.
3. **Design-Vision offen (Discussion/Build):** #3-Instrumente EL (qualitativ) · Baum↔Obstgarten
   (Entscheid E) · Haus-Karte vs. Skeuo-Liste Metapher-Abgleich. Backlog: `docs/design/design-backlog.md` E.
4. **Tresor-Lock bauen** (Konzept steht, `docs/design/tresor-lock.md`): opt-in Passphrase-
   Verschlüsselung aller `or5_*`-Stores, Backup beim Setup. Erst mit ausdrücklicher Freigabe;
   Native-Secure-Safe-Vision (Ordner auf dem Gerät + Keychain/Keystore) → „Logins-Phase"
   zusammen mit App-Store/iOS-Recherche.
5. **Rechts-Feinschliff (offen, belegt vorbereitet):** exakte Kantons-Mechanik IPV automatisch
   vs. Antrag (schärft die Verzweigung); Rückerstattungs-Zahlen sind ZH-Werte (kantonal prüfen).
6. **GitHub-Support-Ticket** (Stebler Studios, Account-Aktion): nach dem Historie-Purge die
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
