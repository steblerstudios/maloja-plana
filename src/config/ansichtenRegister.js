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
import { WERKZEUGE } from '../data/werkzeugRegister.js';
import { astKapitel } from '../data/lebensbereiche.js';

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
  { view: 'kkerst', bereich: 'versicherungen', nav: 'nav.kkerst', sub: 'nav.sub.kkerst', icon: 'ereignisKkerst', aliases: ['krankenkasse', 'grundversicherung', 'neu in der schweiz', 'caisse maladie', 'cassa malati', 'health insurance'] },
  // F7-A5 (27.10.2026): ein Ablauf für Grund- und Zusatzversicherung; `#/zusatzwechsel` ist eine Umleitung hierher.
  { view: 'kvgwechsel', bereich: 'versicherungen', nav: 'kvgWechsel.title', sub: 'nav.sub.kvgwechsel', icon: 'ereignisKkwechsel', aliases: ['krankenkasse', 'wechsel', 'kündigung', 'grundversicherung', 'changer de caisse', 'cambiare cassa', 'zusatzversicherung', 'vvg', 'complémentaire', 'complementare'] },
  { view: 'neuerjob', bereich: 'arbeit', nav: 'nav.neuerjob', sub: 'nav.sub.neuerjob', icon: 'ereignisJob', aliases: ['job', 'stelle', 'arbeitsvertrag', 'erste stelle', 'emploi', 'lavoro'] },
  { view: 'stelleverloren', bereich: 'arbeit', nav: 'nav.stelleverloren', sub: 'nav.sub.stelleverloren', icon: 'ereignisStelleweg', aliases: ['kündigung', 'arbeitslos', 'rav', 'chômage', 'disoccupazione', 'unemployed'] },
  { view: 'unfallkrankheit', bereich: 'gesundheit', nav: 'nav.unfallkrankheit', sub: 'nav.sub.unfallkrankheit', icon: 'ereignisUnfall', aliases: ['unfall', 'krank', 'uvg', 'taggeld', 'arbeitsunfähig', 'accident', 'infortunio'] },
  { view: 'umzug', bereich: 'wohnen', nav: 'nav.umzug', sub: 'nav.sub.umzug', icon: 'ereignisUmzug', aliases: ['umzug', 'zügeln', 'adresse', 'anmelden', 'déménagement', 'trasloco', 'moving'] },
  { view: 'pensionierung', bereich: 'vorsorge', nav: 'nav.pensionierung', sub: 'nav.sub.pensionierung', icon: 'ereignisPension', aliases: ['pension', 'rente', 'ruhestand', 'ahv', 'retraite', 'pensione', 'retirement'] },
  { view: 'mahnung', bereich: 'finanzen', nav: 'nav.mahnung', sub: 'nav.sub.mahnung', icon: 'ereignisMahnung', aliases: ['mahnung', 'zahlungserinnerung', 'rechnung', 'offene rechnung', 'inkasso', 'verzugszins', 'ratenzahlung', 'rappel', 'sommation', 'sollecito', 'diffida', 'reminder', 'overdue'] },
  // F7-A10 (27.10.2026): vorher Schritt 6 von «Mahnung erhalten».
  { view: 'selbstmahnen', bereich: 'finanzen', nav: 'selbstMahnen.title', sub: 'nav.sub.selbstmahnen', icon: 'ereignisSelbstmahnen', aliases: ['mahnen', 'schuldet mir', 'geld zurück', 'verzugszins', 'in verzug setzen', 'schuldner', 'mettre en demeure', 'débiteur', 'costituire in mora', 'debitore', 'owes me money', 'debtor'] },
  { view: 'betreibung', bereich: 'finanzen', nav: 'nav.betreibung', sub: 'nav.sub.betreibung', icon: 'ereignisBetreibung', aliases: ['betreibung', 'zahlungsbefehl', 'rechtsvorschlag', 'poursuite', 'esecuzione'] },
  { view: 'selbstaendigkeit', bereich: 'arbeit', nav: 'nav.selbstaendigkeit', sub: 'nav.sub.selbstaendigkeit', icon: 'ereignisSelbst', aliases: ['selbständig', 'selbstständig', 'firma', 'gründen', 'indépendant', 'indipendente', 'self-employed'] },
  { view: 'heirat', bereich: 'familie', nav: 'nav.heirat', sub: 'nav.sub.heirat', icon: 'ereignisHeirat', aliases: ['heirat', 'hochzeit', 'ehe', 'partnerschaft', 'mariage', 'matrimonio', 'marriage'] },
  { view: 'kind', bereich: 'familie', nav: 'nav.kind', sub: 'nav.sub.kind', icon: 'ereignisGeburt', aliases: ['kind', 'geburt', 'baby', 'kinderzulage', 'naissance', 'nascita', 'birth'] },
  { view: 'trennung', bereich: 'familie', nav: 'nav.trennung', sub: 'nav.sub.trennung', icon: 'ereignisTrennung', aliases: ['trennung', 'scheidung', 'séparation', 'divorce', 'separazione', 'divorzio'] },
  { view: 'bewilligung', bereich: 'behoerden', nav: 'nav.bewilligung', sub: 'nav.sub.bewilligung', icon: 'ereignisBewilligung', aliases: ['bewilligung', 'ausweis b', 'ausweis c', 'aufenthalt', 'permis', 'permesso', 'permit'] },
  { view: 'fuehrerausweis', bereich: 'behoerden', nav: 'nav.fuehrerausweis', sub: 'nav.sub.fuehrerausweis', icon: 'ereignisFuehrerausweis', aliases: ['führerschein', 'fahrausweis', 'umtausch', 'permis de conduire', 'licenza di condurre', 'driving licence'] },
  { view: 'asyl', bereich: 'behoerden', nav: 'nav.asyl', sub: 'nav.sub.asyl', icon: 'ereignisAsyl', aliases: ['asyl', 'asylum', 'flucht', 'migration'] },
  { view: 'iv', bereich: 'gesundheit', nav: 'nav.iv', sub: 'nav.sub.iv', icon: 'ereignisIv', aliases: ['iv', 'invalidität', 'krankheit', 'ai', 'invalidité', 'invalidità'] },
  { view: 'pflege', bereich: 'gesundheit', nav: 'nav.pflege', sub: 'nav.sub.pflege', icon: 'ereignisPflege', aliases: ['pflege', 'angehörige', 'betreuung', 'betreuungsgutschrift', 'proches aidants', 'familiari curanti'] },
  { view: 'wohnunggekuendigt', bereich: 'wohnen', nav: 'nav.wohnunggekuendigt', sub: 'nav.sub.wohnunggekuendigt', icon: 'ereignisWohnunggekuendigt', aliases: ['kündigung', 'wohnung', 'miete', 'vermieter', 'anfechten', 'erstreckung', 'schlichtung', 'résiliation', 'bail', 'disdetta', 'eviction'] },
  { view: 'quellensteuer', bereich: 'finanzen', nav: 'nav.quellensteuer', sub: 'nav.sub.quellensteuer', icon: 'ereignisQuellensteuer', aliases: ['quellensteuer', 'tarifcode', 'lohnabzug', 'nov', 'nachträgliche veranlagung', 'impôt à la source', 'imposta alla fonte', 'withholding tax'] },
  { view: 'aussteuerung', bereich: 'arbeit', nav: 'nav.aussteuerung', sub: 'nav.sub.aussteuerung', icon: 'lebenslauf', aliases: ['ausgesteuert', 'aussteuerung', 'arbeitslos', 'taggeld', 'überbrückungsleistung', 'fin de droits', 'esaurimento', 'benefits exhausted'] },
  { view: 'zuzug', bereich: 'behoerden', nav: 'nav.zuzug', sub: 'nav.sub.zuzug', icon: 'ereignisNeuch', aliases: ['zuzug', 'einreise', 'ausland', 'neu in der schweiz', 'anmeldung', 'expat', 'arrivée', 'arrivo', 'moving to switzerland'] },
  { view: 'einbuergerung', bereich: 'behoerden', nav: 'nav.einbuergerung', sub: 'nav.sub.einbuergerung', icon: 'ereignisEinbuergerung', aliases: ['einbürgerung', 'einbuergerung', 'schweizer pass', 'bürgerrecht', 'naturalisation', 'naturalizzazione', 'citizenship'] },
  { view: 'vorsorgeauftrag', bereich: 'notfall', nav: 'nav.vorsorgeauftrag', sub: 'nav.sub.vorsorgeauftrag', icon: 'ereignisVorsorgeauftrag', aliases: ['vorsorgeauftrag', 'patientenverfügung', 'urteilsunfähigkeit', 'kesb', 'mandat pour cause d’inaptitude', 'directives anticipées', 'mandato precauzionale', 'direttive del paziente', 'patient decree', 'advance care directive', 'advance directive', 'living will', 'lasting power of attorney', 'power of attorney', 'testament', 'erbe'] },
  { view: 'ergaenzungsleistungen', bereich: 'vorsorge', nav: 'nav.ergaenzungsleistungen', sub: 'nav.sub.ergaenzungsleistungen', icon: 'ereignisErgaenzungsleistungen', aliases: ['ergänzungsleistungen', 'el', 'el anmelden', 'prestations complémentaires', 'pc avs ai', 'prestazioni complementari', 'supplementary benefits', 'heimeintritt', 'vermögensschwelle'] },
  { view: 'zusammenziehen', bereich: 'wohnen', nav: 'nav.zusammenziehen', sub: 'nav.sub.zusammenziehen', icon: 'ereignisZusammenziehen', aliases: ['zusammenziehen', 'konkubinat', 'ohne trauschein', 'konkubinatsvertrag', 'concubinage', 'vivre ensemble', 'concubinato', 'convivenza', 'cohabitation', 'moving in together'] },
  { view: 'adoption', bereich: 'familie', nav: 'nav.adoption', sub: 'nav.sub.adoption', icon: 'ereignisAdoption', aliases: ['adoption', 'adoptieren', 'stiefkindadoption', 'adoptionsurlaub', 'adopter', 'congé d’adoption', 'adozione', 'congedo di adozione', 'adopt'] },
  { view: 'wegzug', bereich: 'behoerden', nav: 'nav.wegzug', sub: 'nav.sub.wegzug', icon: 'ereignisWegzug', aliases: ['wegzug', 'auswandern', 'ausland', 'abmelden', 'freizügigkeit', 'barauszahlung', 'départ à l’étranger', 'partenza all’estero', 'moving abroad', 'emigrate'] },
  { view: 'ausweis', bereich: 'behoerden', nav: 'nav.ausweis', sub: 'nav.sub.ausweis', icon: 'ereignisAusweis', aliases: ['pass', 'identitätskarte', 'ausweis', 'ausweis verloren', 'passeport', 'carte d’identité', 'passaporto', 'carta d’identità', 'passport', 'identity card'] },
  { view: 'betreibungsauszug', bereich: 'behoerden', nav: 'nav.betreibungsauszug', sub: 'nav.sub.betreibungsauszug', icon: 'ereignisBetreibungsauszug', aliases: ['betreibungsauszug', 'betreibungsregister', 'auszug', 'wohnungssuche', 'extrait des poursuites', 'estratto esecuzioni', 'debt enforcement extract', 'debt collection extract'] },
  { view: 'lehre', bereich: 'bildung', nav: 'nav.lehre', sub: 'nav.sub.lehre', icon: 'ereignisLehre', aliases: ['lehre', 'lehrvertrag', 'lernende', 'erste stelle', 'apprentissage', 'contrat d’apprentissage', 'tirocinio', 'apprendistato', 'apprenticeship'] },
  { view: 'volljaehrig', bereich: 'person', nav: 'nav.volljaehrig', sub: 'nav.sub.volljaehrig', icon: 'ereignisVolljaehrig', aliases: ['18 werden', 'volljährig', 'volljaehrig', 'volljährigkeit', 'majorité', '18 ans', 'maggiore età', '18 anni', 'turning 18', 'coming of age'] },
  { view: 'dienst', bereich: 'behoerden', nav: 'nav.dienst', sub: 'nav.sub.dienst', icon: 'ereignisDienst', aliases: ['militär', 'zivildienst', 'rekrutierung', 'wehrpflichtersatz', 'service militaire', 'service civil', 'servizio militare', 'servizio civile', 'military service', 'civilian service'] },
  { view: 'digitaleordnung', bereich: 'person', nav: 'nav.digitaleordnung', sub: 'nav.sub.digitaleordnung', icon: 'ereignisDigitaleordnung', aliases: ['digitale ordnung', 'passwort', 'passwörter', 'passwortmanager', 'zwei-faktor', 'phishing', 'betrug', 'gehackt', 'datenschutz', 'auskunft', 'robinsonliste', 'mot de passe', 'password', 'privacy'] },
  { view: 'todesfall', bereich: 'familie', nav: 'nav.todesfall', sub: 'nav.sub.todesfall', icon: 'ereignisTodesfall', aliases: ['todesfall', 'tod', 'gestorben', 'erbe', 'nachlass', 'décès', 'decesso', 'death'] },
];

