// ─── Hintergrundseite: Kantone im Vergleich ──────────────────────────────────
//
// Schritt 2 nach dem Entscheid «Weg A» (04.11.2026): Zahlen aus dem
// Maloja-Kantonsatlas nebeneinander, damit sichtbar wird, was der Wohnort für
// einen Haushalt ausmacht. Vorschlag und Nachträge:
// stebler-studios/VORSCHLAG-erklaerseiten-in-maloja-2026-11-04.md (ausserhalb
// dieses Repos).
//
// Gleiche Art wie /krankenkasse/ (Begründung im Kopf von krankenkasse.mjs):
// Zahlen erlaubt, aber nur aus Daten ({{platzhalter}}, scripts/seiten-vergleich.mjs),
// mit sichtbarem Stand und Prüfdatum.
//
// Regeln aus dem Atlas-Entscheid vom 24.10.2026: keine Rangliste, keine
// Wertungsfarben; ein Zusammenhang ist eine Beobachtung, keine Erklärung.
// Befunde und Forderungen gehören NICHT auf diese Seite (offen: E1–E6 der
// Entscheid-Vorlage Befunde/Petitionen).
// ─────────────────────────────────────────────────────────────────────────────

export const KANTONE_IM_VERGLEICH = {
  pfad: 'kantone-im-vergleich',
  titel: 'Kantone im Vergleich: was der Wohnort ausmacht',
  beschreibung:
    'Prämie, Steuern, Miete, Unterstützung, Familie, Arbeit: die Zahlen der 26 Kantone nebeneinander, mit Quelle und Stand, ohne Rangliste.',
  brotkrume: 'Kantone im Vergleich',
  kicker: 'Kantone im Vergleich',
  inhaltTitel: 'Inhalt',
  stand: 'Prämien 2027 (BAG, September 2026); Prämienlast mit Prämie 2026, Einkommen 2022 (ESTV) und Verbilligung 2025 (BAG); Steuern 2026; Mieten und Löhne 2024; Sozialhilfe 2024; EL Dezember 2025; Leerwohnungen Juni 2026; Arbeitslosigkeit September 2026; Familienzulagen und Kita-Abzug Steuerjahr 2026.',
  // Die Zahlen veralten in Schüben: Familienzulagen und Kita-Abzug im Januar,
  // Sozialhilfe im Dezember, die Arbeitslosenquote monatlich. Fachprüfung
  // 04.11.2026: Prüfdatum vor die eigenen Stichtage gelegt. Danach wird der Test rot.
  pruefenBis: '2027-01-15',
  hinweis:
    'Orientierung, keine Rechts- oder Finanzberatung. Kantonsdurchschnitte sagen wenig über einen einzelnen Haushalt; jede Zahl hat ihre eigene Grundlage und ihren eigenen Stand.',
  vorbehalt:
    'Diese Seite ist eine <strong>Orientierungshilfe auf Basis öffentlicher Statistiken — keine Rechts-, Versicherungs- oder Finanzberatung</strong>. Sie vergleicht Durchschnitte, die verschieden erhoben werden und verschieden alt sind. Sie bewertet die Kantone nicht. Die Tabellen sind nach der Zahl sortiert, nicht nach Güte: Eine tiefe Zahl ist nicht besser und eine hohe nicht schlechter, hinter jeder stehen eigene Kosten, Löhne und Entscheide. Massgebend sind die zuständigen Stellen.',
  vorspann:
    'Wer in der Schweiz umzieht, wechselt oft mehr als die Wohnung. Prämie, Steuern, Miete und die Hilfe, die es gibt, hängen vom Kanton ab. Diese Seite stellt die Zahlen der 26 Kantone nebeneinander, damit sichtbar wird, wie gross die Unterschiede sind. Sie bewertet die Kantone nicht.',
  inhaltsverzeichnis: true,
  abschnitte: [
    {
      id: 'praemie-einkommen',
      titel: '1. Wie schwer wiegt die Prämie?',
      html: `
        <p>Die mittlere Prämie für Erwachsene liegt {{jahr}} zwischen {{v.praemie.tief}} Franken {{v.praemie.tiefName}} und {{v.praemie.hoch}} Franken {{v.praemie.hochName}}, in der ganzen Schweiz bei {{v.praemie.ch}} Franken. [[q:praemienKantone]] Warum das so ist, erklärt die Seite <a href="/krankenkasse/">Krankenkasse erklärt</a>.</p>
<!--TAB:vpraemie-->
        <p>Ob eine Prämie schwer wiegt, hängt auch vom Einkommen ab. Die Prämienlast setzt die Jahresprämie 2026 ins Verhältnis zum Median-Reineinkommen 2022 aus der Steuerstatistik. Für eine unverheiratete Person mit diesem Einkommen liegt sie zwischen {{v.last.tief}} {{v.last.tiefName}} und {{v.last.hoch}} {{v.last.hochName}}. [[q:estvStatistik]]</p>
        <p>Rechnet man die Prämienverbilligung, die ein Kanton insgesamt auszahlt, auf alle Versicherten um, sinkt dieser Rechenwert auf {{v.lastNachIpv.tief}} {{v.lastNachIpv.tiefName}} bis {{v.lastNachIpv.hoch}} {{v.lastNachIpv.hochName}}. [[q:bagOkp]] Das ist nicht die Last einer bestimmten Person: Die Verbilligung geht vor allem an Haushalte mit tiefem Einkommen und an Kinder, eine Person mit Medianeinkommen erhält in vielen Kantonen keine.</p>
<!--TAB:vlast-->
        <p class="leise"><strong>Vorbehalte:</strong> Prämie, Einkommen und Verbilligung stammen aus drei verschiedenen Jahren; quellenbesteuerte Personen fehlen, und die Lohnentwicklung seit 2022 ist nicht drin. Die Verbilligung umfasst alle 2025 ausbezahlten Beiträge, auch Nachzahlungen für Vorjahre. Solche Nachzahlungen fallen in einigen Kantonen stärker ins Gewicht, vor allem in Zürich, Appenzell Innerrhoden und Graubünden; dort liegt der Rechenwert tiefer, als er für das Jahr 2025 allein wäre. Im Kanton Zürich wird die Verbilligung zuerst provisorisch ausbezahlt und später abgerechnet. [[q:zhIpv]] Kantonale Massnahmen, die die Prämie selbst senken, sind in diesen Zahlen nicht getrennt ausgewiesen. Ob Sie Anspruch auf Verbilligung haben, steht auf der Seite <a href="/praemienverbilligung/">Prämienverbilligung</a>.</p>`,
    },
    {
      id: 'steuern',
      titel: '2. Wie viel bleibt nach den Steuern?',
      html: `
        <p>Bei 80'000 Franken Bruttolohn zahlt eine ledige Person ohne Kinder und ohne Konfession im Kantonshauptort zwischen {{v.steuer.tief}} des Lohns {{v.steuer.tiefName}} und {{v.steuer.hoch}} {{v.steuer.hochName}} an Bund, Kanton und Gemeinde. [[q:estvSteuerrechner]] Auch innerhalb eines Kantons zählt die Gemeinde; die Spalte «Gemeinden im Kanton» zeigt die Spanne von der tiefsten zur höchsten Belastung.</p>
<!--TAB:vsteuer-->
        <p class="leise">Ein Beispiel für eine einzige Lebenslage. Mit Kindern, Partnerin oder Partner, Vermögen oder anderem Lohn sieht die Rechnung anders aus; wie die Steuern aufgebaut sind, steht auf der Seite <a href="/steuern/">Steuern</a>.</p>`,
    },
    {
      id: 'wohnen',
      titel: '3. Was kostet das Wohnen?',
      html: `
        <p>Eine 3-Zimmer-Wohnung kostete 2024 im Durchschnitt zwischen {{v.miete.tief}} Franken im Monat {{v.miete.tiefName}} und {{v.miete.hoch}} Franken {{v.miete.hochName}}, in der ganzen Schweiz {{v.miete.ch}} Franken. [[q:bfsMiete]] Gemessen am Medianlohn der Region sind das zwischen {{v.mieteAnteil.tief}} und {{v.mieteAnteil.hoch}}. [[q:bfsLse]]</p>
<!--TAB:vmiete-->
<!--TAB:vmieteanteil-->
        <p>Wie leicht man eine Wohnung findet, zeigt die Leerwohnungsziffer: der Anteil der Wohnungen und Einfamilienhäuser, die an einem Stichtag leer stehen und zur Miete oder zum Kauf angeboten sind. Sie reichte am 1. Juni 2026 von {{v.leer.tief}} {{v.leer.tiefName}} bis {{v.leer.hoch}} {{v.leer.hochName}}. [[q:bfsLeer]]</p>
<!--TAB:vleer-->
        <p class="leise"><strong>Vorbehalte:</strong> Die Mieten sind Durchschnitte aller vermieteten Wohnungen, auch langjähriger Verträge, nicht die Preise neuer Inserate; in kleinen Kantonen sind sie unsicherer geschätzt. Der Medianlohn ist ein Bruttolohn, auf eine Vollzeitstelle umgerechnet, und gilt für eine der sieben Grossregionen, nicht für den einzelnen Kanton. Wer Teilzeit arbeitet oder mit dem Nettolohn rechnet, kommt auf einen höheren Anteil.</p>`,
    },
    {
      id: 'unterstuetzung',
      titel: '4. Wie viele beziehen Unterstützung?',
      html: `
        <p>Die Sozialhilfequote zeigt, wie viele Menschen im Jahr wirtschaftliche Sozialhilfe bezogen haben. Sie lag 2024 zwischen {{v.sozialhilfe.tief}} {{v.sozialhilfe.tiefName}} und {{v.sozialhilfe.hoch}} {{v.sozialhilfe.hochName}}, in der ganzen Schweiz bei {{v.sozialhilfe.ch}}. [[q:bfsSozialhilfe]]</p>
        <p>Ergänzungsleistungen (EL) helfen, wenn AHV- oder IV-Rente und eigenes Einkommen die Lebenskosten nicht decken. Im Dezember 2025 bezogen sie zwischen {{v.el.tief}} der Menschen mit Altersrente {{v.el.tiefName}} und {{v.el.hoch}} {{v.el.hochName}}. [[q:bsvEl]]</p>
<!--TAB:vunterstuetzung-->
        <p class="leise"><strong>Vorbehalt:</strong> Die Quoten zeigen, wer bezieht, nicht, wer Anspruch hätte. Wer eine Leistung nicht beantragt, fehlt in der Statistik. Die Regeln, das Vermögen, die Mieten und die Finanzierung von Heimaufenthalten unterscheiden sich von Kanton zu Kanton. Eine hohe Quote kann auf mehr Bedarf hindeuten, aber auch darauf, dass die Leistung bekannter ist oder leichter beantragt wird.</p>`,
    },
    {
      id: 'familie',
      titel: '5. Was bekommen Familien?',
      html: `
        <p>Die Kinderzulage beträgt 2026 in allen Kantonen mindestens {{v.kinderzulage.tief}} Franken im Monat, {{v.kinderzulage.hochName}} {{v.kinderzulage.hoch}} Franken. [[q:bsvFamz]] Viele Kantone zahlen ab einem bestimmten Alter oder ab dem dritten Kind mehr, und in der Landwirtschaft gelten eigene Ansätze; die Tabelle zeigt den ersten Ansatz.</p>
<!--TAB:vfamilie-->
        <p>Für die Betreuung durch Kita, Tagesfamilie oder Hort lassen sich bei den Steuern Kosten abziehen, für Kinder unter 14, wenn die Betreuung wegen Arbeit, Ausbildung oder Erwerbsunfähigkeit nötig ist, und nur bis zu einer Grenze. Bei der direkten Bundessteuer liegt sie im Steuerjahr {{v.kita.bundJahr}} bei {{v.kita.bund}} Franken je Kind, ab 2027 bei 25'900 Franken. [[q:dbg]] Die Kantone setzen eigene Grenzen: {{v.kita.unterBund}} Kantone liegen im Steuerjahr {{v.kita.bundJahr}} darunter, {{v.kita.abBund}} auf oder über dem Bund. [[q:estvKantonsblaetter]]</p>
<!--TAB:vkita-->
        <p class="leise"><strong>Vorbehalt:</strong> Ein tiefer Abzug ist nicht automatisch eine Lücke. Wie viel Betreuung kostet, hängt auch davon ab, wie stark Kanton und Gemeinde Kita-Plätze verbilligen und wie hoch der Steuertarif ist. Abzüge für die Betreuung durch die Eltern selbst, die einzelne Kantone kennen, sind nicht verglichen; für Neuenburg ist der Wert von 2025.</p>`,
    },
    {
      id: 'arbeit',
      titel: '6. Wie viele sind als arbeitslos gemeldet?',
      html: `
        <p>Im September 2026 waren zwischen {{v.alq.tief}} der Erwerbspersonen {{v.alq.tiefName}} und {{v.alq.hoch}} {{v.alq.hochName}} als arbeitslos gemeldet, in der ganzen Schweiz {{v.alq.ch}}. [[q:seco]]</p>
<!--TAB:valq-->
        <p class="leise"><strong>Vorbehalt:</strong> Die Quote zählt Menschen, die beim RAV als arbeitslos gemeldet sind. Wer keine Stelle hat, aber nicht gemeldet ist, fehlt. Es ist ein Monatswert, der saisonal schwankt.</p>`,
    },
    {
      id: 'nebeneinander',
      titel: '7. Alle Zahlen nebeneinander',
      html: `
        <p>Eine Auswahl der Zahlen aller Kantone in einer Tabelle, alphabetisch. Auf dem Handy lässt sie sich waagrecht verschieben; die Spalte mit dem Kanton bleibt stehen.</p>
<!--TAB:nebeneinander-->`,
    },
    {
      id: 'zusammenhaenge',
      titel: '8. Was zusammenhängt',
      html: `
        <p>Legt man die Zahlen nebeneinander, fällt auf, dass manche zusammen steigen und fallen. Die Tabelle zeigt das als Korrelation über die 26 Kantone. Als Kontrolle ist auch die Rangfolge gerechnet; sagen beide Rechnungen Verschiedenes, steht die schwächere Stufe.</p>
<!--TAB:zusammenhang-->
        <p class="merke"><strong>Kurz gesagt:</strong> Ein Zusammenhang ist keine Erklärung, und er gilt für Kantone, nicht für Menschen. Dass Kantone mit höherer Prämie meist auch mehr Sozialhilfe haben, heisst nicht, dass Menschen mit hoher Prämie eher Sozialhilfe beziehen. Oft haben dieselben Kantone bei mehreren Zahlen hohe Werte, und dahinter können ganz andere Gründe liegen: Sprachregion, Alter der Bevölkerung, Wohnungsmarkt, Arbeitsplätze, Regeln. Jeder Kanton zählt einmal, egal wie viele Menschen dort leben. Was die Zahlen zeigen, ist ein Anlass zum Fragen, nicht die Antwort.</p>`,
    },
  ],
  quellen: [
    { key: 'praemienKantone', herausgeber: 'Bundesamt für Gesundheit', titel: 'Kantonale Prämien 2026/2027', datum: '29.09.2026', url: 'https://cms.news.admin.ch/fileservice/sdweb-docs-prod-nsbcch-files/files/2026/09/29/f21880a8-516b-414a-8044-15f6e1c84c18.pdf', belegt: 'mittlere Prämie je Kanton und für die ganze Schweiz', amtlich: true },
    { key: 'estvStatistik', herausgeber: 'Eidgenössische Steuerverwaltung', titel: 'Statistiken zur direkten Bundessteuer', datum: 'Steuerjahr 2022', url: 'https://www.estv.admin.ch/de/statistiken-zur-direkten-bundessteuer', belegt: 'Median-Reineinkommen je Kanton, Grundlage der Prämienlast', amtlich: true },
    { key: 'bagOkp', herausgeber: 'Bundesamt für Gesundheit', titel: 'Statistik der obligatorischen Krankenversicherung 2025', datum: 'Tabellen T 4.02 und T 4.08, Datenstand 15.07.2026', url: 'https://www.bag.admin.ch/de/statistik-der-obligatorischen-krankenversicherung', belegt: 'Bezugsquote und durchschnittlicher Beitrag der Prämienverbilligung je Kanton', amtlich: true },
    { key: 'zhIpv', herausgeber: 'Kanton Zürich', titel: 'Kanton legt Prämienverbilligungen 2025 fest', datum: '26.09.2024', url: 'https://www.zh.ch/de/news-uebersicht/medienmitteilungen/2024/09/kanton-legt-praemienverbilligungen-2025-fest.html', belegt: 'provisorische Auszahlung und spätere Abrechnung in Zürich', amtlich: true },
    { key: 'estvSteuerrechner', herausgeber: 'Eidgenössische Steuerverwaltung', titel: 'Steuerbelastung in den Kantonen und Gemeinden', datum: 'Steuerjahr 2026, abgerufen 24.10.2026', url: 'https://swisstaxcalculator.estv.admin.ch/#/taxburden/income-wealth-tax', belegt: 'Steuerbelastung im Kantonshauptort und in den Gemeinden', amtlich: true },
    { key: 'bfsMiete', herausgeber: 'Bundesamt für Statistik', titel: 'Strukturerhebung: durchschnittlicher Mietpreis nach Kanton und Zimmerzahl', datum: '2024, Tabelle T 09.03.03.01', url: 'https://dam-api.bfs.admin.ch/hub/api/dam/assets/36398431/master', belegt: 'durchschnittliche Nettomiete je Kanton', amtlich: true },
    { key: 'bfsLse', herausgeber: 'Bundesamt für Statistik', titel: 'Lohnstrukturerhebung nach Grossregion', datum: '2024', url: 'https://www.bfs.admin.ch/bfs/de/home/statistiken/arbeit-erwerb/loehne-erwerbseinkommen-arbeitskosten/lohnstruktur/grossregionen.html', belegt: 'Medianlohn der Grossregion', amtlich: true },
    { key: 'bfsLeer', herausgeber: 'Bundesamt für Statistik', titel: 'Leerwohnungszählung 2026', datum: 'Stichtag 1.6.2026, publiziert 10.9.2026', url: 'https://dam-api.bfs.admin.ch/hub/api/dam/assets/36836216/master', belegt: 'Leerwohnungsziffer je Kanton', amtlich: true },
    { key: 'bfsSozialhilfe', herausgeber: 'Bundesamt für Statistik', titel: 'Sozialhilfestatistik: wirtschaftliche Sozialhilfe', datum: '2024, publiziert 15.12.2025', url: 'https://www.bfs.admin.ch/bfs/de/home/statistiken/soziale-sicherheit/sozialhilfe/sozialhilfebeziehende/wirtschaftliche-sozialhilfe.html', belegt: 'Sozialhilfequote je Kanton', amtlich: true },
    { key: 'bsvEl', herausgeber: 'Bundesamt für Sozialversicherungen', titel: 'Statistik der Ergänzungsleistungen 2025', datum: 'Dezember 2025, publiziert 26.05.2026', url: 'https://www.bsv.admin.ch/de/statistik-el', belegt: 'EL-Quote zur AHV je Kanton', amtlich: true },
    { key: 'bsvFamz', herausgeber: 'Bundesamt für Sozialversicherungen', titel: 'Arten und Ansätze der Familienzulagen 2026', datum: 'Stand 1.1.2026', url: 'https://www.bsv.admin.ch/dam/de/sd-web/acU7RgJgeisY/Arten%20und%20Ans%C3%A4tze%20der%20Familienzulagen_2026.pdf', belegt: 'Kinderzulage je Kanton', amtlich: true },
    { key: 'dbg', herausgeber: 'Bundeskanzlei (Fedlex), SR 642.11', titel: 'Bundesgesetz über die direkte Bundessteuer (DBG), Art. 33 Abs. 3', datum: 'Fassung vom 1.1.2026 (AS 2025 579); ab 1.1.2027 25\'900 Fr. (AS 2026 486)', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/20260101/de', belegt: 'Höchstabzug für Kinderdrittbetreuung bei der direkten Bundessteuer und seine Bedingungen', amtlich: true },
    { key: 'estvKantonsblaetter', herausgeber: 'Eidgenössische Steuerverwaltung und Schweizerische Steuerkonferenz', titel: 'Kantonsblätter', datum: 'Stand Februar 2026', url: 'https://www.estv.admin.ch/de/kantonsblaetter', belegt: 'Abzug für Kinderbetreuung je Kanton', amtlich: true },
    { key: 'seco', herausgeber: 'Staatssekretariat für Wirtschaft', titel: 'Die Lage auf dem Arbeitsmarkt, September 2026', datum: 'publiziert 6.10.2026', url: 'https://www.seco.admin.ch/de/newnsb/Cdju9-o8WGML', belegt: 'Arbeitslosenquote je Kanton', amtlich: true },
  ],
  quellenHinweis:
    'Maloja Plana steht mit diesen Stellen in keiner Verbindung; die Verlinkung bedeutet keine Zusammenarbeit und keine Billigung. Die Zahlen stammen aus dem Maloja-Kantonsatlas, der sie aus diesen Quellen sammelt.',
  gesetze: 'DBG Art. 33 Abs. 3 (Kinderdrittbetreuung), Fassung 1.1.2026 und 1.1.2027 am Volltext gelesen (04.11.2026).',
  eigeneRechnungen: [
    'Prämienlast: Jahresprämie 2026 der Erwachsenen geteilt durch das Median-Reineinkommen 2022 der Unverheirateten (ESTV). Nach Verbilligung: Prämienlast mal (1 − Bezugsquote × durchschnittlicher Beitrag in Prozent der mittleren Prämie), aus der BAG-Statistik 2025; die Entlastung ist ein Anteil an der mittleren Prämie aller Versicherten, hier auf die Erwachsenenprämie angewendet.',
    'Miete am Medianlohn: Miete 3 Zimmer im Kanton geteilt durch den Medianlohn der Grossregion, beide 2024; für die ganze Schweiz mit dem Schweizer Medianlohn.',
    'Zusammenhänge: Korrelationskoeffizient nach Pearson über die 26 Kantone, ungewichtet, zur Kontrolle auch nach Rangfolge (Spearman). «Deutlich» ab einem Betrag von 0,6, «teilweise» ab 0,3, darunter «kaum»; weichen die beiden Rechnungen in der Stufe ab, gilt die schwächere. Bei 26 Kantonen ist jede Stufe unsicher: Ein r von 0,7 kann ebenso gut zwischen etwa 0,45 und 0,85 liegen.',
  ],
};
