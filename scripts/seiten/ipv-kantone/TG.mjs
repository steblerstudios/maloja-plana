// Prämienverbilligung · Kanton TG. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons.
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Thurgau',
  slug: 'thurgau',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // Quellenblatt TG «Zuständig / Weg»: «reines Antragsprinzip, jährlich; Gemeinde stellt
    // Berechtigten im Frühjahr ein Formular zu».
    'Im Kanton Thurgau gibt es die Prämienverbilligung nur auf Antrag, und zwar jedes Jahr neu. Die Gemeinde stellt Personen, die nach den Steuerdaten in Frage kommen, im Frühjahr ein Formular zu.',
    'Das unterschriebene Formular geben Sie bei der Krankenkassenkontrollstelle Ihrer Gemeinde ab.',
    // Merkblatt S. 2: «EL-Bezügerinnen und -Bezüger erhalten eine Prämienpauschale … Ein
    // IPV-Antrag ist nicht notwendig.»
    'Wer Ergänzungsleistungen bezieht, erhält eine Prämienpauschale und muss keinen Antrag stellen.',
  ],
  // Merkblatt S. 2 (Jahresaufenthalt mit Quellensteuer ohne Formular, Grenzgänger,
  // Kurzaufenthalter: Antrag selbst stellen; «Wird diese Frist verpasst, verfällt der Anspruch.»;
  // «Bei einem Wegfall der Ergänzungsleistungen oder der Sozialhilfe … muss fristgerecht
  // eingereicht werden»); TG KVV § 22 Abs. 1 und § 22a Abs. 1.
  selbst: {
    einleitung: 'Kein Formular bekommen Sie zum Beispiel in diesen Fällen. Dann müssen Sie den Antrag selbst stellen:',
    punkte: [
      'Sie arbeiten als Grenzgängerin oder Grenzgänger im Thurgau.',
      'Sie haben eine Kurzaufenthaltsbewilligung.',
      'Sie haben eine Jahresaufenthaltsbewilligung, werden an der Quelle besteuert und haben kein Formular erhalten.',
      'Sie beziehen keine Ergänzungsleistungen oder keine Sozialhilfe mehr.',
    ],
    schluss: 'Auch dafür gilt eine Frist.',
  },
  // Merkblatt S. 1: «Wird diese Frist verpasst, verfällt der Anspruch.»; TG KVG § 9 Abs. 2.
  fristSatz: 'Laut Merkblatt des Kantons verfällt der Anspruch, wenn die Frist verpasst wird. Die Frist steht auf dem Formular und im Merkblatt.',
  stelle: 'Krankenkassenkontrollstelle Ihrer Wohngemeinde',
  // TG KVV § 2 Abs. 3; Merkblatt «Zuständigkeiten»: Grenzgänger bei der Gemeinde des Arbeitsorts.
  stelleSatz: 'Zuständig ist die Gemeinde, in der Sie wohnen. Grenzgängerinnen und Grenzgänger wenden sich an die Gemeinde ihres Arbeitsorts.',
  amtsseite: 'Seite des Amts für Gesundheit des Kantons Thurgau zur Prämienverbilligung',
  besonders: [
    // TG KVV § 14; einfache Steuer aus Einkommen und Vermögen (TG StG § 6 Abs. 1).
    'Der Thurgau rechnet nicht direkt mit dem Einkommen, sondern mit dem einfachen Steuerbetrag laut Steuerdaten. Es gibt wenige feste Stufen.',
    // TG KVG § 5 Abs. 1bis; TG StG § 53 Abs. 1 (Freibeträge), Quellenblatt TG «präzisiert».
    'Anspruch hat nur, wer nach Abzug der steuerfreien Beträge kein steuerbares Vermögen hat. Erspartes allein schliesst Sie also nicht aus. Bei Kindern zählt das Vermögen der Eltern.',
    // TG KVV § 15 Abs. 2: Neubemessung nur auf Antrag, kurze Frist ab rechtskräftiger
    // Feststellung (u. a. definitive Steuerschlussrechnung, Sozialhilfe-Entscheid);
    // Merkblatt S. 2: «Wird die Frist verpasst, verfällt ein allfälliger Anspruch.»
    'Eine Neubemessung gibt es nur auf Antrag, und die Frist dafür ist kurz. Sie beginnt mit dem Entscheid, der die Änderung belegt, etwa der definitiven Steuerschlussrechnung oder einem Entscheid über Sozialhilfe. Wer sie verpasst, verliert den Anspruch.',
    // Merkblatt S. 1 «Junge Erwachsene in Ausbildung»: «erhalten im laufenden Jahr die zustehende
    // IPV … Sie können im Folgejahr eine Neubeurteilung beantragen.»; TG KVG § 5 Abs. 6.
    'Junge Erwachsene, die Ende Jahr in Ausbildung sind, können einen höheren Beitrag bekommen. Dafür beantragen sie im folgenden Jahr eine Neubeurteilung.',
    // TG KVG § 4 Abs. 3: Neugeborene und neu Angemeldete sind ab dem folgenden Jahr bezugsberechtigt.
    'Wer neu in den Thurgau zieht, ist hier erst ab dem folgenden Jahr bezugsberechtigt. Das gilt auch für Neugeborene.',
  ],
  quellen: [
    { text: 'Amt für Gesundheit Thurgau: Merkblatt Prämienverbilligung (PDF)', url: 'https://gesundheit.tg.ch/public/upload/assets/183453/Merkblatt%20IPV%202026.pdf' },
    // Rechtsbuch TG ist eine Web-App (jede Adresse 200); Bestand über die API belegt, 832.999 → 404.
    { text: 'Gesetz über die Krankenversicherung des Kantons Thurgau (TG KVG, RB 832.1)', url: 'https://www.rechtsbuch.tg.ch/app/de/texts_of_law/832.1' },
    { text: 'Verordnung zum Gesetz über die Krankenversicherung des Kantons Thurgau (TG KVV, RB 832.10)', url: 'https://www.rechtsbuch.tg.ch/app/de/texts_of_law/832.10' },
    KVG65,
  ],
};
