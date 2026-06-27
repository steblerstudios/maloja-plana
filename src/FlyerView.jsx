import React, { useRef, useEffect } from 'react';
import QRCode from './vendor/qrcodejs.js';
import { Icon } from './IconSystem.jsx';
import { buildFlyerHtml } from './flyerGenerator.js';
import { openPrintWindow } from './utils/helpers.js';
import { text, weight, space, radius } from './config/tokens.js';

// Verteil-Flyer mit QR-Code zu malojaplana.ch (in der aktuell gewählten Sprache).
// Für Beratungsstellen, Gemeinden, Aushänge — niederschwellige Verbreitung.
export const FlyerView = ({ palette, t, lang }) => {
  const qrRef = useRef(null);
  const url = 'https://malojaplana.ch/?lang=' + (lang || 'de');

  useEffect(() => {
    if (!qrRef.current) return;
    qrRef.current.innerHTML = '';
    try {
      new QRCode(qrRef.current, {
        text: url, width: 160, height: 160,
        colorDark: '#1F2421', colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M,
      });
    } catch (e) { /* QR generation failed silently */ }
  }, [url]);

  const handlePrint = () => {
    const canvas = qrRef.current && qrRef.current.querySelector('canvas');
    const qrDataUrl = canvas ? canvas.toDataURL('image/png') : '';
    openPrintWindow(buildFlyerHtml({ t, qrDataUrl }));
  };

  const s = {
    card: { maxWidth: '640px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    intro: { fontSize: text.sm, color: palette.mid, lineHeight: 1.65, marginBottom: space.lg + 'px', maxWidth: '520px' },
    preview: { textAlign: 'center', background: palette.up, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', padding: space.lg + 'px' },
    brand: { fontSize: text.lg, fontWeight: weight.bold, letterSpacing: '-0.3px', color: palette.text },
    claim: { fontSize: text.sm, color: palette.sageDeep || palette.mid, marginTop: space.xs + 'px' },
    qrWrap: { display: 'inline-block', marginTop: space.md + 'px', background: '#fff', padding: space.sm + 'px', borderRadius: radius.sm + 'px' },
    urlText: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, marginTop: space.sm + 'px' },
    button: { marginTop: space.lg + 'px', background: palette.sage, color: '#fff', border: 'none', borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.lg + 'px', fontSize: text.sm, fontWeight: weight.semi, cursor: 'pointer', fontFamily: 'inherit' },
    hint: { fontSize: text.xs, color: palette.mid, lineHeight: 1.55, marginTop: space.md + 'px', maxWidth: '520px' },
  };

  return React.createElement('div', { style: s.card },
    React.createElement('h2', { style: s.title },
      React.createElement(Icon, { name: 'dokumentTresor', size: 20 }),
      t('flyer.title')
    ),
    React.createElement('p', { style: s.intro }, t('flyer.intro')),

    React.createElement('div', { style: s.preview },
      React.createElement('div', { style: s.brand }, 'Maloja Plana'),
      React.createElement('div', { style: s.claim }, t('flyer.claim')),
      React.createElement('div', { style: s.qrWrap, ref: qrRef }),
      React.createElement('div', { style: s.urlText }, 'malojaplana.ch')
    ),

    React.createElement('button', { style: s.button, onClick: handlePrint }, t('flyer.print')),
    React.createElement('p', { style: s.hint }, t('flyer.langHint'))
  );
};

export default FlyerView;
