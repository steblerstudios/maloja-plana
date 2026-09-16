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
| ZH | 6'000 | 12'000 | 3'000 | 15'000 (pro Familie) | Sozialhilfehandbuch ZH, Ziff. 9.2.01, zitiert «SKOS-Richtlinien, Kapitel D.3.1 Abs. 4», gültig seit 1.1.2026 | eigene Zahl (deckungsgleich mit SKOS D.3.1) | ✅ |
| BS | 8'000 | 16'000 | 4'000 | 20'000 (pro Unterstützungseinheit) | Unterstützungsrichtlinien WSU Basel-Stadt, Ziff. 14 «Vermögen (SKOS-RL D.3)», gültig ab 1.1.2026 | eigene Zahl (bewusst über SKOS D.3.1 hinaus) | ✅ |
| GR | 6'000 | 12'000 | 3'000 | 15'000 (pro Familie) | Art. 5 Abs. 1 ABzUG (BR 546.270), in Kraft seit 1.2.2026 | eigene Zahl (deckungsgleich mit SKOS D.3.1) | ✅ |
| JU | 6'000 | 12'000 | 3'000 | 15'000 (pro Haushalt) | Communiqué Kanton Jura vom 30.10.2025 «Adaptation des normes dans le domaine de l'aide sociale», in Kraft seit 1.1.2026, mit Zitat aus Art. 30 der zugrundeliegenden Verordnung (RSJU 850.111.1) | eigene Zahl (deckungsgleich mit SKOS D.3.1) | ✅ (über amtliches Communiqué, konsolidierter Verordnungstext selbst nicht einsehbar) |
| TG | SKOS-Kartenwert 6'000 (Verweis) | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | § 2b Abs. 3 SHV (RB 850.11), geändert 25.11.2025, in Kraft seit 1.1.2026 | Verweis auf SKOS (TG hatte bis 31.12.2025 gar keinen Freibetrag) | ✅ (Verweisnorm belegt) |
| AR | SKOS-Kartenwert 6'000 (Verweis) | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | Art. 3 SHV (bGS 851.11), Stand 1.1.2016 | Verweis auf SKOS | ✅ (Verweisnorm belegt) |
| UR | SKOS-Kartenwert 6'000 (Verweis) | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | gemäss SKOS-Richtlinie D.3.1 — Wortlaut offen | Art. 28 Abs. 1 Sozialhilfegesetz (RB 20.3421); Antwort Regierungsrat vom 8.4.2025 auf Kleine Anfrage listet keine Abweichung beim Vermögensfreibetrag | Verweis auf SKOS | ✅ (Verweisnorm belegt, keine eigene Zahl im Gesetz) |
| VS | 6'000 | 12'000 | 3'000 | 15'000 (pro Unterstützungseinheit) | Ziff. 21.1 Directive d'application LIAS, dès le 01.01.2026 | eigene Zahl (deckungsgleich mit SKOS D.3.1) | ✅ |
| VD | 4'000 | 8'000 | 2'000 | 10'000 (pro Familie) | Art. 18 RLASV (RSV 850.051.1) — Text nennt ausdrücklich «limites de fortune prévues par la CSIAS», aber mit fest ausgeschriebenen Frankenbeträgen; Aktualität für 2026 **nicht bestätigt** (verfügbare Fassungen zeigen Stand 2008/2017, kein Beleg für eine seitherige Anpassung an die neue SKOS-Skala) | eigene Zahl (Aktualität 2026 unklar) | ⚠️ Quelle veraltet |
| GE | 4'000 | 8'000 | 2'000 | 10'000 (Familiengruppe) | Art. 3 RASLP (RSG J 4 04.01), offizielle Genfer Gesetzesdatenbank SILGENEVE | eigene Zahl (aktuell in Kraft; SKOS-Anmerkung «Erhöhung in Diskussion» — noch nicht wirksam) | ✅ |
| FR | 4'000 | 8'000 | 2'000 | 10'000 (pro Familie) | Directives d'application LASoc, Ziff. 5 «Fortune», «Version en vigueur depuis le 1er mai 2017», gestützt auf die Ordonnance «Normes LASoc» vom 2.5.2006, Art. 18 — die zugrundeliegende **Loi sur l'aide sociale von 1991** wurde per 1.1.2026 durch eine neue LASoc (9.10.2024) abgelöst; Aktualität dieser Fortune-Zahlen für 2026 **nicht bestätigt** | eigene Zahl (Aktualität 2026 unklar) | ⚠️ Quelle veraltet |
| TI | — | — | — | — | Regolamento sull'assistenza sociale (871.110) und Direttive (871.115, nur Fassung 2018 auffindbar) enthalten keine «franchigia sulla sostanza»; aktuelle Jahres-Direktive 2025/2026 nicht öffentlich erreichbar | nur SKOS-Karte | ⚠️ nicht amtlich belegt |

