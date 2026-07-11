# Maloja Plana — Kanonischer Feedback Log

> Einzige offizielle Quelle für Nutzerfeedback, Testpersonen-Rückmeldungen und Domain-Expert-Inputs.
> Ersetzt: `docs/alpha/feedback-log.md` (wird zu Legacy/Archiv).
>
> **Regel:** Jedes Feedback braucht: einen Ort, einen Status, eine Priorität, eine nächste Aktion.
>
> Stand: 2026-05-27 (A-033)

---

## Legende

| Feld | Beschreibung |
|------|-------------|
| ID | FB-NNN (fortlaufend) |
| Quelle | Name oder Rolle der Person |
| Datum | Wann das Feedback gegeben wurde |
| Thema | Kurzbeschreibung |
| Original | Originalfeedback, soweit bekannt |
| Status | open / planned / done / unclear / needs-reconstruction |
| Domain | budget / ux / insurance / swiss-logic / housing / export / data / i18n / emergency / tax / employment |
| Priorität | core / important / experimental |
| Beta-relevant | ja / nein |
| Evidence | Wo das Feedback dokumentiert war |
| Nächste Aktion | Konkreter nächster Schritt |

---

## Silvan (Alpha-Tester)

### FB-001: Datum-Reset visuell fehlerhaft
- **Quelle:** Silvan
- **Datum:** 2026-05 (Alpha-Phase)
- **Thema:** Datum-Reset
- **Original:** „Wenn man ein Datum zurücksetzt, bleibt die vorherige Auswahl visuell sichtbar."
- **Status:** done
- **Domain:** ux
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/research/live-product-feedback.md, docs/research/pre-store-critical-issues.md
- **Nächste Aktion:** Erledigt (A-024)

### FB-002: Flaggen-Inkonsistenz im Onboarding
- **Quelle:** Silvan
- **Datum:** 2026-05-16
- **Thema:** Sprach-Flaggen
- **Original:** „Im Onboarding haben DE/FR/IT ein Schweizer Kreuz, EN aber eine UK-Flagge. Wirkt inkonsistent."
- **Status:** done
- **Domain:** ux / i18n
- **Priorität:** experimental
- **Beta-relevant:** ja
- **Evidence:** docs/alpha/feedback-log.md F-015
- **Nächste Aktion:** Erledigt (commit 1374af9 — alle Flaggen entfernt, Text-only)

### FB-003: Dashboard Attention Balance
- **Quelle:** Silvan
- **Datum:** 2026-05 (Alpha-Phase)
- **Thema:** Dashboard visuelle Hierarchie
- **Original:** „Viele Dashboard-Elemente konkurrieren um gleiche Aufmerksamkeit."
- **Status:** open
- **Domain:** ux
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/research/live-product-feedback.md
- **Nächste Aktion:** Stärkere visuelle Hierarchie im Dashboard — ein primärer Fokusbereich. Teilweise durch A-031C (Subtle Materiality) adressiert, aber nicht gezielt gelöst.

---

## Jana (Alpha-Testerin)

### FB-004: Kantonsnamen nicht ausgeschrieben
- **Quelle:** Jana
- **Datum:** 2026-05-16
- **Thema:** Kantonsauswahl
- **Original:** „Die Dropdown-Listen zeigen nur Kürzel wie ‚BS' und ‚ZH' statt ‚Basel-Stadt' und ‚Zürich'. Das ist unklar."
- **Status:** done
- **Domain:** ux
- **Priorität:** experimental
- **Beta-relevant:** ja
- **Evidence:** docs/alpha/feedback-log.md F-014
- **Nächste Aktion:** Erledigt (commit 1374af9 — volle Kantonsnamen in Basis, Behörden, Onboarding)

---

## Basel-Stadt User (Sozialhilfe-Bezüger)

