import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getChapters } from '../config/constants.js';
import { NA_FELD, naBereinigen, grundordnung } from '../utils/vollstaendigkeit.js';
import { eintragFolgen } from '../utils/eintragFolgen.js';

// K45 (Bau-Liste §12, Entscheide 17.09.) und K62 Punkt 2.
//   a) «Arbeitsbeginn» (Finanzen) und «Anstellung seit» (Ausbildung & Arbeit) belegen sich vor.
//   b) Kein Pflicht-Stern mehr beim Notfallkontakt; er zählt weiter wie `jobTitle`.
//   c) Ein eingetragener Wert hebt «trifft nicht zu» auf — für jedes Feld.
//   K62.2) Partnereinkommen 0 bleibt als «0» sichtbar.

const t = (k) => k;
const chapters = getChapters(t);
const feld = (kap, k) => chapters.find((c) => c.key === kap).fields.find((f) => f.k === k);
const src = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

// updateData aus main.jsx nachgebaut (ohne PLZ/Kanton/Arbeitgeber-Spiegel).
const schreibe = (prev, chapter, field, value) =>
  eintragFolgen(prev, { ...prev, [chapter]: { ...prev[chapter], [field]: value } }, chapter, field, value);

describe('K45a · Arbeitsbeginn ↔ Anstellung seit', () => {
  it('Arbeitsbeginn in Finanzen belegt «Anstellung seit» vor', () => {
    const d = schreibe({ finanzen: {}, ausbildung: {} }, 'finanzen', 'startDate', '2019-04-01');
    expect(d.ausbildung.employmentStart).toBe('2019-04-01');
  });

  it('«Anstellung seit» belegt den Arbeitsbeginn vor, auch ohne bestehendes Kapitel', () => {
    const d = schreibe({ ausbildung: {} }, 'ausbildung', 'employmentStart', '2021-08-15');
    expect(d.finanzen).toEqual({ startDate: '2021-08-15' });
  });

  it('überschreibt nie einen bestehenden Wert', () => {
    const d = schreibe({ finanzen: {}, ausbildung: { employmentStart: '2018-01-01' } }, 'finanzen', 'startDate', '2019-04-01');
    expect(d.ausbildung.employmentStart).toBe('2018-01-01');
    expect(d.finanzen.startDate).toBe('2019-04-01');
  });

  it('ein als «trifft nicht zu» markiertes Gegenfeld bleibt leer und markiert', () => {
    const d = schreibe({ finanzen: { [NA_FELD]: ['startDate'] }, ausbildung: {} }, 'ausbildung', 'employmentStart', '2021-08-15');
    expect(d.finanzen.startDate).toBeUndefined();
    expect(d.finanzen[NA_FELD]).toEqual(['startDate']);
  });

  it('Zwischenwerte beim Tippen und Leeren belegen nichts vor', () => {
    for (const v of ['0002-04-01', '0020-04-01', '0201-04-01', '', undefined, 'kaputt']) {
      const d = schreibe({ finanzen: {}, ausbildung: {} }, 'finanzen', 'startDate', v);
      expect(d.ausbildung.employmentStart, String(v)).toBeUndefined();
    }
  });

  it('Leeren des einen Feldes lässt das andere stehen (nicht erzwungen)', () => {
    const d = schreibe({ finanzen: { startDate: '2019-04-01' }, ausbildung: { employmentStart: '2019-04-01' } }, 'finanzen', 'startDate', '');
    expect(d.finanzen.startDate).toBe('');
    expect(d.ausbildung.employmentStart).toBe('2019-04-01');
  });

  it('andere Felder und Kapitel koppeln nicht', () => {
    const prev = { finanzen: {}, ausbildung: {}, basis: {} };
    expect(schreibe(prev, 'basis', 'startDate', '2019-04-01').ausbildung).toBe(prev.ausbildung);
    expect(schreibe(prev, 'finanzen', 'employmentStart', '2019-04-01').ausbildung).toBe(prev.ausbildung);
  });

  it('main.jsx führt jeden Eintrag durch eintragFolgen, nach dem Beispiel-Halt', () => {
    const main = src('main.jsx');
    const start = main.indexOf('const updateData = (chapter, field, value) => {');
    const koerper = main.slice(start, main.indexOf('\n  };', start));
    expect(koerper).toContain('return eintragFolgen(prev, next, chapter, field, value);');
    expect(koerper.indexOf('if (demoMode) return;')).toBeLessThan(koerper.indexOf('eintragFolgen('));
  });
});

