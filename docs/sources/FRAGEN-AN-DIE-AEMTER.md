# Offene Fragen an die kantonalen Stellen (K31, Prämienverbilligung)

*Angelegt 20.09.2026. Beim Einbau der Kantone sind Punkte aufgetaucht, die sich mit den
veröffentlichten Unterlagen nicht abschliessend klären lassen. Solange sie offen sind, zeigt
die App an diesen Stellen **keinen Betrag** oder rechnet bewusst vorsichtig. Jede Antwort
gehört danach als Zitat in `ipv-kantone-2026.md` und als Test in den Code.*

---

## 1 · SVA Zürich — das Rechenbeispiel widerspricht der eigenen Tabelle

**Wo:** Seite «Prämienverbilligung: Leistung», Abschnitt Berechnungsbeispiel.

Dort steht `CHF 5'776 − CHF 1'680 = CHF 4'096`. Nach der eigenen Regel ist die Referenzprämie
aber 70 % der regionalen Durchschnittsprämie, also 0,7 × 640 × 12 = **5'376**. Nur 5'376 erklärt
auch die publizierte Einkommensgrenze von 64'000 (5'376 ÷ 8,4 %). Dasselbe gilt für 459 → 45'900
und für 2 × 5'376 → 102'400. Drei publizierte Tabellenwerte stützen 5'376, keiner die 5'776.

**Frage:** Ist die Zahl im Beispiel ein Fehler, oder gibt es einen Grund, den wir übersehen?

**Zwei Punkte, die sich mit derselben Antwort klären lassen:**
- Welche Jahrgänge gelten für das Anspruchsjahr als «junge Erwachsene»? (§ 8 EG KVG nennt das
  Alter am Ende des Vorjahres — wir rechnen danach, die Tabellenüberschriften lesen sich anders.)
- Wird die Abzugsquote von 60 % über der Familiengrenze **je Kind** oder **je Familie**
  abgezogen? (RRB 297/2025 lässt beides zu; wir zeigen in dieser Zone bewusst keinen Betrag.)

---

## 2 · ASV Bern — zwei Gemeinden, zwei widersprüchliche Listen

**Wo:** Berechnungsschema 2026, Gemeindelisten der Prämienregionen.

- **Reutigen (BFS 767):** Das BAG führt die Gemeinde in Region 2; in der R2-Liste des
  Berechnungsschemas fehlt sie, wäre dort also Region 3. Unterschied bis **CHF 156 im Jahr** je
  erwachsene Person, CHF 79.80 je Kind. Die KKVV erklärt in Art. 10 Abs. 5 die BAG-Zuteilung für
  massgebend — dann wäre Region 2 richtig und die abgedruckte Liste unvollständig.
- **Schlosswil:** steht in der R2-Liste, hat aber weder im Ortschaftenverzeichnis noch in der
  BAG-Tabelle eine eigene BFS-Nummer (Fusion). Ohne Folge für die Rechnung, aber ein Zeichen,
  dass die Liste nicht nachgeführt ist.

**Frage:** Welche Region gilt für Reutigen 2026, und wird die Liste im Schema nachgeführt?

---

## 3 · OVAM Waadt — die Formeln stehen nur als Bild

**Wo:** RLVLAMal (BLV 832.01.1) Art. 21 Abs. 2, Formeln 1–13.

