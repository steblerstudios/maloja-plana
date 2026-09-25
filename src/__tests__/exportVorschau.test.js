import { describe, it, expect } from 'vitest';
import { leiteKategorienAb, hatWert } from '../exportVorschau.js';
import { generateBehoerdenJSON, getLebensMappePreview } from '../dossierGenerator.js';
import { buildIpvDokument } from '../premiumCalc.js';
import { createBudgetReport } from '../budgetSync.js';
import { generateCVTemplate, generateJSONResume } from '../cvGenerator.js';
import { buildICS } from '../utils/icsExport.js';
import { angabenEingetippt } from '../briefGenerator.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Bau-Liste K3: die Export-Vorschau nennt, was in der Datei steht — abgeleitet aus
// denselben Daten, die der Export schreibt, nie generisch.

const ids = (r) => r.kategorien.map(k => (k.id === 'kapitel' ? 'kapitel:' + k.chapter : k.id));

const voll = {
  _version: 1,
  basis: { firstName: 'Anna', lastName: 'Muster', ahv: '756.0000.0000.00' },
  wohnen: { address: 'Musterweg 1', city: 'Basel' },
  finanzen: { monthlyIncome: 0, employer: '' },
  versicherungen: { kkInsurer: 'Kasse X' },
  notfall: { allergies: 'Nüsse' },
  vorsorge: { beitragsjahre: 12 },
};

describe('hatWert — was als «erfasst» zählt', () => {
  it('leere Werte und Voreinstellungen zählen nicht', () => {
    for (const v of [null, undefined, '', '   ', 0, false, [], {}, { a: '' }, [0, '']]) {
      expect(hatWert(v)).toBe(false);
    }
  });
  it('echte Angaben zählen', () => {
    for (const v of ['x', 5, true, ['a'], { a: { b: 'c' } }]) expect(hatWert(v)).toBe(true);
  });
});

describe('Datei-Exporte (ZipExport)', () => {
  it('JSON: nur Kapitel mit Angaben, dazu AHV, Gesundheit, weitere Bereiche und Dokumentliste', () => {
    const r = leiteKategorienAb('json', { data: voll, documents: [{ id: 1 }, { id: 2 }] });
    expect(r.form).toBe('datei');
    expect(r.verschluesselt).toBe(false);
    expect(ids(r)).toEqual([
      'kapitel:basis', 'kapitel:wohnen', 'kapitel:versicherungen', 'kapitel:notfall',
      'weitere', 'ahv', 'gesundheit', 'dokumenteListe',
    ]);
    expect(r.kategorien.find(k => k.id === 'weitere').count).toBe(1);   // vorsorge; _version zählt nicht
    expect(r.kategorien.find(k => k.id === 'dokumenteListe').count).toBe(2);
  });

  it('Finanzen mit nur 0 und Leerstring erscheint nicht', () => {
    const r = leiteKategorienAb('csv', { data: voll });
    expect(ids(r)).not.toContain('kapitel:finanzen');
  });

  it('CSV nimmt keine Dokumente mit', () => {
    const r = leiteKategorienAb('csv', { data: voll, documents: [{ id: 1 }] });
    expect(ids(r)).not.toContain('dokumenteListe');
    expect(ids(r)).not.toContain('dokumenteInhalt');
  });

  it('Manifest: nur Kapitel, deren Manifest-Felder befüllt sind', () => {
    // wohnen.city steht NICHT im Manifest, nur address/rentAmount/utilities
    const r = leiteKategorienAb('manifest', { data: { wohnen: { city: 'Basel' }, basis: { email: 'a@b.ch' } } });
    expect(ids(r)).toEqual(['kapitel:basis']);
  });

  it('leere Daten → keine Kategorie', () => {
    expect(leiteKategorienAb('json', { data: {} }).kategorien).toEqual([]);
    expect(leiteKategorienAb('csv', {}).kategorien).toEqual([]);
  });
});

