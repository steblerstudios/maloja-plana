import { describe, it, expect } from 'vitest';
import { absicherungJeRisiko } from '../absicherungRisiko.js';
import de from '../../i18n/de.js';
import en from '../../i18n/en.js';
import fr from '../../i18n/fr.js';
import itSprache from '../../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../../i18n/rm.js';

// Absicherung je Risiko (Sophie 26.10.2026: Liste statt Netz). Gehalten wird: AHV/IV nie als «erfasst», Freiwilliges
// nie als Lücke, Selbständige ohne falsche Pensionskassen-Lücke, Mindestalter und Rentenalter berücksichtigt.
const heute = new Date(2026, 9, 26);
const keys = (r, risiko) => r.risiken.find((x) => x.key === risiko).zeilen.map((z) => z.key + ':' + z.art);

const angestellt = {
  basis: { dateOfBirth: '1992-04-12' },
  finanzen: { employmentType: 'employed', monthlyIncome: 6200, incomeType: 'brutto', pension3a: 7258 },
  versicherungen: { kkInsurer: 'CSS', uvg: 'employer', ktg: 'employer', bvgInsurer: 'BVK', lifeInsurance: 'no' },
};

describe('absicherungJeRisiko', () => {
  it('angestellt, alles eingetragen: nichts offen; AHV/IV nur als Hinweis; 3a als Zusatz', () => {
    const r = absicherungJeRisiko(angestellt, heute);
    expect(r.offen).toBe(0);
    expect(keys(r, 'krankheit')).toEqual(['kkErfasst:erfasst', 'ktgArbeitgeber:zusatz']);
    expect(keys(r, 'unfall')).toEqual(['uvgArbeitgeber:erfasst']);
    expect(keys(r, 'invaliditaet')).toEqual(['iv:hinweis', 'pkErfasst:erfasst']);
    expect(keys(r, 'tod')).toEqual(['ahvHinterlassene:hinweis', 'pkErfasst:erfasst']);
    expect(keys(r, 'alter')).toEqual(['ahvAlter:hinweis', 'pkErfasst:erfasst', 'saeule3a:zusatz']);
    expect(r.risiken.flatMap((x) => x.zeilen).filter((z) => /^(iv|ahv)/.test(z.key)).every((z) => z.art === 'hinweis')).toBe(true);
  });

  it('angestellt ohne Pensionskasse über der Schwelle: «offen» unter drei Risiken, aber nur einmal gezählt', () => {
    const r = absicherungJeRisiko({ ...angestellt, versicherungen: { kkInsurer: 'CSS', uvg: 'employer' } }, heute);
    expect(keys(r, 'invaliditaet')).toContain('pkOffen:offen');
    expect(r.offen).toBe(1);
    expect(keys(r, 'krankheit')).toContain('ktgNicht:hinweis');
  });

  it('selbständig: keine falsche Pensionskassen-Lücke, Unfall über die Krankenkasse, UVG freiwillig', () => {
    const r = absicherungJeRisiko({ basis: { dateOfBirth: '1985-01-10' }, finanzen: { employmentType: 'selfEmployed', monthlyIncome: 7000 }, versicherungen: { kkInsurer: 'Helsana' } }, heute);
    expect(r.offen).toBe(0);
    expect(keys(r, 'unfall')).toEqual(['unfallKk:hinweis', 'uvgFreiwillig:hinweis']);
    expect(keys(r, 'invaliditaet')).toEqual(['iv:hinweis', 'pkSelbst:hinweis']);
  });

  it('Rentnerin: Invalidität nur der Hinweis IVG Art. 30, keine Pensionskassen-Zeile ohne Eintrag', () => {
    const r = absicherungJeRisiko({ basis: { dateOfBirth: '1955-03-03', gender: 'female' }, finanzen: { employmentType: 'retired' }, versicherungen: { kkInsurer: 'CSS' } }, heute);
    expect(keys(r, 'invaliditaet')).toEqual(['ivRente:hinweis']);
    expect(keys(r, 'alter')).toEqual(['ahvAlter:hinweis']);
  });

  it('Lernende mit 16, Lohn über der Schwelle: Pensionskasse erst ab dem Mindestalter, keine Lücke', () => {
    const r = absicherungJeRisiko({ basis: { dateOfBirth: '2010-05-05' }, finanzen: { employmentType: 'employed', monthlyIncome: 2500, incomeType: 'brutto', dreizehnter: 'ja' }, versicherungen: { kkInsurer: 'CSS', uvg: 'employer' } }, heute);
    expect(keys(r, 'invaliditaet')).toContain('pkMindestalter:hinweis');
    expect(r.offen).toBe(0);
  });

  it('angestellt mit 22: Tod/Invalidität Pensionskasse offen, Alter erst ab dem Jahr nach dem 24. Geburtstag', () => {
    const r = absicherungJeRisiko({ basis: { dateOfBirth: '2004-05-05' }, finanzen: { employmentType: 'employed', monthlyIncome: 5000, incomeType: 'brutto' }, versicherungen: { kkInsurer: 'CSS', uvg: 'employer' } }, heute);
    expect(keys(r, 'tod')).toContain('pkOffen:offen');
    expect(keys(r, 'alter')).toContain('pkAltersparen:hinweis');
  });

  it('nichts eingetragen: Krankenkasse offen, Anstellung unbekannt → Pensionskasse als Hinweis', () => {
    const r = absicherungJeRisiko({}, heute);
    expect(keys(r, 'krankheit')[0]).toBe('kkOffen:offen');
    expect(keys(r, 'unfall')).toEqual(['unfallOhneKk:hinweis', 'unfallArbeitslos:hinweis']); // KK fehlt nur einmal «offen»
    expect(r.offen).toBe(1);
    expect(keys(r, 'alter')).toContain('pkJeNachArbeit:hinweis');
  });
});

