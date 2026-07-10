# Regeln beim Editieren in src/ (path-scoped)

- **Dark-Mode-Falle:** jeder neue `<button>`, Titel oder farbige Textknoten setzt IMMER explizit `color` — nie den geerbten Default lassen (sonst unsichtbar im Dark Mode).
- **3 States immer mitbauen:** empty / error / loading — kein Feature nur im Happy-Path (Robustheits-Checkliste).
- **Neue UI-Copy:** gender-neutral + Klarheits-Check (`../LANGUAGE_SYSTEM_NOTE.md`) — nie die generische SaaS-Floskel stehen lassen; neue user-facing Strings in alle 5 i18n-Sprachen (siehe `i18n/CLAUDE.md`).
