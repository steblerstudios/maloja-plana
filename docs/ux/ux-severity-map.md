# UX Severity Map

Purpose:
Define which UX failures damage trust most.

Important:
Maloja Plana is a trust-first product.
Small trust failures compound over time.

---

## Severity Levels

### Critical
Breaks trust immediately.

Examples:
- data loss
- incorrect saved values
- broken backup restore
- hidden state changes
- misleading financial calculations
- incorrect AHV formatting/storage
- disappearing documents

---

### High
Strong frustration or confusion.

Examples:
- reset buttons visually failing
- stale UI state
- invalid phone formatting
- unclear insurance status
- inconsistent totals
- broken mobile layouts
- inaccessible interactions

---

### Medium
Noticeable roughness.

Examples:
- unclear labels
- weak onboarding
- inconsistent spacing
- too much text
- missing empty states
- weak visual hierarchy

---

### Low
Polish issues.

Examples:
- icon inconsistencies
- microcopy improvements
- animation tuning
- spacing refinements

---

## Important UX Principles

### Calm over pressure
Never create anxiety-based UX.

### Explainability over magic
Users must understand why something happens.

### Visibility over hidden automation
Derived state should remain understandable.

### Human-first language
Avoid bureaucratic or technical overload.

### Stability over feature count
A calm stable experience is more important than rapid expansion.

---

## Trust-Critical Areas

The following areas require extra caution:

- personal identity data
- AHV numbers
- financial calculations
- insurance status
- debt information
- backups/restores
- export flows
- document handling
- migration flows

---

## Release Principle

No feature should ship if:
- trust damage risk is unclear
- rollback is impossible
- calculations are not explainable
- mobile behavior is unstable
- accessibility is broken
