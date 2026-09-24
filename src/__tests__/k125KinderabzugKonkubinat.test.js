import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  steuernFuerProfil, steuerEingabenAusDaten, KINDERABZUG_KONKUBINAT_HAELFTIG, KONKUBINAT_MIT_KINDERN_WIE_LEDIG_AB,
} from '../data/kantonaleSteuerdaten.js';
import { orientierungsText } from '../components/KantonssteuerOrientierung.jsx';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itTexte from '../i18n/it.js'; // nicht `it` — kollidiert mit vitest it()
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// ─────────────────────────────────────────────────────────────
// K125 · Konkubinat mit Kindern: acht Kantone teilen den kantonalen Kinderabzug bei gemeinsamer
// elterlicher Sorge ohne Unterhaltsbeiträge hälftig (Wortlaut: docs/sources/
// kinderabzug-konkubinat-kantone-2026.md). Die Kantonstabelle ist mit dem GANZEN Abzug gemessen
// und zeigte dort zu tief — darum keine Kantonszahl. Die Zusage, die hier gehalten wird:
// in einem «hälftig»-Kanton steht im Konkubinat mit Kindern nie eine Kantonszahl, sonst schon.
// ─────────────────────────────────────────────────────────────

const quelle = readFileSync(new URL('../../docs/sources/kinderabzug-konkubinat-kantone-2026.md', import.meta.url), 'utf-8');

const profil = ({ canton = 'ZH', kinder = 1, maritalStatus = 'cohabiting', partnerIncome = '0' } = {}) => ({
  basis: {
    canton, maritalStatus,
    household: { adults: 2, children: Array.from({ length: kinder }, () => ({ age: 8 })), partnerIncome },
  },
  finanzen: { monthlyIncome: 5500, dreizehnter: 'no' },
  wohnen: {}, versicherungen: {}, taxData: { elterntarif: kinder > 0 },
});
const regel = (p) => steuernFuerProfil(steuerEingabenAusDaten(p));

describe('K125 · Kinderabzug im Konkubinat hälftig', () => {
  it('die Liste enthält genau die belegten Kantone, und jeder steht im Quellenblatt als «hälftig»', () => {
    expect([...KINDERABZUG_KONKUBINAT_HAELFTIG].sort()).toEqual(['AI', 'LU', 'NW', 'SH', 'SO', 'TI', 'VS', 'ZH']);
    for (const kt of KINDERABZUG_KONKUBINAT_HAELFTIG) {
      expect(quelle, kt).toMatch(new RegExp('\\| \\*\\*' + kt + '\\*\\* \\| \\*\\*hälftig\\*\\*'));
      expect(kt in KONKUBINAT_MIT_KINDERN_WIE_LEDIG_AB, kt).toBe(false); // sonst wäre die Regel doppelt
    }
  });

  it.each(KINDERABZUG_KONKUBINAT_HAELFTIG)('%s, Konkubinat, 1 und 2 Kinder: keine Kantonszahl, Bundessteuer bleibt', (kt) => {
    for (const kinder of [1, 2]) {
      const s = regel(profil({ canton: kt, kinder }));
      expect(s.kanton, kt + ' ' + kinder).toMatchObject({ lage: 'ungeprueft', kantonal: null, grund: 'konkubinatKinderabzugHaelftig' });
      expect(s.bund, kt + ' ' + kinder).not.toBeNull();
    }
  });

  it('Gegenproben: ohne Kinder, verheiratet, «ganz»-Kanton (AG) und Einverdiener-Ausnahme (FR, GE) weiter eine Kantonszahl', () => {
    for (const kt of ['FR', 'GE']) expect(regel(profil({ canton: kt })).kanton.grund, kt).not.toBe('konkubinatKinderabzugHaelftig');
    expect(regel(profil({ canton: 'ZH', kinder: 0 })).kanton.grund).not.toBe('konkubinatKinderabzugHaelftig');
    expect(regel(profil({ canton: 'ZH', kinder: 0 })).kanton.kantonal).not.toBeNull();
    expect(regel(profil({ canton: 'LU', maritalStatus: 'married' })).kanton.grund).not.toBe('konkubinatKinderabzugHaelftig');
    expect(regel(profil({ canton: 'AG' })).kanton.kantonal).not.toBeNull();
  });

  it('der Text dazu steht in allen fünf Sprachen, mit Sie/Du wo die Sprache es kennt', () => {
    for (const [l, d] of [['de', de], ['fr', fr], ['it', itTexte], ['rm', rm]]) {
      const v = d.tax.bandKonkubinatKinderabzugHaelftig;
      expect(typeof v.sie, l).toBe('string');
      expect(typeof v.du, l).toBe('string');
      expect(v.sie, l).not.toBe(v.du);
    }
    expect(typeof en.tax.bandKonkubinatKinderabzugHaelftig).toBe('string');
  });

  it('die Orientierung zeigt diesen Text — nicht den allgemeinen «nicht geprüft»', () => {
    const t = (k) => k;
    const s = regel(profil({ canton: 'ZH' }));
    expect(orientierungsText(t, s.kanton, 2026)).toBe('tax.bandKonkubinatKinderabzugHaelftig');
  });

  it('der Text verweist nicht auf den ESTV-Rechner als Lösung — der rechnet ebenfalls mit dem ganzen Abzug', () => {
    const sie = de.tax.bandKonkubinatKinderabzugHaelftig.sie;
    expect(sie).toMatch(/hälftig/);
    expect(sie).not.toMatch(/berechnet der Steuerrechner der ESTV/);
  });
});
