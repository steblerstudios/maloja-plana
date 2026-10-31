import React, { useState } from 'react';
import { hinweisZeichen } from './IconSystem.jsx';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';
import { getCantonName } from './config/cantonalData.js';
import { STIPENDIEN_OFFICIAL, STIPENDIEN_ELIGIBILITY, STIPENDIEN_PRIVATE, stipendienErgebnis } from './data/stipendienData.js';
import { RechnerForm, Einzelwahl } from './components/RechnerForm.jsx';
import { text, weight, leading, space, radius } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';
import { PanelTitle } from './components/Heading.jsx';
import { ExternerLink } from './components/ExternerLink.jsx';
import { GlossarText } from './GlossarBegriff.jsx';
import { StatusForm } from './components/StatusForm.jsx';

// Ergebnis-Marker des Berechtigungs-Checks: eigene FORM je Ton, damit sich
// „Ja / Nein / Vielleicht" auch OHNE Farbe (Schwarzweiss-Modus) unterscheiden —
// nicht nur über sage/rose/gold. Dieselbe Formsprache wie die KVG-Statuslogik
// (`StatusForm`): voll = trifft zu, Ring mit Kern = unklar, hohl = „trifft hier
// nicht zu" (würdevoll, kein Alarm), bewusst kein ✕.
// Bis 23.09.2026 waren es die Buchstaben ✓ ○ ⓘ, an den Satz geklebt in einer
// aria-live-Region — vorgelesen als «weisser Kreis, …».
export const stipResultMarker = (tone) => tone === 'yes' ? 'voll' : tone === 'no' ? 'hohl' : 'kern';

