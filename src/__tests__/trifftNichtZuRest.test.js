import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getChapters } from '../config/constants.js';
import { NA_FELD, kapitelVollstaendigkeit, grundordnung } from '../utils/vollstaendigkeit.js';
import { keineKontaktperson, naGruppeUmschalten, naVerdeckt, naKopplung } from '../utils/naGruppen.js';
import { getNotfallDossierPreview } from '../dossierGenerator.js';
import { prepareDownloadFiles } from '../zipExport.js';
import { leiteKategorienAb } from '../exportVorschau.js';
import { validateData } from '../utils/dataValidation.js';

// K38 (Bau-Liste §11, Entscheide 16.09.): die Reste von «trifft nicht zu» aus E17.
//   1. Notfallkontakt markierbar; Notfall-Ausgaben zeigen ruhig «Keine Kontaktperson hinterlegt».
//   2. Arbeitgeber (und Arbeitgeber-Adresse) gekoppelt über Finanzen ↔ Ausbildung & Arbeit.
//   4. `_na` ist keine Angabe: nicht als CSV-Zeile, nicht in der Export-Vorschau — JSON behält es.

const t = (k) => k;
const chapters = getChapters(t);
const feld = (kap, k) => chapters.find((c) => c.key === kap).fields.find((f) => f.k === k);

// Der Schalter in ChapterView nachgebaut: erst das eigene Kapitel, dann das gekoppelte.
const schreibe = (prev, kapitel, field, value) => {
  const next = { ...prev, [kapitel]: { ...prev[kapitel], [field]: value } };
  const k = naKopplung(prev, kapitel, value);
  if (k) next[k.kapitel] = { ...next[k.kapitel], [NA_FELD]: k.liste };
  return next;
};

describe('K38 · Notfallkontakt «trifft nicht zu»', () => {
  it('Notfallkontakt bietet den Schalter an, die Telefonnummer hängt daran', () => {
    expect(feld('notfall', 'emergencyContact').naOk).toBe(true);
    expect(feld('notfall', 'emergencyContact').naMit).toEqual(['emergencyPhone']);
    expect(feld('notfall', 'emergencyPhone').naVon).toBe('emergencyContact');
    expect(feld('notfall', 'emergencyPhone').naOk).toBeFalsy();
  });

  it('Markieren nimmt Kontakt und Telefon mit, Zurücknehmen beide wieder weg', () => {
    const f = feld('notfall', 'emergencyContact');
    const an = naGruppeUmschalten({}, f);
    expect(an).toEqual(['emergencyContact', 'emergencyPhone']);
    const aus = naGruppeUmschalten({ [NA_FELD]: an }, f);
    expect(aus).toEqual([]);
  });

  it('eine schon eingetragene Telefonnummer wird nicht als «trifft nicht zu» überdeckt', () => {
    const f = feld('notfall', 'emergencyContact');
    expect(naGruppeUmschalten({ emergencyPhone: '079 000 00 00' }, f)).toEqual(['emergencyContact']);
  });

  it('das Telefonfeld ist verdeckt, solange der Kontakt als «trifft nicht zu» gilt', () => {
    const f = feld('notfall', 'emergencyPhone');
    expect(naVerdeckt({ [NA_FELD]: ['emergencyContact', 'emergencyPhone'] }, f)).toBe(true);
    expect(naVerdeckt({}, f)).toBe(false);
    expect(naVerdeckt({ [NA_FELD]: ['emergencyContact'], emergencyPhone: '079' }, f)).toBe(false);
  });

  it('markiert zählt das Kapitel die beiden Felder als erledigt, die Grundordnung auch', () => {
    const notfall = { [NA_FELD]: ['emergencyContact', 'emergencyPhone'] };
    const ch = chapters.find((c) => c.key === 'notfall');
    expect(kapitelVollstaendigkeit(ch, notfall).filled).toBe(2);
    const g = grundordnung(chapters, { notfall });
    const kontakt = g.fields.filter((x) => x.key.startsWith('emergency'));
    expect(kontakt.every((x) => x.done && x.na)).toBe(true);
  });

  it('keineKontaktperson: nur bei Markierung ohne Wert', () => {
    expect(keineKontaktperson({ [NA_FELD]: ['emergencyContact'] })).toBe(true);
    expect(keineKontaktperson({})).toBe(false);
    expect(keineKontaktperson(undefined)).toBe(false);
    expect(keineKontaktperson({ emergencyContact: 'A. B.', [NA_FELD]: ['emergencyContact'] })).toBe(false);
  });

  it('Notfallkarte (Vorlese-/Dossier-Abschnitte) sagt ruhig «Keine Kontaktperson hinterlegt»', () => {
    const data = { basis: {}, notfall: { [NA_FELD]: ['emergencyContact', 'emergencyPhone'], bloodType: 'A+' } };
    const p = getNotfallDossierPreview(data, chapters, t);
    const kontakt = p.sections.find((s) => s.key === 'contact');
    expect(kontakt).toBeTruthy();
    expect(kontakt.rows).toHaveLength(1);
    expect(kontakt.rows[0].value).toBe('naZustand.keineKontaktperson');
    expect(kontakt.rows[0].platzhalter).toBe(true);
  });

  it('nur die Markierung, sonst nichts: kein Dossier-Abschnitt nur für den Platzhalter', () => {
    const p = getNotfallDossierPreview({ basis: {}, notfall: { [NA_FELD]: ['emergencyContact'] } }, chapters, t);
    expect(p.sections).toHaveLength(0);
  });

  it('ohne Markierung bleibt der Kontakt-Abschnitt leer wie bisher', () => {
    const p = getNotfallDossierPreview({ basis: {}, notfall: {} }, chapters, t);
    expect(p.sections.find((s) => s.key === 'contact')).toBeUndefined();
  });

  it('MANIFEST nennt den Zustand statt eines Strichs', () => {
    const files = prepareDownloadFiles({ basis: {}, notfall: { [NA_FELD]: ['emergencyContact'] } }, [], (k) => k);
    const zeile = files.manifest.content.split('\n').find((z) => z.includes('zipExport.manifest.emergencyContact'));
    expect(zeile).toContain('naZustand.keineKontaktperson');
  });
});

