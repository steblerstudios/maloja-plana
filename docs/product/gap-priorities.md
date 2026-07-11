# A-033 — Gap Priorities (Priorisierte Übersicht)

> Schnellreferenz: Was zuerst? Warum? Was blockiert?
>
> Stand: 2026-05-27

---

## 1. Budget / Finanzen Recovery

**Warum wichtig:** Budget ist das Herzstück der Finanz-Orientierung. Aktuell nur 1 Einnahme + 5 Ausgaben — unbrauchbar für echte Haushalte. Feedback von Testperson G und Basel-Stadt User bestätigt: zu dünn, zu technisch, nicht supportiv.

**Blocker:** Brutto/Netto-Entscheidung (MP-DAT-006). Teilweise Household Model (für Alimente, Kinderzulagen, SKOS-Templates).

**Beta-relevant:** Ja — Core.

**Nächster Task:** A-034 Budget Hardening. Scope definiert in `budget-recovery-scope.md`.

**Details:** `docs/product/budget-recovery-scope.md`

---

## 2. Export als Dossier-Flow

**Warum wichtig:** Stebler Studios hat klar gesagt: „Export darf nicht wie ein Sackmesser wirken." Aktuell ist Export verstreut (ZIP hier, PDF dort, JSON-Button irgendwo). Das widerspricht dem Produktversprechen „ruhiger Lebensbereich".

**Blocker:** Keine technischen Blocker. Braucht Konzept-Entscheidung (Dossier-Typen, UX-Flow).

**Beta-relevant:** Ja — mindestens „Lebensmappe" + „Notfalldossier".

**Nächster Task:** A-035 Export Redesign. Konzept definiert in `export-dossier-concept.md`.

**Details:** `docs/product/export-dossier-concept.md`

---

## 3. Household Model

**Warum wichtig:** Blockiert direkt: SKOS-Bug-Fix (Kinder ≠ Erwachsene), Alimente, Familienzulagen, Budget-Templates, Retirement-Flag. Ohne Household ist Budget-Hardening nur halb möglich.

**Blocker:** Architektur-Entscheidung: Wie minimal? Nur Erwachsene/Kinder/Pensioniert reicht für Beta.

**Beta-relevant:** Ja — Core (Blocker für 5+ andere Features).

**Nächster Task:** A-034b Household Basis (Erwachsene + Kinder + Pensioniert-Flag).

**Details:** `docs/product/product-inventory.md` → MP-HH-001

---

## 4. Feedback Log

**Warum wichtig:** Testperson G-Feedback ist nicht dokumentiert. Family-Expert-Feedback ist nicht namentlich zugeordnet. Ohne kanonisches Feedback-System gehen weitere Rückmeldungen verloren.

**Blocker:** Stebler Studios muss Testperson G-Feedback manuell rekonstruieren. Kann nicht automatisiert werden.

**Beta-relevant:** Ja — Prozess-Hygiene.

**Nächster Task:** Stebler Studios füllt Rekonstruktions-Template in `feedback-log.md` aus.

**Details:** `docs/product/feedback-log.md` → Sektion „Testperson G"

**STATUS: ERSTELLT (A-033). Aktion von Stebler Studios ausstehend.**

---

## 5. Backlog Canonicalization

**Warum wichtig:** Drei parallele Backlog-Systeme mit drei verschiedenen ID-Schemata. Cross-Referenzen unmöglich. Doppelerfassungen. Widersprüche bei Status-Angaben.

**Blocker:** Keiner. Entscheidung getroffen (System A = kanonisch).

**Beta-relevant:** Ja — Governance-Hygiene.

**Nächster Task:** backlog-registry.json von 48 auf 260+ Einträge erweitern. BACKLOG_MASTER.md und CHAT_BACKLOG archivieren.

**Details:** `docs/product/backlog-canonicalization.md`

**STATUS: ANALYSE ERSTELLT (A-033). Migration ausstehend.**

---

## 6. Swiss Knowledge / Orientierung

**Warum wichtig:** Schweizer Spezifität ist der Kern-USP. AHV, BVG, ALV, Mietbeiträge — alles nur als Backlog-Idee. Kein Orientierungs-Content für Nutzer.

**Blocker:** Kein technischer Blocker. Braucht nur Info-Content + Links.

**Beta-relevant:** Ja (AHV, BVG, ALV Basis-Orientierung).

**Nächster Task:** A-039 Swiss Orientation Layer (Info-Sektionen, nicht Rechner).

**Details:** `docs/product/swiss-knowledge-registry.md`

---

## 7. Generatoren

**Warum wichtig:** 17 von 18 Generatoren sind nur Idee. Ohne Template Engine kann keiner gebaut werden (ausser CV-Generator, der custom ist).

**Blocker:** Template Engine Core (MP-GEN-016) muss zuerst gebaut werden.

**Beta-relevant:** Teilweise — Briefgenerator + Kündigungsschreiben haben hohen Alltagsnutzen.

**Nächster Task:** A-037 Template Engine Core + erste Templates.

**Details:** `docs/product/product-inventory.md` → Sektion 1 (Generatoren)

---

## 8. Design / Brand Umsetzung

**Warum wichtig:** Design-Reality-Audit (A-030) zeigte erheblichen Drift. A-031A/B/C hat Tokens, Typografie und Materialität verbessert. Emotionale Temperatur schwerer Screens ist aber noch ungelöst.

**Blocker:** Kein technischer Blocker. Braucht gezielte UI-Arbeit pro Screen.

**Beta-relevant:** Ja (emotionale Temperatur von Sozialhilfe, Schulden, Steuern).

**Nächster Task:** A-031D (wenn gewünscht) — Emotionale Temperatur gezielt für SozialhilfeView, SchuldenManager, TaxCalculator.

**Details:** `docs/design/emotional-temperature-map.md`

---

## Empfohlene Reihenfolge

```
SOFORT (manuell, Stebler Studios):
  → Testperson G-Feedback rekonstruieren (feedback-log.md)
  → Family Expert Feedback zuordnen (wer ist das?)
  → BVG-Bug-Status klären

DANN (kleine sichere Schritte):
  1. WP-5: Hardcoded German Fix         [Klein, sicher, hoher Impact]
  2. WP-2: Budget Hardening             [Grösste Nutzerlücke]
  3. WP-3: Household Basis              [Entblockt SKOS + Budget + Alimente]
  4. WP-4: Export "Meine Unterlagen"    [Produktidentität]
  5. WP-7: Legal (Impressum/AGB/DSE)    [Pflicht für Veröffentlichung]
  6. WP-6: Template Engine + Generatoren [Alltagsnutzen]
  7. WP-8: Swiss Orientation Layer       [USP]
  8. A-031D: Emotionale Temperatur       [Produktversprechen]
```

---

*Dokument: gap-priorities.md v1.0.0*
*Erstellt: 2026-05-27 (A-033)*
