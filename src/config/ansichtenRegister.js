// ─── Register der Ansichten ───────────────────────────────────────────────────
// EINE Zuordnung Ansicht → Beschriftung → Piktogramm, für alle, die sie brauchen:
// die Suche, das Menü und die Querverweise in den Kapiteln.
//
// Warum eigenes Blatt: es gab zwei Listen — diese hier und `allTools` in
// MobileNav.jsx. Sie waren sich bei FÜNF von sechzehn gemeinsamen Werkzeugen
// uneinig, welches Piktogramm gilt (Lebenslauf, IPV, Sozialhilfe, Budget-Sync,
// Tresor). Im Menü stand jeweils der generische Rückfall, in der Suche das
// passende Zeichen — dasselbe Werkzeug sah an zwei Orten anders aus. Eine
// Korrektur wirkte immer nur an einer Stelle (21.09.2026).
//
// Matcht gegen die bereits übersetzten nav-Labels (kein Extra-i18n pro Eintrag)
// + ein paar sprachneutrale Abkürzungs-Aliase, damit z.B. „ipv"/„ahv" greifen.

// ─── Die geführten Abläufe (Lebensereignisse) ────────────────────────────────
// EINE Liste für das Dashboard (Gruppe «Lebensereignisse») UND die Suche.
// Befund 24.09.2026: das Dashboard führte 19 Abläufe, die Suche fand davon einen
// (Asyl). Wer «Heirat», «Umzug» oder «Todesfall» eintippte, bekam nichts — die
// Liste im Dashboard war von Hand gepflegt, die Suche wusste nichts von ihr.
// Reihenfolge = Reihenfolge im Dashboard. `nav` ist der Label-Key; zwei Abläufe
// tragen ihren Titel statt eines nav-Keys, wie das Dashboard es schon tat.
export const ABLAEUFE = [
  { view: 'kkerst', nav: 'nav.kkerst', sub: 'nav.sub.kkerst', icon: 'insurance', aliases: ['krankenkasse', 'grundversicherung', 'neu in der schweiz', 'caisse maladie', 'cassa malati', 'health insurance'] },
  { view: 'kvgwechsel', nav: 'kvgWechsel.title', sub: 'nav.sub.kvgwechsel', icon: 'insurance', aliases: ['krankenkasse', 'wechsel', 'kündigung', 'grundversicherung', 'changer de caisse', 'cambiare cassa'] },
  { view: 'zusatzwechsel', nav: 'zusatzWechsel.title', sub: 'nav.sub.zusatzwechsel', icon: 'insurance', aliases: ['zusatzversicherung', 'vvg', 'kündigung', 'complémentaire', 'complementare'] },
  { view: 'neuerjob', nav: 'nav.neuerjob', sub: 'nav.sub.neuerjob', icon: 'lebenslauf', aliases: ['job', 'stelle', 'arbeitsvertrag', 'erste stelle', 'emploi', 'lavoro'] },
  { view: 'stelleverloren', nav: 'nav.stelleverloren', sub: 'nav.sub.stelleverloren', icon: 'lebenslauf', aliases: ['kündigung', 'arbeitslos', 'rav', 'chômage', 'disoccupazione', 'unemployed'] },
  { view: 'unfallkrankheit', nav: 'nav.unfallkrankheit', sub: 'nav.sub.unfallkrankheit', icon: 'notfall', aliases: ['unfall', 'krank', 'uvg', 'taggeld', 'arbeitsunfähig', 'accident', 'infortunio'] },
  { view: 'umzug', nav: 'nav.umzug', sub: 'nav.sub.umzug', icon: 'home', aliases: ['umzug', 'zügeln', 'adresse', 'anmelden', 'déménagement', 'trasloco', 'moving'] },
  { view: 'pensionierung', nav: 'nav.pensionierung', sub: 'nav.sub.pensionierung', icon: 'vorsorge', aliases: ['pension', 'rente', 'ruhestand', 'ahv', 'retraite', 'pensione', 'retirement'] },
  { view: 'betreibung', nav: 'nav.betreibung', sub: 'nav.sub.betreibung', icon: 'behoerden', aliases: ['betreibung', 'zahlungsbefehl', 'rechtsvorschlag', 'poursuite', 'esecuzione'] },
  { view: 'selbstaendigkeit', nav: 'nav.selbstaendigkeit', sub: 'nav.sub.selbstaendigkeit', icon: 'lebenslauf', aliases: ['selbständig', 'selbstständig', 'firma', 'gründen', 'indépendant', 'indipendente', 'self-employed'] },
  { view: 'heirat', nav: 'nav.heirat', sub: 'nav.sub.heirat', icon: 'heart', aliases: ['heirat', 'hochzeit', 'ehe', 'partnerschaft', 'mariage', 'matrimonio', 'marriage'] },
  { view: 'kind', nav: 'nav.kind', sub: 'nav.sub.kind', icon: 'family', aliases: ['kind', 'geburt', 'baby', 'kinderzulage', 'naissance', 'nascita', 'birth'] },
  { view: 'trennung', nav: 'nav.trennung', sub: 'nav.sub.trennung', icon: 'family', aliases: ['trennung', 'scheidung', 'séparation', 'divorce', 'separazione', 'divorzio'] },
  { view: 'bewilligung', nav: 'nav.bewilligung', sub: 'nav.sub.bewilligung', icon: 'behoerden', aliases: ['bewilligung', 'ausweis b', 'ausweis c', 'aufenthalt', 'permis', 'permesso', 'permit'] },
  { view: 'fuehrerausweis', nav: 'nav.fuehrerausweis', sub: 'nav.sub.fuehrerausweis', icon: 'behoerden', aliases: ['führerschein', 'fahrausweis', 'umtausch', 'permis de conduire', 'licenza di condurre', 'driving licence'] },
  { view: 'asyl', nav: 'nav.asyl', sub: 'nav.sub.asyl', icon: 'behoerden', aliases: ['asyl', 'asylum', 'flucht', 'migration'] },
  { view: 'iv', nav: 'nav.iv', sub: 'nav.sub.iv', icon: 'health', aliases: ['iv', 'invalidität', 'krankheit', 'ai', 'invalidité', 'invalidità'] },
  { view: 'pflege', nav: 'nav.pflege', sub: 'nav.sub.pflege', icon: 'heart', aliases: ['pflege', 'angehörige', 'betreuung', 'betreuungsgutschrift', 'proches aidants', 'familiari curanti'] },
  { view: 'wohnunggekuendigt', nav: 'nav.wohnunggekuendigt', sub: 'nav.sub.wohnunggekuendigt', icon: 'home', aliases: ['kündigung', 'wohnung', 'miete', 'vermieter', 'anfechten', 'erstreckung', 'schlichtung', 'résiliation', 'bail', 'disdetta', 'eviction'] },
  { view: 'quellensteuer', nav: 'nav.quellensteuer', sub: 'nav.sub.quellensteuer', icon: 'money', aliases: ['quellensteuer', 'tarifcode', 'lohnabzug', 'nov', 'nachträgliche veranlagung', 'impôt à la source', 'imposta alla fonte', 'withholding tax'] },
  { view: 'aussteuerung', nav: 'nav.aussteuerung', sub: 'nav.sub.aussteuerung', icon: 'lebenslauf', aliases: ['ausgesteuert', 'aussteuerung', 'arbeitslos', 'taggeld', 'überbrückungsleistung', 'fin de droits', 'esaurimento', 'benefits exhausted'] },
  { view: 'zuzug', nav: 'nav.zuzug', sub: 'nav.sub.zuzug', icon: 'behoerden', aliases: ['zuzug', 'einreise', 'ausland', 'neu in der schweiz', 'anmeldung', 'expat', 'arrivée', 'arrivo', 'moving to switzerland'] },
  { view: 'einbuergerung', nav: 'nav.einbuergerung', sub: 'nav.sub.einbuergerung', icon: 'behoerden', aliases: ['einbürgerung', 'einbuergerung', 'schweizer pass', 'bürgerrecht', 'naturalisation', 'naturalizzazione', 'citizenship'] },
  { view: 'vorsorgeauftrag', nav: 'nav.vorsorgeauftrag', sub: 'nav.sub.vorsorgeauftrag', icon: 'document', aliases: ['vorsorgeauftrag', 'patientenverfügung', 'urteilsunfähigkeit', 'kesb', 'mandat pour cause d’inaptitude', 'directives anticipées', 'mandato precauzionale', 'direttive del paziente', 'advance directive', 'power of attorney'] },
  { view: 'ergaenzungsleistungen', nav: 'nav.ergaenzungsleistungen', sub: 'nav.sub.ergaenzungsleistungen', icon: 'vorsorge', aliases: ['ergänzungsleistungen', 'el', 'el anmelden', 'prestations complémentaires', 'pc avs ai', 'prestazioni complementari', 'supplementary benefits', 'heimeintritt', 'vermögensschwelle'] },
  { view: 'zusammenziehen', nav: 'nav.zusammenziehen', sub: 'nav.sub.zusammenziehen', icon: 'home', aliases: ['zusammenziehen', 'konkubinat', 'ohne trauschein', 'konkubinatsvertrag', 'concubinage', 'vivre ensemble', 'concubinato', 'convivenza', 'cohabitation', 'moving in together'] },
  { view: 'adoption', nav: 'nav.adoption', sub: 'nav.sub.adoption', icon: 'family', aliases: ['adoption', 'adoptieren', 'stiefkindadoption', 'adoptionsurlaub', 'adopter', 'congé d’adoption', 'adozione', 'congedo di adozione', 'adopt'] },
  { view: 'wegzug', nav: 'nav.wegzug', sub: 'nav.sub.wegzug', icon: 'home', aliases: ['wegzug', 'auswandern', 'ausland', 'abmelden', 'freizügigkeit', 'barauszahlung', 'départ à l’étranger', 'partenza all’estero', 'moving abroad', 'emigrate'] },
  { view: 'ausweis', nav: 'nav.ausweis', sub: 'nav.sub.ausweis', icon: 'behoerden', aliases: ['pass', 'identitätskarte', 'ausweis', 'ausweis verloren', 'passeport', 'carte d’identité', 'passaporto', 'carta d’identità', 'passport', 'identity card'] },
  { view: 'betreibungsauszug', nav: 'nav.betreibungsauszug', sub: 'nav.sub.betreibungsauszug', icon: 'behoerden', aliases: ['betreibungsauszug', 'betreibungsregister', 'auszug', 'wohnungssuche', 'extrait des poursuites', 'estratto esecuzioni', 'debt enforcement extract', 'debt collection extract'] },
  { view: 'lehre', nav: 'nav.lehre', sub: 'nav.sub.lehre', icon: 'lebenslauf', aliases: ['lehre', 'lehrvertrag', 'lernende', 'erste stelle', 'apprentissage', 'contrat d’apprentissage', 'tirocinio', 'apprendistato', 'apprenticeship'] },
  { view: 'volljaehrig', nav: 'nav.volljaehrig', sub: 'nav.sub.volljaehrig', icon: 'heart', aliases: ['18 werden', 'volljährig', 'volljaehrig', 'volljährigkeit', 'majorité', '18 ans', 'maggiore età', '18 anni', 'turning 18', 'coming of age'] },
  { view: 'dienst', nav: 'nav.dienst', sub: 'nav.sub.dienst', icon: 'behoerden', aliases: ['militär', 'zivildienst', 'rekrutierung', 'wehrpflichtersatz', 'service militaire', 'service civil', 'servizio militare', 'servizio civile', 'military service', 'civilian service'] },
  { view: 'todesfall', nav: 'nav.todesfall', sub: 'nav.sub.todesfall', icon: 'document', aliases: ['todesfall', 'tod', 'gestorben', 'erbe', 'nachlass', 'décès', 'decesso', 'death'] },
];

