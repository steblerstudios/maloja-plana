import React, { useState } from 'react';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, radius, space, leading } from './config/tokens.js';
import { openPrintWindow } from './utils/helpers.js';
import { FragenAblauf } from './components/FragenAblauf.jsx';
import { FRAGEN_BW, bestattungDokument, bestattungHtml } from './data/bestattung.js';

// Bestattungswünsche — eine Frage pro Seite, Vorschau, Druck (Skizze Stebler Studios 27.09.2026, F–I).
// Regeln: data/bestattung.js · Grundlage: docs/design/vorsorge-dokumente-2026-09-27.md.
// Antworten unter notfall.bwAntworten — getrennt vom Feld notfall.bestattungswuensche («festgehalten?»).

export const Bestattung = ({ palette, t, data, onUpdateData, lang }) => {
  const [antworten, setAntworten] = useState(() => data?.notfall?.bwAntworten || {});
  const setzen = (patch) => {
    const next = { ...antworten, ...patch };
    setAntworten(next);
    if (onUpdateData) onUpdateData('notfall', 'bwAntworten', next);
  };

  const kopf = React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, margin: '0 0 ' + space.md + 'px' } }, t('bw.ui.intro'));

  const vorschau = ({ zumAnfang, knopf }) => {
    const doc = bestattungDokument(antworten, data, t);
    return React.createElement('div', null,
      React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.sm + 'px' } }, t('bw.ui.vorschauTitel')),
      doc.leer
        ? React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, hinweisZeichen(), t('bw.ui.leer'))
        : React.createElement('div', { style: { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.sm, fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed } },
            React.createElement('div', { style: { fontSize: text.lg, marginBottom: space.sm + 'px', color: palette.text } }, t('bw.doc.titel')),
            doc.zeilen.map((z, i) => React.createElement('p', { key: i, style: { margin: '2px 0' } }, z)),
            doc.texte.map((x) => React.createElement('div', { key: x.key, style: { marginTop: space.sm + 'px' } },
              React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text } }, x.titel),
              React.createElement('p', { style: { margin: '2px 0', whiteSpace: 'pre-wrap' } }, x.text)))
          ),
      React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: space.md + 'px 0 ' + space.sm + 'px', lineHeight: leading.normal } }, hinweisZeichen(), t('bw.begleit.wo')),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px' } },
        !doc.leer && React.createElement('button', { type: 'button', style: knopf(true), onClick: () => openPrintWindow(bestattungHtml(antworten, data, t, lang)) },
          React.createElement(Icon, { name: 'document', size: 16, style: { verticalAlign: '-3px', marginRight: '6px' } }), t('bw.ui.drucken')),
        React.createElement('button', { type: 'button', style: knopf(false), onClick: zumAnfang }, t('bw.ui.aendern'))
      )
    );
  };

  return React.createElement(FragenAblauf, { palette, t, ns: 'bw', fragen: FRAGEN_BW, antworten, setzen, titel: t('bw.ui.title'), hinweis: t('bw.ui.hinweis'), kopf, vorschau });
};

export default Bestattung;
