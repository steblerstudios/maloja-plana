# SESSION START — zuerst lesen

> Die **objektive, repo-interne Wahrheit** über den aktuellen Stand. Am Sitzungs-Ende
> aktualisieren (via `/session-close`). Bei Widerspruch zu anderen Docs gilt
> **diese** Datei. Persönliche Session-Historie/Ideen → Claude-Memory, nicht hierher.
>
> Boot: `npm run dev` (Port 5174, via `.claude/launch.json`). Deploy: `bash deploy.sh`
> von `main` (nur Stebler Studios). Verifizieren live: Footer-Version + Bundle-Hash greppen.

**Stand:** 2026-07-14

## Wo stehen wir gerade

| | |
|---|---|
| Aktueller Branch | `main` = `ccefb15` (Sitzung 2026-07-14 Abend: Namens-Leak-Audit → `docs/archive` aus Repo (#86), Release-Härtung PII-CI + Auto-Tag (#87), Tag `v0.1.25-beta` gesetzt, FTP-Secrets in GitHub gelöscht; Ordner-Umbau durch → Frontend in `maloja plana/maloja-frontend`) |
| `main` steht auf | `ccefb15` — Merge PR #87. Enthält alles bis #84 (live) **plus nicht-App-Änderungen (nicht deploy-relevant, ändern das Bundle nicht):** #86 `docs/archive` (199 Dateien mit realem Namen/Personas) aus Repo + Vorname aus SESSION_START; #87 PII-Scan pro PR in CI (Secret `PII_DENY_LIST`) + PII-Gate & Auto-Tag im `deploy.sh`. |
| Version (package.json) | `0.1.25-beta` |
| Letzter Tag | `v0.1.25-beta` (auf live-`31abc36`; ab jetzt setzt `deploy.sh` den Tag automatisch aus `package.json`) |
| Live (malojaplana.ch) | Bundle `index-1f4c6867.js` / CSS `index-0fb5458d.css` = Build von `31abc36` → **DEPLOYT & verified-live** (Bundle- + de-Chunk-Hash `de-a3e36214.js` frisch gegengeprüft 2026-07-14). Alles bis #84 ist live. ⚠️ **Ausnahme:** r7-`.htaccess`-Fix `geolocation=(self)` NICHT live — `deploy.sh` strippt `.htaccess`, Header kommt aus dem Infomaniak-Panel (dort noch `geolocation=()`). |
| **Runde 2026-07-12/13 (live)** | **✅ GEMERGT + LIVE (PRs #47–#59): Runde 2026-07-12 + Anspruchs-Instrumente Phase 1 (IPV-Beleg + Sozialhilfe-Pegel) + Design-Docs-Ent-Drift** |
| **Runde 2 (IPV-Lebenslinie) — ✅ LIVE** | **✅ PR #60 (`d9ee62b`):** IPV-Lebenslinie Phase 2 + Sozialhilfe-Rückerstattung + Predeploy-Fixes (Stempel/Kompass/Sie-Du/ipvSubsumed). Runde-2-Gate grün, ZH-Beträge live gegen Handbuch verifiziert. **Deployt in `index-8aeb4a84.js`.** |
| **Runde 3 (Tresor + AHV-21) — ✅ LIVE** | **✅ PRs #62/#63/#65/#66 (`a9578f1` → in `69ea85e`):** Tresor-Lock cryptoCore/secureStore (**dormant/unverdrahtet**, Web Crypto, keine Deps) · AHV-21-Referenzalter der Frauen JG1961–63 (monatsgenau, swiss-precision-verifiziert) · a11y-soft-Kontrast. **Predeploy-Runde 3 (19 Agenten)** fand 3 🔴 → alle gefixt: AHV-Integration in Vergleichstabelle/Zukunftsbild/Feld-Default (#65, JG1962→2'341.33/0% statt Phantom-Aufschub), PII-Leak (#66), **Tresor-🔴 als Phase-2b-Blocker geparkt** (dormant, `docs/design/tresor-lock.md`). Polish #68: a11y 44px-Header-Schalter + Chip-Kontrast, Pensionierung-Frist ans echte Referenzalter, vr.source-Zitat. **Deployt in `index-8aeb4a84.js`.** |
| **Runde 4 (Doku + Governance + Momentum + Sie/Du) — 🟢 GEMERGT, Gate GRÜN, NICHT LIVE** | **#72/#73** Doku-Sprawl-Konsolidierung · **#74** Feature-Level-Tagging L0–L5 (`GOVERNANCE_LEVELS.md`, Runtime dormant) · **#75** Momentum-Anti-Druck-Zeile (`nextUpReassure`) · **#77** Sie/Du-Split der Zeile + Batterie-Polish (FinanzUebersicht-Chip Dunkelkontrast '60'→'40', `ctrlBtn`/Anrede `radius.sm`, `du`→`Du`, `leading.normal`). **Predeploy-Runde 4: volle Batterie (10 Prüfungen — Security+a11y+Design ganze App + Domänen + code-review) = 0 🔴.** In `main` (`b750e9e`), noch nicht deployt. |
| **Runde 5 (#79/#80) — 🟢 GEMERGT, Gate GRÜN, NICHT LIVE** | **#79** i18n-Jahr-Interpolation `lohnCheck.unterMindestlohn`. **#80 (Predeploy-Runde 5, volle Batterie erneut = 0 offene 🔴):** zwei pre-existing 🔴 gefixt — (1) **Kantons-Mindestlöhne auf 2026 offiziell verifiziert korrigiert** (GE 24.32→24.59, NE 21.31→21.35, BS 21.00→22.20 + `indexiert`-Flag, JU/TI bestätigt; war False-Negativ-Warnungs-Risiko, Wahrheits-Disziplin) · (2) **Schwarz-auf-Sage-🔴** an 3 Buttons (4.32:1)→`sageBtn`/weiss. Plus DE-Grammatik „beim". |
| **Runden 4–7 (#72–#84) — ✅ JETZT LIVE** | Doku/Governance (#72–74), Momentum-Zeile+Sie/Du (#75/#77), i18n-Jahr (#79), Mindestlohn 2026 (#80), SEO/GEO-Fundament (#82), roseDeep+tote-Links (#83), Predeploy-r7 a11y+BWO (#84) — **alle deployt + verified-live in `index-1f4c6867.js`** (2026-07-14). Predeploy-Runde 7: volle 8-Agenten-Batterie 0 🔴, alle ⚠️ auf ausdrücklichen Wunsch vor Deploy gefixt. |
| **Deploy-Gate** | **Verbraucht** — letzter Deploy `31abc36` verified-live. #86/#87 sind Doku/CI/Deploy-Tooling (kein `src/`-App-Code) → **Live-Bundle unverändert, kein Deploy nötig**. Nächster App-Deploy braucht frisches `/maloja-predeploy` (neue Marke auf neuem HEAD); `deploy.sh` fährt jetzt zusätzlich PII- + SEO-Gate und setzt den Release-Tag automatisch. |

**⚠️ HISTORIE UMGESCHRIEBEN 2026-07-11:** Alle Commit-Hashes vor heute haben sich geändert (Privatsphäre-Purge: die zwei privaten Alt-Mail-Adressen raus, alle Autoren → „Stebler Studios"). `main` + alle 15 Tags force-gepusht, 22 Alt-Branches gelöscht. **Details/Residual (GitHub-Support-Ticket für PR-Refs offen)** in Claude-Memory `feedback_no_owner_name_in_git`. Backups: `~/Projects/_maloja-archiv/maloja-github-mirror-preHistoryPurge-*.git`.

## Verifikations-Status (das Wichtigste)

> Feature-für-Feature-Detail (built/deployed/verified-live): [`FEATURES.md`](FEATURES.md).


- **Live:** Bundle `index-8aeb4a84.js` läuft auf malojaplana.ch (Build von `69ea85e`) →
  die Runden 2026-07-12/13 **plus Runde 2 (IPV-Lebenslinie) + Runde 3 (AHV-21 +
  Tresor-Fundament dormant)** sind **deployt + verified-live** (Live-Hash frisch
  gegengeprüft 2026-07-13). Tests grün, i18n-Parität 5 Spr., Build sauber.
  - ⚠️ **`main` (`2f011e3`) ist seit der 3. Runde VOR dem Live-Stand:** #72–#75 (Doku +
    Governance-Mechanismus + Momentum-Zeile) sind gemergt, aber **nicht deployt**. Vor
    einem Deploy `/maloja-predeploy` auf `2f011e3` (Marker steht noch auf `69ea85e`).
  - Falle (weiter gültig): nach jedem Merge prüfen, dass `deploy.sh` wirklich frisch baut
    (schon mal alter Build ausgeliefert).
- **GitHub Flow ist scharf:** `main` = einziger Stamm, kein `dev`, kein Sync-back.
  Ablauf `feat/…` → `deploy.sh --stage` → PR→main → `deploy.sh`; Qualitäts-Ring je
  Schicht (`DEV_WORKFLOW.md`). `/session-close` schliesst Sitzungen ab. Kapitalbezugs-
  steuer (`e4fe262`) ist in `main` und live.

## Nächste Schritte

0. **⚠️ Historie-Purge Name — VORBEREITET, Stebler Studios führt aus.** Runbook + frischer Mirror-Backup liegen in `_maloja-archiv/`: `HISTORIE-PURGE-NAME-2026-07-14.md` + `maloja-mirror-20260714-192544.git`. Phase 1 (sicher, pfadbasiert): `git filter-repo --path docs/archive --invert-paths` auf dem Mirror, dann `git push --force --mirror` (Force-Push + filter-repo bewusst manuell). Entfernt Personas/Gesundheitsdaten/Drittperson aus der Historie; legaler Name (NOTICE/legal/i18n-Impressum) bleibt. Danach lokal neu klonen + GitHub-Support-Ticket-SHAs ergänzen ([[feedback_no_owner_name_in_git]]). Prävention ist schon gebaut (#87: pii-scan pro PR in CI).
0b. **Infomaniak-Panel `Permissions-Policy` → `geolocation=(self)` — GEPARKT zur Logins-/Backend-Phase** (Stebler-Studios-Entscheid 2026-07-14). Aktuell `geolocation=()` → **blockt den Opt-in-Standort der Notfall-Vorlesekarte** (einzige Folge). Panel-Handgriff, unabhängig von Logins, aber bewusst gebündelt. Der r7-`.htaccess`-Fix greift NICHT (`deploy.sh` löscht `dist/.htaccess`; Header laufen übers Panel). Gegenprüfen: `curl -sD - -o /dev/null https://malojaplana.ch/ | grep -i permissions-policy`. Merker: repo-`.htaccess` ist damit **vestigial**.
1. **⭐ Tresor Phase 2b — Schritt 1 (nächste Session startet HIER).** Bestandsaufnahme
   2026-07-13 fertig (`secureStore.js` dormant/0 Importe, PBKDF2 100k, alle 4 🔴 real im
   Code bestätigt). Sicher beginnen — nichts ist aktiviert, reine Logik + Tests, **KEINE UI**:
   die 4 Blocker im dormanten `secureStore` fixen — (1) Doku-Blobs vor dem Verschlüsseln
   hydrieren · (2) `or5_*_prerestore`-Klartext mit-löschen · (3) Crash-Guard um
   `unpackRecord`/`atob` · (4) Backup bei aktivem Tresor nicht leer — plus PBKDF2 100k→600k
   (versioniert), Passphrase-Stärke, `VAULT_*`→`TRESOR_*`. Dann UI (Schritt 2), dann
   Voll-Zyklus live verifizieren (Schritt 3). Details: `docs/design/tresor-lock.md`.
   Bau-Freigabe nötig (berührt ALLE Daten — hohe Sorgfalt).
   **Vorher/parallel — DEPLOY-BEREIT:** `main` (`e2953f7`, #72–#80) ist Deploy-Gate-GRÜN
   (Predeploy-Runde 5, volle Batterie 0 offene 🔴, Marke gesetzt). `bash deploy.sh` → Live-Hash
   gegenprüfen + hier/`FEATURES.md` auf verified-live heben. ⚠️ Mindestlohn-Daten sind jetzt
   Stand 2026 (offiziell verifiziert) — vor JEDEM künftigen Jahreswechsel neu prüfen (GE/NE/BS indexiert).
   **Weiter geparkt (nicht blockierend) — whole-app-a11y/design-Sweep** (aus Runde-4/5-Vollbatterie):
   `MobileNav`-Schubladen-Fokus-Management (Fokus rein/zurück, Hintergrund inert) · Doppel-`h1`
   in `Lebenssituationen.jsx` (→ `PageTitle`) · `DocumentTresor`-Icon-Buttons 36→44px + Lösch-Rückfrage ·
   `LanguageSwitcher` kein 44px · `ChartsAdvanced` Farbenblind (rose-Duplikat + Hex statt Token) ·
   `htmlFor`/`id`-Kopplung breit (`LabeledField`-Migration fortsetzen) · Zweit-Formular-Tap-Ziele <44px ·
   `FinanzUebersicht`-StatusCard-SaaS-Muster · Token-Hygiene (Abstands-Drift, `PrimaryButton`-Reuse,
   Pseudo-Headings, `text.xs-1`) · Dashboard-`mvo.fields`-Doppel-Scan · `ChapterView:1785`-`.replace`-Kette ·
   2 ungeschützte `localStorage`-Zeilen · Meta-CSP als HTTP-Header · AHV Phase B.
2. **rm-Gegenlese** der neuen Keys (`TODO(rm)` gesetzt): `ipvStatus.*`, `barKurz.*`,
   `schnellcheck.ipvSubsumed/ipvEnthalten`, `sozialhilfe.repayment*` — Muttersprachler:in.
   **Neu dazu:** die in Predeploy-Runde 2 ergänzten RM-Vus-Formen (`{sie,du}`-Split) sind
   Best-Effort und gehören in dieselbe Gegenlese.
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
