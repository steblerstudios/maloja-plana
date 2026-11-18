import React from 'react';
import { text, weight, space, leading } from '../config/tokens.js';
import { kantonsAnlaufstelle, kantonMehrsprachig } from '../data/direktLinks.js';
import { hatAusweisFNS } from '../data/ausweis.js';
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

// Brücke 6 (19.11.2026): die «Hallo»-Plattform des Kantons, Erstinformation in vielen Sprachen. Ohne Kanton
// oder ohne Plattform: nichts.
export const KantonMehrsprachig = ({ palette, t, canton, style }) => {
  const url = kantonMehrsprachig(canton);
  if (!url) return null;
  return React.createElement('p', { 'data-teil': 'kanton-mehrsprachig', style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed, margin: space.xs + 'px 0 0', ...style } },
    t('nichtbezug.imKanton') + ' ',
    React.createElement(ExternerLink, { t, href: url, style: { ...linkStil(palette), fontSize: text.xs } }, t('dl.cantonal.mehrsprachig')));
};

// Restprämienübernahme Kanton Zürich (18.11.2026): nur die Krankenkassenprämie übernehmen lassen, ohne Sozialhilfe
// (§ 15 Abs. 1 EG KVG). Laut Merkblatt des Kantonalen Sozialamts (28.4.2023) keine Meldung ans Migrationsamt. Nur ZH.
// Nicht bei Ausweis F, N oder S: Asylbereich, keine der Quellen behandelt ihn (Fachprüfung 18.11.2026).
export const ZhRestpraemie = ({ palette, t, canton, data, style }) => {
  if (canton !== 'ZH' || hatAusweisFNS(data)) return null;
  return React.createElement('div', { 'data-hinweis': 'zh-restpraemie', style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed, margin: space.sm + 'px 0 0', ...style } },
    React.createElement('p', { style: { margin: 0, color: palette.mid } }, t('nichtbezug.zhRestpraemie')),
    // Rückwirkung (19.11.2026): § 50 VEG KVG am Wortlaut, als eigener Absatz, damit der Block nicht noch länger wird.
    React.createElement('p', { 'data-teil': 'zh-rueckwirkend', style: { margin: space.xs + 'px 0 0', color: palette.mid } }, t('nichtbezug.zhRestpraemieRueckwirkend')),
    React.createElement(Belege, { palette, t, zeile: t('nichtbezug.zhRestpraemieQuelle') }));
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
          React.createElement('dd', { style: { margin: '2px 0 0', color: palette.mid } }, t('nichtbezug.' + k + 'Text'),
            // Brücke 6: bei «Zeit, Kraft und Sprache» die mehrsprachige Plattform des Kantons.
            k === 'aufwand' && React.createElement(KantonMehrsprachig, { palette, t, canton }))))),
      React.createElement(KantonsAnlaufstelle, { palette, t, canton, style: { marginTop: space.sm + 'px' } }),
      React.createElement(Belege, { palette, t, zeile: t('nichtbezug.quelle'), style: { marginTop: space.xs + 'px' } })));
};

export default NichtbezugHuerden;
