import { describe, it, expect } from 'vitest';
import { sozialhilfeBilanz, istErwerbstaetig } from '../sozialhilfeKern.js';
import { berechneSozialhilfe, sozialhilfeErgebnis } from '../sozialhilfeRechner.js';
import { calculateSozialhilfe, CANTON_CODES } from '../../config/cantonalData.js';
import { getBehoerdenDossierPreview } from '../../dossierGenerator.js';
import { sozialhilfePegelState } from '../pegel.js';

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
  // Bedarf Einzelperson: 1061 + 1000 + 400 = 2461. Freibetrag ab 1200 Lohn: 400.
  it('Anspruch ohne Freibetrag → der Betrag rechnet mit Freibetrag (D.2 Abs. 1)', () => {
    const r = calculateSozialhilfe(profil({ canton: 'BE', monthlyIncome: 2400 }));
    expect(r.totalBedarf).toBe(2461);
    expect(r.efb).toBe(400);
    expect(r.eligible).toBe(true);
    expect(r.deficit).toBe(2461 - (2400 - 400));
    expect(r.efbEntscheidet).toBe(false);
  });

  it('Eintritt vorsichtig OHNE Freibetrag; ergäbe erst er einen Anspruch → efbEntscheidet', () => {
    const r = calculateSozialhilfe(profil({ canton: 'BE', monthlyIncome: 2600 }));
    expect(r.eligible).toBe(false);
    expect(r.deficit).toBe(0);
    expect(r.efbEntscheidet).toBe(true);
  });

  it('ZH: kein Freibetrag beim Eintritt (Handbuch ZH 6.2.05) — belegt, darum kein Vorbehalt', () => {
    const r = calculateSozialhilfe(profil({ canton: 'ZH', monthlyIncome: 2600 }));
    expect(r.eligible).toBe(false);
    expect(r.efbEntscheidet).toBe(false);
  });

  it('BS: beim Eintritt zählen 200 Fr. nicht als Einnahme (URL WSU 2026 Ziff. 4.3)', () => {
    const r = calculateSozialhilfe(profil({ canton: 'BS', monthlyIncome: 2600 }));
    expect(r.totalBedarf).toBe(2461);
    expect(r.eligible).toBe(true); // 2461 > 2600 − 200
    expect(r.deficit).toBe(2461 - (2600 - 400));
    expect(r.efbEntscheidet).toBe(false);
    expect(calculateSozialhilfe(profil({ canton: 'BS', monthlyIncome: 2700 })).eligible).toBe(false);
  });

  it('der Freibetrag ist nie höher als der Lohn — er schmälert keine anderen Einkünfte', () => {
    const b = sozialhilfeBilanz({ grundbedarf: 1061, wohnkosten: 1000, kvgPraemie: 400, erwerbseinkommen: 100, andereEinkuenfte: 3700, erwerbstaetig: true });
    expect(b.efb).toBeLessThanOrEqual(100);
    expect(b.anrechenbaresEinkommen).toBeGreaterThanOrEqual(3700);
    expect(b.luecke).toBe(0);
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
  const basis = { adults: 1, miete: 1000, krankenkassePraemie: 400, erwerbseinkommen: 2000, erwerbstaetig: true };

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

describe('Anzeigen, die die Rechnung weitertragen', () => {
  const t = (k) => k;
  const sektion = (data) => {
    const sozialhilfe = calculateSozialhilfe(data);
    return getBehoerdenDossierPreview(data, [], t, { sozialhilfe }).sections.find(x => x.key === 'sozialhilfe');
  };

  it('Behörden-Dossier: mit Anspruch steht der Freibetrag als Zeile da (Bedarf − Einkommen + EFB = Lücke), dazu «geschätzt»', () => {
    const data = profil({ canton: 'BE', monthlyIncome: 2400 });
    const r = calculateSozialhilfe(data);
    expect(r.totalBedarf - r.income + r.efb).toBe(r.deficit);
    const s = sektion(data);
    expect(s.rows.map(x => x.label)).toContain('sh.efbLabel');
    expect(s.notes).toContain('sozialhilfe.efbGeschaetzt');
  });

  it('Behörden-Dossier: ohne Anspruch keine Freibetrag-Zeile, aber der Vorbehalt, wenn der Kanton entscheidet', () => {
    const s = sektion(profil({ canton: 'BE', monthlyIncome: 2600 }));
    expect(s.rows.map(x => x.label)).not.toContain('sh.efbLabel');
    expect(s.notes).toContain('sozialhilfe.efbEntscheidet');
    expect(s.notes).toContain('sozialhilfe.erwerbsunkostenNichtEingerechnet');
  });

  it('Pegel: bei einer Lücke ergeben Wasser (angerechnetes Einkommen) + Aufstockung den Bedarf', () => {
    const p = sozialhilfePegelState(profil({ canton: 'BE', monthlyIncome: 2400 }));
    expect(p.mode).toBe('gap');
    expect(p.income + p.amount).toBe(p.bedarf);
    expect(p.fraction).toBeLessThan(1);
  });

  it('Pegel: ergäbe erst der Freibetrag einen Anspruch, zeigt er keine Lücke', () => {
    expect(sozialhilfePegelState(profil({ canton: 'BE', monthlyIncome: 2600 })).mode).toBe('covered');
  });
});
