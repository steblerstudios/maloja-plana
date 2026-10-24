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
2. «Eine Studie der Berner Fachhochschule für den Kanton Basel-Stadt schätzt für 2022, dass 23 % der
   Anspruchsberechtigten in der Stadt Basel die Prämienverbilligung nicht beziehen. Die Zahl gilt für Basel, nicht
   für die Schweiz.» (Bezugsgrösse Personen oder Haushalte noch am Bericht prüfen.)
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

## Stufe 2 — Öffentliche amtliche Statistik

Kontext zu den Musterzahlen: Wie viele Menschen sind arm, beziehen Sozialhilfe, EL, Verbilligung — und wie
viele beziehen nicht, obwohl sie Anspruch hätten (Nichtbezug)?

- **Quellen:** siehe Abschnitt «Datenquellen» unten (Recherche 24.10.2026, vor Nutzung je Zahl an der
  Quelle gegenprüfen — Wahrheits-Disziplin, `CLAUDE.md`).
- **Technik:** Zahlen werden **zur Bauzeit** als kleine, datierte Tabelle mit Quelle ins Repo übernommen
  (wie `scripts/build-praemien-data.mjs`), nie zur Laufzeit von einer fremden Seite geladen. So bleibt
  CSP self-only und die App offline-fähig.
- **Lizenz:** Vor der Übernahme ganzer Tabellen je Datensatz die Nutzungsbedingungen (opendata.swiss / BFS) und die
  verlangte Quellenangabe ins Repo schreiben — noch nicht geprüft. Studien (BFH, Ecoplan) nur als Zitat mit Quelle
  (URG Art. 25), nie so, als stützten sie die Maloja-Zahlen.
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
- [ ] BFS-Werte mit ◐/⚠️ am Original bzw. an den XLSX-Tabellen nachlesen
- [ ] Lizenz je übernommenem Datensatz prüfen
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

- ✅ **Basel-Stadt, WSU, Medienmitteilung 12.02.2026** — Studie der BFH (Prof. Oliver Hümbelin) im Auftrag des WSU,
  «Nichtbezug von bedarfsabhängigen Sozialleistungen in der Stadt Basel: Berichtsjahr 2022»:
  Nichtbezugsquote **Familienmietzinsbeiträge 18 %, Prämienverbilligung 23 %, EL zur AHV 32 %, wirtschaftliche Sozialhilfe 26 %**.
  Absolute Zahl der Nichtbeziehenden gesunken bei allen ausser der Prämienverbilligung — gehört zu jedem öffentlichen Satz.
  https://www.bs.ch/medienmitteilungen/wsu/2026-neue-studie-zum-nichtbezug-von-sozialleistungen-zeigt-positive-entwicklungen ·
  Bericht: https://arbor.bfh.ch/entities/publication/ccd1e9a1-611a-42cd-b7a6-a3ed56d0fd35 ·
  Sozialhilfe 2016–2022: https://arbor.bfh.ch/entities/publication/f0df07f1-3828-4c7e-8501-40a32f66b278
  → **Gilt für die Stadt Basel** (so der Titel der Studie), nicht für die Schweiz. Offen: Bezugsgrösse (Personen oder
  Haushalte) und ob Riehen/Bettingen enthalten sind — am Bericht prüfen.
- ⚠️ **Kanton Bern, Sozialhilfe:** Nichtbezugsquote 26 % (Hümbelin, BFH; Quelle bisher nur Zeitschriftenartikel/Präsentation,
  Bezugsjahr und Methode am Bericht prüfen) — https://inequalities.unibe.ch/wp-content/uploads/2022/03/NichtbezugBFH_Zeso_01_22.pdf
- ⚠️ Hümbelin 2016, Working Paper: internationale Spanne 20–60 % — https://repec.sowi.unibe.ch/files/wp21/Huembelin-2016-NonTakeUp.pdf

### Armut (BFS, Erhebung SILC)

- ◐ **Armutsquote 2024: 8,4 %** der ständigen Wohnbevölkerung in Privathaushalten, rund 743'000 Personen; «gegenüber den
  Vorjahren nicht signifikant verändert»; Armutsgrenze im Schnitt CHF 2'388/Monat für eine Einzelperson (SKOS-basiert);
  Erwerbstätige 4,3 % — https://www.bfs.admin.ch/bfs/de/home/statistiken/wirtschaftliche-soziale-situation-bevoelkerung/soziale-situation-wohlbefinden-und-armut/armut-deprivation/armut.html
- ◐ **Armutsgefährdungsquote 2024: 16,4 %** (Schwelle 60 % des medianen verfügbaren Äquivalenzeinkommens, BFS-Hauptindikatoren).
- ⚠️ **Einelternhaushalte 28,1 %**, Paare mit zwei Kindern 9,3 % (Armutsgefährdung 2024); eine andere Stelle nennt gesamt
  16,2 % «ohne fiktive Miete» — beides am Original klären —
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
4. **BFS Armut SILC 2024**: Armutsquote 8,4 %; Einelternhaushalte erst nach Prüfung am Original.
5. **BFS Sozialhilfequote je Kanton 2024**: nur mit Hinweis auf den Methodenbruch.

### Offene Fragen

- BFS-Werte mit ◐/⚠️ am Original bzw. an den XLSX-Tabellen nachlesen (Einelternhaushalte 28,1 %; 16,4 % vs. 16,2 %).
- BAG-Statistik KV 2024/2025: genaue Tabellennummern zur IPV je Kanton im ZIP bestimmen.
- Kommt ein BAG-Monitoring mit Daten nach 2020? Beim BAG nachfragen (gehört auch in `docs/sources/FRAGEN-AN-DIE-AEMTER.md`).
- Die BAG-Werte je Modellhaushalt und Kanton 2020 (Anhang D, ab S. 138) als Vergleichsspalte neben die Messung legen?
  Vorher nachlesen, ob «verfügbares Einkommen» dort mit unserem Netto vergleichbar ist.
- Nichtbezug Basel: Bezugsgrösse und Gebiet (Stadt / Kanton) am Bericht prüfen.
