import { describe, it, expect, vi } from 'vitest';
import { getChapters } from '../config/constants.js';
import { getNotfallDossierPreview } from '../dossierGenerator.js';
import { notfallpassFelder, inZwischenablage, NOTFALLPASS_GRUPPEN } from '../utils/notfallpass.js';
import { NA_FELD } from '../utils/vollstaendigkeit.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

// Notfallpass vorbereiten (23.09.2026): die Werte kommen aus derselben Quelle wie
// Dossier und QR — getNotfallDossierPreview(). Hier wird geprüft, dass die Zuordnung
// stimmt, dass die Listen-Felder des Kapitels ankommen und dass nichts erfunden wird.

const t = (k) => k;
const chapters = getChapters(t);
const wertVon = (gruppen, key) => gruppen.flatMap(g => g.felder).find(f => f.key === key).wert;
const felderAus = (data) => notfallpassFelder(getNotfallDossierPreview(data, chapters, t).sections);

const voll = {
  basis: { firstName: 'Anna', lastName: 'Muster', dateOfBirth: '1980-04-02' },
  notfall: {
    emergencyContact: 'Beat Muster', emergencyPhone: '079 000 00 00',
    bloodType: 'aPos', allergies: 'Penicillin',
    medicationsList: [{ name: 'Levothyroxin', dose: '50', unit: 'µg' }, { name: '', dose: '1' }],
    chronicDiseasesList: [{ name: 'Hypothyreose', code: 'E03.9' }],
  },
};

describe('Notfallpass: Felder aus dem Profil', () => {
  it('bildet jedes vorhandene Feld in der Reihenfolge der Apple-Hilfe ab', () => {
    const g = felderAus(voll);
    expect(g.map(x => x.key)).toEqual(['profil', 'pass']);
    expect(g[1].felder.map(f => f.key)).toEqual(['erkrankungen', 'medikamente', 'allergien', 'blutgruppe', 'kontaktName', 'kontaktTelefon']);
    expect(wertVon(g, 'name')).toBe('Anna Muster');
    expect(wertVon(g, 'geburtsdatum')).toBe('02.04.1980');
    expect(wertVon(g, 'allergien')).toBe('Penicillin');
    expect(wertVon(g, 'kontaktName')).toBe('Beat Muster');
    expect(wertVon(g, 'kontaktTelefon')).toBe('079 000 00 00');
  });

  it('Blutgruppe als Beschriftung der Auswahl, nicht als interner Wert', () => {
    const tDe = createT({ de }, 'de', 'sie');
    const g = notfallpassFelder(getNotfallDossierPreview(voll, getChapters(tDe), tDe).sections);
    expect(wertVon(g, 'blutgruppe')).toBe('A+');
    const blut = NOTFALLPASS_GRUPPEN[1].felder.find(f => f.key === 'blutgruppe');
    expect(blut.auswahl).toBe(true);
  });

  it('Medikamente und Erkrankungen aus den Listen des Kapitels (nicht nur aus dem alten Textfeld)', () => {
    const g = felderAus(voll);
    expect(wertVon(g, 'medikamente')).toBe('Levothyroxin 50 µg');
    expect(wertVon(g, 'erkrankungen')).toBe('Hypothyreose (E03.9)');
  });

  it('dieselben Listen-Werte stehen auch im Dossier (eine Quelle für QR und Blatt)', () => {
    const med = getNotfallDossierPreview(voll, chapters, t).sections.find(s => s.key === 'medical');
    expect(med.rows.find(r => r.feld === 'notfall.medications').value).toBe('Levothyroxin 50 µg');
  });

  it('altes Textfeld bleibt Rückfall, wenn keine Liste da ist', () => {
    const g = felderAus({ basis: {}, notfall: { medications: 'Aspirin', chronicDiseases: 'Asthma' } });
    expect(wertVon(g, 'medikamente')).toBe('Aspirin');
    expect(wertVon(g, 'erkrankungen')).toBe('Asthma');
  });

  it('leeres Profil: jedes Feld leer, nichts erfunden, nichts wirft', () => {
    const g = felderAus({ basis: {}, notfall: {} });
    for (const f of g.flatMap(x => x.felder)) expect(f.wert).toBe('');
    expect(notfallpassFelder(undefined).flatMap(x => x.felder).every(f => f.wert === '')).toBe(true);
  });

  it('«Keine Kontaktperson» ist ein Platzhalter und wird nicht zum Wert', () => {
    const g = felderAus({ basis: {}, notfall: { [NA_FELD]: ['emergencyContact'], allergies: 'x' } });
    expect(wertVon(g, 'kontaktName')).toBe('');
  });
});

describe('Notfallpass: Kopieren', () => {
  it('ruft navigator.clipboard.writeText mit dem Wert', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const ok = await inZwischenablage('Penicillin', { navigator: { clipboard: { writeText } } });
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('Penicillin');
  });

  it('fällt auf execCommand zurück, wenn clipboard fehlt oder ablehnt', async () => {
    const feld = { value: '', style: {}, setAttribute: vi.fn(), select: vi.fn() };
    const doc = {
      createElement: vi.fn(() => feld), execCommand: vi.fn(() => true),
      body: { appendChild: vi.fn(), removeChild: vi.fn() },
    };
    const writeText = vi.fn().mockRejectedValue(new Error('nicht erlaubt'));
    const ok = await inZwischenablage('A+', { navigator: { clipboard: { writeText } }, document: doc });
    expect(ok).toBe(true);
    expect(doc.execCommand).toHaveBeenCalledWith('copy');
    expect(feld.value).toBe('A+');
    expect(doc.body.removeChild).toHaveBeenCalledWith(feld);
  });

  it('meldet false statt zu werfen, wenn nichts geht — und kopiert nie einen leeren Wert', async () => {
    expect(await inZwischenablage('x', {})).toBe(false);
    const writeText = vi.fn();
    expect(await inZwischenablage('', { navigator: { clipboard: { writeText } } })).toBe(false);
    expect(writeText).not.toHaveBeenCalled();
  });
});
