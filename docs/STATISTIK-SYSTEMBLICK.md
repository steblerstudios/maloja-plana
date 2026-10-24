# Systemblick — Zahlen zum System, ohne Zahlen über Menschen

> **Status:** Konzept, Entwurf 24.10.2026 · **nicht freigegeben** · Grundsatzentscheid durch Stebler Studios offen.
> Abgrenzung: [`STATISTIK.md`](STATISTIK.md) zählt *Besuche* (Server-Logs des Hosters). Dieses Dokument
> handelt von *sozioökonomischen* Zahlen: Wie behandelt das Schweizer System Haushalte, und wo fallen sie durch?

## Haltung

Maloja sammelt **keine Nutzerdaten** — auch nicht für eine gute Sache. Das Versprechen «die App sendet
nichts» (CSP self-only, kein Backend live, [`BACKEND_FUER_MICH.md`](../BACKEND_FUER_MICH.md)) bleibt.
Statistik entsteht darum zuerst **ohne eine einzige Person**:

1. aus **Musterhaushalten**, die durch die amtlich belegten Rechenmodelle laufen, die Maloja schon hat, und
2. aus **öffentlichen amtlichen Statistiken** (BFS, BAG, BSV, SECO, ESTV, Kantone).

Erst wenn eine Frage damit nachweislich nicht beantwortbar ist, kommt Stufe 3 (freiwillige Beiträge) als
eigener Grundsatzentscheid auf den Tisch.

## Wofür (Entscheid Stebler Studios, 24.10.2026: alle vier)

| Zweck | Beispiel-Frage | Stufe |
|---|---|---|
| **Politische Argumente** (Petitionen, Medien) | «Wie gross ist die Spanne bei der Prämienverbilligung für denselben Haushalt?» | 1 + 2 |
| **Orientierung für Nutzer** | «Wo stehe ich im Vergleich zu Haushalten wie meinem?» | 2 (lokal gerechnet) |
| **Systemlücken zeigen** | «Für wen kann niemand eine Zahl nennen, weil das System es nicht erlaubt?» | 1 |
| **Maloja verbessern** | «Für welche Haushalte zeigt Maloja selbst keine Zahl?» | 1 |

## Stufe 1 — Systemblick: Musterhaushalte durch die Kantonsmodelle (Prototyp gebaut)

- **Was:** Die **sieben Modellhaushalte des BAG-Monitorings** (Monitoring 2020, Abb. K-2, mit deren
  Bruttoeinkommen) werden durch alle 26 IPV-Kantonsmodelle gerechnet — dieselben Module, die der Rechner
  nutzt (`config/cantonalData.js` → `IPV_MODULE`, Belege in `docs/sources/ipv-kantone-2026.md`). Damit
  schliessen die Zahlen an die amtliche Reihe an (letzte Daten: 2020).
- **Code:** `src/data/systemblick.js` · Tests `src/data/__tests__/systemblick.test.js` ·
  Messung `node scripts/systemblick-messen.mjs` → [`MESSUNG-systemblick-ipv-bag-2026-10-24.md`](MESSUNG-systemblick-ipv-bag-2026-10-24.md).
- **Daten:** keine neuen. Jede Zahl ist das, was der Maloja-Rechner einer Person mit genau diesem Profil zeigen würde.
- **Nicht in der App sichtbar.** Kein Route, kein Menü, keine Übersetzung. Ein sichtbarer «Systemblick»
  ist ein eigener Schritt nach Freigabe und Prüfung (siehe «Bevor etwas öffentlich wird»).

### Befunde aus der Messung vom 24.10.2026, BAG-Modellhaushalte (Prototyp; swiss-precision-Prüfung 24.10.2026 eingearbeitet)

- **Maloja rechnet 2 von 7 BAG-Haushalten.** BAG 1 (Rentnerin) und BAG 3 (Einelternfamilie). Die übrigen fünf
  stehen in allen 26 Kantonen auf «keine Zahl»:
  - **zwei Erwachsene** (BAG 2, 4, 5, 7): in 24 Kantonen bricht das Modell am Riegel `mehrereErwachsene` ab;
  - **junge Erwachsene 19–25** (BAG 6): eigene Kategorie, oft an eine Ausbildung gebunden, nach der die App nicht fragt;
  - TG und JU halten in allen Fällen schon vorher an der Steuergrösse an (siehe unten).
  Das ist die grösste Lücke **in Maloja**: Fünf der sieben Haushaltstypen, mit denen das BAG die Wirksamkeit misst,
  bekommen keine Zahl. → eigener Backlog-Punkt, Voraussetzung für einen vollständigen Systemblick.
