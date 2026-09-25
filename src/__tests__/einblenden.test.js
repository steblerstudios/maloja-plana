import { describe, it, expect } from 'vitest';
import { blendeEin, bewegungReduziert } from '../utils/einblenden.js';
import { duration } from '../config/tokens.js';

// Leises Einblenden beim Ansichtswechsel (25.09.2026). Zusagen: nur Deckkraft (kein
// transform — das würde position:fixed in <main> mitziehen), Dauer aus der Skala, und
// nie bei «Zurück» oder reduzierter Bewegung.
const attrappe = () => {
  const aufrufe = [];
  return { aufrufe, animate: (frames, opts) => { aufrufe.push({ frames, opts }); return { frames, opts }; } };
};

describe('blendeEin', () => {
  it('blendet vorwärts nur über die Deckkraft ein, in der Dauer der Skala', () => {
    const el = attrappe();
    blendeEin(el, {});
    expect(el.aufrufe).toHaveLength(1);
    const { frames, opts } = el.aufrufe[0];
    expect(frames).toEqual([{ opacity: 0 }, { opacity: 1 }]);
    expect(frames.some((f) => 'transform' in f)).toBe(false);
    expect(opts.duration).toBe(duration.normal);
  });

  it('nicht nach «Zurück»', () => {
    const el = attrappe();
    expect(blendeEin(el, { zurueck: true })).toBeNull();
    expect(el.aufrufe).toHaveLength(0);
  });

  it('nicht bei reduzierter Bewegung', () => {
    const el = attrappe();
    expect(blendeEin(el, { reduziert: true })).toBeNull();
    expect(el.aufrufe).toHaveLength(0);
  });

  it('ohne Element oder ohne Web-Animations kein Fehler', () => {
    expect(blendeEin(null)).toBeNull();
    expect(blendeEin({})).toBeNull();
  });
});

describe('bewegungReduziert', () => {
  const doc = (wert) => ({ documentElement: { getAttribute: () => wert } });
  const win = (treffer) => ({ matchMedia: () => ({ matches: treffer }) });

  it('der Schalter in der App zählt', () => {
    expect(bewegungReduziert(doc('1'), win(false))).toBe(true);
  });
  it('die Einstellung des Geräts zählt', () => {
    expect(bewegungReduziert(doc('0'), win(true))).toBe(true);
  });
  it('sonst nicht', () => {
    expect(bewegungReduziert(doc('0'), win(false))).toBe(false);
    expect(bewegungReduziert(doc(null), {})).toBe(false);
  });
});
