import { describe, it, expect } from 'vitest';
import { darlehenVorschlag, betreibungsHinweis } from '../schuldenAusProfil.js';

describe('darlehenVorschlag — «Persönliche Darlehen» nicht nochmals eintippen', () => {
  it('leere Liste + Darlehen im Profil → Kredit-Vorschlag', () => {
    expect(darlehenVorschlag({ finanzen: { loans: '12000.4' } }, [])).toEqual({ amount: '12000', category: 'kredit' });
    expect(darlehenVorschlag({ finanzen: { loans: 5000 } }, undefined)).toEqual({ amount: '5000', category: 'kredit' });
  });
  it('schon eine Schuld erfasst → kein Vorschlag (sonst doppelt)', () => {
    expect(darlehenVorschlag({ finanzen: { loans: 5000 } }, [{ id: 1 }])).toBeNull();
  });
  it.each([undefined, '', 0, -10, 'abc'])('Darlehen %j → kein Vorschlag', (loans) => {
    expect(darlehenVorschlag({ finanzen: { loans } }, [])).toBeNull();
  });
});

describe('betreibungsHinweis — Registerstand nur als Hinweis, nie automatisch', () => {
  const eintrag = { creditor: 'Inkasso AG', amount: 0, status: 'active' };
  it.each([undefined, '', 'unknown', 'none'])('Status %j + erfasste Betreibung → Hinweis', (status) => {
    expect(betreibungsHinweis(status, [eintrag])).toBe(true);
  });
  it('«Einträge vorhanden» schon festgehalten → kein Hinweis', () => {
    expect(betreibungsHinweis('entries', [eintrag])).toBe(false);
  });
  it('auch eine bezahlte Betreibung → Hinweis (der Rückzug ist nicht erfasst)', () => {
    expect(betreibungsHinweis('', [{ creditor: '', amount: 800, status: 'paid' }])).toBe(true);
  });
  it('eben angelegter, leerer Eintrag → noch kein Hinweis', () => {
    expect(betreibungsHinweis('', [{ creditor: '  ', amount: 0, status: 'active' }])).toBe(false);
    expect(betreibungsHinweis('', [])).toBe(false);
  });
});
