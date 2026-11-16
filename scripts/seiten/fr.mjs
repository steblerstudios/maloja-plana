// ─── Französische Fassung der öffentlichen Erklärseiten ──────────────────────
//
// Übersetzung des deutschen Originals in `scripts/seiten-inhalt.mjs`.
// 🛑 NICHT von einem Menschen gegengelesen — `freigegeben: false` in
// `scripts/seiten-sprachen.mjs`. Solange das so steht: noindex, nicht in der
// Sitemap, nicht im hreflang-Ring.
//
// ─── TERMINOLOGIE ───────────────────────────────────────────────────────────
// Die Fachbegriffe sind NICHT neu übersetzt, sondern aus `src/i18n/fr.js`
// übernommen — dieselbe App, dieselben Wörter (Regel «spiegeln statt
// nachbauen»). Die wichtigsten:
//   Prämienverbilligung  → réduction individuelle des primes (RIP)
//   Sozialhilfe          → aide sociale
//   Ergänzungsleistungen → prestations complémentaires (PC)
//   SKOS                 → CSIAS
//   Veranlagung          → taxation      · Verfügung → décision
//   Steuerfuss           → coefficient d’impôt       · einfache Steuer → impôt simple
//   KVG → LAMal · DBG → LIFD
//
// 🛑 Struktur und Absatzzahl folgen dem Original eins zu eins. Wer hier einen
// Absatz ergänzt oder streicht, bricht `oeffentlicheSeiten.test.js` — der
// Wächter vergleicht die Form gegen Deutsch. Das ist Absicht: eine Sprache,
// die inhaltlich davonläuft, ist schlimmer als eine, die fehlt.
// ─────────────────────────────────────────────────────────────────────────────

