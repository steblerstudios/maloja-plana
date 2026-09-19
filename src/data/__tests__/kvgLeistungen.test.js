import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { TAXPUNKTWERT, berechneArztrechnung, TAXPUNKTWERT_DATA_VERSION, TAXPUNKTWERT_UNBELEGT_2026, KVG_DATA_VERSION } from '../kvgLeistungen.js';
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
//   LU 0.85 — RRB Kanton Luzern Nr. 1487/2025 vom 16.12.2025, Ziff. 1, wörtlich wiedergegeben
//             im Urteil BVGer C-437/2026 vom 12.03.2026 (Nichteintreten, RRB bleibt in Kraft)
//             https://entscheidsuche.ch/docs/CH_BVGer/CH_BVGE_001_C-437-2026_2026-03-12.pdf
//   SG 0.86 — Kanton St. Gallen, «OKP-Tarife Ambulant ärztliche Leistungen 2019-2028»,
//             Stand 1.9.2026, Zeile «Freipraktizierende Ärztinnen und Ärzte», Spalte 2026
//             https://www.sg.ch/gesundheit-soziales/gesundheit/gesundheitsversorgung--spitaeler/tarife/_jcr_content/Par/sgch_accordion_list/AccordionListPar/sgch_accordion/AccordionPar/sgch_downloadlist/DownloadListPar/sgch_download_288047036.ocFile/Homepage%20OKP-Tariflisten%20ambulant%20aerztliche%20Leistungen%202019-2028%20(1).pdf
//   UR 0.88 — Kanton Uri, Medienmitteilung des Regierungsrats vom 23.12.2025
//             https://www.ur.ch/mmregierungsrat/132029
//   ZG 0.82 — Gesundheitsdirektion Kanton Zug, «Ambulante Tarife 2026», Stand 13.1.2026,
//             Ziff. 2 «Freie Praxis» (AGZG), prov. 0.82 für tarifsuisse, HSK und CSS
//             https://cdn.zg.ch/dam/jcr:faa702d4-e5ed-41ab-a2c2-343c249c3798/Ambulante%20Tarife%202026%20(Stand%2013.%20Januar%202026).pdf
// Quelle: Tarifpartner, keine behördliche Festsetzung — VZAG / Ärztegesellschaft des
// Kantons Luzern, «Update Taxpunktwert Kanton Luzern» (SZ 0.85 für tarifsuisse, CSS und HSK
// 0.86 · OW 0.86 · NW 0.88):
//   https://aerzte-zs.ch/luzern/news-events/news/596-update-taxpunktwert-luzern.html
// Weitere behördliche Quellen der K22-Runde:
//   AR 0.86 — Beschluss des Regierungsrates AR vom 12.01.2026, Ziff. 5 (freiberufliche Ärzte)
//             https://amtsblattportal.ch/api/v1/publications/261ae13b-1a69-475a-bac6-f40c18f7e696/attachments/36e30134-6bd5-4601-a192-c0a62e3ec610
//   FR 0.91 — Ordonnance du Conseil d'État FR du 13.01.2026, RSF 842.1.24, Art. 2
//             https://bdlf.fr.ch/app/fr/texts_of_law/842.1.24
//   GE 0.94 — Conseil d'État GE, communiqué du 24.06.2026 (Arrêté, nur für die CSS belegt)
//             https://www.ge.ch/document/communique-hebdomadaire-du-conseil-etat-du-24-juin-2026
//   GR 0.86 — Gesundheitsamt Graubünden, «TARDOC-Taxpunktwerte 2026», Stand 07.09.2026
//   TG 0.86 — Amt für Gesundheit Thurgau, «Tarifübersicht Tarife ambulant», Stand 19.08.2026
//   TI 0.93 — Decreto esecutivo del Consiglio di Stato dell'11.02.2026, Art. 1 (BU 6/2026)
//             https://www3.ti.ch/CAN/fu/2026/BU_006.pdf
//   VD 0.94 — Conseil d'État VD, Sitzung vom 20.05.2026 (santéservices SA ↔ SVM)
//             https://www.vd.ch/actualites/decisions-du-conseil-detat/seance-du-conseil-detat/seance/1032981
describe('TAXPUNKTWERT — TARDOC 2026, K22-Runde', () => {
  const behoerdlich = {
    AR: 0.86, FR: 0.91, GE: 0.94, GR: 0.86, LU: 0.85, SG: 0.86,
    TG: 0.86, TI: 0.93, UR: 0.88, VD: 0.94, ZG: 0.82,
  };
  for (const [kanton, wert] of Object.entries(behoerdlich)) {
    it(`${kanton} ${wert} (behördliche Quelle 2026)`, () => {
      expect(TAXPUNKTWERT[kanton]).toBe(wert);
    });
  }

  const tarifpartner = { SZ: 0.85, OW: 0.86, NW: 0.88 };
  for (const [kanton, wert] of Object.entries(tarifpartner)) {
    it(`${kanton} ${wert} (Tarifpartner-Publikation, provisorischer Arbeitstarif)`, () => {
      expect(TAXPUNKTWERT[kanton]).toBe(wert);
    });
  }

  // Diese neun Kantone bleiben bewusst auf dem Stand 2025 (TARMED): für 2026 wurde weder eine
  // behördliche Festsetzung noch eine Publikation eines Tarifpartners gefunden. Der Test hält
  // fest, dass sie ungeprüft sind — er ist kein Beleg für ihre Richtigkeit.
  it('ungeprüfte Kantone behalten den Stand 2025 (TARMED)', () => {
    const ungeprueft = {
      AG: 0.89, AI: 0.89, BL: 0.89, GL: 0.87, JU: 0.88, NE: 0.92,
      SH: 0.87, SO: 0.89, VS: 0.86,
    };
    for (const [kanton, wert] of Object.entries(ungeprueft)) {
      expect(TAXPUNKTWERT[kanton]).toBe(wert);
    }
  });

  it('17 der 26 Kantone sind für 2026 belegt, 9 bleiben ungeprüft', () => {
    const belegt2026 = [
      'AR', 'BE', 'BS', 'FR', 'GE', 'GR', 'LU', 'NW', 'OW',
      'SG', 'SZ', 'TG', 'TI', 'UR', 'VD', 'ZG', 'ZH',
    ];
    expect(belegt2026).toHaveLength(17);
    expect(Object.keys(TAXPUNKTWERT).filter(k => !belegt2026.includes(k))).toHaveLength(9);
  });

  it('alle 26 Kantone sind erfasst', () => {
    expect(Object.keys(TAXPUNKTWERT)).toHaveLength(26);
  });
});

