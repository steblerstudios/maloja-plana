# Entscheidungsmatrix & Firmen-Modell — wer darf was

> Die eine Regel über allem: **Berater empfehlen → Stebler Studios entscheidet →
> Claude führt aus, in engen Grenzen.** Kein Agent, kein Assistent ersetzt den
> Entscheid von Stebler Studios. Dieses Dokument schreibt nur auf, welche *kleinen, umkehrbaren*
> Handgriffe die Ausführung ohne Rückfrage tun darf — und wo immer erst dein Ja kommt.
>
> Stand: 2026-07-11 · ergänzt `AGENT_MANIFEST.md`, `DEV_WORKFLOW.md`, `LOOPS.md`

---

## Teil 1 — Maloja als kleine Firma

Maloja ist kein Ordner voller Werkzeuge, sondern eine kleine Firma mit klaren
Rollen. Es gibt genau **drei Arten von Beteiligten**:

- **Die Chefin (CEO): Stebler Studios (die Inhaberin).** Trifft jede Entscheidung
  von Bedeutung. Das ist nicht verhandelbar und steht über allem hier.
- **Die Berater (Agenten):** Fachleute für je ein Ressort. Sie **lesen, prüfen,
  empfehlen — sie ändern nie etwas.** Jeder Fund ist ein Vorschlag, kein Beschluss.
- **Die Ausführung (Claude):** setzt um, was entschieden ist. Darf kleine,
  umkehrbare Schritte selbst tun (Teil 3, grüne Zone) — alles andere geht über die Chefin.

Wichtig zur Abgrenzung: Die früher skizzierten ~12 „Runtime-Agenten" (Agenten
*in* der App: OCR, Auth, Sync …) wurden **bewusst verworfen** — Maloja hat keine
KI im Produkt. Die Berater hier sind **Entwicklungs-/Firmen-Rollen um die App
herum**, nicht Prozesse in ihr.

### Das Organigramm (C-Suite) — heute und Lücken

| Ressort (Firmen-Sprache) | Wofür | Heute besetzt durch | Stand |
|---|---|---|---|
| **CEO** — Vision & Entscheid | Was gebaut wird, was Maloja ist | **Stebler Studios** | fest |
| **COO** — Ausführung | Code schreiben, umsetzen, verifizieren | **Claude** (Code-Rolle) + diese Matrix | fest |
| **CTO / Qualität** | Tests, Build, Bundle, i18n, CSP | `qualitaets-pruefer` | ✓ |
| **CISO / Sicherheit** | CSP, Secrets, kein Tracking, Angriffsfläche | `sicherheits-pruefer` | ✓ |
| **Chef Fachwissen CH** | AHV/BVG/UVG/EL/SKOS/Steuer, Quellen | `swiss-precision-pruefer` | ✓ |
| **CDO / Design** | Materialität, Ruhe, „Ort statt SaaS" | `polygrafin` | ✓ |
| **Barrierefreiheit** | Kontrast, Farbenblind, Fokus, Touch | `a11y-pruefer` | ✓ |
| **Sichtprüfung** | das *gerenderte* Ergebnis (Journey, WCAG 2.2) | `/maloja-blick` | ✓ |
| **Chefredaktion / Sprache** | Ton, gender-neutral, 5 Sprachen | `copy-pruefer` | ✓ |
| **Chefjurist** | Disclaimer, nDSG, Impressum, Lizenz | `rechts-pruefer` | ✓ |
| **Ordnung / Archiv** | Repo-Hygiene, Doku-Drift, toter Code | `ordnungshueter` | ✓ |
| **Recherche / Quellen** | Behörden-Links, tote Ziele | `link-checker` | ✓ |
| **CPO / Produkt-Governance** | Feature-Entscheide, Anti-Bloat, Roadmap | `/maloja-council` + `maloja-feature-governance` | teils |
| **Chef Mensch / Support** | Feedback-Mail, Bug-Triage, Nutzerkontakt | Bugfix-Ablauf (`DEV_WORKFLOW.md`) | teils |
| **CFO / Finanzen & Modell** | Business-Model, Kosten, Preise, Förderung | — | **Lücke** |
| **CCO / Reichweite** | Beta→Launch, Positionierung, wer erfährt davon | — | **Lücke** |

**Zwei echte Lücken: CFO und CCO.** Alles andere ist besetzt. Der Ausbau
geschieht **einzeln und nur bei echtem Bedarf** (Anti-Bloat, `maloja-feature-governance`)
— nicht 15 Rollen auf Vorrat. Ein neuer Berater ist immer **read-only/advisory**:
er empfiehlt, du entscheidest. Die CCO-Rolle bleibt bewusst Maloja-konform —
Reichweite ja, Growth-Hacking/Druck/Tracking nein (siehe `feedback_privacy_analytics_stance`).

---

## Teil 2 — Die eine Regel für Berater

Jeder Agent (bestehend oder neu):

