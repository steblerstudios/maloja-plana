import React from 'react';
import { text, weight, space, leading } from '../config/tokens.js';
import { getMietzinsbeitraege } from '../data/mietzinsbeitraege.js';
import { ExternerLink } from './ExternerLink.jsx';

// Ruhiger Hinweis zu Mietzinsbeiträgen — analog zur IPV, aber kantonal/kommunal
// fragmentiert. Drei Zustände: bestätigt (affirmativ), keines (ausgegraut), unklar
// (prüfen). Nie ein falsches „gibt's nicht" — würdevoll, keine falsche Hoffnung.
// `ohneTitel`: steht der Hinweis in einer Aufklapp-Zeile, die schon «Mietzinsbeiträge» heisst
// (Umzug, Fassung 5), fallen Titel und Trennlinie weg.
// `gespeicherteAdresse` (Umzug, Kapitel 2 W6, 09.11.2026): der Kanton kommt aus der gespeicherten Postleitzahl —
// vor dem Umzug ist das die ALTE Adresse. Dann sagt der Hinweis, für welche Adresse er gilt.
// W7: «hat ein Programm» heisst nicht «gilt für alle» — in BL, ZG und GE steht die Einschränkung dabei.
const MIT_EINSCHRAENKUNG = ['BL', 'ZG', 'GE'];
export const MietzinsHinweis = ({ palette, t, canton, ohneTitel = false, gespeicherteAdresse = false }) => {
  if (!canton) return null;
  const info = getMietzinsbeitraege(canton);

  const linkStyle = { color: palette.skyDeep, textDecoration: 'none', fontWeight: weight.medium };
  const link = (label) => info.url && React.createElement(ExternerLink,
    { t, href: info.url, style: linkStyle }, label);

  // Farbe/Ton je Zustand: has = sage (positiv), none = soft (ausgegraut), check = mid (neutral)
  const body = info.state === 'has'
    ? { color: palette.text, msg: t('mietzins.has'), label: t('mietzins.linkCanton') }
    : info.state === 'none'
    ? { color: palette.soft, msg: t('mietzins.none'), label: null }
    : { color: palette.mid, msg: t('mietzins.check'), label: t('mietzins.linkOverview') };

  return React.createElement('div', {
    style: {
      marginTop: space.sm + 'px',
      ...(ohneTitel ? {} : { paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border }),
      fontSize: text.xs, color: body.color, lineHeight: leading.normal,
      fontStyle: info.state === 'none' ? 'italic' : 'normal',
    },
  },
    !ohneTitel && React.createElement('span', { style: { fontWeight: weight.semi, color: palette.text } }, t('mietzins.title') + ' '),
    gespeicherteAdresse && React.createElement('span', null, t('mietzins.gespeicherteAdresse', { kanton: t('cantons.' + canton) }) + ' '),
    React.createElement('span', null, body.msg + ' '),
    info.state === 'has' && MIT_EINSCHRAENKUNG.includes(canton) && React.createElement('span', null, t('mietzins.einschraenkung_' + canton) + ' '),
    body.label && link(body.label),
  );
};

export default MietzinsHinweis;
