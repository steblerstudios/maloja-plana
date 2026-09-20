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

> 🛑 Wir haben diese Zahl **nicht** eingesetzt, weil wir sie nicht belegen konnten: Fedlex
> lieferte am 20.09.2026 auf eine **erfundene** ELI eine byte-identische Antwort — damit war
> das Messgerät unbrauchbar und kein Ergebnis daraus gültig. Eine geratene Zahl sähe belegt
> aus und läge bei jeder Einzahlung über dem Maximum still daneben.

**Stand:** Die Doppelzählung der 3a (sie steckte schon im erfassten Nettoeinkommen und wurde
ein zweites Mal aufgerechnet) ist behoben. Die beiden kantonalen Sonderregeln sind benannt und
belegt hinterlegt, **wirken aber noch nicht** — sie hängen an diesen zwei Antworten.

---

## Warum überhaupt fragen

Diese App rechnet Beträge, auf die Menschen sich verlassen und die am Ende in einem Dossier für
genau diese Ämter landen. Eine Zahl, die um ein paar Franken danebenliegt, ist dort keine
Kleinigkeit — und eine Zahl, die wir nicht belegen können, zeigen wir lieber nicht.
