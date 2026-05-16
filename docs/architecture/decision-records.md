# Architecture Decision Records

## Purpose

This document explains why important architectural decisions were made.

The goal is long-term consistency.

Maloja Plana should remain understandable:
- technically
- ethically
- operationally
- psychologically

Even years later.

---

# ADR-001 — Offline-First Architecture

## Decision

The application is designed to work fully offline.

## Why

Administrative life is deeply personal.

Users should not need:
- accounts
- cloud trust
- permanent internet access
- centralized infrastructure

Offline-first also improves:
- resilience
- privacy
- longevity
- accessibility

## Tradeoffs

Offline-first makes:
- sync harder
- collaboration harder
- multi-device support harder

These tradeoffs are accepted intentionally.

---

# ADR-002 — No Accounts

## Decision

The system should function without user accounts.

## Why

Accounts create:
- tracking risks
- password recovery burdens
- identity coupling
- infrastructure costs
- attack surfaces

Many users only need calm local organization.

## Tradeoffs

Without accounts:
- sync becomes harder
- remote recovery becomes impossible
- device migration requires exports

These limitations are accepted.

---

# ADR-003 — Calm UX Over Engagement UX

## Decision

The application avoids manipulative engagement patterns.

## Avoided Patterns

- streaks
- urgency loops
- fear notifications
- addictive reward systems
- artificial pressure

## Why

Administrative life already creates stress.

The application should reduce overload,
not manufacture engagement.

---

# ADR-004 — Explainable Systems

## Decision

The application should remain understandable to users.

## Why

People must understand:
- where information comes from
- why reminders exist
- why relationships are shown
- what assumptions are made

Invisible systems reduce trust.

## Principle

Calm systems are explainable systems.

---

# ADR-005 — Migration-First Data Thinking

## Decision

Every schema change requires migration planning.

## Why

Administrative data may exist for years or decades.

Breaking user data is unacceptable.

## Requirements

- migration functions
- snapshots
- version tracking
- rollback awareness
- validation

---

# ADR-006 — No Telemetry by Default

## Decision

No behavioral analytics or tracking systems.

## Why

Users handling sensitive life administration
should not feel observed.

Privacy is part of calmness.

## Tradeoffs

Without telemetry:
- product analytics become harder
- UX research becomes slower
- debugging becomes harder

These tradeoffs are accepted intentionally.

---

# ADR-007 — Pictogram-First Communication

## Decision

Important actions and states should use visual symbols.

## Why

Administrative systems are often language-heavy.

Pictograms improve:
- accessibility
- multilingual navigation
- cognitive load
- emotional clarity

## Important

Icons must remain:
- culturally careful
- simple
- calm
- non-alarmist

---

# ADR-008 — Human Life Before Bureaucracy

## Decision

The system models life events first,
administrative structures second.

## Why

People experience:
- illness
- grief
- moving
- retirement
- family changes

Not abstract government categories.

The product should reflect human reality.

---

# Important Principle

Every major architectural decision should answer:

"Does this increase calm, trust, and long-term resilience?"
