# Rollback Strategy Model

## Purpose

This document defines the rollback strategy model for Maloja Plana / Ordnung & Ruhe.

Rollback defines how the runtime responds when a workflow action fails, partially completes, or creates an effect that should be restored, compensated, or clearly explained.

Rollback supports:

- safer execution
- recovery planning
- auditability
- user trust
- governance enforcement
- deviation handling
- CAPA escalation
- calm failure recovery

## Core Principle

Rollback must be defined before risky execution.

The runtime must not improvise recovery silently after failure.

## Design Goals

Rollback strategies should be:

- explicit
- local-first
- auditable
- understandable
- risk-aware
- reversible where possible
- honest when not reversible
- linked to approval and validation
- calm in user-facing communication

## Non-Goals

This document does not define:

- cloud recovery
- external account restoration
- automatic form withdrawal
- autonomous compensation
- hidden background repair
- legal or medical remediation

## Rollback Types

Allowed rollback types:

```text
no_rollback_needed
simple_rollback
compensating_action
manual_recovery
not_reversible
