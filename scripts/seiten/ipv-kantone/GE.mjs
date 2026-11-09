// Prämienverbilligung · Kanton GE. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Abgerufen 09.11.2026:
//   [D26] ge.ch, «Demander un subside d'assurance-maladie 2026», Dernière mise à jour 9 juillet 2026
//         (= Amtslink der App), mit den Unterseiten «Changement de situation économique ou familiale
//         2026», «Domiciliation à Genève en 2025 ou 2026», «Imposition à la source en 2024», «Avis de
//         taxation 2024 non reçu ou taxation d'office en 2024»
//   [D27] ge.ch, «Demander un subside d'assurance-maladie 2027», Dernière mise à jour 26 octobre 2026
//         — dieselbe Liste, jedes Jahr um eins verschoben (darum unten ohne Jahreszahlen formuliert)
//   [INFO] ge.ch, «Informations générales sur le subside de l'assurance-maladie», 26 octobre 2026
//   [LaLAMal] rsGE J 3 05 · [RaLAMal] rsGE J 3 05.01 (silgeneve.ch)
//   Gegenprobe ge.ch/…-2026-erfunden-xyz → 404; silgeneve.ch/legis/data/rsg_j9_99.htm → 404.
// Sprache der Quellen: Französisch; die Zitate stehen im Original.
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Genf',
  slug: 'genf',
  weg: 'automatisch',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // [D26]/[D27]: «Le subside est en principe accordé automatiquement sur la base du revenu d'il y
    // a deux ans.» [INFO]: «Il n'y a donc pas besoin d'en faire la demande.»
    'Im Kanton Genf gibt es die Prämienverbilligung, auf Französisch «subside», in der Regel von Amtes wegen. Das heisst: Sie müssen dafür nichts einreichen. Grundlage ist Ihr Einkommen von vor zwei Jahren.',
    // LaLAMal art. 23 al. 1: «L'administration fiscale cantonale transmet au service de
    // l'assurance-maladie … une liste des contribuables dont les ressources sont comprises dans les
    // limites … établie sur la base de la dernière taxation.» al. 3–4: Liste an die Versicherer,
    // «Il adresse une attestation à chaque bénéficiaire … le montant du subside accordé, la date à
    // partir de laquelle le droit au subside prend naissance … Ce document doit être conservé».
    'Die Steuerverwaltung meldet dem kantonalen Service de l’assurance-maladie (SAM), wer nach der letzten Veranlagung in Frage kommt. Der SAM meldet die Verbilligung Ihrer Krankenkasse und schickt Ihnen eine Bestätigung mit Betrag und Beginn. Bewahren Sie diese Bestätigung auf.',
    // [D26]/[D27]: «Certaines catégories de personnes doivent cependant déposer une demande pour l'avoir.»
    'Bestimmte Gruppen bekommen die Verbilligung aber nur auf Antrag.',
  ],
  // [D26] (2026) und [D27] (2027), Liste «Pour qui», hier ohne Jahreszahlen: «Les jeunes adultes
  // (naissance entre 2001 et 2007)» (= 19 bis 25 im Anspruchsjahr) · «Les personnes imposées à la
  // source en 2024» · «Les personnes arrivées à Genève en 2025 ou en 2026» · «revenu …
  // particulièrement bas en 2024» · «revenus bruts ou la fortune brute dépassaient …» · «n'ont pas
  // reçu leur avis de taxation 2024 ou qui ont été taxées d'office en 2024» · «situation économique
  // ou familiale a changé récemment». RaLAMal art. 10 (Vermutungen), art. 13C (enfant supplémentaire).
  selbst: {
    einleitung: 'Einen Antrag beim SAM stellen müssen Sie, wenn einer dieser Fälle auf Sie zutrifft. «Massgebendes Jahr» heisst hier: das Steuerjahr von vor zwei Jahren.',
    punkte: [
      'Sie sind zwischen 19 und 25 Jahre alt.',
      'Sie wurden im massgebenden Jahr an der Quelle besteuert.',
      'Sie sind im Vorjahr oder im laufenden Jahr nach Genf gezogen.',
      'Ihr Einkommen lag im massgebenden Jahr unter einer festen Untergrenze.',
      'Ihr Bruttoeinkommen oder Ihr Bruttovermögen lag im massgebenden Jahr über einer festen Grenze.',
      'Sie haben für das massgebende Jahr keine Veranlagung erhalten oder wurden nach Ermessen veranlagt (taxation d’office).',
      'Ihre wirtschaftliche oder familiäre Lage hat sich seither verändert, zum Beispiel durch ein weiteres Kind.',
    ],
    schluss: 'Formulare und Grenzen stehen auf den Seiten des SAM. In diesen Fällen gibt es ohne Antrag keine Verbilligung.',
  },
  // RaLAMal art. 10A: «Des subsides ne peuvent être octroyés que pour les demandes adressées au
  // service avant le 30 novembre de l'année d'ouverture du droit … Le service n'entre pas en matière
  // sur des demandes présentées hors délai.» LaLAMal art. 23 al. 7: «Le non-respect des délais …
  // entraîne la péremption du droit aux subsides pour l'année concernée.» RaLAMal art. 13B al. 5
  // (zweites Halbjahr ⇒ «jusqu'au 30 juin de l'année suivante»); [D26] Domiciliation: «Les
  // personnes arrivées à Genève dès le 1er novembre 2026 ont un délai jusqu'au 30 juin 2027».
  fristSatz: 'Für diese Anträge gilt eine Frist im laufenden Jahr. Was später eintrifft, behandelt der SAM nicht mehr, der Anspruch für dieses Jahr verfällt. Für Änderungen in der zweiten Jahreshälfte und für einen Zuzug spät im Jahr gilt eine längere Frist.',
  stelle: 'Service de l’assurance-maladie (SAM)',
  // [INFO]: «Les demandes de subside sont effectuées par correspondance ou en ligne. Le SAM ne reçoit
  // du public que sur rendez-vous.» RaLAMal art. 11A al. 1 (PC AVS/AI: «le service des prestations
  // complémentaires communique au service notamment le nom des assurés bénéficiaires …»), art. 11B
  // (PC familiales), art. 11C al. 1 und 4 (Hospice général); LaLAMal art. 22 al. 7–9.
  stelleSatz: 'Der kantonale Dienst für Krankenversicherung (SAM) entscheidet und nimmt Anträge per Post oder online entgegen. Am Schalter empfängt er nur mit Termin. Wer Ergänzungsleistungen zur AHV oder IV, Familien-Ergänzungsleistungen oder Sozialhilfe des Hospice général bezieht, erhält die Verbilligung über diese Stellen, die die Daten direkt an den SAM melden.',
  amtsseite: 'Seite des Kantons Genf zum Antrag auf Prämienverbilligung (französisch)',
  besonders: [
    // LaLAMal art. 21 al. 3 («revenu déterminant … loi sur le revenu déterminant unifié»), art. 21
    // al. 1 (Gruppen 1–8), art. 22 al. 1 («Le montant des subsides est de : Groupe 1 : … par mois»).
    'Genf rechnet mit dem «revenu déterminant unifié» (RDU), einem einheitlichen massgebenden Einkommen, das auch für andere kantonale Leistungen gilt. Danach kommen Sie in eine Gruppe, und jede Gruppe hat einen festen Monatsbetrag.',
    // [D26]/[D27]: «les personnes vivant en concubinage avec un ou plusieurs enfants issus de leur
    // union, forment un groupe familial. Les RDU … respectifs sont additionnés … Formulaire pour les
    // personnes vivant en concubinage».
    'Unverheiratete Paare mit gemeinsamem Kind gelten wie Ehepaare als eine Familie, ihre Einkommen werden zusammengezählt. Für sie gibt es ein eigenes Formular.',
    // RaLAMal art. 13B al. 1–3: «situation économique s'est durablement et notablement aggravée …
    // par une demande écrite»; «durable … depuis plus de 6 mois»; «notable … diminution de 20% ou
    // plus». Art. 13E al. 1: «tenus d'informer le service sans délai lorsque leur situation s'améliore».
    'Hat sich Ihre Lage seit dem massgebenden Jahr dauerhaft und deutlich verschlechtert, können Sie schriftlich eine Berechnung nach der neuen Lage verlangen. Was dauerhaft und deutlich heisst, legt die Verordnung fest. Wer so eine Verbilligung erhält, meldet eine spätere Verbesserung sofort.',
    // LaLAMal art. 33 al. 1: «Les subsides indûment touchés doivent être restitués …»;
    // RaLAMal art. 13E al. 2 (Verbesserung ⇒ «considérés comme indûment touchés»).
    'Was zu Unrecht ausbezahlt wurde, verlangt der SAM zurück.',
    // LaLAMal art. 32: «En cas de changement d'assureur, l'assuré doit annoncer au service de
    // l'assurance-maladie dans les meilleurs délais, mais au plus tard à la fin de l'année civile en
    // cours, le nom de son nouvel assureur pour bénéficier du subside.»
    'Wechseln Sie die Krankenkasse, melden Sie dem SAM laut Gesetz den Namen der neuen Kasse möglichst bald, spätestens bis Ende Jahr.',
    // LaLAMal art. 27 lit. b: «les assurés qui font l'objet d'une taxation d'office, à moins que
    // ceux-ci puissent justifier de démarches en vue de la régularisation de leur situation fiscale …»
    'Wer nach Ermessen veranlagt wurde, hat grundsätzlich keinen Anspruch, ausser die Person belegt, dass sie ihre Steuersituation in Ordnung bringt.',
    // LaLAMal art. 22 al. 6: «Le versement des subsides cesse le jour du départ de Suisse de l'assuré bénéficiaire.»
    'Die Verbilligung endet am Tag, an dem Sie die Schweiz verlassen.',
  ],
  quellen: [
    { text: 'Kanton Genf: Allgemeine Informationen zum Subside (französisch)', url: 'https://www.ge.ch/informations-generales-subside-assurance-maladie' },
    { text: 'Loi d’application de la loi fédérale sur l’assurance-maladie (LaLAMal, rsGE J 3 05)', url: 'https://silgeneve.ch/legis/data/rsg_j3_05.htm' },
    { text: 'Règlement d’exécution de la LaLAMal (RaLAMal, rsGE J 3 05.01)', url: 'https://silgeneve.ch/legis/data/rsg_j3_05p01.htm' },
    KVG65,
  ],
};
