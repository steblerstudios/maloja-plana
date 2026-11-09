// Prämienverbilligung · Kanton VD. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Abgerufen 09.11.2026:
//   [N26] OVAM, «Notice explicative : Les subsides 2026», valable dès le 1er janvier 2026
//   [N27] OVAM, «Notice explicative» für 2027, «valable dès le 1er janvier 2027» (auf vd.ch verlinkt)
//         — Gegenprobe Notice_explicative_2099.pdf → 404
//   [VD]  vd.ch, «Subside à l'assurance-maladie» (= Amtslink der App)
//   [RLVLAMal] BLV 832.01.1, Fassung «en l'état de cette version au 01.11.2025» (BLV-API)
//   [LVLAMal]  BLV 832.01, Fassung ab 01.03.2026 (BLV-API)
// Sprache der Quellen: Französisch; die Zitate stehen im Original.
//
// 🛑 Beginn des Anspruchs bewusst OHNE Monat: [N26], [N27] und [VD] nennen «le premier jour du
// deuxième mois qui suit le dépôt de la demande»; RLVLAMal art. 25 al. 1 in der Fassung ab
// 01.01.2027 (Modif. 13 du 07.10.2026) nennt «le premier jour du mois suivant». Die Quellen
// widersprechen sich für 2027 — die Seite sagt nur, DASS der Anspruch erst nach dem Antrag beginnt.
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Waadt',
  slug: 'waadt',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // [VD] §2: «Vous pouvez faire une demande en ligne ou auprès de l'agence d'assurances sociales
    // de votre région de domicile.» [N26]/[N27] S. 1: «Si vous n'avez pas encore déposé une demande de subside».
    'Im Kanton Waadt gibt es die Prämienverbilligung, auf Französisch «subside», nur auf Antrag. Den Antrag stellen Sie online oder bei der Sozialversicherungsagentur Ihrer Wohnregion, der agence d’assurances sociales (AAS).',
    // [VD] §2: «L'agence d'assurances sociales de votre région de domicile vous aide volontiers. Cet
    // appui est gratuit. Il n'est donc pas nécessaire de recourir à d'éventuels services payants».
    'Die Agentur hilft beim Ausfüllen, und zwar kostenlos. Bezahlte Dienste von Firmen brauchen Sie dafür nicht.',
    // RLVLAMal art. 27 al. 1: «Si, à la fin de la période de subside, il apparaît que les conditions
    // d'octroi pour la période suivante sont réalisées, l'assuré reçoit d'office une décision pour la
    // nouvelle période. … l'OVAM invite préalablement l'assuré à lui fournir les renseignements utiles.»
    // Letzter Satz (Fachprüfung 09.11.): Umkehrschluss aus RLVLAMal art. 27 al. 1 («l'assuré reçoit
    // d'office une décision pour la nouvelle période») und art. 25 al. 3 («la décision d'octroi couvre
    // la période allant jusqu'à la fin de l'année civile»).
    'Ist die Verbilligung einmal bewilligt, erneuert das OVAM sie jedes Jahr von sich aus, solange die Voraussetzungen erfüllt sind. Fehlen ihm Angaben, fragt es vorher bei Ihnen nach. Erhalten Sie zum Jahreswechsel keinen neuen Entscheid, stellen Sie einen neuen Antrag.',
    // [VD] §2: «Cette règle ne s'applique pas aux bénéficiaires du revenu d'insertion, des prestations
    // complémentaires AVS/AI ou de la rente-pont cantonale pour qui le droit s'ouvre en même temps de
    // la prestation.» [N26]/[N27] Ziff. 4 «Début du droit au subside».
    // Letzter Satz (Fachprüfung 09.11.): LVLAMal art. 3 al. 2: «les données nécessaires à l'OVAM sont
    // fournies par : … b. les autorités compétentes pour l'octroi de prestations complémentaires à
    // l'AVS et à l'AI et du revenu d'insertion». Nur RI und EL, die Überbrückungsrente nennt lit. b nicht.
    'Wer Sozialhilfe, in der Waadt «revenu d’insertion» (RI), Ergänzungsleistungen zur AHV oder IV oder die kantonale Überbrückungsrente bezieht, hat einen eigenen Weg: Der Anspruch beginnt zusammen mit dieser Leistung. Wer RI oder Ergänzungsleistungen bezieht, muss in der Regel keinen eigenen Antrag stellen; die Stelle, die die Leistung ausrichtet, meldet es dem OVAM.',
  ],
  // Frist: weder [N26] noch [N27] noch [VD] nennen eine Antragsfrist; sie regeln nur den Beginn
  // (siehe Kopf). Rückwirkung: RLVLAMal art. 25 al. 1 Satz 2 (in der geltenden Fassung und in der ab
  // 01.01.2027 gleich): «Lorsque le requérant établit avoir été empêché sans sa faute de déposer plus
  // tôt sa demande, … il peut être accordé exceptionnellement un subside avec effet rétroactif».
  // Letzter Satz (Rechtsprüfung 09.11.: Tatsache statt eigener Empfehlung): [N26] Ziff. 4 / [N27]
  // «Le droit au subside prend naissance le premier jour du deuxième mois qui suit le dépôt de la
  // demande»; RLVLAMal art. 25 al. 1 ab 2027: «le premier jour du mois suivant».
  // Ergänzt (Fachprüfung 09.11.): RLVLAMal art. 25 al. 1: «ou lorsqu'il dépose sa demande à la suite
  // d'une information périodique au sens de l'article 10 de la loi, il peut être accordé
  // exceptionnellement un subside avec effet rétroactif, mais au plus tôt dès le début de la période
  // de subside en cours.»
  fristSatz: 'Eine feste Frist für den Antrag nennen die Unterlagen des OVAM nicht. Die Verbilligung beginnt aber erst einige Zeit nach dem Antrag und nicht rückwirkend auf den Jahresanfang. Rückwirkend gibt es sie nur ausnahmsweise, etwa wenn Sie belegen, dass Sie ohne eigenes Verschulden nicht früher einreichen konnten, oder wenn Sie den Antrag auf ein periodisches Informationsschreiben des Kantons hin stellen. Monate vor dem Antrag werden in der Regel nicht verbilligt.',
  stelle: 'Office vaudois de l’assurance-maladie (OVAM)',
  // [VD] §2: «l'Office vaudois de l'assurance-maladie (OVAM) vous adressera une décision par courrier
  // postal … celui-ci sera versé à votre assureur et vous payerez le solde restant de votre prime.»
  // Adresse [VD]: «Route des Plaines-du-Loup 1, 1014 Lausanne».
  stelleSatz: 'Das kantonale Amt für Krankenversicherung (OVAM) in Lausanne prüft den Antrag und schickt Ihnen den Entscheid per Post. Die Verbilligung geht direkt an Ihre Krankenkasse, den Rest der Prämie bezahlen Sie selbst.',
  amtsseite: 'Seite des Kantons Waadt zur Prämienverbilligung (französisch)',
  besonders: [
    // [N26]/[N27] Ziff. 1: «le subside peut être composé d'une partie appelée subside ordinaire et
    // d'une partie appelée subside spécifique … Si … le montant total des primes … dépasse encore
    // les 10 % du revenu déterminant unifié, un subside spécifique est octroyé».
    'Die Waadt kennt zwei Teile. Die ordentliche Verbilligung richtet sich nach dem massgebenden Einkommen. Eine zusätzliche, der «subside spécifique», kommt dazu, wenn die Prämien auch danach noch einen bestimmten Anteil des Einkommens übersteigen.',
    // [N26]/[N27] Ziff. 1: «① du revenu net, au sens de la décision de taxation (DT) définitive la
    // plus récente entrée en force …»; «③ … versements au titre de la prévoyance individuelle liée
    // (3e pilier A)»; «⑨ d'une majoration de 1/15 … de la fortune qui excède …».
    // Fachprüfung 09.11.: LVLAMal art. 12 al. 1: «Lorsque le calcul fondé sur la situation économique
    // réelle du requérant aboutit à un revenu déterminant qui diffère de 20% ou plus …, l'OVAM se fonde,
    // pour des motifs d'équité, sur le revenu déterminant fondé sur la situation économique réelle».
    // [VD] «En cas d'écart sensible entre votre situation actuelle et votre dernière décision de
    // taxation, tous les justificatifs des revenus et de la fortune actuels de tous les membres du ménage».
    'Massgebend ist die letzte rechtskräftige Steuerveranlagung. Dazu zählen unter anderem die Einzahlungen in die Säule 3a und ein Teil des Vermögens über einem Freibetrag. Weicht Ihre heutige Lage erheblich davon ab, rechnet das OVAM mit Ihren aktuellen Einkünften; legen Sie dem Antrag die Belege bei.',
    // Fachprüfung 09.11.: LVLAMal art. 12 al. 2: «Les apprentis et étudiants, dès le début de leur
    // 19ème année, lorsque leurs parents n'ont pas droit au subside, bénéficient par analogie de la même
    // procédure, qui prend en compte leur situation financière ainsi que celle de leurs parents».
    'Lernende und Studierende ab 18, deren Eltern keine Verbilligung erhalten, können selbst einen Antrag stellen; berücksichtigt wird auch die Lage der Eltern.',
    // [N27] S. 2: «au-delà d'une limite pour la fortune mobilière (notamment les comptes bancaires
    // ou postaux) le droit au subside est refusé»; Ziff. 4 «Condition économique modeste»: «le subside
    // est refusé à tous les membres du ménage». [N27] S. 1: «Plusieurs changements entrent en vigueur
    // au 1er janvier 2027»; RLVLAMal Modif. 13 du 07.10.2026. Künftiges Recht (Rechtsprüfung 09.11.).
    // Fachprüfung 09.11.: «ab dem kommenden Anspruchsjahr» wird mit dem Jahreswechsel falsch, darum
    // ohne Zeitangabe und mit Verweis auf die Notice.
    'Neu gilt eine Grenze für das bewegliche Vermögen, etwa für Bank- und Postkonten; ab welchem Anspruchsjahr und wie hoch, steht in der Notice des OVAM. Liegt es darüber, erhält niemand im Haushalt eine Verbilligung.',
    // [N26] und [N27] Ziff. 4 «Condition économique modeste»: «ne met pas toute sa capacité de gain à
    // contribution … ; a contracté des dettes ou cédé ses biens sans contrepartie ; renonce
    // volontairement à d'autres prestations sociales.»
    // Fachprüfung 09.11.: RLVLAMal art. 17 al. 1 lit. a: «par choix personnel : a. a contracté des
    // dettes en vue d'investissement, … ou s'est dessaisie de tout ou partie de ses biens sans
    // contrepartie équitable».
    'Verweigert werden kann die Verbilligung auch, wenn jemand aus eigenem Entschluss weniger arbeitet als möglich, Schulden für Investitionen aufnimmt oder Vermögen ohne angemessene Gegenleistung weggibt oder freiwillig auf andere Sozialleistungen verzichtet.',
    // [N26]/[N27] Ziff. 4 «Devoir d'information»: «Toute modification des revenus et fortune, de la
    // composition du ménage, ainsi que toute détention de biens mobiliers ou immobiliers … à
    // l'étranger doit être signalée sans retard … Le non-respect de cette obligation donnera lieu à
    // une demande de restitution des subsides indûment perçus».
    'Ändern sich Einkommen, Vermögen oder die Zusammensetzung des Haushalts, melden Sie das ohne Verzug der Agentur oder über das Online-Formular des OVAM. Das gilt auch für Vermögen im Ausland. Wer das unterlässt, muss die zu viel erhaltene Verbilligung zurückzahlen.',
    // [N26]/[N27] Ziff. 4 «Situation économique réelle»: «l'OVAM révisera le droit au subside pour
    // autant que la nouvelle situation financière s'écarte de 20 % ou plus en négatif ou en positif.»
    // Fachprüfung 09.11.: [VD] §3: «Si vos revenus ont baissé ou augmenté de 20% ou plus, vous devez
    // annoncer votre changement de situation»; RLVLAMal art. 25a al. 1: «Toute modification du droit au
    // subside entraînant une augmentation du montant de ce dernier prend effet le premier jour du mois
    // suivant celui où le requérant en a fait la demande».
    'Sinkt oder steigt Ihr Einkommen deutlich, melden Sie es. Erst dann berechnet das OVAM neu; mehr Verbilligung gibt es frühestens ab Ihrer Meldung. Ab welcher Änderung, steht in der Notice.',
    // [N26]/[N27] Ziff. 4 «Départ dans un autre canton»: «une nouvelle demande de subside doit être
    // déposée dans le canton de destination, car il n'existe pas de transfert du droit au subside».
    // Ergänzt (Fachprüfung 09.11.): RLVLAMal art. 26 al. 3: «L'assuré qui transfère son domicile dans un
    // autre canton, et qui répond aux conditions d'octroi …, conserve son droit au subside jusqu'à la fin
    // de l'année civile, à moins qu'il ne soit aussi bénéficiaire de prestations complémentaires … ou de
    // l'aide sociale dans son nouveau canton»; al. 2: «L'assuré quittant le canton … perd tout droit au
    // subside. L'alinéa 3 est réservé.»
    'Ziehen Sie in einen anderen Kanton, bleibt die Verbilligung in der Regel bis Ende Jahr; für das folgende Jahr stellen Sie dort einen neuen Antrag. Die Verbilligung wandert nicht von Kanton zu Kanton mit. Ziehen Sie ins Ausland, endet sie.',
    // Fachprüfung 09.11.: RLVLAMal art. 25 al. 4: «Le requérant en provenance d'un autre canton au cours
    // de l'année ne peut bénéficier d'un subside pour l'année considérée, à moins qu'il bénéficie de
    // prestations complémentaires à l'AVS/AI ou du revenu d'insertion.» Historie: «Modif. 13 du
    // 07.10.2026 … Modification Al. 1,4; entrée en vigueur au 01.01.2027» — neuer Wortlaut von al. 4
    // liegt nicht vor, darum Verweis ans OVAM.
    'Ziehen Sie im Lauf des Jahres aus einem anderen Kanton zu, bleibt für dieses Jahr der bisherige Kanton zuständig, ausser Sie beziehen Ergänzungsleistungen oder das Revenu d’insertion. Diese Regel wird geändert; fragen Sie beim OVAM nach, was für Sie gilt.',
  ],
  quellen: [
    { text: 'OVAM: Notice explicative zu den Subsides (PDF, französisch)', url: 'https://www.vd.ch/fileadmin/user_upload/themes/social/Prestations__assurance_et_soutien/Assurance_maladie/Subside/Notice_explicative_2027.pdf' },
    // Kein prüfbarer Link auf die Base législative vaudoise (gemessen 09.11.2026): die Seite
    // …/actes/consolide/832.01 antwortet auch für die erfundene Nummer 832.99 mit 200 (Web-App),
    // die API …/api/actes/CONSOLIDE?cote=… mit 500 für echt und erfunden. Darum wie bei ZH nur der Titel.
    { text: 'Loi d’application vaudoise de la loi fédérale sur l’assurance-maladie (LVLAMal, BLV 832.01)' },
    { text: 'Règlement concernant la LVLAMal (RLVLAMal, BLV 832.01.1)' },
    KVG65,
  ],
};
