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
    'Hatten Sie schon im Vorjahr eine Verbilligung, kommt der Entscheid direkt. Kommen Sie neu in Frage, erhalten Sie eine Bescheinigung oder einen Fragebogen. Diesen füllen Sie aus, unterschreiben ihn und schicken ihn mit dem Versicherungsausweis Ihrer Krankenkasse zurück. Das gilt als Antrag.',
    // [ECAS]: «Si vous n'êtes pas taxés pour 2024 avant décembre 2026 ou si vous n'obtenez pas de
    // courrier de notre part après avoir été taxé pour 2024 dans les 30 jours suivant la taxation,
    // nous vous prions de bien vouloir déposer une requête».
    'Kommt innert 30 Tagen nach Ihrer Veranlagung kein Brief, oder sind Sie gegen Ende Jahr noch nicht veranlagt, stellen Sie selbst einen Antrag.',
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
      'Sie sind volljährig, aber jünger als 25 Jahre. Sind Sie in Ausbildung, stellen Ihre Eltern den Antrag für Sie.',
      'Sie leben unverheiratet zusammen und haben mindestens ein gemeinsames Kind. Dann zählen Einkommen und Vermögen beider zusammen, und beide müssen definitiv veranlagt sein.',
      'Sie beziehen Sozialhilfe.',
      'Sie wurden nur provisorisch veranlagt oder sind im Kanton nur teilweise steuerpflichtig.',
      'Sie sind im Vorjahr in den Kanton Jura gezogen.',
    ],
    schluss: 'Die Formulare stehen auf der Seite der Ausgleichskasse.',
  },
  // [ORPAMal] art. 21 al. 1: «Le droit à la réduction des primes prend naissance le 1er janvier de
  // l'année au cours de laquelle la demande est déposée.» Art. 22 al. 8: «Les demandes
  // intermédiaires doivent être déposées au plus tard jusqu'au 31 décembre de l'année d'assurance.»
  // [ECAS]: «une requête, qui devra nous parvenir avant le 31 décembre 2026».
  fristSatz: 'Für den Antrag gilt eine Frist: Er muss im laufenden Jahr bei der Ausgleichskasse eintreffen, ebenso ein Gesuch um Neuberechnung. Ein Antrag in dieser Frist wirkt auf den Anfang des Jahres zurück.',
  stelle: 'Caisse de compensation du canton du Jura (ECAS)',
  // [ECAS]: «La Caisse de compensation du canton du Jura est chargée de l'application de la
  // réduction des primes»; Adresse «ETABLISSEMENT CANTONAL DES ASSURANCES SOCIALES - ECAS Jura …
  // Rue Bel-Air 3 … 2350 Saignelégier».
  stelleSatz: 'Zuständig ist die kantonale Ausgleichskasse in Saignelégier. Sie gehört zum Etablissement cantonal des assurances sociales (ECAS), der kantonalen Anstalt für Sozialversicherungen.',
  amtsseite: 'Seite der Ausgleichskasse Jura zur Prämienverbilligung (französisch)',
  besonders: [
    // Arrêté art. 1 al. 1 (siehe oben), al. 4–5 (Korrekturen und Abzüge); [ECAS]: «calculé sur la
    // base du revenu imposable tel qu'il ressort de la taxation fiscale définitive de l'année 2024 …
    // et est corrigé par diverses déductions ou majorations». ipvJura.js: darum keine Zahl in der App.
    'Der Jura rechnet mit dem steuerbaren Einkommen der definitiven Veranlagung, also nach den Steuerabzügen, und korrigiert es mit einigen Zu- und Abschlägen. Es liegt meist tiefer als das Nettoeinkommen auf dem Lohnausweis.',
    // [ORPAMal] art. 7a al. 1: «Les assurés dont la fortune déterminante est supérieure à … n'ont pas
    // droit à la réduction des primes»; Arrêté art. 1 al. 2 («titres et autres placements de
    // capitaux selon avis de taxation»); [ECAS]: «pour autant que leur fortune disponible soit inférieure à …».
    'Wer viel Vermögen in Wertschriften und Guthaben hat, bekommt keine Teilverbilligung. Die Grenze steht in der kantonalen Verordnung.',
    // [ECAS] «Qui peut bénéficier de « supplément famille » ?»: «Réaliser un revenu professionnel par
    // le biais d'une activité principale ; Avoir un ou des enfants à charge ; Avoir un revenu
    // déterminant inférieur à …».
    'Familien mit tiefem Einkommen, in denen mindestens ein Elternteil im Hauptberuf erwerbstätig ist, erhalten einen Familienzuschlag.',
    // [ECAS-CH]: «Vos revenus ont diminué … transmettez-nous … votre décision de taxation définitive
    // 2025 en nous demandant de revoir la décision»; «Vous avez perdu votre emploi … en nous demandant
    // de revoir la décision»; [ORPAMal] art. 22 al. 1–2.
    'Fällt die Veranlagung des Vorjahres für Sie günstiger aus oder verlieren Sie die Stelle, können Sie eine Neuberechnung verlangen.',
    // [ECAS-CH]: «vos revenus ont depuis augmenté, il n'est pas nécessaire de nous transmettre
    // l'information. Aucun remboursement ne vous sera demandé en lien avec une augmentation de
    // revenus … prise en compte dans les taxations suivantes».
    'Steigt Ihr Einkommen, müssen Sie das nicht melden, und es wird deswegen nichts zurückgefordert. Das höhere Einkommen zählt erst mit einer späteren Veranlagung.',
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
    { text: 'Ordonnance concernant la réduction des primes dans l’assurance-maladie (RSJU 832.115, PDF)', url: 'https://www.ecasjura.ch/Htdocs/Files/v/bee518871de457c7d9af3cdfad0dfa39037365333dfc328573cdf2e7eb86da34.pdf/ORPAMal-valable-des-01.01.2026.pdf?download=1' },
    { text: 'Arrêté zur Prämienverbilligung des Jahres, mit Tabellen (RSJU 832.115.1, PDF, französisch)', url: 'https://www.ecasjura.ch/Htdocs/Files/v/5f96a91e0eb5f044bed32b1e94ba290c44619d65fb5d3f26f4180819cda93fe4.pdf/Arrete-2026-avec-annexes.pdf?download=1' },
    KVG65,
  ],
};
