import React, { useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { generateCVTemplate, generateCVHTML, generateJSONResume, downloadCVAsHTML, downloadCVAsJSON } from './cvGenerator.js';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { ExportVorschau } from './components/ExportVorschau.jsx';
import { LebenslaufBlatt, lebenslaufInhalt } from './components/LebenslaufVorschau.jsx';
import { text, weight, radius , space } from './config/tokens.js';
import { CHAPTER_KEYS } from './config/constants.js';
import { ZielHinweis } from './components/ExternerLink.jsx';
import { ansichtIkon } from './config/ansichtenRegister.js';
import { openPrintWindow } from './utils/helpers.js';
import PrimaryButton from './components/PrimaryButton.jsx';

// Lebenslauf (F7-R5, 31.10.2026): das Blatt aus dem Kapitel Ausbildung, «Als PDF drucken» als Hauptweg, HTML und
// JSON klein unter «Weitere Formate». Vorher eine Datenmaske mit drei gleich lauten Knöpfen.
export const CVGenerator = ({ palette, t, data, onNavigate }) => {
  // Export-Vorschau (K20): null | 'druck' | 'html' | 'json' — erst zeigen, was im Dokument steht. Das Blatt zeigt
  // weniger als der Druck (Geburtsdatum, Nationalität, Zivilstand): darum auch vor dem Drucken.
  const [vorschau, setVorschau] = useState(null);
  const zweitKnopf = { minHeight: '44px', padding: '10px 16px', background: 'transparent', color: palette.text, border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontFamily: 'inherit', fontWeight: weight.medium, fontSize: text.sm };

  const cv = generateCVTemplate(data, t);
  const inhalt = lebenslaufInhalt(t, data.ausbildung, data);

  // Aus dem App-Fenster drucken (die CSP sperrt Inline-Handler im Druckfenster), wie beim Flyer.
  const drucken = () => {
    const win = openPrintWindow(generateCVHTML(cv, t));
    if (win) {
      const bereit = win.document.fonts ? win.document.fonts.ready : Promise.resolve();
      bereit.then(() => { win.focus(); win.print(); });
    }
  };
  const weiter = () => {
    const art = vorschau;
    setVorschau(null);
    if (art === 'json') downloadCVAsJSON(data, t);
    else if (art === 'html') downloadCVAsHTML(cv, t);
    else drucken();
  };
  const ergaenzen = onNavigate && React.createElement('button', {
    type: 'button', className: 'mp-link', onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('ausbildung')),
    style: { ...zweitKnopf, display: 'block', marginTop: space.sm + 'px' },
  }, t('cv.ergaenzen') + ' ›');

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: ansichtIkon('cv'), size: 22 }), style: { marginBottom: space.md } }, t('cv.title')),

    !inhalt && React.createElement('div', { 'data-teil': 'lebenslauf-leer' },
      React.createElement('p', { style: { fontSize: text.sm, color: palette.text, margin: 0 } }, t('cv.leer')),
      ergaenzen),

    inhalt && React.createElement(React.Fragment, null,
      React.createElement(LebenslaufBlatt, { palette, inhalt }),
      React.createElement(PrimaryButton, {
        palette, onClick: () => setVorschau('druck'),
        style: { width: '100%', minHeight: '44px', margin: space.md + 'px 0 ' + space.xs + 'px' },
      }, t('cv.pdfDrucken')),
      React.createElement('p', { style: { fontSize: text.xs, color: palette.mid, margin: '0 0 ' + space.sm + 'px' } }, t('cv.pdfHinweis')),
      vorschau === 'druck' && vorschauBox(),
      React.createElement('details', { 'data-teil': 'weitere-formate', style: { marginBottom: space.sm + 'px' } },
        React.createElement('summary', { style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', fontSize: text.sm, color: palette.mid } }, t('cv.weitereFormate')),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm, marginBottom: space.sm + 'px' } },
          React.createElement('button', { type: 'button', onClick: () => setVorschau('html'), style: zweitKnopf },
            React.createElement(ZielHinweis, { t, art: 'download' }), t('cv.downloadHtml')),
          React.createElement('button', { type: 'button', onClick: () => setVorschau('json'), title: t('cv.downloadJsonHint'), style: zweitKnopf },
            '{ } ' + t('cv.downloadJson'))),
        (vorschau === 'html' || vorschau === 'json') && vorschauBox()),
      ergaenzen),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.md + 'px' } }, hinweisZeichen(), t('trust.localOnly'))
  );

  // Export-Vorschau (K20) direkt unter dem Knopf, der sie geöffnet hat.
  function vorschauBox() {
    return React.createElement('div', { style: { marginBottom: space.md } },
      React.createElement(ExportVorschau, {
        palette, t,
        art: vorschau === 'json' ? 'cvJson' : 'cvHtml',
        quelle: vorschau === 'json' ? { resume: generateJSONResume(data, t) } : { cv, data },
        onWeiter: weiter,
        onZurueck: () => setVorschau(null),
      }));
  }
};

export default CVGenerator;