export const SEITEN = [
  // ─── Pillar ───────────────────────────────────────────────────────────────
  {
    pfad: 'was-steht-mir-zu',
    titel: 'À quoi ai-je droit ? Vue d’ensemble pour la Suisse',
    beschreibung:
      'En Suisse, le soutien est réparti entre la Confédération, les cantons et les communes — beaucoup reste inutilisé faute d’être connu. Un aperçu, thème par thème.',
    brotkrume: 'À quoi ai-je droit ?',
    vorspann:
      'En Suisse, le soutien ne vient pas d’une seule caisse, mais de beaucoup de petites — réparties entre la Confédération, les cantons et les communes. Qui a droit à quoi dépend donc fortement du lieu de domicile. La raison la plus fréquente pour laquelle des prestations ne sont pas perçues n’est pas l’absence de droit. C’est de ne pas savoir qu’elles existent.',
    abschnitte: [
      {
        titel: 'Trois niveaux qui ne se concertent pas',
        absaetze: [
          'La <strong>Confédération</strong> ne fixe souvent que le cadre : elle prescrit qu’une prestation doit exister et en laisse largement l’aménagement aux cantons. C’est le cas par exemple de la réduction des primes.',
          'Les <strong>cantons</strong> remplissent ce cadre — avec leurs propres limites, leurs propres formulaires, leurs propres délais. Deux ménages aux chiffres identiques peuvent être traités différemment dans deux cantons. Ce n’est pas un défaut du système, c’est le système.',
          'Les <strong>communes</strong> exécutent dans plusieurs domaines ce que le canton décide — en matière d’aide sociale, elles sont souvent l’interlocuteur réel.',
          'Concrètement : il n’existe pas de réponse générale à « est-ce que j’y ai droit ? ». Il n’existe que la réponse pour votre lieu de domicile, votre situation et votre année.',
        ],
      },
      {
        titel: 'Les thèmes en détail',
        absaetze: [
          'Trois domaines concernent la plupart des gens, et pour les trois le coup d’œil vaut la peine même lorsqu’on pense ne pas être concerné :',
        ],
        verweise: ['praemienverbilligung', 'sozialhilfe', 'steuern'],
      },
      {
        titel: 'Pourquoi tant de choses restent en plan',
        absaetze: [
          'Un droit dont personne n’a connaissance n’est pas exercé. S’y ajoutent des obstacles qui n’ont rien à voir avec le droit lui-même : des formulaires dans une langue qu’il faut d’abord apprendre. Des délais qui ne figurent nulle part ensemble. La crainte de mal faire. Et l’idée répandue que le soutien est une affaire pour les autres.',
          'Rien de tout cela ne change quoi que ce soit au droit. Mais tout cela fait qu’on ne le fait pas valoir.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Comment savoir à quoi j’ai droit ?',
        antwort:
          'La voie la plus sûre passe par l’organe qui décide effectivement — donc par son propre canton, respectivement sa propre commune. Les calculateurs et aperçus comme ceux auxquels cette page renvoie donnent une première orientation sur l’opportunité d’une demande. Seule la décision de l’organe compétent fait foi.',
      },
      {
        frage: 'Pourquoi est-ce différent selon le canton ?',
        antwort:
          'Parce que, pour beaucoup de prestations, la Confédération ne fixe délibérément que le cadre et que les cantons le remplissent. Ils déterminent leurs propres limites de revenu, procédures et délais. Un déménagement au-delà de la frontière cantonale peut donc modifier le droit, même si rien d’autre n’a changé.',
      },
      {
        frage: 'Dois-je faire une demande partout moi-même ?',
        antwort:
          'Cela varie selon la prestation et le canton. Pour certaines prestations, les organes prennent contact d’office ; pour d’autres, rien ne se passe sans demande. En cas de doute : se renseigner ne coûte rien, et une demande qui n’est pas déposée n’est jamais accordée. Sans passeport suisse, une exception s’applique pour l’aide sociale : la percevoir peut avoir des conséquences sur l’autorisation de séjour ; faites-vous conseiller avant la demande (plus de détails sur la page Aide sociale).',
      },
      {
        frage: 'Combien coûte Maloja Plana ?',
        antwort:
          'Rien. Maloja Plana est gratuit et à code source ouvert. Il n’y a pas de compte, pas de publicité et pas de traçage ; toutes les données restent sur l’appareil.',
      },
    ],
    quellen: ['bwoKantone', 'bsvEL', 'ahvMerkblatt'],
  },

  // ─── Réduction des primes ─────────────────────────────────────────────────
  {
    pfad: 'praemienverbilligung',
    titel: 'Réduction des primes : qui y a droit',
    beschreibung:
      'La réduction individuelle des primes (RIP) est une contribution à la prime d’assurance-maladie. La Confédération fixe le cadre, les cantons décident — ce que cela signifie pour vous.',
    brotkrume: 'Réduction des primes',
    vorspann:
      'La réduction individuelle des primes — souvent abrégée RIP — est une contribution des pouvoirs publics à la prime d’assurance-maladie. Elle est prévue par la loi fédérale sur l’assurance-maladie (LAMal), mais la Confédération ne l’exécute pas : ce sont les cantons qui le font, chacun selon ses propres règles, dans le cadre du droit fédéral.',
    abschnitte: [
      {
        titel: 'Ce que prescrit la Confédération et ce que décide le canton',
        absaetze: [
          'La Confédération prescrit <em>qu’il doit y avoir</em> une réduction des primes, fixe pour cela des exigences minimales et participe à son financement. Dans le cadre de ces exigences, le canton décide qui la reçoit et pour quel montant.',
          'Trois exigences s’appliquent partout. Pour les revenus bas et moyens, les cantons réduisent les primes des enfants d’au moins 80 pour cent et celles des jeunes adultes en formation d’au moins 50 pour cent (art. 65, al. 1bis, LAMal). Chaque canton fixe la part maximale que la prime peut représenter dans le revenu disponible (art. 65, al. 1ter, LAMal). Et une fois le droit établi, le versement doit être organisé de manière à ce que vous n’ayez pas à avancer la prime (art. 65, al. 3, LAMal).',
          'Concrètement, ce qui diffère d’un canton à l’autre : les limites de revenu et de fortune, la manière même dont le revenu déterminant est calculé, le fait de devoir déposer une demande ou d’être contacté, et les délais.',
          'Est en revanche partout identique : <strong>où va l’argent</strong>. Le canton verse la contribution directement à la caisse-maladie, et non à la personne assurée. Cela figure dans la LAMal et ne relève pas de la marge de manœuvre cantonale.',
          'C’est pourquoi la phrase « chez nous, on y a droit à partir d’un revenu de X » mène rarement loin. Elle vaut au mieux pour un canton, et là encore pour une seule année.',
        ],
      },
      {
        titel: 'Quels chiffres comptent',
        absaetze: [
          'Les cantons se fondent en règle générale sur les données fiscales — et souvent non pas sur celles de l’année en cours, mais sur une taxation antérieure déjà entrée en force. Cela a une conséquence qui surprend : une personne qui gagne nettement moins cette année ne voit pas cette baisse prise en compte d’office dans de nombreux cantons — d’autres en tiennent compte seulement lors du décompte définitif ultérieur.',
          'La LAMal exige toutefois que, lors de l’examen des conditions d’octroi, les cantons prennent en considération les circonstances économiques et familiales les plus récentes, notamment à la demande de la personne assurée (art. 65, al. 3, LAMal). Votre canton règle les détails, par exemple les conditions, les justificatifs, les délais et la date d’effet. Un droit à la réduction n’en découle pas automatiquement. L’organe compétent vous renseigne — le plus souvent la caisse cantonale de compensation ou l’établissement cantonal d’assurances sociales, mais dans certains cantons l’administration fiscale ou la commune de domicile.',
        ],
      },
      {
        titel: 'L’erreur la plus fréquente',
        absaetze: [
          'Beaucoup partent du principe qu’avec un revenu d’activité lucrative on n’a en principe droit à rien. C’est inexact : la réduction des primes n’est pas une prestation réservée aux personnes sans emploi. Les familles avec enfants, les personnes en formation et les ménages à revenu moyen peuvent y avoir droit dans de nombreux cantons.',
          'La deuxième erreur fréquente est de croire qu’une demande refusée une fois vaut pour toujours. Elle vaut pour son année. Si le revenu, le ménage ou le canton de domicile changent, c’est une nouvelle question.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Ai-je droit à la réduction des primes ?',
        antwort:
          'Cela dépend du canton de domicile, du revenu et de la fortune déterminants et de la taille du ménage — les trois étant pondérés différemment selon le canton. Il n’existe pas de limite valable partout. Seul l’organe compétent décide de manière contraignante : le plus souvent la caisse cantonale de compensation ou l’établissement cantonal d’assurances sociales, dans certains cantons l’administration fiscale ou la commune de domicile. Une exception s’applique dans le domaine de l’asile : avec un permis N ou S, le droit est suspendu tant que l’aide sociale est perçue en tout ou en partie (art. 82a, al. 7, LAsi). Il en va de même avec un permis F, sauf si l’entrée remonte à plus de sept ans (art. 86, al. 2, LEI, art. 5b OA 2). Pour les réfugiés admis à titre provisoire, d’autres règles peuvent s’appliquer ; le service cantonal le clarifie.',
      },
      {
        frage: 'Dois-je déposer une demande ?',
        antwort:
          'Dans certains cantons, les ayants droit sont contactés d’office ; dans d’autres, il faut déposer soi-même la demande. Comme cela relève du droit cantonal et peut changer, il vaut la peine de se renseigner auprès de l’organe cantonal — même si l’on a déjà reçu quelque chose une année antérieure.',
      },
      {
        frage: 'Quel revenu est pris en compte ?',
        antwort:
          'En règle générale un revenu dérivé de la taxation fiscale, souvent d’une année antérieure, et souvent avec des ajouts et des déductions cantonaux. Le revenu brut du mois en cours n’est presque jamais le chiffre déterminant.',
      },
      {
        frage: 'Et si mon revenu a fortement baissé ?',
        antwort:
          'Alors il vaut particulièrement la peine de se renseigner. La LAMal exige que, lors de l’examen des conditions d’octroi, les cantons prennent en considération les circonstances économiques et familiales les plus récentes, notamment à la demande de la personne assurée (art. 65, al. 3, LAMal). Votre canton règle les détails, par exemple les conditions, les justificatifs, les délais et la date d’effet. Un droit à la réduction n’en découle pas automatiquement. Renseignez-vous auprès de l’organe compétent, même si la taxation déterminante indique encore un revenu plus élevé.',
      },
    ],
    quellen: ['priminfo', 'fedlexKvgArt65'],
  },

  // ─── Aide sociale ─────────────────────────────────────────────────────────
  {
    pfad: 'sozialhilfe',
    titel: 'L’aide sociale en Suisse — une orientation',
    beschreibung:
      'Qui décide de l’aide sociale, de quoi elle se compose et pourquoi les normes CSIAS ne sont pas automatiquement du droit. Un cadrage sans chiffres.',
    brotkrume: 'Aide sociale',
    vorspann:
      'L’aide sociale est le dernier échelon du filet social suisse — elle intervient là où tout le reste ne suffit pas ou ne suffit plus. La compétence n’appartient pas à la Confédération, mais aux cantons et, dans beaucoup d’entre eux, aux communes.',
    abschnitte: [
      {
        titel: 'Subsidiaire signifie : d’abord tout le reste',
        absaetze: [
          'L’aide sociale est <strong>subsidiaire</strong>. Avant qu’elle entre en ligne de compte, d’autres droits sont examinés : salaire, indemnités de chômage, rentes, prestations complémentaires, réduction des primes, contributions d’entretien, bourses d’études. La fortune propre est également prise en compte, les cantons connaissant une franchise dont le montant diffère.',
          'C’est la raison pour laquelle une demande commence souvent par beaucoup de questions portant sur de tout autres prestations. Il ne s’agit pas de méfiance, mais de l’ordre prévu par la loi.',
          'Sans passeport suisse, percevoir l’aide sociale peut avoir des conséquences sur le séjour. Avec une autorisation de séjour ou de courte durée (B, L), cela peut être un motif de révocation de l’autorisation ; avec une autorisation d’établissement (C), si l’aide est perçue durablement et dans une large mesure (art. 62, al. 1, let. e, et art. 63, al. 1, let. c, LEI). Avec un permis F, cela peut compliquer une future demande de regroupement familial ou d’autorisation de séjour (art. 85c, al. 1, let. c, et art. 84, al. 5, LEI). Pour les ressortissants des États de l’UE/AELE, d’autres règles s’appliquent en partie. Faites-vous conseiller au préalable par un service de conseil ou par le service social. Quel que soit votre statut de séjour, vous avez droit, en situation de détresse, au minimum vital (art. 12 Cst., plus bas).',
        ],
      },
      {
        titel: 'Les normes CSIAS sont des recommandations, pas une loi',
        absaetze: [
          'C’est le point le plus souvent négligé. Les normes de la Conférence suisse des institutions d’action sociale (CSIAS) sont des <strong>recommandations</strong>. Elles ne deviennent contraignantes que dans la mesure où un canton les reprend dans son propre droit — et les cantons le font dans une mesure variable.',
          'Concrètement : un calculateur CSIAS donne une bonne première orientation, mais il ne constitue pas une promesse. Ce qui vaut dans votre cas figure dans la loi cantonale sur l’aide sociale et dans la décision de l’organe compétent.',
        ],
      },
      {
        titel: 'De quoi se compose typiquement le soutien',
        absaetze: [
          'Dans la plupart des cantons, il s’agit de trois éléments : un <strong>forfait pour l’entretien</strong>, les <strong>frais de logement</strong> dans les limites usuelles du lieu, et les <strong>soins médicaux de base</strong>. S’y ajoutent le cas échéant des prestations circonstancielles.',
          'Nous ne mentionnons volontairement pas les montants ici : ils diffèrent selon le canton et la taille du ménage et sont adaptés régulièrement. Un chiffre sur une page comme celle-ci serait faux après peu de temps.',
        ],
      },
      {
        titel: 'Droit d’obtenir de l’aide dans des situations de détresse', // Randtitel BV Art. 12 (Fedlex, Fassung 3.3.2024); vorher absolut, vgl. BGE 130 I 71 E. 4.3 und 6
        absaetze: [
          'Indépendamment de tout ce qui précède, la <strong>Constitution fédérale, article 12</strong>, consacre le droit d’obtenir de l’aide dans des situations de détresse : quiconque est dans une situation de détresse et n’est pas en mesure de subvenir à son entretien a le droit d’être aidé et assisté et de recevoir les moyens indispensables pour mener une existence conforme à la dignité humaine.',
          'Ce droit appartient à toute personne en Suisse. Il n’est pas la même chose que l’aide sociale et couvre moins — mais il est la limite inférieure en deçà de laquelle on ne doit pas descendre.',
        ],
      },
    ],
    faq: [
      {
        frage: 'À combien d’aide sociale ai-je droit ?',
        antwort:
          'Cela se mesure au lieu de domicile, à la taille du ménage, au revenu, à la fortune et aux frais effectifs de logement et de santé — et cela relève du droit cantonal. Il n’existe pas de chiffre valable partout. Les calculateurs d’aide sociale donnent une orientation provisoire ; seule la décision de l’organe compétent fait foi.',
      },
      {
        frage: 'Les normes CSIAS sont-elles une loi ?',
        antwort:
          'Non. Ce sont des recommandations de la Conférence suisse des institutions d’action sociale. Elles ne sont contraignantes que dans la mesure où un canton les a reprises dans son propre droit. C’est pourquoi une même situation peut être appréciée différemment selon le canton.',
      },
      {
        frage: 'Dois-je d’abord épuiser ma fortune ?',
        antwort:
          'La fortune est prise en compte, mais pas entièrement : les cantons connaissent une franchise à laquelle il n’est pas touché. Son montant diffère selon le canton et le ménage. L’organe compétent effectue le calcul au cas par cas.',
      },
      {
        frage: 'Quelle est la différence avec les prestations complémentaires ?',
        antwort:
          'Les prestations complémentaires (PC) relèvent du premier pilier et entrent en règle générale en ligne de compte lorsqu’une prestation de l’AVS ou de l’AI ne couvre pas les besoins vitaux. Elles sont réglées par le droit fédéral et ne sont pas de l’aide sociale. Un droit aux PC prime l’aide sociale.',
      },
      {
        frage: 'L’aide sociale a-t-elle des conséquences sur mon autorisation de séjour ?',
        antwort:
          'Sans passeport suisse, cela peut être le cas. Avec un permis B ou L, la perception peut être un motif de révocation de l’autorisation, avec un permis C en cas de perception durable et dans une large mesure (art. 62, al. 1, let. e, et art. 63, al. 1, let. c, LEI). Avec un permis F, elle peut compliquer une future demande de regroupement familial ou d’autorisation de séjour (art. 85c, al. 1, let. c, et art. 84, al. 5, LEI). Avec un permis N ou S, et avec un permis F durant les sept premières années après l’entrée, la réduction des primes est en outre suspendue tant que l’aide sociale est perçue (art. 82a, al. 7, LAsi, art. 5b OA 2). Faites-vous conseiller au préalable par un service de conseil ou par le service social.',
      },
      {
        frage: 'Dois-je rembourser l’aide sociale ?',
        antwort:
          'C’est le canton qui règle si et quand — par exemple lorsqu’un héritage ou une fortune plus importante s’ajoute plus tard. En outre, les parents en ligne directe, par exemple les parents, les enfants, les grands-parents et les petits-enfants, peuvent être tenus de fournir une aide s’ils vivent dans l’aisance (art. 328, al. 1, CC). Ce qui s’applique dans votre cas, le service compétent vous le dira.',
      },
    ],
    quellen: ['skosRechner', 'bsvEL', 'bwoKantone'],
  },

  // ─── Impôts ───────────────────────────────────────────────────────────────
  {
    pfad: 'steuern',
    titel: 'Les impôts en Suisse : Confédération, canton, commune',
    beschreibung:
      'Pourquoi un même salaire est imposé très différemment selon le lieu de domicile — les trois niveaux, le coefficient d’impôt et ce que cela signifie en pratique.',
    brotkrume: 'Impôts',
    vorspann:
      'Qui paie l’impôt sur le revenu en Suisse le paie en règle générale à trois endroits à la fois : à la Confédération, au canton et à la commune. Seul le premier est identique partout. Les deux autres sont la raison pour laquelle un même salaire conduit, à deux lieux de domicile, à des bordereaux d’impôt sensiblement différents.',
    abschnitte: [
      {
        titel: 'L’impôt fédéral direct est partout le même',
        absaetze: [
          'L’impôt fédéral direct se fonde sur la loi fédérale sur l’impôt fédéral direct (LIFD) et connaît le même barème pour toute la Suisse. Il distingue selon l’état civil et le ménage, mais pas selon le lieu de domicile.',
          'Il est néanmoins perçu par le canton — la déclaration d’impôt est la même.',
          'Il en va autrement de l’<strong>impôt à la source</strong> : si vous travaillez en Suisse sans autorisation d’établissement, par exemple avec un permis B, l’employeur déduit l’impôt directement du salaire (art. 83 LIFD). Si le salaire brut est inférieur à une limite légale, il n’y a en règle générale pas de déclaration d’impôt. D’autres déductions, par exemple pour le pilier 3a, ne sont alors possibles que par une taxation ordinaire ultérieure ; elle doit être demandée jusqu’au 31 mars de l’année suivante, en cas de départ jusqu’au départ (art. 89a, al. 3, LIFD). Au-delà, la taxation ordinaire a lieu d’office (art. 89 LIFD, art. 9 OIS).',
        ],
      },
      {
        titel: 'Canton et commune : barème multiplié par le coefficient',
        absaetze: [
          'Aux niveaux cantonal et communal, deux grandeurs se combinent. Le <strong>barème</strong> détermine l’impôt qu’un revenu imposable donné déclenche — cela donne ce qu’on appelle l’impôt simple. Le <strong>coefficient d’impôt</strong> est un facteur appliqué à celui-ci, généralement exprimé en pourcentage, que le canton et la commune fixent chacun pour soi et peuvent adapter chaque année.',
          'Selon le canton et la confession, la facture comporte encore d’autres postes, par exemple l’impôt ecclésiastique ou un impôt personnel. Ils sont le plus souvent modestes, mais ils expliquent pourquoi le total ne correspond pas exactement à ce qu’un simple calculateur de revenu indique.',
          'Deux communes d’un même canton ont donc le même barème, mais chacune son propre coefficient — qui peut différer. Deux cantons ont les deux différents. C’est là le véritable levier derrière les comparaisons intercantonales connues. Dans certains cantons s’ajoutent des particularités, par exemple des communes sans impôt communal propre.',
        ],
      },
      {
        titel: 'Ce qui est déduit du revenu',
        absaetze: [
          'Ce n’est pas le salaire qui est imposé, mais le <strong>revenu imposable</strong> — donc ce qui reste après les déductions admises. En font partie, selon la situation, les frais professionnels, les cotisations au pilier 3a, les frais de maladie au-delà d’un seuil, les déductions pour enfants et pour leur garde, et d’autres encore.',
          'Quelles déductions sont admises et dans quelle mesure, cela diffère entre la Confédération et le canton, et entre les cantons. C’est souvent là que de l’argent se perd — non pas par de fausses indications, mais par des déductions que personne n’a inscrites.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Pourquoi est-ce que je paie autrement que quelqu’un du canton voisin ?',
        antwort:
          'Parce que le canton fixe le barème et que le canton et la commune décident chacun de leur propre coefficient d’impôt. Seul l’impôt fédéral direct est identique partout. Un même salaire peut ainsi conduire à des bordereaux d’impôt nettement différents selon le lieu de domicile.',
      },
      {
        frage: 'Qu’est-ce que le coefficient d’impôt ?',
        antwort:
          'Un facteur appliqué à l’impôt simple, généralement exprimé en pourcentage, que le canton et la commune décident chacun pour soi. Le barème dit quel est le montant de l’impôt simple ; le coefficient dit avec quel facteur il est perçu. Les deux ensemble donnent l’impôt cantonal et communal.',
      },
      {
        frage: 'Quelles déductions puis-je faire ?',
        antwort:
          'Cela dépend de la situation et du canton — fréquents sont les frais professionnels, les cotisations au pilier 3a, les frais de maladie et d’accident au-delà d’un seuil ainsi que les déductions pour enfants et pour leur garde. Les montants et les conditions diffèrent entre la Confédération et le canton ; seules les instructions de son propre canton font foi.',
      },
      {
        frage: 'Où obtenir un calcul qui fait foi ?',
        antwort:
          'Seule la taxation de l’administration fiscale cantonale fait foi en fin de compte. Pour un calcul prévisionnel fiable, l’Administration fédérale des contributions met à disposition un calculateur qui tient compte de la Confédération, du canton et de la commune.',
      },
    ],
    quellen: ['estvRechner'],
  },

  // ─── Prestations complémentaires (14.11.2026) ─────────────────────────────
  // Termes repris de src/i18n/fr.js et du mémento 5.01 en français : PC, organe PC,
  // dépenses reconnues, revenus déterminants, frais de maladie et d’invalidité.
  // LPC = ELG · OPC = ELV · LEI = AIG.
  {
    pfad: 'ergaenzungsleistungen',
    titel: 'Les prestations complémentaires à l’AVS et à l’AI',
    beschreibung:
      'Quand les prestations complémentaires (PC) entrent en ligne de compte, comment elles sont calculées et pourquoi elles ne sont pas de l’aide sociale. Un cadrage sans chiffres.',
    brotkrume: 'Prestations complémentaires',
    vorspann:
      'Les prestations complémentaires, ou PC, interviennent là où une rente de l’AVS ou de l’AI et les autres revenus ne suffisent pas à couvrir le minimum vital. Elles sont réglées dans la loi fédérale sur les prestations complémentaires (LPC) et constituent un droit légal, pas une faveur. Elles sont versées par les cantons.',
    abschnitte: [
      {
        titel: 'Sans prestation de l’AVS ou de l’AI, pas de PC',
        absaetze: [
          'Les PC supposent une prestation de l’AVS ou de l’AI : une rente de vieillesse ou de survivant de l’AVS, y compris une rente anticipée, une rente de l’AI, une allocation pour impotent de l’AI ou des indemnités journalières de l’AI versées sans interruption depuis au moins six mois. S’y ajoutent le domicile et la résidence habituelle en Suisse (art. 4 LPC).',
          'Pour les étrangères et les étrangers s’applique en outre une durée minimale de séjour : en règle générale dix ans sans interruption en Suisse, cinq ans pour les réfugiés et les apatrides (art. 5 LPC). Elle ne s’applique pas aux ressortissants d’un État de l’UE ou de l’AELE.',
          'Qui n’a pas de rente uniquement parce que les années de cotisation sont insuffisantes peut, à certaines conditions, tout de même toucher des PC (art. 4 LPC). Qui se trouve dans le besoin sans aucune prestation de l’AVS ou de l’AI s’adresse à l’aide sociale de sa commune de domicile.',
        ],
      },
      {
        titel: 'L’écart entre dépenses et revenus',
        absaetze: [
          'La PC annuelle correspond à la part des <strong>dépenses reconnues</strong> qui excède les <strong>revenus déterminants</strong> (art. 9 LPC). Les dépenses comprennent par exemple un montant pour les besoins vitaux, le loyer jusqu’à un plafond et un montant pour la prime d’assurance-maladie (art. 10 LPC). Les revenus comprennent les rentes, une partie du revenu de l’activité lucrative et une partie de la fortune (art. 11 LPC).',
          'N’a droit aux PC que la personne dont la fortune est inférieure à un seuil légal ; un logement habité par son propriétaire n’est pas pris en compte pour ce seuil (art. 9a LPC). La fortune à laquelle une personne a renoncé sans contrepartie, par exemple par une donation, est prise en compte (art. 11a LPC).',
          'La Confédération fixe les montants pour les besoins vitaux, et les plafonds de loyer échelonnés selon trois régions (art. 10 LPC). Nous ne les citons volontairement pas ici : ils sont adaptés régulièrement, et un chiffre sur une page comme celle-ci serait bientôt faux. Pour les personnes vivant en home, le calcul suit ses propres règles ; les cantons peuvent limiter les frais de home reconnus.',
        ],
      },
      {
        titel: 'Les frais de maladie et d’invalidité s’y ajoutent',
        absaetze: [
          'En plus de la PC annuelle, le canton rembourse les frais de maladie et d’invalidité dûment établis, par exemple pour le dentiste, l’aide, les soins et l’assistance à domicile, le transport vers le lieu de traitement, les moyens auxiliaires ainsi que la franchise et la quote-part de l’assurance-maladie (art. 14 LPC). Le canton détermine quels frais exactement et jusqu’à quel montant.',
          'Même qui ne touche pas de PC annuelle parce que ses revenus sont un peu trop élevés peut obtenir le remboursement de tels frais, dans la mesure où ils dépassent l’excédent de revenus.',
          'Conservez factures et justificatifs : seul ce qui est établi est remboursé, et seulement si vous le faites valoir dans un délai légal après la facturation (art. 15 LPC).',
        ],
      },
      {
        titel: 'S’annoncer : auprès du canton de domicile, et tôt',
        absaetze: [
          'Le canton de votre domicile est compétent. Il désigne l’organe qui reçoit la demande ; c’est le plus souvent la caisse cantonale de compensation ou l’office des assurances sociales, souvent par l’intermédiaire de l’agence AVS de la commune de domicile (art. 21 LPC).',
          'Le droit naît en règle générale le mois au cours duquel la demande est déposée (art. 12 LPC). Il ne peut commencer plus tôt que dans certains cas, par exemple si la demande est déposée dans les six mois suivant une décision de rente ou une entrée en home ou à l’hôpital (art. 12, al. 2, LPC, art. 22 OPC). Qui attend peut donc perdre des mois.',
          'Si vous ne savez pas si une demande en vaut la peine, renseignez-vous auprès de l’organe PC. Il examine le droit et motive sa décision par écrit.',
        ],
      },
      {
        titel: 'Les PC ne sont pas de l’aide sociale',
        absaetze: [
          'Les PC sont souvent confondues avec l’aide sociale. Elles sont autre chose : un droit fondé sur le droit fédéral, calculé selon des règles valables dans toute la Suisse. Un droit aux PC prime l’aide sociale.',
          'De votre vivant, vous ne devez pas rembourser des PC perçues légalement. Après le décès, elles sont remboursées sur la succession, mais seulement sur la part qui dépasse une franchise légale ; pour les couples mariés, seulement sur la succession de la personne décédée en second (art. 16a LPC).',
          'Sans passeport suisse et sans nationalité d’un État de l’UE ou de l’AELE, le regroupement familial n’est en règle générale pas autorisé si vous percevez des PC annuelles ou si vous en percevriez en raison du regroupement (art. 43, al. 1, let. e, et art. 44, al. 1, let. e, LEI). Faites-vous conseiller au préalable dans ce cas.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Ai-je droit aux prestations complémentaires ?',
        antwort:
          'Cela dépend de si vous touchez une prestation de l’AVS ou de l’AI, de votre lieu de domicile, de vos revenus, de vos dépenses et de votre fortune. Il n’existe pas de limite valable pour tous, car le loyer, la prime et le ménage comptent aussi. Le calculateur PC de l’AVS/AI donne une première orientation ; seule la décision de l’organe PC de votre canton fait foi.',
      },
      {
        frage: 'Y a-t-il des PC avant l’âge de la retraite ?',
        antwort:
          'Oui. Qui touche une rente de l’AI, une rente de veuve, de veuf ou d’orphelin peut aussi obtenir des PC avant l’âge de la retraite. Qui anticipe sa rente AVS remplit également la condition d’une rente (art. 4 LPC) ; la rente réduite compte alors comme revenu (art. 11 LPC). Qui arrive en fin de droit dans l’assurance-chômage à partir de soixante ans peut, selon les cas, toucher des prestations transitoires ; elles aussi se demandent auprès de l’organe PC.',
      },
      {
        frage: 'Ma maison ou mon appartement compte-t-il ?',
        antwort:
          'Pour le seuil de fortune, un logement habité par son propriétaire n’est pas pris en compte (art. 9a LPC). Dans le calcul lui-même, sa valeur est prise en compte, mais avec une franchise (art. 11 LPC). Ce que cela donne dans votre cas, l’organe PC le calcule.',
      },
      {
        frage: 'Qu’en est-il si je dois entrer en home ?',
        antwort:
          'La PC est alors calculée selon ses propres règles : au lieu des besoins vitaux et du loyer, on compte la taxe journalière du home, que le canton peut plafonner, et un montant pour les dépenses personnelles fixé par le canton (art. 10, al. 2, LPC). Annoncez-vous dans les six mois suivant l’entrée ; le droit peut alors naître dès le mois de l’entrée, si les autres conditions sont remplies (art. 12, al. 2, LPC).',
      },
      {
        frage: 'Dois-je annoncer les changements ?',
        antwort:
          'Oui. Toute modification de la situation personnelle et toute modification importante de la situation économique doit être annoncée sans délai à l’organe PC, par exemple un déménagement, un nouveau loyer, un héritage ou une entrée en home (art. 24 OPC). Les prestations perçues indûment doivent être restituées.',
      },
      {
        frage: 'Que m’apporte encore une PC ?',
        antwort:
          'Les bénéficiaires de PC annuelles à l’AVS ou à l’AI sont exonérés de la redevance de radio-télévision ; l’exonération se demande auprès de l’organe de perception avec l’attestation de l’organe PC. Le montant pour la prime d’assurance-maladie qui entre dans le calcul est versé directement à la caisse-maladie. En cas de doute, renseignez-vous auprès de l’organe PC.',
      },
    ],
    quellen: ['ahvMerkblattEL', 'bsvEL'],
  },

  // ─── Chômage (16.11.2026) ─────────────────────────────────────────────────
  // LACI = AVIG · OACI = AVIV · LPtra = ÜLG · LAA = UVG · LAVS = AHVG · LSE = AVG ·
  // LPP = BVG · LIFD = DBG · ORP = RAV · indemnité journalière = Taggeld.
  {
    pfad: 'arbeitslosigkeit',
    titel: 'Au chômage : ce que verse l’assurance-chômage',
    beschreibung:
      'Qui a droit à l’indemnité de chômage, pourquoi l’inscription à l’ORP compte dès le début et ce qui vient après la fin de droit. Un cadrage sans chiffres.',
    brotkrume: 'Chômage',
    vorspann:
      'L’assurance-chômage (AC) est obligatoire pour les salariés : qui travaille paie des cotisations sur son salaire, et qui perd son emploi reçoit, à certaines conditions, une indemnité journalière qui remplace une partie du salaire. Elle est réglée dans la loi sur l’assurance-chômage (LACI) et s’applique de la même manière dans toute la Suisse. Les cantons gèrent les offices régionaux de placement (ORP).',
    abschnitte: [
      {
        titel: 'Qui a droit aux indemnités',
        absaetze: [
          'A droit à l’indemnité de chômage, entre autres, la personne qui est sans emploi ou partiellement sans emploi, subit une perte de travail à prendre en considération, est domiciliée en Suisse, n’a pas encore atteint l’âge de référence et ne touche pas de rente de vieillesse de l’AVS, remplit les conditions relatives à la période de cotisation ou en est libérée, est apte au placement et satisfait aux exigences du contrôle (art. 8 LACI). Qui anticipe sa rente AVS perd donc le droit.',
          'Période de cotisation signifie : durant une période déterminée avant le chômage, vous avez travaillé assez longtemps comme salariée ou salarié et payé des cotisations (art. 13 LACI). Qui n’était pas salarié durant cette période pour cause de formation, de maladie, d’accident ou de maternité, ou qui doit chercher un emploi après une séparation, un divorce ou le décès de son conjoint, y compris en partenariat enregistré, peut être libéré des conditions relatives à la période de cotisation (art. 14 LACI).',
          'Les indépendants ne sont pas assurés contre le chômage pour leur activité indépendante ; l’activité indépendante ne compte pas comme période de cotisation. Sans passeport suisse, l’aptitude au placement suppose que vous soyez autorisé à travailler en Suisse (art. 15 LACI). Faites-vous conseiller pour les questions d’autorisation.',
        ],
      },
      {
        titel: 'S’inscrire à l’ORP, et tôt',
        absaetze: [
          'L’indemnité est versée au plus tôt dès le jour de l’inscription, pas rétroactivement. Inscrivez-vous donc au plus tard le premier jour pour lequel vous demandez l’indemnité auprès de l’office régional de placement (ORP) compétent, en ligne sur arbeit.swiss ou en personne (art. 10 et 17 LACI).',
          'Pendant le délai de congé déjà, vous devez chercher un nouvel emploi et consigner vos recherches. Si elles manquent ou sont insuffisantes, il y a des jours de suspension, c’est-à-dire des jours sans indemnité (art. 17 et 30 LACI).',
          'Après l’inscription, l’indemnité ne commence en règle générale qu’après quelques jours d’attente ; leur nombre dépend du revenu antérieur et des obligations d’entretien envers des enfants. Pour les personnes libérées des conditions relatives à la période de cotisation, un délai d’attente spécial peut s’appliquer (art. 18 LACI).',
        ],
      },
      {
        titel: 'L’indemnité remplace une partie du salaire',
        absaetze: [
          'L’indemnité se calcule sur le <strong>gain assuré</strong>, c’est-à-dire le salaire antérieur jusqu’à un plafond légal (art. 23 LACI). Une partie en est versée ; elle est plus élevée si vous avez une obligation d’entretien envers des enfants, aviez un salaire bas ou touchez une rente de l’AI à partir d’un certain taux d’invalidité (art. 22 LACI).',
          'Le nombre maximal d’indemnités dépend de la période de cotisation et de l’âge ; elles sont versées dans un délai-cadre (art. 9 et 27 LACI). Nous ne citons volontairement ni les taux ni les nombres maximaux. Votre caisse de chômage les calcule de manière contraignante.',
          'Comme sur le salaire, des cotisations sont prélevées sur l’indemnité, par exemple pour l’AVS (art. 22a LACI). Elle constitue un revenu de remplacement et est imposée comme le salaire (art. 23, let. a, LIFD).',
        ],
      },
      {
        titel: 'Gain intermédiaire et travail convenable',
        absaetze: [
          'Si vous gagnez quelque chose pendant le chômage, cela constitue un gain intermédiaire. S’il est inférieur à votre gain assuré, la caisse de chômage compense une partie de la différence ; vous recevez ainsi généralement davantage que l’indemnité seule. Est pris en compte au moins le salaire usuel du lieu pour ce travail (art. 24 LACI).',
          'En principe, vous devez accepter tout travail convenable. Un emploi n’est pas convenable notamment s’il ne respecte pas les conditions usuelles du lieu et de la profession, ne tient pas compte de votre âge, de votre situation personnelle ou de votre état de santé, ou impose un trajet très long (art. 16 LACI).',
          'Qui refuse un emploi convenable ou résilie lui-même son emploi sans raison impérieuse est suspendu : selon la faute, il n’y a pas d’indemnité pendant un certain temps (art. 30 LACI). Faites-vous conseiller avant de résilier vous-même.',
        ],
      },
      {
        titel: 'Quand les indemnités sont épuisées',
        absaetze: [
          'Arrive en fin de droit qui a touché toutes les indemnités ou dont le délai-cadre a expiré sans qu’un nouveau puisse être ouvert. Le service public de l’emploi reste ouvert et gratuit (art. 26 et 27 LSE). Qui accumule à nouveau une période de cotisation suffisante peut acquérir un nouveau droit (art. 9 et 13 LACI).',
          'L’aide sociale et la réduction des primes peuvent ensuite entrer en ligne de compte. Qui arrive en fin de droit à partir de soixante ans peut, à d’autres conditions, toucher des prestations transitoires ; elles se demandent auprès de l’organe PC du canton de domicile (art. 3, 5 et 19 LPtra).',
          'Avec la dernière indemnité prend fin aussi, après une brève prolongation, l’assurance-accidents par l’assurance-chômage. Annoncez à temps à votre caisse-maladie qu’elle doit à nouveau couvrir les accidents ; elle paie alors comme en cas de maladie, avec franchise et quote-part (art. 3, al. 2, LAA, art. 8 et 10 LAMal). Clarifiez auprès de la caisse de compensation AVS si vous devez cotiser en tant que personne sans activité lucrative, afin d’éviter une lacune de cotisations (art. 10 LAVS).',
        ],
      },
    ],
    faq: [
      {
        frage: 'Ai-je droit aux indemnités si j’ai démissionné ?',
        antwort:
          'Oui, mais le plus souvent après une suspension : qui démissionne sans avoir l’assurance d’un nouvel emploi ne reçoit en règle générale pas d’indemnité pendant un certain temps, souvent pour la durée la plus longue prévue par la loi. Sauf si l’on ne pouvait pas exiger de lui qu’il reste à son poste (art. 30 LACI, art. 44 et 45 OACI). Faites-vous conseiller au préalable.',
      },
      {
        frage: 'Puis-je m’inscrire avant la fin de mon emploi ?',
        antwort:
          'Oui, et c’est judicieux. Vous devez vous inscrire au plus tard le premier jour pour lequel vous demandez l’indemnité (art. 17 LACI). Des recherches d’emploi sont déjà exigées pour la durée du délai de congé.',
      },
      {
        frage: 'Suis-je assuré contre les accidents pendant le chômage ?',
        antwort:
          'Oui, tant que vous touchez l’indemnité, vous êtes assuré contre les accidents par l’assurance-chômage (art. 1a LAA). Cette couverture prend fin ensuite après une brève prolongation. Annoncez à la caisse-maladie qu’elle doit à nouveau couvrir les accidents ; elle paie alors comme en cas de maladie, avec franchise et quote-part.',
      },
      {
        frage: 'Qu’advient-il de ma caisse de pension ?',
        antwort:
          'À la sortie, vous devez indiquer à la caisse de pension sur quel compte de libre passage l’avoir doit être versé jusqu’à ce que vous ayez un nouvel emploi (art. 4 LFLP). Tant que vous touchez l’indemnité, vous restez en règle générale assuré dans la prévoyance professionnelle pour les risques de décès et d’invalidité (art. 2, al. 3, LPP) ; en règle générale, vous n’épargnez pas pour la vieillesse pendant cette période. Qui perd son emploi après son cinquante-huitième anniversaire peut, selon les cas, rester dans sa caisse de pension (art. 47a LPP).',
      },
      {
        frage: 'Puis-je partir en vacances pendant le chômage ?',
        antwort:
          'Oui, dans une mesure limitée : vous avez droit à des jours sans contrôle, que vous devez annoncer à l’avance à l’ORP (art. 27 OACI). Votre ORP vous dit combien vous en avez.',
      },
    ],
    quellen: ['arbeitSwiss'],
  },

  // ─── AVS et retraite (16.11.2026) ─────────────────────────────────────────
  // LAVS = AHVG · RAVS = AHVV · Cst. = BV · LPP = BVG · OPP 3 = BVV 3 · LACI = AVIG ·
  // LPtra = ÜLG · âge de référence = Referenzalter · compte individuel (CI) = IK.
  {
    pfad: 'ahv-pensionierung',
    titel: 'AVS et retraite — une orientation',
    beschreibung:
      'Comment les trois piliers s’articulent, ce qui détermine la rente AVS, pourquoi il faut la demander et ce que signifient anticipation et ajournement. Sans chiffres.',
    brotkrume: 'AVS et retraite',
    vorspann:
      'L’assurance-vieillesse et survivants (AVS) est le premier pilier de la prévoyance vieillesse suisse et obligatoire pour toutes les personnes qui vivent ou travaillent ici. Le montant de la rente se décide sur de nombreuses années : selon les années de cotisation, les revenus et les bonifications pour enfants et pour tâches d’assistance. Et elle ne vient pas d’elle-même : il faut la demander.',
    abschnitte: [
      {
        titel: 'Trois piliers aux tâches différentes',
        absaetze: [
          'La prévoyance vieillesse repose sur trois piliers (art. 111 Cst.). L’<strong>AVS</strong> est le premier : ses rentes doivent couvrir les besoins vitaux de manière appropriée (art. 112 Cst.). Si elles n’y suffisent pas, des prestations complémentaires s’y ajoutent (art. 112a Cst.).',
          'La <strong>caisse de pension</strong>, la prévoyance professionnelle, est obligatoire pour les salariés à partir d’un salaire minimal. Avec l’AVS, elle doit permettre de maintenir de manière appropriée le niveau de vie antérieur (art. 113 Cst.).',
          'Le <strong>troisième pilier</strong> est facultatif. Les versements au pilier 3a peuvent être déduits du revenu imposable ; mais seule une personne ayant un revenu d’activité lucrative peut y verser (art. 7 OPP 3).',
        ],
      },
      {
        titel: 'Ce qui détermine la rente, et pourquoi les lacunes comptent',
        absaetze: [
          'Le montant de la rente AVS dépend des <strong>années de cotisation</strong> prises en compte, des <strong>revenus d’activité lucrative</strong> et des <strong>bonifications pour tâches éducatives et d’assistance</strong> (art. 29bis LAVS). Reçoit une rente complète la personne qui a cotisé sans lacune de l’année suivant son vingtième anniversaire jusqu’à l’année précédant l’âge de référence. S’il manque une année de cotisation, la rente est en règle générale réduite, et ce à vie (art. 29ter LAVS).',
          'Les personnes sans activité lucrative cotisent aussi, par exemple pendant les études, après une fin de droit au chômage ou en cas de retraite anticipée (art. 10 LAVS). Pour les personnes mariées sans revenu d’activité, les cotisations sont réputées payées si l’épouse ou l’époux verse au moins le double de la cotisation minimale (art. 3, al. 3, LAVS). Les cotisations manquantes ne peuvent être rattrapées que pour une période limitée dans le passé (art. 16 LAVS).',
          'Un extrait de votre compte individuel (CI), que vous pouvez demander à votre caisse de compensation, montre si vous avez des lacunes (art. 141 RAVS). Plus tôt vous connaissez une lacune, plus il est probable qu’elle puisse encore être comblée.',
        ],
      },
      {
        titel: 'La rente ne vient pas d’elle-même',
        absaetze: [
          'Vous devez demander vous-même la rente AVS, de préférence quelques mois avant l’âge de référence. La caisse de compensation compétente est celle qui a perçu vos dernières cotisations ; si vous n’avez pas cotisé, la caisse cantonale de compensation de votre canton de domicile (mémento 3.01).',
          'Le droit naît le premier jour du mois qui suit l’âge de référence et s’éteint à la fin du mois du décès (art. 21 LAVS). L’âge de référence est le même pour les femmes et les hommes ; des règles transitoires s’appliquent aux femmes de la génération transitoire.',
          'Qui touche une rente de vieillesse en décembre reçoit en plus une treizième rente de vieillesse égale à un douzième de la rente de vieillesse annuelle. Les rentes de survivants, d’invalidité et pour enfant continuent d’être versées douze fois seulement (mémento 3.01).',
        ],
      },
      {
        titel: 'Percevoir plus tôt ou plus tard',
        absaetze: [
          'La rente peut être <strong>anticipée</strong> en tout ou en partie, au plus tôt dès le soixante-troisième anniversaire, plus tôt pour les femmes de la génération transitoire. La part anticipée est réduite à vie, y compris au-delà de l’âge de référence (art. 40 et 40a LAVS). Pendant l’anticipation, il n’y a pas de rentes pour enfant. Vous devez demander l’anticipation au plus tard le mois précédant le début souhaité ; elle n’est pas possible rétroactivement (mémento 3.04).',
          'Vous pouvez aussi <strong>ajourner</strong> la rente en tout ou en partie, d’un an au moins et de cinq ans au plus ; elle est alors augmentée à vie (art. 39 LAVS). Vous déclarez l’ajournement au plus tard un an après avoir atteint l’âge de référence, sinon la rente est versée sans augmentation (art. 55quater RAVS).',
          'Une anticipation peut avoir des conséquences qu’on ne voit pas tout de suite : qui est au chômage perd avec l’anticipation le droit aux indemnités, et qui touche des prestations transitoires également (art. 8 LACI, art. 5, al. 3, LPtra). Faites-vous conseiller au préalable par votre caisse de compensation.',
        ],
      },
      {
        titel: 'Ce à quoi l’on a encore droit à l’âge de la retraite',
        absaetze: [
          'Si les rentes et la fortune ne suffisent pas pour le minimum vital, des <strong>prestations complémentaires</strong> entrent en ligne de compte. Elles sont un droit légal et non de l’aide sociale.',
          'Qui dépend en permanence de l’aide d’autrui au quotidien, par exemple pour s’habiller, pour l’hygiène corporelle ou pour manger, peut recevoir une <strong>allocation pour impotent</strong> de l’AVS si l’impotence dure sans interruption depuis au moins six mois. Elle ne dépend ni du revenu ni de la fortune (art. 43bis LAVS, mémento 3.01).',
          'Pour la <strong>caisse de pension</strong>, vous choisissez entre rente et capital. Vous pouvez légalement exiger un quart sous forme de capital, davantage seulement si le règlement le prévoit ; pour les personnes mariées, le consentement écrit est nécessaire (art. 37 et 37a LPP). La décision est définitive. Faites-vous conseiller tôt.',
        ],
      },
    ],
    faq: [
      {
        frage: 'À combien s’élèvera ma rente AVS ?',
        antwort:
          'Cela dépend de vos années de cotisation, de vos revenus et de vos bonifications. La rente ne peut en règle générale être calculée de manière contraignante qu’à l’âge de référence. Vous pouvez demander un calcul anticipé à votre caisse de compensation (mémento 3.01).',
      },
      {
        frage: 'Qu’en est-il pour les couples mariés ?',
        antwort:
          'Les revenus des années de mariage sont partagés et attribués pour moitié à chacun, dès que les deux ont droit à une rente, ainsi qu’en cas de divorce. Les deux rentes d’un couple marié sont ensemble plafonnées ; ce plafonnement tombe si la vie commune a été suspendue par un tribunal (mémento 3.01).',
      },
      {
        frage: 'J’ai aussi travaillé à l’étranger. Et maintenant ?',
        antwort:
          'Les périodes à l’étranger manquent en règle générale dans l’AVS suisse, mais elles peuvent donner droit à une rente dans l’autre État. Avec des périodes d’assurance dans un État de l’UE ou de l’AELE, une seule demande dans le pays de domicile déclenche la procédure dans tous les États concernés (mémento 3.01).',
      },
      {
        frage: 'Ai-je droit à une rente de survivant en tant que partenaire non marié ?',
        antwort:
          'Une rente de veuve ou de veuf de l’AVS n’existe qu’après un mariage ou un partenariat enregistré et seulement à d’autres conditions. Sans mariage, il n’y en a pas. Les enfants communs reçoivent toutefois une rente d’orphelin. Pour la caisse de pension, le règlement peut prévoir une prestation en faveur des partenaires.',
      },
      {
        frage: 'Dois-je encore payer des cotisations AVS après la retraite ?',
        antwort:
          'Qui continue de travailler après l’âge de référence continue de cotiser. À certaines conditions, la rente peut alors être recalculée. Qui anticipe sa rente et ne travaille plus reste tenu de cotiser jusqu’à l’âge de référence en tant que personne sans activité lucrative (art. 10 LAVS).',
      },
    ],
    quellen: ['ahvMerkblatt', 'ahvMerkblattFlex'],
  },
];

export const SONDERSEITEN = [
  {
    pfad: 'rechtliches',
    titel: 'Mentions légales, protection des données et clause de non-responsabilité',
    beschreibung:
      'Qui se trouve derrière Maloja Plana, quelles données sont collectées lors de la consultation de ces pages et ce que les calculateurs ne garantissent expressément pas.',
    brotkrume: 'Mentions légales',
    vorspann:
      'Cette page vaut pour malojaplana.ch et les pages d’explication publiques. Pour l’application elle-même s’applique en outre la déclaration de protection des données détaillée, qui figure dans l’application sous « Confidentialité & Mentions légales » — elle aussi sans code d’accès. Font foi les versions publiées : cette page pour malojaplana.ch et les pages d’explication, le texte dans l’application pour l’application. Les versions de travail dans le code source public (docs/legal) sont des brouillons et une trace d’origine, non la version qui fait foi. En cas de divergence entre les versions linguistiques, seule la version allemande fait foi.',
    abschnitte: [
      {
        titel: 'Éditrice',
        absaetze: [
          'Sophie Stebler / Stebler Studios<br>Bâle, Suisse<br>Courriel : <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>',
          'Maloja Plana — classeur de vie suisse. Un projet open source sous AGPL-3.0. L’utilisation de l’application est gratuite ; pour le white-label et tout autre usage commercial, une licence séparée est disponible sur demande.',
          'Concernant l’adresse de contact : l’<a href="https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/fr#art_3" rel="noopener">art. 3 al. 1 let. s ch. 1 LCD</a> exige des indications sur l’identité et sur l’adresse de contact « y compris pour le courrier électronique ». Le nom, le lieu et le courriel sont indiqués ; la question de savoir si une adresse postale est en outre due est en cours d’examen. Le courriel permet de nous joindre pour toute question, y compris juridique.',
        ],
      },
      {
        titel: 'Clause de non-responsabilité',
        absaetze: [
          'Maloja Plana est un <strong>outil d’orientation</strong>. Les calculateurs et les aperçus se fondent sur des bases légales accessibles au public et servent exclusivement à l’information personnelle.',
          '<strong>Maloja Plana ne remplace pas un conseil juridique, fiscal, financier ou en assurances.</strong>',
          'L’éditrice n’assume aucune garantie quant à l’exactitude, à l’exhaustivité ou à l’actualité des calculs, quant à l’adéquation des résultats à des décisions individuelles, ni pour les dommages résultant de leur utilisation. La responsabilité pour les dommages causés intentionnellement ou par négligence grave demeure réservée. Seuls les lois en vigueur et les autorités compétentes font foi.',
        ],
      },
      {
        titel: 'Protection des données sur ces pages',
        absaetze: [
          'Les pages d’explication sont du HTML statique. Elles ne chargent <strong>aucun cookie et aucune ressource de tiers</strong> ; les polices de caractères se trouvent sur le même serveur. La page d’accueil charge en plus de petits scripts propres, depuis le même serveur : l’un redirige les anciennes adresses de l’application vers /app/, l’autre anime les images du parcours. Les personnes qui utilisaient auparavant l’application à l’adresse principale en reçoivent une fois un troisième lors de leur prochaine visite de l’une de ces pages : il vide l’ancienne mémoire cache de l’application dans le navigateur, se désinscrit, puis recharge la page une fois ; il ne touche pas aux données sur votre appareil. Les pages animées sur l’assurance-maladie (sous /krankenkasse/bewegt/) chargent elles aussi des scripts depuis le même serveur ; ils dessinent les figures animées. Ces scripts ne déposent aucun cookie et n’envoient aucune donnée. Il n’y a ni traçage, ni analyse, ni publicité.',
          'Lors de la consultation, des données techniques sont néanmoins collectées chez l’hébergeur — <strong>Infomaniak Network SA</strong>, Rue Eugène-Marziano 25, 1227 Les Acacias / Genève, avec des centres de calcul en Suisse : adresse IP dans les journaux du serveur, type de navigateur, système d’exploitation et moment de l’accès. Cela est techniquement nécessaire à la livraison et à la sécurité de l’exploitation. Infomaniak agit à ce titre en qualité de sous-traitante (art. 9 nLPD). Selon les indications du prestataire, les journaux d’accès et d’erreur sont conservés au moins 7 jours (FAQ de support Infomaniak 1926, consultée le 23 septembre 2026).',
          'Il n’y a pas d’autres destinataires : aucun service d’analyse, aucune intégration de réseaux sociaux, aucune transmission et aucune vente de données.',
        ],
      },
      {
        titel: 'Contact par courriel',
        absaetze: [
          'Si vous écrivez à <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>, nous traitons votre adresse, le contenu du message et les éventuelles pièces jointes afin d’y répondre. La boîte aux lettres est hébergée par Infomaniak en Suisse. La correspondance est conservée aussi longtemps que la demande et les questions de suivi habituelles l’exigent, puis elle est supprimée. Elle n’est pas transmise à des tiers, sauf obligation légale.',
          '<strong>Liste d’attente :</strong> Si vous nous écrivez pour figurer sur la liste d’attente, nous conservons votre message et votre adresse e-mail uniquement à cette fin. Nous vous écrivons au plus deux fois : à la fin de la bêta et, le cas échéant, lorsque Maloja Plana paraîtra dans l’App Store. Ensuite, nous supprimons le message et l’adresse, au plus tard le 31 décembre 2027, même s’il n’existe pas encore de version pour l’App Store. Sur demande, nous les supprimons sans délai ; une réponse « désinscrire » (ou « abmelden ») suffit. Nous n’utilisons l’adresse à aucune autre fin, pas non plus pour une newsletter.',
        ],
      },
      {
        titel: 'Données dans l’application',
        absaetze: [
          'Ce que vous saisissez dans Maloja Plana reste <strong>sur votre appareil</strong> (localStorage, IndexedDB et, pour les fichiers partagés, le cache du navigateur). Il n’y a pas de compte, pas de connexion et aucune transmission à l’éditrice ou à des tiers. Qui veut effacer les données les efface sur l’appareil — il n’existe pas de seconde copie ailleurs.',
          'Les données sensibles (santé, aide sociale, convictions) sont elles aussi enregistrées uniquement en local par l’application. Les copies de sauvegarde automatiques dans le navigateur ne sont pas chiffrées.',
          'Comme rien n’est transmis, l’éditrice ne peut pas non plus renseigner sur vos saisies : elle ne les a jamais vues. La version détaillée avec tous les droits selon la LPD figure dans l’application sous « Confidentialité & Mentions légales ».',
        ],
      },
      {
        titel: 'Propriété intellectuelle',
        absaetze: [
          'Le code est sous <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">AGPL-3.0</a>, consultable sur <a href="https://github.com/steblerstudios/maloja-plana" rel="noopener">GitHub</a>. « Maloja Plana » est une désignation de projet de Sophie Stebler. Pour un usage commercial, une double licence est proposée — demandes à l’adresse mentionnée ci-dessus.',
        ],
      },
      {
        titel: 'Droit applicable',
        absaetze: [
          'Le droit suisse est applicable. Le for est à Bâle-Ville, Suisse.',
        ],
      },
    ],
    faq: [],
    quellen: [],
  },
];
