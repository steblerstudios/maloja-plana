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
`0.1.0-beta` — Beta launch (all 7 chapters, 5 languages, operations infrastructure)

### Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| 0.1.0-beta | 2026-06-23 | Beta: Wartungs-Infra, Ticketing, Changelog, A11y, RM 100% |
| 0.1.0-alpha.8 | 2026-06-23 | Print, Emoji-Fix, CTA-Bereinigung |
| 0.1.0-alpha.7 | 2026-06-23 | Bundle-Splitting, Error Boundaries, A11y, RM 100% |
| 0.1.0-alpha.6 | 2026-06-22 | Trust-Panel, SEO, Ressourcen, KVG-Leistungen |
| 0.1.0-alpha.5 | 2026-06-21 | Finanz-Übersicht, Cross-Links, Dashboard-Snippets |
| 0.1.0-alpha.4 | 2026-06-20 | Fortschrittskarte, Rätoromanisch, 3a-Feld |
| 0.1.0-alpha.3 | 2026-06-19 | Kantonale Links, Dossier-Export |
| 0.1.0-alpha.2 | 2026-06-18 | Design-Audit, Link-Fixes, SW-Cache v7 |
| 0.1.0-alpha.1 | 2026-06 | Phase 1–5 komplett |

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
