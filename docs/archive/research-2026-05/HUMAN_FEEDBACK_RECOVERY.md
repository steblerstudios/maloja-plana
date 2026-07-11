# HUMAN FEEDBACK RECOVERY — Maloja Plana

> Erstellt: 2026-06-01
> Zweck: Rekonstruktion aller menschlichen Rückmeldungen — wer hat was gesagt, was wurde umgesetzt, was fehlt.
> Keine Implementierung. Nur Wissenssicherung.

---

## 1. MUTTER

### Identität

Unklar. FB-017 nennt sie "Mutter". FB-012 bis FB-016 sind als "Family feedback (domain expert)" erfasst. **Ob das dieselbe Person ist, weiss nur Sophie.**

Wenn Mutter = Family Expert, dann hat sie 6 Feedbacks gegeben.
Wenn nicht, dann hat Mutter genau 1 dokumentiertes Feedback — und eines der wichtigsten Stimmen des Projekts ist fast vollständig undokumentiert.

### Sicher dokumentiert

| # | Aussage | Quelle | Originalwortlaut |
|---|---------|--------|------------------|
| M-1 | Budget braucht mehr Geduld und Finesse | `pre-store-critical-issues.md` | *"Budget still needs more patience and finesse."* |
| M-2 | Budget soll sich supportiv anfühlen | `pre-store-critical-issues.md` | *"does it feel supportive?"* (abgeleitet) |

Das ist alles. Zwei halbe Sätze in einem Dokument.

### Wahrscheinlich von Mutter (wenn Mutter = Family Expert)

| # | Thema | Aussage | Quelle |
|---|-------|---------|--------|
| M-3 | BVG-Kontinuität | Arbeitnehmer müssen BVG bei Jobwechsel managen. Vergessene Freizügigkeitskonten sind häufig. | FB-012 |
| M-4 | UVG/KTG Sichtbarkeit | AN sehen Abzüge auf Lohnabrechnung, kennen aber Versicherer nicht. | FB-013 |
| M-5 | Selbständige Versicherungslücken | "Was passiert, wenn ich einen Unfall habe?" | FB-014 |
| M-6 | Retirement Timeline | Pensionierungsjahr soll Life-Stage-Input sein. Verbindung zu AHV, BVG, EL. | FB-015 |
| M-7 | AHV-Administration | Klarheit über Ausgleichskasse, Registrierung, Belege. | FB-016 |

Diese 5 Feedbacks zeigen **tiefes Schweizer Sozialversicherungswissen**. Die Person kennt Freizügigkeitskonten, UVG/KTG-Deckung, Selbständigen-Pflichten, AHV-Administration. Das ist kein normales Nutzerfeedback — das ist Domain-Expertise.

### Indirekt aus Umsetzungen ableitbar

Die folgenden Produktentscheidungen tragen Mutter-Handschrift, auch wenn kein direktes Zitat existiert:

| Spur | Wo sichtbar | Warum Mutter-Einfluss wahrscheinlich |
|------|-------------|--------------------------------------|
| "Orientierung, nicht Berechnung" | Budget Light V1 Prinzipien | Das Prinzip "Budget zeigt, bewertet nicht" klingt nach dem Gegenstück zu "braucht Geduld und Finesse" |
| "Keine Schuldzuweisung" | Budget Light V1, Anti-Patterns | Explizit aufgenommen — jemand hat das Gegenteil erlebt |
| Anti-Shame-Sprache bei Sozialhilfe | SozialhilfeView Disclaimer | "Darf nicht falsche Sicherheit geben" klingt nach jemandem, der die Realität kennt |
| Schweizer Haushalts-Kategorien | budget-recovery-scope.md | Die Detailtiefe (Serafe, Haftpflicht, Säule 3a) deutet auf lokales Wissen |

### Was NICHT dokumentiert ist

- Was genau am Budget nicht funktioniert hat
- Welche Ausgabenkategorien sie vermisst hat
- Ob sie Kinder/Familie/Alimente erwähnt hat
- Ob sie zu Versicherungen etwas gesagt hat (ausser evtl. FB-012–016)
- Was ihr gefallen hat
- Ihr Gesamteindruck
- Ob sie die App weiterempfehlen würde
- Ob sie die Schweizer Symbolik (Malojapass, Fünfliber, Helvetia) kommentiert hat
- Ob sie zum Datenschutz/Vertrauen etwas gesagt hat

### Status: RECOVERY NÖTIG