*(Alle 26 Kantone erfasst; SKOS-Richtlinie D.3.1 selbst siehe Abschnitt unten.)*

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

### ZH — Zürich ✅

> «7. Freibeträge — Zur Stärkung der Eigenverantwortung und zur Förderung
> des Selbsthilfewillens wird zu Beginn der Unterstützung oder wenn eine
> laufende Unterstützung abgeschlossen wird ein Vermögensfreibetrag
> zugestanden (SKOS-Richtlinien, Kapitel D.3.1 Abs. 4). Dieser beträgt
> Fr. 6'000.- für Einzelpersonen, Fr. 12'000.- für Ehepaare und
> Fr. 3'000.- für jedes minderjährige Kind, jedoch maximal Fr. 15'000.-
> pro Familie.»

Quelle: Sozialhilfehandbuch Kanton Zürich, Ziff. 9.2.01 «Anrechnung von
Vermögen und Freibeträge».
<https://www.zh.ch/de/soziales/sozialhilfe/sozialhilfehandbuch/flexdata-definition/9-einkommen--vermoegen-wsh/9-2-vermoegen/9-2-01-anrechnung-von-vermoegen-und-freibetraege.html>
— abgerufen 16.09.2026, in dieser Sitzung direkt aus dem HTML-Text
gegengeprüft (nicht nur über die WebFetch-Zusammenfassung, sondern im
rohen Seitentext gefunden). **Wichtig für Schritt 3:** ZH zitiert hier
ausdrücklich «SKOS-Richtlinien, Kapitel D.3.1 Abs. 4» als Rechtsgrundlage
für exakt die App-Formel — siehe Abschnitt weiter unten.

### BS — Basel-Stadt ✅

> «14 Vermögen (SKOS-RL D.3) — Es gelten die folgenden
> Vermögensfreibeträge: a. Fr. 8'000.00 für Einzelpersonen b. Fr. 16'000.00
> für Ehepaare c. Fr. 4'000.00 für jedes minderjährige Kind d. jedoch
> maximal Fr. 20'000.00 pro Unterstützungseinheit»

Quelle: Unterstützungsrichtlinien des Departements für Wirtschaft, Soziales
und Umwelt (WSU) Basel-Stadt, Ziff. 14, gültig ab 1.1.2026, Rechtsgrundlage
§ 7 Abs. 3 SHG (SGS 890.100).
<https://media.bs.ch/original_file/8ed016dbcae7b24e4bb7e4d333c71072442b2d80/unterstuetzungsrichtlinien-wsu-2026.pdf>
— abgerufen 16.09.2026, in dieser Sitzung per PDF-Volltext direkt
gegengeprüft, wörtlich bestätigt. BS bezeichnet die eigene Regelung
ausdrücklich als Bezug auf «SKOS-RL D.3», verdoppelt aber bewusst alle vier
SKOS-Werte (bekannt als dauerhaft gemachte Corona-Erhöhung).

### GR — Graubünden ✅

> «Art. 5 Vermögensfreibetrag — Folgende Vermögensbeträge sind bei der
> Berechnung der Unterstützungsbedürftigkeit und der Bemessung der
> Unterstützung nicht anzurechnen: a) Einzelpersonen: Fr. 6000.– b)
> Ehepaare: Fr. 12'000.– c) Minderjährige Kinder: Fr. 3000.– d) Maximal
> pro Familie: Fr. 15'000.–»

Quelle: Art. 5 Abs. 1 Ausführungsbestimmungen zum kantonalen
Unterstützungsgesetz (ABzUG, BR 546.270), geändert 19.01.2026, in Kraft
seit 1.2.2026.
<https://www.gr-lex.gr.ch/api/de/versions/3625/pdf_file> (offizielle
Erlass-PDF, verlinkt von <https://www.gr-lex.gr.ch/app/de/texts_of_law/546.270>)
— abgerufen 16.09.2026, in dieser Sitzung per PDF-Volltext direkt
gegengeprüft, wörtlich bestätigt. GR übernimmt die SKOS-D.3.1-Werte exakt
und zeitgleich mit deren Inkrafttreten als eigene, kodifizierte Zahl.

