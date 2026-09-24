import { describe, it, expect } from 'vitest';
import { darlehenVorschlag, betreibungsStatusNachEintrag } from '../schuldenAusProfil.js';

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

describe('betreibungsStatusNachEintrag — Register-Stand ins Kapitel Behörden', () => {
  const eintrag = { creditor: 'Inkasso AG', amount: 0, status: 'active' };
  it.each([undefined, '', 'unknown'])('Status %j + erfasste Betreibung → «entries»', (status) => {
    expect(betreibungsStatusNachEintrag(status, [eintrag])).toBe('entries');
  });
  it('eigene Angabe wird nie überschrieben — auch «none» nicht', () => {
    expect(betreibungsStatusNachEintrag('none', [eintrag])).toBeNull();
    expect(betreibungsStatusNachEintrag('entries', [eintrag])).toBeNull();
  });
  it('bezahlte Betreibung zählt trotzdem (bleibt 5 Jahre einsehbar, SchKG 8a Abs. 4)', () => {
    expect(betreibungsStatusNachEintrag('', [{ creditor: '', amount: 800, status: 'paid' }])).toBe('entries');
  });
  it('eben angelegter, leerer Eintrag zählt noch nicht', () => {
    expect(betreibungsStatusNachEintrag('', [{ creditor: '  ', amount: 0, status: 'active' }])).toBeNull();
    expect(betreibungsStatusNachEintrag('', [])).toBeNull();
  });
});
