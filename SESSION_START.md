# SESSION START — zuerst lesen

> Die **objektive, repo-interne Wahrheit** über den aktuellen Stand. Am Sitzungs-Ende
> aktualisieren (via `/session-close`). Bei Widerspruch zu anderen Docs gilt
> **diese** Datei. Persönliche Session-Historie/Ideen → Claude-Memory, nicht hierher.
>
> Boot: `npm run dev` (Port 5174, via `.claude/launch.json`). Deploy: `bash deploy.sh`
> von `main` (nur Stebler Studios). Verifizieren live: Footer-Version + Bundle-Hash greppen.

**Stand:** 2026-07-18 (Runde 8 LIVE · Runde 9: maloja-c-Extraktion + Tresor 2b-pre/LockScreen)

## Wo stehen wir gerade

| | |
|---|---|
| Aktueller Branch | **`main`** (Sitzung 2026-07-18 endete an drei Merges: #100/#101/#102). Der Abschluss läuft über `chore/session-close-2026-07-18` → PR (GitHub Flow, nicht direkt auf `main`). |
| `main` steht auf | **`4c79bee`** (= `origin/main`, gegengeprüft 2026-07-18; Merge von #102). ⚠️ **Merge-Fallen-Regel (Gegenprobe = Schritt 1):** Steht hier ein Hash, der einen Merge alt ist, und `git diff <hier>..main -- src/` ist **leer** → ok. **Ist das Delta NICHT leer, hängt ein echter Deploy.** |
| Deploy hängt? | **NEIN — `main` (`4c79bee`) ist LIVE.** Deployt 2026-07-18 13:59 → Live-Bundle **`index-c5906715.js`** == frischer `main`-Build, per `curl` gegengeprüft. Damit ist die **KVG-«Kurz innehalten»-Änderung (#101) live**; #100 (Tresor 2b-pre) dormant + #102 (LockScreen) dev-only sind byte-neutral mitgegangen. `git diff <predeploy-ok>..HEAD -- src/` als Gegenprobe beim nächsten Mal. |
| Version (package.json) | `0.1.25-beta` |
| Letzter Tag | `v0.1.25-beta`. ⚠️ Der Tag zeigt auf `31abc36` — ein Hash, den der Purge **getötet** hat (`git log 31abc36..HEAD` bricht ab). Ab jetzt setzt `deploy.sh` den Tag automatisch aus `package.json`. |
| Live (malojaplana.ch) | Bundle **`index-c5906715.js`** / CSS `index-6b0b5577.css` (= `main` `4c79bee`, deployt **2026-07-18 13:59**, per `curl` verifiziert). Enthält Runde 8 (Lohn-Befund-Brief + Barometer) **und** Runde 9 (KVG-«Kurz innehalten» sichtbar; #100 Tresor dormant, #102 LockScreen dev-only/nicht im Prod-Bundle). Vorheriges Runde-8-Bundle war `index-96dd34ec.js` (11:53). ⚠️ **Ausnahme (weiter gültig):** r7-`.htaccess`-Fix `geolocation=(self)` — `deploy.sh` strippt `.htaccess`, Header kommt aus dem Infomaniak-Panel. |
| **Runde 9 (2026-07-18) — 🟢 GEMERGT (#99–#102), teils NICHT live** | **#99** maloja-c-Docs-Extraktion (Zielarchitektur, Positionierung, Tresor-Zielbild — docs-only). **#100 Tresor 2b-pre:** 4 🔴 der harten Vorbedingung + Härtung (Doc-Blobs verschlüsseln, prerestore-Purge best-effort, freundlicher Fehler, Leeres-Backup-Guard; PBKDF2 600k versioniert, `TRESOR_MIN_PASSPHRASE=12` + Merksatz-Nudge, Backup-Zwang, `VAULT_*`→`TRESOR_*`) — **dormant, kein Live-Effekt.** **#101 KVG «Kurz innehalten»:** Anti-Dark-Pattern-Schritt in KVGWechsel + i18n ×5 — **live-wirksam, noch nicht deployt.** **#102 LockScreen-Design:** Tresor-2b-UI-Wand entkoppelt (nur `onUnlock`-Prop), `tresorLock`-i18n ×5, dev-only `#/lockpreview` — **Prod byte-neutral.** 748 Tests grün, Size 64.97/65 kB. |
| Deploy-Zugang | **`.deploy.local` am 2026-07-18 wiederhergestellt** (war beim Klon verloren): `SFTP_HOST=et9l2r.ftp.infomaniak.com`, `SFTP_USER=et9l2r_admin` (NICHT der `_temporary_`-SSH-Zugang — der ist kein SFTP-Konto), `REMOTE_DIR=/home/clients/c6c3e5438c4705c1cdcb2a0bc0130c62/sites/malojaplana.ch/`. Passwort nur interaktiv. **⚠️ ausserhalb git sichern (Passwort-Manager)** — dritter Verlust dieser Art. |
| ⚠️ Tote Hashes | Alle Hashes von **vor** dem Purge (2026-07-14) lösen nicht mehr auf — u. a. der Live-Marker `31abc36` und `.maloja/predeploy-ok`. **Ein toter Hash heisst NICHT, dass die Arbeit erfunden war.** Nachschlagen: `grep '<hash>' _maloja-archiv/HASH-LANDKARTE-vor-purge.md` (2070 Einträge, PII-frei). |
| **Runde 2026-07-12/13 (live)** | **✅ GEMERGT + LIVE (PRs #47–#59): Runde 2026-07-12 + Anspruchs-Instrumente Phase 1 (IPV-Beleg + Sozialhilfe-Pegel) + Design-Docs-Ent-Drift** |
| **Runde 2 (IPV-Lebenslinie) — ✅ LIVE** | **✅ PR #60 (`d9ee62b`):** IPV-Lebenslinie Phase 2 + Sozialhilfe-Rückerstattung + Predeploy-Fixes (Stempel/Kompass/Sie-Du/ipvSubsumed). Runde-2-Gate grün, ZH-Beträge live gegen Handbuch verifiziert. **Deployt in `index-8aeb4a84.js`.** |
| **Runde 3 (Tresor + AHV-21) — ✅ LIVE** | **✅ PRs #62/#63/#65/#66 (`a9578f1` → in `69ea85e`):** Tresor-Lock cryptoCore/secureStore (**dormant/unverdrahtet**, Web Crypto, keine Deps) · AHV-21-Referenzalter der Frauen JG1961–63 (monatsgenau, swiss-precision-verifiziert) · a11y-soft-Kontrast. **Predeploy-Runde 3 (19 Agenten)** fand 3 🔴 → alle gefixt: AHV-Integration in Vergleichstabelle/Zukunftsbild/Feld-Default (#65, JG1962→2'341.33/0% statt Phantom-Aufschub), PII-Leak (#66), **Tresor-🔴 als Phase-2b-Blocker geparkt** (dormant, `docs/design/tresor-lock.md`). Polish #68: a11y 44px-Header-Schalter + Chip-Kontrast, Pensionierung-Frist ans echte Referenzalter, vr.source-Zitat. **Deployt in `index-8aeb4a84.js`.** |
| **Runde 4 (Doku + Governance + Momentum + Sie/Du) — 🟢 GEMERGT, Gate GRÜN, NICHT LIVE** | **#72/#73** Doku-Sprawl-Konsolidierung · **#74** Feature-Level-Tagging L0–L5 (`GOVERNANCE_LEVELS.md`, Runtime dormant) · **#75** Momentum-Anti-Druck-Zeile (`nextUpReassure`) · **#77** Sie/Du-Split der Zeile + Batterie-Polish (FinanzUebersicht-Chip Dunkelkontrast '60'→'40', `ctrlBtn`/Anrede `radius.sm`, `du`→`Du`, `leading.normal`). **Predeploy-Runde 4: volle Batterie (10 Prüfungen — Security+a11y+Design ganze App + Domänen + code-review) = 0 🔴.** In `main` (`b750e9e`), noch nicht deployt. |
| **Runde 5 (#79/#80) — 🟢 GEMERGT, Gate GRÜN, NICHT LIVE** | **#79** i18n-Jahr-Interpolation `lohnCheck.unterMindestlohn`. **#80 (Predeploy-Runde 5, volle Batterie erneut = 0 offene 🔴):** zwei pre-existing 🔴 gefixt — (1) **Kantons-Mindestlöhne auf 2026 offiziell verifiziert korrigiert** (GE 24.32→24.59, NE 21.31→21.35, BS 21.00→22.20 + `indexiert`-Flag, JU/TI bestätigt; war False-Negativ-Warnungs-Risiko, Wahrheits-Disziplin) · (2) **Schwarz-auf-Sage-🔴** an 3 Buttons (4.32:1)→`sageBtn`/weiss. Plus DE-Grammatik „beim". |
| **Runden 4–7 (#72–#84) — ✅ JETZT LIVE** | Doku/Governance (#72–74), Momentum-Zeile+Sie/Du (#75/#77), i18n-Jahr (#79), Mindestlohn 2026 (#80), SEO/GEO-Fundament (#82), roseDeep+tote-Links (#83), Predeploy-r7 a11y+BWO (#84) — **alle deployt + verified-live in `index-1f4c6867.js`** (2026-07-14). Predeploy-Runde 7: volle 8-Agenten-Batterie 0 🔴, alle ⚠️ auf ausdrücklichen Wunsch vor Deploy gefixt. |
| **Runde 8 (2026-07-15) — 🟡 GEMERGT in `main`, NICHT live; Blocker behoben auf `fix/predeploy-r8`** | ⚠️ **Predeploy-Runde 8 hat die Freigabe VERWEIGERT** — 9 🔴 in der Fachlogik. Volle Batterie: 9 Prüf-Agenten + Code-Review (44 Agenten); alle mechanischen Gates waren grün (701 Tests, Build, SEO 0/0, PII, Size, CSP, de-Chunks) — **die Skripte sahen nichts davon.** Behoben auf `fix/predeploy-r8` (siehe eigene Zeile). Details unten unter „Nächste Schritte" Punkt 0. <br> **`feat/befund-brief-lohn` (`d5a2898`, jetzt via PR #93 in `main`):** `c56272f` **Teilzeit-Fehlalarm behoben** — ohne erfasste Wochenstunden nahm der Mindestlohn-Befund blind Vollzeit an (182 Std.); CHF 3000 bei 50% wurden als 16.48/Std. statt 32.97/Std. gelesen → korrekt bezahlte Teilzeit-Angestellte wurden für unterbezahlt erklärt, **und der Befund führt neu zu einem Brief an den Arbeitgeber**. Jetzt nur `pruefeStundenlohn`; ohne Stunden ruhige Einladung statt Warnung, kein Brief-Knopf. · `1bca5a8` Arbeitgeber-**Adresse** (beide Kapitel, quer befüllt) + **Haupt-/Nebenerwerb-Auswahl** (`options.job` steuert Empfänger UND Zahlen) · `d5a2898` **NE/BS amtlich gegengeprüft** — NE hat KEIN „Mindestlohngesetz", der Mindestlohn steht in der **LEmpl von 2004, Art. 32a ff. (RSN 813.10)**; BS = **MiLoG vom 13.01.2021 (SG 812.200)**, Stelle AWA. Beide von `verify:true` → `false`. <br> **`feat/lohn-mietzins-barometer` (`6c143b0`, ab dem obigen):** `bc52438` **Barometer-Rebuild** nach der Rebuild-Spec (Lohn + Miete spiegelgleich in der Finanz-Übersicht, `data/lohnEinordnung.js`, `components/LohnEinordnung.jsx`, `components/MietVergleich.jsx` in BEIDEN Orten, `RegionalBarometer` + `fillColor`/`thresholdValue`) · `99c741f` `docs/design/farb-und-daten-system.md` · `f6d45b9` **Marken-Kollision** („!" und CH-Schnitt fallen bei ~CHF 4'000 Einkommen aufeinander — 1327×3=3981, mitten in der Zielgruppe) · `6c143b0` **Prüf-Agenten neu gebaut + `.claude/agents\|commands` in git**. |
| **Blocker-Behebung — ✅ via PR #97 in `main`, + dritte Prüfung** | Alle 9 🔴 aus Runde 8 behoben, dann DREI Prüf-Durchgänge gegen die Behebung selbst (jeder mit dem Auftrag, sie zu zerlegen). Bilanz: die Durchgänge 2+3 fanden **sechs weitere echte Fehler in den Fixes** (Netto/Brutto in `unpaidWage`, Netto als untere Schranke, Gate an den falschen Arbeitgeber, Zwei-Nenner-Marke, Netto-Stundenlohn unbeschriftet, Barometer-Text 4262 statt 4475) — alle behoben. **740 Tests grün** (64 Dateien), Build sauber, Size **64.96/65 kB**, i18n 32/32, PII + SEO grün. Der wichtigste Befund der Runde: dass die wiederholte adversariale Prüfung nötig war — Mechanik-Gates sahen KEINEN der Fehler. |
| **Deploy-Gate** | **⏳ Marke wird nach dem Merge von `fix/predeploy-r8-3` gesetzt.** `.maloja/predeploy-ok` ist **lokal + gitignored** (kein Repo-Artefakt) → wird auf den finalen `main`-HEAD geschrieben und lokal von `deploy.sh` gelesen. **Deploy selbst macht Stebler Studios** (nach `/code-review ultra`, billed, von SS ausgelöst — Claude kann es nicht starten). `deploy.sh` fährt PII- + SEO-Gate und setzt den Release-Tag automatisch. |

**⚠️ HISTORIE UMGESCHRIEBEN — ZWEIMAL.** (1) 2026-07-11: Alt-Mails raus, Autoren → „Stebler Studios". (2) **2026-07-14: Personas/Tester/Freunde/Drittperson („Maria Stebler")/Mac-Benutzername + `docs/archive` (199 Dateien) aus der GESAMTEN Historie** (`filter-repo` invert-paths + replace-text, `main`→`35bd840`, force-push, alle Tags/Branches neu, lokal frisch geklont). Verifiziert 0 Treffer gegen `main`. **Bewusst geblieben:** eigener Name „Sophie Stebler" (Autoren-Angabe README/package.json + nDSG-Impressum, öffentlich). **Offen (2 Reste):** (a) `refs/pull/*/head` blieben beim Push abgelehnt → GitHub-Support-Ticket (SHA-Cache + PR-Refs, Formular private-information); (b) alte lokale Mirror-Backups in `_maloja-archiv/` mit Alt-PII (löschbar, waren Recovery-Netze). Details Claude-Memory `feedback_no_owner_name_in_git` + `project_cleanup_inventory` + Runbook `_maloja-archiv/HISTORIE-PURGE-NAME-2026-07-14.md`.

## Verifikations-Status (das Wichtigste)

> Feature-für-Feature-Detail (built/deployed/verified-live): [`FEATURES.md`](FEATURES.md).


- **Live:** Bundle **`index-96dd34ec.js`** / CSS `index-6b0b5577.css` läuft auf malojaplana.ch
  (Runde 8, deployt 2026-07-18, per `curl` verifiziert — `BriefGenerator`+`RegionalBarometer`
  als HTTP 200 belegt). **`main` (`4c79bee`) baut frisch → `index-c5906715.js`, ≠ live** →
  ein Deploy hängt, aber nur die KVG-#101-Änderung (live-wirksam); #100 dormant, #102 dev-only.
  **748 Tests grün** (64 Dateien), i18n-Parität 5 Spr., Build sauber, Size 64.97/65 kB.
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

> **Stand 2026-07-18 (Runde 9):** Runde 8 ist LIVE. Der ⭐-Block „Runde-8-Blocker" darunter
> ist damit **erledigt + deployt** (Historie belassen). Aktuelle offene Schritte:

**A. ✅ ERLEDIGT — KVG-«Kurz innehalten» (#101) ist live** (Deploy 2026-07-18 13:59,
   Bundle `index-c5906715.js` == `main`, curl-verifiziert). Merker fürs nächste Deploy:
   `.maloja/predeploy-ok` nach jedem `main`-Vorrücken frisch auf HEAD setzen (die Marke
   war für Runde 8 auf `091c184`, stale fürs KVG-Deploy → neu gesetzt).

**B. Tresor 2b-UI — die echte Verdrahtung (eigene, frische Sitzung, fasst echte Daten an).**
   Fundament #100 (2b-pre) + Wand #102 (LockScreen, design-first) sind gemergt. Offen:
   Seam in `main.jsx` (bei `isTresorActive()` → LockScreen statt App; `onUnlock` → `unlockTresor`
   → entschlüsselter State; Speichern → `persistTresor`), **Aktivierungs-Flow** mit erzwungenem
   Backup-Export (`activateTresor` verlangt `backupConfirmed`) + Setup-UX „nimm einen ganzen
   Satz" (≥12), `tresorLock`-Fehlermeldungen durch i18n, Doc-Ladepfad (`main.jsx:744`
   `doc.data||getDocBlob`) an den entsperrten In-Memory-Zustand koppeln, `autoBackup.js`
   mitverschlüsseln. **Verify-Punkt (Self-Review #100):** Doc-Blob-id-Typ (String vs. idb-Key)
   einmal end-to-end mit echten Dokumenten gegenprüfen. Spec: `docs/design/tresor-lock.md`.

**C. Klein/offen:** IDEEN §13 Rest-Idee „Freigabe-/Export-Vorschau «Das verlässt dein Gerät»";
   `wageClaim`-Brief-Wiedereinschaltung (siehe alter Punkt 0 unten).

---

0. **⭐ Runde-8-Blocker: BEHOBEN + DEPLOYT (2026-07-18). Historie unten belassen.**
   ⚠️ Merker: `/maloja-predeploy` Schritt 1 liest den LIVE-Marker aus dieser Datei — der
   Tag-Hash `31abc36` ist tot. **Der LIVE-Marker ist `5a4851c`** (= Bundle `index-1f4c6867.js`).

   **Stand: alle 🔴 behoben, DREI adversariale Prüf-Durchgänge, alle Funde behoben.**
   Runde 8 (erste Batterie) fand 9 🔴. Weil die Behebung KI-geschrieben und zuerst ungeprüft
   war — genau der Zustand, der die 9 erzeugt hat —, lief eine **zweite** Batterie gegen die
   Behebung: sie fand VIER falsche Fixes (Netto/Brutto in `unpaidWage` · Netto als untere
   Schranke · Gate an den gut zahlenden Arbeitgeber · Zwei-Nenner im Barometer) + zwei
   a11y-Regresse. Behoben (`6c53776`). swiss-precision fand zusätzlich drei Dinge am FEATURE
   selbst → **`wageClaim`-Brief RUHT** (`WAGECLAIM_BEREIT=false`, `2b8e90e`).
   Nach dem Merge (PR #97) lief eine **dritte** Prüfung gegen die zwei bis dahin ungeprüften
   Commits — sie fand ZWEI weitere echte Fehler (`fix/predeploy-r8-3`, `8a5eb11`):
   Netto-Stundenlohn wurde im Kapitel unbeschriftet gezeigt (Folge der Umsortierung), und die
   Barometer-Textzeile sagte „bei Vollzeit CHF 4262" statt 4475 (Marke braucht 40h, Text 42h)
   — plus vier latente/Aufräum-Punkte. Alle behoben.
   **Muster (das eigentliche Ergebnis):** JEDER Prüf-Durchgang fand die vorigen Fixes falsch,
   auf dieselbe Art wie die Fehler, die sie beheben sollten. Mechanik-Gates (Tests/Build/
   SEO/PII/Size) sahen KEINEN davon. **Ein KI-Fix ist nicht fertig, bis ihn eine unabhängige
   adversariale Prüfung nicht mehr umwerfen kann.** Nach der dritten fanden swiss-precision +
   a11y+copy 0 neue Blocker; der Code-Review 2 (behoben). Eine vierte wäre möglich — die
   Konvergenz (die dritte fand nur noch 2 statt 4) und der ruhende Brief begrenzen das Risiko.

   **Offen aus der zweiten Batterie (⚠️/💡, nicht-blockierend — Feature-Genauigkeit):**
   - **`wageClaim` wieder einschalten** braucht: Sektor + Status erfassen (Lehre/Praktikum/
     unter 18/GAV/Landwirtschaft/Ferienjob), GE-Sätze differenzieren (24.59/18.07/18.44),
     je Satz ein amtlicher Beleg. Dann `WAGECLAIM_BEREIT=true`. Der Brief-Code ist fertig.
   - **LSE-Median enthält ⅟₁₂ des 13. Monatslohns** (BFS-Definition): wer den Monatslohn ohne
     13. einträgt, liest sich ~8 % zu tief ein. Entweder im Feld nach dem 13. fragen, oder
     `lohnEinordnung.source` sagt, was der Median einschliesst.
   - **Armutsgrenze 2279** (`FinanzUebersicht.jsx`): unbelegt, veraltet (BFS 2024: **2388**),
     und misst die falsche Grösse — sie gilt für *verfügbares äquivalenziertes Haushalts*-
     einkommen (nach Abzügen), der Code hält sie gegen rohes Personen-`monthlyIncome`. `4000`
     ebenfalls unbelegt. **Pre-existing (seit `e437a42`), schon live** — kein Regress dieser
     Runde, aber ein echter Wahrheits-Disziplin-Fund. (Mein eigener Kommentar „armutsrelevant
     = tatsächliches Geld" war falsch.)
   - **Branchen-Chips + `belowMedian`-Band** (`FinanzUebersicht.jsx`) vergleichen ROH-Einkommen
     mit Brutto-VZÄ-Medianen — dieselbe Netto/Brutto-Klasse, die das Barometer streng meidet.
     Gehört zum Design-Entscheid Punkt 12 (Einkommens-Bänder).
   - **Haselnuss `#947750` vs. Spur = 3.0003:1** — besteht WCAG 1.4.11 mit null Reserve; jede
     `border`-Retusche kippt es. Vorschlag `#8E724D` (3.23) + Test-Schwelle auf 3.1.
   - **Ferien-/Feiertagszuschläge:** alle drei Mindestlöhne sind OHNE definiert; bei Stundenlohn
     enthält das Monatseinkommen ~14 % davon → abgeleiteter Stundenlohn zu hoch → verpasste
     Unterschreitungen. Sichere Richtung (kein Fehlalarm), darum nur Merker.
   - **`ChapterView` „im Kanton GE"** (Code statt Name) — der Brief sagt „Genf". Pre-existing,
     `getCantonName` liegt bereit.

   **Warum eine zweite Batterie:** Der Fix ist KI-geschrieben und war zuerst ungeprüft — genau
   der Zustand, der die Blocker erzeugt hat. Er zahlte sich zweimal aus: der Code-Review fand
   in Runde 1 zwei Fehler, die **alle neun** Prüfer übersahen (Netto/Brutto, >42-Std.-Freispruch),
   und eine eigene Render-Probe deckte auf, dass mein erster Netto-Fix nur **halb** war (der
   Mindestlohn schwieg, der Median-Vergleich lief weiter — der BFS-Median ist auch brutto).

   **Predeploy-Runde 8 (2026-07-15) verweigerte die Freigabe.** Batterie: 9 Prüf-Agenten +
   Code-Review (44 Agenten). Mechanik komplett grün — die Funde sassen in der Fachlogik.
   Roter Faden: **derselbe Lohn wurde an fünf Orten verschieden beurteilt** (`ChapterView`
   2×, `briefGenerator`, Barometer, `getLetterTemplates`), und am Ende steht ein Einschreiben
   an einen Arbeitgeber. **Die Behebung ist darum kein Flicken je Fund, sondern eine Wahrheit:**
   `pruefeStundenlohn` entscheidet, alle anderen fragen sie.

   **Was behoben ist** (Details je Commit; ↓ = Fundtext von Runde 8, unverändert als Beleg):

   **✅ (a) Netto/Brutto wird nie geprüft** *(behoben `cbd422a`: 4. Parameter `einkommensart`, nur „brutto" gibt einen Befund; Vergessen ⇒ Schweigen. Neu `sideIncomeType`, sonst wäre der Nebenerwerb eine Sackgasse.)* — `briefGenerator.js:66` (`lohnBefund`), Lohn-Pfad
   liest `finanzen.incomeType` **nirgends** (verifiziert: 0 Treffer). Die App fragt die
   Einkommensart ab (`constants.js:202`) und rät im Hinweis ausdrücklich zu **Netto**
   („Netto ist was auf Ihrem Konto ankommt", `de.js:1314`) — die Mindestlöhne sind aber
   **brutto** (`lohnCheck.js:1`). GE, CHF 4'000 netto bei 42 Std. → App rechnet 21.98/Std.
   < 24.59 → rote Warnung → Brief. Brutto wären ~4'550 = 25.00/Std., also **legal**.
   *Wer der Anleitung der App folgt, beschuldigt den Arbeitgeber zu Unrecht.*

   **✅ (b) `incomeFTE` normalisiert nur nach unten** *(behoben `cbd422a`: bei bekannten Stunden IMMER normalisieren; `mlBreached` kommt aus `pruefeStundenlohn` — Kapitel und Barometer stimmen per Konstruktion überein.)* — `lohnEinordnung.js:63/66`:
   `partTime = hoursKnown && stunden < 42` → wer **mehr** als 42 Std. arbeitet, behält den
   Rohlohn. BS, CHF 4'100 bei 45 Std.: Kapitel meldet korrekt „unter Mindestlohn" + Brief-Knopf,
   das Barometer daneben gibt **Entwarnung**. Eine echte Unterschreitung wird stumm freigesprochen.

   **✅ (c) 42 als Klassifikations-Schwelle statt Referenz-Nenner** *(behoben `cbd422a`: eigene, amtlich belegte Konstante `LSE_VOLLZEIT_STUNDEN_WOCHE = 40`; die Mindestlohn-42 bleibt unangetastet.)* — dieselbe Zeile. Ein normaler
   40-Std.-Vollzeitjob (CHF 6'788 = exakt der Median) wird „Teilzeit … hochgerechnet CHF 7'127" —
   CHF 339 erfunden; bei 39 Std. kippt die Aussage auf „über dem Median" (falsch).

   **✅ (d) `wageClaim`-Brief auch bei Befund `ok`** *(behoben `cbd422a`: der Befund entscheidet, nicht der Wohnort. Beim Bauen selbst gestolpert — mein erstes Gate fragte den nicht existierenden Nebenjob und hielt den Brief für alle offen; `getJobOptions` wusste es längst.)* — `briefGenerator.js:204` gated nur auf
   `kantonHatMindestlohn`, `:489` gated nur die *Zahlen*. GE/CHF 8'000: Brief behauptet
   „unter dem Mindestlohn … liegen dürfte" mit leeren Beträgen — die App hat den Verdacht
   selbst widerlegt. (Rechts-Prüfer + Code-Review unabhängig.)

   **✅ (e) Anzeige führt die 182h-Annahme wieder ein** *(behoben `cbd422a`: ohne Stunden ODER ohne Brutto-Basis zeigt das Instrument gar keinen Balken — jede Marke darauf ist Vollzeit UND brutto.)* — `LohnEinordnung.jsx:130`/`:105`: ohne
   Stunden bleibt `incomeFTE` roh, `rel` wird aber gegen den Vollzeit-Median gerechnet + Note
   „Für den Vergleich nehmen wir eine Vollzeitstelle an". Genau der Fehlalarm, den `c56272f`
   im Kapitel abgeschafft hat.

   **✅/⚠️ (f) `FinanzUebersicht.jsx:222` widerspricht sich in einer Karte** *(entschärft `cbd422a`. Beim Nachlesen subtiler als gemeldet: **beide Aussagen sind wahr, über verschiedene Fragen** — das Band misst das tatsächliche Monatseinkommen (armutsrelevant), das Barometer das Lohnniveau hochgerechnet. Gefixt ist der echte Fehler: die 6788 war HARTKODIERT (zweite Wahrheit) → `LOHN_REFERENZ.median`. Dazu Label „Einordnung" → „Was monatlich reinkommt". Die Bänder mischen weiterhin Armuts- (roh) und Median-Schwellen (FTE) in einer Skala — das ist ein Design-Entscheid, siehe Punkt 12.)* — Band-Label rechnet auf
   dem **Rohlohn**, das Barometer 11 Zeilen darunter auf **FTE**. 50%/CHF 3'400: „nahe der
   Armutsgrenze" über „Ihr Lohn: CHF 6'800 — nahe am Median".

   **✅ (g) `durchschnitt: 7996` unter BFS-Attribution** *(behoben `cbd422a`: ersatzlos raus, kein Ersatz erfunden. **Der Befund war zu gross:** `p10 4487`/`p90 12178` stehen wörtlich in der LSE-2022-Mitteilung — der `verify`-Kommentar war zu pessimistisch. Unbelegt war NUR der Durchschnitt. Dafür fand die Gegenprüfung einen NEUEN Blocker: die **LSE 2024** ist seit 25.11.2025 publiziert → Median 7024, p10 4635, p90 12526, alle drei belegt.)* — `de.js:2255` (+4 Spr.) nennt die Zahl
   namentlich und schreibt sie dem BFS zu; belegt ist nur der Median `6788`
   (BFS-Medienmitteilung 19.03.2024). Mittelwert/Perzentile stehen nur in **STAT-TAB**
   (nicht zitierbar). **Drei unabhängige Prüfer** (swiss-precision, link-checker, code-review).
   ⚠️ `lohnEinordnung.test.js:5` deckt 7996 in derselben Assertion wie den belegten Median ab
   („amtlich belegt") — der Test leiht der ungeprüften Zahl Autorität.

   **✅ (h) a11y-🔴 (a11y-Prüfer + Polygrafin unabhängig)** *(behoben `cbd422a` + `7000c54`:
   Deep-Varianten für Text — `readoutColor`/`accentText`/`dotTextColor` —, die kräftigen Töne
   bleiben der Grafik. Eigener Satz `mindestlohnBreachedLine` + im aria-Label, damit die
   Unterschreitung nicht mehr nur in der Farbe steht. Dazu der Regel-Konflikt Frucht-Farbe
   vs. WCAG 1.4.11: **die erste Vorlage an Stebler Studios war falsch gerechnet** — „Spur
   dunkler" macht es schlimmer (2.27→1.71→Tiefpunkt 1.05), weil die Frucht im Hellmodus
   dunkler ist als die Spur. Gelöst mit `lightDeep` (gleicher Farbton, weniger Helligkeit),
   Identitätsfarbe `light` unberührt; `lebensbereiche.contrast.test.js` rechnet nach.)*
   ↓ Fundtext Runde 8: rohes `palette.gold` als **Text**
   = **1.93:1** (nötig 4.5:1) in `LohnEinordnung.jsx:86,114` + `RegionalBarometer.jsx:121,129` —
   der Gold-Fall ist die Unter-Median-Lage, also die Zielgruppe. `readoutColor` (Deep) steht
   27 Zeilen höher fertig da; `MietVergleich.jsx:51` hat den Fix schon.
   **Und:** Mindestlohn-Unterschreitung **nur über Farbe** (WCAG 1.4.1 **Level A**) — Text in
   beiden Zuständen identisch, `aria-label` nennt sie nicht, und der ausformulierte Satz
   `lohnCheck.unterMindestlohn` rendert **nur** in `ChapterView`, nicht in `FinanzUebersicht`.

   **✅ (i) `unpaidWage` behauptet einen Betrag für einen unbekannten Zeitraum** *(behoben `cbd422a`: Zeitraum offen ⇒ Betrag offen; der Monatslohn steht als benannter Anhalt daneben.)* —
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
11. **✅ ENTSCHIEDEN — Regel-Konflikt Frucht-Farbe vs. WCAG 1.4.11** (Stebler Studios,
   2026-07-15; umgesetzt in `7000c54`, Regel 3a in `docs/design/farb-und-daten-system.md`).
   Die Frucht-Regel der Doku bleibt; die Füllung nimmt einen eigenen **Füll-Ton**
   (`bereichFillColor` → `lightDeep`): gleicher Farbton, weniger Helligkeit.
   Birne `#7E9A4E`→`#6C8343` (3.03/3.58 ✓), Haselnuss `#A8895E`→`#947750` (3.00/3.54 ✓).
   `light` bleibt unberührt (Identität am Baum, den Karten, Reitern, Arztkoffer — und der
   Helligkeits-Kanal der Reihenfolge). **Nur hell** — im Dunkeln trägt `dark` schon (4.83/4.33).
   ⚠️ **Lehrstück:** Die erste Vorlage schlug „Spur dunkler" vor und behauptete ≈3.1–3.4:1.
   Das war **geraten und falsch** — nachgerechnet wird es schlimmer (2.27→1.71, Tiefpunkt
   ~1.05), weil die Frucht im Hellmodus dunkler ist als die helle Spur. Erst der zweite,
   gerechnete Anlauf trug. In einer Runde, die geratene Zahlen aufräumt, war das die falsche
   Art zu fragen: **erst rechnen, dann vorlegen.**
   Neu offen daraus: neue Instrumente brauchen für ihren Bereich ein `lightDeep`, sonst
   fällt `bereichFillColor` still auf `light` zurück (Dev-Warnung + Test hüten das).
12. **Design-Entscheid offen — Einkommens-Bänder in `FinanzUebersicht.jsx:~214`** (aus
   Runde 8, Fund (f)): Die Bänder mischen **zwei Bezugssysteme in einer Skala** — die
   Armuts-Schwellen (2279, 4000) messen das TATSÄCHLICHE Monatseinkommen, die
   Median-Schwellen (`LOHN_REFERENZ.median`, 10000) messen das Lohnniveau, das darunter
   liegende Barometer rechnet auf Vollzeit hoch. Beide Aussagen sind wahr, über
   verschiedene Fragen — nebeneinander lasen sie sich als Widerspruch („nahe der
   Armutsgrenze" über „CHF 6'800 — nahe am Median"). Entschärft ist es über das Label
   („Was monatlich reinkommt"), gelöst ist es nicht. Offen auch: sind 2279 / 4000 belegt,
   und auf welcher Basis (netto/brutto)? Kein Blocker, aber ein echter Design-Entscheid.
13. **Governance-Reste aus Runde 8** (nicht blockierend, aber Arbeit ausserhalb git):
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
