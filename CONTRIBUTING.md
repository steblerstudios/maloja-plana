# Mitmachen bei Maloja Plana

Maloja Plana ist ein Open-Source-Projekt unter AGPL-3.0. Beiträge sind willkommen!

## Wie Du helfen kannst

- **Bugs melden:** Erstelle ein [Issue](https://github.com/steblerstudios/maloja-plana/issues)
- **Übersetzungen verbessern:** FR/IT/EN sind maschinell übersetzt und brauchen Lektorat
- **Code beitragen:** Fork, Branch, Pull Request
- **Feedback geben:** Nutze die App und berichte Deine Erfahrungen

## Entwicklung

```bash
git clone https://github.com/steblerstudios/maloja-plana.git
cd maloja-plana
npm install
npm run dev
```

## Regeln

- **Kein JSX** — wir nutzen `React.createElement()` direkt
- **4 Sprachen synchron** — DE, EN, FR, IT immer gleichzeitig ändern
- **Keine neuen Dependencies** ohne Absprache
- **Local-first** — keine Cloud-Verbindungen, kein Tracking
- **Tests** — `npm test -- --run` muss grün sein
- **Build** — `npm run build` muss erfolgreich sein

## Code Style

- Tokens aus `src/config/tokens.js` verwenden
- localStorage-Keys mit `or5_` Prefix
- Commit-Messages auf Deutsch
- Kleine, fokussierte Pull Requests

## Lizenz

Mit Deinem Beitrag stimmst Du zu, dass er unter AGPL-3.0 veröffentlicht wird.

## Kontakt

Sophie Stebler — steblerstudios@gmail.com