export const SEARCH_VIEWS = [
  { view: 'merkliste', nav: 'nav.merkliste', sub: 'nav.sub.merkliste', icon: 'check', aliases: ['todo', 'merkliste'] },
  { view: 'calendar', nav: 'nav.calendar', sub: 'nav.sub.calendar', icon: 'calendar', aliases: ['ical', 'ics', 'termine'] },
  { view: 'premium', nav: 'nav.kvgIpv', sub: 'nav.sub.kvgIpv', icon: 'praemienverbilligung', aliases: ['ipv', 'pv'] },
  { view: 'praemien', nav: 'nav.praemien', sub: 'nav.sub.praemien', icon: 'insurance', aliases: ['praemien', 'kvg'] },
  { view: 'kvg', nav: 'nav.kvgLeistungen', sub: 'nav.sub.kvgLeistungen', icon: 'health', aliases: ['kvg', 'leistungen'] },
  { view: 'vorsorge', nav: 'nav.vorsorge', sub: 'nav.sub.vorsorge', icon: 'vorsorge', aliases: ['ahv', 'bvg', 'pension', '3a', 'avs'] },
  { view: 'eo', nav: 'nav.eo', sub: 'nav.sub.eo', icon: 'family', aliases: ['eo', 'mutterschaft', 'vaterschaft'] },
  { view: 'stipendien', nav: 'nav.stipendien', sub: 'nav.sub.stipendien', icon: 'ausbildung', aliases: ['stipendien', 'scholarship'] },
  { view: 'tax', nav: 'nav.taxes', sub: 'nav.sub.taxes', icon: 'money', aliases: ['steuer', 'tax', 'impot'] },
  { view: 'sozialhilfe', nav: 'nav.sozialhilfe', sub: 'nav.sub.sozialhilfe', icon: 'sozialhilfe', aliases: ['skos', 'sozialhilfe', 'aide sociale'] },
  { view: 'alv', nav: 'nav.alv', sub: 'nav.sub.alv', icon: 'family', aliases: ['alv', 'arbeitslos', 'rav'] },
  { view: 'direktlinks', nav: 'nav.direktlinks', sub: 'nav.sub.direktlinks', icon: 'dokumentTresor', aliases: ['links', 'behoerden', 'amt'] },
  { view: 'tresor', nav: 'nav.tresor', sub: 'nav.sub.tresor', icon: 'dokumentTresor', aliases: ['dokumente', 'documents', 'tresor'] },
  { view: 'cv', nav: 'nav.cv', sub: 'nav.sub.cv', icon: 'lebenslauf', aliases: ['cv', 'lebenslauf', 'resume'] },
  { view: 'unterlagen', nav: 'nav.unterlagen', sub: 'nav.sub.unterlagen', icon: 'documents', aliases: ['unterlagen', 'documents'] },
  { view: 'flyer', nav: 'nav.flyer', sub: 'nav.sub.flyer', icon: 'dokumentTresor', aliases: ['qr', 'teilen', 'share', 'flyer'] },
  // Bisher nicht auffindbar, obwohl über Dashboard/Menü erreichbar (Audit #17).
  // `sub` ist optional — nicht jedes Werkzeug hat einen Beschreibungs-Key.
  { view: 'finanzuebersicht', nav: 'nav.finanzUebersicht', icon: 'budget', aliases: ['finanzübersicht', 'übersicht', 'finanzen', 'overview'] },
  { view: 'sync', nav: 'nav.budgetSync', sub: 'nav.sub.budgetSync', icon: 'budgetWallet', aliases: ['budget', 'sync', 'ausgaben'] },
  { view: 'taxImport', nav: 'nav.taxImport', sub: 'nav.sub.taxImport', icon: 'document', aliases: ['steuerimport', 'import', 'steuererklärung'] },
  { view: 'kk', nav: 'nav.kkScanner', icon: 'barcode', aliases: ['kk', 'krankenkasse', 'scanner', 'qr', 'prämie'] },
  { view: 'budget', nav: 'nav.budget', icon: 'csv', aliases: ['budget', 'haushalt', 'ausgaben'] },
  { view: 'schulden', nav: 'nav.debts', icon: 'debt', aliases: ['schulden', 'betreibung', 'debt', 'abzahlung'] },
  { view: 'organ', nav: 'nav.organDonation', icon: 'health', aliases: ['organspende', 'spende', 'organ', 'donation'] },
  { view: 'charts', nav: 'nav.charts', icon: 'chartsSchoko', aliases: ['charts', 'diagramme', 'statistik', 'grafik'] },
  { view: 'export', nav: 'nav.export', icon: 'download', aliases: ['export', 'sicherung', 'backup', 'datensicherung'] },
  { view: 'notifications', nav: 'nav.notifications', icon: 'cowbell', aliases: ['benachrichtigungen', 'erinnerungen', 'notifications'] },
  // Der Weg auf den Startbildschirm. Muss auffindbar sein, weil ihn ausserhalb
  // von Chromium kein Banner von selbst anbietet — wer auf dem iPhone danach
  // sucht, sucht mit genau diesen Wörtern.
  // Die geführten Abläufe — aus der einen Liste oben, nicht von Hand wiederholt.
  ...ABLAEUFE,
  { view: 'installApp', nav: 'nav.installApp', sub: 'nav.sub.installApp', icon: 'download', aliases: ['install', 'installieren', 'app', 'pwa', 'homescreen', 'startbildschirm', 'herunterladen', 'download'] },
];

// Piktogramm einer Ansicht — mit Rückfall, damit ein unbekannter Schlüssel
// nichts umwirft.
export const ansichtIkon = (view, rueckfall = 'document') => {
  const e = SEARCH_VIEWS.find((v) => v.view === view);
  return (e && e.icon) || rueckfall;
};
