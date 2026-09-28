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

---

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

## 11 · Amt für Gesundheit Thurgau — wo findet eine Person ihre «einfache Steuer zu 100 %»?

**Wo:** TG KVV (RB 832.10) § 14; Merkblatt «Information zur Prämienverbilligung 2026».

Der Kanton knüpft die Prämienverbilligung an die einfache satzbestimmende Steuer zu 100 % per
1. Januar (provisorische Steuerdaten des Vorjahres), nicht an das Einkommen. Die App kennt diese
Zahl nicht und zeigt darum keinen Betrag, sondern die Ansätze.

**Frage 1:** Auf welchem Dokument steht diese Zahl für die versicherte Person (provisorische
Steuerrechnung, Veranlagungsverfügung, Steuerportal)? Dann könnte die App gezielt danach fragen.

**Frage 2:** Junge Erwachsene, die sich **nicht** in Ausbildung befinden: gelten für sie die
Kategorien A–C wie für Erwachsene?

**Stand:** TG ist für 2026 belegt und gebaut, zeigt bewusst keine Zahl (Entwurfs-PR, K31).

---

## 12 · Caisse de compensation du canton de Fribourg (ECAS) — Rundung des Abstands, Rundung des Betrags, Kinder mit 18

*Aufgenommen 28.09.2026 beim Einbau von FR. Entwurf — **nicht gesendet**. Nummer 12 (Integration 28.09.2026: 8 UR, 9 NE, 10 GR, 11 TG; zuerst als 8, dann 9 notiert).*

**Worum es geht:** Grenzen, Stufentabelle und Durchschnittsprämien 2026 stehen vollständig in der
ORP (RSF 842.1.13, Art. 3, 5, 6, Annexe 1) und im Mémento 2026. Das Rechenbeispiel des Mémentos
(Ehepaar + 2 Kinder, 62'000 gegen 93'000 → 33.33 % → 35.71 % / 80 %) rechnen wir nach. Drei
Punkte stehen in keiner der Unterlagen:

**Question 1 — arrondi de l'écart:** La tabelle de l'annexe 1 progresse par centièmes de pour-cent
(«de 0,01 % jusqu'à 1,02 %», «de 1,03 % jusqu'à 2,03 %» …) et l'exemple du mémento indique
«33.33%». Comment l'écart est-il arrondi avant d'appliquer la tabelle — au centième le plus proche
ou par troncature ? (Wir runden kaufmännisch; der Unterschied ist höchstens eine Stufe, rund
CHF 74 im Jahr in Region 1, in einem Band von wenigen Franken Einkommen.)
Und: un revenu déterminant inférieur à la limite de moins de 0,005 % (arrondi à 0,00 %) donne-t-il
droit à 1 % (texte du mémento, «de moins de 1.03% inférieur») ? Wir rechnen 1 %.

**Question 2 — arrondi du montant:** Le taux est appliqué à la prime moyenne mensuelle (p. ex.
32,46 % × 569 = 184,70 par mois). Le montant versé est-il arrondi (au franc, aux 5 centimes) et à
quel niveau — par mois et par personne, ou par année ? Wir runden die Jahressumme auf Franken.

**Question 3 — enfant qui atteint 18 ans pendant l'année:** Est-il compté comme «enfant à charge»
(art. 3 al. 3 let. a ORP, «enfant mineur») jusqu'à la fin de l'année, ou seulement jusqu'au mois
de ses 18 ans (art. 5 al. 4 ORP) ? Solange das offen ist, zeigt die App für Haushalte mit einem
Kind, das im Anspruchsjahr 18 wird, keinen Betrag.
*Zwei Stellen, die fast antworten (nachgetragen nach der Fachprüfung, K1):* das Mémento Ziff. 8.1
nennt die Kinderprämie «pour un enfant jusqu'à et y compris 18 ans», und Ziff. 5 verlangt eine
Ausbildungsbestätigung erst «pour les enfants à charge âgés de 19 à 25 ans». Das spricht dafür,
dass ein 18-jähriges Kind das ganze Jahr als Kind zählt — belegt ist es nicht.

**Stand:** FR ist für 2026 gebaut (Entwurfs-PR, K31). Das Mémento 2027 war am 28.09.2026 nicht
publiziert. Ab 01.01.2027 zeigt die App für FR keinen Betrag mehr.

---

## 13 · Caisse de compensation du canton du Jura (ECAS) — Vermögensgrenze genau 150'000, Eingang der Frist

