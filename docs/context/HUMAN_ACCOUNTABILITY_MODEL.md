# Human Accountability Model

Maloja Plana keeps humans accountable for meaningful decisions.

## Principle

The system may support, prepare, validate, document, and execute controlled steps.
It must not silently transfer responsibility from humans to automation.

## Human-owned decisions

Humans remain responsible for:

- final approvals
- risk acceptance
- policy exceptions
- irreversible actions
- external communication
- data sharing
- regulatory interpretation
- production release decisions

## System responsibilities

The runtime should make human responsibility easier by providing:

- clear context
- visible source status
- validation results
- risk classification
- evidence records
- approval history
- rollback options
- escalation paths

## Prohibited behavior

The system must not:

- hide uncertainty
- imply approval where none exists
- execute high-risk actions silently
- obscure data provenance
- overwrite evidence without trace
- treat AI output as authority
- convert suggestions into decisions

## Accountability levels

### Advisory

The system provides information or structure.
Human judgment is required.

### Preparatory

The system prepares drafts, checks, plans, or proposed actions.
Human review is required.

### Controlled execution

The system executes deterministic, bounded actions.
Approval, logging, and rollback must exist.

### Restricted / blocked

The system must not act without explicit governance approval.

## Default rule

When in doubt, pause and require human confirmation.

## Product implication

Maloja Plana is not designed to replace human responsibility.
It is designed to make responsibility visible, structured, and auditable.
