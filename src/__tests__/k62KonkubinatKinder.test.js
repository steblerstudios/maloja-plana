import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  steuernFuerProfil, steuerEingabenAusDaten, konkubinatWieLedigAb,
  KONKUBINAT_MIT_KINDERN_WIE_LEDIG_AB, KONKUBINAT_WIE_LEDIG_AB,
} from '../data/kantonaleSteuerdaten.js';

// ─────────────────────────────────────────────────────────────
// K62-Nachlauf B · Konkubinat MIT Kindern. #284 hat Konkubinat nur ohne Kinder gemessen; die App
// zeigte mit Kindern ausserhalb BE/JU/VS eine Kantonszahl nach der Reihe «ledig mit Kindern».
// Gemessen am ESTV-Steuerrechner 2026: Konkubinat (Relationship 3, Person 2 ohne Einkommen) gegen
// ledig (alleinerziehend) im selben Lauf, 26 Kantone × 1/2/3 Kinder × 68 Bruttolöhne.
//   docs/sources/konkubinat-kinder-kantonssteuer-2026.messpunkte.json
//   docs/sources/nettolohn-abzuege-2026.messpunkte.json   Brutto → Nettolohn
// Erwartungen aus der Messdatei, nicht aus dem eigenen Code.
// ─────────────────────────────────────────────────────────────

const lies = (datei) => JSON.parse(readFileSync(new URL('../../docs/sources/' + datei, import.meta.url), 'utf-8'));
const messung = lies('konkubinat-kinder-kantonssteuer-2026.messpunkte.json');
const NETTO = new Map(lies('nettolohn-abzuege-2026.messpunkte.json').punkte.map((p) => [p[0], p[1]]));
// [kanton, kinder, brutto, steuerbarBundK, bundK, kgK, steuerbarKantonK, steuerbarBundL, bundL, kgL, steuerbarKantonL]
const KANTONE = [...new Set(messung.punkte.map((p) => p[0]))];
const punkt = (kt, kinder, brutto) => messung.punkte.find((p) => p[0] === kt && p[1] === kinder && p[2] === brutto);
const weichtAb = (p) => Math.abs(p[5] - p[9]) > 1;
const imRahmen = (wert, soll) => Math.abs(wert - soll) <= Math.max(0.03 * soll, 50);

const profil = ({ canton = 'ZH', brutto = 80000, kinder = 1, partnerIncome = '0', elterntarif = true } = {}) => ({
  basis: {
    canton, maritalStatus: 'cohabiting',
    household: { adults: 2, children: Array.from({ length: kinder }, () => ({ age: 8 })), ...(partnerIncome !== undefined ? { partnerIncome } : {}) },
  },
  finanzen: { monthlyIncome: NETTO.get(brutto) / 12, dreizehnter: 'no' },
  wohnen: {},
  versicherungen: {},
  taxData: { elterntarif },
});
const regel = (p) => steuernFuerProfil(steuerEingabenAusDaten(p));

