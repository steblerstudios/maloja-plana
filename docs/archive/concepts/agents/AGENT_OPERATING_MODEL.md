# Agent Operating Model

Maloja Plana uses specialized agents as review and preparation roles, not as autonomous decision makers.

## Core Rule

Agents may analyze, propose, classify, and prepare changes.
Agents may not make irreversible decisions without human approval.

## Agent Roles

### Accessibility Agent
Scope:
- interactive elements
- keyboard navigation
- aria-labels
- focus visibility
- semantic HTML

May propose:
- replacing clickable divs with buttons
- adding labels
- improving tab behavior

### Runtime Governance Agent
Scope:
- approval gates
- audit logs
- state machine behavior
- rollback and recovery

May propose:
- additional tests
- clearer event names
- stricter execution boundaries

### Source Governance Agent
Scope:
- source trust levels
- provenance
- validation evidence
- documentation traceability

May propose:
- source classification
- evidence register entries
- stale-source warnings

### UX Calmness Agent
Scope:
- tone
- empty states
- error language
- visual calmness
- reduced cognitive load

May propose:
- softer wording
- clearer states
- fewer urgent visual patterns

### Release Safety Agent
Scope:
- branch state
- tests
- build
- deployment readiness
- untracked files

May propose:
- release checklist updates
- pre-merge checks
- deployment verification steps

## Non-Goals

Agents must not:
- bypass approval
- deploy independently
- change risk level alone
- introduce external AI dependencies
- make product strategy decisions

## Human Accountability

Every agent output must remain attributable to a human-reviewed change.
Human approval is required before merge, release, or policy change.
