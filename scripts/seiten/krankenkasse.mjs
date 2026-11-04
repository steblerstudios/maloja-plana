// ─── Hintergrundseite: Warum die Krankenkasse so viel kostet ─────────────────
//
// Entscheid Stebler Studios, 04.11.2026 («Weg A»): die Erklärseite zum
// Krankenkassensystem wird eine eigene, leichte Maloja-Seite vor dem Gate, im
// Muster von /praemienverbilligung/, mit den Kantonszahlen aus Malojas eigenen
// Daten. Vorschlag und Entscheid: stebler-studios/VORSCHLAG-erklaerseiten-in-
// maloja-2026-11-04.md (ausserhalb dieses Repos).
//
// Herkunft des Textes: die Erklärseite «Krankenkasse erklärt» (Fassung vom
// 02.11.2026, damals fachlich gegengelesen), hier auf «Sie» umgestellt und ohne
// die bewegten Figuren. Die Figuren sind statische SVG aus scripts/seiten-figuren.mjs.
//
// ─── WARUM HIER ZAHLEN STEHEN DÜRFEN ────────────────────────────────────────
// Die Erklärseiten (scripts/seiten-inhalt.mjs) nennen bewusst keine Zahlen,
// weil eine Zahl auf einer statischen Seite still veraltet. Diese Seite lebt
// von Zahlen — ohne sie lässt sich nicht zeigen, warum die Prämie so hoch ist.
// Darum ist sie keine Erklärseite, sondern eine eigene Art mit drei Riegeln:
//
//   1. Was Maloja selbst führt (Prämien 2027, Franchisen, Selbstbehalt), kommt
//      beim Bauen aus Malojas Daten — {{platzhalter}} im Text, nie abgetippt.
//   2. Oben steht sichtbar, welchen Stand die Zahlen haben.
//   3. `pruefenBis`: danach wird src/__tests__/hintergrundSeiten.test.js rot,
//      bis jemand den Text gegen die neuen BAG-Zahlen gelesen hat. Ende
//      September veröffentlicht das BAG die Prämien des Folgejahres.
//
// Nur Deutsch, bis eine Übersetzung gegengelesen ist. Es gibt keine fr/it/en/rm-
// Fassung, also auch keinen Sprachumschalter auf diese Seite.
// ─────────────────────────────────────────────────────────────────────────────

