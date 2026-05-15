# Template Engine

## Vision

Maloja Plana will generate real, usable documents — not just store data. The template engine turns structured user data into canton-specific, language-appropriate documents ready for submission, storage, or review.

## Scope

### Document Types (Planned)

| Category | Examples |
|----------|---------|
| Applications | IPV application, Mietbeiträge application, EL application |
| Letters | Lease termination (Kündigung), rent reduction request, tax extension |
| SOPs | What to do when moving, what to do when losing a job |
| Forms | RAV registration preparation, Kinderzulage application |
| Personal | CV generation (already Phase 5), cover letter templates |

### Output Formats

- **PDF**: Primary output for official documents
- **DOCX**: For documents that need editing before submission
- **LaTeX/Overleaf**: For users who prefer typographic control
- **Print-optimized HTML**: Already supported (Phase 5 print CSS)

## Architecture Principles

### Data-driven, not template-driven
Templates pull from the user's existing data (`or5_data`). The user does not re-enter information. If a field is missing, the template indicates what needs to be filled.

### Canton-aware
Swiss official processes vary by canton. Templates must:
- Reference correct cantonal authority names
- Use correct addresses and deadlines
- Apply correct legal references (e.g., OR Art. 266a for lease termination)
- Flag cantonal differences where relevant

### Multilingual
Templates are generated in the user's selected language. Official document names remain in the original language (German/French/Italian) with translations provided.

### Preview before export
Users always see a preview of the generated document before downloading or printing. No silent generation, no auto-submission.

### Explicit consent
Every document generation requires explicit user action. The app never generates or submits documents automatically.

### No auto-submission
Maloja Plana generates documents. It does NOT submit them to authorities, send emails, or interact with external systems. The user prints, mails, or uploads the document themselves.

## Data Flow

```
User's or5_data → Template selector → Data mapping → Preview → Export
                      ↓
              Canton/language variant
```

## Implementation Phases

| Phase | Scope |
|-------|-------|
| Phase 5 (done) | CV generator, print CSS |
| Phase 10 | Template engine core, first 3 templates |
| Phase 11 | Canton-specific variants, PDF export |
| Phase 14 | Full template library, DOCX/LaTeX support |

## Anti-patterns to Avoid

- No "smart" auto-fill that guesses information
- No document submission on behalf of the user
- No integration with government portals
- No tracking of which documents were generated
- No upselling premium templates
