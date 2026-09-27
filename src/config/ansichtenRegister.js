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

import { SUCHBARE_WERKZEUGE } from '../data/werkzeugRegister.js';

// ─── Die geführten Abläufe (Lebensereignisse) ────────────────────────────────
// EINE Liste für das Dashboard (Gruppe «Lebensereignisse») UND die Suche.
// Befund 24.09.2026: das Dashboard führte 19 Abläufe, die Suche fand davon einen
// (Asyl). Wer «Heirat», «Umzug» oder «Todesfall» eintippte, bekam nichts — die
// Liste im Dashboard war von Hand gepflegt, die Suche wusste nichts von ihr.
// Reihenfolge = Reihenfolge im Dashboard. `nav` ist der Label-Key; zwei Abläufe
// tragen ihren Titel statt eines nav-Keys, wie das Dashboard es schon tat.
// `bereich`: der Lebensbereich (data/lebensbereiche.js), in dessen Farbe der Ablauf steht —
// Balken oben und Zeichen im Kopf (Entscheid Stebler Studios 27.09.2026, Probe).
export const ABLAEUFE = [
  { view: 'kkerst', bereich: 'versicherungen', nav: 'nav.kkerst', sub: 'nav.sub.kkerst', icon: 'insurance', aliases: ['krankenkasse', 'grundversicherung', 'neu in der schweiz', 'caisse maladie', 'cassa malati', 'health insurance'] },
  { view: 'kvgwechsel', bereich: 'versicherungen', nav: 'kvgWechsel.title', sub: 'nav.sub.kvgwechsel', icon: 'insurance', aliases: ['krankenkasse', 'wechsel', 'kündigung', 'grundversicherung', 'changer de caisse', 'cambiare cassa'] },
  { view: 'zusatzwechsel', bereich: 'versicherungen', nav: 'zusatzWechsel.title', sub: 'nav.sub.zusatzwechsel', icon: 'insurance', aliases: ['zusatzversicherung', 'vvg', 'kündigung', 'complémentaire', 'complementare'] },
  { view: 'neuerjob', bereich: 'arbeit', nav: 'nav.neuerjob', sub: 'nav.sub.neuerjob', icon: 'lebenslauf', aliases: ['job', 'stelle', 'arbeitsvertrag', 'erste stelle', 'emploi', 'lavoro'] },
  { view: 'stelleverloren', bereich: 'arbeit', nav: 'nav.stelleverloren', sub: 'nav.sub.stelleverloren', icon: 'lebenslauf', aliases: ['kündigung', 'arbeitslos', 'rav', 'chômage', 'disoccupazione', 'unemployed'] },
  { view: 'unfallkrankheit', bereich: 'gesundheit', nav: 'nav.unfallkrankheit', sub: 'nav.sub.unfallkrankheit', icon: 'notfall', aliases: ['unfall', 'krank', 'uvg', 'taggeld', 'arbeitsunfähig', 'accident', 'infortunio'] },
  { view: 'umzug', bereich: 'wohnen', nav: 'nav.umzug', sub: 'nav.sub.umzug', icon: 'home', aliases: ['umzug', 'zügeln', 'adresse', 'anmelden', 'déménagement', 'trasloco', 'moving'] },
  { view: 'pensionierung', bereich: 'vorsorge', nav: 'nav.pensionierung', sub: 'nav.sub.pensionierung', icon: 'vorsorge', aliases: ['pension', 'rente', 'ruhestand', 'ahv', 'retraite', 'pensione', 'retirement'] },
  { view: 'mahnung', bereich: 'finanzen', nav: 'nav.mahnung', sub: 'nav.sub.mahnung', icon: 'money', aliases: ['mahnung', 'zahlungserinnerung', 'rechnung', 'offene rechnung', 'inkasso', 'verzugszins', 'ratenzahlung', 'rappel', 'sommation', 'sollecito', 'diffida', 'reminder', 'overdue'] },
  { view: 'betreibung', bereich: 'finanzen', nav: 'nav.betreibung', sub: 'nav.sub.betreibung', icon: 'behoerden', aliases: ['betreibung', 'zahlungsbefehl', 'rechtsvorschlag', 'poursuite', 'esecuzione'] },
  { view: 'selbstaendigkeit', bereich: 'arbeit', nav: 'nav.selbstaendigkeit', sub: 'nav.sub.selbstaendigkeit', icon: 'lebenslauf', aliases: ['selbständig', 'selbstständig', 'firma', 'gründen', 'indépendant', 'indipendente', 'self-employed'] },
  { view: 'heirat', bereich: 'familie', nav: 'nav.heirat', sub: 'nav.sub.heirat', icon: 'heart', aliases: ['heirat', 'hochzeit', 'ehe', 'partnerschaft', 'mariage', 'matrimonio', 'marriage'] },
  { view: 'kind', bereich: 'familie', nav: 'nav.kind', sub: 'nav.sub.kind', icon: 'family', aliases: ['kind', 'geburt', 'baby', 'kinderzulage', 'naissance', 'nascita', 'birth'] },
  { view: 'trennung', bereich: 'familie', nav: 'nav.trennung', sub: 'nav.sub.trennung', icon: 'family', aliases: ['trennung', 'scheidung', 'séparation', 'divorce', 'separazione', 'divorzio'] },
  { view: 'bewilligung', bereich: 'behoerden', nav: 'nav.bewilligung', sub: 'nav.sub.bewilligung', icon: 'behoerden', aliases: ['bewilligung', 'ausweis b', 'ausweis c', 'aufenthalt', 'permis', 'permesso', 'permit'] },
  { view: 'fuehrerausweis', bereich: 'behoerden', nav: 'nav.fuehrerausweis', sub: 'nav.sub.fuehrerausweis', icon: 'behoerden', aliases: ['führerschein', 'fahrausweis', 'umtausch', 'permis de conduire', 'licenza di condurre', 'driving licence'] },
  { view: 'asyl', bereich: 'behoerden', nav: 'nav.asyl', sub: 'nav.sub.asyl', icon: 'behoerden', aliases: ['asyl', 'asylum', 'flucht', 'migration'] },
  { view: 'iv', bereich: 'gesundheit', nav: 'nav.iv', sub: 'nav.sub.iv', icon: 'health', aliases: ['iv', 'invalidität', 'krankheit', 'ai', 'invalidité', 'invalidità'] },
  { view: 'pflege', bereich: 'gesundheit', nav: 'nav.pflege', sub: 'nav.sub.pflege', icon: 'heart', aliases: ['pflege', 'angehörige', 'betreuung', 'betreuungsgutschrift', 'proches aidants', 'familiari curanti'] },
  { view: 'wohnunggekuendigt', bereich: 'wohnen', nav: 'nav.wohnunggekuendigt', sub: 'nav.sub.wohnunggekuendigt', icon: 'home', aliases: ['kündigung', 'wohnung', 'miete', 'vermieter', 'anfechten', 'erstreckung', 'schlichtung', 'résiliation', 'bail', 'disdetta', 'eviction'] },
  { view: 'quellensteuer', bereich: 'finanzen', nav: 'nav.quellensteuer', sub: 'nav.sub.quellensteuer', icon: 'money', aliases: ['quellensteuer', 'tarifcode', 'lohnabzug', 'nov', 'nachträgliche veranlagung', 'impôt à la source', 'imposta alla fonte', 'withholding tax'] },
  { view: 'aussteuerung', bereich: 'arbeit', nav: 'nav.aussteuerung', sub: 'nav.sub.aussteuerung', icon: 'lebenslauf', aliases: ['ausgesteuert', 'aussteuerung', 'arbeitslos', 'taggeld', 'überbrückungsleistung', 'fin de droits', 'esaurimento', 'benefits exhausted'] },
  { view: 'zuzug', bereich: 'behoerden', nav: 'nav.zuzug', sub: 'nav.sub.zuzug', icon: 'behoerden', aliases: ['zuzug', 'einreise', 'ausland', 'neu in der schweiz', 'anmeldung', 'expat', 'arrivée', 'arrivo', 'moving to switzerland'] },
  { view: 'einbuergerung', bereich: 'behoerden', nav: 'nav.einbuergerung', sub: 'nav.sub.einbuergerung', icon: 'behoerden', aliases: ['einbürgerung', 'einbuergerung', 'schweizer pass', 'bürgerrecht', 'naturalisation', 'naturalizzazione', 'citizenship'] },
  { view: 'vorsorgeauftrag', bereich: 'vorsorge', nav: 'nav.vorsorgeauftrag', sub: 'nav.sub.vorsorgeauftrag', icon: 'document', aliases: ['vorsorgeauftrag', 'patientenverfügung', 'urteilsunfähigkeit', 'kesb', 'mandat pour cause d’inaptitude', 'directives anticipées', 'mandato precauzionale', 'direttive del paziente', 'advance directive', 'power of attorney'] },
  { view: 'ergaenzungsleistungen', bereich: 'vorsorge', nav: 'nav.ergaenzungsleistungen', sub: 'nav.sub.ergaenzungsleistungen', icon: 'vorsorge', aliases: ['ergänzungsleistungen', 'el', 'el anmelden', 'prestations complémentaires', 'pc avs ai', 'prestazioni complementari', 'supplementary benefits', 'heimeintritt', 'vermögensschwelle'] },
  { view: 'zusammenziehen', bereich: 'wohnen', nav: 'nav.zusammenziehen', sub: 'nav.sub.zusammenziehen', icon: 'home', aliases: ['zusammenziehen', 'konkubinat', 'ohne trauschein', 'konkubinatsvertrag', 'concubinage', 'vivre ensemble', 'concubinato', 'convivenza', 'cohabitation', 'moving in together'] },
  { view: 'adoption', bereich: 'familie', nav: 'nav.adoption', sub: 'nav.sub.adoption', icon: 'family', aliases: ['adoption', 'adoptieren', 'stiefkindadoption', 'adoptionsurlaub', 'adopter', 'congé d’adoption', 'adozione', 'congedo di adozione', 'adopt'] },
  { view: 'wegzug', bereich: 'behoerden', nav: 'nav.wegzug', sub: 'nav.sub.wegzug', icon: 'home', aliases: ['wegzug', 'auswandern', 'ausland', 'abmelden', 'freizügigkeit', 'barauszahlung', 'départ à l’étranger', 'partenza all’estero', 'moving abroad', 'emigrate'] },
  { view: 'ausweis', bereich: 'behoerden', nav: 'nav.ausweis', sub: 'nav.sub.ausweis', icon: 'behoerden', aliases: ['pass', 'identitätskarte', 'ausweis', 'ausweis verloren', 'passeport', 'carte d’identité', 'passaporto', 'carta d’identità', 'passport', 'identity card'] },
  { view: 'betreibungsauszug', bereich: 'finanzen', nav: 'nav.betreibungsauszug', sub: 'nav.sub.betreibungsauszug', icon: 'behoerden', aliases: ['betreibungsauszug', 'betreibungsregister', 'auszug', 'wohnungssuche', 'extrait des poursuites', 'estratto esecuzioni', 'debt enforcement extract', 'debt collection extract'] },
  { view: 'lehre', bereich: 'arbeit', nav: 'nav.lehre', sub: 'nav.sub.lehre', icon: 'lebenslauf', aliases: ['lehre', 'lehrvertrag', 'lernende', 'erste stelle', 'apprentissage', 'contrat d’apprentissage', 'tirocinio', 'apprendistato', 'apprenticeship'] },
  { view: 'volljaehrig', bereich: 'person', nav: 'nav.volljaehrig', sub: 'nav.sub.volljaehrig', icon: 'heart', aliases: ['18 werden', 'volljährig', 'volljaehrig', 'volljährigkeit', 'majorité', '18 ans', 'maggiore età', '18 anni', 'turning 18', 'coming of age'] },
  { view: 'dienst', bereich: 'behoerden', nav: 'nav.dienst', sub: 'nav.sub.dienst', icon: 'behoerden', aliases: ['militär', 'zivildienst', 'rekrutierung', 'wehrpflichtersatz', 'service militaire', 'service civil', 'servizio militare', 'servizio civile', 'military service', 'civilian service'] },
  { view: 'todesfall', bereich: 'familie', nav: 'nav.todesfall', sub: 'nav.sub.todesfall', icon: 'document', aliases: ['todesfall', 'tod', 'gestorben', 'erbe', 'nachlass', 'décès', 'decesso', 'death'] },
];

export const SEARCH_VIEWS = [
  // Alle Werkzeuge — aus dem einen Werkzeug-Register (data/werkzeugRegister.js,
  // Vorschau 27.09.2026). Vorher standen sie hier ein zweites Mal von Hand.
  ...SUCHBARE_WERKZEUGE,
  // Zwei Wege aus dem Gepäck, die kein geführter Ablauf sind — nur ihre Suchwörter
  // stehen hier; ihr Platz im Rucksack steht in data/gepaeck.js.
  { view: 'stipendien', nav: 'nav.stipendien', sub: 'nav.sub.stipendien', icon: 'ausbildung', aliases: ['stipendien', 'scholarship'] },
  { view: 'organ', nav: 'nav.organDonation', icon: 'health', aliases: ['organspende', 'spende', 'organ', 'donation'] },
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

// Lebensbereich eines Ablaufs — oder null.
export const ablaufBereich = (view) => {
  const a = ABLAEUFE.find((x) => x.view === view);
  return (a && a.bereich) || null;
};
