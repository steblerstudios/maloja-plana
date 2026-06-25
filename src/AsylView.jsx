import React from 'react';
import { ASYL_STATUS, ASYL_ORGS, ASYL_PROCESS } from './data/asylData.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';

export const AsylView = ({ palette, t, data, onNavigate }) => {
  const canton = data.basis?.canton;

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    intro: { fontSize: text.sm, color: palette.mid, lineHeight: 1.65, marginBottom: space.md + 'px', maxWidth: '600px' },
    disclaimer: { fontSize: text.sm, color: palette.sageDeep || palette.text, background: palette.sageMist || palette.up, borderLeft: '3px solid ' + palette.sage, borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.md + 'px', lineHeight: 1.6, marginBottom: space.lg + 'px' },
    sectionTitle: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: space.sm + 'px', marginTop: space.lg + 'px' },
    statusRow: { display: 'flex', gap: space.md + 'px', alignItems: 'flex-start', padding: space.sm + 'px 0', borderBottom: '1px solid ' + palette.border + '66' },
    badge: { flexShrink: 0, width: '34px', height: '34px', borderRadius: radius.sm + 'px', background: palette.sage + '22', color: palette.sageDeep || palette.sage, fontWeight: weight.bold, fontSize: text.body, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statusLabel: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text },
    statusDesc: { fontSize: text.sm, color: palette.mid, lineHeight: 1.55, marginTop: '2px' },
    procItem: { display: 'flex', gap: space.sm + 'px', alignItems: 'flex-start', padding: '5px 0', fontSize: text.sm, color: palette.mid, lineHeight: 1.55 },
    procNum: { flexShrink: 0, color: palette.sage, fontWeight: weight.semi, minWidth: '18px' },
    orgRow: { display: 'block', padding: space.sm + 'px 0', borderBottom: '1px solid ' + palette.border + '66', textDecoration: 'none' },
    orgName: { fontSize: text.sm, fontWeight: weight.semi, color: palette.sky, display: 'flex', alignItems: 'center', gap: space.xs + 'px', flexWrap: 'wrap' },
    orgDesc: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5, marginTop: '2px' },
    orgPhone: { fontSize: text.xs, color: palette.mid, marginTop: '2px' },
    officialTag: { fontSize: text.xs, color: palette.sageDeep || palette.sage, background: palette.sage + '22', padding: '1px 6px', borderRadius: radius.sm + 'px', fontWeight: weight.medium },
    crosslink: { display: 'block', width: '100%', background: palette.sageMist || palette.up, border: 'none', borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.sageDeep || palette.mid, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', marginTop: space.md + 'px' },
  };

  return React.createElement('div', { style: s.card },
    React.createElement('h2', { style: s.title },
      React.createElement(Icon, { name: 'behoerden', size: 20 }),
      t('asyl.title')
    ),
    React.createElement('p', { style: s.intro }, t('asyl.intro')),
    React.createElement('div', { style: s.disclaimer }, t('asyl.disclaimer')),

    // ── Status-/Ausweistypen ──
    React.createElement('div', { style: s.sectionTitle }, t('asyl.statusTitle')),
    React.createElement('div', null,
      ASYL_STATUS.map((st, i) =>
        React.createElement('div', { key: st.key, style: { ...s.statusRow, ...(i === ASYL_STATUS.length - 1 ? { borderBottom: 'none' } : {}) } },
          React.createElement('div', { style: s.badge, 'aria-hidden': 'true' }, st.ausweis),
          React.createElement('div', null,
            React.createElement('div', { style: s.statusLabel }, t('asyl.status.' + st.key + '.label')),
            React.createElement('div', { style: s.statusDesc }, t('asyl.status.' + st.key + '.desc'))
          )
        )
      )
    ),

    // ── Verfahren in Kürze ──
    React.createElement('div', { style: s.sectionTitle }, t('asyl.processTitle')),
    React.createElement('div', null,
      ASYL_PROCESS.map((p, i) =>
        React.createElement('div', { key: p, style: s.procItem },
          React.createElement('span', { style: s.procNum }, (i + 1) + '.'),
          React.createElement('span', null, t('asyl.process.' + p))
        )
      )
    ),

    // ── Wo Hilfe holen ──
    React.createElement('div', { style: s.sectionTitle }, t('asyl.orgsTitle')),
    React.createElement('div', null,
      ASYL_ORGS.map((org, i) =>
        React.createElement('a', {
          key: org.id,
          href: org.url, target: '_blank', rel: 'noopener noreferrer',
          style: { ...s.orgRow, ...(i === ASYL_ORGS.length - 1 ? { borderBottom: 'none' } : {}) },
        },
          React.createElement('div', { style: s.orgName },
            org.name + ' →',
            org.official && React.createElement('span', { style: s.officialTag }, t('asyl.official'))
          ),
          React.createElement('div', { style: s.orgDesc }, t('asyl.org.' + org.id)),
          org.phone && React.createElement('div', { style: s.orgPhone }, t('asyl.phone') + ' ' + org.phone)
        )
      )
    ),

    canton && onNavigate && React.createElement('button', {
      style: s.crosslink,
      onClick: () => onNavigate('direktlinks'),
    }, t('asyl.cantonLink', { canton }))
  );
};

export default AsylView;