describe('K45b · Notfallkontakt ohne Pflicht-Stern', () => {
  it('Kontakt und Telefon tragen kein `required` mehr', () => {
    expect(feld('notfall', 'emergencyContact').required).toBeFalsy();
    expect(feld('notfall', 'emergencyPhone').required).toBeFalsy();
  });

  it('der Stern hängt allein an `required` (kein aria-required, der Label-Text bleibt)', () => {
    const cv = src('ChapterView.jsx');
    expect(cv).not.toContain('aria-required');
    expect(cv).toContain("field.label + (field.required ? ' *' : '')");
    expect(feld('notfall', 'emergencyContact').label).toBe('chapters.notfall.fields.emergencyContact');
  });

  it('Vollständigkeit wie E17/jobTitle: zählt zur Grundordnung, «trifft nicht zu» erledigt ihn', () => {
    const f = feld('notfall', 'emergencyContact');
    expect(f.mvo).toBe(true);
    expect(f.naOk).toBe(true);
    const offen = grundordnung(chapters, { notfall: {} }).fields.filter((x) => x.key.startsWith('emergency'));
    expect(offen.every((x) => !x.done)).toBe(true);
    const na = grundordnung(chapters, { notfall: { [NA_FELD]: ['emergencyContact', 'emergencyPhone'] } }).fields.filter((x) => x.key.startsWith('emergency'));
    expect(na.every((x) => x.done)).toBe(true);
    // das Notfall-Kapitel behält eine Grundordnung (sonst käme es nie auf «Überblick steht»)
    expect(chapters.find((c) => c.key === 'notfall').fields.some((x) => x.mvo)).toBe(true);
  });

  it('nur die Vornamen-, Namen- und Geburtsdatum-Felder tragen noch den Stern', () => {
    const mitStern = chapters.flatMap((c) => c.fields.filter((x) => x.required).map((x) => x.k));
    expect(mitStern).toEqual(['firstName', 'lastName', 'dateOfBirth']);
  });
});

describe('K45c · ein Wert hebt «trifft nicht zu» auf', () => {
  it('naBereinigen nimmt nur Felder mit Wert aus der Liste', () => {
    expect(naBereinigen({ a: 'x', [NA_FELD]: ['a', 'b'] })).toEqual({ a: 'x', [NA_FELD]: ['b'] });
  });

  it('ohne Änderung dasselbe Objekt; Altwerte und Leeres stören nicht', () => {
    for (const d of [{}, { [NA_FELD]: ['a'] }, { [NA_FELD]: 'kaputt', a: 1 }, { a: '', [NA_FELD]: ['a'] }]) {
      expect(naBereinigen(d)).toBe(d);
    }
    expect(naBereinigen(undefined)).toBeUndefined();
    expect(naBereinigen(null)).toBeNull();
    expect(naBereinigen(4)).toBe(4);
  });

  it('generisch: Telefon, Stellenbezeichnung, Notfallkontakt', () => {
    expect(schreibe({ basis: { [NA_FELD]: ['phone', 'email'] } }, 'basis', 'phone', '+41 79 000 00 00').basis[NA_FELD]).toEqual(['email']);
    expect(schreibe({ ausbildung: { [NA_FELD]: ['jobTitle'] } }, 'ausbildung', 'jobTitle', 'Pflege').ausbildung[NA_FELD]).toEqual([]);
    const n = schreibe({ notfall: { [NA_FELD]: ['emergencyContact', 'emergencyPhone'] } }, 'notfall', 'emergencyContact', 'A. B.');
    expect(n.notfall[NA_FELD]).toEqual(['emergencyPhone']);
  });

  it('ein leerer Eintrag hebt nichts auf', () => {
    const prev = { basis: { [NA_FELD]: ['phone'] } };
    expect(schreibe(prev, 'basis', 'phone', '').basis[NA_FELD]).toEqual(['phone']);
  });

  it('auch ein über Kapitel gespiegelter Wert hebt die Markierung dort auf', () => {
    const prev = { finanzen: {}, ausbildung: { [NA_FELD]: ['employer'] } };
    const next = { ...prev, finanzen: { employer: 'Muster AG' }, ausbildung: { ...prev.ausbildung, employer: 'Muster AG' } };
    const d = eintragFolgen(prev, next, 'finanzen', 'employer', 'Muster AG');
    expect(d.ausbildung[NA_FELD]).toEqual([]);
  });

  it('unveränderte Kapitel bleiben dasselbe Objekt', () => {
    const prev = { basis: {}, notfall: { emergencyContact: 'A', [NA_FELD]: ['emergencyContact'] } };
    const d = schreibe(prev, 'basis', 'city', 'Bern');
    expect(d.notfall).toBe(prev.notfall);
  });

  it('die Anzeige zeigt bei Altdaten mit Wert und Markierung den Wert, nicht den Hinweis', () => {
    expect(src('ChapterView.jsx')).toContain('const na = trifftNichtZu(data, field.k) && !feldHatWert(data, field.k);');
  });

  it('keine Meldung: eintragFolgen kennt keinen Text', () => {
    const e = src('utils/eintragFolgen.js');
    expect(e).not.toMatch(/\bt\(|tr\(/);
  });
});

describe('K62.2 · Partnereinkommen 0 bleibt sichtbar', () => {
  it('das Haushaltsfeld nutzt ?? statt ||', () => {
    const cv = src('ChapterView.jsx');
    expect(cv).toContain("value: household.partnerIncome ?? '',");
    expect(cv).not.toContain("household.partnerIncome || ''");
  });

  it('?? zeigt 0 und "0", lässt Leeres leer', () => {
    const anzeige = (v) => v ?? '';
    expect(anzeige(0)).toBe(0);
    expect(anzeige('0')).toBe('0');
    expect(anzeige(undefined)).toBe('');
    expect(anzeige(null)).toBe('');
    expect(anzeige('')).toBe('');
  });

  it('der Vorsorgerechner übernimmt 0 als «0»', () => {
    const vr = src('VorsorgeRechner.jsx');
    expect(vr).toContain("return p == null || p === '' ? '' : String(Math.round(Number(p) * 12) || 0);");
  });
});
