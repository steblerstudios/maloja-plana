# Entwicklungs-Workflow — GitHub Flow

Maloja folgt **GitHub Flow**, nicht Git-Flow: `main` ist der **einzige langlebige
Zweig** (= Produktion). Gearbeitet wird auf kurzlebigen Feature-Branches, getestet
auf der **wegwerfbaren Stage**, erst dann live. Es gibt **kein `dev`** und **kein
Sync-back** — die Stage (`stage.malojaplana.ch`) übernimmt die Integrations-Rolle.

Warum so: Solo-Entwicklerin, viele kleine Änderungen, **manueller Deploy**
(Infomaniak blockt CI-IPs per Filter → kein Auto-Deploy). Ein `dev`-Zweig wäre nur
ein Spiegel von `main` und reiner Overhead.

---

## Der Ablauf (eine Änderung von A bis Z)

```
Werkbank (feat/…)  →  deploy.sh --stage  →  PR feat→main  →  deploy.sh (main)
   leicht prüfen        mittel prüfen         voll prüfen        live verifizieren
```

### 1. Werkbank — Feature-Branch ab `main`
```
git checkout main
git pull origin main
git checkout -b feat/kurzer-name        # feat/… , a11y/… , chore/… , docs/…
# … arbeiten …
npm test -- --run
npm run build
git add .
git commit -m "…"                       # Commit-Hook erzwingt grüne Tests
git push -u origin feat/kurzer-name      # CI läuft: Tests + Build + Size
```

### 2. Stage — den echten Build live gegenprüfen
```
bash deploy.sh --stage                   # → https://stage.malojaplana.ch
```
Spiegelt den **aktuellen Branch** auf die Stage. Zugriffsschutz übernimmt das
In-App-BetaGate. Kein Rollback-Backup (Stage ist wegwerfbar).

### 3. PR feat→main
```
gh pr create --base main --head feat/kurzer-name --fill
```
**Vor dem PR→main-Merge: `/maloja-predeploy`** laufen lassen (volles Deploy-Gate,
siehe Qualitäts-Ring unten). CI muss grün sein.

### 4. Produktion — von `main` deployen
```
git checkout main
git pull origin main                     # holt den frisch gemergten Stand
bash deploy.sh                           # → https://malojaplana.ch, mit Rollback-Backup
```

### 5. Live verifizieren + aufräumen
- Live-Stand prüfen: **Footer-Version + Bundle-Hash** gegen den frischen main-Build
  greppen (byte-genau live?).
- `FEATURES.md` → betroffenes Feature auf **verified-live** setzen.
- Feature-Branch löschen: `git branch -d feat/kurzer-name && git push origin --delete feat/kurzer-name`.

> **Falle nach jedem Merge:** einmal prüfen, dass `deploy.sh` wirklich **frisch
> baut** (schon passiert: ein Deploy lud versehentlich den alten Build hoch).

---

## Qualitäts-Ring je Schicht

Qualität wird **nicht nur einmal** am Deploy-Gate geprüft, sondern an **jedem
Übergang** — aber **graduiert** (nicht 3× dieselbe schwere Batterie). Prinzip:
shift-left + defense in depth.

| Schicht | Tiefe | Was |
|---|---|---|
| **Werkbank** (feat/…) | leicht & früh | `/code-review` auf dem Diff + gezielte Agenten je Thema (`a11y` bei UI, `swiss-precision` bei Berechnung, `copy` bei Text). **Fixes sofort, VOR dem Push.** |
| **Stage** (stage.malojaplana.ch) | mittel | Review am **laufenden Build**: `a11y` / `design:accessibility-review` auf echter Render, `polygrafin` / `copy` auf sichtbarem Text, manueller Blick. **Fixes zurück auf den Branch.** |
| **Main / Prod** (vor & nach Merge) | voll | **Vor Merge:** `/maloja-predeploy` (volle Agenten-Batterie + `/code-review` + `/simplify`) + billed `ultrareview`. **Nach Deploy:** Live-Verifikation (Bundle-Hash) → `FEATURES.md` = verified-live. |

