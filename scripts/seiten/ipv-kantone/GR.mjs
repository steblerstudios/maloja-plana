// Prämienverbilligung · Kanton GR. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Abgerufen 09.11.2026:
//   [W]  SVA Graubünden, Wegleitung Individuelle Prämienverbilligung 2026 (formulare.sva.gr.ch/downloads/ipv_wegleitung_d.pdf)
//   [G]  KPVG, BR 542.100, Version in Kraft seit 01.01.2025 (API-Version 3445, keine künftige Fassung)
//   [VO] VOzKPVG, BR 542.120, Version in Kraft seit 01.01.2026 (API-Version 3891, keine künftige Fassung)
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Graubünden',
  slug: 'graubuenden',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // [VO] Art. 14 Abs. 1: «Personen mit Wohnsitz im Kanton haben das Anmeldeformular … bei der
    // AHV-Zweigstelle ihrer Wohngemeinde einzureichen.» [W] «Anmeldung»: «bei der SVA Graubünden oder
    // AHV-Zweigstelle der Wohnsitzgemeinde einzureichen»; [W] Kopf und Schluss: «Online-Anmeldung».
    'Im Kanton Graubünden gibt es die Prämienverbilligung auf Anmeldung. Das Formular reichen Sie online, bei der SVA Graubünden oder bei der AHV-Zweigstelle Ihrer Wohngemeinde ein.',
    // [VO] Art. 14 Abs. 2: «Personen, die von Amtes wegen eine Mitteilung über die Vorschusszahlung
    // erhalten, gelten als angemeldet.» Art. 16 Abs. 2: «Die AHV-Ausgleichskasse berechnet für Personen,
    // welche sie am 31. Dezember des Vorjahres als anspruchsberechtigt führte, von Amtes wegen die
    // Vorschusszahlung und stellt ihnen bis Ende März des laufenden Jahres die Mitteilung über die
    // Vorschusszahlung zu.» [G] Art. 10 lit. a (Verwirkung bei verpasster Anmeldefrist).
    // Fachprüfung 09.11.: «bisher bezogen» war zu weit — massgebend ist die Führung am Ende des Vorjahres.
    'Wer am Ende des Vorjahres als berechtigt geführt wurde, erhält in der Regel im Frühling von Amtes wegen eine Mitteilung über einen Vorschuss und gilt damit als angemeldet.',
    // [G] Art. 9 Abs. 1 (volle Verbilligung bei EL, öffentlicher Unterstützung, Mutterschaftsbeiträgen);
    // [W] «Volle Prämienverbilligung»: «Die Meldepflicht liegt bei den zuständigen Instanzen.»
    // [W] «Ergänzungsleistungen»: Anspruch «bereits in der Berechnung der EL enthalten».
    'Wer Ergänzungsleistungen zur AHV oder IV, Sozialhilfe oder kantonale Mutterschaftsbeiträge bezieht, erhält die volle Verbilligung. Die Meldung machen die zuständigen Stellen, nicht Sie.',
  ],
  selbst: {
    einleitung: 'Selbst anmelden müssen Sie sich zum Beispiel in diesen Fällen:',
    punkte: [
      // Umkehrschluss aus [VO] Art. 14 Abs. 1/2 und Art. 16 Abs. 2: als angemeldet gilt nur, wer eine
      // Mitteilung über die Vorschusszahlung erhält («Personen, die von Amtes wegen eine Mitteilung über
      // die Vorschusszahlung erhalten, gelten als angemeldet»; Zustellung «bis Ende März des laufenden
      // Jahres»). Fachprüfung 09.11.: auch frühere Bezügerinnen ohne Mitteilung müssen sich anmelden.
      'Sie haben bis zum Frühling keine Mitteilung über eine Vorschusszahlung erhalten, auch wenn Sie früher schon Prämienverbilligung bezogen haben.',
      // [W] «Quellensteuerpflichtige»: «Quellenbesteuerte Personen haben sich jährlich anzumelden.»
      // und Liste der Belege («Lohnausweise aller Arbeitgeber» …).
      'Sie werden an der Quelle besteuert. Dann melden Sie sich jedes Jahr neu an und legen die Belege zu allen Einkünften bei.',
      // [W] «Anspruchsberechtigte Personen» lit. c: «die Anspruchsberechtigung beginnt ab dem
      // Folgemonat nach dem Zeitpunkt der Wohnsitznahme».
      'Sie sind im Lauf des Jahres aus dem Ausland zugezogen. Der Anspruch beginnt im Monat nach Ihrer Wohnsitznahme.',
      // [W] «Anspruchsberechtigte Personen» lit. a: Anspruch haben Personen, die «am 01. Januar 2026 im
      // Kanton Graubünden Wohnsitz hatten»; Zuzug im Lauf des Jahres nur aus dem Ausland (lit. c).
      // Umkehrschluss: wer aus einem anderen Kanton zuzieht, ist für dieses Jahr nicht in GR berechtigt.
      'Sind Sie im Lauf des Jahres aus einem anderen Kanton zugezogen, melden Sie sich für dieses Jahr noch im bisherigen Kanton an, für das folgende Jahr in Graubünden.',
      // [G] Art. 5 Abs. 1 lit. b: «Personen mit einer Aufenthaltsbewilligung im Kanton Graubünden, die
      // mindestens drei Monaten gültig ist, sofern sie der obligatorischen Krankenpflegeversicherung
      // unterstehen»; [VO] Art. 15 Abs. 1: Anmeldung «bei der AHV-Zweigstelle der Gemeinde, in der sie
      // ihren Aufenthalt haben». Fachprüfung 09.11.: Arbeit allein begründet nach Art. 5 keinen Anspruch;
      // massgebend ist der Wohnkanton (Art. 5 Abs. 1 lit. a, Abs. 3).
      'Sie wohnen nicht im Kanton, haben aber eine Aufenthaltsbewilligung für Graubünden, die eine Mindestdauer gültig ist. Dann melden Sie sich bei der AHV-Zweigstelle der Gemeinde an, in der Sie sich aufhalten. Wer in einem anderen Kanton wohnt und nur hier arbeitet, wendet sich an den Wohnkanton.',
      // [W] lit. d; [G] Art. 5 Abs. 1 lit. c: «… der obligatorischen Krankenpflegeversicherung unterstellt
      // sind und für die gemäss Zuständigkeitsregelung des Bundes der Kanton Graubünden zuständig ist.»
      'Sie wohnen in einem EU- oder EFTA-Staat, sind in der Schweiz obligatorisch krankenversichert, und Graubünden ist für Sie zuständig.',
      // [VO] Art. 13 Abs. 1 und 3: selbstständiger Anspruch, «sofern Drittpersonen … kein Kinder- oder
      // Unterstützungsabzug … gewährt wird»; «haben den Nachweis der Ausbildung einzureichen».
      'Sie sind in Ausbildung, selbst steuerpflichtig, und niemand macht für Sie in der Steuererklärung einen Kinder- oder Unterstützungsabzug. Dann haben Sie einen eigenen Anspruch und reichen einen Nachweis der Ausbildung ein.',
      // [W] «Gesamtanspruch»: «Getrennt besteuerte Paare melden sich ebenfalls getrennt an.»
      'Sie leben als Paar, werden aber getrennt besteuert. Dann meldet sich jede Person getrennt an.',
    ],
    // [W] «Gesamtanspruch»: «Kinder bis zum 18. Altersjahr sind zusammen mit den Eltern anzumelden.»
    // [G] Art. 6 Abs. 2: Gesamtanspruch mit den unterstützten Personen, «sofern ihnen im Rahmen der
    // Steuerveranlagung für diese Personen ein Kinder- oder Unterstützungsabzug gewährt wird».
    // [VO] Art. 13 Abs. 2: «Erhebt eine steuerpflichtige Person in Ausbildung, die dem Gesamtanspruch
    // unterliegt, einen Anspruch auf Prämienverbilligung, wird nicht darauf eingetreten.»
    schluss: 'Kinder bis 18 und junge Erwachsene in Ausbildung, für die die Eltern einen Kinder- oder Unterstützungsabzug erhalten, werden zusammen mit den Eltern angemeldet.',
  },
  // [VO] Art. 14 Abs. 1: «bis spätestens Ende des anspruchsberechtigten Jahres»; [W] «Meldefristen»:
  // «Massgebend ist der Posteingang bei der SVA»; [G] Art. 10 lit. a: Ansprüche verwirken, «wenn die
  // Anmeldung nicht innerhalb der vorgeschriebenen Fristen eingereicht wird».
  fristSatz: 'Für die Anmeldung gilt eine Frist im laufenden Jahr. Massgebend ist der Eingang bei der SVA. Die Frist steht in der Verordnung und in der Wegleitung der SVA. Wer sie verpasst, verliert den Anspruch für dieses Jahr.',
  stelle: 'Sozialversicherungsanstalt Graubünden (SVA Graubünden)',
  // [G] Art. 2, Art. 18 Abs. 2 (AHV-Zweigstellen nehmen die Aufgaben in den Gemeinden wahr);
  // [W] «Haben Sie Fragen? Wenden Sie sich an uns oder an die AHV-Zweigstelle Ihrer Wohnsitzgemeinde.»
  // [W] «Zahlungsempfänger»: «ausschliesslich an die Krankenversicherer ausgerichtet».
  stelleSatz: 'Die SVA Graubünden prüft die Anmeldungen und entscheidet. Auch die AHV-Zweigstelle Ihrer Wohngemeinde nimmt Anmeldungen entgegen und hilft bei Fragen. Ausbezahlt wird die Verbilligung immer an die Krankenkasse.',
  amtsseite: 'Seite der SVA Graubünden zur Prämienverbilligung',
  besonders: [
    // [G] Art. 8a Abs. 1: «satzbestimmenden steuerbaren Einkommen gemäss den definitiven kantonalen
    // Steuerdaten des Vorjahres zuzüglich: a) 10 Prozent des Reinvermögens … d) der Beiträge
    // einschliesslich der Einkaufsbeiträge an die berufliche Vorsorge … e) der Beiträge an die
    // gebundene Selbstvorsorge».
    'Graubünden rechnet mit dem satzbestimmenden steuerbaren Einkommen aus den definitiven Steuerdaten des Vorjahres. Dazu kommen unter anderem ein Teil des Reinvermögens und die Beiträge an Pensionskasse und Säule 3a.',
    // [W] «Vorschussleistung»: «Dadurch können Nachzahlungen oder Rückforderungen gegenüber dem
    // Krankenversicherer entstehen.» [G] Art. 11 Abs. 1–2; [W] «Zahlungsempfänger».
    'Liegt die definitive Veranlagung noch nicht vor, zahlt die SVA zuerst einen Vorschuss. Nach der definitiven Berechnung kann es eine Nachzahlung oder eine Rückforderung geben. Beides läuft über die Krankenkasse.',
    // [G] Art. 8 Abs. 3 (Kinder und junge Erwachsene in Ausbildung «bis zum erfüllten 25. Altersjahr»)
    // und Abs. 4: «Zur Auszahlung gelangt der höhere der gemäss den Absätzen 2 und 3 berechneten Beträge.»
    'Für Kinder und junge Erwachsene in Ausbildung bis 25 gibt es eine eigene Vergleichsrechnung. Ausbezahlt wird der höhere der beiden Beträge.',
    // [VO] Art. 23 Abs. 1–2 (Antrag «innerhalb des anspruchsbegründenden Jahres»; «Geburten, Todesfälle
    // und Wegzüge aus dem Kanton … ab dem ersten Tag des Folgemonats»); [W] «Persönliche oder familiäre
    // Veränderungen»: «Eine Heirat, Trennung oder Scheidung wirkt sich erst im Folgejahr aus».
    // [VO] Art. 23 Abs. 2: «Änderungen der persönlichen und familiären Verhältnisse sind Geburten,
    // Todesfälle und Wegzüge aus dem Kanton. Sie werden ab dem ersten Tag des Folgemonats nach Eintritt
    // des Ereignisses berücksichtigt.» Fachprüfung 09.11.: einen Wegzug meldet man, man verlangt keine
    // Neuberechnung zu eigenen Gunsten.
    'Bei einer Geburt oder einem Todesfall können Sie im laufenden Jahr eine Neuberechnung verlangen; einen Wegzug melden Sie. Beides wirkt ab dem folgenden Monat. Heirat, Trennung oder Scheidung zählen erst im folgenden Jahr.',
    // [G] Art. 8c (Neuberechnung «bei einer Änderung des anrechenbaren Einkommens von mindestens
    // 20 Prozent»); Art. 8a Abs. 3 («aufgrund eines begründeten Antrages der versicherten Person»).
    'Auch wenn sich Ihr Einkommen deutlich verändert hat oder die Steuerdaten Ihre heutige Lage nicht zeigen, können Sie mit Begründung eine Neuberechnung verlangen. Das Gesetz nennt dafür eine Mindestschwelle.',
    // [G] Art. 10 lit. b («anspruchsbegründende Änderungen nicht innerhalb der vorgeschriebenen Fristen
    // mitgeteilt»), Art. 13 Abs. 2 («innert fünf Jahren seit Auszahlung zurückgefordert»).
    // [G] Art. 10 Abs. 1: «Die Ansprüche auf individuelle Prämienverbilligungen verwirken, wenn» —
    // zwingend, darum «verfällt» statt «kann verfallen» (Rechtsprüfung 09.11.).
    // [G] Art. 10 lit. c: Ansprüche verwirken, wenn «die nachgeforderten Unterlagen nicht fristgerecht
    // eingehen» (Fachprüfung 09.11.).
    'Änderungen, die den Anspruch betreffen, melden Sie fristgerecht, und nachgeforderte Unterlagen reichen Sie rechtzeitig ein. Sonst verfällt der Anspruch. Zu Unrecht bezogene Beträge kann die SVA noch einige Jahre nach der Auszahlung zurückfordern.',
  ],
  quellen: [
    // HTTP 200, PDF; Gegenprobe …/downloads/ipv_wegleitung_xq.pdf → 404.
    { text: 'SVA Graubünden: Wegleitung Individuelle Prämienverbilligung (PDF)', url: 'https://formulare.sva.gr.ch/downloads/ipv_wegleitung_d.pdf' },
    // gr-lex ist eine Web-App (jede Adresse 200); Bestand über die API belegt
    // (…/api/de/texts_of_law/542.100 und 542.120 → 200), 542.999 → 404.
    { text: 'Gesetz über die Krankenversicherung und die Prämienverbilligung (KPVG, BR 542.100)', url: 'https://www.gr-lex.gr.ch/app/de/texts_of_law/542.100' },
    { text: 'Verordnung zum Gesetz über die Krankenversicherung und die Prämienverbilligung (VOzKPVG, BR 542.120)', url: 'https://www.gr-lex.gr.ch/app/de/texts_of_law/542.120' },
    KVG65,
  ],
};
