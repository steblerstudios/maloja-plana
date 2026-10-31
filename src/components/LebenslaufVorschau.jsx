import React from 'react';
import { text, weight, radius, space, leading } from '../config/tokens.js';

// Kapitel Ausbildung · Vorschau des Lebenslaufs (Fassung 6, Runde 9, Entwurf AC, Entscheid Sophie 24.10.2026
// «Lohn-Barometer & Lebenslauf-Vorschau»; gebaut Abnahme 25.10.2026). Eine ruhige Papierkarte nur aus dem, was
// schon erfasst ist — Persönliche Basis, Wohnort und dieses Kapitel. Nichts wird erfunden oder ergänzt; was
// fehlt, bleibt weg. Der Knopf führt in den Lebenslauf (`cv`), wo man es als PDF druckt.

const monatJahr = (iso) => {
  const m = /^(\d{4})-(\d{2})/.exec(String(iso || ''));
  return m ? m[2] + '/' + m[1] : null;
};

// Was auf dem Blatt steht. null: ohne Name oder ohne einen Abschnitt gibt es nichts zu zeigen.
export const lebenslaufInhalt = (t, ausbildung, allData) => {
  const a = ausbildung || {};
  const b = allData?.basis || {};
  const name = [b.firstName, b.lastName].filter(Boolean).join(' ');
  const stufe = a.educationLevel ? (t('chapters.ausbildung.fields.educationLevel.options.' + a.educationLevel) || a.educationLevel) : null;

  const kopfZeile = [a.jobTitle, allData?.wohnen?.city, b.email].filter(Boolean).join(' · ');
  const erfahrung = (a.jobTitle || a.employer)
    ? [monatJahr(a.employmentStart) && t('lebenslaufVorschau.seit', { datum: monatJahr(a.employmentStart) }), [a.jobTitle, a.employer].filter(Boolean).join(', ')].filter(Boolean).join(' · ')
    : null;
  const bildung = [[stufe, a.schoolName].filter(Boolean).join(', '), a.certifications].filter(Boolean).join(' · ');
  const abschnitte = [
    erfahrung && { key: 'erfahrung', titel: t('lebenslaufVorschau.erfahrung'), wert: erfahrung },
    bildung && { key: 'bildung', titel: t('lebenslaufVorschau.bildung'), wert: bildung },
    a.languages && { key: 'sprachen', titel: t('lebenslaufVorschau.sprachen'), wert: a.languages },
  ].filter(Boolean);
  return !name || abschnitte.length === 0 ? null : { name, kopfZeile, abschnitte };
};

// Papierkarte: heller Grund in beiden Modi, Text in fester dunkler Farbe — wie ein Blatt. Auch die Seite
// «Lebenslauf» zeigt dieses Blatt (F7-R5, 31.10.2026).
export const LebenslaufBlatt = ({ palette, inhalt }) => {
  const h = React.createElement;
  return h('div', { 'data-teil': 'lebenslauf-blatt', style: { background: palette.paper || '#FBF8F2', color: '#2B2A27', borderRadius: radius.sm, padding: space.md + 'px', border: '1px solid ' + palette.border, lineHeight: leading.normal } },
    h('div', { style: { fontSize: text.body, fontWeight: weight.semi } }, inhalt.name),
    inhalt.kopfZeile && h('div', { style: { fontSize: text.xs, color: '#5C5850', marginBottom: space.sm + 'px', overflowWrap: 'break-word' } }, inhalt.kopfZeile),
    ...inhalt.abschnitte.map((x) => h('div', { key: x.key, style: { marginTop: space.xs + 'px' } },
      h('div', { style: { fontSize: '11px', fontWeight: weight.semi, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#5C5850' } }, x.titel),
      h('div', { style: { fontSize: text.xs, overflowWrap: 'break-word' } }, x.wert)
    ))
  );
};

export const LebenslaufVorschau = ({ palette, t, ausbildung, allData, onNavigate }) => {
  const inhalt = lebenslaufInhalt(t, ausbildung, allData);
  if (!inhalt) return null;

  const h = React.createElement;
  return h('section', { 'data-teil': 'lebenslauf-vorschau', 'aria-labelledby': 'mp-lebenslauf-vorschau', style: { marginBottom: space.lg + 'px' } },
    h('h4', { id: 'mp-lebenslauf-vorschau', style: { margin: '0 0 ' + space.sm + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('lebenslaufVorschau.titel')),
    h(LebenslaufBlatt, { palette, inhalt }),
    onNavigate && h('button', {
      type: 'button', className: 'mp-link', onClick: () => onNavigate('cv'),
      style: { marginTop: space.sm + 'px', minHeight: '44px', padding: '0 ' + space.md + 'px', background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm, fontSize: text.sm, fontWeight: weight.medium, color: palette.text, cursor: 'pointer', fontFamily: 'inherit' },
    }, t('lebenslaufVorschau.erstellen'), ' ›'),
    h('p', { style: { margin: space.xs + 'px 0 0', fontSize: text.xs, color: palette.mid, lineHeight: leading.normal } }, t('lebenslaufVorschau.woher'))
  );
};

export default LebenslaufVorschau;
