import React from 'react';
import { ASYL_STATUS, ASYL_ORGS, ASYL_PROCESS, ASYL_RIGHTS, ASYL_ALLTAG_DIMS, counselingForCanton } from './data/asylData.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';

export const AsylView = ({ palette, t, data, onNavigate }) => {
  const vorlesen = useVorlesenContext();
  const canton = data.basis?.canton;
  const cantonOffice = canton ? counselingForCanton(canton) : null;

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    intro: { fontSize: text.sm, color: palette.mid, lineHeight: 1.65, marginBottom: space.md + 'px', maxWidth: '600px' },
    disclaimer: { fontSize: text.sm, color: palette.sageDeep || palette.text, background: palette.sageMist || palette.up, borderInlineStart: '3px solid ' + palette.sage, borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.md + 'px', lineHeight: 1.6, marginBottom: space.lg + 'px' },
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
    crosslink: { display: 'block', width: '100%', background: palette.sageMist || palette.up, border: 'none', borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.sageDeep || palette.mid, cursor: 'pointer', textAlign: 'start', fontFamily: 'inherit', marginTop: space.md + 'px' },
    rightItem: { display: 'flex', gap: space.sm + 'px', alignItems: 'flex-start', padding: '6px 0', fontSize: text.sm, color: palette.mid, lineHeight: 1.55 },
    rightDot: { flexShrink: 0, color: palette.sage, marginTop: '1px' },
    fristen: { background: palette.gold + '1A', border: '1px solid ' + palette.gold + '66', borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.md + 'px', marginTop: space.lg + 'px' },
    fristenTitle: { fontSize: text.sm, fontWeight: weight.semi, color: palette.gold, marginBottom: space.xs + 'px' },
    fristenBody: { fontSize: text.sm, color: palette.text, lineHeight: 1.6 },
    cantonBox: { background: palette.sageMist || palette.up, border: '1px solid ' + palette.sage + '66', borderRadius: radius.sm + 'px', padding: space.md + 'px', marginTop: space.sm + 'px' },
    cantonOfficeLink: { display: 'block', textDecoration: 'none', color: palette.sky, fontSize: text.sm, fontWeight: weight.semi },
    cantonOfficePhone: { fontSize: text.xs, color: palette.mid, marginTop: '2px' },
    cantonDesc: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5, marginTop: space.xs + 'px' },
    alltagDetails: { marginTop: space.md + 'px', background: palette.up, border: '1px solid ' + palette.border + '88', borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.md + 'px' },
    alltagSummary: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, cursor: 'pointer', listStyle: 'none' },
    alltagIntro: { fontSize: text.xs, color: palette.mid, lineHeight: 1.55, margin: space.sm + 'px 0' },
    alltagStatus: { paddingTop: space.sm + 'px', marginTop: space.sm + 'px', borderTop: '1px solid ' + palette.border + '66' },
    alltagStatusLabel: { fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep || palette.text, marginBottom: space.xs + 'px' },
    alltagRow: { display: 'flex', gap: space.sm + 'px', alignItems: 'flex-start', fontSize: text.xs, color: palette.mid, lineHeight: 1.5, padding: '2px 0' },
    alltagDim: { flexShrink: 0, width: '110px', color: palette.text, fontWeight: weight.medium },
  };

  return React.createElement('div', { style: s.card },
    React.createElement('h2', { style: s.title },
      React.createElement(Icon, { name: 'behoerden', size: 20 }),
      t('asyl.title')
    ),
    React.createElement('p', { style: s.intro }, t('asyl.intro'), vorlesen?.enabled && React.createElement(VorlesenButton, { text: t('asyl.intro'), speak: vorlesen.speak, color: palette.mid, label: t('vorlesen.label') })),
    React.createElement('div', { style: s.disclaimer }, t('asyl.disclaimer')),

    // ── Status-/Ausweistypen ──
    React.createElement('h3', { style: s.sectionTitle }, t('asyl.statusTitle')),
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

    // ── Mein Status im Alltag (einklappbar) ──
    React.createElement('details', { style: s.alltagDetails },
      React.createElement('summary', { style: s.alltagSummary }, t('asyl.alltagTitle')),
      React.createElement('p', { style: s.alltagIntro }, t('asyl.alltagIntro')),
      ASYL_STATUS.map((st) =>
        React.createElement('div', { key: st.key, style: s.alltagStatus },
          React.createElement('div', { style: s.alltagStatusLabel }, st.ausweis + ' · ' + t('asyl.status.' + st.key + '.label')),
          ASYL_ALLTAG_DIMS.map((dim) =>
            React.createElement('div', { key: dim, style: s.alltagRow },
              React.createElement('span', { style: s.alltagDim }, t('asyl.alltag.dim.' + dim)),
              React.createElement('span', null, t('asyl.alltag.' + st.key + '.' + dim))
            )
          )
        )
      )
    ),

    // ── Verfahren in Kürze ──
    React.createElement('h3', { style: s.sectionTitle }, t('asyl.processTitle')),
    React.createElement('div', null,
      ASYL_PROCESS.map((p, i) =>
        React.createElement('div', { key: p, style: s.procItem },
          React.createElement('span', { style: s.procNum }, (i + 1) + '.'),
          React.createElement('span', null, t('asyl.process.' + p))
        )
      )
    ),

    // ── Deine Rechte ──
    React.createElement('h3', { style: s.sectionTitle }, t('asyl.rightsTitle')),
    React.createElement('div', null,
      ASYL_RIGHTS.map((r) =>
        React.createElement('div', { key: r, style: s.rightItem },
          React.createElement('span', { style: s.rightDot }, '•'),
          React.createElement('span', null, t('asyl.rights.' + r))
        )
      )
    ),

    // ── Wichtig: kurze Fristen ──
    React.createElement('div', { style: s.fristen },
      React.createElement('div', { style: s.fristenTitle }, '⚠ ' + t('asyl.fristenTitle')),
      React.createElement('div', { style: s.fristenBody }, t('asyl.fristenBody'))
    ),

    // ── Wo Hilfe holen ──
    React.createElement('h3', { style: { ...s.sectionTitle, marginTop: space.lg + 'px' } }, t('asyl.orgsTitle')),
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

    // ── Beratung in Ihrem Kanton ──
    cantonOffice && React.createElement('div', { key: 'canton-office' },
      React.createElement('h3', { style: { ...s.sectionTitle, marginTop: space.lg + 'px' } },
        t('asyl.cantonOfficeTitle', { canton: t('cantons.' + canton) || canton })),
      React.createElement('div', { style: s.cantonBox },
        React.createElement('a', {
          href: cantonOffice.url, target: '_blank', rel: 'noopener noreferrer',
          style: s.cantonOfficeLink,
        }, cantonOffice.name + ' →'),
        cantonOffice.phone && React.createElement('div', { style: s.cantonOfficePhone },
          t('asyl.phone') + ' ' + cantonOffice.phone),
        React.createElement('div', { style: s.cantonDesc }, t('asyl.counseling.desc'))
      )
    ),

    canton && onNavigate && React.createElement('button', {
      style: s.crosslink,
      onClick: () => onNavigate('direktlinks'),
    }, t('asyl.cantonLink', { canton })),

    // ── Nächste Schritte: ruhige Crosslinks zu Dokumenten & Notfall ──
    onNavigate && React.createElement('div', { key: 'next-steps' },
      React.createElement('h3', { style: { ...s.sectionTitle, marginTop: space.lg + 'px' } }, t('asyl.nextStepsTitle')),
      React.createElement('button', {
        style: { ...s.crosslink, marginTop: space.xs + 'px' },
        onClick: () => onNavigate('kkerst'),
      }, t('asyl.linkKkErst')),
      React.createElement('button', {
        style: { ...s.crosslink, marginTop: space.xs + 'px' },
        onClick: () => onNavigate('tresor'),
      }, t('asyl.linkDocs')),
      React.createElement('button', {
        style: { ...s.crosslink, marginTop: space.xs + 'px' },
        onClick: () => onNavigate('notfalleinstieg'),
      }, t('asyl.linkEmergency')),
      React.createElement('button', {
        style: { ...s.crosslink, marginTop: space.xs + 'px' },
        onClick: () => onNavigate('vorsorge'),
      }, t('asyl.linkAhvIntl'))
    )
  );
};

export default AsylView;