describe('absicherungJeRisiko — Befunde der Fachprüfung 26.10.2026', () => {
  it('nur ein PK-Guthaben (Freizügigkeit): fürs Alter erfasst, für Invalidität und Tod nicht', () => {
    const r = absicherungJeRisiko({ basis: { dateOfBirth: '1980-02-02' }, finanzen: { employmentType: 'selfEmployed' }, versicherungen: { kkInsurer: 'CSS', bvgBalance: 40000 } }, heute);
    expect(keys(r, 'alter')).toContain('pkErfasstOhneName:erfasst');
    expect(keys(r, 'invaliditaet')).toEqual(['iv:hinweis', 'pkSelbst:hinweis', 'pkGuthaben:hinweis']);
  });

  it('frühpensioniert vor dem Referenzalter: IV-Zeile bleibt, kein «Lohnausfall»-Hinweis', () => {
    const r = absicherungJeRisiko({ basis: { dateOfBirth: '1964-06-06' }, finanzen: { employmentType: 'retired' }, versicherungen: { kkInsurer: 'CSS' } }, heute);
    expect(keys(r, 'invaliditaet')[0]).toBe('iv:hinweis');
    expect(keys(r, 'krankheit')).toEqual(['kkErfasst:erfasst']);
  });

  it('angestellt ohne Geburtsdatum: Alterssparen als Hinweis, nicht «offen»', () => {
    const r = absicherungJeRisiko({ finanzen: { employmentType: 'employed', monthlyIncome: 6000, incomeType: 'brutto' }, versicherungen: { kkInsurer: 'CSS', uvg: 'employer' } }, heute);
    expect(keys(r, 'alter')).toContain('pkOhneGeburtsdatum:hinweis');
    expect(keys(r, 'tod')).toContain('pkOffen:offen');
  });

  it('unter 8 Std./Woche: Hinweis zu Freizeitunfällen; ohne Pensum kein Hinweis', () => {
    const mit = absicherungJeRisiko({ ...angestellt, ausbildung: { workHoursPerWeek: 6 } }, heute);
    expect(keys(mit, 'unfall')).toEqual(['uvgArbeitgeber:erfasst', 'nbuUnter8:hinweis']);
    expect(keys(absicherungJeRisiko(angestellt, heute), 'unfall')).toEqual(['uvgArbeitgeber:erfasst']);
  });
});

describe('vu.risiko — Texte', () => {
  it('jeder Schlüssel der Logik hat einen Text in allen fünf Sprachen', () => {
    const genutzt = new Set(['titel', 'subOffen', 'subKeins', 'satz', 'krankheit', 'unfall', 'invaliditaet', 'tod', 'alter',
      'kkErfasst', 'kkOffen', 'ktgArbeitgeber', 'ktgErfasst', 'ktgNicht', 'uvgArbeitgeber', 'uvgErfasst', 'uvgOffen', 'unfallKk',
      'unfallOhneKk', 'uvgFreiwillig', 'iv', 'ivRente', 'ahvHinterlassene', 'ahvAlter', 'pkErfasst', 'pkErfasstOhneName', 'pkSelbst',
      'pkMindestalter', 'pkAltersparen', 'pkOffen', 'pkUnklar', 'pkUnterSchwelle', 'pkJeNachArbeit', 'leben', 'saeule3a',
      'pkGuthaben', 'pkOhneGeburtsdatum', 'nbuUnter8', 'unfallArbeitslos']);
    for (const s of [de, en, fr, itSprache, rm]) {
      for (const k of genutzt) expect(typeof s.vu.risiko[k], k).toBe('string');
      expect(s.vu.risiko.marke.offen).toBeTruthy();
      expect(s.vu.risiko.kkErfasst).toContain('{name}');
    }
  });
});