export const KRANKENKASSE = {
  pfad: 'krankenkasse',
  titel: 'Warum die Krankenkasse so viel kostet',
  beschreibung:
    'Wie aus den Behandlungskosten Ihre Prämie wird, wer für wen zahlt und warum andere weniger zahlen. Die Grundversicherung in acht Fragen, mit den Prämien {{jahr}}.',
  brotkrume: 'Krankenkasse erklärt',
  stand: 'Prämien {{jahr}} (BAG, September und Oktober 2026), Kosten 2024 und 2025 (BAG). Fachlich gegengelesen November 2026.',
  pruefenBis: '2027-10-15',
  // Eigene Hinweise statt der Rahmentexte der Erklärseiten: jene sagen «nennt
  // bewusst keine Beträge», das wäre hier falsch.
  hinweis:
    'Orientierung, keine Rechts- oder Finanzberatung. Die Zahlen sind Durchschnitte; die eigene Prämie zeigt der Prämienrechner des Bundes.',
  vorbehalt:
    'Diese Seite ist eine <strong>Orientierungshilfe auf Basis öffentlicher Informationen — keine Rechts-, Versicherungs- oder Finanzberatung</strong>. Anders als die übrigen Erklärseiten nennt sie Zahlen, damit sich das System verstehen lässt. Es sind Durchschnitte mit dem oben genannten Stand, und sie ändern jedes Jahr. Massgebend sind die eigene Police, die eigene Kasse und die zuständige Stelle.',
  vorspann:
    'Die Krankenkasse ist ein grosser gemeinsamer Topf. Alle zahlen jeden Monat ein, und wer krank wird, bekommt die Behandlung daraus bezahlt. Die Prämie ist am Ende nur eines: das, was aus dem Topf herausging, geteilt durch alle, die einzahlen.',
  inhaltsverzeichnis: true,
  abschnitte: [
    {
      id: 'topf',
      titel: '1. Warum ein gemeinsamer Topf?',
      html: `
        <p>Stellen Sie sich ein Dorf mit 100 Menschen vor. Niemand weiss, wen es dieses Jahr trifft. Eine Krebstherapie kann mehr kosten, als eine Familie je sparen könnte. Allein wäre das nicht zu bezahlen. Zu hundert schon.</p>
        <p>Das Bild zeigt dieses Dorf mit echten Zahlen. Jede Säule ist ein Mensch, die Höhe ist, was 2024 für diese Person über die Grundversicherung abgerechnet wurde. Der Kantonsanteil am Spital ist nicht dabei.</p>
<!--FIG:dorf-->
<!--TAB:dorf-->
        <p class="merke"><strong>Das Wichtigste auf dieser Seite:</strong> Die 61 Menschen, die am wenigsten kosten, brauchen zusammen rund 11 % des Geldes oder weniger. Die 5 Teuersten brauchen mindestens 27 %, vermutlich deutlich mehr. Der Topf funktioniert nur, weil die vielen Gesunden die wenigen Schwerkranken tragen. Und nächstes Jahr können auch Sie zu den wenigen gehören.</p>`,
    },
    {
      id: 'querfinanzierung',
      titel: '2. Wer zahlt für wen? Die Querfinanzierung',
      html: `
        <p>«Querfinanzierung» heisst: Die einen zahlen mehr ein, als sie brauchen, und andere bekommen mehr heraus, als sie einzahlen. Das ist kein Fehler. Es ist der Sinn der Sache. In der Grundversicherung gibt es vier solche Ströme.</p>
        <h3>Von Gesund zu Krank</h3>
        <p>Das ist der Grundgedanke. Die Kasse darf niemanden ablehnen und von Kranken keine höhere Prämie verlangen.</p>
        <h3>Von Jung zu Alt</h3>
        <p>Ab 26 zahlen bei gleicher Kasse, gleichem Modell, gleicher Franchise, gleicher Unfalldeckung und gleicher Region alle dieselbe Prämie, egal wie alt. Die Kosten sind aber überhaupt nicht gleich:</p>
<!--FIG:alter-->
        <p>Eine Person zwischen 26 und 30 kostete die Kasse 2024 im Schnitt {{alter.jung}} Franken, eine zwischen 81 und 85 schon {{alter.alt}} Franken, also fast siebenmal so viel. Im Schnitt aller ab 26 waren es {{alter.schnitt}} Franken. Bis 60 liegt man darunter, ab 61 darüber. Über das ganze Leben gleicht sich das teilweise aus: Heute Junge sind später selbst die Alten.</p>
        <h3>Von Reich zu Arm</h3>
        <p>Die Prämie selbst kennt keinen Reichtum: Sie ist pro Kopf gleich, ob jemand 40'000 oder 400'000 Franken verdient. Der Ausgleich läuft über die Steuern. Bund und Kantone verbilligten 2023 die Prämien von knapp 2,5 Millionen Menschen mit rund 5,9 Milliarden Franken. Und bei stationären Behandlungen in Listenspitälern zahlt der Wohnkanton aus Steuern mindestens 55 % der Vergütung.</p>
        <h3>Von Kasse zu Kasse</h3>
        <p>Eine Kasse mit vielen Jungen und Gesunden wäre sonst billig, eine mit vielen Alten teuer, und alle würden nur noch Gesunde anlocken. Darum gibt es den Risikoausgleich: Kassen mit günstigen Versicherten zahlen an Kassen mit teuren. Für 2024 flossen so netto rund 1,1 Milliarden Franken.</p>`,
    },
    {
      id: 'franchise',
      titel: '3. Warum gibt es Franchise und Selbstbehalt?',
      html: `
        <p>Stellen Sie sich ein Buffet vor, bei dem alle schon bezahlt haben. Wer schon bezahlt hat, nimmt eher mehr. Die Kostenbeteiligung soll genau das bremsen. Sie hat laut Bundesrat zwei Ziele: Kleinigkeiten nicht über die Versicherung laufen zu lassen und die Eigenverantwortung zu stärken. Laut Bundesrat wirkt das auch: Steigt die Kostenbeteiligung für alle, sinken die Leistungskosten.</p>
        <p><strong>Franchise:</strong> Der Betrag, den Sie jedes Jahr zuerst selbst zahlen. Erwachsene wählen zwischen {{franchise.min}} und {{franchise.max}} Franken. Je höher, desto tiefer die Prämie, denn Sie nehmen dem Topf etwas ab.</p>
        <p><strong>Selbstbehalt:</strong> Danach zahlen Sie noch {{selbstbehalt.satz}} % jeder Rechnung, bis höchstens {{selbstbehalt.max}} Franken im Jahr. Das ist der Schutz: Der Selbstbehalt hat ein Dach. Zusammen mit der Franchise zahlen Sie im Jahr höchstens {{dach.min}} bis {{dach.max}} Franken, je nach gewählter Franchise. Im Bild knicken die Linien dort ab und laufen waagrecht weiter.</p>
<!--FIG:kostenteil-->
        <p>Das Bild zeigt die Grundregel. Zwei Dinge liegen ausserhalb: 15 Franken je Spitaltag, und bei gewissen Medikamenten, für die es günstigere Alternativen gibt, 40 statt 10 % Selbstbehalt, der nur zum Teil ans Dach zählt. Für Kinder gilt keine ordentliche Franchise (wählbar sind tiefe Stufen) und die Hälfte des Dachs, also {{selbstbehalt.kinder}} Franken. Die Pflege im Heim hat eigene Regeln.</p>
        <p>Das hat Folgen, die man im Alltag merkt. Von den 26- bis 30-Jährigen bekamen 2024 rund 64 von 100 im ganzen Jahr keinen Franken von der Kasse. Bei 28 davon lag der Kasse gar keine Rechnung vor, bei 36 blieb alles innerhalb der eigenen Kostenbeteiligung. Prämien zahlten sie trotzdem. Über alle Altersgruppen waren es 37 von 100.</p>
        <p>Und der Haken: Die Bremse wirkt bei allen gleich stark in Franken, aber nicht gleich stark im Leben. 500 Franken sind für manche ein Abendessen, für andere ein Monatsbudget. Fast ein Viertel der Bevölkerung gab 2023 an, im letzten Jahr aus Kostengründen auf eine Behandlung verzichtet zu haben. Die Befragung sagt allerdings nicht, ob das aus Not oder freiwillig geschah. Auch der Bundesrat hält fest: Wird eine Behandlung aufgeschoben, können später deutlich höhere Kosten entstehen. Und hohe Franchisen wählen vor allem Menschen, die ohnehin wenig Kosten erwarten.</p>`,
    },
    {
      id: 'preise',
      titel: '4. Woher kommen die Preise?',
      html: `
        <p>Im Laden sieht man den Preis und entscheidet. Beim Arzt nicht. Man kennt den Preis nicht, kann schlecht vergleichen, und oft entscheidet jemand anderes, was nötig ist. Darum gibt es keinen freien Markt. Preise werden ausgehandelt oder vom Staat festgelegt.</p>
        <div class="tabelle"><table>
          <caption>Was die Grundversicherung 2025 je Person und Monat bezahlte</caption>
          <tr><th scope="col">Bereich</th><th scope="col" class="n">Fr./Mt.</th><th scope="col">So entsteht der Preis</th></tr>
          <tr><td>Arzt ambulant</td><td class="n">93</td><td>Eine Preisliste für Arbeitsschritte (TARDOC, seit 2026) und Pauschalen. Jede Leistung hat Punkte, die Punkte mal Taxpunktwert ergeben den Preis.</td></tr>
          <tr><td>Medikamente</td><td class="n">89</td><td>Das BAG legt den Preis in der Spezialitätenliste fest und schaut dabei auf das Ausland und auf den Nutzen.</td></tr>
          <tr><td>Spital stationär</td><td class="n">75</td><td>Eine Pauschale pro Fall (SwissDRG): ein schwierigerer Fall bringt mehr Geld. Den Grundpreis handeln Spital und Kassen aus, der Kanton genehmigt ihn.</td></tr>
          <tr><td>Spital ambulant</td><td class="n">56</td><td>Dieselbe Tarifstruktur wie in der Praxis, der Taxpunktwert kann abweichen.</td></tr>
          <tr><td>Pflegeheime</td><td class="n">21</td><td>Die Kasse zahlt einen festen Beitrag je Pflegestufe, den Rest der Pflege teilen sich Bewohnende und Kantone.</td></tr>
          <tr><td>Labor, Physio, Spitex, Hilfsmittel, Übriges</td><td class="n">77</td><td>Eigene Tarife und Listen.</td></tr>
        </table></div>
        <p class="leise">Franken je Monat und Person, 2025, noch unter dem alten Tarif, vor Abzug der Kostenbeteiligung. Zusammen 411 Franken (gerundet). Beim Spital stationär nur der Kassenanteil; der Kanton zahlt mindestens 55 % dazu.</p>
        <p>Ein Preis allein macht aber noch keine Kosten. Es gilt immer: <strong>Kosten = Preis mal Menge.</strong> Die Rechnung steigt, wenn eine Behandlung teurer wird oder wenn mehr davon gemacht wird. Das ist wichtig für Frage 7.</p>`,
    },
    {
      id: 'praemie',
      titel: '5. Wie wird daraus die Prämie?',
      html: `
        <p>So setzt sich die Prämie zusammen. Jede Kasse rechnet für jede Region und Altersgruppe wie mit einem Rezept. Hier mit den echten Zahlen von 2025, pro Person und Monat:</p>
        <div class="tabelle"><table>
          <caption>Das Rezept der Prämie, 2025, je Person und Monat</caption>
          <tr><th scope="row">Was die Grundversicherung für Behandlungen bezahlte (ohne Kantonsanteil am Spital)</th><td class="n">411 Fr.</td></tr>
          <tr><th scope="row">minus was die Versicherten selbst zahlten</th><td class="n">− 54 Fr.</td></tr>
          <tr><th scope="row">bleibt für den Topf</th><td class="n">357 Fr.</td></tr>
          <tr><th scope="row">plus Verwaltung der Kassen (Wert 2024)</th><td class="n">+ 16 Fr.</td></tr>
          <tr><th scope="row">plus oder minus Reserven</th><td class="n">je nach Kasse</td></tr>
        </table></div>
        <p class="leise">Bei der einzelnen Kasse kommt der Risikoausgleich dazu, als Zuschlag oder als Abzug. Über alle Kassen hebt er sich auf.</p>
        <p>Das ist eine Schätzung fürs nächste Jahr, denn die Prämie muss im Voraus feststehen. Die Kassen reichen ihre Rechnung beim BAG ein. Das BAG lehnt ab, wenn die Prämie die Kosten nicht deckt, zu weit darüber liegt oder zu viel Reserve aufbaut. Verdienen darf die Kasse an der Grundversicherung nichts: Das Geld darf nur für die Grundversicherung verwendet werden, Überschüsse bleiben dort, etwa in den Reserven.</p>
        <p class="merke"><strong>Kurz gesagt:</strong> Die Verwaltung kostet nur 16 Franken im Monat, 4,6 % der Prämien. Sie ist nicht der Grund, warum die Prämie steigt. Die Prämie ist hoch, weil die Behandlungen viel kosten. Wer die Prämie senken will, muss die Kosten senken.</p>
<!--TAB:mittel-->`,
    },
    {
      id: 'nachbar',
      titel: '6. Warum zahlen andere weniger?',
      html: `
        <p>Die mittlere Prämie von {{mittel.gesamtFr}} Franken zahlt fast niemand genau. Das BAG zählt für {{jahr}} über 200'000 verschiedene Prämien. Welche davon die eigene ist, hängt von sieben Dingen ab.</p>
        <h3>Der Kanton</h3>
        <p>Die Kasse muss die Prämien nach den Kosten im Kanton abstufen. Massgebend ist, wo Sie wohnen, nicht wo Sie arbeiten oder sich behandeln lassen. Erwachsene zahlen {{jahr}} im Schnitt in {{kanton.tiefName}} {{kanton.tief}} Franken, in {{kanton.hochName}} {{kanton.hoch}} Franken, also fast das Doppelte.</p>
<!--FIG:kantone-->
<!--TAB:kantone-->
        <p>Der Vergleich zeigt: Die Prämie folgt den Kosten im Kanton sehr eng. Über alle 26 Kantone laufen die beiden Zahlen fast im Gleichschritt. Teure Prämie heisst also vor allem: Dort fallen pro Person höhere Kosten an. Das ist so gewollt, denn die Prämien müssen die Kosten im Kanton decken. Ob dort zu viel behandelt wird oder die Menschen mehr Pflege brauchen, zeigt diese Zahl nicht. Der Kanton Zug fällt auf: Er kostet mehr als Appenzell Innerrhoden, hat aber die tiefere Prämie; der Grund liess sich nicht belegen.</p>
        <p>Warum die Kosten verschieden sind, ist nicht abschliessend geklärt. Ältere Studien deuten darauf hin, dass die Menge der Behandlungen mehr erklärt als deren Preis, und dass in Kantonen mit mehr Ärztinnen und Ärzten mehr Leistungen bezogen werden. Beim Alter ist das Bild nicht einheitlich: Eine Studie konnte den Einfluss nicht belegen, andere fanden ihn. Auch Armut, Arbeitslosigkeit und Invalidität spielen eine Rolle.</p>
        <h3>Die Prämienregion</h3>
        <p>Auch innerhalb eines Kantons kann die Prämie verschieden sein, weil die Stadt oft mehr kostet als das Land. Darum sind Kantone mit grossen Kostenunterschieden in Prämienregionen aufgeteilt. Jede Gemeinde gehört fest zu einer Region. Meist ist Region 1 die teuerste. Die Kassen dürfen in den anderen Regionen tiefere Prämien verlangen, sie müssen aber nicht. Ausnahmen gibt es auch: {{jahr}} verlangt eine Kasse in drei Kantonen in Region 2 mehr als in Region 1.</p>
        <div class="tabelle"><table>
          <caption>Kantone mit mehreren Prämienregionen</caption>
          <tr><th scope="col">Regionen</th><th scope="col">Kantone und grösster erlaubter Unterschied</th></tr>
          <tr><td>drei</td><td>Bern, Graubünden, Zürich: 15 % von Region 1 zu 2, 10 % von 2 zu 3. Luzern: 15 und 5 %. St. Gallen: 10 und 10 %.</td></tr>
          <tr><td>zwei</td><td>Basel-Landschaft, Schaffhausen, Tessin, Waadt, Wallis: 15 %. Freiburg: 10 %.</td></tr>
          <tr><td>eine</td><td>alle übrigen 15 Kantone</td></tr>
        </table></div>
        <p>Im Kanton Zürich zum Beispiel gehört nur die Stadt Zürich zur Region 1. Winterthur, Uster und Dietikon sind in Region 2, Bülach und Andelfingen in Region 3. Ein Umzug um wenige Kilometer kann die Prämie also verändern, ohne dass sich an der Gesundheit etwas ändert. Das EDI legt für jeden dieser Kantone fest, wie gross der Unterschied von Region zu Region höchstens sein darf. Dieser Unterschied darf den Kostenunterschied nicht übersteigen.</p>
        <p><strong>Der Haken:</strong> Die Einteilung stammt im Kern aus dem Jahr 2004 und stützt sich auf eine ETH-Studie von 2001. Vorschläge für eine neue Einteilung lehnte das Parlament ab, seither bleibt sie bis auf wenige Sonderfälle wie Gemeindefusionen unverändert. Die Grenzen zeigen also teilweise ein altes Kostenbild. Die Höchstrabatte dagegen gelten je Kanton erst seit 2023 und werden regelmässig überprüft, und Kantone können selbst eine Änderung vorschlagen.</p>
        <h3>Das Alter</h3>
        <p>Es gibt nur drei Gruppen: Kinder bis 18, junge Erwachsene von 19 bis 25, Erwachsene ab 26. Für Kinder muss die Prämie tiefer sein, für junge Erwachsene darf die Kasse sie tiefer ansetzen. {{jahr}} sind das im Schnitt {{mittel.kinder}}, {{mittel.junge}} und {{mittel.erwachsene}} Franken im Monat. Innerhalb einer Gruppe zählt das Alter nicht mehr. Gewechselt wird immer am 1. Januar nach dem 18. und nach dem 25. Geburtstag.</p>
        <h3>Die Franchise</h3>
        <p>Wer eine höhere Franchise wählt, bekommt Rabatt, aber nicht beliebig viel: Der Rabatt darf höchstens 70 % des zusätzlichen Risikos betragen. Von {{franchise.min}} auf {{franchise.max}} Franken übernehmen Sie {{franchise.differenz}} Franken mehr Risiko, der Rabatt liegt also bei höchstens {{rabatt.jahr}} Franken im Jahr, rund {{rabatt.monat}} Franken im Monat.</p>
        <h3>Das Modell</h3>
        <p>Bei Hausarzt-, HMO- oder Telmed-Modellen gehen Sie zuerst an eine bestimmte Stelle und verzichten auf die freie Wahl. Dafür kann die Kasse Rabatt geben. Der Rabatt darf nur Kostenunterschiede weitergeben, die wirklich aus dem Modell stammen, nicht daraus, dass dort gesündere Menschen versichert sind.</p>
        <h3>Die Unfalldeckung</h3>
        <p>Wer mindestens acht Stunden pro Woche bei derselben Arbeitgeberin oder demselben Arbeitgeber arbeitet, ist über die Stelle auch in der Freizeit gegen Unfälle versichert. Dann lässt sich die Unfalldeckung bei der Kasse schriftlich ausschliessen, mit einer Bestätigung der Arbeitgeberseite. Das senkt die Prämie um höchstens 7 %. Endet die Stelle, braucht die Kasse eine Meldung, sonst wird die Prämie nachgefordert.</p>
        <h3>Die Kasse</h3>
        <p>Die Leistungen der Grundversicherung sind bei allen Kassen gleich, die Prämie nicht.</p>
        <p class="merke"><strong>Kurz gesagt:</strong> Die Prämie hängt davon ab, wo Sie wohnen, wie alt Sie sind, bei welcher Kasse Sie sind und was Sie selbst an Risiko und Wahlfreiheit eintauschen. Der Gesundheitszustand zählt dabei nicht: Die Kasse darf deshalb keine höhere Prämie verlangen.</p>`,
    },
    {
      id: 'problem',
      titel: '7. Wo liegt das Problem?',
      html: `
        <p>Zuerst das, was kein Fehler ist. Die Bevölkerung wird älter, und es gibt Therapien, die es früher nicht gab. Das kostet Geld, und das ist gut so. Das BAG nennt beides als Gründe. Dazu kommen aber Gründe, die nicht sein müssten.</p>
        <p>Eine Studie im Auftrag des BAG schätzte, dass 16 bis 19 % der Kosten vermeidbar wären, für 2016 waren das 7 bis 8 Milliarden Franken. Auf die heutige Prämie umgelegt wären das grob {{vermeidbar.tief}} bis {{vermeidbar.hoch}} Franken im Monat. Die Forschenden warnen selbst: Ganz erreichen lässt sich das kaum. Sie nennen drei Hauptursachen: zu viel Menge, zu hohe Preise, schlechte Abläufe. Dahinter stecken vor allem diese Mechanismen.</p>
        <h3>Wer mehr macht, verdient mehr</h3>
        <p>Wer pro Handgriff bezahlt wird, verdient an jedem zusätzlichen Schritt, und der Tarif belohnt das Weglassen nicht. Das Gesetz verlangt zwar, sich aufs Nötige zu beschränken, doch der Anreiz bleibt. Das Geld fliesst für Behandlungen, nicht für gesunde Menschen. Im Verhältnis zu den Kosten sieht die Studie das grösste Sparpotenzial bei ambulanter Radiologie, stationärer Psychiatrie, spitalambulanten Behandlungen und Labor. Solche Unterschiede sind laut den Forschenden aber mit Vorsicht zu lesen.</p>
        <h3>Wer bestellt, zahlt nicht</h3>
        <p>Die Ärztin oder der Arzt empfiehlt, die versicherte Person sagt ja, die Kasse zahlt. Keine der drei Seiten hat den vollen Anreiz, auf den Preis zu schauen. Ist die Franchise erreicht, zahlt man nur noch {{selbstbehalt.satz}} % jeder Rechnung, und ist das Dach erreicht, gar nichts mehr ausser dem Spitalbeitrag.</p>
        <h3>Der Kanton hat mehrere Rollen</h3>
        <p>Der Kanton plant die Spitäler, besitzt oft eines davon, genehmigt dessen Preise und zahlt mit. Der Bundesrat nennt das selbst eine Mehrfachrolle: regulierende Stelle, teilweise Eigentümer und zahlende Stelle. Er sieht mögliche Interessenkonflikte allerdings als entschärft an und hält im Bericht vom Januar 2026 keine neuen Regeln dafür für nötig; das ist umstritten. Dazu kommt die Politik: Kaum jemand will, dass das eigene Regionalspital schliesst, auch wenn das nächste nah ist.</p>
        <h3>Das Geld schaut auf den Ort, nicht auf den Sinn</h3>
        <p>Stationär zahlt heute der Kanton mit, ambulant zahlt die Kasse allein. Wird eine Operation vom Spitalbett in die Tagesklinik verlegt, ist das oft billiger, aber die Prämienzahlenden tragen plötzlich alles. Was für alle gut ist, ist für einzelne Zahlende schlecht.</p>
        <h3>Generika kosten mehr als im Ausland</h3>
        <p>Generika sind Kopien von Medikamenten, deren Patent abgelaufen ist. Laut Preisüberwacher kosten die günstigsten in der Schweiz 2,4-mal so viel wie im Ausland. Ein Vergleich von santésuisse und Interpharma von 2023 kommt mit anderer Methode auf knapp das Doppelte. Teurer sind sie in beiden Rechnungen.</p>
        <h3>Alle haben andere Interessen</h3>
        <p>Jede Sparmassnahme nimmt jemandem Einkommen weg: Ärzteschaft, Spitälern, Pharma, Kantonen, Kassen. Alle haben gute Argumente und eine Interessenvertretung. Darum geht es langsam voran. Für die Jahre 2028 bis 2031 soll der Bundesrat erstmals Kosten- und Qualitätsziele festlegen; angekündigt war das für Ende 2026.</p>
        <h3>Und wen trifft es?</h3>
        <p>Weil die Prämie pro Kopf gleich ist, drückt sie bei tiefen Einkommen am stärksten. Die Prämien stiegen über zwanzig Jahre von rund 4 auf rund 7 % des verfügbaren Einkommens, das sind Durchschnittswerte. Das Gesundheitswesen kostete 2024 rund 97 Milliarden Franken. Davon trugen die Haushalte 21 % direkt aus der eigenen Tasche und weitere 41 % indirekt, vor allem über die Prämien. Die öffentliche Hand trug 31 %.</p>`,
    },
    {
      id: 'aenderungen',
      titel: '8. Was ändert sich?',
      html: `
        <p><strong>Seit 2026, TARDOC:</strong> Die neue Preisliste für ambulante Behandlungen hat am 1. Januar 2026 TARMED abgelöst und mehr Pauschalen eingeführt. Im ersten Jahr kamen Rechnungen teils verspätet.</p>
        <p><strong>2028, EFAS:</strong> Ambulant und stationär werden nach demselben Schlüssel finanziert. Die Kantone übernehmen ab 2028 einen festen Anteil an den Kosten nach Abzug der Kostenbeteiligung, zuerst je nach Kanton 21,3 bis 28,5 %, ab 2031 in der Regel rund 24,5 %. Den Rest tragen die Prämien. 2032 kommt die Pflege dazu, dann beträgt der Kantonsanteil mindestens 26,9 %. Die Preise selbst ändern sich dadurch nicht.</p>
        <p><strong>Mindestfranchise:</strong> Das Parlament hat es verlangt, der Bundesrat schlägt 400 statt 300 Franken vor. Das war im März 2026 in der Vernehmlassung und ist umstritten: Die einen erwarten weniger Bagatellbesuche, die anderen sehen eine Last für Chronischkranke und Menschen mit wenig Geld. Ein Datum für das Inkrafttreten nannte die Mitteilung vom 13.03.2026 nicht.</p>
        <p><strong>Für Sie:</strong> Nach der Mitteilung der neuen Prämie kann man die Kasse auf den 1. Januar wechseln. Die Kündigung muss dann spätestens am 30. November bei der bisherigen Kasse eingegangen sein; fällt der Tag auf einen Samstag, Sonntag oder Feiertag, am letzten Arbeitstag davor. Am sichersten kündigt man erst, wenn die neue Kasse die Aufnahme bestätigt hat. Ohne Prämienmitteilung gilt eine längere Frist. Mit offenen Ausständen ist ein Wechsel nicht möglich. Die Leistungen bleiben gleich. Vergleichen geht auf dem Prämienrechner des Bundes, verlinkt unten bei den Quellen.</p>
        <p>Ob Sie Anspruch auf eine Verbilligung der Prämie haben, steht auf der Seite <a href="/praemienverbilligung/">Prämienverbilligung</a>.</p>`,
    },
  ],
  // Externe Quellen. Wie bei den Erklärseiten: eintragen erst nach Gegenprobe.
  // Übernommen aus der gegengelesenen Fassung vom 02.11.2026; dort am Original
  // nachgezogen.
  quellen: [
    { url: 'https://www.bag.admin.ch/dam/de/sd-web/Rf0wOvVWkGNj/EFIND2024_d_Kosten_pro_Versicherte_nach_Kanton_Alter_Geschlecht_Spitalaufenthalt_PCGs.pdf', text: 'BAG, EFIND 2024', zweck: 'Kostenstufen, Kosten nach Alter und Kanton' },
    { url: 'https://cms.news.admin.ch/fileservice/sdweb-docs-prod-nsbcch-files/files/2026/09/29/f21880a8-516b-414a-8044-15f6e1c84c18.pdf', text: 'BAG, Kantonale Prämien 2026/2027', zweck: 'Prämien je Kanton' },
    { url: 'https://cms.news.admin.ch/fileservice/sdweb-docs-prod-nsbcch-files/files/2026/09/29/c875537a-fbce-4445-ac8c-e0f40290151d.pdf', text: 'BAG, Faktenblatt Mittlere Prämie', zweck: 'Schweizer Mittel' },
    { url: 'https://www.bag.admin.ch/de/krankenversicherung-praemienregionen', text: 'BAG, Prämienregionen', zweck: 'Gemeindeliste ab 1.1.2027' },
    { url: 'https://www.bag.admin.ch/dam/de/sd-web/DMKQLbZIkPNL/faktenblatt-praemienregionen-stand-maerz-2024.pdf', text: 'BAG, Faktenblatt Prämienregionen', zweck: 'Geschichte und Höchstrabatte' },
    { url: 'https://digitalcollection.zhaw.ch/bitstream/11475/83/1/1486960037.pdf', text: 'ZHAW, Kantonale Mengenindizes der OKP-Leistungen (2007)', zweck: 'Gründe für Kostenunterschiede, ältere Quelle' },
    { url: 'https://www.obsan.admin.ch/sites/default/files/arbeitsdokument-30.pdf', text: 'Obsan, Arbeitsdokument 30', zweck: 'Gründe für Kostenunterschiede, ältere Quelle' },
    { url: 'https://cms.news.admin.ch/fileservice/sdweb-docs-prod-nsbcch-files/files/2026/09/29/fdc63d94-7058-4201-8e08-4e6add2cea3b.pdf', text: 'BAG, Faktenblatt Leistungen 2025', zweck: 'Kostengruppen, 411, 54 und 357 Franken' },
    { url: 'https://www.bag.admin.ch/de/newnsb/BfuGvedj0OOX', text: 'BAG, Prämien 2027', zweck: 'Kostenwachstum, Gründe, Kostenziele' },
    { url: 'https://www.bag.admin.ch/dam/en/sd-web/S45VrqfyLzCZ/PG26-FB-Kennzahlen%20Krankenversicherer_DE.pdf', text: 'BAG, Kennzahlen Krankenversicherer', zweck: 'Verwaltungskosten 2024' },
    { url: 'https://www.infras.ch/media/filer_public/12/f2/12f205ad-4355-4cdc-933e-901d09235391/schlussbericht_effizienzpotenziale_2020_01_31.pdf', text: 'WIG/ZHAW und INFRAS, Effizienzpotenziale in der OKP', zweck: 'im Auftrag des BAG, Daten 2016' },
    { url: 'https://www.admin.ch/de/newnsb/j2rSvoYBZ7n589CpirkcB', text: 'BFS, Gesundheitskosten 2024', zweck: '97 Milliarden, Anteile der Finanzierung' },
    { url: 'https://dialog.css.ch/wp-content/uploads/2026/06/Download_D_04-05_Infografik_02_2026.pdf', text: 'CSS, Infografik 2/2026 nach BFS und BAG', zweck: 'Prämienverbilligung 2023' },
    { url: 'https://www.kvg.org/wp-content/uploads/jahresbericht-2025-risikoausgleich.pdf', text: 'Gemeinsame Einrichtung KVG, Jahresbericht 2025', zweck: 'Risikoausgleich 2024' },
    { url: 'https://www.admin.ch/de/newnsb/ANZligvxioXqvnqrZATk7', text: 'Bundesrat, Bericht zur Mehrfachrolle der Kantone', zweck: 'Januar 2026' },
    { url: 'https://www.preisueberwacher.admin.ch/dam/pue/de/dokumente/newsletter/newsletter_08_24.pdf.download.pdf/Newsletter_08_24_d.pdf', text: 'Preisüberwacher, Newsletter 8/2024', zweck: 'Generikapreise' },
    { url: 'https://www.interpharma.ch/wp-content/uploads/2023/05/PRESS-Swiss-Price-benchmarking_Interpharma_15.05.23_V.DE_.pdf', text: 'Interpharma, Preisvergleich Mai 2023', zweck: 'Generikapreise, andere Methode' },
    { url: 'https://www.srf.ch/news/wirtschaft/grosse-preisunterschiede-medikamente-nach-wie-vor-teuer-die-preise-sind-jedoch-gesunken', text: 'SRF zum Preisvergleich von santésuisse und Interpharma', zweck: 'Generikapreise' },
    { url: 'https://www.zwp-online.info/zwpnews/dental-news/branchenmeldungen/schweizer-mehrheitlich-zufrieden-mit-der-gesundheitsversorgung', text: 'Bericht zur Commonwealth-Fund-Befragung 2023', zweck: 'Verzicht aus Kostengründen' },
    { url: 'https://www.bfh.ch/de/aktuell/storys/2024/praemien-krankenkasse-initiativen-2024/', text: 'Berner Fachhochschule', zweck: 'Prämienlast am Einkommen' },
    { url: 'https://www.parlament.ch/centers/eparl/curia/2013/20133250/Bericht%20BR%20D.pdf', text: 'Bundesrat, Bericht zur Franchise', zweck: 'Zweck und Wirkung der Kostenbeteiligung' },
    { url: 'https://www.bag.admin.ch/de/newnsb/XwGuCzuLkCYzd1V5uKSav', text: 'Bundesrat, Vernehmlassung Mindestfranchise', zweck: '13.03.2026' },
    { url: 'https://www.fedlex.admin.ch/eli/cc/1995/1328_1328_1328/de', text: 'KVG, SR 832.10', zweck: 'Art. 7, 8, 10, 49a, 61, 62, 64; EFAS: AS 2025 107' },
    { url: 'https://www.priminfo.admin.ch/de/praemien', text: 'Prämienrechner des Bundesamts für Gesundheit (Priminfo)', zweck: 'Prämien vergleichen' },
  ],
  // Gesetzesstellen ohne eigenen Link (Fedlex rendert clientseitig, siehe
  // seiten-inhalt.mjs). Stand der Prüfung: 02.11.2026.
  gesetze: 'KVG Art. 64a; KVV Art. 11, 91a, 91b, 93, 95, 101, 103 bis 104a; KLV Art. 38a; KVAG Art. 2, 5, 16, 17; EDI-Verordnung über die Prämienregionen SR 832.106, Stand 1.1.2027; UVG Art. 8; UVV Art. 13.',
  eigeneRechnungen: [
    'Dorf: Die BAG-Anteile sind auf 100 Menschen gerundet, die Säulen stehen auf der Mitte ihrer Stufe. Die 11 % und 27 % sind harte Grenzen, gerechnet mit den oberen beziehungsweise unteren Stufenrändern und dem BAG-Mittel von 4\'634 Franken; die wahre Spanne für die fünf Teuersten liegt grob zwischen 27 und 64 %, je nach Rundung der BAG-Anteile.',
    'Schnitt der Erwachsenen: gewichtet ab 26 Jahren.',
    '{{vermeidbar.tief}} bis {{vermeidbar.hoch}} Franken: 16 bis 19 % der mittleren Prämie von {{mittel.gesamtFr}} Franken; die Studie bezieht sich auf alle KVG-Leistungen 2016, nicht auf die Prämie {{jahr}}.',
    'Kantone: Die Prämien {{jahr}} je Prämienregion stammen aus der BAG-Datei, die Maloja Plana für den Prämienrechner führt. Für Kantone mit mehreren Regionen nennt diese Datei keinen Kantonsmittelwert; darum steht dort die Spanne der Regionen. Die Korrelation zwischen der kantonalen Prämie {{jahr}} und den Kosten 2024 über 26 Kantone beträgt 0,97 (gerechnet mit den Kantonsmitteln des BAG). Die ETH-Studie und die Motion 18.3713 sind nur über das BAG-Faktenblatt belegt.',
    'Ausnahmen bei den Regionen: eigene Auswertung der BAG-Prämiendaten {{jahr}}, Erwachsene, Standardmodell, Franchise {{franchise.min}}. Die mittlere Prämie enthält auch die Wahl von Franchise und Modell, ist also nicht nur Kosten.',
    'Die Prämienverbilligung 2023 ist nur über die CSS-Infografik belegt; das BAG nennt für 2022 rund 5,4 Milliarden.',
  ],
};

export const HINTERGRUND = [KRANKENKASSE];