Die Parameter aus dem Arrêté 2026 sind klar lesbar, die **Formeln** dagegen stehen im
veröffentlichten Text als Grafik. Abgeschrieben ergeben sie an allen Eckpunkten genau die
publizierten Beträge, und das amtliche Beispiel der Notice (Familie, 4 Personen, RDU 76'000 →
3'216 im Jahr) geht auf den Franken auf. **Ungeprüft bleibt allein der Verlauf dazwischen**,
weil er an den Exponenten **P1 = 2,5 · R2 = 1 · P2 = 2,3** hängt und im Beispiel niemand auf
einer Kurve liegt. Ein anderer Exponent verschöbe den Betrag im mittleren Einkommensbereich um
rund CHF 9 im Monat.

**Frage:** Gibt es den Wortlaut von Art. 21 Abs. 2 in maschinenlesbarer Form — oder ein zweites
Rechenbeispiel, bei dem das massgebende Einkommen zwischen C und A liegt?

**Stand:** Waadt ist gebaut und getestet, aber **bewusst nicht eingereicht**, bis das geklärt ist
(Entscheid Stebler Studios, 20.09.2026). Der Zweig `feat/k31-ipv-vd` liegt lokal.

**Nachtrag 28.09.2026 (Port auf den Rahmen):** Das Formelbild wurde am Bild gelesen — Formeln
1–5 stimmen mit der Abschrift, die Exponenten stehen ausserhalb der geschweiften Klammer. Die
Frage nach einem zweiten Rechenbeispiel IM Innern einer Kurve bleibt, weil ein Bild keine
maschinenlesbare Quelle ist. Der Stand «bewusst nicht eingereicht» ist durch den Auftrag «alle
26 bis Oktober» (Stebler Studios, 28.09.2026) aufgehoben; VD liegt jetzt als Entwurfs-PR vor.

**Zweite Frage (neu, 28.09.2026) — Beispiel des subside spécifique:** Die Notice nennt für die
Familie mit vier Personen in Region 1 «primes de référence, soit 16'836.-». Aus art. 13 al. 2 des
Arrêté 2026 ergeben sich für RDU 76'000 aber 2 × 563 + 2 × 161 = 1'448 im Monat, also 17'376 im
Jahr. Stammt die Zahl aus einem früheren Wertsatz (Arrêté vom 1.10.2025)? Für die App ohne
Folge — sie rechnet den spezifischen Subside nicht —, aber der Hinweis stützt sich auf art. 13.

---

## 4 · SVA Aargau — die Werte 2027 stehen auf der Website, nicht im Erlass

**Wo:** Seite «Allgemeine Informationen» und Informationsblatt gegen Anhang 1 V KVGG
(SAR 837.211).

Die SVA weist heute (20.09.2026) für das **Bezugsjahr 2027** Richtprämien von 6'070 / 4'440 /
1'450 Franken und einen Einkommenssatz von 19.25 Prozent aus. Die Gesetzessammlung führt zu
SAR 837.211 aber weiterhin die Fassung vom 27.08.2025 als aktuelle Version — mit dem Anhang 1
«Berechnungselemente für die Verteilung der Prämienverbilligung **2026**» (5'830 / 4'260 /
1'380, 17,5 %), ohne künftige Fassung und ohne Änderungsdokument aus 2026. Auch das Einzel-PDF
des Handbuchs Soziales gibt es nur für 2026.

*Zur Vorgeschichte: Am 16.09.2026 standen dieselben Zahlen auf der SVA-Seite unter der
Jahresangabe «2026» — dieser Widerspruch besteht nicht mehr, die Seite ist heute in sich
stimmig. Übrig bleibt die Frage nach der Rechtsgrundlage.*

**Frage:** Wo ist der Regierungsratsbeschluss beziehungsweise der Anhang 1 für das Bezugsjahr
2027 publiziert, und wann wird er in die Systematische Sammlung aufgenommen?

**Zwei Punkte, die sich mit derselben Antwort klären lassen:**
- Gibt es zur Einkommensgrenze nach § 5 Abs. 5 KVGG («das höchste massgebende Einkommen, bis zu
  welchem Prämienverbilligung bezogen werden kann») eine publizierte Zahl je Haushaltstyp? Wir
  finden keine und nennen darum in der App bewusst keine Grenze.
- Gilt der Mindestanspruch nach § 7 Abs. 2 KVGG («mindestens 50 % der effektiven Prämie») je
  Kind und dessen eigener Prämie — so lesen wir § 4 Abs. 3/4 V KVGG — oder bezogen auf den
  Haushalt? Solange das offen ist, zeigen wir für Haushalte mit Kindern keinen Betrag.

**Stand:** AG ist für 2026 gebaut; die Werte 2027 sind bewusst **nicht** eingebaut, weil sie
nur auf der Website belegt sind. Ab 01.01.2027 zeigt die App für AG keinen Betrag mehr.

## 5 · SVA St.Gallen — Deckel auf die effektive Prämie, und zwei kleinere Punkte

**Worum es geht:** Vier Kantone begrenzen die Prämienverbilligung ausdrücklich auf die
tatsächlich fakturierte Prämie — Zürich (§ 4 Abs. 3 EG KVG), Bern (KKVV Art. 10 Abs. 1),
Aargau (§ 7 Abs. 3 KVGG) und Waadt (LVLAMal art. 16 al. 1bis). Im St. Galler
Regierungsbeschluss sGS 331.538 und in der Verordnung sGS 331.111 finden wir keine solche
Bestimmung. Wir haben beide Erlasse vollständig danach durchsucht; die Methode und die
Gegenprobe stehen in `docs/sources/ipv-kantone-2026.md`, Abschnitt SG.

**Warum es zählt:** Ohne Deckel bemisst sich die Verbilligung allein an der kantonalen
Referenzprämie. Wer in Region 1 eine günstige Prämie von CHF 280 im Monat zahlt, bekäme nach
unserer Rechnung bis CHF 6'285.60 im Jahr angezeigt — mehr als die Prämie selbst. Wir rechnen
heute ohne Deckel und sagen im Vorbehalt, dass die Referenzprämie die Bemessungsgrundlage ist
und der ausbezahlte Betrag tiefer ausfallen kann.

**Frage 1:** Wird die Prämienverbilligung im Kanton St.Gallen auf die tatsächlich fakturierte
Prämie begrenzt? Wenn ja: wo ist das geregelt — in einer Weisung, einem Kreisschreiben oder
der Vollzugspraxis?

**Frage 2:** Die Anmeldefrist. Publiziert ist «Einreichfrist bis 31. März» für einen
ganzjährigen Anspruch. Offen ist für uns: Was gilt für eine Anmeldung **nach** dem 31. März —
besteht ab dem Monat der Anmeldung ein anteiliger Anspruch? Und ab welchem Datum kann man sich
für das **folgende** Bezugsjahr anmelden?

**Frage 3:** Das Alter. Der Beschluss nennt einen Stichtag nur für die Prämienregion (Art. 2
Abs. 1, zivilrechtlicher Wohnsitz am 1. Januar), nicht für das Alter. Art. 3 unterscheidet
aber «ab dem 26. Altersjahr» und «bis zum vollendeten 25. Altersjahr». Welcher Zeitpunkt
entscheidet für eine Person, die im Bezugsjahr 26 wird? Wir zeigen für diesen Jahrgang
derzeit keinen Betrag.

**Stand:** SG ist für 2026 gebaut. Die Werte 2027 sind bewusst **nicht** eingebaut — die
Regierung legt sie nach Art. 19 Abs. 1 der Verordnung jährlich bis 15. Dezember fest, und am
20.09.2026 lag kein Beschluss vor. Ab 01.01.2027 zeigt die App für SG keinen Betrag mehr.

---

## 6 · Säule 3a — zwei Punkte, die wir nicht aus dem Erlass lesen können

*Aufgenommen 20.09.2026 nach der zweiten Fachprüfungsrunde. Betrifft AG und BE.*

**Frage 1 (SVA Aargau):** § 6 Abs. 5 KVGG i. V. m. § 5 Abs. 1 V KVGG rechnet Beiträge an die
Säule 3a nur auf, soweit sie **10 % des Nettoerwerbseinkommens übersteigen**, und nur bei
Personen **ohne Säule 2**. Unsere App erfasst zwar BVG-Felder, aber ein leeres Feld heisst
«nicht erfasst», nicht «keine zweite Säule». Wie handhaben Sie das in der Praxis, wenn die
Steuerdaten dazu nichts hergeben? Und: gilt die Schwelle auch bei Personen, die nur einen
Teil des Jahres einer Vorsorgeeinrichtung angehörten?

> Warum das zählt: rechnen wir die 3a voll auf, fällt der Anspruch bei Personen ohne Säule 2
> bis zu **34 %** zu tief aus (Nettoerwerb 30'000, 3a 6'000 → 1'017.50 statt 1'542.50). Eine
> zu tiefe Zahl hält Berechtigte vom Antrag ab — für uns derselbe Schaden wie eine zu hohe.
> Solange das offen ist, rechnen wir voll auf und sagen es im Code ausdrücklich.

**Frage 2 (ASV Bern):** KKVV Art. 6 Abs. 4 lit. i begrenzt die Aufrechnung auf das
**bundesrechtliche Maximum für Unselbständigerwerbende**. Welcher Frankenbetrag gilt dafür im
Bezugsjahr 2026, und richtet er sich nach dem Steuerjahr oder dem Bezugsjahr?

> ⟨Stand bis 23.09.2026, bleibt als Beleg stehen⟩ 🛑 Wir haben diese Zahl **nicht** eingesetzt,
> weil wir sie nicht belegen konnten: Fedlex lieferte am 20.09.2026 auf eine **erfundene** ELI
> eine byte-identische Antwort — damit war das Messgerät unbrauchbar und kein Ergebnis daraus
> gültig. Eine geratene Zahl sähe belegt aus und läge bei jeder Einzahlung über dem Maximum
> still daneben.
>
> **Nachtrag 23.09.2026 — die Zahl ist da, die Frage bleibt.** Der Frankenwert ist über zwei
> andere amtliche Quellen erhoben (ESTV-Tabelle «Höchstabzüge Säule 3a», Gegenprobe BSV-FAQ;
> `src/data/saeule3a.js`), der Wortlaut von Art. 6 Abs. 4 lit. i an der Quelle gelesen (BELEX,
> Gegenprobe mit einer erfundenen BSG-Nummer bestanden: leere Seite, nicht derselbe Text).
> **Die zweite Hälfte der Frage — Steuerjahr oder Bezugsjahr — hat das nicht beantwortet.**
> Die App rechnet seit dem 23.09. mit dem Maximum des **Bemessungsjahres** (Anspruchsjahr
> minus zwei, KKVV Art. 7 Abs. 1): für 2026 also CHF 7'056 aus dem Steuerjahr 2024, nicht
> 7'258. Begründung: Art. 6 Abs. 4 korrigiert das Reineinkommen jener Veranlagung, und
> aufgerechnet werden kann höchstens, was dort abgezogen werden durfte. **Das ist unsere
> Lesart, nicht Ihre Auskunft** — an einer Stufengrenze gemessen macht die andere Lesart
> CHF 480 im Jahr aus. Bitte bestätigen oder berichtigen.
>
> **Wie wir es bis zur Antwort halten:** Abgezogen wird erst, was ÜBER beiden Jahresmaxima
> liegt (2026 also über 7'258). Im Band zwischen den Maxima eines Bemessungs- und eines
> Anspruchsjahres kann die App nicht unterscheiden, ob jemand über das Maximum hinaus
> eingezahlt hat oder ob das Maximum seither bloss gestiegen ist — und ein Abzug braucht eine
> positive Begründung. Wer genau das gesetzliche Maximum einzahlt, bekommt so keinen Abzug;
> das war in einer ersten Fassung anders und ergab CHF 480 im Jahr zu viel.
>
> **Und eine Annahme, die wir nennen müssen:** Unser Rechenweg unterstellt, die Veranlagung
> habe die volle Einzahlung abgezogen. Das trifft für Personen OHNE 2. Säule zu. Bei einer
> Person MIT Pensionskasse hätte die Veranlagung höchstens den kleinen Höchstabzug gewährt,
> die Aufrechnung höbe ihn genau auf, und der richtige Abzug wäre null. Ob eine 2. Säule
> besteht, wissen wir nicht — es ist dieselbe fehlende Angabe wie in Frage 1.
>
> Eine dritte Lesart ist uns dabei aufgefallen und wäre uns ebenfalls wichtig: BVV 3 Art. 7
> Abs. 1 knüpft nicht an «unselbständig» an, sondern an die **Zugehörigkeit zu einer
> Vorsorgeeinrichtung**. Gilt für Angestellte **ohne** Pensionskasse (Lohn unter der
> BVG-Eintrittsschwelle) der Betrag nach lit. a oder nach lit. b?

**Stand (23.09.2026):** Die Doppelzählung der 3a (sie steckte schon im erfassten Nettoeinkommen
und wurde ein zweites Mal aufgerechnet) ist behoben. Von den beiden kantonalen Sonderregeln
**rechnet die Berner seit dem 23.09.2026** — unter dem Vorbehalt oben, der im Code als
`SAEULE_3A.bisBundesMaximum.vorbehalt` steht. Die Aargauer Regel **wirkt weiterhin nicht**: ihr
fehlt keine Zahl, sondern die Angabe, ob eine Säule 2 besteht (Frage 1). Die holt keine Auskunft
nach — das ist ein Produktentscheid.

---

## 7 · WAS Ausgleichskasse Luzern — Aufteilung, Rundung und die Kinder über der Grenze

*Aufgenommen 23.09.2026 beim Einbau von LU. Entwurf — **nicht gesendet**.*

**Worum es geht:** Formel und Zahlen 2026 stehen vollständig in der Prämienverbilligungs-
verordnung (SRL 866a) und im Gesetz (SRL 866). Das Berechnungsbeispiel der WAS rechnen wir auf
den Rappen nach (alle acht Zahlen). Vier Punkte leiten wir aber nur aus dem Beispiel ab — sie
stehen in keinem Erlass, und das Beispiel zeigt jeweils nur einen Fall.

**Frage 1 — Rundung:** «Ungerade Beträge runden wir auf.» Die Zahlen des Beispiels ergeben sich,
wenn der **Monatsbetrag je Person auf 5 Rappen** aufgerundet wird (143.51 → 143.55,
85.02 → 85.05). Ist das die Regel — oder wird auf eine andere Einheit gerundet?

**Frage 2 — Aufteilung:** Der Text sagt «anteilsmässig (im Verhältnis der Richtprämie)».
Die Zahlen des Beispiels gehen aber nur auf, wenn mit den **anrechenbaren** Prämien gewichtet
wird, also das Kind mit 20 % seiner Richtprämie (sonst 122.– statt 143.55 im Monat für die
erwachsene Person). Ist das so gemeint? Es zählt für uns, weil wir den Anteil der erwachsenen
Person auf ihre Prämie begrenzen.

**Frage 3 — Kinder über der Einkommensgrenze von § 2a:** Unter der Grenze zählt das Kind in
den anrechenbaren Prämien mit 20 %, und der feste Anteil von 80 % kommt dazu. Zählt es **über**
der Grenze mit 100 % seiner Richtprämie? Folgen hat das nur, wenn dort noch ein allgemeiner
Anspruch bleibt — bei einem Elternteil erst ab fünf Kindern. Bis zur Antwort zeigt die App in
diesem Fall keinen Betrag.

**Frage 4 — Deckel § 7 Abs. 7 SRL 866:** «Die Prämienverbilligung darf die im Kalenderjahr
geschuldeten Prämien … nicht übersteigen.» Gilt das **je Person** oder für den **Haushalt**
gesamt? Wir kennen nur die Prämie der erwachsenen Person und begrenzen deren Anteil darauf;
den Kinderanteil begrenzen wir nicht, weil die Kinderprämien nicht erfasst sind.

**Stand:** LU ist für 2026 gebaut (Entwurfs-PR, K31). Die Werte 2027 sind **nicht** eingebaut —
die WAS nennt «erst Mitte November 2026». Ab 01.01.2027 zeigt die App für LU keinen Betrag mehr.

---

## 8 · Sozialversicherungsstelle Uri — Deckel, Rundung, Aufteilung und das Alter

*Aufgenommen 28.09.2026 beim Einbau von UR. Entwurf — **nicht gesendet**.*

**Worum es geht:** Formel und Zahlen 2026 stehen im Prämienverbilligungsreglement (RB 20.2213),
in der Medienmitteilung vom 18.12.2025 und im Berechnungsformular 2026 der SVS; die App rechnet
das Formular Zelle für Zelle nach. Ein durchgerechnetes Beispiel mit Zahlen haben wir nicht
gefunden. Vier Punkte stehen weder im Reglement noch im Formular eindeutig.

~~**Frage 1 — Deckel auf die eigene Prämie:** Das Reglement begrenzt die Verbilligung nur bei
EL-Beziehenden auf die tatsächliche Prämie (Art. 4 Abs. 4). Gilt für alle anderen eine
Begrenzung, wenn die eigene Prämie (z. B. mit hoher Franchise) tiefer ist als der errechnete
Betrag? Die App deckelt heute **nicht** (wie in St.Gallen, Abschnitt 5).~~
⟨**erledigt 28.09.2026, belegt** (Fachprüfung, K1): KVV Art. 106c Abs. 5bis (SR 832.102, in Kraft
seit 01.01.2024) — der Versicherer «bezahlt der versicherten Person den Differenzbetrag innerhalb
von 60 Tagen nach der Meldung der Prämienverbilligung durch den Kanton aus. Kantonale Regelungen,
wonach die Prämie höchstens bis zu ihrem vollen Umfang verbilligt werden kann …, bleiben
vorbehalten.» Uri hat keine solche Regelung. Die Frage muss nicht gestellt werden.⟩

**Frage 2 — Rundung:** Art. 14 Abs. 3: «auf fünf Rappen zu runden». Wird kaufmännisch gerundet
(83.33 → 83.35, 83.42 → 83.40) oder immer auf? Die App rundet kaufmännisch.

**Frage 3 — Aufteilung:** Um je Person runden zu können, teilt die App den allgemeinen Anspruch
nach Art. 14 Abs. 2 im Verhältnis der **anrechenbaren** Richtprämien auf (Kind mit 20 % =
220.80); das Kinderminimum von 80 % geht ganz an das Kind. Gilt diese Aufteilung auch, wenn alle
im selben Haushalt bei **einem** Versicherer sind?

**Frage 4 — Alter:** Art. 5 nennt «Erwachsene (26 Jahre und älter)», aber keinen Stichtag. Gilt
der 1. Januar (Art. 3 Abs. 3) oder der Jahrgang, wie beim Antragsformular für die Kinder
(«Jahrgänge 2008 – 2025»)? Betroffen ist für 2026 der Jahrgang 2000; die App zeigt dort keine Zahl.

**Stand:** UR ist für 2026 gebaut (Entwurfs-PR, K31). Werte 2027 waren am 28.09.2026 nicht
publiziert; ab 01.01.2027 zeigt die App für UR keinen Betrag mehr.

---

## 9 · OCAB Neuenburg — Wahlfranchise, Nahtstellen und das revenu effectif

*Aufgenommen 28.09.2026 beim Einbau von NE. Entwurf — **nicht gesendet**.*

**Vorbemerkung:** Der am 16.09. notierte Widerspruch zwischen Kantonsseite und RSN 821.102 (ab S3)
ist geklärt — es ist der Décret RSN 821.104 vom 2.12.2025, den das OCAB-Blatt «Normes 2026»
ausdrücklich mitrechnet. Keine Frage mehr.

**Frage 1 — Wahlfranchise:** Die Beträge werden «du même taux que le rabais accordé par
l'assureur» gekürzt. Gilt der Satz der eigenen Kasse der versicherten Person (so liest sich das
Beispiel), und rundet das OCAB auf 5 Rappen (450 × (1 − 2,92 %) = 436.86 → 436.85)? Ohne den
Rabattsatz zeigt die App bei Franchise über 300 keinen Betrag.

**Frage 2 — Nahtstellen:** Die Annexe schreibt «à 22'800», die Kantonsseite «jusqu'à 22'800» und
dann «22'800 à 23'940». Gehört ein revenu déterminant von genau 22'800 zu S1 (so rechnet die App,
nach Art. 3 al. 1 «égal ou inférieur») oder zu S2?

**Frage 3 — revenu effectif:** Ist in Ziffer 5.5 der Steuererklärung der Lohn **netto** nach
Sozialabzügen (Lohnausweis Ziff. 11) enthalten? Die App setzt das Nettoeinkommen dafür ein.

**Stand:** NE ist für 2026 gebaut (Entwurfs-PR #478, K31). Werte 2027 nicht eingebaut; ab
01.01.2027 zeigt die App für NE keinen Betrag mehr.
## 21 · Amt für Sozialbeiträge Basel-Stadt — hypothetisches Einkommen, Zuschlag und eine Tabellenzelle

*Aufgenommen 28.09.2026 beim Einbau von BS (K31). Entwurf — **nicht gesendet**.*

**Worum es geht:** Tabelle und Beiträge 2026 stehen vollständig in Anhang 2 der KVO (SG 834.410),
das Einkommen im Harmonisierungsgesetz (SoHaG, SG 890.700) und seiner Verordnung (SoHaV,
SG 890.710). Das Berechnungsbeispiel des ASB (4 Personen, 62'000 → Gruppe 5) rechnen wir Zahl
für Zahl nach. Offen bleiben Punkte, die die App nur mit einer eigenen Annahme rechnen könnte.

**Frage 1 — Gruppe 09, Erwachsene mit alternativem Modell:** Anhang 2 der KVO nennt **240**, die
Beitragstabelle «Einkommensgruppen, -grenzen und IPV-Beiträge ab 1. Januar 2026» **230**. Wir
folgen der Verordnung (240 ist auch der Abstand von 30 Franken, den alle anderen Gruppen haben).
Welcher Betrag wird ausbezahlt?

**Frage 2 — hypothetisches Einkommen:** SoHaV § 24 Abs. 2 lautet: «Als hypothetisches
Erwerbseinkommen wird die Differenz (in Prozenten) zwischen der effektiven Erwerbstätigkeit und dem
in Abs. 1 genannten Mindesterwerbstätigkeitsgrad (80 bzw. 160 Prozent) angerechnet. 100 Prozent
entsprechen dabei einem jährlichen Mindesterwerbseinkommen von CHF 36'000 (netto).» Sind die
Wochenstunden erfasst, rechnet die App das Pensum als Stunden ÷ 42 und rechnet die Differenz zu
80 % an (21 Std. → 50 % → 30 % × 36'000 = 10'800). Sind sie nicht erfasst, zeigt sie unter einem
Erwerbseinkommen von 28'800 keinen Betrag (ausser über 60 oder mit einem Kind unter 16) und nennt
darüber die 80-%-Annahme bei der Zahl. Drei Rückfragen: Mit welcher Wochenstundenzahl setzen Sie
100 % an? Gibt es eine Praxis bei Vollzeit mit einem Lohn unter 28'800? Und gilt «das 60. Altersjahr
überschritten» (§ 23 lit. a) ab dem 60. oder ab dem 61. Geburtstag?
⟨korrigiert 28.09.2026 nach der Fachprüfung: hier stand «Nach SoHaV § 24 wird Alleinstehenden unter
80 % die Differenz zu 36'000 netto angerechnet» — das gab den Wortlaut falsch wieder (angerechnet
wird die Differenz in PROZENTEN, nicht bis 36'000 aufgefüllt), und die Wochenstunden kannte die
App sehr wohl.⟩

**Frage 3 — Gruppengrenzen:** § 22 Abs. 1 KVO gewährt Beiträge, wenn das Einkommen die
Leistungsgrenze «nicht übersteigt». Gilt dasselbe für die Grenzen zwischen den Gruppen — gehört
ein Einkommen von genau 23'125 (1 Person) zu Gruppe 01?

**Frage 4 — Zuschlag für alternative Modelle (§ 21 Abs. 1bis KVO):** Das ASB «kann die für den
Zuschlag zu berücksichtigenden Versicherungsmodelle von einem Mindestrabatt … abhängig machen».
Gibt es diesen Mindestrabatt 2026, und wie hoch ist er? Das Merkblatt 01.2026 nennt keinen. Die App
rechnet bei erfasstem Hausarzt-, HMO-, Telmed- oder Apothekenmodell mit Zuschlag und sagt «sofern die
Police eingereicht ist; das Amt kann einen Mindestrabatt verlangen».

**Frage 5 — Alter:** KVO und SoHaV nennen für die Altersklassen keinen Stichtag. Welcher Zeitpunkt
entscheidet für eine Person, die im Anspruchsjahr 26 wird? Wir zeigen für diesen Jahrgang derzeit
keinen Betrag.

**Stand:** BS ist für 2026 gebaut (Entwurfs-PR, K31). Die KVO-Fassung ab 01.01.2027
(Beschluss 15.09.2026) ist publiziert, trägt aber noch den Anhang 2 vom 21.10.2025 — die
Beiträge 2027 stehen aus. Ab 01.01.2027 zeigt die App für BS keinen Betrag mehr.

---

## 10 · SVA Graubünden — Selbstbehalt-Satz, Kinder-Vergleich, Deckel und Alter

**Wo:** KPVG (BR 542.100) Art. 8 Abs. 2–4; VOzKPVG (BR 542.120) Art. 17, 22; Wegleitung IPV 2026.
Ein amtliches Berechnungsbeispiel haben wir nicht gefunden; der Online-Rechner wurde bewusst nicht
mit Daten gefüttert.

**Frage 1 — Satz aufs ganze Einkommen?** «Der Selbstbehalt beträgt für anrechenbare Einkommen bis
10 000 Franken 5 Prozent, bis 20 000 Franken 6,5 Prozent …» Wir lesen: EIN Satz je Kategorie, auf
das ganze anrechenbare Einkommen (bei 40'000: 9 % × 40'000 = 3'600; bei 40'001: 10 % = 4'000.10).
Oder wird wie bei einem Steuertarif je Tranche gerechnet (bei 40'000: 2'850)? Der Unterschied
beträgt 150 / 450 / 750 Franken in den Kategorien bis 40'000 und darüber **1'150 Franken** im Jahr;
zwischen 59'160 und 70'660 (Region 1) zeigt die App «kein Anspruch», wo nach der Tranchen-Lesart
einer bestünde. ⟨korrigiert 28.09.2026 nach der Fachprüfung #467: hier stand «bis 750 Franken».⟩
Die App rechnet nach der ersten Lesart und sagt in der Anzeige, dass sie im Zweifel zu tief liegt.

**Frage 2 — Kinder: Vergleich für den Haushalt oder je Kind?** Art. 8 Abs. 4: «Zur Auszahlung
gelangt der höhere der gemäss den Absätzen 2 und 3 berechneten Beträge.» Wird der ganze
Haushaltsbetrag nach Abs. 2 mit der Summe der Kinderbeträge nach Abs. 3 verglichen — oder erhält
jedes Kind mindestens seinen Betrag nach Abs. 3, und die erwachsene Person ihren Anteil nach
Abs. 2? Beispiel Region 1, ein Kind, anrechenbares Einkommen 30'000: 4'920 gegen 5'380.33; bei
drei Kindern und 60'000 bis 2'411 Franken. Die Wegleitung 2026 («Gesamtanspruch»: «… werden die
anrechenbaren Einkommen sowie die Richtprämien aller Personen zusammengezählt») stützt eher den
Haushalt — die tiefere Zahl. Bis zur
Antwort zeigt die App für Haushalte mit Kindern bis 80'000 keinen Betrag, wo die beiden
Lesarten auseinandergehen.

**Frage 3 — Deckel:** KPVG und VOzKPVG begrenzen die Verbilligung nicht auf die tatsächlich
bezahlte Prämie. Was geschieht, wenn die eigene Prämie tiefer ist als die Verbilligung der
Richtprämie? Die App deckelt bis zur Antwort nicht (wie SG). Geprüft ist nur das kantonale Recht;
ob Bundesrecht (Auszahlung an den Versicherer, KVG Art. 65 / KVV) den Betrag an der geschuldeten
Prämie begrenzt, haben wir nicht gelesen — gehört zur Frage.
⟨Hinweis 28.09.2026 bei der Integration: Für Uri ist die bundesrechtliche Seite inzwischen belegt,
siehe Abschnitt 8, Frage 1, und `KEIN_PRAEMIENDECKEL.UR` in `src/config/kantonsModell.js` (KVV
Art. 106c Abs. 5bis: der Versicherer zahlt die Differenz aus, kantonale Deckel bleiben vorbehalten).
Für GR hier nicht selbst nachgelesen; offen bleibt, ob Graubünden einen solchen kantonalen Deckel kennt.⟩

~~**Frage 4 — Alter:** Die Wegleitung nennt «Erwachsene ab 26. Altersjahr», «junge Erwachsene
19 - 25 Jahre», «Kinder bis und mit 18. Altersjahr», aber keine Jahrgänge und keinen Stichtag.
Zählt das Alter am 1. Januar, am 31. Dezember oder der Jahrgang? Die App rechnet nur für
Personen, die das ganze Anspruchsjahr über 25 sind.~~ ⟨beantwortet 28.09.2026 aus der Quelle,
Fachprüfung #467: der Online-Rechner der SVA 2026 (`sva.gr.ch/ipv.html`) führt «junge Erwachsene
(Jahrgang 2001 - 2007)» und «Kinder (Jahrgang 2008 - 2026)». Die App rechnet jetzt nach Jahrgang.⟩

**Frage 5 — geringfügige Beträge:** Art. 11 Abs. 5 und Art. 16 Abs. 4 KPVG erlauben, geringfügige
Beträge nicht auszuzahlen. Gibt es für 2026 eine solche Grenze? In VOzKPVG und Wegleitung steht
keine; die App zeigt darum auch kleine Beträge.

**Stand:** GR ist für 2026 gebaut (Entwurfs-PR, K31). Werte 2027 lagen am 28.09.2026 nicht vor;
ab 01.01.2027 zeigt die App für GR keinen Betrag mehr.

---

## Warum überhaupt fragen

Diese App rechnet Beträge, auf die Menschen sich verlassen und die am Ende in einem Dossier für
genau diese Ämter landen. Eine Zahl, die um ein paar Franken danebenliegt, ist dort keine
Kleinigkeit — und eine Zahl, die wir nicht belegen können, zeigen wir lieber nicht.
