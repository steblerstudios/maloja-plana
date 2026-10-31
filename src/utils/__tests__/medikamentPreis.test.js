import { describe, it, expect } from 'vitest';
import { dosisInMg, dosisAusForm, preisFuer } from '../medikamentPreis.js';
import { SL_PREISE, SL_STAND } from '../../data/medikamentPreise.js';
import { MEDICATIONS } from '../../config/medicationData.js';
import { DEMO_DATA } from '../../config/demoData.js';

describe('Dosis lesen', () => {
  it('rechnet µg, mg und g auf mg um', () => {
    expect(dosisInMg('50', 'µg')).toBe(0.05);
    expect(dosisInMg('500', 'mg')).toBe(500);
    expect(dosisInMg('1', 'g')).toBe(1000);
  });
  it('gibt bei Spanne, IE oder leer nichts zurück', () => {
    expect(dosisInMg('500-1000', 'mg')).toBeNull();
    expect(dosisInMg('4000', 'IE')).toBeNull();
    expect(dosisInMg('', 'mg')).toBeNull();
  });
  it('liest die Dosis aus der SL-Form', () => {
    expect(dosisAusForm('Tabl 0.05 mg')).toBe(0.05);
    expect(dosisAusForm('Filmtabl 1 g')).toBe(1000);
    expect(dosisAusForm('Dosieraeros 100 mcg')).toBe(0.1);
    expect(dosisAusForm('Inhal Lös 0.5 %')).toBeNull();
  });
});

describe('Preis zu einem Medikament', () => {
  const preise = {
    Testa: [['Tabl 50 mg', '30 Stk', 12.5, 10], ['Tabl 100 mg', '30 Stk', 20, 10], ['Tabl 100 mg', '100 Stk', 45.3, 40]],
  };
  it('nimmt nur die Packungen mit der erfassten Dosis', () => {
    const p = preisFuer({ name: 'Testa', dose: '100', unit: 'mg' }, preise);
    expect(p.packungen).toHaveLength(2);
    expect([p.min, p.max]).toEqual([20, 45.3]);
    expect(p.selbstbehalt40).toBe('einige');
  });
  it('nimmt alle Packungen, wenn keine Dosis erfasst ist (auch bei einer Spanne)', () => {
    expect(preisFuer({ name: 'Testa', dose: '', unit: 'mg' }, preise).packungen).toHaveLength(3);
    expect(preisFuer({ name: 'Testa', dose: '50-100', unit: 'mg' }, preise).packungen).toHaveLength(3);
  });
  it('zeigt keinen Preis, wenn die erfasste Dosis in der SL nicht vorkommt (Fachprüfung 27.10.2026)', () => {
    expect(preisFuer({ name: 'Testa', dose: '75', unit: 'mg' }, preise)).toBeNull();
  });
  it('gibt ohne Treffer null zurück — dann kein Preis', () => {
    expect(preisFuer({ name: 'Unbekannt' }, preise)).toBeNull();
    expect(preisFuer({ name: '' }, preise)).toBeNull();
  });
});

describe('generierte SL-Preise', () => {
  it('haben einen Stand und gehören nur zu Medikamenten der App', () => {
    expect(SL_STAND.datum).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const namen = new Set(MEDICATIONS.map(([n]) => n));
    for (const name of Object.keys(SL_PREISE)) expect(namen.has(name)).toBe(true);
  });
  it('haben je Packung Form, Packung, Preis > 0 und Selbstbehalt 10 oder 40', () => {
    for (const liste of Object.values(SL_PREISE)) {
      for (const [form, packung, chf, sb] of liste) {
        expect(typeof form).toBe('string');
        expect(typeof packung).toBe('string');
        expect(chf).toBeGreaterThan(0);
        expect([10, 40]).toContain(sb);
      }
    }
  });
  it('ein Name nimmt keinen längeren mit: «Aspirin» hat nicht die Preise von «Aspirin Cardio»', () => {
    expect(SL_PREISE['Aspirin Cardio']).toBeTruthy();
    expect(SL_PREISE.Aspirin).toBeUndefined();
  });
  it('Beispiel Maria: Euthyrox 50 µg hat genau einen Preis', () => {
    const med = DEMO_DATA.notfall.medicationsList[0];
    const p = preisFuer(med, SL_PREISE);
    expect(med.name).toBe('Euthyrox');
    expect(p.min).toBe(p.max);
    expect(p.min).toBe(15.4);
  });
});
