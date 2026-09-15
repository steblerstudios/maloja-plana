import { describe, it, expect } from 'vitest';
import { leiteKategorienAb, hatWert } from '../exportVorschau.js';
import { generateBehoerdenJSON, getLebensMappePreview } from '../dossierGenerator.js';
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
});

describe('i18n: jede Kategorie hat einen Text in allen 5 Sprachen', () => {
  const alle = ['weitere', 'ahv', 'gesundheit', 'dokumenteListe', 'dokumenteInhalt', 'termine', 'kontakte',
    'merkliste', 'einstellungen', 'person', 'adresse', 'berechnungen', 'name', 'kanton', 'versicherung',
    'belege', 'arbeitgeber', 'lohn'];
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