### JU — Jura ✅ (über amtliches Communiqué)

> «L'adaptation des franchises sur la fortune s'inscrit dans un objectif
> de prévention des risques de précarité et de surendettement des
> ménages» — mit den Beträgen «4'000 à 6'000 francs» (Einzelperson),
> «8'000 à 12'000 francs» (Paar), «2'000 à 3'000 francs» (je Kind), «au
> maximum, 15'000 francs par ménage».

Quelle: Amtliches Communiqué der Republik und des Kantons Jura vom
30.10.2025, «Adaptation des normes dans le domaine de l'aide sociale»,
Massnahme in Kraft seit 1.1.2026, mit Verweis auf Art. 30 «Arrêté fixant
les normes applicables en matière d'aide sociale» (RSJU 850.111.1).
<https://www.jura.ch/fr/Autorites/Administration/CHA/SIC/Centre-medias/Communiques-2025/Adaptation-des-normes-dans-le-domaine-de-l-aide-sociale.html>
— abgerufen 16.09.2026, in dieser Sitzung direkt gegengeprüft. Die
konsolidierte 2026er-Fassung der Verordnung selbst (RSJU 850.111.1) konnte
in dieser Sitzung nicht geöffnet werden (Textextraktion nicht möglich) —
das amtliche Regierungscommuniqué mit wörtlichem Zitat der alten und
neuen Beträge gilt hier als amtliche Quelle, ist aber nicht die
konsolidierte Gesetzesfassung selbst.

### TG — Thurgau ✅ (Verweisnorm belegt)

> «§ 2b Abs. 3 — … Bei Unterstützungsbeginn gelten die
> Vermögensfreibeträge gemäss den SKOS-Richtlinien.»

Quelle: § 2b Abs. 3 Sozialhilfeverordnung (SHV, RB 850.11), geändert
25.11.2025, in Kraft seit 1.1.2026.
<https://www.rechtsbuch.tg.ch/api/de/versions/3020/pdf_file> (offizielle
Erlass-PDF, verlinkt von <https://www.rechtsbuch.tg.ch/app/de/texts_of_law/850.11>)
— abgerufen 16.09.2026, in dieser Sitzung per PDF-Volltext direkt
gegengeprüft, wörtlich bestätigt. Bemerkenswert: die bis 31.12.2025
gültige Fassung sah **keinen** Vermögensfreibetrag vor (Vermögen wurde
voll angerechnet) — TG führte den Freibetrag erst per 1.1.2026 ein, als
dynamischen Verweis ohne eigene Frankenbeträge. Bestätigt auch durch den
offiziellen SKOS-Artikel «Vermögensfreibetrag auch im Kanton Thurgau»
(<https://skos.ch/themen/sozialhilfe/news/artikel/freibetrag-auch-im-kanton-thurgau>,
abgerufen 16.09.2026): TG war der letzte Kanton ohne eigenen
Vermögensfreibetrag.

### AR — Appenzell Ausserrhoden ✅ (Verweisnorm belegt)

> «Art. 3 Individuelle Sozialhilfe a) Bemessung der wirtschaftlichen
> Sozialhilfe (Art. 15 Abs. 2 SHG) — Die von der Schweizerischen
> Konferenz für Sozialhilfe erlassenen Richtlinien für die Ausgestaltung
> und Bemessung der Sozialhilfe (SKOS-Richtlinien) sind verbindlich,
> soweit das Gesetz oder diese Verordnung keine andere Regelung vorsehen
> oder besondere Umstände ein Abweichen rechtfertigen.»

Quelle: Art. 3 Sozialhilfeverordnung (SHV, bGS 851.11), Stand 1.1.2016.
<https://ar.clex.ch/api/de/versions/1068/pdf_file> (offizielle
Erlass-PDF, verlinkt von <https://ar.clex.ch/app/de/texts_of_law/851.11>)
— abgerufen 16.09.2026, in dieser Sitzung per PDF-Volltext direkt
gegengeprüft, wörtlich bestätigt. Keine eigene Zahl im Verordnungstext.

### UR — Uri ✅ (Verweisnorm belegt, keine eigene Zahl)

