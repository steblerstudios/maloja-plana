import { describe, it, expect } from 'vitest';
import { getChapters } from '../config/constants.js';
import {
  NA_FELD, trifftNichtZu, feldErledigt, naUmschalten,
  kapitelVollstaendigkeit, grundordnung, gesamtVollstaendigkeit,
} from '../utils/vollstaendigkeit.js';

// E17 (Bau-Liste O9): Die Vollständigkeit zählte Leeres als offen, und die
// Grundordnung verlangte Arbeitgeber, Telefon und E-Mail. Wer pensioniert, in
// Ausbildung oder ohne Stelle ist, kam so nie auf 100 %. Diese Tests halten fest:
// «trifft nicht zu» zählt als erledigt, und Arbeitgeber/Telefon/E-Mail sind nur
// noch empfohlen.

const t = (k) => k;
const chapters = getChapters(t);
const feld = (kap, k) => chapters.find((c) => c.key === kap).fields.find((f) => f.k === k);

// Alle Grundordnungs-Felder gefüllt — ausser dem, was eine pensionierte Person
// nicht hat (Arbeitgeber) und was sie nicht angeben mag (Telefon, E-Mail).
const pensioniert = () => {
  const data = {};
  for (const ch of chapters) {
    data[ch.key] = {};
    for (const f of ch.fields) if (f.mvo) data[ch.key][f.k] = 'x';
  }
  data.finanzen.employmentType = 'retired';
  delete data.finanzen.employer;
  delete data.basis.phone;
  delete data.basis.email;
  return data;
};

describe('E17 · Grundordnung: Arbeitgeber, Telefon, E-Mail nur empfohlen', () => {
  it('employer, phone und email sind nicht mehr Pflicht, sondern empfohlen', () => {
    for (const [kap, k] of [['finanzen', 'employer'], ['basis', 'phone'], ['basis', 'email']]) {
      expect(feld(kap, k).mvo, k).toBeFalsy();
      expect(feld(kap, k).recommended, k).toBe(true);
    }
  });

  it('pensionierte Person ohne Arbeitgeber ist in der Grundordnung nicht unvollständig', () => {
    const g = grundordnung(chapters, pensioniert());
    expect(g.pct).toBe(100);
    expect(g.fields.find((f) => !f.done)).toBeUndefined();
  });

  it('die Grundordnung zählt jetzt 15 Angaben (vorher 18)', () => {
    expect(grundordnung(chapters, {}).total).toBe(15);
  });
});

describe('E17 · Zustand «trifft nicht zu»', () => {
  it('ein als «trifft nicht zu» markiertes Feld zählt als erledigt', () => {
    expect(feldErledigt({}, 'jobTitle')).toBe(false);
    expect(feldErledigt({ [NA_FELD]: ['jobTitle'] }, 'jobTitle')).toBe(true);
    expect(trifftNichtZu({ [NA_FELD]: ['jobTitle'] }, 'jobTitle')).toBe(true);
    expect(trifftNichtZu(undefined, 'jobTitle')).toBe(false);
  });

  it('Kapitel mit «trifft nicht zu» für alle leeren Felder = 100 %', () => {
    const kap = { key: 'x', fields: [{ k: 'a' }, { k: 'b' }, { k: 'c' }] };
    expect(kapitelVollstaendigkeit(kap, { a: 'ja' }).pct).toBe(33);
    const r = kapitelVollstaendigkeit(kap, { a: 'ja', [NA_FELD]: ['b', 'c'] });
    expect(r).toEqual({ pct: 100, filled: 3, total: 3 });
  });

  it('die Grundordnung schlägt ein «trifft nicht zu»-Feld nicht als nächste Angabe vor', () => {
    const data = pensioniert();
    delete data.ausbildung.jobTitle;
    expect(grundordnung(chapters, data).fields.find((f) => !f.done).key).toBe('jobTitle');
    data.ausbildung[NA_FELD] = ['jobTitle'];
    const g = grundordnung(chapters, data);
    expect(g.fields.find((f) => !f.done)).toBeUndefined();
    expect(g.pct).toBe(100);
    expect(g.fields.find((f) => f.key === 'jobTitle').na).toBe(true);
  });

  it('Gesamt-Vollständigkeit zählt «trifft nicht zu» mit', () => {
    const kap = [{ key: 'x', fields: [{ k: 'a' }, { k: 'b' }] }];
    expect(gesamtVollstaendigkeit(kap, { x: { a: 1 } })).toBe(50);
    expect(gesamtVollstaendigkeit(kap, { x: { a: 1, [NA_FELD]: ['b'] } })).toBe(100);
    expect(gesamtVollstaendigkeit([], {})).toBe(0);
  });

  it('lässt sich setzen und zurücknehmen, ohne andere Einträge zu verlieren', () => {
    const an = naUmschalten({ [NA_FELD]: ['phone'] }, 'email');
    expect(an).toEqual(['phone', 'email']);
    const aus = naUmschalten({ [NA_FELD]: an }, 'email');
    expect(aus).toEqual(['phone']);
    expect(naUmschalten({}, 'email')).toEqual(['email']);
    // Kaputter Wert (kein Array) wird nicht zur Falle
    expect(naUmschalten({ [NA_FELD]: 'x' }, 'email')).toEqual(['email']);
    expect(trifftNichtZu({ [NA_FELD]: 'email' }, 'email')).toBe(false);
  });

  it('Speicherformat: das Feld übersteht Migration und Backup-Prüfung unverändert', async () => {
    const { migrateData, CURRENT_DATA_VERSION } = await import('../utils/dataMigration.js');
    const { validateBackupPayload, validateData } = await import('../utils/dataValidation.js');
    const data = { _version: CURRENT_DATA_VERSION, finanzen: { monthlyIncome: '3000', [NA_FELD]: ['employer'] } };
    const m = migrateData(JSON.parse(JSON.stringify(data)));
    expect(m.migrated).toBe(false);
    expect(m.data.finanzen[NA_FELD]).toEqual(['employer']);
    expect(validateData(data).valid).toBe(true);
    expect(validateData(data).sanitized.finanzen[NA_FELD]).toEqual(['employer']);
    const payload = { created: new Date().toISOString(), version: '0.1.29-beta', data };
    expect(validateBackupPayload(payload).valid).toBe(true);
    // Hin und zurück durch JSON (so reist ein Backup) — nichts geht verloren.
    expect(JSON.parse(JSON.stringify(payload)).data.finanzen[NA_FELD]).toEqual(['employer']);
  });

  it('nur ausgewählte Felder bieten «trifft nicht zu» an — nicht Name oder Geburtsdatum', () => {
    expect(feld('basis', 'firstName').naOk).toBeFalsy();
    expect(feld('basis', 'dateOfBirth').naOk).toBeFalsy();
    for (const [kap, k] of [['finanzen', 'employer'], ['basis', 'phone'], ['basis', 'email'], ['ausbildung', 'jobTitle'], ['ausbildung', 'employer'], ['ausbildung', 'workHoursPerWeek']]) {
      expect(feld(kap, k).naOk, k).toBe(true);
    }
  });
});
