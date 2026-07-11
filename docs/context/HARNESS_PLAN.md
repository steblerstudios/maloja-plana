# Harness-Plan — Sitzungs-Kontinuität für Maloja

> Ziel: Eine frische Claude-Sitzung (oder die Inhaberin nach Wochen) kennt in <1 Minute den
> **wahren** Stand — was gebaut, was deployt, was **live-verifiziert** ist — ohne die
> Memory zu durchforsten oder veraltete Docs zu glauben.
>
> Angelehnt an „Effective harnesses for long-running agents". Bewusst **schlank**: kein
> neuer Agent, kein neues System. Wir bündeln nur, was heute verstreut/veraltet ist.

## Warum überhaupt

Der Ist-Stand ist zu ~2/3 vorhanden, aber die „Wahrheit" liegt an mehreren Orten und
widerspricht sich teils:

- `PROJECT_STATUS.md` (root) — war **veraltet** (16.05.); 2026-07-10 nach
  `docs/archive/claude-handoffs/` archiviert, Leitplanken nach `SESSION_START.md` gerettet
- `PROJECT_HANDOFF.md` (war `docs/context/`) — war **veraltet** (17.05., verworfene
  Runtime-Vision); 2026-07-10 ebenfalls archiviert
- Memory `project_maloja_plana.md` — lebendig, aber hinkt hinterher (kannte Branch
  `a11y/pass3-tresor-labels` + 4 Commits nicht)
- `ROADMAP_NEXT.md` / `RELEASE_CRITERIA.md` / `BUGS.md` — Roadmap, aber kein
  „verified-live"-Status

## Die vier Bausteine (Artikel → Maloja)

| Artikel | Maloja hat | Tun wir |
|---|---|---|
| 1 Feature-Liste | Roadmap-Docs, kein Verifikations-Status | **FEATURES-Ledger** (Schritt 2) |
| 2 Progress-Notes + Start-Test | veraltetes PROJECT_STATUS + Memory | **SESSION_START.md** (Schritt 1) |
| 3 „passing" erst nach Test | Disziplin da, nicht sichtbar | Spalte `verified-live` im Ledger |
| 4 init.sh | `.claude/launch.json` ✓ | nichts — erledigt |

## Reihenfolge (die Inhaberin: „4 und dann 1–3 durcharbeiten")

- **Schritt 0 — dieser Plan.** ✓
- **Schritt 1 — `SESSION_START.md`** (root): 1 Bildschirm. Aktueller Tag/Branch, was
  live-verifiziert ist, was „gebaut aber undeployt", 3–5 nächste Schritte. Löst
  `PROJECT_STATUS.md` als Wahrheit ab. `PROJECT_STATUS.md` wurde 2026-07-10 nach
  `docs/archive/claude-handoffs/` archiviert.
- **Schritt 2 — `FEATURES.md`** (oder `.json`): eine Zeile je End-to-End-Feature mit
  Status `built` / `deployed` / `verified-live`. `verified-live` wird erst gesetzt, wenn
  Footer-Version **und** Bundle-Hash gegengeprüft sind — löst das offene 0.1.24-Problem
  strukturell.
- **Schritt 3 — Session-Ende-Ritual**: kleiner Slash-Command (oder Anhang an
  `/maloja-predeploy`), der SESSION_START + FEATURES aktualisiert und committet, damit es
  nicht der Erinnerung überlassen bleibt.

## Nach jedem Schritt: Halt zur Gegenlese (kein Auto-Weiter).

## Nicht-Ziele

- Kein „Initializer-Agent" — Overkill für Solo-Local-First; Boot läuft via launch.json.
- Kein Ersatz der Memory — die bleibt der Inhaberin persönliche Denk-/Session-Historie.
  SESSION_START ist die *repo-interne, objektive* Wahrheit (Tag/Branch/Hash).
