# Runtime Event Model

## Purpose

This document defines the runtime event model for Maloja Plana.

Runtime events are the canonical record of what happened during workflow execution.

They provide the foundation for:

- auditability
- validation evidence
- approval traceability
- rollback reasoning
- provenance tracking
- state transition history
- user accountability
- deterministic replay where possible

## Core Principle

Events are the canonical record of runtime truth.

A workflow may change state only through explicit, recorded events.

No workflow state transition should occur silently.

No risky action should occur without a preceding validation event and, where required, an approval event.

## Design Goals

The runtime event model should be:

- local-first
- append-oriented
- human-readable
- machine-parseable
- deterministic
- audit-friendly
- governance-aware
- minimally sufficient
- resilient to partial failure

## Non-Goals

This document does not define:

- a background job system
- cloud synchronization
- external logging infrastructure
- autonomous agent memory
- remote telemetry
- automatic external submission
- hidden analytics pipelines

## Event Immutability

Runtime events should be treated as immutable once recorded.

Corrections should not overwrite previous events.

Instead, corrections should create new events that reference the earlier event.

This preserves:

- audit history
- accountability
- sequence integrity
- rollback reasoning
- validation traceability

## Event Ordering

Each workflow should maintain an ordered event sequence.

Events should include:

- timestamp
- workflowId
- stepId where applicable
- eventType
- actor
- event sequence number where possible

The sequence number should be local to the workflow execution.

Example:

```yaml
workflowId: document-export-basic
eventSequence: 7
eventType: approval_granted
