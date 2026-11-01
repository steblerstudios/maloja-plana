import { describe, it, expect } from 'vitest';
import { hatAusweisFNS } from '../data/ausweis.js';
import { finanzWerte } from '../components/FinanzAuswertung.jsx';

const t = (k) => k;

describe('Ausweis F, N, S: eine Stelle', () => {
  it.each(['f', 'n', 's', 'F'])('«%s» zählt', (workPermit) => {
    expect(hatAusweisFNS({ ausbildung: { workPermit } })).toBe(true);
  });
  it.each(['swiss', 'b', 'c', 'l', 'g', '', undefined])('«%s» zählt nicht', (workPermit) => {
    expect(hatAusweisFNS({ ausbildung: { workPermit } })).toBe(false);
  });
  it('ohne Daten kein Fehler', () => {
    expect(hatAusweisFNS(undefined)).toBe(false);
  });
  it('Finanzen tragen dasselbe Merkmal zur IPV-Kachel', () => {
    expect(finanzWerte({ ausbildung: { workPermit: 'n' } }, t).ipvRuht).toBe(true);
    expect(finanzWerte({ ausbildung: { workPermit: 'c' } }, t).ipvRuht).toBe(false);
  });
});
