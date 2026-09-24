// ─── Rätoromanische Fassung der öffentlichen Erklärseiten ────────────────────
//
// Übersetzung des deutschen Originals in `scripts/seiten-inhalt.mjs`.
// 🛑 NICHT von einem Menschen gegengelesen — `freigegeben: false`.
//
// 🛑 DIESE FASSUNG IST DIE UNSICHERSTE DER VIER. Das gehört hierher und nicht
// in eine Fussnote: Rumantsch Grischun ist die Sprache, in der im Studio
// niemand gegenlesen kann, und für die auch kein Prüf-Agent eine belastbare
// Grundlage hat. Sie ist mit derselben Sorgfalt gebaut wie die anderen — aber
// «mit Sorgfalt gebaut» ist nicht dasselbe wie «geprüft». Wenn eine der vier
// Sprachen eine bezahlte Gegenlesung braucht, dann diese.
//
// ─── TERMINOLOGIE ───────────────────────────────────────────────────────────
// Rumantsch Grischun, Wortschatz aus `src/i18n/rm.js` übernommen — dieselbe
// App, dieselben Wörter. Gemessen am 21.09.2026: `entrada` 184×, `chantun`
// 177×, `taglia` 165×, `vischnanca` 60×. Danach richtet sich alles hier.
//   Prämienverbilligung  → reducziun individuala da premi
//   Sozialhilfe          → agid social
//   Ergänzungsleistungen → prestaziuns cumplementaras
//   Einkommen → entrada · Kanton → chantun · Steuer → taglia · Gemeinde → vischnanca
//
// 🛑 Die amtlichen Quellen gibt es NICHT auf Rumantsch — weder Priminfo noch
// das AHV-Merkblatt noch der ESTV-Rechner. Gemessen am 21.09.2026 mit
// Gegenprobe. Die Quellenliste zeigt deshalb auf dieser Seite durchgehend den
// Vermerk «disponibel mo per tudestg». Das ist keine Lücke dieser Seite,
// sondern eine Tatsache über die Schweiz.
//
// 🛑 Struktur und Absatzzahl folgen dem Original eins zu eins — siehe fr.mjs.
// ─────────────────────────────────────────────────────────────────────────────

