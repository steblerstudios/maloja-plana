// ─── Sprachen der öffentlichen Erklärseiten ──────────────────────────────────
//
// Die Seiten gab es bis zum 21.09.2026 nur auf Deutsch. Die App spricht fünf
// Sprachen; die Seiten davor sprachen eine. Das hier schliesst die Lücke.
//
// ─── WARUM ECHTE PFADE UND NICHT ?lang= ─────────────────────────────────────
// Die App hängt die Sprache an einen Query-Parameter (`?lang=fr`). Für die
// statischen Seiten geht das nicht: sie werden von Apache ausgeliefert, nicht
// von React — ein Query-Parameter ändert dort am ausgelieferten Byte nichts.
// Fünf Adressen mit byte-identischem Inhalt sind genau der Fehler, den das
// Audit vom 20.09. an der Sitemap gefunden hat. Darum echte Pfade:
//
//   Deutsch   /sozialhilfe/          (ohne Präfix — x-default, wie bisher)
//   Übrige    /fr/sozialhilfe/  …    (Präfix, Pfad-Slug bleibt deutsch)
//
// Der Slug bleibt bewusst deutsch. Übersetzte Slugs wären schöner, aber sie
// verdoppeln die Zahl der Adressen, die beim Umbenennen umgeleitet werden
// müssen — und eine Umleitung, die niemand pflegt, ist ein toter Link mit
// Verzögerung. Ändern kann man das später; unausgesprochen lassen nicht.
//
// ─── DIE SPERRE, DIE DIESE DATEI EIGENTLICH IST ─────────────────────────────
// 🛑 `freigegeben` steht für vier der fünf Sprachen auf `false`.
//
// Der Grund: ~2900 Wörter deutsches Original sind am 20.09. von zwei Prüfern
// gelesen worden, aber von keinem Menschen. Diese Übersetzungen sind es auch
// nicht — und sie behandeln Schweizer Sozial- und Steuerrecht in einer Sprache,
// in der niemand im Studio gegenlesen kann. Vier unfreigegebene Sprachen
// öffentlich zu stellen hiesse, den bestehenden Mangel zu vervierfachen.
//
// Solange `freigegeben: false` gilt, wird die Sprache:
//   · gebaut und ist unter ihrer Adresse erreichbar (zum Lesen und Prüfen),
//   · aber mit `noindex, follow` ausgeliefert,
//   · NICHT in die Sitemap aufgenommen,
//   · NICHT in den hreflang-Ringen der anderen Sprachen genannt.
//
// Eine Sprache geht frei, indem hier `freigegeben: true` gesetzt und `geprueft`
// auf den Monat gestellt wird, in dem ein Mensch sie gelesen hat. Nichts
// anderes ist zu tun — kein zweiter Ort, keine zweite Liste.
// ─────────────────────────────────────────────────────────────────────────────

export const SPRACHEN = [
  {
    code: 'de',
    htmlLang: 'de',
    ogLocale: 'de_CH',
    ldLang: 'de-CH',
    praefix: '',
    freigegeben: true,
    geprueft: 'September 2026', // Fach- + Rechtsprüfung 20.09.2026
  },
  {
    code: 'fr',
    htmlLang: 'fr',
    ogLocale: 'fr_CH',
    ldLang: 'fr-CH',
    praefix: 'fr/',
    freigegeben: false,
    geprueft: null,
  },
  {
    code: 'it',
    htmlLang: 'it',
    ogLocale: 'it_CH',
    ldLang: 'it-CH',
    praefix: 'it/',
    freigegeben: false,
    geprueft: null,
  },
  {
    code: 'en',
    htmlLang: 'en',
    ogLocale: 'en_GB',
    ldLang: 'en',
    praefix: 'en/',
    freigegeben: false,
    geprueft: null,
  },
  {
    code: 'rm',
    htmlLang: 'rm',
    ogLocale: 'rm_CH',
    ldLang: 'rm-CH',
    praefix: 'rm/',
    freigegeben: false,
    geprueft: null,
    // 🛑 Entscheid Stebler Studios, 21.09.2026: «rumantsch im oktober».
    // Damit ist rm NICHT dasselbe wie fr/it/en. Die drei warten auf eine
    // Gegenlesung, die im September noch kommen kann. Rumantsch wartet
    // bewusst auf den Oktober — dort kann im Studio niemand gegenlesen, und
    // auch kein Prüf-Agent hat eine belastbare Grundlage.
    // Nicht als Rückstand lesen: das ist ein Entscheid, keine offene Aufgabe.
    // Vgl. feedback_luecke_ist_kein_rueckstand.
    vertagtAuf: 'Oktober 2026',
  },
];