### Prod-Reviews immer über den GANZEN Code (Sophie-Entscheid 2026-07-11)

Am Prod-Gate laufen drei Reviews **nicht diff-scoped, sondern über die ganze App**
— jedes Mal vor dem Deploy: **Security** (`sicherheits-pruefer` über `src/`+`index.html`+`public/`),
**Accessibility** (`a11y-pruefer` + `design:accessibility-review`, WCAG AA), **Design**
(`design:design-critique`). Die übrige Bug-/Aufräum-Jagd (`/code-review`, `/simplify`,
Rest-Agenten) bleibt diff-scoped. `/maloja-predeploy` orchestriert beides.

**Erzwungen, nicht nur erinnert:** Läuft die Batterie sauber (0 🔴), schreibt
`/maloja-predeploy` eine Freigabe-Marke `.maloja/predeploy-ok` (HEAD-Hash). Ein
PreToolUse-Hook in `.claude/settings.json` **blockt `bash deploy.sh` (Prod)**,
solange keine frische Marke da ist → „erst `/maloja-predeploy`". `deploy.sh --stage`
bleibt frei (schnelle Testschleife). Der Hook wird erst nach `/hooks`-Reload bzw.
Claude-Neustart aktiv (gleiche Watcher-Falle wie beim Tests-vor-Commit-Hook).

---

## Bug gemeldet — was jetzt?

Bugs kommen über die **Feedback-Mail** in der Fusszeile („Feedback per E-Mail").
Sie öffnet einen Entwurf mit einem löschbaren Kontext-Block (**App-Version,
Ansicht, Sprache**) — das genügt meist, um die Stelle zu finden. Nichts wird
automatisch gesammelt; die Person schickt die Mail selbst ab.

**Reproduce-first.** Bevor irgendetwas geändert wird: den Bug **nachstellen**
(gleiche Ansicht, Sprache, Schritte). Lässt er sich nicht reproduzieren →
Rückfrage statt Rätselraten. Erst der reproduzierte Bug wandert als Zeile in
`docs/TODO.md` mit **Schweregrad**:

| Schwere | Beispiel | Weg |
|---|---|---|
| **kritisch** | Datenverlust, falsche Rechts-/Zahlen-/Fristangabe, App startet nicht | **Hotfix** — gleicher Ring, aber sofort, vor anderer Arbeit |
| **normal** | Ansicht kaputt, Berechnung daneben, Text falsch | regulär: `fix/…` → Stage → PR → Prod |
| **klein** | Tippfehler, Kosmetik | regulär, gebündelt |

**Ablauf** (wie jede Änderung, nur mit Fix-Branch): `fix/kurzer-name` ab `main`
→ den Bug **zuerst in einem Test festhalten** (schlägt er rot an? = reproduziert)
→ Fix (Test wird grün) → `deploy.sh --stage` → am Stage gegenprüfen → PR→main
→ `/maloja-predeploy` → `bash deploy.sh` → live verifizieren, dass er weg ist.

Bei **kritisch** zusätzlich: notieren, welche Version den Bug brachte — damit klar
ist, ob live schon jemand betroffen war. Der Deploy-Gate (`/maloja-predeploy`)
gilt auch für Hotfixes; falsche Fach-/Rechtsangaben sind Haftung, kein Tempo-Grund
zum Überspringen.

---

## Boot / Deploy — Kurzreferenz

- **Lokal starten:** `npm run dev` (Port 5174, `strictPort` — kein stiller Port-Wechsel).
- **Stage:** `bash deploy.sh --stage` (aus jedem Branch, wegwerfbar).
- **Produktion:** `bash deploy.sh` von `main` (nur Sophie; Rollback-Backup automatisch).
- **Session-Ende:** `/session-close` (Stand + Memory nachziehen, ehrliche Bilanz).

Ausführlicher Deploy-/Rollback-Ablauf: siehe `RELEASE.md`.
