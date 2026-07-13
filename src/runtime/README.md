# Runtime — bewusst dormant (kein Toter Code)

Dieser Ordner ist ein vollständiger, getesteter Governance-Runtime (TypeScript):
`events/ · state/ · validation/ · approvals/ · audit/ · execution/ · persistence/ ·
controllers/ · core/`. Er setzt die Governance-Level L3–L4 um
(`docs/context/GOVERNANCE_LEVELS.md`): Audit-Trail, Rollback/Provenance, Freigaben,
Evidence-Chain, deterministische Ausführung.

## Status: nur der EventBus ist verdrahtet

Das Produkt (`.jsx`) importiert **ausschliesslich** `runtimeEventBus` aus
[`singleton.ts`](./singleton.ts) — an drei Stellen (`main.jsx`, `ChapterView.jsx`,
`ZipExport.jsx`, emit + subscribe). Der übrige Runtime (approvals/audit/validation/
execution) läuft **nicht** im Produkt.

**Das ist Absicht, kein Rückstand.** Das Produkt operiert heute auf **L0–L1**
(Information + Assistenz, der Mensch führt aus). Ein L3–L4-Motor wäre für Operationen
gebaut, die das Produkt — governance-first korrekt — noch nicht ausführt. Darum liegt er
vorgebaut bereit, statt halbfertig mitzulaufen.

## Wann wird er aktiviert?

Erst wenn ein Feature echt **L3+** wird (im Namen der Person ausführen/ändern —
z. B. Dokumentgenerierung mit Provenance, automatisierte Anträge). Dann wird der Runtime
für *dieses* Feature verdrahtet, mit Audit-Trail als Teil der Definition-of-Done. Nie
„auf Vorrat" pauschal einschalten.

Siehe das Feature-Tagging in `docs/context/GOVERNANCE_LEVELS.md`.
