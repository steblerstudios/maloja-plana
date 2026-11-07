import React, { useState } from 'react';
import { text, weight, leading, space, radius } from '../config/tokens.js';
import { useT } from '../i18n/index.js';
import { betaFeedbackText, betaFeedbackHref } from '../utils/betaFeedbackMail.js';
import { tageLoeschen } from '../utils/nutzungsTage.js';
import { nutzungstageImMonat, feedbackRuht, feedbackMerken } from '../utils/nutzungsAnzeige.js';
import { knopfStil, linkStil, auswahlStil } from './PrimaryButton.jsx';
import { version as APP_VERSION } from '../../package.json';

// Eigene Datei und per React.lazy geladen (02.11.2026): Dashboard.jsx liegt im Startbündel.
// Beta-Feedback (26.10.2026, Entscheid Stebler Studios): der Knopf hiess «Feedback senden», schickte
// aber nichts — die Antworten lagen nur im Gerätespeicher, wo sie niemand liest. Jetzt wird
// daraus ein Mail-Entwurf, der vor dem Klick sichtbar dasteht. Gesendet wird erst mit dem
// eigenen Klick im Mailprogramm; wer keins hat, kopiert den Text. Auf dem Gerät bleibt nur
// der Merker «erledigt», die Antworten selbst nicht.
export const BetaFeedback = ({ palette, t }) => {
  const { lang } = useT();
  // 'neu' = Formular · 'offen' = Entwurf eben geöffnet (diese Sitzung) · 'frueher' = beantwortet,
  // ruht · 'weg' = weggeklickt, ruht. Nach 90 Tagen ist wieder 'neu' (Stebler Studios, 02.11.2026).
  const [phase, setPhase] = useState(() => {
    const ruht = feedbackRuht();
    return ruht === 'beantwortet' ? 'frueher' : ruht === 'weggeklickt' ? 'weg' : 'neu';
  });
  const [expanded, setExpanded] = useState(false);
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [kopie, setKopie] = useState(''); // '' · 'ok' · 'fehler'
  // Zahl der Tage im Monat: bleibt auf dem Gerät, geht nur angekreuzt in den Entwurf (02.11.2026).
  const [tage, setTage] = useState(() => nutzungstageImMonat());
  const [nutzungMit, setNutzungMit] = useState(false);

  const leer = !q1 && !q2 && !q3.trim();
  const entwurf = betaFeedbackText({ q1, q2, q3, t, version: APP_VERSION, lang, nutzungstage: nutzungMit ? tage : null });
  const href = betaFeedbackHref(entwurf);

  const kopieren = async () => {
    // Erst beim Klick geladen: hält das Startbündel unter dem size-limit (#655).
    const ok = await import('../utils/zwischenablage.js')
      .then((m) => m.inZwischenablage(t('beta.feedback.to') + ': info@malojaplana.ch\n\n' + entwurf))
      .catch(() => false);
    setKopie(ok ? 'ok' : 'fehler');
  };

  // Knopfarten (Fassung 9): «Text kopieren» ist eine Handlung (Nebenknopf), «erneut öffnen» ein Link,
  // «Diesmal nicht» leise (Zählen ja, drängen nein), «Zahl löschen» Gefahr (es geht etwas verloren).
  const kopierKnopf = knopfStil(palette, 'neben');
  const kopieHinweis = kopie && React.createElement('div', {
    role: 'status', style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' },
  }, t(kopie === 'ok' ? 'beta.feedback.copied' : 'beta.feedback.copyFailed'));

  if (phase === 'weg') return null;

  if (phase === 'frueher') {
    return React.createElement('div', {
      style: { textAlign: 'center', margin: space.xl + 'px 0', fontSize: text.sm, color: palette.mid },
    }, t('beta.feedback.thanksLater'));
  }

  if (phase === 'offen') {
    return React.createElement('div', {
      style: {
        textAlign: 'center', padding: space.lg + 'px', margin: space.xl + 'px 0',
        background: palette.sageMist || palette.up, borderRadius: radius.md,
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
    return React.createElement('div', { style: { textAlign: 'center', margin: space.xl + 'px 0' } },
      React.createElement('button', {
        onClick: () => setExpanded(true),
        style: knopfStil(palette, 'neben')
      }, t('beta.feedback.title')),
      React.createElement('div', null,
        React.createElement('button', {
          type: 'button', style: knopfStil(palette, 'leise'),
          onClick: () => { feedbackMerken(true); setPhase('weg'); },
        }, t('beta.feedback.diesmalNicht'))
      )
    );
  }

  const radioStyle = (selected) => ({
    ...auswahlStil(palette, selected), padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm,
    fontWeight: selected ? weight.medium : weight.normal,
  });

  // Erst den Merker setzen, dann das Mailprogramm öffnen. Die Antworten werden nicht
  // gespeichert — sie stehen im Entwurf, und den schickt die Person selbst.
  const handleSubmit = () => {
    feedbackMerken();
    try { window.location.href = href; } catch { /* Kopier-Ausweg bleibt */ }
    setPhase('offen');
  };

  return React.createElement('div', {
    style: {
      margin: space.xl + 'px 0', padding: space.lg + 'px', borderRadius: radius.md,
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
          border: '1px solid ' + palette.border, borderRadius: radius.sm,
          background: palette.surface, color: palette.text, resize: 'vertical',
          boxSizing: 'border-box',
        }
      })
    ),

    tage > 0 && React.createElement('div', { style: { marginBottom: space.lg + 'px' } },
      React.createElement('label', { style: { display: 'flex', alignItems: 'flex-start', gap: space.sm + 'px', minHeight: '44px', cursor: 'pointer', fontSize: text.sm, color: palette.text } },
        React.createElement('input', { type: 'checkbox', checked: nutzungMit, onChange: (e) => setNutzungMit(e.target.checked), style: { marginTop: '3px' } }),
        React.createElement('span', null, t('beta.feedback.nutzungKaestchen', { n: tage }))
      ),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t('beta.feedback.nutzungHinweis')),
      React.createElement('button', {
        type: 'button', style: { ...knopfStil(palette, 'gefahr'), marginTop: space.sm + 'px' },
        onClick: () => { tageLoeschen(); setTage(0); setNutzungMit(false); },
      }, t('beta.feedback.nutzungLoeschen'))
    ),

    // Vorschau: genau der Text, der im Entwurf steht — erst wenn etwas beantwortet ist.
    !leer && React.createElement('div', { style: { marginBottom: space.lg + 'px' } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, marginBottom: space.sm + 'px' } }, t('beta.feedback.previewTitle')),
      React.createElement('pre', {
        style: {
          margin: 0, padding: space.sm + 'px ' + space.md + 'px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          fontFamily: 'inherit', fontSize: text.sm, lineHeight: leading.relaxed,
          border: '1px solid ' + palette.border, borderRadius: radius.sm,
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