// «Ankommen in der Schweiz» (Seitenlandkarte G1, 05.11.2026): die Abläufe, die eine Person nach dem
// Zuzug nacheinander braucht, aus drei Lebensbereichen. Reihenfolge = Reihenfolge in der Übersicht.
// Nur Verweise auf ABLAEUFE — Titel, Untertitel und Zeichen kommen von dort (Wächter: gruppeAnkommen.test.js).
export const ANKOMMEN = ['zuzug', 'kkerst', 'bewilligung', 'quellensteuer', 'einbuergerung'];

// «Mit 18» (Seitenlandkarte G2, 06.11.2026): 18 werden, dann Lehre, Dienst und die erste Stelle — die Reihe,
// die «18 werden» selbst schon verlinkt (ablaufVerwandte.js). Nur Verweise auf ABLAEUFE (Wächter: gruppeMit18.test.js).
export const MIT18 = ['volljaehrig', 'lehre', 'dienst', 'neuerjob'];

// Die Zeichen der Werkzeuge stehen seit #414 in data/werkzeugRegister.js; die Köpfe holen
// sie über ansichtIkon() von hier (Seitenrundgang 27.09.2026, Wächter zeichenEineQuelle.test.js).
export const SEARCH_VIEWS = [
  // Alle Werkzeuge — aus dem einen Werkzeug-Register (data/werkzeugRegister.js,
  // Vorschau 27.09.2026). Vorher standen sie hier ein zweites Mal von Hand.
  ...SUCHBARE_WERKZEUGE,
  // Zwei Wege aus dem Gepäck, die kein geführter Ablauf sind — nur ihre Suchwörter
  // stehen hier; ihr Platz im Rucksack steht in data/gepaeck.js.
  { view: 'stipendien', bereich: 'bildung', nav: 'nav.stipendien', sub: 'nav.sub.stipendien', icon: 'ereignisStipendien', aliases: ['stipendien', 'scholarship'] },
  { view: 'organ', bereich: 'notfall', nav: 'nav.organDonation', icon: 'ereignisOrgan', aliases: ['organspende', 'spende', 'organ', 'donation'] },
  { view: 'bestattung', bereich: 'notfall', nav: 'nav.bestattung', icon: 'ereignisBestattung', aliases: ['bestattung', 'beerdigung', 'kremation', 'abdankung', 'obsèques', 'funerale', 'funeral'] },
  { view: 'mietzins', bereich: 'wohnen', nav: 'nav.mietzins', sub: 'nav.sub.mietzins', icon: 'ereignisMietzins', aliases: ['mietzins', 'mietzinsbeitrag', 'mietzinsrechner', 'miete', 'mietzuschuss', 'wohnbeihilfe', 'aide au loyer', 'aides au loyer', 'sussidio affitto', 'rent subsidy'] },
  // Seiten, die das Dashboard und die Kapitel ansteuern, die aber weder Werkzeug noch
  // Ablauf sind. Befund 23.10.2026: wer «Notfallkarte» eintippte, bekam nichts — die
  // Karte auf dem Dashboard führt in `notfalleinstieg`, und keine dieser Seiten stand hier.
  // Der Name ist derselbe wie auf der Dashboard-Karte.
  // Runde 5 / «ein Ort»: «Notfallkarte» trifft nur noch die Notfallkarte (Q), nicht mehr das Kapitel.
  { view: 'notfalleinstieg', bereich: 'notfall', nav: 'arztkoffer.faecher.notfall.title', icon: 'herzPuls', aliases: ['notfall', 'notfallkontakt', 'blutgruppe', 'portemonnaie-karte', 'urgence', 'emergenza', 'emergency', 'wallet card',
    // Lebenslagen C1+C2 (07.11.2026): Krise und Gewalt finden die Hilfe im Notfall-Block (legal.resources.help1–4).
    'krise', 'gewalt', 'häusliche gewalt', 'suizid', 'dargebotene hand', 'opferhilfe', 'frauenhaus', 'crise', 'violence', 'crisi', 'violenza', 'crisis'] },
  { view: 'notfallkarte', bereich: 'notfall', nav: 'notfallkarte.title', icon: 'herzPuls', aliases: ['notfallkarte', 'carte d’urgence', 'scheda d’emergenza', 'emergency card', 'notruf', 'vorlesekarte', '144', '112', '117', '118', '1414', 'rega', 'appel d’urgence', 'chiamata d’emergenza', 'emergency call'] },
  { view: 'notfallpass', bereich: 'notfall', nav: 'notfallpass.title', icon: 'herzPuls', aliases: ['notfallpass', 'notfall-id', 'medical id', 'fiche médicale', 'cartella clinica'] },
  { view: 'briefe', nav: 'briefe.title', icon: 'document', aliases: ['briefe', 'brief', 'briefvorlage', 'vorlage', 'kündigungsschreiben', 'lettre', 'lettera', 'letter'] },
  // «Unterlagen drucken» (F7-S2, 27.10.2026): Lebensmappe, Behörden- und Notfall-Dossier auf einer Seite. Der
  // Eintrag «Lebensmappe» bleibt (Kapitel Basis zeigt ihn) und öffnet dort die Auswahl «Alles»; «dossier» führt
  // jetzt auf die ganze Seite.
  { view: 'drucken', nav: 'unterlagen.drucken.title', icon: 'documents', aliases: ['drucken', 'dossier', 'behördendossier', 'notfalldossier', 'imprimer', 'stampare', 'print'] },
  { view: 'lebensmappe', nav: 'lebensmappe.title', icon: 'documents', aliases: ['lebensmappe', 'mappe', 'cartella', 'life folder'] },
  // Der Weg auf den Startbildschirm. Muss auffindbar sein, weil ihn ausserhalb
  // von Chromium kein Banner von selbst anbietet — wer auf dem iPhone danach
  // sucht, sucht mit genau diesen Wörtern.
  // Die geführten Abläufe — aus der einen Liste oben, nicht von Hand wiederholt.
  ...ABLAEUFE,
  { view: 'installApp', nav: 'nav.installApp', sub: 'nav.sub.installApp', icon: 'download', aliases: ['install', 'installieren', 'app', 'pwa', 'homescreen', 'startbildschirm', 'herunterladen', 'download'] },
];

