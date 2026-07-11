# Loops & Review-Abläufe — Maloja Plana

> Stand: Juli 2026
> Ergänzt: AGENT_MANIFEST.md, CLAUDE_WORKFLOW.md, GOVERNANCE_LEVELS.md

Dieses Dokument beschreibt die wiederkehrenden Abläufe („Loops"), mit denen an Maloja gearbeitet und geprüft wird. Alle folgen der Maloja-Governance: **read-only/advisory by default, keine autonome Zustandsänderung, keine Agent-Kaskaden, die Inhaberin entscheidet.** Kein Loop deployt oder committet ohne ausdrückliches Wort.

---

## 1. Prüf-Agenten (Entwicklungs-Rollen, read-only)

`.claude/agents/*.md` — spezialisierte Reviewer. Sie lesen und melden, sie ändern nichts, und sie delegieren nicht weiter (eine Ebene, keine Kaskaden). Modell: sonnet, Tools: Bash/Read/Grep/Glob.

| Agent | Rolle (Manifest) | Prüft |
|---|---|---|
| `qualitaets-pruefer` | Qualitäts-Agent | Tests, Build, Bundle-Grösse, i18n-Parität (5 Spr.), CSP, Speicher-Zugriff |
| `swiss-precision-pruefer` | Daten-Agent | CH-Fachlogik (AHV/BVG/UVG/EL/SKOS/KVG/Steuer), Quellen, Aktualität, Disclaimer, Kanton-Kennzeichnung |
| `a11y-pruefer` | (Design/A11y) | Kontrast (weiss-auf-Sand), Farbenblind (Okabe-Ito, Form+Farbe), Fokus, aria/htmlFor, Touch, Lesbarkeit |
| `polygrafin` | Design-Agent | Typografie, Rhythmus, Materialität, „wirkt nach AI/SaaS?", Token-Hygiene |
| `sicherheits-pruefer` | Sicherheits-Agent | CSP-Dichtheit, XSS, Secrets, kein Tracking/Cloud, Speicher-Robustheit, Dependency-Fläche |
| `ordnungshueter` | Ordnungs-Agent | Verwaiste write-only Felder, toter Code/Assets, Doku-Drift, Token-Hygiene, Legacy — ordnen, nicht wegnehmen |
| `copy-pruefer` | Sprach-Agent | Gender-neutral, Sie/Du, ruhiger Ton (keine Emojis/Dringlichkeit), CH-Term, i18n-Ton-Parität |
| `rechts-pruefer` | Rechts-Agent | Disclaimer, nDSG-Wahrheit, Impressum/UWG, Lizenz/Gerichtsstand, Quellen-Redlichkeit |
| `link-checker` | (Daten/Recht) | Behörden-/externe Links, tote Ziele, Quellen-Redlichkeit |

Manuell aufrufbar über den Agent-/Task-Mechanismus, oder gebündelt via `/maloja-review`.

---

## 2. Manuelle Loops (Slash-Commands)

`.claude/commands/*.md` — Abläufe, die **die Inhaberin/Claude bewusst startet**. Kein Zeitplan, keine versteckte Automatik.

| Command | Zweck | Governance-Level |
|---|---|---|
| `/maloja-check` | Schnelles lokales Gate: Tests, Build, Size, i18n, CSP. Read-only Bericht. | 0 (informativ) |
| `/maloja-review` | Voller Review: ruft die Prüf-Agenten parallel, sammelt priorisiert. | 1–2 (assistiv/advisory) |
| `/maloja-predeploy` | Deploy-Gate: strenge Verifikation + de-Chunk-Check + Erinnerung an ultrareview. Deployt NICHT. | 2 (advisory) |
| `/maloja-blick` | Sichtprüfung des **Gerenderten**: Screenshots (oder selbst aufgenommen via Dev-Server) als Journey lesen — Hierarchie, Raum, Ruhe, Sprache, WCAG 2.2 (Fokus nicht verdeckt, Zielgrössen, Reflow). Priorisierung P0–P3, a11y nie tiefer als P1. Ergänzt die Code-Prüfer um den Blick der Nutzerinnen. | 1–2 (advisory) |
| `/maloja-ablauf` | Lebenssituation durchs 7-Spalten-Raster (docs/ABLAEUFE.md): Bausteine, Lücken, Crosslinks, nächste Aktion. | 1 (assistiv) |
| `/maloja-council` | Entscheidungs-Council für grosse Weichen: fünf Berater, die streiten müssen, plus Vorsitz-Verdikt. Entscheidet nichts, baut nichts. | 1 (assistiv) |
| `/maloja-release` | Ruhiger Release-Ablauf: verifiziert, committet, pusht, erstellt den PR nach `main`. Deployt NICHT. | 3 (nur auf Wort) |
| `/braindump` | Rohen Ideen-Dump strukturieren/triagieren → datierter Block an docs/TODO.md. | 0–1 |

Deploy selbst bleibt manuell: `bash deploy.sh` (SFTP → Infomaniak), vom Mac der Inhaberin, bei ~10+ Commits über LIVE.

---

## 3. Session-Loop (`/loop`)

Der eingebaute `/loop`-Befehl wiederholt einen Prompt/Command **nur solange diese Sitzung offen ist**. Sinnvoll während aktiver Arbeit, z.B.:

- `/loop /maloja-check` — nach jeder Änderungsrunde automatisch prüfen.

Kein Hintergrundprozess: schliesst die Sitzung, endet der Loop. Passt zur Governance (nichts läuft unbeaufsichtigt).

---

## 4. Geplante Loops (Cloud-Cron / `/schedule`) — bewusst zurückhaltend

`/schedule` bzw. Routinen können Loops **ohne offene Sitzung** auf Zeitplan laufen lassen. Das steht in Spannung zu Malojas Werten „no hidden automation" und „die Inhaberin entscheidet". Regeln, falls überhaupt genutzt:

- **Nur read-only Berichte** (Level 0–1): z.B. wöchentlicher `/maloja-check`- oder Link-Check-Report, der Funde meldet.
- **Nie autonom committen/deployen/Daten ändern** (Level 3+ liegt bei der Inhaberin).
- Jeder geplante Lauf muss sichtbar/abschaltbar sein — keine stille Automatik.

Empfehlung: Als Standard **kein** geplanter Cron. Erst einrichten, wenn ein konkreter read-only Nutzen da ist und die Inhaberin ihn ausdrücklich will.

---

## Reihenfolge im Alltag

1. Arbeiten (Code-Agent, kleine scoped Änderungen).
2. `/maloja-check` — schnelles Gate.
3. `/maloja-review` — vor grösseren Deploys oder bei Design/Fachdaten-Änderungen.
4. `/maloja-predeploy` — wenn ~10+ Commits zusammengekommen sind.
5. `/code-review ultra` (von der Inhaberin ausgelöst, billed) → `bash deploy.sh` → LIVE verifizieren → Memory aktualisieren.
