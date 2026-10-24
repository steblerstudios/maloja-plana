# Befund · zwei offene Quellen der Stufe 2 — 2026-10-24

> Gehört zu [`STATISTIK-SYSTEMBLICK.md`](STATISTIK-SYSTEMBLICK.md), Abschnitte «Nichtbezug» und «Ergänzungsleistungen»
> sowie Kernsatz 2. Ergänzt den Commit `6b72b91f`, der den Bericht 2022 nicht öffnen konnte. Intern.

## 1. Nichtbezug Basel 2022 — ✅ Bericht gelesen

**Quelle:** Hümbelin, Elsener, Lehmann, «Nichtbezug von bedarfsabhängigen Sozialleistungen in der Stadt Basel -
Berichtsjahr 2022», Schlussbericht im Auftrag des Amts für Sozialbeiträge des Kantons Basel-Stadt, BFH mit econcept,
29. Januar 2026. https://doi.org/10.24451/arbor.13015 · PDF «NBBS_EL_FAMI_IPV_Berichtsjahr_2025_290126.pdf» (4.71 MB),
MD5 `c4c2b3b4035b6826f18988e5cb8b4581` = Angabe im Repositorium. Gelesen S. 1–19.

**Gebiet und Population (S. 9–10, Tabelle 2):**
- **Nur die Stadt Basel.** Ausgeschlossen: «Personen aus Riehen und Bettingen» (22'754), dazu «Quellenbesteuerte»
  (12'600), Kollektivhaushalte (4'680), mangelhafte Wohninformation, Kinder/junge Erwachsene ohne Eltern in BS, fehlende
  Steuerinformation. Untersuchungspopulation 160'111 von 197'107.
  - Die englische Zusammenfassung im Repositorium sagt «Canton of Basel-Stadt». Der Bericht selbst sagt Stadt Basel.
    **Massgebend ist der Bericht.**
- **Prämienverbilligung: alle Altersgruppen.** «Untersuchungspopulation PV (ohne Zuzug im laufenden Jahr)» 149'635
  (Tabelle 3, S. 14); «Prämienverbilligungen sind für praktisch alle gedacht» (S. 13).
  → **Korrektur an `6b72b91f`:** Die Vermutung «dieselbe Reihe grenzt für die 23 % wohl wie die Sozialhilfe-Studie ab
  (ohne Rentenalter)» trifft **nicht** zu. Die 23 % schliessen Personen im Rentenalter ein. Ausgeschlossen sind dafür
  Quellenbesteuerte.

**Zählweise (S. 14, 3.6):** «Bei allen nachfolgend gezeigten Analysen erfolgt die Prüfung der Anspruchsberechtigung auf
Ebene der wirtschaftlichen Haushaltseinheit. Die Resultate beziehen sich aber auf Personen.»

**Die Zahlen (Tabelle 4 S. 15, Abb. 1 S. 16, Tabelle 5 S. 17), Prämienverbilligung:**

| | 2015 | 2022 |
|---|---:|---:|
| Anspruchsberechtigte (rechnerisch, Personen) | 57'273 | 58'222 |
| davon Beziehende | 34'424 (60.1 %) | 35'937 (61.7 %) |
| davon Sozialhilfebeziehende (zählen als Beziehende) | 10'974 (19.2 %) | 8'835 (15.2 %) |
| davon **Nichtbeziehende** | 11'875 (**20.7 %**) | 13'450 (**23.1 %**) |

- **Der Anstieg ist ein Mischungseffekt.** S. 16: Die Quote ist gestiegen, «nicht, weil insgesamt anteilsmässig weniger
  Personen direkt eine Prämienverbilligung erhalten, sondern weil anteilsmässig weniger Personen in der Sozialhilfe sind.»
  Der direkte Bezug stieg sogar (60.1 % → 61.7 %). **Ein Satz wie «der Nichtbezug nimmt zu» wäre irreführend**, wenn
  dieser Zusatz fehlt.
- **Geschätzt, nicht gezählt.** S. 3: «Da nicht für alle Bestandteile der Anspruchsprüfung gleich gute Daten vorliegen,
  können Nichtbezugsquoten nur geschätzt werden.» Die Werte für 2015 sind eine neue «Replikationsschätzung» und weichen
  von der Vorgängerstudie ab (S. 3 Fussnote 4, S. 8).

**Nach Haushaltstyp (Abb. 2, S. 19, PV 2022):**

| Haushaltstyp | Nichtbezug PV |
|---|---:|
| Einzelpersonen in Mehrpersonenhaushalten | 38.5 % (n = 4'605) |
| Verheiratete/registrierte Paare ohne Kinder | 31.5 % (n = 1'883) |
| Paare ohne Kinder in Mehrpersonenhaushalten | 28.0 % (n = 656) |
| Einpersonenhaushalte | 24.4 % (n = 3'594) |
| Einelternhaushalte mit minderjährigen Kindern, in Mehrpersonenhaushalten | 18.7 % (n = 240) |
| **Einelternhaushalte mit minderjährigen Kindern** | **10.7 %** (n = 468) |
| Paare mit nur minderjährigen Kindern | 10.5 % (n = 1'171) |

(Weitere Typen in Abb. 2. Werte am Balkenbild abgelesen.)

**Was daraus für Maloja folgt:**
- **Die 23 % nie neben eine Familie stellen.** Für Einelternhaushalte, also den Typ von H3, liegt der Nichtbezug in der
  Stadt Basel bei **10.7 %**. Der Durchschnitt wird von Einzelpersonen und kinderlosen Paaren getragen. Kernsatz 1 (H3)
  und Kernsatz 2 (23 %) sollten darum **nicht im selben Atemzug** stehen, sonst entsteht ein falscher Eindruck.
- **Vorschlag für Kernsatz 2, neu:** «Eine Studie der Berner Fachhochschule schätzt, dass 2022 in der Stadt Basel 23 %
  der rechnerisch Berechtigten keine Prämienverbilligung bezogen (ohne Riehen, Bettingen und Quellenbesteuerte). Bei
  Paaren und Alleinerziehenden mit minderjährigen Kindern, die ohne weitere Personen wohnen, waren es rund 11 % (in
  Mehrpersonenhaushalten 12.9 % bzw. 18.7 %, Abb. 2). Basel zahlt nur auf Antrag aus; die Zahl gilt nicht für die
  Schweiz.»
- Basel-Stadt ist ein Kanton mit «Antrag ohne Zustellung» (siehe
  [`BEFUND-quellen-kosten-senken-2026-10-24.md`](BEFUND-quellen-kosten-senken-2026-10-24.md)). Der Bericht selbst bestätigt
  das: Leistungen, «die … auf Antrag bezogen werden können» (S. 7).

## 2. EL-Quote 2024 und 2025 — ✅ am amtlichen PDF gelesen

**Quelle:** BSV, «Statistik der Ergänzungsleistungen zur AHV und IV 2025», Jahresbericht Mai 2026 (veröffentlicht
26.05.2026), https://www.bsv.admin.ch/dam/de/sd-web/pOeXq3eVysUG/el_stat_2025_d.pdf, S. 1–4.

- **Definition (S. 4):** «Die Bezugsquote ist definiert als der prozentuale Anteil der Rentnerinnen und Rentner in der
  Schweiz, die eine EL beziehen.» Der Nenner sind also die Rentenbeziehenden, nicht die Bevölkerung.
- **Tabelle T1 (S. 2), EL-Quote in %:**

| Jahr | Total | EL zur AV | EL zur IV | EL-Beziehende total |
|---|---:|---:|---:|---:|
| 2023 | 16.4 | 12.3 | 50.1 | 350'000 |
| 2024 | 16.2 | **12.2** | **49.2** | 350'900 |
| 2025 | 16.4 | 12.3 | 49.8 | 361'200 |

- **Das ⚠️ im Konzept ist bestätigt:** «EL-Quote 2024: AV 12,2 %, IV 49,2 %» stimmt (T1 und Fliesstext S. 2).
- **Unstimmigkeit in der Quelle selbst:** Der Kasten auf S. 1 nennt für Ende 2025 «12,2 Prozent der AHV-» und
  361 210 Personen. Tabelle T1 und S. 4 nennen für die AV 2025 **12,3 %** und runden auf 361 200. Vermutlich umfasst «AHV»
  im Kasten auch die Hinterlassenenversicherung, das ist aber nicht geprüft. **Für Maloja: die Zahl aus T1 (12.3 %, «EL zur
  AV») nehmen und so benennen.**
- **Zum Lesen:** Ab 2024 gilt die EL-Reform für alle. Das BSV erklärt den Rückgang 2024 und den Anstieg 2025
  ausdrücklich mit «vermutlich» durch die Reform (S. 2, S. 4). Keine Trendaussage über 2023–2025 ohne diesen Hinweis.