describe('Sicherung (Backup)', () => {
  it('unverschlüsselt vs. verschlüsselt', () => {
    expect(leiteKategorienAb('sicherung', { data: voll }).verschluesselt).toBe(false);
    expect(leiteKategorienAb('sicherungVerschluesselt', { data: voll }).verschluesselt).toBe(true);
  });

  it('nimmt Dokumente MIT Inhalt, Termine, Kontakte, Merkliste und Einstellungen mit', () => {
    const r = leiteKategorienAb('sicherung', { data: {}, documents: [{}, {}, {}], reminders: 2, contacts: [], merkliste: [{ id: 'x' }] });
    expect(ids(r)).toEqual(['dokumenteInhalt', 'termine', 'merkliste', 'einstellungen']);
    expect(r.kategorien[0].count).toBe(3);
  });
});

describe('Dossiers und Brief (Druck)', () => {
  const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');

  it('Dossier: Abschnitte aus der Vorschau, mit Feldnamen statt Werten', () => {
    const r = leiteKategorienAb('dossier', {
      abschnitte: [{ titel: 'Notfallkontakt', felder: ['Name', 'Telefon'] }, { titel: '' }],
      dokumente: 0,
    });
    expect(r.form).toBe('druck');
    expect(r.kategorien).toEqual([{ id: 'abschnitt', label: 'Notfallkontakt', detail: 'Name, Telefon' }]);
  });

  it('Lebensmappe: genau die Abschnitte, die auch gedruckt werden', () => {
    const preview = getLebensMappePreview(voll, [], t, [{ fileName: 'Mietvertrag.pdf' }]);
    const r = leiteKategorienAb('dossier', {
      abschnitte: preview.sections.map(s => ({ titel: s.title, felder: s.rows.map(x => x.label) })),
      dokumente: preview.docCount,
    });
    expect(r.kategorien.map(k => k.label || k.id)).toEqual([...preview.sections.map(s => s.title), 'dokumenteListe']);
    expect(JSON.stringify(r)).not.toContain('756.0000');   // Werte erscheinen nie in der Vorschau
  });

  it('Behörden-JSON: aus dem Objekt, das geschrieben wird', () => {
    const dossier = generateBehoerdenJSON(voll, { ipv: { eligible: false, amount: 0 } });
    const r = leiteKategorienAb('dossierJson', { dossier });
    expect(ids(r)).toEqual(['person', 'ahv', 'adresse', 'kapitel:versicherungen', 'berechnungen']);
    expect(r.form).toBe('datei');
  });

  it('Brief: Name und Adresse, dazu nur was die Vorlage liest', () => {
    expect(ids(leiteKategorienAb('brief', { data: voll, templateKey: 'leaseTermination' }))).toEqual(['name', 'adresse']);
    expect(ids(leiteKategorienAb('brief', { data: voll, templateKey: 'kkReklamation', belegeCount: 2 }))).toEqual(['name', 'adresse', 'versicherung', 'belege']);
    const lohn = { finanzen: { employer: 'Firma AG', monthlyIncome: 4000, sideEmployer: '', sideIncome: 0 } };
    expect(ids(leiteKategorienAb('brief', { data: lohn, templateKey: 'unpaidWage', job: 'main' }))).toEqual(['arbeitgeber', 'lohn']);
    expect(ids(leiteKategorienAb('brief', { data: lohn, templateKey: 'unpaidWage', job: 'side' }))).toEqual([]);
  });

  // Lebensereignis-Briefe (26.09.2026): Arbeitgeber aus dem Profil, eingetippte Angaben eigens.
  it('Brief: Zeugnis/Einsprache nennen den Arbeitgeber, aber nie den Lohn', () => {
    const lohn = { finanzen: { employer: 'Firma AG', monthlyIncome: 4000 } };
    for (const templateKey of ['workReference', 'dismissalObjection']) {
      expect(ids(leiteKategorienAb('brief', { data: lohn, templateKey, job: 'main' }))).toEqual(['arbeitgeber']);
    }
  });
  it('Brief: eingetippte Angaben erscheinen als eigene Kategorie — Wahlfelder allein nicht', () => {
    const q = (templateKey, angaben) => ({ data: {}, templateKey, angabenEingetippt: angabenEingetippt(templateKey, angaben) });
    expect(ids(leiteKategorienAb('brief', q('debtObjection', { betreibungsnummer: '123' })))).toEqual(['briefAngaben']);
    expect(ids(leiteKategorienAb('brief', q('debtObjection', { umfang: 'teil', betreibungsnummer: '  ' })))).toEqual([]);
    expect(ids(leiteKategorienAb('brief', q('dismissalObjection', { begruendung: false })))).toEqual([]);
    expect(ids(leiteKategorienAb('brief', q('deathNotice', {})))).toEqual([]);
  });
});

