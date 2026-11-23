// Beta-Feedback als eigene Datei (23.11.2026): es steht ganz unten auf dem Dashboard und wird darum
// nachgeladen (Dashboard: lazyMitTexten). Vorher lag es samt Mail-Baustein im Startbündel, das bei
// 64,71 von 65 kB stand — die Grenze wird nicht angehoben (Regel 02.11.2026).
import React, { useState } from 'react';
import { text, weight, leading, space, radius } from '../config/tokens.js';
import { knopfStil, linkStil, auswahlStil } from './PrimaryButton.jsx';
import { useT } from '../i18n/index.js';
import { betaFeedbackText, betaFeedbackHref } from '../utils/betaFeedbackMail.js';
import { version as APP_VERSION } from '../../package.json';

// Beta-Feedback (26.10.2026, Entscheid Stebler Studios): der Knopf hiess «Feedback senden», schickte
// aber nichts — die Antworten lagen nur im Gerätespeicher, wo sie niemand liest. Jetzt wird
// daraus ein Mail-Entwurf, der vor dem Klick sichtbar dasteht. Gesendet wird erst mit dem
// eigenen Klick im Mailprogramm; wer keins hat, kopiert den Text. Auf dem Gerät bleibt nur
// der Merker «erledigt», die Antworten selbst nicht.
const BetaFeedback = ({ palette, t }) => {
  const storageKey = 'or5_beta_feedback';
  const { lang } = useT();
  // 'neu' = Formular · 'offen' = Entwurf eben geöffnet (diese Sitzung) · 'frueher' = schon erledigt
  const [phase, setPhase] = useState(() => {
    try { return localStorage.getItem(storageKey) === 'done' ? 'frueher' : 'neu'; } catch { return 'neu'; }
  });
  const [expanded, setExpanded] = useState(false);
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [kopie, setKopie] = useState(''); // '' · 'ok' · 'fehler'

  const leer = !q1 && !q2 && !q3.trim();
  const entwurf = betaFeedbackText({ q1, q2, q3, t, version: APP_VERSION, lang });
  const href = betaFeedbackHref(entwurf);

  const kopieren = async () => {
    // Erst beim Klick geladen: hält das Startbündel unter dem size-limit.
    const ok = await import('../utils/zwischenablage.js')
      .then((m) => m.inZwischenablage(t('beta.feedback.to') + ': info@malojaplana.ch\n\n' + entwurf))
      .catch(() => false);
    setKopie(ok ? 'ok' : 'fehler');
  };

  // «Text kopieren» ist eine Handlung (Nebenknopf), «erneut öffnen» ein Link (Fassung 9).
  const kopierKnopf = knopfStil(palette, 'neben');
  const kopieHinweis = kopie && React.createElement('div', {
    role: 'status', style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' },
  }, t(kopie === 'ok' ? 'beta.feedback.copied' : 'beta.feedback.copyFailed'));

  if (phase === 'frueher') {
    return React.createElement('div', {
      style: { textAlign: 'center', margin: space['2xl'] + 'px 0', fontSize: text.sm, color: palette.mid },
    }, t('beta.feedback.thanksLater'));
  }

  if (phase === 'offen') {
    return React.createElement('div', {
      style: {
        textAlign: 'center', padding: space.lg + 'px', margin: space['2xl'] + 'px 0',
        background: palette.sageMist || palette.up, borderRadius: radius.lg,
      }
    },
      React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.medium, color: palette.text } }, t('beta.feedback.thanks')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, t('beta.feedback.thanksDetail')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.md + 'px' } },
        t('beta.feedback.noMailApp') + ' ',
        React.createElement('button', { type: 'button', onClick: kopieren, style: kopierKnopf }, t('beta.feedback.copy')),
        ' · ',
        React.createElement('a', { href, style: linkStil(palette) }, t('beta.feedback.reopen'))
      ),
      kopieHinweis
    );
  }

  if (!expanded) {
    return React.createElement('div', { style: { textAlign: 'center', margin: space['2xl'] + 'px 0' } },
      React.createElement('button', {
        onClick: () => setExpanded(true),
        style: knopfStil(palette, 'neben')
      }, t('beta.feedback.title'))
    );
  }

  const radioStyle = (selected) => ({
    ...auswahlStil(palette, selected), padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm,
    fontWeight: selected ? weight.medium : weight.normal,
  });

  // Erst den Merker setzen, dann das Mailprogramm öffnen. Die Antworten werden nicht
  // gespeichert — sie stehen im Entwurf, und den schickt die Person selbst.
  const handleSubmit = () => {
    try { localStorage.setItem(storageKey, 'done'); } catch { /* ignore */ }
    try { window.location.href = href; } catch { /* Kopier-Ausweg bleibt */ }
    setPhase('offen');
  };

  return React.createElement('div', {
    style: {
      margin: space['2xl'] + 'px 0', padding: space.lg + 'px', borderRadius: radius.lg,
      background: palette.sageMist || palette.up, border: '1px solid ' + palette.border + '44',
    }
  },
    React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.body, color: palette.text, marginBottom: space.xs + 'px' } }, t('beta.feedback.title')),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.lg + 'px' } }, t('beta.feedback.subtitle')),

    React.createElement('div', { style: { marginBottom: space.lg + 'px' } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, marginBottom: space.sm + 'px' } }, t('beta.feedback.q1')),
      React.createElement('div', { style: { display: 'flex', gap: space.sm + 'px', flexWrap: 'wrap' } },
        React.createElement('button', { onClick: () => setQ1('yes'), style: radioStyle(q1 === 'yes') }, t('beta.feedback.scaleYes')),
        React.createElement('button', { onClick: () => setQ1('mostly'), style: radioStyle(q1 === 'mostly') }, t('beta.feedback.scaleMostly')),
        React.createElement('button', { onClick: () => setQ1('unclear'), style: radioStyle(q1 === 'unclear') }, t('beta.feedback.scaleUnclear'))
      )
    ),

    React.createElement('div', { style: { marginBottom: space.lg + 'px' } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, marginBottom: space.sm + 'px' } }, t('beta.feedback.q2')),
      React.createElement('div', { style: { display: 'flex', gap: space.sm + 'px', flexWrap: 'wrap' } },
        React.createElement('button', { onClick: () => setQ2('high'), style: radioStyle(q2 === 'high') }, t('beta.feedback.trustHigh')),
        React.createElement('button', { onClick: () => setQ2('ok'), style: radioStyle(q2 === 'ok') }, t('beta.feedback.trustOk')),
        React.createElement('button', { onClick: () => setQ2('low'), style: radioStyle(q2 === 'low') }, t('beta.feedback.trustLow'))
      )
    ),

    React.createElement('div', { style: { marginBottom: space.lg + 'px' } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, marginBottom: space.sm + 'px' } }, t('beta.feedback.q3')),
      React.createElement('textarea', {
        value: q3, onChange: (e) => setQ3(e.target.value), 'aria-label': t('beta.feedback.q3'),
        placeholder: t('beta.feedback.q3placeholder'),
        rows: 3,
        style: {
          width: '100%', padding: space.sm + 'px', fontSize: text.sm, fontFamily: 'inherit',
          border: '1px solid ' + palette.feldrand, borderRadius: radius.md,
          background: palette.surface, color: palette.text, resize: 'vertical',
          boxSizing: 'border-box',
        }
      })
    ),

    // Vorschau: genau der Text, der im Entwurf steht — erst wenn etwas beantwortet ist.
    !leer && React.createElement('div', { style: { marginBottom: space.lg + 'px' } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, marginBottom: space.sm + 'px' } }, t('beta.feedback.previewTitle')),
      React.createElement('pre', {
        style: {
          margin: 0, padding: space.sm + 'px ' + space.md + 'px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          fontFamily: 'inherit', fontSize: text.sm, lineHeight: leading.relaxed,
          border: '1px solid ' + palette.border, borderRadius: radius.md,
          background: palette.surface, color: palette.text,
        }
      }, t('beta.feedback.to') + ': info@malojaplana.ch\n\n' + entwurf)
    ),

    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.md + 'px', flexWrap: 'wrap' } },
      React.createElement('button', {
        type: 'button',
        onClick: handleSubmit,
        disabled: leer,
        style: knopfStil(palette, 'haupt', { disabled: leer })
      }, t('beta.feedback.submit')),
      !leer && React.createElement('button', { type: 'button', onClick: kopieren, style: kopierKnopf }, t('beta.feedback.copy'))
    ),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.sm + 'px' } }, t('beta.feedback.submitHint')),
    kopieHinweis
  );
};

export default BetaFeedback;