Sophie muss entscheiden:
1. Ist "Family Expert" = Mutter? → Dann Zuordnung korrigieren.
2. Kann weiteres Budget-Feedback aus Erinnerung rekonstruiert werden? → Dann eintragen.
3. Ist ein Nachgespräch möglich? → Dann mit Template durchgehen.
4. Nichts davon? → Als "nicht rekonstruierbar" markieren.

---

## 2. FAMILY EXPERT (FB-012 bis FB-016)

### Identität

Unbekannt. 5 Feedbacks vom 2026-05-16, alle im selben Block erfasst. Alle zeigen tiefes Schweizer Sozialversicherungswissen.

### Sicher dokumentiert

| ID | Thema | Kernaussage | Status |
|----|-------|-------------|--------|
| FB-012 | BVG-Kontinuität | Vergessene Freizügigkeitskonten bei Jobwechsel häufig. Nutzer brauchen Orientierung, wo Vorsorgegelder liegen. | Nur dokumentiert — keine Umsetzung |
| FB-013 | UVG/KTG Sichtbarkeit | AN sehen Abzüge, kennen Versicherer nicht. App sollte helfen, Versicherer und Police festzuhalten. | Nur dokumentiert — keine Umsetzung |
| FB-014 | Selbständige Versicherungslücken | Wissen nicht welche SV sie brauchen. Schlüsselfrage: "Was passiert, wenn ich einen Unfall habe?" | Nur dokumentiert — Post-Beta |
| FB-015 | Retirement Timeline | Pensionierungsjahr als Life-Stage-Input. Verknüpfung mit AHV, BVG, EL, Steuern. | Nur dokumentiert — braucht Household Model |
| FB-016 | AHV-Administration | Kantonale Ausgleichskasse, Arbeitgeber- vs. Selbst-Registrierung, Belege. Wichtig für Jobwechsler und Selbständige. | Nur dokumentiert — keine Umsetzung |

### Wahrscheinlich gemeint, aber nicht explizit gesagt

- Dass die App zwischen Angestellt / Selbständig / Pensioniert unterscheiden muss (implizit in FB-014, FB-015)
- Dass BVG nicht nur eine Zahl ist, sondern eine Geschichte (Jobwechsel, Lücken, Freizügigkeit)

### Indirekt aus Umsetzungen ableitbar

- Die Felder für UVG und erweiterte Versicherungen in A-024 könnten durch FB-013 motiviert sein
- Das Pensioniert-Flag im Household-Konzept geht auf FB-015 zurück

### Was umgesetzt wurde

**Nichts direkt.** Alle 5 Feedbacks sind in Docs erfasst (`social-protection-system.md`, `employment-and-insurance.md`, `retirement-timeline.md`), aber keine einzige UI-Änderung oder Feature-Implementierung folgte.

### Was fehlt

- UVG/KTG-Felder erweitern in Versicherungen
- BVG-Awareness ("Wo sind deine Vorsorgegelder?")
- Pensioniert-Flag in Basis-Daten
- AHV-Orientierungssektionen
- Selbständigkeits-Modul (Post-Beta)

---

## 3. SILVAN (Alpha-Tester)

### Identität

Alpha-Tester. Hat die App im Walkthrough getestet (2026-05, Alpha-Phase).

### Sicher dokumentiert

| ID | Thema | Originalwortlaut | Status |
|----|-------|------------------|--------|
| FB-001 | Datum-Reset | *"Wenn man ein Datum zurücksetzt, bleibt die vorherige Auswahl visuell sichtbar."* | **UMGESETZT** (A-024) |
| FB-002 | Flaggen-Inkonsistenz | *"Im Onboarding haben DE/FR/IT ein Schweizer Kreuz, EN aber eine UK-Flagge. Wirkt inkonsistent."* | **UMGESETZT** (`1374af9` — Flaggen entfernt, Text-only) |
| FB-003 | Dashboard Attention Balance | *"Viele Dashboard-Elemente konkurrieren um gleiche Aufmerksamkeit."* | **NICHT UMGESETZT** |

### Indirekt aus Umsetzungen ableitbar

- Die gesamte Accessibility-Phase 3 (Focus-Ring, Skip-Link, ARIA) könnte durch Silvans Walkthrough-Beobachtungen motiviert sein — aber das ist Spekulation
- A-031C (Subtle Materiality) wird als "teilweise Adressierung" von FB-003 genannt

### Was umgesetzt wurde

2 von 3 Feedbacks: Datum-Reset und Flaggen. Der Dashboard-Attention-Point (FB-003) ist offen.