*Aufgenommen 28.09.2026 beim Einbau von JU (Fachprüfung #483, 💡 9 und ⚠️ 3d). Entwurf — **nicht gesendet**.
Nummer 13 (Integration 28.09.2026; § 12 = FR auf dessen Zweig).*

**Worum es geht:** Die App zeigt für den Jura bewusst keine Zahl (massgebend ist das steuerbare Einkommen,
das sie nicht kennt). Zwei Punkte betreffen aber die Texte und den Tag, an dem sie rechnet:

**Question 1 — fortune de 150'000 francs exactement:** L'ordonnance (RSJU 832.115, art. 7a al. 1) exclut
les assurés dont la fortune déterminante est «supérieure à 150 000 francs»; la page «RPI 2026 – seuil de
fortune» de la Caisse indique que la fortune «doit être inférieure à 150 000 francs». Une fortune
(chiffre 740) de 150'000 francs exactement donne-t-elle droit à la réduction ? (Die App folgt der
Ordonnance: genau 150'000 schliesst nicht aus.)

**Question 2 — délai du 31 décembre:** La page «Informations générales 2026» écrit que la requête
«devra nous parvenir avant le 31 décembre 2026», l'ordonnance (art. 22 al. 8) «au plus tard jusqu'au
31 décembre». Une requête reçue le 31 décembre est-elle encore dans le délai ? (Die App sagt vorsichtig:
«vor dem 31. Dezember eingetroffen».)

**Stand:** JU ist für 2026 gebaut und zeigt bewusst keine Zahl (Entwurfs-PR #483, K31). Ab 01.01.2027 gilt
das Arrêté 2026 nicht mehr.

---

## 14 · IAS Tessin — Bedarfsgrenze für RDM, Berufsauslagen und Aufteilung

*Aufgenommen 28.09.2026 beim Einbau von TI. Entwurf — **nicht gesendet**.*

**Wo:** LCAMal (RL 853.100) Art. 31, 32a, 37; RLCAMal (RL 853.110) Art. 17, 18; Decreto RL 870.130;
Istruzioni RIPAM 2026.

**Frage 1 — RDM:** Art. 32a nennt «50% del limite di fabbisogno, senza computo della pigione, ai sensi
della Laps». Ist das für eine Einzelperson 2026 die «soglia d'intervento» nach Laps Art. 10 und Decreto
870.130, also 18'709 (RDM = 3,8 × 50 % × 18'709 = 35'547.10)? Die Istruzioni nennen 18'709 als «limite di
fabbisogno esistenziale», RLCAMal Art. 18 regelt das Jahr — wörtlich gleichgesetzt ist es nirgends.

**Frage 2 — Berufsauslagen:** Ist die Pauschale von 4'000 für jede UR mit einer hauptberuflich
angestellten Person fest, oder zählt der tatsächliche Abzug nach LT, höchstens 4'000?

**Frage 3 — Kinder:** Wie wird nach RLCAMal Art. 17 Abs. 2 aufgeteilt, wenn die UR-Verbilligung 80 % des
PMR der Minderjährigen übersteigt — erhalten diese genau 80 % und die übrigen Personen den Rest nach PMR?
Davon hängen der Deckel (Art. 37 Abs. 3) und der Mindestbetrag je Person (Art. 21) ab.

**Frage 4 — Ziffer 10.3:** Die Istruzioni nennen für die Sozialabzüge (CS) die Ziffern «10.1, 10.2 e
10.3» der Veranlagung. Ist 10.3 die Säule 3a? LCAMal Art. 31 Abs. 1 lit. d zählt die CS abschliessend
auf («AVS, AI, IPG, AD, AINP, LPP») — die App rechnet darum ohne 3a-Abzug; zieht das IAS sie ab, liegt
die Zahl für 3a-Sparende zu tief.

**Stand:** TI ist für 2026 für Alleinstehende gebaut (Entwurfs-PR, K31); Haushalte mit Kindern und Paare
zeigen keinen Betrag. Die App hat den IAS-Rechner bewusst nicht mit Daten gefüttert.

---

## 15 · Service de l'assurance-maladie (SAM) Genève — Deckel je Person, Familienzulagen, Kind aus dem Vorjahr, Rundung

*Nummer: zuerst 8, dann 9, dann 10 — nach den Merges von UR (#464), NE (#478) und GR (#467) mit Nummer 15 festgelegt (Koordination; 11 = TG, 14 = TI). Eine parallele Sitzung nummerierte GE zwischenzeitlich als 12 — der Block ist hier zusammengeführt.*

*Aufgenommen 28.09.2026 beim Einbau von GE, nachgeführt am Abend nach Fach-, Rechtsprüfung und Abgleich.
Entwurf — **nicht gesendet**.*

**Worum es geht:** Gruppengrenzen (Art. 21 LaLAMal), Beträge 2026 (Barème «BAREME SUBSIDES 2026»,
Communiqué des Conseil d'Etat vom 5.11.2025) und die Untergrenzen für den Antrag (Tabelle des SAM
auf ge.ch) stehen vollständig; jede Zelle des Barème rechnen wir nach. Vier Punkte bleiben.

~~**Frage 1 — Arrêté d'indexation 2026:** Wo ist der Arrêté publiziert?~~ ⟨**erledigt 28.09.2026 abends:**
Communiqué hebdomadaire du Conseil d'Etat vom 5.11.2025, «Indexation des subsides d'assurance-maladie
pour 2026» — Erwachsene 8,7 %, junge Erwachsene 5,3 %, Kinder 10,9 %, Basis 2024, mit Tabelle aller
Beträge. Damit sind auch die Gruppe-9-Beträge 67 und 106 erklärt; ein Einheitssatz hätte 66 und 109
ergeben.⟩

~~**Frage 2 — Untergrenze für Alleinerziehende:** Paar-Zeile (20 000 + 3 000) oder Zeile «assuré seul»
(15 000 + 3 000)?~~ ⟨**erledigt 28.09.2026 abends:** ge.ch, «Revenus 2024 (RDU 2026) particulièrement bas»
(Stand 18.09.2026): «Personne seule avec 1 enfant 18'000 · 2 enfants 21'000 · 3 enfants 24'000 · 4 enfants
27'000 · Couple avec 1 enfant 23'000». Die App rechnete am Nachmittag mit 23'000 — korrigiert.⟩

**Frage 3 — Deckel Art. 22 al. 4 LaLAMal:** «Le montant des subsides accordés ne peut dépasser
le montant de la prime effective de l'assuré.» Wir lesen das **je versicherte Person** und
begrenzen den Erwachsenenbetrag auf die erfasste Prämie der erwachsenen Person; die
Kinderbeträge (132 / 67) begrenzen wir nicht, weil die Kinderprämien nicht erfasst sind. Ist das
die Praxis des SAM?

**Frage 4 — Familienzulagen im RDU:** LRDU Art. 4 al. 1 lit. a verweist auf LIPP Art. 18, und
dessen al. 1 zählt «les allocations» zum Erwerbseinkommen. Sind damit auch die Kinder- und
Ausbildungszulagen gemeint (wie im Bundesrecht, sie stehen auf dem Lohnausweis)? Die App rechnet
sie heute in keinem Kanton; ein Rahmen-Umbau ist geplant und braucht diese Antwort für Genf.

**Frage 5 — Kind aus dem Vorjahr:** Art. 13C RaLAMal regelt den Fall, dass die Familie «en cours
d'année» wächst. Gilt der schriftliche Antrag auch für ein Kind mit **Jahrgang 2025**, das in der
Veranlagung 2024 noch nicht steht, im Anspruchsjahr 2026 aber schon da war — oder erfasst es
der SAM automatisch aus den Zivilstandsdaten? Bis zur Antwort warnt die App in beiden Fällen.

**Frage 6 — Rundung:** Wird der RDU für die Gruppenzuordnung auf ganze Franken gerundet? Wir
vergleichen ungerundet (30'000.50 liegt über 30'000).

**Stand:** GE ist für 2026 gebaut (Entwurfs-PR #469, K31). Das Barème 2027 war am 28.09.2026 nicht
publiziert; ab 01.01.2027 zeigt die App für GE keinen Betrag mehr.

---

## 16 · Ausgleichskasse Nidwalden — Kinder: besondere und allgemeine Prämienverbilligung

*Aufgenommen 28.09.2026 beim Einbau von NW. Entwurf — **nicht gesendet**.*

**Worum es geht:** Selbstbehalt, Richtprämien und Steuerwerte 2026 stehen in NG 742.111 und NG 742.1;
die App rechnet danach für Alleinstehende. Für Familien fehlt uns eine Regel.

*Nummer 16 (28.09.2026 spätabends): 10 ist GR, 11–15 sind für TG, FR, JU, TI, GE reserviert.*

**Frage 1 — Kinder (Art. 14 Abs. 2 kKVG):** «Besteht nach Berücksichtigung der besonderen
Prämienverbilligung weiterhin ein Anspruch auf allgemeine Prämienverbilligung für die Kinder, wird diese
zusätzlich ausgerichtet.» Wie wird gerechnet? Beispiel: ein Elternteil, ein Kind, Summe der Steuerwerte
30'000, Richtprämien 5'400 / 1'260, Selbstbehalt 3'000. Wir sehen drei Lesarten: (a) das Kind zählt in
der allgemeinen Rechnung nur mit 20 % → 3'660; (b) das Kind erhält das Höhere aus 80 % und seinem
Anteil → 3'975.60; (c) 80 % plus sein Anteil, höchstens die Richtprämie → 4'227.60. Welche gilt? Bis
zur Antwort zeigt die App Familien in diesem Bereich keinen Betrag.

**Frage 2 — Mindestbetrag (§ 5 der Verordnung 2026):** «Beträge unter Fr. 100.–» — je Person oder
für den ganzen Anspruch? Die App prüft die Summe.

**Frage 3 — Rundung:** Gibt es eine Rundungsregel für die Auszahlung (z. B. Monatsbetrag auf
5 Rappen)? Wir haben keine gefunden und rechnen auf ganze Franken im Jahr.

*Hinweis zu Frage 1 (Fachprüfung #486, K1, keine Entscheidung):* Art. 15 Abs. 2 sagt für junge
Erwachsene «Besteht … ein **höherer** Anspruch …, wird **dieser Betrag** ausgerichtet» (eine
Max-Regel); Art. 14 Abs. 2 sagt «weiterhin … **zusätzlich**». Der Wortlaut spricht eher gegen (b).
Auch (a) ist nicht sicher eine Untergrenze: zählt das Kind in der allgemeinen Rechnung gar nicht,
ergäbe das Beispiel 3'408.

**Frage 4 — Neugeborene (Art. 17 Abs. 2 und Art. 20a kKVG):** Ein 2026 geborenes Kind zählt «bis Ende
Kalenderjahr». Wird sein Anteil für die Monate vor der Geburt gekürzt (Prämie erst ab Geburt
geschuldet)? Die App rechnet anteilig ab dem Geburtsmonat. Den Mindestbetrag (Frage 2) prüft sie
auf dem ungekürzten Anspruch, nicht auf dem Monatsanteil — Geburt im Dezember: 84 statt keiner
Auszahlung. Stimmt diese Reihenfolge?

**Stand:** NW ist für 2026 gebaut (Entwurfs-PR, K31) — ohne Zahl für Familien, bei denen Frage 1
entscheidet. Werte 2027 nicht publiziert; ab 01.01.2027 zeigt die App für NW keinen Betrag.

---

## 17 · Ausgleichskasse Obwalden — Jahrgang 2008, Mindestbetrag, Stufen und die Grenze mit Kindern

*Aufgenommen 28.09.2026 beim Einbau von OW. Entwurf — **nicht gesendet**.*

*Nummer 17 (28.09.2026 spätabends, vorher 9): 9 ist NE, 10 GR, 11–15 reserviert, 16 NW.*

**Worum es geht:** Selbstbehalt 2026 (KRB GDB 851.12), Richtprämien (Merkblatt 2026) und die
Rechenregeln (EV KVG GDB 851.11) sind gelesen; die App rechnet danach. Ein durchgerechnetes
Beispiel mit Franken-Ergebnis haben wir nicht gefunden. Fünf Punkte lesen wir nicht eindeutig.

**Frage 1 — Jahrgang 2008:** EV Art. 5 Abs. 2 zählt als Kind, wer am 1. Januar 18 oder jünger ist;
das Merkblatt 2026 lässt «Jugendliche (ab Jahrgang 2008)» einen eigenen Antrag stellen. Zählt ein
Kind mit Jahrgang 2008 im Antrag der Eltern mit (Richtprämie 1'380, Mindestanspruch 80 %)? Die App
zeigt bis zur Antwort keinen Betrag.

**Frage 2 — Mindestbetrag Art. 14 Abs. 6:** «Beiträge unter Fr. 100.–» — gilt das für den ganzen
Anspruch der Verfügung oder je Person/Versicherer? Die App prüft die Summe.

**Frage 3 — Steigerung des Selbstbehalts:** «pro Fr. 100.– … um je 0,01 Prozent» — stetig (wie der
Online-Rechner) oder in ganzen 100er-Stufen? Unterschied höchstens rund 5 Franken im Jahr.

**Frage 4 — Grenze mit Kindern:** Art. 7 Abs. 2 sagt «erhöht sich das anrechenbare Einkommen um
Fr. 25 000.–»; Merkblatt und Rechner lesen es als Grenze 75'000. Ist das so gemeint?

**Frage 5 — Rundung und Aufteilung:** Art. 14 Abs. 4 rundet «auf fünf Rappen» auf. Gilt das je
Person (nach der Aufteilung Art. 14 Abs. 2) oder für den ganzen Betrag?

**Frage 1b — Jahrgang 2007:** Diese Personen sind am 1. Januar 2026 18 Jahre alt, nach EV Art. 5
Abs. 2 also noch Kind (Richtprämie 1'380); das Merkblatt führt sie unter «Junge Erwachsene mit
Jahrgang 2001 bis 2007» (3'570). Welche Richtprämie gilt? Die App rechnet den Fall heute nicht.

**Frage 6 — Rahmen 9–12 % (EG KVG Art. 2 Abs. 2 seit 01.04.2026):** Der Kantonsratsbeschluss vom
26.03.2026 (GDB 851.12) lässt den Selbstbehalt ohne Obergrenze steigen; ab einem anrechenbaren
Einkommen von 60'000 liegt er über 12 %. Seit dem 1. April 2026 nennt das Gesetz aber einen Rahmen
«zwischen 9,0 und 12,0 Prozent», ohne Übergangsbestimmung. Gilt dieser Rahmen für die Verfügungen
zum Anspruchsjahr 2026? Betroffen sind Haushalte mit Kindern und anrechenbarem Einkommen zwischen
60'000 und 75'000; der Unterschied beträgt bis rund 1'125 Franken im Jahr. Bis zur Antwort zeigt die
App dort keinen Betrag, wo es darauf ankommt.

**Stand:** OW ist für 2026 gebaut (Entwurfs-PR, K31). Werte 2027 nicht publiziert; ab 01.01.2027
zeigt die App für OW keinen Betrag.

---

## 18 · SVA Schwyz — Grenze je Mietzinsregion, Kinder-Mindestanspruch, Stichtag

*Aufgenommen 28.09.2026 beim Einbau von SZ. Entwurf — **nicht gesendet**. (Nummer nach Absprache: UR 8, NE 9, GR 10, TG 11 … SZ 18, SO 19, ZG 20.)*

**Worum es geht:** Formel und Zahlen 2026 sind belegt — EGzKVG (SRSZ 361.100), der
Kantonsratsbeschluss mit dem Selbstbehalt von 11 % (SRSZ 361.110, § 1) und die Richtprämien 2026
der SVA. Die drei Beispiele im Merkblatt 2027 rechnen wir auf den Rappen nach. Offen bleiben
Punkte, an denen der Betrag für manche Menschen hängt; dort zeigt die App heute **keine Zahl**.

**Frage 1 — Höchsteinkommen je Mietzinsregion:** § 5 Abs. 1 lit. c EGzKVG knüpft den Anspruch
an Durchschnittsprämie + EL-Lebensbedarf + EL-Mietzins. Veröffentlicht sind nur die «minimalen
Höchsteinkommen … (für Kinder unter 11 Jahren, Mietzinsregion 3)», z. B. 43'554 für
Alleinstehende ohne Kind. Gibt es eine amtliche Tabelle der Höchsteinkommen 2026 für die
Mietzinsregionen 1 und 2 und für Kinder ab 11 — und eine Liste, welche Schwyzer Gemeinde in
welcher EL-Mietzinsregion liegt? Bis dahin zeigt die App zwischen 43'554 und dem Nullpunkt der
Formel (50'760) keinen Betrag, weil er in Region 3 null wäre und in den anderen nicht.

**Frage 2 — Mindestanspruch der Kinder (§ 10 Abs. 2 EGzKVG, § 7a VVzEGzKVG):** Im Beispiel 3
des Merkblatts (alleinstehend, zwei Kinder, anrechenbares Einkommen 39'250) steht als
Prämienverbilligung die Differenz 3'836.50, darunter «Die SVA Schwyz prüft in jedem Einzelfall,
dass die Prämien für Kinder um mindestens 80 Prozent … verbilligt werden.» Anteilig nach
Richtprämie verteilt erhielte jedes Kind 604.69, also 47 % seiner Richtprämie. ⟨korrigiert 28.09.2026: hier stand 604.71⟩ Wird dann **je
Kind auf 80 % erhöht** (Gesamtbetrag rund 4'683), oder wird der **Gesamtbetrag** mit der Summe
der Kinder-Mindestbeträge verglichen (dann bleibt es bei 3'836.50)? Bis zur Antwort rechnet die
App mit Kindern nur, solange jedes Kind anteilig ohnehin 80 % erhält.

**Frage 3 — Stichtag der persönlichen Verhältnisse:** § 12 Abs. 1 EGzKVG nennt «den 1. April des
dem Anspruchsjahr vorangehenden Jahres», das Merkblatt 2026/2027 «den 1. Januar» des
Anspruchsjahres. Welcher gilt — für Alter, Haushalt und Wohnsitz? (Für das Alter stützt sich die
App auf die Jahrgänge in «Richtprämien 2026»: Erwachsene ab Jahrgang 2000.)

**Frage 4 — Deckel § 10 Abs. 1 EGzKVG:** Gilt «darf die tatsächlich geschuldeten Prämien …
nicht übersteigen» je Person oder für den Haushalt? Die App kennt nur die Prämie der erwachsenen
Person und begrenzt deren Anteil.

**Frage 6 — Änderung der Verhältnisse im Anspruchsjahr:** § 10 VVzEGzKVG: «Wesentliche Änderungen
der wirtschaftlichen Verhältnisse zwischen der letzten rechtskräftigen Steuerveranlagung und dem
31. Dezember des Anspruchsjahres werden auf Antrag berücksichtigt» (mindestens 10 %, Antrag bis
31. März des Folgejahres). Das Merkblatt 2026/2027 sagt: «Änderungen der wirtschaftlichen
Verhältnisse nach dem 1. Januar … können erst in den Folgejahren berücksichtigt werden.» Welche
Regel gilt für eine Person, deren Einkommen im Laufe des Anspruchsjahres um mehr als 10 % sinkt?
(Die App nennt heute beide Aussagen und verweist an die SVA.)

**Frage 5 — späte Anmeldung:** Die Website sagt zur Frist 31.12.2026: «Je nach Anmeldeeingang
erhalten Sie die Prämienverbilligung möglicherweise rückwirkend per 1. Januar 2026.» Wovon hängt
es ab, ob der ganze Jahresbetrag gewährt wird?

**Stand:** SZ ist für 2026 gebaut (Entwurfs-PR, K31). Die Werte 2027 erscheinen laut SVA «ab
Anfang November 2026»; ab 01.01.2027 zeigt die App für SZ keinen Betrag mehr.

---

## 19 · Ausgleichskasse Solothurn / Departement des Innern — die lineare Eigenanteil-Skala

*Aufgenommen 28.09.2026 beim Einbau von SO. Entwurf — **nicht gesendet**. (Nummer nach Absprache: UR 8, NE 9, GR 10, TG 11 … SZ 18, SO 19, ZG 20.)*

**Worum es geht:** Die Parameter-Verfügung vom 27.01.2026 nennt «Eigenanteile in % des massgebenden
Einkommens: 10% bis 16%», § 70 Abs. 1 SV sagt, sie würden «abhängig von der Höhe des massgebenden
Einkommens … linear festgelegt». Richtprämien (monatlich, bestätigt durch die Botschaft SGB 0226/2025),
Grenzwert 74'000, Vermögensanteil 50 % und Auszahlungslimite 240 sind klar. Ohne die Eckpunkte der
Skala zeigt die App für Solothurn **keinen Betrag** — bei 30'000 massgebendem Einkommen läge der
Eigenanteil je nach Lesart zwischen 3'000 und 4'800 Franken.

**Frage 1 — Eckpunkte:** Gilt 10 % bei einem massgebenden Einkommen von 0 und 16 % beim Grenzwert
74'000 — oder andere Eckpunkte? Wird der Satz stufenlos oder in Schritten angepasst?

**Frage 2 — Rundung:** Die Richtprämien 422 / 305 / 98 entsprechen 70 % der Durchschnittsprämien,
**aufgerundet** auf Franken. Ist das die Regel? Wird der Anspruch selbst gerundet (Franken, Monat)?

**Frage 3 — Auszahlungslimite bei Familien:** «unter 240 Franken pro Anspruchsjahr und erwachsener
anspruchsberechtigter Person» — gilt das auf dem Gesamtanspruch der Familie oder je Person?

**Frage 4 — Beispiel:** Gibt es ein amtliches Berechnungsbeispiel für 2026?

**Frage 5 — Vermögen (Ziffer 990):** Ist das «satzbestimmende Vermögen» (Ziffer 990), das der Online-Rechner
abfragt, das Vermögen **nach** den Sozialabzügen des § 71 StG (60'000 / 100'000 / +20'000 je Kind)? SG § 89
Abs. 2 lit. a spricht vom «steuerbaren Vermögen»; die App rechnet so (Fachprüfung 28.09.2026).

**Stand:** SO ist gebaut (Entwurfs-PR, K31) und zeigt bewusst keinen Betrag, nur «kein Anspruch»,
wo er für jeden Satz zwischen 10 und 16 % gilt. Mit der Antwort auf Frage 1 rechnet die App.

## 20 · Ausgleichskasse Zug — der Beschluss 2026 und die Frist

*Aufgenommen 28.09.2026 beim Einbau von ZG, nach der Fachprüfung neu gefasst. Entwurf — **nicht
gesendet**. (Nummer nach Absprache: UR 8, NE 9, GR 10, … SZ 18, SO 19, ZG 20.)*

**Worum es geht:** Die Broschüre «Prämienverbilligung 2026 im Kanton Zug» nennt Richtprämien,
Selbstbehalt 8 % und die Grenzen 70'000 / 89'900 — und dazu: «Die Grenzwerte für das massgebende
Einkommen fallen bei Einzelpersonen und gewissen Haushalten mit nur einer erwachsenen Person tiefer
aus.» Die App rechnet heute nur Haushalte mit einer erwachsenen Person. Solange diese Grenzen
fehlen, zeigt sie für Zug **keinen Betrag**, nur «kein Anspruch», wo er sicher ist.

⟨Fachprüfung #475, 28.09.2026 abends: Fragen 1–4 in dieser Form sind **überholt** und bleiben als
Beleg stehen. Die Regierungsratsbeschlüsse 2024 und 2025 kennen **eine** Grenze für alle (Ziff. 1.5),
die Broschüre 2025 rechnet eine Einzelperson ohne weitere Grenze; der Satz «bei Einzelpersonen …
tiefer» beschreibt die Formel (Nullpunkt 62'310). Frage 3 beantwortet RRB 2025 Ziff. 1.6 (80 %,
gestützt auf § 7bis Abs. 2 IPVG i. V. m. Art. 65 Abs. 1bis KVG), Frage 4 Ziff. 3 (Amtsblatt).
Die App rechnet jetzt. Offen bleiben die Fragen 5–7 unten.⟩

~~**Frage 1 — Grenzen 2026:** Ab welchem massgebenden Einkommen beginnt für Einzelpersonen die
Kürzung, und wo liegt die Obergrenze? Gilt dieselbe Kürzung (0,5 % je angefangene 100 Franken)?~~

~~**Frage 2 — «gewisse Haushalte»:** Welche Haushalte mit einer erwachsenen Person haben die tieferen
Grenzen, welche die Haushaltsgrenzen (z. B. alleinerziehend mit Kindern)?~~

~~**Frage 3 — Mindestgarantie Kinder:** Die Broschüre nennt «mindestens 80 % der Richtprämie», § 7bis
Abs. 2 IPVG «mindestens die Hälfte der für sie massgebenden Prämie». Worauf stützt sich die 80 %?~~

~~**Frage 4 — Beschluss:** Ist der Regierungsratsbeschluss mit den Parametern 2026 veröffentlicht
(Amtsblatt)? In der BGS ist er nicht erfasst.~~

**Frage 5 — Beschluss 2026:** Der Beschluss mit den Parametern 2026 liegt uns nicht vor (akzug.ch
führt die Kurzfassungen 2023–2025, für 2026 nicht; zg.ch zeigt noch 2025). Gilt Ziff. 1.5 für 2026
unverändert — eine Grenze für alle, ohne eigene Grenzen für Einzelpersonen? Wo ist er veröffentlicht?

**Frage 6 — der Satz in der Broschüre:** «Die Grenzwerte … fallen bei Einzelpersonen und gewissen
Haushalten mit nur einer erwachsenen Person tiefer aus.» Ist damit gemeint, dass die Formel bei ihnen
früher auf null fällt (Einzelperson 62'310, mit einem Kind 77'610)?

**Frage 7 — verspätete Gesuche:** § 11 Abs. 2 IPVG lässt Gesuche bis 30. September zu, «wenn …
wichtige Gründe vorliegen»; die Website schreibt, nach dem 30. April sei keine Anmeldung mehr
möglich. Welche Gründe gelten als wichtig?

**Stand:** ZG ist gebaut (Entwurfs-PR #475) und rechnet nach den Werten der Broschüre 2026 und der
Struktur des Beschlusses 2025. «Kein Anspruch» sagt die App nur auf einer Untergrenze des
Reineinkommens (⟨Fixrunde 2⟩ Versicherungsabzug § 30 lit. g StG voll, Berufskosten-Pauschale,
Fahrkosten bis 6'000, Verpflegung, bezahlte Alimente, Kinderbetreuung — Wegleitung 2024 der
Steuerverwaltung); dazwischen zeigt sie keine Zahl. Erhaltene Alimente und Familienzulagen zählt sie
zum Einkommen.

---

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

## 24 · SVA Schaffhausen — Kinder-Mindestanspruch, Aufteilung, Rundung

*Aufgenommen 28.09.2026 beim Einbau von SH. Entwurf — **nicht gesendet**. (Nummer 24, zugeteilt
28.09.2026 abends; vorher 8, dann 12.)*

**Worum es geht:** Formel und Zahlen 2026 stehen im Dekret (SHR 832.110 §§ 10–13bis) und im
Anhang 1 der Verordnung (SHR 832.111). Ein Berechnungsbeispiel gibt es weder im Merkblatt 2026
noch auf svash.ch. Die Versand-Grenzwerte (§ A1-2) rechnen wir als Nullpunkt der Formel auf den
Franken nach — das belegt Selbstbehalt und Richtprämien, nicht aber die folgenden Punkte.

**Frage 1 — Kinder, Basis der 80 %:** Werden die «Prämien der Kinder um mindestens 80 Prozent»
(Merkblatt, § 13bis Dekret) auf die **Richtprämie** des Kindes (2026: 1'387 / 1'295) gerechnet
oder auf seine **effektive** Prämie? Wir rechnen mit der Richtprämie — das Antragsformular fragt
nach der Krankenkasse, nicht nach der Prämie.

**Frage 2 — Aufteilung des Rests (§ 13bis Abs. 1):** «Die verbleibenden Mittel werden anteilig
entsprechend der Höhe der anrechenbaren Prämie auf die mitbetroffenen Angehörigen des Haushalts
verteilt.» Zählen die Kinder dabei **mit** (sie erhalten dann mehr als 80 %), oder geht der Rest
nur an die übrigen Personen? Die Summe ändert sich nicht, wohl aber der Anteil der erwachsenen
Person — und damit, ob deren eigene Prämie als Obergrenze greift. Geben beide Lesarten einen
anderen Betrag, zeigt die App keinen.

**Frage 3 — Kinder und Fr. 100:** Liegt die Differenz über 0, aber unter Fr. 100, sagt § 13
Abs. 2 «kein Betrag», § 13bis Abs. 2 aber «entsprechend erhöht», bis die Kinder 80 % erhalten.
Was gilt? Die App zeigt in diesem schmalen Band keinen Betrag.

**Frage 4 — Rundung:** Auf welche Einheit wird der verfügte Betrag gerundet? Wir runden den
Jahresbetrag auf ganze Franken.

**Frage 5 — Website:** Die Seite «Berechnung» (svash.ch/ipv/berechnung) zeigt am 28.09.2026 noch
die Richtprämien 2025 und die Steuerwerte 2023; die FAQ nennt «bis spätestens 30. April 2025».
Das Merkblatt 2026 und die Verordnung sind nachgeführt.

**Frage 6 — Kinder über dem Nullpunkt (Fachprüfung #471 W5):** Gilt der Mindestanspruch der Kinder
(80 %) nur, solange nach § 10 ein Anspruch besteht (Merkblatt: «bei einem Anspruch auf
Prämienverbilligung»), oder nach Art. 65 Abs. 1bis KVG («untere und mittlere Einkommen») auch darüber?
Wir rechnen die erste Lesart. Richtung: gilt die zweite, sagt die App Familien knapp über dem Nullpunkt
zu Unrecht «kein Anspruch» (zu tief, 1'109.60 bzw. 1'036 je Kind).

**Frage 7 — Deckel beim Kind (Fachprüfung #471 W3):** Wird der Anteil eines Kindes auf seine eigene
Prämie begrenzt (§ 17 Abs. 2)? In der Lesart «Rest mit Kindern verteilt» kann er über der
Kinderprämie liegen — die App wäre dann um mehrere hundert Franken je Kind und Jahr zu hoch, umso mehr,
je tiefer die Kinderprämie.

**Frage 8 — Entlastungsabzug und Säule 3a (Fachprüfung #471 K8):** Wird der Entlastungsabzug am
steuerlichen Reineinkommen (nach dem 3a-Abzug) gemessen oder am Einkommen nach der Aufrechnung nach
§ 12 lit. e? Wir rechnen am steuerlichen Reineinkommen; sonst läge die App um bis zu rund 400 Franken
zu hoch.

**Stand:** SH ist für 2026 gebaut (Entwurfs-PR, K31). Ein Anhang für 2027 ist am 28.09.2026 nicht
publiziert. Ab 01.01.2027 zeigt die App für SH keinen Betrag mehr.

---

## 25 · SOVAR Appenzell Ausserrhoden — Kinder, Deckel, Steuerjahr, Säule 3a

*Aufgenommen 28.09.2026 beim Einbau von AR. Entwurf — **nicht gesendet**. (Nummer 25, zugeteilt
28.09.2026 abends; vorher 9, dann 11.)*

**Worum es geht:** Das EG zum KVG (bGS 833.14) und die Verordnung (bGS 833.141) stehen online mit
«Stand 1. Januar 2017» — laut Medienmitteilung vom 31.10.2025 ist das tatsächlich das geltende
Gesetz. Die Werte 2026 stehen im Merkblatt der SOVAR; die Regierungsratsbeschlüsse selbst sind nicht
publiziert. Ein Berechnungsbeispiel gibt es nicht.

**Frage 1 — Kinder und Selbstbehalt:** Erhält jedes minderjährige Kind die 1'114.80 (80 %) **fest**
bis zur Obergrenze (Art. 11 Abs. 2 EG), unabhängig vom Selbstbehalt — oder wird der Selbstbehalt von
der Summe aller Richtprämien abgezogen? Und was gilt, wenn der Selbstbehalt die Richtprämie der
erwachsenen Person übersteigt, das Einkommen aber unter der Obergrenze liegt (Art. 16 Abs. 1 lit. c
EG)? Wir rechnen «fest» und zeigen im zweiten Fall keinen Betrag.

**Frage 2 — Deckel (Art. 7 V):** «Die Prämienverbilligung übersteigt die Höhe der Prämie … mit der
ordentlichen Franchise und mit Unfalldeckung nicht.» Gilt das auch, wenn die versicherte Person eine
höhere Franchise oder keine Unfalldeckung hat — also ist der Deckel die **hypothetische** Prämie mit
Fr. 300 Franchise und Unfall, nicht die bezahlte? Solange das offen ist, zeigt die App keinen
Betrag, wenn er über der erfassten Prämie liegt.

**Frage 3 — Steuerjahr:** «letzte rechtskräftige Steuerveranlagung» — für den Anspruch 2026 in der
Regel 2024? Wir brauchen das Jahr für den steuerlichen Kinderabzug nach Alter (5'300 / 7'400 / 11'600).

**Frage 4 — Säule 3a:** Wie stellt die Kasse fest, ob eine Person einer Vorsorgeeinrichtung angehört
(volle Aufrechnung) oder nicht (nur über 10'000)? Die App kennt das nur, wenn ein BVG-Beitrag
erfasst ist.

**Frage 5 — Neugeborene:** Wie wird ein Kind gerechnet, das nach dem 1. Januar geboren ist (Art. 6 V:
Anspruch ab dem Folgemonat; Art. 16 Abs. 2 EG: Verhältnisse am 1. Januar)?

**Frage 6 — Verfahren:** Art. 10 V nennt die AHV-Gemeindezweigstelle, das Antragsformular 2026 die
SOVAR. Welche Stelle gilt?
⟨28.09.2026, nach der Fachprüfung #480: das Formular, das die SOVAR nennt, ist das für **Zuzug aus dem
Ausland**. Die Anzeige nennt jetzt die AHV-Zweigstelle der Wohngemeinde (Art. 10 Abs. 1 V) und dass die
SOVAR mutmasslich Berechtigte anschreibt (Medienmitteilung 12.12.2025). Die Frage bleibt zur Bestätigung.⟩

**Stand:** AR ist für 2026 gebaut (Entwurfs-PR, K31). Die Teilrevision des EG zum KVG liegt beim
Kantonsrat; für 2027 neu prüfen. Ab 01.01.2027 zeigt die App für AR keinen Betrag mehr.

---

## 26 · Gesundheitsamt Appenzell Innerrhoden — Stufen, steuerpflichtiges Einkommen, Kinder

*Aufgenommen 28.09.2026 beim Einbau von AI. Entwurf — **nicht gesendet**. (Nummer 26, zugeteilt
28.09.2026 abends; vorher 10.)*

**Worum es geht:** Der StKB IPV (GS 832.501, in Kraft seit 01.01.2026) und das Merkblatt 2026 sind
vollständig; alle vier Berechnungsbeispiele des Merkblatts rechnen wir auf den Franken nach. Drei
Punkte bleiben, weil die Beispiele sie nicht zeigen.

**Frage 1 — Stufen:** «dazwischen steigt der Selbstbehalt schrittweise um 0.125% pro Fr. 1'000.--».
Gilt die Stufe je **volle** Fr. 1'000 über 45'000 (bei 60'500 also 8,875 %) oder je **angefangene**
(9,000 %)? Wir rechnen mit vollen Tausendern.

**Frage 2 — «steuerpflichtiges Gesamteinkommen»:** Ist das das steuerbare Einkommen nach Abzug der
Sozialabzüge (Kinderabzug Art. 37 StG), auf 100 Franken abgerundet? Wir rechnen so.

**Frage 3 — Kinder ohne Anspruch aus der Formel:** Werden Kinder bis 75'000 auch dann auf 80 %
angehoben, wenn die Richtprämien des Haushalts den Selbstbehalt nicht übersteigen? Art. 5 Abs. 5 knüpft
nur an das Einkommen; wir rechnen so (Kinderanteil 827 Franken).

**Frage 4 — Rundung:** Das Beispiel mit 75'000 rundet den Selbstbehalt 8'062.50 auf 8'062 ab und füllt
die Kinder auf 827 statt 827.20 auf. Ist «auf ganze Franken abrunden» die Regel?

**Stand:** AI ist für 2026 gebaut (Entwurfs-PR, K31). Ab 01.01.2027 zeigt die App für AI keinen Betrag
mehr, bis die Werte 2027 eingearbeitet sind.

---

## 27 · Ausgleichskasse des Kantons Wallis — eine Tabellenzelle, die Säule 3a, der Staatsratsbeschluss

*Aufgenommen 28.09.2026 beim Einbau von VS. Entwurf — **nicht gesendet**. Nummer 27 (Integration 28.09.2026: 11–26 für die übrigen Kantone reserviert; zuerst als 9, dann 10 notiert).*

**Worum es geht:** Referenzprämien, Sätze und Grenzen 2026 stehen in der «Einkommenstabelle zur
Berechnung der Krankenkassensubventionen 2026» (Echelle définitive RIP 2026, 19.12.2025) und —
mit dem Vermerk «(Provisorisch)» — im Anhang zur Medienmitteilung vom 3. Februar 2026. Die App
rechnet nach der Tabelle. Ein amtliches Rechenbeispiel mit Franken haben wir nicht gefunden.

~~**Frage 1 — Kinderzeile «Alleinstehende mit 1 Kind»:** Die Einkommenstabelle nennt **63'000**, der
Medienanhang **61'000**; alle anderen Zellen stimmen überein. Welcher Wert gilt 2026? Bis zur
Antwort zeigt die App für eine alleinstehende Person mit einem Kind zwischen 61'001 und 63'000
keinen Betrag (Unterschied: 80 % der Kinder-Referenzprämie, CHF 1'276.80 im Jahr in Region I).~~
⟨**beantwortet durch die Quelle, 28.09.2026** (Fachprüfung #477): «Modalités de subventionnement des
primes d'assurance-maladie 2026» (Dienststelle für Gesundheitswesen, 22.12.2025) Ziff. 4.1: «les enfants
des personnes seules dont le revenu est compris entre CHF 60'125.- et CHF 63'000.- ont droit à un subside
de 80%». Auch der französische Medienanhang nennt 63'000; nur die deutsche Fassung 61'000. Die App
rechnet mit 63'000. Frage nicht stellen — höchstens als Hinweis: «DE-Medienanhang Folie 8 weicht ab».⟩

**Frage 2 — Säule 3a:** Art. 8 Abs. 1 lit. a VüIPV rechnet die Beiträge «bis zum Maximalbetrag des
Angestelltenlohns» dazu; die Seite der Ausgleichskasse zählt «Beiträge der gebundenen
Selbstvorsorge (Säule 3a) (Ziffern 2210 et 2220)» ohne Obergrenze, ebenso die «Modalités 2026»
der Dienststelle (Ziff. 6.1: «+ les cotisations à des formes reconnues de prévoyance liée (pilier 3a)»). Gilt die Obergrenze — und wenn
ja, das Maximum mit 2. Säule des Steuerjahres x − 2 (2024: CHF 7'056)? Bis zur Antwort zeigt die App
bei Einzahlungen über dem Maximum keinen Betrag.

**Frage 3 — Staatsratsbeschluss:** Wo ist der Beschluss nach Art. 7 VüIPV (Einkommensgrenzen und
degressive Skala 2026) veröffentlicht? Im Amtsblatt 2026 haben wir ihn nicht gefunden; gefunden ist die
Publikation nach Art. 23 («Modalités … 2026», 22.12.2025). Genügt sie als Grundlage?

**Frage 4 — Rundung:** ~~Gilt der Satz der ersten Zeile, deren Grenze das massgebende Einkommen nicht
übersteigt?~~ ⟨belegt: Art. 2 Abs. 2 «gleich oder kleiner» und «Modalités» Ziff. 4.1 «limites maximales»⟩
Wird der Betrag je Monat und Person gerundet?

**Frage 5 — Frist für Gesuche ohne Entscheid:** Die «Modalités 2026» nennen für Sondergesuche und
Quellenbesteuerte den 31. Dezember 2026; VüIPV Art. 11 (Fassung 01.05.2026) nennt für die Geltendmachung
nach einem Entscheid eine «zwingende Frist von 2 Jahren» und für Personen ohne Entscheid «rückwirkend
2 Jahre». Gilt für ein Gesuch ohne Entscheid der 31. Dezember des Anspruchsjahres oder die Zwei-Jahres-
Frist? Die App nennt vorsichtig den 31. Dezember.

**Stand:** VS ist für 2026 gebaut (Entwurfs-PR, K31). Werte 2027 am 28.09.2026 nicht publiziert;
ab 01.01.2027 zeigt die App für VS keinen Betrag mehr.

---

## Warum überhaupt fragen

Diese App rechnet Beträge, auf die Menschen sich verlassen und die am Ende in einem Dossier für
genau diese Ämter landen. Eine Zahl, die um ein paar Franken danebenliegt, ist dort keine
Kleinigkeit — und eine Zahl, die wir nicht belegen können, zeigen wir lieber nicht.
