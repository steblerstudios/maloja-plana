import { describe, it, expect, vi, afterEach } from 'vitest';

// Befund aus dem Tor 0.1.47 (#524), Entscheid Sophie 22.10.2026: Der Schalter «Verheiratet» im
// Vorsorge-Rechner entscheidet über die Halbierung der Erziehungs-/Betreuungsgutschriften. Vorher
// teilte der Rechner auch bei «Nein», sobald das Profil «verheiratet» sagte. Bei «Nein» wird nur noch
// geteilt, wenn das Profil eine frühere Ehe nennt (geschieden, verwitwet, aufgelöste Partnerschaft).
// Gezeichneter Rechner; Schalter und Erziehungsjahre über den Startwert von useState gesetzt.
let schalter = null;        // null = Startwert aus dem Profil
let erziehungsjahre = '10'; // zweites useState('') im Rechner (nach «Beitragsjahre»)
let leerZaehler = 0;
vi.mock('react', async (original) => {
  const R = await original();
  const useState = (init) => {
    let start = init;
    if (init === '' && leerZaehler++ === 1) start = erziehungsjahre;
    if (typeof init === 'boolean' && schalter !== null && init === !schalter) start = schalter; // nur der Verheiratet-Schalter weicht vom Profil ab
    return R.useState(start);
  };
  return { ...R, useState, default: { ...R.default, useState } };
});

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const de = (await import('../i18n/de.js')).default;
const { VorsorgeRechner } = await import('../VorsorgeRechner.jsx');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (schluessel, p) => {
  const wert = String(schluessel).split('.').reduce((o, k) => (o == null ? undefined : o[k]), de);
  let text = wert && typeof wert === 'object' ? (wert.sie ?? Object.values(wert)[0]) : wert;
  if (typeof text !== 'string') return schluessel;
  if (p) for (const [k, v] of Object.entries(p)) text = text.split('{' + k + '}').join(String(v));
  return text;
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const zeichne = (zivilstand) => {
  leerZaehler = 0;
  const data = {
    basis: { canton: 'BS', dateOfBirth: (new Date().getFullYear() - 40) + '-01-01', maritalStatus: zivilstand, household: { adults: 1, children: [] } },
    finanzen: { monthlyIncome: 3000, incomeType: 'brutto', dreizehnter: 'no' },
  };
  return renderToStaticMarkup(React.createElement(VorsorgeRechner, { palette, t, data, onNavigate: () => {}, onUpdateData: () => {} }));
};
const geteilt = (html) => html.includes(esc(t('vr.gutschriftGeteilt')));

afterEach(() => { schalter = null; erziehungsjahre = '10'; });

describe('Schalter «Verheiratet» entscheidet über die Halbierung der Gutschriften', () => {
  it('Profil verheiratet, Schalter Ja (Start) → geteilt', () => {
    expect(geteilt(zeichne('married'))).toBe(true);
  });
  it('Profil verheiratet, Schalter auf Nein → NICHT geteilt (vorher geteilt)', () => {
    schalter = false;
    expect(geteilt(zeichne('married'))).toBe(false);
  });
  it('Profil ledig, Schalter Nein → nicht geteilt; Schalter Ja → geteilt', () => {
    expect(geteilt(zeichne('single'))).toBe(false);
    schalter = true;
    expect(geteilt(zeichne('single'))).toBe(true);
  });
  it('Profil geschieden, verwitwet, aufgelöst: Schalter Nein → geteilt (Ehejahre liegen zurück)', () => {
    for (const z of ['divorced', 'widowed', 'dissolvedPartnership']) expect(geteilt(zeichne(z)), z).toBe(true);
  });
  it('ohne Gutschriftjahre kein Hinweis', () => {
    erziehungsjahre = '';
    expect(geteilt(zeichne('married'))).toBe(false);
  });
});
