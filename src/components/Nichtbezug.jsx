import React from 'react';
import { text, weight, space, leading } from '../config/tokens.js';
import { kantonsAnlaufstelle } from '../data/direktLinks.js';
import { ExternerLink } from './ExternerLink.jsx';
import { Belege } from './Belege.jsx';
import { linkStil } from './PrimaryButton.jsx';
import { aufklappZeichen } from '../IconSystem.jsx';

// Nichtbezug von Bedarfsleistungen (Stebler Studios 18.11.2026, Brücken 4 und 5).
// Quelle der vier Hürden: Orientierungshilfe in «Soziale Sicherheit CHSS», 11.9.2026 (nichtbezug.quelle).

// Brücke 5: ein kantonales Angebot über die einzelne Leistung hinaus (BS Leistungsrechner, NE Guichets
// sociaux régionaux, JU JU-lien). Ohne Kanton oder ohne Angebot: nichts.
export const KantonsAnlaufstelle = ({ palette, t, canton, style }) => {
  const a = kantonsAnlaufstelle(canton);
  if (!a) return null;
  return React.createElement('p', { 'data-teil': 'kantons-anlaufstelle', style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed, margin: space.xs + 'px 0 0', ...style } },
    t('nichtbezug.imKanton') + ' ',
    React.createElement(ExternerLink, { t, href: a.url, style: { ...linkStil(palette), fontSize: text.xs } }, t('dl.cantonal.' + a.key)));
};

// Brücke 4: die vier Hürden und was in Maloja dagegen hilft, aufklappbar, ruhig.
const HUERDEN = ['wissen', 'aufwand', 'vertrauen', 'verfahren'];

export const NichtbezugHuerden = ({ palette, t, canton }) => {
  const [offen, setOffen] = React.useState(false);
  return React.createElement('details', {
    'data-teil': 'nichtbezug-huerden', style: { marginTop: space.md + 'px' },
    onToggle: (ev) => { const auf = ev.currentTarget.open; if (auf !== offen) setOffen(auf); },
  },
    React.createElement('summary', { className: 'mp-summary', style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '8px', color: palette.text, fontSize: text.sm, fontWeight: weight.medium, listStyle: 'none' } },
      aufklappZeichen(offen), t('nichtbezug.huerdenTitel')),
    React.createElement('div', { style: { padding: '0 0 ' + space.sm + 'px', fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed } },
      React.createElement('p', { style: { margin: '0 0 ' + space.sm + 'px', color: palette.mid } }, t('nichtbezug.huerdenIntro')),
      React.createElement('dl', { style: { margin: 0 } },
        HUERDEN.map((k) => React.createElement(React.Fragment, { key: k },
          React.createElement('dt', { style: { fontWeight: weight.semi, color: palette.text, marginTop: space.sm + 'px' } }, t('nichtbezug.' + k + 'Titel')),
          React.createElement('dd', { style: { margin: '2px 0 0', color: palette.mid } }, t('nichtbezug.' + k + 'Text'))))),
      React.createElement(KantonsAnlaufstelle, { palette, t, canton, style: { marginTop: space.sm + 'px' } }),
      React.createElement(Belege, { palette, t, zeile: t('nichtbezug.quelle'), style: { marginTop: space.xs + 'px' } })));
};

export default NichtbezugHuerden;
