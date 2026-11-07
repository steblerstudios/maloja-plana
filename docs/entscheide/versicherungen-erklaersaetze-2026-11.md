# Erklärsätze für Versicherungen · Entwurf (C5, 07.11.2026)

**Anlass:** Lebenslagen C5 (Blatt `docs/design/seiten-architektur-2026-11.md`). Im Kapitel Versicherungen haben von
29 Feldern nur 4 einen Erklärsatz (`orientation.kvg`, `franchise`, `bvg`, `uvg`). Stebler Studios 07.11.2026:
«Ja, mit Fachprüfung». **Nichts gebaut.** Gebaut wird erst, wenn Fach-, Rechts- und Wordingprüfung durch sind.

**Form wie der Bestand:** zwei kurze Sätze, Sie- und Du-Fassung, im Feld als «Orientierung» (`or(t, …)` in
`src/config/constants.js`). Kein Rat, was jemand abschliessen soll. Die Quelle steht hier, nicht im Satz
(wie bei den vier bestehenden).

## Entwürfe

| Feld | Sie-Fassung (Du analog) | Belege, die die Prüfung bestätigen soll |
|---|---|---|
| `liabilityInsurance` Haftpflicht | Die Privathaftpflicht bezahlt Schäden, die Sie anderen Menschen oder an fremden Sachen verursachen. Sie ist freiwillig, beim Mieten verlangen Vermietende sie aber oft. | Keine gesetzliche Pflicht für Privatpersonen (anders: Motorfahrzeug, SVG Art. 63) · «oft verlangt» — Beleg? (ch.ch / Mieterverband) |
| `householdInsurance` Hausrat | Die Hausratversicherung ersetzt je nach Vertrag Ihre eigenen Sachen, etwa nach Feuer, Wasserschaden oder Diebstahl. In einigen Kantonen ist die Feuerversicherung für den Hausrat Pflicht — fragen Sie im Wohnkanton nach. | Welche Kantone? (kantonale Gebäude-/Feuerversicherung) — ohne gesicherte Liste keine Kantone nennen |
| `legalInsurance` Rechtsschutz | Eine Rechtsschutzversicherung übernimmt je nach Vertrag Kosten für Anwalt und Gericht. Sie ist freiwillig; wer die Kosten nicht tragen kann, hat unter Umständen Anspruch auf unentgeltliche Rechtspflege. | BV Art. 29 Abs. 3 (unentgeltliche Rechtspflege, wenn Mittel fehlen und das Begehren nicht aussichtslos ist) |
| `ktg` Krankentaggeld | Das Krankentaggeld ersetzt einen Teil des Lohns, wenn Sie länger krank sind. Es ist nicht obligatorisch; ohne Versicherung zahlt der Arbeitgeber den Lohn nur für eine beschränkte Zeit weiter. | OR Art. 324a (Lohnfortzahlung beschränkte Zeit) · KVG Art. 67 (freiwillige Taggeldversicherung) · Widerspruch zum UVG-Satz, der schon «KTG … nicht obligatorisch» sagt? |

Bewusst noch nicht: Leben (`lifeInsurance`), Reise, Kinder, Cyber, Auto — kleiner Bedarf oder Produktwahl.

## Prüfung (07.11.2026)

Drei Prüfer parallel: **swiss-precision** (Fedlex, ECA Vaud, NSV Nidwalden, abgerufen 07.11.), **rechts-pruefer**
(Fedlex über SPARQL: BV 3.3.2024, OR 1.10.2026, KVG 1.7.2026, ZPO 1.7.2026, JSG 1.2.2025), **copy-pruefer** (Ton).
Nicht abrufbar: ch.ch und Mieterverband (Seiten bauen sich erst im Browser auf), kantonale Hunde-Haftpflicht.