// Name einer Ansicht für «Zurück zu …» (main.jsx) — der i18n-Schlüssel, nicht der Text.
// Seitenrundgang 27.09.2026: «Zurück zu …» gab es nur nach einem Kapitel; wer aus der
// Finanz-Übersicht in die Steuer kam, aus der Suche in einen Treffer oder von einem
// Ablauf in den nächsten, fand nur «Übersicht» — den Anfang des Dashboards.
// Ansichten ohne Namen hier bekommen kein «Zurück zu …», nur «Übersicht».
const WEITERE_NAMEN = {
  search: 'nav.search',
  settings: 'nav.settings',
  // ansprueche und schnellcheck führen seit 27.10.2026 hierher (UMLEITUNGEN) — derselbe Name.
  ansprueche: 'dashboard.anspruchTitle',
  situationen: 'dashboard.anspruchTitle',
  schnellcheck: 'dashboard.anspruchTitle',
  notfalleinstieg: 'arztkoffer.faecher.notfall.title',
  notfallkarte: 'notfallkarte.title',
  gesundheit: 'arztkoffer.title',
  briefe: 'briefe.title',
  obstgarten: 'obstgarten.title',
  gepaeck: 'nav.rucksack',
  legal: 'legal.title',
  mietzins: 'nav.mietzins',
  // F7-L12 (27.10.2026): ohne Namen gab es von hier aus kein «Zurück zu …».
  anspruchcheck: 'schnellcheck.title',
  notfalldossier: 'notfallDossier.title',
  behoerdendossier: 'behoerdenDossier.title',
};
// «Als Nächstes» der Seiten ohne eigenen Weg weiter (F7-L2): Kapitel, Ansicht oder, ohne Ziel, die Übersicht.
export const SCHLUSS_ZIELE = {
  kk: { kapitel: 'versicherungen' },
  sync: { kapitel: 'finanzen' },
  direktlinks: { ziel: 'situationen' },
  export: { ziel: 'tresor' },
  // notifications: seit 05.11.2026 Abschnitt der Einstellungen (Umleitung), kein eigener Schluss mehr.
  flyer: {},
  installApp: {},
};

