# Grauzonen — Sammlung

> Grundlage für «Grauzonen als Entscheidungsbäume», siehe `docs/IDEEN.md` §0 (Horizont: Oktober
> sammeln, Winter bauen). Diese Datei ist **Recherche, kein Rat und kein Bauauftrag**.

Eine Grauzone ist hier eine Lage, in die Menschen geraten, weil ihnen niemand die Ausnahme, die
Verzweigung oder die Lücke erklärt. Jeder Eintrag nennt die Frage, an der sich der Weg teilt, die
Quelle aufs Wort und den Stand in Maloja.

**Stand:** gesammelt am 24.09.2026 von Stebler Studios. Alle Abrufe am 24.09.2026.

**Status:** `belegt` = Wortlaut der Quelle gelesen und zitiert · `teilweise belegt` = Kern belegt,
ein benannter Teil nicht · `unbelegt` = nur Behauptung, Stelle zum Nachfragen genannt.

**Wie die Gesetzestexte gelesen wurden:** Fedlex liefert unter `fedlex.admin.ch/eli/…` für jede
Adresse dieselbe Seitenhülle mit Status 200. Gelesen wurde darum die HTML-Datei aus dem
Fedlex-Dateispeicher (`fedlex.data.admin.ch/filestore/…`, Liste am Ende). Auch dieser Speicher
antwortet auf erfundene Adressen mit 200: die Gegenprobe mit der erfundenen Adresse
`eli/cc/1999/9999_9999_9999` lieferte eine Hülle von 9 148 Byte. Jede unten genannte Fassung ist
über 50 kB gross, trägt im Titel den richtigen Erlass, und der zitierte Artikel wurde im Text
gelesen. «Fassung» meint die neueste Fassung, die auf einem Monatsersten zwischen Januar 2024 und
August 2026 gefunden wurde; eine spätere Fassung mitten im Monat ist nicht ausgeschlossen.

**Übersicht:** 19 Grauzonen · 14 belegt · 5 teilweise belegt · 0 unbelegt.

---

## A · Ohne Arbeit

### 1 · Arbeitslos, und dann eine kleine Stelle: Zwischenverdienst

**Lage.** Wer arbeitslos ist, lehnt eine schlecht bezahlte Teilzeitstelle oft ab, aus Sorge, das
Taggeld zu verlieren. Dass die Arbeitslosenversicherung die Differenz ausgleichen kann, weiss man
selten.

**Verzweigung.** Liegt das Einkommen in einer Kontrollperiode unter dem versicherten Verdienst? →
Die Differenz gilt als Verdienstausfall und wird ersetzt. Wie lange? → Längstens die ersten zwölf
Monate dieser Tätigkeit; mit Unterhaltspflicht für Kinder unter 25 oder ab 45 Jahren bis zum Ende
der Rahmenfrist.

**Quelle.** AVIG Art. 24 Abs. 1, 3 und 4 (SR 837.0, Fassung 1.1.2026). Wortlaut
u. a.: «Als Zwischenverdienst gilt jedes Einkommen aus unselbstständiger oder selbstständiger
Erwerbstätigkeit, das der Arbeitslose innerhalb einer Kontrollperiode erzielt.»

**Status.** belegt · **Kantonal verschieden?** Nein, Bundesrecht.

**In Maloja?** Nicht gefunden (`git grep -i zwischenverdienst origin/main -- src`: kein Treffer).

### 2 · Arbeitslos und selbständig werden wollen

**Lage.** Wer aus der Arbeitslosigkeit heraus ein eigenes Geschäft plant, fürchtet, damit das
Taggeld zu verlieren, weil man ja «nicht vermittelbar» sei.

**Verzweigung.** Ist die Person ohne eigenes Verschulden arbeitslos, mindestens 20 Jahre alt und
hat sie ein Grobprojekt? → Bis zu 90 Taggelder während der Planungsphase, ohne Pflicht zur
Vermittlungsfähigkeit. Wird später tatsächlich selbständig gearbeitet? → Diese Tätigkeit ist nicht
über die ALV versichert, denn beitragspflichtig sind nur Arbeitnehmende und Arbeitgebende.

**Quelle.** AVIG Art. 71a Abs. 1, Art. 71b Abs. 1 und 3, Art. 2 Abs. 1 (SR 837.0, Fassung 1.1.2026).
Wortlaut 71b Abs. 3: «Während der Planungsphase muss der Versicherte nicht vermittlungsfähig sein».
Das Wort «kann» in Art. 71a heisst: ein Ermessensentscheid, kein fester Anspruch.

**Status.** belegt · **Kantonal verschieden?** Nein; zuständig ist das RAV bzw. die kantonale
Amtsstelle.

**In Maloja?** Nicht gefunden (Stichworte `71a`, `Planungsphase`). `src/i18n/de.js:527` fragt im
Selbständigkeits-Ablauf nach Neben- oder Haupterwerb, ohne die ALV-Brücke zu nennen.

### 3 · Krank werden, während man stempelt

**Lage.** Wer während der Arbeitslosigkeit krank wird, weiss oft nicht, ob das Taggeld weiterläuft
und wie lange.

**Verzweigung.** Vorübergehend arbeitsunfähig? → Volles Taggeld bis zum 30. Tag der
Arbeitsunfähigkeit, innerhalb der Rahmenfrist höchstens 44 Taggelder. Danach mit
Krankentaggeldversicherung und Restarbeitsfähigkeit? → Ab 75 % arbeitsfähig volles Taggeld, ab 50 %
um die Hälfte gekürzt. Bezahlt eine Kranken- oder Unfallversicherung Erwerbsersatz? → Wird
abgezogen.

