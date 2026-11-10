import { describe, it, expect, vi, afterEach } from 'vitest';

// Bugsuche 09.11.2026, B-18 · Im Zukunftsbild kommt die AHV nie vor dem frühesten Vorbezug.
// Der Regler setzt das Rücktrittsalter ab 58 (BVG/3a). Vorher rechnete das Bild die AHV ab dem
// Rücktritt (bei 58 rund 84 Monate Vorbezugsrente) und zählte die Beitragsjahre nur bis 58 —
// wer früher aufhörte, sah ein grösseres AHV-Fundament und eine höhere Rente ab 65.
// Erwartet: AHV wie bei Bezug am frühesten Tag (Mann: 63), Beitragspflicht bis dahin läuft weiter.

let reiter = 'zukunft';
let bezugAlter = '63';
vi.mock('react', async (original) => {
  const R = await original();
  const useState = (init) => {
    let start = init === 'ahv' ? reiter : init;
    if (typeof start === 'function') {
      start = start();
      if (start === '65') start = bezugAlter; // Startwert des Bezugsalters = Referenzalter
    }
    return R.useState(start);
  };
  return { ...R, useState, default: { ...R.default, useState } };
});

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const de = (await import('../i18n/de.js')).default;
const { VorsorgeRechner } = await import('../VorsorgeRechner.jsx');
const { ahvBezugAlterFuer, ahvKapitalImBild } = await import('../utils/ahvZukunftsbild.js');

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
// AHV-Zeilen der Monatsrente im Zukunftsbild (Legende «AHV CHF … / Monat» und «AHV ab 65 …»).
const ahvZeilen = (html) => (html.match(/AHV (?:CHF|ab)[^<]*/g) || []).join(' | ');

afterEach(() => { reiter = 'zukunft'; bezugAlter = '63'; });

describe('ahvBezugAlterFuer / ahvKapitalImBild', () => {
  const mann = { fruehesterBezugMonate: 63 * 12, refAlterJahre: 65, lebenserwartung: 85, monatsrente: 1962, monatsrenteReferenzalter: 2070 };

  it('Rücktritt vor 63: AHV-Bezug bleibt 63', () => {
    expect(ahvBezugAlterFuer(58, 63 * 12)).toBe(63);
    expect(ahvBezugAlterFuer(66, 63 * 12)).toBe(66);
  });

  it('Rücktritt 58 ergibt dieselbe AHV-Fläche wie 63 — nicht mehr', () => {
    expect(ahvKapitalImBild({ ...mann, ruecktrittJahre: 58 })).toEqual(ahvKapitalImBild({ ...mann, ruecktrittJahre: 63 }));
    expect(ahvKapitalImBild({ ...mann, ruecktrittJahre: 58 }).vorbezugM).toBe(24);
  });

  it('ab 63 unverändert: Vorbezugsmonate bis 65, danach die neu berechnete Rente', () => {
    expect(ahvKapitalImBild({ ...mann, ruecktrittJahre: 65 })).toMatchObject({ horizonM: 240, vorbezugM: 0, kapital: 2070 * 240 });
    expect(ahvKapitalImBild({ ...mann, ruecktrittJahre: 63 })).toMatchObject({ horizonM: 264, vorbezugM: 24, kapital: 1962 * 24 + 2070 * 240 });
  });
});

describe('Frauen der Übergangsgeneration (Fachprüfung 09.11.2026)', () => {
  // fruehesterVorbezugMonate sagt 62 (Art. 40c AHVG), berechneAltersrente kürzt aber höchstens
  // 24 Monate und kennt deren tiefere Sätze noch nicht (D10). Ab 62 gäbe es bei JG 1964 36 Monate
  // Rente mit der Kürzung für 24. Das Bild beginnt deshalb, wo der Rechner rechnen kann: 63.
  it('Frau JG 1964, Rücktritt 58: AHV-Bezug im Bild 63, höchstens 24 Monate Vorbezug', async () => {
    const { fruehesterAhvBezugImBildMonate } = await import('../utils/ahvZukunftsbild.js');
    const { referenzalterMonate } = await import('../data/ahvRechner.js');
    const ref = referenzalterMonate({ geschlecht: 'female', geburtsjahr: 1964 });
    const frueh = fruehesterAhvBezugImBildMonate(ref);
    expect(frueh).toBe(63 * 12);
    const bild = ahvKapitalImBild({ ruecktrittJahre: 58, fruehesterBezugMonate: frueh, refAlterJahre: ref / 12, lebenserwartung: 88, monatsrente: 1, monatsrenteReferenzalter: 1 });
    expect(bild.vorbezugM).toBeLessThanOrEqual(24);
  });
  it('Frau JG 1962 (Referenzalter 64 J 6 M): nie früher als 63', async () => {
    const { fruehesterAhvBezugImBildMonate } = await import('../utils/ahvZukunftsbild.js');
    expect(fruehesterAhvBezugImBildMonate(64 * 12 + 6)).toBe(63 * 12);
  });
});

describe('Vorsorge-Rechner, Reiter Zukunft', () => {
  it('Rücktritt mit 58 zeigt dieselbe AHV wie Bezug mit 63', () => {
    bezugAlter = '63';
    const mit63 = ahvZeilen(zeichne(profil));
    bezugAlter = '58';
    const mit58 = ahvZeilen(zeichne(profil));
    expect(mit63).not.toBe('');
    expect(mit58).toBe(mit63);
  });
});
