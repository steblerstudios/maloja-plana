# Definition of Done

Purpose:
Define the minimum quality bar for implemented features.

Important:
A feature is not done when it merely works.
It is done when it preserves trust, stability, and calm UX.

---

## Functional Requirements

A feature is only considered complete if:

- functionality works as intended
- no obvious regressions exist
- offline mode still works
- local persistence still works
- responsive behavior works at 375px
- keyboard navigation still works
- i18n strings are complete
- no hardcoded user-facing text exists
- build passes successfully

---

## UX Requirements

A feature is only complete if:

- empty states are understandable
- labels are clear
- interactions are predictable
- visual hierarchy remains calm
- no anxiety-inducing UX is introduced
- reset behavior is visually trustworthy
- user actions remain reversible where possible

---

## Data Requirements

A feature is only complete if:

- data shape is documented
- schema changes include migration handling
- snapshots are preserved before migration
- validation behavior is documented
- sensitive fields are identified
- no silent destructive behavior exists

---

## Accessibility Requirements

A feature is only complete if:

- keyboard navigation works
- focus states remain visible
- contrast remains readable
- reduced motion still works
- mobile interaction remains usable
- screen reader labels exist where needed

---

## Security & Trust Requirements

A feature is only complete if:

- no hidden network behavior exists
- no unexpected export occurs
- no misleading calculations exist
- user trust is preserved
- sensitive information is handled carefully
- failure states remain understandable

---

## Documentation Requirements

A feature is only complete if:

- relevant architecture notes are updated
- important tradeoffs are documented
- future risks are noted
- new derived-state relationships are mapped if relevant

---

## Release Principle

"Working" is not enough.

Maloja Plana features must feel:
- calm
- understandable
- stable
- respectful
- reversible
- trustworthy
