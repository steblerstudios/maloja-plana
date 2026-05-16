# Branding Decisions

## User-facing names
- Ordnung & Ruhe → später ersetzen
- Ordnung und Ruhe → später ersetzen
- Maloja Plana = Zielmarke

## Technische Alt-Namen (vorerst behalten)
- ordnung-ruhe-neu
- package.json name
- Vercel project identifiers
- mögliche lokale Pfade

## Noch NICHT anfassen
- deployment configs
- build identifiers
- repo rename
- lockfiles

## Sichere frühe Änderungen
- sichtbare UI-Texte
- Dokumentation
- Placeholder-Texte
- Marketing-/About-Texte

## Risiko-Bereiche
- localStorage keys
- persistence/versioning
- imports/paths
- deployment references
- runtime assumptions

## Entscheidungsprinzip
Branding darf niemals:
- Runtime-Stabilität gefährden
- Deployments brechen
- Persistenz zerstören
- Governance-/Auditability schwächen