describe('K38 · Arbeitgeber gekoppelt (Finanzen ↔ Ausbildung & Arbeit)', () => {
  it('Setzen in Finanzen markiert auch Ausbildung', () => {
    const d = schreibe({ finanzen: {}, ausbildung: {} }, 'finanzen', NA_FELD, ['employer']);
    expect(d.finanzen[NA_FELD]).toEqual(['employer']);
    expect(d.ausbildung[NA_FELD]).toEqual(['employer']);
  });

  it('Setzen in Ausbildung markiert auch Finanzen, andere Markierungen bleiben', () => {
    const d = schreibe({ finanzen: { [NA_FELD]: ['startDate'] }, ausbildung: { [NA_FELD]: ['jobTitle'] } }, 'ausbildung', NA_FELD, ['jobTitle', 'employer']);
    expect(d.finanzen[NA_FELD]).toEqual(['startDate', 'employer']);
    expect(d.ausbildung[NA_FELD]).toEqual(['jobTitle', 'employer']);
  });

  it('Zurücknehmen entfernt in beiden Kapiteln', () => {
    const prev = { finanzen: { [NA_FELD]: ['employer', 'startDate'] }, ausbildung: { [NA_FELD]: ['employer', 'jobTitle'] } };
    const d = schreibe(prev, 'finanzen', NA_FELD, ['startDate']);
    expect(d.finanzen[NA_FELD]).toEqual(['startDate']);
    expect(d.ausbildung[NA_FELD]).toEqual(['jobTitle']);
  });

  it('die Arbeitgeber-Adresse ist ebenso gekoppelt', () => {
    const d = schreibe({ finanzen: {}, ausbildung: {} }, 'finanzen', NA_FELD, ['employerAddress']);
    expect(d.ausbildung[NA_FELD]).toEqual(['employerAddress']);
    const e = schreibe(d, 'ausbildung', NA_FELD, []);
    expect(e.finanzen[NA_FELD]).toEqual([]);
  });

  it('nicht gekoppelte Felder bleiben je Kapitel', () => {
    const d = schreibe({ finanzen: {}, ausbildung: {} }, 'finanzen', NA_FELD, ['startDate']);
    expect(d.ausbildung[NA_FELD]).toBeUndefined();
  });

  it('eine bestehende Angabe im anderen Kapitel wird nicht als «trifft nicht zu» überdeckt', () => {
    const d = schreibe({ finanzen: {}, ausbildung: { employer: 'Muster AG' } }, 'finanzen', NA_FELD, ['employer']);
    expect(d.ausbildung[NA_FELD]).toBeUndefined();
    expect(d.ausbildung.employer).toBe('Muster AG');
  });

  it('kaputte Altwerte stören nicht; ohne Änderung an gekoppelten Feldern keine Kopplung', () => {
    const prev = { finanzen: { [NA_FELD]: 'kaputt' }, ausbildung: {} };
    expect(naKopplung(prev, 'finanzen', ['startDate'])).toBeNull();
    const e = schreibe(prev, 'finanzen', NA_FELD, ['employer']);
    expect(e.ausbildung[NA_FELD]).toEqual(['employer']);
    expect(naKopplung(undefined, 'finanzen', ['employer'])).toBeNull();
  });

  it('andere Kapitel koppeln nicht', () => {
    const prev = { basis: {}, finanzen: {}, ausbildung: {} };
    const d = schreibe(prev, 'basis', NA_FELD, ['phone']);
    expect(d.finanzen).toBe(prev.finanzen);
    expect(d.ausbildung).toBe(prev.ausbildung);
  });

  it('Beispiel-Modus: der Kopplungsweg führt durch updateData, das im Beispiel nichts schreibt', () => {
    const main = fs.readFileSync(path.join(__dirname, '..', 'main.jsx'), 'utf8');
    expect(main).toContain('onUpdateIn: updateData,');
    const start = main.indexOf('const updateData = (chapter, field, value) => {');
    expect(start).toBeGreaterThan(-1);
    const koerper = main.slice(start, main.indexOf('\n  };', start));
    const demo = koerper.indexOf('if (demoMode) return;');
    expect(demo).toBeGreaterThan(-1);
    expect(koerper.indexOf('writeData(')).toBeGreaterThan(demo);
    // und im Beispiel bietet das Kapitel den Schalter gar nicht an
    const cv = fs.readFileSync(path.join(__dirname, '..', 'ChapterView.jsx'), 'utf8');
    expect(cv).toContain('if (!field.naOk || demoMode) return el;');
  });
});

