# SESSION START — zuerst lesen

> Die **objektive, repo-interne Wahrheit** über den aktuellen Stand. Am Sitzungs-Ende
> aktualisieren (via `/session-close`). Bei Widerspruch zu anderen Docs gilt
> **diese** Datei. Persönliche Session-Historie/Ideen → Claude-Memory, nicht hierher.
>
> Boot: `npm run dev` (Port 5174, via `.claude/launch.json`). Deploy: `bash deploy.sh`
> von `main` (nur Stebler Studios). Verifizieren live: Footer-Version + Bundle-Hash greppen.

**Stand:** 2026-07-15 (Predeploy-Runde 8)

## Wo stehen wir gerade

| | |
|---|---|
| Aktueller Branch | **`main` = `acc52f0`** — die Runde-8-Zweige sind **gemergt** (PR #93 `feat/befund-brief-lohn`, #94 `feat/lohn-mietzins-barometer`, #95 `fix/vitest-exclude-claude-worktrees`, #96 `fix/color-scheme-dark-scrollbar`). Offen: `fix/predeploy-r8` (Blocker-Behebung aus Runde 8). `chore/stand-sync-r13` ist **tot** — sein Inhalt ist über PR #92 in `main`, der Zweig ist 20 Commits zurück und trägt nichts Einzigartiges (löschbar). |
| `main` steht auf | **`acc52f0`** (= `origin/main`, gegengeprüft 2026-07-15). ⚠️ **Merge-Fallen-Regel — gilt weiter, aber sie deckt nur den Doku-Fall:** Ein Stand-Sync-PR dokumentiert den Zeiger, sein eigener Merge rückt `main` dahinter. Steht hier ein Hash, der einen Merge alt ist, und `git diff <hier>..main -- src/` ist **leer**, ist alles in Ordnung. **Ist das Delta NICHT leer, hängt ein echter Deploy.** Genau das ist am 2026-07-15 passiert: Der frühere Eintrag `5a4851c` behauptete „`main` IST live, kein Deploy hängt", während 23 `src/`-Dateien (+1547/−59) davor lagen — die Feature-PRs #93/#94 waren gemergt, der Selbstschutz war beschrieben, aber nie ausgeführt. **Lehre: Die Gegenprobe ist keine Option, sondern Schritt 1.** |
| Deploy hängt? | **JA.** `git log --oneline 5a4851c..HEAD` = **20 Commits**, `git diff 5a4851c..HEAD -- src/` = **23 Dateien**. Frisch gebautes `main` → Bundle `index-d66cc69c.js` ≠ Live-Bundle `index-1f4c6867.js`. Das ist **kein** Doku-Delta wie bei #86/#87. |
| Version (package.json) | `0.1.25-beta` |
| Letzter Tag | `v0.1.25-beta`. ⚠️ Der Tag zeigt auf `31abc36` — ein Hash, den der Purge **getötet** hat (`git log 31abc36..HEAD` bricht ab). Ab jetzt setzt `deploy.sh` den Tag automatisch aus `package.json`. |
| Live (malojaplana.ch) | Bundle `index-1f4c6867.js` / CSS `index-0fb5458d.css`. Das entspricht dem Stand **`5a4851c`** (Runden 4–7, #72–#84). **`main` (`acc52f0`) ist NICHT live** — die ganze Runde 8 (Lohn-Befund-Brief + Lohn-/Mietzins-Barometer) liegt davor. ⚠️ **Ausnahme:** r7-`.htaccess`-Fix `geolocation=(self)` NICHT live — `deploy.sh` strippt `.htaccess`, Header kommt aus dem Infomaniak-Panel (dort noch `geolocation=()`, am 2026-07-15 per `curl` bestätigt). |
| ⚠️ Tote Hashes | Alle Hashes von **vor** dem Purge (2026-07-14) lösen nicht mehr auf — u. a. der Live-Marker `31abc36` und `.maloja/predeploy-ok`. **Ein toter Hash heisst NICHT, dass die Arbeit erfunden war.** Nachschlagen: `grep '<hash>' _maloja-archiv/HASH-LANDKARTE-vor-purge.md` (2070 Einträge, PII-frei). |
| **Runde 2026-07-12/13 (live)** | **✅ GEMERGT + LIVE (PRs #47–#59): Runde 2026-07-12 + Anspruchs-Instrumente Phase 1 (IPV-Beleg + Sozialhilfe-Pegel) + Design-Docs-Ent-Drift** |
| **Runde 2 (IPV-Lebenslinie) — ✅ LIVE** | **✅ PR #60 (`d9ee62b`):** IPV-Lebenslinie Phase 2 + Sozialhilfe-Rückerstattung + Predeploy-Fixes (Stempel/Kompass/Sie-Du/ipvSubsumed). Runde-2-Gate grün, ZH-Beträge live gegen Handbuch verifiziert. **Deployt in `index-8aeb4a84.js`.** |
| **Runde 3 (Tresor + AHV-21) — ✅ LIVE** | **✅ PRs #62/#63/#65/#66 (`a9578f1` → in `69ea85e`):** Tresor-Lock cryptoCore/secureStore (**dormant/unverdrahtet**, Web Crypto, keine Deps) · AHV-21-Referenzalter der Frauen JG1961–63 (monatsgenau, swiss-precision-verifiziert) · a11y-soft-Kontrast. **Predeploy-Runde 3 (19 Agenten)** fand 3 🔴 → alle gefixt: AHV-Integration in Vergleichstabelle/Zukunftsbild/Feld-Default (#65, JG1962→2'341.33/0% statt Phantom-Aufschub), PII-Leak (#66), **Tresor-🔴 als Phase-2b-Blocker geparkt** (dormant, `docs/design/tresor-lock.md`). Polish #68: a11y 44px-Header-Schalter + Chip-Kontrast, Pensionierung-Frist ans echte Referenzalter, vr.source-Zitat. **Deployt in `index-8aeb4a84.js`.** |
| **Runde 4 (Doku + Governance + Momentum + Sie/Du) — 🟢 GEMERGT, Gate GRÜN, NICHT LIVE** | **#72/#73** Doku-Sprawl-Konsolidierung · **#74** Feature-Level-Tagging L0–L5 (`GOVERNANCE_LEVELS.md`, Runtime dormant) · **#75** Momentum-Anti-Druck-Zeile (`nextUpReassure`) · **#77** Sie/Du-Split der Zeile + Batterie-Polish (FinanzUebersicht-Chip Dunkelkontrast '60'→'40', `ctrlBtn`/Anrede `radius.sm`, `du`→`Du`, `leading.normal`). **Predeploy-Runde 4: volle Batterie (10 Prüfungen — Security+a11y+Design ganze App + Domänen + code-review) = 0 🔴.** In `main` (`b750e9e`), noch nicht deployt. |
| **Runde 5 (#79/#80) — 🟢 GEMERGT, Gate GRÜN, NICHT LIVE** | **#79** i18n-Jahr-Interpolation `lohnCheck.unterMindestlohn`. **#80 (Predeploy-Runde 5, volle Batterie erneut = 0 offene 🔴):** zwei pre-existing 🔴 gefixt — (1) **Kantons-Mindestlöhne auf 2026 offiziell verifiziert korrigiert** (GE 24.32→24.59, NE 21.31→21.35, BS 21.00→22.20 + `indexiert`-Flag, JU/TI bestätigt; war False-Negativ-Warnungs-Risiko, Wahrheits-Disziplin) · (2) **Schwarz-auf-Sage-🔴** an 3 Buttons (4.32:1)→`sageBtn`/weiss. Plus DE-Grammatik „beim". |
| **Runden 4–7 (#72–#84) — ✅ JETZT LIVE** | Doku/Governance (#72–74), Momentum-Zeile+Sie/Du (#75/#77), i18n-Jahr (#79), Mindestlohn 2026 (#80), SEO/GEO-Fundament (#82), roseDeep+tote-Links (#83), Predeploy-r7 a11y+BWO (#84) — **alle deployt + verified-live in `index-1f4c6867.js`** (2026-07-14). Predeploy-Runde 7: volle 8-Agenten-Batterie 0 🔴, alle ⚠️ auf ausdrücklichen Wunsch vor Deploy gefixt. |
| **Runde 8 (2026-07-15) — 🔴 GEMERGT in `main`, NICHT live, Predeploy-Gate ROT** | ⚠️ **Predeploy-Runde 8 (2026-07-15) hat die Freigabe VERWEIGERT** — keine Marke gesetzt, `deploy.sh` blockt. Volle Batterie gelaufen: 9 Prüf-Agenten + Code-Review (44 Agenten). Alle mechanischen Gates grün (701 Tests / 63 Dateien, Build, SEO 0/0, PII, Size 64.91/65 kB, CSP, de-Chunks in 5 Sprachen). **Die Blocker sitzen in der Fachlogik.** Details unten unter „Nächste Schritte". <br> **`feat/befund-brief-lohn` (`d5a2898`, jetzt via PR #93 in `main`):** `c56272f` **Teilzeit-Fehlalarm behoben** — ohne erfasste Wochenstunden nahm der Mindestlohn-Befund blind Vollzeit an (182 Std.); CHF 3000 bei 50% wurden als 16.48/Std. statt 32.97/Std. gelesen → korrekt bezahlte Teilzeit-Angestellte wurden für unterbezahlt erklärt, **und der Befund führt neu zu einem Brief an den Arbeitgeber**. Jetzt nur `pruefeStundenlohn`; ohne Stunden ruhige Einladung statt Warnung, kein Brief-Knopf. · `1bca5a8` Arbeitgeber-**Adresse** (beide Kapitel, quer befüllt) + **Haupt-/Nebenerwerb-Auswahl** (`options.job` steuert Empfänger UND Zahlen) · `d5a2898` **NE/BS amtlich gegengeprüft** — NE hat KEIN „Mindestlohngesetz", der Mindestlohn steht in der **LEmpl von 2004, Art. 32a ff. (RSN 813.10)**; BS = **MiLoG vom 13.01.2021 (SG 812.200)**, Stelle AWA. Beide von `verify:true` → `false`. <br> **`feat/lohn-mietzins-barometer` (`6c143b0`, ab dem obigen):** `bc52438` **Barometer-Rebuild** nach der Rebuild-Spec (Lohn + Miete spiegelgleich in der Finanz-Übersicht, `data/lohnEinordnung.js`, `components/LohnEinordnung.jsx`, `components/MietVergleich.jsx` in BEIDEN Orten, `RegionalBarometer` + `fillColor`/`thresholdValue`) · `99c741f` `docs/design/farb-und-daten-system.md` · `f6d45b9` **Marken-Kollision** („!" und CH-Schnitt fallen bei ~CHF 4'000 Einkommen aufeinander — 1327×3=3981, mitten in der Zielgruppe) · `6c143b0` **Prüf-Agenten neu gebaut + `.claude/agents\|commands` in git**. |
| **Deploy-Gate** | **🔴 ROT — Freigabe verweigert (Predeploy-Runde 8, 2026-07-15).** `.maloja/predeploy-ok` trägt noch den toten Hash `31abc36` ≠ HEAD → `deploy.sh` blockt korrekt. **Nicht deployen, bis die Blocker unten erledigt sind.** `deploy.sh` fährt zusätzlich PII- + SEO-Gate und setzt den Release-Tag automatisch. |

**⚠️ HISTORIE UMGESCHRIEBEN — ZWEIMAL.** (1) 2026-07-11: Alt-Mails raus, Autoren → „Stebler Studios". (2) **2026-07-14: Personas/Tester/Freunde/Drittperson („Maria Stebler")/Mac-Benutzername + `docs/archive` (199 Dateien) aus der GESAMTEN Historie** (`filter-repo` invert-paths + replace-text, `main`→`35bd840`, force-push, alle Tags/Branches neu, lokal frisch geklont). Verifiziert 0 Treffer gegen `main`. **Bewusst geblieben:** eigener Name „Sophie Stebler" (Autoren-Angabe README/package.json + nDSG-Impressum, öffentlich). **Offen (2 Reste):** (a) `refs/pull/*/head` blieben beim Push abgelehnt → GitHub-Support-Ticket (SHA-Cache + PR-Refs, Formular private-information); (b) alte lokale Mirror-Backups in `_maloja-archiv/` mit Alt-PII (löschbar, waren Recovery-Netze). Details Claude-Memory `feedback_no_owner_name_in_git` + `project_cleanup_inventory` + Runbook `_maloja-archiv/HISTORIE-PURGE-NAME-2026-07-14.md`.

## Verifikations-Status (das Wichtigste)

> Feature-für-Feature-Detail (built/deployed/verified-live): [`FEATURES.md`](FEATURES.md).


- **Live:** Bundle `index-1f4c6867.js` / CSS `index-0fb5458d.css` läuft auf malojaplana.ch.
  Das ist der Stand **`5a4851c`** (Runden 4–7). **`main` (`acc52f0`) ist NICHT live** —
  am 2026-07-15 belegt, nicht angenommen: `main` frisch gebaut → `index-d66cc69c.js`,
  **anderer Hash als live**. Ein echter App-Deploy hängt, ist aber **gesperrt** (Gate rot).
  Tests grün (701/63), i18n-Parität 5 Spr., Build sauber.
  - Falle (weiter gültig): nach jedem Merge prüfen, dass `deploy.sh` wirklich frisch baut
    (schon mal alter Build ausgeliefert).
- **✅ Testlauf-Falle behoben** (PR #95, `8c30db3`): `vite.config.js` schliesst `**/.claude/**`
  aus. Ehrliche Zahl bestätigt: **63 Dateien / 701 Tests**. `npm test` genügt wieder, die
  Worktrees verfälschen nicht mehr. (Zuvor gemeldet: 122/1327.) Gegengeprüft: die neue
  Config ist **prod-neutral** — Basis-Code mit ihr gebaut ergibt denselben Hash `index-1f4c6867.js`.
- **⚠️ Prüf-Agenten-Falle — die Diagnose war falsch.** Bisher stand hier, Claude Code lade die
  Agenten „erst beim Sitzungsstart". Das stimmt nicht: **es ist der Ort, nicht das Timing.**
  `.claude/agents/` liegt in `maloja-frontend/`, die Sitzung lief auf der Container-Ebene
  `~/Projects/maloja plana/` — dort gibt es **kein `.claude/`**, also werden die Agenten nie
  geladen, auch nach beliebig vielen Neustarts nicht.
  **→ Sitzungen IMMER aus `maloja-frontend/` starten** (Repo-Root = Governance-Einheit).
  Kein zweites `.claude/` auf Container-Ebene (zwei Wahrheiten), kein Symlink (ungetrackt).
- **GitHub Flow ist scharf:** `main` = einziger Stamm, kein `dev`, kein Sync-back.
  Ablauf `feat/…` → `deploy.sh --stage` → PR→main → `deploy.sh`; Qualitäts-Ring je
  Schicht (`DEV_WORKFLOW.md`). `/session-close` schliesst Sitzungen ab. Kapitalbezugs-
  steuer (`e4fe262`) ist in `main` und live.

## Nächste Schritte

0. **⭐ 🔴 Runde-8-Blocker beheben — die nächste Sitzung startet HIER.** Zweig `fix/predeploy-r8`.
   ⚠️ Merker: `/maloja-predeploy` Schritt 1 liest den LIVE-Marker aus dieser Datei — der
   Tag-Hash `31abc36` ist tot. **Der LIVE-Marker ist `5a4851c`** (= Bundle `index-1f4c6867.js`).

   **Predeploy-Runde 8 (2026-07-15) verweigerte die Freigabe.** Batterie: 9 Prüf-Agenten +
   Code-Review (44 Agenten). Mechanik komplett grün — die Funde sitzen in der Fachlogik.
   Roter Faden: **derselbe Lohn wird an verschiedenen Orten verschieden beurteilt**, und am
   Ende steht ein Einschreiben an einen Arbeitgeber.

   **(a) Netto/Brutto wird nie geprüft** — `briefGenerator.js:66` (`lohnBefund`), Lohn-Pfad
   liest `finanzen.incomeType` **nirgends** (verifiziert: 0 Treffer). Die App fragt die
   Einkommensart ab (`constants.js:202`) und rät im Hinweis ausdrücklich zu **Netto**
   („Netto ist was auf Ihrem Konto ankommt", `de.js:1314`) — die Mindestlöhne sind aber
   **brutto** (`lohnCheck.js:1`). GE, CHF 4'000 netto bei 42 Std. → App rechnet 21.98/Std.
   < 24.59 → rote Warnung → Brief. Brutto wären ~4'550 = 25.00/Std., also **legal**.
   *Wer der Anleitung der App folgt, beschuldigt den Arbeitgeber zu Unrecht.*

   **(b) `incomeFTE` normalisiert nur nach unten** — `lohnEinordnung.js:63/66`:
   `partTime = hoursKnown && stunden < 42` → wer **mehr** als 42 Std. arbeitet, behält den
   Rohlohn. BS, CHF 4'100 bei 45 Std.: Kapitel meldet korrekt „unter Mindestlohn" + Brief-Knopf,
   das Barometer daneben gibt **Entwarnung**. Eine echte Unterschreitung wird stumm freigesprochen.

   **(c) 42 als Klassifikations-Schwelle statt Referenz-Nenner** — dieselbe Zeile. Ein normaler
   40-Std.-Vollzeitjob (CHF 6'788 = exakt der Median) wird „Teilzeit … hochgerechnet CHF 7'127" —
   CHF 339 erfunden; bei 39 Std. kippt die Aussage auf „über dem Median" (falsch).

   **(d) `wageClaim`-Brief auch bei Befund `ok`** — `briefGenerator.js:204` gated nur auf
   `kantonHatMindestlohn`, `:489` gated nur die *Zahlen*. GE/CHF 8'000: Brief behauptet
   „unter dem Mindestlohn … liegen dürfte" mit leeren Beträgen — die App hat den Verdacht
   selbst widerlegt. (Rechts-Prüfer + Code-Review unabhängig.)

   **(e) Anzeige führt die 182h-Annahme wieder ein** — `LohnEinordnung.jsx:130`/`:105`: ohne
   Stunden bleibt `incomeFTE` roh, `rel` wird aber gegen den Vollzeit-Median gerechnet + Note
   „Für den Vergleich nehmen wir eine Vollzeitstelle an". Genau der Fehlalarm, den `c56272f`
   im Kapitel abgeschafft hat.

   **(f) `FinanzUebersicht.jsx:222` widerspricht sich in einer Karte** — Band-Label rechnet auf
   dem **Rohlohn**, das Barometer 11 Zeilen darunter auf **FTE**. 50%/CHF 3'400: „nahe der
   Armutsgrenze" über „Ihr Lohn: CHF 6'800 — nahe am Median".

   **(g) `durchschnitt: 7996` unter BFS-Attribution** — `de.js:2255` (+4 Spr.) nennt die Zahl
   namentlich und schreibt sie dem BFS zu; belegt ist nur der Median `6788`
   (BFS-Medienmitteilung 19.03.2024). Mittelwert/Perzentile stehen nur in **STAT-TAB**
   (nicht zitierbar). **Drei unabhängige Prüfer** (swiss-precision, link-checker, code-review).
   ⚠️ `lohnEinordnung.test.js:5` deckt 7996 in derselben Assertion wie den belegten Median ab
   („amtlich belegt") — der Test leiht der ungeprüften Zahl Autorität.

   **(h) a11y-🔴 (a11y-Prüfer + Polygrafin unabhängig):** rohes `palette.gold` als **Text**
   = **1.93:1** (nötig 4.5:1) in `LohnEinordnung.jsx:86,114` + `RegionalBarometer.jsx:121,129` —
   der Gold-Fall ist die Unter-Median-Lage, also die Zielgruppe. `readoutColor` (Deep) steht
   27 Zeilen höher fertig da; `MietVergleich.jsx:51` hat den Fix schon.
   **Und:** Mindestlohn-Unterschreitung **nur über Farbe** (WCAG 1.4.1 **Level A**) — Text in
   beiden Zuständen identisch, `aria-label` nennt sie nicht, und der ausformulierte Satz
   `lohnCheck.unterMindestlohn` rendert **nur** in `ChapterView`, nicht in `FinanzUebersicht`.

   **(i) `unpaidWage` behauptet einen Betrag für einen unbekannten Zeitraum** —
   `briefGenerator.js:531`: `{months}` bleibt „[bitte ergänzen]", der Betrag wird mit **einem**
   Monatslohn gefüllt. Wer 3 Monate schuldet, mahnt gedruckt ein Drittel.
0a. **Alt-PII auf der Platte löschen — Stebler Studios führt aus** (~85 MB, ausserhalb git):
   fünf Vor-Purge-Mirror in `_maloja-archiv/` (durchgehend Drittperson-Name) + `maloja_frontend_STRAY`
   (kein `.git`, nichts Einzigartiges, aber eigene veraltete `SESSION_START.md` = Zweitwahrheit)
   + `docs-archive-2026-07-14/_research-2026-05_BACKUP-vor-namensersetzung`.
   **Bleibt:** `maloja-mirror-PURGE2.git` (0 PII, HEAD `35bd840`) · `handoffs/` · die neue
   `HASH-LANDKARTE-vor-purge.md`. Der Purge ist damit erstmals auch lokal fertig.
   (In `research-2026-05/` sind die 11 Beispiel-Namen bereits auf `M./A. Muster` gehoben.)
0b. **Infomaniak-Panel `Permissions-Policy` → `geolocation=(self)` — GEPARKT zur Logins-/Backend-Phase** (Stebler-Studios-Entscheid 2026-07-14). Aktuell `geolocation=()` → **blockt den Opt-in-Standort der Notfall-Vorlesekarte** (einzige Folge). Panel-Handgriff, unabhängig von Logins, aber bewusst gebündelt. Der r7-`.htaccess`-Fix greift NICHT (`deploy.sh` löscht `dist/.htaccess`; Header laufen übers Panel). Gegenprüfen: `curl -sD - -o /dev/null https://malojaplana.ch/ | grep -i permissions-policy`. Merker: repo-`.htaccess` ist damit **vestigial**.
1. **Offene Kleinigkeiten aus der Sitzung 2026-07-15** (alle auf den zwei Feature-Zweigen):
   - **RM-Feinschliff:** Die neuen Strings (`lohnCheck.hoursMissing`, `briefe.jobPicker`,
     `lohnEinordnung.*`, `finanzen.sideEmployer*`) sind in rm Bau-Qualität, kein Endstand.
   - **Doppelte Kanton-Nennung** im Lohn-Brief: „sowie Genf — Art. 39K LIRT **(Kanton Genf)**".
     Die Vorlage hängt „(Kanton X)" an, die `gesetz`-Strings tragen den Kanton schon vorne.
     Betrifft alle 5 Kantone, ist pre-existing, reines Rauschen — kein Fehler.
   - **Marken-Kollision** im Miet-Barometer ist gefixt (`f6d45b9`), aber nur für „!" vs. Strich.
   - **`verify:true`-Fallback ohne Deckung:** Seit NE/BS belegt sind, trägt KEIN Kanton mehr
     `verify: true` — der neutrale Zweig in `wageClaimRefs` ist damit nicht mehr über einen
     echten Kanton getestet (Wächter dafür in `lohnRechtsstellen.test.js`).
2. **⭐ Tresor Phase 2b — Schritt 1.** Bestandsaufnahme
   2026-07-13 fertig (`secureStore.js` dormant/0 Importe, PBKDF2 100k, alle 4 🔴 real im
   Code bestätigt). Sicher beginnen — nichts ist aktiviert, reine Logik + Tests, **KEINE UI**:
   die 4 Blocker im dormanten `secureStore` fixen — (1) Doku-Blobs vor dem Verschlüsseln
   hydrieren · (2) `or5_*_prerestore`-Klartext mit-löschen · (3) Crash-Guard um
   `unpackRecord`/`atob` · (4) Backup bei aktivem Tresor nicht leer — plus PBKDF2 100k→600k
   (versioniert), Passphrase-Stärke, `VAULT_*`→`TRESOR_*`. Dann UI (Schritt 2), dann
   Voll-Zyklus live verifizieren (Schritt 3). Details: `docs/design/tresor-lock.md`.
   Bau-Freigabe nötig (berührt ALLE Daten — hohe Sorgfalt).
   ~~**Vorher/parallel — DEPLOY-BEREIT:** `main` (`e2953f7`, #72–#80) ist Deploy-Gate-GRÜN
   (Predeploy-Runde 5, Marke gesetzt).~~ **Überholt (2026-07-15):** `e2953f7` war der dritte
   tote `main`-Hash in dieser Datei; die Runden 4–7 (#72–#84) sind längst deployt und
   verified-live in `index-1f4c6867.js`. Der aktuelle Stand ist **Runde 8, Gate ROT** — siehe
   Punkt 0. ⚠️ Mindestlohn-Daten sind Stand 2026 (offiziell verifiziert) — vor JEDEM
   künftigen Jahreswechsel neu prüfen (GE/NE/BS indexiert).
   **Weiter geparkt (nicht blockierend) — whole-app-a11y/design-Sweep** (aus Runde-4/5-Vollbatterie):
   `MobileNav`-Schubladen-Fokus-Management (Fokus rein/zurück, Hintergrund inert) · Doppel-`h1`
   in `Lebenssituationen.jsx` (→ `PageTitle`) · `DocumentTresor`-Icon-Buttons 36→44px + Lösch-Rückfrage ·
   `LanguageSwitcher` kein 44px · `ChartsAdvanced` Farbenblind (rose-Duplikat + Hex statt Token) ·
   `htmlFor`/`id`-Kopplung breit (`LabeledField`-Migration fortsetzen) · Zweit-Formular-Tap-Ziele <44px ·
   `FinanzUebersicht`-StatusCard-SaaS-Muster · Token-Hygiene (Abstands-Drift, `PrimaryButton`-Reuse,
   Pseudo-Headings, `text.xs-1`) · Dashboard-`mvo.fields`-Doppel-Scan · `ChapterView:1785`-`.replace`-Kette ·
   2 ungeschützte `localStorage`-Zeilen · Meta-CSP als HTTP-Header · AHV Phase B.
3. **rm-Gegenlese** der neuen Keys (`TODO(rm)` gesetzt): `ipvStatus.*`, `barKurz.*`,
   `schnellcheck.ipvSubsumed/ipvEnthalten`, `sozialhilfe.repayment*` — Muttersprachler:in.
   **Neu dazu:** die in Predeploy-Runde 2 ergänzten RM-Vus-Formen (`{sie,du}`-Split) sind
   Best-Effort und gehören in dieselbe Gegenlese.
4. **Design-Vision offen (Discussion/Build):** #3-Instrumente EL (qualitativ) · Baum↔Obstgarten
   (Entscheid E) · Haus-Karte vs. Skeuo-Liste Metapher-Abgleich. Backlog: `docs/design/design-backlog.md` E.
   *(⚠️ Überschneidet sich mit Punkt 8 — beide Einträge stehen bewusst noch da; Zusammenlegen
   ist ein Entscheid von Stebler Studios, nicht des Predeploys.)*
5. **Tresor-Lock bauen** (Konzept steht, `docs/design/tresor-lock.md`): opt-in Passphrase-
   Verschlüsselung aller `or5_*`-Stores, Backup beim Setup. Erst mit ausdrücklicher Freigabe;
   Native-Secure-Safe-Vision (Ordner auf dem Gerät + Keychain/Keystore) → „Logins-Phase"
   zusammen mit App-Store/iOS-Recherche.
6. **Rechts-Feinschliff (offen, belegt vorbereitet):** exakte Kantons-Mechanik IPV automatisch
   vs. Antrag (schärft die Verzweigung); Rückerstattungs-Zahlen sind ZH-Werte (kantonal prüfen).
7. **GitHub-Support-Ticket** (Stebler Studios, Account-Aktion): nach dem Historie-Purge die
   gecachten Commits + `refs/pull/*/head` entfernen lassen (Formular
   support.github.com/contact/private-information). Ein normaler `git clone` ist sauber;
   die PR-Refs tragen die Alt-Gmail noch. Force-push erreicht sie nicht. **Zusätzlich:** die
   zwei privaten Alt-Mails standen kurz in `SESSION_START.md` (Commit `14d4196`, per PR #54
   bereinigt) → im selben Ticket den Cache dafür mit entfernen lassen.
8. **Design-Vision (Diskussion, kein Build) — gewählte Reihenfolge: erst §3, dann §2:**
   §3 Schnellchecks als Instrumente (Prototyp mit *einem* Check), §2 Obstgarten vs. ein
   Baum (Lean: beim einen Baum bleiben). Siehe `docs/IDEEN.md` „Nächste Schritte".
   *(⚠️ Überschneidet sich mit Punkt 4 — siehe dort.)*
9. **`docs/archive` Namen-PII** (offen): Persona-Beispiele mit echtem Namen/Geburtsjahr —
   der Purge ersetzte nur Mail-Strings, nicht Fliesstext. Separater Schritt auf ausdrückliche Freigabe.
10. Offen a11y (nicht-blockierend): #4 Fokusring-Farbe (Kür). rm-Gegenlese (Führerausweis
   + fr/it/rm generell).
11. **Entscheid offen — Regel-Konflikt Frucht-Farbe vs. WCAG 1.4.11** (aus Predeploy-Runde 8,
   Polygrafin): Die Balken-Füllung trägt die Frucht-Farbe (Arbeit=Haselnuss `#A8895E`,
   Wohnen=Birne `#7E9A4E`) gegen die Spur `palette.border #DCDAD6` → **2.35:1** bzw. **2.27:1**
   im Hellmodus; WCAG 1.4.11 will 3:1 für bedeutungstragende Grafik.
   **Kein Regress** (das alte `sky` lag bei 2.40:1, im Dunkelmodus hat der neue Code auf
   4.83:1 **verbessert**) — aber `docs/design/farb-und-daten-system.md:25,33` **schreibt die
   Frucht-Farbe ausdrücklich vor**. Das ist ein Konflikt zwischen zwei Regeln, kein Versehen:
   dunklere Spur? Frucht-Deep-Variante? Die Design-Doku muss entscheiden, nicht der Predeploy.
12. **Governance-Reste aus Runde 8** (nicht blockierend, aber Arbeit ausserhalb git):
   - `.claude/settings.json` ist weiterhin **ungetrackt** (`.gitignore:21`), enthält aber
     deny/ask-Liste **und** den Tests-vor-Commit-Hook. Massstab der eigenen `.gitignore`:
     „Was nicht in git ist, ist nicht sicher."
   - Darin: `Bash(git push:*)` steht **gleichzeitig** in `allow` und `ask` → `allow` gewinnt,
     `ask` läuft leer. Der `allow`-Block existiert überhaupt und enthält als einzigen Eintrag
     genau `git push` — der Memory-Entscheid lautet „nur deny+ask, kein allow".
   - `public/icon-preview.html` wird nach `dist/` gespiegelt → live unter
     `malojaplana.ch/icon-preview.html`, mit Inline-`<script>` und **ohne** die Meta-CSP aus
     `index.html`. Nicht ausnutzbar (nur statische Arrays), aber ein Dev-Werkzeug auf Prod.
   - `frame-ancestors 'none'` in `index.html:6` ist **wirkungslos** — die CSP-Spec ignoriert
     die Direktive in `<meta>`. Klickjacking-Schutz sieht vorhanden aus, ist es nicht.
     → gehört als HTTP-Header ins Infomaniak-Panel, zusammen mit Punkt 0b.
   - Stand „2 ungeschützte `localStorage`-Zeilen" ist **falsch**: es sind **12 aktive**
     (+9 im dormanten Tresor). Keine neu aus Runde 8.

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

- **⭐ Sitzung IMMER aus `maloja-frontend/` starten, nie aus `~/Projects/maloja plana/`.**
  Claude Code sucht `.claude/` relativ zum Arbeitsverzeichnis. Auf der Container-Ebene gibt es
  keins → die 9 Prüf-Agenten und die Slash-Commands laden nicht, `/maloja-predeploy` ruft ins
  Leere. Es ist **der Ort, nicht das Timing** — ein Neustart behebt es nicht. (Teuer gelernt
  in Runde 8: die Doku behauptete an zwei Stellen „lädt beim nächsten Sitzungsstart".)
- **⭐ Gegenprobe vor Glauben — Schritt 1 jedes Predeploys:** `git rev-parse HEAD` und
  `git diff <LIVE-Marker>..HEAD -- src/`. Diese Datei kann einen Merge alt sein; ist das
  `src/`-Delta nicht leer, hängt ein echter Deploy — egal was oben steht. (In Runde 8 stand
  hier „`main` IST live, kein Deploy hängt", während 23 `src/`-Dateien davor lagen.)
- Neue `<button>`/Titel IMMER `color` setzen (Dark-Mode-Falle).
- Bei i18n-Edits zügig committen.
- Parallel-Sitzung im selben Working Tree: eigenen Branch ab `main` nehmen (nicht nur
  eigene Dateien stagen — Datei-Isolation ≠ Branch-Isolation; teuer gelernt bei PR #19).
- Onboarding-Bypass zum Testen: `or5_onboarding_done` / `or5_lang` / `or5_tour_done` = true.
- **Historie-Purge IMMER auf frischem `git clone --mirror` von GitHub**, nie dem lokalen
  Repo — dem können Refs fehlen (Alt-Tags/PR-Branches), die sonst die Alt-Historie am
  Leben halten. Lokales `git config user.name` muss „Stebler Studios" sein (nie Vorname).
