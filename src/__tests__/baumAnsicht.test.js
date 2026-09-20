import { describe, it, expect } from 'vitest';
import { baumAnsichtLesen, baumAnsichtSchreiben, BAUM_ANSICHT_KEY } from '../utils/baumAnsicht.js';

function speicherAttrappe(inhalt = {}) {
  return {
    getItem: (k) => (k in inhalt ? inhalt[k] : null),
    setItem: (k, v) => { inhalt[k] = String(v); },
    _inhalt: inhalt,
  };
}

describe('Baum-Ansicht merken', () => {
  it('ohne gespeicherte Wahl ist die räumliche Ansicht der Standard', () => {
    expect(baumAnsichtLesen(speicherAttrappe())).toBe(true);
  });

  it('eine gespeicherte Wahl gewinnt gegen den Standard', () => {
    expect(baumAnsichtLesen(speicherAttrappe({ [BAUM_ANSICHT_KEY]: 'flach' }))).toBe(false);
    expect(baumAnsichtLesen(speicherAttrappe({ [BAUM_ANSICHT_KEY]: 'raeumlich' }))).toBe(true);
  });

  it('ein unbekannter Wert fällt auf den Standard zurück statt auf «leer»', () => {
    expect(baumAnsichtLesen(speicherAttrappe({ [BAUM_ANSICHT_KEY]: 'quatsch' }))).toBe(true);
  });

  it('schreibt beide Zustände lesbar zurück', () => {
    const s = speicherAttrappe();
    baumAnsichtSchreiben(false, s);
    expect(s._inhalt[BAUM_ANSICHT_KEY]).toBe('flach');
    expect(baumAnsichtLesen(s)).toBe(false);
    baumAnsichtSchreiben(true, s);
    expect(baumAnsichtLesen(s)).toBe(true);
  });

  // Der wichtigste Fall: im Privat-Modus wirft jeder Speicherzugriff. Dann darf
  // die Seite nicht stehenbleiben — sie zeigt still den Standard.
  it('gesperrter Speicher führt nie zum Absturz', () => {
    const gesperrt = {
      getItem: () => { throw new Error('SecurityError'); },
      setItem: () => { throw new Error('SecurityError'); },
    };
    expect(() => baumAnsichtLesen(gesperrt)).not.toThrow();
    expect(baumAnsichtLesen(gesperrt)).toBe(true);
    expect(baumAnsichtSchreiben(false, gesperrt)).toBe(false);
  });
});
