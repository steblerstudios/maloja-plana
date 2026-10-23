import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Werte 2027, Folge-PR zu #533 (Übergabe 22.10.2026, Befunde 1 und 2): Die Texte nannten die
// Werte 2026 fest — «22 680» (BVG-Eintrittsschwelle) in «Neuer Job» und «Lehre», «2 520 … Stand
// 2026» (maximale AHV-Rente) in «Lehre». Ab dem 1.1.2027 hätten sie der Rechnung widersprochen.
// Jetzt kommen Betrag und Jahr aus lohnWerte()/ahvWerte(); der Vorsorge-Rechner zeigt «Stand
// {jahr}» neben Rentenrahmen und BVG-Schwelle. Geprüft am gezeichneten Ablauf, mit fester Uhr.
// Der Reiter des Vorsorge-Rechners wird über den Startwert von useState gewählt.
let reiter = 'ahv';
vi.mock('react', async (original) => {
  const R = await original();
  const useState = (init) => R.useState(init === 'ahv' ? reiter : init);
  return { ...R, useState, default: { ...R.default, useState } };
});

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const { createT } = await import('../i18n/index.js');
const de = (await import('../i18n/de.js')).default;
const en = (await import('../i18n/en.js')).default;
const fr = (await import('../i18n/fr.js')).default;
const it_ = (await import('../i18n/it.js')).default;
const rm = (await import('../i18n/rm.js')).default;
const { Lehre } = await import('../Lehre.jsx');
const { NeuerJob } = await import('../NeuerJob.jsx');
const { VorsorgeRechner } = await import('../VorsorgeRechner.jsx');

const alle = { de, en, fr, it: it_, rm };
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
// HTML-Escaping von renderToStaticMarkup nachbilden; der Apostroph im Zahlformat ist ’ (U+2019) und bleibt.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const zeichne = (Komponente, props = {}, lang = 'de', anrede = 'sie') =>
  renderToStaticMarkup(React.createElement(Komponente, { palette, t: createT(alle, lang, anrede), onNavigate: () => {}, onUpdateData: () => {}, ...props }));

const uhr = (iso) => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date(iso)); };
afterEach(() => { vi.useRealTimers(); reiter = 'ahv'; });

// Je Jahr: was dastehen muss, und was nicht mehr dastehen darf.
const FAELLE = [
  { uhr: '2026-11-15T10:00:00', jahr: 2026, schwelle: '22’680', maxRente: '2’520', minRente: '1’260', alt: ['23’040', '2’560'] },
  { uhr: '2027-01-15T10:00:00', jahr: 2027, schwelle: '23’040', maxRente: '2’560', minRente: '1’280', alt: ['22’680', '2’520'] },
];

