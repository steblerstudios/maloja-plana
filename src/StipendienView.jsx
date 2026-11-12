import React, { useState } from 'react';
import { hinweisZeichen } from './IconSystem.jsx';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';
import { getCantonName } from './config/cantonalData.js';
import { STIPENDIEN_OFFICIAL, STIPENDIEN_KANTONE_URL, STIPENDIEN_PRIVATE, stipendienErgebnis } from './data/stipendienData.js';
import { RechnerForm, Einzelwahl } from './components/RechnerForm.jsx';
import { text, weight, leading, space, radius } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';
import { PanelTitle } from './components/Heading.jsx';
import { ExternerLink } from './components/ExternerLink.jsx';
import { StatusForm } from './components/StatusForm.jsx';
import { linkStil } from './components/PrimaryButton.jsx';

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
  const stelleKanton = STIPENDIEN_KANTONE_URL[canton];

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
  const linkStyle = { ...linkStil(palette), fontSize: text.sm, wordBreak: 'break-all' };
  const stelleLink = { ...linkStyle, display: 'inline-flex', alignItems: 'center', minHeight: '44px' };
  const item = { fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed, display: 'flex', gap: space.sm + 'px', alignItems: 'flex-start', marginBottom: '8px' };
  const bullet = { color: palette.sage, flexShrink: 0 };

  const li = (txt, key) => React.createElement('div', { key, style: item },
    React.createElement('span', { style: bullet }, '–'),
    React.createElement('span', null, txt)
  );

  const costStyle = (cost) => ({
    fontSize: text.xs, fontWeight: weight.medium, padding: '1px 8px', borderRadius: radius.lg,
    marginLeft: space.xs + 'px', whiteSpace: 'nowrap',
    // Fassung 9 (Stebler Studios 05.11.2026): nur «gratis» trägt Farbe (Grün = gut); «Basis gratis»
    // und «kostenpflichtig» sind neutral — das Wort sagt den Unterschied, Gold/Blau haben andere Rollen.
    background: cost === 'free' ? palette.sage + '18' : palette.up,
    color: cost === 'free' ? palette.sageDeep : palette.mid,
  });

  const toneFarbe = resultTone === 'yes' ? palette.sage : resultTone === 'no' ? palette.rose : palette.sky;
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
        // Gruppe D L3 (11.11.2026): «Anderer Status» für F und B unter 5 Jahren → resultUnclear statt
        // einer erzwungenen falschen Wahl. Gestaltung C: der Hinweis «Nicht berechtigt ist …» steht hier
        // als Hinweis zur Frage; die Listen «Wer kann beantragen?» / «Was wird unterstützt?» unten fallen weg.
        React.createElement(Einzelwahl, { palette, id: 'stip-status', label: t('stip.checkStatusQ'), hinweis: t('stip.notEligible'), wert: status, onWahl: setStatus, optionen: [
          ['swiss', t('stip.who.swiss')], ['foreigner5y', t('stip.who.foreigner5y')],
          ['euefta', t('stip.who.euefta')], ['refugee', t('stip.who.refugee')],
          ['other', t('stip.checkStatusOther')],
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
        // Gestaltung C: ein Satz über 15 Zeilen → Einleitung plus Liste, wenn der Text Zeilen trägt (de).
        ...(() => {
          const [kopf, ...faelle] = String(t('stip.whereAusnahmen')).split('\n');
          return [
            React.createElement('p', { key: 'wa', style: { ...intro, margin: space.sm + 'px 0 0 0' } }, kopf),
            ...faelle.map((f, i) => React.createElement('div', { key: 'wa' + i, style: { ...item, marginTop: i === 0 ? space.xs + 'px' : 0 } },
              React.createElement('span', { style: bullet }, '–'), React.createElement('span', null, f))),
          ];
        })(),
        canton && React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginTop: space.sm + 'px' } },
          t('stip.yourCanton', { canton: getCantonName(canton, t) }))
      ),
    },
    stelle: React.createElement('div', { style: { padding: space.sm + 'px 0', minHeight: '44px', boxSizing: 'border-box', borderBottom: '1px solid ' + palette.border, display: 'flex', flexDirection: 'column' } },
      stelleKanton && React.createElement(ExternerLink, { t, href: stelleKanton, style: { ...stelleLink, fontWeight: weight.semi } }, t('stip.officeLink', { canton: getCantonName(canton, t) })),
      React.createElement(ExternerLink, { t, href: STIPENDIEN_OFFICIAL.edkCantonalOffices, style: { ...stelleLink, fontWeight: stelleKanton ? undefined : weight.semi } }, t('stip.cantonalLink'))),
    quelle: React.createElement(React.Fragment, null, hinweisZeichen(), renderSource(t('stip.source'), null, t)),
  },
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
      style: { ...linkStil(palette), display: 'block', minHeight: '44px', fontSize: text.sm, fontWeight: weight.medium, marginTop: space.md + 'px' }
    }, t('nav.direktlinks'))
  );
};

export default StipendienView;