### FB-005: SKOS Haushalt falsch berechnet
- **Quelle:** Basel-Stadt User
- **Datum:** 2026-05
- **Thema:** SKOS-Berechnung
- **Original:** „Wenn ich 1 Kind eingebe, wird so gerechnet, als wären es 2 Erwachsene. Ohne Kinder gibt es nur den 1-Personen-Satz."
- **Status:** open (blockiert von Household Model)
- **Domain:** swiss-logic
- **Priorität:** core
- **Beta-relevant:** ja
- **Evidence:** docs/alpha/feedback-log.md F-001, docs/product/real-life-problems.md
- **Nächste Aktion:** Household Model implementieren (WP-3), dann SKOS-Tabellen mit Personenkategorien korrigieren. Bug: cantonalData.js Zeile 192.

### FB-006: BVG Doppelabzug
- **Quelle:** Basel-Stadt User
- **Datum:** 2026-05
- **Thema:** Einkommensberechnung
- **Original:** „BVG wird doppelt abgezogen, wenn man Nettolohn eingibt. Der Arbeitgeber hat BVG schon abgezogen."
- **Status:** done (commit 4cb226f) — **aber:** Brutto/Netto-Unterscheidung fehlt noch
- **Domain:** budget / data
- **Priorität:** core
- **Beta-relevant:** ja
- **Evidence:** docs/alpha/feedback-log.md F-002, docs/product/real-life-problems.md
- **Nächste Aktion:** Brutto/Netto-Feld in Finanzen-Kapitel einführen (MP-DAT-006). Der Quick-Fix ist erledigt, aber die strukturelle Lösung steht aus.

### FB-007: Vorsorge-Dokumente fehlen
- **Quelle:** Basel-Stadt User
- **Datum:** 2026-05
- **Thema:** Vorsorge
- **Original:** „Die App sollte nach Patientenverfügung, Vorsorgeauftrag und Bestattungswünschen fragen."
- **Status:** planned (Checkliste im Notfall-Kapitel existiert seit commit 013ce85)
- **Domain:** emergency
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/alpha/feedback-log.md F-003
- **Nächste Aktion:** Fehlend: Dokument-Upload in Tresor, Gemeinde-Registrierungs-Erinnerung, kantonsspezifische Formular-Links.

### FB-008: Mietbeiträge fehlen
- **Quelle:** Basel-Stadt User
- **Datum:** 2026-05
- **Thema:** Wohnunterstützung
- **Original:** „Mietbeiträge sollten auch drin sein. Das gilt jetzt auch für 1- und 2-Personen-Haushalte."
- **Status:** open
- **Domain:** housing / swiss-logic
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/alpha/feedback-log.md F-004, docs/product/housing-and-benefits.md
- **Nächste Aktion:** Mietbeiträge als Eligibility-Hinweis mit kantonal Link (WP-8).

### FB-009: Versicherungs-Links fehlen
- **Quelle:** Basel-Stadt User
- **Datum:** 2026-05
- **Thema:** Versicherungs-Orientierung
- **Original:** „Es braucht Links für Prämienverbilligung und den KVG-Leistungskatalog."
- **Status:** open
- **Domain:** insurance
- **Priorität:** experimental
- **Beta-relevant:** nein (nice-to-have)
- **Evidence:** docs/alpha/feedback-log.md F-005
- **Nächste Aktion:** Links zu kantonalen IPV-Antragsformularen und BAG-Leistungskatalog hinzufügen.

### FB-010: Retirement Flow fehlt
- **Quelle:** Basel-Stadt User
- **Datum:** 2026-05
- **Thema:** Pensionierung
- **Original:** „Es sollte nach Pensionierung ja/nein fragen, EL-Antragsstatus, und ob BVG monatlich oder als Kapital ausbezahlt wird."
- **Status:** open
- **Domain:** swiss-logic / budget
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/alpha/feedback-log.md F-006, docs/product/retirement-timeline.md
- **Nächste Aktion:** Pensioniert-Flag als Basis-Input (Household Model), dann Retirement-Flow (WP-3 + WP-8).