Quelle: Art. 28 Abs. 1 Sozialhilfegesetz (RB 20.3421, Stand 11.11.2023):
«Für dessen Bemessung erlässt der Regierungsrat nach Anhören der
Sozialhilfebehörden Richtlinien. Er orientiert sich dabei an den
Empfehlungen der Schweizerischen Konferenz für Sozialhilfe.» Die Antwort
des Regierungsrats vom 8.4.2025 auf eine Kleine Anfrage (Nr. 2025-212)
listet die bestehenden Abweichungen von den SKOS-Richtlinien auf
(Einkommensfreibetrag, Integrationszulage) — der Vermögensfreibetrag
erscheint dort **nicht** als Abweichung, was auf unveränderte Übernahme
des SKOS-Werts hindeutet. In dieser Sitzung nicht zusätzlich erneut
geöffnet (Fundstelle vom Recherche-Subagenten geliefert), aber methodisch
plausibel und mit den übrigen «Verweis auf SKOS»-Kantonen konsistent.
**Kein eigener kodifizierter Betrag**, nur der SKOS-Kartenwert (6'000) via
Delegationsnorm.

### VS — Wallis/Valais ✅

> «21.1 Franchise sur la fortune — Dans le but d'encourager la
> responsabilité individuelle, une franchise sur la fortune est accordée
> au début de l'aide, à raison de : Fr. 6'000.- pour une personne seule ;
> Fr. 12'000.- pour un couple ; Fr. 3'000.- par enfant dans l'unité
> d'assistance ; mais au maximum Fr. 15'000.- par unité d'assistance.»

Quelle: Ziff. 21.1 Directive d'application de la Loi sur l'intégration et
l'aide sociale (LIAS), dès le 01.01.2026, Département de la santé, des
affaires sociales et de la culture, Kanton Wallis.
<https://www.vs.ch/documents/25959312/25960845/Directive+d%E2%80%99application+de+la+Loi+sur+l%E2%80%99int%C3%A9gration+et+l%E2%80%99aide+sociale+(d%C3%A8s+le+01.01.2026).pdf>
— abgerufen 16.09.2026, in dieser Sitzung per PDF-Volltext direkt
gegengeprüft, wörtlich bestätigt. Die Vorgänger-Fassung (dès le 1.7.2021)
zeigte an derselben Stelle noch 4'000/8'000/2'000/max. 10'000 — die
Erhöhung auf die neuen SKOS-D.3.1-Werte ist per 1.1.2026 in Kraft
getreten. Wer die alte 2021-Fassung zitiert, hat einen veralteten Stand.

### VD — Waadt/Vaud ⚠️ Quelle veraltet, Aktualität 2026 nicht bestätigt

> «Art. 18 Limites de fortune (Art. 32 LASV) — Le RI peut être accordé
> lorsque le patrimoine du requérant, de son conjoint, de son partenaire
> enregistré ou concubin comprend des actifs n'excédant pas les limites
> de fortune prévues par la Conférence suisse des institutions d'action
> sociale (CSIAS), savoir : – Fr. 4'000.- pour une personne seule – Fr.
> 8'000.- pour un couple marié ou concubins. Ces limites sont augmentées
> de Fr. 2'000.-- par enfant à charge, mais ne peuvent pas dépasser
> Fr. 10'000.-- par famille.»

Quelle: Art. 18 Règlement d'application de la loi du 2 décembre 2003 sur
l'action sociale vaudoise (RLASV, RSV 850.051.1), Erlasstext über
<https://www.lexfind.ch/tolv/122897/fr> (offizielles nationales
Erlass-Register LexFind) — abgerufen 16.09.2026, in dieser Sitzung per
PDF-Volltext direkt gegengeprüft, wörtlich bestätigt. **Vorbehalt:** die
abgerufene Fassung trägt den Stempel «Etat au 01.02.2008»; ein aktuelleres
amtliches Verfahrenshandbuch («Normes RI», Version 16, Stand 1.2.2025)
verweist für Vermögensfragen weiterhin nur auf «le barème RLASV», ohne
selbst neue Zahlen zu nennen. Es gibt **keinen Beleg**, dass Art. 18 RLASV
seither an die neue SKOS-D.3.1-Skala (6'000/12'000/+3'000/15'000)
angepasst wurde. Das deckt sich mit der SKOS-Kartenanmerkung «Erhöhung in
Diskussion» für VD: die Erhöhung ist demnach **noch nicht in Kraft**.

### GE — Genf/Genève ✅