export const spracheNachCode = (code) => SPRACHEN.find((s) => s.code === code);
export const freigegebeneSprachen = () => SPRACHEN.filter((s) => s.freigegeben);

// ─── Rahmen-Texte ────────────────────────────────────────────────────────────
//
// Alles, was auf jeder Seite gleich steht: Kopf, Zwischentitel, Vorbehalte,
// Fusszeile. Stand bis zum 21.09.2026 fest im Generator und war damit deutsch
// verdrahtet.
//
// Der Ton folgt `maloja-writing-language`: ruhig, ohne Ausrufezeichen, ohne
// Werbeton, anrede-neutral wo die Sprache es zulässt. Französisch und
// Italienisch siezen (in der App dasselbe), Englisch kennt die Unterscheidung
// nicht, Rumantsch siezt.
// ─────────────────────────────────────────────────────────────────────────────

export const RAHMEN = {
  de: {
    krumeLabel: 'Sie sind hier',
    start: 'Start',
    faqTitel: 'Häufige Fragen',
    quellenTitel: 'Quellen und Rechner',
    weiterlesenTitel: 'Weiterlesen',
    kurzhinweis:
      'Orientierung, keine Rechts- oder Finanzberatung — massgebend ist die zuständige Stelle. ' +
      'Diese Seite nennt bewusst keine Beträge und Fristen.',
    karteTitel: 'Maloja Plana rechnet das für Ihre Situation durch.',
    karteText:
      'Ein Schweizer Lebensordner — Steuern, Prämienverbilligung, Sozialhilfe, Mindestlohn, ' +
      'Vorsorge und Notfallkarte an einem Ort. Alle Angaben bleiben auf Ihrem Gerät: kein Konto, ' +
      'keine Übermittlung an einen Server, kein Tracking. Kostenlos und quelloffen.',
    karteBeta:
      'Die App ist zurzeit in einer <strong>geschlossenen Beta</strong> und braucht einen ' +
      'Zugangscode. <strong>Ohne Code lässt sich ein Beispiel ansehen</strong> — mit erfundenen ' +
      'Daten, es wird nichts gespeichert.',
    karteKnopf: 'Beispiel ansehen — ohne Zugangscode',
    quellenLeise:
      'Maloja Plana steht mit diesen Stellen in keiner Verbindung. Die Verlinkung bedeutet keine ' +
      'Zusammenarbeit und keine Billigung. Nicht alle davon sind Behörden — die SKOS etwa ist ein ' +
      'Fachverband, ihre Richtlinien sind Empfehlungen.',
    nurDeutsch: 'nur auf Deutsch verfügbar',
    vorbehalt:
      'Diese Seite ist eine <strong>Orientierungshilfe auf Basis öffentlicher Informationen — ' +
      'keine Rechts- oder Finanzberatung</strong>. Sie nennt bewusst keine Beträge, Fristen oder ' +
      'Einkommensgrenzen: die sind kantonal verschieden und ändern regelmässig. Massgebend ist ' +
      'immer die Auskunft beziehungsweise die Verfügung der zuständigen Stelle.',
    geprueftLabel: 'Inhaltlich geprüft',
    rechtlichesLink: 'Impressum, Datenschutz und Haftungsausschluss',
    fussProjekt: 'Maloja Plana ist ein Projekt von Stebler Studios, Basel',
    fussQuelloffen: 'Quelloffen unter',
    fussQuellcode: 'Quellcode auf GitHub',
    fussOhneCode: 'ohne Zugangscode lesbar.',
    spracheLabel: 'Sprache',
    // Nur sichtbar, solange die Sprache nicht freigegeben ist.
    entwurfBanner: null,
  },

  fr: {
    krumeLabel: 'Vous êtes ici',
    start: 'Accueil',
    faqTitel: 'Questions fréquentes',
    quellenTitel: 'Sources et calculateurs',
    weiterlesenTitel: 'À lire également',
    kurzhinweis:
      'Une orientation, et non un conseil juridique ou financier — seul l’organe compétent fait foi. ' +
      'Cette page ne mentionne volontairement ni montants ni délais.',
    karteTitel: 'Maloja Plana fait le calcul pour votre situation.',
    karteText:
      'Un classeur de vie suisse — impôts, réduction des primes, aide sociale, salaire minimum, ' +
      'prévoyance et carte d’urgence au même endroit. Toutes les données restent sur votre appareil : ' +
      'pas de compte, aucune transmission à un serveur, aucun traçage. Gratuit et à code source ouvert.',
    karteBeta:
      'L’application est actuellement en <strong>bêta fermée</strong> et nécessite un code d’accès. ' +
      '<strong>Un exemple est consultable sans code</strong> — avec des données fictives, rien n’est ' +
      'enregistré.',
    karteKnopf: 'Voir l’exemple — sans code d’accès',
    quellenLeise:
      'Maloja Plana n’a aucun lien avec ces organismes. Le lien hypertexte n’implique ni collaboration ' +
      'ni approbation. Tous ne sont pas des autorités — la CSIAS, par exemple, est une association ' +
      'professionnelle ; ses normes sont des recommandations.',
    nurDeutsch: 'disponible uniquement en allemand',
    vorbehalt:
      'Cette page est une <strong>aide à l’orientation fondée sur des informations publiques — ni ' +
      'conseil juridique ni conseil financier</strong>. Elle ne mentionne volontairement ni montants, ' +
      'ni délais, ni limites de revenu : ceux-ci varient d’un canton à l’autre et changent ' +
      'régulièrement. Seuls le renseignement ou la décision de l’organe compétent font foi.',
    geprueftLabel: 'Contenu vérifié',
    rechtlichesLink: 'Mentions légales, protection des données et clause de non-responsabilité',
    fussProjekt: 'Maloja Plana est un projet de Stebler Studios, Bâle',
    fussQuelloffen: 'Code source ouvert sous',
    fussQuellcode: 'Code source sur GitHub',
    fussOhneCode: 'consultable sans code d’accès.',
    spracheLabel: 'Langue',
    entwurfBanner:
      'Cette traduction n’a pas encore été relue par une personne. Le texte allemand fait foi.',
  },

  it: {
    krumeLabel: 'Si trova qui',
    start: 'Inizio',
    faqTitel: 'Domande frequenti',
    quellenTitel: 'Fonti e calcolatori',
    weiterlesenTitel: 'Da leggere anche',
    kurzhinweis:
      'Un orientamento, non una consulenza giuridica o finanziaria — fa fede il servizio competente. ' +
      'Questa pagina non indica deliberatamente né importi né termini.',
    karteTitel: 'Maloja Plana esegue il calcolo per la sua situazione.',
    karteText:
      'Un raccoglitore di vita svizzero — imposte, riduzione dei premi, aiuto sociale, salario minimo, ' +
      'previdenza e carta d’emergenza in un unico posto. Tutti i dati restano sul suo dispositivo: ' +
      'nessun account, nessuna trasmissione a un server, nessun tracciamento. Gratuito e open source.',
    karteBeta:
      'L’applicazione è attualmente in <strong>beta chiusa</strong> e richiede un codice d’accesso. ' +
      '<strong>Senza codice è possibile consultare un esempio</strong> — con dati fittizi, non viene ' +
      'salvato nulla.',
    karteKnopf: 'Guardare l’esempio — senza codice d’accesso',
    quellenLeise:
      'Maloja Plana non ha alcun legame con questi enti. Il collegamento non implica collaborazione ' +
      'né approvazione. Non tutti sono autorità — la COSAS, ad esempio, è un’associazione di settore; ' +
      'le sue direttive sono raccomandazioni.',
    nurDeutsch: 'disponibile solo in tedesco',
    vorbehalt:
      'Questa pagina è un <strong>ausilio all’orientamento basato su informazioni pubbliche — non è ' +
      'una consulenza giuridica né finanziaria</strong>. Non indica deliberatamente importi, termini ' +
      'o limiti di reddito: variano da cantone a cantone e cambiano regolarmente. Fanno fede sempre ' +
      'l’informazione o la decisione del servizio competente.',
    geprueftLabel: 'Contenuto verificato',
    rechtlichesLink: 'Colofone, protezione dei dati ed esclusione di responsabilità',
    fussProjekt: 'Maloja Plana è un progetto di Stebler Studios, Basilea',
    fussQuelloffen: 'Open source con licenza',
    fussQuellcode: 'Codice sorgente su GitHub',
    fussOhneCode: 'consultabile senza codice d’accesso.',
    spracheLabel: 'Lingua',
    entwurfBanner:
      'Questa traduzione non è ancora stata riletta da una persona. Fa fede il testo tedesco.',
  },

  en: {
    krumeLabel: 'You are here',
    start: 'Home',
    faqTitel: 'Frequently asked questions',
    quellenTitel: 'Sources and calculators',
    weiterlesenTitel: 'Further reading',
    kurzhinweis:
      'Orientation, not legal or financial advice — the competent authority is what counts. ' +
      'This page deliberately gives no amounts and no deadlines.',
    karteTitel: 'Maloja Plana works this out for your situation.',
    karteText:
      'A Swiss life folder — taxes, premium reduction, social assistance, minimum wage, pension ' +
      'provision and emergency card in one place. Everything stays on your device: no account, ' +
      'nothing sent to a server, no tracking. Free and open source.',
    karteBeta:
      'The app is currently in a <strong>closed beta</strong> and needs an access code. ' +
      '<strong>An example can be viewed without a code</strong> — with invented data; nothing is saved.',
    karteKnopf: 'View the example — no access code',
    quellenLeise:
      'Maloja Plana has no connection with these organisations. Linking to them implies neither ' +
      'cooperation nor endorsement. Not all of them are authorities — SKOS, for instance, is a ' +
      'professional association, and its guidelines are recommendations.',
    nurDeutsch: 'available in German only',
    vorbehalt:
      'This page is <strong>orientation based on public information — not legal or financial ' +
      'advice</strong>. It deliberately gives no amounts, deadlines or income limits: these differ ' +
      'from canton to canton and change regularly. What counts is always the information or the ' +
      'ruling of the competent authority.',
    geprueftLabel: 'Content reviewed',
    rechtlichesLink: 'Legal notice, data protection and disclaimer',
    fussProjekt: 'Maloja Plana is a project by Stebler Studios, Basel',
    fussQuelloffen: 'Open source under',
    fussQuellcode: 'Source code on GitHub',
    fussOhneCode: 'readable without an access code.',
    spracheLabel: 'Language',
    entwurfBanner:
      'This translation has not yet been read by a person. The German text is authoritative.',
  },

  rm: {
    krumeLabel: 'Vus essas qua',
    start: 'Entrada',
    faqTitel: 'Dumondas frequentas',
    quellenTitel: 'Funtaunas e calculaturs',
    weiterlesenTitel: 'Leger vinavant',
    kurzhinweis:
      'In’orientaziun, betg ina cussegliaziun giuridica u finanziala — decisiv è il post cumpetent. ' +
      'Questa pagina numna a posta nagins imports e nagins termins.',
    karteTitel: 'Maloja Plana calculescha quai per Vossa situaziun.',
    karteText:
      'In classeur da vita svizzer — taglias, reducziun da premi, agid social, salari minimal, ' +
      'prevenziun e carta d’urgenza en in lieu. Tut las indicaziuns restan sin Voss apparat: nagin ' +
      'conto, nagina transmissiun ad in server, nagin traçar. Gratuit e da funtauna averta.',
    karteBeta:
      'L’applicaziun è actualmain en ina <strong>beta serrada</strong> e dovra in code d’access. ' +
      '<strong>Senza code sa laschar guardar in exempel</strong> — cun datas inventadas, i na vegn ' +
      'memorisà nagut.',
    karteKnopf: 'Guardar l’exempel — senza code d’access',
    quellenLeise:
      'Maloja Plana n’ha nagina relaziun cun quests posts. Il link na munta ni collavuraziun ni ' +
      'approvaziun. Betg tuts èn autoritads — la SKOS per exempel è ina associaziun professiunala, ' +
      'sias directivas èn recumandaziuns.',
    nurDeutsch: 'disponibel mo per tudestg',
    vorbehalt:
      'Questa pagina è in <strong>agid d’orientaziun sin fundament d’infurmaziuns publicas — betg ' +
      'ina cussegliaziun giuridica u finanziala</strong>. Ella numna a posta nagins imports, nagins ' +
      'termins e nagins limits d’entrada: quels differeschan da chantun a chantun e midan ' +
      'regularmain. Decisiv è adina l’infurmaziun respectivamain la disposiziun dal post cumpetent.',
    geprueftLabel: 'Cuntegn verifitgà',
    rechtlichesLink: 'Impressum, protecziun da datas e exclusiun da responsabladad',
    fussProjekt: 'Maloja Plana è in project da Stebler Studios, Basilea',
    fussQuelloffen: 'Da funtauna averta sut',
    fussQuellcode: 'Code da funtauna sin GitHub',
    fussOhneCode: 'legibel senza code d’access.',
    spracheLabel: 'Lingua',
    entwurfBanner:
      'Questa translaziun n’è anc betg vegnida legida d’ina persuna. Decisiv è il text tudestg.',
  },
};

// Eigenbezeichnung für den Sprachumschalter — immer in der eigenen Sprache,
// nie übersetzt («Deutsch», nicht «allemand»).
export const SPRACHNAME = {
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  en: 'English',
  rm: 'Rumantsch',
};
