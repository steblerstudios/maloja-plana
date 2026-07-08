# Git für mich — der ruhige Spickzettel

Kein Fachchinesisch. Nur das, was du im Alltag brauchst, in einfacher Sprache.
Nichts hier ist gefährlich. Wenn etwas klemmt: siehe „Wenn's klemmt" unten.

## Das Bild im Kopf

Du schreibst ein Rezeptbuch.

- **dein Computer** = dein Schreibtisch (hier wird gebaut)
- **`dev`** = die **Werkbank** (Arbeitskopie zum Ausprobieren)
- **`main`** = die **Reinversion** (sauber, geprüft, das was live geht)
- **GitHub** = der **Safe in der Cloud** (Sicherung + Ort für PRs)
- **malojaplana.ch** = das **Schaufenster** (die Live-Website)

## Die fünf Wörter

| Wort | In einfach | Was passiert |
|---|---|---|
| **commit** | Foto einer fertigen Seite machen | Speicherpunkt mit Notiz — bleibt auf deinem Computer |
| **push** | Album in den Cloud-Safe laden | Sicherung auf GitHub |
| **PR** | Zettel „bitte Werkbank in Reinversion falten" | Übersicht + Roboter-Check, noch nichts zusammengeführt |
| **merge** | den Zettel bestätigen | jetzt hat `main` alles von `dev` |
| **deploy** | ins Schaufenster stellen | die Website wird live |

**Merke:** Das sind getrennte Schritte. Commit ≠ push ≠ deploy.

## Der Ablauf, wenn ich etwas rausgeben will

Die Kurzform (ausführlich in `RELEASE.md`):

1. Auf **`dev`** bauen. (Der Roboter „CI" prüft bei jedem Push automatisch.)
2. **PR `dev → main`** erstellen (Knopf im Panel).
3. **Grünes Häkchen** abwarten.
4. **„Merge"** klicken (Variante *„Create a merge commit"*). **„Delete branch" NIE anklicken** — `dev` bleibt.
5. Von **`main`** deployen:
   ```bash
   git checkout main && git pull && bash deploy.sh
   ```
6. Optional stabilen Stand markieren:
   ```bash
   git tag -a v0.1.x -m "Release: kurze Beschreibung" && git push origin v0.1.x
   ```

## Versions-Nummern (SemVer)

Format `MAJOR.MINOR.PATCH` + `-beta`, z.B. `0.1.14-beta`:
- letzte Zahl **+1** bei normaler Runde (`0.1.13 → 0.1.14`)
- mittlere **+1** bei grossem neuem Bereich (`0.1.x → 0.2.0`)
- erste **+1** = „offiziell fertig, raus aus Beta" (`1.0.0`)
- **prerelease** = Etikett „noch nicht final". Ändert nichts am Code.

Die Nummer im Footer kommt automatisch aus `package.json` (`"version"`) — dort einmal ändern genügt.

## Wenn's klemmt

**„Your local changes … would be overwritten … Aborting" beim `git checkout`.**
Du hast noch nicht gespeicherte Änderungen. Zwei ruhige Wege:
- Ist die Änderung gut und fertig? → committen:
  ```bash
  git add . && git commit -m "kurze Beschreibung"
  ```
- Bist du unsicher / willst sie kurz beiseitelegen? → „stashen" (Zwischenablage):
  ```bash
  git stash          # legt die Änderung weg, Tree wird sauber
  # … Branch wechseln, deployen …
  git stash pop      # holt sie zurück
  ```

**„Everything up-to-date" beim Push.** Alles gut — es gab nichts Neues zu senden.

**Ich habe versehentlich vom falschen Branch deployt.** `deploy.sh` lässt nur `main`
zu. Im echten Notfall: `ALLOW_ANY_BRANCH=1 bash deploy.sh`.

**Ich will zur letzten Version zurück (Rollback).** Siehe `RELEASE.md` → „Rollback"
(Deploy-Backup in `.deploy-backups/` oder eine alte Version per Git neu deployen).

## Zum Ruhigbleiben

- **Nichts geht verloren**, wenn du den Chat/die Sitzung schliesst. Alles liegt auf
  deinem Computer und teils in der Cloud.
- **Offene PRs sind ungefährlich** — sie verfallen nicht.
- **Geheimnisse** (Passwörter, Schlüssel) stehen **nie** im Code — nur lokal in
  `.env` (nicht im Git), in Jelastic und in GitHub-Secrets. Der öffentliche Code
  enthält keine.
- **Backend** (Login/Server) lebt privat im Repo `maloja-server`. Das öffentliche
  Repo ist nur die App (Open Source).
