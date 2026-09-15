import { describe, it, expect } from 'vitest';
import { TAXPUNKTWERT, berechneArztrechnung } from '../kvgLeistungen.js';
import de from '../../i18n/de.js';
import en from '../../i18n/en.js';
import fr from '../../i18n/fr.js';
import it_ from '../../i18n/it.js';
import rm from '../../i18n/rm.js';

// K14: TARDOC-Taxpunktwerte 2026, amtlich geprüft (abgerufen 15.09.2026):
//   ZH 0.91 — RRB ZH Nr. 1299/2025, Dispositiv I.1
//             https://www.zh.ch/bin/zhweb/publish/regierungsratsbeschluss-unterlagen./2025/1299/RRB-2025-1299.pdf
//   BE 0.86 — GSI BE, Verfügung 2025.GSI.2252 vom 22.01.2026
//             https://www.gsi.be.ch/content/dam/gsi/dokumente-bilder/de/themen/gesundheit/gesundheitsversorger/verfuegung-prov-tpw-tardoc-2026-de.pdf
//   BS 0.91 — Regierungsrat BS, Bulletin 10.02.2026
//             https://www.bs.ch/medienmitteilungen/2026-kurzmitteilungen-aus-der-regierungsrats-sitzung-bulletin-2
describe('TAXPUNKTWERT — TARDOC 2026, amtlich belegte Kantone', () => {
  it('ZH 0.91 (provisorisch ab 1.1.2026, freipraktizierende Ärzte)', () => {
    expect(TAXPUNKTWERT.ZH).toBe(0.91);
  });
  it('BE 0.86 (provisorisch ab 1.1.2026, BEKAG)', () => {
    expect(TAXPUNKTWERT.BE).toBe(0.86);
  });
  it('BS 0.91 (provisorischer Tarif = bisheriger TARMED-Wert)', () => {
    expect(TAXPUNKTWERT.BS).toBe(0.91);
  });
  it('Arztrechnung rechnet mit dem kantonalen Wert', () => {
    expect(berechneArztrechnung(100, 'ZH').betrag).toBe(91);
    expect(berechneArztrechnung(100, 'BE').betrag).toBe(86);
  });
});

// K14: KLV Art. 38a Abs. 1+2 (Fassung seit 1.1.2024; Fedlex Fassung 1.8.2026, abgerufen
// 15.09.2026): 40 % Selbstbehalt für zu teure Arzneimittel, auch Generika — nicht mehr 20 %.
// https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1995/4964_4964_4964/20260801/de/html/fedlex-data-admin-ch-eli-cc-1995-4964_4964_4964-20260801-de-html.html
describe('kvg.generikaNote — Selbstbehalt nach KLV Art. 38a', () => {
  const sprachen = { de, en, fr, it: it_, rm };
  for (const [code, dict] of Object.entries(sprachen)) {
    it(`${code}: nennt 10 % und 40 %, nicht mehr 20 %`, () => {
      const note = dict.kvg.generikaNote;
      expect(note).toContain('10%');
      expect(note).toContain('40%');
      expect(note).not.toContain('20%');
    });
  }
});
