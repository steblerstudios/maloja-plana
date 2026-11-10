# Sozialhilfe 2026 — amtliche Belege je Kanton

Stand der Recherche: **09.11.2026** (alle Quellen an diesem Tag neu abgerufen).
Grundlage für die Kantonsseiten `/sozialhilfe/<kanton>/` (Welle 2 im
`docs/roadmap/BAUPLAN-kantonsseiten-2026-11.md`, §6). Dieses Dokument ändert keinen Code
und baut keine Seite.

Zweck: Für jeden Kanton amtlich belegen, **wer zuständig ist, wo man Sozialhilfe beantragt,
ob und wie die SKOS-Richtlinien gelten, und was eine Person Geld oder Rechte kosten kann,
wenn sie es nicht weiss.** Nur was hier mit Quelle steht, darf später auf eine Kantonsseite.

## Regeln dieser Erhebung

- Als Beleg zählen nur amtliche Quellen: kantonales Gesetz und Verordnung, Regierungs- und
  Departementsbeschlüsse, Richtlinien und Weisungen der zuständigen Stelle, Merkblätter und
  Handbücher der kantonalen Verwaltung. SKOS-Seiten nur als Hinweis, nie als Beleg für
  kantonales Recht. Keine Zeitungen, Vergleichsportale oder KI-Zusammenfassungen.
- **Die SKOS empfiehlt nur.** Verbindlich werden ihre Richtlinien erst, wenn der Kanton sie
  übernimmt. Darum steht je Kanton der Wortlaut, mit dem er das tut («richtet sich nach»,
  «wegleitend», «orientiert sich», «subsidiär» …), und ob der Verweis eine Ausgabe nennt
  (statisch) oder nicht. «Dynamisch» steht nur, wo der Erlass «in der jeweils geltenden
  Fassung» oder Gleichwertiges sagt.
- Zitate sind wörtlich, in der Originalsprache, mit Stelle (Art./§/Abs., Seite).
  Auslassungen sind mit «…» markiert.
- **Keine Zahlen in den Zusammenfassungen.** Beträge, Fristen, Einkommens- und Altersgrenzen
  und Prozentsätze stehen nur in wörtlichen Zitaten; die Zusammenfassung sagt «Frist im
  Gesetz», «Altersgrenze im Erlass». Die späteren Seiten zeigen keine Zahlen (Bauplan §3).
- **Messweise.** Jede Quelle mit `curl` neu abgerufen (Status, Titel), dazu je Domain eine
  Gegenprobe mit erfundenem Pfad. Amtliche Sammlungen, die als Web-App laufen (LexWork:
  `…/app/de/texts_of_law/<nr>`), liefern auf der Anzeigeseite **auch für erfundene Nummern
  HTTP 200**. Der Bestand ist dort über die API belegt (`/api/de/texts_of_law/<nr>`,
  Versions-PDF), die Gegenprobe mit einer erfundenen Erlassnummer gibt 404. Wo auch die
  API nicht sauber 404 gibt (TI RLeggi, JU RSJU, VD BLV), ist der Bestand über den Inhalt
  belegt (Titel, Nummer, Text) und so vermerkt.
- **Nicht messbar ist nicht tot.** `baselland.ch` zeigt curl nur eine Cloudflare-Schranke
  (HTTP 403, auch beim erfundenen Pfad) → «mit curl nicht messbar». `vs.ch` antwortete am
  09.11.2026 normal (Amtsseite 200, erfundener Pfad 404), anders als bei der Linkprüfung
  zu PR #769.
- **Asylbereich ist nicht Gegenstand dieses Blatts.** Für Asylsuchende, vorläufig
  Aufgenommene und je nach Kanton anerkannte Flüchtlinge gelten eigene Regeln und oft eine
  andere Stelle. Wo das kantonale Recht es sagt, steht je Kanton eine Zeile dazu.
- **Aufenthaltsbewilligung: nur, was eine kantonale Quelle sagt.** Bundesrecht (AIG/LEI
  Art. 62/63, VZAE/OASA Art. 82b, Meldepflichten) wurde **nicht** erhoben. «In den
  kantonalen Quellen nicht genannt» heisst darum nie «keine Folge» oder «keine Meldung».
- **Beurteilung:**
  - **belegbar** — Erlasse, Zuständigkeit, Antragsweg und SKOS-Status amtlich belegt.
  - **teilweise** — eines davon fehlt oder ist unklar (meist der SKOS-Status).
  - **nicht belegt** — Kernpunkte amtlich nicht auffindbar.
- **Ablauf:** Erhebung in fünf Gruppen, jede Gruppe danach vom `swiss-precision-pruefer`
  gegen die neu abgerufenen Primärquellen geprüft, Befunde eingearbeitet. Korrigierte
  Aussagen stehen ~~durchgestrichen~~ mit ⟨korrigiert 09.11.2026, Fachprüfung⟩ daneben;
  je Kanton schliesst ein Block «Fachprüfung 09.11.2026» ab.
- Kantonales Recht ändert sich. Vor dem Bau einer Seite den Stand an der Quelle erneut
  prüfen; **BE, SO und TG haben beschlossene Fassungen ab 01.01.2027** (siehe unten).

**Erfasst:** 26 von 26 Kantonen. **20× belegbar · 6× teilweise · 0× nicht belegt.**
Fachprüfung: 1 Blocker (BE, Totalrevision ab 2027, als Ablaufdatum markiert), kein Kanton
mit erfundenem oder verfälschtem Zitat.

## Übersicht

| Kt. | Beurteilung | Zuständig | SKOS-Übernahme | Hauptgesetz |
|---|---|---|---|---|
| ZH | belegbar | politische Gemeinde (Wohngemeinde) | verbindlich, statischer Verweis (Fassung ab 1.1.2026), Abweichungen im Einzelfall vorbehalten — SHV § 17 | SHG, LS 851.1 |
| BE | belegbar **bis 31.12.2026** | Sozialdienste der Gemeinden (auch regional), teils Burgergemeinden | verbindlich, statischer Verweis auf die 5. Ausgabe, eigene Ansätze — SHV Art. 8 | SHG, BSG 860.1 (Totalrevision ab 01.01.2027) |
| LU | belegbar | Einwohnergemeinde des Unterstützungswohnsitzes | «wegleitend», Regierungsrat kann abweichen — SHG § 31 | SHG, SRL 892 |
| UR | teilweise | Einwohnergemeinde; Sozialdienste Uri Nord / Uri Süd | nur «orientiert sich»; Richtlinien des Regierungsrats nicht gefunden — SHG Art. 28 | SHG, RB 20.3421 |
| SZ | belegbar (Stand nur über Fusszeile) | Gemeinde (Fürsorgebehörde) | «wegleitend», Abweichungen möglich — ShV § 4 | ShG, SRSZ 380.100 |
| OW | teilweise | Einwohnergemeinde; Vollzug Regionaler Sozialdienst Obwalden (Zweckverband) | nicht belegt — kein Verweis in SHG/SHV | SHG, GDB 870.1 |
| NW | belegbar | politische Gemeinde; kantonales Sozialamt klärt ab und stellt Antrag | «orientiert sich an», statisch (5. Ausgabe), verbindliche Abweichungen — SHV § 8 | SHG, NG 761.1 |
| GL | belegbar | **Kanton** (Soziale Dienste) | «in der Regel» massgebend, eigene Abweichungsverordnung — SHG Art. 23 | SHG, GS VIII E/21/3 |
| ZG | belegbar | Einwohnergemeinde (Bürgergemeinde für eigene Bürger am Heimatort) | «richten sich nach», Verweis ohne Ausgabe, kantonale Ergänzungen — SHV § 9 | SHG, BGS 861.4 |
| FR | teilweise | Gemeinden in Sozialhilferegionen (service social régional); Übergangsrecht | Normen «en se référant aux normes de la CSIAS», CSIAS subsidiär — LASoc art. 41, Ordonnance art. 17 | LASoc, RSF 831.0.1 (seit 01.01.2026) |
| SO | belegbar | Einwohnergemeinden in Sozialregionen | «grundsätzlich», benannte Abweichungen — SG § 152 | Sozialgesetz, BGS 831.1 |
| BS | belegbar | Stadt Basel: Kanton (Sozialhilfe Basel-Stadt); Riehen/Bettingen: Sozialhilfe Riehen | «orientiert sich», SKOS subsidiär über die Unterstützungsrichtlinien — SHG § 7 | SHG, SG 890.100 |
| BL | teilweise | Gemeinde (Sozialhilfebehörde) | eigene Ansätze, Regierungsrat «kann sich … orientieren» — SHG § 6 | SHG, SGS 850 |
| SH | belegbar | Gemeinde (Sozialhilfebehörde) | eigene «Schaffhauser Richtlinien» «in Anlehnung an» die SKOS — SHEG Art. 25 | SHEG, SHR 850.100 |
| AR | belegbar | Gemeinde (Sozialhilfebehörde, Sozialdienst) | «verbindlich, soweit …» — SHV Art. 3 | SHG, bGS 851.1 |
| AI | teilweise | **Kanton** (Sozialamt) | nicht belegt — Richtlinien der Standeskommission nicht auffindbar — ShiV Art. 5 | ShiG, GS 850.000 |
| SG | teilweise | politische Gemeinde | nicht belegt — Gesetz verweist auf die **KOS**-Richtlinien («orientiert sich»), Verbindlicherklärung nicht gefunden — SHG Art. 11 | SHG, sGS 381.1 |
| GR | belegbar | Wohnsitzgemeinde entscheidet; kantonale Beratungszentren Soziales bereiten vor | statisch auf SKOS «vom April 2005», eigene Ansätze — ABzUG Art. 1 | UG, BR 546.250 · SHG, BR 546.100 |
| AG | belegbar | Gemeinde (Unterstützungswohnsitz, sonst Aufenthaltsort) | verbindlich, statisch (Fassung ab 1.1.2026), benannte Ausnahmen — SPV § 2a | SPG, SAR 851.200 |
| TG | belegbar | Wohnsitzgemeinde (Sozialhilfebehörde) | «in der Regel», dynamisch nur für die materielle Grundsicherung — SHV §§ 2a–2b | SHG, RB 850.1 |
| TI | belegbar | **Kanton** entscheidet (DSS), Gemeinde gibt grundsätzlich bindende Stellungnahme | «tenuto conto delle direttive» der CSIAS, keine pauschale Übernahme — Las Art. 19 | Las, RL 871.100 |
| VD | belegbar | Centres sociaux régionaux (CSR) der Gemeinden; Kanton (DGCS) beaufsichtigt | eigener Barème, CSIAS nur punktuell — LASV Art. 31/32 | LASV, BLV 850.051 |
| VS | belegbar | Wohnsitzgemeinde entscheidet; CMS instruieren | subsidiär — OLIAS Art. 43 | LIAS/GES, SGS 850.1 |
| NE | belegbar | Wohnsitzgemeinde über regionale Sozialdienste | subsidiär («pour le surplus») — ANCAM Art. 24 | LASoc, RSN 831.0 |
| GE | belegbar | **Hospice général** | kantonaler Forfait im RASLP, gesetzlich an CSIAS gebunden — LASLP Art. 31 | LASLP, rsGE J 4 04 (seit 01.01.2025, ersetzt LIASI) |
| JU | belegbar | **Kanton** entscheidet (SAS); Antrag bei den Services sociaux régionaux | subsidiär — Arrêté Art. 41 | LASoc, RSJU 850.1 |

Die Erlassnummern in der Übersicht sind gekürzt; massgebend ist die Tabelle «Erlasse» im
jeweiligen Kantonsabschnitt (dort mit API-Beleg und Stand).

## Auffällige Befunde

- **Vier Kantone entscheiden selbst, nicht die Gemeinde:** GL, AI, TI und JU (dazu GE mit
  dem Hospice général als kantonaler Anstalt und BS für die Stadt Basel). Eine Seite, die
  pauschal «bei Ihrer Gemeinde» sagt, wäre dort falsch.
- **SKOS-Übernahme ist kein Ja/Nein.** Von «verbindlich» (ZH, AG, AR) über «wegleitend» (LU,
  SZ), «orientiert sich» (UR, NW, BS) und «subsidiär» (VS, NE, JU) bis zu eigenen Richtlinien
  (SH, BL, VD) und gar keinem Verweis (OW). **SG verweist auf die KOS** (St.Gallische
  Konferenz der Sozialhilfe, ein Verein), nicht auf die SKOS. Mehrere Verweise sind
  **statisch** auf eine alte Ausgabe: GR «vom April 2005», BE und NW 5. Ausgabe 2021.
- **Beschlossene Änderungen ab 01.01.2027:**
  - **BE (Blocker für eine Seite ab 2027):** Totalrevision des SHG, Grossratsbeschluss
    10.03.2026, Inkrafttreten 01.01.2027. Rückerstattung bei rechtmässigem Bezug neu nur noch
    bei Vermögensanfall, Eltern neu rückerstattungspflichtig für Hilfe an ihre Kinder,
    Verwandtenunterstützung neu Art. 58 f. Zitate aus dem Dokument zur 2. Lesung; der
    wortgleich beschlossene Text war in BELEX noch nicht abrufbar. **Vor einer BE-Seite neu
    erheben.**
  - **TG:** neue Fassung des SHG (u. a. Rückerstattung erst nach Abschluss der Ausbildung,
    neuer Anspruch auf Weiterführung der Unterbringung nach Volljährigkeit).
  - **SO:** neue Fassung des Sozialgesetzes; die Sozialhilfe-Paragrafen (§§ 147–166) bleiben
    laut Wortvergleich unverändert.
  - **UR:** Gesamtrevision am 18.05.2025 abgelehnt, neue Vorlage hängig.
  - **FR:** neues Gesetz seit 01.01.2026, aber Übergangsrecht für die neue Organisation, und
    die Ausführungserlasse gehören noch zum Gesetz von 1991.
- **Aufenthaltsbewilligung in kantonalen Quellen genannt:** ZH (Meldepflicht, SHG § 47 a),
  BS (Merkblatt: Meldung, Strafanzeige bei unrechtmässigem Bezug mit möglicher Wegweisung),
  TG (Ausschluss bestimmter Gruppen unter Vorbehalt des Bundesrechts, Meldung), GL
  (Ausweis L: Nothilfe), VS (Weisung 2026, OLIAS Art. 46), JU (Leitfaden: vier Fälle,
  Kürzung nur bei neuem Gesuch während eines Nichtverlängerungsverfahrens), BE (Vorbehalt
  SHG Art. 26 Abs. 3). Übrige: in den kantonalen Quellen nicht genannt — Bundesrecht nicht
  erhoben.
- **Veraltete Amtsseiten:** AG nennt noch die SKOS «Stand 1. Januar 2023» (Verordnung: Fassung
  ab 1.1.2026); ZG verlinkt Gesetzesfassungen, die bis 31.12.2023 galten; FR beschreibt auf
  der Antragsseite (Stand 2023) noch die alte Ordnung; SH verlinkt Richtlinien 2023/2024,
  die Fassung 2025 ist nur über eine Websuche auffindbar (Aktualität nicht bestätigt).
- **Widersprüche in den Quellen (festgehalten, nicht aufgelöst):** GL Rückforderung
  «zeitlich unbegrenzt» (SHV Art. 10) gegen Erlöschensfristen (SHG Art. 33 Abs. 3); BE
  vorläufig Aufgenommene «sieben Jahre» (GSI-Seite) gegen SHV Art. 8 Abs. 4.
- **Links in `CANTONAL_LINKS[k].sozialdienst`:** alle 26 erreichbar und thematisch richtig;
  BL mit curl nicht messbar. Für VS ist `CANTONAL_LINKS_GEPRUEFT.VS.sozialdienst` noch
  `null`, obwohl vs.ch am 09.11.2026 messbar war. Genauere Zieladressen (Gesuchsstelle bzw.
  Verzeichnis statt Amtsstartseite) für OW, NW, FR, SO, AR, GR, TG stehen in den Abschnitten.
  Nicht in diesem PR geändert.

---

## ZH — Zürich

**Beurteilung:** belegbar
**Zuständig (kurz):** politische Gemeinde (Wohngemeinde); Fürsorgebehörde = Gemeindevorstand, sofern die Gemeindeordnung nichts anderes vorsieht — SHG §§ 1, 6, 32
**Asylbereich:** eigene Regeln/Stelle — nicht Gegenstand dieses Blatts (SHG § 5 a Abs. 1: «Die Hilfe für Asylsuchende, vorläufig Aufgenommene und Schutzbedürftige ohne Aufenthaltsbewilligung (nachfolgend Asylsuchende) richtet sich nach besonderen Vorschriften.») ⟨korrigiert 09.11.2026, Fachprüfung⟩
**Antrag (kurz):** auf Gesuch bei der Fürsorgebehörde bzw. den Sozialen Diensten der Wohngemeinde (SHV § 25; Kantonsseite); kein kantonales Verzeichnis der Gemeindesozialdienste gefunden
**SKOS (kurz):** ~~ganz verbindlich~~ verbindlich (statischer Verweis, Fassung ab 1.1.2026), begründete Abweichungen im Einzelfall vorbehalten ⟨korrigiert 09.11.2026, Fachprüfung⟩; Teuerungsanpassung der SKOS ausgeschlossen, Weisungen der Sicherheitsdirektion — SHV § 17 Abs. 1–3
**Aufsicht:** Bezirksrat (SHG § 8); Sicherheitsdirektion / Kantonales Sozialamt (SHG § 9, SHV § 17 Abs. 3); Oberaufsicht Regierungsrat (SHG § 10) — https://www.zh.ch/de/sicherheitsdirektion/sozialamt.html
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Sozialhilfegesetz (SHG) vom 14. Juni 1981 | LS 851.1 | Version 123, Publikationsdatum 01.01.2024 («aktuell»); PDF-Fusszeile «1. 1. 24 - 123» | https://www.zh.ch/de/politik-staat/gesetze-beschluesse/gesetzessammlung/zhlex-ls/erlass-851_1-1981_06_14-1982_01_01-123.html | Seite 200, Titel «Sozialhilfegesetz (SHG)»; PDF 200 (application/pdf, 19 S.); Gegenprobe erlass-999_999-… → 404; notes.zh.ch Fantasie-PDF → 404 |
| Verordnung zum Sozialhilfegesetz (SHV) vom 21. Oktober 1981 | LS 851.11 | Version 131, Publikationsdatum 01.01.2026 («aktuell»); PDF «1. 1. 26 - 131» | https://www.zh.ch/de/politik-staat/gesetze-beschluesse/gesetzessammlung/zhlex-ls/erlass-851_11-1981_10_21-1982_01_01-131.html | Seite 200; PDF 200 (13 S.); Gegenprobe wie oben |

ZH-Lex ist keine LexWork-App; Bestand über Erlassseite (Metadaten «Ordnungsnummer», «Inkraftsetzungsdatum 01.01.1982», «Link auf 123 (aktuell)») und PDF belegt.

### Zuständigkeit und Antrag
> «Die politischen Gemeinden sorgen nach Massgabe dieses Gesetzes für die notwendige Hilfe an Personen, die sich in einer Notlage befinden.» — [1], § 1 Abs. 1

> «Fürsorgebehörde ist der Gemeindevorstand der politischen Gemeinde. Die Gemeindeordnung kann die Zuständigkeit eines anderen Organs vorsehen.» — [1], § 6

> «Die Pflicht zur Leistung persönlicher und wirtschaftlicher Hilfe obliegt der Wohngemeinde des Hilfesuchenden.» — [1], § 32

> «Wirtschaftliche Hilfe wird in der Regel auf Gesuch hin gewährt.» — [2], § 25 Abs. 1

> «Menschen in einer Notlage können sich an die Sozialen Dienste in ihrer Gemeinde wenden.» — [3]

### SKOS-Richtlinien
> «Sie bemisst sich nach den Richtlinien der Schweizerischen Konferenz für Sozialhilfe (SKOS-Richtlinien) in der ab 1. Januar 2026 geltenden Fassung*. Vorbehalten bleiben begründete Abweichungen im Einzelfall.» — [2], § 17 Abs. 1 (Fassung gemäss RRB vom 27. August 2025, Fn. 28)

> «Soweit in Abs. 1 nichts anderes geregelt wird, gelangt die in den SKOS-Richtlinien vorgesehene Teuerungsanpassung nicht zur Anwendung.» — [2], § 17 Abs. 2

> «Die Sicherheitsdirektion erlässt Weisungen über die Anwendung der SKOS-Richtlinien.» — [2], § 17 Abs. 3

> «Im Kanton Zürich ist die Anwendung der SKOS-Richtlinien verbindlich.» — [3]

~~Benannte Abweichung/Konkretisierung: Weisung der Sicherheitsdirektion zur Anwendung der SKOS-Richtlinien vom 30. Januar 2024 (per 1. März 2024) [4] — Integrationszulage (Bandbreite im Erlass) und Ein-/Austrittsschwelle.~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩
Benannte Konkretisierungen in der Weisung der Sicherheitsdirektion vom 30. Januar 2024 (per 1. März 2024) [4], Ziff. 1–5: (1) Ein-/Austrittsschwelle (SKOS C.2), (2) Integrationszulage für Nichterwerbstätige — Bandbreite in der Weisung (C.6.7), (3) Einkommensfreibeträge (D.2), (4) Obergrenze der Zulagen IZU/EFB bei Mehrpersonenhaushalten, (5) Falschauszahlungen/Nachzahlungen (E.3). Die Weisung wird auf zh.ch weiterhin angeboten («Download Weisung zur Anwendung der SKOS-RL per 1.3.2024») [3].

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** bei unrechtmässigem Bezug Pflicht (§ 26); ~~bei rechtmässigem Bezug u. a. bei rückwirkenden Versicherungsleistungen und bei Erbschaft/Lotteriegewinn~~ bei rechtmässigem Bezug **Kann-Vorschrift** («kann … zurückgefordert werden»): rückwirkende Versicherungs-/Drittleistungen, Erbschaft/Lotteriegewinn u. ä.; bei Verbesserung durch **eigene Arbeitsleistung** nur, wenn ein Verzicht «als unbillig erscheint» (§ 27 Abs. 1 lit. b) ⟨korrigiert 09.11.2026, Fachprüfung⟩; erfasst auch Leistungen für Ehegatten und minderjährige Kinder (§ 27 Abs. 2); aus dem Nachlass; Fristen im Gesetz, grundpfandgesicherte Forderungen verjähren nicht.
  > «Rechtmässig bezogene wirtschaftliche Hilfe kann ganz oder teilweise zurückgefordert werden, wenn […] b. der Hilfeempfänger aus Erbschaft, Lotteriegewinn oder anderen nicht auf eigene Arbeitsleistung zurückzuführenden Gründen in finanziell günstige Verhältnisse gelangt» — [1], § 27 Abs. 1 lit. b
  > «in Fällen eigener Arbeitsleistung nur dann, wenn diese zu derart günstigen Verhältnissen führt, dass ein Verzicht auf Rückerstattung, unter Berücksichtigung der Gründe des Hilfebezugs, als unbillig erscheint» — [1], § 27 Abs. 1 lit. b
  > «Der Rückerstattungsanspruch erstreckt sich auf Leistungen, die der Hilfeempfänger für sich selbst, für seinen Ehegatten während der Ehe, für seine eingetragene Partnerin oder seinen eingetragenen Partner während der Dauer der eingetragenen Partnerschaft und für seine Kinder während ihrer Minderjährigkeit erhalten hat.» — [1], § 27 Abs. 2
  > «Stirbt der Hilfeempfänger, entsteht ein Anspruch auf Rückerstattung der wirtschaftlichen Hilfe gegenüber seinem Nachlass.» — [1], § 28 Abs. 1
  > «Wirtschaftliche Hilfe, die jemand für sich selbst während seiner Minderjährigkeit oder bis zum Abschluss einer in dieser Zeit begonnenen Ausbildung bezogen hat, ist nicht zurückzuerstatten.» — [1], § 27 Abs. 3
  > «Rückerstattungsforderungen, für die ein Grundpfand eingetragen ist, unterliegen keiner Verjährung.» — [1], § 30 Abs. 2
- **Verwandtenunterstützung:** Prüfpflicht der Fürsorgebehörde, zuerst Vermittlung; Handbuch: Legalzession, Klage im Streitfall.
  > «Die Fürsorgebehörde prüft, ob gemäss Art. 328 und 329 ZGB Verwandte zur Unterstützung des Hilfeempfängers verpflichtet sind.» — [1], § 25 Abs. 1
  > «Ergibt die Abklärung der Verhältnisse, dass eine Verwandtenunterstützung grundsätzlich möglich ist, so ist zunächst zu versuchen, eine einvernehmliche Regelung mit den pflichtigen Personen zu finden» — [5], Kap. 17.3.02 Ziff. 3.1
- **Aufenthaltsbewilligung:** kantonal genannt — unaufgeforderte Meldung an die Ausländerbehörde.
  > «Die Sozialhilfeorgane erstatten der zuständigen Ausländerbehörde unaufgefordert die nach Bundesrecht vorgesehenen Meldungen. Sie melden insbesondere: a. Beginn, Umfang und Beendigung des Bezugs von Sozialhilfe, Rückerstattungen von bezogenen Sozialhilfeleistungen sowie Umstände, die sich auf die Höhe der Unterstützungsleistung auswirken» — [1], § 47 a Abs. 1
  > «Für ausländische Staatsangehörige kann der Bezug von Sozialhilfeleistungen Auswirkungen auf ihre Anwesenheitsberechtigung haben.» — [6], Kap. 5.2.03 Ziff. 1
  > Personen mit Kurzaufenthaltsbewilligung u. a. sind von der ordentlichen Sozialhilfe ausgeschlossen; «Sie meldet Unterstützungsfälle nach Abs. 1 lit. b und c der zuständigen Ausländerbehörde.» — [1], § 5 e Abs. 4
- **Wohnsitzwechsel:** Wohnsitz = Gemeinde des Aufenthalts mit Absicht dauernden Verbleibens; endet mit Wegzug; Dossier und angeordnete Sanktionen können übergeben werden; Abschiebeverbot.
  > «Der Wohnsitz endet mit dem Wegzug aus der Gemeinde.» — [1], § 38 Abs. 1
  > «Bei einem Wegzug des Hilfesuchenden aus der bisherigen Wohn- oder Aufenthaltsgemeinde kann diese dessen Sozialhilfe-Dossier dem neu zuständigen Sozialhilfeorgan übergeben. Dieses kann im Zeitpunkt des Wegzugs bereits angeordnete Auflagen, Weisungen und Sanktionen übernehmen.» — [1], § 47 c Abs. 3
  > «Die Behörden dürfen einen Hilfebedürftigen nicht veranlassen, aus der Gemeinde wegzuziehen.» — [1], § 40 Abs. 1
- **Mitwirkung/Meldepflicht:** «Der Hilfesuchende meldet unaufgefordert Veränderungen der unterstützungsrelevanten Sachverhalte.» — [1], § 18 Abs. 3
- **Kürzung/Einstellung:** Kürzung bei Pflichtverstössen nach schriftlichem Hinweis (§ 24); ausnahmsweise Einstellung bei Arbeitsverweigerung (§ 24 a) — [1]
- **Grundpfand/Sicherheiten:** «Die Forderung aus der Unterzeichnung einer Rückerstattungsverpflichtung kann pfandrechtlich sichergestellt werden.» — [1], § 20 Abs. 2
- **Abtretung:** Hilfe kann von Abtretung von Ansprüchen gegen Dritte abhängig gemacht werden — [1], § 19 Abs. 1
- **Kostengutsprache:** «Ohne Gutsprache oder bei verspäteter Einreichung des Gesuchs besteht kein Anspruch auf Kostenübernahme. Vorbehalten bleiben notfallbedingte medizinische Behandlungen.» — [1], § 16 a Abs. 2 (Satz 3 ergänzt ⟨korrigiert 09.11.2026, Fachprüfung⟩) (Fristen für medizinische Behandlungen: SHV § 21, Frist in der Verordnung)
- **Observation / Strafe:** verdeckte Observation mit Genehmigung Bezirksrat (§ 48 a); Busse bei unrechtmässigem Erwirken (§ 48 b) — [1]

### Offen / nicht gefunden
- Kein kantonales Verzeichnis der Gemeindesozialdienste gefunden (Kantonsseite verweist nur auf «Soziale Dienste in ihrer Gemeinde»; Seite «Institutionen» listet nur Sucht-/Sozialhilfeeinrichtungen).
- Weisung der Sicherheitsdirektion [4] trägt Stand 1.3.2024 und nennt § 17 SHV in der Fassung per 1. März 2024; SHV § 17 verweist seit RRB 27.08.2025 auf die SKOS-Fassung ab 1.1.2026. Die Weisung ist auf zh.ch weiterhin publiziert (also aktuell angeboten); ob sie inhaltlich zur SKOS-Fassung 2026 passt: nicht geklärt.
- Sozialhilfehandbuch ist amtlich (Kantonales Sozialamt), aber nur einzelne Kapitel gelesen.

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** SKOS-Kurzformel «ganz verbindlich» (Einzelfall-Vorbehalt fehlte); Rückerstattung bei rechtmässigem Bezug als Pflicht formuliert statt Kann-Vorschrift, Einschränkung bei eigener Arbeitsleistung fehlte; Asylbereich fehlte; Weisung zu eng beschrieben.
- **Geändert:** SKOS (kurz), Weisung Ziff. 1–5, Rückerstattung (§ 27 Abs. 1 lit. b, Abs. 2 mit Zitat), Kostengutsprache (Notfall-Vorbehalt), Zeile Asylbereich, Offen-Punkt Weisung. Alle neuen Zitate an den eigenen Downloads (`zh_shg.txt`, `zh_shv.txt`, `zh_weisung.txt`, `zh_sh.html`) geprüft.
- **Offen:** Passung der Weisung 2024 zur SKOS-Fassung 2026.

### Quellen
1. Sozialhilfegesetz (SHG), LS 851.1, Version 123 (Publ. 01.01.2024), Staatskanzlei ZH. Erlassseite (oben) und PDF https://www.notes.zh.ch/appl/zhlex_r.nsf/WebView/82C1D8CD235DD241C1258A5100391CD8/$File/851.1_14.6.81_123.pdf — abgerufen 09.11.2026, HTTP 200 (der OpenAttachment-Link der Erlassseite liefert zuerst eine JS-Weiterleitung, Endziel 200 application/pdf); Gegenprobe `…/zhlex-ls/erlass-999_999-1981_06_14-1982_01_01-123.html` → 404, `…/WebView/0000…/$File/999.999.pdf` → 404
2. Verordnung zum Sozialhilfegesetz (SHV), LS 851.11, Version 131 (Publ. 01.01.2026). https://www.notes.zh.ch/appl/zhlex_r.nsf/WebView/41296175C03D1B5AC1258D4C004F8FE5/$File/851.11_21.10.81_131.pdf — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [1]
3. Sozialhilfe, Kanton Zürich (Kantonales Sozialamt). https://www.zh.ch/de/soziales/sozialhilfe.html — abgerufen 09.11.2026, HTTP 200, h1 «Sozialhilfe»; Gegenprobe https://www.zh.ch/atlantis-gibt-es-nicht-4711 → 404
4. Weisung der Sicherheitsdirektion zur Anwendung der SKOS-Richtlinien vom 30. Januar 2024, Ref. GSDS 2024-0077. https://www.zh.ch/content/dam/zhweb/bilder-dokumente/organisation/sicherheitsdirektion/sozialamt/abteilung-oeffentliche-sozialhilfe/weisung_ds_1.3.2024_skos_rl.pdf — abgerufen 09.11.2026, HTTP 200; Gegenprobe Domain wie [3]
5. Sozialhilfehandbuch Kap. 17.3.02 «Verwandtenunterstützungspflicht – Auswirkungen auf die Sozialhilfe», Publ. 8. Januar 2024. https://www.zh.ch/de/soziales/sozialhilfe/sozialhilfehandbuch/flexdata-definition/17-ansprueche-gegenueber-dritten/17-3-verwandtenunterstuetzungspflicht/17-3-02-verwandtenunterstuetzungspflicht--auswirkungen-auf-die-sozialhilfe.html — abgerufen 09.11.2026, HTTP 200
6. Sozialhilfehandbuch Kap. 5.2.03 «Informationen an Ausländerbehörden», Publ. 5. Januar 2024. https://www.zh.ch/de/soziales/sozialhilfe/sozialhilfehandbuch/flexdata-definition/5-allgemeines-zur-sozialhilfe/5-2-amtsgeheimnis-und-informationsaustausch/5-2-03-informationen-an-auslaenderbehoerden.html — abgerufen 09.11.2026, HTTP 200
7. Sozialhilfehandbuch Kap. 3.2.01 «Unterstützungswohnsitz Erwachsener», Publ. 26. August 2025. https://www.zh.ch/de/soziales/sozialhilfe/sozialhilfehandbuch/flexdata-definition/3-zustaendigkeit/3-2-unterstuetzungswohnsitz-und-aufenthalt/3-2-01-unterstuetzungswohnsitz-erwachsener.html — abgerufen 09.11.2026, HTTP 200
8. Kantonales Sozialamt, Kanton Zürich. https://www.zh.ch/de/sicherheitsdirektion/sozialamt.html — abgerufen 09.11.2026, HTTP 200, Titel «Kantonales Sozialamt | Kanton Zürich»

---

## BE — Bern

> ⚠️ **Dieser Abschnitt gilt bis 31.12.2026.** Das totalrevidierte SHG tritt am **1. Januar 2027** in Kraft (Regierungsratsbeschluss vom 28. Oktober 2026, [7]); ebenso die totalrevidierte SHV. Artikelnummern und Rückerstattungsregeln ändern sich. Vorschau siehe Block «Vorschau ab 01.01.2027» unten. ⟨korrigiert 09.11.2026, Fachprüfung⟩

**Beurteilung:** belegbar (Stand bis 31.12.2026)
**Zuständig (kurz):** Gemeinde des Unterstützungswohnsitzes (nach ZUG); Sozialdienst der Gemeinde oder regionaler/gemeinsamer Sozialdienst; Sozialbehörde — SHG Art. 15–19, 46; zudem ein Teil der Burgergemeinden («Die Sozialhilfe vollziehen im Kanton Bern die Sozialdienste der Gemeinden und ein Teil der Burgergemeinden.» [3]) ⟨korrigiert 09.11.2026, Fachprüfung⟩
**Asylbereich:** eigene Regeln/Stelle — nicht Gegenstand dieses Blatts: «Für Asylsuchende sowie vorläufig aufgenommene Ausländerinnen und Ausländer, die sich weniger als sieben Jahre in der Schweiz aufhalten, richtet sich die Hilfe nach Bundesrecht und den Bestimmungen des Gesetzes über die Sozialhilfe im Asyl- und Flüchtlingsbereich (SAFG)» [3]; Zuständigkeit für Flüchtlinge, Schutzbedürftige mit Aufenthaltsbewilligung, vorläufig Aufgenommene ohne Bundesbeiträge: SHG Art. 46a; tiefere Ansätze für vorläufig Aufgenommene: SHV Art. 8 Abs. 4. ⚠️ Widerspruch: GSI-Seite nennt «sieben Jahre», SHV Art. 8 Abs. 4 «vor Ablauf von zehn Jahren nach Erteilung der vorläufigen Aufnahme» [2]. ⟨korrigiert 09.11.2026, Fachprüfung⟩
**Antrag (kurz):** mündlich oder schriftlich beim Sozialdienst der zuständigen Gemeinde (SHG Art. 49 Abs. 2); Verzeichnis der kommunalen und regionalen Sozialdienste vorhanden (Stand Mai 2023)
**SKOS (kurz):** verbindlich, **statischer Verweis** auf die 5. Ausgabe vom 1. Januar 2021, mit eigenen Ansätzen (u. a. eigener Grundbedarf in der Verordnung) — SHV Art. 8 Abs. 1–2
**Aufsicht:** Einzelfall: Regierungsstatthalterämter; System: Gesundheits-, Sozial- und Integrationsdirektion (GSI), Amt für Integration und Soziales — https://www.gsi.be.ch/de/start/themen/soziales/sozialhilfe.html
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die öffentliche Sozialhilfe (Sozialhilfegesetz, SHG) vom 11.06.2001 | BSG 860.1 | API: «Aktuelle Version in Kraft seit: 01.09.2026 (Beschlussdatum: 03.12.2025)»; PDF «(Stand 01.09.2026)» | https://www.belex.sites.be.ch/app/de/texts_of_law/860.1 | API `/api/de/texts_of_law/860.1` → 200 JSON; PDF `/api/de/versions/3446/pdf_file_with_annexes` → 200; Gegenprobe `/api/de/texts_of_law/999.999` → 404, `/api/de/versions/9999999/pdf_file_with_annexes` → 404 |
| Verordnung über die öffentliche Sozialhilfe (Sozialhilfeverordnung, SHV) vom 24.10.2001 | BSG 860.111 | API: «Aktuelle Version in Kraft seit: 01.01.2026 (Beschlussdatum: 07.01.2026)»; PDF «(Stand 01.01.2026)» | https://www.belex.sites.be.ch/app/de/texts_of_law/860.111 | API → 200; PDF `/api/de/versions/3339/pdf_file_with_annexes` → 200; Gegenprobe wie oben |

| Direktionsverordnung über die Bemessung von situationsbedingten Leistungen (SILDV) vom 28.08.2015 | BSG 860.111.1 | API: «Aktuelle Version in Kraft seit: 01.01.2022 (Beschlussdatum: 17.11.2021)» | https://www.belex.sites.be.ch/app/de/texts_of_law/860.111.1 | API `/api/de/texts_of_law/860.111.1` → 200 (Text nicht gelesen); Gegenprobe wie oben — ergänzt ⟨korrigiert 09.11.2026, Fachprüfung⟩ |

Alle drei: `abrogated: false`, `abrogated_scheduled: false`, `future_versions: []` — obwohl die Inkraftsetzung der Totalrevision per 01.01.2027 beschlossen ist, zeigt BELEX am 09.11.2026 weder künftige Version noch geplante Aufhebung. **Totalrevision SHG** vom Grossen Rat in der Frühlingssession 2026 verabschiedet, Referendum nicht ergriffen, Inkrafttreten laut GSI «voraussichtlich per 01. Januar 2027» [4] — in BELEX noch nicht als künftige Version erfasst.

### Zuständigkeit und Antrag
> «Die Gemeinden stellen nach den kantonalen Vorgaben die individuellen Leistungsangebote bereit. Sie vollziehen die individuelle Sozialhilfe und überprüfen regelmässig die Wirkung der Leistungsangebote.» — [1], Art. 15 Abs. 1

> «Jede Einwohnergemeinde und jede gemischte Gemeinde führt einen eigenen Sozialdienst, betreibt mit anderen Gemeinden einen gemeinsamen Sozialdienst oder schliesst sich dem Sozialdienst einer anderen Gemeinde an.» — [1], Art. 18 Abs. 1

> «Die Gewährung der Sozialhilfe an Personen mit Aufenthalt im Kanton obliegt der Gemeinde, in der die bedürftige Person ihren Unterstützungswohnsitz hat. Der Unterstützungswohnsitz richtet sich nach den Bestimmungen des ZUG.» — [1], Art. 46 Abs. 1

> «Das Gesuch um Gewährung der Sozialhilfe ist mündlich oder schriftlich beim Sozialdienst der zuständigen Gemeinde zu stellen. Die das Gesuch stellende Person kann sich vertreten lassen.» — [1], Art. 49 Abs. 2

> «Oberaufsicht über die Organisation und die Entscheide der Sozialdienste haben im Kanton Bern die Regierungsstatthalterämter.» — [3]

### SKOS-Richtlinien
> «Die Richtlinien für die Ausgestaltung und Bemessung der Sozialhilfe der Schweizerischen Konferenz für Sozialhilfe (SKOS-Richtlinien) in der Fassung der fünften Ausgabe vom 1. Januar 2021 sind für den Vollzug der individuellen Sozialhilfe verbindlich, soweit das Sozialhilfegesetz und diese Verordnung keine andere Regelung vorsehen.» — [2], Art. 8 Abs. 1

Abweichungen im Erlass (ohne Beträge): eigener Grundbedarf nach Haushaltsgrösse (Art. 8 Abs. 2), eigene Pauschalen für junge Erwachsene (Art. 8 Abs. 3), eigene Regeln zu Integrationszulage, Einkommensfreibetrag, Kürzungen, Vermögensfreibeträgen (Art. 8a–8n) — [2].
BKSE-Handbuch: laut GSI «ergänzend Empfehlungen» [3]; in SHG/SHV nicht erwähnt → **nicht amtlich verbindlich**.

### Was Geld oder Rechte kosten kann
- **Rückerstattung (bis 31.12.2026):** bereits bei wesentlicher Verbesserung der wirtschaftlichen Verhältnisse ~~(strenger als ZH)~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩; bei Vermögen und bevorschussten Drittleistungen; bei grobem Selbstverschulden; unrechtmässig «samt Zins»; Ehepartner haften grundsätzlich mit; Erben; Verjährung: Frist im Gesetz, grundpfandgesichert unverjährbar.
  > «Personen, die wirtschaftliche Hilfe bezogen haben, sind zu deren Rückerstattung verpflichtet, sobald sich ihre wirtschaftlichen Verhältnisse wesentlich verbessert haben.» — [1], Art. 40 Abs. 1
  > «Die Ehefrau, der Ehemann oder die in eingetragener Partnerschaft lebende Person hat grundsätzlich auch die der jeweilig anderen Person gewährte wirtschaftliche Hilfe zurückzuerstatten, sofern ein Rückerstattungsgrund nach Artikel 40 vorliegt.» — [1], Art. 41 Abs. 1
  > Erben/Vermächtnisnehmer, «wenn der Nachlass nicht überschuldet ist und soweit sie aus dem Nachlass bereichert sind» — [1], Art. 42 Abs. 1 lit. a
  > Ausnahme: kein Rückerstattungsanspruch nach Art. 40 Abs. 1 für Hilfe «während der Unmündigkeit oder bis zum Abschluss der ordentlichen Erstausbildung» sowie für Integrationszulagen und Erwerbsfreibeträge — [1], Art. 40a
  > «Auf Antrag hin kann in Härtefällen auf eine Rückerstattung ganz oder teilweise verzichtet werden.» — [1], Art. 43 Abs. 3
- **Verwandtenunterstützung:** Pflicht des Sozialdienstes, übergegangene Ansprüche geltend zu machen, notfalls Klage.
  > «Der Sozialdienst ist verpflichtet, familienrechtliche Unterhalts- und Unterstützungsansprüche geltend zu machen, die auf das unterstützende Gemeinwesen übergehen.» — [1], Art. 37 Abs. 1
  > «Kommt keine Vereinbarung zu Stande, klagt der Sozialdienst den Anspruch beim zuständigen Gericht ein.» — [1], Art. 38 Abs. 2
- **Aufenthaltsbewilligung:** kantonal genannt (Datenweitergabe an Ausländerbehörden, auch unaufgefordert).
  > Informationen dürfen insbesondere weitergegeben werden an «die zuständigen Ausländerbehörden aufgrund einer Anfrage gemäss Artikel 97 Absatz 2 des Bundesgesetzes vom 16. Dezember 2005 über die Ausländerinnen und Ausländer und über die Integration (Ausländer- und Integrationsgesetz, AIG) und unaufgefordert nach Artikel 97 Absatz 3 Buchstabe d AIG gemäss den Ausführungsbestimmungen des Bundesrates» — [1], Art. 57c Abs. 1 lit. h (Zitat jetzt ungekürzt statt «[AIG]» ⟨korrigiert 09.11.2026, Fachprüfung⟩)
  > «Für Ausländerinnen und Ausländer bleiben die Bestimmungen über den Widerruf oder die Verweigerung von Anwesenheitsbewilligungen sowie über die Aus- und Wegweisung und die Heimschaffung vorbehalten.» — [1], Art. 26 Abs. 3
  > Eingeschränkte Hilfe (Hilfe in Notlagen) u. a. für «Personen mit Kurzaufenthaltsbewilligung, ausser sie stehen in einem befristeten unterjährigen Arbeitsverhältnis und sind Staatsangehörige der Mitgliedstaaten der EU oder der EFTA» und Stellensuchende nach FZA/EFTA — [2], Art. 8l Abs. 1 lit. b, c
- **Wohnsitzwechsel:** Unterstützungswohnsitz nach ZUG (Art. 46 Abs. 1); bei Streit Vorleistung der erstangegangenen Gemeinde; Abschiebeverbot (Art. 26).
  > «Ist die örtliche Zuständigkeit streitig, hat diejenige Gemeinde, bei der die bedürftige Person das Gesuch um Unterstützung zuerst gestellt hat, die wirtschaftliche Sozialhilfe bis zur Klärung der Zuständigkeit als Vorleistung zu gewähren.» — [1], Art. 46 Abs. 2b
- **Mitwirkung/Meldepflicht:** «… Änderungen der Verhältnisse unaufgefordert und unverzüglich mitzuteilen.» — [1], Art. 28 Abs. 1
- **Kürzung:** «Die wirtschaftliche Hilfe wird bei Pflichtverletzungen oder bei selbstverschuldeter Bedürftigkeit gekürzt.» — [1], Art. 36 Abs. 1
- **Grundpfand:** «Verfügt die bedürftige Person über Grundstücke, ist mit ihr grundsätzlich ein Vertrag auf Errichtung eines Grundpfands abzuschliessen.» — [1], Art. 34 Abs. 1a; Beurkundungs- und Grundbuchkosten trägt die bedürftige Person (Abs. 1c).
- **Abtretung:** Hilfe im Hinblick auf Leistungen Dritter «wird grundsätzlich von der Abtretung von Forderungen an die Gemeinde abhängig gemacht» — [1], Art. 34a Abs. 2
- **Verrechnung:** Rückerstattungen können mit laufenden Leistungen verrechnet werden — [1], Art. 44b
- **Sozialinspektion / Strafanzeige:** Art. 50a ff. (Sozialinspektion), Art. 57b (Mitteilungspflicht an die Staatsanwaltschaft) — [1]

### Vorschau ab 01.01.2027 (beschlossen, noch nicht in Kraft)

**Quellenlage — bitte genau lesen:** Der Grosse Rat hat am 10. März 2026 die Änderung «in 2. Lesung gemäss Referendumsvorlage angenommen» [9]; Inkrafttreten 1. Januar 2027 [7]. Die **Referendumsvorlage selbst war nicht abrufbar** (der in Suchmaschinen indexierte Link rrgr-service …/10b1e1146a964238972e30dd74a61bf3-332/2/2021.gsi.30-Referendumsversion-de.pdf → 404 JSON «file not found»; die OGD-Variante liefert 200 mit einer HTML-Fehlerseite statt PDF = Soft-404). Die Zitate unten stammen deshalb aus dem amtlichen Dokument **«Anträge des Regierungsrates und der Kommission für die zweite Lesung», RRB Nr. 75/2026** [10], Spalte «Ergebnis der ersten Lesung». Zu den zitierten Artikeln stehen in den Spalten «Antrag Kommission II» und «Antrag Regierungsrat III» **keine Änderungsanträge**; die beiden Einzelanträge der 2. Lesung (Art. 53 Abs. 2 lit. b, Art. 140a Abs. 3) wurden abgelehnt [11]. Daraus folgt mit hoher Wahrscheinlichkeit, aber **nicht amtlich wortgleich belegt**, dass der Text so beschlossen ist. Vor Übernahme in die App mit dem BELEX-Text ab 01.01.2027 abgleichen. Das neue Gesetz hebt BSG 860.1 auf («Aufgehoben: 860.1» [10]); neue BSG-Nummer im Dokument noch «???.???».

- **Rückerstattung bei rechtmässigem Bezug nur noch bei Vermögensanfall** (Einkommen aus Arbeit löst keine Rückerstattung mehr aus):
  > «Personen, die wirtschaftliche Hilfe bezogen haben, sind zu deren Rückerstattung verpflichtet, sobald sich ihre wirtschaftlichen Verhältnisse aufgrund eines Vermögensanfalls wesentlich verbessert haben.» — [10], Art. 64 Abs. 1 (neu)
  > «Neu wird bei rechtmässigem Bezug von Sozialhilfe eine Rückerstattung nur noch bei einem Vermögensanfall geltend gemacht. Gerät eine ehemals unterstützte Person hingegen aufgrund von Einkommen in wesentlich verbesserte wirtschaftliche Verhältnisse, so wird sie neu nicht mehr rückerstattungspflichtig.» — [8], Vortrag RR 23.04.2025 (Entwurf, Erläuterung)
- **Vermögen/Drittleistungen, Selbstverschulden, unrechtmässiger Bezug:** Art. 65, 66 (neu) — unrechtmässig «samt Zins», Zins entfällt bei Versehen des Sozialdienstes: «Der Zins entfällt, wenn der Sozialdienst wegen eines Versehens zu viel wirtschaftliche Hilfe ausgerichtet hat.» — [10], Art. 66 Abs. 3
- **Eltern neu auch für Hilfe an ihre Kinder rückerstattungspflichtig:** Befreiung nach Art. 67 gilt für die Person, die die Hilfe «während ihrer Unmündigkeit oder bis zum Abschluss ihrer ordentlichen Erstausbildung rechtmässig bezogen hat» (Art. 67 Abs. 1 lit. a); für Konkubinatspaare: «Bei bedürftigen Konkubinatspaaren mit gemeinsamen Kindern ist jeder Elternteil zur Rückerstattung der gesamten für ihre Kinder gewährten wirtschaftlichen Hilfe verpflichtet, sofern ein Rückerstattungsgrund nach Artikel 64 bis 66 vorliegt.» — [10], Art. 68 Abs. 3. Ausnahme Alleinerziehende ohne (genügenden) Unterhaltsbeitrag: Art. 67 Abs. 1 lit. c. Erläuterung: «Ihre Eltern hingegen sind − im Falle eines Vermögensanfalls − neu auch für die an die Kinder ausgerichtete wirtschaftliche Hilfe rückerstattungspflichtig.» — [8]
- **Ehe/Partnerschaft:** Rückerstattung auch der dem Partner «während der Ehe oder Partnerschaft gewährte[n]» Hilfe — [10], Art. 68 Abs. 1
- **Erben/Begünstigte:** Art. 69 (neu) — Begünstigte aus Lebensversicherung, Sozialversicherung, Säule 3a; ausgenommen u. a. überlebende Ehegatten, Konkubinatspartner, minderjährige Kinder und Kinder in Ausbildung bis zu einer im Gesetz genannten Altersgrenze — [10], Art. 69 Abs. 1 lit. b
- **Verjährung länger:** absolute Frist im Gesetz verlängert, Vollstreckungsfrist nach Vereinbarung/Verfügung im Gesetz neu festgelegt — [10], Art. 74 Abs. 1–2; grundpfandgesichert unverjährbar (Art. 76: «durch ein vertragliches Grundpfand sichergestellt»)
- **Härtefall-Verzicht:** «Auf Antrag hin kann in Härtefällen auf eine Rückerstattung ganz oder teilweise verzichtet werden.» — [10], Art. 70 Abs. 1
- **Wohnortwechsel bei Rückerstattungsschuld aus unrechtmässigem Bezug:** neuer Sozialdienst zieht den zulässigen Betrag von der laufenden Hilfe ab und überweist ihn an den forderungsberechtigten Sozialdienst — [10], Art. 73 Abs. 1
- **Verwandtenunterstützung (neue Nummern Art. 58 f.):** «Der Sozialdienst ist verpflichtet, familienrechtliche Unterhalts- und Unterstützungsansprüche geltend zu machen, die auf das unterstützende Gemeinwesen übergehen.» — [10], Art. 58 Abs. 1; Klage nur noch, «soweit er nach dem Schweizerischen Zivilgesetzbuch (ZGB) dazu berechtigt ist» — [10], Art. 59 Abs. 2
- **Kürzung/Einstellung:** Kürzung gedeckelt (Grenze im Gesetz), Art. 62 Abs. 2 lit. c; Einstellung nur wegen Verletzung der Subsidiarität (Art. 63 Abs. 1); «Die teilweise oder vollumfängliche Einstellung der wirtschaftlichen Hilfe als Sanktion ist nicht zulässig.» — [10], Art. 63 Abs. 3
- **SKOS ab 2027:** Grundsatz neu im Gesetz: «Massgebend dafür sind grundsätzlich die Richtlinien für die Ausgestaltung und Bemessung der Sozialhilfe (SKOS-Richtlinien) der Schweizerischen Konferenz für Sozialhilfe, soweit die Sozialhilfegesetzgebung keine Abweichungen vorsieht» — [10], Art. 48 Abs. 2; Bemessung im Einzelnen durch Verordnung (Art. 48 Abs. 1). Neue SHV vom RR am 28.10.2026 beschlossen [7] — Text nicht gelesen.

### Offen / nicht gefunden
- ~~Totalrevision SHG (Inkraft voraussichtlich 01.01.2027): neuer Text nicht gelesen; alle Aussagen hier gelten für das SHG Stand 01.09.2026 und können ab 2027 überholt sein. Neues Ausführungsrecht (SHV) nicht gefunden.~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ Totalrevision: Inkrafttreten 01.01.2027 beschlossen [7]; Vorschau oben aus dem Antragsdokument zur 2. Lesung, **nicht** aus der Referendumsvorlage (nicht abrufbar) → **Neuerhebung des BE-Abschnitts vor dem 01.01.2027 bzw. sobald BELEX die neue Fassung führt.** Neue SHV (RRB 28.10.2026) und angekündigte Teilrevision SHV per 01.03.2027 [7] nicht gelesen.
- Widerspruch Asyl-Schwelle: GSI-Seite «sieben Jahre» vs. SHV Art. 8 Abs. 4 «zehn Jahren» (geltendes Recht); nicht geklärt, welche Zahl ab 2027 gilt.
- SHV-Metadaten in BELEX: «in Kraft seit 01.01.2026» bei «Beschlussdatum 07.01.2026» (Beschluss nach Inkrafttreten) — wörtlich so in der API; nicht geklärt.
- Verzeichnis der Sozialdienste [5] trägt «Mai 2023» und «Vorlage für die jährliche Umfrage (November)» — Aktualität fraglich.

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** Blocker — Totalrevision nur als «können ab 2027 überholt sein» vermerkt; Wertung «(strenger als ZH)»; Zuständigkeit ohne Burgergemeinden und Asylbereich; Aufenthaltsbewilligung ohne Art. 26 Abs. 3 SHG und SHV Art. 8l; Zitatkürzung «[AIG]» nicht als Auslassung erkennbar; SILDV fehlte in der Erlasstabelle.
- **Geändert:** Abschnitt sichtbar «gilt bis 31.12.2026»; Block «Vorschau ab 01.01.2027» mit wörtlichen Zitaten (Art. 48, 58, 59, 62–76 neu) aus RRB 75/2026, Quellenlage offen benannt; Wertung gestrichen; Burgergemeinden/Asyl/Widerspruch sieben vs. zehn Jahre; Art. 26 Abs. 3 und Art. 8l zitiert; AIG-Zitat ungekürzt; SILDV ergänzt (API geprüft). Alle neuen Zitate an eigenen Downloads geprüft (`be_shg.txt`, `be_shv.txt`, `be_kurz.html`, `be_lrv.html`, `ogd/a1f44…txt`, `ogd/8232e…pdf`); Vortrag-Zitat zusätzlich an `sh-pruef-g1/dl/be_vortrag.txt` und am Vortrag 23.04.2025 (rrgr-service, 200) geprüft.
- **Offen:** Referendumsvorlage (wortgleicher Endtext) nicht abrufbar; neue SHV 2027 nicht gelesen; neue BSG-Nummer unbekannt; BE-Abschnitt vor 01.01.2027 neu erheben.

### Quellen
1. Gesetz über die öffentliche Sozialhilfe (Sozialhilfegesetz, SHG), BSG 860.1, Stand 01.09.2026, BELEX. API https://www.belex.sites.be.ch/api/de/texts_of_law/860.1, PDF https://www.belex.sites.be.ch/api/de/versions/3446/pdf_file_with_annexes — abgerufen 09.11.2026, HTTP 200/200; Gegenprobe `/api/de/texts_of_law/999.999` → 404, `/atlantis-gibt-es-nicht-4711` → 404
2. Verordnung über die öffentliche Sozialhilfe (SHV), BSG 860.111, Stand 01.01.2026. API https://www.belex.sites.be.ch/api/de/texts_of_law/860.111, PDF https://www.belex.sites.be.ch/api/de/versions/3339/pdf_file_with_annexes — abgerufen 09.11.2026, HTTP 200/200; Gegenprobe wie [1]
3. «Sozialhilfe kurz erklärt», GSI Kanton Bern. https://www.gsi.be.ch/de/start/themen/soziales/sozialhilfe/sozialhilfe-kurz-erklaert.html — abgerufen 09.11.2026, HTTP 200; Gegenprobe https://www.gsi.be.ch/atlantis-gibt-es-nicht-4711 → 404
4. «Totalrevision Sozialhilfegesetz (SHG)», GSI. https://www.gsi.be.ch/de/start/themen/soziales/sozialhilfe/totalrevision-sozialhilfegesetz--shg-.html — abgerufen 09.11.2026, HTTP 200
5. Verzeichnis der kommunalen und regionalen Sozialdienste, GSI, Mai 2023 (PDF). https://www.gsi.be.ch/content/dam/gsi/dokumente-bilder/de/themen/soziales/sozialhilfe/sozialhilfe-kurz-erklaert/sozialwesen-sozialdienste-bernische-gemeinden.pdf — abgerufen 09.11.2026, HTTP 200; Gegenprobe `/content/dam/gsi/atlantis-gibt-es-nicht-4711.pdf` → 404
6. Sozialhilfe (Themenseite), GSI / Amt für Integration und Soziales. https://www.gsi.be.ch/de/start/themen/soziales/sozialhilfe.html — abgerufen 09.11.2026, HTTP 200, h1 «Sozialhilfe»
7. «Laufende Rechtsetzungsverfahren», GSI Generalsekretariat (Abschnitte «Totalrevision Sozialhilfegesetz (SHG)», «Totalrevision Sozialhilfeverordnung (SHV)», «Teilrevision SHV»). https://www.gsi.be.ch/de/start/ueber-uns/generalsekretariat/rechtsabteilung/laufende-rechtsetzungsverfahren.html — abgerufen 09.11.2026, HTTP 200; Zitat: «Der Grosse Rat hat am 10. März 2026 das totalrevidierte Sozialhilfegesetz (SHG) beschlossen. Die Referendumsfrist ist am 1. Juli 2026 abgelaufen. Der Regierungsrat hat am 28. Oktober 2026 das Inkrafttreten des Gesetzes auf den 1. Januar 2027 beschlossen.»; Gegenprobe Domain wie [3]
8. Vortrag des Regierungsrates zum Sozialhilfegesetz (SHG), 23. April 2025, Geschäftsnummer 2021.GSI.30 (Entwurfsstand). https://www.rrgr-service.apps.be.ch/api/gr/documents/document/b1089386a2ce45e89a0fd373d297f3da-332/1/Vortrag-23.04.2025-de.pdf — abgerufen 09.11.2026, HTTP 200 application/pdf; Gegenprobe `…/document/00000000000000000000000000000000-332/2/atlantis.pdf` → 404. Zitat Ziff. 3.4 am Prüfer-Download `sh-pruef-g1/dl/be_vortrag.txt` (Z. 620–623) wortgleich geprüft.
9. Grossratsbeschluss vom 10. März 2026, Geschäftsnummer 2021.GSI.30 (1 S.). https://ogd.parl.apps.be.ch/pdf-upload/8232e789989d4451b33188f20665c58f-332.pdf — abgerufen 09.11.2026, HTTP 200 application/pdf; Gegenprobe `…/pdf-upload/00000000000000000000000000000000-332.pdf` → 404 (aber: nicht vorhandene echte IDs liefern teils 200 mit HTML-Fehlerseite, Inhalt deshalb stets geprüft). Zitat: «Die Änderung des Sozialhilfegesetzes (SHG) (Änderung) wird in 2. Lesung gemäss Referendumsvorlage angenommen.»
10. «Anträge des Regierungsrates und der Kommission für die zweite Lesung», RRB Nr. 75/2026, 2021.GSI.30 (195 S., Synopse). https://ogd.parl.apps.be.ch/pdf-upload/a1f44334576a465ebe0bbc5fafbc3799-332.pdf — abgerufen 09.11.2026, HTTP 200 application/pdf; Gegenprobe wie [9]
11. «Antrag Gesetzgebung», Version 2, GSI 57, 2. März 2026 (Einzelanträge 2. Lesung, beide «-» = abgelehnt). https://ogd.parl.apps.be.ch/pdf-upload/e1acd551afdc49c287cf2bf5d855c494-332.pdf — abgerufen 09.11.2026, HTTP 200

---

## LU — Luzern

**Beurteilung:** belegbar
**Zuständig (kurz):** Einwohnergemeinde des Unterstützungswohnsitzes (nach ZUG); jede Gemeinde führt einen Sozialdienst, Übertragung an Gemeindeverband/Dritte möglich — SHG §§ 15–17
**Asylbereich:** eigene Regeln/Stelle — nicht Gegenstand dieses Blatts: «Der Kanton gewährt Asylsuchenden, in der Schweiz vorläufig aufgenommenen Personen und Schutzbedürftigen persönliche und wirtschaftliche Sozialhilfe, soweit nicht der Bund zuständig ist.» — SHG § 53 Abs. 1; Flüchtlinge § 54; Nothilfegesuche beim Amt für Migration, Ausrichtung durch die Dienststelle Asyl- und Flüchtlingswesen (Handbuch Kap. A.5) ⟨korrigiert 09.11.2026, Fachprüfung⟩
**Antrag (kurz):** Gesuch beim Sozialdienst des Unterstützungswohnsitzes, sonst der Aufenthaltsgemeinde (SHV § 4 Abs. 2); mündlich oder schriftlich (DISG-Seite); kein kantonales Verzeichnis — Verweis auf Telefonverzeichnis/Gemeindewebseite
**SKOS (kurz):** «wegleitend», Regierungsrat kann abweichen; zahlreiche benannte Abweichungen in der SHV — SHG § 31 Abs. 1, SHV §§ 8–14
**Aufsicht:** Gesundheits- und Sozialdepartement (SHG § 18 Abs. 1); Koordination Dienststelle Soziales und Gesellschaft (DISG) — https://disg.lu.ch/themen/Existenzsicherung_Sozialhilfe
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Sozialhilfegesetz (SHG) vom 16. März 2015 | SRL Nr. 892 | API: «Aktuelle Version in Kraft seit: 01.01.2024 (Beschlussdatum: 24.10.2022)»; PDF «(Stand 1. Januar 2024)» | https://srl.lu.ch/app/de/texts_of_law/892 | API `/api/de/texts_of_law/892` → 200; PDF `/api/de/versions/4151/pdf_file_with_annexes` → 200; Gegenprobe `/api/de/texts_of_law/999.999` → 404, `/atlantis-gibt-es-nicht-4711` → 404 |
| Sozialhilfeverordnung (SHV) vom 24. November 2015 | SRL Nr. 892a | API: «Aktuelle Version in Kraft seit: 01.01.2024 (Beschlussdatum: 10.01.2023)»; PDF «(Stand 1. Januar 2024)» | https://srl.lu.ch/app/de/texts_of_law/892a | API → 200; PDF `/api/de/versions/4152/pdf_file_with_annexes` → 200 |

Beide `abrogated: false`, keine künftigen Versionen. (892b = Kantonale Asylverordnung, nicht Teil dieser Erhebung.)

### Zuständigkeit und Antrag
> «Die Sozialhilfe ist Sache der Einwohnergemeinde.» — [1], § 15 Abs. 1

> «Zuständig für die Sozialhilfe ist die Einwohnergemeinde, in der die hilfebedürftige Person ihren Unterstützungswohnsitz hat. Der Unterstützungswohnsitz richtet sich nach den Bestimmungen des eidgenössischen Zuständigkeitsgesetzes.» — [1], § 16 Abs. 1

> «Jede Einwohnergemeinde führt einen Sozialdienst. […] Er ist insbesondere Anlauf-, Abklärungs- und Beratungsstelle für hilfebedürftige Personen.» — [1], § 17 Abs. 2

> «Die hilfebedürftige Person hat das Gesuch um persönliche oder wirtschaftliche Sozialhilfe beim Sozialdienst ihres Unterstützungswohnsitzes zu stellen.» — [2], § 4 Abs. 2

> «Die Adresse und die Telefonnummer des Gemeindesozialdienstes können Sie dem Telefonverzeichnis entnehmen oder auf der Internetseite der Gemeinde finden.» — [3]

### SKOS-Richtlinien
> «Die wirtschaftliche Sozialhilfe deckt das soziale Existenzminimum ab. Für dessen Bemessung sind die Empfehlungen der Schweizerischen Konferenz für Sozialhilfe (Skos-Richtlinien) wegleitend. Der Regierungsrat kann durch Verordnung Abweichungen von den Skos-Richtlinien beschliessen.» — [1], § 31 Abs. 1

Benannte Abweichungen (ohne Beträge/Prozente), je «In Abweichung von den Skos-Richtlinien» — [2]:
- § 8: reduzierter Grundbedarf in Zweck-Wohngemeinschaften
- § 9: reduzierter Grundbedarf für Personen, die in der Schweiz noch nicht eine im Erlass genannte Dauer gearbeitet haben (mit Ausnahmen, Abs. 2)
- § 10: eigene Bandbreite Integrationszulage
- § 11: Obergrenze Einkommensfreibetrag («In Konkretisierung»)
- § 14: eigene Kürzungsspanne und Befristung; Aufhebung von Kürzungen erst nach Ablauf der Frist
- § 12: Obergrenze der kumulierten Integrationszulagen und Einkommensfreibeträge je Haushalt (Grenze im Erlass; ohne Formel «In Abweichung») ⟨korrigiert 09.11.2026, Fachprüfung⟩
- § 13: Vermögensverzicht der letzten Jahre vor dem Gesuch wird als Einnahme angerechnet (Frist und Anrechnung im Erlass); Abs. 5: «Vorbehalten bleibt das Recht auf Hilfe in Notlagen gemäss Artikel 12 der Bundesverfassung» ⟨korrigiert 09.11.2026, Fachprüfung⟩

Verweis ist **nicht datiert** (kein Fassungsdatum genannt); ob er deshalb dynamisch wirkt, ist **nicht belegt** und wird hier nicht behauptet. Luzerner Handbuch zur Sozialhilfe 2026, Version 15 (DISG) [4]: Grundlage einheitlicher Praxis, kein Erlass.

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** bei gebesserter finanzieller Lage und Zumutbarkeit; bevorschusste Drittleistungen; unrechtmässig mit Zins (Satz im Gesetz); Nachlass und Lebensversicherung; Verwirkung: Fristen im Gesetz; Ausnahmen für Kinder/Jugendliche in Ausbildung und Elternteil rund um Geburt.
  > «Rechtmässig bezogene wirtschaftliche Sozialhilfe ist der Einwohnergemeinde, die sie gewährt hat, so weit zurückzuerstatten, als sich die finanzielle Lage der hilfebedürftigen Person gebessert hat und ihr die Rückerstattung zumutbar ist.» — [1], § 38 Abs. 1
  > «Erben, durch ein Vermächtnis bedachte Personen sowie Begünstigte aus einer Lebensversicherung sind dem anspruchsberechtigten Gemeinwesen so weit zur Rückerstattung […] verpflichtet, als sie aus dem Nachlass oder aus der Lebensversicherung bereichert sind.» — [1], § 40 Abs. 1
  > «Der Anspruch auf Rückerstattung der bezogenen wirtschaftlichen Sozialhilfe, der durch ein Grundpfand sichergestellt ist, unterliegt weder der Verwirkung noch der Verjährung.» — [1], § 42 Abs. 3
- **Verwandtenunterstützung:** Gesetz verweist nur auf ZGB; Handbuch: nur bei Eltern/Kindern mit überdurchschnittlichem Einkommen/Vermögen prüfen, in erster Linie vermitteln.
  > «Die Verwandtenunterstützungspflicht richtet sich nach den Artikeln 328 und 329 ZGB.» — [1], § 37 Abs. 1
  > «Sie hat zwar zu prüfen, ob hilfspflichtige Verwandte vorhanden sind, soll aber nicht einfach Verwandtenunterstützung fordern, sondern in erster Linie vermitteln.» — [4], D.4.3 lit. a
- **Aufenthaltsbewilligung:** in den kantonalen Quellen keine Meldepflicht an das Amt für Migration genannt; nur Vorbehalt:
  > «Für Ausländerinnen und Ausländer sind die Bestimmungen über den Widerruf von Anwesenheitsbewilligungen sowie über die Aus- und Wegweisung und die Heimschaffung vorbehalten.» — [1], § 13 Abs. 2
- **Wohnsitzwechsel:** innerkantonal bleibt die bisherige Gemeinde für eine im Gesetz genannte Übergangszeit zuständig; bei Streit Vorleistung der erstangegangenen Gemeinde.
  > «Bei einem Wechsel des Unterstützungswohnsitzes innerhalb des Kantons bleibt während des ersten Monats nach dem Wegzug die bisherige Einwohnergemeinde für die wirtschaftliche Sozialhilfe zuständig.» — [1], § 16 Abs. 1bis
- **Hilfe ausserhalb des Wohnsitzes** (eigener Punkt, vorher unter Wohnsitzwechsel ⟨korrigiert 09.11.2026, Fachprüfung⟩): nur Nothilfe.
  > «Schweizer Bürgerinnen und Bürgern sowie Ausländerinnen und Ausländern, die ausserhalb ihres Unterstützungswohnsitzes auf sofortige Hilfe angewiesen sind, wird nur Nothilfe gewährt.» — [1], § 31 Abs. 2
- **Mitwirkung/Vollmacht:** Pflicht zur vollständigen Auskunft und zur Ermächtigung Dritter (Arbeitgeber, Ärzte, Versicherungen) — [1], § 7 Abs. 1–2
- **Kürzung/Einstellung:** [1], § 30 Abs. 1; Sperre bei Elternteil rund um Geburt, § 30 Abs. 2
- **Vermögensverzicht:** verzichtetes Vermögen wird als Einkommen angerechnet — [1], § 32
- **Abtretung:** [1], § 29 Abs. 3; Unterhaltsanspruch des Kindes geht über (§ 27 Abs. 3)

### Offen / nicht gefunden
- SHG/SHV in der Sammlung «Stand 1. Januar 2024», die DISG-Seite meldet aber «Die Vermögensfreibeträge wurden per 1. Januar 2026 angepasst» [3] — ob über eine SHV-Änderung (in SRL nicht als neue Version sichtbar), über den undatierten SKOS-Verweis in SHG § 31 Abs. 1 oder über Praxis/Handbuch: **nicht geklärt**.
- Kein kantonales Verzeichnis der Sozialdienste.
- Meldepflicht Sozialhilfe → Amt für Migration: im Handbuch (Volltext, AIG/VZAE gesucht) nicht gefunden.

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** Abweichungsliste unvollständig (§ 12, § 13 SHV); Nothilfe ausserhalb des Wohnsitzes falsch unter «Wohnsitzwechsel»; Vermögensfreibeträge 2026 nicht als «nicht geklärt» gefasst; Asylbereich fehlte.
- **Geändert:** § 12 und § 13 (mit wörtlichem Abs. 5; der Prüfer hatte Abs. 5 als «keine Anrechnung» umschrieben — der Wortlaut ist ein Vorbehalt des Rechts auf Hilfe in Notlagen, so übernommen) ergänzt; § 31 Abs. 2 eigener Punkt; SKOS-Verweis ausdrücklich nicht als dynamisch behauptet; Zeile Asylbereich (§ 53 Abs. 1 an `lu_shg.txt` geprüft).
- **Offen:** Herkunft der Anpassung Vermögensfreibeträge 2026.

### Quellen
1. Sozialhilfegesetz (SHG), SRL Nr. 892, Stand 1. Januar 2024. API https://srl.lu.ch/api/de/texts_of_law/892, PDF https://srl.lu.ch/api/de/versions/4151/pdf_file_with_annexes — abgerufen 09.11.2026, HTTP 200/200; Gegenprobe `/api/de/texts_of_law/999.999` → 404, `/atlantis-gibt-es-nicht-4711` → 404
2. Sozialhilfeverordnung (SHV), SRL Nr. 892a, Stand 1. Januar 2024. API https://srl.lu.ch/api/de/texts_of_law/892a, PDF https://srl.lu.ch/api/de/versions/4152/pdf_file_with_annexes — abgerufen 09.11.2026, HTTP 200/200
3. «Fragen von Privatpersonen» und «Existenzsicherung – Sozialhilfe», DISG Kanton Luzern. https://disg.lu.ch/themen/Existenzsicherung_Sozialhilfe/sozialhilfe_fragen_privat und https://disg.lu.ch/themen/sozialhilfe (→ Titel «Existenzsicherung - Sozialhilfe») — abgerufen 09.11.2026, HTTP 200; Gegenprobe https://disg.lu.ch/atlantis-gibt-es-nicht-4711 → 404
4. Luzerner Handbuch zur Sozialhilfe 2026, Version 15 (PDF), DISG. https://disg.lu.ch/-/media/DISG/Dokumente/Themen/Sozialhilfe/Luzerner_Handbuch_Sozialhilfe/2026_Luzerner_Handbuch_Sozialhilfe.pdf?rev=5b824fbc0aa845bca8a9dd5543f06d75 — abgerufen 09.11.2026, HTTP 200

---

## UR — Uri

**Beurteilung:** teilweise
**Zuständig (kurz):** Einwohnergemeinde des Unterstützungswohnsitzes; Sozialhilfebehörde (Sozialrat); professioneller Sozialdienst — praktisch zwei: Soziale Dienste Uri Nord und Sozialdienst Uri Süd — SHG Art. 4, 5, 8–10a
**Antrag (kurz):** «bei der Sozialhilfebehörde darum nachzusuchen» (SHG Art. 28 Abs. 5); Kantonsseite nennt beide Sozialdienste mit Gemeindezuordnung
**Asylbereich:** eigene Regeln/Stelle — nicht Gegenstand dieses Blatts: die zuständige Direktion hat «Asylsuchende sowie Flüchtlinge ohne Niederlassungsbewilligung im Rahmen des Bundesrechts zu unterstützen» (SHG Art. 12 Abs. 2 lit. c); «Für den Asylbereich liegt die Verantwortung weiterhin beim Kanton (Sozialdienst Asyl).» [3] ⟨korrigiert 09.11.2026, Fachprüfung⟩
**SKOS (kurz):** nur «orientiert sich» (Regierungsrat erlässt Richtlinien) — SHG Art. 28 Abs. 1; die Richtlinien des Regierungsrats selbst **nicht gefunden** → Verbindlichkeit/Abweichungen nicht belegt
**Aufsicht:** Gesundheits-, Sozial- und Umweltdirektion (SHG Art. 12), Amt für Soziales; Oberaufsicht Regierungsrat (Art. 11) — https://www.ur.ch/aemter/842
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die öffentliche Sozialhilfe (Sozialhilfegesetz) vom 28. September 1997 | RB 20.3421 | API: «Aktuelle Version in Kraft seit: 11.11.2023 (Beschlussdatum: 22.10.2023)»; PDF «(Stand 11. November 2023)» | https://rechtsbuch.ur.ch/app/de/texts_of_law/20.3421 | API `/api/de/texts_of_law/20.3421` → 200; PDF `/api/de/versions/994/pdf_file_with_annexes` → 200; Gegenprobe `/api/de/texts_of_law/999.999` → 404, `/atlantis-gibt-es-nicht-4711` → 404 |
| Verordnung zum SHG | — | **keine gefunden** | — | API-Abfrage aller Nummern 20.3400–20.3460: nur 20.3421 (SHG), 20.3425 (Baubeiträge), 20.3447, 20.3449, 20.3455, 20.3456 (andere Gegenstände) |

**Revision:** Gesamtrevision SHG am 18. Mai 2025 vom Volk abgelehnt; neue Vorlage, Bericht und Antrag des Regierungsrats an den Landrat vom 19. Mai 2026 (Nr. 2026-262) [3] — u. a. SKOS-Verbindlichkeit neu im Gesetz. Stand der Beratung im Landrat nicht geprüft; https://www.ur.ch/abstimmungen/vorlagen (200) führt am 09.11.2026 keine Sozialhilfe-Vorlage nach dem 18.05.2025 → bis Ende November 2026 keine Volksabstimmung angesetzt; Abstimmung 2027 möglich, nachführen. ⟨korrigiert 09.11.2026, Fachprüfung⟩

### Zuständigkeit und Antrag
> «Zuständig, öffentliche Sozialhilfe zu leisten, ist jene Einwohnergemeinde, in der die hilfesuchende Person ihren Unterstützungswohnsitz hat. Dieser und die Kostenersatzpflicht bestimmen sich sinngemäss nach den Regeln des Bundesgesetzes über die Zuständigkeit für die Unterstützung Bedürftiger (SR 851.1), soweit dieses Gesetz nichts anderes bestimmt.» — [1], Art. 5 Abs. 1

> «Sie führt, allein oder zusammen mit anderen Gemeinden, einen eigenen, professionellen Sozialdienst oder überträgt diese Aufgaben einem privaten Sozialdienst.» — [1], Art. 9 Abs. 2

> «Wer wirtschaftliche Hilfe beansprucht, hat bei der Sozialhilfebehörde darum nachzusuchen.» — [1], Art. 28 Abs. 5

> «Die Gemeinden führen je einen von zwei Sozialdiensten (Sozialdienst Uri Süd und Soziale Dienste Uri Nord).» — [3], Zusammenfassung

Kantonsseite [2]: Soziale Dienste Uri Nord (Altdorf) für Altdorf, Attinghausen, Flüelen, Isenthal, Seedorf, Seelisberg, Sisikon; Sozialdienst Uri Süd (Erstfeld) für Andermatt, Bürglen, Erstfeld, Göschenen, Gurtnellen, Hospental, Realp, Schattdorf, Silenen, Spiringen, Unterschächen, Wassen (Zuordnung aus der HTML-Tabellenstruktur).

### SKOS-Richtlinien
> «Die wirtschaftliche Hilfe gewährleistet den notwendigen Lebensunterhalt. Für dessen Bemessung erlässt der Regierungsrat nach Anhören der Sozialhilfebehörden Richtlinien. Er orientiert sich dabei an den Empfehlungen der Schweizerischen Konferenz für Sozialhilfe.» — [1], Art. 28 Abs. 1

> «Für die Bemessung der wirtschaftlichen Hilfe stützt sich der Kanton Uri auf die SKOS-Richtlinien.» — [4] (Seite «Sozialhilfehandbuch»)

> «Neu wird die Verbindlichkeit der SKOS-Richtlinien im Gesetz festgehalten. Vorbehalten sind Abweichungen im Gesetz oder in einer Verordnung. Die SKOS-Richtlinien wirken subsidiär.» — [3] (Revisionsvorlage, nicht geltendes Recht)

Status: **nicht belegt**, ob und mit welchen Abweichungen die SKOS heute verbindlich sind — die Richtlinien des Regierungsrats nach Art. 28 Abs. 1 wurden weder im Rechtsbuch noch auf ur.ch gefunden.

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** unrechtmässig immer; rechtmässig bei gebesserten Verhältnissen und aus Nachlass; Erlöschen: Fristen im Gesetz (gegenüber Erben länger), grundpfandgesichert unverjährbar; Zins nur bei unrechtmässigem Bezug.
  > «Rechtmässig bezogene wirtschaftliche Hilfe ist zurückzuerstatten, wenn: a) sich die finanziellen Verhältnisse der unterstützten Person so gebessert haben, dass ihr die Rückerstattung zugemutet werden kann b) die unterstützte Person beim Tod Vermögen hinterlässt.» — [1], Art. 34 Abs. 2
  > «Grundpfandrechtlich gesicherte Rückerstattungsansprüche unterliegen keiner Verjährung.» — [1], Art. 35 Abs. 4
  > Keine Ausnahme für Bezug als Minderjährige/in Ausbildung im geltenden SHG gefunden (laut Vorlage [3] erst neu vorgesehen).
- **Verwandtenunterstützung:** «Die im Schweizerischen Zivilgesetzbuch vorgesehene Unterstützungspflicht der Verwandten der hilfesuchenden Person ist bei der Gewährung wirtschaftlicher Hilfe angemessen zu berücksichtigen.» — [1], Art. 33 Abs. 1; Klagerecht der Sozialhilfebehörde (Abs. 3).
- **Aufenthaltsbewilligung:** in den kantonalen Quellen keine Meldepflicht genannt; nur Vorbehalt:
  > «Für Ausländerinnen und Ausländer bleiben die Bestimmungen des Fremdenpolizeirechts über den Widerruf von Anwesenheitsbewilligungen sowie über eine Aus- und Wegweisung und die Heimschaffung vorbehalten.» — [1], Art. 7 Abs. 2
- **Wohnsitzwechsel:** Unterstützungswohnsitz wechselt sofort; Sonderregel für Umzug ab einem im Gesetz genannten Alter (Kostenersatz der bisherigen Gemeinde).
  > «Der Unterstützungswohnsitz ändert sich unmittelbar mit dem Wohnsitzwechsel.» — [1], Art. 5 Abs. 2
  > «Die bisherige Unterstützungsgemeinde wird der neuen gegenüber kostenersatzpflichtig, wenn eine hilfesuchende Person ihren Wohnsitz nach dem 60. Altersjahr wechselt.» — [1], Art. 5 Abs. 3 (laut Vorlage [3] zur Streichung vorgesehen)
- **Mitwirkung:** Auskunft und Einsicht «namentlich in die Steuerakten»; Änderungen «unverzüglich mitzuteilen» — [1], Art. 30
- **Sanktionen:** Verweigerung, Kürzung oder Einstellung nach vorgängiger Mahnung — [1], Art. 31
- **Grundpfand:** Rückerstattungsverpflichtung bei nicht realisierbarem Vermögen, «grundpfandrechtlich sichergestellt» möglich — [1], Art. 29
- **Abtretung:** Hilfe kann von Abtretung von Ansprüchen gegen Dritte abhängig gemacht werden — [1], Art. 32

### Offen / nicht gefunden
- Richtlinien des Regierungsrats zur Bemessung (SHG Art. 28 Abs. 1): nicht gefunden (Rechtsbuch-API 20.3400–20.3460 durchsucht, ur.ch-Amtsseite ohne Publikationsliste ohne JS).
- Verbindliches kantonales Sozialhilfehandbuch: ur.ch verweist nur auf rl.skos.ch («Handbuch … auf der Plattform der SKOS») — Inhalt nicht geprüft, SKOS-Plattform zählt nicht als Beleg.
- Stand der Revisionsvorlage 2026 im Landrat: nicht geprüft (keine Abstimmung bis Ende November 2026 angesetzt).
- Kommunale Richtlinien: Die Sozialhilfebehörde legt «die Grundsatzentscheide und Richtlinien der Sozialhilfe» fest, «soweit diese nicht bereits gesetzlich oder durch Richtlinien des Kantons vorgegeben sind» (SHG Art. 10 Abs. 1 lit. e); der Sozialdienst entscheidet «im Rahmen der gesetzlichen Vorgaben und der Richtlinien der Sozialhilfebehörden» (Art. 10a Abs. 1 lit. f). Ob es solche kommunalen Richtlinien (Nord/Süd) gibt: nicht geprüft. (Der Prüfer nannte «Art. 10a lit. e»; am Text belegt sind Art. 10 lit. e und Art. 10a lit. f.) ⟨korrigiert 09.11.2026, Fachprüfung⟩

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** Asylbereich fehlte; «hängig» ohne Beleg zum Abstimmungskalender; mögliche kommunale Richtlinien nicht erwähnt.
- **Geändert:** Zeile Asylbereich (Art. 12 Abs. 2 lit. c und Vorlage 2026-262 an `ur_shg.txt`/`ur_la2025.txt` geprüft); Abstimmungsseite selbst abgerufen (200, keine Sozialhilfe-Vorlage nach 18.05.2025); kommunale Richtlinien als offen mit korrigierter Fundstelle (Art. 10 lit. e / 10a lit. f).
- **Offen:** RR-Richtlinien nach Art. 28 Abs. 1; kommunale Richtlinien; Ausgang der Revision.

### Quellen
1. Gesetz über die öffentliche Sozialhilfe (Sozialhilfegesetz), RB 20.3421, Stand 11. November 2023. API https://rechtsbuch.ur.ch/api/de/texts_of_law/20.3421, PDF https://rechtsbuch.ur.ch/api/de/versions/994/pdf_file_with_annexes — abgerufen 09.11.2026, HTTP 200/200; Gegenprobe `/api/de/texts_of_law/999.999` → 404, `/atlantis-gibt-es-nicht-4711` → 404
2. «wirtschaftliche und persönliche Sozialhilfe», Kanton Uri (Amt für Soziales). https://www.ur.ch/dienstleistungen/8953 — abgerufen 09.11.2026, HTTP 200; Gegenprobe https://www.ur.ch/atlantis-gibt-es-nicht-4711 → 404
3. Bericht und Antrag des Regierungsrats an den Landrat zur Revision des Sozialhilfegesetzes, 19. Mai 2026, Nr. 2026-262 (PDF). https://www.ur.ch/_docn/449716/LA.2025-0454_I._Bericht_und_Antrag_des_Regierungsrats.pdf — abgerufen 09.11.2026, HTTP 200; Gegenprobe `/_docn/999999999/atlantis.pdf` → 404 (gefunden über Websuche, Inhalt selbst abgerufen)
4. «Sozialhilfehandbuch», Kanton Uri. https://www.ur.ch/dienstleistungen/3659 — abgerufen 09.11.2026, HTTP 200
5. Amt für Soziales, Kanton Uri. https://www.ur.ch/aemter/842 (aufgerufen als /_rte/amt/842) — abgerufen 09.11.2026, HTTP 200, Titel «Kanton Uri - Amt für Soziales»
6. Abstimmungsvorlagen, Kanton Uri. https://www.ur.ch/abstimmungen/vorlagen — abgerufen 09.11.2026, HTTP 200; Gegenprobe Domain wie [2]

---

## SZ — Schwyz

**Beurteilung:** belegbar, Stand nur durch Fusszeile belegt ⟨korrigiert 09.11.2026, Fachprüfung⟩
**Zuständig (kurz):** Gemeinden, grundsätzlich Wohnsitzgemeinde; Fürsorgebehörde der Gemeinde; Sozialdienste einzelner/mehrerer Gemeinden oder beauftragte Institutionen — ShG §§ 6–12
**Antrag (kurz):** an die Gemeinde (Fürsorgebehörde) bzw. deren Sozialdienst; kantonale Seite mit Gemeindeauswahl, Gesuchsformular und Checkliste; amtliches «Sozialverzeichnis» mit Rubrik «Sozialberatung / Sozialhilfe / finanzielle Hilfen» [7] ⟨korrigiert 09.11.2026, Fachprüfung⟩
**Asylbereich:** eigene Regeln/Stelle — nicht Gegenstand dieses Blatts: ShG/ShV enthalten keine Asylbestimmungen; in der Gesetzsammlung steht «111.200 Kantonales Gesetz zum Bundesgesetz über die Ausländerinnen und Ausländer und zum Asylgesetz (Migrationsgesetz, MigG)» [6] (Text nicht geöffnet) ⟨korrigiert 09.11.2026, Fachprüfung⟩
**SKOS (kurz):** «wegleitend», soweit Gesetz/Verordnung nichts anderes vorsehen; Regierungsrat kann ergänzen/abweichen; benannte Abweichung bei Sanktionen — ShV § 4 Abs. 2–3, § 5 Abs. 2
**Aufsicht:** Departement des Innern, Amt für Gesundheit und Soziales (ShG § 10); Oberaufsicht Regierungsrat (§ 9) — https://www.sz.ch/behoerden/verwaltung/departement-des-innern/amt-fuer-gesundheit-und-soziales/soziales.html/8756-8758-8802-9316-9317-12842
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die Sozialhilfe (ShG) vom 18. Mai 1983 | SRSZ 380.100 | PDF-Fusszeile «SRSZ 1.2.2022» | https://www.sz.ch/public/upload/assets/3688/380_100.pdf?fp=4 | PDF 200 (application/pdf), verlinkt von der systematischen Gesetzsammlung (Eintrag «380.100 Gesetz über die Sozialhilfe (ShG), vom 18. Mai 1983»); Gegenprobe `/public/upload/assets/99999999/atlantis.pdf` → 404 |
| Vollziehungsverordnung zum Gesetz über die Sozialhilfe (Sozialhilfeverordnung, ShV) vom 30. Oktober 1984 | SRSZ 380.111 | PDF-Fusszeile «SRSZ 1.2.2018» | https://www.sz.ch/public/upload/assets/32455/380_111.pdf?fp=4 | PDF 200; Gegenprobe wie oben |

SZ hat keine LexWork-API (srsz.ch / gesetzessammlung.sz.ch lösen nicht auf; sz.ch `/api/de/texts_of_law/380.100` → 404). Bestand über die Sammlungsseite https://www.sz.ch/kanton/gesetze/systematische-gesetzsammlung.html/8756-8757-10021-11689 (200) belegt. Die vermutete Nummer «380.1» heisst korrekt **380.100**.

### Zuständigkeit und Antrag
> «Die Sozialhilfe wird primär von den Gemeinden geleistet. Zuständig ist grundsätzlich die Wohnsitzgemeinde der hilfesuchenden Person.» — [1], § 6 Abs. 1–2

> Fürsorgebehörde: «Aufsicht über die Sozialhilfe in der Gemeinde sowie Bezeichnung der Stelle, welche Sozialhilfe gewährt; […] Gewährung der wirtschaftlichen Hilfe» — [1], § 8 lit. a, c

> «Benötigt die hilfesuchende Person wirtschaftliche Hilfe, so ist der Fürsorgebehörde Antrag zu stellen.» — [1], § 27 Abs. 3

> «Wenden Sie sich an Ihre Gemeinde (Fürsorgebehörde), wenn Sie Hilfe benötigen oder eine Bestätigung über den Erhalt von Sozialhilfe wünschen.» — [3]

> «Zuständig für die persönliche und wirtschaftliche Hilfe jeder Art ist der Sozialdienst Ihrer Wohnsitzgemeinde.» — [4] (Merkblatt 2012)

### SKOS-Richtlinien
> «Die Richtlinien für die Ausgestaltung und Bemessung der Sozialhilfe der Schweizerischen Konferenz für Sozialhilfe (SKOS-Richtlinien) sind für den Vollzug der individuellen Sozialhilfe wegleitend, soweit das Gesetz und diese Verordnung keine andere Regelung vorsehen.» — [2], § 4 Abs. 2 («Anwendbares Recht»)

> «Der Regierungsrat kann ergänzende Vorschriften zur Anwendung der SKOS-Richtlinien erlassen oder Ausnahmen vorsehen.» — [2], § 4 Abs. 3

> «Die Leistungskürzungen als Sanktion nach SKOS-Richtlinien können um zusätzliche zehn Prozent erhöht werden.» — [2], § 5 Abs. 2 («Art und Mass»)

Hinweis Nummerierung: pdftotext verschmilzt Paragraf und Fussnotenziffer («§46», «§58»); aus der fortlaufenden Folge §1–§8 ergibt sich § 4 (Fn. 6) bzw. § 5 (Fn. 8).
Verweis **nicht datiert**. Kantonsseite verlinkt «Handbuch des Kantons Schwyz» auf rl.skos.ch — nicht geprüft, nicht als Beleg gewertet.

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** bei unwahren Angaben oder «finanziell in besonders günstige Verhältnisse»; Vorschüsse auf Versicherungsleistungen; Erben bis zur Erbschaft; Erlöschen: Frist im Gesetz; unverzinslich.
  > «Wer wirtschaftliche Hilfe in Anspruch genommen hat, ist zur Rückerstattung verpflichtet, wenn er durch unwahre Angaben Leistungen erwirkt hat, oder wenn er finanziell in besonders günstige Verhältnisse gelangt ist.» — [1], § 25 Abs. 1
  > «Der Rückerstattungsanspruch erstreckt sich auf die Leistungen, die die hilfesuchende Person für sich selbst, ihren Ehegatten während der Ehe und ihre Kinder während ihrer Minderjährigkeit erhalten hat.» — [1], § 25 Abs. 2 (ergänzt ⟨korrigiert 09.11.2026, Fachprüfung⟩)
  > «Wirtschaftliche Hilfe, die jemand für sich während seiner Minderjährigkeit oder bis zum Abschluss einer ordentlichen Ausbildung genossen hat, muss der Empfänger nicht zurückerstatten.» — [1], § 25 Abs. 4
  > «Der Rückerstattungsanspruch ist unverzinslich und erlischt nach 20 Jahren, vom Zeitpunkt der letzten bezogenen Hilfe angerechnet.» — [1], § 25 Abs. 5
- **Verwandtenunterstützung:** «Familienrechtliche Unterhalts- und Unterstützungspflichten gehen der wirtschaftlichen Hilfe vor. Sie sind nach den Vorschriften des Schweizerischen Zivilgesetzbuches geltend zu machen.» — [1], § 24 Abs. 1–2; geltend gemacht von der Behörde des kostentragenden Gemeinwesens (§ 26).
- **Aufenthaltsbewilligung:** in den kantonalen Quellen nicht genannt (ShG, ShV, Merkblatt, Gesuchsformular durchsucht).
- **Wohnsitzwechsel:** Unterstützungswohnsitz i. d. R. = zivilrechtlicher Wohnsitz; Bundesrecht (ZUG) auch innerkantonal (ShG § 18 Abs. 2; ShV § 4 Abs. 1: «… sind die Bestimmungen des Bundesgesetzes vom 24. Juni 1977 über die Zuständigkeit für die Unterstützung Bedürftiger (ZUG) sinngemäss auch im innerkantonalen Verhältnis anwendbar.» ⟨korrigiert 09.11.2026, Fachprüfung⟩); Wohngemeinde zahlungspflichtig.
  > «Der Unterstützungswohnsitz fällt in der Regel mit dem zivilrechtlichen Wohnsitz im Sinne von Art. 23 ff. ZGB zusammen.» — [1], § 18 Abs. 1
- **Kürzung/Einstellung:** «Verweigert die hilfesuchende Person trotz vorgängiger Mahnung die ihr zumutbare Mitwirkung […], kann die Fürsorgebehörde die wirtschaftliche Hilfe kürzen oder einstellen.» — [1], § 26a
- **Kostengutsprache:** Für Leistungen Dritter haftet die Fürsorgebehörde nur bei vorgängiger oder rechtzeitiger Gutsprache — [1], § 17 Abs. 2; aber: «In dringenden Fällen, namentlich bei plötzlich eintretender Krankheit oder bei Unglücksfällen, darf die Gutsprache nicht verweigert werden, wenn die Hilfeleistung nach den Umständen sofort gewährt werden musste …» — [1], § 17 Abs. 3 (ergänzt ⟨korrigiert 09.11.2026, Fachprüfung⟩)
- **Meldepflicht:** ~~Änderungen «unaufgefordert und unverzüglich zu melden» (Gesuchsformular mit Verweis auf § 10 ShV) — [5]~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ Primärquelle: «Wer um wirtschaftliche Hilfe nachsucht oder sie erhält, hat über seine Verhältnisse wahrheitsgetreu Auskunft zu geben, Einsicht in seine Unterlagen zu gewähren und Änderungen in seinen Verhältnissen umgehend zu melden.» — [2], § 10 Abs. 1
- **Abtretung/Pfändung (Schutz der Hilfe):** «Wirtschaftliche Hilfe darf weder gepfändet noch abgetreten werden.» — [1], § 16 Abs. 4
- **Abtretung von Ansprüchen gegen Dritte (Bedingung der Hilfe, nicht verwechseln mit § 16 Abs. 4):** «Bestehen erhebliche Ansprüche gegenüber Dritten, so kann die Gewährung wirtschaftlicher Hilfe davon abhängig gemacht werden, dass sie an die Fürsorgebehörde abgetreten werden, soweit sie nicht von Gesetzes wegen an diese übergehen.» — [2], § 8 (ergänzt ⟨korrigiert 09.11.2026, Fachprüfung⟩)

### Offen / nicht gefunden
- Stand: ShG-PDF «SRSZ 1.2.2022», ShV-PDF «SRSZ 1.2.2018» (PDF erstellt 2019). Ob seither Änderungen erfolgten, lässt sich ohne Versions-API nicht belegen.
- Merkblatt über die Sozialhilfe [4] ist von 2012 («Merkblatt 2012»), nutzt teils alte Begriffe («Unmündigkeit»).
- ~~Kein separates Verzeichnis der Sozialdienste;~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ Amtliches «Sozialverzeichnis» vorhanden [7] (Seite 200, Rubrik vorhanden; Einträge nicht einzeln geprüft); Kantonsseite bietet zusätzlich Gemeindeauswahl (Ziele nicht einzeln geprüft).
- «Gemeinde-Handbuch Sozialwesen» (vszgb-handbuch.ch) stammt vom Gemeindeverband — nicht amtlich, nicht verwendet.

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** Rückerstattung ohne § 25 Abs. 2; Kostengutsprache ohne Notfallregel § 17 Abs. 3; Meldepflicht aus Formular statt Primärquelle; ShV § 8 (Abtretung) fehlte; Verzeichnis übersehen; Beurteilung ohne Hinweis auf Fusszeilen-Stand; Asylbereich fehlte.
- **Geändert:** alle Punkte eingearbeitet, Zitate an `sz_shg.txt`, `sz_shv.txt`, `sz_gs.html`, `sz_verz.html` geprüft; Sozialverzeichnis selbst abgerufen (200, Titel «Sozialverzeichnis – Kanton Schwyz»).
- **Offen:** Aktualität ShG/ShV (keine Versions-API); Migrationsgesetz SRSZ 111.200 nicht gelesen.

### Quellen
1. Gesetz über die Sozialhilfe (ShG), SRSZ 380.100, Stand SRSZ 1.2.2022 (PDF). https://www.sz.ch/public/upload/assets/3688/380_100.pdf?fp=4 — abgerufen 09.11.2026, HTTP 200; Gegenprobe https://www.sz.ch/public/upload/assets/99999999/atlantis.pdf → 404
2. Vollziehungsverordnung zum Gesetz über die Sozialhilfe (ShV), SRSZ 380.111, Stand SRSZ 1.2.2018 (PDF). https://www.sz.ch/public/upload/assets/32455/380_111.pdf?fp=4 — abgerufen 09.11.2026, HTTP 200
3. «Soziales» (Abschnitt Sozialhilfe), Amt für Gesundheit und Soziales, Kanton Schwyz. https://www.sz.ch/behoerden/verwaltung/departement-des-innern/amt-fuer-gesundheit-und-soziales/soziales.html/8756-8758-8802-9316-9317-12842 — abgerufen 09.11.2026, HTTP 200, h1 «Soziales»; Gegenprobe https://www.sz.ch/atlantis-gibt-es-nicht-4711 → 404
4. Merkblatt über die Sozialhilfe (2012, PDF), Kanton Schwyz. https://www.sz.ch/public/upload/assets/7772/Merkblatt_ueber_die_Sozialhilfe.pdf?fp=3 — abgerufen 09.11.2026, HTTP 200
5. Unterstützungsgesuch um wirtschaftliche Sozialhilfe (PDF). https://www.sz.ch/public/upload/assets/57422/Unterstuetzungsgesuch_um_wirtschaftliche_Sozialhilfe.pdf?fp=5 — abgerufen 09.11.2026, HTTP 200
6. Systematische Gesetzsammlung SZ, Abschnitt 380. https://www.sz.ch/kanton/gesetze/systematische-gesetzsammlung.html/8756-8757-10021-11689 — abgerufen 09.11.2026, HTTP 200
7. Sozialverzeichnis, Amt für Gesundheit und Soziales, Kanton Schwyz. https://www.sz.ch/verwaltung/departement-des-innern/amt-fuer-gesundheit-und-soziales/soziales/sozialverzeichnis.html/8756-8758-8802-9316-9317-12842-13081 — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [3]

---

---

## OW — Obwalden

**Beurteilung:** teilweise
**Zuständig (kurz):** Einwohnergemeinde des Unterstützungswohnsitzes (Sozialbehörde = Einwohnergemeinderat); Vollzug durch Sozialdienst; laut Kantonsseite «Regionaler Sozialdienst Obwalden» — SHG Art. 5–7, 10; SHV Art. 2
**Antrag (kurz):** beim Regionalen Sozialdienst Obwalden; er stellt das Gesuch an die Sozialbehörde der Gemeinde, die Gemeinde verfügt (Kantonsseite [3])
**SKOS (kurz):** nicht belegt — weder SHG 870.1 noch SHV 870.11 verweisen auf die SKOS-Richtlinien; SHV Art. 10 spricht nur vom «sozialen Existenzminimum»
**Aufsicht:** Regierungsrat (SHG Art. 23); Fachamt: Kantonales Sozialamt im Sicherheits- und Sozialdepartement — https://www.ow.ch/aemter/244
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Sozialhilfegesetz (SHG) vom 23.10.1983 | GDB 870.1 | «Aktuelle Version in Kraft seit: 08.04.2017 (Beschlussdatum: 19.05.2016)» | https://gdb.ow.ch/app/de/texts_of_law/870.1 | API 200, PDF (Version 1688) 200; Gegenprobe 999.999 → 404 |
| Sozialhilfeverordnung (SHV) vom 10.11.1983 | GDB 870.11 | «Aktuelle Version in Kraft seit: 01.01.2013 (Beschlussdatum: 03.05.2012)» | https://gdb.ow.ch/app/de/texts_of_law/870.11 | API 200, PDF (Version 1687) 200; Gegenprobe Version 999999 → 404 |

Hinweis: Das Gesamtverzeichnis der GDB (`/api/de/texts_of_law/lightweight_index`) enthält keinen weiteren
Erlass zur Bemessung der Sozialhilfe (nur Asyl-Ausführungsbestimmungen GDB 113.213 u. a.).

### Zuständigkeit und Antrag
> «Die öffentliche Sozialhilfe ist grundsätzlich Aufgabe der Einwohnergemeinden.» — [1], Art. 5 Abs. 1

> «Die Einwohnergemeinde, in welcher der Hilfesuchende seinen Unterstützungswohnsitz im Sinne des Bundesgesetzes über die Zuständigkeit für die Unterstützung Bedürftiger hat, ist für die öffentliche Sozialhilfe zuständig.» — [1], Art. 7 Abs. 1

> «Die Sozialbehörde der Gemeinde ist der Einwohnergemeinderat.» — [1], Art. 6 Abs. 1

> «Die Einwohnergemeinden unterhalten einen Sozialdienst.» — [1], Art. 10 Abs. 1

> «Der  Regionale Sozialdienst Obwalden … unterstützt Sie bei der Gesuchsstellung für die wirtschaftliche Sozialhilfe. … berechnet den Unterstützungsbedarf und stellt das Gesuch an die Sozialbehörde der Gemeinde. Aufgrund der Unterlagen und allfälligen zusätzlichen Abklärungen verfügt die zuständige Gemeinde die Höhe und Dauer der wirtschaftlichen Sozialhilfe.» — [3] (ow.ch, Themenseite Sozialhilfe)

Verzeichnis: kein Gemeindeverzeichnis nötig/gefunden; die Kantonsseite verweist auf einen einzigen
Regionalen Sozialdienst (https://www.rsd-obwalden.ch/sozialberatung-und-hilfe/, HTTP 200, Gegenprobe 404) [4].

### SKOS-Richtlinien
In SHG und SHV kein Verweis auf die SKOS-Richtlinien (Volltextsuche «SKOS», «Richtlinien» in beiden PDFs: 0 Treffer zur Bemessung).
> «Die wirtschaftliche Hilfe erstreckt sich auf die Gewährung des notwendigen Lebensunterhaltes im Sinne eines sozialen Existenzminimums.» — [2], Art. 10 Abs. 1

Ob OW die SKOS-Richtlinien per Regierungsratsbeschluss, Weisung oder Gemeindepraxis anwendet, ist amtlich nicht belegt. Die RSD-Seite [4] verlinkt nur eine SKOS-Broschüre «Sozialhilfe in einfacher Sprache» — kein Beleg für Verbindlichkeit.

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** bei unwahren/unvollständigen Angaben sowie bei Erbschaft/Vermögenserwerb; Erben bis zur Höhe der Erbschaft; nicht für Bezüge in Minderjährigkeit bzw. bis Abschluss der ordentlichen Ausbildung; bei unwahren Angaben mit Zins; Erlöschen: Frist im Gesetz.
  > «Wer wirtschaftliche Hilfe in Anspruch nimmt oder genommen hat, ist zur Rückerstattung verpflichtet, wenn er infolge unwahrer oder unvollständiger Angaben in den Genuss von Leistungen gekommen oder durch Erbschaft oder Vermögenserwerb in finanziell günstige Verhältnisse gelangt ist.» — [1], Art. 17 Abs. 1
  > «Gegenüber Erben von Personen, die wirtschaftliche Hilfe bezogen haben, erstreckt sich die Rückerstattungspflicht höchstens auf die empfangene Erbschaft.» — [1], Art. 17 Abs. 3
  > «Die Rückerstattungspflicht erlischt nach Ablauf von zehn Jahren seit der letzten wirtschaftlichen Hilfeleistung.» — [1], Art. 17 Abs. 6
- **Verwandtenunterstützung:** ~~Gemeinde wirkt bei der Durchsetzung mit.~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ Eine Geltendmachung durch die Gemeinde nach ZGB 328/329 ist im kantonalen Recht nicht ausdrücklich geregelt; die SHV nennt als Gemeindeaufgabe nur die «Mithilfe bei der Durchsetzung».
  > «die Mithilfe bei der Durchsetzung von familienrechtlichen Unterhalts- und Unterstützungsansprüchen sowie von Rückerstattungsansprüchen;» — [2], Art. 1 Abs. 1 Bst. e
- **Aufenthaltsbewilligung:** in den kantonalen Quellen nicht genannt.
- **Wohnsitzwechsel:** Zuständigkeit folgt dem Unterstützungswohnsitz nach ZUG; Verfahren unter Gemeinden nach ZUG sinngemäss.
  > «Für die Verfahren (Unterstützungsanzeige, Abrechnung usw.) gelten die Bestimmungen des Bundesgesetzes über die Zuständigkeit für die Unterstützung Bedürftiger sinngemäss.» — [2], Art. 15 Abs. 1
- **Abtretung / Grundpfand:** 
  > «Sofern erhebliche vermögensrechtliche Ansprüche gegenüber Dritten vorhanden sind, ist die Gewährung wirtschaftlicher Hilfe davon abhängig zu machen, dass die Ansprüche der unterstützenden Einwohnergemeinde abgetreten werden. Bestehen die Vermögenswerte der Hilfeempfänger in Grundstücken, so ist die im Rahmen der Hilfe gewährte Leistung grundpfandrechtlich sicherzustellen.» — [2], Art. 10 Abs. 5
- **Mitwirkung / Meldepflicht / Kürzung:**
  > «Sofern der Hilfeempfänger die ihm zumutbare Mitwirkung ablehnt, kann die öffentliche Sozialhilfe eingeschränkt oder eingestellt werden.» — [1], Art. 14 Abs. 1
  > «Er hat erhebliche Änderungen in seinen Verhältnissen unverzüglich zu melden.» — [2], Art. 12 Abs. 2
- **Rechtsmittel:** Beschwerde an den Einwohnergemeinderat bzw. Regierungsrat; Frist im Gesetz ([1], Art. 24 Abs. 1–3).

### Offen / nicht gefunden
- SKOS-Status: kein amtlicher Beleg (weder Gesetz, Verordnung noch RRB gefunden). Beim Kantonalen Sozialamt OW nachfragen.
- ~~Rechtsform/Trägerschaft des «Regionalen Sozialdienstes Obwalden» (Zweckverband? Vereinbarung der Gemeinden?) nicht amtlich belegt.~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ Trägerschaft belegt: Zweckverband der Gemeinden, hat die gesetzliche Sozialhilfe per 1. Juli 2023 übernommen [6]:
  > «Der Regionale Sozialdienst hat per 1. Juli 2023 die Aufgaben der Gemeinden im Bereich der gesetzlichen Sozialhilfe übernommen.» — [6] (Fusszeile: «Zweckverband Regionaler Sozialdienst Obwalden», Alpnach Dorf)
  Offen bleibt: Satzung/Statuten des Zweckverbands nicht geprüft (wer entscheidet formell — Gemeinderat nach SHG Art. 6 oder Verbandsorgan?).
- SHV-Verweis auf «Vorsteher des kantonalen Fürsorgedepartementes» (Art. 4 Abs. 3) ist eine veraltete Bezeichnung; heute Sicherheits- und Sozialdepartement (ow.ch).

### Quellen
1. Sozialhilfegesetz (SHG), GDB 870.1, Kanton Obwalden, Stand 08.04.2017. https://gdb.ow.ch/api/de/texts_of_law/870.1 (JSON) und https://gdb.ow.ch/api/de/versions/1688/pdf_file — abgerufen 09.11.2026, HTTP 200; Gegenprobe /api/de/texts_of_law/999.999 → 404
2. Sozialhilfeverordnung (SHV), GDB 870.11, Kanton Obwalden, Stand 01.01.2013. https://gdb.ow.ch/api/de/versions/1687/pdf_file — abgerufen 09.11.2026, HTTP 200; Gegenprobe /api/de/versions/999999/pdf_file → 404
3. Themenseite «Sozialhilfe», Kanton Obwalden. https://www.ow.ch/familie/5447 — abgerufen 09.11.2026, HTTP 200; Gegenprobe www.ow.ch/atlantis-gibt-es-nicht-4711 → 404
4. «Sozialberatung und -hilfe», Regionaler Sozialdienst Obwalden. https://www.rsd-obwalden.ch/sozialberatung-und-hilfe/ — abgerufen 09.11.2026, HTTP 200; Gegenprobe /atlantis-gibt-es-nicht-4711 → 404
5. Kantonales Sozialamt Obwalden. https://www.ow.ch/aemter/244 — abgerufen 09.11.2026, HTTP 200; Sicherheits- und Sozialdepartement https://www.ow.ch/departemente/23 — HTTP 200
6. «Zweckverband RSD», Zweckverband Regionaler Sozialdienst Obwalden. https://www.rsd-obwalden.ch/zweckverband-rsd/ — abgerufen 09.11.2026, HTTP 200 (selbst neu abgerufen); Gegenprobe wie [4] → 404

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** (Korrektur) Verwandtenunterstützung überzeichnet — SHV Art. 1 Abs. 1 Bst. e regelt nur «Mithilfe bei der Durchsetzung», keine eigene Geltendmachung nach ZGB 328/329. (Hinweis) Trägerschaft RSD belegbar über rsd-obwalden.ch/zweckverband-rsd/.
- **Geändert:** Verwandtenunterstützung korrigiert (alte Aussage durchgestrichen); Offen-Punkt Trägerschaft mit wörtlichem Zitat geschlossen, Quelle [6] ergänzt. Zitat selbst an der Quelle geprüft (HTTP 200, Wortlaut identisch).
- **Offen:** SKOS-Status weiterhin nicht belegt; Statuten des Zweckverbands nicht geprüft. Beurteilung bleibt «teilweise».

---

## NW — Nidwalden

**Beurteilung:** belegbar
**Zuständig (kurz):** Politische Gemeinde des Unterstützungswohnsitzes (Sozialbehörde = Gemeinderat); kantonales Sozialamt klärt ab und stellt Antrag — SHG Art. 7, 40; SHV § 1, § 4 Abs. 2 Ziff. 8. ⟨ergänzt 09.11.2026, Fachprüfung⟩ Für Asylsuchende, vorläufig Aufgenommene und anerkannte Flüchtlinge ist während einer Frist im Gesetz seit Einreise der Kanton zuständig (SHG Art. 28 Abs. 1)
**Antrag (kurz):** über das kantonale Sozialamt, Abteilung Sozialdienst (Stans), das Abklärung und Antrag an die Sozialbehörde der Gemeinde macht; die Gemeinde ordnet an
**SKOS (kurz):** ~~ganz, mit benannten Abweichungen —~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ SKOS als Massstab («orientiert sich an»), mit verbindlichen Abweichungen (Anhang 1 geht vor, § 8 Abs. 2) — statischer Verweis auf die 5. Ausgabe (Fassung 01.01.2021) mit Ergänzungen bis 01.01.2026; Abweichungen in Anhang 1, verbindliche kantonale Richtlinien (Mietzinse) in Anhang 2 — SHV § 8
**Aufsicht:** Gesundheits- und Sozialdirektion («Direktion», SHV § 3) — https://www.nw.ch/gesodirektion/25 ; Fachamt Sozialamt https://www.nw.ch/sozialamt/298
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die Sozialhilfe (Sozialhilfegesetz, SHG) vom 22.10.2014 | NG 761.1 | «Aktuelle Version in Kraft seit: 01.04.2025 (Beschlussdatum: 18.12.2024)» | https://gesetze.nw.ch/app/de/texts_of_law/761.1 | API 200, PDF (Version 1494) 200; Gegenprobe 999.999 → 404 |
| Verordnung zum Gesetz über die Sozialhilfe (Sozialhilfeverordnung, SHV) vom 16.12.2014 | NG 761.11 | «Aktuelle Version in Kraft seit: 01.01.2026 (Beschlussdatum: 18.11.2025)» | https://gesetze.nw.ch/app/de/texts_of_law/761.11 | API 200, PDF (Version 1424) 200; Gegenprobe 999.999 → 404 |

### Zuständigkeit und Antrag
> «Die Sozialhilfe ist grundsätzlich eine Aufgabe der Politischen Gemeinden.» — [1], Art. 7 Abs. 1

> «Die Durchführung der Sozialhilfe obliegt jener Politischen Gemeinde, in der die hilfesuchende Person den Unterstützungswohnsitz gemäss den Bestimmungen des Bundesgesetzes über die Zuständigkeit für die Unterstützung Bedürftiger (Zuständigkeitsgesetz, ZUG) hat; …» — [1], Art. 7 Abs. 2

> «Der Gemeinderat ist die Sozialbehörde der Politischen Gemeinde; …» — [1], Art. 40 Abs. 1

> «die Abklärung und Antragstellung an die Sozialbehörde der Politischen Gemeinde betreffend die Gewährung von wirtschaftlicher Sozialhilfe und von Alimentenhilfe;» — [2], § 4 Abs. 2 Ziff. 8 (Aufgaben des kantonalen Sozialamts)

> «Die Abteilung Sozialdienst ist eine Dienstleistung des kantonalen Sozialamtes. … Wir beraten und begleiten Einwohner und Einwohnerinnen des Kantons Nidwalden bei finanziellen Schwierigkeiten.» — [4]

Verzeichnis: ein kantonaler Sozialdienst (Engelbergstrasse 34, Stans) [4]; kein Gemeindeverzeichnis nötig.

### SKOS-Richtlinien
> «Die Bemessung der wirtschaftlichen Sozialhilfe: 1. orientiert sich an den Empfehlungen der Schweizerischen Konferenz für Sozialhilfe (SKOS-Richtlinien) in der Fassung per 1. Januar 2021 (5. Ausgabe), mit Ergänzungen per 1. Januar 2022, per 1. Januar 2023, per 1. Januar 2024, per 1. Januar 2025 und per 1. Januar 2026; 2. richtet sich nach den in Anhang 1 aufgeführten Abweichungen von den SKOS-Richtlinien und den in Anhang 2 verbindlich erklärten Richtlinien der kantonalen Sozialkommission.» — [2], § 8 Abs. 1

> «Der Anhang 1 geht den SKOS-Richtlinien vor.» — [2], § 8 Abs. 2

Benannte Abweichung (Anhang 1): Kürzungen bis auf Nothilfe zulässig.
> «Leistungskürzungen sind gemäss Art. 22 Abs. 2 SHG bis auf das bundesverfassungsmässige Minimum der Nothilfe zulässig (Abweichung von Kapitel F.2 der SKOS-Richtlinien).» — [2], Anhang 1, § A1-1

Verbindliche kantonale Richtlinie (Anhang 2): Mietzinsrichtlinien.
> «Die Mietzinsrichtlinien gemäss Kapitel C.4 der "Richtlinien des Kantons Nidwalden zur Bemessung und Ausrichtung von wirtschaftlicher Sozialhilfe" vom 14. November 2024 der kantonalen Sozialkommission sind verbindlich.» — [2], Anhang 2, § A1-2 (Fussnote: «Die Richtlinien sind bei der Gesundheits- und Sozialdirektion einsehbar.»)

Verweis ist statisch (benannte Ausgabe + Ergänzungsstände); § 8 Abs. 1 Ziff. 1 wird laut Änderungstabelle jährlich nachgeführt (zuletzt 18.11.2025, in Kraft 01.01.2026).

### Was Geld oder Rechte kosten kann
- **Rückerstattung (rechtmässiger Bezug):** ~~ab 18~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ ab einer Altersgrenze im Gesetz, bei Erbschaft/günstigen Verhältnissen; Ausbildungsausnahme; Erben/Vermächtnisnehmer bis Höhe des Nachlasses.
  > «Wer nach der Vollendung des 18. Altersjahres wirtschaftliche Sozialhilfe bezogen hat, ist verpflichtet, sie ganz oder teilweise zurückzuerstatten, wenn sich die hilfeempfangende Person in Folge Erbschaft oder aus anderen Gründen in günstigen wirtschaftlichen Verhältnissen befindet.» — [1], Art. 36 Abs. 1
- **Rückerstattung (unrechtmässiger Bezug):** mit Zins (Satz im Gesetz).
  > «Wer unter unwahren oder unvollständigen Angaben Sozialhilfe erwirkt hat, ist zur Rückerstattung verpflichtet.» — [1], Art. 37 Abs. 1; «Die Rückerstattungsforderung ist ab Bezug der Sozialhilfe mit fünf Prozent je Jahr zu verzinsen.» — Art. 37 Abs. 2
- **Verjährung:** Frist im Gesetz ([1], Art. 39: «… erlischt zehn Jahre, nachdem das Gemeinwesen davon Kenntnis erhalten hat, spätestens mit dem Ablauf von 20 Jahren nach der letztmaligen Ausrichtung von Sozialhilfe.»).
- **Verwandtenunterstützung:** geht vor; Gemeinde macht sie geltend, notfalls Klage.
  > «Die kommunale Sozialbehörde ist zuständig, den Anspruch auf Unterstützung bei den Verwandten geltend zu machen; in Streitfällen hat sie eine Klage beim zuständigen Gericht gemäss Art. 329 ZGB einzureichen.» — [1], Art. 35 Abs. 2
- **Aufenthaltsbewilligung:** keine Meldepflicht an das Migrationsamt im SHG/SHV gefunden. Einziger Bezug: Vorbehalt beim Abschiebungsverbot.
  > «Für ausländische Staatsangehörige gelten Abs. 1 und 2 unter dem Vorbehalt der Bestimmungen über den Widerruf von Anwesenheitsbewilligungen sowie über die Aus- oder Wegweisung und die Heimschaffung.» — [1], Art. 27 Abs. 3
- **Wohnsitzwechsel innerhalb NW:** ~~Zuständigkeit geht nach einer Übergangsfrist auf die neue Gemeinde über (Frist im Gesetz), nur wenn bereits Sozialhilfe bezogen wurde.~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ Für laufende Bezüger wechselt die Zuständigkeit erst nach einer Frist im Gesetz auf die neue Gemeinde; sonst gilt sofort der neue Unterstützungswohnsitz (SHG Art. 7 Abs. 2–4).
  > «Wechselt die hilfeempfangende Person innerhalb des Kantonsgebietes den Unterstützungswohnsitz, gehen die Zuständigkeit und die Fürsorgepflicht mit dem Ablauf des zweiten auf den Wohnsitzwechsel folgenden Monats auf jene Politische Gemeinde über, in der die hilfeempfangende Person ihren Unterstützungswohnsitz neu begründet hat.» — [1], Art. 7 Abs. 3
  > «Diese Frist gilt nur, wenn die betreffende Person am bisherigen Unterstützungswohnsitz im Zeitpunkt des Wohnsitzwechsels von der Sozialbehörde wirtschaftliche Sozialhilfe empfangen hat.» — [1], Art. 7 Abs. 4
  > «Die kommunalen Sozialbehörden dürfen eine hilfebedürftige Person nicht veranlassen, den Unterstützungswohnsitz zu wechseln, …» — [1], Art. 27 Abs. 1
- **Kürzung / Einstellung / Nichteintreten:** Kürzung bei Pflichtverletzungen, bei schweren Verstössen bis auf Nothilfe; Nichteintreten bei verweigerten Unterlagen nach Androhung ([1], Art. 18, 22, 23).
  > «Bei schweren Widerhandlungen gemäss Abs. 1, wie insbesondere wiederholten Verstössen, kann die Sozialhilfe auf das bundesverfassungsmässige Minimum der Nothilfe beschränkt werden.» — [1], Art. 22 Abs. 2
- **Meldepflicht / Strafbarkeit:** Änderungen sofort melden ([1], Art. 44 Ziff. 3); Busse für falsche Auskunft oder Nichtmelden ([1], Art. 55 Abs. 3), Anzeigepflicht der Behörde ([1], Art. 56).
- **Bevorschussung:** Ansprüche gegen Sozialversicherungen u. a. gehen im Umfang der Bevorschussung von Gesetzes wegen auf die Gemeinde über ([1], Art. 25 Abs. 1).

### Offen / nicht gefunden
- Die «Richtlinien des Kantons Nidwalden zur Bemessung und Ausrichtung von wirtschaftlicher Sozialhilfe» vom 14.11.2024 sind nicht online, nur «bei der Gesundheits- und Sozialdirektion einsehbar» — Inhalt nicht geprüft.
- Kein öffentliches Merkblatt / Gesuchsformular auf nw.ch gefunden (Sozialamt- und Sozialdienstseite nennen nur Kontakt).

### Quellen
1. Gesetz über die Sozialhilfe (SHG), NG 761.1, Kanton Nidwalden, Stand 01.04.2025. https://gesetze.nw.ch/api/de/texts_of_law/761.1 und https://gesetze.nw.ch/api/de/versions/1494/pdf_file — abgerufen 09.11.2026, HTTP 200; Gegenprobe /api/de/texts_of_law/999.999 → 404
2. Verordnung zum Gesetz über die Sozialhilfe (SHV), NG 761.11, Stand 01.01.2026. https://gesetze.nw.ch/api/de/versions/1424/pdf_file — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [1]
3. Sozialamt, Kanton Nidwalden. https://www.nw.ch/sozialamt (→ https://www.nw.ch/sozialamt/298) — abgerufen 09.11.2026, HTTP 200; Gegenprobe www.nw.ch/atlantis-gibt-es-nicht-4711 → 404
4. Sozialdienst (Abteilung des Sozialamts), Kanton Nidwalden. https://www.nw.ch/sozialdienst/1138 — abgerufen 09.11.2026, HTTP 200
5. Gesundheits- und Sozialdirektion, Kanton Nidwalden. https://www.nw.ch/gesodirektion (→ /gesodirektion/25) — abgerufen 09.11.2026, HTTP 200

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** (Korrektur) SKOS «ganz» überzeichnet — § 8 SHV sagt «orientiert sich an». (Korrektur) Wohnsitzwechsel missverständlich formuliert (Art. 7 Abs. 4). (Hinweis) «ab 18» als Zahl in der Zusammenfassung. (Hinweis) Kantonszuständigkeit für bestimmte ausländische Personen (Art. 28) fehlte.
- **Geändert:** SKOS-Kurzzeile, Rückerstattungs- und Wohnsitzsatz korrigiert (alt durchgestrichen); Zitat Art. 7 Abs. 4 ergänzt; Zuständigkeit um Art. 28 ergänzt (ohne Zahl). Alle Zitate an meinem eigenen PDF (Version 1494/1424) geprüft.
- **Offen:** Richtlinien der kantonalen Sozialkommission vom 14.11.2024 nicht online einsehbar. Beurteilung bleibt «belegbar».

---

## GL — Glarus

**Beurteilung:** belegbar
**Zuständig (kurz):** Kanton (seit 2008 kantonalisiert): «Die öffentliche Sozialhilfe ist Aufgabe des Kantons» — SHG Art. 6; Vollzug durch die Sozialen Dienste des Kantons (Abteilung Soziale Dienste, Departement Volkswirtschaft und Inneres)
**Antrag (kurz):** schriftliches Gesuch (Formular + Merkblatt) bei den Sozialen Diensten, Stützpunkt Nord, Näfels
**SKOS (kurz):** ⟨Kategorie ergänzt 09.11.2026, Fachprüfung⟩ teilweise / mit Abweichungen — «in der Regel» massgebend, mit eigener Abweichungsverordnung — SHG Art. 23 Abs. 3; SHV VIII E/21/5 «ergänzend zu und abweichend von» den SKOS-Richtlinien (Verweis ohne Ausgabe ~~= dynamisch~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩; ob dynamisch, ist nicht ausdrücklich geregelt)
**Aufsicht:** zuständiges Departement (SHG Art. 11 Abs. 2) = Departement Volkswirtschaft und Inneres — https://www.gl.ch/verwaltung/volkswirtschaft-und-inneres.html/1040
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die öffentliche Sozialhilfe (Sozialhilfegesetz; SHG) vom 07.05.1995 | GS VIII E/21/3 | «Aktuelle Version in Kraft seit: 01.01.2025 (Beschlussdatum: 05.05.2024)» | https://gesetze.gl.ch/app/de/texts_of_law/VIII%20E%2F21%2F3 | API 200, PDF (Version 2505) 200; Gegenprobe 999.999 → 404 |
| Verordnung über die Bemessung der wirtschaftlichen Sozialhilfe und der Hilfe in Notlagen in Ausnahme der Richtlinien der ~~SKOS~~ Schweizerischen Konferenz für Sozialhilfe (Sozialhilfeverordnung, SHV) vom 19.05.2022 ⟨Titel amtlich vollständig, korrigiert 09.11.2026, Fachprüfung⟩ | GS VIII E/21/5 | «Aktuelle Version in Kraft seit: 01.03.2026 (Beschlussdatum: 09.02.2026)» | https://gesetze.gl.ch/app/de/texts_of_law/VIII%20E%2F21%2F5 | API 200, PDF (Version 2625) 200; Gegenprobe 999.999 → 404 |

(Daneben Asyl-Erlasse VIII E/21/4 und VIII E/21/4/1, nicht Gegenstand.)

### Zuständigkeit und Antrag
> «Die öffentliche Sozialhilfe ist Aufgabe des Kantons.» — [1], Art. 6 Abs. 1

> «Das zuständige Departement beaufsichtigt den Vollzug der Sozialhilfe und ist Beschwerdeinstanz gemäss Artikel 54.» — [1], Art. 11 Abs. 2; «Der Regierungsrat bezeichnet die Vollzugsorgane.» — Art. 12 Abs. 2

> «Wer für sich und seine Angehörigen mit gleichem Wohnsitz im Kanton Glarus finanziell nicht oder nicht vollständig und rechtzeitig aufkommen kann, hat die Möglichkeit, ein Gesuch um Sozialhilfe einzureichen.» — [3] (Kontakt: Soziale Dienste Nord, Bahnhofstrasse 24, 8752 Näfels)

> «Ein Anspruch auf Sozialhilfe wird geprüft, wenn das Gesuch vollständig ausgefüllt und zusammen mit den geforderten Unterlagen eingereicht wird.» — [4], Merkblatt S. 5

Gesuchsformular (docx) und Merkblatt in fünf Sprachen auf [3] verlinkt. Verzeichnis nicht nötig (eine kantonale Stelle).

### SKOS-Richtlinien
> «Für die Bemessung sind in der Regel die Richtlinien der Schweizerischen Konferenz für Sozialhilfe massgebend; über Ausnahmen entscheidet das Departement.» — [1], Art. 23 Abs. 3

> «Diese Verordnung regelt ergänzend zu und abweichend von den Richtlinien der Schweizerischen Konferenz für Sozialhilfe (SKOS-Richtlinien) die Bemessung der wirtschaftlichen Sozialhilfe und der Hilfe in Notlagen im Kanton Glarus.» — [2], Art. 1 Abs. 1

Benannte eigene Regeln (ohne Beträge): Ein-/Austrittsschwelle (Art. 2), junge Erwachsene mit anteiligem Grundbedarf eines Dreipersonenhaushalts (Art. 4), Mietzinsmaxima nach Region Glarus Nord/Glarus/Glarus Süd (Art. 5), Integrationszulagen und Einkommensfreibeträge mit eigenen Ansätzen (Art. 6, 8), Motorfahrzeuge (Art. 9), Rückforderung (Art. 10), Nothilfe-Ansätze (Art. 11–12). Die Verordnung ist vom Departement Volkswirtschaft und Inneres erlassen, gestützt auf SHG Art. 23 Abs. 3.

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** unrechtmässig bezogen immer; rechtmässig bezogen bei gebesserten Verhältnissen oder Nachlass; Erben haften solidarisch; Ausnahme Unmündigkeit/Erstausbildung. Zins nur bei unrechtmässigem Bezug. Erlöschen: Frist im Gesetz; pfandgesicherte Forderungen verjähren nicht.
  > «Rechtmässig bezogene wirtschaftliche Hilfe ist zurückzuerstatten, wenn sich die finanziellen Verhältnisse der Empfänger so gebessert haben, dass ihnen Rückerstattung zugemutet werden kann, oder wenn sie beim Tode Vermögen hinterlassen.» — [1], Art. 32 Abs. 2
  > «Dieser Anspruch richtet sich gegen die Erben, unabhängig davon, ob diese gleichzeitig der Verwandtenunterstützungspflicht nach Artikel 328 ZGB unterliegen oder nicht. Die Erben haften solidarisch.» — [1], Art. 32 Abs. 4
  > «Der Rückerstattungsanspruch erlischt gegenüber der unterstützten Person innert 15 Jahren, gegenüber den Erben innert 20 Jahren seit dem letzten Bezug der Hilfe.» — [1], Art. 33 Abs. 3
  > «Rückforderungen können zeitlich unbegrenzt geltend gemacht werden.» — [2], Art. 10 Abs. 1 (⚠️ siehe Offen)
- **Verwandtenunterstützung:** der Kanton kann sie geltend machen.
  > «Der Kanton kann den Anspruch auf Unterstützung bei den Verwandten geltend machen. Die Auswirkungen auf die Betroffenen sind jeweils angemessen zu berücksichtigen.» — [1], Art. 31 Abs. 2
- **Aufenthaltsbewilligung:** amtliches Merkblatt nennt eine Informationspflicht an die Migrationsbehörde.
  > «Es ist den Sozialen Diensten gesetzlich vorgeschrieben, die Abteilung für Migration über den Bezug der Sozialhilfe zu informieren. Wir weisen Sie darauf hin, dass die Sozialen Dienste gegenüber der Abteilung für Migration über Dauer und Höhe der Unterstützungsleistungen auskunftspflichtig sind.» — [4], Merkblatt S. 3
  Die zugrunde liegende Gesetzesbestimmung nennt das Merkblatt nicht ~~(vermutlich Bundesrecht, nicht geprüft)~~ ⟨korrigiert 09.11.2026, Fachprüfung: Vermutung gestrichen⟩. Rechtsgrundlage im Merkblatt nicht genannt.
  ⟨ergänzt 09.11.2026, Fachprüfung⟩ Weitere Bezüge zum Aufenthaltsstatus in der SHV:
  > «Anspruch auf Hilfe in Notlagen haben namentlich Personen: … d. mit einer Kurzaufenthaltsbewilligung (Ausweis L).» — [2], Art. 11 Abs. 1 Bst. d
  > «Keine situationsbedingten Leistungen werden gewährt für amtliche Gebühren, namentlich für Aufenthaltsbewilligungen und Ausländerausweise.» — [2], Art. 7 Abs. 2
- **Wohnsitzwechsel:** innerkantonal kein Zuständigkeitswechsel (Kanton zuständig). Bei Zuzug aus anderem Kanton gelten die Mietzinsmaxima sofort.
  > «Zieht eine bereits von der Sozialhilfe unterstütze Person aus einem anderen Kanton zu, gelten die Maximalbeträge ab dem Zuzugsdatum.» — [2], Art. 5 Abs. 5
  Merkblatt: Grundsatz der Ortsanwesenheit, längere Abwesenheiten meldepflichtig ([4], S. 1).
- **Grundpfand / Sicherheiten:**
  > «Besitzen Hilfesuchende Grundeigentum oder andere Vermögenswerte, deren Realisierung nicht möglich oder zumutbar ist, wird die Gewährung von wirtschaftlicher Hilfe von der Unterzeichnung einer Rückerstattungsverpflichtung abhängig gemacht.» — [1], Art. 29 Abs. 1
  > «Dauert die Unterstützung länger als sechs Monate, erfolgt eine Grundpfandverschreibung.» — [4], Merkblatt S. 3
- **Abtretung:** Hilfe kann von Abtretung von Drittansprüchen an den Kanton abhängig gemacht werden; bevorschusste Versicherungsleistungen gehen über ([1], Art. 26 Abs. 1–2).
- **Mitwirkung / Kürzung / Sozialinspektion:** Kürzung oder Einstellung nach Mahnung bzw. schriftlicher Androhung ([1], Art. 28 Abs. 3, Art. 30 Abs. 3); Sozialinspektion bei begründetem Verdacht, auch Überwachung ([1], Art. 30a).
- **Rechtsmittel:** Einsprache bei der verfügenden Stelle, Frist im Gesetz ([1], Art. 54 Abs. 1).

### Offen / nicht gefunden
- ⚠️ Widerspruch: SHV Art. 10 Abs. 1 («zeitlich unbegrenzt») vs. SHG Art. 33 Abs. 3 (Erlöschen nach Fristen). Das Verhältnis (z. B. nur bevorschusste Leistungen gemeint?) ist im Text nicht geklärt; das Gesetz geht der Departementsverordnung vor. Für die App nur «Frist im Gesetz» sagen und bei den Sozialen Diensten prüfen lassen.
- Merkblatt beruft sich auf «Sozial- und Nothilfe-Richtlinie 8.2» und «Verordnung … (Stand 01.06.2022)»; diese Richtlinie ist laut SHV Art. 13 aufgehoben → Merkblatt teilweise veraltet.
- Die formelle Bezeichnung der Vollzugsorgane durch den Regierungsrat (SHG Art. 12 Abs. 2) nicht geöffnet; «Abteilung Soziale Dienste» ist durch SHV Art. 5 Abs. 6 / Art. 9 und die Amtsseite belegt.
- Rechtsgrundlage der Meldung an die Abteilung Migration nicht im kantonalen Recht gefunden.

### Quellen
1. Gesetz über die öffentliche Sozialhilfe (SHG), GS VIII E/21/3, Kanton Glarus, Stand 01.01.2025. https://gesetze.gl.ch/api/de/texts_of_law/VIII%20E%2F21%2F3 und https://gesetze.gl.ch/api/de/versions/2505/pdf_file — abgerufen 09.11.2026, HTTP 200; Gegenprobe /api/de/texts_of_law/999.999 → 404
2. Sozialhilfeverordnung (SHV), GS VIII E/21/5, Departement Volkswirtschaft und Inneres, Stand 01.03.2026. https://gesetze.gl.ch/api/de/versions/2625/pdf_file — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [1]
3. Themenseite «Sozialhilfe», Kanton Glarus. https://www.gl.ch/verwaltung/volkswirtschaft-und-inneres/soziales/sozialhilfe.html/978 — abgerufen 09.11.2026, HTTP 200 (gl.ch antwortete diesmal normal, kein 403); Gegenprobe www.gl.ch/atlantis-gibt-es-nicht-4711 → 404
4. «Merkblatt zum Gesuch um Sozialhilfe» (Deutsch), Soziale Dienste Kanton Glarus, ohne Datum (nennt SHV-Stand 01.06.2022). https://www.gl.ch/public/upload/assets/67101/Merkblatt%20Sozialhilfe%20Deutsch.pdf?fp=1 — abgerufen 09.11.2026, HTTP 200 (application/pdf); Gegenprobe /public/upload/assets/9999999/atlantis.pdf → 404
5. Departement Volkswirtschaft und Inneres, Kanton Glarus. https://www.gl.ch/verwaltung/volkswirtschaft-und-inneres.html/1040 — abgerufen 09.11.2026, HTTP 200

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** (Korrektur) Aufenthaltsbezüge der SHV fehlten (Art. 11 Abs. 1 Bst. d Ausweis L → nur Hilfe in Notlagen; Art. 7 Abs. 2 keine Leistungen für Bewilligungsgebühren). (Hinweis) Vermutung «Bundesrecht» streichen; SKOS-Kategorie nennen; SHV-Titel amtlich vollständig; «dynamisch» ist Auslegung.
- **Geändert:** beide Zitate ergänzt (an meinem eigenen PDF Version 2625 wörtlich geprüft); Vermutung gestrichen; SKOS-Kategorie «teilweise / mit Abweichungen» gesetzt; Titel korrigiert (laut API: «… in Ausnahme der Richtlinien der Schweizerischen Konferenz für Sozialhilfe»); «dynamisch» zurückgenommen.
- **Offen:** Widerspruch SHV Art. 10 / SHG Art. 33 Abs. 3; Rechtsgrundlage der Migrationsmeldung; formelle Bezeichnung der Vollzugsorgane. Beurteilung bleibt «belegbar».

---

## ZG — Zug

**Beurteilung:** belegbar
**Zuständig (kurz):** Einwohnergemeinde (bzw. Bürgergemeinde für am Heimatort wohnende Bürger); Sozialbehörde = Gemeinderat — SHG § 9–11, § 27–28
**Antrag (kurz):** bei der Wohngemeinde (Sozialdienst/Abteilung Soziales); amtliches Kontaktverzeichnis aller 11 Gemeinden vom Kantonalen Sozialamt (PDF, Stand 07/2025)
**SKOS (kurz):** ganz, ~~dynamischer Verweis~~ ⟨korrigiert 09.11.2026, analog Fachprüfungs-Hinweis FR⟩ Verweis ohne Ausgabe (ob dynamisch, ist nicht ausdrücklich geregelt), mit kantonalen Ergänzungen — SHV § 9 Abs. 1 («richten sich nach den … SKOS-Richtlinien», keine Ausgabe genannt); eigene Regeln zu Einkommensfreibeträgen, Integrationszulagen, Obergrenze (SHV § 9a–9g)
**Aufsicht:** Direktion des Innern (SHG § 13 Abs. 1), Aufgaben im Unterstützungswesen an das Kantonale Sozialamt übertragen (SHV § 1) — https://zg.ch/de/direktion-des-innern/kantonales-sozialamt
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die Sozialhilfe im Kanton Zug (Sozialhilfegesetz, SHG) vom 16.12.1982 | BGS 861.4 | «Aktuelle Version in Kraft seit: 01.01.2024 (Beschlussdatum: 04.05.2023)» | https://bgs.zg.ch/app/de/texts_of_law/861.4 | API 200, PDF (Version 2504) 200; Gegenprobe 999.999 → 404 |
| Verordnung zum Sozialhilfegesetz (Sozialhilfeverordnung) vom 20.12.1983 | BGS 861.41 | «Aktuelle Version in Kraft seit: 01.01.2024 (Beschlussdatum: 03.10.2023)» | https://bgs.zg.ch/app/de/texts_of_law/861.41 | API 200, PDF (Version 2505) 200; Gegenprobe 999.999 → 404 |

### Zuständigkeit und Antrag
> «Die Sozialhilfe ist in erster Linie Sache der Einwohner- und Bürgergemeinden.» — [1], § 9 Abs. 1

> «Der zuständige Gemeinderat ist die Sozialbehörde der Gemeinde.» — [1], § 11 Abs. 1

> «Sie unterstützen ihre hilfebedürftigen Einwohnerinnen und Einwohner, soweit diese nicht an ihrem Heimatort wohnende Bürgerinnen bzw. Bürger sind;» — [1], § 27 Abs. 1 Bst. a (Einwohnergemeinden); Bürgergemeinden: «Sie unterstützen ihre hilfebedürftigen, an ihrem Heimatort wohnenden Bürgerinnen und Bürger;» — § 28 Abs. 1 Bst. a

> «Befürchten Sie in eine finanzielle Notlage zu geraten oder ist diese bereits eingetreten, dann wenden Sie sich an Ihre Gemeinde.» — [3]

Verzeichnis: «Kontaktadressen für Sozialhilfegesuche» (Direktion des Innern, Sozialamt, Abteilung Gesellschaft), 11 Einwohnergemeinden mit Stelle und Telefon [4].

### SKOS-Richtlinien
> «Die Ausgestaltung und das Ausmass der Unterstützung (§§ 20 und 29 SHG) richten sich nach den Richtlinien der Schweizerischen Konferenz für Sozialhilfe (SKOS-Richtlinien).» — [2], § 9 Abs. 1

> «Der Regierungsrat kann ergänzende und präzisierende Vorschriften zu den SKOS-Richtlinien erlassen oder festlegen, dass bestimmte Teile nicht anwendbar sind.» — [2], § 9 Abs. 2

> «… und die Richtlinien der Schweizerischen Konferenz für Sozialhilfe (SKOS), die im Kanton Zug verbindlich sind.» — [3]

Eigene Ansätze (ohne Beträge): Einkommensfreibeträge nach Beschäftigungsumfang, ~~halbiert bis 25~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ reduziert bis zu einer Altersgrenze in der Verordnung (§ 9a), Integrationszulage in Lehre (§ 9b) und für Nichterwerbstätige (§ 9c), Obergrenze der kumulierten Freibeträge/Zulagen je Haushalt (§ 9g), Auflage zur Hinterlegung von Kontrollschildern (§ 9h). Nothilfe nach SODK-Empfehlungen (§ 10 Abs. 4). Zusätzlich gibt das Sozialamt ein «Handbuch Sozialhilfe des Kantons Zug» heraus (laut [3] auf dem SKOS-Richtlinienportal) — Verbindlichkeit nicht geprüft.

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** u. a. bei Erbschaft, Lotteriegewinn, Schenkung, rückwirkenden Versicherungsleistungen, Verwertung bisher nicht realisierbaren Vermögens; Ausnahme Unmündigkeit/Ausbildung (Altersgrenze im Gesetz); bei unwahren Angaben mit Zins und ohne Verwirkung. Verwirkung sonst: Fristen im Gesetz.
  > «wenn die Hilfe Suchenden in günstige finanzielle Verhältnisse gelangen, z.B. durch Erbschaft, Lotteriegewinn oder unentgeltliche Zuwendungen;» — [1], § 25 Abs. 1 Bst. c
  > «Unterstützungen, die durch unwahre oder unvollständige Angaben erwirkt wurden, sind mit Zins zurückzuerstatten. Der Zinssatz richtet sich nach Art. 104 Abs. 1 OR.» — [1], § 25 Abs. 3
  > «Bei Unterstützungen, die durch unwahre oder unvollständige Angaben erlangt wurden, tritt keine Verwirkung ein.» — [1], § 26 Abs. 2
  Nach dem Tod: «Die Rückerstattungspflicht beschränkt sich auf die empfangene Erbschaft.» — [1], § 26 Abs. 1 Bst. c
- **Verwandtenunterstützung:** Sozialbehörde prüft und macht geltend.
  > «Die Sozialbehörde prüft, ob gemäss Art. 328 und 329 ZGB Verwandte zur Unterstützung der Hilfesuchenden oder des Hilfesuchenden verpflichtet sind.» — [1], § 24 Abs. 1; «Nötigenfalls ist die Verwandtenunterstützung bei der zuständigen Behörde geltend zu machen.» — § 24 Abs. 3
- **Aufenthaltsbewilligung:** ~~in den kantonalen Quellen nicht genannt~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ keine Meldepflicht an die Migrationsbehörde genannt; der Aufenthaltsstatus kann aber den Umfang der Hilfe beschränken (SHV § 11a erlaubt den Sozialdiensten zudem den Abruf der «Art des Aufenthaltsausweises» aus dem Personenregister).
  > «Vorbehalten bleiben Einschränkungen für Personen, die gemäss dem ZUG Anspruch auf Hilfe in Notfällen haben, die sich auf der Durchreise befinden oder sich illegal im Kanton aufhalten.» — [1], § 20 Abs. 3
  > «Personen, die sich illegal in der Schweiz aufhalten und in Not geraten, haben auf Gesuch hin Anspruch auf Nothilfe im Umfang von Art. 12 der Bundesverfassung.» — [2], § 10 Abs. 1
- **Wohnsitzwechsel innerhalb ZG:** bisherige Gemeinde trägt die Kosten noch bis Ende des Folgemonats; ZUG gilt innerkantonal sinngemäss; Streit entscheidet die Direktion des Innern.
  > «Bei Wechsel des Unterstützungswohnsitzes innerhalb des Kantons Zug trägt die bis dahin unterstützungspflichtige Gemeinde die Unterstützungskosten bis zum Ablauf des darauf folgenden Kalendermonats.» — [1], § 32 Abs. 2
  > «Die Bestimmungen des ZUG gelten sinngemäss auch für die Regelung innerkantonaler Unterstützungsfragen, soweit diese nicht anderwärts geregelt sind.» — [1], § 31 Abs. 1
- **Grundpfand / Abtretung:**
  > «Bestehen die Vermögenswerte der Hilfesuchenden oder des Hilfesuchenden in Grundstücken, ist die Forderung des unterstützenden Gemeinwesens grundpfandrechtlich sicherzustellen.» — [1], § 19 Abs. 3
- **Kürzung:** «Die Leistungen werden in der Regel gekürzt, verweigert oder unterbrochen, wenn die Hilfe Suchenden a) Anordnungen der Sozialdienste nicht befolgen, insbesondere über ihre Verhältnisse keine oder falsche Auskunft geben; …» — [1], § 21ter Abs. 1
- **Meldepflicht / Abklärung:** Änderungen unverzüglich melden ([1], § 23 Abs. 2); Datenabruf, unangemeldete Besuche und Observation bei begründetem Verdacht ([1], § 23a–23c).

### Offen / nicht gefunden
- ⟨ergänzt 09.11.2026, Fachprüfung⟩ Bürgergemeinden unterstützen ihre am Heimatort wohnenden Bürgerinnen und Bürger (SHG § 28 Abs. 1 Bst. a); das amtliche Verzeichnis [4] führt nur die 11 Einwohnergemeinden. Wo diese Personen ihr Gesuch stellen, ist nicht belegt.
- Kein amtliches Gesuchsformular/Merkblatt auf Kantonsebene (Gesuch läuft über die Gemeinden; Gemeindeseiten nicht geprüft).
- Verbindlichkeit des «Handbuch Sozialhilfe des Kantons Zug» nicht geprüft (Link auf rl.skos.ch, nicht amtlich gehostet).
- ⚠️ Die Kantonsseite [3] verlinkt veraltete Fassungen: SHG «versions/1747» (laut API «in Kraft von: 01.01.2018 bis: 31.12.2023») und SHV «versions/1512» («01.01.2016 bis: 31.12.2023»).

### Quellen
1. Gesetz über die Sozialhilfe im Kanton Zug (SHG), BGS 861.4, Stand 01.01.2024. https://bgs.zg.ch/api/de/texts_of_law/861.4 und https://bgs.zg.ch/api/de/versions/2504/pdf_file — abgerufen 09.11.2026, HTTP 200; Gegenprobe /api/de/texts_of_law/999.999 → 404
2. Verordnung zum Sozialhilfegesetz (SHV), BGS 861.41, Stand 01.01.2024. https://bgs.zg.ch/api/de/versions/2505/pdf_file — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [1]
3. «Persönliche und wirtschaftliche Sozialhilfe», Kantonales Sozialamt Zug. https://zg.ch/de/soziales/sozialhilfe/persoenliche-und-wirtschaftliche-sozialhilfe — abgerufen 09.11.2026, HTTP 200; Gegenprobe zg.ch/atlantis-gibt-es-nicht-4711 → 404
4. «Kontaktadressen für Sozialhilfegesuche» (Stand 202507), Direktion des Innern, Sozialamt, Abteilung Gesellschaft. https://cdn.zg.ch/dam/jcr:85773634-93de-44da-8d38-d74d8fc33111/Kontaktadressen%20f%C3%BCr%20Sozialhilfegesuche%20202507.pdf — abgerufen 09.11.2026, HTTP 200 (application/pdf); Gegenprobe cdn.zg.ch/dam/jcr:00000000-…/atlantis.pdf → 404
5. Kantonales Sozialamt (Direktion des Innern). https://zg.ch/de/direktion-des-innern/kantonales-sozialamt — abgerufen 09.11.2026, HTTP 200

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** keine Korrektur; Hinweise: Bürgergemeinden fehlen im Verzeichnis (SHG § 28); «halbiert bis 25» als Zahl in der Zusammenfassung; SHG § 20 Abs. 3 und SHV § 10 Abs. 1 gehören unter Aufenthaltsbewilligung.
- **Geändert:** Offen-Punkt Bürgergemeinden ergänzt; Altersgrenze ohne Zahl formuliert; beide Zitate unter Aufenthaltsbewilligung ergänzt (an meinem eigenen PDF Version 2504/2505 wörtlich geprüft). Zusätzlich «dynamischer Verweis» analog zum FR-Hinweis zurückgenommen.
- **Offen:** Antragsweg für Bürgerinnen/Bürger am Heimatort; Verbindlichkeit des «Handbuch Sozialhilfe». Beurteilung bleibt «belegbar».

---

## FR — Fribourg / Freiburg

**Beurteilung:** teilweise
**Zuständig (kurz):** Communes, organisées en régions d'aide sociale (associations de communes); autorité = commission sociale, exécution = service social régional (SSR) — LASoc art. 39, 45, 48, 50; Etat für Asylbereich (art. 40 al. 2). ⟨ergänzt 09.11.2026, Fachprüfung⟩ Übergang: bis die neuen Gemeindeverbände, Sozialkommissionen und regionalen Sozialdienste eingesetzt sind (Fristen im Übergangsrecht, ROF 2024_074 Ziff. IV), üben die bisherigen Sozialdienste und Sozialkommissionen nach altem Recht deren Zuständigkeiten aus
**Antrag (kurz):** beim regionalen Sozialdienst der Wohnsitz- bzw. Aufenthaltsgemeinde (LASoc art. 57 al. 1); amtliche Liste der SSR vom 10.09.2026 (PDF, SASoc)
**SKOS (kurz):** teilweise / eigene Ansätze — Staatsrat erlässt Normen «en se référant aux normes de la CSIAS» (LASoc art. 41 let. b, art. 17 al. 2); Ordonnance 831.0.12 mit eigenen Forfaits, CSIAS subsidiär für alles nicht Geregelte (art. 17); Verweis ohne Ausgabe ⟨ergänzt 09.11.2026, Fachprüfung⟩ (ob dynamisch, ist nicht ausdrücklich geregelt); Ordonnance gilt nicht für Asylbereich und Personen ohne Aufenthaltsbewilligung (art. 16)
**Aufsicht:** Conseil d'Etat (art. 41 let. a) und Direction de la santé et des affaires sociales als «autorité de surveillance» (art. 42 let. e); Service de l'action sociale (SASoc) inspiziert (art. 43) — https://www.fr.ch/dsas/sasoc
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Loi sur l'aide sociale (LASoc) du 09.10.2024 — dt. ⟨ergänzt 09.11.2026, Fachprüfung⟩ «Sozialhilfegesetz» (SHG), API de: «vom 09.10.2024, in Kraft seit 01.01.2026» | RSF 831.0.1 | «Version actuelle en vigueur depuis le 01.01.2026 (Date d'adoption: 09.10.2024)»; Vorversion (LASoc 1991) «en vigueur depuis le 01.01.2020 jusqu'au 31.12.2025» | https://bdlf.fr.ch/app/fr/texts_of_law/831.0.1 | API 200, PDF (Version 8521) 200; Gegenprobe 999.999 → 404 |
| Règlement d'exécution de la loi sur l'aide sociale (RELASoc) du 30.11.1999 | RSF 831.0.11 | «Version actuelle en vigueur depuis le 01.02.2025 (Date d'adoption: 07.01.2025)»; Ingress: «Vu la loi du 14 novembre 1991 sur l'aide sociale» | https://bdlf.fr.ch/app/fr/texts_of_law/831.0.11 | API 200, PDF (Version 8125) 200; Gegenprobe versions/999999 → 404 |
| Ordonnance fixant les normes de calcul de l'aide matérielle de la loi sur l'aide sociale du 02.05.2006 | RSF 831.0.12 | «Version actuelle en vigueur depuis le 01.01.2025 (Date d'adoption: 24.09.2024)»; Ingress: «Vu l'article 22a de la loi du 14 novembre 1991» | https://bdlf.fr.ch/app/fr/texts_of_law/831.0.12 | API 200, PDF (Version 8058) 200 |

Inkrafttreten des neuen LASoc geprüft: **01.01.2026** (API `enactment: 2026-01-01`, `date_of_decision: 2024-10-09`, ROF 2024_074). Keine «future_versions» bei allen drei Erlassen. Ein neues Ausführungsreglement zur LASoc 2024 ist in der BDLF **nicht** vorhanden; laut SASoc gelten RELASoc 1999 und Ordonnance 2006 weiter [5].

### Zuständigkeit und Antrag
> «L'aide sociale est organisée en régions qui correspondent à un ou plusieurs districts.» — [1], art. 39 al. 1

> «Les communes veillent à ce que les personnes dans le besoin bénéficient de l'aide sociale octroyée en vertu de la présente loi.» — [1], art. 45 al. 1; «Elles mettent en place pour la région d'aide sociale une commission sociale et un service social régional.» — art. 45 al. 3

> «La commission sociale est l'autorité d'aide sociale, sous réserve des compétences du service social régional et du Service.» — [1], art. 48 al. 1

> «Toute personne qui sollicite une aide sociale s'adresse au service social régional compétent à raison de son domicile ou de son lieu de séjour.» — [1], art. 57 al. 1

> «Avant de rendre une décision, le service social requiert le préavis de la commune fribourgeoise de domicile ou du lieu de séjour de la personne requérante.» — [1], art. 59 al. 1

Verzeichnis: «Liste des services sociaux régionaux du Canton de Fribourg / Liste der regionalen Sozialdienste des Kantons Freiburg», SASoc, «Fribourg, le 10 septembre 2026» [6].

### SKOS-Richtlinien
> «il édicte les normes de calcul de la couverture des besoins de base, en se référant aux normes de la CSIAS. Il consulte préalablement la Conférence des autorités d'aide sociale et les milieux intéressés;» — [1], art. 41 al. 1 let. b (Conseil d'Etat)

> «Le Conseil d'Etat fixe les barèmes des montants destinés à couvrir les besoins de base au sens de l'alinéa 1 ainsi que les modalités d'application, en se référant aux normes CSIAS.» — [1], art. 17 al. 2

> «Les concepts et les normes de calcul de l'aide sociale de la CSIAS s'appliquent à toutes les matières qui ne sont pas réglées spécifiquement dans la présente ordonnance, sous réserve des législations spéciales.» — [3], art. 17 al. 1

Einordnung: eigene kantonale Forfaits (Ordonnance [3], art. 2 ff.), CSIAS als Referenz und subsidiär; Verweis ohne Ausgabe ~~(dynamisch)~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ — ob dynamisch, ist nicht ausdrücklich geregelt.

⟨ergänzt 09.11.2026, Fachprüfung⟩ Geltungsbereich der Bemessungsnormen:
> «Ne sont pas concernés par les normes de calcul de la présente ordonnance: a) les demandeurs d'asile; b) les personnes admises à titre provisoire; c) les personnes à protéger sans autorisation de séjour; d) les personnes sous le coup d'une décision de non-entrée en matière sur leur demande d'asile (NEM); e) les personnes en séjour, de passage ou sans autorisation de séjour dans le canton.» — [3], art. 16 al. 1 Ergänzend «Directives d'application des normes LASoc», Version seit 01.05.2017 [5] — nicht geöffnet.

### Was Geld oder Rechte kosten kann
- **Rückerstattung (rechtmässig):** bei Vermögensanfall über einer bundesrechtlich verknüpften Grenze, bei Wiederaufnahme einer Erwerbstätigkeit, oder aus Billigkeit; solidarische Haftung der Partner im Haushalt; Erben bis zu ihrem Erbteil und Begünstigte einer Lebensversicherung.
  > «La personne bénéficiaire est tenue au remboursement de la couverture des besoins de base obtenue légalement: a) lorsque la personne entre en possession d'une fortune dépassant le montant prévu à l'article 11 al. 1 let. c de la loi fédérale sur les prestations complémentaires … (LPC); b) lors de la reprise d'une activité lucrative, pour autant que cela n'incite pas la personne bénéficiaire à ne pas reprendre un travail rémunéré; c) dans d'autres cas, lorsque l'équité l'exige.» — [1], art. 70 al. 1
  > «L'obligation de rembourser s'étend aux héritiers et héritières jusqu'à concurrence de leur part d'héritage ainsi qu'aux bénéficiaires d'une prestation d'assurance-vie versée à la suite du décès de la personne dans le besoin.» — [1], art. 68 al. 1
  Ausnahmen (Minderjährigkeit, Ausbildung, Integrationsmassnahmen u. a.): [1], art. 69. ⟨ergänzt 09.11.2026, Fachprüfung⟩ Die Ausnahmen entfallen bei bedeutendem Vermögensanfall: «L'alinéa 1 n'est pas applicable lorsque la personne bénéficiaire entre en possession d'une fortune importante.» — [1], art. 69 al. 2. Kein Zins ausser bei unrechtmässigem Bezug ([1], art. 67 al. 2).
- **Rückerstattung (unrechtmässig):** «La personne bénéficiaire est tenue au remboursement de la couverture des besoins de base obtenue indûment.» — [1], art. 71 al. 1
- **Verjährung:** Frist im Gesetz ([1], art. 75 al. 1: «… se prescrit par dix ans à compter du dernier versement de l'aide accordée.»; gegenüber Erben eigene Frist, al. 3; pfandgesicherte Forderungen unverjährbar, al. 7).
- **Verwandtenunterstützung:** Sozialhilfe ist subsidiär zur Familie; Abklärung umfasst Unterhaltspflichtige.
  > «La couverture des besoins de base est subsidiaire à l'entretien et à l'assistance prodigués par la famille à ses membres, ainsi qu'aux autres prestations légales, contractuelles ou volontaires de tiers.» — [1], art. 18 al. 2
  Ausdrückliche Geltendmachung nach Art. 328/329 ZGB durch die Behörde: im LASoc-Text nicht als eigene Norm gefunden (nur art. 72 al. 2 Subrogation beim Familienunterhalt, art. 76 al. 3 let. c Auskunft zur «obligation d'entretien ou d'assistance»).
- **Aufenthaltsbewilligung:** keine Meldepflicht an die Migrationsbehörde im LASoc gefunden; ~~in den kantonalen Quellen nicht genannt~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ eine Meldepflicht ist in den kantonalen Quellen nicht genannt. Der Aufenthaltsstatus bestimmt aber die anwendbaren Normen: Für Asylbereich und Personen ohne Aufenthaltsbewilligung gelten die Bemessungsnormen der Ordonnance nicht ([3], art. 16 al. 1, Zitat oben; Normen in der Spezialgesetzgebung, art. 16 al. 2). Umgekehrt müssen die Migrationsbehörden der Sozialhilfe Auskunft geben ([1], art. 76 al. 2 let. c). Für Ausländer mit Garantie eines Dritten:
  > «… ce dernier est tenu de rembourser la totalité de la couverture des besoins, en argent ou en nature, y compris les frais de retour dans le pays d'origine, qui aurait été fournie à la personne concernée.» — [1], art. 74 al. 1
- **Wohnsitzwechsel:** Zuständig ist die Behörde der Wohnsitzgemeinde, ohne Wohnsitz die der Aufenthaltsgemeinde; Wegzug aus dem Kanton beendet den Anspruch; Abschiebungsverbot mit Rückerstattungsfolge zwischen Gemeinden.
  > «L'autorité dont relève la commune de domicile de la personne dans le besoin est compétente pour statuer sur son droit à l'aide sociale.» — [1], art. 46 al. 1
  > «la personne concernée n'est pas ou plus domiciliée dans le canton, n'y séjourne pas ou n'y séjourne plus; est réservé le cas d'un court séjour à l'étranger de la personne domiciliée dans le canton;» — [1], art. 37 al. 1 let. b (Grund für Verweigerung/Aufhebung)
  > «Les communes ne sont pas autorisées à renvoyer une personne dans le besoin ni à l'empêcher ou à lui interdire de s'établir sur leur territoire.» — [1], art. 46 al. 5
- **Sicherheiten / Grundpfand:** Vorschuss gegen Abtretung, Verpfändung oder Grundpfand; gesetzliches Grundpfand bei übernommenen Hypothekarzinsen.
  > «L'octroi de la couverture des besoins de base à titre d'avance est subordonné, hormis les cas de subrogation légale, à la cession de créances, au nantissement de valeurs ou biens mobiliers, à la constitution de garantie immobilière ou à la constitution d'autres formes de garanties en faveur de l'autorité d'aide sociale.» — [1], art. 23 al. 1
  > «Le service social régional requiert en principe l'inscription d'une hypothèque légale en sa faveur sur l'immeuble dont il a pris en charge les intérêts hypothécaires et les charges …» — [1], art. 73 al. 1
- **Mitwirkung / Sanktionen:** Pflichten inkl. Annahme zumutbarer Arbeit, vertrauensärztliche Untersuchung, angekündigter Hausbesuch ([1], art. 34); Auskunfts- und Meldepflicht ([1], art. 35); Sanktion = Kürzung des Forfaits ([1], art. 36 al. 2); Verweigerung/Aufhebung u. a. bei Ablehnung zumutbarer Arbeit ([1], art. 37 al. 2).
- **Rechtsmittel:** réclamation bei der verfügenden Behörde, dann recours an das Kantonsgericht; Fristen im Gesetz ([1], art. 82–83).

### Offen / nicht gefunden
- ⚠️ Kernunsicherheit: LASoc 2024 ist seit 01.01.2026 in Kraft, aber das gültige Ausführungsrecht (RELASoc 1999, Ordonnance 2006) stützt sich noch auf die LASoc 1991 (andere Artikelnummern und Begriffe, z. B. «aide matérielle» statt «couverture des besoins de base»). Mehrere LASoc-Artikel delegieren an den Staatsrat (art. 19 al. 5, 36 al. 6, 67 al. 3) — die zugehörige neue Verordnung ist in der BDLF nicht vorhanden. ~~Übergangsbestimmungen der LASoc 2024 sind in der konsolidierten Fassung nicht enthalten (Text endet mit art. 85); ROF 2024_074 nicht geöffnet.~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ ROF 2024_074 geöffnet [8]: Ziff. III hebt die LASoc 1991 auf («L'acte RSF 831.0.1 (Loi sur l'aide sociale (LASoc), du 14.11.1991) est abrogé.»); Ziff. IV «Dispositions transitoires» regelt nur die Organisation:
  > «Les communes disposent d'un délai de deux ans dès l'entrée en vigueur de la présente loi pour se constituer en association de communes au sens de l'article 45 al. 2 et pour soumettre les statuts de leur association à l'approbation du Conseil d'Etat.» — [8], Ziff. IV, S. 32
  > «Les associations de communes ou les communes au sens de l'article 39 al. 2, disposent d'un délai de cinq ans dès l'entrée en vigueur de la présente loi pour mettre en place leur commission sociale et leur service social régional.» — [8], Ziff. IV, S. 32
  > «Les services sociaux et les commissions sociales au sens de la loi sur l'aide sociale du 14 novembre 1991 exercent, dès l'entrée en vigueur de la présente loi, les compétences dévolues aux commissions sociales et aux services sociaux régionaux jusqu'à l'entrée en fonction de ces derniers.» — [8], Ziff. IV, S. 32
  Eine Übergangsregel zum Weitergelten von RELASoc 1999 und Ordonnance 2006 enthält ROF 2024_074 **nicht** — diese Unsicherheit bleibt.
- Seite «Quelles sont les prestations de l'aide sociale et comment obtenir de l'aide» (fr.ch, «Dernière modification : 28.03.2023») beschreibt noch die alte Ordnung (aide matérielle, contrat d'insertion sociale) — für die App nicht als Beleg verwenden.
- «Directives d'application des normes LASoc» (Version 01.05.2017) nicht geöffnet.
- ~~Deutschsprachige Fassung der LASoc 2024 nicht abgerufen~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ Deutsche Metadaten per API abgerufen (Titel «Sozialhilfegesetz», SHG); zitiert wird weiter die französische Originalfassung.

### Quellen
1. Loi sur l'aide sociale (LASoc), RSF 831.0.1, du 09.10.2024, version en vigueur dès le 01.01.2026. https://bdlf.fr.ch/api/fr/texts_of_law/831.0.1 und https://bdlf.fr.ch/api/fr/versions/8521/pdf_file — abgerufen 09.11.2026, HTTP 200; Gegenprobe /api/fr/texts_of_law/999.999 → 404
2. Règlement d'exécution de la loi sur l'aide sociale (RELASoc), RSF 831.0.11, version 01.02.2025. https://bdlf.fr.ch/api/fr/versions/8125/pdf_file — abgerufen 09.11.2026, HTTP 200; Gegenprobe /api/fr/versions/999999/pdf_file → 404
3. Ordonnance fixant les normes de calcul de l'aide matérielle de la loi sur l'aide sociale, RSF 831.0.12, version 01.01.2025. https://bdlf.fr.ch/api/fr/versions/8058/pdf_file — abgerufen 09.11.2026, HTTP 200
4. Service de l'action sociale (SASoc). https://www.fr.ch/dsas/sasoc — abgerufen 09.11.2026, HTTP 200; Gegenprobe www.fr.ch/atlantis-gibt-es-nicht-4711 → 404. DSAS: https://www.fr.ch/dsas — HTTP 200
5. «Bases légales et normes de l'aide sociale», SASoc, «Dernière modification : 18.08.2026». https://www.fr.ch/sasoc/vie-quotidienne/integration-et-coordination-sociale/bases-legales-et-normes-de-laide-sociale (→ /vie-quotidienne/…) — abgerufen 09.11.2026, HTTP 200
6. «Liste des services sociaux régionaux du Canton de Fribourg», SASoc, 10.09.2026. https://www.fr.ch/document/387371 (→ /sites/default/files/2026-09/scssr.pdf) — abgerufen 09.11.2026, HTTP 200 (application/pdf); Gegenprobe /document/99999999 → 404
7. «Aide sociale», Etat de Fribourg, «Dernière modification : 09.06.2026». https://www.fr.ch/vie-quotidienne/parcours-de-vie/aide-sociale — abgerufen 09.11.2026, HTTP 200
8. ROF 2024_074 (Änderungsdokument zur LASoc vom 09.10.2024, mit Ziff. III Aufhebung und Ziff. IV Übergangsrecht). https://bdlf.fr.ch/api/fr/change_documents/file_dictionaries/10749/pdf_file — abgerufen 09.11.2026 (selbst neu abgerufen), HTTP 200 (application/pdf); Gegenprobe …/file_dictionaries/99999999/pdf_file → 404
9. Deutsche Metadaten LASoc/SHG. https://bdlf.fr.ch/api/de/texts_of_law/831.0.1 — abgerufen 09.11.2026, HTTP 200: «Sozialhilfegesetz | SHG | vom 09.10.2024, in Kraft seit 01.01.2026»

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** (Korrektur) Übergangsrecht ROF 2024_074 fehlte. (Hinweise) Ordonnance art. 16 al. 1 (Geltungsbereich/Aufenthalt); LASoc art. 69 al. 2 (Ausnahmen entfallen bei bedeutendem Vermögen); deutscher Titel; «dynamisch» ist Auslegung.
- **Geändert:** ROF selbst neu abgerufen (HTTP 200, Gegenprobe 404), drei Übergangszitate und die Aufhebung der LASoc 1991 wörtlich übernommen; Kopf «Zuständig» ergänzt; Offen-Punkt «ROF nicht geöffnet» geschlossen (durchgestrichen). Art. 16 al. 1 an meinem eigenen PDF geprüft — der Wortlaut beginnt mit «Ne sont pas concernés par les normes de calcul de la présente ordonnance:» (die Prüfer-Paraphrase «Normen gelten nicht für» nicht übernommen). Art. 69 al. 2 und deutscher Titel selbst geprüft und ergänzt; «dynamisch» zurückgenommen.
- **Offen:** keine Übergangsregel zum Weitergelten von RELASoc 1999 / Ordonnance 2006; neue Staatsratsverordnung zu art. 19 al. 5, 36 al. 6, 67 al. 3 fehlt; Directives 2017 nicht geöffnet. Beurteilung bleibt «teilweise».

---

---

## SO — Solothurn

**Beurteilung:** belegbar
**Zuständig (kurz):** Einwohnergemeinden, organisiert in Sozialregionen (SG § 27, § 147); Sozialdienst der Sozialregion liefert die Entscheidgrundlagen, Sozialkommission entscheidet (SG § 28)
**Antrag (kurz):** bei der zuständigen Sozialregion; amtliches Verzeichnis «Ansprechstellen in der Sozialhilfe» auf so.ch (geprüft, 200)
**SKOS (kurz):** ~~ganz, mit benannten Abweichungen~~ grundsätzlich, mit benannten Abweichungen ⟨korrigiert 09.11.2026, Fachprüfung⟩ — SG § 152 («richtet sich grundsätzlich nach»), Abweichungen in SV § 93; Verweis ohne Ausgabe/Datum (dynamisch gelesen, aber nicht ausdrücklich «jeweils gültig»)
**Aufsicht:** ~~Departement des Innern (SG § 25bis; SV § 2) bzw. «das Amt» (SV § 92)~~ «das Amt», das «namens des Departementes» die Sozialkommission beaufsichtigt (SV § 92 Abs. 1); im Erlasstext steht nur «das Departement», die Bezeichnung «Departement des Innern» und «Amt für Gesellschaft und Soziales» stammt von so.ch ⟨korrigiert 09.11.2026, Fachprüfung: SV § 2 betrifft die Aufsicht über soziale Institutionen nach SG § 21⟩ — https://so.ch/verwaltung/departement-des-innern/amt-fuer-gesellschaft-und-soziales/sozialhilfe-und-asyl/sozialhilfe/
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Sozialgesetz (SG) | BGS 831.1 | API: «Aktuelle Version in Kraft seit: 01.09.2026 bis: 31.12.2026 (Beschlussdatum: 05.05.2026)»; PDF «Stand 1. September 2026». Zukünftige Version «in Kraft ab: 01.01.2027 (Beschlussdatum: 08.03.2026)» | https://bgs.so.ch/app/de/texts_of_law/831.1 | API 200 JSON, PDF 200; Gegenprobe 999.999 → 404 |
| Sozialverordnung (SV) | BGS 831.2 | «vom 29.10.2007, in Kraft seit: 01.01.2008»; PDF «Stand 1. April 2026» | https://bgs.so.ch/app/de/texts_of_law/831.2 | API 200, PDF 200; Gegenprobe 404 |

Version 2027 des SG (API-Version 5670) geöffnet und gegen die aktuelle verglichen: laut Änderungstabelle betrifft sie nur § 22 Abs. 2ter und § 37 Abs. 2 lit. a; die hier zitierten §§ 13–17, 27, 121quinquies, 147–154, 164–165 sind textgleich (nur Umbruch/Fussnoten verschoben).

### Zuständigkeit und Antrag
> «Die Einwohnergemeinden erbringen die ihnen zugewiesenen Aufgaben der Sozialhilfe, der institutionellen Zusammenarbeit sowie des Kindes- und Erwachsenenschutzes in Sozialregionen.» — [1], § 27 Abs. 1

> «Die Einwohnergemeinden richten die Sozialhilfe an Personen aus, die sich in einer sozialen Notlage befinden; sie sind zur wirksamen Hilfeleistung verpflichtet.» — [1], § 147 Abs. 1

> «Der sozialhilferechtliche innerkantonale Unterstützungswohnsitz oder Aufenthaltsort richtet sich analog nach den Bestimmungen des Bundesgesetzes über die Zuständigkeit für die Unterstützung Bedürftiger (ZUG).» — [1], § 3 Abs. 3

> «Wenn Sie Leistungen der Sozialhilfe beziehen möchten, wenden Sie sich bitte an die für Sie zuständige Sozialregion.» — [3]

> «Im Kanton Solothurn sind die Einwohnergemeinden für die Sozialhilfe zuständig. Sie haben für diese Aufgaben 13 Sozialregionen gebildet, welche für die Einwohnerinnen und Einwohner der angeschlossenen Gemeinden die Dienstleistungen der Sozialhilfe anbieten.» — [4] (Verzeichnis mit Gemeinden und Adressen je Sozialregion)

### SKOS-Richtlinien
> «Die Bemessung der Sozialhilfeleistungen richtet sich grundsätzlich nach den Richtlinien der Schweizerischen Konferenz für öffentliche Sozialhilfe (SKOS-Richtlinien).» — [1], § 152 Abs. 1

> «Der Regierungsrat kann Ausnahmen von der generellen Anwendbarkeit der SKOS-Richtlinien festlegen.» — [1], § 152 Abs. 2

> «Von den von der Schweizerischen Konferenz für Sozialhilfe erlassenen Richtlinien (SKOS-Richtlinien) gelten folgende Abweichungen:» — [2], § 93 Abs. 1

Benannte Abweichungen (SV § 93, ohne Beträge): Sanktionen (Kürzung des Grundbedarfs bis zu einer Grenze im Erlass, bei wiederholten schweren Verstössen Herabsetzung auf Nothilfe), Wohnkosten (nur ortsüblich, keine Mietkautionen), Zahnbehandlungen (Wartefrist und Selbstbehalt im Erlass), Hausrat-/Haftpflichtversicherung aus dem Grundbedarf, auswärtige Verpflegung, Umzug, Integrationszulagen, Einkommensfreibetrag, Kumulationsgrenze, Vermögensfreibetrag, Auto, Urlaub, Elternbeiträge, Pauschale in stationären Einrichtungen; junge Erwachsene mit eigenem Haushalt: gekürzter Grundbedarf und Wohnkosten (Abs. 1bis); Teuerung nicht automatisch, sondern durch Regierungsratsbeschluss (Abs. 1ter): «Teuerungsausgleiche auf den Grundbedarf für den Lebensunterhalt werden nicht automatisch übernommen.» — [2], § 93 Abs. 1ter.
Amtsseite: «Die Richtlinien der Schweizerischen Konferenz für Sozialhilfe (SKOS) sind mit wenigen Ausnahmen verbindlich.» — [3]

> «Junge Erwachsene erhalten nur im Ausnahmefall Unterstützungsleistungen, die ein eigenständiges Wohnen ausserhalb des Elternhauses ermöglichen.» — [2], § 93 Abs. 1bis ⟨ergänzt 09.11.2026, Fachprüfung⟩

### Was Geld oder Rechte kosten kann
- **Rückerstattung (rechtmässig bezogen):** bei realisierbarem Vermögen, Vorschuss auf Versicherungsleistungen, Erbschaft/Lotteriegewinn («gemäss … SKOS-Richtlinien»), und auch bei sehr günstigen Verhältnissen aus eigener Arbeit; Erben haften aus dem Nachlass; Minderjährige/Erstausbildung ausgenommen; Härtefall-Verzicht möglich. Verwirkung: Frist im Gesetz (§ 15).
  > «Personen, die Geldleistungen der Sozialhilfe erhalten haben, sind zur Rückerstattung verpflichtet, sofern: … d) infolge von Einkünften aus eigener Arbeitsleistung derart günstige Verhältnisse vorliegen, dass ein Verzicht auf Rückerstattung als unbillig erscheint.» — [1], § 14 Abs. 1 lit. d
  > «Erben, durch ein Vermächtnis bedachte Personen sowie Begünstigte aus Lebensversicherungen sind zur Rückerstattung der von einer verstorbenen Person bezogenen Geldleistungen der Sozialhilfe verpflichtet, soweit sie aus dem Nachlass oder aus Begünstigungen von Lebensversicherungen geldwerte Leistungen erhalten haben.» — [1], § 14 Abs. 2
  > «Grundpfandlich sichergestellte Forderungen und Ansprüche auf Rückerstattung verwirken nicht.» — [1], § 15 Abs. 2
  ⟨ergänzt 09.11.2026, Fachprüfung⟩
  > «Die Rückerstattungsforderungen sind unverzinslich.» — [1], § 14 Abs. 1ter
  > «Der Kanton klärt periodisch die Voraussetzungen der Rückerstattung ab. Die Amtschreiberei zeigt dem Kanton die Inventare über den Vermögensnachlass an.» — [1], § 14 Abs. 3
  Ausnahme auch für Leistungen «während der Dauer der Teilnahme an einer beruflichen oder sozialen Integrationsmassnahme» — [1], § 14 Abs. 4.
- **Rückerstattung (unrechtmässig):** zurückzuerstatten, verzinslich ab Bezug, Verrechnung mit laufender Hilfe bis zu einer Grenze im Gesetz.
  > «Unrechtmässig, insbesondere aufgrund einer Verletzung der Auskunfts- und Meldepflichten, erwirkte Geldleistungen sind zurückzuerstatten.» — [1], § 164 Abs. 1
  > «Im Bereich der kommunal getragenen Sozialhilfe sind die Einwohnergemeinden für die periodische Prüfung der Voraussetzungen der Rückerstattung und die Durchführung des Rückerstattungsverfahrens zuständig.» — [1], § 164 Abs. 2quinquies ⟨ergänzt 09.11.2026, Fachprüfung⟩
- **Verwandtenunterstützung:** der **Kanton** (nicht die Gemeinde) prüft und setzt durch.
  > «Der Kanton prüft Ansprüche aus der Unterstützungspflicht der Verwandten und setzt sie durch, indem er mit pflichtigen Personen eine Vereinbarung trifft oder die erforderlichen zivilprozessualen Massnahmen ergreift.» — [1], § 154 Abs. 3
- **Aufenthaltsbewilligung:** keine allgemeine Meldepflicht jedes Bezugs im SG gefunden; belegt ist eine Meldung bei Integrationsdefizit und umgekehrt eine Meldung der Migrationsbehörde an die Sozialregion.
  > «Die Ansprechstelle für Integrationsfragen und die Sozialhilfebehörden melden der Migrationsbehörde Personen mit Integrationsdefizit gemäss den Weisungen des Departements.» — [1], § 121quinquies Abs. 1
  > «Die Migrationsbehörde meldet der Sozialregion den Abschluss einer Integrationsvereinbarung nach Artikel 58b AIG, sofern die betreffende Person Sozialhilfe bezieht.» — [1], § 124bis Abs. 2
- **Wohnsitzwechsel:** innerkantonal ZUG analog (§ 3 Abs. 3, s. oben). Keine weitergehende kantonale Umzugsregel zitiert.
- **Mitwirkung / Kürzung:** Mitwirkungs- und Meldepflichten § 17 (u. a. «eingetretene Änderungen umgehend mitzuteilen», lit. f); Sanktion:
  > «Eine Dienstleistung oder Sozialleistung kann befristet verweigert, gekürzt oder in schweren Fällen eingestellt werden, wenn die Verpflichtungen nach § 17 in unentschuldbarer Weise missachtet werden. Die betroffene Person muss vorher schriftlich auf die Rechtsfolgen hingewiesen werden.» — [1], § 165 Abs. 1
- **Abtretung / Sicherstellung:**
  > «Geldleistungen sind davon abhängig zu machen, dass die hilfesuchende Person vermögensrechtliche Ansprüche abtritt, soweit sie nicht von Gesetzes wegen übergehen, oder soweit realisierbare Vermögenswerte sich nicht grundpfandlich oder anders sicherstellen lassen.» — [1], § 153 Abs. 1
- **Auflagen / Gegenleistung:** § 148 Abs. 2 (Bedingungen und Auflagen, u. a. Arbeitssuche, Kurse, ärztliche Untersuchung).

### Offen / nicht gefunden
- Ob § 152 SG die SKOS-Richtlinien dynamisch (jeweils gültige Ausgabe) meint, steht nicht ausdrücklich im Text; keine Ausgabe genannt.
- Wer genau «das Amt» in SV § 92 ist, steht im gelesenen Text nicht wörtlich; die Zuordnung zum Amt für Gesellschaft und Soziales stammt von so.ch [3].
- Kantonales Sozialhilfehandbuch (https://sozialhilfehandbuch.so.ch/, 200; Gegenprobe 404) nicht inhaltlich ausgewertet.

### Quellen
1. Sozialgesetz (SG), BGS 831.1, Kantonsrat Solothurn, Stand 1. September 2026. https://bgs.so.ch/api/de/texts_of_law/831.1 (PDF https://bgs.so.ch/api/de/versions/5665/pdf_file_with_annexes; Version 2027: …/versions/5670/…) — abgerufen 09.11.2026, HTTP 200; Gegenprobe /api/de/texts_of_law/999.999 → 404
2. Sozialverordnung (SV), BGS 831.2, Regierungsrat Solothurn, Stand 1. April 2026. https://bgs.so.ch/api/de/texts_of_law/831.2 (PDF …/versions/5624/…) — abgerufen 09.11.2026, HTTP 200; Gegenprobe 999.999 → 404
3. «Sozialhilfe», Amt für Gesellschaft und Soziales, so.ch, ohne Datum. https://so.ch/verwaltung/departement-des-innern/amt-fuer-gesellschaft-und-soziales/sozialhilfe-und-asyl/sozialhilfe/ — abgerufen 09.11.2026, HTTP 200 (Titel «Sozialhilfe - Kanton Solothurn»); Gegenprobe /atlantis-gibt-es-nicht-4711/ → 404
4. «Ansprechstellen in der Sozialhilfe», so.ch, ohne Datum. https://so.ch/verwaltung/departement-des-innern/amt-fuer-gesellschaft-und-soziales/sozialhilfe-und-asyl/sozialhilfe/ansprechstellen-in-der-sozialhilfe/ — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [3] → 404 (Fundort: Websuche, Seite selbst abgerufen)

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** SO-1 Aufsicht falsch belegt (SV § 2 betrifft soziale Institutionen nach SG § 21; «Departement des Innern» steht nicht im Gesetz); SO-2 SKOS «ganz» zu stark; SO-3/SO-4 Ergänzungen.
- **Geändert:** Aufsicht auf SV § 92 Abs. 1 umgestellt, SKOS auf «grundsätzlich»; ergänzt SV § 93 Abs. 1bis, SG § 14 Abs. 1ter, Abs. 3, Abs. 4, § 164 Abs. 2quinquies. Alle neuen Zitate selbst an [1]/[2] (lokale PDFs aus eigenem Abruf) gegengelesen; SG § 21 Abs. 1 gelesen, bestätigt den Einwand.
- **Offen:** wie bisher — Zuordnung «das Amt» = AGS nur über so.ch; dynamischer SKOS-Verweis nicht ausdrücklich.

---

## BS — Basel-Stadt

**Beurteilung:** belegbar
**Zuständig (kurz):** Einwohnergemeinden; in der Stadt Basel der Kanton (Sozialhilfe Basel-Stadt, WSU); Riehen und Bettingen: Sozialhilfe Riehen (SHG § 22, § 23)
**Antrag (kurz):** Stadt Basel: Sozialhilfe, Klybeckstrasse 15 (Post, Briefkasten, Telefon, E-Mail, Schalter); Riehen/Bettingen: Sozialhilfe Riehen. Unterstützungsgesuch mit Verwandtenverzeichnis
**SKOS (kurz):** subsidiär/dynamisch — SHG § 7 Abs. 3 («orientiert sich»), ~~verbindlich gemacht über~~ angewendet über die Departementsrichtlinien ⟨korrigiert 09.11.2026, Fachprüfung⟩, Unterstützungsrichtlinien des WSU Ziff. 2 «Subsidiäre Anwendung der SKOS-RL»: SKOS «in der jeweils aktuellen Version», soweit SHG/URL nichts anderes vorsehen
**Aufsicht:** Oberaufsicht des zuständigen Departements (SHG § 26) = Departement für Wirtschaft, Soziales und Umwelt (WSU) — https://www.bs.ch/wsu
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Sozialhilfegesetz | SG 890.100 | «vom 29.06.2000, in Kraft seit: 01.07.2001»; PDF «Stand 1. Januar 2021» | https://www.gesetzessammlung.bs.ch/app/de/texts_of_law/890.100 | API 200, PDF 200; Gegenprobe 999.999 → 404 |
| Unterstützungsrichtlinien des WSU (URL) | keine Erlassnummer (nicht in der Gesetzessammlung; SHG § 7 Abs. 3 Fn. verweist aufs Internet) | «gültig ab 1. Januar 2026 (ersetzen die Unterstützungsrichtlinien gültig ab 1. Januar 2025)», unterzeichnet 9. Dezember 2025 | https://media.bs.ch/original_file/8ed016dbcae7b24e4bb7e4d333c71072442b2d80/unterstuetzungsrichtlinien-wsu-2026.pdf | 200 application/pdf; Gegenprobe media.bs.ch/original_file/000…/atlantis-gibt-es-nicht-4711.pdf → 404 |

Eine Sozialhilfeverordnung wurde in der Sammlung nicht gefunden (Nummern 890.101–890.150 probiert → 404; 890.500 Mietbeiträge, 890.700 Harmonisierung, 890.800 Asyl-Vertrag existieren). Querverweis ⟨ergänzt 09.11.2026, Fachprüfung⟩: SG 890.710 «Verordnung über die Harmonisierung und Koordination von bedarfsabhängigen Sozialleistungen», «vom 25.11.2008, in Kraft seit: 01.01.2009» (API 200) — nicht inhaltlich gelesen.

### Zuständigkeit und Antrag
> «Die öffentliche Sozialhilfe ist Aufgabe der Einwohnergemeinden. In der Stadt Basel tritt an die Stelle der Einwohnergemeinde der Kanton.» — [1], § 22 Abs. 1

> «Zuständig für die öffentliche Sozialhilfe im Kanton ist diejenige Einwohnergemeinde, in der die hilfesuchende Person ihren Unterstützungswohnsitz im Sinne des Bundesgesetzes über die Zuständigkeit für die Unterstützung Bedürftiger hat.» — [1], § 23 Abs. 1

> «Die öffentliche Sozialhilfe der Gemeinde Riehen hat die Aufgabe, bedürftige Einwohnerinnen und Einwohner von Riehen und Bettingen zu beraten …» — [6]

> «Sie können die Sozialhilfe per Post, über den Briefkasten vor Ort (Klybeckstrasse 15), per Telefon, E-Mail oder auch durch persönliches Erscheinen am Empfang kontaktieren.» — [4], S. 4

> «Füllen Sie deshalb auf dem Unterstützungsgesuch das Verwandtenverzeichnis vollständig aus» — [4], S. 2

### SKOS-Richtlinien
> «Das zuständige Departement regelt nach Rücksprache mit den Gemeinden das Mass der wirtschaftlichen Hilfe. Es orientiert sich dabei an den Richtlinien der Schweizerischen Konferenz für Sozialhilfe.» — [1], § 7 Abs. 3

> «Die von der Schweizerischen Konferenz für Sozialhilfe verabschiedeten Richtlinien für die Ausgestaltung und Bemessung der Sozialhilfe (SKOS-RL) finden in der jeweils aktuellen Version Anwendung, soweit nicht das Sozialhilfegesetz oder die vorliegenden Unterstützungsrichtlinien abweichende Bestimmungen vorsehen.» — [2], Ziff. 2

Abweichungen regeln die URL selbst (u. a. Grundbedarf, Wohnkosten-Grenzwerte, junge Erwachsene, Kürzung, Integrationszulagen, Vermögen; Asylbereich in Anhang I/II); Beträge hier bewusst nicht übernommen.

### Was Geld oder Rechte kosten kann
- **Rückerstattung bei Vermögen / aus Nachlass:**
  > «Wenn die unterstützte Person zu erheblichem Vermögen gelangt oder wenn sie nach ihrem Tode Vermögen hinterlässt, ist die für sie selbst, den Ehegatten, unmündige Kinder oder für die eingetragene Partnerin oder den eingetragenen Partner bezogene wirtschaftliche Hilfe bis zur Höhe des erhaltenen Vermögens oder des Nachlasses zurückzuerstatten.» — [1], § 17 Abs. 1
  Ausgenommen: ~~Hilfe vor dem 18. Altersjahr~~ Hilfe bis zu einer Altersgrenze im Gesetz ⟨korrigiert 09.11.2026, Fachprüfung⟩ und für die Erstausbildung (§ 17 Abs. 2–3). Erben haften nur bis zur Erbschaft (§ 18).
  ⟨ergänzt 09.11.2026, Fachprüfung⟩ > «Behinderungsspezifische Leistungen werden weder gestützt auf § 17 noch § 18 zurückgefordert.» — [1], § 2a Abs. 3
- **Rückerstattung bei nachträglichen Leistungen Dritter** ⟨ergänzt 09.11.2026, Fachprüfung⟩: Verrechnung bzw. Rückerstattung, wenn für die Bezugszeit Sozialversicherungs-, Unterhalts- oder andere Drittleistungen nachträglich ausgerichtet werden ([1], § 16 Abs. 1).
- **Rückerstattung bei unrechtmässigem Bezug:** § 19 Abs. 1; Erlass bei Gutgläubigkeit und grosser Härte auf Gesuch (§ 19 Abs. 2); Erlassgesuch Frist in den URL [2], Ziff. 16.
- **Verzinsung:** auch bei rechtmässigem Bezug ab Geltendmachung, bei unrechtmässigem ab Bezug; Zinssatz vom Departement festgelegt (in den URL).
  > «Die Rückerstattungsforderung ist ab Geltendmachung der Rückforderung verzinslich, sofern die wirtschaftliche Hilfe rechtmässig bezogen wurde. Andernfalls ist sie ab Bezug zu verzinsen.» — [1], § 20
- **Verjährung:** Fristen im Gesetz (§ 21 Abs. 1); grundpfandgesicherte Rückforderung verjährt nicht (§ 21 Abs. 2).
- **Verwandtenunterstützung:** wird von der Sozialhilfe geltend gemacht, Mass nach SKOS-orientierter Departementsregelung.
  > «Die Sozialhilfestelle hat die pflichtigen Personen anzuhalten, die Unterstützungskosten soweit sie zum eigentlichen Lebensunterhalt bestimmt sind, ganz oder teilweise zu ersetzen, wenn es der Billigkeit entspricht.» — [1], § 15 Abs. 2
  > «Die Sozialhilfe prüft von sich aus, ob Ihre Verwandten Sie unterstützen müssen.» — [4], S. 2
- **Aufenthaltsbewilligung:** kantonale Quelle nennt eine **automatische Meldung an das Migrationsamt**.
  > «Die Sozialhilfe ist zudem verpflichtet, dem Migrationsamt automatisch alle ausländischen Personen zu melden, die Sozialhilfe- oder Nothilfeleistungen beziehen.» — [4], S. 4
  > «Der Bezug von Sozialhilfeleistungen kann bei der Erteilung / Verlängerung der Bewilligung, beim Familiennachzug und bei einem allfälligen Kantonswechsel ein Nachteil sein.» — [5], S. 1
  ⟨ergänzt 09.11.2026, Fachprüfung⟩ Bei Leistungen ohne Anspruch wegen Pflichtverletzung:
  > «Die Sozialhilfe muss in diesen Fällen zudem Strafanzeige erstatten. Eine Verurteilung wegen unrechtmässigem Sozialhilfebezug hat für Ausländer:innen grundsätzlich zur Folge, dass sie aus der Schweiz weggewiesen werden können.» — [4], S. 3
  Hinweis: Die Meldepflicht an das Migrationsamt beruht vermutlich auf Bundesrecht (nicht geprüft); dass andere Kantone sie in ihren Quellen nicht nennen, heisst nicht, dass dort keine Meldung erfolgt.
- **Wohnsitzwechsel:** Zuständigkeit nach ZUG (§ 23 Abs. 1); Sonderregel bei behördlicher Wohnungszuweisung:
  > «Personen, denen von einer Sozialhilfestelle oder einer anderen Stelle mit öffentlichem Auftrag ein Wohnsitz in einer anderen Gemeinde des Kantons zugewiesen wird, unterstehen noch während zwei Jahren der bisher zuständigen Sozialhilfestelle.» — [1], § 23 Abs. 3
  ⟨ergänzt 09.11.2026, Fachprüfung⟩ Notfall / kein Wohnsitz:
  > «Ist eine hilfesuchende Person ausserhalb ihres Unterstützungswohnsitzes auf sofortige Hilfe angewiesen oder hat sie keinen sofort feststellbaren Wohnsitz, so leistet die Sozialhilfe der Stadt Basel Hilfe.» — [1], § 23 Abs. 2
- **Meldepflicht / Kürzung:**
  > «Alle Änderungen in diesen Verhältnissen sind der Sozialhilfestelle unverzüglich zu melden.» — [1], § 14 Abs. 2
  > «Verletzt die unterstützte Person schuldhaft diese Pflichten, ist die wirtschaftliche Hilfe zu kürzen, wobei die Deckung des unmittelbaren Lebensbedarfs gesichert bleiben muss.» — [1], § 14 Abs. 4
- **Abtretung:** Gewährung kann von Abtretung von Ansprüchen gegenüber Dritten abhängig gemacht werden; bevorschusste Versicherungsleistungen gehen über (§ 12). Grundeigentum: Hypothek zugunsten der Sozialhilfe möglich [4], S. 2.

### Offen / nicht gefunden
- Gemeinde Bettingen: bettingen.ch mit curl nicht erreichbar (HTTP 000, auch Gegenprobe) → nicht messbar; Zuständigkeit für Bettingen nur über die Riehener Seite belegt [6].
- Rechtsnatur der URL: Departementsrichtlinie, nicht in der Gesetzessammlung; ihre Verbindlichkeit stützt sich auf SHG § 7 Abs. 3.
- Handbuch der Sozialhilfe (Stand 09.2026) verlinkt, nicht ausgewertet.

### Quellen
1. Sozialhilfegesetz, SG 890.100, Grosser Rat Basel-Stadt, Stand 1. Januar 2021. https://www.gesetzessammlung.bs.ch/api/de/texts_of_law/890.100 (PDF …/api/de/versions/5128/pdf_file_with_annexes) — abgerufen 09.11.2026, HTTP 200; Gegenprobe /api/de/texts_of_law/999.999 → 404
2. Unterstützungsrichtlinien des Departements für Wirtschaft, Soziales und Umwelt, gültig ab 1. Januar 2026. https://media.bs.ch/original_file/8ed016dbcae7b24e4bb7e4d333c71072442b2d80/unterstuetzungsrichtlinien-wsu-2026.pdf — abgerufen 09.11.2026, HTTP 200; Gegenprobe erfundene Datei auf media.bs.ch → 404
3. «Rechtliche Grundlagen und Handbuch», Sozialhilfe Basel-Stadt, aktualisiert 04.11.2026. https://www.bs.ch/wsu/sozialhilfe/rechtliche-grundlagen-und-handbuch — abgerufen 09.11.2026, HTTP 200; Gegenprobe https://www.bs.ch/atlantis-gibt-es-nicht-4711 → 404
4. Merkblatt «Unterstützung durch die Sozialhilfe», WSU (Dateiname 09-25). https://media.bs.ch/original_file/bd61edafb3e59e38e5c17eca415607b5f2d80568/merkblatt-unterstuetzung-durch-die-sozialhilfe-09-25-neu-0.pdf — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [2] → 404
5. Merkblatt «Ausländer:innen in der allgemeinen Sozialhilfe», WSU, Fusszeile «Stand URL 2025». https://media.bs.ch/original_file/59a7d7a0bd1722894d6d9dbabf968d44ba26c6a9/14-merkblatt-auslaenderinnen-in-der-allgemeinen-sozialhilfe.pdf — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [2] → 404
6. «Sozialhilfe», Gemeinde Riehen. https://www.riehen.ch/sozialhilfe — abgerufen 09.11.2026, HTTP 200; Gegenprobe /atlantis-gibt-es-nicht-4711 → 404
7. «Sozialhilfe» und «Finanzielle Unterstützung und persönliche Beratung», bs.ch. https://www.bs.ch/wsu/sozialhilfe und https://www.bs.ch/wsu/sozialhilfe/finanzielle-unterstuetzung-und-persoenliche-beratung — abgerufen 09.11.2026, beide HTTP 200; Gegenprobe wie [3] → 404
8. Verordnung über die Harmonisierung und Koordination von bedarfsabhängigen Sozialleistungen, SG 890.710. https://www.gesetzessammlung.bs.ch/api/de/texts_of_law/890.710 — abgerufen 09.11.2026, HTTP 200; Gegenprobe 999.999 → 404

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** BS-1 Folge für Ausländer:innen (Strafanzeige/Wegweisung) fehlte; BS-2 «verbindlich gemacht» zu stark; BS-3 § 2a Abs. 3, § 16, § 23 Abs. 2 fehlten; BS-4 Querverweis 890.710; K2 Altersgrenze ausserhalb Zitat; K1 Migrationsamt-Meldung nicht als Kantonsunterschied lesen.
- **Geändert:** alles eingearbeitet; Strafanzeige-Zitat im Merkblatt [4] (eigener Abruf, S. 3) wörtlich bestätigt; § 2a Abs. 3 und § 23 Abs. 2 an [1] bestätigt; 890.710 per API selbst abgerufen (200).
- **Offen:** Rechtsgrundlage der Meldung an das Migrationsamt (vermutlich Bundesrecht) nicht geprüft; 890.710 inhaltlich nicht gelesen.

---

## BL — Basel-Landschaft

**Beurteilung:** teilweise
**Zuständig (kurz):** Gemeinde am Unterstützungswohnsitz (ohne solchen: Aufenthaltsort), Vollzug durch die Sozialhilfebehörde der Gemeinde (SHG § 4a, § 31, § 37)
**Antrag (kurz):** bei der Sozialhilfebehörde der zuständigen Gemeinde; amtliches Verzeichnis der Sozialdienste nicht geprüft (baselland.ch mit curl nicht messbar)
**SKOS (kurz):** eigene Ansätze — Regierungsrat regelt das Mass und «kann sich … orientieren» (SHG § 6 Abs. 3); die SHV verweist nirgends auf die SKOS
**Aufsicht:** Kanton (SHG § 42), Vollzug Kantonsaufgaben durch das Kantonale Sozialamt (SHV § 2 Abs. 2) — Amtsseite auf baselland.ch: mit curl nicht messbar (Cloudflare 403)
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die Sozial- und die Jugendhilfe (Sozialhilfegesetz, SHG) | SGS 850 | «vom 21.06.2001, in Kraft seit: 01.01.2002»; PDF «Stand 1. Januar 2025» | https://bl.clex.ch/app/de/texts_of_law/850 | API 200, PDF 200; Gegenprobe 999.999 → 404 |
| Sozialhilfeverordnung (SHV) | SGS 850.11 | «vom 25.09.2001, in Kraft seit: 01.01.2002»; PDF «Stand 1. Januar 2025» | https://bl.clex.ch/app/de/texts_of_law/850.11 | API 200, PDF 200; Gegenprobe 404 |

### Zuständigkeit und Antrag
> «Zuständig für die hilfesuchenden Personen ist die Gemeinde am Unterstützungswohnsitz der hilfesuchenden Person. Bei Personen ohne Unterstützungswohnsitz ist die Gemeinde am Aufenthaltsort der hilfesuchenden Person zuständig.» — [1], § 4a Abs. 1

> «Die Gemeinden bestellen eine besondere Behörde für den Vollzug der Gemeindeaufgaben dieses Gesetzes (kurz: Sozialhilfebehörde).» — [1], § 37 Abs. 1

> «Die zuständige Gemeinde hat alle hilfesuchenden und hilfsbedürftigen Personen fachgerecht zu beraten, aktiv über ihre Rechte und Pflichten aufzuklären und im erforderlichen Umfang zu unterstützen.» — [1], § 4 Abs. 2

> «Das Kantonale Sozialamt (kurz: Amt) vollzieht die Kantonsaufgaben des Sozialhilfegesetzes.» — [2], § 2 Abs. 2

### SKOS-Richtlinien
> «Der Regierungsrat regelt das Mass der Unterstützungen und stuft sie nach der Grösse des Haushalts, Alterskategorie und weiteren Kriterien ab. Er kann sich dabei an den Richtlinien der Schweizerischen Konferenz für Sozialhilfe (SKOS) orientieren. Er passt die Unterstützung der Teuerung an. Betreffend die Teuerung übernimmt er die Empfehlungen der Konferenz der kantonalen Sozialdirektorinnen und Sozialdirektoren (SODK).» — [1], § 6 Abs. 3

Die Ansätze (Grundbedarf, freie Vermögensbeträge, Herabsetzung, Nothilfe, Freibeträge bei Vermögensanfall) stehen als eigene Zahlen in der SHV (§§ 9, 16, 18, 24); Volltextsuche nach «SKOS»/«Konferenz» in der SHV: 0 Treffer. Kantonale Besonderheiten im Gesetz: pauschale Minderung des Grundbedarfs bei Langzeitbezug (§ 6ter, Dauer im Gesetz, mit Ausnahmen), Regeln zum Motorfahrzeug (§ 6a), Konkubinat (§§ 7a, 8).

### Was Geld oder Rechte kosten kann
- **Rückerstattung bei Leistungen Dritter:** § 12 Abs. 1; Verjährung Frist im Gesetz (§ 12 Abs. 3).
- **Rückerstattung bei Vermögensanfall:** nur bei «erheblichem Vermögen»; Freibeträge im Erlass (SHV § 24); junge Erwachsene bis zu einer Altersgrenze im Gesetz ausgenommen (§ 14a); Verjährung: Frist im Gesetz (§ 13 Abs. 3) ⟨ergänzt 09.11.2026, Fachprüfung⟩. Kontext: Vademecum nennt «2023/725, Neuregelung der Rückerstattungspflicht von Sozialhilfeleistungen», in Kraft 01.01.2025 ⟨ergänzt 09.11.2026, Fachprüfung⟩.
  > «Die unterstützte Person ist verpflichtet, bezogene Unterstützungen zurückzuerstatten, wenn sie zu erheblichem Vermögen gelangt (Vermögensanfall).» — [1], § 13 Abs. 1
  > «Die Rückerstattungsschuld ist unverzinslich. Sie ist in dem Umfang vererblich, soweit sie die Erbschaft nicht überschuldet.» — [1], § 14 Abs. 2
  > «Freizügigkeitsleistungen und Leistungen der gebundenen Vorsorge 3a können nicht zur Rückerstattung herangezogen werden.» — [2], § 24 Abs. 3
- **Rückerstattung bei unrechtmässigem Bezug:** mit Zins (Satz im Gesetz), Verrechnung mit laufender Unterstützung bis zu einer Grenze im Gesetz, Erlass bei grosser Härte auf Gesuch (§ 13a).
- **Grundpfand:** «Die unterstützte Person ist verpflichtet, die Rückerstattungsschuld gegebenenfalls grundpfandrechtlich zu sichern.» — [1], § 14 Abs. 1
- **Verwandtenunterstützung:** im kantonalen Recht nur negativ geregelt:
  > «Die Unterstützungspflicht der Verwandten gilt nicht als gesetzliche Leistung Dritter.» — [1], § 5 Abs. 2
  Das Vademecum zum SHG nennt die Landratsvorlage «2013/067, Aufhebung Verwandtenunterstützungspflicht» (GS 38.0229, in Kraft 01.01.2014). Laut Änderungstabelle änderte GS 38.0229 nur § 5 Abs. 1–2, § 11 Abs. 2 lit. b und § 33 ⟨ergänzt 09.11.2026, Fachprüfung, an [1] selbst gegengelesen⟩. Die Unterstützungspflicht nach ZGB 328/329 ist Bundesrecht und bleibt davon unberührt. Ob und wie Gemeinden sie heute geltend machen: in den kantonalen Quellen nicht belegt.
- **Aufenthaltsbewilligung:** in den kantonalen Quellen nicht genannt (keine Meldepflicht an das Migrationsamt im SHG/SHV gefunden). Belegt ist nur der Leistungsausschluss mit Nothilfe-Vorbehalt:
  > «Unter Vorbehalt von Abs. 2 werden keine materiellen Unterstützungen gewährt an: a. Personen ohne Anwesenheitsbewilligung in der Schweiz oder im Kanton, b. Ausländerinnen und Ausländer, die sich lediglich zum Zweck der Stellensuche in der Schweiz aufhalten sowie deren Familienangehörige, …» — [1], § 4c Abs. 1
- **Wohnsitzwechsel:** ZUG sinngemäss (§ 4a Abs. 2); innerkantonal entschädigt die Wohnsitzgemeinde die unterstützende Gemeinde (SHV § 23); bei Wegzug übernimmt die bisherige Gemeinde Umzugskosten und Überbrückungsposten (SHV § 15 Abs. 1 lit. k, Abs. 2 lit. a).
- **Mitwirkung / Kürzung:** Herabsetzung nach Verschulden bis zur Nothilfe (§ 11 Abs. 3); Höchstmass, Androhung und Befristung in SHV § 18. «Bei unklarer Bedürftigkeit werden materielle Unterstützungen verweigert oder eingestellt.» — [1], § 4b
- **Missbrauchsbekämpfung** ⟨ergänzt 09.11.2026, Fachprüfung⟩: bei begründetem Verdacht Leistungsabklärungen durch externe Personen, ohne Einwilligung, bis hin zur Überwachung.
  > «Zur Missbrauchsbekämpfung können die Sozialhilfebehörden, ohne Ermächtigung der unterstützten Person, externe Personen mit Leistungsabklärungen betrauen, wenn: …» — [1], § 42a Abs. 2

### Offen / nicht gefunden
- baselland.ch (Themenseite Sozialhilfe, Sozialamt) antwortet curl mit Cloudflare-Schranke 403 «Just a moment…» — auch die Gegenprobe → **mit curl nicht messbar**, nicht «tot». Damit fehlen geprüfte Amtsseite, Antragsweg-Seite und Gemeindeverzeichnis.
- Zugehörige Direktion des Kantonalen Sozialamts nicht belegt (~~SHV § 34 nennt historisch die Finanz- und Kirchendirektion~~ die geltende SHV nennt die Finanz- und Kirchendirektion in § 34 und in einer laufenden Bestimmung zu Zahnarztkosten, § 14 Abs. 3: «Die Finanz- und Kirchendirektion und die Volkswirtschafts- und Gesundheitsdirektion bestimmen gemeinsam …» ⟨korrigiert 09.11.2026, Fachprüfung⟩; dass das Sozialamt zu dieser Direktion gehört, steht damit nicht fest).
- Fassung vor 2014 (vor Aufhebung der Verwandtenunterstützungspflicht) nicht in der Online-Sammlung (ältestes Online-Stadium ab 01.01.2014).

### Quellen
1. Gesetz über die Sozial- und die Jugendhilfe (SHG), SGS 850, Landrat BL, Stand 1. Januar 2025. https://bl.clex.ch/api/de/texts_of_law/850 (PDF …/api/de/versions/3994/pdf_file_with_annexes) — abgerufen 09.11.2026, HTTP 200; Gegenprobe /api/de/texts_of_law/999.999 → 404 (auch /atlantis-gibt-es-nicht-4711 → 404)
2. Sozialhilfeverordnung (SHV), SGS 850.11, Regierungsrat BL, Stand 1. Januar 2025. https://bl.clex.ch/api/de/texts_of_law/850.11 (PDF …/versions/4111/…) — abgerufen 09.11.2026, HTTP 200; Gegenprobe 999.999 → 404
3. Themenseite Sozialhilfe, baselland.ch. https://www.baselland.ch/themen/sozialhilfe — abgerufen 09.11.2026, HTTP 403 (Cloudflare); Gegenprobe /atlantis-gibt-es-nicht-4711 → 403 → mit curl nicht messbar

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** BL-1 Gruppen-Notiz zur «Aufhebung der Verwandtenunterstützungspflicht» überzeichnet (ZGB ist Bundesrecht); BL-2 «historisch» bei der Finanz- und Kirchendirektion falsch; BL-3 § 42a, Verjährung § 13 Abs. 3, Neuregelung 2023/725 fehlten.
- **Geändert:** Kantonsabschnitt und Gruppen-Notiz vorsichtig gefasst (nur Vademecum-Titel + geänderte Paragrafen laut Änderungstabelle, selbst gegengelesen); «historisch» gestrichen, SHV § 14 Abs. 3 selbst bestätigt; § 42a Abs. 2 und Vademecum-Eintrag 2023/725 an [1] bestätigt.
- **Offen:** baselland.ch weiter nicht messbar; Direktionszuordnung des Sozialamts; Inhalt der Vorlage 2013/067 und 2023/725 nicht gelesen.

---

## SH — Schaffhausen

**Beurteilung:** belegbar
**Zuständig (kurz):** Gemeinde am Unterstützungswohnsitz (ohne Wohnsitz/Notfall: Aufenthaltsgemeinde); Sozialhilfebehörde ist der Gemeinderat oder eine separate Behörde (SHEG Art. 8, 14)
**Antrag (kurz):** formloses Gesuch bei der Sozialhilfebehörde des Wohn- oder Aufenthaltsortes (SHEG Art. 32); kantonales Verzeichnis der Gemeinde-Sozialdienste nicht gefunden
**SKOS (kurz):** eigene Ansätze in Anlehnung — verbindliche «Schaffhauser Richtlinien für die Bemessung der Sozialhilfe» des Departements (SHEG Art. 25 Abs. 3), «in Anlehnung an» die SKOS; Grundbedarf vom Kantonsrat genehmigt (SHR 850.110). SHEG/SHEV nennen die SKOS nicht
**Aufsicht:** Regierungsrat (SHEG Art. 15 Abs. 1); Departement des Innern (SHEV § 5); Kantonales Sozialamt als kantonales Organ (SHEV § 6) — https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Verwaltung/Departement-des-Innern/Sozialamt-2795-DE.html
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die öffentliche Sozialhilfe und soziale Einrichtungen (SHEG) | SHR 850.100 | «vom 28.10.2013, in Kraft seit: 01.01.2014»; PDF «Stand 1. Juli 2018» | https://rechtsbuch.sh.ch/app/de/texts_of_law/850.100 | API 200, PDF 200; Gegenprobe 999.999 → 404 |
| Verordnung über die öffentliche Sozialhilfe und soziale Einrichtungen (SHEV) | SHR 850.111 | «vom 18.02.2014, in Kraft seit: 01.01.2014»; PDF «Stand 1. Juli 2018» | https://rechtsbuch.sh.ch/app/de/texts_of_law/850.111 | API 200, PDF 200; Gegenprobe 404 |
| Beschluss über die Genehmigung der Änderungen beim Grundbedarf … gemäss Art. 25 Abs. 3 SHEG | SHR 850.110 | «vom 16.12.2024, in Kraft seit: 01.01.2025» | https://rechtsbuch.sh.ch/app/de/texts_of_law/850.110 | API 200, PDF 200; Gegenprobe 404 |
| Schaffhauser Richtlinien für die Bemessung der Sozialhilfe (Departement des Innern) | keine Erlassnummer | «gültig ab 1.1.2025» — ⟨ergänzt 09.11.2026, Fachprüfung⟩ **Aktualität nicht bestätigt**: Fundort Websuche; die Sozialamt-Seite verlinkt diese Datei nicht, sondern nur «Richtlinien - Bemessung Sozialhilfe 2020», «Richtlinien Bemessung Sozialhilfe 2020&2021», «Richtlinien Sozialhilfe 2023/2024» | https://sh.ch/CMS/get/file/e4f4617a-6a19-4b28-aa25-81dfbc654f3c | 200 application/pdf; Gegenprobe sh.ch/CMS/get/file/00000000-0000-0000-0000-000000004711 → 404 |

### Zuständigkeit und Antrag
> «Die Zusprechung von Leistungen der öffentlichen Sozialhilfe an zu unterstützende Personen obliegt der Gemeinde im Kanton, in der die zu unterstützende Person ihren Unterstützungswohnsitz hat.» — [1], Art. 8 Abs. 1

> «Sozialhilfebehörde jeder Gemeinde ist der Gemeinderat. Die Gemeinde kann eine separate Sozialhilfebehörde bestellen, welche von einem Mitglied des Gemeinderates präsidiert wird.» — [1], Art. 14 Abs. 1

> «Jede kantonale und kommunale Behörde oder Amtsstelle, welche im Rahmen ihrer Tätigkeit von der Hilfsbedürftigkeit einer Person Kenntnis erhält, hat diese auf die Möglichkeit hinzuweisen, sich mit einem Gesuch um Hilfe an die Sozialhilfebehörde ihres Wohn- oder Aufenthaltsortes zu wenden.» — [1], Art. 32 Abs. 1

> «Das Gesuch um materielle oder persönliche Sozialhilfe kann formlos gestellt werden.» — [1], Art. 32 Abs. 2

### SKOS-Richtlinien
> «Das zuständige Departement legt verbindliche Richtlinien für die Bemessung der materiellen Hilfe fest. Änderungen beim Grundbedarf für den Lebensunterhalt werden durch den Kantonsrat genehmigt.» — [1], Art. 25 Abs. 3

> «gestützt auf Art. 25 Abs. 3 des Gesetzes über die öffentliche Sozialhilfe und soziale Einrichtungen (SHEG) vom 28. Oktober 2013 und in Anlehnung an die Richtlinien der Schweizerischen Konferenz für Sozialhilfe (SKOS)» — [4], Titelblatt

> «Die anrechenbaren Kosten der Sozialhilfe richten sich nach den Schaffhauser Richtlinien für die Bemessung der Sozialhilfe und den weiteren kantonalen Weisungen.» — [2], § 31 Abs. 1

⟨ergänzt 09.11.2026, Fachprüfung⟩ SHEV § 31 steht unter «4.5 Finanzierung» und regelt die Kostenabrechnung zwischen Gemeinden und Kanton, nicht die Bemessung — nur Nebenbeleg für die Existenz der Richtlinien. Tragender Beleg für die Verbindlichkeit ist SHEG Art. 25 Abs. 3.

Volltextsuche «SKOS»/«Konferenz für Sozialhilfe» in SHEG, SHEV und 850.110: 0 Treffer. Die SKOS wirken nur mittelbar über die kantonalen Richtlinien («in Anlehnung»); Grundbedarf eigens per Kantonsratsbeschluss [3].

### Was Geld oder Rechte kosten kann
- **Rückerstattung (rechtmässig):** nur bei Erbschaft, Lotteriegewinn u. ä. — **nicht** bei eigenem Erwerbseinkommen; Minderjährigkeit/Erstausbildung bis zu einer Altersgrenze im Gesetz ausgenommen.
  > «Rechtmässig bezogene materielle Hilfe ist nur dann zurückzuerstatten, wenn die unterstützte Person aus Erbschaft, Lotteriegewinn oder anderen, nicht auf eigene Arbeitsleistung zurückzuführenden Gründen in wirtschaftlich günstige Verhältnisse gelangt ist.» — [1], Art. 31 Abs. 2
- **Umfang der Rückerstattung** ⟨ergänzt 09.11.2026, Fachprüfung⟩:
  > «Der Rückerstattungsanspruch erstreckt sich auf Leistungen, welche die unterstützte Person für sich selbst, für ihren Ehegatten während der Ehe, für ihre eingetragene Partnerin oder ihren eingetragenen Partner während der Dauer der eingetragenen Partnerschaft und für ihre Kinder während ihrer Unmündigkeit erhalten hat.» — [1], Art. 31 Abs. 3bis
- **Rückerstattung (unrechtmässig):** «Unrechtmässig bezogene Leistungen sind zurückzuerstatten. Wer Leistungen in gutem Glauben empfangen hat, muss sie nicht zurückerstatten, wenn eine grosse Härte vorliegt.» — [1], Art. 31 Abs. 1. Zins nur bei ungerechtfertigtem Bezug; Verjährung/Erlöschen: Fristen im Gesetz (Art. 31 Abs. 4).
- **Grundpfand / Sicherstellung:** bei nicht realisierbarem Vermögen Rückerstattungsverpflichtung, wenn möglich grundpfandgesichert (Art. 31 Abs. 3); grundpfandgesicherte Forderungen verjähren nicht (Art. 31 Abs. 4).
- **Verwandtenunterstützung:**
  > «Um finanzielle Beiträge sind lediglich unterstützungspflichtige Verwandte anzuhalten, die in günstigen wirtschaftlichen Verhältnissen leben.» — [1], Art. 30 Abs. 2
  Rücksicht auf familiäre Beziehungen vor Aufforderung/Klage (Art. 30 Abs. 3); Rechtshilfe der Gemeinden bei der Geltendmachung (Art. 32a lit. c).
- **Aufenthaltsbewilligung:** Meldepflicht an das Migrationsamt in den kantonalen Quellen nicht genannt. Belegt sind nur:
  > «Für Ausländerinnen und Ausländer sind die Bestimmungen über den Widerruf von Anwesenheitsbewilligungen sowie über die Aus- oder Wegweisung und die Heimschaffung vorbehalten.» — [1], Art. 10 Abs. 3
  > «Bei fehlender Aufenthaltsbewilligung wird grundsätzlich Nothilfe gewährt.» — [1], Art. 25 Abs. 5
- **Zuständigkeitsstreit bei KESB-Massnahmen** ⟨ergänzt 09.11.2026, Fachprüfung⟩:
  > «Ist der Vollzug einer durch KESB-Beschluss verfügten Massnahme aufgrund fehlender Zusprechung von Leistungen der öffentlichen Sozialhilfe gefährdet, obliegt die Zusprechung von Leistungen der Sozialhilfe bis zur Klärung der Zuständigkeit dem Kanton.» — [1], Art. 8 Abs. 4
- **Wohnsitzwechsel:** innerkantonal ZUG sinngemäss (Art. 8 Abs. 3); Abschiebungsverbot (Art. 10 Abs. 1–2); bei Wegzug trägt die bisherige Gemeinde Übergangskosten:
  > «Ziehen unterstützte Personen aus einer Gemeinde (bzw. aus dem Kanton) weg, so hat die bisherige Wohngemeinde im Rahmen der Sozialhilfe folgende Kosten zu decken:» — [4], Kap. C.1.12 (Lebensunterhalt für einen Übergangsmonat, Umzug, erster Mietzins, Einrichtung)
- **Mitwirkung / Kürzung:** Auskunfts- und unaufgeforderte Meldepflicht inkl. Einsicht in Steuerakten (Art. 26 Abs. 1); Kürzung bis zu einer Grenze im Gesetz, in schweren Fällen Verweigerung, vorher rechtliches Gehör (Art. 26 Abs. 4).
- **Sozialhilfeinspektion:** Abklärungen durch Polizei/Dritte bei begründetem Missbrauchsverdacht, inkl. Hausbesuche und Bildaufnahmen im öffentlichen Raum (Art. 18).
- **Abtretung / Übergang:** Nachzahlungen der Sozialversicherung gehen an die Sozialhilfebehörde über (Art. 28 Abs. 1); Abtretung von Drittansprüchen kann verlangt werden (Art. 28 Abs. 3).

### Offen / nicht gefunden
- Kantonales Verzeichnis der Gemeinde-Sozialdienste: nicht gefunden.
- Online-Sozialhilfehandbuch (Weiterleitung auf https://sh.lexican.cloud/Project/Details/5bc7c897-…): JS-Anwendung, erfundene ID liefert ebenfalls 200 (Soft-404) → mit curl nicht messbar, Inhalt nicht gelesen.
- sh.ch: erfundener Pfad unter Wurzel → Weiterleitung auf Startseite 200 (Soft-404, Titel «Kanton Schaffhausen»); erfundener CMS-Pfad → 500. Die Sozialamt-Seite ist nur über den eigenen Titel «Sozialamt» unterscheidbar.
- SHEG/SHEV-Stand 2018: neuere Revisionen nicht ersichtlich (API: keine zukünftigen Versionen).

### Quellen
1. Gesetz über die öffentliche Sozialhilfe und soziale Einrichtungen (SHEG), SHR 850.100, Kantonsrat SH, Stand 1. Juli 2018. https://rechtsbuch.sh.ch/api/de/texts_of_law/850.100 (PDF …/api/de/versions/1705/pdf_file_with_annexes) — abgerufen 09.11.2026, HTTP 200; Gegenprobe /api/de/texts_of_law/999.999 → 404
2. Verordnung über die öffentliche Sozialhilfe und soziale Einrichtungen (SHEV), SHR 850.111, Regierungsrat SH, Stand 1. Juli 2018. https://rechtsbuch.sh.ch/api/de/texts_of_law/850.111 (PDF …/versions/1798/…) — abgerufen 09.11.2026, HTTP 200; Gegenprobe 999.999 → 404
3. Beschluss über die Genehmigung der Änderungen beim Grundbedarf, SHR 850.110, Kantonsrat SH, 16.12.2024, in Kraft 01.01.2025. https://rechtsbuch.sh.ch/api/de/texts_of_law/850.110 (PDF …/versions/1933/…) — abgerufen 09.11.2026, HTTP 200; Gegenprobe 999.999 → 404
4. Schaffhauser Richtlinien für die Bemessung der Sozialhilfe, Departement des Innern, gültig ab 1.1.2025. https://sh.ch/CMS/get/file/e4f4617a-6a19-4b28-aa25-81dfbc654f3c — abgerufen 09.11.2026, HTTP 200 application/pdf; Gegenprobe /CMS/get/file/00000000-0000-0000-0000-000000004711 → 404. ⟨ergänzt 09.11.2026, Fachprüfung⟩ Fundort: Websuche (sh.ch), nicht von der Sozialamt-Seite verlinkt; Aktualität nicht bestätigt, bis das Sozialamt sie bestätigt.
5. Sozialamt, Kanton Schaffhausen. https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Verwaltung/Departement-des-Innern/Sozialamt-2795-DE.html — abgerufen 09.11.2026, HTTP 200 (Titel «Sozialamt»); Gegenprobe …/Departement-des-Innern/Atlantis-9999999-DE.html → 500; /atlantis-gibt-es-nicht-4711 → Weiterleitung Startseite 200 (Soft-404)

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** SH-1 Fundort der Richtlinien 2025 fehlte, Sozialamt-Seite verlinkt nur ältere Fassungen; SH-2 SHEV § 31 ist kein Bemessungsbeleg; SH-3 Art. 8 Abs. 4 und Art. 31 Abs. 3bis fehlten.
- **Geändert:** Fundort (Websuche) und «Aktualität nicht bestätigt» in Tabelle und Quelle [4]; die drei Linktitel der Sozialamt-Seite in der eigenen Kopie (sh-sozialamt.html) bestätigt; § 31 als Nebenbeleg markiert (Abschnitt «4.5 Finanzierung» selbst gelesen); Art. 8 Abs. 4 und Art. 31 Abs. 3bis an [1] wörtlich bestätigt.
- **Offen:** Ob die Fassung «gültig ab 1.1.2025» die geltende ist — beim kantonalen Sozialamt bestätigen lassen. Beurteilung bleibt «belegbar», weil die Verbindlichkeit der Richtlinien auf SHEG Art. 25 Abs. 3 beruht; der SKOS-Bezug («in Anlehnung») hängt aber an dieser unbestätigten Fassung.

---

## AR — Appenzell Ausserrhoden

**Beurteilung:** belegbar
**Zuständig (kurz):** Gemeinde am Unterstützungswohnsitz (ohne Wohnsitz/Notfall: Aufenthaltsgemeinde); Sozialhilfebehörde und Sozialdienst der Gemeinde, allein oder im Verbund (SHG Art. 3, 8, 9)
**Antrag (kurz):** beim Sozialamt/Sozialdienst der Wohngemeinde; Verfahren durch die Person selbst oder die Gemeinde eingeleitet (SHG Art. 29); amtliche Liste «Adressen Sozialämter» auf ar.ch (geprüft, 200)
**SKOS (kurz):** ganz, verbindlich mit Vorbehalten — SHV Art. 3 («sind verbindlich, soweit … keine andere Regelung … oder besondere Umstände ein Abweichen rechtfertigen»); keine Ausgabe genannt
**Aufsicht:** zuständiges Departement (SHG Art. 6) = Departement Gesundheit und Soziales (SHV Art. 1, 6); Fachstelle: Amt für Soziales, Abteilung Sozialhilfe und Asyl — https://ar.ch/verwaltung/departement-gesundheit-und-soziales/amt-fuer-soziales/abteilung-sozialhilfe-und-asyl/
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die öffentliche Sozialhilfe (Sozialhilfegesetz, SHG) | bGS 851.1 | API: «vom 24.09.2007, in Kraft seit: 01.01.2008» ⟨ergänzt 09.11.2026, Fachprüfung⟩; «Aktuelle Version in Kraft seit: 01.01.2013 (Beschlussdatum: 20.02.2012)»; PDF «Stand 1. Januar 2013» | https://ar.clex.ch/app/de/texts_of_law/851.1 | API 200 (bgs.ar.ch → ar.clex.ch), PDF 200; Gegenprobe 999.999 → 404 |
| Verordnung zum Gesetz über die öffentliche Sozialhilfe (Sozialhilfeverordnung; SHV) | bGS 851.11 | API: «vom 16.12.2008, in Kraft seit: 01.01.2009» ⟨ergänzt 09.11.2026, Fachprüfung⟩; «Aktuelle Version in Kraft seit: 01.01.2016 (Beschlussdatum: 11.05.2015)»; PDF «Stand 1. Januar 2016» | https://ar.clex.ch/app/de/texts_of_law/851.11 | API 200, PDF 200; Gegenprobe 404 |

Stand-Prüfung: API meldet keine zukünftigen Versionen und keine geplante Aufhebung; die kantonale Seite [3] verlinkt genau diese Versionen (bgs.ar.ch/frontend/versions/789 und /1068 → 200 auf ar.clex.ch). Ein neueres Gesetz wurde nicht gefunden — trotzdem bleibt «Sammlung evtl. veraltet» offen (s. unten).

### Zuständigkeit und Antrag
> «Die Gewährung der Sozialhilfe an Personen mit Aufenthalt im Kanton obliegt der Gemeinde, in der die hilfsbedürftige Person ihren Unterstützungswohnsitz hat.» — [1], Art. 3 Abs. 1

> «Jede Gemeinde stellt den Vollzug der Sozialhilfe sicher, indem sie zusammen mit anderen Gemeinden oder allein einen Sozialdienst betreibt.» — [1], Art. 9 Abs. 1

> «Ein Verfahren zur Abklärung von Ansprüchen auf Sozialhilfe wird durch die hilfsbedürftige Person selber oder durch die Gemeinde eingeleitet. Die Kenntnis einer Notlage kann aufgrund des Gesuchs einer Person oder auf andere Weise erfolgen.» — [1], Art. 29 Abs. 1

> «Nachfolgend finden Sie die Links direkt zu den Sozialämtern der Gemeinden des Kantons Appenzell Ausserrhoden» — [4]

### SKOS-Richtlinien
> «Der Regierungsrat regelt nach Anhörung der Gemeinden in einer Verordnung die Bemessung der wirtschaftlichen Sozialhilfe. Er kann anerkannte Richtlinien als verbindlich erklären.» — [1], Art. 15 Abs. 2

> «Die von der Schweizerischen Konferenz für Sozialhilfe erlassenen Richtlinien für die Ausgestaltung und Bemessung der Sozialhilfe (SKOS-Richtlinien) sind verbindlich, soweit das Gesetz oder diese Verordnung keine andere Regelung vorsehen oder besondere Umstände ein Abweichen rechtfertigen.» — [2], Art. 3 Abs. 1

Benannte Abweichungen in der SHV: Integrationszulagen (Art. 4, eigene Beträge) und Ende der Unterstützung mit Wegzug (Art. 5). Verweis ohne Ausgabe/Datum.

### Was Geld oder Rechte kosten kann
- **Rückerstattung (rechtmässig):** bei wesentlich verbesserten Verhältnissen (ohne Einschränkung auf Erbschaft — also auch Erwerb), wenn zumutbar, oder aus dem Nachlass; Erben bis zur Höhe des Erbteils; nicht für Leistungen ~~vor dem 18. Altersjahr~~ bis zu einer Altersgrenze im Gesetz ⟨korrigiert 09.11.2026, Fachprüfung⟩ bzw. bis zum Abschluss der Erstausbildung (Art. 28 Abs. 2).
  > «Rechtmässig bezogene Unterstützungsleistungen sind zurückzuerstatten, a) wenn sich die finanziellen Verhältnisse der hilfsbedürftigen Person wesentlich verbessert haben, b) und wenn die Rückerstattung für sie zumutbar ist, c) oder wenn sie bei ihrem Tode Vermögen hinterlässt.» — [1], Art. 27 Abs. 1
- **Rückerstattung (unrechtmässig):** «Wer mit unwahren oder unvollständigen Angaben Unterstützungsleistungen erhalten hat, ist in jedem Fall zur Rückerstattung verpflichtet.» — [1], Art. 27 Abs. 3
- **Zins / Verwirkung:** verzinslich ab Verfügung (bei unrechtmässigem Bezug ab Bezug), Satz im Gesetz; Verwirkung: Frist im Gesetz (Art. 28 Abs. 3 und 5); Stundung/Erlass bei besonderer Härte (Art. 28 Abs. 4).
- **Sicherstellung / Grundpfand:** «Die Behörde kann zur Sicherstellung die Eintragung eines Pfandrechtes im Grundbuch verlangen oder andere geeignete Massnahmen zur Sicherstellung veranlassen.» — [1], Art. 25 Abs. 2
- **Verwandtenunterstützung:** wird von der Gemeinde in jedem Fall geprüft.
  > «Die Sozialhilfeorgane der Gemeinden prüfen bei jedem Unterstützungsfall, ob unterstützungspflichtige Personen vorhanden sind und fordern diese gegebenenfalls zur Leistung der Verwandtenunterstützung auf.» — [1], Art. 24 Abs. 2
  Bei Uneinigkeit entscheidet das Zivilgericht (Art. 24 Abs. 3).
- **Aufenthaltsbewilligung:** Meldepflicht an das Migrationsamt in den kantonalen Quellen nicht genannt. Die Amtsseite nennt nur Bestätigungen für Bewilligungsverfahren:
  > «Sie benötigen eine Bestätigung betreffend Sozialhilfebezug für ein Einbürgerungsgesuch oder eine migrationsrechtliche Bewilligung? Dann wenden Sie sich bitte direkt an das Sozialamt Ihrer aktuellen oder früheren Wohngemeinde» — [3]
- **Wohnsitzwechsel:**
  > «Sozialhilfeleistungen werden längstens für die Zeit der örtlichen Zuständigkeit ausgerichtet. Mit dem Wegzug aus der Gemeinde endet die Sozialhilfeunterstützung.» — [2], Art. 5 Abs. 1
  Unterstützungswohnsitz nach Bundesrecht (SHG Art. 3 Abs. 3); Abschiebungsverbot, auch nicht «durch Umzugsunterstützungen» (Art. 4).
- **Vorschüsse / Abtretung:** Vorschüsse auf Sozialversicherungsleistungen sind zurückzuzahlen; Drittauszahlung/Abtretung kann zur Bedingung gemacht werden (Art. 26).
- **Kürzung / Strafe:** Verweigerung, Kürzung, Unterbruch oder Entzug bei Pflichtverletzung, vorher Hinweis und Frist (Art. 22 Abs. 1–2); unrechtmässiges Erwirken ist mit Busse strafbar (Art. 23).

### Offen / nicht gefunden
- Gesetz Stand 2013, Verordnung Stand 2016: Ob die Sammlung aktuell ist, lässt sich mit curl nur indirekt stützen (keine zukünftigen Versionen in der API; Kantonsseite verlinkt dieselben Versionen). Die Seite der Abteilung spricht von «im Rahmen des neuen Sozialhilfegesetzes» (wohl das Gesetz von 2007; ⟨ergänzt 09.11.2026, Fachprüfung⟩ gestützt durch die API: geltendes SHG «vom 24.09.2007», `abrogated_scheduled: false`, `future_versions: []` — dass die Seite genau dieses meint, bleibt eine Lesart) — bei der Fachstelle Sozialhilfe nachfragen, ob eine Revision hängig ist.
- Einzelne Gemeinde-Links auf der Adressseite [4] nicht einzeln geprüft (27 externe Links auf der Seite).

### Quellen
1. Gesetz über die öffentliche Sozialhilfe (SHG), bGS 851.1, Kantonsrat AR, Stand 1. Januar 2013. https://ar.clex.ch/api/de/texts_of_law/851.1 (Aufruf über bgs.ar.ch umgeleitet; PDF …/api/de/versions/789/pdf_file_with_annexes) — abgerufen 09.11.2026, HTTP 200; Gegenprobe /api/de/texts_of_law/999.999 → 404
2. Sozialhilfeverordnung (SHV), bGS 851.11, Regierungsrat AR, Stand 1. Januar 2016. https://ar.clex.ch/api/de/texts_of_law/851.11 (PDF …/versions/1068/…) — abgerufen 09.11.2026, HTTP 200; Gegenprobe 999.999 → 404
3. «Sozialhilfe», Abteilung Sozialhilfe und Asyl, Amt für Soziales AR. https://ar.ch/verwaltung/departement-gesundheit-und-soziales/amt-fuer-soziales/abteilung-sozialhilfe-und-asyl/sozialhilfe/ — abgerufen 09.11.2026, HTTP 200; Gegenprobe https://ar.ch/atlantis-gibt-es-nicht-4711 → 404
4. «Adressen Sozialämter», ar.ch. https://ar.ch/verwaltung/departement-gesundheit-und-soziales/amt-fuer-soziales/abteilung-sozialhilfe-und-asyl/sozialhilfe/adressen-sozialaemter/ — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [3] → 404
5. Amt für Soziales AR. https://ar.ch/verwaltung/departement-gesundheit-und-soziales/amt-fuer-soziales/ — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [3] → 404

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** AR-1 Erlass- und Inkraftsetzungsdaten fehlten; AR-2 Absatznummern Art. 22–28 vom Prüfer nicht geprüft; K2 Altersgrenze ausserhalb Zitat.
- **Geändert:** Daten aus der eigenen API-Antwort ergänzt; Altersgrenze neutral formuliert. AR-2 selbst gegengelesen (Absätze maschinell aus dem eigenen PDF-Text zerlegt und mit jeder Fundstelle verglichen): Art. 22 Abs. 1–3, Art. 24 Abs. 1–3, Art. 25 Abs. 1–2, Art. 26 Abs. 1–2, Art. 27 Abs. 1–5, Art. 28 Abs. 1–5 — alle zitierten Absatznummern stimmen (Art. 27 Abs. 1/3; Art. 28 Abs. 2 Altersgrenze, Abs. 3 Zins, Abs. 4 Härte, Abs. 5 Verwirkung; Art. 24 Abs. 2/3; Art. 25 Abs. 2). Keine Änderung nötig.
- **Offen:** ob eine Revision von SHG/SHV hängig ist (bei der Fachstelle nachfragen).

---

---

## AI — Appenzell Innerrhoden

**Beurteilung:** teilweise
**Zuständig (kurz):** der Kanton selbst (keine Gemeindesozialhilfe): «Die öffentliche Sozialhilfe ist Aufgabe des Kantons» (Art. 4 ShiG); Vollzugsstelle ist das kantonale Sozialamt (Art. 2 ShiV), im Gesundheits- und Sozialdepartement.
**Antrag (kurz):** beim kantonalen Sozialamt, Hoferbad 2, 9050 Appenzell — telefonisch oder am Schalter einen Termin vereinbaren (Amtsseite [3]). Ein Verzeichnis ist nicht nötig (eine Stelle für den ganzen Kanton).
**SKOS (kurz):** nicht belegt — die ShiV verweist nicht auf die SKOS; nach Art. 5 Abs. 2 ShiV legt die Standeskommission «verbindliche Richtlinien für die Bemessung» fest, diese Richtlinien sind in der Gesetzessammlung nicht auffindbar.
**Aufsicht:** Standeskommission (Art. 1 Abs. 1 ShiV); Vollzug Gesundheits- und Sozialdepartement / Sozialamt — https://www.ai.ch/organisation/gesundheits-und-sozialdepartement/sozialamt
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die öffentliche Sozialhilfe (Sozialhilfegesetz, ShiG) | GS 850.000 | «vom 29.04.2001, in Kraft seit: 29.04.2001»; «Aktuelle Version in Kraft seit: 01.08.2014 (Beschlussdatum: 27.04.2014)» | https://ai.clex.ch/app/de/texts_of_law/850.000 | API 200 (JSON), PDF Version 1390 → 200; Gegenprobe API 999.999 → 404 |
| Verordnung über die öffentliche Sozialhilfe (ShiV) | GS 850.010 | «vom 01.10.2001, in Kraft seit: 01.10.2001»; «Aktuelle Version in Kraft seit: 24.06.2013 (Beschlussdatum: 24.06.2013)» | https://ai.clex.ch/app/de/texts_of_law/850.010 | API 200, PDF Version 1381 → 200; Gegenprobe wie oben |

### Zuständigkeit und Antrag
> «Die öffentliche Sozialhilfe ist Aufgabe des Kantons.» — Quelle [1], Art. 4 Abs. 1 ShiG

> «Das Sozialamt ist, soweit nicht andere Amtsstellen oder Institutionen zuständig sind, Vollzugsstelle der kantonalen Sozialhilfe sowie die zuständige kantonale Behörde im Sinne des Bundesgesetzes über die Zuständigkeit für die Unterstützung Bedürftiger vom 24. Juni 1977 (Zuständigkeitsgesetz, ZUG).» — Quelle [2], Art. 2 Abs. 1 ShiV

> «Die Aufsicht über den Vollzug des Sozialhilfegesetzes und der dazugehörigen Ausführungsbestimmungen obliegt der Standeskommission.» — Quelle [2], Art. 1 Abs. 1 ShiV

> «Wer für seinen Lebensunterhalt und den seiner Familienangehörigen mit gleichem Wohnsitz nicht oder nicht hinreichend und rechtzeitig aufkommen kann, hat Anspruch auf materielle Hilfe.» — Quelle [1], Art. 12 Abs. 1 ShiG

> «Melden Sie sich telefonisch unter +41 71 788 92 52 oder direkt während der Öffnungszeiten am Schalter des Sozialamtes, um einen Termin zu vereinbaren.» — Quelle [3]

### SKOS-Richtlinien
> «Art und Mass der wirtschaftlichen Hilfe richten sich nach den Vorschriften des Sozialhilfegesetzes und dieser Verordnung sowie nach den örtlichen und persönlichen Verhältnissen, wobei das Sozialamt nach pflichtgemässem Ermessen entscheidet.» — Quelle [2], Art. 5 Abs. 1 ShiV

> «Die Standeskommission legt verbindliche Richtlinien für die Bemessung der materiellen Hilfe fest.» — Quelle [2], Art. 5 Abs. 2 ShiV

Weder ShiG noch ShiV noch die Amtsseite [3] nennen die SKOS. Die Inhaltsliste der Gesetzessammlung AI (Stand des
Vorlaufs, 421 Erlasse) enthält keinen Standeskommissionsbeschluss zur Bemessung der Sozialhilfe. Ob die
Standeskommission die SKOS-Richtlinien übernommen hat, ist damit **nicht belegt**. Methodik: «nicht auffindbar» stützt
sich nur auf die Inhaltsliste der Sammlung, nicht auf eine Volltextsuche (eine Volltextsuche wurde nicht durchgeführt;
der Prüfer meldet die Such-Endpunkte von ai.clex.ch als 404 — von mir nicht nachgemessen).
⟨ergänzt 09.11.2026, Fachprüfung⟩

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** Rechtmässig bezogene Hilfe ist bei gebesserten Verhältnissen oder aus dem Nachlass zurückzuerstatten; bei unwahren Angaben «in jedem Falle»; Erben haften bis zur Höhe des Erbteils; Erlöschensfrist im Gesetz (Art. 19 Abs. 1), keine Verjährung bei Grundpfand; Forderungen sind verzinslich.
  > «Rechtmässig bezogene wirtschaftliche Hilfe ist zurückzuerstatten, wenn sich die finanziellen Verhältnisse der Empfänger so gebessert haben, dass ihnen die Rückerstattung zugemutet werden kann, oder wenn sie beim Tode Vermögen hinterlassen.» — [1], Art. 18 Abs. 1 ShiG
  > «Wer unter unwahren oder unvollständigen Angaben materielle Hilfe erwirkt hat, ist in jedem Falle zur Rückerstattung verpflichtet.» — [1], Art. 18 Abs. 4 ShiG
  > «Stirbt der Hilfeempfänger, besteht ein Anspruch gegenüber seinem Nachlass. Dieser Anspruch geht bis zur Höhe des erhaltenen Erbteils auf die Erben über.» — [1], Art. 18 Abs. 5 ShiG
  > «Der Rückerstattungsanspruch erlischt gegenüber der unterstützten Person und gegenüber den Erben innert zehn Jahren seit dem letzten Bezug der Hilfe.» — [1], Art. 19 Abs. 1 ShiG
  > «Rückerstattungsforderungen sind verzinslich. In besonderen Fällen kann das zuständige Departement darauf verzichten.» — [1], Art. 19 Abs. 3 ShiG ⟨Satz 2 ergänzt 09.11.2026, Fachprüfung⟩
  > «Der Rückerstattungsanspruch erstreckt sich auf empfangene Hilfeleistungen der betreffenden Person selbst, ihres Ehegatten während der Ehe, ihres Partners während der eingetragenen Partnerschaft sowie ihrer Kinder während deren Unmündigkeit.» — [1], Art. 18 Abs. 2 ShiG ⟨ergänzt 09.11.2026, Fachprüfung⟩
  Ausnahme: Hilfe für sich selbst während der Unmündigkeit oder bis zum Abschluss einer ordentlichen Ausbildung wird «in der Regel» nicht zurückgefordert (Art. 18 Abs. 3).
  Rückerstattung von Vorschüssen auf Versicherungs-/Drittleistungen: Art. 10 Abs. 1 ShiG (direkte Auszahlung der Nachzahlung an das Gemeinwesen möglich).
- **Verwandtenunterstützung:** richtet sich nach ZGB; vor einer Aufforderung sind Auswirkungen auf die Familie zu berücksichtigen.
  > «Die Unterstützungspflicht der Verwandten von Hilfsbedürftigen richtet sich nach den Bestimmungen des Schweizerischen Zivilgesetzbuches vom 10. Dezember 1907 (ZGB).» — [1], Art. 15 Abs. 1 ShiG
- **Aufenthaltsbewilligung:** in den kantonalen Quellen nicht genannt. Bundesrecht (AIG) ist nicht Gegenstand dieser Erhebung — daraus folgt **nicht**, dass keine Meldung erfolgt; bei der Stelle prüfen. ⟨ergänzt 09.11.2026, Fachprüfung⟩
- **Asylbereich:** keine eigene Stelle, aber ausdrücklich dasselbe Recht: > «Die Gewährung von Sozialhilfe an Asylsuchende, Flüchtlinge, Schutzbedürftige, vorläufig Aufgenommene und Staatenlose richtet sich ebenfalls nach dem Sozialhilfegesetz und dieser Verordnung. Vorbehalten bleiben eidgenössische Bestimmungen.» — [2], Art. 3 Abs. 1 ShiV
- **Wohnsitzwechsel:** Zuständigkeit nach Unterstützungswohnsitz gemäss ZUG; bei Notfall ohne feststellbaren Wohnsitz hilft der Aufenthaltskanton.
  > «Die örtliche Zuständigkeit bestimmt sich nach dem Unterstützungswohnsitz des Hilfesuchenden im Sinne des Bundesgesetzes über die Zuständigkeit für die Unterstützung Bedürftiger vom 24. Juni 1977 (Zuständigkeitsgesetz, ZUG).» — [1], Art. 5 Abs. 1 ShiG
- **Mitwirkungs-/Meldepflicht:** > «Änderungen der wirtschaftlichen oder sich auf die materielle Hilfeleistung auswirkenden persönlichen Verhältnisse sind der unterstützenden Stelle unverzüglich anzuzeigen.» — [1], Art. 13 Abs. 3 ShiG (Auskunfts- und Einsichtspflicht inkl. Steuerakten: Art. 13 Abs. 1)
- **Kürzung/Sanktion:** > «Dem Hilfesuchenden, der Auflagen oder Weisungen missachtet, die Einsichtnahme in Unterlagen verweigert, Leistungen unzweckmässig verwendet, wird die Unterstützung verweigert oder gekürzt.» — [1], Art. 14 Abs. 2 ShiG; Kürzung bei Weigerung, an einem Beschäftigungsprogramm teilzunehmen: [2], Art. 8 Abs. 3 ShiV
- **Sicherstellung / Grundpfand:** bei nicht realisierbarem Grundeigentum oder Vermögen Rückerstattungsverpflichtung, «wenn möglich pfandrechtlich sicherzustellen» — [1], Art. 17 Abs. 1 und 3 ShiG
- **Abtretung:** Gewährung kann von der Abtretung von Ansprüchen gegenüber Dritten abhängig gemacht werden — [1], Art. 10 Abs. 2 ShiG. Die Hilfe selbst darf «weder verpfändet, gepfändet noch abgetreten werden» und nicht mit Steuern verrechnet werden — [1], Art. 9

### Offen / nicht gefunden
- Die von der Standeskommission nach Art. 5 Abs. 2 ShiV festzulegenden «verbindlichen Richtlinien für die Bemessung» — nicht in der Gesetzessammlung gefunden, auch nicht auf ai.ch. Damit kein Beleg, ob und wie SKOS gilt. Bei Sozialamt AI erfragen.
- Rechtsmittelweg nicht erhoben.
- ShiV-Stand 2013, ShiG-Stand 2014: alte, aber laut API aktuelle Fassungen; keine künftige Version hinterlegt.

### Quellen
1. Gesetz über die öffentliche Sozialhilfe (Sozialhilfegesetz, ShiG), GS 850.000, Kanton Appenzell I.Rh., Stand 01.08.2014. https://ai.clex.ch/app/de/texts_of_law/850.000 (API https://ai.clex.ch/api/de/texts_of_law/850.000, PDF https://ai.clex.ch/api/de/versions/1390/pdf_file) — abgerufen 09.11.2026, HTTP 200 / 200; Gegenprobe `/api/de/texts_of_law/999.999` → 404, `/atlantis-gibt-es-nicht-4711` → 404
2. Verordnung über die öffentliche Sozialhilfe (ShiV), GS 850.010, Grosser Rat AI, Stand 24.06.2013. https://ai.clex.ch/app/de/texts_of_law/850.010 (API …/texts_of_law/850.010, PDF …/versions/1381/pdf_file) — abgerufen 09.11.2026, HTTP 200 / 200; Gegenprobe wie [1]
3. Sozialhilfe, Kanton Appenzell I.Rh. (Gesundheits- und Sozialdepartement, Sozialamt), ohne Datum. https://www.ai.ch/themen/gesundheit-alter-und-soziales/sozialhilfe — abgerufen 09.11.2026, HTTP 200, Titel «Sozialhilfe – Kanton Appenzell I.Rh.»; Gegenprobe `https://www.ai.ch/atlantis-gibt-es-nicht-4711` → 404 («404 - Seite nicht gefunden»)
4. Sozialamt, Kanton Appenzell I.Rh. https://www.ai.ch/organisation/gesundheits-und-sozialdepartement/sozialamt — abgerufen 09.11.2026, HTTP 200, Titel «Sozialamt – Kanton Appenzell I.Rh.»; Gegenprobe wie [3]

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **beanstandet:** kein Zitat; Hinweise zu fehlenden Rückerstattungsdetails (Art. 18 Abs. 2, Art. 19 Abs. 3 Satz 2 ShiG), zu B/C-Meldepflicht-Formulierung und zur Methodik «nicht auffindbar».
- **geändert:** beide ShiG-Stellen ergänzt (am eigenen Download wörtlich geprüft); Bundesrechts-Hinweis bei Aufenthaltsbewilligung; Methodik-Vermerk; Zeile Asylbereich (Art. 3 ShiV) neu.
- **offen:** Bemessungsrichtlinien der Standeskommission (Art. 5 Abs. 2 ShiV) → SKOS-Status weiter nicht belegt.

---

## SG — St. Gallen

**Beurteilung:** ~~belegbar~~ teilweise ⟨korrigiert 09.11.2026, Fachprüfung⟩ — SKOS-/Bemessungsstatus nicht amtlich belegt
**Zuständig (kurz):** die politische Gemeinde (Art. 3 Abs. 1 SHG); Zusammenarbeit mehrerer Gemeinden oder Übertragung an private Institution möglich (Art. 4); Zuständigkeit und Unterstützungswohnsitz nach ZUG (Art. 3 Abs. 2).
**Antrag (kurz):** beim Sozialamt der Wohnsitzgemeinde; der Kanton (Amt für Soziales) ist nur Ansprechstelle der Gemeinden (Amtsseite [2]). Verzeichnis: Liste der 75 politischen Gemeinden auf sg.ch [5] (keine eigene Liste der Sozialämter gefunden).
**SKOS (kurz):** nicht belegt — Gesetz verweist auf KOS-Richtlinien («orientiert sich», Art. 11 Abs. 1bis SHG); Allgemeinverbindlicherklärung nicht gefunden; die Amtsseite [2] verlinkt SKOS-Richtlinien und KOS-Praxishilfe nebeneinander. ⟨korrigiert 09.11.2026, Fachprüfung⟩ ~~eigene Ansätze / nicht verbindlich übernommen — die Bemessung «orientiert sich an den Richtlinien der St.Gallischen Konferenz der Sozialhilfe» (KOS), Art. 11 Abs. 1bis SHG; die Regierung erklärt diese nur unter Bedingungen für allgemein verbindlich. Eine solche Allgemeinverbindlicherklärung ist in der Gesetzessammlung nicht auffindbar. Die KOS (Verein, nicht amtlich) schreibt selbst, die SKOS-Richtlinien seien im Kanton «unverbindlich».~~
**Aufsicht:** ~~Departement des Innern, Amt für Soziales (Art. 11 Abs. 3 und Art. 27 SHG: «zuständiges Departement»)~~ Departement des Innern / Amt für Soziales — **nur mittelbar belegt**: Art. 11 Abs. 3 SHG verweist für Massnahmen auf Art. 159 Gemeindegesetz; Art. 27 SHG regelt nur Streit zwischen Gemeinden («entscheidet bei Uneinigkeit der Gemeinden»), nicht die Aufsicht. ⟨korrigiert 09.11.2026, Fachprüfung⟩ — https://www.sg.ch/politik-verwaltung/departemente-und-staatskanzlei/departement-des-innern/amt-fuer-soziales.html
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Sozialhilfegesetz (SHG) | sGS 381.1 | «vom 27.09.1998, in Vollzug seit: 01.01.1999»; «Aktuelle Fassung in Vollzug seit: 01.03.2026 (Erlassdatum: 27.01.2026)»; keine künftige Fassung | https://www.gesetzessammlung.sg.ch/app/de/texts_of_law/381.1 | API 200, PDF Version 3876 → 200; Gegenprobe API 999.999 → 404, `…/versions/99999999/pdf_file` → 404, `/atlantis-gibt-es-nicht-4711` → 404 |
| Verordnung zum SHG (Sozialhilfe) | — | **keine** in der sGS-Reihe 381.x; die Bemessung ist über Art. 11 Abs. 1bis SHG an die KOS-Richtlinien gebunden | — | Inhaltsliste sGS 38x durchgesehen: nur VGE 381.11, Asylverordnung 381.12, Heim-/Behindertenerlasse |

### Zuständigkeit und Antrag
> «Die politische Gemeinde leistet persönliche Sozialhilfe durch fachlich geeignetes Personal.» — Quelle [1], Art. 3 Abs. 1 SHG

> «Zuständigkeit, Unterstützungswohnsitz und Verfahren richten sich nach dem Bundesgesetz über die Zuständigkeit für die Unterstützung Bedürftiger.» — Quelle [1], Art. 3 Abs. 2 SHG

> «Wer für den eigenen Lebensunterhalt nicht hinreichend oder nicht rechtzeitig aus eigenen Mitteln aufkommen kann, hat Anspruch auf finanzielle Sozialhilfe.» — Quelle [1], Art. 9 Abs. 1 SHG

> «Die zuständige Gemeinde verfügt die Bemessung der finanziellen Sozialhilfe aufgrund der im Einzelfall festgestellten tatsächlichen und rechtlichen Verhältnisse. Sie kann auf eine Begründung der Verfügung verzichten.» — Quelle [1], Art. 11a Abs. 1 SHG (dann Einsprache bei der verfügenden Behörde, Frist im Gesetz, Art. 11a Abs. 2)

> «Bitte wenden Sie sich als Privatperson an das Sozialamt Ihrer Wohngemeinde. Das Amt für Soziales ist Ansprechstelle für die Gemeinden.» — Quelle [2]

### SKOS-Richtlinien
> «Die Bemessung orientiert sich an den Richtlinien der St.Gallischen Konferenz der Sozialhilfe. Die Regierung erklärt diese Richtlinien für allgemein verbindlich, wenn sie vom Verband St.Galler Gemeindepräsidien anerkannt sind und: a) wenigstens zwei Drittel der Räte der politischen Gemeinden dies beantragen oder b) die Räte von politischen Gemeinden, die zusammen wenigstens zwei Drittel der Wohnbevölkerung des Kantons umfassen, dies beantragen oder c) wenigstens ein Zehntel der politischen Gemeinden die Ansätze nach diesen Richtlinien grundsätzlich unterschreitet.» — Quelle [1], Art. 11 Abs. 1bis SHG

> «Werden allgemein verbindliche Richtlinien nicht eingehalten, kann das zuständige Departement Massnahmen nach Art. 159 des Gemeindegesetzes vom 21. April 2009 treffen.» — Quelle [1], Art. 11 Abs. 3 SHG

> «Im Kanton St.Gallen sind die SKOS-Richtlinien unverbindlich; sie stellen aber ein taugliches Instrument für die Erfüllung unserer täglichen Aufgabe dar. Aus diesem Grunde empfiehlt die KOS den Gemeinden diese Richtlinien inkl. des KOS-Handbuches zur Anwendung.» — Quelle [4] (KOS, **nicht amtlich**, nur Hinweis)

Einordnung: Das Gesetz verweist nicht auf die SKOS, sondern auf die KOS-Richtlinien («orientiert sich»). Eine
Allgemeinverbindlicherklärung durch die Regierung (Art. 11 Abs. 1bis) wurde in der sGS nicht gefunden (Inhaltsliste
nach «Richtlinien», «Konferenz», «verbindlich» durchsucht). Ob ein nicht in die sGS aufgenommener Regierungsbeschluss
existiert, ist **nicht belegt**. Methodik: nur Inhaltsliste, keine Volltextsuche. ⟨ergänzt 09.11.2026, Fachprüfung⟩ Krankenkassenprämien im Existenzminimum: kantonale Sonderregel in Art. 11 Abs. 1ter/1quater und Art. 11b SHG.

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** bei gebesserter Lage, wenn zumutbar (Art. 18 Abs. 1); Ausnahmen u. a. nach Geburt eines Kindes, für eigene Kinderbetreuung ohne Unterhaltsbeitrag, für Bezug als Minderjährige/in Erstausbildung (Art. 18 Abs. 1bis); keine Rückerstattung der Integrations- und Betreuungskosten (Art. 18 Abs. 2); bei unrechtmässigem Bezug samt Zins (Art. 19); Erben soweit bereichert (Art. 20); Rückforderungsfrist im Gesetz mit Ausnahmen für Darlehen, Vorschüsse und Rückerstattungsverpflichtungen (Art. 21 Abs. 2); Stundung/Erlass bei grosser Härte (Art. 22); Verrechnung mit laufender Hilfe zulässig (Art. 22a).
  > «Wer für sich, für Familienangehörige, für eine Person, die mit ihm in eingetragener Partnerschaft lebt, oder für ein Kind, das in der Gemeinschaft der eingetragenen Partnerschaft lebt, finanzielle Sozialhilfe bezogen hat, erstattet diese zurück, wenn sich die eigene finanzielle Lage gebessert hat und die Rückerstattung zumutbar ist.» — [1], Art. 18 Abs. 1 SHG
  > «Erbinnen oder Erben erstatten die von der Erblasserin oder dem Erblasser bezogene finanzielle Sozialhilfe zurück, soweit sie aus dem Nachlass bereichert sind.» — [1], Art. 20 Abs. 1 SHG
  > «Finanzielle Sozialhilfe, die vor mehr als 15 Jahren geleistet wurde, wird nicht zurückgefordert.» — [1], Art. 21 Abs. 2 SHG (mit Ausnahmen Bst. a und b)
- **Verwandtenunterstützung:** die Gemeinde **muss** unterstützungspflichtige Verwandte auffordern und kann klagen.
  > «Die zuständige politische Gemeinde fordert unterstützungspflichtige Verwandte zur Unterstützungsleistung auf. Sie strebt eine Vereinbarung über angemessene Beiträge der Verwandten an.» — [1], Art. 23 Abs. 1 SHG
  > «Bestreiten die Verwandten die Unterstützungspflicht oder kommt keine Vereinbarung zustande, kann die politische Gemeinde beim Gericht Klage auf Vergütung der geleisteten finanziellen Sozialhilfe einreichen.» — [1], Art. 23 Abs. 2 SHG
- **Aufenthaltsbewilligung:** Folgen für die Bewilligung (Meldung an Migrationsamt) in den kantonalen Quellen nicht genannt. Belegt ist nur, dass der **Anspruch** vom Aufenthaltsstatus abhängt:
  > «Unter Vorbehalt abweichender staatsvertraglicher Verpflichtungen haben Ausländerinnen und Ausländer keinen Anspruch auf finanzielle Sozialhilfe nach diesem Erlass, wenn sie lediglich über eine Kurzaufenthaltsbewilligung oder über keine Aufenthaltsbewilligung verfügen.» — [1], Art. 9a Abs. 1 SHG (dann Nothilfe nach Art. 9b)
  Bundesrecht (AIG) ist nicht Gegenstand dieser Erhebung — daraus folgt **nicht**, dass keine Meldung erfolgt; bei der Stelle prüfen. ⟨ergänzt 09.11.2026, Fachprüfung⟩
- **Asylbereich:** reduzierter Anspruch; Kanton kann Aufgaben übernehmen; eigene Asylverordnung sGS 381.12 (nur in der Inhaltsliste gesehen, nicht gelesen).
  > «Asylsuchende, vorläufig aufgenommene Personen und Schutzbedürftige nach der eidgenössischen Asylgesetzgebung, die für ihren Lebensunterhalt nicht hinreichend oder nicht rechtzeitig aus eigenen Mitteln aufkommen können, haben einen reduzierten Anspruch auf finanzielle Sozialhilfe.» — [1], Art. 9 Abs. 2 SHG
  > «Der Kanton kann Aufgaben der Sozialhilfe im Asylbereich übernehmen, wenn dies der Aufgabenteilung zwischen Kanton und Gemeinden im Asylbereich entspricht und den Vollzug des Bundesrechts erleichtert.» — [1], Art. 6ter Abs. 1 SHG
- **Wohnsitzwechsel:** ZUG gilt (Art. 3 Abs. 2, Art. 24); freie Wohnortwahl (Art. 15); Abschiebeverbot mit Folge, dass der Unterstützungswohnsitz bei Verstoss bestehen bleibt (Frist im Gesetz).
  > «Wer um finanzielle Sozialhilfe ersucht oder solche bezieht, wird in der freien Wahl des Wohnortes und, vorbehältlich der Zuweisung von Arbeit, des Arbeitsortes nicht eingeschränkt.» — [1], Art. 15 Abs. 1 SHG
  > «Die politische Gemeinde darf eine Person, die um finanzielle Sozialhilfe nachsucht oder solche bezieht, nicht veranlassen, aus der Gemeinde wegzuziehen, auch nicht durch Umzugsunterstützungen oder andere Begünstigungen, wenn es nicht im Interesse dieser Person liegt.» — [1], Art. 25 Abs. 1 SHG
- **Auskunfts-/Meldepflicht:** > «Wer finanzielle Sozialhilfe bezieht, meldet umgehend Tatsachen, die Anspruch oder Berechnung verändern.» — [1], Art. 16 Abs. 2 SHG. Bei begründeten Zweifeln Abklärungen ohne Ermächtigung, auch durch Polizei oder Privatdetektive, Hausbesuche, Beobachtung im öffentlichen Raum (Art. 16ter).
- **Kürzung/Einstellung:** Kürzungsrahmen und Gründe im Gesetz (Art. 17 Abs. 1), Bedarf minderjähriger Kinder ausgenommen (Abs. 2); Einstellung bei verweigerter Arbeit/Verwertung nach schriftlicher Androhung (Art. 17a).
  > «Finanzielle Sozialhilfe wird verweigert oder angemessen um 5 bis zu höchstens 30 Prozent und zeitlich befristet gekürzt, wenn die hilfesuchende Person insbesondere: a) keine oder unrichtige Auskünfte erteilt; b) verlangte Unterlagen nicht einreicht; c) Bedingungen und Auflagen missachtet; …» — [1], Art. 17 Abs. 1 SHG
- **Pflicht zur Arbeit / Auflagen:** Art. 12, 12b SHG; Ausnahme während einer Frist nach Geburt bei eigener Kinderbetreuung (Art. 12b Abs. 2). Versicherungswechsel kann als Auflage angeordnet werden (Art. 11c Abs. 2).
- **Grundpfand / Sicherheiten:** bei nicht realisierbarem Grundeigentum schriftliche Rückerstattungsverpflichtung; Gemeinde kann Grundpfand verlangen — [1], Art. 14 Abs. 1–2 SHG
- **Vorschüsse:** Nachzahlungen von Sozialversicherungen gehen im Umfang der Vorschüsse an die Gemeinde — [1], Art. 13 SHG

### Offen / nicht gefunden
- Ob die Regierung die KOS-Richtlinien je nach Art. 11 Abs. 1bis für allgemein verbindlich erklärt hat: in der sGS nicht gefunden; beim Amt für Soziales prüfen.
- Kein amtliches Verzeichnis der Gemeinde-Sozialämter gefunden; nur die Gemeindeliste [5].
- Fussnote 16 zum zuständigen Departement im SHG nennt noch «Departement für Inneres und Militär»; heute heisst die Amtsseite «Departement des Innern» (Fussnote veraltet, kein Rechtsproblem, aber nicht wörtlich übernehmen).

### Quellen
1. Sozialhilfegesetz (SHG), sGS 381.1, Kanton St.Gallen, Stand 01.03.2026. https://www.gesetzessammlung.sg.ch/app/de/texts_of_law/381.1 (API https://www.gesetzessammlung.sg.ch/api/de/texts_of_law/381.1, PDF …/api/de/versions/3876/pdf_file) — abgerufen 09.11.2026, HTTP 200 / 200; Gegenprobe `/api/de/texts_of_law/999.999` → 404, `/atlantis-gibt-es-nicht-4711` → 404
2. Sozialhilfe, Kanton St.Gallen (Amt für Soziales), ohne Datum. https://www.sg.ch/gesundheit-soziales/soziales/sozialhilfe.html — abgerufen 09.11.2026, HTTP 200, Titel «Sozialhilfe | sg.ch»; Gegenprobe `https://www.sg.ch/atlantis-gibt-es-nicht-4711.html` → 404
3. Amt für Soziales, Departement des Innern, Kanton St.Gallen. https://www.sg.ch/politik-verwaltung/departemente-und-staatskanzlei/departement-des-innern/amt-fuer-soziales.html — abgerufen 09.11.2026, HTTP 200, Titel «Amt für Soziales | sg.ch»; Gegenprobe wie [2]
4. KOS-Handbuch, St.Gallische Konferenz der Sozialhilfe (Verein, **nicht amtlich**, nur Hinweis). http://www.kos-sg.ch/kos/kos-praxishilfe/ → weitergeleitet auf https://kos-sg.ch/kos-handbuch/ — abgerufen 09.11.2026, HTTP 200; Gegenprobe `https://www.kos-sg.ch/atlantis-gibt-es-nicht-4711` → 404
5. Über die Gemeinden, Kanton St.Gallen (Amt für Gemeinden und Bürgerrecht), «letzte Aktualisierung: 6. November 2026». https://www.sg.ch/politik-verwaltung/gemeinden/ueber-die-gemeinden.html — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [2]

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **beanstandet:** Beurteilung «belegbar» zu hoch; SKOS-Kurzaussage «eigene Ansätze» unbelegt; Aufsicht über Art. 27 SHG falsch hergeleitet; B/C-Formulierung; Methodik.
- **geändert:** Beurteilung → teilweise; SKOS kurz → nicht belegt; Aufsicht als nur mittelbar belegt gekennzeichnet (alte Aussagen durchgestrichen); Bundesrechts-Hinweis; Methodik-Vermerk; Zeile Asylbereich (Art. 9 Abs. 2, Art. 6ter SHG, am eigenen Download geprüft) neu.
- **offen:** Allgemeinverbindlicherklärung der KOS-Richtlinien; ausdrückliche Aufsichtsnorm über die Gemeinde-Sozialhilfe.

---

## GR — Graubünden

**Beurteilung:** belegbar
**Zuständig (kurz):** Entscheid und Kosten: die politische Wohnsitzgemeinde (Art. 5 Abs. 1 UG; «Die materielle Sozialhilfe ist Sache der Gemeinden», Art. 4 Abs. 2 Sozialhilfegesetz). Beratung und Gesuchsvorbereitung: die kantonalen regionalen Sozialdienste, heute «Beratungszentren Soziales» des Amts für Soziales (Art. 5, 11 Sozialhilfegesetz); Davos führt einen kommunalen Sozialdienst. Kanton direkt zuständig u. a. für Durchreisende, Asylbereich, Personen ohne Aufenthaltsrecht (Art. 14 UG).
**Antrag (kurz):** beim Beratungszentrum Soziales der Region; dieses klärt ab, berechnet den Bedarf und stellt das Gesuch an die Wohnsitzgemeinde, die verfügt (Amtsseite [4]). Verzeichnis mit Gemeinde-Zuordnung vorhanden [5]. Gesuchsformular «Gesuch wirtschaftliche Sozialhilfe ab 2025» auf der Amtsseite.
**SKOS (kurz):** teilweise, statischer Verweis mit eigenen Ansätzen — massgebend sind die SKOS-Richtlinien «vom April 2005 mit den nachfolgenden Konkretisierungen und Einschränkungen» (Art. 1 ABzUG); Grundbedarf, Freibeträge, Integrationszulage, Kürzungen kantonal festgelegt (Art. 3–11 ABzUG). Für Rückerstattung «orientiert» sich die Regierung an der SKOS (Art. 11a–11c UG).
**Aufsicht:** Regierung (Art. 18 UG); Weisungen des Departements (DVS, Art. 17 Abs. 2 UG); Amt für Soziales (Art. 10 Sozialhilfegesetz) — https://www.gr.ch/DE/institutionen/verwaltung/dvs/soa/home/Seiten/Sozialamt.aspx
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die öffentliche Sozialhilfe im Kanton Graubünden (Sozialhilfegesetz) | BR 546.100 | «vom 07.12.1986, in Kraft seit: 01.01.1987»; «Aktuelle Version in Kraft seit: 01.01.2016 (Beschlussdatum: 18.11.2014)» | https://www.gr-lex.gr.ch/app/de/texts_of_law/546.100 | API 200, PDF Version 3842 → 200; Gegenprobe API 999.999 → 404, `/atlantis-gibt-es-nicht-4711` → 404 |
| Gesetz über die Unterstützung Bedürftiger (Kantonales Unterstützungsgesetz, UG) | BR 546.250 | «vom 03.12.1978, in Kraft seit: 01.01.1979»; «Aktuelle Version in Kraft seit: 01.01.2025 (Beschlussdatum: 22.10.2024)» | https://www.gr-lex.gr.ch/app/de/texts_of_law/546.250 | API 200, PDF Version 3843 → 200; Gegenprobe wie oben |
| Ausführungsbestimmungen zum kantonalen Unterstützungsgesetz (ABzUG) | BR 546.270 | «vom 08.11.2005, in Kraft seit: 01.01.2006»; «Aktuelle Version in Kraft seit: 01.02.2026 (Beschlussdatum: 19.01.2026)» | https://www.gr-lex.gr.ch/app/de/texts_of_law/546.270 | API 200, PDF Version 3844 → 200; Gegenprobe wie oben |
| (aufgehoben) Ausführungsbestimmungen zum Sozialhilfegesetz | BR 546.210 | laut API «in Kraft von 01.12.1998 bis: 31.12.2015» | — | API 200; Fussnote 4 im Sozialhilfegesetz verweist noch darauf (veraltet) |

### Zuständigkeit und Antrag
> «Die materielle Sozialhilfe ist Sache der Gemeinden. Der Kanton beteiligt sich daran gemäss Unterstützungsgesetz.» — Quelle [1], Art. 4 Abs. 2 Sozialhilfegesetz

> «Die Sozialhilfe erfolgt durch private, gemeindeeigene und, wenn keine gemeindeeigenen Sozialdienste tätig sind, durch kantonale Sozialdienste.» — Quelle [1], Art. 5 Abs. 1 Sozialhilfegesetz

> «Die Unterstützungspflicht obliegt der politischen Gemeinde, in welcher die bedürftige Person ihren Wohnsitz hat.» — Quelle [2], Art. 5 Abs. 1 UG

> «Die zuständige Sozialbehörde bestimmt Art und Mass der Unterstützung nach dem ausgewiesenen Bedarf unter Würdigung der örtlichen und persönlichen Verhältnisse.» — Quelle [2], Art. 2 Abs. 1 UG

> «Die Beratungszentren Soziales unterstützen Sie bei der Gesuchstellung für die wirtschaftliche Sozialhilfe. Sie klären Ihre finanzielle, berufliche, familiäre und persönliche Situation ab. Sie informieren Sie über Ihre Rechte und Pflichten, berechnen den Unterstützungsbedarf und stellen das Gesuch an die zuständige Gemeinde.» — Quelle [4]

> «Ihre Wohnsitzgemeinde entscheidet über die Höhe und Dauer der wirtschaftlichen Sozialhilfe.» — Quelle [4]

> «Wohnen Sie in Davos? Bitte beachten Sie: Die Gemeinde Davos führt einen kommunalen Sozialdienst.» — Quelle [5]

~~Streitigkeiten aus dem UG: «entscheidet das Obergericht» (Art. 13 Abs. 2 UG).~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩
Art. 13 Abs. 2 UG («Über Streitigkeiten, die sich aus der Anwendung des Unterstützungsgesetzes ergeben, entscheidet das
Obergericht») ist eine allgemeine Streitnorm, **nicht** der Rechtsmittelweg für Einzelpersonen gegen einen
Gemeindeentscheid; dieser Weg ist in dieser Erhebung nicht belegt.

### SKOS-Richtlinien
> «Für die Bemessung der Unterstützung durch die zuständige Gemeinde im Sinne von Artikel 2 des Gesetzes sind die Richtlinien der Schweizerischen Konferenz für Sozialhilfe für die Ausgestaltung und Bemessung der Sozialhilfe vom April 2005 mit den nachfolgenden Konkretisierungen und Einschränkungen massgebend.» — Quelle [3], Art. 1 Abs. 1 ABzUG

> «Die Regierung legt die Berechnungsgrundlagen zur Bestimmung des für die Rückerstattung massgebenden Einkommens fest. Sie orientiert sich dabei an den Richtlinien der Schweizerischen Konferenz für Sozialhilfe (SKOS).» — Quelle [2], Art. 11a Abs. 2 UG (gleich für Freibeträge Art. 11b Abs. 2 und Ausnahmen Art. 11c Abs. 2)

> «Sie basiert auf den kantonalen Gesetzen sowie den Richtlinien der Schweizerischen Konferenz für Sozialhilfe (SKOS-Richtlinien).» — Quelle [4]

Einordnung: **statischer** Verweis auf die SKOS-Fassung «vom April 2005» (Wortlaut der aktuellen ABzUG-Fassung,
obwohl Art. 1 Abs. 1 zuletzt am 10.11.2020 geändert wurde), dazu kantonal festgelegte Abweichungen: eigener Grundbedarf
(Art. 3), Einkommensfreibetrag (Art. 4), Vermögensfreibetrag (Art. 5), Integrationszulage und gemeinsame Obergrenze
(Art. 6–7), Mietzins, Zusatzversicherungen mit Selbstbehalt, Motorfahrzeug (Art. 8–9a), junge Erwachsene ~~bis 25~~
bis zu einer Altersgrenze im Erlass ⟨korrigiert 09.11.2026, Fachprüfung⟩ im Elternhaushalt (Art. 10), Kürzungen (Art. 11). Die Amtsseite [4] verweist dagegen pauschal auf «die SKOS-Richtlinien» und
verlinkt die aktuelle SKOS-Fassung — das Verhältnis Fassung 2005 ↔ aktuelle SKOS ist amtlich **nicht geklärt**.

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** rechtmässig bezogene Hilfe ohne Zins bei verbesserten Verhältnissen (Art. 11 Abs. 2 UG), aus Einkommen nur ohne neue Bedürftigkeit und für eine Dauer im Gesetz (Art. 11a), bei Vermögensanfall über Freibeträgen (Art. 11b; Freibeträge im Erlass, Art. 14 ABzUG); zu Unrecht bezogene mit Zins (Art. 11 Abs. 3); Anspruch auf den Nachlass (Art. 11 Abs. 4); Verjährungsfristen im Gesetz (Art. 11 Abs. 5), verlängert bei Verletzung der Meldepflicht; Ausnahmen (Erstausbildung ~~bis 25~~ bis zu einer Altersgrenze im Gesetz ⟨korrigiert 09.11.2026, Fachprüfung⟩, Integration, behinderungsbedingte Kosten, ungedeckte KVG-Prämien, Art. 11c). Verrechnung zu Unrecht bezogener Hilfe mit laufender Hilfe, begrenzt (Art. 15 ABzUG).
  > «Rechtmässig bezogene Unterstützungsleistungen sind ohne Zinsen zu erstatten, wenn sich die finanziellen Verhältnisse der unterstützten Person verbessern.» — [2], Art. 11 Abs. 2 UG
  > «Zu Unrecht bezogene Unterstützungsleistungen müssen mit Zinsen zurückerstattet werden.» — [2], Art. 11 Abs. 3 UG
  > «Die unterstützende Behörde hat nach Massgabe der geleisteten Hilfe Anspruch auf den Nachlass der unterstützten Person.» — [2], Art. 11 Abs. 4 UG
  > «Verbessern sich die Vermögensverhältnisse der unterstützten Person aufgrund eines Vermögensanfalls, so ist sie in diesem Umfang unter Berücksichtigung von Freibeträgen rückerstattungspflichtig.» — [2], Art. 11b Abs. 1 UG
  > «Integritätsentschädigungen und Genugtuungsleistungen unterliegen nicht der Rückerstattungspflicht.» — [3], Art. 14 Abs. 2 ABzUG
  Amtliches Merkblatt dazu: «Rückerstattung und Verjährung von Sozialhilfeleistungen», Handbuch Kapitel E, 1. Februar 2025, Version 3.0 [6].
- **Verwandtenunterstützung:** UG und ABzUG regeln sie nicht ausdrücklich; die Amtsseite sagt, die Gemeinde prüft sie. Gemeinde kann verweigerte Leistungen unterhaltspflichtiger Eltern und Verwandter bevorschussen.
  > «Zudem prüft die Gemeinde die familienrechtliche Unterstützungspflicht (Verwandtenunterstützung).» — [4]
  > «Die zuständige Gemeinde kann Leistungen der unterhaltspflichtigen Eltern und Verwandten, die sich weigern ihren Pflichten nachzukommen, bevorschussen.» — [3], Art. 10 Abs. 3 ABzUG
- **Aufenthaltsbewilligung:** Folgen für die Bewilligung (Meldung an das Migrationsamt) in den kantonalen Quellen nicht genannt. Belegt sind Einschränkungen des **Anspruchs** nach Status:
  > «Bei Ausländerinnen und Ausländern, die ihren wirtschaftlichen, sozialen und kulturellen Integrationspflichten ohne entschuldbaren Grund nicht nachkommen, sind die Unterstützungsleistungen zu kürzen. In schweren Fällen können diese auf die Nothilfe reduziert werden.» — [2], Art. 2 Abs. 6 UG
  > «Ausländerinnen und Ausländer, die über kein Aufenthaltsrecht verfügen oder sich aufgrund eines bewilligungsfreien Aufenthaltes in der Schweiz befinden, ist ausschliesslich Nothilfe zu gewähren.» — [2], Art. 2 Abs. 7 UG
  > «Personen mit Kurzaufenthaltsbewilligung wird ausschliesslich Nothilfe gemäss Artikel 12 der Bundesverfassung durch die Gemeinde geleistet. Darüber hinaus besteht kein Anspruch auf Sozialhilfe.» — [3], Art. 10c Abs. 1 ABzUG (gilt auch für Stellensuchende nach FZA/EFTA, Abs. 3)
  Bundesrecht (AIG) ist nicht Gegenstand dieser Erhebung — daraus folgt **nicht**, dass keine Meldung erfolgt; bei der Stelle prüfen. ⟨ergänzt 09.11.2026, Fachprüfung⟩
- **Asylbereich:** eigene Stelle — Kanton zuständig (Art. 14 Abs. 1 lit. b UG), Ausrichtung durch das Amt für Migration und Zivilrecht.
  > «Dem Kanton obliegt die Unterstützungspflicht: … b) von Personen im Asylverfahren sowie vorläufig Aufgenommenen;» — [2], Art. 14 Abs. 1 UG
  > «Personen im Asylverfahren sowie vorläufig Aufgenommenen werden die notwendigen Unterstützungsleistungen durch das Amt für Migration und Zivilrecht ausgerichtet.» — [3], Art. 10a Abs. 1 ABzUG (abgewiesene Asylsuchende: nur Nothilfe, Art. 10b)
- **Junge Erwachsene:** Anspruch wird über die Eltern berechnet (Altersgrenze im Erlass), selbständiger Anspruch nur bei Heirat oder Unzumutbarkeit (Art. 10 Abs. 2). ⟨ergänzt 09.11.2026, Fachprüfung⟩
  > «Für die Berechnung des Unterstützungsanspruchs von Jugendlichen und jungen Erwachsenen bis zum 25. Altersjahr sind die finanziellen Verhältnisse der Eltern und der Lebensbedarf des elterlichen Haushaltes massgebend.» — [3], Art. 10 Abs. 1 ABzUG
- **Wohnsitzwechsel:** Wohnsitzbegriff nach ZUG-Grundsätzen; bei Umzug innerhalb des Kantons wechselt die Zuständigkeit sofort; Heim-/Spitalaufenthalt begründet keinen Unterstützungswohnsitz.
  > «Verlegt die bedürftige Person den Wohnsitz innerhalb des Kantons, so geht die Unterstützungspflicht mit sofortiger Wirkung auf die neue Wohngemeinde über.» — [2], Art. 6 Abs. 2 UG
- **Mitwirkungs- und Meldepflicht (auch nach Ende der Hilfe):**
  > «Sie sind zudem verpflichtet, während zehn Jahren nach der letzten Leistungsausrichtung relevante Veränderungen in ihren Einkommens- und Vermögensverhältnissen der Behörde zu melden, die zuletzt unterstützt hat.» — [2], Art. 4 Abs. 2 UG (Frist im Gesetz)
- **Kürzung:** Kürzungsrahmen und Befristung im Erlass, bei ungenügenden Integrationsanstrengungen, Pflichtverletzung, Rechtsmissbrauch — [3], Art. 11 ABzUG
- **Busse:** > «… wird mit Busse bestraft, wer: a) öffentliche oder gemeinnützige Unterstützungshilfe missbräuchlich verwendet; b) als unterstützungsbedürftige Person die ihr gestützt auf dieses Gesetz erteilten Weisungen nicht befolgt.» — [2], Art. 19a Abs. 1 UG
- **Abtretung:** > «Beiträge im Sinne dieses Gesetzes sind nicht abtretbar. Jede Abtretung von Beitragsansprüchen ist nichtig.» — [2], Art. 4a Abs. 1 UG
- **Motorfahrzeug:** Wert über dem Vermögensfreibetrag wird angerechnet, wenn nicht beruflich/gesundheitlich nötig — [3], Art. 9a ABzUG

### Offen / nicht gefunden
- Statischer Verweis auf SKOS «April 2005» vs. Amtsseite mit Link auf die aktuelle SKOS-Fassung: welche Fassung die Gemeinden anwenden, ist amtlich nicht eindeutig; beim Amt für Soziales klären.
- Keine ausdrückliche kantonale Regel zur Geltendmachung der Verwandtenunterstützung im Gesetz gefunden (nur Amtsseite und Bevorschussung in Art. 10 Abs. 3 ABzUG).
- Das «Sozialhilfe Handbuch / Empfehlungen» des Amts für Soziales (Kapitel A–F) nur in Kapitel E angesehen; seine Verbindlichkeit («Empfehlungen») nicht geklärt.
- Fussnote 4 des Sozialhilfegesetzes verweist auf die aufgehobenen Ausführungsbestimmungen BR 546.210; Art. 15 Abs. 2 UG nennt noch das «Departement für Justiz, Sicherheit und Gesundheit».

### Quellen
1. Gesetz über die öffentliche Sozialhilfe im Kanton Graubünden (Sozialhilfegesetz), BR 546.100, Stand 01.01.2016. https://www.gr-lex.gr.ch/app/de/texts_of_law/546.100 (API https://www.gr-lex.gr.ch/api/de/texts_of_law/546.100, PDF …/api/de/versions/3842/pdf_file) — abgerufen 09.11.2026, HTTP 200 / 200; Gegenprobe `/api/de/texts_of_law/999.999` → 404, `/atlantis-gibt-es-nicht-4711` → 404
2. Gesetz über die Unterstützung Bedürftiger (Kantonales Unterstützungsgesetz, UG), BR 546.250, Stand 01.01.2025. https://www.gr-lex.gr.ch/app/de/texts_of_law/546.250 (API …/texts_of_law/546.250, PDF …/versions/3843/pdf_file) — abgerufen 09.11.2026, HTTP 200 / 200; Gegenprobe wie [1]
3. Ausführungsbestimmungen zum kantonalen Unterstützungsgesetz (ABzUG), BR 546.270, Regierung, Stand 01.02.2026. https://www.gr-lex.gr.ch/app/de/texts_of_law/546.270 (API …/texts_of_law/546.270, PDF …/versions/3844/pdf_file) — abgerufen 09.11.2026, HTTP 200 / 200; Gegenprobe wie [1]
4. Wirtschaftliche Sozialhilfe, Amt für Soziales Graubünden, ohne Datum. https://www.gr.ch/DE/institutionen/verwaltung/dvs/soa/beratung/finanzielle-unterstuetzung/sozialhilfe/Seiten/default.aspx — abgerufen 09.11.2026, HTTP 200; Gegenprobe `https://www.gr.ch/atlantis-gibt-es-nicht-4711` → 404, `…/dvs/soa/atlantis/Seiten/gibt-es-nicht-4711.aspx` → 404
5. Sozial- und Suchtberatung (Beratungszentren Soziales, Gemeindeliste), Amt für Soziales Graubünden. https://www.gr.ch/DE/institutionen/verwaltung/dvs/soa/ueberuns/Kontakte/Sozial-Suchtberatung/Seiten/default.aspx — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [4]
6. Rückerstattung und Verjährung von Sozialhilfeleistungen, Handbuch Kapitel E, Kantonales Sozialamt Graubünden, 1. Februar 2025, Version 3.0 (PDF). https://www.gr.ch/DE/institutionen/verwaltung/dvs/soa/beratung/Documents/R%c3%bcckerstattung%20und%20Verj%c3%a4hrung%20von%20Sozialhilfeleistungen.pdf — abgerufen 09.11.2026, HTTP 200 (application/pdf); Gegenprobe wie [4]
7. Amt für Soziales Graubünden, Startseite (= `CANTONAL_LINKS.GR.sozialdienst`). https://www.gr.ch/DE/institutionen/verwaltung/dvs/soa/home/Seiten/Sozialamt.aspx — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [4]

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **beanstandet:** Altersgrenzen ausserhalb von Zitaten; Art. 13 Abs. 2 UG als Rechtsweg missverständlich; Art. 10 Abs. 1 ABzUG (Eltern massgebend) fehlte; B/C-Formulierung.
- **geändert:** Altersangaben → «Altersgrenze im Erlass/Gesetz»; Obergericht-Satz durchgestrichen und klargestellt; Art. 10 Abs. 1 ABzUG ergänzt; Bundesrechts-Hinweis; Zeile Asylbereich (Art. 14 UG, Art. 10a ABzUG) neu — alle Zitate am eigenen Download geprüft.
- **offen:** Rechtsmittelweg gegen Gemeindeentscheide; SKOS-Fassung 2005 vs. aktuell.

---

## AG — Aargau

**Beurteilung:** belegbar
**Zuständig (kurz):** die Gemeinde am Unterstützungswohnsitz, ohne Unterstützungswohnsitz und im Notfall die Aufenthaltsgemeinde (§ 6 Abs. 1 SPG); Sozialbehörde ist der Gemeinderat oder eine Sozialkommission (§ 44); jede Gemeinde führt einen Sozialdienst, «nach Möglichkeit» regional (§ 43). ~~Kanton (Kantonaler Sozialdienst) für Personen ohne Unterstützungswohnsitz, internationale Abkommen, Asylbereich (§ 42, § 51 SPG).~~ Auch ohne Unterstützungswohnsitz bleibt die Aufenthaltsgemeinde zuständig (§ 6 Abs. 1 SPG); § 51 Abs. 1 SPG regelt nur, dass der Kanton dafür die **Kosten** trägt; § 42 nennt die Aufgaben des Kantonalen Sozialdienstes (Beratung der Gemeinden, Amtsverkehr u. a.). Im Asylbereich ist der Kanton «in der Regel» zuständig (§ 17a SPG, s. u.). ⟨korrigiert 09.11.2026, Fachprüfung⟩
**Antrag (kurz):** schriftliches Gesuch bei der Wohnsitzgemeinde, auf dem Formular des Kantonalen Sozialdienstes (§ 8 Abs. 1 SPV); Formular «Gesuch um materielle Hilfe» auf ag.ch (PDF, HTTP 200). Kein eigenes Verzeichnis der Gemeinde-Sozialdienste geprüft.
**SKOS (kurz):** teilweise / mit Abweichungen, **datierter (statischer) Verweis** — SKOS-Richtlinien «in der ab 1. Januar 2026 geltenden Fassung gemäss Anhang verbindlich», vorbehalten Ausnahmen in SPV und SPG (§ 2a Abs. 1 SPV); benannte Abweichungen u. a. keine automatische Teuerungsanpassung (§ 10 Abs. 5 SPV), eigene Freibeträge/Zulagen (§ 20–20c SPV), Existenzsicherung bei Kürzungen (§ 15 SPV).
**Aufsicht:** Departement Gesundheit und Soziales (Beschwerdeinstanz, § 58 SPG i. V. m. § 39a SPV), Kantonaler Sozialdienst / Beschwerdestelle SPG (auch Aufsichtsanzeigen) — https://www.ag.ch/de/ueber-uns/kantonale-verwaltung/departement-gesundheit-und-soziales/organisation/kantonaler-sozialdienst/beschwerdestelle-spg
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die öffentliche Sozialhilfe und die soziale Prävention (Sozialhilfe- und Präventionsgesetz, SPG) | SAR 851.200 | «vom 06.03.2001, in Kraft seit: 01.01.2003»; «Aktuelle Version in Kraft seit: 01.04.2024 (Beschlussdatum: 07.11.2023)» | https://gesetzessammlungen.ag.ch/app/de/texts_of_law/851.200 | API 200, PDF Version 3402 → 200; Gegenprobe API 999.999 → 404, `/atlantis-gibt-es-nicht-4711` → 404 |
| Sozialhilfe- und Präventionsverordnung (SPV) | SAR 851.211 | «vom 28.08.2002, in Kraft seit: 01.01.2003»; «Aktuelle Version in Kraft seit: 01.01.2026 (Beschlussdatum: 12.11.2025)» | https://gesetzessammlungen.ag.ch/app/de/texts_of_law/851.211 | API 200, PDF Version 3910 → 200; Gegenprobe wie oben |
| Richtlinien über die Geltendmachung von Verwandtenunterstützung (Verwandtenunterstützungsrichtlinien, VUR) | SAR 851.253 | «vom 25.05.2011, in Kraft seit: 01.07.2011»; aktuelle Version seit 01.07.2011 | https://gesetzessammlungen.ag.ch/app/de/texts_of_law/851.253 | API 200, PDF Version 1116 → 200; Gegenprobe wie oben |

### Zuständigkeit und Antrag
> «Zuständig und zur wirksamen Hilfeleistung verpflichtet ist die Gemeinde am Unterstützungswohnsitz, bei Personen ohne Unterstützungswohnsitz und im Notfall die Gemeinde am Aufenthaltsort der Hilfe suchenden Person.» — Quelle [1], § 6 Abs. 1 SPG

> «Die Gemeinde führt einen Sozialdienst.» / «Mehrere Gemeinden führen nach Möglichkeit zusammen einen regionalen Sozialdienst.» — Quelle [1], § 43 Abs. 1–2 SPG

> «Materielle Hilfe wird auf Gesuch hin in der Regel durch Geldleistungen oder durch Erteilung von Kostengutsprachen gewährt.» — Quelle [1], § 9 Abs. 1 SPG

> «Das Gesuch um materielle Hilfe hat schriftlich zu erfolgen. Der Kantonale Sozialdienst stellt den Gemeinden hierzu ein entsprechendes Formular zur Verfügung.» — Quelle [2], § 8 Abs. 1 SPV

> «Melden Sie sich bei der Gemeinde an Ihrem Wohnsitz. Die Gemeinde wird Ihnen ein Gesuch um materielle Hilfe aushändigen.» — Quelle [4]

Rechtsmittel: Beschwerde beim zuständigen Departement (DGS), dann Verwaltungsgericht; Beschwerdefrist im Gesetz (§ 58 SPG; § 39a SPV). Kostengutsprache für Arzt/Spital grundsätzlich **vor** der Behandlung, sonst Frist in der Verordnung; ohne rechtzeitige Kostengutsprache keine Übernahmepflicht (§ 9 Abs. 2–4 SPV) — kann Geld kosten.

### SKOS-Richtlinien
> «Für die Sozialhilfe sind die von der Schweizerischen Konferenz für Sozialhilfe erlassenen Richtlinien (SKOS-Richtlinien) in der ab 1. Januar 2026 geltenden Fassung gemäss Anhang verbindlich. Vorbehalten bleiben die in dieser Verordnung sowie im SPG beziehungsweise dessen Ausführungserlassen enthaltenen Ausnahmen.» — Quelle [2], § 2a Abs. 1 SPV

> «Es gelten folgende Ausnahmen von den SKOS-Richtlinien: … b) Die in den SKOS-Richtlinien vorgesehene automatische Teuerungsanpassung kommt nicht zur Anwendung. c) Sofern die Benützung eines Motorfahrzeuges nicht beruflich oder krankheitsbedingt zwingend erforderlich ist, werden die Betriebskosten in Abzug gebracht. …» — Quelle [2], § 10 Abs. 5 SPV

> «Der Regierungsrat regelt Art und Höhe der materiellen Hilfe, wobei eine Koordination mit andern Kantonen angestrebt wird.» — Quelle [1], § 10 Abs. 1 SPG

Weitere benannte Abweichungen (ohne Beträge): eigener Einkommensfreibetrag, Integrationszulage und deren gemeinsame
Obergrenze (§§ 20a–20c SPV); Existenzsicherung als Untergrenze bei Kürzung als Anteil des SKOS-Grundbedarfs (§ 15 Abs. 2 SPV);
Rückerstattungs-Präzisierungen (§ 20 SPV); Richtwert Krankenkassenprämie und kommunale Mietzinsrichtlinien
(§§ 15a–15b SPV); Verwandtenunterstützung nach VUR mit SKOS-Kapiteln «Stand 12/08» (§ 1 Abs. 3 VUR).

⚠️ **Widerspruch:** Die Amtsseite [4] schreibt «Die ordentliche Sozialhilfe wird im Kanton Aargau grundsätzlich nach den
Regeln der SKOS-Richtlinien (Stand 1. Januar 2023) bemessen.» Die geltende SPV (seit 01.01.2026) nennt die Fassung ab
1. Januar 2026. Massgebend ist die Verordnung; die Amtsseite ist veraltet.

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** bei gebesserten Verhältnissen (§ 20 Abs. 1 SPG); Erben höchstens im Umfang der Erbschaft und soweit bereichert (§ 20 Abs. 3); auch Begünstigte von Kapitalleistungen 2./3. Säule beim Tod, mit Ausnahmen für Ehegatten, Konkubinatspartner, Kinder (§ 20 Abs. 3bis); rechtmässige Rückforderungen **unverzinslich** (§ 20 Abs. 4), unrechtmässige **samt Zins** (§ 3 SPG; Zinssatz in § 2 SPV); Erlöschensfrist im Gesetz (§ 22 SPG); bei Vereinbarung ~~«grundsätzlich ein Drittel der Schuld zu erlassen»~~ teilweiser Erlass der Schuld, Anteil in der Verordnung ⟨korrigiert 09.11.2026, Fachprüfung⟩ (§ 20 Abs. 5 SPV); Leistungen für Minderjährige/Erstausbildung ~~bis 25~~ bis zu einer Altersgrenze im Erlass ⟨korrigiert 09.11.2026, Fachprüfung⟩ und Integrationsleistungen ausgenommen (§ 20 Abs. 4 SPV); Säule-3a-Guthaben darf nicht herangezogen werden (§ 20 Abs. 2bis SPV).
  > «Wer materielle Hilfe bezogen hat, ist rückerstattungspflichtig, wenn sich die wirtschaftlichen Verhältnisse so weit gebessert haben, dass eine Rückerstattung ganz oder teilweise zugemutet werden kann.» — [1], § 20 Abs. 1 SPG
  > «Die Erbinnen und Erben der unterstützten Person sind höchstens im Umfang der empfangenen Erbschaft, und soweit sie dadurch bereichert sind, zur Rückerstattung verpflichtet.» — [1], § 20 Abs. 3 SPG
  > «Rückerstattungsforderungen sind unverzinslich.» — [1], § 20 Abs. 4 SPG
  > «Unrechtmässig bezogene Leistungen sind samt Zins zurückzuzahlen.» — [1], § 3 Abs. 1 SPG
  > «Der Anspruch auf Rückerstattung gegenüber unterstützten Personen sowie Erbinnen und Erben erlischt, sofern nicht innert 15 Jahren seit Ende des Kalenderjahres, in dem die materielle Hilfe ausgerichtet wurde, eine Vereinbarung vorliegt oder die Gemeinde beziehungsweise der Kanton eine Verfügung über die Rückerstattung erlässt.» — [1], § 22 Abs. 1 SPG
- **Verwandtenunterstützung:** Gemeinde **muss** prüfen und geltend machen, nach Richtlinien des Regierungsrats (VUR, ~~mit hohen Vermögensfreibeträgen im Erlass~~ Freibeträge im Erlass ⟨korrigiert 09.11.2026, Fachprüfung⟩).
  > «Die Gemeinde prüft das Vorliegen von Ansprüchen aus Unterhalts- und Verwandtenunterstützungspflicht gemäss den Art. 131a Abs. 2, 289 Abs. 2 und 329 Abs. 3 des Schweizerischen Zivilgesetzbuches (ZGB) … und trifft mit pflichtigen Personen nach Möglichkeit eine Vereinbarung über Art und Umfang der Leistung.» — [1], § 7 Abs. 1 SPG
  > «Die Gemeinden sind verpflichtet, Unterhalts- und Verwandtenunterstützungsansprüche im Rahmen der Richtlinien des Regierungsrates geltend zu machen.» — [2], § 6 Abs. 2 SPV
  > «Der geltend zu machende Verwandtenunterstützungsbeitrag besteht höchstens im Umfang der gewährten materiellen Hilfe.» — [3], § 2 Abs. 1 VUR
- **Aufenthaltsbewilligung:** Folgen für die Bewilligung (Meldung ans Migrationsamt) in den kantonalen Quellen zur ordentlichen Sozialhilfe nicht genannt (Zusammenarbeit mit dem Amt für Migration und Integration nur im Nothilfebereich für Ausreisepflichtige, § 19e SPV). Belegt ist der Einfluss des Status auf den **Anspruch**:
  > «Arbeitsuchende gemäss Art. 2 Abs. 1 des Anhangs I zum Abkommen … über die Freizügigkeit sind von der Sozialhilfe ausgeschlossen.» — [1], § 5 Abs. 4 SPG
  > «Wenn Sie beispielsweise eine Aufenthaltsbewilligung zwecks Erwerbstätigkeit oder eine Kurzaufenthaltsbewilligung haben, kann es sein, dass Sie nur einen reduzierten Betrag erhalten.» — [4]
  Bundesrecht (AIG) ist nicht Gegenstand dieser Erhebung — daraus folgt **nicht**, dass keine Meldung erfolgt; bei der Stelle prüfen. ⟨ergänzt 09.11.2026, Fachprüfung⟩
- **Asylbereich:** eigene Regeln (§§ 16–19 SPG) und eigene Zuständigkeit:
  > «Für Asylsuchende, Schutzbedürftige ohne Aufenthaltsbewilligung und vorläufig Aufgenommene gelten die §§ 17–19.» — [1], § 16 Abs. 1 SPG
  > «Der Kanton ist in der Regel zuständig für Unterbringung, Unterstützung und Betreuung von Asylsuchenden und ausreisepflichtigen Personen.» — [1], § 17a Abs. 1 SPG
  > «Die Gemeinden sind in der Regel zuständig für Unterbringung, Unterstützung und Betreuung von vorläufig Aufgenommenen ohne Flüchtlingseigenschaft und Schutzbedürftigen ohne Aufenthaltsbewilligung.» — [1], § 17a Abs. 2 SPG
  Schutzbedürftige mit Aufenthaltsbewilligung und Flüchtlinge: ordentliche Bestimmungen (§ 16 Abs. 2 SPG).
- **Wohnsitzwechsel:** ZUG gilt (§ 6 Abs. 3 SPG); Auflagen, Weisungen und Kürzungen können bei Umzug weitergelten, wenn die neue Gemeinde dies schriftlich bestätigt. Die Daten gehen beim Wegzug an die neue Sozialbehörde:
  > «Beim Wegzug einer mit materieller Hilfe unterstützten Person sind deren Daten vollständig und in jedem Fall der neu zuständigen Sozialbehörde bekannt zu geben.» — [1], § 46 Abs. 3bis SPG ⟨ergänzt 09.11.2026, Fachprüfung⟩
  > «Der Wohnsitzwechsel hat bei gleichbleibenden Verhältnissen keine Wirkung auf vollstreckbare Auflagen und Weisungen, wenn die Gemeinde am neuen Unterstützungswohnsitz deren Weitergeltung schriftlich bestätigt und damit die Auflagen und Weisungen übernimmt.» — [1], § 13c Abs. 1 SPG (Abs. 2: gleich für Kürzungen/Einstellungen)
- **Mitwirkungs-/Meldepflicht** ~~(auch nach Ende des Bezugs: «beziehen oder erhalten haben»)~~ ⟨korrigiert 09.11.2026, Fachprüfung: «beziehen oder erhalten haben» steht nur in der **Auskunftspflicht** § 2 Abs. 1 SPG; die **Meldepflicht** § 2 Abs. 3 gilt nur für Personen, die Leistungen «geltend machen oder beziehen»⟩: > «Personen, die Leistungen nach diesem Gesetz geltend machen oder beziehen, sind verpflichtet, Veränderungen in ihren Verhältnissen umgehend zu melden.» — [1], § 2 Abs. 3 SPG
- **Kürzung/Einstellung:** bei verletzter Mitwirkung oder Verweigerung zumutbarer Arbeit/Verwertung nach schriftlicher Androhung (§ 5a SPG); bei Missachtung von Auflagen, in schweren Fällen unter die Existenzsicherung oder Einstellung, Nothilfe nach Art. 12 BV vorbehalten (§ 13b SPG).
- **Vermögen / Grundpfand:** Vermögen grundsätzlich zu verwerten; sonst Rückerstattungsverpflichtung, bei Grundeigentum pfandrechtlich gesichert (nicht für Grundeigentum im Ausland).
  > «Ist die Verwertung nicht möglich, nicht zumutbar oder im gegenwärtigen Zeitpunkt nicht angezeigt, hat die Hilfe suchende Person eine Rückerstattungsverpflichtung zu unterzeichnen. Die Rückerstattungsforderung wird im Zeitpunkt des Eigentumsübergangs fällig. Bei Grundeigentum ist die Rückerstattung pfandrechtlich sicherzustellen.» — [1], § 11 Abs. 5 SPG
- **Abtretung / Vorschüsse:** Hilfe kann von Abtretung von Ansprüchen abhängig gemacht werden; Vorschüsse höchstens im Umfang der Nachzahlung zurückzuzahlen — [1], § 12 SPG
- **Gebundene Ausgaben:** Auflage, Miete und KVG-Prämie an Richtwerte anzupassen; danach nur noch Richtwert übernommen — [1], § 13a SPG
- **Busse:** > «Mit Busse wird bestraft, wer durch unwahre oder unvollständige Angaben, durch Verschweigen von veränderten Verhältnissen oder in anderer Weise für sich oder andere Leistungen nach diesem Gesetz unrechtmässig erwirkt.» — [1], § 59 Abs. 1 SPG
- **Observation:** gesetzliche Grundlage für Observationen (§§ 19c–19e SPG; §§ 19f–19m SPV).

### Offen / nicht gefunden
- Seite des Kantonalen Sozialdienstes unter `…/organisation/kantonaler-sozialdienst` antwortet **404** (Unterseite Beschwerdestelle SPG 200). Übergeordnete Amtsseite nicht gefunden.
- Kein amtliches Verzeichnis der kommunalen/regionalen Sozialdienste geprüft.
- Gesuchsformular-PDF ist ein XFA-Formular; Inhalt mit `pdftotext` nicht lesbar (nur Bestand belegt).
- Amtsseite nennt SKOS «Stand 1. Januar 2023», SPV 2026 (s. o.).
- VUR verweist auf SKOS-Kapitel «Stand 12/08» — inhaltlich veraltet gegenüber § 2a SPV, aber geltend.

### Quellen
1. Gesetz über die öffentliche Sozialhilfe und die soziale Prävention (SPG), SAR 851.200, Kanton Aargau, Stand 01.04.2024. https://gesetzessammlungen.ag.ch/app/de/texts_of_law/851.200 (API https://gesetzessammlungen.ag.ch/api/de/texts_of_law/851.200, PDF …/api/de/versions/3402/pdf_file) — abgerufen 09.11.2026, HTTP 200 / 200; Gegenprobe `/api/de/texts_of_law/999.999` → 404, `/atlantis-gibt-es-nicht-4711` → 404
2. Sozialhilfe- und Präventionsverordnung (SPV), SAR 851.211, Regierungsrat, Stand 01.01.2026. https://gesetzessammlungen.ag.ch/app/de/texts_of_law/851.211 (API …/texts_of_law/851.211, PDF …/versions/3910/pdf_file) — abgerufen 09.11.2026, HTTP 200 / 200; Gegenprobe wie [1]
3. Richtlinien über die Geltendmachung von Verwandtenunterstützung (VUR), SAR 851.253, Regierungsrat, Stand 01.07.2011. https://gesetzessammlungen.ag.ch/app/de/texts_of_law/851.253 (API …/texts_of_law/851.253, PDF …/versions/1116/pdf_file) — abgerufen 09.11.2026, HTTP 200 / 200; Gegenprobe wie [1]
4. Überblick zur Sozialhilfe für Privatpersonen, Kanton Aargau (DGS), ohne Datum. https://www.ag.ch/de/themen/soziales-gesellschaft/soziale-sicherheit/sozialhilfe/sozialhilfe-fuer-privatpersonen — abgerufen 09.11.2026, HTTP 200; Gegenprobe `https://www.ag.ch/de/atlantis-gibt-es-nicht-4711` → 404 («404-Seite - Kanton Aargau»)
5. Sozialhilfe, Kanton Aargau (= `CANTONAL_LINKS.AG.sozialdienst`). https://www.ag.ch/de/themen/soziales-gesellschaft/soziale-sicherheit/sozialhilfe — abgerufen 09.11.2026, HTTP 200, Titel «Sozialhilfe - Kanton Aargau»; Gegenprobe wie [4]
6. Beschwerdestelle SPG, Kantonaler Sozialdienst, DGS Aargau. https://www.ag.ch/de/ueber-uns/kantonale-verwaltung/departement-gesundheit-und-soziales/organisation/kantonaler-sozialdienst/beschwerdestelle-spg — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [4]
7. Gesuch um materielle Hilfe (PDF, XFA-Formular), Kanton Aargau. https://www.ag.ch/media/kanton-aargau/dgs/dokumente/gesellschaft/soziales/oeffentliche-sozialhilfe/sozialhilfe/publiziert-am-30-09-25-gesuch-um-materielle-hilfe-aktiviert.pdf — abgerufen 09.11.2026, HTTP 200 (application/pdf); Gegenprobe wie [4]

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **beanstandet:** Zuständigkeit Kanton aus Kostennorm (§ 51) abgeleitet; Meldepflicht «auch nach Ende» falsch zugeordnet; Zahlen ausserhalb Zitaten («Drittel», «bis 25»); Wertung «hohe Freibeträge»; § 46 Abs. 3bis fehlte; B/C-Formulierung.
- **geändert:** alle Punkte korrigiert (alte Aussagen durchgestrichen); § 46 Abs. 3bis SPG ergänzt; Bundesrechts-Hinweis; Zeile Asylbereich (§§ 16, 17a SPG) neu — alle Zitate am eigenen Download geprüft.
- **offen:** Amtsseite des Kantonalen Sozialdienstes (404); Verzeichnis der Gemeinde-Sozialdienste.

---

## TG — Thurgau

**Beurteilung:** belegbar
**Zuständig (kurz):** die Wohnsitzgemeinde, bei unklarem Wohnsitz oder unaufschiebbarem Bedarf die Aufenthaltsgemeinde (§ 4 Abs. 1 SHG); Organ ist die von der Gemeinde gewählte Sozialhilfebehörde mit Sozialhilfebetreuer/in (§ 5); Gemeinden können gemeinsame Sozialdienste/Zweckverbände bilden (§ 1 Abs. 2–3 SHV). Das kantonale Sozialamt ist ZUG-Stelle (§ 4 Abs. 3 SHG) und ~~berät nur Gemeinden~~ berät laut Amtsseite «Gemeinden und Fachstellen im Bereich Sozialhilfe» [4] ⟨korrigiert 09.11.2026, Fachprüfung⟩.
**Antrag (kurz):** Gesuch bei der Wohngemeinde (Sozialhilfebehörde); Hilfe beginnt, sobald die Behörde Kenntnis von der Not erhält (§ 24 SHG). Verzeichnis der Beratungsstellen: «Sozialnetz Kanton Thurgau» (sozialnetz.tg.ch, HTTP 200). Amtliches «Merkblatt für Unterstützte» (~~2026~~ Jahr nur im Dateinamen, im PDF kein Datum ⟨korrigiert 09.11.2026, Fachprüfung⟩) mit Erklärung zum Unterschreiben.
**SKOS (kurz):** ganz «in der Regel» mit kantonalen Konkretisierungen; ~~**dynamischer Verweis**~~ dynamisch («in der jeweils geltenden Fassung») nur für die materielle Grundsicherung (§ 2b Abs. 1), § 2a Abs. 1 nennt keine Fassung ⟨korrigiert 09.11.2026, Fachprüfung⟩ — SKOS-Richtlinien «finden in der Regel … Anwendung» (§ 2a Abs. 1 SHV); materielle Grundsicherung nach SKOS «in der jeweils geltenden Fassung, wobei Änderungen ab dem 1. Januar des Folgejahres gelten» (§ 2b Abs. 1 SHV); Abweichungen zu begründen (§ 2b Abs. 2); eigene Regeln zu Wohnkosten, Integrationszulagen, Freibeträgen, Kürzungen, jungen Erwachsenen (§§ 2b–2k SHV).
**Aufsicht:** Departement für Finanzen und Soziales (beaufsichtigt die Sozialhilfebehörden, § 6 Abs. 1 SHG; Rekursinstanz § 26), Regierungsrat (gesamte Sozialhilfe, § 6 Abs. 2); Fachstelle Sozialamt des Kantons Thurgau — https://sozialamt.tg.ch/
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Sozialhilfegesetz (SHG) | RB 850.1 | «vom 29.03.1984, in Kraft seit: 01.01.1986»; «Aktuelle Version in Kraft seit: 01.04.2023 bis: 31.12.2026 (Beschlussdatum: 21.12.2022)»; **künftige Version** «in Kraft ab: 01.01.2027 (Beschlussdatum: 04.02.2026)» | https://www.rechtsbuch.tg.ch/app/de/texts_of_law/850.1 | API 200, PDF Version 2643 → 200, künftige Version 3042 → 200; Gegenprobe API 999.999 → 404, `/atlantis-gibt-es-nicht-4711` → 404 |
| Sozialhilfeverordnung (SHV) | RB 850.11 | «vom 15.10.1985, in Kraft seit: 01.01.1986»; «Aktuelle Version in Kraft seit: 01.01.2026 (Beschlussdatum: 25.11.2025)» | https://www.rechtsbuch.tg.ch/app/de/texts_of_law/850.11 | API 200, PDF Version 3020 → 200; Gegenprobe wie oben |

### Zuständigkeit und Antrag
> «Zuständig ist die Wohnsitzgemeinde der hilfsbedürftigen Person. Die Gemeinde des Aufenthaltsorts ist zuständig, solange die Wohnsitzgemeinde nicht feststeht oder wenn jemand unaufschiebbar der Hilfe bedarf.» — Quelle [1], § 4 Abs. 1 SHG

> «Verfügt jemand nicht über hinreichende Mittel zur Bestreitung des Lebensunterhalts für sich und seine Angehörigen mit gleichem Wohnsitz, sorgt die Gemeinde für die notwendige Unterstützung, sofern von der hilfsbedürftigen Person nicht verlangt werden kann, sich die Mittel durch eigene Arbeit zu beschaffen, und keine andere Hilfe möglich ist.» — Quelle [1], § 8 Abs. 1 SHG

> «Die Gemeinde wählt die Sozialhilfebehörde, deren Präsidentin oder Präsidenten sowie mindestens eine Sozialhilfebetreuerin oder einen Sozialhilfebetreuer.» — Quelle [1], § 5 Abs. 1 SHG

> «… kann bei der Wohngemeinde ein Gesuch um Sozialhilfe gestellt werden. Für Fragen rund um die Sozialhilfe und einen möglichen Anspruch ist die Wohngemeinde zuständig.» — Quelle [4]

> «Gegen Entscheide der Sozialhilfebehörde kann innert 30 Tagen beim Departement für Finanzen und Soziales Rekurs erhoben werden.» — Quelle [1], § 26 Abs. 1 SHG

Ab 01.01.2027 (künftige Fassung [1b]): Zuständigkeitskonflikte zwischen Gemeinden entscheidet bei fehlender Einigung das Departement (§ 4 Abs. 2bis neu).
Weitere Änderungen der Fassung ab 01.01.2027 (Diff Version 2643 ↔ 3042, am eigenen Download geprüft) ⟨ergänzt 09.11.2026, Fachprüfung⟩:
- § 8 Abs. 2 neu: > «Unterstützte Personen in Pflegefamilien sowie in Kinder- und Jugendheimen haben nach Erreichen der Volljährigkeit bis zum Abschluss einer angemessenen Ausbildung, jedoch längstens bis zum vollendeten 25. Altersjahr, Anspruch auf Weiterführung der Unterbringung im bisherigen Umfang.» — [1b]
- § 6b Abs. 1 / § 6c: Heimbewilligung «vorbehältlich § 6c»; Gemeinden bewilligen und beaufsichtigen stationäre und **neu ambulante** Betreuungs- und Pflegeangebote (Personenzahl im Gesetz).
- § 19 Abs. 2: Rückerstattungspflicht neu ab Abschluss einer angemessenen Ausbildung (Altersgrenze im Gesetz), s. u.
- § 21 Abs. 1 Ziff. 1 aufgehoben — aus einem **anderen** Beschluss vom 14.08.2024 (Änderungstabelle: «34/2024»).
- Die SHV hat laut API keine künftige Fassung.

### SKOS-Richtlinien
> «Für die Bemessung der Unterstützung gemäss § 8 des Gesetzes finden in der Regel die Richtlinien der Schweizerischen Konferenz für Sozialhilfe (SKOS-Richtlinien) Anwendung. Nachfolgende Konkretisierungen sind ergänzend für die Bemessung massgebend.» — Quelle [2], § 2a Abs. 1 SHV

> «Die Höhe der materiellen Grundsicherung (Grundbedarf für den Lebensunterhalt, Wohnungskosten und Kosten für medizinische Grundversorgung) bemisst sich in der Regel nach den SKOS-Richtlinien in der jeweils geltenden Fassung, wobei Änderungen ab dem 1. Januar des Folgejahres gelten.» — Quelle [2], § 2b Abs. 1 SHV

> «Abweichungen sind zu begründen.» — Quelle [2], § 2b Abs. 2 SHV

Benannte kantonale Konkretisierungen (ohne Beträge): Gemeinden legen maximale ortsübliche Wohnungskosten fest
(§ 2b Abs. 4); Zahnarztkosten nur zur Erhaltung der Kaufähigkeit oder schmerzstillend (§ 2c Abs. 1); eigene
Integrationszulagen, Einkommens-Freibetrag und gemeinsame Obergrenze (§§ 2d–2g); eigener Kürzungsrahmen (§ 2h);
junge Erwachsene ~~18–25~~ in einer Altersspanne im Erlass ⟨korrigiert 09.11.2026, Fachprüfung⟩ mit Wohn- und Grundbedarfsvorgaben (§ 2k); Ausschluss bestimmter Ausländergruppen (§ 2l).

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** zu Unrecht bezogene Leistungen samt Zins; rechtmässig bezogene ab einer Altersgrenze im Gesetz, soweit zumutbar; Erben bis zur Höhe der Erbschaft; Verjährungsfristen im Gesetz (relativ und absolut, länger bei Haftung aus Erbschaft); Unterbrechung der Verjährung nach § 28 SHV; Vorschüsse auf Versicherungsleistungen sind immer zumutbar zurückzuerstatten (§ 27 Abs. 3 SHV).
  > «Zu Unrecht bezogene Leistungen sind samt Zins zurückzuerstatten.» — [1], § 19 Abs. 1 SHG
  > «Wer nach dem vollendeten 18. Altersjahr Unterstützungsbeiträge bezogen hat, ist zur Rückerstattung verpflichtet, soweit dies zumutbar ist. Erben und Erbinnen haften bis zur Höhe ihrer Erbschaft.» — [1], § 19 Abs. 2 SHG (Fassung **bis 31.12.2026**)
  > «Wer nach Abschluss einer angemessenen Ausbildung, spätestens jedoch ab dem vollendeten 25. Altersjahr, Unterstützungsbeiträge bezogen hat, ist zur Rückerstattung verpflichtet, soweit dies zumutbar ist. Erbinnen und Erben haften bis zur Höhe ihrer Erbschaft.» — [1b], § 19 Abs. 2 SHG (Fassung **ab 01.01.2027**)
  > «Rückerstattungsansprüche verjähren fünf Jahre seit Kenntnis, in jedem Fall aber 15 Jahre seit der letzten Leistung. Bei Haftung aus Erbschaft beträgt die Frist 20 Jahre.» — [1], § 19 Abs. 4 SHG
  > «Unterstützungen werden aus Steuergeldern finanziert und sind grundsätzlich rückerstattungspflichtig. Sie sind zurückzubezahlen, sobald sich die materiellen Verhältnisse einer unterstützten Person wesentlich verbessert haben (z.B. durch Einkommen, Erbschaft, Schenkungen, Gewinne).» — [3], Ziff. 3
- **Verwandtenunterstützung:** Gemeinde **muss** prüfen, auffordern, vermitteln und nötigenfalls geltend machen; kein Rückgriff auf Verwandte für uneinbringliche Alimentenvorschüsse.
  > «Die Gemeinde prüft, ob nach den Bestimmungen des Schweizerischen Zivilgesetzbuchs (ZGB) Verwandte zur Unterstützung der hilfsbedürftigen Person verpflichtet sind. Sie hat Unterstützungspflichtige zur Hilfe aufzufordern und zwischen ihnen und der hilfsbedürftigen Person zu vermitteln. Nötigenfalls ist die Verwandtenunterstützung bei den zuständigen Behörden geltend zu machen.» — [1], § 18 Abs. 1 SHG
  > «Verwandtenunterstützungen und Rückerstattungen Einzelner sind von der kostenpflichtigen Gemeinde geltend zu machen.» — [2], § 27 Abs. 1 SHV
- **Aufenthaltsbewilligung:** in den kantonalen Quellen **genannt**: Personen mit Kurzaufenthaltsbewilligung und Stellensuchende nach FZA/EFTA sind ~~von der ordentlichen Sozialhilfe ausgeschlossen (nur Nothilfe)~~ — **unter Vorbehalt abweichenden Bundesrechts** — von der ordentlichen Sozialhilfe ausgeschlossen (Nothilfe) ⟨korrigiert 09.11.2026, Fachprüfung⟩:
  > «Unter Vorbehalt abweichender Bestimmungen des Bundesrechts sind folgende Personen von der ordentlichen Sozialhilfe ausgeschlossen: …» — [2], § 2l Abs. 1 SHV
  Für diese Fälle meldet diese Fälle der Ausländerbehörde. Zudem stellt die Wohngemeinde Bestätigungen über den Sozialhilfebezug für die Ausweisverlängerung aus.
  > «Sie meldet Unterstützungsfälle nach Abs. 1 Ziff. 2 und Ziff. 3 der zuständigen Ausländerbehörde.» — [2], § 2l Abs. 3 SHV (Ziff. 2: «Personen mit Kurzaufenthaltsbewilligung», Ziff. 3: Arbeitssuchende nach FZA/EFTA)
  > «Für eine Bestätigung über den Sozialhilfebezug für die Ausweisverlängerung ist ebenfalls die Wohngemeinde zuständig.» — [4]
  Eine allgemeine Meldepflicht für andere Bewilligungen (B/C) ist in den kantonalen Quellen nicht genannt. Bundesrecht (AIG) ist nicht Gegenstand dieser Erhebung — daraus folgt **nicht**, dass keine Meldung erfolgt; bei der Stelle prüfen. ⟨ergänzt 09.11.2026, Fachprüfung⟩
- **Asylbereich:** eigene Regeln über Weisungen des Departements; Ausnahme von der Rückerstattung.
  > «Für die sozialhilferechtliche Betreuung von Personen, die der Asylgesetzgebung unterstehen, kann der Regierungsrat in Absprache mit den Gemeinden besondere Vorschriften erlassen.» — [1], § 1 Abs. 3 SHG
  > «Für die Unterstützung oder die Notfallhilfe von Asylsuchenden, Schutzbedürftigen mit und ohne Aufenthaltsbewilligung sowie von Personen mit einem Entscheid gestützt auf die Asylgesetzgebung erlässt das Departement Weisungen.» — [2], § 2i Abs. 1 SHV
  > «Bezieht eine dem Asylrecht unterstellte Person Leistungen, für welche die Gemeinde vom Kanton einen aus den vom Bund ausgerichteten Globalpauschalen finanzierten Beitrag erhält, ist sie von der Rückerstattungspflicht ausgenommen.» — [1], § 19 Abs. 5 SHG
- **Wohnsitzwechsel:** Wohnsitz und Aufenthalt nach ZUG (§ 4 Abs. 2 SHG); Observation endet beim Wegzug, die neue Gemeinde kann informiert werden (§ 8e Abs. 4 SHG). Merkblatt: Wegzug ist meldepflichtige Änderung [3, Ziff. 5].
- **Mitwirkungs-/Meldepflicht:** > «Die hilfsbedürftige Person hat über ihre Verhältnisse wahrheitsgetreu Auskunft zu geben und die erforderliche Akteneinsicht zu gestatten.» — [1], § 25 Abs. 1 SHG; Änderungen «unverzüglich und in jedem Fall mitzuteilen» — [3], Ziff. 5
- **Kürzung/Einstellung:** nach Verwarnung bei Nichtbefolgen von Anordnungen oder Missbrauch (§ 25 Abs. 3 SHG); bei Weigerung, Arbeit oder Beschäftigungsprogramm anzunehmen (§ 8b SHG); Kürzungsrahmen und Einstellung auf Nothilfe in § 2h SHV; Kürzung zwingend bei selbstverschuldeter Einstellung von ALV-Taggeldern (§ 6a SHV).
  > «Hilfsbedürftige Personen, die Anordnungen der Behörden nicht befolgen oder deren Hilfe missbrauchen, wird die Unterstützung nach Verwarnung gekürzt oder eingestellt.» — [1], § 25 Abs. 3 SHG
- **Abtretung / Bevorschussung:** Hilfe kann von der Abtretung vermögensrechtlicher Ansprüche abhängig gemacht werden (§ 25 Abs. 2 SHG); bevorschusste Versicherungsleistungen gehen von Gesetzes wegen auf die Sozialhilfebehörde über (§ 19a SHG).
- **Observation:** gesetzliche Grundlage, auch Bild- und Tonaufzeichnungen (§§ 8c–8f SHG).
- **Kostengutsprache vorher einholen:** für grössere Anschaffungen, Zahnarzt usw. «jeweils vorgängig» — [3], Ziff. 4
- **Konkubinat:** Partner/in beteiligt sich anteilmässig an den Lebenshaltungskosten — [3], Ziff. 3

### Offen / nicht gefunden
- Änderung ab 01.01.2027 bei der Rückerstattungspflicht (§ 19 Abs. 2 SHG) — in der App mit Stichtag unterscheiden.
- Keine eigene Amtsseite des Departements für Finanzen und Soziales als Aufsicht geprüft; nur Sozialamt.
- Weisungen des Departements zum Asylbereich (§ 2i SHV) nicht erhoben.
- Sozialnetz Kanton Thurgau: Startseite 200, aber die Textextraktion aus dem curl-Abruf lieferte keinen Inhalt (vermutlich clientseitig geladen, nicht geprüft); Vollständigkeit des Verzeichnisses nicht belegt.

### Quellen
1. Sozialhilfegesetz (SHG), RB 850.1, Kanton Thurgau, Stand 01.04.2023 (gültig bis 31.12.2026). https://www.rechtsbuch.tg.ch/app/de/texts_of_law/850.1 (API https://www.rechtsbuch.tg.ch/api/de/texts_of_law/850.1, PDF …/api/de/versions/2643/pdf_file) — abgerufen 09.11.2026, HTTP 200 / 200; Gegenprobe `/api/de/texts_of_law/999.999` → 404, `/atlantis-gibt-es-nicht-4711` → 404
1b. Sozialhilfegesetz (SHG), RB 850.1, künftige Fassung «Stand 1. Januar 2027», Beschluss 04.02.2026 (ABl. 7/2026). PDF https://www.rechtsbuch.tg.ch/api/de/versions/3042/pdf_file — abgerufen 09.11.2026, HTTP 200; Gegenprobe wie [1]
2. Sozialhilfeverordnung (SHV), RB 850.11, Regierungsrat, Stand 01.01.2026. https://www.rechtsbuch.tg.ch/app/de/texts_of_law/850.11 (API …/texts_of_law/850.11, PDF …/versions/3020/pdf_file) — abgerufen 09.11.2026, HTTP 200 / 200; Gegenprobe wie [1]
3. Merkblatt für Unterstützte, Sozialamt des Kantons Thurgau, Asylkoordination und Sozialhilfe, ~~Ausgabe 2026~~ ohne Datum im Dokument, «2026» nur im Dateinamen ⟨korrigiert 09.11.2026, Fachprüfung⟩ (PDF). https://sozialamt.tg.ch/public/upload/assets/143873/2026_Merkblatt_f%C3%BCr_Unterst%C3%BCtzte.pdf?fp=3 — abgerufen 09.11.2026, HTTP 200 (application/pdf); Gegenprobe `https://sozialamt.tg.ch/atlantis-gibt-es-nicht-4711` → 404
4. Sozialhilfe, Sozialamt des Kantons Thurgau. https://sozialamt.tg.ch/sozialhilfe.html/4501 — abgerufen 09.11.2026, HTTP 200, h1 «Sozialhilfe»; Gegenprobe `https://sozialamt.tg.ch/atlantis.html/4711` → 404 («Seite nicht gefunden»)
5. Sozialamt des Kantons Thurgau, Startseite (= `CANTONAL_LINKS.TG.sozialdienst`). https://sozialamt.tg.ch/ — abgerufen 09.11.2026, HTTP 200, Titel «Sozialamt»; Gegenprobe wie [4]
6. Sozialnetz Kanton Thurgau. https://sozialnetz.tg.ch/ — abgerufen 09.11.2026, HTTP 200, Titel «Sozialnetz Kanton Thurgau»; Gegenprobe `https://sozialnetz.tg.ch/atlantis-gibt-es-nicht-4711` → 404

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **beanstandet:** Fassung ab 01.01.2027 unvollständig; Ausschluss L/FZA ohne Bundesrechts-Vorbehalt (überzeichnet); «dynamisch» zu pauschal; «berät nur Gemeinden»; «Ausgabe 2026» nur aus Dateiname; Zahlen ausserhalb Zitaten; B/C-Formulierung.
- **geändert:** alle Punkte korrigiert (alte Aussagen durchgestrichen); künftige Änderungen §§ 6b, 6c, 8 Abs. 2, 21 ergänzt; § 2l Abs. 1 SHV zitiert; Bundesrechts-Hinweis; Zeile Asylbereich (§ 1 Abs. 3, § 19 Abs. 5 SHG, § 2i SHV) neu — alle Zitate am eigenen Download geprüft.
- **offen:** Weisungen des Departements zum Asylbereich; Datum des Merkblatts.

---

---

## TI — Ticino

**Beurteilung:** belegbar
**Zuständig (kurz):** ~~Kanton: Dipartimento della sanità e della socialità (DSS), via Sezione del sostegno sociale / Ufficio del sostegno sociale e dell'inserimento (USSI) entscheidet; Gemeinde informiert und bereitet vor (Las Art. 48, 52; RLas Art. 1)~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ Kanton entscheidet: Dipartimento della sanità e della socialità (DSS), via Sezione del sostegno sociale / USSI (Las Art. 48; RLas Art. 1). Die Wohnsitzgemeinde gibt bei ordentlichen und speziellen Leistungen eine grundsätzlich verbindliche Stellungnahme («preavviso») ab (Las Art. 52 lett. f, Art. 60 cpv. 2)
**Asylbereich:** eigene Regeln — Leistungen an Asylsuchende und Schutzbedürftige ohne Aufenthaltsbewilligung regelt der Staatsrat gesondert (Las Art. 6 cpv. 1); eigenes Reglement «Regolamento sull'aiuto sociale in materia d'asilo (RASMA)», 871.120 (nur Titel im Index gesehen, nicht gelesen); für anerkannte Flüchtlinge zuständig das URAR (RLas Art. 1)
**Antrag (kurz):** beim Comune di domicilio, der das Dossier an das regionale «sportello LAPS» weitergibt; dieses leitet an das USSI (RLas Art. 14; Las Art. 59; Verzeichnis der sportelli LAPS vorhanden)
**SKOS (kurz):** teilweise / Orientierung — Interventionsschwelle jährlich «tenuto conto delle direttive» der CSIAS (Las Art. 19), Kürzungen und Sonderleistungen ebenso (Las Art. 23 cpv. 2; RLas Art. 8g); weitere CSIAS-Empfehlungen nur soweit mit Las/RLas vereinbar (Direttive 2026 Ziff. 6). Keine pauschale Übernahme.
**Aufsicht:** Consiglio di Stato (vigilanza superiore, Las Art. 46); Dipartimento (Las Art. 48) — DASF (DSS) https://www4.ti.ch/dss/dasf/home
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Legge sull'assistenza sociale dell'8 marzo 1971 (Las) | 871.100 (Numerazione precedente 6.4.11.1) | «stato 1° agosto 2026» | https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge/num/392 | 200, Volltext; erfundene ID `num/99999` → 200 mit «L'atto normativo cercato non è contenuto nella Raccolta delle leggi» (Soft-404, Bestand also über Inhalt belegt); `/atlantis-gibt-es-nicht-4711` → 404 |
| Regolamento sull'assistenza sociale del 18 febbraio 2003 (RLas) | 871.110 | «stato 3 marzo 2023» | https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge/num/393 | 200, Volltext; Gegenprobe wie oben |
| Legge sull'armonizzazione e il coordinamento delle prestazioni sociali (Laps) | 870.100 | «stato 1° agosto 2026» | https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge/num/340 | 200 (nur Zusammenhang) |
| Direttive riguardanti gli importi delle prestazioni assistenziali per il 2026 (DSS) | BU N. 46/2025 | in Kraft 01.01.2026 | https://www4.ti.ch/fileadmin/DSS/DASF/SdSS/Direttive_importi_assistenziali_2026.pdf | 200 application/pdf |

Hinweis: Der Pfad `…/legge/num/6.4.11.1` und auch `…/legge/num/871.100` liefern 200 mit «non è contenuto» — die
RLeggi-URL braucht die interne ID (392/393), nicht die Erlassnummer.

### Zuständigkeit und Antrag
> «Il Dipartimento designato dal Consiglio di Stato (qui abbreviato: Dipartimento) è l’Autorità cantonale competente in materia di assistenza sociale. 2Esso […] b)decide sulle domande d’assistenza e su ogni prestazione assistenziale in genere» — [1], Art. 48

> «Per le domande di prestazioni di cui agli art. 18 e 20 il Dipartimento decide in base ad un preavviso del Comune di domicilio del beneficiario che ha, di principio, carattere vincolante.» — [1], Art. 60 cpv. 2 ⟨ergänzt 09.11.2026, Fachprüfung⟩

> «formula all’attenzione del Cantone un preavviso, di principio vincolante, relativamente alle prestazioni di cui agli art. 18 e 20.» — [1], Art. 52 lett. f ⟨ergänzt 09.11.2026, Fachprüfung⟩

> Asylbereich: «Il Consiglio di Stato disciplina la determinazione, la concessione, la limitazione e la procedura delle prestazioni assistenziali concesse a a)richiedenti l’asilo e b)persone bisognose di protezione non titolari di un permesso di dimora.» — [1], Art. 6 cpv. 1 ⟨ergänzt 09.11.2026⟩

> «Dopo aver ricevuto le informazioni necessarie dal proprio Comune, la domanda per l’ottenimento di prestazioni ordinarie va inoltrata allo sportello previsto dalla legge sull’armonizzazione e il coordinamento delle prestazioni sociali (Laps) e dal relativo regolamento.» — [2], Art. 14

> «Chi vuole richiedere la prestazione assistenziale ordinaria deve presentare una domanda al suo Comune di domicilio» — [5]

> «Presso lo sportello regionale LAPS, previo appuntamento del comune di domicilio, il cittadino può inoltrare la domanda all’ufficio competente» — [6]

### SKOS-Richtlinien
> «La soglia d’intervento per le prestazioni assistenziali, in deroga all’art. 10 Laps, è definita ogni anno, tenuto conto delle direttive emanate dalla Conferenza svizzera delle istituzioni dell’azione sociale.» — [1], Art. 19

> «L’importo delle prestazioni ordinarie e di quelle speciali, stabilito secondo gli art. 18 e 20, può però essere ridotto, tenuto conto delle direttive in merito della Conferenza svizzera delle istituzioni dell’azione sociale.» — [1], Art. 23 cpv. 2

> «Ulteriori raccomandazioni delle Linee guida CSIAS possono essere assunte dall’Ufficio del sostegno sociale e dell’inserimento come linee guida alla sua prassi, nella misura in cui sono compatibili con la Las e il RLas vigenti e con la presente direttiva.» — [4], Ziff. 6

> «L’aiuto immediato viene calcolato secondo le direttive della Conferenza svizzera delle istituzioni dell’azione sociale» — [2], Art. 12 cpv. 2 ⟨ergänzt 09.11.2026, Fachprüfung⟩

Bewertung: dynamische Orientierung («tenuto conto»), Beträge setzt der Kanton jährlich selbst per Direttive.

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** Grundsatz keine Rückerstattung rechtmässig bezogener Leistungen, Ausnahmen: Vorschuss auf Versicherungsleistungen, erheblicher Vermögensanfall, Nachlass; unrechtmässig Bezogenes nach Laps Art. 26. Verjährung: Frist im Gesetz (relativ und absolut). Gesetzliches Grundpfandrecht.
  > «Le prestazioni assistenziali corrisposte a maggiorenni vanno rimborsate: a)quando vengono effettuati dei versamenti a titolo di anticipo su prestazioni assicurative non ancora corrisposte […]; b)in caso di acquisizione di una sostanza rilevante; c)in caso di eredità lasciata dal beneficiario deceduto.» — [1], Art. 33
  > «Le prestazioni indebitamente percepite vanno restituite alle condizioni di cui all’art. 26 Laps.» — [1], Art. 36
  > «Il diritto di rimborso e l’azione di regresso si prescrivono dopo tre anni dal giorno in cui l’Autorità cantonale ha avuto conoscenza dei diritti dello Stato e, in ogni caso, dopo dieci anni dal giorno in cui la prestazione assistenziale è stata corrisposta.» — [1], Art. 42 ⟨ergänzt 09.11.2026, Fachprüfung⟩ (Zusammenfassung: relative und absolute Frist im Gesetz)
  > «A garanzia del rimborso o del regresso compete allo Stato il diritto di ipoteca legale sulla proprietà immobiliare dell’assistito o delle persone obbligate secondo gli art. 33 e seguenti.» — [1], Art. 44
- **Verwandtenunterstützung:** Kanton leistet zuerst unabhängig von der Unterstützungspflicht und macht danach Regress geltend (Dipartimento klagt nach ZGB 329); Grundpfand auch auf Liegenschaften der Verwandten möglich.
  > «Le prestazioni assistenziali sono di regola dovute dallo Stato indipendentemente da qualsiasi obbligo assistenziale di natura civile, in particolare dall’obbligo d’assistenza tra parenti, riservato il diritto di regresso.» — [1], Art. 4 ⟨ergänzt 09.11.2026, Fachprüfung⟩
  > «I parenti obbligati all’assistenza secondo l’art. 328 del Codice civile devono rimborsare allo Stato le prestazioni assistenziali nella misura e alle condizioni alle quali possono esservi tenuti a norma dell’art. 329 del Codice medesimo.» — [1], Art. 38
  > «L’ipoteca a garanzia del regresso verso i parenti dell’assistito tenuti a soccorrerlo per gli obblighi di natura civile loro derivanti dagli art. 328 e seguenti CC, è iscritta, ad istanza dell’Ufficio, fino a concorrenza di due annualità di prestazioni» — [2], Art. 18
- **Aufenthaltsbewilligung:** in den kantonalen Quellen nicht genannt (Las, RLas, Direttive 2026, Opuscolo 2026 durchsucht).
- **Wohnsitzwechsel:** Wohnsitz/Aufenthalt nach ZUG; Wohnsitzwechsel ist meldepflichtig.
  > «Il domicilio e la dimora sono determinati dagli articoli da 4 a 11 della legge federale sulla competenza ad assistere le persone nel bisogno del 24 giugno 1977.» — [1], Art. 10
  > «L’assistito è tenuto a segnalare tempestivamente agli organi dell’assistenza sociale l’eventuale suo cambiamento di domicilio, come pure l’eventuale sua intenzione di soggiorni prolungati fuori del luogo di domicilio.» — [1], Art. 68 cpv. 2
- **Kürzung/Sanktion:** Kürzung, Sistierung, Verweigerung, Aufhebung mit schriftlicher Verfügung und befristeter Dauer — [2], Art. 9a; Minimum: «Le prestazioni assistenziali strettamente indispensabili non possono essere rifiutate, anche se l’interessato sia personalmente colpevole del suo stato.» — [1], Art. 23 cpv. 1

### Offen / nicht gefunden
- Keine kantonale Meldepflicht an das Migrationsamt in den geprüften Texten gefunden (Laps nur Datenabruf «movimento della popolazione»).
- Wortlaut Laps Art. 26 (Rückforderung unrechtmässiger Leistungen) nicht ausgewertet.

### Quellen
1. Legge sull'assistenza sociale dell'8 marzo 1971 (871.100), stato 1° agosto 2026, Raccolta delle leggi TI. https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge/num/392 — abgerufen 09.11.2026, HTTP 200; Gegenprobe `num/99999` → 200 Soft-404 («non è contenuto»), `/atlantis-gibt-es-nicht-4711` → 404
2. Regolamento sull'assistenza sociale del 18 febbraio 2003 (871.110), stato 3 marzo 2023. https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge/num/393 — HTTP 200; Gegenprobe wie [1]
3. Legge sull'armonizzazione e il coordinamento delle prestazioni sociali (870.100), stato 1° agosto 2026. https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge/num/340 — HTTP 200
4. Direttive riguardanti gli importi delle prestazioni assistenziali per il 2026 del 13 dicembre 2025, DSS, BU N. 46. https://www4.ti.ch/fileadmin/DSS/DASF/SdSS/Direttive_importi_assistenziali_2026.pdf — HTTP 200 (PDF)
5. DASF, «Diritto, richiesta e rinnovo della prestazione assistenziale ordinaria». https://www4.ti.ch/dss/dasf/temi/sostegno-sociale/prestazioni-finanziarie-di-sostegno-sociale/prestazioni-assistenziali-assistenza/diritto-richiesta-e-rinnovo-della-prestazione-assistenziale-ordinaria — HTTP 200; Gegenprobe www4.ti.ch `/atlantis-gibt-es-nicht-4711` → 404
6. IAS (DSS), «Elenco degli sportelli LAPS». https://www4.ti.ch/dss/ias/prestazioni-e-contributi/scheda/p/s/dettaglio/armonizzazione-e-coordinamento-prestazioni-sociali/elenco-degli-sportelli-laps/ — HTTP 200
7. DSS, «Sostegno sociale in Ticino — Opuscolo informativo», Versione gennaio 2026. https://www4.ti.ch/fileadmin/DSS/DASF/SdSS/Opuscolo_prestazioni_assistenziali_2026.pdf — HTTP 200 (PDF); dort S. 12: «Di principio, le prestazioni non vanno rimborsate.»
8. Link aus `CANTONAL_LINKS.TI.sozialdienst` (Calcolo e funzionamento …) — HTTP 200, Titel «Calcolo e funzionamento della prestazione assistenziale ordinaria - DASF (DSS)»
9. Indice sistematico Volume 8, Raccolta delle leggi TI (nennt 871.120 RASMA). https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/libro/n/8 — HTTP 200

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** «Zuständig (kurz)» unterschlug die grundsätzlich verbindliche Stellungnahme der Wohnsitzgemeinde.
- **Geändert:** Zuständigkeit korrigiert (Las Art. 52 lett. f, Art. 60 cpv. 2, selbst an [1] geprüft); ergänzt Verjährung Las Art. 42, SKOS RLas Art. 12 cpv. 2, Verwandtenunterstützung Las Art. 4; Zeile Asylbereich (Las Art. 6 cpv. 1). Apostrophe in allen Zitaten auf das Originalzeichen (’) gebracht.
- **Offen:** RASMA (871.120) nicht gelesen; Laps Art. 26 nicht ausgewertet.

---

## VD — Vaud

**Beurteilung:** belegbar
**Zuständig (kurz):** Gemeinden bzw. Gemeindeverbände über Centres sociaux régionaux (CSR) oder CSI entscheiden über den RI; Kanton (Departement, DGCS) definiert, organisiert und beaufsichtigt (LASV Art. 5, 18; RLASV Art. 2)
**Zuständig, Ergänzung ⟨09.11.2026, Fachprüfung⟩:** Entscheidbefugt sind laut LASV Art. 18 al. 1 auch «le CSC, le CSIR et les organes délégataires» (Centre social cantonal, Centre social d'intégration des réfugiés).
**Asylbereich:** eigene Regeln — die LASV gilt nicht für Personen nach der loi sur l'aide aux requérants d'asile et à certaines catégories d'étrangers (LARA), ausser für die Nothilfe (LASV Art. 4 al. 2); für statutarische Flüchtlinge mit RI der CSIR (LASV Art. 5 al. 2; Art. 17 al. 1: «en fonction du nombre de réfugiés statutaires bénéficiaires du RI»)
**Antrag (kurz):** schriftlicher Antrag beim CSR der Wohnregion, von jedem erwachsenen Haushaltsmitglied unterschrieben (RLASV Art. 17); CSR-Suche nach Gemeinde/PLZ auf vd.ch
**SKOS (kurz):** eigene Ansätze mit punktuellen Verweisen — Barème im Reglement (LASV Art. 31 al. 2); Vermögensgrenzen nach CSIAS (LASV Art. 32; RLASV Art. 18); Grundbedarf junger Erwachsener nicht unter dem CSIAS-Forfait (LASV Art. 31 al. 2bis). Keine Generalverweisung gefunden.
**Aufsicht:** Departement (LASV Art. 7 al. 1 lit. a), ausgeübt durch die Direction générale de la cohésion sociale (DGCS, RLASV Art. 2) — https://www.vd.ch/dsas/dgcs
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| LOI du 02.12.2003 sur l'action sociale vaudoise (LASV) | BLV 850.051 | Version in Kraft seit 01.03.2024 (versionType «ACTUELLE») | https://prestations.vd.ch/pub/blv-publication/actes/consolide/850.051 | Web-App 200 (Angular-Hülle); Bestand per API: `api/recueil-systematique?code=8` listet 850.051, `api/actes/CONSOLIDE?id=8b71b9d3-…&cote=850.051` → 200 JSON mit Versionen; Text `api/actes/df192a3f-97d3-42b8-9a56-08eb38902b32/html` → 200. Gegenprobe `api/actes/CONSOLIDE?id=00000000-…&cote=999.999` → 200 `[]`; `api/actes/00000000-…/html` → 500 |
| RÈGLEMENT du 26.10.2005 d'application de la LASV (RLASV) | BLV 850.051.1 | Version in Kraft seit 01.03.2026 | https://prestations.vd.ch/pub/blv-publication/actes/consolide/850.051.1 | API `…CONSOLIDE?id=86dc5911-…&cote=850.051.1` → 200; Text `api/actes/7f7c1773-6e4c-468c-9aa4-9ccff860ed69/html` → 200 |

Hinweis: `api/actes/CONSOLIDE?cote=850.051` ohne `id` → 500; die API braucht die `atelierId` aus dem Recueil.

### Zuständigkeit und Antrag
> «La commune ou l'association de communes confie les tâches d'action sociale à un service communal, respectivement au Centre social régional (ci-après : CSR) ou au Centre social intercommunal (ci-après : CSI).» — [1], Art. 5 al. 3

> «rendre les décisions en matière de RI, à l'exception de celles relatives à l'insertion professionnelle ; la commune de domicile du bénéficiaire est informée de l'octroi et de la suppression du RI» — [1], Art. 18 al. 1 lit. f

> «Le RI est accordé sur demande signée par chaque membre majeur du ménage (conjoint, partenaire enregistré, personne menant de fait une vie de couple) ou son représentant légal.» — [2], Art. 17 al. 1

> «Pour demander le revenu d'insertion, vous devez prendre contact avec le Centre social régional (CSR) de votre région.» — [3]

### SKOS-Richtlinien
> «La prestation financière est accordée dans les limites d'un barème établi par le règlement, après déduction des ressources du requérant […]» — [1], Art. 31 al. 2

> «La prestation financière est versée selon les conditions de ressources prévues par la CSIAS.» — [1], Art. 32 al. 1

> «Le montant forfaitaire pour l'entretien ne peut toutefois être inférieur au forfait pour l'entretien recommandé par la Conférence suisse des institutions d'action sociale (CSIAS).» — [1], Art. 31 al. 2bis (junge Erwachsene)

> «[…] des actifs n'excédant pas les limites de fortune prévues par la Conférence suisse des institutions d'action sociale (CSIAS) […]» — [2], Art. 18 al. 1 (nennt die Grenzen als Frankenbeträge)

Bewertung: «SKOS gilt in VD nicht» ist so zu pauschal. Belegt ist: eigener kantonaler Barème, SKOS nur für Vermögensgrenzen (dort im Reglement als feste Beträge, also statisch) und als Untergrenze beim Forfait junger Erwachsener.

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** ab Volljährigkeit bei unrechtmässigem Bezug (gutgläubig nur, wenn keine Notlage entsteht), bei Bevorschussung bis zur Verwertung von Vermögen, bei Vermögensanfall, bei rückwirkenden Versicherungsleistungen; Erben bis zur Höhe des Nachlasses; Verjährung: Frist im Gesetz (für Erben kürzere Frist).
  > «La personne qui, dès la majorité, a obtenu des prestations du RI, y compris les frais particuliers ou aides exceptionnelles, est tenue au remboursement : a. lorsqu'elle les a obtenues indûment ; le bénéficiaire de bonne foi n'est tenu à restitution, totale ou partielle, que dans la mesure où il n'est pas mis de ce fait dans une situation difficile ; b. lorsqu'elle a obtenu une aide lui permettant de subvenir à ses besoins dans l'attente de la réalisation de ses biens ; c. lorsqu'elle entre en possession d'une fortune mobilière ou immobilière ;» — [1], Art. 41 al. 1
  > «Les héritiers sont tenus au remboursement de l'aide touchée par le bénéficiaire défunt pour autant qu'ils tirent profit de la succession et jusqu'à concurrence de celui-ci.» — [1], Art. 42
  > «La décision entrée en force est assimilée à un jugement exécutoire au sens de l'article 80 de la loi fédérale sur la poursuite pour dettes et la faillite» — [1], Art. 43 al. 2
  > «L'autorité compétente peut compenser les montants indûment perçus avec les prestations futures» — [1], Art. 43a al. 1 ⟨ergänzt 09.11.2026, Fachprüfung⟩ (Verrechnung mit laufendem RI; Prozentsätze im Erlass, Existenzminimum geschützt)
- ~~**Verwandtenunterstützung:** Kanton tritt in die Rechte ein (Subrogation); beim Antrag sind ggf. Angaben zur finanziellen Lage nicht im Haushalt lebender Eltern beizulegen; bei jungen Erwachsenen trifft die Behörde die Eltern zur Vereinbarung einer Beteiligung.~~ ⟨korrigiert 09.11.2026, Fachprüfung: vermischte elterliche Unterhaltspflicht (ZGB 276 ff.) und Verwandtenunterstützung (ZGB 328)⟩
- **Verwandtenunterstützung (ZGB 328/329):** nur Subrogation des Staates belegt; eine aktive Geltendmachung gegenüber Verwandten ist in LASV/RLASV nicht belegt.
  > «L'Etat est subrogé aux droits des bénéficiaires créanciers de contributions au titre de l'obligation d'entretien ou de la dette alimentaire.» — [1], Art. 46 al. 3
- **Elterliche Unterhaltspflicht (ZGB 276 ff.):** beim Antrag ggf. Angaben zur finanziellen Lage nicht im Haushalt lebender Eltern; bei jungen Erwachsenen trifft die Behörde die Eltern zur Vereinbarung einer Beteiligung.
  > «des éléments concernant la situation financière des parents ne vivant pas dans le ménage qui pourraient être tenus à une contribution d'entretien selon le droit civil» — [2], Art. 17 al. 2
  > «En parallèle, l'autorité d'application rencontre les parents afin de les informer et de définir avec eux leur possible participation matérielle ou financière.» — [1], Art. 31a al. 2
- **Aufenthaltsbewilligung:** Folgen für die Bewilligung in den kantonalen Quellen nicht genannt. Belegt ist nur ein Datenzugang des Service de la population:
  > «Elle fournit également, par le même moyen, au Service de la population et aux curateurs professionnels concernés, les renseignements qui leur sont nécessaires pour exécuter leurs missions.» — [1], Art. 39b al. 3
  Zudem gilt das Gesetz nur für Personen mit gültigem oder in Erneuerung befindlichem Aufenthaltstitel ([2], Art. 1 al. 2).
- **Wohnsitzwechsel:** Geltung für «personnes domiciliées ou en séjour dans le canton» ([1], Art. 4 al. 1); zuständig ist der CSR der Wohnregion ([4]). Eine ausdrückliche ZUG-Regel im LASV-Text nicht gefunden.
- **Mitwirkung/Meldepflicht:** «Elle signale sans retard tout changement de sa situation pouvant entraîner la réduction ou la suppression de ladite prestation.» — [1], Art. 38 al. 4
- **Kürzung/Sanktion:** «La violation par le bénéficiaire des obligations liées à l'octroi des prestations financières, intentionnelle ou par négligence, peut donner lieu à une réduction, voire à la suppression de l'aide.» — [1], Art. 45 al. 1; Sanktionen sofort vollstreckbar, Rekurs ohne aufschiebende Wirkung ([1], Art. 45a).

### Offen / nicht gefunden
- Kein ausdrücklicher ZUG-Verweis im LASV-Text gefunden (nur «domiciliées ou en séjour»).
- Kantonale Richtlinien (Normes RI) der DGCS nicht erhoben.

### Quellen
1. LOI du 02.12.2003 sur l'action sociale vaudoise (LASV), BLV 850.051, Version in Kraft seit 01.03.2024. https://prestations.vd.ch/pub/blv-publication/actes/consolide/850.051 (Text über `…/api/actes/df192a3f-97d3-42b8-9a56-08eb38902b32/html`) — abgerufen 09.11.2026, HTTP 200; Gegenprobe `api/actes/CONSOLIDE?id=00000000-0000-0000-0000-000000000000&cote=999.999` → 200 `[]`, `api/actes/00000000-…/html` → 500
2. RÈGLEMENT du 26.10.2005 d'application de la LASV (RLASV), BLV 850.051.1, Version in Kraft seit 01.03.2026. Text `…/api/actes/7f7c1773-6e4c-468c-9aa4-9ccff860ed69/html` — HTTP 200
3. État de Vaud, «Revenu d'insertion (RI)». https://www.vd.ch/aides-financieres-et-soutien-social/aides-financieres-et-comment-les-demander/revenu-dinsertion-ri — HTTP 200 (= `CANTONAL_LINKS.VD.sozialdienst`); Gegenprobe vd.ch `/atlantis-gibt-es-nicht-4711` → 404
4. État de Vaud, «Trouver un Centre social régional (CSR)». https://www.vd.ch/aides-financieres-et-soutien-social/trouver-un-centre-social-regional-csr — HTTP 200
5. État de Vaud, «Direction générale de la cohésion sociale (DGCS)». https://www.vd.ch/dsas/dgcs — HTTP 200

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** Verwandtenunterstützung vermischte elterliche Unterhaltspflicht (ZGB 276 ff.) mit ZGB 328.
- **Geändert:** in zwei Punkte getrennt, alter Text gestrichen; ZGB 328 nur Subrogation (Art. 46 al. 3), aktive Geltendmachung «nicht belegt»; ergänzt Verrechnung LASV Art. 43a, weitere Entscheidinstanzen (CSC, CSIR) nach Art. 18 al. 1; Zeile Asylbereich (Art. 4 al. 2). Alle neuen Zitate selbst am BLV-Text geprüft.
- **Offen:** keine Generalverweisung auf ZUG im LASV-Text gefunden; DGCS-Richtlinien (Normes RI) nicht erhoben.

---

## VS — Valais / Wallis

**Beurteilung:** belegbar
**Zuständig (kurz):** Wohnsitzgemeinde ist Sozialhilfebehörde und entscheidet; die regionalen Centres médico-sociaux (CMS / SMZ) instruieren das Dossier (LIAS Art. 4 al. 7, 7, 8, 16)
**Asylbereich:** eigene Regeln — OLIAS Art. 46 al. 1 nimmt Personen «ressortant du domaine de l’asile» von den Ausländerregeln aus; für anerkannte Flüchtlinge (B) und vorläufig aufgenommene Flüchtlinge (F) gibt es eine eigene Weisung des SAS (auf [4] verlinkt, nicht gelesen)
**Antrag (kurz):** mündlich oder schriftlich bei der Gemeinde oder beim CMS (LIAS Art. 45); Verzeichnis/Karte der CMS beim Groupement valaisan des CMS (cms-smz.ch)
**SKOS (kurz):** subsidiär — Normen setzt der Staatsrat «en tenant compte des recommandations» der CSIAS (LIAS Art. 28 al. 5); Anspruch richtet sich nach LIAS, OLIAS, Departementsweisung «et subsidiairement» nach den CSIAS-Normen (OLIAS Art. 43 al. 2)
**Aufsicht:** Departement für Gesundheit, Soziales und Kultur (LIAS Art. 11 al. 1 lit. a), Dienststelle für Sozialwesen (SAS/DSW) — https://www.vs.ch/de/web/sas
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Gesetz über die Eingliederung und die Sozialhilfe (GES) / Loi sur l'intégration et l'aide sociale (LIAS) | 850.1 | «vom 10.09.2020, in Kraft seit: 01.07.2021»; «Aktuelle Version in Kraft seit: 01.01.2022» | https://lex.vs.ch/app/de/texts_of_law/850.1 | API `https://lex.vs.ch/api/de/texts_of_law/850.1` → 200 JSON (de und fr); Gegenprobe `api/de/texts_of_law/999.999` → 404; `/atlantis-gibt-es-nicht-4711` → 404 |
| Verordnung über die Eingliederung und die Sozialhilfe (VES) / Ordonnance … (OLIAS) | 850.100 | «vom 21.04.2021, in Kraft seit: 01.07.2021»; «Aktuelle Version in Kraft seit: 01.10.2024» | https://lex.vs.ch/app/de/texts_of_law/850.100 | API → 200; Gegenprobe wie oben |
| Directive d'application de la LIAS (dès le 01.01.2026), Departement | — | «DU 1ER JANVIER 2026» | Download über https://www.vs.ch/fr/web/sas/aide-sociale | 200 application/pdf, 133 S. |

### Zuständigkeit und Antrag
> «L'autorité d'aide sociale est la commune compétente pour octroyer l'aide sociale.» — [1], Art. 4 al. 7

> «La compétence d'octroyer l'aide sociale incombe à la commune de domicile.» — [1], Art. 16 al. 1

> «instruisent les dossiers d'aide sociale, procèdent aux vérifications liées au calcul du droit à des prestations, puis transmettent les dossiers et budgets pour décision à l'autorité compétente» — [1], Art. 8 al. 1 lit. d (CMS)

> «La personne qui sollicite des prestations d’aide matérielle doit s'annoncer, verbalement ou par écrit, soit à l'autorité d'aide sociale, soit au centre médico-social.» — [1], Art. 45 al. 1

### SKOS-Richtlinien
> «Les normes pour la détermination de l’aide matérielle ainsi que les modalités d'octroi sont fixées par le Conseil d'Etat, en tenant compte des recommandations de la Conférence suisse des institutions d'action sociale (CSIAS).» — [1], Art. 28 al. 5

> «La détermination du droit à l’aide matérielle se base sur la LIAS, la présente ordonnance, les directives du département et subsidiairement, sur les normes de la Conférence suisse des institutions d’action sociale (CSIAS).» — [2], Art. 43 al. 2

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** bei unrechtmässigem Bezug, bei Anfall eines bedeutenden Vermögens, bei Vorschüssen, Darlehen, bei Wiederaufnahme einer Erwerbstätigkeit mit sehr günstigen Verhältnissen und aus Billigkeit; Haushaltsmitglieder haften solidarisch; Erben bis zum Nachlasswert, auch Vermächtnisnehmer/Lebensversicherung. Verjährung: Frist im Gesetz (längere Frist bei Vermögensanfall; mit Grundpfand unverjährbar).
  > «La personne qui a obtenu des prestations d'aide matérielle est tenue de les rembourser: a) lorsque les prestations ont été obtenues indûment; b) lorsque la personne entre en possession d'une fortune importante; c) lorsque les prestations ont été versées à titre d'avance sur des prestations à venir; […] f) lors de la reprise d'une activité lucrative, si cela conduit à des conditions si favorables qu'une renonciation au remboursement semblerait inéquitable; g) dans d'autres cas, lorsque l'équité l'exige.» — [1], Art. 52 al. 1
  > «Tous les membres de l’unité d’assistance ayant bénéficié de prestations de l’aide matérielle sont solidairement responsables du remboursement de ces montants.» — [1], Art. 52 al. 2
  Ausnahmen ⟨ergänzt 09.11.2026, Fachprüfung⟩: keine Rückerstattung aus den Gründen lit. b, f, g für Minderjährige und für junge Erwachsene während der Erstausbildung (al. 3); bei Vermögensanfall (lit. b) auch nicht für junge Erwachsene für Hilfe an ihre Eltern, für Konkubinatspartner und für getrennte Elternteile mit alleiniger Obhut (al. 4); jeweils vorbehältlich Art. 57 (Erben).
  > «N'est pas tenu au remboursement pour les raisons mentionnées à l'alinéa 1 lettres b, f et g, sous réserve de l’article 57: a) le mineur pour l'aide allouée avant sa majorité; b) le jeune adulte de moins de 25 ans révolus pour l'aide allouée pendant sa formation de base.» — [1], Art. 52 al. 3
  > «Conformément à l’article 807 du Code civil, l’inscription d’un gage immobilier rend la créance en remboursement de la dette d’assistance imprescriptible.» — [1], Art. 53
- **Verwandtenunterstützung:** Sozialhilfe ist subsidiär zu ZGB 328 f.; die Behörde zahlt trotzdem und macht die Beiträge danach geltend (Vereinbarung bevorzugt).
  > «L'aide matérielle est subsidiaire à l'obligation d'entretien (art. 276ss CC) et à la dette alimentaire (art. 328s CC).» — [1], Art. 31 al. 1
  > «L’autorité d’aide sociale doit ensuite, cas échéant, faire valoir ces contributions en vertu des subrogations prévues dans le Code civil suisse (CC).» — [1], Art. 31 al. 3
- **Aufenthaltsbewilligung:** kantonal genannt. Datenweitergabe an Ausländerbehörden nach LEI 97 im Gesetz; die Weisung sagt, dass der SAS dem SPM jede neue Dossiereröffnung meldet und die CMS über die Folgen informieren.
  > «aux autorités compétentes en matière d’étrangers, conformément à l’article 97 de la loi fédérale sur les étrangers et l’intégration (LEI)» — [1], Art. 63 al. 2 lit. k
  > «Le SAS transmet au SPM les noms des personnes concernées par l’art. 82b OASA lors de l’ouverture de chaque nouveau dossier.» — [3], S. 20
  > «Les CMS informent les titulaires d’un permis de séjour ou d’établissement de cette obligation légale et des conséquences que cela peut avoir sur l’octroi ou la révocation de leur permis de séjour.» — [3], ~~S. 20~~ S. 21 ⟨korrigiert 09.11.2026, Fachprüfung⟩
  Einordnung ⟨ergänzt 09.11.2026, Fachprüfung⟩: Meldepflicht und Widerruf sind **Bundesrecht** (LEI 97 al. 3 let. d, OASA 82b, LEI 62/63); die Weisung beschreibt den kantonalen Vollzug: «En vertu de l’art. 97 al. 3 let. d LEI (loi fédérale sur les étrangers et l’intégration, anciennement loi fédérale sur les étrangers (LEtr)) et de l’art. 82b OASA» — [3], S. 20
  ~~Zudem: Personen ohne gültige Aufenthaltsbewilligung haben grundsätzlich keinen Anspruch auf ordentliche oder reduzierte Hilfe ([2], Art. 46 al. 2).~~ ⟨korrigiert 09.11.2026, Fachprüfung: Absatz 3, nicht 2⟩
  > «Les étrangers non titulaires d’une autorisation de séjour valable doivent en principe quitter le territoire cantonal et n’ont pas le droit à une aide ordinaire ou réduite.» — [2], Art. 46 al. 3
  > «Les détenteurs d’une autorisation de courte durée (permis L) et les personnes dont ils ont la charge et faisant ménage commun ont droit à une aide ordinaire, s’ils exercent une activité lucrative sur le premier marché du travail ou s’ils remplissent d’autres conditions précisées dans une directive du département. A défaut, seule l'aide d'urgence stricte est allouée.» — [2], Art. 46 al. 2
- **Wohnsitzwechsel:** Unterstützungswohnsitz nach ZUG; Verbot, jemanden zum Wegzug zu drängen, mit Sanktion (alter Wohnsitz bleibt zuständig, Höchstdauer im Gesetz).
  > «Le domicile d'assistance (ci-après: domicile) dans le canton se détermine conformément à la loi fédérale en matière d'assistance.» — [1], Art. 14
  > «En cas d'inobservation de l'alinéa 3, le domicile demeure à l'ancien lieu de domicile pour tout le temps où l'intéressé y serait probablement resté s'il n'avait été influencé par l'autorité, mais pour une durée de cinq ans au plus.» — [1], Art. 17 al. 4
- **Mitwirkung, Abtretung, Hausbesuch:** Pflicht, eine Abtretung zu unterzeichnen, und Zutritt zu Wohnung/Fahrzeug/Arbeitsplatz zu gewähren ([1], Art. 33); Abtretung als Bedingung für Vorschüsse — «Si le bénéficiaire s’oppose à la signature de ce document, l’aide peut lui être refusée.» — [1], Art. 56
- ~~**Grundpfand:** «l'autorité d'aide sociale peut conditionner le versement de prestations à l'inscription en sa faveur d'une hypothèque au sens de l'article 824 du Code civil suisse ou à une autre garantie.» — [1], Art. 55~~ ⟨korrigiert 09.11.2026, Fachprüfung: zu allgemein⟩
- **Grundpfand:** nur zur Sicherung von Vorschüssen an Eigentümer von Liegenschaften (Art. 55 al. 2–3):
  > «Afin d'assurer le remboursement des avances octroyées, l'autorité d'aide sociale peut conditionner le versement de prestations à l’inscription en sa faveur d’une hypothèque au sens de l’article 824 du Code civil suisse ou à une autre garantie.» — [1], Art. 55 al. 3
- **Sanktion:** «La sanction consiste en une réduction du forfait d'entretien.» — [1], Art. 38 al. 2; Anhörung vorher ([1], Art. 39); Sanktionskatalog als Anhang 4 der Weisung.
- **Vermögensverzicht:** hypothetisches Einkommen, reduzierte Hilfe, Rückerstattungspflicht der Empfänger ([1], Art. 32).

### Offen / nicht gefunden
- Sanktionskatalog (Anhang 4) nicht ausgewertet.
- Das Groupement valaisan des CMS (cms-smz.ch) ist die in LIAS Art. 9 vorgesehene Dachorganisation, aber keine kantonale Amtsseite — als Verzeichnis brauchbar, als Rechtsbeleg nicht.

### Quellen
1. Loi sur l'intégration et l'aide sociale (LIAS) / Gesetz über die Eingliederung und die Sozialhilfe (GES), 850.1, Version in Kraft seit 01.01.2022. https://lex.vs.ch/api/fr/texts_of_law/850.1 und https://lex.vs.ch/api/de/texts_of_law/850.1 (kanonisch https://lex.vs.ch/app/de/texts_of_law/850.1) — abgerufen 09.11.2026, HTTP 200; Gegenprobe `api/de/texts_of_law/999.999` → 404, `/atlantis-gibt-es-nicht-4711` → 404
2. Ordonnance sur l'intégration et l'aide sociale (OLIAS) / VES, 850.100, Version in Kraft seit 01.10.2024. https://lex.vs.ch/api/fr/texts_of_law/850.100 — HTTP 200; Gegenprobe wie [1]
3. Département de la santé, des affaires sociales et de la culture, «Directive d'application de la Loi sur l'intégration et l'aide sociale», du 1er janvier 2026. https://www.vs.ch/documents/25959312/25960845/Directive+d%E2%80%99application+de+la+Loi+sur+l%E2%80%99int%C3%A9gration+et+l%E2%80%99aide+sociale+%28d%C3%A8s+le+01.01.2026%29.pdf/8fa062a2-5886-8e45-8d4c-673ab14606ba?t=1765380300818&v=1.0 — HTTP 200 (PDF)
4. Kanton Wallis, Dienststelle für Sozialwesen, «Sozialhilfe». https://www.vs.ch/de/web/sas/aide-sociale (fr: https://www.vs.ch/fr/web/sas/aide-sociale) — HTTP 200; Gegenprobe vs.ch `/atlantis-gibt-es-nicht-4711` → 404
5. Dienststelle für Sozialwesen (Startseite). https://www.vs.ch/de/web/sas — HTTP 200, Titel «Dienststelle für Sozialwesen - - vs.ch» (= `CANTONAL_LINKS.VS.sozialdienst`)
6. Groupement valaisan des centres médico-sociaux. https://www.cms-smz.ch/ — HTTP 200; Gegenprobe `/atlantis-gibt-es-nicht-4711` → 404

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** OLIAS Art. 46 falscher Absatz (2 statt 3); Seitenangabe der Weisung (S. 20 statt 21); Grundpfand zu allgemein dargestellt; Apostrophe geglättet.
- **Geändert:** Absatz korrigiert und al. 2 (Bewilligung L) ergänzt; Seite korrigiert (am PDF-Seitenumbruch geprüft); Einordnung als Bundesrecht mit Vollzug durch die Weisung; Ausnahmen LIAS Art. 52 al. 3–4; Grundpfand auf Art. 55 al. 3 eingeschränkt; Zeile Asylbereich. Alte Aussagen gestrichen stehen gelassen.
- **Offen:** Weisung für Flüchtlinge B/F und Sanktionskatalog (Anhang 4) nicht gelesen.

---

## NE — Neuchâtel

**Beurteilung:** belegbar
**Zuständig (kurz):** Wohnsitzgemeinde (Unterstützungswohnsitz nach ZUG); Gemeinden über regionale Sozialdienste, bei Zusammenschluss per Vertrag ist die regionale Sozialkommission die Sozialhilfebehörde; Kanton für Personen ohne Unterstützungswohnsitz (LASoc Art. 13–15b, 20, 21)
**Asylbereich:** eigene Normen — «Arrêté fixant les normes pour le calcul de l'aide matérielle versée aux requérant-e-s d'asile, aux personnes admises provisoirement et aux personnes bénéficiaires d’une protection provisoire», RSN 831.03, Etat au 1er mars 2026 (https://rsn.ne.ch/DATA/program/books/rsne/htm/831.03.htm, HTTP 200; nur Titel/Kopf gelesen)
**Antrag (kurz):** mündlich oder schriftlich bei der zuständigen Behörde (LASoc Art. 30); Eingang über die Guichets sociaux régionaux (GSR), Verzeichnis auf ne.ch
**SKOS (kurz):** subsidiär — eigene Normen des Staatsrats (ANCAM), die CSIAS-Normen «font référence pour le surplus» (ANCAM Art. 24); für Verwandtenunterstützung Einkommensgrenzen nach CSIAS (ANCAM Art. 20)
**Aufsicht:** Departement (LASoc Art. 8), Service cantonal de l'action sociale (SASO) — https://www.ne.ch/autorites/decs/saso
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Loi sur l'action sociale (LASoc), du 25 juin 1996 | RSN 831.0 | «Etat au 1er janvier 2026» | https://rsn.ne.ch/DATA/program/books/rsne/htm/831.0.htm | 200 HTML; PDF `…/pdf/8310.pdf` → 200 (19 S.). Gegenprobe `…/htm/999.999.htm` → 404, `…/pdf/999999.pdf` → 404, `/atlantis-gibt-es-nicht-4711` → 404 |
| Règlement d'exécution de la loi sur l'action sociale (RELASoc), du 27 novembre 1996 | RSN 831.01 | «Etat au 27 mai 2025» | https://rsn.ne.ch/DATA/program/books/rsne/htm/831.01.htm | 200; Gegenprobe wie oben |
| Arrêté fixant les normes pour le calcul de l'aide matérielle (ANCAM), du 4 novembre 1998 | RSN 831.02 | «Etat au 1er avril 2026» | https://rsn.ne.ch/DATA/program/books/rsne/htm/831.02.htm | 200; Gegenprobe wie oben |

Hinweis: `https://rsn.ne.ch/api/fr/texts_of_law/831.0` und `…/htm/8310.htm` → 404 — RSN ist keine LexWork-App; richtige Form `htm/831.0.htm`.

### Zuständigkeit und Antrag
> «L'aide sociale aux personnes dans le besoin, domiciliées dans le canton, incombe à la commune de domicile.» — [1], Art. 20 al. 1

> «L'aide sociale aux personnes dans le besoin qui n'ont pas de domicile d'assistance et qui se trouvent dans le canton incombe à l'Etat.» — [1], Art. 21

> «La commission est l'autorité d'aide sociale pour le compte et au nom des communes regroupées.» — [1], Art. 15b al. 1

> «Toute personne qui sollicite une aide sociale s'adresse verbalement ou par écrit à l'autorité compétente au sens des articles 20 à 22.» — [1], Art. 30

> «Dans le canton de Neuchâtel, les Guichets Sociaux Régionaux (GSR) sont votre point d'entrée unique pour demander les prestations suivantes» (u. a. «Aide sociale») — [4]

### SKOS-Richtlinien
> «Le Conseil d'Etat arrête les normes pour le calcul de l'aide matérielle.» — [1], Art. 38

> «Les concepts et normes pour le calcul de l'aide sociale de la Conférence suisse des institutions d'action sociale font référence pour le surplus.» — [3], Art. 24

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** nur bei unrechtmässigem Bezug, bei Erbschaft/Schenkung/Lotteriegewinn/ausserordentlichem Einkommen, aus Billigkeit oder bei Verpflichtung beim Bezug; Vorschüsse; Ehegatten/Konkubinatspartner solidarisch; Erben soweit bereichert. Verjährung: Frist im Gesetz (relativ und absolut).
  > «L'aide matérielle fournie aux personnes majeures n'est remboursable que dans l’une des situations suivantes: a) lorsque l'aide a été obtenue indûment; b) lorsque le bénéficiaire, par suite d'un héritage, d'un don, d'un gain de loterie ou d'autres revenus extraordinaires ne provenant pas de son travail, peut s'acquitter de tout ou partie de sa dette; c) lorsque l'équité l'exige, dans d'autres circonstances ou pour d'autres motifs.» — [1], Art. 43 al. 1
  > «Les héritiers doivent rembourser l'aide matérielle dont a bénéficié le défunt dans la mesure où ils tirent profit de la succession.» — [1], Art. 47
  > «Les conjoints, les concubins stables et les partenaires enregistrés sont solidairement responsables du remboursement de la dette contractée durant la vie commune.» — [1], Art. 45 al. 1
- **Verwandtenunterstützung:** Pflicht zur Beteiligung; Betrag einvernehmlich, sonst entscheidet die KESB; Grenze nach CSIAS-Normen.
  > «Les personnes tenues de fournir des aliments conformément aux articles 328 et 329 du code civil suisse (CCS), ainsi que les parents tenus à l'obligation d'entretien selon les articles 276 ss CCS, doivent participer à la prise en charge de l'aide matérielle accordée au bénéficiaire.» — [1], Art. 51 al. 1
  > «Une contribution alimentaire en vertu des articles 328 et 329 CC est demandée aux parents ascendants ou descendants du bénéficiaire, lorsque ceux-ci disposent de revenus et de fortune qui dépassent les montants admis par les concepts et normes pour le calcul de l'aide sociale de la Conférence suisse des institutions d'action sociale.» — [3], Art. 20 al. 1
- **Aufenthaltsbewilligung:** Folgen nicht genannt. Belegt ist ein Online-Zugang der Ausländerbehörde zur zentralen Sozialdatenbank:
  > «Peuvent avoir accès en ligne: […] c) le service en charge de l’application de la législation fédérale et cantonale sur le séjour et l'établissement des étrangers.» — [1], Art. 69b al. 3
- **Wohnsitzwechsel:** Unterstützungswohnsitz nach ZUG ([1], Art. 20 al. 2); Wohnsitz- und Aufenthaltswechsel meldepflichtig:
  > «Il doit également signaler tout changement de lieu de séjour ou de domicile.» — [1], Art. 42 al. 2
- **Kürzung:** Minimum gesichert («Une aide matérielle minimum ne peut être refusée à une personne dans le besoin, même si celle-ci est personnellement responsable de son état.» — [1], Art. 39); Kürzung des Forfaits nach ANCAM Art. 4 (Prozentsätze im Erlass); Anhörung vor Kürzung ([1], Art. 35).

### Offen / nicht gefunden
- RELASoc nur auf Stichworte durchsucht, nicht vollständig ausgewertet.
- Die Seite `ne.ch/autorites/decs/saso` nennt im Fuss das «Département de l’économie et de la cohésion sociale»; die Präambel der ANCAM nennt noch das «Département des finances et des affaires sociales» (historisch). Departementsname daher an der Amtsseite prüfen.

### Quellen
1. Loi sur l'action sociale (LASoc), RSN 831.0, Etat au 1er janvier 2026. https://rsn.ne.ch/DATA/program/books/rsne/htm/831.0.htm (PDF https://rsn.ne.ch/DATA/program/books/rsne/pdf/8310.pdf) — abgerufen 09.11.2026, HTTP 200; Gegenprobe `htm/999.999.htm` → 404, `/atlantis-gibt-es-nicht-4711` → 404
2. Règlement d'exécution de la loi sur l'action sociale (RELASoc), RSN 831.01, Etat au 27 mai 2025. https://rsn.ne.ch/DATA/program/books/rsne/htm/831.01.htm — HTTP 200
3. Arrêté fixant les normes pour le calcul de l'aide matérielle (ANCAM), RSN 831.02, Etat au 1er avril 2026. https://rsn.ne.ch/DATA/program/books/rsne/htm/831.02.htm — HTTP 200
4. République et Canton de Neuchâtel, «Guichets Sociaux Régionaux». https://www.ne.ch/themes/social/guichets-sociaux-regionaux — HTTP 200; Gegenprobe ne.ch `/atlantis-gibt-es-nicht-4711` → 404
5. «Service cantonal de l'action sociale». https://www.ne.ch/autorites/decs/saso — HTTP 200 (= `CANTONAL_LINKS.NE.sozialdienst`)

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** nur typografische Apostrophe geglättet (z. B. «l'une» statt «l’une»).
- **Geändert:** alle Zitate maschinell gegen den RSN-Text abgeglichen und auf die Originalzeichen gebracht; Zeile Asylbereich (RSN 831.03).
- **Offen:** RELASoc und 831.03 nicht vollständig ausgewertet; Departementsname (s. o.).

---

## GE — Genève

**Beurteilung:** belegbar
**Zuständig (kurz):** Hospice général als Vollzugsorgan unter Aufsicht des zuständigen Departements; für Personen im AHV-Alter/IV-Rente in Heimen der Service des prestations complémentaires (LASLP Art. 4)
**Antrag (kurz):** schriftlicher Antrag beim Hospice général (LASLP Art. 43); praktisch beim Centre d'action sociale (CAS) der Wohnadresse, Adressverzeichnis beim Hospice
**SKOS (kurz):** ~~teilweise, dynamisch für Grundbedarf — Forfait für den Lebensunterhalt «conformément aux normes» der CSIAS, Indexierung nach CSIAS-Entwicklung (LASLP Art. 31 al. 2 lit. a, al. 3); übrige Elemente eigene kantonale Regeln~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ teilweise — kantonaler Forfait mit festem Betrag im RASLP (Art. 5 al. 1), gesetzlich an die CSIAS-Normen und deren Entwicklung gebunden (LASLP Art. 31 al. 2 lit. a und al. 3: Auftrag an den Staatsrat, kein direkter Verweis); übrige Elemente eigene kantonale Regeln
**Asylbereich:** eigene Regeln — Asylsuchende und Gleichgestellte nach den Ausführungsbestimmungen zum AsylG (LASLP Art. 26 al. 1), mit Ausnahmen für vorläufig Aufgenommene (al. 2)
**Aufsicht:** Département chargé de l'action sociale (LASLP Art. 4 al. 1) — Département de la cohésion sociale (DCS), Office de l'action, de l'insertion et de l'intégration sociales: https://www.ge.ch/organisation/office-action-insertion-integration-sociales
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Loi sur l'aide sociale et la lutte contre la précarité (LASLP), du 23 juin 2023 | rsGE J 4 04 | «Entrée en vigueur : 1er janvier 2025» | https://silgeneve.ch/legis/data/rsg_j4_04.htm | 200; Gegenprobe `rsg_x9_99.htm` → 404, `/atlantis-gibt-es-nicht-4711` → 404 |
| Règlement d'application de la LASLP (RASLP), du 17 avril 2024 | rsGE J 4 04.01 | «Dernières modifications au 1er mars 2026» | https://silgeneve.ch/legis/data/rsg_j4_04p01.htm | 200; Gegenprobe wie oben |

**Wichtig:** Die LIASI (loi sur l'insertion et l'aide sociale individuelle, du 22 mars 2007) ist aufgehoben:
> «La loi sur l'insertion et l'aide sociale individuelle, du 22 mars 2007, est abrogée» — [1], Art. 79
Unter J 4 04 steht heute die LASLP. Wer «LIASI» zitiert, zitiert altes Recht.

### Zuständigkeit und Antrag
> «L'Hospice général est l'organe d'exécution de la présente loi sous la surveillance du département chargé de l'action sociale (ci-après : département).» — [1], Art. 4 al. 1

> «Les prestations d'aide financière prévues par la présente loi font l'objet d'une demande déposée par écrit par la personne intéressée ou son représentant légal auprès de l'Hospice général.» — [1], Art. 43

> «Pour faire une demande, vous devez vous adresser au Centre d’action sociale (CAS) de votre quartier ou de votre commune.» — [3]

### SKOS-Richtlinien
> «un forfait pour l'entretien fixé par règlement du Conseil d'Etat, conformément aux normes de la Conférence suisse des institutions d'action sociale» — [1], Art. 31 al. 2 lit. a

> «Le Conseil d'Etat indexe les prestations d'aide financière selon l'évolution des normes de la Conférence suisse des institutions d'action sociale.» — [1], Art. 31 al. 3

Im RASLP keine Erwähnung der CSIAS gefunden. Der Betrag steht fest im Reglement ⟨ergänzt 09.11.2026, Fachprüfung⟩:
> «Le montant mensuel du forfait pour l'entretien au sens de l'article 31, alinéa 2, lettre a, de la loi s'élève à» [Betrag im Erlass] — [2], Art. 5 al. 1

> «L'aide financière accordée aux personnes requérantes d'asile ou relevant de statuts assimilés, attribuées au canton de Genève en application de la législation fédérale sur l'asile, est régie par les dispositions d'application de la loi fédérale sur l'asile, du 26 juin 1998.» — [1], Art. 26 al. 1 (Asylbereich)

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** Grundsatz: nicht rückzahlbar, mit gesetzlichen Ausnahmen (unrechtmässiger Bezug, Vorschüsse, Erbe/Kapital/Güterrecht, Liegenschaftsbesitz, Vermögensverzicht, bedeutendes Vermögen, Schenkung, Lotteriegewinn, Billigkeit; Erben bis zum Nettonachlass). Verjährung: Frist im Gesetz (relativ und absolut).
  > «Ces prestations ne sont pas remboursables, sous réserve des articles 29, 48 et 50 à 54 de la présente loi.» — [1], Art. 21 al. 2
  > «Il en est de même lorsqu'une personne qui a perçu des prestations d'aide financière est entrée en possession d'une fortune importante, a reçu un don, réalisé un gain de loterie ou d'autres revenus extraordinaires ne provenant pas de son travail, ou encore lorsque l'équité l'exige pour d'autres raisons.» — [1], Art. 53 al. 2
  > «Lorsqu'une personne décède alors qu'elle est au bénéfice des prestations d'aide financière prévues par la présente loi, ses héritières et héritiers doivent rembourser les prestations dont a bénéficié la personne défunte à concurrence de l'actif net recueilli, avant calcul des droits de succession.» — [1], Art. 54 al. 1
  > «Le remboursement des prestations indûment perçues peut être réclamé si la personne qui a reçu les prestations d'aide financière, sans avoir commis de faute ou de négligence, n'est pas de bonne foi.» — [1], Art. 48 al. 3
- **Verwandtenunterstützung:** gesetzliche Subrogation des Hospice; es macht die Rückzahlung beim Schuldner geltend bzw. veranlasst die unterstützte Person zur Klage.
  > «L'Hospice général est légalement subrogé aux droits de la personne créancière : a) de la dette alimentaire instituée par l'article 328 du code civil suisse, du 10 décembre 1907, conformément à son article 329;» — [1], Art. 23 al. 1
  > «l'Hospice général engage la personne qui reçoit ou qui a reçu des prestations d'aide sociale à ouvrir action aux fins de faire valoir l'obligation d'entretien ou la dette alimentaire contre la personne débitrice lorsque la situation financière de celle-ci le permet.» — [1], Art. 23 al. 3
- **Aufenthaltsbewilligung:** Folgen für die Bewilligung in den kantonalen Quellen nicht genannt. Belegt: EU/EFTA-Personen mit Kurzaufenthalts- oder Aufenthaltsbewilligung und Personen mit hängigem Gesuch beim OCPM fallen unter Sonderregeln mit möglicherweise tieferer oder befristeter Hilfe ([1], Art. 24 al. 3, Art. 25 al. 1 lit. d, e).
  > «les personnes étrangères sans autorisation de séjour qui ont présenté une demande d'autorisation de séjour auprès de l'office cantonal de la population et des migrations» — [1], Art. 25 al. 1 lit. e ⟨ergänzt 09.11.2026, Fachprüfung⟩
- **Wohnsitzwechsel:** Anspruch nur bei Wohnsitz **und** tatsächlichem Aufenthalt im Kanton:
  > «ont leur domicile et leur résidence effective sur le territoire de la République et canton de Genève» — [1], Art. 24 al. 1 lit. a
  (Präambel stützt sich auf das ZUG.)
- **Meldepflicht Erbe:** Anwartschaften sind zu melden, auch aus nicht liquidierten Nachlässen ([1], Art. 45).
- **Kürzung/Sanktion:** Kürzung, Verweigerung, Sistierung oder Aufhebung u. a. bei Verletzung der Mitwirkungspflicht; befristet; Höchstsatz der Kürzung im Gesetz ([1], Art. 47).
- **Liegenschaften:** Hilfe an Eigentümer ist rückzahlbar; Grundpfand als Sicherheit erwähnt ([1], Art. 29, Art. 52 al. 2).

### Offen / nicht gefunden
- Die Seite des Hospice général schreibt: «d’après la loi constitutionnelle, l’aide sociale n’est pas remboursable sur le canton de Genève» — welche Verfassungs-/Gesetzesstelle gemeint ist, nicht geprüft; die Gesetzesstelle ist LASLP Art. 21 al. 2 (mit Ausnahmen).
- RASLP nur auf Stichworte durchsucht.

### Quellen
1. Loi sur l'aide sociale et la lutte contre la précarité (LASLP), rsGE J 4 04, du 23 juin 2023, en vigueur 1er janvier 2025. https://silgeneve.ch/legis/data/rsg_j4_04.htm — abgerufen 09.11.2026, HTTP 200; Gegenprobe `legis/data/rsg_x9_99.htm` → 404, `/atlantis-gibt-es-nicht-4711` → 404
2. Règlement d'application de la LASLP (RASLP), rsGE J 4 04.01, du 17 avril 2024, dernières modifications au 1er mars 2026. https://silgeneve.ch/legis/data/rsg_j4_04p01.htm — HTTP 200
3. Hospice général, «Obtenir de l'aide». https://www.hospicegeneral.ch/obtenir-de-laide/ — HTTP 200 (= `CANTONAL_LINKS.GE.sozialdienst`); Gegenprobe `/atlantis-gibt-es-nicht-4711` → 404
4. Hospice général, «Nos adresses» (Centres d'action sociale). https://www.hospicegeneral.ch/nos-adresses/ — HTTP 200
5. République et canton de Genève, «Office de l'action, de l'insertion et de l'intégration sociales». https://www.ge.ch/organisation/office-action-insertion-integration-sociales — HTTP 200; Gegenprobe ge.ch `/atlantis-gibt-es-nicht-4711` → 404. DCS: https://www.ge.ch/organisation/departement-cohesion-sociale-dcs — HTTP 200

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet:** SKOS-Kurzaussage «dynamisch für Grundbedarf» zu weit.
- **Geändert:** SKOS-Kurzaussage gestrichen und ersetzt (fester Betrag RASLP Art. 5, gesetzliche Bindung LASLP Art. 31); Art. 25 al. 1 lit. e vollständig zitiert; Zeile Asylbereich (LASLP Art. 26). Zitate selbst am silgeneve-Text geprüft.
- **Offen:** RASLP nur in Teilen gelesen; die «loi constitutionnelle» auf der Hospice-Seite nicht zugeordnet.

---

## JU — Jura

**Beurteilung:** belegbar
**Zuständig (kurz):** Kanton entscheidet (Service de l'action sociale, SAS); die Services sociaux régionaux (SSR, autonome öffentlich-rechtliche Anstalt) nehmen Anträge entgegen und geben sie an die Gemeinde weiter, die mit Stellungnahme an den SAS übermittelt; Auszahlung durch die Gemeinde (LASoc Art. 28–35, 48, 49, 64)
**Antrag (kurz):** mündlich oder schriftlich beim SSR des Wohn- oder Aufenthaltsorts (LASoc Art. 29); SSR-Website mit Adressen
**SKOS (kurz):** subsidiär — eigenes Normen-Arrêté des Gouvernement «vu les normes» CSIAS; CSIAS-Normen «font référence pour les situations non réglées» (Arrêté Art. 41); Forfaitinhalt nach CSIAS definiert (Arrêté Art. 3 al. 2)
**Aufsicht:** Gouvernement (haute surveillance, LASoc Art. 60); SSR unter Aufsicht des SAS und der kantonalen Kommission (LASoc Art. 48 al. 3) — https://www.jura.ch/sas
**Geprüft:** 09.11.2026

### Erlasse
| Erlass | Nr. | Stand | Link | Beleg (Status, Gegenprobe) |
|---|---|---|---|---|
| Loi sur l'action sociale (LASoc), du 15 décembre 2000 | RSJU 850.1 | «Texte en vigueur actuellement» (letzte Änderung lt. Fussnoten in Kraft seit 1er janvier 2023) | https://rsju.jura.ch/fr/viewdocument.html?idn=20167&id=36862 | 200 HTML; PDF `&download=1` → 200 application/pdf. Gegenprobe `id=99999999` → 200, liefert aber die Startseite «Accueil» (Soft-404); `/atlantis-gibt-es-nicht-4711` → 500. Bestand daher über Inhalt (Titel, Nummer im PDF) belegt |
| Ordonnance sur l'action sociale, du 30 avril 2002 | RSJU 850.111 | ~~aktuelle Fassung (Datum nicht ausgelesen)~~ letzte Änderung in Kraft «1er janvier 2023» (Fussnote 12) ⟨ergänzt 09.11.2026, Fachprüfung⟩ | https://rsju.jura.ch/fr/viewdocument.html?idn=20167&id=36629 | PDF → 200 |
| Arrêté fixant les normes applicables en matière d'aide sociale, du 8 novembre 2005 | RSJU 850.111.1 | ~~aktuelle Fassung (Datum nicht ausgelesen)~~ letzte Änderung (Arrêté du 16 septembre 2025) in Kraft «1er janvier 2026» ⟨ergänzt 09.11.2026, Fachprüfung⟩ | https://rsju.jura.ch/fr/viewdocument.html?idn=20167&id=36909 | PDF → 200 |
| Guide pratique de l'aide sociale dans le canton du Jura (SAS) | — | «RCJU/SAS Version septembre 2026» | auf https://www.jura.ch/fr/Autorites/Administration/DSJP/SAS/Soutiens-financiers/Aide-sociale/Aide-sociale.html | PDF → 200 |

Hinweis: `https://rsju.jura.ch/api/fr/texts_of_law/850.1` → 500 (Fehlerseite) — RSJU ist keine LexWork-App.

### Zuständigkeit und Antrag
> «L'Etat décide de l'octroi de l'aide sociale aux personnes dans le besoin.» — [1], Art. 28

> «Celui qui entend bénéficier de prestations d’aide sociale doit s’annoncer verbalement ou par écrit au service social régional de son lieu de domicile ou de séjour.» — [1], Art. 29 al. 1

> «Le service social régional réunit sans délai les renseignements et les documents disponibles et transmet la requête à la commune de domicile ou de séjour du requérant.» — [1], Art. 30 al. 1

> «Pour obtenir l’aide sociale, quelle que soit sa forme, il faut s’adresser au Service social régional (SSR), présent dans chacun des trois districts du canton.» — [5]

### SKOS-Richtlinien
> «Le Gouvernement définit, par voie d'arrêté, les normes de calcul applicables.» — [1], Art. 27

> «Les normes CSIAS font référence pour les situations non réglées dans le présent arrêté.» — [3], Art. 41

> «Le forfait pour l’entretien comprend les postes de dépenses définis dans les normes CSIAS.» — [3], Art. 3 al. 2

### Was Geld oder Rechte kosten kann
- **Rückerstattung:** bei Vorschüssen, unrechtmässigem Bezug infolge falscher Angaben, Erbschaft/Schenkung/Lotteriegewinn, und — auffällig — bei späterem Erwerbseinkommen, das einen «train de vie aisé» erlaubt; Ehegatten solidarisch, Erben soweit bereichert. Leistungen aus Eingliederungsvertrag nicht rückzahlbar. Verjährung: Frist im Gesetz (relativ und absolut).
  > «L'aide matérielle fournie aux personnes majeures est remboursable dans les situations suivantes : a) lorsque l'aide a été accordée à titre d'avance sur des prestations, au moment où ces dernières leur sont versées; […] b) lorsque l'aide a été obtenue indûment, à la suite d'indications fausses ou incomplètes; c) lorsque le bénéficiaire est en mesure de s'acquitter de tout ou partie de sa dette par suite d'un héritage, d'un don, d'un gain de loterie ou de revenus extraordinaires ne provenant pas de son travail; d) lorsque le bénéficiaire acquiert par son travail d'autres revenus lui permettant d'avoir un train de vie aisé.» — [1], Art. 36 al. 1
  > «Les héritiers doivent rembourser l'aide matérielle dont a bénéficié le défunt dans la mesure où ils tirent profit de la succession.» — [1], Art. 41
- **Verwandtenunterstützung:** Beteiligungspflicht nach ZGB 328/329; einvernehmliche Festlegung, sonst Zivilrichter.
  > «Dans la mesure de leurs possibilités, les parents tenus à l'obligation d'entretien selon les articles 276 et suivants du Code civil suisse et les personnes tenues à fournir des aliments conformément aux articles 328 et 329 du Code civil suisse participent à la prise en charge de l'aide matérielle accordée au bénéficiaire.» — [1], Art. 44 al. 1
- ~~**Aufenthaltsbewilligung:** im Gesetz nicht genannt; der amtliche Leitfaden des SAS nennt eine Meldung an den Service de la population bei Nichtverlängerung der Bewilligung B und reduzierte Hilfe während des Verfahrens: «Tant que la personne est en procédure d'opposition ou de recours, il convient de lui octroyer une aide sociale au minimum vital, […] et d'annoncer au Service de la population que la personne bénéficie d'une aide sociale.» — [4], S. 12~~ ⟨korrigiert 09.11.2026, Fachprüfung: überzeichnet und falsche Seite — die Kürzung gilt nur für **neue Gesuche** während eines Verfahrens um Nichtverlängerung B; das «[…]» verdeckte diese Einschränkung; Zitat steht auf S. 13⟩
- **Aufenthaltsbewilligung:** im Gesetz nicht genannt; der amtliche Leitfaden des SAS (Version septembre 2026) unterscheidet:
  - **Erneuerung der Bewilligung B/C:** ordentliche Sozialhilfe.
    > «Dans les situations de renouvellement du permis de séjour l’aide sociale ordinaire doit être octroyée.» — [4], S. 12
  - **Wer bereits Sozialhilfe bezieht und eine Nichtverlängerung B erhält:** während Einsprache/Rekurs weiterhin ordentliche Hilfe; Dossier ist dem Service de la population bereits gemeldet.
    > «Tant que la personne est en procédure d'opposition ou de recours (décision de non-renouvellement du permis de séjour), il convient de lui octroyer l'aide sociale ordinaire (dossier déjà annoncé au Service de la population).» — [4], S. 12
  - **Neues Gesuch während eines Verfahrens um Nichtverlängerung B:** Hilfe auf das Existenzminimum gekürzt (Kürzung im Leitfaden beziffert) und Meldung an den Service de la population.
    > «Personnes sollicitant une aide matérielle (nouvelle demande) et pour laquelle une décision de non-renouvellement du permis B est prononcée par le Service de la population : Tant que la personne est en procédure d'opposition ou de recours, il convient de lui octroyer une aide sociale au minimum vital» — [4], S. 13
  - **Bewilligung L:** Bezügerinnen und Bezüger werden gemeldet.
    > «Les personnes possédant un permis L et bénéficiant d’une aide matérielle sont annoncées au Service de la population.» — [4], S. 12
  - Rechtsgrundlage der Meldungen ist Bundesrecht (LEI/OASA); der Leitfaden beschreibt den kantonalen Vollzug. Der Leitfaden ist eine Praxishilfe des SAS, kein Erlass.
- **Wohnsitzwechsel:** Antrag am Wohn- oder Aufenthaltsort ([1], Art. 29); ist der Kanton nach ZUG direkt zuständig, gilt kantonales Recht:
  > «Lorsque l'aide sociale incombe au Canton directement en vertu de la loi fédérale en matière d'assistance, l'octroi de prestations et le remboursement par le bénéficiaire interviennent conformément à la loi sur l'action sociale et à la législation qui en découle.» — [2], Art. 6
- **Grundpfand:** «En vue de garantir les prestations d'aide sociale, l'autorité d'aide sociale peut exiger la constitution de gages immobiliers conformément aux dispositions du Code civil suisse.» — [1], Art. 38
- **Abtretung:** «Lors de l'octroi de l'aide matérielle, l'autorité d'aide sociale veille à disposer des cessions nécessaires concernant les créances du bénéficiaire envers des tiers tenus à lui fournir des prestations.» — [3], Art. 2
- **Kürzung:** bei unrechtmässigem Bezug, schweren Pflichtverletzungen oder Rechtsmissbrauch, verhältnismässig, Existenzminimum bleibt garantiert; Höchstsatz und Höchstdauer in der Verordnung ([2], Art. 34).

### Offen / nicht gefunden
- ~~Genaues Datum der aktuellen Fassung von Ordonnance und Arrêté nicht ausgelesen.~~ ⟨erledigt 09.11.2026, Fachprüfung⟩
- Die Gegenprobe auf rsju.jura.ch ist schwach (Soft-404 für unbekannte ID, 500 für unbekannten Pfad).
- Die Leitfaden-Liste «Adresses utiles» auf jura.ch stammt von 2019 (Dateiname `BR_AdressesUtilesActionSociale_2019.pdf`), nicht geprüft.

### Quellen
1. Loi sur l'action sociale (LASoc), RSJU 850.1, du 15 décembre 2000, texte en vigueur. https://rsju.jura.ch/fr/viewdocument.html?idn=20167&id=36862 (PDF: `&download=1`) — abgerufen 09.11.2026, HTTP 200; Gegenprobe `…&id=99999999` → 200 Soft-404 (Startseite), `/atlantis-gibt-es-nicht-4711` → 500
2. Ordonnance sur l'action sociale, RSJU 850.111, du 30 avril 2002. https://rsju.jura.ch/fr/viewdocument.html?idn=20167&id=36629&download=1 — HTTP 200 (PDF)
3. Arrêté fixant les normes applicables en matière d'aide sociale, RSJU 850.111.1, du 8 novembre 2005. https://rsju.jura.ch/fr/viewdocument.html?idn=20167&id=36909&download=1 — HTTP 200 (PDF)
4. RCJU/SAS, «Guide pratique de l’aide sociale dans le canton du Jura», Version septembre 2026. https://www.jura.ch/Htdocs/Files/v/ed1398c52d1d2b40c373d5c5ef8c421da2bc52c6fcf3067eb76c51823021f723.pdf/202609_-Guide-pratique-de-laide-sociale-dans-le-canton-du-Jura.pdf?download=1 — HTTP 200 (PDF)
5. République et Canton du Jura, SAS, «Aide sociale». https://www.jura.ch/fr/Autorites/Administration/DSJP/SAS/Soutiens-financiers/Aide-sociale/Aide-sociale.html — HTTP 200; Gegenprobe jura.ch `/atlantis-gibt-es-nicht-4711` → 404
6. «Action sociale du Canton du Jura». https://www.jura.ch/sas — HTTP 200 (= `CANTONAL_LINKS.JU.sozialdienst`)
7. Services sociaux régionaux. https://www.ssrju.ch/ — HTTP 200, Titel «Service Sociaux Régionaux République et Canton du Jura»; Gegenprobe `/atlantis-gibt-es-nicht-4711` → 404

### Fachprüfung 09.11.2026 (swiss-precision-pruefer)
- **Beanstandet (wichtigster Befund):** Die Aussage zur Aufenthaltsbewilligung war überzeichnet. Die gekürzte Hilfe gilt nur bei einem neuen Gesuch während eines Verfahrens um Nichtverlängerung B, das «[…]» verdeckte das. Seite falsch (13, nicht 12).
- **Geändert:** alte Aussage gestrichen; vier Fälle getrennt und je wörtlich belegt (S. 12 und 13, Seitenzahlen am PDF-Seitenumbruch geprüft); Hinweis auf Bundesrecht und darauf, dass der Leitfaden kein Erlass ist; Stände von Ordonnance (1er janvier 2023) und Arrêté (1er janvier 2026) aus den Fussnoten nachgetragen; Apostrophe der Zitate an den PDF-Text angeglichen.
- **Offen:** keine eigene Asylregel im kantonalen Recht gelesen → keine Zeile Asylbereich; Gegenprobe RSJU bleibt schwach (Soft-404).

---

---

## Anhang · Messnotizen der fünf Gruppen

Unverändert aus der Erhebung übernommen (Messprobleme, Auffälligkeiten, Link-Hinweise). Gruppen: 1 = ZH BE LU UR SZ · 2 = OW NW GL ZG FR · 3 = SO BS BL SH AR · 4 = AI SG GR AG TG · 5 = TI VD VS NE GE JU.

### Gruppe 1

**Messprobleme**
- ZH-Lex (notes.zh.ch): `OpenAttachment`-Links liefern 200 mit einer JS-Weiterleitung (HTML), auch für erfundene Dokument-IDs → kein Beleg. Erst das Ziel `…/WebView/<id>/$File/<datei>.pdf` liefert 200 PDF bzw. 404 für Fantasie-ID.
- SZ: keine LexWork-API; Bestand nur über PDF-Assets und Sammlungsseite, Versionsstand nur aus der PDF-Fusszeile.
- UR: Rechtsbuch-API hat keine (gefundene) Suchfunktion; Nummern per Durchprobieren 20.3400–20.3460. ur.ch lädt Publikationslisten per JS — mit curl nicht vollständig sichtbar.
- ogd.parl.apps.be.ch: Fantasie-ID → 404, aber eine real indexierte, nicht mehr vorhandene ID → 200 mit HTML-Fehlerseite (Soft-404) — Inhalt stets mit `file`/pdfinfo prüfen.
- Sonst alle Domains mit sauberem 404 auf Fantasie-Pfade (zh.ch, belex, gsi.be.ch, srl.lu.ch, disg.lu.ch, rechtsbuch.ur.ch, ur.ch, sz.ch).

**Auffälligkeiten**
- BE: Totalrevision SHG beschlossen (GR 10.03.2026), Inkrafttreten **01.01.2027** vom RR am 28.10.2026 beschlossen; BELEX zeigt am 09.11.2026 noch keine künftige Version. Referendumsvorlage nicht abrufbar (rrgr-service 404, OGD Soft-404). BE-Abschnitt gilt bis 31.12.2026; Vorschau aus RRB 75/2026. ⟨korrigiert 09.11.2026, Fachprüfung⟩
- UR: Gesamtrevision 2025 vom Volk abgelehnt, neue Vorlage vom 19.05.2026 hängig; SKOS-Status im geltenden Recht schwach («orientiert sich»), RR-Richtlinien unauffindbar.
- ZH: SKOS-Weisung der Sicherheitsdirektion von 2024, SHV verweist inzwischen auf SKOS-Fassung 2026.
- LU: DISG meldet Anpassung der Vermögensfreibeträge per 01.01.2026, SRL-Stand der SHV bleibt 01.01.2024.
- BE: Sozialdienstverzeichnis Mai 2023; SHV-Metadaten mit Beschlussdatum nach Inkrafttreten.
- SZ: Merkblatt 2012, ShV-PDF Stand 2018.
- `CANTONAL_LINKS[k].sozialdienst`: alle fünf Links erreichbar (200) und thematisch richtig (ZH «Sozialhilfe», BE «Sozialhilfe» GSI, LU «Existenzsicherung - Sozialhilfe», UR «wirtschaftliche und persönliche Sozialhilfe», SZ «Soziales» mit Abschnitt Sozialhilfe). Für BE wäre für Betroffene «Sozialhilfe kurz erklärt» (mit Verzeichnis) passender als die Themenseite; für SZ liesse sich der Anker `#sozialhilfe` ergänzen. Keine falschen Links gefunden.

**Je Kanton**
- `ZH | belegbar | SHG/SHV aktuell belegt, Gemeinde zuständig, SKOS statisch verbindlich (Fassung 2026) mit Weisung, Meldepflicht Ausländerbehörde im Gesetz`
- `BE | belegbar (bis 31.12.2026) | geltendes SHG/SHV belegt; ab 01.01.2027 neues SHG (Rückerstattung nur noch bei Vermögensanfall, neue Artikelnummern) — Vorschau nicht aus Referendumsvorlage, Neuerhebung nötig`
- `LU | belegbar | SHG/SHV per API belegt, SKOS «wegleitend» mit vielen benannten Abweichungen; kein Sozialdienst-Verzeichnis, keine Migrations-Meldepflicht gefunden`
- `UR | teilweise | SHG belegt, keine Verordnung, RR-Richtlinien zur Bemessung nicht gefunden → SKOS-Verbindlichkeit nicht belegt; Revision hängig`
- `SZ | belegbar, Stand nur durch Fusszeile belegt | ShG/ShV als PDF belegt (keine API), SKOS «wegleitend» + Sanktionsabweichung; Sozialverzeichnis vorhanden; Merkblatt alt`

### Gruppe 2

**Messprobleme:** keine Domain blockierte curl. gl.ch antwortete diesmal mit 200 (früher 403) — die
Gegenprobe ergab ein sauberes 404, also kein Soft-404. Alle fünf LexWork-Sammlungen (gdb.ow.ch,
gesetze.nw.ch, gesetze.gl.ch, bgs.zg.ch, bdlf.fr.ch) liefern die API und `lightweight_index` und geben bei
erfundener Nummer 404. gdb.ow.ch gibt `pdf_link`/`canonical_link` noch als `http://` aus (über https abrufbar).

**Auffälligkeiten:**
- FR: Neues LASoc seit 01.01.2026 in Kraft, Ausführungsrecht aber noch zum alten Gesetz von 1991; SASoc-Seite
  «comment obtenir de l'aide» Stand 28.03.2023 und inhaltlich veraltet.
- GL: SHV Art. 10 Abs. 1 («zeitlich unbegrenzt») widerspricht dem Wortlaut nach den Erlöschensfristen in SHG Art. 33 Abs. 3.
  Das Merkblatt verweist auf eine aufgehobene «Sozial- und Nothilfe-Richtlinie».
- ZG: zg.ch verlinkt SHG und SHV auf Fassungen, die bis 31.12.2023 galten (versions/1747, versions/1512).
- OW: kein SKOS-Verweis im kantonalen Recht; SHV nennt noch das «kantonale Fürsorgedepartement».
- `CANTONAL_LINKS[k].sozialdienst`: alle fünf Links antworten 200 mit passendem Titel. OW
  `ow.ch/aemter/244` = Kantonales Sozialamt (nicht die Stelle für Gesuche; die Gesuche laufen über
  rsd-obwalden.ch bzw. die Themenseite `ow.ch/familie/5447`). NW `nw.ch/sozialamt` leitet auf `/sozialamt/298`;
  passender wäre für Gesuche `nw.ch/sozialdienst/1138`. FR `fr.ch/dsas/sasoc` = Amtsseite SASoc; für Gesuche
  passender die SSR-Liste `fr.ch/document/387371`. GL und ZG treffen die richtige Themenseite.

| KT | Beurteilung | warum |
|---|---|---|
| OW | teilweise | Erlasse, Zuständigkeit, Antragsweg belegt; SKOS-Status im kantonalen Recht nicht auffindbar |
| NW | belegbar | SHG/SHV aktuell, SKOS als Massstab («orientiert sich an», ~~ganz~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩), statisch (5. Ausg. + Ergänzungen bis 2026) mit verbindlichen Anhang-Abweichungen, Antragsweg über kant. Sozialamt |
| GL | belegbar | Kanton zuständig, SKOS «in der Regel» + Departementsverordnung mit Abweichungen; Widerspruch Verjährung offen |
| ZG | belegbar | Gemeinden zuständig, SKOS dynamisch verbindlich (SHV § 9) mit eigenen Ansätzen, amtliches Gemeindeverzeichnis |
| FR | teilweise | ~~neues LASoc seit 01.01.2026 belegt, aber Ausführungsrecht noch zum alten Gesetz; SKOS nur als Referenz/subsidiär~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩ LASoc 2026 in Kraft, Übergangsfrist für die neue Organisation, Ausführungsrecht noch zum Gesetz von 1991; SKOS nur als Referenz/subsidiär |
| ZG | (Nachtrag) | ⟨09.11.2026⟩ SKOS-Verweis «ohne Ausgabe» statt «dynamisch»; Bürgergemeinden nicht im Verzeichnis |

### Gruppe 3

**Messprobleme**
- baselland.ch: Cloudflare-Schranke, jede URL inkl. Gegenprobe 403 «Just a moment…» → mit curl nicht messbar. bl.clex.ch normal messbar.
- bettingen.ch: keine Verbindung (HTTP 000), auch Gegenprobe → nicht messbar.
- sh.ch: Soft-404 an der Wurzel (erfundener Pfad → Weiterleitung auf Startseite, 200); im CMS-Pfad 500. Ein 200 auf sh.ch ist nur zusammen mit dem Seitentitel ein Beleg.
- sh.lexican.cloud (Online-Sozialhilfehandbuch SH): Soft-404 (erfundene ID → 200), JS-App → nicht messbar.
- sozialamt.sh.ch: 401 (interner Bereich).
- LexWork-App-Pfade liefern immer 200; Bestand nur per API belegt.

**Auffälligkeiten**
- **SKOS-Status sehr unterschiedlich:** ~~SO und AR erklären die SKOS verbindlich (mit Abweichungen)~~ SO wendet die SKOS «grundsätzlich» an, mit Abweichungsliste; AR erklärt sie verbindlich mit Vorbehalten ⟨korrigiert 09.11.2026, Fachprüfung⟩; BS dynamisch über Departementsrichtlinien («jeweils aktuelle Version»); BL nur «kann sich orientieren», eigene Ansätze in der SHV; SH erwähnt die SKOS in Gesetz und Verordnung gar nicht, nur die Departementsrichtlinien «in Anlehnung».
- **Rückerstattung aus Erwerbseinkommen:** SO (§ 14 lit. d) und AR (Art. 27, «wesentlich verbessert») ja; SH ausdrücklich nein (Art. 31 Abs. 2); BL nur bei Vermögensanfall; BS nur bei «erheblichem Vermögen»/Nachlass.
- **Verwandtenunterstützung:** SO macht sie über den **Kanton** geltend; ~~BL hat die kantonale Verwandtenunterstützungspflicht 2014 aufgehoben (Vademecum), heutiger Umgang nicht belegt.~~ BL: Vademecum-Titel «Aufhebung Verwandtenunterstützungspflicht» (GS 38.0229, 01.01.2014, änderte § 5 Abs. 1–2, § 11 Abs. 2 lit. b, § 33); heute gilt § 5 Abs. 2 «Die Unterstützungspflicht der Verwandten gilt nicht als gesetzliche Leistung Dritter.» Die Pflicht nach ZGB 328/329 ist Bundesrecht; wie BL-Gemeinden sie heute handhaben, ist nicht belegt ⟨korrigiert 09.11.2026, Fachprüfung⟩.
- **Meldung an das Migrationsamt:** ~~nur BS belegt (automatisch bei jedem Bezug, Merkblatt); SO nur bei Integrationsdefizit; BL, SH, AR nicht genannt.~~ In den kantonalen Quellen belegt nur für BS (automatisch bei jedem Bezug, Merkblatt; dazu Strafanzeige bei unrechtmässigem Bezug mit möglicher Wegweisung); SO nennt eine Meldung bei Integrationsdefizit; in BL, SH, AR in den kantonalen Quellen nicht genannt. **Das ist kein belegter Kantonsunterschied:** die BS-Meldung beruht vermutlich auf Bundesrecht (nicht geprüft); «nicht genannt» heisst nicht «keine Meldung». Vor Veröffentlichung gegen Bundesrecht prüfen ⟨korrigiert 09.11.2026, Fachprüfung⟩.
- Veraltete Stände: BS-SHG Stand 2021, SH Stand 2018, AR SHG 2013/SHV 2016 — keine neueren Versionen in den APIs. SO hat eine bereits beschlossene Fassung ab 01.01.2027 (betrifft die Sozialhilfe-Paragrafen nicht).
- BS-SHG Fussnote zu § 7 Abs. 3 verweist auf die alte Adresse `http://www.wsu.bs.ch/ueber-uns/dienststellen/sozialhilfe.html` (leitet heute auf https://www.bs.ch/wsu um, nicht auf die Sozialhilfe-Seite).
- `CANTONAL_LINKS[k].sozialdienst`: SO (200), BS (200), SH (200, Titel «Sozialamt»), AR (200) geprüft und passend. BL `https://www.baselland.ch/themen/sozialhilfe` mit curl nicht messbar (Kommentar im Code sagt «im Browser geprüft») — nicht falsch, nur nicht nachprüfbar. Für SO wäre die Seite «Ansprechstellen in der Sozialhilfe» als Antragsweg spezifischer; für AR die Seite «Adressen Sozialämter».

**Je Kanton**
- `SO | belegbar | SG/SV per API, Sozialregionen + Verzeichnis, SKOS grundsätzlich (SG § 152) mit Abweichungsliste SV § 93` ⟨korrigiert 09.11.2026, Fachprüfung; vorher «SKOS verbindlich»⟩
- `BS | belegbar | SHG per API, Träger Kanton (Stadt)/Riehen, SKOS dynamisch über WSU-Richtlinien 2026, Migrationsamt-Meldung belegt`
- `BL | teilweise | SHG/SHV per API belegt, aber baselland.ch (Antragsweg, Verzeichnis, Amtsseite) mit curl nicht messbar; SKOS nur «kann orientieren»`
- `SH | belegbar | SHEG/SHEV/850.110 per API, Gesuch formlos (Art. 32), eigene Richtlinien «in Anlehnung» an SKOS (Fassung 2025 nicht vom Sozialamt verlinkt, Aktualität offen), Aufsicht DI/Sozialamt`
- `AR | belegbar | SHG/SHV per API (alter Stand, keine Revision gefunden), SKOS verbindlich SHV Art. 3, Adressliste Sozialämter`

### Gruppe 4

**Messprobleme**
- Alle fünf Gesetzessammlungen (ai.clex.ch, gesetzessammlung.sg.ch, gr-lex.gr.ch, gesetzessammlungen.ag.ch,
  rechtsbuch.tg.ch) sind LexWork. Die Anzeige-URL `…/app/de/texts_of_law/<nr>` liefert für **jede** Nummer HTTP 200
  (gemessen mit `ai.clex.ch/app/de/texts_of_law/999.999` → 200). Bestand deshalb nur über `/api/de/texts_of_law/<nr>`
  und `/api/de/versions/<id>/pdf_file` belegt; Gegenproben dort → 404. Die App-Links in den Tabellen sind korrekt, aber
  allein kein Beleg.
- Keine Domain dieser Gruppe hat curl blockiert. Alle Kantonsportale (ai.ch, sg.ch, gr.ch, ag.ch, sozialamt.tg.ch,
  sozialnetz.tg.ch, kos-sg.ch) geben auf erfundene Pfade echte 404.
- Aargauer Gesuchsformular ist ein XFA-PDF (nur Bestand messbar, Inhalt nicht lesbar).
- Inhaltslisten der Sammlungen stammen aus dem abgebrochenen Vorlauf (Dateien `idx_*.json`) und dienten nur zum
  Finden der Nummern; jeder verwendete Erlass ist am 09.11.2026 neu über die API abgerufen.

**Auffälligkeiten / Widersprüche**
- **AG:** Amtsseite «Sozialhilfe für Privatpersonen» nennt SKOS «Stand 1. Januar 2023»; die geltende SPV (§ 2a, seit
  01.01.2026) erklärt die Fassung «ab 1. Januar 2026» verbindlich → Amtsseite veraltet. Die Seite
  `…/organisation/kantonaler-sozialdienst` antwortet 404 (Unterseite Beschwerdestelle SPG 200).
- **GR:** ABzUG Art. 1 verweist **statisch** auf die SKOS-Richtlinien «vom April 2005»; die Amtsseite verweist pauschal
  auf die SKOS und verlinkt die aktuelle Fassung. Fussnote im Sozialhilfegesetz zeigt auf die seit 2016 aufgehobenen
  Ausführungsbestimmungen BR 546.210. Die regionalen Sozialdienste heissen auf der Amtsseite jetzt «Beratungszentren Soziales».
- **SG:** Gesetz verweist auf die KOS-Richtlinien, nicht auf die SKOS; Allgemeinverbindlicherklärung durch die Regierung
  in der sGS nicht gefunden. Die KOS (Verein) schreibt selbst, die SKOS-Richtlinien seien in SG «unverbindlich».
  Fussnote zum Departement im SHG noch «Departement für Inneres und Militär».
- **TG:** SHG hat eine bereits beschlossene **Fassung ab 01.01.2027** (Rückerstattungspflicht neu erst nach
  Abschluss einer Ausbildung, ~~spätestens ab 25~~ Altersgrenze im Gesetz ⟨korrigiert 09.11.2026, Fachprüfung⟩;
  Zuständigkeitskonflikte entscheidet das Departement; Weiterführung der Unterbringung junger Volljähriger; Bewilligung
  ambulanter Betreuungsangebote durch Gemeinden). Einziger
  Kanton der Gruppe mit ausdrücklicher Meldung an die Ausländerbehörde (§ 2l Abs. 3 SHV, für L-Bewilligung und
  FZA-Stellensuchende).
- **AI:** Bemessungsrichtlinien der Standeskommission (Art. 5 Abs. 2 ShiV) nicht öffentlich auffindbar → SKOS-Status offen.
- **`CANTONAL_LINKS[k].sozialdienst`:** alle fünf Links am 09.11.2026 HTTP 200 mit passendem Titel
  (AI «Sozialhilfe – Kanton Appenzell I.Rh.», SG «Sozialhilfe | sg.ch», GR Amt für Soziales Startseite,
  AG «Sozialhilfe - Kanton Aargau», TG «Sozialamt»). Kein falscher Link gefunden. Hinweis: GR- und TG-Link zeigen auf
  die Amts-Startseite, nicht auf die Sozialhilfe-Seite; genauer wären
  `https://www.gr.ch/DE/institutionen/verwaltung/dvs/soa/beratung/finanzielle-unterstuetzung/sozialhilfe/Seiten/default.aspx`
  und `https://sozialamt.tg.ch/sozialhilfe.html/4501` (beide 200).

**Je Kanton**
- `AI | teilweise | Erlasse, Zuständigkeit (Kanton/Sozialamt) und Antragsweg belegt; SKOS-Status nicht belegt (Richtlinien der Standeskommission nicht auffindbar)`
- ~~`SG | belegbar | …`~~ ⟨korrigiert 09.11.2026, Fachprüfung⟩
- `SG | teilweise | Gemeinde zuständig, Antrag beim Gemeinde-Sozialamt belegt; SKOS-Status nicht belegt — Gesetz verweist auf KOS-Richtlinien (Art. 11 Abs. 1bis SHG), Allgemeinverbindlicherklärung nicht gefunden; Aufsicht nur mittelbar belegt`

**Fachprüfung 09.11.2026 (swiss-precision-pruefer), gruppenweit:** kein Blocker, kein Zitat erfunden oder verfälscht.
Eingearbeitet: SG → teilweise; Zahlen ausserhalb von Zitaten → «Altersgrenze im Erlass»; Bundesrechts-Hinweis bei
jeder «nicht genannt»-Aussage zur Aufenthaltsbewilligung; Methodik-Vermerk (nur Inhaltslisten, keine Volltextsuche) bei
AI/SG; je Kanton Zeile «Asylbereich». Jedes neue Zitat am eigenen Download unter (lokaler Abruf, nicht im Repo) geprüft.
- `GR | belegbar | Gemeinde entscheidet, Beratungszentren Soziales bereiten Gesuch vor; SKOS statisch Fassung April 2005 mit kantonalen Ansätzen (Art. 1 ABzUG)`
- `AG | belegbar | Gemeinde am Unterstützungswohnsitz, schriftliches Gesuch; SKOS-Fassung ab 01.01.2026 verbindlich mit benannten Ausnahmen (§ 2a SPV); Amtsseite veraltet`
- `TG | belegbar | Wohnsitzgemeinde/Sozialhilfebehörde; SKOS «in der Regel» in jeweils geltender Fassung (§§ 2a–2b SHV); SHG-Änderung ab 01.01.2027 beachten`

### Gruppe 5

**Messprobleme**
- **vs.ch ist heute mit curl messbar.** Entgegen dem Hinweis antwortet `https://www.vs.ch/de/web/sas` mit 200 (Titel «Dienststelle für Sozialwesen - - vs.ch") und `/atlantis-gibt-es-nicht-4711` mit 404 (UA `Mozilla/5.0`). Die Notiz «vs.ch antwortet curl auf jeden Pfad mit 404» stimmt am 09.11.2026 nicht mehr (ggf. hängt es vom User-Agent ab, nicht geprüft).
- **Soft-404 in amtlichen Sammlungen:** TI RLeggi (unbekannte ID → 200 «non è contenuto»), JU RSJU (unbekannte ID → 200 Startseite), VD BLV-API (unbekannte Nummer → 200 `[]`). Bestand dort über Inhalt belegt, nicht über Status.
- VD BLV ist eine Angular-App; Text nur über `api/actes/<htmlId>/html` mit vorher aus `api/recueil-systematique` und `api/actes/CONSOLIDE?id=…&cote=…` ermittelten IDs. Ohne `id` → 500.
- NE RSN und JU RSJU sind keine LexWork-Apps (`/api/…` → 404 bzw. 500).

**Auffälligkeiten**
- **GE: LIASI ist aufgehoben** (LASLP Art. 79), seit 01.01.2025 gilt die LASLP unter derselben Nummer J 4 04. Jeder Text oder Code, der «LIASI» nennt, ist veraltet.
- **TI: 6.4.11.1 ist die alte Nummer**; neu 871.100 (Las) / 871.110 (RLas). Die Sammlung zeigt «Numerazione precedente 6.4.11.1».
- **VD: «SKOS gilt in VD nicht» ist zu pauschal** — LASV verweist für Vermögensgrenzen und als Untergrenze beim Forfait junger Erwachsener ausdrücklich auf die CSIAS; der Barème ist aber kantonal.
- GE: Die Seite des Hospice général sagt «loi constitutionnelle» zur Nicht-Rückzahlbarkeit; im Gesetz steht der Grundsatz mit Ausnahmen (Art. 21 al. 2, 48–54) — für Nutzerinnen wichtig: «nicht rückzahlbar» gilt nicht bei Erbschaft, Lotteriegewinn, Vorschüssen usw.
- JU: Rückerstattung auch bei späterem Erwerbseinkommen mit «train de vie aisé» (LASoc Art. 36 al. 1 lit. d); VS ähnlich (LIAS Art. 52 al. 1 lit. f) — anders als in GE/NE/TI.
- `CANTONAL_LINKS`: alle sechs `sozialdienst`-Links antworten am 09.11.2026 mit 200 und passendem Titel (TI, VD, VS, NE, GE, JU). Für VS steht in `CANTONAL_LINKS_GEPRUEFT` `sozialdienst: null` — kann mit dem heutigen Befund (200, Gegenprobe 404) auf geprüft gesetzt werden, falls die Auftraggeberin das will. NE-Link führt auf die SASO-Amtsseite, nicht direkt auf die GSR-Seite (`/themes/social/guichets-sociaux-regionaux` wäre für Antragstellende direkter).

**Fachprüfung 09.11.2026 eingearbeitet:** sieben Korrekturen (TI Zuständigkeit, VD Verwandtenunterstützung, VS OLIAS-Absatz und Weisungsseite, GE SKOS-Kurzaussage, JU Aufenthaltsbewilligung) und Hinweise; alle neuen Zitate selbst an den eigenen Downloads geprüft. Alle Zitate wurden maschinell gegen die Quelltexte abgeglichen und die Apostrophe auf das Originalzeichen gebracht (41 Stellen). Offen bleiben nur Titel und Metadaten aus HTML-`<title>` und JSON sowie zwei JU-Zitate, bei denen nur Fussnotenziffern im PDF-Text («2)») abweichen.

**Je Kanton**
- `TI | belegbar | Las 871.100 + RLas 871.110 per Volltext, Antrag über Gemeinde → sportello LAPS → USSI, SKOS nur «tenuto conto»`
- `VD | belegbar | LASV/RLASV per BLV-API, Antrag beim CSR, eigener Barème mit CSIAS-Verweisen für Vermögen und Jungen-Forfait`
- `VS | belegbar | LIAS/OLIAS per lex.vs.ch-API (404-Gegenprobe), Gemeinde entscheidet, CMS instruiert, CSIAS subsidiär; Migrationsmeldung in der Weisung`
- `NE | belegbar | LASoc/ANCAM per RSN (404-Gegenprobe), Gemeinde/regionale Kommission, Eingang GSR, CSIAS «pour le surplus»`
- `GE | belegbar | LASLP (ersetzt LIASI seit 2025) per silgeneve (404-Gegenprobe), Hospice général, Forfait nach CSIAS dynamisch`
- `JU | belegbar | LASoc/Ordonnance/Arrêté per RSJU-PDF (Gegenprobe nur Soft-404), Antrag beim SSR, Staat entscheidet, CSIAS subsidiär`
