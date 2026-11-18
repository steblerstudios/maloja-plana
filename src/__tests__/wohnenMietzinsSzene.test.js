// Mietzinsbeiträge als Szene (Stebler Studios 11.11.2026: «Ja, so bauen»): im Drittel-Haus der mögliche Beitrag
// gestrichelt in der Behörden-Farbe (bis zu), daneben das Glas (Pegel, Lesart IPV: Einkommen gegen Grenze), ein
// Schild «möglich», darunter die Kachelkarte der 26 Kantone. Eine Rechnung: mietzinsEinschaetzung (Werkzeug und Kapitel).
// Seit 18.11.2026 (Bauplan Wohnen): das Glas ist die Tür des Vergleichshauses (data-fass), das Schild der Wegweiser in
// der Strasse; die Kantonskarte steht im Kapitel offen oder unter «Mehr dazu», im Werkzeug immer offen.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mietzinsEinschaetzung, beitragHoechstMonat, KACHELKARTE_LAGE } from '../data/mietzinsbeitraege.js';
import { mietzinsPegelState, PEGEL_SCALE } from '../data/pegel.js';
import { WohnenZuhause, WohnenWerkzeug, DrittelHaus } from '../bereiche/wohnen/wohnen.js';
import { bereichFillColor } from '../data/lebensbereiche.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';

const t = createT({ de }, 'de', 'sie');
const profil = (canton, lohn = 3000, wohnen = {}) => ({
  basis: { canton, maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: String(lohn), incomeType: 'netto' },
  wohnen: { rentAmount: '1500', utilities: '200', rooms: '3', ...wohnen },
});
// Überholt 18.11.2026 (Bauplan Wohnen): die eigene «MietzinsSzene» (Glas, Reihe, zweites Haus) gibt es nicht mehr. Frage C
// steht in der Strasse: das Fass ist die Tür des Vergleichshauses, der Wegweiser steht daneben. Geprüft wird darum an den
// zwei Orten selbst: Kapitel (WohnenZuhause, gross, Wegweiser ins Werkzeug) und Werkzeug (WohnenWerkzeug, mittel).
const szene = (d, p = {}) => renderToStaticMarkup(React.createElement(WohnenWerkzeug, { palette: LIGHT_PALETTE, t, data: d, isDarkMode: false, kanton: d.basis.canton, ...p }));
const kapitel = (d, p = {}) => renderToStaticMarkup(React.createElement(WohnenZuhause, { palette: LIGHT_PALETTE, t, wohnen: d.wohnen, allData: d, isDarkMode: false, ...p }));
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

describe('eine Rechnung', () => {
  it('Kapitel und Werkzeug rufen mietzinsEinschaetzung', () => {
    expect(quelle('../MietzinsOrientierung.jsx')).toMatch(/= mietzinsEinschaetzung\(data, canton\);/);
    const rechnung = quelle('../bereiche/wohnen/rechnung.js');
    expect(rechnung).toMatch(/const e = mietzinsEinschaetzung\(data, kanton\);/);
    expect(rechnung).toMatch(/beitragHoechstMonat\(mietzinsEinschaetzung\(data, kanton\), data\?\.wohnen\?\.rooms\)/);
  });
  it('Frage C steht im Kapitel Wohnen (Beitrag im grossen Haus) und im Werkzeug «Mietzins» (mittel, mit Haus)', () => {
    const z = quelle('../bereiche/wohnen/zuhause.jsx');
    expect(z).toMatch(/beitrag: r\.beitrag \? \{ \.\.\.r\.beitrag, farbe: behoerden \} : null/);
    expect(z).toMatch(/h\(WohnenStrasse, \{ palette, t, r, ml, hilfe, groesse: 'gross', isDarkMode, onNavigate, ausprobiert \}\)/);
    expect(quelle('../MietzinsOrientierung.jsx')).toMatch(/React\.createElement\(WohnenWerkzeug, \{ palette, t, data, isDarkMode, kanton: canton \}\)/);
  });
  it('die Einschätzung: unter der Grenze «likely», darüber «incomeHigh», ohne Programm keine', () => {
    expect(mietzinsEinschaetzung(profil('ZG', 3000, { wfgWohnung: 'ja' }), 'ZG').assessment.key).toBe('likely');
    expect(mietzinsEinschaetzung(profil('ZG', 9000, { wfgWohnung: 'ja' }), 'ZG').assessment.key).toBe('incomeHigh');
    expect(mietzinsEinschaetzung(profil('ZH'), 'ZH').assessment).toBeNull();
  });
});

