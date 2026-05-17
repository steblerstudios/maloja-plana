# Runtime Persistence Model

## Purpose

This document defines the runtime persistence model for Maloja Plana.

Runtime persistence describes what workflow-related information is stored locally, why it is stored, how it supports auditability, and how it avoids hidden or uncontrolled data retention.

It supports:

- local-first operation
- workflow continuity
- audit trails
- validation evidence
- approval traceability
- rollback recovery
- provenance tracking
- controlled retention
- user trust

## Core Principle

Persistence must be explicit, local, minimal, and explainable.

The runtime should store what is needed for continuity, auditability, validation, and recovery — but nothing silently or unnecessarily.

## Design Goals

Runtime persistence should be:

- local-first
- deterministic
- audit-friendly
- privacy-conscious
- user-visible where relevant
- minimal by default
- exportable where appropriate
- resilient to interrupted workflows
- independent of cloud services

## Non-Goals

This document does not define:

- cloud sync
- remote backups
- server-side persistence
- hidden telemetry
- external analytics
- autonomous memory
- background data transmission
- external account storage

## Persisted Runtime Objects

The runtime may persist:

```text
workflow_instance
workflow_state
runtime_event
audit_event
validation_result
approval_record
rollback_record
error_record
provenance_record
local_snapshot
export_record
