// Organspende — Nachtrag zu den offenen Punkten der Fachprüfung 27.09.2026:
//   11. «Vertrauensperson» ohne Namen hilft im Notfall niemandem → Name (und Telefon) dazu.
//   12. «Nur bestimmte» ohne angekreuztes Organ → ruhiger Hinweis auf der Seite.
//   13. Das alte Wort «Widersprochen» (mirror.notfall.statusDeclined) war tot → entfernt.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { getNotfallDossierPreview, notfallQrAbschnitte, NOTFALL_QR_FELDER } from '../dossierGenerator.js';
import { prepareDownloadFiles } from '../zipExport.js';
import { getChapters } from '../config/constants.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..');
const quelle = readFileSync(join(SRC, 'OrganDonation.jsx'), 'utf-8');
const SPRACHEN = { de, fr, it: it_, en, rm };
const t = (k, p) => {
  const v = k.split('.').reduce((o, s) => o?.[s], de);
  if (v === undefined) return k;
  const s = typeof v === 'object' && v && v.sie ? v.sie : v;
  return typeof s === 'string' && p ? s.replace(/\{(\w+)\}/g, (_, n) => p[n] ?? '') : s;
};

// QRCode.js hängt sich beim Import an `window` — gleiches Muster wie organSpendeQr.test.js.
let organSpendeVcard;
const gesetzt = [];
beforeAll(async () => {
  if (!('window' in globalThis)) { globalThis.window = globalThis; gesetzt.push('window'); }
  if (!('document' in globalThis)) {
    globalThis.document = { documentElement: { tagName: 'div' }, getElementById: () => null, createElement: () => ({ style: {}, getContext: () => null, appendChild() {}, setAttribute() {} }) };
    gesetzt.push('document');
  }
  ({ organSpendeVcard } = await import('../OrganDonation.jsx'));
});
afterAll(() => { for (const k of gesetzt) delete globalThis[k]; });

const notizVon = (v) => String(v).replace(/\r\n /g, '').split('\r\n').find(z => z.startsWith('NOTE:')).slice(5).replace(/\\n/g, '\n').replace(/\\([\\;,])/g, '$1');
const zeilen = (daten) => getNotfallDossierPreview(daten, getChapters(t), t).sections.flatMap(s => s.rows);
const dossierText = (daten) => zeilen(daten).map(r => r.label + ': ' + r.value).join('\n');

describe('11 — Name der Vertrauensperson', () => {
  const daten = { notfall: { organDonor: 'delegated', organVertrauensperson: 'Alex Beispiel, 079 000 00 00' } };

  it('steht im QR, im Dossier und im Export', () => {
    expect(notizVon(organSpendeVcard({ t, data: daten, status: 'delegated', organs: {} }))).toContain('Alex Beispiel');
    expect(zeilen(daten).find(r => r.feld === 'notfall.organVertrauensperson').value).toBe('Alex Beispiel, 079 000 00 00');
    expect(prepareDownloadFiles(daten, [], t).manifest.content).toContain('Alex Beispiel');
  });

  it('erscheint nicht, wenn ein anderer Entscheid gilt', () => {
    const anders = { notfall: { organDonor: 'declined', organVertrauensperson: 'Alex Beispiel' } };
    expect(notizVon(organSpendeVcard({ t, data: anders, status: 'declined', organs: {} }))).not.toContain('Alex Beispiel');
    expect(dossierText(anders)).not.toContain('Alex Beispiel');
    expect(prepareDownloadFiles(anders, [], t).manifest.content).not.toContain('Alex Beispiel');
  });

  it('steht NICHT im allgemeinen Notfall-QR (K123-Erlaubnisliste, bewusst)', () => {
    expect(NOTFALL_QR_FELDER).not.toContain('notfall.organVertrauensperson');
    const vorschau = getNotfallDossierPreview(daten, getChapters(t), t);
    expect(JSON.stringify(notfallQrAbschnitte(vorschau.sections))).not.toContain('Alex Beispiel');
  });

  it('im QR mit kurzem Etikett, ohne «(Name und Telefon)»', () => {
    const notiz = notizVon(organSpendeVcard({ t, data: daten, status: 'delegated', organs: {} }));
    expect(notiz).toContain('Vertrauensperson: Alex Beispiel');
    expect(notiz).not.toContain('(Name');
  });

  it('die Seite speichert den Namen nur zusammen mit «Vertrauensperson»', () => {
    expect(quelle).toContain("if (status === 'delegated' && name) notfall.organVertrauensperson = name; else delete notfall.organVertrauensperson;");
  });

  for (const [lang, texte] of Object.entries(SPRACHEN)) {
    it(`${lang}: Etiketten und Hinweis vorhanden`, () => {
      expect(texte.organ.vertrauensperson).toBeTruthy();
      expect(texte.organ.vertrauenspersonKurz).toBeTruthy();
      expect(texte.organ.vertrauenspersonHinweis).toBeTruthy();
    });
  }
});

describe('12 — Hinweis bei «nur bestimmte» ohne Organ', () => {
  it('die Seite zeigt ihn genau dann', () => {
    expect(quelle).toContain("status === 'partial' && organListe(t, organs).length === 0 &&");
  });

  for (const [lang, texte] of Object.entries(SPRACHEN)) {
    it(`${lang}: Text vorhanden`, () => expect(texte.organ.keineOrganeGewaehlt).toBeTruthy());
  }
});

describe('13 — «Widersprochen» ist weg', () => {
  for (const [lang, texte] of Object.entries(SPRACHEN)) {
    it(`${lang}: mirror.notfall.statusDeclined gibt es nicht mehr`, () => {
      expect(texte.mirror?.notfall?.statusDeclined).toBeUndefined();
    });
  }

  it('de: kein «Widersprochen» mehr in den Texten', () => {
    expect(readFileSync(join(SRC, 'i18n/de.js'), 'utf-8')).not.toContain("'Widersprochen'");
  });
});
