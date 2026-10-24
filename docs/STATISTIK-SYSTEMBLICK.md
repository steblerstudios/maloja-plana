# Systemblick — Zahlen zum System, ohne Zahlen über Menschen

> **Status:** Konzept, Entwurf 24.10.2026 · **nicht freigegeben** · Grundsatzentscheid durch Stebler Studios offen.
> Fachprüfung 24.10.2026: swiss-precision-, rechts- und copy-pruefer, Befunde eingearbeitet.
> Abgrenzung: [`STATISTIK.md`](STATISTIK.md) zählt *Besuche* (Server-Logs des Hosters). Dieses Dokument
> handelt von *sozioökonomischen* Zahlen: Wie wirken die Schweizer Regeln für verschiedene Haushalte, und wo
> erhalten Haushalte keine Leistung, obwohl sie Anspruch hätten?

## Haltung

Maloja sammelt heute **keine Nutzerdaten** — auch nicht für eine gute Sache. Das Versprechen «die App sendet
nichts» (CSP self-only, kein Backend live, [`BACKEND_FUER_MICH.md`](../BACKEND_FUER_MICH.md)) bleibt.
Statistik entsteht darum zuerst **ohne eine einzige Person**:

1. aus **Musterhaushalten**, die durch die Rechenmodelle laufen, die Maloja schon hat — kantonale Regeln, an
   amtlichen Quellen belegt —, und
2. aus **öffentlichen amtlichen Statistiken** (BFS, BAG, BSV, SECO, ESTV, Kantone).

Erst wenn eine Frage damit nachweislich nicht beantwortbar ist, kommt Stufe 3 (freiwillige Beiträge) als
eigener Grundsatzentscheid auf den Tisch — dann gälte der erste Satz dieses Abschnitts nicht mehr.

## Wofür (Entscheid Stebler Studios, 24.10.2026: alle vier)

| Zweck | Beispiel-Frage | Stufe |
|---|---|---|
| **Politische Argumente** (Petitionen, Medien) | «Wie gross ist die Spanne bei der Prämienverbilligung für dasselbe Profil?» | 1 + 2 |
| **Orientierung für Nutzende** | «Wo stehe ich im Vergleich zu Haushalten wie meinem?» | 2 (lokal gerechnet) |
| **Systemlücken zeigen** | «Wie viele Berechtigte beziehen eine Leistung nicht?» (Nichtbezug) | 2 |
| **Maloja verbessern** | «Für welche Haushalte kann Maloja heute keine Zahl nennen?» | 1 |

## Stufe 1 — Systemblick: Musterhaushalte durch die Kantonsmodelle (Prototyp gebaut)

- **Was:** Die **sieben Modellhaushalte des BAG-Monitorings** (Monitoring 2020, Abb. K-2, mit deren
  Bruttoeinkommen) werden durch alle 26 Kantonsmodelle der Prämienverbilligung gerechnet — dieselben Module,
  die der Rechner nutzt (`config/cantonalData.js` → `IPV_MODULE`, Belege in `docs/sources/ipv-kantone-2026.md`).
  So lassen sich die Profile mit der amtlichen Reihe (letzte Daten: 2020) in Bezug setzen.
- **Code:** `src/data/systemblick.js` · Tests `src/data/__tests__/systemblick.test.js` ·
  Messung `node scripts/systemblick-messen.mjs` → [`MESSUNG-systemblick-ipv-bag-2026-10-24.md`](MESSUNG-systemblick-ipv-bag-2026-10-24.md).
- **Daten:** keine neu erhobenen. Jede Zahl ist eine **Modellrechnung**: das, was der Maloja-Rechner einer Person mit
  genau diesem Profil zeigen würde. Weder vom BAG noch von den Kantonen berechnet oder geprüft.
- **Bezeichnung:** Haushalte heissen «Haushalt 1–7 (nach BAG-Monitoring 2020)», kurz H1–H7, neutral formuliert;
  der Wortlaut des BAG steht nur in der Quellenzeile, in Anführungszeichen. Nie «BAG 1» o. Ä. — das sähe aus,
  als stammten die Beträge vom BAG.
- **Nicht in der App sichtbar.** Keine Route, kein Menü, keine Übersetzung. Ein sichtbarer «Systemblick»
  ist ein eigener Schritt nach Freigabe und Prüfung (siehe «Bevor etwas öffentlich wird»).

### Befunde aus der Messung vom 24.10.2026 (Modellrechnung, intern)

- **Maloja rechnet 2 von 7 Haushalten.** H1 (alleinstehende Person im Rentenalter) und H3 (Einelternfamilie). Die
  übrigen fünf stehen in allen 26 Kantonen auf «keine Zahl»:
  - **zwei Erwachsene** (H2, H4, H5, H7): in 24 Kantonen hält das Modell am Riegel `mehrereErwachsene` an;
  - **junge Erwachsene 19–25** (H6): eigene Kategorie, oft an eine Ausbildung gebunden, nach der die App nicht fragt;
  - TG und JU halten in allen Fällen schon vorher an der Steuergrösse an (siehe unten).
  Das ist die grösste Lücke **in Maloja**: Fünf der sieben Haushaltstypen, mit denen das BAG die Wirksamkeit misst,
  bekommen keine Zahl. Über die Regeln der Kantone sagt das nichts. → eigener Backlog-Punkt.