### Was fehlt

- **Dashboard: Stärkere visuelle Hierarchie** — ein primärer Fokusbereich statt gleichgewichtiger Elemente. Das ist der einzige offene Testperson B-Punkt und betrifft den ersten Bildschirm.

---

## 4. JANA (Alpha-Testerin)

### Identität

Alpha-Testerin. Genau 1 dokumentiertes Feedback (2026-05-16).

### Sicher dokumentiert

| ID | Thema | Originalwortlaut | Status |
|----|-------|------------------|--------|
| FB-004 | Kantonsnamen | *"Die Dropdown-Listen zeigen nur Kürzel wie ‚BS' und ‚ZH' statt ‚Basel-Stadt' und ‚Zürich'. Das ist unklar."* | **UMGESETZT** (`1374af9`) |

### Wahrscheinlich dokumentiert

Nichts. Testperson A hat ein einziges Feedback gegeben, das sofort umgesetzt wurde.

### Indirekt ableitbar

Nichts weiteres.

### Was umgesetzt wurde

100%. Ihr Feedback wurde komplett adressiert.

### Was fehlt

Nichts von Testperson A — aber: **nur 1 Feedback von einer Testerin ist extrem dünn.** Hat sie mehr gesagt, das nicht erfasst wurde? Oder hat sie die App nur kurz gesehen?

---

## 5. BASEL-STADT USER (Sozialhilfe-Bezüger)

### Identität

Eine Person aus Basel-Stadt, die Sozialhilfe bezieht. Die mit Abstand wertvollste Feedback-Quelle — gibt echtes Nutzer-Feedback aus einer vulnerablen Lebenssituation. 7 dokumentierte Feedbacks.

### Sicher dokumentiert

| ID | Thema | Kernaussage | Status |
|----|-------|-------------|--------|
| FB-005 | SKOS Haushalt falsch | *"Wenn ich 1 Kind eingebe, wird so gerechnet, als wären es 2 Erwachsene."* | **TEILWEISE** — Bug offen, blockiert von Household Model |
| FB-006 | BVG Doppelabzug | *"BVG wird doppelt abgezogen, wenn man Nettolohn eingibt."* | **UMGESETZT** (Quick-Fix `4cb226f`) — strukturelle Lösung (Brutto/Netto) fehlt |
| FB-007 | Vorsorge-Dokumente | *"Die App sollte nach Patientenverfügung, Vorsorgeauftrag und Bestattungswünschen fragen."* | **TEILWEISE** — Checkliste existiert, Upload/Erinnerung/Links fehlen |
| FB-008 | Mietbeiträge | *"Mietbeiträge sollten auch drin sein. Das gilt jetzt auch für 1- und 2-Personen-Haushalte."* | **NICHT UMGESETZT** |
| FB-009 | Versicherungs-Links | *"Es braucht Links für Prämienverbilligung und den KVG-Leistungskatalog."* | **NICHT UMGESETZT** |
| FB-010 | Retirement Flow | *"Es sollte nach Pensionierung ja/nein fragen, EL-Antragsstatus, und ob BVG monatlich oder als Kapital ausbezahlt wird."* | **NICHT UMGESETZT** — braucht Household Model |
| FB-011 | AHV-Duplikation | *"AHV-Nummer muss in Basis und KK-Scanner separat eingegeben werden. Scanner-Daten gehen beim Navigieren verloren."* | **TEILWEISE** — Autofill funktioniert, Conflict-Warning fehlt |

### Indirekt aus Umsetzungen ableitbar

| Spur | Wo sichtbar | Warum Basel-Stadt-Einfluss |
|------|-------------|---------------------------|
| SKOS-Rechner überhaupt existiert | SozialhilfeView.jsx | Die tiefe SKOS-Integration (26 Kantone, Mietzinslimiten) entstand wahrscheinlich durch diese Person |
| Sozialhilfe-Disclaimer | SozialhilfeView.jsx | "Darf nicht falsche Sicherheit geben" — jemand der Sozialhilfe bezieht, weiss warum |
| IPV als Budget-Integration | budget-recovery-scope.md | IPV als Einnahme im Budget — weil es für diese Person reales Geld ist |
| Schulden/Betreibung als Thema | SchuldenManager.jsx | Die Existenz dieses Moduls geht vermutlich auf reale Betreibungserfahrung zurück |
| Anti-Shame-Sprache | Anti-Patterns, Budget Light Prinzipien | "Keine Schuldzuweisung" — jemand hat erlebt, wie es sich anfühlt, wenn eine App urteilt |

