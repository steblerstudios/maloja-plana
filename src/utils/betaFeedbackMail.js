// Beta-Feedback als Mail-Entwurf (26.10.2026, Entscheid Sophie).
//
// Gleiche Bauweise wie der Feedback-Link in der Fusszeile (main.jsx) und der Melde-Weg
// am Fehlerschirm: Betreff + abgetrennter Kontext-Block. Nichts wird automatisch
// gesendet — die Person sieht den Text vorher in der App und schickt ihn selbst aus
// dem eigenen Mailprogramm. Nur die Antworten aus dem Formular plus drei unkritische
// Werte, keine Daten aus dem Lebensordner.

const ANTWORT_SCHLUESSEL = {
  q1: { yes: 'scaleYes', mostly: 'scaleMostly', unclear: 'scaleUnclear' },
  q2: { high: 'trustHigh', ok: 'trustOk', low: 'trustLow' },
};

export function betaFeedbackText({ q1, q2, q3, t, version, lang }) {
  const teile = [];
  for (const [frage, wert] of [['q1', q1], ['q2', q2]]) {
    const k = ANTWORT_SCHLUESSEL[frage][wert];
    if (k) teile.push(t('beta.feedback.' + frage) + '\n' + t('beta.feedback.' + k));
  }
  const frei = String(q3 || '').trim();
  if (frei) teile.push(t('beta.feedback.q3') + '\n' + frei);
  return teile.join('\n\n')
    + '\n\n— — —\n' + t('beta.feedbackContext') + '\n'
    + 'Version: ' + version + '\n'
    + 'Ansicht: Beta-Feedback\n'
    + 'Sprache: ' + lang;
}

export function betaFeedbackHref(text) {
  return 'mailto:info@malojaplana.ch?subject='
    + encodeURIComponent('Maloja Plana Beta Feedback')
    + '&body=' + encodeURIComponent(text);
}
