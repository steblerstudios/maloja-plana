import React from 'react';
import { ExternerLink } from './ExternerLink.jsx';
import { text, weight, space, visuallyHiddenStyle } from '../config/tokens.js';
import { aufklappZeichen } from '../IconKern.jsx';
import { knopfStil } from './PrimaryButton.jsx';

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
// nachgeladen: Startbündel vorher 64.19 von 65 kB, das Limit wird nicht angehoben (Regel 02.11.2026).
// Die Textlinks darunter bleiben als Weg zur ganzen Seite.
export const VERSTEHEN = {
  praemien: { karte: 'praemie', figur: 'kostenteil' },
  premium: { karte: 'lastNachIpv' },
};

// Die beiden Teile werden nur dynamisch importiert (Wächter verstehenImWerkzeug.test.js).
export const TEILE = {
  karte: () => import('./KantonsKarteKlein.jsx'),
  figur: () => import('./ErklaerFigurKlein.jsx'),
};

// Schlägt das Nachladen fehl (offline, alte Fassung nach einem Deploy): ein ruhiger Satz und «Nochmals
// versuchen». React.lazy merkt sich einen gescheiterten Import für immer; darum baut der Aufklapper bei
// jedem Versuch ein neues lazy (Qualitätsprüfung 09.11.2026: vorher half nur ein Neuladen der Seite).
export class NachladeGrenze extends React.Component {
  constructor(props) { super(props); this.state = { fehler: false }; }
  static getDerivedStateFromError() { return { fehler: true }; }
  componentDidCatch(error) {
    console.error('[Maloja Plana] Nachladen:', error);
    if (this.props.onFehler) this.props.onFehler();
  }
  render() {
    const { palette, t, nochmals } = this.props;
    if (!this.state.fehler) return this.props.children;
    return React.createElement('div', { 'data-teil': 'nachladen-fehler', style: { margin: space.sm + 'px 0 0' } },
      React.createElement('p', { style: { margin: 0, fontSize: text.sm, color: palette.mid } }, t('erklaerseite.ladeFehler')),
      React.createElement('button', { type: 'button', onClick: nochmals, style: { ...knopfStil(palette, 'neben'), marginTop: space.sm + 'px' } }, t('erklaerseite.nochmals')));
  }
}

// Meldet einen Zustand an die Ansage-Zeile, sobald er sichtbar wird.
const Melde = ({ setze, wert }) => { React.useEffect(() => { setze(wert); }, [setze, wert]); return null; };

// Ein Aufklapper wie die übrigen der App (aufklappZeile, PraemienOrientierung): Linie unten, Zeichen links,
// Titel halbfett (Gestaltungsprüfung 09.11.2026). Der Inhalt wird erst gerendert (und damit geladen), wenn er
// offen ist. Die Ansage-Zeile (role=status) steht immer im Dokument, damit Vorlese-Programme «wird geladen»
// und den Fehler auch ansagen (a11y-Prüfung 09.11.2026: eine Live-Region, die mit ihrem Text erst erscheint,
// wird oft nicht vorgelesen).
const Aufklapper = ({ palette, t, titel, teil, laden, props }) => {
  const [offen, setOffen] = React.useState(false);
  const [versuch, setVersuch] = React.useState(0);
  const [ansage, setAnsage] = React.useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const Teil = React.useMemo(() => React.lazy(laden), [laden, versuch]);
  const leise = { margin: space.sm + 'px 0 0', fontSize: text.sm, color: palette.mid };
  return React.createElement(React.Fragment, null,
    React.createElement('details', {
      'data-teil': teil, onToggle: (e) => setOffen(e.currentTarget.open),
      style: { borderBottom: '1px solid ' + palette.border, padding: space.xs + 'px 0 ' + space.sm + 'px' },
    },
    React.createElement('summary', {
      className: 'mp-summary',
      style: { cursor: 'pointer', minHeight: '44px', listStyle: 'none', display: 'block', paddingTop: space.ms + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text },
    }, aufklappZeichen(offen), titel),
    offen && React.createElement(NachladeGrenze, {
      key: versuch, palette, t,
      onFehler: () => setAnsage(t('erklaerseite.ladeFehler')),
      nochmals: () => { setAnsage(''); setVersuch((n) => n + 1); },
    },
    React.createElement(React.Suspense, {
      fallback: React.createElement(React.Fragment, null,
        React.createElement('p', { style: leise }, t('erklaerseite.laedt')),
        React.createElement(Melde, { setze: setAnsage, wert: t('erklaerseite.laedt') })),
    },
    React.createElement(Melde, { setze: setAnsage, wert: '' }),
    React.createElement(Teil, { palette, t, ...props })))),
    React.createElement('p', { role: 'status', 'aria-live': 'polite', style: visuallyHiddenStyle }, ansage));
};

export const VerstehenImWerkzeug = ({ palette, t, view, kanton }) => {
  const v = VERSTEHEN[view];
  if (!v) return null;
  return React.createElement('div', { 'data-teil': 'verstehen-im-werkzeug', style: { marginTop: space.md + 'px' } },
    v.karte && React.createElement(Aufklapper, {
      palette, t, teil: 'aufklapper-karte', laden: TEILE.karte, props: { karte: v.karte, kanton },
      titel: t(kanton ? 'erklaerseite.karteMitKanton' : 'erklaerseite.karteOhneKanton'),
    }),
    v.figur && React.createElement(Aufklapper, {
      palette, t, teil: 'aufklapper-figur', laden: TEILE.figur, props: { figur: v.figur }, titel: t('erklaerseite.imBild'),
    }));
};

export default ErklaerseiteLink;