describe('Fass (seit 18.11.2026 die Tür, bis dahin das Glas): dieselbe Form wie die IPV (Pegel, Lesart «Luft»)', () => {
  it('Wasser = Einkommen, Linie = Grenze; vier Zustände', () => {
    expect(mietzinsPegelState({ annualIncome: 30000, incomeLimit: 60000 })).toMatchObject({ show: true, variant: 'luft', mode: 'clear', fraction: 0.5 });
    expect(mietzinsPegelState({ annualIncome: 55000, incomeLimit: 60000 }).mode).toBe('edge');
    expect(mietzinsPegelState({ annualIncome: 90000, incomeLimit: 60000 })).toMatchObject({ mode: 'over', fraction: PEGEL_SCALE });
    expect(mietzinsPegelState({ annualIncome: 0, incomeLimit: 60000 }).mode).toBe('empty');
    expect(mietzinsPegelState({ annualIncome: 30000, incomeLimit: null })).toBeNull();
  });
});

describe('Szene je Zustand', () => {
  it('Programm, unter der Grenze (ZG): Fass in der Tür und Wegweiser', () => {
    const h = szene(profil('ZG', 3000, { wfgWohnung: 'ja' }));
    expect(h).toContain('data-fass="ja"');
    expect(h).toContain('data-teil="mietzins-cta"');
    expect(h).toContain('data-teil="kachelkarte"');
  });
  it('Programm, über der Grenze: Fass ohne Wegweiser', () => {
    const h = szene(profil('ZG', 9000, { wfgWohnung: 'ja' }));
    expect(h).toContain('data-fass="ja"');
    expect(h).not.toContain('data-teil="mietzins-cta"');
  });
  it('Kanton unklar: schlichte Tür, kein Wegweiser, im Kapitel der Satz «bitte prüfen», die Karte bleibt', () => {
    const h = szene(profil('ZH'));
    expect(h).toContain('data-fass="nein"');
    expect(h).not.toContain('tuer-fuellung');
    expect(h).not.toContain('data-teil="mietzins-cta"');
    expect(h).toContain('data-teil="kachelkarte"');
    expect(kapitel(profil('ZH'))).toContain(t('mietzins.check').slice(0, 30));
  });
  it('ohne Kanton: keine Tür, kein Wegweiser, keine Karte', () => {
    const h = szene(profil(''));
    expect(h).not.toContain('data-teil="tuer"');
    expect(h).not.toContain('data-teil="mietzins-cta"');
    expect(h).not.toContain('data-teil="kachelkarte"');
  });
});

describe('Stebler Studios 11.11.2026: Häuser, grau, Knopf', () => {
  it('jeder Kanton ist ein kleines Haus', () => {
    expect((szene(profil('ZH')).match(/data-form="haus"/g) || []).length).toBe(26);
  });
  it('das Fass in der Tür ist grau gefüllt (Behörden-Zwetschge), nicht Salbei', () => {
    const h = szene(profil('ZG', 3000, { wfgWohnung: 'ja' }));
    const tuer = h.slice(h.indexOf('data-teil="tuer"'), h.indexOf('</g>', h.indexOf('data-teil="tuer"')));
    expect(tuer).toContain('data-teil="tuer-fuellung"');
    expect(tuer).toContain('fill="' + bereichFillColor('behoerden', false) + '"');
    expect(tuer).not.toContain('fill="' + LIGHT_PALETTE.sage + '"');
  });
  it('«möglich» ist ein Knopf mit Zeichen: im Kapitel ins Werkzeug «Mietzins», im Werkzeug zur kantonalen Stelle', () => {
    const ziele = [];
    const k = kapitel(profil('ZG', 3000, { wfgWohnung: 'ja' }), { onNavigate: (v) => ziele.push(v) });
    expect(k).toMatch(/<button type="button" data-teil="mietzins-cta"/);
    expect(k).toContain('aria-label="' + t('mietzinsSzene.cta') + '"');
    expect(k).toMatch(/data-teil="mietzins-cta"[^>]*><svg aria-hidden="true"[^>]*><path d="M0 0H92L100 22L92 44H0Z"/); // das Pfeil-Schild
    expect(k).toMatch(/<span aria-hidden="true" role="img"[^>]*><svg/); // das Zeichen ist wirklich da
    expect(k).toContain('data-teil="mietzins-wegweiser"');
    // rechts neben dem Vergleichshaus mit dem Fass, in derselben Strasse
    const s0 = k.slice(k.indexOf('data-teil="wohnen-strasse"'));
    expect(s0.indexOf('data-fass="ja"')).toBeGreaterThan(-1);
    expect(s0.indexOf('data-fass="ja"')).toBeLessThan(s0.indexOf('mietzins-wegweiser'));
    const werkzeug = szene(profil('ZG', 3000, { wfgWohnung: 'ja' }));
    expect(werkzeug).toContain('aria-label="' + t('mietzinsSzene.ctaStelle') + '"');
    expect(werkzeug).toMatch(/<a [^>]*href="https:\/\/zg\.ch[^"]*"[^>]*data-teil="mietzins-cta"|<a [^>]*data-teil="mietzins-cta"[^>]*href="https:\/\/zg\.ch/);
    expect(quelle('../bereiche/wohnen/bilder.jsx')).toMatch(/onClick: \(\) => onNavigate\('mietzins'\)/);
  });
});

