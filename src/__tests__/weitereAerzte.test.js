// «Weitere Ärzte» in Notfall-Dossier und Notfall-QR (Entscheid Stebler Studios 26.10.2026): Fachärztinnen und
// Fachärzte aus der Liste erschienen bis dahin nirgends — die Ausgänge zeigen nur den Hausarzt (utils/hausarzt.js).
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getChapters } from '../config/constants.js';
import { getNotfallDossierPreview, notfallQrAbschnitte, generateNotfallDossier, NOTFALL_QR_FELDER } from '../dossierGenerator.js';
import { weitereAerzteAusListe } from '../utils/hausarzt.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../i18n/rm.js';

const t = createT({ de }, 'de');
const chapters = getChapters(t);
const liste = [
  { name: 'Dr. med. Haus', specialty: 'hausarzt', phone: '044 111 11 11' },
  { name: 'Dr. med. dent. Zahn', specialty: 'zahnarzt', phone: '044 222 22 22' },
  { name: 'Dr. med. Psych', specialty: 'psychiater' },
  { name: 'Dr. med. Herz', specialty: 'other', phone: '044 333 33 33' },
  { name: '   ', specialty: 'zahnarzt' },
];
const data = { basis: { firstName: 'Anna' }, notfall: { emergencyContact: 'Peter', doctorsList: liste } };
// QRCode.js hängt sich beim Import an `window`; die Testumgebung ist Node (wie qrSicher.test.js).
let qrNotfallVcard;
let QR_MAX_BYTES_VCARD;
let gesetzt = [];
beforeAll(async () => {
  if (!('window' in globalThis)) { globalThis.window = globalThis; gesetzt.push('window'); }
  if (!('document' in globalThis)) {
    gesetzt.push('document');
    globalThis.document = {
      documentElement: { tagName: 'div' },
      getElementById: () => null,
      createElement: () => ({ style: {}, getContext: () => null, appendChild() {}, setAttribute() {} }),
    };
  }
  ({ qrNotfallVcard, QR_MAX_BYTES_VCARD } = await import('../utils/qrSicher.js'));
});
afterAll(() => { for (const k of gesetzt) delete globalThis[k]; gesetzt = []; });

const zeile = (sections, feld) => sections.flatMap((s) => s.rows).find((r) => r.feld === feld);

describe('weitere Ärzte', () => {
  it('nur Nicht-Hausärzte mit Namen', () => {
    expect(weitereAerzteAusListe(data.notfall).map((x) => x.name)).toEqual(['Dr. med. dent. Zahn', 'Dr. med. Psych', 'Dr. med. Herz']);
    expect(weitereAerzteAusListe({})).toEqual([]);
    expect(weitereAerzteAusListe({ doctorsList: 'kaputt' })).toEqual([]);
  });

  it('Dossier: eigene Zeile unter «Ärztliche Betreuung», Hausarzt bleibt in seiner Zeile', () => {
    const { sections } = getNotfallDossierPreview(data, chapters, t);
    const care = sections.find((s) => s.key === 'care');
    const r = care.rows.find((x) => x.feld === 'notfall.weitereAerzte');
    expect(r.label).toBe('Weitere Ärztinnen und Ärzte');
    expect(r.value).toBe('Dr. med. dent. Zahn (Zahnärztin / Zahnarzt), 044 222 22 22; Dr. med. Psych (Psychiaterin / Psychiater); Dr. med. Herz, 044 333 33 33');
    expect(zeile(sections, 'notfall.doctor').value).toBe('Dr. med. Haus');
  });

  it('ohne Fachärzte keine Zeile', () => {
    const { sections } = getNotfallDossierPreview({ notfall: { doctorsList: [liste[0]] } }, chapters, t);
    expect(zeile(sections, 'notfall.weitereAerzte')).toBeUndefined();
  });

  it('gedrucktes Dossier enthält die Zeile', () => {
    expect(generateNotfallDossier(data, chapters, t)).toContain('Dr. med. Psych');
  });

  it('QR: darf hinein, steht ganz am Schluss', () => {
    expect(NOTFALL_QR_FELDER).toContain('notfall.weitereAerzte');
    const voll = { ...data, versicherungen: { kkInsurer: 'Helsana', kkCardNumber: '80756' } };
    const qr = notfallQrAbschnitte(getNotfallDossierPreview(voll, chapters, t).sections);
    const letzte = qr[qr.length - 1];
    expect(letzte.rows.map((r) => r.feld)).toEqual(['notfall.weitereAerzte']);
    expect(letzte.title).toBe(de.notfallDossier.sectionCare);
    expect(qr.find((s) => s.key === 'care').rows.some((r) => r.feld === 'notfall.weitereAerzte')).toBe(false);
  });

  it('QR: lange Liste verdrängt Krankenkasse und Kartennummer nicht', () => {
    const viele = Array.from({ length: 12 }, (_, i) => ({ name: 'Dr. med. Fachärztin Nummer ' + i, specialty: 'gynaekologe', phone: '044 000 00 ' + String(i).padStart(2, '0') }));
    const voll = { basis: { firstName: 'Anna' }, notfall: { emergencyContact: 'Peter', emergencyPhone: '079 000 00 00', bloodType: 'aPos', doctorsList: viele }, versicherungen: { kkInsurer: 'Helsana', kkCardNumber: '80756000000000000000' } };
    const qr = notfallQrAbschnitte(getNotfallDossierPreview(voll, chapters, t).sections);
    const { inhalt, bytes } = qrNotfallVcard(qr, { fehltTitel: 'Nicht enthalten' });
    expect(bytes).toBeLessThanOrEqual(QR_MAX_BYTES_VCARD);
    expect(inhalt).toContain('Helsana');
    expect(inhalt).toContain('80756000000000000000');
  });

  it('Beschriftung in allen fünf Sprachen', () => {
    for (const s of [de, en, fr, itSprache, rm]) expect(s.notfallDossier.weitereAerzte).toBeTruthy();
  });
});
