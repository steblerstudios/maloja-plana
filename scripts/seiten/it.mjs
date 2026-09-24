// ─── Italienische Fassung der öffentlichen Erklärseiten ──────────────────────
//
// Übersetzung des deutschen Originals in `scripts/seiten-inhalt.mjs`.
// 🛑 NICHT von einem Menschen gegengelesen — `freigegeben: false`.
//
// ─── TERMINOLOGIE (aus `src/i18n/it.js`, nicht neu erfunden) ────────────────
//   Prämienverbilligung  → riduzione individuale dei premi (RIP)
//   Sozialhilfe          → aiuto sociale
//   Ergänzungsleistungen → prestazioni complementari (PC)
//   SKOS                 → COSAS
//   Veranlagung          → tassazione    · Verfügung → decisione
//   Steuerfuss           → moltiplicatore d’imposta · einfache Steuer → imposta semplice
//   KVG → LAMal · DBG → LIFD · UWG → LCSl · DSG → LPD
//
// 🛑 Struktur und Absatzzahl folgen dem Original eins zu eins — siehe fr.mjs.
// ─────────────────────────────────────────────────────────────────────────────

export const SEITEN = [
  // ─── Pillar ───────────────────────────────────────────────────────────────
  {
    pfad: 'was-steht-mir-zu',
    titel: 'A che cosa ho diritto? Una panoramica per la Svizzera',
    beschreibung:
      'In Svizzera il sostegno è ripartito tra Confederazione, Cantoni e Comuni — molto resta inutilizzato perché non se ne conosce l’esistenza. Una panoramica, tema per tema.',
    brotkrume: 'A che cosa ho diritto?',
    vorspann:
      'In Svizzera il sostegno non proviene da un’unica cassa, ma da molte piccole — ripartite tra Confederazione, Cantoni e Comuni. Chi ha diritto a che cosa dipende quindi fortemente dal luogo di domicilio. Il motivo più frequente per cui le prestazioni non vengono riscosse non è la mancanza di un diritto. È il non sapere che esistono.',
    abschnitte: [
      {
        titel: 'Tre livelli che non si coordinano',
        absaetze: [
          'La <strong>Confederazione</strong> fissa spesso soltanto il quadro: prescrive che una prestazione debba esistere e ne lascia la configurazione ai Cantoni. Vale ad esempio per la riduzione dei premi.',
          'I <strong>Cantoni</strong> riempiono questo quadro — con limiti propri, moduli propri, termini propri. Due economie domestiche con cifre identiche possono essere trattate diversamente in due Cantoni. Non è un difetto del sistema, è il sistema.',
          'I <strong>Comuni</strong> eseguono in diversi ambiti quanto il Cantone decide — nell’aiuto sociale sono spesso l’interlocutore con cui si ha effettivamente a che fare.',
          'In pratica: non esiste una risposta generale alla domanda «ne ho diritto?». Esiste solo la risposta per il suo luogo di domicilio, la sua situazione e il suo anno.',
        ],
      },
      {
        titel: 'I temi nel dettaglio',
        absaetze: [
          'Tre ambiti riguardano la maggior parte delle persone, e per tutti e tre vale la pena dare un’occhiata anche quando si pensa di non essere interessati:',
        ],
        verweise: ['praemienverbilligung', 'sozialhilfe', 'steuern'],
      },
      {
        titel: 'Perché tanto rimane inutilizzato',
        absaetze: [
          'Un diritto di cui nessuno è a conoscenza non viene fatto valere. Vi si aggiungono ostacoli che con il diritto stesso non hanno nulla a che fare: moduli in una lingua che occorre prima imparare. Termini che da nessuna parte figurano insieme. Il timore di sbagliare. E l’idea diffusa che il sostegno sia una cosa per altri.',
          'Nulla di tutto ciò cambia qualcosa al diritto. Ma tutto ciò fa sì che non venga fatto valere.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Come faccio a sapere a che cosa ho diritto?',
        antwort:
          'La via più affidabile passa dal servizio che decide effettivamente — quindi dal proprio Cantone, rispettivamente dal proprio Comune. Calcolatori e panoramiche come quelli qui collegati danno un primo orientamento sull’opportunità di una domanda. Fa sempre fede soltanto la decisione del servizio competente.',
      },
      {
        frage: 'Perché è diverso a seconda del Cantone?',
        antwort:
          'Perché per molte prestazioni la Confederazione fissa deliberatamente soltanto il quadro e i Cantoni lo riempiono. Essi stabiliscono limiti di reddito, procedure e termini propri. Un trasloco oltre il confine cantonale può quindi modificare il diritto, anche se nient’altro è cambiato.',
      },
      {
        frage: 'Devo presentare ovunque una domanda io stesso?',
        antwort:
          'Varia a seconda della prestazione e del Cantone. Per alcune prestazioni i servizi si annunciano spontaneamente, per altre senza domanda non succede nulla. Nel dubbio vale: informarsi non costa nulla, e una domanda non presentata non viene mai accolta.',
      },
      {
        frage: 'Quanto costa Maloja Plana?',
        antwort:
          'Nulla. Maloja Plana è gratuito e open source. Non c’è alcun account, alcuna pubblicità e alcun tracciamento; tutti i dati restano sul proprio dispositivo.',
      },
    ],
    quellen: ['bwoKantone', 'bsvEL', 'ahvMerkblatt'],
  },

  // ─── Riduzione dei premi ──────────────────────────────────────────────────
  {
    pfad: 'praemienverbilligung',
    titel: 'Riduzione dei premi: chi ne ha diritto',
    beschreibung:
      'La riduzione individuale dei premi (RIP) è un contributo al premio della cassa malati. La Confederazione fissa il quadro, i Cantoni decidono — che cosa significa per lei.',
    brotkrume: 'Riduzione dei premi',
    vorspann:
      'La riduzione individuale dei premi — spesso abbreviata RIP — è un contributo dell’ente pubblico al premio dell’assicurazione malattie. È prevista dalla legge sull’assicurazione malattie (LAMal), ma la Confederazione non la esegue: lo fanno i Cantoni, ciascuno secondo regole proprie.',
    abschnitte: [
      {
        titel: 'Che cosa prescrive la Confederazione e che cosa decide il Cantone',
        absaetze: [
          'La Confederazione prescrive <em>che</em> una riduzione dei premi debba esistere e partecipa al suo finanziamento. Chi la riceve e in quale misura lo decide il Cantone.',
          'Concretamente, da Cantone a Cantone differiscono: i limiti di reddito e di sostanza, il modo stesso in cui il reddito determinante viene calcolato, il fatto di dover presentare una domanda oppure di essere contattati, e i termini.',
          'Ovunque uguale è invece <strong>dove va il denaro</strong>: il Cantone versa il contributo direttamente alla cassa malati, non alla persona assicurata. Ciò figura nella LAMal e non rientra nel margine di manovra cantonale.',
          'Per questo la frase «da noi si riceve qualcosa a partire da un reddito di X» porta raramente lontano. Vale al massimo per un Cantone, e anche lì soltanto per un anno.',
        ],
      },
      {
        titel: 'Quali cifre contano',
        absaetze: [
          'Di regola i Cantoni si basano sui dati fiscali — e spesso non su quelli dell’anno in corso, bensì su una tassazione anteriore già cresciuta in giudicato. Ciò ha una conseguenza che sorprende: chi quest’anno guadagna nettamente meno non lo vede riflesso da sé in molti Cantoni — altri ne tengono conto soltanto con il conteggio definitivo successivo.',
          'Diversi Cantoni conoscono per questi casi una procedura propria, nella quale un cambiamento essenziale delle condizioni viene considerato a posteriori. Se e come, lo indica il servizio competente — per lo più la cassa cantonale di compensazione o l’istituto cantonale delle assicurazioni sociali, in singoli Cantoni però l’amministrazione delle contribuzioni o il Comune di domicilio.',
        ],
      },
      {
        titel: 'L’equivoco più frequente',
        absaetze: [
          'Molti presumono che con un reddito da attività lucrativa in linea di principio non si riceva nulla. Non è così: la riduzione dei premi non è una prestazione riservata a chi non lavora. Famiglie con figli, persone in formazione ed economie domestiche con reddito medio vi rientrano in molti Cantoni.',
          'Il secondo equivoco frequente è che una domanda respinta una volta valga per sempre. Vale per il suo anno. Se cambiano reddito, economia domestica o Cantone di domicilio, è una nuova questione.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Ho diritto alla riduzione dei premi?',
        antwort:
          'Dipende dal Cantone di domicilio, dal reddito e dalla sostanza determinanti e dalla grandezza dell’economia domestica — tutti e tre ponderati diversamente a seconda del Cantone. Non esiste un limite valido ovunque. Decide in modo vincolante il servizio competente: per lo più la cassa cantonale di compensazione o l’istituto cantonale delle assicurazioni sociali, in singoli Cantoni l’amministrazione delle contribuzioni o il Comune di domicilio.',
      },
      {
        frage: 'Devo presentare una domanda?',
        antwort:
          'In alcuni Cantoni gli aventi diritto vengono contattati d’ufficio, in altri la domanda va presentata da sé. Poiché la materia è disciplinata a livello cantonale e può cambiare, vale la pena informarsi presso il proprio servizio cantonale — anche se in un anno precedente si è già ricevuto qualcosa.',
      },
      {
        frage: 'Quale reddito viene calcolato?',
        antwort:
          'Di regola un reddito derivato dalla tassazione fiscale, spesso di un anno anteriore, e spesso con aggiunte e deduzioni cantonali. Il reddito lordo del mese in corso non è quasi mai la cifra determinante.',
      },
      {
        frage: 'E se il mio reddito è fortemente diminuito?',
        antwort:
          'Allora vale la pena informarsi in modo particolare. Diversi Cantoni considerano, su richiesta, un cambiamento essenziale delle condizioni economiche, anche se la tassazione alla base indica ancora un reddito più elevato.',
      },
    ],
    quellen: ['priminfo'],
  },

  // ─── Aiuto sociale ────────────────────────────────────────────────────────
  {
    pfad: 'sozialhilfe',
    titel: 'L’aiuto sociale in Svizzera — un orientamento',
    beschreibung:
      'Chi decide sull’aiuto sociale, di che cosa si compone e perché le direttive COSAS non sono automaticamente legge. Un inquadramento senza cifre.',
    brotkrume: 'Aiuto sociale',
    vorspann:
      'L’aiuto sociale è il gradino più basso della rete svizzera — interviene là dove tutto il resto non basta o non basta più. Competenti non sono la Confederazione, bensì i Cantoni e, in molti di essi, i Comuni.',
    abschnitte: [
      {
        titel: 'Sussidiario significa: prima tutto il resto',
        absaetze: [
          'L’aiuto sociale è <strong>sussidiario</strong>. Prima che entri in considerazione vengono esaminati altri diritti: salario, indennità di disoccupazione, rendite, prestazioni complementari, riduzione dei premi, contributi di mantenimento, borse di studio. Viene considerata anche la sostanza propria, per la quale i Cantoni conoscono una franchigia il cui importo differisce.',
          'È il motivo per cui un’iscrizione comincia spesso con molte domande su prestazioni del tutto diverse. Non si tratta di sfiducia, bensì dell’ordine previsto dalla legge.',
        ],
      },
      {
        titel: 'Le direttive COSAS sono raccomandazioni, non legge',
        absaetze: [
          'È il punto più spesso trascurato. Le direttive della Conferenza svizzera delle istituzioni dell’azione sociale (COSAS) sono <strong>raccomandazioni</strong>. Diventano vincolanti soltanto nella misura in cui un Cantone le recepisce nel proprio diritto — e i Cantoni lo fanno in misura diversa.',
          'In pratica significa: un calcolatore COSAS dà un buon primo orientamento, ma non è una promessa. Ciò che vale nel suo caso figura nella legge cantonale sull’aiuto sociale e nella decisione del servizio competente.',
        ],
      },
      {
        titel: 'Di che cosa si compone tipicamente il sostegno',
        absaetze: [
          'Nella maggior parte dei Cantoni si tratta di tre elementi: un <strong>fabbisogno di base</strong> per il sostentamento, le <strong>spese di alloggio</strong> nei limiti usuali del luogo, e le <strong>cure mediche di base</strong>. Vi si possono aggiungere prestazioni circostanziali.',
          'Gli importi non li indichiamo qui deliberatamente: differiscono a seconda del Cantone e della grandezza dell’economia domestica e vengono adeguati regolarmente. Una cifra su una pagina come questa sarebbe errata dopo poco tempo.',
        ],
      },
      {
        titel: 'Il diritto che nessuno può perdere',
        absaetze: [
          'Indipendentemente da tutto quanto precede, la <strong>Costituzione federale, articolo 12</strong>, sancisce il diritto all’aiuto in situazioni di bisogno: chi è nel bisogno e non è in grado di provvedere a sé stesso ha diritto d’essere aiutato e assistito e di ricevere i mezzi indispensabili per un’esistenza dignitosa.',
          'Questo diritto spetta a ogni persona in Svizzera. Non è la stessa cosa dell’aiuto sociale e copre meno — ma è il limite inferiore al di sotto del quale non si può scendere.',
        ],
      },
    ],
    faq: [
      {
        frage: 'A quanto aiuto sociale ho diritto?',
        antwort:
          'Si misura in base al luogo di domicilio, alla grandezza dell’economia domestica, al reddito, alla sostanza e alle spese effettive di alloggio e di salute — e segue il diritto cantonale. Non esiste una cifra valida ovunque. Un orientamento provvisorio lo danno i calcolatori di aiuto sociale; fa fede la decisione del servizio competente.',
      },
      {
        frage: 'Le direttive COSAS sono legge?',
        antwort:
          'No. Sono raccomandazioni della Conferenza svizzera delle istituzioni dell’azione sociale. Sono vincolanti soltanto nella misura in cui un Cantone le ha recepite nel proprio diritto. Per questo una stessa situazione può essere valutata diversamente a seconda del Cantone.',
      },
      {
        frage: 'Devo prima esaurire la mia sostanza?',
        antwort:
          'La sostanza viene computata, ma non integralmente: i Cantoni conoscono una franchigia che non viene toccata. Il suo importo differisce a seconda del Cantone e dell’economia domestica. Il servizio competente effettua il calcolo nel singolo caso.',
      },
      {
        frage: 'Qual è la differenza rispetto alle prestazioni complementari?',
        antwort:
          'Le prestazioni complementari (PC) appartengono al primo pilastro ed entrano di regola in considerazione quando una prestazione dell’AVS o dell’AI non copre il fabbisogno vitale. Sono disciplinate dal diritto federale e non sono aiuto sociale. Un diritto alle PC prevale sull’aiuto sociale.',
      },
    ],
    quellen: ['skosRechner', 'bsvEL', 'bwoKantone'],
  },

  // ─── Imposte ──────────────────────────────────────────────────────────────
  {
    pfad: 'steuern',
    titel: 'Le imposte in Svizzera: Confederazione, Cantone, Comune',
    beschreibung:
      'Perché lo stesso salario viene tassato in modo molto diverso a seconda del luogo di domicilio — i tre livelli, il moltiplicatore d’imposta e che cosa significa in pratica.',
    brotkrume: 'Imposte',
    vorspann:
      'Chi in Svizzera paga l’imposta sul reddito la paga di regola contemporaneamente in tre punti: alla Confederazione, al Cantone e al Comune. Solo il primo è uguale ovunque. Gli altri due sono il motivo per cui lo stesso salario porta, in due luoghi di domicilio, a conteggi sensibilmente diversi.',
    abschnitte: [
      {
        titel: 'L’imposta federale diretta è ovunque la stessa',
        absaetze: [
          'L’imposta federale diretta si fonda sulla legge federale sull’imposta federale diretta (LIFD) e conosce per tutta la Svizzera la stessa tariffa. Distingue secondo lo stato civile e l’economia domestica, ma non secondo il luogo di domicilio.',
          'Viene tuttavia riscossa dal Cantone — la dichiarazione d’imposta è la stessa.',
        ],
      },
      {
        titel: 'Cantone e Comune: tariffa per moltiplicatore',
        absaetze: [
          'A livello cantonale e comunale si combinano due grandezze. La <strong>tariffa</strong> stabilisce quanta imposta un determinato reddito imponibile genera — ne risulta la cosiddetta imposta semplice. Il <strong>moltiplicatore d’imposta</strong> è un fattore applicato a quest’ultima, per lo più indicato in percentuale, che Cantone e Comune fissano ciascuno per sé e possono adeguare ogni anno.',
          'A seconda del Cantone e della confessione, sul conteggio figurano ulteriori voci, ad esempio l’imposta di culto o un’imposta personale. Sono per lo più modeste, ma spiegano perché la somma non corrisponde esattamente a quanto indica un semplice calcolatore del reddito.',
          'Due Comuni dello stesso Cantone hanno quindi la stessa tariffa, ma ciascuno il proprio moltiplicatore — che può differire. Due Cantoni hanno entrambi diversi. È questa la vera leva dietro i noti confronti intercantonali. In singoli Cantoni vi sono inoltre particolarità, ad esempio Comuni senza imposta comunale propria.',
        ],
      },
      {
        titel: 'Che cosa viene dedotto dal reddito',
        absaetze: [
          'Non viene tassato il salario, bensì il <strong>reddito imponibile</strong> — ossia ciò che resta dopo le deduzioni ammesse. Ne fanno parte, a seconda della situazione, le spese professionali, i contributi al pilastro 3a, le spese di malattia oltre una soglia, le deduzioni per figli e per la loro custodia e altre ancora.',
          'Quali deduzioni siano ammesse e in quale misura differisce tra Confederazione e Cantone e tra i Cantoni. È proprio qui che si perde di più — non per indicazioni errate, bensì per deduzioni che nessuno ha iscritto.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Perché pago diversamente da qualcuno del Cantone vicino?',
        antwort:
          'Perché il Cantone stabilisce la tariffa e Cantone e Comune decidono ciascuno il proprio moltiplicatore d’imposta. Solo l’imposta federale diretta è uguale ovunque. Lo stesso salario può così portare a conteggi nettamente diversi a seconda del luogo di domicilio.',
      },
      {
        frage: 'Che cos’è il moltiplicatore d’imposta?',
        antwort:
          'Un fattore applicato all’imposta semplice, per lo più indicato in percentuale, che Cantone e Comune decidono ciascuno per sé. La tariffa dice quanto ammonta l’imposta semplice; il moltiplicatore dice con quale fattore essa viene riscossa. I due insieme danno l’imposta cantonale e comunale.',
      },
      {
        frage: 'Quali deduzioni posso fare?',
        antwort:
          'Dipende dalla situazione e dal Cantone — frequenti sono le spese professionali, i contributi al pilastro 3a, le spese di malattia e infortunio oltre una soglia nonché le deduzioni per figli e per la loro custodia. Importi e presupposti differiscono tra Confederazione e Cantone; fanno fede le istruzioni del proprio Cantone.',
      },
      {
        frage: 'Dove posso calcolare in modo vincolante?',
        antwort:
          'Fa fede da ultimo la tassazione dell’amministrazione cantonale delle contribuzioni. Per un calcolo previsionale attendibile l’Amministrazione federale delle contribuzioni mette a disposizione un calcolatore che tiene conto di Confederazione, Cantone e Comune.',
      },
    ],
    quellen: ['estvRechner'],
  },
];

export const SONDERSEITEN = [
  {
    pfad: 'rechtliches',
    titel: 'Colofone, protezione dei dati ed esclusione di responsabilità',
    beschreibung:
      'Chi sta dietro Maloja Plana, quali dati vengono raccolti alla consultazione di queste pagine e per che cosa i calcolatori espressamente non rispondono.',
    brotkrume: 'Note legali',
    vorspann:
      'Questa pagina vale per malojaplana.ch e per le pagine esplicative pubbliche. Per l’applicazione stessa vale inoltre l’informativa dettagliata sulla protezione dei dati, che figura nell’applicazione sotto «Protezione dei dati e note legali» — anch’essa senza codice d’accesso.',
    abschnitte: [
      {
        titel: 'Fornitrice',
        absaetze: [
          'Sophie Stebler / Stebler Studios<br>Basilea, Svizzera<br>E-mail: <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>',
          'Maloja Plana — raccoglitore di vita svizzero. Un progetto open source sotto AGPL-3.0. L’utilizzo dell’applicazione è gratuito; per il white label e altri usi commerciali è disponibile su richiesta una licenza separata.',
          'Sull’indirizzo di contatto: l’<a href="https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/it#art_3" rel="noopener">art. 3 cpv. 1 lett. s n. 1 LCSl</a> esige indicazioni sull’identità e sull’indirizzo di contatto «compreso quello della posta elettronica». Nome, luogo ed e-mail sono indicati; se sia dovuto in aggiunta un indirizzo postale è in fase di chiarimento. Tramite e-mail siamo raggiungibili per ogni richiesta, anche giuridica.',
        ],
      },
      {
        titel: 'Esclusione di responsabilità',
        absaetze: [
          'Maloja Plana è uno <strong>strumento di orientamento</strong>. I calcolatori e le panoramiche si basano su fonti giuridiche accessibili al pubblico e servono esclusivamente all’informazione personale.',
          '<strong>Maloja Plana non sostituisce alcuna consulenza giuridica, fiscale, assicurativa o finanziaria.</strong>',
          'La fornitrice non assume alcuna garanzia per l’esattezza, la completezza o l’attualità dei calcoli, per l’idoneità dei risultati a decisioni individuali, né per i danni derivanti dal loro utilizzo. Fanno fede esclusivamente le leggi vigenti e le autorità competenti.',
        ],
      },
      {
        titel: 'Protezione dei dati su queste pagine',
        absaetze: [
          'Le pagine esplicative sono HTML statico. Non caricano <strong>alcuno script, alcun cookie e alcuna risorsa di terzi</strong>; i caratteri si trovano sullo stesso server. Non vi è alcun tracciamento, alcuna analisi e alcuna pubblicità.',
          'Alla consultazione vengono comunque raccolti dati tecnici presso l’hoster — <strong>Infomaniak Network SA</strong>, Rue Eugène-Marziano 25, 1227 Les Acacias / Ginevra, con centri di calcolo in Svizzera: indirizzo IP nei registri del server, tipo di browser, sistema operativo e momento dell’accesso. Ciò è tecnicamente necessario per la fornitura e per la sicurezza dell’esercizio. Infomaniak agisce in tal senso quale responsabile del trattamento (art. 9 nLPD). Secondo le indicazioni del fornitore, i registri di accesso e di errore vengono conservati almeno 7 giorni (FAQ di supporto Infomaniak 1926, consultata il 23 settembre 2026).',
          'Non vi sono altri destinatari: nessun servizio di analisi, nessuna integrazione di social media, nessuna trasmissione e nessuna vendita di dati.',
        ],
      },
      {
        titel: 'Contatto via e-mail',
        absaetze: [
          'Se scrive a <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>, trattiamo il suo indirizzo, il contenuto del messaggio ed eventuali allegati per poter rispondere. La casella di posta si trova presso Infomaniak in Svizzera. La corrispondenza resta finché la richiesta e le consuete domande di chiarimento lo richiedono, poi viene cancellata. Non viene trasmessa a terzi, salvo obbligo di legge.',
        ],
      },
      {
        titel: 'Dati nell’applicazione',
        absaetze: [
          'Quanto lei registra in Maloja Plana resta <strong>sul suo dispositivo</strong> (localStorage e IndexedDB nel browser). Non vi è alcun account, alcuna registrazione e alcuna trasmissione alla fornitrice o a terzi. Chi vuole cancellare i dati li cancella sul dispositivo — non esiste una seconda copia altrove.',
          'Anche i dati degni di particolare protezione (salute, aiuto sociale, convinzioni) vengono memorizzati dall’applicazione solo localmente. Le copie di sicurezza automatiche nel browser non sono cifrate.',
          'Poiché nulla viene trasmesso, la fornitrice non può nemmeno fornire informazioni sulle sue immissioni: non le ha mai viste. La versione dettagliata con tutti i diritti secondo la LPD figura nell’applicazione sotto «Protezione dei dati e note legali».',
        ],
      },
      {
        titel: 'Proprietà intellettuale',
        absaetze: [
          'Il codice è sotto <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">AGPL-3.0</a>, consultabile su <a href="https://github.com/steblerstudios/maloja-plana" rel="noopener">GitHub</a>. «Maloja Plana» è una denominazione di progetto di Sophie Stebler. Per l’uso commerciale esiste un doppio regime di licenza — richieste all’indirizzo sopra indicato.',
        ],
      },
      {
        titel: 'Diritto applicabile',
        absaetze: [
          'Si applica il diritto svizzero. Il foro competente è Basilea Città, Svizzera.',
        ],
      },
    ],
    faq: [],
    quellen: [],
  },
];
