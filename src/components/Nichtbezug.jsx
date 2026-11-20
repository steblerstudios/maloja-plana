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
// Asylbereich nach § 52 VEG KVG (Fachprüfung 19.11.2026): Ausweis F umfasst vorläufig aufgenommene Flüchtlinge
// (Abs. 3: Prämienübernahme nach § 15 EG KVG) und andere vorläufig Aufgenommene (Abs. 4: nur Prämienverbilligung).
// Die App kennt den Unterschied nicht, darum bei F ein eigener Satz mit dem Weg zum Sozialdienst. N und S: kein
// Weg nach § 15 (Asylfürsorge), darum nichts.
// Aufbau nach der Copy-Prüfung 19.11.2026: das Wesentliche sichtbar, Voraussetzungen, Antrag, Rückforderung und
// Rückwirkung aufklappbar, damit der Block kurz bleibt.
const ZH_MEHR = ['zhRestpraemieVoraussetzungen', 'zhRestpraemieAntrag', 'zhRestpraemieRueckforderung', 'zhRestpraemieRueckwirkend'];

export const ZhRestpraemie = ({ palette, t, canton, data, style }) => {
  const [offen, setOffen] = React.useState(false);
  if (canton !== 'ZH') return null;
  const ausweis = String(data?.ausbildung?.workPermit || '').toLowerCase();
  const rahmen = { fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed, margin: space.sm + 'px 0 0', ...style };
  const absatz = (schluessel, teil, oben = space.xs) => React.createElement('p', { key: schluessel, 'data-teil': teil, style: { margin: oben + 'px 0 0', color: palette.mid } }, t('nichtbezug.' + schluessel));
  if (ausweis === 'f') {
    return React.createElement('div', { 'data-hinweis': 'zh-restpraemie-f', style: rahmen },
      absatz('zhRestpraemieF', undefined, 0),
      React.createElement(Belege, { palette, t, zeile: t('nichtbezug.zhRestpraemieQuelle') }));
  }
  if (hatAusweisFNS(data)) return null;
  return React.createElement('div', { 'data-hinweis': 'zh-restpraemie', style: rahmen },
    absatz('zhRestpraemie', undefined, 0),
    React.createElement('details', {
      'data-teil': 'zh-mehr', style: { margin: space.xs + 'px 0 0' },
      onToggle: (ev) => { const auf = ev.currentTarget.open; if (auf !== offen) setOffen(auf); },
    },
      React.createElement('summary', { className: 'mp-summary', style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '8px', color: palette.text, fontSize: text.xs, fontWeight: weight.medium, listStyle: 'none' } },
        aufklappZeichen(offen), t('nichtbezug.zhRestpraemieMehr')),
      ZH_MEHR.map((k) => absatz(k, k === 'zhRestpraemieRueckwirkend' ? 'zh-rueckwirkend' : undefined))),
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
