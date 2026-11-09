// Prämienverbilligung · Kanton JU. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Abgerufen 09.11.2026:
//   [ECAS] ecasjura.ch, «Réduction des primes d'assurance-maladie (RPI) - Informations générales
//          2026» (= Amtslink der App) — Gegenprobe …/Erfunden-xyz/Erfunden-xyz.html → 404
//   [ECAS-CH] dieselbe Website, «RPI - Changement de situation en cours d'année» (Index.aspx?id=19494)
//   [ECAS-KT] dieselbe Website, «RPI - Changement de canton de domicile»
//   [ECAS-J] / [ECAS-K] / [ECAS-Q] Unterseiten «Jeunes adultes 18-25 ans», «Concubins»,
//          «Personnes imposées à la source»
//   [ORPAMal] Ordonnance RSJU 832.115, «valable dès 01.01.2026» (PDF der ECAS) — Gegenprobe
//          erfundener Datei-Hash → 410
//   [Arrêté] RSJU 832.115.1 (Jahreserlass mit Tabellen); S. 1–3 sind ein Scan ohne Textlayer, der
//          Wortlaut von Art. 1 steht in docs/sources/ipv-kantone-2026.md (Abschnitt JU, am Seitenbild gelesen)
// Sprache der Quellen: Französisch; die Zitate stehen im Original.
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Jura',
  slug: 'jura',
  weg: 'automatisch',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // [ECAS]: «Le droit aux subsides est étudié d'office si vous avez reçu votre décision fiscale pour
    // l'année 2024.» Arrêté art. 1 al. 1: «le revenu imposable taxé définitivement pour l'année
    // fiscale 2024 sert de base de calcul» (Jahr 2026 ⇒ vorletztes Jahr).
    'Im Kanton Jura prüft die Ausgleichskasse den Anspruch in der Regel von Amtes wegen, ohne dass Sie zuerst etwas einreichen. Sie tut das, sobald Ihre definitive Steuerveranlagung für das vorletzte Jahr vorliegt.',
    // [ORPAMal] art. 19: «La Caisse de compensation rend d'office une décision d'octroi pour chaque
    // assuré … dans la mesure où il en a déjà bénéficié l'année précédente.» Art. 15 al. 1–2:
    // attestation an neu Berechtigte; «L'assuré présente l'attestation dûment remplie, signée et
    // accompagnée de son certificat d'assurance-maladie … à titre de demande.» [ECAS]: «vous recevrez
    // de notre part soit une décision, soit un questionnaire».
    // Letzter Satz (Fachprüfung 09.11.): [ECAS-J]: «Si vous recevez une décision de réduction des primes
    // d'assurance-maladie sur laquelle un jeune adulte de 18 à 25 ans en formation n'apparaît pas,
    // veuillez nous demander de corriger votre décision en nous remettant une copie de l'attestation
    // d'études/de formation»; Frist wie [ORPAMal] art. 22 al. 8 (bis Ende des Versicherungsjahres).
    'Hatten Sie schon im Vorjahr eine Verbilligung, kommt der Entscheid direkt. Kommen Sie neu in Frage, erhalten Sie eine Bescheinigung oder einen Fragebogen. Diesen füllen Sie aus, unterschreiben ihn und schicken ihn mit dem Versicherungsausweis Ihrer Krankenkasse zurück. Das gilt als Antrag. Fehlt auf dem Entscheid ein Kind zwischen 18 und 25 in Ausbildung, verlangen Sie mit der Ausbildungsbestätigung eine Korrektur, noch im selben Jahr.',
    // [ECAS]: «Si vous n'êtes pas taxés pour 2024 avant décembre 2026 ou si vous n'obtenez pas de
    // courrier de notre part après avoir été taxé pour 2024 dans les 30 jours suivant la taxation,
    // nous vous prions de bien vouloir déposer une requête». Rechtsprüfung 09.11.: ohne Tageszahl.
    'Kommt innert kurzer Frist nach Ihrer Veranlagung kein Brief, oder sind Sie gegen Ende Jahr noch nicht veranlagt, stellen Sie selbst einen Antrag.',
    // [ORPAMal] art. 14: «… à l'exception des bénéficiaires de prestations complémentaires à
    // l'AVS/AI qui l'obtiennent d'office.» Art. 18 al. 1–2: «Celui qui fournit des aides financières
    // aux assurés démunis peut présenter la demande … à la place des assurés … bénéficiaires d'aide sociale.»
    'Wer Ergänzungsleistungen zur AHV oder IV bezieht, erhält die Verbilligung von Amtes wegen. Bei Sozialhilfe kann die Stelle, die die Hilfe ausrichtet, den Antrag für Sie stellen.',
  ],
  // [ORPAMal] art. 15 al. 4: «Ne reçoivent pas d'attestation : − les personnes imposées à la source;
  // − les assurés âgés de moins de 25 ans; − les personnes bénéficiant de l'aide sociale; − les
  // personnes taxées à titre provisoire; − les personnes assujetties à l'impôt à titre partiel et
  // domiciliées dans le Canton; − les personnes arrivées dans le Canton durant l'année qui précède
  // l'année d'assurance.» Art. 17 al. 2 (unter 25: «la demande est introduite par leurs parents»);
  // [ECAS-J]: «une demande doit être déposée par les parents des jeunes adultes en formation»;
  // [ECAS-K]: «La fortune disponible est cumulée ; Les revenus déterminants des concubins sont
  // cumulés … il est impératif que les deux concubins soient définitivement taxés».
  selbst: {
    einleitung: 'Keine Bescheinigung bekommen Sie in diesen Fällen. Dann stellen Sie den Antrag mit dem passenden Formular der Ausgleichskasse selbst:',
    punkte: [
      'Sie werden an der Quelle besteuert.',
      // Fachprüfung 09.11.: [ORPAMal] art. 17 al. 1: «Les assurés de moins de 25 ans doivent présenter une
      // demande … lorsqu'ils assument eux-mêmes leur entretien.» Al. 2: «Dans les autres cas, la demande
      // est introduite par leurs parents». [ECAS-J]: «s'il commence une formation durant l'année 2026,
      // une requête … doit être déposée … au nom du parent»; «Si vous avez entre 18 et 25 ans et n'êtes
      // plus en formation, nous pouvons étudier votre éventuel droit … dès l'année qui suit la fin de
      // votre formation. A cet effet, veuillez nous faire parvenir une requête».
      'Sie sind volljährig, aber jünger als 25 Jahre. Sind Sie in Ausbildung, stellen Ihre Eltern den Antrag für Sie; beginnen Sie im Lauf des Jahres eine Ausbildung, melden die Eltern das noch im selben Jahr. Nach Ende der Ausbildung stellen Sie ab dem folgenden Jahr selbst einen Antrag.',
      // Fachprüfung 09.11.: [ECAS-K]: «Afin d'établir le droit à la réduction des primes (ainsi que du
      // supplément famille) des enfants en commun à charge : La fortune disponible est cumulée ; Les
      // revenus déterminants des concubins sont cumulés.» — gilt für die gemeinsamen Kinder.
      'Sie leben unverheiratet zusammen und haben mindestens ein gemeinsames Kind. Dann werden für Ihre gemeinsamen Kinder Einkommen und Vermögen beider zusammengezählt, und beide müssen definitiv veranlagt sein.',
      'Sie beziehen Sozialhilfe.',
      'Sie wurden nur provisorisch veranlagt oder sind im Kanton nur teilweise steuerpflichtig.',
      // Fachprüfung 09.11.: [ORPAMal] art. 22 al. 6: «Les assurés en provenance d'un autre canton le
      // premier janvier de l'année d'assurance, peuvent déposer une demande en cours d'année.»
      'Sie sind im Vorjahr oder auf den Jahresanfang in den Kanton Jura gezogen.',
      // Fachprüfung 09.11.: [ORPAMal] art. 22 al. 4: «Les assurés en provenance de l'étranger peuvent
      // déposer une demande en cours d'année.» Art. 21 al. 2: «le droit … naît le premier jour du mois
      // de l'affiliation, à condition que la demande soit déposée avant la fin de cette année.»
      'Sie sind im laufenden Jahr aus dem Ausland zugezogen. Der Antrag muss noch im selben Jahr eintreffen.',
    ],
    schluss: 'Die Formulare stehen auf der Seite der Ausgleichskasse.',
  },
  // [ORPAMal] art. 21 al. 1: «Le droit à la réduction des primes prend naissance le 1er janvier de
  // l'année au cours de laquelle la demande est déposée.» Art. 22 al. 8: «Les demandes
  // intermédiaires doivent être déposées au plus tard jusqu'au 31 décembre de l'année d'assurance.»
  // [ECAS]: «une requête, qui devra nous parvenir avant le 31 décembre 2026».
  // Fachprüfung 09.11.: art. 21 al. 1 gilt für den Antrag; für Gesuche um Neuberechnung legt art. 22
  // al. 7 eine andere Grundlage fest («sera fixé sur la base de la taxation définitive de l'année
  // d'assurance pour laquelle la demande a été déposée»), art. 21 al. 2 den Beginn bei Zuzug («le
  // premier jour du mois de l'affiliation»).
  fristSatz: 'Für den Antrag gilt eine Frist: Er muss im laufenden Jahr bei der Ausgleichskasse eintreffen, ebenso ein Gesuch um Neuberechnung. Ein Antrag, der in dieser Frist eintrifft, wirkt auf den Anfang des Jahres zurück. Für Neuberechnungen gilt das nicht in jedem Fall; melden Sie Änderungen sofort.',
  stelle: 'Caisse de compensation du canton du Jura (ECAS)',
  // [ECAS]: «La Caisse de compensation du canton du Jura est chargée de l'application de la
  // réduction des primes»; Adresse «ETABLISSEMENT CANTONAL DES ASSURANCES SOCIALES - ECAS Jura …
  // Rue Bel-Air 3 … 2350 Saignelégier».
  stelleSatz: 'Zuständig ist die kantonale Ausgleichskasse in Saignelégier. Sie gehört zum Etablissement cantonal des assurances sociales (ECAS), der kantonalen Anstalt für Sozialversicherungen.',
  // Ziel seit 09.11.2026 die Bereichsseite ohne Jahr; ihr Menü führt alle Seiten zur RPI.
  amtsseite: 'Seite der Ausgleichskasse Jura zur Krankenversicherung und Prämienverbilligung (französisch)',
  besonders: [
    // Arrêté art. 1 al. 1 (siehe oben), al. 4–5 (Korrekturen und Abzüge); [ECAS]: «calculé sur la
    // base du revenu imposable tel qu'il ressort de la taxation fiscale définitive de l'année 2024 …
    // et est corrigé par diverses déductions ou majorations». ipvJura.js: darum keine Zahl in der App.
    // Satz «Es liegt meist tiefer als das Nettoeinkommen auf dem Lohnausweis.» gestrichen
    // (Rechtsprüfung 09.11.: ohne Quelle).
    'Der Jura rechnet mit dem steuerbaren Einkommen der definitiven Veranlagung, also nach den Steuerabzügen, und korrigiert es mit einigen Zu- und Abschlägen.',
    // [ORPAMal] art. 7a al. 1: «Les assurés dont la fortune déterminante est supérieure à … n'ont pas
    // droit à la réduction des primes»; Arrêté art. 1 al. 2 («titres et autres placements de
    // capitaux selon avis de taxation»); [ECAS]: «pour autant que leur fortune disponible soit inférieure à …».
    'Wer viel Vermögen in Wertschriften und Guthaben hat, bekommt keine Teilverbilligung. Die Grenze steht in der kantonalen Verordnung.',
    // [ECAS] «Qui peut bénéficier de « supplément famille » ?»: «Réaliser un revenu professionnel par
    // le biais d'une activité principale ; Avoir un ou des enfants à charge ; Avoir un revenu
    // déterminant inférieur à …».
    // Zweiter Satz (Fachprüfung 09.11.): [ECAS] Fussnote: «Si vous avez annoncé au fisc un revenu
    // professionnel en gain accessoire (chiffre 110) …, le supplément famille ne vous a pas été accordé.
    // … veuillez nous le signaler en fournissant les justificatifs.»
    'Familien mit tiefem Einkommen, in denen mindestens ein Elternteil im Hauptberuf erwerbstätig ist, erhalten einen Familienzuschlag. Haben Sie ein kleines Erwerbseinkommen in der Steuererklärung als Nebenerwerb angegeben, wird der Zuschlag nicht automatisch gewährt; melden Sie es der Ausgleichskasse mit Belegen.',
    // [ECAS-CH]: «Vos revenus ont diminué … transmettez-nous … votre décision de taxation définitive
    // 2025 en nous demandant de revoir la décision»; «Vous avez perdu votre emploi … en nous demandant
    // de revoir la décision»; [ORPAMal] art. 22 al. 1–2.
    'Fällt die Veranlagung des Vorjahres für Sie günstiger aus oder verlieren Sie die Stelle, können Sie eine Neuberechnung verlangen.',
    // [ECAS-CH]: «vos revenus ont depuis augmenté, il n'est pas nécessaire de nous transmettre
    // l'information. Aucun remboursement ne vous sera demandé en lien avec une augmentation de
    // revenus … prise en compte dans les taxations suivantes». Rechtsprüfung 09.11.: der Ausgleichskasse
    // zugeschrieben (Aussage der ECAS-Seite, nicht der Verordnung).
    'Steigt Ihr Einkommen? Laut Ausgleichskasse müssen Sie das nicht melden, und es wird deswegen nichts zurückgefordert. Das höhere Einkommen zählt erst mit einer späteren Veranlagung.',
    // [ECAS-CH]: «Vous avez donné naissance à un enfant ou adopté un enfant … Annoncez-nous la
    // naissance ou l'adoption … en nous indiquant également sa caisse-maladie.»
    'Eine Geburt oder Adoption melden Sie der Ausgleichskasse, zusammen mit dem Namen der Krankenkasse des Kindes.',
    // [ORPAMal] art. 22 al. 5: «Les assurés en provenance d'un autre canton au cours de l'année
    // d'assurance qui ne bénéficient ni de prestations complémentaires … ni de l'aide sociale ne
    // peuvent bénéficier de la réduction des primes pour l'année considérée.» [ECAS-KT]: «votre
    // canton de domicile au 1er janvier … (ancien canton) est compétent».
    'Ziehen Sie im Lauf des Jahres aus einem anderen Kanton zu, bekommen Sie im Jura für dieses Jahr keine Teilverbilligung. Zuständig bleibt der bisherige Kanton.',
    // [ORPAMal] art. 13 lit. b: «les personnes qui ont été taxées d'office par le Service des
    // contributions … faute d'avoir rempli une déclaration d'impôt»; [ECAS]: «à l'exception des
    // personnes taxées d'office par le Service des contributions».
    'Ausgeschlossen ist, wer nach Ermessen veranlagt wurde, weil die Steuererklärung fehlte.',
    // [ORPAMal] art. 26 al. 1: «Les subsides cantonaux versés à tort doivent être restitués.»
    'Eine Verbilligung, die zu Unrecht ausgerichtet wurde, ist zurückzuerstatten.',
  ],
  quellen: [
    { text: 'Ordonnance concernant la réduction des primes dans l’assurance-maladie (RSJU 832.115, PDF der Ausgleichskasse)', url: 'https://www.ecasjura.ch/Htdocs/Files/v/bee518871de457c7d9af3cdfad0dfa39037365333dfc328573cdf2e7eb86da34.pdf/ORPAMal-valable-des-01.01.2026.pdf?download=1' },
    { text: 'Arrêté zur Prämienverbilligung des Jahres, mit Tabellen (RSJU 832.115.1, PDF, französisch)', url: 'https://www.ecasjura.ch/Htdocs/Files/v/5f96a91e0eb5f044bed32b1e94ba290c44619d65fb5d3f26f4180819cda93fe4.pdf/Arrete-2026-avec-annexes.pdf?download=1' },
    KVG65,
  ],
};
