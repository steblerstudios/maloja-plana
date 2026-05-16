# Runtime Decision Matrix

## Purpose

This matrix defines which actions may run automatically, which require human approval, and which must remain human-only.

## Levels

| Action type | Examples | Automation allowed | Human approval | Audit trail |
|---|---|---:|---:|---:|
| Read-only display | Show dashboard, list documents, show reminders | Yes | No | Optional |
| Local calculation | Progress %, budget totals, chart summaries | Yes | No | Recommended |
| Local data edit | Save form field, mark reminder done | Yes | No | Yes |
| Document generation | Export PDF/ZIP/CV/checklist | Assisted | Recommended | Yes |
| Sensitive classification | Debt status, insurance/legal/tax hints | Assisted only | Yes | Yes |
| External communication | Email, submission, upload to authority | No | Required | Required |
| Data deletion | Delete document, reset section, purge storage | No | Required | Required |
| AI-generated recommendation | Any future AI suggestion | Assisted only | Required | Required |
| Autonomous external action | Submit forms, contact third parties, financial/legal actions | No | Required | Required |

## Core rule

The system may prepare, structure, validate, and document actions.

The system must not silently decide, submit, delete, or communicate externally without explicit human approval.

## Current alpha scope

Allowed now:
- local storage
- local calculations
- local UI guidance
- local exports
- reminders
- document organization

Not allowed now:
- autonomous external submissions
- AI decisions
- hidden automation
- external integrations without governance gates
- silent deletion of sensitive records

## Design principle

Automation increases only when:
- validation increases
- auditability increases
- rollback is clear
- human accountability remains visible
