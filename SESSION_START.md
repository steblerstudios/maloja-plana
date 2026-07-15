# SESSION START — zuerst lesen

> Die **objektive, repo-interne Wahrheit** über den aktuellen Stand. Am Sitzungs-Ende
> aktualisieren (via `/session-close`). Bei Widerspruch zu anderen Docs gilt
> **diese** Datei. Persönliche Session-Historie/Ideen → Claude-Memory, nicht hierher.
>
> Boot: `npm run dev` (Port 5174, via `.claude/launch.json`). Deploy: `bash deploy.sh`
> von `main` (nur Stebler Studios). Verifizieren live: Footer-Version + Bundle-Hash greppen.

**Stand:** 2026-07-15

## Wo stehen wir gerade

| | |
|---|---|
| Aktueller Branch | **`main` = `5a4851c`** — zwei Feature-Zweige offen, beide gepusht, keiner gemergt: `feat/befund-brief-lohn` (`d5a2898`) und darauf `feat/lohn-mietzins-barometer` (`6c143b0`). Dazu ein Stand-Sync-Zweig `chore/stand-sync-r13`. |
| `main` steht auf | **`5a4851c`** (= `origin/main`, gegengeprüft 2026-07-15). Der frühere Eintrag `35bd840` war die **Merge-Falle**: Ein Stand-Sync-PR dokumentiert den Zeiger, sein eigener Merge rückt `main` dahinter. Delta `35bd840`→`5a4851c` = **nur Doku + Merge, kein `src/`** — bewiesen, indem `main` gebaut wurde: Bundle = `index-1f4c6867.js`, **identisch mit dem Live-Bundle**. |
| Version (package.json) | `0.1.25-beta` |
| Letzter Tag | `v0.1.25-beta`. ⚠️ Der Tag zeigt auf `31abc36` — ein Hash, den der Purge **getötet** hat (`git log 31abc36..HEAD` bricht ab). Ab jetzt setzt `deploy.sh` den Tag automatisch aus `package.json`. |
| Live (malojaplana.ch) | Bundle `index-1f4c6867.js` / CSS `index-0fb5458d.css` → **DEPLOYT & verified-live** (2026-07-15 gegengeprüft: `main` frisch gebaut → derselbe Bundle-Hash). Also: **`main` IST live, kein Deploy hängt.** ⚠️ **Ausnahme:** r7-`.htaccess`-Fix `geolocation=(self)` NICHT live — `deploy.sh` strippt `.htaccess`, Header kommt aus dem Infomaniak-Panel (dort noch `geolocation=()`, am 2026-07-15 per `curl` bestätigt). |
| ⚠️ Tote Hashes | Alle Hashes von **vor** dem Purge (2026-07-14) lösen nicht mehr auf — u. a. der Live-Marker `31abc36` und `.maloja/predeploy-ok`. **Ein toter Hash heisst NICHT, dass die Arbeit erfunden war.** Nachschlagen: `grep '<hash>' _maloja-archiv/HASH-LANDKARTE-vor-purge.md` (2070 Einträge, PII-frei). |
| **Runde 2026-07-12/13 (live)** | **✅ GEMERGT + LIVE (PRs #47–#59): Runde 2026-07-12 + Anspruchs-Instrumente Phase 1 (IPV-Beleg + Sozialhilfe-Pegel) + Design-Docs-Ent-Drift** |
| **Runde 2 (IPV-Lebenslinie) — ✅ LIVE** | **✅ PR #60 (`d9ee62b`):** IPV-Lebenslinie Phase 2 + Sozialhilfe-Rückerstattung + Predeploy-Fixes (Stempel/Kompass/Sie-Du/ipvSubsumed). Runde-2-Gate grün, ZH-Beträge live gegen Handbuch verifiziert. **Deployt in `index-8aeb4a84.js`.** |
| **Runde 3 (Tresor + AHV-21) — ✅ LIVE** | **✅ PRs #62/#63/#65/#66 (`a9578f1` → in `69ea85e`):** Tresor-Lock cryptoCore/secureStore (**dormant/unverdrahtet**, Web Crypto, keine Deps) · AHV-21-Referenzalter der Frauen JG1961–63 (monatsgenau, swiss-precision-verifiziert) · a11y-soft-Kontrast. **Predeploy-Runde 3 (19 Agenten)** fand 3 🔴 → alle gefixt: AHV-Integration in Vergleichstabelle/Zukunftsbild/Feld-Default (#65, JG1962→2'341.33/0% statt Phantom-Aufschub), PII-Leak (#66), **Tresor-🔴 als Phase-2b-Blocker geparkt** (dormant, `docs/design/tresor-lock.md`). Polish #68: a11y 44px-Header-Schalter + Chip-Kontrast, Pensionierung-Frist ans echte Referenzalter, vr.source-Zitat. **Deployt in `index-8aeb4a84.js`.** |
| **Runde 4 (Doku + Governance + Momentum + Sie/Du) — 🟢 GEMERGT, Gate GRÜN, NICHT LIVE** | **#72/#73** Doku-Sprawl-Konsolidierung · **#74** Feature-Level-Tagging L0–L5 (`GOVERNANCE_LEVELS.md`, Runtime dormant) · **#75** Momentum-Anti-Druck-Zeile (`nextUpReassure`) · **#77** Sie/Du-Split der Zeile + Batterie-Polish (FinanzUebersicht-Chip Dunkelkontrast '60'→'40', `ctrlBtn`/Anrede `radius.sm`, `du`→`Du`, `leading.normal`). **Predeploy-Runde 4: volle Batterie (10 Prüfungen — Security+a11y+Design ganze App + Domänen + code-review) = 0 🔴.** In `main` (`b750e9e`), noch nicht deployt. |
| **Runde 5 (#79/#80) — 🟢 GEMERGT, Gate GRÜN, NICHT LIVE** | **#79** i18n-Jahr-Interpolation `lohnCheck.unterMindestlohn`. **#80 (Predeploy-Runde 5, volle Batterie erneut = 0 offene 🔴):** zwei pre-existing 🔴 gefixt — (1) **Kantons-Mindestlöhne auf 2026 offiziell verifiziert korrigiert** (GE 24.32→24.59, NE 21.31→21.35, BS 21.00→22.20 + `indexiert`-Flag, JU/TI bestätigt; war False-Negativ-Warnungs-Risiko, Wahrheits-Disziplin) · (2) **Schwarz-auf-Sage-🔴** an 3 Buttons (4.32:1)→`sageBtn`/weiss. Plus DE-Grammatik „beim". |
| **Runden 4–7 (#72–#84) — ✅ JETZT LIVE** | Doku/Governance (#72–74), Momentum-Zeile+Sie/Du (#75/#77), i18n-Jahr (#79), Mindestlohn 2026 (#80), SEO/GEO-Fundament (#82), roseDeep+tote-Links (#83), Predeploy-r7 a11y+BWO (#84) — **alle deployt + verified-live in `index-1f4c6867.js`** (2026-07-14). Predeploy-Runde 7: volle 8-Agenten-Batterie 0 🔴, alle ⚠️ auf ausdrücklichen Wunsch vor Deploy gefixt. |
| **Runde 8 (2026-07-15) — 🟡 GEBAUT + GEPUSHT, NICHT gemergt, NICHT live** | **`feat/befund-brief-lohn` (`d5a2898`):** `c56272f` **Teilzeit-Fehlalarm behoben** — ohne erfasste Wochenstunden nahm der Mindestlohn-Befund blind Vollzeit an (182 Std.); CHF 3000 bei 50% wurden als 16.48/Std. statt 32.97/Std. gelesen → korrekt bezahlte Teilzeit-Angestellte wurden für unterbezahlt erklärt, **und der Befund führt neu zu einem Brief an den Arbeitgeber**. Jetzt nur `pruefeStundenlohn`; ohne Stunden ruhige Einladung statt Warnung, kein Brief-Knopf. · `1bca5a8` Arbeitgeber-**Adresse** (beide Kapitel, quer befüllt) + **Haupt-/Nebenerwerb-Auswahl** (`options.job` steuert Empfänger UND Zahlen) · `d5a2898` **NE/BS amtlich gegengeprüft** — NE hat KEIN „Mindestlohngesetz", der Mindestlohn steht in der **LEmpl von 2004, Art. 32a ff. (RSN 813.10)**; BS = **MiLoG vom 13.01.2021 (SG 812.200)**, Stelle AWA. Beide von `verify:true` → `false`. <br> **`feat/lohn-mietzins-barometer` (`6c143b0`, ab dem obigen):** `bc52438` **Barometer-Rebuild** nach der Rebuild-Spec (Lohn + Miete spiegelgleich in der Finanz-Übersicht, `data/lohnEinordnung.js`, `components/LohnEinordnung.jsx`, `components/MietVergleich.jsx` in BEIDEN Orten, `RegionalBarometer` + `fillColor`/`thresholdValue`) · `99c741f` `docs/design/farb-und-daten-system.md` · `f6d45b9` **Marken-Kollision** („!" und CH-Schnitt fallen bei ~CHF 4'000 Einkommen aufeinander — 1327×3=3981, mitten in der Zielgruppe) · `6c143b0` **Prüf-Agenten neu gebaut + `.claude/agents\|commands` in git**. |
| **Deploy-Gate** | **Verbraucht** — letzter Deploy `31abc36` verified-live. #86/#87 sind Doku/CI/Deploy-Tooling (kein `src/`-App-Code) → **Live-Bundle unverändert, kein Deploy nötig**. Nächster App-Deploy braucht frisches `/maloja-predeploy` (neue Marke auf neuem HEAD); `deploy.sh` fährt jetzt zusätzlich PII- + SEO-Gate und setzt den Release-Tag automatisch. |

**⚠️ HISTORIE UMGESCHRIEBEN — ZWEIMAL.** (1) 2026-07-11: Alt-Mails raus, Autoren → „Stebler Studios". (2) **2026-07-14: Personas/Tester/Freunde/Drittperson („Maria Stebler")/Mac-Benutzername + `docs/archive` (199 Dateien) aus der GESAMTEN Historie** (`filter-repo` invert-paths + replace-text, `main`→`35bd840`, force-push, alle Tags/Branches neu, lokal frisch geklont). Verifiziert 0 Treffer gegen `main`. **Bewusst geblieben:** eigener Name „Sophie Stebler" (Autoren-Angabe README/package.json + nDSG-Impressum, öffentlich). **Offen (2 Reste):** (a) `refs/pull/*/head` blieben beim Push abgelehnt → GitHub-Support-Ticket (SHA-Cache + PR-Refs, Formular private-information); (b) alte lokale Mirror-Backups in `_maloja-archiv/` mit Alt-PII (löschbar, waren Recovery-Netze). Details Claude-Memory `feedback_no_owner_name_in_git` + `project_cleanup_inventory` + Runbook `_maloja-archiv/HISTORIE-PURGE-NAME-2026-07-14.md`.

## Verifikations-Status (das Wichtigste)

> Feature-für-Feature-Detail (built/deployed/verified-live): [`FEATURES.md`](FEATURES.md).


- **Live:** Bundle `index-1f4c6867.js` / CSS `index-0fb5458d.css` läuft auf malojaplana.ch.
  **`main` (`5a4851c`) IST der Live-Stand** — am 2026-07-15 bewiesen, nicht angenommen:
  `main` frisch gebaut → identischer Bundle-Hash. Kein Deploy hängt.
  Tests grün, i18n-Parität 5 Spr., Build sauber.
  - *(Dieser Abschnitt nannte bis 2026-07-15 `index-8aeb4a84.js` und widersprach damit dem
    Kopf der Datei. Beide Stellen zeigen jetzt denselben, gegengeprüften Hash — bei
    Widerspruch gilt diese Datei, also darf sie sich nicht selbst widersprechen.)*
  - Falle (weiter gültig): nach jedem Merge prüfen, dass `deploy.sh` wirklich frisch baut
    (schon mal alter Build ausgeliefert).
- **⚠️ Testlauf-Falle (neu 2026-07-15):** `npm test` zählt die Tests **paralleler Worktrees**
  unter `.claude/worktrees/` mit — gemeldet wurden 122 Dateien/1327 Tests statt der echten
  62/689. Ehrliche Zahl: `npx vitest run --exclude='**/node_modules/**' --exclude='**/.claude/**'
  --exclude='**/dist/**'`. Fix als eigener Task unterwegs (`fix/vitest-exclude-claude-worktrees`).
- **GitHub Flow ist scharf:** `main` = einziger Stamm, kein `dev`, kein Sync-back.
  Ablauf `feat/…` → `deploy.sh --stage` → PR→main → `deploy.sh`; Qualitäts-Ring je
  Schicht (`DEV_WORKFLOW.md`). `/session-close` schliesst Sitzungen ab. Kapitalbezugs-
  steuer (`e4fe262`) ist in `main` und live.

## Nächste Schritte

0. **⭐ `/maloja-predeploy` — die nächste Sitzung startet HIER.** Zwei Zweige warten auf den PR:
   `feat/befund-brief-lohn` (`d5a2898`) und darauf `feat/lohn-mietzins-barometer` (`6c143b0`).
   689 Tests grün, Build sauber, PII-Scan grün, alles live im Browser verifiziert.
   **Warum erst jetzt:** Die Prüf-Agenten waren verloren und wurden am 2026-07-15 neu gebaut
   (`.claude/agents/`, 9 Stück) — Claude Code lädt sie erst beim **Sitzungsstart**, in der
   Bau-Sitzung waren sie noch nicht da. Jetzt laufen sie.
   **Zuerst `swiss-precision-pruefer`:** In `data/branchenLohn.js` steht `LSE_VERTEILUNG` mit
   `durchschnitt: 7996`, `p10: 4487`, `p90: 12178` als **`verify: true`** — sie werden unter
   einer BFS-Quellenangabe **angezeigt**, sind aber nicht belegt: Das BFS publiziert Mittelwert
   und Perzentile nur in **STAT-TAB** (interaktive Datenbank, nicht zitierbar). Median `6788`
   ist belegt (BFS-Medienmitteilung 19.03.2024). ⚠️ Merker: `/maloja-predeploy` Schritt 1 liest
   den LIVE-Marker aus dieser Datei — der Tag-Hash `31abc36` ist tot, nimm `5a4851c`.
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