// ─── K20: die übrigen Stellen, an denen Daten das Gerät als Datei oder Druck verlassen ───
// Jede Ableitung wird gegen das Objekt bzw. den Text geprüft, den der echte Generator
// schreibt — nicht gegen eine nachgebaute Annahme.

describe('IPV-Antrag (JSON)', () => {
  const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');

  it('nennt genau, was im IPV-Dokument steht', () => {
    const data = { basis: { firstName: 'Anna', lastName: 'Muster', ahv: '756.0000.0000.00', canton: 'BS' } };
    const dokument = buildIpvDokument(data, t, { eligible: true, amount: 120 });
    const r = leiteKategorienAb('ipvJson', { dokument });
    expect(r.form).toBe('datei');
    expect(ids(r)).toEqual(['name', 'ahv', 'kanton', 'ipvErgebnis']);
    expect(JSON.stringify(r)).not.toContain('756.0000');   // Feldnamen, keine Werte
  });

  it('ohne Name, AHV und Kanton bleibt nur das Ergebnis', () => {
    const dokument = buildIpvDokument({ basis: {} }, t, { eligible: false, amount: 0 });
    expect(ids(leiteKategorienAb('ipvJson', { dokument }))).toEqual(['ipvErgebnis']);
  });
});

describe('Budget-Bericht (JSON)', () => {
  const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
  const data = {
    basis: { firstName: 'Anna', lastName: 'Muster', canton: 'BS' },
    wohnen: { rentAmount: 1400, utilities: 120 },
    finanzen: { monthlyIncome: 5200, debtPayments: 250 },
    versicherungen: { kkPremium: 380 },
  };

  it('nennt Einkommen, Ausgaben, Haushalt — Schulden eigens', () => {
    const report = createBudgetReport(data, t);
    const r = leiteKategorienAb('budgetJson', { report, data });
    expect(r.form).toBe('datei');
    expect(ids(r)).toContain('name');
    expect(ids(r)).toContain('einkommen');
    expect(ids(r)).toContain('ausgaben');
    expect(ids(r)).toContain('schulden');
    expect(ids(r)).toContain('haushalt');
    expect(JSON.stringify(r)).not.toContain('5200');
  });

  it('ohne Schuldenabzahlungen fehlt die Kategorie', () => {
    const ohne = { ...data, finanzen: { monthlyIncome: 5200 } };
    expect(ids(leiteKategorienAb('budgetJson', { report: createBudgetReport(ohne, t), data: ohne }))).not.toContain('schulden');
  });

  it('der Platzhalter-Name aus dem Bericht zählt nicht als Angabe', () => {
    const ohneName = { finanzen: { monthlyIncome: 5200 } };
    const report = createBudgetReport(ohneName, t);
    expect(report.person).toBeTruthy();                       // der Bericht trägt einen Platzhalter
    expect(ids(leiteKategorienAb('budgetJson', { report, data: ohneName }))).not.toContain('name');
  });
});

