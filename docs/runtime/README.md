# Runtime Documentation Index

## Purpose

This directory contains the core runtime specification for Maloja Plana.

The runtime documentation defines how workflows are structured, executed, validated, approved, audited, persisted, and recovered.

## Core Principle

The runtime is not an autonomous agent system.

It is a governed, deterministic, local-first execution layer.

A workflow may guide.

A workflow may prepare.

A workflow may validate.

A workflow may pause.

A workflow may ask.

A workflow must not secretly act.

## Documents

## `runtime-foundation.md`

Defines the foundational runtime architecture.

Covers:

- execution engine
- validation engine
- state manager
- audit engine
- approval engine
- deterministic runtime principles
- failure handling

## `workflow-model.md`

Defines the conceptual workflow model.

Covers:

- workflow states
- step types
- inputs
- outputs
- approval gates
- validation hooks
- audit events
- rollback patterns
- risk classes

## `runtime-event-model.md`

Defines the canonical runtime event model.

Covers:

- runtime events
- event immutability
- event ordering
- event types
- actor model
- validation events
- approval events
- rollback events

Core rule:

```text
Events are the canonical record of runtime truth.
