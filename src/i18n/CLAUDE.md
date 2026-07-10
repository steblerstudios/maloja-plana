# i18n-Regeln (path-scoped — gilt beim Editieren in src/i18n/)

- **Alle 5 Sprachen mitpflegen:** wird ein Key hinzugefügt oder geändert, muss er in `de.js`, `en.js`, `fr.js`, `it.js` UND `rm.js` existieren. Kein Key darf in einer Sprache fehlen (Parität).
- **Keine Maschinenübersetzung** als Endstand (kein Google Translate). FR/IT/RM fachlich korrekt, Schweizer Terminologie (AHV, Krankenkasse, Franchise, Ergänzungsleistungen …) — siehe `../../LANGUAGE_SYSTEM_NOTE.md`.
- **Ton:** gender-neutral, ruhig; vor neuer Copy der Klarheits-Check (keine generische SaaS-/Amts-Floskel).
- **Zügig committen** nach i18n-Edits (Praxis-Merker — sonst driften die Sprachen auseinander).
- Nach Änderungen Parität prüfen: `npx vitest run src/i18n`.