### Was umgesetzt wurde

- BVG-Doppelabzug behoben (Quick-Fix)
- AHV-Autofill von KKScanner → Basis
- Vorsorge-Checkliste in Notfall-Kapitel

### Was fehlt

| Feedback | Aufwand | Blockiert durch |
|----------|---------|-----------------|
| SKOS-Haushalt korrekt | Hoch | Household Model |
| Mietbeiträge als Hinweis | Klein | Nichts — Info + kantonal Links |
| Versicherungs-Links | Klein | Nichts |
| Retirement Flow | Hoch | Household Model |
| AHV Conflict-Warning | Mittel | Nichts |
| Brutto/Netto-Lösung für BVG | Mittel | Sophie-Entscheidung |

---

## 6. UNZUGEORDNETES FEEDBACK (kein Name)

### Top-10 User Confusions

Herkunft unklar — vermutlich aggregiert aus Alpha-Phase, keine Einzelperson zugeordnet.

| # | Confusion | Status |
|---|-----------|--------|
| 1 | Date reset still visually selected | **UMGESETZT** |
| 2 | Phone numbers unclear | **UMGESETZT** (A-024) |
| 3 | AHV formatting weak | **UMGESETZT** (A-024) |
| 4 | Budget impact of debts unclear | **NICHT UMGESETZT** |
| 5 | Insurance structure incomplete | **TEILWEISE** (A-024 fügte Felder hinzu) |
| 6 | Mobility section missing | **NICHT UMGESETZT** |
| 7 | KVG context missing | **NICHT UMGESETZT** |
| 8 | Franchise explanation weak | **NICHT UMGESETZT** |
| 9 | Empty states feel cold | **NICHT UMGESETZT** |
| 10 | Financial structure still overwhelming | **NICHT UMGESETZT** |

### Live Product Feedback (unspezifisch)

| Thema | Aussage | Status |
|-------|---------|--------|
| Empty States | *"Technically correct but emotionally cold."* | **NICHT UMGESETZT** |
| Dashboard | *"Many dashboard elements compete for equal visual attention."* | **NICHT UMGESETZT** |
| Supportive Language | *"Use calm supportive language instead of system language."* | **TEILWEISE** — in neueren Features, nicht rückwirkend |

### Sophie-eigene Designentscheidungen (kein externes Feedback)

| Aussage | Wo dokumentiert | Kontext |
|---------|-----------------|---------|
| *"Export darf nicht wie ein Sackmesser wirken."* | gap-priorities, export-dossier-concept, missing-scope-recovery | Sophie-Aussage, kein Nutzerfeedback. Führte zu "Meine Unterlagen" / "Lebensmappe" / "Notfalldossier" Konzept. Teilweise umgesetzt. |
| *"Ein Ort, kein Dashboard."* | product-memory-registry | Sophie-Designprinzip. Führte zu Editorial Layout, Malojapass-Metapher. Umgesetzt im Dashboard. |
| *"Lebensräume statt Tools."* | design-reality-audit (indirekt) | Sophie-Philosophie. Design-Audit misst "Lebensraum-Gefühl" als "ansatzweise". |
| *"Kuhglocke statt Notification."* | beta-blockers (P2), missing-scope-recovery | Fristen-Erinnerungen mit Schweizer Metapher. Easter-Egg-Referenz im Code. Nicht als Feature implementiert. P2. |

---

## ZUSAMMENFASSUNG

---

### 1. Welches Feedback hat Maloja am stärksten geprägt?

**Der Basel-Stadt User.** Diese eine Person hat mehr konkreten Produkteinfluss als alle anderen zusammen:

- SKOS-Rechner-Tiefe (26 Kantone, Mietzinslimiten)
- Schulden/Betreibung als eigenes Modul
- Anti-Shame-Sprache als Designprinzip
- Sozialhilfe-Disclaimer
- BVG-Bug entdeckt und gemeldet
- Vorsorge-Dokumente als Feature angestossen
- Retirement-Flow als Bedürfnis formuliert

Gefolgt von **Sophies eigenen Designentscheidungen** ("Ort nicht Dashboard", "kein Sackmesser", "Lebensräume"), die die Produktidentität definiert haben.

**Mutter/Family Expert** hat vermutlich den Schweizer Sozialversicherungskontext geschärft (BVG, UVG, AHV), aber das Feedback ist zu schlecht dokumentiert, um es sicher zuzuordnen.

