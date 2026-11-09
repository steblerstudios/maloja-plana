// Prämienverbilligung · Kanton NE. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Abgerufen 09.11.2026:
//   [NE]  ne.ch, «Subsides assurance-maladie (LAMal)» mit FAQ (= Amtslink der App)
//   [ANO] Arrêté RSN 821.102 (normes de classification … pour l'année 2026), État au 1er janvier 2026
//   [LILAMal]   RSN 821.10, État au 1er janvier 2026
//   [RALILAMal] RSN 821.101, État au 1er janvier 2026
//   Gegenprobe rsn.ne.ch/…/pdf/821999.pdf → 404; ne.ch/…/subsides-erfunden-xyz → 404.
// Sprache der Quellen: Französisch; die Zitate stehen im Original.
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Neuenburg',
  slug: 'neuenburg',
  weg: 'automatisch',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // [NE]: «Dès le 1er janvier de l'année de vos 26 ans, votre droit à un subside est calculé
    // automatiquement sur la base de votre dernière taxation fiscale.» LILAMal art. 16 al. 1
    // («Les assurés sont classifiés d'office»), art. 17 al. 1.
    'Im Kanton Neuenburg wird der Anspruch in der Regel von Amtes wegen geprüft, Sie müssen also zuerst nichts beantragen. Grundlage ist Ihre letzte Steuerveranlagung. So läuft es ab dem Jahr, in dem Sie 26 werden.',
    // RALILAMal art. 31 al. 1bis: «Les assurés qui sont déjà bénéficiaires d'un subside au moment de
    // leur taxation ordinaire sont classifiés d'office.» [NE]: «Le nouveau montant de votre subside
    // est recalculé automatiquement.»
    'Haben Sie schon eine Verbilligung, wird sie nach jeder neuen Veranlagung ohne Ihr Zutun neu berechnet.',
    // RALILAMal art. 31 al. 2–3: «Celui-ci doit être confirmé par les assurés dans un délai de 30
    // jours … par le biais du renvoi d'un questionnaire. A défaut de renvoi … n'ont pas droit au
    // subside identifié. L'office les informe alors qu'ils peuvent déposer une nouvelle demande au GSR».
    // [NE]: «un courrier accompagné d'un coupon-réponse … doit impérativement être renvoyé dans un
    // délai de 30 jours. Au-delà de ce délai, vous perdez votre droit à un subside».
    // Rechtsprüfung 09.11.: ohne Tageszahl («innert kurzer Frist»), wie fristSatz.
    // Letzter Satz (Fachprüfung 09.11.): RALILAMal art. 31 al. 4: «Si les réponses données dans le
    // questionnaire nécessitent un examen détaillé de la situation des assurés, leur droit au subside
    // est suspendu et ils doivent déposer une nouvelle demande au GSR dans les 30 jours dès la
    // notification de la décision de suspension.»
    'Haben Sie neu Anspruch, kommt nach der Veranlagung ein Brief mit einem Antwortschein, dem «coupon-réponse». Diesen Schein schicken Sie innert kurzer Frist zurück. Sonst verfällt der Anspruch, und es bleibt nur ein neues Gesuch beim regionalen Sozialschalter. Braucht Ihre Antwort eine genauere Prüfung, wird der Anspruch ausgesetzt; dann stellen Sie innert kurzer Frist ein neues Gesuch beim GSR.',
    // [NE]: «Automaticité mixte».
    'Der Kanton nennt das «automaticité mixte»: Die Berechnung läuft von selbst, neu Berechtigte bestätigen sie einmal.',
  ],
  // [NE], FAQ «Vous n'avez pas reçu de courrier ?»: «vous êtes nouvellement arrivé-e dans le canton ·
  // vous avez moins de 26 ans · vous êtes taxé-e d'office · vous êtes imposé-e à la source · vous avez
  // un changement de situation financière ou familiale … déposez une demande auprès de votre guichet
  // social régional (GSR)». ANO art. 16 al. 1–2 (revenu effectif sous une limite ⇒ «non
  // bénéficiaires», révision sur demande). RALILAMal art. 30 al. 2–3 (indépendants: «L'office informe
  // …», «demande formelle auprès du GSR … dans un délai de 12 mois»). [NE]: «Ils interviennent gratuitement.»
  selbst: {
    einleitung: 'Keinen Brief bekommen Sie in diesen Fällen. Dann stellen Sie selbst ein Gesuch beim Guichet social régional (GSR), dem regionalen Sozialschalter:',
    punkte: [
      // [NE] FAQ: «Vous êtes célibataire et avez entre 19 et 25 ans ? Il n'y a pas d'automatisme.»
      // Fachprüfung 09.11.: [NE] «Vous n'avez pas reçu de courrier ? … vous avez moins de 26 ans»;
      // «Dès le 1er janvier de l'année de vos 26 ans, votre droit à un subside est calculé
      // automatiquement». RALILAMal art. 36 al. 1 («assurés célibataires âgés de moins de 25 ans …
      // classifiés d'office dans la catégorie des personnes "non bénéficiaires"»).
      'Sie sind jünger als 26 (ab dem Jahr, in dem Sie 26 werden, läuft es automatisch).',
      'Sie sind neu in den Kanton Neuenburg gezogen.',
      'Sie werden an der Quelle besteuert oder wurden nach Ermessen veranlagt (taxation d’office).',
      'Ihre finanzielle oder familiäre Lage hat sich verändert.',
      'Ihr Einkommen liegt unter einer festen Untergrenze. Dann gelten Sie zunächst als nicht berechtigt und können eine Überprüfung verlangen.',
      // Fachprüfung 09.11.: RALILAMal art. 33 al. 2: «Lorsque la taxation fiscale ordinaire n'est pas
      // établie durant l'année courante, une nouvelle classification ne peut prendre effet, au plus tôt,
      // qu'au 1er janvier de l'année de notification de la taxation.» Al. 4: «les assurés doivent déposer
      // une demande formelle auprès de l'office, dans un délai de trois mois à compter de la notification
      // de la taxation fiscale. La date de réception de la demande est déterminante.»
      'Ihre Veranlagung kam erst nach Ende des Jahres. Dann stellen Sie innert weniger Monate nach Erhalt der Veranlagung ein Gesuch beim OCAB.',
    ],
    schluss: 'Wer selbständig erwerbend ist, erhält einen Brief mit der Bitte, sich beim GSR zu melden, und stellt das Gesuch dort innert einer Frist. Auch ohne Brief können Sie ein Gesuch stellen, wenn Sie Anspruch vermuten. Die Beratung beim GSR ist kostenlos.',
  },
  // RALILAMal art. 31 al. 2 (30 Tage für den Antwortschein). ANO art. 17 al. 3–4 und RALILAMal
  // art. 32 al. 3–4: «Lorsque la personne assurée bénéficiaire n'a pas déposé sa déclaration fiscale …
  // dans le délai …, elle est classifiée d'office dans la catégorie des personnes non bénéficiaires …
  // La personne assurée peut demander à bénéficier d'une classification intermédiaire».
  fristSatz: 'Für den Antwortschein gilt eine kurze Frist. Wichtig ist auch die Steuererklärung: Wer schon eine Verbilligung hat und die Erklärung nicht fristgerecht einreicht, verliert die Verbilligung im Lauf des Jahres und muss die neue Einstufung beim GSR verlangen.',
  stelle: 'Office cantonal de l’assurance-maladie et des bourses d’études (OCAB)',
  // [NE]: «Vos seuls interlocuteurs sont le guichet social régional ainsi que l'office cantonal de
  // l'assurance-maladie et des bourses d'études.» «Contactez votre GSR … en cas de changement de
  // situation». RALILAMal art. 29 al. 1–2 (PC: «classifiées d'office»; «La Caisse cantonale
  // neuchâteloise de compensation communique à l'office …»), art. 28 al. 1 (aide sociale: «Sur
  // demande des autorités cantonales et communales compétentes …»).
  stelleSatz: 'Das kantonale Amt für Krankenversicherung und Stipendien (OCAB) stuft ein und entscheidet. Gesuche und Änderungen gehen an den GSR. Wer Ergänzungsleistungen zur AHV oder IV bezieht, wird von Amtes wegen eingestuft, die kantonale Ausgleichskasse meldet das dem OCAB. Bei Sozialhilfe stellt die Sozialbehörde das Gesuch.',
  amtsseite: 'Seite des Kantons Neuenburg zur Prämienverbilligung (französisch)',
  besonders: [
    // [NE]: «Le revenu déterminant n'est pas équivalent au revenu imposable, il intègre … Votre revenu
    // effectif (déclaration fiscale, chiffre 5.5) … Des déductions (AVS-AI, pensions alimentaires,
    // frais professionnels) · 30 % de votre fortune après déduction d'une franchise». ANO art. 2
    // («répartis … dans l'une des classifications»).
    'Neuenburg teilt die Berechtigten in Stufen ein. Massgebend ist nicht das steuerbare Einkommen, sondern ein eigenes massgebendes Einkommen aus der Steuererklärung. Dazu zählt ein Teil des Vermögens über einem Freibetrag.',
    // ANO art. 11 al. 2: «Les montants … sont diminués dans la même mesure que les réductions
    // accordées par les assureurs en cas de formes particulières d'assurances au sens de l'article
    // 62, alinéa 2, lettre a LAMal» (= Wahlfranchise).
    'Haben Sie eine höhere Franchise gewählt, wird die Verbilligung im selben Mass gekürzt wie der Rabatt Ihrer Krankenkasse.',
    // [NE]: «Une hausse ou une baisse sensible de revenus, une naissance, un mariage, un divorce ou un
    // décès peuvent modifier votre droit. N'attendez pas la prochaine taxation : signalez-le sans
    // délai à votre Guichet Social Régional». RALILAMal art. 47 (obligation d'informer), art. 42
    // al. 1 lit. c–d («durablement»), al. 2: «Une période de chômage partiel ne donne pas droit à une
    // classification intermédiaire.»
    'Eine Geburt, Heirat, Scheidung, ein Todesfall oder eine deutliche Änderung des Einkommens können den Anspruch ändern. Warten Sie nicht auf die nächste Veranlagung, sondern melden Sie es ohne Verzug dem GSR. Neu eingestuft wird bei einer dauerhaften und erheblichen Änderung, Kurzarbeit allein reicht nicht.',
    // LILAMal art. 29 al. 1: «Les subsides indûment perçus doivent être restitués à l'Etat.»
    // ANO art. 21 al. 2: «Lorsque la différence de revenu déterminant résultant de la comparaison
    // dépasse 20%, l'office peut exiger la restitution du subside indu.»
    // Erster Satz (Fachprüfung 09.11.): LILAMal art. 29 al. 1 (wie oben); RALILAMal art. 47 al. 4:
    // «L'inobservation de l'obligation de renseigner peut entraîner la modification ou la suppression du
    // subside. L'office en fixe, le cas échéant, l'effet rétroactif.» Art. 48 al. 1: «L'office exige de
    // l'assuré la restitution des subsides indûment perçus.»
    'Zu Unrecht bezogene Verbilligung muss zurückgezahlt werden, zum Beispiel wenn Sie eine Änderung nicht gemeldet haben. Das OCAB vergleicht die Einstufung zudem später mit der nächsten Veranlagung. Weicht das Einkommen stark ab, kann es zu viel bezahlte Verbilligung zurückverlangen.',
    // [NE] «Arrivée ou départ du canton»: «Votre canton de domicile au 1er janvier reste compétent
    // jusqu'au 31 décembre …», «Le subside restera valable jusqu'au 31 décembre de l'année en cours.»
    // LILAMal art. 19 al. 1.
    // Fachprüfung 09.11.: Regel «canton de domicile au 1er janvier» betrifft nur den Zuzug aus einem
    // anderen Kanton. LILAMal art. 16 al. 2: «L'assuré qui prend ou reprend domicile dans le canton est
    // classifié dans le groupe des assurés non bénéficiaires.» RALILAMal art. 42 al. 1: «La
    // classification … peut être révisée au cours de l'année, sur demande ou d'office, lorsque: a)
    // l'assuré prend ou reprend domicile dans le canton».
    'Ziehen Sie im Lauf des Jahres aus einem anderen Kanton zu, bleibt für dieses Jahr der bisherige Kanton zuständig. Ziehen Sie aus dem Ausland zu, stellen Sie das Gesuch beim GSR. Ziehen Sie weg, behalten Sie die Neuenburger Verbilligung bis Ende Jahr.',
    // RALILAMal art. 38 al. 2–3: «L'assuré majeur en formation initiale est classifié personnellement,
    // sur sa demande écrite auprès du GSR … Le droit au subside est établi en fonction du revenu
    // déterminant de l'UER dont fait partie la personne en formation.»
    'Junge Erwachsene in der ersten Ausbildung werden auf schriftliches Gesuch beim GSR persönlich eingestuft. Gerechnet wird aber mit dem Einkommen des Haushalts, zu dem sie gehören, meist dem der Eltern.',
    // [NE]: «Certaines entreprises vous proposent leur aide … Ces entreprises ne sont pas mandatées
    // par l'État de Neuchâtel ou par les communes.»
    'Firmen, die gegen Bezahlung beim Gesuch helfen, handeln nicht im Auftrag des Kantons oder der Gemeinden.',
  ],
  quellen: [
    { text: 'Arrêté über die Einstufung und die Beiträge des Jahres (RSN 821.102, PDF, französisch)', url: 'https://rsn.ne.ch/DATA/program/books/rsne/pdf/821.102.pdf' },
    { text: 'Loi d’introduction de la loi fédérale sur l’assurance-maladie (LILAMal, RSN 821.10)', url: 'https://rsn.ne.ch/DATA/program/books/rsne/pdf/82110.pdf' },
    { text: 'Règlement d’application de la LILAMal (RALILAMal, RSN 821.101)', url: 'https://rsn.ne.ch/DATA/program/books/rsne/pdf/821101.pdf' },
    KVG65,
  ],
};
