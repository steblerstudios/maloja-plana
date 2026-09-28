import React, { useState } from 'react';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, radius, space, leading } from './config/tokens.js';
import { openPrintWindow } from './utils/helpers.js';
import { FragenAblauf } from './components/FragenAblauf.jsx';
import { FRAGEN, dokument, dokumentHtml } from './data/patientenverfuegung.js';

// Patientenverfügung in Fragen — eine Frage pro Seite, am Schluss Vorschau und Druck.
// Ablauf: components/FragenAblauf.jsx · Dokument und Regeln: data/patientenverfuegung.js ·
// Grundlage und Prüfung: docs/design/patientenverfuegung-fragen-2026-09-27.md.
// Antworten unter notfall.pvAntworten — getrennt vom Feld notfall.patientenverfuegung («vorhanden?»).
// Kein trust.localOnly im Fussteil (Rechtsprüfung 27.09.: kein neues «nur auf dem Gerät»-Versprechen).

export const Patientenverfuegung = ({ palette, t, data, onUpdateData, lang }) => {
  const [antworten, setAntworten] = useState(() => data?.notfall?.pvAntworten || {});
  const setzen = (patch) => {
    const next = { ...antworten, ...patch };
    setAntworten(next);
    if (onUpdateData) onUpdateData('notfall', 'pvAntworten', next);
  };

  const absatz = (inhalt, extra) => React.createElement('p', { style: { margin: '0 0 ' + space.xs + 'px', ...extra } }, inhalt);
  const kopf = React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginBottom: space.md + 'px' } },
    absatz(t('pv.ui.intro')), absatz(t('pv.ui.speicher')), absatz(t('pv.ui.einstiegPsych'), { margin: 0 }));

  const vorschau = ({ zumAnfang, knopf }) => {
    const doc = dokument(antworten, data, t);
    return React.createElement('div', null,
      React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.sm + 'px' } }, t('pv.ui.vorschauTitel')),
      doc.leer
        ? React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, hinweisZeichen(), t('pv.ui.leer'))
        : React.createElement('div', { style: { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.sm, fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed } },
            React.createElement('div', { style: { fontSize: text.lg, marginBottom: space.sm + 'px', color: palette.text } }, t('pv.doc.titel')),
            React.createElement('p', { style: { margin: '0 0 ' + space.sm + 'px' } }, t('pv.doc.gilt'), doc.situationen.length ? ' ' + t('pv.doc.giltInsbesondere') + ' ' + doc.situationen.join(' · ') : ''),
            doc.abschnitte.map((s) => React.createElement('div', { key: s.key, style: { marginBottom: space.sm + 'px' } },
              React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text } }, s.titel),
              s.zeilen.map((z, i) => React.createElement('p', { key: i, style: { margin: '2px 0', whiteSpace: 'pre-wrap' } }, z)),
              (s.personen || []).map((p) => React.createElement('p', { key: p.rolle, style: { margin: '2px 0' } }, t('pv.doc.rolle_' + p.rolle) + ': ' + [p.name, p.beziehung, p.telefon].filter(Boolean).join(' · ')))
            )),
            doc.bestehendSatz && React.createElement('p', { style: { margin: space.sm + 'px 0 0' } }, doc.bestehendSatz)
          ),
      React.createElement('p', { style: { fontSize: text.sm, color: palette.text, fontWeight: weight.medium, margin: space.md + 'px 0 ' + space.sm + 'px' } }, hinweisZeichen(), t('pv.ui.ungueltigOhne')),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px' } },
        !doc.leer && React.createElement('button', { type: 'button', style: knopf(true), onClick: () => openPrintWindow(dokumentHtml(antworten, data, t, lang)) },
          React.createElement(Icon, { name: 'document', size: 16, style: { verticalAlign: '-3px', marginRight: '6px' } }), t('pv.ui.drucken')),
        React.createElement('button', { type: 'button', style: knopf(false), onClick: zumAnfang }, t('pv.ui.aendern'))
      )
    );
  };

  return React.createElement(FragenAblauf, { palette, t, ns: 'pv', fragen: FRAGEN, antworten, setzen, titel: t('pv.ui.title'), hinweis: t('pv.ui.hinweis'), kopf, vorschau });
};

export default Patientenverfuegung;
