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
  basis: { ...DEMO_DATA.basis, nationality: workPermit === 'swiss' ? 'swiss' : 'other' },
});

const zeichne = (data) => renderToStaticMarkup(React.createElement(Lebenssituationen, { palette: LIGHT_PALETTE, t, data, onNavigate: () => {} }));

describe('Hilfsfunktion: wer den Hinweis bekommt', () => {
  it('nur «swiss» schliesst ihn aus; B, C, L, F, ohne Angabe nicht', () => {
    expect(ohneSchweizerPass({ ausbildung: { workPermit: 'swiss' } })).toBe(false);
    for (const p of ['b', 'c', 'l', 'g', 'f', 'n', 's', '', undefined]) expect(ohneSchweizerPass({ ausbildung: { workPermit: p } })).toBe(true);
    expect(ohneSchweizerPass(undefined)).toBe(true);
  });
  it('welcher Satz: B/C/L/ohne Angabe → Bewilligung, F → eigener Satz, N/S/G → keiner (AIG 62/63 gilt nur für AIG-Bewilligungen)', async () => {
    const { sozHinweisSchluessel } = await import('../data/ausweis.js');
    const mit = (workPermit, nationality) => ({ ausbildung: { workPermit }, basis: { nationality } });
    for (const p of ['b', 'c', 'l', '']) expect(sozHinweisSchluessel(mit(p))).toBe('wasStehtMirZu.sozBewilligung');
    expect(sozHinweisSchluessel(mit('f'))).toBe('wasStehtMirZu.sozBewilligungF');
    for (const p of ['n', 's', 'g', 'swiss']) expect(sozHinweisSchluessel(mit(p))).toBe(null);
    expect(sozHinweisSchluessel(mit('', 'swiss'))).toBe(null);
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
    expect(quelle('AnspruchCheck.jsx')).toMatch(/b\.key === 'soz'\) && sozHinweisSchluessel\(probe\) && hinweis\('soz-bewilligung'/);
    expect(quelle('components/Leistungsliste.jsx')).toMatch(/sozHinweisSchluessel\(probe\) \? ' ' \+ t\(sozHinweisSchluessel\(probe\)\)/);
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

// ─── L3–L9 und Kleines: die Sätze am Volltext (Befund-Blatt, Tabelle «Inhalt») ───
const lz = de.lebenszustaende;
const alleSprachen = ['de', 'fr', 'it', 'en'];
describe('L3–L9: Voraussetzungen stehen im Text', () => {
  it('L3 Familien-EL: Wohnsitzdauer und Aufenthaltsstatus (GE, SO, VD, TI)', () => {
    for (const z of ['tiefesEinkommen', 'alleinerziehend']) {
      expect(lz[z].berechtigungen.familienEL.text.sie).toMatch(/Wohnsitzdauer im Kanton und vom Aufenthaltsstatus/);
    }
  });
  it('L4 EL: weitere Bedingungen (ELG Art. 4, 5, 9a)', () => {
    for (const z of ['beeintraechtigung', 'rentnerin', 'halbwaise']) expect(lz[z].berechtigungen.el.text).toMatch(/Vermögen, Aufenthaltsdauer/);
  });
  it('L5 Reka: Alleinerziehende, keine Anreise, keine KulturLegi, nur mit Kindern', async () => {
    const tx = lz.tiefesEinkommen.berechtigungen.rekaFerien.text;
    expect(tx).toMatch(/Alleinerziehende/);
    expect(tx).not.toMatch(/Alleinstehend|Anreise|KulturLegi/);
    const { LEBENSZUSTAENDE } = await import('../data/lebenszustaende.js');
    const reka = LEBENSZUSTAENDE.find((z) => z.key === 'tiefesEinkommen').berechtigungen.find((b) => b.key === 'rekaFerien');
    expect(reka.nurMitKindern).toBe(true);
  });
  it('L6 kein Versprechen: «zustehen könnte»', () => {
    expect(de.onboarding.needsSubtitle.sie).toMatch(/was Ihnen zustehen könnte/);
    expect(de.anspruchCheck.resultEmptyIncome.sie).toMatch(/was zustehen könnte/);
  });
  it('L8 kein «sicher» bei der Ablage', () => {
    expect(de.guidedStart.documents).not.toMatch(/sicher/i);
    expect(de.nav.sub.tresor).not.toMatch(/sicher/i);
  });
  it('L9 AHV-Mindestbeitrag nur bis 25 (AHVG Art. 10 Abs. 2 Bst. a)', () => {
    expect(lz.inAusbildung.berechtigungen.ahv.text).toMatch(/bis Ende des Jahres, in dem sie 25 werden/);
  });
  it('die Sätze gibt es in fr, it, en ebenso (keine Lücke)', async () => {
    for (const l of alleSprachen) {
      const m = (await import(`../i18n/${l}.js`)).default;
      expect(typeof m.wasStehtMirZu.sozBewilligung === 'string' ? m.wasStehtMirZu.sozBewilligung : m.wasStehtMirZu.sozBewilligung.sie).toMatch(/(Pass|passeport|passaporto|passport)/);
      expect(JSON.stringify(m.lebenszustaende.inAusbildung.berechtigungen.ahv.text)).toMatch(/25/);
    }
  });
});

describe('Kleines', () => {
  it('SERAFE: auf Gesuch, höchstens fünf Jahre zurück (RTVG Art. 69b)', () => {
    for (const z of ['beeintraechtigung', 'rentnerin']) expect(lz[z].berechtigungen.serafe.text).toMatch(/höchstens fünf Jahre vor dem Gesuch/);
  });
  it('Halbwaise: Frage wie die Karte — unter 18, in Ausbildung unter 25', () => {
    expect(lz.halbwaise.frage.sie).toMatch(/unter 18, oder in Ausbildung unter 25/);
  });
  it('Quellensteuer: «endgültig» mit QStV Art. 10 Abs. 1', () => {
    expect(lz.frischZugezogen.berechtigungen.quellensteuer.text).toMatch(/endgültig \(QStV Art\. 10 Abs\. 1\)/);
  });
  it('Obstgarten: es sind drei Bäumchen, die später kommen', () => {
    expect(de.obstgarten.legend).toMatch(/drei jüngsten/);
  });
  it('Mutterschaftsbeihilfe nur mit einem Kind unter zwei Jahren oder unbekanntem Alter', async () => {
    const { kleinkindUnterZweiJahren } = await import('../data/familienEL.js');
    const heute = new Date(2026, 10, 11);
    expect(kleinkindUnterZweiJahren([{ birthDate: '2026-03-01' }], heute)).toBe(true);
    expect(kleinkindUnterZweiJahren([{ birthDate: '2025-02-01' }], heute)).toBe(true); // GR: bis 15 Monate
    expect(kleinkindUnterZweiJahren([{ birthDate: '2020-03-01' }], heute)).toBe(false);
    expect(kleinkindUnterZweiJahren([{ age: 0 }], heute)).toBe(true);
    expect(kleinkindUnterZweiJahren([], heute)).toBe(true);
    expect(quelle('Lebenssituationen.jsx')).toMatch(/!b\.mutterschaftsbeihilfe \|\| kleinkindUnterZweiJahren\(/);
  });
  it('«Stand» der Lebenslagen ist nicht älter als das laufende Jahr (rot ab 1.1.2027 ohne Durchgang)', async () => {
    const { LEBENSZUSTAENDE } = await import('../data/lebenszustaende.js');
    const jahr = new Date().getFullYear();
    for (const z of LEBENSZUSTAENDE) for (const b of z.berechtigungen) expect(Number(b.stand), z.key + '.' + b.key).toBeGreaterThanOrEqual(jahr);
  });
});

describe('Sprache S1–S7 (nur Schlüssel der Gruppe-A-Seiten)', () => {
  it('S1 der Rundgang nennt die Seite wie die Seite, in allen Sprachen', async () => {
    for (const l of alleSprachen) {
      const m = (await import(`../i18n/${l}.js`)).default;
      expect(m.tour.anspruch.title).toBe(m.dashboard.anspruchTitle);
    }
  });
  it('S2 Italienisch: kein du-Befehl in Knöpfen ohne Sie/du-Paar', async () => {
    const it_ = (await import('../i18n/it.js')).default;
    for (const v of [it_.dashboard.nextUpWeiter, it_.dashboard.quickCheckMore, it_.nav.zurueckZu, it_.onboarding.skipForNow, it_.tour.skip]) {
      expect(v).not.toMatch(/^(Continua|Vai|Torna|Salta)\b/);
    }
  });
  it('S4 kein Druck: «Jeder zu späte Tag», «erspart später Ärger», «Erinnerung(en)» sind weg', () => {
    const s = JSON.stringify([lz, de.overdue]);
    expect(s).not.toMatch(/Jeder zu späte Tag|erspart später Ärger|Spielraum am grössten|Erinnerung\(en\)/);
  });
  it('S7 Schweizer Anführungszeichen in der Suche', () => {
    expect(de.search.empty.sie).toContain('«{query}»');
  });
});

describe('Gestaltung D: eine Ebene nach der anderen auf dem ersten Bildschirm', () => {
  it('die Startbildschirm-Karte erscheint nicht, solange der Rundgang offen ist', () => {
    expect(quelle('main.jsx')).toMatch(/installKarte: !tourOpen && \(\(klein\) =>/);
  });
  it('«Frühe Version» ist eine ruhige Zeile, keine Karte (kein Grund, kein Rand, kein Schatten)', () => {
    const s = quelle('Dashboard.jsx');
    const banner = s.slice(s.indexOf('const AlphaBanner'), s.indexOf("'data-alpha-banner': true") + 300);
    expect(banner).not.toMatch(/background: palette\.up|boxShadow|border: '1px solid/);
  });
});