### FB-011: AHV-Nummer Duplikation
- **Quelle:** Internes Review / Basel-Stadt User
- **Datum:** 2026-05
- **Thema:** Daten-Konsistenz
- **Original:** „AHV-Nummer muss in Basis und KK-Scanner separat eingegeben werden. Scanner-Daten gehen beim Navigieren verloren."
- **Status:** planned (Autofill done commit ae1184f, Conflict Warnings pending)
- **Domain:** data
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/alpha/feedback-log.md F-007, docs/product/real-life-problems.md
- **Nächste Aktion:** Conflict-Warning-UI wenn KK-Scanner-Werte von Basis-Werten abweichen.

---

## Family Feedback (Domain Expert)

> **ACHTUNG:** Diese 5 Einträge sind als „Family feedback (domain expert)" erfasst. **Es ist unklar, ob dies Mutter oder eine andere Person ist.** Stebler Studios muss das klären und ggf. den Quellennamen korrigieren.

### FB-012: BVG-Kontinuität und Freizügigkeitskonten
- **Quelle:** Family feedback (domain expert) — **Zuordnung unklar**
- **Datum:** 2026-05-16
- **Thema:** BVG / Pensionskasse
- **Original:** „Arbeitnehmer müssen bei Jobwechseln die BVG-Kontinuität managen. Vergessene Freizügigkeitskonten sind häufig. Nutzer brauchen Orientierung, wo ihre Vorsorgegelder liegen und welche Dokumente fehlen."
- **Status:** documented (social-protection-system.md)
- **Domain:** swiss-logic / budget
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/alpha/feedback-log.md F-008
- **Nächste Aktion:** BVG-Awareness-Sektion in Versicherungen/Finanzen: „Wo sind deine Vorsorgegelder?" (WP-8)

### FB-013: UVG/KTG Sichtbarkeit
- **Quelle:** Family feedback (domain expert) — **Zuordnung unklar**
- **Datum:** 2026-05-16
- **Thema:** Arbeitnehmer-Versicherungen
- **Original:** „Arbeitnehmer sehen UVG- und KTG-Abzüge auf der Lohnabrechnung, kennen aber den Versicherer und die Deckungsbedingungen nicht. Die App sollte helfen, Versicherer, Police und Arbeitgeber-Deckung festzuhalten."
- **Status:** documented (employment-and-insurance.md)
- **Domain:** insurance / employment
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/alpha/feedback-log.md F-009
- **Nächste Aktion:** UVG/KTG-Felder in Versicherungen-Kapitel erweitern.

### FB-014: Selbständige Versicherungslücken
- **Quelle:** Family feedback (domain expert) — **Zuordnung unklar**
- **Datum:** 2026-05-16
- **Thema:** Selbständigkeit
- **Original:** „Selbständige wissen oft nicht, welche Sozialversicherungen sie brauchen: AHV-Anmeldung, UVG, KTG, optionale BVG, Haftpflicht. Schlüsselfrage: ‚Was passiert, wenn ich einen Unfall habe?'"
- **Status:** documented (employment-and-insurance.md)
- **Domain:** insurance / swiss-logic
- **Priorität:** important
- **Beta-relevant:** nein (post-beta, MP-SOZ-014)
- **Evidence:** docs/alpha/feedback-log.md F-010
- **Nächste Aktion:** Selbständigkeits-Modul als Post-Beta Feature planen.

### FB-015: Retirement Timeline
- **Quelle:** Family feedback (domain expert) — **Zuordnung unklar**
- **Datum:** 2026-05-16
- **Thema:** Pensionierung
- **Original:** „Pensionierungsjahr sollte ein Life-Stage-Input sein. Verknüpfung mit AHV, BVG (monatlich vs. Kapital), EL-Berechtigung, Steuerimplikationen und Dokument-Erinnerungen."
- **Status:** documented (retirement-timeline.md)
- **Domain:** swiss-logic / budget
- **Priorität:** important
- **Beta-relevant:** ja (Basis-Flag)
- **Evidence:** docs/alpha/feedback-log.md F-011
- **Nächste Aktion:** Pensioniert-Flag in Household Model (WP-3), voller Retirement-Flow post-beta.

