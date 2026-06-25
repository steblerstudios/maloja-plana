import React, { useState } from 'react';
import { Icon } from './IconSystem.jsx';
import { getCantonName } from './config/cantonalData.js';
import { STIPENDIEN_OFFICIAL, STIPENDIEN_ELIGIBILITY, STIPENDIEN_PRIVATE } from './data/stipendienData.js';
import { text, weight, leading, space, radius } from './config/tokens.js';

export const StipendienView = ({ palette, t, data, onNavigate }) => {
  const canton = data?.basis?.canton || '';

  // Kurz-Check Berechtigung (harmonisierte Mindestkriterien, Orientierung)
  const [status, setStatus] = useState('');
  const [scope, setScope] = useState('');
  const eligibleStatus = ['swiss', 'foreigner5y', 'euefta', 'refugee'];
  const eligibleScope = ['sekII', 'tertiaer', 'bridge'];
  let resultKey = null, resultTone = 'neutral';
  if (status && scope) {
    if (status === 'onlyEducation') { resultKey = 'stip.resultNotEligible'; resultTone = 'no'; }
    else if (scope === 'other') { resultKey = 'stip.resultScopeOther'; resultTone = 'maybe'; }
    else if (eligibleStatus.includes(status) && eligibleScope.includes(scope)) { resultKey = 'stip.resultEligible'; resultTone = 'yes'; }
    else { resultKey = 'stip.resultUnclear'; resultTone = 'maybe'; }
  }

  const card = {
    maxWidth: '720px', background: palette.surface, padding: space.lg + 'px',
    borderRadius: radius.md, border: '1px solid ' + palette.border,
  };
  const h2 = { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' };
  const sectionTitle = { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, margin: space.lg + 'px 0 ' + space.xs + 'px 0' };
  const intro = { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed };
  const linkStyle = { color: palette.sage, textDecoration: 'underline', textUnderlineOffset: '2px', fontSize: text.sm, wordBreak: 'break-all' };
  const item = { fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed, display: 'flex', gap: space.sm + 'px', alignItems: 'flex-start', marginBottom: '6px' };
  const bullet = { color: palette.sage, flexShrink: 0 };

  const li = (txt, key) => React.createElement('div', { key, style: item },
    React.createElement('span', { style: bullet }, '–'),
    React.createElement('span', null, txt)
  );

  const checkGroup = (label, options, value, setter) => React.createElement('div', { style: { marginBottom: space.sm + 'px' } },
    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: '4px' } }, label),
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
      options.map(([v, l]) => React.createElement('button', {
        key: v, type: 'button',
        'aria-pressed': value === v,
        onClick: () => setter(value === v ? '' : v),
        style: {
          padding: '6px 12px', fontSize: text.sm, fontFamily: 'inherit', cursor: 'pointer',
          borderRadius: radius.sm,
          border: '1px solid ' + (value === v ? palette.sage : palette.border),
          background: value === v ? palette.sage + '22' : palette.surface,
          color: value === v ? (palette.sageDeep || palette.sage) : palette.text,
          fontWeight: value === v ? weight.semi : weight.normal,
        }
      }, l))
    )
  );

  const costStyle = (cost) => ({
    fontSize: text.xs, fontWeight: weight.medium, padding: '1px 7px', borderRadius: radius.lg,
    marginLeft: space.xs + 'px', whiteSpace: 'nowrap',
    background: cost === 'paid' ? palette.gold + '22' : cost === 'freemium' ? palette.sky + '18' : palette.sage + '18',
    color: cost === 'paid' ? palette.gold : cost === 'freemium' ? palette.sky : palette.sage,
  });

  return React.createElement('div', { style: card },
    React.createElement('h2', { style: h2 },
      React.createElement(Icon, { name: 'ausbildung', size: 20 }), t('stip.title')
    ),
    React.createElement('p', { style: { ...intro, marginBottom: space.md + 'px' } }, t('stip.intro')),

    // ── Kurz-Check Berechtigung ──
    React.createElement('div', { style: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: space.lg + 'px' } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.sm + 'px' } }, t('stip.checkTitle')),
      checkGroup(t('stip.checkStatusQ'), [
        ['swiss', t('stip.who.swiss')], ['foreigner5y', t('stip.who.foreigner5y')],
        ['euefta', t('stip.who.euefta')], ['refugee', t('stip.who.refugee')],
        ['onlyEducation', t('stip.checkStatusOnlyEducation')],
      ], status, setStatus),
      checkGroup(t('stip.checkScopeQ'), [
        ['sekII', t('stip.scope.sekII')], ['tertiaer', t('stip.scope.tertiaer')],
        ['bridge', t('stip.scope.bridge')], ['other', t('stip.checkScopeOther')],
      ], scope, setScope),
      resultKey && React.createElement('div', {
        'aria-live': 'polite',
        style: {
          marginTop: space.sm + 'px', padding: space.md + 'px', borderRadius: radius.sm, fontSize: text.sm, lineHeight: leading.relaxed,
          background: (resultTone === 'yes' ? palette.sage : resultTone === 'no' ? palette.rose : palette.gold) + '18',
          border: '1px solid ' + (resultTone === 'yes' ? palette.sage : resultTone === 'no' ? palette.rose : palette.gold) + '66',
          color: palette.text,
        }
      }, (resultTone === 'yes' ? '✓ ' : 'ⓘ ') + t(resultKey))
    ),

    // Wer kann beantragen?
    React.createElement('div', { style: sectionTitle }, t('stip.eligibilityTitle')),
    STIPENDIEN_ELIGIBILITY.whoKeys.map(k => li(t('stip.who.' + k), 'who-' + k)),
    React.createElement('div', { style: { ...intro, fontStyle: 'italic', marginTop: space.xs + 'px' } }, 'ⓘ ' + t('stip.notEligible')),

    // Was wird unterstützt?
    React.createElement('div', { style: sectionTitle }, t('stip.scopeTitle')),
    STIPENDIEN_ELIGIBILITY.scopeKeys.map(k => li(t('stip.scope.' + k), 'scope-' + k)),

    // Wo beantragen? (+ Kanton-Crosslink)
    React.createElement('div', { style: sectionTitle }, t('stip.whereTitle')),
    React.createElement('p', { style: intro }, t('stip.where')),
    React.createElement('div', {
      style: { marginTop: space.sm + 'px', padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border }
    },
      canton && React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: '4px' } },
        t('stip.yourCanton', { canton: getCantonName(canton, t) })
      ),
      React.createElement('a', { href: STIPENDIEN_OFFICIAL.edkCantonalOffices, target: '_blank', rel: 'noopener', style: linkStyle },
        '↗ ' + t('stip.cantonalLink')
      )
    ),

    // Stipendium oder Darlehen?
    React.createElement('div', { style: sectionTitle }, t('stip.formTitle')),
    React.createElement('p', { style: intro }, t('stip.formNote')),

    // Privates Verzeichnis (Rückfall)
    React.createElement('div', { style: { ...sectionTitle, marginTop: space.xl + 'px' } }, t('stip.privateTitle')),
    React.createElement('p', { style: { ...intro, marginBottom: space.sm + 'px' } }, t('stip.privateIntro')),
    STIPENDIEN_PRIVATE.map(p =>
      React.createElement('div', { key: p.id, style: { ...item, justifyContent: 'space-between' } },
        React.createElement('a', { href: p.url, target: '_blank', rel: 'noopener', style: linkStyle }, '↗ ' + t('stip.private.' + p.id)),
        React.createElement('span', { style: costStyle(p.cost) }, t('stip.cost.' + p.cost))
      )
    ),

    // Checkliste bei Ablehnung
    React.createElement('div', { style: sectionTitle }, t('stip.checklistTitle')),
    ['checklist1', 'checklist2', 'checklist3', 'checklist4'].map(k => li(t('stip.' + k), k)),

    React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.lg + 'px', lineHeight: leading.normal } },
      'ⓘ ' + t('stip.source')
    )
  );
};

export default StipendienView;
