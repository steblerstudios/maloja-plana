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
          'La <strong>Confederaziun</strong> fixescha tar bleras prestaziuns mo il rom: ella prescriva che i stoppia dar insatge e lascha per gronda part la concepziun als chantuns. Quai vala per exempel per la reducziun da premi.',
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
          'Quai varieschia tenor prestaziun e chantun. Tar tschertas prestaziuns s’annunzian ils posts da sasez, tar autras na capita nagut senza dumonda. En cas da dubi vala: dumandar na custa nagut, ed ina dumonda betg inoltrada na vegn mai approvada. Senza pass svizzer vala ina excepziun per l’agid social: il retratg po avair consequenzas per la permissiun da dimora; laschai cussegliar Vus avant la dumonda (dapli sin la pagina Agid social).',
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
      'La reducziun individuala da premi è ina contribuziun da la maun publica al premi da l’assicuranza da malsauns. Ella è prevista en la Lescha davart l’assicuranza da malsauns (LAMal), ma la Confederaziun n’exequescha betg: quai fan ils chantuns, mintgin tenor agnas reglas, en il rom dal dretg federal.',
    abschnitte: [
      {
        titel: 'Tge che la Confederaziun prescriva e tge ch’il chantun decida',
        absaetze: [
          'La Confederaziun prescriva <em>che</em> i stoppia dar ina reducziun da premi, fixescha per quai pretensiuns minimalas e sa participescha al finanziament. En il rom da questas pretensiuns decida il chantun tgi ch’la survegn e quant bler.',
          // TODO(rm): provisorisch — Gegenlese (Gruppe D, 11.11.2026)
          'Trais prescripziuns valan dapertut. Per entradas bassas e mesaunas reduceschan ils chantuns las premias dals uffants per almain 80 pertschient e quellas dals giuvens creschids en furmaziun per almain 50 pertschient (art. 65 al. 1bis LAMal). Mintga chantun fixescha tge part da l’entrada disponibla che la premia dastga far il pli (art. 65 al. 1ter LAMal). Ed uschespert ch’il dretg è constatà, sto il pajament succeder uschia che Vus na stuais betg pajar ordavant la premia (art. 65 al. 3 LAMal).',
          'Concretamain differeschan da chantun a chantun: ils limits d’entrada e da facultad, la moda co che l’entrada decisiva vegn insumma calculada, sche ins sto inoltrar ina dumonda u sche ins vegn contactà, ed ils termins.',
          'Dapertut medem è percunter <strong>nua ch’ils daners van</strong>: il chantun paja la contribuziun directamain a la cassa da malsauns, betg a la persuna assicurada. Quai stat en la LAMal e n’è betg spazi da moviment chantunal.',
          'Perquai na maina la frasa «tar nus survegn ins quai a partir d’ina entrada da X» rara vart. Ella vala il pli auter per in chantun, e là mo per in onn.',
        ],
      },
      {
        titel: 'Tge cifras che quintan',
        absaetze: [
          'Ils chantuns sa basan per regla sin las datas fiscalas — e savens betg sin quellas da l’onn current, mabain sin ina taxaziun pli veglia ch’è gia entrada en vigur. Quai ha ina consequenza che surprenda: tgi che gudogna quest onn considerablamain damain, na vesa quai betg da sasez en blers chantuns — auters quintan quai mo suenter cun il decount definitiv posteriur.',
          'La LAMal pretenda dentant ch’ils chantuns resguardian, tar la verificaziun dal dretg, las relaziuns d’entrada e da famiglia las pli actualas, en spezial sin dumonda (art. 65 al. 3 LAMal). Voss chantun regla ils detagls, per exempel las cundiziuns, ils mussaments, ils termins e l’entrada en vigur. Da quai na resulta betg automaticamain in dretg a la reducziun. Il post cumpetent dat infurmaziun — per il pli la cassa da cumpensaziun chantunala u l’institut chantunal d’assicuranzas socialas, en singuls chantuns dentant l’administraziun da taglia u la vischnanca da domicil.',
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
          'Quai dependa dal chantun da domicil, da l’entrada e da la facultad decisivas e da la grondezza da la chasada — tut trais vegnan ponderads differentamain tenor chantun. In limit che vala dapertut n’exista betg. Decisiv decida il post cumpetent: per il pli la cassa da cumpensaziun chantunala u l’institut chantunal d’assicuranzas socialas, en singuls chantuns l’administraziun da taglia u la vischnanca da domicil. Ina excepziun vala en il sectur d’asil: cun permiss N u S è il dretg suspendì, uschè ditg ch’i vegn retratg agid social dal tut u per part (art. 82a al. 7 LAsil). Il medem vala cun permiss F, auter che sche l’entrada è stada avant dapli che set onns (art. 86 al. 2 LEI, art. 5b OAsil 2). Per fugitivs admess provisoricamain pon valair autras reglas; quai sclerescha il post chantunal.',
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
          'Lura vala ei particularmain la paina da dumandar. La LAMal pretenda ch’ils chantuns resguardian, tar la verificaziun dal dretg, las relaziuns d’entrada e da famiglia las pli actualas, en spezial sin dumonda (art. 65 al. 3 LAMal). Voss chantun regla ils detagls, per exempel las cundiziuns, ils mussaments, ils termins e l’entrada en vigur. Da quai na resulta betg automaticamain in dretg a la reducziun. Dumandai tar il post cumpetent, era sche la taxaziun determinanta mussa anc ina entrada pli auta.',
      },
    ],
    quellen: ['priminfo', 'fedlexKvgArt65'],
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
          // TODO(rm): provisorisch — Gegenlese (Gruppe D, 11.11.2026)
          'Senza pass svizzer po il retratg d’agid social avair consequenzas per la dimora. Cun ina permissiun da dimora u da curta durada (B, L) po el esser in motiv da revocar la permissiun; cun ina permissiun da domicil (C), sch’il retratg è durabel ed en grond dimensiun (art. 62 al. 1 lit. e ed art. 63 al. 1 lit. c LEI). Cun permiss F po el engrevgiar ina dumonda posteriura per reuniun da famiglia u per ina permissiun da dimora (art. 85c al. 1 lit. c ed art. 84 al. 5 LEI). Per burgais da stadis da la UE/AELS valan per part autras reglas. Laschai cussegliar Vus ordavant tar in post da cussegliaziun u tar il servetsch social. Independentamain dal status da dimora avais Vus en ina situaziun da basegn dretg sin il minimum per viver (art. 12 CF, pli giu).',
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
        titel: 'Dretg d’agid en situaziuns da basegn', // Randtitel BV Art. 12 (Fedlex, Fassung 3.3.2024); vorher absolut, vgl. BGE 130 I 71 E. 4.3 und 6
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
      // TODO(rm): provisorisch — Gegenlese (Gruppe D, 11.11.2026)
      {
        frage: 'Ha l’agid social consequenzas per mia permissiun da dimora?',
        antwort:
          'Senza pass svizzer po el avair. Cun permiss B u L po il retratg esser in motiv da revocar la permissiun, cun permiss C sch’el è durabel ed en grond dimensiun (art. 62 al. 1 lit. e ed art. 63 al. 1 lit. c LEI). Cun permiss F po el engrevgiar ina dumonda posteriura per reuniun da famiglia u per ina permissiun da dimora (art. 85c al. 1 lit. c ed art. 84 al. 5 LEI). Cun permiss N u S e cun permiss F durant ils emprims set onns suenter l’entrada è ultra da quai la reducziun da premi suspendida, uschè ditg ch’i vegn retratg agid social (art. 82a al. 7 LAsil, art. 5b OAsil 2). Laschai cussegliar Vus ordavant tar in post da cussegliaziun u tar il servetsch social.',
      },
      {
        frage: 'Stoss jau restituir l’agid social?',
        antwort:
          'Sch’e cura, regla il chantun — per exempel sch’i vegn pli tard ina ierta u ina facultad pli gronda. Ultra da quai pon parents en lingia directa, per exempel geniturs, uffants, tats e biadis, vegnir obligads da sustegnair, sch’els vivan en bunas relaziuns (art. 328 al. 1 CCS). Tge che vala en Voss cas, di il post cumpetent.',
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
          // TODO(rm): provisorisch — Gegenlese (Gruppe D, 11.11.2026)
          'Auter tar la <strong>taglia a la funtauna</strong>: sche Vus lavurais en Svizra senza permissiun da domicil, per exempel cun permiss B, deducescha il patrun la taglia directamain da la paja (art. 83 LTFD). Sche la paja brutta è sut ina limita legala, na datti per regla nagina decleraziun da taglia. Ulteriuras deducziuns, per exempel per la pitga 3a, datti lura mo tras ina taxaziun ordinaria posteriura; ella sto vegnir dumandada fin ils 31 da mars da l’onn suandant, tar ina partenza fin a la desannunzia (art. 89a al. 3 LTFD). Sur quella vegn taxà ordinariamain d’uffizi (art. 89 LTFD, art. 9 OTF).',
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
          'Tge deducziuns ch’èn admessas ed en tge dimensiun differeschia tranter la Confederaziun ed il chantun e tranter ils chantuns. Savens va qua daners a perder — betg tras indicaziuns faussas, mabain tras deducziuns che nagin n’ha inscrit.',
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

  // ─── Prestaziuns cumplementaras (14.11.2026) ──────────────────────────────
  // 🛑 Wie alles hier: mit Sorgfalt gebaut, nicht geprüft. Abkürzungen wie bisher
  // nach dem Französischen (LAMal, LEI): LPC = ELG · OPC = ELV · LEI = AIG.
  {
    pfad: 'ergaenzungsleistungen',
    titel: 'Las prestaziuns cumplementaras a l’AVS ed a l’AI',
    beschreibung:
      'Cura che prestaziuns cumplementaras (PC) entran en dumonda, co ch’ellas vegnan calculadas e pertge ch’ellas n’èn betg agid social. In’orientaziun senza cifras.',
    brotkrume: 'Prestaziuns cumplementaras',
    vorspann:
      'Las prestaziuns cumplementaras, curt PC, gidan là, nua ch’ina renta da l’AVS u da l’AI e las ulteriuras entradas na tanschan betg per il minimum per viver. Ellas èn regladas en la lescha federala davart las prestaziuns cumplementaras (LPC) ed èn in dretg legal, betg ina favur. Ellas vegnan pajadas dals chantuns.',
    abschnitte: [
      {
        titel: 'Senza prestaziun da l’AVS u da l’AI na datti nagina PC',
        absaetze: [
          'Las PC premettan ina prestaziun da l’AVS u da l’AI: ina renta da vegliadetgna u da survivents da l’AVS, era ina renta anticipada, ina renta da l’AI, ina indemnisaziun d’impotenza da l’AI u in pajament per di da l’AI che vegn pajà senza interrupziun dapi almain sis mais. Ultra da quai èn necessaris il domicil e la dimora usitada en Svizra (art. 4 LPC).',
          'Per persunas estras vala ultra da quai ina durada minimala da dimora: per regla diesch onns senza interrupziun en Svizra, tschintg onns per fugitivs e persunas senza naziunalitad (art. 5 LPC). Per persunas burgaisas d’in stadi da l’UE u da l’AECL na vala ella betg.',
          'Tgi che n’ha nagina renta mo perquai ch’i mancan onns da contribuziun, po survegnir tuttina PC sut tschertas premissas (art. 4 LPC). Tgi che croda en basegns senza nagina prestaziun da l’AVS u da l’AI, sa drizza a l’agid social da la vischnanca da domicil.',
        ],
      },
      {
        titel: 'La largia tranter expensas ed entradas',
        absaetze: [
          'La PC annuala correspunda a la part da las <strong>expensas renconuschidas</strong> che surpassa las <strong>entradas imputablas</strong> (art. 9 LPC). Tar las expensas tutgan per exempel in import per il basegn general da viver, il tschains fin ad in maximum ed in import per la premia da la cassa da malsauns (art. 10 LPC). Tar las entradas tutgan rentas, ina part da l’entrada da gudogn ed ina part da la facultad (art. 11 LPC).',
          'Dretg ha mo tgi che posseda ina facultad sut ina limita legala; ina immobiglia abitada da la proprietaria u dal proprietari na vegn betg quintada per questa limita (art. 9a LPC). Facultad, a la quala insatgi ha renunzià senza cuntraprestaziun, per exempel tras ina donaziun, vegn quintada (art. 11a LPC).',
          'La Confederaziun fixescha ils imports per il basegn da viver ed ils maximums dal tschains, graduads tenor trais regiuns (art. 10 LPC). Nus na ls numnain betg intenziunadamain qua: els vegnan adattads regularmain, ed ina cifra sin ina pagina sco questa fiss baud fallada. Per persunas che vivan en ina chasa da tgira suonda il calcul agens reglas; ils chantuns pon limitar ils custs renconuschids da la chasa da tgira.',
        ],
      },
      {
        titel: 'Ils custs da malsogna e d’invaliditad vegnan anc tiers',
        absaetze: [
          'Ultra da la PC annuala bonifitgescha il chantun custs da malsogna e d’invaliditad cumprovads, per exempel per il dentist, per agid, tgira e assistenza a chasa, per il transport al lieu da tractament, per meds auxiliars sco er la franchisa e la part da custs da la cassa da malsauns (art. 14 LPC). Tge custs precisamain e fin a tge import, decida il chantun.',
          'Era tgi che na survegn nagina PC annuala, perquai che sias entradas èn in pau memia autas, po survegnir bonifitgads tals custs, uschenavant ch’els surpassan il surpli d’entradas.',
          'Tegnai quints e mussaments: bonifitgà vegn mo quai ch’è cumprovà, e mo sche Vus faschais valair quai entaifer in termin legal suenter la facturaziun (art. 15 LPC).',
        ],
      },
      {
        titel: 'S’annunziar: tar il chantun da domicil, e baud',
        absaetze: [
          'Cumpetent è il chantun, en il qual Vus avais Voss domicil. El decida tge post che retschaiva l’annunzia; per il solit è quai la cassa chantunala da cumpensaziun u l’institut d’assicuranzas socialas, savens tras l’agentura AVS da la vischnanca da domicil (art. 21 LPC).',
          'Il dretg cumenza per regla cun il mais, en il qual l’annunzia vegn inoltrada (art. 12 LPC). Pli baud po el cumenzar mo en tscherts cas, per exempel sche l’annunzia vegn fatga entaifer sis mais suenter ina disposiziun da renta u suenter l’entrada en ina chasa da tgira u en l’ospital (art. 12 al. 2 LPC, art. 22 OPC). Tgi che spetga, po perquai perder mais.',
          'Sche Vus n’essas betg segir, sch’ina annunzia vala la paina, dumandai tar il post da PC. El examinescha il dretg e motivescha sia decisiun en ina disposiziun.',
        ],
      },
      {
        titel: 'Las PC n’èn betg agid social',
        absaetze: [
          'Las PC vegnan savens confundidas cun l’agid social. Ellas èn insatge auter: in dretg tenor il dretg federal, calculà tenor reglas che valan en tut la Svizra. In dretg sin PC ha la precedenza envers l’agid social.',
          'Durant Vossa vita na stuais Vus betg restituir PC retratgas legalmain. Suenter la mort vegnan ellas restituidas da l’ierta, ma mo da la part che surpassa in import liber legal; tar pèrs maridads pir da l’ierta da la persuna che mora sco segunda (art. 16a LPC).',
          'Senza pass svizzer e senza la naziunalitad d’in stadi da l’UE u da l’AECL na vegn la reuniun da la famiglia per regla betg permessa, sche Vus retschavais PC annualas u las retschavessas pervia da la reuniun (art. 43 al. 1 lit. e ed art. 44 al. 1 lit. e LEI). Laschai Vus cussegliar ordavant en quest cas.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Hai jau dretg sin prestaziuns cumplementaras?',
        antwort:
          'Quai dependa da quai, sche Vus retschavais ina prestaziun da l’AVS u da l’AI, nua che Vus abitais e co che Vossas entradas, expensas e Vossa facultad vesan ora. Ina limita valaivla per tuts na datti betg, perquai ch’il tschains, la premia e la chasada quintan era. In’emprima orientaziun dat il calculatur da PC da l’AVS/AI; obligatorica è la disposiziun dal post da PC da Voss chantun.',
      },
      {
        frage: 'Datti PC era avant la vegliadetgna da renta?',
        antwort:
          'Gea. Tgi che retschaiva ina renta da l’AI, ina renta da vaiva, da vaiv u d’orfen po survegnir PC era avant la vegliadetgna da renta. Era tgi che anticipescha la renta da l’AVS ademplescha la premissa d’ina renta (art. 4 LPC); la renta reducida quinta lura sco entrada (art. 11 LPC). Tgi che vegn exclus da l’assicuranza cunter la dischoccupaziun a partir da sessanta onns, po survegnir sut tschertas premissas prestaziuns transitoricas; era quellas s’annunzia ins tar il post da PC.',
      },
      {
        frage: 'Quinta mia chasa u mi appartament?',
        antwort:
          'Per la limita da facultad na quinta ina immobiglia abitada da la proprietaria u dal proprietari betg (art. 9a LPC). En il calcul sez vegn sia valur resguardada, ma cun in import liber (art. 11 LPC). Tge che resulta en Voss cas, calcula il post da PC.',
      },
      {
        frage: 'Tge vala, sche jau stoss ir en ina chasa da tgira?',
        antwort:
          'Lura vegn la PC calculada tenor agens reglas: empè dal basegn da viver e dal tschains quintan la taxa dal di da la chasa da tgira, per la quala il chantun po fixar in maximum, ed in import per expensas persunalas che fixescha il chantun (art. 10 al. 2 LPC). S’annunziai entaifer sis mais suenter l’entrada; lura po il dretg cumenzar gia a partir dal mais da l’entrada, sche las autras premissas èn ademplidas (art. 12 al. 2 LPC).',
      },
      {
        frage: 'Stoss jau annunziar midadas?',
        antwort:
          'Gea. Mintga midada da la situaziun persunala e mintga midada pli gronda da la situaziun economica sto vegnir annunziada immediatamain al post da PC, per exempel ina midada d’abitaziun, in nov tschains, in’ierta u l’entrada en ina chasa da tgira (art. 24 OPC). Prestaziuns retratgas nungiustifitgadamain ston vegnir restituidas.',
      },
      {
        frage: 'Tge porta ina PC anc?',
        antwort:
          'Tgi che retschaiva PC annualas a l’AVS u a l’AI è liberà da la taxa da radio e televisiun; la liberaziun dumonda ins tar il post d’incassament cun la conferma dal post da PC. L’import per la premia da la cassa da malsauns che quinta en il calcul va directamain a la cassa da malsauns. En cas da dubi dumandai tar il post da PC.',
      },
    ],
    quellen: ['ahvMerkblattEL', 'bsvEL'],
  },

  // ─── Dischoccupaziun (16.11.2026) ─────────────────────────────────────────
  // 🛑 Mit Sorgfalt gebaut, nicht geprüft. Abkürzungen nach dem Französischen: LACI = AVIG ·
  // OACI = AVIV · LPtra = ÜLG · LAA = UVG · LAVS = AHVG · LSE = AVG · LPP = BVG · LIFD = DBG.
  // RAV bleibt als Abkürzung stehen, im Vorspann ausgeschrieben — die amtliche rm-Bezeichnung ist nicht belegt.
  {
    pfad: 'arbeitslosigkeit',
    titel: 'Dischoccupà: tge che l’assicuranza paja',
    beschreibung:
      'Tgi che ha dretg sin indemnisaziun da dischoccupaziun, pertge che l’annunzia tar il RAV quinta baud e tge che vegn suenter l’exclusiun. Senza cifras.',
    brotkrume: 'Dischoccupaziun',
    vorspann:
      'L’assicuranza cunter la dischoccupaziun (AD) è obligatorica per emploiadas ed emploiads: tgi che lavura paja contribuziuns sin la paja, e tgi che perda la plazza survegn sut tschertas premissas in pajament per di che remplazza ina part da la paja. Ella è reglada en la lescha davart l’assicuranza cunter la dischoccupaziun (LACI) e vala en tut la Svizra en il medem moda. Ils chantuns mainan ils centers regiunals d’intermediaziun da lavur (RAV).',
    abschnitte: [
      {
        titel: 'Tgi che ha dretg sin pajaments per di',
        absaetze: [
          'Dretg sin indemnisaziun da dischoccupaziun ha tgi ch’è dischoccupà dal tuttafatg u per part, ha ina perdita da lavur imputabla, abita en Svizra, n’ha anc betg cuntanschì la vegliadetgna da renta, ha avunda temp da contribuziun u è liberà da quel, è abel d’intermediar e satisfa a las prescripziuns da controlla (art. 8 LACI).',
          'Temp da contribuziun vul dir: en in tschert temp avant la dischoccupaziun avais Vus lavurà avunda ditg sco emploiada u emploià e pajà contribuziuns (art. 13 LACI). Tgi che n’era betg emploià en quest temp pervia da scolaziun, malsogna, accident u maternitad, u tgi che sto tschertgar ina plazza suenter ina separaziun, in divorzi u la mort dal partenari u da la partenaria, po esser liberà dal temp da contribuziun (art. 14 LACI).',
          'Persunas cun activitad da gudogn independenta n’èn betg assicuradas cunter la dischoccupaziun per lur activitad independenta. Quintar po mo temp da contribuziun or d’ina plazza sco emploià.',
        ],
      },
      {
        titel: 'S’annunziar tar il RAV, e baud',
        absaetze: [
          'Pajaments per di datti il pli baud a partir dal di da l’annunzia, betg retroactivamain. S’annunziai perquai il pli tard l’emprim di, per il qual Vus pretendais pajaments per di, tar il RAV cumpetent, online sur arbeit.swiss u persunalmain (art. 10 e 17 LACI).',
          'Gia durant il termin da disdetga stuais Vus tschertgar ina nova plazza e documentar Voss sforzs. Sch’els mancan u na tanschan betg, datti dis da suspensiun, quai vul dir dis senza pajament per di (art. 17 e 30 LACI).',
          'Suenter l’annunzia cumenza il pajament per di per regla pir suenter in pèr dis da spetga; quants dependa da l’entrada da fin qua e d’obligaziuns da mantegniment envers uffants (art. 18 LACI).',
        ],
      },
      {
        titel: 'Il pajament per di remplazza ina part da la paja',
        absaetze: [
          'Il pajament per di sa drizza tenor il <strong>gudogn assicurà</strong>, quai vul dir la paja da fin qua fin ad in maximum legal (art. 23 LACI). Pajada vegn ina part da quel; la part è pli auta, sche Vus avais obligaziuns da mantegniment envers uffants, avevas ina paja bassa u retschavais ina renta d’invaliditad (art. 22 LACI).',
          'Quants pajaments per di ch’i dat il pli, dependa dal temp da contribuziun e da la vegliadetgna; els vegnan pajads entaifer in termin da basa (art. 9 e 27 LACI). Nus na numnain qua intenziunadamain ni las quotas ni ils dumbers maximals. Vossa cassa da dischoccupaziun als calcula en moda obligatorica.',
          'Sco da la paja vegnan deducidas era dal pajament per di contribuziuns, per exempel per l’AVS (art. 22a LACI). El è entrada da substituziun e vegn taglià sco la paja (art. 23 lit. a LIFD).',
        ],
      },
      {
        titel: 'Gudogn intermediar e lavur supportabla',
        absaetze: [
          'Sche Vus gudagnais insatge durant la dischoccupaziun, vala quai sco gudogn intermediar. Sch’el è pli bass che Voss gudogn assicurà, cumpensescha la cassa da dischoccupaziun ina part da la differenza; ensemen survegnis Vus uschia per il solit dapli ch’il pajament per di sulet (art. 24 LACI).',
          'Per princip stuais Vus acceptar mintga lavur supportabla. Betg supportabla è ina plazza per exempel, sch’ella na correspunda betg a las cundiziuns usitadas dal lieu e da la professiun, n’è betg adequata a Vossa vegliadetgna, a Vossas relaziuns persunalas u a Vossa sanadad, u pretenda in viadi da lavur fitg lung (art. 16 LACI).',
          'Tgi che refusa ina plazza supportabla u disdi sez la plazza senza motiv impurtant, vegn suspendì: tenor la culpa na datti durant in tschert temp nagin pajament per di (art. 30 LACI). Laschai Vus cussegliar avant che disdir sez.',
        ],
      },
      {
        titel: 'Cura ch’ils pajaments per di èn consumads',
        absaetze: [
          'Exclus è tgi ch’ha retratg tut ils pajaments per di u il termin da basa dal qual è scadì, senza ch’in nov possia vegnir avert. L’intermediaziun publica da lavur resta averta e gratuita (art. 26 e 27 LSE). Tgi che rimna puspè avunda temp da contribuziun po acquistar in nov dretg (art. 9 e 13 LACI).',
          'Suenter pon l’agid social e la reducziun individuala da premi entrar en dumonda. Tgi che vegn exclus a partir da sessanta onns po survegnir sut ulteriuras premissas prestaziuns transitoricas; quellas s’annunzia ins tar il post da PC dal chantun da domicil (art. 3, 5 e 19 LPtra).',
          'Cun l’ultim pajament per di finescha, suenter ina curta cuvrida supplementara, era l’assicuranza cunter accidents tras l’assicuranza cunter la dischoccupaziun. Communitgai a temp a la cassa da malsauns ch’ella stoppia puspè cuvrir accidents (art. 3 al. 2 LAA, art. 8 LAMal). Scleriai tar la cassa da cumpensaziun AVS, sche Vus stuais pajar contribuziuns sco persuna senza activitad da gudogn, per evitar ina largia da contribuziun (art. 10 LAVS).',
        ],
      },
    ],
    faq: [
      {
        frage: 'Survegn jau pajaments per di, sche jau hai disdì sez?',
        antwort:
          'Per princip gea, sche las autras premissas èn ademplidas. Tgi che disdi senza garanzia d’ina nova plazza vegn dentant per regla suspendì e na survegn durant in tschert temp nagin pajament per di. Excepziun fa tgi che na pudeva betg raschunaivlamain restar en la plazza (art. 30 LACI, art. 44 OACI). Laschai Vus cussegliar ordavant.',
      },
      {
        frage: 'Poss jau m’annunziar gia avant la fin da la plazza?',
        antwort:
          'Gea, e quai è raschunaivel. Il pli tard stuais Vus s’annunziar l’emprim di, per il qual Vus pretendais pajaments per di (art. 17 LACI). Sforzs da tschertgar lavur vegnan pretendids gia per il temp dal termin da disdetga.',
      },
      {
        frage: 'Sun jau assicurà cunter accidents durant la dischoccupaziun?',
        antwort:
          'Gea, uschè ditg che Vus retschavais pajaments per di, essas Vus assicurà cunter accidents tras l’assicuranza cunter la dischoccupaziun (art. 1a LAA). Suenter finescha questa cuvrida suenter ina curta cuvrida supplementara, e la cassa da malsauns surpiglia accidents, sche Vus al communitgais quai.',
      },
      {
        frage: 'Tge capita cun mia cassa da pensiun?',
        antwort:
          'Cun la sortida daventa l’avair exigibel e va sin in conto da libra circulaziun, fin che Vus avais ina nova plazza. Uschè ditg che Vus retschavais pajaments per di, restais Vus assicurà en la prevenziun professiunala per ils ristgs mort ed invaliditad (art. 2 al. 3 LPP). Per la vegliadetgna na spargnais Vus betg durant quest temp.',
      },
      {
        frage: 'Dastg jau ir en vacanzas durant la dischoccupaziun?',
        antwort:
          'Gea, en mesira limitada: Vus avais dretg sin dis senza controlla, che Vus stuais annunziar ordavant al RAV (art. 27 OACI). Quants che Vus avais, di Voss RAV.',
      },
    ],
    quellen: ['arbeitSwiss'],
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
      // TODO(rm): provisorisch — Gegenlese (Satz «verbindliche Fassung» neu, 28.09.2026)
      'Questa pagina vala per malojaplana.ch e per las paginas explicativas publicas. Per l’applicaziun sezza vala ultra da quai la decleraziun detagliada davart la protecziun da datas, che stat en l’applicaziun sut «Protecziun da datas e chaussas giuridicas» — era ella senza code d’access. Liantas èn las versiuns publitgadas: questa pagina per malojaplana.ch e las paginas explicativas, il text en l’applicaziun per l’applicaziun. Las versiuns da lavur en il code da funtauna public (docs/legal) èn sbozs e cumprova da l’origin, betg la versiun lianta.',
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
          // TODO(rm): provisorisch deutsch (13.11.2026) — rm-Fassung nannte «nagins scripts», stimmt nicht für Startseite und /krankenkasse/bewegt/; Übersetzung offen
          '<span lang="de">Die Erklärseiten sind statisches HTML. Sie laden <strong>keine Cookies und keine Ressourcen von Dritten</strong>; die Schriften liegen auf demselben Server. Die Startseite lädt zusätzlich eigene kleine Skripte vom selben Server: eines leitet alte App-Adressen nach /app/ weiter, eines bewegt die Bilder der Reise. Wer die App früher unter der Hauptadresse benutzt hat, erhält beim nächsten Besuch einer dieser Seiten einmal ein drittes: Es leert den alten Zwischenspeicher der App im Browser, meldet sich danach selbst ab und lädt die Seite einmal neu; Ihre Angaben auf dem Gerät fasst es nicht an. Auch die bewegten Seiten zur Krankenkasse (unter /krankenkasse/bewegt/) laden Skripte vom selben Server; sie zeichnen die bewegten Figuren. Diese Skripte setzen keine Cookies und senden keine Daten. Es gibt kein Tracking, keine Analyse und keine Werbung.</span>',
          'Cun la consultaziun resultan tuttina datas tecnicas tar l’hoster — <strong>Infomaniak Network SA</strong>, Rue Eugène-Marziano 25, 1227 Les Acacias / Genevra, cun center da calcul en Svizra: adressa IP en ils protocols dal server, tip da navigatur, sistem operativ e mument da l’access. Quai è tecnicamain necessari per la furniziun e per la segirezza da la gestiun. Infomaniak agescha en quest connex sco incumbensada da l’elavuraziun (art. 9 nLPD). Tenor l’indicaziun dal purschider vegnan ils protocols d’access e d’errur conservads almain 7 dis (Infomaniak Support-FAQ 1926, consultada ils 23 da settember 2026).',
          'Ulteriurs destinaturs n’existan betg: nagins servetschs d’analisa, nagina integraziun da medias socialas, nagina transmissiun e nagina vendita da datas.',
        ],
      },
      {
        titel: 'Contact per e-mail',
        absaetze: [
          'Sche Vus scrivais a <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>, elavurain nus Vossa adressa, il cuntegn dal messadi ed eventualas agiuntas per pudair respunder. La chascha da posta sa chatta tar Infomaniak en Svizra. La correspondenza resta uschè ditg sco la dumonda e las dumondas consuetas da suandar quai pretendan, lura vegn ella stizzada. Ella na vegn betg transmessa a terzas persunas, nun ch’il dretg pretenda quai.',
          '<strong>Glista da spetga:</strong> Sche Vus ans scrivais per vegnir sin la glista da spetga, conservain nus Voss messadi e Vossa adressa dad e-mail mo per quest intent. Nus Vus scrivain il pli duas giadas: cura che la beta finescha e, sche quai capita, cura che Maloja Plana cumpara en l’App Store. Silsuenter stizzain nus il messadi e l’adressa, il pli tard ils 31 da december 2027, er sch’i na dat fin lura nagina versiun per l’App Store. Sin giavisch als stizzain nus immediatamain; ina resposta cun «abmelden» basta. Nus na duvrain l’adressa per nagut auter, er betg per in newsletter.',
        ],
      },
      {
        titel: 'Datas en l’applicaziun',
        absaetze: [
          'Quai che Vus registrai en Maloja Plana resta <strong>sin Voss apparat</strong> (localStorage, IndexedDB e, per datotecas partidas, il cache dal navigatur). I na dat nagin conto, nagina annunzia e nagina transmissiun a la purschidra u a terzas persunas. Tgi che vul stizzar las datas, las stizza sin l’apparat — i n’exista nagina segunda copia autrunda.',
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
