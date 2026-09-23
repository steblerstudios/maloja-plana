# Prämienverbilligung (IPV) 2026 — amtliche Belege je Kanton

Stand der Recherche: **16.09.2026** (alle Quellen an diesem Tag abgerufen).
Betrifft `CANTONAL_IPV` und `calculateIPV()` in `src/config/cantonalData.js`
(Bau-Liste M13, Entscheid E9; Befund «Swiss 2» in `docs/audits/voll-review-L-2026-09-15.md`).

Zweck: Grundlage, um die heute zurückgehaltenen IPV-Beträge Kanton für Kanton wieder
freizugeben — **nur** dort, wo das kantonale Rechenmodell und seine Zahlen amtlich belegt
sind. Dieses Dokument ändert keinen Code.

## Regeln dieser Erhebung

- Als Beleg zählen nur amtliche Quellen: kantonales Gesetz/Verordnung, Regierungsratsbeschluss,
  Merkblatt, Wegleitung oder Rechner der zuständigen kantonalen Stelle bzw. Ausgleichskasse/SVA.
  Keine Vergleichsportale, keine Zeitungen, keine KI-Zusammenfassungen.
- Zitate sind wörtlich und in der Originalsprache. Zahlen ohne Beleg stehen als «nicht belegt»,
  nicht als Schätzung.
- **Beurteilung:**
  - **abbildbar** — Modell und Zahlen reichen, um in der App einen Betrag nach Kantonsmodell zu rechnen.
  - **teilweise** — Modell bekannt, Zahlen unvollständig (oder nur 2025 gefunden).
  - **nicht belegt** — Modell oder Zahlen nicht amtlich auffindbar.
- «abbildbar» heisst nicht «mit dem heutigen App-Modell abbildbar»: die App rechnet heute
  einen einheitlichen linearen Abbau (voller Betrag bei Einkommen 0, null bei `maxIncome`),
  den kein Kanton so kennt. Wer einen Kanton freigibt, muss dessen Modell nachbauen.
- Werte ändern sich jährlich (Richtprämien, Prozentsätze, Grenzen). Vor jeder Freigabe den
  Stand an der Quelle erneut prüfen; ab Herbst 2026 erscheinen die Werte für 2027.

**Erfasst:** 26 von 26 Kantonen. 21× abbildbar · 5× teilweise

## Übersicht

| Kt. | Kanton | Modell | Abbildbar? | Hauptquelle |
|---|---|---|---|---|
| ZH | Zürich | Referenzprämie (70 % der regionalen Durchschnittsprämie) minus Eigenanteil 8,4 % (Alleinstehende/Alleinerziehende) bzw. 10,5 % (Verheiratete) des massgebenden Einkommens; 3 Prämienregionen; Vermögensgrenze 150'000 / 300'000 | abbildbar | <https://svazurich.ch/unsere-produkte/weitere-produkte/krankenversicherung--kvg-/praemienverbilligung/leistung.html> |
| BE | Bern | Stufentabelle: fester Monatsbetrag je Prämienregion (3), Altersgruppe und Einkommensstufe (bis 9'000 / 17'000 / 25'000 / 35'000; Familien bis 45'000); Kinder und junge Erwachsene in Ausbildung Pauschalbetrag | abbildbar | <https://www.asv.dij.be.ch/content/dam/asv_dij/dokumente/de/pr%C3%A4mienverbilligung--informationen/Berechnungsschema%202026_de.pdf> |
| LU | Luzern | Richtprämie (3 Regionen) minus Selbstbehalt; der Prozentsatz beträgt 10 % + 0,00006 Prozentpunkte je Franken massgebendes Einkommen (progressiv); Kinder 80 % und junge Erwachsene in Ausbildung 50 % Verbilligung bis zu einer Familien-Einkommensgrenze; Vermögensgrenze 100'000 / 200'000 (+50'000 je Kind) | abbildbar | <https://srl.lu.ch/app/de/texts_of_law/866a> |
| UR | Uri | Summe der Richtprämien (eine Prämienregion) minus Selbstbehalt 8,5 % des PV-Einkommens (Nettoeinkünfte + 15 % des steuerbaren Vermögens); bis PV-Einkommen 90'000 Kinder mind. 80 % und junge Erwachsene in Ausbildung mind. 50 % verbilligt | abbildbar | <https://rechtsbuch.ur.ch/app/de/texts_of_law/20.2213> |
| SZ | Schwyz | Richtprämie (90 % der EL-Durchschnittsprämie, eine Region) minus Selbstbehalt 11 % des anrechenbaren Einkommens; Anspruch nur, wenn das anrechenbare Einkommen unter Durchschnittsprämie + EL-Lebensbedarf + EL-Mietzins liegt (Stufe/Klippe, kein Auslaufen auf 0); Kinder mind. 80 %, junge Erw. in Ausbildung mind. 50 % | teilweise (Betragsformel und alle Zahlen 2026 belegt; die Anspruchsgrenze hängt aber von EL-Lebensbedarf und EL-Mietzinsregion ab und ist amtlich nur als «minimales Höchsteinkommen» für Mietzinsregion 3 / Kinder unter 11 publiziert) | <https://www.sz.ch/public/upload/assets/6155/361_100.pdf> |
| OW | Obwalden | Richtprämie − Selbstbehalt (9,5 % des anrechenbaren Einkommens bis CHF 35'000, darüber +0,01 %-Punkt je CHF 100); Anspruch nur bei anrechenbarem Einkommen < CHF 50'000 (mit Kindern +25'000 = < 75'000); Mindestanspruch Kinder 80 %, junge Erwachsene in Ausbildung 50 % | abbildbar | <https://gdb.ow.ch/app/de/texts_of_law/851.12> |
| NW | Nidwalden | Selbstbehalt 10 % der «Summe der Steuerwerte» (Reineinkommen + Aufrechnungen + 20 % Reinvermögen); IPV = Richtprämie − Selbstbehalt; Kinder 80 % (Eltern ≤ CHF 100'000), junge Erwachsene in Ausbildung 50 % | abbildbar | <https://gesetze.nw.ch/app/de/texts_of_law/742.111> |
| GL | Glarus | Richtprämie − Selbstbehalt; Selbstbehalt in Stufen 9–14 % des ganzen anrechenbaren Einkommens (bis 40'000: 9 % … über 80'000: 14 %); Kinder mind. 80 %, junge Erwachsene in Ausbildung mind. 50 % bei Haushalts-AE ≤ CHF 85'000; Richtprämie = 85 % (Kinder 100 %) der EDI-Durchschnittsprämie | teilweise | <https://gesetze.gl.ch/app/de/texts_of_law/VIII%20D/21/3> |
| ZG | Zug | Richtprämien − Selbstbehalt 8 % des massgebenden Einkommens; reduzierter Anspruch bei ME 70'000–89'900 (−0,5 % je CHF 100 über 70'000), darüber kein Anspruch; tiefere Grenzen für Einzelpersonen (Betrag nicht publiziert gefunden); Kinder/junge Erw. in Ausbildung mind. 80 % / 50 % | teilweise | <https://www.akzug.ch/uploads/PDF-sonstige/Broschuere_IPV_2026.pdf> |
| FR | Freiburg | Prozent der regionalen Durchschnittsprämie (1 %–65 %) nach Tabelle, abhängig davon, um wie viel Prozent das anrechenbare Einkommen unter der gesetzlichen Grenze liegt (Einzelperson 37'000; Paar 65'000; Alleinerziehende 43'400; +14'000 je Kind); Kinder mind. 80 %, junge Erw. in Ausbildung mind. 50 %; 2 Prämienregionen | abbildbar | <https://assets.caisseavsfr.ch/Htdocs/Files/v/c24c23cead959f6952ac7c90174e13792ee122b03d8191e785de70ac0df833dd.pdf/memento_rpi_f_2026.pdf?download=1> |
| SO | Solothurn | Richtprämie (Durchschnittsprämie −30 %) minus Eigenanteil 10–16 % des massgebenden Einkommens (linear), Grenze MGE 74'000; Kinder ≥80 %, junge Erw. ≥50 % bis 74'000 | teilweise | <https://www.akso.ch/uploads/PDF-Formulare-AKSO/IPV/2026-01-27-Verfuegung-Parameter-Individuelle-Praemie.pdf> |
| BS | Basel-Stadt | Stufentabelle: 22 Beitragsgruppen nach massgeblichem Haushaltseinkommen und Haushaltsgrösse (1–8 Pers.), fester Monatsbeitrag je Person (Erwachsene / junge Erw. / Kinder), Zuschlag bei alternativem Versicherungsmodell (AVM) | abbildbar | <https://www.gesetzessammlung.bs.ch/api/de/versions/6727/pdf_file> |
| BL | Basel-Landschaft | Jahresrichtprämie minus 7,75 % des massgebenden Jahreseinkommens, mit harter Einkommensobergrenze je Berechnungseinheit (Einzelperson 31'000); Kinder ≥80 %, junge Erw. ≥50 % der Richtprämie | abbildbar | <https://bl.clex.ch/api/de/versions/4310/pdf_file> |
| SH | Schaffhausen | Selbstbehalt: Summe der Richtprämien (2 Prämienregionen) minus 15 % des anrechenbaren Einkommens, höchstens 65 % der anrechenbaren Prämien, unter Fr. 100 keine Auszahlung | abbildbar | <https://rechtsbuch.sh.ch/api/de/versions/2086/pdf_file> |
| AR | Appenzell Ausserrhoden | Richtprämie minus Selbstbehalt 46 % von (massgebendes Einkommen − allgemeiner Lebensbedarf − 2'000 je Kind); harte Obergrenzen Einkommen (Alleinstehende 35'000) und Vermögen (120'000 / 200'000); Kinder 80 %, junge Erw. in Ausbildung 50 % der Richtprämie | abbildbar | <https://www.sovar.ch/uploads/SOVAR/Formulare/AK/Beitraege/Merkblatt-IPV-2026.pdf> |
| AI | Appenzell Innerrhoden | Richtprämie (Summe Haushalt) minus Selbstbehalt 7–12 % des massgebenden Gesamteinkommens (gestuft +0,125 %/Fr. 1'000 zwischen 45'000 und 85'000); Kinder/JE in Ausbildung Mindest-IPV 80 %/50 % der Richtprämie bis MGE 75'000 | abbildbar | <https://www.ai.ch/themen/gesundheit-alter-und-soziales/individuelle-praemienverbilligung/merkblatt-ipv/merkblatt-ipv-2024/@@download/file/Merkblatt%20IPV%202026.pdf> |
| SG | St. Gallen | Regionale Referenzprämie (3 Regionen) minus Belastungsgrenze in % des massgebenden Einkommens; Satz steigt linear pro Franken über einem Sockel (z. B. Alleinstehend ohne Kinder: 12,16 % bis 18'700, +0,0002 Prozentpunkte je Franken darüber); Vermögensgrenze 100'000; Minimalgarantie Kinder 80 % / JE in Ausbildung 50 % bis Einkommens-Obergrenze | abbildbar | <https://www.gesetzessammlung.sg.ch/api/de/versions/3847/pdf_file_with_annexes> |
| GR | Graubünden | Regionale Richtprämie (3 Regionen, 90 % der BAG-Durchschnittsprämie) minus Selbstbehalt nach Einkommenskategorie (5 % / 6,5 % / 8 % / 9 % / 10 % des anrechenbaren Einkommens); Kinder und JE in Ausbildung alternativ 100/75/50/25 % Verbilligung bis 65'000/70'000/75'000/80'000, höherer Betrag gilt | abbildbar | <https://formulare.sva.gr.ch/downloads/ipv_wegleitung_d.pdf> |
| AG | Aargau | Summe Richtprämien Haushalt minus Einkommenssatz 17,5 % × massgebendes Einkommen (bereinigtes steuerbares Einkommen + 1/5 steuerbares Vermögen − Einkommensabzug je Haushaltstyp − Fr. 2'500 je Kind/JE in Ausbildung); Kinder/JE in Ausbildung bei Anspruch mind. 50 % der effektiven Prämie | abbildbar | <https://gesetzessammlungen.ag.ch/api/de/versions/3878/pdf_file_with_annexes> |
| TG | Thurgau | Feste Pauschalbeträge nach Kategorie der **einfachen satzbestimmenden Steuer zu 100 %** (nicht nach Einkommen): Erwachsene A ≤ 400 → 3'408 · B ≤ 600 → 2'556 · C ≤ 800 → 1'704; Kinder D ≤ 1'600 (Eltern) → 1'236; nur ohne steuerbares Vermögen (Fr. 0) | teilweise | <https://www.rechtsbuch.tg.ch/api/de/versions/3027/pdf_file_with_annexes> |
| TI | Tessin | Quadratische Formel: Normbetrag = PMR − PMR × RD²/RDM², × kantonaler Koeffizient 76,5 %; RDM = Konstante × 50 % der Laps-Bedarfsgrenze | abbildbar | <https://m3.ti.ch/CAN/RLeggi/public/index.php/index/nuovafinestra/atto/370/volume//numLegge/853.100> |
| VD | Waadt | Zwei Stufen. (1) «Subside ordinaire»: Monatsbetrag nach Formel mit Parametern je Kategorie (Max. bis C, Kurve bis A, Minimum bis B, darüber 0). (2) «Subside spécifique»: Prämie (höchstens Referenzprämie) minus ordentlicher Subside, soweit über 10 % des RDU. | abbildbar | <https://www.vd.ch/fileadmin/user_upload/themes/social/Prestations__assurance_et_soutien/Assurance_maladie/Subside/Arr%C3%AAt%C3%A9_subsides_2026_du_17-12-2025_-_publi%C3%A9.pdf> |
| VS | Wallis | Degressive Einkommensskala mit 7 Klassen: 70/50/40/30/20/10/5 % der regionalen Referenzprämie (Kinder 80 %), Grenzen je Haushaltstyp (allein/Ehepaar) und Kinderzahl. EL/Sozialhilfe 100 %. | abbildbar | <https://lex.vs.ch/app/de/texts_of_law/832.105> |
| NE | Neuenburg | 15 Klassen (S1–S15) nach revenu déterminant und Haushaltstyp/Kinderzahl; fester Monats-Höchstbetrag je Klasse und Alterskategorie (% einer Referenzprämie) | abbildbar (mit Vorbehalt: Webseite und Erlass nennen ab S3 unterschiedliche Monatsbeträge, siehe «Offen») | <https://rsn.ne.ch/DATA/program/books/rsne/pdf/821.102.pdf> |
| GE | Genf | 8 Gruppen (+ Gruppe 9 nur für Kinder/junge Erwachsene) nach RDU und Haushalt; fester Monatsbetrag je Gruppe und Person (Erw. 348 → 55, junge Erw. 231, Kind 132), Grenzen +6'000 je Unterhaltspflicht | abbildbar | <https://www.ge.ch/document/baremes-categories-2026-subsides-assurance-maladie> |
| JU | Jura | Stufentabelle in 1'000er-Schritten des revenu déterminant (korrigiertes steuerbares Einkommen 2024); Erwachsene 225 → 15 CHF/Monat bis RDU 26'999; Kinder 100 und junge Erw. in Ausbildung 196 CHF pauschal bis 52'999; Vermögensgrenze 150'000; Familienzuschlag bis RDU 17'999 | abbildbar | <https://www.ecasjura.ch/Htdocs/Files/v/5f96a91e0eb5f044bed32b1e94ba290c44619d65fb5d3f26f4180819cda93fe4.pdf/Arrete-2026-avec-annexes.pdf?download=1> |

## Auffällige Befunde

- **Kein Kanton rechnet wie die App.** Die App rechnet einen einheitlichen linearen Abbau von
  `subsidySingle` (bei Einkommen 0) auf null (bei `maxIncome`), Familie = 2× Einzel, Kind = ½.
  Die Kantone nutzen entweder *Richtprämie minus Selbstbehalt in % des massgebenden
  Einkommens* (linear, aber mit kantonalen Richtprämien, Prozentsätzen und eigener Rechnung für
  Kinder/junge Erwachsene) oder *Stufentabellen* mit festen Monatsbeträgen je Person. Die
  Stufenkantone (u. a. BS, NE, GE, JU) rechnen nicht linear.
- **ZH:** Das Berechnungsbeispiel der SVA nennt als Referenzprämie Region 1 «CHF 5'776»; aus der
  regionalen Durchschnittsprämie (640 × 12 × 70 %) und den publizierten Einkommensgrenzen ergibt
  sich 5'376. An der Quelle nachgeprüft. Vermutlich Tippfehler im Beispiel — nicht übernehmen.
  Die SVA hält fest, dass die Grundlagen 2026 «bis zum Herbst 2026 noch angepasst werden» können.
- **NE:** Widerspruch zwischen Kantonsseite «Classifications et montants» (geändert 08.09.2026)
  und dem Erlass RSN 821.102 ab Klasse S3 (z. B. Erwachsene S3: Seite 515, Erlass 514). An beiden
  Quellen nachgeprüft. Kein Änderungsbeschluss gefunden. **Verbindlich bis auf Weiteres der
  Erlass**; beim OCAB nachfragen.
- **GE:** Beträge stammen aus dem amtlichen Tarif-PDF «Barème subsides 2026»; der
  Indexierungsbeschluss des Conseil d'État für 2026 (Art. 9B RaLAMal) wurde nicht gefunden. Der
  Gesetzestext enthält noch die nicht indexierten Beträge.
- **JU:** Im Arrêté-PDF steht im Textlayer der Tabellenseite zusätzlich eine verdeckte Überschrift
  «pour l'année 2025»; sichtbar steht «pour l'année 2026». Die Werte wurden am Seitenbild geprüft.
  Wer das PDF maschinell ausliest, muss das beachten.
- **AG:** Die SVA-Aargau-Seite nennt «für das Bezugsjahr 2026» Fr. 6'070 und 19,25 %, steht aber
  unter «Berechnungsbasis für die Prämienverbilligung 2027». Die Rechtssammlung (V KVGG, Anhang 1)
  nennt für 2026 Fr. 5'830 und 17,5 % — an der Quelle nachgeprüft und übernommen. Dass die
  SVA-Werte 2027 betreffen, ist eine Vermutung.
- **SZ:** Die 11 % Selbstbehalt stehen in den Merkblättern der Ausgleichskasse; der festlegende
  Kantonsratsbeschluss wurde nicht gefunden. Einkommensgrenzen sind nur für Mietzinsregion 3
  publiziert.
- **VS:** Einkommenstabelle der Ausgleichskasse («Echelle définitive RIP 2026», 19.12.2025) nennt
  für «Alleinstehende mit 1 Kind», Kinderzeile, 63'000; der Medienanhang vom 03.02.2026 (Sätze
  «provisorisch») nennt 61'000. An der Tabelle nachgeprüft (63'000). Bei der Ausgleichskasse
  klären. Der Staatsratsbeschluss selbst wurde nicht gefunden.
- **TI:** Die Einkommensgrenze ist nirgends als Betrag publiziert; sie ergibt sich aus der
  quadratischen Formel und der Laps-Bedarfsgrenze (Zuordnung 18'709 nur aus dem IAS-Merkblatt
  geschlossen). Gegenprobe mit dem IAS-Rechner steht aus.
- **VD:** Die Notice vom Oktober 2025 ist überholt (Kinder 74 statt 114 Fr.); massgebend ist das
  Arrêté vom 17.12.2025. Die Formeln des Reglements stehen nur als Bild im Text.
- **BS:** Eine Zelle widerspricht sich (Gruppe 09, Erwachsene mit alternativem Modell): Verordnung
  und Bericht 240, Beitragstabelle des Amts 230. Es gilt die Verordnung.
- **SH:** Die SVA-Seite zeigt noch die Richtprämien 2025; die Werte 2026 stehen nur in der
  Verordnung.
- **AR:** Gesetzessammlung online nur «Stand 1. Januar 2017»; Zahlen 2026 aus dem Merkblatt der
  Kasse. Gesetzesrevision hängig.
- **SO / GL / ZG / TG:** nur teilweise. SO: Ankerpunkte der linearen Eigenanteil-Skala (10–16 %)
  nicht publiziert, Richtprämien ohne Angabe Monat/Jahr. GL: Richtprämien 2026 nur abgeleitet (85 % der
  EDI-Durchschnittsprämie), gl.ch antwortet mit HTTP 403. ZG: Einzelpersonen-Grenze nicht
  beziffert, nur über den Online-Rechner ermittelbar (bewusst nicht abgeschickt). TG: rechnet mit
  dem Steuerbetrag (einfache Steuer), nicht mit dem Einkommen.

## Folge für die App

**Richtung der Abweichung: Die App-Höchstbeträge sind zu tief, nicht zu hoch.** In jedem
Kanton, für den ein belegter Höchstbetrag vorliegt, liegt `subsidySingle` (App 2'100–3'600
CHF/Jahr) unter dem amtlichen Betrag für eine erwachsene Einzelperson ohne Einkommen (amtlich
rund 2'650–7'330 CHF/Jahr, in den meisten Kantonen 4'400–6'100). Der lineare Abbau der App
drückt den Betrag zusätzlich. Die **Einkommensgrenzen** weichen in beide Richtungen ab: in FR,
BL, BS, BE, AR, VD, VS, TI, SG, SH und JU ist die App-Grenze für Einzelpersonen zu hoch (die App nennt Personen
berechtigt, die es nicht sind), in NW, OW, ZH, GE, NE und SO zu tief; in SZ ist die Grenze nur für eine Mietzinsregion publiziert und nicht vergleichbar. Grenzen mit «abgel.» sind aus den belegten Parametern gerechnet.

Zusätzliche Modell-Lücken der App: Prämienregionen (u. a. ZH, BE, LU, FR, SG, GR, SH, VS) fehlen;
Vermögen zählt in mehreren Kantonen zum massgebenden Einkommen oder schliesst aus (TG: jedes
steuerbare Vermögen über 0); Kinder und junge Erwachsene in Ausbildung haben bundesrechtlich
Mindestanteile (80 % / 50 %), die die App als «Kind = ½ Einzel» nicht abbildet; der Weg
(automatisch oder Antrag mit Frist) stimmt in der App nicht überall (z. B. GL: Antrag bis 31.01.,
die App sagt «automatisch aus Steuerdaten»).

Vergleich Einzelperson, erwachsen, ohne Kinder (App-Werte aus `src/config/cantonalData.js`;
«abgel.» = aus den belegten Parametern gerechnet, kein amtlich publizierter Wert; Regionen: R1 =
teuerste Region):

| Kt. | App `maxIncome` | App `subsidySingle` | Belegte Grenze / Nullpunkt | Belegter Höchstbetrag/Jahr |
|---|---|---|---|---|
| ZH | 54'900 | 3'000 | 64'000 (R1) | 5'376 (R1, abgel. aus 70 % × 640 × 12) |
| BE | 45'000 | 2'400 | 35'000 (R1) | 2'652 (R1, tiefste Stufe) |
| LU | 54'000 | 2'700 | ≈ 44'434 (abgel.) | 5'628 (R1) |
| SZ | 48'000 | 2'400 | 43'554 (Mietzinsregion 3; Grenze abhängig von EL-Beträgen) | 5'583.60 |
| UR | 42'000 | 2'100 | ≈ 51'388 (abgel.) | 4'368 |
| OW | 42'000 | 2'100 | ≈ 46'900 (abgel.), harte Grenze 50'000 | 5'018.40 |
| NW | 45'000 | 2'250 | 54'000 Summe Steuerwerte (abgel.) | 5'400 |
| GL | 42'000 | 2'100 | ≈ 50'000 (abgel.) | 5'446.80 (abgel., Richtprämie nicht amtlich beziffert) |
| ZG | 60'000 | 3'600 | ≈ 62'310 (abgel.); tiefere Einzelpersonen-Grenze nicht beziffert | 4'984.80 |
| FR | 48'000 | 2'400 | 37'000 | 4'438.20 (R1) · 4'087.20 (R2) |
| SO | 48'000 | 2'400 | 74'000 (inkl. 50 % des satzbestimmenden Vermögens) | nicht eindeutig: Richtprämie «422.-» ohne Angabe Monat/Jahr |
| BS | 54'000 | 3'000 | 49'375 | 5'328 (444/Monat, tiefste Gruppe) |
| BL | 51'000 | 2'700 | 31'000 | 4'596 |
| SH | 45'000 | 2'250 | ≈ 39'647 (abgel., R1; die SVA nennt den Wert als Schwelle für den Formularversand) | 3'865.55 (R1) |
| AR | 42'000 | 2'100 | 35'000 | 6'025.20 |
| AI | 42'000 | 2'100 | ≈ 55'000–56'000 (abgel.) | 4'640 |
| SG | 48'000 | 2'400 | ≈ 36'000–39'000 je Region (abgel.) | 5'681.40–6'285.60 je Region |
| GR | 45'000 | 2'250 | 52'320–59'160 je Region (abgel.) | 5'232–5'916 je Region |
| AG | 51'000 | 2'700 | ≈ 41'814 bereinigtes steuerbares Einkommen (abgel.) | 5'830 |
| TG | 48'000 | 2'400 | keine Einkommensgrenze (Stufen nach Steuerbetrag) | 3'408 (höchste Stufe) |
| TI | 45'000 | 2'400 | ≈ 35'547 verfügbares Einkommen (abgel.) | 6'132 |
| VD | 54'000 | 3'000 | 50'000 (revenu déterminant) | 3'972 (331/Monat, ordentlicher Subside; dazu allenfalls subside spécifique) |
| VS | 45'000 | 2'400 | 38'500 | 4'712 (Region I) · 4'040 (Region II), abgel. aus 70 % der Referenzprämie |
| NE | 48'000 | 2'400 | 50'600 | 7'332 (611/Monat, S1) |
| GE | 60'000 | 3'600 | 50'000 | 4'176 (348/Monat, G1) |
| JU | 42'000 | 2'100 | 26'999 | 2'700 (225/Monat) |

---

## ZH — Zürich

**Beurteilung:** abbildbar
**Modell (kurz):** Referenzprämie (70 % der regionalen Durchschnittsprämie) minus Eigenanteil 8,4 % (Alleinstehende/Alleinerziehende) bzw. 10,5 % (Verheiratete) des massgebenden Einkommens; 3 Prämienregionen; Vermögensgrenze 150'000 / 300'000
**Zuständig / Weg:** SVA Zürich; Antragsformular wird automatisch zugestellt (Basis Steuerfaktoren 2023), sonst Online-Nachmeldung; Antrag 2026 bis spätestens 31. März 2027; provisorische Auszahlung von 80 %, definitive Abrechnung nach Steuerfaktoren 2026
**Gültigkeit:** 2026 festgelegt (RRB Nr. 947/2025), Auszahlung provisorisch; laut SVA können die Berechnungsgrundlagen «bis zum Herbst 2026 noch angepasst werden» (2025 wurde rückwirkend gesenkt)

### Rechenmodell
> «Die Höhe der Prämienverbilligung hängt ab vom massgebenden Einkommen, vom Eigenanteil und von der Referenzprämie.» — Quelle [1]

> «Die Referenzprämie im Kanton Zürich beträgt ab dem Jahr 2026 neu 70 Prozent der regionalen Durchschnittsprämie.» — Quelle [1]

> «Für 2026 beträgt dieser 10,5 Prozent des massgebenden Einkommens für Verheiratete und registrierte Partnerinnen und Partner sowie 8,4 Prozent für die übrigen Personen (gemäss Regierungsratsbeschluss Nr. 947/2025).» — Quelle [2]

> «Familien mit massgebendem Einkommen unterhalb dieser Grenzen zahlen für ihre minderjährigen Kinder nur 20 Prozent und für volljährige Kinder in Ausbildung 50 Prozent der massgebenden Prämien.» — Quelle [2]

Formel (aus [1]): IPV = Referenzprämie − Eigenanteil × massgebendes Einkommen. Beispiel [1]: «Referenzprämie (70 Prozent der regionalen Durchschnittsprämie, Region 1) CHF 5'776 · Abzüglich Eigenanteil (8.4 Prozent vom massgebenden Einkommen; CHF 20'000) - CHF 1'680 · Höhe der Prämienverbilligung 2026 CHF 4'096».

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Referenzprämie | 70 % der regionalen Durchschnittsprämie | [1], [2] |
| Eigenanteil Alleinstehende/Alleinerziehende | 8,4 % des massg. Einkommens | [1], [2] |
| Eigenanteil Verheiratete/eingetr. Partnerschaft | 10,5 % des massg. Einkommens | [1], [2] |
| Regionale Durchschnittsprämie 2026, Region 1 (Stadt Zürich) | Erw. 640 · junge Erw. (19–25) 459 · Kinder 154 CHF/Monat | [3] |
| Regionale Durchschnittsprämie 2026, Region 2 | Erw. 584 · junge Erw. 420 · Kinder 140 CHF/Monat | [3] |
| Regionale Durchschnittsprämie 2026, Region 3 | Erw. 544 · junge Erw. 389 · Kinder 130 CHF/Monat | [3] |
| Einkommensgrenze Einzelperson >25, keine Kinder | R1 64'000 · R2 58'400 · R3 54'400 | [4] |
| Einkommensgrenze Einzelperson 18–25, keine Kinder | R1 45'900 · R2 42'000 · R3 38'900 | [4] |
| Einkommensgrenze Einzelperson >25, 1/2/3 Kinder, R1 | 79'400 / 94'800 / 110'200 | [4] |
| Einkommensgrenze Einzelperson >25, 1/2/3 Kinder, R2 | 72'400 / 86'400 / 100'400 | [4] |
| Einkommensgrenze Einzelperson >25, 1/2/3 Kinder, R3 | 70'500 / 80'400 / 93'400 | [4] |
| Einkommensgrenze Verheiratete >25, 0/1/2/3 Kinder, R1 | 102'400 / 114'720 / 127'040 / 139'360 | [4] |
| Einkommensgrenze Verheiratete >25, 0/1/2/3 Kinder, R2 | 93'440 / 104'640 / 115'840 / 127'040 | [4] |
| Einkommensgrenze Verheiratete >25, 0/1/2/3 Kinder, R3 | 87'040 / 97'440 / 107'840 / 118'240 | [4] |
| Einkommensgrenze Verheiratete 18–25, 0 Kinder | R1 73'440 · R2 67'200 · R3 62'240 | [4] |
| Familien-Einkommensobergrenze (Kinder 20 % / junge Erw. in Ausbildung 50 %) | 70'500 (nur minderjährige Kinder) · 94'000 (mind. ein junger Erw. in Ausbildung) | [2] |
| Vermögensobergrenze | Alleinstehende 150'000 · Verheiratete und Alleinerziehende 300'000 | [1], [4] |
| Vermögensfreibetrag (10 % des Übersteigenden zählt als Einkommen) | Alleinstehende 75'000 · Verheiratete und Personen mit Kindern 150'000 | [1] |
| Provisorische Auszahlung | 80 % des IPV-Betrags | [5] |
| Eigenanteile 2027 (bereits publiziert, nur Hinweis) | 11,8 % Verheiratete · 9,4 % Alleinstehende | [1] |

Plausibilitätsprüfung (eigene Rechnung, kein Zitat): 640 × 12 × 70 % = 5'376; 64'000 × 8,4 % = 5'376 → die Einkommensgrenze [4] ist genau der Punkt, an dem Referenzprämie = Eigenanteil. Gleiches gilt für junge Erwachsene (459 × 12 × 0,7 = 3'855.60; 45'900 × 8,4 % = 3'855.60) und Verheiratete (2 × 5'376 = 10'752; 102'400 × 10,5 % = 10'752). Das Modell ist damit konsistent nachrechenbar.
⚠️ **Widerspruch in der Quelle:** Das Berechnungsbeispiel [1] nennt als Referenzprämie Region 1 «CHF 5'776»; aus [3] ergibt sich 5'376. Die Einkommensgrenzen [4] stützen 5'376. Das Beispiel auf der SVA-Seite ist vermutlich ein Tippfehler — in der App nicht übernehmen, bei SVA Zürich nachfragen.

### Massgebendes Einkommen
> «Total der Einkünfte (Ziff. 199 der Steuererklärung) abzüglich Total der Abzüge (Ziff. 299 der Steuererklärung) abzüglich Krankheits- und Unfallkosten (Ziff. 320 …) abzüglich Sozialabzüge für Kinder und unterstützte Personen (Ziff. 370, 372 und 374 …) zuzüglich Verluste aus der Nutzung von Liegenschaften und Privatvermögen (Ziff. 188 …) zuzüglich Beiträge an die gebundene Selbstvorsorge 3a (Ziff. 260 und 261 …) zuzüglich Beiträge an die AHV, IV und 2. Säule (Ziff. 280 …) zuzüglich Vermögensanteil» — Quelle [1]

> «Bei quellenbesteuerten Personen entspricht das massgebende Einkommen dem steuerbaren Einkommen unter Berücksichtigung des Kinderabzuges.» — Quelle [1]

Selbständige: «7.5 % der Einkünfte aus selbständiger Erwerbstätigkeit … Oder höchstens die Summe der Beiträge an die 2. und 3. Säule» — Quelle [1]. Basis: Steuerfaktoren des Antragsjahrs 2026 («frühestens ab Herbst 2027» bekannt) [4].

### Abweichung zur App
Der heutige App-Wert (maxIncome/subsidySingle ZH) lag dem Unteragenten nicht vor. Belegte Vergleichsgrössen: Einzelperson >25 ohne Kinder, Region 1: Einkommensgrenze 64'000, IPV bei Einkommen 0 = 5'376 CHF/Jahr (Region 2: 58'400 / 4'905.60; Region 3: 54'400 / 4'569.60, eigene Rechnung aus [3]). Der Abbau ist in ZH tatsächlich linear (8,4 % je Franken Einkommen) — das App-Modell «voll bei 0, null bei maxIncome» passt strukturell, aber nur mit regionsabhängiger Grenze und getrennter Rechnung für Kinder/junge Erwachsene.

### Offen / nicht gefunden
- Rechtstext RRB Nr. 947/2025 und EG KVG / Verordnung selbst nicht geöffnet (Zahlen aus Medienmitteilung Regierungsrat und SVA-Seiten).
- Ausdrückliche amtliche Bestätigung, dass die IPV-«regionale Durchschnittsprämie» identisch mit der EL-Tabelle [3] ist, fehlt; nur durch die Nachrechnung gestützt. Widerspruch 5'776 vs. 5'376 im SVA-Beispiel ungeklärt.
- Genaue Rechnung für Kinder (20 % bzw. 50 % der «massgebenden Prämien» unterhalb der Familiengrenze) und Zusammenspiel mit dem Eigenanteil nicht im Detail publiziert gefunden.
- Mögliche rückwirkende Anpassung 2026 im Herbst 2026 («bis zum Herbst 2026 noch angepasst») — Stand heute nicht geprüft, ob schon erfolgt.

### Quellen
1. Prämienverbilligung: Leistung, SVA Zürich, Stand ohne Datum (enthält bereits Eigenanteile 2027). https://svazurich.ch/unsere-produkte/weitere-produkte/krankenversicherung--kvg-/praemienverbilligung/leistung.html — abgerufen 16.09.2026
2. Medienmitteilung «Kanton legt Prämienverbilligungen 2026 fest», Kanton Zürich (Regierungsrat), 23.09.2025. https://www.zh.ch/de/news-uebersicht/medienmitteilungen/2025/09/kanton-legt-praemienverbilligungen-2026-fest.html — abgerufen 16.09.2026
3. Regionale Durchschnittsprämie (Höhe der regionalen Durchschnittsprämie 2026), SVA Zürich, Stand ohne Datum. https://svazurich.ch/unsere-produkte/weitere-produkte/weitere-leistungen/ergaenzungsleistungen/regionale-durchschnittspraemien.html — abgerufen 16.09.2026
4. Prämienverbilligung 2026: Einkommensgrenzen 2026, SVA Zürich, Stand ohne Datum. https://svazurich.ch/ihr-anliegen/privatpersonen/praemienverbilligung/praemienverbilligung_2026/einkommensgrenzen-2026.html — abgerufen 16.09.2026
5. Kundeninformation: Prämienverbilligung 2026, SVA Zürich, V 05.2025 (PDF). https://svazurich.ch/dam/sva-dokumente/4000_ipv/4000_vl3_ipv_kundeninformation_2026.pdf — abgerufen 16.09.2026

### Nachprüfung 19.09.2026 (K31, Einbau in die App)
Alle Quellen [1]–[5] erneut abgerufen. **Werte 2026 unverändert** (Eigenanteil 8,4 % / 10,5 %,
Referenzprämie 70 %, Durchschnittsprämien, alle 36 Einkommensgrenzen). Das Beispiel [1] nennt
weiterhin «CHF 5'776». Der Hinweis «Die Berechnungs­grundlagen können vom Regierungsrat bis zum
Herbst 2026 noch angepasst werden» steht weiter auf [4]; eine Anpassung 2026 wurde nicht gefunden.

Neu gefunden (schliesst die Lücken unter «Offen»):

- **Kinder-Mindestanspruch** — RRB Nr. 297/2025 vom 19.03.2025, Dispositiv II–IV [6]: «Die
  massgebenden Prämien zur Berechnung des Mindestanspruchs von Kindern und jungen Erwachsenen in
  Ausbildung nach Art. 65 Abs. 1bis KVG werden auf 84% der regionalen Durchschnittsprämien 2026
  festgesetzt.» · Familiengrenze 70 500 (nur minderjährige Kinder) bzw. 94 000 · «Zur Verminderung
  der Fehlanreize bei Einkommen über den […] Einkommensgrenzen wird für 2026 eine Abzugsquote von
  60% auf der Differenz zwischen Einkommen und Einkommensgrenze festgesetzt.»
- **Verteilung und Erhöhung** — EG KVG (LS 832.01) [7] § 6 Abs. 3/4: «Die Referenzprämien werden
  zusammengezählt.» «Die Prämienverbilligung wird entsprechend der Höhe der Referenzprämien auf
  die Personen der Gruppe aufgeteilt.» § 7 Abs. 1: «Wird mit einem gemäss § 6 Abs. 4 bestimmten
  Prämienverbilligungsanteil der Mindestanspruch einer Person gemäss Art. 65 Abs. 1bis KVG nicht
  eingehalten, wird die Prämienverbilligung dieser Person entsprechend erhöht.»
- **Deckel** — EG KVG § 4 Abs. 3: «Ist die Bruttoprämie einer anspruchsberechtigten Person tiefer
  als die Referenzprämie, erhält sie höchstens die Bruttoprämie als Prämienverbilligung.»
- **Gegenprobe**: alle 36 Einkommensgrenzen 2026 aus [4] ergeben sich exakt als Nullpunkt
  «Summe der Referenzprämien ÷ Eigenanteilssatz», mit minderjährigen Kindern mindestens 70 500
  (Test `src/config/__tests__/ipvZuerich.test.js`).
- **Nicht eindeutig**: ob die Abzugsquote 60 % über 70 500 je Kind oder je Familie abgezogen
  wird; die Tabelle [4] nennt in diesen Fällen 70 500 als Grenze, ohne Abbau-Zone. Die App rechnet
  in dieser Zone bewusst keinen Betrag. Die Erheblichkeitsgrenze (§ 22 EG KVG) ist in der
  geprüften Fassung der VEG KVG nicht beziffert.
- **2027 ist bereits amtlich publiziert** (nur Hinweis, nicht eingebaut): Eigenanteil 11,8 % /
  9,4 % [1]; Durchschnittsprämien 2027 Region 1/2/3 Erw. 665/607/566, junge Erw. 477/437/405,
  Kinder 160/146/136 CHF/Monat [3]; Einkommensgrenzen 2027 (z. B. Einzelperson >25, Region 1:
  59'420) [8]; Familiengrenze 2027 laut Tabelle 71 200 [8].

### Fachprüfung 20.09.2026 (swiss-precision-pruefer, alle Quellen erneut abgerufen)

Bestätigt: Modell, Sätze, Durchschnittsprämien, alle 36 Grenzen, Verteilung, Deckel,
Kinder-Mindestanspruch, Vermögensregel und die 37 Gemeinden der Region 2. Neu belegt und in
den Code übernommen:

- **Altersstichtag** — EG KVG § 8 [7]: «Richten sich die Prämienverbilligungsbeiträge nach dem
  Alter der anspruchsberechtigten Person, ist für das ganze Jahr das **Alter am Ende des
  Vorjahres** massgebend.» Für 2026 zählt also das Alter am 31.12.2025. Der Code rechnete
  zuerst das Alter *im* Anspruchsjahr — ein Jahr zu viel, wodurch 25-Jährige als Erwachsene
  galten und einen Betrag sahen. Korrigiert.
- **Säule 3a** — EG KVG § 5 Abs. 1 lit. b [7]: Beiträge an die gebundene Selbstvorsorge werden
  dem massgebenden Einkommen **hinzugerechnet**. Das Feld `finanzen.pension3a` fehlte in der
  Näherung; ohne es war das Einkommen zu tief und der Betrag zu hoch. Korrigiert.
- **Die beiden Eigenanteilssätze stützen sich gegenseitig** — EG KVG § 3 Abs. 3 [7]: «Der
  Eigenanteil für Einzelpersonen und Alleinerziehende beträgt 80% des Eigenanteils für
  Verheiratete» (8,4 = 0,8 × 10,5; 2027: 9,4 ≈ 0,8 × 11,8).
- **Abzugsquote über der Familiengrenze** — RRB 297/2025 [6], S. 4: «Ist die Einkommensgrenze
  erreicht, wird 60% des zusätzlichen Einkommens **vom Mindestanspruch** abgezogen.» Singular
  und eine Grenze je Familie sprechen für die Familien-Lesart; die App rechnet in dieser Zone
  weiterhin bewusst nicht.
- **Das Rechenbeispiel auf [2] ist ein Zahlendreher**, unabhängig bestätigt: 0,7 × 640 × 12 =
  5'376, und nur 5'376 erklärt die publizierte Grenze 64'000 (× 8,4 %). Ebenso 459 → 45'900 und
  2 × 5'376 → 102'400. Drei Tabellenwerte stützen 5'376, keiner 5'776. **Der SVA melden.**
- **Hinweis für den 2027-Einbau:** Die publizierten Grenzen 2027 sind *nicht* exakt
  «Summe ÷ Satz» (R1 Erw. 59'420 statt 59'425.53; R2 54'235 statt 54'242.55; R3 50'570 statt
  50'578.72). Der Exaktheits-Test müsste dafür angepasst werden.

Offen geblieben (nicht im Code): Das massgebende Vermögen ist amtlich das **steuerbare
Gesamtvermögen** (inkl. Liegenschafts-Steuerwert, abzüglich Schulden); die App summiert nur
Wertschriften, Sparkonto und übrige Vermögenswerte. Ebenso fehlen die amtlichen Abzüge
(Berufsauslagen, Versicherungsabzug, Sozialabzüge für Kinder). Beides ist in der Bau-Liste
vermerkt.

6. RRB Nr. 297/2025, Krankenversicherung (IPV 2026; Eckwerte erste Phase), Kanton Zürich. https://www.zh.ch/bin/zhweb/publish/regierungsratsbeschluss-unterlagen./2025/297/RRB-2025-0297.pdf — abgerufen 19.09.2026
7. Einführungsgesetz zum Krankenversicherungsgesetz (EG KVG), LS 832.01, Fassung «1. 10. 23 - 122». https://www.notes.zh.ch/appl/zhlex_r.nsf/WebView/B1FF7F0CFD47699AC12589F20029EC6C/$File/832.01_29.4.19_122.pdf — abgerufen 19.09.2026
8. Prämienverbilligung 2027: Einkommensgrenzen 2027, SVA Zürich. https://svazurich.ch/ihr-anliegen/privatpersonen/praemienverbilligung/praemienverbilligung_2027/einkommensgrenzen-2027.html — abgerufen 19.09.2026

---

## BE — Bern

**Beurteilung:** abbildbar
**Modell (kurz):** Stufentabelle: fester Monatsbetrag je Prämienregion (3), Altersgruppe und Einkommensstufe (bis 9'000 / 17'000 / 25'000 / 35'000; Familien bis 45'000); Kinder und junge Erwachsene in Ausbildung Pauschalbetrag
**Zuständig / Weg:** Amt für Sozialversicherungen (ASV), Direktion für Inneres und Justiz, Ostermundigen; in der Regel automatisch aufgrund der definitiven Steuerdaten des Vorvorjahres; sonst Antrag (online/Post) für das laufende Jahr bis spätestens 31. Dezember; Auszahlung an den Krankenversicherer
**Gültigkeit:** 2026 definitiv («Gültig ab 1. Januar 2026»)

### Rechenmodell
> «Sie haben Anrecht auf Prämienverbilligung, wenn das massgebende Einkommen nicht höher als Fr. 35'000 ist … Bei Familien mit zur Familie zählenden Kindern darf das massgebende Einkommen aller Familienmitglieder nicht höher als Fr. 45'000 sein.» — Quelle [1]

> «Wie hoch ist Ihre monatliche Prämienverbilligung?» — Tabelle nach Prämienregion, Alter und «Massgebendes Einkommen bis 9'000 / bis 17'000 / bis 25'000 / bis 35'000 / bis 45'000 Franken» (letzte Spalte «gilt für Familien mit zur Familie zählenden Kindern») — Quelle [1]

> «Das Anrecht auf Prämienverbilligung wird in der Regel aufgrund der definitiven Steuerdaten des Vorvorjahres automatisch berechnet.» — Quelle [2]

### Zahlen 2026
Beträge in CHF **pro Monat** (Jahreswert = × 12, eigene Rechnung in Klammern).

| Grösse | Wert | Quelle |
|---|---|---|
| Einkommensgrenze ohne Kinder | massg. Einkommen ≤ 35'000 | [1] |
| Einkommensgrenze Familien mit Kindern | massg. Einkommen aller Familienmitglieder ≤ 45'000 | [1] |
| Region 1, Erwachsene >25, Stufen bis 9'000/17'000/25'000/35'000/45'000 | 221.00 / 147.00 / 107.00 / 67.00 / 33.50 (Jahr: 2'652 / 1'764 / 1'284 / 804 / 402) | [1] |
| Region 2, Erwachsene >25 | 196.00 / 132.00 / 96.00 / 60.00 / 30.00 (Jahr: 2'352 / 1'584 / 1'152 / 720 / 360) | [1] |
| Region 3, Erwachsene >25 | 183.00 / 123.00 / 89.00 / 56.00 / 28.00 (Jahr: 2'196 / 1'476 / 1'068 / 672 / 336) | [1] |
| Junge Erwachsene (>18, <25) zur Familie zählend, alle Stufen | R1 239.25 · R2 214.15 · R3 200.30 | [1] |
| Kinder bis 18, alle Stufen | R1 119.30 · R2 106.00 · R3 99.35 (Jahr: 1'431.60 / 1'272 / 1'192.20) | [1] |
| Junge Erwachsene nicht mehr bei Eltern, **nicht** in Ausbildung, R1 | 206.00 / 138.00 / 100.00 / 63.00 / 31.50 | [1] |
| dito R2 | 183.00 / 124.00 / 90.00 / 56.00 / 28.00 | [1] |
| dito R3 | 170.00 / 116.00 / 84.00 / 52.00 / 26.00 | [1] |
| Junge Erwachsene nicht mehr bei Eltern, **in** Ausbildung (auf Antrag) | R1 239.25 · R2 214.15 · R3 200.30 | [1] |
| Vermögensfreibetrag | Fr. 17'000 pro Familienmitglied; 5 % des korrigierten Vermögens werden dem Einkommen zugerechnet | [1] |
| Sozialabzüge | Ehepaar 13'000 · alleinstehende Eltern 9'750 · Alleinstehende 2'200 · 1. Kind 15'000 · 2. Kind 12'500 · jedes weitere 10'000 | [1] |
| Prämienregion | Wohnsitz am 1. Januar; R1 = u. a. Bern, Biel, Köniz, Ostermundigen …; R2 = Liste; R3 = «Alle übrigen» | [1] |

### Massgebendes Einkommen
> «Als Berechnungsgrundlage für ordentlich besteuerte Personen dient das Reineinkommen sowie das Vermögen gemäss Steuerdaten.» Aufgerechnet u. a. Beiträge 2. Säule (nicht im Nettolohn II), Säule 3a, Zweiverdienerabzug, Stipendien, Mitgliederbeiträge/Zuwendungen, auswärtiger Wochenaufenthalt; abgezogen «selbst getragene Krankheitskosten» → «korrigiertes Reineinkommen»; dann «korrigiertes Reineinkommen zuzüglich 5% des korrigierten Vermögens» minus Sozialabzüge = «massgebendes Einkommen» — Quelle [1]

> «Als Berechnungsgrundlage für Personen, die an der Quelle besteuert sind, werden 75 Prozent des Bruttoeinkommens als korrigiertes Reineinkommen berücksichtigt» — Quelle [1]

Hinweis [1]: massgebendes Einkommen «entspricht nicht dem steuerbaren Einkommen».

### Abweichung zur App
Der heutige App-Wert (maxIncome/subsidySingle BE) lag dem Unteragenten nicht vor. Belegte Vergleichsgrössen: Einzelperson >25, Region 1: Grenze 35'000 massg. Einkommen, Höchstbetrag 2'652 CHF/Jahr (Stufe bis 9'000). BE rechnet **in Stufen, nicht linear** — ein linearer Abbau bis maxIncome bildet Bern falsch ab; zudem ist das massgebende Einkommen um Sozialabzüge reduziert.

### Offen / nicht gefunden
- Rechtstext KKVV (BSG) mit den Beträgen nicht geöffnet; Zahlen aus dem amtlichen Berechnungsschema des ASV.
- Informationsblatt 2026 (auf der Publikationsseite verlinkt) nicht gelesen.
- Untergrenze der Stufe «bis 9'000» (ob auch negatives/Null-Einkommen) nicht ausdrücklich geregelt gefunden.
- Ob die Beträge 2026 beim Kind/jungen Erwachsenen die KVG-Mindestquoten (80 % / 50 %) abbilden, nicht geprüft.

### Quellen
1. Berechnungsschema, «Gültig ab 1. Januar 2026», Direktion für Inneres und Justiz, Amt für Sozialversicherungen, Abteilung Prämienverbilligung und Obligatorium (PDF, 5 S.). https://www.asv.dij.be.ch/content/dam/asv_dij/dokumente/de/pr%C3%A4mienverbilligung--informationen/Berechnungsschema%202026_de.pdf — abgerufen 16.09.2026
2. Prämienverbilligung beantragen, Amt für Sozialversicherungen Kanton Bern, Stand ohne Datum. https://www.asv.dij.be.ch/de/start/themen/pv/pv_anrecht-auf-pv-beantragen.html — abgerufen 16.09.2026
3. Publikationen (Informationsblatt 2026, Berechnungsschema 2026), Amt für Sozialversicherungen Kanton Bern. https://www.asv.dij.be.ch/de/start/themen/pv/formulare---publikationen.html — abgerufen 16.09.2026

### Nachprüfung 20.09.2026 (K31, Einbau in die App)

Quelle [1] erneut abgerufen und Seite für Seite gegen die Erhebung vom 16.09. gehalten:
**alle Werte 2026 unverändert** — Grenzen 35'000 / 45'000, die fünf Einkommensstufen, alle
42 Monatsbeträge der beiden Tabellen (3 Regionen × 7 Zeilen je Tabelle), Vermögensfreibetrag 17'000 je Familienmitglied, die
5 % Vermögenszuschlag und die sechs Sozialabzüge. **Keine Abweichung zur Recherche vom
16.09.** Neu gelesen wurden Quelle [3] (Publikationsseite), das Informationsblatt 2026 [4]
und der Rechtstext [5], den die Erhebung unter «Offen» offengelassen hatte.

Damit schliessen sich drei der vier offenen Punkte:

- **Rechtstext** — KKVV (BSG 842.111.1, Stand 01.12.2025) [5] trägt dieselben Zahlen wie das
  Berechnungsschema: Art. 9 Abs. 1 «Vom Reinvermögen sind für jedes Mitglied der Familie
  17'000 Franken abzuziehen», Art. 9 Abs. 2 «fünf Prozent des nach Absatz 1 reduzierten
  Reinvermögens» und die Abzüge a–f (13'000 Paar · 13'000 unverheiratetes Paar nach Art. 19
  Abs. 2 EG KUMV · 9'750 alleinstehender Elternteil · 2'200 alleinstehende Person · 15'000 /
  12'500 / 10'000 je Kind), Art. 10a Abs. 1/3 die Erwachsenenbeträge.
  **Die Abzüge a/a1, b und c schliessen sich gegenseitig aus**: b gilt dem «alleinstehenden
  Elternteil, der gemeinsam mit Personen nach Artikel 5 eine Familie bildet», c der
  «alleinstehende[n] Person, die nach Artikel 5 **nicht** zur Familie zählt». Eine
  alleinerziehende Person erhält also 9'750, nicht zusätzlich 2'200.
- **KVG-Mindestquoten** — belegt: Art. 10d Abs. 1 «Kinder erhalten 80 Prozent der Prämie
  verbilligt, wenn das massgebende jährliche Familieneinkommen 45'000 Franken nicht
  übersteigt»; Art. 10b Abs. 3/4 und Art. 10c Abs. 1 «50 Prozent der Prämie» für junge
  Erwachsene in Ausbildung. Massgebende Prämie ist jeweils «die durchschnittliche
  Vorjahresprämie … der 20 günstigsten Krankenversicherer der Region». Die festen
  Monatsbeträge im Berechnungsschema sind das Ergebnis dieser Quoten.
- **Untergrenze der ersten Stufe** — der Rechtstext schreibt «unter 9000 Franken» und dann
  «zwischen 9001 und 17'000 Franken»; das Berechnungsschema schreibt «bis 9'000». Damit
  bleibt genau der Wert 9'000 (und alles zwischen 9'000 und 9'001) im Erlass ungeregelt. Die
  App folgt der Tabelle des Amts, das die Verfügung erlässt: bis und mit 9'000 gilt die
  oberste Stufe. Nach unten ist nichts begrenzt — ein massgebendes Einkommen von 0 liegt in
  der obersten Stufe.
- **Informationsblatt 2026** [4] gelesen; drei Punkte, die die App braucht: Konkubinatspaare
  mit gemeinsamem Kind rechnen «wie bei einem verheirateten Paar» · ab einem ausgewiesenen
  **Bruttovermögen über Fr. 750'000** wird das Anrecht nicht mehr automatisch geprüft,
  sondern nur auf Antrag · junge Erwachsene zählen zur Familie der Eltern, wenn ihr
  korrigiertes Reineinkommen unter Fr. 14'000 liegt (KKVV Art. 5 Abs. 1).

**Prämienregionen — vollständige Liste jetzt belegt.** Das Berechnungsschema druckt die
Gemeinden von Region 1 (15) und Region 2 (212) vollständig ab, Region 3 ist «Alle übrigen».
Rechtlich massgebend ist die BAG-Zuteilung: KKVV Art. 10 Abs. 5 «Die Gemeinden werden den
Prämienregionen zugeteilt, die vom Bundesamt für Gesundheit gestützt auf Artikel 61 Absatz 2
KVG festgelegt werden.» Die App bestimmt die Region deshalb über `src/data/praemienRegionen.js`
(BAG, Stand 2026) und hält die Liste des Schemas als Gegenprobe dagegen (Test
`src/config/__tests__/ipvBern.test.js`). Beide Quellen decken sich bei 333 der 334 Berner
Gemeinden:

- ⚠️ **Reutigen (BFS 767)**: beim BAG Region 2, in der R2-Liste des Schemas nicht enthalten
  (dort also «alle übrigen» = Region 3). Unterschied: bis zu CHF 156 im Jahr je erwachsene
  Person (13.— im Monat auf der obersten Stufe) und CHF 79.80 je Kind. **Die App zeigt
  für diese Gemeinde keinen Betrag**, bis geklärt ist, welche Lesart gilt. Beim ASV nachfragen.
- **Schlosswil** steht in der R2-Liste des Schemas, hat aber weder im
  Ortschaftenverzeichnis (swisstopo 2025) noch in der BAG-Tabelle 2026 eine eigene
  BFS-Nummer. Ohne Folge für die Rechnung — über eine Postleitzahl erreicht die App diesen
  Namen nicht —, aber ein zweiter Hinweis darauf, dass die abgedruckte Liste nicht
  vollständig nachgeführt ist.

**2027 ist noch nicht publiziert** (geprüft 20.09.2026): die Publikationsseite [3] führt nur
Informationsblatt und Berechnungsschema 2025 und 2026; `Berechnungsschema 2027_de.pdf` und
`Informationsblatt 2027_de.pdf` antworten mit HTTP 404 — ebenso wie ein erfundener Dateiname
als Kontrollprobe, der 404 allein belegt also nichts, wohl aber zusammen mit [3]. Darum liegt
in der App derselbe Jahres-Riegel wie bei ZH: ab dem 01.01.2027 rechnet sie nicht weiter.

**Was die App mit BE rechnet und was nicht** (`src/config/ipvBern.js`): gerechnet wird nur die
alleinstehende Person über 25 mit Kindern bis 18. Keine Zahl — mit Grund in der Anzeige — bei
Paaren und Verheirateten, bei unbekanntem oder nicht eindeutigem Alter (die Tabelle kennt
«älter als 25» und «älter als 18 und noch nicht 25»; wer im Anspruchsjahr genau 25 wird, steht
in keiner Zeile), bei Kindern ohne Alter oder über 18, bei Bruttovermögen über 750'000, bei
nicht eindeutiger Gemeinde und ab 2027.

**Offen geblieben (nicht im Code):** wie in ZH ist das massgebende Einkommen in der App eine
Näherung — amtlich zählt das Reineinkommen aus den Steuerdaten mit den Aufrechnungen des
Schemas, die App summiert die erfassten Einkommen — die Säule 3a steckt im erfassten
Nettoeinkommen bereits drin und wird seit dem 20.09.2026 nicht mehr zusätzlich aufgerechnet;
seit dem 23.09.2026 wird der Teil ÜBER dem bundesrechtlichen Maximum des Bemessungsjahres
(2024: CHF 7'056) sogar abgezogen, wie es Art. 6 Abs. 4 lit. i verlangt. ⟨Hier stand «plus
Säule 3a» — überholt, der Satz bleibt als Beleg.⟩ Das Vermögen ist die Summe
der erfassten Posten, nicht das Reinvermögen inkl. Liegenschaft und abzüglich Schulden. **In
einer Stufentabelle wiegt das schwerer als in einem linearen Modell**: eine Stufe ist in
Region 1 bis zu CHF 888 im Jahr wert. Ebenfalls nicht gerechnet: Quellenbesteuerte (75 % des
Bruttoeinkommens als korrigiertes Reineinkommen), junge Erwachsene (Ausbildungsstatus und
eigenes Einkommen nicht erfasst), Sozialhilfe- und EL-Beziehende (eigener Weg).

### Fachprüfung 20.09.2026 (swiss-precision-pruefer, alle Quellen erneut abgerufen)

Bestätigt: **alle 42 Monatsbeträge** beider Tabellen (Schema **und** KKVV Art. 10a/10b, doppelt
gegengeprüft), die fünf Stufen, die Grenzen 35'000/45'000, der Vermögensfreibetrag mit den 5 %,
alle sechs Sozialabzüge samt ihrem gegenseitigen Ausschluss (Art. 9 Abs. 2 lit. c: «alleinstehende
Person, die nach Artikel 5 **nicht** zur Familie zählt»), die R1-/R2-Listen zeichengenau (15/212),
der stufenunabhängige Kinderbetrag (Art. 10d Abs. 1) und dass kein anderer Kanton verändert wird.

Drei Befunde eingearbeitet — alle drei betrafen **Aussagen**, nicht die Zahlenbasis:

- **Falsches Basisjahr in der Anzeige.** Der Vorbehalt stammte aus ZH und nannte die Steuerfaktoren
  des Anspruchsjahres. In BE gilt KKVV Art. 7 Abs. 1: «bestimmen sich das Reineinkommen und das
  Reinvermögen aufgrund der definitiven Veranlagung des **vorletzten Steuerjahres**»; das
  Informationsblatt 2026 zeigt dazu «01.01.2026 – 31.12.2026 → Grundlage: Steuerdaten 2024».
  Neu ein eigener BE-Vorbehalt, der das Basisjahr und die Neubeurteilung nennt.
- **Konkubinat rechnete durch.** Informationsblatt 2026, S. 1: «Leben Sie unverheiratet mit Ihrem
  Partner/Ihrer Partnerin im gleichen Haushalt und haben mindestens ein gemeinsames Kind, dann wird
  die Berechnung der Prämienverbilligung **wie bei einem verheirateten Paar** vorgenommen.» Der
  Guard prüfte nur `married`. Gemessen: CHF 340/Monat ohne das Einkommen der zweiten Person.
  Jetzt Orientierung statt Betrag — **auch in ZH**, wo derselbe Guard stand.
- **«Automatisch via Steuerdaten» ist für die ärmste Gruppe falsch.** Informationsblatt 2026, S. 2:
  Wer «mindestens 25 Jahre alt» ist, keine zur Familie zählenden Kinder hat und ein korrigiertes
  Reineinkommen **unter Fr. 14'000** ausweist, muss die Überprüfung bis 31.12. selbst beantragen.
  Neu ein eigener Hinweis samt Link zur Stelle; ohne ihn verliert diese Gruppe bis CHF 2'652 im Jahr.

Dazu übernommen: Der **Prämien-Deckel** (Art. 10 Abs. 1) gilt pro Person — mit Kindern wird jetzt
der Anteil der erwachsenen Person gedeckelt, statt den Deckel ganz entfallen zu lassen. Die
750'000 sind **kein Ausschluss**, sondern Antragspflicht; eigener Text. Bei **Reutigen** nennt die
App neu den richtigen Grund (Region strittig, nicht Gemeinde unklar).

**Stufengrenzen geprüft** (die gefährlichste Stelle): Der Code nimmt bei genau 9'000 / 17'000 /
25'000 / 35'000 / 45'000 die **günstigere** Stufe, wie das Schema des verfügenden Amts schreibt
(«bis 9'000 … bis 45'000 Franken»). Die KKVV deckt 17'000 aufwärts wörtlich; offen bleibt allein
der Wert 9'000, weil Art. 10a Abs. 1 von «unter 9000» auf «zwischen 9001 und 17'000» springt.

**Nicht eingearbeitet, bewusst:** Das massgebende Einkommen bleibt eine Näherung (erfasste
Einkommen + Säule 3a statt Reineinkommen nach StG; Vermögen ohne Liegenschaft und Schulden). In
einer Stufentabelle wiegt das schwerer als in ZHs linearem Modell — ein Schritt ist in Region 1
CHF 888 im Jahr wert, und `monthlyIncome` ist als Nettolohn erfasst, liegt also tendenziell zu
hoch. In der Anzeige benannt, nicht gerechnet. Ebenso offen: EL- und Sozialhilfe-Beziehende haben
einen eigenen Weg (Informationsblatt S. 3), die App rechnet ihre Renten heute als Einkommen mit.

4. Informationen zur Prämienverbilligung, «Gültig ab 1. Januar 2026», Direktion für Inneres und Justiz, Amt für Sozialversicherungen (PDF, 5 S.). https://www.asv.dij.be.ch/content/dam/asv_dij/dokumente/de/pr%C3%A4mienverbilligung--informationen/Informationsblatt%202026_de.pdf — abgerufen 20.09.2026
5. Kantonale Krankenversicherungsverordnung (KKVV), BSG 842.111.1, vom 25.10.2000, Stand 01.12.2025 (Beschlussdatum 22.10.2025). https://www.belex.sites.be.ch/app/de/texts_of_law/842.111.1 — abgerufen 20.09.2026

---

## LU — Luzern

**Beurteilung:** abbildbar — **in der App gebaut 23.09.2026 (K31)**, siehe «Nachprüfung 23.09.2026» unten
**Modell (kurz):** Richtprämie (3 Regionen) minus Selbstbehalt; der Prozentsatz beträgt 10 % + 0,00006 Prozentpunkte je Franken massgebendes Einkommen (progressiv); Kinder 80 % und junge Erwachsene in Ausbildung 50 % Verbilligung bis zu einer Familien-Einkommensgrenze; Vermögensgrenze 100'000 / 200'000 (+50'000 je Kind)
**Zuständig / Weg:** WAS Wirtschaft Arbeit Soziales, Ausgleichskasse Luzern (Sozialversicherungszentrum); Anmeldung nötig, «spätestens Ende Oktober des Vorjahres» (für 2026: bis 31.10.2025; für 2027: bis 31.10.2026); bei späterer Anmeldung werden nur die danach fällig werdenden Prämien verbilligt; Auszahlung an den Krankenversicherer
**Gültigkeit:** 2026 definitiv (Prämienverbilligungsverordnung, in Kraft seit 01.01.2026, Beschlussdatum 04.11.2025)

### Rechenmodell
> «Ein Anspruch auf Prämienverbilligung … besteht für das Jahr 2026, soweit die anrechenbaren Prämien das massgebende Einkommen um einen bestimmten Prozentsatz übersteigen. Dieser Prozentsatz beträgt für das Jahr 2026 mindestens 10 Prozent. Für jeden Franken des massgebenden Einkommens steigt er um 0,00006 Prozentpunkte an.» — § 2 Abs. 1 Prämienverbilligungsverordnung, Quelle [1]

> «Eltern oder Elternteile, unter deren Obhut Kinder bis zum vollendeten 18. Lebensjahr leben, haben für das Jahr 2026 Anspruch auf die Verbilligung der anrechenbaren Prämien für Kinder um 80 Prozent, sofern … ihr massgebendes Einkommen … eine bestimmte Einkommensgrenze nicht überschreitet.» — § 2a Abs. 1, Quelle [1]

> «Prämienverbilligungen gemäss § 2a sind von den Leistungen, die gemäss § 2 festgesetzt werden, abzuziehen.» — § 2b, Quelle [1]

> «Liegt der gesamte Anspruch auf Prämienverbilligung unter 100 Franken, wird der Betrag nicht ausbezahlt.» — § 7, Quelle [1]

Formel (aus [1], [2]): Anspruch = Summe der anrechenbaren Richtprämien − p(E) × E, mit p(E) = 10 % + 0,00006 Prozentpunkte × E (E = massgebendes Einkommen in CHF). Das Berechnungsbeispiel der WAS [4] bestätigt: «einem fixen Prozentsatz von 10% plus einem variablen Prozentsatz je nach massgebendem Einkommen».

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Richtprämie Region 1 (Ebikon, Emmen, Horw, Kriens, Luzern) | Erwachsene 5'628 · junge Erwachsene 4'044 · Kinder 1'308 CHF/Jahr | [1] § 3, [3] |
| Richtprämie Region 2 (Adligenswil … Wolhusen, Liste in [3]) | Erwachsene 5'304 · junge Erwachsene 3'780 · Kinder 1'224 CHF/Jahr | [1] § 3, [3] |
| Richtprämie Region 3 (übrige Gemeinden) | Erwachsene 5'100 · junge Erwachsene 3'660 · Kinder 1'176 CHF/Jahr | [1] § 3, [3] |
| Altersabgrenzung 2026 | Erwachsene «ab Jahrgang 2000» · junge Erwachsene «Jahrgang 2001-2007» · Kinder «Jahrgang 2008-2026» | [3] |
| Selbstbehalt-Prozentsatz | 10 % + 0,00006 Prozentpunkte je Franken massg. Einkommen | [1] § 2 |
| Gesetzliche Obergrenze des Prozentsatzes | höchstens 10 % + 0,00015 Prozentpunkte je Franken | [2] § 7 Abs. 1 |
| Einkommensgrenze Kinder (80 %) und junge Erw. in Ausbildung (50 %) | Eltern 96'392 · ein Elternteil 77'114 | [1] § 2a |
| Pauschalbetrag je Kind / jungem Erwachsenen in Ausbildung | 9'000 | [1] § 3b |
| BVG-Einkäufe werden zugerechnet, soweit über | 20'000 pro Steuerjahr | [1] § 3a |
| Vermögensgrenze (Reinvermögen) | Verheiratete 200'000 · Alleinstehende 100'000; +50'000 pro Kind/jungem Erw. in Ausbildung | [2] § 7 Abs. 2, [5] |
| Mindestauszahlung | Gesamtanspruch unter 100 CHF wird nicht ausbezahlt | [1] § 7 |
| Richtprämien-Untergrenze (Gesetz) | mindestens 84 % der EL-Durchschnittsprämien | [2] § 6 |

Eigene Rechnung (kein Zitat): Einzelperson Erwachsene, kein Vermögen — Anspruch endet dort, wo (0,10 + 0,0000006 × E) × E = Richtprämie, also bei E ≈ 44'434 (Region 1), ≈ 42'303 (Region 2), ≈ 40'942 (Region 3). Anspruch bei E = 0: voller Richtbetrag (5'628 / 5'304 / 5'100). Beispiel R1, E = 20'000: p = 10 % + 1,2 = 11,2 % → Selbstbehalt 2'240 → Anspruch 3'388.

### Massgebendes Einkommen
> «Zur Bestimmung des massgebenden Einkommens … ist vom Nettoeinkommen gemäss der Steuerveranlagung auszugehen. Als Nettoeinkommen gelten die um die Aufwendungen nach den §§ 33–39 sowie 40 Absatz 1a–g des Steuergesetzes … verminderten steuerbaren Einkünfte.» Hinzugezählt werden u. a. BVG-Einkäufe über dem Pauschalbetrag, Säule 3a, verrechenbare Geschäftsverluste, im vereinfachten Verfahren versteuerte Einkünfte, Liegenschaftsunterhalt über 20 % und «10 Prozent des Reinvermögens; als Reinvermögen gilt das Vermögen vor Abzug der steuerfreien Beträge» — § 7 Abs. 2 Prämienverbilligungsgesetz, Quelle [2]

> «Massgebend sind die Steuerwerte der letzten rechtskräftigen Steuerveranlagung gemäss Steuergesetz.» — § 7 Abs. 4, Quelle [2]

### Abweichung zur App
Der heutige App-Wert (maxIncome/subsidySingle LU) lag dem Unteragenten nicht vor. Belegte Vergleichsgrössen: Einzelperson Region 1 — voller Betrag 5'628 CHF/Jahr bei Einkommen 0; der Abbau ist **nicht linear**, sondern quadratisch (Prozentsatz steigt mit dem Einkommen), Nullpunkt rechnerisch bei ≈ 44'434. Ein linearer Abbau bis maxIncome überschätzt den Anspruch im mittleren Bereich.

### Offen / nicht gefunden
- Wortlaut von § 7 Abs. 2a Prämienverbilligungsgesetz (wie genau der Pauschalbetrag von 9'000 je Kind wirkt — vermutlich Abzug vom massgebenden Einkommen) wurde beim Auslesen der SRL-Daten nicht sauber getrennt; vor dem Umsetzen im Gesetzestext prüfen.
- Rundungsregel: Berechnungsbeispiel [4] sagt «Ungerade Beträge runden wir auf» — Genauigkeit (Franken?) nicht präzisiert.
- Merkblatt «Prämienverbilligung 2026 Anspruch» (Nr. 02/25) unter der alten Adresse https://www.was-luzern.ch/sites/default/files/documents/AK_Merkblatt_IPV_0.pdf → HTTP 404; ebenso die alte Richtprämien-Adresse mit «2026%20-%20Richtpr…» → HTTP 404. Genutzt wurde die neue Adresse [3].
- Faktoren 2027 werden laut WAS «erst Mitte November 2026 festgelegt»; Anmeldung 2027 läuft (Frist 31.10.2026).

### Quellen
1. Verordnung zum Gesetz über die Verbilligung von Prämien der Krankenversicherung (Prämienverbilligungsverordnung), SRL Nr. 866a, Kanton Luzern, Version in Kraft seit 01.01.2026 (Beschlussdatum 04.11.2025). https://srl.lu.ch/app/de/texts_of_law/866a (Daten über https://srl.lu.ch/api/de/texts_of_law/866a/show_as_json) — abgerufen 16.09.2026
2. Gesetz über die Verbilligung von Prämien der Krankenversicherung (Prämienverbilligungsgesetz), SRL Nr. 866, Kanton Luzern, Version in Kraft seit 01.07.2021. https://srl.lu.ch/app/de/texts_of_law/866 — abgerufen 16.09.2026
3. Richtprämien 2026 für die Berechnung der Prämienverbilligung im Kanton LU / Prämienregionen 2026, WAS Ausgleichskasse Luzern, November 2025 (PDF). https://www.was-luzern.ch/sites/default/files/documents/2026_Richtpr%C3%A4mien_Pr%C3%A4mienregion.pdf — abgerufen 16.09.2026
4. Berechnungsbeispiel Prämienverbilligung / Anspruch Prämienverbilligung 2026, WAS Ausgleichskasse Luzern, ohne Datum (PDF). https://www.was-luzern.ch/sites/default/files/documents/AK_IPV_Merkblatt_Berechnungsbeispiel_2026.pdf — abgerufen 16.09.2026
5. Berechnung der Prämienverbilligung (Online-Rechner-Seite), WAS Luzern. https://www.was-luzern.ch/berechnung-ipv — abgerufen 16.09.2026
6. News «Prämienverbilligung 2026 – jetzt anmelden», WAS Luzern, 18.08.2025 («Die Anmeldefrist läuft bis am 31. Oktober 2025.»). https://www.was-luzern.ch/news/praemienverbilligung-2026-jetzt-anmelden — abgerufen 16.09.2026

### Nachprüfung 23.09.2026 (K31, Einbau in die App)

Alle Quellen an diesem Tag neu abgerufen. **Gegenprobe je Adresse** mit einer erfundenen
Variante, weil manche Rechtssammlungen für jeden Pfad dieselbe Hülle liefern (Befund BELEX
23.09.2026). Nur wo echt und erfunden verschieden antworten, gilt der Abruf als Beleg.

| Adresse | echt | erfunden |
|---|---|---|
| `https://srl.lu.ch/api/de/texts_of_law/866a/show_as_json` | 200, 286'349 B, JSON | `…/866a9/…` → **404**, 0 B |
| `https://srl.lu.ch/api/de/texts_of_law/866/show_as_json` | 200, 179'651 B, JSON | `…/866zz/…` → **404**, 0 B |
| `https://www.was-luzern.ch/sites/default/files/documents/2026_Richtpr%C3%A4mien_Pr%C3%A4mienregion.pdf` | 200, 197'304 B, PDF | `…Pr%C3%A4mienregionXX.pdf` → **404**, HTML |
| `https://www.was-luzern.ch/sites/default/files/documents/AK_IPV_Merkblatt_Berechnungsbeispiel_2026.pdf` | 200, 293'506 B, PDF | `…Berechnungsbeispiel_2099.pdf` → **404**, HTML |
| `https://www.was-luzern.ch/praemienverbilligung` | 200 | `…praemienverbilligungxyz` → **404** |
| `https://www.lu.ch/verwaltung/GSD/Praemienverbilligung` (Link der App) | 200 | `…PraemienverbilligungXYZ` → **404** |

🛑 **Die `/app/…`-Adressen der SRL sind NICHT der Beleg**, sondern die `/api/…`-Adressen oben —
dieselbe Falle wie bei BELEX. Der Wortlaut unten stammt aus dem JSON (`selected_version`),
Version der Verordnung: «Aktuelle Version in Kraft seit: 01.01.2026 (Beschlussdatum:
04.11.2025)», `future_versions`: 0. Gesetz: «in Kraft seit: 01.07.2021», `future_versions`: 0.

**Verordnung SRL 866a** (Wortlaut):

> § 2 Abs. 1: «Ein Anspruch auf Prämienverbilligung nach § 7 Absatz 1 des Gesetzes über die Verbilligung von Prämien der Krankenversicherung (Prämienverbilligungsgesetz) vom 24. Januar 1995 besteht für das Jahr 2026, soweit die anrechenbaren Prämien das massgebende Einkommen um einen bestimmten Prozentsatz übersteigen. Dieser Prozentsatz beträgt für das Jahr 2026 mindestens 10 Prozent. Für jeden Franken des massgebenden Einkommens steigt er um 0,00006 Prozentpunkte an.»

> § 2a Abs. 1: «Eltern oder Elternteile, unter deren Obhut Kinder bis zum vollendeten 18. Lebensjahr leben, haben für das Jahr 2026 Anspruch auf die Verbilligung der anrechenbaren Prämien für Kinder um 80 Prozent, sofern die persönlichen Voraussetzungen gemäss § 5 des Prämienverbilligungsgesetzes erfüllt sind und ihr massgebendes Einkommen im Sinn von § 7 Absätze 2–6 des Prämienverbilligungsgesetzes eine bestimmte Einkommensgrenze nicht überschreitet. Diese Einkommensgrenze beträgt für das Jahr 2026 a. bei Eltern Fr. 96 392.– b. bei einem Elternteil Fr. 77 114.–»

> § 2a Abs. 2 (junge Erwachsene, nicht gebaut): «… werden für das Jahr 2026 um die Hälfte verbilligt, sofern diese … eine mindestens sechs Monate dauernde Ausbildung absolvieren, welche einen Anspruch auf eine Ausbildungszulage … begründet.»

> § 2b: «Prämienverbilligungen gemäss § 2a sind von den Leistungen, die gemäss § 2 festgesetzt werden, abzuziehen.»

> § 3 Abs. 1: Richtprämien pro Jahr in Franken — Region 1: Erwachsene 5628.–, junge Erwachsene 4044.–, Kinder 1308.–; Region 2: 5304.– / 3780.– / 1224.–; Region 3: 5100.– / 3660.– / 1176.–

> § 3a: BVG-Einkäufe werden hinzugerechnet, «soweit sie 20 000 Franken pro Steuerjahr übersteigen.»

> § 3b: «Der Pauschalbetrag für Kinder und junge Erwachsene in Ausbildung im Sinn von § 7 Absatz 2 des Prämienverbilligungsgesetzes beträgt pro Kind oder jungen Erwachsenen in Ausbildung 9000 Franken.»

> § 7: «Liegt der gesamte Anspruch auf Prämienverbilligung unter 100 Franken, wird der Betrag nicht ausbezahlt.»

**Gesetz SRL 866** (Wortlaut):

> § 5 Abs. 2: «Personen, die gemeinsam besteuert werden, haben einen Gesamtanspruch auf Prämienverbilligung, der bei getrennter Auszahlung nach Anzahl der berechtigten Personen aufgeteilt wird. Eine Teilzahlung darf in keinem Fall die anrechenbare Prämie der berechtigten Person übersteigen.»

> § 5 Abs. 3: «Massgebend sind die persönlichen und familiären Verhältnisse am 1. November des Jahres vor dem Jahr, für das Prämienverbilligung beansprucht wird.»

> § 7 Abs. 2 (Auszug): «… ist vom Nettoeinkommen gemäss der Steuerveranlagung auszugehen. … Hinzuzuzählen sind … b. Beiträge an anerkannte Formen der Selbstvorsorge gemäss § 40 Absatz 1e des Steuergesetzes, … e. 10 Prozent des Reinvermögens; als Reinvermögen gilt das Vermögen vor Abzug der steuerfreien Beträge gemäss § 52 des Steuergesetzes … Davon abzuziehen sind die krankheits-, unfall- und behinderungsbedingten Kosten (§ 40 Abs. 1h Steuergesetz) sowie ein Pauschalbetrag von mindestens 9000 Franken pro Kind und jungen Erwachsenen in Ausbildung.»

> § 7 Abs. 2ter: «Übersteigt das Reinvermögen bei Verheirateten 200 000 Franken und bei Alleinstehenden 100 000 Franken, besteht kein Anspruch auf Prämienverbilligung. Wohnen Kinder oder junge Erwachsene in Ausbildung bei den Eltern oder einem Elternteil, erhöht sich diese Vermögensgrenze um 50 000 Franken pro Kind und jungen Erwachsenen in Ausbildung.»

> § 7 Abs. 4 (Auszug): «Massgebend sind die Steuerwerte der letzten rechtskräftigen Steuerveranlagung gemäss Steuergesetz.»

> § 7 Abs. 7: «Die Prämienverbilligung darf die im Kalenderjahr geschuldeten Prämien für die Krankenpflege-Grundversicherung nicht übersteigen.»

> § 8a Abs. 2 (Auszug): «Das Gesuch um Erhöhung der Prämienverbilligung ist spätestens am letzten Tag des Jahres einzureichen, für das eine Änderung der Verhältnisse geltend gemacht wird.»

> § 12 Abs. 2/3: «Die Anmeldung ist … spätestens Ende Oktober des Vorjahres … einzureichen.» — «Wird das Gesuch erst im Jahr, für das Anspruch auf Prämienverbilligung geltend gemacht wird, eingereicht, werden nur diejenigen Prämien verbilligt, die nach der Gesuchstellung fällig werden.»

> § 8 Abs. 2/3: für EL- und Sozialhilfebeziehende «finden keine Anwendung» u. a. § 12 (Anmeldung).

**WAS, Richtprämien 2026** (Textlayer, PDF Seite 1): «Erwachsene (ab Jahrgang 2000)» ·
«junge Erwachsene (Jahrgang 2001-2007)» · «Kinder (Jahrgang 2008-2026)»; Beträge wie § 3
(Region 1: «Fr. 5'628.- … Fr. 4'044.- … Fr. 1'308.-»). Region 1 «Ebikon, Emmen, Horw, Kriens,
Luzern»; Region 2 «Adligenswil, Buchrain, Dierikon, Eich, Malters, Meggen, Meierskappel,
Neuenkirch, Nottwil, Oberkirch, Root, Rothenburg, Ruswil, Schenkon, Sempach, Sursee,
Udligenswil, Werthenstein, Wolhusen»; Region 3 «übrige Gemeinden».

**Abgleich der Regionen:** alle 79 Luzerner Gemeinden der BAG-Daten der App
(`src/data/praemienRegionen.js`) gegen diese Liste — **0 Abweichungen**, alle 24 namentlich
genannten Gemeinden gefunden; Gegenprobe mit erfundenem Namen: nicht gefunden. Als Test
festgehalten (`src/config/__tests__/ipvLuzern.test.js`).

**WAS, Berechnungsbeispiel 2026.** 🛑 Die Zahlen stehen **nur als Bild** im PDF (kein
Textlayer; `pdfimages` zeigt 5 Rasterbilder), gelesen am Seitenbild. Als Text vorhanden sind
nur die Erläuterungen, u. a.: «Für Kinder und Jugendliche in Ausbildung gibt es einen fixen
Kinderanteil, wenn das massgebende Einkommen CHF 77'114.00 bei einem Elternteil resp.
CHF 96'392.00 bei zwei Elternteilen nicht übersteigt.» · «Ungerade Beträge runden wir auf.» ·
«Der gesamte Prämienverbilligungs-Anspruch wird anteilsmässig (im Verhältnis der Richtprämie)
auf die in der Berechnung eingeschlossenen Personen aufgeteilt. Bei Kindern wird zudem 80% und
bei jungen Erwachsenen 50% der Richtprämie hinzugerechnet.»
Am Bild abgelesen (Steuerveranlagung 2024, Ehepaar, zwei Kinder): Nettoeinkommen 60'000 ·
+ 3a 5'000 · + Geschäftsverluste 7'000 · + 10 % von 25'000 Reinvermögen = 2'500 ·
− Krankheitskosten 3'000 · − Freibetrag Kinder 18'000 → **massgebend 53'500** · Prozentsatz
10.00 + 3.21 = **13.21 %** · anrechenbare Prämien **10'670.40** · fixer Kinderanteil
**1'881.60** · eigener Anteil **7'067.35** · Jahresanspruch **5'484.65** · Monatsanspruch je
Erwachsene **143.55**, je Kind **85.05**, total **457.20** / Jahr **5'486.40**.

**Was sich daraus ergibt (eigene Rechnung, kein Zitat):**
- Die Region steht im Beispiel nicht. 10'670.40 geht nur mit Region 3 auf:
  2 × 5'100 + 2 × 20 % × 1'176. Das Kind zählt in den anrechenbaren Prämien also mit den
  20 %, die der feste Anteil nicht deckt — so wirkt § 2b.
- Die Aufteilung gewichtet mit den **anrechenbaren** Prämien, nicht mit der vollen Richtprämie:
  (10'670.40 − 7'067.35) × 5'100 / 10'670.40 = 1'722.11 → 143.51 → **143.55**. Mit voller
  Gewichtung wären es 122.– im Monat.
- «Ungerade Beträge runden wir auf»: die Monatsbeträge je Person sind auf **5 Rappen
  aufgerundet** (143.51 → 143.55; 85.02 → 85.05). Die Einheit ist abgeleitet.
- Alle acht Zahlen des Beispiels rechnet die App exakt nach (Test «das amtliche
  Berechnungsbeispiel [4] — jede Zahl»).

**Erledigte offene Punkte vom 16.09.:**
- «Wie genau der Pauschalbetrag von 9000 je Kind wirkt»: ein **Abzug** vom massgebenden
  Einkommen — § 7 Abs. 2 letzter Satz [2] wörtlich («Davon abzuziehen sind … ein
  Pauschalbetrag»), bestätigt durch das Beispiel (− 18'000 für zwei Kinder).
- Rundung: siehe oben (5 Rappen je Monat und Person, abgeleitet; Frage an die WAS).

**Neu offen (in `FRAGEN-AN-DIE-AEMTER.md`, Abschnitt 7):** Rundungseinheit · Gewichtung der
Aufteilung · Kinder über der Kinder-Grenze in den anrechenbaren Prämien · Deckel § 7 Abs. 7
je Person oder je Haushalt.

**WAS-Seiten, 23.09.2026 abgerufen** (Gegenproben siehe Tabelle; `…/berechnung-ipv` → 200,
`…/berechnung-ipvxyz` → 404):
- `https://www.was-luzern.ch/praemienverbilligung`: «Bitte reichen Sie das Gesuch bis am
  31. Oktober des Vorjahres ein (Prämienverbilligung 2027 - Frist bis 31. Oktober 2026). …
  Eine rückwirkende Anmeldung ist nicht möglich.»
- `https://www.was-luzern.ch/berechnung-ipv`: «Die Faktoren für die Berechnung der
  Prämienverbilligung 2027 werden vom Regierungsrat erst Mitte November 2026 festgelegt.»

**Bewusst nicht gebaut:** Paare und mehrere Erwachsene · junge Erwachsene 19–25 · Kinder über
der Kinder-Grenze, wenn noch ein allgemeiner Anspruch bleibt (bei einer erwachsenen Person
erst ab fünf Kindern) · Quellenbesteuerte, EL- und Sozialhilfebeziehende · Werte 2027 (laut
WAS «erst Mitte November 2026»).

---

## UR — Uri

**Beurteilung:** abbildbar
**Modell (kurz):** Summe der Richtprämien (eine Prämienregion) minus Selbstbehalt 8,5 % des PV-Einkommens (Nettoeinkünfte + 15 % des steuerbaren Vermögens); bis PV-Einkommen 90'000 Kinder mind. 80 % und junge Erwachsene in Ausbildung mind. 50 % verbilligt
**Zuständig / Weg:** Sozialversicherungsstelle Uri (SVS Uri), Altdorf; automatisch von Amtes wegen für ordentlich Besteuerte mit Wohnsitz Uri am 1. Januar (Basis: Steuerveranlagung 2024); Antrag nötig für Quellenbesteuerte (bis 30. April des Anspruchsjahrs) und Zuzüger aus dem Ausland (bis 30. Juni); Auszahlung an die Krankenkasse
**Gültigkeit:** 2026 definitiv (Steuerungsgrössen in der Medienmitteilung vom 18.12.2025, bestätigt durch das amtliche Berechnungsformular 2026)

### Rechenmodell
> «Ein Anspruch auf Prämienverbilligung besteht, soweit die anrechenbaren Prämien einen vom Regierungsrat festzulegenden Prozentsatz des PV-Einkommens übersteigen.» — Art. 4 Abs. 2 Prämienverbilligungsreglement, Quelle [1]

> «Bis zur Obergrenze des mittleren PV-Einkommens werden die Prämien von Kindern um mindestens 80 Prozent und die Prämien von jungen Erwachsenen in Ausbildung um mindestens 50 Prozent verbilligt.» — Art. 4 Abs. 3, Quelle [1]

> «Bis zur Obergrenze des mittleren PV-Einkommens sind für Kinder höchstens 20 Prozent der Richtprämie und für junge Erwachsene in Ausbildung höchstens 50 Prozent der Richtprämie massgebend.» — Art. 6 Abs. 3, Quelle [1]

> «Selbstbehalt des PV-Einkommens 8,5 Prozent» — Quelle [2]

Formel (aus dem amtlichen Berechnungsformular [3]): Anspruch = max(0, Summe anrechenbare Prämien − 8,5 % × PV-Einkommen) + fixer Kinder-/Ausbildungsanteil (Kinder 80 %, junge Erw. in Ausbildung 50 % der Richtprämie, nur wenn PV-Einkommen ≤ 90'000; darüber zählen sie mit 100 % in die anrechenbaren Prämien und der fixe Anteil entfällt).

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Richtprämie Erwachsene (26 Jahre und älter) | Fr. 4'368 pro Jahr (2025: 4'164) | [2], [3] |
| Richtprämie junge Erwachsene (19–25 Jahre) | Fr. 2'844 pro Jahr (2025: 2'724) | [2], [3] |
| Richtprämie Kinder/Jugendliche (bis 18 Jahre) | Fr. 1'104 pro Jahr (2025: 1'068) | [2], [3] |
| Selbstbehalt | 8,5 % des PV-Einkommens | [2], [3] |
| Anrechnung steuerbares Vermögen | 15 % («unverändert») | [2], [3] |
| Obergrenze des mittleren PV-Einkommens (Kinder 80 % / junge Erw. in Ausbildung 50 %) | Fr. 90'000 | [2], [3] |
| Quellensteuer: PV-Einkommen | 75 % des der Quellensteuer zugrunde liegenden Einkommens | [1] Art. 7 Abs. 4 |
| EL-Beziehende | volle kantonale Durchschnittsprämie (höchstens tatsächliche Prämie) | [1] Art. 4 Abs. 4 |
| Sozialhilfe-Beziehende | volle Richtprämie | [1] Art. 4 Abs. 5 |
| Vermögensgrenze (fester Ausschluss) | keine gefunden — Vermögen wirkt nur über die 15 %-Anrechnung | [1], [3] |

Eigene Rechnung (kein Zitat): Einzelperson Erwachsene ohne Vermögen — Anspruch bei PV-Einkommen 0 = 4'368; Anspruch endet bei 4'368 / 0,085 ≈ 51'388. Ehepaar ohne Kinder: 8'736 / 0,085 ≈ 102'776. Abbau linear (8,5 Rappen je Franken).

⚠️ **Widerspruch zwischen zwei amtlichen Mitteilungen zum Vorjahreswert:** Die Medienmitteilung vom 18.12.2025 [2] nennt den Selbstbehalt 2025 in Klammern mit «9,75 %», jene vom 02.07.2026 [4] spricht von «9,25 Prozent im Vorjahr». Der Wert 2026 (8,5 %) ist in beiden gleich — für die App unerheblich, aber nicht als Vorjahreswert zitieren.

### Massgebendes Einkommen
> «Bei ordentlich besteuerten Personen bestimmt sich das PV-Einkommen aufgrund der massgebenden Nettoeinkünfte zuzüglich eines vom Regierungsrat festzulegenden Anteils des steuerbaren Vermögens.» — Art. 7 Abs. 1, Quelle [1]

> Massgebende Nettoeinkünfte: «den Einkünften (ohne Einkünfte aus Liegenschaften), wobei die Renteneinkommen aus beruflicher Vorsorge oder privater Versicherung zu 100 Prozent angerechnet werden», zuzüglich Mietwert, Miet-/Pachtzinse, Wohnrecht/Nutzniessung, «abzüglich: Liegenschaftsunterhalt und Schuldzinsen bis maximal zur Höhe des Liegenschaftsertrags, Berufskosten, berufsorientierte Aus- und Weiterbildungskosten, Unterhaltsbeiträge und Rentenleistungen, Krankheits- und Unfallkosten, behinderungsbedingte Kosten» — Art. 7 Abs. 2, Quelle [1]

> «Grundlage für die Berechnung bildet die rechtskräftige Steuerveranlagung des Steuerjahrs, das dem Anspruchsjahr zwei Jahre vorausgeht.» — Art. 7 Abs. 3, Quelle [1]

Hinweis: Uri zieht **keine** Sozialabzüge und keine BVG-/3a-Abzüge ab (Einkünfte minus nur die genannten Positionen) — das PV-Einkommen liegt damit nahe am Bruttoeinkommen minus Berufskosten.

### Abweichung zur App
Der heutige App-Wert (maxIncome/subsidySingle UR) lag dem Unteragenten nicht vor. Belegte Vergleichsgrössen: Einzelperson — voller Betrag 4'368 CHF/Jahr, Nullpunkt rechnerisch ≈ 51'388 PV-Einkommen; Uri rechnet tatsächlich linear, das App-Modell passt strukturell, wenn maxIncome = Richtprämie / 0,085 gesetzt wird.

### Offen / nicht gefunden
- Der Regierungsratsbeschluss selbst (Festlegung der Steuerungsgrössen 2026) nicht gefunden; Zahlen aus der Medienmitteilung der Direktion und dem amtlichen Berechnungsformular der SVS Uri.
- Rundungsregeln und Mindestauszahlungsbetrag nicht geprüft (Rest des Reglements ab Art. 12 nicht ausgewertet).

### Quellen
1. Reglement über die Prämienverbilligung für die Krankenpflege-Grundversicherung (Prämienverbilligungsreglement), RB 20.2213, Kanton Uri, Version in Kraft seit 01.11.2024 (Beschlussdatum 24.09.2024). https://rechtsbuch.ur.ch/app/de/texts_of_law/20.2213 (Daten über https://rechtsbuch.ur.ch/api/de/texts_of_law/20.2213/show_as_json) — abgerufen 16.09.2026
2. Medienmitteilung «22,4 Millionen Franken für die Verbilligung der Krankenkassenprämien 2026», Kanton Uri, Gesundheits-, Sozial- und Umweltdirektion, 18.12.2025 (Abschnitt «Urner Steuerungsgrössen für die Prämienverbilligung 2026»). https://www.ur.ch/mmdirektionen/131963 — abgerufen 16.09.2026
3. Berechnung Prämienverbilligung 2026 (Excel-Berechnungsformular), Sozialversicherungsstelle Uri. https://www.svsuri.ch/uploads/PDF-sonstige/SVS.Uri.IPV.Berechnungsformular_2026.xlsx — abgerufen 16.09.2026 (verlinkt auf https://www.svsuri.ch/dienstleistungen/pr%C3%A4mienverbilligung-ipv)
4. Medienmitteilung «Deutlich mehr Urner Haushalte erhalten Prämienverbilligungen», Kanton Uri, 02.07.2026. https://www.ur.ch/mmdirektionen/136717 — abgerufen 16.09.2026
5. Prämienverbilligung (IPV) — Anmeldung und Fristen, Sozialversicherungsstelle Uri, Stand ohne Datum. https://www.svsuri.ch/dienstleistungen/pr%C3%A4mienverbilligung-ipv — abgerufen 16.09.2026

---

## SZ — Schwyz

**Beurteilung:** teilweise (Betragsformel und alle Zahlen 2026 belegt; die Anspruchsgrenze hängt aber von EL-Lebensbedarf und EL-Mietzinsregion ab und ist amtlich nur als «minimales Höchsteinkommen» für Mietzinsregion 3 / Kinder unter 11 publiziert)
**Modell (kurz):** Richtprämie (90 % der EL-Durchschnittsprämie, eine Region) minus Selbstbehalt 11 % des anrechenbaren Einkommens; Anspruch nur, wenn das anrechenbare Einkommen unter Durchschnittsprämie + EL-Lebensbedarf + EL-Mietzins liegt (Stufe/Klippe, kein Auslaufen auf 0); Kinder mind. 80 %, junge Erw. in Ausbildung mind. 50 %
**Zuständig / Weg:** Ausgleichskasse Schwyz (SVA Schwyz); Anmeldung ein Jahr im Voraus (Start April 2025 für 2026); Vorjahresbezüger automatisch angemeldet, mögliche Neuberechtigte erhalten Formular; Anmelde- und Verwirkungsfrist 2026: 31. Dezember 2026 (online «IPV Digital» oder Post); Beträge unter Fr. 50 verfallen
**Gültigkeit:** 2026 definitiv (Richtprämien und Grenzwerte 2026 publiziert); Gesetzesrevision (u. a. Selbstbehalt 11 → 10 %) laut Kanton erst ab 2028 geplant — nicht belegt geprüft

### Rechenmodell
> «Berechtigte Personen erhalten Prämienverbilligung, wenn deren Richtprämie einen bestimmten Prozentsatz des anrechenbaren Einkommens (Selbstbehalt) übersteigt.» — § 6 Abs. 1 EGzKVG, Quelle [1]

> «Die Höhe der Prämienverbilligung entspricht der Differenz zwischen der Richtprämie und dem Selbstbehalt und darf die tatsächlich geschuldeten Prämien für die Krankenpflege-Grundversicherung nicht übersteigen.» — § 10 Abs. 1 EGzKVG, Quelle [1]

> Anspruch haben Personen, «deren anrechenbares Einkommen kleiner ist als die Summe der kantonalen Durchschnittsprämie und der anerkannten Ausgaben gemäss dem Bundesgesetz über Ergänzungsleistungen … für den allgemeinen Lebensbedarf und für den Mietzins» — § 5 Abs. 1 lit. c EGzKVG, Quelle [1]; für Kinder/junge Erw. in Ausbildung «erhöht sich die Summe … um 25 Prozent des Betrages für den allgemeinen Lebensbedarf» (§ 5 Abs. 2)

> «Der Selbstbehalt liegt gemäss der Volksabstimmung zur Teilrevision des EGzKVG vom 4. März 2018 bei 11 Prozent.» — Quelle [3] (gleichlautend im Merkblatt 2027 [4])

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Durchschnittsprämie Erwachsene (ab Jg. 2000) | Fr. 6'204.00 | [2] |
| Durchschnittsprämie junge Erwachsene (Jg. 2001–2007) | Fr. 4'368.00 | [2] |
| Durchschnittsprämie Kinder (Jg. 2008 und jünger) | Fr. 1'428.00 | [2] |
| Richtprämie (90 %) Erwachsene | Fr. 5'583.60 | [2] |
| Richtprämie junge Erwachsene | Fr. 3'931.20 | [2] |
| Richtprämie Kinder | Fr. 1'285.20 | [2] |
| Selbstbehalt | 11 % des anrechenbaren Einkommens | [3], [4] |
| Vermögensanteil | 10 % des Reinvermögens nach Freibetrag | [1] § 7, [2] |
| Vermögensfreibetrag | Alleinstehende 25'000 · Ehepaar 50'000 · je Kind 15'000 · je junge erw. Person in Ausbildung 15'000 | [2] |
| Vermögensobergrenze (nach Freibetrag) | Alleinstehende 250'000 · Ehepaar 500'000 | [1] § 5, [2] |
| Höchsteinkommen (minimal, Mietzinsregion 3, Kinder <11), Alleinstehende 0/1/2/3/4 Kinder | 43'554 / 56'052 / 65'845 / 74'343 / 80'161 | [2] |
| dito Ehepaar 0/1/2/3/4 Kinder | 63'573 / 74'631 / 84'184 / 90'882 / 96'700 | [2] |
| Höchstgrenze Mindestverbilligung Kinder 80 % / junge Erw. 50 %, Alleinstehende 0/1/2/3/4 Kinder | 43'554 / 63'117 / 74'491.25 / 84'306.75 / 91'222.25 | [2] |
| dito Ehepaar | 63'573 / 84'279.75 / 95'414 / 103'429.50 / 110'345 | [2] |
| Nicht ausgezahlte Kleinbeträge | unter Fr. 50.00 | [3] |

Eigene Rechnung (kein Zitat): Einzelperson ohne Vermögen — Anspruch bei 0 = 5'583.60; bei anrechenbarem Einkommen 43'554 noch 5'583.60 − 4'790.94 = 792.66; darüber (Mietzinsregion 3) **kein** Anspruch → Klippe von rund 790 CHF. Rechnerischer Nullpunkt des Selbstbehalts wäre 50'760, wird aber wegen § 5 lit. c nicht erreicht (in teureren Mietzinsregionen liegt die Grenze höher).
Plausibilität: 43'554 − 43'314 (Wert 2025 im Merkblatt 2026) = 240 = 6'204 − 5'964 (Anstieg der Durchschnittsprämie) → Grenzwert folgt § 5 lit. c (Lebensbedarf und Mietzins unverändert).

### Massgebendes Einkommen
> «Als Grundlage des anrechenbaren Einkommens gilt das Reineinkommen gemäss dem Bundesgesetz über die direkte Bundessteuer. Dieses wird erhöht um: a) 10% des Reinvermögens, von welchem Freibeträge von Fr. 25 000.-- pro erwachsene Person und Fr. 15 000.-- je Kind abgezogen werden; b) die Abzüge für den ausserordentlichen Liegenschaftsunterhalt; c) die Einkäufe in die berufliche Vorsorge (2. Säule).» — § 7 EGzKVG, Quelle [1]

> «Das Reinvermögen (Code 970) und das Reineinkommen (Code 820) gemäss der direkten Bundessteuer sind die Bemessungsgrundlagen … (in der Regel die Veranlagung 2023)» — Quelle [3]

### Abweichung zur App
Der heutige App-Wert (maxIncome/subsidySingle SZ) lag dem Unteragenten nicht vor. Belegte Vergleichsgrössen: Einzelperson — voller Betrag 5'583.60 CHF/Jahr, Höchsteinkommen (minimal) 43'554. Ein linearer Abbau auf 0 bei maxIncome bildet Schwyz falsch ab: der Abbau beträgt 11 % je Franken und bricht an der Grenze mit einem Restbetrag (~790 CHF) ab.

### Offen / nicht gefunden
- Kantonsratsbeschluss zum EGzKVG (KRBzEGzKVG, SRSZ 361.110), in dem der Selbstbehalt festgelegt ist, nicht geöffnet (geratene Asset-Adressen auf sz.ch → HTTP 403; keine direkte Quelle gefunden). 11 % stützt sich auf die amtlichen Merkblätter 2026 und 2027 der Ausgleichskasse.
- Höchsteinkommen für andere Mietzinsregionen und Kinder über 11 nicht publiziert gefunden; sie ergeben sich aus den EL-Beträgen (Lebensbedarf, Mietzinsmaxima je Region) des Bundes — für die App müssten diese separat amtlich belegt werden.
- Merkblatt 2026 [3] (Stand März 2025) nennt noch die Werte 2025 (Durchschnittsprämien, Höchsteinkommen); massgebend für 2026 sind die Grenzwerte [2].
- Gesetzesrevision (RRB 503/2025, Gegenvorschlag zur Volksinitiative) nicht ausgewertet; betrifft nach Hinweisen erst 2028.

### Quellen
1. Einführungsgesetz zum Bundesgesetz über die Krankenversicherung (EGzKVG), SRSZ 361.100, Kanton Schwyz, Stand SRSZ 1.2.2026 (PDF). https://www.sz.ch/public/upload/assets/6155/361_100.pdf — abgerufen 16.09.2026
2. Prämienverbilligung 2026 — Durchschnittsprämien, Richtprämien, Kriterien Grenzwerte, Ausgleichskasse · IV-Stelle Schwyz, ohne Datum (PDF). https://www.sva-sz.ch/uploads/Dateien/Merkblaetter/Individuelle-Praemienverbilligung/Grenzwerte-IPV-2026.pdf — abgerufen 16.09.2026
3. 2026 Prämienverbilligung im Kanton Schwyz — Informationen / Berechnungshilfen, Ausgleichskasse Schwyz, Stand März 2025 (PDF). https://www.sva-sz.ch/uploads/Dateien/Formulare/Individuelle-Praemienverbilligung-IPV/2026-Praemienverbilligung-Kanton-Schwyz.pdf — abgerufen 16.09.2026
4. Merkblatt Prämienverbilligung 2027, Ausgleichskasse Schwyz (PDF; Beispielrechnung mit Richtprämie 5'583.60 und 11 %). https://www.sva-sz.ch/uploads/Dateien/Merkblaetter/Individuelle-Praemienverbilligung/Merkblatt-IPV-2027.pdf — abgerufen 16.09.2026
5. Prämienverbilligung (IPV), SVA Schwyz (Frist 31.12.2026). https://www.sva-sz.ch/dienstleistungen/pr%C3%A4mienverbilligung-ipv — abgerufen 16.09.2026

---

## OW — Obwalden

**Beurteilung:** abbildbar
**Modell (kurz):** Richtprämie − Selbstbehalt (9,5 % des anrechenbaren Einkommens bis CHF 35'000, darüber +0,01 %-Punkt je CHF 100); Anspruch nur bei anrechenbarem Einkommen < CHF 50'000 (mit Kindern +25'000 = < 75'000); Mindestanspruch Kinder 80 %, junge Erwachsene in Ausbildung 50 %
**Zuständig / Weg:** Ausgleichskasse Obwalden (Sarnen). Antrag nötig (Einladung/Online-Formular); Frist 2026: 31. Mai 2026 (laut Merkblatt und Website abgelaufen), sonst verwirkt. EL- und Sozialhilfebeziehende ohne Antrag.
**Gültigkeit:** 2026 definitiv (Kantonsratsbeschluss vom 26.03.2026, rückwirkend in Kraft 01.01.2026; Richtprämien laut Merkblatt Stand Januar 2026)

### Rechenmodell
> «Ein Anspruch auf Prämienverbilligung besteht, soweit die kantonalen Richtprämien der obligatorischen Krankenpflegegrundversicherung den Selbstbehalt gemäss Absatz 2 übersteigen […]» — EG KVG Art. 2 Abs. 1, Quelle [2]

> «Der Selbstbehalt entspricht einem bestimmten Prozentsatz des anrechenbaren Einkommens und beträgt zwischen 9,0 und 12,0 Prozent. Der Prozentsatz verläuft linear und steigt ab einer bestimmten Grenze des anrechenbaren Einkommens an (linear-progressives System).» — EG KVG Art. 2 Abs. 2, Quelle [2]

> «Der Selbstbehalt […] beträgt für 2026 bis Fr. 35 000.– anrechenbares Einkommen 9,50 Prozent, danach steigt der Selbstbehalt pro Fr. 100.– anrechenbares Einkommen um je 0,01 Prozent.» — Kantonsratsbeschluss 2026 Ziff. 1, Quelle [1]

> «Anspruch auf Prämienverbilligung besteht, soweit die kantonale Richtprämie den gesetzlichen Selbstbehalt des anrechenbaren Einkommens übersteigt und das anrechenbare Einkommen weniger als Fr. 50 000.– beträgt.» / «Für Personen, welche Anspruch auf eine Prämienverbilligung für Kinder haben, erhöht sich das anrechenbare Einkommen um Fr. 25 000.–.» — EV KVG Art. 7 Abs. 1 und 2, Quelle [3]

Rechenweg (abgeleitet): Selbstbehalt-% = 9,5 % bei AE ≤ 35'000, sonst 9,5 % + 0,01 % × (AE − 35'000)/100; IPV = Summe der Richtprämien − Selbstbehalt-% × AE, mindestens 0, nur wenn AE < 50'000 (mit Kindern < 75'000). Kontrollwert der Quelle [4]: «Bei einem anrechenbaren Einkommen von 45'000 Franken beträgt er beispielsweise 10.5%.» Beispiel Einzelperson (abgeleitet, nicht amtlich): AE 0 → CHF 5'018.40; AE 35'000 → 5'018.40 − 3'325 = CHF 1'693.40; Anspruch endet rechnerisch bei rund AE 46'900.

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Richtprämie Erwachsene (Merkblatt: «ab Jahrgang 2000», d. h. Jg. 2000 und älter) | CHF 5'018.40 | [4] |
| Richtprämie junge Erwachsene (Jg. 2001–2007) | CHF 3'570.00 | [4] |
| Richtprämie Kinder und Jugendliche (bis Jg. 2008) | CHF 1'380.00 | [4] |
| Festlegung Richtprämien | Erw./j. Erw. 85 % der EDI-Durchschnittsprämie; Kinder 100 % | [3] Art. 5 |
| Selbstbehalt 2026 | 9,50 % bis AE 35'000; +0,01 % je CHF 100 darüber | [1] |
| Einkommensgrenze ohne Kinder | AE < CHF 50'000 | [3] Art. 7 Abs. 1, [4] |
| Einkommensgrenze mit Kindern | + CHF 25'000 (= < 75'000) | [3] Art. 7 Abs. 2, [4] |
| Mindestanspruch Kinder | 80 % der Richtprämie bei AE < 50'000; ab 4. Kind 100 % | [3] Art. 7 Abs. 4–5, [4] |
| Mindestanspruch junge Erwachsene in Ausbildung | 50 % bei eigenem AE < CHF 25'000 | [3] Art. 7 Abs. 3, [4] |
| Abzug Ehepaar / pro Kind | je CHF 7'000 | [3] Art. 7a |
| Vermögensanrechnung | 10 % des steuerbaren Vermögens | [3] Art. 7a Bst. i |
| Quellenbesteuerte | 75 % des quellensteuerpflichtigen Bruttoerwerbseinkommens 2024 | [4] |
| Bemessung | definitive Steuerveranlagung 2024 | [4] |

### Massgebendes Einkommen
> «Total der Einkünfte (Steuererklärung 2024, Ziffer 1990) – abzüglich Berufsauslagen, Unterhaltsbeiträge und dauernde Lasten, Versicherungsabzug, Krankheits-, Unfall- und Invaliditätskosten, Kinderbetreuungskosten durch Dritte, Schuldzinsen bis maximal in der Höhe des Liegenschaftsertrags, 7'000 Franken Abzug für verheiratete Paare in ungetrennter Ehe, 7'000 Franken pro Kind […] + zuzüglich allfällige Liegenschaftsverluste, 10% vom steuerbaren Vermögen» — Quelle [4] (Aufzählung zusammengezogen; Rechtsgrundlage EV KVG Art. 7a, Quelle [3])

### Abweichung zur App
App: maxIncome 42'000, subsidySingle 2'100, modelFlat. Belegt ist für eine erwachsene Einzelperson: bis CHF 5'018.40 (bei AE 0), Abbau nicht linear bis zu einer Grenze, sondern über einen progressiven Selbstbehalt; der Anspruch endet rechnerisch bei rund AE 46'900 (harte Grenze 50'000, mit Kindern 75'000). App-Höchstbetrag und Grenze sind damit zu tief, das Modell falsch bezeichnet.

### Offen / nicht gefunden
- Ob die Selbstbehalt-Steigerung stufenweise je volle CHF 100 oder stetig gerechnet wird: Wortlaut «pro Fr. 100.–» lässt beides zu; Rechner https://www.akow.ch/ipv-rechner nicht geöffnet.
- Richtprämien 2026 nur im Merkblatt [4] gefunden, kein eigener Beschluss mit den Frankenbeträgen (Rechtsgrundlage: 85 % bzw. 100 % der EDI-Durchschnittsprämie, [3] Art. 5).
- Frist: Die heute geltende EV-Fassung (in Kraft seit 01.06.2026) nennt den 30. April; für 2026 nennen Merkblatt und Website den 31. Mai 2026. Für 2027 ist mit dem 30. April zu rechnen (nicht separat bestätigt).
- EG KVG (Fassung ab 01.04.2026) weist die Festlegung des Selbstbehalts künftig dem Regierungsrat «jeweils im Vorjahr» zu; für 2026 hat noch der Kantonsrat beschlossen.
- Merkblatt-Variante ohne Datum (IPV26_Merkblatt.pdf) antwortet mit HTTP 404; verwendet wurde die Fassung «Stand Januar 2026».

### Quellen
1. GDB 851.12 Kantonsratsbeschluss über den Selbstbehalt bei der Individuellen Prämienverbilligung in der Krankenversicherung für das Jahr 2026, Kantonsrat Obwalden, vom 26.03.2026, in Kraft seit 01.01.2026 (OGS 2026, 007). https://gdb.ow.ch/app/de/texts_of_law/851.12 (Text über https://gdb.ow.ch/api/de/texts_of_law/851.12/show_as_json) — abgerufen 16.09.2026
2. GDB 851.1 Einführungsgesetz zum Krankenversicherungsgesetz (EG KVG) vom 28.01.1999, Fassung in Kraft seit 01.04.2026. https://gdb.ow.ch/app/de/texts_of_law/851.1 — abgerufen 16.09.2026
3. GDB 851.11 Verordnung zum Einführungsgesetz zum Krankenversicherungsgesetz (EV KVG) vom 28.01.1999, Fassung in Kraft seit 01.06.2026. https://gdb.ow.ch/app/de/texts_of_law/851.11 — abgerufen 16.09.2026
4. Merkblatt «Prämienverbilligung 2026», Ausgleichskasse / IV-Stelle Obwalden, Stand Januar 2026. https://www.akow.ch/uploads/PDF-Formulare-Merkblaetter/IPV/IPV26_Merkblatt_2026-01.pdf — abgerufen 16.09.2026
5. Webseite Prämienverbilligung, Ausgleichskasse Obwalden (Frist 31.05.2026 abgelaufen). https://www.akow.ch/ipv — abgerufen 16.09.2026

---

## NW — Nidwalden

**Beurteilung:** abbildbar
**Modell (kurz):** Selbstbehalt 10 % der «Summe der Steuerwerte» (Reineinkommen + Aufrechnungen + 20 % Reinvermögen); IPV = Richtprämie − Selbstbehalt; Kinder 80 % (Eltern ≤ CHF 100'000), junge Erwachsene in Ausbildung 50 %
**Zuständig / Weg:** Ausgleichskasse Nidwalden, Stans. Antrag (Formular oder online), Frist 30. April 2026 (Poststempel); mutmasslich Berechtigte erhalten das Formular bis Ende März 2026 zugestellt. EL-Beziehende (AHV/IV) brauchen keinen Antrag.
**Gültigkeit:** 2026 definitiv (Verordnung vom 09.12.2025, in Kraft seit 01.01.2026)

### Rechenmodell
> «Die Prämien werden im Rahmen der Richtprämien verbilligt, soweit sie den Selbstbehalt übersteigen.» — kKVG NW Art. 12 Abs. 1, Quelle [2]

> «Der Selbstbehalt für das Jahr 2026 beträgt 10 Prozent.» / «Der für die Berechnung des Selbstbehalts massgebende Anteil des anrechenbaren Reinvermögens beträgt 20 Prozent.» — Verordnung 2026 § 1, Quelle [1]

> «Die Prämien werden im Rahmen der Richtprämien für Kinder zu 80 Prozent vergütet, sofern die Summe der Steuerwerte der Eltern gemäss Art. 12 Abs. 2 Fr. 100'000.– nicht übersteigt.» — kKVG NW Art. 14 Abs. 1, Quelle [2]

> «Die Prämien werden im Rahmen der Richtprämien für junge Erwachsene in Ausbildung zur Hälfte vergütet.» — kKVG NW Art. 15 Abs. 1, Quelle [2]

Rechenweg (abgeleitet aus [1]/[2]): IPV = Summe der Richtprämien des Haushalts − 10 % × Summe der Steuerwerte, mindestens 0; Kinder/junge Erwachsene in Ausbildung mindestens die Sonderanteile; Plafonierung auf die effektive Prämie; Beträge unter CHF 100 werden nicht ausbezahlt.

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Richtprämie Erwachsene (Jg. 2000 und älter) | CHF 5'400 | [1] § 2 Abs. 2, [3] |
| Richtprämie junge Erwachsene (Jg. 2001–2007) | CHF 3'912 | [1] § 2 Abs. 2, [3] |
| Richtprämie Kinder (Jg. 2008 und jünger) | CHF 1'260 | [1] § 2 Abs. 2, [3] |
| Richtprämien EL-Beziehende (Erw. / j. Erw. / Kind) | CHF 5'928 / 4'296 / 1'380 | [1] § 2 Abs. 1 |
| Selbstbehalt | 10 % der Summe der Steuerwerte | [1] § 1 Abs. 1 |
| Anteil Reinvermögen | 20 % | [1] § 1 Abs. 2 |
| Kinder: besondere IPV | 80 % der Richtprämie, wenn Steuerwerte Eltern ≤ CHF 100'000 | [2] Art. 14, [3] |
| Junge Erwachsene in Ausbildung | 50 % der Richtprämie; entfällt bei Reineinkommen > CHF 30'240 | [2] Art. 15, [3] |
| Quellenbesteuerte | 80 % des der Quellensteuer zugrunde liegenden Einkommens, Periode 2025 | [1] § 4 |
| Mindestauszahlung | Beträge unter CHF 100 nicht ausbezahlt | [1] § 5 |
| Massgebende Steuerperiode | 2024 (ersatzweise 2023) | [1] § 3 |
| Gesetzlicher Rahmen Selbstbehalt | 7–11 %; Reinvermögensanteil 10–20 % | [2] Art. 12 Abs. 3 |

Wörtlich zum Grenzwert junge Erwachsene: «Übersteigt das Reineinkommen eines jungen Erwachsenen den Betrag von CHF 30'240, entfällt die Berechtigung ganz.» — Quelle [3] (im Gesetz: «Höchstbetrag der vollen AHV-Altersrente», [2] Art. 15 Abs. 3).

### Massgebendes Einkommen
> «Die massgebenden finanziellen Verhältnisse ergeben sich aus dem Reineinkommen (Code 330 der Veranlagungsverfügung) samt Aufrechnungen* und 20 Prozent des Reinvermögens (Code 470). Dieser Betrag wird als Summe der Steuerwerte bezeichnet.» — Quelle [3]

> «Zum Reineinkommen werden aufgerechnet: Einkommen nach dem vereinfachten Abrechnungsverfahren; Einkauf in die berufliche Vorsorge; Abzug aus dem Teileinkünfteverfahren und Abzug für Liegenschaftsunterhalt, abzüglich 15 Prozent der Erträge privater Liegenschaften.» — Quelle [3] (entspricht [2] Art. 12 Abs. 2; dort BGSA-Lohn zu 80 %)

### Abweichung zur App
App: maxIncome 45'000, subsidySingle 2'250, linearer Abbau. Belegt ist für eine erwachsene Einzelperson ohne Vermögen: CHF 5'400 bei Steuerwerten 0, Abbau um 10 Rappen je Franken, null bei Summe der Steuerwerte CHF 54'000 (Auszahlung erst ab CHF 100, also praktisch bis 53'000). Die App gibt also einen zu tiefen Höchstbetrag und eine zu tiefe Grenze an. Die Grenze gilt zudem nicht für das Einkommen allein, sondern für die Steuerwerte inkl. 20 % des Reinvermögens.

### Offen / nicht gefunden
- Online-Rechner der AK NW (https://www.aknw.ch/online-services/online-rechner/provisorische-berechnung-des-anspruchs-auf-praemienverbilligung) nicht geöffnet; für das Modell nicht nötig.
- Ob für junge Erwachsene ohne Ausbildung Besonderes gilt: nur die allgemeine Regel (Richtprämie CHF 3'912 minus Selbstbehalt) belegt.
- Wie Kinder in der allgemeinen IPV genau verrechnet werden (Reihenfolge der Sonder- und der allgemeinen IPV), ist nur allgemein belegt («wird diese zusätzlich ausgerichtet»).

### Quellen
1. NG 742.111 Verordnung zur Prämienverbilligung für das Jahr 2026, Regierungsrat Nidwalden, vom 09.12.2025, in Kraft seit 01.01.2026. https://gesetze.nw.ch/app/de/texts_of_law/742.111 (Text über https://gesetze.nw.ch/api/de/texts_of_law/742.111/show_as_json) — abgerufen 16.09.2026
2. NG 742.1 Einführungsgesetz zum Bundesgesetz über die Krankenversicherung (kKVG) vom 25.10.2006, aktuelle Fassung. https://gesetze.nw.ch/app/de/texts_of_law/742.1 (Text über https://gesetze.nw.ch/api/de/texts_of_law/742.1/show_as_json) — abgerufen 16.09.2026
3. Merkblatt «Prämienverbilligung 2026 im Kanton Nidwalden», Ausgleichskasse Nidwalden, Stand Februar 2026. https://www.aknw.ch/uploads/PDF-Formulare-Merkbl%C3%A4tter/IPV-OKP-KVGRegress/Merkblatt-Praemienverbilligung-2026.pdf — abgerufen 16.09.2026

---

## GL — Glarus

**Beurteilung:** teilweise
**Modell (kurz):** Richtprämie − Selbstbehalt; Selbstbehalt in Stufen 9–14 % des ganzen anrechenbaren Einkommens (bis 40'000: 9 % … über 80'000: 14 %); Kinder mind. 80 %, junge Erwachsene in Ausbildung mind. 50 % bei Haushalts-AE ≤ CHF 85'000; Richtprämie = 85 % (Kinder 100 %) der EDI-Durchschnittsprämie
**Zuständig / Weg:** Kantonale Steuerverwaltung Glarus, Fachstelle IPV. Antrag jedes Jahr (Papier oder my.gl.ch), Frist 31. Januar 2026; später eingereichte Anträge gelten erst ab dem Folgemonat. EL-/Sozialhilfebeziehende ohne Antrag.
**Gültigkeit:** 2026 definitiv für Modell und Sätze (PVV Stand 01.01.2020, Merkblatt 2026); Richtprämien 2026 in Franken nicht in einer kantonalen Quelle gelesen (nur abgeleitet)

### Rechenmodell
> «Die Prämienverbilligung entspricht der Differenz zwischen Richtprämie und Selbstbehalt, höchstens aber der effektiven Jahresprämie für die obligatorische Krankenpflegeversicherung der anspruchsberechtigten Person.» — EG KVG Art. 14 Abs. 1, Quelle [2]

> «Der Selbstbehalt entspricht einem vom Landrat nach Einkommenskategorien festgelegten prozentualen Anteil des anrechenbaren Einkommens.» — EG KVG Art. 14 Abs. 3, Quelle [2]

> «a. bis 40 000 Franken anrechenbares Einkommen: 9 %; b. bis 50 000 Franken anrechenbares Einkommen: 10 %; c. bis 60 000 Franken anrechenbares Einkommen: 11 %; d. bis 70 000 Franken anrechenbares Einkommen: 12 %; e. bis 80 000 Franken anrechenbares Einkommen: 13 %; f. über 80 000 Franken anrechenbares Einkommen: 14 %.» — PVV Art. 1, Quelle [1]

> «Die Richtprämien je Personenkategorie entsprechen den folgenden Anteilen an den vom Bund jährlich festgelegten Durchschnittsprämien […]: a. für Erwachsene (über 25 Jahre): 85 %; b. für junge Erwachsene (18–25 Jahre): 85 %; c. für Kinder: 100 %.» — VV PV Art. 10 Abs. 1, Quelle [3]

> «Der Kanton verbilligt die Prämien der Kinder um 80 Prozent und die Prämien der jungen Erwachsenen in Ausbildung um 50 Prozent der jeweiligen Richtprämie, sofern die Berechnung gemäss Artikel 14 Absatz 1 einen tieferen Anspruch auf Prämienverbilligung ergibt und das anrechenbare Einkommen einen vom Landrat festgelegten Grenzbetrag nicht übersteigt.» — EG KVG Art. 16 Abs. 3, Quelle [2]; «Der Grenzbetrag im Sinne von Artikel 16 Absatz 3 EG KVG beträgt 85 000 Franken.» — PVV Art. 4, Quelle [1]

Rechenweg (abgeleitet): Der Satz der Einkommensstufe gilt nach Wortlaut von Art. 14 Abs. 3 auf das ganze anrechenbare Einkommen (kein Grenzsteuer-Prinzip) → Sprünge an den Stufengrenzen. Die massgebende Prämie ist die Summe der Richtprämien des Haushalts ([3] Art. 9 Abs. 1); IPV unter CHF 12 je Person und Jahr wird nicht ausgerichtet ([3] Art. 9 Abs. 3).

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Selbstbehalt-Stufen | 9 % (≤ 40'000) · 10 % (≤ 50'000) · 11 % (≤ 60'000) · 12 % (≤ 70'000) · 13 % (≤ 80'000) · 14 % (> 80'000) | [1] Art. 1 |
| Grenzbetrag Mindestanspruch Kinder / junge Erw. in Ausbildung | CHF 85'000 anrechenbares Einkommen | [1] Art. 4, [4] |
| Mindestanspruch | Kinder 80 %, junge Erwachsene in Ausbildung 50 % der Richtprämie | [2] Art. 16 Abs. 3 |
| Richtprämien-Regel | Erw. und junge Erw. 85 %, Kinder 100 % der EDI-Durchschnittsprämie | [3] Art. 10 |
| EDI-Durchschnittsprämie GL 2026 (Erw. / j. Erw. / Kind) | CHF 6'408 / 4'584 / 1'500 | [5] |
| Richtprämie Erwachsene 2026 (abgeleitet, 85 % von 6'408) | CHF 5'446.80 — **nicht kantonal publiziert gelesen** | [3]+[5] |
| Richtprämie junge Erwachsene 2026 (abgeleitet, 85 % von 4'584) | CHF 3'896.40 — **nicht kantonal publiziert gelesen** | [3]+[5] |
| Richtprämie Kinder 2026 (abgeleitet, 100 %) | CHF 1'500 — **nicht kantonal publiziert gelesen** | [3]+[5] |
| Vermögensanrechnung | 10 % des steuerbaren Vermögens | [1] Art. 2 |
| Kinderabzug | CHF 5'000 je minderjähriges Kind und jungen Erwachsenen in Ausbildung | [1] Art. 3 |
| Mindestauszahlung | CHF 12 je Person und Jahr | [3] Art. 9 Abs. 3 |
| Bemessung | definitive Steuerveranlagung 2024 | [4] |
| Eigenes Gesuch Kind in Ausbildung | wenn Nettoerwerbseinkommen > CHF 14'000 | [4] Ziff. 6 |

Plausibilitätsprobe der Ableitungsmethode: Für OW ergibt 85 % × 5'904 (EDI) genau die dort amtlich publizierte Richtprämie 5'018.40; für GL ist die kantonale Frankenzahl dennoch nicht gelesen.

### Massgebendes Einkommen
> «Anrechenbares Einkommen = Total der Einkünfte + zehn Prozent des steuerbaren Vermögens + Unterhaltskosten für Liegenschaften + mit der AHV direkt abgerechnete Nebenerwerbe - Mietwert von Liegenschaften oder Liegenschaftsteilen, die aufgrund von Eigentum oder eines unentgeltlichen Nutzungsrechts für den Eigengebrauch zur Verfügung stehen - 5000 Franken für jedes minderjährige Kind - Alimente für die geschiedenen oder getrennt lebenden Ehepartner und für minderjährige Kinder.» — Merkblatt 2026, Fussnote 1, Quelle [4] (Rechtsgrundlage PVV Art. 2–3, dort Kinderabzug auch für junge Erwachsene in Ausbildung)

> «Bei Personen, die einen Gesamtanspruch haben, werden die anrechenbaren Einkommen zusammengezählt.» — EG KVG Art. 15 Abs. 2, Quelle [2]

### Abweichung zur App
App: maxIncome 42'000, subsidySingle 2'100, modelFlat, Hinweis «automatisch aus Steuerdaten». Belegt ist ein Selbstbehalt-Modell mit Antrag (Frist 31. Januar), nicht automatisch. Mit der abgeleiteten Richtprämie 5'446.80 erhielte eine Einzelperson bis zu CHF 5'446.80 (AE 0), bei AE 40'000 CHF 1'846.80, bei AE 50'000 CHF 446.80, über 50'000 nichts; der App-Wert liegt damit deutlich zu tief (Richtprämie aber nur abgeleitet).

### Offen / nicht gefunden
- Kantonal publizierte Richtprämien 2026 in Franken (laut Merkblatt im Amtsblatt, im Online-Schalter und in der Zeitung «Fridolin»): Die HTML-Seiten von gl.ch antworten auf Abruf mit **HTTP 403** («Zugriff verweigert»), auch https://www.gl.ch/verwaltung/finanzen-und-gesundheit/steuern/individuelle-praemienverbilligung-ipv.html/502. Nur die PDFs waren lesbar; das Anmeldeformular 2026 enthält keine Beträge.
- Stufenlogik: Wortlaut spricht für den Satz auf das ganze Einkommen; nicht durch einen Rechner oder ein Rechenbeispiel bestätigt.
- EG KVG ist in der aktuellen Fassung «in Kraft seit: 01.01.2023 bis: 31.12.2026»; eine Umstellung auf automatische IPV (Landsgemeinde 2026) ist in Pressemitteilungen von gl.ch angekündigt, aber wegen 403 nicht gelesen. Für 2027 neu prüfen.
- Der Grenzbetrag 85'000 steht im Merkblatt nur für Kinder; das Gesetz knüpft beide Mindestansprüche (Kinder und junge Erwachsene in Ausbildung) daran.

### Quellen
1. GS VIII D/21/3 Verordnung über die Prämienverbilligung (Prämienverbilligungsverordnung; PVV), Landrat Glarus, vom 21.12.2016, Stand 01.01.2020. https://gesetze.gl.ch/app/de/texts_of_law/VIII%20D/21/3 (Text über die API show_as_json) — abgerufen 16.09.2026
2. GS VIII D/21/1 Einführungsgesetz zum Bundesgesetz über die Krankenversicherung (EG KVG), vom 03.05.2015, Fassung in Kraft 01.01.2023 bis 31.12.2026. https://gesetze.gl.ch/app/de/texts_of_law/VIII%20D/21/1 — abgerufen 16.09.2026
3. GS VIII D/21/2 Verordnung über den Vollzug der Prämienverbilligung (VV PV), vom 23.12.2013, Stand 01.01.2020. https://gesetze.gl.ch/app/de/texts_of_law/VIII%20D/21/2 — abgerufen 16.09.2026
4. «Individuelle Prämienverbilligung (IPV) der obligatorischen Krankenpflegeversicherung — Merkblatt für das Jahr 2026», Kantonale Steuerverwaltung Glarus, Fachstelle IPV (ohne Datum, Jahr 2026). https://www.gl.ch/public/upload/assets/63123/02%20Merkblatt%20IPV%202026.pdf?fp=1 — abgerufen 16.09.2026
5. Verordnung des EDI über die Durchschnittsprämien der Krankenpflegeversicherung für die Berechnung der EL und ÜL, Anhang (Art. 3), Inkrafttreten 1. Januar 2026, Ziff. 3 (Kantone mit einer Prämienregion). https://www.bsv.admin.ch/dam/de/sd-web/juMQ1SfoExDq/DE%20Anhang%20(Art.%203)%20Durchschnittspr%C3%A4mien%202026.pdf — abgerufen 16.09.2026
6. Anmeldeformular Prämienverbilligung IPV 2026 (Frist 31. Januar 2026, Bearbeitung bis Ende Juni 2026). https://www.gl.ch/public/upload/assets/63122/01%20Anmeldeformular%20Pr%C3%A4mienverbilligung%20IPV%202026.pdf?fp=1 — abgerufen 16.09.2026

---

## ZG — Zug

**Beurteilung:** teilweise
**Modell (kurz):** Richtprämien − Selbstbehalt 8 % des massgebenden Einkommens; reduzierter Anspruch bei ME 70'000–89'900 (−0,5 % je CHF 100 über 70'000), darüber kein Anspruch; tiefere Grenzen für Einzelpersonen (Betrag nicht publiziert gefunden); Kinder/junge Erw. in Ausbildung mind. 80 % / 50 %
**Zuständig / Weg:** Ausgleichskasse Zug (Durchführung), Gemeindestellen (Eingang Papierformular). Antrag nötig (online mit Login aus dem Schreiben oder Papier), Frist 30. April 2026 (abgelaufen); EL-Beziehende automatisch.
**Gültigkeit:** 2026 definitiv (Werte vom Regierungsrat für 2026 festgelegt, laut Broschüre Stand Dezember 2025)

### Rechenmodell
> «Die massgebenden Prämien werden verbilligt, soweit sie einen vom Regierungsrat festgelegten Prozentsatz des massgebenden Einkommens übersteigen.» — IPVG § 6 Abs. 1, Quelle [2]

> «Sie haben Anspruch auf Prämienverbilligung, wenn die gesamten Richtprämien höher sind als 8 % Ihres massgebenden Einkommens. Die Differenz zwischen diesem Selbstbehalt und den Richtprämien wird verbilligt.» — Quelle [1], S. 5

> «Pro Fr. 100.–, die das massgebende Einkommen von Fr. 70’000.– übersteigen, reduziert sich Ihr Anspruch um 0,5 %. Für die Berechnung des Reduktionsfaktors wird das massgebende Einkommen auf die nächsten Fr. 100.– aufgerundet. Übersteigt ihr massgebendes Einkommen die Obergrenze von Fr. 89’900.–, besteht kein Anspruch auf Prämienverbilligung.» — Quelle [1], S. 5

> «Die Grenzwerte für das massgebende Einkommen fallen bei Einzelpersonen und gewissen Haushalten mit nur einer erwachsenen Person tiefer aus.» — Quelle [1], S. 5

Rechenweg (abgeleitet): IPV = (Summe Richtprämien − 8 % × ME) × Reduktionsfaktor; Reduktionsfaktor = 1 bis ME 70'000, sonst 1 − 0,005 × (aufgerundetes ME − 70'000)/100; 0 über 89'900. Beispiel Einzelperson ohne Reduktion (abgeleitet): ME 0 → CHF 4'984.80; Anspruch endet bei ME 62'310 (4'984.80 / 8 %), sofern die tiefere Einzelpersonen-Grenze nicht früher greift — diese ist nicht beziffert.

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Richtprämie Erwachsene | CHF 4'984.80 | [1] S. 4 |
| Richtprämie junge Erwachsene (Jg. 2001–2007) | CHF 3'472.80 | [1] S. 4 |
| Richtprämie Kinder und Jugendliche (Jg. 2008–2025) | CHF 1'224.00 | [1] S. 4 |
| Selbstbehalt | 8 % des massgebenden Einkommens | [1] S. 5 |
| Beginn reduzierter Anspruch (Haushalte) | ME CHF 70'000; −0,5 % je CHF 100 | [1] S. 5 |
| Obergrenze (Haushalte) | ME CHF 89'900 | [1] S. 5 |
| Grenzen Einzelpersonen / Einelternhaushalte | «tiefer» — **Betrag nicht gefunden** | [1] S. 5 |
| Mindestanspruch (nur bei nicht reduziertem Anspruch) | Kinder mind. 80 %, junge Erw. in Ausbildung mind. 50 % der Richtprämie | [1] S. 5 |
| Kinderabzug | CHF 8'500 pro Kind | [2] § 6 Abs. 1, [3] § 1 |
| Vermögenszuschlag | 10 % des Reinvermögens | [3] § 1 |
| Mindestauszahlung | Beiträge unter CHF 50 pro Jahr nicht ausbezahlt | [1] S. 6 |
| Bemessung | definitive Steuerveranlagung 2024 (Zuzug 2025 und 19-Jährige: 2025) | [1] S. 4 |
| Neuberechnung | wenn ME 2025 mindestens 25 % tiefer als 2024, Gesuch innert 20 Tagen nach Verfügung | [1] S. 4, [2] § 6ter |

Hinweis: Das Gesetz ([2] § 7bis) nennt als Mindestanspruch «mindestens die Hälfte der für sie massgebenden Prämie» für Kinder und junge Erwachsene in Ausbildung; die Broschüre 2026 nennt für Kinder 80 %. Die 80 % sind damit durch Regierungsratsfestlegung/Praxis belegt, nicht durch den Gesetzeswortlaut.

### Massgebendes Einkommen
> «a) Reineinkommen gemäss kantonalem Steuergesetz; b) zuzüglich 10 % des Reinvermögens gemäss kantonalem Steuergesetz; b1) zuzüglich allfällig abgezogener, freiwilliger Einkäufe in die 2. Säule […]; c) zuzüglich allfällig abgezogener Beiträge an die gebundene Selbstvorsorge (Säule 3a) […]; c1) zuzüglich das Total der Liegenschaftsunterhaltskosten […], soweit diese 20 % des Totals der steuerbaren Bruttoerträge der Liegenschaften des Privatvermögens […] übersteigen; d) abzüglich Kinderabzug in der Höhe von 8500 Franken pro Kind.» — Verordnung IPVG § 1 Abs. 1, Quelle [3]

Der Online-Rechner der AK Zug fragt entsprechend: Reineinkommen (Code 299), Beiträge Säule 2 (Code 250/251), Säule 3a (Code 220/221), Reinvermögen (Code 660), Steuerperiode 2024 — Quelle [4].

### Abweichung zur App
App: maxIncome 60'000, subsidySingle 3'600, linearer Abbau. Belegt ist für eine erwachsene Einzelperson ein Höchstbetrag von CHF 4'984.80 (bei ME 0) und ein Abbau um 8 Rappen je Franken, rechnerisch null bei ME 62'310; die App liegt beim Höchstbetrag zu tief, die Grenze ist ähnlich, aber die tiefere amtliche Einzelpersonen-Grenze ist nicht beziffert.

### Offen / nicht gefunden
- **Einkommensgrenzen für Einzelpersonen und Einelternhaushalte** (Beginn Reduktion, Obergrenze): nur «tiefer» belegt, keine Zahl. Der Online-Rechner (Quelle [4]) rechnet serverseitig; ich habe ihn nicht mit Testwerten abgeschickt (Formularversand). Der zugrunde liegende Regierungsratsbeschluss 2026 ist nicht in der BGS erfasst und wurde nicht gefunden.
- Die Medienmitteilung des Kantons vom 26.01.2026 (Quelle [5]) bestätigt Frist und Verfahren, nennt aber keine Parameter.
- Die Broschüre verweist auf eine «Berechnungsvorlage in diesem Dokument»; im Textlayer ist keine enthalten (die zwei eingebetteten Bilder wurden nicht ausgewertet).

### Quellen
1. «Prämienverbilligung 2026 im Kanton Zug — Informationen und Adressen» (Broschüre), Ausgleichskasse / IV-Stelle Zug, PDF erstellt 12.12.2025. https://www.akzug.ch/uploads/PDF-sonstige/Broschuere_IPV_2026.pdf — abgerufen 16.09.2026
2. BGS 842.6 Gesetz betreffend individuelle Prämienverbilligung in der Krankenpflegeversicherung (IPVG), vom 15.12.1994, Stand 01.01.2025. https://bgs.zg.ch/app/de/texts_of_law/842.6 (Text über https://bgs.zg.ch/api/de/texts_of_law/842.6/show_as_json) — abgerufen 16.09.2026
3. BGS 842.61 Verordnung zum Gesetz betreffend individuelle Prämienverbilligung, vom 19.12.2017, Stand 01.01.2021. https://bgs.zg.ch/app/de/texts_of_law/842.61 — abgerufen 16.09.2026
4. Online-Rechner «Prämienverbilligung 2026 – provisorische Berechnung als Einzelperson», Ausgleichskasse Zug. https://www.akzug.ch/online-services/online-rechner/praemienverbilligung-2026-provisorische-berechnung-des-anspruches/praemienverbilligung-2025-provisorische-berechnung-als-einzelperson — abgerufen 16.09.2026 (nur Eingabefelder gelesen)
5. Medienmitteilung «Gezielte Zusatzentlastung bei den Krankenkassenprämien», Kanton Zug, 26.01.2026. https://zg.ch/news/news~_2026_1_gezielte-zusatzentlastung-bei-den-krankenkassenpraemien~.html — abgerufen 16.09.2026
6. Webseite «Prämienverbilligung (IPV)», Ausgleichskasse Zug (Frist 30.04.2026 abgelaufen). https://www.akzug.ch/dienstleistungen/praemienverbilligung — abgerufen 16.09.2026

---

## FR — Freiburg / Fribourg

**Beurteilung:** abbildbar
**Modell (kurz):** Prozent der regionalen Durchschnittsprämie (1 %–65 %) nach Tabelle, abhängig davon, um wie viel Prozent das anrechenbare Einkommen unter der gesetzlichen Grenze liegt (Einzelperson 37'000; Paar 65'000; Alleinerziehende 43'400; +14'000 je Kind); Kinder mind. 80 %, junge Erw. in Ausbildung mind. 50 %; 2 Prämienregionen
**Zuständig / Weg:** Caisse cantonale de compensation AVS (ECAS), Givisiez. Antrag (Formular «Demande de réduction des primes 2026» oder online), Frist 31. August 2026 (Eingang); Anspruch frühestens ab dem Monat der Einreichung. Bisherige Bezügerinnen und Bezüger werden von Amtes wegen geprüft; EL-Beziehende ohne Antrag.
**Gültigkeit:** 2026 definitiv (Mémento 2026; ORP-Fassung in Kraft seit 01.01.2024; Durchschnittsprämien 2026 im Mémento)

### Rechenmodell
> «La réduction est calculée en pour-cent d'une moyenne des primes retenues par les assureurs. Elle ne peut dépasser 100 % de la prime nette due par l'assuré pour l'assurance de base.» — LALAMal art. 15 al. 1, Quelle [3]

> «Pour 2026, la réduction est calculée en pour-cent de la prime moyenne régionale pour l'assurance obligatoire des soins fixée par le Conseil d'Etat.» — Quelle [1], S. 3

> «Ont droit à une réduction minimale de 1% les assurés qui ont un revenu déterminant de moins de 1.03% inférieur à la limite légale applicable; Ont droit à une réduction maximale de 65% les assurés qui ont un revenu déterminant de 60.01% ou plus inférieur à la limite légale applicable.» — Quelle [1], S. 3 (vollständige Stufentabelle: ORP Annexe 1, Quelle [2], identisch mit Mémento S. 5–6)

> «Pour les enfants, le taux de la réduction s'élève au minimum à 80 % de la prime moyenne régionale et, pour les jeunes adultes en formation jusqu'à 25 ans, le taux de la réduction s'élève au minimum à 50 % de la prime moyenne régionale.» — ORP art. 6 al. 2, Quelle [2]

Amtliches Rechenbeispiel: «Limite de revenu CHF 93'000.-- (couple marié + 2 enfants) / Revenu déterminant CHF 62'000.-- […] Le revenu déterminant est de 33.33% […] inférieur à la limite applicable. Par conséquent, les parents ont droit à une réduction de primes de 35.71% et les enfants à une réduction de 80%.» — Quelle [1], S. 3

Rechenweg (abgeleitet): Abstand = (Grenze − anrechenbares Einkommen) / Grenze × 100; Satz aus der Tabelle (59 Stufen von 1,00 % bis 63,92 %, ab 60,01 % Abstand: 65 %); IPV je Person = Satz × Durchschnittsprämie der Region (Kinder mind. 80 %, junge Erw. in Ausbildung mind. 50 %); höchstens die Nettoprämie. Beispiel Einzelperson Region 1 (abgeleitet): Einkommen ≤ 14'796 → 65 % × 569 × 12 = CHF 4'438.20/Jahr; Einkommen knapp unter 37'000 → 1 % = CHF 68.28/Jahr; ab 37'000 nichts.

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Einkommensgrenze Einzelperson ohne Kind | CHF 37'000 | [2] art. 3, [1] |
| Einkommensgrenze Einzelperson mit Kind(ern) | CHF 43'400 + 14'000 je Kind (1 Kind: 57'400; 2: 71'400; 3: 85'400) | [2] art. 3, [1] |
| Einkommensgrenze Ehepaar / eingetragene Partnerschaft | CHF 65'000 + 14'000 je Kind (1 Kind: 79'000; 2: 93'000; 3: 107'000) | [2] art. 3, [1] |
| Ausschluss | Reineinkommen (Code 4.910) > CHF 150'000 oder steuerbares Vermögen (Code 7.910) > CHF 250'000; Veranlagung von Amtes wegen | [2] art. 4, [1] |
| Satzspanne | 1 % bis 65 % der Durchschnittsprämie, 60 Stufen | [2] Annexe 1, [1] |
| Durchschnittsprämie Region 1 (Saane/Sarine), Erwachsene | CHF 569 pro Monat (= 6'828/Jahr) | [1] Ziff. 8.1 |
| Region 1, junge Erwachsene 19–25 | CHF 415 pro Monat | [1] Ziff. 8.1 |
| Region 1, Kinder bis und mit 18 | CHF 136 pro Monat | [1] Ziff. 8.1 |
| Durchschnittsprämie Region 2 (Broye, Glâne, Gruyère, See/Lac, Sense/Singine, Vivisbach/Veveyse), Erwachsene | CHF 524 pro Monat (= 6'288/Jahr) | [1] Ziff. 8.1 |
| Region 2, junge Erwachsene 19–25 | CHF 386 pro Monat | [1] Ziff. 8.1 |
| Region 2, Kinder bis und mit 18 | CHF 124 pro Monat | [1] Ziff. 8.1 |
| Festlegung Durchschnittsprämie | 93 % des EDI-EL-Betrags, aufgerundet auf den Franken | [2] art. 6 al. 3 |
| Mindestanspruch | Kinder 80 %, junge Erw. in Ausbildung bis 25: 50 % | [2] art. 6 al. 2 |
| Vermögensanrechnung | 1/20 (5 %) des steuerbaren Vermögens | [2] art. 5, [1] |
| Quellenbesteuerte | 80 % des steuerbaren Bruttoeinkommens (Jahr x−2) + 1/20 des Vermögens | [2] art. 5 al. 2, [1] |
| Bemessung | Steuerperiode x−2 (für 2026: 2024) | [2] art. 5, [1] |

Plausibilitätsprobe (Mathematik, keine Quelle): 93 % × EDI-Jahreswert FR Region 1 (7'332 / 5'352 / 1'752, Quelle [5]) ÷ 12, aufgerundet = 569 / 415 / 136; Region 2 (6'756 / 4'968 / 1'596) = 524 / 386 / 124 — stimmt genau mit dem Mémento überein.

### Massgebendes Einkommen
> «Le revenu déterminant est donné par le revenu annuel net de l'avis de taxation du canton de Fribourg (code 4.910) de la période fiscale qui précède de deux ans l'année pour laquelle le droit à la réduction des primes est examiné (année x – 2 ans), auquel sont ajoutés: a) pour les personnes salariées ou rentières: 1. les primes et cotisations d'assurance (codes 4.110 à 4.140), 2. les intérêts passifs privés pour la part qui excède 30'000 francs (code 4.210), 3. les frais d'entretien d'immeubles privés pour la part qui excède 15'000 francs (code 4.310), 4. le vingtième (5 %) de la fortune imposable (code 7.910)» — ORP art. 5 al. 1, Quelle [2] (für Selbständige abweichende Liste in art. 5 al. 1 let. b)

Deutsche Fassung (amtlich, gleiche Quelle): «Als anrechenbares Einkommen gilt das Nettojahreseinkommen gemäss der Steuerveranlagung des Kantons Freiburg (Code 4.910) […] (Jahr x – 2 Jahre); das Einkommen wird erhöht […]» — VKP Art. 5 Abs. 1, Quelle [2]

### Abweichung zur App
App: maxIncome 48'000, subsidySingle 2'400, linearer Abbau. Belegt ist für eine alleinstehende Person ohne Kind eine Grenze von CHF 37'000 und ein Höchstbetrag von 65 % der regionalen Durchschnittsprämie (Region 1: CHF 4'438.20, Region 2: CHF 4'087.20 pro Jahr), der in 60 Stufen abnimmt. Die App-Grenze ist also zu hoch und der Höchstbetrag zu tief; der Wohnbezirk (Region) fehlt in der App.

### Offen / nicht gefunden
- Kein eigener Staatsratsbeschluss mit den Durchschnittsprämien 2026 in Franken gelesen; die Beträge stammen aus dem Mémento 2026 der ECAS und sind rechnerisch mit ORP art. 6 al. 3 und den EDI-Werten 2026 konsistent.
- Das Mémento trägt in der Fusszeile «06.2023/ECAS» (Vorlagenstand), im Titel und Inhalt aber 2026; Frist und Formular 2026 bestätigen das Jahr ([4]).
- ORP-Fassung stammt vom 09.10.2023 (in Kraft 01.01.2024); keine spätere Änderung in der BDLF verzeichnet — die Grenzen gelten also unverändert seit 2024.
- Deutschsprachige Fassung des Mémentos nicht geöffnet.

### Quellen
1. «Mémento concernant la réduction des primes d'assurance-maladie 2026», Caisse de compensation du canton de Fribourg (ECAS), 6 S., Fusszeile «06.2023/ECAS». https://assets.caisseavsfr.ch/Htdocs/Files/v/c24c23cead959f6952ac7c90174e13792ee122b03d8191e785de70ac0df833dd.pdf/memento_rpi_f_2026.pdf?download=1 — abgerufen 16.09.2026
2. RSF 842.1.13 Ordonnance concernant la réduction des primes d'assurance-maladie (ORP) / Verordnung über die Verbilligung der Krankenkassenprämien (VKP), Conseil d'Etat, du 08.11.2011, version en vigueur depuis le 01.01.2024 (adoption 09.10.2023), avec Annexe 1. https://bdlf.fr.ch/app/fr/texts_of_law/842.1.13 (PDF mit Anhang: https://bdlf.fr.ch/api/fr/versions/8445/pdf_file_with_annexes) — abgerufen 16.09.2026
3. RSF 842.1.1 Loi d'application de la loi fédérale sur l'assurance-maladie (LALAMal), du 24.11.1995. https://bdlf.fr.ch/app/fr/texts_of_law/842.1.1 — abgerufen 16.09.2026
4. «Demande de réduction des primes pour l'année 2026» (Formular, Frist 31.08.2026), ECAS. https://www.ecasfr.ch/Htdocs/Files/v/6141.pdf — abgerufen 16.09.2026; Übersichtsseite https://www.ecasfr.ch/fr/Assurances/Reduction-des-primes-d-assurance-maladie/Reduction-des-primes-d-assurance-maladie.html — abgerufen 16.09.2026
5. Verordnung des EDI über die Durchschnittsprämien der Krankenpflegeversicherung für die Berechnung der EL und ÜL, Anhang (Art. 3), Inkrafttreten 1. Januar 2026, Ziff. 2 (FR). https://www.bsv.admin.ch/dam/de/sd-web/juMQ1SfoExDq/DE%20Anhang%20(Art.%203)%20Durchschnittspr%C3%A4mien%202026.pdf — abgerufen 16.09.2026 (nur Plausibilitätsprobe)

---

## SO — Solothurn

**Beurteilung:** teilweise
**Modell (kurz):** Richtprämie (Durchschnittsprämie −30 %) minus Eigenanteil 10–16 % des massgebenden Einkommens (linear), Grenze MGE 74'000; Kinder ≥80 %, junge Erw. ≥50 % bis 74'000
**Zuständig / Weg:** Ausgleichskasse Solothurn (AKSO); Antragsformular wird ab Januar 2026 an voraussichtlich Berechtigte versandt (aus Steuerdaten), Rücksendung innert 30 Tagen, sonst verwirkt; Quellenbesteuerte: Antrag bis 31.12. des Anspruchsjahres
**Gültigkeit:** 2026 definitiv (Parameter-Verfügung Departement des Innern vom 27.01.2026)

### Rechenmodell
> «Personen, deren Aufwendungen für die Prämien der obligatorischen Krankenpflegeversicherung den vom Regierungsrat festgelegten Prozentsatz des massgebenden Einkommens übersteigen, haben Anspruch auf Beiträge zur Prämienverbilligung» — § 87 Abs. 1 SG, Quelle [3]

> «Anspruch auf Prämienverbilligung hat, wer über ein massgebendes Einkommen von 0 bis 84'000 Franken verfügt. Die prozentualen Eigenanteile werden abhängig von der Höhe des massgebenden Einkommens im Rahmen von 6 bis 12% linear festgelegt.» — § 70 Abs. 1 SV, Quelle [2] (das Departement kann Grenzwert um +/- 12'000 Fr. und Eigenanteile um +/- 4 % verändern, § 70 Abs. 2 SV)

> «Die anrechenbare Prämie entspricht für Kinder (bis zum vollendeten 18. Altersjahr), für junge Erwachsene (bis zum vollendeten 25. Altersjahr) und für ältere Versicherte (Erwachsene) je der kantonalen Durchschnittsprämie der obligatorischen Krankenversicherung minus 10%. Das Departement kann den Abschlag von 10% nach Massgabe der verfügbaren Mittel um +/- 20% verändern.» — § 68 Abs. 1 SV, Quelle [2]

> «Kindern werden die anrechenbaren Prämien bis zu einem massgebenden Einkommen von 84'000 Franken um mindestens 80% verbilligt, jungen Erwachsenen um mindestens 50%.» — § 70 Abs. 4 SV, Quelle [2]

> «Personen, die gemeinsam besteuert werden, haben einen Gesamtanspruch auf Prämienverbilligung.» — § 87 Abs. 2 SG, Quelle [3]

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Anteil des satzbestimmenden Vermögens im MGE | «50%» | [1] |
| Eigenanteile in % des massgebenden Einkommens | «10% bis 16%» | [1] |
| Einkommensgrenzwert Erwachsene | «74'000.- Franken» | [1] |
| Grenzwert 80 %-Verbilligung Kinder / 50 %-Verbilligung junge Erwachsene | «74'000.- Franken» | [1] |
| Auszahlungslimite pro erwachsene Person (darunter keine Auszahlung) | «240.- Franken» (pro Anspruchsjahr, § 70 Abs. 3 SV) | [1], [2] |
| Richtprämie Erwachsene | «422.- Franken (Durchschnittsprämie 602.- Franken)» | [1] |
| Richtprämie junge Erwachsene | «305.- Franken (Durchschnittsprämie 435.- Franken)» | [1] |
| Richtprämie Kinder | «98.- Franken (Durchschnittsprämie 139.- Franken)» | [1] |
| Stichtag Verhältnisse | «am 1. Januar des Anspruchsjahres» | [3] |
| Junge Erwachsene auf Antrag der Eltern | Jahrgänge 2001–2007, in Ausbildung am 1.1.2026, Sozialabzug Ziffer 630 | [4] |

Rechnerischer Hinweis (keine Quellenangabe, eigene Nachrechnung): 602 × 0,70 = 421,4 → 422; 435 × 0,70 = 304,5 → 305; 139 × 0,70 = 97,3 → 98. Der Abschlag 2026 beträgt demnach 30 % (10 % + 20 % nach § 68 SV). Die Beträge 422/305/98 sind der Grössenordnung nach **Monatsprämien**; die Verfügung nennt die Periode aber nicht ausdrücklich.

### Massgebendes Einkommen
> «Das massgebende Einkommen basiert auf Steuerwerten der letzten rechtskräftigen Steuerveranlagung nach kantonalem Steuergesetz und besteht aus einem korrigierten satzbestimmenden Einkommen und einem Anteil des satzbestimmenden Vermögens.» — § 89 Abs. 1 SG, Quelle [3]

> «Das für die Anspruchsberechnung massgebende Einkommen entspricht dem satzbestimmenden Einkommen der Steuerveranlagung unter Berücksichtigung der folgenden Einkommensvariablen: a) Aufrechnung der Pension zu 100%; b) Ausschluss von Kapitalabfindungen für wiederkehrende Leistungen; c) Aufrechnung von Geschäftsverlusten aus Vorjahren; d) Aufrechnung freiwilliger Zuwendungen; e) Aufrechnung der Beiträge an Einrichtungen der gebundenen Selbstvorsorge (Säule 3a) […]; f) Aufrechnung des Abzuges für Liegenschaftskosten; g) Anrechnung von 20% - 50% des satzbestimmenden Vermögens.» — § 69 Abs. 1 SV, Quelle [2] (2026: 50 %, Quelle [1])

Sonderfälle: EL-Beziehende erhalten die EDI-Durchschnittsprämie (in der EL enthalten); Sozialhilfebeziehende die effektive Grundversicherungsprämie, «maximal jedoch in der Höhe der kantonalen Richtprämie» (§ 71 Abs. 2–3 SV, Quelle [2]; erstmals für 2026, Quelle [5]). Ermessensveranlagte haben keinen Anspruch (§ 89 Abs. 3 SG, [3]).

### Abweichung zur App
Die App führt `maxIncome` 48'000 und `subsidySingle` 2'400 mit linearem Abbau; belegt ist ein Grenzwert von 74'000 (massgebendes Einkommen inkl. 50 % des satzbestimmenden Vermögens) und ein Modell «Richtprämie minus Eigenanteil 10–16 % des MGE», nicht ein linearer Abbau eines Festbetrags.

### Offen / nicht gefunden
- Ankerpunkte der linearen Eigenanteil-Skala (vermutlich 10 % bei MGE 0 bis 16 % bei 74'000) sind nicht wörtlich publiziert — nur «10% bis 16%» und «linear».
- Periode der Richtprämien (Monat/Jahr) nicht ausdrücklich genannt; Grössenordnung spricht für Monat.
- Genaue Rechenformel (Summe der Richtprämien des Haushalts × 12 minus Eigenanteil × MGE? Reihenfolge Kinder/junge Erwachsene) nicht wörtlich publiziert. Der AKSO-Online-Rechner (provisorische Berechnung) zeigt nur die Eingabemaske, keine Formel.
- Keine eigene Vermögensgrenze gefunden; Vermögen wirkt über den 50 %-Anteil im MGE.

### Quellen
1. Parameter für die Prämienverbilligung 2026, Vorgaben vom 27. Januar 2026, Departement des Innern Kanton Solothurn, Stand 27.01.2026. https://www.akso.ch/uploads/PDF-Formulare-AKSO/IPV/2026-01-27-Verfuegung-Parameter-Individuelle-Praemie.pdf — abgerufen 16.09.2026
2. Sozialverordnung (SV), BGS 831.2, §§ 68–71, Kanton Solothurn, Stand 01.04.2026. https://bgs.so.ch/api/de/versions/5624/pdf_file (Eintrag: https://bgs.so.ch/app/de/texts_of_law/831.2) — abgerufen 16.09.2026
3. Sozialgesetz (SG), BGS 831.1, §§ 86–91, Kanton Solothurn, Fassung in Kraft seit 01.09.2026. https://bgs.so.ch/api/de/versions/5665/pdf_file (Eintrag: https://bgs.so.ch/app/de/texts_of_law/831.1) — abgerufen 16.09.2026
4. Merkblatt Individuelle Prämienverbilligung (IPV) 2026, Ausgleichskasse des Kantons Solothurn, ohne Datum (2026). https://www.akso.ch/uploads/PDF-Formulare-AKSO/IPV/Merkblatt-IPV-2026.pdf und Seite https://www.akso.ch/dienstleistungen/praemienverbilligung-ipv — abgerufen 16.09.2026
5. Medienmitteilung «Anpassungen bei der individuellen Prämienverbilligung», Staatskanzlei Kanton Solothurn, 27.05.2025. https://so.ch/verwaltung/staatskanzlei/medien/medienmitteilung/news/anpassungen-bei-der-individuellen-praemienverbilligung/ — abgerufen 16.09.2026

---

## BS — Basel-Stadt

**Beurteilung:** abbildbar
**Modell (kurz):** Stufentabelle: 22 Beitragsgruppen nach massgeblichem Haushaltseinkommen und Haushaltsgrösse (1–8 Pers.), fester Monatsbeitrag je Person (Erwachsene / junge Erw. / Kinder), Zuschlag bei alternativem Versicherungsmodell (AVM)
**Zuständig / Weg:** Amt für Sozialbeiträge (ASB), Prämienverbilligung; **Antrag** mit Unterlagen nötig, keine Frist, Anspruch «ab dem Monat nach der Antragstellung» (Zuzug aus dem Ausland: Antrag innert 3 Monaten → ab Versicherungsbeginn)
**Gültigkeit:** 2026 definitiv (Anhang 2 KVO, Fassung RRB 21.10.2025, in Kraft 01.01.2026)

### Rechenmodell
> «Beiträge an die Krankenversicherungsprämien werden nur gewährt, wenn das massgebliche Einkommen der Haushaltseinheit gemäss § 6 Abs. 2 lit. d SoHaG die gemäss § 11 Abs. 2 SoHaV berechnete Leistungsgrenze nicht übersteigt. Bis zu einer Haushaltseinheit von acht Personen können die Leistungsgrenzen der unten stehenden Tabelle T 1 entnommen werden. Für Haushaltseinheiten von neun und mehr Personen erhöhen sich die Leistungsgrenzen […] um Fr. 4'000 pro Person.» — § 22 Abs. 1 KVO, Quelle [1]

> «Die Prämiengruppe sowie die Höhe der jeweiligen Beiträge an die Krankenversicherungsprämien ergeben sich, ausgehend vom jeweils massgeblichen Einkommen gemäss § 6 Abs. 2 lit. d SoHaG und unter Anwendung von § 21 dieser Verordnung, aus den unten stehenden Tabellen T 2, T 3 und T 4. Die maximale Höhe der Beiträge an die Krankenversicherungsprämien entspricht höchstens der im konkreten Fall tatsächlich geschuldeten Prämie» — § 22 Abs. 2 KVO, Quelle [1]

> «Anspruchsberechtigte Personen, die in einer besonderen Versicherungsform gemäss Art. 62 Abs. 1 KVG versichert sind, erhalten einen Zuschlag zum monatlichen Beitrag an die Krankenversicherungsprämien.» — § 21 Abs. 1bis KVO, Quelle [1]

Lesart der Tabelle (belegt durch das amtliche Berechnungsbeispiel [3]): Die T1-Werte sind **Obergrenzen** der jeweiligen Gruppe. Beispiel: «4-Personenhaushalt · Massgebliches Einkommen: 62'000.- · Einkommensgruppe: 5» (Gruppe 4 endet bei 61'000, Gruppe 5 bei 63'000). «Monatlicher Beitrag ohne AVM: 2 erwachsene Personen: 2 x 325.-, junge erwachsene Person: 247.-, Kind: 124.-» — Quelle [3]

### Zahlen 2026
Leistungsgrenzen (T1, massgebliches Einkommen in Fr. pro Jahr, Obergrenze der Gruppe) und Beiträge in Fr. **pro Monat** (T3 ohne AVM / T4 mit AVM) — Quelle [2] (Anhang 2 KVO, «Fassung vom 21. Oktober 2025»), abgeglichen mit [3] und [4]:

| Gr. | 1 P | 2 P | 3 P | 4 P | 5 P | 6 P | 7 P | 8 P | Kind | Junge Erw. | Erw. | Kind AVM | Junge Erw. AVM | Erw. AVM |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 23'125 | 37'000 | 47'000 | 55'000 | 61'000 | 65'000 | 69'000 | 73'000 | 157 | 329 | 444 | 163 | 335 | 474 |
| 02 | 24'375 | 39'000 | 49'000 | 57'000 | 63'000 | 67'000 | 71'000 | 75'000 | 146 | 308 | 415 | 152 | 314 | 445 |
| 03 | 25'625 | 41'000 | 51'000 | 59'000 | 65'000 | 69'000 | 73'000 | 77'000 | 137 | 289 | 385 | 143 | 295 | 415 |
| 04 | 26'875 | 43'000 | 53'000 | 61'000 | 67'000 | 71'000 | 75'000 | 79'000 | 129 | 266 | 352 | 135 | 272 | 382 |
| 05 | 28'125 | 45'000 | 55'000 | 63'000 | 69'000 | 73'000 | 77'000 | 81'000 | 124 | 247 | 325 | 130 | 253 | 355 |
| 06 | 29'375 | 47'000 | 57'000 | 65'000 | 71'000 | 75'000 | 79'000 | 83'000 | 124 | 232 | 296 | 130 | 238 | 326 |
| 07 | 30'625 | 49'000 | 59'000 | 67'000 | 73'000 | 77'000 | 81'000 | 85'000 | 124 | 229 | 266 | 130 | 235 | 296 |
| 08 | 31'875 | 51'000 | 61'000 | 69'000 | 75'000 | 79'000 | 83'000 | 87'000 | 124 | 229 | 237 | 130 | 235 | 267 |
| 09 | 33'125 | 53'000 | 63'000 | 71'000 | 77'000 | 81'000 | 85'000 | 89'000 | 124 | 229 | 210 | 130 | 235 | **240** ⚠️ |
| 10 | 34'375 | 55'000 | 65'000 | 73'000 | 79'000 | 83'000 | 87'000 | 91'000 | 124 | 229 | 179 | 130 | 235 | 209 |
| 11 | 35'625 | 57'000 | 67'000 | 75'000 | 81'000 | 85'000 | 89'000 | 93'000 | 124 | 229 | 148 | 130 | 235 | 178 |
| 12 | 36'875 | 59'000 | 69'000 | 77'000 | 83'000 | 87'000 | 91'000 | 95'000 | 124 | 229 | 118 | 130 | 235 | 148 |
| 13 | 38'125 | 61'000 | 71'000 | 79'000 | 85'000 | 89'000 | 93'000 | 97'000 | 124 | 229 | 91 | 130 | 235 | 121 |
| 14 | 39'375 | 63'000 | 73'000 | 81'000 | 87'000 | 91'000 | 95'000 | 99'000 | 124 | 229 | 61 | 130 | 235 | 91 |
| 15 | 40'625 | 65'000 | 75'000 | 83'000 | 89'000 | 93'000 | 97'000 | 101'000 | 124 | 229 | 43 | 130 | 235 | 73 |
| 16 | 41'875 | 67'000 | 77'000 | 85'000 | 91'000 | 95'000 | 99'000 | 103'000 | 124 | 229 | 37 | 130 | 235 | 67 |
| 17 | 43'125 | 69'000 | 79'000 | 87'000 | 93'000 | 97'000 | 101'000 | 105'000 | 124 | 229 | 33 | 130 | 235 | 63 |
| 18 | 44'375 | 71'000 | 81'000 | 89'000 | 95'000 | 99'000 | 103'000 | 107'000 | 124 | 229 | 30 | 130 | 235 | 60 |
| 19 | 45'625 | 73'000 | 83'000 | 91'000 | 97'000 | 101'000 | 105'000 | 109'000 | 124 | 229 | 26 | 130 | 235 | 56 |
| 20 | 46'875 | 75'000 | 85'000 | 93'000 | 99'000 | 103'000 | 107'000 | 111'000 | 124 | 229 | 23 | 130 | 235 | 53 |
| 21 | 48'125 | 77'000 | 87'000 | 95'000 | 101'000 | 105'000 | 109'000 | 113'000 | 124 | 229 | 20 | 130 | 235 | 50 |
| 22 | 49'375 | 79'000 | 89'000 | 97'000 | 103'000 | 107'000 | 111'000 | 115'000 | 124 | 229 | 17 | 124 | 229 | 26 |

| Grösse | Wert | Quelle |
|---|---|---|
| Leistungsgrenze Einzelperson / 4-Personen-Haushalt | 49'375 / 97'000 Fr. pro Jahr | [2], [5] |
| Leistungsgrenze ab 9 Personen | «um Fr. 4'000 pro Person» über 8-Personen-Grenze | [1] |
| Richtprämie (für Mindestverbilligung Kinder 80 % / junge Erw. 50 %) | «90 % der kantonalen Durchschnittsprämie der jeweiligen Personenkategorie» | [2] |
| Kantonale Durchschnittsprämie 2026 (Beitragstabelle ASB) | Erwachsene 694.-, Junge Erw. 507.-, Kinder 172.- | [3] |
| Junge Erwachsene | «unabhängig davon ob in Ausbildung oder nicht» | [2] |
| Vermögensfreibeträge | «für Alleinstehende CHF 37'500, für Paare CHF 60'000 und für Kinder je CHF 15'000» | [6] |
| Vermögensanteil | «um einen Zehntel des überschiessenden Teils» | [6] |
| Liegenschaften | «mit 25 Prozent des Steuerwerts» | [6] |
| Anpassung 2026 | «um 2.9 Prozent für Erwachsene, um 1.5 Prozent für 18- bis 25-Jährige und um 4.6 Prozent für Kinder» | [4] |

⚠️ Abweichung zwischen zwei amtlichen Dokumenten: Gruppe 09, Erwachsene mit AVM — **Verordnung (Anhang 2 KVO) und Bericht: 240**; ASB-Beitragstabelle 2026: 230. Massgebend ist die Verordnung (240; auch rechnerisch 210 + 30 AVM-Zuschlag).

### Massgebendes Einkommen
> «für die Anspruchsermittlung auf Prämienverbilligung […] da) das anrechenbare Einkommen gemäss § 7 dieses Gesetzes; db) nach § 1 Abs. 1 lit. a bis c dieses Gesetzes bezogene Leistungen; dc) Ausbildungsbeiträge; dd) Ergänzungsleistungen und Beihilfen» — § 6 Abs. 2 lit. d SoHaG, Quelle [7]

> «Es umfasst die Einnahmen und anrechenbaren Vermögensanteile der Haushaltseinheit gemäss § 5 dieses Gesetzes bereinigt um die anerkannten Abzüge.» — § 7 Abs. 2 SoHaG, Quelle [7]

> «Massgebliches Einkommen = Nettolohn inkl. Kinder- und Ausbildungszulagen, zzgl. vorgelagerte Leistungen (Alimentenhilfe, Stipendien) und allfälliger Vermögensanteil.» — Quelle [3]

Berechnungsgrundlage ist grundsätzlich die letzte Steuerveranlagung; bei Abweichung von mindestens 20 % aktuelle Unterlagen (Quelle [8]). Hypothetisches Einkommen wird angerechnet, wenn Haushaltsmitglieder weniger arbeiten als zumutbar (Quelle [8]; Details §§ 19 ff. SoHaV [6]).

### Abweichung zur App
Die App führt `maxIncome` 54'000 und `subsidySingle` 3'000/Jahr mit linearem Abbau; belegt sind für eine Einzelperson die Grenze 49'375 Fr. und 444 Fr. **pro Monat** (5'328 Fr./Jahr) in der tiefsten Gruppe, gestuft bis 17 Fr./Monat — die App liegt bei der Grenze zu hoch und beim Maximalbetrag deutlich zu tief.

### Offen / nicht gefunden
- Die genauen Bestandteile der «Einnahmen» und «anerkannten Abzüge» (§§ 16–17 SoHaV) sind komplex; für die App braucht es eine Vereinfachung (z. B. Nettolohn + Zulagen + Vermögensanteil, wie im ASB-Beispiel).
- Die SoHaV-Fassung in der Gesetzessammlung ist die «Aktuelle Version in Kraft seit: 01.07.2021»; Freibeträge stimmen mit der ASB-Seite überein.
- Höhe des hypothetischen Einkommens (ASB-Seite nennt 28'800 Fr./Jahr für Erwachsene) nicht in einer Rechtsquelle nachgeprüft.

### Quellen
1. Verordnung über die Krankenversicherung im Kanton Basel-Stadt (KVO), SG 834.410, §§ 21–22, Stand «in Kraft seit 01.01.2026» (Beschluss 16.12.2025). https://www.gesetzessammlung.bs.ch/api/de/versions/6727/pdf_file (Eintrag: https://www.gesetzessammlung.bs.ch/app/de/texts_of_law/834.410) — abgerufen 16.09.2026
2. KVO Anhang 2 (Anhang zu § 22 Abs. 2), Fassung vom 21. Oktober 2025, in Kraft 01.01.2026. https://www.gesetzessammlung.bs.ch/api/de/versions/6727/annexes — abgerufen 16.09.2026
3. Einkommensgruppen, -grenzen und IPV-Beiträge ab 1. Januar 2026 (Beitragstabelle mit Berechnungsbeispiel), Amt für Sozialbeiträge Basel-Stadt, «Gemäss Beschluss des Regierungsrates vom 21. Oktober 2025». https://media.bs.ch/original_file/62d19a5c9191fdae44edc32c89b0e5090b1e1322/pv-beitragstabelle-berechnungsbeispiel-2026.pdf — abgerufen 16.09.2026
4. Bericht über die Prämienverbilligung 2026, Departement für Wirtschaft, Soziales und Umwelt, Oktober 2025. https://media.bs.ch/original_file/6728c0b091999dea9afc2a4c778dcb753b90e1d7/kvo2026-bericht-pv-0.pdf — abgerufen 16.09.2026
5. Prämienverbilligung (Themenseite), Kanton Basel-Stadt. https://www.bs.ch/themen/finanzielle-hilfe/leistungen/praemienverbilligung — abgerufen 16.09.2026
6. Verordnung über die Harmonisierung und Koordination von bedarfsabhängigen Sozialleistungen (SoHaV), SG 890.710, §§ 11, 28, 29, in Kraft seit 01.07.2021. https://www.gesetzessammlung.bs.ch/api/de/versions/5476/pdf_file — abgerufen 16.09.2026
7. Gesetz über die Harmonisierung und Koordination von bedarfsabhängigen Sozialleistungen (SoHaG), SG 890.700, §§ 6–7, in Kraft seit 01.07.2025. https://www.gesetzessammlung.bs.ch/api/de/versions/6622/pdf_file — abgerufen 16.09.2026
8. Merkblatt Prämienverbilligung (Ausgabe 01.2026), Amt für Sozialbeiträge. https://media.bs.ch/original_file/5fe6904e84baed32e2ffd98bb846fa9144cd536a/pv-merkblatt-2026.pdf — abgerufen 16.09.2026

---

## BL — Basel-Landschaft

**Beurteilung:** abbildbar
**Modell (kurz):** Jahresrichtprämie minus 7,75 % des massgebenden Jahreseinkommens, mit harter Einkommensobergrenze je Berechnungseinheit (Einzelperson 31'000); Kinder ≥80 %, junge Erw. ≥50 % der Richtprämie
**Zuständig / Weg:** Ausgleichskasse Basel-Landschaft (SVA BL); Antragsformular wird «in der Regel von Amtes wegen» zugestellt (Basis: definitive Steuerveranlagung des Vor-Vorjahres), Rücksendung innert 1 Jahr seit Zustellung; sonst schriftliches Gesuch bis Ende des Anspruchsjahres
**Gültigkeit:** 2026 definitiv (PVV Stand 01.01.2026, Richtprämien geändert per RRB 18.11.2025; Dekret Stand 01.01.2014 weiterhin in Kraft)

### Rechenmodell
> «Die Höhe der Prämienverbilligung entspricht der Differenz zwischen der Jahresrichtprämie und einem Prozentanteil am massgebenden Jahreseinkommen.» — § 8 Abs. 2 EG KVG, Quelle [1]

> «Der ausbezahlte Betrag darf die tatsächlich bezahlte Prämie nicht übersteigen.» — § 8 Abs. 2bis EG KVG, Quelle [1]

> «Für anspruchsberechtigte Kinder werden mindestens 80 % und für anspruchsberechtigte junge Erwachsene bis 25 Jahre mindestens 50 % der entsprechenden kantonalen Jahresrichtprämie ausgerichtet.» — § 8 Abs. 3 EG KVG, Quelle [1]

> «Die anspruchsabschliessende Obergrenze des massgebenden Jahreseinkommens für die Prämienverbilligung beträgt für Berechnungseinheiten gemäss § 9 Absatz 4 EG KVG mit: […]» — § 1 Abs. 1 Dekret, Quelle [2]

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Prozentanteil am massgebenden Jahreseinkommen | «7,75%» | [2] § 2 |
| Richtprämie Erwachsene | «CHF 383.– im Monat» | [3] § 5 |
| Richtprämie junge Erwachsene | «CHF 318.– im Monat» | [3] § 5 |
| Richtprämie Kinder | «CHF 164.– im Monat» | [3] § 5 |
| Obergrenze 1 Erwachsene/r ohne Kinder | «CHF 31'000» | [2] |
| 1 Erwachsene/r mit 1 Kind | «CHF 52'000» | [2] |
| 1 Erwachsene/r mit 2 Kindern | «CHF 68'000» | [2] |
| 1 Erwachsene/r, pro weiteres Kind | «je CHF 11'000» | [2] |
| 2 Erwachsene ohne Kinder | «CHF 51'000» | [2] |
| 2 Erwachsene mit 1 Kind | «CHF 72'000» | [2] |
| 2 Erwachsene mit 2 Kindern | «CHF 88'000» | [2] |
| 2 Erwachsene, pro weiteres Kind | «je CHF 11'000» | [2] |
| «Erwachsene Person» im Sinne der Obergrenzen | «umfasst auch junge Erwachsene bis 25 Jahre» | [2] § 1 Abs. 2 |
| Mindestbetrag Auszahlung | «besteht kein Mindestbetrag» | [3] § 6 Abs. 2 |
| Junge Erwachsene mit Ausbildungszulage | kein Anspruch, wenn Eltern-MGE mehr als Faktor 2,75 × Obergrenze (plus Unterhaltszuschlag, z. B. «CHF 21‘000.–» für eine junge erwachsene Person) | [1] § 8 Abs. 1bis, [3] § 14c |
| Richtprämie Erwachsene rechtlich | «mindestens 20 % unter dem kantonalen Prämiendurchschnitt» | [1] § 8a Abs. 2 |

Eigene Nachrechnung (kein Beleg, nur zur Plausibilität): Einzelperson 383 × 12 = 4'596 Fr.; bei MGE 31'000 wären 7,75 % = 2'402.50 Fr. → 2'193.50 Fr. IPV; oberhalb 31'000 fällt der Anspruch ganz weg (Schwelleneffekt, keine lineare Auslaufzone).

### Massgebendes Einkommen
> «Das massgebende Jahreseinkommen entspricht dem Zwischentotal der steuerbaren Einkünfte (ohne Einkünfte aus Liegenschaften) vermehrt um: a. das Nettoeinkommen aus nicht selbst bewohnten Liegenschaften; b. 20 % des steuerbaren Vermögens, sowie vermindert um c. geleistete Unterhaltsbeiträge, für die bei der Staatsteuer ein Abzug gewährt wird; d. CHF 5'000 für jedes Kind, für welches bei der Staatssteuer ein Kinderabzug gewährt wird.» — § 9 Abs. 1 EG KVG, Quelle [1]

> «Massgebend ist die rechtskräftige Steuerveranlagung für das Vor-Vorjahr.» — § 9 Abs. 3 EG KVG, Quelle [1] (PVV § 3a: «definitiven Steuerveranlagung», Quelle [3])

Quellenbesteuerte: laut SVA-Seite 70 % vom Bruttoeinkommen des Vor-Vorjahres (Quelle [5]; aus Abruf-Zusammenfassung, Wortlaut nicht selbst geprüft). Anpassung bei Einkommensänderung über 20 % nur auf Gesuch (§ 9a EG KVG).

### Abweichung zur App
Die App führt `maxIncome` 51'000 und `subsidySingle` 2'700 mit linearem Abbau; belegt ist für eine Einzelperson eine Obergrenze von 31'000 (51'000 gilt für zwei Erwachsene ohne Kinder) und ein Betrag von 4'596 Fr. minus 7,75 % des massgebenden Einkommens.

### Offen / nicht gefunden
- Ordentlicher Anspruch laut SVA-Seite nur für Personen, die seit mindestens zwei Jahren im Kanton steuerpflichtig sind (aus Abruf-Zusammenfassung, Wortlaut nicht selbst geprüft); Zuziehende über separates Gesuch (Regeln §§ in PVV nicht vollständig ausgewertet).
- Keine eigene Vermögensgrenze; Vermögen wirkt über 20 % des steuerbaren Vermögens im MGE.
- Sonderregeln Sozialhilfe/EL/Quellensteuer nicht im Detail ausgewertet.

### Quellen
1. Einführungsgesetz zum Bundesgesetz über die Krankenversicherung (EG KVG), SGS 362, §§ 8–9c, Kanton Basel-Landschaft, Version in Kraft seit 01.04.2023. https://bl.clex.ch/api/de/versions/4310/pdf_file (Eintrag: https://bl.clex.ch/app/de/texts_of_law/362) — abgerufen 16.09.2026
2. Dekret über die Einkommensobergrenzen und den Prozentanteil in der Prämienverbilligung, SGS 362.1, Stand 1. Januar 2014 (aktuelle Version). https://bl.clex.ch/api/de/versions/1922/pdf_file (Eintrag: https://bl.clex.ch/app/de/texts_of_law/362.1) — abgerufen 16.09.2026
3. Verordnung über die Prämienverbilligung in der Krankenpflegeversicherung (PVV), SGS 362.12, Stand 1. Januar 2026 (§ 5 geändert 18.11.2025, GS 2025.058). https://bl.clex.ch/api/de/versions/4361/pdf_file (Eintrag: https://bl.clex.ch/app/de/texts_of_law/362.12) — abgerufen 16.09.2026
4. Ordentlicher Anspruch IPV, SVA Basel-Landschaft. https://www.sva-bl.ch/de/ausgleichskasse/individuelle-praemienverbilligung-ipv/ordentlicher-anspruch — abgerufen 16.09.2026
5. Häufige Fragen IPV, SVA Basel-Landschaft. https://www.sva-bl.ch/de/ausgleichskasse/individuelle-praemienverbilligung-ipv/haeufige-fragen-ipv — abgerufen 16.09.2026

---

## SH — Schaffhausen

**Beurteilung:** abbildbar
**Modell (kurz):** Selbstbehalt: Summe der Richtprämien (2 Prämienregionen) minus 15 % des anrechenbaren Einkommens, höchstens 65 % der anrechenbaren Prämien, unter Fr. 100 keine Auszahlung
**Zuständig / Weg:** SVA Schaffhausen (AHV-Ausgleichskasse); Antragsformular wird bis 31.01.2026 an voraussichtlich Berechtigte versandt, sonst anfordern; **Antrag** bis 30.04.2026 (Nachfrist bei wichtigen Gründen 15.06.2026)
**Gültigkeit:** 2026 definitiv (Anhang 1 der Verordnung, «Durchführung der Prämienverbilligung im Jahre 2026», RRB 18.11.2025, in Kraft 01.01.2026). Hinweis: Die SVA-Seite «Berechnung» zeigt heute noch die **Richtprämien 2025** — nicht verwenden.

### Rechenmodell
> «Ein Anspruch auf Prämienverbilligung kann geltend gemacht werden, wenn die anrechenbaren Prämien der obligatorischen Krankenpflegeversicherung 15% des anrechenbaren Einkommens übersteigen» — § 10 Dekret, Quelle [2] (gleichlautend Art. 1 Abs. 2 Krankenversicherungsgesetz, Quelle [3])

> «Die Höhe der Beiträge entspricht der Differenz zwischen den anrechenbaren Prämien und dem gemäss § 10 massgeblichen Prozentsatz des anrechenbaren Einkommens.» — § 13 Abs. 1 Dekret, Quelle [2]

> «Beträgt die Differenz weniger als Fr. 100.00, wird kein Betrag ausbezahlt.» — § 13 Abs. 2 Dekret, Quelle [2]

> «Unter Vorbehalt von § 19 werden maximal 65 Prozent der anrechenbaren Prämien erstattet.» — § 13 Abs. 3 Dekret, Quelle [2] (§ 19 = Sozialhilfe: effektive Prämie bis EL-Durchschnittsprämie)

> «Die anrechenbaren Prämien entsprechen den folgenden Anteilen der vom Bund für die Ergänzungsleistungen zur AHV / IV im Kanton Schaffhausen festgelegten Durchschnittsprämien: a) 85% der Durchschnittsprämien bei Personen ab dem 26. Altersjahr sowie bei Kindern bis zum vollendeten 18. Altersjahr b) 75% der Durchschnittsprämien bei Personen vom 19. bis zum vollendeten 25. Altersjahr» — § 11 Dekret, Quelle [2]

> «Massgebende Jahresprämien = Summe der Richtprämien der gemeinsam besteuerten Personen» — Quelle [5]

Kinder/junge Erwachsene in Ausbildung: Betrag wird «primär zur Deckung der Mindestansprüche» nach Art. 65 Abs. 1bis KVG eingesetzt und bei Bedarf erhöht (§ 13bis Dekret, Quelle [2]).

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Selbstbehalt | 15 % des anrechenbaren Einkommens | [2], [3] |
| Maximale Erstattung | 65 % der anrechenbaren Prämien | [2] |
| Auszahlungsschwelle | unter Fr. 100.00 keine Auszahlung | [2] |
| Richtprämie Region 1 (Stadt Schaffhausen, Neuhausen), Jahrgänge 2000 und älter | «Fr. 5'947.00» (Jahresprämie) | [1] § A1-1 |
| Region 1, Jahrgänge 2001–2007 | «Fr. 3'879.00» | [1] |
| Region 1, Kinder (Jahrgänge 2008 und jünger) | «Fr. 1'387.00» | [1] |
| Richtprämie Region 2 (übrige Gemeinden), Jahrgänge 2000 und älter | «Fr. 5'620.00» | [1] |
| Region 2, Jahrgänge 2001–2007 | «Fr. 3'618.00» | [1] |
| Region 2, Kinder | «Fr. 1'295.00» | [1] |
| Grundabzug im anrechenbaren Einkommen | «Fr. 9'000.00 bei Haushalten mit Kindern bis zum vollendeten 20. Altersjahr, die mit den Eltern einen gemeinschaftlichen Anspruch haben, bzw. Fr. 4'500.00 bei den übrigen Haushalten» | [2] § 12 |
| Vermögenszuschlag | «15% des nach kantonalem Recht steuerpflichtigen Vermögens» | [2] § 12 |
| Versand-Grenzwerte Region 1 (keine Anspruchsgrenze, sondern Versandschwelle) | Alleinstehende Jg. 2000 und älter «Fr. 39'647.00»; Jg. 2001–2005 «Fr. 25'860.00»; Verheiratete «Fr. 79'294.00»; pro Kind Jg. 2008+ «Fr. 9'247.00»; pro Kind Jg. 2006/2007 «Fr. 25'860.00» | [1] § A1-2 |
| Versand-Grenzwerte Region 2 | «Fr. 37'467.00» / «Fr. 24'120.00» / «Fr. 74'934.00» / «Fr. 8'634.00» / «Fr. 24'120.00» | [1] § A1-2 |
| Fristen 2026 | Versand «bis 31. Januar 2026»; Einreichung «30. April 2026»; Nachfrist «15. Juni 2026» | [1] § A1-3 |
| Steuerdaten | «Steuerfaktoren, die […] im Januar 2026 verfügbar sind» | [1] § A1-1 Abs. 3 |
| Richtprämien laut Regierungsrat | «Erwachsene: 5'947 Franken pro Jahr; Junge Erwachsene (19 - 25 Jahre): 3'879 Franken pro Jahr; Kinder: 1'387 Franken pro Jahr» (Stadt/Neuhausen) | [4] |

Eigene Nachrechnung (kein Beleg): Die Versand-Grenzwerte entsprechen Richtprämie ÷ 15 % (5'947 ÷ 0,15 = 39'647) — also dem rechnerischen Nullpunkt. Einzelperson Region 1: Maximum 65 % × 5'947 = 3'865.55 Fr. (greift bis anrechenbares Einkommen ca. 13'876), danach 5'947 − 0,15 × Einkommen, unter 100 Fr. null (ab ca. 38'980).

### Massgebendes Einkommen
> «Als anrechenbares Einkommen gilt das Reineinkommen nach kantonalem Steuerrecht, korrigiert um die nachfolgenden Elemente: a) Grund-Abzug […] b) Entlastungsabzug gemäss Art. 37 Abs. 1 Bst. d des kantonalen Steuergesetzes […] c) Zuschlag 15% des nach kantonalem Recht steuerpflichtigen Vermögens d) Aufrechnung allfälliger Negativsaldi der Einkünfte aus Grundeigentum […] e) Aufrechnung allfälliger Abzüge für Einlagen in die gebundene Selbstvorsorge sowie für Zuwendungen an gemeinnützige Organisationen und politische Parteien» — § 12 Abs. 1 Dekret, Quelle [2]

> «Massgebend sind die definitiven Steuerwerte für das zweite dem Zahlungsjahr vorangehende Jahr.» — § 12 Abs. 2 Dekret, Quelle [2] (fehlen sie: letzte provisorische Werte, Abs. 3)

### Abweichung zur App
Die App führt `maxIncome` 45'000 und `subsidySingle` 2'250 (Modell «flat»); belegt ist für eine Einzelperson (Region 1) ein Höchstbetrag von 3'865.55 Fr. (65 % von 5'947) mit Abbau um 15 % des anrechenbaren Einkommens bis Nullpunkt ca. 39'647 — kein Pauschalbetrag.

### Offen / nicht gefunden
- Entlastungsabzug nach Art. 37 Abs. 1 Bst. d Steuergesetz (Beträge) nicht nachgeschlagen — für die App-Vereinfachung nötig.
- Jahrgangs-Abgrenzung: Anhang nennt für Erwachsene «Jahrgänge 2000 und älter», für junge Erwachsene «2001 – 2007», die Versandgrenzen aber «Jahrgang 2001 bis 2005» plus «Kind Jahrgang 2006 / 2007» (gemeinschaftlicher Anspruch mit Eltern).
- SVA-Seite «Berechnung» (Quelle [5]) ist nicht auf 2026 nachgeführt (Richtprämien 2025, Steuerjahr 2023).

### Quellen
1. Verordnung über den Vollzug des Krankenversicherungsgesetzes, SHR 832.111, Anhang 1 «Durchführung der Prämienverbilligung im Jahre 2026», Kanton Schaffhausen, Stand 1. August 2026 (Anhang geändert 18.11.2025, in Kraft 01.01.2026). https://rechtsbuch.sh.ch/api/de/versions/2086/pdf_file (Eintrag: https://rechtsbuch.sh.ch/app/de/texts_of_law/832.111) — abgerufen 16.09.2026
2. Dekret über den Vollzug des Krankenversicherungsgesetzes, SHR 832.110, §§ 10–13bis, 19, Version in Kraft seit 01.01.2025. https://rechtsbuch.sh.ch/api/de/versions/1927/pdf_file (Eintrag: https://rechtsbuch.sh.ch/app/de/texts_of_law/832.110) — abgerufen 16.09.2026
3. Krankenversicherungsgesetz, SHR 832.100, Art. 1, Version in Kraft seit 01.01.2014. https://rechtsbuch.sh.ch/api/de/versions/1383/pdf_file — abgerufen 16.09.2026
4. «Aus den Verhandlungen des Regierungsrates vom 18. November 2025», Staatskanzlei Schaffhausen (Medienmitteilung). https://sh.ch/CMS/get/file/e85a1e0a-bb32-4954-b114-30bf8b4dbc21 — abgerufen 16.09.2026
5. Berechnung (IPV), SVA Schaffhausen (Stand: noch Werte 2025). https://www.svash.ch/ipv/berechnung/ und Anmeldung https://www.svash.ch/ipv/anmeldung/ — abgerufen 16.09.2026

---

## AR — Appenzell Ausserrhoden

**Beurteilung:** abbildbar
**Modell (kurz):** Richtprämie minus Selbstbehalt 46 % von (massgebendes Einkommen − allgemeiner Lebensbedarf − 2'000 je Kind); harte Obergrenzen Einkommen (Alleinstehende 35'000) und Vermögen (120'000 / 200'000); Kinder 80 %, junge Erw. in Ausbildung 50 % der Richtprämie
**Zuständig / Weg:** Sozialversicherungen Appenzell Ausserrhoden (SOVAR), Herisau; Berechtigte werden angeschrieben; **Antrag** 01.01.–31.03.2026, danach verwirkt (Frist für 2026 abgelaufen)
**Gültigkeit:** 2026 definitiv (Merkblatt 2026, Regierungsratsfestlegung laut Medienmitteilung 12.12.2025)

### Rechenmodell
> «Die Höhe der Prämienverbilligung entspricht der Differenz zwischen Richtprämie und Selbstbehalt.» — Art. 13 Abs. 1 EG zum KVG, Quelle [2]

> «Die Prämien werden verbilligt, soweit sie den vom Regierungsrat festgelegten Selbstbehalt übersteigen. Der Selbstbehalt entspricht 46% aus der Differenz zwischen dem massgebendem Einkommen und dem allgemeinen Lebensbedarf» — Quelle [1]

> «Anrechenbares Einkommen: Grundlage für die Berechnung des Selbstbehalts. Es bemisst sich aus dem massgebenden Einkommen abzüglich des allgemeinen Lebensbedarfs und abzüglich eines vom Regierungsrat festzulegenden Betrags je Kind und junger Erwachsener in Ausbildung» — Art. 2 Abs. 1 lit. f EG zum KVG, Quelle [2]

> «Wird eine (oder beide) dieser Obergrenzen überschritten, besteht kein Anspruch auf Prämienverbilligung.» — Quelle [1]

> «Bis zur Obergrenze der Bezugsberechtigung werden die Richtprämien für Kinder und junge Erwachsene in Ausbildung im Umfang des vom Regierungsrat festgelegten Prozentsatzes verbilligt.» — Art. 11 Abs. 2 EG zum KVG, Quelle [2]

> «Personen, die gemeinsam besteuert werden, haben einen gemeinsamen Anspruch auf Prämienverbilligung.» — Quelle [1]

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Selbstbehalt | «46%» der Differenz MGE − allgemeiner Lebensbedarf | [1], [3] |
| Richtprämie Erwachsene (Jahr) | «CHF 6'025.20» | [1] |
| Richtprämie junge Erwachsene | «CHF 4'233.60» | [1] |
| Prämie junge Erwachsene in Ausbildung (50%) | «CHF 2'116.80» | [1] |
| Prämie minderjährige Kinder (80%) | «CHF 1'114.80» | [1] |
| Allgemeiner Lebensbedarf Alleinstehende ohne Kinder | «CHF 20'670.00» | [1] |
| Allgemeiner Lebensbedarf Verheiratete und Alleinerziehende mit Kindern | «CHF 31'005.00» | [1] |
| Abzug pro Kind | «CHF 2'000.00» (Medienmitteilung [3] nennt ebenfalls 2'000 Fr.) | [1], [3] |
| Obergrenze MGE Alleinstehende ohne Kinder | «CHF 35'000.00» | [1] |
| Alleinerziehende mit 1 / 2 / 3 / 4 / 5+ Kindern | 46'200 / 47'000 / 50'400 / 56'700 / 63'000 | [1] |
| Verheiratete ohne Kinder | «CHF 55'000.00» | [1] |
| Verheiratete mit 1 / 2 / 3 / 4 / 5+ Kindern | 68'200 / 75'900 / 76'000 / 77'000 / 81'000 | [1] |
| Obergrenze steuerbares Vermögen Alleinstehende und Alleinerziehende | «CHF 120'000.00» | [1] |
| Obergrenze steuerbares Vermögen Verheiratete | «CHF 200'000.00» | [1] |
| Vermögensaufrechnung im MGE | «Aufrechnung 15 Prozent des steuerbaren Vermögens» | [1] |
| Höchstbetrag | nicht höher als Prämie «mit der ordentlichen Franchise (CHF 300.00)» | [1] |
| Kantonsrat-Kredit 2026 | 39,02 Mio. Fr. (Bund 23,2 / Kanton 15,8 Mio.) — aus Abruf-Zusammenfassung, nicht wörtlich geprüft | [3] |

Hinweis zur Rechtsgrundlage: Das Gesetz (Stand 1. Januar 2017) nennt andere Obergrenzen (z. B. Alleinerziehende mit 1 Kind Fr. 42 000.-, Vermögen Fr. 150 000.- / 250 000.-), erlaubt dem Regierungsrat aber, «von den Beträgen in Abs. 1 lit. a um maximal 10 % und von jenen in Abs. 1 lit. b um maximal 20 %» abzuweichen (Art. 12 Abs. 2, Quelle [2]). Die Merkblatt-Werte 2026 liegen innerhalb dieses Rahmens (Vermögen: genau −20 %; die Medienmitteilung [3] erwähnt die um 20 % herabgesetzte Vermögensgrenze — nur als Zusammenfassung gelesen, nicht wörtlich zitiert).

Eigene Nachrechnung (kein Beleg): Alleinstehende/r ohne Kinder: IPV = 6'025.20 − 0,46 × (MGE − 20'670); voller Betrag bis MGE 20'670, Nullpunkt bei ca. 33'768 (unter der Obergrenze 35'000).

### Massgebendes Einkommen
> «Das massgebende Einkommen entspricht dem steuerbaren Einkommen nach der letzten rechtskräftigen Steuerveranlagung, korrigiert um die nachstehenden Faktoren: Aufrechnung 15 Prozent des steuerbaren Vermögens · Aufrechnung Liegenschaftsaufwand · Aufrechnung Säule 3a von Personen, die zusätzlich über ihre Erwerbstätigkeit einer beruflichen Vorsorge unterstellt sind · Aufrechnung Säule 3a von Personen, die keiner beruflichen Vorsorge unterstellt sind, soweit der Betrag CHF 10'000 übersteigt · Aufrechnung Einkaufsbeiträge an Einrichtungen der beruflichen Vorsorge · Aufrechnung der Vorjahresverluste · […]» — Quelle [1] (Aufzählung gekürzt; Grundlage Art. 19 EG zum KVG, [2])

> «Steuerbares Einkommen: Gesamte steuerbare Einkünfte abzüglich der zu ihrer Erzielung notwendigen Kosten (= Reineinkommen) und abzüglich der Sozialabzüge» — Art. 2 Abs. 1 lit. c EG zum KVG, Quelle [2]

Sonderfälle: EL-Beziehende über die EL (ohne Antrag); Sozialhilfebeziehende «höchstens auf die ganze Richtprämie» ([1], Art. 15 EG zum KVG [2]).

### Abweichung zur App
Die App führt `maxIncome` 42'000 und `subsidySingle` 2'100 (Modell «flat»); belegt ist für Alleinstehende eine Obergrenze von 35'000 und ein Betrag von bis zu 6'025.20 Fr., abnehmend um 46 % des Einkommens über 20'670 — kein Pauschalbetrag.

### Offen / nicht gefunden
- Die Gesetzessammlung (ar.clex.ch) zeigt EG zum KVG und Verordnung nur mit «Stand 1. Januar 2017»; die Regierungsratsbeschlüsse mit den Werten 2026 selbst wurden nicht gefunden — Zahlen stammen aus dem SOVAR-Merkblatt 2026 und der Medienmitteilung.
- Eine Teilrevision des EG zum KVG («flexibler gestalten», Medienmitteilung 31.10.2025) ist in Arbeit; Inkraftsetzung nicht genannt — für 2027 prüfen.
- Mindestauszahlungsbetrag: Gesetz erlaubt Ausschluss (Art. 13 Abs. 2), Betrag 2026 nicht gefunden.
- Anwendung von Lebensbedarf für Verheiratete **ohne** Kinder (Merkblatt nennt nur «Verheiratete und Alleinerziehende mit Kindern» 31'005) — Wortlaut mehrdeutig; das Gesetz verweist auf Art. 10 Abs. 1 lit. a Ziff. 1/2 ELG (Ehepaare = Ziff. 2).

### Quellen
1. Merkblatt über die Verbilligung der Prämien für die obligatorische Krankenpflege-Grundversicherung im Jahr 2026, Sozialversicherungen Appenzell Ausserrhoden (SOVAR), ohne Datum (2026). https://www.sovar.ch/uploads/SOVAR/Formulare/AK/Beitraege/Merkblatt-IPV-2026.pdf (Seite: https://www.sovar.ch/dienstleistungen/pr%C3%A4mienverbilligung-ipv) — abgerufen 16.09.2026
2. Gesetz über die Einführung des Bundesgesetzes über die Krankenversicherung (EG zum KVG), bGS 833.14, Stand 1. Januar 2017. https://ar.clex.ch/api/de/versions/1156/pdf_file (Eintrag: https://ar.clex.ch/app/de/texts_of_law/833.14) — abgerufen 16.09.2026
3. Medienmitteilung «Regierungsrat legt individuelle Prämienverbilligung 2026 fest», Kanton Appenzell Ausserrhoden, 12.12.2025. https://ar.ch/schnellzugriff/medienmitteilungen-der-kantonalen-verwaltung/detail/news/regierungsrat-legt-individuelle-praemienverbilligung-2026-fest/ — abgerufen 16.09.2026
4. Medienmitteilung «Zustimmung zur flexibleren Ausgestaltung der Prämienverbilligung», Kanton Appenzell Ausserrhoden, 31.10.2025. https://ar.ch/schnellzugriff/medienmitteilungen-der-kantonalen-verwaltung/detail/news/zustimmung-zur-flexibleren-ausgestaltung-der-praemienverbilligung/ — abgerufen 16.09.2026
5. Verordnung zum EG zum KVG (V zum KVG), bGS 833.141, Stand 1. Januar 2017 (Vermögensanteil «15 Prozent des steuerbaren Vermögens»). https://ar.clex.ch/api/de/versions/1167/pdf_file — abgerufen 16.09.2026

---

## AI — Appenzell Innerrhoden

**Beurteilung:** abbildbar
**Modell (kurz):** Richtprämie (Summe Haushalt) minus Selbstbehalt 7–12 % des massgebenden Gesamteinkommens (gestuft +0,125 %/Fr. 1'000 zwischen 45'000 und 85'000); Kinder/JE in Ausbildung Mindest-IPV 80 %/50 % der Richtprämie bis MGE 75'000
**Zuständig / Weg:** Gesundheitsamt AI; automatisch ermittelt, kein Antrag («Es muss kein Antrag gestellt werden»); provisorische IPV auf Gesuch mit Formular; EL-Beziehende über Kantonale Ausgleichskasse
**Gültigkeit:** 2026 definitiv (Merkblatt IPV 2026, PDF erstellt 09.12.2025)

### Rechenmodell
> «Die IPV berechnet sich aus der Differenz zwischen der Richtprämie und dem Selbstbehalt. Bei Personen, die einen Gesamtanspruch auf Prämienverbilligung haben, werden die Richtprämien zusammengezählt.» — Quelle [1], Ziff. 3

> «Bei einem Gesamteinkommen von bis und mit Fr. 45'000.– liegt der Selbstbehalt bei 7.00%, des massgebenden Gesamteinkommens; Bei einem Gesamteinkommen von Fr. 85'000.– und darüber liegt der Selbstbehalt bei 12.00%, […] dazwischen steigt der Selbstbehalt pro Fr. 1'000.– Gesamteinkommen schrittweise um 0.125%.» — Quelle [1], Ziff. 3.2

> «Die IPV für Kinder wird auf 80 % und für junge Erwachsene in Ausbildung auf 50 % der Richtprämien angehoben, sofern das massgebende Gesamteinkommen Fr. 75'000.- nicht übersteigt. Die IPV einer über 25-jährigen Person wird nie angehoben.» — Quelle [1], Ziff. 3.3

Rechenbeispiel im Merkblatt (Stufenlogik): «Selbstbehalt (7% + 15 x 0.125% = 8.875% von Fr. 60‘000.–)» — Quelle [1], Ziff. 3.4

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Richtprämie Erwachsene (Jg. 2000 und älter) | Fr. 4'640 / Jahr | [1] Ziff. 3.1 |
| Richtprämie junge Erwachsene (Jg. 2001–2007) | Fr. 3'446 / Jahr | [1] Ziff. 3.1 |
| Richtprämie Kinder (Jg. 2008 und jünger) | Fr. 1'034 / Jahr | [1] Ziff. 3.1 |
| Selbstbehalt bis MGE Fr. 45'000 | 7,00 % des MGE | [1] Ziff. 3.2 |
| Selbstbehalt ab MGE Fr. 85'000 | 12,00 % des MGE | [1] Ziff. 3.2 |
| Stufe dazwischen | +0,125 % pro Fr. 1'000 MGE | [1] Ziff. 3.2 |
| Mindest-IPV Kind (bis MGE 75'000) | 80 % Richtprämie = Fr. 827.20 («Erhöhung … auf Fr. 827.20 pro Kind») | [1] Ziff. 3.3/3.4 |
| Mindest-IPV junge Erwachsene in Ausbildung (bis MGE 75'000) | 50 % Richtprämie = Fr. 1'723 | [1] Ziff. 3.3/3.4 |
| Vermögensanrechnung | 10 % des steuerpflichtigen Gesamtvermögens (kein fester Vermögens-Grenzwert genannt) | [1] Ziff. 2 |
| Mindestanspruch für Auszahlung | Fr. 100 («ab einem Anspruch oder Gesamtanspruch von Fr. 100.–») | [1] Ziff. 4 |
| Schwelle Alleinanspruch junge Erwachsene | MGE über Fr. 12'000 | [1] Ziff. 2.2 |
| Sozialhilfebeziehende (Stichtag 1.1.2026) | volle Richtprämie ohne Selbstbehalt, max. tatsächliche Prämie | [1] Ziff. 3.5 |
| Einkommensgrenze | **keine publizierte Grenze** — ergibt sich rechnerisch aus Richtprämie = Selbstbehalt (abgeleitet, nicht amtlich: Einzelperson ohne Kinder ca. MGE Fr. 55'000–56'000; bei 55'000 Selbstbehalt 8,25 % = 4'537.50 < 4'640, bei 56'000 8,375 % = 4'690 > 4'640) | abgeleitet aus [1] |

Kontrolle mit amtlichem Beispiel: Alleinstehend, MGE 20'000 → 4'640 − 7 % × 20'000 = 3'240; Merkblatt: «Total IPV = Richtprämie minus Selbstbehalt Fr. 3'240.00» [1].

### Massgebendes Einkommen
> «steuerpflichtiges Gesamteinkommen; 10% des steuerpflichtigen Gesamtvermögens; Unterhalts- und Verwaltungskosten für Grundstücke des Privatvermögens, soweit sie den Pauschalabzug von 20% der entsprechenden Erträge übersteigen; Beiträge an anerkannte Formen der gebundenen Selbstvorsorge (Säule 3a); Einkaufsbeiträge an Einrichtungen der beruflichen Vorsorge; sämtliche Einkommen, die über das [BGSA] abgerechnet werden.» — Quelle [1], Ziff. 2

> «Das massgebende Gesamteinkommen wird in der Regel auf der Grundlage der definitiven Steuerveranlagung 2024 berechnet.» — Quelle [1], Ziff. 2

Quellensteuerpflichtige ohne ordentliche Veranlagung: «Bruttoeinkommen reduziert um einen Pauschalabzug von 20%» [1]. Einkünfte nach Art. 22ter und 23 Abs. 1bis StG werden auf 100 % aufgerechnet [1].

### Abweichung zur App
Der App-Wert (maxIncome/subsidySingle) wurde mir nicht übergeben; belegter Vergleichswert: Einzelperson erhält bei MGE 0 die volle Richtprämie Fr. 4'640 und nicht linear abnehmend, sondern 4'640 − gestufter Selbstbehalt; eine feste Einkommensgrenze gibt es in AI nicht (Nullpunkt Einzelperson rechnerisch ca. Fr. 55'000–56'000 MGE). Der lineare App-Abbau bildet die Stufenlogik nicht ab.

### Offen / nicht gefunden
- Standeskommissionsbeschluss GS 832.501 (Rechtsgrundlage, Art. 5 Abs. 5 StKB) nicht selbst geöffnet; Werte stammen aus dem amtlichen Merkblatt, das auf den StKB verweist.
- Ob die 0,125-%-Stufe auf angefangene oder volle Fr. 1'000 wirkt, ist im Merkblatt nur über die Beispiele (60'000 → 15 Stufen, 75'000 → 30 Stufen) erkennbar; für Zwischenwerte (z. B. 60'500) nicht wörtlich geregelt.
- Keine separate Vermögensgrenze publiziert (nur 10 %-Anrechnung).

### Quellen
1. Merkblatt zur individuellen Prämienverbilligung (IPV) 2026 (AI 511.2-34.5-1358131), Kanton Appenzell Innerrhoden, Gesundheitsamt, Stand PDF 09.12.2025. https://www.ai.ch/themen/gesundheit-alter-und-soziales/individuelle-praemienverbilligung/merkblatt-ipv/merkblatt-ipv-2024/@@download/file/Merkblatt%20IPV%202026.pdf — abgerufen 16.09.2026 (HTTP 200, per curl + pdftotext gelesen)

---

## SG — St. Gallen

**Beurteilung:** abbildbar
**Modell (kurz):** Regionale Referenzprämie (3 Regionen) minus Belastungsgrenze in % des massgebenden Einkommens; Satz steigt linear pro Franken über einem Sockel (z. B. Alleinstehend ohne Kinder: 12,16 % bis 18'700, +0,0002 Prozentpunkte je Franken darüber); Vermögensgrenze 100'000; Minimalgarantie Kinder 80 % / JE in Ausbildung 50 % bis Einkommens-Obergrenze
**Zuständig / Weg:** SVA St.Gallen; Antrag nötig (vorausgefülltes elektronisches Anmeldeformular, Anschreiben voraussichtlich Berechtigter), Frist für ganzjährigen Anspruch 31. März 2026; EL-Beziehende ohne Anmeldung
**Gültigkeit:** 2026 definitiv (Regierungsbeschluss sGS 331.538 vom 9.12.2025, in Vollzug seit 1.1.2026)

### Rechenmodell
> «Die Verbilligung der Referenzprämien … beträgt 80 Prozent für Kinder und 50 Prozent für junge Erwachsene in Ausbildung.» — Quelle [2], Art. 19 Abs. 2

> «Für Alleinstehende ohne Kinder mit einem massgebenden Einkommen bis Fr. 18'700.– beträgt die Belastungsgrenze: 12,16 Prozent. Diese erhöht sich für das gesamte massgebende Einkommen um je 0,0002 Prozentpunkte für jeden Franken, um den es Fr. 18'700.– übersteigt.» — Quelle [1], Art. 5 Abs. 1

> «Für Verheiratete ohne Kinder mit einem massgebenden Einkommen bis Fr. 28'050.– beträgt die Belastungsgrenze: 12,16 Prozent. Diese erhöht sich … um je 0,0003 Prozentpunkte für jeden Franken, um den es Fr. 28'050.– übersteigt.» — Quelle [1], Art. 5 Abs. 2

Alleinstehende mit Kindern (Art. 5 Abs. 3): Sockel «Fr. 18'700.–, zuzüglich Fr. 9'350.– für jede weitere erwachsene Person bis zum vollendeten 25. Altersjahr und zuzüglich Fr. 5'610.– für jedes Kind», Satz «10,96 Prozent»; Zuwachs «0,0002 Prozentpunkte für die alleinstehende Person, zuzüglich 0,00005 … für jede weitere erwachsene Person bis zum vollendeten 25. Altersjahr und zuzüglich 0,00003 … für jedes Kind. Die maximale Erhöhung der Belastungsgrenze beträgt 0,0003 Prozentpunkte.» [1]

Verheiratete mit Kindern (Art. 5 Abs. 4): Sockel Fr. 28'050 (+9'350 je JE, +5'610 je Kind), Satz «12,41 Prozent»; Zuwachs «0,00025 Prozentpunkte für die Verheirateten, zuzüglich 0,00005 … je JE … und zuzüglich 0,00003 … für jedes Kind», maximal «0,00035 Prozentpunkte». [1]

Amtliches Beispiel: «Erwachsene, Region I, Referenzprämie CHF 6 285.60 / Abzüglich Selbstbehalt (Annahme: 12,16 Prozent von CHF 10 000.00) CHF 1 216.00 / Summe der Prämienverbilligung CHF 5 069.60» — Quelle [3], Ziff. 6

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Referenzprämie Erwachsene ab 26 — Region 1 / 2 / 3 | Fr. 6'285.60 / 5'879.40 / 5'681.40 | [1] Art. 3 |
| Referenzprämie Erwachsene bis 25 — Region 1 / 2 / 3 | Fr. 4'492.80 / 4'218.00 / 4'063.20 | [1] Art. 3 |
| Referenzprämie Kind — Region 1 / 2 / 3 | Fr. 1'462.80 / 1'351.20 / 1'306.80 | [1] Art. 3 |
| Belastungsgrenze Alleinstehend ohne Kinder | 12,16 % bis 18'700; +0,0002 Pp./Fr. darüber (auf gesamtes Einkommen) | [1] Art. 5 Abs. 1 |
| Belastungsgrenze Verheiratet ohne Kinder | 12,16 % bis 28'050; +0,0003 Pp./Fr. darüber | [1] Art. 5 Abs. 2 |
| Belastungsgrenze Alleinstehend mit Kindern | 10,96 % bis 18'700 (+9'350/JE, +5'610/Kind); Zuwachs 0,0002 (+0,00005/JE, +0,00003/Kind), max. 0,0003 Pp./Fr. | [1] Art. 5 Abs. 3 |
| Belastungsgrenze Verheiratet mit Kindern | 12,41 % bis 28'050 (+9'350/JE, +5'610/Kind); Zuwachs 0,00025 (+0,00005/JE, +0,00003/Kind), max. 0,00035 Pp./Fr. | [1] Art. 5 Abs. 4 |
| Obergrenze Einkommen für Minimalgarantie Kinder/JE (ordentlich besteuert) | Alleinst. 0 K. 41'700 · 1 K. 65'700 · 2 K. 65'700 · 3 K. 70'700 · 4 K. 75'700 · 5+ K. 80'700; Verh. 0 K. 62'600 · 1 K. 86'500 · 2 K. 86'500 · 3 K. 91'500 · 4 K. 96'500 · 5+ K. 101'500 | [1] Art. 6 |
| Obergrenze Bruttoeinkommen (quellenbesteuert) | Alleinst. 0 K. 55'600 … 5+ K. 107'500; Verh. 0 K. 83'500 … 5+ K. 135'400 (vollständig in [1] Art. 7) | [1] Art. 7 |
| Minimalgarantie Beträge R1/R2/R3 | JE in Ausbildung 2'246.40 / 2'109.20 / 2'031.60; Kinder 1'170.25 / 1'080.95 / 1'045.45 | [4] |
| Minimalgarantie Satz | Kinder 80 %, JE in Ausbildung 50 % | [2] Art. 19 Abs. 2 |
| Vermögensgrenze | steuerbares Vermögen über Fr. 100'000 → kein Anspruch; +20'000 je Kind bis 18, +40'000 je JE bis 25, höchstens 150'000 | [2] Art. 12 Abs. 3 |
| Kinderabzug vom massgebenden Einkommen | Fr. 4'000 je Kind/JE mit Familienzulage | [2] Art. 14 Abs. 1 |
| Mindestbetrag | «weniger als Fr. 100.– je Person und Jahr wird nicht ausgerichtet» | [2] Art. 20 |
| Einkommensgrenze allgemein | **keine publizierte feste Grenze** — ergibt sich aus Referenzprämie = Belastungsgrenze. Abgeleitet (nicht amtlich, eigene Rechnung mit 0,0002 Pp. = 0,000002 als Anteil), Alleinstehend ohne Kinder: IPV = 0 ab MGE ca. R1 38'833 / R2 37'112 / R3 36'255; unter Fr. 100 (keine Auszahlung) ab ca. R1 38'414 / R2 36'681 / R3 35'817 | abgeleitet aus [1], [2] |

### Massgebendes Einkommen
> «Grundlage für die Berechnung des massgebenden Einkommens bildet das nach kantonalem Steuerrecht ermittelte Reineinkommen der Steuerperiode des vorletzten Jahres vor dem Bezugsjahr» — Quelle [2], Art. 12 Abs. 1

> «Das massgebende Einkommen entspricht dem Reineinkommen: 1. zuzüglich 20 Prozent des steuerbaren Vermögens; 2. zuzüglich die Beiträge an die Gebundene Selbstvorsorge Säule 3a; 3. zuzüglich die Leistungen und Einkaufsbeiträge an Einrichtungen der beruflichen Vorsorge; 4. zuzüglich den Liegenschaftsaufwand, soweit dieser den Pauschalabzug von 20 Prozent der Mieteinnahmen übersteigt; 5. zuzüglich den Vorjahresverlusten …; 5bis. zuzüglich 75 Prozent des im vereinfachten Verfahren … abgerechneten Bruttolohns; … 6. abzüglich den Kinderabzug» (dazu 5ter freiwillige Zuwendungen/Parteispenden, 5quinquies–5septies je 30 % Eigenmietwert-/Beteiligungsabzug) — Quelle [2], Art. 12 Abs. 2

Für 2026 = Reineinkommen (Code 248) Steuerperiode 2024 [3]. Quellenbesteuerte: «Das massgebende Einkommen … wird zu 75 Prozent angerechnet.» [2] Art. 12bis Abs. 3

### Abweichung zur App
Der App-Wert (maxIncome/subsidySingle) wurde mir nicht übergeben. Belegt: Einzelperson erhält bei Einkommen 0 die regionale Referenzprämie (Fr. 5'681.40–6'285.60) und der Abbau ist nicht linear, sondern quadratisch (Satz steigt mit dem Einkommen); Nullpunkt Alleinstehend rechnerisch ca. Fr. 36'000–39'000 MGE je Region. Die Werte 41'700 usw. sind **keine** allgemeine Einkommensgrenze, sondern nur die Obergrenze für die Minimalgarantie Kinder/JE.

### Wortlaute, die der Code zitiert — nachgetragen 20.09.2026

Beim Bau von `src/config/ipvStGallen.js` wurden sechs Bestimmungen zitiert, die in dieser
Datei noch nicht standen. Die Fachprüfung vom 20.09. hat das gefunden: ein Zitat, das nur im
Code steht, ist aus dem Repo heraus nicht prüfbar — und genau so überlebt ein falsches Zitat.
Alle Texte unten aus den PDF der Gesetzessammlung, abgerufen 20.09.2026.

> «Für die Prämienverbilligung werden regionale Referenzprämien nach Massgabe der vom
> Bundesamt für Gesundheit festgelegten Prämienregionen angewendet.» — [1] Art. 1 Abs. 1

> «Die Zugehörigkeit zur Prämienregion richtet sich nach dem zivilrechtlichen Wohnsitz am
> 1. Januar des Jahres der Prämienverbilligung.» — [1] Art. 2 Abs. 1

> «Die Regierung legt jährlich bis 15. Dezember für das Folgejahr fest: a) die
> Referenzprämien; b) die Belastungsgrenze; c) die Obergrenze des Einkommens zur Verbilligung
> der Referenzprämien nach Art. 65 Abs. 1bis des Bundesgesetzes über die Krankenversicherung
> …; d) den Selbstbehalt für die Krankenpflege-Grundversicherung.» — [2] Art. 19 Abs. 1

> «Die Verbilligung der Referenzprämien nach Art. 65 Abs. 1bis des Bundesgesetzes über die
> Krankenversicherung vom 18. März 1994 beträgt 80 Prozent für Kinder und 50 Prozent für
> junge Erwachsene in Ausbildung. Vorbehalten bleibt eine weiter gehende Verbilligung nach
> Art. 65 Abs. 1 des Bundesgesetzes über die Krankenversicherung vom 18. März 1994.»
> — [2] Art. 19 Abs. 2

⚠️ Der zweite Satz trägt das ganze Garantie-Modell: **80 Prozent ist ein Boden, keine Decke.**
Die beiden Nennungen sind zwei verschiedene Bundesnormen — Abs. 1bis ist die
Mindestverbilligung für Kinder und junge Erwachsene, Abs. 1 die allgemeine kantonale
Verbilligung, die darüber hinausgehen darf. Ohne diesen zweiten Satz liest sich «beträgt
80 Prozent» wie eine Obergrenze; mit ihm ist die Lesart des Codes belegt.

> «Erhalten mehrere Personen eines Haushalts Prämienverbilligung, entspricht der Anteil einer
> Person dem Prozentsatz der Verbilligung der Referenzprämien.» — [2] Art. 21 Abs. 1

> «Für jedes in der Schweiz wohnhafte Kind bis zum vollendeten 18. Altersjahr oder für jede in
> der Schweiz wohnhafte junge erwachsene Person bis zum vollendeten 25. Altersjahr, für das
> oder für die eine Familienzulage … bezogen wird, vermindert sich das massgebende Einkommen
> um Fr. 4000.–.» — [2] Art. 14 Abs. 1

⚠️ **«für das eine Familienzulage bezogen wird»** ist eine Bedingung, die die App nicht prüft —
sie zieht den Abzug für jedes erfasste Kind ab. Das senkt das massgebende Einkommen und wirkt
damit nach oben. Im Modulkopf als bewusste Auslassung benannt.

> «Die massgebende Obergrenze des nach Art. 12 Abs. 2 Ziff. 1 bis 5septies der Verordnung …
> ermittelten Reineinkommens zur Verbilligung der Referenzprämien nach Art. 65 Abs. 1bis des
> Bundesgesetzes über die Krankenversicherung vom 18. März 1994 beträgt bei ordentlich
> besteuerten Personen: …» — [1] Art. 6 Abs. 1

⚠️ **«Ziff. 1 bis 5septies»** — der Kinderabzug ist Ziff. 6 und gehört ausdrücklich NICHT dazu.
Die Obergrenze misst also das Einkommen **vor** dem Kinderabzug. Der Code verglich zuerst das
Einkommen danach; korrigiert am 20.09.2026 nach der Fachprüfung.

### Deckel auf die effektive Prämie: Negativbefund mit Methode

ZH (§ 4 Abs. 3 EG KVG), BE (KKVV Art. 10 Abs. 1), AG (§ 7 Abs. 3 KVGG) und VD (LVLAMal
art. 16 al. 1bis) begrenzen die Verbilligung auf die tatsächlich fakturierte Prämie.
**Für St. Gallen wurde keine solche Bestimmung gefunden.**

Damit dieser Negativbefund nachvollziehbar ist — und nicht bloss eine Behauptung im Code —
hier die Methode (20.09.2026):

- Geprüfter Text: sGS 331.111, vollständiges PDF der Gesetzessammlung, 1524 Zeilen aus
  `pdftotext -layout`; dazu sGS 331.538 vollständig (6 Seiten).
- Suchbegriffe ohne Treffer: «effektiv», «tatsächlich», «nicht mehr als», «begrenzt»,
  «geschuldete Prämie», «Bruttoprämie».
- «höchstens» trifft **einmal** — die Vermögensobergrenze in Art. 12 Abs. 3 («höchstens
  jedoch bis zum Betrag von Fr. 150 000.–»). «übersteigt» trifft zweimal, beide Male im
  Liegenschaftsaufwand bzw. in einer Übergangsbestimmung von 1994.
- **Gegenprobe:** dieselbe Suche findet «Referenzprämie» (7×), «Belastungsgrenze» (7×),
  «Mindestbetrag» (1×) und «Kinderabzug» (4×) — und ein erfundenes Wort 0×. Die Suche
  funktioniert also; das Fehlen ist ein Befund, kein Messfehler.

🛑 **Was das NICHT beweist:** dass es die Regel nirgends gibt. Sie könnte in einer
Weisung, einem Kreisschreiben oder in der Praxis der SVA stehen. Das Risiko ist beträchtlich:
Wer in Region 1 eine günstige Prämie von 280/Monat zahlt, sähe 6'286 statt höchstens 3'360.
Darum steht die Frage auf der Liste an die Ämter, und der Vorbehalt in der App sagt
ausdrücklich, dass sich die Verbilligung an der Referenzprämie bemisst.

### Prämienregionen: gegen die SVA-Liste geprüft

Die Recherche vom 16.09. hielt fest, die Gemeinde-Zuordnung (Formular 4050) sei nicht erfasst.
Nachgeholt am 20.09.2026: `form_4050` (Stand 01.23) gegen die BAG-Daten der App
(`src/data/praemienRegionen.js`, Stand 2026), zwölf Gemeinden über alle drei Regionen —
Altstätten, Oberriet, Wattwil, St.Gallen, Wil, Gossau, Rapperswil-Jona, Bad Ragaz, Widnau,
Buchs (SG), Flawil, Mels. **Keine Abweichung.**

🛑 Zwei eigene Messfehler auf dem Weg dorthin, beide derselbe Typ:
1. Eine geratene BFS-Nummer (3231) wurde für Altstätten gehalten — sie gehört zu **Au (SG)**.
   Daraus entstand kurzzeitig der Befund «Altstätten weicht ab». Altstätten ist 3251.
2. Ein Prüfskript fiel bei unbekanntem Gemeindenamen auf den ersten Treffer der PLZ zurück.
   Weil die Gemeinde in den Daten «Buchs (SG)» heisst und nicht «Buchs», mass es **Grabs**.
   Daraus entstand kurzzeitig der Befund «Buchs weicht ab».

Beide Male: **ein Negativbefund aus geratener Eingabe misst die eigene Vermutung.**
Richtig ist, die Prüf-Eingabe aus der Quelle zu ziehen und den Rückfall laut scheitern zu
lassen, statt still etwas anderes zu messen.

### Offen / nicht gefunden
- Online-Rechner SVA (svasg.ch/ipv-berechnung) für eine Gegenprobe der abgeleiteten Nullpunkte per GET abgefragt: HTTP 500 — Gegenprobe nicht möglich.
- Wörtliche Auslegung «0,0002 Prozentpunkte für jeden Franken» als Anteil 0,000002 ist meine Umrechnung; amtliches Beispiel nur für Einkommen unter dem Sockel (12,16 % von 10'000) vorhanden.
- Zuordnung Gemeinde → Prämienregion (Formular 4050) nicht erfasst.
- Satz «Die Selbstbehalte beginnen … ab 10,96 Prozent» [3] bezieht sich auf Alleinstehende mit Kindern (Art. 5 Abs. 3 [1]).

### Quellen
1. Regierungsbeschluss über die Prämienverbilligung 2026 für Personen im Kanton St.Gallen (sGS 331.538, nGS 2025-071), Regierung des Kantons St.Gallen, vom 9.12.2025, Stand 1.1.2026. https://www.gesetzessammlung.sg.ch/api/de/versions/3847/pdf_file_with_annexes (kanonisch: https://www.gesetzessammlung.sg.ch/app/de/texts_of_law/331.538) — abgerufen 16.09.2026
2. Verordnung zum Einführungsgesetz zur Bundesgesetzgebung über die Krankenversicherung (sGS 331.111), Fassung in Vollzug seit 1.8.2026 (Erlassdatum 11.11.2025). https://www.gesetzessammlung.sg.ch/api/de/versions/3828/pdf_file_with_annexes — abgerufen 16.09.2026
3. Merkblatt Individuelle Prämienverbilligung (IPV) 2026, Form. 4100 01.26, SVA St.Gallen, PDF vom 22.12.2025. https://www.svasg.ch/online-schalter/pdf/form_4100.pdf — abgerufen 16.09.2026
4. Individuelle Prämienverbilligung (IPV) 2026 – Erläuterungen zur Verfügung, Form. 4200 01.26, SVA St.Gallen, PDF vom 03.12.2025. https://www.svasg.ch/online-schalter/pdf/form_4200.pdf — abgerufen 16.09.2026
5. Individuelle Prämienverbilligungen (IPV), SVA St.Gallen (Frist «jeweils bis 31. März»). https://www.svasg.ch/produkte/ipv/ — abgerufen 16.09.2026

---

## GR — Graubünden

**Beurteilung:** abbildbar
**Modell (kurz):** Regionale Richtprämie (3 Regionen, 90 % der BAG-Durchschnittsprämie) minus Selbstbehalt nach Einkommenskategorie (5 % / 6,5 % / 8 % / 9 % / 10 % des anrechenbaren Einkommens); Kinder und JE in Ausbildung alternativ 100/75/50/25 % Verbilligung bis 65'000/70'000/75'000/80'000, höherer Betrag gilt
**Zuständig / Weg:** SVA Graubünden (AHV-Ausgleichskasse); Antrag (online oder bei SVA/AHV-Zweigstelle der Wohngemeinde), Frist 31.12.2026 (Posteingang); Vorschussleistung 65 % bei fehlender definitiver Veranlagung 2025; bisherige Beziehende erhalten von Amtes wegen Mitteilung über Vorschusszahlung und gelten als angemeldet
**Gültigkeit:** 2026 definitiv (Wegleitung IPV 2026, PDF vom 05.01.2026; Selbstbehalt-Stufen im Gesetz KPVG, Stand 1.1.2025)

### Rechenmodell
> «Die massgebenden Prämien werden verbilligt, soweit sie einen nach Einkommenskategorien abgestuften Selbstbehalt übersteigen.» — Quelle [2], Art. 8 Abs. 1

> «Der Selbstbehalt beträgt für anrechenbare Einkommen bis 10 000 Franken 5 Prozent, bis 20 000 Franken 6,5 Prozent und bis 30 000 Franken 8 Prozent. Er erhöht sich für jede weitere Einkommenskategorie von 10 000 Franken um je 1 Prozentpunkt bis 10 Prozent.» — Quelle [2], Art. 8 Abs. 2

> «Die massgebenden Prämien für Kinder und junge Erwachsene in Ausbildung werden wie folgt verbilligt: a) bis zu einem anrechenbaren Einkommen von 65 000 Franken um 100 Prozent; b) bis … 70 000 Franken um 75 Prozent; c) bis … 75 000 Franken um 50 Prozent; d) bis … 80 000 Franken um 25 Prozent. Als junge Erwachsene in Ausbildung gelten Personen bis zum erfüllten 25. Altersjahr.» — Quelle [2], Art. 8 Abs. 3

> «Zur Auszahlung gelangt der höhere der gemäss den Absätzen 2 und 3 berechneten Beträge.» — Quelle [2], Art. 8 Abs. 4

> «… werden die vom Bund pro Personenkategorie und Region festgelegten monatlichen Durchschnittsprämien für die obligatorische Krankenpflegeversicherung um 10 Prozent reduziert. Diese sind auf den nächsten Franken aufzurunden.» — Quelle [3], Art. 17 Abs. 1

Gesamtanspruch: «Bei Personen im Gesamtanspruch werden die anrechenbaren Einkommen sowie die Richtprämien aller Personen zusammengezählt.» — Quelle [1]

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Richtprämie Erwachsene ab 26 — Region 1 / 2 / 3 | Fr. 5'916 / 5'532 / 5'232 | [1] |
| Richtprämie junge Erwachsene 19–25 — Region 1 / 2 / 3 | Fr. 4'368 / 4'092 / 3'912 | [1] |
| Richtprämie Kinder bis 18 — Region 1 / 2 / 3 | Fr. 1'404 / 1'320 / 1'248 | [1] |
| Selbstbehalt anrechenbares Einkommen bis und mit 10'000 | 5,0 % | [1], [2] |
| … bis und mit 20'000 | 6,5 % | [1], [2] |
| … bis und mit 30'000 | 8,0 % | [1], [2] |
| … bis und mit 40'000 | 9,0 % | [1] |
| … ab 40'001 | 10,0 % | [1] |
| Kinder/JE in Ausbildung: Selbstbehalt bis 65'000 / 70'000 / 75'000 / 80'000 / ab 80'001 | 0 % / 25 % / 50 % / 75 % / 100 % (der Richtprämie) | [1], [2] Art. 8 Abs. 3 |
| Vermögen | 10 % des Reinvermögens wird angerechnet; keine separate Vermögensgrenze gefunden | [2] Art. 8a |
| Vorschussleistung | 65 % des provisorisch berechneten Werts | [1] |
| Volle Verbilligung | EL-, Sozialhilfe-, Mutterschaftsbeitrags-Beziehende | [2] Art. 9 |
| Einkommensgrenze allgemein | **keine publizierte feste Grenze**. Abgeleitet (nicht amtlich), Einzelperson ab 26 ohne Kinder: Selbstbehalt 10 % → IPV = 0 ab anrechenbarem Einkommen R1 59'160 / R2 55'320 / R3 52'320 | abgeleitet aus [1], [2] |
| Mindestbetrag für Auszahlung | nicht gefunden | — |

### Massgebendes Einkommen
> «Das anrechenbare Einkommen entspricht dem satzbestimmenden steuerbaren Einkommen gemäss den definitiven kantonalen Steuerdaten des Vorjahres zuzüglich: a) 10 Prozent des Reinvermögens gemäss der Steuerveranlagung, soweit der Wert nicht negativ ist; b) der nicht versteuerten Erträge aus massgeblichen Beteiligungen …; c) des absoluten Nettoertrags der Liegenschaften …, soweit der Wert negativ ist; d) der Beiträge einschliesslich der Einkaufsbeiträge an die berufliche Vorsorge …; e) der Beiträge an die gebundene Selbstvorsorge …; f) der gemeinnützigen Zuwendungen …; g) der Mitgliederbeiträge und Zuwendungen an politische Parteien …» — Quelle [2], Art. 8a Abs. 1

Für 2026 = definitive Steuerveranlagung 2025 [1]. «Zudem werden die Einkommen berücksichtigt, welche dem vereinfachten Abrechnungsverfahren unterliegen.» [1] Gesamtanspruch: anrechenbare Einkommen werden zusammengezählt [2] Art. 8a Abs. 2.

### Abweichung zur App
Der App-Wert (maxIncome/subsidySingle) wurde mir nicht übergeben. Belegt: Einzelperson erhält bei Einkommen 0 die volle regionale Richtprämie (Fr. 5'232–5'916), der Abbau ist stufig (5 %→10 % des Einkommens), nicht linear; Nullpunkt rechnerisch bei Fr. 52'320–59'160 je Region.

### Offen / nicht gefunden
- Ob der Stufen-Satz auf das **gesamte** anrechenbare Einkommen angewendet wird (dann Sprünge an den Stufengrenzen, z. B. 40'000 × 9 % = 3'600 vs. 40'001 × 10 % = 4'000) oder progressiv je Tranche, ist im Wortlaut nicht ausdrücklich geregelt; Leseart «gesamtes Einkommen» ist naheliegend, aber nicht durch ein amtliches Rechenbeispiel belegt. Gegenprobe mit dem SVA-Online-Rechner (formulare.sva.gr.ch/ipv.php, POST-Formular) nicht durchgeführt.
- Regierungsbeschluss mit den Richtprämien 2026 nicht selbst gefunden; Werte stammen aus der amtlichen SVA-Wegleitung 2026.
- Ob der Grosse Rat nach Art. 8 Abs. 5 KPVG für 2026 den Selbstbehalt erhöht hat: nicht gefunden; die Wegleitung 2026 nennt die gesetzlichen Stufen unverändert.
- Mindestbetrag (Bagatellgrenze) nicht gefunden.
- Gemeinde → Prämienregion: https://www.sva.gr.ch/files/sva/dienstleistungen/07_ipv/ipv_praemienregion_d.pdf (nicht geöffnet).

### Quellen
1. Wegleitung Individuelle Prämienverbilligung 2026, SVA Graubünden, PDF vom 05.01.2026. https://formulare.sva.gr.ch/downloads/ipv_wegleitung_d.pdf — abgerufen 16.09.2026 (unter https://www.sva.gr.ch/downloads/ipv_wegleitung_d.pdf: HTTP 404)
2. Gesetz über die Krankenversicherung und die Prämienverbilligung (KPVG, BR 542.100), Kanton Graubünden, aktuelle Version in Kraft seit 01.01.2025. https://www.gr-lex.gr.ch/api/de/versions/3445/pdf_file_with_annexes (kanonisch https://www.gr-lex.gr.ch/app/de/texts_of_law/542.100) — abgerufen 16.09.2026
3. Verordnung zum Gesetz über die Krankenversicherung und die Prämienverbilligung (VOzKPVG, BR 542.120), Stand 1.1.2026. https://www.gr-lex.gr.ch/api/de/versions/3606/pdf_file_with_annexes — abgerufen 16.09.2026

---

## AG — Aargau

**Beurteilung:** abbildbar
**Modell (kurz):** Summe Richtprämien Haushalt minus Einkommenssatz 17,5 % × massgebendes Einkommen (bereinigtes steuerbares Einkommen + 1/5 steuerbares Vermögen − Einkommensabzug je Haushaltstyp − Fr. 2'500 je Kind/JE in Ausbildung); Kinder/JE in Ausbildung bei Anspruch mind. 50 % der effektiven Prämie
**Zuständig / Weg:** SVA Aargau; SVA ermittelt Berechtigte aus Steuerdaten und schreibt sie an, Antrag innert sechs Wochen; spätestens 31. Dezember im Vorjahr (für 2026: 31.12.2025, abgelaufen), sonst verwirkt
**Gültigkeit:** 2026 definitiv (Anhang 1 V KVGG «Berechnungselemente für die Verteilung der Prämienverbilligung 2026», Stand 1.9.2025). ~~⚠️ Widerspruch auf der SVA-Seite, siehe «Offen».~~ **Am 20.09.2026 aufgelöst: die SVA-Seite schreibt heute durchgehend «Bezugsjahr 2027», siehe «Nachprüfung 20.09.2026».** In der App gebaut ist 2026.

### Rechenmodell
> «Anspruch auf Prämienverbilligung besteht, wenn die Richtprämie einen prozentualen Anteil des massgebenden Einkommens übersteigt. Bei Mehrpersonenhaushalten werden die Richtprämien der einzelnen Haushaltsmitglieder zusammengezählt.» — Quelle [1], § 6 Abs. 1

> «Dazu gehören der Einkommenssatz (Prozentsatz, mit dem das massgebende Einkommen gemäss § 6 Abs. 1 multipliziert wird), der Einkommensabzug und die Richtprämien.» — Quelle [1], § 5 Abs. 1

> «Für Haushalte mit Kindern oder jungen Erwachsenen in Ausbildung, die zusammen mit den Eltern eingestuft werden, kommt neben dem Einkommensabzug ein zusätzlicher Kinderabzug zum Tragen.» — Quelle [1], § 5 Abs. 4

> «Besteht ein Anspruch gemäss § 6 Abs. 1, beträgt die Prämienverbilligung von Kindern und jungen Erwachsenen in Ausbildung mindestens 50 % der effektiven Prämie.» — Quelle [1], § 7 Abs. 2 (dazu V KVGG § 4 Abs. 5: Erhöhung, wenn der Mindestanspruch nach Art. 65 Abs. 1bis KVG nicht eingehalten ist [2])

> «Die Prämienverbilligung wird höchstens im Umfang der effektiven Prämie des Anspruchsjahres ausgerichtet.» — Quelle [1], § 7 Abs. 3

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Richtprämie Erwachsene | Fr. 5'830 / Jahr | [2] Anhang 1, [3] |
| Richtprämie junge Erwachsene (19–25) | Fr. 4'260 / Jahr | [2] Anhang 1, [3] |
| Richtprämie Kinder | Fr. 1'380 / Jahr | [2] Anhang 1, [3] |
| Einkommenssatz | 17,5 % | [2] Anhang 1, [3] |
| Einkommensabzug Alleinstehende | Fr. 8'500 | [2] Anhang 1 |
| Einkommensabzug Alleinstehende mit Kind(ern) | Fr. 12'200 | [2] Anhang 1 |
| Einkommensabzug Ehepaare | Fr. 0 | [2] Anhang 1 |
| Einkommensabzug Ehepaare mit Kind(ern) | Fr. 8'000 | [2] Anhang 1 |
| Zusatzabzug pro Kind / gemeinsam eingestuften JE in Ausbildung | Fr. 2'500 | [2] Anhang 1 |
| Vermögen | 1/5 (20 %) des steuerbaren Vermögens wird angerechnet; keine separate Vermögensgrenze | [1] § 6 Abs. 2 |
| Säule 3a ohne Pensionskasse | nur aufgerechnet, soweit über 10 % des Nettoerwerbseinkommens | [2] § 5 Abs. 1 |
| Grenzwert selbstständiger Lebensunterhalt JE | steuerbares Einkommen höher als Fr. 24'000 | [2] § 5 Abs. 2 |
| Datenzugriff SVA (Vorauswahl) | steuerbares Einkommen + 20 % Vermögen bis Tarif A Fr. 44'000 / Tarif B Fr. 140'000 | [2] § 5 Abs. 3 |
| Einkommensgrenze (§ 5 Abs. 5 KVGG: «das höchste massgebende Einkommen, bis zu welchem Prämienverbilligung bezogen werden kann») | **nicht als Zahl publiziert gefunden**. Abgeleitet (nicht amtlich), Einzelperson: 5'830 / 0,175 = massgebendes Einkommen Fr. 33'314; + Abzug 8'500 → bereinigtes steuerbares Einkommen (+20 % Vermögen) ca. Fr. 41'814 | abgeleitet aus [1], [2] |

Rechenbeispiel (eigene Rechnung, nicht amtlich): Einzelperson, bereinigtes steuerbares Einkommen 20'000, kein Vermögen → massgebend 11'500 → 5'830 − 17,5 % × 11'500 = 3'817.50.

### Massgebendes Einkommen
> «Das massgebende Einkommen besteht aus dem bereinigten steuerbaren Einkommen, zuzüglich einem Fünftel des steuerbaren Vermögens des massgebenden Steuerjahres, abzüglich eines Einkommensabzugs.» — Quelle [1], § 6 Abs. 2

> «Das bereinigte steuerbare Einkommen entspricht dem rechtskräftig veranlagten steuerbaren Einkommen ohne Berücksichtigung a) der Abzüge für Liegenschaftsunterhaltskosten, soweit sie über dem Pauschalabzug liegen, b) der Abzüge für Einkaufsbeiträge an die Säule 2 und Beiträge an die Säule 3a, c) der Abzüge für freiwillige Zuwendungen, d) der Abzüge für Zuwendungen an politische Parteien, e) der Abzüge für Verluste früherer Geschäftsjahre bei Selbstständigerwerbenden, f) des zusätzlichen Sozialabzugs für tiefe Einkommen.» — Quelle [1], § 6 Abs. 3 (+ BGSA-Einkommen nach Abs. 4)

> «Das massgebende Steuerjahr ist dasjenige Jahr, das drei Jahre vor dem Anspruchsjahr begonnen hat.» — Quelle [1], § 7 Abs. 1 (für 2026 also Steuerjahr 2023)

### Abweichung zur App
Der App-Wert (maxIncome/subsidySingle) wurde mir nicht übergeben. Belegt: Einzelperson bei Einkommen 0 erhält Fr. 5'830 (Richtprämie; begrenzt auf effektive Prämie); der Abbau ist in AG tatsächlich linear (17,5 % je Franken massgebendes Einkommen), aber erst nach dem Einkommensabzug von Fr. 8'500 — Nullpunkt Einzelperson ca. Fr. 41'814 bereinigtes steuerbares Einkommen (abgeleitet).

### Offen / nicht gefunden
- ⚠️ **Widerspruch SVA-Seite:** Die SVA-Aargau-Seite «Allgemeine Informationen» nennt heute «Sie betragen für das Bezugsjahr 2026: für Erwachsene: 6'070 Franken jährlich» und «Der Einkommenssatz beträgt 19.25 Prozent», steht aber im Satz davor unter «Berechnungsbasis für die Prämienverbilligung 2027». Die Rechtssammlung (Anhang 1 V KVGG, «Prämienverbilligung 2026») und das Kantons-PDF nennen für 2026 Fr. 5'830 und 17,5 %. Wahrscheinlich sind 6'070 / 4'440 / 1'450 / 19,25 % die Werte **2027** und «2026» auf der SVA-Seite ist ein Beschriftungsfehler — **nicht belegt**; der Regierungsratsbeschluss für 2027 ist in der Gesetzessammlung noch nicht eingepflegt (aktuelle Fassung V KVGG in Kraft seit 1.9.2025). Für 2026 gilt die Rechtssammlung.
- Genaue Formel für Haushalte mit Kindern (Einkommensabzug 12'200 bzw. 8'000 **plus** 2'500 je Kind) aus Wortlaut § 5 Abs. 4 KVGG abgeleitet; kein amtliches Rechenbeispiel geöffnet.
- Online-Rechner (www.sva-aargau.ch/rechner) steht bereits auf 2027; keine Gegenprobe für 2026 möglich.
- Mindestbetrag (Bagatellgrenze) nicht gefunden.

### Quellen
1. Gesetz zum Bundesgesetz über die Krankenversicherung (KVGG, SAR 837.200), Kanton Aargau, aktuelle Version in Kraft seit 01.12.2025. https://gesetzessammlungen.ag.ch/api/de/versions/3878/pdf_file_with_annexes (kanonisch https://gesetzessammlungen.ag.ch/app/de/texts_of_law/837.200) — abgerufen 16.09.2026
2. Verordnung zum Gesetz zum Bundesgesetz über die Krankenversicherung (V KVGG, SAR 837.211) mit Anhang 1 «Berechnungselemente für die Verteilung der Prämienverbilligung 2026» (Stand 1. September 2025), Version in Kraft seit 01.09.2025 (Beschluss 27.08.2025). https://gesetzessammlungen.ag.ch/api/de/versions/3870/pdf_file_with_annexes — abgerufen 16.09.2026
3. Anhang 1 Berechnungselemente für die Verteilung der Prämienverbilligung 2026 (AGS 2025/…), Kanton Aargau, Handbuch Soziales, PDF geändert 05.11.2025. https://www.ag.ch/media/kanton-aargau/dgs/dokumente/gesellschaft/soziales/handbuch-soziales/kapitel-7/richtpr-mien-2026.pdf — abgerufen 16.09.2026
4. Allgemeine Informationen (Prämienverbilligung), SVA Aargau (widersprüchliche Jahresangabe, s. oben). https://www.sva-aargau.ch/private/ihre-private-situation/finanzielle-unterstuetzung/praemienverbilligung/allgemeine — abgerufen 16.09.2026
5. Informationsblatt Prämienverbilligung 2027, SVA Aargau (enthält keine Zahlen). https://www.sva-aargau.ch/informationsblattpv — abgerufen 16.09.2026

### Nachprüfung 20.09.2026 (K31, Einbau in die App)

Alle fünf Quellen an diesem Tag erneut abgerufen, bevor eine Zeile Code entstand.

**Der Zahlen-Widerspruch vom 16.09. besteht nicht mehr.** Die SVA-Seite [4] schreibt heute
durchgehend 2027:

> «Berechnungsbasis für die Prämienverbilligung 2027 ist das steuerbare Einkommen der
> rechtskräftigen Steuerveranlagung 2024.»

> «Die Richtprämien sind im Krankenversicherungsgesetz sowie in der dazugehörenden Verordnung
> geregelt. Sie betragen für das Bezugsjahr 2027: für Erwachsene: 6'070 Franken jährlich /
> 505.85 Franken pro Monat …» · «Der Einkommenssatz beträgt 19.25 Prozent.»

Die am 16.09. notierte Jahresangabe «2026» bei denselben Zahlen steht dort nicht mehr.
6'070 / 4'440 / 1'450 und 19,25 % sind die Werte **2027**. Damit ist keine Frage an die SVA
nötig — die Beschriftung war der Fehler, und er ist behoben.

**Für 2026 gilt unverändert die Rechtssammlung**, wörtlich nachgelesen in [2] und [3]:

> «Berechnungselemente für die Verteilung der Prämienverbilligung 2026 · Richtprämien · … a) für
> Erwachsene: Fr. 5'830.–, b) für junge Erwachsene: Fr. 4'260.–, c) für Kinder: Fr. 1'380.–.»
> · «Der Einkommenssatz gemäss § 5 KVGG beträgt 17,5 %.»

**Kein Regierungsratsbeschluss für 2027 in der Gesetzessammlung.** Die API zu SAR 837.211
(20.09.2026) meldet als aktuelle Fassung weiterhin Version 3870, «in Kraft seit: 01.09.2025
(Beschlussdatum: 27.08.2025)», dazu `future_versions: 0` und kein Änderungsdokument aus 2026
(jüngstes: Publikation 20.10.2025). Dasselbe Bild bei SAR 837.200 (Version 3878, in Kraft seit
01.12.2025, keine künftige Fassung). Ein PDF «richtpr-mien-2027.pdf» an der Stelle von [3] gibt
es nicht (404). **Die Werte 2027 sind damit nur auf der SVA-Seite belegt, nicht im Erlass** —
darum in der App gebaut: 2026. Offener Punkt → `FRAGEN-AN-DIE-AEMTER.md`, Frage 4.

**Frist bestätigt — und für 2026 abgelaufen.** [1] § 10 Abs. 4:

> «Anträge auf Ausrichtung der Prämienverbilligung sind in jedem Fall bis spätestens
> 31. Dezember im Vorjahr des Anspruchsjahres zu stellen, andernfalls der Anspruch auf
> Prämienverbilligung für das betreffende Anspruchsjahr verwirkt ist.»

Das Informationsblatt [5] sagt dasselbe in Alltagssprache und nennt das laufende Verfahren:

> «Mit dem Anmeldecode können Sie sich ab September 2026 bis am 31. Dezember 2026 online für
> die Prämienverbilligung 2027 anmelden – vorher sind noch keine Anmeldungen möglich.»

> «Der Code ist 6 Wochen gültig. Bitte reichen Sie Ihren Antrag spätestens bis am 31. Dezember
> 2026 ein – danach können Sie die Prämienverbilligung 2027 nicht mehr beantragen.»

Für das Anspruchsjahr **2026** war die Frist der 31.12.2025 — sie ist abgelaufen. Ausnahmen
nennt der Erlass nur für besondere Lagen: Sozialhilfe- und EL-Beziehende erhalten die
Verbilligung ohne Antrag ([1] § 17 Abs. 1 «Der Eintritt in die Sozialhilfe gilt als Antrag auf
Prämienverbilligung», Informationsblatt [5] ausdrücklich auch für EL), und das ausserordentliche
Verfahren ([1] §§ 11–16) steht bei wesentlicher Verschlechterung, veränderten persönlichen
Verhältnissen oder Zuzug offen. Die App sagt das an jedem AG-Betrag (`ipv.agFristAbgelaufen`).

**Massgebendes Steuerjahr: drei Jahre zurück.** [1] § 7 Abs. 1 «Das massgebende Steuerjahr ist
dasjenige Jahr, das drei Jahre vor dem Anspruchsjahr begonnen hat» — für 2026 also 2023. Die
SVA-Seite bestätigt die Mechanik am Jahr 2027 (Veranlagung 2024). Eigener Anzeige-Vorbehalt
`ipv.vorbehaltAG`, weil BE mit zwei Jahren rechnet und der BE-Satz hier falsch wäre.

**Keine Prämienregionen — bestätigt, und bewusst nicht gebaut.** [1] § 5 Abs. 2 kennt nur die
drei Alterskategorien, [2] § 4 Abs. 1 definiert die Richtprämie als «Durchschnittswert der
jeweils zehn günstigsten Prämien **im Kanton Aargau**», und Anhang 1 nennt je einen einzigen
Betrag. Die App baut für AG darum keine Gemeinde- und keine Regionenlogik (Test hält es fest).

**Zwei Lücken der Erhebung geschlossen:**
- Die Formel für Haushalte mit Kindern ist jetzt amtlich belegt: Das Rechenbeispiel der SVA [4]
  (verheiratetes Paar, 2 Kinder, 1 junger Erwachsener in Ausbildung) rechnet «Einkommensabzug
  für Haushalt mit Kindern − 8'000» **plus** «Kinderabzüge total − 7'500» (= 3 × 2'500, also
  auch für den gemeinsam eingestuften jungen Erwachsenen) und anschliessend «Total Richtprämien
  19'480 − Einkommenssatz 19.25 Prozent von 30'397 Franken = 13'628.55». Struktur bestätigt.
- Die Verteilung im Haushalt steht in [2] § 4 Abs. 4: «Die Verteilung des Haushaltsanspruchs auf
  die Haushaltsmitglieder erfolgt anteilmässig im Verhältnis der Richtprämien.» Die effektive
  Prämie ist dabei personenbezogen ([2] § 4 Abs. 3: «die effektive KVG-Prämie am 1. Januar des
  Anspruchsjahres»), Deckel und Mindestanspruch gelten also je Person.

**Weiterhin offen:**
- **Einkommensgrenze nach § 5 Abs. 5 KVGG**: an keiner der fünf Quellen als Zahl gefunden
  (auch nicht bei der SVA, die stattdessen die Regel nennt: Anspruch, «sofern die
  durchschnittlichen Krankenkassenprämien mehr als 19.25 Prozent Ihres Haushaltseinkommens
  ausmachen»). Die abgeleitete Grenze (5'830 ÷ 17,5 % = Fr. 33'314 massgebendes Einkommen)
  bleibt **unsere Rechnung**. Die App nennt darum für AG **keine Grenze als Zahl**; bei
  fehlendem Anspruch steht der Grund statt eines Betrags (`ipv.agKeinAnspruch`).
- Online-Rechner der SVA steht auf 2027 — für 2026 nach wie vor keine Gegenprobe möglich.
- Mindestbetrag (Bagatellgrenze) weiterhin nicht gefunden.
- **Bewusst nicht gerechnet: Haushalte mit Kindern.** [1] § 7 Abs. 2 gibt Kindern und jungen
  Erwachsenen in Ausbildung «mindestens 50 % der **effektiven Prämie**» — anders als in ZH, wo
  der Mindestanspruch an der Richtprämie hängt. Die App erfasst nur eine einzige
  Krankenkassenprämie, nicht die der Kinder; der Mindestanspruch bindet ab rund Fr. 20'000
  massgebendem Einkommen und würde den Betrag ohne ihn um mehrere hundert Franken zu tief
  zeigen. Die reine Rechenfunktion kann ihn (getestet), die App zeigt bis auf Weiteres eine
  Orientierung mit Grund.
- Ebenfalls nicht gerechnet: Paare — [1] § 9 Abs. 2 stellt eingetragene Partnerschaft **und**
  Konkubinat den Ehepaaren gleich und nimmt das Konkubinat «bei einem gemeinsamen Haushalt» an.
  ⟨korrigiert 20.09.2026, Fachprüfung⟩ Hier stand «strenger als BE» — das war eine eigene
  Auslegung. [2] § 7a Abs. 2 führt aus, wann die Lebensgemeinschaft vermutet wird: «a) seit
  mindestens 2 Jahren ein gemeinsamer Haushalt geführt wird, b) 2 Personen mit einem gemeinsamen
  Kind … zusammenleben, oder c) auf Grund anderer konkreter Umstände …». Junge Erwachsene 19–25 ([1] § 9 Abs. 3: Einstufung mit den
  Eltern unter Fr. 24'000). Quellenbesteuerte ([2] § 2).

### Fachprüfung 20.09.2026 (swiss-precision-pruefer, Quellen selbst nachgemessen)

Bestätigt, Zeichen für Zeichen gegen Anhang 1 V KVGG und KVGG: Richtprämien 5'830 / 4'260 /
1'380 · Einkommenssatz 17,5 % · alle vier Einkommensabzüge und der Kinderabzug · die
1/5-Vermögensregel · Verteilung im Verhältnis der Richtprämien · Deckel je Person ·
Kinder-Mindestanspruch nur bei bestehendem Anspruch · Basisjahr drei Jahre zurück (2023 für
2026, von der SVA-Mechanik für 2027 gegengeprüft) · Altersschnitt · keine Regionen · keine
publizierte Einkommensgrenze. Der Widerspruch vom 16.09. ist auch in der unabhängigen
Nachmessung verschwunden, und für 2027 ist **keine** Fassung in Kraft (`future_versions: 0`).

Drei Befunde eingearbeitet:

- **Die unterdrückte Einkommensgrenze kam in der Finanzübersicht zurück** — als «Einkommen über
  Grenze (CHF )», eine Grenze ohne Zahl. Die Kachel zeigt jetzt denselben Grund wie die
  Detailseite. *Die Datenzeile war sauber, die zweite Anzeigestelle nicht — genau die Sorte
  Fehler, die nur auffällt, wenn jemand den ganzen Weg bis zur Ausgabe geht.*
- **Der Fristhinweis war zu absolut.** Er sagte, für das laufende Jahr lasse sich nichts mehr
  beantragen. [1] §§ 11–16 KVGG kennen aber das **ausserordentliche Verfahren**: «Personen, die
  von einer wesentlichen Verschlechterung der wirtschaftlichen Verhältnisse betroffen sind,
  können Antrag stellen» (§ 13 Abs. 1), konkretisiert in § 11 Abs. 2 («mindestens sechs Monate
  … mindestens 20 %»). Wer gerade die Stelle verloren hat, las bei uns, die Tür sei zu. Der
  Satz steht jetzt in allen fünf Sprachen dabei.
- **Ohne erfasste Prämie fiel der Deckel still weg** ([1] § 7 Abs. 3). Gemessen: Einkommen 0,
  keine Prämie erfasst → Fr. 5'830 im Jahr, also die volle Richtprämie statt des Anspruchs.
  Dasselbe Muster steckte in BE ([5] Art. 10 Abs. 1) und ZH (§ 4 Abs. 3 EG KVG). **Alle drei
  zeigen jetzt keine Zahl, bis die Prämie dasteht** — mit eigenem Grund in der Anzeige.

Kleinere Korrekturen: die Zusage «Sozialhilfe und EL erhalten ohne Antrag» ist für die EL-Hälfte
durch die SVA-Seite [4] belegt, nicht durch § 17 Abs. 1 KVGG (der nur die Sozialhilfe regelt) ·
die Rundungsregel des amtlichen Rechenbeispiels (5'851.45 statt exakt 5'851.4225) ist ungeklärt
und für die App ohne Folge · [2] § 5 Abs. 3 publiziert zwar Zahlen (Tarif A Fr. 44'000, Tarif B
Fr. 140'000), das sind aber die Schwellen für den Datenzugriff der SVA, nicht die
Einkommensgrenze nach § 5 Abs. 5.

**Nicht nachgemessen:** die zwei Zitate aus dem Informationsblatt (Anmeldefenster, Code sechs
Wochen gültig) — die Seite liefert heute HTML statt PDF. Tragend sind sie nicht; die Frist steht
wörtlich in § 10 Abs. 4 KVGG.

---

## TG — Thurgau

**Beurteilung:** teilweise
**Modell (kurz):** Feste Pauschalbeträge nach Kategorie der **einfachen satzbestimmenden Steuer zu 100 %** (nicht nach Einkommen): Erwachsene A ≤ 400 → 3'408 · B ≤ 600 → 2'556 · C ≤ 800 → 1'704; Kinder D ≤ 1'600 (Eltern) → 1'236; nur ohne steuerbares Vermögen (Fr. 0)
**Zuständig / Weg:** Krankenkassenkontrollstelle der Wohnsitzgemeinde (Grenzgänger: Gemeinde des Arbeitsorts); reines Antragsprinzip, jährlich; Gemeinde stellt Berechtigten im Frühjahr ein Formular zu; Frist 31.12.2026, sonst verfällt der Anspruch
**Gültigkeit:** 2026 definitiv (TG KVV § 14, Version in Kraft seit 01.01.2026; Merkblatt Amt für Gesundheit vom 16.12.2025)

Warum «teilweise»: Modell und alle Beträge sind amtlich vollständig; die App rechnet aber mit Einkommen. Der Kanton knüpft an den **Steuerbetrag** (einfache Steuer) an — eine Einkommensgrenze in Franken Einkommen ist nicht publiziert. Abbildbar wird es erst, wenn die App die einfache Steuer abfragt (steht auf der Steuerrechnung) oder den TG-Einkommenssteuertarif nachbildet (nicht erhoben).

### Rechenmodell
> «Die Prämienverbilligungen betragen: 1. Fr. 3'408 bis zum Steuerbetrag von Fr. 400 einfache satzbestimmende Steuer zu 100 % und ohne steuerbares Vermögen 2. Fr. 2'556 bis zum Steuerbetrag von Fr. 600 … 3. Fr. 1'704 bis zum Steuerbetrag von Fr. 800 … 5. Fr. 1'236 für Kinder bis zum Steuerbetrag von Fr. 1'600 einfache satzbestimmende Steuer zu 100 % und ohne steuerbares Vermögen der Eltern 6. Fr. 6'132 für erwachsene Sozialhilfeempfänger 7. Fr. 1'236 für Sozialhilfeempfänger bis zum 18. Altersjahr» — Quelle [1], § 14 Abs. 1

> «Massgebend ist die einfache satzbestimmende Steuer zu 100 % per 1. Januar 2026 (provisorische Steuerdaten des Vorjahres). Das provisorisch veranlagte steuerbare Vermögen darf zudem Fr. 0 nicht übersteigen.» — Quelle [2]

> «Versicherte Kinder werden auf Basis der einfachen Steuer zu 100 % der Eltern per 1. Januar (provisorische Steuerdaten des Vorjahres) bemessen.» — Quelle [2]

> «Junge Erwachsene in bescheidenen wirtschaftlichen Verhältnissen, die sich am 31. Dezember 2026 in einer Ausbildung befinden, haben Anspruch auf 50 % der effektiven KVG-Prämie, maximal 50 % der kantonalen Durchschnittsprämie (Jahr 2026: Fr. 4'752, davon 50 % = Fr. 2'376). Die bezugsberechtigten Personen erhalten im laufenden Jahr die zustehende IPV nach Kat. A – C. Sie können im Folgejahr eine Neubeurteilung beantragen.» — Quelle [2]

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Kat. A Erwachsene: einfache Steuer bis Fr. 400 | IPV Fr. 3'408 | [1] § 14, [2] |
| Kat. B Erwachsene: einfache Steuer bis Fr. 600 | IPV Fr. 2'556 | [1] § 14, [2] |
| Kat. C Erwachsene: einfache Steuer bis Fr. 800 | IPV Fr. 1'704 | [1] § 14, [2] |
| Kat. D Kinder (Jg. 2008–2025): einfache Steuer der Eltern bis Fr. 1'600 | IPV Fr. 1'236 | [1] § 14, [2] |
| Vermögensgrenze | steuerbares Vermögen Fr. 0 (bei Kindern: der Eltern) | [1] § 14, [2] |
| Junge Erwachsene in Ausbildung (Jg. 2001–2007) | 50 % der effektiven Prämie, max. Fr. 2'376 (50 % der kant. Durchschnittsprämie Fr. 4'752); im laufenden Jahr zuerst Kat. A–C | [2] |
| Erwachsene Sozialhilfebeziehende | Fr. 6'132 | [1] § 14 Ziff. 6 |
| Kinder Sozialhilfebeziehende | Fr. 1'236 | [1] § 14 Ziff. 7 |
| Bagatellgrenze bei Neubemessung | Differenzbeträge unter Fr. 30 werden nicht ausbezahlt/zurückgefordert | [1] § 15 Abs. 2bis |
| Einkommensgrenze in Franken Einkommen | **nicht publiziert** (Anknüpfung an Steuerbetrag) | — |
| Einzelperson Einkommen 0 (einfache Steuer 0, kein Vermögen) | Fr. 3'408 (Kat. A) | [1] § 14 |

Ergänzend (Medienmitteilung Kanton): höchster IPV-Ansatz Erwachsene «um 0.4 Prozent angehoben» auf 52,1 % der kantonalen Durchschnittsprämie — Quelle [3] (nur Hinweis; Beträge laut [1]).

### Massgebendes Einkommen
> «Massgebend ist die einfache satzbestimmende Steuer zu 100 % per 1. Januar 2026 (provisorische Steuerdaten des Vorjahres).» — Quelle [2]

> «Die Bezugsberechtigten werden per 1. Januar aufgrund der Steuerdaten des Vorjahres ermittelt.» — Quelle [1], § 15 Abs. 1

«Nach dem 1. Januar 2026 angepasste Steuerdaten werden nicht berücksichtigt.» [2] Neubemessung nur auf Antrag innert 30 Tagen ab rechtskräftiger Feststellung veränderter Verhältnisse [1] § 15 Abs. 2. Kurzaufenthalter/Grenzgänger: «das gesamte Einkommen und Vermögen der antragstellenden Person und ihrer Familienmitglieder», kaufkraftbereinigt [1] § 16.

### Abweichung zur App
Der App-Wert (maxIncome/subsidySingle) wurde mir nicht übergeben. Belegt: Thurgau kennt keinen linearen Abbau, sondern drei Stufen (3'408 / 2'556 / 1'704) nach Steuerbetrag und schliesst jede Person mit steuerbarem Vermögen über Fr. 0 aus; eine Einkommensgrenze in Franken Einkommen existiert amtlich nicht.

### Offen / nicht gefunden
- Umrechnung Einkommen → einfache satzbestimmende Steuer (TG-Steuertarif) nicht erhoben; ohne diese oder eine direkte Abfrage des Steuerbetrags kann die App keinen TG-Betrag rechnen.
- § 14 Ziff. 4 KVV ist aufgehoben («…»); keine vierte Erwachsenen-Kategorie.
- Behandlung junger Erwachsener **nicht** in Ausbildung: im Merkblatt nicht ausdrücklich; gemäss § 14 vermutlich Kat. A–C wie Erwachsene (nicht belegt).
- Ob «Steuerbetrag von Fr. 400» den Kantons- oder einen anderen Steueranteil meint, ist nur als «einfache satzbestimmende Steuer zu 100 %» umschrieben (TG: Steuer vor Anwendung der Steuerfüsse).

### Quellen
1. Krankenversicherungsverordnung (TG KVV, RB 832.10), Kanton Thurgau, aktuelle Version in Kraft seit 01.01.2026 (Beschlussdatum laut Rechtsbuch 31.03.2026). https://www.rechtsbuch.tg.ch/api/de/versions/3027/pdf_file_with_annexes (kanonisch https://www.rechtsbuch.tg.ch/app/de/texts_of_law/832.10) — abgerufen 16.09.2026
2. Information zur Prämienverbilligung 2026, Kanton Thurgau, Amt für Gesundheit, PDF vom 16.12.2025. https://gesundheit.tg.ch/public/upload/assets/183453/Merkblatt%20IPV%202026.pdf — abgerufen 16.09.2026
3. «192.8 Millionen Franken für die individuelle Prämienverbilligung», Medienmitteilung Kanton Thurgau, 27.11.2025. https://www.tg.ch/news.html/485/news/76767 — abgerufen 16.09.2026 (nur Hinweis)
4. Prämienverbilligung, Amt für Gesundheit Kanton Thurgau (Übersichtsseite). https://gesundheit.tg.ch/bevoelkerung/krankenversicherung/praemienverbilligung.html/5578 — abgerufen 16.09.2026

---

## TI — Ticino

**Beurteilung:** abbildbar
**Modell (kurz):** Quadratische Formel: Normbetrag = PMR − PMR × RD²/RDM², × kantonaler Koeffizient 76,5 %; RDM = Konstante × 50 % der Laps-Bedarfsgrenze
**Zuständig / Weg:** Istituto delle assicurazioni sociali (IAS), Servizio sussidi assicurazione malattia · Antrag (Erneuerungs- oder Antragsformular, auch online); EL-/Laps-Beziehende von Amtes wegen · Anspruch ab Folgemonat der Einreichung, ab Januar 2026 nur bei Einreichung bis 31.12.2025
**Gültigkeit:** 2026 definitiv (Decreto esecutivo 19.11.2025, gültig 1.1.–31.12.2026; LCAMal Stand 1.1.2026)

### Rechenmodell
> «RD = [RL + qSOST] - [PMR + CS + ALIM + SPPROF + SPINT].» — LCAMal art. 31 cpv. 2, Quelle [1]

> «Per le unità di riferimento senza figli, il reddito disponibile massimo è definito come segue: RDM = costante del 3.8 x 50% del limite di fabbisogno, senza computo della pigione, ai sensi della Laps applicabile all’unità di riferimento.» — LCAMal art. 32a cpv. 2, Quelle [1]

> «Per le UR con figli, il reddito disponibile massimo è definito come segue: RDM = [costante del 4.7 + (1 - (n. figli) / 10)] x 50% del limite di fabbisogno, senza computo della pigione, ai sensi della Laps applicabile all’unità di riferimento.» — LCAMal art. 32a cpv. 3 (in Kraft seit 1.1.2025), Quelle [1]

> «L’importo normativo di riduzione dei premi è determinato come segue: [ PMR - ( PMR x RD2 ) / RDM2 ].» — LCAMal art. 35, Quelle [1] (im Original als Bruch gesetzt: PMR × RD² / RDM²)

> «L’importo effettivo di riduzione dei premi si ottiene moltiplicando l’importo normativo per il coefficiente cantonale di finanziamento.» / «Il coefficiente cantonale di finanziamento è pari al 76.5%.» — LCAMal art. 37 cpv. 1–2, Quelle [1]

> «L’importo massimo normativo di riduzione dei premi corrisponde alla somma dei premi medi di riferimento, per categoria di assicurato, dell’unità di riferimento.» — LCAMal art. 34, Quelle [1]

Aufteilung: Berechnung je Einheit (UR), dann Verteilung «proporzionalmente al premio di riferimento di ciascun membro»; Kinder/junge Erwachsene in Ausbildung vorab (mind. 80 % bzw. 50 % des PMR) — Quelle [3] Ziff. 1.4.

Besitzstand (Untergrenze) für Einheiten mit RD ≤ Laps-Bedarfsgrenze: PMR 2014 (fr. 4’965 / 4’594 / 1’156) × 73,5 % (RD ≤ 50 %) bzw. × 70 % (50–100 %) — LCAMal art. 43a, Quelle [1].

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Premio medio di riferimento (PMR) Erwachsene | «fr. 8'016 per gli adulti» | [2] art. 2 |
| PMR junge Erwachsene | «fr. 6'143 per i giovani adulti» | [2] art. 2 |
| PMR Minderjährige | «fr. 1'827 per i minorenni» | [2] art. 2 |
| Altersgrenzen der Kategorien | «adulto: dall’anno seguente al compimento dei 25 anni; giovane adulto: dall’anno seguente al compimento dei 18 anni; minorenne: fino alla fine dell’anno di compimento dei 18 anni» | [3] Ziff. 1.2 |
| Konstante ohne Kinder | 3.8 | [1] art. 32a cpv. 2 (Decreto 2026 [2] ändert sie nicht) |
| Konstante mit Kindern | 4.7 + (1 − Anzahl Kinder/10) | [1] art. 32a cpv. 3 |
| Kantonaler Finanzierungskoeffizient | 76.5 % | [1] art. 37 cpv. 2 |
| Laps-Schwelle («soglia d’intervento») 2025 und 2026: Titular | «18'709 franchi» | [4] art. 1 lett. a |
| … 1. zusätzliche Person | «9'215 franchi» | [4] art. 1 lett. b |
| … 2. zusätzliche Person | «6'869 franchi» | [4] art. 1 lett. c |
| … 3. zusätzliche Person | «5'253 franchi» | [4] art. 1 lett. d |
| … 4. und jede weitere Person | «5'233 franchi» | [4] art. 1 lett. e |
| Bestätigung: Laps-Bedarfsgrenze 2026 Einzelperson | «per il 2026 corrisponde a CHF 18'709 annui» | [3] Ziff. 1.1 |
| Vermögen | «1/15 della sostanza netta» wird zum Einkommen gezählt (keine separate Vermögensgrenze gefunden) | [1] art. 31, [3] |
| Pauschalabzug Berufsauslagen | max. CHF 4'000/Jahr pro UR | [1] art. 31, [3] |
| Abzug Schuldzinsen | max. CHF 3'000/Jahr pro UR | [1] art. 31, [3] |
| Mindestbetrag | «CHF 120 per ogni singolo membro dell'UR» | [3] Ziff. 1.4 |
| Steuerperiode | «classificazioni dell’imposta cantonale per l’anno 2023» | [2] art. 1 |

Abgeleitet (eigene Rechnung aus [1]+[4], nicht amtlich publiziert, nur zur Plausibilisierung):
- RDM Einzelperson ohne Kinder = 3.8 × 50 % × 18'709 = CHF 35'547.10 (verfügbares Einkommen RD, nicht Bruttoeinkommen).
- RDM Paar ohne Kinder = 3.8 × 50 % × (18'709 + 9'215) = CHF 53'055.60.
- Höchstbetrag Einzelperson Erwachsen bei RD = 0: 8'016 × 76.5 % = CHF 6'132.24/Jahr (begrenzt auf die effektive Prämie, art. 37 cpv. 3).

⚠️ Annahme: Dass «limite di fabbisogno … ai sensi della Laps» in art. 32a der «soglia d’intervento» nach Laps art. 10 / Decreto 870.130 entspricht, schliesse ich aus dem identischen Betrag 18'709 in [3]. Der Zusatz «senza computo della pigione» ist in [4] nicht ausdrücklich erwähnt. Vor Umsetzung mit dem IAS-Simulator (www.iasticino.ch) gegenprüfen.

### Massgebendes Einkommen
> «Per principio, il RD è determinato a partire dai dati accertati del calcolo dell’imponibile per l’imposta cantonale IC 2023 (notifica di tassazione).» — Quelle [3] Ziff. 1.2

> «somma di tutti i redditi dell’UR (al lordo delle eventuali spese di gestione e manutenzione immobili) [punto 8 (+ ev. punto 5.5)] + 1/15 della sostanza netta [punto 34] - premio medio di riferimento (PMR) dell'anno 2026 - contributi sociali obbligatori (AVS, AI, IPG, AD, AINP, LPP) - pensioni alimentari pagate (per figli ed ex-coniuge) - spese professionali per salariati (massimo 4'000 CHF/anno per UR) - spese per interessi passivi privati e aziendali (max. 3'000 CHF/anno per UR)» — Quelle [3] Ziff. 1.2 (Tabellenform, Zeilen zusammengezogen)

Neuberechnung ausserhalb der Steuerveranlagung u. a. bei Quellensteuer, Tod, Scheidung/Trennung, Aufgabe der Erwerbstätigkeit; auf Antrag bei Einkommens-/Vermögensänderung (Vermögen ± CHF 10'000) — Quelle [3] Ziff. 1.2 lett. a–l.

### Abweichung zur App
App: `maxIncome` 45'000, `subsidySingle` 2'400, linearer Abbau. Belegt ist ein quadratischer Abbau auf das *verfügbare* Einkommen (RDM Einzelperson abgeleitet CHF 35'547) mit einem Höchstbetrag von 76,5 % × 8'016 = CHF 6'132 für eine erwachsene Einzelperson. Der App-Betrag ist also rund 2,5-mal zu tief, und Grenze und Kurvenform stimmen nicht.

### Offen / nicht gefunden
- Ob der Zusatz «senza computo della pigione» die Laps-Schwelle 18'709 weiter verändert: im Decreto 870.130 nicht erwähnt (siehe Annahme oben). Gegenprobe mit dem IAS-Simulator steht aus.
- Regolamento RLCAMal (853.110) nicht im Wortlaut geprüft (Verteilung, Mindestbetrag). Die Angaben dazu stammen aus dem IAS-Merkblatt [3].
- Keine amtliche Tabelle mit ausgerechneten Einkommensgrenzen je Haushaltsgrösse gefunden. Das IAS verweist auf den Simulator.

### Quellen
1. Legge di applicazione della legge federale sull’assicurazione malattie (LCAMal), RL 853.100, Gran Consiglio del Cantone Ticino, Stand 1° gennaio 2026 (ultimo aggiornamento RL 04.09.2026). https://m3.ti.ch/CAN/RLeggi/public/index.php/index/nuovafinestra/atto/370/volume//numLegge/853.100 — abgerufen 16.09.2026
2. Decreto esecutivo concernente le basi di calcolo per l’applicazione delle riduzioni di premio LAMal per l’anno 2026, RL 853.310, Consiglio di Stato, 19.11.2025 (Stand 1.1.2026, BU 2025, 315). https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge-piatta/num/863 — abgerufen 16.09.2026
3. Istruzioni per la richiesta di riduzione di premio (sussidio) nell'assicurazione malattie (RIPAM) per l’anno 2026, IAS, Dicembre 2025 (inhaltsgleich: Informazioni periodiche RIPAM 2026, «Informazioni valide dal 1° gennaio 2026»). https://www4.ti.ch/fileadmin/DSS/IAS/pdf/approfondimenti/Istruzioni_per_la_richiesta_di_RIPAM_2026.pdf · https://www4.ti.ch/fileadmin/DSS/IAS/pdf/informazioni_periodiche/2026_Info_periodiche_RIPAM.pdf — abgerufen 16.09.2026
4. Decreto esecutivo sull’armonizzazione e il coordinamento delle prestazioni sociali, RL 870.130, Consiglio di Stato, 25.09.2024 (Stand 1.1.2025, «Per gli anni 2025 e 2026»). https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge-piatta/num/829 — abgerufen 16.09.2026
5. Scheda RIPAM, IAS (Frist «Entro il 31 dicembre dell'anno che precede quello di richiesta»). https://www4.ti.ch/dss/ias/prestazioni-e-contributi/scheda/p/s/dettaglio/riduzione-dei-premi-dellassicurazione-malattia-ripam-1/riduzione-dei-premi-dellassicurazione-malattia-ripam — abgerufen 16.09.2026

---

## VD — Vaud

**Beurteilung:** abbildbar
**Modell (kurz):** Zwei Stufen. (1) «Subside ordinaire»: Monatsbetrag nach Formel mit Parametern je Kategorie (Max. bis C, Kurve bis A, Minimum bis B, darüber 0). (2) «Subside spécifique»: Prämie (höchstens Referenzprämie) minus ordentlicher Subside, soweit über 10 % des RDU.
**Zuständig / Weg:** Office vaudois de l’assurance-maladie (OVAM); Antrag online (www.vd.ch/ovam) oder über die agence d’assurances sociales (AAS) der Wohnregion; jährliche Erneuerung durch das OVAM; Anspruch ab dem 1. Tag des 2. Monats nach Antrag (RI/PC-Beziehende ab Leistungsbeginn)
**Gültigkeit:** 2026 definitiv (Arrêté du Conseil d’État du 17.12.2025, in Kraft 1.1.2026; ersetzt Arrêté vom 1.10.2025)

### Rechenmodell
> «Le subside est progressif en fonction inverse du revenu déterminant au sens des articles 11 et 12.» / «Il est calculé à l'aide d'une formule mathématique dont les paramètres sont fixés par le Conseil d'Etat.» — LVLAMal art. 17, Quelle [3]

> «Si le revenu déterminant est égal ou inférieur à C1, le subside est maximum et vaut F1. […] Si le revenu déterminant est supérieur à C1 et inférieur ou égal à A1, le subside est déterminé par la formule 1 de l'alinéa 2. […] Si le revenu déterminant est supérieur à A1 et inférieur ou égal à B1, le subside est minimum et vaut E1. […] Si le revenu déterminant est supérieur à B1, aucun subside n'est accordé.» — RLVLAMal art. 21 al. 1 let. a (Erwachsene ab 26, allein), Quelle [4]

Formeln (RLVLAMal art. 21 al. 2, im amtlichen Text als Bild. Hier abgeschrieben, Quelle [4]):
- Formel 1 (26+ allein): Subside = E1 + ([F1 − E1] × {1 − ((RD − C1)/(A1 − C1))²}^P1)
- Formel 2 (26+ in Familie, RD ≤ C2): Subside = F2 + ([D2 − F2] × {(C2 − RD)/C2}^R2)
- Formel 3 (26+ in Familie, C2 < RD ≤ A2): Subside = E2 + ([F2 − E2] × {1 − ((RD − C2)/(A2 − C2))²}^P2)
- Formel 4 (Kinder, C3 < RD ≤ A3): Subside = E3 + ([F3 − E3] × {1 − ((RD − C3)/(A3 − C3))²}^P3)
- Formel 5 (Kinder, A3 < RD ≤ B3): Subside = G3 + ([E3 − G3] × {(B3 − RD)/(B3 − A3)}^Q3)
- Formeln 6–13 analog für die Kategorien 4–8 (junge Erwachsene allein / in Familie / in Ausbildung, Paare ohne Kinder)
- «le montant ainsi calculé est arrondi au franc supérieur» — art. 21 al. 1

> «Le subside spécifique correspond à la différence entre le total des primes définies selon l'art. 8 al. 1 et 2 pour le calcul du taux d'effort, diminuées du subside octroyé au titre des art. 11 à 13 LVLAMal, et 10% du RDU de l'UER au sens de l'art. 7 al. 1.» — Arrêté 2026 art. 9 al. 1, Quelle [1]

> «Les primes de l'assurance obligatoire des soins sont subsidiables jusqu'à concurrence de la prime facturée par l'assureur.» — LVLAMal art. 16 al. 1bis (Modif. 17 du 17.12.2025, in Kraft 01.03.2026), Quelle [3]

### Zahlen 2026
Subside ordinaire, Parameter in CHF pro **Monat**, Einkommensgrenzen in CHF pro Jahr (Revenu déterminant OVAM), Arrêté 2026 art. 2, Quelle [1]:

| Kategorie | Max. | Wert bei C | Min. | C | A | B (ab hier 0) | Exponent |
|---|---|---|---|---|---|---|---|
| a) 26+ allein | F1 = 331 | – | E1 = 30 | 17'000 | 40'000 | 50'000 | P1 = 2.5 |
| b) 26+ mit Kind(ern) | D2 = 336 | F2 = 300 | E2 = 20 | 24'200 | 55'000 | 69'000 | R2 = 1, P2 = 2.3 |
| c) Kinder 0–18 | F3 = 114 | E3 = 114 (bei A3) | G3 = 114 | 26'000 | 63'000 | 76'000 | P3 = 2.3, Q3 = 0.25 |
| d) 19–25 allein | F4 = 255 | – | E4 = 20 | 16'000 | 34'000 | 39'000 | P4 = 2.3 |
| e) 19–25 in Familie | D5 = 255 | F5 = 240 | E5 = 20 | 20'000 | 55'000 | 69'000 | R5 = 1, P5 = 2.3 |
| f) 19–25 in Ausbildung, allein, unabhängig | F6 = 255 | E6 = 186 (bei A6) | G6 = 20 | 16'000 | 40'000 | 45'000 | P6 = 2.3, Q6 = 0.8 |
| g) 19–25 in Ausbildung, in Familie/abhängig | F7 = 220 | E7 = 186 (bei A7) | G7 = 186 | 20'000 | 58'000 | 76'000 | P7 = 2.3, Q7 = 0.5 |
| h) 26+ Paar ohne Kind | D8 = 336 | F8 = 300 | E8 = 20 | 24'200 | 70'000 | 72'500 | R8 = 1, P8 = 3.0 |

Wortlaut-Stichproben: «E1. Le subside minimum est fixé à 30 fr.» · «F1. Le subside maximum est fixé à 331 fr.» · «B1. La limite supérieure de revenu déterminant, à partir de laquelle l'assuré ne bénéficie plus de subside, est fixée à 50'000 fr.» · «F3. Le subside maximum est fixé à 114 fr.» · «B3. […] est fixée à 76'000 fr.» — Quelle [1]

Weitere Werte:

| Grösse | Wert | Quelle |
|---|---|---|
| Abzug pro Kind vom Einkommen | «6'000 fr. pour le premier enfant et 7'000 fr. de plus par enfant supplémentaire» | [1] art. 4 |
| Schwelle subside spécifique (taux d'effort) | «supérieur à 10%» des RDU | [1] art. 7 |
| Referenzprämie/Monat, 1 Person, RDU ≤ 62'500 | Erwachsene R1 563 / R2 527 · Junge R1 390 / R2 366 | [1] art. 13 al. 1 |
| … RDU 62'501–70'000 | Erw. 538 / 502 · Junge 366 / 342 | [1] art. 13 al. 1 |
| … RDU > 70'000 | Erw. 488 / 452 · Junge 318 / 293 | [1] art. 13 al. 1 |
| Referenzprämie/Monat, mehrere Personen, RDU ≤ 86'300 | Erw. 563/527 · Junge 390/366 · Kinder 161/152 | [1] art. 13 al. 2 |
| … RDU 86'301–96'600 | Erw. 538/502 · Junge 366/342 · Kinder 161/152 | [1] art. 13 al. 2 |
| … RDU > 96'600 | Erw. 488/452 · Junge 318/293 · Kinder 161/152 | [1] art. 13 al. 2 |
| Mindestbetrag subside spécifique | «20 fr. par mois» (Ausnahmen art. 10 al. 4) | [1] art. 10 al. 3 |
| Höchstprämie Sonderkategorien (RI u. a., art. 18a LVLAMal) | Erw. R1 557 / R2 526 · Junge 373 / 337 · Kinder 157 / 147 | [1] art. 3 |
| PC-AVS/AI-Beziehende (Notice) | Erw. R1 699 / R2 656 · Junge 510 / 481 · Kinder 170 / 161 | [2] Ziff. 2 |
| Prämienregionen | «Région 1 : Lausanne, l’Ouest lausannois, Nyon, La Côte, Lavaux, la Riviera» · Région 2: übrige (Chablais, Pays d’Enhaut, Oron, Cossonay, Broye, Vully, Gros-de-Vaud, Jura, Nord vaudois) | [2] |
| Vermögensfreibetrag | 59'000 fr. (allein / Einelternfamilie) bzw. 118'000 fr. (Paar); Zuschlag 1/15 (= 6,7 %) auf den Überschuss | [2] Ziff. 1 |
| Pauschalabzug KK-Prämien (LHPS) | 2'200 fr. (1 Erwachsener) · 4'400 fr. (2 Erwachsene) · +1'300 fr. je Kind | [2] Ziff. 1 |
| Steuerperiode | letzte definitive Veranlagung, «entrée en force au 17 octobre 2025» | [1] art. 6 al. 3 |

Notice-Beispiel zur Plausibilisierung: Familie mit 4 Personen, Region 1, RDU 76'000: ordentlicher Subside 3'216/Jahr, spezifischer Subside «(16’836 – 3’216) – (76’000 x 10 %) = 6’020» — Quelle [2] Ziff. 3.
Gegenprobe (eigene Rechnung): Revenu OVAM = 76'000 − 13'000 (2 Kinder) = 63'000 → Erwachsene zwischen A2 und B2 = Minimum 20/Monat. Kinder 114/Monat. 2 × 20 × 12 + 2 × 114 × 12 = 3'216 ✓. Die Parameter aus [1] erklären das amtliche Beispiel.

### Massgebendes Einkommen
> «La loi sur l'harmonisation et la coordination de l'octroi des prestations sociales et d'aide à la formation et au logement cantonales vaudoises est applicable en ce qui concerne le calcul du revenu déterminant, la composition de l'unité économique de référence et la hiérarchisation des prestations sociales.» — LVLAMal art. 11 al. 1, Quelle [3]

Aufbau laut Notice (Quelle [2] Ziff. 1): «① du revenu net, au sens de la décision de taxation (DT) définitive la plus récente entrée en force au moment du traitement de votre demande de subside» + Einkäufe 2. Säule (nach Freibetrag 20'000 fr.) + Einzahlungen Säule 3a + Liegenschaftsunterhalt über dem Pauschalabzug + steuerlich abgezogene KK-Prämien − KK-Pauschale (2'200 / 4'400 / +1'300 je Kind) + «majoration de 1/15 (= 6.7 %) de la fortune qui excède 59’000 fr. pour une personne seule ou une famille monoparentale, 118’000 fr. pour un couple» = **A: Revenu déterminant unifié (RDU)**; − Abzug für Kinder (6'000 / 13'000 / +7'000) = **B: Revenu déterminant OVAM** (massgebend für den subside ordinaire). Der subside spécifique rechnet mit dem RDU (A).

Liegenschaften: Freibetrag 300'000 fr. auf selbst bewohntem Wohneigentum, Schulden werden nicht abgezogen; Geschäftsvermögen: Freibetrag 100'000 fr. — Quelle [2].

### Abweichung zur App
App: `maxIncome` 54'000, `subsidySingle` 3'000/Jahr, linearer Abbau. Belegt für eine alleinstehende erwachsene Person: Anspruch endet über 50'000 (Revenu déterminant OVAM, kein Brutto). Der Höchstbetrag ist 331 × 12 = CHF 3'972/Jahr. Dazu kommt allenfalls der subside spécifique (10-%-Regel). Die Kurve ist nicht linear (Plateau bis 17'000, Exponent 2.5, Mindestbetrag 30/Monat bis 50'000).

### Offen / nicht gefunden
- Formeln 6–13 nur aus dem Formelbild gelesen, nicht maschinenlesbar. Für die Umsetzung Formel für Formel mit dem Bild vergleichen (lokale Kopie `VD_formule_0.png`).
- Offizielle Seite `prestations.vd.ch/pub/blv-publication/actes/consolide/832.01.1` (direkter Link von vd.ch) liefert beim Laden **HTTP 500** (API `api/actes/CONSOLIDE?cote=832.01.1`). Der Text wurde über die Suche derselben BLV-Anwendung abgerufen (aktuelle Version, «en l'état de cette version au 01.11.2025»).
- Link `prestations.vd.ch/fileadmin/…/Notice_explicative_2026.pdf` → HTTP 403. Dieselbe Datei unter `www.vd.ch/fileadmin/…` → 200.
- Die ältere Notice (Oktober 2025, «Si les mesures annoncées par le Conseil d’Etat sont adoptées») nennt für Kinder noch 74 fr. und eine Referenzprämie von 121/112. **Überholt**, massgebend sind Arrêté 17.12.2025 und Notice vom 19.12.2025 (114 fr. bzw. 161/152).
- Widerspruch zu klären: LVLAMal art. 16 al. 1bis (Prämie bis zur fakturierten Prämie) ist laut BLV erst ab **01.03.2026** in Kraft. Die Notice nennt dafür «dès le 1er janvier 2026».
- Beträge für RI-Beziehende (art. 3 Arrêté: 557/526 usw.) und PC-Beziehende (699/656 usw.) sind Sonderregeln, nicht Teil des Einkommensmodells.

### Quellen
1. Arrêté concernant les subsides aux primes de l'assurance-maladie obligatoire en 2026, du 17 décembre 2025, Conseil d'État du canton de Vaud (Dokument generiert 18.12.2025, in Kraft 1.1.2026). https://www.vd.ch/fileadmin/user_upload/themes/social/Prestations__assurance_et_soutien/Assurance_maladie/Subside/Arr%C3%AAt%C3%A9_subsides_2026_du_17-12-2025_-_publi%C3%A9.pdf — abgerufen 16.09.2026
2. Notice explicative : Les subsides 2026, OVAM, «Selon l’arrêté du Conseil d’Etat du 17.12.2025», PDF vom 19.12.2025. https://www.vd.ch/fileadmin/user_upload/themes/social/Prestations__assurance_et_soutien/Assurance_maladie/Subside/Notice_explicative_2026.pdf — abgerufen 16.09.2026 (ältere Fassung vom 13.10.2025: …/De%C3%8C_pliant_Notice_Subsides_26_-_3_WEB.pdf, überholt)
3. Loi d'application vaudoise de la loi fédérale sur l'assurance-maladie (LVLAMal), BLV 832.01, Version en vigueur dès le 01.03.2026, Base législative vaudoise. https://prestations.vd.ch/pub/blv-publication/api/actes/49b14f20-1d20-4c2b-9cd1-af2c83c6fc7a/html — abgerufen 16.09.2026
4. Règlement concernant la LVLAMal (RLVLAMal), BLV 832.01.1, Version en vigueur dès le 01.11.2025, Base législative vaudoise. https://prestations.vd.ch/pub/blv-publication/api/actes/81172851-0af6-4cb2-8896-59408b0037ea/html — abgerufen 16.09.2026
5. Subside à l'assurance-maladie, État de Vaud (Antragsweg, Anspruchsbeginn). https://www.vd.ch/sante-soins-et-handicap/assurance-maladie/subside-a-lassurance-maladie — abgerufen 16.09.2026

---

## VS — Wallis / Valais

**Beurteilung:** abbildbar
**Modell (kurz):** Degressive Einkommensskala mit 7 Klassen: 70/50/40/30/20/10/5 % der regionalen Referenzprämie (Kinder 80 %), Grenzen je Haushaltstyp (allein/Ehepaar) und Kinderzahl. EL/Sozialhilfe 100 %.
**Zuständig / Weg:** Ausgleichskasse des Kantons Wallis; **automatisch** aufgrund der Steuerveranlagung 2024 (Mitteilung Ende Februar 2026). Quellenbesteuerte (Ausweis B, F, L, N) und neue C-Bewilligungen stellen ein Gesuch bis spätestens 31.12.2026. Ohne Entscheid: begründetes Gesuch, rückwirkend 2 Jahre.
**Gültigkeit:** 2026. Die Tabelle heisst im Dateititel «Echelle définitive RIP 2026» (19.12.2025). Der Medienanhang vom 3.2.2026 bezeichnet die Sätze als «(Provisorisch)» und weicht in einer Zelle ab (siehe Offen).

### Rechenmodell
> «Die Prozentsätze der individuellen Prämienverbilligung werden auf Grundlage der Referenzprämie gemäss einer vom Staatsrat festgelegten degressiven Einkommensskala berechnet.» — VüIPV Art. 6 Abs. 1, Quelle [1]

> «Die Prämienverbilligung für Kinder und junge Erwachsene bis zum Alter von 20 Jahren aus Familien mit unterem und mittlerem Einkommen darf nicht weniger als 80 Prozent der durchschnittlichen Referenzprämie betragen.» — VüIPV Art. 6 Abs. 2, Quelle [1]

> «Die Referenzprämien für die Berechnung der Prämienverbilligung für die anderen Bezüger sind diejenigen, die vom Bund jährlich für die Berechnung der Ergänzungsleistungen bestimmt werden und die durch einen Koeffizient von 0.95 multipliziert und auf einen Franken gerundet werden.» — VüIPV Art. 5 Abs. 2, Quelle [1]

> «Die kantonale Unterstützung beträgt gemäss einer aufgrund des Einkommens erstellten Tabelle zwischen 5% und 70% (80% für Kinder) der durchschnittlichen regionalen Referenzprämien.» — Quelle [2]

> «Die individuelle Prämienverbilligung darf die tatsächliche obligatorische Krankenversicherungsprämie nicht überschreiten.» — VüIPV Art. 6 Abs. 6, Quelle [1]

Junge Erwachsene 21–25 in Ausbildung mit weniger als 50 %: Gesuch um Zusatz «bis zu 50 Prozent der durchschnittlichen Referenzprämie» — VüIPV Art. 6 Abs. 3, Quelle [1].

Lesart der Tabelle (eigene Auslegung, im Text nicht wörtlich erklärt): Massgebendes Einkommen ≤ Grenze der Zeile → Satz dieser Zeile. Es gilt die erste (höchste) Zeile, deren Grenze nicht überschritten ist. Über der 5-%-Grenze gibt es keine IPV.

### Zahlen 2026
Monatliche Referenzprämien (CHF) — Quelle [3] (identisch in [4]):

| Kategorie | Ordentlich Reg. I | Ordentlich Reg. II | EL/Sozialhilfe Reg. I | EL/Sozialhilfe Reg. II |
|---|---|---|---|---|
| Erwachsene | 561 | 481 | 591 | 506 |
| Junge Erwachsene | 401 | 359 | 422 | 378 |
| Kinder | 133 | 110 | 140 | 116 |

Regionen: «Region 1: Die meisten Gemeinden des Mittel- und Unterwallis.» · «Region 2: Gemeinden des Oberwallis, Anniviers, Evolène, Hérémence, Mont-Noble, Saint-Martin und Vex.» — Quelle [4]

Einkommensgrenzen (massgebendes Einkommen, CHF/Jahr) — «Einkommenstabelle zur Berechnung der Krankenkassensubventionen 2026», Quelle [3]:

**Alleinstehende Personen**

| Satz | ohne Kind | 1 Kind | 2 Kinder | 3 Kinder | 4 Kinder | 5 Kinder | 6 Kinder |
|---|---|---|---|---|---|---|---|
| 100 % | Sozialhilfe- und EL-Beziehende (AHV/IV) | | | | | | |
| 70 % | 21'000 | 38'250 | 48'250 | 56'250 | 62'250 | 68'250 | 74'250 |
| 50 % | 23'917 | 41'896 | 51'896 | 59'896 | 65'896 | 71'896 | 77'896 |
| 40 % | 26'833 | 45'542 | 55'542 | 63'542 | 69'542 | 75'542 | 81'542 |
| 30 % | 29'750 | 49'188 | 59'188 | 67'188 | 73'188 | 79'188 | 85'188 |
| 20 % | 32'667 | 52'833 | 62'833 | 70'833 | 76'833 | 82'833 | 88'833 |
| 10 % | 35'583 | 56'479 | 66'479 | 74'479 | 80'479 | 86'479 | 92'479 |
| 5 % | 38'500 | 60'125 | 70'125 | 78'125 | 84'125 | 90'125 | 96'125 |
| Kinder 80 % | – | 63'000 | 70'125 | 78'125 | 84'125 | 90'125 | 96'125 |

**Ehepaar**

| Satz | ohne Kind | 1 Kind | 2 Kinder | 3 Kinder | 4 Kinder | 5 Kinder | 6 Kinder |
|---|---|---|---|---|---|---|---|
| 70 % | 36'750 | 48'750 | 58'750 | 66'750 | 72'750 | 78'750 | 84'750 |
| 50 % | 41'854 | 53'854 | 63'854 | 71'854 | 77'854 | 83'854 | 89'854 |
| 40 % | 46'958 | 58'958 | 68'958 | 76'958 | 82'958 | 88'958 | 94'958 |
| 30 % | 52'063 | 64'063 | 74'063 | 82'063 | 88'063 | 94'063 | 100'063 |
| 20 % | 57'167 | 69'167 | 79'167 | 87'167 | 93'167 | 99'167 | 105'167 |
| 10 % | 62'271 | 74'271 | 84'271 | 92'271 | 98'271 | 104'271 | 110'271 |
| 5 % | 67'375 | 79'375 | 89'375 | 97'375 | 103'375 | 109'375 | 115'375 |
| Kinder 80 % | – | 116'000 | 116'000 | 116'000 | 116'000 | 116'000 | 116'000 |

(Tabelle [3] reicht bis 9 Kinder. Ab dem 7. Kind: Kinderzeile Ehepaar = 5-%-Grenze, 121'375 / 127'375 / 133'375.)

| Weitere Grösse | Wert | Quelle |
|---|---|---|
| Kinder-Zuschläge («Limite») | 1. Kind 12'000 · 2. Kind 10'000 · 3. Kind 8'000 · 4. Kind usw. 6'000 | [3] |
| Hinweis Medienanhang | «Ab dem 4. Kind steigen die Einkommensgrenzen um je 6’000 Franken an.» | [4] |
| Vermögensgrenze | «Versicherte oder Familien, deren neu eingeschätztes Bruttovermögen von CHF 1 Million übersteigt, haben kein Anrecht auf Subventionen (vom Staatsrat festgelegter Betrag).» | [2] |
| Vermögensanteil im Einkommen | «5 Prozent des eingeschätzten Nettovermögens» | [1] Art. 8 |
| EL/Sozialhilfe | «eine Prämienverbilligung gewährt, die 100 Prozent der Referenzprämie entspricht» | [1] Art. 6 Abs. 5 |
| Steuerperiode | «Das Anrecht auf Subventionen 2026 wird aufgrund der Steuerveranlagung 2024 bestimmt.» | [2] |
| Altersgrenze Familie | Kinder bis 20 im Haushalt der Eltern. Wer am 31.12. des Vorjahres 20 ist, wird einzeln berechnet. | [1] Art. 3 Abs. 3, Art. 9; [2] |

Abgeleitet (eigene Rechnung, nicht amtlich publiziert): alleinstehende erwachsene Person, 70 %, Region I = 561 × 70 % × 12 = CHF 4'712.40/Jahr, Region II = 481 × 70 % × 12 = CHF 4'040.40/Jahr. Kind 80 %, Region I = 133 × 80 % × 12 = CHF 1'276.80/Jahr.

### Massgebendes Einkommen
> «Das massgebende Einkommen für eine Gewährung der finanziellen Unterstützung entspricht dem Nettoeinkommen vor den persönlichen Abzügen (Ziffer 2400) der Steuerrechnung. Dabei wird die Steuerperiode berücksichtigt, die 2 Jahre vor dem Jahr liegt, für welches eine individuelle Prämienverbilligung angestrebt wird (Jahr x - 2 Jahre).» — VüIPV Art. 8 Abs. 1, Quelle [1]

> «5 Prozent des eingeschätzten Nettovermögens sowie die Beiträge für die verschiedenen, anerkannten individuellen Altersvorsorgen (3. Säule) bis zum Maximalbetrag des Angestelltenlohns, den im Ausland erworbenen Einkommens- und Vermögenselementen, der negativen Einkommen aus Liegenschaften sowie der nicht verrechneten Verluste einer selbstständigen Erwerbstätigkeit dazugerechnet;» / «die aufgrund des Familienrechts oder einer Vereinbarung bezahlten Unterhaltsbeiträge sowie die erhaltenen Kapitalleistungen abgezogen.» — VüIPV Art. 8 Abs. 1 lit. a–b, Quelle [1]

> «Für quellenbesteuerte Personen entspricht das Einkommen 80 Prozent des im Vorjahr oder im laufenden Jahr der Steuer unterliegenden Bruttoeinkommens zuzüglich der Vermögenselemente.» — VüIPV Art. 8 Abs. 5, Quelle [1]

Einkommen von Kindern bis 20 im selben Wohnsitz zählt nicht mit (Art. 8 Abs. 1ter). Einkommen aus Ermessenseinschätzung gibt keinen Anspruch (Art. 8 Abs. 4) — Quelle [1].

### Abweichung zur App
App: `maxIncome` 45'000, `subsidySingle` 2'400, linearer Abbau. Belegt für eine alleinstehende Person ohne Kind: Anspruch endet über 38'500 (massgebendes Einkommen). Der Höchstbetrag ist 70 % der Referenzprämie, abgeleitet CHF 4'712 (Region I) bzw. 4'040 (Region II) pro Jahr. Der Abbau erfolgt stufenweise in 7 Klassen, nicht linear.

### Offen / nicht gefunden
- **Widerspruch in amtlichen Unterlagen:** Kinderzeile «Alleinstehende mit 1 Kind» = **63'000** in der Einkommenstabelle [3] (Dateititel «Echelle définitive RIP 2026», 19.12.2025), aber **61'000** im Medienanhang [4] (3.2.2026, Spalte «Subventionsansatz (Provisorisch)»). Alle anderen geprüften Zellen stimmen überein. Vor Umsetzung bei der Ausgleichskasse klären. Bis dahin gilt [3], weil die Ausgleichskasse diese Datei als «Vollständige Einkommenstabelle 2026» verlinkt.
- Der Staatsratsbeschluss selbst (Art. 7 VüIPV) wurde nicht im Wortlaut gefunden. Die Zahlen stammen aus den Unterlagen der Ausgleichskasse und des Kantons. Eine Amtsblatt-Veröffentlichung 2026 (Art. 23) wurde nicht gefunden, nur die von 2025 (nicht geöffnet).
- Wie der Satz für junge Erwachsene (Referenzprämie «Junge Erw.») bestimmt wird: Die Tabelle hat nur die Zeilen «Erwachsene» und «Kinder». Vermutlich gilt für junge Erwachsene ab 20 die Erwachsenenzeile mit der Referenzprämie «Junge Erw.». Das ist nicht wörtlich belegt.
- Die Lesart «erste nicht überschrittene Grenze = Satz» ist aus dem Tabellenaufbau abgeleitet, nicht wörtlich belegt.
- Der Link in der Suche (`vs.ch/documents/…/PP+Anhang+an+die+Medienmitteilung+IPV+2024.pdf`) liefert trotz «2024» im Dateinamen den Anhang **2026** (PDF-Titel «2026 02 03 - PP Anhang an die Medienmitteilung IPV 2026»).

### Quellen
1. Verordnung über die obligatorische Krankenversicherung und die individuellen Prämienverbilligungen (VüIPV), SGS 832.105, Staatsrat des Kantons Wallis, vom 16.11.2011 (Stand 01.05.2026, letzte Änderung 20.05.2026, RO/AGS 2026-066). https://lex.vs.ch/app/de/texts_of_law/832.105 — abgerufen 16.09.2026
2. Prämienverbilligung (IPV), Ausgleichskasse des Kantons Wallis, ohne Datumsangabe (Inhalt für 2026). https://www.ahvwallis.ch/de/Versicherungen/IPV-Pramienverbilligungen-in-der-Krankenversicherung/Pramienverbilligung/Praemienverbilligung.html — abgerufen 16.09.2026
3. Einkommenstabelle zur Berechnung der Krankenkassensubventionen 2026 (PDF-Titel «Echelle définitive RIP 2026 - F+D»), Ausgleichskasse des Kantons Wallis, erstellt 19.12.2025. https://www.ahvwallis.ch/Htdocs/Files/v/998819276e6a3d4d72971862e9c685628b0b29b732860905db939232a7de9cda.pdf/Vollstaendige-Einkommenstabelle-2026.pdf — abgerufen 16.09.2026
4. Individuelle Prämienverbilligung (IPV) 2026 im Wallis — Anhang zur Medienmitteilung vom 3. Februar 2026, Kanton Wallis (PDF erstellt 23.03.2026). https://www.vs.ch/documents/8841577/8881906/PP+Anhang+an+die+Medienmitteilung+IPV+2024.pdf/c29a188b-8096-d1e8-743d-657ac8ed9807?t=1703232568501&v=1.3 — abgerufen 16.09.2026. Referenzprämien-Folie auch als https://www.ahvwallis.ch/Htdocs/Files/v/8d3d15d310e5aa9490b3d8e4c130fa9b39cd184fce902d836a6c849d0a17fca8.pdf/2026-02-03---Individuelle-Praemienverbilligung.pdf

---

## NE — Neuchâtel

**Beurteilung:** abbildbar (mit Vorbehalt: Webseite und Erlass nennen ab S3 unterschiedliche Monatsbeträge, siehe «Offen»)
**Modell (kurz):** 15 Klassen (S1–S15) nach revenu déterminant und Haushaltstyp/Kinderzahl; fester Monats-Höchstbetrag je Klasse und Alterskategorie (% einer Referenzprämie)
**Zuständig / Weg:** OCAB (Office cantonal de l'assurance-maladie et des bourses d'études) aufgrund der Steuerveranlagung 2025; Bisherige automatisch, Neuberechtigte erhalten nach Veranlagung einen Coupon-réponse (Rücksendung innert 30 Tagen, sonst Verlust des Anspruchs); 19–25-Jährige ledig, Quellenbesteuerte, amtlich Veranlagte, Neuzuzüger: Antrag beim Guichet social régional (GSR)
**Gültigkeit:** 2026 definitiv (Arrêté vom 12.11.2025, in Kraft 1.1.2026)

### Rechenmodell
> «les bénéficiaires de subsides sont répartis en fonction de leur revenu déterminant dans l'une des classifications prévues dans l'annexe.» / «La classification détermine le montant maximum des subsides» — Art. 2 Arrêté 821.102 [1]

> «Les montants maximums des subsides, par classification, pour la franchise annuelle […] sont les suivants : Subsides mensuels LAMal 2026» — Art. 11 al. 1 [1]

> «Les montants prévus à l'alinéa 1 sont diminués dans la même mesure que les réductions accordées par les assureurs en cas de formes particulières d'assurances» — Art. 11 al. 2 [1]

> «Les limites de revenu déterminant varient en fonction du nombre d'enfants mineurs à charge conformément à l'annexe.» — Art. 3 al. 2 [1]

Hinweis: Kinder (S1–S15) und junge Erwachsene/Erwachsene in Ausbildung erhalten in S1–S11 bzw. S1–S15 100 % der Referenzprämie resp. abgestufte Prozente; übrige Erwachsene/junge Erwachsene 95 % (S1) bis 4 % (S15). Für Alleinstehende ohne Kind endet die Skala bei S10.

### Zahlen 2026
Monatsbeträge CHF gemäss Arrêté Art. 11 (verbindlich) [1]; identisch im PDF «Subsides mensuels assurance-maladie 2026» vom 28.11.2025 [3]:

| Klasse | Kinder 0–18 | Junge Erw. in Ausbildung 19–25 | Junge Erw. 19–25 | Erw. in Ausbildung ab 26 | Erwachsene ab 26 | Quelle |
|---|---|---|---|---|---|---|
| PC-AVS/AI (PMC) | 157 | 502 | 502 | 687 | 687 | [1] |
| Aide sociale (PARC) | 133 | 420 | 420 | 590 | 590 | [1] |
| Referenzprämie (ordentl. Klassen) | 160 | 484 | 484 | 643 | 643 | [1] |
| S1 | 160 | 484 | 460 (95%) | 643 | 611 (95%) | [1] |
| S2 | 160 | 484 | 436 (90%) | 643 | 579 (90%) | [1] |
| S3 | 160 | 484 | 387 (80%) | 643 | 514 (80%) | [1] |
| S4 | 160 | 484 | 339 (70%) | 643 | 450 (70%) | [1] |
| S5 | 160 | 484 | 290 (60%) | 643 | 386 (60%) | [1] |
| S6 | 160 | 484 | 242 (50%) | 643 | 322 (50%) | [1] |
| S7 | 160 | 484 | 198 (41%) | 643 | 264 (41%) | [1] |
| S8 | 160 | 484 | 155 (32%) | 643 | 206 (32%) | [1] |
| S9 | 160 | 484 | 116 (24%) | 643 | 154 (24%) | [1] |
| S10 | 160 | 484 | 73 (15%) | 643 | 96 (15%) | [1] |
| S11 | 160 | 484 | 58 (12%) | 643 | 77 (12%) | [1] |
| S12 | 160 | 387 (80%) | 48 (10%) | 514 (80%) | 64 (10%) | [1] |
| S13 | 160 | 290 (60%) | 39 (8%) | 386 (60%) | 51 (8%) | [1] |
| S14 | 160 | 198 (41%) | 29 (6%) | 264 (41%) | 39 (6%) | [1] |
| S15 | 160 | 116 (24%) | 19 (4%) | 154 (24%) | 26 (4%) | [1] |

Einkommensgrenzen (revenu déterminant, CHF/Jahr, Obergrenze der Klasse) — Annexe [1], deckungsgleich mit [2]:

| Haushalt | S1 bis | S10 bis | S15 bis (= höchste Grenze) | Quelle |
|---|---|---|---|---|
| Erwachsene/r allein, kein Kind | 22'800 | 50'600 | – (Skala endet bei S10) | [1] |
| Erwachsene/r allein, 1 Kind | 33'000 | 44'400 | 65'089 | [1] |
| Erwachsene/r allein, 2 Kinder | 40'800 | 52'200 | 72'824 | [1] |
| Erwachsene/r allein, 3 Kinder | 46'800 | 58'200 | 80'560 | [1] |
| Paar Erwachsene, kein Kind | 30'000 | 67'551 | – (endet bei S10) | [1] |
| Paar Erwachsene, 1 Kind | 37'500 | 60'300 | 100'939 | [1] |
| Paar Erwachsene, 2 Kinder | 44'400 | 67'200 | 104'317 | [1] |
| Paar Erwachsene, 3 Kinder | 50'400 | 73'200 | 104'755 | [1] |
| Junge/r Erwachsene/r allein, kein Kind | 22'800 | 34'348 | – (endet bei S10) | [1] |
| Paar junge Erwachsene, kein Kind | 30'000 | 52'955 | – (endet bei S10) | [1] |
| Paar Erwachsene/r + junge/r Erw., kein Kind | 30'000 | 63'602 | – (endet bei S10) | [1] |

Klassenbreite Erwachsene/r allein ohne Kind S1–S9: je 1'140 (z. B. «22'800 à 23'940»); Paar ohne Kind: je 2'280. Die Annexe enthält vollständige Tabellen für 0–10 Kinder und alle fünf Haushaltstypen [1].

| Weitere Grösse | Wert | Quelle |
|---|---|---|
| Vermögensanrechnung | 30 % der fortune effective nach Abzug 4'000 (allein) / 8'000 (Paar) / 2'000 je minderjähriges Kind, Abzug max. 10'000 je UER | [1] Art. 12 |
| Vermutete Nichtberechtigung | revenu effectif < 15'000 (allein) / < 20'000 (Paar), +3'000 je Kind; ebenso Ledige < 25 J. ohne Kind (Revision auf Gesuch möglich) | [1] Art. 16 |
| Budget 2026 | 160,9 Mio. CHF | [4] |

### Massgebendes Einkommen
> «Le revenu déterminant se fonde sur les données disponibles résultant de la taxation fiscale 2025 et se compose : a) du revenu effectif tel qu'il ressort du chiffre 5.5 (colonne revenu) de la déclaration fiscale, à l'exclusion de la valeur locative privée (chiffre 4.1), et sous seules déductions des cotisations AVS/AI/APG/AC versées par des personnes assurées sans activité lucrative (chiffre 6.7), des dépenses professionnelles liées au revenu d'une activité dépendante principale (chiffre 6.4), des frais pour activité dépendante accessoire (chiffre 6.5) et des pensions alimentaires […] (chiffre 6.10). […] b) du trente pourcent de la fortune effective selon le chiffre 6.16 (colonne fortune) après déduction de 4'000 francs pour une personne seule, 8'000 francs pour un couple et 2'000 francs par enfant mineur à charge, mais, par UER, au maximum 10'000 francs.» — Art. 12 al. 1 [1]

Zusätzlich: Abzüge 6.4 max. 10'000, 6.5 max. 2'400 (Art. 12 al. 5); Geschäftsverluste nicht abziehbar (al. 4); Renten voll angerechnet (al. 2) [1].

### Abweichung zur App
App-Wert (maxIncome/subsidySingle) wurde mit dem Auftrag nicht mitgegeben. Belegte Vergleichswerte: Erwachsene/r allein ohne Kind max. revenu déterminant 50'600, Höchstbetrag S1 611 CHF/Monat (= 7'332 CHF/Jahr), in 15 Stufen und nicht linear abnehmend — ein linearer Abbau bildet NE nicht ab.

### Offen / nicht gefunden
- **Widerspruch Webseite ↔ Erlass:** Die Seite «Classifications et montants» [2] (Drupal-Metadatum «Modified: 08/09/2026») nennt für Junge Erwachsene / Erwachsene ab S3 andere Beträge als der Erlass und das PDF vom 28.11.2025, z. B. Erwachsene S3 **515** (Erlass 514), S4 453 (450), S10 110 (96), S15 **41** (26); Junge Erw. S15 30 (19); Junge Erw. in Ausbildung S15 124 (116); Erw. in Ausbildung S12 515 (514), S15 166 (154). S1, S2 und Referenzprämien stimmen überein. Kein Änderungsbeschluss gefunden (CE-Kurzinformation 6.7.2026 [5] erwähnt nur Nachtragskredite und «prorogation des mesures transitoires» ohne Zahlen). Die Seite sagt selbst, sie basiere auf dem Arrêté. → Verbindlich ist bis auf Weiteres RSN 821.102; beim OCAB nachfragen, ob eine Änderung (z. B. Erhöhung per Mitte 2026) beschlossen ist.
- Merkblatt «Subsides à l'assurance-maladie, informations détaillées (20251202)» nicht geöffnet.
- Die Klassen gelten als Höchstbetrag; der Subside ist auf die effektive Prämie begrenzt (Art. 11 al. 2 für besondere Versicherungsformen) — genaue Kappungsregel (RALILAMal) nicht separat geprüft.

### Quellen
1. Arrêté fixant les normes de classification et le montant des subsides en matière d'assurance-maladie obligatoire des soins pour l'année 2026 (RSN 821.102), Conseil d'État NE, vom 12.11.2025, État au 1er janvier 2026, FO 2025 No 47. https://rsn.ne.ch/DATA/program/books/rsne/pdf/821.102.pdf — abgerufen 16.09.2026
2. Subsides assurance-maladie (LAMal) 2026 : Classifications et montants selon le revenu déterminant, État de Neuchâtel, publiziert 14.07.2025, geändert 08.09.2026. https://www.ne.ch/themes/social/assurance-maladie/subsides-assurance-maladie-lamal-classifications-et-montants-selon-le-revenu-determinant — abgerufen 16.09.2026
3. Subsides mensuels assurance-maladie 2026 (PDF), État de Neuchâtel, Stand 28.11.2025. https://www.ne.ch/medias/Documents/25/12/20251128_montants%20mensuels_subsides%20LAMal%202026.pdf — abgerufen 16.09.2026
4. Communiqué «Subsides à l'assurance-maladie 2026 : maintien des mesures et introduction d'un nouveau modèle d'octroi», État de Neuchâtel, 28.11.2025. https://www.ne.ch/communiques-de-presse/subsides-lassurance-maladie-2026-maintien-des-mesures-et-introduction-dun-nouveau-modele-doctroi — abgerufen 16.09.2026
5. Informations brèves de la séance du Conseil d'État du 6 juillet 2026, État de Neuchâtel. https://www.ne.ch/communiques-de-presse/informations-breves-de-la-seance-du-conseil-detat-du-6-juillet-2026 — abgerufen 16.09.2026
6. Subsides assurance-maladie (LAMal) — Verfahren/Coupon-réponse/FAQ, État de Neuchâtel. https://www.ne.ch/themes/social/assurance-maladie/subsides-assurance-maladie-lamal — abgerufen 16.09.2026

---

## GE — Genève

**Beurteilung:** abbildbar
**Modell (kurz):** 8 Gruppen (+ Gruppe 9 nur für Kinder/junge Erwachsene) nach RDU und Haushalt; fester Monatsbetrag je Gruppe und Person (Erw. 348 → 55, junge Erw. 231, Kind 132), Grenzen +6'000 je Unterhaltspflicht
**Zuständig / Weg:** Service de l'assurance-maladie (SAM); grundsätzlich automatisch aufgrund der Steuerveranlagung von vor zwei Jahren (2024); Antrag nötig u. a. für junge Erwachsene (Jg. 2001–2007), Quellenbesteuerte, Zuzüger 2025/2026, sehr tiefe RDU (< 15'000 allein / < 20'000 Paar), Brutto-Einkommen > 200'000 oder Brutto-Vermögen > 250'000; Frist: vor dem 30. November des Anspruchsjahres
**Gültigkeit:** 2026 definitiv (Barème 2026 des Kantons; Gesetzesbeträge 2024 indexiert)

### Rechenmodell
> «le droit aux subsides est ouvert lorsque le revenu déterminant ne dépasse pas les montants suivants : a) Groupe 1 : 1° assuré seul, sans charge légale : 30 000 francs, 2° couple, sans charge légale : 45 000 francs; […] h) Groupe 8 : 1° assuré seul, sans charge légale : 50 000 francs, 2° couple, sans charge légale : 115 000 francs.» / «Ces limites sont majorées de 6 000 francs par charge légale.» — Art. 21 al. 1–2 LaLAMal [2]

> «Le montant des subsides est de : Groupe 1 : 320 francs par mois; […] Groupe 8 : 50 francs par mois.» (Gesetzesbasis, indexiert) — Art. 22 al. 1 LaLAMal [2]; Indexierung: «indexés chaque année par le Conseil d'Etat par voie d'arrêté pour le 1er janvier de l'année suivante» — Art. 9B RaLAMal [3]

> «Une personne assumant une charge légale est assimilée à un couple.» — Art. 21 al. 4 LaLAMal [2]; «Le montant des subsides accordés ne peut dépasser le montant de la prime effective de l'assuré.» — Art. 22 al. 4 [2]

> «Dans le calcul des charges, une majoration de CHF 6'000.- par charge est consentie.» — Barème subsides 2026 [1]

Gruppe 9 (Art. 21 al. 5–7 [2]): nur Subsidien für Kinder / junge Erwachsene, wenn die Eltern über Gruppe 8 liegen, bis «151 000 francs» (allein oder Paar mit einer Unterhaltspflicht), +6'000 je weitere.

### Zahlen 2026
Aus «BAREME SUBSIDES 2026» [1] (CHF pro Monat):

| Grösse | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | Quelle |
|---|---|---|---|---|---|---|---|---|---|---|
| Subside adulte | 348 | 294 | 240 | 196 | 164 | 120 | 87 | 55 | – | [1] |
| Subside jeune adulte | 231 | 231 | 231 | 231 | 231 | 231 | 231 | 231 | 106 | [1] |
| Subside enfant | 132 | 132 | 132 | 132 | 132 | 132 | 132 | 132 | 67 | [1] |
| RDU Person allein ohne Kind | 0–30'000 | –35'000 | –37'500 | –40'000 | –42'500 | –45'000 | –47'500 | –50'000 | – | [1] |
| RDU Paar ohne Kind | 0–45'000 | –55'000 | –65'000 | –75'000 | –85'000 | –95'000 | –105'000 | –115'000 | – | [1] |
| RDU allein/Paar + 1 Kind | 0–51'000 | –61'000 | –71'000 | –81'000 | –91'000 | –101'000 | –111'000 | –121'000 | –151'000 | [1] |
| RDU allein/Paar + 2 Kinder | 0–57'000 | –67'000 | –77'000 | –87'000 | –97'000 | –107'000 | –117'000 | –127'000 | –157'000 | [1] |
| RDU allein/Paar + 3 Kinder | 0–63'000 | –73'000 | –83'000 | –93'000 | –103'000 | –113'000 | –123'000 | –133'000 | –163'000 | [1] |
| RDU allein/Paar + 4 Kinder | 0–69'000 | –79'000 | –89'000 | –99'000 | –109'000 | –119'000 | –129'000 | –139'000 | –169'000 | [1] |
| Haushaltstotal Person allein ohne Kind | 348 | 294 | 240 | 196 | 164 | 120 | 87 | 55 | – | [1] |
| Haushaltstotal Paar ohne Kind | 696 | 588 | 480 | 392 | 328 | 240 | 174 | 110 | – | [1] |
| Haushaltstotal allein + 1 Kind | 480 | 426 | 372 | 328 | 296 | 252 | 219 | 187 | 67 | [1] |
| Haushaltstotal Paar + 1 Kind | 828 | 720 | 612 | 524 | 460 | 372 | 306 | 242 | 67 | [1] |

(Gruppengrenzen jeweils «x'001 à y'000»; Einelternfamilien und Paare mit Kindern haben dieselben Grenzen, weil eine Person mit Unterhaltspflicht als Paar gilt.)

| Weitere Grösse | Wert | Quelle |
|---|---|---|
| Vermutung «nicht bescheiden»: Brutto-Vermögen | > 250'000 | [3] Art. 10 al. 1 |
| Vermutung «nicht bescheiden»: Brutto-Einkommen | > 200'000 | [3] Art. 10 al. 2 |
| Ersatz-Einkommen in diesen Fällen | Bruttoeinkommen × 0,95 + 1/15 Brutto-Vermögen | [3] Art. 10 al. 3 |
| Untergrenze (Antrag mit Nachweis nötig) | RDU < 15'000 allein / < 20'000 Paar, +3'000 je Unterhaltspflicht | [3] Art. 10 al. 4–5 |
| Junge Erwachsene | gelten als zusätzliche Unterhaltspflicht der Eltern (RDU Eltern + RDU junge Person) | [3] Art. 10 al. 7 |
| Antragsfrist (Antragsfälle) | vor dem 30. November des Anspruchsjahres | [3] Art. 10A |

### Massgebendes Einkommen
> «Le revenu déterminant est celui résultant de la loi sur le revenu déterminant unifié, du 19 mai 2005.» — Art. 21 al. 3 LaLAMal [2]

> «Le socle du revenu déterminant unifié est égal au revenu calculé en application des articles 4 et 5, augmenté d'un quinzième de la fortune calculée en application des articles 6 et 7.» — Art. 8 al. 2 LRDU [4]; «calculé automatiquement sur la base de la dernière taxation fiscale définitive» — Art. 9 al. 1 LRDU [4]

Abzüge nach Art. 5 LRDU u. a. Säule-3a/2.-Säule-Beiträge, NBU-Prämien, Berufskosten, Kinderbetreuungskosten, Unterhaltsbeiträge, behinderungsbedingte Kosten, Krankheitskosten über 5 % [4]. Ehegatten/eingetragene Partner und Konkubinatspaare mit gemeinsamem Kind: RDU werden addiert (Art. 9 RaLAMal [3]).

### Abweichung zur App
App-Wert (maxIncome/subsidySingle) wurde mit dem Auftrag nicht mitgegeben. Belegte Vergleichswerte: Person allein ohne Kind max. RDU 50'000, Höchstbetrag 348 CHF/Monat (= 4'176 CHF/Jahr) in 8 festen Stufen (nicht linear); Kinderbetrag in G1–G8 konstant 132 CHF/Monat, junge Erwachsene 231 CHF/Monat.

### Offen / nicht gefunden
- Der Indexierungs-Arrêté des Conseil d'État für 2026 (Art. 9B RaLAMal) wurde nicht separat gefunden; die Beträge stammen aus dem amtlichen Barème-PDF des Kantons [1]. Silgeneve-Stände: LaLAMal «Dernières modifications au 2 novembre 2024», RaLAMal «au 1er janvier 2025» — Gesetzestext enthält die unindexierten Beträge (320/270/…/50).
- Die Seite «Barèmes» (ge.ch/informations-generales-subside-assurance-maladie/baremes) lieferte per curl HTTP 403 («Zone sécurisée»); das verlinkte Dokument war frei abrufbar.
- Beträge für PC-AVS/AI-, PCFam- und Sozialhilfe-Beziehende (Durchschnittsprämie) nicht erfasst.

### Quellen
1. BAREME SUBSIDES 2026 (PDF, Dokumentseite «Barèmes et catégories 2026 pour les subsides d'assurance-maladie»), République et canton de Genève, Date de publication 21 avril 2026. https://www.ge.ch/document/baremes-categories-2026-subsides-assurance-maladie → https://www.ge.ch/document/43271/telecharger — abgerufen 16.09.2026
2. Loi d'application de la loi fédérale sur l'assurance-maladie (LaLAMal), rsGE J 3 05, Dernières modifications au 2 novembre 2024. https://silgeneve.ch/legis/data/rsg_j3_05.htm — abgerufen 16.09.2026
3. Règlement d'exécution de la LaLAMal (RaLAMal), rsGE J 3 05.01, Dernières modifications au 1er janvier 2025. https://silgeneve.ch/legis/data/rsg_j3_05p01.htm — abgerufen 16.09.2026
4. Loi sur le revenu déterminant unifié (LRDU), rsGE J 4 06, Dernières modifications au 1er janvier 2025. https://silgeneve.ch/legis/data/rsg_j4_06.htm — abgerufen 16.09.2026
5. Demander un subside d'assurance-maladie 2026, ge.ch (SAM), Dernière mise à jour 9 juillet 2026. https://www.ge.ch/demander-subside-assurance-maladie-2026 — abgerufen 16.09.2026
6. Informations générales sur le subside de l'assurance-maladie, ge.ch, Dernière mise à jour 28 mai 2026. https://www.ge.ch/informations-generales-subside-assurance-maladie — abgerufen 16.09.2026

---

## JU — Jura

**Beurteilung:** abbildbar
**Modell (kurz):** Stufentabelle in 1'000er-Schritten des revenu déterminant (korrigiertes steuerbares Einkommen 2024); Erwachsene 225 → 15 CHF/Monat bis RDU 26'999; Kinder 100 und junge Erw. in Ausbildung 196 CHF pauschal bis 52'999; Vermögensgrenze 150'000; Familienzuschlag bis RDU 17'999
**Zuständig / Weg:** Caisse de compensation du canton du Jura (ECAS); von Amtes wegen nach definitiver Veranlagung 2024 (Entscheid oder Fragebogen); sonst Antrag bis 31.12.2026 (Eingang ECAS); Antrag nötig u. a. für Quellenbesteuerte, Konkubinatspaare mit gemeinsamem Kind, Personen < 25 in Ausbildung (über die Eltern); amtlich Veranlagte ausgeschlossen
**Gültigkeit:** 2026 definitiv (Arrêté vom 28.10.2025, gültig 1.1.–31.12.2026)

### Rechenmodell
> «Le montant maximal du revenu déterminant donnant droit aux réductions de primes, ainsi que les réductions mensuelles et annuelles accordées en fonction des différents paliers du revenu déterminant, sont fixés dans le tableau joint en annexe au présent arrêté.» — Art. 3 Arrêté 832.115.1 [1]

> «La réduction maximale s'élève mensuellement aux montants suivants : a) pour les adultes fr. 225.- b) pour les adultes de moins de 25 ans révolus fr. 160.- c) pour les adultes de moins de 25 ans révolus en formation fr. 196.- d) pour les enfants entre 16 et 18 ans révolus qui ne sont pas en formation fr. 45.- e) pour les enfants de moins de 18 ans révolus fr. 100.-» — Art. 2 al. 2 [1]

> «Les assurés dont la fortune déterminante est supérieure à 150 000 francs n'ont pas droit à la réduction des primes» — Art. 7a al. 1 Ordonnance 832.115 [2]

> «La réduction annuelle accordée à un assuré ne peut dépasser le montant de sa prime annuelle.» — Art. 20 [2]

Referenz: Art. 2 al. 1 [1] bindet die Höchstreduktion an einen Prozentsatz (Erwachsene 39 %, < 25 J. 40 %, < 25 J. in Ausbildung 50 %, 16–18 nicht in Ausbildung 36 %, Kinder < 18 80 %) der günstigsten Hausarztmodell-Prämie mit Unfall im Kanton.

### Zahlen 2026
Annexe 1 [1], CHF pro Monat (Jahr = × 12, in der Tabelle ebenfalls ausgewiesen):

| RDU (CHF) | Erwachsene | Erw. < 25 | Erw. < 25 in Ausbildung | 16–18 nicht in Ausbildung | Kinder < 18 | Quelle |
|---|---|---|---|---|---|---|
| unter 0 | 225 | 160 | 196 | 45 | 100 | [1] |
| 0–999 | 225 | 160 | 196 | 45 | 100 | [1] |
| 1'000–1'999 | 215 | 155 | 196 | 45 | 100 | [1] |
| 2'000–2'999 | 205 | 150 | 196 | 45 | 100 | [1] |
| 3'000–3'999 | 195 | 145 | 196 | 45 | 100 | [1] |
| 4'000–4'999 | 185 | 140 | 196 | 40 | 100 | [1] |
| 5'000–5'999 | 175 | 135 | 196 | 40 | 100 | [1] |
| 6'000–6'999 | 165 | 130 | 196 | 40 | 100 | [1] |
| 7'000–7'999 | 155 | 125 | 196 | 35 | 100 | [1] |
| 8'000–8'999 | 145 | 120 | 196 | 35 | 100 | [1] |
| 9'000–9'999 | 125 | 110 | 196 | 35 | 100 | [1] |
| 10'000–10'999 | 110 | 100 | 196 | 30 | 100 | [1] |
| 11'000–11'999 | 100 | 90 | 196 | 30 | 100 | [1] |
| 12'000–12'999 | 95 | 85 | 196 | 30 | 100 | [1] |
| 13'000–13'999 | 90 | 80 | 196 | 25 | 100 | [1] |
| 14'000–14'999 | 85 | 75 | 196 | 25 | 100 | [1] |
| 15'000–15'999 | 75 | 70 | 196 | 25 | 100 | [1] |
| 16'000–16'999 | 70 | 65 | 196 | 20 | 100 | [1] |
| 17'000–17'999 | 65 | 60 | 196 | 20 | 100 | [1] |
| 18'000–18'999 | 60 | 55 | 196 | 20 | 100 | [1] |
| 19'000–19'999 | 55 | 50 | 196 | 15 | 100 | [1] |
| 20'000–20'999 | 45 | 45 | 196 | 15 | 100 | [1] |
| 21'000–21'999 | 40 | 40 | 196 | 15 | 100 | [1] |
| 22'000–22'999 | 35 | 35 | 196 | 10 | 100 | [1] |
| 23'000–23'999 | 30 | 30 | 196 | 10 | 100 | [1] |
| 24'000–24'999 | 25 | 25 | 196 | 10 | 100 | [1] |
| 25'000–25'999 | 20 | 20 | 196 | 10 | 100 | [1] |
| 26'000–26'999 | 15 | 15 | 196 | 10 | 100 | [1] |
| 27'000–52'999 | 0 | 0 | 196 | 0 | 100 | [1] |

Annexe 2 — Familienzuschlag (je Erwachsene/r, Eltern mit Kind und Haupterwerb, RDU < 18'000) [1]:

| RDU | CHF/Monat |
|---|---|
| unter 0 bis 3'999 | 300 |
| 4'000–4'999 | 285 |
| 5'000–5'999 | 265 |
| 6'000–6'999 | 235 |
| 7'000–7'999 | 205 |
| 8'000–8'999 | 175 |
| 9'000–9'999 | 145 |
| 10'000–10'999 | 115 |
| 11'000–11'999 | 105 |
| 12'000–12'999 | 95 |
| 13'000–13'999 | 85 |
| 14'000–14'999 | 70 |
| 15'000–15'999 | 55 |
| 16'000–16'999 | 25 |
| 17'000–17'999 | 15 |
| über 17'999 | 0 |

| Weitere Grösse | Wert | Quelle |
|---|---|---|
| Einkommensgrenze Erwachsene | RDU 26'999 | [1] Annexe; [3] |
| Einkommensgrenze Kinder / junge Erw. in Ausbildung | RDU 52'999 | [1] Annexe; [3] |
| Vermögensgrenze | fortune déterminante > 150'000 → kein Anspruch; massgebend = «titres et autres placements de capitaux selon avis de taxation (chiffre 740)» | [2] Art. 7a; [1] Art. 1 al. 2 |
| Referenzprämie PC/Sozialhilfe (Erwachsene) | 568.30 CHF/Monat (günstigste Hausarztprämie, Franchise 300, mit Unfall) | [3]; [5] |

### Massgebendes Einkommen
> «le revenu imposable taxé définitivement pour l'année fiscale 2024 sert de base de calcul.» / «Par revenu imposable au sens du présent article, on entend le revenu déterminant pour le taux, soit le revenu suisse et étranger (revenu mondial).» — Art. 1 al. 1 und 3 [1]

> Korrekturen (Art. 1 al. 4 [1]): Liegenschaftsertrag minus, Liegenschafts-Aufwandüberschuss / Schuldzinsen / Geschäftsverluste / Verlustvorträge / Liquidationsverluste / 2.-Säule-Einkäufe / Säule-3a-Beiträge werden wieder aufgerechnet; zusätzliche Abzüge (al. 5): «par contribuable marié, veuf, divorcé ou séparé, sans enfant à charge fr. 5 000.-», «par couple marié, personne veuve, divorcée, séparée ou célibataire, au bénéfice d'une déduction fiscale pour "enfants à charge" (chiffre 620) fr. 10 000.-», je Kind «pour les deux premiers enfants fr. 4 000.-», «à partir du troisième enfant fr. 6 000.-»; zudem «Le revenu imposable est majoré de 5 % de la fortune imposable (chiffre 890)» (al. 6) — [1]

### Abweichung zur App
App-Wert (maxIncome/subsidySingle) wurde mit dem Auftrag nicht mitgegeben. Belegte Vergleichswerte: Erwachsene max. RDU 26'999, Höchstbetrag 225 CHF/Monat (= 2'700 CHF/Jahr); Abbau in 1'000er-Stufen annähernd, aber nicht exakt linear (z. B. Sprung 145 → 125 bei 9'000). Kinderbetrag 100 CHF/Monat ist einkommensunabhängig bis 52'999.

### Offen / nicht gefunden
- Das Arrêté-PDF enthält im Textlayer auf der Tabellenseite zusätzlich eine verdeckte Überschrift «pour l'année 2025»; die sichtbare Seite (gerendert und geprüft) lautet «pour l'année 2026». Werte deshalb am Seitenbild kontrolliert.
- Ob das Arrêté in der RSJU-Online-Sammlung (832.115.1) bereits in dieser Fassung publiziert ist, nicht separat geprüft; Quelle ist das von der ECAS verlinkte unterzeichnete PDF.
- Genaue Regel für Konkubinatspaare und Quellenbesteuerte (Unterseiten ECAS) nicht einzeln geöffnet.

### Quellen
1. Arrêté concernant la réduction des primes dans l'assurance-maladie pour l'année 2026 (RSJU 832.115.1) avec les 2 tableaux annexés, Gouvernement de la République et Canton du Jura, vom 28.10.2025, in Kraft 1.1.2026 bis 31.12.2026. https://www.ecasjura.ch/Htdocs/Files/v/5f96a91e0eb5f044bed32b1e94ba290c44619d65fb5d3f26f4180819cda93fe4.pdf/Arrete-2026-avec-annexes.pdf?download=1 — abgerufen 16.09.2026
2. Ordonnance concernant la réduction des primes dans l'assurance-maladie (RSJU 832.115), vom 25.10.2011, Fassung «valable dès 01.01.2026». https://www.ecasjura.ch/Htdocs/Files/v/bee518871de457c7d9af3cdfad0dfa39037365333dfc328573cdf2e7eb86da34.pdf/ORPAMal-valable-des-01.01.2026.pdf?download=1 — abgerufen 16.09.2026
3. Communiqué «Subsides des primes de l'assurance-maladie dans le canton du Jura pour 2026», République et Canton du Jura, 30.10.2025. https://www.jura.ch/fr/Autorites/Administration/CHA/SIC/Centre-medias/Communiques-2025/Subsides-des-primes-de-l-assurance-maladie-dans-le-canton-du-Jura-pour-2026.html — abgerufen 16.09.2026
4. Réduction des primes d'assurance-maladie (RPI) - Informations générales 2026, ECAS Jura. https://www.ecasjura.ch/fr/Assurances/Assurance-maladie/Reduction-des-primes-d-assurance-maladie-RPI-Informations-generales-2026/Reduction-des-primes-d-assurance-maladie-RPI-Informations-generales-2026.html — abgerufen 16.09.2026
5. Modèle médecin de famille, maladie et accident, pour les adultes (Primes 2026), ECAS Jura. https://www.ecasjura.ch/Htdocs/Files/v/6ea884aaab5803991c5901a89b1e2072c8caa7d882fb86c9ceb069f7a68a898d.pdf/MED-adultes-avec-risque-accidents.pdf?download=1 — abgerufen 16.09.2026
