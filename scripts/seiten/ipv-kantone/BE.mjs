// Prämienverbilligung · Kanton BE. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons.
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Bern',
  slug: 'bern',
  weg: 'automatisch',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // Informationsblatt 2026, S. 1: «Ihr Anrecht auf Prämienverbilligung wird in der Regel
    // automatisch überprüft.» KKVV Art. 7 Abs. 1: definitive Veranlagung des vorletzten Steuerjahres.
    'Im Kanton Bern prüft das Amt den Anspruch in der Regel von Amtes wegen, also ohne dass Sie etwas einreichen. Grundlage sind die definitiven Steuerdaten des vorletzten Jahres.',
    'Für etliche Gruppen gilt das aber nicht.',
  ],
  // Informationsblatt 2026, S. 2, «Wann kann Ihr Anrecht auf Prämienverbilligung nicht
  // automatisch überprüft werden?» — alle zehn Fälle, ohne die Beträge.
  selbst: {
    einleitung: 'Sie müssen den Antrag selbst stellen, wenn einer dieser Fälle auf Sie zutrifft:',
    punkte: [
      'Sie haben eine Aufenthaltsbewilligung B, F, G, L, N oder S oder werden an der Quelle besteuert.',
      'Sie haben in der Steuererklärung kein Einkommen ausgewiesen oder keine Steuererklärung eingereicht.',
      'Sie sind auf Jahresbeginn aus einem anderen Kanton oder im Lauf des Jahres aus dem Ausland in den Kanton Bern gezogen.',
      'Ihr zivilrechtlicher Wohnsitz ist im Kanton Bern, Ihr Steuerwohnsitz aber in einem anderen Kanton.',
      'Sie wohnen in einem EU-Staat, sind aber in der Schweiz versicherungspflichtig.',
      'Sie haben in der Steuererklärung ein hohes Bruttovermögen ausgewiesen, also vor Abzug der Schulden, zum Beispiel mit einer Liegenschaft.',
      'Sie sind mindestens 25 Jahre alt, haben keine eigenen Kinder, die zur Familie zählen, und Ihr korrigiertes Reineinkommen liegt unter einer festen Grenze.',
      'Sie sind ledig, älter als 18 und noch nicht 25 Jahre alt, haben ein tiefes Einkommen, und Ihre Eltern leben in einem anderen Kanton oder im Ausland.',
      'Sie sind älter als 18 und noch nicht 25 Jahre alt, in Ausbildung, zählen nicht zur Familie Ihrer Eltern und möchten den höheren Beitrag für Personen in Ausbildung.',
      'Sie haben beim Wegzug aus dem Kanton Bern Sozialhilfe oder Ergänzungsleistungen bezogen und beziehen diese im neuen Kanton nicht mehr.',
    ],
    schluss: 'Die Grenzen stehen im Informationsblatt des Amts für Sozialversicherungen. Im Zweifel lohnt sich die Nachfrage.',
  },
  // Informationsblatt S. 2: «während des laufenden Kalenderjahres».
  fristSatz: 'Ein Antrag gilt nur für das laufende Jahr und muss in diesem Jahr gestellt werden.',
  stelle: 'Amt für Sozialversicherungen des Kantons Bern (ASV)',
  // Informationsblatt S. 3: Sozialhilfe → Auszahlung an den Sozialdienst; EL → Ausgleichskasse
  // des Kantons Bern (AKB) berechnet den Beitrag.
  stelleSatz: 'Das ASV prüft den Anspruch und nimmt die Anträge entgegen. Wer Ergänzungsleistungen bezieht, hat einen eigenen Weg: Den Beitrag berechnet die Ausgleichskasse des Kantons Bern. Wer Sozialhilfe bezieht, wendet sich an den Sozialdienst.',
  amtsseite: 'Seite des Amts für Sozialversicherungen zur Prämienverbilligung',
  besonders: [
    // Informationsblatt S. 3, «Wann können Sie die Überprüfung … während des Jahres beantragen?»:
    // familiäre Verhältnisse; finanzielle «erheblich und dauerhaft»; «Arbeitslosigkeit gilt nicht
    // als dauerhaft»; «rückwirkend, aber maximal bis zum 1. Januar des laufenden Kalenderjahres».
    'Haben sich Ihre Familienverhältnisse geändert, etwa durch Heirat, Trennung oder einen Todesfall, oder ist Ihr Einkommen erheblich und dauerhaft gesunken, können Sie eine neue Prüfung beantragen. Arbeitslosigkeit gilt dabei nicht als dauerhaft.',
    'Die neue Prüfung wirkt höchstens bis zum Anfang des laufenden Jahres zurück. Ein Anspruch folgt aus dem Antrag nicht von selbst.',
    // Informationsblatt S. 1: unverheiratet, gleicher Haushalt, mindestens ein gemeinsames Kind
    // → «wie bei einem verheirateten Paar».
    'Paare, die unverheiratet zusammenleben und ein gemeinsames Kind haben, werden wie ein Ehepaar berechnet.',
  ],
  quellen: [
    { text: 'Amt für Sozialversicherungen: Informationen zur Prämienverbilligung (PDF)', url: 'https://www.asv.dij.be.ch/content/dam/asv_dij/dokumente/de/pr%C3%A4mienverbilligung--informationen/Informationsblatt%202026_de.pdf' },
    { text: 'Amt für Sozialversicherungen: Prämienverbilligung beantragen', url: 'https://www.asv.dij.be.ch/de/start/themen/pv/pv_anrecht-auf-pv-beantragen.html' },
    // BELEX ist eine Web-App (jede Adresse 200); Bestand über die API belegt, 842.999 → 404.
    { text: 'Einführungsgesetz zu den Bundesgesetzen über die Kranken-, Unfall- und Militärversicherung (EG KUMV, BSG 842.11)', url: 'https://www.belex.sites.be.ch/app/de/texts_of_law/842.11' },
    { text: 'Kantonale Krankenversicherungsverordnung (KKVV, BSG 842.111.1)', url: 'https://www.belex.sites.be.ch/app/de/texts_of_law/842.111.1' },
    KVG65,
  ],
};
