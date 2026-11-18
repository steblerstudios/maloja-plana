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
import Lebenssituationen from '../Lebenssituationen.jsx';
import { SozialhilfeView } from '../SozialhilfeView.jsx';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// Nichtbezug von Bedarfsleistungen (Stebler Studios 18.11.2026, «Brücken 1–3»), nach den BFH-Studien
// für Basel-Stadt (Medienmitteilung 12.2.2026) und der Orientierungshilfe in «Soziale Sicherheit CHSS»
// (11.9.2026). Wie beim EL-Hinweis (elNichtbezugBelegt.test.js): keine Quote im Text, denn die
// belegten Quoten gelten nur für Basel-Stadt; jede Aussage trägt ihre Quelle.
const SPRACHEN = { de, fr, it: it_, en, rm };
const BS26 = 'bs.ch/medienmitteilungen/wsu/2026-neue-studie-zum-nichtbezug';
const CHSS = 'sozialesicherheit.ch/de/bedarfsleistungen-wie-laesst-sich-der-nichtbezug-verringern';
const QUOTE = /\d+\s*(%|Prozent|pour cent|per cento|percent)/;
const blaetter = (w) => (typeof w === 'string' ? [w] : [w.sie, w.du]);

describe('Nichtbezug: Texte in allen Sprachen, belegt, ohne Quote', () => {
  for (const [lang, d] of Object.entries(SPRACHEN)) {
    it(`${lang}: drei Hinweise, keine Quote, Quellenzeile mit beiden Belegen`, () => {
      const n = d.nichtbezug;
      for (const k of ['kleineBetraege', 'ipv', 'sozialhilfe']) {
        for (const s of blaetter(n[k])) {
          expect(typeof s).toBe('string');
          expect(s).not.toMatch(QUOTE);
        }
      }
      const b = zerlegeBelege(n.quelle);
      expect(b, 'Quellenzeile muss in der Belege-Form stehen').not.toBeNull();
      expect(b.links.map((l) => l.href).join(' ')).toContain(BS26);
      expect(b.links.map((l) => l.href).join(' ')).toContain(CHSS);
    });
    it(`${lang}: EL-Hinweis nennt die Studie 2026, die EL-Quelle verlinkt sie`, () => {
      expect(d.ergaenzungsleistungen.step1Nichtbezug).toContain('2026');
      expect(d.ergaenzungsleistungen.step1Nichtbezug).not.toMatch(QUOTE);
      expect(d.ergaenzungsleistungen.quelle).toContain(BS26);
    });
  }
});

describe('Nichtbezug: die Hinweise stehen auf den Seiten', () => {
  const t = createT({ de }, 'de', 'sie');
  beforeAll(async () => { await ladeIPVModelle(); });

  // Wenig Einkommen, Miete: es zeigen sich Wege.
  const knapp = {
    ...DEMO_DATA,
    finanzen: { ...DEMO_DATA.finanzen, monthlyIncome: 1200, incomeType: 'netto', savingsAccount: '0' },
    wohnen: { ...DEMO_DATA.wohnen, rentAmount: 1400 },
    ausbildung: { ...DEMO_DATA.ausbildung, workPermit: 'swiss' },
  };

  it('«Was steht mir zu?»: mit Wegen der Satz zu kleinen Beträgen und seine Quelle', () => {
    const html = renderToStaticMarkup(React.createElement(Lebenssituationen, { palette: LIGHT_PALETTE, t, data: knapp, onNavigate: () => {} }));
    expect(html).toContain('data-hinweis="nichtbezug"');
    expect(html).toContain(de.nichtbezug.kleineBetraege.slice(0, 40));
  });

  it('«Was steht mir zu?»: ohne Angaben kein Satz', () => {
    const html = renderToStaticMarkup(React.createElement(Lebenssituationen, { palette: LIGHT_PALETTE, t, data: {}, onNavigate: () => {} }));
    expect(html).not.toContain('data-hinweis="nichtbezug"');
  });

  it('Sozialhilfe: der Hinweis steht mit Kanton', () => {
    const html = renderToStaticMarkup(React.createElement(SozialhilfeView, { palette: LIGHT_PALETTE, t, data: knapp, onNavigate: () => {} }));
    expect(html).toContain(de.nichtbezug.sozialhilfe.slice(0, 40));
  });

  it('IPV: der Hinweis steht nur, wo ein Anspruch möglich ist', () => {
    const mit = renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette: LIGHT_PALETTE, t, data: knapp, onUpdateData: () => {} }));
    const ohne = renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette: LIGHT_PALETTE, t, data: { ...knapp, finanzen: { ...knapp.finanzen, monthlyIncome: 25000 } }, onUpdateData: () => {} }));
    expect(mit).toContain(de.nichtbezug.ipv.sie.slice(0, 40));
    expect(ohne).not.toContain('data-hinweis="nichtbezug"');
  });
});
