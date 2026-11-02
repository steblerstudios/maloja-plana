import React, { useState } from 'react';
import { text, space } from '../config/tokens.js';
import { nutzungstageImMonat, tageLoeschen, zaehlenErlaubt, zaehlenSetzen, feedbackErledigt } from '../utils/nutzungsTage.js';

// Zählung auf dem Gerät (02.11.2026): der immer erreichbare Ort zum Ansehen, Ablehnen und
// Löschen. Im Beispiel gibt es nichts zu zählen. Nach dem Beta-Feedback endet die Zählung,
// die Karte bleibt nur, solange noch eine Zahl zum Löschen da ist.
export const NutzungsZaehlung = ({ palette, t, demoMode }) => {
  const [an, setAn] = useState(() => zaehlenErlaubt());
  const [tage, setTage] = useState(() => nutzungstageImMonat());
  if (demoMode || (feedbackErledigt() && tage === 0)) return null;

  const umschalten = (e) => {
    const wert = e.target.checked;
    zaehlenSetzen(wert);
    setAn(wert);
    if (!wert) { tageLoeschen(); setTage(0); }
  };
  const loeschen = () => { tageLoeschen(); setTage(0); };

  return React.createElement('div', {
    style: { marginTop: space.lg + 'px', paddingTop: space.md + 'px', borderTop: '1px solid ' + palette.border },
  },
    React.createElement('div', { style: { fontSize: text.sm, fontWeight: 500, color: palette.text, marginBottom: space.xs + 'px' } }, t('legal.privacy.zaehlungTitle')),
    React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', minHeight: '44px', cursor: 'pointer', fontSize: text.sm, color: palette.text } },
      React.createElement('input', { type: 'checkbox', checked: an, onChange: umschalten }),
      React.createElement('span', null, t('beta.feedback.nutzungSchalter'))
    ),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t('beta.feedback.nutzungStand', { n: tage })),
    tage > 0 && React.createElement('button', {
      type: 'button', onClick: loeschen,
      style: { background: 'none', border: 'none', padding: space.xs + 'px 0', minHeight: '44px', cursor: 'pointer', color: palette.mid, fontSize: text.sm, fontFamily: 'inherit', textDecoration: 'underline' },
    }, t('beta.feedback.nutzungLoeschen'))
  );
};