- **Spanne Einelternfamilie (BAG 3, Brutto 60'000, zwei Kinder):** Verbilligung von CHF 1'946 (UR) bis CHF 7'344 (GE)
  pro Jahr in den 16 Kantonen mit Betrag, Median CHF 4'313. Verbilligter Anteil der Haushaltsprämie: 28 % (SH) bis
  76 % (ZG), Median 52 %. Zum Vergleich BAG 2020 über **alle** sieben Haushalte: 37 % der «Mittleren Prämie» (S. 13) —
  **nicht vergleichbar**: anderes Jahr, andere Haushaltsmischung, Mittelwert statt Median, anderer Nenner (unsere
  Prämie ist weder «Standardprämie» noch «Mittlere Prämie», siehe Grenzen) und ohne Familienzulagen im Einkommen.
  Weil Prämiendefinition und Franchise vereinfacht sind (Grenze 8), ist der Anteil eine Näherung.
- **Rentnerin (BAG 1, Rente 45'000):** nach dem Maloja-Modell in 10 Kantonen kein Anspruch, in 12 zwischen CHF 312 (BS)
  und CHF 1'490 (AI). Gerechnet ohne Abzüge und mit Vermögen 0 — beides beeinflusst gerade hier das Ergebnis stark.
- **TG und JU:** Die Kantone stützen sich wie fast alle auf Steuerdaten (BAG S. 11). Maloja nennt dort bewusst keine
  Zahl, weil das Kantonsmodell eine Steuergrösse braucht (Steuerbetrag bzw. steuerbares Einkommen), die die App nicht
  verlässlich schätzen kann. Das ist ein Entscheid von Maloja, keine Eigenschaft des Systems.
- **Kinder:** AG, GR und TI zeigen für die Einelternfamilie bewusst keine Zahl (`agKinder`, `grKinder`, `tiKinder`),
  NW, GL, BL nicht (`mindestanspruch`), SZ nicht (`szKinderMindestanspruch`). Gründe je Zelle stehen in der Messung.

### Grenzen, die jede Darstellung nennen muss

1. **Kein amtlicher Kantonsvergleich.** Maloja rechnet mit Nettolohn ×12; jeder Kanton mit seinem eigenen
   massgebenden Einkommen (oft aus der Steuerveranlagung, mit Abzügen). Die Spanne zeigt, wie
   verschieden die *Regeln* wirken — nicht, was eine konkrete Person bekommt.
2. **Ein Ort je Kanton** (Hauptort). In Kantonen mit Prämienregionen gilt der Betrag nur dort.
3. **«Keine Zahl» ist nie 0** und zählt nicht in Median, Minimum, Maximum (Test erzwingt das).
4. **Stand** = Stand der Kantonsmodelle (2026). Ab 2027 neu messen, mit Datum im Dateinamen.
5. **Von Maloja gesetzt**, nicht vom BAG: Geburtsjahre, Kinderalter ganzzahlig (BAG «3.5» → 3), Netto aus Brutto
   mit dem App-Richtwert (`bruttoZuNettoRichtwert`), Rente = AHV-Maximalrente 2026 + BVG-Rest, Franchise 300, kein 13.
   (Ab Dezember 2026 kommt die 13. AHV-Altersrente dazu — an der Summe von 45'000 ändert das nichts, nur an der
   Aufteilung AHV/BVG; nicht an einer Quelle geprüft.)
6. **Vermögen 0.** Alle Kantone rechnen einen Teil des steuerbaren Vermögens ins massgebende Einkommen (BAG S. 11).
   Das BAG nennt für die Modellhaushalte in Anhang B (S. 131–134) keine Vermögensannahme. Mit Vermögen fiele die
   Verbilligung tiefer aus — am stärksten bei der Rentnerin.
7. **Ohne Familienzulagen.** Das BAG zählt sie zum Nettoeinkommen (Anhang B, S. 132, Abb. B-2: Haushalt 3 + CHF 5'575);
   Maloja fragt nicht danach. Mit ihnen läge das Einkommen höher und die Verbilligung eher tiefer.
8. **Prämie** = regionale Durchschnittsprämie 2026 am Hauptort je Person, Standardmodell, alle Versicherer
   (`praemienRegionen.js`). Das ist **weder** die «Standardprämie» des Monitorings (Prämie der teuersten Region des
   Kantons) **noch** dessen «Mittlere Prämie» (im Kanton effektiv bezahlt, mit Wahlmodellen und hohen Franchisen) —
   beide BAG S. 134. Welche Franchisen der Durchschnitt mischt, ist nicht geprüft; zusammen mit Franchise 300 ist das
   Profil eine Vereinfachung. Wo ein Kantonsmodell auf die tatsächliche Prämie deckelt, kann das den Betrag verschieben.
   → Offene Frage an die Quelle: Definition der priminfo-Spalte (Franchise-Mischung) beim BAG klären.

### Ausbau Stufe 1 (Ideen, nicht beschlossen)

- Dieselbe Mechanik für **Sozialhilfe** (SKOS-Kern, `data/sozialhilfeKern.js`), **Steuern**
  (`kantonaleSteuerdaten.js`, ESTV-Stichprobe), **Mietzinsbeiträge** — wo belegt.
- **Schwelleneffekte:** Bei welchem Lohn kippt ein Haushalt aus der Verbilligung, und was bleibt netto übrig
  («Lohnerhöhung, die nichts bringt»)? Braucht Steuer + IPV + Sozialhilfe zusammen — erst nach swiss-precision-Prüfung.
- **Paare und junge Erwachsene** erst, wenn die Kantonsmodelle sie rechnen können (5 von 7 BAG-Haushalten).

## Stufe 2 — Öffentliche amtliche Statistik

Kontext zu den Musterzahlen: Wie viele Menschen sind arm, beziehen Sozialhilfe, EL, Verbilligung — und wie
viele beziehen nicht, obwohl sie Anspruch hätten (Nichtbezug)?

- **Quellen:** siehe Abschnitt «Datenquellen» unten (Recherche 24.10.2026, vor Nutzung je Zahl an der
  Quelle gegenprüfen — Wahrheits-Disziplin, `CLAUDE.md`).
- **Technik:** Zahlen werden **zur Bauzeit** als kleine, datierte Tabelle mit Quelle ins Repo übernommen
  (wie `scripts/build-praemien-data.mjs`), nie zur Laufzeit von einer fremden Seite geladen. So bleibt
  CSP self-only und die App offline-fähig.
- **Orientierung für Nutzer** («Haushalte wie deiner») wird **lokal** gerechnet: die öffentliche Tabelle liegt
  im Bundle, das eigene Profil verlässt das Gerät nicht.

## Stufe 3 — Freiwillige, grobe Beiträge (nur bei echtem Bedarf, eigener Grundsatzentscheid)

Nur falls eine Frage weder Stufe 1 noch 2 beantworten kann (z. B. «Wie viele Maloja-Nutzende haben einen
Anspruch, den sie nicht geltend machen?»). Mindestregeln, falls es je so weit kommt:

- **Ausdrückliches Ja pro Beitrag**, Vorschau des exakten Inhalts vor dem Senden. Standard: aus.
- **Grobe Klassen**, auf dem Gerät gebildet (Kanton, Haushaltstyp, Einkommensband, «Anspruch ja/nein/offen»),
  nie Rohwerte, kein Geburtsdatum, keine PLZ.
- **Keine Kennung, keine IP-Speicherung, kein Zeitstempel genauer als der Monat.**
- **Veröffentlichung erst ab Mindestgrösse** je Gruppe (z. B. 20), sonst «zu wenige Angaben».
- Optional **lokales Verrauschen** (Randomized Response), damit eine einzelne Antwort nichts beweist.
- Braucht ein Backend (`maloja-server`, heute nicht live) → Sicherheits-Review, rechts-pruefer (nDSG: echte
  Anonymisierung vs. Pseudonymisierung), Anpassung Datenschutzerklärung. **Nicht vor 2027.**

## Bevor etwas öffentlich wird

- [ ] Grundsatzentscheid Stebler Studios zu diesem Konzept
- [ ] `swiss-precision-pruefer` über `systemblick.js` und die Messung (Musterwerte, Lesart der Grenzen)
- [ ] `rechts-pruefer`: Disclaimer-Text für eine öffentliche Spanne («kein Anspruch, keine Zusage»)
- [ ] `copy-pruefer`: ruhiger, nicht anklagender Ton — Systemblick zeigt Regeln, keine Schuldigen
- [ ] Sichtbare Seite: 5 Sprachen, a11y, Tabelle mit Textalternative, Quelle und Stand an jeder Zahl
- [ ] Für Petitionen: Zahlen nur mit Stand, Methode und Link auf dieses Dokument verwenden

## Datenquellen (Stufe 2)

Recherche 24.10.2026. **Prüfstand je Zeile:**
✅ = am Original gelesen (Seite/PDF, Stelle genannt) ·
⚠️ = nur aus Suchergebnis bzw. Themenseite (BFS-Seiten laden per JavaScript und waren nicht direkt lesbar) — **vor jeder
Verwendung am Original nachlesen**, Wahrheits-Disziplin (`CLAUDE.md`). Keine Zahl dieser Liste geht ungeprüft in App oder Petition.

### Der wichtigste Fund: Das BAG rechnet selbst mit Modellhaushalten ✅

**Ecoplan im Auftrag des BAG, «Wirksamkeit der Prämienverbilligung – Monitoring 2020», Schlussbericht Mai 2022**
(Daten 2020, veröffentlicht 31.05.2022) — https://www.bag.admin.ch/dam/de/sd-web/QNNLxS1AH4Nb/monitoring-2020-wirksamkeit-pv.pdf ·
Übersicht aller Berichte: https://www.bag.admin.ch/de/krankenversicherung-monitoring-praemienverbilligung

- **Methode = Systemblick:** «sieben Modellhaushalte» je Kanton, «in wirtschaftlich bescheidenen Verhältnissen ohne Anspruch
  auf EL oder Sozialhilfe» (S. 11–12, Abb. K-2), u. a. Einelternfamilie mit zwei Kindern, Bruttoeinkommen CHF 60'000.
  → Umgesetzt am 24.10.2026: Der Systemblick rechnet genau diese sieben (siehe Stufe 1).
- **Befund 2020:** verbleibende Prämienbelastung im Schnitt über alle Kantone und Modellhaushalte **13.7 % des verfügbaren
  Einkommens** mit «Standardprämie», **9.4 %** mit «Mittlerer Prämie»; tiefste ZG (7 % / 4 %), höchste NE (19 % / 15 %) (S. 13).
- **Zielgrösse des Bundesrats** (Botschaft 1991): Bei Belastung mit der «Mittleren Prämie» werden die Zielwerte «für rund
  20 % der Modellhaushalte erfüllt» (S. 13); mit der «Standardprämie» nur in ZG und GR für einige Haushalte.
- **Bezug 2020:** «rund 2.4 Millionen Personen», Bezugsquote 28 %; Ausgaben rund 5.5 Mrd. CHF, Kantonsanteil im Schnitt 48 % (S. 9).
- **Lücke:** neuer Bericht seit 2022 nicht angekündigt (Rhythmus bisher alle drei bis vier Jahre). Daten 2020 sind alt —
  der Systemblick kann hier mit Stand 2026 etwas zeigen, das amtlich fehlt.

### Prämienverbilligung (Bezug, Beträge je Kanton)

- ✅ **BAG, Statistik der obligatorischen Krankenversicherung** — https://www.bag.admin.ch/de/statistik-der-obligatorischen-krankenversicherung
  Ausgabe 2024 vollständig (110 Tabellen, 19.01.2026); Ausgabe 2025 «unvollständig: 80 T.» (29.09.2026). Nur XLSX (ZIP),
  «Ab der Ausgabe 2023 ist nur das Excel-Format verfügbar»; ältere Ausgaben auf opendata.swiss. Welche Tabelle IPV-Bezug
  je Kanton enthält: im ZIP nachsehen (nicht geprüft).
- ⚠️ **BAG Dashboard Krankenversicherung** (u. a. ausbezahlter Betrag pro beziehende Person nach Kanton) — https://kvd.bag.admin.ch/de/premium/statistic

### Nichtbezug (wer Anspruch hätte und nicht bezieht)

- ✅ **Basel-Stadt, WSU, Medienmitteilung 12.02.2026** — Studie der BFH (Prof. Oliver Hümbelin), Berichtsjahr 2022:
  Nichtbezugsquote **Familienmietzinsbeiträge 18 %, Prämienverbilligung 23 %, EL zur AHV 32 %, wirtschaftliche Sozialhilfe 26 %**.
  Absolute Zahl der Nichtbeziehenden gesunken bei allen ausser der Prämienverbilligung.
  https://www.bs.ch/medienmitteilungen/wsu/2026-neue-studie-zum-nichtbezug-von-sozialleistungen-zeigt-positive-entwicklungen ·
  Bericht: https://arbor.bfh.ch/entities/publication/ccd1e9a1-611a-42cd-b7a6-a3ed56d0fd35 ·
  Sozialhilfe 2016–2022: https://arbor.bfh.ch/entities/publication/f0df07f1-3828-4c7e-8501-40a32f66b278
  → Für Petitionen die stärkste Zahl. **Gilt für die Stadt Basel**, nicht für die Schweiz — immer so nennen.
- ⚠️ **Kanton Bern, Sozialhilfe:** Nichtbezugsquote 26 % (Hümbelin, BFH; Quelle bisher nur Zeitschriftenartikel/Präsentation,
  Bezugsjahr und Methode am Bericht prüfen) — https://inequalities.unibe.ch/wp-content/uploads/2022/03/NichtbezugBFH_Zeso_01_22.pdf
- ⚠️ Hümbelin 2016, Working Paper: internationale Spanne 20–60 % — https://repec.sowi.unibe.ch/files/wp21/Huembelin-2016-NonTakeUp.pdf

### Armut (BFS, Erhebung SILC)

- ⚠️ **Armutsquote 2024: 8,4 %**, rund 743'000 Personen; Armutsgrenze im Schnitt CHF 2'388/Monat für eine Einzelperson;
  Erwerbstätige 4,3 % — https://www.bfs.admin.ch/bfs/de/home/statistiken/wirtschaftliche-soziale-situation-bevoelkerung/soziale-situation-wohlbefinden-und-armut/armut-deprivation/armut.html
- ⚠️ **Armutsgefährdung 2024:** Gesamt 16,4 % (andere Stelle nennt 16,2 % «ohne fiktive Miete» — klären); **Einelternhaushalte 28,1 %**,
  Paare mit zwei Kindern 9,3 % — https://www.bfs.admin.ch/bfs/de/home/statistiken/wirtschaftliche-soziale-situation-bevoelkerung/soziale-situation-wohlbefinden-und-armut/armut-deprivation/armutsgefaehrdung.html
- Maschinenlesbar: BFS STAT-TAB / PxWeb (siehe unten).

### Sozialhilfe (BFS, Sozialhilfestatistik)

- ⚠️ **Sozialhilfequote 2024: 2,9 %** (2023: 2,8 %), rund 256'000 Personen; Medienmitteilung 15.12.2025. Methodischer Bruch:
  Statistik wird modernisiert, Anstiege in TI, SO, AI und teils BE «auf die methodischen Anpassungen … zurückzuführen».
  https://www.bfs.admin.ch/bfs/de/home/statistiken/soziale-sicherheit/sozialhilfe.html
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

1. **BAG Monitoring 2020**: gleiche Methode, amtlich, Belastung in % des Einkommens. Rahmen und Vergleich für unsere Musterhaushalte.
2. **Nichtbezug Basel-Stadt 2022**: zeigt, dass Ansprüche nicht ankommen (23 % bei der Prämienverbilligung).
3. **BSV EL-Statistik 2025**: aktuell, je Kanton, maschinenlesbar.
4. **BFS Armutsgefährdung SILC 2024**: Einelternhaushalte 28,1 %. Passt zu unserem Musterhaushalt «alleinerziehend».
5. **BFS Sozialhilfequote je Kanton 2024**: nur mit Hinweis auf den Methodenbruch.

### Offene Fragen

- BFS-Werte (Armut, Sozialhilfe) am Original bzw. an den XLSX-Tabellen nachlesen: Die Seiten waren für das Recherche-Werkzeug nicht lesbar.
- Armutsgefährdung gesamt 2024: 16,4 % oder 16,2 %? Unterschiedliche Definition (fiktive Miete) klären.
- BAG-Statistik KV 2024/2025: genaue Tabellennummern zur IPV je Kanton im ZIP bestimmen.
- Kommt ein BAG-Monitoring mit Daten nach 2020? Beim BAG nachfragen (gehört auch in `docs/sources/FRAGEN-AN-DIE-AEMTER.md`).
- Die BAG-Werte je Modellhaushalt und Kanton 2020 (Anhang D, ab S. 138) als Vergleichsspalte neben die Messung legen?
  Das zeigt, wie sich die Lage seit 2020 verändert hat. Vorher nachlesen, ob «verfügbares Einkommen» dort mit unserem Netto vergleichbar ist.
