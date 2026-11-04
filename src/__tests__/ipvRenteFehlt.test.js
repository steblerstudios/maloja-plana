import { describe, it, expect, beforeAll } from 'vitest';
import { calculateIPV, calculateSozialhilfe, ladeIPVModelle, renteOhneBetrag } from '../config/cantonalData.js';
import { ipvAnzeige, wegeAusProbe } from '../data/anspruchWege.js';

// Predeploy 1e6819ab: Die IPV rechnete im Ruhestand und mit IV-Bezug mit einem Einkommen ohne die Rente, die das Profil
// nicht kennt. AG, Rentnerin, 500 erfasst: volle Verbilligung CHF 450/Mt. Jetzt wie die Sozialhilfe: kein Betrag.
const person = (canton, finanzen) => ({
  basis: { canton, dateOfBirth: '1955-05-01', gender: 'f', household: { adults: 1, children: [] } },
  finanzen: { employmentType: 'employed', monthlyIncome: 500, incomeType: 'netto', ...finanzen },
  wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 450 },
});

beforeAll(async () => { await ladeIPVModelle(); });

describe('IPV ohne erfasste Rente: kein Betrag', () => {
  it('eine Regel für Sozialhilfe und IPV', () => {
    for (const f of [{ employmentType: 'retired' }, { ivBezug: 'ganz' }, { ivBezug: 'teil' }]) {
      expect(renteOhneBetrag(f)).toBe(true);
      expect(calculateSozialhilfe(person('AG', f)).renteFehlt).toBe(true);
    }
    expect(renteOhneBetrag({ ivBezug: 'keine' })).toBe(false);
  });

  it('Ruhestand und IV-Bezug: kein Betrag, der Grund als Hinweis, in jedem Kanton mit Modell', () => {
    for (const canton of ['AG', 'BS', 'GE', 'TI']) {
      expect(calculateIPV(person(canton, {})).amount).toBeGreaterThan(0); // Gegenprobe: angestellt rechnet
      for (const f of [{ employmentType: 'retired' }, { ivBezug: 'teil' }]) {
        expect(calculateIPV(person(canton, f))).toMatchObject({ eligible: false, amount: null, belegt: false, noteKey: 'sozialhilfe.renteNichtErfasst', renteFehlt: true });
      }
    }
  });

  it('Wege und Anzeige: ein Weg ohne Betrag, kein Glas', () => {
    const p = person('AG', { employmentType: 'retired' });
    expect(wegeAusProbe(p).wege.find((w) => w.key === 'ipv')).toEqual({ key: 'ipv', qualitative: true });
    expect(ipvAnzeige(p).art).toBe('offen');
  });
});