> «Art. 3 Principes — Les limites de fortune au sens des articles 31,
> alinéa 1, et 35, alinéa 5, de la loi permettant de bénéficier des
> prestations d'aide financière sont les suivantes : a) 4 000 francs pour
> une personne seule majeure ; b) 8 000 francs pour un couple ; c) 2 000
> francs pour chaque enfant à charge. Le total de la fortune ne peut en
> aucun cas dépasser 10 000 francs pour l'ensemble du groupe familial.»

Quelle: Art. 3 Règlement d'application de la loi sur l'aide sociale et la
lutte contre la précarité (RASLP, RSG J 4 04.01).
<https://silgeneve.ch/legis/program/books/RSG/pdf/rsg_j4_04p01.pdf>
(offizielle Genfer Gesetzesdatenbank SILGENEVE) — abgerufen 16.09.2026, in
dieser Sitzung per PDF-Volltext direkt gegengeprüft, wörtlich bestätigt.
Dies ist die aktuell in Kraft stehende Fassung; die auf der SKOS-Karte
vermerkte «Erhöhung in Diskussion» ist damit noch nicht umgesetzt — GE
liegt weiterhin bei den alten (tieferen) Werten.

### FR — Freiburg/Fribourg ⚠️ Quelle veraltet, Aktualität 2026 nicht bestätigt

> «5. Fortune (cf. art. 13 ordonnance) — Montants de fortune laissés à la
> libre disposition des bénéficiaires au début de l'assistance ou
> lorsqu'une assistance en cours peut être supprimée: a. Pour une
> personne seule Fr. 4000.- b. Pour un couple Fr. 8000.- c. Pour chaque
> enfant mineur Fr. 2000.- Mais au maximum par famille Fr. 10'000.-»

Quelle: Directives d'application des normes LASoc, «Version en vigueur
depuis le 1er mai 2017», gestützt auf die Ordonnance «Normes LASoc» vom
2.5.2006 (Art. 18 al. 1, ROF 2006_034) und die «Loi sur l'aide sociale du
14 novembre 1991».
<https://www.fr.ch/sites/default/files/contens/sasoc/_www/files/pdf92/6_fr_directives_d_application.pdf>
— abgerufen 16.09.2026, in dieser Sitzung als gescanntes PDF (Erstellung
Mai 2017) visuell direkt gegengeprüft, wörtlich bestätigt. **Vorbehalt:**
diese Direktive stützt sich auf die **Loi sur l'aide sociale von 1991**,
die laut mehreren Quellen per 1.1.2026 durch eine neue LASoc (verabschiedet
9.10.2024) abgelöst wurde. Eine aktualisierte 2026er-Fassung dieser
Direktive mit eigenen Fortune-Zahlen wurde in dieser Sitzung **nicht**
gefunden. Status deshalb «Quelle veraltet», nicht «kantonal belegt für
2026».

### TI — Tessin/Ticino ⚠️ nicht amtlich belegt

