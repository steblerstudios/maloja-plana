# SKOS-Vermögensfreibetrag 2026 — Kantons-Übersicht mit Quellen

**Zweck:** Die App rechnet aktuell für **alle** Kantone mit derselben Zahl
(`vermoegensfreibetragSKOS` in `src/data/sozialhilfeRechner.js`, Stand dieser
Recherche: 6'000 CHF Einzelperson / 12'000 CHF Paar / +3'000 CHF je
minderjähriges Kind / Deckel 15'000 CHF). Die SKOS-Übersichtskarte zeigt aber
**26 unterschiedliche kantonale Werte**. Dieses Dokument hält fest, welcher
Betrag pro Kanton laut Karte gilt, und prüft ihn — wo möglich — gegen die
kantonale Rechtsgrundlage.

**Wahrheits-Regel:** Jede Zahl mit Quelle und Abrufdatum. Wo keine amtliche
kantonale Quelle gefunden wurde, steht das explizit da — der Kartenwert gilt
dann nur als «laut SKOS-Übersicht», nicht als kantonal geprüft.

---

## Schritt 1 — Die SKOS-Karte ausgelesen

**Quelle:** SKOS, «Höhe des Vermögensfreibetrags — Übernahme empfohlen
spätestens per 1.1.2026», Stand 1.1.2026.
<https://skos.ch/fileadmin/user_upload/skos_main/public/pdf/richtlinien/260101_Vermoegensfreibetrag.pdf>
— abgerufen 16.09.2026.

**Methode:** Die Karte enthält keine Textwerte pro Kanton, nur eine
eingefärbte Schweizer-Karte mit einer Farblegende. Die Kantons-Zuordnung
wurde daher aus den **Füllfarben** der Kantonsflächen gelesen, nicht aus
Text:

1. PDF mit `pdftoppm -r 300` verlustfrei als PPM (roh, 3000×2250 px)
   gerendert (keine erneute Kompression, keine Farbraum-Umrechnung).
2. Mit einem kleinen Python-Skript (nur Standardbibliothek, kein zusätzliches
   Paket) für jeden der 26 Kantone und für jedes der 9 Legenden-Rechtecke ein
   kleines Pixel-Raster um eine Punktkoordinate innerhalb der Fläche
   abgetastet, Text-/Rand-Pixel (nahe Schwarz/Weiss) verworfen und die
   häufigste Restfarbe (Modus) genommen.
3. Jede Kantonsfarbe gegen die 9 Legendenfarben per euklidischem
   Farbabstand zugeordnet (Distanz 0–8 bei allen 26 Kantonen — eindeutige
   Treffer, keine Grenzfälle).
4. Gegenprobe: Summe der 26 Zuordnungen ergibt exakt die Legenden-Stückzahlen
   (1+2+1+1+3+2+14+1+1 = 26) — die Zuordnung ist in sich konsistent.
5. Sichtprüfung: alle Grenzfälle (AR/AI/SG, BS/TI) zusätzlich mit
   gezoomten Kartenausschnitten von Auge bestätigt.

Gelesene Legendenfarben (RGB, aus der Karte):

| Betrag laut Karte | RGB | Anzahl Kantone |
|---|---|---|
| CHF 1'500 | (255,245,204) | 1 |
| CHF 2'000 | (255,235,153) | 2 |
| CHF 2'200 | (255,224,102) | 1 |
| CHF 2'500 | (213,240,209) | 1 |
| CHF 4'000 | (179,215,173) | 3 |
| CHF 4'000 «Erhöhung in Diskussion» | (146,208,80) | 2 |
| CHF 6'000 | (130,210,118) | 14 |
| CHF 8'000 | (75,134,66) | 1 |
| CHF 10'000 | (65,155,51) | 1 |

**Ergebnis — Kanton → Betrag laut SKOS-Karte:**

| Kanton | Betrag laut Karte | Anmerkung Karte |
|---|---|---|
| AG | CHF 1'500 | |
| SH | CHF 2'000 | |
| SO | CHF 2'000 | |
| BL | CHF 2'200 | |
| SG | CHF 2'500 | |
| NE | CHF 4'000 | |
| BE | CHF 4'000 | |
| FR | CHF 4'000 | |
| VD | CHF 4'000 | «Erhöhung in Diskussion» |
| GE | CHF 4'000 | «Erhöhung in Diskussion» |
| JU | CHF 6'000 | |
| ZH | CHF 6'000 | |
| TG | CHF 6'000 | |
| AR | CHF 6'000 | |
| AI | CHF 6'000 | |
| ZG | CHF 6'000 | |
| SZ | CHF 6'000 | |
| LU | CHF 6'000 | |
| NW | CHF 6'000 | |
| GL | CHF 6'000 | |
| OW | CHF 6'000 | |
| UR | CHF 6'000 | |
| GR | CHF 6'000 | |
| VS | CHF 6'000 | |
| BS | CHF 8'000 | |
| TI | CHF 10'000 | |

**Wichtige Einschränkung:** Die Karte zeigt pro Kanton nur **eine** Zahl,
ohne Beschriftung, ob es sich um den Betrag für Einzelpersonen, Paare oder
sonst eine Bezugsgrösse handelt. Angenommen wird — analog zur SKOS-Systematik
und zur App-Logik — dass es sich um den **Grundbetrag für Einzelpersonen**
handelt. Diese Annahme wird unten je Kanton, wo eine kantonale Quelle
vorliegt, gegengeprüft.

---

## Schritt 2 — Kantonale Prüfung

Status-Legende: ✅ kantonal belegt (amtliche Quelle mit Zahl) ·
⚠️ nur SKOS-Karte / nur indirekt-kommunal belegt, keine tragfähige amtliche
kantonale Einzelquelle gefunden · 🔍 in Arbeit.

Spalte «Art der Quelle»: **eigene Zahl** (Kanton beziffert den Freibetrag
selbst, unabhängig von SKOS) · **Verweis auf SKOS** (kantonales Recht
erklärt die SKOS-Richtlinien für verbindlich/wegleitend, ohne selbst eine
Zahl zu nennen — der Betrag kommt dann ausschliesslich aus der
SKOS-Richtlinie D.3.1 selbst, siehe Abschnitt weiter unten) · **nur
SKOS-Karte** (weder eigene Zahl noch auffindbarer Verweis; nur der
Kartenwert steht im Raum).

| Kanton | Einzel | Paar | je Kind | Max | Quelle | Art der Quelle | Status |
|---|---|---|---|---|---|---|---|
| AG | 1'500 (pro Person) | — | — | 4'500 (pro Unterstützungseinheit) | § 11 Abs. 4 SPV (SAR 851.211), Handbuch Soziales AG Ziff. 9.2 | eigene Zahl | ✅ |
| SH | 2'000 | 4'000 | nicht geregelt | nicht geregelt | Richtlinien für die Bemessung der Sozialhilfe, Ziff. D.6.1, gültig ab 1.1.2022 | eigene Zahl | ✅ |
| SO | 2'000 | 4'000 | 1'000 | 5'000 (pro Familie) | § 93 Abs. 1 Bst. j SV, Sozialhilfehandbuch SO | eigene Zahl | ✅ |
| BL | — | — | — | — | — | nur SKOS-Karte | ⚠️ nicht amtlich belegt |
| SG | 2'500 | 5'000 | 1'250 | 6'250 (pro Familie) | «Beiblatt zum KOS-Handbuch Kanton St. Gallen» in der Anwendung Stadt Wil, ab 1.1.2026 | eigene Zahl (nur kommunal/Asylsozialhilfe belegt, nicht sicher generalisierbar) | ⚠️ nur indirekt belegt |
| NE | 4'000 | 8'000 | 2'000 | 10'000 (pro Familie) | Art. 18 ANCAM (RSN 831.02), état au 1er avril 2026 | eigene Zahl | ✅ |
| BE | 4'000 | 8'000 | 2'000 | 10'000 (pro Familie) | Art. 8n SHV (BSG 860.111), zitiert in den Unterstützungsrichtlinien Sozialhilfe der Stadt Bern | eigene Zahl | ✅ |
| AI | — | — | — | — | Art. 5 Abs. 2 ShiV (GS 850.010): Standeskommission legt eigene, nicht-öffentliche Richtlinien fest | nur SKOS-Karte | ⚠️ nicht amtlich belegt |
| ZG | SKOS-Kartenwert 6'000 (Verweis) | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | § 9 SHV (BGS 861.41) | Verweis auf SKOS | ✅ (Verweisnorm belegt) |
| SZ | SKOS-Kartenwert 6'000 (Verweis) | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | § 4 Abs. 2 SRSZ 380.111 | Verweis auf SKOS | ✅ (Verweisnorm belegt) |
| LU | SKOS-Kartenwert 6'000 (Verweis) | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | § 31 Abs. 1 SHG (SRL 892) + Luzerner Handbuch 2026, Anhang zu D.3.1 | Verweis auf SKOS | ✅ (Verweisnorm belegt) |
| NW | SKOS-Kartenwert 6'000 (Verweis) | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | § 8 Abs. 1 SHV (NG 761.11, Stand 1.1.2026) | Verweis auf SKOS | ✅ (Verweisnorm belegt) |
| GL | SKOS-Kartenwert 6'000 (Verweis) | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | SHV GS VIII E/21/5 (Stand 1.3.2026) | Verweis auf SKOS | ✅ (Verweisnorm belegt) |
| OW | — | — | — | — | SHG GDB 870.1 / SHV GDB 870.11 — kein Vermögensartikel gefunden | nur SKOS-Karte | ⚠️ nicht amtlich belegt |

*(Weitere Kantone folgen in den nächsten Commits; siehe Zitate weiter unten.)*

---

## Zitate je Kanton

### AG — Aargau ✅

> «Freibeträge pro Person: CHF 1'500.—; Maximalbetrag pro Unterstützungseinheit:
> CHF 4'500.—» — «Nur Vermögen, das über den Freibetrag hinausgeht, muss, soweit
> dies möglich ist, realisiert werden.»

Quelle: Handbuch Soziales des Kantons Aargau, Kapitel 9.2 «Vermögen», mit
Verweis auf § 11 Abs. 4 SPV (Sozialhilfe- und Präventionsverordnung, SAR
851.211).
<https://www.ag.ch/de/verwaltung/dgs/gesellschaft/soziales/handbuch-soziales/9-anrechnung-von-eigenen-mitteln-(einkommen-und-vermoegen)/9-2-vermoegen>
— abgerufen 16.09.2026, in dieser Sitzung direkt gegengeprüft.

Struktur weicht von Einzel/Paar/Kind ab: AG rechnet **pro Person** (nicht nach
Einzelperson/Paar gestaffelt) mit einem Haushalts-Deckel.

### SH — Schaffhausen ✅

> «Die Freibeträge bei liquidem Vermögen betragen für Einzelpersonen
> Fr. 2'000.–, für Ehepaare oder eingetragene Paare Fr. 4'000.–.»

Quelle: Kanton Schaffhausen, Departement des Innern, «Richtlinien für die
Bemessung der Sozialhilfe gültig ab 1.1.2022», Ziffer D.6.1 «Grundsatz und
Freibeträge».
<https://sh.ch/CMS/get/file/9dd85ebc-6cb7-4bb0-bfee-d1e9de104705>
— abgerufen 16.09.2026, in dieser Sitzung direkt gegengeprüft (PDF-Volltext).
Kein Zuschlag pro Kind und kein separater Höchstbetrag in diesem Abschnitt
gefunden — im Dokument nicht geregelt, nicht als "0" misszuverstehen.

### SO — Solothurn ✅

> Vermögensfreibeträge gemäss § 93 Abs. 1 Bst. j SV: Einzelpersonen CHF 2'000,
> Ehepaare und eingetragene Partnerschaften CHF 4'000, pro minderjähriges Kind
> CHF 1'000, maximal pro Familie CHF 5'000. «Vermögen, welches die im
> konkreten Fall anwendbare Freibetragsgrenze nicht überschreitet, ist der
> unterstützten Person also unangetastet zu überlassen.»

Quelle: Sozialhilfehandbuch Kanton Solothurn, Abschnitt «Anrechnung von
Vermögen und Freibeträge», mit Verweis auf § 93 Abs. 1 Bst. j
Sozialhilfeverordnung (SV).
<https://sozialhilfehandbuch.so.ch/praxis-sozialhilfe/anrechnung-einkommen-und-vermoegen/vermoegen/anrechnung-von-vermoegen-und-freibetraege/>
— abgerufen 16.09.2026, in dieser Sitzung direkt gegengeprüft.
(Nicht verwechseln: dieselbe Quelle nennt eine andere, höhere Freibetrags-
Kategorie für Rückerstattungsfälle — 30'000/50'000/+15'000 je Kind, max.
65'000 — das ist ein anderer Tatbestand, siehe auch die analoge ZH-Regel im
App-Code.)

### BL — Basel-Landschaft ⚠️ nicht amtlich belegt

Die kantonale Sozialhilfeverordnung (SHV, SGS 850.11) und das kantonale
Handbuch waren in dieser Recherche technisch nicht auswertbar. Ein Wert von
2'200/3'400/… kursiert nur als Suchmaschinen-Zusammenfassung eines
Gemeinde-Merkblatts von 2017/18 — nicht selbst geöffnet, deshalb **nicht**
als Beleg verwendet. Nicht zu verwechseln mit der Altersregel ab 55 Jahren
(90'000/180'000 CHF), die ein anderer Freibetrag ist. **Status: nur
SKOS-Kartenwert (CHF 2'200), kantonal nicht geprüft.**

### SG — St. Gallen ⚠️ nur indirekt belegt

> «Vermögensfreibeträge (max. Fr. 6'250.00 pro Familie): Einzelpersonen
> Fr. 2'500.00, Ehepaare Fr. 5'000.00, jedes minderjährige Kind Fr. 1'250.00.»

Quelle: «Beiblatt zum KOS-Handbuch Kanton St. Gallen — Anwendung in der Stadt
Wil für Asylsuchende (N), vorläufig aufgenommene Ausländer (F) und
Schutzsuchende (S) ab 1. Januar 2026», Stadt Wil.
<https://www.stadtwil.ch/storage/a2c0535935b95a4362a501465528b04f18638dddcb1f3bbe4c029d6098974f3a>
— abgerufen 16.09.2026, in dieser Sitzung direkt per PDF-Volltext gegengeprüft.

**Wichtiger Vorbehalt, wörtlich aus dem Dokumenttitel:** Dieses Beiblatt ist
laut eigener Überschrift für **Asylsozialhilfe** (Personen mit Status N/F/S)
in der Stadt Wil formuliert, nicht ausdrücklich für die reguläre Sozialhilfe
im ganzen Kanton St. Gallen. Es gibt einen Hinweis, dass ein
Gemeinderatsbeschluss der Gemeinde Weesen dieselbe Tabelle auch auf die
reguläre Sozialhilfe anwendet — dieser Beschluss wurde in dieser Sitzung
**nicht unabhängig eingesehen**. Die Zahlen decken sich exakt mit dem
SKOS-Kartenwert (2'500), was für eine kantonsweite KOS-Praxishilfe-Vorlage
spricht, aber: **keine amtliche kantonale Quelle für die reguläre
Sozialhilfe gefunden.** Einstufung deshalb «nur indirekt belegt», nicht
«kantonal belegt».

### NE — Neuchâtel ✅

> «L'aide matérielle est en principe accordée après épuisement de la
> fortune. Il est toutefois laissé à disposition du bénéficiaire un
> montant de: a) pour une personne seule 4'000.–; b) pour un couple
> 8'000.–; c) pour chaque enfant à charge 2'000.–; mais, par famille, au
> maximum 10'000.–.»

Quelle: Art. 18 «Arrêté fixant les normes pour le calcul de l'aide
matérielle (ANCAM)», RSN 831.02, état au 1er avril 2026 (Recueil systématique
de la législation neuchâteloise).
<https://rsn.ne.ch/DATA/program/books/rsne/pdf/83102.pdf>
— abgerufen 16.09.2026, in dieser Sitzung per PDF-Volltext direkt
gegengeprüft, wörtlich bestätigt.

### BE — Bern ✅

> «Der unterstützten Person werden auf das Vermögen Vermögensfreibeträge in
> nachfolgender [Höhe zugestanden]: für Einzelpersonen Fr. 4'000.–, für
> Ehepaare Fr. 8'000.–, für jedes minderjährige Kind Fr. 2'000.– → jedoch
> max. Fr. 10'000.– pro Familie.»

Quelle: Art. 8n Verordnung vom 24.10.2001 über die öffentliche Sozialhilfe
(Sozialhilfeverordnung, BSG 860.111), zitiert und ausgeführt in den
Unterstützungsrichtlinien Sozialhilfe der Stadt Bern, Merkblatt «Vermögen».
<https://www.bern.ch/themen/gesundheit-alter-und-soziales/sozialhilfe/unterstuetzungsrichtlinien-sozialhilfe/downloads-1/downloads/vermogen-17-08-23.pdf>
— abgerufen 16.09.2026, in dieser Sitzung per PDF-Volltext direkt
gegengeprüft, wörtlich bestätigt. Direktverweis auf den kantonalen
Erlasstext (belex.sites.be.ch) steht noch aus — die städtische Publikation
zitiert Art. 8n SHV jedoch namentlich und wörtlich mit Datum/Nummer, das
genügt als kantonale Rechtsgrundlage.

### AI — Appenzell Innerrhoden ⚠️ nicht amtlich belegt

> «Die Standeskommission legt verbindliche Richtlinien für die Bemessung
> der materiellen Hilfe fest.»

Quelle: Art. 5 Abs. 2 Verordnung zum Sozialhilfegesetz (ShiV, GS 850.010).
<https://ai.clex.ch/api/de/versions/1381/pdf_file> (offizielle
Erlass-PDF, verlinkt von <https://ai.clex.ch/app/de/texts_of_law/850.010>)
— abgerufen 16.09.2026, in dieser Sitzung per PDF-Volltext direkt
gegengeprüft. Die Verordnung selbst nennt keine Frankenbeträge zum
Vermögensfreibetrag; die Bemessung liegt bei **nicht-öffentlichen**
Richtlinien der Standeskommission. **Status: nur SKOS-Kartenwert (CHF
6'000), keine amtlich zugängliche kantonale Zahl.** Für eine verbindliche
Auskunft ist eine Nachfrage beim kantonalen Sozialamt nötig.

### ZG — Zug ✅ (Verweisnorm belegt)

> «§ 9 Anwendbarkeit der SKOS-Richtlinien — Die Ausgestaltung und das
> Ausmass der Unterstützung (§§ 20 und 29 SHG) richten sich nach den
> Richtlinien der Schweizerischen Konferenz für Sozialhilfe
> (SKOS-Richtlinien). Der Regierungsrat kann ergänzende und präzisierende
> Vorschriften zu den SKOS-Richtlinien erlassen oder festlegen, dass
> bestimmte Teile nicht anwendbar sind.»

Quelle: § 9 Verordnung zum Sozialhilfegesetz (Sozialhilfeverordnung, BGS
861.41). <https://bgs.zg.ch/api/de/versions/2505/pdf_file> (offizielle
Erlass-PDF, verlinkt von <https://bgs.zg.ch/app/de/texts_of_law/861.41>)
— abgerufen 16.09.2026, in dieser Sitzung per PDF-Volltext direkt
gegengeprüft, wörtlich bestätigt. Keine eigene Abweichung beim Vermögen
gefunden — der Betrag kommt vollständig aus der SKOS-Richtlinie selbst.

### SZ — Schwyz ✅ (Verweisnorm belegt)

Quelle: § 4 Abs. 2 Vollzugsverordnung zum Sozialhilfegesetz (SRSZ
380.111): SKOS-Richtlinien sind «wegleitend, soweit … keine andere
Regelung» im kantonalen Recht besteht.
<https://www.sz.ch/public/upload/assets/32455/380_111.pdf>
— abgerufen 16.09.2026 (Fundstelle vom Recherche-Subagenten geliefert, in
dieser Sitzung nicht zusätzlich erneut geöffnet). Keine eigene Zahl zum
Vermögensfreibetrag im Verweistext.

### LU — Luzern ✅ (Verweisnorm belegt)

> «§ 31 Umfang — Die wirtschaftliche Sozialhilfe deckt das soziale
> Existenzminimum ab. Für dessen Bemessung sind die Empfehlungen der
> Schweizerischen Konferenz für Sozialhilfe (Skos-Richtlinien)
> wegleitend. Der Regierungsrat kann durch Verordnung Abweichungen von
> den Skos-Richtlinien beschliessen.»

Quelle: § 31 Abs. 1 Sozialhilfegesetz (SHG, SRL 892).
<https://srl.lu.ch/api/de/versions/4151/pdf_file> (offizielle Erlass-PDF,
verlinkt von <https://srl.lu.ch/app/de/texts_of_law/892>) — abgerufen
16.09.2026, in dieser Sitzung per PDF-Volltext direkt gegengeprüft,
wörtlich bestätigt. Ergänzend nennt das Luzerner Handbuch Sozialhilfe 2026
im Anhang zu D.3.1 «Freibetrag gemäss SKOS-RL D.3.1»
(<https://disg.lu.ch/-/media/DISG/Dokumente/Themen/Sozialhilfe/Luzerner_Handbuch_Sozialhilfe/2026_Luzerner_Handbuch_Sozialhilfe.pdf>,
vom Recherche-Subagenten geliefert, in dieser Sitzung nicht separat
gegengeprüft) — auch das Handbuch beziffert den Freibetrag nicht selbst,
sondern verweist auf D.3.1.

### NW — Nidwalden ✅ (Verweisnorm belegt)

Quelle: § 8 Abs. 1 Sozialhilfeverordnung (SHV, NG 761.11, Stand
1.1.2026), mit Anhängen 1/2.
<https://gesetze.nw.ch/app/de/texts_of_law/761.11>
— abgerufen 16.09.2026 (Fundstelle vom Recherche-Subagenten geliefert, in
dieser Sitzung nicht zusätzlich erneut geöffnet). Keine eigene Abweichung
beim Vermögen gefunden.

### GL — Glarus ✅ (Verweisnorm belegt)

Quelle: Sozialhilfeverordnung (SHV, GS VIII E/21/5, Stand 1.3.2026).
<https://gesetze.gl.ch/app/de/texts_of_law/VIII%20E%2F21%2F5>
— abgerufen 16.09.2026 (Fundstelle vom Recherche-Subagenten geliefert, in
dieser Sitzung nicht zusätzlich erneut geöffnet). Die Verordnung weicht
bei anderen Positionen von SKOS ab, nennt beim Vermögensfreibetrag aber
keine eigene Zahl — dort gilt der SKOS-Wert.

### OW — Obwalden ⚠️ nicht amtlich belegt

Sozialhilfegesetz (SHG, GDB 870.1) und Sozialhilfeverordnung (SHV, GDB
870.11) enthalten keinen Artikel zum Vermögensfreibetrag; ein separates
«Handbuch Sozialwesen OW» war nicht auffindbar. **Status: nur
SKOS-Kartenwert (CHF 6'000), keine amtlich zugängliche kantonale Zahl.**
Für eine verbindliche Auskunft ist eine Nachfrage beim kantonalen
Sozialamt nötig.

---

## Die SKOS-Empfehlung selbst (+3'000/Kind, Deckel 15'000)

*(wird ergänzt — Recherche nach der aktuellen SKOS-Richtlinie D.3.1 bzw.
ihrer aktuellen Nummerierung läuft.)*

---

## Folge für die App

*(Vollständige Zusammenfassung folgt nach Abschluss der kantonalen Prüfung.
Zwischenstand nach den ersten 7 geprüften Kantonen — App rechnet aktuell
bundesweit einheitlich mit 6'000 Einzel / 12'000 Paar / +3'000 je Kind /
Deckel 15'000:)*

| Kanton | App aktuell (Einzel/Paar/Kind/Max) | Kantonal belegt | Richtung der Abweichung |
|---|---|---|---|
| AG | 6'000 / 12'000 / +3'000 / 15'000 | 1'500 pro Person / — / — / 4'500 pro Einheit | App **deutlich zu hoch** — andere Struktur (pro Person statt Einzel/Paar) |
| SH | 6'000 / 12'000 / +3'000 / 15'000 | 2'000 / 4'000 / n.g. / n.g. | App **zu hoch** bei Einzel und Paar |
| SO | 6'000 / 12'000 / +3'000 / 15'000 | 2'000 / 4'000 / 1'000 / 5'000 | App **zu hoch** bei Einzel, Paar, Kind-Zuschlag und Deckel |
| BL | 6'000 / 12'000 / +3'000 / 15'000 | nicht belegt (Karte: 2'200) | vermutlich **zu hoch**, aber nicht kantonal geprüft |
| SG | 6'000 / 12'000 / +3'000 / 15'000 | 2'500 / 5'000 / 1'250 / 6'250 (nur indirekt belegt) | vermutlich **zu hoch**, Quelle nicht sicher generalisierbar |
| NE | 6'000 / 12'000 / +3'000 / 15'000 | 4'000 / 8'000 / 2'000 / 10'000 | App **zu hoch** bei allen vier Werten |
| BE | 6'000 / 12'000 / +3'000 / 15'000 | 4'000 / 8'000 / 2'000 / 10'000 | App **zu hoch** bei allen vier Werten |
| AI | 6'000 / 12'000 / +3'000 / 15'000 | nicht belegt (Karte: 6'000, Delegation an nicht-öffentliche Richtlinien) | unklar — kantonal nicht prüfbar |
| ZG | 6'000 / 12'000 / +3'000 / 15'000 | Verweis auf SKOS D.3.1 (Grundbetrag 6'000 laut Karte) | **Grundbetrag passt zur Karte**, Kind-Zuschlag/Deckel der App nicht durch D.3.1-Wortlaut bestätigt |
| SZ | 6'000 / 12'000 / +3'000 / 15'000 | Verweis auf SKOS D.3.1 (Grundbetrag 6'000 laut Karte) | **Grundbetrag passt zur Karte**, Kind-Zuschlag/Deckel offen |
| LU | 6'000 / 12'000 / +3'000 / 15'000 | Verweis auf SKOS D.3.1 (Grundbetrag 6'000 laut Karte) | **Grundbetrag passt zur Karte**, Kind-Zuschlag/Deckel offen |
| NW | 6'000 / 12'000 / +3'000 / 15'000 | Verweis auf SKOS D.3.1 (Grundbetrag 6'000 laut Karte) | **Grundbetrag passt zur Karte**, Kind-Zuschlag/Deckel offen |
| GL | 6'000 / 12'000 / +3'000 / 15'000 | Verweis auf SKOS D.3.1 (Grundbetrag 6'000 laut Karte) | **Grundbetrag passt zur Karte**, Kind-Zuschlag/Deckel offen |
| OW | 6'000 / 12'000 / +3'000 / 15'000 | nicht belegt (Karte: 6'000, kein Vermögensartikel gefunden) | unklar — kantonal nicht prüfbar |

Für AG/SH/SO/NE/BE gilt: nicht nur der Grundbetrag weicht ab — auch der
pauschale Kinderzuschlag (+3'000) und der Deckel (15'000) der App sind
kantonal falsch (SO/NE/BE kennen 1'000–2'000 je Kind und einen deutlich
tieferen Deckel von 4'500–10'000). Für die fünf «Verweis auf SKOS»-Kantone
(ZG, SZ, LU, NW, GL) passt der Grundbetrag der App zur SKOS-Karte (6'000) —
ob Kinderzuschlag (+3'000) und Deckel (15'000) ebenfalls korrekt sind, hängt
am Wortlaut der SKOS-Richtlinie D.3.1 selbst (siehe Abschnitt oben), der in
dieser Sitzung noch nicht gefunden wurde. AI und OW sind kantonal nicht
prüfbar (keine amtlich zugängliche Zahl).