describe('Lebenslauf (HTML und JSON Resume)', () => {
  const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
  const data = {
    basis: { firstName: 'Anna', lastName: 'Muster', phone: '061 000 00 00', dateOfBirth: '1990-04-01', canton: 'BS' },
    wohnen: { address: 'Musterweg 1', postalCode: '4051', city: 'Basel' },
    ausbildung: { jobTitle: 'Pflegefachfrau', employer: 'Spital X', educationLevel: 'HF', languages: 'Deutsch, Französisch' },
  };

  it('HTML: aus dem Objekt, das ausgeschrieben wird', () => {
    const r = leiteKategorienAb('cvHtml', { cv: generateCVTemplate(data, t), data });
    expect(r.form).toBe('datei');
    expect(ids(r)).toEqual(['name', 'kontakt', 'adresse', 'persoenlich', 'beruf', 'ausbildung', 'sprachen']);
    expect(JSON.stringify(r)).not.toContain('Musterweg');
  });

  it('JSON Resume: ohne Geburtsdatum und Zivilstand, darum ohne «persoenlich»', () => {
    const r = leiteKategorienAb('cvJson', { resume: generateJSONResume(data, t) });
    expect(ids(r)).toEqual(['name', 'kontakt', 'adresse', 'beruf', 'ausbildung', 'sprachen']);
  });

  it('JSON Resume: der feste Ländercode allein ist keine Adresse', () => {
    const leer = generateJSONResume({ basis: {}, wohnen: {}, ausbildung: {} }, t);
    expect(leer.basics.location.countryCode).toBe('CH');
    expect(ids(leiteKategorienAb('cvJson', { resume: leer }))).toEqual([]);
  });
});

describe('Kalender (.ics)', () => {
  it('zählt die Termine, die wirklich in der Datei landen', () => {
    const ics = buildICS([
      { id: 'a', title: 'Steuererklärung', dueDate: '2026-03-31', category: 'steuern' },
      { id: 'b', title: 'Zahnarzt', dueDate: '2026-04-02' },
      { id: 'c', title: 'Ohne Datum', dueDate: '' },   // fällt aus der Datei — und aus der Vorschau
    ]);
    const r = leiteKategorienAb('kalender', { ics });
    expect(r.form).toBe('datei');
    expect(ids(r)).toEqual(['kalenderTermine']);
    expect(r.kategorien[0].count).toBe(2);
    expect(JSON.stringify(r)).not.toContain('Zahnarzt');
  });

  it('ohne Termine bleibt die Liste leer', () => {
    expect(ids(leiteKategorienAb('kalender', { ics: buildICS([]) }))).toEqual([]);
  });
});

describe('Druck mit Namen im Titel (Finanzübersicht)', () => {
  it('nennt den Namen zuerst, dann die gedruckten Abschnitte', () => {
    const r = leiteKategorienAb('dossier', {
      name: true,
      abschnitte: [{ titel: 'Finanzübersicht', felder: ['Monatslohn', 'Kanton'] }],
    });
    expect(r.form).toBe('druck');
    expect(ids(r)).toEqual(['name', 'abschnitt']);
    expect(r.kategorien[1].detail).toBe('Monatslohn, Kanton');
  });

  it('ohne Namen im Titel fehlt die Kategorie', () => {
    const r = leiteKategorienAb('dossier', { name: false, abschnitte: [{ titel: 'Finanzübersicht', felder: [] }] });
    expect(ids(r)).toEqual(['abschnitt']);
  });
});

describe('i18n: jede Kategorie hat einen Text in allen 5 Sprachen', () => {
  const alle = ['weitere', 'ahv', 'gesundheit', 'dokumenteListe', 'dokumenteInhalt', 'termine', 'kontakte',
    'merkliste', 'einstellungen', 'person', 'adresse', 'berechnungen', 'name', 'kanton', 'versicherung',
    'belege', 'arbeitgeber', 'lohn', 'briefAngaben',
    // K20
    'ipvErgebnis', 'einkommen', 'ausgaben', 'schulden', 'haushalt', 'kontakt', 'persoenlich',
    'beruf', 'ausbildung', 'sprachen', 'kalenderTermine'];
  const saetze = ['titelDatei', 'titelDruck', 'introDatei', 'introDruck', 'leer', 'verschluesselt', 'offen',
    'offenDruck', 'weiterDatei', 'weiterDruck', 'zurueck'];
  for (const [lang, tr] of Object.entries({ de, en, fr, it: itTranslations, rm })) {
    it(lang, () => {
      const v = tr.zipExport.vorschau;
      for (const k of alle) expect(v.kat[k], lang + ' kat.' + k).toBeTruthy();
      for (const k of saetze) expect(v[k], lang + ' ' + k).toBeTruthy();
      // Ruhige Sprache: keine Ausrufezeichen in der Vorschau
      expect(JSON.stringify(v)).not.toContain('!');
    });
  }
});
