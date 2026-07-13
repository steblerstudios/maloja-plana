import React, { useState } from 'react';
import { Icon } from './IconSystem.jsx';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';
import { getCantonName } from './config/cantonalData.js';
import { STIPENDIEN_OFFICIAL, STIPENDIEN_ELIGIBILITY, STIPENDIEN_PRIVATE } from './data/stipendienData.js';
import { text, weight, leading, space, radius } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';
import { PageTitle, PanelTitle } from './components/Heading.jsx';

// Ergebnis-Marker des Berechtigungs-Checks: eigenes Zeichen je Ton, damit sich
// „Ja / Nein / Vielleicht" auch OHNE Farbe (Schwarzweiss-Modus) unterscheiden —
// nicht nur über sage/rose/gold. ○ = „trifft hier nicht zu" (würdevoll, kein
// Alarm, wie der hohle Ring der KVG-Statuslogik), bewusst nicht ✕.
export const stipResultMarker = (tone) => tone === 'yes' ? '✓' : tone === 'no' ? '○' : 'ⓘ';

export const StipendienView = ({ palette, t, data, onNavigate }) => {
  const vorlesen = useVorlesenContext();
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
  const panelMargin = { margin: space.lg + 'px 0 ' + space.xs + 'px 0' }; // Abstände der Abschnittstitel; Grösse/Gewicht kommt aus PanelTitle
  const intro = { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed };
  const linkStyle = { color: palette.sageDeep, textDecoration: 'underline', textUnderlineOffset: '2px', fontSize: text.sm, wordBreak: 'break-all' };
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
    // Deep-Varianten für lesbaren Badge-Text (roh: gold 2.19 / sky 3.20 / sage 4.34 = AA-Fail).
    color: cost === 'paid' ? palette.goldDeep : cost === 'freemium' ? palette.skyDeep : palette.sageDeep,
  });

  return React.createElement('div', { style: card },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'ausbildung', size: 22 }), style: { marginBottom: space.sm + 'px' } }, t('stip.title')),
    React.createElement('p', { style: { ...intro, marginBottom: space.md + 'px' } }, t('stip.intro'), vorlesen?.enabled && React.createElement(VorlesenButton, { text: t('stip.intro'), speak: vorlesen.speak, color: palette.mid, label: t('vorlesen.label') })),

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
      }, stipResultMarker(resultTone) + ' ' + t(resultKey))
    ),

    // Wer kann beantragen?
    React.createElement(PanelTitle, { palette, style: panelMargin }, t('stip.eligibilityTitle')),
    STIPENDIEN_ELIGIBILITY.whoKeys.map(k => li(t('stip.who.' + k), 'who-' + k)),
    React.createElement('div', { style: { ...intro, fontStyle: 'italic', marginTop: space.xs + 'px' } }, 'ⓘ ' + t('stip.notEligible')),

    // Was wird unterstützt?
    React.createElement(PanelTitle, { palette, style: panelMargin }, t('stip.scopeTitle')),
    STIPENDIEN_ELIGIBILITY.scopeKeys.map(k => li(t('stip.scope.' + k), 'scope-' + k)),

    // Wo beantragen? (+ Kanton-Crosslink)
    React.createElement(PanelTitle, { palette, style: panelMargin }, t('stip.whereTitle')),
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
    React.createElement(PanelTitle, { palette, style: panelMargin }, t('stip.formTitle')),
    React.createElement('p', { style: intro }, t('stip.formNote')),

    // Privates Verzeichnis (Rückfall)
    React.createElement(PanelTitle, { palette, style: { ...panelMargin, marginTop: space.xl + 'px' } }, t('stip.privateTitle')),
    React.createElement('p', { style: { ...intro, marginBottom: space.sm + 'px' } }, t('stip.privateIntro')),
    STIPENDIEN_PRIVATE.map(p =>
      React.createElement('div', { key: p.id, style: { ...item, justifyContent: 'space-between' } },
        React.createElement('a', { href: p.url, target: '_blank', rel: 'noopener', style: linkStyle }, '↗ ' + t('stip.private.' + p.id)),
        React.createElement('span', { style: costStyle(p.cost) }, t('stip.cost.' + p.cost))
      )
    ),

    // Checkliste bei Ablehnung
    React.createElement(PanelTitle, { palette, style: panelMargin }, t('stip.checklistTitle')),
    ['checklist1', 'checklist2', 'checklist3', 'checklist4'].map(k => li(t('stip.' + k), k)),

    // Crosslink: weiter zu den offiziellen Behörden-Links (Prop war bisher ungenutzt)
    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('direktlinks'),
      style: { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sageDeep, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.lg + 'px' }
    }, '→ ' + t('nav.direktlinks')),

    React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.lg + 'px', lineHeight: leading.normal } },
      'ⓘ ', renderSource(t('stip.source'))
    )
  );
};

export default StipendienView;