**Quelle.** AVIG Art. 28 Abs. 1, 2 und 4 (SR 837.0, Fassung 1.1.2026). Wortlaut Abs. 1: «[…] und ist
innerhalb der Rahmenfrist auf 44 Taggelder beschränkt.»

**Status.** belegt · **Kantonal verschieden?** Nein.

**In Maloja?** Nicht gefunden.

### 4 · Nach der Trennung oder dem Tod des Ehegatten: Arbeitslosengeld ohne Beitragszeit

**Lage.** Wer lange nicht erwerbstätig war und nach einer Trennung, Scheidung oder dem Tod des
Ehegatten Arbeit suchen muss, hört oft: ohne zwölf Beitragsmonate kein Taggeld. Das stimmt hier
nicht.

**Verzweigung.** Muss die Person wegen Trennung, Scheidung, Invalidität oder Tod des Ehegatten eine
Stelle suchen, liegt das Ereignis höchstens ein Jahr zurück und bestand damals Wohnsitz in der
Schweiz? → Von der Beitragszeit befreit, Anspruch auf höchstens 90 Taggelder. Mehr als ein Jahr
her? → Die Befreiung gilt nicht mehr.

**Quelle.** AVIG Art. 14 Abs. 2 und Art. 27 Abs. 4 (SR 837.0, Fassung 1.1.2026). Wortlaut Art. 14
Abs. 2: «Diese Regel gilt nur dann, wenn das betreffende Ereignis nicht mehr als ein Jahr
zurückliegt […]».

**Status.** belegt · **Kantonal verschieden?** Nein.

**In Maloja?** Ausdrücklich **nicht** abgebildet: `src/data/alvRechner.js:49` («Befreite ohne
Beitragszeit (90 Taggelder) hier nicht abgebildet»), und die Oberfläche sagt
`src/i18n/de.js:4647`: «Mind. 12 Monate Beitragszeit nötig — sonst meist kein Anspruch.» Für genau
diese Menschen ist der Satz irreführend. Auch der Trennungs-Ablauf nennt die Befreiung nicht.

### 5 · Ausgesteuert: Sozialhilfe, Ergänzungsleistungen oder Überbrückungsleistungen?

**Lage.** Wenn die Taggelder enden, verwechselt man leicht drei Leistungen. Viele erwarten
Ergänzungsleistungen, die es in dieser Lage meist gar nicht gibt.

**Verzweigung.** Bezieht die Person eine AHV- oder IV-Rente (oder seit sechs Monaten ununterbrochen
IV-Taggeld)? → Ergänzungsleistungen möglich, sonst nicht. Wurde sie mit 60 oder später
ausgesteuert, war sie mindestens 20 Jahre in der AHV versichert (davon 5 nach dem 50.) und liegt das
Reinvermögen unter der Hälfte der EL-Vermögensschwelle? → Überbrückungsleistungen bis zum
Referenzalter bzw. bis zum frühesten Vorbezug. Sonst? → Sozialhilfe (kantonal).

**Quelle.** ELG Art. 4 Abs. 1 (SR 831.30, Fassung 1.1.2026) · ÜLG Art. 3 und Art. 5 Abs. 1
(SR 837.2, Fassung 1.1.2025). Wortlaut ÜLG Art. 3 Abs. 1: «Personen ab 60 Jahren, die ausgesteuert
sind, haben Anspruch auf Überbrückungsleistungen […]». Die weiteren Einkommensvoraussetzungen in
ÜLG Art. 5 Abs. 1 Bst. b (Mindesterwerb pro Jahr) sind hier nicht in Franken übersetzt.

**Status.** belegt · **Kantonal verschieden?** EL und ÜL: Bundesrecht. Sozialhilfe: kantonal.

**In Maloja?** Teilweise: `src/i18n/de.js:149` (Sozialhilfe nach der Aussteuerung) und
`src/data/direktLinks.js:60` (Link Überbrückungsleistungen). Die Weiche «EL nur mit Rente» steht
nirgends ausdrücklich.

---

## B · Krankheit und Unfall

### 6 · Krank bei der Arbeit: Lohnfortzahlung oder Krankentaggeld?

**Lage.** Wer länger krank ist, weiss oft nicht, wie lange der Lohn läuft und ob es danach etwas
gibt. Eine Krankentaggeldversicherung ist nicht vorgeschrieben.

**Verzweigung.** Dauert oder läuft das Arbeitsverhältnis länger als drei Monate? → Lohn für eine
beschränkte Zeit, im ersten Dienstjahr drei Wochen, danach «angemessen länger». Gibt es eine
schriftliche Abrede, einen GAV oder NAV mit mindestens gleichwertiger Lösung (meist eine
Krankentaggeldversicherung)? → Diese gilt anstelle der gesetzlichen Dauer.

**Quelle.** OR Art. 324a Abs. 1, 2 und 4 (SR 220, Fassung 1.1.2026). Wortlaut Abs. 2: «[…] so hat der
Arbeitgeber im ersten Dienstjahr den Lohn für drei Wochen und nachher für eine angemessene längere
Zeit zu entrichten […]». OR Art. 324b regelt nur **obligatorische** Versicherungen (z. B. UVG): dort
genügen vier Fünftel des Lohns.

**Status.** teilweise belegt. **Nicht belegt:** was «angemessen länger» in Wochen bedeutet (die
Berner, Zürcher und Basler Skala sind Gerichtspraxis, keine Gesetzesnorm) und welche
Krankentaggeld-Lösung als «gleichwertig» gilt. Nachfragen bei: kantonale Arbeitsgerichte bzw.
Schlichtungsstellen, oder die Skalen aus einer amtlichen Quelle (z. B. SECO) belegen.

**Kantonal verschieden?** Das Gesetz nicht, die Gerichtspraxis zur Dauer schon (nicht geprüft).