// K14: KLV Art. 38a Abs. 1+2 (Fassung seit 1.1.2024; Fedlex Fassung 1.8.2026, abgerufen
// 15.09.2026): 40 % Selbstbehalt für zu teure Arzneimittel, auch Generika — nicht mehr 20 %.
// https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1995/4964_4964_4964/20260801/de/html/fedlex-data-admin-ch-eli-cc-1995-4964_4964_4964-20260801-de-html.html
// K27 (Bauliste §10, E29): der Taxpunktwert-Block trägt einen eigenen Datenstand statt
// nur der einen KVG_DATA_VERSION für den ganzen KVG-Datensatz.
describe('TAXPUNKTWERT_DATA_VERSION — eigener Datenstand (K27)', () => {
  it('ist gesetzt und unterscheidet sich von der allgemeinen KVG_DATA_VERSION', () => {
    expect(TAXPUNKTWERT_DATA_VERSION).toBeTruthy();
    expect(TAXPUNKTWERT_DATA_VERSION).not.toBe(KVG_DATA_VERSION);
  });

  it('TAXPUNKTWERT_UNBELEGT_2026 listet genau die neun Kantone ohne Beleg 2026 (K30)', () => {
    expect(TAXPUNKTWERT_UNBELEGT_2026.slice().sort()).toEqual(
      ['AG', 'AI', 'BL', 'GL', 'JU', 'NE', 'SH', 'SO', 'VS']
    );
  });
});

// K26 (Bauliste §10, E28): die Fussnote nennt den provisorischen Charakter und die neun
// Kantone ohne Beleg 2026, in allen 5 Sprachen. Keinen KVG-Artikel nennen: keiner regelt
// das Provisorische (Bauliste §14, K52).
// R4 (16.09.): die Kantonsliste kommt als Platzhalter {kantone} aus
// TAXPUNKTWERT_UNBELEGT_2026 — nicht mehr von Hand in fünf Sprachen.
describe('kvg.tpwNote — provisorisch + neun unbelegte Kantone (K26)', () => {
  const sprachen = { de, en, fr, it: it_, rm };
  for (const [code, dict] of Object.entries(sprachen)) {
    it(`${code}: Kantonsliste als Platzhalter, keine handgeschriebene Liste`, () => {
      const note = dict.kvg.tpwNote;
      expect(note).toContain('{kantone}');
      expect(note).not.toMatch(/\b(AG|BL|SO|AI|GL|SH|JU|NE|VS)\b/);
    });
    it(`${code}: Stand-Text für unbelegte Kantone (provisorisch, nicht amtlich bestätigt)`, () => {
      expect(dict.kvg.tpwStandUnbelegt).toContain('{kanton}');
      expect(dict.kvg.tpwStandUnbelegt).toContain('2025');
    });
    it(`${code}: nennt den Stand 2025 der unbelegten Kantone`, () => {
      expect(dict.kvg.tpwNote).toContain('2025');
    });
    it(`${code}: hat ein eigenes Label für den Taxpunktwert-Datenstand`, () => {
      expect(dict.kvg.tpwDataVersion).toBeTruthy();
    });
  }
});

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

// R4 (16.09.): der Rechnungs-Tab zeigt den Stand je gewähltem Kanton aus der Konstante.
describe('KVGLeistungen: Taxpunktwert-Stand je Kanton (R4)', () => {
  const src = readFileSync(new URL('../../KVGLeistungen.jsx', import.meta.url), 'utf8');
  it('liest TAXPUNKTWERT_UNBELEGT_2026 und füllt {kantone}/{kanton}', () => {
    // Seit Deploy-Gate 0.1.37 in TpwErgebnisHinweise (auch im Franchise-Tab); der Tab «Arztrechnung»
    // reicht den gewählten Kanton durch.
    expect(src).toContain('TAXPUNKTWERT_UNBELEGT_2026.includes(canton)');
    expect(src).toMatch(/t\('kvg\.tpwNote', \{ kantone: TAXPUNKTWERT_UNBELEGT_2026\.join/);
    expect(src).toContain("t('kvg.tpwStandUnbelegt', { kanton: canton })");
    expect(src).toContain('React.createElement(TpwErgebnisHinweise, { palette, t, canton: selCanton, mitDatenstand: true })');
  });
});