### FB-016: AHV-Administration Klarheit
- **Quelle:** Family feedback (domain expert) — **Zuordnung unklar**
- **Datum:** 2026-05-16
- **Thema:** AHV
- **Original:** „Nutzer brauchen Klarheit über kantonale Ausgleichskasse, Arbeitgeber- vs. Selbst-Registrierung, Belege. Besonders wichtig für Jobwechsler und neu Selbständige."
- **Status:** documented (social-protection-system.md)
- **Domain:** swiss-logic
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/alpha/feedback-log.md F-013
- **Nächste Aktion:** AHV-Orientierungs-Sektion mit Links und Grundlagen (WP-8).

---

## Mutter — Feedback manuell zu rekonstruieren

> **STATUS: NICHT VOLLSTÄNDIG DOKUMENTIERT**
>
> In der gesamten Dokumentation existiert nur **eine einzige Referenz** auf Mutter-Feedback:
> `docs/research/pre-store-critical-issues.md:160` — „User feedback and mother feedback."
> im Kontext von Budget UX.
>
> **Alle folgenden Einträge sind Platzhalter.** Stebler Studios muss das Feedback manuell rekonstruieren.
> Bitte nichts erfinden. Nur ausfüllen, was tatsächlich gesagt wurde.

### FB-017: Budget UX — zu wenig Geduld und Finesse
- **Quelle:** Mutter
- **Datum:** 2026-05 (ungefähr)
- **Thema:** Budget
- **Original:** *Nicht vollständig dokumentiert.* Einzige Referenz: „Budget still needs more patience and finesse." + „User feedback and mother feedback."
- **Rekonstruierte Kernaussage:** Budget-Bereich muss sich supportiver anfühlen, nicht verurteilend.
- **Status:** needs-reconstruction
- **Domain:** budget
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/research/pre-store-critical-issues.md
- **Nächste Aktion:** Stebler Studios: Bitte rekonstruieren, was Mutter konkret zum Budget gesagt hat.

### Mutter-Feedback — Rekonstruktions-Template

> Stebler Studios, bitte fülle die folgenden Fragen aus, soweit du dich erinnern kannst.
> Jede Antwort wird als Feedback-Eintrag (FB-018ff.) aufgenommen.

**Budget / Finanzen:**
- Was fehlte Mutter beim Budget?
- Welche Ausgabenbereiche hat sie genannt, die fehlen?
- Was war unverständlich an der Finanz-Darstellung?
- Was war zu dünn / zu oberflächlich?
- Wie sollte sich das Budget anfühlen? (supportiv? einfach? detailliert?)

**Schweizer Haushalt:**
- Welche typischen Schweizer Ausgaben hat sie vermisst?
- Hat sie Krankenkasse / Steuern / Versicherungen erwähnt?
- Hat sie etwas zu Fixkosten gesagt?
- Hat sie Sparziele, Notfallreserve oder Rückstellungen erwähnt?

**Familie / Haushalt:**
- Hat sie etwas zu Alimente / Unterhalt gesagt?
- Hat sie Kinderbetreuung / Familienzulagen erwähnt?
- Hat sie etwas über Haushaltszusammensetzung gesagt?
- Hat sie Stipendien oder Ausbildungsunterstützung thematisiert?

**Allgemeines:**
- Was war allgemein verwirrend oder unvollständig?
- Was hat ihr gefallen?
- Was war ihr Gesamteindruck?
- Hat sie die App einer bestimmten Person empfohlen / für eine Zielgruppe kommentiert?
- Welche konkreten Alltagssituationen hat sie genannt?

**Versicherungen / Steuern / Vorsorge:**
- Hat sie Versicherungslücken erwähnt?
- Hat sie etwas zu Steuern gesagt?
- Hat sie Vorsorge / Pensionierung kommentiert?

---

## Internes Review