**In Maloja?** Ja, allgemein: `src/i18n/de.js:272` und `:382` («Eine Zeit lang läuft der Lohn
weiter; danach greift — wenn vorhanden — ein Krankentaggeld (KTG).»). Keine Dauer genannt — richtig
so, solange die Skalen unbelegt sind.

### 7 · Kündigung während der Krankheit

**Lage.** Wer krank ist und eine Kündigung erhält, weiss oft nicht, dass sie je nach Zeitpunkt
nichtig ist oder sich verschiebt.

**Verzweigung.** Nach der Probezeit und ohne eigenes Verschulden krank oder verunfallt? → Sperrfrist:
im 1. Dienstjahr 30 Tage, im 2.–5. Dienstjahr 90 Tage, ab dem 6. Dienstjahr 180 Tage. Kündigung
**während** der Sperrfrist ausgesprochen? → nichtig. **Vorher** ausgesprochen und die Frist lief
noch? → Die Kündigungsfrist ruht und läuft danach weiter, bis zum nächsten Endtermin.

**Quelle.** OR Art. 336c Abs. 1 Bst. b, Abs. 2 und 3 (SR 220, Fassung 1.1.2026). Wortlaut Abs. 2:
«Die Kündigung, die während einer der in Absatz 1 festgesetzten Sperrfristen erklärt wird, ist
nichtig […]».

**Status.** belegt · **Kantonal verschieden?** Nein. (Die Sperrfrist schützt nur vor Kündigung
durch den Arbeitgeber.)

**In Maloja?** Nicht gefunden (Stichworte `Sperrfrist`, `336c`).

### 8 · Krankheit oder Unfall? Und wer zahlt den Unfall in der Freizeit?

**Lage.** Ob etwas als Unfall gilt, entscheidet, welche Versicherung zahlt. Wer wenig arbeitet, ist
in der Freizeit oft nicht über den Arbeitgeber versichert, ohne es zu wissen.

**Verzweigung.** Plötzliche, unbeabsichtigte Einwirkung eines ungewöhnlichen äusseren Faktors? →
Unfall, sonst Krankheit. Mindestens acht Stunden pro Woche bei **einem** Arbeitgeber? → auch gegen
Nichtberufsunfälle versichert; sonst gilt nur der Arbeitsweg als Berufsunfall, und die Freizeit
muss über die Krankenkasse gedeckt sein. Voll nach UVG versichert? → Unfalldeckung in der
Krankenkasse kann auf Antrag ruhen.

**Quelle.** ATSG Art. 4 (SR 830.1, Fassung 1.1.2024) · UVG Art. 8 Abs. 2 (SR 832.20, Fassung 1.1.2026)
· UVV Art. 13 (SR 832.202, Fassung 1.1.2026) · KVG Art. 8 Abs. 1 (SR 832.10, Fassung 1.7.2026).
Wortlaut UVV Art. 13 Abs. 1: «[…] deren wöchentliche Arbeitszeit bei einem Arbeitgeber mindestens
acht Stunden beträgt, sind auch gegen Nichtberufsunfälle versichert.»

**Status.** belegt · **Kantonal verschieden?** Nein.

**In Maloja?** Ja: `src/components/UvgHinweis.jsx:5`, `src/i18n/de.js:695`, `:2139`. Nicht
ausdrücklich: dass die acht Stunden **pro Arbeitgeber** zählen (zwei Kleinpensen zusammen genügen
nicht).

### 9 · Stelle zu Ende: wie lange die Unfallversicherung nachwirkt

**Lage.** Nach dem letzten Arbeitstag läuft die Unfallversicherung noch eine Weile. Danach entsteht
eine Lücke, wenn niemand die Unfalldeckung in der Krankenkasse wieder einschliesst.

**Verzweigung.** Die Deckung endet am 31. Tag nach dem Tag, an dem der Anspruch auf **mindestens den
halben Lohn** aufhört (nicht zwingend der Austrittstag, z. B. bei Lohnfortzahlung oder
Krankentaggeld). Länger nötig? → Der Versicherer muss eine Verlängerung durch Abrede bis zu sechs
Monaten anbieten. Arbeitslos gemeldet? → Versichert über die ALV, solange die Voraussetzungen
erfüllt sind.

**Quelle.** UVG Art. 3 Abs. 1–3 (SR 832.20, Fassung 1.1.2026). Wortlaut Abs. 2: «Die Versicherung
endet mit dem 31. Tag nach dem Tag, an dem der Anspruch auf mindestens den halben Lohn aufhört
[…]».

**Status.** belegt · **Kantonal verschieden?** Nein.

**In Maloja?** Ja: `src/StelleVerloren.jsx:12` und `src/i18n/de.js:311` («endet 31 Tage nach dem
Austritt», Abredeversicherung erwähnt). Vereinfacht: Anknüpfung ist das Ende des halben
Lohnanspruchs, nicht der Austritt.

### 10 · Wann zur IV, und ab wann eine Rente möglich ist

**Lage.** Viele melden sich erst bei der IV, wenn das Krankentaggeld endet. Dabei hängt der
früheste Rentenbeginn an der Anmeldung, und eine Meldung zur Früherfassung dürfen auch andere
machen.

**Verzweigung.** Wer darf melden? → Die Person selbst und u. a. Familie im gleichen Haushalt,
Arbeitgeber, Ärztinnen und Ärzte, Versicherer, ALV, Sozialhilfe (vorher informieren). Rente
möglich? → Erst nach einem Jahr mit durchschnittlich mindestens 40 % Arbeitsunfähigkeit und danach
mindestens 40 % Invalidität, und erst wenn Eingliederung ausgeschöpft ist. Frühestens? → Sechs
Monate nach der Anmeldung.

