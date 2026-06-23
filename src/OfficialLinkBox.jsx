import React from 'react';
import { getLinkById, getCantonalLinks } from './data/direktLinks.js';
import { getCantonName } from './config/cantonalData.js';
import { text, weight, space, radius } from './config/tokens.js';

// Reusable "mirror" of an official DirektLinks entry, shown in context next to a
// calculator or section (e.g. the Sozialhilfe link beside the Sozialhilfe view).
export const OfficialLinkBox = ({ palette, t, data, ids, cantonalKey }) => {
  const lang = t('dl.lang');
  const l = (obj) => (obj && (obj[lang] || obj.de)) || '';
  const links = (Array.isArray(ids) ? ids : [ids]).map(getLinkById).filter(Boolean);
  if (!links.length) return null;

  const canton = data && data.basis && data.basis.canton;
  const cantonalLinks = canton ? getCantonalLinks(canton) : null;
  const cantonalUrl = cantonalLinks && cantonalKey ? cantonalLinks[cantonalKey] : null;

  const linkStyle = {
    fontSize: text.xs, color: palette.sage, textDecoration: 'underline',
    textUnderlineOffset: '2px', wordBreak: 'break-all',
  };

  return React.createElement('div', {
    style: {
      marginTop: space.md + 'px', padding: space.md + 'px',
      background: palette.up, borderRadius: radius.sm + 'px',
      border: '1px solid ' + palette.border,
    }
  },
    React.createElement('div', {
      style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: space.sm + 'px' }
    }, t('dl.mirrorTitle')),

    links.map((link, i) =>
      React.createElement('div', { key: link.id, style: { marginBottom: i < links.length - 1 ? space.sm + 'px' : 0 } },
        React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm } }, l(link.name)),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: '4px' } }, l(link.beschreibung)),
        React.createElement('a', { href: link.url, target: '_blank', rel: 'noopener', style: linkStyle }, '↗ ' + link.url),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '4px' } }, t('dl.antragsstelle') + ': ' + l(link.antragsstelle))
      )
    ),

    cantonalUrl && React.createElement('div', {
      style: { marginTop: space.sm + 'px', paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border }
    },
      React.createElement('a', { href: cantonalUrl, target: '_blank', rel: 'noopener', style: linkStyle },
        '↗ ' + t('dl.cantonalTitle', { canton: getCantonName(canton, t) }) + ' — ' + t('dl.cantonal.' + cantonalKey)
      )
    )
  );
};

export default OfficialLinkBox;