- **Spanne Einelternfamilie (H3, Brutto CHF 60'000, zwei Kinder):** Verbilligung von CHF 1'946 (UR) bis CHF 7'344 (GE)
  pro Jahr in den 16 Kantonen mit Betrag, Median CHF 4'313. Verbilligter Anteil der Haushaltsprämie: 28 % (SH) bis
  76 % (ZG), Median 52 %. Zum Vergleich BAG 2020 über **alle** sieben Haushalte: 37 % der «Mittleren Prämie» (S. 13) —
  **nicht vergleichbar**: anderes Jahr, andere Haushaltsmischung, Mittelwert statt Median, anderer Nenner (unsere
  Prämie ist weder «Standardprämie» noch «Mittlere Prämie», Grenze 8) und ohne Familienzulagen im Einkommen.
  Weil Prämiendefinition und Franchise vereinfacht sind, ist der Anteil eine Näherung.
- **Person im Rentenalter (H1, Rente CHF 45'000):** nach dem Maloja-Modell in 10 Kantonen kein Anspruch, in 12 zwischen
  CHF 312 (BS) und CHF 1'490 (AI). Gerechnet ohne Abzüge und mit Vermögen 0 — beides beeinflusst gerade hier das
  Ergebnis stark. **H1 nicht veröffentlichen**, solange die Annahmen das Ergebnis mehr tragen als die Regeln.
- **TG und JU:** Die Kantone stützen sich wie fast alle auf Steuerdaten (BAG S. 11). Maloja nennt dort bewusst keine
  Zahl, weil das Kantonsmodell eine Steuergrösse braucht (Steuerbetrag bzw. steuerbares Einkommen), die die App nicht
  verlässlich schätzen kann. Das ist ein Entscheid von Maloja, keine Eigenschaft des Systems.
- **Kinder:** AG, GR und TI zeigen für die Einelternfamilie in Maloja keine Zahl (`agKinder`, `grKinder`, `tiKinder`),
  NW, GL, BL nicht (`mindestanspruch`), SZ nicht (`szKinderMindestanspruch`). Klartext je Grund steht in der Messung;
  jeder Grund beschreibt, was Maloja nicht kann oder nicht weiss — nicht eine Unklarheit der kantonalen Regel.

### Grenzen, die jede Darstellung nennen muss

1. **Kein amtlicher Kantonsvergleich.** Maloja rechnet mit Nettolohn ×12; jeder Kanton mit seinem eigenen
   massgebenden Einkommen (oft aus der Steuerveranlagung, mit Abzügen). Die Spanne zeigt, wie
   verschieden die *Regeln* wirken — nicht, was eine konkrete Person bekommt.
2. **Ein Ort je Kanton** (Hauptort). In Kantonen mit Prämienregionen gilt der Betrag nur dort.
3. **«Keine Zahl» ist nie 0** und zählt nicht in Median, Minimum, Maximum (Test erzwingt das). «Kein Anspruch im
   Modell» heisst: Maloja kommt mit diesen Annahmen auf keinen Anspruch — keine Aussage des Kantons.
4. **Stand** = Stand der Kantonsmodelle (2026). Ab 2027 neu messen, mit Datum im Dateinamen.
5. **Von Maloja gesetzt**, nicht vom BAG: Geburtsjahre, Kinderalter ganzzahlig (BAG «3.5» → 3), Netto aus Brutto
   mit dem App-Richtwert (`bruttoZuNettoRichtwert`), Rente = AHV-Maximalrente 2026 + BVG-Rest, Franchise CHF 300,
   ohne 13. Monatslohn. (Ab Dezember 2026 kommt die 13. AHV-Altersrente dazu — an der Summe von CHF 45'000 ändert das
   nichts, nur an der Aufteilung AHV/BVG; nicht an einer Quelle geprüft.)
6. **Vermögen 0.** Alle Kantone rechnen einen Teil des steuerbaren Vermögens ins massgebende Einkommen (BAG S. 11).
   Das BAG nennt für die Modellhaushalte in Anhang B (S. 131–134) keine Vermögensannahme. Mit Vermögen fiele die
   Verbilligung tiefer aus — am stärksten bei H1.
7. **Ohne Familienzulagen.** Das BAG zählt sie zum Nettoeinkommen (Anhang B, S. 132, Abb. B-2: Haushalt 3 + CHF 5'575);
   Maloja fragt nicht danach. Mit ihnen läge das Einkommen höher und die Verbilligung eher tiefer.
8. **Prämie** = regionale Durchschnittsprämie 2026 am Hauptort je Person, Standardmodell, alle Versicherer
   (`praemienRegionen.js`). Das ist **weder** die «Standardprämie» des Monitorings (Prämie der teuersten Region des
   Kantons) **noch** dessen «Mittlere Prämie» (im Kanton effektiv bezahlt, mit Wahlmodellen und hohen Franchisen) —
   beide BAG S. 134. Welche Franchisen der Durchschnitt mischt, ist nicht geprüft; zusammen mit Franchise CHF 300 ist
   das Profil eine Vereinfachung. Wo ein Kantonsmodell auf die tatsächliche Prämie deckelt, kann das den Betrag
   verschieben. → Offene Frage an die Quelle: Definition der priminfo-Spalte (Franchise-Mischung) beim BAG klären.

### Hinweis für jede Veröffentlichung (Vorschlag rechts-pruefer, 24.10.2026)

> Modellrechnung von Maloja mit erfundenen Musterhaushalten, Stand [Datum]. Die Zahlen zeigen, wie verschieden die
> kantonalen Regeln wirken. Sie sagen nicht, was eine bestimmte Person erhält. Maloja rechnet vereinfacht (siehe
> Methode). Die Kantone rechnen mit ihrem eigenen massgebenden Einkommen. Kein amtlicher Vergleich, weder vom BAG
> noch von den Kantonen geprüft. Ob und wie viel Verbilligung jemand erhält, entscheidet allein die zuständige Stelle
> Ihres Kantons. Fehler gefunden? [Kontakt]

Für die öffentliche Fassung gilt zusätzlich: Code-Schlüssel (`mehrereErwachsene`, `tgSteuerbetrag` …), «Riegel»,
«Backlog» und Prüfer-Namen bleiben intern; die Gründe für «keine Zahl» öffentlich nur in drei Klartextgruppen:
«Zwei Erwachsene rechnet Maloja noch nicht» · «Ausbildung wird nicht erfragt» · «Steuerdaten nötig (TG, JU)».
Anrede für Nutzende später nach Sie/Du-Einstellung der App.

### Kernsätze für Petitionen und Medien (Vorschlag copy-pruefer; jede Zahl mit «Modellrechnung 2026, Hauptort, ohne Vermögen und Familienzulagen»)

1. «Für eine Einelternfamilie mit zwei Kindern und CHF 60'000 Bruttoeinkommen ergibt die Modellrechnung je nach
   Kanton eine Prämienverbilligung von CHF 1'946 bis CHF 7'344 im Jahr (Median CHF 4'313, 16 Kantone). Das zeigt,
   wie unterschiedlich die Regeln wirken — nicht, was eine bestimmte Familie erhält.»
2. «Eine Studie der Berner Fachhochschule im Auftrag des Kantons Basel-Stadt schätzt für 2022, dass 23 % der
   Anspruchsberechtigten in der Stadt Basel die Prämienverbilligung nicht beziehen. Die Zahl gilt für die Stadt Basel,
   nicht für die Schweiz und nicht für Kantone, die ohne Antrag auszahlen.» (Gebiet und Zählweise der Sozialhilfe-Studie
   derselben Reihe sind am Bericht geprüft, siehe Datenquellen; der Bericht mit den 23 % selbst noch nicht.)
3. «Alle Beträge sind Modellrechnungen, kein amtlicher Kantonsvergleich und keine Zusage. Über den Anspruch
   entscheidet die kantonale Stelle.»

Nicht für Petitionen: die Lücke bei Paaren und jungen Erwachsenen (eine Aussage über Maloja, nicht über das System)
und H1 (siehe oben).

### Ausbau Stufe 1 (Ideen, nicht beschlossen)

- Dieselbe Mechanik für **Sozialhilfe** (SKOS-Kern, `data/sozialhilfeKern.js`), **Steuern**
  (`kantonaleSteuerdaten.js`, ESTV-Stichprobe), **Mietzinsbeiträge** — wo belegt.
- **Schwelleneffekte:** Bei welchem Lohn verliert ein Haushalt die Verbilligung, und was bleibt netto übrig
  («Wenn mehr Lohn kaum mehr Netto bedeutet»)? Braucht Steuer + IPV + Sozialhilfe zusammen — erst nach swiss-precision-Prüfung.
- **Paare und junge Erwachsene** erst, wenn Maloja diese Fälle abbildet (5 von 7 Haushalten).

## Wie die Zahlen entstehen

In einem Satz: Maloja nimmt einen erfundenen Haushalt, stellt ihn nacheinander in jeden Kantonshauptort und lässt
den Rechner der App laufen. 26-mal dieselbe Frage, 26 kantonale Regeln.

### Schritt für Schritt (Beispiel H3: Einelternfamilie, zwei Kinder, Brutto CHF 60'000)

| Schritt | Was passiert | H3 in Zahlen | Woher |
|---|---|---|---|
| 1. Haushalt festlegen | Profil aus dem BAG-Monitoring | 1 erwachsene Person (Jg. 1988), Kinder 3 und 5, Brutto CHF 60'000 | BAG Abb. K-2; Alter von Maloja gesetzt |
| 2. Brutto → Netto | App-Richtwert zieht AHV/IV/EO, ALV und PK ab, ÷ 12, ohne 13., ohne Familienzulagen | ≈ CHF 4'540 pro Monat | `bruttoZuNettoRichtwert` |
| 3. Prämie bestimmen | regionale Durchschnittsprämie am Hauptort, je Person summiert, Franchise CHF 300 | ZH: CHF 760 pro Monat = CHF 9'120 pro Jahr | `praemienRegionen.js` |
| 4. Kantonsregel anwenden | das Kantonsmodul rechnet die Verbilligung | ZH: CHF 4'623 pro Jahr | `IPV_MODULE`, Belege `ipv-kantone-2026.md` |
| 5. Einordnen | Betrag · kein Anspruch im Modell · keine Zahl | ZH: Betrag | `einordnen()` |
| 6. Zusammenfassen | nur Kantone mit Betrag: tiefster Wert, Median, höchster Wert | CHF 1'946 · 4'313 · 7'344 (16 Kantone) | `kennzahlen()` |

**Verbilligter Anteil** = Verbilligung ÷ Jahresprämie. ZH: 4'623 ÷ 9'120 = 51 %.

### Warum diese Kennzahlen (statistische Begründung)

- **Keine Stichprobe, darum kein «±».** Jede Zahl ist eine feste Rechnung, kein Schätzwert aus einer Umfrage. Ein
  Vertrauensintervall oder «signifikant» wäre hier falsch. Die Unsicherheit steckt in den **Annahmen** (Vermögen 0,
  ohne Familienzulagen, Durchschnittsprämie). Sie wird mit einer Sensitivitätsrechnung gezeigt, nicht mit Zufallsfehlern
  (siehe «Wie Maloja die Hebel messen könnte»).
- **Median statt Durchschnitt.** Bei 16 Werten ist der Median der Mittelwert aus dem 8. und 9. Wert (AI 4'242, FR 4'383
  → 4'313). Der Durchschnitt läge bei CHF 4'467, weil BS und GE ihn nach oben ziehen.
- **Die Spanne kommt von den Rändern.** Die mittlere Hälfte der 16 Kantone liegt zwischen rund CHF 4'050 und 4'900
  (Quartile nach der Methode «inclusive»: 4'054 / 4'884; mit «exclusive» 3'883 / 5'100 — die Methode immer nennen). «CHF 1'946 bis 7'344» stimmt, beschreibt aber die Extreme: UR und SH unten, BS und GE oben. Öffentlich beides
  nennen, sonst wirkt die Streuung grösser, als sie für die meisten Kantone ist.
- **«Keine Zahl» ist keine Zufallslücke.** Die 10 Kantone ohne Zahl haben oft besondere Regeln für Kinder. Der Median
  gilt darum nur für die 16 Kantone mit Betrag. Nie «Schweizer Median» schreiben.

### Was die Verbilligung nicht zeigt: die Restprämie

Eine hohe Verbilligung heisst nicht, dass der Haushalt wenig bezahlt. Wo die Prämie hoch ist, ist meist auch die
Verbilligung hoch (Korrelation Prämie–Verbilligung über die 16 Kantone: r = 0.62). Was die Familie wirklich trägt, ist
die **Restprämie**:

> **Restprämie** = Jahresprämie − Verbilligung (bei «kein Anspruch im Modell» die ganze Prämie)  ·
> **Restprämie in % des Netto-Richtwerts** = Restprämie ÷ Einkommen pro Jahr, mit dem die App rechnet (H3:
> Nettolohn-Richtwert × 12 = CHF 54'480). Bewusst **nie nur «Belastung»** nennen: Das klänge nach der BAG-Grösse
> «verbleibende Prämienbelastung», die anders gerechnet ist (siehe unten).

Gerechnet im Code (`restpraemie`, `kennzahlenRest` in `systemblick.js`, mit Tests; das Feld heisst intern `belastung`).
Die Messung enthält den Abschnitt «Restprämie» für H1 und H3. Die Tabelle hier zeigt H3, sortiert nach dem Prozentwert.
Vom swiss-precision-pruefer am 24.10.2026 nachgerechnet (alle 16 Werte, Median, Prozentwerte):

| Kanton | Verbilligung | Jahresprämie | Restprämie | % des Netto-Richtwerts |
|---|---:|---:|---:|---:|
| ZG | 4'434 | 5'808 | 1'374 | 2.5 % |
| AI | 4'242 | 5'952 | 1'710 | 3.1 % |
| OW | 4'139 | 6'744 | 2'605 | 4.8 % |
| VS | 5'246 | 8'220 | 2'974 | 5.5 % |
| AR | 4'172 | 7'404 | 3'232 | 5.9 % |
| BS | 6'876 | 10'140 | 3'264 | 6.0 % |
| GE | 7'344 | 10'680 | 3'336 | 6.1 % |
| LU | 3'798 | 7'788 | 3'990 | 7.3 % |
| FR | 4'383 | 8'568 | 4'185 | 7.7 % |
| SG | 3'784 | 8'016 | 4'232 | 7.8 % |
| ZH | 4'623 | 9'120 | 4'497 | 8.3 % |
| UR | 1'946 | 6'564 | 4'618 | 8.5 % |
| VD | 5'208 | 9'936 | 4'728 | 8.7 % |
| NE | 4'776 | 9'588 | 4'812 | 8.8 % |
| BE | 4'147 | 9'288 | 5'141 | 9.4 % |
| SH | 2'349 | 8'304 | 5'955 | 10.9 % |

- **Restprämie** CHF 1'374 (ZG) bis 5'955 (SH), Median CHF 4'088. **In % des Netto-Richtwerts** 2.5 % bis 10.9 %,
  Median 7.5 %. Das ist gut ein Faktor 4 für dasselbe Profil.
- **Die Rangfolge kippt.** GE hat die höchste Verbilligung, liegt bei der Restprämie in % aber auf Platz 7. ZG steht bei
  der Verbilligung auf Platz 7, bei der Restprämie in % auf Platz 1. UR hat die tiefste Verbilligung, aber nicht die
  höchste Restprämie. Die höchste Restprämie trägt das Profil in SH.
- **Folgerung:** Wer über *Kosten* spricht, rangiert die Restprämie, nie die Verbilligung allein.
- **Zählregel:** Beim Median der Verbilligung zählen nur Kantone mit Betrag. Bei der Restprämie zählt «kein Anspruch im
  Modell» mit, denn dieser Haushalt trägt die ganze Prämie. Darum hat H1 22 Werte statt 12. H1 bleibt intern (siehe oben).
- **Verbilligung über der Musterprämie:** Der Test hat es am 24.10.2026 bei AR gefunden: H3 mit Brutto CHF 48'000 (−20 %)
  ergab CHF 851 mehr Verbilligung als die Musterprämie (Richtprämie 6'025.20 + 2 × 1'114.80 = 8'254.80, minus
  Musterprämie 7'404; vom Prüfer nachgerechnet). AR deckelt den Anteil der erwachsenen Person auf die Prämie «mit der
  ordentlichen Franchise und mit Unfalldeckung» (V zum KVG Art. 7, bGS 833.141). Gründe, zusammen: (1) Das AR-Modul lässt
  den Kinderanteil ungedeckelt und vergleicht den Erwachsenenanteil mit der ganzen Haushaltsprämie; (2) die
  AR-Richtprämie für Erwachsene (6'025) liegt über der Musterprämie (Herisau, eine Person: 4'872); (3) die Musterprämie ist
  ein Durchschnitt, der vermutlich tiefer liegt als die Prämie mit Franchise CHF 300 — **nicht geprüft** (Grenze 8).
  Eine negative Restprämie gibt es nicht, und 0 wäre eine Behauptung. Darum steht dort «keine Zahl» mit Grund
  `verbilligungUeberPraemie`, gezählt unter `restOffen`. Beim BAG-Brutto tritt der Fall in keinem Kanton auf; andere
  Kantone mit eigener Richtprämie sind nicht systematisch getestet. Für eine verlässliche Restprämie braucht es die Prämie
  mit ordentlicher Franchise, nicht den Durchschnitt (offene Frage priminfo, siehe Grenze 8).
- **Nicht mit dem BAG vergleichbar** (13.7 % bzw. 9.4 %, S. 13). Das BAG teilt durch das «verfügbare Einkommen»
  (Nettolohn − Steuern, mit Familienzulagen; Anhang B, S. 132 und 134). Unser Wert unterscheidet sich dreifach:
  **ohne Steuern** im Nenner (unser Prozentwert fällt dadurch tiefer aus), **ohne Familienzulagen** (fällt dadurch höher
  aus) und eine **andere Prämie** (Musterprämie statt «Standardprämie» bzw. «Mittlere Prämie»). Dass einzelne Werte nahe
  bei den BAG-Zahlen liegen (H3/BE 9.4 %, H1/BS 13.8 %), ist Zufall, keine Bestätigung.

## Wie die Kosten sinken können

Zwei Ebenen getrennt halten: was ein Haushalt selbst tun kann (Orientierung in der App) und was eine Regeländerung
bewirken würde (Petitionen, Medien). Zwei Regeln aus der Statistik gelten für beide: **Hebel nach Grösse ordnen.**
**Hebel nicht einfach zusammenzählen**, denn sie wirken aufeinander.

### Für den einzelnen Haushalt (grösster Hebel zuerst)

1. **Verbilligung beantragen.** Bei H3 geht es um den ganzen Betrag (Median CHF 4'313 pro Jahr in der Modellrechnung).
   Ob das mehr ist als andere Sparmöglichkeiten bei der Prämie, misst Maloja heute nicht (siehe Hebel 2) — offen.
   In der Stadt Basel bezog 2022 knapp ein Viertel der Berechtigten die Verbilligung nicht (23 %, BFH, gilt nur für die
   Stadt Basel). In Kantonen mit Gesuchsfrist entscheidet das Datum, z. B. SO (Gesuch bis 31. Juli des Anspruchsjahres,
   Sozialverordnung § 75 Abs. 2, BGS 831.2) und AR (Antrag bis 31. März, in Härtefällen bis 30. April, V zum KVG Art. 10,
   bGS 833.141) — für 2026 sind beide vorbei. Hier hilft Maloja: einen möglichen Anspruch einschätzen und die Frist
   merken. Entscheiden tut der Kanton.
2. **Günstigeren Versicherer in derselben Region wählen.** Die Leistungen der Grundversicherung sind bei allen gleich.
   Wie gross die Spanne je Region ist, zeigt der Systemblick heute nicht: Er rechnet mit dem Durchschnitt aller
   Versicherer. → messbar machen (siehe unten).
3. **Anderes Versicherungsmodell** (Hausarzt, HMO, Telmed): Rabatt auf die Prämie, dafür weniger freie Arztwahl.
4. **Höhere Franchise:** Sie senkt die Prämie und erhöht das Risiko bei Krankheit. Für Haushalte mit knappem Budget
   ist das oft gerade der falsche Weg. Maloja hebt es nicht als Spartipp hervor.

**Wechselwirkung:** Hebel 2 bis 4 senken die Prämie und können damit auch die Verbilligung senken. Manche Kantonsmodelle
deckeln die Verbilligung auf die tatsächliche Prämie. NE kürzt sie bei Wahlfranchise (siehe `systemblick.js`). Dann kommt
nur ein Teil der Ersparnis beim Haushalt an. Darum gilt: Bevor Maloja einen Frankenbetrag nennt, wird die Kombination
durch das Kantonsmodell gerechnet. Nie zwei Ersparnisse addieren.

### Auf der Ebene der Regeln (für Petitionen und Medien, erst nach Prüfung)

1. **Prämien und Regeln machen den Unterschied.** Dasselbe Profil trägt in der Modellrechnung je nach Kanton 2.5 % oder
   10.9 % des Netto-Richtwerts als Restprämie. Die Spanne liegt an **Prämienniveau und kantonalen Regeln zusammen**
   (die Jahresprämie desselben Profils reicht von CHF 5'808 in ZG bis 10'680 in GE) und an den Maloja-Annahmen
   (Vermögen 0, Netto statt massgebendes Einkommen). Wie viel davon an den Regeln allein liegt, ist **nicht getrennt
   gemessen** — dafür bräuchte es dieselbe Prämie in allen Kantonen als Gegenrechnung (siehe unten). Erst dann taugt
   der Befund als Argument für eine verbindliche Höchstbelastung. Kein Kernsatz, bis das gemessen ist.
2. **Nichtbezug senken.** Verbilligung automatisch oder auf Hinweis auszahlen statt nur auf Gesuch. Die Kantone stützen
   sich ohnehin auf Steuerdaten (BAG S. 11), die Daten sind also da. Stand 2026 laut `ipv-kantone-2026.md`: **ohne
   Antrag** BE, UR, AI, VS, GE, JU (6); gemischt NE; Kanton schreibt an, Antrag nötig 11; Antrag ohne Zustellung 8 —
   in 19 von 26 Kantonen muss eine berechtigte Person 2026 selbst handeln. Der Basler Nichtbezug (23 %) stammt aus einem
   Antragskanton und ist **nicht** auf Kantone mit automatischer Auszahlung übertragbar. Einzelheiten, Fristen und
   Prüfstand: [`BEFUND-quellen-kosten-senken-2026-10-24.md`](BEFUND-quellen-kosten-senken-2026-10-24.md), Abschnitt 2.
3. **Bundesrecht ab 2026** (KVG Art. 65 Abs. 1ter–1sexies, in Kraft seit 1.1.2026, an Fedlex und BAG gelesen
   24.10.2026): Jeder Kanton legt fest, welchen Anteil die Prämie am verfügbaren Einkommen höchstens ausmachen darf —
   **bis spätestens vier Jahre nach Inkrafttreten, ohne Höchstwert vom Bund**; sonst legt ihn der Bundesrat fest.
   Dazu ein Mindestbeitrag der Kantone von 3,5–7,5 % der OKP-Bruttokosten, in den ersten zwei Jahren überall 3,5 %.
   Als Massstab für den Systemblick («Erreichen die Musterhaushalte das Ziel ihres Kantons?») taugt das erst, wenn ein
   Kanton sein Ziel festgelegt hat — und auch dann nicht direkt, weil das Gesetz am verfügbaren bzw. steuerbaren
   Einkommen misst. Wortlaute und Herleitung: [`BEFUND-quellen-kosten-senken-2026-10-24.md`](BEFUND-quellen-kosten-senken-2026-10-24.md), Abschnitt 1.
4. **Gesundheitskosten** treiben die Prämien. Das kann Maloja nicht messen. Es gehört nicht in Maloja-Kernsätze.

### Wie Maloja die Hebel messen könnte (Vorschlag, nicht gebaut)

- ~~**Restprämie in den Code**~~ — gebaut 24.10.2026 (`restJahr`, `belastung`, `restOffen` je Zeile, `kennzahlenRest`,
  Abschnitt in der Messung).
- **Sensitivität:** H3 einzeln mit Vermögen 0 / 25'000 / 50'000, mit und ohne Familienzulagen (BAG: CHF 5'575) und mit
  Franchise 300 / 2'500 rechnen. So zeigt sich, welche Annahme die Zahl am stärksten bewegt. Öffentlich steht dann eine
  Spanne statt eines Punktes.
- **Schwellenfächer:** `systemblickIPV('bag3', brutto)` für Brutto CHF 40'000 bis 100'000 in Schritten von 2'000 (der
  Parameter `bruttoJahr` ist schon da). Das zeigt, wo die Verbilligung wegfällt und wie viel von CHF 1'000 mehr Lohn
  nach der Restprämie übrig bleibt.
- **Regeln von Prämien trennen:** dasselbe Profil in allen Kantonen mit **derselben** Prämie rechnen (z. B. dem
  Schweizer Mittel). Was dann an Spanne bleibt, liegt an den Regeln; die Differenz zur Messung am Prämienniveau.
  Voraussetzung für jeden Kernsatz «die Regeln machen den Unterschied». Achtung: Kantone mit eigener Richtprämie oder
  Deckel auf die tatsächliche Prämie reagieren darauf unterschiedlich — Ergebnis je Kanton prüfen.
- **Spanne der Versicherer je Region:** günstigste und teuerste Prämie je Region zur Bauzeit übernehmen, wie
  `scripts/build-praemien-data.mjs`. ⚠️ Datenquelle und Lizenz noch nicht geprüft.

## Stufe 2 — Öffentliche amtliche Statistik

Kontext zu den Musterzahlen: Wie viele Menschen sind arm, beziehen Sozialhilfe, EL, Verbilligung — und wie
viele beziehen nicht, obwohl sie Anspruch hätten (Nichtbezug)?

- **Quellen:** siehe Abschnitt «Datenquellen» unten (Recherche 24.10.2026, vor Nutzung je Zahl an der
  Quelle gegenprüfen — Wahrheits-Disziplin, `CLAUDE.md`).
- **Technik:** Zahlen werden **zur Bauzeit** als kleine, datierte Tabelle mit Quelle ins Repo übernommen
  (wie `scripts/build-praemien-data.mjs`), nie zur Laufzeit von einer fremden Seite geladen. So bleibt
  CSP self-only und die App offline-fähig.
- **Lizenz:** BFS-Datensätze auf opendata.swiss tragen in der Regel «Freie Nutzung. Quellenangabe ist Pflicht.
  Kommerzielle Nutzung nur mit Bewilligung des Datenlieferanten zulässig.» (◐ Wortlaut aus dem Suchwerkzeug, die
  Datensatzseite selbst gab 403). Folgen: Quellenangabe (Amt, Titel, Link, Stand) an jeder übernommenen Zahl — das
  verlangt Maloja ohnehin. Ob Maloja als kostenlose App einer Einzelfirma «kommerziell» nutzt, ist **offen** →
  rechts-pruefer bzw. beim BFS nachfragen, bevor ganze Tabellen ins Repo kommen. Die Bedingungen gelten **je
  Datensatz**: vor jeder Übernahme an dessen Seite nachlesen und mit Datum ins Repo schreiben. Studien (BFH, Ecoplan)
  nur als Zitat mit Quelle (URG Art. 25), nie so, als stützten sie die Maloja-Zahlen.
- **Orientierung für Nutzende** («Haushalte wie Ihrer/deiner») wird **lokal** gerechnet: die öffentliche Tabelle liegt
  im Bundle, das eigene Profil verlässt das Gerät nicht.

## Stufe 3 — Freiwillige, grobe Beiträge (nur bei echtem Bedarf, eigener Grundsatzentscheid)

Nur falls eine Frage weder Stufe 1 noch 2 beantworten kann (z. B. «Wie viele Maloja-Nutzende haben einen
Anspruch, den sie nicht geltend machen?»). Mindestregeln, falls es je so weit kommt:

- **Ausdrückliches Ja pro Beitrag**, Vorschau des exakten Inhalts vor dem Senden. Standard: aus.
- **Grobe Klassen**, auf dem Gerät gebildet (Kanton, Haushaltstyp, Einkommensband, «Anspruch ja/nein/offen»),
  nie Rohwerte, kein Geburtsdatum, keine PLZ.
- **Keine Kennung, kein Zeitstempel genauer als der Monat.** Die IP-Adresse wird beim Senden immer bearbeitet und kann
  in den Server-Logs des Hosters landen (`STATISTIK.md`): Logs prüfen bzw. kürzen, und so beschreiben, nicht «keine
  IP-Speicherung» versprechen.
- **Nicht automatisch anonym:** Die Kombination aus Kanton, Haushaltstyp, Einkommensband und Anspruch kann in kleinen
  Kantonen (AI, UR, OW …) eine Person erkennbar machen — auch wenn erst ab einer Mindestgrösse veröffentlicht wird
  (z. B. 20 je Gruppe). Die gespeicherten Einzelbeiträge können davor Personendaten sein.
- Optional **lokales Verrauschen** (Randomized Response), damit eine einzelne Antwort nichts beweist.
- **Rechtlich offen** (rechts-pruefer, Artikel nicht an Fedlex geprüft): ob Angaben zu Sozialhilfe/Anspruch besonders
  schützenswerte Personendaten sind (dann ausdrückliche Einwilligung); Informationspflicht; Vertrag zur
  Auftragsbearbeitung mit dem Hoster; Bekanntgabe ins Ausland; allenfalls Datenschutz-Folgenabschätzung; Löschfrist
  für Rohbeiträge; neuer Abschnitt Datenschutzerklärung/LegalView in 5 Sprachen; Satz «Maloja sammelt keine
  Nutzerdaten» anpassen.
- Braucht ein Backend (`maloja-server`, heute nicht live) → Sicherheits-Review, erneute Rechtsprüfung. **Nicht vor 2027.**

## Bevor etwas öffentlich wird

- [ ] Grundsatzentscheid Stebler Studios zu diesem Konzept
- [x] `swiss-precision-pruefer` über `systemblick.js`, Messung und Quellen (24.10.2026, eingearbeitet)
- [x] `rechts-pruefer` (24.10.2026, eingearbeitet; Gesetzesartikel noch an Fedlex prüfen)
- [x] `copy-pruefer` (24.10.2026, eingearbeitet)
- [ ] BFS-Werte mit ◐ an den XLSX-Tabellen gegenlesen (Wortlaut der BFS-Seiten bestätigt, 24.10.2026)
- [ ] Lizenz je übernommenem Datensatz an dessen Seite nachlesen; Frage «kommerziell» klären
- [ ] Sichtbare Seite: 5 Sprachen, a11y, Tabelle mit Textalternative, Quelle und Stand an jeder Zahl, Hinweis oben
- [ ] Für Petitionen: nur die Kernsätze oben, mit Stand, Methode und Link auf die Methode

## Datenquellen (Stufe 2)

Recherche 24.10.2026. **Prüfstand je Zeile:**
✅ = am Original gelesen (Seite/PDF, Stelle genannt) ·
◐ = Wortlaut der amtlichen Seite, über das Suchwerkzeug zitiert; die Seite selbst war nicht ladbar (BFS lädt per JavaScript) ·
⚠️ = nur aus Suchergebnis — **vor jeder Verwendung am Original nachlesen**, Wahrheits-Disziplin (`CLAUDE.md`).
Keine Zahl dieser Liste geht ungeprüft in App oder Petition.

### Der wichtigste Fund: Das BAG rechnet selbst mit Modellhaushalten ✅

**Ecoplan im Auftrag des BAG, «Wirksamkeit der Prämienverbilligung – Monitoring 2020», Schlussbericht Mai 2022**
(Daten 2020, veröffentlicht 31.05.2022) — https://www.bag.admin.ch/dam/de/sd-web/QNNLxS1AH4Nb/monitoring-2020-wirksamkeit-pv.pdf ·
Übersicht aller Berichte: https://www.bag.admin.ch/de/krankenversicherung-monitoring-praemienverbilligung

- **Methode:** «sieben Modellhaushalte» je Kanton, «in wirtschaftlich bescheidenen Verhältnissen ohne Anspruch
  auf EL oder Sozialhilfe» (S. 11–12, Abb. K-2), u. a. Einelternfamilie mit zwei Kindern, Bruttoeinkommen CHF 60'000.
  → Umgesetzt am 24.10.2026: Der Systemblick rechnet dieselben sieben Profile (siehe Stufe 1).
- **Befund 2020:** verbleibende Prämienbelastung im Schnitt über alle Kantone und Modellhaushalte **13.7 % des verfügbaren
  Einkommens** mit «Standardprämie», **9.4 %** mit «Mittlerer Prämie»; tiefste ZG (7 % / 4 %), höchste NE (19 % / 15 %) (S. 13).
  (Dezimalpunkt wie in der Quelle.)
- **Zielgrösse des Bundesrats** (Botschaft 1991): Bei Belastung mit der «Mittleren Prämie» werden die Zielwerte «für rund
  20 % der Modellhaushalte erfüllt» (S. 13); mit der «Standardprämie» nur in ZG und GR für einige Haushalte.
- **Bezug 2020:** «rund 2.4 Millionen Personen», Bezugsquote 28 %; Ausgaben rund 5.5 Mrd. CHF, Kantonsanteil im Schnitt 48 % (S. 9).
- **Stand:** neuer Bericht seit 2022 nicht angekündigt (Rhythmus bisher alle drei bis vier Jahre). Neuere amtliche Daten
  liegen nicht vor; der Systemblick ist eine Näherung mit Stand 2026, kein Ersatz für die amtliche Statistik.

### Prämienverbilligung (Bezug, Beträge je Kanton)

- ✅ **BAG, Statistik der obligatorischen Krankenversicherung** — https://www.bag.admin.ch/de/statistik-der-obligatorischen-krankenversicherung
  Ausgabe 2024 vollständig (110 Tabellen, 19.01.2026); Ausgabe 2025 «unvollständig: 80 T.» (29.09.2026). Nur XLSX (ZIP),
  «Ab der Ausgabe 2023 ist nur das Excel-Format verfügbar»; ältere Ausgaben auf opendata.swiss. Welche Tabelle IPV-Bezug
  je Kanton enthält: im ZIP nachsehen (nicht geprüft).
- ⚠️ **BAG Dashboard Krankenversicherung** (u. a. ausbezahlter Betrag pro beziehende Person nach Kanton) — https://kvd.bag.admin.ch/de/premium/statistic

### Nichtbezug (wer Anspruch hätte und nicht bezieht)

- ✅ **Basel-Stadt, WSU, Medienmitteilung 12.02.2026** — Studie der BFH (Prof. Oliver Hümbelin) im Auftrag des Amtes
  für Sozialbeiträge, «Nichtbezug von bedarfsabhängigen Sozialleistungen in der Stadt Basel: Berichtsjahr 2022»:
  Nichtbezugsquote **Familienmietzinsbeiträge 18 %, Prämienverbilligung 23 %, EL zur AHV 32 %, wirtschaftliche Sozialhilfe 26 %**.
  Absolute Zahl der Nichtbeziehenden gesunken bei allen ausser der Prämienverbilligung — gehört zu jedem öffentlichen Satz.
  https://www.bs.ch/medienmitteilungen/wsu/2026-neue-studie-zum-nichtbezug-von-sozialleistungen-zeigt-positive-entwicklungen ·
  Bericht: https://arbor.bfh.ch/entities/publication/ccd1e9a1-611a-42cd-b7a6-a3ed56d0fd35 ·
  Sozialhilfe 2016–2022: https://arbor.bfh.ch/entities/publication/f0df07f1-3828-4c7e-8501-40a32f66b278
  → **Gilt für die Stadt Basel**, nicht für die Schweiz. Den Bericht 2022 (23 %) selbst konnte ich nicht öffnen.
- ✅ **BFH, «Trends und Entwicklungen im Nichtbezug von Sozialhilfe in der Stadt Basel, 2016–2022»**, Hümbelin, Lehmann,
  Torkisz, Version 29.01.2026 (PDF gelesen) — https://arbor.bfh.ch/server/api/core/bitstreams/fc9c4676-7fcd-459a-b147-1c136fe91df7/content
  - **Gebiet:** «Bevölkerung der Stadt Basel (ohne Riehen und Bettingen)»; nicht berücksichtigt: Personen im
    Pensionsalter, Beziehende einer AHV- oder IV-Rente, Ausweis L/N/F, Kollektivhaushalte (S. 10).
  - **Zählweise:** Anspruch je **Unterstützungseinheit** geprüft (S. 8–9), Quote über **Personen** («rund 11'000
    Personen» potenziell Anspruchsberechtigte 2022, S. 3).
  - **Sozialhilfe:** Nichtbezugsquote «28.3 Prozent (2016) auf 30.2 Prozent (2022)» (S. 3). Die Medienmitteilung nennt
    für die Sozialhilfe 2022 **26 %** — andere Studie derselben Reihe (Berichtsjahr 2022). Nie die beiden Zahlen
    vermischen; immer Studie und Jahr dazuschreiben.
  - Dieselbe Reihe (BFH) dürfte für die 23 % ähnlich abgrenzen (Stadt Basel, ohne Rentenalter) — **Vermutung**, am
    Bericht 2022 prüfen. Gilt die Abgrenzung auch dort, betrifft die 23 % keine Personen im Rentenalter.
- ⚠️ **Kanton Bern, Sozialhilfe:** Nichtbezugsquote 26 % (Hümbelin, BFH; Quelle bisher nur Zeitschriftenartikel/Präsentation,
  Bezugsjahr und Methode am Bericht prüfen) — https://inequalities.unibe.ch/wp-content/uploads/2022/03/NichtbezugBFH_Zeso_01_22.pdf
- ⚠️ Hümbelin 2016, Working Paper: internationale Spanne 20–60 % — https://repec.sowi.unibe.ch/files/wp21/Huembelin-2016-NonTakeUp.pdf

### Armut (BFS, Erhebung SILC)

- ◐ **Armutsquote 2024: 8,4 %** der ständigen Wohnbevölkerung in Privathaushalten, rund 743'000 Personen; «gegenüber den
  Vorjahren nicht signifikant verändert»; Armutsgrenze im Schnitt CHF 2'388/Monat für eine Einzelperson (SKOS-basiert);
  Erwerbstätige 4,3 % — https://www.bfs.admin.ch/bfs/de/home/statistiken/wirtschaftliche-soziale-situation-bevoelkerung/soziale-situation-wohlbefinden-und-armut/armut-deprivation/armut.html
- ◐ **Armutsgefährdungsquote 2024: 16,4 %** (Schwelle 60 % des medianen verfügbaren Äquivalenzeinkommens, BFS-Hauptindikatoren).
  Die **16,2 %** an anderer Stelle sind der **europäische Vergleich ohne fiktive Miete** (Nutzungswert von Wohneigentum
  nicht im Einkommen). Immer sagen, welche der beiden Zahlen gemeint ist. (◐, Definition mit fiktiver Miete für die
  16,4 % noch an der BFS-Methodik prüfen.)
- ◐ **Einelternhaushalte 28,1 %** (Armutsgefährdung 2024, Fliesstext der BFS-Seite, «28% der Personen in
  Einelternhaushalten»); Paare ohne Kinder 6,3 %, Paare mit zwei Kindern 9,3 %, Paare mit drei und mehr Kindern 27,0 % —
  https://www.bfs.admin.ch/bfs/de/home/statistiken/wirtschaftliche-soziale-situation-bevoelkerung/soziale-situation-wohlbefinden-und-armut/armut-deprivation/armutsgefaehrdung.html
- Maschinenlesbar: BFS STAT-TAB / PxWeb (siehe unten).

### Sozialhilfe (BFS, Sozialhilfestatistik)

- ✅ **Sozialhilfequote 2024: 2,9 %** (2023: 2,8 %), rund 256'000 Personen mindestens einmal wirtschaftliche Sozialhilfe;
  BFS-Medienmitteilung vom 15.12.2025 (Neuchâtel), gelesen im Newsportal des Bundes:
  https://www.ar.admin.ch/de/newnsb/4j3hfwwf7LC5D13sAwqo5 · Methodischer Bruch: Die Anstiege in den Kantonen Tessin,
  Solothurn, Appenzell Innerrhoden und teilweise Bern gehen auf die Modernisierung der Sozialhilfestatistik zurück.
  Themenseite: https://www.bfs.admin.ch/bfs/de/home/statistiken/soziale-sicherheit/sozialhilfe.html
- ⚠️ **Je Kanton:** Tabelle «WSH: Sozialhilfequote der wirtschaftlichen Sozialhilfe nach Kanton», 2005–2024 (Stand 15.12.2025) —
  https://www.bfs.admin.ch/bfs/de/home/statistiken/soziale-sicherheit/sozialhilfe/sozialhilfebeziehende/wirtschaftliche-sozialhilfe.html

### Ergänzungsleistungen (BSV)

- ✅ **BSV, Statistik der Ergänzungsleistungen zur AHV und IV 2025**, veröffentlicht 26.05.2026, nächste Ende Mai 2027 —
  https://www.bsv.admin.ch/de/statistik-el · Je Kanton: «EL-Bezügerquote bei den EL zur AV pro Kanton, 2025»;
  PxWeb-Cubes «EL-Quoten nach EL-Stelle, 2008–2025», Ausgaben je Kanton 2000–2025.
- ⚠️ EL-Quote 2024: AV 12,2 %, IV 49,2 % (aus Suchergebnis zur BSV-Mitteilung; am PDF 2025 prüfen).

### Schulden (BFS, Betreibungs- und Konkursstatistik)

- ⚠️ **2025:** rund 3,15 Mio. eingeleitete Betreibungen, rund 3,03 Mio. Zahlungsbefehle; veröffentlicht 21.05.2026. Neue Erhebung
  ab 2025 (Weisung Nr. 10 der Oberaufsicht SchKG) → Bruch zu 2024. Zählt Erlasse, nicht Personen. https://www.bfs.admin.ch/asset/de/36579145

### Steuern (ESTV)

- ✅ **ESTV, «Steuerbelastung in den Kantonshauptorten»** — https://www.estv.admin.ch/de/steuerbelastung-in-den-kantonshauptorten
  Für natürliche Personen ist die **neueste Ausgabe 2018** (PDF/XLSX, eingestellt 8.11.2023); 2019–2021 dort nur juristische Personen.
  Die PDF-Reihe ist zu alt für einen Vergleich 2026 (für aktuelle Jahre verweist die ESTV-Seite auf einen Rechner, mit dem
  man die Belastung selbst erzeugt). Maloja hat mit `kantonaleSteuerdaten.js` und der ESTV-Stichprobe (156/156) aktuellere,
  eigene Rechenwege. Ein Steuer-Systemblick wäre Stufe 1, nicht Stufe 2.

### Maschinenzugang

- ⚠️ **BFS STAT-TAB (PxWeb API v1)**, ohne Anmeldung: `https://www.pxweb.bfs.admin.ch/api/v1/` (Angabe aus Drittquelle, an der
  BFS-Doku prüfen). opendata.swiss führt BFS-Tabellen als Ressourcen mit PxWeb-Link.
- Regel bleibt: **Abruf nur zur Bauzeit** durch ein Skript (wie `scripts/build-praemien-data.mjs`), Ergebnis mit Quelle und Datum
  ins Repo. Die App selbst fragt nie einen fremden Server.

### Rangfolge für eine erste Systemblick-Seite

1. **BAG Monitoring 2020**: gleiche Profile, amtlich, Belastung in % des Einkommens. Rahmen für unsere Musterhaushalte.
2. **Nichtbezug Basel 2022**: zeigt, wie viele Ansprüche nicht geltend gemacht werden (23 % bei der Prämienverbilligung).
3. **BSV EL-Statistik 2025**: aktuell, je Kanton, maschinenlesbar.
4. **BFS Armut SILC 2024**: Armutsquote 8,4 %; Armutsgefährdung Einelternhaushalte 28,1 % (◐; vor Veröffentlichung an der
   BFS-Tabelle gegenlesen).
5. **BFS Sozialhilfequote je Kanton 2024**: nur mit Hinweis auf den Methodenbruch.

### Offene Fragen

- BFS-Werte mit ◐ vor Veröffentlichung an den XLSX-Tabellen gegenlesen (BFS-Seiten laden nur per JavaScript).
- Lizenz: Zählt Maloja als «kommerzielle Nutzung» der BFS-Daten? (rechts-pruefer / BFS)
- BAG-Statistik KV 2024/2025: genaue Tabellennummern zur IPV je Kanton im ZIP bestimmen.
- Kommt ein BAG-Monitoring mit Daten nach 2020? Beim BAG nachfragen (gehört auch in `docs/sources/FRAGEN-AN-DIE-AEMTER.md`).
- Die BAG-Werte je Modellhaushalt und Kanton 2020 (Anhang D, ab S. 138) als Vergleichsspalte neben die Messung legen?
  Vorher nachlesen, ob «verfügbares Einkommen» dort mit unserem Netto vergleichbar ist.
- Nichtbezug Basel: Gebiet und Zählweise am Sozialhilfe-Trendbericht geprüft (Stadt Basel, ohne Rentenalter, Quote über
  Personen); den Bericht 2022 mit den 23 % noch öffnen und gegenprüfen.
