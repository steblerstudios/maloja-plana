# Workflow Definition Schema

## Purpose

This document defines the workflow definition schema for Maloja Plana / Ordnung & Ruhe.

A workflow definition describes the planned structure of a workflow before it becomes a runtime workflow instance.

It defines:

- workflow identity
- risk class
- allowed states
- required inputs
- step sequence
- validation hooks
- approval gates
- audit requirements
- rollback behavior
- local-first constraints

## Core Principle

A workflow definition is a governed execution plan.

It must describe what may happen before the runtime is allowed to execute it.

## Design Goals

Workflow definitions should be:

- explicit
- deterministic
- human-readable
- machine-parseable
- governance-aware
- validation-ready
- approval-gated
- auditable
- local-first
- AI-independent

## Non-Goals

This schema does not define:

- autonomous agents
- cloud orchestration
- background submission
- hidden actions
- external communication
- model-driven decisions
- automatic legal or medical conclusions

## Base Workflow Definition

Each workflow definition should define:

```yaml
workflowDefinitionId:
title:
description:
version:
riskClass:
allowedStates:
initialState:
terminalStates:
requiredInputs:
steps:
validationHooks:
approvalPolicy:
auditPolicy:
rollbackPolicy:
persistencePolicy:
localFirstConstraints:
