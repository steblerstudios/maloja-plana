import React from 'react';
import { ExternerLink } from './ExternerLink.jsx';
import { text, weight, space } from '../config/tokens.js';

// Vom Werkzeug zur eigenen öffentlichen Erklärseite (Verbesserungen D1, 06.11.2026). Seit E1 führt die
// Erklärseite ins Werkzeug; hier der Weg zurück, für wer verstehen will, wie das System dahinter funktioniert.
//
// - Neuer Tab (ExternerLink, angekündigt): die Erklärseite ist eine eigene, statische Seite. Im selben Tab
//   ginge das Beispiel verloren, und die offene Eingabe wäre weg aus dem Blick.
// - Immer die deutsche Fassung, wie die Liste im Beta-Tor (BetaGate.jsx ERKLAERSEITEN): fr/it/en/rm sind noch
//   nicht gegengelesen. Der Linktext sagt das in den anderen Sprachen.
// - Farbe Blau = informieren (Farbrollen Fassung 9).
export const ERKLAERSEITE = {
  sozialhilfe: '/sozialhilfe/',
  tax: '/steuern/',
  premium: '/praemienverbilligung/',
  praemien: '/krankenkasse/',
};

// Ergänzung A (Wege durch Maloja, Entscheid Stebler Studios 07.11.2026): aus dem Werkzeug zur passenden Karte
// im Kantonsatlas — sonst führt aus der App kein Weg dorthin. Die Anker erzeugt scripts/seiten/kantonsatlas.mjs
// (`karte-${key.toLowerCase()}`); der Wächter appZurErklaerseite.test.js prüft, dass jedes Ziel auf der Seite steht.
export const KANTONSKARTE = {
  praemien: '/kantonsatlas/#karte-praemie',
  premium: '/kantonsatlas/#karte-lastnachipv',
  tax: '/kantonsatlas/#karte-steuer',
  mietzins: '/kantonsatlas/#karte-miete',
  alv: '/kantonsatlas/#karte-alq',
  sozialhilfe: '/kantonsatlas/#karte-sozialhilfe',
  ergaenzungsleistungen: '/kantonsatlas/#karte-el',
};

const linkStil = (palette) => ({ color: palette.skyDeep || palette.text, fontWeight: weight.medium, textDecoration: 'underline', textUnderlineOffset: '2px' });

export const ErklaerseiteLink = ({ palette, t, view }) => {
  const href = ERKLAERSEITE[view];
  const karte = KANTONSKARTE[view];
  if (!href && !karte) return null;
  const zeile = (ziel, schluessel) => React.createElement('p', { key: schluessel, style: { margin: space.sm + 'px 0 0', fontSize: text.sm } },
    React.createElement(ExternerLink, { t, href: ziel, hrefLang: 'de', style: linkStil(palette) }, t(schluessel)));
  return React.createElement(React.Fragment, null,
    href && zeile(href, 'erklaerseite.link'),
    karte && zeile(karte, 'erklaerseite.karte'));
};

// ─── C-A · «Zum Verstehen» und «Auf der Karte» am Ende der Kapitelseite (Entscheid 07.11.2026) ───────────
// Dieselbe Zuordnung wie im Organigramm (docs/design/seiten-architektur-organigramm.html): Erklärseiten zu
// einem Thema an ihrem Kapitel, die Karten des Kantonsatlas nach Thema. Behörden und Gesundheit haben weder
// Erklärseite noch Karte — dort steht keine Zeile. Namen deutsch wie im Beta-Tor; die Kartennamen sind die
// Titel über den Karten (Wächter appZurErklaerseite.test.js vergleicht sie mit der Seite).
// Steht UNTER «Passend zu diesem Bereich», weil dort laut Regel nur Ziele in der App stehen, und nicht oben,
// weil der Vorspann vor dem Inhalt am 27.09.2026 bewusst entfiel.
const ATLAS = '/kantonsatlas/#karte-';
export const ZUM_VERSTEHEN = {
  basis: { seiten: [], karten: [[ATLAS + 'kinderzulage', 'Kinderzulage'], [ATLAS + 'kita', 'Abzug für Kinderbetreuung']] },
  wohnen: { seiten: [], karten: [[ATLAS + 'miete', 'Miete 3 Zimmer'], [ATLAS + 'leer', 'Leerwohnungsziffer']] },
  finanzen: {
    seiten: [['/sozialhilfe/', 'Sozialhilfe'], ['/steuern/', 'Steuern']],
    karten: [[ATLAS + 'steuer', "Steuern bei 80'000 Fr. Lohn"], [ATLAS + 'sozialhilfe', 'Sozialhilfequote']],
  },
  versicherungen: {
    seiten: [['/krankenkasse/', 'Krankenkasse'], ['/praemienverbilligung/', 'Prämienverbilligung']],
    karten: [[ATLAS + 'praemie', 'Prämie Erwachsene'], [ATLAS + 'lastnachipv', 'Prämienlast nach Verbilligung'], [ATLAS + 'el', 'Ergänzungsleistungen zur AHV']],
  },
  ausbildung: { seiten: [], karten: [[ATLAS + 'alq', 'Arbeitslosenquote']] },
};

const kleinerLink = (palette, t, href, name) => React.createElement(ExternerLink, {
  key: href, t, href, hrefLang: 'de',
  style: { ...linkStil(palette), display: 'inline-block', minHeight: '44px', lineHeight: '44px', marginRight: space.md + 'px' },
}, name);

export const ZumVerstehen = ({ palette, t, kapitel }) => {
  const z = ZUM_VERSTEHEN[kapitel];
  if (!z) return null;
  const titel = (schluessel) => React.createElement('h4', { style: { margin: space.sm + 'px 0 0', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t(schluessel));
  const zeile = (liste) => React.createElement('p', { lang: 'de', style: { margin: 0, fontSize: text.sm } }, liste.map(([href, name]) => kleinerLink(palette, t, href, name)));
  return React.createElement('section', { 'data-teil': 'zum-verstehen', style: { marginTop: space.lg + 'px' } },
    z.seiten.length > 0 && titel('erklaerseite.zumVerstehen'),
    z.seiten.length > 0 && zeile(z.seiten),
    z.karten.length > 0 && titel('erklaerseite.aufDerKarte'),
    z.karten.length > 0 && zeile(z.karten));
};

// ─── D-A · «Mehr dazu: <Seite>» am passenden Schritt eines Ablaufs (Entscheid 07.11.2026) ───────────────
// AblaufLink springt nur innerhalb der App; dies ist die äussere Form (neuer Tab, deutsche Seite).
// Beschriftung = Name der Seite, kein Fachsatz.
export const MEHR_DAZU = {
  politsystem: ['/politsystem/', 'Wie die Schweiz entscheidet'],
  kantone: ['/kantone-im-vergleich/', 'Kantone im Vergleich'],
};

export const MehrDazu = ({ palette, t, seite }) => {
  const ziel = MEHR_DAZU[seite];
  if (!ziel) return null;
  return React.createElement('p', { style: { margin: space.sm + 'px 0 0', fontSize: text.sm, color: palette.mid } },
    t('erklaerseite.mehrDazu'), ' ',
    React.createElement(ExternerLink, { t, href: ziel[0], hrefLang: 'de', lang: 'de', style: linkStil(palette) }, ziel[1]));
};

// ─── C + D · «Verstehen im Werkzeug» (Entscheid Stebler Studios 09.11.2026, «Ja, C + D bauen») ─────────
// Bis hier führten aus dem Werkzeug nur Textlinks in einen neuen Tab; Karten und Erklärfiguren sah man in der
// App nie. Jetzt klappen sie direkt beim Werkzeug auf:
//   C · «Ihr Kanton auf der Karte»: die Atlas-Karte, der eigene Kanton markiert, seine Zahl daneben;
//   D · «Im Bild erklärt»: das Standbild der Erklärfigur, die bewegte Fassung als Link.
// Pilot Kapitel Versicherungen (Prämien, Prämienverbilligung). Beides wird erst beim Aufklappen
// nachgeladen: Startbündel bei 64.19 von 65 kB, das Limit wird nicht angehoben (Regel 02.11.2026).
// Die Textlinks darunter bleiben als Weg zur ganzen Seite.
export const VERSTEHEN = {
  praemien: { karte: 'praemie', figur: 'kostenteil' },
  premium: { karte: 'lastNachIpv' },
};

const KantonsKarteKlein = React.lazy(() => import('./KantonsKarteKlein.jsx'));
const ErklaerFigurKlein = React.lazy(() => import('./ErklaerFigurKlein.jsx'));

// Schlägt das Nachladen fehl (offline, alte Fassung im Cache): ein ruhiger Satz statt eines leeren Kastens.
class NachladeGrenze extends React.Component {
  constructor(props) { super(props); this.state = { fehler: false }; }
  static getDerivedStateFromError() { return { fehler: true }; }
  componentDidCatch(error) { console.error('[Maloja Plana] Nachladen:', error); }
  render() {
    if (this.state.fehler) return React.createElement('p', { role: 'status', style: { margin: space.sm + 'px 0 0', fontSize: text.sm, color: this.props.palette.mid } }, this.props.t('erklaerseite.ladeFehler'));
    return this.props.children;
  }
}

// Ein Aufklapper: der Inhalt wird erst gerendert (und damit geladen), wenn er offen ist.
const Aufklapper = ({ palette, t, titel, teil, children }) => {
  const [offen, setOffen] = React.useState(false);
  return React.createElement('details', {
    'data-teil': teil, onToggle: (e) => setOffen(e.currentTarget.open),
    style: { marginTop: space.sm + 'px', borderTop: `1px solid ${palette.border}`, paddingTop: space.xs + 'px' },
  },
  React.createElement('summary', { style: { cursor: 'pointer', minHeight: '44px', lineHeight: '44px', fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, titel),
  offen && React.createElement(NachladeGrenze, { palette, t },
    React.createElement(React.Suspense, {
      fallback: React.createElement('p', { role: 'status', style: { margin: space.sm + 'px 0 0', fontSize: text.sm, color: palette.mid } }, t('erklaerseite.laedt')),
    }, children)));
};

export const VerstehenImWerkzeug = ({ palette, t, view, kanton }) => {
  const v = VERSTEHEN[view];
  if (!v) return null;
  return React.createElement('div', { 'data-teil': 'verstehen-im-werkzeug', style: { marginTop: space.md + 'px' } },
    v.karte && React.createElement(Aufklapper, { palette, t, teil: 'aufklapper-karte', titel: t(kanton ? 'erklaerseite.karteMitKanton' : 'erklaerseite.karteOhneKanton') },
      React.createElement(KantonsKarteKlein, { palette, t, karte: v.karte, kanton })),
    v.figur && React.createElement(Aufklapper, { palette, t, teil: 'aufklapper-figur', titel: t('erklaerseite.imBild') },
      React.createElement(ErklaerFigurKlein, { palette, t, figur: v.figur })));
};

export default ErklaerseiteLink;
