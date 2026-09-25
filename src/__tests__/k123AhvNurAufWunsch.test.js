// K123 · AHV-Nummer im QR nur auf ausdrücklichen Wunsch (Entscheid Stebler Studios 24.09.2026,
// Option B, docs/entscheide/K123-ahv-im-qr.md). Bis dahin stand die Nummer in drei QR-Codes,
// obwohl die Bauliste das Gegenteil sagte.
// Geprüft wird mit ERLAUBNIS-Listen der NOTE-Felder je Code — nicht «enthält nicht 756»: das
// prüfte nur das Muster, nicht die Zusage.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getChapters } from '../config/constants.js';
import { getNotfallDossierPreview, notfallQrAbschnitte, NOTFALL_QR_FELDER } from '../dossierGenerator.js';
import { generateKKQRCode, parseKKQRCode } from '../kkScanner.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itTexte from '../i18n/it.js'; // nicht `it` — kollidiert mit vitest it()
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// KKScanner.jsx und OrganDonation.jsx ziehen die QR-Bibliothek, die sich an `window` hängt.
let kkNotfallVcard; let organSpendeVcard; let gesetzt = [];
beforeAll(async () => {
  for (const k of ['window', 'document']) if (!(k in globalThis)) gesetzt.push(k);
  globalThis.window ??= globalThis;
  globalThis.document ??= {
    documentElement: { tagName: 'div' },
    getElementById: () => null,
    createElement: () => ({ style: {}, getContext: () => null, appendChild() {}, setAttribute() {} }),
  };
  ({ kkNotfallVcard } = await import('../KKScanner.jsx'));
  ({ organSpendeVcard } = await import('../OrganDonation.jsx'));
});
afterAll(() => { for (const k of gesetzt) delete globalThis[k]; gesetzt = []; });

const t = (k) => k;
const AHV = '756.1234.5678.90';
const entfalten = (v) => String(v).replace(/\r\n /g, '');
const notizVon = (v) => {
  const z = entfalten(v).split('\r\n').find((l) => l.startsWith('NOTE:')) || '';
  return z.slice(5).replace(/\\([\\;,n])/g, (_, c) => (c === 'n' ? '\n' : c));
};
// Etiketten der NOTE-Zeilen («  Etikett: Wert» → Etikett), die Überschrift ausgenommen.
const etiketten = (v) => notizVon(v).split('\n').filter((z) => z.startsWith('  ')).map((z) => z.trim().split(':')[0]);

const vollDaten = {
  basis: { firstName: 'Zoë', lastName: 'Müller', dateOfBirth: '1990-01-01', phone: '079 123 45 67', ahv: AHV },
  wohnen: { address: 'Musterweg 1, 4000 Basel' },
  notfall: { emergencyContact: 'Kim', emergencyPhone: '079 000 00 00', bloodType: 'A+', allergies: 'Nüsse', doctor: 'Dr. X', hospital: 'USB' },
  versicherungen: { kkInsurer: 'ÖKK', kkCardNumber: '80756001234567890' },
};

describe('K123 · Notfall-QR: nur erlaubte Felder, AHV nie', () => {
  const chapters = getChapters(t);
  const preview = getNotfallDossierPreview(vollDaten, chapters, t);

  it('das gedruckte Dossier behält die AHV-Nummer — nur der Code nicht', () => {
    const alle = preview.sections.flatMap((s) => s.rows.map((r) => r.feld));
    expect(alle).toContain('basis.ahv');
  });

  it('jede Zeile im QR stammt aus der Erlaubnisliste, und basis.ahv steht nicht darauf', () => {
    expect(NOTFALL_QR_FELDER).not.toContain('basis.ahv');
    const imQr = notfallQrAbschnitte(preview.sections).flatMap((s) => s.rows.map((r) => r.feld));
    expect(imQr.length).toBeGreaterThan(5);
    for (const f of imQr) expect(NOTFALL_QR_FELDER, f).toContain(f);
    expect(imQr).not.toContain('basis.ahv');
  });

  it('kein anderes Dossier-Feld fällt still aus dem Code — nur die AHV-Nummer', () => {
    const alle = preview.sections.flatMap((s) => s.rows.map((r) => r.feld));
    expect(alle.filter((f) => !NOTFALL_QR_FELDER.includes(f))).toEqual(['basis.ahv']);
  });

  it('Reihenfolge bleibt: Medizin zuerst', () => {
    expect(notfallQrAbschnitte(preview.sections)[0].key).toBe('medical');
  });
});

describe('K123 · Organspende-QR: keine AHV-Nummer', () => {
  it('Erlaubnisliste der NOTE-Etiketten', () => {
    const v = organSpendeVcard({ t, data: vollDaten, status: 'registered', organs: { heart: true } });
    const erlaubt = ['organ.status', 'organ.organsAndTissue', 'notfallSummary.bloodType'];
    for (const e of etiketten(v)) expect(erlaubt, e).toContain(e);
    expect(v).not.toContain(AHV);
  });
});

describe('K123 · KK-Karte: AHV nur mit Schalter', () => {
  const kk = { insurer: 'ÖKK', cardNumber: '80756001234567890', holder: 'Zoë Müller', ahv: AHV, franchise: '2500', model: 'Standard' };
  const OHNE = ['kkScanner.insurer', 'kkScanner.cardNumber', 'kkScanner.franchise', 'kkScanner.model'];

  it('lesbarer Code, Standard: Erlaubnisliste ohne AHV', () => {
    const v = kkNotfallVcard({ t, kkData: kk });
    expect(etiketten(v)).toEqual(OHNE);
    expect(v).not.toContain(AHV);
  });

  it('lesbarer Code, Schalter an: AHV kommt dazu', () => {
    const v = kkNotfallVcard({ t, kkData: kk, mitAhv: true });
    expect(etiketten(v)).toEqual(['kkScanner.insurer', 'kkScanner.cardNumber', 'kkScanner.ahv', 'kkScanner.franchise', 'kkScanner.model']);
  });

  it('Übernahme-Code (JSON), Standard: Schlüssel ohne ahv; mit Schalter: mit', () => {
    expect(Object.keys(JSON.parse(generateKKQRCode(kk))).sort()).toEqual(['cardNumber', 'franchise', 'insurer', 'model', 'type']);
    expect(JSON.parse(generateKKQRCode(kk, { mitAhv: true })).ahv).toBe(AHV);
  });

  it('das Lesen bleibt: ein älterer Code mit AHV wird weiter übernommen', () => {
    expect(parseKKQRCode(generateKKQRCode(kk, { mitAhv: true })).ahv).toBe(AHV);
    expect(parseKKQRCode(generateKKQRCode(kk)).insurer).toBe('ÖKK');
  });
});

describe('K123 · Texte zum Schalter', () => {
  it('stehen in allen fünf Sprachen', () => {
    for (const [l, d] of [['de', de], ['fr', fr], ['it', itTexte], ['en', en], ['rm', rm]]) {
      expect(typeof d.kkScanner.ahvImQr, l).toBe('string');
      expect(typeof d.kkScanner.ahvImQrHinweis, l).toBe('string');
    }
  });

  it('der Hinweis nennt den Standard und dass ein Scan die Nummer zeigt', () => {
    expect(de.kkScanner.ahvImQrHinweis).toMatch(/Standard aus/);
    expect(de.kkScanner.ahvImQrHinweis).toMatch(/scannt/);
  });
});
