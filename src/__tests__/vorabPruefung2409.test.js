// Vorab-Prüfung vor dem Deploy, 24.09.2026 — drei Befunde der Prüfer, je eine Zusage.
//
//   1. Luzern nennt EINE Anmeldestelle: die kantonale Ausgleichskasse (WAS). Vorher sagte der
//      Kantonskasten «AHV-Zweigstelle Gemeinde», Quelle und Fristtext nannten die WAS.
//   2. Der Krankenkassen-QR behauptet keinen Schutz, den er nicht hat. Er trägt AHV- und
//      Kartennummer als offenen Text; «nur diese App liest ihn» war falsch.
//   3. Die Notfallnummer steht in der vCard nie unbeschriftet unter dem Namen der Person.
//      N/FN = Person, TEL = Kontaktperson → die Zeile «Telefon Notfall: …» bleibt in der Notiz.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { CANTONAL_IPV } from '../config/cantonalData.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTexte from '../i18n/it.js';
import rm from '../i18n/rm.js';

const lies = (p) => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');
const wert = (texte, schluessel) => schluessel.split('.').reduce((o, s) => o?.[s], texte);

describe('1 · Luzern: eine Anmeldestelle', () => {
  it('der Kantonskasten nennt die Ausgleichskasse, keine AHV-Zweigstelle', () => {
    const text = wert(de, CANTONAL_IPV.LU.noteKey);
    expect(text).toMatch(/Ausgleichskasse/);
    expect(text).not.toMatch(/Zweigstelle/);
  });

  it('Beleg und Text zeigen auf dieselbe Stelle (WAS Ausgleichskasse Luzern)', () => {
    expect(CANTONAL_IPV.LU.beleg.quelle).toMatch(/WAS Ausgleichskasse Luzern/);
  });
});

describe('2 · Krankenkassen-QR: keine Schutz-Behauptung', () => {
  // Erlaubnisliste statt Verbotsliste: jede Sprache muss «nicht verschlüsselt» SAGEN.
  const muss = { de: 'nicht verschlüsselt', en: 'not encrypted', fr: 'non chiffré', it: 'non cifrato', rm: 'betg criptà' };
  const sprachen = { de, en, fr, it: itTexte, rm };
  for (const [l, texte] of Object.entries(sprachen)) {
    it(`${l}: sagt «${muss[l]}»`, () => {
      const hits = JSON.stringify(texte).match(/"qrUebernahme":"([^"]*)"/g) || [];
      expect(hits.length).toBeGreaterThan(0);
      for (const h of hits) expect(h).toContain(muss[l]);
    });
  }
});

describe('3 · Notfall-vCard: Nummer mit Etikett', () => {
  let qrNotfallVcard;
  const gesetzt = [];
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
    ({ qrNotfallVcard } = await import('../utils/qrSicher.js'));
  });
  afterAll(() => { for (const k of gesetzt) delete globalThis[k]; });

  const entfalten = (v) => v.replace(/\r\n /g, '');

  it('die Notiz trägt «Telefon Notfall: …» neben der Kontaktperson, TEL bleibt wählbar', () => {
    const abschnitte = [
      { key: 'medical', title: 'Medizin', rows: [{ label: 'Blutgruppe', value: '0+' }] },
      { key: 'contact', title: 'Notfall', rows: [
        { label: 'Notfall-Kontaktperson', value: 'Beat Muster' },
        { label: 'Telefon Notfall', value: '079 000 00 00' },
      ] },
    ];
    const r = qrNotfallVcard(abschnitte, { name: 'Anna Muster', tel: '079 000 00 00', fehltTitel: 'Nicht enthalten' });
    const v = entfalten(r.text);
    expect(v).toContain('TEL;TYPE=CELL:079 000 00 00');
    const notiz = v.split('\r\n').find((z) => z.startsWith('NOTE:'));
    expect(notiz).toContain('Telefon Notfall: 079 000 00 00');
    expect(notiz).toContain('Notfall-Kontaktperson: Beat Muster');
  });

  it('an der Aufrufstelle: NotfallDossier filtert die Nummer nicht mehr aus der Notiz', () => {
    const quelle = lies('NotfallDossier.jsx');
    expect(quelle).toMatch(/qrNotfallVcard\(qrAbschnitte,/);
    expect(quelle).not.toMatch(/qrAbschnitteOhneNummer/);
  });
});
