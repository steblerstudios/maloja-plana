# Versioning

## App Version

Maloja Plana follows semantic versioning: `MAJOR.MINOR.PATCH-QUALIFIER`

| Component | Meaning |
|-----------|---------|
| MAJOR | Breaking changes to data format or user-facing contracts |
| MINOR | New features, new chapters, new tools |
| PATCH | Bug fixes, translation corrections, style adjustments |
| QUALIFIER | `alpha`, `beta`, or omitted for stable |

### Current Version
`0.5.0-alpha` — Phase 5 complete (encrypted backup, data validation, print CSS)

### Version History

| Version | Phase | Key Changes |
|---------|-------|-------------|
| 0.1.0-alpha | 1 | Core app, chapters, dashboard |
| 0.2.0-alpha | 2 | Tools (budget, tax, CV, emergency) |
| 0.3.0-alpha | 3 | Document Tresor, KK Scanner |
| 0.4.0-alpha | 4 | Charts, theme toggle, dark mode |
| 0.5.0-alpha | 5 | Encrypted backup, data validation, print CSS |

## Data Version

Internal data format version, stored in `or5_data.__version`.

| Field | Current Value |
|-------|--------------|
| Key | `CURRENT_DATA_VERSION` in `main.jsx` |
| Value | `1` |

### When to increment
- Adding new required fields to `or5_data`
- Changing the shape of existing fields
- Renaming or removing fields
- Any change that would break `validateData()` on old data

### Migration contract
- `migrateData()` handles all version transitions sequentially
- Each migration is a pure function: `(data_v_N) → data_v_N+1`
- Pre-migration snapshot is always created before running migrations
- Failed migrations restore from snapshot — no data loss

See [migration-policy.md](migration-policy.md) for migration rules.

## Git Tags

Tags mark stable release points on `main`:
- Format: `vMAJOR.MINOR.PATCH` (e.g., `v0.5.0`)
- Created after merge from `dev` to `main`
- Annotated tags with release summary

## Branch Strategy

| Branch | Purpose | Deploys to |
|--------|---------|------------|
| `main` | Stable releases, tagged | Vercel production |
| `dev` | Active development | — |
| `feature/*` | Per-phase or per-feature work | — |
