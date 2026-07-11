---
name: handoff
description: Packt das aktuelle Gespräch in EINEN kopierbaren Übergabe-Block, damit die Arbeit in einem neuen Chat ohne Kontextverlust weitergeht. Nutzen, wenn ein Gespräch lang/langsam wird oder Stebler Studios „handoff", „übergabe" oder „kontext sichern" sagt.
---

# Handoff — Kontext-Übergabe (Maloja Plana)

Wenn dieser Skill läuft, packe das gesamte Gespräch so, dass es in einem neuen Chat nahtlos weitergeht. Gib GENAU EINEN Block aus, den Stebler Studios kopieren kann — sonst nichts.

Der Block enthält:

1. **Ziel/Aufgabe** — woran gerade gearbeitet wird.
2. **Entscheidungen + Begründung** — jede wichtige Design-/Code-Entscheidung dieser Sitzung und warum (Maloja entscheidet gemeinsam — halte das „ja"/„nein" von Stebler Studios fest).
3. **Aktueller Stand** — erledigt / in Arbeit / offen. Bei Code: welche Dateien, welche Commits (Hashes), gebaut/deployt/verifiziert.
4. **Konkrete Bezüge** — Dateien, Pfade, i18n-Keys, Zahlen, Quellen, offene Fragen.
5. **Nächste Schritte** — exakt, damit ein Chat ohne Vorwissen weitermachen kann.

## Maloja-spezifisch (wichtig)

- **Verweise auf die wahren Quellen statt sie zu duplizieren:** `SESSION_START.md` (Repo-Root, DIE Stand-Quelle), `FEATURES.md` (built/deployed/verified-live), und die Memory (`project_maloja_plana.md`). Sag im Block explizit „zuerst SESSION_START.md lesen".
- **Governance respektieren:** nichts als erledigt markieren, was nur vorgeschlagen ist; offene Entscheide von Stebler Studios klar als solche kennzeichnen.
- **⚠️ PII/Datenschutz:** Dieser Block ist NUR zum Einfügen in einen neuen Chat gedacht — NICHT ins Repo committen, nicht auf GitHub, nicht extern teilen. Wenn der Block persönliche Daten oder Projekt-Interna enthält, weise Stebler Studios kurz darauf hin, dass er lokal/privat bleibt.

Schreibe so, dass ein Chat mit null Vorwissen nahtlos weitermachen kann. Kürze keine Details weg, die zum Weiterarbeiten nötig sind. Gib nur den Block aus.
