import { describe, it, expect } from 'vitest';
import { schildState } from '../data/schutzschild.js';

describe('schildState: zwei Schilde — Pflicht (gesetzlich) und Empfohlen', () => {
  it('leeres Kapitel → nicht berührt, nichts gedeckt (Schild bleibt aus)', () => {
    const st = schildState({});
    expect(st.touched).toBe(false);
    expect(st.overall.covered).toBe(0);
  });

  it('nicht angestellt: Pflicht = nur Krankenversicherung (kein UVG/BVG-Fehlalarm)', () => {
    const st = schildState({ kkInsurer: 'CSS' }, { employed: false });
    expect(st.pflicht.items.map(i => i.key)).toEqual(['kk']);
    expect(st.pflicht.covered).toBe(1);
    expect(st.pflicht.allCovered).toBe(true);
    expect(st.empfohlen.total).toBe(2);
    expect(st.empfohlen.covered).toBe(0);
    expect(st.overall.total).toBe(3);
  });

  it('angestellt über Eintrittsschwelle: Pflicht = KK + UVG + BVG', () => {
    const st = schildState(
      { kkInsurer: 'CSS', uvg: 'employer', bvgInsurer: 'AXA' },
      { employed: true, annualIncome: 60000 },
    );
    expect(st.pflicht.items.map(i => i.key)).toEqual(['kk', 'uvg', 'bvg']);
    expect(st.pflicht.covered).toBe(3);
    expect(st.pflicht.allCovered).toBe(true);
  });

  it('angestellt UNTER BVG-Eintrittsschwelle: BVG ist nicht Pflicht (nur KK + UVG)', () => {
    const st = schildState({ kkInsurer: 'CSS' }, { employed: true, annualIncome: 12000 });
    expect(st.pflicht.items.map(i => i.key)).toEqual(['kk', 'uvg']);
    expect(st.pflicht.gaps).toEqual(['uvg']); // UVG noch offen
  });

  it('Empfohlen: Haftpflicht + Hausrat, „nein" zählt nicht als gedeckt', () => {
    const st = schildState({ kkInsurer: 'CSS', liabilityInsurance: 'yes', householdInsurance: 'no' });
    expect(st.empfohlen.covered).toBe(1);
    expect(st.empfohlen.gaps).toEqual(['hausrat']);
  });

  it('alles gedeckt (angestellt, alle Absicherungen) → overall voll', () => {
    const st = schildState(
      { kkInsurer: 'CSS', uvg: 'yes', bvgContribution: '500', liabilityInsurance: 'yes', householdInsurance: 'yes' },
      { employed: true, annualIncome: 80000 },
    );
    expect(st.overall.covered).toBe(5);
    expect(st.overall.total).toBe(5);
    expect(st.overall.fraction).toBe(1);
  });

  it('nur UVG-Angabe berührt das Schild', () => {
    expect(schildState({ uvg: 'none' }).touched).toBe(true);
  });

  it('nur Leerzeichen bei kkInsurer → nicht gedeckt, nicht berührt', () => {
    const st = schildState({ kkInsurer: '   ' });
    expect(st.pflicht.covered).toBe(0);
    expect(st.touched).toBe(false);
  });
});

// 25.09.2026 (#388): die BVG-Eintrittsschwelle ist ein BRUTTOlohn. Unter der Schwelle, aber
// als Netto (oder ohne Lohnart) erfasst, ist die Pflicht offen — keine Lücke, aber benannt.
describe('schildState: BVG-Pflicht bei Nettolohn unter der Schwelle ist offen', () => {
  const unter = { employed: true, annualIncome: 20000 };
  it('brutto unter der Schwelle: nicht Pflicht, nicht offen', () => {
    const st = schildState({ kkInsurer: 'CSS' }, { ...unter, lohnBasis: 'brutto' });
    expect(st.pflicht.items.map(i => i.key)).toEqual(['kk', 'uvg']);
    expect(st.bvgUnklar).toBe(false);
  });
  it.each([['netto'], [null]])('%s unter der Schwelle: nicht als Lücke gezählt, aber offen', (lohnBasis) => {
    const st = schildState({ kkInsurer: 'CSS' }, { ...unter, lohnBasis });
    expect(st.pflicht.items.map(i => i.key)).toEqual(['kk', 'uvg']);
    expect(st.bvgUnklar).toBe(true);
  });
  it('netto ÜBER der Schwelle: Pflicht belegt (brutto liegt noch höher)', () => {
    const st = schildState({ kkInsurer: 'CSS' }, { employed: true, annualIncome: 30000, lohnBasis: 'netto' });
    expect(st.pflicht.items.map(i => i.key)).toContain('bvg');
    expect(st.bvgUnklar).toBe(false);
  });
  it('Kasse erfasst: nichts offen', () => {
    expect(schildState({ kkInsurer: 'CSS', bvgInsurer: 'AXA' }, { ...unter, lohnBasis: 'netto' }).bvgUnklar).toBe(false);
  });
  it('Schutzschild zeigt den Hinweis mit der Schwelle', async () => {
    const React = (await import('react')).default;
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { Schutzschild } = await import('../components/Schutzschild.jsx');
    const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
    const t = (k, p) => (p ? k + '(' + Object.values(p).join('|') + ')' : k);
    const html = (lohnBasis) => renderToStaticMarkup(React.createElement(Schutzschild, { palette, t, versicherungen: { kkInsurer: 'CSS' }, ...unter, lohnBasis }));
    expect(html('netto')).toContain('schutzschild.bvgUnklar(');
    expect(html('brutto')).not.toContain('schutzschild.bvgUnklar');
  });
});
