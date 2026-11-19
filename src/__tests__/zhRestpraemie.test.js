import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { createT } from '../i18n/index.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { ladeIPVModelle } from '../config/cantonalData.js';
import { zerlegeBelege } from '../components/Belege.jsx';
import { ZhRestpraemie } from '../components/Nichtbezug.jsx';
import Lebenssituationen from '../Lebenssituationen.jsx';
import { SozialhilfeView } from '../SozialhilfeView.jsx';

// Restprämienübernahme Kanton Zürich (Stebler Studios 18.11.2026): nur die Krankenkassenprämie übernehmen lassen,
// ohne Sozialhilfe (§ 15 Abs. 1 EG KVG). Merkblatt Kantonales Sozialamt, 28.4.2023: «Restprämienübernahme ist keine
// Sozialhilfe», keine Meldung ans Migrationsamt, kein Einfluss auf den ausländerrechtlichen Status. Gilt nur in ZH.
const SPRACHEN = { de, fr, it: it_, en, rm };
const MERKBLATT = 'kapitel-11-1-11/merkblatt_restpraemienuebernahme_fuer_klienten.pdf';
const HANDBUCH = '11-1-11-krankenversicherung-auswirkungen-auf-die-sozialbehoerden';
const blaetter = (w) => (typeof w === 'string' ? [w] : [w.sie, w.du]);

describe('Restprämienübernahme ZH: Texte belegt', () => {
  for (const [lang, d] of Object.entries(SPRACHEN)) {
    it(`${lang}: Text in allen Formen, Quellenzeile mit Merkblatt und Handbuch`, () => {
      for (const s of blaetter(d.nichtbezug.zhRestpraemie)) {
        expect(typeof s).toBe('string');
        expect(s).toMatch(/Zürich|Zurich|Zurigo/);
      }
      const b = zerlegeBelege(d.nichtbezug.zhRestpraemieQuelle);
      expect(b, 'Quellenzeile in Belege-Form').not.toBeNull();
      const ziele = b.links.map((l) => l.href).join(' ');
      expect(ziele).toContain(MERKBLATT);
      expect(ziele).toContain(HANDBUCH);
      // Rückwirkung (19.11.2026): § 50 VEG KVG, «bis zu zwei Jahren», mit Beleg.
      expect(ziele).toContain('Ordnr=832.1');
      for (const s of blaetter(d.nichtbezug.zhRestpraemieRueckwirkend)) {
        expect(typeof s).toBe('string');
        expect(s).toMatch(/2|zwei|two|deux|due/);
      }
      // Fachprüfung 19.11.2026: Rückforderung nach SHG §§ 26–30 belegt, alle Teile in jeder Sprache.
      expect(ziele).toContain('Ordnr=851.1');
      for (const k of ['zhRestpraemieMehr', 'zhRestpraemieVoraussetzungen', 'zhRestpraemieAntrag', 'zhRestpraemieRueckforderung', 'zhRestpraemieF']) {
        for (const s of blaetter(d.nichtbezug[k])) expect(typeof s, `${lang} ${k}`).toBe('string');
      }
    });
  }
});

describe('Restprämienübernahme ZH: nur im Kanton Zürich', () => {
  const t = createT({ de }, 'de', 'sie');
  beforeAll(async () => { await ladeIPVModelle(); });
  const knapp = (canton) => ({
    ...DEMO_DATA,
    basis: { ...DEMO_DATA.basis, canton },
    finanzen: { ...DEMO_DATA.finanzen, monthlyIncome: 1200, incomeType: 'netto', savingsAccount: '0' },
    wohnen: { ...DEMO_DATA.wohnen, rentAmount: 1400 },
  });

  it('der Baustein zeigt sich nur bei ZH', () => {
    const zh = renderToStaticMarkup(React.createElement(ZhRestpraemie, { palette: LIGHT_PALETTE, t, canton: 'ZH' }));
    expect(zh).toContain(de.nichtbezug.zhRestpraemie.sie.slice(0, 40));
    expect(zh).toContain('data-teil="zh-rueckwirkend"');
    expect(zh).toContain('data-teil="zh-mehr"');
    // Kassenwechsel ist keine Pflicht (Merkblatt: «keine Auflagen»; GD 2021: Teilübernahme bei Verzicht).
    expect(Object.values(de.nichtbezug.zhRestpraemieAntrag).join(' ')).not.toMatch(/kann verlangen/);
    for (const k of ['BE', 'BS', '', undefined]) expect(renderToStaticMarkup(React.createElement(ZhRestpraemie, { palette: LIGHT_PALETTE, t, canton: k }))).toBe('');
  });

  it('«Was steht mir zu?»: mit Sozialhilfe-Weg in ZH der Hinweis, in BE nicht', () => {
    const zh = renderToStaticMarkup(React.createElement(Lebenssituationen, { palette: LIGHT_PALETTE, t, data: knapp('ZH'), onNavigate: () => {} }));
    expect(zh).toContain('data-hinweis="zh-restpraemie"');
    const be = renderToStaticMarkup(React.createElement(Lebenssituationen, { palette: LIGHT_PALETTE, t, data: knapp('BE'), onNavigate: () => {} }));
    expect(be).not.toContain('data-hinweis="zh-restpraemie"');
  });

  it('«Was steht mir zu?»: ohne Sozialhilfe-Weg kein Hinweis, auch in ZH', () => {
    const html = renderToStaticMarkup(React.createElement(Lebenssituationen, { palette: LIGHT_PALETTE, t, data: DEMO_DATA, onNavigate: () => {} }));
    expect(html).not.toContain('data-hinweis="zh-restpraemie"');
  });

  it('Sozialhilfe-Seite: in ZH der Hinweis', () => {
    const html = renderToStaticMarkup(React.createElement(SozialhilfeView, { palette: LIGHT_PALETTE, t, data: knapp('ZH'), onNavigate: () => {} }));
    expect(html).toContain('data-hinweis="zh-restpraemie"');
  });
});

describe('Restprämienübernahme ZH: Asylbereich nach § 52 VEG KVG', () => {
  const t = createT({ de }, 'de', 'sie');
  for (const p of ['n', 's']) {
    it(`Ausweis ${p.toUpperCase()}: kein Hinweis (Asylfürsorge, kein Weg nach § 15 EG KVG)`, () => {
      expect(renderToStaticMarkup(React.createElement(ZhRestpraemie, { palette: LIGHT_PALETTE, t, canton: 'ZH', data: { ausbildung: { workPermit: p } } }))).toBe('');
    });
  }
  it('Ausweis F: eigener Satz zu § 52 Abs. 3 und 4, nicht der allgemeine Hinweis', () => {
    const html = renderToStaticMarkup(React.createElement(ZhRestpraemie, { palette: LIGHT_PALETTE, t, canton: 'ZH', data: { ausbildung: { workPermit: 'f' } } }));
    expect(html).toContain('data-hinweis="zh-restpraemie-f"');
    expect(html).toContain('§ 52 VEG KVG');
    expect(html).not.toContain('data-hinweis="zh-restpraemie"');
  });
  it('Ausweis B: Hinweis', () => {
    expect(renderToStaticMarkup(React.createElement(ZhRestpraemie, { palette: LIGHT_PALETTE, t, canton: 'ZH', data: { ausbildung: { workPermit: 'b' } } }))).toContain('data-hinweis="zh-restpraemie"');
  });
});