describe('Messung · Konkubinat mit Kindern gegen ledig mit Kindern', () => {
  it('Messdatei: 26 Kantone × 3 Kinderzahlen × 68 Bruttolöhne, jede Gegenprobe gescheitert wie erwartet', () => {
    expect(KANTONE).toHaveLength(26);
    expect(messung.punkte).toHaveLength(26 * 3 * 68);
    expect(messung.laeufe.length).toBeGreaterThan(0);
    for (const l of messung.laeufe) expect(l.gegenprobe).toBe('erfundene Operation → fehlgeschlagen wie erwartet');
  });

  it('Bund: steuerbares Einkommen und Bundessteuer überall wie ledig (Elterntarif, voller Kinderabzug)', () => {
    for (const p of messung.punkte) {
      expect(p[3], p.slice(0, 3).join(' ')).toBe(p[7]);
      expect(Math.abs(p[4] - p[8]), p.slice(0, 3).join(' ')).toBeLessThanOrEqual(1);
    }
  });

  it('ein Einkommen der Person 2 ändert im Konkubinat mit Kind nichts (104 Punkte)', () => {
    const z = messung.zweitesEinkommen;
    expect(z.punkte).toHaveLength(104);
    for (const r of z.punkte) expect(r.slice(2, 6), r.slice(0, 2).join(' ')).toEqual(r.slice(6, 10));
  });

  it('Kanton: KONKUBINAT_MIT_KINDERN_WIE_LEDIG_AB sperrt jeden abweichenden Punkt, und genau diese Kantone', () => {
    const abweichend = new Set();
    for (const p of messung.punkte) {
      if (!weichtAb(p)) continue;
      abweichend.add(p[0]);
      expect(p[5] - p[9], p.slice(0, 3).join(' ')).toBeGreaterThan(0); // immer höher im Konkubinat
      expect(p[3] >= konkubinatWieLedigAb(p[0], p[1]), p.slice(0, 3).join(' ')).toBe(false);
    }
    expect([...abweichend].sort()).toEqual(['BE', 'BS', 'JU', 'OW', 'UR', 'VD']);
    expect(Object.keys(KONKUBINAT_MIT_KINDERN_WIE_LEDIG_AB).sort()).toEqual([...abweichend].sort());
  });

  it('ohne Kinder gilt weiter die Messung aus #284', () => {
    expect(konkubinatWieLedigAb('VS', 0)).toBe(KONKUBINAT_WIE_LEDIG_AB.VS);
    expect(konkubinatWieLedigAb('BS', 0)).toBe(0);
    expect(konkubinatWieLedigAb('VS', 1)).toBe(0);
    expect(konkubinatWieLedigAb('BS', 2)).toBe(Infinity);
  });
});

describe('K62-Nachlauf B · was die App zeigt', () => {
  it.each(KANTONE)('%s, Konkubinat, 1 und 2 Kinder, Brutto 80 000: Zahl wie ESTV «Konkubinat» — oder begründet keine', (kt) => {
    for (const kinder of [1, 2]) {
      const [, , , steuerbar, bund, kg] = punkt(kt, kinder, 80000);
      const s = regel(profil({ canton: kt, kinder }));
      expect(s.steuerbar, kt + ' ' + kinder).toBe(steuerbar);
      expect(Math.abs(s.bund.steuer - bund), kt + ' ' + kinder).toBeLessThanOrEqual(1);
      if (kt in KONKUBINAT_MIT_KINDERN_WIE_LEDIG_AB) {
        expect(s.kanton, kt + ' ' + kinder).toMatchObject({ lage: 'ungeprueft', kantonal: null, grund: 'konkubinatKanton' });
      } else {
        expect(s.kanton.lage, kt + ' ' + kinder).toBe('innerhalb');
        expect(imRahmen(s.kanton.kantonal.kantonalUndGemeinde, kg), kt + ' ' + kinder + ': ' + s.kanton.kantonal.kantonalUndGemeinde + ' gegen ESTV ' + kg).toBe(true);
      }
    }
  });

  it('BS mit Kind: vorher Kantonszahl nach «ledig» (ESTV Konkubinat höher), jetzt keine, Bundessteuer bleibt', () => {
    const [, , , , , kgK, , , , kgL] = punkt('BS', 1, 80000);
    expect(kgK - kgL).toBeGreaterThan(1000);
    const s = regel(profil({ canton: 'BS' }));
    expect(s.kanton.grund).toBe('konkubinatKanton');
    expect(s.bund).not.toBeNull();
  });

  it('VS mit Kind unter der Schwelle ohne Kinder (Brutto 40 000): gleich wie ledig gemessen → Zahl', () => {
    const [, , , , , kg] = punkt('VS', 1, 40000);
    const s = regel(profil({ canton: 'VS', brutto: 40000 }));
    expect(s.kanton.lage).toBe('innerhalb');
    expect(imRahmen(s.kanton.kantonal.kantonalUndGemeinde, kg)).toBe(true);
  });

  it('mit Partnereinkommen > 0 weiter keine Zahl (Aufteilung des Kinderabzugs, DBG Art. 35 Abs. 1 lit. a)', () => {
    const s = regel(profil({ partnerIncome: '4000' }));
    expect(s.bund).toBeNull();
    expect(s.kanton.grund).toBe('partner');
  });
});
