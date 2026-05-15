# Vorsorge & Emergency Planning

## Overview

End-of-life and emergency planning documents are among the most important — and most neglected — aspects of personal administration. Maloja Plana treats these with calm, respectful UX that informs without pressuring.

## Key Documents

### Patientenverfügung (Advance Healthcare Directive)
- **What**: Instructions for medical treatment when the person cannot communicate
- **Legal basis**: Swiss Civil Code Art. 370-373
- **Status in app**: Ask whether it exists → if yes, allow upload and store reference → if no, explain what it is, why it matters, how to create one

### Vorsorgeauftrag (Lasting Power of Attorney)
- **What**: Designates a person to act on behalf of the individual if they lose capacity
- **Legal basis**: Swiss Civil Code Art. 360-369
- **Special**: Must be registered with the municipality (Gemeinde) to be valid
- **Future workflow**: Reminder to register with municipality after upload

### Bestattungsverordnung (Burial Instructions)
- **What**: Personal wishes regarding burial or cremation
- **Not legally binding** but important for family
- **Status in app**: Ask whether it exists, offer to store reference

## UX Principles

### Calm, non-pressuring
These are emotionally sensitive topics. The app:
- Does not use urgency language ("You NEED this!")
- Does not show completion scores or missing-document warnings
- Presents information factually: "This document exists to..."
- Lets the user decide when (or if) to engage

### Informative
For each document type, provide:
- What it is (1-2 sentences)
- Why it matters (practical consequences of not having one)
- How to create one (general guidance, links to official resources)
- Where to register it (if applicable)

### Progressive disclosure
- First: simple yes/no question
- If yes: upload option, reference storage
- If no: brief explanation, link to resources, no further prompting

## Current Implementation (Phase 5)

- **EmergencyHub**: Emergency contact information, QR code generation
- **OrganDonation**: Organ donation preferences with QR export
- No Vorsorge document management yet

## Planned Implementation

### Phase 7: Contact Layer
- Emergency contacts linked to Vorsorge documents
- "In case of emergency, contact..." with document references

### Phase 12: Inventory
- Document inventory includes Vorsorge documents
- Upload and storage in IndexedDB (encrypted at rest in future)

### Phase 14: Vorsorge Workflows
- Guided flow: "Do you have a Patientenverfügung?" → explanation → creation resources → upload → municipality registration reminder
- Annual review reminder (gentle, dismissable)
- Export Vorsorge summary for family members (encrypted)

## Privacy Considerations

- Vorsorge documents contain highly sensitive personal information
- Stored only in IndexedDB on the user's device
- Encrypted export available for secure sharing
- No cloud backup, no server-side storage
- Emergency QR code contains only what the user explicitly includes
