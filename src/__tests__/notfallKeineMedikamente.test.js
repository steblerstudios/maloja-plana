import { describe, it, expect } from 'vitest';
import { getChapters } from '../config/constants.js';
import { getNotfallDossierPreview, notfallQrAbschnitte } from '../dossierGenerator.js';
import { notfallpassFelder } from '../utils/notfallpass.js';
import { keineMedikamente } from '../utils/naGruppen.js';
import { NA_FELD } from '../utils/vollstaendigkeit.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../i18n/rm.js';

// «Ich nehme keine» (Medikamente) erschien bis 25.10.2026 weder im Notfall-Dossier noch im QR noch
// auf dem Notfallpass — für Helfende ist «keine» etwas anderes als «nicht erfasst».

const t = (k) => k;
const chapters = getChapters(t);
const zeile = (data, sections = getNotfallDossierPreview(data, chapters, t).sections) =>
  sections.flatMap(s => s.rows).find(r => r.feld === 'notfall.medications');

const markiert = { basis: { firstName: 'Anna' }, notfall: { bloodType: 'aPos', [NA_FELD]: ['medications'] } };

describe('keineMedikamente', () => {
  it('nur markiert und nichts erfasst', () => {
    expect(keineMedikamente(markiert.notfall)).toBe(true);
    expect(keineMedikamente({ [NA_FELD]: ['medications'], medicationsList: [{ name: 'Levothyroxin' }] })).toBe(false);
    expect(keineMedikamente({ [NA_FELD]: ['medications'], medications: 'Aspirin' })).toBe(false);
    expect(keineMedikamente({ medicationsList: [] })).toBe(false);
    expect(keineMedikamente(undefined)).toBe(false);
  });
});

describe('«keine» in Dossier, QR und Notfallpass', () => {
  it('Dossier-Zeile sagt «keine» — als echte Angabe, kein Platzhalter', () => {
    const r = zeile(markiert);
    expect(r.value).toBe('naZustand.keineMedikamente');
    expect(r.platzhalter).toBeUndefined();
  });

  it('kommt in den Notfall-QR und auf den Notfallpass', () => {
    const { sections } = getNotfallDossierPreview(markiert, chapters, t);
    expect(zeile(markiert, notfallQrAbschnitte(sections))?.value).toBe('naZustand.keineMedikamente');
    const wert = notfallpassFelder(sections).flatMap(g => g.felder).find(f => f.key === 'medikamente').wert;
    expect(wert).toBe('naZustand.keineMedikamente');
  });

  it('erfasste Medikamente gehen vor; ohne Markierung bleibt die Zeile weg', () => {
    const mit = { notfall: { [NA_FELD]: ['medications'], medicationsList: [{ name: 'Levothyroxin', dose: '50', unit: 'µg' }] } };
    expect(zeile(mit).value).toBe('Levothyroxin 50 µg');
    expect(zeile({ notfall: { bloodType: 'aPos' } })).toBeUndefined();
  });

  it('Wort in allen fünf Sprachen vorhanden', () => {
    for (const s of [de, en, fr, itSprache, rm]) expect(s.naZustand.keineMedikamente).toBeTruthy();
  });
});
