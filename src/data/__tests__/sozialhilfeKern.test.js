import { describe, it, expect } from 'vitest';
import { sozialhilfeBilanz, einkommensfreibetrag, istErwerbstaetig } from '../sozialhilfeKern.js';
import { berechneSozialhilfe, sozialhilfeErgebnis } from '../sozialhilfeRechner.js';
import { calculateSozialhilfe, CANTON_CODES } from '../../config/cantonalData.js';

// Fachprüfung swiss-precision 25.09.2026 (PR #380): Schnellrechnung und ausführlicher Rechner
// rechneten verschieden. Regeln und Quellen: data/sozialhilfeKern.js.

const profil = ({ canton = 'ZH', monthlyIncome = 0, sideIncome = 0, employmentType = 'employed', rent = 1000, kk = 400, household } = {}) => ({
  basis: { canton, ...(household ? { household } : {}) },
  finanzen: { monthlyIncome, sideIncome, employmentType },
  wohnen: { rentAmount: rent },
  versicherungen: { kkPremium: kk },
});

describe('Eine Wahrheit: Schnellrechnung = ausführlicher Rechner', () => {
  it('gleiche Lücke, gleicher Anspruch, gleicher Freibetrag — alle Kantone, erwerbstätig und nicht', () => {
    const abweichungen = [];
    for (const canton of CANTON_CODES) {
      for (const employmentType of ['employed', 'retired']) {
        for (const monthlyIncome of [0, 300, 1200, 2000, 2400, 2600, 3200, 5000]) {
          // Miete unter jeder Mietzinslimite, damit beide dieselbe Wohnkosten-Zahl haben.
          const schnell = calculateSozialhilfe(profil({ canton, monthlyIncome, employmentType, rent: 900 }));
          const rechner = berechneSozialhilfe({
            adults: 1, miete: 900, krankenkassePraemie: 400, kanton: canton,
            erwerbseinkommen: monthlyIncome, erwerbstaetig: employmentType === 'employed',
          });
          const a = [schnell.deficit, schnell.eligible, schnell.efb, schnell.efbEntscheidet];
          const b = [rechner.sozialhilfeAnspruch, rechner.hatAnspruch, rechner.efb, rechner.efbEntscheidet];
          if (JSON.stringify(a) !== JSON.stringify(b)) abweichungen.push(`${canton}/${employmentType}/${monthlyIncome}: ${a} ≠ ${b}`);
        }
      }
    }
    expect(abweichungen).toEqual([]);
  });
});

describe('Einkommensfreibetrag (SKOS-RL D.2) in der Schnellrechnung', () => {
  // Bedarf Einzelperson: 1061 + 1000 + 400 = 2461.
  it('zieht den Freibetrag vom Erwerbseinkommen ab, bevor es angerechnet wird', () => {
    const r = calculateSozialhilfe(profil({ monthlyIncome: 2400 }));
    expect(r.totalBedarf).toBe(2461);
    expect(r.efb).toBe(einkommensfreibetrag(2400)); // 700
    expect(r.deficit).toBe(2461 - (2400 - 700));
    expect(r.efbEntscheidet).toBe(false); // auch ohne Freibetrag schon eine Lücke (61)
  });

  it('meldet, wenn erst der Freibetrag den Anspruch ergibt (kantonal offen)', () => {
    const r = calculateSozialhilfe(profil({ monthlyIncome: 2600 }));
    expect(r.eligible).toBe(true);
    expect(r.deficit).toBe(2461 - (2600 - 700));
    expect(r.efbEntscheidet).toBe(true);
  });

  it('kein Freibetrag ohne Erwerbstätigkeit (D.2 Abs. 2: Arbeitsleistung nötig)', () => {
    const r = calculateSozialhilfe(profil({ monthlyIncome: 2600, employmentType: 'retired' }));
    expect(r.efb).toBe(0);
    expect(r.eligible).toBe(false);
    expect(r.erwerbsunkostenOffen).toBe(false);
  });

  it('kein Freibetrag auf den Lohn der Partnerin/des Partners (wie im Rechner: andere Einkunft)', () => {
    const b = sozialhilfeBilanz({ grundbedarf: 1624, erwerbseinkommen: 0, andereEinkuenfte: 3000, erwerbstaetig: true });
    expect(b.efb).toBe(0);
    expect(b.anrechenbaresEinkommen).toBe(3000);
  });
});

describe('Erwerbsunkosten (SKOS-RL C.6.3) gehören in den Bedarf', () => {
  const basis = { adults: 1, miete: 1000, krankenkassePraemie: 400, erwerbseinkommen: 2600, erwerbstaetig: true };

  it('erhöhen den Bedarf und damit die Anspruchsgrenze', () => {
    const ohne = berechneSozialhilfe(basis);
    const mit = berechneSozialhilfe({ ...basis, erwerbsunkosten: 180 });
    expect(mit.bedarf).toBe(ohne.bedarf + 180);
    expect(mit.sozialhilfeAnspruch).toBe(ohne.sozialhilfeAnspruch + 180);
  });

  it('werden nicht mit dem Freibetrag verrechnet (C.6.3 Erl. a)', () => {
    expect(berechneSozialhilfe({ ...basis, erwerbsunkosten: 180 }).efb).toBe(berechneSozialhilfe(basis).efb);
  });

  it('können allein den Eintritt ergeben — ohne Freibetrag-Vorbehalt', () => {
    // Bedarf 2461, Einkommen 2500: ohne Freibetrag keine Lücke; mit 100 Erwerbsunkosten schon.
    const b = sozialhilfeBilanz({ grundbedarf: 1061, wohnkosten: 1000, kvgPraemie: 400, erwerbsunkosten: 100, erwerbseinkommen: 2500, erwerbstaetig: true });
    expect(b.bedarf).toBe(2561);
    expect(b.efbEntscheidet).toBe(false);
  });

  it('die Schnellrechnung kennt sie nicht und sagt das bei Erwerbstätigen', () => {
    expect(calculateSozialhilfe(profil({ monthlyIncome: 2600 })).erwerbsunkostenOffen).toBe(true);
  });

  it('leer = fehlende Angabe (nur bei Erwerbstätigkeit), eine 0 ist eine Antwort', () => {
    const e = (o) => sozialhilfeErgebnis({ miete: '900', kvgPraemie: '400', erwerbseinkommen: '2600', vermoegen: '0', kanton: 'ZH', ...o }).fehlend;
    expect(e({ erwerbstaetig: true, erwerbsunkosten: '' })).toContain('erwerbsunkosten');
    expect(e({ erwerbstaetig: true, erwerbsunkosten: '0' })).not.toContain('erwerbsunkosten');
    expect(e({ erwerbstaetig: false, erwerbsunkosten: '' })).not.toContain('erwerbsunkosten');
  });
});

describe('istErwerbstaetig — eine Regel für Schnellrechnung und Vorbefüllung', () => {
  it('Anstellungstyp geht vor Arbeitgeber', () => {
    expect(istErwerbstaetig({ employmentType: 'employed' })).toBe(true);
    expect(istErwerbstaetig({ employmentType: 'freelance' })).toBe(true);
    expect(istErwerbstaetig({ employmentType: 'retired', employer: 'Firma' })).toBe(false);
    expect(istErwerbstaetig({ employer: 'Firma' })).toBe(true);
    expect(istErwerbstaetig({ employer: '  ' })).toBe(false);
    expect(istErwerbstaetig(undefined)).toBe(false);
  });
});