### FB-018: Hardcoded German in Berechnungen
- **Quelle:** Internes Review
- **Datum:** 2026-05
- **Thema:** i18n
- **Original:** „cantonalData.js gibt deutsche Strings zurück, die das i18n-System umgehen."
- **Status:** open
- **Domain:** i18n
- **Priorität:** core
- **Beta-relevant:** ja
- **Evidence:** docs/alpha/feedback-log.md F-012
- **Nächste Aktion:** Alle Return-Werte in cantonalData.js und premiumCalc.js durch i18n-Keys ersetzen (WP-5).

---

## Allgemeines Nutzerfeedback (nicht personenzugeordnet)

### FB-019: Empty States emotional kalt
- **Quelle:** Alpha-Testing (unspezifisch)
- **Datum:** 2026-05
- **Thema:** Empty States
- **Original:** „Technisch korrekt, aber emotional kalt."
- **Rekonstruierte Aussage:** Statt „no data" / „incomplete" / „missing" besser: „you can add this later" / „start small" / „optional" / „return anytime".
- **Status:** open
- **Domain:** ux
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/research/live-product-feedback.md
- **Nächste Aktion:** Empty-State-Texte in allen i18n-Dateien überarbeiten.

### FB-020: Finanzstruktur überwältigend
- **Quelle:** Top-10 User Confusions
- **Datum:** 2026-05
- **Thema:** Finanzen
- **Original:** „Financial structure still overwhelming."
- **Status:** open
- **Domain:** budget / ux
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/research/top-10-user-confusions.md (#10)
- **Nächste Aktion:** Budget-Bereich vereinfachen und in Calm-Budget-Philosophie überarbeiten (WP-2).

### FB-021: Franchise-Erklärung schwach
- **Quelle:** Top-10 User Confusions
- **Datum:** 2026-05
- **Thema:** Versicherungen
- **Original:** „Franchise explanation weak."
- **Status:** open
- **Domain:** insurance
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/research/top-10-user-confusions.md (#8)
- **Nächste Aktion:** Franchise-Erklärungstext in Versicherungen-Kapitel verbessern.

### FB-022: KVG-Kontext fehlt
- **Quelle:** Top-10 User Confusions
- **Datum:** 2026-05
- **Thema:** Krankenversicherung
- **Original:** „KVG context missing."
- **Status:** open
- **Domain:** insurance / swiss-logic
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/research/top-10-user-confusions.md (#7)
- **Nächste Aktion:** KVG-Basis-Erklärung (was ist gedeckt, was nicht) im Versicherungen-Kapitel.

### FB-023: Budget-Wirkung von Schulden unklar
- **Quelle:** Top-10 User Confusions
- **Datum:** 2026-05
- **Thema:** Budget / Schulden
- **Original:** „Budget impact of debts unclear."
- **Status:** open
- **Domain:** budget
- **Priorität:** important
- **Beta-relevant:** ja
- **Evidence:** docs/research/top-10-user-confusions.md (#4)
- **Nächste Aktion:** Schulden-Raten als Ausgabeposten im Budget (WP-2, MP-BUD-002).

---

## Statistik

| Status | Anzahl |
|--------|--------|
| done | 4 |
| open | 11 |
| planned | 2 |
| documented | 5 |
| needs-reconstruction | 1 |
| **Total** | **23** |

| Quelle | Einträge |
|--------|----------|
| Silvan | 3 |
| Jana | 1 |
| Basel-Stadt User | 7 |
| Family Expert (Zuordnung unklar) | 5 |
| Mutter | 1 + Rekonstruktions-Template |
| Internes Review | 1 |
| Allgemein / Unspezifisch | 5 |

---

## Regeln für neue Einträge

1. Fortlaufende ID: FB-NNN
2. Immer die Person benennen (nicht „User")
3. Originalwortlaut wenn möglich
4. Nie Feedback erfinden — wenn unklar, als „needs-reconstruction" markieren
5. Domain und Priorität immer angeben
6. Beta-Relevanz explizit ja/nein
7. Nächste Aktion muss konkret sein (nicht „irgendwann prüfen")

---

*Dokument: feedback-log.md v2.0.0 (kanonisch)*
*Erstellt: 2026-05-27 (A-033)*
*Ersetzt: docs/alpha/feedback-log.md (Legacy)*
