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

## Current Implementation

- **Notfall chapter fields**: Three select fields (Patientenverfügung, Vorsorgeauftrag, Bestattungswünsche) with "Yes" / "Not yet" options and legal-reference hints (ZGB Art. 370-373, municipality registration). Persisted to localStorage via standard chapter data flow.
- **EmergencyHub summary**: Vorsorge section shows each document with title, description, and status badge (green "Vorhanden" / neutral "Nicht vorhanden") reflecting persisted chapter data.
- **EmergencyHub**: Emergency contact information, QR code generation
- **OrganDonation**: Organ donation preferences with QR export
- All 4 languages: EN, DE, FR, IT

## Future Expansion

### Vorsorge Slice B (Phase 7/12)
- Link each document type to the Dokument-Tresor for actual file uploads
- Municipality registration reminder for Vorsorgeauftrag
- Canton-specific links to official forms (e.g., Zürich vs. Bern templates)

### Vorsorge Slice C (Phase 14)
- Guided creation flow with resources and links
- Annual review reminder (gentle, dismissable)
- Export Vorsorge summary for family members (encrypted)
- Expand to include Testament, Ehevertrag, Erbvertrag

## Privacy Considerations

- Vorsorge documents contain highly sensitive personal information
- Stored only in IndexedDB on the user's device
- Encrypted export available for secure sharing
- No cloud backup, no server-side storage
- Emergency QR code contains only what the user explicitly includes
