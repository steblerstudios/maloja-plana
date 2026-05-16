# Source Governance Matrix

## Purpose

This document defines how information sources are classified, trusted, validated, and used inside Maloja Plana.

## Source Levels

### S0 — Unknown / Unverified
- No trusted origin
- No validation
- Not allowed for critical decisions

### S1 — User Provided
- Provided manually by the user
- May be useful for context
- Requires validation before operational use

### S2 — Internal Documented Source
- Stored in project documentation or local records
- Has known origin
- Can support non-critical workflows

### S3 — Verified Authoritative Source
- Official institution, legal source, policy, regulation, or validated dataset
- Suitable for regulated workflows
- Requires provenance tracking

### S4 — Controlled Runtime Source
- Versioned
- Validated
- Traceable
- Linked to evidence and approval history
- Suitable for high-governance execution

## Core Rule

No source may be used above its governance level.

## Required Metadata

Each source should eventually include:

- title
- origin
- owner
- version
- date accessed
- validation status
- risk level
- allowed use
- expiry / review date
- provenance link

## Usage Boundaries

Sources must not be used for:

- automated critical decisions without approval
- regulatory claims without validation
- user-facing certainty beyond their trust level
- hidden AI reasoning without traceability

## Human Accountability

A human remains responsible for accepting, rejecting, or escalating source usage.