**Quelle.** IVG Art. 3b Abs. 1–3, Art. 28 Abs. 1 und 1bis, Art. 29 Abs. 1 (SR 831.20, Fassung
1.1.2026). Wortlaut Art. 29 Abs. 1: «Der Rentenanspruch entsteht frühestens nach Ablauf von sechs
Monaten nach Geltendmachung des Leistungsanspruchs […]».

**Status.** belegt · **Kantonal verschieden?** Nein (kantonale IV-Stellen vollziehen Bundesrecht).

**In Maloja?** Ja: `src/i18n/de.js:385` (Früherfassung, «die IV zahlt frühestens sechs Monate
danach»). Nicht genannt: die Jahres-Wartezeit mit 40 % und wer ausser der Person selbst melden darf.

### 11 · Krankenkasse wechseln mit offenen Prämien

**Lage.** Wer Prämien schuldet, möchte oft zu einer günstigeren Kasse und merkt erst bei der
Absage, dass das nicht geht.

**Verzweigung.** Offene Prämien, Kostenbeteiligungen, Verzugszinsen oder Betreibungskosten? → Kein
Wechsel, bis alles bezahlt ist. Hat der Kanton die Forderungen übernommen und sich abtreten lassen?
→ Wechsel wieder möglich. Stammen die Schulden aus der Zeit der Minderjährigkeit? → Wer volljährig geworden
ist, darf trotzdem auf Ende Kalenderjahr wechseln.

**Quelle.** KVG Art. 64a Abs. 5, 6 und 7bis (SR 832.10, Fassung 1.7.2026). Wortlaut Abs. 6: «In
Abweichung von Artikel 7 kann die säumige versicherte Person den Versicherer nicht wechseln,
solange die ausstehenden Prämien, Kostenbeteiligungen, Verzugszinse und Betreibungskosten nicht
vollständig bezahlt sind.» Abs. 5: Abtretung an den Kanton, «In diesen Fällen kann die versicherte
Person den Versicherer in Abweichung von Absatz 6 wieder wechseln.» Abs. 7bis: Ausnahme für
volljährig Gewordene mit Ausständen aus der Minderjährigkeit.

**Status.** belegt · **Kantonal verschieden?** Das Wechselverbot nicht; ob und wann der Kanton
Forderungen übernimmt, ja (nicht geprüft).

**In Maloja?** Nicht gefunden (Stichworte `64a`, `säumig` nur in `src/utils/renderSource.js`, dort
ohne Bezug). Verwandt mit dem offenen Punkt «KK erstmals: junge Erwachsene» aus PR #342.

---

## C · Trennung

### 12 · Trennung: wer die Familienwohnung kündigen darf

**Lage.** Nach einer Trennung will oft eine Person ausziehen und den Mietvertrag kündigen, oder sie
bleibt allein zurück und weiss nicht, wem die Wohnung jetzt «gehört».

**Verzweigung.** Ist die Wohnung die Wohnung der Familie (Ehe oder eingetragene Partnerschaft)? →
Kündigen nur mit ausdrücklicher Zustimmung der anderen Person; wird sie ohne triftigen Grund
verweigert, entscheidet das Gericht. Wer bleibt wohnen? → Im Eheschutz regelt das Gericht auf
Begehren die Benützung von Wohnung und Hausrat sowie den Unterhalt. Konkubinat? → Diese Regeln
gelten nicht; es zählt, wer den Vertrag unterschrieben hat (Vertragsrecht, hier nicht vertieft).

**Quelle.** OR Art. 266m Abs. 1–3 (SR 220, Fassung 1.1.2026) · ZGB Art. 176 Abs. 1 (SR 210, Fassung
1.7.2026). Wortlaut OR 266m Abs. 1: «Dient die gemietete Sache als Wohnung der Familie, kann ein
Ehegatte den Mietvertrag nur mit der ausdrücklichen Zustimmung des anderen kündigen.»

**Status.** belegt · **Kantonal verschieden?** Nein.

**In Maloja?** Ja: `src/i18n/de.js:2670` (Kündigungsvorlage: Zustimmung beider Ehepartner, mit
Verweis auf ZGB Art. 169). Im Trennungs-Ablauf selbst nicht als Weiche.

### 13 · Trennung im Lauf des Jahres: Steuern für das ganze Jahr getrennt

**Lage.** Wer sich im Herbst trennt, rechnet oft mit einer gemeinsamen Steuererklärung bis zur
Trennung. Tatsächlich wird für die ganze Steuerperiode getrennt veranlagt.

**Verzweigung.** Leben die Ehegatten am Ende der Steuerperiode rechtlich **oder tatsächlich**
getrennt? → Getrennte Veranlagung für das ganze Jahr, je eine Steuererklärung. Kinder? → Der
Kinderabzug wird bei gemeinsamer Sorge und ohne Unterhaltsabzug hälftig geteilt. Unterhalt? →
Beim Empfang steuerbar, bei der Zahlung abziehbar.

