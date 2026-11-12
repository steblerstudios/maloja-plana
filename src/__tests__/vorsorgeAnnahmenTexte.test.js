import { describe, it, expect, vi, afterEach } from 'vitest';

// Offene Text-Punkte aus den Fachprüfungen zu B-17/B-18 (10.11.2026):
// - Mit IK nannte das Zukunftsbild nur die IK-Rohwerte (z. B. 20 Jahre), rechnete aber mit den
//   hochgerechneten (44 Jahre). Jetzt steht beides da.
// - Bei Rücktritt vor dem frühesten AHV-Bezug nannte es seine Annahmen nicht (frühester Bezug,
//   Beiträge als Nichterwerbstätige, vereinfacht mit dem bisherigen Einkommen).

let bezugAlter = '65';
vi.mock('react', async (original) => {
  const R = await original();
  const useState = (init) => {
    let start = init === 'ahv' ? 'zukunft' : init;
    if (typeof start === 'function') { start = start(); if (start === '65') start = bezugAlter; }
    return R.useState(start);
  };
  return { ...R, useState, default: { ...R.default, useState } };
});

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const de = (await import('../i18n/de.js')).default;
const { VorsorgeRechner } = await import('../VorsorgeRechner.jsx');
const { vorbelegeIKAuszug } = await import('../data/ahvRechner.js');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (schluessel, p) => {
  const wert = String(schluessel).split('.').reduce((o, k) => (o == null ? undefined : o[k]), de);
  let text = wert && typeof wert === 'object' ? (wert.sie ?? Object.values(wert)[0]) : wert;
  if (typeof text !== 'string') return schluessel;
  if (p) for (const [k, v] of Object.entries(p)) text = text.split('{' + k + '}').join(String(v));
  return text;
};
const zeichne = (data) => renderToStaticMarkup(React.createElement(VorsorgeRechner, { palette, t, data, onNavigate: () => {}, onUpdateData: () => {} }));
const geburtsjahr = new Date().getFullYear() - 40;
const profil = {
  basis: { canton: 'BS', gender: 'male', dateOfBirth: geburtsjahr + '-01-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 6153.85, incomeType: 'brutto', dreizehnter: 'yes' },
};
const anfang = (k) => t(k, { jahre: '§', eink: '§' }).split('§')[0].replace(/'/g, '&#x27;');

afterEach(() => { bezugAlter = '65'; });

describe('Zukunftsbild nennt, womit es rechnet', () => {
  it('mit IK: die hochgerechneten Werte stehen neben den IK-Rohwerten', () => {
    const html = zeichne({ ...profil, vorsorge: { ikActive: true, ikAuszug: vorbelegeIKAuszug({ geburtsjahr, aktuellesAlter: 40, aktuellesEinkommen: 80000 }) } });
    expect(html).toContain(anfang('vr.zukunftIkAktiv'));
    expect(html).toContain(anfang('vr.zukunftIkHochgerechnet') + '44');
  });

  it('ohne IK kein Hochrechnungs-Satz', () => {
    expect(zeichne(profil)).not.toContain(anfang('vr.zukunftIkHochgerechnet'));
  });

  it('Rücktritt mit 58: die Annahmen stehen da', () => {
    bezugAlter = '58';
    expect(zeichne(profil)).toContain(anfang('vr.zukunftAhvAnnahme').slice(0, 40));
  });

  it('Rücktritt mit 65: kein Annahmen-Satz zum frühen Bezug', () => {
    expect(zeichne(profil)).not.toContain(anfang('vr.zukunftAhvAnnahme').slice(0, 40));
  });
});