export const ansichtName = (view) => {
  const e = SEARCH_VIEWS.find((v) => v.view === view);
  return (e && e.nav) || WEITERE_NAMEN[view] || null;
};

// Zeichen für Ansichten, die ein Querverweis ansteuert, die aber nicht in der Suche
// stehen — Gegenstück zu WEITERE_NAMEN. 27.09.2026: `notfalleinstieg` hatte keines,
// und der Querverweis «Notfallkarte» trug darum das Rückfall-Zeichen `external`
// («verlässt Maloja»). Die Seite trägt den Titel des Notfall-Kapitels, also auch
// dessen Zeichen. Wächter: zeichenEineQuelle.test.js («Kein Zeichen aus dem Rückfall»).
const WEITERE_ZEICHEN = {
  notfalleinstieg: 'herzPuls',
};

// Piktogramm einer Ansicht — mit Rückfall, damit ein unbekannter Schlüssel
// nichts umwirft. Der Rückfall verdeckt eine Lücke, statt sie zu zeigen; darum
// prüft der Wächter oben, dass jedes bekannte Ziel ohne ihn auskommt.
// ─── Seiten-Zeichen (Icon-Plan November 2026, Bauplan B4) ─────────────────
// Leitform + Abzeichen je Seite aus config/seitenZeichen.js, gezeichnet von IconAbzeichen.jsx
// (nachgeladen wie die Münzen). Die Namen `seite:<view>` hängt IconSystem.jsx ins Register, wie die
// Ereignis-Zeichen. Kapitel für Kapitel freigeschaltet — ein PR je ein bis zwei Kapitel.
export const SEITEN_ZEICHEN_KAPITEL = new Set(['basis', 'wohnen', 'finanzen', 'versicherungen', 'ausbildung', 'behoerden']);
export const seitenZeichenName = (view) => 'seite:' + view;
export const SEITEN_BEREICH = new Map();
for (const e of [...ABLAEUFE, ...SEARCH_VIEWS, ...WERKZEUGE]) {
  if (e.view && e.view !== 'chapter' && e.bereich && SEITEN_ZEICHEN_KAPITEL.has(astKapitel(e.bereich))) SEITEN_BEREICH.set(e.view, e.bereich);
}