**Quelle.** DBG Art. 9 Abs. 1 und Art. 35 Abs. 1 Bst. a und Abs. 2 (SR 642.11, Fassung 1.1.2026):
zusammengerechnet wird nur bei «rechtlich und tatsächlich ungetrennter Ehe», Sozialabzüge
richten sich nach den Verhältnissen am Ende der Steuerperiode. Ausdrücklich zum ganzen Jahr:
Steuerverwaltung Kanton Bern, «Trennung und Scheidung»
(<https://www.sv.fin.be.ch/de/start/themen/steuersituationen/trennung-und-scheidung.html>):
«[…] werden Eheleute bzw. eingetragene Partner/-innen für die ganze Steuerperiode getrennt
veranlagt und besteuert.» Gleich Steuerverwaltung Thurgau
(<https://steuerverwaltung.tg.ch/informationen/lebensbereiche/zivilstandsaenderung/trennung-scheidung.html/3502>).

**Status.** teilweise belegt. **Nicht gelesen:** ESTV-Kreisschreiben Nr. 30 (Ehepaar- und
Familienbesteuerung), der Abruf lieferte am 24.09.2026 «502 Bad Gateway». Die Bundesebene ist damit
nur über das Gesetz und zwei Kantone belegt.

**Kantonal verschieden?** Geprüft: BE, TG (beide «ganze Steuerperiode»). Tarife und Abzüge der
Kantone unterscheiden sich (nicht geprüft).

**In Maloja?** Ja, aber ungenau: `src/i18n/de.js:507` sagt «**Ab der Trennung** werden Sie getrennt
besteuert». Richtig wäre: für das ganze Trennungsjahr. Prüfen und korrigieren (eigener Auftrag).

---

## D · Pflege und Urteilsunfähigkeit

### 14 · Angehörige pflegen: Urlaub, Entschädigung, AHV-Gutschrift

**Lage.** Wer Angehörige betreut, verliert oft Lohn und Rentenjahre, ohne die drei Wege zu kennen,
die das Gesetz dafür vorsieht, und deren unterschiedliche Bedingungen.

**Verzweigung.** Kurze Betreuung eines Familienmitglieds oder der Lebenspartnerin bzw. des
Lebenspartners? → Bezahlter Urlaub beim Arbeitgeber, höchstens drei Tage pro Ereignis und zehn Tage
pro Jahr. Schwer krankes oder verunfalltes **minderjähriges Kind**? → Betreuungsentschädigung der EO
und bis zu 14 Wochen Urlaub innerhalb von 18 Monaten, bei zwei angestellten Eltern je sieben Wochen.
Betreuung von Verwandten mit anerkannter **Hilflosenentschädigung**, in leichter Erreichbarkeit
(höchstens 30 km oder innert einer Stunde)? → AHV-Betreuungsgutschrift, jährlich schriftlich
anmelden; eine Lebenspartnerschaft zählt erst nach fünf Jahren gemeinsamem Haushalt.

**Quelle.** OR Art. 329h und 329i (SR 220, Fassung 1.1.2026) · EOG Art. 16n und 16o (SR 834.1,
Fassung 1.6.2026) · AHVG Art. 29septies Abs. 1 (SR 831.10, Fassung 1.1.2026) · AHVV Art. 52g
(SR 831.101, Fassung 1.1.2026), Wortlaut: «[…] wenn die Betreuungsperson nicht mehr als 30 km
entfernt von der betreuten Person wohnt oder diese innert einer Stunde erreichen kann.»

**Status.** belegt. Damit ist auch der offene Punkt aus PR #342 «Betreuungsgutschrift ohne
Voraussetzungen (HE-Bezug, ≤30 km/1 h)» belegt. Der Stundensatz CHF 37.90 aus PR #342 bleibt
unbelegt (nicht Teil dieser Sammlung).

**Kantonal verschieden?** Nein.

**In Maloja?** Ja: `src/i18n/de.js:88–89`, `src/PflegeAblauf.jsx:6`, `src/data/eoRechner.js`.
**Zu prüfen:** `src/i18n/de.js:89` sagt «dazu Kurzurlaub für Angehörige — entschädigt über die EO».
OR 329h gibt einen Anspruch auf **bezahlten Urlaub** gegenüber dem Arbeitgeber, und im EOG
(Fassung 1.6.2026) fand sich kein Bezug auf Art. 329h (Suche nach «329» im Text: 0 Treffer). Die
Aussage «über die EO» für den Kurzurlaub ist damit nicht belegt. Die Voraussetzung
«Hilflosenentschädigung» für die Gutschrift nennt `de.js:88` nicht.

### 15 · Wenn jemand nicht mehr selbst entscheiden kann: wer darf was?

**Lage.** Nach einem Unfall oder bei Demenz dürfen nahe Menschen nicht automatisch alles
erledigen. Im Konkubinat ist die Grenze besonders überraschend: mitentscheiden in der Medizin ja,
Rechnungen bezahlen nein.

**Verzweigung.** Gibt es einen Vorsorgeauftrag oder eine Beistandschaft? → Diese gehen vor. Sonst:
Ehegatte oder eingetragene Partnerschaft mit gemeinsamem Haushalt oder regelmässigem Beistand? →
Gesetzliches Vertretungsrecht für Alltag, ordentliche Verwaltung, Post; für Ausserordentliches
Zustimmung der Erwachsenenschutzbehörde. **Medizinische** Entscheide? → Feste Reihenfolge, in der
an vierter Stelle auch die Person steht, die mit der betroffenen Person einen gemeinsamen Haushalt
führt und ihr regelmässig beisteht, also auch eine Konkubinatspartnerin oder ein
Konkubinatspartner. Für Geld und Verträge gilt das nicht.

**Quelle.** ZGB Art. 374 Abs. 1–3 und Art. 378 Abs. 1 (SR 210, Fassung 1.7.2026). Wortlaut 378
Abs. 1 Ziff. 4: «die Person, die mit der urteilsunfähigen Person einen gemeinsamen Haushalt führt
und ihr regelmässig und persönlich Beistand leistet».

**Status.** belegt · **Kantonal verschieden?** Das Recht nicht; die Behörde (KESB) ist kantonal
organisiert.

**In Maloja?** Teilweise: `src/i18n/de.js:714`, `:987`, `:1016` (Vorsorgeauftrag,
Patientenverfügung). Nicht gefunden: das gesetzliche Vertretungsrecht und die
Konkubinats-Grenze (`git grep -i Vertretungsrecht`: kein inhaltlicher Treffer).

---

## E · Tod

### 16 · Nach einem Todesfall: wer darf aufs Konto, und ab wann?

**Lage.** Angehörige wollen Rechnungen bezahlen und stellen fest, dass die Bank sperrt, obwohl sie
eine Vollmacht hatten. Gleichzeitig läuft eine Frist, von der viele erst spät hören.

**Verzweigung.** Gab es eine Vollmacht? → Sie erlischt mit dem Tod, **ausser** es war anders
bestimmt oder ergibt sich aus der Natur des Geschäfts. Wer erbt? → Die Erbinnen und Erben erwerben
den Nachlass mit dem Tod, auch die Schulden. Überschuldet oder unklar? → Ausschlagen innert drei
Monaten ab Kenntnis vom Tod, oder innert eines Monats ein öffentliches Inventar verlangen. Wie
weisen eingesetzte Erben sich aus? → Bescheinigung der Behörde frühestens einen Monat nach der
Mitteilung an die Beteiligten.

**Quelle.** OR Art. 35 Abs. 1 (SR 220, Fassung 1.1.2026) · ZGB Art. 559 Abs. 1, 560 Abs. 1–2, 566,
567, 580 Abs. 1–2 (SR 210, Fassung 1.7.2026). Wortlaut ZGB 567 Abs. 1: «Die Frist zur Ausschlagung
beträgt drei Monate.»

**Status.** teilweise belegt. **Nicht belegt:** wie gesetzliche Erbinnen und Erben (ohne Testament)
ihre Erbenstellung gegenüber der Bank nachweisen und welche Stelle die Erbbescheinigung ausstellt.
ZGB 559 regelt nur eingesetzte Erben; die Praxis ist kantonal. Nachfragen bei: Erbschaftsbehörde
bzw. Notariat des Wohnkantons (z. B. Erbschaftsamt Basel-Stadt).

**Kantonal verschieden?** Ja, die zuständige Behörde. Nicht geprüft.

**In Maloja?** Teilweise: `src/Todesfall.jsx:9` und `:14`, `src/i18n/de.js:341`, `:344`
(Ausschlagung, drei Monate). Nicht gefunden: öffentliches Inventar (ein Monat), Erlöschen der
Vollmacht, Erbbescheinigung.

### 17 · Tod im Konkubinat

**Lage.** Wer unverheiratet zusammenlebt, geht oft davon aus, im Todesfall ähnlich abgesichert zu
sein wie ein Ehepaar. Von Gesetzes wegen ist das nicht so.

**Verzweigung.** Ehe oder eingetragene Partnerschaft? → Gesetzliches Erbrecht, AHV-Hinterlassenenrente
nach den Voraussetzungen. Konkubinat? → Kein gesetzliches Erbrecht (die Erbfolge nennt Nachkommen,
elterlichen Stamm und Ehegatten bzw. eingetragene Partner) und keine AHV-Witwen- oder
Witwerrente. Pensionskasse? → Nur wenn das **Reglement** es vorsieht, z. B. nach fünf Jahren
ununterbrochener Lebensgemeinschaft oder bei gemeinsamen Kindern.

**Quelle.** ZGB Art. 457 und 462 (SR 210, Fassung 1.7.2026) · AHVG Art. 23 und 24 (SR 831.10, Fassung
1.1.2026) · BVG Art. 20a Abs. 1 Bst. a (SR 831.40, Fassung 1.1.2025). Wortlaut BVG 20a Abs. 1: «Die
Vorsorgeeinrichtung **kann** in ihrem Reglement […] folgende begünstigte Personen […] vorsehen».

**Status.** belegt · **Kantonal verschieden?** Nein. (Erbschaftssteuern für Konkubinatspaare sind
kantonal und hier nicht geprüft.)

**In Maloja?** Nicht gefunden als eigener Hinweis. Konkubinat erscheint in Steuerteilen
(`src/data/kantonaleSteuerdaten.js`, `src/TaxCalculator.jsx`).

---

## F · Junge Erwachsene und Aufenthalt

### 18 · Mit 18 ausziehen und Sozialhilfe brauchen (die «Indikation Wohnen»)

**Lage.** Junge Erwachsene, die zu Hause nicht bleiben können, hören auf dem Sozialamt, eine eigene
Wohnung werde «nur ausnahmsweise» bezahlt. Die Regeln sind streng und von Kanton zu Kanton
verschieden.

**Verzweigung.** Alter zwischen dem vollendeten 18. und dem vollendeten 25. Altersjahr? → Es gelten
die Sonderregeln für junge Erwachsene. Keine abgeschlossene Erstausbildung? → Erwartet wird Wohnen
bei den Eltern, soweit zumutbar. Gibt es einen anerkannten Grund für eine eigene Wohnung
(medizinische Gründe, eigene Kinder, Eltern im Ausland, nachweislich unzumutbares Zusammenleben)?
→ Unterstützung möglich, oft nur mit halbem ortsüblichem Mietzins oder dem Ansatz einer
Wohngemeinschaft. Ohne anerkannten Grund? → Nach einer Übergangsfrist Ansätze wie in einer
Zweck-Wohngemeinschaft. Ab dem vollendeten 25. Altersjahr fallen diese Sonderregeln weg (in zwei
Kantonen gilt die Altersgrenze länger, siehe unten).

**Quellen.**
- SKOS, Grundlagenpapier «Junge Erwachsene in der Sozialhilfe», Bern 2026, S. 6
  (<https://skos.ch/fileadmin/user_upload/skos_main/public/pdf/Publikationen/Grundlagenpapiere/2026_Junge_Erwachsene_in_der_Sozialhilfe_D.pdf>):
  verweist auf SKOS-RL C.3.2; normaler Grundbedarf für junge Erwachsene, die arbeiten, in
  Ausbildung sind oder eigene Kinder betreuen, «sofern ein Leben in einem eigenen Haushalt
  ausnahmsweise gerechtfertigt ist»; «in zwei Kantonen [wird] die Altersgrenze für junge
  Erwachsene breiter ausgelegt (bis 30 respektive 35 Jahren)» (Kantone dort nicht genannt).
- Kanton Zürich, Sozialhilfehandbuch 7.1.06 «Grundbedarf für junge Erwachsene», gültig seit
  1.1.2023 (<https://www.zh.ch/de/soziales/sozialhilfe/sozialhilfehandbuch/flexdata-definition/7-materielle-grundsicherung-wsh/7-1-grundbedarf-gbl/7-1-06-grundbedarf-fuer-junge-erwachsene.html>):
  junge Erwachsene sind «alle Menschen zwischen dem vollendeten 18. und dem vollendeten
  25. Altersjahr»; eigener Haushalt ohne anerkannte Gründe nach Übergangsfrist wie Zweck-WG.
- Kanton Solothurn, Praxis Sozialhilfe «Wohnkosten junge Erwachsene»
  (<https://sozialhilfehandbuch.so.ch/praxis-sozialhilfe/materielle-grundsicherung/wohnkosten/wohnkosten-junge-erwachsene/>):
  Ausnahmegründe wie oben; höchstens die Hälfte des ortsüblichen Mietzinses (§ 93 Abs. 1bis Bst. b
  Sozialverordnung SO), ausser mit eigenen Kindern.
- Kanton Aargau, Handbuch Soziales 7.2.7 «Wohnungskosten junger Erwachsener», publiziert 17.12.2025
  (<https://www.ag.ch/de/themen/soziales-gesellschaft/soziale-sicherheit/handbuch-soziales/7-materielle-grundsicherung/7-2-wohnungskosten/7-2-7-wohnungskosten-junger-erwachsener>):
  eigener Haushalt grundsätzlich nicht gerechtfertigt; verweist auf SKOS-RL C.4.2.
- Kanton Basel-Stadt, Unterstützungsrichtlinien WSU, gültig ab 1.1.2026, Ziff. 6.1–6.3
  (<https://media.bs.ch/original_file/8ed016dbcae7b24e4bb7e4d333c71072442b2d80/unterstuetzungsrichtlinien-wsu-2026.pdf>):
  18–25 Jahre; reguläre Ansätze nur mit abgeschlossener Erstausbildung oder mit Kindern im
  Haushalt; sonst höchstens der Ansatz für eine Person im Zweipersonenhaushalt; in Ausbildung
  Annahme eines gemeinsamen Haushalts mit den Eltern, ausser das Zusammenleben ist nicht zumutbar.

**Status.** teilweise belegt.
- **Belegt:** Die Sache hinter der Fachaussage stimmt: 18 bis 25 gelten Sonderregeln, eine eigene
  Wohnung wird nur mit anerkanntem Grund unterstützt, und ab 25 fallen die Sonderregeln weg.
- **Nicht belegt:** der Begriff **«Indikation Wohnen»**. Er kommt in keiner der gelesenen Quellen
  vor (SKOS-Papier 2026, ZH, SO, AG, BS); die Suche danach fand nur deutsche Seiten zum betreuten
  Wohnen. Die Behörden sprechen von «gerechtfertigtem» oder «ausnahmsweise begründetem» eigenem
  Haushalt. Auch «Unterstützung oft erst ab 25» ist so zu grob: Unterstützung gibt es ab 18, nur
  eingeschränkt beim Wohnen.
- **Nicht gelesen:** der Wortlaut der SKOS-Richtlinien C.3.2 und C.4.2 selbst. Die Online-Fassung
  `rl.skos.ch` lieferte beim Abruf nur eine leere Seitenhülle («Erlasse»). Nachfragen bei: SKOS
  (skos.ch) oder die Kapitel als PDF beziehen.

**Kantonal verschieden?** Ja, deutlich. Geprüft: ZH, SO, AG, BS. Welche zwei Kantone die
Altersgrenze auf 30 bzw. 35 ausdehnen, steht im SKOS-Papier nicht; nicht ermittelt.

**In Maloja?** Nicht für die Sozialhilfe. «Junge Erwachsene» erscheint nur bei der
Prämienverbilligung (`src/config/cantonalData.js:395`, `src/config/ipvBern.js`, `ipvLuzern.js`,
`ipvAargau.js`).

### 19 · Sozialhilfe beziehen ohne Schweizer Pass

**Lage.** Menschen mit Aufenthalts- oder Niederlassungsbewilligung verzichten oft aus Angst um die
Bewilligung auf Sozialhilfe, oder sie beziehen sie, ohne das Risiko zu kennen. Beides kann schaden.

**Verzweigung.** Aufenthaltsbewilligung (B) oder andere Bewilligung ausser C? → Kann widerrufen
werden, wenn die Person oder jemand, für den sie sorgt, auf Sozialhilfe angewiesen ist.
Niederlassungsbewilligung (C)? → Widerruf nur bei «dauerhaft und in erheblichem Mass» Sozialhilfe;
zudem kann C durch B ersetzt werden, wenn Integrationskriterien fehlen.

**Quelle.** AIG Art. 62 Abs. 1 Bst. e und Art. 63 Abs. 1 Bst. c und Abs. 2 (SR 142.20, Fassung
1.2.2026). Wortlaut 63 Abs. 1 Bst. c: «[…] dauerhaft und in erheblichem Mass auf Sozialhilfe
angewiesen ist».

**Status.** teilweise belegt. **Nicht belegt:** ab welchem Betrag oder welcher Dauer die Behörden
«erheblich» und «dauerhaft» annehmen, und dass IPV, EL oder Stipendien **nicht** als Sozialhilfe
zählen (das steht nicht im gelesenen Gesetzestext; vgl. offenen Punkt «IPV schadet der Bewilligung
nicht» in PR #342). Nachfragen bei: Staatssekretariat für Migration (SEM, Weisungen AIG) und dem
kantonalen Migrationsamt.

**Kantonal verschieden?** Das Gesetz nicht, der Vollzug durch die Migrationsämter ja. Nicht geprüft.

**In Maloja?** Nicht gefunden als Hinweis bei der Sozialhilfe. `src/i18n/de.js:149` nennt
Sozialhilfe «ein Recht, keine Fürsorge», ohne die Bewilligungsfrage.

---

## Kandidaten für die nächste Runde (noch ohne Status)

- **Verwandtenunterstützung** — ZGB Art. 328 Abs. 1 ist gelesen («Wer in günstigen Verhältnissen
  lebt, ist verpflichtet, Verwandte in auf- und absteigender Linie zu unterstützen […]»). Unbelegt:
  ab welchem Einkommen die Sozialhilfe Angehörige heranzieht (SKOS-RL, Kapitel noch nicht gelesen).
- **AHV-Beiträge ohne Erwerb** (nach der Aussteuerung, im Studium, bei Frühpensionierung) — AHVG
  Art. 3 und 10 gelesen. Achtung: der Mindestbeitrag im Gesetzestext ist durch Verordnung angepasst;
  aktuellen Betrag nur aus AHVV oder Merkblatt 2.03 übernehmen.
- **Arztzeugnis «oft ab dem 3. Tag»** (`src/i18n/de.js:272`) — keine gesetzliche Regel gefunden;
  hängt am Arbeitsvertrag. Quelle fehlt.

## Funde für Maloja (je ein eigener Auftrag, hier nichts geändert)

1. `src/i18n/de.js:4647` und `src/data/alvRechner.js:49`: Die Befreiung von der Beitragszeit nach
   Trennung, Scheidung oder Tod (AVIG 14 Abs. 2, 90 Taggelder) fehlt; der Satz «sonst meist kein
   Anspruch» trifft genau diese Menschen falsch.
2. `src/i18n/de.js:507`: «Ab der Trennung» getrennt besteuert → für die **ganze** Steuerperiode
   (BE, TG; DBG 9).
3. `src/i18n/de.js:89`: Kurzurlaub für Angehörige «entschädigt über die EO» → OR 329h: bezahlter
   Urlaub beim Arbeitgeber; im EOG kein Bezug gefunden.
4. `src/i18n/de.js:311` / `src/StelleVerloren.jsx:12`: Unfalldeckung endet am 31. Tag nach Ende des
   Anspruchs auf mindestens den halben Lohn, nicht zwingend nach dem Austritt (UVG 3 Abs. 2).

## Quellen: Gesetzestexte (Fedlex-Dateispeicher, abgerufen 24.09.2026)

| Erlass | SR | Fassung | Datei |
|---|---|---|---|
| AVIG | 837.0 | 1.1.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1982/2184_2184_2184/20260101/de/html/fedlex-data-admin-ch-eli-cc-1982-2184_2184_2184-20260101-de-html.html> |
| ÜLG | 837.2 | 1.1.2025 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2021/373/20250101/de/html/fedlex-data-admin-ch-eli-cc-2021-373-20250101-de-html.html> |
| ELG | 831.30 | 1.1.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2007/804/20260101/de/html/fedlex-data-admin-ch-eli-cc-2007-804-20260101-de-html.html> |
| IVG | 831.20 | 1.1.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1959/827_857_845/20260101/de/html/fedlex-data-admin-ch-eli-cc-1959-827_857_845-20260101-de-html.html> |
| AHVG | 831.10 | 1.1.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/63/837_843_843/20260101/de/html/fedlex-data-admin-ch-eli-cc-63-837_843_843-20260101-de-html.html> |
| AHVV | 831.101 | 1.1.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/63/1185_1183_1185/20260101/de/html/fedlex-data-admin-ch-eli-cc-63-1185_1183_1185-20260101-de-html.html> |
| BVG | 831.40 | 1.1.2025 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1983/797_797_797/20250101/de/html/fedlex-data-admin-ch-eli-cc-1983-797_797_797-20250101-de-html.html> |
| ATSG | 830.1 | 1.1.2024 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2002/510/20240101/de/html/fedlex-data-admin-ch-eli-cc-2002-510-20240101-de-html.html> |
| UVG | 832.20 | 1.1.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1982/1676_1676_1676/20260101/de/html/fedlex-data-admin-ch-eli-cc-1982-1676_1676_1676-20260101-de-html.html> |
| UVV | 832.202 | 1.1.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1983/38_38_38/20260101/de/html/fedlex-data-admin-ch-eli-cc-1983-38_38_38-20260101-de-html.html> |
| KVG | 832.10 | 1.7.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1995/1328_1328_1328/20260701/de/html/fedlex-data-admin-ch-eli-cc-1995-1328_1328_1328-20260701-de-html.html> |
| EOG | 834.1 | 1.6.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1952/1021_1046_1050/20260601/de/html/fedlex-data-admin-ch-eli-cc-1952-1021_1046_1050-20260601-de-html.html> |
| OR | 220 | 1.1.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/27/317_321_377/20260101/de/html/fedlex-data-admin-ch-eli-cc-27-317_321_377-20260101-de-html.html> |
| ZGB | 210 | 1.7.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/24/233_245_233/20260701/de/html/fedlex-data-admin-ch-eli-cc-24-233_245_233-20260701-de-html.html> |
| DBG | 642.11 | 1.1.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1991/1184_1184_1184/20260101/de/html/fedlex-data-admin-ch-eli-cc-1991-1184_1184_1184-20260101-de-html.html> |
| AIG | 142.20 | 1.2.2026 | <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2007/758/20260201/de/html/fedlex-data-admin-ch-eli-cc-2007-758-20260201-de-html.html> |
