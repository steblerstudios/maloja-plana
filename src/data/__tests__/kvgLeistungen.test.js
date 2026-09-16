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

// K22: TARDOC-Taxpunktwerte 2026 der übrigen Kantone, abgerufen 16.09.2026.
// Behördliche Quelle:
//   SG 0.86 — Kanton St. Gallen, «OKP-Tarife Ambulant ärztliche Leistungen 2019-2028»,
//             Stand 1.9.2026, Zeile «Freipraktizierende Ärztinnen und Ärzte», Spalte 2026
//             https://www.sg.ch/gesundheit-soziales/gesundheit/gesundheitsversorgung--spitaeler/tarife/_jcr_content/Par/sgch_accordion_list/AccordionListPar/sgch_accordion/AccordionPar/sgch_downloadlist/DownloadListPar/sgch_download_288047036.ocFile/Homepage%20OKP-Tariflisten%20ambulant%20aerztliche%20Leistungen%202019-2028%20(1).pdf
//   UR 0.88 — Kanton Uri, Medienmitteilung des Regierungsrats vom 23.12.2025
//             https://www.ur.ch/mmregierungsrat/132029
//   ZG 0.82 — Gesundheitsdirektion Kanton Zug, «Ambulante Tarife 2026», Stand 13.1.2026,
//             Ziff. 2 «Freie Praxis» (AGZG), prov. 0.82 für tarifsuisse, HSK und CSS
//             https://cdn.zg.ch/dam/jcr:faa702d4-e5ed-41ab-a2c2-343c249c3798/Ambulante%20Tarife%202026%20(Stand%2013.%20Januar%202026).pdf
// Quelle: Tarifpartner, keine behördliche Festsetzung — VZAG / Ärztegesellschaft des
// Kantons Luzern, «Update Taxpunktwert Kanton Luzern» (LU 0.85 · SZ 0.85 · OW 0.86 · NW 0.88):
//   https://aerzte-zs.ch/luzern/news-events/news/596-update-taxpunktwert-luzern.html
describe('TAXPUNKTWERT — TARDOC 2026, K22-Runde', () => {
  const behoerdlich = { SG: 0.86, UR: 0.88, ZG: 0.82 };
  for (const [kanton, wert] of Object.entries(behoerdlich)) {
    it(`${kanton} ${wert} (behördliche Quelle 2026)`, () => {
      expect(TAXPUNKTWERT[kanton]).toBe(wert);
    });
  }

  const tarifpartner = { LU: 0.85, SZ: 0.85, OW: 0.86, NW: 0.88 };
  for (const [kanton, wert] of Object.entries(tarifpartner)) {
    it(`${kanton} ${wert} (Tarifpartner-Publikation, provisorischer Arbeitstarif)`, () => {
      expect(TAXPUNKTWERT[kanton]).toBe(wert);
    });
  }

  it('ungeprüfte Kantone behalten den Stand 2025 (TARMED)', () => {
    const ungeprueft = {
      AG: 0.89, AI: 0.89, AR: 0.89, BL: 0.89, FR: 0.88, GE: 0.96, GL: 0.87,
      GR: 0.89, JU: 0.88, NE: 0.92, SH: 0.87, SO: 0.89, TG: 0.86, TI: 0.90,
      VD: 0.93, VS: 0.86,
    };
    for (const [kanton, wert] of Object.entries(ungeprueft)) {
      expect(TAXPUNKTWERT[kanton]).toBe(wert);
    }
  });

  it('alle 26 Kantone sind erfasst', () => {
    expect(Object.keys(TAXPUNKTWERT)).toHaveLength(26);
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
