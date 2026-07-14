# Release Criteria v0.6

## Must pass
- npm tests green
- build green
- dark mode QA
- mobile 375px QA
- accessibility labels
- no hardcoded strings
- no console errors
- working export/import
- SEO/GEO-Fundament grün (`scripts/check-seo.sh dist` — läuft automatisch im Deploy-Gate; Doku: `docs/SEO_GEO.md`)
- deployment live (Infomaniak, via `deploy.sh` — Deploy-Gate grün)

## Nice to have
- animations
- charts polish
- onboarding refinements

## Not required
- backend
- accounts
- cloud sync
