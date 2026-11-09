// Prämienverbilligung · Kanton TI. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Abgerufen 09.11.2026:
//   [IAS-I] IAS, «Istruzioni per la richiesta di riduzione di premio … (RIPAM) per l'anno 2026»,
//           Dicembre 2025 (PDF, 5 S.) — Gegenprobe …_2099.pdf → 404
//   [IAS-S] IAS, Scheda «Riduzione dei premi dell'assicurazione malattia (RIPAM)» (= Amtslink der App)
//   [LCAMal] RL 853.100, «stato 1° gennaio 2026» (Raccolta, legge-piatta/num/370)
//   [RLCAMal] RL 853.110 (Raccolta, legge-piatta/num/371)
// Sprache der Quellen: Italienisch; die Zitate stehen im Original.
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Tessin',
  slug: 'tessin',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // LCAMal art. 25 cpv. 1: «La riduzione dei premi è corrisposta tramite presentazione di
    // un'istanza scritta.» RLCAMal art. 8 cpv. 1: «L'istanza di riduzione di premio o di rinnovo».
    // [IAS-I] Ziff. 2: «La RIPAM per il 2026 può essere chiesta tramite il formulario di rinnovo
    // oppure tramite il formulario su richiesta» (also je Jahr).
    'Im Tessin gibt es die Prämienverbilligung nur auf schriftlichen Antrag, und zwar für jedes Jahr neu. Auf Italienisch heisst sie «riduzione dei premi», kurz RIPAM.',
    // [IAS-I] Ziff. 2: «Formulario di rinnovo: … automaticamente inviato … alle persone che già
    // avevano inoltrato la richiesta per l'anno 2025 e che secondo la tassazione … risultano essere
    // potenziali beneficiari»; «Formulario su richiesta: quanti non hanno ricevuto automaticamente
    // il formulario … possono richiedere … sul sito IAS … In alternativa … contattando il Servizio».
    'Wer schon für das Vorjahr einen Antrag gestellt hat und nach den Steuerdaten weiter in Frage kommt, erhält vom IAS ein Erneuerungsformular zugeschickt. Alle anderen bestellen das Formular selbst, online auf der Seite des IAS oder per Telefon.',
    // [IAS-I] Ziff. 2: «Si rammenta che le Cancellerie comunali non dispongono dei formulari di richiesta.»
    'Bei der Gemeindekanzlei gibt es die Formulare nicht.',
    // [IAS-S] «In quali casi il diritto alla RIPAM può essere accordato automaticamente? …
    // prestazioni complementari alla rendita AVS/AI; assegni per figli integrativi (AFI) o di
    // assegni di prima infanzia (API); prestazioni assistenziali; indennità straordinarie di
    // disoccupazione. Attenzione: essi non devono inoltrare la richiesta di RIPAM; ci penseranno
    // direttamente i Servizi …». LCAMal art. 42 cpv. 1, art. 43 cpv. 1 («esentati dal presentare l'istanza»).
    'Keinen Antrag stellen Personen, die Ergänzungsleistungen zur AHV oder IV, Ergänzungszulagen für Kinder (AFI), Kleinkinderzulagen (API), Sozialhilfe oder ausserordentliche Arbeitslosenentschädigung beziehen. Darum kümmern sich die Stellen, die diese Leistungen ausrichten.',
  ],
  // [IAS-I] Ziff. 2 (Erneuerungs- und Bestellformular, wie oben); «Per la singola UR deve essere
  // presentata una sola richiesta.»
  selbst: {
    einleitung: 'Kein Formular kommt von selbst, wenn einer dieser Fälle auf Sie zutrifft:',
    punkte: [
      'Sie haben für das Vorjahr keinen Antrag gestellt.',
      'Sie kamen nach den Steuerdaten, die das IAS verwendet, nicht als berechtigt in Frage, vermuten aber heute einen Anspruch.',
    ],
    schluss: 'Dann bestellen Sie das Formular beim IAS. Für einen Haushalt, genauer für eine Berechnungseinheit, gibt es nur einen Antrag.',
  },
  // LCAMal art. 25 cpv. 2 (bis Ende des Vorjahres ⇒ ab 1. Januar) und cpv. 3: «Se l'istanza è
  // presentata dopo il termine …, ma nell'anno di competenza, il diritto … è dato solo a partire dal
  // mese seguente la presentazione.» [IAS-I] Ziff. 2: «(fa stato la data del timbro postale)»;
  // «Questa regola si applica a tutti gli assicurati, … tassati in modo ordinario che … alla fonte.»
  fristSatz: 'Für den Antrag gilt eine Frist. Sie steht im Gesetz und in der Anleitung des IAS. Wer sie verpasst, kann im laufenden Jahr trotzdem noch einen Antrag stellen. Die Verbilligung gilt dann aber erst ab dem Monat nach der Einreichung, die Monate davor fallen weg. Massgebend ist der Poststempel.',
  stelle: 'Istituto delle assicurazioni sociali (IAS), Servizio sussidi assicurazione malattia',
  // [IAS-S] «La decisione spetta all'Istituto delle assicurazioni sociali»; «A chi rivolgersi:
  // Servizio sussidi assicurazione malattia, Via Ghiringhelli 15a, … 6501 Bellinzona».
  stelleSatz: 'Über den Antrag entscheidet das kantonale Institut für Sozialversicherungen (IAS) in Bellinzona. Zuständig ist dort der Dienst für die Verbilligung der Krankenkassenprämien.',
  amtsseite: 'Seite des IAS zur Prämienverbilligung (italienisch)',
  besonders: [
    // LCAMal art. 31 cpv. 1; [IAS-I] Ziff. 1.2: «somma di tutti i redditi dell'UR … + 1/15 della
    // sostanza netta - premio medio di riferimento (PMR) … - contributi sociali obbligatori … -
    // pensioni alimentari pagate … - spese professionali … - spese per interessi passivi».
    'Das Tessin rechnet mit einem verfügbaren Einkommen. Vom Einkommen laut Steuerveranlagung zieht es unter anderem eine Durchschnittsprämie, die Sozialversicherungsbeiträge und bezahlte Unterhaltsbeiträge ab. Ein Teil des Reinvermögens wird dazugezählt.',
    // LCAMal art. 30 cpv. 1 («dati accertati nel periodo fiscale stabilito dal Consiglio di Stato»),
    // art. 40 lett. a; [IAS-I] Ziff. 1.2 (Veranlagung eines früheren Steuerjahres).
    'Grundlage ist die Veranlagung eines früheren Steuerjahres, das der Staatsrat jedes Jahr festlegt, nicht das laufende Einkommen.',
    // [IAS-I] Ziff. 1.3: «sul sito IAS … è presente un simulatore di calcolo … i risultati forniti
    // dal simulatore sono indicativi e non legalmente vincolanti.»
    'Mit dem Rechner auf der Seite des IAS können Sie vorab grob prüfen, ob ein Anspruch in Frage kommt. Das Ergebnis ist unverbindlich, massgebend ist der Entscheid des IAS.',
    // RLCAMal art. 14 cpv. 1 lett. a, b, d, e, f («situazione finanziaria e familiare più recente»):
    // imposta alla fonte; nessuna tassazione; decesso del coniuge; divorzio o separazione;
    // «cessazione totale dell'attività lucrativa a seguito di disoccupazione, pensionamento,
    // infortunio, malattia, maternità o paternità …».
    'In einigen Fällen rechnet das IAS mit der aktuellen Lage statt mit der Veranlagung: bei Quellensteuer, wenn keine Veranlagung vorliegt, nach dem Tod der Ehe- oder eingetragenen Partnerin oder des Partners, nach Scheidung, Trennung oder Auflösung der Partnerschaft und wenn die Erwerbstätigkeit ganz endet, etwa wegen Arbeitslosigkeit, Pensionierung oder Krankheit.',
    // RLCAMal art. 14 cpv. 2 lett. b–f (Arbeitseinkommen, Renten, Unterhalt, Mieteinnahmen,
    // Vermögen; «Su richiesta»), art. 29 (istanza di revisione), art. 30 lett. a: «dall'inizio del
    // mese in cui è stato annunciato il cambiamento, ma al più presto dal mese in cui questo avviene».
    'Ändern sich Ihr Arbeitseinkommen, Renten, Unterhaltsbeiträge, Mieteinnahmen oder Ihr Vermögen deutlich, können Sie eine Neuberechnung verlangen. Sie wirkt frühestens ab dem Monat, in dem Sie die Änderung melden. Darum lohnt es sich, nicht zu warten.',
    // LCAMal art. 27 cpv. 1; [IAS-I] Ziff. 1.1 («non supera i 30 anni; non è coniugato; non ha figli
    // a carico; … redditi … inferiore al limite di fabbisogno …; è in prima formazione»).
    'Junge Erwachsene bis 30 Jahre, die ledig sind, keine Kinder haben, in der ersten Ausbildung stehen und wenig eigenes Einkommen haben, gehören zur Berechnungseinheit der Eltern.',
    // RLCAMal art. 10a; [IAS-I] Ziff. 1.1: «La convivenza è considerata stabile se, alternativamente:
    // a) vi sono figli in comune; b) … gli stessi vantaggi di un matrimonio; c) … almeno 6 mesi.»
    'Unverheiratete Paare zählen als eine Einheit, wenn sie gemeinsame Kinder haben, seit mindestens sechs Monaten zusammenleben oder das Zusammenleben ähnliche Vorteile bringt wie eine Ehe.',
    // LCAMal art. 46 cpv. 1, art. 47, art. 48: «L'istanza di riduzione retroattiva deve indicare i
    // motivi dell'impedimento ad agire nei termini …» / «Essa è accolta solo se suffragata da motivi fondati.»
    'Konnten Sie aus einem triftigen Grund nicht rechtzeitig handeln, ist ein schriftliches Gesuch um rückwirkende Verbilligung möglich. Es muss den Grund nennen und wird nur bei guten Gründen bewilligt.',
    // LCAMal art. 49 cpv. 1: «Le riduzioni dei premi indebitamente percepite devono essere restituite …»
    'Eine Verbilligung, die Ihnen nicht zustand, müssen Sie zurückzahlen.',
  ],
  quellen: [
    { text: 'IAS: Anleitung zum Antrag auf Prämienverbilligung (PDF, italienisch)', url: 'https://www4.ti.ch/fileadmin/DSS/IAS/pdf/approfondimenti/Istruzioni_per_la_richiesta_di_RIPAM_2026.pdf' },
    // Raccolta delle leggi: jede Adresse antwortet mit 200; erfundene Nummer (legge-piatta/num/99863)
    // liefert «L'atto normativo cercato non è presente!», die echte den Titel und «stato 1° gennaio 2026».
    // Die alte Adresse …/nuovafinestra/…/numLegge/853.100 ist KEIN Beleg: 853.999 liefert dort dasselbe Gesetz.
    { text: 'Legge di applicazione della legge federale sull’assicurazione malattie (LCAMal, RL 853.100)', url: 'https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge-piatta/num/370' },
    { text: 'Regolamento della LCAMal (RLCAMal, RL 853.110)', url: 'https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge-piatta/num/371' },
    KVG65,
  ],
};
