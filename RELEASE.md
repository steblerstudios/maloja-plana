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
2. **PR `dev → main` erstellen** (Knopf im Panel oder `gh pr create --base main --head dev`).
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
   Ein Tag ist ein Lesezeichen: „diese Version war live". Halte auch die
   Versionsnummer im App-Footer (`v0.1.x-beta`) passend.

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
