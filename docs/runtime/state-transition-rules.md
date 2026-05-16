# State Transition Rules

## Purpose

This document defines allowed workflow state transitions for Maloja Plana / Ordnung & Ruhe.

State transitions describe how a workflow may move from one runtime state to another.

They provide the foundation for:

- deterministic workflow execution
- governance enforcement
- validation control
- approval gates
- auditability
- rollback reasoning
- calm and predictable user experience

## Core Principle

State transitions are governance-controlled runtime decisions, not incidental UI changes.

A workflow state may only change through an explicit runtime event.

No workflow may silently change state.

## Allowed Workflow States

Canonical workflow states:

```text
draft
ready
running
waiting_for_input
waiting_for_approval
validation_failed
completed
cancelled
failed
rolled_back