describe.each(FAELLE)('Uhr $uhr: Texte zeigen die Werte $jahr', (f) => {
  beforeEach(() => uhr(f.uhr));

  it('«Neuer Job», Schritt 2: Eintrittsschwelle aus der Tabelle, in allen Sprachen und beiden Anreden', () => {
    for (const lang of Object.keys(alle)) for (const anrede of ['sie', 'du']) {
      const html = zeichne(NeuerJob, {}, lang, anrede);
      expect(html, `${lang}/${anrede}`).toContain(f.schwelle);
      for (const a of f.alt) expect(html, `${lang}/${anrede}`).not.toContain(a);
      expect(html, `${lang}/${anrede}`).not.toMatch(/\{schwelle\}/);
    }
  });

  it('«Lehre», Schritte 4 und 5: Schwelle und maximale AHV-Rente samt «Stand {jahr}»', () => {
    const stand = { de: 'Stand', rm: 'Stand', fr: 'état', it: 'stato', en: 'as of' };
    for (const lang of Object.keys(alle)) for (const anrede of ['sie', 'du']) {
      const html = zeichne(Lehre, {}, lang, anrede);
      const k = `${lang}/${anrede}`;
      expect(html, k).toContain(f.schwelle);
      expect(html, k).toContain(f.maxRente);
      expect(html, k).toContain(`${stand[lang]} ${f.jahr}`);
      for (const a of f.alt) expect(html, k).not.toContain(a);
      expect(html, k).not.toMatch(/\{(schwelle|maxRente|jahr)\}/);
    }
  });

  it('Vorsorge-Rechner, Reiter AHV: Rentenrahmen mit «Stand {jahr}»', () => {
    const html = zeichne(VorsorgeRechner, { data: {
      basis: { canton: 'BS', dateOfBirth: '1985-01-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
      finanzen: { monthlyIncome: 6000, incomeType: 'brutto', dreizehnter: 'no' },
    } });
    expect(html).toContain(esc(`${de.vr.minMax}: CHF ${f.minRente} – ${f.maxRente} / ${de.vr.monat} (Stand ${f.jahr})`));
    // Quellenzeile darunter: dasselbe Jahr (swiss-precision-pruefer 23.10.2026)
    expect(html).toContain(`Keine rechtsverbindliche Auskunft. Stand ${f.jahr}.`);
    expect(html).not.toMatch(/\{jahr\}/);
  });

  // BVG Art. 2 Abs. 1 / Art. 7 Abs. 1: versichert ist, wer «mehr als» die Schwelle verdient — genau die
  // Schwelle ist nicht versichert. Darum «nicht über» (copy-pruefer 23.10.2026: «unter» + «≤» widersprach sich).
  it('Vorsorge-Rechner, Reiter BVG: «nicht über» der Schwelle und «Stand {jahr}»', () => {
    reiter = 'bvg';
    const html = zeichne(VorsorgeRechner, { data: {
      basis: { canton: 'BS', dateOfBirth: '2008-01-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
      finanzen: { monthlyIncome: 1500, incomeType: 'brutto', dreizehnter: 'no' },
    } });
    expect(html).toContain(esc(`Jahreslohn nicht über der BVG-Eintrittsschwelle (CHF ${f.schwelle}, Stand ${f.jahr})`));
    expect(html).not.toContain(esc('(< CHF'));
  });
});

describe('Uhr 2028 (Tabelle noch ohne Nachtrag): angezeigt wird das Jahr der Werte, nicht das laufende', () => {
  beforeEach(() => uhr('2028-03-01T10:00:00'));
  it('«Lehre» und Vorsorge-Rechner sagen «Stand 2027»', () => {
    const lehre = zeichne(Lehre);
    expect(lehre).toContain('Stand 2027');
    expect(lehre).not.toContain('Stand 2028');
    const vr = zeichne(VorsorgeRechner, { data: {
      basis: { canton: 'BS', dateOfBirth: '1985-01-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
      finanzen: { monthlyIncome: 6000, incomeType: 'brutto', dreizehnter: 'no' },
    } });
    expect(vr).toContain('(Stand 2027)');
  });
});

describe('Keine Zahl der Bundestabellen mehr fest in den Texten', () => {
  const texte = (v) => (v && typeof v === 'object' ? [v.sie, v.du] : [v]);
  it.each(Object.keys(alle))('%s: neuerJob.step2Text, lehre.step4Text, lehre.step5Text', (lang) => {
    const d = alle[lang];
    for (const s of [...texte(d.neuerJob.step2Text), ...texte(d.lehre.step4Text), ...texte(d.lehre.step5Text)]) {
      expect(s).not.toMatch(/22[\s,’']680|2[\s,’']520/);
      // 268 Fr. (FamZG) stehen in keiner Tabelle: kein festes «Stand 2026» neben «Stand {jahr}»,
      // sondern «seit 1. Januar 2025» (swiss-precision-pruefer 23.10.2026: FamZG ohne Fassung 1.1.2027)
      expect(s).not.toMatch(/(Stand|état|stato|as of) 2026/);
    }
  });
});