describe('Wegweiser kurz in der Strasse', () => {
  it('«möglich ›» sichtbar, der ganze Satz im Vorlesetext', async () => {
    const { MoeglichKnopf } = await import('../bereiche/wohnen/wohnen.js');
    const h = renderToStaticMarkup(React.createElement(MoeglichKnopf, { palette: LIGHT_PALETTE, t, onNavigate: () => {}, kurz: true }));
    expect(h).toContain('aria-label="' + t('mietzinsSzene.cta') + '"');
    expect(h).toContain(t('mietzinsSzene.ctaKurz') + ' ›');
  });
});

describe('Kachelkarte', () => {
  it('26 Kantone, je einmal', () => {
    const k = Object.keys(KACHELKARTE_LAGE);
    expect(k).toHaveLength(26);
    expect(new Set(Object.values(KACHELKARTE_LAGE).map(([r, c]) => r + ':' + c)).size).toBe(26);
  });
  it('gefüllt = Programm bekannt (4), Ihr Kanton mit dickem Rand, Vorlesetext nennt beides', () => {
    const h = szene(profil('ZH'));
    expect((h.match(/data-kanton="[A-Z]{2}" data-programm="ja"/g) || []).length).toBe(4);
    expect(h).toMatch(/data-kanton="ZH" data-programm="nein" data-ihr="ja"/);
    expect(h).toMatch(/aria-label="[^"]*BS[^"]*ZH/);
  });
});

describe('Haus: der Beitrag gestrichelt in der Behörden-Farbe, als «bis zu»', () => {
  const zwetschge = bereichFillColor('behoerden', false);
  it('Höchstbetrag je Monat: BS nach Merkblatt Ziff. 7/11/13 als Obergrenze, sonst keiner', () => {
    const bs = (zimmer) => beitragHoechstMonat(mietzinsEinschaetzung(profil('BS', 3000, { rooms: zimmer }), 'BS'), zimmer);
    expect(bs('3')).toBe(1060);       // 0.85 · (1660 − 600) · 51'750/36'000 = 1295 → Deckel 1'060
    expect(bs('2')).toBe(929);        // 0.85 · (1260 − 500) · 1.4375 — Einzelperson erreicht 1'060 nie
    expect(bs('1')).toBe(684);
    expect(bs('')).toBeNull();        // ohne Zimmerzahl keine Zahl
    expect(beitragHoechstMonat(mietzinsEinschaetzung(profil('BS', 9000), 'BS'), '3')).toBeNull(); // über der Grenze
    expect(beitragHoechstMonat(mietzinsEinschaetzung(profil('ZG', 3000, { wfgWohnung: 'ja' }), 'ZG'), '3')).toBeNull();
    expect(beitragHoechstMonat(mietzinsEinschaetzung(profil('GE'), 'GE'), '3')).toBeNull(); // Jahreswert, keine Grenze
    expect(beitragHoechstMonat(mietzinsEinschaetzung(profil('ZH'), 'ZH'), '3')).toBeNull();
  });
  it('oben in der Füllung, Höhe = min(Beitrag, Wohnkosten) ÷ Einkommen', () => {
    const h = renderToStaticMarkup(React.createElement(DrittelHaus, { palette: LIGHT_PALETTE, anteil: 40, ueberDrittel: true, fuell: '#7a5', groesse: 'gross', beitrag: { anteil: 20, farbe: zwetschge } }));
    const b = h.match(/<rect[^>]*data-teil="drittel-haus-beitrag"[^>]*>/)[0];
    expect(b).toContain('stroke="' + zwetschge + '"');
    expect(b).toMatch(/stroke-dasharray="4 3"/);
    expect(b).toMatch(/y="([\d.]+)"/);
    expect(Number(b.match(/ y="([\d.]+)"/)[1])).toBeCloseTo(44 + 72 * 0.6, 6);   // Oberkante der Füllung (40 %)
    expect(Number(b.match(/height="([\d.]+)"/)[1])).toBeCloseTo(72 * 0.2, 6);     // 20 % des Einkommens
  });
  it('klein ohne Beitrag', () => {
    const h = renderToStaticMarkup(React.createElement(DrittelHaus, { palette: LIGHT_PALETTE, anteil: 40, ueberDrittel: true, fuell: '#7a5', groesse: 'klein', beitrag: { anteil: 20, farbe: zwetschge } }));
    expect(h).not.toContain('drittel-haus-beitrag');
  });
  it('BS, unter der Grenze: Kapitel und Werkzeug zeigen den Beitrag, die Legende sagt «bis zu»', () => {
    const d = profil('BS');
    expect(kapitel(d)).toContain('data-teil="drittel-haus-beitrag"');
    const h = szene(d);
    expect(h).toContain('data-teil="drittel-haus-beitrag"');
    expect(h).toContain(t('mietzinsSzene.beitragLegende', { betrag: '1’060' }).slice(0, 20));
  });
});
