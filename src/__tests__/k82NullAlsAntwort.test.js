import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import {
  NA_FELD, hatWert, feldHatWert, postenSumme, feldErledigt, naBereinigen,
  kapitelVollstaendigkeit, gesamtVollstaendigkeit, grundordnung,
} from '../utils/vollstaendigkeit.js';
import { gardenTrees } from '../data/obstgarten.js';
import { ChapterViewComplete } from '../ChapterView.jsx';
import { monthlyExpenses } from '../data/haushaltskosten.js';

// K82 (Entscheid Stebler Studios, 19.09.2026): Eine gespeicherte 0 in einem Betragsfeld ist
// eine echte Antwort. Sie zählt für die Vollständigkeit und bleibt als «0» sichtbar — wie beim
// Partnereinkommen seit K62.2. Ein leeres Feld (nie beantwortet oder gelöscht) bleibt leer.

const t = (k) => k;
const chapters = getChapters(t);
const kapitel = (key) => chapters.find((c) => c.key === key);
const betragsFelder = chapters.flatMap((c) => c.fields.filter((f) => f.type === 'currency').map((f) => [c.key, f.k]));

const LEER = ['', undefined, null];

describe('K82 · hatWert', () => {
  it('0 und "0" sind eine Antwort, ebenso jeder andere Betrag', () => {
    for (const v of [0, '0', '0.00', 1500, '1500', 0.5]) expect(hatWert(v), String(v)).toBe(true);
  });

  it('leer bleibt leer', () => {
    for (const v of [...LEER, NaN]) expect(hatWert(v), String(v)).toBe(false);
  });
});

describe('K82 · Vollständigkeit zählt die 0', () => {
  it('es gibt Betragsfelder, und jedes zählt eine gespeicherte 0 als erledigt', () => {
    expect(betragsFelder.length).toBeGreaterThan(20);
    for (const [kap, k] of betragsFelder) {
      expect(feldErledigt({ [k]: 0 }, k), kap + '.' + k).toBe(true);
    }
  });

  it('ein leeres oder gelöschtes Betragsfeld zählt nicht', () => {
    for (const [, k] of betragsFelder) {
      for (const v of LEER) expect(feldErledigt({ [k]: v }, k), k + '=' + String(v)).toBe(false);
    }
    expect(feldErledigt({}, 'rentAmount')).toBe(false);
    expect(feldErledigt(undefined, 'rentAmount')).toBe(false);
  });

  it('Kapitel, Gesamtzahl und Grundordnung zählen die 0 mit', () => {
    const wohnen = kapitel('wohnen');
    expect(kapitelVollstaendigkeit(wohnen, { rentAmount: 0 }).filled).toBe(1);
    expect(kapitelVollstaendigkeit(wohnen, { rentAmount: '' }).filled).toBe(0);

    const g = grundordnung(chapters, { finanzen: { monthlyIncome: 0 }, versicherungen: { kkPremium: 0 } });
    expect(g.fields.find((f) => f.key === 'monthlyIncome').done).toBe(true);
    expect(g.fields.find((f) => f.key === 'kkPremium').done).toBe(true);

    const mitNull = gesamtVollstaendigkeit(chapters, { wohnen: { rentAmount: 0, utilities: 0 } });
    const leer = gesamtVollstaendigkeit(chapters, { wohnen: { rentAmount: '', utilities: undefined } });
    expect(mitNull).toBeGreaterThan(leer);
    expect(leer).toBe(0);
  });

  it('Löschen macht das Feld wieder unbeantwortet', () => {
    const wohnen = kapitel('wohnen');
    let d = { rentAmount: 0 };
    expect(kapitelVollstaendigkeit(wohnen, d).filled).toBe(1);
    d = { ...d, rentAmount: '' };
    expect(kapitelVollstaendigkeit(wohnen, d).filled).toBe(0);
  });

  it('der Obstgarten zählt gleich wie das Kapitel', () => {
    const baeume = gardenTrees({ wohnen: { rentAmount: 0 } }, chapters);
    const wohnen = kapitel('wohnen');
    const baum = baeume.find((b) => b.chapterKey === 'wohnen');
    expect(baum.pct).toBe(kapitelVollstaendigkeit(wohnen, { rentAmount: 0 }).pct);
    expect(baum.pct).toBeGreaterThan(0);
  });

  it('eine 0 hebt «trifft nicht zu» auf wie jeder andere Wert (K45)', () => {
    const d = { alimentePaid: 0, [NA_FELD]: ['alimentePaid'] };
    expect(naBereinigen(d)[NA_FELD]).toEqual([]);
    const leer = { alimentePaid: '', [NA_FELD]: ['alimentePaid'] };
    expect(naBereinigen(leer)).toBe(leer);
  });
});

