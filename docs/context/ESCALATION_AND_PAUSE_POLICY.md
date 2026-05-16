# Escalation and Pause Policy

## Purpose

Maloja Plana must know when not to continue.

This policy defines when execution should pause, escalate, or require human review.

## Core Principle

When trust is uncertain, the system pauses.

Speed must never override governance, accountability, or safety.

## Pause Conditions

Execution must pause when:

- required source evidence is missing
- validation fails
- provenance is unclear
- risk level is unknown or elevated
- user intent is ambiguous
- an action affects sensitive data
- an action changes persisted records
- an approval boundary is crossed
- runtime state is inconsistent
- rollback path is unclear

## Escalation Levels

### Level 0 — Continue

Allowed when:

- sources are known
- validation passed
- risk is low
- action is reversible
- no approval gate is crossed

### Level 1 — Ask for Clarification

Required when:

- intent is unclear
- multiple interpretations exist
- user-visible outcome could differ
- missing context affects result quality

### Level 2 — Require Explicit Approval

Required when:

- data will be changed
- exports are created
- reminders are modified
- documents are deleted
- user commitments are generated
- financial, health, legal, or administrative context is involved

### Level 3 — Escalate to Human Owner

Required when:

- system confidence is insufficient
- source conflict exists
- validation evidence is incomplete
- action may create external consequences
- governance rules conflict
- responsibility cannot be assigned automatically

### Level 4 — Stop Execution

Required when:

- action is unsafe
- action violates policy
- rollback is impossible
- evidence is missing for high-risk execution
- human approval is denied
- system state cannot be trusted

## Runtime Behavior

The runtime should:

- stop before executing unsafe actions
- record the reason for pause
- preserve current state
- expose what evidence is missing
- request the minimum necessary human input
- avoid continuing silently

## Evidence Required for Resume

Paused execution may resume only when:

- missing evidence is supplied
- validation passes
- owner is identified
- approval is recorded
- rollback path is known
- audit entry is created

## Non-Goals

This policy does not define:

- autonomous decision making
- AI confidence scoring as authority
- bypass rules for speed
- automatic escalation without traceability

## Design Rule

A paused system is not a failed system.

A paused system is a trustworthy system.
