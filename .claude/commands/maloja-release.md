---
description: Der ruhige Release-Ablauf für Maloja — verifiziert, committet, pusht und erstellt den PR Feature-Branch→main (GitHub Flow, kein dev). Deployt NICHT (Stebler Studios: `bash deploy.sh` von main). Standard-Reichweite: bis PR. Mit „auch mergen" im Aufruf geht er bis zum Merge.
argument-hint: (optional) "auch mergen" um nach grünem CI selbst zu mergen · "trotzdem" bei wenig Commits
allowed-tools: Bash, Read, Edit, Grep, Glob
---

Führe den **Maloja-Release-Ablauf** aus. Ruhig, Schritt für Schritt, nichts überstürzen. Nach jedem Schritt kurz sagen, was passiert ist. Bei Rot: **anhalten** und Stebler Studios den Befund zeigen — nicht drüberbügeln.

**Grundhaltung zur Reichweite (wichtig):**
- **Standard = bis PR.** Ich verifiziere, committe, pushe und erstelle den PR `feat/… → main`. Dann **Stopp** und Übergabe an Stebler Studios (mergen + deployen macht sie).
- Steht in `$ARGUMENTS` das Wort **„auch mergen"**, gehe ich zusätzlich bis zum Merge: CI-grün abwarten, dann mergen. Deploy bleibt **immer** bei Stebler Studios.
- **Deploy mache ich nie.** `deploy.sh` braucht das SFTP-Passwort interaktiv — das gehört nicht in den Chat. Ich reiche am Schluss die exakten Deploy-Befehle.
- **`/code-review ultra` kann ich nicht starten** (kostenpflichtig, nur Stebler Studios löst es aus). Ich erinnere nur daran.

## Ablauf

1. **Lage aufnehmen.**
   - `git branch --show-current` (muss ein **Feature-Branch** sein, z.B. `feat/…` — auf `main` anhalten und fragen; ggf. erst `git checkout -b feat/kurzer-name main`).
   - `git status -s` → gibt es Uncommittetes?
   - LIVE-Marker aus `SESSION_START.md` lesen, dann `git log --oneline <LIVE>..HEAD | wc -l` → wie viele Commits über dem letzten LIVE-Stand?
   - Kurz zusammenfassen: Branch, Uncommittetes ja/nein, Distanz zu LIVE.

2. **Verifizieren (das Gate — hier wird ehrlich geprüft).**
   - `npm test -- --run` → alle grün. Rot = **Blocker**, anhalten.
   - `npm run build` → sauber durch, keine neuen Warnungen.
   - `npm run size` → im Budget.
   - i18n-Parität kurz gegenprüfen (de/fr/it/rm/en) — keine offensichtlich fehlenden Keys bei geänderten Strings.
   - CSP self-only — keine neuen externen Referenzen dazugekommen.
   - `git diff --stat package.json` → keine neuen Dependencies ohne Freigabe.

3. **Changelog + Version (im selben Schwung, nie doppelt).**
   - `## [Unreleased]` in `CHANGELOG.md` lesen. Gibt es echte Zeilen (nicht nur der Erklär-Absatz)?
   - Version in `package.json` vorschlagen: Feature → mittlere Stelle, kleiner Fix → letzte Stelle (Schema `0.1.x-beta`). Stebler Studios den Vorschlag nennen; bei Unklarheit letzte Stelle (Patch) als sichere Wahl.
   - `## [Unreleased]` → `## [neue Version] — YYYY-MM-DD` umschreiben und einen frischen leeren `## [Unreleased]`-Block mit dem Erklär-Absatz darüber setzen. `package.json` `version` anheben. (Beides via Edit.)

4. **Committen.**
   - Falls Uncommittetes da ist: `git add -A`, dann ein ruhiger, sachlicher Commit im Stil der History (`bereich: was, kurz warum`). Version/Changelog-Bump in denselben oder einen eigenen `release:`-Commit.
   - Commit-Message endet mit der Co-Authored-By-Zeile.
   - Falls schon alles committet war: sagen, dass es nichts zu committen gibt, weiter.

5. **Pushen.** `git push -u origin <feature-branch>`.

6. **PR erstellen** (falls noch keiner offen ist — erst `gh pr list --base main --head <feature-branch>` prüfen):
   - `gh pr create --base main` mit Titel = neue Version, Body = die Changelog-Zeilen dieser Version + eine Zeile „🤖 Generated with Claude Code".
   - PR-Link ausgeben.

7. **Hier endet der Standard-Ablauf.** Übergabe an Stebler Studios, klar und ruhig:
   ```
   Nächste Schritte (bei dir):
   1. CI-Häkchen auf der PR-Seite grün abwarten.
   2. (optional, vor Deploy empfohlen) /code-review ultra laufen lassen.
   3. „Merge" klicken.
   4. git checkout main && git pull
      bash deploy.sh
   5. Danach LIVE im Browser gegen die geänderten de-/fr-Chunks verifizieren.
   ```

8. **Nur wenn `$ARGUMENTS` „auch mergen" enthält:** nach Schritt 6 zusätzlich
   - CI-Status pollen: `gh pr checks --watch` (oder wiederholt `gh pr checks`) bis grün. Rot = anhalten, Befund zeigen, **nicht** mergen.
   - `gh pr merge --merge` (kein Squash — die History bleibt wie gehabt).
   - Dann trotzdem bei Schritt 7 Punkt 4/5 übergeben (Deploy bleibt bei Stebler Studios).

**Governance:** Ich schreibe/committe/pushe/merge (bei Freigabe), aber deploye nie und starte kein billed ultrareview. Am Schluss: Ampel-Zusammenfassung (was gemacht, was offen, PR-Link).
