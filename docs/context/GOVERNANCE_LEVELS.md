# Governance Levels

## Level 0 — Informational
Read-only information.
No state changes.
No approvals required.

Examples:
- dashboard summaries
- reminders
- static guidance

---

## Level 1 — Assistive
User-assisted preparation.
Human executes action.

Examples:
- draft generation
- structured recommendations
- checklists

---

## Level 2 — Advisory
System may suggest operational decisions.
Human approval mandatory.

Examples:
- workflow recommendations
- risk flags
- validation suggestions

---

## Level 3 — Operational
State-changing operations allowed.
Traceability required.

Requirements:
- audit trail
- rollback capability
- provenance logging

---

## Level 4 — Controlled Execution
Sensitive execution domain.

Requires:
- explicit approvals
- evidence chain
- escalation path
- deterministic execution

---

## Level 5 — Restricted / Critical
No autonomous execution.

Human responsibility mandatory.

Examples:
- legal decisions
- financial authority
- healthcare-critical workflows
- identity-sensitive operations

---

## Feature-Tagging — so bleibt governance-first im Alltag

Diese Regel hält die Richtung, ohne den Feature-Spass zu killen: **Ideen dürfen sprudeln
— sie werden nur eingeordnet.** Jedes neue Feature bekommt bei Geburt ein Level (L0–L5).

- **L0–L1 → frei schiffen.** Anzeige, Rechner, Checklisten, Entwürfe, Visualisierung
  (z. B. das Grundstück-Momentum, `docs/design/grundstueck-und-modi.md`). Kein Runtime,
  keine Freigabe-Maschinerie nötig.
- **L2 → Freigabe im Fluss.** Vorschlag / Risiko-Flag braucht eine bewusste
  Nutzer-Bestätigung im UI, bevor er wirkt.
- **L3+ → zieht den Runtime an.** Sobald ein Feature im Namen der Person *ausführt oder
  ändert*, wird der (heute dormante) Runtime in `src/runtime/` verdrahtet
  (Audit-Trail / Approvals / Validation) — **nicht vorher.** Siehe
  [`../../src/runtime/README.md`](../../src/runtime/README.md).

**Praktisch:** In jedem Feature-PR eine Zeile *„Governance-Level: Lx (kurze Begründung)"*.
Ab **L3** gehört die Runtime-Verdrahtung + der Audit-Trail zur Definition-of-Done
(`docs/architecture/definition-of-done.md`).

> Heutiger Stand (2026-07-13): Das Produkt operiert auf **L0–L1**; der L3–L4-Runtime ist
> gebaut, aber **bewusst dormant** (nur der EventBus ist verdrahtet). Die einzige offene
> L5-Sache ist die Tresor-Verschlüsselung sensibler Daten (`docs/design/tresor-lock.md`).