### 2. Welches Feedback wurde vollständig umgesetzt?

| Feedback | Person | Status |
|----------|--------|--------|
| Datum-Reset visuell | Testperson B | 100% umgesetzt |
| Flaggen-Inkonsistenz | Testperson B | 100% umgesetzt |
| Kantonsnamen ausschreiben | Testperson A | 100% umgesetzt |
| BVG-Doppelabzug (Quick-Fix) | Basel-Stadt | 100% umgesetzt (strukturelle Lösung fehlt) |
| Hardcoded German | Intern | 100% umgesetzt |
| Alpha-Banner zu alarmistisch | (unklar) | 100% umgesetzt |
| Disclaimer Rechts-/Finanzberatung | (unklar) | 100% umgesetzt |

Alles davon waren **kleine, klar umrissene, rein technische Fixes**. Kein einziges konzeptionelles oder emotionales Feedback wurde vollständig umgesetzt.

### 3. Welches Feedback fehlt heute noch?

**Emotionale/Konzeptionelle Schuld (ungelöst):**

| Feedback | Person | Warum offen |
|----------|--------|-------------|
| Budget: Geduld und Finesse | Mutter | Brutto/Netto + Household fehlt |
| Empty States emotional kalt | Unspezifisch | Reine Textarbeit — kein Blocker |
| Dashboard Attention Balance | Testperson B | Braucht UX-Arbeit |
| Finanzstruktur überwältigend | Unspezifisch | Braucht Budget-Redesign |
| Franchise-Erklärung schwach | Unspezifisch | 1 Satz pro Sprache fehlt |
| KVG-Kontext fehlt | Unspezifisch | 1 Satz pro Sprache fehlt |

**Fachliche Schuld (blockiert):**

| Feedback | Person | Blocker |
|----------|--------|---------|
| SKOS Kinder ≠ Erwachsene | Basel-Stadt | Household Model |
| Mietbeiträge-Hinweis | Basel-Stadt | Keiner — nur Info + Links |
| Retirement Flow | Basel-Stadt + Family Expert | Household Model |
| BVG-Awareness | Family Expert | Keiner — nur Info-Sektion |
| AHV-Orientierung | Family Expert | Keiner — nur Info-Sektion |

**Verlorenes Feedback:**

| Was fehlt | Warum es fehlt |
|-----------|----------------|
| Mutter-Feedback (vollständig) | Nie dokumentiert. Nur 1 halber Satz existiert. |
| Family-Expert-Zuordnung | Name unbekannt. Mutter oder andere Person? |
| Janas vollständiges Feedback | Nur 1 Punkt von einer Testerin. Hat sie mehr gesagt? |
| Testpersonen-Feedback | Kein einziger strukturierter Test durchgeführt |
| Reaktion auf Schweizer Symbolik | Niemand wurde gefragt, ob Malojapass/Fünfliber/Helvetia ankommen |

### 4. Welche offenen Punkte haben den höchsten Nutzen für Beta?

**Sofort machbar, kein Blocker, hoher emotionaler Impact:**

| # | Was | Aufwand | Warum jetzt |
|---|-----|---------|-------------|
| 1 | Empty States wärmer formulieren | Klein — i18n-Texte | Verändert den Ersteindruck für jeden neuen Nutzer |
| 2 | Franchise-Orientierungssatz | Klein — 1 Satz × 4 Sprachen | Helvetia-Layer steht, nur Content fehlt |
| 3 | KVG-Orientierungssatz | Klein — 1 Satz × 4 Sprachen | Gleich |
| 4 | Mietbeiträge als Eligibility-Hinweis | Klein — Info + kantonale Links | Basel-Stadt User hat explizit gefragt |
| 5 | BVG-Awareness-Text | Klein — Info-Sektion | Family Expert hat explizit gefragt |

**Braucht Sophie-Entscheidung, aber entblockt viel:**

| # | Was | Sophie-Aktion |
|---|-----|---------------|
| 6 | Brutto/Netto-Entscheidung | Festlegen: Brutto oder Netto als Eingabe? |
| 7 | Impressum-Daten | Name, Adresse, Kontakt eintragen |
| 8 | Mutter-Feedback rekonstruieren | Template ausfüllen oder Gespräch führen |
| 9 | Family Expert zuordnen | Ist das Mutter oder jemand anderes? |

---

*HUMAN_FEEDBACK_RECOVERY.md — Menschliche Stimmen hinter dem Produkt.*
*Keine Implementierung. Nur Wissenssicherung.*