describe('K38 · Alimente bleiben selbst markierbar', () => {
  it('alimentePaid und alimenteReceived bieten den Schalter an (Alimente gibt es auch ohne Kinder)', () => {
    expect(feld('finanzen', 'alimentePaid').naOk).toBe(true);
    expect(feld('finanzen', 'alimenteReceived').naOk).toBe(true);
  });
});

describe('K38 · `_na` ist keine Angabe im Export', () => {
  const daten = {
    _version: 4,
    _migratedAt: '2026-09-16T10:00:00.000Z',
    basis: { firstName: 'Anna' },
    finanzen: { [NA_FELD]: ['employer'] },
    ausbildung: { jobTitle: 'Gärtnerin', [NA_FELD]: ['employer'] },
  };

  it('CSV schreibt `_na` nicht als Datenzeile, auch keine anderen `_`-Felder', () => {
    const zeilen = prepareDownloadFiles(daten, [], (k) => k).csv.content.split('\n');
    expect(zeilen.some((z) => z.includes('"_na"'))).toBe(false);
    expect(zeilen.some((z) => z.includes('_version') || z.includes('_MIGRATEDAT') || z.includes('_VERSION'))).toBe(false);
    expect(zeilen.some((z) => z.startsWith('"FINANZEN"'))).toBe(false);
    expect(zeilen).toContain('"AUSBILDUNG","jobTitle","Gärtnerin"');
    expect(zeilen).toContain('"BASIS","firstName","Anna"');
    expect(zeilen).toHaveLength(3);
  });

  it('JSON-Sicherung behält `_na` unverändert', () => {
    const json = JSON.parse(prepareDownloadFiles(daten, [], (k) => k).json.content);
    expect(json.data.finanzen[NA_FELD]).toEqual(['employer']);
    expect(json.data.ausbildung[NA_FELD]).toEqual(['employer']);
    expect(validateData(json.data).valid).toBe(true);
    expect(validateData(json.data).sanitized.finanzen[NA_FELD]).toEqual(['employer']);
  });

  it('Export-Vorschau zählt ein Kapitel mit nur `_na` nicht als «hat Angaben»', () => {
    for (const art of ['json', 'csv', 'sicherung']) {
      const kap = leiteKategorienAb(art, { data: daten }).kategorien.filter((k) => k.id === 'kapitel').map((k) => k.chapter);
      expect(kap, art).toEqual(['basis', 'ausbildung']);
    }
  });

  it('ein Bereich ausserhalb der Kapitel mit nur `_`-Feldern zählt nicht als «weitere»', () => {
    const kat = leiteKategorienAb('json', { data: { basis: { firstName: 'A' }, vorsorge: { _na: ['x'] } } }).kategorien;
    expect(kat.find((k) => k.id === 'weitere')).toBeUndefined();
  });

  it('Notfall-Dossier-Vorschau nennt beim Platzhalter keinen Feldnamen', () => {
    const p = getNotfallDossierPreview({ basis: {}, notfall: { [NA_FELD]: ['emergencyContact'], allergies: 'x' } }, chapters, t);
    const src = fs.readFileSync(path.join(__dirname, '..', 'NotfallDossier.jsx'), 'utf8');
    expect(src).toContain('!r.platzhalter');
    const kontakt = p.sections.find((s) => s.key === 'contact');
    expect(kontakt.rows.filter((r) => !r.platzhalter)).toHaveLength(0);
  });
});