| Feld | Befund | Beleg |
|---|---|---|
| Haftpflicht | «bezahlt Schäden» zu weit (nur wofür man haftet, je nach Vertrag) · «freiwillig» zu absolut (Jagd: Pflicht; Hunde kantonal, nicht geprüft) · «Vermietende verlangen oft» **nicht belegt → raus** | SVG Art. 63 Abs. 1 · JSG Art. 16 Abs. 1 |
| Hausrat | Kern richtig; Pflicht umfasst **Feuer und Naturgefahren**, nicht Diebstahl/Wasser · «in einigen Kantonen» belegt | ECA Vaud (LAIEN 1952, auch Mietende) · NSV Nidwalden |
| Rechtsschutz | korrekt; aber: Rechtspflege ist **zurückzuzahlen**, deckt nicht die Gegenpartei, gilt im Verfahren | BV Art. 29 Abs. 3 · ZPO Art. 118 Abs. 3, 123 Abs. 1 |
| Krankentaggeld | «nicht obligatorisch» stimmt bundesrechtlich, **Arbeits-/Gesamtarbeitsvertrag kann es vorsehen** · Lohnfortzahlung erst nach 3 Monaten, Dauer nach Dienstjahren · **Selbständige erhalten nichts** | OR Art. 324a Abs. 1, 2, 4 · KVG Art. 67 Abs. 1, 3 |
| Ton | «Sie ist freiwillig» nach Anrede «Sie» missverständlich → «Die Versicherung ist freiwillig» · neutral: «Anwalts- und Gerichtskosten», «Arbeitgebende» | — |

## Bereinigte Fassungen (zum Bau, nach Ja)

| Feld | Sie | Du |
|---|---|---|
| `liabilityInsurance` | Die Privathaftpflicht bezahlt je nach Vertrag Schäden an anderen Menschen oder fremden Sachen, für die Sie haften. Allgemein vorgeschrieben ist sie nicht. Ob Ihr Mietvertrag sie verlangt, steht im Vertrag. | Die Privathaftpflicht bezahlt je nach Vertrag Schäden an anderen Menschen oder fremden Sachen, für die du haftest. Allgemein vorgeschrieben ist sie nicht. Ob dein Mietvertrag sie verlangt, steht im Vertrag. |
| `householdInsurance` | Die Hausratversicherung ersetzt je nach Vertrag Ihre eigenen Sachen, etwa nach Feuer, Wasserschaden oder Diebstahl. In einigen Kantonen ist eine Versicherung des Hausrats gegen Feuer und Naturgefahren Pflicht. Fragen Sie im Wohnkanton nach. | Die Hausratversicherung ersetzt je nach Vertrag deine eigenen Sachen, etwa nach Feuer, Wasserschaden oder Diebstahl. In einigen Kantonen ist eine Versicherung des Hausrats gegen Feuer und Naturgefahren Pflicht. Frage im Wohnkanton nach. |
| `legalInsurance` | Eine Rechtsschutzversicherung übernimmt je nach Vertrag Anwalts- und Gerichtskosten. Die Versicherung ist freiwillig. Können Sie die Kosten eines Verfahrens nicht tragen, gibt es unter Umständen unentgeltliche Rechtspflege — sie muss später zurückgezahlt werden, wenn es finanziell wieder geht. | Eine Rechtsschutzversicherung übernimmt je nach Vertrag Anwalts- und Gerichtskosten. Die Versicherung ist freiwillig. Kannst du die Kosten eines Verfahrens nicht tragen, gibt es unter Umständen unentgeltliche Rechtspflege — sie muss später zurückgezahlt werden, wenn es finanziell wieder geht. |
| `ktg` | Das Krankentaggeld ersetzt einen Teil des Lohns, wenn Sie länger krank sind. Gesetzlich vorgeschrieben ist es nicht, Ihr Arbeits- oder Gesamtarbeitsvertrag kann es aber vorsehen. Ohne Versicherung zahlen Arbeitgebende den Lohn nur für eine beschränkte Zeit weiter; Selbständige erhalten dann nichts. | Das Krankentaggeld ersetzt einen Teil des Lohns, wenn du länger krank bist. Gesetzlich vorgeschrieben ist es nicht, dein Arbeits- oder Gesamtarbeitsvertrag kann es aber vorsehen. Ohne Versicherung zahlen Arbeitgebende den Lohn nur für eine beschränkte Zeit weiter; Selbständige erhalten dann nichts. |

Kantone beim Hausrat bewusst ohne Namen (Waadt und Nidwalden belegt, weitere nicht geprüft; ein Satz ohne Namen
veraltet nicht).

**Im selben Bau nachziehen:** den KTG-Satz aus `orientation.uvg` streichen (Krankheit gehört nicht in den Unfall-Satz,
sonst doppelt und schwächer). Nebenbefund im selben Satz: «Selbstständige **müssen** sich **freiwillig** versichern»
widerspricht sich selbst — vor dem Bau gegen UVG Art. 4 prüfen («können sich freiwillig versichern»); «ab 8h/Woche»
ist nicht geprüft.

**Vor dem Bau noch offen:** fr, it, en, rm (nur Deutsch geprüft) · Du-Fassungen sind vom Prüfer nicht gesehen worden,
nur aus der Sie-Fassung abgeleitet.
