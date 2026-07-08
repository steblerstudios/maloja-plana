import React, { useRef, useEffect, useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import QRCode from './vendor/qrcodejs.js';
import { Icon } from './IconSystem.jsx';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';
import { buildFlyerHtml } from './flyerGenerator.js';
import { openPrintWindow } from './utils/helpers.js';
import { text, weight, space, radius } from './config/tokens.js';

// Verteil-Flyer mit QR-Code zu malojaplana.ch (in der aktuell gewählten Sprache).
// Für Beratungsstellen, Gemeinden, Aushänge — niederschwellige Verbreitung.
export const FlyerView = ({ palette, t, lang }) => {
  const vorlesen = useVorlesenContext();
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

  // App teilen: native Teilen-Dialog (Handy) oder Fallback „Link kopiert".
  const [shared, setShared] = useState(false);
  const handleShare = async () => {
    const data = { title: 'Maloja Plana', text: t('flyer.shareText'), url };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch (e) { /* abgebrochen oder nicht unterstützt */ }
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
    actions: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px', marginTop: space.lg + 'px', alignItems: 'center' },
    button: { background: palette.sage, color: '#fff', border: 'none', borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.lg + 'px', fontSize: text.sm, fontWeight: weight.semi, cursor: 'pointer', fontFamily: 'inherit' },
    shareButton: { background: 'none', color: palette.sageDeep || palette.sage, border: '1px solid ' + palette.sage, borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.lg + 'px', fontSize: text.sm, fontWeight: weight.semi, cursor: 'pointer', fontFamily: 'inherit' },
    copied: { fontSize: text.xs, color: palette.sageDeep || palette.mid },
    hint: { fontSize: text.xs, color: palette.mid, lineHeight: 1.55, marginTop: space.md + 'px', maxWidth: '520px' },
  };

  return React.createElement('div', { style: s.card },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'dokumentTresor', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('flyer.title')),
    React.createElement('p', { style: s.intro }, t('flyer.intro'), vorlesen?.enabled && React.createElement(VorlesenButton, { text: t('flyer.intro'), speak: vorlesen.speak, color: palette.mid, label: t('vorlesen.label') })),

    React.createElement('div', { style: s.preview },
      React.createElement('div', { style: s.brand }, 'Maloja Plana'),
      React.createElement('div', { style: s.claim }, t('flyer.claim')),
      React.createElement('div', { style: s.qrWrap, ref: qrRef }),
      React.createElement('div', { style: s.urlText }, 'malojaplana.ch')
    ),

    React.createElement('div', { style: s.actions },
      React.createElement('button', { style: s.button, onClick: handlePrint }, t('flyer.print')),
      React.createElement('button', { style: s.shareButton, onClick: handleShare }, t('flyer.share')),
      shared && React.createElement('span', { style: s.copied, role: 'status' }, '✓ ' + t('flyer.copied'))
    ),
    React.createElement('p', { style: s.hint }, t('flyer.langHint'))
  );
};

export default FlyerView;
