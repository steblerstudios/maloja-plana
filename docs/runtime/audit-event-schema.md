# Audit Event Schema

## Purpose

This document defines the audit event schema for Maloja Plana.

Audit events provide a structured, human-readable, and machine-parseable record of relevant workflow activity.

They support:

- accountability
- traceability
- validation evidence
- approval verification
- provenance review
- deviation analysis
- rollback reasoning
- future audit export

## Core Principle

Audit records must explain what happened, why it mattered, who or what caused it, and what evidence supports it.

Auditability is not an afterthought.

It is part of the runtime contract.

## Relationship to Runtime Events

Runtime events record operational truth.

Audit events record audit-relevant evidence derived from or linked to runtime events.

A runtime event may be audit-relevant.

An audit event should reference the runtime event it describes.

Audit events should not silently replace runtime events.

## Design Goals

The audit event schema should be:

- append-oriented
- immutable after creation
- locally stored
- minimally sufficient
- human-readable
- machine-parseable
- exportable
- governance-aware
- privacy-conscious

## Non-Goals

This document does not define:

- cloud logging
- remote telemetry
- analytics tracking
- background monitoring
- automatic external reporting
- regulatory filing
- external audit submission

## Base Audit Event Structure

Each audit event should define:

```yaml
auditEventId:
runtimeEventId:
workflowId:
stepId:
timestamp:
eventType:
actor:
riskClass:
auditCategory:
summary:
reason:
evidenceReferences:
validationReference:
approvalReference:
provenanceReference:
errorReference:
rollbackReference:
stateBefore:
stateAfter:
userVisible:
retentionBehavior:
