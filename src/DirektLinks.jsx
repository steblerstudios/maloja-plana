import React, { useState } from 'react';
import { DIREKTLINKS, KATEGORIEN, getAllKategorien, getLinksByKategorie } from './data/direktLinks.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';

export const DirektLinks = ({ palette, t }) => {
  const kategorien = getAllKategorien();
  const [aktiv, setAktiv] = useState(null);
  const links = aktiv ? getLinksByKategorie(aktiv) : DIREKTLINKS;
  const lang = t('dl.lang');
  const l = (obj) => obj[lang] || obj.de;

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    chips: { display: 'flex', gap: space.xs + 'px', flexWrap: 'wrap', marginBottom: space.md + 'px' },
    chip: (active) => ({
      padding: '4px 12px', borderRadius: '16px', fontSize: text.xs, cursor: 'pointer', border: '1px solid ' + (active ? palette.sage : palette.border),
      background: active ? palette.sage + '22' : palette.up, color: active ? palette.sage : palette.text, fontWeight: active ? weight.semi : weight.normal,
    }),
    linkCard: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', marginBottom: space.sm + 'px', border: '1px solid ' + palette.border },
    linkName: { fontWeight: weight.semi, fontSize: text.sm, marginBottom: '2px' },
    linkDesc: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs + 'px' },
    linkUrl: { fontSize: text.xs, color: palette.sage, textDecoration: 'none', wordBreak: 'break-all' },
    linkStelle: { fontSize: text.xs, color: palette.mid, marginTop: '4px' },
    katLabel: { fontSize: text.xs, color: palette.mid, display: 'inline-block', padding: '1px 6px', borderRadius: '4px', background: palette.surface, marginBottom: '4px' },
    source: { marginTop: space.md + 'px', fontSize: text.xs, color: palette.mid },
  };

  return React.createElement('div', { style: s.card },
    React.createElement('h2', { style: s.title },
      React.createElement(Icon, { name: 'dokumentTresor', size: 20 }),
      t('dl.title')
    ),

    React.createElement('div', { style: s.chips },
      React.createElement('span', {
        style: s.chip(!aktiv),
        onClick: () => setAktiv(null),
      }, t('dl.alle')),
      kategorien.map(k =>
        React.createElement('span', {
          key: k.id,
          style: s.chip(aktiv === k.id),
          onClick: () => setAktiv(aktiv === k.id ? null : k.id),
        }, l(k))
      )
    ),

    links.map(link =>
      React.createElement('div', { key: link.id, style: s.linkCard },
        !aktiv && React.createElement('span', { style: s.katLabel }, l(KATEGORIEN[link.kategorie])),
        React.createElement('div', { style: s.linkName }, l(link.name)),
        React.createElement('div', { style: s.linkDesc }, l(link.beschreibung)),
        React.createElement('a', {
          href: link.url,
          target: '_blank',
          rel: 'noopener noreferrer',
          style: s.linkUrl,
        }, link.url),
        React.createElement('div', { style: s.linkStelle },
          t('dl.antragsstelle') + ': ' + l(link.antragsstelle)
        )
      )
    ),

    React.createElement('div', { style: s.source }, t('dl.source'))
  );
};

export default DirektLinks;