// Rechner-Form X (F7-A2, 27.10.2026): der Kurz-Check ist das Ergebnis und steht zuerst; seine zwei Fragen sind
// «Ihre Angaben» (radiogroup statt Umschalt-Knöpfe), «Wo beantragen?» ist «was zu tun ist». Texte unverändert.
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

  const panelMargin = { margin: space.lg + 'px 0 ' + space.xs + 'px 0' }; // Abstände der Abschnittstitel; Grösse/Gewicht kommt aus PanelTitle
  const intro = { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed };
  const linkStyle = { color: palette.sageDeep, textDecoration: 'underline', textUnderlineOffset: '2px', fontSize: text.sm, wordBreak: 'break-all' };
  const item = { fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed, display: 'flex', gap: space.sm + 'px', alignItems: 'flex-start', marginBottom: '6px' };
  const bullet = { color: palette.sage, flexShrink: 0 };

  const li = (txt, key) => React.createElement('div', { key, style: item },
    React.createElement('span', { style: bullet }, '–'),
    React.createElement('span', null, txt)
  );

  const costStyle = (cost) => ({
    fontSize: text.xs, fontWeight: weight.medium, padding: '1px 7px', borderRadius: radius.lg,
    marginLeft: space.xs + 'px', whiteSpace: 'nowrap',
    background: cost === 'paid' ? palette.gold + '22' : cost === 'freemium' ? palette.sky + '18' : palette.sage + '18',
    // Deep-Varianten für lesbaren Badge-Text (roh: gold 2.19 / sky 3.20 / sage 4.34 = AA-Fail).
    color: cost === 'paid' ? palette.goldDeep : cost === 'freemium' ? palette.skyDeep : palette.sageDeep,
  });

  const toneFarbe = resultTone === 'yes' ? palette.sage : resultTone === 'no' ? palette.rose : palette.gold;
  const ergebnis = resultKey && React.createElement('p', { style: { margin: 0, fontSize: text.lg, fontWeight: weight.semi, lineHeight: leading.normal, color: palette.text } },
    React.createElement(StatusForm, {
      form: stipResultMarker(resultTone), color: toneFarbe,
      size: 12, style: { display: 'inline-block', verticalAlign: '0', marginRight: '8px' },
    }),
    t(resultKey));

  return React.createElement(RechnerForm, {
    palette, t, view: 'stipendien', onNavigate,
    titel: t('stip.title'),
    satz: React.createElement(React.Fragment, null, t('stip.intro'), vorlesen?.enabled && React.createElement(VorlesenButton, { text: t('stip.intro'), speak: vorlesen.speak, color: palette.mid, label: t('vorlesen.label') })),
    ergebnis, ohneErgebnis: t('stip.checkTitle'),
    // O3: die Art des Ergebnisses — Vorprüfung, mit der Zahl der noch offenen Fragen.
    art: stipendienErgebnis({ status, scope }),
    angaben: {
      erfasst: (status ? 1 : 0) + (scope ? 1 : 0), gesamt: 2,
      inhalt: React.createElement('div', { style: { paddingTop: space.xs + 'px' } },
        React.createElement(Einzelwahl, { palette, id: 'stip-status', label: t('stip.checkStatusQ'), wert: status, onWahl: setStatus, optionen: [
          ['swiss', t('stip.who.swiss')], ['foreigner5y', t('stip.who.foreigner5y')],
          ['euefta', t('stip.who.euefta')], ['refugee', t('stip.who.refugee')],
          ['onlyEducation', t('stip.checkStatusOnlyEducation')],
        ].map(([wert, label]) => ({ wert, label })) }),
        React.createElement(Einzelwahl, { palette, id: 'stip-scope', label: t('stip.checkScopeQ'), wert: scope, onWahl: setScope, optionen: [
          ['sekII', t('stip.scope.sekII')], ['tertiaer', t('stip.scope.tertiaer')],
          ['bridge', t('stip.scope.bridge')], ['other', t('stip.checkScopeOther')],
        ].map(([wert, label]) => ({ wert, label })) })
      ),
    },
    // Wo beantragen? (+ Kanton)
    tun: {
      titel: t('stip.whereTitle'),
      inhalt: React.createElement(React.Fragment, null,
        React.createElement('p', { style: { ...intro, margin: 0 } }, t('stip.where')),
        canton && React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginTop: space.sm + 'px' } },
          t('stip.yourCanton', { canton: getCantonName(canton, t) }))
      ),
    },
    stelle: React.createElement('div', { style: { padding: space.sm + 'px 0', minHeight: '44px', boxSizing: 'border-box', borderBottom: '1px solid ' + palette.border } },
      React.createElement(ExternerLink, { t, href: STIPENDIEN_OFFICIAL.edkCantonalOffices, style: { ...linkStyle, fontWeight: weight.semi } }, t('stip.cantonalLink'))),
    quelle: React.createElement(React.Fragment, null, hinweisZeichen(), renderSource(t('stip.source'), null, t)),
  },
    // Wer kann beantragen?
    React.createElement(PanelTitle, { palette, style: panelMargin }, t('stip.eligibilityTitle')),
    STIPENDIEN_ELIGIBILITY.whoKeys.map(k => li(t('stip.who.' + k), 'who-' + k)),
    React.createElement('div', { style: { ...intro, fontStyle: 'italic', marginTop: space.xs + 'px' } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('stip.notEligible'))),

    // Was wird unterstützt?
    React.createElement(PanelTitle, { palette, style: panelMargin }, t('stip.scopeTitle')),
    STIPENDIEN_ELIGIBILITY.scopeKeys.map(k => li(t('stip.scope.' + k), 'scope-' + k)),

    // Stipendium oder Darlehen?
    React.createElement(PanelTitle, { palette, style: panelMargin }, t('stip.formTitle')),
    React.createElement('p', { style: intro }, t('stip.formNote')),

    // Privates Verzeichnis (Rückfall)
    React.createElement(PanelTitle, { palette, style: panelMargin }, t('stip.privateTitle')),
    React.createElement('p', { style: { ...intro, marginBottom: space.sm + 'px' } }, t('stip.privateIntro')),
    STIPENDIEN_PRIVATE.map(p =>
      React.createElement('div', { key: p.id, style: { ...item, justifyContent: 'space-between' } },
        React.createElement(ExternerLink, { t, href: p.url, style: linkStyle }, t('stip.private.' + p.id)),
        React.createElement('span', { style: costStyle(p.cost) }, t('stip.cost.' + p.cost))
      )
    ),

    // Checkliste bei Ablehnung
    React.createElement(PanelTitle, { palette, style: panelMargin }, t('stip.checklistTitle')),
    ['checklist1', 'checklist2', 'checklist3', 'checklist4'].map(k => li(t('stip.' + k), k)),

    // Crosslink: weiter zu den offiziellen Behörden-Links
    onNavigate && React.createElement('button', {
      type: 'button',
      onClick: () => onNavigate('direktlinks'),
      style: { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, minHeight: '44px', fontSize: text.sm, color: palette.sageDeep, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.md + 'px' }
    }, t('nav.direktlinks'))
  );
};

export default StipendienView;