export const ansichtIkon = (view, rueckfall = 'document') => {
  if (SEITEN_BEREICH.has(view)) return seitenZeichenName(view);
  const e = SEARCH_VIEWS.find((v) => v.view === view);
  return (e && e.icon) || WEITERE_ZEICHEN[view] || rueckfall;
};

// Lebensbereich eines Ablaufs — oder null.
export const ablaufBereich = (view) => {
  const a = ABLAEUFE.find((x) => x.view === view);
  return (a && a.bereich) || null;
};

// Der Name hinter «Zurück zu …» für die aktuelle Herkunft — oder null, wenn keine Zeile
// erscheinen soll: Direkteinstieg, Herkunft Übersicht (dafür steht «Übersicht» schon da),
// dieselbe Ansicht, Kapitel → Kapitel («Nächstes Thema» ist ein Vorwärtsweg; so war es
// vor dem 27.09.2026 auch) oder eine Ansicht ohne Namen im Register.
export const herkunftName = (herkunft, view, chapters, t) => {
  if (!herkunft || herkunft.view === 'dashboard' || herkunft.view === view) return null;
  if (herkunft.view === 'chapter') {
    const ch = chapters && chapters[herkunft.chapterIndex];
    return (ch && ch.title) || null;
  }
  const key = ansichtName(herkunft.view);
  if (!key || typeof t !== 'function') return null;
  const text = t(key);
  return typeof text === 'string' && text && text !== key ? text : null;
};
