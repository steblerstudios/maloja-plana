# Validation Rule Schema

## Purpose

This document defines the validation rule schema for Maloja Plana.

Validation rules define how the runtime checks whether a workflow, step, input, output, or execution condition is safe and complete enough to continue.

They support:

- deterministic runtime behavior
- governance enforcement
- approval readiness
- auditability
- provenance checks
- risk control
- user-visible recovery
- calm failure handling

## Core Principle

Validation is a runtime safety boundary.

A workflow must not continue through risky execution when blocking validation has failed.

Validation should be explicit, explainable, auditable, and locally executable.

## Design Goals

Validation rules should be:

- deterministic
- local-first
- human-readable
- machine-parseable
- audit-friendly
- risk-aware
- reusable
- explainable
- testable

## Non-Goals

This document does not define:

- AI-based validation
- cloud validation services
- external compliance decisions
- medical or legal certainty checks
- autonomous approval
- hidden background enforcement

## Base Validation Rule Structure

Each validation rule should define:

```yaml
ruleId:
title:
description:
scope:
riskClass:
severity:
blocking:
condition:
failureMessage:
recoveryOptions:
evidenceRequired:
auditRequired:
