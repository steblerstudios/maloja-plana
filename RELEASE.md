# So gebe ich eine neue Version raus

Kurze, ruhige Checkliste. Nichts hier ist dringend oder gefährlich — es ist nur
die immer gleiche Reihenfolge, damit du nie etwas vergessen musst.

## Die Landkarte (das mentale Bild)

- **`dev`** = deine Werkbank. Hier wird gebaut und ausprobiert.
- **`main`** = die Reinversion. Sauber, geprüft, das was live geht.
- **PR** = der Zettel „bitte Werkbank in die Reinversion falten".
- **CI** = der Roboter, der bei jeder Änderung automatisch Tests + Build prüft.
- **Deploy** = die Reinversion ins Schaufenster stellen (Website live).

## Der Ablauf (6 Schritte)

1. **Bauen auf `dev`.** Ganz normal arbeiten. Bei jedem Push prüft die CI automatisch.
   Während du baust: die Änderung als **eine Zeile in `CHANGELOG.md` unter `## [Unreleased]`**
   notieren — dann kommt der Changelog immer mit und nie doppelt.
2. **PR `dev → main` erstellen** (Knopf im Panel oder `gh pr create --base main --head dev`).
   *Vorher, im selben Schwung:* Version in `package.json` erhöhen (Feature → mittlere Stelle,
   kleiner Fix → letzte Stelle) und aus `## [Unreleased]` die Versionsnummer + Datum machen.
   So gehen Arbeit, Version und CHANGELOG in **einem** PR — nie zweimal.
3. **Grünes CI-Häkchen abwarten** auf der PR-Seite. Rot = etwas ist kaputt, erst fixen.
4. **„Merge" klicken.** Jetzt ist `main` der neue saubere Stand.
5. **Von `main` deployen:**
   ```bash
   git checkout main && git pull
   bash deploy.sh
   ```
   `deploy.sh` weigert sich absichtlich, aus einem anderen Branch zu deployen —
   so stellst du nie versehentlich Werkbank-Arbeit live. (Notfall-Ausweg:
   `ALLOW_ANY_BRANCH=1 bash deploy.sh`.)
6. **Stabilen Stand markieren (Tag):**
   ```bash
   git tag -a v0.1.x -m "Release: kurze Beschreibung"
   git push origin v0.1.x
   ```
   Ein Tag ist ein Lesezeichen: „diese Version war live". Die Versionsnummer im
   App-Footer kommt automatisch aus `package.json` (`version`) — dort einmal
   hochzählen genügt (siehe Versions-Logik unten).

## Versions-Logik (welche Zahl wann?)

Format: **`MAJOR . MINOR . PATCH`** + Etikett — also `0 . 1 . 14 -beta`.

| Stelle | heute | wann hochzählen |
|---|---|---|
| **MAJOR** | 0 | erst bei **1.0** = „offiziell fertig/stabil, raus aus Beta" |
| **MINOR** | 1 | bei einem **grossen neuen Bereich**/Meilenstein → `0.2.0` |
| **PATCH** | 14 | bei **jeder normalen Release-Runde** (Fixes/kleinere Features) |
| **-beta** | -beta | Etikett „noch nicht final" — fällt weg bei 1.0 |

**Einfache Regel:**
- normale Runde → letzte Zahl +1 · `0.1.13 → 0.1.14`
- grosser neuer Bereich → mittlere +1, letzte auf 0 · `0.1.x → 0.2.0`
- „jetzt offiziell fertig" → `1.0.0` (und `-beta` weg)

**So machst du den Bump:** die Zeile `"version"` in `package.json` ändern — der
Footer zeigt sie dann automatisch. Am saubersten passiert das **im selben `dev`-Ast
wie deine Features**, dann reist die neue Nummer mit demselben PR nach `main`
(kein separater Versions-PR nötig). Nach dem Merge den Tag setzen (Schritt 6).

## Vorschau-Umgebung (Stage)

Bevor ein Stand auf die echte Domain geht, kannst du ihn auf einer identischen
**Vorschau** live gegenprüfen — dieselbe App, andere Adresse: `stage.malojaplana.ch`.

```bash
bash deploy.sh --stage      # aktuellen Branch (z.B. dev) auf die Vorschau spielen
```

Unterschiede zum normalen Deploy: läuft aus **jedem** Branch (keine main-Sperre),
macht **kein** Rollback-Backup (die Vorschau ist wegwerfbar) und lädt nach
`stage.malojaplana.ch` statt auf die echte Domain. Die Produktion bleibt völlig
unberührt. Zugriffsschutz macht das App-eigene BetaGate.

**Typischer Ablauf:** Feature-Branch fertig → `bash deploy.sh --stage` → auf
`stage.malojaplana.ch` prüfen → passt → PR Feature-Branch→`main` mergen → `bash deploy.sh`.

**Einmalige Einrichtung (im Infomaniak-Panel, nur Sophie):**
1. Subdomain `stage.malojaplana.ch` anlegen (Panel → Domains → Subdomain).
2. Deren Docroot-Pfad ablesen (sieht aus wie
   `/home/clients/…/sites/stage.malojaplana.ch/`).
3. Stimmt der Pfad **nicht** mit dem Default in `deploy.sh` (`STAGE_REMOTE_DIR`)
   überein, beim Aufruf mitgeben:
   `STAGE_REMOTE_DIR='/home/clients/…/sites/stage.malojaplana.ch/' bash deploy.sh --stage`
   (oder den Default in `deploy.sh` einmal anpassen).

## Rollback (zurück zur letzten Version)

Zwei Netze — du kannst immer zurück:

**A) Sofort, aus dem Deploy-Backup.** `deploy.sh` sichert vor jedem Upload die
aktuelle Live-Version nach `./.deploy-backups/<zeitstempel>/`. Zum Zurückrollen
den letzten guten Ordner wieder hochspielen:
```bash
lftp -c "open -u \"$SFTP_USER\",\"$SFTP_PASSWORD\" sftp://et9l2r.ftp.infomaniak.com; \
  mirror -R ./.deploy-backups/<zeitstempel>/ /home/clients/.../malojaplana.ch/"
```

**B) Über Git (die Zeitmaschine).** Jede Version neu bauen und deployen:
```bash
git checkout v0.1.<vorher>     # oder ein Tag/Commit deiner Wahl
bash deploy.sh                  # baut und lädt genau diesen Stand hoch
git checkout main               # danach zurück auf main
```

## Gut zu wissen

- **Offene PRs sind ungefährlich.** Sie „verfaulen" nicht und aktualisieren sich
  selbst, wenn neue Commits auf `dev` landen. Du kannst sie liegen lassen.
- **Geheimnisse** (DB-Passwort, Session-Secret, FTP-Passwort) stehen **nie** im
  Code — nur lokal in `.env`/`server/.env` (gitignored), in Jelastic-Env-Variablen
  und in GitHub-Secrets. Der öffentliche Code enthält keine.
- **Deploy geht nur von deinem Rechner** (Infomaniak blockt GitHubs Server-IPs) —
  das ist eine Infomaniak-Einschränkung, kein Fehler.