export const SEITEN = [
  // ─── Pillar ───────────────────────────────────────────────────────────────
  {
    pfad: 'was-steht-mir-zu',
    titel: 'A tge hai jau dretg? Ina survista per la Svizra',
    beschreibung:
      'En Svizra è il sustegn repartì sin la Confederaziun, ils chantuns e las vischnancas — bler resta nunduvrà, perquai ch’ins n’al enconuscha betg. Ina survista, tema per tema.',
    brotkrume: 'A tge hai jau dretg?',
    vorspann:
      'En Svizra na vegn il sustegn betg d’ina sula cascha, mabain da bleras pitschnas — repartidas sin la Confederaziun, ils chantuns e las vischnancas. Tgi che ha dretg a tge dependa perquai ferm dal lieu da domicil. Il motiv il pli frequent per tge che prestaziuns na vegnan betg dumandadas n’è betg in dretg che manca. Igl è il fatg da betg savair ch’ellas existan.',
    abschnitte: [
      {
        titel: 'Trais nivels che na s’accordan betg',
        absaetze: [
          'La <strong>Confederaziun</strong> fixescha tar bleras prestaziuns mo il rom: ella prescriva che i stoppia dar insatge e lascha la concepziun als chantuns. Quai vala per exempel per la reducziun da premi.',
          'Ils <strong>chantuns</strong> emplenischan quest rom — cun agens limits, agens formulars, agens termins. Duas chasadas cun las medemas cifras pon vegnir tractadas differentamain en dus chantuns. Quai n’è betg in sbagl dal sistem, quai è il sistem.',
          'Las <strong>vischnancas</strong> exequeschan en pliras secziuns quai ch’il chantun decida — en l’agid social èn ellas savens il post cun il qual ins ha propi da far.',
          'En pratica vul quai dir: ina resposta generala a la dumonda «hai jau dretg a quai?» n’exista betg. I dat mo la resposta per Voss lieu da domicil, Vossa situaziun e Voss onn.',
        ],
      },
      {
        titel: 'Ils temas en detagl',
        absaetze: [
          'Trais secziuns pertutgan la gronda part da las persunas, e tar tut trais vala ei la paina da guardar era sche ins crai che quai na pertutgia betg:',
        ],
        verweise: ['praemienverbilligung', 'sozialhilfe', 'steuern'],
      },
      {
        titel: 'Pertge che uschè bler resta si',
        absaetze: [
          'In dretg dal qual nagin na sa, na vegn betg fatg valair. Vi da quai vegnan impediments che n’han nagut da far cun il dretg sez: formulars en ina lingua ch’ins sto emprim emprender. Termins che na stattan enninqua ensemen. La tema da far insatge fallà. Ed il supposiziun derasada ch’il sustegn saja insatge per auters.',
          'Nagut da quai na mida insatge al dretg. Ma tut quai maina a quai ch’el na vegn betg fatg valair.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Co chattai jau or a tge ch’jau hai dretg?',
        antwort:
          'La via la pli fidada maina tras il post che decida propi — pia tras l’agen chantun respectivamain l’agna vischnanca. Calculaturs e survistas sco quels colliads qua dattan in emprim orientament, sche ina dumonda vala la paina. Decisiva è adina mo la disposiziun dal post cumpetent.',
      },
      {
        frage: 'Pertge è quai different tenor chantun?',
        antwort:
          'Perquai che la Confederaziun fixescha a posta mo il rom tar bleras prestaziuns e ch’ils chantuns l’emplenischan. Els fixeschan agens limits d’entrada, agnas proceduras ed agens termins. Ina müdada sur il cunfin chantunal po perquai midar il dretg, era sche nagut auter n’è midà.',
      },
      {
        frage: 'Stoss jau inoltrar dapertut sez ina dumonda?',
        antwort:
          'Quai varieschia tenor prestaziun e chantun. Tar tschertas prestaziuns s’annunzian ils posts da sasez, tar autras na capita nagut senza dumonda. En cas da dubi vala: dumandar na custa nagut, ed ina dumonda betg inoltrada na vegn mai approvada.',
      },
      {
        frage: 'Tge custa Maloja Plana?',
        antwort:
          'Nagut. Maloja Plana è gratuit e da funtauna averta. I na dat nagin conto, nagina reclama e nagin traçar; tut las indicaziuns restan sin l’agen apparat.',
      },
    ],
    quellen: ['bwoKantone', 'bsvEL', 'ahvMerkblatt'],
  },

  // ─── Reducziun da premi ───────────────────────────────────────────────────
  {
    pfad: 'praemienverbilligung',
    titel: 'Reducziun da premi: tgi che ha dretg',
    beschreibung:
      'La reducziun individuala da premi è ina contribuziun al premi da la cassa da malsauns. La Confederaziun fixescha il rom, ils chantuns decidan — tge che quai munta per Vus.',
    brotkrume: 'Reducziun da premi',
    vorspann:
      'La reducziun individuala da premi è ina contribuziun da la maun publica al premi da l’assicuranza da malsauns. Ella è prevista en la Lescha davart l’assicuranza da malsauns (LAMal), ma la Confederaziun n’exequescha betg: quai fan ils chantuns, mintgin tenor agnas reglas.',
    abschnitte: [
      {
        titel: 'Tge che la Confederaziun prescriva e tge ch’il chantun decida',
        absaetze: [
          'La Confederaziun prescriva <em>che</em> i stoppia dar ina reducziun da premi e sa participescha al finanziament. Tgi ch’la survegn e quant bler decida il chantun.',
          'Concretamain differeschan da chantun a chantun: ils limits d’entrada e da facultad, la moda co che l’entrada decisiva vegn insumma calculada, sche ins sto inoltrar ina dumonda u sche ins vegn contactà, ed ils termins.',
          'Dapertut medem è percunter <strong>nua ch’ils daners van</strong>: il chantun paja la contribuziun directamain a la cassa da malsauns, betg a la persuna assicurada. Quai stat en la LAMal e n’è betg spazi da moviment chantunal.',
          'Perquai na maina la frasa «tar nus survegn ins quai a partir d’ina entrada da X» rara vart. Ella vala il pli auter per in chantun, e là mo per in onn.',
        ],
      },
      {
        titel: 'Tge cifras che quintan',
        absaetze: [
          'Ils chantuns sa basan per regla sin las datas fiscalas — e savens betg sin quellas da l’onn current, mabain sin ina taxaziun pli veglia ch’è gia entrada en vigur. Quai ha ina consequenza che surprenda: tgi che gudogna quest onn considerablamain damain, na vesa quai betg da sasez en blers chantuns — auters quintan quai mo suenter cun il decount definitiv posteriur.',
          'Plirs chantuns enconuschan per tals cas ina procedura atgna, en la quala ina midada essenziala da las relaziuns vegn resguardada posteriuramain. Sche e co, quai stat tar il post cumpetent — per il pli la cassa da cumpensaziun chantunala u l’institut chantunal d’assicuranzas socialas, en singuls chantuns dentant l’administraziun da taglia u la vischnanca da domicil.',
        ],
      },
      {
        titel: 'Il sbagl il pli frequent',
        absaetze: [
          'Blers supponan ch’ins na survegnia per princip nagut cun ina entrada da lavur. Quai n’è betg il cas: la reducziun da premi n’è betg ina prestaziun mo per persunas senza lavur. Famiglias cun uffants, persunas en furmaziun e chasadas cun entrada media tumban en blers chantuns sutvart.',
          'Il segund sbagl frequent è che ina dumonda refusada ina giada valia per adina. Ella vala per ses onn. Sche l’entrada, la chasada u il chantun da domicil midan, è quai ina nova dumonda.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Hai jau dretg a la reducziun da premi?',
        antwort:
          'Quai dependa dal chantun da domicil, da l’entrada e da la facultad decisivas e da la grondezza da la chasada — tut trais vegnan ponderads differentamain tenor chantun. In limit che vala dapertut n’exista betg. Decisiv decida il post cumpetent: per il pli la cassa da cumpensaziun chantunala u l’institut chantunal d’assicuranzas socialas, en singuls chantuns l’administraziun da taglia u la vischnanca da domicil.',
      },
      {
        frage: 'Stoss jau inoltrar ina dumonda?',
        antwort:
          'En tscherts chantuns vegnan las persunas autorisadas contactadas d’uffizi, en auters sto la dumonda vegnir inoltrada sezza. Perquai che quai è reglà sin nivel chantunal e po midar, vala ei la paina da dumandar tar l’agen post chantunal — era sche ins ha gia survegnì insatge en in onn precedent.',
      },
      {
        frage: 'Tge entrada vegn quintada?',
        antwort:
          'Per regla ina entrada derivada da la taxaziun fiscala, savens d’in onn pli vegl, e savens cun supplements e deducziuns chantunalas. L’entrada bruta dal mais current n’è quasi mai la cifra decisiva.',
      },
      {
        frage: 'E sche mia entrada è sedruccada fermamain?',
        antwort:
          'Lura vala ei particularmain la paina da dumandar. Plirs chantuns resguardan, sin dumonda, ina midada essenziala da las relaziuns economicas, era sche la taxaziun da basa mussa anc ina entrada pli auta.',
      },
    ],
    quellen: ['priminfo'],
  },

  // ─── Agid social ──────────────────────────────────────────────────────────
  {
    pfad: 'sozialhilfe',
    titel: 'L’agid social en Svizra — in orientament',
    beschreibung:
      'Tgi che decida davart l’agid social, da tge ch’el sa cumpona e pertge che las directivas da la SKOS n’èn betg automaticamain lescha. In inquadrament senza cifras.',
    brotkrume: 'Agid social',
    vorspann:
      'L’agid social è il grad il pli bass da la rait svizra — el interveglia là nua che tut auter na basta betg u na basta betg pli. Cumpetents n’èn betg la Confederaziun, mabain ils chantuns e, en blers da quels, las vischnancas.',
    abschnitte: [
      {
        titel: 'Subsidiar vul dir: emprim tut auter',
        absaetze: [
          'L’agid social è <strong>subsidiar</strong>. Avant ch’el vegn en dumonda, vegnan examinads auters dretgs: salari, indemnisaziun da dischoccupaziun, rentas, prestaziuns cumplementaras, reducziun da premi, contribuziuns d’mantegniment, stipendis. Era l’agna facultad vegn resguardada, cun quai ch’ils chantuns enconuschan ina franchisa da la quala l’import differeschia.',
          'Quai è il motiv pertge ch’ina annunzia cumenza savens cun bleras dumondas davart prestaziuns dal tut autras. I na va betg per malfidanza, mabain per l’urden prescrit da la lescha.',
        ],
      },
      {
        titel: 'Las directivas da la SKOS èn recumandaziuns, betg lescha',
        absaetze: [
          'Quai è il punct il pli savens surpassà. Las directivas da la Conferenza svizra da l’agid social (SKOS) èn <strong>recumandaziuns</strong>. Ellas daventan obligatoricas pir uschenavant ch’in chantun las surpiglia en ses agen dretg — ed ils chantuns fan quai en dimensiun differenta.',
          'En pratica vul quai dir: in calculatur da la SKOS dat in bun emprim orientament, ma el n’è betg ina promissa. Tge che vala en Voss cas stat en la lescha chantunala davart l’agid social ed en la disposiziun dal post cumpetent.',
        ],
      },
      {
        titel: 'Da tge ch’il sustegn sa cumpona tipicamain',
        absaetze: [
          'En la gronda part dals chantuns èn quai trais elements: in <strong>basegn da basa</strong> per il mantegniment, ils <strong>custs da abitar</strong> en il rom usità dal lieu, e la <strong>provediment medicinal da basa</strong>. Vi da quai pon vegnir prestaziuns tenor la situaziun.',
          'Ils imports na numnain nus qua a posta betg: els differeschan tenor chantun e grondezza da la chasada e vegnan adattads regularmain. Ina cifra sin ina pagina sco questa fiss faussa suenter pauc temp.',
        ],
      },
      {
        titel: 'Il dretg che nagin na po perder',
        absaetze: [
          'Independentamain da tut quai survart stat en la <strong>Constituziun federala, artitgel 12</strong>, il dretg da survegnir agid en situaziuns d’basegn: tgi che vegn en basegn e n’è betg abel da procurar per sasez, ha il dretg da vegnir agidà ed assistì e da survegnir ils meds ch’èn indispensabels per ina existenza degna da l’uman.',
          'Quest dretg tutga a mintga persuna en Svizra. El n’è betg il medem sco l’agid social e cuvra damain — ma el è il limit il pli bass sut il qual ins na dastga betg ir.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Quant agid social hai jau dretg?',
        antwort:
          'Quai sa mesira tenor il lieu da domicil, la grondezza da la chasada, l’entrada, la facultad ed ils custs effectivs da abitar e da sanadad — e quai sa drizza tenor il dretg chantunal. Ina cifra che vala dapertut n’exista betg. In orientament provisoric dattan ils calculaturs d’agid social; decisiva è la disposiziun dal post cumpetent.',
      },
      {
        frage: 'Èn las directivas da la SKOS lescha?',
        antwort:
          'Na. Quai èn recumandaziuns da la Conferenza svizra da l’agid social. Ellas èn obligatoricas mo uschenavant ch’in chantun las ha surpiglià en ses agen dretg. Perquai po la medema situaziun vegnir giuditgada differentamain tenor chantun.',
      },
      {
        frage: 'Stoss jau emprim consumar mia facultad?',
        antwort:
          'La facultad vegn quintada, ma betg cumplainamain: ils chantuns enconuschan ina franchisa che na vegn betg tutgada. Quant auta ch’ella è differeschia tenor chantun e chasada. Il post cumpetent quinta quai en il cas singul.',
      },
      {
        frage: 'Tge è la differenza a las prestaziuns cumplementaras?',
        antwort:
          'Las prestaziuns cumplementaras tutgan al emprim pitgel e vegnan per regla en dumonda, sche ina prestaziun da l’AVS u da l’AI na cuvra betg il basegn existenzial. Ellas èn regladas dal dretg federal e n’èn betg agid social. In dretg a las prestaziuns cumplementaras va avant a l’agid social.',
      },
    ],
    quellen: ['skosRechner', 'bsvEL', 'bwoKantone'],
  },

  // ─── Taglias ──────────────────────────────────────────────────────────────
  {
    pfad: 'steuern',
    titel: 'Taglias en Svizra: Confederaziun, chantun, vischnanca',
    beschreibung:
      'Pertge che la medema summa da salari vegn taxada fitg differentamain tenor il lieu da domicil — ils trais nivels, il pe da taglia e tge che quai munta en pratica.',
    brotkrume: 'Taglias',
    vorspann:
      'Tgi che paja taglia sin l’entrada en Svizra, la paja per regla a trais posts a medem temp: a la Confederaziun, al chantun ed a la vischnanca. Mo la emprima è dapertut la medema. Las autras duas èn il motiv pertge ch’il medem salari maina a dus lieus da domicil a quints considerablamain differents.',
    abschnitte: [
      {
        titel: 'La taglia federala directa è dapertut la medema',
        absaetze: [
          'La taglia federala directa sa drizza tenor la Lescha federala davart la taglia federala directa (LTFD) ed enconuscha per tut la Svizra la medema tarifa. Ella differenziescha tenor il stadi civil e la chasada, ma betg tenor il lieu da domicil.',
          'Encassada vegn ella tuttina dal chantun — la decleraziun da taglia è la medema.',
        ],
      },
      {
        titel: 'Chantun e vischnanca: tarifa per pe da taglia',
        absaetze: [
          'Sin nivel chantunal e communal vegnan duas grondezzas ensemen. La <strong>tarifa</strong> fixescha quant taglia ch’ina tscherta entrada taxabla chaschuna — quai dat la uschenumnada taglia simpla. Il <strong>pe da taglia</strong> è in factur vi da quella, per il pli inditgà en pertschient, ch’il chantun e la vischnanca fixeschan mintgin per sasez e pon adattar mintg’onn.',
          'Sin il quint stattan tenor chantun e confessiun anc ulteriurs posts, per exempel la taglia da baselgia u ina taglia persunala. Els èn per il pli pitschens, ma els declereschan pertge che la summa na correspunda betg exactamain a quai ch’in pur calculatur d’entrada dat ora.',
          'Duas vischnancas en il medem chantun han perquai la medema tarifa, ma mintgina ses agen pe da taglia — che po differenziar. Dus chantuns han omadus different. Quai è la vaira leva davos las enconuschentas cumparegliaziuns chantunalas. En singuls chantuns dat i dasperas particularitads, per exempel vischnancas senza agna taglia communala.',
        ],
      },
      {
        titel: 'Tge che vegn deducì da l’entrada',
        absaetze: [
          'Taxà na vegn betg il salari, mabain l’<strong>entrada taxabla</strong> — pia quai che resta suenter las deducziuns admessas. Vi da quai tutgan tenor la situaziun expensas professiunalas, contribuziuns al pitgel 3a, custs da malsagna sur ina limita, deducziuns per uffants e per lur tgira ed ulteriuras.',
          'Tge deducziuns ch’èn admessas ed en tge dimensiun differeschia tranter la Confederaziun ed il chantun e tranter ils chantuns. Precis qua va il pli bler a perder — betg tras indicaziuns faussas, mabain tras deducziuns che nagin n’ha inscrit.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Pertge pai jau autramain ch’insatgi en il chantun vischin?',
        antwort:
          'Perquai ch’il chantun fixescha la tarifa e ch’il chantun e la vischnanca decidan mintgin ses agen pe da taglia. Mo la taglia federala directa è dapertut la medema. Il medem salari po uschia menar a quints considerablamain differents tenor il lieu da domicil.',
      },
      {
        frage: 'Tge è il pe da taglia?',
        antwort:
          'In factur vi da la taglia simpla, per il pli inditgà en pertschient, ch’il chantun e la vischnanca decidan mintgin per sasez. La tarifa di quant auta che la taglia simpla è; il pe da taglia di cun tge factur ch’ella vegn encassada. Omadus ensemen dattan la taglia chantunala e communala.',
      },
      {
        frage: 'Tge deducziuns poss jau far?',
        antwort:
          'Quai dependa da la situaziun e dal chantun — frequentas èn expensas professiunalas, contribuziuns al pitgel 3a, custs da malsagna e d’accident sur ina limita sco era deducziuns per uffants e per lur tgira. L’import e las premissas differeschan tranter la Confederaziun ed il chantun; decisiva è la directiva dal agen chantun.',
      },
      {
        frage: 'Nua poss jau quintar liantamain?',
        antwort:
          'Decisiva è a la fin la taxaziun da l’administraziun chantunala da taglia. Per in quint anticipà fidabel metta l’Administraziun federala da taglias a disposiziun in calculatur che resguarda la Confederaziun, il chantun e la vischnanca.',
      },
    ],
    quellen: ['estvRechner'],
  },
];

export const SONDERSEITEN = [
  {
    pfad: 'rechtliches',
    titel: 'Impressum, protecziun da datas e exclusiun da responsabladad',
    beschreibung:
      'Tgi che stat davos Maloja Plana, tge datas che resultan cun la consultaziun da questas paginas e per tge ch’ils calculaturs expressivamain na respundan betg.',
    brotkrume: 'Chaussas giuridicas',
    vorspann:
      'Questa pagina vala per malojaplana.ch e per las paginas explicativas publicas. Per l’applicaziun sezza vala ultra da quai la decleraziun detagliada davart la protecziun da datas, che stat en l’applicaziun sut «Protecziun da datas e chaussas giuridicas» — era ella senza code d’access.',
    abschnitte: [
      {
        titel: 'Purschidra',
        absaetze: [
          'Sophie Stebler / Stebler Studios<br>Basilea, Svizra<br>E-mail: <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>',
          'Maloja Plana — classeur da vita svizzer. In project da funtauna averta sut AGPL-3.0. L’utilisaziun da l’applicaziun è gratuita; per white-label ed autras utilisaziuns commerzialas datti sin dumonda ina licenza separada.',
          'Tar l’adressa da contact: l’<a href="https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/de#art_3" rel="noopener">art. 3 al. 1 lit. s cifra 1 LCSL</a> pretenda indicaziuns davart l’identitad e davart l’adressa da contact «cumpraisa quella da la posta electronica». Num, lieu ed e-mail èn inditgads; sch’ina adressa postala è supplementarmain obligatorica, vegn sclerì. Via e-mail essan nus cuntanschibels per mintga fatschenda, era per giuridicas.',
        ],
      },
      {
        titel: 'Exclusiun da responsabladad',
        absaetze: [
          'Maloja Plana è in <strong>utensil d’orientaziun</strong>. Ils calculaturs e las survistas sa basan sin fundaments giuridics accessibels publicamain e servan exclusivamain a l’infurmaziun persunala.',
          '<strong>Maloja Plana na remplazza nagina cussegliaziun giuridica, fiscala, d’assicuranza u finanziala.</strong>',
          'La purschidra na surpiglia nagina garanzia per la correctadad, la cumplettadad u l’actualitad dals quints, per l’idoneitad dals resultats per decisiuns individualas, ni per donns che resultan da lur utilisaziun. Decisivas èn exclusivamain las leschas en vigur e las autoritads cumpetentas.',
        ],
      },
      {
        titel: 'Protecziun da datas sin questas paginas',
        absaetze: [
          'Las paginas explicativas èn HTML static. Ellas na chargian <strong>nagins scripts, nagins cookies e nagins resursas da terzas persunas</strong>; las scrittiras sa chattan sin il medem server. I na dat nagin traçar, nagina analisa e nagina reclama.',
          'Cun la consultaziun resultan tuttina datas tecnicas tar l’hoster — <strong>Infomaniak Network SA</strong>, Rue Eugène-Marziano 25, 1227 Les Acacias / Genevra, cun center da calcul en Svizra: adressa IP en ils protocols dal server, tip da navigatur, sistem operativ e mument da l’access. Quai è tecnicamain necessari per la furniziun e per la segirezza da la gestiun. Infomaniak agescha en quest connex sco incumbensada da l’elavuraziun (art. 9 nLPD). Tenor l’indicaziun dal purschider vegnan ils protocols d’access e d’errur conservads almain 7 dis (Infomaniak Support-FAQ 1926, consultada ils 23 da settember 2026).',
          'Ulteriurs destinaturs n’existan betg: nagins servetschs d’analisa, nagina integraziun da medias socialas, nagina transmissiun e nagina vendita da datas.',
        ],
      },
      {
        titel: 'Contact per e-mail',
        absaetze: [
          'Sche Vus scrivais a <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>, elavurain nus Vossa adressa, il cuntegn dal messadi ed eventualas agiuntas per pudair respunder. La chascha da posta sa chatta tar Infomaniak en Svizra. La correspondenza resta uschè ditg sco la dumonda e las dumondas consuetas da suandar quai pretendan, lura vegn ella stizzada. Ella na vegn betg transmessa a terzas persunas, nun ch’il dretg pretenda quai.',
        ],
      },
      {
        titel: 'Datas en l’applicaziun',
        absaetze: [
          'Quai che Vus registrai en Maloja Plana resta <strong>sin Voss apparat</strong> (localStorage ed IndexedDB en il navigatur). I na dat nagin conto, nagina annunzia e nagina transmissiun a la purschidra u a terzas persunas. Tgi che vul stizzar las datas, las stizza sin l’apparat — i n’exista nagina segunda copia autrunda.',
          'Er las indicaziuns particularamain sensitivas (sanadad, agid social, convicziuns) vegnan memorisadas da l’applicaziun mo localmain. Las copias da segirezza automaticas en il navigatur n’èn betg criptadas.',
          'Perquai che nagut na vegn transmess, na po la purschidra era betg dar infurmaziuns davart Vossas endataziuns: ella n’las ha mai vis. La versiun detagliada cun tut ils dretgs tenor la LPD stat en l’applicaziun sut «Protecziun da datas e chaussas giuridicas».',
        ],
      },
      {
        titel: 'Proprietad intellectuala',
        absaetze: [
          'Il code stat sut <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">AGPL-3.0</a>, consultabel sin <a href="https://github.com/steblerstudios/maloja-plana" rel="noopener">GitHub</a>. «Maloja Plana» è ina denominaziun da project da Sophie Stebler. Per l’utilisaziun commerziala datti in duebel sistem da licenza — dumondas a l’adressa numnada survart.',
        ],
      },
      {
        titel: 'Dretg applitgabel',
        absaetze: [
          'I vala il dretg svizzer. Il for giuridic è Basilea-Citad, Svizra.',
        ],
      },
    ],
    faq: [],
    quellen: [],
  },
];
