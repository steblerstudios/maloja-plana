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
          'La <strong>Confédération</strong> ne fixe souvent que le cadre : elle prescrit qu’une prestation doit exister et en laisse l’aménagement aux cantons. C’est le cas par exemple de la réduction des primes.',
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
          'Rien de tout cela ne change quoi que ce soit au droit. Mais tout cela fait qu’il n’est pas invoqué.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Comment savoir à quoi j’ai droit ?',
        antwort:
          'La voie la plus sûre passe par l’organe qui décide effectivement — donc par son propre canton, respectivement sa propre commune. Les calculateurs et aperçus comme ceux qui sont liés ici donnent une première orientation sur l’opportunité d’une demande. Seule la décision de l’organe compétent fait foi.',
      },
      {
        frage: 'Pourquoi est-ce différent selon le canton ?',
        antwort:
          'Parce que, pour beaucoup de prestations, la Confédération ne fixe délibérément que le cadre et que les cantons le remplissent. Ils déterminent leurs propres limites de revenu, procédures et délais. Un déménagement au-delà de la frontière cantonale peut donc modifier le droit, même si rien d’autre n’a changé.',
      },
      {
        frage: 'Dois-je faire une demande partout moi-même ?',
        antwort:
          'Cela varie selon la prestation et le canton. Pour certaines prestations, les organes s’annoncent d’eux-mêmes ; pour d’autres, rien ne se passe sans demande. En cas de doute : se renseigner ne coûte rien, et une demande qui n’est pas déposée n’est jamais accordée.',
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
      'La réduction individuelle des primes — souvent abrégée RIP — est une contribution des pouvoirs publics à la prime d’assurance-maladie. Elle est prévue par la loi sur l’assurance-maladie (LAMal), mais la Confédération ne l’exécute pas : ce sont les cantons qui le font, chacun selon ses propres règles.',
    abschnitte: [
      {
        titel: 'Ce que prescrit la Confédération et ce que décide le canton',
        absaetze: [
          'La Confédération prescrit <em>qu’il doit y avoir</em> une réduction des primes et participe à son financement. Qui la reçoit et à quelle hauteur, c’est le canton qui en décide.',
          'Concrètement, ce qui diffère d’un canton à l’autre : les limites de revenu et de fortune, la manière même dont le revenu déterminant est calculé, le fait de devoir déposer une demande ou d’être contacté, et les délais.',
          'En revanche, une chose est partout identique : <strong>où va l’argent</strong>. Le canton verse la contribution directement à la caisse-maladie, et non à la personne assurée. Cela figure dans la LAMal et ne relève pas de la marge de manœuvre cantonale.',
          'C’est pourquoi la phrase « chez nous, on y a droit à partir d’un revenu de X » mène rarement loin. Elle vaut au mieux pour un canton, et là encore pour une seule année.',
        ],
      },
      {
        titel: 'Quels chiffres comptent',
        absaetze: [
          'Les cantons se fondent en règle générale sur les données fiscales — et souvent non pas sur celles de l’année en cours, mais sur une taxation antérieure déjà entrée en force. Cela a une conséquence qui surprend : une personne qui gagne nettement moins cette année ne le voit pas apparaître d’elle-même dans de nombreux cantons — d’autres en tiennent compte seulement lors du décompte définitif ultérieur.',
          'Plusieurs cantons connaissent pour de tels cas une procédure propre, dans laquelle un changement essentiel de situation est pris en compte après coup. Si et comment, cela se trouve auprès de l’organe compétent — le plus souvent la caisse cantonale de compensation ou l’établissement cantonal d’assurances sociales, mais dans certains cantons l’administration fiscale ou la commune de domicile.',
        ],
      },
      {
        titel: 'L’erreur la plus fréquente',
        absaetze: [
          'Beaucoup partent du principe qu’avec un revenu d’activité lucrative on n’a en principe droit à rien. C’est inexact : la réduction des primes n’est pas une prestation réservée aux personnes sans emploi. Les familles avec enfants, les personnes en formation et les ménages à revenu moyen y entrent dans de nombreux cantons.',
          'La deuxième erreur fréquente est de croire qu’une demande refusée une fois vaut pour toujours. Elle vaut pour son année. Si le revenu, le ménage ou le canton de domicile changent, c’est une nouvelle question.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Ai-je droit à la réduction des primes ?',
        antwort:
          'Cela dépend du canton de domicile, du revenu et de la fortune déterminants et de la taille du ménage — les trois étant pondérés différemment selon le canton. Il n’existe pas de limite valable partout. Seul l’organe compétent décide de manière contraignante : le plus souvent la caisse cantonale de compensation ou l’établissement cantonal d’assurances sociales, dans certains cantons l’administration fiscale ou la commune de domicile.',
      },
      {
        frage: 'Dois-je déposer une demande ?',
        antwort:
          'Dans certains cantons, les ayants droit sont contactés d’office ; dans d’autres, la demande doit être déposée soi-même. Comme cela relève du droit cantonal et peut changer, il vaut la peine de se renseigner auprès de l’organe cantonal — même si l’on a déjà reçu quelque chose une année antérieure.',
      },
      {
        frage: 'Quel revenu est pris en compte ?',
        antwort:
          'En règle générale un revenu dérivé de la taxation fiscale, souvent d’une année antérieure, et souvent avec des ajouts et des déductions cantonaux. Le revenu brut du mois en cours n’est presque jamais le chiffre déterminant.',
      },
      {
        frage: 'Et si mon revenu a fortement baissé ?',
        antwort:
          'Alors il vaut particulièrement la peine de se renseigner. Plusieurs cantons tiennent compte, sur demande, d’un changement essentiel de la situation économique, même si la taxation sous-jacente indique encore un revenu plus élevé.',
      },
    ],
    quellen: ['priminfo'],
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
        titel: 'Le droit que personne ne peut perdre',
        absaetze: [
          'Indépendamment de tout ce qui précède, la <strong>Constitution fédérale, article 12</strong>, consacre le droit d’obtenir de l’aide dans des situations de détresse : quiconque est dans une situation de détresse et n’est pas en mesure de subvenir à son entretien a le droit d’être aidé et assisté et de recevoir les moyens indispensables pour mener une existence conforme à la dignité humaine.',
          'Ce droit appartient à toute personne en Suisse. Il n’est pas la même chose que l’aide sociale et couvre moins — mais il est la limite inférieure en deçà de laquelle on ne peut pas descendre.',
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
      'Qui paie l’impôt sur le revenu en Suisse le paie en règle générale à trois endroits à la fois : à la Confédération, au canton et à la commune. Seul le premier est identique partout. Les deux autres sont la raison pour laquelle un même salaire conduit, à deux lieux de domicile, à des factures sensiblement différentes.',
    abschnitte: [
      {
        titel: 'L’impôt fédéral direct est partout le même',
        absaetze: [
          'L’impôt fédéral direct se fonde sur la loi fédérale sur l’impôt fédéral direct (LIFD) et connaît le même barème pour toute la Suisse. Il distingue selon l’état civil et le ménage, mais pas selon le lieu de domicile.',
          'Il est néanmoins perçu par le canton — la déclaration d’impôt est la même.',
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
          'Quelles déductions sont admises et à quelle hauteur diffère entre la Confédération et le canton, et entre les cantons. C’est précisément là que le plus se perd — non pas par de fausses indications, mais par des déductions que personne n’a inscrites.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Pourquoi est-ce que je paie autrement que quelqu’un du canton voisin ?',
        antwort:
          'Parce que le canton fixe le barème et que le canton et la commune décident chacun de leur propre coefficient d’impôt. Seul l’impôt fédéral direct est identique partout. Un même salaire peut ainsi conduire à des factures nettement différentes selon le lieu de domicile.',
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
        frage: 'Où puis-je calculer de manière contraignante ?',
        antwort:
          'Seule la taxation de l’administration fiscale cantonale fait foi en fin de compte. Pour un calcul prévisionnel fiable, l’Administration fédérale des contributions met à disposition un calculateur qui tient compte de la Confédération, du canton et de la commune.',
      },
    ],
    quellen: ['estvRechner'],
  },
];

export const SONDERSEITEN = [
  {
    pfad: 'rechtliches',
    titel: 'Mentions légales, protection des données et clause de non-responsabilité',
    beschreibung:
      'Qui se trouve derrière Maloja Plana, quelles données sont collectées lors de la consultation de ces pages et ce dont les calculateurs ne répondent expressément pas.',
    brotkrume: 'Mentions légales',
    vorspann:
      'Cette page vaut pour malojaplana.ch et les pages d’explication publiques. Pour l’application elle-même s’applique en outre la déclaration de protection des données détaillée, qui figure dans l’application sous « Protection des données et mentions légales » — elle aussi sans code d’accès.',
    abschnitte: [
      {
        titel: 'Fournisseuse',
        absaetze: [
          'Sophie Stebler / Stebler Studios<br>Bâle, Suisse<br>Courriel : <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>',
          'Maloja Plana — classeur de vie suisse. Un projet open source sous AGPL-3.0. L’utilisation de l’application est gratuite ; pour le white-label et tout autre usage commercial, une licence séparée est disponible sur demande.',
          'Concernant l’adresse de contact : l’<a href="https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/fr#art_3" rel="noopener">art. 3 al. 1 let. s ch. 1 LCD</a> exige des indications sur l’identité et sur l’adresse de contact « y compris celle du courrier électronique ». La disposition n’impose pas dans tous les cas une adresse postale. Le nom, le lieu et le courriel sont indiqués ; une adresse postale constitue une décision ouverte, qui sera tranchée en même temps que la question de l’inscription au registre du commerce. Le courriel permet de nous joindre pour toute question, y compris juridique.',
        ],
      },
      {
        titel: 'Clause de non-responsabilité',
        absaetze: [
          'Maloja Plana est un <strong>outil d’orientation</strong>. Les calculateurs et les aperçus se fondent sur des bases légales accessibles au public et servent exclusivement à l’information personnelle.',
          '<strong>Maloja Plana ne remplace ni un conseil juridique, ni fiscal, ni en assurances, ni financier.</strong>',
          'La fournisseuse n’assume aucune garantie quant à l’exactitude, à l’exhaustivité ou à l’actualité des calculs, quant à l’adéquation des résultats à des décisions individuelles, ni pour les dommages résultant de leur utilisation. Seuls les lois en vigueur et les autorités compétentes font foi.',
        ],
      },
      {
        titel: 'Protection des données sur ces pages',
        absaetze: [
          'Les pages d’explication sont du HTML statique. Elles ne chargent <strong>aucun script, aucun cookie et aucune ressource de tiers</strong> ; les polices de caractères se trouvent sur le même serveur. Il n’y a ni traçage, ni analyse, ni publicité.',
          'Lors de la consultation, des données techniques sont néanmoins collectées chez l’hébergeur — <strong>Infomaniak Network SA</strong>, Rue Eugène-Marziano 25, 1227 Les Acacias / Genève, avec des centres de calcul en Suisse : adresse IP dans les journaux du serveur, type de navigateur, système d’exploitation et moment de l’accès. Cela est techniquement nécessaire à la livraison et à la sécurité de l’exploitation. Infomaniak agit à ce titre en qualité de sous-traitante (art. 9 nLPD). Selon les indications du prestataire, les journaux d’accès et d’erreur sont conservés au moins 7 jours (FAQ de support Infomaniak 1926, consultée le 23 septembre 2026).',
          'Il n’y a pas d’autres destinataires : aucun service d’analyse, aucune intégration de réseaux sociaux, aucune transmission et aucune vente de données.',
        ],
      },
      {
        titel: 'Contact par courriel',
        absaetze: [
          'Si vous écrivez à <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>, nous traitons votre adresse, le contenu du message et les éventuelles pièces jointes afin d’y répondre. La boîte aux lettres est hébergée par Infomaniak en Suisse. La correspondance est conservée aussi longtemps que la demande et les questions de suivi habituelles l’exigent, puis elle est supprimée. Elle n’est pas transmise à des tiers, sauf obligation légale.',
        ],
      },
      {
        titel: 'Données dans l’application',
        absaetze: [
          'Ce que vous saisissez dans Maloja Plana reste <strong>sur votre appareil</strong> (localStorage et IndexedDB dans le navigateur). Il n’y a pas de compte, pas de connexion et aucune transmission à la fournisseuse ou à des tiers. Qui veut effacer les données les efface sur l’appareil — il n’existe pas de seconde copie ailleurs.',
          'Les données sensibles (santé, aide sociale, convictions) sont elles aussi enregistrées uniquement en local par l’application. Les copies de sauvegarde automatiques dans le navigateur ne sont pas chiffrées.',
          'Comme rien n’est transmis, la fournisseuse ne peut pas non plus renseigner sur vos saisies : elle ne les a jamais vues. La version détaillée avec tous les droits selon la LPD figure dans l’application sous « Protection des données et mentions légales ».',
        ],
      },
      {
        titel: 'Propriété intellectuelle',
        absaetze: [
          'Le code est sous <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">AGPL-3.0</a>, consultable sur <a href="https://github.com/steblerstudios/maloja-plana" rel="noopener">GitHub</a>. « Maloja Plana » est une désignation de projet de Sophie Stebler. Pour un usage commercial, un double licenciement est possible — demandes à l’adresse mentionnée ci-dessus.',
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
