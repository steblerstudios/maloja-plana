import React from 'react';
import { text, weight, space, leading } from '../config/tokens.js';
import { getMietzinsbeitraege } from '../data/mietzinsbeitraege.js';

// Ruhiger Hinweis zu Mietzinsbeiträgen — analog zur IPV, aber kantonal/kommunal
// fragmentiert. Drei Zustände: bestätigt (affirmativ), keines (ausgegraut), unklar
// (prüfen). Nie ein falsches „gibt's nicht" — würdevoll, keine falsche Hoffnung.
export const MietzinsHinweis = ({ palette, t, canton }) => {
  if (!canton) return null;
  const info = getMietzinsbeitraege(canton);

  const linkStyle = { color: palette.skyDeep, textDecoration: 'none', fontWeight: weight.medium };
  const link = (label) => info.url && React.createElement('a',
    { href: info.url, target: '_blank', rel: 'noopener noreferrer', style: linkStyle }, label + ' →');

  // Farbe/Ton je Zustand: has = sage (positiv), none = soft (ausgegraut), check = mid (neutral)
  const body = info.state === 'has'
    ? { color: palette.text, msg: t('mietzins.has'), label: t('mietzins.linkCanton') }
    : info.state === 'none'
    ? { color: palette.soft, msg: t('mietzins.none'), label: null }
    : { color: palette.mid, msg: t('mietzins.check'), label: t('mietzins.linkOverview') };

  return React.createElement('div', {
    style: {
      marginTop: space.sm + 'px', paddingTop: space.sm + 'px',
      borderTop: '1px solid ' + palette.border,
      fontSize: text.xs, color: body.color, lineHeight: leading.normal,
      fontStyle: info.state === 'none' ? 'italic' : 'normal',
    },
  },
    React.createElement('span', { style: { fontWeight: weight.semi, color: palette.text } }, t('mietzins.title') + ' '),
    React.createElement('span', null, body.msg + ' '),
    body.label && link(body.label),
  );
};

export default MietzinsHinweis;
