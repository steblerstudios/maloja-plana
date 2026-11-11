import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Lebenssituationen, { LebenslagenAuswahl } from '../Lebenssituationen.jsx';
import { Schnellcheck } from '../Schnellcheck.jsx';
import { ladeIPVModelle } from '../config/cantonalData.js';
import { wegeAusProbe } from '../data/anspruchWege.js';
import { ohneSchweizerPass, hatAusweisFNS } from '../data/ausweis.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

// ─────────────────────────────────────────────────────────────
// Gruppe A «Einstieg & Orientierung» (Befund 11.11.2026, docs/design/gruppe-a-einstieg.html).
// L1: Sozialhilfe ohne Schweizer Pass kann Folgen für die Bewilligung haben (AIG Art. 62 Abs. 1
//     Bst. e, Art. 63 Abs. 1 Bst. c, Fassung 1.11.2026). Jede Sozialhilfe-Karte und jeder
//     Sozialhilfe-Weg sagt das — ausser bei «Schweizer/in».
// L2: IPV ruht für F/N/S, solange Sozialhilfe bezogen wird (AsylG Art. 82a Abs. 7).
// L7: Schritt 3 des geführten Checks trägt den Hinweis «Orientierung, die Stelle entscheidet».
// ─────────────────────────────────────────────────────────────

const t = createT({ de }, 'de', 'sie');
const satz = de.wasStehtMirZu.sozBewilligung.sie;
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

// Wenig Einkommen, Miete: ein Sozialhilfe-Weg mit Betrag.
const knapp = (workPermit) => ({
  ...DEMO_DATA,
  finanzen: { ...DEMO_DATA.finanzen, monthlyIncome: 1200, incomeType: 'netto', savingsAccount: '0' },
  wohnen: { ...DEMO_DATA.wohnen, rentAmount: 1400 },
  ausbildung: { ...DEMO_DATA.ausbildung, workPermit },
});

const zeichne = (data) => renderToStaticMarkup(React.createElement(Lebenssituationen, { palette: LIGHT_PALETTE, t, data, onNavigate: () => {} }));

describe('Hilfsfunktion: wer den Hinweis bekommt', () => {
  it('nur «swiss» schliesst ihn aus; B, C, L, F, ohne Angabe nicht', () => {
    expect(ohneSchweizerPass({ ausbildung: { workPermit: 'swiss' } })).toBe(false);
    for (const p of ['b', 'c', 'l', 'g', 'f', 'n', 's', '', undefined]) expect(ohneSchweizerPass({ ausbildung: { workPermit: p } })).toBe(true);
    expect(ohneSchweizerPass(undefined)).toBe(true);
  });
  it('der Satz ist derselbe wie auf der Sozialhilfe-Seite (Kapitel 3)', () => {
    expect(de.sozialhilfe.intro.sie).toContain(satz);
  });
});

describe('L1: Sozialhilfe-Weg mit Hinweis auf die Bewilligung', () => {
  beforeAll(async () => { await ladeIPVModelle(); });

  it('Annahme des Tests: der Fall ergibt einen Sozialhilfe-Weg', () => {
    expect(wegeAusProbe(knapp('b')).wege.some((w) => w.key === 'soz')).toBe(true);
  });
  it('Ausweis B: «Was steht mir zu?» sagt den Satz unter dem Ergebnis', () => {
    expect(zeichne(knapp('b'))).toContain('data-hinweis="soz-bewilligung"');
  });
  it('Schweizer/in: kein Satz', () => {
    expect(zeichne(knapp('swiss'))).not.toContain('data-hinweis="soz-bewilligung"');
  });
  it('Schnellcheck: die Sozialhilfe-Zeile trägt den Satz bei Ausweis B, nicht bei Schweizer/in', () => {
    const z = (d) => renderToStaticMarkup(React.createElement(Schnellcheck, { palette: LIGHT_PALETTE, t, data: d, onNavigate: () => {} }));
    expect(z(knapp('b'))).toContain(satz);
    expect(z(knapp('swiss'))).not.toContain(satz);
  });
  it('Schritt 3 und die Leistungsliste der Übersicht hängen den Satz an den Sozialhilfe-Weg', () => {
    expect(quelle('AnspruchCheck.jsx')).toMatch(/b\.key === 'soz'\) && ohneSchweizerPass\(probe\) && hinweis\('soz-bewilligung'/);
    expect(quelle('components/Leistungsliste.jsx')).toMatch(/ohneSchweizerPass\(probe\) \? ' ' \+ t\('wasStehtMirZu\.sozBewilligung'\)/);
  });
});

describe('L1: die Sozialhilfe-Karten der Lebenslagen', () => {
  let alt;
  afterEach(() => { globalThis.localStorage = alt; });
  const karten = (data) => {
    alt = globalThis.localStorage;
    globalThis.localStorage = { getItem: () => JSON.stringify(['tiefesEinkommen']), setItem: () => {} };
    return renderToStaticMarkup(React.createElement(LebenslagenAuswahl, { palette: LIGHT_PALETTE, t, data, onNavigate: () => {} }));
  };
  it('«Wenn das Geld knapp ist» mit Ausweis C: die Karte Sozialhilfe sagt den Satz', () => {
    const html = karten(knapp('c'));
    expect(html).toContain(de.lebenszustaende.tiefesEinkommen.berechtigungen.sozialhilfe.titel);
    expect(html).toContain('data-hinweis="soz-bewilligung"');
  });
  it('Schweizer/in: dieselbe Karte ohne den Satz', () => {
    expect(karten(knapp('swiss'))).not.toContain('data-hinweis="soz-bewilligung"');
  });
});

describe('L2: IPV ruht für F, N, S', () => {
  beforeAll(async () => { await ladeIPVModelle(); });
  const fns = (p) => ({ ...knapp(p), finanzen: { ...knapp(p).finanzen, monthlyIncome: 2800 } });
  it('Ausweis F: «Was steht mir zu?» sagt «ruht» beim IPV-Teil', () => {
    expect(hatAusweisFNS(fns('f'))).toBe(true);
    expect(zeichne(fns('f'))).toContain('data-hinweis="ipv-ruht"');
  });
  it('Ausweis B: kein «ruht»', () => {
    expect(zeichne(fns('b'))).not.toContain('data-hinweis="ipv-ruht"');
  });
  it('Schritt 3 sagt es ebenso', () => {
    expect(quelle('AnspruchCheck.jsx')).toMatch(/b\.key === 'ipv'\) && hatAusweisFNS\(probe\) && hinweis\('ipv-ruht'/);
  });
});

describe('L7: Schritt 3 mit Hinweis', () => {
  it('der Überblick endet mit anspruch.footNote', () => {
    expect(quelle('AnspruchCheck.jsx')).toMatch(/hinweis\('fuss', t\('anspruch\.footNote'\)\)/);
  });
});