describe('K82 · Mehrfach-Einträge (Lebensmittel, Kommunikation)', () => {
  it('postenSumme: ohne eingetragenen Betrag leer, sonst die Zahl (auch 0)', () => {
    expect(postenSumme([])).toBe('');
    expect(postenSumme([{ label: 'Migros', amount: '' }])).toBe('');
    expect(postenSumme([{ label: 'Migros', amount: '0' }])).toBe(0);
    expect(postenSumme([{ label: 'A', amount: '120' }, { label: 'B', amount: '30.5' }])).toBe(150.5);
  });

  it('eine alte 0 aus einer geleerten Postenliste zählt nicht als Antwort', () => {
    expect(feldHatWert({ groceries: 0, groceriesItems: [] }, 'groceries')).toBe(false);
    expect(feldErledigt({ groceries: 0, groceriesItems: [] }, 'groceries')).toBe(false);
    expect(feldHatWert({ groceries: 0, groceriesItems: [{ label: '', amount: '0' }] }, 'groceries')).toBe(true);
    // Einzelbetrag 0 ohne Postenliste (älterer Stand) ist eine Antwort.
    expect(feldHatWert({ groceries: 0 }, 'groceries')).toBe(true);
  });
});

describe('K82 · Rechner rechnen gleich', () => {
  it('Haushaltsausgaben: 0, "" und fehlend ergeben dieselbe Summe', () => {
    const basis = { wohnen: { rentAmount: '1500' } };
    const a = monthlyExpenses({ ...basis, finanzen: { groceries: 0 } });
    const b = monthlyExpenses({ ...basis, finanzen: { groceries: '' } });
    const c = monthlyExpenses({ ...basis, finanzen: {} });
    expect(a).toBe(1500);
    expect(b).toBe(1500);
    expect(c).toBe(1500);
  });
});

describe('K82 · Anzeige im Kapitel', () => {
  const render = (key, data) => renderToStaticMarkup(React.createElement(ChapterViewComplete, {
    palette: LIGHT_PALETTE, t, chapter: kapitel(key), data, allData: { [key]: data },
    onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
  }));
  const wertVon = (html, id) => {
    const m = html.match(new RegExp('<input[^>]*id="' + id + '"[^>]*>'));
    if (!m) return 'FEHLT';
    const v = m[0].match(/ value="([^"]*)"/);
    return v ? v[1] : '';
  };

  it('eine gespeicherte 0 steht als «0» im Betragsfeld', () => {
    const html = render('wohnen', { rentAmount: 0, utilities: 0 });
    expect(wertVon(html, 'wohnen-rentAmount')).toBe('0');
    expect(wertVon(html, 'wohnen-utilities')).toBe('0');
  });

  it('ein leeres oder gelöschtes Feld bleibt leer', () => {
    for (const v of LEER) {
      const html = render('wohnen', { rentAmount: v });
      expect(wertVon(html, 'wohnen-rentAmount'), String(v)).toBe('');
    }
  });

  it('eine 0 in «Alimente bezahlt» zeigt das Feld mit «0», ohne «trifft nicht zu»-Hinweis davor', () => {
    const html = render('finanzen', { alimentePaid: 0 });
    expect(wertVon(html, 'finanzen-alimentePaid')).toBe('0');
  });
});

describe('K82 · Beispiel-Datensatz', () => {
  it('die Vollständigkeit des Beispiels bleibt, wie sie war (keine 0 in Betragsfeldern)', () => {
    for (const [kap, k] of betragsFelder) {
      const v = DEMO_DATA[kap] && DEMO_DATA[kap][k];
      expect(v === 0 || v === '0', kap + '.' + k).toBe(false);
    }
  });
});