Weder das Regolamento sull'assistenza sociale (871.110, Stand 3.3.2023)
noch die auffindbare Fassung der Direttive riguardanti gli importi delle
prestazioni assistenziali (871.115, nur Version 2018 auffindbar) enthalten
den Begriff «franchigia sulla sostanza» bzw. eine entsprechende
Vermögensfreibetrags-Regel für die reguläre Sozialhilfe. Die Legge
sull'armonizzazione e il coordinamento delle prestazioni sociali (LAPS)
regelt einen andersartigen Mechanismus (1/15 des Vermögens über
50'000/100'000 CHF) für EL-artige Ergänzungsleistungen — das ist **nicht**
dieselbe Kennzahl. Eine aktuelle Jahres-Direktive 2025/2026 mit der Zahl
war in dieser Sitzung nicht öffentlich erreichbar (mehrere ti.ch-Pfade
mit Serverfehlern). **Status: nur SKOS-Kartenwert (CHF 10'000), kantonal
nicht amtlich belegt.**

---

## Die SKOS-Empfehlung selbst (+3'000/Kind, Deckel 15'000)

**Direkter Zugriff auf die SKOS-Primärquelle nicht gelungen:** Das
Online-Portal der SKOS-Richtlinien (`rl.skos.ch`) ist eine
JavaScript-Anwendung mit Login-Funktion, die sich in dieser Sitzung weder
über WebFetch noch über `curl` als Text auslesen liess (nur das leere
HTML-Gerüst kam zurück). Mehrere aus Suchergebnissen abgeleitete
PDF-Direktlinks auf `skos.ch/fileadmin/…` (u. a. zur Synopse der 2.
Revisionsetappe und zum Erläuternden Bericht) ergaben bei direktem Abruf
**HTTP 404** — die Dateien liegen unter diesen Pfaden aktuell nicht (mehr)
vor. Es wird deshalb **nicht behauptet**, den SKOS-Originaltext D.3.1
selbst gelesen zu haben.

**Was stattdessen vorliegt — vier unabhängige, amtliche Belege, die
denselben Wortlaut und dieselben vier Zahlen zitieren:**

1. **Kanton Zürich**, Sozialhilfehandbuch Ziff. 9.2.01 (in dieser Sitzung
   direkt aus dem Seitentext gelesen, siehe Zitat oben): zitiert
   ausdrücklich «SKOS-Richtlinien, Kapitel D.3.1 Abs. 4» und gibt exakt
   Fr. 6'000.-/12'000.-/3'000.-/15'000.- wieder.
2. **Kanton Graubünden**, Art. 5 ABzUG (in dieser Sitzung per PDF-Volltext
   gelesen): identische vier Zahlen, in Kraft seit 1.2.2026, zeitgleich
   mit der SKOS-Revision.
3. **Kanton Wallis**, Ziff. 21.1 Directive LIAS (in dieser Sitzung per
   PDF-Volltext gelesen): identische vier Zahlen, dès le 1.1.2026,
   ausdrücklich als Anhebung gegenüber der Vorgänger-Fassung (die noch
   4'000/8'000/2'000/10'000 zeigte) dokumentiert.
4. **SKOS selbst**, offizieller Website-Artikel «Vermögensfreibetrag auch
   im Kanton Thurgau»
   (<https://skos.ch/themen/sozialhilfe/news/artikel/freibetrag-auch-im-kanton-thurgau>,
   abgerufen 16.09.2026, in dieser Sitzung direkt gelesen): «Für
   Einzelpersonen beträgt er neu 6000 Franken und für Paare auf 12'000
   Franken.» Der Artikel nennt zusätzlich den Hintergrund: der bisherige
   Freibetrag von Fr. 4'000.– (Einzelperson) stammte von 1989 und wurde
   nach 36 Jahren erstmals wieder angepasst.
5. Ergänzend, als strukturelle (nicht zahlenmässige) Bestätigung: **Basel-Stadt**
   bezeichnet seine eigene, bewusst verdoppelte Regelung ausdrücklich als
   «Vermögen (SKOS-RL D.3)» im selben a./b./c./d.-Format mit dem
   charakteristischen Zusatz «jedoch maximal … pro Unterstützungseinheit»
   — dieselbe Struktur wie ZH/GR/VS, nur mit anderen Faktoren.

**Einschätzung:** Mit vier unabhängigen amtlichen Quellen, die
wortwörtlich denselben Vier-Zahlen-Satz (6'000 / 12'000 / +3'000 je Kind /
Deckel 15'000, gültig ab 1.1.2026) derselben Rechtsgrundlage («SKOS-RL
D.3» bzw. «D.3.1») zuschreiben, ist mit sehr hoher Wahrscheinlichkeit
belegt: **die App-Formel entspricht exakt der aktuellen SKOS-Richtlinie
D.3.1.** Das ist aber eine Ableitung aus mehrfach übereinstimmenden
Sekundärzitaten, **nicht** eine direkte Lektüre des SKOS-Originaltextes.
Wer das lückenlos schliessen will, müsste sich beim SKOS-Richtlinien-Portal
(`rl.skos.ch`) registrieren oder SKOS direkt um die PDF-Fassung von
D.3.1 bitten.

**Wichtiger Nebenbefund** (aus dem VS-Directive-Text, nicht von der App
verwendet): Es gibt eine **zweite, separate** Vermögensfreibetrags-Kategorie
für Genugtuungs-/Integritätsentschädigungsleistungen bzw.
Rückerstattungsfälle mit deutlich höheren Beträgen (in mehreren Kantonen
30'000/50'000/+15'000 je Kind, Deckel 65'000 o. ä., in ZH als separate
Funktion `rueckerstattungsFreibetrag` bereits im Code abgebildet). Diese
nicht mit dem allgemeinen Vermögensfreibetrag verwechseln.

---

## Folge für die App

**Kernbefund:** Die App-Formel selbst (`vermoegensfreibetragSKOS` in
`src/data/sozialhilfeRechner.js`: 6'000 Einzel / 12'000 Paar / +3'000 je
Kind / Deckel 15'000) ist **nicht erfunden** — sie entspricht mit hoher
Wahrscheinlichkeit wörtlich der aktuellen SKOS-Richtlinie D.3.1 (gültig ab
1.1.2026, siehe Abschnitt oben). Der Fehler der App liegt darin, dass sie
diese **eine** Zahl **für alle 26 Kantone gleich** anwendet, obwohl
mindestens 9 Kantone amtlich **eigene, abweichende** Werte haben und bei
2 weiteren die Aktualität der gefundenen Quelle für 2026 nicht gesichert
ist.

| Kanton | App aktuell (Einzel/Paar/Kind/Max) | Kantonal belegt (Einzel/Paar/Kind/Max) | Art der Quelle | Richtung der Abweichung |
|---|---|---|---|---|
| AG | 6'000/12'000/+3'000/15'000 | 1'500 pro Person / — / — / 4'500 pro Einheit | eigene Zahl | App **deutlich zu hoch**, andere Struktur (pro Person statt Einzel/Paar) |
| SH | 6'000/12'000/+3'000/15'000 | 2'000/4'000/n.g./n.g. | eigene Zahl | App **zu hoch** bei Einzel und Paar |
| SO | 6'000/12'000/+3'000/15'000 | 2'000/4'000/1'000/5'000 | eigene Zahl | App **zu hoch** bei allen vier Werten |
| BL | 6'000/12'000/+3'000/15'000 | nicht belegt (Karte: 2'200) | nur SKOS-Karte | vermutlich **zu hoch**, kantonal nicht geprüft |
| SG | 6'000/12'000/+3'000/15'000 | 2'500/5'000/1'250/6'250 (nur indirekt belegt) | eigene Zahl (unsicher generalisierbar) | vermutlich **zu hoch** |
| NE | 6'000/12'000/+3'000/15'000 | 4'000/8'000/2'000/10'000 | eigene Zahl | App **zu hoch** bei allen vier Werten |
| BE | 6'000/12'000/+3'000/15'000 | 4'000/8'000/2'000/10'000 | eigene Zahl | App **zu hoch** bei allen vier Werten |
| AI | 6'000/12'000/+3'000/15'000 | nicht belegt (Delegation an nicht-öffentliche Richtlinien) | nur SKOS-Karte | unklar — kantonal nicht prüfbar |
| ZG | 6'000/12'000/+3'000/15'000 | 6'000/12'000/+3'000/15'000 (via Verweis auf SKOS D.3.1) | Verweis auf SKOS | **App stimmt** (mit der Unsicherheit aus Abschnitt «SKOS-Empfehlung») |
| SZ | 6'000/12'000/+3'000/15'000 | dito | Verweis auf SKOS | **App stimmt** |
| LU | 6'000/12'000/+3'000/15'000 | dito | Verweis auf SKOS | **App stimmt** |
| NW | 6'000/12'000/+3'000/15'000 | dito | Verweis auf SKOS | **App stimmt** |
| GL | 6'000/12'000/+3'000/15'000 | dito | Verweis auf SKOS | **App stimmt** |
| OW | 6'000/12'000/+3'000/15'000 | nicht belegt (kein Vermögensartikel gefunden) | nur SKOS-Karte | unklar — kantonal nicht prüfbar |
| ZH | 6'000/12'000/+3'000/15'000 | 6'000/12'000/3'000/15'000 (eigene Zahl, deckt sich mit D.3.1) | eigene Zahl | **App stimmt** — einziger Kanton mit eigener, exakt zitierter Zahl |
| BS | 6'000/12'000/+3'000/15'000 | 8'000/16'000/4'000/20'000 | eigene Zahl | App **zu tief** bei allen vier Werten (BS bewusst über SKOS) |
| GR | 6'000/12'000/+3'000/15'000 | 6'000/12'000/3'000/15'000 | eigene Zahl | **App stimmt** |
| JU | 6'000/12'000/+3'000/15'000 | 6'000/12'000/3'000/15'000 (seit 1.1.2026, vorher 4'000/8'000/2'000/10'000) | eigene Zahl | **App stimmt** (erst seit 1.1.2026) |
| TG | 6'000/12'000/+3'000/15'000 | Verweis auf SKOS (vor 1.1.2026: gar kein Freibetrag) | Verweis auf SKOS | **App stimmt** (erst seit 1.1.2026) |
| AR | 6'000/12'000/+3'000/15'000 | Verweis auf SKOS | Verweis auf SKOS | **App stimmt** |
| UR | 6'000/12'000/+3'000/15'000 | Verweis auf SKOS (keine Abweichung dokumentiert) | Verweis auf SKOS | **App stimmt vermutlich** |
| VS | 6'000/12'000/+3'000/15'000 | 6'000/12'000/3'000/15'000 (seit 1.1.2026, vorher 4'000/8'000/2'000/10'000) | eigene Zahl | **App stimmt** (erst seit 1.1.2026) |
| VD | 6'000/12'000/+3'000/15'000 | 4'000/8'000/2'000/10'000 (Aktualität 2026 unklar) | eigene Zahl (Quelle veraltet) | App **vermutlich zu hoch**, aber Erhöhung «in Diskussion» laut Karte |
| GE | 6'000/12'000/+3'000/15'000 | 4'000/8'000/2'000/10'000 | eigene Zahl | App **zu hoch** bei allen vier Werten; Erhöhung «in Diskussion» laut Karte noch nicht in Kraft |
| FR | 6'000/12'000/+3'000/15'000 | 4'000/8'000/2'000/10'000 (Aktualität 2026 unklar) | eigene Zahl (Quelle veraltet) | App **vermutlich zu hoch**, Quelle stammt von vor der LASoc-Reform 2026 |
| TI | 6'000/12'000/+3'000/15'000 | nicht belegt (Karte: 10'000) | nur SKOS-Karte | vermutlich **zu tief**, kantonal nicht geprüft |

**Zusammenfassung:**

- **9 Kantone mit eigener Zahl unter dem App-Wert:** AG, SH, SO, NE, BE
  (kantonal fest belegt) sowie SG (indirekt), BL/OW/AI (nicht amtlich
  belegt, Kartenwert deutlich tiefer als App) — für diese ist die
  App-Zahl **zu hoch**, oft auch bei Kinderzuschlag und Deckel.
- **1 Kanton mit eigener Zahl über dem App-Wert:** BS (8'000/16'000/
  4'000/20'000) — die App ist hier **zu tief**.
- **2 Kantone mit eigener Zahl, deren Aktualität für 2026 unklar ist:**
  VD und FR — beide stützen sich auf Quellen von 2008/2017 bzw. 2017, die
  jeweils auf inzwischen möglicherweise abgelösten Gesetzen beruhen. Die
  gefundenen Zahlen (4'000/8'000/2'000/10'000) könnten für 2026 überholt
  sein — hier ist eine Nachfrage bei den kantonalen Stellen (Fribourg
  SASoc, Vaud DGCS) nötig, bevor man sie in die App übernimmt.
- **1 Kanton mit eigener, aktueller Zahl über dem alten Stand, aber
  identisch mit dem App-Wert:** GE — die App trifft hier zufällig den
  *neuen* SKOS-Wert, nicht den *aktuell in Genf geltenden* (4'000/8'000/
  2'000/10'000). **Das ist eine Falle:** GE weicht real ab, obwohl die
  Differenz in der Tabelle wie bei den anderen 4'000er-Kantonen aussieht.
- **10 Kantone, bei denen die App-Zahl mit hoher Wahrscheinlichkeit
  korrekt ist**, weil sie entweder per Verweisnorm direkt an SKOS
  gekoppelt sind (ZG, SZ, LU, NW, GL, TG, AR, UR) oder ihre eigene Zahl
  per 1.1.2026 exakt auf die neue SKOS-Skala gehoben haben (ZH, GR, JU,
  VS — 4 Kantone, in der Tabelle oben mitgezählt).
- **3 Kantone kantonal nicht amtlich belegbar:** AI, OW, TI — hier bleibt
  nur der SKOS-Kartenwert; für eine belastbare App-Aussage ist eine
  Anfrage beim jeweiligen kantonalen Sozialamt nötig.

**Für eine Korrektur der App wichtigste Erkenntnis:** `vermoegensfreibetragSKOS`
dürfte nicht mehr als einzige, bundesweit einheitliche Funktion bestehen
bleiben. Sie müsste mindestens die 9+ Kantone mit eigener, tieferer Zahl
(AG, SH, SO, NE, BE als sicher belegt) als Sonderfall abbilden, dazu BS als
Sonderfall mit höherer Zahl, und GE/VD/FR mit besonderer Vorsicht
(Aktualität unsicher). Für die Kantone mit Verweisnorm oder frisch
angeglichener eigener Zahl (ZG, SZ, LU, NW, GL, TG, AR, UR, ZH, GR, JU,
VS) bleibt der heutige App-Wert die richtige Wahl.
