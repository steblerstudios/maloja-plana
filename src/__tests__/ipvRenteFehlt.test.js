import { describe, it, expect, beforeAll } from 'vitest';
import { calculateIPV, calculateSozialhilfe, checkELEligibility, ladeIPVModelle, renteOhneBetrag } from '../config/cantonalData.js';
import { getBehoerdenDossierPreview, generateBehoerdenJSON } from '../dossierGenerator.js';
import de from '../i18n/de.js';
import { ipvAnzeige, wegeAusProbe } from '../data/anspruchWege.js';

// Predeploy 1e6819ab: Die IPV rechnete im Ruhestand und mit IV-Bezug mit einem Einkommen ohne die Rente, die das Profil
// nicht kennt. AG, Rentnerin, 500 erfasst: volle Verbilligung CHF 450/Mt. Jetzt wie die Sozialhilfe: kein Betrag.
const person = (canton, finanzen) => ({
  basis: { canton, dateOfBirth: '1986-05-01', gender: 'female', household: { adults: 1, children: [] } },
  finanzen: { employmentType: 'employed', monthlyIncome: 500, incomeType: 'netto', ...finanzen },
  wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 450 },
});

beforeAll(async () => { await ladeIPVModelle(); });

describe('IPV ohne erfasste Rente: kein Betrag', () => {
  it('eine Regel für Sozialhilfe und IPV', () => {
    for (const f of [{ employmentType: 'retired' }, { ivBezug: 'ganz' }, { ivBezug: 'teil' }]) {
      expect(renteOhneBetrag(f, {})).toBe(true);
      expect(calculateSozialhilfe(person('AG', f)).renteFehlt).toBe(true);
    }
    expect(renteOhneBetrag({ ivBezug: 'keine' }, { dateOfBirth: '1986-05-01' })).toBe(false);
    // Fachprüfung 8ac049b5: ab dem Referenzalter fliesst fast immer eine AHV-Rente, auch bei Erwerbstätigen.
    const heute = new Date(2026, 10, 4);
    expect(renteOhneBetrag({ employmentType: 'employed' }, { dateOfBirth: '1955-05-01', gender: 'female' }, heute)).toBe(true);
    expect(renteOhneBetrag({ employmentType: 'employed' }, { dateOfBirth: '1986-05-01', gender: 'female' }, heute)).toBe(false);
    // AHV 21 (Nachprüfung 92d73e70): Frau 1962-04 im Rentenalter, 1962-05 noch nicht.
    expect(renteOhneBetrag({}, { dateOfBirth: '1962-04-15', gender: 'female' }, heute)).toBe(true);
    expect(renteOhneBetrag({}, { dateOfBirth: '1962-05-15', gender: 'female' }, heute)).toBe(false);
  });

  it('Ruhestand und IV-Bezug: kein Betrag, der Grund als Hinweis, in jedem Kanton mit Modell', () => {
    for (const canton of ['AG', 'BS', 'GE', 'TI']) {
      // Gegenprobe: angestellt rechnet (BS verlangt für Erwerbstätige eigene Angaben, bsHypothetisch)
      if (canton !== 'BS') expect(calculateIPV(person(canton, {})).amount).toBeGreaterThan(0);
      for (const f of [{ employmentType: 'retired' }, { ivBezug: 'teil' }]) {
        expect(calculateIPV(person(canton, f))).toMatchObject({ eligible: false, amount: null, belegt: false, noteKey: 'ipv.renteNichtEnthalten', renteFehlt: true });
      }
    }
  });

  it('Wege und Anzeige: ein Weg ohne Betrag, kein Glas', () => {
    const p = person('AG', { employmentType: 'retired' });
    expect(wegeAusProbe(p).wege.find((w) => w.key === 'ipv')).toEqual({ key: 'ipv', qualitative: true });
    expect(ipvAnzeige(p).art).toBe('offen');
  });

  // Rechtsprüfung 8ac049b5: kein «erfasst» (es gibt kein Feld), die kantonale Stelle bleibt; der Grund steht auf dem Blatt.
  it('Text und Dossier: der Grund, ohne «erfasst», mit der kantonalen Stelle', () => {
    expect(de.ipv.renteNichtEnthalten).not.toMatch(/erfasst/);
    expect(de.ipv.renteNichtEnthalten).toContain('kantonalen Stelle');
    const p = person('AG', { employmentType: 'retired' });
    const t = (k) => k;
    const ipv = calculateIPV(p);
    const blatt = getBehoerdenDossierPreview(p, [], t, { ipv }).sections.find((x) => x.key === 'ipv');
    expect(blatt.notes).toEqual(['ipv.renteNichtEnthalten']);
    expect(generateBehoerdenJSON(p, { ipv }, t).calculations.ipv).toMatchObject({ belegt: false, grund: 'rente-nicht-enthalten' });
  });

  // Nachprüfung 92d73e70: die EL folgt demselben Auslöser, sonst stünde neben «Rente nicht enthalten» «EL nur mit Rente».
  it('EL im Rentenalter auch bei Erwerbstätigen: prüfen lassen', () => {
    const p = { ...person('AG', {}), basis: { canton: 'AG', dateOfBirth: '1955-05-01', gender: 'female', household: { adults: 1, children: [] } } };
    expect(calculateSozialhilfe(p).renteFehlt).toBe(true);
    expect(checkELEligibility(p).elPruefen).toBe(true);
    expect(checkELEligibility(person('AG', {})).elPruefen).toBe(false);
  });
});
