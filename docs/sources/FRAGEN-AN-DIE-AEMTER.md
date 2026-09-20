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

---

## Warum überhaupt fragen

Diese App rechnet Beträge, auf die Menschen sich verlassen und die am Ende in einem Dossier für
genau diese Ämter landen. Eine Zahl, die um ein paar Franken danebenliegt, ist dort keine
Kleinigkeit — und eine Zahl, die wir nicht belegen können, zeigen wir lieber nicht.