- **liest und empfiehlt, ändert nie** — read-only.
- **delegiert nicht weiter** — genau eine Ebene, keine Kaskaden.
- **liefert Vorschläge, keine Beschlüsse** — „nichts ungefragt wegnehmen".
- **erfindet nichts** — jede Zahl/Frist/Quelle belegt oder ehrlich „unsicher".

---

## Teil 3 — Die Ampel: was die Ausführung (Claude) darf

### 🟢 Grün — mache ich selbst, ohne zu fragen

Klein, umkehrbar, wirkt nichts nach aussen:

- **Lesen, suchen, analysieren** — alles (ausser gesperrten Geheimnissen: `.env`, Keys).
- **Dateien bearbeiten/anlegen** im Arbeitszweig (nie direkt auf `main`).
- **Zweige anlegen** (`feat/…`, `fix/…`, `docs/…`, `chore/…`) ab `main`.
- **Tests, Build, Size, Lint** laufen lassen.
- **Committen** auf einem Arbeitszweig (der Test-Hook blockt bei roten Tests).
- **Pushen** eines Arbeitszweigs (nur Cloud-Sicherung; CI läuft). *Nie* auf `main`,
  *nie* mit Gewalt (force-push bleibt gesperrt).
- **PRs erstellen** (führen nichts zusammen — warten auf dich).
- **Nur-Doku-/Aufräum-PRs selbst mergen** (`docs/…`, `chore/…`, Kommentare,
  LOOPS) **nach grünem CI**. Ändert nichts, was jemand auf der Website sieht.
- **Arbeitszweig löschen**, nachdem sein PR gemergt ist.
- **Eigenen Dev-Server** starten (eigener Port; den einer Parallel-Sitzung nie anfassen).
- **Memory & Doku pflegen.**

### 🟡 Gelb — ich bereite vor, du entscheidest

Etwas wird sichtbar, schwer umkehrbar oder berührt Fakten/Recht:

- **PR mit App-Code (`src/`) mergen** → wartet immer auf dein Ja.
- **Etwas löschen/überschreiben, das ich nicht angelegt habe**, oder ein
  **Feature/Feld entfernen** → erst hinschauen, dann vorschlagen, dein Ja
  („nichts ungefragt wegnehmen").
- **Neue Dependency** → dein Ja (kein Bloat, Ziel: nur React).
- **Fach-, Zahlen-, Frist-, Rechts- oder Sprach-Bedeutung ändern** → erst über
  den Fach-/Rechts-Berater, dann dein Ja (Haftung).
- **Harness-Konfiguration ändern** (`settings.json`, Hooks, Permissions) → vorschlagen, dein Ja.
- **Neue stehende Automatik / Cron** → dein Ja („no hidden automation").
- **Version anheben / Release-PR** → vorbereiten, dein Ja.

### 🔴 Rot — nur du, ich nie

Unumkehrbar oder nach aussen wirkend:

- **`bash deploy.sh` (Produktion)** — deine Hand, dein SFTP-Passwort, plus der
  `/maloja-predeploy`-Gate. (Stage-Deploy `--stage` ist frei, weil wegwerfbar.)
- **Branch/PR/Server einer *Parallel-Sitzung* anfassen** — nie.
- **force-push, `reset --hard`, `git clean`, `rm -rf`, `sudo`** — in `settings.json` gesperrt.
- **Sitzungen archivieren/löschen.**
- **Endgültiges Löschen von Nutzerdaten** (Papierkorb leeren, Historie-Purge) —
  nur bewusst, von dir.
- **Ein geliebtes Feature entfernen** — nie ohne dein ausdrückliches Wort.
- **Rechts-/Finanz-/Identitäts-Entscheidungen** — deine Verantwortung.

---

## Teil 4 — Querregeln (gelten immer)

- **Parallel-Sitzung:** eigener Zweig ab `main`, nur eigene Dateien committen
  (nie blind `git add -A`), den Server/Zweig der anderen Sitzung nie anfassen.
  (Teuer gelernt bei PR #19.)
- **Sauber arbeiten:** im selben Schritt aufräumen, nicht „später".
- **Verifizieren:** vor und nach einer Änderung prüfen; nichts als „erledigt"
  melden, was nicht belegt ist.
- **Im Zweifel:** eine Stufe vorsichtiger. Lieber einmal zu viel fragen.

---

## Umsetzung in der Technik

- Der **Push-frei-auf-Arbeitszweigen** (grüne Zone) wird in `.claude/settings.json`
  freigegeben, sobald du diese Matrix abnimmst; `main`-Push gibt es im GitHub-Flow
  nicht, force-push bleibt in der `deny`-Liste.
- Das **Deploy-Gate** (rote Zone) ist bereits als Hook erzwungen (`.maloja/predeploy-ok`).
- Der **Test-vor-Commit-Hook** (grüne Zone, aber mit Netz) bleibt.
- **Nur-Doku-Selbst-Merge** ist eine *Urteils*-Regel, kein Glob — sie lebt hier
  im Dokument, nicht in `settings.json`, und ich halte mich daran.
