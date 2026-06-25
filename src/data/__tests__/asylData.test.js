import { describe, it, expect } from 'vitest';
import { ASYL_STATUS, ASYL_ORGS, ASYL_PROCESS, ASYL_RIGHTS, ASYL_DATA_VERSION } from '../asylData.js';
import en from '../../i18n/en.js';
import itLang from '../../i18n/it.js';
import rm from '../../i18n/rm.js';

// Wert kann String ODER Anrede-Objekt { sie, du } sein → beides gilt als vorhanden.
const present = (v) => typeof v === 'string' ? v.length > 0 : (v && typeof v === 'object' && (present(v.sie) || present(v.du)));

describe('asylData Struktur', () => {
  it('jeder Status hat key + ausweis-Buchstabe', () => {
    expect(ASYL_STATUS.length).toBeGreaterThan(0);
    for (const s of ASYL_STATUS) {
      expect(s.key).toBeTruthy();
      expect(s.ausweis).toMatch(/^[A-Z]$/);
    }
  });

  it('jede Beratungsstelle hat id, Name und https-URL', () => {
    expect(ASYL_ORGS.length).toBeGreaterThan(0);
    for (const o of ASYL_ORGS) {
      expect(o.id).toBeTruthy();
      expect(o.name).toBeTruthy();
      expect(o.url).toMatch(/^https:\/\//);
    }
  });

  it('Verfahrensschritte und Rechte sind nicht leer', () => {
    expect(ASYL_PROCESS.length).toBeGreaterThan(0);
    expect(ASYL_RIGHTS.length).toBeGreaterThan(0);
  });

  it('hat eine Daten-Version', () => {
    expect(ASYL_DATA_VERSION).toBeTruthy();
  });
});

// i18n-Vollständigkeit: jeder von der View referenzierte asyl-Key muss in den
// Sprachen existieren, die diese Session pflegt (en/it/rm). de + fr werden von
// der Anrede-Session ergänzt und hier bewusst nicht geprüft.
describe.each([['en', en], ['it', itLang], ['rm', rm]])('asyl i18n vollständig (%s)', (lang, dict) => {
  const a = dict.asyl;

  it('asyl-Namespace existiert', () => {
    expect(a).toBeTruthy();
  });

  it('Basis- und Sektions-Keys vorhanden', () => {
    for (const k of ['title', 'intro', 'disclaimer', 'statusTitle', 'processTitle', 'rightsTitle', 'fristenTitle', 'fristenBody', 'orgsTitle', 'official', 'phone', 'cantonLink']) {
      expect(present(a[k]), `${lang}: asyl.${k}`).toBe(true);
    }
  });

  it('je Status label + desc', () => {
    for (const s of ASYL_STATUS) {
      expect(present(a.status[s.key]?.label), `${lang}: asyl.status.${s.key}.label`).toBe(true);
      expect(present(a.status[s.key]?.desc), `${lang}: asyl.status.${s.key}.desc`).toBe(true);
    }
  });

  it('je Verfahrensschritt ein Text', () => {
    for (const p of ASYL_PROCESS) {
      expect(present(a.process[p]), `${lang}: asyl.process.${p}`).toBe(true);
    }
  });

  it('je Recht ein Text', () => {
    for (const r of ASYL_RIGHTS) {
      expect(present(a.rights[r]), `${lang}: asyl.rights.${r}`).toBe(true);
    }
  });

  it('je Beratungsstelle eine Beschreibung', () => {
    for (const o of ASYL_ORGS) {
      expect(present(a.org[o.id]), `${lang}: asyl.org.${o.id}`).toBe(true);
    }
  });

  it('nav.asyl + nav.sub.asyl vorhanden', () => {
    expect(present(dict.nav.asyl), `${lang}: nav.asyl`).toBe(true);
    expect(present(dict.nav.sub.asyl), `${lang}: nav.sub.asyl`).toBe(true);
  });
});
